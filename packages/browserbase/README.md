# @corsair-dev/browserbase

Cloud browsers for AI agents with Browserbase: create, inspect, label and release sessions (live debug URLs, logs, replays, recordings, uploads, downloads), contexts, extensions, certificates, navigation policies and secrets, Functions (invoke, builds, versions, invocations), agents and agent runs, fetch and web search, projects and usage, and signed webhooks (76 operations).

## Install

```bash
pnpm add @corsair-dev/browserbase
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.create` | `browserbase.api.agents.create` | `write` | Create an Agent. Create a reusable agent. An agent defines a systemPrompt and resultSchema that guide its behavior for every run. Only name is required; an agent created with no systemPrompt behaves like an unconfigured run. |
| `agents.delete` | `browserbase.api.agents.delete` | `destructive` | Delete an Agent. Delete an agent. Runs that already referenced this agent are unaffected. Cannot be undone. |
| `agents.get` | `browserbase.api.agents.get` | `read` | Get an Agent. Retrieve an agent by ID. (GET /v1/agents/{agentId}) |
| `agents.list` | `browserbase.api.agents.list` | `read` | List Agents. List agents across your account. Supports filtering by creation time. |
| `agents.runs.create` | `browserbase.api.agents.runs.create` | `destructive` | Run an Agent. Run a browser agent to complete the task by using web search and browser tooling. Optionally pass agentId to run a custom agent you've created. Starts an agent run that uses browser time and model tokens. |
| `agents.runs.get` | `browserbase.api.agents.runs.get` | `read` | Get a Run. Retrieve the current status and details of a run, including its result and associated session information. To fetch the run's messages, use List Run Messages. |
| `agents.runs.list` | `browserbase.api.agents.runs.list` | `read` | List Runs. List runs across your account. Supports filtering by status, by the agent they reference, and by creation time. |
| `agents.runs.messages` | `browserbase.api.agents.runs.messages` | `read` | List Run Messages. Returns a paginated list of messages produced by a run, in chronological order, with the oldest messages first. Messages conform to the AI SDK UIMessage format. |
| `agents.runs.resume` | `browserbase.api.agents.runs.resume` | `destructive` | Resume a Run. Resume a PAUSED run with additional input. The reply in task is delivered to the agent as the answer to its pause request (the trailing pause tool call in the run's messages), and variables merge over the run's original variables. Resuming a run that is not paused returns a conflict. |
| `agents.runs.stop` | `browserbase.api.agents.runs.stop` | `destructive` | Stop a Run. Request that an in-progress run stop. The run winds down and transitions to STOPPED. Stopping a run that has already finished returns a conflict. |
| `agents.update` | `browserbase.api.agents.update` | `write` | Update an Agent. Update an existing agent. Only the fields provided in the body are modified; omitted fields are left unchanged. |
| `certificates.delete` | `browserbase.api.certificates.delete` | `destructive` | Delete a Certificate. Delete an uploaded certificate from your project by its ID. Session creation requests that still reference this ID in proxySettings.caCertificates fail with HTTP 400. Cannot be undone. |
| `certificates.get` | `browserbase.api.certificates.get` | `read` | Get a Certificate. Retrieve metadata for an uploaded certificate by its ID, including its project ID and timestamps. The PEM content is not returned. |
| `certificates.list` | `browserbase.api.certificates.list` | `read` | List Certificates. List the certificates uploaded to your project. |
| `certificates.upload` | `browserbase.api.certificates.upload` | `write` | Upload a Certificate. Upload a PEM file with one or more CA certificates (up to 100 MB). Pass the returned ID in proxySettings.caCertificates when creating a session so the browser trusts these certificates. |
| `contexts.create` | `browserbase.api.contexts.create` | `write` | Create a Context. (POST /v1/contexts) |
| `contexts.delete` | `browserbase.api.contexts.delete` | `destructive` | Delete a Context. Cannot be undone. (DELETE /v1/contexts/{id}) |
| `contexts.get` | `browserbase.api.contexts.get` | `read` | Get a Context. (GET /v1/contexts/{id}) |
| `downloads.delete` | `browserbase.api.downloads.delete` | `destructive` | Delete a Download. Delete a download file from storage and mark as deleted. Cannot be undone. |
| `downloads.get` | `browserbase.api.downloads.get` | `read` | Get a Download. Get download metadata (Accept: application/json) or file content (Accept: application/octet-stream). |
| `downloads.list` | `browserbase.api.downloads.list` | `read` | List Downloads. List all downloads for a session with optional filtering and pagination. |
| `extensions.delete` | `browserbase.api.extensions.delete` | `destructive` | Delete an Extension. Cannot be undone. (DELETE /v1/extensions/{id}) |
| `extensions.get` | `browserbase.api.extensions.get` | `read` | Get an Extension. (GET /v1/extensions/{id}) |
| `extensions.upload` | `browserbase.api.extensions.upload` | `write` | Upload an Extension. (POST /v1/extensions) |
| `fetch.page` | `browserbase.api.fetch.page` | `read` | Fetch a Page. Fetch a page and return its content, headers, and metadata. A metered read: each call counts against the plan. |
| `functions.builds.get` | `browserbase.api.functions.builds.get` | `read` | Get a Function Build. (GET /v1/functions/builds/{id}) |
| `functions.builds.list` | `browserbase.api.functions.builds.list` | `read` | List Function Builds. (GET /v1/functions/builds) |
| `functions.builds.logs` | `browserbase.api.functions.builds.logs` | `read` | Get Function Build Logs. (GET /v1/functions/builds/{id}/logs) |
| `functions.get` | `browserbase.api.functions.get` | `read` | Get a Function. (GET /v1/functions/{id}) |
| `functions.invocations.get` | `browserbase.api.functions.invocations.get` | `read` | Get an Invocation. (GET /v1/functions/invocations/{id}) |
| `functions.invocations.logs` | `browserbase.api.functions.invocations.logs` | `read` | Get Invocation Logs. (GET /v1/functions/invocations/{id}/logs) |
| `functions.invoke` | `browserbase.api.functions.invoke` | `destructive` | Invoke a Function. Runs the Function on Browserbase compute. |
| `functions.list` | `browserbase.api.functions.list` | `read` | List Functions. (GET /v1/functions) |
| `functions.secrets.attach` | `browserbase.api.functions.secrets.attach` | `write` | Attach a Secret to a Function. Attach a secret to a Function, taking effect on the Function's next invocation. Note: Attaching a secret that is already attached succeeds to support idempotency. |
| `functions.secrets.detach` | `browserbase.api.functions.secrets.detach` | `destructive` | Detach a Secret from a Function. Detach a secret from a Function, taking effect on the Function's next invocation. Note: Detaching a secret that is not attached succeeds to support idempotency. Cannot be undone. |
| `functions.secrets.list` | `browserbase.api.functions.secrets.list` | `read` | List Function Secrets. List secrets attached to a function. Supports filtering by secret creation time. Returns metadata only. |
| `functions.versions.get` | `browserbase.api.functions.versions.get` | `read` | Get a Function Version. (GET /v1/functions/versions/{id}) |
| `functions.versions.invocations` | `browserbase.api.functions.versions.invocations` | `read` | List Invocations for a Function Version. |
| `functions.versions.list` | `browserbase.api.functions.versions.list` | `read` | List Function Versions. (GET /v1/functions/{id}/versions) |
| `labels.create` | `browserbase.api.labels.create` | `write` | Create a Label. Create a project-owned label. |
| `labels.delete` | `browserbase.api.labels.delete` | `destructive` | Delete a Label. Delete a label and its session assignments, preserving the sessions. Missing and other-project labels are successful no-ops. Cannot be undone. |
| `labels.list` | `browserbase.api.labels.list` | `read` | List Labels. List the project's labels, newest first. Page by passing the previous response's nextCursor as cursor; a null nextCursor means there are no further pages. |
| `labels.update` | `browserbase.api.labels.update` | `write` | Update a Label. Rename a label, preserving its ID, creation time, and session assignments. |
| `navigationPolicies.create` | `browserbase.api.navigationPolicies.create` | `write` | Create a Navigation Policy. Create a navigation policy for this project. Omitted fields take the defaults: enabled, block by default, block unknown domains, no category rules, and no overrides. Bind the policy to a session with browserSettings.riskPolicyId. |
| `navigationPolicies.delete` | `browserbase.api.navigationPolicies.delete` | `destructive` | Delete a Navigation Policy. Delete a navigation policy. New sessions can no longer bind to it; running sessions keep the policy they started with. Cannot be undone. |
| `navigationPolicies.get` | `browserbase.api.navigationPolicies.get` | `read` | Get a Navigation Policy. Retrieve a single navigation policy by ID. |
| `navigationPolicies.list` | `browserbase.api.navigationPolicies.list` | `read` | List Navigation Policies. List the project's navigation policies, ordered by name. |
| `navigationPolicies.update` | `browserbase.api.navigationPolicies.update` | `write` | Update a Navigation Policy. Update a navigation policy. Omitted fields keep their values; a supplied list replaces the stored list rather than adding to it. The change applies to sessions that start afterwards; running sessions keep the policy they started with. |
| `projects.get` | `browserbase.api.projects.get` | `read` | Get a Project. (GET /v1/projects/{id}) |
| `projects.list` | `browserbase.api.projects.list` | `read` | List Projects. (GET /v1/projects) |
| `projects.usage` | `browserbase.api.projects.usage` | `read` | Get Project Usage. (GET /v1/projects/{id}/usage) |
| `search.web` | `browserbase.api.search.web` | `read` | Web Search. Perform a web search and return structured results. A metered read: each call counts against the plan. |
| `secrets.create` | `browserbase.api.secrets.create` | `write` | Create a Secret. (POST /v1/secrets) |
| `secrets.delete` | `browserbase.api.secrets.delete` | `destructive` | Delete a Secret. Cannot be undone. (DELETE /v1/secrets/{id}) |
| `secrets.get` | `browserbase.api.secrets.get` | `read` | Get a Secret. (GET /v1/secrets/{id}) |
| `secrets.keypair` | `browserbase.api.secrets.keypair` | `read` | Get a Keypair. (GET /v1/secrets/keypair) |
| `secrets.list` | `browserbase.api.secrets.list` | `read` | List Secrets. List project secrets. Supports filtering by creation time. |
| `secrets.update` | `browserbase.api.secrets.update` | `write` | Update a Secret. Replace a secret's value. The name cannot be changed; to rename, create a new secret and delete the old one. |
| `sessions.create` | `browserbase.api.sessions.create` | `destructive` | Create a Session. Starts a cloud browser that is billed by the minute until it is released or times out. |
| `sessions.debug` | `browserbase.api.sessions.debug` | `read` | Session Live URLs. (GET /v1/sessions/{id}/debug) |
| `sessions.get` | `browserbase.api.sessions.get` | `read` | Get a Session. (GET /v1/sessions/{id}) |
| `sessions.list` | `browserbase.api.sessions.list` | `read` | List Sessions. (GET /v1/sessions) |
| `sessions.logs` | `browserbase.api.sessions.logs` | `read` | Session Logs. (GET /v1/sessions/{id}/logs) |
| `sessions.recordingDownloads.create` | `browserbase.api.sessions.recordingDownloads.create` | `write` | Create Session Recording Downloads. Requests one downloadable MP4 per recorded page of a session. Assembly runs asynchronously and every page returns as PENDING. Re-posting re-enqueues all pages and retries any that failed. Poll the GET endpoint for per-page status and, on standard (non-BYOS) projects, download URLs. |
| `sessions.recordingDownloads.list` | `browserbase.api.sessions.recordingDownloads.list` | `read` | List Session Recording Downloads. Returns the per-page download status for a session, with a short-lived signed URL for each completed page on standard (non-BYOS) projects. |
| `sessions.replays.get` | `browserbase.api.sessions.replays.get` | `read` | Get Session Replay. Returns page metadata for a session replay, including timing information and the URL of each page's HLS playlist. |
| `sessions.replays.page` | `browserbase.api.sessions.replays.page` | `read` | Get Replay Page. Returns an HLS VOD media playlist (.m3u8) for a specific page of a session replay. |
| `sessions.setLabels` | `browserbase.api.sessions.setLabels` | `write` | Set Session Labels. Atomically replace a session's labels. Returns the response after the assignment commits. |
| `sessions.update` | `browserbase.api.sessions.update` | `destructive` | Update a Session. Setting status to REQUEST_RELEASE ends the session. |
| `sessions.uploadFile` | `browserbase.api.sessions.uploadFile` | `write` | Create Session Uploads. (POST /v1/sessions/{id}/uploads) |
| `webhooks.create` | `browserbase.api.webhooks.create` | `write` | Create a Webhook. Register an HTTPS endpoint to receive events for this project. The response includes the signing secret, which is shown only here and when the secret is rotated. Store it before discarding the response. An endpoint may only be registered once per project. The response holds the signing secret; it is shown only here and on rotate. |
| `webhooks.delete` | `browserbase.api.webhooks.delete` | `destructive` | Delete a Webhook. Delete a webhook. Deliveries stop immediately and the signing secret is retired. Events that occurred before the delete are not replayed if the endpoint is registered again. Cannot be undone. |
| `webhooks.get` | `browserbase.api.webhooks.get` | `read` | Get a Webhook. Retrieve a single webhook by ID. The signing secret is not included; it is only ever returned on create and rotate. |
| `webhooks.list` | `browserbase.api.webhooks.list` | `read` | List Webhooks. List the project's webhooks, newest first. Signing secrets are not included. Page by passing the previous response's nextCursor as cursor; a null nextCursor means there are no further pages. |
| `webhooks.rotateSecret` | `browserbase.api.webhooks.rotateSecret` | `destructive` | Rotate a Webhook signing secret. Issue a new signing secret for a webhook. By default the previous secret keeps verifying for 24 hours so a receiver can be updated without dropping deliveries; pass revokeImmediately to end that window at once. The new secret is returned only here. |
| `webhooks.update` | `browserbase.api.webhooks.update` | `write` | Update a Webhook. Update a webhook's endpoint URL, its subscribed event types, or both. Omitted fields are left unchanged. eventTypes replaces the existing subscription rather than adding to it. The signing secret is unaffected. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 7 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/browserbase

## License

Apache-2.0
