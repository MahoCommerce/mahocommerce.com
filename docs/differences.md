# Differences with previous platforms

Maho is built on the M1 platform, specifically:

- Magento 1 (2008 - 2020)
- OpenMage, fork of Magento 1 (2019 - present)
- Maho, fork of unreleased OpenMage v21 (2024 - present)

Differences between Maho and Magento 1 because are documented in
[OpenMage's readme](https://github.com/openmage/magento-lts/?tab=readme-ov-file#between-magento-1945-and-openmage-19x){:target="_blank"}.

## Differences between Maho and OpenMage

![Structure of a basic Maho project](/assets/basic-project-structure.png){ width=200 loading=lazy align=left }

### Project structure

The first task we wanted to develop was a complete overhaul of the store's project structure, without the need for the
original M1 composer plugin to copy (and duplicate) all the files from the core to the project's root directory.

This allows for a modern and lean project structure, like any other PHP based project you can work on since quite
some years.

**In this picture you see a basic Maho project right after installation.** Pretty clean right?

Whatever is in your local project overrides whatever is in composer-installed modules, which override Maho's core.

<div style="clear: both"></div>

### Built-in command line tool

With previous M1 based project you had some basic scripts in the `shell/` directory but everybody was relying on
[MageRun](https://magerun.net/){:target="_blank"} for anything slightly more advanced.

To know more, check the [complete documentation of Maho's CLI tool](cli-tool.md).

### Complete control of the toolchain

We think that having core components of the toolchain that are unmaintained and/or owned by a 3rd party is a
problem for a quick and effective development of the whole platform.

This is why, at Maho, we decided to maintain internally both the [CLI tool](cli-tool.md), the
[composer plugin](https://github.com/MahoCommerce/maho-composer-plugin){:target="_blank"} and the
[PHPStan plugin](https://github.com/MahoCommerce/maho-phpstan-plugin){:target="_blank"}.

### Legacy backend theme

The legacy theme for the backend (the one we all know from Magento1) is deprecated and not selectable anymore,
every Maho project will have the modern theme for the backend.

### Other differences

There are many more minor differences, it's difficult to list them all, please refer to our changelog and our release
notes for a complete list release-by-release.
