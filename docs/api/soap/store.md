# Store

## Store Info

<h3>Method</h3>

- `store.info` (SOAP V1)
- `storeInfo` (SOAP V2)

Allows you to retrieve information about the required store view.

<h3>Arguments</h3>

| Type   | Name      | Description                      |
|--------|-----------|----------------------------------|
| string | sessionId | Session ID                       |
| string | storeId   | Store view ID or code (optional) |

<h3>Return</h3>

| Type  | Name   | Description          |
|-------|--------|----------------------|
| array | result | Array of storeEntity |

<h3>Content `storeEntity`</h3>

| Type   | Name       | Description                         |
|--------|------------|-------------------------------------|
| int    | store_id   | Store view ID                       |
| string | code       | Store view code                     |
| int    | website_id | Website ID                          |
| int    | group_id   | Group ID                            |
| string | name       | Store name                          |
| int    | sort_order | Store view sort order               |
| int    | is_active  | Defines whether the store is active |

<h3>Faults</h3>

| Fault Code | Fault Message                   |
|------------|---------------------------------|
| 101        | Requested store view not found. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'store.info', '2');
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->storeInfo($sessionId, '2');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->storeInfo((object)array('sessionId' => $sessionId->result, 'storeId' => '2'));
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  'store_id' => string '2' (length=1)
  'code' => string 'english' (length=7)
  'website_id' => string '2' (length=1)
  'group_id' => string '2' (length=1)
  'name' => string 'English' (length=7)
  'sort_order' => string '0' (length=1)
  'is_active' => string '1' (length=1)
```

## Store list

<h3>Method</h3>

- `store.list` (SOAP V1)
- `storeList` (SOAP V2)

Allows you to retrieve the list of store views.

<h3>Arguments</h3>

| Type   | Name      | Description |
|--------|-----------|-------------|
| string | sessionId | Session ID  |

<h3>Return</h3>

| Type  | Name   | Description          |
|-------|--------|----------------------|
| array | result | Array of storeEntity |

<h3>Content `storeEntity`</h3>

| Type   | Name       | Description                         |
|--------|------------|-------------------------------------|
| int    | store_id   | Store view ID                       |
| string | code       | Store view code                     |
| int    | website_id | Website ID                          |
| int    | group_id   | Group ID                            |
| string | name       | Store view name                     |
| int    | sort_order | Store view sort order               |
| int    | is_active  | Defines whether the store is active |

<h3>Faults</h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'store.list');
var_dump($result);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->storeList($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->storeList((object)['sessionId' => $sessionId->result]);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'store_id' => string '1' (length=1)
      'code' => string 'default' (length=7)
      'website_id' => string '1' (length=1)
      'group_id' => string '1' (length=1)
      'name' => string 'Default Store View' (length=18)
      'sort_order' => string '0' (length=1)
      'is_active' => string '1' (length=1)
  1 =>
    array
      'store_id' => string '2' (length=1)
      'code' => string 'english' (length=7)
      'website_id' => string '2' (length=1)
      'group_id' => string '2' (length=1)
      'name' => string 'English' (length=7)
      'sort_order' => string '0' (length=1)
      'is_active' => string '1' (length=1)
```
