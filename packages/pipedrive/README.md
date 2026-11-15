# @corsair-dev/pipedrive

Pipedrive API v2 deals, persons, organizations, activities, and tasks plugin for Corsair. The implemented API surface is deliberately partial.

## Install

```bash
pnpm add @corsair-dev/pipedrive
```

## Authentication

Configure an API token or OAuth 2.0 access token. Pipedrive accepts API tokens in the `x-api-token` header and OAuth access tokens as Bearer authorization. Deal reads require `deals:read` or `deals:full`; person and organization reads require `contacts:read` or `contacts:full`; activity reads require `activities:read` or `activities:full`; task reads require `projects:read` or `projects:full`. Corresponding writes and deletes require each resource's `:full` scope.

## Implemented operations

| Operation | Method and path | Risk / token cost | OAuth scopes | Official reference |
| --- | --- | --- | --- | --- |
| `deals.list` | `GET /api/v2/deals` | Read · 10 tokens | `deals:read` or `deals:full` | [Get all deals](https://developers.pipedrive.com/docs/api/v1/Deals#getDeals) |
| `deals.get` | `GET /api/v2/deals/{id}` | Read · 1 token | `deals:read` or `deals:full` | [Get deal](https://developers.pipedrive.com/docs/api/v1/Deals#getDeal) |
| `deals.create` | `POST /api/v2/deals` | Write · 5 tokens | `deals:full` | [Add deal](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal) |
| `deals.update` | `PATCH /api/v2/deals/{id}` | Write · 5 tokens | `deals:full` | [Update deal](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal) |
| `deals.delete` | `DELETE /api/v2/deals/{id}` | Destructive · 3 tokens | `deals:full` | [Delete deal](https://developers.pipedrive.com/docs/api/v1/Deals#deleteDeal) |
| `persons.list` | `GET /api/v2/persons` | Read · 10 tokens | `contacts:read` or `contacts:full` | [Get all persons](https://developers.pipedrive.com/docs/api/v1/Persons#getPersons) |
| `persons.get` | `GET /api/v2/persons/{id}` | Read · 1 token | `contacts:read` or `contacts:full` | [Get person](https://developers.pipedrive.com/docs/api/v1/Persons#getPerson) |
| `persons.create` | `POST /api/v2/persons` | Write · 5 tokens | `contacts:full` | [Add person](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson) |
| `persons.update` | `PATCH /api/v2/persons/{id}` | Write · 5 tokens | `contacts:full` | [Update person](https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson) |
| `persons.delete` | `DELETE /api/v2/persons/{id}` | Destructive · 3 tokens | `contacts:full` | [Delete person](https://developers.pipedrive.com/docs/api/v1/Persons#deletePerson) |
| `organizations.list` | `GET /api/v2/organizations` | Read · 10 tokens | `contacts:read` or `contacts:full` | [Get all organizations](https://developers.pipedrive.com/docs/api/v1/Organizations#getOrganizations) |
| `organizations.get` | `GET /api/v2/organizations/{id}` | Read · 1 token | `contacts:read` or `contacts:full` | [Get organization](https://developers.pipedrive.com/docs/api/v1/Organizations#getOrganization) |
| `organizations.create` | `POST /api/v2/organizations` | Write · 5 tokens | `contacts:full` | [Add organization](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization) |
| `organizations.update` | `PATCH /api/v2/organizations/{id}` | Write · 5 tokens | `contacts:full` | [Update organization](https://developers.pipedrive.com/docs/api/v1/Organizations#updateOrganization) |
| `organizations.delete` | `DELETE /api/v2/organizations/{id}` | Destructive · 3 tokens | `contacts:full` | [Delete organization](https://developers.pipedrive.com/docs/api/v1/Organizations#deleteOrganization) |
| `activities.list` | `GET /api/v2/activities` | Read · 10 tokens | `activities:read` or `activities:full` | [Get all activities](https://developers.pipedrive.com/docs/api/v1/Activities#getActivities) |
| `activities.get` | `GET /api/v2/activities/{id}` | Read · 1 token | `activities:read` or `activities:full` | [Get activity](https://developers.pipedrive.com/docs/api/v1/Activities#getActivity) |
| `activities.create` | `POST /api/v2/activities` | Write · 5 tokens | `activities:full` | [Add activity](https://developers.pipedrive.com/docs/api/v1/Activities#addActivity) |
| `activities.update` | `PATCH /api/v2/activities/{id}` | Write · 5 tokens | `activities:full` | [Update activity](https://developers.pipedrive.com/docs/api/v1/Activities#updateActivity) |
| `activities.delete` | `DELETE /api/v2/activities/{id}` | Destructive · 3 tokens | `activities:full` | [Delete activity](https://developers.pipedrive.com/docs/api/v1/Activities#deleteActivity) |
| `tasks.list` | `GET /api/v2/tasks` | Read · 10 tokens | `projects:read` or `projects:full` | [Get all tasks](https://developers.pipedrive.com/docs/api/v1/Tasks#getTasks) |
| `tasks.get` | `GET /api/v2/tasks/{id}` | Read · 1 token | `projects:read` or `projects:full` | [Get task](https://developers.pipedrive.com/docs/api/v1/Tasks#getTask) |
| `tasks.create` | `POST /api/v2/tasks` | Write · 5 tokens | `projects:full` | [Add task](https://developers.pipedrive.com/docs/api/v1/Tasks#addTask) |
| `tasks.update` | `PATCH /api/v2/tasks/{id}` | Write · 5 tokens | `projects:full` | [Update task](https://developers.pipedrive.com/docs/api/v1/Tasks#updateTask) |
| `tasks.delete` | `DELETE /api/v2/tasks/{id}` | Destructive · 3 tokens | `projects:full` | [Delete task](https://developers.pipedrive.com/docs/api/v1/Tasks#deleteTask) |

Deal, person, organization, activity, and task list endpoints support their documented filters, maximum page size of 500, and opaque cursor pagination through `additional_data.next_cursor`; array query parameters are comma-separated where documented. Activity person assignment uses `participants` with a primary participant, not a `person_id` body field. Task request `done` and `milestone` flags are integers (`0` or `1`), whereas response fields are booleans. Task endpoints are marked beta in Pipedrive's API reference. Task create requires `title` and `project_id`; `assignee_ids` accepts up to 10 user IDs. Person `emails`, `phones`, and custom field values, organization address and custom field values, and activity notes/attendees are sent only to Pipedrive; event logs include no customer values. Organization custom fields are arbitrary provider-defined JSON. Person `im`, `postal_address`, `notes`, `birthday`, and `job_title` fields require contact sync to be enabled by the Pipedrive company, or Pipedrive may return 403. The `marketing_status` field depends on the company's Campaigns product and has documented transition restrictions.

Pipedrive also applies daily token budgets and per-token burst limits. The client captures `x-ratelimit-reset`; only a 429 with that documented burst reset is retried once. A 429 without a reset is not retried because daily token-budget exhaustion remains blocked until reset. See [Pipedrive rate limiting](https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting).

## Scope and limitations

This contribution is a partial slice, not complete API coverage. The official references publish 213 v1 operations and 158 v2 operations (371 versioned operations total). Twenty-five v2 deals, persons, organizations, activities, and tasks operations above are currently implemented. Three webhook routes are intentionally excluded. The three v1 OAuth authorization/token exchange/refresh routes are handled by Corsair's OAuth lifecycle rather than exposed as business endpoints. The other 340 documented operations remain unimplemented, including other resources and multipart/form-encoded routes; those routes are pending, not excluded as unsupported.

Official references: [Pipedrive API v1](https://developers.pipedrive.com/docs/api/v1/openapi.yaml), [Pipedrive API v2](https://developers.pipedrive.com/docs/api/v1/openapi-v2.yaml).

## License

Apache-2.0
