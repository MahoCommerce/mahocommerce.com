# Customer

## Introduction

Allows you to create, retrieve, update, and delete data about customers.

<h3>Methods</h3>

- `customer.list` — Retrieve the list of customers.
- `customer.create` — Create a new customer.
- `customer.info` — Retrieve the customer data.
- `customer.update` — Update the customer data.
- `customer.delete` — Delete a required customer.

<h3>Faults</h3>

| Fault Code | Fault Message                                        |
|------------|------------------------------------------------------|
| 100        | Invalid customer data. Details in error message.     |
| 101        | Invalid filters specified. Details in error message. |
| 102        | Customer does not exist.                             |
| 103        | Customer not deleted. Details in error message.      |

<h3>Examples — View, Create, Update and Delete a Customer</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');

$newCustomer = [
    'firstname' => 'First',
    'lastname' => 'Last',
    'email' => 'test@example.com',
    'password_hash' => md5('password'),
    // The password hash can be either regular or salted md5:
    // $hash = md5($password);
    // $hash = md5($salt . $password) . ':' . $salt;
    // Both variants are valid.
    'store_id'   => 0,
    'website_id' => 0
];

$newCustomerId = $proxy->call($sessionId, 'customer.create', [$newCustomer]);

// Get new customer info
mp($proxy->call($sessionId, 'customer.info', $newCustomerId));

// Update customer
$update = ['firstname' => 'Changed Firstname'];
$proxy->call($sessionId, 'customer.update', [$newCustomerId, $update]);

mp($proxy->call($sessionId, 'customer.info', $newCustomerId));

// Delete customer
$proxy->call($sessionId, 'customer.delete', $newCustomerId);
```

## List

<h3>Method</h3>

- `customer.list` (SOAP V1)
- `customerCustomerList` (SOAP V2)

Allows you to retrieve the list of customers.

<h3>Arguments</h3>

| Type   | Name      | Description                                        |
|--------|-----------|----------------------------------------------------|
| string | sessionId | Session ID                                         |
| array  | filters   | Array of filters by customer attributes (optional) |

<h3>Returns</h3>

| Type  | Name      | Description                     |
|-------|-----------|---------------------------------|
| array | storeView | Array of customerCustomerEntity |

<h3>Content `customerCustomerEntity`</h3>

| Type    | Name          | Description                           |
|---------|---------------|---------------------------------------|
| int     | customer_id   | ID of the customer                    |
| string  | created_at    | Date when the customer was created    |
| string  | updated_at    | Date of when the customer was updated |
| string  | increment_id  | Increment ID                          |
| int     | store_id      | Store ID                              |
| int     | website_id    | Website ID                            |
| string  | created_in    | Created in                            |
| string  | email         | Customer email                        |
| string  | firstname     | Customer first name                   |
| string  | middlename    | Customer middle name                  |
| string  | lastname      | Customer last name                    |
| int     | group_id      | Group ID                              |
| string  | prefix        | Customer prefix                       |
| string  | suffix        | Customer suffix                       |
| string  | dob           | Customer date of birth                |
| string  | taxvat        | Taxvat value                          |
| boolean | confirmation  | Confirmation flag                     |
| string  | password_hash | Password hash                         |

**Note**: The `password_hash` parameter will only match exactly with the same MD5 and salt
as was used when Maho stored the value.
If you try to match with an unsalted MD5 hash or any salt other than what Maho used, it will not match.
This is just a straight string comparison.

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'customer.list');
mp($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2 (List of All Customers)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->customerCustomerList($sessionId);
mp($result);
```

