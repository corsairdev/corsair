# @corsair-dev/passcreator

Passcreator is a wallet pass platform for Apple and Google Wallet. This plugin creates and updates passes from templates, sends passes by email, pushes notifications, reads pass statistics, copies templates, moves passes between templates (API v2), and manages webhook subscriptions whose deliveries are ECDSA-verified.

## Install

```bash
pnpm add @corsair-dev/passcreator
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `passes.activeHistory` | `passcreator.api.passes.activeHistory` | `read` | Read the history of active and inactive passes of a template |
| `passes.create` | `passcreator.api.passes.create` | `write` | Create a pass from a pass template with personalised properties |
| `passes.delete` | `passcreator.api.passes.delete` | `destructive` | Delete a pass |
| `passes.enableDownload` | `passcreator.api.passes.enableDownload` | `write` | Enable the download of a pass |
| `passes.get` | `passcreator.api.passes.get` | `read` | Read one pass by UID, barcode value or user-provided ID |
| `passes.list` | `passcreator.api.passes.list` | `read` | List the passes of a pass template, paged by cursor and date |
| `passes.pushNotification` | `passcreator.api.passes.pushNotification` | `destructive` | Push a notification message to one pass holder; the message goes out and cannot be recalled |
| `passes.search` | `passcreator.api.passes.search` | `read` | Search the passes of a template by content |
| `passes.sendEmail` | `passcreator.api.passes.sendEmail` | `destructive` | Send the pass to an email address; the email goes out and cannot be recalled |
| `passes.statistics` | `passcreator.api.passes.statistics` | `read` | Read pass usage statistics of a template by day, week or month |
| `passes.update` | `passcreator.api.passes.update` | `write` | Update pass properties or mark the pass voided or not voided |
| `passes.uris` | `passcreator.api.passes.uris` | `read` | Read the resource URIs of a pass |
| `templates.copy` | `passcreator.api.templates.copy` | `write` | Copy a pass template |
| `templates.delete` | `passcreator.api.templates.delete` | `destructive` | Delete a pass template; the API refuses when scheduled tasks exist |
| `templates.fields` | `passcreator.api.templates.fields` | `read` | Read the required and optional fields of a pass template |
| `templates.list` | `passcreator.api.templates.list` | `read` | List all pass templates of the account |
| `templates.movePass` | `passcreator.api.templates.movePass` | `write` | Move a pass to a different template of the same project (API v2) |
| `webhooks.getPublicKey` | `passcreator.api.webhooks.getPublicKey` | `read` | Read the PEM public key that verifies webhook payload signatures |
| `webhooks.list` | `passcreator.api.webhooks.list` | `read` | List the active webhook subscriptions, including pull-mode entries |
| `webhooks.subscribe` | `passcreator.api.webhooks.subscribe` | `write` | Subscribe a URL to a webhook event, optionally scoped to one template |
| `webhooks.unsubscribe` | `passcreator.api.webhooks.unsubscribe` | `destructive` | Unsubscribe a webhook; deliveries stop until it is subscribed again |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/passcreator

## License

Apache-2.0
