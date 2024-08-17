## Introduction

Allows you to manage categories and how products are assigned to categories.

**Methods**:

-   catalog_category.currentStore - Set/Get the current store view
-   catalog_category.tree - Retrieve the hierarchical category tree
-   catalog_category.level - Retrieve one level of categories by a website, store view, or parent category
-   catalog_category.info - Retrieve the category data
-   catalog_category.create - Create a new category
-   catalog_category.update - Update a category
-   catalog_category.move - Move a category in its tree
-   catalog_category.delete - Delete a category
-   catalog_category.assignedProducts - Retrieve a list of products assigned to a category
-   catalog_category.assignProduct - Assign product to a category
-   catalog_category.updateProduct - Update an assigned product
-   catalog_category.removeProduct - Remove a product assignment

**Faults**

| Fault Code | Fault Message |
| --- | --- |
| 100 | Requested store view not found. |
| 101 | Requested website not found. |
| 102 | Category not exists. |
| 103 | Invalid data given. Details in error message. |
| 104 | Category not moved. Details in error message. |
| 105 | Category not deleted. Details in error message. |
| 106 | Requested product is not assigned to category. |

### Examples

**Example 1. Working with categories**

```php
function getSomeRandomCategory(&$categories, $targetLevel, $currentLevel = 0) {
    if (count($categories)==0) {
        return false;
    }
    if ($targetLevel == $currentLevel) {
        return $categories\[array\_rand($categories)\];
    } else {
        return getSomeRandomCategory($categories\[array\_rand($categories)\]\['children'\], $targetLevel + 1);
    }
}

$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');
$allCategories = $proxy->call($sessionId, 'category.tree'); // Get all categories.

// select random category from tree
while (($selectedCategory = getSomeRandomCategory($allCategories, 3)) === false) {}

// create new category
$newCategoryId = $proxy->call(
$sessionId,
'category.create',
array(
$selectedCategory\['category\_id'\],
array(
'name'=>'Newopenerp',
'is\_active'=>1,
'include\_in\_menu'=>2,
'available\_sort\_by'=>'position',
'default\_sort\_by'=>'position'
)
)
);

$newData = array('is\_active'=>1);
// update created category on German store view
$proxy->call($sessionId, 'category.update', array($newCategoryId, $newData, 'german'));

$firstLevel = $proxy->call($sessionId, 'category.level', array(null, 'german', $selectedCategory\['category\_id'\]));

var\_dump($firstLevel);

// If you wish remove category, uncomment next line
//$proxy->call($sessionId, 'category.delete', $newCategoryId);
```

**Example 2. Working with assigned products**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$categoryId = 5; // Put here your category id
$storeId = 1; // You can add store level

$assignedProducts = $proxy->call($sessionId, 'category.assignedProducts', array($categoryId, $storeId));
var\_dump($assignedProducts); // Will output assigned products.

// Assign product
$proxy->call($sessionId, 'category.assignProduct', array($categoryId, 'someProductSku', 5));

// Update product assignment position
$proxy->call($sessionId, 'category.updateProduct', array($categoryId, 'someProductSku', 25));

// Remove product assignment
$proxy->call($sessionId, 'category.removeProduct', array($categoryId, 'someProductSku'));
```

## Assigned Products

**Method:**

-   catalog\_category.assignedProducts (SOAP V1)
-   catalogCategoryAssignedProducts (SOAP V2)

Retrieve the list of products assigned to a required category.

**Aliases:**

-   category.assignedProducts

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | ID of the required category |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogAssignedProduct |

The **catalogAssignedProduct** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | product\_id | ID of the assigned product |
| string | type | Product type |
| int | set | Attribute set ID |
| string | sku | Product SKU |
| int | position | Position of the assigned product |

### Examples
 
**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.assignedProducts', '4');
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryAssignedProducts($sessionId, '4');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryAssignedProducts((object)array('sessionId' => $sessionId->result, 'categoryId' => '4'));
var\_dump($result->result);
```

**Response Example SOAP V1**

