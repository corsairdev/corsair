# @corsair-dev/tinyurl

Tinyurl plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tinyurl
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `urls.create` | `tinyurl.api.urls.create` | `write` | Shorten a URL using TinyURL |
| `urls.list` | `tinyurl.api.urls.list` | `read` | List available or archived TinyURLs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tinyurl

## License

Apache-2.0
