# Sales Order invoice

## Introduction

Allows you to manage invoices.

<h3>Resource Name</h3>

- `sales_order_invoice`

<h3>Aliases</h3>

- `order_invoice`

<h3>Methods</h3>

- `sales_order_invoice.list` — Retrieve a list of invoices using filters.
- `sales_order_invoice.info` — Retrieve information about the invoice.
- `sales_order_invoice.create` — Create a new invoice for an order.
- `sales_order_invoice.addComment` — Add a new comment to an invoice.
- `sales_order_invoice.capture` — Capture an invoice.
- `sales_order_invoice.cancel` — Cancel an invoice.

<h3>Faults</h3>

| Fault Code | Fault Message                                    |
|------------|--------------------------------------------------|
| 100        | Requested shipment does not exists.              |
| 101        | Invalid filters given. Details in error message. |
| 102        | Invalid data given. Details in error message.    |
| 103        | Requested order does not exists                  |
| 104        | Invoice status not changed.                      |

<h3>Example — Working With Invoices</h3>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$notInvoicedOrderId  = '100000003';

// Create new invoice
$newInvoiceId = $proxy->call($sessionId, 'sales_order_invoice.create', [$notInvoicedOrderId, [], 'Invoice Created', true, true]);

// View new invoice
$invoice = $proxy->call($sessionId, 'sales_order_invoice.info', $newInvoiceId);

var_dump($invoice);

// Add Comment
$proxy->call($sessionId, 'sales_order_invoice.addComment', [$newInvoiceId, 'Invoice comment, some text', true, false]);

// View invoice with new comment
$invoice = $proxy->call($sessionId, 'sales_order_invoice.info', $newInvoiceId);

var_dump($invoice);

$proxy->call($sessionId, 'sales_order_invoice.capture', $newInvoiceId);

// View captured invoice
$invoice = $proxy->call($sessionId, 'sales_order_invoice.info', $newInvoiceId);
var_dump($invoice);
```

## List

<h3>Method</h3>

- `sales_order_invoice.list` (SOAP V1)
- `salesOrderInvoiceList` (SOAP V2)

Allows you to retrieve the list of order invoices. Additional filters can also be applied.

<h3>Alias</h3>

- `order_invoice.list`

<h3>Arguments</h3>

| Type   | Name      | Description                                          |
|--------|-----------|------------------------------------------------------|
| string | sessionId | Session ID                                           |
| array  | filters   | Array of filters for the list of invoices (optional) |

<h3>Returns</h3>

| Type  | Name   | Description                      |
|-------|--------|----------------------------------|
| array | result | Array of salesOrderInvoiceEntity |

<h3>Content `salesOrderInvoiceEntity`</h3>

| Type   | Name                | Description                     |
|--------|---------------------|---------------------------------|
| string | increment_id        | Increment ID                    |
| string | created_at          | Date of invoice creation        |
| string | order_currency_code | Order currency code (e.g., EUR) |
| string | order_id            | Order ID                        |
| string | state               | Order state                     |
| string | grand_total         | Grand total amount invoiced     |
| string | invoice_id          | Invoice ID                      |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'sales_order_invoice.list');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2 (List of All Invoices)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->salesOrderInvoiceList($sessionId);
var_dump($result);
```

<h4>Request Example SOAP V2 (Complex Filter)</h4>

```php
$client = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$complexFilter = [
    'complex_filter' => [
        [
            'key' => 'state',
            'value' => ['key' => 'in', 'value' => '2,3']
        ]
    ]
];
$result = $client->salesOrderInvoiceList($session, $complexFilter);
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->salesOrderInvoiceList((object)['sessionId' => $sessionId->result]);   
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  0 =>
    array
      'order_id' => string '2' (length=1)
      'increment_id' => string '200000001' (length=9)
      'created_at' => string '2012-03-30 12:02:19' (length=19)
      'state' => string '2' (length=1)
      'grand_total' => string '384.9800' (length=8)
      'order_currency_code' => string 'USD' (length=3)
      'invoice_id' => null
  1 =>
    array
      'order_id' => string '3' (length=1)
      'increment_id' => string '200000002' (length=9)
      'created_at' => string '2012-03-30 12:06:20' (length=19)
      'state' => string '2' (length=1)
      'grand_total' => string '339.9900' (length=8)
      'order_currency_code' => string 'USD' (length=3)
      'invoice_id' => null
```

