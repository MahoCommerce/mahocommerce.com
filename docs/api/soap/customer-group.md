**Method:**

-   customer_group.list (SOAP V1)
-   customerGroupList (SOAP V2)

Retrieve the list of customer groups

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |

**Returns**:

| Type | Name | Description |
| --- | --- | --- |
| array | result | An array of customerGroupEntity |

The **customerGroupEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | customer_group_id | ID of the customer group |
| string | customer_group_code | Customer group code |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'customer_group.list');
var_dump($result);

// If you don't need the session anymore
//$client->endSession($session);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->customerGroupList($sessionId);
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey'));

$result = $proxy->customerGroupList((object)array('sessionId' => $sessionId->result));
var_dump($result->result);
```

**Response Example SOAP V1**

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