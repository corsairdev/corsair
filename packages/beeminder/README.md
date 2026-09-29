# @corsair-dev/beeminder

Beeminder plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/beeminder
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `charges.create` | `beeminder.api.charges.create` | `write` | Create a charge against a Beeminder user. Use dryrun to preview. |
| `goals.list` | `beeminder.api.goals.list` | `read` | Get all active goals for the user |
| `goals.listArchived` | `beeminder.api.goals.listArchived` | `read` | Get all archived goals for the user |
| `user.get` | `beeminder.api.user.get` | `read` | Get information about the authenticated user |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/beeminder

## License

Apache-2.0
