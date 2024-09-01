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
| 169         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:11:00 |             |             |
| 170         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:12:00 |             |             |
| 171         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:13:00 |             |             |
| 172         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:14:00 |             |             |
| 173         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:15:00 |             |             |
| 174         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:16:00 |             |             |
| 175         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:17:00 |             |             |
| 176         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:18:00 |             |             |
| 177         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:19:00 |             |             |
| 178         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:20:00 |             |             |
| 179         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:21:00 |             |             |
| 180         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:22:00 |             |             |
| 181         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:23:00 |             |             |
| 182         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:24:00 |             |             |
| 183         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:25:00 |             |             |
| 184         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:26:00 |             |             |
| 185         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:27:00 |             |             |
| 186         | core_email_queue_send_all | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:28:00 |             |             |
| 187         | newsletter_send_all       | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:10:00 |             |             |
| 188         | newsletter_send_all       | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:15:00 |             |             |
| 189         | newsletter_send_all       | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:20:00 |             |             |
| 190         | newsletter_send_all       | pending |          | 2024-08-10 23:09:41 | 2024-08-10 23:25:00 |             |             |
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