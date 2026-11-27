// Generated with endpoints/operation-types.ts from Steel's OpenAPI spec:
// one entry per operation in steel-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { steelSchemaEntry } from './openapi-schema';
import { createSteelOperation as op } from './operations';

export const steelEndpointsNested = {
	apiKeys: {
		create: op('apiKeys.create'),
	},
	auth: {
		jwks: op('auth.jwks'),
	},
	credentials: {
		create: op('credentials.create'),
		delete: op('credentials.delete'),
		list: op('credentials.list'),
		update: op('credentials.update'),
	},
	extensions: {
		delete: op('extensions.delete'),
		deleteAll: op('extensions.deleteAll'),
		download: op('extensions.download'),
		list: op('extensions.list'),
		update: op('extensions.update'),
		upload: op('extensions.upload'),
	},
	files: {
		delete: op('files.delete'),
		download: op('files.download'),
		list: op('files.list'),
		upload: op('files.upload'),
	},
	profiles: {
		create: op('profiles.create'),
		delete: op('profiles.delete'),
		get: op('profiles.get'),
		list: op('profiles.list'),
		update: op('profiles.update'),
	},
	projects: {
		get: op('projects.get'),
		list: op('projects.list'),
	},
	secretConnections: {
		create: op('secretConnections.create'),
		delete: op('secretConnections.delete'),
		get: op('secretConnections.get'),
		list: op('secretConnections.list'),
		test: op('secretConnections.test'),
		update: op('secretConnections.update'),
	},
	sessions: {
		agentLogs: op('sessions.agentLogs'),
		agentTraces: op('sessions.agentTraces'),
		captchas: {
			solve: op('sessions.captchas.solve'),
			solveImage: op('sessions.captchas.solveImage'),
			status: op('sessions.captchas.status'),
		},
		commands: {
			cancelExecution: op('sessions.commands.cancelExecution'),
			getExecution: op('sessions.commands.getExecution'),
			run: op('sessions.commands.run'),
		},
		computer: op('sessions.computer'),
		context: op('sessions.context'),
		cost: op('sessions.cost'),
		create: op('sessions.create'),
		credentials: {
			attach: op('sessions.credentials.attach'),
			detach: op('sessions.credentials.detach'),
			detachVault: op('sessions.credentials.detachVault'),
			list: op('sessions.credentials.list'),
			replace: op('sessions.credentials.replace'),
		},
		events: op('sessions.events'),
		files: {
			delete: op('sessions.files.delete'),
			deleteAll: op('sessions.files.deleteAll'),
			download: op('sessions.files.download'),
			downloadArchive: op('sessions.files.downloadArchive'),
			list: op('sessions.files.list'),
			upload: op('sessions.files.upload'),
		},
		get: op('sessions.get'),
		hlsPlaylist: op('sessions.hlsPlaylist'),
		list: op('sessions.list'),
		liveDetails: op('sessions.liveDetails'),
		logs: op('sessions.logs'),
		metadata: {
			replace: op('sessions.metadata.replace'),
			update: op('sessions.metadata.update'),
		},
		release: op('sessions.release'),
		releaseAll: op('sessions.releaseAll'),
		signalCatalog: op('sessions.signalCatalog'),
	},
	tools: {
		pdf: op('tools.pdf'),
		scrape: op('tools.scrape'),
		screenshot: op('tools.screenshot'),
	},
	vaults: {
		create: op('vaults.create'),
		delete: op('vaults.delete'),
		get: op('vaults.get'),
		list: op('vaults.list'),
		update: op('vaults.update'),
	},
} as const;

