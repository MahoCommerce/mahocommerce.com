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
Maho (as of 24.11) requires PHP 8.2+, as of 25.7 requires PHP 8.3+.
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

## Health Check
[Maho's CLI tool](cli-tool.md) includes a `health-check` command that can be run periodically to monitor
your project's health. It's particularly useful during migration/update phases to ensure nothing important is missed.
Run it with:

```bash
$ ./maho health-check
```

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

For complete migration details, see the [CLAUDE.md file](https://github.com/MahoCommerce/maho/blob/main/CLAUDE.md){target=_blank} in the Maho repository which documents all modern alternatives.
