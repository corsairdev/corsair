# @corsair-dev/kernel

Kernel plugin for Corsair: cloud browsers for agents.

## Install

```bash
pnpm add @corsair-dev/kernel
```

## Options

- `authType`: `api_key` (your own Kernel key) or `managed_pricing` (Corsair
  Hub supplies the key and charges credits).
- `projectId`: a Kernel project id (`proj_…`). Every call carries it as
  `X-Kernel-Project-Id`, so an org-wide key only sees and creates browsers,
  profiles and logins inside that project. Leave it out for the org's default
  project, or when the key is already scoped to one project.

## How it is built

The 200 operations come from Kernel's published OpenAPI spec
(https://api.onkernel.com/openapi.json, fetched 2026-11-20), named after
Kernel's Node SDK (`@onkernel/sdk` 0.153.0) so its docs translate one to one,
with `retrieve` written `get` and `deleteByID` written `delete`:

- `kernel-manifest.json` holds each operation's route, a flat input schema
  (path, query, header and body fields in one object) and its response schema.
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated from
  the same spec: input and output types, the endpoint tree, risk levels and
  descriptions written for an agent driving a browser.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/openapi-schema.ts`).

Inputs keep the published contract (required fields, enums, limits) and pass
unknown body keys through, so a field Kernel adds still reaches it; an
operation without a body rejects unknown keys. Responses keep the documented
types, but every field may be missing or `null`, and unknown fields pass
through.

- **Files.** Screenshots, file reads, directory zips, replays, profile and
  extension archives and audit-log chunks come back as a Files output
  (`contentBase64` or `text`, or a `fileId` on Corsair). Uploads (`fs.upload`,
  `fs.uploadZip`, `fs.writeFile`, `loadExtensions`, `extensions.upload`,
  `deployments.create`) take a file as a public URL, `{ url }`, `{ base64 }` or
  a Blob.
- **Paging.** Kernel pages lists through response headers, so list operations
  return `{ items, has_more, next_offset }` (`next_page_token` for the audit
  log, `next_cursor` for audit-log export chunks).
- **Timeouts.** Calls with their own deadline (`playwright.execute`, `repl`,
  `process.exec`, `curl`, `search`, `browserPools.acquire`) wait for it plus 30
  s; browser starts, deletes, file transfers and managed-auth logins wait up
  to 2 minutes; everything else 30 s.
- **The y coordinate.** The published spec names every `y` field `"true"`
  (its YAML was read as YAML 1.1, where a bare `y` is a boolean). The manifest
  renames it back to `y`, which the API and SDK use.
- **Extension uploads.** The browser reads `browsers.loadExtensions` as
  `extensions.name` / `extensions.zip_file` pairs; every other form uses the
  SDK's `files[0][file]` style.

Left out on purpose:

- The seven server-sent event streams (browser logs, process stdout, telemetry,
  fs watch, deployment, invocation and managed-auth events). The transport
  returns one response, so a stream would hang until it times out. Poll
  instead: `browsers.process.exec` or `browsers.process.status`,
  `browsers.telemetry.events`, `browsers.fs.listFiles`, `deployments.get`,
  `invocations.get`, `auth.connections.get` or `auth.connections.timeline`.
- `POST /mpp/browsers`: a browser bought with a Machine Payments Protocol
  payment, not an API key.
- `/vault/card-captures/current` and `/vault/card-ingest/{payment_method_id}`:
  a browser-side card capture protocol authorized by a capture token, and a
  route a card issuer posts to through the card vault, never to the API host.
- The seven `/projects` routes the spec marks deprecated (removed 2026-11-24);
  `projects.*` uses `/org/projects`.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.create` | `kernel.api.apiKeys.create` | `destructive` | Create a Kernel API key. The secret is shown once in the response: store it right away and never paste it into chat. |
| `apiKeys.delete` | `kernel.api.apiKeys.delete` | `destructive` | Delete an API key; anything using it stops working. Cannot be undone. |
| `apiKeys.get` | `kernel.api.apiKeys.get` | `read` | Get an API key's metadata. |
| `apiKeys.list` | `kernel.api.apiKeys.list` | `read` | List API keys (names, scopes, last used; never the secrets). |
| `apiKeys.rotate` | `kernel.api.apiKeys.rotate` | `destructive` | Replace an API key's secret; the old secret stops working. The new one is shown once. |
| `apiKeys.update` | `kernel.api.apiKeys.update` | `write` | Rename an API key or change its settings. |
| `apps.list` | `kernel.api.apps.list` | `read` | List deployed Kernel apps and their versions and actions. |
| `auditLogs.exportChunk` | `kernel.api.auditLogs.exportChunk` | `read` | Download one chunk of the audit log as JSONL (gzipped by default). Returns a file plus has_more and next_cursor for the next chunk. |
| `auditLogs.exportDestinations.create` | `kernel.api.auditLogs.exportDestinations.create` | `write` | Add a destination (such as an S3 bucket) that receives continuous audit log exports. |
| `auditLogs.exportDestinations.delete` | `kernel.api.auditLogs.exportDestinations.delete` | `destructive` | Delete an audit log export destination. Cannot be undone. |
| `auditLogs.exportDestinations.get` | `kernel.api.auditLogs.exportDestinations.get` | `read` | Get an audit log export destination. |
| `auditLogs.exportDestinations.list` | `kernel.api.auditLogs.exportDestinations.list` | `read` | List audit log export destinations. |
| `auditLogs.exportDestinations.test` | `kernel.api.auditLogs.exportDestinations.test` | `write` | Send a test export to an audit log destination to check it works. |
| `auditLogs.exportDestinations.update` | `kernel.api.auditLogs.exportDestinations.update` | `write` | Update an audit log export destination. |
| `auditLogs.list` | `kernel.api.auditLogs.list` | `read` | Search the org's audit log (who called what, when), newest first. Pages with page_token; check has_more. |
| `auth.connections.create` | `kernel.api.auth.connections.create` | `write` | Set up managed login for a site: one connection per profile and domain (the profile is created if missing). Then start a login with auth.connections.login. |
| `auth.connections.delete` | `kernel.api.auth.connections.delete` | `destructive` | Delete a managed auth connection and stop its health checks and logins. Cannot be undone; the profile stays. |
| `auth.connections.exchange` | `kernel.api.auth.connections.exchange` | `write` | Exchange a login handoff code for a short-lived token, as Kernel's hosted login page does. |
| `auth.connections.get` | `kernel.api.auth.connections.get` | `read` | Get a managed auth connection and its current login flow: status, step, the fields it is waiting for, and hosted_url or live_view_url for a person to finish it. Poll this while a login runs. |
| `auth.connections.list` | `kernel.api.auth.connections.list` | `read` | List managed auth connections (site logins Kernel keeps signed in), filtered by profile or domain. |
| `auth.connections.login` | `kernel.api.auth.connections.login` | `write` | Start a login for a managed auth connection. Returns hosted_url (and live_view_url) for a person to complete it, or logs in by itself when credentials are stored. Then poll auth.connections.get, and send asked-for fields with auth.connections.submit. |
| `auth.connections.submit` | `kernel.api.auth.connections.submit` | `write` | Send the values a running login asks for (a username, password, one-time code, or a choice) to a managed auth connection. Poll auth.connections.get for the result. |
| `auth.connections.timeline` | `kernel.api.auth.connections.timeline` | `read` | List a managed auth connection's history (logins, re-auths, health checks), newest first. |
| `auth.connections.update` | `kernel.api.auth.connections.update` | `write` | Change a managed auth connection's settings: health checks, auto re-auth, credential, proxy, login URL. |
| `auth.context.get` | `kernel.api.auth.context.get` | `read` | Show who the API key is: its organization, project and scopes. |
| `browserPools.acquire` | `kernel.api.browserPools.acquire` | `write` | Take a ready browser from a pool (waits up to acquire_timeout_seconds). Returns null when none freed up in time; call again. Give it back with browserPools.release. |
| `browserPools.create` | `kernel.api.browserPools.create` | `write` | Create a pool of pre-started browsers with one configuration, for instant browserPools.acquire. Idle pool browsers are not billed but count toward the concurrency limit. |
| `browserPools.delete` | `kernel.api.browserPools.delete` | `destructive` | Delete a browser pool and its browsers. Cannot be undone. |
| `browserPools.flush` | `kernel.api.browserPools.flush` | `write` | Delete a pool's idle browsers so it refills with fresh ones. |
| `browserPools.get` | `kernel.api.browserPools.get` | `read` | Get a browser pool: configuration, size, and how many browsers are available or leased. |
| `browserPools.list` | `kernel.api.browserPools.list` | `read` | List browser pools and their sizes. |
| `browserPools.release` | `kernel.api.browserPools.release` | `write` | Return an acquired browser to its pool (optionally reusing it rather than replacing it). |
| `browserPools.update` | `kernel.api.browserPools.update` | `write` | Change a browser pool's size or browser configuration. |
| `browsers.computer.batch` | `kernel.api.browsers.computer.batch` | `write` | Run a list of computer actions (click_mouse, type_text, press_key, scroll, move_mouse, drag_mouse, sleep and more) in order in one call; stops at the first error. Faster than one call per action. |
| `browsers.computer.captureScreenshot` | `kernel.api.browsers.computer.captureScreenshot` | `read` | Take a PNG screenshot of the browser screen (optionally a region). Returns a file: on Corsair it is saved to Files and comes back with a fileId. |
| `browsers.computer.clickMouse` | `kernel.api.browsers.computer.clickMouse` | `write` | Click at screen coordinates x, y (left, right or middle button; num_clicks for double-click). |
| `browsers.computer.dragMouse` | `kernel.api.browsers.computer.dragMouse` | `write` | Press the mouse, drag it along a path of [x, y] points, and release. |
| `browsers.computer.getMousePosition` | `kernel.api.browsers.computer.getMousePosition` | `read` | Get the mouse cursor's current screen coordinates. |
| `browsers.computer.moveMouse` | `kernel.api.browsers.computer.moveMouse` | `write` | Move the mouse cursor to screen coordinates x, y (hover). |
| `browsers.computer.pressKey` | `kernel.api.browsers.computer.pressKey` | `write` | Press keys or a combination on the browser's keyboard, e.g. ["Return"] or ["Ctrl+a"] (X keysym names). |
| `browsers.computer.readClipboard` | `kernel.api.browsers.computer.readClipboard` | `read` | Read the text on the browser VM's clipboard. |
| `browsers.computer.scroll` | `kernel.api.browsers.computer.scroll` | `write` | Scroll the mouse wheel by delta_x/delta_y at screen coordinates x, y. |
| `browsers.computer.setCursorVisibility` | `kernel.api.browsers.computer.setCursorVisibility` | `write` | Show or hide the mouse cursor in screenshots and live view. |
| `browsers.computer.typeText` | `kernel.api.browsers.computer.typeText` | `write` | Type text into the focused field, as keystrokes (optional delay between keys). |
| `browsers.computer.writeClipboard` | `kernel.api.browsers.computer.writeClipboard` | `write` | Put text on the browser VM's clipboard. |
| `browsers.create` | `kernel.api.browsers.create` | `write` | Start a cloud Chromium browser and get its session_id, cdp_ws_url and browser_live_view_url. Use headless: true unless a person must watch or take over: headless costs about 8x less ($0.06/h vs $0.48/h) and has no live view. stealth: true (or captcha_solver + proxy) helps on bot-protected sites. Pass profile {name, save_changes: true} to start signed in and keep new cookies; the profile is saved when the browser is deleted. start_url opens a page. A browser bills per second while it is active (a CDP, live view or computer-control connection), drops to unbilled standby after about 10 s idle, and is deleted after timeout_seconds of standby (default 60). It holds one of the org's concurrent-browser slots until deleted, so call browsers.delete when done. |
| `browsers.curl` | `kernel.api.browsers.curl` | `write` | Send an HTTP request from inside the browser (its cookies, proxy and network fingerprint) and get status, headers and body back. Handy for an API call that needs the signed-in session. |
| `browsers.delete` | `kernel.api.browsers.delete` | `write` | End a browser session now and stop its billing; frees its concurrency slot. If it was started with profile save_changes: true, the cookies and storage are saved to the profile first. Cannot be undone: the session, its tabs and its files are gone. |
| `browsers.fs.createDirectory` | `kernel.api.browsers.fs.createDirectory` | `write` | Create a directory (and its parents) in the browser VM. |
| `browsers.fs.deleteDirectory` | `kernel.api.browsers.fs.deleteDirectory` | `destructive` | Delete a directory and everything in it from the browser VM. |
| `browsers.fs.deleteFile` | `kernel.api.browsers.fs.deleteFile` | `destructive` | Delete a file from the browser VM. |
| `browsers.fs.downloadDirZip` | `kernel.api.browsers.fs.downloadDirZip` | `read` | Download a directory from the browser VM as a zip. Returns a file: on Corsair it is saved to Files and comes back with a fileId. |
| `browsers.fs.fileInfo` | `kernel.api.browsers.fs.fileInfo` | `read` | Get a file's or directory's size, mode and modified time in the browser VM. |
| `browsers.fs.listFiles` | `kernel.api.browsers.fs.listFiles` | `read` | List the files and folders in a directory of the browser VM, with sizes and times. |
| `browsers.fs.move` | `kernel.api.browsers.fs.move` | `write` | Move or rename a file or directory in the browser VM. |
| `browsers.fs.readFile` | `kernel.api.browsers.fs.readFile` | `read` | Read a file from the browser VM (for example a download in /tmp/downloads). Returns a file: on Corsair it is saved to Files and comes back with a fileId. |
| `browsers.fs.setFilePermissions` | `kernel.api.browsers.fs.setFilePermissions` | `write` | Change a file's mode or owner in the browser VM. |
| `browsers.fs.upload` | `kernel.api.browsers.fs.upload` | `write` | Upload one or more files into the browser VM, each {file, dest_path}; a file is a public URL, {url} or {base64}. |
| `browsers.fs.uploadZip` | `kernel.api.browsers.fs.uploadZip` | `write` | Upload a zip archive and unpack it into dest_path in the browser VM. |
| `browsers.fs.watch.start` | `kernel.api.browsers.fs.watch.start` | `write` | Start watching a directory in the browser VM for changes; returns a watch_id. Kernel streams the events (not available here), so poll browsers.fs.listFiles instead when you can. |
| `browsers.fs.watch.stop` | `kernel.api.browsers.fs.watch.stop` | `write` | Stop a directory watch by its watch_id. |
| `browsers.fs.writeFile` | `kernel.api.browsers.fs.writeFile` | `write` | Write a file into the browser VM at path (creates or replaces it). Pass the contents as a URL or {base64}. |
| `browsers.get` | `kernel.api.browsers.get` | `read` | Get a browser session: status, URLs (cdp_ws_url, browser_live_view_url), profile, proxy, timeout and usage cost so far. |
| `browsers.list` | `kernel.api.browsers.list` | `read` | List browser sessions in the project, newest first; filter by status (active, deleted, all), tags or name query. Pages with offset/limit; check has_more. |
| `browsers.liveView.create` | `kernel.api.browsers.liveView.create` | `write` | Make a live view link for a headful browser so a person can watch (scope read) or take over (scope control): log in, solve a captcha, approve a step. The link lasts until the browser is deleted or ttl_seconds passes and cannot be revoked, so treat it as a credential and share it only with the person who needs it. Headless browsers have no live view. |
| `browsers.loadExtensions` | `kernel.api.browsers.loadExtensions` | `write` | Load unpacked Chrome extensions (each a zip, as a URL or base64) into a running browser. |
| `browsers.playwright.execute` | `kernel.api.browsers.playwright.execute` | `write` | The simplest way to act on a page: run Playwright code in the browser's VM in one call and get its return value as result (plus stdout/stderr and error). The code gets page, context, browser and webmcp, e.g. `await page.goto('https://example.com'); return await page.title();`. timeout_sec defaults to 60 (max 300). Calls with the same executor name run one at a time in a shared process; pass idempotency_key to make a retry safe. |
| `browsers.playwright.executors.delete` | `kernel.api.browsers.playwright.executors.delete` | `destructive` | Stop and remove a named Playwright executor on a browser; a later call with that name starts a fresh one. |
| `browsers.playwright.executors.list` | `kernel.api.browsers.playwright.executors.list` | `read` | List the Playwright executors (worker processes) on a browser and whether each is busy. |
| `browsers.process.exec` | `kernel.api.browsers.process.exec` | `write` | Run a shell command in the browser VM and wait for it: returns exit code, stdout and stderr (base64). Set timeout_sec for long commands. |
| `browsers.process.kill` | `kernel.api.browsers.process.kill` | `write` | Send a signal (TERM by default, or KILL, INT, HUP) to a spawned process. |
| `browsers.process.resize` | `kernel.api.browsers.process.resize` | `write` | Resize the terminal of a process spawned with allocate_tty. |
| `browsers.process.spawn` | `kernel.api.browsers.process.spawn` | `write` | Start a command in the browser VM without waiting; returns a process_id for browsers.process.status, stdin and kill. |
| `browsers.process.status` | `kernel.api.browsers.process.status` | `read` | Get a spawned process's state, exit code and resource use. |
| `browsers.process.stdin` | `kernel.api.browsers.process.stdin` | `write` | Write data (base64) to a spawned process's stdin. |
| `browsers.repl` | `kernel.api.browsers.repl` | `write` | Run JavaScript in a persistent Node.js REPL inside the browser VM; variables persist between calls (reset: true starts fresh). Start with repl.help(). Output comes from repl.write, console or repl.emitImage. |
| `browsers.replays.download` | `kernel.api.browsers.replays.download` | `read` | Download a replay recording as MP4. Returns a file: on Corsair it is saved to Files and comes back with a fileId. Errors with "still preparing" for a few seconds after the recording stops. |
| `browsers.replays.list` | `kernel.api.browsers.replays.list` | `read` | List a browser's replay recordings with their ids and view URLs. |
| `browsers.replays.start` | `kernel.api.browsers.replays.start` | `write` | Start recording the browser screen as a video replay (headful browsers); returns a replay_id. |
| `browsers.replays.stop` | `kernel.api.browsers.replays.stop` | `write` | Stop a replay recording; download it with browsers.replays.download once it is processed. |
| `browsers.saveProfile` | `kernel.api.browsers.saveProfile` | `write` | Save the running browser's cookies and storage to a profile now, without ending the session: by id (overwrite) or by name (overwrite or create). |
| `browsers.telemetry.events` | `kernel.api.browsers.telemetry.events` | `read` | Read a page of telemetry events for a browser (console, network, page, interaction, captcha and more), filtered by category, type and time. Pages with offset; check has_more. |
| `browsers.update` | `kernel.api.browsers.update` | `write` | Change a running browser: rename it, change its proxy, viewport or tags, or attach a profile it was started without. |
| `browsers.webmcp.customTools.add` | `kernel.api.browsers.webmcp.customTools.add` | `write` | Register custom WebMCP tools (JavaScript run in a page) on a browser's tabs. |
| `browsers.webmcp.customTools.list` | `kernel.api.browsers.webmcp.customTools.list` | `read` | List the custom WebMCP tools registered on a browser. |
| `browsers.webmcp.customTools.remove` | `kernel.api.browsers.webmcp.customTools.remove` | `destructive` | Remove a custom WebMCP tool from a browser by its id. |
| `browsers.webmcp.invokeTool` | `kernel.api.browsers.webmcp.invokeTool` | `write` | Call a WebMCP tool a page exposes, by the tool_ref from browsers.webmcp.listTools, with its input. |
| `browsers.webmcp.listTools` | `kernel.api.browsers.webmcp.listTools` | `read` | List the WebMCP tools that open pages expose (native and custom), each with a tool_ref to call it with browsers.webmcp.invokeTool. Tools vanish when their page navigates away. |
| `configRegistry.analyses.cancel` | `kernel.api.configRegistry.analyses.cancel` | `write` | Cancel a running config analysis. |
| `configRegistry.analyses.get` | `kernel.api.configRegistry.analyses.get` | `read` | Get a config analysis and its result. |
| `configRegistry.analyses.list` | `kernel.api.configRegistry.analyses.list` | `read` | List config analyses. |
| `configRegistry.list` | `kernel.api.configRegistry.list` | `read` | List known site configurations. |
| `configRegistry.lookup` | `kernel.api.configRegistry.lookup` | `read` | Look up Kernel's recommended browser and proxy settings for a bot-protected site (no side effects). |
| `configRegistry.resolve` | `kernel.api.configRegistry.resolve` | `write` | Ask Kernel to analyse a site and work out the browser and proxy settings that get through its bot protection; poll configRegistry.analyses.get. |
| `credentialProviders.create` | `kernel.api.credentialProviders.create` | `write` | Connect an external credential provider (such as 1Password) so managed auth can read logins from it. |
| `credentialProviders.delete` | `kernel.api.credentialProviders.delete` | `destructive` | Disconnect and delete a credential provider. Cannot be undone. |
| `credentialProviders.get` | `kernel.api.credentialProviders.get` | `read` | Get a credential provider. |
| `credentialProviders.list` | `kernel.api.credentialProviders.list` | `read` | List connected credential providers (such as 1Password). |
| `credentialProviders.listItems` | `kernel.api.credentialProviders.listItems` | `read` | List the logins a credential provider makes available (no secret values). |
| `credentialProviders.test` | `kernel.api.credentialProviders.test` | `read` | Check that a credential provider's connection works. |
| `credentialProviders.update` | `kernel.api.credentialProviders.update` | `write` | Change a credential provider's settings or token. |
| `credentials.create` | `kernel.api.credentials.create` | `write` | Store login values (username, password, TOTP secret) for a domain so managed auth can sign in by itself. Values are write-only. |
| `credentials.delete` | `kernel.api.credentials.delete` | `destructive` | Delete a stored credential. Cannot be undone. |
| `credentials.get` | `kernel.api.credentials.get` | `read` | Get a stored credential's metadata (values are never returned). |
| `credentials.list` | `kernel.api.credentials.list` | `read` | List stored credentials (names and domains; values are never returned). |
| `credentials.totpCode` | `kernel.api.credentials.totpCode` | `read` | Get the current one-time code for a credential that has a TOTP secret, and when it expires. |
| `credentials.update` | `kernel.api.credentials.update` | `write` | Change a stored credential's values or settings. |
| `deployments.create` | `kernel.api.deployments.create` | `write` | Deploy a Kernel app from a zip (URL or base64) with its entrypoint, or from a source repository. |
| `deployments.delete` | `kernel.api.deployments.delete` | `destructive` | Delete an app deployment. Cannot be undone. |
| `deployments.get` | `kernel.api.deployments.get` | `read` | Get a deployment and its status. Poll this instead of the event stream. |
| `deployments.list` | `kernel.api.deployments.list` | `read` | List app deployments. |
| `extensions.delete` | `kernel.api.extensions.delete` | `destructive` | Delete an uploaded extension. Cannot be undone. |
| `extensions.download` | `kernel.api.extensions.download` | `read` | Download an uploaded extension's zip. Returns a file. |
| `extensions.downloadFromChromeStore` | `kernel.api.extensions.downloadFromChromeStore` | `read` | Download an extension from the Chrome Web Store as an unpacked zip, ready for extensions.upload. Returns a file. |
| `extensions.get` | `kernel.api.extensions.get` | `read` | Get an uploaded extension's metadata. |
| `extensions.list` | `kernel.api.extensions.list` | `read` | List uploaded Chrome extensions. |
| `extensions.upload` | `kernel.api.extensions.upload` | `write` | Upload a Chrome extension (a zip of the unpacked extension, as a URL or base64) to use in browsers by name. |
| `invocations.create` | `kernel.api.invocations.create` | `write` | Run an action of a deployed Kernel app (billed per second). async: true returns at once; poll invocations.get for the result. |
| `invocations.deleteBrowsers` | `kernel.api.invocations.deleteBrowsers` | `destructive` | Delete every browser an invocation started. Cannot be undone. |
| `invocations.get` | `kernel.api.invocations.get` | `read` | Get an invocation: status, output and timing. Poll this instead of the event stream. |
| `invocations.list` | `kernel.api.invocations.list` | `read` | List app action invocations, filtered by app, action, status or time. |
| `invocations.listBrowsers` | `kernel.api.invocations.listBrowsers` | `read` | List the browsers an invocation started. |
| `invocations.update` | `kernel.api.invocations.update` | `write` | Change an invocation's status, for example mark it succeeded or failed with output. |
| `organization.entitlements.get` | `kernel.api.organization.entitlements.get` | `read` | Get what the org's plan includes (features and quotas). |
| `organization.limits.get` | `kernel.api.organization.limits.get` | `read` | Get the org's limits and current use: concurrent browsers, managed auth connections, vaults. |
| `organization.limits.update` | `kernel.api.organization.limits.update` | `write` | Set the default concurrent-browser cap for projects without their own. |
| `profiles.create` | `kernel.api.profiles.create` | `write` | Create an empty browser profile (saved cookies and storage) to start browsers signed in. Fill it by starting a browser with profile {name, save_changes: true}, logging in, then deleting the browser. |
| `profiles.delete` | `kernel.api.profiles.delete` | `destructive` | Delete a browser profile and its saved cookies and storage. Cannot be undone. |
| `profiles.download` | `kernel.api.profiles.download` | `read` | Download a profile's saved state as a tar.zst (or tar) archive. Returns a file. Holds session cookies: treat it as a credential. |
| `profiles.get` | `kernel.api.profiles.get` | `read` | Get a browser profile by id or name. |
| `profiles.list` | `kernel.api.profiles.list` | `read` | List saved browser profiles (name, id, last used). |
| `profiles.update` | `kernel.api.profiles.update` | `write` | Rename a browser profile. |
| `projects.create` | `kernel.api.projects.create` | `write` | Create a project to keep browsers, profiles and keys separate within the org. |
| `projects.delete` | `kernel.api.projects.delete` | `destructive` | Delete a project. Cannot be undone. |
| `projects.get` | `kernel.api.projects.get` | `read` | Get a project. |
| `projects.limits.get` | `kernel.api.projects.limits.get` | `read` | Get a project's concurrency limit and use. |
| `projects.limits.update` | `kernel.api.projects.limits.update` | `write` | Set a project's concurrent-browser cap. |
| `projects.list` | `kernel.api.projects.list` | `read` | List the org's projects. |
| `projects.update` | `kernel.api.projects.update` | `write` | Rename or change a project. |
| `proxies.check` | `kernel.api.proxies.check` | `read` | Check that a proxy works and see its exit IP. |
| `proxies.create` | `kernel.api.proxies.create` | `write` | Create a proxy configuration (datacenter, ISP, residential, mobile or your own) for browsers to route through. |
| `proxies.delete` | `kernel.api.proxies.delete` | `destructive` | Delete a proxy configuration. Cannot be undone. |
| `proxies.get` | `kernel.api.proxies.get` | `read` | Get a proxy configuration. |
| `proxies.list` | `kernel.api.proxies.list` | `read` | List proxy configurations. |
| `proxies.update` | `kernel.api.proxies.update` | `write` | Change a proxy configuration. |
| `proxyIPs.get` | `kernel.api.proxyIPs.get` | `read` | Get a reserved ISP proxy IP. |
| `proxyIPs.list` | `kernel.api.proxyIPs.list` | `read` | List the org's reserved ISP proxy IPs. |
| `reports.create` | `kernel.api.reports.create` | `write` | Submit a typed report against a task (validated against the report type's schema). |
| `reports.get` | `kernel.api.reports.get` | `read` | Get a report. |
| `reports.list` | `kernel.api.reports.list` | `read` | List a task's reports, oldest first. |
| `reportTypes.get` | `kernel.api.reportTypes.get` | `read` | Get a report type and its schema. |
| `reportTypes.list` | `kernel.api.reportTypes.list` | `read` | List report types. |
| `reportTypes.versions.get` | `kernel.api.reportTypes.versions.get` | `read` | Get one version of a report type's schema. |
| `search.contents.fetch` | `kernel.api.search.contents.fetch` | `read` | Fetch the page contents of chosen results from an earlier search (by result_ids or the top limit results). |
| `search.create` | `kernel.api.search.create` | `read` | Search the web through one of Kernel's search providers and get ranked results (titles, URLs, snippets), kept for search.contents.fetch. |
| `search.get` | `kernel.api.search.get` | `read` | Get a search that was run earlier, with its results. |
| `search.providers.list` | `kernel.api.search.providers.list` | `read` | List the search providers and the options each supports. |
| `serviceAccounts.create` | `kernel.api.serviceAccounts.create` | `write` | Create a service account for workload identity sign-in. |
| `serviceAccounts.delete` | `kernel.api.serviceAccounts.delete` | `destructive` | Archive a service account; its sign-ins stop working. |
| `serviceAccounts.get` | `kernel.api.serviceAccounts.get` | `read` | Get a service account. |
| `serviceAccounts.list` | `kernel.api.serviceAccounts.list` | `read` | List service accounts. |
| `serviceAccounts.update` | `kernel.api.serviceAccounts.update` | `write` | Update a service account. |
| `tasks.create` | `kernel.api.tasks.create` | `write` | Record a task an agent is working on, optionally with the browsers it uses; submit reports against it. |
| `tasks.get` | `kernel.api.tasks.get` | `read` | Get a task. |
| `tasks.linkBrowsers` | `kernel.api.tasks.linkBrowsers` | `write` | Link browser sessions to a task. |
| `tasks.list` | `kernel.api.tasks.list` | `read` | List tasks, newest first. |
| `telemetry.destinations.create` | `kernel.api.telemetry.destinations.create` | `write` | Add an OTLP destination that browser sessions export telemetry to. |
| `telemetry.destinations.delete` | `kernel.api.telemetry.destinations.delete` | `destructive` | Delete an OTLP telemetry destination. Cannot be undone. |
| `telemetry.destinations.get` | `kernel.api.telemetry.destinations.get` | `read` | Get an OTLP telemetry destination. |
| `telemetry.destinations.list` | `kernel.api.telemetry.destinations.list` | `read` | List OTLP telemetry destinations. |
| `telemetry.destinations.update` | `kernel.api.telemetry.destinations.update` | `write` | Update an OTLP telemetry destination. |
| `vaultProviderConfigs.create` | `kernel.api.vaultProviderConfigs.create` | `write` | Register a vault provider configuration (card or payment provider settings shared by the org's projects). |
| `vaultProviderConfigs.delete` | `kernel.api.vaultProviderConfigs.delete` | `destructive` | Delete an unused vault provider configuration. Cannot be undone. |
| `vaultProviderConfigs.get` | `kernel.api.vaultProviderConfigs.get` | `read` | Get a vault provider configuration. |
| `vaultProviderConfigs.list` | `kernel.api.vaultProviderConfigs.list` | `read` | List vault provider configurations. |
| `vaultProviderConfigs.update` | `kernel.api.vaultProviderConfigs.update` | `write` | Update a vault provider configuration. |
| `vaults.delete` | `kernel.api.vaults.delete` | `destructive` | Delete a vault and invalidate every item in it. Cannot be undone. |
| `vaults.get` | `kernel.api.vaults.get` | `read` | Get a vault. |
| `vaults.getEncryptionKey` | `kernel.api.vaults.getEncryptionKey` | `read` | Get a vault's public key, for encrypting credential values in a browser before they are sent. |
| `vaults.items.delete` | `kernel.api.vaults.items.delete` | `destructive` | Delete a vault item and invalidate its secret. Cannot be undone. |
| `vaults.items.events` | `kernel.api.vaults.items.events` | `read` | List a vault item's audit events. |
| `vaults.items.get` | `kernel.api.vaults.items.get` | `read` | Get a vault item and the operations it currently offers (wait up to 60 s for a change). |
| `vaults.items.list` | `kernel.api.vaults.items.list` | `read` | List a vault's items (no secret values). |
| `vaults.items.performOperation` | `kernel.api.vaults.items.performOperation` | `destructive` | Run an operation a vault item offers, such as fill, authorize, confirm_transaction or add_payment_method. Some move money or use a card: confirm with the person first. |
| `vaults.items.update` | `kernel.api.vaults.items.update` | `write` | Update a vault item's card specification or credential values. |
| `vaults.items.upsert` | `kernel.api.vaults.items.upsert` | `write` | Create a vault item (card, credential, wallet or payment request) under a key, or get the identical existing one. |
| `vaults.list` | `kernel.api.vaults.list` | `read` | List vaults in the project. |
| `vaults.upsert` | `kernel.api.vaults.upsert` | `write` | Create a vault (a project-scoped store of secrets, cards and credentials for browsers to use), or get the existing one with that name. |
| `workloadIdentityAuthenticationEvents.list` | `kernel.api.workloadIdentityAuthenticationEvents.list` | `read` | List workload identity sign-in outcomes (sanitized). |
| `workloadIdentityFederationRules.create` | `kernel.api.workloadIdentityFederationRules.create` | `write` | Create a rule mapping an issuer's token claims to a service account. |
| `workloadIdentityFederationRules.delete` | `kernel.api.workloadIdentityFederationRules.delete` | `destructive` | Archive a workload identity federation rule. |
| `workloadIdentityFederationRules.get` | `kernel.api.workloadIdentityFederationRules.get` | `read` | Get a workload identity federation rule. |
| `workloadIdentityFederationRules.list` | `kernel.api.workloadIdentityFederationRules.list` | `read` | List workload identity federation rules. |
| `workloadIdentityFederationRules.update` | `kernel.api.workloadIdentityFederationRules.update` | `write` | Update a workload identity federation rule. |
| `workloadIdentityIssuers.create` | `kernel.api.workloadIdentityIssuers.create` | `write` | Register an OIDC issuer whose tokens can sign in as a service account. |
| `workloadIdentityIssuers.delete` | `kernel.api.workloadIdentityIssuers.delete` | `destructive` | Archive a workload identity issuer. |
| `workloadIdentityIssuers.get` | `kernel.api.workloadIdentityIssuers.get` | `read` | Get a workload identity issuer. |
| `workloadIdentityIssuers.list` | `kernel.api.workloadIdentityIssuers.list` | `read` | List workload identity issuers. |
| `workloadIdentityIssuers.update` | `kernel.api.workloadIdentityIssuers.update` | `write` | Update a workload identity issuer. |
| `workloadIdentityIssuers.verify` | `kernel.api.workloadIdentityIssuers.verify` | `read` | Check that an issuer's discovery document and signing keys can be fetched. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kernel

## License

Apache-2.0
