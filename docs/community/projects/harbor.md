---
description: "Harbor by Empirico: a Docker-based local development environment for Maho with a Bash CLI around Docker Compose, Xdebug, Mailpit, cron and Dev Containers support."
---

[Harbor](https://github.com/empiricompany/harbor){target=_blank} by
[Empirico](https://github.com/empiricompany){target=_blank}
is a Docker-based local development environment for Maho. It installs as a Composer
dev dependency and gives you a small Bash CLI around Docker Compose.

Harbor is for local development only. It is not a production deployment tool.

Some features of Harbor:

- One-command setup: `composer require --dev empiricompany/harbor`, then `harbor init` and `harbor up`
- Wrapper commands for `php`, `composer`, `maho`, `mysql` and `redis` inside the containers
- Xdebug included in the app image, with a dedicated `harbor debug` command
- Maho cron groups run automatically through Ofelia
- Mailpit included by default, with optional Redis, Adminer and phpMyAdmin profiles
- Project-owned Compose override layers for custom services
- VS Code Dev Containers generation
- A `harbor doctor` command that checks Docker, Compose and the running services

To get started, run from your Maho project root:

```bash
composer require --dev empiricompany/harbor
./vendor/bin/harbor init
./vendor/bin/harbor up -d
./vendor/bin/harbor doctor
```

[Check Harbor :fontawesome-brands-github:](https://github.com/empiricompany/harbor){target=_blank .md-button .md-button--primary}
