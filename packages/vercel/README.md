# @corsair-dev/vercel

Vercel plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/vercel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `aliases.assignAlias` | `vercel.api.aliases.assignAlias` | `write` | Point a hostname at a deployment. If the hostname already serves another deployment it moves, so live traffic switches; the response names the old deployment so it can be moved back. |
| `aliases.deleteAlias` | `vercel.api.aliases.deleteAlias` | `destructive` | Remove an alias by id or hostname. The hostname stops serving the deployment until it is assigned again, and share links on it are lost. |
| `aliases.getAlias` | `vercel.api.aliases.getAlias` | `read` | Get one alias by id or hostname: the deployment and project it points at, redirect settings and creator. |
| `aliases.getAliases` | `vercel.api.aliases.getAliases` | `read` | List aliases (hostnames pointing at deployments), newest first, filtered by domain or project. Page with until = pagination.next. |
| `aliases.getDeploymentAliases` | `vercel.api.aliases.getDeploymentAliases` | `read` | List the aliases (hostnames) currently pointing at a deployment. |
| `deployments.cancelDeployment` | `vercel.api.deployments.cancelDeployment` | `write` | Stop a deployment that is still queued or building. Fails with 400 once it is READY, ERROR or already CANCELED. Redeploy to build it again. |
| `deployments.createDeployment` | `vercel.api.deployments.createDeployment` | `destructive` | Start a deployment from a Git ref, from inline files, or as a redeploy of an existing deployment. It builds in the background: follow readyState with getDeployment. target production replaces the live site once ready. |
| `deployments.deleteDeployment` | `vercel.api.deployments.deleteDeployment` | `destructive` | Delete a deployment by id or hostname. Its URL stops serving and its build output and logs are gone. Cannot be undone. |
| `deployments.getDeployment` | `vercel.api.deployments.getDeployment` | `read` | Get one deployment by id or hostname: readyState (QUEUED, BUILDING, READY, ERROR, CANCELED), URL, aliases, creator, Git metadata and error details. |
| `deployments.getDeploymentEvents` | `vercel.api.deployments.getDeploymentEvents` | `read` | Read the build logs of a deployment: stdout/stderr lines and state changes, oldest first by default. Returns what has been logged so far; it does not wait for new lines. |
| `deployments.getDeploymentFiles` | `vercel.api.deployments.getDeploymentFiles` | `read` | Get the source file tree of a deployment made with the CLI or the API files field. Git deployments have no file tree and return 404. |
| `deployments.getDeployments` | `vercel.api.deployments.getDeployments` | `read` | List deployments, newest first, filtered by project, environment, state, branch, commit or creator. Page with until = pagination.next. |
| `dns.createRecord` | `vercel.api.dns.createRecord` | `write` | Add a DNS record to a domain whose DNS is on Vercel. Fields depend on type: A, AAAA, ALIAS, CAA, CNAME, TXT and NS take value; MX takes value and mxPriority; SRV takes srv; HTTPS takes https. Takes effect on live traffic and email. |
| `dns.deleteRecord` | `vercel.api.dns.deleteRecord` | `destructive` | Delete a DNS record from a domain. Takes effect on live traffic and email, and the record cannot be restored, only recreated with a new id. |
| `dns.getRecords` | `vercel.api.dns.getRecords` | `read` | List the DNS records in a domain's Vercel DNS zone, 20 per page by default. Empty when the domain's DNS is hosted elsewhere (check serviceType with domains.getDomain). For the next page pass pagination.next as until. |
| `dns.updateRecord` | `vercel.api.dns.updateRecord` | `write` | Change an existing DNS record by id (from getRecords): name, value, type, TTL, MX priority, SRV or HTTPS data, comment. Takes effect on live traffic and email; read the record first to be able to restore it. |
| `domains.addDomain` | `vercel.api.domains.addDomain` | `write` | Add a domain you already own to the account. No purchase or transfer. It may need ownership verification through DNS before it serves; zone: true creates a Vercel DNS zone (use when its nameservers point at Vercel). To serve it from a project, also call addProjectDomain. |
| `domains.addProjectDomain` | `vercel.api.domains.addProjectDomain` | `write` | Assign a domain to a project, optionally as a redirect or tied to a git branch or custom environment. If verified comes back false, set the record listed in verification, then call verifyProjectDomain. Errors if the domain is already on the project. |
| `domains.deleteDomain` | `vercel.api.domains.deleteDomain` | `destructive` | Remove a domain from the account. Also removes its aliases and every DNS record in its Vercel DNS zone; the records cannot be recovered. Does not cancel a registration held at another registrar. |
| `domains.getDomain` | `vercel.api.domains.getDomain` | `read` | Get one account domain by name: whether ownership is verified, current and intended nameservers, whether Vercel serves its DNS (serviceType), and purchase/expiry dates when bought through Vercel. |
| `domains.getDomainConfig` | `vercel.api.domains.getDomainConfig` | `read` | Check whether a domain's DNS points at Vercel: misconfigured, configuredBy (A, CNAME, http or null) and the recommended A and CNAME values to set at the DNS provider. Pass projectIdOrName for a domain not on a project yet. |
| `domains.getDomains` | `vercel.api.domains.getDomains` | `read` | List the domains in the account or team (apex domains, not per-project assignments), newest first, 20 per page by default. For the next page pass pagination.next as until. |
| `domains.getProjectDomain` | `vercel.api.domains.getProjectDomain` | `read` | Get one domain on a project, including the verification challenge (the DNS record to set) when verified is false. |
| `domains.getProjectDomains` | `vercel.api.domains.getProjectDomains` | `read` | List the domains assigned to a project (custom domains and *.vercel.app) with their redirect, git branch and verification state. Filters: production, target, gitBranch, verified, redirects, redirect, customEnvironmentId. |
| `domains.removeProjectDomain` | `vercel.api.domains.removeProjectDomain` | `destructive` | Unassign a domain from a project; it stops serving that project immediately. The domain stays in the account and can be added back, though it may need verifying again. removeRedirects: true also removes the project domains that redirect to it. |
| `domains.updateProjectDomain` | `vercel.api.domains.updateProjectDomain` | `write` | Change a project domain's git branch or redirect (target domain and status code). Pass null to clear a field. |
| `domains.verifyProjectDomain` | `vercel.api.domains.verifyProjectDomain` | `write` | Re-check an unverified project domain's verification challenge and mark it verified once the DNS record is in place. Errors if the challenge isn't satisfied yet. |
| `edgeConfig.getEdgeConfig` | `vercel.api.edgeConfig.getEdgeConfig` | `read` | Get one Edge Config (Global Config) by id: slug, item count, size and digest. |
| `edgeConfig.getEdgeConfigItem` | `vercel.api.edgeConfig.getEdgeConfigItem` | `read` | Read one Edge Config (Global Config) item by key. Returns found: false when the key does not exist. |
| `edgeConfig.getEdgeConfigItems` | `vercel.api.edgeConfig.getEdgeConfigItems` | `read` | List every item (key, JSON value, description) stored in an Edge Config (Global Config). |
| `edgeConfig.getEdgeConfigs` | `vercel.api.edgeConfig.getEdgeConfigs` | `read` | List the team’s Edge Configs (called Global Config in Vercel’s API): id, slug, item count and size. |
| `edgeConfig.updateEdgeConfigItems` | `vercel.api.edgeConfig.updateEdgeConfigItems` | `write` | Change several Edge Config (Global Config) items in one request: create, update, upsert or delete items by key. A delete removes the item and its value for good. |
| `envs.createEnvVariable` | `vercel.api.envs.createEnvVariable` | `write` | Add one or several environment variables to a project (key, value, type, target environments, optional Git branch). Variables that already exist are listed under failed unless upsert is true. Takes effect on the next deployment. |
| `envs.deleteEnvVariable` | `vercel.api.envs.deleteEnvVariable` | `destructive` | Delete an environment variable by id. Its value is gone for good; deployments built after this no longer get it. |
| `envs.getEnvVariable` | `vercel.api.envs.getEnvVariable` | `read` | Get one environment variable by id, including its DECRYPTED value (the secret itself) for encrypted and plain variables. Sensitive variables never return a value. |
| `envs.getEnvVariables` | `vercel.api.envs.getEnvVariables` | `read` | List a project’s environment variables: key, type, targets, Git branch and id. Values of encrypted and sensitive variables come back encrypted (plain ones as is); use getEnvVariable to read one decrypted value. |
| `envs.updateEnvVariable` | `vercel.api.envs.updateEnvVariable` | `write` | Change an environment variable by id: its value, key, type, targets, Git branch or comment. Takes effect on the next deployment. |
| `projects.createProject` | `vercel.api.projects.createProject` | `write` | Create a project, optionally connected to a Git repo and with initial environment variables. |
| `projects.deleteProject` | `vercel.api.projects.deleteProject` | `destructive` | Delete a project with all its deployments, domains and environment variables. Cannot be undone. |
| `projects.getProject` | `vercel.api.projects.getProject` | `read` | Get a project by id or name, with its settings and latest deployments. |
| `projects.getProjectMembers` | `vercel.api.projects.getProjectMembers` | `read` | List the members of a project and their project roles. |
| `projects.getProjects` | `vercel.api.projects.getProjects` | `read` | List projects in the team, newest first, with optional search and repo filters. |
| `projects.pauseProject` | `vercel.api.projects.pauseProject` | `write` | Pause a project: its production deployment stops serving until unpaused. |
| `projects.promoteDeployment` | `vercel.api.projects.promoteDeployment` | `write` | Make an existing production build (an earlier or staged production deployment) the live production deployment, without rebuilding. Vercel refuses preview deployments (422); redeploy those with target production instead. Runs in the background: getProject with rollbackInfo shows its jobStatus. |
| `projects.rollbackDeployment` | `vercel.api.projects.rollbackDeployment` | `write` | Roll production back to an earlier deployment (Instant Rollback). |
| `projects.unpauseProject` | `vercel.api.projects.unpauseProject` | `write` | Unpause a paused project so production serves again. |
| `projects.updateProject` | `vercel.api.projects.updateProject` | `write` | Update project settings: name, framework, build/dev/install commands, Node version, protection. |
| `teams.getTeam` | `vercel.api.teams.getTeam` | `read` | Get a team by id or slug (default: the connected team): name, slug, plan, creation date and the user’s membership. |
| `teams.getTeamMembers` | `vercel.api.teams.getTeamMembers` | `read` | List a team’s members (default: the connected team) with their role, username and email. Filter by role or search by name, username or email. |
| `teams.getTeams` | `vercel.api.teams.getTeams` | `read` | List the teams the token’s user belongs to, with each team’s id, slug, name and the user’s role. |
| `user.getUser` | `vercel.api.user.getUser` | `read` | Get the user the token belongs to: id, username, name, email and default team id. |
| `webhooks.createWebhook` | `vercel.api.webhooks.createWebhook` | `write` | Register a URL to receive Vercel events (deployments, projects, domains, env vars and more), for all projects or chosen ones. Returns the signing secret used to verify deliveries; it is shown only once, so store it. |
| `webhooks.deleteWebhook` | `vercel.api.webhooks.deleteWebhook` | `destructive` | Delete a webhook: Vercel stops sending events to its URL. A replacement gets a new id and signing secret. |
| `webhooks.getWebhook` | `vercel.api.webhooks.getWebhook` | `read` | Get one webhook by id: URL, events and projects. |
| `webhooks.getWebhooks` | `vercel.api.webhooks.getWebhooks` | `read` | List the team’s webhooks: URL, subscribed events and the projects each covers. Filter by project. |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vercel

## License

Apache-2.0
