# Catalog Product Link

## Introduction

Allows you to manage links for products (including related), cross-sells, upsells and grouped.

<h3>Resource Name</h3>

- `catalog_product_link`

<h3>Alias</h3>

- `product_link`

<h3>Methods</h3>

- `catalog_product_link.list` — Retrieve products linked to the specified product.
- `catalog_product_link.assign` — Link a product to another product.
- `catalog_product_link.update` — Update a product link.
- `catalog_product_link.remove` — Remove a product link.
- `catalog_product_link.types` — Retrieve product link types.
- `catalog_product_link.attributes` — Retrieve product link type attributes.

<h3>Faults</h3>

| Fault Code | Fault Message                                 |
|------------|-----------------------------------------------|
| 100        | Given invalid link type.                      |
| 101        | Product not exists.                           |
| 102        | Invalid data given. Details in error message. |
| 104        | Product link not removed.                     |

<h3>Example — Working With Product Links</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

// Get list of related products
var_dump($proxy->call($sessionId, 'product_link.list', ['related', 'sku']));

// Assign related product
$proxy->call($sessionId, 'product_link.assign', ['related', 'sku', 'sku2', ['position' => 0, 'qty' => 56]]);

var_dump($proxy->call($sessionId, 'product_link.list', ['related', 'sku']));

// Update related product
$proxy->call($sessionId, 'product_link.update', ['related', 'sku', 'sku2', ['position' => 2]]);

var_dump($proxy->call($sessionId, 'product_link.list', ['related', 'sku']));

// Remove related product
$proxy->call($sessionId, 'product_link.remove', ['related', 'sku', 'sku2']);

var_dump($proxy->call($sessionId, 'product_link.list', ['related', 'sku']));
```

## List

<h3>Method</h3>

- `catalog_product_link.list` (SOAP V1)
- `catalogProductLinkList` (SOAP V2)

Allows you to retrieve the list of linked products for a specific product.

<h3>Alias</h3>

- `product_link.list`

<h3>Arguments</h3>

| Type   | Name           | Description                                                                |
|--------|----------------|----------------------------------------------------------------------------|
| string | sessionId      | Session ID                                                                 |
| string | type           | Type of the link (cross_sell, up_sell, related, or grouped)                |
| string | productId      | Product ID or SKU                                                          |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type  | Name   | Description                       |
|-------|--------|-----------------------------------|
| array | result | Array of catalogProductLinkEntity |

<h3>Content `catalogProductLinkEntity`</h3>

| Type   | Name       | Description           |
|--------|------------|-----------------------|
| string | product_id | Product ID            |
| string | type       | Type of the link      |
| string | set        | Product attribute set |
| string | sku        | Product SKU           |
| string | position   | Position              |
| string | qty        | Quantity              |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_link.list', ['type' => 'related', 'product' => '1']);
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductLinkList($sessionId, 'related', '1');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductLinkList(
    (object)[
        'sessionId' => $sessionId->result,
        'type' => 'related',
        'productId' => '1'
    ]
);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'product_id' => string '3' (length=1)
      'type' => string 'simple' (length=6)
      'set' => string '4' (length=1)
      'sku' => string 'canonxt' (length=7)
      'position' => string '1' (length=1)
  1 =>
    array
      'product_id' => string '4' (length=1)
      'type' => string 'simple' (length=6)
      'set' => string '4' (length=1)
      'sku' => string 'canon_powershot' (length=15)
      'position' => string '0' (length=1)
```

## Assign

<h3>Method</h3>

- `catalog_product_link.assign` (SOAP V1)
- `catalogProductLinkAssign` (SOAP V2)

Allows you to assign a product link (cross_sell, grouped, related, or up_sell) to another product.

<h3>Alias</h3>

- `product_link.assign`

<h3>Arguments</h3>

| Type   | Name            | Description                                                                |
|--------|-----------------|----------------------------------------------------------------------------|
| string | sessionId       | Session ID                                                                 |
| string | type            | Type of the link (cross_sell, grouped, related, or up_sell)                |
| string | productId       | Product ID or SKU                                                          |
| string | linkedProductId | Product ID or SKU for the link                                             |
| array  | data            | Array of catalogProductLinkEntity                                          |
| string | identifierType  | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type    | Description                                 |
|---------|---------------------------------------------|
| boolean | True if the link is assigned to the product |

<h3>Content `catalogProductLinkEntity`</h3>

| Type   | Name       | Description                                                 |
|--------|------------|-------------------------------------------------------------|
| string | product_id | Product ID                                                  |
| string | type       | Type of the link (cross_sell, grouped, related, or up_sell) |
| string | set        | Product attribute set                                       |
| string | sku        | Product SKU                                                 |
| string | position   | Position of the product                                     |
| string | qty        | Quantity of products                                        |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apikey');

