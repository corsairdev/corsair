# @corsair-dev/brevo

Brevo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/brevo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `brevo.api.account.get` | `read` | Get Brevo account details, plans, and relay settings |
| `contacts.create` | `brevo.api.contacts.create` | `write` | Create a new Brevo contact |
| `contacts.delete` | `brevo.api.contacts.delete` | `destructive` | Delete a Brevo contact [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.get` | `brevo.api.contacts.get` | `read` | Get a Brevo contact by ID or email identifier |
| `contacts.list` | `brevo.api.contacts.list` | `read` | List Brevo contacts with filtering and pagination |
| `contacts.update` | `brevo.api.contacts.update` | `write` | Update an existing Brevo contact by ID or email identifier |
| `emailCampaigns.create` | `brevo.api.emailCampaigns.create` | `write` | Create a new Brevo email campaign |
| `emailCampaigns.delete` | `brevo.api.emailCampaigns.delete` | `destructive` | Delete a Brevo email campaign [DESTRUCTIVE · IRREVERSIBLE] |
| `emailCampaigns.get` | `brevo.api.emailCampaigns.get` | `read` | Get a Brevo email campaign by campaign ID |
| `emailCampaigns.list` | `brevo.api.emailCampaigns.list` | `read` | List Brevo email campaigns with filtering and pagination |
| `emailCampaigns.sendNow` | `brevo.api.emailCampaigns.sendNow` | `destructive` | Send a Brevo email campaign immediately |
| `emailCampaigns.sendTest` | `brevo.api.emailCampaigns.sendTest` | `write` | Send a test email for a Brevo email campaign |
| `emailCampaigns.update` | `brevo.api.emailCampaigns.update` | `write` | Update an existing Brevo email campaign |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/brevo

## License

Apache-2.0
