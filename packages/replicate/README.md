# @corsair-dev/replicate

Replicate plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/replicate
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `replicate.api.account.get` | `read` | Get authenticated account information |
| `collections.list` | `replicate.api.collections.list` | `read` | List model collections |
| `collections.get` | `replicate.api.collections.get` | `read` | Get model collection details by slug |
| `deployments.list` | `replicate.api.deployments.list` | `read` | List deployments |
| `deployments.create` | `replicate.api.deployments.create` | `write` | Create a deployment |
| `deployments.delete` | `replicate.api.deployments.delete` | `destructive` | Delete a deployment |
| `deployments.get` | `replicate.api.deployments.get` | `read` | Get deployment details |
| `deployments.predictionsCreate` | `replicate.api.deployments.predictionsCreate` | `write` | Create a prediction from deployment |
| `files.list` | `replicate.api.files.list` | `read` | List uploaded files |
| `files.create` | `replicate.api.files.create` | `write` | Upload a file |
| `files.delete` | `replicate.api.files.delete` | `destructive` | Delete a file |
| `files.get` | `replicate.api.files.get` | `read` | Get file details |
| `hardware.list` | `replicate.api.hardware.list` | `read` | List available hardware SKUs |
| `models.list` | `replicate.api.models.list` | `read` | List public models |
| `models.get` | `replicate.api.models.get` | `read` | Get model details |
| `models.update` | `replicate.api.models.update` | `write` | Update model metadata |
| `models.examplesList` | `replicate.api.models.examplesList` | `read` | List model examples |
| `models.predictionsCreate` | `replicate.api.models.predictionsCreate` | `write` | Create official model prediction |
| `models.readmeGet` | `replicate.api.models.readmeGet` | `read` | Get model README |
| `models.versionsGet` | `replicate.api.models.versionsGet` | `read` | Get model version |
| `models.versionsList` | `replicate.api.models.versionsList` | `read` | List model versions |
| `predictions.list` | `replicate.api.predictions.list` | `read` | List predictions |
| `predictions.create` | `replicate.api.predictions.create` | `write` | Create prediction by version |
| `predictions.get` | `replicate.api.predictions.get` | `read` | Get prediction status |
| `predictions.cancel` | `replicate.api.predictions.cancel` | `write` | Cancel prediction |
| `search.search` | `replicate.api.search.search` | `read` | Search models, collections, and docs |
| `trainings.create` | `replicate.api.trainings.create` | `write` | Create training job |
| `trainings.get` | `replicate.api.trainings.get` | `read` | Get training job details |
| `trainings.list` | `replicate.api.trainings.list` | `read` | List training jobs |
| `trainings.cancel` | `replicate.api.trainings.cancel` | `write` | Cancel training job |
| `webhooks.defaultSecretGet` | `replicate.api.webhooks.defaultSecretGet` | `read` | Get default webhook signing secret |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/replicate

## License

Apache-2.0
