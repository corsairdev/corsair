# @corsair-dev/googlecloudvision

Corsair plugin for the [Google Cloud Vision API](https://docs.cloud.google.com/vision/docs) (`vision.googleapis.com/v1`).

## Auth

API key (`x-goog-api-key`) or OAuth 2.0 (`Authorization: Bearer`). Missing credentials throw `AuthMissingError`.

If `authType` is omitted, keys starting with `AIza` are sent as API keys. Any other explicit key is sent as a Bearer token.

Product Search writes typically need OAuth with `https://www.googleapis.com/auth/cloud-vision` or `cloud-platform`.

## Endpoints

Image and file annotation, Product Search (product sets, products, reference images), long-running operations, and location discovery.

`products.purge` is destructive and irreversible. The schema requires `force: true` and exactly one purge target.

## Tests

```bash
pnpm --filter @corsair-dev/googlecloudvision test
```
