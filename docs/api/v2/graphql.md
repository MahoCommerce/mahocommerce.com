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

### Field naming

API Platform derives every **custom** GraphQL field name as `lcfirst(operationName + ResourceShortName)` — the resource noun is always appended. Only the reserved item/collection queries escape this and yield the clean singular/plural (`product` / `products`, `order` / `orders`). So a custom operation named `setPaymentMethodOn` on the `Cart` resource becomes the field `setPaymentMethodOnCart`; operations are named with a natural qualifier (a verb, or `on`/`to`/`from`/`my`/`guest`/`current`) so the appended noun reads well rather than stuttering.

Two consequences worth knowing when reading the [Endpoints](endpoints.md) reference:

- **The signed-in customer is `currentCustomer`** (not `me`), and a guest cart/order is `guestCart` / `guestOrder`.
- **Attribute lookups are collection filter arguments, not separate `by<X>` queries.** To fetch by a natural key, filter the collection: `products(sku:)`, `products(barcode:)`, `categories(urlKey:)`, `productAttributes(code:)`, `cmsPages(identifier:)`, `cmsBlocks(identifier:)` — each returns the 0-or-1 match.
