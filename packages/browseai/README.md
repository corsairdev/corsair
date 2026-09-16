# @corsair-dev/browseai

Browse AI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/browseai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `monitors.create` | `browseai.api.monitors.create` | `write` | Create a robot monitor |
| `monitors.delete` | `browseai.api.monitors.delete` | `write` | Delete a robot monitor |
| `robots.bulkRun` | `browseai.api.robots.bulkRun` | `write` | Start a bulk run of robot tasks |
| `robots.list` | `browseai.api.robots.list` | `read` | List robots on the account |
| `robots.run` | `browseai.api.robots.run` | `write` | Start a robot task |
| `system.getStatus` | `browseai.api.system.getStatus` | `read` | Check Browse AI task-queue status |
| `tasks.get` | `browseai.api.tasks.get` | `read` | Get a robot task by id |
| `tasks.list` | `browseai.api.tasks.list` | `read` | List tasks for a robot |
| `webhooks.create` | `browseai.api.webhooks.create` | `write` | Create a robot webhook |
| `webhooks.list` | `browseai.api.webhooks.list` | `read` | List webhooks for a robot |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/browseai

## License

Apache-2.0
