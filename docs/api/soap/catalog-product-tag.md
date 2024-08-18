# Catalog Product Tag

Allows you to operate with product tags.

**Resource**: catalog_product_tag

**Aliases**: product_tag

**Methods:**

- product_tag.list - Retrieve the list of tags by the product ID
- product_tag.info - Retrieve information about a product tag
- product_tag.add - Add one or more tags to a product
- product_tag.update - Update an existing product tag
- product_tag.remove - Remove a product tag

## Faults:

| Fault Code | Fault Message |
| --- | --- |
| 101 | Requested store does not exist. |
| 102 | Requested product does not exist. |
| 103 | Requested customer does not exist. |
| 104 | Requested tag does not exist. |
| 105 | Provided data is invalid. |
| 106 | Error while saving tag. Details in error message. |
| 107 | Error while removing tag. Details in error message. |

## Example:

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$productId = 2;
$customerId = 10002;
$store = 'default';

// Add tags
$data = array('product_id' => $productId, 'store' => $store, 'customer_id' => $customerId, 'tag' => "First 'Second tag' Third");
echo "Adding Tag... ";
$addResult = $proxy->call(
    $sessionId,
    "product_tag.add",
    array($data)
);
echo ((count($addResult) == 3) ? "Done!" : "Fail!");
echo "<br />";
print_r($addResult);
$tagId = reset($addResult);

// Get tag info
echo "<br />Get Tag Info (id = $tagId)... ";
$infoResult = $proxy->call(
    $sessionId,
    "product_tag.info",
    array($tagId, $store)
);
echo "Done!<br />";
print_r($infoResult);

// Update tag data
$data = array('status' => -1, 'base_popularity' => 12, 'name' => 'Changed name');
echo "<br />Update Tag (id = $tagId)... ";
$updateResult = $proxy->call(
    $sessionId,
    "product_tag.update",
    array($tagId, $data, $store)
);
echo ($updateResult ? "Done!" : "Fail!");

// Retrieve list of tags by product
echo "<br />Tag list for product with id = $productId... ";
$listResult = $proxy->call(
    $sessionId,
    "product_tag.list",
    array($productId, $store)
);
echo (count($listResult) ? "Done!" : "Fail!");
echo "<br />";
print_r($listResult);

// Remove existing tag
echo "<br />Remove Tag (id = $tagId)... ";
$removeResult = $proxy->call(
    $sessionId,
    "product_tag.remove",
    array($tagId)
);
echo ($removeResult ? "Done!" : "Fail!");
```

## Catalog Product Tag List

**Method:**

-   catalog_product_tag.list (SOAP V1)
-   catalogProductTagList (SOAP V2)

Allows you to retrieve the list of tags for a specific product.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | productId | Product ID |
| string | store | Store view code or ID |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogProductTagListEntity |

The **catalogProductTagListEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | tag_id | Tag ID |
| string | name | Tag name |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 101 | Requested store does not exist. |
| 102 | Requested product does not exist. |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_tag.list', array('productId' => '4', 'store' => '2'));
var_dump ($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogProductTagList($sessionId, '4', '2');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductTagList((object)array('sessionId' => $sessionId->result, 'productId' => '4', 'store' => '2'));
var_dump($result->result);
```

**Response Example SOAP V1**

```php
array
  3 =>
    array
      'tag_id' => string '3' (length=1)
      'name' => string 'canon' (length=5)
  4 =>
    array
      'tag_id' => string '4' (length=1)
      'name' => string 'digital' (length=7)
```

## Catalog Product Tag Info

**Method:**

-   catalog_product_tag.info (SOAP V1)
-   catalogProductTagInfo (SOAP V2)

Allows you to retrieve information about the required product tag.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | tagId | Tag ID |
| string | store | Store view code or ID |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogProductTagInfoEntity |

