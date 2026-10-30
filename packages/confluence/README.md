# @corsair-dev/confluence

Confluence plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/confluence
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `pages.get` | `confluence.api.pages.get` | `read` | List Confluence pages |
| `pages.search` | `confluence.api.pages.search` | `read` | Search Confluence pages via CQL |
| `spaces.list` | `confluence.api.spaces.list` | `read` | List Confluence spaces |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/confluence

## License

Apache-2.0
