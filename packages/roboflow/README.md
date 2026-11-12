# @corsair-dev/roboflow

Roboflow plugin for Corsair - read workspaces, projects, versions and trained models, create projects, upload images, and run model inference on the serverless host.

## Install

```bash
pnpm add @corsair-dev/roboflow
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `roboflow.api.account.get` | `read` | Check that the key works; the route answers 200 either way, so `authenticated` reports whether a workspace actually came back |
| `images.upload` | `roboflow.api.images.upload` | `write` | Upload one image to a project by URL or base64; a duplicate is reported as such rather than as a failure |
| `infer` | `roboflow.api.infer` | `write` | Run a trained model on an image on the serverless inference host, returning predictions and their count; billed per image |
| `models.list` | `roboflow.api.models.list` | `read` | List a project's trained models with their task, architecture and metrics; each `url` is the model ID `infer` takes |
| `project.create` | `roboflow.api.project.create` | `write` | Create a project of a given type in an annotation group, optionally licensed onto Universe |
| `project.delete` | `roboflow.api.project.delete` | `destructive` | Delete a project and its images, versions and models |
| `project.get` | `roboflow.api.project.get` | `read` | Read a project with its classes, splits and dataset versions, newest first |
| `version.delete` | `roboflow.api.version.delete` | `destructive` | Delete a dataset version |
| `version.get` | `roboflow.api.version.get` | `read` | Read a dataset version with its image count, splits, and the preprocessing and augmentation it applied |
| `workspace.get` | `roboflow.api.workspace.get` | `read` | Read a workspace and its projects with image, annotation and version counts |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/roboflow

## License

Apache-2.0
