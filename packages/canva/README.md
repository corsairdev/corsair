# @corsair-dev/canva

Canva plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/canva
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assets.delete` | `canva.api.assets.delete` | `destructive` | Delete an asset [DESTRUCTIVE] |
| `assets.get` | `canva.api.assets.get` | `read` | Get metadata for an asset |
| `assets.update` | `canva.api.assets.update` | `write` | Update an asset name or tags |
| `assetUploads.create` | `canva.api.assetUploads.create` | `write` | Start a job to upload an asset from binary content |
| `assetUploads.createFromUrl` | `canva.api.assetUploads.createFromUrl` | `write` | Start a job to upload an asset from a URL |
| `assetUploads.get` | `canva.api.assetUploads.get` | `read` | Get the status of an asset upload job |
| `assetUploads.getFromUrl` | `canva.api.assetUploads.getFromUrl` | `read` | Get the status of a URL asset upload job |
| `autofills.create` | `canva.api.autofills.create` | `write` | Start a job to autofill a brand template with data |
| `autofills.get` | `canva.api.autofills.get` | `read` | Get the status of a design autofill job |
| `brandTemplates.get` | `canva.api.brandTemplates.get` | `read` | Get metadata for a brand template |
| `brandTemplates.getDataset` | `canva.api.brandTemplates.getDataset` | `read` | Get the autofill dataset definition for a brand template |
| `brandTemplates.list` | `canva.api.brandTemplates.list` | `read` | List the user's brand templates |
| `comments.createReply` | `canva.api.comments.createReply` | `write` | Reply to a comment thread on a design |
| `comments.createThread` | `canva.api.comments.createThread` | `write` | Create a new comment thread on a design |
| `comments.getReply` | `canva.api.comments.getReply` | `read` | Get a reply to a comment thread on a design |
| `comments.getThread` | `canva.api.comments.getThread` | `read` | Get a comment thread on a design |
| `comments.listReplies` | `canva.api.comments.listReplies` | `read` | List replies to a comment thread on a design |
| `designs.create` | `canva.api.designs.create` | `write` | Create a new Canva design |
| `designs.get` | `canva.api.designs.get` | `read` | Get metadata for a design |
| `designs.getExportFormats` | `canva.api.designs.getExportFormats` | `read` | Get the export formats available for a design |
| `designs.getPages` | `canva.api.designs.getPages` | `read` | Get pages for a design |
| `designs.list` | `canva.api.designs.list` | `read` | List designs in the user projects |
| `exports.create` | `canva.api.exports.create` | `write` | Start a design export job |
| `exports.get` | `canva.api.exports.get` | `read` | Get the status of an export job |
| `folders.create` | `canva.api.folders.create` | `write` | Create a folder |
| `folders.delete` | `canva.api.folders.delete` | `destructive` | Delete a folder [DESTRUCTIVE] |
| `folders.get` | `canva.api.folders.get` | `read` | Get metadata for a folder |
| `folders.listItems` | `canva.api.folders.listItems` | `read` | List items in a folder |
| `folders.moveItem` | `canva.api.folders.moveItem` | `write` | Move an item to another folder |
| `folders.update` | `canva.api.folders.update` | `write` | Update a folder name |
| `imports.create` | `canva.api.imports.create` | `write` | Start a job to import a design from binary content |
| `imports.createFromUrl` | `canva.api.imports.createFromUrl` | `write` | Start a job to import a design from a URL |
| `imports.get` | `canva.api.imports.get` | `read` | Get the status of a design import job |
| `imports.getFromUrl` | `canva.api.imports.getFromUrl` | `read` | Get the status of a URL design import job |
| `resizes.create` | `canva.api.resizes.create` | `write` | Start a job to resize a design |
| `resizes.get` | `canva.api.resizes.get` | `read` | Get the status of a design resize job |
| `users.getCapabilities` | `canva.api.users.getCapabilities` | `read` | Get the authenticated user's capabilities |
| `users.getMe` | `canva.api.users.getMe` | `read` | Get the authenticated user ID and team ID |
| `users.getProfile` | `canva.api.users.getProfile` | `read` | Get the authenticated user profile |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/canva

## License

Apache-2.0
