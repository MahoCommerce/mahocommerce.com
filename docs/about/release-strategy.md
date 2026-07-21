---
description: How Maho releases work - calendar-based YY.m versioning, why not semver, the support policy and the new bugfix patch releases starting with 26.7.
---

## Introduction

**Maho is built to move fast**: delivering innovation, new features, performance improvements, and removing outdated technologies. Our release strategy reflects this commitment to continuous improvement while being transparent about what it means for users.

## Calendar-Based Versioning

**Maho uses a YY.m.patch versioning system:**

| Component | Description                       | Example |
|-----------|-----------------------------------|---------|
| YY | Year number                       | 24 |
| m | Month number, without leading zero | 9 |
| patch | Incremental number of patch releases | 0 |

Patch releases carry bugfixes and security fixes back onto an existing YY.m release without forcing you to adopt the breaking changes of the next one (see [Support Policy](#support-policy) below).

### Why Not Semantic Versioning?

Traditional [semantic versioning (semver)](https://semver.org){target=_blank} doesn't align with Maho's development philosophy. Semver's strict backward compatibility requirements would either:

- Force us to constantly increment major versions (making version numbers meaningless)
- Lock us into a "1.x" series that signals stagnation rather than active development

Calendar-based versioning solves this by:

- **Clearly communicating pace** - Version numbers reflect when a release happens, not artificial milestone markers
- **Composer compatibility** - The YY.m.patch format works with Composer's version constraints
- **Setting expectations** - Users know to check release notes rather than assuming backward compatibility

### Important: Treat Every Release as Potentially Breaking

While our versioning works with Composer, **every new YY.m release may contain breaking changes**. This is intentional: we prioritize making the platform better over maintaining perfect backward compatibility.

**We commit to creating comprehensive release notes for every release**, providing all the information you need to upgrade safely. Always review the release notes and test upgrades in a development environment before deploying to production.

## Support Policy

**The current YY.m release is supported until the next one ships.** As a small team, we cannot provide long-term support for many versions simultaneously, so support always tracks the most recent release.

### Bugfix (patch) releases

**Starting with 26.7, Maho has bugfix releases.** Most fixes simply land in the next YY.m release. But when a bug or security issue can't wait for the next calendar release, we can ship a **patch release** on the current series instead of forcing you onto a version that may contain breaking changes. Not every fix is backported - a fix is ported to a bugfix release only when we judge it necessary.

Here's how it works:

- On the day a YY.m release ships, we cut a **maintenance branch** named after the release series - for example `26.7` for the `26.7.0` release.
- When a fix merged into the main line is suitable for the current release, a maintainer tags its pull request with a `backport <series>` label (e.g. `backport 26.7`). An automated workflow then opens a backport pull request against the matching maintenance branch.
- Once that backport is merged, it's published as the next patch in the series - `26.7.1`, `26.7.2`, and so on.

This lets you stay on a known-stable series and pick up `26.7.x` patch releases via Composer, without having to jump to the next YY.m release before you're ready to review its breaking changes. As always, **review the release notes for every release** - including patches - before upgrading.

## You Can Help Us Provide More

Please consider sponsoring. Your support enables us to deliver more features, updates, and support.

<a href="https://github.com/sponsors/fballiano" target=_blank title="Sponsor me on GitHub"><img src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white" alt="Sponsor me on GitHub" /></a>
<a href="https://www.buymeacoffee.com/fballiano" target=_blank title="Buy me a coffee"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy me a coffee" /></a>
<a href="https://www.paypal.com/paypalme/fabrizioballiano" target=_blank title="Donate via PayPal"><img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Donate via PayPal" /></a>

Or [hire us to manage your store](mailto:info@mahocommerce.com).