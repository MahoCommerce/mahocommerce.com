---
description: How the Maho team uses generative AI alongside human work - guardrails, tests and maintainer review of every PR - and why AI-only changes are never merged.
---

# GenAI transparency

Maho is built by a small team competing in a heavyweight championship, something that
traditionally would have needed entire engineering departments behind it. Generative AI is a big
part of what makes this realistic, and what allows us to deliver ambitious features along with
refactoring, modernization, testing, and documentation, on a small budget and with volunteer
effort. We don't hide this and we don't apologize for it. It is an added value of the project, the
superpower of our developers and maintainers. Even with AI in the loop, a huge amount of human
work still goes into Maho every day: defining specs, designing features, reviewing code, steering
the roadmap, addressing issues, managing the community, and keeping the lights on. AI amplifies
that effort, it doesn't replace it.

## How we use AI

AI tools are used alongside human work for writing and refactoring code, expanding the test suite,
drafting documentation and translations, and helping triage pull requests, often highlighting
spots the human eye would have missed. Our primary tool is Claude Code with Anthropic's Claude
family of models, plus DeepWiki for code exploration; we use them under terms that allow producing
output under Maho's OSL-3.0 license.

## Guardrails and human review

We built a big set of automated guardrails (PHPStan, PHP CS Fixer, Rector, and more) and an
expanding set of tests to keep AI in check (and to help it produce better results), before our
maintainers review and validate every part of every PR with no exception, to always deliver the
highest quality in the industry. We never merge purely AI-generated changes.

## For contributors

If you're a contributor, AI use in your PRs is welcome. We don't require an explicit disclosure,
but you are expected to understand and stand behind the code you submit, just as you would with any
other contribution.
