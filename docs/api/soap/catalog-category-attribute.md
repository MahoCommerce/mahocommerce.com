## Introduction

Allows you to retrieve the list of category attributes and options.

**Methods:**

- catalog_category_attribute.currentStore – Set/Get the current store view
- catalog_category_attribute.list – Retrieve the category attributes
- catalog_category_attribute.options – Retrieve the attribute options

**Faults**


| Fault Code | Fault Message                      |
|------------|------------------------------------|
| 100        | Requested store view not found.    |
| 101        | Requested attribute not found.     |

**Examples**:

**Example 1. Retrieving attributes and options**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');
$attributes = $proxy->call($sessionId, 'category_attribute.list');
foreach ($attributes as &$attribute) {
   if (isset($attribute['type'])
       && ($attribute['type'] == 'select' || $attribute['type'] == 'multiselect')) {
       $attribute['options'] = $proxy->call($sessionId, 'category_attribute.options', $attribute['code']);
   }
}
var_dump($attributes);
```

## Current Store

**Method:**

- catalog_category_attribute.currentStore (SOAP V1)
- catalogCategoryAttributeCurrentStore (SOAP V2)

Allows you to set/get the current store view.

**Aliases:**

- category_attribute.currentStore

**Arguments:**

| Type   | Name      | Description              |
|--------|-----------|--------------------------|
| string | sessionId | Session ID               |
| string | storeView | Store view ID or code    |

**Returns:**

| Type | Name      | Description     |
|------|-----------|-----------------|
| int  | storeView | Store view ID   |


**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_category_attribute.currentStore', 'english');
var_dump($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryAttributeCurrentStore($sessionId, 'english');
var_dump($result);
```

## Attribute List

**Method:**

-   catalog_category_attribute.list (SOAP V1)
-   catalogCategoryAttributeList (SOAP V2)

Allows you to retrieve the list of category attributes.

**Aliases:**

-   category_attribute.list

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogAttributeEntity |

The **catalogAttributeEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | attribute_id | Attribute ID |
| string | code | Attribute code |
| string | type | Attribute type |
| string | required | Defines whether the attribute is required |
| string | scope | Attribute scope: global, website, or store |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_category_attribute.list',);
var_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryAttributeList($sessionId);
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$client = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$session = $client->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $client->catalogCategoryAttributeList((object)array('sessionId' => $session->result));
var_dump($result);
```

**Response Example SOAP V1**

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

**Method:**

-   catalog_category_attribute.options (SOAP V1)
-   catalogCategoryAttributeOptions (SOAP V2)

Allows you to retrieve the attribute options.

**Aliases:**

-   category_attribute.options

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | attributeId | Attribute ID or code |
| string | storeView | Store view ID or code |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogAttributeOptionEntity |

The **catalogAttributeOptionEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | label | Option label |
| string | value | Option value |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_category_attribute.options', '65');
var_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryAttributeOptions($sessionId, '65');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$client = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$session = $client->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $client->catalogCategoryAttributeOptions((object)array('sessionId' => $session->result, 'attributeId' => '65'));
var_dump($result);
```

**Response Example SOAP V1**

```php
array
    0 => array
        'label' => string 'Yes' (length=3)
        'value' => int 1
    1 => array
        'label' => string 'No' (length=2)
        'value' => int 0
```
