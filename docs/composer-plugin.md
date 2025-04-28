# Maho Composer Plugin

## Overview

The `maho-composer-plugin` is a critical component of the Maho Commerce ecosystem, providing essential functionality for managing project structure, autoloading, and asset handling in Maho-based applications. This plugin enables a modern, lean project structure that differentiates Maho from previous M1-based platforms.

- **Autoloading Support** Enables full composer autoloading for the entire platform
- **Lean Project Structure**: Eliminates the need for core files in your project root
- **Asset Management**: Automatically copies necessary assets to the correct locations
- **Modman Support**: Handles modules with custom file system structures
- **Optimized Performance**: Builds paths during composer dump to avoid filesystem lookups in production
- **High Code Quality**: Passes PHPStan at level 10 with strict rules
- **Easier Maintenance**: Clearer separation between your custom code and platform code

### Differences from Previous Platforms

This plugin represents a significant architectural improvement over the original M1 composer plugin:

- **No Duplication**: The original plugin copied and duplicated files from core to the project's root directory
- **Modern Structure**: Enables a lean project structure like modern PHP projects
- **Complete Control**: Maho maintains this plugin internally for quick and effective platform development
- **Simplified Bootstrapping**: Gone are the days of hyper-complicated bootstrapping when creating a script

## DeepWiki complete repo documentation

Maho's composer plugin has been processed for complete repository AI-based documentation by DeepWiki, and it's available at
[https://deepwiki.com/MahoCommerce/maho-composer-plugin](https://deepwiki.com/MahoCommerce/maho-composer-plugin){target=_blank}.

## Architecture

The plugin consists of three main components, each handling different aspects of the Maho project setup:

### 1. AutoloadPlugin

Manages the autoloading functionality, enabling Maho to use Composer's efficient autoloading mechanisms rather than legacy custom autoloaders. This eliminates the need for `Varien_Autoload` and other custom autoloading solutions from previous platforms.

### 2. FileCopyPlugin

Handles the copying of necessary assets and files from vendor packages to the correct locations in your project structure, ensuring everything is in place without duplicating the entire codebase.

### 3. ModmanPlugin

Provides support for modules that use the Modman configuration format, allowing modules with custom file system structures to be properly integrated.

## Installation

The plugin is automatically included when you create a Maho project.

## APIs

### Getting Installed Packages

```php
use Maho\ComposerPlugin\AutoloadRuntime;

$packages = AutoloadRuntime::getInstalledPackages();
// Returns all installed packages, including the root package
```

#### Finding Files Across Packages

```php
use Maho\ComposerPlugin\AutoloadRuntime;

$files = AutoloadRuntime::globPackages('etc/config.xml');
// Finds all config.xml files in the etc directories across all packages
```

## Optimizing the Autoloader

For production environments, you should optimize the autoloader:

```bash
composer dump -o
```

Or set it in your composer configuration:

```bash
composer config optimize-autoloader true
```

## Troubleshooting

### Class Conflicts

When using the optimized autoloader in developer mode, a warning message will be displayed in the admin panel if class conflicts are detected. This message will show which classes conflict and which one will be used.

### Case Sensitivity

Class names are now case-sensitive. For example, `mage_core_model_abstract` no longer works as a substitute for the properly cased class name.

## License

The Maho Composer Plugin is licensed under the MIT License.

## Further Reading

- [Autoloaders Documentation](autoloaders.md)
- [Implementation PR in Maho's repo](https://github.com/MahoCommerce/maho/pull/63){target=_blank}
- [Maho Composer Plugin GitHub Repository](https://github.com/MahoCommerce/maho-composer-plugin){target=_blank}
