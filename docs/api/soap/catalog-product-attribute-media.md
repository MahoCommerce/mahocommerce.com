# Catalog Product Attribute Media

## Introduction

Allows you to manage product images.

<h3>Resource Name</h3>

- `catalog_product_attribute_media`

<h3>Aliases</h3>

- `product_attribute_media`
- `product_media`

<h3>Methods</h3>

- `catalog_product_attribute_media.currentStore` — Set/Get the current store view.
- `catalog_product_attribute_media.list` — Retrieve the product images.
- `catalog_product_attribute_media.info` — Retrieve the specified product image.
- `catalog_product_attribute_media.types` — Retrieve product image types.
- `catalog_product_attribute_media.create` — Upload a new image for a product.
- `catalog_product_attribute_media.update` — Update an image for a product.
- `catalog_product_attribute_media.remove` — Remove an image for a product.

<h3>Faults</h3>

| Fault Code | Fault Message                                          |
|------------|--------------------------------------------------------|
| 100        | Requested store view not found.                        |
| 101        | Product not exists.                                    |
| 102        | Invalid data given. Details in error message.          |
| 103        | Requested image not exists in product images’ gallery. |
| 104        | Image creation failed. Details in error message.       |
| 105        | Image not updated. Details in error message.           |
| 106        | Image not removed. Details in error message.           |
| 107        | Requested product doesn’t support images               |

<h3>Example — Working With Product Images</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$newImage = [
    'file' => [
        'name' => 'file_name',
        'content' => base64_encode(file_get_contents('product.jpg')),
        'mime' => 'image/jpeg'
    ],
    'label' => 'Cool Image Through Soap',
    'position' => 2,
    'types' => ['small_image'],
    'exclude' => 0
];

$imageFilename = $proxy->call($sessionId, 'product_media.create', ['sku', $newImage]);
var_dump($imageFilename);

// Newly created image file
var_dump($proxy->call($sessionId, 'product_media.list', 'sku'));

$proxy->call(
    $sessionId,
    'product_media.update',
    [
        'sku',
        $imageFilename,
        [
            'position' => 2,
            'types' => ['image']
        ]
    ]
);

// Updated image file
var_dump($proxy->call($sessionId, 'product_media.list', 'sku'));

// Remove image file
$proxy->call($sessionId, 'product_media.remove', ['sku', $imageFilename]);

// Images without our file
var_dump($proxy->call($sessionId, 'product_media.list', 'sku'));
```

## CurrentStore

<h3>Method</h3>

- `catalog_product_attribute_media.currentStore` (SOAP V1)
- `catalogProductAttributeMediaCurrentStore` (SOAP V2)

Allows you to set/get the current store view.

<h3>Aliases</h3>

- `product_attribute_media.currentStore`
- `product_media.currentStore`

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

$result = $client->call($session, 'catalog_product_attribute_media.currentStore', 'english');
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary
 
$result = $proxy->catalogProductAttributeMediaCurrentStore($sessionId, 'english');
var_dump($result);
```

## List

<h3>Method</h3>

- `catalog_product_attribute_media.list` (SOAP V1)
- `catalogProductAttributeMediaList` (SOAP V2)

Allows you to retrieve the list of product images.

<h3>Aliases</h3>

- `product_attribute_media.list`
- `product_media.list`

<h3>Arguments</h3>

| Type   | Name           | Description                                                                |
|--------|----------------|----------------------------------------------------------------------------|
| string | sessionId      | Session ID                                                                 |
| string | productId      | Product ID or SKU                                                          |
| string | storeView      | Store view ID or code (optional)                                           |
| string | identifierType | Defines whether the product ID or sku is passed in the 'product' parameter |

<h3>Returns</h3>

| Type  | Name   | Description                        |
|-------|--------|------------------------------------|
| array | result | Array of catalogProductImageEntity |

<h3>Content `catalogProductImageEntity`</h3>

