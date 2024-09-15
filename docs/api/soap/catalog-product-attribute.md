# Catalog Product Attribute

## Introduction

Allows you to retrieve product attributes and options.

<h3>Resource Name</h3>

- `catalog_product_attribute`

<h3>Aliases</h3>

- `product_attribute`

<h3>Methods</h3>

- `product_attribute.currentStore` — Set/Get the current store view.
- `product_attribute.list` — Retrieve the attribute list.
- `product_attribute.options` — Retrieve the attribute options.
- `product_attribute.addOption` — Add a new option for attributes with selectable fields.
- `product_attribute.create` — Create a new attribute.
- `product_attribute.info` — Get full information about an attribute with the list of options.
- `product_attribute.remove` — Remove the required attribute.
- `product_attribute.removeOption` — Remove an option for attributes with selectable fields.
- `product_attribute.types` — Get the list of possible attribute types.
- `product_attribute.update` — Update the required attribute.

<h3>Faults</h3>

| Fault Code | Fault Message                                                                                                                                |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| 100        | Requested store view not found.                                                                                                              |
| 101        | Requested attribute not found.                                                                                                               |
| 102        | Invalid request parameters.                                                                                                                  |
| 103        | Attribute code is invalid. Please use only letters (a-z), numbers (0-9) or underscore (_) in this field, first character should be a letter. |
| 104        | Incorrect attribute type.                                                                                                                    |
| 105        | Unable to save attribute.                                                                                                                    |
| 106        | This attribute cannot be deleted.                                                                                                            |
| 107        | This attribute cannot be edited.                                                                                                             |
| 108        | Unable to add option.                                                                                                                        |
| 109        | Unable to remove option.                                                                                                                     |

<h3>Example</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

echo '<pre>';
// Create new attribute
$attributeToCreate = [
    'attribute_code' => 'new_attribute',
    'scope' => 'store',
    'frontend_input' => 'select',
    'is_unique' => 0,
    'is_required' => 0,
    'is_configurable' => 0,
    'is_searchable' => 0,
    'is_visible_in_advanced_search' => 0,
    'used_in_product_listing' => 0,
    'additional_fields' => [
        'is_filterable' => 1,
        'is_filterable_in_search' => 1,
        'position' => 1,
        'used_for_sort_by' => 1
    ],
    'frontend_label' => [
        [
            'store_id' => 0,
            'label' => 'A new attribute'
        ]
    ]
];

$attributeId = $proxy->call(
    $sessionId,
    'product_attribute.create',
    [
        $attributeToCreate
    ]
);

// Update attribute
$attributeToUpdate = [
    'scope' => 'global',
    'is_unique' => 1,
    'is_required' => 1,
    'is_configurable' => 1,
    'is_searchable' => 1,
    'is_visible_in_advanced_search' => 0,
    'used_in_product_listing' => 0,
    'additional_fields' => [
        'is_filterable' => 1,
        'is_filterable_in_search' => 0,
        'position' => 2,
        'used_for_sort_by' => 0
    ],
    'frontend_label' => [
        [
            'store_id' => 0,
            'label' => 'A Test Attribute'
        ]
    ]
];
$proxy->call(
    $sessionId,
    'product_attribute.update',
    [
         'new_attribute',
         $attributeToUpdate
    ]
);

// Add option
$optionToAdd = [
    'label' => [
        [
            'store_id' => 0,
            'value' => 'New Option'
        ]
    ],
    'order' => 0,
    'is_default' => 0
];

$proxy->call(
    $sessionId,
    'product_attribute.addOption',
    [
         $attributeId,
         $optionToAdd
    ]
);

// Get info
$resultInfo = $proxy->call(
    $sessionId,
    'product_attribute.info',
    [
         $attributeId
    ]
);
echo 'info result:n';
print_r($resultInfo);

// List options
$resultListOptions = $proxy->call(
    $sessionId,
    'product_attribute.options',
    [
         $attributeId
    ]
);
echo 'n options result:n';
print_r($resultListOptions);

// Remove option
$result = $proxy->call(
    $sessionId,
    'product_attribute.removeOption',
    [
         $attributeId,
         $resultInfo['options'][0]['value']
    ]
);

