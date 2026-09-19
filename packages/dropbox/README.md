# @corsair-dev/dropbox

Dropbox plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dropbox
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `files.copy` | `dropbox.api.files.copy` | `write` | Copy a file to a new location |
| `files.delete` | `dropbox.api.files.delete` | `destructive` | Delete a file [DESTRUCTIVE] |
| `files.download` | `dropbox.api.files.download` | `read` | Download a file |
| `files.move` | `dropbox.api.files.move` | `write` | Move a file to a new location |
| `files.upload` | `dropbox.api.files.upload` | `write` | Upload a file |
| `folders.copy` | `dropbox.api.folders.copy` | `write` | Copy a folder to a new location |
| `folders.create` | `dropbox.api.folders.create` | `write` | Create a new folder |
| `folders.delete` | `dropbox.api.folders.delete` | `destructive` | Delete a folder and all its contents [DESTRUCTIVE] |
| `folders.list` | `dropbox.api.folders.list` | `read` | List files and folders within a folder |
| `folders.listContinue` | `dropbox.api.folders.listContinue` | `read` | Continue listing from a cursor returned by folders.list |
| `folders.move` | `dropbox.api.folders.move` | `write` | Move a folder to a new location |
| `search.query` | `dropbox.api.search.query` | `read` | Search for files and folders by name or content |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dropbox

## License

Apache-2.0
