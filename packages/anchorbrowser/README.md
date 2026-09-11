# @corsair-dev/anchorbrowser

Anchor Browser plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/anchorbrowser
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agent.listAgentResources` | `anchorbrowser.api.agent.listAgentResources` | `read` | List all agent resources (files) uploaded to a browser session. Returns metadata for each file including name, size, file type, and last modified timestamp. Requires an active running session - use START_BROWSER_SESSION first. Files can be uploaded using UPLOAD_FILE action. |
| `agent.pauseAgent` | `anchorbrowser.api.agent.pauseAgent` | `write` | Tool to pause the AI agent for a specific browser session. Use when you need to temporarily halt autonomous agent execution while keeping the session active. |
| `agent.resumeAgent` | `anchorbrowser.api.agent.resumeAgent` | `write` | Tool to resume the AI agent for a specific browser session. Use when you need to restart agent execution after it has been paused or stopped. |
| `agent.uploadFile` | `anchorbrowser.api.agent.uploadFile` | `write` | Tool to upload a file to a browser session as an agent resource. Use after starting or referencing a session when you need to provide file inputs (single files or ZIP archives) for web forms or AI-driven tasks. Supports direct base64-encoded content or S3 key references from other actions. |
| `batchSessions.getBatchSessionStatus` | `anchorbrowser.api.batchSessions.getBatchSessionStatus` | `read` | Tool to retrieve detailed status information for a specific batch including progress and errors. Use when you need to check the status of a batch session creation request. |
| `downloads.listSessionDownloads` | `anchorbrowser.api.downloads.listSessionDownloads` | `read` | Tool to retrieve metadata of files downloaded during a browser session. Use after confirming the session ID. |
| `events.signalEvent` | `anchorbrowser.api.events.signalEvent` | `write` | Tool to signal a specific event to be received by other processes or sessions. Use when you need real-time coordination across browser sessions after verifying session is active. |
| `events.waitForEvent` | `anchorbrowser.api.events.waitForEvent` | `write` | Blocks execution until a specific named event is signaled or the timeout expires. Used for cross-session coordination, MFA handling, and workflow synchronization. The event must first be signaled using the Signal Event action. Returns the data payload that was sent with the signal. Events are user-scoped. |
| `extensions.deleteExtension` | `anchorbrowser.api.extensions.deleteExtension` | `destructive` | Tool to delete a browser extension and remove it from storage. Use after confirming the extension exists. |
| `extensions.listExtensions` | `anchorbrowser.api.extensions.listExtensions` | `read` | Retrieves all browser extensions uploaded by the authenticated user. Use this to view available extensions that can be attached to browser sessions for automation tasks. |
| `extensions.uploadExtension` | `anchorbrowser.api.extensions.uploadExtension` | `write` | Tool to upload a new browser extension as a ZIP file for use in browser sessions. Use when you need to add custom extensions that can be attached to automation sessions. The ZIP file must contain a valid extension manifest (manifest.json). Extensions are scoped to the authenticated user and can be listed or attached to sessions later. |
| `integrations.createIntegration` | `anchorbrowser.api.integrations.createIntegration` | `write` | Tool to create a new integration with a third-party service like 1Password. Use when you need to set up an integration for managing credentials or accessing external services. The integration will be available immediately after creation for use in browser sessions and profiles. |
| `integrations.deleteIntegration` | `anchorbrowser.api.integrations.deleteIntegration` | `destructive` | Tool to delete an existing integration and remove its stored credentials. Use after confirming the integration ID exists. |
| `integrations.listIntegrations` | `anchorbrowser.api.integrations.listIntegrations` | `read` | Tool to retrieve all integrations for the authenticated team. Use when you need to view available integrations that can be used with browser sessions. |
| `osLevel.clickMouse` | `anchorbrowser.api.osLevel.clickMouse` | `write` | Tool to perform a mouse click at specified coordinates within a browser session. Use when you need to interact with page elements by clicking at specific x/y positions. The click is executed in the context of the specified browser session. |
| `osLevel.copySelectedText` | `anchorbrowser.api.osLevel.copySelectedText` | `write` | Tool to copy currently selected text in a browser session to the clipboard. Use when you need to extract text that the user or automation has selected in the browser. |
| `osLevel.doubleClickMouse` | `anchorbrowser.api.osLevel.doubleClickMouse` | `write` | Tool to perform a double click at specified coordinates in a browser session. Use when you need to trigger double-click events on UI elements or specific page locations. |
| `osLevel.dragAndDrop` | `anchorbrowser.api.osLevel.dragAndDrop` | `write` | Tool to perform a drag and drop operation from start coordinates to end coordinates within a browser session. Use when you need to simulate dragging UI elements or files in automated workflows. |
| `osLevel.getClipboardContent` | `anchorbrowser.api.osLevel.getClipboardContent` | `read` | Tool to retrieve the current content of the clipboard from a browser session. Use when you need to read clipboard data from an active session. |
| `osLevel.moveMouse` | `anchorbrowser.api.osLevel.moveMouse` | `write` | Tool to move the mouse cursor to specified coordinates within a browser session. Use when you need to simulate mouse movement at the OS level. |
| `osLevel.navigateToUrl` | `anchorbrowser.api.osLevel.navigateToUrl` | `write` | Tool to navigate a browser session to a specified URL. Use when you need to direct an existing session to a new webpage. |
| `osLevel.pasteText` | `anchorbrowser.api.osLevel.pasteText` | `write` | Tool to paste text at the current cursor position in a browser session. Use when you need to insert text into an active form field or text area. |
| `osLevel.performKeyboardShortcut` | `anchorbrowser.api.osLevel.performKeyboardShortcut` | `write` | Tool to perform a keyboard shortcut using specified keys in a browser session. Use when you need to simulate keyboard input like copy (Control+C), paste (Control+V), or any other key combination. |
| `osLevel.pressMouseButton` | `anchorbrowser.api.osLevel.pressMouseButton` | `write` | Tool to perform a mouse button down action at specified coordinates within a browser session. Use when you need to simulate pressing and holding a mouse button at a specific screen position. |
| `osLevel.releaseMouseButton` | `anchorbrowser.api.osLevel.releaseMouseButton` | `write` | Tool to release a mouse button at specified coordinates within a browser session. Use when automating mouse interactions that require button release events, such as completing drag operations or simulating natural mouse behavior. |
| `osLevel.scrollSession` | `anchorbrowser.api.osLevel.scrollSession` | `write` | Tool to perform a scroll action at specified coordinates within a browser session. Use when you need to scroll to specific positions or simulate user scrolling behavior. Example: "Scroll down 100 pixels from position (100, 100) in session sess_123". |
| `osLevel.setClipboardContent` | `anchorbrowser.api.osLevel.setClipboardContent` | `write` | Tool to set the content of the clipboard in a browser session. Use when you need to programmatically copy text to the clipboard for automated workflows. |
| `osLevel.typeText` | `anchorbrowser.api.osLevel.typeText` | `write` | Tool to type specified text with optional delay between keystrokes. Use when you need to input text into a browser session, such as filling forms or entering search queries. |
| `pages.getSessionPages` | `anchorbrowser.api.pages.getSessionPages` | `read` | Tool to retrieve all pages associated with a specific browser session. Use when you need to list all open tabs or pages in an active or completed session. |
| `profiles.createProfile` | `anchorbrowser.api.profiles.createProfile` | `write` | Creates a new browser profile from an active session. A profile stores cookies, local storage, and cache data. The session must be running when this is called; profile data is persisted once the session terminates. Use profiles to maintain persistent browser state across multiple sessions. |
| `profiles.deleteProfile` | `anchorbrowser.api.profiles.deleteProfile` | `destructive` | Tool to delete a browser profile by ID. Use after confirming the profile exists. |
| `profiles.getProfile` | `anchorbrowser.api.profiles.getProfile` | `read` | Tool to retrieve details of a specific profile by its name. Use when you need to fetch information about a particular browser profile. |
| `profiles.listProfiles` | `anchorbrowser.api.profiles.listProfiles` | `read` | Tool to fetch all stored browser profiles. Use when you need an overview of all profiles available to the authenticated user (e.g., after creating or deleting profiles). |
| `profiles.updateProfile` | `anchorbrowser.api.profiles.updateProfile` | `write` | Updates an existing browser profile with data from an active session. The profile stores cookies, local storage, and cache from the session. Requires an active (running) browser session - the session_id must reference a session that has not been terminated. |
| `recordings.listSessionRecordings` | `anchorbrowser.api.recordings.listSessionRecordings` | `read` | Tool to list all recordings for a specific browser session. Use after confirming the session ID. |
| `recordings.pauseSessionRecording` | `anchorbrowser.api.recordings.pauseSessionRecording` | `write` | Tool to pause the video recording for a specific browser session. Use when you need to temporarily stop recording without ending the session. |
| `recordings.resumeSessionRecording` | `anchorbrowser.api.recordings.resumeSessionRecording` | `write` | Tool to resume video recording for a specific browser session. Use when recording was previously paused and needs to be restarted. |
| `screenshots.takeScreenshot` | `anchorbrowser.api.screenshots.takeScreenshot` | `read` | Tool to take a screenshot of the current browser session and return it as an image. Use when you need a visual snapshot of an active browser session. |
| `sessions.endAllSessions` | `anchorbrowser.api.sessions.endAllSessions` | `destructive` | Tool to terminate all active browser sessions at once. Use when you need to immediately close every browser session for the authenticated user, such as during cleanup operations or security concerns. |
| `sessions.endBrowserSession` | `anchorbrowser.api.sessions.endBrowserSession` | `destructive` | Tool to end a specific browser session by ID. Use after confirming the session ID you want to terminate. |
| `sessions.getBrowserSession` | `anchorbrowser.api.sessions.getBrowserSession` | `read` | Tool to retrieve detailed information about a specific browser session. Use when you need to check the status, configuration, or execution details of a browser session. |
| `sessions.listSessions` | `anchorbrowser.api.sessions.listSessions` | `read` | Tool to list all browser sessions. Use when you need to retrieve both active and inactive sessions. |
| `sessions.startBrowserSession` | `anchorbrowser.api.sessions.startBrowserSession` | `write` | Tool to start a new browser session with optional customizations. Use when you need to programmatically allocate an isolated browser instance with recording, proxy, live view, and feature toggles. |
| `tasks.createOrUpdateTaskDraft` | `anchorbrowser.api.tasks.createOrUpdateTaskDraft` | `write` | Tool to create or update the draft version of a task. Draft versions are used for development and testing before publishing. Use when you need to save task code changes without creating a published version. |
| `tasks.createTask` | `anchorbrowser.api.tasks.createTask` | `write` | Tool to create a new task or update an existing task with the same name. Tasks are reusable TypeScript code snippets that execute in browser sessions. Use when you need to define repeatable automation workflows that can be invoked across multiple sessions. |
| `tasks.deleteTask` | `anchorbrowser.api.tasks.deleteTask` | `destructive` | Tool to soft delete a task and all its versions. Use after confirming the task exists. |
| `tasks.deleteTaskVersion` | `anchorbrowser.api.tasks.deleteTaskVersion` | `destructive` | Tool to soft delete a specific version of a task. The version will no longer be accessible but data is preserved for recovery. Use when you need to remove a specific task version. |
| `tasks.deployTask` | `anchorbrowser.api.tasks.deployTask` | `write` | Tool to deploy a task by creating a new version with auto-incremented version number. Use when you need to publish task changes and make them available for execution. |
| `tasks.getLatestTaskVersion` | `anchorbrowser.api.tasks.getLatestTaskVersion` | `read` | Tool to retrieve the latest version of a task including the full base64 encoded code content. Use when you need to access the most recent task implementation. |
| `tasks.getTaskDraft` | `anchorbrowser.api.tasks.getTaskDraft` | `read` | Tool to retrieve the draft version of a task, including the full Base64 encoded code content. Use when you need to access the current draft of a task that hasn't been published yet. |
| `tasks.getTaskExecutionResult` | `anchorbrowser.api.tasks.getTaskExecutionResult` | `read` | Tool to retrieve a single task execution result by its ID. Use when you need to check the status, output, or error details of a specific task execution. |
| `tasks.getTaskMetadata` | `anchorbrowser.api.tasks.getTaskMetadata` | `read` | Tool to retrieve task metadata without downloading the full task code. Use when you need task information such as status, creation time, or language without the code content. |
| `tasks.getTaskVersion` | `anchorbrowser.api.tasks.getTaskVersion` | `read` | Tool to retrieve a specific version of a task, including the full code content. Use when you need to access the complete task code for a particular version (draft, latest, or specific version number). |
| `tasks.listTaskExecutions` | `anchorbrowser.api.tasks.listTaskExecutions` | `read` | Tool to retrieve execution history for a specific task with filtering and pagination support. Use when you need to view past execution results, monitor task success rates, or debug failed executions. |
| `tasks.listTasks` | `anchorbrowser.api.tasks.listTasks` | `read` | Tool to retrieve a paginated list of all tasks for the authenticated team. Use when you need to view available tasks with their latest version information and metadata. |
| `tasks.listTaskVersions` | `anchorbrowser.api.tasks.listTaskVersions` | `read` | Tool to retrieve all versions of a specific task, including draft and published versions. Use when you need to view the version history of a task or select a specific version for deployment or execution. |
| `tasks.publishTaskVersion` | `anchorbrowser.api.tasks.publishTaskVersion` | `write` | Tool to publish a specific version of a task. Creates a new version if it doesn't exist, or updates an existing version's metadata. Use when you need to make a specific task version available for execution. Cannot publish to 'draft' versions. |
| `tasks.runTask` | `anchorbrowser.api.tasks.runTask` | `write` | Tool to execute a task in a browser session with a specific or latest version. Use when you need to run an existing task with optional session reuse and configuration overrides. |
| `tasks.runTaskByName` | `anchorbrowser.api.tasks.runTaskByName` | `write` | Tool to execute a task by its name, always using the latest version. Use when you need to run a predefined browser automation task by referencing its name. |
| `tasks.updateTaskMetadata` | `anchorbrowser.api.tasks.updateTaskMetadata` | `write` | Updates task metadata (name and description). This does not affect the task code or versions. Use when you need to update task information without modifying the implementation. |
| `tools.getWebpageContent` | `anchorbrowser.api.tools.getWebpageContent` | `write` | Tool to retrieve rendered content of a webpage in HTML or Markdown format. Use when you need to fetch a page’s full content, optionally within an existing browser session. |
| `tools.performWebTask` | `anchorbrowser.api.tools.performWebTask` | `write` | Tool to perform autonomous web tasks using AI agents. Use when you need to automate complex browser interactions like form filling, data extraction, or multi-step workflows. |
| `tools.screenshotWebpage` | `anchorbrowser.api.tools.screenshotWebpage` | `write` | Tool to take a screenshot of a specified webpage within a session. Use when you need a visual PNG snapshot of a live page. Example: "Capture a 1280×720 screenshot of https://example.com". |
| `uploads.uploadFilesToSession` | `anchorbrowser.api.uploads.uploadFilesToSession` | `write` | Tool to upload files directly to a browser session for use with web forms and file inputs. Use when you need to provide file inputs to web forms during automated browser sessions. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/anchorbrowser

## License

Apache-2.0
