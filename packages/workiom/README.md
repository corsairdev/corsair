# @corsair-dev/workiom

Workiom plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/workiom
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apps.getAll` | `workiom.api.apps.getAll` | `read` | List Workiom apps via GET /api/services/app/Apps/GetAll |
| `lists.get` | `workiom.api.lists.get` | `read` | Get a list's fields, views, and filters via GET /api/services/app/Lists/Get |
| `lists.getAll` | `workiom.api.lists.getAll` | `read` | Get all lists in a Workiom app via GET /api/services/app/Lists/GetAll |
| `records.create` | `workiom.api.records.create` | `write` | Create a list record via POST /api/services/app/Data/Create?listId= |
| `records.getAll` | `workiom.api.records.getAll` | `read` | Get list records with sort, pagination, and filters via POST /api/services/app/Data/All |
| `records.update` | `workiom.api.records.update` | `write` | Replace a list record via PUT /api/services/app/Data/Update?listId=&id= |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/workiom

## License

Apache-2.0
