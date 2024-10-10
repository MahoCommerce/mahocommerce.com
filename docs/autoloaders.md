# Autoloaders

!!! info
    This doc applies to Maho 24.11 and above

Maho is built upon a completely new set of autoloading routines, completely different from everything
built in the M1 platform since its existence.

This allows Maho's projects to 

## `Varien_Autoload` no more

As the title says, Maho removed `Varien_Autoload` because it's not needed anymore.

## Building our paths with `\MahoAutoload::generatePaths()`

This is basically the same code we had to build the include paths that would have been used by `Varien_Autoload`.
One fix/improvement is that instead of: `mod_a/app/code/local`, `mod_a/app/code/community`, 
`mod_a/app/code/core`, `mod_b/app/code/local`, `mod_b/app/code/community`, `mod_b/app/code/core`.

We do all local, all community, all core, which seems more correct:
`mod_a/app/code/local`, `mod_b/app/code/local`, `mod_a/app/code/community`, `mod_b/app/code/community`,
`mod_a/app/code/core`, `mod_b/app/code/core`.

## Generating PSR-0 prefixes with `\MahoAutoload::generatePsr0()`

Using the paths from above, we let composer know these paths contain PSR-0 classes.
Since `Varien_Autoload` would have scanned those same paths in the same order and found the same files, 
there should be no breaking change.

However, it does save composer from having to look in every module's path for `Mage_` classes if we know 
there are none there.

## Composer `use-include-path`

Because we have generated all the PSR-0 prefixes, we have no need to let composer look in the include paths 
for files.

If it wasn't found in our PSR-0 scan, it wouldn't have been found by Composer.
We do still use `set_include_path()` in Mage.php so that modules can `include` or `require` files
that aren't PSR-0 compatible.

## Controller Classmaps

I believe the only type of file in Magento core that doesn't use PSR-0 classes are the controllers
(but not `Controller` which do). 
So, we also scan those files and add them directly to Composer's classmap definition.

This has two benefits: 

1. `Varien_Router` is faster because we don't have to loop all our paths to find the class.
2. We don't have to put `require` statements in controller classes that extend other controllers.
   Composer will find the class you're extending.

Regarding point 2, it doesn't break if you do have `require` statements in controller files,
they're just unnecessary, so we removed them from the core files.

The only possible problem would be is if a module includes a controller with a relative path like
`include './AbstractController.php'`, and another module overrides the abstract class.

## Optimized autoloader

Enable with either `composer dump -o`, or `composer config optimize-autoloader true`.

A warning message is displayed in the admin panel if set to true and in developer mode.
One nice thing is that it will tell you which classes conflict, and which one it will be using:

<img src="https://github.com/user-attachments/assets/02672a48-ec04-4f3d-8658-4c9b83f22166">

It should definitely speed things up in production, you should enable it.

## Zend overrides

There are now no caveats in overriding Zend, or any other class in `lib`.
Both myzend/override and zend/override work.  

You also don't have to explicitly define PSR-0 classes in your composer.json or delete the vendor folder.
Just put the file in your module's or starter kit's lib folder and it will work.

## Breaking changes

1. Class names are case-sensitive now, i.e. mage_core_model_abstract doesn't work anymore.
2. `disable_local_modules` feature (in `local.xml`) was removed completely.