| Type          | Name     | Description                                                               |
|---------------|----------|---------------------------------------------------------------------------|
| string        | file     | Image file name                                                           |
| string        | label    | Image label                                                               |
| string        | position | Image position                                                            |
| string        | exclude  | Defines whether the image will associate only to one of three image types |
| string        | url      | Image URL                                                                 |
| ArrayOfString | types    | Array of types                                                            |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_attribute_media.list', '2');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeMediaList($sessionId, '2');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeMediaList(
    (object)[
        'sessionId' => $sessionId->result,
        'productId' => '2'
    ]
);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'file' => string '/b/l/blackberry8100_2.jpg' (length=25)
      'label' => string '' (length=0)
      'position' => string '1' (length=1)
      'exclude' => string '0' (length=1)
      'url' => string 'https://mahohost/blackberry8100_2.jpg' (length=71)
      'types' =>
        array
          0 => string 'image' (length=5)
          1 => string 'small_image' (length=11)
          2 => string 'thumbnail' (length=9)
```

## Info

<h3>Method</h3>

- `catalog_product_attribute_media.info` (SOAP V1)
- `catalogProductAttributeMediaInfo` (SOAP V2)

Allows you to retrieve information about the specified product image.

<h3>Aliases</h3>

- `product_attribute_media.info`
- `product_media.info`

<h3>Arguments</h3>

| Type   | Name           | Description                                                                |
|--------|----------------|----------------------------------------------------------------------------|
| string | sessionId      | Session ID                                                                 |
| string | productId      | Product ID or SKU                                                          |
| string | file           | Name of the image file incl. path (e.g. '/b/l/blackberry8100_2.jpg')       |
| string | storeView      | Store view ID or code (optional)                                           |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type  | Name   | Description                        |
|-------|--------|------------------------------------|
| array | result | Array of catalogProductImageEntity |

<h3>Content `catalogProductImageEntity`</h3>

| Type          | Name     | Description                                                               |
|---------------|----------|---------------------------------------------------------------------------|
| string        | file     | Image file name                                                           |
| string        | label    | Image file label                                                          |
| string        | position | Image file position                                                       |
| string        | exclude  | Defines whether the image will associate only to one of three image types |
| string        | url      | Image URL                                                                 |
| ArrayOfString | types    | Array of types                                                            |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'catalog_product_attribute_media.info',
    [
        'product' => '2',
        'file' => '/b/l/blackberry8100_2.jpg'
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

$result = $proxy->catalogProductAttributeMediaInfo($sessionId, '2', '/b/l/blackberry8100_2.jpg');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeMediaInfo(
    (object)[
        'sessionId' => $sessionId->result,
        'productId' => '1',
        'file' => '/i/m/image.png'
    ]
);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  'file' => string '/b/l/blackberry8100_2.jpg' (length=25)
  'label' => string '' (length=0)
  'position' => string '1' (length=1)
  'exclude' => string '0' (length=1)
  'url' => string 'https://mahohost/media/catalog/product/b/l/blackberry8100_2.jpg' (length=71)
  'types' =>
    array
      0 => string 'image' (length=5)
      1 => string 'small_image' (length=11)
      2 => string 'thumbnail' (length=9)
```

## Types

<h3>Method</h3>

- `catalog_product_attribute_media.types` (SOAP V1)
- `catalogProductAttributeMediaTypes` (SOAP V2)

Allows you to retrieve product image types including standard `image`, `small_image`, `thumbnail` etc.
Note that if the product attribute set contains attributes of the media image type
(**Catalog Input Type for Store Owner > Media Image**), it will also be returned in the response.

<h4>Aliases</h4>

- `product_attribute_media.types`
- `product_media.types`

<h3>Arguments</h3>

| Type   | Name      | Description                     |
|--------|-----------|---------------------------------|
| string | sessionId | Session ID                      |
| string | setId     | ID of the product attribute set |

<h3>Returns</h3>

| Type   | Name   | Description                                     |
|--------|--------|-------------------------------------------------|
| array  | result | Array of catalogProductAttributeMediaTypeEntity |

