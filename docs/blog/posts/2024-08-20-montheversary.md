---
date: 2024-08-20
---

# The first montheversary

_TLDR_: good feedback after public announcement, a lot of cleanups, and the first
security update!

<!-- more -->

<img src="/assets/blog/announcement-on-linkedin.png" alt="" loading="lazy" style="max-width: 300px" align="left">

## We're public!

In the first month of Maho all the work was done privately, but right before the 30-day mark, the time
was ready for the **first public announcement**.

It was very well received and **more people joined the GitHub repo and the discord server**.

This is a great start, and I hope more people will join this new journey!

<div style="clear: both"></div>

## Software updates

- **A lot of minor cleanups** ("dot" files and directories, htaccess and more)
- **Changes to the web/CLI installer** (charts/skip_urlvalidation/use_rewrites are enabled by default now,
  you don't have to click checkbox or type CLI arguments for that. It's 2024, everybody needs
  rewrites)
- All logos in the repo are now updated with the Maho graphics
- **Placeholder images now support SVG format**, which is IMHO a huge improvement
- **TinyMCE is installed via composer** and no longed bundled inside our repository
  (this was possible because we own the complete toolchain, in this case, the composer plugin).
  Also, thanks to dependabot, I noticed that
  [TinyMCE has a security issue](https://github.com/advisories/GHSA-5359-pvf2-pw78){:target="_blank"}
  which [I already fixed](https://github.com/MahoCommerce/maho/commit/4868c7f2876d99f9a70694be07bf3f8473b16aea){:target="_blank"}.
- Our website now has the complete (and fixed) porting of the old [REST/SOAP API documentation](../../api/soap.md),
  this was a big task, 4 full days of work, but I think it was about time we could use that great documentation
  that really needed some love.

<figure markdown="span" style="border:1px solid var(--md-typeset-a-color);padding:20px 20px 0 20px">
  ![SVG placeholders](/assets/blog/svg-placeholders.png){ loading=lazy width=500 }
  <figcaption>SVG placeholder images in action</figcaption>
</figure>

## Closing thoughts

It was a great week and a great month for **Maho**, and I hope we continue on this trajectory.  
I'm thinking about write on the blog every other week, instead of weekly, because in the next few
weeks I'll also have to focus on paid projects and I won't be able to do full time work on Maho.
**I would love to dedicate myself completely to this project, but that would be possible only with
enough sponsorships.** Sponsoring/partnership options will be available in the future, but if you find
my work valuable please [check my GitHub profile for options](https://github.com/fballiano){:target="_blank"} that
are available now.

Till next time... Maho rocks! 🚀