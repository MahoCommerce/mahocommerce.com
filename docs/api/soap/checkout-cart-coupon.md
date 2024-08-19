Allows you to add and remove coupon codes for a shopping cart.

**Resource Name**: cart_coupon

**Methods**:

- cart_coupon.add - Add a coupon code to a quote
- cart_coupon.remove - Remove a coupon code from a quote

**Note**: In Magento, quotes and shopping carts are logically related, but technically different. The shopping cart is a wrapper for a quote, and it is used primarily by the frontend logic. The cart is represented by the Mage_Checkout_Model_Cart class and the quote is represented by the Mage_Sales_Model_Quote class.

**Faults**:

| Fault Code | Fault Message |
| --- | --- |
| 1001 | Can not make operation because store is not exists |
| 1002 | Can not make operation because quote is not exists |
| 1081 | Coupon could not be applied because quote is empty. |
| 1082 | Coupon could not be applied. |
| 1083 | Coupon is not valid. |

## Checkout Cart Coupon Add

**Method:**

-   cart_coupon.add (SOAP V1)
-   shoppingCartCouponAdd (SOAP V2)

Allows you to add a coupon code for a shopping cart (quote). The shopping cart must not be empty.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | quoteId | Shopping cart ID |
| string | couponCode | Coupon code |
| string | store | Store view ID or code (optional) |

**Return:**

| Type | Description |
| --- | --- |
| boolean | True if the coupon code is added |

**Faults:**

**Examples**:

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$shoppingCartId = $proxy->call( $sessionId, 'cart.create', array( 'magento_store' ) );
$couponCode = "aCouponCode";
$resultCartCouponRemove = $proxy->call(
	$sessionId,
	"cart_coupon.add",
	array(
		$shoppingCartId,
		$couponCode
	)
);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->shoppingCartCouponAdd($sessionId, '15', 'aCouponCode');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->shoppingCartCouponAdd((object)array('sessionId' => $sessionId->result, 'quoteId' => 15, 'couponCode' => 'aCouponCode', 'store' => '3'));   
var_dump($result->result);
```

## Checkout Cart Coupon Remove

**Method:**

-   cart_coupon.remove (SOAP V1)
-   shoppingCartCouponRemove (SOAP V2)

Allows you to remove a coupon code from a shopping cart (quote).

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| int | quoteId | Shopping cart ID |
| string | store | Store view ID or code (optional) |

**Return:**

| Type | Description |
| --- | --- |
| boolean | True if the coupon code is removed |

**Faults:**  
_No Faults._

**Examples**:

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$shoppingCartId = $proxy->call( $sessionId, 'cart.create', array( 'magento_store' ) );
$resultCartCouponRemove = $proxy->call(
	$sessionId,
	"cart_coupon.remove",
	array(
		$shoppingCartId
	)
);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->shoppingCartCouponRemove($sessionId, '15');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->shoppingCartCouponRemove((object)array('sessionId' => $sessionId->result, 'quoteId' => 15, 'store' => '3'));   
var_dump($result->result);
```