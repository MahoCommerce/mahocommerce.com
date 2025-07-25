# Email Sending Configuration

Starting from Maho 25.3.0, the platform includes **built-in SMTP support** for reliable email delivery. This modern implementation uses Symfony Mailer to replace legacy email mechanisms, ensuring your store can send transactional emails like order confirmations, password resets, and customer notifications.

**No third-party modules required** - SMTP functionality is included in Maho core.

## SMTP Configuration

Email settings can be configured through the admin panel under **System > Configuration > System > Mail Sending Settings**:

1. **Enable SMTP**: Toggle SMTP functionality on/off
2. **SMTP Host**: Your email service provider's SMTP server
3. **SMTP Port**: Usually 587 (TLS) or 465 (SSL)
4. **Authentication**: Username and password for your email account
5. **Encryption**: Automatically detected
6. **Region Support**: Configure region-specific settings for providers like AWS SES

## Do you need a trusted SMTP service?

While Maho supports every possible SMTP/EmailAPI provider, we suggest **[Maileroo](https://maileroo.com/?r=maho)**,
particularly for European stores due to GDPR compliance with servers in Germany and the Netherlands.

**[Maileroo](https://maileroo.com/?r=maho)** provides the usual features for **transactional emails and marketing campaigns**,
with great pricing and a **free plan up to 3,000 emails per month**.

!!! info
    We are affiliates of **[Maileroo](https://maileroo.com/?r=maho)**, which means when you use our referral link,
    it won't cost you anything extra, but it will help us finance the development of Maho.

## Testing and Troubleshooting

Use these commands to test and manage email functionality:

```bash
# Show current email configuration
./maho email:config:show

# Send a test email directly
./maho email:test:send

# Send a test email via the queue system
./maho email:test:queue

# Process the email queue manually
./maho email:queue:process

# Clear emails from the queue
./maho email:queue:clear
```