<h3>Content `catalogProductAttributeMediaTypeEntity`</h3>

| Type   | Name  | Description                             |
|--------|-------|-----------------------------------------|
| string | code  | Image type code                         |
| string | scope | Image scope (store, website, or global) |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'catalog_product_attribute_media.types', '4');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->catalogProductAttributeMediaTypes($sessionId, '4');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeMediaTypes(
    (object)[
        'sessionId' => $sessionId->result,
        'setId' => '4'
    ]
);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'code' => string 'image' (length=5)
      'scope' => string 'store' (length=5)
  1 =>
    array
      'code' => string 'small_image' (length=11)
      'scope' => string 'store' (length=5)
  2 =>
    array
      'code' => string 'thumbnail' (length=9)
      'scope' => string 'store' (length=5)
```

## Create

<h3>Method</h3>

- `catalog_product_attribute_media.create` (SOAP V1)
- `catalogProductAttributeMediaCreate` (SOAP V2)

Allows you to upload a new product image.

<h3>Aliases</h3>

- `product_attribute_media.create`
- `product_media.create`

<h3>Arguments</h3>

| Type   | Name           | Description                                                                |
|--------|----------------|----------------------------------------------------------------------------|
| string | sessionId      | Session ID                                                                 |
| string | product        | Product ID or code                                                         |
| array  | data           | Array of catalogProductAttributeMediaCreateEntity                          |
| string | storeView      | Store view ID or code (optional)                                           |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type   | Name   | Description                                        |
|--------|--------|----------------------------------------------------|
| string | result | Image file name incl. path (e.g. '/i/m/image.png') |

<h3>Content `catalogProductAttributeMediaCreateEntity`</h3>

| Type          | Name     | Description                                                               |
|---------------|----------|---------------------------------------------------------------------------|
| array         | file     | Array of catalogProductImageFileEntity                                    |
| string        | label    | Image label                                                               |
| string        | position | Image position                                                            |
| ArrayOfString | types    | Array of types                                                            |
| string        | exclude  | Defines whether the image will associate only to one of three image types |
| string        | remove   | Remove image flag                                                         |

<h3>Content `catalogProductImageFileEntity`</h3>

| Type   | Name    | Description                        |
|--------|---------|------------------------------------|
| string | content | Image content (base_64 encoded)    |
| string | mime    | Image mime type (e.g., image/jpeg) |
| string | name    | Image name                         |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$productId = 2;
$file = [
	'content' => 'R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
	'mime' => 'image/gif'
];

$result = $proxy->call(
	$session,
	'catalog_product_attribute_media.create',
	[
		$productId,
		[
		    'file' => $file,
		    'label' => 'Label',
		    'position' => '100',
		    'types' => ['thumbnail'],
		    'exclude' => 0
        ]
	]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$productId = 2;
$file = [
	'content' => 'R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
	'mime' => 'image/gif'
];

$result = $proxy->catalogProductAttributeMediaCreate(
	$session,
	$productId,
	[
	    'file' => $file,
	    'label' => 'Label',
	    'position' => '100',
	    'types' => ['thumbnail'],
	    'exclude' => 0
    ]
);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeMediaCreate(
    (object)[
        'sessionId' => $sessionId->result,
        'productId' => '1',
        'data' => (object)[
            'label' => 'image_label',
            'position' => '1',
            'types' => ['thumbnail'],
            'exclude' => '0',
            'file' => (object)[
                'content' => 'R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                'mime' => 'image/png',
                'name' => 'image'
            ]
        ]
    ]
);
var_dump($result->result);
```

## Update

<h3>Method</h3>

- `catalog_product_attribute_media.update` (SOAP V1)
- `catalogProductAttributeMediaUpdate` (SOAP V2)

Allows you to update the product image.

<h3>Aliases</h3>

- `product_attribute_media.update`
- `product_media.update`

<h3>Arguments</h3>

