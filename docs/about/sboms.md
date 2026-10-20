---
description: Maho publishes CycloneDX SBOMs, daily vulnerability scans and SLSA Build Level 3 release provenance, with immutable releases, pinned CI actions and protected branches, so you can audit and verify every release yourself.
---

# Security & supply chain

Maho publishes what is inside each project, which known vulnerabilities affect it, and how each
release was built. All of it is public, so anyone can check it: a prospective user doing due
diligence, a sysadmin running Maho in production, or a security team auditing their stack.

- **SBOMs and vulnerability scans**: a Software Bill of Materials for every project, scanned
  every day.
- **Release provenance**: from 26.11.0, each release reaches
  [SLSA](https://slsa.dev/) Build Level 3, with a signed record of how it was built.
- **Protected builds and sources**: immutable releases, pinned CI actions and protected branches
  across the whole organization.

## Current status

[![Critical](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/MahoCommerce/sboms/main/badges/critical.json)](https://github.com/MahoCommerce/sboms/blob/main/VULNERABILITIES.md)
[![High](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/MahoCommerce/sboms/main/badges/high.json)](https://github.com/MahoCommerce/sboms/blob/main/VULNERABILITIES.md)

The badges update automatically. Click through for the full breakdown of each project in
[`VULNERABILITIES.md`](https://github.com/MahoCommerce/sboms/blob/main/VULNERABILITIES.md).

## SBOMs and vulnerability scans

The [`MahoCommerce/sboms`](https://github.com/MahoCommerce/sboms) repository holds a public,
version-controlled SBOM for every project in the [`mahocommerce`](https://github.com/mahocommerce)
organization. It shows which third-party components ship with Maho and which of them have known
vulnerabilities that a fix exists for.

- One [CycloneDX 1.6](https://cyclonedx.org/) SBOM for each repository and each release,
  refreshed every day.
- Daily vulnerability scans with two independent engines,
  [Grype](https://github.com/anchore/grype) and [Trivy](https://github.com/aquasecurity/trivy).
  The results are merged into one report.
- Only actionable findings: a vulnerability without an upstream fix is filtered out, so each
  finding is one that you or we can act on.

## SLSA release provenance <span class="version-badge">v26.11+</span>

SLSA (Supply-chain Levels for Software Artifacts) is an [OpenSSF](https://openssf.org/)
framework. It defines levels of protection against a changed release, a changed build, or a
changed source. From 26.11.0, each Maho release reaches **SLSA Build Level 3**:

| Level | Requirement | Maho |
|---|---|---|
| Build L1 | Each release comes with provenance: a record of how it was built | Yes |
| Build L2 | A hosted build platform signs the provenance | Yes, GitHub artifact attestations |
| Build L3 | The build steps cannot reach the signing identity, and the source repository cannot change the build | Yes, through a separate reusable workflow |

### What a release contains

Each release on [GitHub](https://github.com/MahoCommerce/maho/releases) has two assets:

- `maho-<version>.zip`: the source package of the release.
- `maho-<version>.cdx.json`: its CycloneDX SBOM, with the dependency versions that the release was
  tested with.

Each package also has two signed attestations:

- **Build provenance** ([SLSA v1](https://slsa.dev/spec/v1.0/provenance)): it names the source
  repository, the commit, the branch and the workflow that built the package.
- **SBOM attestation**: it links the SBOM to the exact package.

Both attestations are also in the public [Sigstore](https://www.sigstore.dev/) transparency log,
so nobody can remove them or change them later.

!!! note
    Composer installs the source archive that GitHub generates for the release tag, not this
    package. Composer does not check attestations. The provenance covers the package that you
    download from the release page.

### How a release is built

The build runs in a [reusable workflow](https://github.com/MahoCommerce/infrastructure/blob/main/.github/workflows/release-build.yml)
in the `MahoCommerce/infrastructure` repository. The `maho` repository only calls it. So a
change in `maho` alone cannot change how a release is built or signed.

1. The maintainer opens a draft release that points to an exact commit.
2. The `maho` repository calls the reusable workflow from `main` or from a maintenance branch.
3. The **build job** has read-only access. It builds the package with `git archive` and
   generates the SBOM with [Syft](https://github.com/anchore/syft).
4. The **signing job** is the only job that can request a signing token. It runs no code from
   the `maho` repository. It checks that the release is a draft that points to the commit of the
   run. Then it signs the provenance and the SBOM, and it uploads both files to the draft.
5. The maintainer publishes the release. From that moment, the release is immutable.

The workflow stops if the version, the branch or the draft is not correct. In that case, the
draft stays a draft, and nothing is published.

### Verify a release

You need the [GitHub CLI](https://cli.github.com/). Download the package from the release page,
then check its provenance:

```bash
gh attestation verify maho-26.11.0.zip --repo MahoCommerce/maho \
  --signer-workflow MahoCommerce/infrastructure/.github/workflows/release-build.yml \
  --source-ref refs/heads/main
```

The command checks four things:

- The signature is valid.
- The package was built from the `maho` repository.
- The package was built on the `main` branch.
- The reusable release workflow signed the package, not a changed copy of a workflow.

For a patch release from a maintenance branch, use that branch in `--source-ref`, for example
`refs/heads/26.11`.

To check the SBOM attestation, add `--predicate-type https://cyclonedx.org/bom` to the same
command.

To check that the release and its assets are the ones that GitHub published:

```bash
gh release verify 26.11.0 --repo MahoCommerce/maho
gh release verify-asset 26.11.0 maho-26.11.0.zip --repo MahoCommerce/maho
```

## How the build platform is protected

- **Immutable releases**: every repository in the organization has immutable releases. After
  publication, nobody can change or delete a release, its tag or its assets.
- **Pinned actions**: every GitHub Action in every workflow is pinned to a full commit SHA, not
  to a tag that can move. An organization policy enforces this, so a workflow with an unpinned
  action does not run.
- **Reviewed updates**: Dependabot proposes updates to the pinned actions as pull requests. A
  7-day cooldown leaves time to detect a bad release of an action before Maho uses it.
- **Pinned tools**: the SBOM and scan tools install through pinned actions, never through a script
  from the branch of another project.
- **Clean runners**: each job runs on a new GitHub-hosted runner, and the release workflow uses no
  cache.

## How the source is protected

- **Protected branches**: every public repository blocks deletion of its default branch and
  force-push to it, with no exception for administrators. The `maho` repository also protects
  its maintenance branches (`26.9`, `26.11`, ...). So nobody can rewrite the history of a release
  line.
- **Rules as code**: the [infrastructure](https://github.com/MahoCommerce/infrastructure)
  repository holds these rules and applies them to every repository each week. If a rule
  changes by mistake, the next run restores it.
- **Two-factor authentication**: the organization requires it for every member.

## Reporting a vulnerability

If you found a security issue in Maho, follow the disclosure process in the
[security policy](https://github.com/MahoCommerce/maho/security) of the main repository. Do not
open a public issue.
