# @corsair-dev/resend

Resend plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/resend
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.create` | `resend.api.contacts.create` | `write` | Create a new contact |
| `contacts.delete` | `resend.api.contacts.delete` | `destructive` | Delete a contact [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.get` | `resend.api.contacts.get` | `read` | Get info about a contact |
| `contacts.list` | `resend.api.contacts.list` | `read` | List all contacts |
| `contacts.update` | `resend.api.contacts.update` | `write` | Update an existing contact |
| `domains.create` | `resend.api.domains.create` | `write` | Add a new sending domain |
| `domains.delete` | `resend.api.domains.delete` | `destructive` | Remove a sending domain [DESTRUCTIVE · IRREVERSIBLE] |
| `domains.get` | `resend.api.domains.get` | `read` | Get info about a sending domain |
| `domains.list` | `resend.api.domains.list` | `read` | List all sending domains |
| `domains.verify` | `resend.api.domains.verify` | `write` | Trigger DNS verification for a domain |
| `emails.batch` | `resend.api.emails.batch` | `write` | Send up to 100 emails in a single API call |
| `emails.cancel` | `resend.api.emails.cancel` | `write` | Cancel a scheduled email |
| `emails.get` | `resend.api.emails.get` | `read` | Get info about a sent email |
| `emails.list` | `resend.api.emails.list` | `read` | List sent emails |
| `emails.send` | `resend.api.emails.send` | `write` | Send an email to one or more recipients |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 16 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/resend

## License

Apache-2.0