<h4>Request Example SOAP V2 (Complex Filter)</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$complexFilter = [
    'complex_filter' => [
        [
            'key' => 'group_id',
            'value' => ['key' => 'in', 'value' => '1,3']
        ]
    ]
];
$result = $client->customerCustomerList($session, $complexFilter);
mp($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->customerCustomerList((object)['sessionId' => $sessionId->result, 'filters' => null]);
mp($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'customer_id' => string '2' (length=1)
      'created_at' => string '2012-03-29 12:37:23' (length=19)
      'updated_at' => string '2012-04-03 11:20:18' (length=19)
      'store_id' => string '2' (length=1)
      'website_id' => string '2' (length=1)
      'created_in' => string 'English' (length=7)
      'default_billing' => string '3' (length=1)
      'default_shipping' => string '3' (length=1)
      'disable_auto_group_change' => string '0' (length=1)
      'email' => string 'test@example.com' (length=16)
      'firstname' => string 'John' (length=4)
      'group_id' => string '1' (length=1)
      'lastname' => string 'Doe' (length=3)
      'password_hash' => string 'cccfb3ecf54c9644a34106783148eff2:sp' (length=35)
      'rp_token' => string '15433dd072f1f4e5aae83231b93f72d0' (length=32)
      'rp_token_created_at' => string '2012-03-30 15:10:31' (length=19)
  1 =>
    array
      'customer_id' => string '4' (length=1)
      'created_at' => string '2012-04-03 11:21:15' (length=19)
      'updated_at' => string '2012-04-03 11:22:57' (length=19)
      'store_id' => string '0' (length=1)
      'website_id' => string '2' (length=1)
      'created_in' => string 'Admin' (length=5)
      'default_billing' => string '8' (length=1)
      'default_shipping' => string '8' (length=1)
      'disable_auto_group_change' => string '0' (length=1)
      'email' => string 'shon@example.com' (length=16)
      'firstname' => string 'Shon' (length=4)
      'group_id' => string '1' (length=1)
      'lastname' => string 'McMiland' (length=8)
      'password_hash' => string '5670581cabba4e2189e5edee99ed0c86:5q' (length=35)
```

## Create

<h3>Method</h3>

- `customer.create` (SOAP V1)
- `customerCustomerCreate` (SOAP V2)

Create a new customer.

<h3>Arguments</h3>

| Type   | Name         | Description                             |
|--------|--------------|-----------------------------------------|
| string | sessionId    | Session ID                              |
| array  | customerData | Array of customerCustomerEntityToCreate |

<h3>Returns</h3>

| Type | Name   | Description                |
|------|--------|----------------------------|
| int  | result | ID of the created customer |

<h3>Content `customerCustomerEntityToCreate`</h3>

| Type   | Name       | Description                                      |
|--------|------------|--------------------------------------------------|
| string | email      | Customer email                                   |
| string | firstname  | Customer first name                              |
| string | lastname   | Customer last name                               |
| string | password   | Customer password                                |
| int    | website_id | Website ID                                       |
| int    | store_id   | Store ID                                         |
| int    | group_id   | Group ID                                         |
| string | prefix     | Customer prefix (optional)                       |
| string | suffix     | Customer suffix (optional)                       |
| string | dob        | Customer date of birth (optional)                |
| string | taxvat     | Customer tax/VAT number (optional)               |
| int    | gender     | Customer gender: 1 - Male, 2 - Female (optional) |
| string | middlename | Customer middle name/initial (optional)          |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'customer.create',
    [
        [
            'email' => 'mail@example.org',
            'firstname' => 'Dough',
            'lastname' => 'Deeks',
            'password' => 'password',
            'website_id' => 1,
            'store_id' => 1,
            'group_id' => 1
        ]
    ]
);
mp($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->customerCustomerCreate(
    $session,
    [
        'email' => 'customer-mail@example.org',
        'firstname' => 'Dough',
        'lastname' => 'Deeks',
        'password' => 'password',
        'website_id' => 1,
        'store_id' => 1,
        'group_id' => 1
    ]
);
mp($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->customerCustomerCreate(
    (object)[
        'sessionId' => $sessionId->result,
        'customerData' => (object)[
            'email' => 'customer-mail@example.org',
            'firstname' => 'John',
            'lastname' => 'Dou',
            'password' => '123123',
            'website_id' => '0',
            'group_id' => '1'
        ]
    ]
);   
mp($result->result);
```

## Info

<h3>Method</h3>

- `customer.info` (SOAP V1)
- `customerCustomerInfo` (SOAP V2)

Retrieve information about the specified customer.

<h3>Arguments</h3>

| Type          | Name       | Description                 |
|---------------|------------|-----------------------------|
| string        | sessionId  | Session ID                  |
| int           | customerId | ID of the required customer |
| ArrayOfString | attributes | Array of attributes         |

**Note:** Only specified attributes will be returned.
The `customer_id` value is always returned.

<h3>Returns</h3>

| Type  | Name         | Description                     |
|-------|--------------|---------------------------------|
| array | customerInfo | Array of customerCustomerEntity |

<h3>Content `customerCustomerEntity`</h3>

| Type    | Name                | Description                            |
|---------|---------------------|----------------------------------------|
| int     | customer_id         | ID of the customer                     |
| string  | created_at          | Date when the customer was created     |
| string  | updated_at          | Date when the customer was updated     |
| string  | increment_id        | Increment ID                           |
| int     | store_id            | Store ID                               |
| int     | website_id          | Website ID                             |
| string  | created_in          | Store view the customer was created in |
| string  | email               | Customer email                         |
| string  | firstname           | Customer first name                    |
| string  | middlename          | Customer middle name                   |
| string  | lastname            | Customer last name                     |
| int     | group_id            | Customer group ID                      |
| string  | prefix              | Customer prefix                        |
| string  | suffix              | Customer suffix                        |
| string  | dob                 | Customer date of birth                 |
| string  | taxvat              | Tax/VAT number                         |
| boolean | confirmation        | Confirmation flag                      |
| string  | password_hash       | Password hash                          |
| string  | rp_token            | Reset password token                   |
| string  | rp_token_created_at | Date when the password was reset       |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'customer.info', '2');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->customerCustomerInfo($sessionId, '2');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->customerCustomerInfo((object)['sessionId' => $sessionId->result, 'customerId' => '2']);
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  'customer_id' => string '2' (length=1)
  'created_at' => string '2012-03-29 12:37:23' (length=19)
  'updated_at' => string '2012-03-30 12:59:21' (length=19)
  'increment_id' => null
  'store_id' => string '2' (length=1)
  'website_id' => string '2' (length=1)
  'confirmation' => null
  'created_in' => string 'English' (length=7)
  'default_billing' => null
  'default_shipping' => string '2' (length=1)
  'disable_auto_group_change' => string '0' (length=1)
  'dob' => null
  'email' => string 'john@example.com' (length=16)
  'firstname' => string 'johny' (length=5)
  'gender' => null
  'group_id' => string '1' (length=1)
  'lastname' => string 'doe' (length=3)
  'middlename' => null
  'password_hash' => string 'cccfb3ecf54c9644a34106783148eff2:sp' (length=35)
  'prefix' => null
  'rp_token' => string '15433dd072f1f4e5aae83231b93f72d0' (length=32)
  'rp_token_created_at' => string '2012-03-30 15:10:31' (length=19)
  'suffix' => null
  'taxvat' => null
```

## Update

<h3>Method</h3>

- `customer.update` (SOAP V1)
- `customerCustomerUpdate` (SOAP V2)

Update information about the required customer.
Note that you need to pass only those arguments which you want to be updated.

<h3>Arguments</h3>

| Type   | Name         | Description                             |
|--------|--------------|-----------------------------------------|
| string | sessionId    | Session ID                              |
| int    | customerId   | Customer ID                             |
| array  | customerData | Array of customerCustomerEntityToCreate |

<h3>Returns</h3>

| Type    | Description                     |
|---------|---------------------------------|
| boolean | True if the customer is updated |

<h3>Content `customerCustomerEntityToCreate`</h3>

| Type   | Name        | Description                           |
|--------|-------------|---------------------------------------|
| int    | customer_id | Customer ID                           |
| string | email       | Customer email                        |
| string | firstname   | Customer first name                   |
| string | lastname    | Customer last name                    |
| string | password    | Customer password                     |
| int    | group_id    | Group ID                              |
| string | prefix      | Customer prefix                       |
| string | suffix      | Customer suffix                       |
| string | dob         | Customer date of birth                |
| string | taxvat      | Customer tax/VAT number               |
| int    | gender      | Customer gender: 1 - Male, 2 - Female |
| string | middlename  | Customer middle name/initial          |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'customer.update',
    [
        'customerId' => '2',
        'customerData' => [
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => 'test@example.com',
            'password' => 'john22'
        ]
    ]
);
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->customerCustomerUpdate(
    $session,
    '2',
    [
        'email' => 'customer-mail@example.org',
        'firstname' => 'Dough',
        'lastname' => 'Deekson',
        'password' => 'password',
        'website_id' => 1,
        'store_id' => 1,
        'group_id' => 1
    ]
);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->customerCustomerUpdate(
    (object)[
        'sessionId' => $sessionId->result,
        'customerId' => '2',
        'customerData' => (object)[
            'email' => 'customer-mail@example.org',
            'firstname' => 'Dough',
            'lastname' => 'Deekson'
        ]
    ]
);   
var_dump($result->result);
```

## Delete

<h3>Method</h3>

- `customer.delete` (SOAP V1)
- `customerCustomerDelete` (SOAP V2)

Delete the required customer.

<h3>Arguments</h3>

| Type   | Name       | Description |
|--------|------------|-------------|
| string | sessionId  | Session ID  |
| int    | customerId | Customer ID |

<h3>Returns</h3>

| Type    | Description                     |
|---------|---------------------------------|
| boolean | True if the customer is deleted |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'customer.delete', '2');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->customerCustomerDelete($sessionId, '2');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->customerCustomerDelete((object)['sessionId' => $sessionId->result, 'customerId' => '2']);   
var_dump($result->result);
```
