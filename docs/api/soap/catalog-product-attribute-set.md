# Catalog Product Attribute Set

## Introduction

Allows you to retrieve product attribute sets.

<h3>Resource Name</h3>

- `catalog_product_attribute_set`

<h3>Alias</h3>

- `product_attribute_set`

<h3>Methods</h3>

- `product_attribute_set.list` — Retrieve the list of product attribute sets.
- `product_attribute_set.create` — Create a new attribute set.
- `product_attribute_set.remove` — Remove an attribute set.
- `product_attribute_set.attributeAdd` — Add an attribute to the attribute set.
- `product_attribute_set.attributeRemove` — Remove an attribute from an attribute set.
- `product_attribute_set.groupAdd` — Add a new group for attributes in the attribute set.
- `product_attribute_set.groupRemove` — Remove a group of attributes from an attribute set.
- `product_attribute_set.groupRename` — Rename a group of attributes in an attribute set.

<h3>Faults</h3>

| Fault Code | Fault Message                                                                                                                     |
|------------|-----------------------------------------------------------------------------------------------------------------------------------|
| 100        | Attribute set with requested id does not exist.                                                                                   |
| 101        | Invalid data given.                                                                                                               |
| 102        | Error while creating attribute set. Details in error message.                                                                     |
| 103        | Error while removing attribute set. Details in error message.                                                                     |
| 104        | Attribute set with requested id does not exist.                                                                                   |
| 105        | Unable to remove attribute set as it has related goods. Use forceProductsRemove parameter to remove attribute set with all goods. |
| 106        | Attribute with requested id does not exist.                                                                                       |
| 107        | Error while adding attribute to attribute set. Details in error message.                                                          |
| 108        | Attribute group with requested id does not exist.                                                                                 |
| 109        | Requested attribute is already in requested attribute set.                                                                        |
| 110        | Error while removing attribute from attribute set. Details in error message.                                                      |
| 111        | Requested attribute is not in requested attribute set.                                                                            |
| 112        | Requested group exist already in requested attribute set.                                                                         |
| 113        | Error while adding group to attribute set. Details in error message.                                                              |
| 114        | Error while renaming group. Details in error message.                                                                             |
| 115        | Error while removing group from attribute set. Details in error message.                                                          |
| 116        | Group can not be removed as it contains system attributes.                                                                        |
| 117        | Group can not be removed as it contains attributes, used in configurable products.                                                |

<h3>Example</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

echo '<pre>';
// Create new attribute set
$attributeSetName = 'New Test Attribute Set';
$skeletonId = 4;

$setId = $proxy->call(
    $sessionId,
    'product_attribute_set.create',
    [
         $attributeSetName,
         $skeletonId
    ]
);

// Get attribute set list
$attributeSetList = $proxy->call(
    $sessionId,
    'product_attribute_set.list'
);
print_r($attributeSetList);

// Create group
$groupName = 'Test Group';
$groupId = $proxy->call(
    $sessionId,
    'product_attribute_set.groupAdd',
    [
         $setId,
         $groupName
    ]
);

// Rename group
$newGroupName = 'New Test Group';
$result = $proxy->call(
    $sessionId,
    'product_attribute_set.groupRename',
    [
         $groupId,
         $newGroupName
    ]
);

// Add attribute
$attributeId = 83;
$result = $proxy->call(
    $sessionId,
    'product_attribute_set.attributeAdd',
    [
         $attributeId,
         $attributeSetId
    ]
);

// Remove attribute
$result = $proxy->call(
    $sessionId,
    'product_attribute_set.attributeRemove',
    [
         $attributeId,
         $attributeSetId
    ]
);

// Remove group
$result = $proxy->call(
    $sessionId,
    'product_attribute_set.groupRemove',
    [
         $groupId
    ]
);

// Remove attribute set
$result = $proxy->call(
    $sessionId,
    'product_attribute_set.remove',
    [
         $attributeSetId
    ]
);
```

## List

<h3>Method</h3>

- `catalog_product_attribute_set.list` (SOAP V1)
- `catalogProductAttributeSetList` (SOAP V2)

Allows you to retrieve the list of product attribute sets.

<h3>Alias</h3>

- `product_attribute_set.list`

<h3>Arguments</h3>

| Type   | Name      | Description |
|--------|-----------|-------------|
| string | sessionId | Session ID  |

<h3>Returns</h3>

| Type  | Name   | Description                               |
|-------|--------|-------------------------------------------|
| array | result | Array of catalogProductAttributeSetEntity |

<h3>Content `catalogProductAttributeSetEntity`</h3>

| Type   | Name   | Description             |
|--------|--------|-------------------------|
| int    | set_id | ID of the attribute set |
| string | name   | Attribute set name      |

<h3>Faults</h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_attribute_set.list');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeSetList($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetList((object)['sessionId' => $sessionId->result]);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'set_id' => string '4' (length=1)
      'name' => string 'Default' (length=7)
  1 =>
    array
      'set_id' => string '9' (length=1)
      'name' => string 'products_set' (length=12)
```

