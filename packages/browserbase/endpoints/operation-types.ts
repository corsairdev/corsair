// Generated from Browserbase's OpenAPI spec (https://docs.browserbase.com/llms.txt,
// fetched 2026-11-27); browserbase-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type BrowserbaseJsonValue =
	| null
	| boolean
	| number
	| string
	| BrowserbaseJsonValue[]
	| { [key: string]: BrowserbaseJsonValue | undefined };

export const BROWSERBASE_OPERATION_IDS = [
	'agents.create',
	'agents.delete',
	'agents.get',
	'agents.list',
	'agents.runs.create',
	'agents.runs.get',
	'agents.runs.list',
	'agents.runs.messages',
	'agents.runs.resume',
	'agents.runs.stop',
	'agents.update',
	'certificates.delete',
	'certificates.get',
	'certificates.list',
	'certificates.upload',
	'contexts.create',
	'contexts.delete',
	'contexts.get',
	'downloads.delete',
	'downloads.get',
	'downloads.list',
	'extensions.delete',
	'extensions.get',
	'extensions.upload',
	'fetch.page',
	'functions.builds.get',
	'functions.builds.list',
	'functions.builds.logs',
	'functions.get',
	'functions.invocations.get',
	'functions.invocations.logs',
	'functions.invoke',
	'functions.list',
	'functions.secrets.attach',
	'functions.secrets.detach',
	'functions.secrets.list',
	'functions.versions.get',
	'functions.versions.invocations',
	'functions.versions.list',
	'labels.create',
	'labels.delete',
	'labels.list',
	'labels.update',
	'navigationPolicies.create',
	'navigationPolicies.delete',
	'navigationPolicies.get',
	'navigationPolicies.list',
	'navigationPolicies.update',
	'projects.get',
	'projects.list',
	'projects.usage',
	'search.web',
	'secrets.create',
	'secrets.delete',
	'secrets.get',
	'secrets.keypair',
	'secrets.list',
	'secrets.update',
	'sessions.create',
	'sessions.debug',
	'sessions.get',
	'sessions.list',
	'sessions.logs',
	'sessions.recordingDownloads.create',
	'sessions.recordingDownloads.list',
	'sessions.replays.get',
	'sessions.replays.page',
	'sessions.setLabels',
	'sessions.update',
	'sessions.uploadFile',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.rotateSecret',
	'webhooks.update',
] as const;

export type BrowserbaseOperationId = (typeof BROWSERBASE_OPERATION_IDS)[number];

export type BrowserbaseBrowserbaseProxyConfigInput = {
	/** Type of proxy. Always use 'browserbase' for the Browserbase managed proxy network. */
	type: 'browserbase';
	/** ID of a managed static proxy assigned to your organization. Cannot be combined with geolocation. */
	proxyId?: string;
	/** Geographic location for the proxy. Optional. */
	geolocation?: {
		/** Name of the city. Use spaces for multi-word city names. Optional. */
		city?: string;
		/** US state code (2 characters). Must also specify US as the country. Optional. */
		state?: string;
		/** Country code in ISO 3166-1 alpha-2 format */
		country: string;
	};
	/** Domain pattern for which this proxy should be used. If omitted, defaults to all domains. Optional. */
	domainPattern?: string;
};

export type BrowserbaseExternalProxyConfigInput = {
	/** Type of proxy. Always 'external' for this config. */
	type: 'external';
	/** Server URL for external proxy. Required. */
	server: string;
	/** Domain pattern for which this proxy should be used. If omitted, defaults to all domains. Optional. */
	domainPattern?: string;
	/** Username for external proxy authentication. Optional. */
	username?: string;
	/** Password for external proxy authentication. Optional. */
	password?: string;
};

export type BrowserbaseNoneProxyConfigInput = {
	/** Type of proxy. Always 'none' for this config. */
	type: 'none';
	/** Domain pattern for which this proxy should be used. If omitted, defaults to all domains. Optional. */
	domainPattern?: string;
};

