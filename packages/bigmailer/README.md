# @corsair-dev/bigmailer

Bigmailer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bigmailer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.me` | `bigmailer.api.auth.me` | `read` | Check the authenticated API key and account configuration |
| `brandProperties.create` | `bigmailer.api.brandProperties.create` | `write` | Create a brand property |
| `brandProperties.delete` | `bigmailer.api.brandProperties.delete` | `destructive` | Permanently delete a brand property |
| `brandProperties.get` | `bigmailer.api.brandProperties.get` | `read` | Retrieve a brand property |
| `brandProperties.list` | `bigmailer.api.brandProperties.list` | `read` | List a brand's custom merge-tag properties |
| `brandProperties.update` | `bigmailer.api.brandProperties.update` | `write` | Update a brand property |
| `brands.create` | `bigmailer.api.brands.create` | `write` | Create a brand |
| `brands.get` | `bigmailer.api.brands.get` | `read` | Retrieve a brand |
| `brands.list` | `bigmailer.api.brands.list` | `read` | List brands in the account |
| `brands.update` | `bigmailer.api.brands.update` | `write` | Update a brand's settings |
| `bulkCampaigns.create` | `bigmailer.api.bulkCampaigns.create` | `write` | Create a bulk campaign |
| `bulkCampaigns.get` | `bigmailer.api.bulkCampaigns.get` | `read` | Retrieve a bulk campaign, including its send metrics |
| `bulkCampaigns.list` | `bigmailer.api.bulkCampaigns.list` | `read` | List a brand's bulk (marketing) campaigns |
| `bulkCampaigns.update` | `bigmailer.api.bulkCampaigns.update` | `write` | Update a bulk campaign - set ready:true to activate sending or scheduling |
| `connections.list` | `bigmailer.api.connections.list` | `read` | List a brand's email-delivery connections |
| `contacts.create` | `bigmailer.api.contacts.create` | `write` | Create a contact |
| `contacts.createBatch` | `bigmailer.api.contacts.createBatch` | `write` | Upload up to 1,000 contacts for asynchronous processing |
| `contacts.delete` | `bigmailer.api.contacts.delete` | `destructive` | Permanently delete a contact |
| `contacts.get` | `bigmailer.api.contacts.get` | `read` | Retrieve a contact by id or email address |
| `contacts.getBatch` | `bigmailer.api.contacts.getBatch` | `read` | Check a contact batch's processing status |
| `contacts.list` | `bigmailer.api.contacts.list` | `read` | List a brand's contacts |
| `contacts.update` | `bigmailer.api.contacts.update` | `write` | Update a contact |
| `contacts.upsert` | `bigmailer.api.contacts.upsert` | `write` | Create or update a contact by id or email address |
| `fields.create` | `bigmailer.api.fields.create` | `write` | Create a custom contact field |
| `fields.delete` | `bigmailer.api.fields.delete` | `destructive` | Permanently delete a custom contact field |
| `fields.get` | `bigmailer.api.fields.get` | `read` | Retrieve a custom contact field |
| `fields.list` | `bigmailer.api.fields.list` | `read` | List a brand's custom contact fields |
| `fields.update` | `bigmailer.api.fields.update` | `write` | Update a custom contact field's name or sample value |
| `lists.create` | `bigmailer.api.lists.create` | `write` | Create a contact list |
| `lists.delete` | `bigmailer.api.lists.delete` | `destructive` | Delete a contact list (its contacts are not deleted) |
| `lists.get` | `bigmailer.api.lists.get` | `read` | Retrieve a contact list |
| `lists.list` | `bigmailer.api.lists.list` | `read` | List a brand's contact lists |
| `lists.update` | `bigmailer.api.lists.update` | `write` | Rename a contact list |
| `messageTypes.list` | `bigmailer.api.messageTypes.list` | `read` | List a brand's message-type categories |
| `segments.create` | `bigmailer.api.segments.create` | `write` | Create a segment |
| `segments.delete` | `bigmailer.api.segments.delete` | `destructive` | Permanently delete a segment |
| `segments.get` | `bigmailer.api.segments.get` | `read` | Retrieve a segment |
| `segments.list` | `bigmailer.api.segments.list` | `read` | List a brand's segments |
| `segments.update` | `bigmailer.api.segments.update` | `write` | Update a segment |
| `senders.list` | `bigmailer.api.senders.list` | `read` | List a brand's verified sender identities |
| `suppressionLists.create` | `bigmailer.api.suppressionLists.create` | `write` | Upload a campaign suppression list |
| `suppressionLists.get` | `bigmailer.api.suppressionLists.get` | `read` | Retrieve a campaign suppression list |
| `suppressionLists.list` | `bigmailer.api.suppressionLists.list` | `read` | List a brand's campaign suppression lists |
| `templates.create` | `bigmailer.api.templates.create` | `write` | Create a template |
| `templates.delete` | `bigmailer.api.templates.delete` | `destructive` | Permanently delete a template |
| `templates.get` | `bigmailer.api.templates.get` | `read` | Retrieve a template |
| `templates.list` | `bigmailer.api.templates.list` | `read` | List a brand's templates |
| `templates.update` | `bigmailer.api.templates.update` | `write` | Update a template |
| `transactionalCampaigns.create` | `bigmailer.api.transactionalCampaigns.create` | `write` | Create a transactional campaign |
| `transactionalCampaigns.get` | `bigmailer.api.transactionalCampaigns.get` | `read` | Retrieve a transactional campaign, including its send metrics |
| `transactionalCampaigns.list` | `bigmailer.api.transactionalCampaigns.list` | `read` | List a brand's transactional campaigns |
| `transactionalCampaigns.update` | `bigmailer.api.transactionalCampaigns.update` | `write` | Update a transactional campaign - set ready:true to activate it |
| `users.create` | `bigmailer.api.users.create` | `write` | Invite a new user to the account |
| `users.delete` | `bigmailer.api.users.delete` | `destructive` | Remove a user from the account |
| `users.get` | `bigmailer.api.users.get` | `read` | Retrieve an account user |
| `users.list` | `bigmailer.api.users.list` | `read` | List account users |
| `users.update` | `bigmailer.api.users.update` | `write` | Update a user's email, role, or allowed brands |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bigmailer

## License

Apache-2.0