## Info

<h3>Method</h3>

- `sales_order_invoice.info` (SOAP V1)
- `salesOrderInvoiceInfo` (SOAP V2)

Allows you to retrieve information about the required invoice.

<h3>Alias</h3>

- `order_invoice.info`

<h3>Arguments</h3>

| Type   | Name               | Description          |
|--------|--------------------|----------------------|
| string | sessionId          | Session ID           |
| string | invoiceIncrementId | Invoice increment ID |

<h3>Returns</h3>

| Type  | Name   | Description                      |
|-------|--------|----------------------------------|
| array | result | Array of salesOrderInvoiceEntity |

<h3>Content `salesOrderInvoiceEntity`</h3>

| Type   | Name                 | Description                             |
|--------|----------------------|-----------------------------------------|
| string | increment_id         | Increment ID                            |
| string | parent_id            | Parent ID                               |
| string | store_id             | Store ID                                |
| string | created_at           | Date of creation                        |
| string | updated_at           | Date of updating                        |
| string | is_active            | Defines whether the invoice is active   |
| string | global_currency_code | Global currency code                    |
| string | base_currency_code   | Base currency code                      |
| string | store_currency_code  | Store currency code                     |
| string | order_currency_code  | Order currency code                     |
| string | store_to_base_rate   | Store to base rate                      |
| string | store_to_order_rate  | Store to order rate                     |
| string | base_to_global_rate  | Base to global rate                     |
| string | base_to_order_rate   | Base to order rate                      |
| string | subtotal             | Subtotal                                |
| string | base_subtotal        | Base subtotal                           |
| string | base_grand_total     | Base grand total                        |
| string | discount_amount      | Discount amount                         |
| string | base_discount_amount | Base discount amount                    |
| string | shipping_amount      | Shipping amount                         |
| string | base_shipping_amount | Base shipping amount                    |
| string | tax_amount           | Tax amount                              |
| string | base_tax_amount      | Base tax amount                         |
| string | billing_address_id   | Billing address ID                      |
| string | billing_firstname    | First name in the billing address       |
| string | billing_lastname     | Last name in the billing address        |
| string | order_id             | Order ID                                |
| string | order_increment_id   | Order increment ID                      |
| string | order_created_at     | Date of order creation                  |
| string | state                | Order state                             |
| string | grand_total          | Grand total                             |
| string | invoice_id           | Invoice ID                              |
| array  | items                | Array of salesOrderInvoiceItemEntity    |
| array  | comments             | Array of salesOrderInvoiceCommentEntity |

<h3>Content `salesOrderInvoiceItemEntity`</h3>

| Type   | Name                             | Description                                             |
|--------|----------------------------------|---------------------------------------------------------|
| string | increment_id                     | Increment ID                                            |
| string | parent_id                        | Parent ID                                               |
| string | created_at                       | Date of creation                                        |
| string | updated_at                       | Date of updating                                        |
| string | is_active                        | Active flag                                             |
| string | weee_tax_applied                 | Applied fixed product tax                               |
| string | qty                              | Quantity                                                |
| string | cost                             | Cost                                                    |
| string | price                            | Price                                                   |
| string | tax_amount                       | Tax amount                                              |
| string | row_total                        | Row total                                               |
| string | base_price                       | Base price                                              |
| string | base_tax_amount                  | Base tax amount                                         |
| string | base_row_total                   | Base row total                                          |
| string | base_weee_tax_applied_amount     | Applied fixed product tax amount (in base currency)     |
| string | base_weee_tax_applied_row_amount | Applied fixed product tax row amount (in base currency) |
| string | weee_tax_applied_amount          | Applied fixed product tax amount                        |
| string | weee_tax_applied_row_amount      | Applied fixed product tax row amount                    |
| string | weee_tax_disposition             | Fixed product tax disposition                           |
| string | weee_tax_row_disposition         | Fixed product tax row disposition                       |
| string | base_weee_tax_disposition        | Fixed product tax disposition (in base currency)        |
| string | base_weee_tax_row_disposition    | Fixed product tax row disposition (in base currency)    |
| string | sku                              | SKU                                                     |
| string | name                             | Name                                                    |
| string | order_item_id                    | Order item ID                                           |
| string | product_id                       | Product ID                                              |
| string | item_id                          | Item ID                                                 |

