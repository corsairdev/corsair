# @corsair-dev/supabase

Supabase plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/supabase
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `advisors.getPerformanceAdvisors` | `supabase.api.advisors.getPerformanceAdvisors` | `read` | Get performance advisors |
| `advisors.getSecurityAdvisors` | `supabase.api.advisors.getSecurityAdvisors` | `read` | Get security advisors |
| `analytics.getProjectLogs` | `supabase.api.analytics.getProjectLogs` | `read` | Get project logs |
| `auth.createProjectSigningKey` | `supabase.api.auth.createProjectSigningKey` | `write` | Create a project signing key |
| `auth.createSsoProvider` | `supabase.api.auth.createSsoProvider` | `write` | Create an SSO provider |
| `auth.createThirdPartyAuthIntegration` | `supabase.api.auth.createThirdPartyAuthIntegration` | `write` | Create a third-party auth integration |
| `auth.deleteSsoProvider` | `supabase.api.auth.deleteSsoProvider` | `destructive` | Remove an SSO provider |
| `auth.deleteThirdPartyAuthIntegration` | `supabase.api.auth.deleteThirdPartyAuthIntegration` | `destructive` | Delete a third-party auth integration |
| `auth.getLegacySigningKey` | `supabase.api.auth.getLegacySigningKey` | `read` | Get legacy signing key |
| `auth.getProjectAuthConfig` | `supabase.api.auth.getProjectAuthConfig` | `read` | Get project auth config |
| `auth.getProjectSigningKeys` | `supabase.api.auth.getProjectSigningKeys` | `read` | Get project signing keys |
| `auth.getSsoProvider` | `supabase.api.auth.getSsoProvider` | `read` | Get an SSO provider |
| `auth.getThirdPartyIntegration` | `supabase.api.auth.getThirdPartyIntegration` | `read` | Get a third-party auth integration |
| `auth.listSsoProviders` | `supabase.api.auth.listSsoProviders` | `read` | List SSO providers |
| `auth.listThirdPartyAuthIntegrations` | `supabase.api.auth.listThirdPartyAuthIntegrations` | `read` | List third-party auth integrations |
| `auth.updateProjectAuthConfig` | `supabase.api.auth.updateProjectAuthConfig` | `write` | Update project auth config |
| `auth.updateSsoProvider` | `supabase.api.auth.updateSsoProvider` | `write` | Update an SSO provider |
| `database.applyMigration` | `supabase.api.database.applyMigration` | `write` | Apply a database migration |
| `database.createLoginRole` | `supabase.api.database.createLoginRole` | `write` | Create a CLI login role |
| `database.createReadReplica` | `supabase.api.database.createReadReplica` | `write` | Set up a read replica |
| `database.deleteLoginRoles` | `supabase.api.database.deleteLoginRoles` | `destructive` | Delete CLI login roles |
| `database.disableProjectReadonly` | `supabase.api.database.disableProjectReadonly` | `write` | Temporarily disable project read-only mode |
| `database.enableDatabaseWebhooks` | `supabase.api.database.enableDatabaseWebhooks` | `write` | Enable database webhooks |
| `database.generateTypescriptTypes` | `supabase.api.database.generateTypescriptTypes` | `read` | Generate TypeScript database types |
| `database.getDatabaseMetadata` | `supabase.api.database.getDatabaseMetadata` | `read` | Get database metadata |
| `database.getJitAccessConfig` | `supabase.api.database.getJitAccessConfig` | `read` | Get JIT access config |
| `database.getMigration` | `supabase.api.database.getMigration` | `read` | Get a migration |
| `database.getProjectPgbouncerConfig` | `supabase.api.database.getProjectPgbouncerConfig` | `read` | Get project PgBouncer config |
| `database.getProjectPostgresConfig` | `supabase.api.database.getProjectPostgresConfig` | `read` | Get project postgres config |
| `database.getProjectReadonlyModeStatus` | `supabase.api.database.getProjectReadonlyModeStatus` | `read` | Get project read-only mode status |
| `database.getProjectSslEnforcementConfig` | `supabase.api.database.getProjectSslEnforcementConfig` | `read` | Get project SSL enforcement config |
| `database.getProjectSupavisorConfig` | `supabase.api.database.getProjectSupavisorConfig` | `read` | Get project Supavisor config |
| `database.getSqlSnippet` | `supabase.api.database.getSqlSnippet` | `read` | Get a SQL snippet |
| `database.getTableSchemas` | `supabase.api.database.getTableSchemas` | `read` | Get database table schemas |
| `database.listBackups` | `supabase.api.database.listBackups` | `read` | List project database backups |
| `database.listMigrationHistory` | `supabase.api.database.listMigrationHistory` | `read` | List migration history |
| `database.listSqlSnippets` | `supabase.api.database.listSqlSnippets` | `read` | List SQL snippets |
| `database.listTables` | `supabase.api.database.listTables` | `read` | List database tables |
| `database.patchMigration` | `supabase.api.database.patchMigration` | `write` | Patch a migration |
| `database.removeReadReplica` | `supabase.api.database.removeReadReplica` | `destructive` | Remove a read replica |
| `database.restorePitrBackup` | `supabase.api.database.restorePitrBackup` | `destructive` | Restore database PITR backup |
| `database.runReadOnlyQuery` | `supabase.api.database.runReadOnlyQuery` | `read` | Execute a read-only database query |
| `database.runSqlQuery` | `supabase.api.database.runSqlQuery` | `write` | Execute a project database query |
| `database.selectFromTable` | `supabase.api.database.selectFromTable` | `read` | Select rows from a database table |
| `database.updateDatabasePassword` | `supabase.api.database.updateDatabasePassword` | `write` | Update database password |
| `database.updateJitAccessConfig` | `supabase.api.database.updateJitAccessConfig` | `write` | Update JIT access config |
| `database.updateProjectPostgresConfig` | `supabase.api.database.updateProjectPostgresConfig` | `write` | Update project postgres config |
| `database.updateProjectSupavisorConfig` | `supabase.api.database.updateProjectSupavisorConfig` | `write` | Update project Supavisor config |
| `database.updateSslEnforcementConfig` | `supabase.api.database.updateSslEnforcementConfig` | `write` | Update SSL enforcement config |
| `database.upsertMigration` | `supabase.api.database.upsertMigration` | `write` | Upsert a migration |
| `domains.activateCustomHostname` | `supabase.api.domains.activateCustomHostname` | `write` | Activate a configured custom hostname |
| `domains.activateVanitySubdomain` | `supabase.api.domains.activateVanitySubdomain` | `write` | Activate a vanity subdomain for a project |
| `domains.checkVanitySubdomainAvailability` | `supabase.api.domains.checkVanitySubdomainAvailability` | `read` | Check vanity subdomain availability |
| `domains.deleteCustomHostnameConfig` | `supabase.api.domains.deleteCustomHostnameConfig` | `destructive` | Delete custom hostname configuration |
| `domains.deleteProjectVanitySubdomain` | `supabase.api.domains.deleteProjectVanitySubdomain` | `destructive` | Delete a project vanity subdomain |
| `domains.getProjectCustomHostnameConfig` | `supabase.api.domains.getProjectCustomHostnameConfig` | `read` | Get a project custom hostname configuration |
| `domains.getVanitySubdomainConfig` | `supabase.api.domains.getVanitySubdomainConfig` | `read` | Get current vanity subdomain config |
| `domains.updateProjectCustomHostname` | `supabase.api.domains.updateProjectCustomHostname` | `write` | Update project custom hostname |
| `domains.verifyCustomHostnameDns` | `supabase.api.domains.verifyCustomHostnameDns` | `write` | Reverify custom hostname DNS |
| `edgeFunctions.createFunction` | `supabase.api.edgeFunctions.createFunction` | `write` | Create an Edge Function |
| `edgeFunctions.deleteFunction` | `supabase.api.edgeFunctions.deleteFunction` | `destructive` | Delete an Edge Function |
| `edgeFunctions.deployFunction` | `supabase.api.edgeFunctions.deployFunction` | `write` | Deploy an Edge Function |
| `edgeFunctions.getFunction` | `supabase.api.edgeFunctions.getFunction` | `read` | Retrieve an Edge Function |
| `edgeFunctions.getFunctionBody` | `supabase.api.edgeFunctions.getFunctionBody` | `read` | Retrieve an Edge Function body |
| `edgeFunctions.invokeEdgeFunction` | `supabase.api.edgeFunctions.invokeEdgeFunction` | `write` | Invoke an Edge Function |
| `edgeFunctions.listFunctions` | `supabase.api.edgeFunctions.listFunctions` | `read` | List Edge Functions |
| `edgeFunctions.updateFunction` | `supabase.api.edgeFunctions.updateFunction` | `write` | Update an Edge Function |
| `edgeFunctions.updateFunctions` | `supabase.api.edgeFunctions.updateFunctions` | `write` | Bulk update Edge Functions |
| `environments.countActionRuns` | `supabase.api.environments.countActionRuns` | `read` | Count action runs |
| `environments.createDatabaseBranch` | `supabase.api.environments.createDatabaseBranch` | `write` | Create a database branch |
| `environments.deleteDatabaseBranch` | `supabase.api.environments.deleteDatabaseBranch` | `destructive` | Delete a database branch |
| `environments.disablePreviewBranching` | `supabase.api.environments.disablePreviewBranching` | `write` | Disable preview branching |
| `environments.getActionRun` | `supabase.api.environments.getActionRun` | `read` | Get action run status |
| `environments.getActionRunLogs` | `supabase.api.environments.getActionRunLogs` | `read` | Get action run logs |
| `environments.getBranch` | `supabase.api.environments.getBranch` | `read` | Get a database branch by name |
| `environments.getDatabaseBranchConfig` | `supabase.api.environments.getDatabaseBranchConfig` | `read` | Get database branch config |
| `environments.listDatabaseBranches` | `supabase.api.environments.listDatabaseBranches` | `read` | List database branches |
| `environments.pushBranch` | `supabase.api.environments.pushBranch` | `write` | Push a database branch |
| `environments.resetDatabaseBranch` | `supabase.api.environments.resetDatabaseBranch` | `destructive` | Reset a database branch |
| `environments.updateDatabaseBranchConfig` | `supabase.api.environments.updateDatabaseBranchConfig` | `write` | Update database branch config |
| `oauth.authorizeUserThroughOauth` | `supabase.api.oauth.authorizeUserThroughOauth` | `read` | Generate a Supabase OAuth authorization URL |
| `oauth.exchangeOauthToken` | `supabase.api.oauth.exchangeOauthToken` | `write` | Exchange an OAuth authorization code or refresh token |
| `organizations.createOrganization` | `supabase.api.organizations.createOrganization` | `write` | Create an organization |
| `organizations.getOrganization` | `supabase.api.organizations.getOrganization` | `read` | Get organization information |
| `organizations.listAllOrganizations` | `supabase.api.organizations.listAllOrganizations` | `read` | List organizations |
| `organizations.listOrganizationMembers` | `supabase.api.organizations.listOrganizationMembers` | `read` | List organization members |
| `projects.createProject` | `supabase.api.projects.createProject` | `write` | Create a project |
| `projects.deleteProject` | `supabase.api.projects.deleteProject` | `destructive` | Delete a project |
| `projects.getAvailableRegions` | `supabase.api.projects.getAvailableRegions` | `read` | Get available project regions |
| `projects.getHealth` | `supabase.api.projects.getHealth` | `read` | Get project API health status |
| `projects.getProject` | `supabase.api.projects.getProject` | `read` | Get a project |
| `projects.getProjectNetworkBans` | `supabase.api.projects.getProjectNetworkBans` | `read` | Retrieve project network bans |
| `projects.getProjectNetworkRestrictions` | `supabase.api.projects.getProjectNetworkRestrictions` | `read` | Get project network restrictions |
| `projects.getProjectServiceHealthStatus` | `supabase.api.projects.getProjectServiceHealthStatus` | `read` | Get project service health status |
| `projects.getProjectUpgradeEligibility` | `supabase.api.projects.getProjectUpgradeEligibility` | `read` | Get project upgrade eligibility |
| `projects.getProjectUpgradeStatus` | `supabase.api.projects.getProjectUpgradeStatus` | `read` | Get project upgrade status |
| `projects.listAllProjects` | `supabase.api.projects.listAllProjects` | `read` | List projects |
| `projects.patchNetworkRestrictions` | `supabase.api.projects.patchNetworkRestrictions` | `write` | Patch project network restrictions |
| `projects.removeNetworkBans` | `supabase.api.projects.removeNetworkBans` | `write` | Remove project network bans |
| `projects.updateProject` | `supabase.api.projects.updateProject` | `write` | Update a project |
| `projects.updateProjectNetworkRestrictions` | `supabase.api.projects.updateProjectNetworkRestrictions` | `write` | Apply project network restrictions |
| `projects.upgradeProjectPostgresVersion` | `supabase.api.projects.upgradeProjectPostgresVersion` | `write` | Upgrade project PostgreSQL version |
| `rest.getProjectPostgrestConfig` | `supabase.api.rest.getProjectPostgrestConfig` | `read` | Get project PostgREST config |
| `rest.updateProjectPostgrestConfig` | `supabase.api.rest.updateProjectPostgrestConfig` | `write` | Update project PostgREST config |
| `secrets.createApiKey` | `supabase.api.secrets.createApiKey` | `write` | Create a project API key |
| `secrets.createBulkSecrets` | `supabase.api.secrets.createBulkSecrets` | `write` | Create multiple project secrets |
| `secrets.deleteApiKey` | `supabase.api.secrets.deleteApiKey` | `destructive` | Delete a project API key |
| `secrets.deleteSecrets` | `supabase.api.secrets.deleteSecrets` | `destructive` | Delete multiple project secrets |
| `secrets.getProjectApiKey` | `supabase.api.secrets.getProjectApiKey` | `read` | Get a project API key |
| `secrets.getProjectApiKeys` | `supabase.api.secrets.getProjectApiKeys` | `read` | Get project API keys |
| `secrets.getProjectLegacyApiKeys` | `supabase.api.secrets.getProjectLegacyApiKeys` | `read` | Get project legacy API keys status |
| `secrets.getProjectPgsodiumConfig` | `supabase.api.secrets.getProjectPgsodiumConfig` | `read` | Get project pgsodium config |
| `secrets.listSecrets` | `supabase.api.secrets.listSecrets` | `read` | List project secrets |
| `secrets.updateApiKey` | `supabase.api.secrets.updateApiKey` | `write` | Update a project API key |
| `secrets.updatePgsodiumConfig` | `supabase.api.secrets.updatePgsodiumConfig` | `destructive` | Update pgsodium root key |
| `secrets.updateProjectLegacyApiKeys` | `supabase.api.secrets.updateProjectLegacyApiKeys` | `write` | Update project legacy API keys |
| `storage.getResumableUploadBaseOptions` | `supabase.api.storage.getResumableUploadBaseOptions` | `read` | Get TUS resumable upload base options |
| `storage.getResumableUploadOptions` | `supabase.api.storage.getResumableUploadOptions` | `read` | Get TUS resumable upload options |
| `storage.handleResumableUploadSignOptions` | `supabase.api.storage.handleResumableUploadSignOptions` | `read` | Handle TUS resumable upload sign options |
| `storage.handleResumableUploadSignOptionsWithId` | `supabase.api.storage.handleResumableUploadSignOptionsWithId` | `read` | Handle TUS resumable upload sign options with ID |
| `storage.listBuckets` | `supabase.api.storage.listBuckets` | `read` | List storage buckets |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/supabase

## License

Apache-2.0
