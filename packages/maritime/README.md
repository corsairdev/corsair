# @corsair-dev/maritime

Maritime, the cloud for AI agents: agent boxes (chat, exec, files, triggers, channels), virtual machines (create, commands, files, snapshots, templates), swarms, computers on demand, end users, networks, billing and signed webhooks (332 operations).

## Install

```bash
pnpm add @corsair-dev/maritime
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.delete` | `maritime.api.account.delete` | `destructive` | Delete the whole Maritime account with every agent, machine and key (irreversible) |
| `account.limits` | `maritime.api.account.limits` | `read` | Get the plan, machine counts and caps, and the size limits of one agent |
| `activity.list` | `maritime.api.activity.list` | `read` | Get what happened across the account's agents and computers (creates, boots, starts, sleeps, wakes, takeovers, deletes, errors, triggers), newest first |
| `agents.activity` | `maritime.api.agents.activity` | `read` | Get the stored events of the agent, newest first |
| `agents.browserLiveView` | `maritime.api.agents.browserLiveView` | `read` | Get a live view link to an agent's browser |
| `agents.capabilities.change` | `maritime.api.agents.capabilities.change` | `write` | Turn one of an agent's capabilities (browser, screen, email ...) on or off |
| `agents.capabilities.get` | `maritime.api.agents.capabilities.get` | `read` | Get an agent's capabilities and whether each is on |
| `agents.channels.get` | `maritime.api.agents.channels.get` | `read` | Read gateway channels: from the live container when active, else from stored boot config |
| `agents.channels.update` | `maritime.api.agents.channels.update` | `write` | Update gateway channels |
| `agents.channels.validateTelegram` | `maritime.api.agents.channels.validateTelegram` | `read` | Validate a BotFather token via Telegram getMe (no container required) |
| `agents.chat.getTurn` | `maritime.api.agents.chat.getTurn` | `read` | Get the caller's retained builtin result without submitting a new message |
| `agents.chat.send` | `maritime.api.agents.chat.send` | `destructive` | Send a message to an agent and wait for its reply; a sleeping agent wakes first |
| `agents.create` | `maritime.api.agents.create` | `destructive` | Create an agent from a template (agentTemplates.list) and start deploying it; billed while it exists |
| `agents.createOwnerLink` | `maritime.api.agents.createOwnerLink` | `write` | Mints the owner's 24-hour link to a private agent URL |
| `agents.delete` | `maritime.api.agents.delete` | `destructive` | Delete an agent |
| `agents.desktop.getMode` | `maritime.api.agents.desktop.getMode` | `read` | Get whether an agent's desktop is driven by the agent or taken over by a person |
| `agents.desktop.takeover` | `maritime.api.agents.desktop.takeover` | `write` | Take over or hand back an agent's desktop |
| `agents.desktop.updateConfig` | `maritime.api.agents.desktop.updateConfig` | `write` | Turn the screen capability on/off for an existing agent (owner only) |
| `agents.diagnostic` | `maritime.api.agents.diagnostic` | `read` | Get the current recognized issue for an errored agent, if any |
| `agents.duplicate` | `maritime.api.agents.duplicate` | `destructive` | Create N new agents from this agent's definition (each billed while it exists) |
| `agents.env.create` | `maritime.api.agents.env.create` | `write` | Create or replace one environment variable of an agent |
| `agents.env.delete` | `maritime.api.agents.env.delete` | `destructive` | Delete one environment variable of an agent |
| `agents.env.list` | `maritime.api.agents.env.list` | `read` | List an agent's environment variables (secret values masked) |
| `agents.env.update` | `maritime.api.agents.env.update` | `write` | Update one environment variable of an agent |
| `agents.exec.cancel` | `maritime.api.agents.exec.cancel` | `destructive` | Cancel a running execution; answers with its final result |
| `agents.exec.get` | `maritime.api.agents.exec.get` | `read` | Get an execution started with agents.exec.run: status, exit code and output |
| `agents.exec.run` | `maritime.api.agents.exec.run` | `destructive` | Run a shell command in an agent's machine, attached (waits) or detached (returns an execution id) |
| `agents.files.delete` | `maritime.api.agents.files.delete` | `destructive` | Delete a file or directory (recursive) within the agent's persistent volume |
| `agents.files.download` | `maritime.api.agents.files.download` | `read` | Download a file from an agent's machine by absolute path (returned as a file) |
| `agents.files.list` | `maritime.api.agents.files.list` | `read` | List a directory inside the agent's container (file browser) |
| `agents.files.mkdir` | `maritime.api.agents.files.mkdir` | `write` | Create a directory (mkdir -p) inside the agent's persistent volume |
| `agents.files.move` | `maritime.api.agents.files.move` | `write` | Rename or move a file/directory within the agent's persistent volume |
| `agents.files.upload` | `maritime.api.agents.files.upload` | `write` | Upload a file to an agent's disk (dest_dir) or as a chat attachment |
| `agents.files.write` | `maritime.api.agents.files.write` | `write` | Write text content to a file inside the agent container (workspace editor) |
| `agents.get` | `maritime.api.agents.get` | `read` | Get one agent: status, template, size, URLs and end user |
| `agents.getStopOperation` | `maritime.api.agents.getStopOperation` | `read` | Get the progress of a graceful agent stop |
| `agents.gmail.connect` | `maritime.api.agents.gmail.connect` | `write` | Inject Gmail credentials into the running agent container |
| `agents.gmail.disconnect` | `maritime.api.agents.gmail.disconnect` | `write` | Disconnect Gmail: remove credentials, clean container, delete trigger |
| `agents.gmail.enable` | `maritime.api.agents.gmail.enable` | `write` | Enable Gmail for an agent (older name of agents.gmail.connect) |
| `agents.gmail.status` | `maritime.api.agents.gmail.status` | `read` | Check whether Gmail is connected for this agent |
| `agents.hermes.pairings.allow` | `maritime.api.agents.hermes.pairings.allow` | `write` | Pre-approve a contact by identity |
| `agents.hermes.pairings.approve` | `maritime.api.agents.hermes.pairings.approve` | `write` | Approve a one-time pairing code the contact relayed |
| `agents.hermes.pairings.list` | `maritime.api.agents.hermes.pairings.list` | `read` | Pending pairing requests + approved contacts across all platforms |
| `agents.hermes.pairings.revoke` | `maritime.api.agents.hermes.pairings.revoke` | `write` | Remove a contact from the approved list |
| `agents.inkboxIdentity` | `maritime.api.agents.inkboxIdentity` | `read` | Get the Inkbox identity info (phone number, email) for an agent |
| `agents.invoke` | `maritime.api.agents.invoke` | `destructive` | Post a payload to an agent's invoke URL; it is delivered in the background, waking the agent |
| `agents.list` | `maritime.api.agents.list` | `read` | List your agents |
| `agents.listServers` | `maritime.api.agents.listServers` | `read` | Get active servers for server selection during deploy |
| `agents.llm.calls` | `maritime.api.agents.llm.calls` | `read` | Get the metered LLM calls of the agent with tokens and cost, newest first |
| `agents.llm.deleteSpendLimit` | `maritime.api.agents.llm.deleteSpendLimit` | `destructive` | Removes the agent's own limit, so the agent follows the account default |
| `agents.llm.getSpendLimit` | `maritime.api.agents.llm.getSpendLimit` | `read` | Get the limit that applies to the agent and its spend this month |
| `agents.llm.reset` | `maritime.api.agents.llm.reset` | `destructive` | Replace the agent's OpenAI key with a Maritime proxy token and set the base URL |
| `agents.llm.setSpendLimit` | `maritime.api.agents.llm.setSpendLimit` | `write` | Sets the agent's own monthly limit |
| `agents.llm.status` | `maritime.api.agents.llm.status` | `read` | Check whether the agent is using the Maritime LLM proxy or a custom key |
| `agents.logs` | `maritime.api.agents.logs` | `read` | Read an agent's logs, newest first, filtered by level |
| `agents.maritimeTelegram.connect` | `maritime.api.agents.maritimeTelegram.connect` | `write` | Issue a one-tap deep link the user opens in Telegram |
| `agents.maritimeTelegram.disconnect` | `maritime.api.agents.maritimeTelegram.disconnect` | `destructive` | Remove this agent's binding to the shared Maritime bot |
| `agents.maritimeTelegram.status` | `maritime.api.agents.maritimeTelegram.status` | `read` | Get current binding state: not_connected \| pending \| bound |
| `agents.reloadEnv` | `maritime.api.agents.reloadEnv` | `write` | Applies saved environment variables, starting a parked Agent when necessary |
| `agents.resetToUpstream` | `maritime.api.agents.resetToUpstream` | `destructive` | Requests a fresh upstream root while preserving the assigned /data volume |
| `agents.resize` | `maritime.api.agents.resize` | `destructive` | Change an agent's RAM / SSD allocation or always-on state |
| `agents.restart` | `maritime.api.agents.restart` | `destructive` | Get the Agent after the configured restart operation completes |
| `agents.setVisibility` | `maritime.api.agents.setVisibility` | `write` | Sets who may open the agent URL: ``private`` or ``public`` |
| `agents.shareLinks.create` | `maritime.api.agents.shareLinks.create` | `write` | Mints a shared link |
| `agents.shareLinks.list` | `maritime.api.agents.shareLinks.list` | `read` | Lists the agent's live links without their secrets |
| `agents.shareLinks.revoke` | `maritime.api.agents.shareLinks.revoke` | `destructive` | Revokes one link |
| `agents.shareLinks.revokeForEndUser` | `maritime.api.agents.shareLinks.revokeForEndUser` | `destructive` | Revokes every live link of the agent bound to the end user and returns the count |
| `agents.signedWebhook.delete` | `maritime.api.agents.signedWebhook.delete` | `destructive` | Removes the agent's signed webhook address |
| `agents.signedWebhook.get` | `maritime.api.agents.signedWebhook.get` | `read` | Get the agent's signed webhook address |
| `agents.signedWebhook.set` | `maritime.api.agents.signedWebhook.set` | `write` | Sets the agent's one signed webhook address |
| `agents.skills.delete` | `maritime.api.agents.skills.delete` | `destructive` | Remove an installed skill (workspace or managed dir) and drop its lines from the dependency manifest |
| `agents.skills.export` | `maritime.api.agents.skills.export` | `read` | Download an installed skill as a .tar.gz: the other half of upload |
| `agents.skills.install` | `maritime.api.agents.skills.install` | `write` | Install a skill from ClawHub on an agent |
| `agents.skills.list` | `maritime.api.agents.skills.list` | `read` | Enumerate OpenClaw skills available in this agent's runtime |
| `agents.skills.search` | `maritime.api.agents.skills.search` | `read` | Search the framework's community registry server-side: ClawHub (clawhub.ai) for openclaw-family agents, skills.sh for hermes-family |
| `agents.skills.setAllowlist` | `maritime.api.agents.skills.setAllowlist` | `write` | Set the per-agent skill toggle state inside the running container |
| `agents.skills.setEnv` | `maritime.api.agents.skills.setEnv` | `write` | Upsert env vars for skills that gate on them (NOTION_API_KEY, GOOGLE_PLACES_API_KEY, …) and trigger a container restart so the agent's gateway picks them up |
| `agents.skills.upload` | `maritime.api.agents.skills.upload` | `write` | Install a CUSTOM skill from an uploaded archive, then run the same just-works pipeline as /skills/install (env apply, binary auto-resolve, final-state report) |
| `agents.sleep` | `maritime.api.agents.sleep` | `destructive` | Put an agent to sleep now (it wakes on the next message, webhook or trigger) |
| `agents.start` | `maritime.api.agents.start` | `destructive` | Start a stopped agent (billed while it runs) |
| `agents.stats` | `maritime.api.agents.stats` | `read` | Get an agent's CPU, memory and disk use |
| `agents.stop` | `maritime.api.agents.stop` | `destructive` | Stops immediately or accepts a graceful stop for the Agent's current boot |
| `agents.triggers.create` | `maritime.api.agents.triggers.create` | `write` | Create a trigger that wakes an agent on a schedule or event |
| `agents.triggers.delete` | `maritime.api.agents.triggers.delete` | `destructive` | Delete one of an agent's triggers |
| `agents.triggers.list` | `maritime.api.agents.triggers.list` | `read` | List an agent's triggers |
| `agents.triggers.update` | `maritime.api.agents.triggers.update` | `write` | Update one of an agent's triggers |
| `agents.update` | `maritime.api.agents.update` | `write` | Update agent metadata |
| `agents.webhookToken.get` | `maritime.api.agents.webhookToken.get` | `read` | Get the invoke token for an agent you own, plus a ready-to-use URL |
| `agents.webhookToken.rotate` | `maritime.api.agents.webhookToken.rotate` | `destructive` | Replaces the agent's invoke token with a new stored secret |
| `agents.whatsapp.cancel` | `maritime.api.agents.whatsapp.cancel` | `write` | Cancel the WhatsApp linking that agents.whatsapp.start began |
| `agents.whatsapp.log` | `maritime.api.agents.whatsapp.log` | `read` | Get the last ~4KB of helper stdout/stderr for debugging |
| `agents.whatsapp.pairings.approve` | `maritime.api.agents.whatsapp.pairings.approve` | `write` | Approve a WhatsApp contact asking to talk to an agent, by pairing code |
| `agents.whatsapp.pairings.deny` | `maritime.api.agents.whatsapp.pairings.deny` | `write` | Deny a WhatsApp contact asking to talk to an agent, by pairing code |
| `agents.whatsapp.pairings.list` | `maritime.api.agents.whatsapp.pairings.list` | `read` | Get the WhatsApp pending pairing list + current allowlist |
| `agents.whatsapp.start` | `maritime.api.agents.whatsapp.start` | `write` | Start linking a WhatsApp number to an agent (returns the QR or pairing step) |
| `agents.whatsapp.status` | `maritime.api.agents.whatsapp.status` | `read` | Get the state of an agent's WhatsApp link |
| `agentTemplates.list` | `maritime.api.agentTemplates.list` | `read` | List the agent templates (OpenClaw, Hermes, Codex, Claude Code ...) agents.create takes as templateId; public |
| `apiKeys.create` | `maritime.api.apiKeys.create` | `destructive` | Create a new API key |
| `apiKeys.list` | `maritime.api.apiKeys.list` | `read` | List the account's API keys with their scopes (no secrets) |
| `apiKeys.revoke` | `maritime.api.apiKeys.revoke` | `destructive` | Revoke an account API key; it stops working at once |
| `appium.sessions.get` | `maritime.api.appium.sessions.get` | `read` | One session with download URLs of its video, logcat and command log, valid for one hour |
| `appium.sessions.list` | `maritime.api.appium.sessions.list` | `read` | The account's Appium sessions, newest first, of one phone when ``computerId`` is given |
| `apps.delete` | `maritime.api.apps.delete` | `destructive` | Deletes the app and its file |
| `apps.get` | `maritime.api.apps.get` | `read` | One app of the account |
| `apps.list` | `maritime.api.apps.list` | `read` | The account's apps, newest first |
| `apps.upload` | `maritime.api.apps.upload` | `write` | Stores the APK in the multipart field ``file`` (at most 1 GiB) |
| `billing.agentPay.createLink` | `maritime.api.billing.agentPay.createLink` | `destructive` | A short-lived link an agent pays at with an MPP client, for example ``link-cli mpp pay <payUrl> -X POST`` |
| `billing.agentPay.pay` | `maritime.api.billing.agentPay.pay` | `destructive` | The MPP endpoint: 402 with a Stripe Challenge, or, with a Credential in ``Authorization: Payment ...``, charge the SPT and start the plan |
| `billing.agents` | `maritime.api.billing.agents` | `read` | Get this billing period cost per agent |
| `billing.cancelSwitchToUsage` | `maritime.api.billing.cancelSwitchToUsage` | `destructive` | Cancel a pending switch to usage billing |
| `billing.config` | `maritime.api.billing.config` | `read` | Get the live price list Maritime bills with |
| `billing.machineTypes` | `maritime.api.billing.machineTypes` | `read` | List machine types with their prices |
| `billing.meteredUsage` | `maritime.api.billing.meteredUsage` | `read` | Get this billing period: plan credit, cents used, overage, and usage by machine type and machine |
| `billing.plan.change` | `maritime.api.billing.plan.change` | `destructive` | Change the selected plan under the ordinary checkout rules |
| `billing.plan.changeWithTrial` | `maritime.api.billing.plan.changeWithTrial` | `destructive` | Open Starter Checkout only while a trial is still available |
| `billing.plan.preview` | `maritime.api.billing.plan.preview` | `read` | What picking ``plan`` would do now: charge today, discount, awake limit and the sentence to show before confirming |
| `billing.plan.resume` | `maritime.api.billing.plan.resume` | `destructive` | Resume a plan that was set to cancel (charges the plan fee) |
| `billing.retryPayment` | `maritime.api.billing.retryPayment` | `destructive` | Pays a past-due plan's open invoice now with the card on file |
| `billing.summary` | `maritime.api.billing.summary` | `read` | Get the billing summary: agents, cost and compute minutes this period |
| `billing.switchToUsage` | `maritime.api.billing.switchToUsage` | `destructive` | A seat-plan account moves to a usage plan at its seat period end |
| `billing.trial.cancel` | `maritime.api.billing.trial.cancel` | `destructive` | Cancel the free trial |
| `billing.trial.get` | `maritime.api.billing.trial.get` | `read` | Get the free trial state |
| `billing.trial.start` | `maritime.api.billing.trial.start` | `destructive` | Start the 7-day free trial (needs a card on file) |
| `billing.usage` | `maritime.api.billing.usage` | `read` | Get raw usage data for the current billing period |
| `computers.actions` | `maritime.api.computers.actions` | `destructive` | Run one action (screenshot, click, type, key, scroll ...) or a batch on a computer; wakes it |
| `computers.completeTakeover` | `maritime.api.computers.completeTakeover` | `write` | Hand control back to the agent (viewer token, control mode) |
| `computers.create` | `maritime.api.computers.create` | `destructive` | Get or create the computer (Linux or Windows desktop, Android phone) of one end user; billed while awake |
| `computers.createViewer` | `maritime.api.computers.createViewer` | `write` | Mint a viewer link (watch or control) |
| `computers.delete` | `maritime.api.computers.delete` | `destructive` | Delete a computer, its volume, and its snapshots |
| `computers.exec` | `maritime.api.computers.exec` | `destructive` | Run a shell command inside the computer |
| `computers.files.list` | `maritime.api.computers.files.list` | `read` | List a directory on a computer's disk |
| `computers.files.read` | `maritime.api.computers.files.read` | `read` | Read a file (raw bytes) |
| `computers.files.write` | `maritime.api.computers.files.write` | `write` | Write a file (raw body) |
| `computers.get` | `maritime.api.computers.get` | `read` | Get one computer: OS, state, end user and screen |
| `computers.installApp` | `maritime.api.computers.installApp` | `write` | Runs ``adb install -r`` (with ``-g`` unless ``grantPermissions`` is false) on the phone |
| `computers.list` | `maritime.api.computers.list` | `read` | List computers, optionally for one end user |
| `computers.screenshot` | `maritime.api.computers.screenshot` | `read` | Screenshot as image bytes (returned as a file) |
| `computers.sessions.close` | `maritime.api.computers.sessions.close` | `destructive` | Close the open session (30 s grace before sleep) |
| `computers.sessions.list` | `maritime.api.computers.sessions.list` | `read` | List a computer's recent sessions (invocations) |
| `computers.sleep` | `maritime.api.computers.sleep` | `destructive` | Sleep a computer (closes the open session) |
| `computers.tools.call` | `maritime.api.computers.tools.call` | `destructive` | Run one read-only tool deployed to a computer |
| `computers.tools.list` | `maritime.api.computers.tools.list` | `read` | List a computer's tools with their input schemas and the tool server's state |
| `computers.usage` | `maritime.api.computers.usage` | `read` | Invocation usage for a period |
| `computers.wake` | `maritime.api.computers.wake` | `destructive` | Wake a computer (free; opens no session) |
| `deletedAgents.get` | `maritime.api.deletedAgents.get` | `read` | One deleted agent's history |
| `deletedAgents.list` | `maritime.api.deletedAgents.list` | `read` | The caller's deleted agents with this external id, newest first |
| `deployments.cancel` | `maritime.api.deployments.cancel` | `destructive` | Persist cancellation intent for the worker instead of cancelling a request task |
| `deployments.create` | `maritime.api.deployments.create` | `destructive` | Queues a deployment after checking agent and uploaded-archive ownership |
| `deployments.get` | `maritime.api.deployments.get` | `read` | Get one deployment with its status and build log |
| `deployments.list` | `maritime.api.deployments.list` | `read` | List all deployments for the current user's agents |
| `deployments.listForAgent` | `maritime.api.deployments.listForAgent` | `read` | List deployments for a specific agent, including build logs |
| `deployments.uploadZip` | `maritime.api.deployments.uploadZip` | `write` | Upload a ZIP file of source code for agent deployment |
| `domains.check` | `maritime.api.domains.check` | `read` | Asks the edge for the domain's state now, instead of waiting for the next minute's check |
| `domains.create` | `maritime.api.domains.create` | `write` | Adds a domain and returns the DNS records to create |
| `domains.delete` | `maritime.api.domains.delete` | `destructive` | Stops serving the domain at once and detaches it from the edge |
| `domains.get` | `maritime.api.domains.get` | `read` | Get one domain as last checked |
| `domains.labels.delete` | `maritime.api.domains.labels.delete` | `destructive` | Removes a label |
| `domains.labels.list` | `maritime.api.domains.labels.list` | `read` | Lists the names under a wildcard domain, agents' and sandbox ports' |
| `domains.labels.set` | `maritime.api.domains.labels.set` | `write` | Names an agent, or a sandbox's port, ``<label>.<base>`` |
| `domains.list` | `maritime.api.domains.list` | `read` | Lists the account's domains, optionally only those of one agent |
| `endUsers.activity` | `maritime.api.endUsers.activity` | `read` | Get the end user's recent activity, newest first: messages, wakes, sleeps, agent creates |
| `endUsers.agents.create` | `maritime.api.endUsers.agents.create` | `destructive` | Creates the end user's agent, exactly once |
| `endUsers.agents.list` | `maritime.api.endUsers.agents.list` | `read` | Get the end user's agents in the full agent shape |
| `endUsers.delete` | `maritime.api.endUsers.delete` | `destructive` | Deletes the end user and every agent it owns, with their data |
| `endUsers.get` | `maritime.api.endUsers.get` | `read` | Get one end user with its agents and access rollups |
| `endUsers.list` | `maritime.api.endUsers.list` | `read` | Lists the account's end users one page at a time, newest first unless sorted by activity |
| `endUsers.policy.delete` | `maritime.api.endUsers.policy.delete` | `destructive` | Removes the policy |
| `endUsers.policy.get` | `maritime.api.endUsers.policy.get` | `read` | Get the end user's policy, or null when none is set |
| `endUsers.policy.set` | `maritime.api.endUsers.policy.set` | `write` | Replaces the end user's policy and applies it to every agent it owns now |
| `endUsers.resume` | `maritime.api.endUsers.resume` | `write` | Makes a suspended end user active again |
| `endUsers.summary` | `maritime.api.endUsers.summary` | `read` | Get the account's users now and per UTC day: total, new, active, messages, people using it, and AI spend |
| `endUsers.suspend` | `maritime.api.endUsers.suspend` | `destructive` | Suspends the end user: its agents go to sleep and refuse wakes and LLM calls |
| `endUsers.tokens.create` | `maritime.api.endUsers.tokens.create` | `destructive` | Mints a short-lived token the end user's own client uses to reach one of its agents |
| `endUsers.tokens.revoke` | `maritime.api.endUsers.tokens.revoke` | `destructive` | Revokes every live token of the end user |
| `endUsers.upsert` | `maritime.api.endUsers.upsert` | `write` | Creates the end user, or updates the fields sent |
| `feedback.create` | `maritime.api.feedback.create` | `destructive` | Send a report to Maritime's founders (docs, SDK, API, CLI ...); 5 a minute, 20 a day |
| `feedback.list` | `maritime.api.feedback.list` | `read` | Lists the calling account's most recent reports, newest first |
| `fleet.activity` | `maritime.api.fleet.activity` | `read` | Per-agent activity over a recent window |
| `fleet.batchCreate` | `maritime.api.fleet.batchCreate` | `destructive` | Spin up N identical agents named {prefix}-1..N |
| `fleet.overview` | `maritime.api.fleet.overview` | `read` | Summary + the full agent list in one call |
| `fleet.propagate` | `maritime.api.fleet.propagate` | `write` | Write one file into many of the caller's agents; optionally restart them |
| `fleet.summary` | `maritime.api.fleet.summary` | `read` | Get the health and usage summary of the account's agents |
| `health.check` | `maritime.api.health.check` | `read` | Check that the Maritime API is up (no key needed) |
| `llmSpendLimit.deleteDefault` | `maritime.api.llmSpendLimit.deleteDefault` | `destructive` | Removes the account default |
| `llmSpendLimit.getDefault` | `maritime.api.llmSpendLimit.getDefault` | `read` | Get the account default |
| `llmSpendLimit.setDefault` | `maritime.api.llmSpendLimit.setDefault` | `write` | Sets the monthly limit for each agent that has no limit of its own |
| `logs.list` | `maritime.api.logs.list` | `read` | Get log entries across all agents owned by the current user |
| `network.activity` | `maritime.api.network.activity` | `read` | Lists connections through Maritime Networks, newest first |
| `network.install.get` | `maritime.api.network.install.get` | `read` | Describes an install link for the IT person who runs it |
| `network.install.unixScript` | `maritime.api.network.install.unixScript` | `read` | Get the macOS and Linux install script for an install link |
| `network.install.windowsScript` | `maritime.api.network.install.windowsScript` | `read` | Get the Windows install script for an install link |
| `network.presets.create` | `maritime.api.network.presets.create` | `write` | Creates an account preset |
| `network.presets.delete` | `maritime.api.network.presets.delete` | `destructive` | Deletes an account preset no workload uses |
| `network.presets.list` | `maritime.api.network.presets.list` | `read` | Lists the presets the account may use, built-ins first |
| `network.presets.update` | `maritime.api.network.presets.update` | `write` | Changes the given parts of an account preset |
| `network.privateNetworks.addResource` | `maritime.api.network.privateNetworks.addResource` | `write` | Adds a resource to a network |
| `network.privateNetworks.create` | `maritime.api.network.privateNetworks.create` | `write` | Creates a network |
| `network.privateNetworks.createInstall` | `maritime.api.network.privateNetworks.createInstall` | `write` | Makes a new one-time install link for a network |
| `network.privateNetworks.delete` | `maritime.api.network.privateNetworks.delete` | `destructive` | Deletes a network and everything in it |
| `network.privateNetworks.deleteResource` | `maritime.api.network.privateNetworks.deleteResource` | `destructive` | Deletes a resource and every grant to it |
| `network.privateNetworks.list` | `maritime.api.network.privateNetworks.list` | `read` | Lists the account's networks |
| `network.privateNetworks.update` | `maritime.api.network.privateNetworks.update` | `write` | Renames a network or changes its cut off |
| `network.settings.get` | `maritime.api.network.settings.get` | `read` | Get the account-wide network settings |
| `network.settings.update` | `maritime.api.network.settings.update` | `write` | Changes the account-wide network settings that were given |
| `network.workloads.get` | `maritime.api.network.workloads.get` | `read` | Get a workload's network settings |
| `network.workloads.newIp` | `maritime.api.network.workloads.newIp` | `write` | Starts a new sticky residential session, so the workload's next connection gets a new IP |
| `network.workloads.test` | `maritime.api.network.workloads.test` | `read` | Tries one TCP connection from inside the workload and says what to fix when it fails |
| `network.workloads.update` | `maritime.api.network.workloads.update` | `write` | Changes the resources a workload may reach, its internet policy, its exit, or its cut off |
| `notifications.list` | `maritime.api.notifications.list` | `read` | List the account's notifications |
| `notifications.markRead` | `maritime.api.notifications.markRead` | `write` | Mark one notification read |
| `notifications.readAll` | `maritime.api.notifications.readAll` | `write` | Mark every notification read |
| `notifications.unreadCount` | `maritime.api.notifications.unreadCount` | `read` | Count unread notifications |
| `organizations.create` | `maritime.api.organizations.create` | `write` | Create the caller's organization: their account, shared with the people they invite |
| `organizations.delete` | `maritime.api.organizations.delete` | `destructive` | Delete the organization |
| `organizations.invites.accept` | `maritime.api.organizations.invites.accept` | `destructive` | Accept an invite as the signed in person |
| `organizations.invites.create` | `maritime.api.organizations.invites.create` | `destructive` | Invite one email |
| `organizations.invites.list` | `maritime.api.organizations.invites.list` | `read` | List an organization's open invites |
| `organizations.invites.preview` | `maritime.api.organizations.invites.preview` | `read` | Who invited you where |
| `organizations.invites.resend` | `maritime.api.organizations.invites.resend` | `destructive` | Email an organization invite again |
| `organizations.invites.revoke` | `maritime.api.organizations.invites.revoke` | `destructive` | Revoke an organization invite |
| `organizations.leave` | `maritime.api.organizations.leave` | `destructive` | Leave an organization |
| `organizations.me` | `maritime.api.organizations.me` | `read` | The person, the organization they act in, the one they own, and the others they belong to |
| `organizations.members.changeRole` | `maritime.api.organizations.members.changeRole` | `write` | Change a member's role in an organization |
| `organizations.members.list` | `maritime.api.organizations.members.list` | `read` | List an organization's members |
| `organizations.members.remove` | `maritime.api.organizations.members.remove` | `destructive` | Remove a member |
| `organizations.rename` | `maritime.api.organizations.rename` | `write` | Rename the organization |
| `plans.cancel` | `maritime.api.plans.cancel` | `destructive` | Cancel at period end (Stripe cancel_at_period_end) |
| `plans.launchPromo` | `maritime.api.plans.launchPromo` | `read` | Public: whether the launch credit ($100 of AI credits for the first paid plans) is still open and how many spots remain |
| `plans.list` | `maritime.api.plans.list` | `read` | The catalog plus this account's plan state |
| `plans.portal` | `maritime.api.plans.portal` | `destructive` | Stripe Customer Portal session: update the card, browse invoices |
| `plans.subscribe` | `maritime.api.plans.subscribe` | `destructive` | Start a plan (returns a Stripe Checkout URL that collects the card), or switch/resume in place when a live subscription exists |
| `preferences.get` | `maritime.api.preferences.get` | `read` | Get the signed-in user's preferences |
| `preferences.update` | `maritime.api.preferences.update` | `write` | Update the signed-in user's preferences |
| `projects.bindings.list` | `maritime.api.projects.bindings.list` | `read` | List a project's bindings of end users to agent instances |
| `projects.bindings.reassign` | `maritime.api.projects.bindings.reassign` | `write` | Move a binding to another agent instance |
| `projects.bindings.unbind` | `maritime.api.projects.bindings.unbind` | `destructive` | Remove a binding from a project |
| `projects.claimCodes.create` | `maritime.api.projects.claimCodes.create` | `write` | Create claim codes end users redeem to get their own agent instance |
| `projects.claimCodes.list` | `maritime.api.projects.claimCodes.list` | `read` | List a project's claim codes |
| `projects.get` | `maritime.api.projects.get` | `read` | Get one project (a front door that gives each end user an agent instance) |
| `projects.list` | `maritime.api.projects.list` | `read` | The user's projects with rollups: the primary list surface |
| `projects.messages.get` | `maritime.api.projects.messages.get` | `read` | Get a message sent to a project and its reply |
| `projects.messages.send` | `maritime.api.projects.messages.send` | `destructive` | Send a message to an end user's agent through a project |
| `projects.syncInstances` | `maritime.api.projects.syncInstances` | `write` | Push a project's source agent env to every instance and reload them |
| `projects.telegram.connect` | `maritime.api.projects.telegram.connect` | `write` | Point a Telegram bot at this project: validate via getMe, register the webhook, upsert the channel row |
| `projects.telegram.disconnect` | `maritime.api.projects.telegram.disconnect` | `destructive` | Disconnect a project's Telegram bot |
| `projects.update` | `maritime.api.projects.update` | `write` | Update a project's settings |
| `projects.usage` | `maritime.api.projects.usage` | `read` | Get what each end user's agent instance cost over the last 30 days |
| `projects.users.get` | `maritime.api.projects.users.get` | `read` | Get one end user of a project and their agent |
| `projects.users.list` | `maritime.api.projects.users.list` | `read` | The project's end-user list: every identity bound via the HTTP front door |
| `projects.users.unbind` | `maritime.api.projects.users.unbind` | `destructive` | Unbind an end-user |
| `sandboxes.code.run` | `maritime.api.sandboxes.code.run` | `destructive` | Run python in a persistent kernel on a code-interpreter sandbox |
| `sandboxes.commands.get` | `maritime.api.sandboxes.commands.get` | `read` | Get a command and its output |
| `sandboxes.commands.history` | `maritime.api.sandboxes.commands.history` | `read` | Get ``{ data }`` with recent commands from the host, newest first |
| `sandboxes.commands.kill` | `maritime.api.sandboxes.commands.kill` | `destructive` | Kill a running command in a virtual machine (SIGTERM, then SIGKILL after 10 s) |
| `sandboxes.commands.run` | `maritime.api.sandboxes.commands.run` | `destructive` | Run a command in a virtual machine and get exitCode, stdout and stderr (or a command id with background) |
| `sandboxes.create` | `maritime.api.sandboxes.create` | `destructive` | Create a virtual machine (sbx-...) from a snapshot, template or image, or return the live one with the same name; billed per second while running |
| `sandboxes.createScreenViewer` | `maritime.api.sandboxes.createScreenViewer` | `write` | Get ``{ url }`` of a screen viewer that works for one hour |
| `sandboxes.createUrl` | `maritime.api.sandboxes.createUrl` | `write` | Get ``{ url }`` for one port, private with the URL token or public |
| `sandboxes.ephemeral.create` | `maritime.api.sandboxes.ephemeral.create` | `destructive` | Create a virtual machine that ends with its disk after idleMinutes without activity or at timeLimitMinutes; billed per second |
| `sandboxes.ephemeral.extend` | `maritime.api.sandboxes.ephemeral.extend` | `destructive` | Restarts the sandbox's time limit from now: ``timeLimitMinutes`` (or ``lifetimeMinutes``) more |
| `sandboxes.ephemeral.kill` | `maritime.api.sandboxes.ephemeral.kill` | `destructive` | Ends the sandbox now |
| `sandboxes.ephemeral.list` | `maritime.api.sandboxes.ephemeral.list` | `read` | Lists the sandboxes that have not ended, newest first, as ``{ sandboxes, nextCursor }`` |
| `sandboxes.files.delete` | `maritime.api.sandboxes.files.delete` | `destructive` | Remove a file, or a directory with recursive |
| `sandboxes.files.list` | `maritime.api.sandboxes.files.list` | `read` | List one directory of a sandbox (not recursive) |
| `sandboxes.files.read` | `maritime.api.sandboxes.files.read` | `read` | Read a file from a virtual machine's disk (returned as a file) |
| `sandboxes.files.write` | `maritime.api.sandboxes.files.write` | `write` | Create or replace a file on a sandbox's disk |
| `sandboxes.get` | `maritime.api.sandboxes.get` | `read` | Get one sandbox by id or name |
| `sandboxes.info` | `maritime.api.sandboxes.info` | `read` | Get Sandbox info read from the host |
| `sandboxes.kill` | `maritime.api.sandboxes.kill` | `destructive` | End a virtual machine and delete its disk |
| `sandboxes.list` | `maritime.api.sandboxes.list` | `read` | Lists the account's sandboxes, newest first, as ``{ data, nextCursor }`` |
| `sandboxes.pause` | `maritime.api.sandboxes.pause` | `write` | Pauses the sandbox and returns it once paused |
| `sandboxes.promote` | `maritime.api.sandboxes.promote` | `destructive` | Promote a virtual machine to a kept agent box (Maritime answers 501 promote_unavailable in API version 1) |
| `sandboxes.rotateSecret` | `maritime.api.sandboxes.rotateSecret` | `destructive` | Replaces the sandbox secret and URL token and returns the Sandbox object |
| `sandboxes.save` | `maritime.api.sandboxes.save` | `write` | Saves a snapshot of the sandbox under ``name`` |
| `sandboxes.update` | `maritime.api.sandboxes.update` | `write` | Changes metadata, the idle timer, keepAwake, or the network policy |
| `sandboxes.usage` | `maritime.api.sandboxes.usage` | `read` | Get what the sandbox uses now, measured by its host |
| `sandboxKeys.create` | `maritime.api.sandboxKeys.create` | `destructive` | Creates a per-sandbox key; the secret is returned only here |
| `sandboxKeys.list` | `maritime.api.sandboxKeys.list` | `read` | Lists per-sandbox keys without secrets |
| `sandboxKeys.revoke` | `maritime.api.sandboxKeys.revoke` | `destructive` | Revokes a per-sandbox key and rotates its sandbox's secrets |
| `sandboxWebhooks.create` | `maritime.api.sandboxWebhooks.create` | `write` | Register an https URL for virtual machine events (the signing secret is returned once) |
| `sandboxWebhooks.delete` | `maritime.api.sandboxWebhooks.delete` | `destructive` | Deletes a webhook endpoint |
| `sandboxWebhooks.deliveries` | `maritime.api.sandboxWebhooks.deliveries` | `read` | Lists one endpoint's deliveries from the last 30 days |
| `sandboxWebhooks.list` | `maritime.api.sandboxWebhooks.list` | `read` | Lists webhook endpoints without secrets, paged |
| `secrets.delete` | `maritime.api.secrets.delete` | `destructive` | Deletes an account secret |
| `secrets.list` | `maritime.api.secrets.list` | `read` | Lists account secret names, paged |
| `secrets.set` | `maritime.api.secrets.set` | `write` | Creates or replaces an account secret |
| `servers.list` | `maritime.api.servers.list` | `read` | The swarm servers, whether each is free, yours or rented by someone else, and your open lease |
| `servers.release` | `maritime.api.servers.release` | `destructive` | Release the rented swarm server; billing stops and every virtual machine on it ends |
| `servers.rent` | `maritime.api.servers.rent` | `destructive` | Rent a whole swarm server for this account ($1 a minute while rented, billed per second) |
| `snapshots.delete` | `maritime.api.snapshots.delete` | `destructive` | Deletes a saved snapshot |
| `snapshots.get` | `maritime.api.snapshots.get` | `read` | Get one saved snapshot or stock template |
| `snapshots.list` | `maritime.api.snapshots.list` | `read` | Lists saved snapshots and stock templates |
| `stripe.createPortalSession` | `maritime.api.stripe.createPortalSession` | `destructive` | Create a Stripe Customer Portal session |
| `stripe.invoices` | `maritime.api.stripe.invoices` | `read` | List invoices for the current user, each labeled with its product |
| `stripe.paymentMethods` | `maritime.api.stripe.paymentMethods` | `read` | List payment methods for the current user |
| `stripe.subscriptions.cancel` | `maritime.api.stripe.subscriptions.cancel` | `destructive` | Cancel a subscription |
| `stripe.subscriptions.list` | `maritime.api.stripe.subscriptions.list` | `read` | List subscriptions for the current user |
| `swarms.cancel` | `maritime.api.swarms.cancel` | `destructive` | Cancel swarm |
| `swarms.create` | `maritime.api.swarms.create` | `destructive` | Start a swarm: many virtual machines running one command on a rented swarm server ($1 a minute while rented; Scale plan and up) |
| `swarms.get` | `maritime.api.swarms.get` | `read` | One run with every sandbox's status, exit code and output tail |
| `swarms.getAccess` | `maritime.api.swarms.getAccess` | `read` | Whether the account may start swarms, and when it asked for access |
| `swarms.list` | `maritime.api.swarms.list` | `read` | The account's runs, newest first, with progress and cost |
| `swarms.requestAccess` | `maritime.api.swarms.requestAccess` | `write` | Asks for Swarms |
| `swarms.results` | `maritime.api.swarms.results` | `read` | Every sandbox's outcome as JSON Lines, one sandbox per line, in input order |
| `templates.create` | `maritime.api.templates.create` | `destructive` | Registers a customer template and starts its build (201, usually ``building``) |
| `templates.delete` | `maritime.api.templates.delete` | `destructive` | Deletes a customer template and frees its name |
| `templates.get` | `maritime.api.templates.get` | `read` | Get one customer or stock template |
| `templates.list` | `maritime.api.templates.list` | `read` | Lists the account's templates, newest first, then the stock templates, as ``{ data, nextCursor }`` |
| `usage.daily` | `maritime.api.usage.daily` | `read` | The account's cost by day: hosting (the usage ledger on a usage plan, allocated under a seat plan, else debits), LLM, minutes |
| `usage.report` | `maritime.api.usage.report` | `read` | Get the usage report for the last 30 days: compute minutes and hosting, LLM and total cost, per agent |
| `usage.sandboxes` | `maritime.api.usage.sandboxes` | `read` | Lists usage records that overlap ``from`` to ``to``, oldest first |
| `wallet.apiUsage` | `maritime.api.wallet.apiUsage` | `read` | The AI credits of the account: budget, lifetime spend, what is left, and the unexpired welcome credit (``welcomeCredit``, None once spent or lapsed) |
| `wallet.autoRecharge.get` | `maritime.api.wallet.autoRecharge.get` | `read` | Get the wallet's auto-recharge setting |
| `wallet.autoRecharge.set` | `maritime.api.wallet.autoRecharge.set` | `destructive` | Configure auto-recharge: below thresholdCents, charge the saved card for amountCents (max 3x/24h, 6h backoff after a failed charge) |
| `wallet.balance` | `maritime.api.wallet.balance` | `read` | Get current wallet balance |
| `wallet.browserUsage` | `maritime.api.wallet.browserUsage` | `read` | Browser session usage + rate for the authenticated user |
| `wallet.checkDeployBalance` | `maritime.api.wallet.checkDeployBalance` | `read` | Check if user has sufficient balance to deploy an agent |
| `wallet.claimSignupBonus` | `maritime.api.wallet.claimSignupBonus` | `destructive` | One-time $10 OpenClaw signup bonus |
| `wallet.paymentMethod` | `maritime.api.wallet.paymentMethod` | `read` | Saved-card status for the billing page |
| `wallet.planUsage` | `maritime.api.wallet.planUsage` | `read` | Current plan + this user's aggregate usage against its limits |
| `wallet.purchaseApiCredits` | `maritime.api.wallet.purchaseApiCredits` | `destructive` | Creates a Stripe Checkout session that buys AI credits |
| `wallet.redeemPromo` | `maritime.api.wallet.redeemPromo` | `destructive` | Redeem promo |
| `wallet.topup` | `maritime.api.wallet.topup` | `destructive` | Create a Stripe Checkout session for wallet top-up (one-time payment) |
| `wallet.transactions` | `maritime.api.wallet.transactions` | `read` | Get wallet transaction history |
| `wallet.validatePromoCode` | `maritime.api.wallet.validatePromoCode` | `read` | Validate promo code |
| `webhooks.create` | `maritime.api.webhooks.create` | `write` | Subscribe an https URL to agent, message, exec and end-user events (the signing secret is returned once) |
| `webhooks.delete` | `maritime.api.webhooks.delete` | `destructive` | Delete a webhook subscription |
| `webhooks.deliveries.list` | `maritime.api.webhooks.deliveries.list` | `read` | The delivery log of one subscription, newest first |
| `webhooks.deliveries.replay` | `maritime.api.webhooks.deliveries.replay` | `destructive` | Sends one delivery again now, whatever its state, and returns the result |
| `webhooks.list` | `maritime.api.webhooks.list` | `read` | List the account's webhook subscriptions |
| `webhooks.test` | `maritime.api.webhooks.test` | `destructive` | Deliver a synthetic `ping` event to the subscription and return the result |
| `webhooks.update` | `maritime.api.webhooks.update` | `write` | Update a webhook subscription: URL, events, or isActive (true re-enables it and resets the failure count) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 21 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/maritime

## License

Apache-2.0
