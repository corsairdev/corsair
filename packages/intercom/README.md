# @corsair-dev/intercom

Intercom plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/intercom
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `admins.get` | `intercom.api.admins.get` | `read` | Retrieve a single admin |
| `admins.identify` | `intercom.api.admins.identify` | `read` | Identify the currently authorised admin |
| `admins.list` | `intercom.api.admins.list` | `read` | List all admins in the workspace |
| `admins.listActivityLogs` | `intercom.api.admins.listActivityLogs` | `read` | List all admin activity logs |
| `admins.setAway` | `intercom.api.admins.setAway` | `write` | Set an admin as away |
| `articles.create` | `intercom.api.articles.create` | `write` | Create a new article |
| `articles.delete` | `intercom.api.articles.delete` | `destructive` | Delete an article [DESTRUCTIVE] |
| `articles.get` | `intercom.api.articles.get` | `read` | Retrieve a single article |
| `articles.list` | `intercom.api.articles.list` | `read` | List all articles |
| `articles.search` | `intercom.api.articles.search` | `read` | Search for articles |
| `articles.update` | `intercom.api.articles.update` | `write` | Update an existing article |
| `collections.create` | `intercom.api.collections.create` | `write` | Create a new collection |
| `collections.delete` | `intercom.api.collections.delete` | `destructive` | Delete a collection [DESTRUCTIVE] |
| `collections.get` | `intercom.api.collections.get` | `read` | Retrieve a single collection |
| `collections.list` | `intercom.api.collections.list` | `read` | List all collections |
| `collections.update` | `intercom.api.collections.update` | `write` | Update a collection |
| `companies.createOrUpdate` | `intercom.api.companies.createOrUpdate` | `write` | Create or update a company |
| `companies.delete` | `intercom.api.companies.delete` | `destructive` | Delete a company [DESTRUCTIVE] |
| `companies.get` | `intercom.api.companies.get` | `read` | Retrieve a company by Intercom ID |
| `companies.list` | `intercom.api.companies.list` | `read` | List all companies |
| `companies.listAttachedContacts` | `intercom.api.companies.listAttachedContacts` | `read` | List contacts attached to a company |
| `companies.listAttachedSegments` | `intercom.api.companies.listAttachedSegments` | `read` | List segments attached to a company |
| `companies.retrieve` | `intercom.api.companies.retrieve` | `read` | Retrieve a company by company_id or name |
| `companies.scroll` | `intercom.api.companies.scroll` | `read` | Scroll over all companies for large datasets |
| `contacts.addSubscription` | `intercom.api.contacts.addSubscription` | `write` | Add a subscription to a contact |
| `contacts.addTag` | `intercom.api.contacts.addTag` | `write` | Add a tag to a contact |
| `contacts.attachToCompany` | `intercom.api.contacts.attachToCompany` | `write` | Attach a contact to a company |
| `contacts.createNote` | `intercom.api.contacts.createNote` | `write` | Create a note for a contact |
| `contacts.delete` | `intercom.api.contacts.delete` | `destructive` | Delete a contact [DESTRUCTIVE] |
| `contacts.detachFromCompany` | `intercom.api.contacts.detachFromCompany` | `write` | Detach a contact from a company |
| `contacts.get` | `intercom.api.contacts.get` | `read` | Get a single contact by ID |
| `contacts.list` | `intercom.api.contacts.list` | `read` | List all contacts |
| `contacts.listAttachedCompanies` | `intercom.api.contacts.listAttachedCompanies` | `read` | List companies attached to a contact |
| `contacts.listAttachedSegments` | `intercom.api.contacts.listAttachedSegments` | `read` | List segments attached to a contact |
| `contacts.listNotes` | `intercom.api.contacts.listNotes` | `read` | List all notes for a contact |
| `contacts.listSubscriptions` | `intercom.api.contacts.listSubscriptions` | `read` | List subscription types for a contact |
| `contacts.listTags` | `intercom.api.contacts.listTags` | `read` | List all tags attached to a contact |
| `contacts.merge` | `intercom.api.contacts.merge` | `write` | Merge a lead into a user contact |
| `contacts.removeSubscription` | `intercom.api.contacts.removeSubscription` | `write` | Remove a subscription from a contact |
| `contacts.removeTag` | `intercom.api.contacts.removeTag` | `write` | Remove a tag from a contact |
| `contacts.update` | `intercom.api.contacts.update` | `write` | Update an existing contact |
| `conversations.assign` | `intercom.api.conversations.assign` | `write` | Assign a conversation to an admin or team |
| `conversations.close` | `intercom.api.conversations.close` | `write` | Close a conversation |
| `conversations.create` | `intercom.api.conversations.create` | `write` | Create a new conversation |
| `conversations.get` | `intercom.api.conversations.get` | `read` | Get a conversation by ID with all messages and details |
| `conversations.list` | `intercom.api.conversations.list` | `read` | List conversations with filtering and pagination |
| `conversations.reopen` | `intercom.api.conversations.reopen` | `write` | Reopen a closed conversation |
| `conversations.reply` | `intercom.api.conversations.reply` | `write` | Send a reply to a conversation |
| `conversations.search` | `intercom.api.conversations.search` | `read` | Search conversations using query string |
| `helpCenters.get` | `intercom.api.helpCenters.get` | `read` | Retrieve a single help center |
| `helpCenters.list` | `intercom.api.helpCenters.list` | `read` | List all help centers |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 7 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/intercom

## License

Apache-2.0
