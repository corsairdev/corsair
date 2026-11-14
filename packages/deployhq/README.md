# DeployHQ plugin for Corsair

Manage DeployHQ account, project, repository, server, build, deployment, schedule, environment, team, user, and template resources through Corsair.

## Authentication and setup

DeployHQ documents HTTP Basic authentication with the account username/email as the username and API key as the password. Configure the plugin with the account permalink and username, and store the API key as the Corsair `api_key` credential:

```ts
deployhq({ accountSubdomain: 'your-account', username: 'you@example.com' })
```

The API key is available in DeployHQ account settings and is documented as a 40-character value. Store username and account_subdomain in the plugin's `api_key` account auth fields for tenant-specific setups; plugin options may override them. Only `api_key` auth is officially documented; DeployHQ does not document OAuth 2 for this API.

For a client without a database or KEK, supply `key`, `username`, and `accountSubdomain` as plugin options. Keep real credentials in a secret manager rather than source control.

All account requests use `https://<accountSubdomain>.deployhq.com/`. Public routes do not send credentials, but use the configured account subdomain server. Input and output are validated with operation-specific strict Zod schemas generated from DeployHQ's official OpenAPI document.

## Behavior and limitations

- The 216 supported operations below reflect the REST operations in the published OpenAPI document. Every row links to the official operation in that document.
- Query and body fields follow the operation schema; the plugin does not invent pagination parameters or automatically follow pages.
- Safe `GET` calls use the shared HTTP transport's bounded retry behavior and honor numeric-seconds `Retry-After` values for `429`/`503`. Writes are not automatically retried to avoid duplicating deployments, invitations, credentials, or other side effects. The invoice downloader also parses HTTP-date `Retry-After`; date-form headers on JSON routes need shared-core support outside this plugin's R1 scope.
- Invoice downloads preserve non-JSON response bytes as `{ kind: 'binary', contentType, base64, sizeBytes }`; JSON string responses are also accepted because the OpenAPI response schema documents a string. Binary reads have a 20-second per-request timeout and a 10 MiB plugin safety cap (not a DeployHQ limit).
- Public routes include account signup, password reset, deployment IP ranges, packages/prices, and status badges. The two public-template routes answer 403 without credentials, so the plugin sends Basic auth to them.
- The API reference does not define an inbound webhook contract; this plugin exposes no webhooks.
- The OpenAPI document has inconsistent path parameter declarations for several routes. The URL template is used as the path source of truth: the build-language routes put `override_build_configuration_id` in the path but describe it as an optional query parameter; `/projects/{id}/insights` declares both `project_id` and `id` as path parameters; `/projects/{project_id}/build_configuration` and `/security/api_keys/{id}` declare extra path parameters absent from their URL templates; and `/templates/{id}/public/{id}` repeats the `id` placeholder. Confirm these conflicts with DeployHQ before relying on the affected operations.
- Account operations use the configured account subdomain. Account creation posts to `https://api.deployhq.com/api/v1/signup`, so it is public and does not require an existing permalink. The [signup guide](https://www.deployhq.com/support/api/signup) shows `https://deployhq.com/api/v1/signup`, but that host redirects to a 404.
- Status-badge routes are documented as returning SVG source. The transport handles non-JSON response content as text and the operation output schema is a string; no binary envelope or byte decoding is used.

## Official documentation

- [DeployHQ API guide](https://www.deployhq.com/support/api)
- [DeployHQ interactive API reference](https://api.deployhq.com/docs)
- [Official OpenAPI JSON](https://api.deployhq.com/docs.json)
- [Signup API guide](https://www.deployhq.com/support/api/signup)

## Operation matrix

| Method | Route | Corsair operation | Authentication | Official source |
|---|---|---|---|---|
| GET | `/account` | `account.getAccount` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1account/get) |
| PUT | `/account` | `account.replaceAccount` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1account/put) |
| PATCH | `/account` | `account.updateAccount` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1account/patch) |
| GET | `/account/billing_status` | `account.billingStatusAccountBillingStatus` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1account~1billing_status/get) |
| GET | `/account/invoices` | `invoices.listAccountInvoices` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1account~1invoices/get) |
| GET | `/account/invoices/{id}` | `invoices.getAccountInvoice` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1account~1invoices~1{id}/get) |
| GET | `/agents` | `networkAgents.listAgents` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1agents/get) |
| POST | `/agents` | `networkAgents.createAgent` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1agents/post) |
| PUT | `/agents/{id}` | `networkAgents.replaceAgent` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1agents~1{id}/put) |
| PATCH | `/agents/{id}` | `networkAgents.updateAgent` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1agents~1{id}/patch) |
| DELETE | `/agents/{id}` | `networkAgents.deleteAgent` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1agents~1{id}/delete) |
| POST | `/agents/{id}/revoke` | `networkAgents.revokeAgent` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1agents~1{id}~1revoke/post) |
| POST | `/api/v1/signup` | `signup.createSignup` | No (public) | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1api~1v1~1signup/post) |
| POST | `/beta/enrollments` | `beta.createBetumEnrollment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1beta~1enrollments/post) |
| POST | `/detection` | `detection.createDetection` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1detection/post) |
| GET | `/folders` | `folders.listFolders` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1folders/get) |
| POST | `/folders` | `folders.createFolder` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1folders/post) |
| PUT | `/folders/{id}` | `folders.replaceFolder` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1folders~1{id}/put) |
| PATCH | `/folders/{id}` | `folders.updateFolder` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1folders~1{id}/patch) |
| DELETE | `/folders/{id}` | `folders.deleteFolder` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1folders~1{id}/delete) |
| GET | `/global_build_commands` | `globalBuildCommands.listGlobalBuildCommands` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_build_commands/get) |
| POST | `/global_build_commands` | `globalBuildCommands.createGlobalBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_build_commands/post) |
| GET | `/global_build_commands/{id}` | `globalBuildCommands.getGlobalBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_build_commands~1{id}/get) |
| PUT | `/global_build_commands/{id}` | `globalBuildCommands.replaceGlobalBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_build_commands~1{id}/put) |
| PATCH | `/global_build_commands/{id}` | `globalBuildCommands.updateGlobalBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_build_commands~1{id}/patch) |
| DELETE | `/global_build_commands/{id}` | `globalBuildCommands.deleteGlobalBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_build_commands~1{id}/delete) |
| GET | `/global_config_files` | `globalConfigFiles.listGlobalConfigFiles` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_config_files/get) |
| POST | `/global_config_files` | `globalConfigFiles.createGlobalConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_config_files/post) |
| GET | `/global_config_files/{id}` | `globalConfigFiles.getGlobalConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_config_files~1{id}/get) |
| PUT | `/global_config_files/{id}` | `globalConfigFiles.replaceGlobalConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_config_files~1{id}/put) |
| PATCH | `/global_config_files/{id}` | `globalConfigFiles.updateGlobalConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_config_files~1{id}/patch) |
| DELETE | `/global_config_files/{id}` | `globalConfigFiles.deleteGlobalConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_config_files~1{id}/delete) |
| GET | `/global_environment_variables` | `globalEnvironmentVariables.listGlobalEnvironmentVariables` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_environment_variables/get) |
| POST | `/global_environment_variables` | `globalEnvironmentVariables.createGlobalEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_environment_variables/post) |
| GET | `/global_environment_variables/{id}` | `globalEnvironmentVariables.getGlobalEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_environment_variables~1{id}/get) |
| PUT | `/global_environment_variables/{id}` | `globalEnvironmentVariables.replaceGlobalEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_environment_variables~1{id}/put) |
| PATCH | `/global_environment_variables/{id}` | `globalEnvironmentVariables.updateGlobalEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_environment_variables~1{id}/patch) |
| DELETE | `/global_environment_variables/{id}` | `globalEnvironmentVariables.deleteGlobalEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_environment_variables~1{id}/delete) |
| GET | `/global_servers` | `globalServers.listGlobalServers` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers/get) |
| POST | `/global_servers` | `globalServers.createGlobalServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers/post) |
| GET | `/global_servers/{id}` | `globalServers.getGlobalServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers~1{id}/get) |
| PUT | `/global_servers/{id}` | `globalServers.replaceGlobalServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers~1{id}/put) |
| PATCH | `/global_servers/{id}` | `globalServers.updateGlobalServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers~1{id}/patch) |
| DELETE | `/global_servers/{id}` | `globalServers.deleteGlobalServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers~1{id}/delete) |
| POST | `/global_servers/{id}/copy_to_project` | `globalServers.copyToProjectGlobalServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_servers~1{id}~1copy_to_project/post) |
| GET | `/global_ssh_commands` | `globalSshCommands.listGlobalSshCommands` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_ssh_commands/get) |
| POST | `/global_ssh_commands` | `globalSshCommands.createGlobalSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_ssh_commands/post) |
| GET | `/global_ssh_commands/{id}` | `globalSshCommands.getGlobalSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_ssh_commands~1{id}/get) |
| PUT | `/global_ssh_commands/{id}` | `globalSshCommands.replaceGlobalSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_ssh_commands~1{id}/put) |
| PATCH | `/global_ssh_commands/{id}` | `globalSshCommands.updateGlobalSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_ssh_commands~1{id}/patch) |
| DELETE | `/global_ssh_commands/{id}` | `globalSshCommands.deleteGlobalSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1global_ssh_commands~1{id}/delete) |
| GET | `/hosted_resources` | `hostedResources.listHostedResources` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1hosted_resources/get) |
| GET | `/hosted_resources/{id}` | `hostedResources.getHostedResource` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1hosted_resources~1{id}/get) |
| POST | `/hosted_resources/{id}/retry_provision` | `hostedResources.retryProvisionHostedResourceRetryProvision` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1hosted_resources~1{id}~1retry_provision/post) |
| POST | `/hosted_resources/{id}/sync` | `hostedResources.syncHostedResourceSync` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1hosted_resources~1{id}~1sync/post) |
| GET | `/ip_ranges` | `ipRanges.listIpRanges` | No (public) | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1ip_ranges/get) |
| GET | `/language_versions` | `languageVersions.listLanguageVersions` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1language_versions/get) |
| GET | `/managed_hosting/regions` | `managedHosting.listManagedHostingRegions` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1managed_hosting~1regions/get) |
| GET | `/managed_hosting/sizes` | `managedHosting.listManagedHostingSizes` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1managed_hosting~1sizes/get) |
| GET | `/packages` | `packages.listPackages` | No (public) | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1packages/get) |
| GET | `/profile` | `profile.getProfile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1profile/get) |
| PUT | `/profile` | `profile.replaceProfile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1profile/put) |
| PATCH | `/profile` | `profile.updateProfile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1profile/patch) |
| GET | `/projects` | `projects.listProjects` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects/get) |
| POST | `/projects` | `projects.createProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects/post) |
| GET | `/projects/{id}` | `projects.getProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}/get) |
| PUT | `/projects/{id}` | `projects.replaceProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}/put) |
| PATCH | `/projects/{id}` | `projects.updateProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}/patch) |
| DELETE | `/projects/{id}` | `projects.deleteProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}/delete) |
| POST | `/projects/{id}/ai_deployment_overview` | `projects.aiDeploymentOverviewProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}~1ai_deployment_overview/post) |
| GET | `/projects/{id}/insights` | `projects.listProjectInsights` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}~1insights/get) |
| PATCH | `/projects/{id}/regenerate_key` | `projects.regenerateKeyProjectRegenerateKey` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}~1regenerate_key/patch) |
| POST | `/projects/{id}/star` | `projects.starProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}~1star/post) |
| GET | `/projects/{id}/undeployed_changes` | `projects.undeployedChangesProjectUndeployedChange` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}~1undeployed_changes/get) |
| PATCH | `/projects/{id}/upload_key` | `projects.uploadKeyProject` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{id}~1upload_key/patch) |
| GET | `/projects/{project_id}/auto_deployments` | `automaticDeployments.listProjectAutoDeployments` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1auto_deployments/get) |
| POST | `/projects/{project_id}/auto_deployments` | `automaticDeployments.createProjectAutoDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1auto_deployments/post) |
| GET | `/projects/{project_id}/build_cache_files` | `buildCacheFiles.listProjectBuildCacheFiles` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_cache_files/get) |
| POST | `/projects/{project_id}/build_cache_files` | `buildCacheFiles.createProjectBuildCacheFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_cache_files/post) |
| PUT | `/projects/{project_id}/build_cache_files/{id}` | `buildCacheFiles.replaceProjectBuildCacheFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_cache_files~1{id}/put) |
| PATCH | `/projects/{project_id}/build_cache_files/{id}` | `buildCacheFiles.updateProjectBuildCacheFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_cache_files~1{id}/patch) |
| DELETE | `/projects/{project_id}/build_cache_files/{id}` | `buildCacheFiles.deleteProjectBuildCacheFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_cache_files~1{id}/delete) |
| GET | `/projects/{project_id}/build_commands` | `buildCommands.listProjectBuildCommands` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands/get) |
| POST | `/projects/{project_id}/build_commands` | `buildCommands.createProjectBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands/post) |
| POST | `/projects/{project_id}/build_commands/link_global` | `buildCommands.linkGlobalProjectBuildCommandLinkGlobal` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands~1link_global/post) |
| DELETE | `/projects/{project_id}/build_commands/unlink_global` | `buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands~1unlink_global/delete) |
| PUT | `/projects/{project_id}/build_commands/{id}` | `buildCommands.replaceProjectBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands~1{id}/put) |
| PATCH | `/projects/{project_id}/build_commands/{id}` | `buildCommands.updateProjectBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands~1{id}/patch) |
| DELETE | `/projects/{project_id}/build_commands/{id}` | `buildCommands.deleteProjectBuildCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_commands~1{id}/delete) |
| GET | `/projects/{project_id}/build_configuration` | `buildConfigurations.getProjectBuildConfiguration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configuration/get) |
| GET | `/projects/{project_id}/build_configurations` | `buildConfigurations.listProjectBuildConfigurations` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations/get) |
| POST | `/projects/{project_id}/build_configurations` | `buildConfigurations.createProjectBuildConfiguration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations/post) |
| GET | `/projects/{project_id}/build_configurations/{id}` | `buildConfigurations.getProjectBuildConfigurationById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations~1{id}/get) |
| PUT | `/projects/{project_id}/build_configurations/{id}` | `buildConfigurations.replaceProjectBuildConfiguration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations~1{id}/put) |
| PATCH | `/projects/{project_id}/build_configurations/{id}` | `buildConfigurations.updateProjectBuildConfiguration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations~1{id}/patch) |
| DELETE | `/projects/{project_id}/build_configurations/{id}` | `buildConfigurations.deleteProjectBuildConfiguration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations~1{id}/delete) |
| PUT | `/projects/{project_id}/build_configurations/{override_build_configuration_id}/build_languages/{id}` | `languageVersions.replaceProjectBuildConfigurationBuildLanguage` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations~1{override_build_configuration_id}~1build_languages~1{id}/put) |
| PATCH | `/projects/{project_id}/build_configurations/{override_build_configuration_id}/build_languages/{id}` | `languageVersions.updateProjectBuildConfigurationBuildLanguage` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_configurations~1{override_build_configuration_id}~1build_languages~1{id}/patch) |
| GET | `/projects/{project_id}/build_known_hosts` | `buildKnownHosts.listProjectBuildKnownHosts` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_known_hosts/get) |
| POST | `/projects/{project_id}/build_known_hosts` | `buildKnownHosts.createProjectBuildKnownHost` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_known_hosts/post) |
| DELETE | `/projects/{project_id}/build_known_hosts/{id}` | `buildKnownHosts.deleteProjectBuildKnownHost` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_known_hosts~1{id}/delete) |
| PUT | `/projects/{project_id}/build_languages/{id}` | `languageVersions.replaceProjectBuildLanguage` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_languages~1{id}/put) |
| PATCH | `/projects/{project_id}/build_languages/{id}` | `languageVersions.updateProjectBuildLanguage` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1build_languages~1{id}/patch) |
| GET | `/projects/{project_id}/commands` | `sshCommands.listProjectCommands` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands/get) |
| POST | `/projects/{project_id}/commands` | `sshCommands.createProjectCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands/post) |
| POST | `/projects/{project_id}/commands/link_global` | `sshCommands.linkGlobalProjectCommandLinkGlobal` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands~1link_global/post) |
| DELETE | `/projects/{project_id}/commands/unlink_global` | `sshCommands.unlinkGlobalProjectCommandUnlinkGlobal` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands~1unlink_global/delete) |
| GET | `/projects/{project_id}/commands/{id}` | `sshCommands.getProjectCommandById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands~1{id}/get) |
| PUT | `/projects/{project_id}/commands/{id}` | `sshCommands.replaceProjectCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands~1{id}/put) |
| PATCH | `/projects/{project_id}/commands/{id}` | `sshCommands.updateProjectCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands~1{id}/patch) |
| DELETE | `/projects/{project_id}/commands/{id}` | `sshCommands.deleteProjectCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1commands~1{id}/delete) |
| GET | `/projects/{project_id}/config_files` | `configFiles.listProjectConfigFiles` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1config_files/get) |
| POST | `/projects/{project_id}/config_files` | `configFiles.createProjectConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1config_files/post) |
| GET | `/projects/{project_id}/config_files/{id}` | `configFiles.getProjectConfigFileById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1config_files~1{id}/get) |
| PUT | `/projects/{project_id}/config_files/{id}` | `configFiles.replaceProjectConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1config_files~1{id}/put) |
| PATCH | `/projects/{project_id}/config_files/{id}` | `configFiles.updateProjectConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1config_files~1{id}/patch) |
| DELETE | `/projects/{project_id}/config_files/{id}` | `configFiles.deleteProjectConfigFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1config_files~1{id}/delete) |
| GET | `/projects/{project_id}/deployment_checks` | `deploymentChecks.listProjectDeploymentChecks` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployment_checks/get) |
| POST | `/projects/{project_id}/deployment_checks` | `deploymentChecks.createProjectDeploymentCheck` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployment_checks/post) |
| GET | `/projects/{project_id}/deployment_checks/{id}` | `deploymentChecks.getProjectDeploymentCheckById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployment_checks~1{id}/get) |
| PUT | `/projects/{project_id}/deployment_checks/{id}` | `deploymentChecks.replaceProjectDeploymentCheck` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployment_checks~1{id}/put) |
| PATCH | `/projects/{project_id}/deployment_checks/{id}` | `deploymentChecks.updateProjectDeploymentCheck` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployment_checks~1{id}/patch) |
| DELETE | `/projects/{project_id}/deployment_checks/{id}` | `deploymentChecks.deleteProjectDeploymentCheck` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployment_checks~1{id}/delete) |
| GET | `/projects/{project_id}/deployments` | `deployments.listProjectDeployments` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments/get) |
| POST | `/projects/{project_id}/deployments` | `deployments.createProjectDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments/post) |
| GET | `/projects/{project_id}/deployments/{deployment_id}/steps/{step_id}/logs` | `deployments.listProjectDeploymentStepLogs` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments~1{deployment_id}~1steps~1{step_id}~1logs/get) |
| GET | `/projects/{project_id}/deployments/{id}` | `deployments.getProjectDeploymentById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments~1{id}/get) |
| POST | `/projects/{project_id}/deployments/{id}/abort` | `deployments.abortProjectDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments~1{id}~1abort/post) |
| POST | `/projects/{project_id}/deployments/{id}/retry` | `deployments.retryProjectDeploymentRetry` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments~1{id}~1retry/post) |
| POST | `/projects/{project_id}/deployments/{id}/rollback` | `deployments.rollbackProjectDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1deployments~1{id}~1rollback/post) |
| GET | `/projects/{project_id}/environment_variables` | `environmentVariables.listProjectEnvironmentVariables` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1environment_variables/get) |
| POST | `/projects/{project_id}/environment_variables` | `environmentVariables.createProjectEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1environment_variables/post) |
| GET | `/projects/{project_id}/environment_variables/{id}` | `environmentVariables.getProjectEnvironmentVariableById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1environment_variables~1{id}/get) |
| PUT | `/projects/{project_id}/environment_variables/{id}` | `environmentVariables.replaceProjectEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1environment_variables~1{id}/put) |
| PATCH | `/projects/{project_id}/environment_variables/{id}` | `environmentVariables.updateProjectEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1environment_variables~1{id}/patch) |
| DELETE | `/projects/{project_id}/environment_variables/{id}` | `environmentVariables.deleteProjectEnvironmentVariable` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1environment_variables~1{id}/delete) |
| GET | `/projects/{project_id}/excluded_files` | `excludedFiles.listProjectExcludedFiles` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1excluded_files/get) |
| POST | `/projects/{project_id}/excluded_files` | `excludedFiles.createProjectExcludedFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1excluded_files/post) |
| GET | `/projects/{project_id}/excluded_files/{id}` | `excludedFiles.getProjectExcludedFileById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1excluded_files~1{id}/get) |
| PUT | `/projects/{project_id}/excluded_files/{id}` | `excludedFiles.replaceProjectExcludedFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1excluded_files~1{id}/put) |
| PATCH | `/projects/{project_id}/excluded_files/{id}` | `excludedFiles.updateProjectExcludedFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1excluded_files~1{id}/patch) |
| DELETE | `/projects/{project_id}/excluded_files/{id}` | `excludedFiles.deleteProjectExcludedFile` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1excluded_files~1{id}/delete) |
| GET | `/projects/{project_id}/integrations` | `integrations.listProjectIntegrations` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1integrations/get) |
| POST | `/projects/{project_id}/integrations` | `integrations.createProjectIntegration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1integrations/post) |
| GET | `/projects/{project_id}/integrations/{id}` | `integrations.getProjectIntegrationById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1integrations~1{id}/get) |
| PUT | `/projects/{project_id}/integrations/{id}` | `integrations.replaceProjectIntegration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1integrations~1{id}/put) |
| PATCH | `/projects/{project_id}/integrations/{id}` | `integrations.updateProjectIntegration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1integrations~1{id}/patch) |
| DELETE | `/projects/{project_id}/integrations/{id}` | `integrations.deleteProjectIntegration` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1integrations~1{id}/delete) |
| GET | `/projects/{project_id}/language_versions` | `languageVersions.listProjectLanguageVersions` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1language_versions/get) |
| GET | `/projects/{project_id}/repository` | `repositories.getProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository/get) |
| POST | `/projects/{project_id}/repository` | `repositories.createProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository/post) |
| PUT | `/projects/{project_id}/repository` | `repositories.replaceProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository/put) |
| PATCH | `/projects/{project_id}/repository` | `repositories.updateProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository/patch) |
| GET | `/projects/{project_id}/repository/branches` | `repositories.branchesProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository~1branches/get) |
| GET | `/projects/{project_id}/repository/commit_info` | `repositories.commitInfoProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository~1commit_info/get) |
| GET | `/projects/{project_id}/repository/latest_revision` | `repositories.latestRevisionProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository~1latest_revision/get) |
| GET | `/projects/{project_id}/repository/recent_commits` | `repositories.recentCommitsProjectRepository` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1repository~1recent_commits/get) |
| GET | `/projects/{project_id}/scheduled_deployments` | `scheduledDeployments.listProjectScheduledDeployments` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1scheduled_deployments/get) |
| POST | `/projects/{project_id}/scheduled_deployments` | `scheduledDeployments.createProjectScheduledDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1scheduled_deployments/post) |
| GET | `/projects/{project_id}/scheduled_deployments/{id}` | `scheduledDeployments.getProjectScheduledDeploymentById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1scheduled_deployments~1{id}/get) |
| PUT | `/projects/{project_id}/scheduled_deployments/{id}` | `scheduledDeployments.replaceProjectScheduledDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1scheduled_deployments~1{id}/put) |
| PATCH | `/projects/{project_id}/scheduled_deployments/{id}` | `scheduledDeployments.updateProjectScheduledDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1scheduled_deployments~1{id}/patch) |
| DELETE | `/projects/{project_id}/scheduled_deployments/{id}` | `scheduledDeployments.deleteProjectScheduledDeployment` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1scheduled_deployments~1{id}/delete) |
| GET | `/projects/{project_id}/server_groups` | `serverGroups.listProjectServerGroups` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1server_groups/get) |
| POST | `/projects/{project_id}/server_groups` | `serverGroups.createProjectServerGroup` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1server_groups/post) |
| GET | `/projects/{project_id}/server_groups/{id}` | `serverGroups.getProjectServerGroupById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1server_groups~1{id}/get) |
| PUT | `/projects/{project_id}/server_groups/{id}` | `serverGroups.replaceProjectServerGroup` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1server_groups~1{id}/put) |
| PATCH | `/projects/{project_id}/server_groups/{id}` | `serverGroups.updateProjectServerGroup` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1server_groups~1{id}/patch) |
| DELETE | `/projects/{project_id}/server_groups/{id}` | `serverGroups.deleteProjectServerGroup` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1server_groups~1{id}/delete) |
| GET | `/projects/{project_id}/servers` | `servers.listProjectServers` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers/get) |
| POST | `/projects/{project_id}/servers` | `servers.createProjectServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers/post) |
| GET | `/projects/{project_id}/servers/{id}` | `servers.getProjectServerById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{id}/get) |
| PUT | `/projects/{project_id}/servers/{id}` | `servers.replaceProjectServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{id}/put) |
| PATCH | `/projects/{project_id}/servers/{id}` | `servers.updateProjectServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{id}/patch) |
| DELETE | `/projects/{project_id}/servers/{id}` | `servers.deleteProjectServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{id}/delete) |
| POST | `/projects/{project_id}/servers/{id}/reset_host_key` | `servers.resetHostKeyProjectServer` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{id}~1reset_host_key/post) |
| GET | `/projects/{project_id}/servers/{id}/server_metrics` | `servers.serverMetricsProjectServerServerMetric` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{id}~1server_metrics/get) |
| POST | `/projects/{project_id}/servers/{server_id}/test_access` | `testAccess.createProjectServerTestAccess` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1servers~1{server_id}~1test_access/post) |
| GET | `/projects/{project_id}/ssh_commands` | `sshCommands.listProjectSshCommands` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1ssh_commands/get) |
| POST | `/projects/{project_id}/ssh_commands` | `sshCommands.createProjectSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1ssh_commands/post) |
| GET | `/projects/{project_id}/ssh_commands/{id}` | `sshCommands.getProjectSshCommandById` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1ssh_commands~1{id}/get) |
| PUT | `/projects/{project_id}/ssh_commands/{id}` | `sshCommands.replaceProjectSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1ssh_commands~1{id}/put) |
| PATCH | `/projects/{project_id}/ssh_commands/{id}` | `sshCommands.updateProjectSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1ssh_commands~1{id}/patch) |
| DELETE | `/projects/{project_id}/ssh_commands/{id}` | `sshCommands.deleteProjectSshCommand` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1ssh_commands~1{id}/delete) |
| POST | `/projects/{project_id}/test_access` | `testAccess.createProjectTestAccess` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1test_access/post) |
| GET | `/projects/{project_id}/test_access/{id}` | `testAccess.getProjectTestAccess` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1projects~1{project_id}~1test_access~1{id}/get) |
| POST | `/reset` | `account.resetPasswordSubmitReset` | No (public) | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1reset/post) |
| POST | `/security/api_keys` | `security.createSecurityApiKey` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1security~1api_keys/post) |
| DELETE | `/security/api_keys/{id}` | `security.deleteSecurityApiKey` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1security~1api_keys~1{id}/delete) |
| GET | `/ssh_keys` | `sshKeys.listSshKeys` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1ssh_keys/get) |
| POST | `/ssh_keys` | `sshKeys.createSshKey` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1ssh_keys/post) |
| DELETE | `/ssh_keys/{id}` | `sshKeys.deleteSshKey` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1ssh_keys~1{id}/delete) |
| GET | `/ssh_keys/{id}/download_private_key` | `sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1ssh_keys~1{id}~1download_private_key/get) |
| GET | `/teams` | `teams.listTeams` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1teams/get) |
| POST | `/teams` | `teams.createTeam` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1teams/post) |
| GET | `/teams/{id}` | `teams.getTeam` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1teams~1{id}/get) |
| PUT | `/teams/{id}` | `teams.replaceTeam` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1teams~1{id}/put) |
| PATCH | `/teams/{id}` | `teams.updateTeam` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1teams~1{id}/patch) |
| DELETE | `/teams/{id}` | `teams.deleteTeam` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1teams~1{id}/delete) |
| GET | `/templates` | `templates.listTemplates` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates/get) |
| POST | `/templates` | `templates.createTemplate` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates/post) |
| GET | `/templates/public_templates` | `templates.publicTemplatesTemplate` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates~1public_templates/get) |
| PUT | `/templates/{id}` | `templates.replaceTemplate` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates~1{id}/put) |
| PATCH | `/templates/{id}` | `templates.updateTemplate` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates~1{id}/patch) |
| DELETE | `/templates/{id}` | `templates.deleteTemplate` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates~1{id}/delete) |
| GET | `/templates/{id}/public/{id}` | `templates.showPublicTemplateTemplatePublic` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1templates~1{id}~1public~1{id}/get) |
| GET | `/users` | `users.listUsers` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users/get) |
| POST | `/users` | `users.createUser` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users/post) |
| GET | `/users/{id}` | `users.getUser` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users~1{id}/get) |
| PUT | `/users/{id}` | `users.replaceUser` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users~1{id}/put) |
| PATCH | `/users/{id}` | `users.updateUser` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users~1{id}/patch) |
| DELETE | `/users/{id}` | `users.deleteUser` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users~1{id}/delete) |
| POST | `/users/{id}/resend_invitation` | `users.resendInvitationUserResendInvitation` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1users~1{id}~1resend_invitation/post) |
| GET | `/zones` | `zones.listZones` | Basic | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1zones/get) |
| GET | `/{id}/status_badge.svg` | `projects.statusBadgeStatusBadge` | No (public) | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1{id}~1status_badge.svg/get) |
| GET | `/{id}/{identifier}/status_badge.svg` | `projects.statusBadgeStatusBadgeByIdentifier` | No (public) | [OpenAPI](https://api.deployhq.com/docs.json#/paths/~1{id}~1{identifier}~1status_badge.svg/get) |
