# @corsair-dev/storerocket

Storerocket store locator: manage locations with hours, filters and custom fields, and schedule holiday special-hours rules across a project.

## Install

```bash
pnpm add @corsair-dev/storerocket
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `locations.create` | `storerocket.api.locations.create` | `write` | Create a location; name and city are required |
| `locations.delete` | `storerocket.api.locations.delete` | `destructive` | Delete a location from a project |
| `locations.get` | `storerocket.api.locations.get` | `read` | Read one location and its optional attached information |
| `locations.list` | `storerocket.api.locations.list` | `read` | List locations with filters, include flags and pagination |
| `locations.replace` | `storerocket.api.locations.replace` | `write` | Replace a location with the PUT contract; omitted markers and types reset to defaults |
| `locations.update` | `storerocket.api.locations.update` | `write` | Update selected location fields; omissions keep their saved values |
| `projects.list` | `storerocket.api.projects.list` | `read` | List the projects the token can access |
| `specialHours.create` | `storerocket.api.specialHours.create` | `write` | Create a special-hours rule, with an optional idempotency key |
| `specialHours.delete` | `storerocket.api.specialHours.delete` | `destructive` | Delete a special-hours rule; locations fall back to weekly hours |
| `specialHours.get` | `storerocket.api.specialHours.get` | `read` | Read one special-hours rule |
| `specialHours.list` | `storerocket.api.specialHours.list` | `read` | List the holiday and special-hours rules of a project |
| `specialHours.update` | `storerocket.api.specialHours.update` | `write` | Change selected fields of a special-hours rule |
| `users.get` | `storerocket.api.users.get` | `read` | Read the profile associated with the token |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/storerocket

## License

Apache-2.0
