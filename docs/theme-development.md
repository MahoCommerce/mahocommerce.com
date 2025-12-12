# Theme Development Guide

This guide explains the best way to develop a theme following Maho's philosophy: keep things simple and maintain upgradability. Rather than copying and modifying entire stylesheets or templates, you'll learn how to achieve your desired look with minimal overrides, ensuring your store can receive Maho updates without conflicts.

## The Upgradability Principle

Maho allows you to override any file from the core: templates (`.phtml`), JavaScript, CSS, images, and layout XML. The fallback system will automatically use your custom file instead of the core version.

!!! info "How it works"
    The [Maho Composer Plugin](composer-plugin.md) does all the heavy lifting, keeping core files in the vendor directory while your project folder contains only your customizations.

**However, every file you override creates a maintenance burden.**

When Maho releases updates with bug fixes, security patches, or new features, your overridden files won't benefit from these improvements. You'll need to manually review and merge changes, and the more files you override, the more work each upgrade requires.

**The golden rule: override as little as possible.**

## Customization Tiers

We recommend approaching theme customization in tiers, starting with the least invasive method:

| Tier | Method | Upgradability Impact |
|------|--------|---------------------|
| 1 | CSS Variables only | None |
| 2 | Additional CSS rules | None |
| 3 | Layout XML via `local.xml` | Minimal |
| 4 | Template overrides | High - avoid when possible |

Most visual customizations can be achieved with Tier 1 and 2 alone.

## Setting Up Your Theme

The easiest way to create a new theme is with the CLI command:

```bash
./maho frontend:theme:create
```

!!! info "Availability"
    The `frontend:theme:create` command is available since Maho 26.1.

This interactive command will prompt you for the package name, theme name, and parent theme, then generate the complete directory structure with properly configured files.

You can also use non-interactive mode:

```bash
./maho frontend:theme:create -p acmestore -t default
```

!!! tip "Why use 'default' as your main theme?"
    Within the same package, any theme automatically falls back to `default`. This means if you later create `acmestore/holiday`, it will inherit from `acmestore/default` without extra configuration. If you named your main theme something else (like `acmestore/main`), sub-themes would skip it and fall back directly to `base/default` unless you explicitly set the parent in `theme.xml`.

### Generated Structure

The command creates the following structure:

```
app/design/frontend/
└── acmestore/
    └── default/
        ├── etc/
        │   └── theme.xml
        └── layout/
            └── local.xml

public/skin/frontend/
└── acmestore/
    └── default/
        └── css/
            └── default.css
```

!!! tip "CSS file naming"
    The CSS file is named after your theme (e.g., `default.css`, `holiday.css`) rather than a generic name like `custom.css`. This prevents accidental collisions with core CSS files like `checkout.css` or `widgets.css`.

The generated `local.xml` already includes the CSS registration, and the CSS file contains helpful comments with the available variables to customize.

### Activate Your Theme

In the Maho Admin, go to **System → Configuration → Design** and set:

- **Package → Current Package Name**: `acmestore`
- **Themes → Default**: `default`

## Tier 1: CSS Variables

Maho's base theme uses CSS custom properties (variables) for colors and design tokens. You can completely change the look of your store by simply redefining these variables.

