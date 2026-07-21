---
description: Migrate a Magento 1 or OpenMage store to Maho step by step, covering project structure, Zend Framework removal, breaking changes and the health check.
---

# Migrate Magento1/OpenMage to Maho

## Step by Step

Since the base project structure of Maho is significantly different from previous M1 platforms,
our suggested migration plan is to recreate your project from scratch and copy over only the needed parts.
While this may seem more complex initially, it will pay off in the long run.

1. Create the base structure for the new project with Maho's starter pack:  
   `composer create-project mahocommerce/maho-starter yourproject`  
   (replace `yourproject` with your desired folder name)

2. Add additional modules/extensions that you previously managed via composer:  
   `composer require extensionname`

3. Copy `app/code/community` and `app/code/local`

4. Copy the corresponding module declaration XML files from `app/etc/modules` for your custom modules.
   These XML files tell Maho about your modules and are required for them to be recognized by the system.

5. Remove the `app/code/local/Mage` folder, which contains direct core override files. Although override functionality is still supported, these old files will likely be incompatible with Maho's core files.

6. Copy custom-only `js`/`skin` files/folders to `public/js` and `public/skin`
   (avoid copying core Magento/OpenMage folders/files)

7. Copy custom theme folders from `app/design/frontend`
   (copy only your custom theme folders, not core themes)

8. Review and copy files from your old document root (e.g., favicons, robots.txt, Google domain verifications)
   Also review any custom modifications to .htaccess if using Apache

9. Convert any custom scripts in the `shell` folder to maho-cli-commands

## PHP Compatibility
Maho supports the three most recent stable PHP releases, currently 8.3 / 8.4 / 8.5 (see [system requirements](getting-started.md#system-requirements)).
Custom code and third-party modules will likely need adaptation to the new PHP version.

!!! note
    Keeping server software updated is crucial for security and, in Europe, is essentially mandatory due to the 
    [privacy-by-design principle](https://commission.europa.eu/law/law-topic/data-protection/reform/rules-business-and-organisations/obligations/what-does-data-protection-design-and-default-mean_en){target=_blank}
    of [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679){target=_blank}.

## Breaking Changes
Maho is not 100% backward compatible with the M1 platform.
Our goal has always been clear: modernizing the M1 platform, which necessitates changes.

Each Maho release will include incompatible changes that must be considered during migration/updating.
While we minimize breaking changes where possible, please carefully review
[Maho's release notes](https://github.com/MahoCommerce/maho/releases){target=_blank}
for each version to understand what requires additional testing and potential adaptation in your codebase.

### Zend Framework Removal

One of the most significant changes in Maho is the **complete removal of all Zend Framework 1 components**. If your custom code uses any Zend classes, you'll need to update them:

**Database layer changes:**
```php
// OLD - No longer works
$select = new Zend_Db_Select($adapter);
$adapter->quoteInto('field = ?', $value);

// NEW - Use Maho\Db classes
$select = $adapter->select();
$adapter->quoteInto('field = ?', $value); // Still works via Maho adapter
```

**HTTP client changes:**
```php
// OLD - No longer works
$client = new Varien_Http_Client($url);
$client = new Zend_Http_Client($url);

// NEW - Use Symfony HttpClient
$client = \Symfony\Component\HttpClient\HttpClient::create(['timeout' => 30]);
$response = $client->request('GET', $url);
```

**Validation changes:**
```php
// OLD - No longer works
Zend_Validate::is($value, 'EmailAddress');

// NEW - Use Core Helper
Mage::helper('core')->isValidEmail($value);
```

**Logging changes:**
```php
// OLD - No longer works
Mage::log($message, Zend_Log::ERR);

// NEW - Use Mage constants
Mage::log($message, Mage::LOG_ERROR);
```

**Date handling changes:**
```php
// OLD - No longer works
$date = new Zend_Date();
Varien_Date::now();

// NEW - Use native PHP DateTime
$date = new DateTime();
Mage_Core_Model_Locale::now();
```

**JSON handling changes:**
```php
// OLD - No longer works
Zend_Json::encode($data);
Zend_Json::decode($json);

// NEW - Use Core Helper
Mage::helper('core')->jsonEncode($data);
Mage::helper('core')->jsonDecode($json);
```

### POST-only routes for state-changing actions <span class="version-badge">v26.5+</span>

With the [new routing layer](../developer/routing.md), actions that modify state (add to cart, update cart, delete, apply coupon, etc.) now accept **POST only**. A `GET` request to one of these routes returns `405 Method Not Allowed`.

The most common case is adding a product to the cart. Magento/OpenMage themes often navigated to `/checkout/cart/add/` with a plain link or `setLocation()` (a GET request). That no longer works:

```javascript
// OLD - GET request, now returns 405 Method Not Allowed
setLocation('/checkout/cart/add/?form_key=xxx&product=549&uenc=yyy');
```

Submit these requests as POST instead, either with a real `<form method="post">` or with Maho's `customFormSubmit()` helper:

```javascript
// NEW - submits via POST with the form key
customFormSubmit(url, formKey, 'post');
```

**Why this is more secure.** The HTTP spec treats `GET` as a *safe* method: fetching a URL must not change server state. Anything that follows links automatically (browser prefetch, link preview, search-engine crawlers, antivirus and email link scanners, a chat app unfurling a pasted URL) issues `GET` requests. When add-to-cart accepted `GET`, any of those could silently mutate a visitor's cart just by encountering the URL, and an attacker could trigger it cross-site with a plain `<img src="...">` tag. Requiring `POST` (combined with the form-key check) means a state change only happens on a deliberate form submission from your own pages, never as a side effect of a link being fetched. The restriction is applied consistently to every state-changing route, not just add to cart. See [HTTP method restrictions](../developer/routing.md#http-method-restrictions) for how to declare these on your own controllers.

## Health Check
[Maho's CLI tool](../developer/cli-tool.md) includes a `health-check` command that can be run periodically to monitor
your project's health. It's particularly useful during migration/update phases to ensure nothing important is missed.
Run it with:

```bash
$ ./maho health-check
```

The same health check is also available in the admin backend under **System > Tools > Health Check**.
