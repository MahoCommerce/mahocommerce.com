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

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 405 | Method not allowed |
| 409 | Conflict (e.g. duplicate idempotency key race condition) |
| 500 | Internal server error |
