# @corsair-dev/railway

Railway integration for Corsair: projects, environments, services and service instances, deployments with logs, deploy, redeploy, restart and rollback, variables, domains and TCP proxies, volumes and backups, buckets, databases, templates, GitHub repo deploys, workspaces, members, invitations and tokens, notification rules, observability dashboards, metrics, HTTP logs and traces, usage limits, sandboxes and cloud agents (394 operations over Railway's public GraphQL API).

## Install

```bash
pnpm add @corsair-dev/railway
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accessGroupMembers.add` | `railway.api.accessGroupMembers.add` | `destructive` | Add a workspace member to an access group |
| `accessGroupMembers.remove` | `railway.api.accessGroupMembers.remove` | `destructive` | Remove a member from an access group |
| `accessGroupProjects.attach` | `railway.api.accessGroupProjects.attach` | `write` | Attach a project to an access group |
| `accessGroupProjects.detach` | `railway.api.accessGroupProjects.detach` | `write` | Detach a project from an access group |
| `accessGroups.create` | `railway.api.accessGroups.create` | `write` | Create an access group in a workspace |
| `accessGroups.delete` | `railway.api.accessGroups.delete` | `destructive` | Delete an access group |
| `accessGroups.update` | `railway.api.accessGroups.update` | `write` | Update an access group's name or role |
| `agentUsage.get` | `railway.api.agentUsage.get` | `read` | Get unified AI usage for a workspace |
| `agentUsage.setLimit` | `railway.api.agentUsage.setLimit` | `destructive` | Set agent usage limit for a workspace |
| `apiTokens.create` | `railway.api.apiTokens.create` | `destructive` | Creates a new API token |
| `apiTokens.current` | `railway.api.apiTokens.current` | `read` | Introspect the current API token and its accessible workspaces |
| `apiTokens.delete` | `railway.api.apiTokens.delete` | `destructive` | Deletes an API token |
| `apiTokens.list` | `railway.api.apiTokens.list` | `read` | Gets all API tokens for the authenticated user, one page at a time (first/after) |
| `auditLogs.eventTypes` | `railway.api.auditLogs.eventTypes` | `read` | Get a list of all audit log event types and their description |
| `auditLogs.get` | `railway.api.auditLogs.get` | `read` | Get an audit log by ID |
| `auditLogs.list` | `railway.api.auditLogs.list` | `read` | Gets audit logs for a workspace, one page at a time (first/after) |
| `billing.createFreePlanSubscription` | `railway.api.billing.createFreePlanSubscription` | `destructive` | Create a free plan subscription for a customer |
| `billing.togglePayoutsToCredits` | `railway.api.billing.togglePayoutsToCredits` | `destructive` | Toggle whether a customer is automatically withdrawing to credits |
| `botScopeBindings.list` | `railway.api.botScopeBindings.list` | `read` | Railway agent chat bindings (Slack/Discord scope → workspace) across the caller's workspaces |
| `botScopeBindings.remove` | `railway.api.botScopeBindings.remove` | `destructive` | Remove a Railway agent chat binding. Requires admin on the binding's workspace |
| `buckets.create` | `railway.api.buckets.create` | `destructive` | Create a bucket in a project |
| `buckets.instanceDetails` | `railway.api.buckets.instanceDetails` | `read` | Get the S3-compatible credentials for a bucket |
| `buckets.resetCredentials` | `railway.api.buckets.resetCredentials` | `destructive` | Reset the credentials for a bucket in an environment |
| `buckets.s3Credentials` | `railway.api.buckets.s3Credentials` | `read` | Get the S3-compatible credentials for a bucket |
| `buckets.update` | `railway.api.buckets.update` | `write` | Updates a bucket |
| `canvasViews.merge` | `railway.api.canvasViews.merge` | `destructive` | Merge a canvas layout from one environment into another. Re-computes the merge from current state and applies mutations |
| `canvasViews.mergePreview` | `railway.api.canvasViews.mergePreview` | `read` | Preview a canvas layout merge from one environment to another. Returns the merged state and the mutations needed to reach it |
| `clearanceTokens.create` | `railway.api.clearanceTokens.create` | `destructive` | Creates a Railway Authentication token for a project's protected services and returns it once. Requires a workspace admin and the workspace's Railway Authentication entitlement |
| `clearanceTokens.revoke` | `railway.api.clearanceTokens.revoke` | `destructive` | Revokes a Railway Authentication token. Requires a workspace admin; works without the entitlement. Revoking a revoked token succeeds |
| `cloudAgentCheckpoints.create` | `railway.api.cloudAgentCheckpoints.create` | `destructive` | Checkpoint the agent's disk. Poll cloudAgentCheckpoint until SUCCEEDED |
| `cloudAgentCheckpoints.delete` | `railway.api.cloudAgentCheckpoints.delete` | `destructive` | Delete a checkpoint |
| `cloudAgentCheckpoints.get` | `railway.api.cloudAgentCheckpoints.get` | `read` | A cloud agent checkpoint by ID |
| `cloudAgentCheckpoints.list` | `railway.api.cloudAgentCheckpoints.list` | `read` | Cloud agent checkpoints in an environment, newest first, one page at a time (first/after) |
| `cloudAgentConsoleSessions.list` | `railway.api.cloudAgentConsoleSessions.list` | `read` | Shell and exec sessions running on a cloud agent's VM that you can reconnect to. Null if the agent has no running machine, one page at a time (first/after) |
| `cloudAgents.archive` | `railway.api.cloudAgents.archive` | `write` | Archive a cloud agent, hiding it from lists of unarchived agents. Requires permission to manage the agent |
| `cloudAgents.create` | `railway.api.cloudAgents.create` | `destructive` | Create a cloud agent |
| `cloudAgents.createDashboardFeedback` | `railway.api.cloudAgents.createDashboardFeedback` | `write` | Send feedback about the agent dashboard to the Railway team. True once delivered |
| `cloudAgents.createFeedback` | `railway.api.cloudAgents.createFeedback` | `write` | Send lightweight agent feedback to Railway. Returns the report ID after delivery |
| `cloudAgents.delete` | `railway.api.cloudAgents.delete` | `destructive` | Delete a cloud agent |
| `cloudAgents.deploy` | `railway.api.cloudAgents.deploy` | `destructive` | Build the agent's code inside its own VM and deploy it. Creates the named service (default: the agent's name) or reuses it. Needs an agent booted with the builder |
| `cloudAgents.fork` | `railway.api.cloudAgents.fork` | `destructive` | Duplicate a running cloud agent. With sessionId, the new agent keeps that chat and its history; without it, it starts with no chats |
| `cloudAgents.get` | `railway.api.cloudAgents.get` | `read` | A cloud agent by ID, within an environment. Null when the agent belongs to another one, so a caller cannot render an agent it has switched away from |
| `cloudAgents.list` | `railway.api.cloudAgents.list` | `read` | Cloud agents in an environment |
| `cloudAgents.listMine` | `railway.api.cloudAgents.listMine` | `read` | Cloud agents you own, across every project and environment you can reach. Answers "where are my agents" in one request; `cloudAgents` needs one call per environment. Machine fields (`status`, `domain`, `domains`) read the last observed state in batched queries, so selecting them across many environments is fine |
| `cloudAgents.markSeen` | `railway.api.cloudAgents.markSeen` | `write` | Mark the agent's finished and failed sessions as seen, or only sessionId's. Requires permission to manage the agent |
| `cloudAgents.renameSession` | `railway.api.cloudAgents.renameSession` | `write` | Set a session's title, shown over its generated one. An empty title clears it |
| `cloudAgents.sleep` | `railway.api.cloudAgents.sleep` | `write` | Sleep a running cloud agent, keeping its volume. Processes on the machine are terminated; waking re-runs its entrypoint |
| `cloudAgents.unarchive` | `railway.api.cloudAgents.unarchive` | `write` | Restore an archived cloud agent. Requires permission to manage the agent |
| `cloudAgents.wake` | `railway.api.cloudAgents.wake` | `destructive` | Wake a sleeping cloud agent |
| `cloudAgentTasks.cancel` | `railway.api.cloudAgentTasks.cancel` | `write` | Stop a task. Before its prompt is sent it never starts; after, only its own run is aborted. The task ends CANCELLED, with "The task was cancelled" as its error. A finished task is left as is |
| `cloudAgentTasks.dispatch` | `railway.api.cloudAgentTasks.dispatch` | `destructive` | Start a task and return its handle. Creates a fresh agent by default; replyToTaskId continues the original conversation |
| `cloudAgentTasks.get` | `railway.api.cloudAgentTasks.get` | `read` | Read a task turn without waking the VM: the latest on the agent/session, or taskId's |
| `cloudAgentTasks.list` | `railway.api.cloudAgentTasks.list` | `read` | List task records in an environment, newest first. Filter to one agent, or with sessionId to one session's turns |
| `cloudAgentTasks.models` | `railway.api.cloudAgentTasks.models` | `read` | The models a task in this environment can run on, and the default a new conversation starts on |
| `cloudAgentTasks.recover` | `railway.api.cloudAgentTasks.recover` | `destructive` | Recover the latest task response from the agent. May wake the VM |
| `cloudAgentTasks.respond` | `railway.api.cloudAgentTasks.respond` | `destructive` | Answer a question the task is waiting on. Wakes a sleeping VM to deliver it (the question survives sleep); poll cloudAgentTask for the outcome |
| `customDomains.create` | `railway.api.customDomains.create` | `write` | Creates a new custom domain |
| `customDomains.delete` | `railway.api.customDomains.delete` | `destructive` | Deletes a custom domain |
| `customDomains.get` | `railway.api.customDomains.get` | `read` | Fetch details for a custom domain |
| `customDomains.isAvailable` | `railway.api.customDomains.isAvailable` | `read` | Checks if a custom domain is available |
| `customDomains.issueCertificate` | `railway.api.customDomains.issueCertificate` | `destructive` | Issues a new certificate |
| `customDomains.update` | `railway.api.customDomains.update` | `write` | Updates a custom domain |
| `databases.cancelPitrHaWorkflow` | `railway.api.databases.cancelPitrHaWorkflow` | `write` | Cancels an in-progress PITR enable/disable rollout on an HA database cluster and resets its progress so the UI re-reads from the live cluster. No-ops when nothing is running |
| `databases.clearPitrHaWorkflowProgress` | `railway.api.databases.clearPitrHaWorkflowProgress` | `write` | Clears the recorded progress of a finished PITR enable/disable rollout so the Backups page starts fresh. A rollout still in progress cannot be cleared |
| `databases.disablePitrForHaCluster` | `railway.api.databases.disablePitrForHaCluster` | `write` | Disables point-in-time recovery on an HA database cluster with the same rolling rollout as enable. The backup bucket is left intact, so existing backup history is preserved |
| `databases.enablePitrForHaCluster` | `railway.api.databases.enablePitrForHaCluster` | `destructive` | Enables point-in-time recovery on an HA database cluster (Postgres HA, MySQL HA) with a rolling, near-zero-downtime rollout across its members. Safe to retry |
| `databases.mysqlPitrRestorableWindow` | `railway.api.databases.mysqlPitrRestorableWindow` | `read` | The point-in-time window a MySQL service's binlog archive can restore to, resolved from the archive bucket: the oldest full backup (floor), the newest shipped binlog (ceiling) and every full backup's timestamp. archiveConfigured is false when the service carries no complete BINLOG_ARCHIVE_* contract |
| `databases.passwordRotationProgress` | `railway.api.databases.passwordRotationProgress` | `read` | Progress of the HA password rotation running for a cluster, or null when none is |
| `databases.pitrHaClusterReplicationHealth` | `railway.api.databases.pitrHaClusterReplicationHealth` | `read` | Live replication health for an HA database cluster (Postgres HA, MySQL HA). Use it to gate the Enable/Disable PITR buttons so a rollout can't start while a member is too far behind to rejoin. Returns null when the service isn't an HA root |
| `databases.pitrHaWorkflowProgress` | `railway.api.databases.pitrHaWorkflowProgress` | `read` | One-shot read of the current progress of a PITR enable/disable rollout on an HA database cluster. Use it to rehydrate state on page load, then poll this field for updates. Returns null when no rollout has run recently |
| `databases.postgresHaClusterUptime` | `railway.api.databases.postgresHaClusterUptime` | `read` | One Postgres HA cluster's uptime SLI over the last N days: its row, its windows, its daily rollups. The cluster is named by any of its member services, since an environment can hold more than one. Errors when the service is not part of a Postgres HA cluster |
| `databases.resetPassword` | `railway.api.databases.resetPassword` | `destructive` | Reset database credentials, coordinating all members for an HA cluster. On an HA cluster the rotation keeps running after this returns (`rotationInProgress`); follow `databasePasswordRotationProgress` until it reports DONE |
| `deployments.approve` | `railway.api.deployments.approve` | `destructive` | Approves a deployment |
| `deployments.buildLogs` | `railway.api.deployments.buildLogs` | `read` | Get the build log lines of a deployment |
| `deployments.cancel` | `railway.api.deployments.cancel` | `write` | Cancels a deployment |
| `deployments.createInstanceExecution` | `railway.api.deployments.createInstanceExecution` | `destructive` | Invoke a deployment instance execution |
| `deployments.events` | `railway.api.deployments.events` | `read` | Get the deployment events for a deployment, one page at a time (first/after) |
| `deployments.get` | `railway.api.deployments.get` | `read` | Find a single deployment |
| `deployments.instanceExecutions` | `railway.api.deployments.instanceExecutions` | `read` | Get the deployment instance executions for a deployment, one page at a time (first/after) |
| `deployments.list` | `railway.api.deployments.list` | `read` | Get all deployments, one page at a time (first/after) |
| `deployments.logs` | `railway.api.deployments.logs` | `read` | Get the runtime log lines of a deployment, optionally filtered and between two dates |
| `deployments.redeploy` | `railway.api.deployments.redeploy` | `destructive` | Redeploys a deployment |
| `deployments.remove` | `railway.api.deployments.remove` | `destructive` | Removes a deployment |
| `deployments.restart` | `railway.api.deployments.restart` | `destructive` | Restarts a deployment |
| `deployments.rollback` | `railway.api.deployments.rollback` | `destructive` | Rolls back to a deployment |
| `deployments.snapshot` | `railway.api.deployments.snapshot` | `read` | Find a single DeploymentSnapshot |
| `deployments.stop` | `railway.api.deployments.stop` | `destructive` | Stops a deployment |
| `deploymentTriggers.create` | `railway.api.deploymentTriggers.create` | `write` | Creates a deployment trigger |
| `deploymentTriggers.delete` | `railway.api.deploymentTriggers.delete` | `destructive` | Deletes a deployment trigger |
| `deploymentTriggers.list` | `railway.api.deploymentTriggers.list` | `read` | All deployment triggers, one page at a time (first/after) |
| `deploymentTriggers.update` | `railway.api.deploymentTriggers.update` | `write` | Updates a deployment trigger |
| `dnsQueryLogs.list` | `railway.api.dnsQueryLogs.list` | `read` | Fetch individual DNS query logs for an environment |
| `dockerCompose.import` | `railway.api.dockerCompose.import` | `destructive` | Create services and volumes from docker compose |
| `domains.list` | `railway.api.domains.list` | `read` | All domains for a service instance |
| `egressGateways.clearAssociations` | `railway.api.egressGateways.clearAssociations` | `destructive` | Clear all egress gateway associations for a service instance |
| `egressGateways.createAssociation` | `railway.api.egressGateways.createAssociation` | `destructive` | Create a new egress gateway association for a service instance |
| `egressGateways.haMigrationPreview` | `railway.api.egressGateways.haMigrationPreview` | `read` | Preview the HA static egress IPs that would be assigned, without applying them. Set allEnvironments to cover all of the service's environments |
| `egressGateways.haPreview` | `railway.api.egressGateways.haPreview` | `read` | Preview HA static egress IPs that would be assigned without persisting |
| `egressGateways.legacyPreview` | `railway.api.egressGateways.legacyPreview` | `read` | Preview legacy static egress IP that would be assigned without persisting |
| `egressGateways.list` | `railway.api.egressGateways.list` | `read` | All egress gateways assigned to a service instance |
| `egressGateways.rollbackFromHa` | `railway.api.egressGateways.rollbackFromHa` | `write` | Switch a service from HA static egress IPs back to a standard static IP. Set allEnvironments to apply to all of the service's environments |
| `egressGateways.upgradeToHa` | `railway.api.egressGateways.upgradeToHa` | `destructive` | Enable HA static egress IPs for a service. Set allEnvironments to apply to all of the service's environments |
| `environmentPatches.commit` | `railway.api.environmentPatches.commit` | `destructive` | Commit the provided patch to the environment |
| `environmentPatches.commitStaged` | `railway.api.environmentPatches.commitStaged` | `destructive` | Commits the staged changes for a single environment |
| `environmentPatches.dismissFailure` | `railway.api.environmentPatches.dismissFailure` | `write` | Acknowledge a FAILED patch so it no longer shows as the environment's latest failure. The patch is left untouched |
| `environmentPatches.get` | `railway.api.environmentPatches.get` | `read` | Get a single environment patch by ID |
| `environmentPatches.list` | `railway.api.environmentPatches.list` | `read` | Get the patches for an environment, one page at a time (first/after) |
| `environmentPatches.restage` | `railway.api.environmentPatches.restage` | `write` | Copy a FAILED patch's changes into the environment's staged patch (creating one if needed). The FAILED patch is left untouched |
| `environments.applyChangeSet` | `railway.api.environments.applyChangeSet` | `destructive` | Experimental: applies an intent-level RailwayChangeSet and returns operation results |
| `environments.changeSetApplyStatus` | `railway.api.environments.changeSetApplyStatus` | `read` | Returns the status or completed result of an asynchronous RailwayChangeSet apply |
| `environments.create` | `railway.api.environments.create` | `destructive` | Creates a new environment |
| `environments.delete` | `railway.api.environments.delete` | `destructive` | Deletes an environment |
| `environments.get` | `railway.api.environments.get` | `read` | Find a single environment |
| `environments.hasLegacyStaticEgress` | `railway.api.environments.hasLegacyStaticEgress` | `read` | Whether any service in the environment is on legacy static egress (not HA). Used to surface the HA migration banner |
| `environments.history` | `railway.api.environments.history` | `read` | Settled history for an environment (system events + terminal operations), newest first. Cursor-paginated, one page at a time (first/after) |
| `environments.iacPartialRelease` | `railway.api.environments.iacPartialRelease` | `write` | Release resources from a named IaC partial without deleting, redeploying, or changing them. Omit resources to release the entire partial. Whole-project management is possible once no named partials remain. A later named-partial apply can claim released resources again |
| `environments.iacPartialTransfer` | `railway.api.environments.iacPartialTransfer` | `destructive` | Transfer resources between named IaC partials without deleting, redeploying, or changing them. Omit resources to transfer the entire source partial. The destination may be a new or existing partial |
| `environments.list` | `railway.api.environments.list` | `read` | Gets all environments for a project, one page at a time (first/after) |
| `environments.logs` | `railway.api.environments.logs` | `read` | Fetch logs for a project environment. Build logs are excluded unless a snapshot ID is explicitly provided in the filter |
| `environments.overrideBase` | `railway.api.environments.overrideBase` | `write` | Sets the base environment override for a deployment trigger |
| `environments.pendingWork` | `railway.api.environments.pendingWork` | `read` | Pending project-mutating work for an environment. Unions registered OperationSources (patches, standalone deploys) and returns parent rows only — not a stored inbox |
| `environments.previewChangeSet` | `railway.api.environments.previewChangeSet` | `read` | Experimental: previews an intent-level RailwayChangeSet without side effects |
| `environments.rename` | `railway.api.environments.rename` | `write` | Renames an environment |
| `environments.stageChanges` | `railway.api.environments.stageChanges` | `write` | Sets the staged patch for a single environment |
| `environments.stagedChanges` | `railway.api.environments.stagedChanges` | `read` | Get the latest staged commit for a single environment |
| `environments.triggerDeploys` | `railway.api.environments.triggerDeploys` | `destructive` | Deploys all connected triggers for an environment |
| `environments.unskipService` | `railway.api.environments.unskipService` | `write` | Deploy a service that was skipped when its environment was created, along with its skipped transitive dependencies |
| `environments.updateClearanceDefault` | `railway.api.environments.updateClearanceDefault` | `write` | Sets whether Railway Authentication protects an environment's services that have no setting of their own, and pushes it to them. Requires a workspace admin; turning it on also requires the workspace's Railway Authentication entitlement. Services with edge caching on that it protects have their caching turned off |
| `environments.upsertConfigPlanComment` | `railway.api.environments.upsertConfigPlanComment` | `write` | Posts or updates a `railway config plan` comment on a GitHub pull request under the Railway app identity. The caller proves it runs in the target repo with a GitHub Actions OIDC token; the comment body is composed server-side from the structured plan |
| `events.list` | `railway.api.events.list` | `read` | Gets the events for a project, one page at a time (first/after) |
| `featureFlags.add` | `railway.api.featureFlags.add` | `write` | Add a feature flag for a user |
| `featureFlags.listPlatform` | `railway.api.featureFlags.listPlatform` | `read` | Returns the platform feature flags enabled for the current user |
| `featureFlags.remove` | `railway.api.featureFlags.remove` | `destructive` | Remove a feature flag for a user |
| `functionRuntimes.get` | `railway.api.functionRuntimes.get` | `read` | Get information about a specific function runtime |
| `functionRuntimes.list` | `railway.api.functionRuntimes.list` | `read` | List available function runtimes |
| `github.prInfo` | `railway.api.github.prInfo` | `read` | Get info for a GitHub pull request |
| `github.prInfoResult` | `railway.api.github.prInfoResult` | `read` | Get info for a GitHub pull request, including fetch errors |
| `github.repoAccessAvailable` | `railway.api.github.repoAccessAvailable` | `read` | Checks if user has access to GitHub repository |
| `github.repos.branches` | `railway.api.github.repos.branches` | `read` | Get branches for a GitHub repo that the authenticated user has access to |
| `github.repos.deploy` | `railway.api.github.repos.deploy` | `destructive` | Deploys a GitHub repo |
| `github.repos.get` | `railway.api.github.repos.get` | `read` | Checks if user has access to GitHub repository |
| `github.repos.isNameAvailable` | `railway.api.github.repos.isNameAvailable` | `read` | Check if a repo name is available |
| `github.repos.list` | `railway.api.github.repos.list` | `read` | Get a list of repos for a user that Railway has access to |
| `github.repos.update` | `railway.api.github.repos.update` | `write` | Updates a GitHub repo through the linked template |
| `github.sshKeys` | `railway.api.github.sshKeys` | `read` | Gets SSH public keys from the authenticated user's GitHub account |
| `github.writableScopes` | `railway.api.github.writableScopes` | `read` | Get a list of scopes the user has installed the installation to |
| `httpLogs.list` | `railway.api.httpLogs.list` | `read` | Fetch HTTP logs for a deployment |
| `httpMetrics.duration` | `railway.api.httpMetrics.duration` | `read` | Get HTTP request duration metrics for a service (avg, p50, p90, p95, p99) |
| `httpMetrics.get` | `railway.api.httpMetrics.get` | `read` | Get HTTP request metrics for a service |
| `httpMetrics.groupedByStatus` | `railway.api.httpMetrics.groupedByStatus` | `read` | Get HTTP request metrics for a service, grouped by status code |
| `inviteCodes.get` | `railway.api.inviteCodes.get` | `read` | Get an invite code by the code |
| `inviteCodes.use` | `railway.api.inviteCodes.use` | `write` | Join a project using an invite code |
| `me.get` | `railway.api.me.get` | `read` | Get the user the token belongs to, with their workspaces |
| `metrics.get` | `railway.api.metrics.get` | `read` | Get metrics for a project, environment, and service |
| `networkFlowLogs.list` | `railway.api.networkFlowLogs.list` | `read` | Fetch individual network flow logs for an environment |
| `notificationDeliveries.get` | `railway.api.notificationDeliveries.get` | `read` | Gets a notification delivery by ID for the authenticated user |
| `notificationDeliveries.list` | `railway.api.notificationDeliveries.list` | `read` | Gets notification deliveries for the authenticated user, one page at a time (first/after) |
| `notificationDeliveries.markAsRead` | `railway.api.notificationDeliveries.markAsRead` | `write` | Marks notification deliveries as read |
| `notificationRules.create` | `railway.api.notificationRules.create` | `write` | Create a new notification rule |
| `notificationRules.delete` | `railway.api.notificationRules.delete` | `destructive` | Delete a notification rule |
| `notificationRules.list` | `railway.api.notificationRules.list` | `read` | Get all notification rules for a workspace and project |
| `notificationRules.update` | `railway.api.notificationRules.update` | `write` | Update a notification rule |
| `notificationRules.upsertSlackChannel` | `railway.api.notificationRules.upsertSlackChannel` | `write` | Generate a Slack channel for a workspace |
| `observabilityDashboardMonitors.create` | `railway.api.observabilityDashboardMonitors.create` | `write` | Create an observability monitor for a dashboard item |
| `observabilityDashboardMonitors.remove` | `railway.api.observabilityDashboardMonitors.remove` | `destructive` | Remove an observability monitor from a dashboard item |
| `observabilityDashboardMonitors.update` | `railway.api.observabilityDashboardMonitors.update` | `write` | Update an observability monitor for a dashboard item |
| `observabilityDashboards.create` | `railway.api.observabilityDashboards.create` | `write` | Create an observability dashboard |
| `observabilityDashboards.list` | `railway.api.observabilityDashboards.list` | `read` | Get all observability dashboards for an environment, one page at a time (first/after) |
| `observabilityDashboards.reset` | `railway.api.observabilityDashboards.reset` | `write` | Reset an observability dashboard to default dashboard items |
| `observabilityDashboards.update` | `railway.api.observabilityDashboards.update` | `write` | Update an observability dashboard |
| `passkeys.list` | `railway.api.passkeys.list` | `read` | Gets all passkeys for the authenticated user, one page at a time (first/after) |
| `platform.stats` | `railway.api.platform.stats` | `read` | Get public Railway stats |
| `platform.status` | `railway.api.platform.status` | `read` | Get the current status of the platform |
| `preferences.get` | `railway.api.preferences.get` | `read` | Get the email preferences for a user |
| `preferences.update` | `railway.api.preferences.update` | `write` | Update the email preferences for a user |
| `privateNetworkEndpoints.get` | `railway.api.privateNetworkEndpoints.get` | `read` | Get a private network endpoint for a service instance |
| `privateNetworkEndpoints.isNameAvailable` | `railway.api.privateNetworkEndpoints.isNameAvailable` | `read` | Check if an endpoint name is available |
| `privateNetworkEndpoints.rename` | `railway.api.privateNetworkEndpoints.rename` | `write` | Rename a private network endpoint |
| `privateNetworks.list` | `railway.api.privateNetworks.list` | `read` | List private networks for an environment |
| `projectFavorites.list` | `railway.api.projectFavorites.list` | `read` | The authenticated user's favorited project ids in a workspace, in the order the Favorites row should render them. Defaults to the order they were starred in |
| `projectFavorites.set` | `railway.api.projectFavorites.set` | `write` | Star or unstar a project for the authenticated user. Returns the resulting state |
| `projectInvitations.accept` | `railway.api.projectInvitations.accept` | `write` | Accept a project invitation using the invite code |
| `projectInvitations.create` | `railway.api.projectInvitations.create` | `destructive` | Create an invitation for a project |
| `projectInvitations.createInviteCode` | `railway.api.projectInvitations.createInviteCode` | `destructive` | Create a 24-hour project invite link, reusing a link created within the last hour |
| `projectInvitations.delete` | `railway.api.projectInvitations.delete` | `destructive` | Delete an invitation for a project |
| `projectInvitations.get` | `railway.api.projectInvitations.get` | `read` | Get a project invitation by code |
| `projectInvitations.inviteCode` | `railway.api.projectInvitations.inviteCode` | `read` | Get an invite code for a project for a specifc role |
| `projectInvitations.list` | `railway.api.projectInvitations.list` | `read` | Get invitations for a project |
| `projectInvitations.resend` | `railway.api.projectInvitations.resend` | `destructive` | Resend an invitation for a project |
| `projectMembers.add` | `railway.api.projectMembers.add` | `destructive` | Add a workspace member to a project with a specific role. The user must already be a member of the project's workspace |
| `projectMembers.list` | `railway.api.projectMembers.list` | `read` | Gets users who belong to a project along with their role |
| `projectMembers.remove` | `railway.api.projectMembers.remove` | `destructive` | Remove user from a project |
| `projectMembers.update` | `railway.api.projectMembers.update` | `destructive` | Change the role for a user within a project |
| `projects.addFeatureFlag` | `railway.api.projects.addFeatureFlag` | `write` | Add a feature flag for a project |
| `projects.cancelScheduledDelete` | `railway.api.projects.cancelScheduledDelete` | `write` | Cancel scheduled deletion of a project |
| `projects.claim` | `railway.api.projects.claim` | `write` | Claims a project |
| `projects.compliance` | `railway.api.projects.compliance` | `read` | Get comprehensive compliance information for a project including 2FA status, member permissions, backup schedules, and compliance agreements. Requires workspace API token with admin access |
| `projects.confirmTransfer` | `railway.api.projects.confirmTransfer` | `destructive` | Confirm the transfer of project ownership |
| `projects.create` | `railway.api.projects.create` | `write` | Create a project in a workspace (workspaceId), with an optional description and default environment name |
| `projects.delete` | `railway.api.projects.delete` | `destructive` | Permanently delete a project with every environment, service, deployment, volume and variable in it |
| `projects.forceScheduledDelete` | `railway.api.projects.forceScheduledDelete` | `destructive` | Force delete a scheduled deletion of a project (skips the grace period) |
| `projects.get` | `railway.api.projects.get` | `read` | Get a project by ID |
| `projects.initiateTransfer` | `railway.api.projects.initiateTransfer` | `destructive` | Initiate the transfer of project ownership |
| `projects.leave` | `railway.api.projects.leave` | `destructive` | Leave project as currently authenticated user |
| `projects.list` | `railway.api.projects.list` | `read` | List the projects the token can see (all workspaces, or one with workspaceId), as a page of nodes |
| `projects.listByIds` | `railway.api.projects.listByIds` | `read` | Fetch multiple projects by id. Skips ids the caller cannot access (does not throw on partial denial). Intended for batched dashboard hydration of a small viewport-sized set of cards |
| `projects.removeFeatureFlag` | `railway.api.projects.removeFeatureFlag` | `destructive` | Remove a feature flag for a project |
| `projects.resourceAccess` | `railway.api.projects.resourceAccess` | `read` | Get resource access rules for project-specific actions |
| `projects.scheduleDelete` | `railway.api.projects.scheduleDelete` | `destructive` | Deletes a project with a 48 hour grace period |
| `projects.serviceUsage` | `railway.api.projects.serviceUsage` | `read` | Get paginated usage grouped by project and service for a workspace |
| `projects.transfer` | `railway.api.projects.transfer` | `destructive` | Transfer a project to a workspace |
| `projects.update` | `railway.api.projects.update` | `write` | Updates a project |
| `projects.updateClearanceDefault` | `railway.api.projects.updateClearanceDefault` | `write` | Sets whether environments created from now on start with Railway Authentication protecting services that have no setting of their own. Existing environments are unchanged. Requires a workspace admin; turning it on also requires the workspace's Railway Authentication entitlement |
| `projects.workspaceMembers` | `railway.api.projects.workspaceMembers` | `read` | Get workspace members for a project with 2FA details |
| `projectTokens.create` | `railway.api.projectTokens.create` | `destructive` | Create a token for a project that has access to a specific environment |
| `projectTokens.delete` | `railway.api.projectTokens.delete` | `destructive` | Delete a project token |
| `projectTokens.get` | `railway.api.projectTokens.get` | `read` | Get a single project token by the value in the header |
| `projectTokens.list` | `railway.api.projectTokens.list` | `read` | Get all project tokens for a project, one page at a time (first/after) |
| `railwayDomainDnsRecords.create` | `railway.api.railwayDomainDnsRecords.create` | `write` | Create a DNS record for a Railway domain |
| `railwayDomainDnsRecords.delete` | `railway.api.railwayDomainDnsRecords.delete` | `destructive` | Delete a DNS record for a Railway domain |
| `railwayDomainDnsRecords.list` | `railway.api.railwayDomainDnsRecords.list` | `read` | List DNS records for a Railway domain |
| `railwayDomainDnsRecords.update` | `railway.api.railwayDomainDnsRecords.update` | `write` | Update a DNS record for a Railway domain |
| `railwayDomainEmailForwardingRules.create` | `railway.api.railwayDomainEmailForwardingRules.create` | `write` | Forward an address on this domain to an external inbox |
| `railwayDomainEmailForwardingRules.delete` | `railway.api.railwayDomainEmailForwardingRules.delete` | `destructive` | Stop forwarding an address on this domain |
| `railwayDomainEmailForwardingRules.list` | `railway.api.railwayDomainEmailForwardingRules.list` | `read` | List email forwarding rules for a Railway domain |
| `railwayDomainEmailForwardingRules.removeAll` | `railway.api.railwayDomainEmailForwardingRules.removeAll` | `destructive` | Stop forwarding every address on this domain, and remove the mail records that delivered them |
| `railwayDomainEmailForwardingRules.sendTest` | `railway.api.railwayDomainEmailForwardingRules.sendTest` | `destructive` | Send a message to a forwarded address so the customer can confirm it delivers |
| `railwayDomainEmailForwardingRules.update` | `railway.api.railwayDomainEmailForwardingRules.update` | `write` | Change where a forwarded address delivers |
| `railwayDomains.emailForwardingEligibility` | `railway.api.railwayDomains.emailForwardingEligibility` | `read` | Whether email forwarding can be offered on this domain, or why it can't |
| `railwayDomains.emailForwardingLimits` | `railway.api.railwayDomains.emailForwardingLimits` | `read` | Caps the forwarding UI surfaces before a rule is rejected server-side. Pass workspaceId for that workspace's alias allowance; without it the highest plan's is returned |
| `railwayDomains.get` | `railway.api.railwayDomains.get` | `read` | Get a Railway domain by ID |
| `railwayDomains.getByName` | `railway.api.railwayDomains.getByName` | `read` | Get a Railway domain by its domain name within a workspace |
| `railwayDomains.list` | `railway.api.railwayDomains.list` | `read` | Get Railway domains for a workspace |
| `railwayDomains.setNameservers` | `railway.api.railwayDomains.setNameservers` | `destructive` | Delegate the domain's authoritative nameservers to an external DNS provider, or reset to Railway defaults by passing an empty list |
| `railwayDomains.update` | `railway.api.railwayDomains.update` | `write` | Update a Railway domain's settings |
| `referral.get` | `railway.api.referral.get` | `read` | Gets the ReferralInfo for the authenticated user |
| `referral.update` | `railway.api.referral.update` | `write` | Updates the ReferralInfo for the authenticated user |
| `regions.list` | `railway.api.regions.list` | `read` | List available regions |
| `resourceAccess.get` | `railway.api.resourceAccess.get` | `read` | Get resource access for the current user or workspace |
| `sandboxCheckpoints.create` | `railway.api.sandboxCheckpoints.create` | `write` | Capture a running sandbox's current disk into a reusable, named checkpoint. Synchronous: the checkpoint is ready when this returns |
| `sandboxCheckpoints.delete` | `railway.api.sandboxCheckpoints.delete` | `destructive` | Delete a sandbox checkpoint |
| `sandboxCheckpoints.list` | `railway.api.sandboxCheckpoints.list` | `read` | List named sandbox checkpoints in an environment |
| `sandboxCheckpoints.rename` | `railway.api.sandboxCheckpoints.rename` | `write` | Rename a sandbox checkpoint |
| `sandboxes.buildTemplate` | `railway.api.sandboxes.buildTemplate` | `destructive` | Build a sandbox template into a bootable checkpoint |
| `sandboxes.create` | `railway.api.sandboxes.create` | `destructive` | Create a sandbox in an environment |
| `sandboxes.destroy` | `railway.api.sandboxes.destroy` | `destructive` | Destroy a sandbox |
| `sandboxes.get` | `railway.api.sandboxes.get` | `read` | Get a sandbox by id |
| `sandboxes.heartbeat` | `railway.api.sandboxes.heartbeat` | `write` | Extend a sandbox's lifetime |
| `sandboxes.list` | `railway.api.sandboxes.list` | `read` | List sandboxes in an environment, newest first. Passing first/after paginates; omitting them returns the full list, one page at a time (first/after) |
| `sandboxes.templateBuild` | `railway.api.sandboxes.templateBuild` | `read` | Get a template's build state by id (the recipe content hash). READY once its checkpoint exists; BUILDING/FAILED reflect the build workflow |
| `sandboxSessions.list` | `railway.api.sandboxSessions.list` | `read` | Resumable sessions inside a sandbox — interactive shells and one-off exec commands, live or recently exited. Null when the sandbox can't report them (e.g. its vm-init predates session listing), one page at a time (first/after) |
| `serviceDomains.create` | `railway.api.serviceDomains.create` | `write` | Creates a new service domain |
| `serviceDomains.delete` | `railway.api.serviceDomains.delete` | `destructive` | Deletes a service domain |
| `serviceDomains.isAvailable` | `railway.api.serviceDomains.isAvailable` | `read` | Checks if a service domain is available |
| `serviceDomains.update` | `railway.api.serviceDomains.update` | `write` | Updates a service domain |
| `serviceInstances.autoDeployStatus` | `railway.api.serviceInstances.autoDeployStatus` | `read` | Returns the auto-deploy status for a service instance, including whether it can be enabled |
| `serviceInstances.clearAutoUpdateSnooze` | `railway.api.serviceInstances.clearAutoUpdateSnooze` | `write` | Undo an active auto-update skip for a service instance, applied immediately (no config staging, no redeploy). The recurring maintenance window and update policy are untouched — the next scheduled occurrence fires normally again |
| `serviceInstances.deploy` | `railway.api.serviceInstances.deploy` | `destructive` | Deploy the service in an environment from its latest source; the deployment runs on usage-billed compute |
| `serviceInstances.deployV2` | `railway.api.serviceInstances.deployV2` | `destructive` | Deploy the service in an environment from its latest source (or a commit) and return the new deployment id; runs on usage-billed compute |
| `serviceInstances.dismissVulnRemediation` | `railway.api.serviceInstances.dismissVulnRemediation` | `write` | Dismiss a pending database security update and cancel its scheduled redeploy |
| `serviceInstances.get` | `railway.api.serviceInstances.get` | `read` | Get a service instance belonging to a service and environment |
| `serviceInstances.isUpdatable` | `railway.api.serviceInstances.isUpdatable` | `read` | Check if the upstream repo for a service has an update available |
| `serviceInstances.limitOverride` | `railway.api.serviceInstances.limitOverride` | `read` | Get the service instance resource limit overrides (null if no overrides set) |
| `serviceInstances.limits` | `railway.api.serviceInstances.limits` | `read` | Get the merged resource limits for a service instance (includes plan defaults) |
| `serviceInstances.patchVulnNow` | `railway.api.serviceInstances.patchVulnNow` | `destructive` | Apply a pending database security update now (backup, then redeploy). Returns the new deployment id |
| `serviceInstances.redeploy` | `railway.api.serviceInstances.redeploy` | `destructive` | Redeploy a service instance |
| `serviceInstances.snoozeAutoUpdate` | `railway.api.serviceInstances.snoozeAutoUpdate` | `write` | Skip the next scheduled auto-update for a service instance. Takes effect immediately, with no staged change and no redeploy. The maintenance window and update policy stay as they are. This only delays the next scheduled update |
| `serviceInstances.update` | `railway.api.serviceInstances.update` | `write` | Update a service instance |
| `serviceInstances.updateAutoDeploy` | `railway.api.serviceInstances.updateAutoDeploy` | `write` | Enables or disables auto-deploy for a service instance |
| `serviceInstances.updateAutoUpdateSchedule` | `railway.api.serviceInstances.updateAutoUpdateSchedule` | `write` | Update the auto-update maintenance window for a service instance, applied immediately (no config staging, no redeploy). Only the schedule changes — the update policy is untouched |
| `serviceInstances.updateClearance` | `railway.api.serviceInstances.updateClearance` | `write` | Sets a service instance's own Railway Authentication setting: on, off, or none (follow the environment's default). Requires a workspace admin; ending up on also requires the workspace's Railway Authentication entitlement and edge caching off |
| `serviceInstances.updateLimits` | `railway.api.serviceInstances.updateLimits` | `write` | Update the resource limits for a service instance |
| `services.acknowledgeTakedown` | `railway.api.services.acknowledgeTakedown` | `write` | Record that a workspace admin confirms subsequent deployments will exclude the content named in this notice, lifting its persistent takedown restriction. any other restriction on the service, and any other outstanding takedown, still applies. It permits a subsequent deployment; it does not restore an earlier one, and it is not Railway verifying the removal |
| `services.addFeatureFlag` | `railway.api.services.addFeatureFlag` | `write` | Add a feature flag for a service |
| `services.connect` | `railway.api.services.connect` | `destructive` | Connect a service to a source |
| `services.create` | `railway.api.services.create` | `destructive` | Create a service in a project from an image or a GitHub repo (source); a service with a source deploys right away and uses credits |
| `services.delete` | `railway.api.services.delete` | `destructive` | Deletes a service |
| `services.disableCdn` | `railway.api.services.disableCdn` | `write` | Disables CDN for a service, soft-deleting the edge config |
| `services.disconnect` | `railway.api.services.disconnect` | `write` | Disconnect a service from a repo |
| `services.enableCdn` | `railway.api.services.enableCdn` | `destructive` | Enables CDN for a service, creating an edge config and attaching all live domains |
| `services.generateShellToken` | `railway.api.services.generateShellToken` | `destructive` | Creates a short-lived (5-minute) token for opening a shell, file, or network session to a running deployment |
| `services.get` | `railway.api.services.get` | `read` | Get a service by ID |
| `services.purgeCache` | `railway.api.services.purgeCache` | `write` | Purges the CDN cache for a service. Bumps the edge config's purge epoch so every edge node treats prior cached entries as stale on next request. Idempotent; returns true even if CDN is disabled for the service |
| `services.removeFeatureFlag` | `railway.api.services.removeFeatureFlag` | `destructive` | Remove a feature flag for a service |
| `services.removeUpstreamUrl` | `railway.api.services.removeUpstreamUrl` | `destructive` | Remove the upstream URL from all service instances for this service |
| `services.setUnderAttackMode` | `railway.api.services.setUnderAttackMode` | `write` | Enables or disables Under Attack Mode for a service. While enabled, the edge serves a browser challenge to unverified visitors of the service's edge-routed domains; non-browser clients (APIs, webhooks) without a clearance cookie are rejected with a 429. Optionally time-boxed via durationSeconds, after which the mode disarms automatically |
| `services.update` | `railway.api.services.update` | `write` | Updates a service |
| `services.updateEdgeConfig` | `railway.api.services.updateEdgeConfig` | `write` | Updates the edge config (caching settings) for a service |
| `services.updateEdgeRules` | `railway.api.services.updateEdgeRules` | `write` | Replaces the service's edge rules (whole-section replace; null clears). Rules are boolean expressions over request attributes plus one action (block/allow/challenge/redirect/cache_override), evaluated at the edge before requests reach the service. The ruleset is validated server-side; invalid rulesets are rejected with per-rule diagnostics and nothing is written. Rules without an id get a server-assigned stable `rul_` id |
| `services.updateKind` | `railway.api.services.updateKind` | `write` | Makes an ordinary service a Website (kind WEBSITE) and redeploys it in every environment where it has a deployment. A Website can't be made an ordinary service (kind null) yet. Returns false when the service already has that kind |
| `services.validateEdgeRules` | `railway.api.services.validateEdgeRules` | `read` | Validates an edge ruleset without writing it — returns the same diagnostics updateServiceEdgeRules would reject with (empty list = valid). For live feedback in rule editors |
| `sessions.delete` | `railway.api.sessions.delete` | `destructive` | Deletes a session |
| `sessions.list` | `railway.api.sessions.list` | `read` | Gets all sessions for authenticated user, one page at a time (first/after) |
| `sharedVariables.configure` | `railway.api.sharedVariables.configure` | `write` | Configure a shared variable |
| `signals.changes` | `railway.api.signals.changes` | `read` | Recent audit log entries for a signal |
| `signals.create` | `railway.api.signals.create` | `write` | Register a new signal for an owner scope |
| `signals.delete` | `railway.api.signals.delete` | `destructive` | Delete a signal and its audit log |
| `signals.evaluate` | `railway.api.signals.evaluate` | `read` | Evaluate a signal against an evaluation context (pure resolution; does not mutate registry state) |
| `signals.get` | `railway.api.signals.get` | `read` | Fetch a single signal by owner scope and name |
| `signals.list` | `railway.api.signals.list` | `read` | List signals registered for an owner scope |
| `signals.replace` | `railway.api.signals.replace` | `write` | Replace a signal's type and default, clearing all rules. Destructive — intended for CLI --force re-type |
| `signals.rollback` | `railway.api.signals.rollback` | `write` | Restore a signal to the snapshot captured before a change (reads prevState from the target change row) |
| `signals.setDefault` | `railway.api.signals.setDefault` | `write` | Change a signal's canonical default (production floor) |
| `signals.setRule` | `railway.api.signals.setRule` | `write` | Attach or replace a rule on a signal. Matching rules must agree at resolution time or the default is returned |
| `signals.unsetRule` | `railway.api.signals.unsetRule` | `write` | Remove a rule from a signal |
| `sshPublicKeys.approveSignup` | `railway.api.sshPublicKeys.approveSignup` | `destructive` | Approve an SSH signup: register the offered SSH key on the authenticated account so the agent is recognized. When the key owns an anonymous trial box, claims that trial into workspaceId and re-owns the key |
| `sshPublicKeys.create` | `railway.api.sshPublicKeys.create` | `destructive` | Creates a new SSH public key. When workspaceId is provided (or omitted under a workspace-scoped API token, in which case it defaults to the token's workspace), the key is owned by the workspace and can be used by anyone authenticating as that workspace via native SSH; requires workspace ADMIN access. Otherwise the key is owned by the authenticated user |
| `sshPublicKeys.delete` | `railway.api.sshPublicKeys.delete` | `destructive` | Deletes an SSH public key |
| `sshPublicKeys.list` | `railway.api.sshPublicKeys.list` | `read` | Gets SSH public keys. If workspaceId is provided, returns the keys owned by that workspace (requires workspace MEMBER access). Under a workspace-scoped API token, workspaceId defaults to the token's workspace when omitted; otherwise returns the authenticated user's personal keys, one page at a time (first/after) |
| `sshPublicKeys.signupInfo` | `railway.api.sshPublicKeys.signupInfo` | `read` | Details for an SSH signup confirm page: the SSH key fingerprint to verify before binding it to the account, and the trial box it owns if any |
| `tcpProxies.delete` | `railway.api.tcpProxies.delete` | `destructive` | Deletes a TCP proxy by id |
| `tcpProxies.list` | `railway.api.tcpProxies.list` | `read` | All TCP proxies for a service instance |
| `templates.clone` | `railway.api.templates.clone` | `write` | Duplicates an existing template |
| `templates.count` | `railway.api.templates.count` | `read` | Count all published templates |
| `templates.delete` | `railway.api.templates.delete` | `destructive` | Deletes a template |
| `templates.deploy` | `railway.api.templates.deploy` | `destructive` | Deploy a template (by id or code) into a project and environment; the services it creates run on usage-billed compute |
| `templates.ejectServiceSource` | `railway.api.templates.ejectServiceSource` | `write` | Ejects a service from the template and creates a new repo in the provided org |
| `templates.generate` | `railway.api.templates.generate` | `write` | Generate a template for a project |
| `templates.get` | `railway.api.templates.get` | `read` | Get a template by code or ID or GitHub owner and repo |
| `templates.list` | `railway.api.templates.list` | `read` | Get all published templates, one page at a time (first/after) |
| `templates.metrics` | `railway.api.templates.metrics` | `read` | Get the metrics for a template |
| `templates.publish` | `railway.api.templates.publish` | `write` | Publishes a template |
| `templates.revert` | `railway.api.templates.revert` | `write` | Reverts an HA cluster to standalone mode using template metadata to derive variables to remove |
| `templates.search` | `railway.api.templates.search` | `read` | Search published templates using the backend-ranked template search index, one page at a time (first/after) |
| `templates.sourceForProject` | `railway.api.templates.sourceForProject` | `read` | Get the source template for a project |
| `templates.unpublish` | `railway.api.templates.unpublish` | `write` | Unpublishes a template |
| `templates.updateVolume` | `railway.api.templates.updateVolume` | `write` | Sets the default size (in MB) for a volume mount in a template's config. New volumes created when the template is deployed are provisioned at this size, clamped to the deployer's plan maximum. Pass sizeMB: null to clear the pre-size and fall back to the plan default. Editing a template requires maintainer access |
| `traces.get` | `railway.api.traces.get` | `read` | The spans of one trace, oldest first. Only spans belonging to the environment are returned |
| `traces.list` | `railway.api.traces.list` | `read` | Traces of an environment with at least one span matching the filter, newest first |
| `traces.status` | `railway.api.traces.status` | `read` | Span activity per service of an environment within retention; a service absent from the list has produced no spans at all |
| `trustedDomains.create` | `railway.api.trustedDomains.create` | `write` | Create a new trusted domain for this workspace |
| `trustedDomains.delete` | `railway.api.trustedDomains.delete` | `destructive` | Delete a trusted domain |
| `trustedDomains.list` | `railway.api.trustedDomains.list` | `read` | Get all trusted domains for a workspace, one page at a time (first/after) |
| `trustedDomains.retriggerVerification` | `railway.api.trustedDomains.retriggerVerification` | `write` | Check the DNS record for a workspace email domain |
| `trustedDomains.update` | `railway.api.trustedDomains.update` | `write` | Update the automatic joining policy for a workspace email domain |
| `twoFactor.get` | `railway.api.twoFactor.get` | `read` | Gets the TwoFactorInfo for the authenticated user |
| `usage.estimated` | `railway.api.usage.estimated` | `read` | Get the estimated total cost of the project at the end of the current billing cycle. If no `startDate` is provided, the usage for the current billing period of the project owner is returned |
| `usage.get` | `railway.api.usage.get` | `read` | Get the usage for a single project or all projects for a user/workspace. If no `projectId` or `workspaceId` is provided, the usage for the current user is returned. If no `startDate` is provided, the usage for the current billing period of the project owner is returned |
| `usage.removeLimit` | `railway.api.usage.removeLimit` | `destructive` | Remove the usage limit for a customer |
| `usage.setLimit` | `railway.api.usage.setLimit` | `destructive` | Set the usage limit for a customer |
| `user.agreeToFairUse` | `railway.api.user.agreeToFairUse` | `write` | Agree to the fair use policy for the currently authenticated user |
| `user.delete` | `railway.api.user.delete` | `destructive` | Delete the currently authenticated user |
| `user.disconnectDiscord` | `railway.api.user.disconnectDiscord` | `write` | Disconnect your Railway account from Discord |
| `user.pendingEmailChange` | `railway.api.user.pendingEmailChange` | `read` | The authenticated user's unconfirmed email change, if there is one |
| `user.removeProviderAuth` | `railway.api.user.removeProviderAuth` | `destructive` | Deletes a ProviderAuth |
| `user.updateTerms` | `railway.api.user.updateTerms` | `write` | Update date of TermsAgreedOn |
| `userProfile.get` | `railway.api.userProfile.get` | `read` | Get the public profile for a user |
| `userProfile.update` | `railway.api.userProfile.update` | `write` | Updates the profile for the authenticated user |
| `variables.delete` | `railway.api.variables.delete` | `destructive` | Deletes a variable |
| `variables.forServiceDeployment` | `railway.api.variables.forServiceDeployment` | `read` | All rendered variables that are required for a service deployment |
| `variables.list` | `railway.api.variables.list` | `read` | Get the variables of a service in an environment (or the shared ones without serviceId), as a name -> value map |
| `variables.upsert` | `railway.api.variables.upsert` | `write` | Create or change one variable; Railway redeploys the service unless skipDeploys is set |
| `variables.upsertMany` | `railway.api.variables.upsertMany` | `write` | Create or change several variables at once (replace: true drops the others); redeploys unless skipDeploys is set |
| `volumeInstanceBackups.create` | `railway.api.volumeInstanceBackups.create` | `destructive` | Create backup of a volume instance |
| `volumeInstanceBackups.delete` | `railway.api.volumeInstanceBackups.delete` | `destructive` | Deletes volume instance backup |
| `volumeInstanceBackups.list` | `railway.api.volumeInstanceBackups.list` | `read` | List backups of a volume instance |
| `volumeInstanceBackups.lock` | `railway.api.volumeInstanceBackups.lock` | `write` | Removes backup expiration date |
| `volumeInstanceBackups.restore` | `railway.api.volumeInstanceBackups.restore` | `destructive` | Restore a volume instance from a backup |
| `volumeInstanceBackupSchedules.list` | `railway.api.volumeInstanceBackupSchedules.list` | `read` | List backups schedules of a volume instance |
| `volumeInstanceBackupSchedules.update` | `railway.api.volumeInstanceBackupSchedules.update` | `write` | Manage schedule for backups of a volume instance |
| `volumeInstances.get` | `railway.api.volumeInstances.get` | `read` | Get a single volume instance by id |
| `volumeInstances.pitrRestore` | `railway.api.volumeInstances.pitrRestore` | `destructive` | Point-in-time restore. Creates a brand-new database service in the project, recovered to the target timestamp from the source service's backup history. The source service stays online and untouched |
| `volumeInstances.pitrRestoreEstimate` | `railway.api.volumeInstances.pitrRestoreEstimate` | `read` | Estimated disk space a point-in-time restore to this target needs, and whether it fits your plan's largest volume. Returns null when no estimate is available |
| `volumeInstances.update` | `railway.api.volumeInstances.update` | `write` | Update a volume instance. If no environmentId is provided, all volume instances for the volume will be updated |
| `volumes.create` | `railway.api.volumes.create` | `destructive` | Create a persistent volume in a project |
| `volumes.delete` | `railway.api.volumes.delete` | `destructive` | Delete a persistent volume in a project |
| `volumes.update` | `railway.api.volumes.update` | `write` | Update a persistent volume in a project |
| `webhooks.test` | `railway.api.webhooks.test` | `destructive` | Test a webhook URL by sending a sample payload. Returns the HTTP status code. Custom headers come from `headers`, plus the stored headers of `notificationRuleId` for names not passed |
| `workflows.status` | `railway.api.workflows.status` | `read` | Gets the status of a workflow |
| `workspaceApiTokens.delete` | `railway.api.workspaceApiTokens.delete` | `destructive` | Revokes an API token scoped to a workspace. Requires workspace admin access |
| `workspaceApiTokens.list` | `railway.api.workspaceApiTokens.list` | `read` | Lists API tokens scoped to a workspace. Requires workspace admin access, one page at a time (first/after) |
| `workspaceMembers.changeRole` | `railway.api.workspaceMembers.changeRole` | `destructive` | Changes a user workspace permissions |
| `workspaceMembers.invite` | `railway.api.workspaceMembers.invite` | `destructive` | Invite a user by email to a workspace |
| `workspaceMembers.remove` | `railway.api.workspaceMembers.remove` | `destructive` | Remove a user from a workspace |
| `workspacePolicies.addDeploySource` | `railway.api.workspacePolicies.addDeploySource` | `write` | Add a deploy source to a workspace policy allowlist |
| `workspacePolicies.get` | `railway.api.workspacePolicies.get` | `read` | Get the policies for a workspace |
| `workspacePolicies.removeDeploySource` | `railway.api.workspacePolicies.removeDeploySource` | `destructive` | Remove a deploy source from a workspace policy allowlist |
| `workspacePolicies.selectableDeploySources` | `railway.api.workspacePolicies.selectableDeploySources` | `read` | List deploy sources that can be added to a workspace policy |
| `workspacePolicies.updateItem` | `railway.api.workspacePolicies.updateItem` | `write` | Enable or disable a workspace policy. Enterprise workspaces only |
| `workspaces.complianceAgreements` | `railway.api.workspaces.complianceAgreements` | `read` | Get compliance agreements for a workspace including HIPAA BAA and GDPR DPA status |
| `workspaces.createInviteCode` | `railway.api.workspaces.createInviteCode` | `destructive` | Get an invite code for a workspace and role |
| `workspaces.delete` | `railway.api.workspaces.delete` | `destructive` | Delete a workspace and all data associated with it |
| `workspaces.get` | `railway.api.workspaces.get` | `read` | Get the workspace |
| `workspaces.getByCode` | `railway.api.workspaces.getByCode` | `read` | Find a workspace by invite code |
| `workspaces.identityProviders` | `railway.api.workspaces.identityProviders` | `read` | Gets all identity providers of a workspace, one page at a time (first/after) |
| `workspaces.leave` | `railway.api.workspaces.leave` | `destructive` | Leave a workspace |
| `workspaces.listExternal` | `railway.api.workspaces.listExternal` | `read` | Get the workspaces the user doesn't belong to, but needs access (like when invited to a project) |
| `workspaces.setRestrictProjectVisibilityToGroups` | `railway.api.workspaces.setRestrictProjectVisibilityToGroups` | `write` | Control whether non-admin project visibility is restricted to access groups and direct project permissions |
| `workspaces.update` | `railway.api.workspaces.update` | `write` | Update a workspace by id |
| `workspaces.updateTwoFactorEnforcement` | `railway.api.workspaces.updateTwoFactorEnforcement` | `destructive` | Enable or disable 2FA enforcement for a workspace |
| `workspaces.upsertSlackChannel` | `railway.api.workspaces.upsertSlackChannel` | `write` | Generate a Slack channel for a workspace |
| `workspaces.usageTotals` | `railway.api.workspaces.usageTotals` | `read` | Workspace-wide SUM of the same UI usage rollup as `usage` grouped by project. Use this for the usage-page header so it does not wait on per-project rows. Deleted projects that still bill are included when `includeDeleted` is true |
| `workspaces.useInviteCode` | `railway.api.workspaces.useInviteCode` | `write` | Use an invite code to join a workspace |
| `workspaceTemplates.list` | `railway.api.workspaceTemplates.list` | `read` | Get all templates for a workspace, one page at a time (first/after) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/railway

## License

Apache-2.0