export const steelEndpointSchemas = {
	'apiKeys.create': steelSchemaEntry('apiKeys.create'),
	'auth.jwks': steelSchemaEntry('auth.jwks'),
	'credentials.create': steelSchemaEntry('credentials.create'),
	'credentials.delete': steelSchemaEntry('credentials.delete'),
	'credentials.list': steelSchemaEntry('credentials.list'),
	'credentials.update': steelSchemaEntry('credentials.update'),
	'extensions.delete': steelSchemaEntry('extensions.delete'),
	'extensions.deleteAll': steelSchemaEntry('extensions.deleteAll'),
	'extensions.download': steelSchemaEntry('extensions.download'),
	'extensions.list': steelSchemaEntry('extensions.list'),
	'extensions.update': steelSchemaEntry('extensions.update'),
	'extensions.upload': steelSchemaEntry('extensions.upload'),
	'files.delete': steelSchemaEntry('files.delete'),
	'files.download': steelSchemaEntry('files.download'),
	'files.list': steelSchemaEntry('files.list'),
	'files.upload': steelSchemaEntry('files.upload'),
	'profiles.create': steelSchemaEntry('profiles.create'),
	'profiles.delete': steelSchemaEntry('profiles.delete'),
	'profiles.get': steelSchemaEntry('profiles.get'),
	'profiles.list': steelSchemaEntry('profiles.list'),
	'profiles.update': steelSchemaEntry('profiles.update'),
	'projects.get': steelSchemaEntry('projects.get'),
	'projects.list': steelSchemaEntry('projects.list'),
	'secretConnections.create': steelSchemaEntry('secretConnections.create'),
	'secretConnections.delete': steelSchemaEntry('secretConnections.delete'),
	'secretConnections.get': steelSchemaEntry('secretConnections.get'),
	'secretConnections.list': steelSchemaEntry('secretConnections.list'),
	'secretConnections.test': steelSchemaEntry('secretConnections.test'),
	'secretConnections.update': steelSchemaEntry('secretConnections.update'),
	'sessions.agentLogs': steelSchemaEntry('sessions.agentLogs'),
	'sessions.agentTraces': steelSchemaEntry('sessions.agentTraces'),
	'sessions.captchas.solve': steelSchemaEntry('sessions.captchas.solve'),
	'sessions.captchas.solveImage': steelSchemaEntry(
		'sessions.captchas.solveImage',
	),
	'sessions.captchas.status': steelSchemaEntry('sessions.captchas.status'),
	'sessions.commands.cancelExecution': steelSchemaEntry(
		'sessions.commands.cancelExecution',
	),
	'sessions.commands.getExecution': steelSchemaEntry(
		'sessions.commands.getExecution',
	),
	'sessions.commands.run': steelSchemaEntry('sessions.commands.run'),
	'sessions.computer': steelSchemaEntry('sessions.computer'),
	'sessions.context': steelSchemaEntry('sessions.context'),
	'sessions.cost': steelSchemaEntry('sessions.cost'),
	'sessions.create': steelSchemaEntry('sessions.create'),
	'sessions.credentials.attach': steelSchemaEntry(
		'sessions.credentials.attach',
	),
	'sessions.credentials.detach': steelSchemaEntry(
		'sessions.credentials.detach',
	),
	'sessions.credentials.detachVault': steelSchemaEntry(
		'sessions.credentials.detachVault',
	),
	'sessions.credentials.list': steelSchemaEntry('sessions.credentials.list'),
	'sessions.credentials.replace': steelSchemaEntry(
		'sessions.credentials.replace',
	),
	'sessions.events': steelSchemaEntry('sessions.events'),
	'sessions.files.delete': steelSchemaEntry('sessions.files.delete'),
	'sessions.files.deleteAll': steelSchemaEntry('sessions.files.deleteAll'),
	'sessions.files.download': steelSchemaEntry('sessions.files.download'),
	'sessions.files.downloadArchive': steelSchemaEntry(
		'sessions.files.downloadArchive',
	),
	'sessions.files.list': steelSchemaEntry('sessions.files.list'),
	'sessions.files.upload': steelSchemaEntry('sessions.files.upload'),
	'sessions.get': steelSchemaEntry('sessions.get'),
	'sessions.hlsPlaylist': steelSchemaEntry('sessions.hlsPlaylist'),
	'sessions.list': steelSchemaEntry('sessions.list'),
	'sessions.liveDetails': steelSchemaEntry('sessions.liveDetails'),
	'sessions.logs': steelSchemaEntry('sessions.logs'),
	'sessions.metadata.replace': steelSchemaEntry('sessions.metadata.replace'),
	'sessions.metadata.update': steelSchemaEntry('sessions.metadata.update'),
	'sessions.release': steelSchemaEntry('sessions.release'),
	'sessions.releaseAll': steelSchemaEntry('sessions.releaseAll'),
	'sessions.signalCatalog': steelSchemaEntry('sessions.signalCatalog'),
	'tools.pdf': steelSchemaEntry('tools.pdf'),
	'tools.scrape': steelSchemaEntry('tools.scrape'),
	'tools.screenshot': steelSchemaEntry('tools.screenshot'),
	'vaults.create': steelSchemaEntry('vaults.create'),
	'vaults.delete': steelSchemaEntry('vaults.delete'),
	'vaults.get': steelSchemaEntry('vaults.get'),
	'vaults.list': steelSchemaEntry('vaults.list'),
	'vaults.update': steelSchemaEntry('vaults.update'),
} satisfies RequiredPluginEndpointSchemas<typeof steelEndpointsNested>;

