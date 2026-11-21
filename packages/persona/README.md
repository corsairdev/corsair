# @corsair-dev/persona

Persona is an identity verification and KYC platform. This plugin manages accounts and inquiries, approves or declines inquiries, runs inquiry sessions, reads templates, configures webhooks with signing-secret rotation, and verifies inbound webhook deliveries with HMAC-SHA256.

## Install

```bash
pnpm add @corsair-dev/persona
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.addTag` | `persona.api.accounts.addTag` | `write` | Add a tag to an account |
| `accounts.create` | `persona.api.accounts.create` | `write` | Create an account |
| `accounts.get` | `persona.api.accounts.get` | `read` | Read one account by id |
| `accounts.list` | `persona.api.accounts.list` | `read` | List accounts, filtered by reference id, page by page |
| `accounts.redact` | `persona.api.accounts.redact` | `destructive` | Redact an account; the data is permanently removed |
| `accounts.removeTag` | `persona.api.accounts.removeTag` | `write` | Remove a tag from an account |
| `accounts.search` | `persona.api.accounts.search` | `read` | Search accounts with a predicate query |
| `accounts.update` | `persona.api.accounts.update` | `write` | Update an account's attributes, status or tags |
| `inquiries.addTag` | `persona.api.inquiries.addTag` | `write` | Add a tag to an inquiry |
| `inquiries.approve` | `persona.api.inquiries.approve` | `destructive` | Approve an inquiry; the decision is final and runs any approval workflow |
| `inquiries.create` | `persona.api.inquiries.create` | `write` | Create an inquiry from a template |
| `inquiries.decline` | `persona.api.inquiries.decline` | `destructive` | Decline an inquiry; the decision is final |
| `inquiries.generateOneTimeLink` | `persona.api.inquiries.generateOneTimeLink` | `write` | Generate a one-time link for an inquiry; anyone with the link can resume it |
| `inquiries.get` | `persona.api.inquiries.get` | `read` | Read one inquiry by id |
| `inquiries.list` | `persona.api.inquiries.list` | `read` | List inquiries filtered by status, account, reference or template |
| `inquiries.markForReview` | `persona.api.inquiries.markForReview` | `write` | Mark an inquiry for manual review |
| `inquiries.redact` | `persona.api.inquiries.redact` | `destructive` | Redact an inquiry; the data is permanently removed |
| `inquiries.removeTag` | `persona.api.inquiries.removeTag` | `write` | Remove a tag from an inquiry |
| `inquiries.update` | `persona.api.inquiries.update` | `write` | Update inquiry attributes |
| `inquirySessions.create` | `persona.api.inquirySessions.create` | `write` | Create a session for an inquiry |
| `inquirySessions.expire` | `persona.api.inquirySessions.expire` | `write` | Expire one inquiry session |
| `inquirySessions.expireAll` | `persona.api.inquirySessions.expireAll` | `destructive` | Expire every session of the given inquiries |
| `inquirySessions.generateOneTimeLink` | `persona.api.inquirySessions.generateOneTimeLink` | `write` | Generate a one-time link for an inquiry session |
| `inquirySessions.get` | `persona.api.inquirySessions.get` | `read` | Read one inquiry session |
| `inquiryTemplates.get` | `persona.api.inquiryTemplates.get` | `read` | Read one inquiry template |
| `inquiryTemplates.list` | `persona.api.inquiryTemplates.list` | `read` | List the inquiry templates |
| `inquiryTemplates.listVersions` | `persona.api.inquiryTemplates.listVersions` | `read` | List the versions of one inquiry template |
| `webhooks.archive` | `persona.api.webhooks.archive` | `destructive` | Archive a webhook; archived webhooks cannot be re-enabled |
| `webhooks.create` | `persona.api.webhooks.create` | `write` | Create a webhook; the answer carries its signing secret |
| `webhooks.disable` | `persona.api.webhooks.disable` | `write` | Disable a webhook; deliveries stop until it is enabled again |
| `webhooks.enable` | `persona.api.webhooks.enable` | `write` | Enable a webhook |
| `webhooks.get` | `persona.api.webhooks.get` | `read` | Read one webhook |
| `webhooks.list` | `persona.api.webhooks.list` | `read` | List the webhooks |
| `webhooks.rotateSecret` | `persona.api.webhooks.rotateSecret` | `destructive` | Rotate the webhook signing secret; the old one stops signing once its window ends |
| `webhooks.searchEvents` | `persona.api.webhooks.searchEvents` | `read` | Search recorded webhook events |
| `webhooks.update` | `persona.api.webhooks.update` | `write` | Update a webhook URL, name or subscribed events |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/persona

## License

Apache-2.0
