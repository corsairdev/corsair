# @corsair-dev/sendgrid

SendGrid v3 plugin for Corsair (100 REST endpoints).

## Install

```bash
pnpm add @corsair-dev/sendgrid
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.create` | `sendgrid.api.apiKeys.create` | `write` | Create an API key |
| `apiKeys.get` | `sendgrid.api.apiKeys.get` | `read` | Retrieve an API key |
| `apiKeys.getAll` | `sendgrid.api.apiKeys.getAll` | `read` | Retrieve all API keys |
| `apiKeys.remove` | `sendgrid.api.apiKeys.remove` | `write` | Delete an API key |
| `apiKeys.update` | `sendgrid.api.apiKeys.update` | `write` | Update an API key name or scopes |
| `asm.addGroupSuppressions` | `sendgrid.api.asm.addGroupSuppressions` | `write` | Add suppressions to an unsubscribe group |
| `asm.createGroup` | `sendgrid.api.asm.createGroup` | `write` | Create an unsubscribe group |
| `asm.deleteGroup` | `sendgrid.api.asm.deleteGroup` | `write` | Delete an unsubscribe group |
| `asm.deleteGroupSuppression` | `sendgrid.api.asm.deleteGroupSuppression` | `write` | Delete a suppression from an unsubscribe group |
| `asm.getGroup` | `sendgrid.api.asm.getGroup` | `read` | Retrieve an unsubscribe group |
| `asm.getGroups` | `sendgrid.api.asm.getGroups` | `read` | Retrieve unsubscribe groups |
| `asm.getGroupSuppressions` | `sendgrid.api.asm.getGroupSuppressions` | `read` | Retrieve suppressions for an unsubscribe group |
| `asm.updateGroup` | `sendgrid.api.asm.updateGroup` | `write` | Update an unsubscribe group |
| `contacts.addOrUpdate` | `sendgrid.api.contacts.addOrUpdate` | `write` | Add or update contacts in SendGrid Marketing |
| `contacts.export` | `sendgrid.api.contacts.export` | `write` | Create a marketing contacts export job |
| `contacts.exportStatus` | `sendgrid.api.contacts.exportStatus` | `read` | Get a marketing contacts export job |
| `contacts.get` | `sendgrid.api.contacts.get` | `read` | Get a marketing contact by ID |
| `contacts.getCount` | `sendgrid.api.contacts.getCount` | `read` | Get marketing contact count |
| `contacts.getSample` | `sendgrid.api.contacts.getSample` | `read` | Get a sample of marketing contacts |
| `contacts.import` | `sendgrid.api.contacts.import` | `write` | Create a marketing contacts import job |
| `contacts.importStatus` | `sendgrid.api.contacts.importStatus` | `read` | Get a marketing contacts import job |
| `contacts.listExports` | `sendgrid.api.contacts.listExports` | `read` | List marketing contacts export jobs |
| `contacts.remove` | `sendgrid.api.contacts.remove` | `write` | Delete marketing contacts by ID |
| `contacts.search` | `sendgrid.api.contacts.search` | `read` | Search marketing contacts with SGQL |
| `contacts.searchEmails` | `sendgrid.api.contacts.searchEmails` | `read` | Search marketing contacts by email |
| `fields.create` | `sendgrid.api.fields.create` | `write` | Create a custom field definition |
| `fields.getAll` | `sendgrid.api.fields.getAll` | `read` | Get all marketing field definitions |
| `fields.remove` | `sendgrid.api.fields.remove` | `write` | Delete a custom field definition |
| `fields.update` | `sendgrid.api.fields.update` | `write` | Update a custom field definition |
| `lists.create` | `sendgrid.api.lists.create` | `write` | Create a new marketing contact list |
| `lists.get` | `sendgrid.api.lists.get` | `read` | Get a marketing list by ID |
| `lists.getAll` | `sendgrid.api.lists.getAll` | `read` | Retrieve all marketing contact lists |
| `lists.getContactCount` | `sendgrid.api.lists.getContactCount` | `read` | Get contact count for a marketing list |
| `lists.remove` | `sendgrid.api.lists.remove` | `write` | Delete a marketing list |
| `lists.removeContacts` | `sendgrid.api.lists.removeContacts` | `write` | Remove contacts from a marketing list |
| `lists.update` | `sendgrid.api.lists.update` | `write` | Update a marketing list |
| `mail.cancelScheduledSend` | `sendgrid.api.mail.cancelScheduledSend` | `write` | Cancel or pause a scheduled send |
| `mail.createBatchId` | `sendgrid.api.mail.createBatchId` | `write` | Create a batch ID for scheduled mail |
| `mail.deleteScheduledSend` | `sendgrid.api.mail.deleteScheduledSend` | `write` | Delete a cancellation/pause for a scheduled send |
| `mail.getScheduledSend` | `sendgrid.api.mail.getScheduledSend` | `read` | Retrieve a scheduled send by batch ID |
| `mail.listScheduledSends` | `sendgrid.api.mail.listScheduledSends` | `read` | Retrieve all scheduled sends |
| `mail.send` | `sendgrid.api.mail.send` | `write` | Send an email via SendGrid Mail Send API v3 |
| `mail.updateScheduledSend` | `sendgrid.api.mail.updateScheduledSend` | `write` | Update a scheduled send status |
| `mail.validateBatchId` | `sendgrid.api.mail.validateBatchId` | `read` | Validate a mail batch ID |
| `segments.create` | `sendgrid.api.segments.create` | `write` | Create a Marketing Campaigns segment 2.0 |
| `segments.get` | `sendgrid.api.segments.get` | `read` | Get a Marketing Campaigns segment 2.0 |
| `segments.getAll` | `sendgrid.api.segments.getAll` | `read` | Get all Marketing Campaigns segments 2.0 |
| `segments.refresh` | `sendgrid.api.segments.refresh` | `write` | Manually refresh a Marketing Campaigns segment 2.0 |
| `segments.remove` | `sendgrid.api.segments.remove` | `write` | Delete a Marketing Campaigns segment 2.0 |
| `segments.update` | `sendgrid.api.segments.update` | `write` | Update a Marketing Campaigns segment 2.0 |
| `senders.create` | `sendgrid.api.senders.create` | `write` | Create a verified sender |
| `senders.createIdentity` | `sendgrid.api.senders.createIdentity` | `write` | Create a Marketing Campaigns sender identity |
| `senders.getAll` | `sendgrid.api.senders.getAll` | `read` | Retrieve verified senders |
| `senders.getIdentity` | `sendgrid.api.senders.getIdentity` | `read` | Get a Marketing Campaigns sender identity |
| `senders.listIdentities` | `sendgrid.api.senders.listIdentities` | `read` | Get Marketing Campaigns sender identities |
| `senders.remove` | `sendgrid.api.senders.remove` | `write` | Delete a verified sender |
| `senders.resend` | `sendgrid.api.senders.resend` | `write` | Resend verified sender verification |
| `senders.update` | `sendgrid.api.senders.update` | `write` | Update a verified sender |
| `stats.getCategory` | `sendgrid.api.stats.getCategory` | `read` | Retrieve category statistics |
| `stats.getClient` | `sendgrid.api.stats.getClient` | `read` | Retrieve email client statistics |
| `stats.getDevice` | `sendgrid.api.stats.getDevice` | `read` | Retrieve device statistics |
| `stats.getGeo` | `sendgrid.api.stats.getGeo` | `read` | Retrieve geographic statistics |
| `stats.getGlobal` | `sendgrid.api.stats.getGlobal` | `read` | Retrieve global email statistics |
| `stats.getMailboxProvider` | `sendgrid.api.stats.getMailboxProvider` | `read` | Retrieve mailbox provider statistics |
| `suppressions.addGlobalUnsubscribes` | `sendgrid.api.suppressions.addGlobalUnsubscribes` | `write` | Add emails to the global unsubscribe list |
| `suppressions.deleteBlock` | `sendgrid.api.suppressions.deleteBlock` | `write` | Delete a block by email |
| `suppressions.deleteBlocks` | `sendgrid.api.suppressions.deleteBlocks` | `write` | Delete blocked emails |
| `suppressions.deleteBounce` | `sendgrid.api.suppressions.deleteBounce` | `write` | Delete a bounce by email |
| `suppressions.deleteBounces` | `sendgrid.api.suppressions.deleteBounces` | `write` | Delete bounce suppressions |
| `suppressions.deleteGlobalUnsubscribe` | `sendgrid.api.suppressions.deleteGlobalUnsubscribe` | `write` | Delete a global unsubscribe by email |
| `suppressions.deleteInvalidEmail` | `sendgrid.api.suppressions.deleteInvalidEmail` | `write` | Delete an invalid email |
| `suppressions.deleteInvalidEmails` | `sendgrid.api.suppressions.deleteInvalidEmails` | `write` | Delete invalid emails |
| `suppressions.deleteSpamReport` | `sendgrid.api.suppressions.deleteSpamReport` | `write` | Delete a spam report by email |
| `suppressions.deleteSpamReports` | `sendgrid.api.suppressions.deleteSpamReports` | `write` | Delete spam reports |
| `suppressions.getBlock` | `sendgrid.api.suppressions.getBlock` | `read` | Retrieve a block by email |
| `suppressions.getBlocks` | `sendgrid.api.suppressions.getBlocks` | `read` | Retrieve blocked emails |
| `suppressions.getBounce` | `sendgrid.api.suppressions.getBounce` | `read` | Retrieve a bounce by email |
| `suppressions.getBounces` | `sendgrid.api.suppressions.getBounces` | `read` | Retrieve email bounce suppressions |
| `suppressions.getGlobalUnsubscribe` | `sendgrid.api.suppressions.getGlobalUnsubscribe` | `read` | Retrieve a global unsubscribe by email |
| `suppressions.getGlobalUnsubscribes` | `sendgrid.api.suppressions.getGlobalUnsubscribes` | `read` | Retrieve global unsubscribes |
| `suppressions.getInvalidEmail` | `sendgrid.api.suppressions.getInvalidEmail` | `read` | Retrieve an invalid email |
| `suppressions.getInvalidEmails` | `sendgrid.api.suppressions.getInvalidEmails` | `read` | Retrieve invalid emails |
| `suppressions.getSpamReport` | `sendgrid.api.suppressions.getSpamReport` | `read` | Retrieve a spam report by email |
| `suppressions.getSpamReports` | `sendgrid.api.suppressions.getSpamReports` | `read` | Retrieve spam reports |
| `templates.activateVersion` | `sendgrid.api.templates.activateVersion` | `write` | Activate a transactional template version |
| `templates.create` | `sendgrid.api.templates.create` | `write` | Create a transactional template |
| `templates.createVersion` | `sendgrid.api.templates.createVersion` | `write` | Create a transactional template version |
| `templates.get` | `sendgrid.api.templates.get` | `read` | Get a transactional template |
| `templates.getAll` | `sendgrid.api.templates.getAll` | `read` | Get all transactional templates |
| `templates.getVersion` | `sendgrid.api.templates.getVersion` | `read` | Get a transactional template version |
| `templates.remove` | `sendgrid.api.templates.remove` | `write` | Delete a transactional template |
| `templates.removeVersion` | `sendgrid.api.templates.removeVersion` | `write` | Delete a transactional template version |
| `templates.update` | `sendgrid.api.templates.update` | `write` | Update a transactional template |
| `templates.updateVersion` | `sendgrid.api.templates.updateVersion` | `write` | Update a transactional template version |
| `user.getAccount` | `sendgrid.api.user.getAccount` | `read` | Retrieve the user account |
| `user.getCredits` | `sendgrid.api.user.getCredits` | `read` | Retrieve remaining email credits |
| `user.getEmail` | `sendgrid.api.user.getEmail` | `read` | Retrieve the account email address |
| `user.getProfile` | `sendgrid.api.user.getProfile` | `read` | Retrieve the user profile |
| `user.getScopes` | `sendgrid.api.user.getScopes` | `read` | Retrieve API key scopes for the current key |
| `user.getUsername` | `sendgrid.api.user.getUsername` | `read` | Retrieve the account username |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sendgrid

## License

Apache-2.0
