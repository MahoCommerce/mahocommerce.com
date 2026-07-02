---
date: 2026-07-02
categories:
  - Development log
---

# Bugfix releases are coming, starting with 26.7

Maho moves fast, and every new `YY.m` release proves it: new features, performance improvements, and a platform that keeps getting more modern. Until now, if you needed a fix between releases, you picked up the whole next release with it.

**Starting with 26.7, that trade-off is gone.** The current Maho series can now receive proper **bugfix releases**, `26.7.1`, `26.7.2`, and so on, carrying important fixes back to the exact version your store is already running.

<!-- more -->

## Why our versioning works this way

Our [release strategy](/about/release-strategy/) has always been transparent: each `YY.m` release is free to make the platform genuinely better, cleaner, faster, more modern. Upgrades are well documented and smooth, and comprehensive release notes tell you exactly what changed and what to check. It's what lets Maho evolve at the pace it does.

It's also an honest reflection of who we are. **Maho is built by a small, focused team**, and maintaining long-term support for many versions at once is a luxury of much larger organizations. That's why our support policy has always been simple: the current release is the supported release. Spreading ourselves across multiple support branches would have meant slowing down the main line, and the main line is where Maho's value comes from.

Meanwhile, **Maho keeps growing**: more stores run Maho in production, and it may happen that a bug slips into a release. Of course Maho's structure already lets you import a single fix in minutes via a `composer` patch, but a production store shouldn't have to manage patches by hand: you should be able to get **just that fix** as an official release, on the series you've already tested and deployed, on your own schedule. The more production stores Maho powers, the more that matters, and the challenge was never whether bugfix releases are worth doing, it was doing them without diverting energy from moving the platform forward.

## We found a way to make it simple and fast

So we did what we always do: we automated it, until shipping a patch release costs us minutes instead of days. Here's the process, simple, automated, and fully visible on GitHub:

- **On the day a new `YY.m` release ships**, we cut a maintenance branch named after the series: `26.7` for the `26.7.0` release.
- **When a fix lands on the main line** that the current series needs, a maintainer tags its pull request with a `backport 26.7` label. An automated workflow immediately opens a backport pull request against the maintenance branch, no manual cherry-picking, no per-release configuration.
- **Once the backport is merged**, it ships as the next patch release in the series: `26.7.1`, then `26.7.2`, and so on.

And like everything at Maho, the automation itself is **open source**: a small GitHub Actions workflow living right in the main repository, pinned to immutable commit hashes like all our actions, so you can read exactly how every patch release comes together.

## What this means for your store

You can stay on a known-stable series and pick up `26.7.x` patches via Composer, without adopting the next `YY.m` release before you've had time to review its changes. A patch release brings you the fixes you need and nothing else, so upgrading to one is a small, predictable step instead of a project.

A few things worth knowing:

- **Patches go to the current series only.** We maintain one series at a time: when a new `YY.m` release ships, bugfix releases move with it, in line with our support policy.
- **Most fixes still land in the next `YY.m` release**, as they always have. A fix is backported when we judge it necessary, typically significant bugs and security issues that shouldn't wait.
- **Every release comes with release notes, patches included.** Read them before upgrading, they're written to give you everything you need to upgrade safely.

The [release strategy page](/about/release-strategy/) has been updated with all the details.

Maho rocks! 🚀
