# Authentication <span class="version-badge">v26.7+</span>

### JWT Token Authentication

All authenticated endpoints require a Bearer token in the `Authorization` header.

**Get a token:**

The endpoint dispatches by `grant_type`. Supported grants: `customer` (default), `client_credentials`, `api_user`.

```bash
# Customer login (grant_type defaults to "customer")
curl -X POST /api/rest/v2/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"email": "customer@example.com", "password": "password123"}'

# OAuth2 client_credentials (recommended for integrations)
curl -X POST /api/rest/v2/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"grant_type": "client_credentials", "client_id": "...", "client_secret": "..."}'

# Legacy API user (username + api_key)
curl -X POST /api/rest/v2/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"grant_type": "api_user", "username": "admin", "api_key": "..."}'
```

**Response:**
```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "customer": {"id": 1, "email": "...", "firstName": "...", "lastName": "..."}
}
```

`customer` is populated for the `customer` grant; `apiUser` and `permissions` are populated for `client_credentials` / `api_user` grants. There is no separate `refresh_token` field, call `/auth/refresh` with the existing JWT in the `Authorization` header to get a new token.

**Use the token:**
```bash
curl /api/rest/v2/products \
  -H 'Authorization: Bearer eyJ...'
```

**Refresh a token:** send the current (still-valid) JWT as a Bearer token; the body is ignored.
```bash
curl -X POST /api/rest/v2/auth/refresh \
  -H 'Authorization: Bearer eyJ...'
```

**Other auth endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rest/v2/auth/logout` | Revoke the current token |

Password reset and "current customer" live under the Customer resource, see [Customers](endpoints.md#customers).

### Permission Levels

| Level | Access |
|-------|--------|
| **Public** | Store config, countries, categories, products, CMS, blog |
| **Customer** | Own cart, orders, addresses, wishlist, reviews |
| **Admin / API** | All resources, CRUD on products, orders, inventory, coupons, credit memos, shipments |
