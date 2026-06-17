# Security & SBOMs

Maho publishes a **Software Bill of Materials (SBOM)** for every project in the [`mahocommerce`](https://github.com/mahocommerce) organization, plus daily vulnerability scans against those SBOMs. Both are public and version-controlled in the [`MahoCommerce/sboms`](https://github.com/MahoCommerce/sboms) repository.

In practice this means anyone (a prospective user doing due diligence, a sysadmin running Maho in production, or a security team auditing their stack) can see exactly which third-party components ship with Maho and which of them have known, fixable CVEs, without having to scan the code themselves.

## Current status

[![Critical](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/MahoCommerce/sboms/main/badges/critical.json)](https://github.com/MahoCommerce/sboms/blob/main/VULNERABILITIES.md)
[![High](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/MahoCommerce/sboms/main/badges/high.json)](https://github.com/MahoCommerce/sboms/blob/main/VULNERABILITIES.md)

The badges above update automatically. Click through for the full per-project breakdown in [`VULNERABILITIES.md`](https://github.com/MahoCommerce/sboms/blob/main/VULNERABILITIES.md).

## What you get

- One [CycloneDX 1.5](https://cyclonedx.org/) SBOM per repository, per release, refreshed daily.
- Daily vulnerability scans using two independent engines ([Grype](https://github.com/anchore/grype) and [Trivy](https://github.com/aquasecurity/trivy)), with results merged so you don't have to reconcile them yourself.
- A focus on *actionable* findings: vulnerabilities without an upstream fix are filtered out, so what you see is what you (or we) can do something about.

## Reporting a vulnerability

If you've found a security issue in Maho itself, please follow the disclosure process in the [main repository's security policy](https://github.com/MahoCommerce/maho/security) rather than opening a public issue.
