# @corsair-dev/griptape

Griptape plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/griptape
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assistant.create` | `griptape.api.assistant.create` | `write` | Create an assistant |
| `assistant.delete` | `griptape.api.assistant.delete` | `destructive` | Delete an assistant |
| `assistant.get` | `griptape.api.assistant.get` | `read` | Get an assistant |
| `assistant.list` | `griptape.api.assistant.list` | `read` | List assistants |
| `assistant.update` | `griptape.api.assistant.update` | `write` | Update an assistant |
| `assistantRun.cancel` | `griptape.api.assistantRun.cancel` | `write` | Cancel an assistant run |
| `assistantRun.create` | `griptape.api.assistantRun.create` | `write` | Create an assistant run |
| `assistantRun.events` | `griptape.api.assistantRun.events` | `read` | List events for an assistant run |
| `assistantRun.get` | `griptape.api.assistantRun.get` | `read` | Retrieve an assistant run |
| `assistantRun.list` | `griptape.api.assistantRun.list` | `read` | List runs for an assistant |
| `billing.managementUrl` | `griptape.api.billing.managementUrl` | `read` | Get the billing management URL |
| `bucket.assetUrl` | `griptape.api.bucket.assetUrl` | `read` | Get a signed bucket asset URL |
| `bucket.create` | `griptape.api.bucket.create` | `write` | Create a bucket |
| `bucket.createAsset` | `griptape.api.bucket.createAsset` | `write` | Create a bucket asset |
| `bucket.delete` | `griptape.api.bucket.delete` | `destructive` | Delete a bucket |
| `bucket.deleteAsset` | `griptape.api.bucket.deleteAsset` | `destructive` | Delete a bucket asset |
| `bucket.get` | `griptape.api.bucket.get` | `read` | Get a bucket |
| `bucket.getAsset` | `griptape.api.bucket.getAsset` | `read` | Get a bucket asset |
| `bucket.list` | `griptape.api.bucket.list` | `read` | List buckets |
| `bucket.listAssets` | `griptape.api.bucket.listAssets` | `read` | List assets in a bucket |
| `bucket.update` | `griptape.api.bucket.update` | `write` | Update a bucket |
| `config.get` | `griptape.api.config.get` | `read` | Get Cloud configuration |
| `connection.list` | `griptape.api.connection.list` | `read` | List connections |
| `credits.balance` | `griptape.api.credits.balance` | `read` | Get the credits balance |
| `dataConnector.create` | `griptape.api.dataConnector.create` | `write` | Create a data connector |
| `dataConnector.createJob` | `griptape.api.dataConnector.createJob` | `write` | Create a data connector job |
| `dataConnector.delete` | `griptape.api.dataConnector.delete` | `destructive` | Delete a data connector |
| `dataConnector.get` | `griptape.api.dataConnector.get` | `read` | Get a data connector |
| `dataConnector.list` | `griptape.api.dataConnector.list` | `read` | List data connectors |
| `dataConnector.update` | `griptape.api.dataConnector.update` | `write` | Update a data connector |
| `dataJob.cancel` | `griptape.api.dataJob.cancel` | `write` | Cancel a data job |
| `dataJob.get` | `griptape.api.dataJob.get` | `read` | Get a data job |
| `exportJob.create` | `griptape.api.exportJob.create` | `write` | Create an export job |
| `exportJob.get` | `griptape.api.exportJob.get` | `read` | Get an export job |
| `exportJob.list` | `griptape.api.exportJob.list` | `read` | List export jobs |
| `function.create` | `griptape.api.function.create` | `write` | Create a function |
| `function.createDeployment` | `griptape.api.function.createDeployment` | `write` | Create a function deployment |
| `function.delete` | `griptape.api.function.delete` | `destructive` | Delete a function |
| `function.get` | `griptape.api.function.get` | `read` | Get a function |
| `function.list` | `griptape.api.function.list` | `read` | List functions |
| `function.listDeployments` | `griptape.api.function.listDeployments` | `read` | List deployments for a function |
| `function.update` | `griptape.api.function.update` | `write` | Update a function |
| `importJob.create` | `griptape.api.importJob.create` | `write` | Create an import job |
| `importJob.get` | `griptape.api.importJob.get` | `read` | Get an import job |
| `importJob.list` | `griptape.api.importJob.list` | `read` | List import jobs |
| `integration.create` | `griptape.api.integration.create` | `write` | Create an integration |
| `integration.delete` | `griptape.api.integration.delete` | `destructive` | Delete an integration |
| `integration.get` | `griptape.api.integration.get` | `read` | Get an integration |
| `integration.list` | `griptape.api.integration.list` | `read` | List integrations |
| `integration.update` | `griptape.api.integration.update` | `write` | Update an integration |
| `knowledgeBase.create` | `griptape.api.knowledgeBase.create` | `write` | Create a knowledge base |
| `knowledgeBase.createJob` | `griptape.api.knowledgeBase.createJob` | `write` | Create a knowledge base ingestion job |
| `knowledgeBase.delete` | `griptape.api.knowledgeBase.delete` | `destructive` | Delete a knowledge base |
| `knowledgeBase.get` | `griptape.api.knowledgeBase.get` | `read` | Get a knowledge base |
| `knowledgeBase.getJob` | `griptape.api.knowledgeBase.getJob` | `read` | Get a knowledge base job |
| `knowledgeBase.getSearch` | `griptape.api.knowledgeBase.getSearch` | `read` | Get a knowledge base search |
| `knowledgeBase.list` | `griptape.api.knowledgeBase.list` | `read` | List knowledge bases |
| `knowledgeBase.listJobs` | `griptape.api.knowledgeBase.listJobs` | `read` | List knowledge base jobs |
| `knowledgeBase.listQueries` | `griptape.api.knowledgeBase.listQueries` | `read` | List queries for a knowledge base |
| `knowledgeBase.listSearches` | `griptape.api.knowledgeBase.listSearches` | `read` | List searches for a knowledge base |
| `knowledgeBase.query` | `griptape.api.knowledgeBase.query` | `read` | Semantic search against a knowledge base |
| `knowledgeBase.search` | `griptape.api.knowledgeBase.search` | `read` | Search a knowledge base with a synthesized answer |
| `knowledgeBase.update` | `griptape.api.knowledgeBase.update` | `write` | Update a knowledge base |
| `library.create` | `griptape.api.library.create` | `write` | Create a library |
| `library.delete` | `griptape.api.library.delete` | `destructive` | Delete a library |
| `library.get` | `griptape.api.library.get` | `read` | Get a library |
| `library.list` | `griptape.api.library.list` | `read` | List libraries |
| `library.update` | `griptape.api.library.update` | `write` | Update a library |
| `message.delete` | `griptape.api.message.delete` | `destructive` | Delete a message |
| `message.get` | `griptape.api.message.get` | `read` | Get a message |
| `message.update` | `griptape.api.message.update` | `write` | Update a message |
| `model.create` | `griptape.api.model.create` | `write` | Create a model configuration |
| `model.createAuthConfig` | `griptape.api.model.createAuthConfig` | `write` | Create a model auth config |
| `model.delete` | `griptape.api.model.delete` | `destructive` | Delete a model configuration |
| `model.deleteAuthConfig` | `griptape.api.model.deleteAuthConfig` | `destructive` | Delete a model auth config |
| `model.get` | `griptape.api.model.get` | `read` | Get a model configuration |
| `model.getAuthConfig` | `griptape.api.model.getAuthConfig` | `read` | Get a model auth config |
| `model.list` | `griptape.api.model.list` | `read` | List models |
| `model.listAuthConfigs` | `griptape.api.model.listAuthConfigs` | `read` | List model auth configs |
| `model.update` | `griptape.api.model.update` | `write` | Update a model configuration |
| `model.updateAuthConfig` | `griptape.api.model.updateAuthConfig` | `write` | Update a model auth config |
| `organization.createApiKey` | `griptape.api.organization.createApiKey` | `write` | Create an organization API key |
| `organization.get` | `griptape.api.organization.get` | `read` | Get an organization |
| `organization.list` | `griptape.api.organization.list` | `read` | List organizations |
| `organization.listApiKeys` | `griptape.api.organization.listApiKeys` | `read` | List API keys for an organization |
| `organization.update` | `griptape.api.organization.update` | `write` | Update an organization |
| `retriever.create` | `griptape.api.retriever.create` | `write` | Create a retriever |
| `retriever.get` | `griptape.api.retriever.get` | `read` | Get a retriever |
| `retriever.list` | `griptape.api.retriever.list` | `read` | List retrievers |
| `retriever.query` | `griptape.api.retriever.query` | `read` | Query a retriever |
| `retriever.update` | `griptape.api.retriever.update` | `write` | Update a retriever |
| `retrieverComponent.create` | `griptape.api.retrieverComponent.create` | `write` | Create a retriever component |
| `retrieverComponent.get` | `griptape.api.retrieverComponent.get` | `read` | Get a retriever component |
| `retrieverComponent.list` | `griptape.api.retrieverComponent.list` | `read` | List retriever components |
| `retrieverComponent.update` | `griptape.api.retrieverComponent.update` | `write` | Update a retriever component |
| `rule.create` | `griptape.api.rule.create` | `write` | Create a rule |
| `rule.delete` | `griptape.api.rule.delete` | `destructive` | Delete a rule |
| `rule.get` | `griptape.api.rule.get` | `read` | Get a rule |
| `rule.list` | `griptape.api.rule.list` | `read` | List rules |
| `rule.update` | `griptape.api.rule.update` | `write` | Update a rule |
| `ruleset.create` | `griptape.api.ruleset.create` | `write` | Create a ruleset |
| `ruleset.delete` | `griptape.api.ruleset.delete` | `destructive` | Delete a ruleset |
| `ruleset.get` | `griptape.api.ruleset.get` | `read` | Get a ruleset |
| `ruleset.getByAlias` | `griptape.api.ruleset.getByAlias` | `read` | Get a ruleset by alias |
| `ruleset.update` | `griptape.api.ruleset.update` | `write` | Update a ruleset |
| `secret.create` | `griptape.api.secret.create` | `write` | Create a secret |
| `secret.delete` | `griptape.api.secret.delete` | `destructive` | Delete a secret |
| `secret.get` | `griptape.api.secret.get` | `read` | Get a secret |
| `secret.list` | `griptape.api.secret.list` | `read` | List secrets |
| `secret.update` | `griptape.api.secret.update` | `write` | Update a secret |
| `structure.create` | `griptape.api.structure.create` | `write` | Create a structure |
| `structure.createDeployment` | `griptape.api.structure.createDeployment` | `write` | Create a structure deployment |
| `structure.dashboard` | `griptape.api.structure.dashboard` | `read` | Get structure dashboard metrics |
| `structure.delete` | `griptape.api.structure.delete` | `destructive` | Delete a structure |
| `structure.get` | `griptape.api.structure.get` | `read` | Get a structure |
| `structure.list` | `griptape.api.structure.list` | `read` | List structures |
| `structure.listDeployments` | `griptape.api.structure.listDeployments` | `read` | List deployments for a structure |
| `structure.listRuns` | `griptape.api.structure.listRuns` | `read` | List runs for a structure |
| `structure.update` | `griptape.api.structure.update` | `write` | Update a structure |
| `thread.create` | `griptape.api.thread.create` | `write` | Create a thread |
| `thread.delete` | `griptape.api.thread.delete` | `destructive` | Delete a thread |
| `thread.get` | `griptape.api.thread.get` | `read` | Get a thread |
| `thread.list` | `griptape.api.thread.list` | `read` | List threads |
| `thread.update` | `griptape.api.thread.update` | `write` | Update a thread |
| `threadMessage.create` | `griptape.api.threadMessage.create` | `write` | Create a message in a thread |
| `threadMessage.list` | `griptape.api.threadMessage.list` | `read` | List messages in a thread |
| `tool.create` | `griptape.api.tool.create` | `write` | Create a tool |
| `tool.createDeployment` | `griptape.api.tool.createDeployment` | `write` | Create a tool deployment |
| `tool.delete` | `griptape.api.tool.delete` | `destructive` | Delete a tool |
| `tool.deploymentStatus` | `griptape.api.tool.deploymentStatus` | `read` | Get a tool deployment status |
| `tool.get` | `griptape.api.tool.get` | `read` | Get a tool |
| `tool.list` | `griptape.api.tool.list` | `read` | List tools |
| `tool.listDeployments` | `griptape.api.tool.listDeployments` | `read` | List deployments for a tool |
| `tool.listRuns` | `griptape.api.tool.listRuns` | `read` | List runs for a tool |
| `tool.update` | `griptape.api.tool.update` | `write` | Update a tool |
| `usage.get` | `griptape.api.usage.get` | `read` | Get usage statistics |
| `user.deleteApiKey` | `griptape.api.user.deleteApiKey` | `destructive` | Delete an API key |
| `user.get` | `griptape.api.user.get` | `read` | Get a user |
| `user.getApiKey` | `griptape.api.user.getApiKey` | `read` | Get an API key |
| `user.list` | `griptape.api.user.list` | `read` | List users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/griptape

## License

Apache-2.0
