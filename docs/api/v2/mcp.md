---
description: Expose Maho's catalog, inventory, pricing, orders and customers to AI agents over the Model Context Protocol, with the same JWT tokens and permissions as REST.
---

# MCP (Model Context Protocol) <span class="version-badge">v26.9+</span>

Maho speaks the [Model Context Protocol](https://modelcontextprotocol.io/), so AI assistants and agents can read and operate on your store the same way they use any other MCP server.

**Endpoint:** `POST /api/mcp`
**Transport:** streamable HTTP
**Authentication:** the same JWT bearer token as [REST](authentication.md)

There is nothing to configure per tool. The tool catalogue is derived from the [same resource metadata](extending.md) that drives REST and GraphQL, so every resource, including those added by third-party modules, becomes a set of tools the moment it is installed. A default install exposes around 160 of them across catalog, inventory, sales, customers, content, tax and system.

!!! info "Same gates as REST"
    A tool call runs through the identical provider/processor pipeline as the matching REST request, which means it inherits the operation's `security:` expression, the caller's role permissions, admin ACL, write logging and rate limiting. A call is refused exactly when the same REST request would be. There is no separate permission surface to audit.

## Enabling it

MCP is off by default, like every other protocol.

1. Go to **System → Configuration → Services → API → API Protocols**.
2. Set **MCP (Model Context Protocol)** to *Yes*.
3. Create a token for the agent, see [Authentication](authentication.md). A `client_credentials` service account scoped to just the resources the agent needs is the right choice here, not an admin token.

If you serve Maho with nginx, Caddy, or anything other than the bundled Apache config, add `/api/mcp` to your API location block, see [Web Server Configuration](web-server.md). The bundled `public/.htaccess` already routes it.

!!! warning "Remote clients need the host allowlist"
    The MCP SDK ships DNS-rebinding protection that, left at its default, only answers requests whose `Host` is localhost. Maho populates the allowlist from your store's base URLs automatically, but it does so when the API container is compiled. **After changing a base URL or adding a store, clear `var/cache/api_platform`** or remote calls will fail with an opaque transport error. The same already applies to the CORS allowlist, see [Cache invalidation](extending.md#cache-invalidation).

## Connecting a client

The handshake is a normal JSON-RPC `initialize` call. The response carries a `Mcp-Session-Id` header that every subsequent message must echo back.

=== "curl"

    ```bash
    # 1. Handshake, note the Mcp-Session-Id response header
    curl -i -X POST https://your-domain.com/api/mcp \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -H 'Accept: application/json, text/event-stream' \
      -H 'MCP-Protocol-Version: 2025-06-18' \
      -d '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
          "protocolVersion": "2025-06-18",
          "capabilities": {},
          "clientInfo": {"name": "my-agent", "version": "1.0"}
        }
      }'

    # 2. List the tools this token can call
    curl -X POST https://your-domain.com/api/mcp \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -H 'Accept: application/json, text/event-stream' \
      -H 'MCP-Protocol-Version: 2025-06-18' \
      -H 'Mcp-Session-Id: THE_SESSION_ID' \
      -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}'

    # 3. Call one
    curl -X POST https://your-domain.com/api/mcp \
      -H 'Authorization: Bearer YOUR_TOKEN' \
      -H 'Content-Type: application/json' \
      -H 'Accept: application/json, text/event-stream' \
      -H 'MCP-Protocol-Version: 2025-06-18' \
      -H 'Mcp-Session-Id: THE_SESSION_ID' \
      -d '{
        "jsonrpc": "2.0",
        "id": 3,
        "method": "tools/call",
        "params": {"name": "catalog_products_get", "arguments": {"id": 394}}
      }'
    ```

=== "Client config"

    Most MCP clients take a remote server URL plus custom headers. The shape varies by client, but the two things you always need are the URL and the bearer token:

    ```json
    {
      "mcpServers": {
        "maho": {
          "type": "http",
          "url": "https://your-domain.com/api/mcp",
          "headers": {
            "Authorization": "Bearer YOUR_TOKEN"
          }
        }
      }
    }
    ```

!!! note "Static tokens only"
    Maho's MCP endpoint authenticates with the same static bearer token as the rest of the v2 API. It does **not** implement MCP's OAuth 2.1 / protected-resource-metadata discovery flow, so it works with clients that let you set a custom header, and not with clients that insist on driving an OAuth dance. `GET /api/mcp` returns `405`; the endpoint is POST (plus `DELETE` to end a session and `OPTIONS` for preflight).

## Server instructions

`initialize` returns an `instructions` string that orients the model before it touches anything. It is generated from your store's own configuration and states the store name, the currency prices are quoted in, that IDs are Maho entity IDs rather than SKUs or increment IDs, that store views are selected by store code, and that list tools are paginated.

## Tool names

Names are derived from the resource's section, the static segments of its URI, and the operation verb:

```
catalog_products_list
catalog_products_get
catalog_products_create
catalog_products_update
catalog_products_delete
sales_orders_list
checkout_carts_items_gift_message_update
```

The verbs are `list`, `get`, `create`, `update` and `delete`. Path variables are dropped, so a collection and its item differ only by `list` versus `get`.

These names are the protocol's wire identity: an agent's saved prompts and a client's tool allow-lists both key off them, so they are treated as stable. A resource whose section, URI or shortName changes will change its tool names, exactly as it would change its REST paths.

A representative slice of the catalogue:

| Section | Examples |
|---|---|
| Catalog | `catalog_products_*`, `catalog_categories_*`, `catalog_product_attributes_*`, `catalog_attribute_sets_*` |
| Inventory | `catalog_inventory_update`, `catalog_inventory_bulk_update`, `catalog_stocks_get` |
| Sales | `sales_orders_*`, `sales_orders_invoices_list`, `sales_orders_credit_memos_*`, `sales_orders_shipments_*`, `sales_coupons_*` |
| Customers | `customers_customers_*`, `customers_addresses_*`, `customers_customer_groups_*`, `customers_carts_*` |
| Content | `content_cms_pages_*`, `content_cms_blocks_*`, `content_blog_posts_*` |
| Tax | `tax_tax_rates_*`, `tax_tax_rules_*`, `tax_tax_classes_*` |
| System | `system_stores_*`, `system_countries_*` |

Call `tools/list` against your own install for the authoritative list; it reflects the modules you actually have.

## What a tool looks like

Each tool advertises a right-sized input schema rather than the whole resource:

- **item read or delete** takes just the identifier
- **list** takes `page` and `itemsPerPage`
- **create or update** takes the resource body, with identifiers merged in

```json
{
  "name": "catalog_products_get",
  "title": "Product",
  "description": "Get a product by ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "id": {
        "type": ["string", "integer"],
        "description": "Identifies the Product to act on."
      }
    },
    "required": ["id"]
  },
  "annotations": {
    "readOnlyHint": true,
    "destructiveHint": false,
    "idempotentHint": true,
    "openWorldHint": false
  }
}
```

The [annotation hints](https://modelcontextprotocol.io/specification/server/tools) let clients decide when to ask the user for confirmation. Reads are marked `readOnlyHint`, deletes are the only operations marked `destructiveHint`, and creates are the only ones marked non-idempotent.

Results come back as JSON text plus `structuredContent`, in the same JSON-LD shape REST returns, so a list tool includes `totalItems` alongside `member`:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "isError": false,
    "content": [{"type": "text", "text": "{\"@context\":\"/api/contexts/Product\",\"@type\":\"Collection\",\"totalItems\":85,\"member\":[…]}"}],
    "structuredContent": {"@type": "Collection", "totalItems": 85, "member": []}
  }
}
```

## Pagination and filtering

`tools/list` is cursor-paginated. Follow `nextCursor` until it is absent; a client that reads only the first page will see a fraction of the catalogue.

List *tools* paginate too. Pass `page` and `itemsPerPage` as arguments; they reach the resource exactly as the equivalent REST query parameters would, so any filter a resource supports over REST also works as a tool argument even when it is not in the advertised schema.

## Tool visibility

`tools/list` is filtered to what the calling token can actually use, so an agent is not shown a catalogue it will be refused from. An unauthenticated caller sees only the public read tools; a service account sees the resources its role grants.

This is a usability measure, not the security boundary. Enforcement happens on the call itself, and a tool that is hidden is also refused. Filtering is deliberately optimistic: where the verdict cannot be reached without loading the entity, for instance a customer-scoped resource that compares the loaded record against the token, the tool stays listed.

## Denials

A refused call comes back as a JSON-RPC error with the reason in the message:

```json
{"jsonrpc": "2.0", "id": 3, "error": {"code": -32603, "message": "Your admin role does not grant access to \"sales/order\"."}}
```

```json
{"jsonrpc": "2.0", "id": 3, "error": {"code": -32603, "message": "Authentication required: send a Maho API bearer token with the MCP request."}}
```

## Keeping a resource out of the catalogue

Module authors can opt a resource out of tool derivation without touching its REST surface. Useful for upload endpoints, auth handshakes, and anything an agent has no business calling:

```php
#[ApiResource(
    mahoMcp: false,
    shortName: 'MediaUpload',
    operations: [ /* … */ ],
)]
class MediaUpload { }
```

Declaring `mcp:` explicitly on the attribute also disables derivation for that resource, leaving you in full control of its tools. See [Extending & Deployment](extending.md).

## Not the same as the Intelligence MCP server

Maho ships a second, unrelated MCP server in the `Maho_Intelligence` module. That one is **developer-facing**: it runs over stdio and exposes config paths, events, class aliases and database introspection so an AI coding assistant can understand how an install is wired. The endpoint documented here is **merchant-facing**: it runs over HTTP and exposes store data and operations. They share no transport, no tools and no configuration.
