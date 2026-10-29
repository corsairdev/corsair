# @corsair-dev/bannerbear

Bannerbear plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bannerbear
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getAccountInfo` | `bannerbear.api.account.getAccountInfo` | `read` | Get account info including plan and quota |
| `account.getAuth` | `bannerbear.api.account.getAuth` | `read` | Verify API authentication against the current account |
| `animations.create` | `bannerbear.api.animations.create` | `write` | Generate an animation from a template |
| `animations.get` | `bannerbear.api.animations.get` | `read` | Get an animation by UID |
| `animations.list` | `bannerbear.api.animations.list` | `read` | List generated animations |
| `animationTemplates.create` | `bannerbear.api.animationTemplates.create` | `write` | Create an animation template |
| `animationTemplates.get` | `bannerbear.api.animationTemplates.get` | `read` | Get an animation template by UID |
| `animationTemplates.list` | `bannerbear.api.animationTemplates.list` | `read` | List animation templates |
| `images.create` | `bannerbear.api.images.create` | `write` | Generate an image from a template |
| `images.get` | `bannerbear.api.images.get` | `read` | Get an image by UID |
| `images.list` | `bannerbear.api.images.list` | `read` | List generated images |
| `instantUrls.create` | `bannerbear.api.instantUrls.create` | `write` | Create an Instant URL for an image template |
| `instantUrls.list` | `bannerbear.api.instantUrls.list` | `read` | List Instant URLs |
| `misc.joinPdfs` | `bannerbear.api.misc.joinPdfs` | `write` | Merge image or PDF URLs into one PDF |
| `templates.create` | `bannerbear.api.templates.create` | `write` | Create an image template |
| `templates.delete` | `bannerbear.api.templates.delete` | `write` | Delete an image template by UID |
| `templates.get` | `bannerbear.api.templates.get` | `read` | Get an image template by UID |
| `templates.import` | `bannerbear.api.templates.import` | `write` | Install a publication as an image template |
| `templates.list` | `bannerbear.api.templates.list` | `read` | List image templates |
| `webhooksApi.create` | `bannerbear.api.webhooksApi.create` | `write` | Create a webhook |
| `webhooksApi.delete` | `bannerbear.api.webhooksApi.delete` | `write` | Delete a webhook by UID |
| `webhooksApi.get` | `bannerbear.api.webhooksApi.get` | `read` | Get a webhook by UID |
| `workflows.createWorkflowRun` | `bannerbear.api.workflows.createWorkflowRun` | `write` | Run a workflow with inputs |
| `workflows.getWorkflow` | `bannerbear.api.workflows.getWorkflow` | `read` | Get a workflow by UID |
| `workflows.getWorkflowRun` | `bannerbear.api.workflows.getWorkflowRun` | `read` | Get a workflow run by UID |
| `workflows.listWorkflowRuns` | `bannerbear.api.workflows.listWorkflowRuns` | `read` | List workflow runs |
| `workflows.listWorkflows` | `bannerbear.api.workflows.listWorkflows` | `read` | List workflows in the workspace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bannerbear

## License

Apache-2.0
