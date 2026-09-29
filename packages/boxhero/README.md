# @corsair-dev/boxhero

BoxHero plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/boxhero
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `itemAttributes.get` | `boxhero.api.itemAttributes.get` | `read` | Get an item attribute spec |
| `itemAttributes.list` | `boxhero.api.itemAttributes.list` | `read` | List item attribute specs |
| `items.delete` | `boxhero.api.items.delete` | `destructive` | Delete an inventory item |
| `items.get` | `boxhero.api.items.get` | `read` | Get an inventory item |
| `items.list` | `boxhero.api.items.list` | `read` | List inventory items |
| `locations.delete` | `boxhero.api.locations.delete` | `destructive` | Delete a warehouse location |
| `locations.get` | `boxhero.api.locations.get` | `read` | Get a warehouse location |
| `locations.list` | `boxhero.api.locations.list` | `read` | List active warehouse locations |
| `members.get` | `boxhero.api.members.get` | `read` | Get a team member |
| `members.list` | `boxhero.api.members.list` | `read` | List team members |
| `partners.list` | `boxhero.api.partners.list` | `read` | List partners (suppliers and customers) |
| `teams.getInfo` | `boxhero.api.teams.getInfo` | `read` | Get the team linked to the API token |
| `transactions.listBasic` | `boxhero.api.transactions.listBasic` | `read` | List inventory transactions without line items |
| `transactions.listLocation` | `boxhero.api.transactions.listLocation` | `read` | List location-mode inventory transactions |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/boxhero

## License

Apache-2.0
