# @corsair-dev/googledrive

Google drive plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googledrive
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `files.copy` | `googledrive.api.files.copy` | `write` | Copy a file in Google Drive |
| `files.createFromText` | `googledrive.api.files.createFromText` | `write` | Create a new Drive file from text content |
| `files.delete` | `googledrive.api.files.delete` | `destructive` | Permanently delete a file [DESTRUCTIVE · IRREVERSIBLE] |
| `files.download` | `googledrive.api.files.download` | `read` | Download the content of a file |
| `files.get` | `googledrive.api.files.get` | `read` | Get metadata for a specific file |
| `files.list` | `googledrive.api.files.list` | `read` | List files in Google Drive |
| `files.move` | `googledrive.api.files.move` | `write` | Move a file to a different folder |
| `files.share` | `googledrive.api.files.share` | `write` | Share a file by granting permissions to users |
| `files.update` | `googledrive.api.files.update` | `write` | Update the content or metadata of a file |
| `files.upload` | `googledrive.api.files.upload` | `write` | Upload a file to Google Drive |
| `folders.create` | `googledrive.api.folders.create` | `write` | Create a new folder |
| `folders.delete` | `googledrive.api.folders.delete` | `destructive` | Permanently delete a folder and its contents [DESTRUCTIVE · IRREVERSIBLE] |
| `folders.get` | `googledrive.api.folders.get` | `read` | Get metadata for a specific folder |
| `folders.list` | `googledrive.api.folders.list` | `read` | List folders in Google Drive |
| `folders.share` | `googledrive.api.folders.share` | `write` | Share a folder by granting permissions to users |
| `search.filesAndFolders` | `googledrive.api.search.filesAndFolders` | `read` | Search for files and folders in Google Drive |
| `sharedDrives.create` | `googledrive.api.sharedDrives.create` | `write` | Create a new shared drive |
| `sharedDrives.delete` | `googledrive.api.sharedDrives.delete` | `destructive` | Permanently delete a shared drive [DESTRUCTIVE · IRREVERSIBLE] |
| `sharedDrives.get` | `googledrive.api.sharedDrives.get` | `read` | Get info about a shared drive |
| `sharedDrives.list` | `googledrive.api.sharedDrives.list` | `read` | List shared drives |
| `sharedDrives.update` | `googledrive.api.sharedDrives.update` | `write` | Update a shared drive |
| `storage.getQuota` | `googledrive.api.storage.getQuota` | `read` | Get the user's Google Drive storage quota and usage |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googledrive

## License

Apache-2.0
