# @corsair-dev/unione

Unione plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/unione
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `domain.delete` | `unione.api.domain.delete` | `destructive` | Tool to delete a sender domain from the account. Use only when you are certain: the domain must be re-added and re-verified to send from it again. |
| `domain.manage` | `unione.api.domain.manage` | `write` | Tool to inspect and verify sender domains: fetch DNS records, trigger a verification or DKIM check, or list domains. Deleting a domain is a separate tool. |
| `email.list` | `unione.api.email.list` | `write` | Tool to start an export of email events in a time range. Creates an asynchronous event dump and returns a dump_id; poll eventDump.get for the download URLs. It does not return events directly. |
| `email.schedule` | `unione.api.email.schedule` | `write` | Tool to send a transactional email at a future time, at most 24 hours ahead. Same as email.send plus a send_at timestamp. |
| `email.send` | `unione.api.email.send` | `write` | Tool to send a transactional email immediately. Requires recipients, from_email, subject, and either a body or a template_id. |
| `email.statistics` | `unione.api.email.statistics` | `write` | Tool to start a per-day aggregate export of send statistics. Creates an asynchronous event dump and returns a dump_id; poll eventDump.get for the result. It does not return statistics directly. |
| `email.subscribe` | `unione.api.email.subscribe` | `write` | Tool to resubscribe a recipient who previously unsubscribed. Use when you need to restore a user subscription status after they opt in again. |
| `email.unsubscribe` | `unione.api.email.unsubscribe` | `write` | Tool to unsubscribe an email from future emails. Use when you need to stop all further transactional emails. |
| `emailValidation.batch` | `unione.api.emailValidation.batch` | `read` | Tool to validate a list of email addresses. UniOne has no bulk method, so each address costs one validation from the account quota. Addresses that fail are returned with status "error" rather than failing the whole batch. |
| `eventDump.create` | `unione.api.eventDump.create` | `write` | Tool to create an asynchronous CSV event dump. Use when you need to export transactional email events for a specified time window. |
| `eventDump.createForJob` | `unione.api.eventDump.createForJob` | `write` | Tool to export the delivery events of one send job. UniOne has no method that reads a job directly, so this creates an event dump filtered by job_id and returns a dump_id to poll with eventDump.get. |
| `eventDump.delete` | `unione.api.eventDump.delete` | `destructive` | Tool to delete an event dump file and remove it from the queue or storage. Use when you need to clean up an existing event dump by its dump_id. |
| `eventDump.get` | `unione.api.eventDump.get` | `read` | Tool to retrieve the status and download URLs of an event dump. Use when you need to check if a dump is ready and get its files. |
| `eventDump.list` | `unione.api.eventDump.list` | `read` | Tool to retrieve the full list of event dumps. Use when you need to view all existing event-dump tasks. |
| `suppression.delete` | `unione.api.suppression.delete` | `write` | Tool to remove an email from the suppression list. Use when you need to re-enable sending emails to an address that was previously unsubscribed or suppressed. |
| `suppression.get` | `unione.api.suppression.get` | `read` | Tool to check if an email is suppressed and retrieve the reason and date. Use when verifying why an email cannot receive messages. |
| `suppression.list` | `unione.api.suppression.list` | `read` | Tool to return the suppression list since a given date. Use when auditing bounced, unsubscribed, or blocked recipients. |
| `system.info` | `unione.api.system.info` | `read` | Tool to retrieve account details and the current billing period: emails included and sent, validations included and used. Use before sending large campaigns. |
| `system.ping` | `unione.api.system.ping` | `read` | Tool to check API connectivity and that the API key is accepted. Use as a health check before a batch of operations. |
| `tag.delete` | `unione.api.tag.delete` | `destructive` | Tool to delete a specific tag. Use when you have confirmed the tag ID you wish to remove. |
| `tag.list` | `unione.api.tag.list` | `read` | Tool to retrieve all user-defined tags. Use when you need to fetch the full list of tags after authentication. |
| `template.delete` | `unione.api.template.delete` | `destructive` | Tool to delete a template by ID. Use when you need to permanently remove a template from the account. |
| `template.get` | `unione.api.template.get` | `read` | Tool to get template properties by ID. Use when you need to retrieve the full template configuration and content for a specific template. |
| `template.list` | `unione.api.template.list` | `read` | Tool to list email templates. Use when you need to retrieve available templates for transactional emails. |
| `template.set` | `unione.api.template.set` | `write` | Tool to set or update an email template. Use when you need to create or modify transactional email templates before sending messages. |
| `webhook.delete` | `unione.api.webhook.delete` | `destructive` | Tool to delete a webhook event notification handler by its URL. Use when you need to stop receiving callback notifications for a specific webhook. |
| `webhook.get` | `unione.api.webhook.get` | `read` | Tool to retrieve webhook configuration by its URL. Use when you need to check the current settings of an event notification handler. |
| `webhook.list` | `unione.api.webhook.list` | `read` | Tool to list every webhook configured on the account. Use when you need to see all event notification handlers and their settings. |
| `webhook.set` | `unione.api.webhook.set` | `write` | Tool to set or edit a webhook event notification handler. Use when you need to configure your webhook for event callbacks. |
| `webhook.types` | `unione.api.webhook.types` | `read` | Tool to list the event names accepted by webhook.set. Returns a static list published in the UniOne callback docs; it makes no API call. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/unione

## License

Apache-2.0
