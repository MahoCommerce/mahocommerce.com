## Introduction

**With Maho we want to move fast, create innovation, release new features, remove ancient technologies to gain
better performance and much more.**

At the same time we're a small team, the days of the big corporations creating the M1 platform are no more,
we have to be pragmatic and acknowledge that we can't have multiple branches with long term support and make
sure that we introduce new incredible features that never break any backward compatibility whatsoever.

Finished are the days when developers just copy-pasted a new release on top of the old one and go live
without testing. That kind of behavior was the default in the M1 platform for years because nothing was
really changing and the vast majority of projects were just "waiting to migrate elsewhere".

Sorry, but at Maho we do not want to babysit dying project, it's not a healthy approach for any of the parts involved.
In fact we believe this platform has so much potential, still in 2024, that it's a sin to waste it!
We're absolutely convinced that Maho will allow many shops to not have to migrate elsewhere.

Our dreams are big, and the challenges are, at least, as big. We do not know if we will succeed but for sure
we want to try with all of our strength.

## Semver no more

For all the reasoning above we think **[semver](https://semver.org){target=_blank} is not the right strategy for Maho**,
either we make changes and keep increasing the "major" number, or we get stuck in a "1.x" release that is a
marketing disaster (and yes, we have to think about marketing too).

At the beginning of Maho we thought about going with an Ubuntu-inspired YY.MM release numbers which would
allow us for quick iterations and to make clear that we're not semver anymore and that you have to check for
changes at every new release.

But we have to consider that composer is based on semver, so we need to have something that's somehow compatible.

## Version numbers are YY.m.patch

| Component | Description                       | Example |
|-----------|-----------------------------------|---------|
| YY | Year number                       | 24 |
| m | Month number, without leading zero | 9 |
| patch | Incremental number of patch releases | 0 |

We aim at not having more than one "patch release" under the same YY.m, unless necessary.

**We will commit at creating the best and most comprehensive release notes for every new release**, to make sure that
you have all the info necessary to upgrade, but **consider every new release as a major one containing breaking
changes**.

## Support for every release

Every release is supported until the next one, again, as a small team we cannot guarantee long term support, so,
in case there's a bug with a release, it will be solved in the next one, and if you need to deploy it, you'll
need to upgrade the whole project.

## You can help us provide more

Please consider sponsoring, it would give us the possibility of proving you with more features, updates and support.

<a href="https://github.com/sponsors/fballiano" target=_blank title="Sponsor me on GitHub"><img src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white" alt="Sponsor me on GitHub" /></a>
<a href="https://www.buymeacoffee.com/fballiano" target=_blank title="Buy me a coffee"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy me a coffee" /></a>
<a href="https://www.paypal.com/paypalme/fabrizioballiano" target=_blank title="Donate via PayPal"><img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Donate via PayPal" /></a>

Or [hire us to manage your store](mailto:info@mahocommerce.com).