# Checkout Cart Payment

## Introduction

Allows you to retrieve and set payment methods for a shopping cart.

<h3>Resource Name</h3>

- `cart_payment`

<h3>Methods</h3>

- `cart_payment.method` — Set a payment method for a shopping cart.
- `cart_payment.list` — Get the list of available payment methods for a shopping cart.

<h3>Faults</h3>

| Fault Code | Fault Message                                                             |
|------------|---------------------------------------------------------------------------|
| 1001       | Can not make operation because store is not exists                        |
| 1002       | Can not make operation because quote is not exists                        |
| 1071       | Payment method data is empty.                                             |
| 1072       | Customer’s billing address is not set. Required for payment method data.  |
| 1073       | Customer’s shipping address is not set. Required for payment method data. |
| 1074       | Payment method is not allowed                                             |
| 1075       | Payment method is not set.                                                |

## (Payment) Method

<h3>Method</h3>

- `cart_payment.method` (SOAP V1)
- `shoppingCartPaymentMethod` (SOAP V2)

Allows you to set a payment method for a shopping cart (quote).

<h3>Arguments</h3>

| Type   | Name      | Description                              |
|--------|-----------|------------------------------------------|
| string | sessionId | Session ID                               |
| int    | quoteId   | Shopping cart ID                         |
| array  | method    | Array of shoppingCartPaymentMethodEntity |
| string | store     | Store view ID or code (optional)         |

<h3>Return</h3>

| Type    | Description     |
|---------|-----------------|
| boolean | True on success |

<h3>Content `shoppingCartPaymentMethodEntity`</h3>

| Type   | Name         | Description                  |
|--------|--------------|------------------------------|
| string | po_number    | Purchase order number        |
| string | method       | Payment method               |
| string | cc_cid       | Credit card CID              |
| string | cc_owner     | Credit card owner            |
| string | cc_number    | Credit card number           |
| string | cc_type      | Credit card type             |
| string | cc_exp_year  | Credit card expiration year  |
| string | cc_exp_month | Credit card expiration month |

<h3>Faults </h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$shoppingCartId = $proxy->call($sessionId, 'cart.create', ['maho_store']);

$paymentMethod = [
	'method' => 'checkmo'
];

$resultPaymentMethod = $proxy->call(
	$sessionId,
	'cart_payment.method',
	[
		$shoppingCartId,
		$paymentMethod
	]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login('apiUser', 'apiKey'); 
 
$result = $proxy->shoppingCartPaymentMethod($sessionId, 10, [
    'po_number' => null,
    'method' => 'checkmo',
    'cc_cid' => null,
    'cc_owner' => null,
    'cc_number' => null,
    'cc_type' => null,
    'cc_exp_year' => null,
    'cc_exp_month' => null
]);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->shoppingCartPaymentMethod((object)['sessionId' => $sessionId->result, 'quoteId' => 10, 'method' => [
    'po_number' => null,
    'method' => 'checkmo',
    'cc_cid' => null,
    'cc_owner' => null,
    'cc_number' => null,
    'cc_type' => null,
    'cc_exp_year' => null,
    'cc_exp_month' => null
]]);
var_dump($result->result);
```

## List

<h3>Method</h3>

- `cart_payment.list` (SOAP V1)
- `shoppingCartPaymentList` (SOAP V2)

Allows you to retrieve a list of available payment methods for a shopping cart (quote).

<h3>Arguments</h3>

| Type   | Name      | Description                      |
|--------|-----------|----------------------------------|
| string | sessionId | Session ID                       |
| int    | quoteId   | Shopping cart ID                 |
| string | store     | Store view ID or code (optional) |

<h3>Return</h3>

| Type  | Name   | Description                                      |
|-------|--------|--------------------------------------------------|
| array | result | Array of shoppingCartPaymentMethodResponseEntity |

<h3>Content `shoppingCartPaymentMethodResponseEntity`</h3>

| Type             | Name     | Description                |
|------------------|----------|----------------------------|
| string           | code     | Payment method code        |
| string           | title    | Payment method title       |
| associativeArray | cc_types | Array of credit card types |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'cart_payment.list', 'quoteId');
var_dump($result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'code' => string 'checkmo' (length=7)
      'title' => string 'Check / Money order' (length=19)
      'ccTypes' => null
  1 =>
    array
      'code' => string 'ccsave' (length=6)
      'title' => string 'Credit Card (saved)' (length=19)
      'ccTypes' =>
        array
          'AE' => string 'American Express' (length=16)
          'VI' => string 'Visa' (length=4)
          'MC' => string 'MasterCard' (length=10)
          'DI' => string 'Discover' (length=8)
```
