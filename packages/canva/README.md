# @corsair-dev/canva

Canva plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/canva
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.get` | `canva.api.analytics.get` | `read` | Get a design's total views, unique viewers and view time (Canva Enterprise, preview) |
| `analytics.listLinks` | `canva.api.analytics.listLinks` | `read` | List a design's trackable links and their views (Canva Enterprise, preview) |
| `analytics.listPageViews` | `canva.api.analytics.listPageViews` | `read` | List view time per page of a design (Canva Enterprise, preview) |
| `analytics.listViewers` | `canva.api.analytics.listViewers` | `read` | List who viewed a design, most recent first (Canva Enterprise, preview) |
| `analytics.listViewsOverTime` | `canva.api.analytics.listViewsOverTime` | `read` | List a design's view counts per time bucket (Canva Enterprise, preview) |
| `apps.getJwks` | `canva.api.apps.getJwks` | `read` | Get a Canva app's public keys for verifying the JWTs it sends to its backend |
| `assets.delete` | `canva.api.assets.delete` | `destructive` | Move an asset to the trash (designs that use it keep it) |
| `assets.get` | `canva.api.assets.get` | `read` | Get an image or video asset in the content library |
| `assets.update` | `canva.api.assets.update` | `write` | Rename an asset or replace its tags |
| `assetUploads.create` | `canva.api.assetUploads.create` | `write` | Start uploading a file to the user's content library |
| `assetUploads.createFromUrl` | `canva.api.assetUploads.createFromUrl` | `write` | Start uploading a file from a public URL to the user's content library |
| `assetUploads.get` | `canva.api.assetUploads.get` | `read` | Get an asset upload job |
| `assetUploads.getFromUrl` | `canva.api.assetUploads.getFromUrl` | `read` | Get a URL asset upload job |
| `autofills.create` | `canva.api.autofills.create` | `write` | Start filling a brand template or design with text, images and chart data, as a new design or in place (Canva Pro, Teams or Enterprise) |
| `autofills.get` | `canva.api.autofills.get` | `read` | Get a design autofill job |
| `brandTemplates.get` | `canva.api.brandTemplates.get` | `read` | Get a brand template |
| `brandTemplates.getDataset` | `canva.api.brandTemplates.getDataset` | `read` | Get a brand template's autofill fields and the kind of data each takes |
| `brandTemplates.list` | `canva.api.brandTemplates.list` | `read` | List the user's brand templates (Canva Pro, Teams or Enterprise) |
| `brandTemplates.publish` | `canva.api.brandTemplates.publish` | `write` | Publish a design as a brand template (Canva preview; needs a brand designer or admin role) |
| `comments.createReply` | `canva.api.comments.createReply` | `write` | Reply to a comment thread (Canva preview) |
| `comments.createThread` | `canva.api.comments.createThread` | `write` | Start a comment thread on a design (Canva preview) |
| `comments.getReply` | `canva.api.comments.getReply` | `read` | Get a reply in a comment thread (Canva preview) |
| `comments.getThread` | `canva.api.comments.getThread` | `read` | Get a comment or suggestion thread on a design (Canva preview) |
| `comments.listReplies` | `canva.api.comments.listReplies` | `read` | List the replies in a comment thread (Canva preview) |
| `designs.create` | `canva.api.designs.create` | `write` | Create a design: a preset or custom size (optionally with an image asset), a copy of a design, or a design from a brand template |
| `designs.get` | `canva.api.designs.get` | `read` | Get a design: title, owner, page count, thumbnail, edit and view links |
| `designs.getDataset` | `canva.api.designs.getDataset` | `read` | Get a design's autofill fields and the kind of data each takes |
| `designs.getExportFormats` | `canva.api.designs.getExportFormats` | `read` | List the file formats a design can be exported to |
| `designs.getPages` | `canva.api.designs.getPages` | `read` | List the pages of a design with their thumbnails and sizes (Canva preview) |
| `designs.list` | `canva.api.designs.list` | `read` | List or search designs in the user's projects |
| `exports.create` | `canva.api.exports.create` | `read` | Start exporting a design to PDF, PNG, JPG, GIF, PPTX, MP4, HTML or CSV; a multi-page PNG or JPG export gives one file per page. Download links last 24 hours |
| `exports.download` | `canva.api.exports.download` | `read` | Download one file of a finished export (one page of a PNG or JPG export) and return it as a file; index picks which |
| `exports.get` | `canva.api.exports.get` | `read` | Get an export job's status and its download URLs |
| `folders.create` | `canva.api.folders.create` | `write` | Create a folder in projects, Uploads or another folder |
| `folders.delete` | `canva.api.folders.delete` | `destructive` | Delete a folder; the user's content in it moves to the trash |
| `folders.get` | `canva.api.folders.get` | `read` | Get a folder |
| `folders.listItems` | `canva.api.folders.listItems` | `read` | List the designs, folders, images and brand templates in a folder |
| `folders.moveItem` | `canva.api.folders.moveItem` | `write` | Move a design, folder or image to another folder |
| `folders.update` | `canva.api.folders.update` | `write` | Rename a folder |
| `generations.create` | `canva.api.generations.create` | `write` | Start generating a presentation or doc from a text brief and optional outline (Canva preview) |
| `generations.get` | `canva.api.generations.get` | `read` | Get a design generation job |
| `imageGenerations.create` | `canva.api.imageGenerations.create` | `write` | Start generating an image from a prompt, optionally saved to uploads (Canva preview; uses Canva AI quota) |
| `imageGenerations.get` | `canva.api.imageGenerations.get` | `read` | Get an image generation job and its download URL |
| `imageTransformations.create` | `canva.api.imageTransformations.create` | `write` | Start removing the background of an image asset, saved as a new asset (Canva preview) |
| `imageTransformations.get` | `canva.api.imageTransformations.get` | `read` | Get an image transformation job |
| `imports.create` | `canva.api.imports.create` | `write` | Start importing a file (PDF, PowerPoint, Keynote, Word and more) as a new Canva design |
| `imports.createFromImage` | `canva.api.imports.createFromImage` | `write` | Start turning an image asset into an editable design with Magic Layers (Canva preview) |
| `imports.createFromUrl` | `canva.api.imports.createFromUrl` | `write` | Start importing a file from a public URL as a new Canva design |
| `imports.get` | `canva.api.imports.get` | `read` | Get a design import job |
| `imports.getFromImage` | `canva.api.imports.getFromImage` | `read` | Get an image-to-design import job |
| `imports.getFromUrl` | `canva.api.imports.getFromUrl` | `read` | Get a URL design import job |
| `keys.list` | `canva.api.keys.list` | `read` | Get the public keys that verify Canva webhook signatures (preview) |
| `merges.create` | `canva.api.merges.create` | `write` | Start inserting, moving or deleting pages: build a new design from other designs or change one in place (Canva preview) |
| `merges.get` | `canva.api.merges.get` | `read` | Get a design merge job |
| `printPartner.createDesign` | `canva.api.printPartner.createDesign` | `write` | Create a design for a print product (Canva Print Partner apps only, preview) |
| `printPartner.createExport` | `canva.api.printPartner.createExport` | `read` | Start a print-ready export (Canva Print Partner apps only, preview) |
| `printPartner.getDesign` | `canva.api.printPartner.getDesign` | `read` | Get a design with print proofing settings (Canva Print Partner apps only, preview) |
| `resizes.create` | `canva.api.resizes.create` | `write` | Start making a resized copy of a design (Canva Pro; a few free trial uses) |
| `resizes.get` | `canva.api.resizes.get` | `read` | Get a design resize job |
| `users.getCapabilities` | `canva.api.users.getCapabilities` | `read` | List what the user's Canva plan allows through the API (autofill, brand templates, resize, design and image generation, background removal, analytics) |
| `users.getMe` | `canva.api.users.getMe` | `read` | Get the user ID and team ID of the connected Canva account |
| `users.getProfile` | `canva.api.users.getProfile` | `read` | Get the connected user's display name |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/canva

## License

Apache-2.0
