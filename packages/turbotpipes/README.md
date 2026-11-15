# @corsair-dev/turbotpipes

Turbot Pipes plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/turbotpipes
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actor.get` | `turbotpipes.api.actor.get` | `read` | Get authenticated actor |
| `actor.listActivity` | `turbotpipes.api.actor.listActivity` | `read` | List activity for actor |
| `actor.listConnections` | `turbotpipes.api.actor.listConnections` | `read` | List connections for actor |
| `actor.listOrgs` | `turbotpipes.api.actor.listOrgs` | `read` | List organizations for actor |
| `actor.listWorkspaces` | `turbotpipes.api.actor.listWorkspaces` | `read` | List workspaces accessible by actor |
| `ai.createUserAiKey` | `turbotpipes.api.ai.createUserAiKey` | `write` | Create user AI key |
| `ai.deleteOrgWorkspaceConversation` | `turbotpipes.api.ai.deleteOrgWorkspaceConversation` | `write` | Delete AI conversation in org workspace |
| `ai.getUserAiKey` | `turbotpipes.api.ai.getUserAiKey` | `read` | Get user AI key metadata |
| `ai.getUserWorkspaceConversation` | `turbotpipes.api.ai.getUserWorkspaceConversation` | `read` | Get AI conversation details |
| `ai.listUserAiKeys` | `turbotpipes.api.ai.listUserAiKeys` | `read` | List user AI keys |
| `ai.listUserWorkspaceConversations` | `turbotpipes.api.ai.listUserWorkspaceConversations` | `read` | List AI conversations |
| `ai.sendUserWorkspaceChatMessage` | `turbotpipes.api.ai.sendUserWorkspaceChatMessage` | `write` | Send chat message to workspace AI |
| `ai.testUserAiKey` | `turbotpipes.api.ai.testUserAiKey` | `read` | Test user AI key |
| `ai.updateUserAiKey` | `turbotpipes.api.ai.updateUserAiKey` | `write` | Update user AI key |
| `ai.updateUserWorkspaceConversation` | `turbotpipes.api.ai.updateUserWorkspaceConversation` | `write` | Update AI conversation |
| `auth.createLoginTokenEmail` | `turbotpipes.api.auth.createLoginTokenEmail` | `write` | Send login token to email |
| `auth.createSignup` | `turbotpipes.api.auth.createSignup` | `write` | Create new user signup |
| `auth.createUserPassword` | `turbotpipes.api.auth.createUserPassword` | `write` | Create user password |
| `auth.deleteUserToken` | `turbotpipes.api.auth.deleteUserToken` | `write` | Delete user token |
| `auth.getAuthProvider` | `turbotpipes.api.auth.getAuthProvider` | `read` | Get OAuth provider details |
| `auth.getUserPassword` | `turbotpipes.api.auth.getUserPassword` | `read` | Get user password status |
| `auth.getUserToken` | `turbotpipes.api.auth.getUserToken` | `read` | Get user token metadata |
| `auth.initiateLogin` | `turbotpipes.api.auth.initiateLogin` | `write` | Initiate user login |
| `auth.updateUserToken` | `turbotpipes.api.auth.updateUserToken` | `write` | Update user token status |
| `billing.deleteOrgBillingSubscription` | `turbotpipes.api.billing.deleteOrgBillingSubscription` | `write` | Delete org billing subscription |
| `billing.getOrgBillingInvoice` | `turbotpipes.api.billing.getOrgBillingInvoice` | `read` | Get org billing invoice |
| `billing.getUserBillingPlan` | `turbotpipes.api.billing.getUserBillingPlan` | `read` | Get user billing plan |
| `billing.getUserBillingUpcomingInvoice` | `turbotpipes.api.billing.getUserBillingUpcomingInvoice` | `read` | Get user upcoming invoice |
| `billing.listUserBillingInvoices` | `turbotpipes.api.billing.listUserBillingInvoices` | `read` | List user billing invoices |
| `billing.listUserBillingPaymentMethods` | `turbotpipes.api.billing.listUserBillingPaymentMethods` | `read` | List user payment methods |
| `billing.listUserBillingSubscriptions` | `turbotpipes.api.billing.listUserBillingSubscriptions` | `read` | List user billing subscriptions |
| `billing.updateOrgBillingSubscription` | `turbotpipes.api.billing.updateOrgBillingSubscription` | `write` | Update org billing subscription |
| `connections.createOrgConnection` | `turbotpipes.api.connections.createOrgConnection` | `write` | Create org connection |
| `connections.createOrgConnectionFolder` | `turbotpipes.api.connections.createOrgConnectionFolder` | `write` | Create org connection folder |
| `connections.createUserConnection` | `turbotpipes.api.connections.createUserConnection` | `write` | Create user connection |
| `connections.deleteOrgConnectionPermission` | `turbotpipes.api.connections.deleteOrgConnectionPermission` | `write` | Delete org connection permission |
| `connections.deleteUserConnectionDeprecated` | `turbotpipes.api.connections.deleteUserConnectionDeprecated` | `write` | Delete user connection (deprecated) |
| `connections.getOrgConnectionPermission` | `turbotpipes.api.connections.getOrgConnectionPermission` | `read` | Get org connection permission |
| `connections.getUserConnection` | `turbotpipes.api.connections.getUserConnection` | `read` | Get user connection details |
| `connections.listUserConnections` | `turbotpipes.api.connections.listUserConnections` | `read` | List connections for user |
| `connections.testUserConnection` | `turbotpipes.api.connections.testUserConnection` | `read` | Test user connection credentials |
| `connections.updateOrgConnection` | `turbotpipes.api.connections.updateOrgConnection` | `write` | Update org connection |
| `connections.updateOrgConnectionFolder` | `turbotpipes.api.connections.updateOrgConnectionFolder` | `write` | Update org connection folder |
| `connections.updateUserConnection` | `turbotpipes.api.connections.updateUserConnection` | `write` | Update user connection |
| `datatanks.createUserWorkspaceDatatank` | `turbotpipes.api.datatanks.createUserWorkspaceDatatank` | `write` | Create user workspace Datatank |
| `datatanks.createUserWorkspaceDatatankTable` | `turbotpipes.api.datatanks.createUserWorkspaceDatatankTable` | `write` | Create Datatank table |
| `datatanks.getDatatankTable` | `turbotpipes.api.datatanks.getDatatankTable` | `read` | Get Datatank table details |
| `datatanks.getUserWorkspaceDatatank` | `turbotpipes.api.datatanks.getUserWorkspaceDatatank` | `read` | Get user workspace Datatank |
| `datatanks.getUserWorkspaceSchema` | `turbotpipes.api.datatanks.getUserWorkspaceSchema` | `read` | Get user workspace schema |
| `datatanks.getUserWorkspaceSchemaTable` | `turbotpipes.api.datatanks.getUserWorkspaceSchemaTable` | `read` | Get schema table details |
| `datatanks.listOrgWorkspaceDatatanks` | `turbotpipes.api.datatanks.listOrgWorkspaceDatatanks` | `read` | List org workspace Datatanks |
| `datatanks.listUserWorkspaceDatatankPartitions` | `turbotpipes.api.datatanks.listUserWorkspaceDatatankPartitions` | `read` | List Datatank partitions |
| `datatanks.listUserWorkspaceDatatanks` | `turbotpipes.api.datatanks.listUserWorkspaceDatatanks` | `read` | List user workspace Datatanks |
| `datatanks.listUserWorkspaceDatatankTables` | `turbotpipes.api.datatanks.listUserWorkspaceDatatankTables` | `read` | List Datatank tables |
| `datatanks.listUserWorkspaceSchemas` | `turbotpipes.api.datatanks.listUserWorkspaceSchemas` | `read` | List user workspace schemas |
| `datatanks.listUserWorkspaceSchemaTables` | `turbotpipes.api.datatanks.listUserWorkspaceSchemaTables` | `read` | List schema tables |
| `identities.getIdentity` | `turbotpipes.api.identities.getIdentity` | `read` | Get identity details by handle |
| `identities.getIdentityAvatar` | `turbotpipes.api.identities.getIdentityAvatar` | `read` | Get identity avatar |
| `identities.listIdentities` | `turbotpipes.api.identities.listIdentities` | `read` | List identities |
| `integrations.createUserIntegration` | `turbotpipes.api.integrations.createUserIntegration` | `write` | Create user integration |
| `integrations.deleteUserIntegration` | `turbotpipes.api.integrations.deleteUserIntegration` | `write` | Delete user integration |
| `integrations.getOrgIntegration` | `turbotpipes.api.integrations.getOrgIntegration` | `read` | Get org integration |
| `integrations.getOrgWorkspaceIntegration` | `turbotpipes.api.integrations.getOrgWorkspaceIntegration` | `read` | Get org workspace integration |
| `integrations.getUserIntegration` | `turbotpipes.api.integrations.getUserIntegration` | `read` | Get user integration details |
| `integrations.getUserWorkspaceIntegration` | `turbotpipes.api.integrations.getUserWorkspaceIntegration` | `read` | Get user workspace integration |
| `integrations.installUserSlackIntegration` | `turbotpipes.api.integrations.installUserSlackIntegration` | `write` | Install Slack integration for user |
| `integrations.listUserIntegrations` | `turbotpipes.api.integrations.listUserIntegrations` | `read` | List integrations for user |
| `integrations.listUserWorkspaceIntegrations` | `turbotpipes.api.integrations.listUserWorkspaceIntegrations` | `read` | List user workspace integrations |
| `integrations.testUserIntegration` | `turbotpipes.api.integrations.testUserIntegration` | `read` | Test user integration |
| `integrations.updateUserIntegration` | `turbotpipes.api.integrations.updateUserIntegration` | `write` | Update user integration |
| `mods.createUserWorkspaceModVariableSetting` | `turbotpipes.api.mods.createUserWorkspaceModVariableSetting` | `write` | Create mod variable setting |
| `mods.deleteOrgWorkspaceModVariableSetting` | `turbotpipes.api.mods.deleteOrgWorkspaceModVariableSetting` | `write` | Delete org mod variable setting |
| `mods.deleteUserWorkspaceModVariableSetting` | `turbotpipes.api.mods.deleteUserWorkspaceModVariableSetting` | `write` | Delete mod variable setting |
| `mods.getOrgWorkspaceModVariableSetting` | `turbotpipes.api.mods.getOrgWorkspaceModVariableSetting` | `read` | Get org mod variable setting |
| `mods.getUserWorkspaceMod` | `turbotpipes.api.mods.getUserWorkspaceMod` | `read` | Get installed mod details |
| `mods.getUserWorkspaceModVariableSetting` | `turbotpipes.api.mods.getUserWorkspaceModVariableSetting` | `read` | Get mod variable setting |
| `mods.installUserWorkspaceMod` | `turbotpipes.api.mods.installUserWorkspaceMod` | `write` | Install mod in user workspace |
| `mods.listOrgWorkspaceMods` | `turbotpipes.api.mods.listOrgWorkspaceMods` | `read` | List installed mods in org workspace |
| `mods.listUserWorkspaceMods` | `turbotpipes.api.mods.listUserWorkspaceMods` | `read` | List installed mods in workspace |
| `mods.listUserWorkspaceModVariables` | `turbotpipes.api.mods.listUserWorkspaceModVariables` | `read` | List mod variables |
| `notifiers.createUserNotifier` | `turbotpipes.api.notifiers.createUserNotifier` | `write` | Create user notifier |
| `notifiers.createUserWorkspaceNotifier` | `turbotpipes.api.notifiers.createUserWorkspaceNotifier` | `write` | Create workspace notifier |
| `notifiers.deleteUserWorkspaceNotifier` | `turbotpipes.api.notifiers.deleteUserWorkspaceNotifier` | `write` | Delete workspace notifier |
| `notifiers.getOrgWorkspaceNotifier` | `turbotpipes.api.notifiers.getOrgWorkspaceNotifier` | `read` | Get org workspace notifier |
| `notifiers.getUserWorkspaceNotifier` | `turbotpipes.api.notifiers.getUserWorkspaceNotifier` | `read` | Get workspace notifier |
| `notifiers.listUserNotifiers` | `turbotpipes.api.notifiers.listUserNotifiers` | `read` | List user notifiers |
| `notifiers.listUserWorkspaceNotifiers` | `turbotpipes.api.notifiers.listUserWorkspaceNotifiers` | `read` | List workspace notifiers |
| `notifiers.postUserWorkspaceNotifierCommand` | `turbotpipes.api.notifiers.postUserWorkspaceNotifierCommand` | `write` | Post command to workspace notifier |
| `orgs.delete` | `turbotpipes.api.orgs.delete` | `write` | Delete an organization |
| `orgs.deleteWorkspace` | `turbotpipes.api.orgs.deleteWorkspace` | `write` | Delete organization workspace |
| `orgs.get` | `turbotpipes.api.orgs.get` | `read` | Get organization details |
| `orgs.getMember` | `turbotpipes.api.orgs.getMember` | `read` | Get organization member details |
| `orgs.listProcesses` | `turbotpipes.api.orgs.listProcesses` | `read` | List organization processes |
| `orgs.listServiceAccounts` | `turbotpipes.api.orgs.listServiceAccounts` | `read` | List organization service accounts |
| `orgs.listUsage` | `turbotpipes.api.orgs.listUsage` | `read` | List organization usage |
| `orgs.listWorkspaces` | `turbotpipes.api.orgs.listWorkspaces` | `read` | List organization workspaces |
| `orgs.runWorkspaceCommand` | `turbotpipes.api.orgs.runWorkspaceCommand` | `write` | Run command on org workspace |
| `orgs.updateMemberRole` | `turbotpipes.api.orgs.updateMemberRole` | `write` | Update organization member role |
| `orgs.updateServiceAccount` | `turbotpipes.api.orgs.updateServiceAccount` | `write` | Update service account |
| `orgs.updateServiceAccountToken` | `turbotpipes.api.orgs.updateServiceAccountToken` | `write` | Update service account token |
| `pipelines.deleteUserWorkspacePipeline` | `turbotpipes.api.pipelines.deleteUserWorkspacePipeline` | `write` | Delete pipeline from workspace |
| `pipelines.getOrgWorkspaceFlowpipeTrigger` | `turbotpipes.api.pipelines.getOrgWorkspaceFlowpipeTrigger` | `read` | Get Flowpipe trigger details |
| `pipelines.getUserWorkspaceFlowpipeMod` | `turbotpipes.api.pipelines.getUserWorkspaceFlowpipeMod` | `read` | Get Flowpipe mod details |
| `pipelines.getUserWorkspaceFlowpipePipeline` | `turbotpipes.api.pipelines.getUserWorkspaceFlowpipePipeline` | `read` | Get Flowpipe pipeline details |
| `pipelines.getUserWorkspacePipeline` | `turbotpipes.api.pipelines.getUserWorkspacePipeline` | `read` | Get pipeline details |
| `pipelines.installUserWorkspaceFlowpipeMod` | `turbotpipes.api.pipelines.installUserWorkspaceFlowpipeMod` | `write` | Install Flowpipe mod |
| `pipelines.listOrgWorkspaceFlowpipeModVariables` | `turbotpipes.api.pipelines.listOrgWorkspaceFlowpipeModVariables` | `read` | List org Flowpipe mod variables |
| `pipelines.listOrgWorkspacePipelines` | `turbotpipes.api.pipelines.listOrgWorkspacePipelines` | `read` | List pipelines in org workspace |
| `pipelines.listUserWorkspaceFlowpipeInputs` | `turbotpipes.api.pipelines.listUserWorkspaceFlowpipeInputs` | `read` | List Flowpipe inputs |
| `pipelines.listUserWorkspaceFlowpipeModVariables` | `turbotpipes.api.pipelines.listUserWorkspaceFlowpipeModVariables` | `read` | List user Flowpipe mod variables |
| `pipelines.listUserWorkspaceFlowpipePipelines` | `turbotpipes.api.pipelines.listUserWorkspaceFlowpipePipelines` | `read` | List Flowpipe pipelines |
| `pipelines.listUserWorkspaceFlowpipeTriggers` | `turbotpipes.api.pipelines.listUserWorkspaceFlowpipeTriggers` | `read` | List Flowpipe triggers |
| `pipelines.listUserWorkspacePipelines` | `turbotpipes.api.pipelines.listUserWorkspacePipelines` | `read` | List pipelines in workspace |
| `pipelines.listUserWorkspacePipelineTriggers` | `turbotpipes.api.pipelines.listUserWorkspacePipelineTriggers` | `read` | List triggers for pipeline |
| `pipelines.runUserWorkspaceFlowpipePipelineCommand` | `turbotpipes.api.pipelines.runUserWorkspaceFlowpipePipelineCommand` | `write` | Run Flowpipe pipeline command |
| `pipelines.runUserWorkspaceFlowpipeTriggerCommand` | `turbotpipes.api.pipelines.runUserWorkspaceFlowpipeTriggerCommand` | `write` | Run Flowpipe trigger command |
| `pipelines.uninstallFlowpipeMod` | `turbotpipes.api.pipelines.uninstallFlowpipeMod` | `write` | Uninstall Flowpipe mod |
| `pipelines.uninstallOrgWorkspaceFlowpipeMod` | `turbotpipes.api.pipelines.uninstallOrgWorkspaceFlowpipeMod` | `write` | Uninstall org Flowpipe mod |
| `query.createOrgWorkspaceQuery` | `turbotpipes.api.query.createOrgWorkspaceQuery` | `write` | Execute query in org workspace |
| `query.createOrgWorkspaceSnapshot` | `turbotpipes.api.query.createOrgWorkspaceSnapshot` | `write` | Create workspace snapshot |
| `query.getOrgWorkspaceQueryData` | `turbotpipes.api.query.getOrgWorkspaceQueryData` | `read` | Get query data from org workspace |
| `query.getUserWorkspaceQuery` | `turbotpipes.api.query.getUserWorkspaceQuery` | `read` | Execute query in user workspace (GET) |
| `query.getUserWorkspaceQueryData` | `turbotpipes.api.query.getUserWorkspaceQueryData` | `read` | Get query data from user workspace |
| `query.listUserWorkspaceSnapshots` | `turbotpipes.api.query.listUserWorkspaceSnapshots` | `read` | List workspace snapshots |
| `query.postUserWorkspaceQuery` | `turbotpipes.api.query.postUserWorkspaceQuery` | `write` | Execute query in user workspace (POST) |
| `query.runUserWorkspaceQuery` | `turbotpipes.api.query.runUserWorkspaceQuery` | `write` | Run query in user workspace |
| `tenants.getTenant` | `turbotpipes.api.tenants.getTenant` | `read` | Get tenant information |
| `tenants.getTenantAvatar` | `turbotpipes.api.tenants.getTenantAvatar` | `read` | Get tenant avatar image |
| `tenants.getTenantSettings` | `turbotpipes.api.tenants.getTenantSettings` | `read` | Get tenant settings |
| `tenants.listTenants` | `turbotpipes.api.tenants.listTenants` | `read` | List accessible tenants |
| `users.deleteUserAvatar` | `turbotpipes.api.users.deleteUserAvatar` | `write` | Delete custom user avatar |
| `users.get` | `turbotpipes.api.users.get` | `read` | Get user details by handle |
| `users.getUserEmail` | `turbotpipes.api.users.getUserEmail` | `read` | Get user email details |
| `users.getUserPreferences` | `turbotpipes.api.users.getUserPreferences` | `read` | Get user preferences |
| `users.getUserProcess` | `turbotpipes.api.users.getUserProcess` | `read` | Get user process details |
| `users.getUserWorkspace` | `turbotpipes.api.users.getUserWorkspace` | `read` | Get user workspace details |
| `users.listAuditLogs` | `turbotpipes.api.users.listAuditLogs` | `read` | List user audit logs |
| `users.listConstraints` | `turbotpipes.api.users.listConstraints` | `read` | List user constraints |
| `users.listProcesses` | `turbotpipes.api.users.listProcesses` | `read` | List processes for user |
| `users.listUsage` | `turbotpipes.api.users.listUsage` | `read` | List user usage metrics |
| `users.listUserEmails` | `turbotpipes.api.users.listUserEmails` | `read` | List user emails |
| `users.listWorkspaces` | `turbotpipes.api.users.listWorkspaces` | `read` | List workspaces for user |
| `users.runUserWorkspaceCommand` | `turbotpipes.api.users.runUserWorkspaceCommand` | `write` | Run command on user workspace |
| `users.update` | `turbotpipes.api.users.update` | `write` | Update user information |
| `users.updateUserPreferences` | `turbotpipes.api.users.updateUserPreferences` | `write` | Update user preferences |
| `users.updateUserWorkspace` | `turbotpipes.api.users.updateUserWorkspace` | `write` | Update user workspace |
| `workspaces.createOrgWorkspaceAggregator` | `turbotpipes.api.workspaces.createOrgWorkspaceAggregator` | `write` | Create org workspace aggregator |
| `workspaces.createOrgWorkspaceConnection` | `turbotpipes.api.workspaces.createOrgWorkspaceConnection` | `write` | Create org workspace connection |
| `workspaces.createOrgWorkspaceConnectionFolder` | `turbotpipes.api.workspaces.createOrgWorkspaceConnectionFolder` | `write` | Create org workspace connection folder |
| `workspaces.createUserWorkspaceConnection` | `turbotpipes.api.workspaces.createUserWorkspaceConnection` | `write` | Create user workspace connection |
| `workspaces.createUserWorkspaceConnectionFolder` | `turbotpipes.api.workspaces.createUserWorkspaceConnectionFolder` | `write` | Create user workspace connection folder |
| `workspaces.getOrgWorkspaceConnection` | `turbotpipes.api.workspaces.getOrgWorkspaceConnection` | `read` | Get org workspace connection |
| `workspaces.getOrgWorkspaceConnectionFolder` | `turbotpipes.api.workspaces.getOrgWorkspaceConnectionFolder` | `read` | Get org workspace connection folder |
| `workspaces.getUserWorkspaceAggregator` | `turbotpipes.api.workspaces.getUserWorkspaceAggregator` | `read` | Get user workspace aggregator |
| `workspaces.getUserWorkspaceConnection` | `turbotpipes.api.workspaces.getUserWorkspaceConnection` | `read` | Get user workspace connection |
| `workspaces.getUserWorkspaceConnectionFolder` | `turbotpipes.api.workspaces.getUserWorkspaceConnectionFolder` | `read` | Get user workspace connection folder |
| `workspaces.getUserWorkspaceProcess` | `turbotpipes.api.workspaces.getUserWorkspaceProcess` | `read` | Get workspace process |
| `workspaces.getUserWorkspaceProcessLog` | `turbotpipes.api.workspaces.getUserWorkspaceProcessLog` | `read` | Get workspace process logs |
| `workspaces.listOrgWorkspaceProcesses` | `turbotpipes.api.workspaces.listOrgWorkspaceProcesses` | `read` | List org workspace processes |
| `workspaces.listUserWorkspaceAggregatorConnections` | `turbotpipes.api.workspaces.listUserWorkspaceAggregatorConnections` | `read` | List user workspace aggregator connections |
| `workspaces.listUserWorkspaceAggregators` | `turbotpipes.api.workspaces.listUserWorkspaceAggregators` | `read` | List user workspace aggregators |
| `workspaces.listUserWorkspaceAuditLogs` | `turbotpipes.api.workspaces.listUserWorkspaceAuditLogs` | `read` | List workspace audit logs |
| `workspaces.listUserWorkspaceConnectionAssociations` | `turbotpipes.api.workspaces.listUserWorkspaceConnectionAssociations` | `read` | List user workspace connection associations |
| `workspaces.listUserWorkspaceConnectionFolders` | `turbotpipes.api.workspaces.listUserWorkspaceConnectionFolders` | `read` | List user workspace connection folders |
| `workspaces.listUserWorkspaceConnections` | `turbotpipes.api.workspaces.listUserWorkspaceConnections` | `read` | List user workspace connections |
| `workspaces.listUserWorkspaceConnectionTree` | `turbotpipes.api.workspaces.listUserWorkspaceConnectionTree` | `read` | List user workspace connection tree |
| `workspaces.listUserWorkspaceDatabaseLogs` | `turbotpipes.api.workspaces.listUserWorkspaceDatabaseLogs` | `read` | List workspace database logs |
| `workspaces.listUserWorkspaceProcesses` | `turbotpipes.api.workspaces.listUserWorkspaceProcesses` | `read` | List workspace processes |
| `workspaces.listUserWorkspaceUsage` | `turbotpipes.api.workspaces.listUserWorkspaceUsage` | `read` | List user workspace usage |
| `workspaces.testUserWorkspaceConnection` | `turbotpipes.api.workspaces.testUserWorkspaceConnection` | `read` | Test user workspace connection |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/turbotpipes

## License

Apache-2.0
