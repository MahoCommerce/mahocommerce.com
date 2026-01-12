# Gift Cards <span class="version-badge">v26.1+</span>

This guide covers the technical aspects of Maho's Gift Card module for developers who need to extend, customize, or integrate with the gift card functionality.

For user and admin documentation, see the [Gift Cards User Guide](../gift-cards.md).

## Database Schema

### Main Tables

#### `giftcard`

Stores gift card records.

| Column | Type | Description |
|--------|------|-------------|
| `giftcard_id` | INT | Primary key, auto-increment |
| `code` | VARCHAR(64) | Unique gift card code |
| `status` | VARCHAR(32) | Status: active, used, expired, disabled |
| `website_id` | SMALLINT | Website assignment (FK) |
| `balance` | DECIMAL(12,4) | Current available balance |
| `initial_balance` | DECIMAL(12,4) | Original amount when created |
| `recipient_name` | VARCHAR(255) | Gift recipient name |
| `recipient_email` | VARCHAR(255) | Email to send gift to |
| `sender_name` | VARCHAR(255) | Gift giver name |
| `sender_email` | VARCHAR(255) | Gift giver email |
| `message` | TEXT | Custom message |
| `purchase_order_id` | INT | Order where created (FK) |
| `purchase_order_item_id` | INT | Line item reference |
| `expires_at` | DATETIME | Expiration timestamp (UTC) |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last modified |
| `email_scheduled_at` | DATETIME | When to send email |
| `email_sent_at` | DATETIME | When actually sent |

#### `giftcard_history`

Audit trail for all gift card transactions.

| Column | Type | Description |
|--------|------|-------------|
| `history_id` | INT | Primary key, auto-increment |
| `giftcard_id` | INT | Gift card reference (FK) |
| `action` | VARCHAR(32) | Action type |
| `base_amount` | DECIMAL(12,4) | Transaction amount (base currency) |
| `balance_before` | DECIMAL(12,4) | Balance state before |
| `balance_after` | DECIMAL(12,4) | Balance state after |
| `order_id` | INT | Related order (FK, nullable) |
| `admin_user_id` | INT | Admin who made change (nullable) |
| `comment` | TEXT | Details/reason |
| `created_at` | DATETIME | Timestamp (UTC) |

### Extended Sales Tables

The module adds columns to existing sales tables:

| Table | Columns Added |
|-------|---------------|
| `sales_quote` | `giftcard_codes` (TEXT), `giftcard_amount`, `base_giftcard_amount` |
| `sales_order` | `giftcard_codes` (TEXT), `giftcard_amount`, `base_giftcard_amount` |
| `sales_invoice` | `giftcard_amount`, `base_giftcard_amount` |
| `sales_creditmemo` | `giftcard_amount`, `base_giftcard_amount` |

The `giftcard_codes` column stores a JSON array of applied gift cards with their amounts.

## Working with Gift Cards

### Loading Gift Cards

```php
// By ID
$giftcard = Mage::getModel('giftcard/giftcard')->load($id);

// By code
$giftcard = Mage::getModel('giftcard/giftcard')->loadByCode('GC-XXXX-XXXX-XXXX');
```

### Checking Validity

```php
// Basic validity check (active, has balance, not expired)
if ($giftcard->isValid()) {
    // Gift card can be used
}

// Website-specific check
if ($giftcard->isValidForWebsite($websiteId)) {
    // Gift card is valid and belongs to this website
}
```

### Getting Balance

```php
// In base currency (as stored)
$balance = $giftcard->getBalance();

// In specific currency (converted)
$balance = $giftcard->getBalance('EUR');

// Get the gift card's currency code
$currencyCode = $giftcard->getCurrencyCode();
```

### Balance Operations

#### Deducting Balance (Use)

```php
$giftcard->use(
    $baseAmount,           // Amount in base currency
    $orderId,              // Related order ID
    'Used for order #123'  // Comment for history
);
// Automatically updates status to "used" if balance reaches zero
```

#### Refunding Balance

```php
$giftcard->refund(
    $baseAmount,
    $orderId,
    'Refund for credit memo #456'
);
// Automatically reverts status from "used" to "active" if applicable
```

#### Admin Balance Adjustment

```php
$giftcard->adjustBalance(
    $newBalance,
    'Customer service adjustment'
);
// Creates history entry with admin user ID
```

### Creating Gift Cards Programmatically

