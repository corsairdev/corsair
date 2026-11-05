# @corsair-dev/timecamp

Timecamp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/timecamp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.getList` | `timecamp.api.projects.getList` | `read` | List TimeCamp projects (root-level tasks), returning task id, name, archived status, colour, budget information and assigned users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/timecamp

## License

Apache-2.0