<h3>Content `salesOrderInvoiceCommentEntity`</h3>

| Type   | Name                 | Description                              |
|--------|----------------------|------------------------------------------|
| string | increment_id         | Increment ID                             |
| string | parent_id            | Parent ID                                |
| string | created_at           | Date of creation                         |
| string | updated_at           | Date of updating                         |
| string | is_active            | Active flag                              |
| string | comment              | Invoice comment                          |
| string | is_customer_notified | Defines whether the customer is notified |
| string | comment_id           | Comment ID                               |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'sales_order_invoice.info', '200000006');
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->salesOrderInvoiceInfo($sessionId, '200000006');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->salesOrderInvoiceInfo((object)['sessionId' => $sessionId->result, 'invoiceIncrementId' => '200000006']);   
var_dump($result->result);
```

<h4>Response Example SOAP V1</h4>

```php
array
  'store_id' => string '2' (length=1)
  'base_grand_total' => string '384.9800' (length=8)
  'shipping_tax_amount' => string '0.0000' (length=6)
  'tax_amount' => string '0.0000' (length=6)
  'base_tax_amount' => string '0.0000' (length=6)
  'store_to_order_rate' => string '1.0000' (length=6)
  'base_shipping_tax_amount' => string '0.0000' (length=6)
  'base_discount_amount' => string '0.0000' (length=6)
  'base_to_order_rate' => string '1.0000' (length=6)
  'grand_total' => string '384.9800' (length=8)
  'shipping_amount' => string '5.0000' (length=6)
  'subtotal_incl_tax' => string '379.9800' (length=8)
  'base_subtotal_incl_tax' => string '379.9800' (length=8)
  'store_to_base_rate' => string '1.0000' (length=6)
  'base_shipping_amount' => string '5.0000' (length=6)
  'total_qty' => string '1.0000' (length=6)
  'base_to_global_rate' => string '1.0000' (length=6)
  'subtotal' => string '379.9800' (length=8)
  'base_subtotal' => string '379.9800' (length=8)
  'discount_amount' => string '0.0000' (length=6)
  'billing_address_id' => string '3' (length=1)
  'is_used_for_refund' => null
  'order_id' => string '2' (length=1)
  'email_sent' => null
  'can_void_flag' => string '0' (length=1)
  'state' => string '2' (length=1)
  'shipping_address_id' => string '4' (length=1)
  'store_currency_code' => string 'USD' (length=3)
  'transaction_id' => null
  'order_currency_code' => string 'USD' (length=3)
  'base_currency_code' => string 'USD' (length=3)
  'global_currency_code' => string 'USD' (length=3)
  'increment_id' => string '200000006' (length=9)
  'created_at' => string '2012-03-30 12:02:19' (length=19)
  'updated_at' => string '2012-03-30 12:02:19' (length=19)
  'hidden_tax_amount' => string '0.0000' (length=6)
  'base_hidden_tax_amount' => string '0.0000' (length=6)
  'shipping_hidden_tax_amount' => string '0.0000' (length=6)
  'base_shipping_hidden_tax_amnt' => null
  'shipping_incl_tax' => string '5.0000' (length=6)
  'base_shipping_incl_tax' => string '5.0000' (length=6)
  'base_total_refunded' => null
  'cybersource_token' => null
  'invoice_id' => string '1' (length=1)
  'order_increment_id' => string '200000002' (length=9)
  'items' =>
    array
      0 =>
        array
          'parent_id' => string '1' (length=1)
          'base_price' => string '379.9800' (length=8)
          'tax_amount' => string '0.0000' (length=6)
          'base_row_total' => string '379.9800' (length=8)
          'discount_amount' => null
          'row_total' => string '379.9800' (length=8)
          'base_discount_amount' => null
          'price_incl_tax' => string '379.9800' (length=8)
          'base_tax_amount' => string '0.0000' (length=6)
          'base_price_incl_tax' => string '379.9800' (length=8)
          'qty' => string '1.0000' (length=6)
          'base_cost' => null
          'price' => string '379.9800' (length=8)
          'base_row_total_incl_tax' => string '379.9800' (length=8)
          'row_total_incl_tax' => string '379.9800' (length=8)
          'product_id' => string '1' (length=1)
          'order_item_id' => string '3' (length=1)
          'additional_data' => null
          'description' => null
          'sku' => string 'n2610-slider' (length=12)
          'name' => string 'Nokia 2610 Phone' (length=16)
          'hidden_tax_amount' => string '0.0000' (length=6)
          'base_hidden_tax_amount' => string '0.0000' (length=6)
          'base_weee_tax_applied_amount' => string '0.0000' (length=6)
          'base_weee_tax_applied_row_amnt' => string '0.0000' (length=6)
          'base_weee_tax_applied_row_amount' => string '0.0000' (length=6)
          'weee_tax_applied_amount' => string '0.0000' (length=6)
          'weee_tax_applied_row_amount' => string '0.0000' (length=6)
          'weee_tax_applied' => string 'a:0:{}' (length=6)
          'weee_tax_disposition' => string '0.0000' (length=6)
          'weee_tax_row_disposition' => string '0.0000' (length=6)
          'base_weee_tax_disposition' => string '0.0000' (length=6)
          'base_weee_tax_row_disposition' => string '0.0000' (length=6)
          'item_id' => string '1' (length=1)
  'comments' =>
    array
      empty