## Create

<h3>Method</h3>

- `product_attribute_set.create` (SOAP V1)
- `catalogProductAttributeSetCreate` (SOAP V2)

Allows you to create a new attribute set based on another attribute set.

<h3>Arguments</h3>

| Type   | Name             | Description                                                            |
|--------|------------------|------------------------------------------------------------------------|
| string | sessionId        | Session ID                                                             |
| string | attributeSetName | Attribute set name                                                     |
| string | skeletonSetId    | Attribute set ID basing on which the new attribute set will be created |

<h3>Return</h3>

| Type | Name  | Description                     |
|------|-------|---------------------------------|
| int  | setId | ID of the created attribute set |

<h3>Faults</h3>

| Fault Code | Fault Message                                                 |
|------------|---------------------------------------------------------------|
| 100        | Attribute set with requested id does not exist.               |
| 101        | Invalid data given.                                           |
| 102        | Error while creating attribute set. Details in error message. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetName = 'New Attribute Set';
$skeletonId = 4;

$newSetId = $proxy->call(
    $sessionId,
    'product_attribute_set.create',
    [
         $attributeSetName,
         $skeletonId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetName = 'New Attribute Set';
$skeletonId = 4;

$result = $client->catalogProductAttributeSetCreate(
    $sessionId,
    $attributeSetName,
    $skeletonId
);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetCreate(
    (object)[
        'sessionId' => $sessionId->result,
        'attributeSetName' => 'New Attribute Set',
        'skeletonSetId' => '4'
    ]
);
var_dump($result->result);
```

## Remove

<h3>Method</h3>

- `product_attribute_set.remove` (SOAP V1)
- `catalogProductAttributeSetRemove` (SOAP V2)

Allows you to remove an existing attribute set.

<h3>Arguments</h3>

| Type   | Name                | Description                          |
|--------|---------------------|--------------------------------------|
| string | sessionId           | Session ID                           |
| string | attributeSetId      | Attribute set ID                     |
| string | forceProductsRemove | Force product remove flag (optional) |

<h3>Return</h3>

| Type       | Name      | Description                              |
|------------|-----------|------------------------------------------|
| booleanint | isRemoved | True (1) if the attribute set is removed |

<h3>Faults</h3>

| Fault Code | Fault Message                                                                                                                     |
|------------|-----------------------------------------------------------------------------------------------------------------------------------|
| 103        | Error while removing attribute set. Details in error message.                                                                     |
| 104        | Attribute set with requested id does not exist.                                                                                   |
| 105        | Unable to remove attribute set as it has related goods. Use forceProductsRemove parameter to remove attribute set with all goods. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetId = 5;

$result = $proxy->call(
    $sessionId,
    'product_attribute_set.remove',
    [
         $attributeSetId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeSetRemove($sessionId, '5');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetRemove(
    (object)[
        'sessionId' => $sessionId->result,
        'attributeSetId' => '5'
    ]
);
var_dump($result->result);
```

## AttributeAdd

<h3>Method</h3>

- `product_attribute_set.attributeAdd` (SOAP V1)
- `catalogProductAttributeSetAttributeAdd` (SOAP V2)

Allows you to add an existing attribute to an attribute set.

<h3>Arguments</h3>

| Type   | Name             | Description           |
|--------|------------------|-----------------------|
| string | sessionId        | Session ID            |
| string | attributeId      | Attribute ID          |
| string | attributeSetId   | Attribute set ID      |
| string | attributeGroupId | Group ID (optional)   |
| string | sortOrder        | Sort order (optional) |

**Note:** If the `attributeGroupId` parameter is not passed, the attribute is added to the `General` group by default.

<h3>Returns</h3>

| Type    | Name    | Description                                        |
|---------|---------|----------------------------------------------------|
| boolean | isAdded | True if the attribute is added to an attribute set |

<h3>Faults</h3>

| Fault Code | Fault Message                                                            |
|------------|--------------------------------------------------------------------------|
| 104        | Attribute set with requested id does not exist.                          |
| 106        | Attribute with requested id does not exist.                              |
| 107        | Error while adding attribute to attribute set. Details in error message. |
| 108        | Attribute group with requested id does not exist.                        |
| 109        | Requested attribute is already in requested attribute set.               |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetId = 5;
$attributeId = 83;

$result = $proxy->call(
    $sessionId,
    'product_attribute_set.attributeAdd',
    [
         $attributeId,
         $attributeSetId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetId = 5;
$attributeId = 83;

$result = $proxy->catalogProductAttributeSetAttributeAdd(
    $sessionId,
    $attributeId,
    $attributeSetId
);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetAttributeAdd(
    (object)[
        'sessionId' => $sessionId->result,
        'attributeId' => '5',
        'attributeSetId' => '83'
    ]
);
var_dump($result->result);
```

## AttributeRemove

<h3>Method</h3>

- `product_attribute_set.attributeRemove` (SOAP V1)
- `catalogProductAttributeSetAttributeRemove` (SOAP V2)

Allows you to remove an existing attribute from an attribute set.

<h3>Arguments</h3>

| Type   | Name           | Description      |
|--------|----------------|------------------|
| string | sessionId      | Session ID       |
| string | attributeId    | Attribute ID     |
| string | attributeSetId | Attribute set ID |

<h3>Returns</h3>

| Type    | Name      | Description                                            |
|---------|-----------|--------------------------------------------------------|
| boolean | isRemoved | True if the attribute is removed from an attribute set |

<h3>Faults</h3>

| Fault Code | Fault Message                                                                |
|------------|------------------------------------------------------------------------------|
| 104        | Attribute set with requested id does not exist.                              |
| 106        | Attribute with requested id does not exist.                                  |
| 110        | Error while removing attribute from attribute set. Details in error message. |
| 111        | Requested attribute is not in requested attribute set.                       |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetId = 5;
$attributeId = 83;

$result = $proxy->call(
    $sessionId,
    'product_attribute_set.attributeRemove',
    [
         $attributeId,
         $attributeSetId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeSetAttributeRemove($sessionId, '5', '83');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetAttributeRemove(
    (object)[
        'sessionId' => $sessionId->result,
        'attributeId' => '5',
        'attributeSetId' => '83'
    ]
);
var_dump($result->result);
```

## GroupAdd

<h3>Method</h3>

- `product_attribute_set.groupAdd` (SOAP V1)
- `catalogProductAttributeSetGroupAdd` (SOAP V2)

Allows you to add a new group for attributes to the attribute set.

<h3>Arguments</h3>

| Type   | Name           | Description      |
|--------|----------------|------------------|
| string | sessionId      | Session ID       |
| string | attributeSetId | Attribute set ID |
| string | groupName      | Group name       |

<h3>Return</h3>

| Type | Name   | Description             |
|------|--------|-------------------------|
| int  | result | ID of the created group |

<h3>Faults</h3>

| Fault Code | Fault Message                                                        |
|------------|----------------------------------------------------------------------|
| 112        | Requested group exist already in requested attribute set.            |
| 113        | Error while adding group to attribute set. Details in error message. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'product_attribute_set.groupAdd',
    [
        'attributeSetId' => '9',
        'groupName' => 'new_group'
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

$result = $proxy->catalogProductAttributeSetGroupAdd($sessionId, '9', 'new_group');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('http://maentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetGroupAdd(
    (object)[
        'sessionId' => $sessionId->result,
        'attributeSetId' => '9',
        'groupName' => 'new_group'
    ]
);
var_dump($result->result);
```

## GroupRemove

<h3>Method</h3>

- `product_attribute_set.groupRemove` (SOAP V1)
- `catalogProductAttributeSetGroupRemove` (SOAP V2)

Allows you to remove a group from an attribute set.

<h3>Arguments</h3>

| Type   | Name             | Description |
|--------|------------------|-------------|
| string | sessionId        | Session ID  |
| string | attributeGroupId | Group ID    |

<h3>Return</h3>

| Type       | Description                      |
|------------|----------------------------------|
| booleanint | True (1) if the group is removed |

<h3>Faults</h3>

| Fault Code | Fault Message                                                                      |
|------------|------------------------------------------------------------------------------------|
| 108        | Attribute group with requested id does not exist.                                  |
| 115        | Error while removing group from attribute set. Details in error message.           |
| 116        | Group can not be removed as it contains system attributes.                         |
| 117        | Group can not be removed as it contains attributes, used in configurable products. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$groupId = 70;

$result = $proxy->call(
    $sessionId,
    'product_attribute_set.groupRemove',
    [
         $groupId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeSetGroupRemove($sessionId, '70');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetGroupRemove(
    (object)[
        'sessionId' => $sessionId->result,
        'attributeGroupId' => '70'
    ]
);
var_dump($result->result);
```

## GroupRename

<h3>Method</h3>

- `product_attribute_set.groupRename` (SOAP V1)
- `catalogProductAttributeSetGroupRename` (SOAP V2)

Allows you to rename a group in the attribute set.

<h3>Arguments</h3>

| Type   | Name      | Description                          |
|--------|-----------|--------------------------------------|
| string | sessionId | Session ID                           |
| string | groupId   | ID of the group that will be renamed |
| string | groupName | New name for the group               |

<h3>Return</h3>

| Type       | Description                      |
|------------|----------------------------------|
| booleanint | True (1) if the group is renamed |

<h3>Faults</h3>

| Fault Code | Fault Message                                         |
|------------|-------------------------------------------------------|
| 108        | Attribute group with requested id does not exist.     |
| 114        | Error while renaming group. Details in error message. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$groupId = 100;
$groupName = 'New Group';

echo 'Renaming group...';
$result = $proxy->call(
    $sessionId,
    'product_attribute_set.groupRename',
    [
         $groupId,
         $groupName
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeSetGroupRename($sessionId, '100', 'New Group');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeSetGroupRename(
    (object)[
        'sessionId' => $sessionId->result,
        'groupId' => '100',
        'groupName' => 'New Group'
    ]
);
var_dump($result->result);
```
