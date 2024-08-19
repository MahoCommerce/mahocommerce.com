# Sales Order Credit Memo

## Introduction

Allows you to operate with credit memos for orders.

**Resource: sales_order_creditmemo**

**Aliases**: order_creditmemo

**Methods:**

- sales_order_creditmemo.list - Retrieve the list of credit memos by filters
- sales_order_creditmemo.info - Retrieve the credit memo information
- sales_order_creditmemo.create - Create a new credit memo for order
- sales_order_creditmemo.addComment - Add a new comment to the credit memo
- sales_order_creditmemo.cancel - Cancel the credit memo

**Faults**::

| Fault Code | Fault Message |
| --- | --- |
| 100 | Requested credit memo does not exist. |
| 101 | Invalid filter given. Details in error message. |
| 102 | Invalid data given. Details in error message. |
| 103 | Requested order does not exist. |
| 104 | Credit memo status not changed. |
| 105 | Money can not be refunded to the store credit account as order was created by guest. |
| 106 | Credit memo for requested order can not be created. |

## Example:

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

// Create creditmemo
$orderIncrementId = '100000683'; //increment id of the invoiced order
$data = array(
    'qtys' => array(
        '712' => 1
    ),
    'shipping_amount' => 3,
    'adjustment_positive' => 0.7,
    'adjustment_negative' => 0.06
);
$creditmemoIncrementId = $proxy->call($sessionId, 'order_creditmemo.create', array($orderIncrementId, $data));
echo $creditmemoIncrementId . "<br />";

// Add comment to created creditmemo
$commentText = "Credit memo comment successfully added";
$isCommentAdded = $proxy->call($sessionId, 'order_creditmemo.addComment', array($creditmemoIncrementId, $commentText, true));

// Retrieve information about created creditmemo
$creditmemoInfo = $proxy->call($sessionId, 'order_creditmemo.info', array($creditmemoIncrementId));
print_r($creditmemoInfo);