```php
array
  0 =>
    array
      'product\_id' => string '1' (length=1)
      'type' => string 'simple' (length=6)
      'set' => string '4' (length=1)
      'sku' => string 'n2610' (length=5)
      'position' => string '1' (length=1)
  1 =>
    array
      'product\_id' => string '2' (length=1)
      'type' => string 'simple' (length=6)
      'set' => string '4' (length=1)
      'sku' => string 'b8100' (length=5)
      'position' => string '1' (length=1)
```

## Assign Product

**Method:**

-   catalog\_category.assignProduct (SOAP V1)
-   catalogCategoryAssignProduct (SOAP V2)

Assign a product to the required category.

**Aliases:**

-   category.assignProduct

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | ID of the category |
| string | product/productId | ID or SKU of the product to be assigned to the category |
| string | position | Position of the assigned product in the category (optional) |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' argument |

**Returns**:

| Type | Description |
| --- | --- |
| boolean | True if the product is assigned to the specified category |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.assignProduct', array('categoryId' => '4', 'product' => '1'));
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryAssignProduct($sessionId, '4', '3');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryAssignProduct((object)array('sessionId' => $sessionId->result, 'categoryId' => '5', 'productId' => '1', 'position' => '5'));
var\_dump($result->result);
```

## Create Category

**Method:**

-   catalog\_category.create (SOAP V1)
-   catalogCategoryCreate (SOAP V2)

Create a new category and return its ID.

**Aliases:**

-   category.create

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | parentId | Parent category ID |
| array | categoryData | Array of catalogCategoryEntityCreate |
| string | storeView | Store view ID or code (optional) |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| int | attribute\_id | ID of the created category |

The **categoryData** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | name | Name of the created category |
| int | is\_active | Defines whether the category will be visible in the frontend |
| int | position | Position of the created category (optional) |
| ArrayOfString | available\_sort\_by | All available options by which products in the category can be sorted |
| string | custom\_design | The custom design for the category (optional) |
| int | custom\_apply\_to\_products | Apply the custom design to all products assigned to the category (optional) |
| string | custom\_design\_from | Date starting from which the custom design will be applied to the category (optional) |
| string | custom\_design\_to | Date till which the custom design will be applied to the category (optional) |
| string | custom\_layout\_update | Custom layout update (optional) |
| string | default\_sort\_by | The default option by which products in the category are sorted |
| string | description | Category description (optional) |
| string | display\_mode | Content that will be displayed on the category view page (optional) |
| int | is\_anchor | Defines whether the category will be anchored (optional) |
| int | landing\_page | Landing page (optional) |
| string | meta\_description | Category meta description (optional) |
| string | meta\_keywords | Category meta keywords (optional) |
| string | meta\_title | Category meta title (optional) |
| string | page\_layout | Type of page layout that the category should use (optional) |
| string | url\_key | A relative URL path which can be entered in place of the standard target path (optional) |
| int | include\_in\_menu | Defines whether the category is visible on the top menu bar |
| string | filter\_price\_range | Price range of each price level displayed in the layered navigation block (optional) |
| int | custom\_use\_parent\_settings | Defines whether the category will inherit custom design settings of the category to which it is assigned. 1 - Yes, 0 - No (optional) |

**Notes**: The **position** parameter is deprecated, the category will be positioned anyway in the end of the list and you can not set the position directly. You should use the catalog\_category.move method instead. You cannot also assign a root category to the specified store.

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.create', array(2, array(
'name' => 'Category name',
'is\_active' => 1,
'position' => 1,
//<!-- position parameter is deprecated, category anyway will be positioned in the end of list
//and you can not set position directly, use catalog\_category.move instead -->
'available\_sort\_by' => 'position',
'custom\_design' => null,
'custom\_apply\_to\_products' => null,
'custom\_design\_from' => null,
'custom\_design\_to' => null,
'custom\_layout\_update' => null,
'default\_sort\_by' => 'position',
'description' => 'Category description',
'display\_mode' => null,
'is\_anchor' => 0,
'landing\_page' => null,
'meta\_description' => 'Category meta description',
'meta\_keywords' => 'Category meta keywords',
'meta\_title' => 'Category meta title',
'page\_layout' => 'two\_columns\_left',
'url\_key' => 'url-key',
'include\_in\_menu' => 1,
)));

var\_dump ($result);
```

