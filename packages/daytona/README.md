# @corsair-dev/daytona

Daytona sandboxes for AI code: sandboxes (create, start, stop, archive, fork, resize, SSH, previews), the in-sandbox toolbox (files, processes, sessions, git, LSP, code interpreter, computer use), snapshots, volumes, registries, secrets, organization usage and members, analytics and signed webhooks (212 operations).

## Install

```bash
pnpm add @corsair-dev/daytona
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.telemetry.getTrace` | `daytona.api.analytics.telemetry.getTrace` | `read` | Get trace spans |
| `analytics.telemetry.logs` | `daytona.api.analytics.telemetry.logs` | `read` | Get sandbox logs |
| `analytics.telemetry.metrics` | `daytona.api.analytics.telemetry.metrics` | `read` | Get sandbox metrics |
| `analytics.telemetry.traces` | `daytona.api.analytics.telemetry.traces` | `read` | Get sandbox traces |
| `analytics.usage.aggregated` | `daytona.api.analytics.usage.aggregated` | `read` | Get aggregated usage |
| `analytics.usage.bySandbox` | `daytona.api.analytics.usage.bySandbox` | `read` | Get per-sandbox usage |
| `analytics.usage.chart` | `daytona.api.analytics.usage.chart` | `read` | Get usage chart data |
| `analytics.usage.sandbox` | `daytona.api.analytics.usage.sandbox` | `read` | Get sandbox usage periods |
| `apiKeys.create` | `daytona.api.apiKeys.create` | `destructive` | Create API key |
| `apiKeys.delete` | `daytona.api.apiKeys.delete` | `destructive` | Delete API key |
| `apiKeys.getCurrent` | `daytona.api.apiKeys.getCurrent` | `read` | Get current API key's details |
| `apiKeys.list` | `daytona.api.apiKeys.list` | `read` | List API keys |
| `audit.getOrganizationLogs` | `daytona.api.audit.getOrganizationLogs` | `read` | Get audit logs for organization |
| `audit.getScenarios` | `daytona.api.audit.getScenarios` | `read` | Get supported audit log scenarios |
| `config.get` | `daytona.api.config.get` | `read` | Get config |
| `dockerRegistries.create` | `daytona.api.dockerRegistries.create` | `write` | Create registry |
| `dockerRegistries.delete` | `daytona.api.dockerRegistries.delete` | `destructive` | Delete registry |
| `dockerRegistries.get` | `daytona.api.dockerRegistries.get` | `read` | Get registry |
| `dockerRegistries.getTransientPushAccess` | `daytona.api.dockerRegistries.getTransientPushAccess` | `destructive` | Get temporary registry access for pushing snapshots |
| `dockerRegistries.list` | `daytona.api.dockerRegistries.list` | `read` | List registries |
| `dockerRegistries.update` | `daytona.api.dockerRegistries.update` | `write` | Update registry |
| `health.live` | `daytona.api.health.live` | `read` | health.live |
| `health.ready` | `daytona.api.health.ready` | `read` | health.ready |
| `objectStorage.getPushAccess` | `daytona.api.objectStorage.getPushAccess` | `destructive` | Get temporary storage access for pushing objects |
| `organizations.createRegion` | `daytona.api.organizations.createRegion` | `write` | Create a new region |
| `organizations.deleteRegion` | `daytona.api.organizations.deleteRegion` | `destructive` | Delete a region |
| `organizations.getGpuCapacity` | `daytona.api.organizations.getGpuCapacity` | `read` | Get shared GPU capacity |
| `organizations.getOtelConfig` | `daytona.api.organizations.getOtelConfig` | `read` | Get organization OTEL config by organization ID |
| `organizations.getRegionById` | `daytona.api.organizations.getRegionById` | `read` | Get region by ID |
| `organizations.getUsageOverview` | `daytona.api.organizations.getUsageOverview` | `read` | Get organization current usage overview |
| `organizations.listAvailableRegions` | `daytona.api.organizations.listAvailableRegions` | `read` | List all available regions for the organization |
| `organizations.listAvailableSandboxClasses` | `daytona.api.organizations.listAvailableSandboxClasses` | `read` | List available sandbox classes for organization |
| `organizations.listMembers` | `daytona.api.organizations.listMembers` | `read` | List organization members |
| `organizations.regenerateProxyApiKey` | `daytona.api.organizations.regenerateProxyApiKey` | `destructive` | Regenerate proxy API key for a region |
| `organizations.regenerateSnapshotManagerCredentials` | `daytona.api.organizations.regenerateSnapshotManagerCredentials` | `destructive` | Regenerate snapshot manager credentials for a region |
| `organizations.regenerateSshGatewayApiKey` | `daytona.api.organizations.regenerateSshGatewayApiKey` | `destructive` | Regenerate SSH gateway API key for a region |
| `organizations.updateRegion` | `daytona.api.organizations.updateRegion` | `write` | Update region configuration |
| `regions.listShared` | `daytona.api.regions.listShared` | `read` | List all shared regions |
| `runners.create` | `daytona.api.runners.create` | `destructive` | Create runner |
| `runners.delete` | `daytona.api.runners.delete` | `destructive` | Delete runner |
| `runners.getById` | `daytona.api.runners.getById` | `read` | Get runner by ID |
| `runners.getFullById` | `daytona.api.runners.getFullById` | `read` | Get runner by ID |
| `runners.list` | `daytona.api.runners.list` | `read` | List all runners |
| `runners.updateDraining` | `daytona.api.runners.updateDraining` | `write` | Update runner draining status |
| `runners.updateScheduling` | `daytona.api.runners.updateScheduling` | `write` | Update runner scheduling status |
| `sandboxes.addNodes` | `daytona.api.sandboxes.addNodes` | `destructive` | Append nodes to a multi-node sandbox |
| `sandboxes.archive` | `daytona.api.sandboxes.archive` | `destructive` | Archive sandbox |
| `sandboxes.create` | `daytona.api.sandboxes.create` | `destructive` | Create a sandbox from a snapshot or image; billed per second for its vCPU, memory and disk while it runs |
| `sandboxes.createSnapshot` | `daytona.api.sandboxes.createSnapshot` | `destructive` | Create a snapshot from a sandbox |
| `sandboxes.createSshAccess` | `daytona.api.sandboxes.createSshAccess` | `destructive` | Create SSH access for sandbox |
| `sandboxes.delete` | `daytona.api.sandboxes.delete` | `destructive` | Delete a sandbox and its disk |
| `sandboxes.expireSignedPortPreviewUrl` | `daytona.api.sandboxes.expireSignedPortPreviewUrl` | `destructive` | Expire signed preview URL for a sandbox port |
| `sandboxes.fork` | `daytona.api.sandboxes.fork` | `destructive` | Fork a sandbox |
| `sandboxes.get` | `daytona.api.sandboxes.get` | `read` | Get sandbox details |
| `sandboxes.getAncestors` | `daytona.api.sandboxes.getAncestors` | `read` | Get sandbox fork ancestor chain |
| `sandboxes.getBuildLogsUrl` | `daytona.api.sandboxes.getBuildLogsUrl` | `read` | Get build logs URL |
| `sandboxes.getForks` | `daytona.api.sandboxes.getForks` | `read` | Get sandbox fork children |
| `sandboxes.getGangMembershipOperation` | `daytona.api.sandboxes.getGangMembershipOperation` | `read` | Get a membership operation of a multi-node GPU sandbox |
| `sandboxes.getLogs` | `daytona.api.sandboxes.getLogs` | `read` | Get sandbox logs |
| `sandboxes.getMetrics` | `daytona.api.sandboxes.getMetrics` | `read` | Get sandbox metrics |
| `sandboxes.getParent` | `daytona.api.sandboxes.getParent` | `read` | Get sandbox fork parent |
| `sandboxes.getPortPreviewUrl` | `daytona.api.sandboxes.getPortPreviewUrl` | `read` | Get preview URL for a sandbox port |
| `sandboxes.getSignedPortPreviewUrl` | `daytona.api.sandboxes.getSignedPortPreviewUrl` | `read` | Get signed preview URL for a sandbox port |
| `sandboxes.getSigningKey` | `daytona.api.sandboxes.getSigningKey` | `read` | Get the signing key for a sandbox |
| `sandboxes.getToolboxProxyUrl` | `daytona.api.sandboxes.getToolboxProxyUrl` | `read` | Get toolbox proxy URL for a sandbox |
| `sandboxes.getTraces` | `daytona.api.sandboxes.getTraces` | `read` | Get sandbox traces |
| `sandboxes.getTraceSpans` | `daytona.api.sandboxes.getTraceSpans` | `read` | Get trace spans |
| `sandboxes.list` | `daytona.api.sandboxes.list` | `read` | List sandboxes |
| `sandboxes.pause` | `daytona.api.sandboxes.pause` | `destructive` | Pause sandbox |
| `sandboxes.recover` | `daytona.api.sandboxes.recover` | `destructive` | Recover sandbox from error state |
| `sandboxes.removeNodes` | `daytona.api.sandboxes.removeNodes` | `destructive` | Remove the highest ranks from a multi-node sandbox |
| `sandboxes.replaceLabels` | `daytona.api.sandboxes.replaceLabels` | `write` | Replace sandbox labels |
| `sandboxes.replaceNode` | `daytona.api.sandboxes.replaceNode` | `destructive` | Replace a failed multi-node sandbox rank |
| `sandboxes.resize` | `daytona.api.sandboxes.resize` | `destructive` | Resize sandbox resources |
| `sandboxes.revokeSshAccess` | `daytona.api.sandboxes.revokeSshAccess` | `destructive` | Revoke SSH access for sandbox |
| `sandboxes.rotateSigningKey` | `daytona.api.sandboxes.rotateSigningKey` | `destructive` | Rotate the signing key, invalidating all previously signed URLs |
| `sandboxes.setAutoArchiveInterval` | `daytona.api.sandboxes.setAutoArchiveInterval` | `write` | Set sandbox auto-archive interval |
| `sandboxes.setAutoDeleteInterval` | `daytona.api.sandboxes.setAutoDeleteInterval` | `write` | Set sandbox auto-delete interval |
| `sandboxes.setAutoPauseInterval` | `daytona.api.sandboxes.setAutoPauseInterval` | `write` | Set sandbox auto-pause interval |
| `sandboxes.setAutostopInterval` | `daytona.api.sandboxes.setAutostopInterval` | `write` | Set sandbox auto-stop interval |
| `sandboxes.setTtl` | `daytona.api.sandboxes.setTtl` | `write` | Set sandbox TTL |
| `sandboxes.start` | `daytona.api.sandboxes.start` | `destructive` | Start or resume sandbox |
| `sandboxes.stop` | `daytona.api.sandboxes.stop` | `destructive` | Stop sandbox |
| `sandboxes.updateLastActivity` | `daytona.api.sandboxes.updateLastActivity` | `write` | Update sandbox last activity |
| `sandboxes.updateNetworkSettings` | `daytona.api.sandboxes.updateNetworkSettings` | `write` | Update sandbox network settings |
| `sandboxes.updatePublicStatus` | `daytona.api.sandboxes.updatePublicStatus` | `write` | Update public status |
| `sandboxes.updateSecrets` | `daytona.api.sandboxes.updateSecrets` | `write` | Update sandbox secrets |
| `secrets.create` | `daytona.api.secrets.create` | `write` | Create secret |
| `secrets.delete` | `daytona.api.secrets.delete` | `destructive` | Delete secret |
| `secrets.get` | `daytona.api.secrets.get` | `read` | Get secret |
| `secrets.listPaginated` | `daytona.api.secrets.listPaginated` | `read` | List secrets with pagination |
| `secrets.update` | `daytona.api.secrets.update` | `write` | Update secret |
| `snapshots.activate` | `daytona.api.snapshots.activate` | `write` | Activate a snapshot |
| `snapshots.create` | `daytona.api.snapshots.create` | `destructive` | Create a new snapshot |
| `snapshots.deactivate` | `daytona.api.snapshots.deactivate` | `destructive` | Deactivate a snapshot |
| `snapshots.get` | `daytona.api.snapshots.get` | `read` | Get snapshot by ID or name |
| `snapshots.getAll` | `daytona.api.snapshots.getAll` | `read` | List all snapshots |
| `snapshots.getBuildLogsUrl` | `daytona.api.snapshots.getBuildLogsUrl` | `read` | Get snapshot build logs URL |
| `snapshots.remove` | `daytona.api.snapshots.remove` | `destructive` | Delete snapshot |
| `toolbox.computerUse.click` | `daytona.api.toolbox.computerUse.click` | `write` | Click mouse button |
| `toolbox.computerUse.deleteRecording` | `daytona.api.toolbox.computerUse.deleteRecording` | `destructive` | Delete a recording |
| `toolbox.computerUse.downloadRecording` | `daytona.api.toolbox.computerUse.downloadRecording` | `read` | Download a recording (returned as a file) |
| `toolbox.computerUse.drag` | `daytona.api.toolbox.computerUse.drag` | `write` | Drag mouse |
| `toolbox.computerUse.findAccessibilityNodes` | `daytona.api.toolbox.computerUse.findAccessibilityNodes` | `read` | Find accessibility nodes |
| `toolbox.computerUse.focusAccessibilityNode` | `daytona.api.toolbox.computerUse.focusAccessibilityNode` | `write` | Focus an accessibility node |
| `toolbox.computerUse.getAccessibilityTree` | `daytona.api.toolbox.computerUse.getAccessibilityTree` | `read` | Get accessibility tree |
| `toolbox.computerUse.getComputerUseStatus` | `daytona.api.toolbox.computerUse.getComputerUseStatus` | `read` | Get computer use process status |
| `toolbox.computerUse.getComputerUseSystemStatus` | `daytona.api.toolbox.computerUse.getComputerUseSystemStatus` | `read` | Get computer use status |
| `toolbox.computerUse.getDisplayInfo` | `daytona.api.toolbox.computerUse.getDisplayInfo` | `read` | Get display information |
| `toolbox.computerUse.getMousePosition` | `daytona.api.toolbox.computerUse.getMousePosition` | `read` | Get mouse position |
| `toolbox.computerUse.getProcessErrors` | `daytona.api.toolbox.computerUse.getProcessErrors` | `read` | Get process errors |
| `toolbox.computerUse.getProcessLogs` | `daytona.api.toolbox.computerUse.getProcessLogs` | `read` | Get process logs |
| `toolbox.computerUse.getProcessStatus` | `daytona.api.toolbox.computerUse.getProcessStatus` | `read` | Get specific process status |
| `toolbox.computerUse.getRecording` | `daytona.api.toolbox.computerUse.getRecording` | `read` | Get recording details |
| `toolbox.computerUse.getWindows` | `daytona.api.toolbox.computerUse.getWindows` | `read` | Get windows information |
| `toolbox.computerUse.invokeAccessibilityNode` | `daytona.api.toolbox.computerUse.invokeAccessibilityNode` | `write` | Invoke an action on an accessibility node |
| `toolbox.computerUse.keyDown` | `daytona.api.toolbox.computerUse.keyDown` | `write` | Press and hold a keyboard key |
| `toolbox.computerUse.keyUp` | `daytona.api.toolbox.computerUse.keyUp` | `write` | Release a held keyboard key |
| `toolbox.computerUse.listRecordings` | `daytona.api.toolbox.computerUse.listRecordings` | `read` | List all recordings |
| `toolbox.computerUse.mouseDown` | `daytona.api.toolbox.computerUse.mouseDown` | `write` | Press mouse button |
| `toolbox.computerUse.mouseUp` | `daytona.api.toolbox.computerUse.mouseUp` | `write` | Release mouse button |
| `toolbox.computerUse.moveMouse` | `daytona.api.toolbox.computerUse.moveMouse` | `write` | Move mouse cursor |
| `toolbox.computerUse.pressHotkey` | `daytona.api.toolbox.computerUse.pressHotkey` | `write` | Press hotkey |
| `toolbox.computerUse.pressKey` | `daytona.api.toolbox.computerUse.pressKey` | `write` | Press key |
| `toolbox.computerUse.restartProcess` | `daytona.api.toolbox.computerUse.restartProcess` | `write` | Restart specific process |
| `toolbox.computerUse.scroll` | `daytona.api.toolbox.computerUse.scroll` | `write` | Scroll mouse wheel |
| `toolbox.computerUse.setAccessibilityNodeValue` | `daytona.api.toolbox.computerUse.setAccessibilityNodeValue` | `write` | Set the value of an accessibility node |
| `toolbox.computerUse.startComputerUse` | `daytona.api.toolbox.computerUse.startComputerUse` | `destructive` | Start computer use processes |
| `toolbox.computerUse.startRecording` | `daytona.api.toolbox.computerUse.startRecording` | `write` | Start a new recording |
| `toolbox.computerUse.stopComputerUse` | `daytona.api.toolbox.computerUse.stopComputerUse` | `destructive` | Stop computer use processes |
| `toolbox.computerUse.stopRecording` | `daytona.api.toolbox.computerUse.stopRecording` | `write` | Stop a recording |
| `toolbox.computerUse.takeCompressedRegionScreenshot` | `daytona.api.toolbox.computerUse.takeCompressedRegionScreenshot` | `read` | Take a compressed region screenshot |
| `toolbox.computerUse.takeCompressedScreenshot` | `daytona.api.toolbox.computerUse.takeCompressedScreenshot` | `read` | Take a compressed screenshot |
| `toolbox.computerUse.takeRegionScreenshot` | `daytona.api.toolbox.computerUse.takeRegionScreenshot` | `read` | Take a region screenshot |
| `toolbox.computerUse.takeScreenshot` | `daytona.api.toolbox.computerUse.takeScreenshot` | `read` | Take a screenshot |
| `toolbox.computerUse.typeText` | `daytona.api.toolbox.computerUse.typeText` | `write` | Type text |
| `toolbox.files.createFolder` | `daytona.api.toolbox.files.createFolder` | `write` | Create a folder |
| `toolbox.files.delete` | `daytona.api.toolbox.files.delete` | `destructive` | Delete a file or directory |
| `toolbox.files.download` | `daytona.api.toolbox.files.download` | `read` | Download a file from a sandbox (returned as a file) |
| `toolbox.files.findIn` | `daytona.api.toolbox.files.findIn` | `read` | Find text in files |
| `toolbox.files.getInfo` | `daytona.api.toolbox.files.getInfo` | `read` | Get file information |
| `toolbox.files.list` | `daytona.api.toolbox.files.list` | `read` | List files and directories |
| `toolbox.files.move` | `daytona.api.toolbox.files.move` | `write` | Move or rename file/directory |
| `toolbox.files.replaceIn` | `daytona.api.toolbox.files.replaceIn` | `write` | Replace text in files |
| `toolbox.files.search` | `daytona.api.toolbox.files.search` | `read` | Search files by pattern |
| `toolbox.files.setPermissions` | `daytona.api.toolbox.files.setPermissions` | `write` | Set file permissions |
| `toolbox.files.upload` | `daytona.api.toolbox.files.upload` | `write` | Upload a file into a sandbox |
| `toolbox.git.addFiles` | `daytona.api.toolbox.git.addFiles` | `write` | Add files to Git staging |
| `toolbox.git.addRemote` | `daytona.api.toolbox.git.addRemote` | `write` | Add a remote |
| `toolbox.git.authenticate` | `daytona.api.toolbox.git.authenticate` | `write` | Authenticate Git |
| `toolbox.git.checkoutBranch` | `daytona.api.toolbox.git.checkoutBranch` | `write` | Checkout branch or commit |
| `toolbox.git.cloneRepository` | `daytona.api.toolbox.git.cloneRepository` | `write` | Clone a Git repository |
| `toolbox.git.commitChanges` | `daytona.api.toolbox.git.commitChanges` | `write` | Commit changes |
| `toolbox.git.configureUser` | `daytona.api.toolbox.git.configureUser` | `write` | Configure Git user |
| `toolbox.git.createBranch` | `daytona.api.toolbox.git.createBranch` | `write` | Create a new branch |
| `toolbox.git.deleteBranch` | `daytona.api.toolbox.git.deleteBranch` | `destructive` | Delete a branch |
| `toolbox.git.getCommitHistory` | `daytona.api.toolbox.git.getCommitHistory` | `read` | Get commit history |
| `toolbox.git.getConfig` | `daytona.api.toolbox.git.getConfig` | `read` | Get a Git config value |
| `toolbox.git.getStatus` | `daytona.api.toolbox.git.getStatus` | `read` | Get Git status |
| `toolbox.git.initRepository` | `daytona.api.toolbox.git.initRepository` | `write` | Initialize a Git repository |
| `toolbox.git.listBranches` | `daytona.api.toolbox.git.listBranches` | `read` | List branches |
| `toolbox.git.listRemotes` | `daytona.api.toolbox.git.listRemotes` | `read` | List remotes |
| `toolbox.git.pullChanges` | `daytona.api.toolbox.git.pullChanges` | `write` | Pull changes from remote |
| `toolbox.git.pushChanges` | `daytona.api.toolbox.git.pushChanges` | `destructive` | Push changes to remote |
| `toolbox.git.resetChanges` | `daytona.api.toolbox.git.resetChanges` | `destructive` | Reset repository |
| `toolbox.git.restoreFiles` | `daytona.api.toolbox.git.restoreFiles` | `destructive` | Restore files |
| `toolbox.git.setConfig` | `daytona.api.toolbox.git.setConfig` | `write` | Set a Git config value |
| `toolbox.info.getUserHomeDir` | `daytona.api.toolbox.info.getUserHomeDir` | `read` | Get user home directory |
| `toolbox.info.getVersion` | `daytona.api.toolbox.info.getVersion` | `read` | Get version |
| `toolbox.info.getWorkDir` | `daytona.api.toolbox.info.getWorkDir` | `read` | Get working directory |
| `toolbox.interpreter.createInterpreterContext` | `daytona.api.toolbox.interpreter.createInterpreterContext` | `write` | Create a new interpreter context |
| `toolbox.interpreter.deleteInterpreterContext` | `daytona.api.toolbox.interpreter.deleteInterpreterContext` | `destructive` | Delete an interpreter context |
| `toolbox.interpreter.listInterpreterContexts` | `daytona.api.toolbox.interpreter.listInterpreterContexts` | `read` | List all user-created interpreter contexts |
| `toolbox.lsp.completions` | `daytona.api.toolbox.lsp.completions` | `read` | Get code completions |
| `toolbox.lsp.didClose` | `daytona.api.toolbox.lsp.didClose` | `write` | Notify document closed |
| `toolbox.lsp.didOpen` | `daytona.api.toolbox.lsp.didOpen` | `write` | Notify document opened |
| `toolbox.lsp.documentSymbols` | `daytona.api.toolbox.lsp.documentSymbols` | `read` | Get document symbols |
| `toolbox.lsp.start` | `daytona.api.toolbox.lsp.start` | `write` | Start LSP server |
| `toolbox.lsp.stop` | `daytona.api.toolbox.lsp.stop` | `write` | Stop LSP server |
| `toolbox.lsp.workspaceSymbols` | `daytona.api.toolbox.lsp.workspaceSymbols` | `read` | Get workspace symbols |
| `toolbox.ports.get` | `daytona.api.toolbox.ports.get` | `read` | Get active ports |
| `toolbox.ports.isInUse` | `daytona.api.toolbox.ports.isInUse` | `read` | Check if port is in use |
| `toolbox.process.codeRun` | `daytona.api.toolbox.process.codeRun` | `destructive` | Run code in the sandbox's language runtime and get the result |
| `toolbox.process.createPtySession` | `daytona.api.toolbox.process.createPtySession` | `write` | Create a new PTY session |
| `toolbox.process.createSession` | `daytona.api.toolbox.process.createSession` | `write` | Create a new session |
| `toolbox.process.deletePtySession` | `daytona.api.toolbox.process.deletePtySession` | `destructive` | Delete a PTY session |
| `toolbox.process.deleteSession` | `daytona.api.toolbox.process.deleteSession` | `destructive` | Delete a session |
| `toolbox.process.executeCommand` | `daytona.api.toolbox.process.executeCommand` | `destructive` | Run a command in a sandbox and wait for exitCode and output (timeout in seconds) |
| `toolbox.process.getEntrypointLogs` | `daytona.api.toolbox.process.getEntrypointLogs` | `read` | Get entrypoint logs |
| `toolbox.process.getEntrypointSession` | `daytona.api.toolbox.process.getEntrypointSession` | `read` | Get entrypoint session details |
| `toolbox.process.getPtySession` | `daytona.api.toolbox.process.getPtySession` | `read` | Get PTY session information |
| `toolbox.process.getSession` | `daytona.api.toolbox.process.getSession` | `read` | Get session details |
| `toolbox.process.getSessionCommand` | `daytona.api.toolbox.process.getSessionCommand` | `read` | Get session command details |
| `toolbox.process.getSessionCommandLogs` | `daytona.api.toolbox.process.getSessionCommandLogs` | `read` | Get session command logs |
| `toolbox.process.listPtySessions` | `daytona.api.toolbox.process.listPtySessions` | `read` | List all PTY sessions |
| `toolbox.process.listSessions` | `daytona.api.toolbox.process.listSessions` | `read` | List all sessions |
| `toolbox.process.resizePtySession` | `daytona.api.toolbox.process.resizePtySession` | `write` | Resize a PTY session |
| `toolbox.process.sendInput` | `daytona.api.toolbox.process.sendInput` | `destructive` | Send input to command |
| `toolbox.process.sessionExecuteCommand` | `daytona.api.toolbox.process.sessionExecuteCommand` | `destructive` | Execute command in session |
| `toolbox.system.getSystemMetrics` | `daytona.api.toolbox.system.getSystemMetrics` | `read` | Get sandbox resource metrics |
| `volumes.create` | `daytona.api.volumes.create` | `destructive` | Create a new volume |
| `volumes.delete` | `daytona.api.volumes.delete` | `destructive` | Delete volume |
| `volumes.get` | `daytona.api.volumes.get` | `read` | Get volume details |
| `volumes.getByName` | `daytona.api.volumes.getByName` | `read` | Get volume details by name |
| `volumes.list` | `daytona.api.volumes.list` | `read` | List all volumes |
| `warmPools.create` | `daytona.api.warmPools.create` | `destructive` | Create a warm pool |
| `warmPools.delete` | `daytona.api.warmPools.delete` | `destructive` | Delete a warm pool |
| `warmPools.list` | `daytona.api.warmPools.list` | `read` | List warm pools for the organization |
| `warmPools.update` | `daytona.api.warmPools.update` | `destructive` | Update a warm pool size |
| `webhooks.getAppPortalAccess` | `daytona.api.webhooks.getAppPortalAccess` | `write` | Get Svix Consumer App Portal access for an organization |
| `webhooks.getInitializationStatus` | `daytona.api.webhooks.getInitializationStatus` | `read` | Get webhook initialization status for an organization |
| `webhooks.initialize` | `daytona.api.webhooks.initialize` | `write` | Initialize webhooks for an organization |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 7 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/daytona

## License

Apache-2.0
