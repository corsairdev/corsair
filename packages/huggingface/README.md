# @corsair-dev/huggingface

Hugging Face plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/huggingface
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.deleteNotifications` | `huggingface.api.account.deleteNotifications` | `destructive` | Delete notifications by discussion ids or filters |
| `account.getWhoami` | `huggingface.api.account.getWhoami` | `read` | Get authenticated Hugging Face user info |
| `account.listNotifications` | `huggingface.api.account.listNotifications` | `read` | List notifications for the authenticated user |
| `collections.create` | `huggingface.api.collections.create` | `write` | Create a new collection |
| `collections.list` | `huggingface.api.collections.list` | `read` | List collections on the Hub |
| `datasets.checkUploadMethod` | `huggingface.api.datasets.checkUploadMethod` | `read` | Check LFS vs regular upload method for dataset files |
| `datasets.checkValidity` | `huggingface.api.datasets.checkValidity` | `read` | Check whether a dataset is valid on the Hub viewer |
| `datasets.createBranch` | `huggingface.api.datasets.createBranch` | `write` | Create a branch on a dataset |
| `datasets.createCommit` | `huggingface.api.datasets.createCommit` | `write` | Create a commit on a dataset (Hub NDJSON/JSON: files, deletedEntries, lfsFiles) |
| `datasets.createSqlConsoleEmbed` | `huggingface.api.datasets.createSqlConsoleEmbed` | `write` | Create a SQL Console embed for a dataset |
| `datasets.createTag` | `huggingface.api.datasets.createTag` | `write` | Create a tag on a dataset |
| `datasets.deleteBranch` | `huggingface.api.datasets.deleteBranch` | `destructive` | Delete a branch on a dataset |
| `datasets.deleteTag` | `huggingface.api.datasets.deleteTag` | `destructive` | Delete a tag on a dataset |
| `datasets.filterRows` | `huggingface.api.datasets.filterRows` | `read` | Filter dataset rows with SQL-like where clause |
| `datasets.get` | `huggingface.api.datasets.get` | `read` | Get dataset repository info |
| `datasets.getCompare` | `huggingface.api.datasets.getCompare` | `read` | Compare two revisions of a dataset |
| `datasets.getCroissant` | `huggingface.api.datasets.getCroissant` | `read` | Get Croissant JSON-LD metadata for a dataset |
| `datasets.getFirstRows` | `huggingface.api.datasets.getFirstRows` | `read` | Get first ~100 rows of a dataset split |
| `datasets.getInfo` | `huggingface.api.datasets.getInfo` | `read` | Get dataset info (features, splits, citation) |
| `datasets.getJwt` | `huggingface.api.datasets.getJwt` | `read` | Get JWT for a dataset repo |
| `datasets.getLeaderboard` | `huggingface.api.datasets.getLeaderboard` | `read` | Get evaluation leaderboard for a dataset |
| `datasets.getNotebook` | `huggingface.api.datasets.getNotebook` | `read` | Get notebook URL from a dataset |
| `datasets.getResolve` | `huggingface.api.datasets.getResolve` | `read` | Resolve a file from a dataset (follows redirects / XET info) |
| `datasets.getResolveCache` | `huggingface.api.datasets.getResolveCache` | `read` | Resolve a file from dataset cache |
| `datasets.getRows` | `huggingface.api.datasets.getRows` | `read` | Get a slice of dataset rows (offset/length) |
| `datasets.getScan` | `huggingface.api.datasets.getScan` | `read` | Get security scan status for a dataset |
| `datasets.getSize` | `huggingface.api.datasets.getSize` | `read` | Get dataset size (rows and bytes) |
| `datasets.getStatistics` | `huggingface.api.datasets.getStatistics` | `read` | Get statistics for a dataset split |
| `datasets.getTagsByType` | `huggingface.api.datasets.getTagsByType` | `read` | Get dataset tags grouped by type |
| `datasets.getTreeSize` | `huggingface.api.datasets.getTreeSize` | `read` | Get repository tree size for a dataset |
| `datasets.getXetReadToken` | `huggingface.api.datasets.getXetReadToken` | `read` | Get XET read token for a dataset |
| `datasets.handleAccessRequest` | `huggingface.api.datasets.handleAccessRequest` | `write` | Accept/reject gated dataset access request |
| `datasets.list` | `huggingface.api.datasets.list` | `read` | List datasets on the Hub |
| `datasets.listAccessRequests` | `huggingface.api.datasets.listAccessRequests` | `read` | List access requests for a gated dataset |
| `datasets.listCommits` | `huggingface.api.datasets.listCommits` | `read` | List commits for a dataset |
| `datasets.listParquetFiles` | `huggingface.api.datasets.listParquetFiles` | `read` | List Parquet files for a dataset |
| `datasets.listPathsInfo` | `huggingface.api.datasets.listPathsInfo` | `read` | List path metadata in a dataset |
| `datasets.listRefs` | `huggingface.api.datasets.listRefs` | `read` | List refs (branches/tags) for a dataset |
| `datasets.listSplits` | `huggingface.api.datasets.listSplits` | `read` | List dataset configurations and splits |
| `datasets.search` | `huggingface.api.datasets.search` | `read` | Full-text search within a dataset split |
| `datasets.squashCommits` | `huggingface.api.datasets.squashCommits` | `destructive` | Squash all commits in a dataset ref (irreversible) |
| `datasets.updateSettings` | `huggingface.api.datasets.updateSettings` | `write` | Update settings for a dataset repository |
| `datasets.updateSqlConsoleEmbed` | `huggingface.api.datasets.updateSqlConsoleEmbed` | `write` | Update a SQL Console embed |
| `discussions.changeStatus` | `huggingface.api.discussions.changeStatus` | `write` | Open or close a discussion |
| `discussions.create` | `huggingface.api.discussions.create` | `write` | Create a discussion on a repository |
| `discussions.createComment` | `huggingface.api.discussions.createComment` | `write` | Comment on a discussion |
| `discussions.delete` | `huggingface.api.discussions.delete` | `destructive` | Delete a discussion |
| `discussions.get` | `huggingface.api.discussions.get` | `read` | Get discussion details |
| `discussions.list` | `huggingface.api.discussions.list` | `read` | List discussions for a repository |
| `discussions.pin` | `huggingface.api.discussions.pin` | `write` | Pin or unpin a discussion |
| `discussions.updateTitle` | `huggingface.api.discussions.updateTitle` | `write` | Update discussion title |
| `docs.list` | `huggingface.api.docs.list` | `read` | List available Hugging Face documentation |
| `docs.search` | `huggingface.api.docs.search` | `read` | Search Hugging Face documentation |
| `endpoints.deleteNetworkCidr` | `huggingface.api.endpoints.deleteNetworkCidr` | `destructive` | Delete a network CIDR list entry for Inference Endpoints |
| `endpoints.list` | `huggingface.api.endpoints.list` | `read` | List Inference Endpoints for a namespace |
| `endpoints.listVendors` | `huggingface.api.endpoints.listVendors` | `read` | List cloud provider vendors for Inference Endpoints |
| `inference.chatCompletion` | `huggingface.api.inference.chatCompletion` | `write` | Generate chat completion via Inference Providers (OpenAI-compatible) |
| `inference.embeddings` | `huggingface.api.inference.embeddings` | `write` | Generate text embeddings via Inference Providers |
| `jobs.getHardware` | `huggingface.api.jobs.getHardware` | `read` | List available Jobs hardware |
| `models.checkUploadMethod` | `huggingface.api.models.checkUploadMethod` | `read` | Check LFS vs regular upload method for model files |
| `models.createBranch` | `huggingface.api.models.createBranch` | `write` | Create a branch on a model |
| `models.createCommit` | `huggingface.api.models.createCommit` | `write` | Create a commit on a model (Hub NDJSON/JSON: files, deletedEntries, lfsFiles) |
| `models.createTag` | `huggingface.api.models.createTag` | `write` | Create a tag on a model |
| `models.deleteBranch` | `huggingface.api.models.deleteBranch` | `destructive` | Delete a branch on a model |
| `models.deleteTag` | `huggingface.api.models.deleteTag` | `destructive` | Delete a tag on a model |
| `models.get` | `huggingface.api.models.get` | `read` | Get model repository info |
| `models.getCompare` | `huggingface.api.models.getCompare` | `read` | Compare two revisions of a model |
| `models.getJwt` | `huggingface.api.models.getJwt` | `read` | Get JWT for a model repo |
| `models.getNotebook` | `huggingface.api.models.getNotebook` | `read` | Get notebook URL from a model |
| `models.getResolve` | `huggingface.api.models.getResolve` | `read` | Resolve a file from a model (follows redirects / XET info) |
| `models.getResolveCache` | `huggingface.api.models.getResolveCache` | `read` | Resolve a file from model cache |
| `models.getScan` | `huggingface.api.models.getScan` | `read` | Get security scan status for a model |
| `models.getTagsByType` | `huggingface.api.models.getTagsByType` | `read` | Get model tags grouped by type |
| `models.getTreeSize` | `huggingface.api.models.getTreeSize` | `read` | Get repository tree size for a model |
| `models.getXetReadToken` | `huggingface.api.models.getXetReadToken` | `read` | Get XET read token for a model |
| `models.list` | `huggingface.api.models.list` | `read` | List models on the Hub |
| `models.listCommits` | `huggingface.api.models.listCommits` | `read` | List commits for a model |
| `models.listPathsInfo` | `huggingface.api.models.listPathsInfo` | `read` | List path metadata in a model |
| `models.listRefs` | `huggingface.api.models.listRefs` | `read` | List refs (branches/tags) for a model |
| `models.updateSettings` | `huggingface.api.models.updateSettings` | `write` | Update settings for a model repository |
| `organizations.getAvatar` | `huggingface.api.organizations.getAvatar` | `read` | Get organization avatar |
| `organizations.getMembers` | `huggingface.api.organizations.getMembers` | `read` | List organization members |
| `organizations.getSocials` | `huggingface.api.organizations.getSocials` | `read` | Get organization social handles |
| `papers.claimAuthorship` | `huggingface.api.papers.claimAuthorship` | `write` | Claim authorship of a paper |
| `papers.createComment` | `huggingface.api.papers.createComment` | `write` | Comment on a paper |
| `papers.createCommentReply` | `huggingface.api.papers.createCommentReply` | `write` | Reply to a paper comment |
| `papers.createIndex` | `huggingface.api.papers.createIndex` | `write` | Index an arXiv paper by id |
| `papers.getDaily` | `huggingface.api.papers.getDaily` | `read` | Get daily papers |
| `papers.search` | `huggingface.api.papers.search` | `read` | Search papers (hybrid semantic/full-text) |
| `repos.create` | `huggingface.api.repos.create` | `write` | Create a model, dataset, or Space repository |
| `repos.getResolve` | `huggingface.api.repos.getResolve` | `read` | Resolve a file in any repository type |
| `repos.listFiles` | `huggingface.api.repos.listFiles` | `read` | List repository file tree with pagination |
| `repos.requestAccess` | `huggingface.api.repos.requestAccess` | `write` | Request access to a gated repository |
| `settings.createWebhook` | `huggingface.api.settings.createWebhook` | `write` | Create a settings webhook |
| `settings.deleteWebhook` | `huggingface.api.settings.deleteWebhook` | `destructive` | Delete a settings webhook |
| `settings.getBillingUsageV2` | `huggingface.api.settings.getBillingUsageV2` | `read` | Get billing usage for a custom date range (unix timestamps) |
| `settings.getJobsUsage` | `huggingface.api.settings.getJobsUsage` | `read` | Get Jobs usage and billing for current subscription period |
| `settings.getLiveBillingUsage` | `huggingface.api.settings.getLiveBillingUsage` | `read` | Get live billing usage stream snapshot |
| `settings.getMcp` | `huggingface.api.settings.getMcp` | `read` | Get MCP tools configuration for the authenticated user |
| `settings.getWebhook` | `huggingface.api.settings.getWebhook` | `read` | Get a webhook by id |
| `settings.listWebhooks` | `huggingface.api.settings.listWebhooks` | `read` | List all webhooks in settings |
| `settings.updateNotifications` | `huggingface.api.settings.updateNotifications` | `write` | Update notification settings for the authenticated user |
| `settings.updateWatch` | `huggingface.api.settings.updateWatch` | `write` | Update watch settings (orgs/users/repos to follow) |
| `settings.updateWebhook` | `huggingface.api.settings.updateWebhook` | `write` | Update an existing settings webhook |
| `settings.updateWebhookStatus` | `huggingface.api.settings.updateWebhookStatus` | `write` | Enable or disable a webhook (action: enable\|disable) |
| `spaces.checkUploadMethod` | `huggingface.api.spaces.checkUploadMethod` | `read` | Check LFS vs regular upload method for space files |
| `spaces.createBranch` | `huggingface.api.spaces.createBranch` | `write` | Create a branch on a space |
| `spaces.createCommit` | `huggingface.api.spaces.createCommit` | `write` | Create a commit on a space (Hub NDJSON/JSON: files, deletedEntries, lfsFiles) |
| `spaces.createSecret` | `huggingface.api.spaces.createSecret` | `write` | Create or update a Space secret |
| `spaces.createTag` | `huggingface.api.spaces.createTag` | `write` | Create a tag on a space |
| `spaces.createVariable` | `huggingface.api.spaces.createVariable` | `write` | Create or update a Space variable |
| `spaces.deleteBranch` | `huggingface.api.spaces.deleteBranch` | `destructive` | Delete a branch on a space |
| `spaces.deleteSecret` | `huggingface.api.spaces.deleteSecret` | `destructive` | Delete a Space secret |
| `spaces.deleteTag` | `huggingface.api.spaces.deleteTag` | `destructive` | Delete a tag on a space |
| `spaces.deleteVariable` | `huggingface.api.spaces.deleteVariable` | `destructive` | Delete a Space variable |
| `spaces.get` | `huggingface.api.spaces.get` | `read` | Get space repository info |
| `spaces.getCompare` | `huggingface.api.spaces.getCompare` | `read` | Compare two revisions of a space |
| `spaces.getEvents` | `huggingface.api.spaces.getEvents` | `read` | Stream Space status events (SSE snapshot) |
| `spaces.getJwt` | `huggingface.api.spaces.getJwt` | `read` | Get JWT for a space repo |
| `spaces.getMetrics` | `huggingface.api.spaces.getMetrics` | `read` | Get live Space metrics (SSE snapshot) |
| `spaces.getNotebook` | `huggingface.api.spaces.getNotebook` | `read` | Get notebook URL from a space |
| `spaces.getResolve` | `huggingface.api.spaces.getResolve` | `read` | Resolve a file from a space (follows redirects / XET info) |
| `spaces.getResolveCache` | `huggingface.api.spaces.getResolveCache` | `read` | Resolve a file from space cache |
| `spaces.getScan` | `huggingface.api.spaces.getScan` | `read` | Get security scan status for a space |
| `spaces.getTreeSize` | `huggingface.api.spaces.getTreeSize` | `read` | Get repository tree size for a space |
| `spaces.getXetReadToken` | `huggingface.api.spaces.getXetReadToken` | `read` | Get XET read token for a space |
| `spaces.getXetWriteToken` | `huggingface.api.spaces.getXetWriteToken` | `write` | Get XET write token for a Space |
| `spaces.list` | `huggingface.api.spaces.list` | `read` | List spaces on the Hub |
| `spaces.listCommits` | `huggingface.api.spaces.listCommits` | `read` | List commits for a space |
| `spaces.listHardware` | `huggingface.api.spaces.listHardware` | `read` | List available Space hardware configurations |
| `spaces.listLfsFiles` | `huggingface.api.spaces.listLfsFiles` | `read` | List LFS files in a Space |
| `spaces.listPathsInfo` | `huggingface.api.spaces.listPathsInfo` | `read` | List path metadata in a space |
| `spaces.listRefs` | `huggingface.api.spaces.listRefs` | `read` | List refs (branches/tags) for a space |
| `spaces.squashCommits` | `huggingface.api.spaces.squashCommits` | `destructive` | Squash all commits in a Space ref (irreversible) |
| `spaces.updateSettings` | `huggingface.api.spaces.updateSettings` | `write` | Update settings for a space repository |
| `trending.get` | `huggingface.api.trending.get` | `read` | Get trending repositories |
| `users.getAvatar` | `huggingface.api.users.getAvatar` | `read` | Get user avatar URL |
| `users.getOverview` | `huggingface.api.users.getOverview` | `read` | Get user profile overview |
| `users.getSocials` | `huggingface.api.users.getSocials` | `read` | Get user social handles |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/huggingface

## License

Apache-2.0
