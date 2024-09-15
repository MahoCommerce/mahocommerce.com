# Catalog Category Attribute

## Introduction

Allows you to retrieve the list of category attributes and options.

<h3>Methods</h3>

- `catalog_category_attribute.currentStore` — Set/Get the current store view.
- `catalog_category_attribute.list` — Retrieve the category attributes.
- `catalog_category_attribute.options` — Retrieve the attribute options.

<h3>Faults</h3>

| Fault Code | Fault Message                      |
|------------|------------------------------------|
| 100        | Requested store view not found.    |
| 101        | Requested attribute not found.     |

<h3>Example — Retrieving Attributes and Options</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');
$attributes = $proxy->call($sessionId, 'category_attribute.list');
foreach ($attributes as &$attribute) {
    $attributeType = $attribute['type'];
    if (isset($attributeType)
        && ($attributeType === 'select' || $attributeType === 'multiselect')) {
        $attribute['options'] = $proxy->call($sessionId, 'category_attribute.options', $attribute['code']);
    }
}
var_dump($attributes);
```

## Current Store

<h3>Method</h3>

- `catalog_category_attribute.currentStore` (SOAP V1)
- `catalogCategoryAttributeCurrentStore` (SOAP V2)

Allows you to set/get the current store view.

<h3>Alias</h3>

- `category_attribute.currentStore`

<h3>Arguments</h3>

| Type   | Name      | Description           |
|--------|-----------|-----------------------|
| string | sessionId | Session ID            |
| string | storeView | Store view ID or code |

<h3>Returns</h3>

| Type | Name      | Description   |
|------|-----------|---------------|
| int  | storeView | Store view ID |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_category_attribute.currentStore', 'english');
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogCategoryAttributeCurrentStore($sessionId, 'english');
var_dump($result);
```

## Attribute List

<h3>Method</h3>

- `catalog_category_attribute.list` (SOAP V1)
- `catalogCategoryAttributeList` (SOAP V2)

Allows you to retrieve the list of category attributes.

<h3>Alias</h3>

- `category_attribute.list`

<h3>Arguments</h3>

| Type   | Name      | Description |
|--------|-----------|-------------|
| string | sessionId | Session ID  |

<h3>Returns</h3>

| Type  | Name   | Description                     |
|-------|--------|---------------------------------|
| array | result | Array of catalogAttributeEntity |

<h3>Content `catalogAttributeEntity`</h3>

| Type   | Name         | Description                                     |
|--------|--------------|-------------------------------------------------|
| int    | attribute_id | Attribute ID                                    |
| string | code         | Attribute code                                  |
| string | type         | Attribute type                                  |
| string | required     | Defines whether the attribute is required       |
| string | scope        | Attribute scope: `global`, `website` or `store` |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_category_attribute.list');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogCategoryAttributeList($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $client->catalogCategoryAttributeList((object)['sessionId' => $session->result]);
var_dump($result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 => array
    'attribute_id' => null
    'code' => string 'parent_id' (length=9)
    'type' => null
    'required' => null
    'scope' => string 'global' (length=6)
  1 => array
    'attribute_id' => null
    'code' => string 'increment_id' (length=12)
    'type' => null
    'required' => null
    'scope' => string 'global' (length=6)
  2 => array
    'attribute_id' => null
    'code' => string 'updated_at' (length=10)
    'type' => null
    'required' => null
    'scope' => string 'global' (length=6)
```

## Attribute Options

<h3>Method</h3>

- `catalog_category_attribute.options` (SOAP V1)
- `catalogCategoryAttributeOptions` (SOAP V2)

Allows you to retrieve the attribute options.

<h3>Alias</h3>

- `category_attribute.options`

<h3>Arguments</h3>

| Type   | Name        | Description           |
|--------|-------------|-----------------------|
| string | sessionId   | Session ID            |
| string | attributeId | Attribute ID or code  |
| string | storeView   | Store view ID or code |

<h3>Returns</h3>

| Type  | Name   | Description                           |
|-------|--------|---------------------------------------|
| array | result | Array of catalogAttributeOptionEntity |

<h3>Content `catalogAttributeOptionEntity`</h3>

| Type   | Name  | Description  |
|--------|-------|--------------|
| string | label | Option label |
| string | value | Option value |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_category_attribute.options', '65');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogCategoryAttributeOptions($sessionId, '65');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $client->catalogCategoryAttributeOptions(
    (object)[
        'sessionId' => $session->result,
        'attributeId' => '65'
    ]
);
var_dump($result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 => array
    'label' => string 'Yes' (length=3)
    'value' => int 1
  1 => array
    'label' => string 'No' (length=2)
    'value' => int 0
```