// Remove attribute
$result = $proxy->call(
    $sessionId,
    'product_attribute.remove',
    [
         $attributeId
    ]
);
```

## CurrentStore

<h3>Method</h3>

- `catalog_product_attribute.currentStore` (SOAP V1)
- `catalogProductAttributeCurrentStore` (SOAP V2)

Allows you to set/get the current store view.

<h3>Alias</h3>

- `product_attribute.currentStore`

<h3>Arguments</h3>

| Type   | Name      | Description                      |
|--------|-----------|----------------------------------|
| string | sessionId | Session ID                       |
| string | storeView | Store view ID or code (optional) |

<h3>Returns</h3>

| Type | Name      | Description   |
|------|-----------|---------------|
| int  | storeView | Store view ID |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_attribute.currentStore', 'english');
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary
 
$result = $proxy->catalogProductAttributeCurrentStore($sessionId, 'english');
var_dump($result);
```

## List

<h3>Method</h3>

- `catalog_product_attribute.list` (SOAP V1)
- `catalogProductAttributeList` (SOAP V2)

Allows you to retrieve the list of product attributes.

<h3>Alias</h3>

- `product_attribute.list`

<h3>Arguments</h3>

| Type   | Name      | Description             |
|--------|-----------|-------------------------|
| string | sessionId | Session ID              |
| int    | setId     | ID of the attribute set |

<h3>Returns</h3>

| Type  | Name   | Description                     |
|-------|--------|---------------------------------|
| array | result | Array of catalogAttributeEntity |

<h3>Content `catalogAttributeEntity`</h3>

| Type   | Name         | Description                                                       |
|--------|--------------|-------------------------------------------------------------------|
| int    | attribute_id | Attribute ID                                                      |
| string | code         | Attribute code                                                    |
| string | type         | Attribute type                                                    |
| string | required     | Defines whether the attribute is required                         |
| string | scope        | Attribute scope. Possible values: 'store', 'website', or 'global' |

<h3>Faults</h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeSetId = 4; // Existing attribute set id

$result = $proxy->call(
    $sessionId,
    'product_attribute.list',
    [
         $attributeSetId
    ]
);
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeList($sessionId, '4');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeList((object)['sessionId' => $sessionId->result, 'setId' => '4']);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'attribute_id' => string '71' (length=2)
      'code' => string 'name' (length=4)
      'type' => string 'text' (length=4)
      'required' => string '1' (length=1)
      'scope' => string 'store' (length=5)
  1 =>
    array
      'attribute_id' => string '72' (length=2)
      'code' => string 'description' (length=11)
      'type' => string 'textarea' (length=8)
      'required' => string '1' (length=1)
      'scope' => string 'store' (length=5)
```

## Options

<h3>Method</h3>

- `catalog_product_attribute.options` (SOAP V1)
- `catalogProductAttributeOptions` (SOAP V2)

Allows you to retrieve the product attribute options.

<h3>Alias</h3>

- `product_attribute.options`

<h3>Arguments</h3>

| Type   | Name        | Description                      |
|--------|-------------|----------------------------------|
| string | sessionId   | Session ID                       |
| string | attributeId | Attribute ID or code             |
| string | storeView   | Store view ID or code (optional) |

<h3>Returns</h3>

| Type  | Name   | Description                           |
|-------|--------|---------------------------------------|
| array | result | Array of catalogAttributeOptionEntity |

<h3>Content `catalogAttributeOptionEntity`</h3>

| Type   | Name  | Description  |
|--------|-------|--------------|
| string | label | Option label |
| string | value | Option value |

<h3>Faults</h3>

| Fault Code | Fault Message                  |
|------------|--------------------------------|
| 101        | Requested attribute not found. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeId = 11; // Existing selectable attribute ID

$result = $proxy->call(
    $sessionId,
    'product_attribute.options',
    [
         $attributeId
    ]
);
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeOptions($sessionId, '11');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeOptions((object)['sessionId' => $sessionId->result, 'attributeId' => '11']);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  1 =>
    array
      'value' => string '5' (length=1)
      'label' => string 'blue' (length=4)
  2 =>
    array
      'value' => string '4' (length=1)
      'label' => string 'green' (length=5)
  3 =>
    array
      'value' => string '3' (length=1)
      'label' => string 'yellow' (length=6)
```

## AddOption

<h3>Method</h3>

