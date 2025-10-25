# Database Layer in Maho <span class="version-badge">v25.11+</span>

Maho uses [Doctrine DBAL 4.3](https://www.doctrine-project.org/projects/dbal.html){target=_blank} for all database operations, providing a modern, actively maintained foundation while maintaining 100% backward compatibility with existing code.

## Overview

The database layer in Maho provides:

- **100% backward compatibility** with existing Zend_Db code
- **Modern foundation** built on Doctrine DBAL 4.3
- **Type-safe queries** with proper parameter binding
- **Advanced query methods** for complex operations
- **Nested transaction support** with automatic level tracking
- **DDL cache** for performance-critical schema introspection
- **Debug and profiling** tools for development

## Why Doctrine DBAL?

The migration from Zend_Db to Doctrine DBAL isn't just about removing old code - it's about building on a foundation that's:

- **Actively maintained** - Regular updates and security patches
- **Well-documented** - Comprehensive official documentation
- **Future-proof** - Will continue to evolve with PHP ecosystem
- **Type-safe** - Better IDE support and static analysis
- **Standards-compliant** - Follows PSR standards

No more security vulnerabilities from abandoned 2000s-era libraries.

## Backward Compatibility

All existing code continues to work without any changes:

```php
// ✅ Old code still works - no changes needed
$adapter = Mage::getSingleton('core/resource')->getConnection('core_read');
$select = $adapter->select()
    ->from('catalog_product')
    ->where('status = ?', 1);

// ✅ Varien_Db_Expr still works
$expr = new Varien_Db_Expr('COUNT(*)');

// ✅ New namespace also available
$expr = new Maho\Db\Expr('COUNT(*)');
```

The `Varien_Db_*` classes are maintained as autoloader aliases (in `app/bootstrap.php`) for complete backward compatibility, while the new implementation in `lib/Maho/Db/` wraps Doctrine DBAL.

## Query Building

### Basic SELECT Queries

```php
// Get database adapter
$adapter = Mage::getSingleton('core/resource')->getConnection('core_read');

// Simple select
$select = $adapter->select()
    ->from('catalog_product', ['entity_id', 'sku', 'name'])
    ->where('status = ?', 1)
    ->where('visibility IN (?)', [2, 3, 4])
    ->order('created_at DESC')
    ->limit(10);

// Execute and fetch results
$products = $adapter->fetchAll($select);
```

### Table Aliases

```php
$select = $adapter->select()
    ->from(['p' => 'catalog_product'], ['entity_id', 'sku'])
    ->joinLeft(
        ['e' => 'cataloginventory_stock_item'],
        'p.entity_id = e.product_id',
        ['qty', 'is_in_stock']
    )
    ->where('p.status = ?', 1);
```

### Column Expressions

Use `Maho\Db\Expr` (or `Varien_Db_Expr`) to prevent quoting of SQL expressions:

```php
use Maho\Db\Expr;

$select = $adapter->select()
    ->from('sales_order', [
        'order_count' => new Expr('COUNT(*)'),
        'total_revenue' => new Expr('SUM(grand_total)'),
        'avg_order' => new Expr('AVG(grand_total)'),
        'order_date' => new Expr('DATE(created_at)')
    ])
    ->group('DATE(created_at)')
    ->having('COUNT(*) > ?', 5);
```

### JOIN Operations

```php
// INNER JOIN
$select = $adapter->select()
    ->from(['o' => 'sales_order'], ['increment_id', 'grand_total'])
    ->join(
        ['c' => 'customer_entity'],
        'o.customer_id = c.entity_id',
        ['email', 'firstname', 'lastname']
    )
    ->where('o.status = ?', 'complete');

// LEFT JOIN
$select = $adapter->select()
    ->from(['p' => 'catalog_product'], ['sku', 'name'])
    ->joinLeft(
        ['s' => 'cataloginventory_stock_item'],
        'p.entity_id = s.product_id',
        ['qty', 'is_in_stock']
    );

// Multiple joins
$select = $adapter->select()
    ->from(['o' => 'sales_order'], ['entity_id', 'increment_id'])
    ->join(
        ['a' => 'sales_order_address'],
        'o.entity_id = a.parent_id AND a.address_type = "billing"',
        ['city', 'region', 'postcode']
    )
    ->joinLeft(
        ['p' => 'sales_order_payment'],
        'o.entity_id = p.parent_id',
        ['method']
    );
```

### UNION Queries

```php
// Create first select
$select1 = $adapter->select()
    ->from('catalog_product', ['entity_id', 'sku'])
    ->where('status = ?', 1);

// Create second select
$select2 = $adapter->select()
    ->from('catalog_product_archive', ['entity_id', 'sku'])
    ->where('archived_date > ?', '2024-01-01');

// Union them
$select1->union([$select2]);
```

## Database Operations

### Fetching Data

```php
// Fetch all rows
$rows = $adapter->fetchAll($select);

// Fetch single row
$row = $adapter->fetchRow($select);

// Fetch single column from all rows
$skus = $adapter->fetchCol($select);

// Fetch single value
$count = $adapter->fetchOne($select);

// Fetch key-value pairs
$select = $adapter->select()
    ->from('catalog_product', ['entity_id', 'sku']);
$pairs = $adapter->fetchPairs($select);
// Returns: [1 => 'SKU001', 2 => 'SKU002', ...]
```

### Inserting Data

```php
// Insert single row
$adapter->insert('catalog_product', [
    'sku' => 'NEW-SKU-001',
    'name' => 'New Product',
    'status' => 1,
    // Always use utcDate() for database timestamps (stores in UTC)
    'created_at' => Mage::app()->getLocale()->utcDate(null, null, true)->format(Mage_Core_Model_Locale::DATETIME_FORMAT)
]);

// Get last insert ID
$productId = $adapter->lastInsertId();

// Insert multiple rows (more efficient)
$data = [
    ['sku' => 'SKU-001', 'name' => 'Product 1', 'status' => 1],
    ['sku' => 'SKU-002', 'name' => 'Product 2', 'status' => 1],
    ['sku' => 'SKU-003', 'name' => 'Product 3', 'status' => 1],
];
$adapter->insertMultiple('catalog_product', $data);
```

### Updating Data

```php
// Update with WHERE clause
$adapter->update(
    'catalog_product',
    ['status' => 0, 'updated_at' => Mage::app()->getLocale()->utcDate(null, null, true)->format(Mage_Core_Model_Locale::DATETIME_FORMAT)],
    'sku = "OLD-SKU-001"'
);

// Update with bound parameters
$adapter->update(
    'catalog_product',
    ['status' => 0],
    $adapter->quoteInto('category_id = ?', 5)
);

// Multiple conditions
$adapter->update(
    'catalog_product',
    ['visibility' => 4],
    [
        'status = ?' => 1,
        'price > ?' => 100
    ]
);
```

### Deleting Data

```php
// Delete with WHERE clause
$adapter->delete('catalog_product', 'sku = "DELETE-ME"');

// Delete with bound parameters
$adapter->delete(
    'catalog_product',
    $adapter->quoteInto('status = ?', 0)
);

// Multiple conditions
$adapter->delete('catalog_product', [
    'status = ?' => 0,
    'updated_at < ?' => '2020-01-01'
]);
```

## Transactions

Maho's database adapter supports **nested transactions** with automatic level tracking:

```php
// Basic transaction
$adapter->beginTransaction();
try {
    $adapter->insert('sales_order', $orderData);
    $orderId = $adapter->lastInsertId();

    $adapter->insert('sales_order_item', [
        'order_id' => $orderId,
        'product_id' => 123,
        'qty_ordered' => 2
    ]);

    $adapter->commit();
} catch (Exception $e) {
    $adapter->rollBack();
    throw $e;
}

// Nested transactions are safe - level tracking prevents premature commits
$adapter->beginTransaction(); // Level 1
try {
    $adapter->insert('table1', $data1);

    $adapter->beginTransaction(); // Level 2
    try {
        $adapter->insert('table2', $data2);
        $adapter->commit(); // Decrements to level 1
    } catch (Exception $e) {
        $adapter->rollBack(); // Rolls back level 2
        throw $e;
    }

    $adapter->commit(); // Actually commits
} catch (Exception $e) {
    $adapter->rollBack(); // Rolls back everything
    throw $e;
}
```

## Custom Query Methods

Maho extends Doctrine DBAL with several custom query methods for complex operations:

### insertFromSelect

Efficiently insert data selected from another table:

```php
// Copy active products to archive table
$select = $adapter->select()
    ->from('catalog_product', ['sku', 'name', 'price'])
    ->where('status = ?', 1);

$adapter->insertFromSelect(
    $select,
    'catalog_product_archive',
    ['sku', 'name', 'price']
);
```

### updateFromSelect

Update table using data from a SELECT query:

```php
// Update product prices from temporary import table
$select = $adapter->select()
    ->from('import_prices', ['sku', 'new_price'])
    ->where('import_id = ?', 123);

$adapter->updateFromSelect(
    $select,
    'catalog_product'
);
// Updates catalog_product.price = import_prices.new_price WHERE sku matches
```

### deleteFromSelect

Delete rows based on a complex SELECT query:

```php
// Delete products that have no inventory
$select = $adapter->select()
    ->from(['p' => 'catalog_product'], 'p.entity_id')
    ->joinLeft(
        ['s' => 'cataloginventory_stock_item'],
        'p.entity_id = s.product_id',
        []
    )
    ->where('s.qty IS NULL OR s.qty <= 0');

$adapter->deleteFromSelect($select, 'catalog_product');
```

## SQL Helper Methods

Maho provides database-agnostic SQL helper methods:

### Conditional Expressions

```php
// IF/ELSE logic in SQL
$qtyExpr = $adapter->getCheckSql(
    'qty > 0',
    'qty',
    '0'
);

$select = $adapter->select()
    ->from('cataloginventory_stock_item', [
        'product_id',
        'available_qty' => $qtyExpr  // Already an Expr, no need to wrap
    ]);
```

### String Functions

```php
// Concatenate strings
$productDesc = $adapter->getConcatSql(['sku', '" - "', 'type_id']);

$select = $adapter->select()
    ->from('catalog_product_entity', [
        'entity_id',
        'product_desc' => $productDesc  // Already an Expr, no need to wrap
    ]);

// String length
$lengthExpr = $adapter->getLengthSql('sku');

$select = $adapter->select()
    ->from('catalog_product_entity', [
        'sku',
        'sku_length' => $lengthExpr  // Already an Expr, no need to wrap
    ]);
```

### Date Functions

```php
use Maho\Db\Adapter\AdapterInterface;

// Add/subtract dates
$futureDate = $adapter->getDateAddSql(
    'created_at',
    30,
    AdapterInterface::INTERVAL_DAY
);

$select = $adapter->select()
    ->from('sales_flat_order', [
        'increment_id',
        'estimated_delivery' => $futureDate  // Already an Expr, no need to wrap
    ]);

// Available intervals: INTERVAL_SECOND, INTERVAL_MINUTE, INTERVAL_HOUR,
//                      INTERVAL_DAY, INTERVAL_MONTH, INTERVAL_YEAR

// Format dates (returns Expr for use in queries)
$formattedDate = $adapter->formatDate('2024-12-25');  // Returns Expr object

$select = $adapter->select()
    ->from('sales_flat_order')
    ->where('created_at >= ?', $formattedDate);
```

### Null Handling

```php
// IFNULL / COALESCE
$priceExpr = $adapter->getIfNullSql('special_price', 'price');

$select = $adapter->select()
    ->from('catalog_product_entity', [
        'sku',
        'final_price' => $priceExpr  // Already an Expr, no need to wrap
    ]);
```

## Parameter Binding

All queries use **parameterized queries** to prevent SQL injection:

```php
// ✅ Safe - parameterized
$select = $adapter->select()
    ->from('catalog_product')
    ->where('sku = ?', $userInput)
    ->where('status IN (?)', $statusArray);

// ✅ Safe - using quoteInto
$where = $adapter->quoteInto('category_id = ?', $categoryId);
$adapter->delete('catalog_product', $where);

// ❌ Unsafe - never concatenate user input
$select = $adapter->select()
    ->from('catalog_product')
    ->where("sku = '$userInput'"); // DON'T DO THIS!
```

### Named Parameters

Named parameters are automatically converted to positional parameters:

```php
// This works - automatically converted
$select = $adapter->select()
    ->from('catalog_product')
    ->where('sku = :sku', ['sku' => 'PROD-001']);

// Internally converted to:
// WHERE sku = ?
// with bound value 'PROD-001'
```

## Schema Operations

### Table Information

```php
// Check if table exists
if ($adapter->isTableExists('my_custom_table')) {
    // Table exists
}

// Get table description
$columns = $adapter->describeTable('catalog_product');
foreach ($columns as $columnName => $columnInfo) {
    echo $columnName . ': ' . $columnInfo['DATA_TYPE'] . "\n";
}

// List all tables
$tables = $adapter->listTables();
```

### Creating Tables

```php
use Maho\Db\Ddl\Table;

$table = $adapter->newTable('my_custom_table')
    ->addColumn('entity_id', Table::TYPE_INTEGER, null, [
        'identity' => true,
        'unsigned' => true,
        'nullable' => false,
        'primary' => true,
    ], 'Entity ID')
    ->addColumn('name', Table::TYPE_TEXT, 255, [
        'nullable' => false,
    ], 'Name')
    ->addColumn('status', Table::TYPE_SMALLINT, null, [
        'unsigned' => true,
        'nullable' => false,
        'default' => '1',
    ], 'Status')
    ->addColumn('created_at', Table::TYPE_TIMESTAMP, null, [
        'nullable' => false,
        'default' => Table::TIMESTAMP_INIT,
    ], 'Created At')
    ->addIndex(
        'IDX_STATUS',
        ['status']
    )
    ->setComment('My Custom Table');

$adapter->createTable($table);
```

## Working with Collections

Collections provide an ORM layer on top of the database adapter:

```php
// Get product collection
$collection = Mage::getModel('catalog/product')->getCollection();

// Add filters
$collection->addFieldToFilter('status', 1)
    ->addFieldToFilter('visibility', ['in' => [2, 3, 4]])
    ->addFieldToFilter('price', ['gt' => 10]);

// Add sorting
$collection->setOrder('created_at', 'DESC');

// Limit results
$collection->setPageSize(20)
    ->setCurPage(1);

// Access underlying select
$select = $collection->getSelect();
echo $select; // See generated SQL

// Iterate
foreach ($collection as $product) {
    echo $product->getSku() . "\n";
}
```

## Migration from Zend_Db

If you're migrating custom code from Magento 1 or OpenMage, here's what changed:

### Constants and Types

```php
// Before (Zend_Db)
Zend_Db::INT_TYPE
Zend_Db::BIGINT_TYPE
Zend_Db_Select::SQL_SELECT

// After (Doctrine DBAL - usually not needed directly)
// Use Maho's wrapper classes instead
```

### Select Object

```php
// Before
$select = new Zend_Db_Select($adapter);

// After - no changes needed
$select = $adapter->select();
```

### Expression Objects

```php
// Before
$expr = new Zend_Db_Expr('COUNT(*)');

// After - both work
$expr = new Varien_Db_Expr('COUNT(*)');  // Backward compatible
$expr = new Maho\Db\Expr('COUNT(*)');    // Modern approach
```

## Best Practices

### 1. Use Read/Write Adapters Appropriately

```php
// ✅ Use read adapter for SELECT queries
$readAdapter = Mage::getSingleton('core/resource')->getConnection('core_read');
$products = $readAdapter->fetchAll($select);

// ✅ Use write adapter for INSERT/UPDATE/DELETE
$writeAdapter = Mage::getSingleton('core/resource')->getConnection('core_write');
$writeAdapter->insert('catalog_product', $data);
```

### 2. Use Parameterized Queries

```php
// ✅ Good - parameterized
$select->where('status = ?', $status)
    ->where('sku IN (?)', $skuArray);

// ❌ Bad - string concatenation
$select->where("status = '$status'");
```

### 3. Use Transactions for Multiple Operations

```php
// ✅ Good - atomic operation
$adapter->beginTransaction();
try {
    $adapter->insert('table1', $data1);
    $adapter->insert('table2', $data2);
    $adapter->commit();
} catch (Exception $e) {
    $adapter->rollBack();
    throw $e;
}

// ❌ Bad - no transaction
$adapter->insert('table1', $data1);
$adapter->insert('table2', $data2);
```

### 4. Use Collections for Model Data

```php
// ✅ Good - use collections
$collection = Mage::getModel('catalog/product')->getCollection()
    ->addFieldToFilter('status', 1);

// ❌ Less ideal - raw SQL for model data
$select = $adapter->select()->from('catalog_product');
```

### 5. Leverage Expression Objects

```php
// ✅ Good - use Expr for SQL functions
use Maho\Db\Expr;

$select->columns([
    'total' => new Expr('SUM(grand_total)'),
    'count' => new Expr('COUNT(*)')
]);

// ❌ Bad - string in columns
$select->columns([
    'total' => 'SUM(grand_total)'  // Will be quoted!
]);
```

### 6. Index Your Queries

```php
// When creating custom tables, add indexes
$table->addIndex(
    'IDX_CUSTOMER_STATUS',
    ['customer_id', 'status']
);

// For frequently filtered/joined columns
$table->addIndex('IDX_SKU', ['sku']);
$table->addIndex('IDX_CREATED', ['created_at']);
```

## Debugging Queries

### View Generated SQL

```php
// See what SQL will be executed
$select = $adapter->select()
    ->from('catalog_product')
    ->where('status = ?', 1);

echo $select->__toString();
// or
echo (string) $select;
```

## Performance Optimization

### 1. Use insertMultiple for Bulk Inserts

```php
// ✅ Fast - single query
$adapter->insertMultiple('catalog_product', $dataArray);

// ❌ Slow - multiple queries
foreach ($dataArray as $row) {
    $adapter->insert('catalog_product', $row);
}
```

### 2. Use insertFromSelect for Large Data Copies

```php
// ✅ Fast - single query on server
$select = $adapter->select()->from('source_table');
$adapter->insertFromSelect($select, 'dest_table', ['col1', 'col2']);

// ❌ Slow - fetch and re-insert
$rows = $adapter->fetchAll($select);
foreach ($rows as $row) {
    $adapter->insert('dest_table', $row);
}
```

### 3. Limit Collection Size

```php
// ✅ Good - paginate large collections
$collection->setPageSize(100)->setCurPage(1);
// load() respects pagination settings

// ❌ Bad - no pagination set
$collection->load(); // Loads all rows without any limit if no pagination set
```

### 4. Select Only Needed Columns

```php
// ✅ Good - specific columns
$select->from('catalog_product', ['entity_id', 'sku', 'name']);

// ❌ Less efficient - all columns
$select->from('catalog_product', '*');
```

## Troubleshooting

### Common Issues

**1. "Named parameter does not have a bound value"**

Old code with named parameters will be automatically converted. If you see this error in custom code:

```php
// This is now automatically handled
$select->where('sku = :sku', ['sku' => 'value']);
```

**2. "Column not found" with functions**

Functions need to be wrapped in Expr:

```php
// ❌ Wrong
$select->columns(['total' => 'COUNT(*)']);

// ✅ Correct
$select->columns(['total' => new Maho\Db\Expr('COUNT(*)')]);
```

**3. Integers quoted in WHERE clauses**

This is normal and doesn't affect performance - MySQL handles both forms identically:

```php
// Both work the same
WHERE id = 42      // Doctrine DBAL style
WHERE id = '42'    // Old Zend_Db style
```

**4. SELECT * becoming SELECT table.\***

This is more explicit and better for debugging - functionally identical:

```php
SELECT *           // Old style
SELECT table.*     // New style - more explicit
```

## Additional Resources

- [Doctrine DBAL Documentation](https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/index.html){target=_blank}
- [Maho Developer Guide - Models and ORM](maho-for-devs/models-and-orm.md)
- [Maho Developer Guide - Data Collections](maho-for-devs/data-collections.md)
- [Maho Developer Guide - Setup Resources](maho-for-devs/setup-resources.md)

The database layer in Maho provides a solid foundation for data access with modern tooling, excellent performance, and complete backward compatibility with existing code.