export const steelEndpointMeta = {
	'apiKeys.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create an API key. Create a project-scoped API key using a global (organization-scoped) API key. Supply projectId for an active project in the authenticated organization; scopeType must be project or omitted. Project-scoped API keys cannot create keys, and global keys cannot create other global keys. Mints a new API key.',
	},
	'auth.jwks': {
		riskLevel: 'read',
		description:
			'Get Public Keys (JWKS). Provides the JSON Web Key Set (JWKS) for verifying JWTs issued by this service.',
	},
	'credentials.create': {
		riskLevel: 'write',
		description:
			'Stores credentials. Encrypts and stores credentials for an origin.',
	},
	'credentials.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes credentials. Deletes encrypted credentials from the database. Cannot be undone.',
	},
	'credentials.list': {
		riskLevel: 'read',
		description:
			'List all credential metadata. Fetches all credential metadata for the current organization.',
	},
	'credentials.update': {
		riskLevel: 'write',
		description:
			'Updates credentials. Encrypts and updates credentials for an origin.',
	},
	'extensions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete extension. Delete an extension by ID. Cannot be undone.',
	},
	'extensions.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete all extensions. Delete all extensions for the organization. Cannot be undone.',
	},
	'extensions.download': {
		riskLevel: 'read',
		description:
			'Download extension. Download an extension file by extension ID.',
	},
	'extensions.list': {
		riskLevel: 'read',
		description: 'List extensions. List all extensions for the organization.',
	},
	'extensions.update': {
		riskLevel: 'write',
		description:
			'Update extension. Update a Chrome extension (.zip/.crx file or Chrome Web Store URL) for the organization.',
	},
	'extensions.upload': {
		riskLevel: 'write',
		description:
			'Upload extension. Upload a Chrome extension (.zip/.crx file or Chrome Web Store URL) for the organization.',
	},
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a global file. Delete a file from global storage. Cannot be undone.',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download a global file. Download a file from global storage.',
	},
	'files.list': {
		riskLevel: 'read',
		description:
			'List global files. List all global files for the organization in descending order.',
	},
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload a global file. Uploads a file to global storage via multipart/form-data with a file field that accepts either binary data or a URL string to download from, and an optional path field for the file storage path.',
	},
	'profiles.create': {
		riskLevel: 'write',
		description: 'Create a profile. Create a new profile. (POST /v1/profiles)',
	},
	'profiles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a profile. Delete the profile and its stored browser data immediately, with a final asynchronous cleanup pass. Cannot be undone.',
	},
	'profiles.get': {
		riskLevel: 'read',
		description: 'Get a profile. Retrieve a profile by ID.',
	},
	'profiles.list': {
		riskLevel: 'read',
		description: 'List all profiles. Retrieve a list of all profiles.',
	},
	'profiles.update': {
		riskLevel: 'write',
		description: 'Update a profile. Update an existing profile.',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get project. Get a project by ID. (GET /v1/projects/{id})',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects. List projects for the authenticated organization.',
	},
	'secretConnections.create': {
		riskLevel: 'write',
		description: 'Create a secret connection. (POST /v1/secret-connections)',
	},
	'secretConnections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a secret connection. Cannot be undone.',
	},
	'secretConnections.get': {
		riskLevel: 'read',
		description: 'Get a secret connection. (GET /v1/secret-connections/{id})',
	},
	'secretConnections.list': {
		riskLevel: 'read',
		description: 'List secret connections. (GET /v1/secret-connections)',
	},
	'secretConnections.test': {
		riskLevel: 'write',
		description:
			'Test a secret connection. (POST /v1/secret-connections/{id}/test)',
	},
	'secretConnections.update': {
		riskLevel: 'write',
		description:
			'Update a secret connection. (PATCH /v1/secret-connections/{id})',
	},
	'sessions.agentLogs': {
		riskLevel: 'read',
		description:
			'Get session agent logs. Query raw CDP-derived agent events (Input.dispatchMouseEvent, Input.dispatchKeyEvent, Page.navigate, …) for a session. For the semantic, replay-oriented interaction timeline use /sessions/:id/agent-traces instead.',
	},
	'sessions.agentTraces': {
		riskLevel: 'read',
		description:
			'Get session agent traces. Query the semantic agent trace timeline for a session: a coalesced, replay-oriented record of user/agent interactions (clicks, typing, scrolls, drags, navigations) with target metadata (role, accessible name, selectors). Returns an empty list for sessions that predate browser-interaction capture.',
	},
	'sessions.captchas.solve': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Solve captcha(s). Solves captcha(s) for the session. If pageId, url, or taskId is provided, solves that specific captcha. If no parameters are provided, solves all detected captchas. Use this when autoCaptchaSolving is disabled in stealthConfig. Uses paid CAPTCHA solving (needs a verified account).',
	},
	'sessions.captchas.solveImage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Solve image captcha. Solves an image captcha using XPath selectors. Uses paid CAPTCHA solving (needs a verified account).',
	},
	'sessions.captchas.status': {
		riskLevel: 'read',
		description:
			'Get captcha status. Gets the current captcha status for a session.',
	},
	'sessions.commands.cancelExecution': {
		riskLevel: 'write',
		description:
			'Cancel a command execution. Stops an execution. The running command stops before its next input, and commands that already ran are not undone.',
	},
	'sessions.commands.getExecution': {
		riskLevel: 'read',
		description:
			'Get a command execution. Waits up to 20 seconds for an execution to finish and returns it. Use it when a run answered with state running.',
	},
	'sessions.commands.run': {
		riskLevel: 'write',
		description:
			"Run commands. Drives the session's browser with high-level commands such as snapshot, click, and fill. Commands run in order and stop at the first failure. Send a random Idempotency-Key header to make retries safe.",
	},
	'sessions.computer': {
		riskLevel: 'write',
		description:
			'Execute computer action. Execute computer actions like mouse movements, clicks, keyboard input, and more.',
	},
	'sessions.context': {
		riskLevel: 'read',
		description:
			'Get session context. Fetches the context data of a specific session.',
	},
	'sessions.cost': {
		riskLevel: 'read',
		description:
			'Get session cost. Returns the finalized cost of a released session as an exact amount in US dollars (e.g. 0.031905), suitable for precise billing passthrough.',
	},
	'sessions.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a session. Creates a new session with the provided configuration. Starts a cloud browser that is billed by the minute until it is released or times out.',
	},
	'sessions.credentials.attach': {
		riskLevel: 'write',
		description:
			'Attach session credentials. Attach credentialIds and/or Vault or item references in bindings. Each array accepts at most 100 entries; at most 100 distinct direct items and whole Vaults may be bound. Only credentials can be autofilled. Lookup becomes explicit and remains so.',
	},
	'sessions.credentials.detach': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Detach a session credential. Unbind a credential from a running session. The lookup stays explicit: with nothing bound, the session fills nothing. Errors: 404 credential_not_attached, 409 session_not_running, 503 credential_bindings_busy (retryable). Cannot be undone.',
	},
	'sessions.credentials.detachVault': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Detach a session Vault binding. Pass reference as a query parameter to detach one Vault or item binding, including steel://connections/<connection>/vaults/<vault>[/<item>]. Does not detach items covered by a whole Vault binding. Cannot be undone.',
	},
	'sessions.credentials.list': {
		riskLevel: 'read',
		description:
			"List session credentials. The session's credential lookup and the live credentials bound to it (no values). Subject to session organization and project access.",
	},
	'sessions.credentials.replace': {
		riskLevel: 'write',
		description:
			'Replace session credentials. Replace all direct item and Vault bindings, including provider references steel://connections/<connection>/vaults/<vault>[/<item>]. Supply credentialIds and/or bindings; empty arrays detach all. At most 100 distinct bindings may be stored. Only credentials can be autofilled.',
	},
	'sessions.events': {
		riskLevel: 'read',
		description:
			'Get recorded events. This endpoint allows you to get the recorded session events in the RRWeb format. Steel puts the next page token in a Next-Cursor response header, which the plugin cannot read yet; page by time instead.',
	},
	'sessions.files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a file. Delete a file from a session. Cannot be undone.',
	},
	'sessions.files.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete all files. Delete all files from a session. Cannot be undone.',
	},
	'sessions.files.download': {
		riskLevel: 'read',
		description: 'Download a file. Download a file from a session.',
	},
	'sessions.files.downloadArchive': {
		riskLevel: 'read',
		description:
			'Download archive. Download all files from the session as a zip archive.',
	},
	'sessions.files.list': {
		riskLevel: 'read',
		description:
			'List files. List all files from the session in descending order.',
	},
	'sessions.files.upload': {
		riskLevel: 'write',
		description:
			'Upload a file. Uploads a file to a session via multipart/form-data with a file field that accepts either binary data or a URL string to download from, and an optional path field for the file storage path.',
	},
	'sessions.get': {
		riskLevel: 'read',
		description:
			'Get session details. Retrieves details of a specific session by ID.',
	},
	'sessions.hlsPlaylist': {
		riskLevel: 'read',
		description:
			'Get HLS playlist. Get HLS playlist for a session recording using app auth or an RTC token.',
	},
	'sessions.list': {
		riskLevel: 'read',
		description:
			'List all sessions. Fetches all active sessions for the current organization.',
	},
	'sessions.liveDetails': {
		riskLevel: 'read',
		description:
			'Get live session details. Returns the live state of the session, including pages, tabs, and browser state.',
	},
	'sessions.logs': {
		riskLevel: 'read',
		description: 'Get session logs. Query browser event logs for a session.',
	},
	'sessions.metadata.replace': {
		riskLevel: 'write',
		description:
			'Replace session metadata. Atomically replace customer metadata. Send an empty object to clear it. Last accepted write wins; use PATCH to change individual keys. Subject to session organization and project access.',
	},
	'sessions.metadata.update': {
		riskLevel: 'write',
		description:
			'Update session metadata. Atomically merge keys into customer metadata. Set a key to null to remove it; keys you leave out are kept, so concurrent updates to different keys are all kept. Returns the merged metadata, which must stay within the metadata limits. Subject to session organization and project access.',
	},
	'sessions.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Release a session. Releases a specific session by ID. Ends the session; its browser cannot be resumed.',
	},
	'sessions.releaseAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Release all sessions. Releases all active sessions for the current organization. Ends every live session in the project given by projectId; without it, every session the key reaches (all projects for an organization key).',
	},
	'sessions.signalCatalog': {
		riskLevel: 'read',
		description:
			'List public session signal definitions. Returns current signal labels and meanings for customer integrations. Uses normal Steel API-key authentication. Includes no session data or administrative signals. Definitions do not establish that detection ran for a particular session.',
	},
	'tools.pdf': {
		riskLevel: 'read',
		description:
			'Convert webpage to PDF. Generates a PDF from a specified webpage. Runs a short browser session and spends wallet credit like one.',
	},
	'tools.scrape': {
		riskLevel: 'read',
		description:
			'Scrape webpage content. Extracts content from a specified URL. Runs a short browser session and spends wallet credit like one.',
	},
	'tools.screenshot': {
		riskLevel: 'read',
		description:
			'Capture webpage screenshot. Captures a screenshot of a specified webpage. Runs a short browser session and spends wallet credit like one.',
	},
	'vaults.create': {
		riskLevel: 'write',
		description: 'Create a Vault. (POST /v1/vaults)',
	},
	'vaults.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an empty Vault. Soft-delete a Vault. Returns 409 while it contains any live Secrets or credentials; move or delete them first. Cannot be undone.',
	},
	'vaults.get': {
		riskLevel: 'read',
		description: 'Get a Vault. (GET /v1/vaults/{id})',
	},
	'vaults.list': {
		riskLevel: 'read',
		description: 'List Vaults. (GET /v1/vaults)',
	},
	'vaults.update': {
		riskLevel: 'write',
		description: 'Update a Vault. (PATCH /v1/vaults/{id})',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof steelEndpointsNested>;
