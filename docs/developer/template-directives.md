---
description: The directives available in Maho email and CMS templates - variables, includes, and conditional blocks with full expression support for comparisons and boolean logic.
---

# Template Directives <span class="version-badge">v26.9+</span>

Transactional emails, newsletter templates, and CMS pages/blocks are processed by Maho's template filter, which understands a small set of `{{...}}` directives. This page documents the directives and the condition syntax, including the expression support introduced in 26.9.

## Variables: `{{var}}`

Outputs a template variable. Dotted paths traverse objects, and method calls are supported:

```
Hi {{var customer.name}},
your order {{var order.increment_id}} has shipped.

{{var order.getBillingAddress().format('html')}}
```

For object properties (`order.increment_id`), Maho first looks for a real getter method (`getIncrementId()`) and falls back to raw data access, so computed values like `order.billing_address` resolve the same way they do in PHP code.

## Conditions: `{{if}}` and `{{depend}}`

`{{if}}` renders one of two branches, `{{depend}}` renders its body only when the condition holds:

```
{{if order.getIsNotVirtual()}}
  Your tracking number is {{var shipment.getTrackingNumber()}}.
{{else}}
  Your download is ready in your customer account.
{{/if}}

{{depend comment}}
  Note from the merchant: {{var comment}}
{{/depend}}
```

### Expressions <span class="version-badge">v26.9+</span>

Conditions are evaluated with [Symfony ExpressionLanguage](https://symfony.com/doc/current/reference/formats/expression_language.html), so they are not limited to a single variable - comparisons, boolean logic, and method calls all work:

```
{{if order.grand_total > 100 && customer.group_id == 2}}
  Thanks for the big wholesale order!
{{/if}}

{{if order.status in ['complete', 'closed']}}...{{/if}}

{{if customer.getName() starts with 'Dr.'}}...{{/if}}
```

Commonly used operators:

| Category | Operators |
|----------|-----------|
| Comparison | `==` `!=` `<` `<=` `>` `>=` |
| Boolean | `&&` (`and`), <code>&#124;&#124;</code> (`or`), `!` (`not`) |
| Strings | `~` (concatenation), `starts with`, `ends with`, `contains`, `matches` |
| Arrays | `in`, `not in` |
| Numbers | `+` `-` `*` `/` `%` |

The full syntax is documented in the [ExpressionLanguage reference](https://symfony.com/doc/current/reference/formats/expression_language.html).

### Evaluation rules

- **Truthiness follows PHP**: `''`, `0`, `'0'`, `null`, `false`, and empty arrays are false, everything else is true. (Before 26.9, `0` and `'0'` were treated as true - a quirk of the old evaluator, not a feature.)
- **Absent variables evaluate as empty.** `{{depend comment}}` with no `comment` variable simply renders nothing; it does not log or fail.
- **A broken condition never breaks the template.** If an expression fails to parse or evaluate, the else branch renders (or nothing, for `{{depend}}`) and a warning is written to the log with the offending expression.
- **Property paths prefer getters.** As with `{{var}}`, `order.status_label` calls `getStatusLabel()` when it exists and falls back to `getData('status_label')`.

### Security

Template authors get the same power in conditions as in `{{var}}`, no more:

- The ExpressionLanguage `constant()` function is disabled, so templates cannot read PHP or class constants.
- `getConfig()` calls against encrypted configuration paths (API passwords, keys) are neutralized, mirroring the protection applied to `{{var}}` output.

## Includes: `{{include}}` and `{{template}}`

`{{include template="..."}}` includes another template by code; `{{template config_path="..."}}` includes the email template referenced by a system configuration path, which is how the shared header and footer are pulled into every transactional email:

```
{{template config_path="design/email/header"}}
...
{{template config_path="design/email/footer"}}
```

## Where directives are available

| Context | Filter |
|---------|--------|
| Transactional emails | `Mage_Core_Model_Email_Template_Filter` |
| Newsletter templates | `Mage_Newsletter_Model_Template_Filter` |
| CMS pages and blocks | `Mage_Cms_Model_Template_Filter` |

These filters form an inheritance chain (newsletter extends widget extends CMS extends email), so they all share the directives and condition evaluation described above. On top of the base set, the email filter adds `{{block}}`, `{{layout}}`, `{{store}}`, `{{skin}}`, `{{media}}`, `{{config}}`, `{{customvar}}`, `{{protocol}}`, `{{inlinecss}}`, and output modifiers such as `{{var subscriber_email|escape}}`; `{{widget}}` is available in the CMS, widget, and newsletter contexts.
