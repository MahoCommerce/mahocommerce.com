---
date: 2026-06-01
categories:
  - Feature spotlight
---

# Language packs, rebuilt, and three new languages

Back in 2024 we shared our [15-year-long quest for perfect language packs](2024-09-08-language-packs-revolution.md).
That first system did the job, but it leaned on a lot of moving parts behind the scenes, and the old translations it was built on were never the highest quality to begin with.

So we rebuilt the whole thing from scratch around a much simpler idea, started the translations over from a clean, higher-quality base, and while we were at it, added three brand-new languages.

<!-- more -->

## Three new languages

Maho now ships official packs in **13 languages**, every one of them **at least 97% translated**. The newcomers are:

- 🇩🇰 **Danish**
- 🇫🇮 **Finnish**
- 🇸🇪 **Swedish**

## The complete list

| Language | Install with |
| --- | --- |
| 🇩🇰 Danish | `composer require mahocommerce/maho-language-da_dk` |
| 🇳🇱 Dutch | `composer require mahocommerce/maho-language-nl_nl` |
| 🇫🇮 Finnish | `composer require mahocommerce/maho-language-fi_fi` |
| 🇫🇷 French | `composer require mahocommerce/maho-language-fr_fr` |
| 🇩🇪 German | `composer require mahocommerce/maho-language-de_de` |
| 🇬🇷 Greek | `composer require mahocommerce/maho-language-el_gr` |
| 🇮🇹 Italian | `composer require mahocommerce/maho-language-it_it` |
| 🇵🇱 Polish | `composer require mahocommerce/maho-language-pl_pl` |
| 🇵🇹 Portuguese | `composer require mahocommerce/maho-language-pt_pt` |
| 🇧🇷 Portuguese (Brazilian) | `composer require mahocommerce/maho-language-pt_br` |
| 🇷🇴 Romanian | `composer require mahocommerce/maho-language-ro_ro` |
| 🇪🇸 Spanish | `composer require mahocommerce/maho-language-es_es` |
| 🇸🇪 Swedish | `composer require mahocommerce/maho-language-sv_se` |

## How translations stay up to date

The new system is refreshingly simple. Whenever something changes in Maho, the rest happens almost on its own:

1. **Maho changes.** A new feature lands, or some wording gets tweaked. The source translations get automatically synchronized to [maho-l10n](https://github.com/MahoCommerce/maho-l10n){target=_blank}, the central home for all of Maho's translations.
2. **Our language pipeline takes over.** From [maho-l10n](https://github.com/MahoCommerce/maho-l10n){target=_blank}, the new English text is sent up to [Maho's translation platform](https://translate.mahocommerce.com/){target=_blank}.
3. **Autotranslation triggers.** Anything new is automatically translated into all 13 languages, and the community can [step in to review and improve any translation](https://translate.mahocommerce.com/){target=_blank} at any time.
4. **It gets packaged.** When we're ready, the finished translations are pulled back into [maho-l10n](https://github.com/MahoCommerce/maho-l10n){target=_blank}, bundled into each language pack, and published, ready to install.

That's it. Translations live in one place, the packs are generated automatically, and adding a brand-new language is now easier than it's ever been.

## Want to help?

If you spot a mistake or want to refine a translation, head to [Maho's translation platform](https://translate.mahocommerce.com/){target=_blank}, pick your language, and go.
And if your language isn't on the list yet, let us know.

Maho rocks! 🚀
