# Catalog Product Downloadable Link

**Resource**: product_downloadable_link

##### Methods:

- product_downloadable_link.add - Add a new link to the downloadable product
- product_downloadable_link.list - Get the list of links for a downloadable product
- product_downloadable_link.remove - Remove a link from a downloadable product

## Catalog Product Downloadable Link Add

**Method:**

-   product_downloadable_link.add (SOAP V1)
-   catalogProductDownloadableLinkAdd (SOAP V2)

Allows you to add a new link to a downloadable product.

**Arguments**:

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | productId | Product ID |
| array | resource | Array of catalogProductDownloadableLinkAddEntity |
| string | resourceType | Resource type. Can have one of the following values: "sample" or "link". |
| string | store | Store view ID or code (optional) |
| string | identifierType | Type of the product identifier. Can have one of the following values: "sku" or "id". |

**Return**:

| Type | Name | Description |
| --- | --- | --- |
| int | result | Result of adding a link to the downloadable product |

The **catalogProductDownloadableLinkAddEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | title | Link title |
| string | price | Custom option value row price |
| int | is_unlimited | Defines whether the number of downloads is unlimited |
| int | number_of_downloads | Maximum number of possible downloads |
| int | is_shareable | Defines whether the link is shareable |
| array | sample | Array of catalogProductDownloadableLinkAddSampleEntity |
| string | type | Type of the data source. Can have one of the following values: "file" or "url" |
| array | file | Array of catalogProductDownloadableLinkFileEntity |
| string | link_url | Link URL address |
| string | sample_url | Sample URL address |
| int | sort_order | Link sort order |

The **catalogProductDownloadableLinkAddSampleEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | type | Type of the data source. Can have one of the following values: "file" or "url" |
| array | file | Array of catalogProductDownloadableLinkFileEntity |
| string | url | URL to upload |

The **catalogProductDownloadableLinkFileEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | name | File name |
| string | base64_content | BASE64 encoded file |

**Faults**:

| Fault Code | Fault Message |
| --- | --- |
| 414 | Unable to save action. Details in error message. |
| 415 | Validation error has occurred. |

### Examples

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$filesPath = '/var/www/ws/tests/WebService/etc/Modules/Downloadable/Product/Link';
$downloadableProductId = 'downloadable_demo_product';

$items = array(
    'small' => array(
        'link' => array(
            'title' => 'Test file',
            'price' => '123',
            'is_unlimited' => '1',
            'number_of_downloads' => '111',
            'is_shareable' => '0',
            'sample' => array(
                'type' => 'file',
                'file' =>
                array(
                    'filename' => 'files/test.txt',
                ),
                'url' => 'http://www.magentocommerce.com/img/logo.gif',
            ),
            'type' => 'file',
            'file' =>
            array(
                'filename' => 'files/test.txt',
            ),
            'link_url' => 'http://www.magentocommerce.com/img/logo.gif',
        ),
        'sample' => array(
            'title' => 'Test sample file',
            'type' => 'file',
            'file' => array(
                'filename' => 'files/image.jpg',
            ),
            'sample_url' => 'http://www.magentocommerce.com/img/logo.gif',
            'sort_order' => '3',
        )
    ),
    'big' => array(
        'link' => array(
            'title' => 'Test url',
            'price' => '123',
            'is_unlimited' => '0',
            'number_of_downloads' => '111',
            'is_shareable' => '1',
            'sample' => array(
                'type' => 'url',
                'file' => array(
                    'filename' => 'files/book.pdf',
                ),
                'url' => 'http://www.magentocommerce.com/img/logo.gif',
            ),
            'type' => 'url',
            'file' => array(
                'filename' => 'files/song.mp3',
            ),
            'link_url' => 'http://www.magentocommerce.com/img/logo.gif',
        ),
        'sample' => array(
            'title' => 'Test sample url',
            'type' => 'url',
            'file' => array(
                'filename' => 'files/image.jpg',
            ),
            'sample_url' => 'http://www.magentocommerce.com/img/logo.gif',
            'sort_order' => '3',
        )
    )
);

$result = true;
foreach ($items as $item) {
    foreach ($item as $key => $value) {
        if ($value['type'] == 'file') {
            $filePath = $filesPath . '/' . $value['file']['filename'];
            $value['file'] = array('name' => str_replace('/', '_', $value['file']['filename']), 'base64_content' => base64_encode(file_get_contents($filePath)), 'type' => $value['type']);
        }
        if ($value['sample']['type'] == 'file') {
            $filePath = $filesPath . '/' . $value['sample']['file']['filename'];
            $value['sample']['file'] = array('name' => str_replace('/', '_', $value['sample']['file']['filename']), 'base64_content' => base64_encode(file_get_contents($filePath)));
        }
        if (!$proxy->call(
            $sessionId,
            'product_downloadable_link.add',
            array($downloadableProductId, $value, $key)
        )
        ) {
            $result = false;
        }
    }
}
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductDownloadableLinkAdd((object)array('sessionId' => $sessionId->result, 'productId' => '3', 'resourceType' => 'link', 'resource' => ((object)array(
    'title' => 'link',
    'price' => '10.99',
    'sample' => array(
    'type' => 'url',
    'url' => 'http://sometesturl.com')
))));
var_dump($result->result);
```

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductDownloadableLinkAdd((object)array('sessionId' => $sessionId->result, 'productId' => '3', 'resourceType' => 'link', 'resource' => ((object)array(
    'title' => 'link_2',
    'price' => '11.99',
    'type' => 'file',
    'file' => array(
    'name' => 'file_test',
    'base64_content' => '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAXABcDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDLooor8XP4DCiiigAooooAKKKKAP/Z'
)
))));
var_dump($result->result);
```

