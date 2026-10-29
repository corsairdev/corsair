# @corsair-dev/typeform

Typeform plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/typeform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `forms.create` | `typeform.api.forms.create` | `write` | Create a new form |
| `forms.delete` | `typeform.api.forms.delete` | `destructive` | Permanently delete a form [DESTRUCTIVE] |
| `forms.get` | `typeform.api.forms.get` | `read` | Get a form by ID |
| `forms.getMessages` | `typeform.api.forms.getMessages` | `read` | Get custom messages for a form |
| `forms.list` | `typeform.api.forms.list` | `read` | List all forms in the account |
| `forms.patch` | `typeform.api.forms.patch` | `write` | Partially update a form using JSON Patch operations |
| `forms.update` | `typeform.api.forms.update` | `write` | Replace a form with a new version (PUT) |
| `forms.updateMessages` | `typeform.api.forms.updateMessages` | `write` | Update custom messages for a form |
| `images.create` | `typeform.api.images.create` | `write` | Upload a new image |
| `images.delete` | `typeform.api.images.delete` | `destructive` | Permanently delete an image [DESTRUCTIVE] |
| `images.getBackgroundBySize` | `typeform.api.images.getBackgroundBySize` | `read` | Get a background image at a specific size |
| `images.getBySize` | `typeform.api.images.getBySize` | `read` | Get an image at a specific size |
| `images.getChoiceImageBySize` | `typeform.api.images.getChoiceImageBySize` | `read` | Get a choice image at a specific size |
| `images.list` | `typeform.api.images.list` | `read` | List all images in the account |
| `me.get` | `typeform.api.me.get` | `read` | Get information about the authenticated Typeform account |
| `responses.delete` | `typeform.api.responses.delete` | `destructive` | Delete specific responses from a form [DESTRUCTIVE] |
| `responses.getAllFiles` | `typeform.api.responses.getAllFiles` | `read` | Get a ZIP archive of all files uploaded in responses |
| `responses.list` | `typeform.api.responses.list` | `read` | List responses submitted to a form |
| `themes.create` | `typeform.api.themes.create` | `write` | Create a new theme |
| `themes.delete` | `typeform.api.themes.delete` | `destructive` | Permanently delete a theme [DESTRUCTIVE] |
| `themes.get` | `typeform.api.themes.get` | `read` | Get a theme by ID |
| `themes.list` | `typeform.api.themes.list` | `read` | List all themes |
| `themes.patch` | `typeform.api.themes.patch` | `write` | Partially update a theme |
| `themes.update` | `typeform.api.themes.update` | `write` | Replace a theme with a new version (PUT) |
| `videos.upload` | `typeform.api.videos.upload` | `write` | Get a signed URL to upload a video for a form field |
| `webhooksConfig.createOrUpdate` | `typeform.api.webhooksConfig.createOrUpdate` | `write` | Create or update a webhook configuration |
| `webhooksConfig.delete` | `typeform.api.webhooksConfig.delete` | `destructive` | Delete a webhook configuration [DESTRUCTIVE] |
| `webhooksConfig.get` | `typeform.api.webhooksConfig.get` | `read` | Get a webhook configuration by tag |
| `webhooksConfig.list` | `typeform.api.webhooksConfig.list` | `read` | List all webhook configurations for a form |
| `workspaces.create` | `typeform.api.workspaces.create` | `write` | Create a new workspace |
| `workspaces.createForAccount` | `typeform.api.workspaces.createForAccount` | `write` | Create a new workspace within a specific account |
| `workspaces.delete` | `typeform.api.workspaces.delete` | `destructive` | Permanently delete a workspace [DESTRUCTIVE] |
| `workspaces.get` | `typeform.api.workspaces.get` | `read` | Get a workspace by ID |
| `workspaces.list` | `typeform.api.workspaces.list` | `read` | List all workspaces |
| `workspaces.update` | `typeform.api.workspaces.update` | `write` | Update a workspace using JSON Patch operations |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/typeform

## License

Apache-2.0
