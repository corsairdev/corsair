# @corsair-dev/bitwarden

Bitwarden plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bitwarden
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collections.get` | `bitwarden.api.collections.get` | `read` | Get details for a specific collection |
| `collections.list` | `bitwarden.api.collections.list` | `read` | List all collections in an organization |
| `members.get` | `bitwarden.api.members.get` | `read` | Get details for a specific organization member |
| `members.list` | `bitwarden.api.members.list` | `read` | List all members in an organization |
| `organizations.get` | `bitwarden.api.organizations.get` | `read` | Get details for a specific organization |
| `organizations.list` | `bitwarden.api.organizations.list` | `read` | List all organizations the authenticated account can access |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bitwarden

## License

Apache-2.0
