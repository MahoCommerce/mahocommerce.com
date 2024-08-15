# Differences with previous platforms

Maho is built on the M1 platform, specifically:

- Magento 1 (2008 - 2020)
- OpenMage, fork of Magento 1 (2019 - present)
- Maho, fork of unreleased OpenMage v21 (2024 - present)

Differences between Maho and Magento 1 because are documented in
[OpenMage's readme](https://github.com/openmage/magento-lts/?tab=readme-ov-file#between-magento-1945-and-openmage-19x){:target="_blank"}.

## Differences between Maho and OpenMage

### Project structure



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
