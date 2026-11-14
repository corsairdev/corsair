# @corsair-dev/imgix

Imgix plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/imgix
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `sources.list` | `imgix.api.sources.list` | `read` | List all Imgix sources configured for the account |
| `sources.create` | `imgix.api.sources.create` | `destructive` | Create and deploy a new Imgix storage or web folder source |
| `sources.get` | `imgix.api.sources.get` | `read` | Retrieve configuration details and deployment status for a source |
| `sources.update` | `imgix.api.sources.update` | `write` | Update an existing Imgix source configuration or deployment settings |
| `assets.list` | `imgix.api.assets.list` | `read` | List indexed assets for a specific Imgix source |
| `assets.get` | `imgix.api.assets.get` | `read` | Retrieve details, technical metadata, and custom fields for an asset |
| `assets.update` | `imgix.api.assets.update` | `write` | Update custom fields or metadata for an asset in the Asset Manager |
| `assets.addFromOrigin` | `imgix.api.assets.addFromOrigin` | `write` | Queue an existing origin asset to be indexed into the Imgix Asset Manager (imgix answers 202 with no body, returned as {}) |
| `assets.upload` | `imgix.api.assets.upload` | `write` | Upload a file directly to the origin via Imgix Asset Manager |
| `uploadSessions.create` | `imgix.api.uploadSessions.create` | `write` | Initialize an upload session and receive a presigned URL for large asset upload |
| `uploadSessions.getStatus` | `imgix.api.uploadSessions.getStatus` | `read` | Retrieve the status of an ongoing or finalized asset upload session |
| `uploadSessions.close` | `imgix.api.uploadSessions.close` | `write` | Close an upload session to trigger immediate asset processing |
| `uploadSessions.cancel` | `imgix.api.uploadSessions.cancel` | `destructive` | Cancel an active upload session |
| `purges.create` | `imgix.api.purges.create` | `destructive` | Purge an asset and its derived variants from the Imgix CDN edge cache |
| `reports.list` | `imgix.api.reports.list` | `read` | List available daily CDN logs and credit analytics reports |
| `reports.get` | `imgix.api.reports.get` | `read` | Retrieve details, metadata, and downloadable segment URLs for a report |
| `generations.createVideo` | `imgix.api.generations.createVideo` | `destructive` | Transform a static image into a video using AI motion generation (consumes AI credits) |
| `generations.getVideoJob` | `imgix.api.generations.getVideoJob` | `read` | Poll the status and retrieve result URL of an asynchronous video generation job |
| `generations.getAltText` | `imgix.api.generations.getAltText` | `destructive` | Generate or retrieve AI alt text for an image (new languages consume AI credits; regenerate replaces stored text and overrides) |
| `generations.overrideAltText` | `imgix.api.generations.overrideAltText` | `write` | Set or remove manual alt-text overrides per language for an image |

## Auth

Auth: API key (`Authorization: Bearer <api-key>`). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Official Imgix Management API Reference: https://docs.imgix.com/apis/management

Full docs, types, and examples: https://docs.corsair.dev/plugins/imgix

## License

Apache-2.0