// Retrieve list of creditmemos by filter
$filter = array(
    'increment_id' => array(
        'or' => array(
            array(
                'from' => '100000617',
                'to' => '100000619',
            ),
            array(
                'from' => $creditmemoIncrementId,
                'to' => NULL,
            )
        )
    )
);
$creditmemoList = $proxy->call($sessionId, 'order_creditmemo.list', array($filter));
print_r($creditmemoList);
```

## Sales Order Credit Memo List

**Method:**

-   order_creditmemo.list (SOAP V1)
-   salesOrderCreditmemoList (SOAP V2)

Allows you to retrieve the list of credit memos by filters.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| associative array | filters | Filters (optional) |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of salesOrderCreditmemoEntity |

The **salesOrderCreditmemoEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | updated_at | Date of updating |
| string | created_at | Date of creation |
| string | increment_id | Increment ID |
| string | transaction_id | Transaction ID |
| string | global_currency_code | Global currency code |
| string | base_currency_code | Base currency code |
| string | order_currency_code | Order currency code |
| string | store_currency_code | Store currency code |
| string | cybersource_token | Cybersource token |
| string | invoice_id | ID of the invoice for which the credit memo was created |
| string | billing_address_id | Billing address ID |
| string | shipping_address_id | Shipping address ID |
| string | state | State |
| string | creditmemo_status | Credit memo status |
| string | email_sent | Defines whether the email is sent |
| string | order_id | ID of the order for which the credit memo was created |
| string | tax_amount | Tax amount |
| string | shipping_tax_amount | Shipping tax amount |
| string | base_tax_amount | Base tax amount |
| string | base_adjustment_positive | Adjustment refund amount (using base currency) |
| string | base_grand_total | Base grand total |
| string | adjustment | Adjustment |
| string | subtotal | Subtotal |
| string | discount_amount | Discount amount |
| string | base_subtotal | Base subtotal |
| string | base_adjustment | Base adjustment |
| string | base_to_global_rate | Base to global rate |
| string | store_to_base_rate | Store to base rate |
| string | base_shipping_amount | Base shipping amount |
| string | adjustment_negative | Adjustment fee amount |
| string | subtotal_incl_tax | Subtotal including tax |
| string | shipping_amount | Shipping amount |
| string | base_subtotal_incl_tax | Base subtotal including tax |
| string | base_adjustment_negative | Adjustment fee amount (using base currency) |
| string | grand_total | Grand total |
| string | base_discount_amount | Base discount amount |
| string | base_to_order_rate | Base to order rate |
| string | store_to_order_rate | Store to order rate |
| string | base_shipping_tax_amount | Base shipping tax amount |
| string | adjustment_positive | Adjustment refund amount |
| string | store_id | Store ID |
| string | hidden_tax_amount | Hidden tax amount |
| string | base_hidden_tax_amount | Base hidden tax amount |
| string | shipping_hidden_tax_amount | Shipping hidden tax amount |
| string | base_shipping_hidden_tax_amnt | Base shipping hidden tax amount |
| string | shipping_incl_tax | Shipping including tax |
| string | base_shipping_incl_tax | Base shipping including tax |
| string | base_customer_balance_amount | Base customer balance amount |
| string | customer_balance_amount | Customer balance amount |
| string | bs_customer_bal_total_refunded | Refunded base customer balance amount |
| string | customer_bal_total_refunded | Customer balance total refunded |
| string | base_gift_cards_amount | Base gift cards amount |
| string | gift_cards_amount | Gift cards amount |
| string | gw_base_price | Gift wrapping price refunded amount (using base currency) |
| string | gw_price | Gift wrapping price refunded amount |
| string | gw_items_base_price | Gift wrapping items base price |
| string | gw_items_price | Gift wrapping items price |
| string | gw_card_base_price | Gift wrapping card base price |
| string | gw_card_price | Gift wrapping card price |
| string | gw_base_tax_amount | Gift wrapping tax amount refunded (using base currency) |
| string | gw_tax_amount | Gift wrapping tax amount refunded |
| string | gw_items_base_tax_amount | Gift wrapping items base tax amount |
| string | gw_items_tax_amount | Gift wrapping items tax amount |
| string | gw_card_base_tax_amount | Gift wrapping card base tax amount |
| string | gw_card_tax_amount | Gift wrapping card tax amount |
| string | base_reward_currency_amount | Base reward currency amount |
| string | reward_currency_amount | Reward currency amount |
| string | reward_points_balance | Reward points balance |
| string | reward_points_balance_refund | Reward points balance refund |
| string | creditmemo_id | Credit memo ID |
| array | items | Array of salesOrderCreditmemoItemEntity |
| array | comments | Array of salesOrderCreditmemoCommentEntity |

The **salesOrderCreditmemoItemEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | item_id | Credit memo item ID |
| string | parent_id | Parent ID |
| string | weee_tax_applied_row_amount | Applied fixed product tax row amount |
| string | base_price | Base price |
| string | base_weee_tax_row_disposition | Fixed product tax row disposition (in base currency) |
| string | tax_amount | Tax amount |
| string | base_weee_tax_applied_amount | Applied fixed product tax amount (in base currency) |
| string | weee_tax_row_disposition | Fixed product tax row disposition |
| string | base_row_total | Base row total |
| string | discount_amount | Discount amount |
| string | row_total | Row total |
| string | weee_tax_applied_amount | Applied fixed product tax amount |
| string | base_discount_amount | Base discount amount |
| string | base_weee_tax_disposition | Fixed product tax disposition (in base currency) |
| string | price_incl_tax | Price including tax |
| string | base_tax_amount | Base tax amount |
| string | weee_tax_disposition | Fixed product tax disposition |
| string | base_price_incl_tax | Base price including tax |
| string | qty | Quantity |
| string | base_cost | Base cost |
| string | base_weee_tax_applied_row_amount | Applied fixed product tax row amount (in base currency) |
| string | price | Price |
| string | base_row_total_incl_tax | Base row total including tax |
| string | row_total_incl_tax | Row total including tax |
| string | product_id | Product ID |
| string | order_item_id | Order item ID |
| string | additional_data | Additional data |
| string | description | Description |
| string | weee_tax_applied | Applied fixed product tax |
| string | sku | Item SKU |
| string | name | Name |
| string | hidden_tax_amount | Hidden tax amount |
| string | base_hidden_tax_amount | Base hidden tax amount |

The **salesOrderCreditmemoCommentEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | parent_id | Parent ID |
| string | created_at | Date of creation |
| string | comment | Comment data |
| string | is_customer_notified | Defines whether the customer is notified |
| string | comment_id | Comment ID |
| string | is_visible_on_front | Defines whether the comment is visible on the frontend |

**Faults:**

| Fault Code | Fault Description |
| --- | --- |
| 101 | Invalid filter given. Details in error message. |

**Examples**:

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');
$filter = array(
    'order_id' => array(
        'or' => array(
            array(
                'from' => '673',
                'to' => '674',
            ),
            array(
                'from' => '677',
                'to' => NULL,
            )
        )
    ),
    'increment_id' => array(
        'or' => array(
            array(
                'from' => '100000617',
                'to' => '100000619',
            ),
            array(
                'from' => '100000619',
                'to' => NULL,
            )
        )
    )
);
$creditmemoList = $proxy->call($sessionId, 'order_creditmemo.list', array($filter));
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->salesOrderCreditmemoList($sessionId, '200000001');
var_dump($result);
```

