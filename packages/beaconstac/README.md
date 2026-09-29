# @corsair-dev/beaconstac

Beaconstac plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/beaconstac
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.periodOverview` | `beaconstac.api.analytics.periodOverview` | `read` | Period overview analytics for a product type |
| `analytics.productOverview` | `beaconstac.api.analytics.productOverview` | `read` | Product overview analytics for a time interval |
| `bulkQrcodes.list` | `beaconstac.api.bulkQrcodes.list` | `read` | List bulk QR Code collections |
| `organizations.list` | `beaconstac.api.organizations.list` | `read` | List organizations accessible to the authenticated account |
| `places.create` | `beaconstac.api.places.create` | `write` | Create a new place for location-based assets |
| `places.list` | `beaconstac.api.places.list` | `read` | List places with filtering, search, and pagination |
| `places.update` | `beaconstac.api.places.update` | `write` | Update a place name, address, or coordinates |
| `qrcodes.delete` | `beaconstac.api.qrcodes.delete` | `destructive` | Delete a QR Code by ID [DESTRUCTIVE] |
| `qrcodes.get` | `beaconstac.api.qrcodes.get` | `read` | Retrieve a QR Code by ID |
| `qrcodes.update` | `beaconstac.api.qrcodes.update` | `write` | Update a QR Code name, design, tags, or content |
| `qrTemplates.create` | `beaconstac.api.qrTemplates.create` | `write` | Create a reusable QR Code design template |
| `qrTemplates.delete` | `beaconstac.api.qrTemplates.delete` | `destructive` | Delete a QR Code template by ID [DESTRUCTIVE] |
| `qrTemplates.list` | `beaconstac.api.qrTemplates.list` | `read` | List QR Code templates for an organization |
| `tags.create` | `beaconstac.api.tags.create` | `write` | Create a tag for organizing QR Codes |
| `tags.delete` | `beaconstac.api.tags.delete` | `destructive` | Delete a tag by ID [DESTRUCTIVE] |
| `tags.list` | `beaconstac.api.tags.list` | `read` | List tags with optional filtering and pagination |
| `tags.update` | `beaconstac.api.tags.update` | `write` | Update a tag name or color |
| `users.create` | `beaconstac.api.users.create` | `write` | Create a user under an organization (Reseller+) |
| `users.get` | `beaconstac.api.users.get` | `read` | Retrieve a user by ID |
| `users.list` | `beaconstac.api.users.list` | `read` | List users with filtering, search, and pagination |
| `users.update` | `beaconstac.api.users.update` | `write` | Update a user profile or organization |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/beaconstac

## License

Apache-2.0
