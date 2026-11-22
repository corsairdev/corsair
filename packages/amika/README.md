# @corsair-dev/amika

Amika plugin for Corsair: create and run rigs (isolated devbox VMs for coding agents), send messages to Claude Code or Codex in them, queue shell commands, schedule jobs, and manage snapshots, services, hosts and secrets.

## Install

```bash
pnpm add @corsair-dev/amika
```

## Options

- `key`: an Amika API key (`sk_…`), from app.amika.dev → Settings → API Keys
  or `amika auth api-key create --name <name> --scope user|organization`. A
  user key acts as that person (rigs it creates commit as their git identity);
  an organization key acts for the organization. Hub stores it as the
  account's API key.

## How it is built

The 98 operations come from Amika's published OpenAPI spec
(https://app.amika.dev/api/v0beta1/openapi.json, fetched 2026-11-22). The spec
has no operation ids, so each route is named after Amika's TypeScript SDK and
CLI (`rigs.create`, `agentSessions.send`, `commandRuns.listEvents`,
`snapshots.create`, `agentCredentials.claude.create`, …):

- `amika-manifest.json` holds each operation's route, a flat input schema
  (path, query, header and body fields in one object) and its response schema.
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated from
  the same spec: input and output types, the endpoint tree, risk levels and
  descriptions written for an agent.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/openapi-schema.ts`). Inputs keep the published contract;
  responses keep the documented types but let any field be missing or `null`.

Left out of the spec's 111 routes:

- The six `/sandbox-services` and `/sandbox-snapshots` routes: exact copies of
  `/rig-services` and `/rig-snapshots` under their older names.
- The two server-sent event streams (`POST /agent-sessions/stream`,
  `GET /agent-sessions/{id}/events`). `agentSessions.send` waits for the whole
  reply, and `commandRuns.listEvents` reads a command's output page by page.
- The five `…/reveal` routes, which return a stored secret, a Claude or Codex
  credential, the Pi credential or a host's shared secret in plain text. An
  agent never needs to read one back: rigs get them injected.

Body and query fields the spec documents as another field's old name
(`sandbox_id` for `rig_id`, `sandbox` for `rig`, `working_directory` for
`cwd`) are left out too, so each input has one name.

`commandRuns.create`, `jobs.create` and `jobRuns.start` take an
`Idempotency-Key` header (required by Amika for the first two). Leave
`idempotencyKey` out and the plugin sends a new random key per call; core's
429 retries resend the same one, so a retried call can't queue a second run.

Found by the live tests (the spec says otherwise or nothing):

- A request without an `Authorization` header gets a 307 to Amika's sign-in
  page, not a 401; the plugin never sends one keyless. A bad key is a 401 with
  `{ "error": "Invalid API key" }`.
- `apiKeys.delete` deletes organization keys unless `scope: "user"` is passed:
  a user key deleted without it is a 404.
- Unset Slack and Linear defaults answer 404 (`validation_failed`), not an
  empty object.
- A command run's `status` ends at `completed`; how it ended is in
  `conclusion` (`success`, `failure`, `cancelled`, `timed_out`, …).
- A rig keeps its home folder across stop and start; `/tmp` is cleared.
- Amika Cloud size names are not listed by the API, and `a0.s` is refused;
  leaving `size` out gives the provider's default.

No incoming webhooks: Amika publishes none. Poll `rigs.get`,
`commandRuns.get` and `jobRuns.get` for status.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agentCredentials.claude.check` | `amika.api.agentCredentials.claude.check` | `read` | Checks that a stored Claude Code credential can still authenticate. |
| `agentCredentials.claude.create` | `amika.api.agentCredentials.claude.create` | `write` | Stores a Claude Code credential (type oauth or api_key) that rigs can be given. |
| `agentCredentials.claude.delete` | `amika.api.agentCredentials.claude.delete` | `destructive` | Deletes a stored Claude Code credential. |
| `agentCredentials.claude.list` | `amika.api.agentCredentials.claude.list` | `read` | Lists stored Claude Code credentials (OAuth tokens or API keys) by name and scope, never values. |
| `agentCredentials.codex.create` | `amika.api.agentCredentials.codex.create` | `write` | Stores a Codex credential (type oauth or api_key) that rigs can be given. |
| `agentCredentials.codex.delete` | `amika.api.agentCredentials.codex.delete` | `destructive` | Deletes a stored Codex credential. |
| `agentCredentials.codex.list` | `amika.api.agentCredentials.codex.list` | `read` | Lists stored Codex credentials by name and scope, never values. |
| `agentCredentials.pi.delete` | `amika.api.agentCredentials.pi.delete` | `destructive` | Deletes the Pi agent credential. |
| `agentCredentials.pi.get` | `amika.api.agentCredentials.pi.get` | `read` | Reads whether a Pi agent credential is configured. |
| `agentCredentials.pi.set` | `amika.api.agentCredentials.pi.set` | `write` | Saves the Pi agent credential. |
| `agentSessions.get` | `amika.api.agentSessions.get` | `read` | Reads one agent session: its rig, agent, status and the messages exchanged so far. |
| `agentSessions.list` | `amika.api.agentSessions.list` | `read` | Lists the organization's agent-session chats, newest first, with each one's rig, agent, model and a preview. |
| `agentSessions.send` | `amika.api.agentSessions.send` | `destructive` | Sends one message to a coding agent (Claude Code or Codex) in a rig and waits for its reply. Without sandbox_id/sandbox_name/sandbox_ref it creates a new rig from repo_url; pass session_id to continue a chat. A failed turn still answers 200 with is_error: true and the agent CLI's own message. Runs on the rig's stored agent credential and can take minutes. |
| `apiKeys.create` | `amika.api.apiKeys.create` | `write` | Creates an Amika API key (user or organization scope). The value is returned once. |
| `apiKeys.delete` | `amika.api.apiKeys.delete` | `destructive` | Deletes an Amika API key; anything using it stops working. scope defaults to organization: pass scope user to delete a user key. |
| `apiKeys.list` | `amika.api.apiKeys.list` | `read` | Lists the caller's Amika API keys (names, scopes, last use; values obfuscated). |
| `cloudAccounts.create` | `amika.api.cloudAccounts.create` | `write` | Connects a cloud provider account with its API key, so rigs can run there. |
| `cloudAccounts.delete` | `amika.api.cloudAccounts.delete` | `destructive` | Disconnects a cloud account and deletes its stored API key. |
| `cloudAccounts.get` | `amika.api.cloudAccounts.get` | `read` | Reads one connected cloud account by id or name. |
| `cloudAccounts.list` | `amika.api.cloudAccounts.list` | `read` | Lists the organization's connected cloud provider accounts that rigs can run in. |
| `cloudAccounts.listSizes` | `amika.api.cloudAccounts.listSizes` | `read` | Lists the rig sizes a cloud account offers. |
| `cloudAccounts.update` | `amika.api.cloudAccounts.update` | `write` | Updates a connected cloud account: its name or API key. |
| `commandRuns.cancel` | `amika.api.commandRuns.cancel` | `write` | Requests cancellation of a queued or running command run. |
| `commandRuns.create` | `amika.api.commandRuns.create` | `destructive` | Queues one shell command on a rig (run with bash -e -o pipefail) and answers at once. Name an existing rig (rig_id, rig_name or rig_ref) or create one with rig_create; a stopped rig is started. Poll commandRuns.get for status and commandRuns.listEvents for output. An idempotencyKey is made for you when you leave it out. |
| `commandRuns.get` | `amika.api.commandRuns.get` | `read` | Reads one command run: status (queued, in_progress, completed), conclusion (success, failure, timed_out...), exit code, timing and its rig. |
| `commandRuns.list` | `amika.api.commandRuns.list` | `read` | Lists command runs (queued shell commands on rigs), filtered by rig, status or session. |
| `commandRuns.listEvents` | `amika.api.commandRuns.listEvents` | `read` | Reads the output events of a command run after a sequence number: pass the next_sequence of the previous answer as after to read on from there. |
| `gitUserSettings.get` | `amika.api.gitUserSettings.get` | `read` | Reads the caller's git author name and email, which rigs use for commits. |
| `gitUserSettings.set` | `amika.api.gitUserSettings.set` | `write` | Sets the caller's git author name and email for commits made in rigs. |
| `hosts.checkHealth` | `amika.api.hosts.checkHealth` | `read` | Checks whether a host's daemon is answering. |
| `hosts.create` | `amika.api.hosts.create` | `write` | Registers a host for bring-your-own-compute. amika-hostd setup normally does this. |
| `hosts.delete` | `amika.api.hosts.delete` | `destructive` | Deletes a host and its stored secret; rigs can no longer be created on it. |
| `hosts.enrol` | `amika.api.hosts.enrol` | `write` | Enrols a tunnel host with its gateway. |
| `hosts.get` | `amika.api.hosts.get` | `read` | Reads one of your own hosts: its hostname, runtimes, sizes and status. |
| `hosts.list` | `amika.api.hosts.list` | `read` | Lists the organization's own hosts (machines running amika-hostd) and their runtimes and sizes. |
| `hosts.replace` | `amika.api.hosts.replace` | `write` | Replaces a host's registration: hostname, URL and settings. |
| `integrations.disconnect` | `amika.api.integrations.disconnect` | `destructive` | Disconnects an integration provider for the caller and deletes its stored token. |
| `integrations.list` | `amika.api.integrations.list` | `read` | Lists the caller's connected integrations (GitHub, Sentry, Linear, Pylon). |
| `jobRuns.cancel` | `amika.api.jobRuns.cancel` | `write` | Cancels a pending or running job run. |
| `jobRuns.get` | `amika.api.jobRuns.get` | `read` | Reads one job run: status, timing and the command run of each step. |
| `jobRuns.list` | `amika.api.jobRuns.list` | `read` | Lists job runs, filtered by job, status or trigger kind. |
| `jobRuns.start` | `amika.api.jobRuns.start` | `destructive` | Starts a run of a job now, outside its schedule. |
| `jobs.create` | `amika.api.jobs.create` | `destructive` | Creates a job: a cron trigger and 1 to 20 shell steps. Each time the trigger fires, a job run runs the steps in order on a rig. Set enabled false to create it paused. An idempotencyKey is made for you when you leave it out. |
| `jobs.delete` | `amika.api.jobs.delete` | `destructive` | Deletes a job and all of its job runs. |
| `jobs.get` | `amika.api.jobs.get` | `read` | Reads one job by id or name. |
| `jobs.list` | `amika.api.jobs.list` | `read` | Lists jobs (scheduled commands on rigs) with their trigger, steps and next run. |
| `jobs.update` | `amika.api.jobs.update` | `write` | Updates a job: its trigger, steps or description; enabled false pauses it and true resumes it. |
| `linear.settings.get` | `amika.api.linear.settings.get` | `read` | Reads the organization's Linear defaults: repository, agent and system prompt. 404 when not set. |
| `linear.settings.set` | `amika.api.linear.settings.set` | `write` | Sets the organization's Linear defaults: the repository and agent Linear issues use. |
| `repositories.clearImage` | `amika.api.repositories.clearImage` | `destructive` | Clears a repository's image configuration, so new rigs use the preset image. |
| `repositories.get` | `amika.api.repositories.get` | `read` | Reads one repository and its rig settings. |
| `repositories.integrations.list` | `amika.api.repositories.integrations.list` | `read` | Lists the MCP integrations new rigs of a repository get. |
| `repositories.integrations.set` | `amika.api.repositories.integrations.set` | `write` | Replaces the list of MCP integrations new rigs of a repository get. |
| `repositories.list` | `amika.api.repositories.list` | `read` | Lists the organization's repositories and their rig settings (setup script, image, env). |
| `repositories.upsert` | `amika.api.repositories.upsert` | `write` | Creates or updates a repository by repo_url: its setup script, image and environment for new rigs. |
| `rigs.create` | `amika.api.rigs.create` | `write` | Creates a rig: a devbox VM with a repo cloned, dependencies set up and agent credentials injected. Runs on Amika Cloud (billed per second), a connected cloud account, or one of your own hosts (host_id). Answers 202 while it boots; poll rigs.get until status is running and setup_status ok. By default the rig gets a new organization API key as AMIKA_API_KEY (amika_api_key changes that). |
| `rigs.createSshSession` | `amika.api.rigs.createSshSession` | `write` | Opens a direct WebSocket SSH session to a rig and returns its connection details. The rig is named by id or name (see `by`). |
| `rigs.createTerminalTicket` | `amika.api.rigs.createTerminalTicket` | `write` | Mints a single-use ticket for the web terminal of a rig. The rig is named by id or name (see `by`). |
| `rigs.delete` | `amika.api.rigs.delete` | `destructive` | Deletes a rig and its disk. Anything not pushed or snapshotted is lost. The rig is named by id or name (see `by`). |
| `rigs.get` | `amika.api.rigs.get` | `read` | Reads one rig: status, setup status, provider, size, branch, services and timestamps. The rig is named by id or name (see `by`). |
| `rigs.getSlackConversation` | `amika.api.rigs.getSlackConversation` | `read` | Reads the Slack thread a Slack-made rig belongs to. |
| `rigs.getSlackMetadata` | `amika.api.rigs.getSlackMetadata` | `read` | Lists Slack metadata (team, channel, thread) for the organization's Slack-made rigs, keyed by rig. |
| `rigs.list` | `amika.api.rigs.list` | `read` | Lists the organization's rigs (isolated devbox VMs for coding agents) with their status, provider and size. |
| `rigs.listIntegrations` | `amika.api.rigs.listIntegrations` | `read` | Lists the MCP integrations (Sentry, Linear, Pylon) attached to a rig at creation. The rig is named by id or name (see `by`). |
| `rigs.listLifecycleEvents` | `amika.api.rigs.listLifecycleEvents` | `read` | Reads the control-plane event feed of a rig: created, setup steps, started, stopped, errors. The rig is named by id or name (see `by`). |
| `rigs.services.create` | `amika.api.rigs.services.create` | `write` | Exposes a port of a rig as a named service with its own http or https URL (a dev server preview). |
| `rigs.services.createToken` | `amika.api.rigs.services.createToken` | `write` | Mints an access token for a service of a rig that runs on your own host, for calling it from a script. |
| `rigs.services.delete` | `amika.api.rigs.services.delete` | `destructive` | Removes a live service from a rig; its URL stops answering. |
| `rigs.services.list` | `amika.api.rigs.services.list` | `read` | Lists the live services of a rig: name, port and the URL that reaches it. The rig is named by id or name (see `by`). |
| `rigs.services.replace` | `amika.api.rigs.services.replace` | `write` | Replaces a live service on a rig: its name, port and URL scheme. |
| `rigs.sessions.create` | `amika.api.rigs.sessions.create` | `write` | Creates a new, empty agent session on a rig for the named agent (no message is sent). The rig is named by id or name (see `by`). |
| `rigs.sessions.get` | `amika.api.rigs.sessions.get` | `read` | Reads one agent session on a rig by its session id. |
| `rigs.sessions.getLatest` | `amika.api.rigs.sessions.getLatest` | `read` | Reads the most recent agent session on a rig. The rig is named by id or name (see `by`). |
| `rigs.sessions.list` | `amika.api.rigs.sessions.list` | `read` | Lists the agent sessions on one rig. The rig is named by id or name (see `by`). |
| `rigs.sessions.update` | `amika.api.rigs.sessions.update` | `write` | Updates an agent session on a rig: its status or metadata. |
| `rigs.start` | `amika.api.rigs.start` | `write` | Starts a stopped rig; its filesystem is kept. Billing resumes while it runs. The rig is named by id or name (see `by`). |
| `rigs.stop` | `amika.api.rigs.stop` | `write` | Stops a running rig, keeping its filesystem, so it stops billing for compute. The rig is named by id or name (see `by`). |
| `secrets.create` | `amika.api.secrets.create` | `write` | Stores a generic secret in the Amika vault (user or organization scope) for injecting into rigs as an env var. |
| `secrets.delete` | `amika.api.secrets.delete` | `destructive` | Deletes a generic secret from the vault. |
| `secrets.list` | `amika.api.secrets.list` | `read` | Lists the generic secrets the caller can see (names and scopes, never values). |
| `secrets.sshPublicKeys.delete` | `amika.api.secrets.sshPublicKeys.delete` | `destructive` | Deletes one of the caller's SSH public keys. |
| `secrets.sshPublicKeys.list` | `amika.api.secrets.sshPublicKeys.list` | `read` | Lists the caller's SSH public keys. |
| `secrets.sshPublicKeys.upsert` | `amika.api.secrets.sshPublicKeys.upsert` | `write` | Adds or replaces one of the caller's SSH public keys, used for rig SSH and editor access. |
| `secrets.update` | `amika.api.secrets.update` | `write` | Updates a generic secret: its value, name or scope. |
| `serviceDefinitions.create` | `amika.api.serviceDefinitions.create` | `write` | Adds a service definition to a repository: a named set of ports every rig of that repository exposes. |
| `serviceDefinitions.delete` | `amika.api.serviceDefinitions.delete` | `destructive` | Deletes a service definition from a repository. |
| `serviceDefinitions.update` | `amika.api.serviceDefinitions.update` | `write` | Updates a repository's service definition: its name and ports. |
| `services.list` | `amika.api.services.list` | `read` | Lists the live services across the organization's rigs. |
| `slack.channelSettings.delete` | `amika.api.slack.channelSettings.delete` | `destructive` | Deletes one Slack channel's defaults; it falls back to the workspace defaults. |
| `slack.channelSettings.list` | `amika.api.slack.channelSettings.list` | `read` | Lists per-channel Slack defaults and the channels the Amika bot has seen recently. |
| `slack.channelSettings.set` | `amika.api.slack.channelSettings.set` | `write` | Sets the repository, agent and system prompt one Slack channel uses. |
| `slack.settings.get` | `amika.api.slack.settings.get` | `read` | Reads the organization's Slack defaults: repository, agent and system prompt. 404 when not set. |
| `slack.settings.set` | `amika.api.slack.settings.set` | `write` | Sets the organization's Slack defaults: the repository and agent a new Slack thread uses, and an optional system prompt. |
| `snapshots.create` | `amika.api.snapshots.create` | `write` | Starts capturing a snapshot of a running rig (sandbox_ref names it). mode scrub_and_delete (default) removes injected secrets and deletes the source rig; full keeps both. Answers 202; poll snapshots.get for status. |
| `snapshots.delete` | `amika.api.snapshots.delete` | `destructive` | Deletes a snapshot by name (default) or id. Rigs can no longer boot from it. |
| `snapshots.get` | `amika.api.snapshots.get` | `read` | Reads one snapshot by name (default) or id: status, source rig and size. |
| `snapshots.list` | `amika.api.snapshots.list` | `read` | Lists snapshots captured from rigs (reusable base images new rigs can boot from). |
| `snapshots.previewScrub` | `amika.api.snapshots.previewScrub` | `read` | Previews which injected secrets a scrub_and_delete snapshot of a rig would remove. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/amika

## License

Apache-2.0
