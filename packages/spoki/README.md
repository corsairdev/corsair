# @corsair-dev/spoki

Spoki integration for Corsair.

## Install

```bash
pnpm add @corsair-dev/spoki
```

## Endpoints

Implements the 57 OSS Spoki operations plus `getAccountByPhone`, `sendMessage`, and `triggerAutomation`.

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.listAccounts` | `spoki.api.accounts.listAccounts` | `read` | List Spoki WhatsApp accounts |
| `accounts.getAccount` | `spoki.api.accounts.getAccount` | `read` | Retrieve a Spoki account |
| `accounts.getAccountByPhone` | `spoki.api.accounts.getAccountByPhone` | `read` | Retrieve a Spoki account by phone |
| `accounts.getCurrentReport` | `spoki.api.accounts.getCurrentReport` | `read` | Get the current account report |
| `accounts.createOnboardingLink` | `spoki.api.accounts.createOnboardingLink` | `write` | Create an account onboarding link |
| `agencies.list` | `spoki.api.agencies.list` | `read` | List agencies |
| `automations.list` | `spoki.api.automations.list` | `read` | List automations |
| `automations.retrieve` | `spoki.api.automations.retrieve` | `read` | Retrieve an automation |
| `campaigns.list` | `spoki.api.campaigns.list` | `read` | List campaigns |
| `campaigns.update` | `spoki.api.campaigns.update` | `write` | Update a campaign |
| `contacts.list` | `spoki.api.contacts.list` | `read` | List contacts |
| `contacts.retrieve` | `spoki.api.contacts.retrieve` | `read` | Retrieve a contact |
| `contacts.createOrUpdate` | `spoki.api.contacts.createOrUpdate` | `write` | Create or update a contact by phone |
| `contacts.update` | `spoki.api.contacts.update` | `write` | Update a contact |
| `contacts.delete` | `spoki.api.contacts.delete` | `destructive` | Delete a contact |
| `contacts.syncBulk` | `spoki.api.contacts.syncBulk` | `write` | Bulk sync contacts |
| `contacts.addOperator` | `spoki.api.contacts.addOperator` | `write` | Assign an operator to a contact |
| `contacts.removeOperator` | `spoki.api.contacts.removeOperator` | `write` | Remove an operator from a contact |
| `customFields.list` | `spoki.api.customFields.list` | `read` | List custom fields |
| `customFields.retrieve` | `spoki.api.customFields.retrieve` | `read` | Retrieve a custom field |
| `customFields.create` | `spoki.api.customFields.create` | `write` | Create a custom field |
| `customFields.update` | `spoki.api.customFields.update` | `write` | Update a custom field |
| `customFields.delete` | `spoki.api.customFields.delete` | `destructive` | Delete a custom field |
| `lists.list` | `spoki.api.lists.list` | `read` | List contact lists |
| `lists.retrieve` | `spoki.api.lists.retrieve` | `read` | Retrieve a contact list |
| `lists.create` | `spoki.api.lists.create` | `write` | Create a contact list |
| `lists.delete` | `spoki.api.lists.delete` | `destructive` | Delete a contact list |
| `lists.removeAllContacts` | `spoki.api.lists.removeAllContacts` | `write` | Remove all contacts from a list |
| `lists.removeContacts` | `spoki.api.lists.removeContacts` | `write` | Remove contacts from a list |
| `lists.syncContacts` | `spoki.api.lists.syncContacts` | `write` | Sync contacts into a list |
| `media.list` | `spoki.api.media.list` | `read` | List media files |
| `media.retrieve` | `spoki.api.media.retrieve` | `read` | Retrieve a media file |
| `media.create` | `spoki.api.media.create` | `write` | Create a media file |
| `media.update` | `spoki.api.media.update` | `write` | Update a media file |
| `media.delete` | `spoki.api.media.delete` | `destructive` | Delete a media file |
| `partners.list` | `spoki.api.partners.list` | `read` | List partners |
| `reports.list` | `spoki.api.reports.list` | `read` | List usage reports |
| `roles.list` | `spoki.api.roles.list` | `read` | List roles |
| `roles.retrieve` | `spoki.api.roles.retrieve` | `read` | Retrieve a role |
| `roles.update` | `spoki.api.roles.update` | `write` | Update a role |
| `roles.delete` | `spoki.api.roles.delete` | `destructive` | Delete a role |
| `roles.addServiceUser` | `spoki.api.roles.addServiceUser` | `write` | Add a service user |
| `roles.checkPrivateKey` | `spoki.api.roles.checkPrivateKey` | `read` | Check whether a role has a private key |
| `roles.generatePrivateKey` | `spoki.api.roles.generatePrivateKey` | `write` | Generate a role private key |
| `tags.list` | `spoki.api.tags.list` | `read` | List tags |
| `tags.retrieve` | `spoki.api.tags.retrieve` | `read` | Retrieve a tag |
| `templates.list` | `spoki.api.templates.list` | `read` | List templates |
| `templates.retrieve` | `spoki.api.templates.retrieve` | `read` | Retrieve a template |
| `templates.create` | `spoki.api.templates.create` | `write` | Create a WhatsApp template |
| `templates.update` | `spoki.api.templates.update` | `write` | Update a WhatsApp template |
| `templates.delete` | `spoki.api.templates.delete` | `destructive` | Delete a WhatsApp template |
| `templates.clone` | `spoki.api.templates.clone` | `write` | Clone a template |
| `templates.revertToDraft` | `spoki.api.templates.revertToDraft` | `write` | Revert a template to draft |
| `tickets.list` | `spoki.api.tickets.list` | `read` | List tickets |
| `tickets.create` | `spoki.api.tickets.create` | `write` | Create a ticket |
| `tickets.delete` | `spoki.api.tickets.delete` | `destructive` | Delete a ticket |
| `invitations.resend` | `spoki.api.invitations.resend` | `write` | Resend an invitation |
| `invitations.updateRole` | `spoki.api.invitations.updateRole` | `write` | Update an invitation role |
| `messaging.sendMessage` | `spoki.api.messaging.sendMessage` | `write` | Send a WhatsApp message |
| `automation.triggerAutomation` | `spoki.api.automation.triggerAutomation` | `write` | Trigger a Spoki automation |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/spoki

## License

Apache-2.0
