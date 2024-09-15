# Catalog Inventory

## Introduction

<h3>Methods</h3>

- `cataloginventory_stock_item.list` — Retrieve the list of stock data by product IDs.
- `cataloginventory_stock_item.update` — Update the stock data for a list of products.

<h3>Faults</h3>

| Fault Code | Fault Message                                            |
|------------|----------------------------------------------------------|
| 101        | Product not exists.                                      |
| 102        | Product inventory not updated. Details in error message. |

<h3>Examples</h3>

Change the `manage_stock` setting to `Off` in the `Inventory` area.

```php
$attributeSets = $client->call(
    $session,
    'product_stock.update',
    [
        'sku',
        [
            'manage_stock' => '0',
            'use_config_manage_stock' => '0'
        ]
    ]
);
```

`use_config_manage_stock` unchecks the `Use Config Settings` box which allows you to make changes to this product
and not to use the global settings that are set by default.

<h4>Working With Stock Update</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

// Get stock info
var_dump($proxy->call($sessionId, 'product_stock.list', 'sku'));

// Update stock info
$proxy->call(
    $sessionId,
    'product_stock.update',
    [
        'sku',
        [
            'qty' => 50,
            'is_in_stock' => 1
        ]
    ]
);

var_dump($proxy->call($sessionId, 'product_stock.list', 'sku'));
```

<h4>Listing Multiple SKUs' Data</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$sid = $client->login('apiUser', 'apiKey');

print_r(
    $client->call(
        $sid,
        'product_stock.list',
        [
            // Notice the nested array
            [
                'sku1',
                'sku2',
                'sku3',
                ...
                'skuN'
            ]
        ]
    )
);
```

## Item List

<h3>Method</h3>

- `cataloginventory_stock_item.list` (SOAP V1)
- `catalogInventoryStockItemList` (SOAP V2)

Allows you to retrieve the list of stock data by product IDs.

<h3>Alias</h3>

- `product_stock.list`

<h3>Arguments</h3>

| Type          | Name                                | Description                 |
|---------------|-------------------------------------|-----------------------------|
| string        | sessionId                           | Session ID                  |
| ArrayOfString | products/productIds (for WS-I mode) | List of product IDs or SKUs |

<h3>Returns</h3>

| Type  | Name   | Description                              |
|-------|--------|------------------------------------------|
| array | result | Array of catalogInventoryStockItemEntity |

<h3>Content `catalogInventoryStockItemEntity`</h3>

| Type   | Name        | Description                             |
|--------|-------------|-----------------------------------------|
| string | product_id  | Product ID                              |
| string | sku         | Product SKU                             |
| string | qty         | Product quantity                        |
| string | is_in_stock | Defines whether the product is in stock |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'cataloginventory_stock_item.list', '1');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogInventoryStockItemList($sessionId, ['1', '2']);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->catalogInventoryStockItemList(
    (object)[
        'sessionId' => $sessionId->result,
        'productIds' => [1, 2]
    ]
);   
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'product_id' => string '1' (length=1)
      'sku' => string 'n2610' (length=5)
      'qty' => string '98.0000' (length=7)
      'is_in_stock' => string '1' (length=1)
```

## Item Update

<h3>Method</h3>

- `cataloginventory_stock_item.update` (SOAP V1)
- `catalogInventoryStockItemUpdate` (SOAP V2)

Allows you to update the required product stock data.

<h3>Alias</h3>

- `product_stock.update`

<h3>Arguments</h3>

| Type   | Name               | Description                                    |
|--------|--------------------|------------------------------------------------|
| string | sessionId          | Session ID                                     |
| string | product\\productId | Product ID or SKU                              |
| array  | data               | Array of catalogInventoryStockItemUpdateEntity |

<h3>Returns</h3>

| Type | Name   | Description                   |
|------|--------|-------------------------------|
| int  | result | Result of stock item updating |

<h3>Content `catalogInventoryStockItemUpdateEntity`</h3>

| Type   | Name                        | Description                                                                    |
|--------|-----------------------------|--------------------------------------------------------------------------------|
| string | qty                         | Quantity of items to be updated                                                |
| int    | is_in_stock                 | Defines whether the item is in stock                                           |
| int    | manage_stock                | Manage stock flag                                                              |
| int    | use_config_manage_stock     | Use config manage stock                                                        |
| int    | min_qty                     | Minimum quantity for items to be in stock                                      |
| int    | use_config_min_qty          | Use config settings flag (value defined in the Inventory System Configuration) |
| int    | min_sale_qty                | Minimum quantity allowed in the shopping cart                                  |
| int    | use_config_min_sale_qty     | Use config settings flag                                                       |
| int    | max_sale_qty                | Maximum quantity allowed in the shopping cart                                  |
| int    | use_config_max_sale_qty     | Use config settings flag                                                       |
| int    | is_qty_decimal              | Defines whether the quantity is decimal                                        |
| int    | backorders                  | Backorders status                                                              |
| int    | use_config_backorders       | Use config settings flag (for backorders)                                      |
| int    | notify_stock_qty            | Stock quantity below which a notification will appear                          |
| int    | use_config_notify_stock_qty | Use config settings flag (for stock quantity)                                  |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$productId = '1';
$stockItemData = [
    'qty' => '100',
    'is_in_stock ' => 1,
    'manage_stock ' => 1,
    'use_config_manage_stock' => 0,
    'min_qty' => 2,
    'use_config_min_qty ' => 0,
    'min_sale_qty' => 1,
    'use_config_min_sale_qty' => 0,
    'max_sale_qty' => 10,
    'use_config_max_sale_qty' => 0,
    'is_qty_decimal' => 0,
    'backorders' => 1,
    'use_config_backorders' => 0,
    'notify_stock_qty' => 10,
    'use_config_notify_stock_qty' => 0
];

$result = $client->call(
    $session,
    'product_stock.update',
    [
        $productId,
        $stockItemData
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login('apiUser', 'apiKey'); 

$result = $proxy->catalogInventoryStockItemUpdate(
    $sessionId,
    1,
    [
        'qty' => '49', 
        'is_in_stock' => 1
    ]
);

var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->catalogInventoryStockItemUpdate(
    (object)[
        'sessionId' => $sessionId->result,
        'productId' => '1',
        'data' => [
            'qty' => '49',
            'is_in_stock' => 1
        ]
    ]
);   

var_dump($result->result);
```
