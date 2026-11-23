// Generated with endpoints/operation-types.ts from Amika's OpenAPI spec:
// one entry per operation in amika-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { amikaSchemaEntry } from './openapi-schema';
import { createAmikaOperation as op } from './operations';

export const amikaEndpointsNested = {
	agentCredentials: {
		claude: {
			check: op('agentCredentials.claude.check'),
			create: op('agentCredentials.claude.create'),
			delete: op('agentCredentials.claude.delete'),
			list: op('agentCredentials.claude.list'),
		},
		codex: {
			create: op('agentCredentials.codex.create'),
			delete: op('agentCredentials.codex.delete'),
			list: op('agentCredentials.codex.list'),
		},
		pi: {
			delete: op('agentCredentials.pi.delete'),
			get: op('agentCredentials.pi.get'),
			set: op('agentCredentials.pi.set'),
		},
	},
	agentSessions: {
		get: op('agentSessions.get'),
		list: op('agentSessions.list'),
		send: op('agentSessions.send'),
	},
	apiKeys: {
		create: op('apiKeys.create'),
		delete: op('apiKeys.delete'),
		list: op('apiKeys.list'),
	},
	cloudAccounts: {
		create: op('cloudAccounts.create'),
		delete: op('cloudAccounts.delete'),
		get: op('cloudAccounts.get'),
		list: op('cloudAccounts.list'),
		listSizes: op('cloudAccounts.listSizes'),
		update: op('cloudAccounts.update'),
	},
	commandRuns: {
		cancel: op('commandRuns.cancel'),
		create: op('commandRuns.create'),
		get: op('commandRuns.get'),
		list: op('commandRuns.list'),
		listEvents: op('commandRuns.listEvents'),
	},
	gitUserSettings: {
		get: op('gitUserSettings.get'),
		set: op('gitUserSettings.set'),
	},
	hosts: {
		checkHealth: op('hosts.checkHealth'),
		create: op('hosts.create'),
		delete: op('hosts.delete'),
		enrol: op('hosts.enrol'),
		get: op('hosts.get'),
		list: op('hosts.list'),
		replace: op('hosts.replace'),
	},
	integrations: {
		disconnect: op('integrations.disconnect'),
		list: op('integrations.list'),
	},
	jobRuns: {
		cancel: op('jobRuns.cancel'),
		get: op('jobRuns.get'),
		list: op('jobRuns.list'),
		start: op('jobRuns.start'),
	},
	jobs: {
		create: op('jobs.create'),
		delete: op('jobs.delete'),
		get: op('jobs.get'),
		list: op('jobs.list'),
		update: op('jobs.update'),
	},
	linear: {
		settings: {
			get: op('linear.settings.get'),
			set: op('linear.settings.set'),
		},
	},
	repositories: {
		clearImage: op('repositories.clearImage'),
		get: op('repositories.get'),
		integrations: {
			list: op('repositories.integrations.list'),
			set: op('repositories.integrations.set'),
		},
		list: op('repositories.list'),
		upsert: op('repositories.upsert'),
	},
	rigs: {
		create: op('rigs.create'),
		createSshSession: op('rigs.createSshSession'),
		createTerminalTicket: op('rigs.createTerminalTicket'),
		delete: op('rigs.delete'),
		get: op('rigs.get'),
		getSlackConversation: op('rigs.getSlackConversation'),
		getSlackMetadata: op('rigs.getSlackMetadata'),
		list: op('rigs.list'),
		listIntegrations: op('rigs.listIntegrations'),
		listLifecycleEvents: op('rigs.listLifecycleEvents'),
		services: {
			create: op('rigs.services.create'),
			createToken: op('rigs.services.createToken'),
			delete: op('rigs.services.delete'),
			list: op('rigs.services.list'),
			replace: op('rigs.services.replace'),
		},
		sessions: {
			create: op('rigs.sessions.create'),
			get: op('rigs.sessions.get'),
			getLatest: op('rigs.sessions.getLatest'),
			list: op('rigs.sessions.list'),
			update: op('rigs.sessions.update'),
		},
		start: op('rigs.start'),
		stop: op('rigs.stop'),
	},
	secrets: {
		create: op('secrets.create'),
		delete: op('secrets.delete'),
		list: op('secrets.list'),
		sshPublicKeys: {
			delete: op('secrets.sshPublicKeys.delete'),
			list: op('secrets.sshPublicKeys.list'),
			upsert: op('secrets.sshPublicKeys.upsert'),
		},
		update: op('secrets.update'),
	},
	serviceDefinitions: {
		create: op('serviceDefinitions.create'),
		delete: op('serviceDefinitions.delete'),
		update: op('serviceDefinitions.update'),
	},
	services: {
		list: op('services.list'),
	},
	slack: {
		channelSettings: {
			delete: op('slack.channelSettings.delete'),
			list: op('slack.channelSettings.list'),
			set: op('slack.channelSettings.set'),
		},
		settings: {
			get: op('slack.settings.get'),
			set: op('slack.settings.set'),
		},
	},
	snapshots: {
		create: op('snapshots.create'),
		delete: op('snapshots.delete'),
		get: op('snapshots.get'),
		list: op('snapshots.list'),
		previewScrub: op('snapshots.previewScrub'),
	},
} as const;

