# Autoloaders

Maho is tightly built around composer, meaning that, in a Maho project, all the autoloading is done
by composer through [our composer plugin](composer-plugin.md).

This means:

- No `core` files in your project, Maho and all the modules live only in the `vendor` folder.
- No `Varien_Autoload` nor any other custom autoloading.

Characteristics of Maho's composer plugin:

- It lives in the `Maho\ComposerPlugin` namespace
- `AutoloadRuntime::getInstalledPackages()`, which also includes the root package (i.e. child project).
- `AutoloadRuntime::globPackages()` is a nice new function to find files by pattern in all maho / module packages.
- Builds paths during composer dump to avoid filesystem lookups in production.
- Modman support for modules that have a custom file system structure
- Passes PHPStan at level 10 with strict rules!
- License under MIT.

If you want to know more about the technical implementation, check the
[Maho Composer Plugin documentation](composer-plugin.md).

## Optimized autoloader

Enable with either `composer dump -o`, or `composer config optimize-autoloader true`.

A warning message is displayed in the admin panel if set to true and in developer mode.
One nice thing is that it will tell you which classes conflict, and which one it will be using:

<img src="https://github.com/user-attachments/assets/02672a48-ec04-4f3d-8658-4c9b83f22166">

It should definitely speed things up in production, you should enable it.

## Zend overrides

There are now no problems in overriding Zend, or any other class in `lib`.
Both myzend/override and zend/override work.

You also don't have to explicitly define PSR-0 classes in your composer.json or delete the vendor folder.
Just put the file in your module's or starter kit's lib folder and it will work.

## Breaking changes

1. Class names are case-sensitive now, i.e. mage_core_model_abstract doesn't work anymore.
2. `disable_local_modules` feature (in `local.xml`) was removed completely.