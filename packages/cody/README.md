# @corsair-dev/cody

Cody plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cody
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clientConfig.get` | `cody.api.clientConfig.get` | `read` | Get Cody client configuration |
| `completions.code` | `cody.api.completions.code` | `write` | Non-streaming Cody LLM completion |
| `completions.stream` | `cody.api.completions.stream` | `write` | Streaming Cody chat completion |
| `graphql.post` | `cody.api.graphql.post` | `write` | Run a raw Sourcegraph GraphQL operation |
| `models.list` | `cody.api.models.list` | `read` | List Cody supported models |
| `search.get` | `cody.api.search.get` | `read` | Search Sourcegraph code and count matches |
| `viewer.get` | `cody.api.viewer.get` | `read` | Get the authenticated Sourcegraph user |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cody

## License

Apache-2.0
