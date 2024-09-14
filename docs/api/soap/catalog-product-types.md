# Catalog Product Types

## Introduction

Allows you to retrieve product types.

<h3>Resource Name</h3>

- `catalog_product_type`

<h3>Alias</h3>

- `product_type`

<h3>Method</h3>

- `catalog_product_type.list` — Retrieve the list of product types.

<h3>Example — Retrieving the Product Type</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$types = $proxy->call($sessionId, 'product_type.list');
var_dump($types);
```

## List

<h3>Method</h3>

- `catalog_product_type.list` (SOAP V1)
- `catalogProductTypeList` (SOAP V2)

Allows you to retrieve the list of product types.

<h3>Alias</h3>

- `product_type.list`

<h3>Arguments</h3>

| Type   | Name      | Description |
|--------|-----------|-------------|
| string | sessionId | Session ID  |

<h3>Returns</h3>

| Type  | Name   | Description                       |
|-------|--------|-----------------------------------|
| array | result | Array of catalogProductTypeEntity |

<h3>Content `catalogProductTypeEntity`</h3>

| Type   | Name  | Description                      |
|--------|-------|----------------------------------|
| string | type  | Product type                     |
| string | label | Product label in the Admin Panel |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_type.list');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductTypeList($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductTypeList((object)['sessionId' => $sessionId->result]);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'type' => string 'simple' (length=6)
      'label' => string 'Simple Product' (length=14)
  1 =>
    array
      'type' => string 'grouped' (length=7)
      'label' => string 'Grouped Product' (length=15)
  2 =>
    array
      'type' => string 'configurable' (length=12)
      'label' => string 'Configurable Product' (length=20)
  3 =>
    array
      'type' => string 'virtual' (length=7)
      'label' => string 'Virtual Product' (length=15)
  4 =>
    array
      'type' => string 'bundle' (length=6)
      'label' => string 'Bundle Product' (length=14)
  5 =>
    array
      'type' => string 'downloadable' (length=12)
      'label' => string 'Downloadable Product' (length=20)
```
