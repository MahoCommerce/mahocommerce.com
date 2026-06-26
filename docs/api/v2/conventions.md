# Conventions <span class="version-badge">v26.7+</span>

## Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | For auth endpoints | `Bearer <jwt_token>` |
| `Content-Type` | For POST/PUT/PATCH | `application/json` or `application/ld+json` |
| `Accept` | Optional | `application/json` (default) or `application/ld+json` |
| `X-Store-Code` | Optional | Switch store context (e.g. `default`, `au`) |
| `X-Idempotency-Key` | Optional | Replay protection for mutations (see below) |
| `X-Order-Token` | For guest order lookup | Per-order one-time token for `GET /orders/{incrementId}/details` |
| `If-None-Match` | Optional | ETag for conditional GETs (304 support) |

---

## Pagination

Collection endpoints support pagination via query parameters (REST) or arguments (GraphQL):

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | 1 | — | Page number |
| `itemsPerPage` (alias: `pageSize`) | 20 | 100 | Items per page |

**Response format depends on the negotiated content type:**

`application/json` (default): a JSON array of items. Total count and next-page links are returned via the `Link` header (`Link: <...?page=2>; rel="next"`).

`application/ld+json`: API Platform's Hydra format:

```json
{
  "@context": "/api/contexts/Product",
  "@id": "/api/rest/v2/products",
  "@type": "Collection",
  "totalItems": 150,
  "member": [...],
  "view": {
    "@id": "/api/rest/v2/products?page=1",
    "@type": "PartialCollectionView",
    "first": "/api/rest/v2/products?page=1",
    "last": "/api/rest/v2/products?page=8",
    "next": "/api/rest/v2/products?page=2"
  }
}
```

---

## HTTP Caching

The API automatically sets cache headers on GET responses:

| Endpoint Type | Cache-Control | Max-Age |
|---------------|---------------|---------|
| Public (unauthenticated) | `public` | 3600 (1 hour) |
| Auth collection | `private, must-revalidate` | 60 (1 min) |
| Auth single resource | `private, must-revalidate` | 300 (5 min) |

All responses include:
- `ETag` header (MD5 of response body)
- `Vary: Authorization, Accept`

**Conditional requests:**
```bash
# First request, note the ETag
curl -v /api/rest/v2/products/123
# < ETag: "abc123"

# Subsequent request, get 304 if unchanged
curl /api/rest/v2/products/123 -H 'If-None-Match: "abc123"'
# Returns 304 Not Modified (no body)
```

---

## Idempotency Keys

Protect against duplicate mutations by including `X-Idempotency-Key` on POST/PUT/PATCH requests. If the same key+user+path+method is seen again within 24 hours, the stored response is replayed.

```bash
# First request, processed normally
curl -X POST /api/rest/v2/orders/123/credit-memos \
  -H 'Authorization: Bearer eyJ...' \
  -H 'X-Idempotency-Key: refund-order-123-v1' \
  -H 'Content-Type: application/json' \
  -d '{"items": [{"orderItemId": 456, "qty": 1}]}'

# Duplicate request, returns stored response
curl -X POST /api/rest/v2/orders/123/credit-memos \
  -H 'Authorization: Bearer eyJ...' \
  -H 'X-Idempotency-Key: refund-order-123-v1' \
  -H 'Content-Type: application/json' \
  -d '{"items": [{"orderItemId": 456, "qty": 1}]}'
# Response includes: X-Idempotency-Replayed: true
```

**Key format:** 1-255 characters, alphanumeric + dashes + underscores (`[a-zA-Z0-9_-]`).
