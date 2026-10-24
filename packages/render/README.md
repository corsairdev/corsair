# @corsair-dev/render

Render plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/render
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `automation.listDisks` | `render.api.automation.listDisks` | `read` | List Render disks |
| `automation.listMaintenance` | `render.api.automation.listMaintenance` | `read` | List Render maintenance windows |
| `automation.listTaskRuns` | `render.api.automation.listTaskRuns` | `read` | List Render task runs |
| `automation.listTasks` | `render.api.automation.listTasks` | `read` | List Render tasks |
| `automation.listWebhooks` | `render.api.automation.listWebhooks` | `read` | List Render webhooks |
| `automation.listWorkflows` | `render.api.automation.listWorkflows` | `read` | List Render workflows |
| `automation.listWorkflowVersions` | `render.api.automation.listWorkflowVersions` | `read` | List Render workflow versions |
| `automation.streamTaskRunsEvents` | `render.api.automation.streamTaskRunsEvents` | `read` | Stream Render task run events |
| `final.addHeaders` | `render.api.final.addHeaders` | `write` | Render addHeaders |
| `final.addOrUpdateSecretFile` | `render.api.final.addOrUpdateSecretFile` | `write` | Render addOrUpdateSecretFile |
| `final.addResourcesToEnvironment` | `render.api.final.addResourcesToEnvironment` | `write` | Render addResourcesToEnvironment |
| `final.addRoute` | `render.api.final.addRoute` | `write` | Render addRoute |
| `final.createCustomDomain` | `render.api.final.createCustomDomain` | `write` | Render createCustomDomain |
| `final.deleteEnvGroupEnvVar` | `render.api.final.deleteEnvGroupEnvVar` | `destructive` | Render deleteEnvGroupEnvVar |
| `final.deleteEnvGroupSecretFile` | `render.api.final.deleteEnvGroupSecretFile` | `destructive` | Render deleteEnvGroupSecretFile |
| `final.deleteKeyValue` | `render.api.final.deleteKeyValue` | `destructive` | Render deleteKeyValue |
| `final.deleteOwnerMetricsStream` | `render.api.final.deleteOwnerMetricsStream` | `destructive` | Render deleteOwnerMetricsStream |
| `final.deleteSecretFile` | `render.api.final.deleteSecretFile` | `destructive` | Render deleteSecretFile |
| `final.disconnectBlueprint` | `render.api.final.disconnectBlueprint` | `destructive` | Render disconnectBlueprint |
| `final.linkServiceToEnvGroup` | `render.api.final.linkServiceToEnvGroup` | `write` | Render linkServiceToEnvGroup |
| `final.listBlueprints` | `render.api.final.listBlueprints` | `read` | Render listBlueprints |
| `final.listInstances` | `render.api.final.listInstances` | `read` | Render listInstances |
| `final.listKeyValue` | `render.api.final.listKeyValue` | `read` | Render listKeyValue |
| `final.listNotificationOverrides` | `render.api.final.listNotificationOverrides` | `read` | Render listNotificationOverrides |
| `final.listPostgresExport` | `render.api.final.listPostgresExport` | `read` | Render listPostgresExport |
| `final.listPostgresUsers` | `render.api.final.listPostgresUsers` | `read` | Render listPostgresUsers |
| `final.listRoutes` | `render.api.final.listRoutes` | `read` | Render listRoutes |
| `final.listSecretFiles` | `render.api.final.listSecretFiles` | `read` | Render listSecretFiles |
| `final.retrieveCustomDomain` | `render.api.final.retrieveCustomDomain` | `read` | Render retrieveCustomDomain |
| `final.retrieveDeploy` | `render.api.final.retrieveDeploy` | `read` | Render retrieveDeploy |
| `final.retrieveEnvGroupEnvVar` | `render.api.final.retrieveEnvGroupEnvVar` | `read` | Render retrieveEnvGroupEnvVar |
| `final.retrieveEnvGroupSecretFile` | `render.api.final.retrieveEnvGroupSecretFile` | `read` | Render retrieveEnvGroupSecretFile |
| `final.retrieveEnvVar` | `render.api.final.retrieveEnvVar` | `read` | Render retrieveEnvVar |
| `final.retrieveOwnerNotificationSettings` | `render.api.final.retrieveOwnerNotificationSettings` | `read` | Render retrieveOwnerNotificationSettings |
| `final.retrieveSecretFile` | `render.api.final.retrieveSecretFile` | `read` | Render retrieveSecretFile |
| `final.updateEnvGroupEnvVar` | `render.api.final.updateEnvGroupEnvVar` | `write` | Render updateEnvGroupEnvVar |
| `final.updateEnvGroupSecretFile` | `render.api.final.updateEnvGroupSecretFile` | `write` | Render updateEnvGroupSecretFile |
| `final.updateEnvVar` | `render.api.final.updateEnvVar` | `write` | Render updateEnvVar |
| `final.updateEnvVarsForService` | `render.api.final.updateEnvVarsForService` | `write` | Render updateEnvVarsForService |
| `final.updateHeaders` | `render.api.final.updateHeaders` | `write` | Render updateHeaders |
| `final.updateOwnerNotificationSettings` | `render.api.final.updateOwnerNotificationSettings` | `write` | Render updateOwnerNotificationSettings |
| `final.updateResourceLogStream` | `render.api.final.updateResourceLogStream` | `write` | Render updateResourceLogStream |
| `final.updateRoutes` | `render.api.final.updateRoutes` | `write` | Render updateRoutes |
| `final.updateSecretFilesForService` | `render.api.final.updateSecretFilesForService` | `write` | Render updateSecretFilesForService |
| `final.verifyCustomDomain` | `render.api.final.verifyCustomDomain` | `write` | Render verifyCustomDomain |
| `logs.deleteOwnerStream` | `render.api.logs.deleteOwnerStream` | `destructive` | Delete an owner log stream |
| `logs.list` | `render.api.logs.list` | `read` | List Render logs |
| `logs.resourceStreams` | `render.api.logs.resourceStreams` | `read` | List resource log streams |
| `logs.subscribe` | `render.api.logs.subscribe` | `read` | Subscribe to Render logs |
| `logs.updateOwnerStream` | `render.api.logs.updateOwnerStream` | `write` | Update an owner log stream |
| `logs.values` | `render.api.logs.values` | `read` | List Render log values |
| `metrics.activeConnections` | `render.api.metrics.activeConnections` | `read` | Read active Render connections |
| `metrics.applicationFilterValues` | `render.api.metrics.applicationFilterValues` | `read` | List Render application metric filter values |
| `metrics.bandwidthSources` | `render.api.metrics.bandwidthSources` | `read` | Read Render bandwidth sources |
| `metrics.cpu` | `render.api.metrics.cpu` | `read` | Read Render CPU metrics |
| `metrics.cpuLimit` | `render.api.metrics.cpuLimit` | `read` | Read Render CPU limits |
| `metrics.diskCapacity` | `render.api.metrics.diskCapacity` | `read` | Read Render disk capacity |
| `metrics.diskUsage` | `render.api.metrics.diskUsage` | `read` | Read Render disk usage |
| `metrics.instanceCount` | `render.api.metrics.instanceCount` | `read` | Read Render instance counts |
| `metrics.memory` | `render.api.metrics.memory` | `read` | Read Render memory metrics |
| `metrics.memoryLimit` | `render.api.metrics.memoryLimit` | `read` | Read Render memory limits |
| `metrics.memoryTarget` | `render.api.metrics.memoryTarget` | `read` | Read Render memory targets |
| `owners.list` | `render.api.owners.list` | `read` | List Render owners |
| `owners.members` | `render.api.owners.members` | `read` | List Render owner members |
| `owners.retrieve` | `render.api.owners.retrieve` | `read` | Retrieve a Render owner |
| `postgres.create` | `render.api.postgres.create` | `write` | Create a Render Postgres database |
| `postgres.list` | `render.api.postgres.list` | `read` | List Render Postgres databases |
| `postgres.retrieve` | `render.api.postgres.retrieve` | `read` | Retrieve a Render Postgres database |
| `postgres.update` | `render.api.postgres.update` | `write` | Update a Render Postgres database |
| `projects.create` | `render.api.projects.create` | `write` | Create a Render project |
| `projects.list` | `render.api.projects.list` | `read` | List Render projects |
| `projects.retrieve` | `render.api.projects.retrieve` | `read` | Retrieve a Render project |
| `projects.update` | `render.api.projects.update` | `write` | Update a Render project |
| `registryCredentials.create` | `render.api.registryCredentials.create` | `write` | Create registry credentials |
| `registryCredentials.delete` | `render.api.registryCredentials.delete` | `destructive` | Delete registry credentials |
| `registryCredentials.list` | `render.api.registryCredentials.list` | `read` | List registry credentials |
| `registryCredentials.retrieve` | `render.api.registryCredentials.retrieve` | `read` | Retrieve registry credentials |
| `registryCredentials.update` | `render.api.registryCredentials.update` | `write` | Update registry credentials |
| `services.delete` | `render.api.services.delete` | `destructive` | Delete a Render service |
| `services.envGroups.create` | `render.api.services.envGroups.create` | `write` | Create a Render environment group |
| `services.envGroups.delete` | `render.api.services.envGroups.delete` | `destructive` | Delete a Render environment group |
| `services.envGroups.list` | `render.api.services.envGroups.list` | `read` | List Render environment groups |
| `services.envGroups.retrieve` | `render.api.services.envGroups.retrieve` | `read` | Retrieve a Render environment group |
| `services.envGroups.update` | `render.api.services.envGroups.update` | `write` | Update a Render environment group |
| `services.environments.create` | `render.api.services.environments.create` | `write` | Create a Render environment |
| `services.environments.delete` | `render.api.services.environments.delete` | `destructive` | Delete a Render environment |
| `services.environments.list` | `render.api.services.environments.list` | `read` | List Render environments |
| `services.environments.retrieve` | `render.api.services.environments.retrieve` | `read` | Retrieve a Render environment |
| `services.environments.update` | `render.api.services.environments.update` | `write` | Update a Render environment |
| `services.list` | `render.api.services.list` | `read` | List Render services accessible to the authenticated owner |
| `services.restart` | `render.api.services.restart` | `write` | Restart a Render service |
| `services.resume` | `render.api.services.resume` | `write` | Resume a Render service |
| `services.retrieve` | `render.api.services.retrieve` | `read` | Retrieve a Render service |
| `services.suspend` | `render.api.services.suspend` | `write` | Suspend a Render service |
| `services.triggerDeploy` | `render.api.services.triggerDeploy` | `write` | Trigger a Render deployment |
| `services.update` | `render.api.services.update` | `write` | Update a Render service |
| `user.get` | `render.api.user.get` | `read` | Retrieve the authenticated Render user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/render

## License

Apache-2.0