## Catalog Product Downloadable Link List

**Method:**

-   product_downloadable_link.list (SOAP V1)
-   catalogProductDownloadableLinkList (SOAP V2)

Allows you to retrieve a list of links of a downloadable product.

**Arguments**:

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | productId | Product ID or SKU |
| string | store | Store view ID or code (optional) |
| string | identifierType | Defines whether the product ID or SKU is passed in the request |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of catalogProductDownloadableLinkListEntity |

The **catalogProductDownloadableLinkListEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| array | links | Array of catalogProductDownloadableLinkEntity |
| array | samples | Array of catalogProductDownloadableLinkSampleEntity |

The **catalogProductDownloadableLinkEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | link_id | Link ID |
| string | title | Link title |
| string | price | Downloadable link price value |
| int | number_of_downloads | Maximum number of possible downloads |
| int | is_unlimited | Defines whether the number of downloads is unlimited |
| int | is_shareable | Defines whether the link is shareable |
| string | link_url | Link URL address |
| string | link_type | Type of the link data source. Can have one of the following values: "file" or "url" |
| string | sample_file | Sample file name |
| string | sample_url | Sample URL |
| string | sample_type | Type of sample data source. Can have one of the following values: "file" or "url" |
| int | sort_order | Link sort order |
| array | file_save | Array of catalogProductDownloadableLinkFileInfoEntity |
| array | sample_file_save | Array of catalogProductDownloadableLinkFileInfoEntity |

The **catalogProductDownloadableLinkSampleEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | sample_id | Sample ID |
| string | product_id | Product ID |
| string | sample_file | Sample file name |
| string | sample_url | Sample URL |
| string | sample_type | Sample type. Can have one of the following values: "file" or "url" |
| string | sort_order | Sort order |
| string | default_title | Default title |
| string | store_title | Store title |
| string | title | Sample title |

The **catalogProductDownloadableLinkFileInfoEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | file | File |
| string | name | File name |
| int | size | File size |
| string | status | Status |

**Faults:**  
_No Faults_

### Examples

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$downloadableProductId = '5';

$resultList = $proxy->call(
    $sessionId,
    'product_downloadable_link.list',
    array($downloadableProductId)
);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogProductDownloadableLinkList($sessionId, '5', null, 'sku');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductDownloadableLinkList((object)array('sessionId' => $sessionId->result, 'productId' => '5'));
var_dump($result->result);
```

**Response Example SOAP V1**

```php
array
  'links' =>
    array
      0 =>
        array
          'link_id' => string '1' (length=1)
          'title' => string 'link 1' (length=11)
          'price' => string '30.0000' (length=7)
          'number_of_downloads' => string '0' (length=1)
          'is_shareable' => string '1' (length=1)
          'link_url' => null
          'link_type' => string 'file' (length=4)
          'sample_file' => string '/s/o/software.jpg' (length=17)
          'sample_url' => null
          'sample_type' => string 'file' (length=4)
          'sort_order' => string '1' (length=1)
          'file_save' =>
            array
              ...
          'sample_file_save' =>
            array
              ...
          'is_unlimited' => int 1
  'samples' =>
    array
      0 =>
        array
          'sample_id' => string '1' (length=1)
          'product_id' => string '5' (length=1)
          'sample_url' => null
          'sample_file' => string '/s/o/software.jpg' (length=17)
          'sample_type' => string 'file' (length=4)
          'sort_order' => string '2' (length=1)
          'default_title' => string 'Sample 1' (length=8)
          'store_title' => string 'Sample 1' (length=8)
          'title' => string 'Sample 1' (length=8)
```

## Catalog Product Downloadable Link Remove

**Method:**

-   product_downloadable_link.remove (SOAP V1)
-   catalogProductDownloadableLinkRemove (SOAP V2)

Allows you to remove a link/sample from a downloadable product.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | linkId/sampleId | Link/sample ID |
| string | resourceType | Resource type. Can have one of the following values: 'sample' or 'link' |

**Return:**

| Type | Description |
| --- | --- |
| boolean | True if the link/sample is removed from a downloadable product |

**Faults**:

| Fault Code | Fault Message |
| --- | --- |
| 412 | Link or sample with specified ID was not found. |
| 415 | Validation error has occurred. |
| 416 | Unable to remove link. Details in error message. |

### Examples

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$sampleId = 7;
$linkId = 9;

$resultSample = $proxy->call(
    $sessionId,
    'product_downloadable_link.remove',
    array($sampleId, 'sample')
);

$resultLink = $proxy->call(
    $sessionId,
    'product_downloadable_link.remove',
    array($linkId, 'link')
);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->catalogProductDownloadableLinkRemove($sessionId, '7', 'sample');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->catalogProductDownloadableLinkRemove((object)array('sessionId' => $sessionId->result, 'linkId' => '7', 'resourceType' => 'sample'));
var_dump($result->result);
```