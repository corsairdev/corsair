# @corsair-dev/stannp

Direct mail with Stannp - send postcards, letters and SMS, manage recipients, groups and campaigns, validate addresses, read delivery reporting and receive mailpiece and campaign webhooks. Webhook deliveries are verified, not just registered.

## Install

```bash
pnpm add @corsair-dev/stannp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `stannp.api.account.balance` | `read` | Read the account balance |
| `account.topup` | `stannp.api.account.topup` | `write` | Top up the account balance from the saved card; the amount is charged for real |
| `addresses.validate` | `stannp.api.addresses.validate` | `read` | Validate a UK or US postal address and get the corrected form with a validity flag |
| `campaigns.approve` | `stannp.api.campaigns.approve` | `write` | Approve a campaign, locking its design and recipient selection; the lock cannot be undone |
| `campaigns.availableDates` | `stannp.api.campaigns.availableDates` | `read` | List the dates a campaign can be booked for |
| `campaigns.book` | `stannp.api.campaigns.book` | `write` | Book a campaign for dispatch on a date, paying from the balance; this starts a real mailing |
| `campaigns.cost` | `stannp.api.campaigns.cost` | `read` | Price a campaign: per-piece rates and totals for validated, non-validated and international recipients |
| `campaigns.create` | `stannp.api.campaigns.create` | `write` | Create a campaign for a group from a template, copied design or uploaded artwork; nothing sends until it is booked |
| `campaigns.delete` | `stannp.api.campaigns.delete` | `destructive` | Permanently delete a campaign that has not been booked; this cannot be undone |
| `campaigns.get` | `stannp.api.campaigns.get` | `read` | Get one campaign by id |
| `campaigns.list` | `stannp.api.campaigns.list` | `read` | List campaigns with status, recipient counts and cost |
| `campaigns.sample` | `stannp.api.campaigns.sample` | `write` | Produce a PDF sample of the campaign; the link is valid for 30 minutes |
| `events.create` | `stannp.api.events.create` | `write` | Record an event against a recipient for tracking, conversions and automation triggers |
| `files.createFolder` | `stannp.api.files.createFolder` | `write` | Create a folder in the secure file transfer area |
| `files.listFolders` | `stannp.api.files.listFolders` | `read` | List the folders in the secure file transfer area |
| `files.upload` | `stannp.api.files.upload` | `write` | Upload a file by URL into the secure file transfer area |
| `groups.addRecipients` | `stannp.api.groups.addRecipients` | `write` | Add recipients to a group |
| `groups.calculate` | `stannp.api.groups.calculate` | `write` | Recalculate a group so its statistics are up to date |
| `groups.create` | `stannp.api.groups.create` | `write` | Create a new empty mailing group |
| `groups.delete` | `stannp.api.groups.delete` | `destructive` | Delete a mailing group; with delete_recipients the recipients are deleted account-wide, which cannot be undone |
| `groups.list` | `stannp.api.groups.list` | `read` | List mailing groups with recipient counts and import progress, paged with offset and limit |
| `groups.purge` | `stannp.api.groups.purge` | `destructive` | Remove every recipient from a group; with delete_recipients the recipients are deleted account-wide, which cannot be undone |
| `groups.removeRecipients` | `stannp.api.groups.removeRecipients` | `write` | Remove recipients from a group; the recipients stay on the account |
| `letters.cancel` | `stannp.api.letters.cancel` | `write` | Cancel a letter that has not started processing yet |
| `letters.create` | `stannp.api.letters.create` | `write` | Create and mail a letter merged from a template or PDF; test mode renders a PDF proof without posting or charging |
| `letters.get` | `stannp.api.letters.get` | `read` | Get one letter mailpiece with its status, tracking and cost |
| `letters.post` | `stannp.api.letters.post` | `write` | Post an already mail-merged letter PDF whose address the API reads with OCR |
| `postcards.cancel` | `stannp.api.postcards.cancel` | `write` | Cancel a postcard that has not started processing yet |
| `postcards.create` | `stannp.api.postcards.create` | `write` | Create and mail a postcard to one recipient; test mode renders a PDF proof without posting or charging |
| `postcards.get` | `stannp.api.postcards.get` | `read` | Get one postcard mailpiece with its status, tracking and cost |
| `recipients.create` | `stannp.api.recipients.create` | `write` | Create a recipient, optionally into a group, with duplicate handling and custom fields |
| `recipients.delete` | `stannp.api.recipients.delete` | `destructive` | Permanently delete a recipient from the account; this cannot be undone |
| `recipients.get` | `stannp.api.recipients.get` | `read` | Get one recipient by id |
| `recipients.import` | `stannp.api.recipients.import` | `write` | Import a CSV or XLS data file into a group, with column remapping and duplicate handling |
| `recipients.list` | `stannp.api.recipients.list` | `read` | List recipients with their addresses and blacklist flag, filtered by group and paged with offset and limit |
| `reporting.list` | `stannp.api.reporting.list` | `read` | List mailpieces in a date range, optionally filtered by status or tag |
| `reporting.summary` | `stannp.api.reporting.summary` | `read` | Count mailpieces per delivery status within a date range |
| `selections.create` | `stannp.api.selections.create` | `write` | Create an auto-filter selection that targets a subset of a group |
| `sms.create` | `stannp.api.sms.create` | `write` | Send an SMS to a phone number or stored recipient; test mode builds it without sending or charging |
| `tools.pdfMerge` | `stannp.api.tools.pdfMerge` | `read` | Merge several PDFs by URL into one file |
| `tools.templates` | `stannp.api.tools.templates` | `read` | List the design templates on the account |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/stannp

## License

Apache-2.0
