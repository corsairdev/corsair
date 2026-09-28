# @corsair-dev/dynapictures

Dynapictures plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dynapictures
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `media.upload` | `dynapictures.api.media.upload` | `write` | Upload an image and create a media asset in a workspace |
| `templates.list` | `dynapictures.api.templates.list` | `read` | Get image templates that are ready and have Sync to Zapier enabled |
| `webhooks.unsubscribe` | `dynapictures.api.webhooks.unsubscribe` | `write` | Unsubscribe from webhook notifications using the original subscribe fields |
| `workspaces.create` | `dynapictures.api.workspaces.create` | `write` | Create a new workspace for templates, images, and media |
| `workspaces.delete` | `dynapictures.api.workspaces.delete` | `destructive` | Permanently delete a workspace and all associated templates, media, and images |
| `workspaces.list` | `dynapictures.api.workspaces.list` | `read` | Get all workspaces the authenticated user is a member of |
| `workspaces.update` | `dynapictures.api.workspaces.update` | `write` | Update an existing workspace name by workspace ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dynapictures

## License

Apache-2.0
