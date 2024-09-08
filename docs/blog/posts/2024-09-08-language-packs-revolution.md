---
date: 2024-09-08
---

# 15-Year-Long quest for perfect language packs

In the world of e-commerce platforms, localization is key to reaching a global audience.
At Maho Commerce, we know that a great software solution needs excellent localization.

Today, we're excited to share our journey in solving a 15-year-old challenge: creating the perfect language pack for our platform.

<!-- more -->

## M1 era: the decentralized approach

For years, the M1 platform lacked a centralized hub for translations. Language packs were maintained by a global community of contributors, without central oversight. While this approach fostered community involvement, it led to several challenges:

1. Inconsistent maintenance
2. Incomplete translations
3. Language packs scattered across the internet

As time passed, many of these community-driven translations became outdated, incomplete and lost in the vast expanse of the web.

## Maho's solution: Our approach to localization

Recognizing the critical importance of high-quality localization, our team at Maho Commerce has spent the past few weeks developing an innovative solution. We've created specialized software that generates Maho's language packs using a unique, multi-tiered approach:

1. **Magento 2 Compatibility**: Our system first checks the Magento 2 translation system.
   If a translation exists there, it's automatically incorporated into Maho's language pack.
2. **Legacy M1 Support**: If no Magento 2 translation is found, our software searches a comprehensive repository
   of all old M1 translations. This ensures we leverage the valuable work done by the community over the years.
3. **AI-Powered Translations**: In cases where no human-managed translation is available, our system employs
   advanced AI to generate a translation. This ensures complete coverage for all strings, even for new features.

## Testing and continuous improvement

Developing this system required extensive testing to find the right balance (AI model and prompts) to generate the
best possible translations. While we acknowledge that AI-generated translations may not always be 100% perfect,
we believe this approach represents a significant leap forward for our platform's localization capabilities.

## Synchronization and collaboration, finally

Our new localization system is designed with collaboration and ease of use in mind:

- **Automatic Synchronization**: All translations are automatically synced between
  [Maho's main repository](https://github.com/MahoCommerce/maho){target=_blank} and
  a [specialized repo for the entire localization system](https://github.com/MahoCommerce/maho-l10n){target=_blank},
  and [individual repos for each translation](https://github.com/orgs/MahoCommerce/repositories?q=maho-language-){target=_blank}.
  These individual repos are [distributed via Packagist](https://packagist.org/?query=maho-language){target=_blank},
  making them easily accessible through Composer.
- **Crowdin Integration**: We've integrated with the [Crowdin translation platform](https://translate.mahocommerce.com/){target=_blank}, enabling two-way synchronization.
  This makes it incredibly easy for users to [contribute and improve translations](https://translate.mahocommerce.com/){target=_blank} directly.

## Official documentation

We invite our users and the broader community to [explore and test these new language packs](../../language-packs.md),
provide feedback, and contribute to making Maho's localization even better.
Together, we can ensure that Maho speaks your language, wherever you are in the world.

## Looking ahead

While we're excited about the progress we've made, we know that language is dynamic and ever-evolving.
We see this new system as a solid foundation upon which we can build and improve.
With the combined power of community contributions, existing high-quality translations, and cutting-edge AI,
we're confident that Maho will offer one of the most comprehensive and accurate localization systems
in the e-commerce platform space.

Stay tuned for more updates as we continue to work extremely hard on this beautiful platform!
As always... Maho rocks! 🚀