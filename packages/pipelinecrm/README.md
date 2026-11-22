# @corsair-dev/pipelinecrm

Pipeline CRM is a sales CRM for deals, people and companies. This plugin manages deals with stages and values, people and companies with their associations, records activities (notes) on any record, and reads the visible users.

## Install

```bash
pnpm add @corsair-dev/pipelinecrm
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.autocomplete` | `pipelinecrm.api.companies.autocomplete` | `read` | Search companies by text for autocomplete |
| `companies.create` | `pipelinecrm.api.companies.create` | `write` | Create a company |
| `companies.delete` | `pipelinecrm.api.companies.delete` | `destructive` | Delete a company |
| `companies.get` | `pipelinecrm.api.companies.get` | `read` | Read one company |
| `companies.list` | `pipelinecrm.api.companies.list` | `read` | List companies with conditions filters and paging |
| `companies.listPeople` | `pipelinecrm.api.companies.listPeople` | `read` | List the people of a company |
| `companies.update` | `pipelinecrm.api.companies.update` | `write` | Update a company |
| `deals.create` | `pipelinecrm.api.deals.create` | `write` | Create a deal |
| `deals.delete` | `pipelinecrm.api.deals.delete` | `destructive` | Delete a deal |
| `deals.get` | `pipelinecrm.api.deals.get` | `read` | Read one deal |
| `deals.list` | `pipelinecrm.api.deals.list` | `read` | List deals with conditions filters and paging |
| `deals.listNotes` | `pipelinecrm.api.deals.listNotes` | `read` | List the activities of a deal |
| `deals.totalsByStage` | `pipelinecrm.api.deals.totalsByStage` | `read` | Deal count and value per stage |
| `deals.update` | `pipelinecrm.api.deals.update` | `write` | Update a deal |
| `notes.create` | `pipelinecrm.api.notes.create` | `write` | Create an activity on a record |
| `notes.delete` | `pipelinecrm.api.notes.delete` | `destructive` | Delete an activity |
| `notes.get` | `pipelinecrm.api.notes.get` | `read` | Read one activity |
| `notes.list` | `pipelinecrm.api.notes.list` | `read` | List activities filtered by deal, company or person |
| `notes.update` | `pipelinecrm.api.notes.update` | `write` | Update an activity |
| `people.autocomplete` | `pipelinecrm.api.people.autocomplete` | `read` | Search people by text for autocomplete |
| `people.create` | `pipelinecrm.api.people.create` | `write` | Create a person |
| `people.delete` | `pipelinecrm.api.people.delete` | `destructive` | Delete a person |
| `people.get` | `pipelinecrm.api.people.get` | `read` | Read one person |
| `people.list` | `pipelinecrm.api.people.list` | `read` | List people with conditions filters and paging |
| `people.listDeals` | `pipelinecrm.api.people.listDeals` | `read` | List the deals of a person |
| `people.listNotes` | `pipelinecrm.api.people.listNotes` | `read` | List the activities of a person |
| `people.update` | `pipelinecrm.api.people.update` | `write` | Update a person |
| `users.get` | `pipelinecrm.api.users.get` | `read` | Read one visible user |
| `users.list` | `pipelinecrm.api.users.list` | `read` | List the visible users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pipelinecrm

## License

Apache-2.0
