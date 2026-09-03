# @corsair-dev/circleci

CircleCI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/circleci
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contexts.create` | `circleci.api.contexts.create` | `write` | Create a context (REST) |
| `contexts.createRestriction` | `circleci.api.contexts.createRestriction` | `write` | Add a restriction to a context |
| `contexts.deleteRestriction` | `circleci.api.contexts.deleteRestriction` | `destructive` | Remove a restriction from a context |
| `contexts.get` | `circleci.api.contexts.get` | `read` | Retrieve a context by id |
| `contexts.listEnvVars` | `circleci.api.contexts.listEnvVars` | `read` | List a context's environment variables |
| `contexts.upsertEnvVar` | `circleci.api.contexts.upsertEnvVar` | `write` | Add or update a context environment variable (REST) |
| `contextsGraphQL.create` | `circleci.api.contextsGraphQL.create` | `write` | Create a context (GraphQL) |
| `contextsGraphQL.delete` | `circleci.api.contextsGraphQL.delete` | `destructive` | Permanently delete a context and its environment variables (GraphQL) |
| `contextsGraphQL.query` | `circleci.api.contextsGraphQL.query` | `read` | Retrieve a context by id (GraphQL) |
| `contextsGraphQL.removeEnvVar` | `circleci.api.contextsGraphQL.removeEnvVar` | `destructive` | Remove a context environment variable (GraphQL) |
| `contextsGraphQL.storeEnvVar` | `circleci.api.contextsGraphQL.storeEnvVar` | `write` | Add or update a context environment variable (GraphQL) |
| `groups.create` | `circleci.api.groups.create` | `write` | Create an organization group |
| `groups.delete` | `circleci.api.groups.delete` | `destructive` | Permanently delete an organization group |
| `groups.get` | `circleci.api.groups.get` | `read` | Retrieve an organization group |
| `groups.list` | `circleci.api.groups.list` | `read` | List an organization's groups |
| `insights.branches` | `circleci.api.insights.branches` | `read` | List branches with workflow runs |
| `insights.flakyTests` | `circleci.api.insights.flakyTests` | `read` | Get flaky tests for a project |
| `insights.orgSummary` | `circleci.api.insights.orgSummary` | `read` | Get org-wide summary metrics with trends |
| `insights.pagesSummary` | `circleci.api.insights.pagesSummary` | `read` | Get summary metrics and trends for a project |
| `insights.planMetrics` | `circleci.api.insights.planMetrics` | `read` | Get plan/credit-usage metrics by project and org for a date range (same route as insights.orgSummary) |
| `insights.projectWorkflows` | `circleci.api.insights.projectWorkflows` | `read` | Get summary metrics for all of a project's workflows |
| `jobs.getArtifacts` | `circleci.api.jobs.getArtifacts` | `read` | List a job's stored artifacts by number |
| `jobs.getDetails` | `circleci.api.jobs.getDetails` | `read` | Fetch a job's status, timing and executor by number |
| `jobs.getTestMetadata` | `circleci.api.jobs.getTestMetadata` | `read` | Fetch a job's stored test results by number |
| `namespace.delete` | `circleci.api.namespace.delete` | `destructive` | Permanently delete a namespace and all its orbs |
| `namespace.deleteAlias` | `circleci.api.namespace.deleteAlias` | `destructive` | Remove a namespace alias (GraphQL) |
| `namespace.queryExists` | `circleci.api.namespace.queryExists` | `read` | Check whether a namespace name exists |
| `namespace.rename` | `circleci.api.namespace.rename` | `write` | Rename a namespace |
| `orbAllowlist.create` | `circleci.api.orbAllowlist.create` | `write` | Add a URL orb allow-list entry |
| `orbAllowlist.delete` | `circleci.api.orbAllowlist.delete` | `destructive` | Remove a URL orb allow-list entry |
| `orbs.getDetails` | `circleci.api.orbs.getDetails` | `read` | Fetch an orb's metadata and versions |
| `orbs.getVersion` | `circleci.api.orbs.getVersion` | `read` | Fetch one orb version |
| `orbs.listCategories` | `circleci.api.orbs.listCategories` | `read` | List orb categories |
| `orbs.listNamespaceOrbs` | `circleci.api.orbs.listNamespaceOrbs` | `read` | List orbs in a namespace |
| `orbs.listOrbs` | `circleci.api.orbs.listOrbs` | `read` | List orbs across the registry |
| `orbs.queryCategoryId` | `circleci.api.orbs.queryCategoryId` | `read` | Fetch a category's id by name |
| `orbs.queryExists` | `circleci.api.orbs.queryExists` | `read` | Check whether an orb exists |
| `orbs.queryId` | `circleci.api.orbs.queryId` | `read` | Fetch an orb's id by name |
| `orbs.queryLatestVersion` | `circleci.api.orbs.queryLatestVersion` | `read` | Fetch an orb's latest published version |
| `orbs.querySource` | `circleci.api.orbs.querySource` | `read` | Fetch an orb version's source YAML |
| `orbs.validateConfig` | `circleci.api.orbs.validateConfig` | `read` | Validate orb YAML |
| `organization.get` | `circleci.api.organization.get` | `read` | Retrieve an organization by id (GraphQL) |
| `pipelineDefinitions.get` | `circleci.api.pipelineDefinitions.get` | `read` | Retrieve a pipeline definition |
| `pipelineDefinitions.list` | `circleci.api.pipelineDefinitions.list` | `read` | List a project's pipeline definitions |
| `pipelines.getConfig` | `circleci.api.pipelines.getConfig` | `read` | Fetch a pipeline's config |
| `pipelines.list` | `circleci.api.pipelines.list` | `read` | List pipelines for an organization |
| `pipelines.listForProject` | `circleci.api.pipelines.listForProject` | `read` | List a project's pipelines |
| `pipelines.trigger` | `circleci.api.pipelines.trigger` | `write` | Start a new pipeline run on a branch or tag |
| `projectEnvVars.create` | `circleci.api.projectEnvVars.create` | `write` | Create a project environment variable |
| `projectEnvVars.delete` | `circleci.api.projectEnvVars.delete` | `destructive` | Delete a project environment variable |
| `projectEnvVars.list` | `circleci.api.projectEnvVars.list` | `read` | List a project's environment variables |
| `projects.create` | `circleci.api.projects.create` | `write` | Follow a repository as a new project |
| `projects.delete` | `circleci.api.projects.delete` | `destructive` | Permanently remove a project and its settings |
| `projects.get` | `circleci.api.projects.get` | `read` | Retrieve a project by slug |
| `runners.list` | `circleci.api.runners.list` | `read` | List self-hosted runners |
| `schedules.list` | `circleci.api.schedules.list` | `read` | List a project's scheduled pipeline triggers |
| `usageExport.create` | `circleci.api.usageExport.create` | `write` | Create a usage export job |
| `usageExport.get` | `circleci.api.usageExport.get` | `read` | Retrieve a usage export job |
| `user.getCurrent` | `circleci.api.user.getCurrent` | `read` | Read the authenticated user's own profile |
| `user.getInfo` | `circleci.api.user.getInfo` | `read` | Read another user's profile by id |
| `user.listCollaborations` | `circleci.api.user.listCollaborations` | `read` | List organizations the caller can collaborate on |
| `workflows.getSummary` | `circleci.api.workflows.getSummary` | `read` | Get metrics and trends for a workflow |
| `workflows.listByPipelineId` | `circleci.api.workflows.listByPipelineId` | `read` | List a pipeline's workflows |
| `workflows.listJobs` | `circleci.api.workflows.listJobs` | `read` | Get summary metrics for a workflow's jobs |
| `workflows.listTestMetrics` | `circleci.api.workflows.listTestMetrics` | `read` | Get test metrics for a workflow |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/circleci

## License

Apache-2.0
