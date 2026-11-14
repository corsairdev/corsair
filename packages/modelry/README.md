# @corsair-dev/modelry

Modelry plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/modelry
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `embeds.delete` | `modelry.api.embeds.delete` | `destructive` | Delete embeds |
| `embeds.get` | `modelry.api.embeds.get` | `read` | Get embeds |
| `embeds.list` | `modelry.api.embeds.list` | `read` | List embeds |
| `embeds.publish` | `modelry.api.embeds.publish` | `write` | Publish embeds |
| `modelingRequests.approve` | `modelry.api.modelingRequests.approve` | `write` | Approve modeling requests |
| `modelingRequests.assets` | `modelry.api.modelingRequests.assets` | `read` | List modeling request assets |
| `modelingRequests.create` | `modelry.api.modelingRequests.create` | `write` | Create modeling requests |
| `modelingRequests.get` | `modelry.api.modelingRequests.get` | `read` | Get modeling requests |
| `modelingRequests.list` | `modelry.api.modelingRequests.list` | `read` | List modeling requests |
| `modelingRequests.reject` | `modelry.api.modelingRequests.reject` | `write` | Reject modeling requests |
| `productAssets.create` | `modelry.api.productAssets.create` | `write` | Create product assets |
| `productAssets.delete` | `modelry.api.productAssets.delete` | `destructive` | Delete product assets |
| `products.create` | `modelry.api.products.create` | `write` | Create products |
| `products.delete` | `modelry.api.products.delete` | `destructive` | Delete products |
| `products.get` | `modelry.api.products.get` | `read` | Get products |
| `products.list` | `modelry.api.products.list` | `read` | List products |
| `products.update` | `modelry.api.products.update` | `write` | Update products |
| `reviews.create` | `modelry.api.reviews.create` | `write` | Create reviews |
| `uploads.blob` | `modelry.api.uploads.blob` | `write` | Create a direct upload blob |
| `uploads.file` | `modelry.api.uploads.file` | `write` | Upload a base64 file |
| `workspaces.list` | `modelry.api.workspaces.list` | `read` | List workspaces |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/modelry

## License

Apache-2.0