```

## Create

<h3>Method</h3>

- `sales_order_invoice.create` (SOAP V1)
- `salesOrderInvoiceCreate` (SOAP V2)

Allows you to create a new invoice for an order.

<h3>Alias</h3>

- `order_invoice.create`

<h3>Arguments</h3>

| Type   | Name               | Description                                            |
|--------|--------------------|--------------------------------------------------------|
| string | sessionId          | Session ID                                             |
| string | invoiceIncrementId | Order increment ID                                     |
| array  | itemsQty           | Array of orderItemIdQty (quantity of items to invoice) |
| string | comment            | Invoice comment (optional)                             |
| string | email              | Send invoice on email (optional)                       |
| string | includeComment     | Include comments in email (optional)                   |

<h3>Returns</h3>

| Type   | Description               |
|--------|---------------------------|
| string | ID of the created invoice |

<h3>Content `orderItemIdQty`</h3>

| Type   | Name          | Description   |
|--------|---------------|---------------|
| int    | order_item_id | Order item ID |
| double | qty           | Quantity      |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call(
    $session,
    'sales_order_invoice.create',
    ['orderIncrementId' => '200000008', ['15' => '1', '16' => '1']] 
    // orderItemIdQty Array is Keyed with Order Item ID, with Value of qty to invoice
);
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

// Create invoice for order

// orderItemIdQty Array is Keyed with Order Item ID, with Value of qty to invoice
$qty = ['15' => '1', '16' => '1'];

$invoiceIncrementId = $proxy->salesOrderInvoiceCreate(
    $sessionID,
    '200000008',
    $qty
);
var_dump($invoiceIncrementId);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']);

$result = $proxy->salesOrderInvoiceCreate((object)['sessionId' => $sessionId->result, 'orderIncrementId' => '200000008', 'itemsQty' => ['15' => '1',  '16' => '1'], 'comment' => null,
    'email' => null,
    'includeComment' => null
]);
var_dump($result->result);
```

## AddComment

<h3>Method</h3>

- `sales_order_invoice.addComment` (SOAP V1)
- `salesOrderInvoiceAddComment` (SOAP V2)

Allows you to add a new comment to the order invoice.

<h3>Alias</h3>

- `order_invoice.addComment`

<h3>Arguments</h3>

| Type   | Name               | Description                              |
|--------|--------------------|------------------------------------------|
| string | sessionId          | Session ID                               |
| string | invoiceIncrementId | Invoice increment ID                     |
| string | comment            | Invoice comment (optional)               |
| int    | email              | Send invoice on email flag (optional)    |
| int    | includeComment     | Include comment in email flag (optional) |

<h3>Returns</h3>

| Type    | Description                                 |
|---------|---------------------------------------------|
| boolean | True if the comment is added to the invoice |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$client = new SoapClient('https://mahohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apikey');

