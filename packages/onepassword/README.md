# @corsair-dev/onepassword

OnePassword plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/onepassword
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `items.create` | `onepassword.api.items.create` | `write` | Create a new item in a vault |
| `items.delete` | `onepassword.api.items.delete` | `destructive` | Delete an item from a vault [DESTRUCTIVE] |
| `items.get` | `onepassword.api.items.get` | `read` | Get details of a vault item (e.g. login credentials, notes) |
| `items.list` | `onepassword.api.items.list` | `read` | List all items inside a specific vault |
| `items.update` | `onepassword.api.items.update` | `write` | Update details of an existing vault item |
| `vaults.get` | `onepassword.api.vaults.get` | `read` | Get details of a specific vault by ID |
| `vaults.list` | `onepassword.api.vaults.list` | `read` | List all vaults the integration can access |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/onepassword

## License

Apache-2.0