/** A reusable agent. Referenced by `agentId` to apply a system prompt to every run that uses the agent. */
export type BrowserbaseAgent = {
	/** Unique identifier for the agent. Use this value as `agentId` when creating an agent run. */
	agentId?: string | null;
	/** Human-readable name for the agent. Used to identify the agent in the dashboard and API responses. */
	name?: string | null;
	/** System prompt applied to every run that uses this agent. */
	systemPrompt?: string | null;
	/** [JSON Schema](https://json-schema.org/specification) that runs referencing this agent will aim to conform their `result` to. Can be overridden per run by passing `resultSchema` on the run request. */
	resultSchema?: Record<string, BrowserbaseJsonValue> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

/** One execution of an agent against a task. Created in `pending` and transitioned through `running` → `completed`/`failed` by the runner. */
export type BrowserbaseAgentRun = {
	/** Unique identifier for the run. */
	runId?: string | null;
	/** The ID of the agent applied to this run, if any. Omitted for ad-hoc runs. */
	agentId?: string | null;
	/** The original task description. */
	task?: string | null;
	/** Current status of the run. - `PENDING` - agent will run soon - `RUNNING` - agent is currently running - `COMPLETED` - agent has finished running - `FAILED` - agent has failed the run - `STOPPED` - run was stopped by the user - `TIMED_OUT` - run exceeded maximum time - `PAUSED` - run is paused… */
	status?: string | null;
	/** The Browserbase session ID powering this run. */
	sessionId?: string | null;
	/** External sandbox identifier assigned by the runner. Optional. */
	sandboxId?: string | null;
	/** Per-run [JSON Schema](https://json-schema.org/specification) override for the result shape. When unset, the agent's default `resultSchema` applies. */
	resultSchema?: Record<string, BrowserbaseJsonValue> | null;
	/** The agent's structured result for the run. Only present when the run has finished and output is available. The result conforms to the provided [JSON Schema](https://json-schema.org/specification) when one is set. */
	result?: Record<string, BrowserbaseJsonValue> | null;
	cause?: {
		/** Structured failure code (e.g., RUNNER_HEARTBEAT_LOST). */
		code?: string | null;
		/** Human-readable failure detail. */
		message?: string | null;
	} | null;
	startedAt?: string | null;
	endedAt?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type BrowserbaseCertificate = {
	id?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	/** The Project ID linked to the uploaded Certificate. */
	projectId?: string | null;
};

export type BrowserbaseContext = {
	id?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	/** The Project ID linked to the uploaded Context. */
	projectId?: string | null;
	/** Optional user-defined name for the Context. Leading and trailing whitespace is trimmed before storage. Names are unique within the project among active Contexts, compared case-insensitively. */
	name?: string | null;
};

export type BrowserbaseDownload = {
	/** Unique identifier for the download. */
	id?: string | null;
	/** The Session ID this download belongs to. */
	sessionId?: string | null;
	/** The filename of the downloaded file. */
	filename?: string | null;
	/** The MIME type of the file. */
	mimeType?: string | null;
	/** File size in bytes. */
	size?: number | null;
	/** SHA256 checksum of the file. */
	checksum?: string | null;
	/** Timestamp when the file was downloaded. */
	createdAt?: string | null;
};

export type BrowserbaseExtension = {
	id?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	fileName?: string | null;
	/** The Project ID linked to the uploaded Extension. */
	projectId?: string | null;
};

export type BrowserbaseFunction = {
	id?: string | null;
	projectId?: string | null;
	name?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type BrowserbaseFunctionBuild = {
	id?: string | null;
	projectId?: string | null;
	request?: {
		entrypoint?: string | null;
		functionNames?: Array<string> | null;
	} | null;
	status?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	startedAt?: string | null;
	endedAt?: string | null;
	expiresAt?: string | null;
	builtFunctions?: Array<
		BrowserbaseFunction & {
			createdVersion?: BrowserbaseFunctionVersion | null;
		}
	> | null;
	cause?: {
		code?: string | null;
		message?: string | null;
	} | null;
};

export type BrowserbaseFunctionBuildLog = {
	message?: string | null;
	timestamp?: number | null;
};

export type BrowserbaseFunctionVersion = {
	id?: string | null;
	projectId?: string | null;
	functionId?: string | null;
	functionBuildId?: string | null;
	/** JSON object that can be stored in a JSONB column */
	sessionCreateParams?: Record<string, BrowserbaseJsonValue> | null;
	/** JSON object that can be stored in a JSONB column */
	userParamsSchema?: Record<string, BrowserbaseJsonValue> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type BrowserbaseInvocation = {
	id?: string | null;
	projectId?: string | null;
	functionId?: string | null;
	versionId?: string | null;
	sessionId?: string | null;
	region?: string | null;
	/** JSON object that can be stored in a JSONB column */
	params?: Record<string, BrowserbaseJsonValue> | null;
	status?: string | null;
	/** Any JSON-serializable value that can be stored in a JSONB column */
	results?:
		| (
				| string
				| number
				| boolean
				| Array<BrowserbaseJsonValue>
				| Record<string, BrowserbaseJsonValue>
		  )
		| null;
	createdAt?: string | null;
	updatedAt?: string | null;
	startedAt?: string | null;
	endedAt?: string | null;
	expiresAt?: string | null;
};

export type BrowserbaseInvocationLog = {
	message?: string | null;
	timestamp?: number | null;
};

/** A project-owned session label. */
export type BrowserbaseLabel = {
	/** Stable identifier of the label. */
	id?: string | null;
	/** The project that owns the label. */
	projectId?: string | null;
	/** Display name, unique ignoring case within the project. */
	name?: string | null;
	/** UTC timestamp when the label was created. */
	createdAt?: string | null;
	/** UTC timestamp when the label was last renamed. */
	updatedAt?: string | null;
};

/** Rules for which domains a browser session may navigate to. Bind a policy to a session with `browserSettings.riskPolicyId`; Browserbase then allows or blocks each navigation by the policy's overrides, its category rules, and finally its default decision. A session keeps the policy as it was when… */
export type BrowserbaseNavigationPolicy = {
	/** Unique identifier for the navigation policy. */
	id?: string | null;
	/** The project the policy belongs to. */
	projectId?: string | null;
	/** Display name. A policy's id identifies it, not its name. */
	name?: string | null;
	/** Free-form notes about the policy. */
	description?: string | null;
	/** Whether the policy can be bound to new sessions. Running sessions keep the policy they started with. A disabled policy stays editable and can be re-enabled. */
	enabled?: boolean | null;
	/** Decision for each of a domain's categories that has no category rule. The strictest of a domain's category decisions applies, and overrides take precedence. */
	defaultDecision?: string | null;
	/** Navigation categories. Browserbase blocks a domain in any blocked category, even if it is also in an allowed one. */
	allowedCategories?: Array<string> | null;
	/** Navigation categories. Browserbase blocks a domain in any blocked category, even if it is also in an allowed one. */
	blockedCategories?: Array<string> | null;
	/** Decision for a domain, or one of its categories, that Browserbase can't classify. It counts as one of the domain's category decisions, so the strictest still applies. */
	unknownDomainBehavior?: string | null;
	/** Per-host decisions that take precedence over category rules and the default. Each host may appear once. */
	domainOverrides?: Array<{
		/** Host the override applies to, for example `example.com`. Matching is case-insensitive and covers subdomains. */
		domain?: string | null;
		/** Decision for navigations to this host. */
		decision?: string | null;
	}> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type BrowserbaseProject = {
	id?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	name?: string | null;
	ownerId?: string | null;
	defaultTimeout?: number | null;
	/** The maximum number of sessions that this project can run concurrently. */
	concurrency?: number | null;
};

export type BrowserbaseProjectUsage = {
	browserMinutes?: number | null;
	proxyBytes?: number | null;
};

export type BrowserbaseRecordingDownload = {
	/** Recorded page (tab) within the session, e.g. "0", "1". */
	pageId?: string | null;
	status?: BrowserbaseRecordingDownloadStatus | null;
	/** Short-lived signed CDN URL, re-minted each GET. Present only when COMPLETED on a standard (non-BYOS) project. */
	downloadUrl?: string | null;
	/** When the MP4 was created. Present only when COMPLETED on a standard (non-BYOS) project. */
	completedAt?: string | null;
};

/** Per-page MP4 assembly state. `NOT_REQUESTED`: no download has been requested for the session yet. `PENDING`: assembly is enqueued or in progress. `COMPLETED`: the MP4 is ready. `FAILED`: assembly failed; POST again to retry. */
export type BrowserbaseRecordingDownloadStatus = string;

export type BrowserbaseReplayPage = {
	pageId?: string | null;
	url?: string | null;
	startTimeMs?: number | null;
	endTimeMs?: number | null;
};

export type BrowserbaseSecret = {
	/** Unique identifier of the secret. */
	id?: string | null;
	/** The name the secret value is stored under. */
	secretKey?: string | null;
	/** Time at which the secret was created, in UTC, using RFC 3339 format, e.g. 2026-01-19T00:00:00.000Z. */
	createdAt?: string | null;
	/** Time at which the secret's value was last set, in UTC, using RFC 3339 format, e.g. 2026-01-20T00:00:00.000Z. */
	updatedAt?: string | null;
};

export type BrowserbaseSecretsKeypair = {
	/** Identifier of the keypair the public key was minted from. Pass this back when creating a secret so the ciphertext records which keypair sealed it, which keeps decryption correct across keypair rotation. */
	id?: string | null;
	/** The project's HPKE public encryption key, base64-encoded. Encrypt secret values with this key before creating a secret. */
	publicKey?: string | null;
};

export type BrowserbaseSession = {
	id?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	/** The Project ID linked to the Session. */
	projectId?: string | null;
	startedAt?: string | null;
	endedAt?: string | null;
	expiresAt?: string | null;
	status?: string | null;
	/** Size of the browser used for the session. */
	size?: string | null;
	/** Bytes used via the [Proxy](/features/stealth-mode#proxies-and-residential-ips) */
	proxyBytes?: number | null;
	/** Indicates if the Session was created to be kept alive upon disconnections */
	keepAlive?: boolean | null;
	/** Optional. The Context linked to the Session. */
	contextId?: string | null;
	/** The region where the Session is running. */
	region?: string | null;
	/** Arbitrary user metadata to attach to the session. To learn more about user metadata, see [User Metadata](/features/sessions#user-metadata). */
	userMetadata?: Record<string, BrowserbaseJsonValue> | null;
};

export type BrowserbaseSessionLiveUrls = {
	debuggerFullscreenUrl?: string | null;
	debuggerUrl?: string | null;
	pages?: Array<{
		id?: string | null;
		url?: string | null;
		faviconUrl?: string | null;
		title?: string | null;
		debuggerUrl?: string | null;
		debuggerFullscreenUrl?: string | null;
	}> | null;
	wsUrl?: string | null;
};

export type BrowserbaseSessionLog = {
	method?: string | null;
	pageId?: number | null;
	sessionId?: string | null;
	request?: {
		/** milliseconds that have elapsed since the UNIX epoch */
		timestamp?: number | null;
		params?: Record<string, BrowserbaseJsonValue> | null;
		rawBody?: string | null;
	} | null;
	response?: {
		/** milliseconds that have elapsed since the UNIX epoch */
		timestamp?: number | null;
		result?: Record<string, BrowserbaseJsonValue> | null;
		rawBody?: string | null;
	} | null;
	/** milliseconds that have elapsed since the UNIX epoch */
	timestamp?: number | null;
	frameId?: string | null;
	loaderId?: string | null;
};

/** A delivery endpoint for a project. Browserbase POSTs a signed event to it whenever one of its subscribed event types occurs. The signing secret is returned only when it is created or rotated. */
export type BrowserbaseWebhook = {
	/** Unique identifier for the webhook. */
	id?: string | null;
	/** The project the webhook belongs to. */
	projectId?: string | null;
	/** HTTPS URL that event deliveries are POSTed to. Must be publicly reachable. */
	endpoint?: string | null;
	/** Event types this webhook subscribes to. Unknown types are rejected. */
	eventTypes?: Array<string> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type BrowserbaseOperationInputs = {
	'agents.create': {
		/** Human-readable name for the agent. Used to identify the agent in the dashboard and API responses. */
		name: string;
		/** System prompt that steers the agent's behavior on every run that uses this agent. */
		systemPrompt?: string;
		/** An optional [JSON Schema](https://json-schema.org/specification) object. If provided, runs that reference this agent will aim to return a `result` that conforms to this schema when they complete. Can be overridden per run by passing `resultSchema` on the run request. */
		resultSchema?: Record<string, BrowserbaseJsonValue>;
	};
	'agents.delete': {
		/** The agent ID. */
		agentId: string;
	};
	'agents.get': {
		/** The agent ID. */
		agentId: string;
	};
	'agents.list': {
		/** Only return agents created on or after this timestamp (inclusive). RFC 3339, e.g. 2026-01-19T00:00:00Z. */
		startAt?: string;
		/** Only return agents created on or before this timestamp (inclusive). RFC 3339, e.g. 2026-01-20T00:00:00Z. */
		endAt?: string;
		/** Maximum number of results to return. */
		limit?: number;
		/** Pagination cursor. Pass the nextCursor from the previous response to fetch the next page. Omit to start from the first page. */
		cursor?: string;
	};
	'agents.runs.create': {
		/** Optionally run a specific [custom agent](/reference/api/create-an-agent) you've created by ID. The run will use the agent's `systemPrompt` and `resultSchema` unless overridden. */
		agentId?: string;
		/** A natural language description of the task the agent should accomplish. */
		task: string;
		/** An optional [JSON Schema](https://json-schema.org/specification) object. If provided, the agent will aim to return a `result` that conforms to this schema when the run completes. Overrides the referenced agent's default `resultSchema` for this run only. */
		resultSchema?: Record<string, BrowserbaseJsonValue>;
		/** Browser configuration for the agent's session. When omitted, runner defaults apply. */
		browserSettings?: {
			context?: {
				/** The Context ID. */
				id: string;
				/** Whether to persist the context after browsing. Defaults to false. */
				persist?: boolean;
			};
			/** Proxy configuration. Can be true for default proxy, or an array of proxy configurations. */
			proxies?:
				| Array<
						| BrowserbaseBrowserbaseProxyConfigInput
						| BrowserbaseExternalProxyConfigInput
						| BrowserbaseNoneProxyConfigInput
				  >
				| boolean;
			/** Proxy settings for the browser session. Optional. */
			proxySettings?: {
				/** The TLS certificate IDs to trust. Optional. */
				caCertificates?: Array<string>;
			};
			/** Domains the browser session may navigate to, including their subdomains. Restricts top-level navigations only. Omit or pass an empty list to allow every domain. */
			allowedDomains?: Array<string>;
			/** Set `true` to ignore TLS certificate errors in the browser session (for example, to reach hosts with expired or self-signed certificates). When omitted, your project's default applies. */
			ignoreCertificateErrors?: boolean;
			/** Set true to enable Browserbase Verified for the session. */
			verified?: boolean;
			/** Enable or disable session recording. Defaults to `true`. */
			recordSession?: boolean;
			/** Enable or disable session logging. Defaults to `true`. */
			logSession?: boolean;
		};
		/** Optional named variables the agent can reference as placeholders, i.e. `%variable%`. Each entry pairs a `value` the placeholder resolves to with an optional `description` that hints to the agent when it should be used. Values are not persisted. */
		variables?: Record<
			string,
			{
				/** The value the placeholder resolves to when the agent uses it. */
				value: string;
				/** Optional hint to the agent describing what this variable represents and when to use it. */
				description?: string;
			}
		>;
		/** Optional description of when the agent should pause and wait for input from your application (e.g. a verification code, an approval, or an answer from another system). When set, the agent is given a `pause` tool; calling it transitions the run to `PAUSED` (the agent's request is the trailing… */
		pauseWhen?: string;
	};
	'agents.runs.get': {
		/** The run ID. */
		runId: string;
	};
	'agents.runs.list': {
		/** Current status of the run. - `PENDING` - agent will run soon - `RUNNING` - agent is currently running - `COMPLETED` - agent has finished running - `FAILED` - agent has failed the run - `STOPPED` - run was stopped by the user - `TIMED_OUT` - run exceeded maximum time - `PAUSED` - run is paused… */
		status?:
			| 'PENDING'
			| 'RUNNING'
			| 'COMPLETED'
			| 'FAILED'
			| 'STOPPED'
			| 'TIMED_OUT'
			| 'PAUSED';
		/** Only return runs that reference this agent ID. */
		agentId?: string;
		/** Only return runs created on or after this timestamp (inclusive). RFC 3339, e.g. 2026-01-19T00:00:00Z. */
		startAt?: string;
		/** Only return runs created on or before this timestamp (inclusive). RFC 3339, e.g. 2026-01-20T00:00:00Z. */
		endAt?: string;
		/** Maximum number of results to return. */
		limit?: number;
		/** Pagination cursor. Pass the nextCursor from the previous response to fetch the next page. Omit to start from the first page. */
		cursor?: string;
	};
	'agents.runs.messages': {
		/** The `id` of the last message you've already received. The response will contain messages produced after that one, in chronological order. Omit on the first call. Pass the previous response's `nextSince` value to continue paging or to poll for new messages. */
		since?: string;
		/** Maximum number of messages to return. */
		limit?: number;
		/** Return every message after `since` in one response, ignoring `limit`. */
		all?: boolean;
		/** The run ID. */
		runId: string;
	};
	'agents.runs.resume': {
		/** The run ID. */
		runId: string;
		/** Additional input for the agent: the reply to its request for input, which is the trailing `pause` tool call in the run's messages (e.g. an answer or an approval). Delivered to the agent as the result of that pause call. */
		task?: string;
		/** Optional named variables the agent can reference as placeholders, i.e. `%variable%`. Each entry pairs a `value` the placeholder resolves to with an optional `description` that hints to the agent when it should be used. Values are not persisted. */
		variables?: Record<
			string,
			{
				/** The value the placeholder resolves to when the agent uses it. */
				value: string;
				/** Optional hint to the agent describing what this variable represents and when to use it. */
				description?: string;
			}
		>;
	};
	'agents.runs.stop': {
		/** The run ID. */
		runId: string;
	};
	'agents.update': {
		/** The agent ID. */
		agentId: string;
		/** Human-readable name for the agent. Used to identify the agent in the dashboard and API responses. */
		name?: string;
		/** New system prompt that steers the agent's behavior on every run that uses this agent. */
		systemPrompt?: string;
		/** An optional [JSON Schema](https://json-schema.org/specification) object. If provided, runs that reference this agent will aim to return a `result` that conforms to this schema when they complete. Can be overridden per run by passing `resultSchema` on the run request. */
		resultSchema?: Record<string, BrowserbaseJsonValue>;
	};
	'certificates.delete': {
		id: string;
	};
	'certificates.get': {
		id: string;
	};
	'certificates.list': Record<string, never>;
	'certificates.upload': {
		file: FileInput;
	};
	'contexts.create': {
		/** The Project ID. Can be found in [Settings](https://www.browserbase.com/settings). Optional - if not provided, the project will be inferred from the API key. */
		projectId?: string;
		/** Optional user-defined name for the Context. Leading and trailing whitespace is trimmed before storage. Names are unique within the project among active Contexts, compared case-insensitively. */
		name?: string;
	};
	'contexts.delete': {
		id: string;
	};
	'contexts.get': {
		id: string;
	};
	'downloads.delete': {
		/** The download ID to delete. */
		id: string;
	};
	'downloads.get': {
		/** The download ID. */
		id: string;
	};
	'downloads.list': {
		/** Filter downloads by session ID (required). */
		sessionId: string;
		/** Filter by exact filename match. */
		filename?: string;
		/** Filter by MIME type. */
		mimeType?: string;
		/** Minimum file size in bytes. */
		minSize?: number;
		/** Maximum file size in bytes. */
		maxSize?: number;
		/** Filter downloads created on or after this timestamp. */
		createdAfter?: string;
		/** Filter downloads created on or before this timestamp. */
		createdBefore?: string;
		/** Maximum number of results to return. */
		limit?: number;
		/** Number of results to skip for pagination. */
		offset?: number;
	};
	'extensions.delete': {
		id: string;
	};
	'extensions.get': {
		id: string;
	};
	'extensions.upload': {
		file: FileInput;
	};
	'fetch.page': {
		/** The URL to fetch */
		url: string;
		/** Whether to follow HTTP redirects */
		allowRedirects?: boolean;
		/** Whether to bypass TLS certificate verification */
		allowInsecureSsl?: boolean;
		/** Whether to enable proxy support for the request */
		proxies?: boolean;
		/** Output format for the response content. `raw` (default) returns the response body unchanged; `json` returns structured data (requires `schema`); `markdown` returns the page as markdown. */
		format?: 'raw' | 'json' | 'markdown';
		/** JSON Schema describing the desired structure of the response. Only used when `format` is `json`. */
		schema?: Record<string, BrowserbaseJsonValue>;
		/** ID of a context whose persisted cookies are sent with the request. */
		contextId?: string;
		/** Domains the fetch may reach, up to 1000. A listed domain also permits its subdomains: `example.com` permits `www.example.com`. A URL on any other host is rejected with a 400 before it is fetched, and so is a redirect to one when `allowRedirects` is set, before it is followed. An empty list (the… */
		allowedDomains?: Array<string>;
	};
	'functions.builds.get': {
		id: string;
	};
	'functions.builds.list': {
		offset?: number;
		limit?: number;
		status?: string;
	};
	'functions.builds.logs': {
		id: string;
	};
	'functions.get': {
		id: string;
	};
	'functions.invocations.get': {
		id: string;
	};
	'functions.invocations.logs': {
		id: string;
	};
	'functions.invoke': {
		id: string;
		/** JSON object that can be stored in a JSONB column */
		params?: Record<string, BrowserbaseJsonValue>;
		sessionCreateParams?: {
			/** Label names to assign after creation. Creates missing labels automatically. Assignment is best-effort and does not delay or fail session creation. */
			labels?: Array<string>;
			/** The uploaded Extension ID. See [Upload Extension](/reference/api/upload-an-extension). */
			extensionId?: string;
			browserSettings?: {
				context?: {
					/** The Context ID. */
					id: string;
					/** Whether or not to persist the context after browsing. Defaults to `false`. */
					persist?: boolean;
				};
				/** The uploaded Extension ID. See [Upload Extension](/reference/api/upload-an-extension). */
				extensionId?: string;
				viewport?: {
					/** The width of the browser. */
					width?: number;
					/** The height of the browser. */
					height?: number;
				};
				/** Enable or disable ad blocking in the browser. Defaults to `false`. */
				blockAds?: boolean;
				/** Enable or disable captcha solving in the browser. Defaults to `true`. */
				solveCaptchas?: boolean;
				/** Enable or disable session recording. Defaults to `true`. */
				recordSession?: boolean;
				/** Enable or disable session logging. Defaults to `true`. */
				logSession?: boolean;
				/** Advanced Browser Stealth Mode. Deprecated: use `verified` instead. */
				advancedStealth?: boolean;
				/** Verified Browser Mode */
				verified?: boolean;
				/** Custom selector for captcha image. See [Custom Captcha Solving](/features/stealth-mode#custom-captcha-solving) */
				captchaImageSelector?: string;
				/** Custom selector for captcha input. See [Custom Captcha Solving](/features/stealth-mode#custom-captcha-solving) */
				captchaInputSelector?: string;
				/** Operating system for stealth mode. Valid values: windows, mac, linux, mobile, tablet */
				os?: 'windows' | 'mac' | 'linux' | 'mobile' | 'tablet';
				/** Size of the browser. Larger sizes provide more resources to improve performance for intensive tasks. Defaults to `regular`. */
				size?: 'regular' | 'large' | 'xlarge';
				/** [NOT IN DOCS] Enable native select polyfill. This gives support a break-glass option to disable the polyfill. */
				enableNativeSelectPolyfill?: boolean;
				/** [NOT IN DOCS] Enable PDF viewer. This gives support a break-glass option to enable the viewer when users want to view PDFs in-browser. */
				enablePdfViewer?: boolean;
				/** [NOT IN DOCS] List of pre-installed extension names and custom extension ids to enable on the browser */
				extensions?: Array<'onepassword' | 'browser-events'>;
				/** An optional list of allowed domains for the session. If you pass one or more domains, Browserbase restricts top-level (main-frame) page navigations to the listed domains and their subdomains. For example, `example.com` also permits `www.example.com` and `a.b.example.com`, but not… */
				allowedDomains?: Array<string>;
				/** Set `true` to ignore TLS certificate errors in the browser session (for example, to reach hosts with expired or self-signed certificates). When omitted, your project's default applies. */
				ignoreCertificateErrors?: boolean;
				/** Navigation policy to enforce for the session. Must belong to the session's project and be enabled. The session keeps the policy as it was when the session started; later edits apply to sessions that start afterwards. Browserbase enforces it only when navigation policy enforcement is enabled for… */
				riskPolicyId?: string;
			};
			/** Proxy configuration. Can be true for default proxy, or an array of proxy configurations. */
			proxies?:
				| Array<
						| BrowserbaseBrowserbaseProxyConfigInput
						| BrowserbaseExternalProxyConfigInput
						| BrowserbaseNoneProxyConfigInput
				  >
				| boolean;
			/** Supplementary proxy settings. Optional. */
			proxySettings?: {
				/** The TLS certificate IDs to trust. Optional. */
				caCertificates?: Array<string>;
			};
			/** Arbitrary user metadata to attach to the session. To learn more about user metadata, see [User Metadata](/features/sessions#user-metadata). */
			userMetadata?: Record<string, BrowserbaseJsonValue>;
			/** Duration in seconds after which the function invocation will automatically end. Defaults to 900 (15 minutes). */
			timeout?: number;
		};
	};
	'functions.list': {
		offset?: number;
		limit?: number;
	};
	'functions.secrets.attach': {
		id: string;
		/** The id of the project secret to attach (the `id` returned by POST /v1/secrets). Idempotent: re-attaching an already-attached secret succeeds. */
		secretId: string;
	};
	'functions.secrets.detach': {
		id: string;
		secretId: string;
	};
	'functions.secrets.list': {
		/** Only return secrets created on or after this timestamp (inclusive). RFC 3339, e.g. 2026-01-19T00:00:00Z. */
		startAt?: string;
		/** Only return secrets created on or before this timestamp (inclusive). RFC 3339, e.g. 2026-01-20T00:00:00Z. */
		endAt?: string;
		/** Maximum number of results to return. */
		limit?: number;
		/** Pagination cursor. Pass the nextCursor from the previous response to fetch the next page. Keep the same filters across pages. Omit to start from the first page. */
		cursor?: string;
		id: string;
	};
	'functions.versions.get': {
		id: string;
	};
	'functions.versions.invocations': {
		offset?: number;
		limit?: number;
		status?: string;
		id: string;
	};
	'functions.versions.list': {
		offset?: number;
		limit?: number;
		id: string;
	};
	'labels.create': {
		/** Label name. Browserbase trims surrounding Unicode whitespace and preserves display capitalization. The trimmed name must contain 1–128 Unicode characters and no NUL characters. Names are unique ignoring case within the project. */
		name: string;
	};
	'labels.delete': {
		/** The label's identifier. */
		labelId: string;
	};
	'labels.list': {
		/** Maximum number of results to return. */
		limit?: number;
		/** Pagination cursor. Pass the nextCursor from the previous response to fetch the next page. Omit to start from the first page. */
		cursor?: string;
	};
	'labels.update': {
		/** The label's identifier. */
		labelId: string;
		/** Label name. Browserbase trims surrounding Unicode whitespace and preserves display capitalization. The trimmed name must contain 1–128 Unicode characters and no NUL characters. Names are unique ignoring case within the project. */
		name: string;
	};
	'navigationPolicies.create': {
		/** Display name. A policy's id identifies it, not its name. */
		name: string;
		/** Free-form notes about the policy. */
		description?: string;
		/** Whether the policy can be bound to new sessions. Running sessions keep the policy they started with. A disabled policy stays editable and can be re-enabled. */
		enabled?: boolean;
		/** Decision for each of a domain's categories that has no category rule. The strictest of a domain's category decisions applies, and overrides take precedence. */
		defaultDecision?: 'allow' | 'block';
		/** Navigation categories. Browserbase blocks a domain in any blocked category, even if it is also in an allowed one. */
		allowedCategories?: Array<
			| 'adult'
			| 'ai-tools'
			| 'alcohol-tobacco'
			| 'business'
			| 'child-abuse'
			| 'communication'
			| 'dating'
			| 'drugs'
			| 'education'
			| 'entertainment'
			| 'finance'
			| 'gambling'
			| 'games'
			| 'government-military'
			| 'hacking'
			| 'hate'
			| 'health'
			| 'illegal-activity'
			| 'infrastructure'
			| 'kids'
			| 'lifestyle'
			| 'malware'
			| 'newly-registered'
			| 'news'
			| 'parked-inactive'
			| 'phishing-scams'
			| 'piracy'
			| 'proxy-anonymizer'
			| 'search-portal'
			| 'self-harm'
			| 'shopping'
			| 'social-media'
			| 'society-culture'
			| 'sports'
			| 'technology'
			| 'terrorism-extremism'
			| 'travel'
			| 'url-shortener'
			| 'violence'
			| 'weapons'
		>;
		/** Navigation categories. Browserbase blocks a domain in any blocked category, even if it is also in an allowed one. */
		blockedCategories?: Array<
			| 'adult'
			| 'ai-tools'
			| 'alcohol-tobacco'
			| 'business'
			| 'child-abuse'
			| 'communication'
			| 'dating'
			| 'drugs'
			| 'education'
			| 'entertainment'
			| 'finance'
			| 'gambling'
			| 'games'
			| 'government-military'
			| 'hacking'
			| 'hate'
			| 'health'
			| 'illegal-activity'
			| 'infrastructure'
			| 'kids'
			| 'lifestyle'
			| 'malware'
			| 'newly-registered'
			| 'news'
			| 'parked-inactive'
			| 'phishing-scams'
			| 'piracy'
			| 'proxy-anonymizer'
			| 'search-portal'
			| 'self-harm'
			| 'shopping'
			| 'social-media'
			| 'society-culture'
			| 'sports'
			| 'technology'
			| 'terrorism-extremism'
			| 'travel'
			| 'url-shortener'
			| 'violence'
			| 'weapons'
		>;
		/** Decision for a domain, or one of its categories, that Browserbase can't classify. It counts as one of the domain's category decisions, so the strictest still applies. */
		unknownDomainBehavior?: 'allow' | 'block';
		/** Per-host decisions that take precedence over category rules and the default. Each host may appear once. */
		domainOverrides?: Array<{
			/** Host the override applies to, for example `example.com`. Matching is case-insensitive and covers subdomains. */
			domain: string;
			/** Decision for navigations to this host. */
			decision: 'allow' | 'block';
		}>;
	};
	'navigationPolicies.delete': {
		/** The navigation policy ID. */
		id: string;
	};
	'navigationPolicies.get': {
		/** The navigation policy ID. */
		id: string;
	};
	'navigationPolicies.list': Record<string, never>;
	'navigationPolicies.update': {
		/** The navigation policy ID. */
		id: string;
		/** Display name. A policy's id identifies it, not its name. */
		name?: string;
		/** Free-form notes about the policy. */
		description?: string;
		/** Whether the policy can be bound to new sessions. Running sessions keep the policy they started with. A disabled policy stays editable and can be re-enabled. */
		enabled?: boolean;
		/** Decision for each of a domain's categories that has no category rule. The strictest of a domain's category decisions applies, and overrides take precedence. */
		defaultDecision?: 'allow' | 'block';
		/** Navigation categories. Browserbase blocks a domain in any blocked category, even if it is also in an allowed one. */
		allowedCategories?: Array<
			| 'adult'
			| 'ai-tools'
			| 'alcohol-tobacco'
			| 'business'
			| 'child-abuse'
			| 'communication'
			| 'dating'
			| 'drugs'
			| 'education'
			| 'entertainment'
			| 'finance'
			| 'gambling'
			| 'games'
			| 'government-military'
			| 'hacking'
			| 'hate'
			| 'health'
			| 'illegal-activity'
			| 'infrastructure'
			| 'kids'
			| 'lifestyle'
			| 'malware'
			| 'newly-registered'
			| 'news'
			| 'parked-inactive'
			| 'phishing-scams'
			| 'piracy'
			| 'proxy-anonymizer'
			| 'search-portal'
			| 'self-harm'
			| 'shopping'
			| 'social-media'
			| 'society-culture'
			| 'sports'
			| 'technology'
			| 'terrorism-extremism'
			| 'travel'
			| 'url-shortener'
			| 'violence'
			| 'weapons'
		>;
		/** Navigation categories. Browserbase blocks a domain in any blocked category, even if it is also in an allowed one. */
		blockedCategories?: Array<
			| 'adult'
			| 'ai-tools'
			| 'alcohol-tobacco'
			| 'business'
			| 'child-abuse'
			| 'communication'
			| 'dating'
			| 'drugs'
			| 'education'
			| 'entertainment'
			| 'finance'
			| 'gambling'
			| 'games'
			| 'government-military'
			| 'hacking'
			| 'hate'
			| 'health'
			| 'illegal-activity'
			| 'infrastructure'
			| 'kids'
			| 'lifestyle'
			| 'malware'
			| 'newly-registered'
			| 'news'
			| 'parked-inactive'
			| 'phishing-scams'
			| 'piracy'
			| 'proxy-anonymizer'
			| 'search-portal'
			| 'self-harm'
			| 'shopping'
			| 'social-media'
			| 'society-culture'
			| 'sports'
			| 'technology'
			| 'terrorism-extremism'
			| 'travel'
			| 'url-shortener'
			| 'violence'
			| 'weapons'
		>;
		/** Decision for a domain, or one of its categories, that Browserbase can't classify. It counts as one of the domain's category decisions, so the strictest still applies. */
		unknownDomainBehavior?: 'allow' | 'block';
		/** Per-host decisions that take precedence over category rules and the default. Each host may appear once. */
		domainOverrides?: Array<{
			/** Host the override applies to, for example `example.com`. Matching is case-insensitive and covers subdomains. */
			domain: string;
			/** Decision for navigations to this host. */
			decision: 'allow' | 'block';
		}>;
	};
	'projects.get': {
		id: string;
	};
	'projects.list': Record<string, never>;
	'projects.usage': {
		id: string;
	};
	'search.web': {
		/** The search query string */
		query: string;
		/** Number of results to return */
		numResults?: number;
		/** Only return results from these domains. Entries can be a hostname (example.com), a hostname with a path prefix (example.com/docs), or a wildcard subdomain (*.example.com). The `parallel` provider allows one list, not both, with at most 200 domains and no scheme, port, query string, or fragment. */
		includeDomains?: Array<string>;
		/** Never return results from these domains. Accepts the same entry formats as includeDomains. Not supported with the people category. */
		excludeDomains?: Array<string>;
		/** Only return results published after this date-time (RFC 3339, for example 2026-01-01T00:00:00Z). The `parallel` provider rounds it up to a whole UTC day. Not supported with the company or people categories. */
		startPublishedDate?: string;
		/** Only return results published before this date-time (RFC 3339, for example 2026-01-01T00:00:00Z). Only the `exa` provider supports this filter. Not supported with the company or people categories. */
		endPublishedDate?: string;
		/** Focus the search on a category of content. Only the `exa` provider supports this filter. */
		category?:
			| 'company'
			| 'publication'
			| 'news'
			| 'personal site'
			| 'financial report'
			| 'people';
		/** Two-letter ISO 3166-1 country code of the end user. Localizes ranking without restricting results to sources from that country. The `parallel` provider supports only [some countries](https://docs.browserbase.com/platform/search/overview#appendix-supported-countries). */
		userLocation?: string;
		/** Filter unsafe content from the results. Defaults to `false`. Only the `exa` provider supports `true`. */
		moderation?: boolean;
		/** The task intent and soft preferences for the search, in natural language. Adds context to query without replacing it. */
		objective?: string;
		/** Refetch a page when the cached copy is older than this many hours. Omit to use the provider default. A provider can return an older cached copy when a live fetch fails. */
		maxAgeHours?: number;
		/** Return the passages of each page most relevant to the query. Defaults to false. */
		excerpts?: boolean;
		provider?: ('parallel' | 'exa') | 'parallel' | 'exa';
		mode?:
			| ('fast' | 'advanced' | 'deep-lite' | 'deep')
			| ('fast' | 'advanced')
			| ('fast' | 'deep-lite' | 'deep');
	};
	'secrets.create': {
		/** The name to store the secret value under. */
		secretKey: string;
		/** The secret value encrypted with HPKE. To seal the secret value before sending, get the project's public key from GET /v1/secrets/keypair. Decode the publicKey using base64 into the raw 32-byte public key. Then, use HPKE Base mode (RFC 9180) with the following algorithm suite: DHKEM(X25519,… */
		sealedSecretValue: string;
		/** The `id` returned by GET /v1/secrets/keypair, identifying the keypair whose public key encrypted the value. Recorded with the secret so decryption stays correct across keypair rotation. */
		keypairId: string;
	};
	'secrets.delete': {
		/** The id of the project secret to delete. */
		id: string;
	};
	'secrets.get': {
		/** The id of the project secret to retrieve. */
		id: string;
	};
	'secrets.keypair': Record<string, never>;
	'secrets.list': {
		/** Only return secrets created on or after this timestamp (inclusive). RFC 3339, e.g. 2026-01-19T00:00:00Z. */
		startAt?: string;
		/** Only return secrets created on or before this timestamp (inclusive). RFC 3339, e.g. 2026-01-20T00:00:00Z. */
		endAt?: string;
		/** Maximum number of results to return. */
		limit?: number;
		/** Pagination cursor. Pass the nextCursor from the previous response to fetch the next page. Omit to start from the first page. */
		cursor?: string;
	};
	'secrets.update': {
		/** The id of the project secret to update. */
		id: string;
		/** The new secret value encrypted with HPKE. To seal the secret value before sending, get the project's public key from GET /v1/secrets/keypair. Decode the publicKey using base64 into the raw 32-byte public key. Then, use HPKE Base mode (RFC 9180) with the following algorithm suite: DHKEM(X25519,… */
		sealedSecretValue: string;
		/** The `id` returned by GET /v1/secrets/keypair, identifying the keypair whose public key encrypted the value. Recorded with the secret so decryption stays correct across keypair rotation. */
		keypairId: string;
	};
	'sessions.create': {
		/** Label names to assign after creation. Creates missing labels automatically. Assignment is best-effort and does not delay or fail session creation. */
		labels?: Array<string>;
		/** The Project ID. Can be found in [Settings](https://www.browserbase.com/settings). Optional - if not provided, the project will be inferred from the API key. */
		projectId?: string;
		/** The uploaded Extension ID. See [Upload Extension](/reference/api/upload-an-extension). */
		extensionId?: string;
		browserSettings?: {
			context?: {
				/** The Context ID. */
				id: string;
				/** Whether or not to persist the context after browsing. Defaults to `false`. */
				persist?: boolean;
			};
			/** The uploaded Extension ID. See [Upload Extension](/reference/api/upload-an-extension). */
			extensionId?: string;
			viewport?: {
				/** The width of the browser. */
				width?: number;
				/** The height of the browser. */
				height?: number;
			};
			/** Enable or disable ad blocking in the browser. Defaults to `false`. */
			blockAds?: boolean;
			/** Enable or disable captcha solving in the browser. Defaults to `true`. */
			solveCaptchas?: boolean;
			/** Enable or disable session recording. Defaults to `true`. */
			recordSession?: boolean;
			/** Enable or disable session logging. Defaults to `true`. */
			logSession?: boolean;
			/** Advanced Browser Stealth Mode. Deprecated: use `verified` instead. */
			advancedStealth?: boolean;
			/** Verified Browser Mode */
			verified?: boolean;
			/** Custom selector for captcha image. See [Custom Captcha Solving](/features/stealth-mode#custom-captcha-solving) */
			captchaImageSelector?: string;
			/** Custom selector for captcha input. See [Custom Captcha Solving](/features/stealth-mode#custom-captcha-solving) */
			captchaInputSelector?: string;
			/** Operating system for stealth mode. Valid values: windows, mac, linux, mobile, tablet */
			os?: 'windows' | 'mac' | 'linux' | 'mobile' | 'tablet';
			/** Size of the browser. Larger sizes provide more resources to improve performance for intensive tasks. Defaults to `regular`. */
			size?: 'regular' | 'large' | 'xlarge';
			/** An optional list of allowed domains for the session. If you pass one or more domains, Browserbase restricts top-level (main-frame) page navigations to the listed domains and their subdomains. For example, `example.com` also permits `www.example.com` and `a.b.example.com`, but not… */
			allowedDomains?: Array<string>;
			/** Set `true` to ignore TLS certificate errors in the browser session (for example, to reach hosts with expired or self-signed certificates). When omitted, your project's default applies. */
			ignoreCertificateErrors?: boolean;
			/** Navigation policy to enforce for the session. Must belong to the session's project and be enabled. The session keeps the policy as it was when the session started; later edits apply to sessions that start afterwards. Browserbase enforces it only when navigation policy enforcement is enabled for… */
			riskPolicyId?: string;
		};
		/** Duration in seconds after which the session will automatically end. Defaults to the Project's `defaultTimeout`. Minimum 60 seconds, maximum 21600 seconds (6 hours). */
		timeout?: number;
		/** Set to true to keep the session alive even after disconnections. Available on the Hobby Plan and above. */
		keepAlive?: boolean;
		/** Proxy configuration. Can be true for default proxy, or an array of proxy configurations. */
		proxies?:
			| Array<
					| BrowserbaseBrowserbaseProxyConfigInput
					| BrowserbaseExternalProxyConfigInput
					| BrowserbaseNoneProxyConfigInput
			  >
			| boolean;
		/** Supplementary proxy settings. Optional. */
		proxySettings?: {
			/** The TLS certificate IDs to trust. Optional. */
			caCertificates?: Array<string>;
		};
		/** The region where the Session should run. */
		region?: 'us-west-2' | 'us-east-1' | 'eu-central-1' | 'ap-southeast-1';
		/** Arbitrary user metadata to attach to the session. To learn more about user metadata, see [User Metadata](/features/sessions#user-metadata). */
		userMetadata?: Record<string, BrowserbaseJsonValue>;
	};
	'sessions.debug': {
		/** Time-to-live of the generated live view URLs, in seconds. If omitted, the URLs expire with the session, up to a maximum of 21600 seconds (6 hours). */
		expiresIn?: number;
		id: string;
	};
	'sessions.get': {
		/** Include the session's label IDs and current names. */
		includeLabels?: boolean;
		id: string;
	};
	'sessions.list': {
		status?: 'PENDING' | 'RUNNING' | 'ERROR' | 'TIMED_OUT' | 'COMPLETED';
		/** Query sessions by user metadata. See [Querying Sessions by User Metadata](/features/sessions#querying-sessions-by-user-metadata) for the schema of this query. */
		q?: string;
	};
	'sessions.logs': {
		id: string;
	};
	'sessions.recordingDownloads.create': {
		/** Session ID */
		id: string;
	};
	'sessions.recordingDownloads.list': {
		/** Session ID */
		id: string;
	};
	'sessions.replays.get': {
		/** Session ID */
		id: string;
	};
	'sessions.replays.page': {
		/** Session ID */
		id: string;
		pageId: string;
	};
	'sessions.setLabels': {
		id: string;
		/** Complete replacement set of label names. Empty clears assignments; missing names create labels. */
		labels: Array<string>;
	};
	'sessions.update': {
		id: string;
		/** Set to `REQUEST_RELEASE` to request that the session complete. Use before session's timeout to avoid additional charges. */
		status: 'REQUEST_RELEASE';
	};
	'sessions.uploadFile': {
		id: string;
		file: FileInput;
	};
	'webhooks.create': {
		/** HTTPS URL that event deliveries are POSTed to. Must be publicly reachable. */
		endpoint: string;
		/** Event types this webhook subscribes to. Unknown types are rejected. */
		eventTypes: Array<
			| 'functions.builds.running'
			| 'functions.builds.completed'
			| 'functions.builds.failed'
			| 'functions.invocations.pending'
			| 'functions.invocations.running'
			| 'functions.invocations.completed'
			| 'functions.invocations.failed'
		>;
	};
	'webhooks.delete': {
		/** The webhook ID. */
		id: string;
	};
	'webhooks.get': {
		/** The webhook ID. */
		id: string;
	};
	'webhooks.list': {
		/** Maximum number of results to return. */
		limit?: number;
		/** Cursor from a previous response's `nextCursor`. Omit for the first page. */
		cursor?: string;
	};
	'webhooks.rotateSecret': {
		/** The webhook ID. */
		id: string;
		/** Expire the old secret at once instead of honouring it for 24 hours. Use when responding to a leak; deliveries signed with the old secret stop verifying immediately. */
		revokeImmediately?: boolean;
	};
	'webhooks.update': {
		/** The webhook ID. */
		id: string;
		/** HTTPS URL that event deliveries are POSTed to. Must be publicly reachable. */
		endpoint?: string;
		/** Event types this webhook subscribes to. Unknown types are rejected. */
		eventTypes?: Array<
			| 'functions.builds.running'
			| 'functions.builds.completed'
			| 'functions.builds.failed'
			| 'functions.invocations.pending'
			| 'functions.invocations.running'
			| 'functions.invocations.completed'
			| 'functions.invocations.failed'
		>;
	};
};

export type BrowserbaseOperationOutputs = {
	'agents.create': BrowserbaseAgent;
	'agents.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'agents.get': BrowserbaseAgent;
	'agents.list': {
		/** The page of matching agents. */
		data?: Array<BrowserbaseAgent> | null;
		/** The maximum number of results returned in this page. */
		limit?: number | null;
		/** Cursor for the next page. Pass it back as `cursor` on the next request to continue paging. null when there are no more results. */
		nextCursor?: string | null;
	};
	'agents.runs.create': BrowserbaseAgentRun;
	'agents.runs.get': BrowserbaseAgentRun;
	'agents.runs.list': {
		/** The page of matching agent runs. */
		data?: Array<BrowserbaseAgentRun> | null;
		/** The maximum number of results returned in this page. */
		limit?: number | null;
		/** Cursor for the next page. Pass it back as `cursor` on the next request to continue paging. null when there are no more results. */
		nextCursor?: string | null;
	};
	'agents.runs.messages': {
		/** The page of messages, in chronological order, with the oldest messages first. */
		data?: Array<{
			id?: string | null;
			createdAt?: string | null;
			/** An AI SDK response message (assistant or tool). */
			message?: {
				role?: string | null;
				/** Plain string (assistant text) or an array of typed parts. */
				content?:
					| (
							| string
							| Array<{
									/** text | reasoning | file | tool-call | tool-result */
									type?: string | null;
									text?: string | null;
									toolCallId?: string | null;
									toolName?: string | null;
									input?: BrowserbaseJsonValue | null;
									output?: BrowserbaseJsonValue | null;
									mediaType?: string | null;
									data?: string | null;
							  }>
					  )
					| null;
			} | null;
		}> | null;
		/** The `id` of the last message in `data`. Pass it back as `since` on the next request to continue paging, or to poll for new messages. `null` only when the run has no messages yet; in that case, omit `since` and retry. */
		nextSince?: string | null;
	};
	'agents.runs.resume': BrowserbaseAgentRun;
	'agents.runs.stop': BrowserbaseAgentRun;
	'agents.update': BrowserbaseAgent;
	'certificates.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'certificates.get': BrowserbaseCertificate;
	'certificates.list': Array<BrowserbaseCertificate>;
	'certificates.upload': BrowserbaseCertificate;
	'contexts.create': {
		id?: string | null;
		/** The public key to encrypt the user-data-directory. */
		publicKey?: string | null;
		/** The cipher algorithm used to encrypt the user-data-directory. AES-256-CBC is currently the only supported algorithm. */
		cipherAlgorithm?: string | null;
		/** The initialization vector size used to encrypt the user-data-directory. [Read more about how to use it](/features/contexts). */
		initializationVectorSize?: number | null;
	};
	'contexts.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'contexts.get': BrowserbaseContext;
	'downloads.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'downloads.get': BrowserbaseDownload;
	'downloads.list': {
		downloads?: Array<BrowserbaseDownload> | null;
		/** Total count of matching downloads. */
		total?: number | null;
		limit?: number | null;
		offset?: number | null;
	};
	'extensions.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'extensions.get': BrowserbaseExtension;
	'extensions.upload': BrowserbaseExtension;
	'fetch.page': {
		/** Unique identifier for the fetch request */
		id?: string | null;
		/** HTTP status code of the fetched response */
		statusCode?: number | null;
		/** Response headers as key-value pairs */
		headers?: Record<string, string> | null;
		/** The response body content. A string for `raw` and `markdown` formats; a structured object for `json` format (the schema-extracted result). */
		content?: (string | Record<string, BrowserbaseJsonValue>) | null;
		/** The MIME type of the response */
		contentType?: string | null;
		/** The character encoding of the response */
		encoding?: string | null;
	};
	'functions.builds.get': BrowserbaseFunctionBuild;
	'functions.builds.list': {
		data?: Array<BrowserbaseFunctionBuild> | null;
		total?: number | null;
	};
	'functions.builds.logs': {
		logs?: Array<BrowserbaseFunctionBuildLog> | null;
		total?: number | null;
	};
	'functions.get': BrowserbaseFunction;
	'functions.invocations.get': BrowserbaseInvocation & {
		cause?: {
			code?: string | null;
			message?: string | null;
		} | null;
	};
	'functions.invocations.logs': {
		logs?: Array<BrowserbaseInvocationLog> | null;
		total?: number | null;
	};
	'functions.invoke': BrowserbaseInvocation;
	'functions.list': {
		data?: Array<BrowserbaseFunction> | null;
		total?: number | null;
	};
	'functions.secrets.attach': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'functions.secrets.detach': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'functions.secrets.list': {
		/** The page of matching secrets. */
		data?: Array<BrowserbaseSecret> | null;
		/** The maximum number of results returned in this page. */
		limit?: number | null;
		/** Cursor for the next page. Pass it back as `cursor` on the next request to continue paging. null when there are no more results. */
		nextCursor?: string | null;
	};
	'functions.versions.get': BrowserbaseFunctionVersion;
	'functions.versions.invocations': {
		results?: Array<BrowserbaseInvocation> | null;
		total?: number | null;
	};
	'functions.versions.list': {
		results?: Array<BrowserbaseFunctionVersion> | null;
		total?: number | null;
	};
	'labels.create': BrowserbaseLabel;
	'labels.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'labels.list': {
		/** The page of matching labels. */
		data?: Array<BrowserbaseLabel> | null;
		/** The maximum number of results returned in this page. */
		limit?: number | null;
		/** Cursor for the next page. Pass it back as `cursor` on the next request to continue paging. null when there are no more results. */
		nextCursor?: string | null;
	};
	'labels.update': BrowserbaseLabel;
	'navigationPolicies.create': BrowserbaseNavigationPolicy;
	'navigationPolicies.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'navigationPolicies.get': BrowserbaseNavigationPolicy;
	'navigationPolicies.list': {
		/** The project's navigation policies, ordered by name. */
		data?: Array<BrowserbaseNavigationPolicy> | null;
	};
	'navigationPolicies.update': BrowserbaseNavigationPolicy;
	'projects.get': BrowserbaseProject;
	'projects.list': Array<BrowserbaseProject>;
	'projects.usage': BrowserbaseProjectUsage;
	'search.web': {
		/** Unique identifier for the request */
		requestId?: string | null;
		/** The search query that was executed */
		query?: string | null;
		/** The search provider that served the request. Can differ from the documented default when the project or the filters select another provider. */
		provider?: string | null;
		/** The search mode that served the request. */
		mode?: string | null;
		/** List of search results */
		results?: Array<{
			/** Unique identifier for the result */
			id?: string | null;
			/** The URL of the search result */
			url?: string | null;
			/** The title of the search result */
			title?: string | null;
			/** Author of the content if available */
			author?: string | null;
			/** Publication date in RFC 3339 format */
			publishedDate?: string | null;
			/** Image URL if available */
			image?: string | null;
			/** Favicon URL */
			favicon?: string | null;
			/** Passages from the page most relevant to the query. Only set when the request asks for excerpts. */
			excerpts?: Array<string> | null;
		}> | null;
	};
	'secrets.create': BrowserbaseSecret;
	'secrets.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'secrets.get': BrowserbaseSecret;
	'secrets.keypair': BrowserbaseSecretsKeypair;
	'secrets.list': {
		/** The page of matching secrets. */
		data?: Array<BrowserbaseSecret> | null;
		/** The maximum number of results returned in this page. */
		limit?: number | null;
		/** Cursor for the next page. Pass it back as `cursor` on the next request to continue paging. null when there are no more results. */
		nextCursor?: string | null;
	};
	'secrets.update': BrowserbaseSecret;
	'sessions.create': BrowserbaseSession & {
		/** WebSocket URL to connect to the Session. */
		connectUrl?: string | null;
		/** HTTP URL to connect to the Session. */
		seleniumRemoteUrl?: string | null;
		/** Signing key to use when connecting to the Session via HTTP. */
		signingKey?: string | null;
	};
	'sessions.debug': BrowserbaseSessionLiveUrls;
	'sessions.get': BrowserbaseSession & {
		/** Browserbase returns label IDs and current names only when includeLabels is true. An empty array means the session has no labels. */
		labels?: Array<{
			/** Stable identifier of the label. */
			id?: string | null;
			/** Display name, unique ignoring case within the project. */
			name?: string | null;
		}> | null;
		/** WebSocket URL to connect to the Session. */
		connectUrl?: string | null;
		/** HTTP URL to connect to the Session. */
		seleniumRemoteUrl?: string | null;
		/** Signing key to use when connecting to the Session via HTTP. */
		signingKey?: string | null;
	};
	'sessions.list': Array<BrowserbaseSession>;
	'sessions.logs': Array<BrowserbaseSessionLog>;
	'sessions.recordingDownloads.create': {
		downloads?: Array<BrowserbaseRecordingDownload> | null;
	};
	'sessions.recordingDownloads.list': {
		downloads?: Array<BrowserbaseRecordingDownload> | null;
	};
	'sessions.replays.get': {
		pages?: Array<BrowserbaseReplayPage> | null;
		pageCount?: number | null;
	};
	'sessions.replays.page': FileOutput;
	'sessions.setLabels': {
		labels?: Array<BrowserbaseLabel> | null;
	};
	'sessions.update': BrowserbaseSession;
	'sessions.uploadFile': {
		message?: string | null;
	};
	'webhooks.create': BrowserbaseWebhook & {
		/** HMAC-SHA256 signing secret, prefixed `whsec_`. Shown once here; store it now. Use it to verify the signature on every delivery. */
		secret?: string | null;
	};
	'webhooks.delete': {
		/** Browserbase accepted the call; it answered with no body. */
		success: true;
	};
	'webhooks.get': BrowserbaseWebhook;
	'webhooks.list': {
		/** The page of webhooks, newest first. */
		data?: Array<BrowserbaseWebhook> | null;
		/** The maximum number of results returned in this page. */
		limit?: number | null;
		/** Cursor for the next page. Pass it back as `cursor` to continue paging. null when there are no more results. */
		nextCursor?: string | null;
	};
	'webhooks.rotateSecret': {
		/** The new signing secret, prefixed `whsec_`. */
		secret?: string | null;
	};
	'webhooks.update': BrowserbaseWebhook;
};
