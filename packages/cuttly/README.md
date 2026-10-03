# @corsair-dev/cuttly

Cutt.ly URL shortening and link analytics plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cuttly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `links.analytics` | `cuttly.api.links.analytics` | `read` | Retrieve click analytics for a Cutt.ly short link. |
| `links.shorten` | `cuttly.api.links.shorten` | `write` | Create a Cutt.ly short URL with an optional custom alias and QR code. |
| `links.update` | `cuttly.api.links.update` | `write` | Update the destination URL for an existing Cutt.ly short link. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cuttly

## License

Apache-2.0