$result = $client->call($session, 'sales_order_invoice.addComment', ['invoiceIncrementId' => '200000006', 'comment' => 'invoice comment']);
var_dump($result);

// When the session can be closed
$client->endSession($session);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); // TODO: change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO: change login and pwd if necessary

$result = $proxy->salesOrderInvoiceAddComment($sessionId, '200000006');
var_dump($result);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->salesOrderInvoiceAddComment((object)['sessionId' => $sessionId->result, 'invoiceIncrementId' => '200000006', 'comment' => 'invoice comment', 'email' => null, 'includeComment' => null]);   
var_dump($result->result);
```

## Capture

<h3>Method</h3>

- `sales_order_invoice.capture` (SOAP V1)
- `salesOrderInvoiceCapture` (SOAP V2)

Allows you to capture the required invoice. Note that not all order invoices can be captured.
Only some payment methods support capturing the order invoice (e.g., PayPal Pro).

<h3>Alias</h3>

- `order_invoice.capture`

<h3>Arguments</h3>

| Type   | Name               | Description          |
|--------|--------------------|----------------------|
| string | sessionId          | Session ID           |
| string | invoiceIncrementId | Invoice increment ID |

<h3>Returns</h3>

| Type       | Description                                |
|------------|--------------------------------------------|
| booleanint | True (1) if the order invoice is captured. |

<h3>Notes</h3>

You should check the invoice to see if it can be captured before attempting to capture the invoice.
Otherwise, the API call will generate an error.

Invoices have states as defined in the model `Mage_Sales_Model_Order_Invoice`:

- `STATE_OPEN = 1`
- `STATE_PAID = 2`
- `STATE_CANCELED = 3`

Also note that there is a method call in the model that checks this for you: `canCapture()`.
And it also verifies that the payment can be captured,
so the invoice state might not be the only condition required to allow it to be captured.

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$orderIncrementId = '100000016';

// Create invoice for order
$invoiceIncrementId = $proxy->call(
    $session,
    'sales_order_invoice.create',
    [
        'orderIncrementId' => $orderIncrementId,
        ['order_item_id' => '15', 'qty' => '1']
    ]
);

// Capture invoice amount
$result = $proxy->call(
    $session,
    'sales_order_invoice.capture',
    $invoiceIncrementId
);
```

<h4>Request Example SOAP V2</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl');
$sessionID = $proxy->login('apiUser', 'apiKey');

$orderIncrementId = '100000016';

// Create invoice for order
$qty = [
    ['order_item_id' => '15', 'qty' => '1']
];
$invoiceIncrementId = $proxy->salesOrderInvoiceCreate(
    $sessionID,
    $orderIncrementId,
    $qty
);

// Capture invoice amount
$result = $proxy->salesOrderInvoiceCapture(
     $sessionID,
     $invoiceIncrementId
);
```

<h4>Request Example SOAP V2 (WS-I Compliance Mode)</h4>

```php
$proxy = new SoapClient('https://mahohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)['username' => 'apiUser', 'apiKey' => 'apiKey']); 
 
$result = $proxy->salesOrderInvoiceCapture((object)['sessionId' => $sessionId->result, 'invoiceIncrementId' => '100000016']);   

var_dump($result->result);
```

## Cancel

<h3>Method</h3>

- `sales_order_invoice.cancel` (SOAP V1)
- `salesOrderInvoiceCancel` (SOAP V2)

Allows you to cancel the required invoice.
Note that not all order invoices can be canceled.
Only some payment methods support canceling the order invoice (e.g., PayPal Express).

<h3>Alias</h3>

- `order_invoice.cancel`

<h3>Arguments</h3>

| Type   | Name               | Description          |
|--------|--------------------|----------------------|
| string | sessionId          | Session ID           |
| string | invoiceIncrementId | Invoice increment ID |

<h3>Returns</h3>

| Type    | Description                            |
|---------|----------------------------------------|
| boolean | True if the order invoice is canceled. |

<h3>Examples</h3>

<h4>Request Example SOAP V1</h4>

```php
$proxy = new SoapClient('https://mahohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$invoiceIncrementId = '100000013';

$result = $proxy->call(
    $session,
    'sales_order_invoice.cancel',
    $invoiceIncrementId
);
```
