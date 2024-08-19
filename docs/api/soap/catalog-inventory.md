# Catalog Inventory

## Introduction

**Methods**:

- cataloginventory_stock_item.list - Retrieve the list of stock data by product IDs
- cataloginventory_stock_item.update - Update the stock data for a list of products

**Faults**:

| Fault Code | Fault Message |
| --- | --- |
| 101 | Product not exists. |
| 102 | Product inventory not updated. Details in error message. |

**Examples**:

Change manage_stock setting to ‘off’ in the inventory area.

```php
$attributeSets = $client->call($session, ‘product_stock.update’, array(’SKU’,array(’manage_stock’=>'0’,’use_config_manage_stock’=>'0’)));
```

The use_config_manage_stock unchecks the ‘Use Config Settings’ box which allows you to make changes to this product and not to use the global settings that are set by default.

**Example 1. Working with stock update**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

// Get stock info
var_dump($proxy->call($sessionId, 'product_stock.list', 'Sku'));

// Update stock info
$proxy->call($sessionId, 'product_stock.update', array('Sku', array('qty'=>50, 'is_in_stock'=>1)));

var_dump($proxy->call($sessionId, 'product_stock.list', 'Sku'));
```

**Example 2. Listing multiple SKUs' data**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$sid = $client->login('apiUser', 'apiKey');

print_r(
    $client->call(
        $sid,
        'product_stock.list',
        array(
            array( // Notice the nested array
                'sku1',
                'sku2',
                'sku3',
                ...
                'skuN'
            )
        )
    )
);
```

## Item List

**Method:**

-   cataloginventory_stock_item.list (SOAP V1)
-   catalogInventoryStockItemList (SOAP V2)

Allows you to retrieve the list of stock data by product IDs.

**Aliases**:

-   product_stock.list

**Arguments**:

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| ArrayOfString | products/productIds (for WS-I mode) | List of product IDs or SKUs |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogInventoryStockItemEntity |

The **catalogInventoryStockItemEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | product_id | Product ID |
| string | sku | Product SKU |
| string | qty | Product quantity |
| string | is_in_stock | Defines whether the product is in stock |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'cataloginventory_stock_item.list', '1');
var_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogInventoryStockItemList($sessionId, array('1', '2'));
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->catalogInventoryStockItemList((object)array('sessionId' => $sessionId->result, 'productIds' => array(1,2)));   
var_dump($result->result);
```

**Response Example SOAP V1**

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

**Method:**

-   cataloginventory_stock_item.update (SOAP V1)
-   catalogInventoryStockItemUpdate (SOAP V2)

Allows you to update the required product stock data.

**Aliases**:

-   product_stock.update

**Arguments**:

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | product\\productId | Product ID or SKU |
| array | data | Array of catalogInventoryStockItemUpdateEntity |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| int | result | Result of stock item updating |

The **catalogInventoryStockItemUpdateEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | qty | Quantity of items to be updated |
| int | is_in_stock | Defines whether the item is in stock |
| int | manage_stock | Manage stock flag |
| int | use_config_manage_stock | Use config manage stock |
| int | min_qty | Minimum quantity for items to be in stock |
| int | use_config_min_qty | Use config settings flag (value defined in the Inventory System Configuration) |
| int | min_sale_qty | Minimum quantity allowed in the shopping cart |
| int | use_config_min_sale_qty | Use config settings flag |
| int | max_sale_qty | Maximum quantity allowed in the shopping cart |
| int | use_config_max_sale_qty | Use config settings flag |
| int | is_qty_decimal | Defines whether the quantity is decimal |
| int | backorders | Backorders status |
| int | use_config_backorders | Use config settings flag (for backorders) |
| int | notify_stock_qty | Stock quantity below which a notification will appear |
| int | use_config_notify_stock_qty | Use config settings flag (for stock quantity) |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$productId = '1';
$stockItemData = array(
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
);

$result = $client->call(
    $session,
    'product_stock.update',
    array(
        $productId,
        $stockItemData
    )
);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login('apiUser', 'apiKey'); 
 
$result = $proxy->catalogInventoryStockItemUpdate($sessionId, 1, array(
    'qty' => '49', 
    'is_in_stock' => 1
));

var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->catalogInventoryStockItemUpdate((object)array('sessionId' => $sessionId->result, 'productId' => '1', 'data' => array(
    'qty' => '49', 
    'is_in_stock' => 1
)));   

var_dump($result->result);
```