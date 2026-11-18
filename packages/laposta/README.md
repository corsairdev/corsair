# @corsair-dev/laposta

Laposta plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/laposta
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `lists.list` | `laposta.api.lists.list` | `read` | Retrieve all mailing lists |
| `lists.get` | `laposta.api.lists.get` | `read` | Retrieve a specific mailing list by ID |
| `lists.create` | `laposta.api.lists.create` | `write` | Create a new mailing list |
| `lists.update` | `laposta.api.lists.update` | `write` | Update an existing mailing list |
| `lists.delete` | `laposta.api.lists.delete` | `destructive` | Delete a mailing list |
| `members.list` | `laposta.api.members.list` | `read` | Retrieve subscribers for a mailing list |
| `members.get` | `laposta.api.members.get` | `read` | Retrieve a specific subscriber by ID |
| `members.create` | `laposta.api.members.create` | `write` | Subscribe a new member to a mailing list |
| `members.update` | `laposta.api.members.update` | `write` | Update an existing subscriber |
| `members.delete` | `laposta.api.members.delete` | `destructive` | Unsubscribe or delete a member from a list |
| `fields.list` | `laposta.api.fields.list` | `read` | Retrieve custom fields for a mailing list |
| `fields.get` | `laposta.api.fields.get` | `read` | Retrieve a specific custom field by ID |
| `fields.create` | `laposta.api.fields.create` | `write` | Create a new custom field for a mailing list |
| `fields.delete` | `laposta.api.fields.delete` | `destructive` | Delete a custom field from a mailing list |
| `campaigns.list` | `laposta.api.campaigns.list` | `read` | Retrieve all email campaigns |
| `campaigns.get` | `laposta.api.campaigns.get` | `read` | Retrieve a specific campaign by ID |
| `reports.get` | `laposta.api.reports.get` | `read` | Retrieve analytics and delivery report for a campaign |

## Auth

Auth: API key (HTTP Basic Auth with the API key as username). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/laposta

## License

Apache-2.0