| Type   | Name           | Description                                                                |
|--------|----------------|----------------------------------------------------------------------------|
| string | sessionId      | Session ID                                                                 |
| string | productId      | Product ID or code                                                         |
| string | file           | Image file name (e.g. '/i/m/image.jpeg')                                   |
| array  | data           | Array of catalogProductAttributeMediaCreateEntity                          |
| string | storeView      | Store view ID or code                                                      |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

**Notes:** You should specify only those parameters which you want to be updated.
Parameters not specified in the request will preserve the previous values.

<h3>Returns</h3>

| Type    | Name   | Description                      |
|---------|--------|----------------------------------|
| boolean | result | Result of product image updating |

<h3>Content `catalogProductAttributeMediaCreateEntity`</h3>

| Type          | Name     | Description                                                               |
|---------------|----------|---------------------------------------------------------------------------|
| array         | file     | Array of catalogProductImageFileEntity                                    |
| string        | label    | Product image label                                                       |
| string        | position | Product image position                                                    |
| ArrayOfString | types    | Array of types                                                            |
| string        | exclude  | Defines whether the image will associate only to one of three image types |
| string        | remove   | Image remove flag                                                         |

<h3>Content `catalogProductImageFileEntity`</h3>

| Type   | Name    | Description                             |
|--------|---------|-----------------------------------------|
| string | content | Product image content (base_64 encoded) |
| string | mime    | Image mime type (e.g., image/jpeg)      |
| string | name    | Image name                              |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$productId = 1;
$file = '/i/m/image.jpg';

$newFile = [
	'content' => 'R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
	'mime' => 'image/jpeg'
];

$result = $client->call(
	$session,
	'catalog_product_attribute_media.update',
	[
		$productId,
		$file,
		[
		    'file' => $newFile,
            'label' => 'New label',
            'position' => '50',
            'types' => ['image'],
            'exclude' => 1
        ]
	]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$productId = 1;
$file = '/i/m/image.jpg';

$newFile = [
    'content' => 'R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    'mime' => 'image/jpeg'
];

$result = $client->catalogProductAttributeMediaUpdate(
    $session,
    $productId,
    $file,
    [
        'file' => $newFile,
        'label' => 'New label',
        'position' => '50',
        'types' => ['image'],
        'exclude' => 1
    ]
);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeMediaUpdate(
    (object)[
        'sessionId' => $sessionId->result,
        'productId' => '1',
        'file' => '/t/u/tulips.jpg',
        'data' => (object)[
            'label' => 'tulips',
            'position' => '1',
            'remove' => '0',
            'types' => ['small_image']
        ]
    ]
);
var_dump($result->result);
```

## Remove

<h3>Method</h3>

- `catalog_product_attribute_media.remove` (SOAP V1)
- `catalogProductAttributeMediaRemove` (SOAP V2)

Allows you to remove the image from a product.

<h3>Aliases</h3>

- `product_attribute_media.remove`
- `product_media.remove`

<h3>Arguments</h3>

| Type   | Name           | Description                                                                |
|--------|----------------|----------------------------------------------------------------------------|
| string | sessionId      | Session ID                                                                 |
| string | productId      | Product ID or SKU                                                          |
| string | file           | Image file name (e.g. '/b/l/blackberry8100_2.jpg')                         |
| string | identifierType | Defines whether the product ID or SKU is passed in the 'product' parameter |

<h3>Returns</h3>

| Type       | Description                                     |
|------------|-------------------------------------------------|
| booleanint | True (1) if the image is removed from a product |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'catalog_product_attribute_media.remove',
    [
        'product' => '3',
        'file' => '/b/l/blackberry8100_2.jpg'
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

$result = $proxy->catalogProductAttributeMediaRemove($sessionId, '3', '/b/l/blackberry8100_2.jpg');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->catalogProductAttributeMediaRemove(
    (object)[
        'sessionId' => $sessionId->result,
        'productId' => '3',
        'file' => '/b/l/blackberry8100_2.jpg'
    ]
);
var_dump($result->result);
```
