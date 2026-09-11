# @corsair-dev/bubble

Bubble (Data API & Workflow API) plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bubble
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `meta.getSwagger` | `bubble.api.meta.getSwagger` | `read` | Retrieve the auto-generated Swagger 2.0 JSON for enabled Bubble APIs |
| `things.bulkCreate` | `bubble.api.things.bulkCreate` | `write` | Create up to 1,000 things in one request, returning per-record results |
| `things.create` | `bubble.api.things.create` | `write` | Create a single thing with the supplied field values |
| `things.delete` | `bubble.api.things.delete` | `destructive` | Permanently delete a thing by its unique ID |
| `things.get` | `bubble.api.things.get` | `read` | Retrieve a single thing by its unique ID |
| `things.list` | `bubble.api.things.list` | `read` | Search and paginate things of a data type, with optional constraints and sorting |
| `things.replace` | `bubble.api.things.replace` | `write` | Overwrite all editable fields of an existing thing (omitted fields reset to default) |
| `things.update` | `bubble.api.things.update` | `write` | Change selected fields of an existing thing |
| `workflows.run` | `bubble.api.workflows.run` | `write` | Run an API workflow with the supplied parameters (Workflow API POST) |
| `workflows.runGet` | `bubble.api.workflows.runGet` | `write` | Run an API workflow with query-string parameters (Workflow API GET) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bubble

## License

Apache-2.0