**Request Example SOAP V2**

```php
$client = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->catalogCategoryCreate($session, 2, array(
'name' => 'Category name 2',
'is\_active' => 1,
'position' => 1,
//<!-- position parameter is deprecated, category anyway will be positioned in the end of list
//and you can not set position directly, use catalog\_category.move instead -->
'available\_sort\_by' => array('position'),
'custom\_design' => null,
'custom\_apply\_to\_products' => null,
'custom\_design\_from' => null,
'custom\_design\_to' => null,
'custom\_layout\_update' => null,
'default\_sort\_by' => 'position',
'description' => 'Category description',
'display\_mode' => null,
'is\_anchor' => 0,
'landing\_page' => null,
'meta\_description' => 'Category meta description',
'meta\_keywords' => 'Category meta keywords',
'meta\_title' => 'Category meta title',
'page\_layout' => 'two\_columns\_left',
'url\_key' => 'url-key',
'include\_in\_menu' => 1,
));

var\_dump ($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryCreate((object)array('sessionId' => $sessionId->result, 'parentId' => '5', 'categoryData' => ((object)array(
'name' => 'category',
'is\_active' => '1',
'position' => '1',
'available\_sort\_by' => array('position'),
'default\_sort\_by' => 'position',
'description' => 'Category description',
'is\_anchor' => '1',
'include\_in\_menu' => '1'
))));
var\_dump($result->result);
```

## Current Store

**Method:**

-   catalog\_category.currentStore (SOAP V1)
-   catalogCategoryCurrentStore (SOAP V2)

Allows you to set/get the current store view.

**Aliases:**

