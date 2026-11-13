# @corsair-dev/servicem8

ServiceM8 plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/servicem8
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assets.list` | `servicem8.api.assets.list` | `read` | List assets |
| `clients.list` | `servicem8.api.clients.list` | `read` | List clients |
| `clients.retrieve` | `servicem8.api.clients.retrieve` | `read` | Retrieve a client |
| `customFields.delete` | `servicem8.api.customFields.delete` | `destructive` | Delete a custom field |
| `documentTemplates.list` | `servicem8.api.documentTemplates.list` | `read` | List document templates |
| `forms.list` | `servicem8.api.forms.list` | `read` | List forms |
| `forms.retrieve` | `servicem8.api.forms.retrieve` | `read` | Retrieve a form |
| `jobActivities.retrieve` | `servicem8.api.jobActivities.retrieve` | `read` | Retrieve a job activity |
| `jobPayments.create` | `servicem8.api.jobPayments.create` | `write` | Create a job payment |
| `jobPayments.delete` | `servicem8.api.jobPayments.delete` | `destructive` | Delete a job payment |
| `jobPayments.retrieve` | `servicem8.api.jobPayments.retrieve` | `read` | Retrieve a job payment |
| `jobPayments.update` | `servicem8.api.jobPayments.update` | `write` | Update a job payment |
| `jobs.create` | `servicem8.api.jobs.create` | `write` | Create a job |
| `jobs.list` | `servicem8.api.jobs.list` | `read` | List jobs |
| `jobs.retrieve` | `servicem8.api.jobs.retrieve` | `read` | Retrieve a job |
| `locations.list` | `servicem8.api.locations.list` | `read` | List locations |
| `locations.retrieve` | `servicem8.api.locations.retrieve` | `read` | Retrieve a location |
| `materials.list` | `servicem8.api.materials.list` | `read` | List materials |
| `materials.retrieve` | `servicem8.api.materials.retrieve` | `read` | Retrieve a material |
| `notes.create` | `servicem8.api.notes.create` | `write` | Create a job note |
| `notes.delete` | `servicem8.api.notes.delete` | `destructive` | Delete a job note |
| `notes.list` | `servicem8.api.notes.list` | `read` | List job notes |
| `notes.retrieve` | `servicem8.api.notes.retrieve` | `read` | Retrieve a job note |
| `notes.update` | `servicem8.api.notes.update` | `write` | Update a job note |
| `queues.list` | `servicem8.api.queues.list` | `read` | List job queues |
| `queues.retrieve` | `servicem8.api.queues.retrieve` | `read` | Retrieve a job queue |
| `staff.retrieve` | `servicem8.api.staff.retrieve` | `read` | Retrieve a staff member |
| `tasks.list` | `servicem8.api.tasks.list` | `read` | List tasks |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

Private apps use an API key. Public apps use an OAuth access token, with
`authType: 'oauth_2'`; custom-field deletion requires OAuth. The default OAuth
configuration excludes the form and job-payment scopes; obtain an appropriately
scoped token separately for those operations.

For list pagination, pass `cursor: '-1'` initially, then pass the returned
`nextCursor` until it is absent. Create operations return the response as
`result` and the `x-record-uuid` header as `recordUuid`. Write requests are not
automatically retried; job creation may incur ServiceM8 charges.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/servicem8

## License

Apache-2.0
