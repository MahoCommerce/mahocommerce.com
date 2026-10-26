"""Add the documentation of the Maho repository to the site.

The pages of the user guide, the developer docs, the API docs and the hosting docs live in the
Maho repository, next to the code that they describe:

- docs/<folder>/ at the root, for a page that no single module owns
- app/code/core/<Vendor>/<Module>/<path>/ for a page of one module, where the config.xml of the
  module declares <global><docs><audience>path</audience></docs></global>

A module page goes to the site folder of its audience (user to user-guide/, developer to
developer/, sysadmin to hosting/), so its URL does not show the module. Two pages with the same
URL stop the build.

A nav entry that names a .nav.yml file of Maho is replaced by the entries of that file. With a
title, the entries become a section. Without a title, they go in the list where the entry is.

MAHO_DOCS_SOURCE is the path of a Maho checkout to read, for a local preview of a docs change.
Without it, the hook clones MAHO_DOCS_REF (default: main) of the Maho repository into
.cache/maho.
"""

import os
import subprocess
import xml.etree.ElementTree as ET
from glob import glob

import yaml
from mkdocs.exceptions import PluginError
from mkdocs.plugins import event_priority
from mkdocs.structure.files import File

REPOSITORY = 'https://github.com/MahoCommerce/maho.git'
ROOT_FOLDERS = ['user-guide', 'developer', 'api', 'hosting']
AUDIENCE_FOLDERS = {'user': 'user-guide', 'developer': 'developer', 'sysadmin': 'hosting'}
SPARSE_PATHS = ['/docs/', '/app/code/core/*/*/docs/', '/app/code/core/*/*/etc/config.xml']

maho_dir = ''
maho_pages = {}


def source_dir(config):
    if os.environ.get('MAHO_DOCS_SOURCE'):
        return os.path.abspath(os.environ['MAHO_DOCS_SOURCE'])
    target = os.path.join(os.path.dirname(config.config_file_path), '.cache', 'maho')
    # mkdocs serve loads the config again for each rebuild. Clone only on the first load.
    if os.environ.get('MAHO_DOCS_CLONED') == target:
        return target
    ref = os.environ.get('MAHO_DOCS_REF', 'main')
    try:
        if not os.path.isdir(os.path.join(target, '.git')):
            subprocess.run(['git', 'clone', '--quiet', '--depth=1', '--filter=blob:none', '--sparse', '--no-checkout', REPOSITORY, target], check=True)
            subprocess.run(['git', '-C', target, 'sparse-checkout', 'set', '--no-cone', *SPARSE_PATHS], check=True)
        subprocess.run(['git', '-C', target, 'fetch', '--quiet', '--depth=1', 'origin', ref], check=True)
        subprocess.run(['git', '-C', target, 'checkout', '--quiet', '--force', '--detach', 'FETCH_HEAD'], check=True)
    except (OSError, subprocess.CalledProcessError) as error:
        raise PluginError(f'Cannot get the docs of Maho {ref}: {error}')
    os.environ['MAHO_DOCS_CLONED'] = target
    return target


def module_folders(maho):
    """Yield (site folder, module docs folder) for each folder that a core module declares."""
    for config_file in sorted(glob(os.path.join(maho, 'app/code/core/*/*/etc/config.xml'))):
        module_dir = os.path.dirname(os.path.dirname(config_file))
        docs = ET.parse(config_file).getroot().find('global/docs')
        for declaration in docs if docs is not None else []:
            if declaration.tag not in AUDIENCE_FOLDERS:
                raise PluginError(f'{config_file}: unknown docs audience <{declaration.tag}>')
            folder = os.path.join(module_dir, (declaration.text or '').strip().strip('/'))
            if not os.path.isdir(folder):
                raise PluginError(f'{config_file}: the docs folder {folder} does not exist')
            yield AUDIENCE_FOLDERS[declaration.tag], folder


def collect(maho):
    """Return {site path: file} for every page and image, and {site path: file} for the .nav.yml files."""
    folders = [(name, os.path.join(maho, 'docs', name)) for name in ROOT_FOLDERS]
    pages, navs = {}, {}
    for site_folder, folder in [*folders, *module_folders(maho)]:
        for directory, _, names in os.walk(folder):
            for name in names:
                path = os.path.join(directory, name)
                uri = os.path.join(site_folder, os.path.relpath(path, folder)).replace(os.sep, '/')
                if name == '.nav.yml':
                    navs[uri] = path
                elif name.startswith('.'):
                    continue
                elif uri in pages:
                    raise PluginError(f'Two Maho docs files have the URL {uri}: {pages[uri]} and {path}')
                else:
                    pages[uri] = path
    return pages, navs


def expand(items, navs, prefix=''):
    result = []
    for item in items:
        if isinstance(item, dict):
            (title, value), = item.items()
            if isinstance(value, list):
                result.append({title: expand(value, navs, prefix)})
            elif value.endswith('.nav.yml'):
                result.append({title: load_nav(prefix + value, navs)})
            else:
                result.append({title: value if '://' in value else prefix + value})
        elif item.endswith('.nav.yml'):
            result.extend(load_nav(prefix + item, navs))
        else:
            result.append(item if '://' in item else prefix + item)
    return result


def load_nav(uri, navs):
    if uri not in navs:
        raise PluginError(f'The nav names {uri}, which is not in the Maho docs')
    with open(navs[uri], encoding='utf-8') as file:
        items = yaml.safe_load(file)['nav']
    return expand(items, navs, uri[: -len('.nav.yml')])


@event_priority(100)
def on_config(config):
    global maho_dir, maho_pages
    maho_dir = source_dir(config)
    maho_pages, navs = collect(maho_dir)
    config['nav'] = expand(config['nav'], navs)
    return config


# Before the other plugins, so that the redirects and the blog see the Maho pages.
@event_priority(100)
def on_files(files, config):
    for uri, path in maho_pages.items():
        if files.get_file_from_path(uri) is not None:
            raise PluginError(f'{uri} is in this repository and in the Maho docs. Delete the copy in this repository.')
        files.append(File.generated(config, uri, abs_src_path=path))
    return files


def on_serve(server, config, builder):
    if os.environ.get('MAHO_DOCS_SOURCE'):
        server.watch(os.path.join(maho_dir, 'docs'))
        for config_file in glob(os.path.join(maho_dir, 'app/code/core/*/*/etc/config.xml')):
            module_docs = os.path.join(os.path.dirname(os.path.dirname(config_file)), 'docs')
            if os.path.isdir(module_docs):
                server.watch(module_docs)
    return server