export const amikaEndpointSchemas = {
	'agentCredentials.claude.check': amikaSchemaEntry(
		'agentCredentials.claude.check',
	),
	'agentCredentials.claude.create': amikaSchemaEntry(
		'agentCredentials.claude.create',
	),
	'agentCredentials.claude.delete': amikaSchemaEntry(
		'agentCredentials.claude.delete',
	),
	'agentCredentials.claude.list': amikaSchemaEntry(
		'agentCredentials.claude.list',
	),
	'agentCredentials.codex.create': amikaSchemaEntry(
		'agentCredentials.codex.create',
	),
	'agentCredentials.codex.delete': amikaSchemaEntry(
		'agentCredentials.codex.delete',
	),
	'agentCredentials.codex.list': amikaSchemaEntry(
		'agentCredentials.codex.list',
	),
	'agentCredentials.pi.delete': amikaSchemaEntry('agentCredentials.pi.delete'),
	'agentCredentials.pi.get': amikaSchemaEntry('agentCredentials.pi.get'),
	'agentCredentials.pi.set': amikaSchemaEntry('agentCredentials.pi.set'),
	'agentSessions.get': amikaSchemaEntry('agentSessions.get'),
	'agentSessions.list': amikaSchemaEntry('agentSessions.list'),
	'agentSessions.send': amikaSchemaEntry('agentSessions.send'),
	'apiKeys.create': amikaSchemaEntry('apiKeys.create'),
	'apiKeys.delete': amikaSchemaEntry('apiKeys.delete'),
	'apiKeys.list': amikaSchemaEntry('apiKeys.list'),
	'cloudAccounts.create': amikaSchemaEntry('cloudAccounts.create'),
	'cloudAccounts.delete': amikaSchemaEntry('cloudAccounts.delete'),
	'cloudAccounts.get': amikaSchemaEntry('cloudAccounts.get'),
	'cloudAccounts.list': amikaSchemaEntry('cloudAccounts.list'),
	'cloudAccounts.listSizes': amikaSchemaEntry('cloudAccounts.listSizes'),
	'cloudAccounts.update': amikaSchemaEntry('cloudAccounts.update'),
	'commandRuns.cancel': amikaSchemaEntry('commandRuns.cancel'),
	'commandRuns.create': amikaSchemaEntry('commandRuns.create'),
	'commandRuns.get': amikaSchemaEntry('commandRuns.get'),
	'commandRuns.list': amikaSchemaEntry('commandRuns.list'),
	'commandRuns.listEvents': amikaSchemaEntry('commandRuns.listEvents'),
	'gitUserSettings.get': amikaSchemaEntry('gitUserSettings.get'),
	'gitUserSettings.set': amikaSchemaEntry('gitUserSettings.set'),
	'hosts.checkHealth': amikaSchemaEntry('hosts.checkHealth'),
	'hosts.create': amikaSchemaEntry('hosts.create'),
	'hosts.delete': amikaSchemaEntry('hosts.delete'),
	'hosts.enrol': amikaSchemaEntry('hosts.enrol'),
	'hosts.get': amikaSchemaEntry('hosts.get'),
	'hosts.list': amikaSchemaEntry('hosts.list'),
	'hosts.replace': amikaSchemaEntry('hosts.replace'),
	'integrations.disconnect': amikaSchemaEntry('integrations.disconnect'),
	'integrations.list': amikaSchemaEntry('integrations.list'),
	'jobRuns.cancel': amikaSchemaEntry('jobRuns.cancel'),
	'jobRuns.get': amikaSchemaEntry('jobRuns.get'),
	'jobRuns.list': amikaSchemaEntry('jobRuns.list'),
	'jobRuns.start': amikaSchemaEntry('jobRuns.start'),
	'jobs.create': amikaSchemaEntry('jobs.create'),
	'jobs.delete': amikaSchemaEntry('jobs.delete'),
	'jobs.get': amikaSchemaEntry('jobs.get'),
	'jobs.list': amikaSchemaEntry('jobs.list'),
	'jobs.update': amikaSchemaEntry('jobs.update'),
	'linear.settings.get': amikaSchemaEntry('linear.settings.get'),
	'linear.settings.set': amikaSchemaEntry('linear.settings.set'),
	'repositories.clearImage': amikaSchemaEntry('repositories.clearImage'),
	'repositories.get': amikaSchemaEntry('repositories.get'),
	'repositories.integrations.list': amikaSchemaEntry(
		'repositories.integrations.list',
	),
	'repositories.integrations.set': amikaSchemaEntry(
		'repositories.integrations.set',
	),
	'repositories.list': amikaSchemaEntry('repositories.list'),
	'repositories.upsert': amikaSchemaEntry('repositories.upsert'),
	'rigs.create': amikaSchemaEntry('rigs.create'),
	'rigs.createSshSession': amikaSchemaEntry('rigs.createSshSession'),
	'rigs.createTerminalTicket': amikaSchemaEntry('rigs.createTerminalTicket'),
	'rigs.delete': amikaSchemaEntry('rigs.delete'),
	'rigs.get': amikaSchemaEntry('rigs.get'),
	'rigs.getSlackConversation': amikaSchemaEntry('rigs.getSlackConversation'),
	'rigs.getSlackMetadata': amikaSchemaEntry('rigs.getSlackMetadata'),
	'rigs.list': amikaSchemaEntry('rigs.list'),
	'rigs.listIntegrations': amikaSchemaEntry('rigs.listIntegrations'),
	'rigs.listLifecycleEvents': amikaSchemaEntry('rigs.listLifecycleEvents'),
	'rigs.services.create': amikaSchemaEntry('rigs.services.create'),
	'rigs.services.createToken': amikaSchemaEntry('rigs.services.createToken'),
	'rigs.services.delete': amikaSchemaEntry('rigs.services.delete'),
	'rigs.services.list': amikaSchemaEntry('rigs.services.list'),
	'rigs.services.replace': amikaSchemaEntry('rigs.services.replace'),
	'rigs.sessions.create': amikaSchemaEntry('rigs.sessions.create'),
	'rigs.sessions.get': amikaSchemaEntry('rigs.sessions.get'),
	'rigs.sessions.getLatest': amikaSchemaEntry('rigs.sessions.getLatest'),
	'rigs.sessions.list': amikaSchemaEntry('rigs.sessions.list'),
	'rigs.sessions.update': amikaSchemaEntry('rigs.sessions.update'),
	'rigs.start': amikaSchemaEntry('rigs.start'),
	'rigs.stop': amikaSchemaEntry('rigs.stop'),
	'secrets.create': amikaSchemaEntry('secrets.create'),
	'secrets.delete': amikaSchemaEntry('secrets.delete'),
	'secrets.list': amikaSchemaEntry('secrets.list'),
	'secrets.sshPublicKeys.delete': amikaSchemaEntry(
		'secrets.sshPublicKeys.delete',
	),
	'secrets.sshPublicKeys.list': amikaSchemaEntry('secrets.sshPublicKeys.list'),
	'secrets.sshPublicKeys.upsert': amikaSchemaEntry(
		'secrets.sshPublicKeys.upsert',
	),
	'secrets.update': amikaSchemaEntry('secrets.update'),
	'serviceDefinitions.create': amikaSchemaEntry('serviceDefinitions.create'),
	'serviceDefinitions.delete': amikaSchemaEntry('serviceDefinitions.delete'),
	'serviceDefinitions.update': amikaSchemaEntry('serviceDefinitions.update'),
	'services.list': amikaSchemaEntry('services.list'),
	'slack.channelSettings.delete': amikaSchemaEntry(
		'slack.channelSettings.delete',
	),
	'slack.channelSettings.list': amikaSchemaEntry('slack.channelSettings.list'),
	'slack.channelSettings.set': amikaSchemaEntry('slack.channelSettings.set'),
	'slack.settings.get': amikaSchemaEntry('slack.settings.get'),
	'slack.settings.set': amikaSchemaEntry('slack.settings.set'),
	'snapshots.create': amikaSchemaEntry('snapshots.create'),
	'snapshots.delete': amikaSchemaEntry('snapshots.delete'),
	'snapshots.get': amikaSchemaEntry('snapshots.get'),
	'snapshots.list': amikaSchemaEntry('snapshots.list'),
	'snapshots.previewScrub': amikaSchemaEntry('snapshots.previewScrub'),
} satisfies RequiredPluginEndpointSchemas<typeof amikaEndpointsNested>;

