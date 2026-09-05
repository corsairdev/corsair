# @corsair-dev/hubspot

Hubspot plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hubspot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.create` | `hubspot.api.companies.create` | `write` | Create a new company |
| `companies.delete` | `hubspot.api.companies.delete` | `destructive` | Permanently delete a company [DESTRUCTIVE · IRREVERSIBLE] |
| `companies.get` | `hubspot.api.companies.get` | `read` | Get a specific company |
| `companies.getMany` | `hubspot.api.companies.getMany` | `read` | Get multiple companies |
| `companies.getRecentlyCreated` | `hubspot.api.companies.getRecentlyCreated` | `read` | List recently created companies |
| `companies.getRecentlyUpdated` | `hubspot.api.companies.getRecentlyUpdated` | `read` | List recently updated companies |
| `companies.searchByDomain` | `hubspot.api.companies.searchByDomain` | `read` | Search companies by domain name |
| `companies.update` | `hubspot.api.companies.update` | `write` | Update an existing company |
| `contactLists.addContact` | `hubspot.api.contactLists.addContact` | `write` | Add a contact to a static contact list |
| `contactLists.removeContact` | `hubspot.api.contactLists.removeContact` | `write` | Remove a contact from a static contact list |
| `contacts.create` | `hubspot.api.contacts.create` | `write` | Create a new contact |
| `contacts.delete` | `hubspot.api.contacts.delete` | `destructive` | Permanently delete a contact [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.get` | `hubspot.api.contacts.get` | `read` | Get a specific contact |
| `contacts.getMany` | `hubspot.api.contacts.getMany` | `read` | Get multiple contacts |
| `contacts.getRecentlyCreated` | `hubspot.api.contacts.getRecentlyCreated` | `read` | List recently created contacts |
| `contacts.getRecentlyUpdated` | `hubspot.api.contacts.getRecentlyUpdated` | `read` | List recently updated contacts |
| `contacts.search` | `hubspot.api.contacts.search` | `read` | Search contacts |
| `contacts.update` | `hubspot.api.contacts.update` | `write` | Update an existing contact |
| `deals.create` | `hubspot.api.deals.create` | `write` | Create a new deal |
| `deals.delete` | `hubspot.api.deals.delete` | `destructive` | Permanently delete a deal [DESTRUCTIVE · IRREVERSIBLE] |
| `deals.get` | `hubspot.api.deals.get` | `read` | Get a specific deal |
| `deals.getMany` | `hubspot.api.deals.getMany` | `read` | Get multiple deals |
| `deals.getRecentlyCreated` | `hubspot.api.deals.getRecentlyCreated` | `read` | List recently created deals |
| `deals.getRecentlyUpdated` | `hubspot.api.deals.getRecentlyUpdated` | `read` | List recently updated deals |
| `deals.search` | `hubspot.api.deals.search` | `read` | Search deals |
| `deals.update` | `hubspot.api.deals.update` | `write` | Update an existing deal |
| `engagements.create` | `hubspot.api.engagements.create` | `write` | Create a new engagement |
| `engagements.delete` | `hubspot.api.engagements.delete` | `destructive` | Permanently delete an engagement [DESTRUCTIVE · IRREVERSIBLE] |
| `engagements.get` | `hubspot.api.engagements.get` | `read` | Get a specific engagement |
| `engagements.getMany` | `hubspot.api.engagements.getMany` | `read` | Get multiple engagements |
| `tickets.create` | `hubspot.api.tickets.create` | `write` | Create a new support ticket |
| `tickets.delete` | `hubspot.api.tickets.delete` | `destructive` | Permanently delete a ticket [DESTRUCTIVE · IRREVERSIBLE] |
| `tickets.get` | `hubspot.api.tickets.get` | `read` | Get a specific ticket |
| `tickets.getMany` | `hubspot.api.tickets.getMany` | `read` | Get multiple tickets |
| `tickets.update` | `hubspot.api.tickets.update` | `write` | Update an existing ticket |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 12 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hubspot

## License

Apache-2.0
