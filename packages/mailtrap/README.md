# @corsair-dev/mailtrap

Mailtrap plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mailtrap
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getBillingUsage` | `mailtrap.api.account.getBillingUsage` | `read` | Get billing usage against the account's testing/sending/marketing plan limits |
| `account.getPermissionResources` | `mailtrap.api.account.getPermissionResources` | `read` | Get every resource (inboxes, projects, domains, billing, account) the token has admin access to, nested by hierarchy |
| `account.listAccounts` | `mailtrap.api.account.listAccounts` | `read` | List Mailtrap accounts the token can access |
| `contactFields.create` | `mailtrap.api.contactFields.create` | `write` | Create a custom contact field |
| `contactFields.delete` | `mailtrap.api.contactFields.delete` | `destructive` | Permanently delete a custom contact field, dropping its stored values off every contact [DESTRUCTIVE] |
| `contactFields.get` | `mailtrap.api.contactFields.get` | `read` | Get a custom contact field by id |
| `contactFields.list` | `mailtrap.api.contactFields.list` | `read` | List custom contact fields |
| `contactFields.update` | `mailtrap.api.contactFields.update` | `write` | Update a custom contact field |
| `contactLists.create` | `mailtrap.api.contactLists.create` | `write` | Create a contact list |
| `contactLists.delete` | `mailtrap.api.contactLists.delete` | `destructive` | Permanently delete a contact list [DESTRUCTIVE] |
| `contactLists.get` | `mailtrap.api.contactLists.get` | `read` | Get a contact list by id |
| `contactLists.list` | `mailtrap.api.contactLists.list` | `read` | List contact lists |
| `contactLists.update` | `mailtrap.api.contactLists.update` | `write` | Rename a contact list |
| `contacts.create` | `mailtrap.api.contacts.create` | `write` | Create a contact |
| `contacts.createEvent` | `mailtrap.api.contacts.createEvent` | `write` | Record a custom event against a contact |
| `contacts.createExport` | `mailtrap.api.contacts.createExport` | `write` | Start an async export of contacts matching a filter |
| `contacts.delete` | `mailtrap.api.contacts.delete` | `destructive` | Permanently delete a contact [DESTRUCTIVE] |
| `contacts.get` | `mailtrap.api.contacts.get` | `read` | Get a contact by id or email |
| `contacts.getExport` | `mailtrap.api.contacts.getExport` | `read` | Get the status/download URL of a contact export job |
| `contacts.getImport` | `mailtrap.api.contacts.getImport` | `read` | Get the status of a contact import job |
| `contacts.import` | `mailtrap.api.contacts.import` | `write` | Bulk-import contacts, upserting by email |
| `contacts.update` | `mailtrap.api.contacts.update` | `write` | Update a contact by id or email |
| `emailTemplates.create` | `mailtrap.api.emailTemplates.create` | `write` | Create an email template |
| `emailTemplates.delete` | `mailtrap.api.emailTemplates.delete` | `destructive` | Permanently delete an email template [DESTRUCTIVE] |
| `emailTemplates.get` | `mailtrap.api.emailTemplates.get` | `read` | Get an email template by id |
| `emailTemplates.list` | `mailtrap.api.emailTemplates.list` | `read` | List email templates |
| `emailTemplates.update` | `mailtrap.api.emailTemplates.update` | `write` | Update an email template |
| `inboxes.clean` | `mailtrap.api.inboxes.clean` | `destructive` | Delete every message in a sandbox inbox [DESTRUCTIVE] |
| `inboxes.get` | `mailtrap.api.inboxes.get` | `read` | Get an inbox's attributes, including its SMTP credentials |
| `inboxes.list` | `mailtrap.api.inboxes.list` | `read` | List sandbox inboxes |
| `inboxes.markAsRead` | `mailtrap.api.inboxes.markAsRead` | `write` | Mark every message in a sandbox inbox as read |
| `inboxes.resetCredentials` | `mailtrap.api.inboxes.resetCredentials` | `destructive` | Reset an inbox's SMTP credentials, invalidating the previous ones [DESTRUCTIVE] |
| `inboxes.update` | `mailtrap.api.inboxes.update` | `write` | Update an inbox's name and/or email username |
| `messages.getHtml` | `mailtrap.api.messages.getHtml` | `read` | Get the formatted HTML body of a message |
| `messages.list` | `mailtrap.api.messages.list` | `read` | List messages in a sandbox inbox |
| `projects.delete` | `mailtrap.api.projects.delete` | `destructive` | Permanently delete a project and every inbox in it [DESTRUCTIVE] |
| `projects.get` | `mailtrap.api.projects.get` | `read` | Get a project and its inboxes by id |
| `projects.list` | `mailtrap.api.projects.list` | `read` | List projects and their sandbox inboxes |
| `projects.update` | `mailtrap.api.projects.update` | `write` | Rename a project |
| `sendingDomains.create` | `mailtrap.api.sendingDomains.create` | `write` | Register a sending domain for DNS verification |
| `sendingDomains.delete` | `mailtrap.api.sendingDomains.delete` | `destructive` | Permanently remove a sending domain [DESTRUCTIVE] |
| `sendingDomains.get` | `mailtrap.api.sendingDomains.get` | `read` | Get a sending domain by id, including its DNS records |
| `sendingDomains.list` | `mailtrap.api.sendingDomains.list` | `read` | List sending domains |
| `stats.byCategories` | `mailtrap.api.stats.byCategories` | `read` | Get sending stats broken down by category |
| `stats.byDate` | `mailtrap.api.stats.byDate` | `read` | Get sending stats broken down by day |
| `stats.byDomains` | `mailtrap.api.stats.byDomains` | `read` | Get sending stats broken down by sending domain |
| `stats.byEsp` | `mailtrap.api.stats.byEsp` | `read` | Get sending stats broken down by recipient email service provider |
| `stats.get` | `mailtrap.api.stats.get` | `read` | Get aggregated sending stats for a date range |
| `suppressions.list` | `mailtrap.api.suppressions.list` | `read` | List (and optionally search) suppressed email addresses |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mailtrap

## License

Apache-2.0
