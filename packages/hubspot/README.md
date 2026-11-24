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
| `companies.getMany` | `hubspot.api.companies.getMany` | `read` | Pages through companies in id order, default properties only unless properties is set. To find a company by domain use companies.searchByDomain. |
| `companies.getRecentlyCreated` | `hubspot.api.companies.getRecentlyCreated` | `read` | Newest companies first by creation date; since keeps only those created at or after it. Page with paging.next.after. |
| `companies.getRecentlyUpdated` | `hubspot.api.companies.getRecentlyUpdated` | `read` | Most recently modified companies first; since keeps only those modified at or after it. Page with paging.next.after. |
| `companies.searchByDomain` | `hubspot.api.companies.searchByDomain` | `read` | Finds companies whose domain equals domain exactly (a search, not a prefix match). |
| `companies.update` | `hubspot.api.companies.update` | `write` | Update an existing company |
| `contactLists.addContact` | `hubspot.api.contactLists.addContact` | `write` | Add a contact to a static contact list |
| `contactLists.removeContact` | `hubspot.api.contactLists.removeContact` | `write` | Remove a contact from a static contact list |
| `contacts.create` | `hubspot.api.contacts.create` | `write` | Create a new contact |
| `contacts.delete` | `hubspot.api.contacts.delete` | `destructive` | Permanently delete a contact [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.get` | `hubspot.api.contacts.get` | `read` | Get a specific contact |
| `contacts.getMany` | `hubspot.api.contacts.getMany` | `read` | Pages through contacts in id order, default properties only unless properties is set. To find contacts by field or date use contacts.search. |
| `contacts.getRecentlyCreated` | `hubspot.api.contacts.getRecentlyCreated` | `read` | Newest contacts first by creation date; since keeps only those created at or after it. Page with paging.next.after. |
| `contacts.getRecentlyUpdated` | `hubspot.api.contacts.getRecentlyUpdated` | `read` | Most recently modified contacts first; since keeps only those modified at or after it. Page with paging.next.after. |
| `contacts.search` | `hubspot.api.contacts.search` | `read` | Search with query text and/or filterGroups; only default properties come back unless properties is set. Up to 200 per page and 10,000 results; follow paging.next.after. |
| `contacts.update` | `hubspot.api.contacts.update` | `write` | Update an existing contact |
| `deals.create` | `hubspot.api.deals.create` | `write` | Create a new deal |
| `deals.delete` | `hubspot.api.deals.delete` | `destructive` | Permanently delete a deal [DESTRUCTIVE · IRREVERSIBLE] |
| `deals.get` | `hubspot.api.deals.get` | `read` | Get a specific deal |
| `deals.getMany` | `hubspot.api.deals.getMany` | `read` | Pages through deals in id order, default properties only unless properties is set. To find deals by field or date use deals.search. |
| `deals.getRecentlyCreated` | `hubspot.api.deals.getRecentlyCreated` | `read` | Newest deals first by creation date; since keeps only those created at or after it. Page with paging.next.after. |
| `deals.getRecentlyUpdated` | `hubspot.api.deals.getRecentlyUpdated` | `read` | Most recently modified deals first; since keeps only those modified at or after it. Page with paging.next.after. |
| `deals.search` | `hubspot.api.deals.search` | `read` | Search with query text and/or filterGroups; only default properties come back unless properties is set. Up to 200 per page and 10,000 results; follow paging.next.after. |
| `deals.update` | `hubspot.api.deals.update` | `write` | Update an existing deal |
| `engagements.create` | `hubspot.api.engagements.create` | `write` | Create a new engagement |
| `engagements.delete` | `hubspot.api.engagements.delete` | `destructive` | Permanently delete an engagement [DESTRUCTIVE · IRREVERSIBLE] |
| `engagements.get` | `hubspot.api.engagements.get` | `read` | Get a specific engagement |
| `engagements.getMany` | `hubspot.api.engagements.getMany` | `read` | Get multiple engagements |
| `tickets.create` | `hubspot.api.tickets.create` | `write` | Create a new support ticket |
| `tickets.delete` | `hubspot.api.tickets.delete` | `destructive` | Permanently delete a ticket [DESTRUCTIVE · IRREVERSIBLE] |
| `tickets.get` | `hubspot.api.tickets.get` | `read` | Get a specific ticket |
| `tickets.getMany` | `hubspot.api.tickets.getMany` | `read` | Pages through tickets in id order, default properties only unless properties is set. |
| `tickets.update` | `hubspot.api.tickets.update` | `write` | Update an existing ticket |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 12 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hubspot

## License

Apache-2.0
