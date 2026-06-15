---
date: 2026-06-11
categories:
  - Feature spotlight
---

# The EU revocation button is mandatory on June 19. Maho has you covered.

If you sell to consumers in the EU, a new rule lands in **eight days**. From **19 June 2026**, EU Directive 2023/2673 requires online shops to give customers a clearly labelled **revocation button**: a way to withdraw from a contract in a few clicks, always reachable, no hoops. In Germany it's written into law as §356a BGB.

Maho ships that button, built in. It lands in core with **26.7 in July**, but the deadline comes first, so you can add it to your store today.

<!-- more -->

!!! warning "One honest note"
    Maho gives you a solid, compliant tool, but we're not your lawyers. Confirm the exact wording and process with counsel for the markets you serve.

## What the law actually asks for

The idea is consumer-friendly and, for once, refreshingly concrete. During the statutory withdrawal period a customer must be able to:

- find a **permanently visible** button to revoke their contract,
- reach a form **without logging in** or jumping through verification steps,
- and get **confirmation that their declaration was received**.

The catch is in the details that are easy to get wrong. You **cannot** put a manual CAPTCHA in front of it. You **cannot** require an email-confirmation link. You **cannot** hide it behind an account. Anything that blocks a legitimate withdrawal defeats the legal purpose of the button, and that includes well-meaning anti-spam measures.

That tension, *open to everyone but not open to abuse*, is exactly what the new `Maho_Revocation` module is designed to resolve.

## What you get out of the box

Enable the module, drop one widget in your footer, and you have a compliant channel end to end:

- **A public form at `/revocation`**, reachable without login, with name, email, order number, and an optional reason.
- **A button widget** you place wherever it needs to stay visible, usually the footer, styled entirely by your theme.
- **A my-account shortcut** on the customer's order page that pre-fills the form for that order.
- **Automatic emails**: a receipt acknowledgement to the customer and a notification to you.
- **A complete admin workflow** under *Sales → Revocation Requests*: a searchable grid, a detail view, accept/reject, order linking, CSV export, and mass actions.

Accepting a revocation records the decision and notes it on the order; the request view then gives you a one-click link into Maho's standard **credit memo flow** for the refund. It never silently changes an order status or moves money on its own. No parallel money path, no surprises.

## The legal receipt that always survives

Here's the part we're proud of. When a customer submits, the **first** thing that happens is a row is written to the database. That row is the legal receipt, and nothing after it can take it away.

If the confirmation email bounces, the receipt stands. If your mail server is down, the receipt stands. If an abuse filter suppresses a courtesy email, the receipt stands and the merchant is still notified. Every declaration is stored with its UTC timestamp, IP, user agent, and locale, and the declaration fields are **never edited after insert**. When an auditor asks "show me every withdrawal you received and when," the answer is one CSV export away.

## Spam-proof without a CAPTCHA

Since the law forbids the usual friction, we went fully invisible:

- A **honeypot** field humans never see. Bots that fill it get the *normal* success page, so they never learn the trap exists.
- A **submit-timing** check that quietly drops submissions faster than any human could type. Under full page cache it degrades open, so it can never block a real customer.
- **Rate limits** on submissions per IP, receipt emails per recipient (so nobody can email-bomb a third party through your form), and merchant notifications per hour.

All of it runs in the background. A real customer just fills in the form and gets their confirmation. The defaults are deliberately gentle, because a blocked withdrawal is a compliance failure, not a win.

## Built for the markets that need it

The form and button ship in **English** and every string is translatable, so you can present the exact German §356a wording ("Vertrag widerrufen") or any language your market needs through a language pack. Everything is themeable and overridable like any other Maho module, and it's all **open source**: read exactly what it does, line by line, before you trust it with a legal obligation.

## Get ready before the 19th

Here's the thing about timing: **26.7 lands in July**, after the 19 June deadline. So if you sell into the EU and need to be compliant on day one, don't wait for the release, add the module to your current install now as a Composer patch.

The whole module already lives in [pull request #1009](https://github.com/MahoCommerce/maho/pull/1009), and GitHub serves any PR as a ready-made patch file, so you can apply it to your store **today**.

Just append `.patch` to the PR's URL to get the patch file. To apply it cleanly, add the [cweagans/composer-patches](https://github.com/cweagans/composer-patches) plugin to your project and point it at the PR:

```bash
composer require cweagans/composer-patches
```

Then declare the patch in your project's `composer.json`:

```json
{
    "extra": {
        "patches": {
            "mahocommerce/maho": {
                "EU revocation button (PR #1009)": "https://github.com/MahoCommerce/maho/pull/1009.patch"
            }
        }
    }
}
```

Apply it and clear caches so the new module registers:

```bash
composer install
./maho cache:flush
```

The module schema installs automatically on the next request (or run your usual upgrade step). It ships **disabled by default**, since only B2C shops selling into the EU need it, so two steps switch it on:

1. Turn on *System → Configuration → Sales → Revocation Button*.
2. Add the **Revocation Button** widget to your footer so it's visible on every page.

That's it. The [Revocation Button documentation](/revocation-button/) walks through every setting, the admin workflow, and the email templates in detail.

When **26.7 arrives in July** the feature is already in core, so just drop the patch entry, remove the plugin if you only added it for this, and `composer update` as normal, nothing to migrate.

Eight days. You're covered. Maho rocks! 🚀