export const amikaEndpointMeta = {
	'agentCredentials.claude.check': {
		riskLevel: 'read',
		description:
			'Checks that a stored Claude Code credential can still authenticate.',
	},
	'agentCredentials.claude.create': {
		riskLevel: 'write',
		description:
			'Stores a Claude Code credential (type oauth or api_key) that rigs can be given.',
	},
	'agentCredentials.claude.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a stored Claude Code credential.',
	},
	'agentCredentials.claude.list': {
		riskLevel: 'read',
		description:
			'Lists stored Claude Code credentials (OAuth tokens or API keys) by name and scope, never values.',
	},
	'agentCredentials.codex.create': {
		riskLevel: 'write',
		description:
			'Stores a Codex credential (type oauth or api_key) that rigs can be given.',
	},
	'agentCredentials.codex.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a stored Codex credential.',
	},
	'agentCredentials.codex.list': {
		riskLevel: 'read',
		description:
			'Lists stored Codex credentials by name and scope, never values.',
	},
	'agentCredentials.pi.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the Pi agent credential.',
	},
	'agentCredentials.pi.get': {
		riskLevel: 'read',
		description: 'Reads whether a Pi agent credential is configured.',
	},
	'agentCredentials.pi.set': {
		riskLevel: 'write',
		description: 'Saves the Pi agent credential.',
	},
	'agentSessions.get': {
		riskLevel: 'read',
		description:
			'Reads one agent session: its rig, agent, status and the messages exchanged so far.',
	},
	'agentSessions.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's agent-session chats, newest first, with each one's rig, agent, model and a preview.",
	},
	'agentSessions.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Sends one message to a coding agent (Claude Code or Codex) in a rig and waits for its reply. Without sandbox_id/sandbox_name/sandbox_ref it creates a new rig from repo_url; pass session_id to continue a chat. A failed turn still answers 200 with is_error: true and the agent CLI's own message. Runs on the rig's stored agent credential and can take minutes.",
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description:
			'Creates an Amika API key (user or organization scope). The value is returned once.',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an Amika API key; anything using it stops working. scope defaults to organization: pass scope user to delete a user key.',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description:
			"Lists the caller's Amika API keys (names, scopes, last use; values obfuscated).",
	},
	'cloudAccounts.create': {
		riskLevel: 'write',
		description:
			'Connects a cloud provider account with its API key, so rigs can run there.',
	},
	'cloudAccounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Disconnects a cloud account and deletes its stored API key.',
	},
	'cloudAccounts.get': {
		riskLevel: 'read',
		description: 'Reads one connected cloud account by id or name.',
	},
	'cloudAccounts.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's connected cloud provider accounts that rigs can run in.",
	},
	'cloudAccounts.listSizes': {
		riskLevel: 'read',
		description: 'Lists the rig sizes a cloud account offers.',
	},
	'cloudAccounts.update': {
		riskLevel: 'write',
		description: 'Updates a connected cloud account: its name or API key.',
	},
	'commandRuns.cancel': {
		riskLevel: 'write',
		description: 'Requests cancellation of a queued or running command run.',
	},
	'commandRuns.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Queues one shell command on a rig (run with bash -e -o pipefail) and answers at once. Name an existing rig (rig_id, rig_name or rig_ref) or create one with rig_create; a stopped rig is started. Poll commandRuns.get for status and commandRuns.listEvents for output. An idempotencyKey is made for you when you leave it out.',
	},
	'commandRuns.get': {
		riskLevel: 'read',
		description:
			'Reads one command run: status (queued, in_progress, completed), conclusion (success, failure, timed_out...), exit code, timing and its rig.',
	},
	'commandRuns.list': {
		riskLevel: 'read',
		description:
			'Lists command runs (queued shell commands on rigs), filtered by rig, status or session.',
	},
	'commandRuns.listEvents': {
		riskLevel: 'read',
		description:
			'Reads the output events of a command run after a sequence number: pass the next_sequence of the previous answer as after to read on from there.',
	},
	'gitUserSettings.get': {
		riskLevel: 'read',
		description:
			"Reads the caller's git author name and email, which rigs use for commits.",
	},
	'gitUserSettings.set': {
		riskLevel: 'write',
		description:
			"Sets the caller's git author name and email for commits made in rigs.",
	},
	'hosts.checkHealth': {
		riskLevel: 'read',
		description: "Checks whether a host's daemon is answering.",
	},
	'hosts.create': {
		riskLevel: 'write',
		description:
			'Registers a host for bring-your-own-compute. amika-hostd setup normally does this.',
	},
	'hosts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a host and its stored secret; rigs can no longer be created on it.',
	},
	'hosts.enrol': {
		riskLevel: 'write',
		description: 'Enrols a tunnel host with its gateway.',
	},
	'hosts.get': {
		riskLevel: 'read',
		description:
			'Reads one of your own hosts: its hostname, runtimes, sizes and status.',
	},
	'hosts.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's own hosts (machines running amika-hostd) and their runtimes and sizes.",
	},
	'hosts.replace': {
		riskLevel: 'write',
		description: "Replaces a host's registration: hostname, URL and settings.",
	},
	'integrations.disconnect': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnects an integration provider for the caller and deletes its stored token.',
	},
	'integrations.list': {
		riskLevel: 'read',
		description:
			"Lists the caller's connected integrations (GitHub, Sentry, Linear, Pylon).",
	},
	'jobRuns.cancel': {
		riskLevel: 'write',
		description: 'Cancels a pending or running job run.',
	},
	'jobRuns.get': {
		riskLevel: 'read',
		description:
			'Reads one job run: status, timing and the command run of each step.',
	},
	'jobRuns.list': {
		riskLevel: 'read',
		description: 'Lists job runs, filtered by job, status or trigger kind.',
	},
	'jobRuns.start': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Starts a run of a job now, outside its schedule.',
	},
	'jobs.create': {
		riskLevel: 'destructive',
		description:
			"Creates a job: a cron trigger and 1 to 20 shell steps. Each time the trigger fires, a job run runs the steps in order on one rig. Step 0 names the rig with exactly one of rig_id, rig_name, rig_ref or rig_create; later steps name none and run on step 0's rig. Set enabled false to create it paused. An idempotencyKey is made for you when you leave it out.",
	},
	'jobs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a job and all of its job runs.',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Reads one job by id or name.',
	},
	'jobs.list': {
		riskLevel: 'read',
		description:
			'Lists jobs (scheduled commands on rigs) with their trigger, steps and next run.',
	},
	'jobs.update': {
		riskLevel: 'destructive',
		description:
			'Updates a job: its trigger, steps or description; enabled false pauses it and true resumes it. New steps follow the jobs.create rule: only step 0 names a rig.',
	},
	'linear.settings.get': {
		riskLevel: 'read',
		description:
			"Reads the organization's Linear defaults: repository, agent and system prompt. 404 when not set.",
	},
	'linear.settings.set': {
		riskLevel: 'write',
		description:
			"Sets the organization's Linear defaults: the repository and agent Linear issues use.",
	},
	'repositories.clearImage': {
		riskLevel: 'destructive',
		description:
			"Clears a repository's image configuration, so new rigs use the preset image.",
	},
	'repositories.get': {
		riskLevel: 'read',
		description: 'Reads one repository and its rig settings.',
	},
	'repositories.integrations.list': {
		riskLevel: 'read',
		description: 'Lists the MCP integrations new rigs of a repository get.',
	},
	'repositories.integrations.set': {
		riskLevel: 'write',
		description:
			'Replaces the list of MCP integrations new rigs of a repository get.',
	},
	'repositories.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's repositories and their rig settings (setup script, image, env).",
	},
	'repositories.upsert': {
		riskLevel: 'write',
		description:
			'Creates or updates a repository by repo_url: its setup script, image and environment for new rigs.',
	},
	'rigs.create': {
		riskLevel: 'destructive',
		description:
			'Creates a rig: a devbox VM with a repo cloned, dependencies set up and agent credentials injected. Runs on Amika Cloud (billed per second), a connected cloud account, or one of your own hosts (host_id). Answers 202 while it boots; poll rigs.get until status is running and setup_status ok (git-failed, setup-failed or sys-setup-failed means setup failed: stop waiting). By default the rig gets a new organization API key as AMIKA_API_KEY (amika_api_key changes that).',
	},
	'rigs.createSshSession': {
		riskLevel: 'write',
		description:
			'Opens a direct WebSocket SSH session to a rig and returns its connection details. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.createTerminalTicket': {
		riskLevel: 'write',
		description:
			'Mints a single-use ticket for the web terminal of a rig. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a rig and its disk. Anything not pushed or snapshotted is lost. With forget "true", Amika only drops its record when the host or provider can\'t be reached: the machine is left running, so confirm with the host or provider that it is gone. Name the rig by id or name; `by` says which (default: either).',
	},
	'rigs.get': {
		riskLevel: 'read',
		description:
			'Reads one rig: status, setup status, provider, size, branch, services and timestamps. Name the rig by id or name; `by` says which (default: either).',
	},
	'rigs.getSlackConversation': {
		riskLevel: 'read',
		description: 'Reads the Slack thread a Slack-made rig belongs to.',
	},
	'rigs.getSlackMetadata': {
		riskLevel: 'read',
		description:
			"Lists Slack metadata (team, channel, thread) for the organization's Slack-made rigs, keyed by rig.",
	},
	'rigs.list': {
		riskLevel: 'read',
		description:
			"Lists the organization's rigs (isolated devbox VMs for coding agents) with their status, provider and size.",
	},
	'rigs.listIntegrations': {
		riskLevel: 'read',
		description:
			'Lists the MCP integrations (Sentry, Linear, Pylon) attached to a rig at creation. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.listLifecycleEvents': {
		riskLevel: 'read',
		description:
			'Reads the control-plane event feed of a rig: created, setup steps, started, stopped, errors. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.services.create': {
		riskLevel: 'write',
		description:
			'Exposes a port of a rig as a named service with its own http or https URL (a dev server preview).',
	},
	'rigs.services.createToken': {
		riskLevel: 'write',
		description:
			'Mints an access token for a service of a rig that runs on your own host, for calling it from a script.',
	},
	'rigs.services.delete': {
		riskLevel: 'destructive',
		description: 'Removes a live service from a rig; its URL stops answering.',
	},
	'rigs.services.list': {
		riskLevel: 'read',
		description:
			'Lists the live services of a rig: name, port and the URL that reaches it. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.services.replace': {
		riskLevel: 'write',
		description:
			'Replaces a live service on a rig: its name, port and URL scheme.',
	},
	'rigs.sessions.create': {
		riskLevel: 'write',
		description:
			'Creates a new, empty agent session on a rig for the named agent (no message is sent). Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.sessions.get': {
		riskLevel: 'read',
		description: 'Reads one agent session on a rig by its session id.',
	},
	'rigs.sessions.getLatest': {
		riskLevel: 'read',
		description:
			'Reads the most recent agent session on a rig. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.sessions.list': {
		riskLevel: 'read',
		description:
			'Lists the agent sessions on one rig. Name the rig by id or name; `sandbox_by` says which (default: either).',
	},
	'rigs.sessions.update': {
		riskLevel: 'write',
		description: 'Updates an agent session on a rig: its status or metadata.',
	},
	'rigs.start': {
		riskLevel: 'destructive',
		description:
			'Starts a stopped rig. The home folder and other disk files are kept, but /tmp is cleared by the restart. Billing resumes while it runs. Name the rig by id or name; `by` says which (default: either).',
	},
	'rigs.stop': {
		riskLevel: 'write',
		description:
			'Stops a running rig so it stops billing for compute. The home folder and other disk files are kept; /tmp is cleared, so move work out of it first. Name the rig by id or name; `by` says which (default: either).',
	},
	'secrets.create': {
		riskLevel: 'write',
		description:
			'Stores a generic secret in the Amika vault (user or organization scope) for injecting into rigs as an env var.',
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a generic secret from the vault.',
	},
	'secrets.list': {
		riskLevel: 'read',
		description:
			'Lists the generic secrets the caller can see (names and scopes, never values).',
	},
	'secrets.sshPublicKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Deletes one of the caller's SSH public keys.",
	},
	'secrets.sshPublicKeys.list': {
		riskLevel: 'read',
		description: "Lists the caller's SSH public keys.",
	},
	'secrets.sshPublicKeys.upsert': {
		riskLevel: 'write',
		description:
			"Adds or replaces one of the caller's SSH public keys, used for rig SSH and editor access.",
	},
	'secrets.update': {
		riskLevel: 'write',
		description: 'Updates a generic secret: its value, name or scope.',
	},
	'serviceDefinitions.create': {
		riskLevel: 'write',
		description:
			'Adds a service definition to a repository: a named set of ports every rig of that repository exposes.',
	},
	'serviceDefinitions.delete': {
		riskLevel: 'destructive',
		description: 'Deletes a service definition from a repository.',
	},
	'serviceDefinitions.update': {
		riskLevel: 'write',
		description:
			"Updates a repository's service definition: its name and ports.",
	},
	'services.list': {
		riskLevel: 'read',
		description: "Lists the live services across the organization's rigs.",
	},
	'slack.channelSettings.delete': {
		riskLevel: 'destructive',
		description:
			"Deletes one Slack channel's defaults; it falls back to the workspace defaults.",
	},
	'slack.channelSettings.list': {
		riskLevel: 'read',
		description:
			'Lists per-channel Slack defaults and the channels the Amika bot has seen recently.',
	},
	'slack.channelSettings.set': {
		riskLevel: 'write',
		description:
			'Sets the repository, agent and system prompt one Slack channel uses.',
	},
	'slack.settings.get': {
		riskLevel: 'read',
		description:
			"Reads the organization's Slack defaults: repository, agent and system prompt. 404 when not set.",
	},
	'slack.settings.set': {
		riskLevel: 'write',
		description:
			"Sets the organization's Slack defaults: the repository and agent a new Slack thread uses, and an optional system prompt.",
	},
	'snapshots.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Starts capturing a snapshot of a running rig (sandbox_ref names it). mode scrub_and_delete (default) removes injected secrets and deletes the source rig; full keeps both. Answers 202; poll snapshots.get for status.',
	},
	'snapshots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a snapshot by name (default) or id. Rigs can no longer boot from it.',
	},
	'snapshots.get': {
		riskLevel: 'read',
		description:
			'Reads one snapshot by name (default) or id: status, source rig and size.',
	},
	'snapshots.list': {
		riskLevel: 'read',
		description:
			'Lists snapshots captured from rigs (reusable base images new rigs can boot from).',
	},
	'snapshots.previewScrub': {
		riskLevel: 'read',
		description:
			'Previews which injected secrets a scrub_and_delete snapshot of a rig would remove.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof amikaEndpointsNested>;
