# Extending & Deployment <span class="version-badge">v26.7+</span>

## Adding a New API Resource

Resources are declared with **one** attribute: `#[\Maho\Config\ApiResource]`, a drop-in subclass of `\ApiPlatform\Metadata\ApiResource` that adds Maho's permission-registry metadata alongside API Platform's HTTP/GraphQL configuration. Use it instead of `\ApiPlatform\Metadata\ApiResource` on every DTO.

```php
namespace MyVendor\MyModule\Api;

use Maho\Config\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource(
    shortName: 'WidgetType',
    operations: [
        new Get(uriTemplate: '/widget-types/{id}', security: 'true'),
        new GetCollection(uriTemplate: '/widget-types', security: 'true'),
    ],
    mahoPublicRead: true,                                    // optional override
    mahoSection: 'Widgets',                                  // optional override
    mahoOperations: ['read' => 'View Widget Types'],         // optional override
)]
final class WidgetType { /* ApiProperty fields */ }
```

After adding or modifying the attribute, run `composer dump-autoload`. The compiler walks every class carrying `#[Maho\Config\ApiResource]` (anywhere in `app/code/` or installed packages) and emits `vendor/composer/maho_api_permissions.php`, which `Maho\ApiPlatform\Security\ApiPermissionRegistry` reads at runtime to drive `ApiUserVoter` (REST permission checks), `GraphQlPermissionListener` (GraphQL checks), and the admin role editor UI.

### Auto-derivation

Most permission-registry fields are derived from the API Platform metadata on the same attribute, set them explicitly only when defaults are wrong:

| Maho field         | Derived from when omitted                                          |
|--------------------|--------------------------------------------------------------------|
| `mahoId`           | `shortName` → kebab-case + plural (`Cart` → `carts`, `CmsPage` → `cms-pages`) |
| `mahoLabel`        | Title-cased `mahoId` (`cms-pages` → `CMS Pages`; ≤3-char segments are upper-cased as acronyms) |
| `mahoSection`      | Module segment of the namespace (`Mage\Catalog\Api\Foo` → `'Catalog'`) |
| `mahoOperations`   | One entry per operation type present in `operations: [...]`. Default labels: `read`/`create`/`write`/`delete` → `View`/`Create`/`Update`/`Delete` |
| `mahoRestSegments` | The resource id itself. Augmented (not replaced) by your override, declare only the *additional* segments (e.g. Cart adds `'guest-carts'`) |
| `mahoGraphQlFields`| Each camelCase `name:` from `graphQlOperations[]`. Snake_case names (`item_query`, `add_cart_item`) are skipped, those are API Platform's internal operation identifiers, not schema fields. Augmented by your override for handler-defined fields (e.g. mutations declared in `*MutationHandler` classes the compiler can't see) |
| `mahoPublicRead`   | `true` when every read operation has `security: 'true'`. Override explicitly only if your read security expression doesn't use that literal form |
| `mahoCustomerScoped` | No equivalent, must be explicit for resources bound to a logged-in customer (carts, wishlists, addresses, etc.) |

For customer-scoped resources, the parent's `description:` doubles as admin-UI prose, the compiler reads it via `getDescription()` and surfaces it in the role editor. Write it as action-oriented prose ("View cart, add/remove items, apply coupons, set shipping & payment") so it's useful for both API docs and admins.

### Forward-looking resources (no DTO yet)

Permissions for endpoints you plan to build but haven't shipped go on a stub class with `operations: []` (explicit empty, *not* `null`, which would trigger API Platform's CRUD defaults). API Platform sees the resource but registers zero routes; only the maho fields populate the permission registry. Delete the stub when the real DTO ships.

```php
namespace MyVendor\MyModule\PermissionStubs;

use Maho\Config\ApiResource;

#[ApiResource(
    operations: [],
    mahoId: 'widget-attributes',
    mahoLabel: 'Widget Attributes',
    mahoSection: 'Widgets',
    mahoOperations: ['read' => 'View', 'write' => 'Edit'],
)]
final class WidgetAttributes {}
```

### Multiple `#[ApiResource]` on one class

The attribute is repeatable, a single class can carry several declarations with different `uriTemplate` / `operations` sets that share one permission identity (the Cms `Media` DTO uses this pattern for `/media` and `/media/{path}`). Just give each attribute the same `mahoId` and the compiler unions their segments and GraphQL fields under one registry entry.

## Extending the API (Third-Party Modules)

All API resources extend `\Maho\ApiPlatform\Resource`, which provides an `extensions` field, an open array where modules can inject additional data without modifying core API files. The base class also provides a `toArray()` method for serializing DTOs (used by GraphQL handlers).

Providers build DTOs via `toDto($model)` (the abstract method on the `Provider` base class). A handful of providers (Order, Category, Address, Customer, Product, Cart) also expose a public `mapToDto()` method with domain-specific extra arguments, used directly from GraphQL handlers and custom processors when they need a consistent representation including extensions.

### How It Works

Every resource DTO (Product, Category, Cart, Order, etc.) dispatches a Maho event after building the response object. Your module observes the event and appends data to `$dto->extensions`. These events fire for both **REST and GraphQL**, the GraphQL handlers use the same Provider/Mapper DTO-building methods as REST, ensuring consistent behavior across both APIs.

### Event area: `api`

