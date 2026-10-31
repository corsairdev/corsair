# @corsair-dev/render

Render plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/render
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `automation.cancelCronJobRun` | `render.api.automation.cancelCronJobRun` | `destructive` | Cancel a run of a Render cron job |
| `automation.cancelTaskRun` | `render.api.automation.cancelTaskRun` | `destructive` | Cancel a Render workflow task run |
| `automation.createDisk` | `render.api.automation.createDisk` | `write` | Create a disk for a Render service |
| `automation.createTaskRun` | `render.api.automation.createTaskRun` | `write` | Start a Render workflow task run |
| `automation.createWebhook` | `render.api.automation.createWebhook` | `write` | Create a webhook for a Render owner |
| `automation.createWorkflow` | `render.api.automation.createWorkflow` | `write` | Create a Render workflow |
| `automation.createWorkflowVersion` | `render.api.automation.createWorkflowVersion` | `write` | Create and deploy a Render workflow version |
| `automation.deleteDisk` | `render.api.automation.deleteDisk` | `destructive` | Delete a Render disk |
| `automation.deleteWebhook` | `render.api.automation.deleteWebhook` | `destructive` | Delete a Render webhook |
| `automation.deleteWorkflow` | `render.api.automation.deleteWorkflow` | `destructive` | Delete a Render workflow |
| `automation.listDisks` | `render.api.automation.listDisks` | `read` | List Render disks |
| `automation.listDiskSnapshots` | `render.api.automation.listDiskSnapshots` | `read` | List snapshots for a Render disk |
| `automation.listMaintenance` | `render.api.automation.listMaintenance` | `read` | List Render maintenance windows |
| `automation.listTaskRuns` | `render.api.automation.listTaskRuns` | `read` | List Render task runs |
| `automation.listTasks` | `render.api.automation.listTasks` | `read` | List Render tasks |
| `automation.listWebhookEvents` | `render.api.automation.listWebhookEvents` | `read` | List delivery events for a Render webhook |
| `automation.listWebhooks` | `render.api.automation.listWebhooks` | `read` | List Render webhooks |
| `automation.listWorkflows` | `render.api.automation.listWorkflows` | `read` | List Render workflows |
| `automation.listWorkflowVersions` | `render.api.automation.listWorkflowVersions` | `read` | List Render workflow versions |
| `automation.restoreDiskSnapshot` | `render.api.automation.restoreDiskSnapshot` | `write` | Restore a snapshot to a Render disk |
| `automation.retrieveDisk` | `render.api.automation.retrieveDisk` | `read` | Retrieve a Render disk |
| `automation.retrieveMaintenance` | `render.api.automation.retrieveMaintenance` | `read` | Retrieve a Render maintenance run |
| `automation.retrieveTask` | `render.api.automation.retrieveTask` | `read` | Retrieve a Render workflow task |
| `automation.retrieveTaskRun` | `render.api.automation.retrieveTaskRun` | `read` | Retrieve a Render workflow task run |
| `automation.retrieveWebhook` | `render.api.automation.retrieveWebhook` | `read` | Retrieve a Render webhook |
| `automation.retrieveWorkflow` | `render.api.automation.retrieveWorkflow` | `read` | Retrieve a Render workflow |
| `automation.retrieveWorkflowVersion` | `render.api.automation.retrieveWorkflowVersion` | `read` | Retrieve a Render workflow version |
| `automation.triggerCronJobRun` | `render.api.automation.triggerCronJobRun` | `write` | Trigger a run of a Render cron job |
| `automation.triggerMaintenance` | `render.api.automation.triggerMaintenance` | `write` | Trigger a Render maintenance run |
| `automation.updateDisk` | `render.api.automation.updateDisk` | `write` | Update a Render disk |
| `automation.updateMaintenance` | `render.api.automation.updateMaintenance` | `write` | Update a Render maintenance run |
| `automation.updateWebhook` | `render.api.automation.updateWebhook` | `write` | Update a Render webhook |
| `automation.updateWorkflow` | `render.api.automation.updateWorkflow` | `write` | Update a Render workflow |
| `blueprints.listSyncs` | `render.api.blueprints.listSyncs` | `read` | List syncs for a Render blueprint |
| `blueprints.retrieve` | `render.api.blueprints.retrieve` | `read` | Retrieve a Render Blueprint |
| `blueprints.update` | `render.api.blueprints.update` | `write` | Update a Render Blueprint |
| `blueprints.validate` | `render.api.blueprints.validate` | `read` | Validate a Render Blueprint configuration |
| `buildSources.builds.list` | `render.api.buildSources.builds.list` | `read` | List builds for a Render build source |
| `buildSources.builds.retrieve` | `render.api.buildSources.builds.retrieve` | `read` | Retrieve a Render build source build |
| `buildSources.builds.trigger` | `render.api.buildSources.builds.trigger` | `write` | Trigger a Render build source build |
| `buildSources.create` | `render.api.buildSources.create` | `write` | Create a Render build source |
| `buildSources.delete` | `render.api.buildSources.delete` | `destructive` | Delete a Render build source |
| `buildSources.envGroups.link` | `render.api.buildSources.envGroups.link` | `write` | Link an environment group to a Render build source |
| `buildSources.envGroups.unlink` | `render.api.buildSources.envGroups.unlink` | `destructive` | Unlink an environment group from a Render build source |
| `buildSources.envVars.delete` | `render.api.buildSources.envVars.delete` | `destructive` | Delete an environment variable from a Render build source |
| `buildSources.envVars.list` | `render.api.buildSources.envVars.list` | `read` | List environment variables for a Render build source |
| `buildSources.envVars.retrieve` | `render.api.buildSources.envVars.retrieve` | `read` | Retrieve an environment variable for a Render build source |
| `buildSources.envVars.update` | `render.api.buildSources.envVars.update` | `write` | Replace environment variables for a Render build source |
| `buildSources.envVars.upsert` | `render.api.buildSources.envVars.upsert` | `write` | Add or update an environment variable for a Render build source |
| `buildSources.list` | `render.api.buildSources.list` | `read` | List Render build sources |
| `buildSources.retrieve` | `render.api.buildSources.retrieve` | `read` | Retrieve a Render build source |
| `buildSources.secretFiles.delete` | `render.api.buildSources.secretFiles.delete` | `destructive` | Delete a secret file from a Render build source |
| `buildSources.secretFiles.list` | `render.api.buildSources.secretFiles.list` | `read` | List secret files for a Render build source |
| `buildSources.secretFiles.retrieve` | `render.api.buildSources.secretFiles.retrieve` | `read` | Retrieve a secret file for a Render build source |
| `buildSources.secretFiles.update` | `render.api.buildSources.secretFiles.update` | `write` | Replace secret files for a Render build source |
| `buildSources.secretFiles.upsert` | `render.api.buildSources.secretFiles.upsert` | `write` | Add or update a secret file for a Render build source |
| `buildSources.update` | `render.api.buildSources.update` | `write` | Update a Render build source |
| `dedicatedIps.create` | `render.api.dedicatedIps.create` | `write` | Create a Render dedicated IP set |
| `dedicatedIps.delete` | `render.api.dedicatedIps.delete` | `destructive` | Delete a Render dedicated IP set |
| `dedicatedIps.list` | `render.api.dedicatedIps.list` | `read` | List Render dedicated IP sets |
| `dedicatedIps.retrieve` | `render.api.dedicatedIps.retrieve` | `read` | Retrieve a Render dedicated IP set |
| `dedicatedIps.update` | `render.api.dedicatedIps.update` | `write` | Update a Render dedicated IP set |
| `events.retrieve` | `render.api.events.retrieve` | `read` | Retrieve a Render event |
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
| `final.retrieveOwnerMetricsStream` | `render.api.final.retrieveOwnerMetricsStream` | `read` | Retrieve metrics stream settings for a Render owner |
| `final.retrieveOwnerNotificationSettings` | `render.api.final.retrieveOwnerNotificationSettings` | `read` | Render retrieveOwnerNotificationSettings |
| `final.retrieveSecretFile` | `render.api.final.retrieveSecretFile` | `read` | Render retrieveSecretFile |
| `final.retrieveServiceNotificationOverrides` | `render.api.final.retrieveServiceNotificationOverrides` | `read` | Retrieve notification overrides for a Render service |
| `final.updateEnvGroupEnvVar` | `render.api.final.updateEnvGroupEnvVar` | `write` | Render updateEnvGroupEnvVar |
| `final.updateEnvGroupSecretFile` | `render.api.final.updateEnvGroupSecretFile` | `write` | Render updateEnvGroupSecretFile |
| `final.updateEnvVar` | `render.api.final.updateEnvVar` | `write` | Render updateEnvVar |
| `final.updateEnvVarsForService` | `render.api.final.updateEnvVarsForService` | `write` | Render updateEnvVarsForService |
| `final.updateHeaders` | `render.api.final.updateHeaders` | `write` | Render updateHeaders |
| `final.updateOwnerNotificationSettings` | `render.api.final.updateOwnerNotificationSettings` | `write` | Render updateOwnerNotificationSettings |
| `final.updateResourceLogStream` | `render.api.final.updateResourceLogStream` | `write` | Render updateResourceLogStream |
| `final.updateRoutes` | `render.api.final.updateRoutes` | `write` | Render updateRoutes |
| `final.updateSecretFilesForService` | `render.api.final.updateSecretFilesForService` | `write` | Render updateSecretFilesForService |
| `final.updateServiceNotificationOverrides` | `render.api.final.updateServiceNotificationOverrides` | `write` | Update notification overrides for a Render service |
| `final.upsertOwnerMetricsStream` | `render.api.final.upsertOwnerMetricsStream` | `write` | Create or update metrics stream settings for a Render owner |
| `final.verifyCustomDomain` | `render.api.final.verifyCustomDomain` | `write` | Render verifyCustomDomain |
| `keyValue.connectionInfo` | `render.api.keyValue.connectionInfo` | `read` | Retrieve connection info for a Render Key Value instance |
| `keyValue.create` | `render.api.keyValue.create` | `write` | Create a Render Key Value instance |
| `keyValue.resume` | `render.api.keyValue.resume` | `write` | Resume a Render Key Value instance |
| `keyValue.retrieve` | `render.api.keyValue.retrieve` | `read` | Retrieve a Render Key Value instance |
| `keyValue.suspend` | `render.api.keyValue.suspend` | `write` | Suspend a Render Key Value instance |
| `keyValue.update` | `render.api.keyValue.update` | `write` | Update a Render Key Value instance |
| `logs.deleteOwnerStream` | `render.api.logs.deleteOwnerStream` | `destructive` | Delete an owner log stream |
| `logs.deleteResourceStream` | `render.api.logs.deleteResourceStream` | `destructive` | Delete a Render resource log stream |
| `logs.list` | `render.api.logs.list` | `read` | List Render logs |
| `logs.resourceStreams` | `render.api.logs.resourceStreams` | `read` | List resource log streams |
| `logs.retrieveOwnerStream` | `render.api.logs.retrieveOwnerStream` | `read` | Retrieve a Render owner log stream |
| `logs.retrieveResourceStream` | `render.api.logs.retrieveResourceStream` | `read` | Retrieve a Render resource log stream |
| `logs.updateOwnerStream` | `render.api.logs.updateOwnerStream` | `write` | Update an owner log stream |
| `logs.values` | `render.api.logs.values` | `read` | List Render log values |
| `metrics.activeConnections` | `render.api.metrics.activeConnections` | `read` | Read active Render connections |
| `metrics.applicationFilterValues` | `render.api.metrics.applicationFilterValues` | `read` | List Render application metric filter values |
| `metrics.bandwidth` | `render.api.metrics.bandwidth` | `read` | Read Render bandwidth metrics |
| `metrics.bandwidthSources` | `render.api.metrics.bandwidthSources` | `read` | Read Render bandwidth sources |
| `metrics.cpu` | `render.api.metrics.cpu` | `read` | Read Render CPU metrics |
| `metrics.cpuLimit` | `render.api.metrics.cpuLimit` | `read` | Read Render CPU limits |
| `metrics.cpuTarget` | `render.api.metrics.cpuTarget` | `read` | Read Render CPU target metrics |
| `metrics.diskCapacity` | `render.api.metrics.diskCapacity` | `read` | Read Render disk capacity |
| `metrics.diskUsage` | `render.api.metrics.diskUsage` | `read` | Read Render disk usage |
| `metrics.httpFilterValues` | `render.api.metrics.httpFilterValues` | `read` | List Render HTTP metric filter values |
| `metrics.httpLatency` | `render.api.metrics.httpLatency` | `read` | Read Render HTTP latency metrics |
| `metrics.httpRequests` | `render.api.metrics.httpRequests` | `read` | Read Render HTTP request metrics |
| `metrics.instanceCount` | `render.api.metrics.instanceCount` | `read` | Read Render instance counts |
| `metrics.memory` | `render.api.metrics.memory` | `read` | Read Render memory metrics |
| `metrics.memoryLimit` | `render.api.metrics.memoryLimit` | `read` | Read Render memory limits |
| `metrics.memoryTarget` | `render.api.metrics.memoryTarget` | `read` | Read Render memory targets |
| `metrics.pathFilterValues` | `render.api.metrics.pathFilterValues` | `read` | List Render path metric filter values |
| `metrics.replicationLag` | `render.api.metrics.replicationLag` | `read` | Read Render replication lag metrics |
| `metrics.taskRunsCompleted` | `render.api.metrics.taskRunsCompleted` | `read` | Read completed Render task run metrics |
| `metrics.taskRunsQueued` | `render.api.metrics.taskRunsQueued` | `read` | Read queued Render task run metrics |
| `organizations.auditLogs` | `render.api.organizations.auditLogs` | `read` | List audit logs for a Render organization |
| `owners.auditLogs` | `render.api.owners.auditLogs` | `read` | List audit logs for a Render owner |
| `owners.list` | `render.api.owners.list` | `read` | List Render owners |
| `owners.members` | `render.api.owners.members` | `read` | List Render owner members |
| `owners.removeMember` | `render.api.owners.removeMember` | `destructive` | Remove a member from a Render workspace |
| `owners.retrieve` | `render.api.owners.retrieve` | `read` | Retrieve a Render owner |
| `owners.updateMember` | `render.api.owners.updateMember` | `write` | Update a Render workspace member role |
| `postgres.connectionInfo` | `render.api.postgres.connectionInfo` | `read` | Retrieve connection info for a Render Postgres instance |
| `postgres.create` | `render.api.postgres.create` | `write` | Create a Render Postgres database |
| `postgres.createExport` | `render.api.postgres.createExport` | `write` | Create an export of a Render Postgres database |
| `postgres.createUser` | `render.api.postgres.createUser` | `write` | Create a user for a Render Postgres database |
| `postgres.delete` | `render.api.postgres.delete` | `destructive` | Delete a Render Postgres database |
| `postgres.deleteUser` | `render.api.postgres.deleteUser` | `destructive` | Delete a user on a Render Postgres instance |
| `postgres.failover` | `render.api.postgres.failover` | `write` | Trigger a failover for a Render Postgres instance |
| `postgres.list` | `render.api.postgres.list` | `read` | List Render Postgres databases |
| `postgres.processes` | `render.api.postgres.processes` | `read` | List active queries for a Render Postgres database |
| `postgres.recover` | `render.api.postgres.recover` | `write` | Trigger point-in-time recovery for a Render Postgres instance |
| `postgres.recoveryInfo` | `render.api.postgres.recoveryInfo` | `read` | Retrieve point-in-time recovery status for a Render Postgres instance |
| `postgres.restart` | `render.api.postgres.restart` | `write` | Restart a Render Postgres instance |
| `postgres.resume` | `render.api.postgres.resume` | `write` | Resume a Render Postgres instance |
| `postgres.retrieve` | `render.api.postgres.retrieve` | `read` | Retrieve a Render Postgres database |
| `postgres.sizes` | `render.api.postgres.sizes` | `read` | List database sizes for a Render Postgres database |
| `postgres.suspend` | `render.api.postgres.suspend` | `write` | Suspend a Render Postgres instance |
| `postgres.tableScans` | `render.api.postgres.tableScans` | `read` | List table scans for a Render Postgres database |
| `postgres.topQueries` | `render.api.postgres.topQueries` | `read` | List top queries for a Render Postgres database |
| `postgres.update` | `render.api.postgres.update` | `write` | Update a Render Postgres database |
| `projects.create` | `render.api.projects.create` | `write` | Create a Render project |
| `projects.delete` | `render.api.projects.delete` | `destructive` | Delete a Render project |
| `projects.list` | `render.api.projects.list` | `read` | List Render projects |
| `projects.retrieve` | `render.api.projects.retrieve` | `read` | Retrieve a Render project |
| `projects.update` | `render.api.projects.update` | `write` | Update a Render project |
| `registryCredentials.create` | `render.api.registryCredentials.create` | `write` | Create registry credentials |
| `registryCredentials.delete` | `render.api.registryCredentials.delete` | `destructive` | Delete registry credentials |
| `registryCredentials.list` | `render.api.registryCredentials.list` | `read` | List registry credentials |
| `registryCredentials.retrieve` | `render.api.registryCredentials.retrieve` | `read` | Retrieve registry credentials |
| `registryCredentials.update` | `render.api.registryCredentials.update` | `write` | Update registry credentials |
| `services.cancelDeploy` | `render.api.services.cancelDeploy` | `write` | Cancel a Render deployment |
| `services.create` | `render.api.services.create` | `write` | Create a Render service |
| `services.createPreview` | `render.api.services.createPreview` | `write` | Create an image-backed preview for a Render service |
| `services.customDomains.delete` | `render.api.services.customDomains.delete` | `destructive` | Delete a custom domain from a Render service |
| `services.customDomains.list` | `render.api.services.customDomains.list` | `read` | List custom domains for a Render service |
| `services.delete` | `render.api.services.delete` | `destructive` | Delete a Render service |
| `services.deleteAutoscaling` | `render.api.services.deleteAutoscaling` | `destructive` | Delete autoscaling configuration for a Render service |
| `services.deleteHeader` | `render.api.services.deleteHeader` | `destructive` | Delete a header from a Render service |
| `services.deleteRoute` | `render.api.services.deleteRoute` | `destructive` | Delete a route from a Render service |
| `services.envGroups.create` | `render.api.services.envGroups.create` | `write` | Create a Render environment group |
| `services.envGroups.delete` | `render.api.services.envGroups.delete` | `destructive` | Delete a Render environment group |
| `services.envGroups.list` | `render.api.services.envGroups.list` | `read` | List Render environment groups |
| `services.envGroups.retrieve` | `render.api.services.envGroups.retrieve` | `read` | Retrieve a Render environment group |
| `services.envGroups.unlinkService` | `render.api.services.envGroups.unlinkService` | `destructive` | Unlink a Render service from an environment group |
| `services.envGroups.update` | `render.api.services.envGroups.update` | `write` | Update a Render environment group |
| `services.environments.create` | `render.api.services.environments.create` | `write` | Create a Render environment |
| `services.environments.delete` | `render.api.services.environments.delete` | `destructive` | Delete a Render environment |
| `services.environments.list` | `render.api.services.environments.list` | `read` | List Render environments |
| `services.environments.removeResources` | `render.api.services.environments.removeResources` | `destructive` | Remove resources from a Render environment |
| `services.environments.retrieve` | `render.api.services.environments.retrieve` | `read` | Retrieve a Render environment |
| `services.environments.update` | `render.api.services.environments.update` | `write` | Update a Render environment |
| `services.envVars.delete` | `render.api.services.envVars.delete` | `destructive` | Delete an environment variable from a Render service |
| `services.envVars.list` | `render.api.services.envVars.list` | `read` | List environment variables for a Render service |
| `services.headers.list` | `render.api.services.headers.list` | `read` | List headers for a Render service |
| `services.jobs.cancel` | `render.api.services.jobs.cancel` | `write` | Cancel a running job on a Render service |
| `services.jobs.create` | `render.api.services.jobs.create` | `write` | Create a job run for a Render service |
| `services.jobs.list` | `render.api.services.jobs.list` | `read` | List jobs for a Render service |
| `services.jobs.retrieve` | `render.api.services.jobs.retrieve` | `read` | Retrieve a Render service job |
| `services.list` | `render.api.services.list` | `read` | List Render services accessible to the authenticated owner |
| `services.listDeploys` | `render.api.services.listDeploys` | `read` | List deployments for a Render service |
| `services.listEvents` | `render.api.services.listEvents` | `read` | List events for a Render service |
| `services.listOutboundIps` | `render.api.services.listOutboundIps` | `read` | List outbound IPs for a Render service |
| `services.patchRoute` | `render.api.services.patchRoute` | `write` | Update a route on a Render service |
| `services.purgeCache` | `render.api.services.purgeCache` | `write` | Purge the cache for a Render service |
| `services.restart` | `render.api.services.restart` | `write` | Restart a Render service |
| `services.resume` | `render.api.services.resume` | `write` | Resume a Render service |
| `services.retrieve` | `render.api.services.retrieve` | `read` | Retrieve a Render service |
| `services.rollbackDeploy` | `render.api.services.rollbackDeploy` | `write` | Roll back a Render service deployment |
| `services.scale` | `render.api.services.scale` | `write` | Scale a Render service to a fixed instance count |
| `services.suspend` | `render.api.services.suspend` | `write` | Suspend a Render service |
| `services.triggerDeploy` | `render.api.services.triggerDeploy` | `write` | Trigger a Render deployment |
| `services.update` | `render.api.services.update` | `write` | Update a Render service |
| `services.updateAutoscaling` | `render.api.services.updateAutoscaling` | `write` | Update autoscaling for a Render service |
| `user.get` | `render.api.user.get` | `read` | Retrieve the authenticated Render user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/render

## License

Apache-2.0
