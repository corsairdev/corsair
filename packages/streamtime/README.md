# @corsair-dev/streamtime

Streamtime plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/streamtime
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `organisation.get` | `streamtime.api.organisation.get` | `read` | Retrieve the organisation's details |
| `roles.get` | `streamtime.api.roles.get` | `read` | Retrieve a role by ID |
| `roles.list` | `streamtime.api.roles.list` | `read` | Retrieve all roles in the organisation |
| `users.listSavedSegments` | `streamtime.api.users.listSavedSegments` | `read` | Retrieve saved segments for a specific user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/streamtime

## License

Apache-2.0
