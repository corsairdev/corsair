# @corsair-dev/dripcel

Dripcel plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dripcel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `balance.get` | `dripcel.api.balance.get` | `read` | Get the current Dripcel credit balance |
| `campaigns.list` | `dripcel.api.campaigns.list` | `read` | List Dripcel campaigns |
| `compliance.checkSend` | `dripcel.api.compliance.checkSend` | `read` | Check whether phone numbers may receive SMS |
| `contacts.addTags` | `dripcel.api.contacts.addTags` | `write` | Add tags to a Dripcel contact by cell number |
| `contacts.create` | `dripcel.api.contacts.create` | `write` | Create new Dripcel contacts in bulk (POST /contacts) |
| `contacts.delete` | `dripcel.api.contacts.delete` | `destructive` | Delete a Dripcel contact by cell number [DESTRUCTIVE] |
| `contacts.get` | `dripcel.api.contacts.get` | `read` | Get a Dripcel contact by cell number (MSISDN) |
| `contacts.optOut` | `dripcel.api.contacts.optOut` | `write` | Opt a Dripcel contact out of campaigns |
| `contacts.upsert` | `dripcel.api.contacts.upsert` | `write` | Create or update Dripcel contacts in bulk (PUT /contacts) |
| `deliveries.list` | `dripcel.api.deliveries.list` | `read` | List Dripcel deliveries by cell or send customerId |
| `emailTemplates.list` | `dripcel.api.emailTemplates.list` | `read` | List Dripcel email templates |
| `replies.search` | `dripcel.api.replies.search` | `read` | Search Dripcel message replies |
| `sales.upload` | `dripcel.api.sales.upload` | `write` | Upload sales to Dripcel (POST /sales) |
| `send.bulkEmail` | `dripcel.api.send.bulkEmail` | `write` | Send bulk email via a Dripcel template |
| `send.sms` | `dripcel.api.send.sms` | `write` | Send a single SMS via Dripcel |
| `sendLogs.search` | `dripcel.api.sendLogs.search` | `read` | Search Dripcel send logs |
| `tags.delete` | `dripcel.api.tags.delete` | `destructive` | Delete a Dripcel tag by ID [DESTRUCTIVE] |
| `tags.list` | `dripcel.api.tags.list` | `read` | List all Dripcel tags |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dripcel

## License

Apache-2.0
