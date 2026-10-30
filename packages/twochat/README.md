# @corsair-dev/twochat

TwoChat plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/twochat
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getApiUsageInfo` | `twochat.api.account.getApiUsageInfo` | `read` | Retrieve current API usage and account information. Use when you need to monitor your remaining quotas before sending more requests. |
| `account.testApiKey` | `twochat.api.account.testApiKey` | `read` | Validate your API key and retrieve account info. Use when confirming credentials before performing other operations. |
| `contacts.createContact` | `twochat.api.contacts.createContact` | `write` | Create a new contact in your 2Chat account. Use after gathering and verifying first name and at least one contact detail (email, phone, or address). |
| `contacts.listContacts` | `twochat.api.contacts.listContacts` | `read` | List all contacts in your 2Chat account. Use when you need to retrieve your contact list after confirming your account connection. |
| `webhookSubscriptions.listWebhooks` | `twochat.api.webhookSubscriptions.listWebhooks` | `read` | List all configured webhook subscriptions for WhatsApp and phone call events. Returns details including webhook UUID, event type, channel UUID, callback URL, and creation timestamp. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twochat

## License

Apache-2.0