See the [complete list of available CSS variables](https://github.com/MahoCommerce/maho/blob/main/public/skin/frontend/base/default/css/styles.css) in the base theme (look for the `:root` block at the top).

**Example `default.css`:**

```css
:root {
    /* Brand colors */
    --maho-color-primary: #e91e63;
    --maho-color-primary-hover: #f06292;
    --maho-color-primary-active: #c2185b;
    --maho-color-primary-dark: #880e4f;

    /* Adjust other colors to match your brand */
    --maho-color-price: #e91e63;
    --maho-color-special-price: #c2185b;
}
```

With just these few lines, buttons, links, prices, and interactive elements throughout the entire store will use your brand colors.

## Tier 2: Additional CSS Rules

When CSS variables aren't enough, add your own CSS rules that target existing elements. Your stylesheet loads after the core CSS, so your rules take precedence.

```css
/* Custom header height */
.header {
    padding: 20px 0;
}

/* Custom product card styling */
.product-item {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Custom button styles */
.btn-cart {
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
```

**Tips:**

- Use browser DevTools to identify the selectors you need to target
- Be as specific as necessary, but avoid `!important` when possible
- Group related customizations with comments for maintainability

## Tier 3: Layout XML Changes

Use `local.xml` to modify page structure without touching core layout files. You can:

- Add or remove blocks
- Change block templates
- Reorder elements
- Add page-specific assets

!!! warning "Try to avoid copying layout files"
    Try to avoid as much as possible copying layout XML files (like `catalog.xml` or `checkout.xml`) from the core theme into your theme. These files are large and complex, and when it's time to upgrade you won't remember what changes you made. Put all your layout changes in `local.xml` instead.

**Example: Add CSS only on product pages**

```xml
<?xml version="1.0"?>
<layout>
    <catalog_product_view>
        <reference name="head">
            <action method="addCss">
                <stylesheet>css/product-page.css</stylesheet>
            </action>
        </reference>
    </catalog_product_view>
</layout>
```

**Example: Remove a block**

```xml
<default>
    <reference name="right">
        <action method="unsetChild">
            <name>catalog.compare.sidebar</name>
        </action>
    </reference>
</default>
```

**Example: Change a template**

```xml
<default>
    <reference name="header">
        <action method="setTemplate">
            <template>page/html/header-custom.phtml</template>
        </action>
    </reference>
</default>
```

Note: If you change a template path, you'll need to create that template file in your theme, which moves you into Tier 4.

## Tier 4: Template Overrides

When you absolutely must modify HTML structure, copy the template to your theme directory maintaining the same path:

**Core file:**
```
app/design/frontend/base/default/template/catalog/product/view.phtml
```

**Your override:**
```
app/design/frontend/acmestore/default/template/catalog/product/view.phtml
```

**Guidelines for template overrides:**

1. **Copy, don't start from scratch** - Always copy the original file and modify it
2. **Make minimal changes** - Only change what you need; keep the rest intact
3. **Document your changes** - Add comments explaining what you modified and why
4. **Track upstream changes** - When upgrading Maho, review changes to files you've overridden

## Creating Sub-themes

For stores that need theme variations, you can create sub-themes within your package. Sub-themes inherit from your main theme, allowing you to maintain a base set of customizations while adding variations on top.

### Use Cases

- **Seasonal themes**: Base theme for everyday use, sub-themes for holidays or special promotions
- **A/B testing**: Test different designs while sharing core customizations
- **Multi-store setup**: Shared functionality in base theme, store-specific branding in sub-themes

### Package Structure

```
app/design/frontend/
└── acmestore/
    ├── default/              # Main store theme
    │   ├── etc/
    │   │   └── theme.xml
    │   └── layout/
    │       └── local.xml
    │
    ├── holiday/              # Holiday variation (auto-inherits from default)
    │   ├── etc/
    │   │   └── theme.xml
    │   └── layout/
    │       └── local.xml
    │
    └── premium/              # Premium brand variation (auto-inherits from default)
        ├── etc/
        │   └── theme.xml
        └── layout/
            └── local.xml

public/skin/frontend/
└── acmestore/
    ├── default/
    │   └── css/
    │       └── default.css   # Main store styles
    │
    ├── holiday/
    │   └── css/
    │       └── holiday.css   # Holiday colors and decorations
    │
    └── premium/
        └── css/
            └── premium.css   # Premium brand styling
```

### Understanding theme.xml

The `frontend:theme:create` command always generates a `theme.xml` file that explicitly declares the parent theme. While Maho can auto-inherit from `default` within the same package, having an explicit `theme.xml` makes the inheritance chain clear and is the recommended practice.

The only time you need to manually edit `theme.xml` is when a sub-theme should inherit from another sub-theme instead of `default`. For example, if `holiday-vip` should inherit from `holiday`:

```xml
<?xml version="1.0"?>
<theme>
    <parent>acmestore/holiday</parent>
</theme>
```

### Inheritance Chain

When using the `holiday` sub-theme, Maho looks for files in this order:

1. `acmestore/holiday` (sub-theme)
2. `acmestore/default` (main theme)
3. `base/default` (Maho core)

This means:

- Core Maho updates flow through automatically
- Your main theme customizations apply to all sub-themes
- Sub-theme-specific changes only exist where needed

### Sub-theme CSS Strategy

In a sub-theme, you typically only need to override CSS variables:

**`public/skin/frontend/acmestore/holiday/css/holiday.css`:**

```css
:root {
    /* Holiday colors */
    --maho-color-primary: #c62828;
    --maho-color-primary-hover: #e53935;
    --maho-color-primary-active: #b71c1c;
    --maho-color-background-alt: #fff8e1;
}

/* Add seasonal decorations */
.header {
    background-image: url('../images/snowflakes.png');
}
```

The main theme styles from `acmestore/default` still load because of the inheritance chain, and the sub-theme's CSS adds the seasonal touch.

## Summary

1. **Start with CSS variables** - Most branding can be achieved this way
2. **Add CSS rules** when variables aren't enough
3. **Use `local.xml`** for layout changes
4. **Override templates** only as a last resort
5. **Consider sub-themes** for seasonal or multi-store variations

Following this approach keeps your themes lean, maintainable, and easy to upgrade.
