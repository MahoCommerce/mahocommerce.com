## Deploy to production

When you deploy a Maho project in production, you need to setup cron this way:

```cron
*/5 * * * * cd /var/www/mahoproject; php ./maho cron:run default >/dev/null 2>&1
*/5 * * * * cd /var/www/mahoproject; php ./maho cron:run always >/dev/null 2>&1
```

## Test locally

When developing a Maho project locally, you don't need to setup cron, but you may
want to run a specific cron job.

More info coming soon...