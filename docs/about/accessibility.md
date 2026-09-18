---
description: Maho runs automated WCAG 2.2 Level AA scans on every storefront theme and every main page type, and publishes the full reports. Read what the scans cover, what they do not cover, and download the report for each theme.
---

# Accessibility scan reports <span class="version-badge">v26.9+</span>

Maho ships with a built-in accessibility scanner, and we run it on our own storefront themes. This page publishes the results of the latest full run: every theme, every main page type, desktop and mobile, against WCAG 2.2 Level AA.

!!! warning "This is not an accessibility certification"
    The reports on this page come from automated testing only. Automated checks find roughly one third to one half of the WCAG success criteria. They cannot judge keyboard flow, focus order, screen reader semantics in context, the quality of alt text, or the meaning of content. A conformance claim needs a manual audit by a person with assistive technology, done on the actual store with its real content. Treat these reports as evidence that the themes start from a clean base, not as a guarantee that a store built on them conforms.

## Scope and method

| | |
|---|---|
| Standard | WCAG 2.2, Level AA (includes every Level A and AA criterion of WCAG 2.0, 2.1 and 2.2) |
| Engine | [axe-core](https://github.com/dequelabs/axe-core) 4.12.1, driven by Playwright 1.63.0 with headless Chromium |
| Tool | The Maho accessibility scanner, `./maho accessibility:scan`, included in Maho 26.9 and later |
| Viewports | Desktop 1280 x 1024 and mobile 390 x 844 with mobile emulation. Every page is scanned twice |
| Themes | All eleven: default, fashion, electronics, food, books, jewelry, beauty, home, sports, kids, garden |
| Pages | Home, category, product, CMS page, search results, cart, login, register, contact, orders and returns, blog index, blog post |
| Content | The Maho sample data, as installed by `./maho import:sample-data` |
| Code | Maho `main` at commit `1eb5b6d3`, which is 26.9.0 plus the fixes from [pull request 1433](https://github.com/MahoCommerce/maho/pull/1433) |
| Date | 18 September 2026 |

The default theme has no blog post in the sample data, so that cell is empty. Everything else is 131 scans, each of which ran on both viewports.

## Results

Every cell shows the number of violations found. A violation is an element that fails an axe-core rule mapped to a WCAG 2.2 Level A or AA criterion. All 131 scans report zero.

| Theme | Home | Category | Product | CMS | Search | Cart | Login | Register | Contact | Orders | Blog | Blog post | Report |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| Default | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | [PDF](../assets/accessibility/accessibility-report-default.pdf) |
| Fashion | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-fashion.pdf) |
| Electronics | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-electronics.pdf) |
| Food | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-food.pdf) |
| Books | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-books.pdf) |
| Jewelry | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-jewelry.pdf) |
| Beauty | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-beauty.pdf) |
| Home | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-home.pdf) |
| Sports | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-sports.pdf) |
| Kids | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-kids.pdf) |
| Garden | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | [PDF](../assets/accessibility/accessibility-report-garden.pdf) |

Each PDF is the merged export of the scanner's own reports for that theme, one section per page type. A section holds the scan summary, a desktop and a mobile screenshot, the list of violations (empty here), and the count of checks that need a manual review.

Each scan also lists between 2 and 19 checks that axe-core could not decide by itself, for example a color contrast over a background image. These are not failures. They are open items for a manual review, and the count is printed in every report.

## What the first run found

The first run, before pull request 1433, found five distinct problems. All of them were in shared templates or theme tokens, so a single fix repaired every theme that had them.

- **Invisible text in the newsletter input.** Nine themes have a dark footer. The newsletter field inherited the light footer text color on a light field, so typed text had a contrast of 1.07:1. This is the kind of bug a sighted tester does not notice until they type.
- **Two form selects without a label.** The configurable product option select and the "Find Order By" select on the orders and returns page had no associated label, so a screen reader could not name them.
- **Links in CMS text not distinguishable.** In the default theme, links inside CMS content relied on color alone, with 2.85:1 contrast against the body text. Content links are now always underlined.
- **Text just under the contrast limit.** The review date and the login tab labels used 65 percent ink and landed at 4.3 to 4.4:1 in two themes. The "In stock" badge in two themes sat at 4.0 to 4.4:1. Small token changes brought every one above 4.5:1.

## Accessible reports

The PDF files are not accessible documents. The scanner renders them with DomPdf, which produces untagged PDF without a structure tree, a reading order or a document language. This page and the scanner's admin view are the accessible versions of the same data. If you need the raw data in another form, the scanner's JSON output (`--format json`) holds everything the PDF shows.

## Run it on your store

Every Maho store from 26.9 on can produce the same reports for its own pages, with its own theme and content. Open **System > Accessibility Scan** in the admin, or run the scanner from the command line:

```bash
./maho accessibility:scan --url https://your-store.example/ --level AA
```

The admin view maps every violation to the `.phtml` template and line that rendered the element, with a screenshot and a marker on the failing element. A scheduled scan can run every night on a list of URLs.