**Request Example SOAP V2 (Complex Filter)**

```php
$client = new SoapClient('http://magentohost/api/v2_soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$complexFilter = array(
    'complex_filter' => array(
        array(
            'key' => 'state',
            'value' => array('key' => 'in', 'value' => '2,3')
        )
    )
);
$result = $client->salesOrderCreditmemoList($session, $complexFilter);
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->salesOrderCreditmemoList((object)array('sessionId' => $sessionId->result));   
var_dump($result->result);
```

**Response Example SOAP V1**

```php
array(
    0 => array(
        'store_id' => '1',
        'adjustment_positive' => NULL,
        'base_shipping_tax_amount' => '0.0000',
        'store_to_order_rate' => '1.0000',
        'base_discount_amount' => '0.0000',
        'base_to_order_rate' => '1.0000',
        'grand_total' => '60.0000',
        'base_adjustment_negative' => NULL,
        'base_subtotal_incl_tax' => '55.0000',
        'shipping_amount' => '5.0000',
        'subtotal_incl_tax' => '55.0000',
        'adjustment_negative' => NULL,
        'base_shipping_amount' => '5.0000',
        'store_to_base_rate' => '1.0000',
        'base_to_global_rate' => '1.0000',
        'base_adjustment' => '0.0000',
        'base_subtotal' => '55.0000',
        'discount_amount' => '0.0000',
        'subtotal' => '55.0000',
        'adjustment' => '0.0000',
        'base_grand_total' => '60.0000',
        'base_adjustment_positive' => NULL,
        'base_tax_amount' => '0.0000',
        'shipping_tax_amount' => '0.0000',
        'tax_amount' => '0.0000',
        'order_id' => '674',
        'email_sent' => NULL,
        'creditmemo_status' => NULL,
        'state' => '2',
        'shipping_address_id' => '1348',
        'billing_address_id' => '1347',
        'invoice_id' => NULL,
        'cybersource_token' => NULL,
        'store_currency_code' => 'USD',
        'order_currency_code' => 'USD',
        'base_currency_code' => 'USD',
        'global_currency_code' => 'USD',
        'transaction_id' => NULL,
        'increment_id' => '100000617',
        'created_at' => '2011-05-26 10:49:45',
        'updated_at' => '2011-05-26 10:49:45',
        'hidden_tax_amount' => '0.0000',
        'base_hidden_tax_amount' => '0.0000',
        'shipping_hidden_tax_amount' => NULL,
        'base_shipping_hidden_tax_amnt' => NULL,
        'shipping_incl_tax' => '5.0000',
        'base_shipping_incl_tax' => '5.0000',
        'base_customer_balance_amount' => NULL,
        'customer_balance_amount' => NULL,
        'bs_customer_bal_total_refunded' => '0.0000',
        'customer_bal_total_refunded' => '0.0000',
        'base_gift_cards_amount' => NULL,
        'gift_cards_amount' => NULL,
        'gw_base_price' => NULL,
        'gw_price' => NULL,
        'gw_items_base_price' => NULL,
        'gw_items_price' => NULL,
        'gw_card_base_price' => NULL,
        'gw_card_price' => NULL,
        'gw_base_tax_amount' => NULL,
        'gw_tax_amount' => NULL,
        'gw_items_base_tax_amount' => NULL,
        'gw_items_tax_amount' => NULL,
        'gw_card_base_tax_amount' => NULL,
        'gw_card_tax_amount' => NULL,
        'base_reward_currency_amount' => NULL,
        'reward_currency_amount' => NULL,
        'reward_points_balance' => NULL,
        'reward_points_balance_refund' => NULL,
        'creditmemo_id' => '617',
    ),
    1 => array(
        'store_id' => '1',
        'adjustment_positive' => NULL,
        .......................................
        'creditmemo_id' => '620',
    )
);
```