```php
$helper = Mage::helper('giftcard');

$giftcard = Mage::getModel('giftcard/giftcard');
$giftcard->setData([
    'code' => $helper->generateCode(),
    'status' => 'active',
    'website_id' => $websiteId,
    'balance' => 100.00,
    'initial_balance' => 100.00,
    'recipient_name' => 'John Doe',
    'recipient_email' => 'john@example.com',
    'sender_name' => 'Jane Doe',
    'message' => 'Happy Birthday!',
    'expires_at' => $helper->calculateExpirationDate(),
]);
$giftcard->save();

// Record creation in history
Mage::getModel('giftcard/history')->setData([
    'giftcard_id' => $giftcard->getId(),
    'action' => 'created',
    'base_amount' => $giftcard->getBalance(),
    'balance_before' => 0,
    'balance_after' => $giftcard->getBalance(),
    'comment' => 'Programmatically created',
])->save();
```

### Working with Collections

```php
// Get all active gift cards for a website
$collection = Mage::getResourceModel('giftcard/giftcard_collection')
    ->addFieldToFilter('status', 'active')
    ->addFieldToFilter('website_id', $websiteId);

// Get gift cards expiring soon
$collection = Mage::getResourceModel('giftcard/giftcard_collection')
    ->addFieldToFilter('status', 'active')
    ->addFieldToFilter('expires_at', ['lteq' => $futureDate]);

// Get history for a gift card
$history = Mage::getResourceModel('giftcard/history_collection')
    ->addFieldToFilter('giftcard_id', $giftcardId)
    ->setOrder('created_at', 'DESC');
```

## Helper Methods

The main helper (`Mage::helper('giftcard')`) provides these utilities:

### Code Management

```php
$helper = Mage::helper('giftcard');

// Generate a unique code
$code = $helper->generateCode();
// Returns: "GC-XXXX-XXXX-XXXX-XXXX"

// Format a code for display
$formatted = $helper->formatCode($code);
```

### Configuration

```php
// Check if module is enabled
$isEnabled = $helper->isEnabled();

// Get system default expiration (days)
$lifetime = $helper->getLifetime();

// Get product-specific lifetime (falls back to system default)
$productLifetime = $helper->getProductLifetime($product);

// Check if messaging is allowed for a product
$allowMessage = $helper->getProductAllowMessage($product);

// Calculate expiration date from now
$expiresAt = $helper->calculateExpirationDate();

// Calculate expiration for a specific product
$expiresAt = $helper->calculateProductExpirationDate($product);
```

### Display

```php
// Format amount with currency
$formatted = $helper->formatAmount(50.00, 'USD');
// Returns: "$50.00"

// Check QR/barcode settings
$qrEnabled = $helper->isQrCodeEnabled();
$barcodeEnabled = $helper->isBarcodeEnabled();
$barcodeInstalled = $helper->isBarcodePackageInstalled();

// Generate visual codes (returns data:image/svg+xml;base64,... URLs)
$qrDataUrl = $helper->getQrCodeDataUrl($code, 200);
$barcodeDataUrl = $helper->getBarcodeDataUrl($code);
```

### Email

```php
// Send email immediately
$helper->sendGiftcardEmail($giftcard);

// Schedule email for later
$helper->scheduleGiftcardEmail($giftcard, $scheduledDateTime);
```

### Additional Options

Build display options for cart/order from purchase request:

```php
$buyRequest = $quoteItem->getBuyRequest();
$options = $helper->buildAdditionalOptions($buyRequest);
// Returns array of label/value pairs for display
```

## Observer Events

The module observes these events:

| Event | Method | Purpose |
|-------|--------|---------|
| `sales_order_place_after` | `deductGiftcardBalance` | Deduct balance when order is placed |
| `sales_order_invoice_pay` | `createGiftcardsOnInvoicePaid` | Create gift cards when invoice is paid |
| `sales_order_creditmemo_refund` | `refundGiftcardBalance` | Refund balance to gift card |
| `order_cancel_after` | `refundGiftcardOnOrderCancel` | Refund balance when order is canceled |
| `sales_quote_add_item` | `setGiftcardPrice` | Set custom price for gift card items |
| `sales_convert_quote_address_to_order` | `applyGiftcardToOrder` | Copy gift card data to order |
| `catalog_product_save_before` | `catalogProductSaveBefore` | Preserve gift card attributes |
| `controller_action_predispatch_checkout_onepage_savePayment` | `autoSelectPaymentMethod` | Auto-select gift card payment |
| `core_block_abstract_to_html_after` | `addGiftcardTotalToAdminOrder` | Add total to admin order view |
| `adminhtml_sales_order_create_process_data_before` | `processAdminOrderGiftcard` | Handle admin order gift cards |

### Observer Details

#### `deductGiftcardBalance`

