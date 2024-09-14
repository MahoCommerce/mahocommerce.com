# Checkout Cart Coupon

## Introduction

Allows you to add and remove coupon codes for a shopping cart.

<h3>Resource Name</h3>

- `cart_coupon`

<h3>Methods</h3>

- `cart_coupon.add` — Add a coupon code to a quote.
- `cart_coupon.remove` — Remove a coupon code from a quote.

**Note:** In Maho, quotes and shopping carts are logically related, but technically different.
The shopping cart is a wrapper for a quote, and it is used primarily by the frontend logic.
The cart is represented by the `Mage_Checkout_Model_Cart` class
and the quote is represented by the `Mage_Sales_Model_Quote` class.

<h3>Faults</h3>

| Fault Code | Fault Message                                       |
|------------|-----------------------------------------------------|
| 1001       | Can not make operation because store is not exists  |
| 1002       | Can not make operation because quote is not exists  |
| 1081       | Coupon could not be applied because quote is empty. |
| 1082       | Coupon could not be applied.                        |
| 1083       | Coupon is not valid.                                |

## Add

<h3>Method</h3>

- `cart_coupon.add` (SOAP V1)
- `shoppingCartCouponAdd` (SOAP V2)

Allows you to add a coupon code for a shopping cart (quote). The shopping cart must not be empty.

<h3>Arguments</h3>

| Type   | Name       | Description                      |
|--------|------------|----------------------------------|
| string | sessionId  | Session ID                       |
| int    | quoteId    | Shopping cart ID                 |
| string | couponCode | Coupon code                      |
| string | store      | Store view ID or code (optional) |

<h3>Return</h3>

| Type    | Description                      |
|---------|----------------------------------|
| boolean | True if the coupon code is added |

<h3>Faults</h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$shoppingCartId = $proxy->call($sessionId, 'cart.create', ['maho_store']);
$resultCartCouponRemove = $proxy->call(
	$sessionId,
	'cart_coupon.add',
	[
		$shoppingCartId,
		'exampleCouponCode'
	]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->shoppingCartCouponAdd($sessionId, '15', 'exampleCouponCode');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->shoppingCartCouponAdd(
    (object)[
        'sessionId' => $sessionId->result,
        'quoteId' => 15,
        'couponCode' => 'exampleCouponCode',
        'store' => '3'
    ]
);   
var_dump($result->result);
```

## Remove

<h3>Method</h3>

- `cart_coupon.remove` (SOAP V1)
- `shoppingCartCouponRemove` (SOAP V2)

Allows you to remove a coupon code from a shopping cart (quote).

<h3>Arguments</h3>

| Type   | Name      | Description                      |
|--------|-----------|----------------------------------|
| string | sessionId | Session ID                       |
| int    | quoteId   | Shopping cart ID                 |
| string | store     | Store view ID or code (optional) |

<h3>Return</h3>

| Type    | Description                        |
|---------|------------------------------------|
| boolean | True if the coupon code is removed |

<h3>Faults</h3>

_No Faults._

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$shoppingCartId = $proxy->call($sessionId, 'cart.create', ['maho_store']);
$resultCartCouponRemove = $proxy->call(
	$sessionId,
	'cart_coupon.remove',
	[
		$shoppingCartId
	]
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->shoppingCartCouponRemove($sessionId, '15');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->shoppingCartCouponRemove(
    (object)[
        'sessionId' => $sessionId->result,
        'quoteId' => 15,
        'store' => '3'
    ]
);   
var_dump($result->result);
```
