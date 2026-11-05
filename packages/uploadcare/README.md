# @corsair-dev/uploadcare

Uploadcare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/uploadcare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `addons.clamavStatus` | `uploadcare.api.addons.clamavStatus` | `read` | Check ClamAV scan status |
| `addons.executeClamav` | `uploadcare.api.addons.executeClamav` | `write` | Start a ClamAV virus scan |
| `addons.rekognitionModerationStatus` | `uploadcare.api.addons.rekognitionModerationStatus` | `read` | Check AWS Rekognition moderation job status |
| `addons.rekognitionStatus` | `uploadcare.api.addons.rekognitionStatus` | `read` | Check AWS Rekognition labels job status |
| `addons.removeBgStatus` | `uploadcare.api.addons.removeBgStatus` | `read` | Check Remove.bg add-on status |
| `cdn.mirror` | `uploadcare.api.cdn.mirror` | `read` | CDN URL for a horizontally mirrored image |
| `cdn.rotate` | `uploadcare.api.cdn.rotate` | `read` | CDN URL for a counterclockwise rotated image |
| `files.batchDelete` | `uploadcare.api.files.batchDelete` | `write` | Delete up to 100 files; problems lists invalid UUIDs |
| `files.batchStore` | `uploadcare.api.files.batchStore` | `write` | Store up to 100 files in one request |
| `files.copyLocal` | `uploadcare.api.files.copyLocal` | `write` | Copy a file to local storage in the same project |
| `files.delete` | `uploadcare.api.files.delete` | `write` | Delete a stored file by UUID |
| `files.deleteMetadataKey` | `uploadcare.api.files.deleteMetadataKey` | `write` | Delete a metadata key from a file |
| `files.get` | `uploadcare.api.files.get` | `read` | Get file info by UUID (official REST v0.7) |
| `files.getMetadata` | `uploadcare.api.files.getMetadata` | `read` | Get all metadata key-value pairs for a file |
| `files.getMetadataKey` | `uploadcare.api.files.getMetadataKey` | `read` | Get one metadata value by key |
| `files.list` | `uploadcare.api.files.list` | `read` | List files with pagination, stored/removed filters |
| `files.store` | `uploadcare.api.files.store` | `write` | Permanently store a file by UUID |
| `files.updateMetadataKey` | `uploadcare.api.files.updateMetadataKey` | `write` | Set a metadata key on a file |
| `groups.delete` | `uploadcare.api.groups.delete` | `write` | Delete a group (files are not deleted) |
| `groups.get` | `uploadcare.api.groups.get` | `read` | Get group info by ID |
| `groups.list` | `uploadcare.api.groups.list` | `read` | List file groups |
| `project.get` | `uploadcare.api.project.get` | `read` | Get current project info |
| `upload.createGroup` | `uploadcare.api.upload.createGroup` | `write` | Create a file group via Upload API |
| `upload.fileInfo` | `uploadcare.api.upload.fileInfo` | `read` | Get uploaded file info from Upload API |
| `upload.fromUrl` | `uploadcare.api.upload.fromUrl` | `write` | Upload a file from a public URL |
| `upload.fromUrlStatus` | `uploadcare.api.upload.fromUrlStatus` | `read` | Check from-URL upload status |
| `upload.groupInfo` | `uploadcare.api.upload.groupInfo` | `read` | Get file group info from Upload API |
| `upload.startMultipart` | `uploadcare.api.upload.startMultipart` | `write` | Start multipart upload for files over 100MB |
| `webhooks.create` | `uploadcare.api.webhooks.create` | `write` | Create a webhook subscription |
| `webhooks.delete` | `uploadcare.api.webhooks.delete` | `write` | Delete a webhook by ID |
| `webhooks.deleteByUrl` | `uploadcare.api.webhooks.deleteByUrl` | `write` | Unsubscribe a webhook by target URL |
| `webhooks.list` | `uploadcare.api.webhooks.list` | `read` | List project webhooks |
| `webhooks.update` | `uploadcare.api.webhooks.update` | `write` | Update a webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/uploadcare

## License

Apache-2.0
