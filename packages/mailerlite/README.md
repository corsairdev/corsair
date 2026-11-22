# @corsair-dev/mailerlite

MailerLite's current date-versioned REST API as a Corsair plugin. API keys are sent as `Authorization: Bearer …`; requests use the official base URL and pin `X-Version` to `2026-11-21`.

## Install

```bash
pnpm add @corsair-dev/mailerlite
```

Generate a MailerLite API key in **Integrations → MailerLite API**, then connect the plugin with the tenant's API key. The key is user-bound by MailerLite and stops working if its creator is removed from the account.

## Coverage

The plugin covers current subscriber, group, field, segment, campaign, form, webhook-management, automation, simple-editor email, and e-commerce routes. It excludes MailerLite Classic API V1/V2 and callback receivers. Webhook administration is available; this package does not receive or verify inbound webhook deliveries.

| Resource | Corsair operation group | REST path family | Reference |
| --- | --- | --- | --- |
| Subscribers | `subscribers.*` | `/subscribers`, `/subscribers/{id}`, activity, imports, groups and e-commerce reports | [Subscribers](https://developers.mailerlite.com/api/subscribers) |
| Groups | `groups.*` | `/groups`, group subscribers and subscriber imports | [Groups](https://developers.mailerlite.com/api/groups) |
| Fields / segments | `fields.*`, `segments.*` | `/fields`, `/segments` and segment subscribers | [Fields](https://developers.mailerlite.com/api/fields), [Segments](https://developers.mailerlite.com/api/segments) |
| Campaigns | `campaigns.*` | `/campaigns` and campaign reports | [Campaigns](https://developers.mailerlite.com/api/campaigns) |
| Forms and webhooks | `forms.*`, `webhooks.*` | `/forms`, `/webhooks` | [Forms](https://developers.mailerlite.com/api/forms), [Webhooks](https://developers.mailerlite.com/api/webhooks) |
| Automations | `automations.*`, `automationSteps.*`, `automationTriggers.*`, `automationReports.*`, `automationEmails.*`, `automationTemplates.*` | `/automations` and documented child resources | [Automations](https://developers.mailerlite.com/api/automations), [steps](https://developers.mailerlite.com/api/automation-steps), [triggers](https://developers.mailerlite.com/api/automation-triggers), [reports](https://developers.mailerlite.com/api/automation-reports), [automation emails](https://developers.mailerlite.com/api/automation-emails), [templates](https://developers.mailerlite.com/api/automation-templates) |
| Simple-editor emails | `emails.*` | `/emails` blocks, design settings, templates and versions | [Emails](https://developers.mailerlite.com/api/emails) |
| E-commerce | `shops.*`, `carts.*`, `cartItems.*`, `categories.*`, `categoryProducts.*`, `customers.*`, `orders.*`, `products.*`, `productVariants.*`, `ecommerceImports.*`, `ecommerceSettings.*` | `/ecommerce` shops, carts, catalog, orders and settings | [E-commerce API](https://developers.mailerlite.com/ecommerce/shops), [imports](https://developers.mailerlite.com/ecommerce/import) |
| Reference data | `brandStyles.*`, `files.*`, `timezones.*`, `campaignLanguages.*` | `/brand-styles`, `/files`, `/timezones`, `/campaigns/languages` | [API reference](https://developers.mailerlite.com/llms.txt) |

## Safety and behavior

- List operations expose the documented page/cursor/limit parameters. Follow response pagination metadata; the plugin does not fetch every page automatically.
- MailerLite documents a global 120 requests/minute limit and a separate 5 requests/minute limit for subscriber-import creation. `Retry-After` is preserved on 429 errors. The transport may retry safe GET requests; writes are never automatically replayed.
- Optional `Idempotency-Key` inputs are exposed only on the simple-editor email routes that document that header. MailerLite stores successful idempotent responses for 24 hours.
- E-commerce routes accept `query.with_resource_id: true` for the provider-documented resource-ID lookup mode. Use the `resource_id` fields documented for category/product/customer imports, orders, carts and cart items consistently with that flag.
- Scheduling a campaign sends it to the selected audience. Automation enable/test, changing automation runs, forgetting/deleting subscribers, deleting resources, completing orders and replacing product variants can have lasting effects. Review permissions and inputs before allowing agents to run them.
- Subscriber upsert does not remove existing groups or fields when omitted. Subscriber update treats a supplied `groups` list as the complete membership set. Do not set `resubscribe: true` or reactivate an unsubscribed, bounced or junk subscriber unless they have explicitly asked to subscribe again. MailerLite's account settings govern double opt-in; the API cannot be used to bypass consent.
- Marking an e-commerce order `complete` can trigger purchase automations and revenue attribution. Product-variant creation with `resource_id` deletes existing variants omitted from the submitted list.
- API errors preserve HTTP status and `Retry-After` but redact request paths, payloads and provider response bodies to avoid exposing subscriber data or email content.

## Deliberate exclusions

- MailerLite Classic API V1/V2: separate legacy product/version; only current REST API contracts are implemented.
- `POST /api/batch`: the envelope permits arbitrary nested API routes, so it cannot enforce this plugin's per-operation schemas, permissions or write retry behavior.
- `POST /api/subscribers/import`: the getting-started page mentions its separate rate limit but does not publish a complete current request/response contract. The documented group-import creation and import-progress GET routes are included.
- Inbound webhook callback receivers and signature verification: webhook management endpoints are included, but Corsair cannot host an inbound callback handler inside this plugin.
- Cart deletion: MailerLite documents that carts cannot be deleted directly; deleting an associated order removes the cart and its items.

## License

Apache-2.0