-   category.currentStore

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | storeView | Store view ID or code |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| int | storeView | Store view ID |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'category.currentStore', '1');
var\_dump ($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryCurrentStore($sessionId, '1');
var\_dump($result);
```

## Category Delete

**Method:**

-   catalog\_category.delete (SOAP V1)
-   catalogCategoryDelete (SOAP V2)

Allows you to delete the required category.

**Aliases:**

-   category.delete

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | ID of the category to be deleted |

**Returns**:

| Type | Description |
| --- | --- |
| boolean | True if the category is deleted |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.delete', '7');
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryDelete($sessionId, '7');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryDelete((object)array('sessionId' => $sessionId->result, 'categoryId' => '7'));
var\_dump($result->result);
```

## Category Info

**Method:**

-   catalog\_category.info (SOAP V1)
-   catalogCategoryInfo (SOAP V2)

Allows you to retrieve information about the required category.

**Aliases:**

-   category.info

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | Category ID |
| string | storeView | Store view ID or code (optional) |
| ArrayOfString | attributes | Array of attributes (optional) |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | info | Array of catalogCategoryInfo |

The **catalogCategoryInfo** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | category\_id | Category ID |
| int | is\_active | Defines whether the category is active |
| string | position | Category position |
| string | level | Category level |
| string | parent\_id | Parent category ID |
| string | all\_children | All child categories of the current category |
| string | children | Names of direct child categories |
| string | created\_at | Date when the category was created |
| string | updated\_at | Date when the category was updated |
| string | name | Category name |
| string | url\_key | A relative URL path which can be entered in place of the standard target path (optional) |
| string | description | Category description |
| string | meta\_title | Category meta title |
| string | meta\_keywords | Category meta keywords |
| string | meta\_description | Category meta description |
| string | path | Path |
| string | url\_path | URL path |
| int | children\_count | Number of child categories |
| string | display\_mode | Content that will be displayed on the category view page (optional) |
| int | is\_anchor | Defines whether the category is anchored |
| ArrayOfString | available\_sort\_by | All available options by which products in the category can be sorted |
| string | custom\_design | The custom design for the category (optional) |
| string | custom\_apply\_to\_products | Apply the custom design to all products assigned to the category (optional) |
| string | custom\_design\_from | Date starting from which the custom design will be applied to the category (optional) |
| string | custom\_design\_to | Date till which the custom design will be applied to the category (optional) |
| string | page\_layout | Type of page layout that the category should use (optional) |
| string | custom\_layout\_update | Custom layout update (optional) |
| string | default\_sort\_by | The default option by which products in the category are sorted |
| int | landing\_page | Landing page (optional) |
| int | include\_in\_menu | Defines whether the category is available on the Magento top menu bar |
| string | filter\_price\_range | Price range of each price level displayed in the layered navigation block |
| int | custom\_use\_parent\_settings | Defines whether the category will inherit custom design settings of the category to which it is assigned. 1 - Yes, 0 - No |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.info', '5');
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryInfo($sessionId, '5');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryInfo((object)array('sessionId' => $sessionId->result, 'categoryId' => '5'));
var\_dump($result->result);
```

**Response Example SOAP V1**

```php
array
  'category\_id' => string '5' (length=1)
  'is\_active' => string '1' (length=1)
  'position' => string '1' (length=1)
  'level' => string '2' (length=1)
  'parent\_id' => int 3
  'increment\_id' => null
  'created\_at' => string '2012-03-29 12:30:51' (length=19)
  'updated\_at' => string '2012-03-29 14:25:08' (length=19)
  'name' => string 'Mobile Phones' (length=13)
  'url\_key' => string 'mobile-phones' (length=13)
  'thumbnail' => null
  'description' => string 'Category for cell phones' (length=24)
  'image' => null
  'meta\_title' => string 'Cell Phones' (length=11)
  'meta\_keywords' => string 'cell, phone' (length=11)
  'meta\_description' => null
  'include\_in\_menu' => string '1' (length=1)
  'path' => string '1/3/4' (length=5)
  'all\_children' => string '4' (length=1)
  'path\_in\_store' => null
  'children' => string '' (length=0)
  'url\_path' => string 'mobile-phones.html' (length=18)
  'children\_count' => string '0' (length=1)
  'display\_mode' => string 'PRODUCTS' (length=8)
  'landing\_page' => null
  'is\_anchor' => string '1' (length=1)
  'available\_sort\_by' => null
  'default\_sort\_by' => null
  'filter\_price\_range' => null
  'custom\_use\_parent\_settings' => string '1' (length=1)
  'custom\_apply\_to\_products' => null
  'custom\_design' => null
  'custom\_design\_from' => null
  'custom\_design\_to' => null
  'page\_layout' => null
  'custom\_layout\_update' => null
```

## Category Level

**Method:**

-   catalog\_category.level (SOAP V1)
-   catalogCategoryLevel (SOAP V2)

Allows you to retrieve one level of categories by a website, a store view, or a parent category.

**Aliases:**

-   category.level

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | website | Website ID or code (optional) |
| string | storeView | Store view ID or code (optional) |
| string | parentCategory | Parent category ID (optional) |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | tree | Array of CatalogCategoryEntitiesNoChildren |

The **CatalogCategoryEntitityNoChildren** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | category\_id | Category ID |
| int | parent\_id | Parent category ID |
| string | name | Category name |
| int | is\_active | Defines whether the category is active |
| int | position | Category position |
| int | level | Category level |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.level');
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryLevel($sessionId);
var\_dump($result);
```

**Response Example SOAP V1**

```php
array
  0 =>
    array
      'category\_id' => string '2' (length=1)
      'parent\_id' => int 1
      'name' => string 'Default Category' (length=16)
      'is\_active' => string '1' (length=1)
      'position' => string '1' (length=1)
      'level' => string '1' (length=1)
  1 =>
    array
      'category\_id' => string '3' (length=1)
      'parent\_id' => int 1
      'name' => string 'root\_category' (length=13)
      'is\_active' => string '1' (length=1)
      'position' => string '2' (length=1)
      'level' => string '1' (length=1)
```

# Category Move

**Method:**

-   catalog\_category.move (SOAP V1)
-   catalogCategoryMove (SOAP V2)

Allows you to move the required category in the category tree.

**Aliases:**

-   category.move

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | ID of the category to be moved |
| int | parentId | ID of the new parent category |
| string | afterId | ID of the category after which the required category will be moved (optional for V1 and V2) |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| boolean | id  | True if the category is moved |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.move', array('categoryId' => '4', 'parentId' => '3'));
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryMove($sessionId, '4', '3');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryMove((object)array('sessionId' => $sessionId->result, 'categoryId' => '19', 'parentId' => '8', 'afterId' => '4'));
var\_dump($result->result);
```

**Note**: Please make sure that you are not moving the category to any of its own children. There are no extra checks to prevent doing it through API, and you won’t be able to fix this from the admin interface later.

## Remove Product

**Method:**

-   catalog\_category.removeProduct (SOAP V1)
-   catalogCategoryRemoveProduct (SOAP V2)

Allows you to remove the product assignment from the category.

**Aliases:**

-   category.removeProduct

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | Category ID |
| string | productId | ID or SKU of the product to be removed from the category |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

**Returns**:

| Type | Description |
| --- | --- |
| boolean | True if the product is removed from the category |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.removeProduct', array('categoryId' => '4', 'product' => '3'));
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryRemoveProduct($sessionId, '4', '3');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryRemoveProduct((object)array('sessionId' => $sessionId->result, 'categoryId' => '4', 'productId' => '3'));
var\_dump($result->result);
```

## Category Tree

**Method:**

-   catalog\_category.tree (SOAP V1)
-   catalogCategoryTree (SOAP V2)

Allows you to retrieve the hierarchical tree of categories.

**Aliases:**

-   category.tree

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | parentId | ID of the parent category (optional) |
| string | storeView | Store view (optional) |

**Returns:**

| Type | Name | Description |
| --- | --- | --- |
| array | tree | Array of catalogCategoryTree |

The **catalogCategoryTree** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | category\_id | Category ID |
| int | parent\_id | Parent category ID |
| string | name | Category name |
| int | position | Category position |
| int | level | Category level |
| array | children | Array of CatalogCategoryEntities |

The **catalogCategoryEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | category\_id | Category ID |
| int | parent\_id | Parent category ID |
| string | name | Category name |
| int | is\_active | defines whether the category is active |
| int | position | Category position |
| int | level | Category level |
| array | children | Array of CatalogCategoryEntities |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.tree');
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryTree($sessionId);
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryTree((object)array('sessionId' => $sessionId->result, 'parentId' => '15'));
var\_dump($result->result);
```

**Response Example SOAP V1**

```php
array
  'category\_id' => string '1' (length=1)
  'parent\_id' => string '0' (length=1)
  'name' => string 'Root Catalog' (length=12)
  'is\_active' => null
  'position' => string '0' (length=1)
  'level' => string '0' (length=1)
  'children' =>
    array
      0 =>
        array
          'category\_id' => string '2' (length=1)
          'parent\_id' => string '1' (length=1)
          'name' => string 'Default Category' (length=16)
          'is\_active' => string '1' (length=1)
          'position' => string '1' (length=1)
          'level' => string '1' (length=1)
          'children' =>
            array
              ...
      1 =>
        array
          'category\_id' => string '3' (length=1)
          'parent\_id' => string '1' (length=1)
          'name' => string 'root\_category' (length=13)
          'is\_active' => string '1' (length=1)
          'position' => string '2' (length=1)
          'level' => string '1' (length=1)
          'children' =>
            array
              ...
```

## Category Update

**Method:**

-   catalog\_category.update (SOAP V1)
-   catalogCategoryUpdate (SOAP V2)

Update the required category. Note that you should specify only those parameters which you want to be updated.

**Aliases:**

-   category.update

**Arguments**:

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | ID of the category to be updated |
| array | categoryData | An array of catalogCategoryEntityCreate |
| string | storeView | Store view ID or code (optional) |

**Returns**:

| Type | Description |
| --- | --- |
| boolean | True if the category is updated |

The **catalogCategoryEntityCreate** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | name | Name of the category to be updated |
| int | is\_active | Defines whether the category is visible in the frontend |
| int | position | Position of the category to be updated |
| arrayOfString | available\_sort\_by | All available options by which products in the category can be sorted |
| string | custom\_design | The custom design for the category |
| int | custom\_apply\_to\_products | Apply the custom design to all products assigned to the category |
| string | custom\_design\_from | Date starting from which the custom design will be applied to the category |
| string | custom\_design\_to | Date till which the custom design will be applied to the category |
| string | custom\_layout\_update | Custom layout update |
| string | default\_sort\_by | The default option by which products in the category are sorted |
| string | description | Category description |
| string | display\_mode | Content that will be displayed on the category view page |
| int | is\_anchor | Defines whether the category will be anchored |
| int | landing\_page | Landing page |
| string | meta\_description | Category meta description |
| string | meta\_keywords | Category meta keywords |
| string | meta\_title | Category meta title |
| string | page\_layout | Type of page layout that the category should use |
| string | url\_key | A relative URL path which can be entered in place of the standard target path |
| int | include\_in\_menu | Defines whether the category is visible on the top menu bar in the frontend |
| string | filter\_price\_range | Price range of each price level displayed in the layered navigation block |
| int | custom\_use\_parent\_settings | Defines whether the category will inherit custom design settings of the category to which it is assigned. 1 - Yes, 0 - No |

**Faults**:  
_No Faults_

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.update', array(23, array(
'name' => 'Category name',
'is\_active' => 1,
'position' => 1,
//<!-- position parameter is deprecated, category anyway will be positioned in the end of list
//and you can not set position directly, use catalog\_category.move instead -->
'available\_sort\_by' => 'position',
'custom\_design' => null,
'custom\_apply\_to\_products' => null,
'custom\_design\_from' => null,
'custom\_design\_to' => null,
'custom\_layout\_update' => null,
'default\_sort\_by' => 'position',
'description' => 'Category description',
'display\_mode' => null,
'is\_anchor' => 0,
'landing\_page' => null,
'meta\_description' => 'Category meta description',
'meta\_keywords' => 'Category meta keywords',
'meta\_title' => 'Category meta title',
'page\_layout' => 'two\_columns\_left',
'url\_key' => 'url-key',
'include\_in\_menu' => 1,
)));

var\_dump ($result);
```

**Request Example SOAP V2**

```php
$client = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->catalogCategoryUpdate($session, 23, array(
'name' => 'Category name 2',
'is\_active' => 1,
'position' => 1,
//<!-- position parameter is deprecated, category anyway will be positioned in the end of list
//and you can not set position directly, use catalog\_category.move instead -->
'available\_sort\_by' => array('position'),
'custom\_design' => null,
'custom\_apply\_to\_products' => null,
'custom\_design\_from' => null,
'custom\_design\_to' => null,
'custom\_layout\_update' => null,
'default\_sort\_by' => 'position',
'description' => 'Category description',
'display\_mode' => null,
'is\_anchor' => 0,
'landing\_page' => null,
'meta\_description' => 'Category meta description',
'meta\_keywords' => 'Category meta keywords',
'meta\_title' => 'Category meta title',
'page\_layout' => 'two\_columns\_left',
'url\_key' => 'url-key',
'include\_in\_menu' => 1,
));

var\_dump ($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryUpdate((object)array('sessionId' => $sessionId->result, 'categoryId' => '23', 'categoryData' => ((object)array(
'name' => 'Category Name Updated',
'is\_active' => '1',
'position' => '1',
'available\_sort\_by' => array('name'),
'default\_sort\_by' => 'name',
'description' => 'Category description',
'is\_anchor' => '1',
'include\_in\_menu' => '1'
))));
var\_dump($result->result);
```

## Category Product Update

**Method:**

-   catalog\_category.updateProduct (SOAP V1)
-   catalogCategoryUpdateProduct (SOAP V2)

Allows you to update the product assigned to a category. The product position is updated.

**Aliases:**

-   category.updateProduct

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | categoryId | ID of the category to which the product is assigned |
| string | productId | ID or SKU of the product to be updated |
| string | position | Position of the product in the category (optional) |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

**Returns**:

| Type | Description |
| --- | --- |
| boolean | True if the product is updated in the category |

### Examples

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog\_category.updateProduct', array('categoryId' => '4', 'product' => '1', 'position' => '3'));
var\_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogCategoryUpdateProduct($sessionId, '4', '1', '3');
var\_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2\_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogCategoryUpdateProduct((object)array('sessionId' => $sessionId->result, 'categoryId' => '4', 'productId' => '1', 'position' => '3'));
var\_dump($result->result);
```
