# @corsair-dev/netlify

Netlify integration for Corsair: sites, deploys (with file and function uploads), builds and build hooks, environment variables, forms and submissions, functions, DNS zones and records, TLS certificates, split tests, snippets, Netlify DB databases, agent runs, teams, members and audit logs, deploy keys, add-ons and AI Gateway tokens, plus JWS-signed webhooks for deploy and form events (185 operations).

## Install

```bash
pnpm add @corsair-dev/netlify
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.audit.list` | `netlify.api.accounts.audit.list` | `read` | List a team's audit log events, one page at a time |
| `accounts.builds.status` | `netlify.api.accounts.builds.status` | `read` | Get a team's build status: returns the team's counts of active, concurrency-pending, and enqueued builds, and its build minutes usage |
| `accounts.cancel` | `netlify.api.accounts.cancel` | `destructive` | Cancel a team: its sites and members are removed and billing stops |
| `accounts.create` | `netlify.api.accounts.create` | `destructive` | Create a team |
| `accounts.get` | `netlify.api.accounts.get` | `read` | Get a team |
| `accounts.list` | `netlify.api.accounts.list` | `read` | List the current user's teams |
| `accounts.listTypes` | `netlify.api.accounts.listTypes` | `read` | List plans available for new teams |
| `accounts.members.add` | `netlify.api.accounts.members.add` | `destructive` | Invite someone to the team by email with a role; Netlify sends them an invitation email |
| `accounts.members.get` | `netlify.api.accounts.members.get` | `read` | Get a team member |
| `accounts.members.list` | `netlify.api.accounts.members.list` | `read` | List a team's members |
| `accounts.members.remove` | `netlify.api.accounts.members.remove` | `destructive` | Remove a team member |
| `accounts.members.update` | `netlify.api.accounts.members.update` | `write` | Update a team member |
| `accounts.sites.create` | `netlify.api.accounts.sites.create` | `write` | Create a site in a team |
| `accounts.sites.list` | `netlify.api.accounts.sites.list` | `read` | List a team's sites, one page at a time |
| `accounts.update` | `netlify.api.accounts.update` | `destructive` | Update a team |
| `agentRunners.archive` | `netlify.api.agentRunners.archive` | `write` | Archive an agent run |
| `agentRunners.commitToBranch` | `netlify.api.agentRunners.commitToBranch` | `destructive` | Commit an agent run's changes to a branch: queues a commit of the run's diff to `target_branch` |
| `agentRunners.create` | `netlify.api.agentRunners.create` | `destructive` | Start an agent run |
| `agentRunners.createPullRequest` | `netlify.api.agentRunners.createPullRequest` | `destructive` | Open a pull request from an agent run: queues a pull request for the run's diff (`result_diff`) |
| `agentRunners.createUploadUrl` | `netlify.api.agentRunners.createUploadUrl` | `write` | Create an upload URL for agent run files: returns a presigned URL for uploading a file that agent run sessions can use, and the file's storage key |
| `agentRunners.delete` | `netlify.api.agentRunners.delete` | `write` | Stop an agent run (alias): same as `POST /agent_runners/{agent_runner_id}/stop` |
| `agentRunners.get` | `netlify.api.agentRunners.get` | `read` | Get an agent run |
| `agentRunners.getDiff` | `netlify.api.agentRunners.getDiff` | `read` | Get an agent run's diff: returns the run's changes as a unified diff (returned as text) |
| `agentRunners.list` | `netlify.api.agentRunners.list` | `read` | List a site's agent runs: lists a site's agent runs, most recently active first, one page at a time |
| `agentRunners.sessions.answer` | `netlify.api.agentRunners.sessions.answer` | `destructive` | Answer an agent run session's pending interaction: answers or skips a pending interaction and resumes the session |
| `agentRunners.sessions.create` | `netlify.api.agentRunners.sessions.create` | `destructive` | Start a follow-up agent run session: starts a follow-up session on the run |
| `agentRunners.sessions.delete` | `netlify.api.agentRunners.sessions.delete` | `write` | Stop an agent run session (alias): same as `POST /agent_runners/{agent_runner_id}/sessions/{agent_runner_session_id}/stop` |
| `agentRunners.sessions.get` | `netlify.api.agentRunners.sessions.get` | `read` | Get an agent run session |
| `agentRunners.sessions.list` | `netlify.api.agentRunners.sessions.list` | `read` | List an agent run's sessions, one page at a time |
| `agentRunners.sessions.stop` | `netlify.api.agentRunners.sessions.stop` | `write` | Stop an agent run session: stops the session |
| `agentRunners.sessions.update` | `netlify.api.agentRunners.sessions.update` | `write` | Update an agent run session |
| `agentRunners.stop` | `netlify.api.agentRunners.stop` | `write` | Stop an agent run: stops the run's active session |
| `agentRunners.update` | `netlify.api.agentRunners.update` | `write` | Update an agent run |
| `aiGateway.getAccountToken` | `netlify.api.aiGateway.getAccountToken` | `read` | Get a team's AI Gateway token: returns an AI Gateway token scoped to an account |
| `aiGateway.getSiteToken` | `netlify.api.aiGateway.getSiteToken` | `read` | Get a site's AI Gateway token: returns an AI Gateway token for a specific site |
| `aiGateway.listProviders` | `netlify.api.aiGateway.listProviders` | `read` | List AI Gateway providers and models |
| `billing.paymentMethods.list` | `netlify.api.billing.paymentMethods.list` | `read` | List payment methods |
| `builds.appendLog` | `netlify.api.builds.appendLog` | `write` | Add a message to a build log |
| `builds.get` | `netlify.api.builds.get` | `read` | Get a build |
| `builds.notifyStart` | `netlify.api.builds.notifyStart` | `write` | Mark a build as started |
| `cache.purge` | `netlify.api.cache.purge` | `write` | Purge cached content from Netlify's CDN for a site (`site_id` or `site_slug`), optionally only the responses with given cache tags |
| `deployKeys.create` | `netlify.api.deployKeys.create` | `write` | Create a deploy key |
| `deployKeys.delete` | `netlify.api.deployKeys.delete` | `destructive` | Delete a deploy key |
| `deployKeys.get` | `netlify.api.deployKeys.get` | `read` | Get a deploy key |
| `deployKeys.list` | `netlify.api.deployKeys.list` | `read` | List deploy keys |
| `deploys.cancel` | `netlify.api.deploys.cancel` | `write` | Cancel a deploy |
| `deploys.delete` | `netlify.api.deploys.delete` | `destructive` | Delete a deploy: marks a deploy for deletion |
| `deploys.get` | `netlify.api.deploys.get` | `read` | Get a deploy |
| `deploys.lock` | `netlify.api.deploys.lock` | `write` | Lock a deploy: locks a deploy so that subsequent deploys are built but not published |
| `deploys.unlock` | `netlify.api.deploys.unlock` | `write` | Unlock a deploy |
| `deploys.updateValidationsReport` | `netlify.api.deploys.updateValidationsReport` | `write` | Update a deploy's validations report: updates the deploy validations report for a deploy |
| `deploys.uploadEdgeFunction` | `netlify.api.deploys.uploadEdgeFunction` | `write` | Upload a deploy's edge functions bundle |
| `deploys.uploadFile` | `netlify.api.deploys.uploadFile` | `write` | Upload one file a deploy listed as required: `path` is the file path in the site (`index.html`, `assets/app.js`), the bytes are the body |
| `deploys.uploadFunction` | `netlify.api.deploys.uploadFunction` | `write` | Upload one function bundle (a zip) a deploy listed as required, by function name |
| `deploys.uploadServer` | `netlify.api.deploys.uploadServer` | `write` | Upload a deploy's Netlify Server bundle: uploads the deploy's Netlify Server bundle, addressed by the digest the deploy declared in its `server` property |
| `dns.records.create` | `netlify.api.dns.records.create` | `write` | Create a DNS record |
| `dns.records.delete` | `netlify.api.dns.records.delete` | `destructive` | Delete a DNS record |
| `dns.records.get` | `netlify.api.dns.records.get` | `read` | Get a DNS record |
| `dns.records.list` | `netlify.api.dns.records.list` | `read` | List a DNS zone's records |
| `dns.zones.create` | `netlify.api.dns.zones.create` | `write` | Create a DNS zone |
| `dns.zones.delete` | `netlify.api.dns.zones.delete` | `destructive` | Delete a DNS zone |
| `dns.zones.get` | `netlify.api.dns.zones.get` | `read` | Get a DNS zone |
| `dns.zones.list` | `netlify.api.dns.zones.list` | `read` | List DNS zones: returns the DNS zones for the team given by `account_slug`, or all DNS zones the current user can access |
| `dns.zones.transfer` | `netlify.api.dns.zones.transfer` | `destructive` | Transfer a DNS zone to another team |
| `env.create` | `netlify.api.env.create` | `write` | Create one or more environment variables on a team, or on one site with `site_id`; each takes `key`, `scopes`, `values` (per deploy context) and `is_secret` |
| `env.delete` | `netlify.api.env.delete` | `destructive` | Delete an environment variable: deletes an environment variable |
| `env.deleteValue` | `netlify.api.env.deleteValue` | `destructive` | Delete an environment variable value: deletes a specific environment variable value |
| `env.get` | `netlify.api.env.get` | `read` | Get an environment variable: returns an individual environment variable |
| `env.list` | `netlify.api.env.list` | `read` | List environment variables for a team or site: returns all environment variables for an account or site |
| `env.listForSite` | `netlify.api.env.listForSite` | `read` | List environment variables for a site: returns all environment variables for a site |
| `env.setValue` | `netlify.api.env.setValue` | `write` | Set a value on an environment variable: updates or creates a new value for an existing environment variable |
| `env.update` | `netlify.api.env.update` | `write` | Update an environment variable: updates an existing environment variable and all of its values |
| `forms.submissions.list` | `netlify.api.forms.submissions.list` | `read` | List a form's submissions, one page at a time |
| `hooks.create` | `netlify.api.hooks.create` | `write` | Create an outgoing notification for a site: type `url` with `data.url` (and `data.signature_secret` to sign deliveries with a JWS the plugin's webhooks check), `slack` or `email`, for one event (deploy_created, deploy_failed, submission_created...) |
| `hooks.delete` | `netlify.api.hooks.delete` | `destructive` | Delete an outgoing hook |
| `hooks.enable` | `netlify.api.hooks.enable` | `write` | Re-enable an outgoing hook: re-enables an outgoing hook that was disabled after repeated delivery errors |
| `hooks.get` | `netlify.api.hooks.get` | `read` | Get an outgoing hook |
| `hooks.list` | `netlify.api.hooks.list` | `read` | List a site's outgoing hooks: returns the outgoing hooks for a site |
| `hooks.listTypes` | `netlify.api.hooks.listTypes` | `read` | List outgoing hook types: returns the available outgoing hook types |
| `hooks.update` | `netlify.api.hooks.update` | `write` | Update an outgoing hook |
| `oauth.tickets.create` | `netlify.api.oauth.tickets.create` | `write` | Create an OAuth ticket |
| `oauth.tickets.exchange` | `netlify.api.oauth.tickets.exchange` | `write` | Exchange an OAuth ticket for an access token |
| `oauth.tickets.get` | `netlify.api.oauth.tickets.get` | `read` | Get an OAuth ticket |
| `services.get` | `netlify.api.services.get` | `read` | Get an add-on service |
| `services.getManifest` | `netlify.api.services.getManifest` | `read` | Get an add-on service's manifest |
| `services.list` | `netlify.api.services.list` | `read` | List add-on services |
| `sites.agentRunnerHooks.create` | `netlify.api.sites.agentRunnerHooks.create` | `write` | Create an agent runner hook |
| `sites.agentRunnerHooks.delete` | `netlify.api.sites.agentRunnerHooks.delete` | `destructive` | Delete an agent runner hook |
| `sites.agentRunnerHooks.get` | `netlify.api.sites.agentRunnerHooks.get` | `read` | Get an agent runner hook |
| `sites.agentRunnerHooks.list` | `netlify.api.sites.agentRunnerHooks.list` | `read` | List a site's agent runner hooks |
| `sites.agentRunnerHooks.update` | `netlify.api.sites.agentRunnerHooks.update` | `write` | Update an agent runner hook |
| `sites.agentRunners.create` | `netlify.api.sites.agentRunners.create` | `destructive` | Start an agent run on a site: starts an agent run on the site |
| `sites.assets.create` | `netlify.api.sites.assets.create` | `write` | Create a site asset (only available to some sites) |
| `sites.assets.delete` | `netlify.api.sites.assets.delete` | `destructive` | Delete a site asset (only available to some sites) |
| `sites.assets.get` | `netlify.api.sites.assets.get` | `read` | Get a site asset (only available to some sites) |
| `sites.assets.getPublicSignature` | `netlify.api.sites.assets.getPublicSignature` | `read` | Get a site asset's URL: returns the URL of the asset (only available to some sites) |
| `sites.assets.list` | `netlify.api.sites.assets.list` | `read` | List a site's assets (only available to some sites) |
| `sites.assets.update` | `netlify.api.sites.assets.update` | `write` | Update a site asset's state (only available to some sites) |
| `sites.buildHooks.create` | `netlify.api.sites.buildHooks.create` | `write` | Create a build hook |
| `sites.buildHooks.delete` | `netlify.api.sites.buildHooks.delete` | `destructive` | Delete a build hook |
| `sites.buildHooks.get` | `netlify.api.sites.buildHooks.get` | `read` | Get a build hook |
| `sites.buildHooks.list` | `netlify.api.sites.buildHooks.list` | `read` | List a site's build hooks |
| `sites.buildHooks.update` | `netlify.api.sites.buildHooks.update` | `write` | Update a build hook |
| `sites.builds.create` | `netlify.api.sites.builds.create` | `write` | Start a build for the site from its linked repository (or from an uploaded zip), optionally for a branch or commit; uses build minutes |
| `sites.builds.list` | `netlify.api.sites.builds.list` | `read` | List a site's builds, one page at a time |
| `sites.create` | `netlify.api.sites.create` | `write` | Create a site in your personal team (accounts.sites.create picks the team), optionally linked to a Git repository with build settings |
| `sites.database.branches.create` | `netlify.api.sites.database.branches.create` | `write` | Create a database branch: creates a new database branch |
| `sites.database.branches.delete` | `netlify.api.sites.database.branches.delete` | `destructive` | Delete a database branch: deletes a database branch |
| `sites.database.branches.get` | `netlify.api.sites.database.branches.get` | `read` | Get a database branch: returns the database branch connection string for a specific branch |
| `sites.database.branches.list` | `netlify.api.sites.database.branches.list` | `read` | List database branches: returns all branches for the site's database with compute status and metadata |
| `sites.database.branches.reset` | `netlify.api.sites.database.branches.reset` | `destructive` | Reset a database branch: resets a non-production database branch by re-forking it from a source branch (defaults to the production branch) |
| `sites.database.branches.setComputeSettings` | `netlify.api.sites.database.branches.setComputeSettings` | `destructive` | Set a database branch's compute settings: sets compute settings for a specific database branch, overriding project-level settings |
| `sites.database.compute.clear` | `netlify.api.sites.database.compute.clear` | `destructive` | Reset database compute settings to defaults: resets project-level compute settings to tier defaults |
| `sites.database.compute.get` | `netlify.api.sites.database.compute.get` | `read` | Get database compute settings: returns the project-level compute settings for the database |
| `sites.database.compute.set` | `netlify.api.sites.database.compute.set` | `destructive` | Set database compute settings: sets project-level compute settings for the database |
| `sites.database.create` | `netlify.api.sites.database.create` | `write` | Create a site database: creates a new database for the specified site |
| `sites.database.delete` | `netlify.api.sites.database.delete` | `destructive` | Delete a site database: deletes the database and all associated branches and snapshots for the specified site |
| `sites.database.get` | `netlify.api.sites.database.get` | `read` | Get a site database: returns the database connection string for the specified site |
| `sites.database.migrations.get` | `netlify.api.sites.database.migrations.get` | `read` | Get a database migration: returns the contents of a named migration for the specified branch |
| `sites.database.migrations.list` | `netlify.api.sites.database.migrations.list` | `read` | List database migrations: returns the list of migrations available for the specified branch, indicating which ones have been applied to the database |
| `sites.database.migrations.run` | `netlify.api.sites.database.migrations.run` | `destructive` | Run database migrations for a deploy: runs database migrations for the specified deploy |
| `sites.database.snapshots.create` | `netlify.api.sites.database.snapshots.create` | `write` | Create a database snapshot: creates a point-in-time snapshot of a database branch |
| `sites.database.snapshots.delete` | `netlify.api.sites.database.snapshots.delete` | `destructive` | Delete a database snapshot: deletes a database snapshot |
| `sites.database.snapshots.list` | `netlify.api.sites.database.snapshots.list` | `read` | List database snapshots: returns all snapshots for the site's database |
| `sites.database.snapshots.restore` | `netlify.api.sites.database.snapshots.restore` | `destructive` | Restore a database snapshot: restores a snapshot to a database branch |
| `sites.delete` | `netlify.api.sites.delete` | `destructive` | Permanently delete a site with all its deploys, forms, functions and settings; its netlify.app subdomain is released |
| `sites.deployedBranches.list` | `netlify.api.sites.deployedBranches.list` | `read` | List a site's deployed branches |
| `sites.deploys.create` | `netlify.api.sites.deploys.create` | `write` | Create a deploy from a file digest (`files`: path -> SHA1) and function digests. Netlify answers with `required` (the SHA1s it still needs); upload each with deploys.uploadFile, and the deploy goes live when the last one lands |
| `sites.deploys.delete` | `netlify.api.sites.deploys.delete` | `destructive` | Delete a site's deploy: marks a deploy for deletion |
| `sites.deploys.get` | `netlify.api.sites.deploys.get` | `read` | Get a site's deploy |
| `sites.deploys.list` | `netlify.api.sites.deploys.list` | `read` | List a site's deploys, one page at a time |
| `sites.deploys.restore` | `netlify.api.sites.deploys.restore` | `write` | Restore a previous deploy: publishes a previous deploy of the site |
| `sites.deploys.rollback` | `netlify.api.sites.deploys.rollback` | `write` | Roll back a site's production deploy: rolls back the production deploy to the deploy referenced by its `rollback_id` |
| `sites.deploys.update` | `netlify.api.sites.deploys.update` | `write` | Update a deploy |
| `sites.devServerHooks.create` | `netlify.api.sites.devServerHooks.create` | `write` | Create a dev server hook |
| `sites.devServerHooks.delete` | `netlify.api.sites.devServerHooks.delete` | `destructive` | Delete a dev server hook |
| `sites.devServerHooks.get` | `netlify.api.sites.devServerHooks.get` | `read` | Get a dev server hook |
| `sites.devServerHooks.list` | `netlify.api.sites.devServerHooks.list` | `read` | List a site's dev server hooks |
| `sites.devServerHooks.update` | `netlify.api.sites.devServerHooks.update` | `write` | Update a dev server hook |
| `sites.devServers.create` | `netlify.api.sites.devServers.create` | `write` | Start a dev server |
| `sites.devServers.deleteAll` | `netlify.api.sites.devServers.deleteAll` | `write` | Stop a branch's dev servers: stops all dev servers for a branch |
| `sites.devServers.get` | `netlify.api.sites.devServers.get` | `read` | Get a dev server |
| `sites.devServers.list` | `netlify.api.sites.devServers.list` | `read` | List a site's dev servers, one page at a time |
| `sites.devServers.markActivity` | `netlify.api.sites.devServers.markActivity` | `write` | Record dev server activity |
| `sites.devServers.updateState` | `netlify.api.sites.devServers.updateState` | `write` | Update a dev server's state |
| `sites.disable` | `netlify.api.sites.disable` | `destructive` | Disable a site: disables a site, preventing it from serving content |
| `sites.dns.configure` | `netlify.api.sites.dns.configure` | `write` | Configure a site's DNS: creates any missing DNS zones and records for the site's custom domain and domain aliases |
| `sites.dns.get` | `netlify.api.sites.dns.get` | `read` | Get a site's DNS configuration |
| `sites.enable` | `netlify.api.sites.enable` | `write` | Enable a site: re-enables a site that was previously disabled by the user |
| `sites.files.get` | `netlify.api.sites.files.get` | `read` | Get a site file by path |
| `sites.files.list` | `netlify.api.sites.files.list` | `read` | List a site's files |
| `sites.forms.delete` | `netlify.api.sites.forms.delete` | `destructive` | Delete a form: deletes a form and all of its submissions |
| `sites.forms.list` | `netlify.api.sites.forms.list` | `read` | List a site's forms |
| `sites.functions.list` | `netlify.api.sites.functions.list` | `read` | Search a site's functions |
| `sites.get` | `netlify.api.sites.get` | `read` | Get a site |
| `sites.identity.users.get` | `netlify.api.sites.identity.users.get` | `read` | Get an Identity user: returns one Identity user by ID |
| `sites.identity.users.lookup` | `netlify.api.sites.identity.users.lookup` | `read` | Look up an Identity user by email: returns the one Identity user with this exact email |
| `sites.list` | `netlify.api.sites.list` | `read` | List the sites the token can see, filterable by name and by owner (`filter`: all, owner or guest), one page at a time |
| `sites.metadata.get` | `netlify.api.sites.metadata.get` | `read` | Get a site's metadata |
| `sites.metadata.update` | `netlify.api.sites.metadata.update` | `write` | Update a site's metadata |
| `sites.serviceInstances.create` | `netlify.api.sites.serviceInstances.create` | `destructive` | Create an add-on instance |
| `sites.serviceInstances.delete` | `netlify.api.sites.serviceInstances.delete` | `destructive` | Delete an add-on instance |
| `sites.serviceInstances.get` | `netlify.api.sites.serviceInstances.get` | `read` | Get an add-on instance |
| `sites.serviceInstances.list` | `netlify.api.sites.serviceInstances.list` | `read` | List a site's add-on instances |
| `sites.serviceInstances.update` | `netlify.api.sites.serviceInstances.update` | `write` | Update an add-on instance |
| `sites.snippets.create` | `netlify.api.sites.snippets.create` | `write` | Create a snippet |
| `sites.snippets.delete` | `netlify.api.sites.snippets.delete` | `destructive` | Delete a snippet |
| `sites.snippets.get` | `netlify.api.sites.snippets.get` | `read` | Get a snippet |
| `sites.snippets.list` | `netlify.api.sites.snippets.list` | `read` | List a site's snippets |
| `sites.snippets.update` | `netlify.api.sites.snippets.update` | `write` | Update a snippet |
| `sites.splitTests.create` | `netlify.api.sites.splitTests.create` | `write` | Create a split test |
| `sites.splitTests.get` | `netlify.api.sites.splitTests.get` | `read` | Get a split test |
| `sites.splitTests.list` | `netlify.api.sites.splitTests.list` | `read` | List a site's split tests |
| `sites.splitTests.publish` | `netlify.api.sites.splitTests.publish` | `write` | Publish a split test |
| `sites.splitTests.unpublish` | `netlify.api.sites.splitTests.unpublish` | `write` | Unpublish a split test |
| `sites.splitTests.update` | `netlify.api.sites.splitTests.update` | `write` | Update a split test |
| `sites.ssl.get` | `netlify.api.sites.ssl.get` | `read` | Get a site's TLS certificate |
| `sites.ssl.listCertificates` | `netlify.api.sites.ssl.listCertificates` | `read` | List TLS certificates for a site's domain: returns details about the certificates associated with a domain |
| `sites.ssl.provision` | `netlify.api.sites.ssl.provision` | `write` | Provision or update a site's TLS certificate: provisions or updates a TLS certificate for the site |
| `sites.submissions.list` | `netlify.api.sites.submissions.list` | `read` | List a site's form submissions, one page at a time |
| `sites.unlinkRepo` | `netlify.api.sites.unlinkRepo` | `destructive` | Unlink the site from its Git repository (beta): this also deletes the deploy key, build hooks and Git notifications that came with the link |
| `sites.update` | `netlify.api.sites.update` | `write` | Update a site |
| `submissions.delete` | `netlify.api.submissions.delete` | `destructive` | Delete a form submission |
| `submissions.get` | `netlify.api.submissions.get` | `read` | Get a form submission, one page at a time |
| `user.me` | `netlify.api.user.me` | `read` | Get the user the token belongs to: name, email, teams and connected accounts |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/netlify

## License

Apache-2.0
