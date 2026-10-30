# @corsair-dev/aryn

Aryn plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/aryn
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asyncTasks.list` | `aryn.api.asyncTasks.list` | `read` | List async partitioning tasks |
| `docset.create` | `aryn.api.docset.create` | `write` | Create a new DocSet |
| `docset.delete` | `aryn.api.docset.delete` | `destructive` | Delete a DocSet |
| `docset.get` | `aryn.api.docset.get` | `read` | Get DocSet metadata |
| `document.get` | `aryn.api.document.get` | `read` | Get a document by ID |
| `document.getBinary` | `aryn.api.document.getBinary` | `read` | Download document binary content |
| `document.partition` | `aryn.api.document.partition` | `write` | Partition document using Aryn DocParse |
| `document.submitAsyncAdd` | `aryn.api.document.submitAsyncAdd` | `write` | Submit document asynchronously to a DocSet |
| `query.generatePlan` | `aryn.api.query.generatePlan` | `read` | Generate query plan |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/aryn

## License

Apache-2.0
