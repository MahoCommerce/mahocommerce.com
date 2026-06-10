---
date: 2026-06-10
---

# Raising the bar on quality and security

Maho isn't one repository. It's the core platform, dozens of payment and feature modules, developer tools, language packs, our websites, all open source, and all growing. Every new repo is one more place where code quality and security have to stay in line, and "keep an eye on it by hand" stops working pretty fast.

So we did what we always do at Maho: we solved it with open, auditable code. Say hello to our new **`infrastructure`** repository.

<!-- more -->

## One config to run the whole org

The idea is simple. **One file describes how every Maho repository should look**, its CI workflows, its linting setup, its security settings, and a small tool makes reality match that file.

It runs, looks at each repo, and fixes whatever has drifted. Change something in one place and it rolls out across the entire organization. Nothing falls behind, nothing quietly diverges, and every file it touches lands as a normal pull request that a human reviews before it merges.

## Why we built our own

Because of our pretty specific requirements, we decided to build our own simple "terraforming" in **PHP**, the language Maho is built in and the one we actually enjoy working in.

Most of what we manage isn't a simple setting, it's **the contents of files inside repos**, and we almost never want to overwrite a whole file. We want to change *only the part that matters* and leave everything else exactly as the maintainer left it: bump the minimum PHP version in a `composer.json` without touching its dependencies or formatting, fix the PHP matrix in one workflow, add a Dependabot rule only where it makes sense. The diff you review is those few lines and nothing else.

No new toolchain, no state files to babysit, just code the whole team can read, understand, and extend.

## Same quality bar, everywhere

Here's what it buys us. Every PHP repo in the org now shares **one** quality baseline:

- The same **code style** (PHP CS Fixer) and the same **automated refactoring** (Rector)
- The same **PHP version policy** and support matrix (8.3, 8.4, 8.5)
- The same **static analysis** (PHPStan) and the same CI checks

No more "well, that module is a bit different." Learn one Maho repo and you know them all, and every change, in the core or in the tiniest module, is held to the exact same standard before it ships.

## Security, all the way down

The big one is **supply-chain hardening**.

In March 2025 a lot of teams got a nasty surprise. Attackers compromised a popular GitHub Action, `tj-actions/changed-files`, by **rewriting its version tags**, so anyone pointing at it by tag suddenly pulled different code on their next build. Around **23,000 repositories** were hit. **Maho wasn't one of them**, but it's exactly the kind of risk we don't want to leave to luck.

So we shut that door completely. Across every repo, each GitHub Action is now pinned to a full, immutable **commit hash** instead of a tag that can move under your feet:

```yaml
# a tag is just a label, and labels can be moved
- uses: actions/checkout@v6

# a commit hash is a fingerprint of the exact code
- uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10  # v6.0.3
```

A tag can be rewritten. A commit hash can't. That whole class of attack simply has nowhere to land, and **Dependabot** keeps the pins fresh automatically as real new releases come out.

On top of that, every repo has **dependency alerts** and **automated security updates** turned on. We even take care of the old corners: a small compatibility module re-encrypts data coming from legacy Magento 1 stores with modern **libsodium** crypto, so moving onto Maho is easy *and* safe.

## What this means for your store

Honestly? You'll probably never notice any of it, and that's the point. Every piece of the platform running your shop, core, modules, tools, is built to the same standard and the same security baseline, with no weak link drifting off on its own.

And because Maho is **fully open source**, you don't have to take our word for it. The `infrastructure` repo, every rule it enforces and every pinned action, is right there on GitHub for you or your security team to read. Try getting that out of a closed SaaS platform.

Maho rocks! 🚀
