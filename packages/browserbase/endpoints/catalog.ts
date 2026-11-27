// Generated with endpoints/operation-types.ts from Browserbase's OpenAPI spec:
// one entry per operation in browserbase-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { browserbaseSchemaEntry } from './openapi-schema';
import { createBrowserbaseOperation as op } from './operations';

export const browserbaseEndpointsNested = {
	agents: {
		create: op('agents.create'),
		delete: op('agents.delete'),
		get: op('agents.get'),
		list: op('agents.list'),
		runs: {
			create: op('agents.runs.create'),
			get: op('agents.runs.get'),
			list: op('agents.runs.list'),
			messages: op('agents.runs.messages'),
			resume: op('agents.runs.resume'),
			stop: op('agents.runs.stop'),
		},
		update: op('agents.update'),
	},
	certificates: {
		delete: op('certificates.delete'),
		get: op('certificates.get'),
		list: op('certificates.list'),
		upload: op('certificates.upload'),
	},
	contexts: {
		create: op('contexts.create'),
		delete: op('contexts.delete'),
		get: op('contexts.get'),
	},
	downloads: {
		delete: op('downloads.delete'),
		get: op('downloads.get'),
		list: op('downloads.list'),
	},
	extensions: {
		delete: op('extensions.delete'),
		get: op('extensions.get'),
		upload: op('extensions.upload'),
	},
	fetch: {
		page: op('fetch.page'),
	},
	functions: {
		builds: {
			get: op('functions.builds.get'),
			list: op('functions.builds.list'),
			logs: op('functions.builds.logs'),
		},
		get: op('functions.get'),
		invocations: {
			get: op('functions.invocations.get'),
			logs: op('functions.invocations.logs'),
		},
		invoke: op('functions.invoke'),
		list: op('functions.list'),
		secrets: {
			attach: op('functions.secrets.attach'),
			detach: op('functions.secrets.detach'),
			list: op('functions.secrets.list'),
		},
		versions: {
			get: op('functions.versions.get'),
			invocations: op('functions.versions.invocations'),
			list: op('functions.versions.list'),
		},
	},
	labels: {
		create: op('labels.create'),
		delete: op('labels.delete'),
		list: op('labels.list'),
		update: op('labels.update'),
	},
	navigationPolicies: {
		create: op('navigationPolicies.create'),
		delete: op('navigationPolicies.delete'),
		get: op('navigationPolicies.get'),
		list: op('navigationPolicies.list'),
		update: op('navigationPolicies.update'),
	},
	projects: {
		get: op('projects.get'),
		list: op('projects.list'),
		usage: op('projects.usage'),
	},
	search: {
		web: op('search.web'),
	},
	secrets: {
		create: op('secrets.create'),
		delete: op('secrets.delete'),
		get: op('secrets.get'),
		keypair: op('secrets.keypair'),
		list: op('secrets.list'),
		update: op('secrets.update'),
	},
	sessions: {
		create: op('sessions.create'),
		debug: op('sessions.debug'),
		get: op('sessions.get'),
		list: op('sessions.list'),
		logs: op('sessions.logs'),
		recordingDownloads: {
			create: op('sessions.recordingDownloads.create'),
			list: op('sessions.recordingDownloads.list'),
		},
		replays: {
			get: op('sessions.replays.get'),
			page: op('sessions.replays.page'),
		},
		setLabels: op('sessions.setLabels'),
		update: op('sessions.update'),
		uploadFile: op('sessions.uploadFile'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		rotateSecret: op('webhooks.rotateSecret'),
		update: op('webhooks.update'),
	},
} as const;

export const browserbaseEndpointSchemas = {
	'agents.create': browserbaseSchemaEntry('agents.create'),
	'agents.delete': browserbaseSchemaEntry('agents.delete'),
	'agents.get': browserbaseSchemaEntry('agents.get'),
	'agents.list': browserbaseSchemaEntry('agents.list'),
	'agents.runs.create': browserbaseSchemaEntry('agents.runs.create'),
	'agents.runs.get': browserbaseSchemaEntry('agents.runs.get'),
	'agents.runs.list': browserbaseSchemaEntry('agents.runs.list'),
	'agents.runs.messages': browserbaseSchemaEntry('agents.runs.messages'),
	'agents.runs.resume': browserbaseSchemaEntry('agents.runs.resume'),
	'agents.runs.stop': browserbaseSchemaEntry('agents.runs.stop'),
	'agents.update': browserbaseSchemaEntry('agents.update'),
	'certificates.delete': browserbaseSchemaEntry('certificates.delete'),
	'certificates.get': browserbaseSchemaEntry('certificates.get'),
	'certificates.list': browserbaseSchemaEntry('certificates.list'),
	'certificates.upload': browserbaseSchemaEntry('certificates.upload'),
	'contexts.create': browserbaseSchemaEntry('contexts.create'),
	'contexts.delete': browserbaseSchemaEntry('contexts.delete'),
	'contexts.get': browserbaseSchemaEntry('contexts.get'),
	'downloads.delete': browserbaseSchemaEntry('downloads.delete'),
	'downloads.get': browserbaseSchemaEntry('downloads.get'),
	'downloads.list': browserbaseSchemaEntry('downloads.list'),
	'extensions.delete': browserbaseSchemaEntry('extensions.delete'),
	'extensions.get': browserbaseSchemaEntry('extensions.get'),
	'extensions.upload': browserbaseSchemaEntry('extensions.upload'),
	'fetch.page': browserbaseSchemaEntry('fetch.page'),
	'functions.builds.get': browserbaseSchemaEntry('functions.builds.get'),
	'functions.builds.list': browserbaseSchemaEntry('functions.builds.list'),
	'functions.builds.logs': browserbaseSchemaEntry('functions.builds.logs'),
	'functions.get': browserbaseSchemaEntry('functions.get'),
	'functions.invocations.get': browserbaseSchemaEntry(
		'functions.invocations.get',
	),
	'functions.invocations.logs': browserbaseSchemaEntry(
		'functions.invocations.logs',
	),
	'functions.invoke': browserbaseSchemaEntry('functions.invoke'),
	'functions.list': browserbaseSchemaEntry('functions.list'),
	'functions.secrets.attach': browserbaseSchemaEntry(
		'functions.secrets.attach',
	),
	'functions.secrets.detach': browserbaseSchemaEntry(
		'functions.secrets.detach',
	),
	'functions.secrets.list': browserbaseSchemaEntry('functions.secrets.list'),
	'functions.versions.get': browserbaseSchemaEntry('functions.versions.get'),
	'functions.versions.invocations': browserbaseSchemaEntry(
		'functions.versions.invocations',
	),
	'functions.versions.list': browserbaseSchemaEntry('functions.versions.list'),
	'labels.create': browserbaseSchemaEntry('labels.create'),
	'labels.delete': browserbaseSchemaEntry('labels.delete'),
	'labels.list': browserbaseSchemaEntry('labels.list'),
	'labels.update': browserbaseSchemaEntry('labels.update'),
	'navigationPolicies.create': browserbaseSchemaEntry(
		'navigationPolicies.create',
	),
	'navigationPolicies.delete': browserbaseSchemaEntry(
		'navigationPolicies.delete',
	),
	'navigationPolicies.get': browserbaseSchemaEntry('navigationPolicies.get'),
	'navigationPolicies.list': browserbaseSchemaEntry('navigationPolicies.list'),
	'navigationPolicies.update': browserbaseSchemaEntry(
		'navigationPolicies.update',
	),
	'projects.get': browserbaseSchemaEntry('projects.get'),
	'projects.list': browserbaseSchemaEntry('projects.list'),
	'projects.usage': browserbaseSchemaEntry('projects.usage'),
	'search.web': browserbaseSchemaEntry('search.web'),
	'secrets.create': browserbaseSchemaEntry('secrets.create'),
	'secrets.delete': browserbaseSchemaEntry('secrets.delete'),
	'secrets.get': browserbaseSchemaEntry('secrets.get'),
	'secrets.keypair': browserbaseSchemaEntry('secrets.keypair'),
	'secrets.list': browserbaseSchemaEntry('secrets.list'),
	'secrets.update': browserbaseSchemaEntry('secrets.update'),
	'sessions.create': browserbaseSchemaEntry('sessions.create'),
	'sessions.debug': browserbaseSchemaEntry('sessions.debug'),
	'sessions.get': browserbaseSchemaEntry('sessions.get'),
	'sessions.list': browserbaseSchemaEntry('sessions.list'),
	'sessions.logs': browserbaseSchemaEntry('sessions.logs'),
	'sessions.recordingDownloads.create': browserbaseSchemaEntry(
		'sessions.recordingDownloads.create',
	),
	'sessions.recordingDownloads.list': browserbaseSchemaEntry(
		'sessions.recordingDownloads.list',
	),
	'sessions.replays.get': browserbaseSchemaEntry('sessions.replays.get'),
	'sessions.replays.page': browserbaseSchemaEntry('sessions.replays.page'),
	'sessions.setLabels': browserbaseSchemaEntry('sessions.setLabels'),
	'sessions.update': browserbaseSchemaEntry('sessions.update'),
	'sessions.uploadFile': browserbaseSchemaEntry('sessions.uploadFile'),
	'webhooks.create': browserbaseSchemaEntry('webhooks.create'),
	'webhooks.delete': browserbaseSchemaEntry('webhooks.delete'),
	'webhooks.get': browserbaseSchemaEntry('webhooks.get'),
	'webhooks.list': browserbaseSchemaEntry('webhooks.list'),
	'webhooks.rotateSecret': browserbaseSchemaEntry('webhooks.rotateSecret'),
	'webhooks.update': browserbaseSchemaEntry('webhooks.update'),
} satisfies RequiredPluginEndpointSchemas<typeof browserbaseEndpointsNested>;

export const browserbaseEndpointMeta = {
	'agents.create': {
		riskLevel: 'write',
		description:
			'Create an Agent. Create a reusable agent. An agent defines a systemPrompt and resultSchema that guide its behavior for every run. Only name is required; an agent created with no systemPrompt behaves like an unconfigured run.',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Agent. Delete an agent. Runs that already referenced this agent are unaffected. Cannot be undone.',
	},
	'agents.get': {
		riskLevel: 'read',
		description:
			'Get an Agent. Retrieve an agent by ID. (GET /v1/agents/{agentId})',
	},
	'agents.list': {
		riskLevel: 'read',
		description:
			'List Agents. List agents across your account. Supports filtering by creation time.',
	},
	'agents.runs.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Run an Agent. Run a browser agent to complete the task by using web search and browser tooling. Optionally pass agentId to run a custom agent you've created. Starts an agent run that uses browser time and model tokens.",
	},
	'agents.runs.get': {
		riskLevel: 'read',
		description:
			"Get a Run. Retrieve the current status and details of a run, including its result and associated session information. To fetch the run's messages, use List Run Messages.",
	},
	'agents.runs.list': {
		riskLevel: 'read',
		description:
			'List Runs. List runs across your account. Supports filtering by status, by the agent they reference, and by creation time.',
	},
	'agents.runs.messages': {
		riskLevel: 'read',
		description:
			'List Run Messages. Returns a paginated list of messages produced by a run, in chronological order, with the oldest messages first. Messages conform to the AI SDK UIMessage format.',
	},
	'agents.runs.resume': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Resume a Run. Resume a PAUSED run with additional input. The reply in task is delivered to the agent as the answer to its pause request (the trailing pause tool call in the run's messages), and variables merge over the run's original variables. Resuming a run that is not paused returns a conflict.",
	},
	'agents.runs.stop': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop a Run. Request that an in-progress run stop. The run winds down and transitions to STOPPED. Stopping a run that has already finished returns a conflict.',
	},
	'agents.update': {
		riskLevel: 'write',
		description:
			'Update an Agent. Update an existing agent. Only the fields provided in the body are modified; omitted fields are left unchanged.',
	},
	'certificates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Certificate. Delete an uploaded certificate from your project by its ID. Session creation requests that still reference this ID in proxySettings.caCertificates fail with HTTP 400. Cannot be undone.',
	},
	'certificates.get': {
		riskLevel: 'read',
		description:
			'Get a Certificate. Retrieve metadata for an uploaded certificate by its ID, including its project ID and timestamps. The PEM content is not returned.',
	},
	'certificates.list': {
		riskLevel: 'read',
		description:
			'List Certificates. List the certificates uploaded to your project.',
	},
	'certificates.upload': {
		riskLevel: 'write',
		description:
			'Upload a Certificate. Upload a PEM file with one or more CA certificates (up to 100 MB). Pass the returned ID in proxySettings.caCertificates when creating a session so the browser trusts these certificates.',
	},
	'contexts.create': {
		riskLevel: 'write',
		description: 'Create a Context. (POST /v1/contexts)',
	},
	'contexts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Context. Cannot be undone. (DELETE /v1/contexts/{id})',
	},
	'contexts.get': {
		riskLevel: 'read',
		description: 'Get a Context. (GET /v1/contexts/{id})',
	},
	'downloads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Download. Delete a download file from storage and mark as deleted. Cannot be undone.',
	},
	'downloads.get': {
		riskLevel: 'read',
		description:
			'Get a Download. Get download metadata (Accept: application/json) or file content (Accept: application/octet-stream).',
	},
	'downloads.list': {
		riskLevel: 'read',
		description:
			'List Downloads. List all downloads for a session with optional filtering and pagination.',
	},
	'extensions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an Extension. Cannot be undone. (DELETE /v1/extensions/{id})',
	},
	'extensions.get': {
		riskLevel: 'read',
		description: 'Get an Extension. (GET /v1/extensions/{id})',
	},
	'extensions.upload': {
		riskLevel: 'write',
		description: 'Upload an Extension. (POST /v1/extensions)',
	},
	'fetch.page': {
		riskLevel: 'read',
		description:
			'Fetch a Page. Fetch a page and return its content, headers, and metadata. A metered read: each call counts against the plan.',
	},
	'functions.builds.get': {
		riskLevel: 'read',
		description: 'Get a Function Build. (GET /v1/functions/builds/{id})',
	},
	'functions.builds.list': {
		riskLevel: 'read',
		description: 'List Function Builds. (GET /v1/functions/builds)',
	},
	'functions.builds.logs': {
		riskLevel: 'read',
		description:
			'Get Function Build Logs. (GET /v1/functions/builds/{id}/logs)',
	},
	'functions.get': {
		riskLevel: 'read',
		description: 'Get a Function. (GET /v1/functions/{id})',
	},
	'functions.invocations.get': {
		riskLevel: 'read',
		description: 'Get an Invocation. (GET /v1/functions/invocations/{id})',
	},
	'functions.invocations.logs': {
		riskLevel: 'read',
		description:
			'Get Invocation Logs. (GET /v1/functions/invocations/{id}/logs)',
	},
	'functions.invoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Invoke a Function. Runs the Function on Browserbase compute.',
	},
	'functions.list': {
		riskLevel: 'read',
		description: 'List Functions. (GET /v1/functions)',
	},
	'functions.secrets.attach': {
		riskLevel: 'write',
		description:
			"Attach a Secret to a Function. Attach a secret to a Function, taking effect on the Function's next invocation. Note: Attaching a secret that is already attached succeeds to support idempotency.",
	},
	'functions.secrets.detach': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Detach a Secret from a Function. Detach a secret from a Function, taking effect on the Function's next invocation. Note: Detaching a secret that is not attached succeeds to support idempotency. Cannot be undone.",
	},
	'functions.secrets.list': {
		riskLevel: 'read',
		description:
			'List Function Secrets. List secrets attached to a function. Supports filtering by secret creation time. Returns metadata only.',
	},
	'functions.versions.get': {
		riskLevel: 'read',
		description: 'Get a Function Version. (GET /v1/functions/versions/{id})',
	},
	'functions.versions.invocations': {
		riskLevel: 'read',
		description: 'List Invocations for a Function Version.',
	},
	'functions.versions.list': {
		riskLevel: 'read',
		description: 'List Function Versions. (GET /v1/functions/{id}/versions)',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a Label. Create a project-owned label.',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Label. Delete a label and its session assignments, preserving the sessions. Missing and other-project labels are successful no-ops. Cannot be undone.',
	},
	'labels.list': {
		riskLevel: 'read',
		description:
			"List Labels. List the project's labels, newest first. Page by passing the previous response's nextCursor as cursor; a null nextCursor means there are no further pages.",
	},
	'labels.update': {
		riskLevel: 'write',
		description:
			'Update a Label. Rename a label, preserving its ID, creation time, and session assignments.',
	},
	'navigationPolicies.create': {
		riskLevel: 'write',
		description:
			'Create a Navigation Policy. Create a navigation policy for this project. Omitted fields take the defaults: enabled, block by default, block unknown domains, no category rules, and no overrides. Bind the policy to a session with browserSettings.riskPolicyId.',
	},
	'navigationPolicies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Navigation Policy. Delete a navigation policy. New sessions can no longer bind to it; running sessions keep the policy they started with. Cannot be undone.',
	},
	'navigationPolicies.get': {
		riskLevel: 'read',
		description:
			'Get a Navigation Policy. Retrieve a single navigation policy by ID.',
	},
	'navigationPolicies.list': {
		riskLevel: 'read',
		description:
			"List Navigation Policies. List the project's navigation policies, ordered by name.",
	},
	'navigationPolicies.update': {
		riskLevel: 'write',
		description:
			'Update a Navigation Policy. Update a navigation policy. Omitted fields keep their values; a supplied list replaces the stored list rather than adding to it. The change applies to sessions that start afterwards; running sessions keep the policy they started with.',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a Project. (GET /v1/projects/{id})',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List Projects. (GET /v1/projects)',
	},
	'projects.usage': {
		riskLevel: 'read',
		description: 'Get Project Usage. (GET /v1/projects/{id}/usage)',
	},
	'search.web': {
		riskLevel: 'read',
		description:
			'Web Search. Perform a web search and return structured results. A metered read: each call counts against the plan.',
	},
	'secrets.create': {
		riskLevel: 'write',
		description: 'Create a Secret. (POST /v1/secrets)',
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Secret. Cannot be undone. (DELETE /v1/secrets/{id})',
	},
	'secrets.get': {
		riskLevel: 'read',
		description: 'Get a Secret. (GET /v1/secrets/{id})',
	},
	'secrets.keypair': {
		riskLevel: 'read',
		description: 'Get a Keypair. (GET /v1/secrets/keypair)',
	},
	'secrets.list': {
		riskLevel: 'read',
		description:
			'List Secrets. List project secrets. Supports filtering by creation time.',
	},
	'secrets.update': {
		riskLevel: 'write',
		description:
			"Update a Secret. Replace a secret's value. The name cannot be changed; to rename, create a new secret and delete the old one.",
	},
	'sessions.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create a Session. Starts a cloud browser that is billed by the minute until it is released or times out.',
	},
	'sessions.debug': {
		riskLevel: 'read',
		description: 'Session Live URLs. (GET /v1/sessions/{id}/debug)',
	},
	'sessions.get': {
		riskLevel: 'read',
		description: 'Get a Session. (GET /v1/sessions/{id})',
	},
	'sessions.list': {
		riskLevel: 'read',
		description: 'List Sessions. (GET /v1/sessions)',
	},
	'sessions.logs': {
		riskLevel: 'read',
		description: 'Session Logs. (GET /v1/sessions/{id}/logs)',
	},
	'sessions.recordingDownloads.create': {
		riskLevel: 'write',
		description:
			'Create Session Recording Downloads. Requests one downloadable MP4 per recorded page of a session. Assembly runs asynchronously and every page returns as PENDING. Re-posting re-enqueues all pages and retries any that failed. Poll the GET endpoint for per-page status and, on standard (non-BYOS) projects, download URLs.',
	},
	'sessions.recordingDownloads.list': {
		riskLevel: 'read',
		description:
			'List Session Recording Downloads. Returns the per-page download status for a session, with a short-lived signed URL for each completed page on standard (non-BYOS) projects.',
	},
	'sessions.replays.get': {
		riskLevel: 'read',
		description:
			"Get Session Replay. Returns page metadata for a session replay, including timing information and the URL of each page's HLS playlist.",
	},
	'sessions.replays.page': {
		riskLevel: 'read',
		description:
			'Get Replay Page. Returns an HLS VOD media playlist (.m3u8) for a specific page of a session replay.',
	},
	'sessions.setLabels': {
		riskLevel: 'write',
		description:
			"Set Session Labels. Atomically replace a session's labels. Returns the response after the assignment commits.",
	},
	'sessions.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Update a Session. Setting status to REQUEST_RELEASE ends the session.',
	},
	'sessions.uploadFile': {
		riskLevel: 'write',
		description: 'Create Session Uploads. (POST /v1/sessions/{id}/uploads)',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create a Webhook. Register an HTTPS endpoint to receive events for this project. The response includes the signing secret, which is shown only here and when the secret is rotated. Store it before discarding the response. An endpoint may only be registered once per project. The response holds the signing secret; it is shown only here and on rotate.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Webhook. Delete a webhook. Deliveries stop immediately and the signing secret is retired. Events that occurred before the delete are not replayed if the endpoint is registered again. Cannot be undone.',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Get a Webhook. Retrieve a single webhook by ID. The signing secret is not included; it is only ever returned on create and rotate.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			"List Webhooks. List the project's webhooks, newest first. Signing secrets are not included. Page by passing the previous response's nextCursor as cursor; a null nextCursor means there are no further pages.",
	},
	'webhooks.rotateSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Rotate a Webhook signing secret. Issue a new signing secret for a webhook. By default the previous secret keeps verifying for 24 hours so a receiver can be updated without dropping deliveries; pass revokeImmediately to end that window at once. The new secret is returned only here.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Update a Webhook. Update a webhook's endpoint URL, its subscribed event types, or both. Omitted fields are left unchanged. eventTypes replaces the existing subscription rather than adding to it. The signing secret is unaffected.",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof browserbaseEndpointsNested
>;
