`robots.txt` is a text file that admins create to instruct web robots (typically search engine crawlers) 
how to crawl pages on their website. The file uses the
[Robots Exclusion Protocol](https://en.wikipedia.org/wiki/Robots.txt){:target="_blank"},
which is a protocol with a small set of commands that can be used to indicate access to your site by section and by 
specific kinds of web crawlers (such as mobile crawlers vs desktop crawlers).

## Why is robots.txt important for e-commerce websites?

For an e-commerce platform, `robots.txt` can be crucial for several reasons:

1. **Crawl efficiency**: It helps search engines crawl your site more efficiently by directing them to the most important pages.
2. **Prevent indexing of private or duplicate content**: You can block crawlers from accessing customer account pages, checkout processes, or other sensitive areas.
3. **SEO optimization**: By guiding crawlers to your most valuable content, you can potentially improve your search engine rankings.

## How to activate robots.txt

Maho doesn't provide a default `robots.txt`, because the needs of every project are too different, and it could be even
dangerous to activate a default configuration. We instead provide a sample file for you to use as a base to create your
own solution.

To activate `robots.txt` on your Maho project, follow these steps:

1. Download [our robots.txt.sample file](https://github.com/MahoCommerce/maho/blob/main/robots.txt.sample){:target="_blank"}
2. Save it as `robots.txt` in the `pub/` directory of your Maho project.

That's it! Your `robots.txt` file is now active and will be used by web crawlers visiting your site.

## Customizing your robots.txt

For more advanced usage and information, consider consulting the
[Google Search Central documentation on robots.txt](https://developers.google.com/search/docs/advanced/robots/intro){:target="_blank"}.

Also, before publishing, test your `robots.txt` with a tool like
[robots.txt Validator and Testing Tool](https://technicalseo.com/tools/robots-txt/){:target="_blank"}.