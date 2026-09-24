---
description: "Where Maho comes from and what changed: the Magento 1 e-commerce framework everybody loved is still here, and everything around it, the toolchain, the frontend, the admin, the APIs, has been rebuilt from the ground up."
---

# Origins and differences

Maho is a fork of OpenMage, which is a fork of Magento 1. That single fact explains both what Maho is and why it exists.

Magento 1 was two things at once:

- **An e-commerce framework that people loved.** A catalog that models any product, a module system that lets you change anything without touching the core, layouts, events, multi-store, and a sales flow that real shops have run on for over fifteen years.
- **A 2008 toolchain that nobody loved.** Zend Framework 1, PrototypeJS, ExtJS, a core copied into every project, and an admin that never changed.

**Maho keeps the first and rebuilt the second.** This page tells that story.

## Lineage

- Magento 1 (2008 - 2020)
- OpenMage, fork of Magento 1 (2019 - present)
- Maho, fork of the unreleased OpenMage v21 (2024 - present)

Maho keeps an active relationship with OpenMage. We continuously merge OpenMage's fixes and security patches into our core, while Maho follows its own direction. Differences between Magento 1 and OpenMage are documented in [OpenMage's readme](https://github.com/openmage/magento-lts/?tab=readme-ov-file#between-magento-1945-and-openmage-19x){:target="_blank"}.

## What Maho kept: the framework

The parts of Magento 1 that made it a great platform to build on are all still here, and they work the way you remember:

- **The module system.** Modules declare themselves in XML, and [the merged config](../developer/guide/config.md) drives the whole application. Rewrites, [event observers](../developer/observers.md) and [override configurations](../developer/override-configurations.md) let you change any behavior without editing the core.
- **Layouts, blocks and templates.** The [layout XML system](../developer/guide/layout-blocks-templates.md) still assembles every page, and child themes still override only what they need.
- **The ORM and collections.** [Models, resources and collections](../developer/guide/models-and-orm.md), the [EAV catalog](../developer/guide/advanced-orm.md), and the attribute sets, configurable, bundle, grouped and downloadable [product types](../user-guide/product-types.md).
- **The store model.** Websites, stores and store views, scoped configuration, customer groups, tax, promotions, the checkout and the full order lifecycle: invoice, shipment, credit memo.
- **Your existing code.** Modules written for Magento 1 and OpenMage still run. When Maho moved the Varien library to proper PHP namespaces, it kept class aliases for every old name, so third-party extensions keep working unchanged.

If you learned Magento 1, you already know Maho. The [developer guide](../developer/guide/introduction.md) is the same tutorial, updated.

## What Maho rebuilt: everything else

### The foundation

Zend Framework 1 is gone. Not wrapped, not partially replaced: [removed from the repository](../blog/posts/2025-11-01-maho-25.11-announcement.md). Every piece of it now runs on a maintained library:

| Was | Is now |
|---|---|
| `Zend_Db` | [Doctrine DBAL](../developer/database-layer.md), with MySQL, MariaDB, PostgreSQL and SQLite support |
| `Zend_Cache` | `symfony/cache` |
| Session handling | `symfony/http-foundation` |
| `Zend_Http` | Symfony HttpClient |
| `Zend_Validate` | Symfony Validator |
| `Zend_Log` | Monolog, with [OpenTelemetry](../hosting/opentelemetry.md) on top |
| `Zend_Pdf` | DomPDF |
| `Zend_Soap`, `Zend_XmlRpc`, `Zend_Json_Server` | Laminas |
| `Zend_Json`, `Zend_Locale_Data`, `Zend_Date` | Native PHP: JSON, `IntlDateFormatter`, `DateTime` |
| mcrypt | libsodium |
| Image processing | intervention/image |
| PHP `serialize()` in the database | JSON |

The Varien library became `Maho\`, with real namespaces. [Routing](../developer/routing.md), [observers and cron jobs](../developer/observers.md) are declared with PHP attributes, so the last routing XML is gone. Database tables are defined with a [declarative schema](../developer/declarative-database-schema.md) instead of install scripts. Maho runs on the most recent PHP releases (see [system requirements](getting-started.md#system-requirements)).

### The project

![Structure of a basic Maho project](/assets/basic-project-structure.webp){ width=200 align=left }

The old composer plugin copied the entire core into every project. Maho's [composer plugin](../developer/composer-plugin.md) uses autoloaders instead, so a project holds only its own code. **In this picture you see a basic Maho project right after installation.**

Whatever is in your local project overrides composer-installed modules, which override Maho's core.

Around it: a real [CLI tool](../developer/cli-tool.md) instead of the `shell/` scripts, a [PHPStan plugin](https://github.com/MahoCommerce/maho-phpstan-plugin){:target="_blank"}, configuration through environment variables, official Docker images on [FrankenPHP](../hosting/frankenphp.md), and a redesigned web installer. All of this toolchain is maintained by the Maho team, so no core component depends on an unmaintained third party.

<div style="clear: both"></div>

### The frontend

PrototypeJS, ExtJS, TinyMCE, flatpickr and every other JavaScript library are gone. Maho is [100% vanilla JavaScript](../blog/posts/2025-11-01-maho-25.11-announcement.md) on both storefront and admin. Rich text is edited with TipTap. Dates use native HTML inputs. Colors are CSS variables. Pages ship with built-in minification, 103 Early Hints, speculation rules, AVIF images and 2x `srcset`.

On top of that base, Maho ships [eleven storefront themes](themes.md), one for each kind of shop, each with a dark mode, each restyled from the admin without code or a build step.

### The admin

The admin got a [complete redesign](../blog/posts/2026-06-14-admin-redesign.md) with light and dark mode and one design system across every screen. The legacy admin theme is gone. New in it: a media library with an image editor, content versioning, an activity log, a health check page, cron management, a countries and regions editor, dashboard charts, a [5800+ icon library](../developer/icons-library.md), and login with passkeys or [two-factor authentication](../user-guide/two-factor-authentication.md).

### The APIs

The legacy SOAP and REST APIs still work. Next to them, Maho has a [new API](../api/v2/index.md) built on API Platform: REST and GraphQL, JWT authentication, granular permissions, OpenAPI docs with Swagger UI, and an [MCP server](../api/v2/mcp.md) so AI agents can operate the store. For developers there is a built-in [AI module](../developer/ai.md) with multiple LLM providers, and an LSP server with official editor plugins.

### The store

These are features that Magento 1 and OpenMage never had, each with its own page in the [User Guide](../user-guide/index.md):

- Marketing: [customer segments](../user-guide/customer-segments.md), [email automation](../user-guide/email-automation.md), [gift cards](../user-guide/gift-cards.md), [feed manager](../user-guide/feed-manager.md), [product relationship rules](../user-guide/product-relationship-rules.md), dynamic categories, a blog module.
- Checkout: one-step checkout, a minimal checkout layout, payment restrictions, PayPal on the v6 SDK, real-time EU VAT validation, [shipping bridge](../user-guide/shipping-bridge.md), the [EU revocation button](../user-guide/revocation-button.md).
- Customer accounts: [magic link](../user-guide/magic-link-authentication.md), [social login](../user-guide/social-login.md), customer 2FA, [self-hosted captcha](../user-guide/captcha.md).
- Search engines and AI: [SEO controls](../user-guide/seo.md), [structured data](../user-guide/structured-data.md), [llms.txt and Markdown for AI agents](../user-guide/ai-and-crawlers.md).
- Content and data: [category import/export](../user-guide/category-import-export.md), an [array import adapter](../developer/array-import-adapter.md), [SVG uploads](../hosting/svg-support.md), a [message queue](../developer/message-queue.md), [Redis](../hosting/redis.md) cache and sessions, [edge caching](../hosting/edge-caching.md), [maintenance mode](../hosting/maintenance-mode.md).

### The process

Maho ships a release [every two months](release-strategy.md), with bugfix patch releases in between. Every release carries [SBOMs](sboms.md) and passes the same [quality and security checks](../blog/posts/2026-06-10-quality-and-security-as-code.md) across every repository. [Language packs](../developer/language-packs.md) are rebuilt for every release. All of this happens in the open, on a [public roadmap](roadmap.md), with [full transparency about how we use AI](genai-transparency.md).

For the complete list, release by release, see the [release notes](../blog/index.md).

## Meaning and pronunciation of Maho

"Maho" ([pronounced as "mah-hoh"](https://www.ingles.com/pronunciacion/majo){:target="_blank"}) draws inspiration
from various cultural meanings:

- **Maho (or Majo) is the name given to the ancient indigenous people of Lanzarote and Fuerteventura**,
  islands in the Atlantic archipelago of the Canary Islands (Spain), home of this project's maintainer.  
  The Mahos were a **resilient and advanced population who thrived in the challenging island environments**
  before the 15th century. They left significant evidence of their agricultural, social, technological,
  cultural, and spiritual achievements, which continue to impact the culture of the islands to this day.  
  As the Mahos, our platform has a long history, it's simple yet advanced, and it's enduring daring times.
- **In Spanish, it means nice, pleasant, attractive, cool**, who doesn't want a cool platform to build on?
- **In Japanese, it means magic or sorcery**, reflecting the powerful and transformative nature of what
  we want to achieve.

Notice there's no "Mage" in our name? That's intentional.  
While we honor our roots in Magento and OpenMage, it's time for a fresh start.  
Mage was groundbreaking, and we still admire it, but the perception of it being "dead"
became a hurdle for ongoing support and development.  
By adopting a new identity, we're opening doors to new perspectives and possibilities.  
This name change signals to the community that while we build on a solid foundation, we're evolving into something
distinctly powerful and forward-looking.

**Maho is a new tree growing from time-tested roots - familiar in essence, yet branching out in exciting
new directions.**
