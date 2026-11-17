# @corsair-dev/signwell

E-signatures through SignWell: send documents and templates for signature, track each recipient, remind or cancel, and receive document events on a webhook.

## Install

```bash
pnpm add @corsair-dev/signwell
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `signwell.api.account.get` | `read` | Read the account name, logo, plan tier and default sending preferences |
| `account.update` | `signwell.api.account.update` | `write` | Change the account name, logo, time zone, date format or recipient language; only the fields you send are changed |
| `apiApplications.delete` | `signwell.api.apiApplications.delete` | `destructive` | Delete an API application; documents and templates that reference it keep their data but lose its branding and settings |
| `apiApplications.get` | `signwell.api.apiApplications.get` | `read` | Read one API application's name, callback URLs, owner and branding preferences |
| `bulkSends.create` | `signwell.api.bulkSends.create` | `destructive` | Create a bulk send from a CSV of recipient rows against one or more templates; each row becomes a document and is sent |
| `bulkSends.get` | `signwell.api.bulkSends.get` | `read` | Read one bulk send with its status and counts of completed and outstanding documents |
| `bulkSends.getCsvTemplate` | `signwell.api.bulkSends.getCsvTemplate` | `read` | Get the blank CSV, base64 encoded, whose columns match the given templates |
| `bulkSends.getDocuments` | `signwell.api.bulkSends.getDocuments` | `read` | List the documents a bulk send created, page by page, with each document's recipients and status |
| `bulkSends.list` | `signwell.api.bulkSends.list` | `read` | List bulk sends page by page, optionally filtered to one user or API application |
| `bulkSends.validateCsv` | `signwell.api.bulkSends.validateCsv` | `read` | Check a bulk send CSV against its templates without creating anything, and report what SignWell would change |
| `documents.create` | `signwell.api.documents.create` | `destructive` | Create a document from one or more files and send it for signature unless draft is true; this notifies real recipients |
| `documents.createFromTemplate` | `signwell.api.documents.createFromTemplate` | `destructive` | Create a document from one or several templates, filling each placeholder with a recipient, and send it unless draft is true |
| `documents.delete` | `signwell.api.documents.delete` | `destructive` | Delete a document and cancel any signing in progress; the document, its signatures and its audit trail are gone |
| `documents.get` | `signwell.api.documents.get` | `read` | Read one document with its recipients, status, embedded links and metadata |
| `documents.getCompletedPdf` | `signwell.api.documents.getCompletedPdf` | `read` | Get a temporary download URL for a completed document as a PDF or a ZIP; the file itself is not returned |
| `documents.getNom151Certificate` | `signwell.api.documents.getNom151Certificate` | `read` | Get a temporary download URL for the NOM-151 certificate of a completed document, where NOM-151 is enabled |
| `documents.send` | `signwell.api.documents.send` | `destructive` | Send a draft document to its recipients, optionally changing its subject, message and reminders first |
| `documents.sendReminder` | `signwell.api.documents.sendReminder` | `destructive` | Remind recipients who have not signed yet, either everyone or a named list, through their own delivery method |
| `documents.updateAuthentication` | `signwell.api.documents.updateAuthentication` | `write` | Change or add passcodes for recipients on a sent document; only recipients who have not started signing |
| `documents.updateRecipients` | `signwell.api.documents.updateRecipients` | `destructive` | Change the name or email of recipients on a document that has been sent, which emails the updated recipients; only recipients who have not started signing |
| `me.get` | `signwell.api.me.get` | `read` | Read the authenticated user, their role and the account and workspace the API token belongs to |
| `templates.create` | `signwell.api.templates.create` | `write` | Create a reusable template from files and named placeholders that recipients are filled into later |
| `templates.delete` | `signwell.api.templates.delete` | `destructive` | Delete a template; documents already created from it are unaffected, but it cannot be used again |
| `templates.get` | `signwell.api.templates.get` | `read` | Read one template with its placeholders, files and settings |
| `templates.update` | `signwell.api.templates.update` | `write` | Change a template's name, message, placeholders, labels or sending settings |
| `webhooks.create` | `signwell.api.webhooks.create` | `write` | Register a callback URL that SignWell posts document events to; the returned id is the HMAC key for verifying deliveries |
| `webhooks.delete` | `signwell.api.webhooks.delete` | `destructive` | Delete a registered webhook; SignWell stops posting to its URL immediately |
| `webhooks.list` | `signwell.api.webhooks.list` | `read` | List the webhooks registered on the account with their ids and callback URLs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 10 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/signwell

## License

Apache-2.0
