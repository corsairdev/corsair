# @corsair-dev/remarkety

Remarkety plugin for Corsair - manage stores and sync status, create contacts, build and update email campaigns with their rules and templates, and read products, rules and segments.

## Install

```bash
pnpm add @corsair-dev/remarkety
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.create` | `remarkety.api.campaigns.create` | `write` | Create a campaign from a type and its actions, each an email or an api webhook with the rules that decide when it runs |
| `campaigns.delete` | `remarkety.api.campaigns.delete` | `destructive` | Delete a campaign |
| `campaigns.get` | `remarkety.api.campaigns.get` | `read` | Read one campaign by id |
| `campaigns.stats` | `remarkety.api.campaigns.stats` | `read` | Read sent counts and generated revenue per campaign, in USD and in the store currency |
| `campaigns.types` | `remarkety.api.campaigns.types` | `read` | Read the campaign types the store supports and their options |
| `campaigns.update` | `remarkety.api.campaigns.update` | `write` | Update a campaign, including its mode, which can start or stop real sending |
| `contacts.create` | `remarkety.api.contacts.create` | `write` | Create a contact in a store, optionally with double opt-in and marketing permission |
| `contacts.unsubscribe` | `remarkety.api.contacts.unsubscribe` | `write` | Unsubscribe one email address from a store |
| `emailTemplates.get` | `remarkety.api.emailTemplates.get` | `read` | Read one campaign rule's email template |
| `emailTemplates.preview` | `remarkety.api.emailTemplates.preview` | `read` | Read the sample data a campaign template merges against, optionally for a real shopper or order |
| `emailTemplates.update` | `remarkety.api.emailTemplates.update` | `write` | Replace one campaign rule's email template |
| `masterTemplates.list` | `remarkety.api.masterTemplates.list` | `read` | List the master email templates available to a store |
| `masterTemplates.switch` | `remarkety.api.masterTemplates.switch` | `write` | Convert a template into a new master template so it can be reused across campaigns |
| `products.list` | `remarkety.api.products.list` | `read` | Search a store's synced products by name or SKU, with paging and an update-time filter |
| `rules.get` | `remarkety.api.rules.get` | `read` | Read one rule type's operators and possible values |
| `rules.list` | `remarkety.api.rules.list` | `read` | Read every rule a campaign action can use, with its operators and possible values |
| `segments.count` | `remarkety.api.segments.count` | `read` | Count the shoppers matching a segment |
| `segments.list` | `remarkety.api.segments.list` | `read` | List the emails and names matching a segment, with paging |
| `stores.create` | `remarkety.api.stores.create` | `write` | Create a store with the API key Remarkety will sync it with |
| `stores.delete` | `remarkety.api.stores.delete` | `destructive` | Delete a store |
| `stores.get` | `remarkety.api.stores.get` | `read` | Read one store by id |
| `stores.status` | `remarkety.api.stores.status` | `read` | Read the store sync status, including the last error and the last successful sync |
| `stores.update` | `remarkety.api.stores.update` | `write` | Update a store; the id goes in the body because the route is PUT /stores |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/remarkety

## License

Apache-2.0