Executes after order placement:

- Uses row locking to prevent race conditions
- Distributes amount proportionally across multiple gift cards
- Records usage history with order reference
- Updates order payment additional_info

#### `createGiftcardsOnInvoicePaid`

Executes when invoice is marked as paid:

- Creates one gift card per invoiced quantity
- Sets initial balance from purchase amount
- Sends email to recipient if email provided
- Records creation history

#### `refundGiftcardBalance`

Executes on credit memo refund:

- Uses row locking to prevent race conditions
- Calculates proportional refund for partial gift card orders
- For full coverage orders, refunds entire credit memo amount
- Updates gift card status back to active if was "used"
- **Extends expiration** if the card is expired or will expire within the configured extension period:
    - Compares card's `expires_at` to `now + refund_expiration_extension` days
    - If card expires sooner, extends to the full extension period from now
    - Configurable via `giftcard/general/refund_expiration_extension` (default: 30 days)
    - Set to 0 to disable extension (card stays expired but balance is restored)
- Records refund history with expiration extension details if applicable

#### `refundGiftcardOnOrderCancel`

Executes when an order is canceled:

- Uses row locking to prevent race conditions
- Restores the full gift card balance for all applied gift cards
- Updates gift card status back to active if was "used"
- **Extends expiration** using the same logic as credit memo refunds:
    - Compares card's `expires_at` to `now + refund_expiration_extension` days
    - If card expires sooner, extends to the full extension period from now
    - Configurable via `giftcard/general/refund_expiration_extension` (default: 30 days)
    - Set to 0 to disable extension (card stays expired but balance is restored)
- Records cancellation history with expiration extension details if applicable

!!! note "Automatic Refund"
    Unlike credit memos, gift card refunds on order cancellation are completely automatic. The balance is restored immediately when the order is canceled without requiring any manual intervention.

## Product Type

### Type Configuration

- **Type Code**: `giftcard`
- **Model**: `Maho_Giftcard_Model_Product_Type_Giftcard`
- **Price Model**: `Maho_Giftcard_Model_Product_Price`
- **Virtual**: Yes (delivered electronically, no shipping)
- **Requires Configuration**: Yes (amount selection required)

### Product Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `giftcard_type` | Select | fixed, custom, or combined |
| `giftcard_amounts` | Text | Comma-separated fixed amounts |
| `giftcard_min_amount` | Decimal | Minimum for custom entry |
| `giftcard_max_amount` | Decimal | Maximum for custom entry |
| `giftcard_allow_message` | Boolean | Override system message setting |
| `giftcard_lifetime` | Integer | Override system expiration (days) |

### Working with Gift Card Products

```php
// Check if product is a gift card
if ($product->getTypeId() === 'giftcard') {
    $typeInstance = $product->getTypeInstance(true);

    // Check amount type
    $type = $product->getGiftcardType();
    // 'fixed', 'custom', or 'combined'
}
```

### Quote Item Options

When a gift card is added to cart, these options are stored:

| Option | Description |
|--------|-------------|
| `giftcard_amount` | Selected/entered amount |
| `giftcard_recipient_name` | Recipient name |
| `giftcard_recipient_email` | Recipient email |
| `giftcard_sender_name` | Sender name |
| `giftcard_sender_email` | Sender email |
| `giftcard_message` | Custom message |
| `giftcard_delivery_date` | Scheduled delivery date |

## Quote Total Collector

The `giftcard` total collector handles gift card application during checkout.

### Configuration

- **Code**: `giftcard`
- **After**: `subtotal`, `shipping`, `discount`, `tax`
- **Before**: `grand_total`

### Behavior

1. Validates applied gift card codes for current website
2. Limits amount to remaining order total
3. Stores valid codes as JSON with applied amounts
4. Only applies to appropriate address (billing for virtual, shipping for physical)

### Exclusions

- Gift card products themselves (prevents circular purchases)
- Shipping costs are included (eligible for gift card payment)

## Payment Integration

### Internal Payment Mechanism

Gift cards work as a **pre-payment discount**, not as a user-selectable payment method. The module includes a payment class (`Maho_Giftcard_Model_Payment`) for internal order processing, but customers never see or select a "Gift Card" payment option.

**Configuration:**

- **Code**: `giftcard`
- **Group**: `offline`
- **Can use checkout**: Yes
- **Can use internal**: Yes
- **Can capture**: Yes
- **Can refund**: Yes

### Payment Flow

**Partial Coverage:**
- Gift card amount is deducted from order total as a discount
- Customer selects any available payment method for the remaining balance
- Gift card amount is recorded in `giftcard_amount` fields

