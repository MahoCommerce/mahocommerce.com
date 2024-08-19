# Catalog Product Types

Allows you to retrieve product types.

**Resource Name**: catalog_product_type

**Aliases**:

-   product_type

**Methods**:

- catalog_product_type.list - Retrieve the list of product types

## Examples

**Example 1. Retrieving the product types**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$types = $proxy->call($sessionId, 'product_type.list');
var_dump($types);
```

## Catalog Product Types List

**Method:**

-   catalog_product_type.list (SOAP V1)
-   catalogProductTypeList (SOAP V2)

Allows you to retrieve the list of product types.

**Aliases:**

-   product_type.list

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogProductTypeEntity |

The **catalogProductTypeEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | type | Product type |
| string | label | Product label in the Admin Panel |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_type.list');
var_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogProductTypeList($sessionId);
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductTypeList((object)array('sessionId' => $sessionId->result));
var_dump($result->result);
```

**Response Example SOAP V1**

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