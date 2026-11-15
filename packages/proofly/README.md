# @corsair-dev/proofly

Proofly plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/proofly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activity.list` | `proofly.api.activity.list` | `read` | Read Proofly activity logs. The logs are not stored. |
| `campaigns.list` | `proofly.api.campaigns.list` | `read` | List Proofly campaigns for the connected account. |
| `user.get` | `proofly.api.user.get` | `read` | Read the signed-in Proofly user. The pixel key is removed from the result. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/proofly

## License

Apache-2.0
