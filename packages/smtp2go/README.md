# @corsair-dev/smtp2go

SMTP2GO transactional email plugin for Corsair - send individual, batch and MIME emails, search sent email and activity, manage suppressions, sender domains, templates and webhook registrations, and read sending stats. It does not receive webhook deliveries.

## Install

```bash
pnpm add @corsair-dev/smtp2go
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activity.search` | `smtp2go.api.activity.search` | `read` | Search delivery activity events (processed, delivered, bounced, opened, clicked and more) by date, address and event type; limited to 100 returned items per call |
| `domains.add` | `smtp2go.api.domains.add` | `write` | Add a sender domain and get the DNS records to publish; verification starts right away unless auto_verify is false |
| `domains.list` | `smtp2go.api.domains.list` | `read` | List sender domains with DKIM and return-path verification state and tracking subdomains |
| `domains.remove` | `smtp2go.api.domains.remove` | `destructive` | Remove a sender domain; mail from it stops being accepted and it must be added and verified again |
| `domains.verify` | `smtp2go.api.domains.verify` | `write` | Run verification for one sender domain now instead of waiting for the periodic re-check |
| `email.cancelScheduled` | `smtp2go.api.email.cancelScheduled` | `destructive` | Cancel one queued scheduled email by schedule_id; the message will not be sent and must be scheduled again to go out |
| `email.searchScheduled` | `smtp2go.api.email.searchScheduled` | `read` | List emails queued by a schedule, filtered by schedule_id, subject, sender or recipient |
| `email.searchSent` | `smtp2go.api.email.searchSent` | `read` | Search sent emails by date, recipient, sender, subject or email_id, with opens, clicks, delivery status and a continue_token for the next page |
| `email.send` | `smtp2go.api.email.send` | `write` | Send one email to up to 100 recipients, with HTML or plain text, a template, attachments, custom headers, or a schedule up to 3 days out; the result counts succeeded and failed recipients at HTTP 200, so check failed, not the status |
| `email.sendBatch` | `smtp2go.api.email.sendBatch` | `write` | Send up to 1000 independent messages in one call; the answer carries one email_id or schedule_id entry per message |
| `email.sendMime` | `smtp2go.api.email.sendMime` | `write` | Send one pre-encoded MIME message, with the same per-recipient succeeded/failed accounting as email.send |
| `stats.bounces` | `smtp2go.api.stats.bounces` | `read` | Read bounce counts (hard, soft, rejects) over the last 30 days or a given window, per SMTP user or account-wide |
| `stats.cycle` | `smtp2go.api.stats.cycle` | `read` | Read the current billing cycle: emails sent, remaining and the plan cap |
| `stats.history` | `smtp2go.api.stats.history` | `read` | Read per-recipient sending history rows with volumes, bounces, opens, clicks and spam reports for a date range |
| `stats.spam` | `smtp2go.api.stats.spam` | `read` | Read spam-complaint counts over the last 30 days or a given window |
| `stats.summary` | `smtp2go.api.stats.summary` | `read` | Read one combined report: billing cycle usage, bounces, spam, unsubscribes, opens and clicks |
| `stats.unsubscribes` | `smtp2go.api.stats.unsubscribes` | `read` | Read unsubscribe counts over the last 30 days or a given window |
| `suppressions.add` | `smtp2go.api.suppressions.add` | `write` | Block future sends to one email address, optionally scoped to a subaccount |
| `suppressions.list` | `smtp2go.api.suppressions.list` | `read` | List suppressed addresses with their block reasons, filtered by address, block type or date, with a continue_token for the next page |
| `suppressions.remove` | `smtp2go.api.suppressions.remove` | `destructive` | Lift the given block types for one email address, reporting per reason whether it was removed |
| `templates.add` | `smtp2go.api.templates.add` | `write` | Create a template; the caller picks the template id, subject and both HTML and text bodies are required |
| `templates.delete` | `smtp2go.api.templates.delete` | `destructive` | Delete a template by id; the answer's data carries a confirmation string |
| `templates.edit` | `smtp2go.api.templates.edit` | `write` | Change a template by id, optionally moving it to a new id |
| `templates.list` | `smtp2go.api.templates.list` | `read` | List email templates by name or tag, one page of 100 at a time with a continue_token |
| `templates.view` | `smtp2go.api.templates.view` | `read` | Read one template with its subject, HTML and text bodies, tags and variables |
| `webhooks.add` | `smtp2go.api.webhooks.add` | `write` | Register a webhook URL for chosen email (or SMS) events, in form or JSON output, with optional auth headers |
| `webhooks.edit` | `smtp2go.api.webhooks.edit` | `write` | Change a webhook registration by id, including its event list, URL or disabled state |
| `webhooks.list` | `smtp2go.api.webhooks.list` | `read` | Read the account webhook registration with its events, output format and auth header settings |
| `webhooks.remove` | `smtp2go.api.webhooks.remove` | `destructive` | Remove a webhook registration by id; deliveries to that URL stop |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/smtp2go

## License

Apache-2.0
