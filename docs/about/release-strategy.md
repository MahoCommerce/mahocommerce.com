---
description: How Maho releases work - calendar-based YY.m versioning, why not semver, the support policy and the new bugfix patch releases starting with 26.7.
---

# Release strategy

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

**Only the latest release is supported.** When a new YY.m release ships, the previous one stops getting fixes, and you upgrade to keep getting them.

### Why there is no long-term support

**We believe that upgrading is part of the life of a store.** We have worked as technical consultants for many years, and we saw the same story again and again: long-term support is often a way to not upgrade. A store stays on an old version for years, the custom code grows around it, and the technical debt grows with it. When the support finally ends, the upgrade is a huge and expensive project, and often a full replatforming. Small and regular upgrades cost much less than one big jump.

**Security makes this more important every day.** With AI tools, vulnerabilities are found faster than ever, by researchers and by attackers. An old version collects known issues, and the only real fix is to be on the current release. A store that upgrades regularly is a safer store.

**And we prefer to spend our time and our budget on innovation.** Maho moves fast: new features, a modern stack, legacy code removed at every release. Long-term support means keeping several versions alive at the same time: porting every fix to each of them, testing each of them, and answering issues for old code. Large vendors pay for that with license fees. Maho is free, with no license fee and no revenue share, the work on it is voluntary, and the budget comes from [our sponsors](#you-can-help-us-provide-more) and from public grants such as the NLnet NGI TALER Fund. Every hour and every euro goes into the release that everybody uses.

We think this is a fair balance: Maho stays free for everybody, and every upgrade brings your store new features and the latest security fixes.

### Bugfix (patch) releases

**Starting with 26.7, Maho has bugfix releases.** Most fixes simply land in the next YY.m release. But when a bug or security issue can't wait for the next calendar release, we can ship a **patch release** on the current series instead of forcing you onto a version that may contain breaking changes. Not every fix is backported - a fix is ported to a bugfix release only when we judge it necessary.

Here's how it works:

- On the day a YY.m release ships, we cut a **maintenance branch** named after the release series - for example `26.7` for the `26.7.0` release.
- When a fix merged into the main line is suitable for the current release, a maintainer tags its pull request with a `backport <series>` label (e.g. `backport 26.7`). An automated workflow then opens a backport pull request against the matching maintenance branch.
- Once that backport is merged, it's published as the next patch in the series - `26.7.1`, `26.7.2`, and so on.

This lets you stay on a known-stable series and pick up `26.7.x` patch releases via Composer, without having to jump to the next YY.m release before you're ready to review its breaking changes. As always, **review the release notes for every release** - including patches - before upgrading.

### If you need help with upgrades

- [Maho Cloud](https://cloud.mahocommerce.com){target=_blank} hosts your store on servers run by the Maho team.
- [Hire us](mailto:info@mahocommerce.com) to manage your store and its upgrades.

## You Can Help Us Provide More

The support policy follows our budget, and the budget follows the sponsors. Our goal is not long-term support: upgrades stay part of the life of a store. But with more sponsors, we can give every store **a longer upgrade window**: the previous release keeps getting security fixes for some weeks after the next one ships, so you can plan your upgrade instead of rushing it.

    If your company depends on Maho and wants a longer window, sponsor the project, or [write to us](mailto:info@mahocommerce.com) to fund it directly. Every sponsor brings it closer, and the whole community gets it.

<a href="https://github.com/sponsors/fballiano" target=_blank title="Sponsor me on GitHub"><img src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white" alt="Sponsor me on GitHub" /></a>
<a href="https://www.buymeacoffee.com/fballiano" target=_blank title="Buy me a coffee"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy me a coffee" /></a>
<a href="https://www.paypal.com/paypalme/fabrizioballiano" target=_blank title="Donate via PayPal"><img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Donate via PayPal" /></a>