# @corsair-dev/steel

Cloud browsers for AI agents with Steel: start, inspect and release browser sessions (live view, events, logs, cost, context), run commands and computer actions, scrape, screenshot or PDF a page, manage profiles, credentials, vaults, secret connections, extensions, files and projects (71 operations).

## Install

```bash
pnpm add @corsair-dev/steel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.create` | `steel.api.apiKeys.create` | `destructive` | Create an API key. Create a project-scoped API key using a global (organization-scoped) API key. Supply projectId for an active project in the authenticated organization; scopeType must be project or omitted. Project-scoped API keys cannot create keys, and global keys cannot create other global keys. Mints a new API key. |
| `auth.jwks` | `steel.api.auth.jwks` | `read` | Get Public Keys (JWKS). Provides the JSON Web Key Set (JWKS) for verifying JWTs issued by this service. |
| `credentials.create` | `steel.api.credentials.create` | `write` | Stores credentials. Encrypts and stores credentials for an origin. |
| `credentials.delete` | `steel.api.credentials.delete` | `destructive` | Deletes credentials. Deletes encrypted credentials from the database. Cannot be undone. |
| `credentials.list` | `steel.api.credentials.list` | `read` | List all credential metadata. Fetches all credential metadata for the current organization. |
| `credentials.update` | `steel.api.credentials.update` | `write` | Updates credentials. Encrypts and updates credentials for an origin. |
| `extensions.delete` | `steel.api.extensions.delete` | `destructive` | Delete extension. Delete an extension by ID. Cannot be undone. |
| `extensions.deleteAll` | `steel.api.extensions.deleteAll` | `destructive` | Delete all extensions. Delete all extensions for the organization. Cannot be undone. |
| `extensions.download` | `steel.api.extensions.download` | `read` | Download extension. Download an extension file by extension ID. |
| `extensions.list` | `steel.api.extensions.list` | `read` | List extensions. List all extensions for the organization. |
| `extensions.update` | `steel.api.extensions.update` | `write` | Update extension. Update a Chrome extension (.zip/.crx file or Chrome Web Store URL) for the organization. |
| `extensions.upload` | `steel.api.extensions.upload` | `write` | Upload extension. Upload a Chrome extension (.zip/.crx file or Chrome Web Store URL) for the organization. |
| `files.delete` | `steel.api.files.delete` | `destructive` | Delete a global file. Delete a file from global storage. Cannot be undone. |
| `files.download` | `steel.api.files.download` | `read` | Download a global file. Download a file from global storage. |
| `files.list` | `steel.api.files.list` | `read` | List global files. List all global files for the organization in descending order. |
| `files.upload` | `steel.api.files.upload` | `write` | Upload a global file. Uploads a file to global storage via multipart/form-data with a file field that accepts either binary data or a URL string to download from, and an optional path field for the file storage path. |
| `profiles.create` | `steel.api.profiles.create` | `write` | Create a profile. Create a new profile. (POST /v1/profiles) |
| `profiles.delete` | `steel.api.profiles.delete` | `destructive` | Delete a profile. Delete the profile and its stored browser data immediately, with a final asynchronous cleanup pass. Cannot be undone. |
| `profiles.get` | `steel.api.profiles.get` | `read` | Get a profile. Retrieve a profile by ID. |
| `profiles.list` | `steel.api.profiles.list` | `read` | List all profiles. Retrieve a list of all profiles. |
| `profiles.update` | `steel.api.profiles.update` | `write` | Update a profile. Update an existing profile. |
| `projects.get` | `steel.api.projects.get` | `read` | Get project. Get a project by ID. (GET /v1/projects/{id}) |
| `projects.list` | `steel.api.projects.list` | `read` | List projects. List projects for the authenticated organization. |
| `secretConnections.create` | `steel.api.secretConnections.create` | `write` | Create a secret connection. (POST /v1/secret-connections) |
| `secretConnections.delete` | `steel.api.secretConnections.delete` | `destructive` | Delete a secret connection. Cannot be undone. |
| `secretConnections.get` | `steel.api.secretConnections.get` | `read` | Get a secret connection. (GET /v1/secret-connections/{id}) |
| `secretConnections.list` | `steel.api.secretConnections.list` | `read` | List secret connections. (GET /v1/secret-connections) |
| `secretConnections.test` | `steel.api.secretConnections.test` | `write` | Test a secret connection. (POST /v1/secret-connections/{id}/test) |
| `secretConnections.update` | `steel.api.secretConnections.update` | `write` | Update a secret connection. (PATCH /v1/secret-connections/{id}) |
| `sessions.agentLogs` | `steel.api.sessions.agentLogs` | `read` | Get session agent logs. Query raw CDP-derived agent events (Input.dispatchMouseEvent, Input.dispatchKeyEvent, Page.navigate, …) for a session. For the semantic, replay-oriented interaction timeline use /sessions/:id/agent-traces instead. |
| `sessions.agentTraces` | `steel.api.sessions.agentTraces` | `read` | Get session agent traces. Query the semantic agent trace timeline for a session: a coalesced, replay-oriented record of user/agent interactions (clicks, typing, scrolls, drags, navigations) with target metadata (role, accessible name, selectors). Returns an empty list for sessions that predate browser-interaction capture. |
| `sessions.captchas.solve` | `steel.api.sessions.captchas.solve` | `destructive` | Solve captcha(s). Solves captcha(s) for the session. If pageId, url, or taskId is provided, solves that specific captcha. If no parameters are provided, solves all detected captchas. Use this when autoCaptchaSolving is disabled in stealthConfig. Uses paid CAPTCHA solving (needs a verified account). |
| `sessions.captchas.solveImage` | `steel.api.sessions.captchas.solveImage` | `destructive` | Solve image captcha. Solves an image captcha using XPath selectors. Uses paid CAPTCHA solving (needs a verified account). |
| `sessions.captchas.status` | `steel.api.sessions.captchas.status` | `read` | Get captcha status. Gets the current captcha status for a session. |
| `sessions.commands.cancelExecution` | `steel.api.sessions.commands.cancelExecution` | `write` | Cancel a command execution. Stops an execution. The running command stops before its next input, and commands that already ran are not undone. |
| `sessions.commands.getExecution` | `steel.api.sessions.commands.getExecution` | `read` | Get a command execution. Waits up to 20 seconds for an execution to finish and returns it. Use it when a run answered with state running. |
| `sessions.commands.run` | `steel.api.sessions.commands.run` | `write` | Run commands. Drives the session's browser with high-level commands such as snapshot, click, and fill. Commands run in order and stop at the first failure. Send a random Idempotency-Key header to make retries safe. |
| `sessions.computer` | `steel.api.sessions.computer` | `write` | Execute computer action. Execute computer actions like mouse movements, clicks, keyboard input, and more. |
| `sessions.context` | `steel.api.sessions.context` | `read` | Get session context. Fetches the context data of a specific session. |
| `sessions.cost` | `steel.api.sessions.cost` | `read` | Get session cost. Returns the finalized cost of a released session as an exact amount in US dollars (e.g. 0.031905), suitable for precise billing passthrough. |
| `sessions.create` | `steel.api.sessions.create` | `destructive` | Create a session. Creates a new session with the provided configuration. Starts a cloud browser that is billed by the minute until it is released or times out. |
| `sessions.credentials.attach` | `steel.api.sessions.credentials.attach` | `write` | Attach session credentials. Attach credentialIds and/or Vault or item references in bindings. Each array accepts at most 100 entries; at most 100 distinct direct items and whole Vaults may be bound. Only credentials can be autofilled. Lookup becomes explicit and remains so. |
| `sessions.credentials.detach` | `steel.api.sessions.credentials.detach` | `destructive` | Detach a session credential. Unbind a credential from a running session. The lookup stays explicit: with nothing bound, the session fills nothing. Errors: 404 credential_not_attached, 409 session_not_running, 503 credential_bindings_busy (retryable). Cannot be undone. |
| `sessions.credentials.detachVault` | `steel.api.sessions.credentials.detachVault` | `destructive` | Detach a session Vault binding. Pass reference as a query parameter to detach one Vault or item binding, including steel://connections/<connection>/vaults/<vault>[/<item>]. Does not detach items covered by a whole Vault binding. Cannot be undone. |
| `sessions.credentials.list` | `steel.api.sessions.credentials.list` | `read` | List session credentials. The session's credential lookup and the live credentials bound to it (no values). Subject to session organization and project access. |
| `sessions.credentials.replace` | `steel.api.sessions.credentials.replace` | `write` | Replace session credentials. Replace all direct item and Vault bindings, including provider references steel://connections/<connection>/vaults/<vault>[/<item>]. Supply credentialIds and/or bindings; empty arrays detach all. At most 100 distinct bindings may be stored. Only credentials can be autofilled. |
| `sessions.events` | `steel.api.sessions.events` | `read` | Get recorded events. This endpoint allows you to get the recorded session events in the RRWeb format. Returns { events, nextCursor }: one page of the recording. limit (1 to 1000) counts the event batches Steel stored, so a page can hold more events than limit. Steel sends the next page token in a Next-Cursor response header; pass nextCursor as pointer to read the next page, until nextCursor is null. |
| `sessions.files.delete` | `steel.api.sessions.files.delete` | `destructive` | Delete a file. Delete a file from a session. Cannot be undone. |
| `sessions.files.deleteAll` | `steel.api.sessions.files.deleteAll` | `destructive` | Delete all files. Delete all files from a session. Cannot be undone. |
| `sessions.files.download` | `steel.api.sessions.files.download` | `read` | Download a file. Download a file from a session. |
| `sessions.files.downloadArchive` | `steel.api.sessions.files.downloadArchive` | `read` | Download archive. Download all files from the session as a zip archive. |
| `sessions.files.list` | `steel.api.sessions.files.list` | `read` | List files. List all files from the session in descending order. |
| `sessions.files.upload` | `steel.api.sessions.files.upload` | `write` | Upload a file. Uploads a file to a session via multipart/form-data with a file field that accepts either binary data or a URL string to download from, and an optional path field for the file storage path. |
| `sessions.get` | `steel.api.sessions.get` | `read` | Get session details. Retrieves details of a specific session by ID. |
| `sessions.hlsPlaylist` | `steel.api.sessions.hlsPlaylist` | `read` | Get HLS playlist. Get HLS playlist for a session recording using app auth or an RTC token. |
| `sessions.list` | `steel.api.sessions.list` | `read` | List all sessions. Fetches all active sessions for the current organization. |
| `sessions.liveDetails` | `steel.api.sessions.liveDetails` | `read` | Get live session details. Returns the live state of the session, including pages, tabs, and browser state. |
| `sessions.logs` | `steel.api.sessions.logs` | `read` | Get session logs. Query browser event logs for a session. |
| `sessions.metadata.replace` | `steel.api.sessions.metadata.replace` | `write` | Replace session metadata. Atomically replace customer metadata. Send an empty object to clear it. Last accepted write wins; use PATCH to change individual keys. Subject to session organization and project access. |
| `sessions.metadata.update` | `steel.api.sessions.metadata.update` | `write` | Update session metadata. Atomically merge keys into customer metadata. Set a key to null to remove it; keys you leave out are kept, so concurrent updates to different keys are all kept. Returns the merged metadata, which must stay within the metadata limits. Subject to session organization and project access. |
| `sessions.release` | `steel.api.sessions.release` | `destructive` | Release a session. Releases a specific session by ID. Ends the session; its browser cannot be resumed. |
| `sessions.releaseAll` | `steel.api.sessions.releaseAll` | `destructive` | Release all sessions. Releases all active sessions for the current organization. Ends every live session in the project given by projectId; without it, every session the key reaches (all projects for an organization key). |
| `sessions.signalCatalog` | `steel.api.sessions.signalCatalog` | `read` | List public session signal definitions. Returns current signal labels and meanings for customer integrations. Uses normal Steel API-key authentication. Includes no session data or administrative signals. Definitions do not establish that detection ran for a particular session. |
| `tools.pdf` | `steel.api.tools.pdf` | `read` | Convert webpage to PDF. Generates a PDF from a specified webpage. Runs a short browser session and spends wallet credit like one. |
| `tools.scrape` | `steel.api.tools.scrape` | `read` | Scrape webpage content. Extracts content from a specified URL. Runs a short browser session and spends wallet credit like one. |
| `tools.screenshot` | `steel.api.tools.screenshot` | `read` | Capture webpage screenshot. Captures a screenshot of a specified webpage. Runs a short browser session and spends wallet credit like one. |
| `vaults.create` | `steel.api.vaults.create` | `write` | Create a Vault. (POST /v1/vaults) |
| `vaults.delete` | `steel.api.vaults.delete` | `destructive` | Delete an empty Vault. Soft-delete a Vault. Returns 409 while it contains any live Secrets or credentials; move or delete them first. Cannot be undone. |
| `vaults.get` | `steel.api.vaults.get` | `read` | Get a Vault. (GET /v1/vaults/{id}) |
| `vaults.list` | `steel.api.vaults.list` | `read` | List Vaults. (GET /v1/vaults) |
| `vaults.update` | `steel.api.vaults.update` | `write` | Update a Vault. (PATCH /v1/vaults/{id}) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/steel

## License

Apache-2.0