$result = $client->call(
    $session,
    'catalog_product_link.assign',
    [
        'type' => 'related',
        'product' => '1',
        'linkedProduct' => '4'
    ]
);
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductLinkAssign($sessionId, 'related', '1', '4');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductLinkAssign(
    (object)[
        'sessionId' => $sessionId->result,
        'type' => 'related',
        'productId' => '1',
        'linkedProductId' => '4'
    ]
);
var_dump($result->result);
```

## Update

<h3>Method</h3>

- `catalog_product_link.update` (SOAP V1)
- `catalogProductLinkUpdate` (SOAP V2)

Allows you to update the product link.

<h3>Alias</h3>

- `product_link.update`

<h3>Arguments</h3>

| Type   | Name            | Description                                                                |
|--------|-----------------|----------------------------------------------------------------------------|
| string | sessionId       | Session ID                                                                 |
| string | type            | Type of the link (cross_sell, grouped, related, or up_sell)                |
| string | productId       | Product ID or SKU                                                          |
| string | linkedProductId | Product ID or SKU for the link                                             |
| array  | data            | Array of catalogProductLinkEntity                                          |
| string | identifierType  | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type       | Name   | Description                     |
|------------|--------|---------------------------------|
| booleanint | result | True (1) if the link is updated |

<h3>Content `catalogProductLinkEntity`</h3>

| Type   | Name       | Description           |
|--------|------------|-----------------------|
| string | product_id | Product ID            |
| string | type       | Type of the link      |
| string | set        | Product attribute set |
| string | sku        | Product SKU           |
| string | position   | Position              |
| string | qty        | Quantity              |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$productId = '1';
$linkedProductId = '2';
$data = [
	'position' => '50'
];

$result = $proxy->call(
	$session,
	'catalog_product_link.update',
	[
		'cross_sell',
		$productId,
		$linkedProductId,
		$data
	]
);
```

<h4>Request Example SOAP V2</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$data = [
   'position' => 15
  ];

$identifierType = 'product_id';
$type = 'related';
$product = '1';
$linkedProduct = '3';

$orders = $client->catalogProductLinkUpdate(
    $session,
    $type,
    $product,
    $linkedProduct,
    $data,
    $identifierType
);

echo 'Number of results: ' . count($orders) . '<br>';
var_dump($orders);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductLinkUpdate(
    (object)[
        'sessionId' => $sessionId->result,
        'type' => 'cross_sell',
        'productId' => '1',
        'linkedProductId' => '2',
        'data' => (object)[
            'position' => '1'
        ]
    ]
);
var_dump($result->result);
```

## Remove

<h3>Method</h3>

- `catalog_product_link.remove` (SOAP V1)
- `catalogProductLinkRemove` (SOAP V2)

Allows you to remove the product link from a specific product.

<h3>Alias</h3>

- `product_link.remove`

<h3>Arguments</h3>

| Type   | Name            | Description                                                                |
|--------|-----------------|----------------------------------------------------------------------------|
| string | sessionId       | Session ID                                                                 |
| string | type            | Type of the link (cross_sell, up_sell, related, or grouped)                |
| string | productId       | Product ID or SKU                                                          |
| string | linkedProductId | Product ID or SKU for the link                                             |
| string | identifierType  | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type       | Description                                    |
|------------|------------------------------------------------|
| booleanint | True (1) if the link is removed from a product |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'catalog_product_link.remove',
    [
        'type' => 'related',
        'product' => '1',
        'linkedProduct' => '4'
    ]
);
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductLinkRemove($sessionId, 'related', '1', '4');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductLinkRemove(
    (object)[
        'sessionId' => $sessionId->result,
        'type' => 'related',
        'productId' => '1',
        'linkedProductId' => '4'
    ]
);
var_dump($result->result);
```

## Types

<h3>Method</h3>

- `catalog_product_link.types` (SOAP V1)
- `catalogProductLinkTypes` (SOAP V2)

Allows you to retrieve the list of product link types.

<h3>Alias</h3>

- `product_link.types`

<h3>Arguments</h3>

| Type   | Name      | Description |
|--------|-----------|-------------|
| string | sessionId | Session ID  |

<h3>Returns</h3>

| Type          | Name   | Description         |
|---------------|--------|---------------------|
| ArrayOfString | result | Array of link types |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'product_link.types');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductLinkTypes($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductLinkTypes((object)['sessionId' => $sessionId->result]);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 => string 'related' (length=7)
  1 => string 'up_sell' (length=7)
  2 => string 'cross_sell' (length=10)
  3 => string 'grouped' (length=7)
```

## Attributes

<h3>Method</h3>

- `catalog_product_link.attributes` (SOAP V1)
- `catalogProductLinkAttributes` (SOAP V2)

Allows you to retrieve the product link type attributes.

<h3>Alias</h3>

- `product_link.attributes`

<h3>Arguments</h3>

| Type   | Name      | Description                                                 |
|--------|-----------|-------------------------------------------------------------|
| string | sessionId | Session ID                                                  |
| string | type      | Type of the link (cross_sell, up_sell, related, or grouped) |

<h3>Returns</h3>

| Type  | Name   | Description                                |
|-------|--------|--------------------------------------------|
| array | result | Array of catalogProductLinkAttributeEntity |

<h3>Content `catalogProductLinkAttributeEntity`</h3>

| Type   | Name | Description    |
|--------|------|----------------|
| string | code | Attribute code |
| string | type | Attribute type |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_link.attributes', 'related');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductLinkAttributes($sessionId, 'related');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductLinkAttributes((object)['sessionId' => $sessionId->result, 'type' => 'related']);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'code' => string 'position' (length=8)
      'type' => string 'int' (length=3)
```
