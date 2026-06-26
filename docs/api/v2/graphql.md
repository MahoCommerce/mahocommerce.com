# GraphQL <span class="version-badge">v26.7+</span>

The API supports GraphQL via API Platform's built-in GraphQL support.

**Endpoint:** `POST /api/graphql`
**Admin GraphQL:** `POST /api/admin/graphql` (requires admin session)

```graphql
# Example: Get a product
query {
  product(id: "/api/rest/v2/products/123") {
    id
    sku
    name
    price
  }
}

# Example: Update stock
mutation {
  updateStock(input: {sku: "ABC-123", qty: 50}) {
    sku
    qty
    previousQty
    success
  }
}
```
