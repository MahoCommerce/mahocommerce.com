# Customer Group

## Introduction

<h3>Method</h3>

- `customer_group.list` (SOAP V1)
- `customerGroupList` (SOAP V2)

Retrieve the list of customer groups.

<h3>Arguments</h3>

| Type   | Name      | Description  |
|--------|-----------|--------------|
| string | sessionId | Session ID   |

<h3>Returns</h3>

| Type  | Name   | Description                     |
|-------|--------|---------------------------------|
| array | result | An array of customerGroupEntity |

<h3>Content `customerGroupEntity`</h3>

| Type   | Name                | Description              |
|--------|---------------------|--------------------------|
| int    | customer_group_id   | ID of the customer group |
| string | customer_group_code | Customer group code      |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'customer_group.list');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->customerGroupList($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->customerGroupList((object)['sessionId' => $sessionId->result]);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'customer_group_id' => string '0' (length=1)
      'customer_group_code' => string 'NOT LOGGED IN' (length=13)
  1 =>
    array
      'customer_group_id' => string '1' (length=1)
      'customer_group_code' => string 'General' (length=7)
  2 =>
    array
      'customer_group_id' => string '2' (length=1)
      'customer_group_code' => string 'Wholesale' (length=9)
  3 =>
    array
      'customer_group_id' => string '3' (length=1)
      'customer_group_code' => string 'Retailer' (length=8)
```