The API Platform loads a dedicated `api` event area (`Mage_Core_Model_App_Area::AREA_API`), similar to `frontend` and `adminhtml`. Observers registered under `<api><events>` in `config.xml` only load when the API is running, they won't fire on regular frontend, admin, or cron requests.

### Available Events

| Event | Dispatched In | Observer Parameters |
|-------|---------------|---------------------|
| `api_product_dto_build` | ProductProvider | `product` (model), `for_listing` (bool), `dto` |
| `api_category_dto_build` | CategoryProvider | `category` (model), `dto` |
| `api_store_config_dto_build` | StoreConfigProvider | `dto` |
| `api_order_dto_build` | OrderProvider | `order` (model), `dto` |
| `api_order_item_dto_build` | OrderProvider | `item` (model), `dto` |
| `api_customer_dto_build` | CustomerProvider | `customer` (model), `dto` |
| `api_cart_dto_build` | CartMapper | `quote` (model), `dto` |
| `api_cart_item_dto_build` | CartMapper | `item` (model), `dto` |
| `api_wishlist_item_dto_build` | WishlistProvider | `dto` |
| `api_captcha_config` | ApiPlatform Helper | `config` (DataObject) |
| `api_verify_captcha` | ApiPlatform Helper | `result` (DataObject), `data` (array) |

### Quick Example: Simple Bundles Module

A module that adds bundle component data to products and cart items.

**1. Register the observer** in your module's `config.xml`:

```xml
<config>
    <api>
        <events>
            <api_product_dto_build>
                <observers>
                    <simple_bundles>
                        <class>Vendor_SimpleBundles_Model_Api_Observer</class>
                        <method>addBundleToProduct</method>
                    </simple_bundles>
                </observers>
            </api_product_dto_build>
            <api_cart_item_dto_build>
                <observers>
                    <simple_bundles>
                        <class>Vendor_SimpleBundles_Model_Api_Observer</class>
                        <method>addBundleToCartItem</method>
                    </simple_bundles>
                </observers>
            </api_cart_item_dto_build>
        </events>
    </api>
</config>
```

**2. Write the observer:**

```php
class Vendor_SimpleBundles_Model_Api_Observer
{
    public function addBundleToProduct(\Maho\Event\Observer $observer): void
    {
        $product = $observer->getEvent()->getProduct();
        $dto = $observer->getEvent()->getDto();

        // Only add bundle data on detail view, not listings
        if ($observer->getEvent()->getForListing()) {
            return;
        }

        $bundleItems = Mage::getModel('simplebundles/item')
            ->getCollection()
            ->addProductFilter($product->getId());

        if ($bundleItems->count() === 0) {
            return;
        }

        $dto->extensions['simpleBundle'] = [
            'items' => array_map(fn ($item) => [
                'sku' => $item->getSku(),
                'name' => $item->getName(),
                'qty' => (int) $item->getQty(),
            ], $bundleItems->getItems()),
        ];
    }

    public function addBundleToCartItem(\Maho\Event\Observer $observer): void
    {
        $quoteItem = $observer->getEvent()->getItem();
        $dto = $observer->getEvent()->getDto();

        $bundleData = $quoteItem->getOptionByCode('simple_bundle_data');
        if (!$bundleData) {
            return;
        }

        $dto->extensions['simpleBundle'] = json_decode($bundleData->getValue(), true);
    }
}
```

**3. API response** now includes the extension data:

```json
{
  "id": 42,
  "sku": "OUTFIT-SUMMER",
  "name": "Summer Festival Outfit",
  "price": 189.95,
  "extensions": {
    "simpleBundle": {
      "items": [
        {"sku": "DRESS-FLR-M", "name": "Floral Midi Dress", "qty": 1},
        {"sku": "HAT-STRAW", "name": "Wide Brim Straw Hat", "qty": 1},
        {"sku": "SANDAL-TAN-8", "name": "Tan Leather Sandals", "qty": 1}
      ]
    }
  }
}
```

### Guidelines

- **Namespace your data**, use a unique key in `extensions` (e.g. `simpleBundle`, not `items`)
- **Keep it lightweight**, avoid loading heavy collections in listing mode (check `for_listing`)
- **Return serializable data**, arrays and scalars only, no objects
- **Extensions are read-only**, the `extensions` field is populated during read operations; for write operations, use standard Maho model events or custom API processors

## Deployment Notes

### Filesystem permissions

The Symfony kernel writes its compiled container, route table, and metadata cache to `var/cache/api_platform/{env}/` (where `{env}` is `prod` or `dev`). The directory must be writable by the PHP-FPM/Apache user that handles `/api/*` requests. On a fresh deploy:

```bash
mkdir -p var/cache/api_platform
chown -R www-data:www-data var/cache var/log
```

### Cache pre-warm

The first request after a deploy pays a one-time container compilation cost (~hundreds of ms). To keep that out of the critical path, warm the cache during deployment:

```bash
# As the web user, after `composer install` and before flipping the load balancer:
php -r 'require "vendor/autoload.php"; Mage::app(); $k = new Maho\ApiPlatform\Kernel("prod", false); $k->boot();'
```

Run this whenever module API resources change (new/modified `#[ApiResource]` classes), in addition to `composer dump-autoload` which refreshes the permission registry compiled file.

### Cache invalidation

The container cache is keyed by class file mtimes; a normal deploy that overwrites files invalidates it automatically. If you ever need to force a rebuild manually, delete `var/cache/api_platform/{env}/`, the next request will recompile.