The **catalogProductTagInfoEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | name | Tag name |
| string | status | Tag status |
| string | base_popularity | Tag base popularity for a specific store |
| associativeArray | products | Associative array of tagged products with related product ID as a key and popularity as a value |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 101 | Requested store does not exist. |
| 104 | Requested tag does not exist. |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_tag.info', array('tagId' => '4', 'store' => '2'));
var_dump ($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogProductTagInfo($sessionId, '4', '2');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductTagInfo((object)array('sessionId' => $sessionId->result, 'tagId' => '4', 'store' => '2'));
var_dump($result->result);
```

**Response Example SOAP V1**

```php
array
  'status' => string '1' (length=1)
  'name' => string 'digital' (length=7)
  'base_popularity' => int 0
  'products' =>
    array
      1 => string '1' (length=1)
      3 => string '1' (length=1)
      4 => string '1' (length=1)
```

## Catalog Product Tag Add

**Method:**

-   catalog_product_tag.add (SOAP V1)
-   catalogProductTagAdd (SOAP V2)

Allows you to add one or more tags to a product.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| array | data | Array of catalogProductTagAddEntity |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| array | result | Associative array of added tags with the tag name as a key and the tag ID as a value |

The **catalogProductTagAddEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | tag | Tag to be added (can contain several tags separated with white spaces). A tag that contains several words should be enclosed in single quotes. |
| string | product_id | Product ID |
| string | customer_id | Customer ID |
| string | store | Store ID |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 101 | Requested store does not exist. |
| 102 | Requested product does not exist. |
| 103 | Requested customer does not exist. |
| 105 | Provided data is invalid. |
| 106 | Error while saving tag. Details in error message. |

### Examples

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$data = array('product_id' => 2, 'store' => 'default', 'customer_id' => 10002, 'tag' => "First 'Second tag' Third");
echo "Adding Tag... ";
$addResult = $proxy->call(
    $sessionId,
    "product_tag.add",
    array($data)
);
echo ((count($addResult) == 3) ? "Done!" : "Fail!");
echo "<br />";
print_r($addResult);
```

**Request Example SOAP V2**

```
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$result = $proxy->catalogProductTagAdd($sessionId, array(
    'tag' => 'album',
    'product_id' => '3',
    'customer_id' => '1',
    'store' => '0'
));
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductTagAdd((object)array('sessionId' => $sessionId->result, 'data' => ((object)array(
    'tag' => 'album',
    'product_id' => '3',
    'customer_id' => '1',
    'store' => '0'
))));
var_dump($result->result);
```

## Catalog Product Tag Update

**Method:**

-   catalog_product_tag.update (SOAP V1)
-   catalogProductTagUpdate (SOAP V2)

Allows you to update information about an existing product tag.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | tagId | ID of the tag to be updated |
| array | data | Array of catalogProductTagUpdateEntity |
| string | store | Store view code or ID (optional; required for WS-I compliance mode) |

**Return:**

| Type | Description |
| --- | --- |
| boolean | True if the product tag is updated |

The **catalogProductTagUpdateEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | name | Tag name |
| string | status | Tag status. Can have the following values: -1 - Disabled, 0 - Pending, 1- Approved |
| string | base_popularity | Tag base popularity |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 101 | Requested store does not exist. |
| 104 | Requested tag does not exist. |
| 105 | Provided data is invalid. |
| 106 | Error while saving tag. Details in error message. |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_tag.update', array('tagId' => '4', 'data' => array('name' => 'digital_1')));
var_dump ($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login('apiUser', 'apiKey'); 
 
$result = $proxy->catalogProductTagUpdate($sessionId, '1', array(
    'name' => 'tag',
    'status' => '1'
));   
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductTagUpdate((object)array('sessionId' => $sessionId->result, 'tagId' => '1', 'store' => '0', 'data' => ((object)array(
    'name' => 'tag',
    'status' => '1',
    'base_popularity' => null
))));
var_dump($result->result);
```

## Catalog Product Tag Remove

**Method:**

-   catalog_product_tag.remove (SOAP V1)
-   catalogProductTagRemove (SOAP V2)

Allows you to remove an existing product tag.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | tagId | Tag ID |

**Return:**

| Type | Description |
| --- | --- |
| boolean/int | True (1) if the product tag is removed |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 104 | Requested tag does not exist. |
| 107 | Error while removing tag. Details in error message. |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_tag.remove', '3');
var_dump ($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogProductTagRemove($sessionId, '3');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductTagRemove((object)array('sessionId' => $sessionId->result, 'tagId' => '3'));
var_dump($result->result);
```