# @corsair-dev/replyio

Corsair plugin for the [Reply.io API v3](https://docs.reply.io/api-reference/introduction)
(`https://api.reply.io/v3`).

## Auth setup

API-key only.

1. Create a key in Reply.io → **Settings → API Key**
2. Set `REPLY_IO_API_KEY` in your environment, or pass the key via Corsair credentials

Credentials are sent as `Authorization: Bearer <key>` on every request.

Missing credentials throw `AuthMissingError` (never an empty string).

## Endpoint overview

| Operation | Reply.io path | Description |
|-----------|---------------|-------------|
| `contacts.create` | `POST /contacts` | Create a new contact |
| `contacts.get` | `GET /contacts/{id}` | Get a contact by ID |
| `contacts.update` | `PATCH /contacts/{id}` | Update an existing contact |
| `contacts.delete` | `DELETE /contacts/{id}` | Delete a contact |
| `contacts.list` | `GET /contacts` | List contacts (paginated) |
| `contacts.searchByEmail` | `GET /contacts?email=` | Search contacts by exact email |
| `contacts.getStatus` | `GET /contacts/{id}/statuses` | Get a contact's statuses |
| `contacts.setStatus` | `POST /contacts/set-status-in-sequence` | Set in-sequence status in bulk |
| `contacts.clearStatus` | `POST /contacts/set-opted-out`, `/set-replied`, `/set-bounced` | Clear opt-out / replied / bounced flags |
| `sequences.list` | `GET /sequences` | List sequences (paginated) |
| `sequences.get` | `GET /sequences/{id}` | Get a sequence with settings and steps |
| `sequences.delete` | `DELETE /sequences/{id}` | Delete a sequence |
| `sequences.start` | `POST /sequences/{id}/start` | Start a New/Paused sequence |
| `sequences.pause` | `POST /sequences/{id}/pause` | Pause a running sequence |
| `sequences.archive` | `POST /sequences/{id}/archive` | Archive a sequence |
| `steps.list` | `GET /sequences/{id}/steps` | List all steps in a sequence |
| `steps.get` | `GET /sequences/{id}/steps/{stepId}` | Get a sequence step by ID |
| `steps.create` | `POST /sequences/{id}/steps` | Add an email/call/SMS/task (etc.) step |
| `sequenceContacts.add` | `POST /sequences/{id}/contact-links/bulk` | Add contacts to a sequence |
| `sequenceContacts.remove` | `DELETE /sequences/{id}/contact-links/{contactId}` | Remove a contact from a sequence |
| `sequenceContacts.bulkRemove` | `POST /sequences/{id}/contact-links/bulk-delete` | Bulk-remove contacts from a sequence |
| `sequenceContacts.listExtended` | `GET /sequences/{id}/contacts/state` | Contacts with engagement state |
| `sequenceContacts.setStatus` | `POST /sequences/{id}/contacts/set-status-in-sequence` | Set status for enrollments in that sequence |
| `emailAccounts.list` | `GET /email-accounts` | List email accounts (paginated) |
| `emailAccounts.listDisconnected` | `POST /email-accounts/filter` | Accounts broken by auth/connection errors |
| `emailAccounts.update` | `PATCH /email-accounts/{id}` | Update SMTP/IMAP, safety, signature |
| `emailAccounts.delete` | `DELETE /email-accounts/{id}` | Delete an email account |
| `emailAccounts.connectGmail` | `GET /email-accounts/connect/gmail` | Returns the Gmail OAuth URL to open |
| `emailAccounts.connectOffice365` | `GET /email-accounts/connect/office-365` | Returns the Microsoft OAuth URL to open |
| `schedules.delete` | `DELETE /schedules/{id}` | Delete a sending schedule |
| `users.getCurrent` | `GET /whoami` | Current user; verifies the API key |
| `users.listTeam` | `GET /whoami/team-users` | List users on the team |
| `contactLists.list` | `GET /contact-lists` | List contact lists (paginated) |

No webhooks (not part of the Reply.io surface used by this plugin).

## Quirks & caveats

- **OAuth connect endpoints return a URL, they don't call the API.** `GET
  /email-accounts/connect/*` answers with a `302` to the provider consent
  screen, which a server-side client must not follow and consume — so these
  tools return the connect URL for the user to open in a browser.
- **Reply.io has no Delete User, Generate ULID, or Exchange-OAuth endpoints.**
  Verified against the published OpenAPI spec plus live `404 "Route not
  found"` probes. `connectOffice365` is the documented Microsoft-side
  substitute for Exchange; `users.listTeam` covers team visibility.
- **`204` responses become `{ success: true }`.** Delete/remove endpoints
  return a success envelope since there is no body to validate.
- **`contacts.clearStatus` fans out.** One call maps to up to three API
  calls (opt-out, replied, bounced); failures merge into a single non-atomic
  dictionary keyed by contact id. Bounced is cleared with
  `resendEmails: false` (no step rescheduling).
- **Rate limits are 100 req/min, 3,000 req/hour.** `429` responses honor
  `Retry-After` (client retries + error-handler policy).

## Tests

```bash
pnpm --filter @corsair-dev/replyio test
```

- Schema, client, endpoint-routing, and error-handler tests always run.
- Live API tests (`api.test.ts`, read-only) run only when `REPLY_IO_API_KEY`
  is set, otherwise they skip:

```bash
# PowerShell
$env:REPLY_IO_API_KEY = "usk-..."

# bash
export REPLY_IO_API_KEY=usk-...
```
