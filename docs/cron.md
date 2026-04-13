# Cron jobs

Maho uses a cron system to run scheduled background tasks — things like sending queued emails, cleaning up old logs, generating sitemaps, and applying catalog price rules.

## Defining cron jobs

!!! info "v26.5+"
    Since v26.5, cron jobs are defined using PHP attributes directly on the method. Previously they were configured in XML — see [Migrating from XML](#migrating-from-xml) if you're upgrading an existing module.

Place the `#[Maho\Config\CronJob]` attribute on a public method to register it as a cron job:

```php
class Maho_AdminActivityLog_Model_Observer
{
    #[Maho\Config\CronJob('adminactivitylog_clean_old_logs', schedule: '0 2 * * *')]
    public function cleanOldLogs(): void
    {
        // Runs daily at 2:00 AM
    }
}
```

After adding or changing any cron job attribute, run:

```bash
composer dump-autoload
```

This compiles all attributes into `vendor/composer/maho_attributes.php`, which is what the runtime reads.

### Parameters

| Parameter    | Type     | Default      | Description |
|--------------|----------|--------------|-------------|
| `id`         | `string` | *(required)* | Job identifier (e.g. `'sitemap_generate'`, `'core_clean_cache'`) |
| `schedule`   | `?string`| `null`       | Cron expression (e.g. `'0 2 * * *'`, `'*/5 * * * *'`) |
| `configPath` | `?string`| `null`       | Config path for admin-configurable schedule |

### Fixed schedule

Use the `schedule` parameter with a standard cron expression:

```php
#[Maho\Config\CronJob('giftcard_process_scheduled_emails', schedule: '*/5 * * * *')]
public function processScheduledEmails(): void { }
```

### Admin-configurable schedule

Use `configPath` instead of `schedule` when the cron expression should be configurable from the admin panel:

```php
#[Maho\Config\CronJob('customersegmentation_refresh_segments', configPath: 'customer/customer_segments/cron_schedule')]
public function refreshSegments(): void { }
```

!!! note
    Provide either `schedule` or `configPath`, not both. If neither is set, the job can only be triggered manually via `./maho cron:run <job_id>`.

Individual cron job failures are caught and recorded without stopping the rest of the cron run.

## Deploy to production

When you deploy a Maho project in production, you need to set up cron this way:

```cron
*/5 * * * * cd /var/www/mahoproject; php ./maho cron:run default >/dev/null 2>&1
*/5 * * * * cd /var/www/mahoproject; php ./maho cron:run always >/dev/null 2>&1
```

## Check job status

Using [Maho's CLI tool](cli-tool.md) you can get info about jobs and their status with
these two commands:

```
./maho cron:list
+----------------------------------------------+-----------------------------------------------------------+--------------+
| event                                        | model::method                                             | schedule     |
+----------------------------------------------+-----------------------------------------------------------+--------------+
| aggregate_reports_report_product_viewed_data | reports/observer::aggregateReportsReportProductViewedData | 0 0 * * *    |
| aggregate_sales_report_bestsellers_data      | sales/observer::aggregateSalesReportBestsellersData       | 0 0 * * *    |
| aggregate_sales_report_coupons_data          | salesrule/observer::aggregateSalesReportCouponsData       | 0 0 * * *    |
| aggregate_sales_report_invoiced_data         | sales/observer::aggregateSalesReportInvoicedData          | 0 0 * * *    |
| aggregate_sales_report_order_data            | sales/observer::aggregateSalesReportOrderData             | 0 0 * * *    |
| aggregate_sales_report_refunded_data         | sales/observer::aggregateSalesReportRefundedData          | 0 0 * * *    |
| aggregate_sales_report_shipment_data         | sales/observer::aggregateSalesReportShipmentData          | 0 0 * * *    |
| aggregate_sales_report_tax_data              | tax/observer::aggregateSalesReportTaxData                 | 0 0 * * *    |
| api_session_cleanup                          | api/cron::cleanOldSessions                                | 0 35 * * *   |
| catalogrule_apply_all                        | catalogrule/observer::dailyCatalogUpdate                  | 0 1 * * *    |
| catalog_product_alert                        | productalert/observer::process                            |              |
| catalog_product_index_price_reindex_all      | catalog/observer::reindexProductPrices                    | 0 2 * * *    |
| core_clean_cache                             | core/observer::cleanCache                                 | 30 2 * * *   |
| core_email_queue_clean_up                    | core/email_queue::cleanQueue                              | 0 0 * * *    |
| core_email_queue_send_all                    | core/email_queue::send                                    | */1 * * * *  |
| currency_rates_update                        | directory/observer::scheduledUpdateCurrencyRates          |              |
| customer_flowpassword                        | customer/observer::deleteCustomerFlowPassword             | 0 0 1 * *    |
| index_clean_events                           | index/observer::cleanOutdatedEvents                       | 30 */4 * * * |
| log_clean                                    | log/cron::logClean                                        |              |
| newsletter_send_all                          | newsletter/observer::scheduledSend                        | */5 * * * *  |
| paypal_fetch_settlement_reports              | paypal/observer::fetchReports                             |              |
| persistent_clear_expired                     | persistent/observer::clearExpiredCronJob                  | 0 0 * * *    |
| sales_clean_quotes                           | sales/observer::cleanExpiredQuotes                        | 0 0 * * *    |
| sitemap_generate                             | sitemap/observer::scheduledGenerateSitemaps               |              |
+----------------------------------------------+-----------------------------------------------------------+--------------+
```

```
./maho cron:history
+-------------+---------------------------+---------+----------+---------------------+---------------------+-------------+-------------+
| schedule_id | job_code                  | status  | messages | messages            | scheduled_at        | executed_at | finished_at |
+-------------+---------------------------+---------+----------+---------------------+---------------------+-------------+-------------+
| 167         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:09:00 |             |             |
| 168         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:10:00 |             |             |
| ...         | ...                       | ...     | ...      | ...                 | ...                 | ...         | ...         |
+-------------+---------------------------+---------+----------+---------------------+---------------------+-------------+-------------+
```

## Test locally

When developing a Maho project locally, you don't need to set up cron, but you may
want to run a specific cron job.

This can be done passing the `job_code` you want to execute to `./maho cron:run`, like:

```
./maho cron:run core_email_queue_send_all
core_email_queue_send_all executed successfully
```

!!! note
    If there's a record in the `cron_schedule` table for the specified `job_code` with status
    of `pending`, that record will be "burnt" otherwise no record will be created but the job
    will be executed anyway.

## Migrating from XML

If you're upgrading a module that used XML-based cron configuration:

**Before (config.xml):**

```xml
<config>
    <crontab>
        <jobs>
            <newsletter_send_all>
                <schedule><cron_expr>*/5 * * * *</cron_expr></schedule>
                <run><model>newsletter/observer::scheduledSend</model></run>
            </newsletter_send_all>
        </jobs>
    </crontab>
</config>
```

**After (PHP attribute):**

```php
#[Maho\Config\CronJob('newsletter_send_all', schedule: '*/5 * * * *')]
public function scheduledSend(Mage_Cron_Model_Schedule $schedule): void { }
```

For config-driven schedules:

```xml
<!-- Before -->
<schedule><config_path>crontab/jobs/catalog_product_alert/schedule/cron_expr</config_path></schedule>
```

```php
// After
#[Maho\Config\CronJob('catalog_product_alert', configPath: 'crontab/jobs/catalog_product_alert/schedule/cron_expr')]
```

Remove the corresponding XML blocks from `config.xml` after migrating — both sources are read at runtime, and duplicates will cause issues.
