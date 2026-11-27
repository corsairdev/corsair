# @corsair-dev/shotstack

Shotstack cloud video editing and rendering: build a timeline as JSON, render video, image, GIF or audio, manage templates, generate AI assets, ingest source files and serve hosted assets.

## Install

```bash
pnpm add @corsair-dev/shotstack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assets.delete` | `shotstack.api.assets.delete` | `destructive` | Permanently delete a hosted asset from Shotstack storage and its CDN; there is no undo. |
| `assets.get` | `shotstack.api.assets.get` | `read` | Read one hosted asset: its durable CDN URL, filename, size and status. |
| `assets.getByRenderId` | `shotstack.api.assets.getByRenderId` | `read` | List the assets a render produced (video, poster, thumbnail), including the durable CDN URL to serve them from. |
| `assets.transfer` | `shotstack.api.assets.transfer` | `write` | Copy a hosted file to external destinations such as S3, Google Cloud Storage, Mux, Vimeo or Google Drive. |
| `generations.create` | `shotstack.api.generations.create` | `write` | Generate an image, video or audio asset from a prompt with an AI model; spends generation credits. Follow it with generations.get until status is done or failed. Pass idempotencyKey to make retries safe. |
| `generations.get` | `shotstack.api.generations.get` | `read` | Where a generation job stands. Once done it returns the public URL of the generated asset. |
| `generations.getModel` | `shotstack.api.generations.getModel` | `read` | Read one generation model, including the JSON Schema of the options it accepts. |
| `generations.listModels` | `shotstack.api.generations.listModels` | `read` | List the generation models available to this account, each with the asset type it generates. |
| `generations.quote` | `shotstack.api.generations.quote` | `read` | Estimate the generation credits an asset would cost, without reserving credits or generating anything. |
| `media.probe` | `shotstack.api.media.probe` | `read` | Inspect a media file at a remote URL and return its FFprobe metadata: width, height, duration, fps and type. |
| `renders.create` | `shotstack.api.renders.create` | `write` | Queue a video, image, GIF or audio render of a JSON timeline; spends credits. Follow it with renders.get until status is done or failed. |
| `renders.get` | `shotstack.api.renders.get` | `read` | Where a render stands. Once done it returns the temporary download URL, which expires after 24 hours; serve the asset from its CDN URL via assets.getByRenderId instead. |
| `sources.delete` | `shotstack.api.sources.delete` | `destructive` | Permanently delete an ingested source file; there is no undo. |
| `sources.fetch` | `shotstack.api.sources.fetch` | `write` | Fetch a file from a URL into Shotstack storage so the Edit API can use it; follow it with sources.get until status is ready. |
| `sources.get` | `shotstack.api.sources.get` | `read` | Read one ingested source file: its hosted URL, status, dimensions and duration. |
| `sources.list` | `shotstack.api.sources.list` | `read` | List the ingested source files with their status and metadata. |
| `templates.create` | `shotstack.api.templates.create` | `write` | Save an edit (timeline and output) as a named template that can be rendered with placeholders. |
| `templates.delete` | `shotstack.api.templates.delete` | `destructive` | Permanently delete a saved template; there is no undo. |
| `templates.get` | `shotstack.api.templates.get` | `read` | Read one saved template, including its full edit. |
| `templates.list` | `shotstack.api.templates.list` | `read` | List the saved templates with their ids and names. |
| `templates.render` | `shotstack.api.templates.render` | `write` | Queue a render of a saved template with placeholder values merged in; spends credits. Poll renders.get for the result. |
| `templates.update` | `shotstack.api.templates.update` | `write` | Overwrite a saved template with a new name or edit. |
| `uploads.create` | `shotstack.api.uploads.create` | `write` | Get a signed S3 URL to upload a file directly, so the Edit API can use it as a source. PUT the bytes to the returned url within one hour. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/shotstack

## License

Apache-2.0