**Full Coverage (≤ $0.01 remaining):**
- Gift card amount covers the entire order
- The "Free" payment method is automatically activated
- Order completes without requiring another payment method
- Internally uses the gift card payment class for processing

### Payment Helper

`Mage::helper('giftcard/payment')` provides:

```php
// Get payment methods filtered for gift card logic
$methods = $helper->getStoreMethods($store, $quote);
```

!!! info "User Experience"
    From a customer's perspective, gift cards are applied as discounts in the cart/checkout totals. They never see a "Gift Card" payment option to select - it's handled automatically based on the applied balance.

## Cron Jobs

Two scheduled tasks are defined in `config.xml`:

### Process Scheduled Emails

- **Schedule**: Every 5 minutes (`*/5 * * * *`)
- **Handler**: `Maho_Giftcard_Model_Cron::processScheduledEmails()`
- **Behavior**:
  - Finds gift cards with `email_scheduled_at` <= now and `email_sent_at` IS NULL
  - Processes up to 50 per run
  - Sends email and updates `email_sent_at`

### Mark Expired Gift Cards

- **Schedule**: Daily at 1 AM (`0 1 * * *`)
- **Handler**: `Maho_Giftcard_Model_Cron::markExpiredGiftcards()`
- **Behavior**:
  - Finds active gift cards with `expires_at` < now
  - Sets status to "expired"
  - Creates history entry for each

## Layout Handles

| Handle | Purpose |
|--------|---------|
| `giftcard_cart_index` | Gift card section in cart |
| `checkout_onepage_index` | Gift card payment in checkout |
| `giftcard_pdf` | PDF generation layout |
| `adminhtml_giftcard_index` | Admin grid |
| `adminhtml_giftcard_edit` | Admin edit form |

## ACL Resources

```
admin/
├── sales/
│   └── giftcard/
│       ├── manage    # Manage gift cards
│       └── history   # View history
└── system/
    └── config/
        └── giftcard  # Configure settings
```

## Customization

### Custom PDF Templates

Override the PDF layout by adding to your theme's layout XML:

```xml
<layout>
    <giftcard_pdf>
        <reference name="giftcard.pdf">
            <action method="setTemplate">
                <template>custom/giftcard/pdf.phtml</template>
            </action>
        </reference>
    </giftcard_pdf>
</layout>
```

### Custom Email Templates

Create a custom template in **System > Transactional Emails**:

1. Create a new template based on "Gift Card Notification"
2. Customize the content
3. Update configuration to use your template

**Available variables:**

| Variable | Description |
|----------|-------------|
| `{{var giftcard}}` | Gift card object |
| `{{var code}}` | Gift card code |
| `{{var balance}}` | Formatted balance |
| `{{var recipient_name}}` | Recipient name |
| `{{var sender_name}}` | Sender name |
| `{{var message}}` | Gift message |
| `{{var qr_code_url}}` | QR code data URL |
| `{{var barcode_url}}` | Barcode data URL |
| `{{var store_name}}` | Store name |
| `{{var store_url}}` | Store URL |
| `{{var expiry_date}}` | Formatted expiration |

### Extending the Gift Card Model

```php
class MyModule_Model_Giftcard extends Maho_Giftcard_Model_Giftcard
{
    public function myCustomMethod()
    {
        // Custom logic
    }
}
```

Configure in your module's `config.xml`:

```xml
<global>
    <models>
        <giftcard>
            <rewrite>
                <giftcard>MyModule_Model_Giftcard</giftcard>
            </rewrite>
        </giftcard>
    </models>
</global>
```

### Adding Custom History Actions

```php
// Record a custom action
Mage::getModel('giftcard/history')->setData([
    'giftcard_id' => $giftcard->getId(),
    'action' => 'custom_action',
    'base_amount' => $amount,
    'balance_before' => $giftcard->getBalance(),
    'balance_after' => $newBalance,
    'comment' => 'Custom action description',
])->save();
```

## Security Considerations

### Code Generation

- Codes exclude letters I and O to avoid confusion with numbers
- Uniqueness is verified before saving
- Configurable length and prefix

### Rate Limiting

Frontend balance checks are rate-limited:

- 10 attempts per 60-second window
- Session-based bucket tracking
- Prevents brute-force code discovery

### Transaction Safety

Balance deductions use row locking:

```php
// In Observer::deductGiftcardBalance
$select->forUpdate(); // Prevents race conditions
```

### Code Display

- Full codes are masked in admin grids (first 5 + last 4 characters)
- Never exposed in API responses for non-admins
- CSRF protection on all POST actions
