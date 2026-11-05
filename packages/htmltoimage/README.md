# @corsair-dev/htmltoimage

HtmlToImage plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/htmltoimage
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.checkUsage` | `htmltoimage.api.account.checkUsage` | `read` | Check account usage and remaining credits |
| `html.convertToImage` | `htmltoimage.api.html.convertToImage` | `write` | Convert HTML or a public URL into an image |
| `image.getImage` | `htmltoimage.api.image.getImage` | `read` | Retrieve a generated image |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/htmltoimage

## License

Apache-2.0
