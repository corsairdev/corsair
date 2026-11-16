# @corsair-dev/templated

Templated plugin for Corsair: render images, PDFs and videos from templates, manage templates and their layers, upload images, and organise renders into folders.

## Install

```bash
pnpm add @corsair-dev/templated
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `templated.api.account.get` | `read` | Read the account email, plan, API usage and quota |
| `folders.create` | `templated.api.folders.create` | `write` | Create a folder to group templates and renders |
| `folders.delete` | `templated.api.folders.delete` | `destructive` | Delete a folder |
| `folders.list` | `templated.api.folders.list` | `read` | List folders with their template counts |
| `folders.update` | `templated.api.folders.update` | `write` | Rename a folder |
| `fonts.list` | `templated.api.fonts.list` | `read` | List the fonts on the account, including uploaded ones |
| `galleryFonts.list` | `templated.api.galleryFonts.list` | `read` | List the base fonts available in the editor |
| `renders.create` | `templated.api.renders.create` | `destructive` | Render a template to an image, PDF or video, spending an API credit; layer overrides fill the template |
| `renders.delete` | `templated.api.renders.delete` | `destructive` | Delete a render and its file; the URL stops working and the credit is not refunded |
| `renders.duplicate` | `templated.api.renders.duplicate` | `destructive` | Duplicate an existing render with the same template and payload, spending an API credit |
| `renders.get` | `templated.api.renders.get` | `read` | Read one render with its URL, dimensions, format and status |
| `renders.list` | `templated.api.renders.list` | `read` | List every render on the account |
| `renders.merge` | `templated.api.renders.merge` | `destructive` | Merge several renders, plus external PDFs when given, into one PDF and return its hosted URL |
| `templates.addTags` | `templated.api.templates.addTags` | `write` | Append tags to a template, keeping the ones it already has |
| `templates.create` | `templated.api.templates.create` | `write` | Create a template from a list of layers, which renders can then use |
| `templates.delete` | `templated.api.templates.delete` | `destructive` | Delete a template |
| `templates.get` | `templated.api.templates.get` | `read` | Read one template, optionally with its layers or its pages |
| `templates.layers` | `templated.api.templates.layers` | `read` | List a template layers, including locked ones when asked |
| `templates.list` | `templated.api.templates.list` | `read` | List templates, filtered by name or tag, 15 per page |
| `templates.removeTags` | `templated.api.templates.removeTags` | `write` | Remove specific tags from a template |
| `uploads.create` | `templated.api.uploads.create` | `write` | Upload an image, up to 2 MB, for use as a template layer |
| `uploads.delete` | `templated.api.uploads.delete` | `destructive` | Delete one or more uploads |
| `uploads.list` | `templated.api.uploads.list` | `read` | List uploads, filtered by name or tag, 15 per page |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/templated

## License

Apache-2.0
