"""Put the public numbers of the Maho project into the pages.

A page writes [[stats.issues.all_time.median_hours]] and the build puts the value of that key
of docs/assets/data/stats.json in its place. tools/stats.py writes the file. An unknown key
stops the build.
"""

import json
import os
import re

from mkdocs.exceptions import PluginError

PLACEHOLDER = re.compile(r"\[\[stats\.([a-z0-9_.]+)\]\]")
_stats = None


def on_config(config):
    global _stats
    path = os.path.join(config["docs_dir"], "assets", "data", "stats.json")
    with open(path) as file:
        _stats = json.load(file)


def _value(match, page):
    value = _stats
    for key in match.group(1).split("."):
        if not isinstance(value, dict) or key not in value:
            raise PluginError(f"{page.file.src_path}: unknown stats key {match.group(1)}")
        value = value[key]
    return f"{value:,}" if isinstance(value, int) else str(value)


def on_page_markdown(markdown, page, config, files):
    return PLACEHOLDER.sub(lambda match: _value(match, page), markdown)
