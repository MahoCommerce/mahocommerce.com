## Introduction

**Maho is built to move fast**: delivering innovation, new features, performance improvements, and removing outdated technologies. Our release strategy reflects this commitment to continuous improvement while being transparent about what it means for users.

## Calendar-Based Versioning

**Maho uses a YY.m.patch versioning system:**

| Component | Description                       | Example |
|-----------|-----------------------------------|---------|
| YY | Year number                       | 24 |
| m | Month number, without leading zero | 9 |
| patch | Incremental number of patch releases | 0 |

We aim to minimize patch releases, typically not exceeding one per YY.m version unless critical fixes are needed.

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

**Each release is supported until the next release.** As a small team, we cannot provide long-term support for multiple versions simultaneously.

If a bug is discovered in a release, the fix will be included in the next release. To deploy the fix, you'll need to upgrade to the latest version. This rolling support model keeps the codebase healthy and ensures resources are focused on moving forward rather than maintaining multiple branches.

## You Can Help Us Provide More

Please consider sponsoring. Your support enables us to deliver more features, updates, and support.

<a href="https://github.com/sponsors/fballiano" target=_blank title="Sponsor me on GitHub"><img src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white" alt="Sponsor me on GitHub" /></a>
<a href="https://www.buymeacoffee.com/fballiano" target=_blank title="Buy me a coffee"><img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy me a coffee" /></a>
<a href="https://www.paypal.com/paypalme/fabrizioballiano" target=_blank title="Donate via PayPal"><img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Donate via PayPal" /></a>

Or [hire us to manage your store](mailto:info@mahocommerce.com).