- `product_attribute.addOption` (SOAP V1)
- `catalogProductAttributeAddOption` (SOAP V2)

Allows you to add a new option for attributes with selectable fields.

<h3>Arguments</h3>

| Type   | Name      | Description                                       |
|--------|-----------|---------------------------------------------------|
| string | sessionId | Session ID                                        |
| string | attribute | Attribute code or ID                              |
| array  | data      | Array of catalogProductAttributeOptionEntityToAdd |

<h3>Return</h3>

| Type    | Name   | Description     |
|---------|--------|-----------------|
| boolean | result | True on success |

<h3>Content `catalogProductAttributeOptionEntityToAdd`</h3>

| Type   | Name       | Description                                 |
|--------|------------|---------------------------------------------|
| array  | label      | Array of catalogProductAttributeOptionLabel |
| int    | order      | Option order                                |
| int    | is_default | Defines whether the option is a default one |

<h3>Content `catalogProductAttributeOptionLabel`</h3>

| Type          | Name     | Description             |
|---------------|----------|-------------------------|
| ArrayOfString | store_id | Array of store view IDs |
| string        | value    | Text label              |

<h3>Faults</h3>

| Fault Code | Fault Message                  |
|------------|--------------------------------|
| 101        | Requested attribute not found. |
| 104        | Incorrect attribute type.      |
| 108        | Unable to add option.          |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeCode = 'new_attribute';
$optionToAdd = [
    'label' => [
        [
            'store_id' => 0,
            'value' => 'New Option'
        ]
    ],
    'order' => 0,
    'is_default' => 0
];