## Sales Order Credit Memo Info

**Method:**

-   order_creditmemo.info (SOAP V1)
-   salesOrderCreditmemoInfo (SOAP V2)

Allows you to retrieve full information about the specified credit memo.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | creditmemoIncrementId | Credit memo increment ID |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| array | result | Array of salesOrderCreditmemoEntity |

The **salesOrderCreditmemoEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | updated_at | Date of updating |
| string | created_at | Date of creation |
| string | increment_id | Increment ID |
| string | transaction_id | Transaction ID |
| string | global_currency_code | Global currency code |
| string | base_currency_code | Base currency code |
| string | order_currency_code | Order currency code |
| string | store_currency_code | Store currency code |
| string | cybersource_token | Cybersource token |
| string | invoice_id | ID of the invoice for which the credit memo was created |
| string | billing_address_id | Billing address ID |
| string | shipping_address_id | Shipping address ID |
| string | state | State |
| string | creditmemo_status | Credit memo status |
| string | email_sent | Defines whether the email is sent |
| string | order_id | ID of the order for which the credit memo was created |
| string | tax_amount | Tax amount |
| string | shipping_tax_amount | Shipping tax amount |
| string | base_tax_amount | Base tax amount |
| string | base_adjustment_positive | Adjustment refund amount (using base currency) |
| string | base_grand_total | Base grand total |
| string | adjustment | Adjustment |
| string | subtotal | Subtotal |
| string | discount_amount | Discount amount |
| string | base_subtotal | Base subtotal |
| string | base_adjustment | Base adjustment |
| string | base_to_global_rate | Base to global rate |
| string | store_to_base_rate | Store to base rate |
| string | base_shipping_amount | Base shipping amount |
| string | adjustment_negative | Adjustment fee amount |
| string | subtotal_incl_tax | Subtotal including tax |
| string | shipping_amount | Shipping amount |
| string | base_subtotal_incl_tax | Base subtotal including tax |
| string | base_adjustment_negative | Adjustment fee amount (using base currency) |
| string | grand_total | Grand total |
| string | base_discount_amount | Base discount amount |
| string | base_to_order_rate | Base to order rate |
| string | store_to_order_rate | Store to order rate |
| string | base_shipping_tax_amount | Base shipping tax amount |
| string | adjustment_positive | Adjustment refund amount |
| string | store_id | Store ID |
| string | hidden_tax_amount | Hidden tax amount |
| string | base_hidden_tax_amount | Base hidden tax amount |
| string | shipping_hidden_tax_amount | Shipping hidden tax amount |
| string | base_shipping_hidden_tax_amnt | Base shipping hidden tax amount |
| string | shipping_incl_tax | Shipping including tax |
| string | base_shipping_incl_tax | Base shipping including tax |
| string | base_customer_balance_amount | Base customer balance amount |
| string | customer_balance_amount | Customer balance amount |
| string | bs_customer_bal_total_refunded | Refunded base customer balance amount |
| string | customer_bal_total_refunded | Customer balance total refunded |
| string | base_gift_cards_amount | Base gift cards amount |
| string | gift_cards_amount | Gift cards amount |
| string | gw_base_price | Gift wrapping price refunded amount (using base currency) |
| string | gw_price | Gift wrapping price refunded amount |
| string | gw_items_base_price | Gift wrapping items base price |
| string | gw_items_price | Gift wrapping items price |
| string | gw_card_base_price | Gift wrapping card base price |
| string | gw_card_price | Gift wrapping card price |
| string | gw_base_tax_amount | Gift wrapping tax amount refunded (using base currency) |
| string | gw_tax_amount | Gift wrapping tax amount refunded |
| string | gw_items_base_tax_amount | Gift wrapping items base tax amount |
| string | gw_items_tax_amount | Gift wrapping items tax amount |
| string | gw_card_base_tax_amount | Gift wrapping card base tax amount |
| string | gw_card_tax_amount | Gift wrapping card tax amount |
| string | base_reward_currency_amount | Base reward currency amount |
| string | reward_currency_amount | Reward currency amount |
| string | reward_points_balance | Reward points balance |
| string | reward_points_balance_refund | Reward points balance refund |
| string | creditmemo_id | Credit memo ID |
| array | items | Array of salesOrderCreditmemoItemEntity |
| array | comments | Array of salesOrderCreditmemoCommentEntity |

The **salesOrderCreditmemoItemEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | item_id | Credit memo item ID |
| string | parent_id | Parent ID |
| string | weee_tax_applied_row_amount | Applied fixed product tax row amount |
| string | base_price | Base price |
| string | base_weee_tax_row_disposition | Fixed product tax row disposition (in base currency) |
| string | tax_amount | Tax amount |
| string | base_weee_tax_applied_amount | Applied fixed product tax amount (in base currency) |
| string | weee_tax_row_disposition | Fixed product tax row disposition |
| string | base_row_total | Base row total |
| string | discount_amount | Discount amount |
| string | row_total | Row total |
| string | weee_tax_applied_amount | Applied fixed product tax amount |
| string | base_discount_amount | Base discount amount |
| string | base_weee_tax_disposition | Fixed product tax disposition (in base currency) |
| string | price_incl_tax | Price including tax |
| string | base_tax_amount | Base tax amount |
| string | weee_tax_disposition | Fixed product tax disposition |
| string | base_price_incl_tax | Base price including tax |
| string | qty | Quantity |
| string | base_cost | Base cost |
| string | base_weee_tax_applied_row_amount | Applied fixed product tax row amount (in base currency) |
| string | price | Price |
| string | base_row_total_incl_tax | Base row total including tax |
| string | row_total_incl_tax | Row total including tax |
| string | product_id | Product ID |
| string | order_item_id | Order item ID |
| string | additional_data | Additional data |
| string | description | Description |
| string | weee_tax_applied | Applied fixed product tax |
| string | sku | Item SKU |
| string | name | Name |
| string | hidden_tax_amount | Hidden tax amount |
| string | base_hidden_tax_amount | Base hidden tax amount |

The **salesOrderCreditmemoCommentEntity** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| string | parent_id | Parent ID |
| string | created_at | Date of creation |
| string | comment | Comment data |
| string | is_customer_notified | Defines whether the customer is notified |
| string | comment_id | Comment ID |
| string | is_visible_on_front | Defines whether the comment is visible on the frontend |

**Faults:**

