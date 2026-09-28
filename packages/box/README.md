# @corsair-dev/box

Box plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/box
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `files.copy` | `box.api.files.copy` | `write` | Copy a Box file to a destination folder |
| `files.delete` | `box.api.files.delete` | `destructive` | Delete a Box file [DESTRUCTIVE] |
| `files.download` | `box.api.files.download` | `read` | Download the content of a Box file |
| `files.get` | `box.api.files.get` | `read` | Get metadata for a Box file by ID |
| `files.search` | `box.api.files.search` | `read` | Search for files in Box |
| `files.share` | `box.api.files.share` | `write` | Create or update a shared link for a Box file |
| `files.upload` | `box.api.files.upload` | `write` | Upload a new file to Box |
| `folders.create` | `box.api.folders.create` | `write` | Create a new folder in Box |
| `folders.delete` | `box.api.folders.delete` | `destructive` | Delete a Box folder [DESTRUCTIVE] |
| `folders.get` | `box.api.folders.get` | `read` | Get metadata for a Box folder by ID |
| `folders.search` | `box.api.folders.search` | `read` | Search for folders in Box |
| `folders.share` | `box.api.folders.share` | `write` | Create or update a shared link for a Box folder |
| `folders.update` | `box.api.folders.update` | `write` | Update properties of a Box folder |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 33 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/box

## License

Apache-2.0