$result = $proxy->call(
    $sessionId,
    'product_attribute.addOption',
    [
         $attributeCode,
         $optionToAdd
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

// V2 WS-I Mode
// $response = $client->login(['username' => 'apiUser', 'apiKey' => 'apiKey']);
// $session = $response->result;

$attributeCode = 'new_attribute';

$label = [
   [
    'store_id' => ['0'],
    'value' => 'some random data'
   ]
  ];

$data = [
   'label' => $label,
   'order' => '10',
   'is_default' => '1'
  ];

$orders = $client->catalogProductAttributeAddOption($session, $attributeCode, $data); 

// V2 WSI
// WSDL WSI does not describe this method.
// $result = $client->catalogProductAttributeAddOption(...);
// $orders = $result->result->complexObjectArray;

var_dump($orders);
```

## Create

<h3>Method</h3>

- `product_attribute.create` (SOAP V1)
- `catalogProductAttributeCreate` (SOAP V2)

Allows you to create a new product attribute.

<h3>Arguments</h3>

| Type   | Name      | Description                                    |
|--------|-----------|------------------------------------------------|
| string | sessionId | Session ID                                     |
| array  | data      | Array of catalogProductAttributeEntityToCreate |

<h3>Returns</h3>

| Type | Name   | Description                 |
|------|--------|-----------------------------|
| int  | result | ID of the created attribute |

<h3>Content `catalogProductAttributeEntityToCreate`</h3>

| Type             | Name                          | Description                                                                                                                                                        |
|------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string           | attribute_code                | Attribute code                                                                                                                                                     |
| string           | frontend_input                | Attribute type                                                                                                                                                     |
| string           | scope                         | Attribute scope. Possible values are as follows: 'store', 'website', or 'global'                                                                                   |
| string           | default_value                 | Attribute default value                                                                                                                                            |
| int              | is_unique                     | Defines whether the attribute is unique                                                                                                                            |
| int              | is_required                   | Defines whether the attribute is required                                                                                                                          |
| ArrayOfString    | apply_to                      | Apply to. Empty for 'Apply to all' or array of the following possible values: 'simple', 'grouped', 'configurable', 'virtual', 'bundle', 'downloadable', 'giftcard' |
| int              | is_configurable               | Defines whether the attribute can be used for configurable products                                                                                                |
| int              | is_searchable                 | Defines whether the attribute can be used in Quick Search                                                                                                          |
| int              | is_visible_in_advanced_search | Defines whether the attribute can be used in Advanced Search                                                                                                       |
| int              | is_comparable                 | Defines whether the attribute can be compared on the frontend                                                                                                      |
| int              | is_used_for_promo_rules       | Defines whether the attribute can be used for promo rules                                                                                                          |
| int              | is_visible_on_front           | Defines whether the attribute is visible on the frontend                                                                                                           |
| int              | used_in_product_listing       | Defines whether the attribute can be used in product listing                                                                                                       |
| associativeArray | additional_fields             | Array of additional fields                                                                                                                                         |
| array            | frontend_label                | Array of catalogProductAttributeFrontendLabel                                                                                                                      |

<h3>Content `catalogProductAttributeFrontendLabelEntity`</h3>

| Type   | Name     | Description   |
|--------|----------|---------------|
| string | store_id | Store ID      |
| string | label    | Text label    |

**Notes**: The `label` value for the `store_id` value set to `0` must be specified.
An attribute cannot be created without specifying the label for `store_id = 0`.

<h3>`AdditionaFieldsEntity` Additional Fields for Type `text`</h3>

| Type    | Name                     | Description                                                                                                                                                                                                                                                        |
|---------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string  | frontend_class           | Input Validation for Store Owner. Possible values are as follows: 'validate-number' (Decimal Number), 'validate-digits' (Integer Number), 'validate-email', 'validate-url', 'validate-alpha' (Letters), 'validate-alphanum' (Letters (a-z, A-Z), or Numbers (0-9)) |
| boolean | is_html_allowed_on_front | Defines whether the HTML tags are allowed on the frontend                                                                                                                                                                                                          |
| boolean | used_for_sort_by         | Defines whether it is used for sorting in product listing                                                                                                                                                                                                          |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `textarea`</h3>

| Type    | Name                     | Description                                               |
|---------|--------------------------|-----------------------------------------------------------|
| boolean | is_wysiwyg_enabled       | Enable WYSIWYG flag                                       |
| boolean | is_html_allowed_on_front | Defines whether the HTML tags are allowed on the frontend |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `date` and `boolean`</h3>

| Type    | Name             | Description                                               |
|---------|------------------|-----------------------------------------------------------|
| boolean | used_for_sort_by | Defines whether it is used for sorting in product listing |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `multiselect`</h3>

| Type    | Name                    | Description                                                     |
|---------|-------------------------|-----------------------------------------------------------------|
| boolean | is_filterable           | Defines whether it is used in layered navigation                |
| boolean | is_filterable_in_search | Defines whether it is used in search results layered navigation |
| int     | position                | Position                                                        |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `select` and `price`</h3>

| Type    | Name                    | Description                                                     |
|---------|-------------------------|-----------------------------------------------------------------|
| boolean | is_filterable           | Defines whether it is used in layered navigation                |
| boolean | is_filterable_in_search | Defines whether it is used in search results layered navigation |
| int     | position                | Position                                                        |
| boolean | used_for_sort_by        | Defines whether it is used for sorting in product listing       |

<h3>Faults</h3>

| Fault Code | Fault Message                                                                                                                                |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| 102        | Invalid request parameters.                                                                                                                  |
| 103        | Attribute code is invalid. Please use only letters (a-z), numbers (0-9) or underscore (_) in this field, first character should be a letter. |
| 104        | Incorrect attribute type.                                                                                                                    |
| 105        | Unable to save attribute.                                                                                                                    |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$attributeToUpdate = [
    'scope' => 'global',
    'default_value' => '100',
    'frontend_input' => 'text',
    'is_unique' => 0,
    'is_required' => 0,
    'is_configurable' => 0,
    'is_searchable' => 0,
    'is_visible_in_advanced_search' => 0,
    'used_in_product_listing' => 0,
    'additional_fields' => [
        'is_filterable' => 1,
        'is_filterable_in_search' => 1,
        'position' => 1,
        'used_for_sort_by' => 1
    ],
    'frontend_label' => [
        [
            'store_id' => 0,
            'label' => 'Updated attribute'
        ]
    ]
];

$attributeCode = 'code1';

$result = $client->call($session, 'product_attribute.update', [$attributeCode, $attributeToUpdate]);
var_dump($result);
 
// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');

//V2
$session = $client->login('apiUser', 'apiKey');

// V2 WS-I Mode
// $response = $client->login(['username' => 'apiUser', 'apiKey' => 'apiKey']);
// $session = $response->result;

//V2
$data = [
    'attribute_code' => 'test_attribute',
    'frontend_input' => 'text',
    'scope' => '1',
    'default_value' => '1',
    'is_unique' => 0,
    'is_required' => 0,
    'apply_to' => ['simple'],
    'is_configurable' => 0,
    'is_searchable' => 0,
    'is_visible_in_advanced_search' => 0,
    'is_comparable' => 0,
    'is_used_for_promo_rules' => 0,
    'is_visible_on_front' => 0,
    'used_in_product_listing' => 0,
    'additional_fields' => [],
    'frontend_label' => [
        [
            'store_id' => '0',
            'label' => 'some label'
        ]
    ]
  ];

$orders = $client->catalogProductAttributeCreate($session, $data);

// V2 WSI
// WSDL WSI Sample is not complete
// $result = $client->catalogProductAttributeCreate(['sessionId' => $session, 'data' => $data]);
// $orders = $result->result->complexObjectArray;

echo 'Number of results: ' . count($orders) . '<br>';
var_dump($orders);
```

## Info

<h3>Method</h3>

- `product_attribute.info` (SOAP V1)
- `catalogProductAttributeInfo` (SOAP V2)

Allows you to get full information about a required attribute with the list of options.

<h3>Arguments</h3>

| Type   | Name      | Description          |
|--------|-----------|----------------------|
| string | sessionId | Session ID           |
| string | attribute | Attribute code or ID |

<h3>Return</h3>

| Type  | Name   | Description                            |
|-------|--------|----------------------------------------|
| array | result | Array of catalogProductAttributeEntity |

<h3>Content `catalogProductAttributeEntity`</h3>

| Type             | Name                          | Description                                                                                                                                                        |
|------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string           | attribute_id                  | Attribute ID                                                                                                                                                       |
| string           | attribute_code                | Attribute code                                                                                                                                                     |
| string           | frontend_input                | Attribute type                                                                                                                                                     |
| string           | scope                         | Attribute scope                                                                                                                                                    |
| string           | default_value                 | Attribute default value                                                                                                                                            |
| int              | is_unique                     | Defines whether the attribute is unique                                                                                                                            |
| int              | is_required                   | Defines whether the attribute is required                                                                                                                          |
| ArrayOfString    | apply_to                      | Apply to. Empty for 'Apply to all' or array of the following possible values: 'simple', 'grouped', 'configurable', 'virtual', 'bundle', 'downloadable', 'giftcard' |
| int              | is_configurable               | Defines whether the attribute can be used for configurable products                                                                                                |
| int              | is_searchable                 | Defines whether the attribute can be used in Quick Search                                                                                                          |
| int              | is_visible_in_advanced_search | Defines whether the attribute can be used in Advanced Search                                                                                                       |
| int              | is_comparable                 | Defines whether the attribute can be compared on the frontend                                                                                                      |
| int              | is_used_for_promo_rules       | Defines whether the attribute can be used for promo rules                                                                                                          |
| int              | is_visible_on_front           | Defines whether the attribute is visible on the frontend                                                                                                           |
| int              | used_in_product_listing       | Defines whether the attribute can be used in product listing                                                                                                       |
| associativeArray | additional_fields             | Array of additional fields                                                                                                                                         |
| array            | options                       | Array of catalogAttributeOptionEntity                                                                                                                              |
| array            | frontend_label                | Array of catalogProductAttributeFrontendLabel                                                                                                                      |

<h3>Content `catalogAttributeOptionEntity`</h3>

| Type   | Name  | Description |
|--------|-------|-------------|
| string | label | Text label  |
| string | value | Option ID   |

<h3>Content `catalogProductAttributeFrontendLabelEntity`</h3>

| Type   | Name     | Description |
|--------|----------|-------------|
| string | store_id | Store ID    |
| string | label    | Text label  |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `text`</h3>

| Type    | Name                     | Description                                                                                                                                                                                                                                         |
|---------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string  | frontend_class           | Input Validation for Store Owner. Possible values: 'validate-number' (Decimal Number), 'validate-digits' (Integer Number), 'validate-email', 'validate-url', 'validate-alpha' (Letters), 'validate-alphanum' (Letters (a-z, A-Z), or Numbers (0-9)) |
| boolean | is_html_allowed_on_front | Defines whether the HTML tags are allowed on the frontend                                                                                                                                                                                           |
| boolean | used_for_sort_by         | Defines whether it is used for sorting in product listing                                                                                                                                                                                           |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `textarea`</h3>

| Type    | Name                     | Description                                               |
|---------|--------------------------|-----------------------------------------------------------|
| boolean | is_wysiwyg_enabled       | Enable WYSIWYG flag                                       |
| boolean | is_html_allowed_on_front | Defines whether the HTML tags are allowed on the frontend |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `date` and `boolean`</h3>

| Type    | Name             | Description                                               |
|---------|------------------|-----------------------------------------------------------|
| boolean | used_for_sort_by | Defines whether it is used for sorting in product listing |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `multiselect`</h3>

| Type    | Name                    | Description                                                     |
|---------|-------------------------|-----------------------------------------------------------------|
| boolean | is_filterable           | Defines whether it used in layered navigation                   |
| boolean | is_filterable_in_search | Defines whether it is used in search results layered navigation |
| int     | position                | Position                                                        |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `select` and `price`</h3>

| Type    | Name                    | Description                                                     |
|---------|-------------------------|-----------------------------------------------------------------|
| boolean | is_filterable           | Defines whether it used in layered navigation                   |
| boolean | is_filterable_in_search | Defines whether it is used in search results layered navigation |
| int     | position                | Position                                                        |
| boolean | used_for_sort_by        | Defines whether it is used for sorting in product listing       |

<h3>Faults</h3>

| Fault Code | Fault Message                  |
|------------|--------------------------------|
| 101        | Requested attribute not found. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'product_attribute.info', '11');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeInfo($sessionId, '11');
var_dump($result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  'attribute_id' => string '11' (length=3)
  'attribute_code' => string 'new_special_price' (length=17)
  'frontend_input' => string 'text' (length=4)
  'default_value' => null
  'is_unique' => string '0' (length=1)
  'is_required' => string '0' (length=1)
  'apply_to' =>
    array
      empty
  'is_configurable' => string '0' (length=1)
  'is_searchable' => string '0' (length=1)
  'is_visible_in_advanced_search' => string '0' (length=1)
  'is_comparable' => string '0' (length=1)
  'is_used_for_promo_rules' => string '0' (length=1)
  'is_visible_on_front' => string '0' (length=1)
  'used_in_product_listing' => string '0' (length=1)
  'frontend_label' =>
    array
      0 =>
        array
          'store_id' => int 0
          'label' => string 'special price' (length=13)
      1 =>
        array
          'store_id' => int 2
          'label' => string 'special price' (length=13)
  'scope' => string 'store' (length=5)
  'additional_fields' =>
    array
      'frontend_class' => null
      'is_html_allowed_on_front' => string '1' (length=1)
      'used_for_sort_by' => string '0' (length=1)
```

## Remove

<h3>Method</h3>

- `product_attribute.remove` (SOAP V1)
- `catalogProductAttributeRemove` (SOAP V2)

Allows you to remove the required attribute from a product.

<h3>Arguments</h3>

| Type   | Name      | Description          |
|--------|-----------|----------------------|
| string | sessionId | Session ID           |
| string | attribute | Attribute code or ID |

<h3>Return</h3>

| Type    | Description                      |
|---------|----------------------------------|
| boolean | True if the attribute is removed |

<h3>Faults</h3>

| Fault Code | Fault Message                     |
|------------|-----------------------------------|
| 101        | Requested attribute not found.    |
| 106        | This attribute cannot be deleted. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeId = '11';

$result = $proxy->call(
    $sessionId,
    'product_attribute.remove',
    [
         $attributeId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeRemove($sessionId, '11');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $client->catalogProductAttributeRemove((object)['sessionId' => $session->result, 'attribute' => '11']);
var_dump($result);
```

## RemoveOption

<h3>Method</h3>

- `product_attribute.removeOption` (SOAP V1)
- `catalogProductAttributeRemoveOption` (SOAP V2)

Allows you to remove the option for an attribute.

<h3>Arguments</h3>

| Type   | Name      | Description          |
|--------|-----------|----------------------|
| string | sessionId | Session ID           |
| string | attribute | Attribute code or ID |
| string | optionId  | Option ID            |

<h3>Return</h3>

| Type    | Description                   |
|---------|-------------------------------|
| boolean | True if the option is removed |

<h3>Faults</h3>

| Fault Code | Fault Message                  |
|------------|--------------------------------|
| 101        | Requested attribute not found. |
| 104        | Incorrect attribute type.      |
| 109        | Unable to remove option.       |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeId = '2';
$optionId = 11; // Existing option ID

$result = $proxy->call(
    $sessionId,
    'product_attribute.removeOption',
    [
         $attributeId,
         $optionId
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeRemoveOption($sessionId, '2', '11');
var_dump($result);
```

## Types

<h3>Method</h3>

- `product_attribute.types` (SOAP V1)
- `catalogProductAttributeTypes` (SOAP V2)

Allows you to retrieve the list of possible attribute types.

<h3>Arguments</h3>

| Type   | Name      | Description |
|--------|-----------|-------------|
| string | sessionId | Session ID  |

<h3>Return</h3>

| Type  | Name   | Description                           |
|-------|--------|---------------------------------------|
| array | result | Array of catalogAttributeOptionEntity |

<h3>Content `catalogAttributeOptionEntity`</h3>

| Type   | Name  | Description   |
|--------|-------|---------------|
| string | label | Option label  |
| string | value | Option value  |

<h3>Faults</h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$result = $proxy->call(
    $sessionId,
    'product_attribute.types'
);
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeTypes($sessionId);
var_dump($result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
      'value' => 'text'
      'label' => 'Text Field'
  1 =>
      'value' => 'textarea'
      'label' => 'Text Area'
  2 =>
      'value' => 'date'
      'label' => 'Date'
  3 =>
      'value' => 'boolean'
      'label' => 'Yes/No'
  4 =>
      'value' => 'multiselect'
      'label' => 'Multiple Select'
  5 =>
      'value' => 'select'
      'label' => 'Dropdown'
  6 =>
      'value' => 'price'
      'label' => 'Price'
  7 =>
      'value' => 'media_image'
      'label' => 'Media Image'
```

## Update

<h3>Method</h3>

- `product_attribute.update` (SOAP V1)
- `catalogProductAttributeUpdate` (SOAP V2)

Allows you to update the required attribute.

<h3>Arguments</h3>

| Type   | Name      | Description                                    |
|--------|-----------|------------------------------------------------|
| string | sessionId | Session ID                                     |
| string | attribute | Attribute code or ID                           |
| array  | data      | Array of catalogProductAttributeEntityToUpdate |

<h3>Returns</h3>

| Type    | Description                      |
|---------|----------------------------------|
| boolean | True if the attribute is updated |

<h3>Content `catalogProductAttributeEntityToUpdate`</h3>

| Type             | Name                          | Description                                                                                                                                                        |
|------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string           | scope                         | Attribute scope. Possible values are as follows: 'store', 'website', or 'global'                                                                                   |
| string           | default_value                 | Attribute default value                                                                                                                                            |
| int              | is_unique                     | Defines whether the attribute is unique                                                                                                                            |
| int              | is_required                   | Defines whether the attribute is required                                                                                                                          |
| ArrayOfString    | apply_to                      | Apply to. Empty for 'Apply to all' or array of the following possible values: 'simple', 'grouped', 'configurable', 'virtual', 'bundle', 'downloadable', 'giftcard' |
| int              | is_configurable               | Defines whether the attribute can be used for configurable products                                                                                                |
| int              | is_searchable                 | Defines whether the attribute can be used in Quick Search                                                                                                          |
| int              | is_visible_in_advanced_search | Defines whether the attribute can be used in Advanced Search                                                                                                       |
| int              | is_comparable                 | Defines whether the attribute can be compared on the frontend                                                                                                      |
| int              | is_used_for_promo_rules       | Defines whether the attribute can be used for promo rules                                                                                                          |
| int              | is_visible_on_front           | Defines whether the attribute can be visible on the frontend                                                                                                       |
| int              | used_in_product_listing       | Defines whether the attribute can be used in product listing                                                                                                       |
| associativeArray | additional_fields             | Array of additional fields                                                                                                                                         |
| array            | frontend_label                | Array of catalogProductAttributeFrontendLabel                                                                                                                      |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `text`</h3>

| Type    | Name                     | Description                                                                                                                                                                                                                                         |
|---------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| string  | frontend_class           | Input Validation for Store Owner. Possible values: 'validate-number' (Decimal Number), 'validate-digits' (Integer Number), 'validate-email', 'validate-url', 'validate-alpha' (Letters), 'validate-alphanum' (Letters (a-z, A-Z), or Numbers (0-9)) |
| boolean | is_html_allowed_on_front | Defines whether the HTML tags are allowed on the frontend                                                                                                                                                                                           |
| boolean | used_for_sort_by         | Defines whether it is used for sorting in product listing                                                                                                                                                                                           |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `textarea`</h3>

| Type    | Name                     | Description                                               |
|---------|--------------------------|-----------------------------------------------------------|
| boolean | is_wysiwyg_enabled       | Enable WYSIWYG flag                                       |
| boolean | is_html_allowed_on_front | Defines whether the HTML tags are allowed on the frontend |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `date` and `boolean`</h3>

| Type    | Name             | Description                                               |
|---------|------------------|-----------------------------------------------------------|
| boolean | used_for_sort_by | Defines whether it is used for sorting in product listing |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `multiselect`</h3>

| Type    | Name                    | Description                                                     |
|---------|-------------------------|-----------------------------------------------------------------|
| boolean | is_filterable           | Defines whether it used in layered navigation                   |
| boolean | is_filterable_in_search | Defines whether it is used in search results layered navigation |
| integer | position                | Position                                                        |

<h3>`AdditionaFieldsEntity` Additional Fields for Type `select` and `price`</h3>

| Type    | Name                    | Description                                                     |
|---------|-------------------------|-----------------------------------------------------------------|
| boolean | is_filterable           | Defines whether it used in layered navigation                   |
| boolean | is_filterable_in_search | Defines whether it is used in search results layered navigation |
| integer | position                | Position                                                        |
| boolean | used_for_sort_by        | Defines whether it is used for sorting in product listing       |

<h3>Content `catalogProductAttributeFrontendLabel`</h3>

| Type   | Name     | Description |
|--------|----------|-------------|
| string | store_id | Store ID    |
| string | label    | Text label  |

<h3>Faults</h3>

| Fault Code | Fault Message                    |
|------------|----------------------------------|
| 101        | Requested attribute not found.   |
| 105        | Unable to save attribute.        |
| 107        | This attribute cannot be edited. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$attributeToUpdate = [
    'scope' => 'global',
    'is_unique' => 1,
    'is_required' => 1,
    'is_configurable' => 1,
    'is_searchable' => 1,
    'is_visible_in_advanced_search' => 0,
    'used_in_product_listing' => 0,
    'additional_fields' => [
        'is_filterable' => 1,
        'is_filterable_in_search' => 0,
        'position' => 2,
        'used_for_sort_by' => 0
    ],
    'frontend_label' => [
        [
            'store_id' => 0,
            'label' => 'A Test Attribute'
        ]
    ]
];

$result = $proxy->call(
    $sessionId,
    'product_attribute.update',
    [
        $attributeToUpdate
    ]
);
```

<h4>Request Example SOAP V2</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');

// V2
$session = $client->login('apiUser', 'apiKey');

// V2 WS-I Mode
// $response = $client->login(['username' => 'apiUser', 'apiKey' => 'apiKey']);
// $session = $response->result;

// V2
$attributeCode = 'code1';
$data = [
    'frontend_input' => 'text',
    'scope' => '1',
    'default_value' => '1',
    'is_unique' => 0,
    'is_required' => 0,
    'apply_to' => ['simple'],
    'is_configurable' => 0,
    'is_searchable' => 0,
    'is_visible_in_advanced_search' => 0,
    'is_comparable' => 0,
    'is_used_for_promo_rules' => 0,
    'is_visible_on_front' => 0,
    'used_in_product_listing' => 0,
    'additional_fields' => [],
    'frontend_label' => [
        [
            'store_id' => '0',
            'label' => 'some random label updated'
        ]
    ]
];

$orders = $client->catalogProductAttributeUpdate($session, $attributeCode, $data); 

// V2 WSI
// WSDL WSI Sample is not complete
// $result = $client->catalogProductAttributeCreate(['sessionId' => $session, 'data' => $data]);
// $orders = $result->result->complexObjectArray;

echo 'Number of results: ' . count($orders) . '<br>';
var_dump($orders);
```
