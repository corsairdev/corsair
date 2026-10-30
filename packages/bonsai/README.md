# @corsair-dev/bonsai

Bonsai plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bonsai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clusters.get` | `bonsai.api.clusters.get` | `read` | Get Bonsai cluster details by slug |
| `spaces.get` | `bonsai.api.spaces.get` | `read` | Retrieve space details by path |
| `spaces.list` | `bonsai.api.spaces.list` | `read` | List all spaces |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bonsai

## License

Apache-2.0
