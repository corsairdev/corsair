# @corsair-dev/alttextai

AltText.ai plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/alttextai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `alttextai.api.account.get` | `read` | Get AltText.ai account settings and usage |
| `account.update` | `alttextai.api.account.update` | `write` | Update AltText.ai account settings |
| `images.bulkCreate` | `alttextai.api.images.bulkCreate` | `write` | Upload a CSV of image URLs for batch alt text generation |
| `images.create` | `alttextai.api.images.create` | `write` | Add an image and generate AI alt text from URL or base64 data |
| `images.delete` | `alttextai.api.images.delete` | `destructive` | Delete an image from the AltText.ai library |
| `images.get` | `alttextai.api.images.get` | `read` | Retrieve image metadata and alt text by asset ID |
| `images.list` | `alttextai.api.images.list` | `read` | List images in the AltText.ai library with pagination |
| `images.pageScrape` | `alttextai.api.images.pageScrape` | `write` | Scrape a web page and queue alt text for all images found |
| `images.search` | `alttextai.api.images.search` | `read` | Search images by alt text, asset ID, or URL substring |
| `images.update` | `alttextai.api.images.update` | `write` | Update alt text or metadata for an existing image |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/alttextai

## License

Apache-2.0