| Fault Code | Fault Description |
| --- | --- |
| 100 | Requested credit memo does not exist. |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'order_creditmemo.info', '200000001');
var_dump($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->salesOrderCreditmemoInfo($sessionId, '200000001');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->salesOrderCreditmemoInfo((object)array('sessionId' => $sessionId->result, 'creditmemoIncrementId' => '200000001'));   
var_dump($result->result);
```

**Response Example SOAP V1**

```php
array(
    'store_id' => '1',
    'adjustment_positive' => NULL,
    'base_shipping_tax_amount' => '0.0000',
    'store_to_order_rate' => '1.0000',
    'base_discount_amount' => '0.0000',
    'base_to_order_rate' => '1.0000',
    'grand_total' => '90.0000',
    'base_adjustment_negative' => NULL,
    'base_subtotal_incl_tax' => '75.0000',
    'shipping_amount' => '15.0000',
    'subtotal_incl_tax' => '75.0000',
    'adjustment_negative' => NULL,
    'base_shipping_amount' => '15.0000',
    'store_to_base_rate' => '1.0000',
    'base_to_global_rate' => '1.0000',
    'base_adjustment' => '0.0000',
    'base_subtotal' => '75.0000',
    'discount_amount' => '0.0000',
    'subtotal' => '75.0000',
    'adjustment' => '0.0000',
    'base_grand_total' => '90.0000',
    'base_adjustment_positive' => NULL,
    'base_tax_amount' => '0.0000',
    'shipping_tax_amount' => '0.0000',
    'tax_amount' => '0.0000',
    'order_id' => '744',
    'email_sent' => NULL,
    'creditmemo_status' => NULL,
    'state' => '2',
    'shipping_address_id' => '1488',
    'billing_address_id' => '1487',
    'invoice_id' => NULL,
    'cybersource_token' => NULL,
    'store_currency_code' => 'USD',
    'order_currency_code' => 'USD',
    'base_currency_code' => 'USD',
    'global_currency_code' => 'USD',
    'transaction_id' => NULL,
    'increment_id' => '100000684',
    'created_at' => '2011-05-27 10:53:03',
    'updated_at' => '2011-05-27 10:53:03',
    'hidden_tax_amount' => '0.0000',
    'base_hidden_tax_amount' => '0.0000',
    'shipping_hidden_tax_amount' => NULL,
    'base_shipping_hidden_tax_amnt' => NULL,
    'shipping_incl_tax' => '15.0000',
    'base_shipping_incl_tax' => '15.0000',
    'base_customer_balance_amount' => NULL,
    'customer_balance_amount' => NULL,
    'bs_customer_bal_total_refunded' => '0.0000',
    'customer_bal_total_refunded' => '0.0000',
    'base_gift_cards_amount' => NULL,
    'gift_cards_amount' => NULL,
    'gw_base_price' => NULL,
    'gw_price' => NULL,
    'gw_items_base_price' => NULL,
    'gw_items_price' => NULL,
    'gw_card_base_price' => NULL,
    'gw_card_price' => NULL,
    'gw_base_tax_amount' => NULL,
    'gw_tax_amount' => NULL,
    'gw_items_base_tax_amount' => NULL,
    'gw_items_tax_amount' => NULL,
    'gw_card_base_tax_amount' => NULL,
    'gw_card_tax_amount' => NULL,
    'base_reward_currency_amount' => NULL,
    'reward_currency_amount' => NULL,
    'reward_points_balance' => NULL,
    'reward_points_balance_refund' => NULL,
    'base_customer_balance_total_refunded' => '0.0000',
    'customer_balance_total_refunded' => '0.0000',
    'gw_printed_card_base_price' => NULL,
    'gw_printed_card_price' => NULL,
    'gw_printed_card_base_tax_amount' => NULL,
    'gw_printed_card_tax_amount' => NULL,
    'reward_points_balance_to_refund' => NULL,
    'creditmemo_id' => '684',
    'order_increment_id' => '100000744',
    'items' => array(
        0 => array(
            'parent_id' => '684',
            'weee_tax_applied_row_amount' => '0.0000',
            'base_price' => '55.0000',
            'base_weee_tax_row_disposition' => '0.0000',
            'tax_amount' => '0.0000',
            'base_weee_tax_applied_amount' => '0.0000',
            'weee_tax_row_disposition' => '0.0000',
            'base_row_total' => '55.0000',
            'discount_amount' => NULL,
            'row_total' => '55.0000',
            'weee_tax_applied_amount' => '0.0000',
            'base_discount_amount' => NULL,
            'base_weee_tax_disposition' => '0.0000',
            'price_incl_tax' => '55.0000',
            'base_tax_amount' => '0.0000',
            'weee_tax_disposition' => '0.0000',
            'base_price_incl_tax' => '55.0000',
            'qty' => '1.0000',
            'base_cost' => NULL,
            'base_weee_tax_applied_row_amnt' => NULL,
            'price' => '55.0000',
            'base_row_total_incl_tax' => '55.0000',
            'row_total_incl_tax' => '55.0000',
            'product_id' => '20',
            'order_item_id' => '775',
            'additional_data' => NULL,
            'description' => NULL,
            'weee_tax_applied' => 'a:0:{}',
            'sku' => 'test_product_sku',
            'name' => 'Test Product',
            'hidden_tax_amount' => '0.0000',
            'base_hidden_tax_amount' => '0.0000',
            'item_id' => '708'
        ),
        1 => array(
            'parent_id' => '684',
            'weee_tax_applied_row_amount' => '0.0000',
            'base_price' => '10.0000',
            'base_weee_tax_row_disposition' => '0.0000',
            'tax_amount' => '0.0000',
            'base_weee_tax_applied_amount' => '0.0000',
            'weee_tax_row_disposition' => '0.0000',
            'base_row_total' => '20.0000',
            'discount_amount' => NULL,
            'row_total' => '20.0000',
            'weee_tax_applied_amount' => '0.0000',
            'base_discount_amount' => NULL,
            'base_weee_tax_disposition' => '0.0000',
            'price_incl_tax' => '10.0000',
            'base_tax_amount' => '0.0000',
            'weee_tax_disposition' => '0.0000',
            'base_price_incl_tax' => '10.0000',
            'qty' => '2.0000',
            'base_cost' => NULL,
            'base_weee_tax_applied_row_amnt' => NULL,
            'price' => '10.0000',
            'base_row_total_incl_tax' => '20.0000',
            'row_total_incl_tax' => '20.0000',
            'product_id' => '21',
            'order_item_id' => '776',
            'additional_data' => NULL,
            'description' => NULL,
            'weee_tax_applied' => 'a:0:{}',
            'sku' => 'test_product_sku_2',
            'name' => 'Test 2',
            'hidden_tax_amount' => '0.0000',
            'base_hidden_tax_amount' => '0.0000',
            'item_id' => '709'
        )
    ),
    'comments' => array(
        0 => array(
            'parent_id' => '684',
            'is_customer_notified' => '0',
            'is_visible_on_front' => '0',
            'comment' => 'Test CreditMemo successfully created',
            'created_at' => '2011-05-27 10:53:03',
            'comment_id' => '118'
        ),
        1 => array(
            'parent_id' => '684',
            'is_customer_notified' => '0',
            'is_visible_on_front' => '0',
            'comment' => 'Test CreditMemo comment successfully added',
            'created_at' => '2011-05-27 10:53:03',
            'comment_id' => '119'
        )
    )
);
```

## Sales Order Credit Memo Create

**Method:**

-   order_creditmemo.create (SOAP V1)
-   salesOrderCreditmemoCreate (SOAP V2)

Allows you to create a new credit memo for the invoiced order. Comments can be added and an email notification can be sent to the user email.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | orderIncrementId | Order increment ID |
| array | creditmemoData | Array of salesOrderCreditmemoData (optional) |
| string | comment | Comment text (optional) |
| int | notifyCustomer | Notify customer by email flag (optional) |
| int | includeComment | Include comment text into an email notification (optional) |
| string | refundToStoreCreditAmount | Payment amount to be refunded to the customer store credit (optional) |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| string | result | Created credit memo increment ID |

The **salesOrderCreditmemoData** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| array | qtys | Array of orderItemIdQty |
| double | shipping_amount | Refund shipping amount (optional) |
| double | adjustment_positive | Adjustment refund amount (optional) |
| double | adjustment_negative | Adjustment fee amount (optional) |

The **orderItemIdQty** content is as follows:

| Type | Name | Description |
| --- | --- | --- |
| int | order_item_id | Order item ID to be refunded |
| double | qty | Items quantity to be refunded |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 102 | Invalid data given. Details in error message. |
| 103 | Requested order does not exist. |
| 105 | Money can not be refunded to the store credit account as order was created by guest. |
| 106 | Credit memo for requested order can not be created. |

**Examples**:

**Request Example SOAP V1**

```php
$client = new SoapClient('http://magentohost/api/soap/?wsdl');
$session = $client->login('apiUser', 'apiKey');

$result = $client->call($session, 'order_creditmemo.create', '200000010');
var_dump($result);
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->salesOrderCreditmemoCreate($sessionId, '200000010');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->salesOrderCreditmemoCreate((object)array('sessionId' => $sessionId->result, 'creditmemoIncrementId' => '200000010', 
'creditmemoData' => array(
    'qtys' => array(
    'order_item_id' => 3,
    'qty' => '1'),
    'shipping_amount' => null,
    'adjustment_positive' => '0',
    'adjustment_negative' => null),
    'comment' => 'comment for credit memo',
    'notifyCustomer' => null,
    'includeComment' => 1,
    'refundToStoreCreditAmount' => '1'
));   
var_dump($result->result);
```

## Sales Order Credit Memo AddComment

**Method:**

-   order_creditmemo.addComment (SOAP V1)
-   salesOrderCreditmemoAddComment (SOAP V2)

Allows you to add a new comment to an existing credit memo. Email notification can be sent to the user email.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | creditmemoIncrementId | Credit memo increment ID |
| string | comment | Comment text (optional) |
| int | notifyCustomer | Notify customer by email flag (optional) |
| int | includeComment | Include comment text into the email notification (optional) |

**Return:**

| Type | Description |
| --- | --- |
| booleanint | True (1) if the comment is added to the credit memo |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 100 | Requested credit memo does not exist. |
| 102 | Invalid data given. Details in error message. |

**Examples**:

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$creditmemoIncrementId = '200000001'; //increment id of existing credit memo
$commentText = "Credit memo comment successfully added";

$isCommentAdded = $proxy->call($sessionId, 'order_creditmemo.addComment', array($creditmemoIncrementId, $commentText, true));
```

**Request Example SOAP V2**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('apiUser', 'apiKey'); // TODO : change login and pwd if necessary

$result = $proxy->salesOrderCreditmemoAddComment($sessionId, '200000001');
var_dump($result);
```

**Request Example SOAP V2 (WS-I Compliance Mode)**

```php
$proxy = new SoapClient('http://magentohost/api/v2_soap/?wsdl'); 
$sessionId = $proxy->login((object)array('username' => 'apiUser', 'apiKey' => 'apiKey')); 
 
$result = $proxy->salesOrderCreditmemoAddComment((object)array('sessionId' => $sessionId->result, 'creditmemoIncrementId' => '200000001', 'comment' => 'credit memo comment', 'notifyCustomer' => 1, 'includeComment' => 1));   
var_dump($result->result);
```

## Sales Order Credit Memo Cancel

**Method:**

-   order_creditmemo.cancel (SOAP V1)
-   salesOrderCreditmemoCancel (SOAP V2)

Allows you to cancel an existing credit memo.

**Arguments:**

| Type | Name | Description |
| --- | --- | --- |
| string | sessionId | Session ID |
| string | creditmemoIncrementId | Credit memo increment ID |

**Return:**

| Type | Name | Description |
| --- | --- | --- |
| string | result | Result of canceling the credit memo |

**Faults:**

| Fault Code | Fault Message |
| --- | --- |
| 100 | Requested credit memo does not exist. |
| 104 | Credit memo status not changed. |

**Examples**:

**Request Example SOAP V1**

```php
$proxy = new SoapClient('http://magentohost/api/soap/?wsdl');
$sessionId = $proxy->login('apiUser', 'apiKey');

$creditmemoIncrementId = '100000637'; //increment id of existing credit memo

$isCreditMemoCanceled = $proxy->call($sessionId, 'order_creditmemo.cancel', array($creditmemoIncrementId));
```