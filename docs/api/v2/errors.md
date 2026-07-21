---
description: Understand Maho v2 API error responses - JSON bodies with error, message, and code fields, optional details, and the HTTP status codes explained.
---

# Error Responses <span class="version-badge">v26.7+</span>

All errors return JSON with an appropriate HTTP status code:

```json
{
  "error": "validation_error",
  "message": "Email and password are required",
  "code": 400
}
```

| Field | Description |
|-------|-------------|
| `error` | Stable, machine-readable error code in snake_case. Dispatch on this, not on `message`. |
| `message` | Human-readable explanation, safe to surface in logs or UIs. |
| `code` | The HTTP status code, mirrored in the body for convenience. |
| `details` | Optional object with extra context, e.g. `{"field": "sku", "constraint": "NotBlank"}` on validation errors. |
| `debug` | Only present in developer mode: exception class, file, line, and trace. Never emitted in production. |

Some endpoints emit domain-specific `error` codes beyond the status-derived ones in the table below (e.g. `invalid_client`, `invalid_credentials`, `unsupported_grant_type` from the token endpoint, or `invalid_coupon` from the cart), and every `401` carries a `WWW-Authenticate: Bearer` header.

## Status codes and their error codes

| Status | `error` | Meaning |
|--------|---------|---------|
| 400 | `bad_request`, `validation_error`, `invalid_request` | Malformed or invalid request data |
| 401 | `unauthorized`, `invalid_client` | Authentication required or credentials rejected |
| 403 | `forbidden` | Authenticated but lacking permission for this operation |
| 404 | `not_found` | Resource or route does not exist |
| 405 | `method_not_allowed` | HTTP method not supported on this route |
| 409 | `conflict` | Conflict (e.g. duplicate idempotency key race condition) |
| 422 | `unprocessable_entity` | The request is well-formed but a business rule rejected it (e.g. a [revocation submission](endpoints.md#revocation-eu) past the cooling-off window, or an invalid `processedStatus` value) |
| 429 | `too_many_requests` | The client hit a rate limit (e.g. on guest order lookup, which is IP rate-limited) |
| 500 | `internal_server_error` | Unexpected server error; in production the message is generic and the exception is logged server-side |
| 502 / 503 | `bad_gateway` / `service_unavailable` | Upstream or availability problems |

If a protocol is disabled in **System > Configuration > Services > API Platform**, any request to it returns `{"error": "protocol_disabled", ...}` regardless of path.
