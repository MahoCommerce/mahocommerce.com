# REST & GraphQL API (v2) <span class="version-badge">v26.7+ · beta</span>

> **Base URL:** `https://your-domain.com/api`
> **Entry Point:** `public/rest.php` (bootstraps Maho + Symfony API Platform)

!!! info "Beta status"
    The v2 API ships fully tested and production-hardened, but it is published as **beta for its first release cycle**: field names, endpoint shapes, and GraphQL types may still receive small refinements based on real-world integrator feedback before the contract is frozen. Any such change will be listed in the release notes. If you hit a rough edge, please [open an issue](https://github.com/MahoCommerce/maho/issues).

Maho's v2 API is built on [API Platform](https://api-platform.com/) and exposes the storefront and admin domains over both REST and GraphQL. The pages below cover authentication, request conventions, the full endpoint catalogue, error handling, and how to extend the API from third-party modules.

## Contents

- [Authentication](authentication.md)
- [Conventions](conventions.md) - request headers, pagination, HTTP caching, idempotency keys
- [GraphQL](graphql.md)
- [Endpoints](endpoints.md)
- [Error Responses](errors.md)
- [CAPTCHA](captcha.md)
- [Architecture](architecture.md) - base classes, opt-in traits, shared services
- [API Documentation (Swagger UI / OpenAPI)](openapi.md)
- [Web Server Configuration](web-server.md)
- [Extending & Deployment](extending.md) - adding resources, third-party modules, deployment notes
