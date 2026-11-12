# @corsair-dev/kommo

Kommo plugin for Corsair: manage CRM leads, contacts, companies and tasks, and read the pipelines with their stages, the account users and the account itself.

## Install

```bash
pnpm add @corsair-dev/kommo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `kommo.api.account.get` | `read` | The account itself: its name, subdomain, currency and country |
| `companies.list` | `kommo.api.companies.list` | `read` | Companies by owner or update date, paged |
| `contacts.create` | `kommo.api.contacts.create` | `write` | Create contacts, each with a name or a first and last name, and custom fields |
| `contacts.get` | `kommo.api.contacts.get` | `read` | One contact with its custom field values |
| `contacts.list` | `kommo.api.contacts.list` | `read` | Contacts by owner or update date, paged, optionally with their leads |
| `contacts.update` | `kommo.api.contacts.update` | `write` | Change fields on one or more contacts, each named by its `id` |
| `leads.create` | `kommo.api.leads.create` | `write` | Create up to 250 leads in one request, each with its price, stage, pipeline and custom fields |
| `leads.get` | `kommo.api.leads.get` | `read` | One lead with its custom field values and, on request, its contacts, loss reason and source |
| `leads.list` | `kommo.api.leads.list` | `read` | Leads by pipeline, stage, owner or date, paged 250 at a time; `next_page` says whether another exists |
| `leads.update` | `kommo.api.leads.update` | `write` | Change fields on one or more leads, each named by its `id`; a field left out is untouched |
| `pipelines.list` | `kommo.api.pipelines.list` | `read` | The lead pipelines with their stages, which is where a lead’s `pipeline_id` and `status_id` come from |
| `tasks.create` | `kommo.api.tasks.create` | `write` | Create tasks against a lead, contact or company; every task needs a `complete_till` deadline |
| `tasks.list` | `kommo.api.tasks.list` | `read` | Tasks by entity, owner or completion, paged; the deadline is a Unix timestamp |
| `users.list` | `kommo.api.users.list` | `read` | The account’s users, for looking up a responsible user ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kommo

## License

Apache-2.0
