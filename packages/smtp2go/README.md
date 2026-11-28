# @corsair-dev/smtp2go

SMTP2GO for Corsair: send email and SMS, search sent email and activity, manage suppressions, domains, senders, templates, webhooks, API keys, SMTP users and subaccounts, read stats, and receive email and SMS webhook events.

## Install

```bash
pnpm add @corsair-dev/smtp2go
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activity.search` | `smtp2go.api.activity.search` | `read` | Search delivery activity events (processed, delivered, bounced, opened, clicked and more) by date, address and event type; limited to 100 returned items per call |
| `allowedRecipients.add` | `smtp2go.api.allowedRecipients.add` | `write` | Add allowed recipients: add one or more email addresses and domain names to your Allowed Recipients List. Further details of the associated setting are found in the SMTP2GO Guides. |
| `allowedRecipients.list` | `smtp2go.api.allowedRecipients.list` | `read` | View allowed recipients: returns the email addresses and domain names on your Allowed Recipients list. |
| `allowedRecipients.remove` | `smtp2go.api.allowedRecipients.remove` | `write` | Remove allowed recipients: remove one or more emails addresses or domain names stored in your Allowed Recipients List. Note: In the event that any of the email addresses or domains do not feature… |
| `allowedRecipients.update` | `smtp2go.api.allowedRecipients.update` | `write` | Update allowed recipients: replace the email addresses and domain names on your Allowed Recipients List using this endpoint. Further details of these modes are found in the SMPT2GO Guides. Note… (replaces the whole list) |
| `allowedSenders.add` | `smtp2go.api.allowedSenders.add` | `write` | Add allowed senders: add one or more email addresses and domain names to your Allowed or Restricted Senders List. How this list of email addresses and domain names are used is shown by the… |
| `allowedSenders.list` | `smtp2go.api.allowedSenders.list` | `read` | View allowed senders: returns the email addresses and domain names on your Allowed or Restricted Senders list, as well as the Restrict Senders setting, which dictates how they are interpreted. |
| `allowedSenders.remove` | `smtp2go.api.allowedSenders.remove` | `write` | Remove allowed senders: remove one or more emails addresses or domain names stored in your Allowed or Restricted Senders List. Note: In the event that any of the email addresses or domains do… |
| `allowedSenders.update` | `smtp2go.api.allowedSenders.update` | `write` | Update allowed senders: replace the email addresses and domain names on your Allowed or Restricted Senders List using this endpoint. How the email addresses and domain names are used is… (replaces the whole list) |
| `apiKeys.add` | `smtp2go.api.apiKeys.add` | `destructive` | Add a new API key: add a new API key to your accountThis endpoint is rate-limited to 5 requests per minute. (mints a new credential) |
| `apiKeys.edit` | `smtp2go.api.apiKeys.edit` | `write` | Edit an API key: edit an existing API key |
| `apiKeys.list` | `smtp2go.api.apiKeys.list` | `read` | View API Keys: retrieve a list of API keys on this account |
| `apiKeys.patch` | `smtp2go.api.apiKeys.patch` | `write` | Patch an API key: patch an existing API key ignoring missing properties |
| `apiKeys.permissions` | `smtp2go.api.apiKeys.permissions` | `read` | View Permissions: retrieve a list of endpoints this API Key can use. This endpoint is available to all API Keys. |
| `apiKeys.remove` | `smtp2go.api.apiKeys.remove` | `destructive` | Remove an API key: remove an existing API key (revokes the key) |
| `archive.getEmail` | `smtp2go.api.archive.getEmail` | `read` | View an archived email: fetch an archived email using the email_id |
| `archive.search` | `smtp2go.api.archive.search` | `read` | Search archived content: retrieve a list of up to 5,000 archived emails matching the supplied parameters. |
| `dedicatedIps.list` | `smtp2go.api.dedicatedIps.list` | `read` | View Dedicated IP Addresses: retrieve a list of Dedicated IP addresses on this account |
| `domains.add` | `smtp2go.api.domains.add` | `write` | Add a sender domain and get the DNS records to publish; verification starts right away unless auto_verify is false |
| `domains.editReturnPath` | `smtp2go.api.domains.editReturnPath` | `write` | Edit the return-path subdomain: a Return Path Subdomain is used to instruct the server where to return emails that are not deliverable (ie. Bounces). This endpoint allows you to edit a Return Path… |
| `domains.editSubaccountAccess` | `smtp2go.api.domains.editSubaccountAccess` | `write` | Edit subaccount access: allow subaccounts to send from verified sender domains on the master account. |
| `domains.editTracking` | `smtp2go.api.domains.editTracking` | `write` | Edit the tracking subdomain: a Tracking Subdomain is used to monitor your email opens and clicks. This endpoint allows you to edit a tracking subdomain for a particular sender domain. Full details… |
| `domains.list` | `smtp2go.api.domains.list` | `read` | List sender domains with DKIM and return-path verification state and tracking subdomains |
| `domains.remove` | `smtp2go.api.domains.remove` | `destructive` | Remove a sender domain; mail from it stops being accepted and it must be added and verified again |
| `domains.verify` | `smtp2go.api.domains.verify` | `write` | Run verification for one sender domain now instead of waiting for the periodic re-check |
| `email.cancelScheduled` | `smtp2go.api.email.cancelScheduled` | `destructive` | Cancel one queued scheduled email by schedule_id; the message will not be sent and must be scheduled again to go out |
| `email.searchScheduled` | `smtp2go.api.email.searchScheduled` | `read` | List emails queued by a schedule, filtered by schedule_id, subject, sender or recipient |
| `email.searchSent` | `smtp2go.api.email.searchSent` | `read` | Search sent emails by date, recipient, sender, subject or email_id, with opens, clicks, delivery status and a continue_token for the next page |
| `email.send` | `smtp2go.api.email.send` | `destructive` | Send one email to up to 100 recipients, with HTML or plain text, a template, attachments, custom headers, or a schedule up to 3 days out; the result counts succeeded and failed recipients at HTTP 200, so check failed, not the status |
| `email.sendBatch` | `smtp2go.api.email.sendBatch` | `destructive` | Send up to 1000 independent messages in one call; the answer carries one email_id or schedule_id entry per message |
| `email.sendMime` | `smtp2go.api.email.sendMime` | `destructive` | Send one pre-encoded MIME message, with the same per-recipient succeeded/failed accounting as email.send |
| `ipAuth.list` | `smtp2go.api.ipAuth.list` | `read` | View IP Auth: returns a list of all IP Auth entries that are managed by this account, or details of a specific IP Auth, when you include the [ip_address] in your request. If no… |
| `ipAuth.patch` | `smtp2go.api.ipAuth.patch` | `write` | Patch an IP Auth: patch an existing IP Auth ignoring missing properties |
| `ipAuth.remove` | `smtp2go.api.ipAuth.remove` | `destructive` | Remove an IP Auth entry: remove an IP Auth entry from your account (the IP can no longer send) |
| `singleSenders.add` | `smtp2go.api.singleSenders.add` | `destructive` | Add a single sender email: use the API to add a single sender email address to your account, to use from which to send mail. If the email address has previously been added and not yet verified,… (emails a verification link to the address) |
| `singleSenders.list` | `smtp2go.api.singleSenders.list` | `read` | View single sender emails: returns a list of single sender email addresses on your account, along with their verification status. If you include a email_address, the response will only include… |
| `singleSenders.remove` | `smtp2go.api.singleSenders.remove` | `destructive` | Remove a single sender email: remove a single sender email address from your account. Include the address to remove as the email_address parameter. (the address must be verified again) |
| `sms.listReceived` | `smtp2go.api.sms.listReceived` | `read` | View received SMS: view received SMS messages. |
| `sms.listSent` | `smtp2go.api.sms.listSent` | `read` | View sent SMS: view sent SMS messages. |
| `sms.send` | `smtp2go.api.sms.send` | `destructive` | Send SMS: send an SMS message to one or more numbers, up to a maximum of 100 numbers. (sends text messages and spends SMS credit) |
| `sms.summary` | `smtp2go.api.sms.summary` | `read` | SMS Summary: retrieve a summary of SMS messages within a certain time range. |
| `smtpUsers.add` | `smtp2go.api.smtpUsers.add` | `write` | Add an SMTP user: add a new SMTP user to your account. Full details of the available options for new user accounts can be found in the SMTP User Guide. |
| `smtpUsers.edit` | `smtp2go.api.smtpUsers.edit` | `write` | Edit SMTP user details: update an SMTP user's details with the parameters passed. Full details of the available options for SMTP user accounts is found in the SMTP User Guide. |
| `smtpUsers.list` | `smtp2go.api.smtpUsers.list` | `read` | View SMTP users: returns a list of all SMTP users that are managed by this account, or details of a specific user, when you include the [username] in your request. If no users are… |
| `smtpUsers.patch` | `smtp2go.api.smtpUsers.patch` | `write` | Patch an SMTP user: patch an existing SMTP user ignoring missing properties |
| `smtpUsers.remove` | `smtp2go.api.smtpUsers.remove` | `destructive` | Remove an SMTP user: remove an SMTP user from your account (deletes the SMTP login) |
| `stats.bounces` | `smtp2go.api.stats.bounces` | `read` | Read bounce counts (hard, soft, rejects) over the last 30 days or a given window, per SMTP user or account-wide |
| `stats.cycle` | `smtp2go.api.stats.cycle` | `read` | Read the current billing cycle: emails sent, remaining and the plan cap |
| `stats.history` | `smtp2go.api.stats.history` | `read` | Read per-recipient sending history rows with volumes, bounces, opens, clicks and spam reports for a date range |
| `stats.spam` | `smtp2go.api.stats.spam` | `read` | Read spam-complaint counts over the last 30 days or a given window |
| `stats.summary` | `smtp2go.api.stats.summary` | `read` | Read one combined report: billing cycle usage, bounces, spam, unsubscribes, opens and clicks |
| `stats.unsubscribes` | `smtp2go.api.stats.unsubscribes` | `read` | Read unsubscribe counts over the last 30 days or a given window |
| `subaccounts.add` | `smtp2go.api.subaccounts.add` | `write` | Add a subaccount: adds a new subaccount on your master account. Note: This end-point is rate limited to 50 calls per hour. |
| `subaccounts.close` | `smtp2go.api.subaccounts.close` | `destructive` | Close a subaccount: changes the status of an Active subaccount to Closed (stops the subaccount sending) |
| `subaccounts.edit` | `smtp2go.api.subaccounts.edit` | `write` | Update a subaccount: changes the details on an existing subaccount |
| `subaccounts.reopen` | `smtp2go.api.subaccounts.reopen` | `write` | Reopen a closed subaccount: changes the status of a Closed subaccount back to Active |
| `subaccounts.search` | `smtp2go.api.subaccounts.search` | `read` | View subaccounts: returns any subaccounts that match search criteria |
| `suppressions.add` | `smtp2go.api.suppressions.add` | `write` | Block future sends to one email address, optionally scoped to a subaccount |
| `suppressions.list` | `smtp2go.api.suppressions.list` | `read` | List suppressed addresses with their block reasons, filtered by address, block type or date, with a continue_token for the next page |
| `suppressions.remove` | `smtp2go.api.suppressions.remove` | `destructive` | Lift the given block types for one email address, reporting per reason whether it was removed |
| `templates.add` | `smtp2go.api.templates.add` | `write` | Create a template; the caller picks the template id, subject and both HTML and text bodies are required |
| `templates.delete` | `smtp2go.api.templates.delete` | `destructive` | Delete a template by id; the answer's data carries a confirmation string |
| `templates.edit` | `smtp2go.api.templates.edit` | `write` | Change a template by id, optionally moving it to a new id |
| `templates.list` | `smtp2go.api.templates.list` | `read` | List email templates by name or tag, one page of 100 at a time with a continue_token |
| `templates.view` | `smtp2go.api.templates.view` | `read` | Read one template with its subject, HTML and text bodies, tags and variables |
| `webhooks.add` | `smtp2go.api.webhooks.add` | `write` | Register a webhook URL for chosen email (or SMS) events, in form or JSON output, with optional auth headers |
| `webhooks.edit` | `smtp2go.api.webhooks.edit` | `write` | Change a webhook registration by id; the edit replaces its settings, so pass url every time and auth_header_type/auth_header_value again or the Authorization header is dropped |
| `webhooks.list` | `smtp2go.api.webhooks.list` | `read` | Read the account webhook registration with its events, output format and auth header settings |
| `webhooks.remove` | `smtp2go.api.webhooks.remove` | `destructive` | Remove a webhook registration by id; deliveries to that URL stop |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/smtp2go

## License

Apache-2.0
