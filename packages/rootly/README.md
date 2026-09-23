# @corsair-dev/rootly

Rootly plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/rootly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actionItems.list` | `rootly.api.actionItems.list` | `read` | List action items for a Rootly incident |
| `actionItems.get` | `rootly.api.actionItems.get` | `read` | Get a Rootly incident action item |
| `actionItems.delete` | `rootly.api.actionItems.delete` | `destructive` | Delete a Rootly incident action item |
| `incidents.get` | `rootly.api.incidents.get` | `read` | Get a Rootly incident |
| `incidents.update` | `rootly.api.incidents.update` | `write` | Update a Rootly incident |
| `incidents.delete` | `rootly.api.incidents.delete` | `destructive` | Delete a Rootly incident |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rootly

## License

Apache-2.0
