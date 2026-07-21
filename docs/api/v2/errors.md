---
description: Understand Maho v2 API error responses - JSON error bodies with type, title, and detail fields, plus the HTTP status codes from 400 to 500 explained.
---

# Error Responses <span class="version-badge">v26.7+</span>

All errors return JSON with an appropriate HTTP status code:

```json
{
  "type": "https://tools.ietf.org/html/rfc2616#section-10",
  "title": "An error occurred",
  "status": 400,
  "detail": "SKU is required"
}
```

The `type` field is a machine-readable identifier, the human-readable explanation is in `detail`. For validation failures, `detail` contains the message of the first failed constraint (e.g. `"SKU is required"`).

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 405 | Method not allowed |
| 409 | Conflict (e.g. duplicate idempotency key race condition) |
| 422 | Unprocessable entity - the request is well-formed but a business rule rejected it (e.g. a [revocation submission](endpoints.md#revocation-eu) past the cooling-off window, or an invalid `processedStatus` value) |
| 429 | Too many requests - the client hit a rate limit (e.g. on guest order lookup, which is IP rate-limited) |
| 500 | Internal server error |
