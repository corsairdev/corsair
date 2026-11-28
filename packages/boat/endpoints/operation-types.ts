// Generated from Boat's OpenAPI spec (https://docs.boat.dev/openapi/boat-v1.yaml,
// fetched 2026-11-28); boat-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileOutput } from 'corsair/http';

export type BoatJsonValue =
	| null
	| boolean
	| number
	| string
	| BoatJsonValue[]
	| { [key: string]: BoatJsonValue | undefined };

export const BOAT_OPERATION_IDS = [
	'account.getCallerAddress',
	'account.getDataRetention',
	'account.getLimits',
	'account.getMe',
	'account.updateDataRetention',
	'aiProxy.get',
	'aiProxy.getUsage',
	'aiProxy.update',
	'apiKeys.createScoped',
	'apiKeys.getUsage',
	'apiKeys.list',
	'apiKeys.revoke',
	'apiKeys.rotate',
	'ci.connectGithub',
	'ci.getJob',
	'ci.getJobLog',
	'ci.getOverview',
	'ci.setPublicRepos',
	'credentialProfiles.accounts.add',
	'credentialProfiles.accounts.delete',
	'credentialProfiles.accounts.list',
	'credentialProfiles.accounts.switch',
	'credentialProfiles.create',
	'credentialProfiles.customApis.delete',
	'credentialProfiles.customApis.set',
	'credentialProfiles.delete',
	'credentialProfiles.deleteKey',
	'credentialProfiles.list',
	'credentialProfiles.setKey',
	'credentialProfiles.update',
	'deletionOperations.get',
	'environments.addRepo',
	'environments.create',
	'environments.delete',
	'environments.deleteRepo',
	'environments.deleteSecretFile',
	'environments.deleteVar',
	'environments.list',
	'environments.setSecretFile',
	'environments.setVar',
	'environments.update',
	'environments.upgradeSandboxes',
	'namedSnapshots.delete',
	'namedSnapshots.get',
	'namedSnapshots.list',
	'namedSnapshots.save',
	'orgs.list',
	'orgs.setActive',
	'orgs.update',
	'repos.list',
	'repos.select',
	'sandboxes.addSshKey',
	'sandboxes.agent.getPrompt',
	'sandboxes.agent.interrupt',
	'sandboxes.agent.listConversations',
	'sandboxes.agent.listEvents',
	'sandboxes.agent.prompt',
	'sandboxes.agent.steer',
	'sandboxes.commands.attach',
	'sandboxes.commands.get',
	'sandboxes.commands.getLogs',
	'sandboxes.commands.getStatus',
	'sandboxes.commands.listHistory',
	'sandboxes.commands.run',
	'sandboxes.commands.stop',
	'sandboxes.create',
	'sandboxes.delete',
	'sandboxes.downloadArtifact',
	'sandboxes.files.createDownloadUrl',
	'sandboxes.files.createFolder',
	'sandboxes.files.createUploadUrl',
	'sandboxes.files.delete',
	'sandboxes.files.find',
	'sandboxes.files.getInfo',
	'sandboxes.files.list',
	'sandboxes.files.move',
	'sandboxes.files.read',
	'sandboxes.files.replace',
	'sandboxes.files.search',
	'sandboxes.files.setPermissions',
	'sandboxes.files.write',
	'sandboxes.fork',
	'sandboxes.get',
	'sandboxes.getAiUsage',
	'sandboxes.getDesktopUrl',
	'sandboxes.getNetworkPolicy',
	'sandboxes.getStop',
	'sandboxes.getUsage',
	'sandboxes.hostPort',
	'sandboxes.list',
	'sandboxes.listProcesses',
	'sandboxes.recover',
	'sandboxes.resume',
	'sandboxes.setAiAccess',
	'sandboxes.setNetworkPolicy',
	'sandboxes.share',
	'sandboxes.snapshots.deleteAll',
	'sandboxes.snapshots.getLatest',
	'sandboxes.snapshots.list',
	'sandboxes.stop',
	'sandboxes.unshare',
	'sandboxes.update',
	'savedSnapshots.delete',
	'savedSnapshots.get',
	'savedSnapshots.list',
	'savedSnapshots.save',
	'savedSnapshots.shares.create',
	'savedSnapshots.shares.list',
	'savedSnapshots.shares.revoke',
	'secrets.get',
	'secrets.update',
	'snapshots.delete',
	'snapshots.getDownload',
	'snapshots.getFile',
	'snapshots.getTree',
	'snapshots.list',
	'telemetry.delete',
	'telemetry.get',
	'telemetry.set',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.rotateSecret',
	'webhooks.update',
] as const;

export type BoatOperationId = (typeof BOAT_OPERATION_IDS)[number];

/** One AI credential in a credential profile. The `*-api-key` ids are API keys you can set with `PUT /credential-profiles/{profile}/keys/{credential}`. The sign-ins (`*-subscription`) and Bedrock (`*-bedrock`) are connected on the dashboard Agents & Proxying page, with the profile picked at the… */
export type BoatCredentialIdInput =
	| 'anthropic-api-key'
	| 'openai-api-key'
	| 'openrouter-api-key'
	| 'llmgateway-api-key'
	| 'deepseek-api-key'
	| 'moonshot-api-key'
	| 'mistral-api-key'
	| 'xai-api-key'
	| 'opencode-api-key'
	| 'claude-subscription'
	| 'chatgpt-subscription'
	| 'kimi-subscription'
	| 'mistral-vibe-subscription'
	| 'grok-subscription'
	| 'claude-bedrock'
	| 'codex-bedrock';

/** The outbound network policy that an environment gives its sandboxes. */
export type BoatEnvironmentNetworkPolicyInput = {
	/** `open`: no limit, also for a sandbox whose own policy is unset. `deny`: no connection. `allow`: only the entries of `allow`. */
	mode?: 'open' | 'deny' | 'allow';
	/** With mode `allow`, 1 to 100 entries, as in a sandbox policy. Empty or omitted with any other mode. */
	allow?: Array<string>;
	/** Who can connect to the sandboxes of this environment. `open`: anyone on the internet. `boat-only`: only boat; code in a sandbox cannot make a port public, and SSH, the desktop and raw ports stop. A caller outside the sandbox can still publish a port. Omitted in a request: the environment keeps… */
	inbound?: 'open' | 'boat-only';
	/** The public addresses that can still connect directly to the sandboxes of this environment when `inbound` is `boat-only`. The same rules as in a sandbox policy apply. In an answer: only when the request has `include=inboundAllow`. It is then always an array. */
	inboundAllow?: Array<string>;
};

export type BoatHostPortRequestInput = {
	/** Port the service listens on inside the sandbox. */
	port: number;
	/** Return an ungated URL instead of one that requires the `_token` query parameter. */
	public?: boolean;
	/** Set when the service listens on localhost (`127.0.0.1` or `::1`) only. The sandbox relays the URL to it. Leave unset for a service bound to `0.0.0.0`. Each call sets the value again. */
	localhost?: boolean;
	/** Display title for the hosted port. */
	title?: string;
};

/** What the sandbox may connect to. Send `mode`, `inbound` or both: at least one. The side that the request does not name stays as it is. `inbound` and `inboundAllow` are one side. A sandbox that sets one side has its own policy and no longer follows its environment; `mode: environment` makes it… */
export type BoatNetworkPolicyRequestInput = {
	/** `open`: no limit. `deny`: the sandbox opens no connection. `allow`: it connects only to the entries of `allow`. `environment`: no policy of its own; the sandbox follows the policy of its environment (open when the environment sets none). This is the default on create. In an organization… */
	mode?: 'open' | 'deny' | 'allow' | 'environment';
	/** With mode `allow`, 1 to 100 entries; empty or omitted with any other mode. An empty list with no `mode`, or with mode `open` or `deny`, means no list. Each entry is a domain (`github.com`), a wildcard (`*.github.com`, which covers the domain itself and every subdomain), a public IP address or a… */
	allow?: Array<string>;
	/** Who can connect to the sandbox. `open`: anyone on the internet, on the ports that the sandbox opens. `boat-only`: only boat. The host drops every other connection to the sandbox, so code inside cannot make a port public. SSH, editors, port forwards, the desktop and raw ports stop: their routes… */
	inbound?: 'open' | 'boat-only';
	/** The public addresses that can still connect directly to the sandbox when `inbound` is `boat-only`. Each entry is a public IPv4 or IPv6 address, or a public CIDR range. No domain, port or path. At most 50 entries. Private ranges, reserved ranges and `/0` are refused with 400… */
	inboundAllow?: Array<string>;
	/** Only on `PUT /sandboxes/{sandboxId}/network`: not on create, fork or environments. The entries to add to the list that the sandbox has. The entry rules of `inboundAllow` apply. It needs `inbound: boat-only` in the same request. Do not send it together with an `inboundAllow` that has entries.… */
	inboundAllowAdd?: Array<string>;
};

/** Set who can use an organization environment (owner or admin) or profile (owner). A change does not touch running sandboxes. A bad list returns `400 invalid_access`. */
export type BoatResourceAccessUpdateInput = {
	/** False opens it to every member. True limits it to owners, admins and `members`. */
	restricted: boolean;
	/** Member ids or emails of active members. Replaces the full list. */
	members?: Array<string>;
};

export type BoatSecretFileInput = {
	path: string;
	/** Secret file contents. Treat as sensitive. */
	contents: string;
};

export type BoatWebhookEventTypeInput =
	| 'sandbox.ready'
	| 'sandbox.error'
	| 'sandbox.archived'
	| 'sandbox.hydrated'
	| 'sandbox.degraded'
	| 'sandbox.recovered';

export type BoatAccountAiUsageResponse = BoatSuccessBase & {
	/** The wallet the usage is charged to. Null with `profile`. */
	accountId?: string | null;
	/** The credential profile whose requests are counted. Null without `profile`. */
	profileId?: string | null;
	/** First UTC day included. */
	since?: string | null;
	sandboxes?: Array<BoatSandboxAiUsage> | null;
	usage?: Array<BoatAiUsageRow> | null;
	totals?: BoatAiUsageTotals | null;
	dollars?: number | null;
};

export type BoatActiveOrgResponse = BoatSuccessBase & {
	type?: string | null;
	active?: {
		id?: string | null;
		name?: string | null;
		type?: string | null;
	} | null;
};

export type BoatAiProxySettings = BoatSuccessBase & {
	success?: boolean | null;
	/** The account the switch belongs to, a person or an organization. */
	accountId?: string | null;
	/** True when `accountId` is an organization. */
	org?: boolean | null;
	enabled?: boolean | null;
	enabledAt?: string | null;
	pricing?: {
		/** Charged to the account for each UTC day the proxy is on. */
		dailyDollars?: number | null;
		/** Charged per 1,000 proxied requests. */
		dollarsPer1000Requests?: number | null;
	} | null;
	/** The base URL sandboxes call instead of the providers. */
	proxyUrl?: string | null;
};

export type BoatAiUsageRow = {
	/** UTC day. */
	day?: string | null;
	/** The credential used: a `CredentialId`, or `custom:<NAME>` for a custom API. */
	credential?: string | null;
	/** The model the provider reported, or empty. */
	model?: string | null;
} & BoatAiUsageTotals;

/** Token counts are the numbers the provider reports in its replies. */
export type BoatAiUsageTotals = {
	requests?: number | null;
	/** Requests the provider answered with an HTTP error, or did not answer. */
	errors?: number | null;
	inputTokens?: number | null;
	outputTokens?: number | null;
	cacheReadTokens?: number | null;
	cacheWriteTokens?: number | null;
};

export type BoatApiKey = {
	id?: string | null;
	name?: string | null;
	/** Credential storage lane. Scoped secrets are never stored in the legacy hash column. */
	credentialLane?: string | null;
	keyPrefix?: string | null;
	keyLastFour?: string | null;
	/** Sandbox ID for a platform-managed machine key, or null for a user-created key. */
	sandboxId?: string | null;
	createdAt?: string | null;
	lastUsedAt?: string | null;
	usage?: BoatApiKeyRequestUsage | null;
	resources?: BoatApiKeyResourceTotals | null;
	expiresAt?: string | null;
	expired?: boolean | null;
	expiringSoon?: boolean | null;
	scope?: {
		expiresAt?: string | null;
		actions?: Array<string> | null;
		sandboxes?: (string | Array<string>) | null;
		environments?: (string | Array<string>) | null;
		/** `none`: the key reaches every sandbox and environment of the account. `limited`: only the listed sandboxes and environments. */
		restriction?: string | null;
		grandfathered?: boolean | null;
	} | null;
};

export type BoatApiKeyCatalog = {
	actions?: Array<string> | null;
	presets?: Record<string, Array<string>> | null;
	defaultTtl?: string | null;
	maxTtl?: string | null;
	/** Whether POST /api-keys/scoped currently accepts creation requests. */
	scopedCreationEnabled?: boolean | null;
	/** Session-only selector resources. Omitted when the caller authenticates with an API key. */
	scopeResources?: {
		sandboxes?: Array<BoatApiKeyScopeResource> | null;
		environments?: Array<BoatApiKeyScopeResource> | null;
	} | null;
};

export type BoatApiKeyCreatedResource = {
	kind?: string | null;
	id?: string | null;
	name?: string | null;
	state?: string | null;
	createdAt?: string | null;
};

export type BoatApiKeyRequestUsage = {
	/** Requests authenticated with this key during the current UTC day and the previous 29 UTC days. */
	requests?: number | null;
	windowDays?: number | null;
};

export type BoatApiKeyResourceTotals = {
	total?: number | null;
	sandboxes?: number | null;
	agents?: number | null;
};

export type BoatApiKeyRevokeResponse = BoatSuccessBase & {
	apiKeys?: Array<BoatApiKey> | null;
};

export type BoatApiKeyScopeResource = {
	id?: string | null;
	name?: string | null;
	organizationId?: string | null;
	organizationName?: string | null;
};

export type BoatApiKeySecretResponse = BoatSuccessBase & {
	apiKey?: BoatApiKey | null;
	/** Raw secret returned once. Store it before closing the response. */
	secret?: string | null;
	apiKeys?: Array<BoatApiKey> | null;
};

export type BoatApiKeyUsageResponse = BoatSuccessBase &
	BoatApiKey & {
		createdResources?: Array<BoatApiKeyCreatedResource> | null;
	};

export type BoatApiKeysResponse = BoatSuccessBase & {
	apiKeys?: Array<BoatApiKey> | null;
	catalog?: BoatApiKeyCatalog | null;
};

export type BoatCallerAddressResponse = BoatSuccessBase & {
	type?: string | null;
	/** The public address that this request comes from, as boat sees it. Null when boat cannot tell. Use it as an entry of `network.inboundAllow`. */
	address?: string | null;
};

export type BoatCiConnectResponse = BoatSuccessBase & {
	type?: string | null;
	/** Open it in a browser to install the app or authorize an existing installation. Valid 30 minutes. */
	installUrl?: string | null;
};

export type BoatCiInstallation = {
	/** GitHub App installation id. */
	id?: string | null;
	accountLogin?: string | null;
	accountType?: string | null;
	/** The organization that pays; null = the personal wallet. */
	teamId?: string | null;
	/** Jobs from this account's public repositories run on boat. */
	allowPublicRepos?: boolean | null;
	/** With allowPublicRepos: only runs these GitHub users authored and started run. Empty = anyone. */
	publicRepoUsers?: Array<string> | null;
	/** Where to choose the repositories on GitHub. */
	manageUrl?: string | null;
	repositories?: Array<BoatCiRepository> | null;
};

export type BoatCiJob = {
	/** GitHub workflow job id. */
	id?: string | null;
	repo?: string | null;
	runId?: string | null;
	jobName?: string | null;
	workflowName?: string | null;
	headBranch?: string | null;
	headSha?: string | null;
	/** The job on GitHub. */
	htmlUrl?: string | null;
	/** The runs-on label that matched. */
	label?: string | null;
	machineClass?: string | null;
	state?: BoatCiJobState | null;
	/** Why boat refused or could not start the job. */
	error?: string | null;
	/** The sandbox this job's runner started. */
	sandboxId?: string | null;
	/** kept = a failed /debug job's sandbox, kept 30 minutes. */
	sandboxState?: string | null;
	queuedAt?: string | null;
	runStartedAt?: string | null;
	finishedAt?: string | null;
	/** Queued on GitHub until a runner took it. */
	waitSeconds?: number | null;
	runSeconds?: number | null;
	/** Sandbox time of the job at the size's rate. */
	costDollars?: number | null;
};

export type BoatCiJobLogResponse = BoatSuccessBase & {
	type?: string | null;
	/** The GitHub log, one timestamped line each, last 1 MB. Empty before the job starts. */
	log?: string | null;
};

export type BoatCiJobResponse = BoatSuccessBase & {
	type?: string | null;
	job?: BoatCiJob | null;
};

/** queued and running are active. failed = boat could not start a sandbox; refused = boat never runs it (unknown label, public repository). */
export type BoatCiJobState = string;

export type BoatCiOverviewResponse = BoatSuccessBase & {
	type?: string | null;
	/** The four setup steps, the next one to do, and jobs boat did not run (grouped by repository and reason). */
	setup?: {
		complete?: boolean | null;
		next?: string | null;
		steps?: Array<{
			id?: string | null;
			title?: string | null;
			done?: boolean | null;
			detail?: string | null;
		}> | null;
		problems?: Array<{
			jobId?: string | null;
			repo?: string | null;
			message?: string | null;
			at?: string | null;
			count?: number | null;
		}> | null;
	} | null;
	installations?: Array<BoatCiInstallation> | null;
	filter?: {
		account?: string | null;
		repo?: string | null;
		state?: string | null;
	} | null;
	/** Jobs in the last 7 days in the account and repo scope, per state tab. */
	counts?: {
		all?: number | null;
		active?: number | null;
		failed?: number | null;
	} | null;
	stats?: {
		jobs?: number | null;
		running?: number | null;
		successRate?: number | null;
		medianWaitSeconds?: number | null;
		medianRunSeconds?: number | null;
		costDollars?: number | null;
		perDay?: Array<{
			day?: string | null;
			success?: number | null;
			failure?: number | null;
			other?: number | null;
		}> | null;
	} | null;
	jobs?: Array<BoatCiJob> | null;
};

export type BoatCiPublicReposResponse = BoatSuccessBase & {
	type?: string | null;
	allowPublicRepos?: boolean | null;
	publicRepoUsers?: Array<{
		/** The login as GitHub spells it. */
		login?: string | null;
		avatarUrl?: string | null;
	}> | null;
};

export type BoatCiRepository = {
	fullName?: string | null;
	private?: boolean | null;
	htmlUrl?: string | null;
	/** public-blocked = public repository, jobs never run. */
	status?: string | null;
	/** Jobs in the last 7 days. */
	jobs7d?: number | null;
	lastState?: BoatCiJobState | null;
	lastAt?: string | null;
	lastError?: string | null;
};

export type BoatCommandInfoResponse = BoatSuccessBase & {
	type?: string | null;
	command?: BoatCommandRecord | null;
};

export type BoatCommandListResponse = BoatSuccessBase & {
	type?: string | null;
	/** Newest first. */
	commands?: Array<BoatCommandRecord> | null;
	/** Pass as `cursor` to get the next page. Null on the last page. */
	nextCursor?: string | null;
};

export type BoatCommandLogsResponse = BoatSuccessBase & {
	type?: string | null;
	commandId?: string | null;
	stream?: string | null;
	/** Byte position of the first byte in `data`. Greater than the requested offset only when output was not kept (see outputTruncated). */
	offset?: number | null;
	/** Pass as `offset` to read on. */
	nextOffset?: number | null;
	/** Bytes the stream has so far. */
	size?: number | null;
	encoding?: string | null;
	data?: string | null;
	/** True when the command ended and this read reached the end of the stream. */
	done?: boolean | null;
};

/** One command run through the commands endpoint (kept 7 days), or one process of the sandbox with mode `process` (kept 72 hours). Readable while the sandbox is stopped. */
export type BoatCommandRecord = {
	/** Id of the record in the command history. */
	commandId?: string | null;
	sandboxId?: string | null;
	/** The command text as sent (first 64 KiB). */
	command?: string | null;
	cwd?: string | null;
	/** sync: the request waited for the result. stream: the output was streamed. detached: started in the background. process: any other process of the sandbox, recorded from what it wrote to its stdout/stderr. */
	mode?: string | null;
	/** detached: the process id on the sandbox. */
	processId?: number | null;
	/** failed: the command could not start or its result never arrived. killed: ended by a signal or by DELETE /commands/{processId}. lost: the sandbox stopped or its agent restarted while the command ran. */
	status?: string | null;
	exitCode?: number | null;
	signal?: string | null;
	/** Bytes of stdout written so far. */
	stdoutBytes?: number | null;
	/** Bytes of stderr written so far. */
	stderrBytes?: number | null;
	/** True when part of the output is not kept: the sandbox cut the output of a waiting command at 8 MiB, or the account wrote more than 10 MiB (compressed) of command output, or of process output, in one hour. */
	outputTruncated?: boolean | null;
	startedAt?: string | null;
	finishedAt?: string | null;
};

export type BoatCommandResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	/** The command's record in the command history. */
	commandId?: string | null;
	exitCode?: number | null;
	signal?: string | null;
	/** True when the memory ceiling killed the command or one of its processes and the command failed. */
	oomKilled?: boolean | null;
	stdout?: string | null;
	stderr?: string | null;
	stdoutTruncated?: boolean | null;
	stderrTruncated?: boolean | null;
	timedOut?: boolean | null;
	cwd?: string | null;
	startedAt?: string | null;
	finishedAt?: string | null;
};

export type BoatCommandStartedResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	/** The command's record in the command history. Its output is copied there every 30 s. */
	commandId?: string | null;
	/** Process id to poll with the command status endpoint. */
	processId?: number | null;
	pid?: number | null;
	command?: string | null;
	cwd?: string | null;
	startedAt?: string | null;
	/** Stdout log file on the sandbox (~/.ascii/processes/<pid>.log). */
	logPath?: string | null;
	/** Stderr log file on the sandbox. */
	errLogPath?: string | null;
};

export type BoatCommandStatusResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	processId?: number | null;
	pid?: number | null;
	/** lost: the sandbox agent restarted and forgot the process; running/exitCode are then a best-effort probe and the logs come from the on-disk files. */
	status?: string | null;
	/** Whether the process is still tracked by the sandbox agent. */
	known?: boolean | null;
	running?: boolean | null;
	exitCode?: number | null;
	signal?: string | null;
	/** True when the memory ceiling killed the command or one of its processes and the command failed. */
	oomKilled?: boolean | null;
	command?: string | null;
	cwd?: string | null;
	startedAt?: string | null;
	finishedAt?: string | null;
	/** Tail of the stdout log file. With `stdoutOffset`: the stdout written since that offset. */
	stdout?: string | null;
	/** Tail of the stderr log file. With `stderrOffset`: the stderr written since that offset. */
	stderr?: string | null;
	stdoutTruncated?: boolean | null;
	stderrTruncated?: boolean | null;
	logPath?: string | null;
	errLogPath?: string | null;
	/** Byte offset where `stdout` starts: the offset you asked for, or 0 when the log was replaced. */
	stdoutOffset?: number | null;
	/** Byte offset where `stderr` starts: the offset you asked for, or 0 when the log was replaced. */
	stderrOffset?: number | null;
	/** The `stdoutOffset` for the next read. */
	stdoutNextOffset?: number | null;
	/** The `stderrOffset` for the next read. */
	stderrNextOffset?: number | null;
	/** True when more output is already written. Read again at once. */
	more?: boolean | null;
};

export type BoatCommandStopResponse = BoatSuccessBase & {
	type?: string | null;
	processId?: number | null;
	/** Always false after a stop. */
	running?: boolean | null;
	/** False when the process had already ended. */
	signaled?: boolean | null;
	/** The history record of the command, with its final state. */
	command?: BoatCommandRecord | null;
};

export type BoatConversation = {
	/** Conversation id. Pass it as `conversationId` on `POST /prompt` to continue this thread. */
	id?: string | null;
	/** When the first prompt of this conversation was queued. */
	createdAt?: string | null;
	/** When its most recent prompt was queued. The list is sorted by this, newest first. */
	lastPromptAt?: string | null;
	/** Number of prompts sent to this conversation. */
	prompts?: number | null;
	/** `true` while a turn is queued or running in this conversation. */
	running?: boolean | null;
	/** Harness the most recent prompt ran on (`claude`, `codex`, `pi`, `opencode`, `prime-agent`, `kimi`, `mistral`). */
	lastHarness?: string | null;
	/** Model id of the most recent prompt that chose one, or `null` when every prompt used the harness default. */
	lastModel?: string | null;
	/** The first 80 characters of the most recent prompt. */
	lastPromptPreview?: string | null;
	/** `true` on the conversation a `POST /prompt` without `new` or `conversationId` would continue: the sandbox's most recently prompted one. Exactly one conversation is current unless the list is empty. */
	current?: boolean | null;
};

export type BoatConversationsResponse = BoatSuccessBase & {
	type?: string | null;
	/** Sandbox id. */
	id?: string | null;
	conversations?: Array<BoatConversation> | null;
};

export type BoatCreateSandboxResponse = BoatSuccessBase & {
	type?: string | null;
	/** `ready` only when an idempotent retry finds a sandbox that is already past provisioning. */
	status?: string | null;
	ttlSeconds?: number | null;
	sandbox?: BoatSandbox | null;
	/** Present when the request set `count` above 1. Every sandbox of the batch, in creation order. */
	sandboxes?: Array<BoatSandbox> | null;
	/** Present when the request set `hostedPorts`, in request order. Each entry is what `POST /sandboxes/{id}/host` answers for that port: `url`, `access`, `isProtected` and `localhost`, or `error` and `message` when that one port could not be hosted (the sandbox is created anyway; host the port again… */
	hostedPorts?: Array<{
		port?: number | null;
		/** Public HTTPS URL. Carries the `_token` query parameter unless the port is public; redact from logs. */
		url?: string | null;
		isProtected?: boolean | null;
		access?: string | null;
		localhost?: boolean | null;
		error?: string | null;
		message?: string | null;
	}> | null;
	/** Present when a fair-use cap on a gifted account shortened the requested auto-stop time. */
	giftLimitNotice?: string | null;
};

/** One account of a credential. Never a secret. */
export type BoatCredentialAccount = {
	/** The account's id. It stays the same across switches. */
	id?: string | null;
	/** The account's email for a sign-in, or the key's last characters (…1234). */
	label?: string | null;
	/** True for the account every sandbox on the profile uses. */
	active?: boolean | null;
	/** When the account was set aside (accounts not in use). */
	addedAt?: string | null;
};

export type BoatCredentialAccountsResponse = BoatSuccessBase & {
	success?: boolean | null;
	profileId?: string | null;
	credential?: BoatCredentialId | null;
	/** In the order the accounts were added, so their numbers stay the same across switches. The one in use is marked `active`. */
	accounts?: Array<BoatCredentialAccount> | null;
};

/** One AI credential in a credential profile. The `*-api-key` ids are API keys you can set with `PUT /credential-profiles/{profile}/keys/{credential}`. The sign-ins (`*-subscription`) and Bedrock (`*-bedrock`) are connected on the dashboard Agents & Proxying page, with the profile picked at the… */
export type BoatCredentialId = string;

/** A named set of AI credentials. Secret values are never returned. */
export type BoatCredentialProfile = {
	id?: string | null;
	name?: string | null;
	/** True for the one profile of its owner that sandboxes get when nothing names a profile. The dashboard Agents page edits this profile. */
	isDefault?: boolean | null;
	owner?: {
		/** The account that owns the profile, a person or an organization. */
		id?: string | null;
		kind?: string | null;
		name?: string | null;
		/** True when the owner has the AI credentials proxy on. */
		aiProxyEnabled?: boolean | null;
	} | null;
	/** True when you can change the profile. Org members use an org profile; org owners manage it. */
	canManage?: boolean | null;
	/** The credentials the profile holds. */
	connected?: Array<BoatCredentialId> | null;
	/** Credentials with several accounts, keyed by credential id. Each lists every account (labels only), the one in use marked `active`. Empty when you cannot manage the profile. */
	accounts?: Record<string, Array<BoatCredentialAccount>> | null;
	/** The names of the profile's custom APIs. Values are never returned. */
	customApis?: Array<string> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	access?: BoatResourceAccess | null;
};

export type BoatCredentialProfileDeletedResponse = BoatSuccessBase & {
	success?: boolean | null;
};

export type BoatCredentialProfileListResponse = BoatSuccessBase & {
	profiles?: Array<BoatCredentialProfile> | null;
};

export type BoatCredentialProfileResponse = BoatSuccessBase & {
	success?: boolean | null;
	profile?: BoatCredentialProfile | null;
};

export type BoatDataRetentionPolicyResponse = BoatSuccessBase & {
	type?: string | null;
	enabled?: boolean | null;
	enabledAt?: string | null;
	/** Archived Sandboxes newly queued for deletion by this policy update. */
	queuedSandboxes?: number | null;
	/** Always true on updates. Disabling the policy does not cancel accepted deletion operations. */
	acceptedDeletionOperationsIrreversible?: boolean | null;
	/** When true, every new sandbox of this account is created with snapshots off. */
	snapshotsOff?: boolean | null;
	snapshotsOffAt?: string | null;
	/** When true, every new sandbox of this account is created with monitoring off. */
	monitoringOff?: boolean | null;
	monitoringOffAt?: string | null;
};

export type BoatDeletionOperation = {
	id?: string | null;
	kind?: string | null;
	targetId?: string | null;
	reason?: string | null;
	status?: string | null;
	/** What the background purge is doing. The target is already gone from every list, restore and fork once the operation exists. `waiting_for_uploads`: stored data is erased once the last upload URL issued for it expires (`expectedBy`). `retrying`: a transient fault, retried automatically.… */
	stage?: string | null;
	/** When `waiting_for_uploads` ends. */
	expectedBy?: string | null;
	attemptCount?: number | null;
	requestedAt?: string | null;
	completedAt?: string | null;
};

export type BoatDeletionOperationListResponse = BoatSuccessBase & {
	type?: string | null;
	operations?: Array<BoatDeletionOperation> | null;
};

export type BoatDeletionOperationResponse = BoatSuccessBase & {
	type?: string | null;
	operation?: BoatDeletionOperation | null;
};

export type BoatDesktopResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	/** Secret-bearing desktop or noVNC URL. Redact from logs. */
	desktopUrl?: string | null;
	ip?: string | null;
	mode?: string | null;
	/** For `?vnc=1`, true means VNC is still being prepared; poll again. */
	provisioning?: boolean | null;
	message?: string | null;
};

/** Result of a granular environment change. Every change mints a new immutable version holding just that delta; existing sandboxes stay pinned until upgraded. */
export type BoatEnvironmentItemChangeResponse = {
	success?: boolean | null;
	/** Id of the newly minted environment version. This is a version id, not the environment's own id: the environment id you passed in the path is unchanged. */
	versionId?: string | null;
	versionNumber?: number | null;
};

/** The outbound network policy that an environment gives its sandboxes. */
export type BoatEnvironmentNetworkPolicy = {
	/** `open`: no limit, also for a sandbox whose own policy is unset. `deny`: no connection. `allow`: only the entries of `allow`. */
	mode?: string | null;
	/** With mode `allow`, 1 to 100 entries, as in a sandbox policy. Empty or omitted with any other mode. */
	allow?: Array<string> | null;
	/** Who can connect to the sandboxes of this environment. `open`: anyone on the internet. `boat-only`: only boat; code in a sandbox cannot make a port public, and SSH, the desktop and raw ports stop. A caller outside the sandbox can still publish a port. Omitted in a request: the environment keeps… */
	inbound?: string | null;
	/** The public addresses that can still connect directly to the sandboxes of this environment when `inbound` is `boat-only`. The same rules as in a sandbox policy apply. In an answer: only when the request has `include=inboundAllow`. It is then always an array. */
	inboundAllow?: Array<string> | null;
};

export type BoatEventsResponse = BoatSuccessBase & {
	type?: string | null;
	id?: string | null;
	/** Sandbox work and lifecycle event objects. Event shapes are intentionally extensible; branch on each event `type` when present. */
	events?: Array<BoatSandboxEvent> | null;
	pageInfo?: BoatPageInfo | null;
};

export type BoatFileDeleteResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	path?: string | null;
};

export type BoatFileEntry = {
	name?: string | null;
	/** Absolute path on the sandbox. */
	path?: string | null;
	isDir?: boolean | null;
	isSymlink?: boolean | null;
	size?: number | null;
	/** Octal permission bits, for example "0644". */
	mode?: string | null;
	modifiedAt?: string | null;
};

export type BoatFileFindResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	/** At most 1,000 matches. Each line is cut at 500 characters. */
	matches?: Array<{
		file?: string | null;
		line?: number | null;
		content?: string | null;
	}> | null;
	truncated?: boolean | null;
	/** Present only when part of the tree could not be searched. The matches are then incomplete. An invalid regular expression is an error response. */
	errors?: Array<string> | null;
};

export type BoatFileInfoResponse = BoatSuccessBase &
	BoatFileEntry & {
		type?: string | null;
		success?: boolean | null;
	};

export type BoatFileListResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	path?: string | null;
	files?: Array<BoatFileEntry> | null;
	/** True when the directory holds more than 10,000 entries. */
	truncated?: boolean | null;
};

export type BoatFileMoveResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	path?: string | null;
	destination?: string | null;
};

export type BoatFileReadResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	path?: string | null;
	encoding?: string | null;
	size?: number | null;
	content?: string | null;
};

export type BoatFileReplaceResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	/** One result per file. A file that fails does not stop the others. */
	results?: Array<{
		file?: string | null;
		success?: boolean | null;
		replacements?: number | null;
		error?: string | null;
	}> | null;
};

export type BoatFileSearchResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	/** Absolute paths, at most 10,000. */
	files?: Array<string> | null;
	truncated?: boolean | null;
	/** Present only when part of the tree could not be searched (for example a folder you cannot read). The results are then incomplete. A search that fails completely is an error response. */
	errors?: Array<string> | null;
};

export type BoatFileUrlResponse = BoatSuccessBase & {
	type?: string | null;
	/** The signed URL. Send the request straight to it; it needs no Authorization header. */
	url?: string | null;
	/** GET downloads the file. PUT uploads the request body as the file. */
	method?: string | null;
	/** The canonical path the URL is bound to. */
	path?: string | null;
	expiresAt?: string | null;
};

export type BoatFileWriteResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	path?: string | null;
	encoding?: string | null;
	size?: number | null;
};

export type BoatHostPortResponse = BoatSuccessBase & {
	type?: string | null;
	success?: boolean | null;
	port?: number | null;
	/** Public HTTPS URL. Carries the `_token` query parameter unless the port is public; redact from logs. */
	url?: string | null;
	isProtected?: boolean | null;
	access?: string | null;
	/** The sandbox relays the URL to a service that listens on localhost only. */
	localhost?: boolean | null;
};

export type BoatLimitsFields = {
	accessTier?: string | null;
	blockedReason?: string | null;
	currentLimits?: {
		activeSandboxes?: number | null;
		creationRatePerMinute?: number | null;
		creationRequestsPerHour?: number | null;
		creationRequestsPerDay?: number | null;
	} | null;
	standardLimits?: {
		activeSandboxes?: number | null;
		creationRatePerMinute?: number | null;
		creationRequestsPerHour?: number | null;
		creationRequestsPerDay?: number | null;
	} | null;
	trialLimits?: {
		activeSandboxes?: number | null;
		creationRatePerMinute?: number | null;
		creationRequestsPerHour?: number | null;
		creationRequestsPerDay?: number | null;
	} | null;
	upgradeEffects?: Record<string, BoatJsonValue> | null;
	/** Whether the authenticated account can create or operate sandboxes right now. */
	canStart?: boolean | null;
	checkoutRequired?: boolean | null;
	startBlockedReason?: string | null;
	contactMessage?: string | null;
	activeSandboxes?: number | null;
	activeStates?: Array<string> | null;
	maxActiveSandboxes?: number | null;
	maxCreationRequestsPerMinute?: number | null;
	maxCreationRequestsPerDay?: number | null;
	/** Plan caps for machine starts. Null on unlimited accounts. Create, fork and resume each count as one start. */
	startLimits?: {
		perMinute?: number | null;
		perHour?: number | null;
		perDay?: number | null;
	} | null;
	/** The one wallet of this account or organization, in US dollars. It pays overage only: VM time past the plan, saved snapshots past the included count, extra starts and the AI proxy. It never pays the plan. Null on unlimited accounts. */
	wallet?: {
		/** Money in the wallet. Below zero while you owe during the grace period. */
		balanceDollars?: number | null;
	} | null;
	/** What the plan includes this billing period. Null on unlimited accounts. */
	planIncluded?: {
		/** VM time included this period, in hours of a `default` machine. */
		vmHours?: number | null;
		/** Included VM time left this period, in hours of a `default` machine. */
		vmHoursRemaining?: number | null;
		/** When the included amounts reset. */
		periodEnd?: string | null;
	} | null;
	/** What the wallet pays past the plan. */
	overagePrices?: {
		/** Dollars per hour of a `default` machine. `small` is 0.5x, `large` 2x, `xlarge` 5.556x. */
		vmHourDollars?: number | null;
		/** Dollars per day for each saved snapshot above the included count. */
		savedSnapshotDayDollars?: number | null;
		/** Price of a start above a start limit, by how far past the limit it falls, in each window (minute, hour, day). A start above limits in several windows pays the highest bracket among them. */
		startBrackets?: Array<{
			/** The bracket starts above this multiple of the limit. */
			aboveMultiple?: number | null;
			/** The bracket ends at this multiple of the limit (included). */
			upToMultiple?: number | null;
			/** Dollars per start in this bracket. */
			dollars?: number | null;
		}> | null;
		/** Extra starts stop at this multiple of the hour and day limits (the last bracket's upToMultiple). */
		startLimitMultiplier?: number | null;
		/** Extra starts stop at this multiple of the minute limit. */
		startMinuteLimitMultiplier?: number | null;
	} | null;
	/** What the next start costs now. 0 inside every limit; null when it would be refused. */
	nextStartDollars?: number | null;
	/** Start ceilings with extra starts: the hour and day limits times `overagePrices.startLimitMultiplier`, and the minute limit times `overagePrices.startMinuteLimitMultiplier`. Starts above `startLimits` and up to these ceilings are paid from the wallet at the `overagePrices.startBrackets` prices.… */
	startLimitsWithWallet?: {
		perMinute?: number | null;
		perHour?: number | null;
		perDay?: number | null;
	} | null;
	/** Remaining machine starts in the rolling minute, hour and day windows. Null windows mean the account is unlimited. */
	starts?: {
		unlimited?: boolean | null;
		minute?: BoatStartWindowUsage | null;
		hour?: BoatStartWindowUsage | null;
		day?: BoatStartWindowUsage | null;
	} | null;
	/** Deprecated. Read `planIncluded.vmHoursRemaining` and `wallet.balanceDollars`. */
	creditBalanceHours?: number | null;
	/** Deprecated. Read `wallet.balanceDollars`. */
	packBalanceHours?: number | null;
	/** Deprecated. Read `wallet.balanceDollars`. */
	packBalanceDollars?: number | null;
	hasPaymentHistory?: boolean | null;
	subscriptionQuotaSeconds?: number | null;
	subscriptionRemainingSeconds?: number | null;
	/** Deprecated. Read `wallet.balanceDollars`. */
	packBalanceSeconds?: number | null;
	/** Deprecated. */
	creditPurchasedSeconds?: number | null;
	creditUsedSeconds?: number | null;
	liveUsageSeconds?: number | null;
	creditSecondsPerDollar?: number | null;
	/** Current plan key, or `trial` before any payment. */
	sandboxPlanKey?: string | null;
	/** Monthly price of the current plan in dollars. */
	sandboxPlanDollars?: number | null;
	/** Every plan tier and its limits. */
	sandboxPlanTiers?: Array<{
		key?: string | null;
		dollars?: number | null;
		displayPrice?: string | null;
		maxActiveSandboxes?: number | null;
		startsPerMinute?: number | null;
		startsPerHour?: number | null;
		startsPerDay?: number | null;
		/** Machine time included each month. */
		includedSeconds?: number | null;
		/** Whether this tier can be bought right now. */
		purchasable?: boolean | null;
	}> | null;
	accountPlan?: string | null;
	/** `service` for service accounts, otherwise null. */
	plan?: string | null;
	/** `Service` for service accounts, otherwise null. */
	planName?: string | null;
	serviceAccount?: boolean | null;
	/** True when the account has no machine-time or start limits. */
	unlimited?: boolean | null;
	/** True when an organization has an active per-seat plan. */
	hasSeatPlan?: boolean | null;
	/** Machine time used in the last 24 hours, in seconds. Useful to estimate how long the included time and the wallet last. */
	last24hUsageSeconds?: number | null;
	/** Lifetime VM-time allowance for new sandboxes while the account has not paid, a plan trial included. Null once the account has paid. */
	trialComputeCapSeconds?: number | null;
	/** VM time already used against trialComputeCapSeconds. Null once the account has paid. */
	trialComputeUsedSeconds?: number | null;
	/** The trial limits in one readable line. Null on paid accounts. */
	trialLine?: string | null;
	/** Each sandbox type, and whether this account can create it now. A blocked type carries the reason. */
	machineTypes?: Array<{
		type?: string | null;
		available?: boolean | null;
		/** Why the type is blocked, for example `not during the free trial; the first payment unlocks it`. Null when available. */
		reason?: string | null;
	}> | null;
	/** Fair-use caps on a gifted account, or null when there are none. */
	giftLimit?: {
		maxActiveSandboxes?: number | null;
		maxTtlSeconds?: number | null;
		/** The caps in one readable line. */
		line?: string | null;
		/** The same text shown when a cap is hit. */
		message?: string | null;
	} | null;
	/** Account access state returned by the current backend. Billing endpoints are not part of v1. */
	billingStatus?: string | null;
	subscriptionStatus?: string | null;
	subscriptionCancelAtPeriodEnd?: boolean | null;
	hasSubscription?: boolean | null;
	subscriptionTrialEndsAt?: string | null;
	subscriptionCurrentPeriodEnd?: string | null;
	/** Deprecated. Read `planIncluded.vmHoursRemaining` and `wallet.balanceDollars`. */
	creditBalanceSeconds?: number | null;
	/** Present when limits were read for a team wallet (`?teamId=`, `?org=`, or `X-Boat-Org`). */
	teamId?: string | null;
	/** Caller's role on that team when `teamId` is present. */
	teamRole?: string | null;
};

export type BoatLimitsResponse = BoatSuccessBase & BoatLimitsFields;

export type BoatMeResponse = BoatSuccessBase & {
	type?: string | null;
	user?: {
		/** Your account id. */
		id?: string | null;
		login?: string | null;
		email?: string | null;
		displayName?: string | null;
		/** The login method the account was created with. */
		connectionMethod?: string | null;
		/** Every login method linked to the account. */
		connectionMethods?: Array<string> | null;
		accountPlan?: string | null;
		serviceAccount?: boolean | null;
		accountStatus?: string | null;
		suspended?: boolean | null;
		suspendedAt?: string | null;
		suspendedReason?: string | null;
		closed?: boolean | null;
		closedAt?: string | null;
		/** When a closed account's data is scheduled for deletion. */
		purgeAt?: string | null;
		/** When a closed account's data was deleted. */
		purgedAt?: string | null;
		/** Address to contact about a suspended or closed account. */
		closureContactEmail?: string | null;
		/** Whether archived sandbox data is configured for deletion instead of retention. */
		zeroDataRetention?: boolean | null;
		zeroDataRetentionEnabledAt?: string | null;
	} | null;
};

/** A named snapshot: a frozen copy of a sandbox's disk at one moment, saved under a name you pick. Independent of the source sandbox's later life: the sandbox can change, stop, or be deleted and the named snapshot still deploys. Named snapshots never expire; re-saving a name replaces its artifact. */
export type BoatNamedSnapshot = {
	/** The user-chosen handle, unique within your account. */
	name?: string | null;
	/** `saving` while the capture and pin are in flight (a live source sandbox takes a fresh snapshot first, which can run minutes), `ready` when deployable, `failed` if the save did not complete (see `error`; save again to retry). */
	status?: string | null;
	/** Failure reason. Only present when `status` is `failed`. */
	error?: string | null;
	/** The sandbox this snapshot was saved from (display only). */
	sourceSandboxId?: string | null;
	/** The frozen artifact behind the name. Present once `status` is `ready`. Accepted by `GET /api/boat/snapshots/{snapshotId}/tree` to browse its files. */
	snapshotId?: string | null;
	/** Sandbox type the snapshot was saved from. Deploys default to it. */
	type?: string | null;
	/** Restored content size of the frozen state, in bytes. */
	sizeBytes?: number | null;
	createdAt?: string | null;
};

/** What the request's wallet (your active organization, `?org=`, or personal) pays for named snapshots. The plan includes some; each one above costs $0.056 a day from the wallet. An organization's count includes every member's names billed to it. */
export type BoatNamedSnapshotAllowance = {
	/** Organization the numbers are for. null = personal. */
	org?: string | null;
	/** That organization's name. */
	orgName?: string | null;
	/** Named snapshots kept for free. */
	free?: number | null;
	/** Named snapshots this wallet keeps. */
	used?: number | null;
	/** Named snapshots above the free ones. */
	extra?: number | null;
	/** What the extra ones cost per month. */
	extraMonthlyDollars?: number | null;
	/** What the wallet pays per day for the extra ones, in dollars. */
	extraDailyDollars?: number | null;
	/** Price of one extra named snapshot for 30 days (1.68). */
	pricePerExtraMonthlyDollars?: number | null;
	/** Daily price of one extra named snapshot (0.056). */
	pricePerExtraDailyDollars?: number | null;
};

export type BoatNamedSnapshotDeletedResponse = BoatSuccessBase & {
	type?: string | null;
	name?: string | null;
	status?: string | null;
};

export type BoatNamedSnapshotInfoResponse = BoatSuccessBase & {
	type?: string | null;
	snapshot?: BoatNamedSnapshot | null;
};

export type BoatNamedSnapshotListResponse = BoatSuccessBase & {
	type?: string | null;
	snapshots?: Array<BoatNamedSnapshot> | null;
	allowance?: BoatNamedSnapshotAllowance | null;
};

export type BoatNamedSnapshotSavingResponse = BoatSuccessBase & {
	type?: string | null;
	status?: string | null;
	snapshot?: BoatNamedSnapshot | null;
};

/** A share code for a named snapshot. Any Boat account that holds the code can create a sandbox from the snapshot. Boat stores only a hash of the code. The full code is in the create response only. */
export type BoatNamedSnapshotShare = {
	/** Share id, for example `shr_...`. Pass it to revoke the code. */
	id?: string | null;
	/** The first characters of the code, for example `bsh_xxxxxxxx`. Use it to tell codes apart. */
	codePrefix?: string | null;
	status?: string | null;
	/** Number of sandboxes created with this code. */
	useCount?: number | null;
	/** When a sandbox was last created with this code. null if never. */
	lastUsedAt?: string | null;
	/** When the code was revoked. null while active. */
	revokedAt?: string | null;
	createdAt?: string | null;
};

export type BoatNamedSnapshotShareCreatedResponse = BoatSuccessBase & {
	type?: string | null;
	/** The named snapshot the code deploys. */
	name?: string | null;
	/** The share code, for example `bsh_...`. Boat shows it only in this response. Store it now; you cannot get it again. */
	shareCode?: string | null;
	share?: BoatNamedSnapshotShare | null;
};

export type BoatNamedSnapshotShareListResponse = BoatSuccessBase & {
	type?: string | null;
	name?: string | null;
	shares?: Array<BoatNamedSnapshotShare> | null;
};

export type BoatNamedSnapshotShareRevokedResponse = BoatSuccessBase & {
	type?: string | null;
	name?: string | null;
	share?: BoatNamedSnapshotShare | null;
};

export type BoatNetworkPolicyResponse = BoatSuccessBase & {
	type?: string | null;
	network?: BoatSandboxNetwork | null;
	/** The sandbox of this policy and its state now. */
	sandbox?: {
		id?: string | null;
		/** The sandbox state, as in the sandbox object. */
		state?: string | null;
	} | null;
	/** What the caller may do with this policy. Only when the request has `include=access`. */
	access?: {
		/** The caller may change the policy. False answers 403 `owner_only` on PUT. */
		canChange?: boolean | null;
		/** The organization environment sets the policy. The caller may only make the sandbox follow it (`mode: environment`). Any other policy answers 403 `network_policy_managed`. */
		managed?: boolean | null;
	} | null;
};

export type BoatOrg = {
	/** Your account id for the personal row, `team_…` for an organization. */
	id?: string | null;
	/** Accepted wherever an org is passed, like the id. */
	name?: string | null;
	type?: string | null;
	role?: string | null;
	memberCount?: number | null;
	/** Stripe status of the organization's plan; absent on the personal row. */
	subscriptionStatus?: string | null;
	/** The wallet new sandboxes bill when a request names none. */
	active?: boolean | null;
};

export type BoatOrgListResponse = BoatSuccessBase & {
	type?: string | null;
	/** Whether this account ever set its active wallet. `false` means personal by default, never a choice. */
	activeWalletChosen?: boolean | null;
	orgs?: Array<BoatOrg> | null;
};

export type BoatPageInfo = {
	nextCursor?: string | null;
	hasMore?: boolean | null;
	limit?: number | null;
};

export type BoatProcessListResponse = BoatSuccessBase & {
	type?: string | null;
	/** True: read from the running sandbox now. False: the sandbox is stopped (or its agent is not upgraded yet), and this is the last sample kept (top 12 processes, every 30 s, 7 days). */
	live?: boolean | null;
	sampledAt?: string | null;
	/** Processes on the sandbox. The list holds at most 500, busiest first. */
	total?: number | null;
	processes?: Array<BoatSandboxProcess> | null;
};

export type BoatPromptResponse = BoatSuccessBase & {
	type?: string | null;
	/** Sandbox id. */
	id?: string | null;
	promptId?: string | null;
	/** The conversation this prompt was queued in. A new one when `new` was set, the one named by `conversationId`, or the sandbox's most-recently-active conversation. See [Integrated agents](/integrated-agents). */
	conversationId?: string | null;
	promptRun?: BoatPromptRun | null;
	status?: string | null;
	provider?: string | null;
	model?: string | null;
	reasoningEffort?: string | null;
	/** The prompt runs in fast mode or Ultrafast. */
	fast?: boolean | null;
	speed?: string | null;
};

export type BoatPromptRun = {
	id?: string | null;
	promptId?: string | null;
	sandboxId?: string | null;
	status?: string | null;
	done?: boolean | null;
	createdAt?: string | null;
	model?: string | null;
	reasoningEffort?: string | null;
	/** The prompt runs in fast mode or Ultrafast. `null` means no speed is set yet. The prompt waits without a speed choice, or it ended without running (`done` is true). The speed is set when the prompt starts, for the model that runs. */
	fast?: boolean | null;
	/** The speed of the prompt. `null` has the same meaning as for `fast`. */
	speed?: string | null;
	/** The conversation this prompt ran in. A Sandbox runs many conversations in parallel; see [Integrated agents](/integrated-agents). */
	conversationId?: string | null;
};

export type BoatPromptRunResponse = BoatSuccessBase & {
	type?: string | null;
	id?: string | null;
	promptRun?: BoatPromptRun | null;
};

export type BoatRepoSelectionResponse = BoatSuccessBase & {
	success?: boolean | null;
	environmentId?: string | null;
	/** Id of the default environment. `environmentId` is the id of its new version. */
	subenvironmentId?: string | null;
	selectedRepositories?: Array<BoatSelectedRepository> | null;
};

export type BoatReposResponse = BoatSuccessBase & {
	installations?: Array<BoatRepositoryInstallation> | null;
	environmentId?: string | null;
	/** Id of the default environment. `environmentId` is the id of its latest version. */
	subenvironmentId?: string | null;
	selectedRepositories?: Array<BoatSelectedRepository> | null;
	pageInfo?: BoatPageInfo | null;
};

export type BoatRepository = {
	/** GitHub repository id. */
	id?: number | null;
	/** Internal repository id used when selecting repositories. */
	databaseId?: string | null;
	name?: string | null;
	fullName?: string | null;
	description?: string | null;
	url?: string | null;
	private?: boolean | null;
	permissions?: string | null;
	pushedAt?: string | null;
	/** Reserved; always null. */
	lastUserCommitAt?: string | null;
};

export type BoatRepositoryInstallation = {
	type?: string | null;
	accountLogin?: string | null;
	accountAvatarUrl?: string | null;
	repositories?: Array<BoatRepository> | null;
};

/** Which organization members can use this organization environment or profile. `restricted` false means every member. `restricted` true means owners, admins and `members` only. Others do not see it in lists. Personal environments and profiles always return `restricted` false. */
export type BoatResourceAccess = {
	restricted?: boolean | null;
	/** Member ids. Empty when `restricted` is false. */
	members?: Array<string> | null;
};

export type BoatSandbox = {
	id?: string | null;
	name?: string | null;
	/** `cancelled` is terminal: a create or fork that could not get a machine was removed. `GET /sandboxes/{sandboxId}` reports it once, with only `id`, `state` and `error`, then answers 404. */
	state?: string | null;
	/** Why the sandbox is stopped, failed or cancelled, or null. */
	error?: string | null;
	/** When boat deleted the snapshot data after this sandbox was stopped for at least 14 days. Resume and fork then fail with `409 snapshot_data_expired`. Null while the data is kept. */
	dataExpiredAt?: string | null;
	/** When the sandbox last stopped, by any cause: your stop, its auto-stop, a plan limit or Boat. Null while the sandbox is not stopped. */
	stoppedAt?: string | null;
	/** The labels set at create or fork. Empty when none were set. */
	labels?: Record<string, string> | null;
	/** `degraded` when the machine is alive but Boat cannot fully reach it (for example a firewall rule inside the sandbox blocks the tunnel). The sandbox keeps running. */
	health?: string | null;
	/** Why the sandbox is degraded, or null. */
	healthReason?: string | null;
	/** When the sandbox became degraded, or null. */
	degradedSince?: string | null;
	/** True once every file of the sandbox's snapshot is on its disk. A resumed or forked sandbox is usable before that: its files keep copying in the background, and its docker volumes move onto the real disk near the end. Its docker containers start earlier; at that point their volume mounts move… */
	hydrated?: boolean | null;
	/** When the last resume or fork finished copying files in, or null. */
	hydratedAt?: string | null;
	/** Restore progress while `hydrated` is false, on GET /sandboxes/{id} only. Null in lists, after hydration, or when the sandbox does not answer within 1.5 s. */
	hydration?: {
		/** Restore step: `dvol` (docker volumes), `sysdelta` (system files), `images` (saved docker images), `hydrating` (the home directory), `reconciling` (the last check). `degraded` and `stuck` mean a step failed and is retried. */
		phase?: string | null;
		/** Files, directories and links copied in so far. */
		entriesDone?: number | null;
		/** Files, directories and links this restore copies in. Null for the first seconds, until the system files are counted. */
		entriesTotal?: number | null;
		/** entriesDone of entriesTotal, 0-99. Files you change during the restore are yours, not copied, so it can stop short of 99; `hydrated` is the end signal. */
		percent?: number | null;
	} | null;
	/** Current machine size: what the sandbox was created with, or the size it was last resumed or forked onto. */
	type?: string | null;
	/** vCPUs guaranteed by this sandbox's type. */
	vcpu?: number | null;
	/** RAM in GB guaranteed by this sandbox's type. */
	memoryGB?: number | null;
	/** Rate at which this sandbox consumes machine time. 0.5 for `small`, 1 for `default`, 2 for `large`, and 50/9 (about 5.56) for `xlarge`. */
	billingMultiplier?: number | null;
	/** Always `baremetal`. Every sandbox runs on bare metal. */
	machineProvider?: string | null;
	/** Machine URL when assigned. Null when `network.inbound` is `boat-only`. */
	url?: string | null;
	/** Machine IPv6 or IPv4 address when assigned. */
	ip?: string | null;
	/** Public IPv4 `host:port` that forwards to the sandbox SSH server. Set only when the machine has no public IPv4 of its own; null otherwise. Connect with `ssh -p <port> user@<host>`. Null when `network.inbound` is `boat-only` and the sandbox has no inbound list. Set again when the list has an… */
	sshEndpoint?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	/** When the sandbox stops by itself (the stop starts within about 5 seconds), or null when auto-stop is disabled. A sandbox whose agent is working gets a fresh full TTL, and this time moves forward. */
	archiveAfter?: string | null;
	/** The auto-stop length as last set on create, resume, fork or PATCH, or null when auto-stop is disabled. */
	ttlSeconds?: number | null;
	desktopAvailable?: boolean | null;
	/** Secret-bearing desktop stream URL when available. Redact from logs. */
	desktopUrl?: string | null;
	/** False when the sandbox was created with snapshots off. */
	snapshots?: boolean | null;
	/** False when the sandbox was created with monitoring off. */
	monitoring?: boolean | null;
	network?: BoatSandboxNetwork | null;
	snapshotAvailable?: boolean | null;
	/** Timestamp of the most recent successfully completed snapshot, or null. */
	snapshotCompletedAt?: string | null;
	/** Last time a snapshot confirmed the sandbox's saved state, including checks that found nothing new to save. Falls back to `snapshotCompletedAt`; null if never. */
	snapshotVerifiedAt?: string | null;
	/** The organization billed for this sandbox, or null when the owner is billed. */
	team?: {
		id?: string | null;
		name?: string | null;
	} | null;
	/** Display name (or email) of the person who created the sandbox. Organization members see every sandbox the organization pays for, so this says whose it is. */
	createdBy?: string | null;
	/** Account id of the person who created the sandbox. */
	createdById?: string | null;
	/** What you may do with this sandbox. `owner`: you created it. `use`: a teammate's organization sandbox that is `shared` (see `visibility`), so you can open, run commands in, prompt, resume and stop it. `view`: a teammate's organization sandbox that is `private`, so you can see it and stop it until… */
	access?: string | null;
	/** True while the sandbox still holds its creator's personal logins (GitHub token, model logins, secrets). Other members can only see such a sandbox. */
	holdsCreatorLogins?: boolean | null;
	/** Organization sandboxes only; null for a personal sandbox. `shared`: every member can use it. It holds none of its creator's personal logins (`noEnv`, shared and restarted, or created on an environment that passes nothing) and its creator did not make it private. `private`: only its creator can… */
	visibility?: string | null;
	/** Only with `include=cost` on `GET /sandboxes`. Machine time this sandbox used this calendar month (UTC), at list price. Same meter as `GET /sandboxes/{sandboxId}/usage`. */
	cost?: {
		/** The 1st of this month, 00:00 UTC. */
		since?: string | null;
		/** Billable machine-seconds, size multiplier applied. */
		seconds?: number | null;
		/** seconds / secondsPerDollar, at list price. */
		dollars?: number | null;
	} | null;
	/** True once the sandbox is shared but not restarted yet. Its creator's logins are wiped at its next start, and the organization can use it from then on. */
	wipePendingUntilRestart?: boolean | null;
	/** The sandbox's stable three-word subdomain slug (e.g. "frazil-pneuma-rallye"), or null before one is assigned. */
	subdomain?: string | null;
	/** Timestamp of the most recent snapshot attempt of any status (queued, in_progress, completed, failed, cancelled), or null. Use with snapshotCompletedAt to detect snapshots that keep failing. */
	lastSnapshotAttemptAt?: string | null;
	/** Status of the most recent snapshot attempt, or null if none. A value other than completed while snapshotCompletedAt stays stale indicates failing snapshots. */
	lastSnapshotStatus?: string | null;
	/** The last time the sandbox's kernel restarted on its machine, or null if it never did. Every process running at that time ended. `crash` means the system log ended with no shutdown, for example after a kernel panic. */
	lastReboot?: {
		at?: string | null;
		reason?: string | null;
	} | null;
	/** Outcome of the create-time `setupScript`: `pending` (stored, not yet started), `running` (executing on the sandbox in the background), `done` (exit code 0) or `failed` (non-zero exit, or the sandbox lost track of the process). Null when the sandbox was created without a setup script. */
	setupStatus?: string | null;
	/** Short failure detail (exit code plus a stderr tail) when `setupStatus` is `failed`; while `pending`, may carry the last start/upload error from a retry in progress. Otherwise null. */
	setupError?: string | null;
	/** Name of the sandbox environment this sandbox is running, or null if it is attached to none (a `noEnv` sandbox, or one whose environment was deleted). A sandbox freezes onto one environment version when it starts and keeps it for life, so this is what the sandbox actually holds, not what the… */
	environment?: string | null;
	/** Version number of `environment` that this sandbox is pinned to. Compare it against the environment's latest version to see whether an upgrade is pending: a sandbox below the latest is still running the older configuration until someone calls `POST /environments/{environmentId}/upgrade`. */
	environmentVersion?: number | null;
	/** The last stop you requested (`POST /sandboxes/{sandboxId}/stop`), or null if you never stopped this sandbox. */
	stop?: BoatStopOperation | null;
};

export type BoatSandboxActionResponse = BoatSuccessBase & {
	type?: string | null;
	id?: string | null;
	status?: string | null;
	sandbox?: BoatSandbox | null;
	/** On stop, true when this stop discards work written after the last snapshot. */
	forced?: boolean | null;
	/** On stop, the stop operation (also on a sandbox that is already stopping or stopped). */
	operation?: BoatStopOperation | null;
	/** On stop, the path that reads this stop operation, for example `/api/v1/sandboxes/bx_23456789/stops/stop_0123456789abcdef`. */
	statusUrl?: string | null;
	/** Present on resume or fork when a fair-use cap on a gifted account shortened the requested auto-stop time. */
	giftLimitNotice?: string | null;
	/** On interrupt, the conversation whose turn was interrupted. */
	conversationId?: string | null;
};

export type BoatSandboxAiAccessResponse = BoatSuccessBase & {
	success?: boolean | null;
	sandboxId?: string | null;
	blocked?: boolean | null;
};

export type BoatSandboxAiUsage = {
	sandboxId?: string | null;
	name?: string | null;
	blocked?: boolean | null;
	usage?: Array<BoatAiUsageRow> | null;
	totals?: BoatAiUsageTotals | null;
	/** Request charge for the period, at the price per 1,000 requests. */
	dollars?: number | null;
};

export type BoatSandboxAiUsageResponse = BoatSuccessBase & {
	sandboxId?: string | null;
	/** True when the proxy refuses this sandbox's placeholders. */
	blocked?: boolean | null;
	/** True when the sandbox holds placeholders, not real keys. */
	proxied?: boolean | null;
	/** The profile the sandbox uses. Null means its owner's default. */
	credentialProfileId?: string | null;
	since?: string | null;
	usage?: Array<BoatAiUsageRow> | null;
	totals?: BoatAiUsageTotals | null;
	dollars?: number | null;
};

/** A named sandbox environment. All flags/contents reflect the latest version. */
export type BoatSandboxEnvironment = {
	id?: string | null;
	name?: string | null;
	/** Exactly one environment is the default; sandboxes created without an `environment` name use it. */
	isDefault?: boolean | null;
	latestVersionId?: string | null;
	/** Number of the latest version, 0 when there is none. */
	latestVersionNumber?: number | null;
	/** When the owner last answered whether this environment is safe for third parties, or null if never asked. */
	safetyAnsweredAt?: string | null;
	/** When true the environment passes nothing to a sandbox (repos, secrets, and all credentials withheld), overriding the fine-grained flags below. Use for sandboxes handed to third parties. The one exception is `proxyAiCredentials`. */
	safeForThirdParties?: boolean | null;
	/** Attach the environment's GitHub repositories and the GitHub token (so `gh` and pushes work). Ignored when `safeForThirdParties` is true. */
	passGithub?: boolean | null;
	/** Attach the environment's env variables and secret files. Ignored when `safeForThirdParties` is true. */
	passSecrets?: boolean | null;
	/** Attach the sandbox's own service/preview credentials. Ignored when `safeForThirdParties` is true. */
	passSandboxCredentials?: boolean | null;
	/** Attach agent-provider credentials configured on the Agents page. Ignored when `safeForThirdParties` is true. */
	passAgentsCredentials?: boolean | null;
	/** The AI credential profile the environment's sandboxes get. Null means the sandbox owner's default profile. */
	credentialProfileId?: string | null;
	/** Only with `safeForThirdParties` true. The sandboxes still get AI credentials, as AI credentials proxy placeholders. Real keys never enter them. */
	proxyAiCredentials?: boolean | null;
	access?: BoatResourceAccess | null;
	/** The outbound network policy of the latest version, or null when it sets none. A new sandbox in this environment gets it, unless the request sets a policy of its own. See https://docs.boat.dev/network-policy. */
	network?: BoatEnvironmentNetworkPolicy | null;
	/** The latest version's .env-style content. Treat as sensitive. */
	envContents?: string | null;
	secretFiles?: Array<BoatSecretFile> | null;
	/** Repositories attached to the latest version, with base branch and setup script. */
	selectedRepositories?: Array<BoatSelectedRepository> | null;
	versions?: Array<BoatSandboxEnvironmentVersionSummary> | null;
};

export type BoatSandboxEnvironmentListResponse = {
	ok?: boolean | null;
	type?: string | null;
	environments?: Array<BoatSandboxEnvironment> | null;
};

export type BoatSandboxEnvironmentResponse = {
	success?: boolean | null;
	environment?: BoatSandboxEnvironment | null;
};

/** An immutable snapshot of an environment's config. Editing an environment mints a new version; sandboxes stay pinned to the version they were created on until upgraded. */
export type BoatSandboxEnvironmentVersionSummary = {
	id?: string | null;
	/** Monotonically increasing per environment; version 1 is the first. */
	versionNumber?: number | null;
	/** Number of the caller's active sandboxes currently pinned to this version. */
	sandboxCount?: number | null;
	createdAt?: string | null;
};

export type BoatSandboxEvent = {
	id?: string | null;
	type?: string | null;
	timestamp?: number | null;
	taskId?: string | null;
	/** The conversation this event belongs to. Filter the stream with `?conversation=<id>`. See [Integrated agents](/integrated-agents). */
	conversationId?: string | null;
	data?: Record<string, BoatJsonValue> | null;
};

export type BoatSandboxInfoResponse = BoatSuccessBase & {
	type?: string | null;
	sandbox?: BoatSandbox | null;
	/** Present when a fair-use cap on a gifted account shortened the requested auto-stop time. */
	giftLimitNotice?: string | null;
};

export type BoatSandboxListResponse = BoatSuccessBase & {
	type?: string | null;
	sandboxes?: Array<BoatSandbox> | null;
	pageInfo?: BoatPageInfo | null;
	/** Only with `include=deletedCost`, and not for an API key limited to some sandboxes. Machine time this calendar month (UTC) of deleted sandboxes this list would otherwise show. They are not in the list, but their time was billed. Add it to the sandboxes' `cost` to get the full total. */
	deletedCost?: {
		/** The 1st of this month, 00:00 UTC. */
		since?: string | null;
		/** Billable machine-seconds, size multiplier applied. */
		seconds?: number | null;
		/** seconds / secondsPerDollar, at list price. */
		dollars?: number | null;
	} | null;
};

/** The sandbox's outbound network policy. */
export type BoatSandboxNetwork = {
	mode?: string | null;
	/** The canonical entries. Empty unless mode is `allow`. */
	allow?: Array<string> | null;
	/** `enforced`: the sandbox's host confirmed this policy. `pending`: saved, and not on the host yet. A running sandbox keeps its previous rules until then; a stopped one gets this policy before its next start. `none`: the mode is `open`. */
	status?: string | null;
	/** Who can connect to the sandbox. `open`: anyone on the internet. `boat-only`: only boat, and the addresses of `inboundAllow`; the host drops every other connection to the sandbox. `status` covers both directions. */
	inbound?: string | null;
	/** The public addresses that can connect directly to the sandbox when `inbound` is `boat-only`: SSH and raw ports. The canonical entries. Only when the request has `include=inboundAllow` on a network policy route. It is then always an array, and empty when there is no list. The sandbox object never… */
	inboundAllow?: Array<string> | null;
	/** Only with status `pending`. `host`: the host has not confirmed the policy yet. `transfer`: the host enforces the policy, and a restore or a snapshot still runs. Until it ends, the storage servers of boat stay reachable over TLS. */
	pendingReason?: string | null;
	/** True when this sandbox reaches the boat API only as itself, with the credentials boat put in it. boat refuses every other key, sign-in or session from inside it with 403 `sandbox_bound`. Every sandbox that starts restricted is bound. False on a running sandbox that you restricted while it ran:… */
	apiBound?: boolean | null;
	/** Where the policy comes from. `environment`: the policy of its environment version. `sandbox`: a policy set on this sandbox. `default`: neither sets one, so the sandbox is open. */
	source?: string | null;
	/** When the policy was last set, or null if never. */
	updatedAt?: string | null;
};

export type BoatSandboxProcess = {
	pid?: number | null;
	/** Live list only. */
	parentPid?: number | null;
	/** Live list only. */
	user?: string | null;
	cpuPercent?: number | null;
	/** Resident memory. */
	memoryMB?: number | null;
	/** Live list only. */
	startedAt?: string | null;
	/** The full command line (first 1000 characters; 120 in a stored sample). */
	command?: string | null;
	/** Live list: the history record holding this process's output, when it has one. */
	commandId?: string | null;
};

export type BoatSandboxUsageResponse = BoatSuccessBase & {
	type?: string | null;
	sandboxId?: string | null;
	/** The sandbox's current machine size, which sets `billingMultiplier`. */
	sandboxType?: string | null;
	/** Rate at which this sandbox consumes machine time. 0.5 for `small`, 1 for `default`, 2 for `large`, and 50/9 (about 5.56) for `xlarge`. */
	billingMultiplier?: number | null;
	/** Start of the window the figures cover. The sandbox's creation time when the request did not pass `since`. */
	since?: string | null;
	/** End of the window. Now when the request did not pass `until`, or passed one in the future. */
	until?: string | null;
	/** Billable machine-seconds inside the window, the type multiplier already applied: a `large` sandbox that ran ten minutes reads 1200. Includes a running sandbox's time up to `until`. Time while stopped is never counted and time past a refused stop is excluded. */
	seconds?: number | null;
	/** `seconds` at list price (`seconds / secondsPerDollar`), whatever plan, trial or gift actually paid for it. Up to six decimals. */
	dollars?: number | null;
	/** How many billable seconds one dollar buys, so you can price `seconds` yourself. */
	secondsPerDollar?: number | null;
	/** The meter is still moving: the sandbox is up and no refused stop is holding it paused. Read again after it stops for the final figure. `false` on a sandbox that is up but paused past a refused stop, whose figure will not change until it is used again. */
	running?: boolean | null;
};

/** A saved snapshot: a frozen copy of a sandbox's disk at one moment, saved under a name you pick. Independent of the source sandbox's later life: the sandbox can change, stop, or be deleted and the saved snapshot still deploys. Saved snapshots never expire; re-saving a name replaces its artifact. */
export type BoatSavedSnapshot = {
	/** The user-chosen handle, unique within your account. */
	name?: string | null;
	/** `saving` while the capture and pin are in flight (a live source sandbox takes a fresh snapshot first, which can run minutes), `ready` when deployable, `failed` if the save did not complete (see `error`; save again to retry). */
	status?: string | null;
	/** Failure reason. Only present when `status` is `failed`. */
	error?: string | null;
	/** The sandbox this snapshot was saved from (display only). */
	sourceSandboxId?: string | null;
	/** The frozen artifact behind the name. Present once `status` is `ready`. Accepted by `GET /api/boat/snapshots/{snapshotId}/tree` to browse its files. */
	snapshotId?: string | null;
	/** Sandbox type the snapshot was saved from. Deploys default to it. */
	type?: string | null;
	/** Restored content size of the frozen state, in bytes. */
	sizeBytes?: number | null;
	createdAt?: string | null;
};

/** What the request's wallet (your active organization, `?org=`, or personal) pays for saved snapshots. The plan includes some; each one above costs $0.056 a day from the wallet. An organization's count includes every member's names billed to it. */
export type BoatSavedSnapshotAllowance = {
	/** Organization the numbers are for. null = personal. */
	org?: string | null;
	/** That organization's name. */
	orgName?: string | null;
	/** Saved snapshots the plan includes: 10 per $20 of plan per seat, never fewer than 10. */
	included?: number | null;
	/** Same value as included. Kept for older clients. */
	free?: number | null;
	/** Saved snapshots this wallet keeps. */
	used?: number | null;
	/** Saved snapshots above the included ones. */
	extra?: number | null;
	/** What the extra ones cost per month. */
	extraMonthlyDollars?: number | null;
	/** What the wallet pays per day for the extra ones, in dollars. */
	extraDailyDollars?: number | null;
	/** Price of one extra saved snapshot for 30 days (1.68). */
	pricePerExtraMonthlyDollars?: number | null;
	/** Daily price of one extra saved snapshot (0.056). */
	pricePerExtraDailyDollars?: number | null;
};

export type BoatSavedSnapshotDeletedResponse = BoatSuccessBase & {
	type?: string | null;
	name?: string | null;
	status?: string | null;
};

export type BoatSavedSnapshotInfoResponse = BoatSuccessBase & {
	type?: string | null;
	snapshot?: BoatSavedSnapshot | null;
};

export type BoatSavedSnapshotListResponse = BoatSuccessBase & {
	type?: string | null;
	snapshots?: Array<BoatSavedSnapshot> | null;
	allowance?: BoatSavedSnapshotAllowance | null;
};

export type BoatSavedSnapshotSavingResponse = BoatSuccessBase & {
	type?: string | null;
	status?: string | null;
	snapshot?: BoatSavedSnapshot | null;
};

export type BoatSecretFile = {
	path?: string | null;
	/** Secret file contents. Treat as sensitive. */
	contents?: string | null;
};

export type BoatSecretsResponse = BoatSuccessBase & {
	success?: boolean | null;
	environmentId?: string | null;
	/** Id of the default environment. `environmentId` is the id of its latest version. */
	subenvironmentId?: string | null;
	envContents?: string | null;
	secretFiles?: Array<BoatSecretFile> | null;
	/** Present on update; counts how many active sandboxes received the new environment. */
	pushed?: Record<string, BoatJsonValue> | null;
};

export type BoatSelectedRepository = BoatRepository & {
	baseBranch?: string | null;
	setupRoutineId?: string | null;
	setupScript?: string | null;
	setupBlocking?: boolean | null;
};

export type BoatSnapshotChunk = {
	snapshotId?: string | null;
	generation?: number | null;
	chunkIndex?: number | null;
	r2Key?: string | null;
	sizeBytes?: number | null;
	sha256?: string | null;
	/** Time-limited download URL (see `expiresInSeconds`). */
	signedUrl?: string | null;
};

export type BoatSnapshotDownloadResponse = BoatSuccessBase & {
	type?: string | null;
	snapshotId?: string | null;
	sandboxId?: string | null;
	kind?: string | null;
	generation?: number | null;
	/** Lifetime of every `signedUrl` in this response. */
	expiresInSeconds?: number | null;
	/** Human-readable note on how to reassemble the chunks into a filesystem. */
	reconstruct?: string | null;
	inventory?: {
		r2Key?: string | null;
		signedUrl?: string | null;
	} | null;
	/** Every chunk across the chain (all generations up to and including this snapshot), ordered by `(generation, chunkIndex)`. */
	chunks?: Array<BoatSnapshotChunk> | null;
};

export type BoatSnapshotLatestResponse = BoatSuccessBase & {
	type?: string | null;
	snapshot?: BoatSnapshotSummary | null;
};

export type BoatSnapshotListResponse = BoatSuccessBase & {
	type?: string | null;
	snapshots?: Array<BoatSnapshotSummary> | null;
	pageInfo?: BoatPageInfo | null;
};

export type BoatSnapshotSummary = {
	id?: string | null;
	/** Public Sandbox id this snapshot belongs to. */
	sandboxId?: string | null;
	status?: string | null;
	/** `base` (full) or `incremental` (delta on a base). `null` for legacy snapshots. */
	kind?: string | null;
	/** Position in the incremental chain (0 = base). */
	generation?: number | null;
	chainId?: string | null;
	createdAt?: string | null;
	completedAt?: string | null;
	/** Bytes this snapshot added (its delta), not the full restored size. */
	sizeBytes?: number | null;
	/** Inventory entries alive in the chain at this generation (includes base-image system entries). */
	fileCount?: number | null;
	/** Total bytes of your data restored by this snapshot (what resume/download returns; base image excluded). `null` on legacy snapshots. */
	contentSizeBytes?: number | null;
	/** Number of your files restored by this snapshot (base image excluded). `null` on legacy snapshots. */
	contentFileCount?: number | null;
	/** `template` = this Sandbox has snapshots off, so Boat never captures it: the row is a copy of the template, saved snapshot or Sandbox it was created from. `captured` = this Sandbox has snapshots on: its own captures, plus the copies Boat makes when the Sandbox is created from a source, forked or… */
	origin?: string | null;
};

export type BoatSnapshotTreeEntry = {
	/** Path relative to the snapshot root. Docker named volumes appear under `__dockervol__/`. */
	path?: string | null;
	kind?: string | null;
	/** File size in bytes. Omitted for directories. */
	size?: number | null;
};

export type BoatSnapshotTreeResponse = BoatSuccessBase & {
	type?: string | null;
	snapshotId?: string | null;
	sandboxId?: string | null;
	generation?: number | null;
	/** `false` for legacy snapshots or inventories too large to expand; see `reason`. */
	treeAvailable?: boolean | null;
	/** `true` when the file list was capped; not every entry is returned. */
	truncated?: boolean | null;
	/** Number of your files in this snapshot (base-image system files excluded). */
	fileCount?: number | null;
	/** Total bytes of your data in this snapshot (base-image system files excluded). */
	totalSizeBytes?: number | null;
	/** Exactly the files/dirs a resume or download returns, your data only; base-image system entries are not listed. */
	entries?: Array<BoatSnapshotTreeEntry> | null;
	/** Why the tree is unavailable, when `treeAvailable` is `false`. */
	reason?: string | null;
};

export type BoatSshKeyResponse = BoatSuccessBase & {
	/** Only when the request has `include=caller` and the sandbox has an inbound list. The caller of this request, as boat sees it. */
	caller?: {
		/** The public address that the request comes from. Null when boat cannot tell. */
		address?: string | null;
		/** An entry of the inbound list covers `address`. */
		listed?: boolean | null;
	} | null;
	success?: boolean | null;
	machineIp?: string | null;
	sshUser?: string | null;
	/** Public IPv4 `host:port` that forwards to the sandbox SSH server, set only when the machine has no public IPv4 of its own. Connect with `ssh -p <port> user@<host>`. */
	sshEndpoint?: string | null;
	/** The sandbox SSH server's public host key. Pin it in `known_hosts`. */
	hostKey?: string | null;
};

/** One rolling start window. Null when the account is unlimited. */
export type BoatStartWindowUsage = {
	limit?: number | null;
	used?: number | null;
	remaining?: number | null;
} | null;

export type BoatSteerResponse = BoatSuccessBase & {
	type?: string | null;
	/** Sandbox id. */
	id?: string | null;
	/** The conversation whose running turn was steered. */
	conversationId?: string | null;
	/** Id of the steer record. It appears in `GET /events` as a `steer` event; it is not a prompt run and has no lifecycle to poll. */
	promptId?: string | null;
	/** `true` when the harness accepted the message into the turn that was already running, so nothing was interrupted. `false` when Boat interrupted that turn and immediately continued the SAME conversation with the instruction, which keeps the harness session and all of its memory but may repeat a… */
	native?: boolean | null;
	/** How the message was delivered. `native` and `fallback` mirror the `native` field; `late` means the turn finished between the request and its delivery, so the message ran as an ordinary new turn on the conversation. A steer reported `native` here can settle as `native-continued` on the `steer`… */
	mode?: string | null;
	status?: string | null;
};

export type BoatStopOperation = {
	/** Stable id of this stop. Calling stop again while it is pending returns the same id. */
	id?: string | null;
	/** `pending`: accepted, the sandbox is archiving. `failing`: the last attempt failed (see `error`); it is retried automatically until the sandbox archives. Running commands or prompts does not cancel it. `completed`: the sandbox is archived. `superseded`: a resume ended it before it completed. */
	status?: string | null;
	/** When the stop was accepted. On the sandbox, null once it has ended. Read by id (`GET /sandboxes/{sandboxId}/stops/{stopId}`), it is kept. */
	requestedAt?: string | null;
	/** When the last archival attempt ended. */
	lastAttemptAt?: string | null;
	/** Why the last attempt failed, while `status` is `failing`. Otherwise null. */
	error?: string | null;
	/** When the stop completed or was superseded. */
	endedAt?: string | null;
	/** True when a force (`--force`) ended this stop. The sandbox kept its last completed snapshot, and changes after it are discarded. */
	forced?: boolean | null;
};

export type BoatStopOperationResponse = BoatSuccessBase & {
	type?: string | null;
	id?: string | null;
	stop?: BoatStopOperation | null;
};

export type BoatSuccessBase = {
	ok?: boolean | null;
	/** Stable success envelope discriminator added by v1. */
	type?: string | null;
};

export type BoatTelemetryConfig = {
	/** The OTLP/HTTP base URL. Boat posts to `<endpoint>/v1/metrics` and `<endpoint>/v1/logs`. */
	endpoint?: string | null;
	/** The names of the saved headers. The values are never returned. */
	headers?: Array<string> | null;
	/** The time of the last metrics export that the collector accepted. */
	lastExportAt?: string | null;
	/** The most recent error from the collector, for metrics or events. */
	lastError?: {
		message?: string | null;
		/** HTTP status, or null for a network error. */
		status?: number | null;
		at?: string | null;
	} | null;
	createdAt?: string | null;
};

export type BoatTelemetryResponse = BoatSuccessBase & {
	telemetry?: BoatTelemetryConfig | null;
};

export type BoatTelemetrySetResponse = BoatTelemetryResponse & {
	test?: BoatTelemetryTestResult | null;
};

export type BoatTelemetryTestResult = {
	/** True when the collector accepted the test export. */
	ok?: boolean | null;
	status?: number | null;
	/** The collector error or partial-success message. */
	message?: string | null;
};

export type BoatUpgradeSandboxEnvironmentResponse = {
	success?: boolean | null;
	upgraded?: number | null;
	/** Running sandboxes that received the new configuration now. */
	upgradedLive?: number | null;
	/** Stopped sandboxes moved to the latest version; they pick it up when they next resume. */
	upgradedStopped?: number | null;
	failed?: number | null;
	/** One entry for each sandbox that the upgrade did not move. It stays on its version, with its policy. */
	failures?: Array<{
		sandboxId?: string | null;
		/** `network_policy_unsupported`: its host cannot enforce a policy yet. `network_policy_agent_outdated`: its agent is from before network policies. For both, stop the sandbox, then upgrade again. `network_policy_pending`: its host did not confirm the policy in time. `upgrade_failed`: another failure. */
		error?: string | null;
		message?: string | null;
	}> | null;
	/** Id of the version the sandboxes were moved to. */
	latestVersionId?: string | null;
};

export type BoatWebhook = {
	id?: string | null;
	name?: string | null;
	/** Public HTTPS endpoint on port 443. */
	url?: string | null;
	events?: Array<BoatWebhookEventType> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type BoatWebhookDeleteResponse = BoatSuccessBase & {
	id?: string | null;
};

export type BoatWebhookEventType = string;

export type BoatWebhookListResponse = BoatSuccessBase & {
	webhooks?: Array<BoatWebhook> | null;
};

export type BoatWebhookResponse = BoatSuccessBase & {
	webhook?: BoatWebhook | null;
};

export type BoatWebhookSecretResponse = BoatWebhookResponse & {
	/** Signing secret returned only when created or rotated. */
	secret?: string | null;
};

export type BoatOperationInputs = {
	'account.getCallerAddress': Record<string, never>;
	'account.getDataRetention': Record<string, never>;
	'account.getLimits': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Legacy alias for `org`. Takes precedence over `org` / `X-Boat-Org` when set. */
		teamId?: string;
	};
	'account.getMe': Record<string, never>;
	'account.updateDataRetention': {
		enabled?: boolean;
		/** Turn snapshots off for every sandbox created from now on. Existing sandboxes keep their setting. While on, a create or fork that passes `snapshots: true` is refused with 409 `snapshots_off_for_account`. */
		snapshotsOff?: boolean;
		/** Turn monitoring off for every sandbox created from now on. Existing sandboxes keep their setting. While on, a create or fork that passes `monitoring: true` is refused with 409 `monitoring_off_for_account`. */
		monitoringOff?: boolean;
		/** Required when enabling and must exactly equal `delete archived sandbox data`. */
		confirmation?: 'delete archived sandbox data';
	};
	'aiProxy.get': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
	};
	'aiProxy.getUsage': {
		/** Days of history, today included. */
		days?: number;
		/** A credential profile id. Counts that profile's requests instead of a wallet's. */
		profile?: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
	};
	'aiProxy.update': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		enabled: boolean;
	};
	'apiKeys.createScoped': {
		name?: string;
		/** Duration such as 90d, 24h, or seconds, up to 365d; or `never` for a key that works until revoked. Default 90d. */
		ttl?: string;
		preset?: 'read-only' | 'full-sandbox' | 'ci' | 'admin';
		actions?: Array<string>;
		sandboxIds?: Array<string>;
		environmentIds?: Array<string>;
	};
	'apiKeys.getUsage': {
		/** API key ID returned by `GET /api-keys`. */
		apiKeyId: string;
	};
	'apiKeys.list': Record<string, never>;
	'apiKeys.revoke': {
		apiKeyId: string;
	};
	'apiKeys.rotate': {
		apiKeyId: string;
	};
	'ci.connectGithub': {
		/** The organization whose wallet pays for the jobs. Omit for the wallet in scope. */
		org?: string;
		/** GitHub organization or user login. Set this to authorize and link an existing installation. Omit it to install the app. */
		account?: string;
		/** Install Boat CI for orgs instead. It needs only the organization permission Self-hosted runners, not repository Administration. GitHub organizations only. */
		orgApp?: boolean;
	};
	'ci.getJob': {
		/** GitHub workflow job id. */
		jobId: string;
	};
	'ci.getJobLog': {
		/** GitHub workflow job id. */
		jobId: string;
	};
	'ci.getOverview': {
		/** Only this GitHub account (organization or user login). */
		account?: string;
		/** Only this repository, as owner/name. */
		repo?: string;
		/** active = queued or running. failed = failed, never started, or refused. */
		state?: 'all' | 'active' | 'failed';
		limit?: number;
	};
	'ci.setPublicRepos': {
		/** The linked GitHub account (login) or installation ID. */
		account: string;
		/** true = jobs from public repositories run. Omit to keep the current value. */
		allow?: boolean;
		/** GitHub users allowed: "alice, @bob" or a list. Commas, spaces, @ and profile URLs are accepted. "" = anyone. Omit to keep the current list. */
		users?: string | Array<string>;
		/** Only check the users on GitHub; change nothing. */
		dryRun?: boolean;
		/** The organization in scope. */
		org?: string;
	};
	'credentialProfiles.accounts.add': {
		/** Profile id or name. */
		profile: string;
		credential: BoatCredentialIdInput;
		/** The API key. Boat encrypts it at rest. */
		value: string;
		/** Keep the key this one replaces as another account of the credential, ready to switch back to. */
		keepCurrent?: boolean;
	};
	'credentialProfiles.accounts.delete': {
		/** Profile id or name. */
		profile: string;
		credential: BoatCredentialIdInput;
		/** The account id from the list. */
		account: string;
	};
	'credentialProfiles.accounts.list': {
		/** Profile id or name. */
		profile: string;
		credential: BoatCredentialIdInput;
	};
	'credentialProfiles.accounts.switch': {
		/** Profile id or name. */
		profile: string;
		credential: BoatCredentialIdInput;
		/** The account id from the list. */
		account: string;
	};
	'credentialProfiles.create': {
		/** Unique among the owner's profiles. */
		name: string;
		/** Organization id or name. The profile then belongs to that organization. Omit for a personal profile. */
		org?: string;
		/** Id or name of a profile you manage. The new profile starts with a copy of its credentials. */
		copyFrom?: string;
	};
	'credentialProfiles.customApis.delete': {
		/** Profile id or name. */
		profile: string;
		/** Environment variable name of the custom API, for example `STRIPE_KEY`. Provider names (`ANTHROPIC_*`, `OPENAI_*`, and so on) and names that end in `_BASE_URL` are reserved. */
		name: string;
	};
	'credentialProfiles.customApis.set': {
		/** Profile id or name. */
		profile: string;
		/** Environment variable name of the custom API, for example `STRIPE_KEY`. Provider names (`ANTHROPIC_*`, `OPENAI_*`, and so on) and names that end in `_BASE_URL` are reserved. */
		name: string;
		/** The secret. The sandbox gets it as the variable named in the path. */
		value: string;
		/** Public HTTPS base URL of the API, on the default port, with a DNS name. The sandbox gets it as `<NAME>_BASE_URL`. */
		baseUrl: string;
	};
	'credentialProfiles.delete': {
		/** Profile id or name. */
		profile: string;
	};
	'credentialProfiles.deleteKey': {
		/** Profile id or name. */
		profile: string;
		credential: BoatCredentialIdInput;
	};
	'credentialProfiles.list': Record<string, never>;
	'credentialProfiles.setKey': {
		/** Profile id or name. */
		profile: string;
		credential: BoatCredentialIdInput;
		/** The API key. Boat encrypts it at rest. */
		value: string;
		/** Keep the key this one replaces as another account of the credential, ready to switch back to. */
		keepCurrent?: boolean;
	};
	'credentialProfiles.update': {
		/** Profile id or name. */
		profile: string;
		/** New profile name. */
		name?: string;
		/** Send true to make this profile its owner's default. The previous default loses the flag. False is ignored; make another profile the default instead. */
		isDefault?: boolean;
		/** Organization profiles only. Organization owner only. */
		access?: BoatResourceAccessUpdateInput;
	};
	'deletionOperations.get': {
		/** Deletion operation id returned by an accepted delete request. */
		operationId: string;
	};
	'environments.addRepo': {
		environmentId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** The repository `databaseId` from `GET /repos`. */
		repositoryId: string;
		baseBranch?: string;
	};
	'environments.create': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Unique environment name. Letters, numbers, dot, dash, underscore; max 64 chars. */
		name: string;
	};
	'environments.delete': {
		/** Environment id returned by `GET /environments`. */
		environmentId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
	};
	'environments.deleteRepo': {
		environmentId: string;
		/** The repository `databaseId`. */
		repositoryId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
	};
	'environments.deleteSecretFile': {
		environmentId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		path: string;
	};
	'environments.deleteVar': {
		environmentId: string;
		/** Environment variable name. */
		key: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
	};
	'environments.list': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Optional fields of the answer. `inboundAllow`: the answer holds `network.inboundAllow`, always an array, and empty when there is no list. Without it, the answer has the fields that it had before the inbound list existed. */
		include?: Array<'inboundAllow'>;
	};
	'environments.setSecretFile': {
		environmentId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** In-sandbox path relative to the workspace, e.g. `.env` or `repo/.env`. */
		path: string;
		contents: string;
	};
	'environments.setVar': {
		environmentId: string;
		/** Environment variable name. */
		key: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		value: string;
	};
	'environments.update': {
		/** Environment id returned by `GET /environments`. */
		environmentId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Optional fields of the answer. `inboundAllow`: the answer holds `network.inboundAllow`, always an array, and empty when there is no list. Without it, the answer has the fields that it had before the inbound list existed. */
		include?: Array<'inboundAllow'>;
		/** New environment name. */
		name?: string;
		/** Set to true to make this the default environment (clears the flag on the previous default). */
		isDefault?: boolean;
		safeForThirdParties?: boolean;
		passGithub?: boolean;
		passSecrets?: boolean;
		passSandboxCredentials?: boolean;
		passAgentsCredentials?: boolean;
		/** Id or name of a credential profile you can use, or null for the sandbox owner's default profile. Unknown profiles return `404 credential_profile_not_found`. */
		credentialProfileId?: string | null;
		/** With `safeForThirdParties` true, pass AI credentials as proxy placeholders. Setting true needs the AI credentials proxy on for the profile owner, else `400 ai_proxy_off`. */
		proxyAiCredentials?: boolean;
		access?: BoatResourceAccessUpdateInput;
		/** Replaces the outbound network policy of the environment. An object sets it, null clears it, and an absent field keeps it. It makes a new version, like every other setting: a running sandbox changes only at an upgrade. Needs the `network.write` action as well as `environment.write`. A bad policy… */
		network?: BoatEnvironmentNetworkPolicyInput | null;
		/** Full .env-style content for the new version. */
		envContents?: string;
		secretFiles?: Array<BoatSecretFileInput>;
		/** Full replacement of the version's repository selection. Each item selects one repository by its internal `databaseId` (from `GET /repos`). */
		repositories?: Array<{
			/** Internal repository databaseId. */
			repositoryId: string;
			baseBranch?: string;
			setupScript?: string;
			setupBlocking?: boolean;
		}>;
	};
	'environments.upgradeSandboxes': {
		environmentId: string;
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Restrict the upgrade to these sandbox (agent) ids. Omit to upgrade all of the caller's active sandboxes that are on an older version of this environment. */
		agentIds?: Array<string>;
	};
	'namedSnapshots.delete': {
		name: string;
	};
	'namedSnapshots.get': {
		name: string;
	};
	'namedSnapshots.list': Record<string, never>;
	'namedSnapshots.save': {
		/** The sandbox whose current state to freeze. */
		sandboxId: string;
		/** Name to save under. 1-63 lowercase letters, digits, or dashes, starting with a letter or digit. Reusing one of your existing names replaces that snapshot's artifact. `latest`, `tree`, `pull`, `rm`, `save`, `current`, `self`, and `new` are reserved. */
		name: string;
	};
	'orgs.list': Record<string, never>;
	'orgs.setActive': {
		/** Organization id or name you belong to; `personal`, your own id or `null` for personal. */
		org: string | null;
	};
	'orgs.update': {
		/** Organization id or name. */
		org: string;
		/** New name. Owner only. Leading and trailing spaces are removed. */
		name?: string;
		/** True = new sandboxes start private. False = they start shared. */
		newSandboxesPrivate?: boolean;
	};
	'repos.list': {
		/** When true, sync from GitHub before returning repository groups. */
		sync?: boolean;
		/** Maximum items to return. */
		limit?: number;
		/** Opaque pagination cursor returned as `pageInfo.nextCursor`. */
		cursor?: string | null;
		/** Sort direction for cursor pagination. */
		sort?: 'asc' | 'desc';
		/** Case-insensitive repository name/fullName filter. */
		q?: string;
		/** Filter to selected or unselected repositories. */
		selected?: boolean;
	};
	'repos.select': {
		/** Internal repository `databaseId` returned by `GET /repos`. */
		repositoryId: string;
		baseBranch?: string;
	};
	'sandboxes.addSshKey': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Optional fields of the answer. `caller`: on a sandbox with an inbound list, the answer holds `caller.address` and `caller.listed`. Without it, the answer has the fields that it had before. */
		include?: Array<'caller'>;
		/** Public SSH key in OpenSSH format. Private keys are rejected. */
		key: string;
	};
	'sandboxes.agent.getPrompt': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		promptId: string;
	};
	'sandboxes.agent.interrupt': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Interrupt only this conversation id. Omit to interrupt the whole sandbox. */
		conversation?: string;
	};
	'sandboxes.agent.listConversations': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.agent.listEvents': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Maximum items to return. */
		limit?: number;
		/** Opaque pagination cursor returned as `pageInfo.nextCursor`. */
		cursor?: string | null;
		/** Sort direction for cursor pagination. */
		sort?: 'asc' | 'desc';
		/** Comma-separated event type filter, for example `prompt,response,steer`. */
		type?: string;
		/** Only return events for this conversation id. Repeat the parameter (or comma-separate) for several. Omit to stream every conversation on the sandbox. See [Integrated agents](/integrated-agents). */
		conversation?: string;
		/** The `ETag` of the last page you read. If the page is unchanged, the answer is `304` with no body. */
		ifNoneMatch?: string;
	};
	'sandboxes.agent.prompt': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		provider:
			| 'codex'
			| 'claude-code'
			| 'claude'
			| 'pi'
			| 'opencode'
			| 'prime-agent'
			| 'prime'
			| 'kimi'
			| 'kimi-code'
			| 'mistral';
		/** Optional provider model id from `GET /provider-models`. Omit to use the model selected for that harness on the Agents dashboard. Unknown explicit ids are currently forwarded rather than rejected by request validation. */
		model?: string | null;
		/** Optional reasoning/thinking level (e.g. `none`, `low`, `medium`, `high`, `xhigh`, `max`). Which levels a given model accepts is listed per model in `GET /provider-models`; some models accept none. */
		reasoningEffort?: string | null;
		/** Optional. `true` runs this prompt in fast mode. The model stays the same and gives output faster. The provider bills fast mode at its higher fast rate. Omit to use the choice saved on the Agents dashboard for that model. `false` forces standard speed. Only models with `fastMode` set to `true` in… */
		fast?: boolean | null;
		/** Optional. Same as `fast`, plus `ultrafast`, the fastest Codex tier, billed above fast. Only models with `ultrafastMode` set to `true` in `GET /provider-models` accept `ultrafast`. Other models return 400 `ultrafast_not_supported`. Ultrafast needs ChatGPT Pro, an Enterprise or Edu workspace with… */
		speed?: 'standard' | 'fast' | 'ultrafast' | null;
		/** Start a NEW conversation on the sandbox (runs in parallel with any existing ones) instead of continuing the most-recently-active one. Mutually exclusive with `conversationId`. */
		new?: boolean;
		/** Continue a specific conversation by id (as returned by a previous prompt). Omit (and omit `new`) to continue the sandbox's most-recently-active conversation. */
		conversationId?: string | null;
		/** Natural-language task for the sandbox, including repo, preview, or browser-use instructions. */
		prompt: string;
	};
	'sandboxes.agent.steer': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** The extra instruction for the running turn. */
		message: string;
		/** Conversation id to steer. Omit to steer the sandbox's most-recently-active conversation. */
		conversation?: string | null;
	};
	'sandboxes.commands.attach': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Process id returned by a detached command start. */
		processId: number;
		/** Start stdout at this byte offset. 0 sends the whole log. */
		stdoutOffset?: number;
		/** Start stderr at this byte offset. 0 sends the whole log. */
		stderrOffset?: number;
	};
	'sandboxes.commands.get': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		commandId: string;
	};
	'sandboxes.commands.getLogs': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		commandId: string;
		stream?: 'stdout' | 'stderr';
		offset?: number;
		limit?: number;
		/** base64 returns the exact bytes. utf8 can split a character at the edge of a read. */
		encoding?: 'utf8' | 'base64';
	};
	'sandboxes.commands.getStatus': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Process id returned by a detached command start. */
		processId: number;
		/** Cap each returned log to its last N bytes. Defaults to 8388608 (8 MiB). Ignored with offsets. */
		tailBytes?: number;
		/** Return only stdout written from this byte offset. Use `stdoutNextOffset` of the previous answer. */
		stdoutOffset?: number;
		/** Return only stderr written from this byte offset. Use `stderrNextOffset` of the previous answer. */
		stderrOffset?: number;
	};
	'sandboxes.commands.listHistory': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Only these modes, comma-separated: sync, stream, detached, process, or `commands` for the first three. Default: all. */
		mode?: string;
		/** Only commands whose command line contains this text, in any case. */
		q?: string;
		limit?: number;
		/** The `nextCursor` of the previous page. */
		cursor?: string;
	};
	'sandboxes.commands.run': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		command: string;
		/** Relative working directory inside the sandbox work directory. */
		cwd?: string;
		/** Command timeout in seconds. Values outside 1-600 are rejected with a 400 invalid_timeout error. */
		timeoutSeconds?: number;
		/** Start the command in the background and return a process id immediately instead of waiting for it to finish. Output goes to a log file on the sandbox; poll the status endpoint for it. */
		detached?: boolean;
	};
	'sandboxes.commands.stop': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Process id returned by a detached command start. */
		processId: number;
	};
	'sandboxes.create': {
		/** Optional exactly-once key for creating a sandbox. Send your own opaque, account-unique value (a UUID) to make `POST /sandboxes` safe to retry when the response is lost (network timeout, 5xx): the first request creates the sandbox and binds it to the key; every later request with the **same… */
		idempotencyKey?: string;
		/** Machine size. `small` consumes machine time at half rate and `large` at twice the default rate (see the Billing guide). `xlarge` needs the $100/month plan or higher, or an account access grant from an administrator. Otherwise, create, resume and fork return 403 `machine_class_plan_required`. A… */
		type?: 'small' | 'default' | 'large' | 'xlarge';
		/** Number of seconds before automatic archival. `null` disables auto-stop. The backend also accepts the string `infinite` for legacy compatibility; new clients should send null. */
		ttlSeconds?: number | null;
		/** Key-value labels, for example your session id. Filter on them with `GET /sandboxes?label=key=value`. At most 20 labels. Keys match `[A-Za-z0-9][A-Za-z0-9._/-]{0,62}`; values are strings of at most 256 bytes. */
		labels?: Record<string, string>;
		/** Per-sandbox environment variables injected into the sandbox's tool environment, on top of the account environment's variables (per-sandbox values win on conflicts). Keys must match `[A-Za-z_][A-Za-z0-9_]{0,127}`; at most 100 variables and 64KB total. Reserved names (`ASCII_TOKEN`,… */
		env?: Record<string, string>;
		/** Name of the sandbox environment to attach to this sandbox. Environments are managed in the Boat dashboard and bundle the repositories, secrets, and credential toggles a sandbox gets. Omit to use your default environment (`base` unless you changed it). Unknown names are rejected with… */
		environment?: string;
		/** Create a sandbox with none of the secrets attached to your account (no environment variables, secret files, or credentials), confined to itself so it cannot act on your account or other sandboxes. For sandboxes you give to your own users. SSH, SCP, desktop, snapshots, and public URLs still work;… */
		noEnv?: boolean;
		/** Pass `false` to never snapshot this sandbox. Nothing is captured in the background, so it pays no CPU or memory for it, and stopping it erases its disk the way zero data retention does. It cannot be resumed, forked, or saved as a saved snapshot, and if its machine fails there is no backup to… */
		snapshots?: boolean;
		/** Pass `false` for monitoring off. Boat keeps no command or process output, process list or CPU/RAM samples for this sandbox, and its history, processes and metrics calls answer 409 `monitoring_off`. Live output of a running command still works. While the account default is on, `true` is refused… */
		monitoring?: boolean;
		network?: BoatNetworkPolicyRequestInput;
		/** Pass `true` to get a sandbox only if a machine of this type is ready right now. The call answers within about 1.5 s: either the usual `202` with the sandbox, or `503` `no_ready_machine` with nothing created, billed, or counted against your start limits, so you can retry or fall back at once.… */
		failFast?: boolean;
		/** With `from`: create this many sandboxes from the saved snapshot in one request. Boat creates them together, which is faster than separate creates when you need many sandboxes at once. Start limits and the active-sandbox limit count every sandbox of the batch; if the batch does not fit, nothing… */
		count?: number;
		/** Shell script that runs on the sandbox after it is ready. Ready means "ready to accept the user", not "setup done": the script starts in the background once provisioning completes and never blocks the sandbox becoming usable. It runs as the sandbox user (`user`, not root; `sudo` needs no… */
		setupScript?: string;
		/** Display name of the sandbox, the same value `PATCH /sandboxes/{id}` sets. A sandbox created `from` a saved snapshot is named after the snapshot when this is omitted. */
		name?: string;
		/** Who can use a sandbox billed to an organization, with the same rules as the sandbox's `visibility` field. `private`: only you can use it. `shared`: every member can, as long as it holds none of your personal logins (`noEnv`, or an environment that passes nothing). Omitted, the organization's… */
		visibility?: 'private' | 'shared';
		/** Ports to host on public HTTPS URLs, each exactly as `POST /sandboxes/{id}/host` does. The create waits for the sandbox's machine (up to 60 s, usually under a second), hosts every port at once and answers the URLs in `hostedPorts`. The ports are routed before the sandbox is ready, so a service… */
		hostedPorts?: Array<BoatHostPortRequestInput>;
		/** Files to write on the sandbox, each like `PUT /sandboxes/{id}/files` (a path under `/home/user` or `/tmp`, relative paths resolve against `/home/user`; missing folders are created). Boat writes them once the sandbox's disk is in place and before it reports `ready`, so a client that sees `ready`,… */
		files?: Array<{
			path: string;
			/** File contents, as text or base64 (see `encoding`). */
			content: string;
			encoding?: 'utf8' | 'base64';
		}>;
		/** Bill this sandbox to an organization you belong to (its shared wallet), by id or by name as `GET /orgs` lists it; `personal` or your own account id means personal billing. Omitted, the `X-Boat-Org` / `?org=` request scope applies, then the account's active wallet (`PATCH /orgs/active`), then… */
		org?: string;
		/** Legacy alias for `org`. Ignored when `org` is also set. */
		teamId?: string;
		/** Create the sandbox from a saved snapshot (saved with `POST /saved-snapshots`, or `boat snapshot <id> <name>` in the CLI). The sandbox starts from that exact frozen state. Omitting `type` inherits the type the snapshot was saved from; env and no-env inherit from the snapshot's source sandbox… */
		from?: string;
	};
	'sandboxes.delete': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Must exactly equal the target `sandboxId` or `snapshotId`. A missing or mismatched value returns `409` without accepting deletion. */
		confirm: string;
	};
	'sandboxes.downloadArtifact': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path: string;
	};
	'sandboxes.files.createDownloadUrl': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Absolute path, or path relative to the sandbox work directory (/home/user). It must resolve under /home/user or /tmp. */
		path: string;
		/** How long the URL stays valid. */
		ttlSeconds?: number;
	};
	'sandboxes.files.createFolder': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Missing parent directories are created. */
		path: string;
		/** Octal permission bits, for example "755". */
		mode?: string;
	};
	'sandboxes.files.createUploadUrl': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Absolute path, or path relative to the sandbox work directory (/home/user). It must resolve under /home/user or /tmp. */
		path: string;
		/** How long the URL stays valid. */
		ttlSeconds?: number;
	};
	'sandboxes.files.delete': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path: string;
		recursive?: boolean;
	};
	'sandboxes.files.find': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path?: string;
		pattern: string;
		regex?: boolean;
	};
	'sandboxes.files.getInfo': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path: string;
	};
	'sandboxes.files.list': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path?: string;
	};
	'sandboxes.files.move': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		source: string;
		/** The new full path. Missing parent directories are created. */
		destination: string;
		/** Replace an existing destination. Without it, an existing destination is an error. */
		overwrite?: boolean;
	};
	'sandboxes.files.read': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Absolute path, or path relative to the sandbox work directory (/home/user). The canonicalized path must resolve under /home/user or /tmp; anything else is rejected with a 400 invalid_path error. */
		path: string;
		encoding?: 'utf8' | 'base64';
	};
	'sandboxes.files.replace': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Files up to 5 MiB each. */
		paths: Array<string>;
		/** Plain text. Every occurrence is replaced, byte for byte; the rest of the file is not changed. */
		pattern: string;
		/** Required. Use "" to delete the matches. */
		newValue: string;
	};
	'sandboxes.files.search': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path?: string;
		pattern: string;
	};
	'sandboxes.files.setPermissions': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		path: string;
		/** Octal permission bits, for example "755". */
		mode: string;
	};
	'sandboxes.files.write': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Absolute path, or path relative to the sandbox work directory (/home/user). The canonicalized path must resolve under /home/user or /tmp; anything else is rejected with a 400 invalid_path error. */
		path: string;
		content: string;
		encoding?: 'utf8' | 'base64';
	};
	'sandboxes.fork': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Optional exactly-once key for creating a sandbox. Send your own opaque, account-unique value (a UUID) to make `POST /sandboxes` safe to retry when the response is lost (network timeout, 5xx): the first request creates the sandbox and binds it to the key; every later request with the **same… */
		idempotencyKey?: string;
		/** Labels of the fork. The fork never takes the source's labels. Same rules as `CreateSandboxRequest.labels`. */
		labels?: Record<string, string>;
		/** Pass `true` to fork only if a machine is ready right now. Within about 1.5 s you get the usual `202`, or `503` `no_ready_machine` with no fork created and nothing counted against your start limits. */
		failFast?: boolean;
		/** `false` creates the fork with monitoring off: Boat keeps no command or process output, process list or CPU/RAM samples for it. Omitted, the fork keeps the source sandbox's setting. `true` turns it on for the fork, unless the account has monitoring off by default (`409` `monitoring_off_for_account`). */
		monitoring?: boolean;
		network?: BoatNetworkPolicyRequestInput;
		/** Replaces the env the fork would otherwise inherit from the source sandbox. Same validation rules as `CreateSandboxRequest.env`. */
		env?: Record<string, string>;
		/** Optionally pin the fork to a different named sandbox environment. Omit to inherit the source sandbox's environment. Unknown names are rejected with `unknown_environment`. */
		environment?: string;
		/** Make the fork no-env (see `CreateSandboxRequest.noEnv`). A fork of a no-env sandbox is always no-env regardless of this field. */
		noEnv?: boolean;
		/** Machine size for the fork. Omit to inherit the source sandbox's type. `xlarge` needs the $100/month plan or higher (403 `machine_class_plan_required`). The source sandbox is never modified. Shrinking is rejected with `type_too_small` when the source's data would not fit the smaller disk. */
		type?: 'small' | 'default' | 'large' | 'xlarge';
		/** Auto-stop for the fork, in seconds. Omit for the 1 hour default; the fork does NOT inherit the source sandbox's TTL, so forking a sandbox that has auto-stop disabled still gives you a fork that stops itself. `null` disables auto-stop, which means nothing will ever stop this sandbox for you. */
		ttlSeconds?: number | null;
	};
	'sandboxes.get': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.getAiUsage': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Days of history, today included. */
		days?: number;
	};
	'sandboxes.getDesktopUrl': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Use VNC/noVNC streaming mode. */
		vnc?: 1;
		/** Desktop streaming theme for non-VNC mode. */
		theme?: 'light' | 'dark';
		/** For `?vnc=1`, return a noVNC URL that does not require an access token. */
		publicAccess?: boolean;
	};
	'sandboxes.getNetworkPolicy': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Optional fields of the answer, separated by commas: `?include=inboundAllow,access`. `inboundAllow`: the answer holds `network.inboundAllow`, always an array, and empty when there is no list. `access`: the answer holds `access`. Without a name, the answer does not hold that field. */
		include?: Array<'inboundAllow' | 'access'>;
	};
	'sandboxes.getStop': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		stopId: string;
	};
	'sandboxes.getUsage': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Count from this time, ISO 8601 or Unix epoch seconds. Default is the sandbox's creation. */
		since?: string;
		/** Count up to this time, ISO 8601 or Unix epoch seconds. Default is now. */
		until?: string;
	};
	'sandboxes.hostPort': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Port the service listens on inside the sandbox. */
		port: number;
		/** Return an ungated URL instead of one that requires the `_token` query parameter. */
		public?: boolean;
		/** Set when the service listens on localhost (`127.0.0.1` or `::1`) only. The sandbox relays the URL to it. Leave unset for a service bound to `0.0.0.0`. Each call sets the value again. */
		localhost?: boolean;
		/** Display title for the hosted port. */
		title?: string;
	};
	'sandboxes.list': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Maximum items to return. */
		limit?: number;
		/** Opaque pagination cursor returned as `pageInfo.nextCursor`. */
		cursor?: string | null;
		/** Sort direction for cursor pagination. */
		sort?: 'asc' | 'desc';
		/** Comma-separated sandbox state filter, for example `ready,idle,running`. */
		state?: string;
		/** Keep the sandboxes with exactly this name. */
		name?: string;
		/** Keep sandboxes whose name starts with this text, for example `myapp-`. The match is literal. */
		namePrefix?: string;
		/** Keep stopped sandboxes that stopped before this ISO 8601 time. Every stop counts, auto-stops too. */
		stoppedBefore?: string;
		/** `true` keeps sandboxes whose data retention deleted (`dataExpiredAt` is set). `false` keeps the others. */
		dataExpired?: boolean;
		/** `key=value`. Repeat it to require several labels, for example `label=session%3Dabc&label=env%3Dprod`. */
		label?: Array<string>;
		/** Comma-separated. `cost` adds each sandbox's `cost` this calendar month (UTC), at list price. `deletedCost` adds wallet-wide machine time of deleted sandboxes this list would show (not for API keys limited to some sandboxes). */
		include?: string;
	};
	'sandboxes.listProcesses': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.recover': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.resume': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Pass `true` to resume only if a machine is ready right now. Within about 1.5 s you get the usual `202`, or `503` `no_ready_machine` with the sandbox left stopped and nothing counted against your start limits. */
		failFast?: boolean;
		/** Resume onto a different machine size. Omit to keep the sandbox's current type. `xlarge` needs the $100/month plan or higher, or an account access grant from an administrator (403 `machine_class_plan_required` otherwise). A resume already restores onto a fresh machine, so changing size costs… */
		type?: 'small' | 'default' | 'large' | 'xlarge';
		/** Replaces the sandbox's per-sandbox environment variables. Omit to keep the sandbox's current env. Same validation rules as `CreateSandboxRequest.env`. */
		env?: Record<string, string>;
		/** Optionally re-pin the sandbox to a different named sandbox environment on resume. Omit to keep the sandbox's current environment. Unknown names are rejected with `unknown_environment`. */
		environment?: string;
		/** Resume into a no-env sandbox: withhold account secrets and scrub inherited owner secrets from the restored snapshot before the sandbox is exposed. One-way; once a sandbox is resumed as no-env it stays no-env on later resumes. */
		noEnv?: boolean;
		/** Auto-stop for the resumed sandbox, in seconds, stored on the sandbox. Omit to keep the TTL the sandbox already had. `null` disables auto-stop, which means nothing will ever stop this sandbox for you. */
		ttlSeconds?: number | null;
	};
	'sandboxes.setAiAccess': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		blocked: boolean;
	};
	'sandboxes.setNetworkPolicy': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Optional fields of the answer, separated by commas: `?include=inboundAllow,access`. `inboundAllow`: the answer holds `network.inboundAllow`, always an array, and empty when there is no list. `access`: the answer holds `access`. Without a name, the answer does not hold that field. */
		include?: Array<'inboundAllow' | 'access'>;
		/** `open`: no limit. `deny`: the sandbox opens no connection. `allow`: it connects only to the entries of `allow`. `environment`: no policy of its own; the sandbox follows the policy of its environment (open when the environment sets none). This is the default on create. In an organization… */
		mode?: 'open' | 'deny' | 'allow' | 'environment';
		/** With mode `allow`, 1 to 100 entries; empty or omitted with any other mode. An empty list with no `mode`, or with mode `open` or `deny`, means no list. Each entry is a domain (`github.com`), a wildcard (`*.github.com`, which covers the domain itself and every subdomain), a public IP address or a… */
		allow?: Array<string>;
		/** Who can connect to the sandbox. `open`: anyone on the internet, on the ports that the sandbox opens. `boat-only`: only boat. The host drops every other connection to the sandbox, so code inside cannot make a port public. SSH, editors, port forwards, the desktop and raw ports stop: their routes… */
		inbound?: 'open' | 'boat-only';
		/** The public addresses that can still connect directly to the sandbox when `inbound` is `boat-only`. Each entry is a public IPv4 or IPv6 address, or a public CIDR range. No domain, port or path. At most 50 entries. Private ranges, reserved ranges and `/0` are refused with 400… */
		inboundAllow?: Array<string>;
		/** Only on `PUT /sandboxes/{sandboxId}/network`: not on create, fork or environments. The entries to add to the list that the sandbox has. The entry rules of `inboundAllow` apply. It needs `inbound: boat-only` in the same request. Do not send it together with an `inboundAllow` that has entries.… */
		inboundAllowAdd?: Array<string>;
	};
	'sandboxes.share': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.snapshots.deleteAll': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Must exactly equal the target `sandboxId` or `snapshotId`. A missing or mismatched value returns `409` without accepting deletion. */
		confirm: string;
	};
	'sandboxes.snapshots.getLatest': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.snapshots.list': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Maximum items to return. */
		limit?: number;
		/** Opaque pagination cursor returned as `pageInfo.nextCursor`. */
		cursor?: string | null;
		/** Sort direction for cursor pagination. */
		sort?: 'asc' | 'desc';
	};
	'sandboxes.stop': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** Stop the sandbox even if its disk cannot be snapshotted. It keeps its last successful snapshot and everything written since then is permanently LOST. Without this, a sandbox whose snapshot pipeline is failing is left running rather than discarding your work, and you are not billed for that time.… */
		force?: boolean;
	};
	'sandboxes.unshare': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
	};
	'sandboxes.update': {
		/** Public Sandbox id returned by create/list/get sandbox calls. */
		sandboxId: string;
		/** New display name. Empty strings are rejected; longer names are truncated to 120 chars by the backend. */
		name?: string;
		/** Replaces all labels of the sandbox. `{}` or `null` removes them. Same rules as `CreateSandboxRequest.labels`. */
		labels?: Record<string, string> | null;
		/** New auto-stop TTL. The deadline becomes now + `ttlSeconds`, so calling this again extends a running sandbox's life. `null` disables auto-stop. */
		ttlSeconds?: number | null;
		/** Rename the sandbox's stable subdomain (the `<subdomain>.on.boat.dev` label). Lowercase letters, digits and hyphens; no leading/trailing/double hyphens; cannot end in `-desktop` or `-<number>` (reserved for the desktop and hosted-port URLs). Must be globally unique. The base URL, desktop URL and… */
		subdomain?: string;
	};
	'savedSnapshots.delete': {
		name: string;
	};
	'savedSnapshots.get': {
		name: string;
	};
	'savedSnapshots.list': {
		/** Billing wallet for this request: an organization you belong to, by id (`team_…`) or by name as `GET /orgs` lists it (case-insensitive), or `personal`. Omitted, the account's active wallet applies (`PATCH /orgs/active`; personal until set). Two organizations sharing the name answer `409… */
		org?: string;
		/** Keep the saved snapshot with exactly this name. */
		name?: string;
		/** Keep saved snapshots whose name starts with this text, for example `ci-`. The match is literal. */
		namePrefix?: string;
	};
	'savedSnapshots.save': {
		/** The sandbox whose current state to freeze. */
		sandboxId: string;
		/** Name to save under. 1-63 lowercase letters, digits, or dashes, starting with a letter or digit. Reusing one of your existing names replaces that snapshot's artifact. `latest`, `tree`, `pull`, `rm`, `save`, `current`, `self`, and `new` are reserved. */
		name: string;
	};
	'savedSnapshots.shares.create': {
		name: string;
	};
	'savedSnapshots.shares.list': {
		name: string;
	};
	'savedSnapshots.shares.revoke': {
		name: string;
		/** Share id, for example `shr_...`. */
		shareId: string;
	};
	'secrets.get': Record<string, never>;
	'secrets.update': {
		/** Full .env-style content to sync into sandboxes. Send the complete desired file contents, not a patch. */
		envContents?: string;
		/** Full list of secret files to keep configured. Send existing files again if they should remain. */
		secretFiles?: Array<BoatSecretFileInput>;
	};
	'snapshots.delete': {
		/** Snapshot id returned by the snapshot list/latest calls. */
		snapshotId: string;
		/** Must exactly equal the target `sandboxId` or `snapshotId`. A missing or mismatched value returns `409` without accepting deletion. */
		confirm: string;
	};
	'snapshots.getDownload': {
		/** Snapshot id returned by the snapshot list/latest calls. */
		snapshotId: string;
	};
	'snapshots.getFile': {
		/** Snapshot id returned by the snapshot list/latest calls. */
		snapshotId: string;
		/** File or folder path inside the snapshot. Empty for the whole snapshot. */
		path?: string;
	};
	'snapshots.getTree': {
		/** Snapshot id returned by the snapshot list/latest calls. */
		snapshotId: string;
	};
	'snapshots.list': {
		/** Maximum items to return. */
		limit?: number;
		/** Opaque pagination cursor returned as `pageInfo.nextCursor`. */
		cursor?: string | null;
		/** Sort direction for cursor pagination. */
		sort?: 'asc' | 'desc';
	};
	'telemetry.delete': Record<string, never>;
	'telemetry.get': Record<string, never>;
	'telemetry.set': {
		/** HTTPS URL on port 443 or 4318. Boat removes a trailing `/v1/metrics` or `/v1/logs`. */
		endpoint: string;
		/** Headers sent with every export, for example the vendor API key. Boat encrypts them at rest. */
		headers?: Record<string, string>;
	};
	'webhooks.create': {
		name?: string | null;
		url: string;
		events: Array<BoatWebhookEventTypeInput>;
	};
	'webhooks.delete': {
		webhookId: string;
	};
	'webhooks.get': {
		webhookId: string;
	};
	'webhooks.list': Record<string, never>;
	'webhooks.rotateSecret': {
		webhookId: string;
	};
	'webhooks.update': {
		webhookId: string;
		name?: string | null;
		url?: string;
		events?: Array<BoatWebhookEventTypeInput>;
	};
};

export type BoatOperationOutputs = {
	'account.getCallerAddress': BoatCallerAddressResponse;
	'account.getDataRetention': BoatDataRetentionPolicyResponse;
	'account.getLimits': BoatLimitsResponse;
	'account.getMe': BoatMeResponse;
	'account.updateDataRetention': BoatDataRetentionPolicyResponse;
	'aiProxy.get': BoatAiProxySettings;
	'aiProxy.getUsage': BoatAccountAiUsageResponse;
	'aiProxy.update': BoatAiProxySettings;
	'apiKeys.createScoped': BoatApiKeySecretResponse;
	'apiKeys.getUsage': BoatApiKeyUsageResponse;
	'apiKeys.list': BoatApiKeysResponse;
	'apiKeys.revoke': BoatApiKeyRevokeResponse;
	'apiKeys.rotate': BoatApiKeySecretResponse;
	'ci.connectGithub': BoatCiConnectResponse;
	'ci.getJob': BoatCiJobResponse;
	'ci.getJobLog': BoatCiJobLogResponse;
	'ci.getOverview': BoatCiOverviewResponse;
	'ci.setPublicRepos': BoatCiPublicReposResponse;
	'credentialProfiles.accounts.add': BoatCredentialAccountsResponse;
	'credentialProfiles.accounts.delete': BoatCredentialAccountsResponse;
	'credentialProfiles.accounts.list': BoatCredentialAccountsResponse;
	'credentialProfiles.accounts.switch': BoatCredentialAccountsResponse;
	'credentialProfiles.create': BoatCredentialProfileResponse;
	'credentialProfiles.customApis.delete': BoatCredentialProfileResponse;
	'credentialProfiles.customApis.set': BoatCredentialProfileResponse;
	'credentialProfiles.delete': BoatCredentialProfileDeletedResponse;
	'credentialProfiles.deleteKey': BoatCredentialProfileResponse;
	'credentialProfiles.list': BoatCredentialProfileListResponse;
	'credentialProfiles.setKey': BoatCredentialProfileResponse;
	'credentialProfiles.update': BoatCredentialProfileResponse;
	'deletionOperations.get': BoatDeletionOperationResponse;
	'environments.addRepo': BoatEnvironmentItemChangeResponse;
	'environments.create': BoatSandboxEnvironmentListResponse;
	'environments.delete': BoatSandboxEnvironmentResponse;
	'environments.deleteRepo': BoatEnvironmentItemChangeResponse;
	'environments.deleteSecretFile': BoatEnvironmentItemChangeResponse;
	'environments.deleteVar': BoatEnvironmentItemChangeResponse;
	'environments.list': BoatSandboxEnvironmentListResponse;
	'environments.setSecretFile': BoatEnvironmentItemChangeResponse;
	'environments.setVar': BoatEnvironmentItemChangeResponse;
	'environments.update': BoatSandboxEnvironmentResponse;
	'environments.upgradeSandboxes': BoatUpgradeSandboxEnvironmentResponse;
	'namedSnapshots.delete': BoatNamedSnapshotDeletedResponse;
	'namedSnapshots.get': BoatNamedSnapshotInfoResponse;
	'namedSnapshots.list': BoatNamedSnapshotListResponse;
	'namedSnapshots.save': BoatNamedSnapshotSavingResponse;
	'orgs.list': BoatOrgListResponse;
	'orgs.setActive': BoatActiveOrgResponse;
	'orgs.update': {
		ok?: boolean | null;
		type?: string | null;
		success?: boolean | null;
		name?: string | null;
		newSandboxesPrivate?: boolean | null;
	};
	'repos.list': BoatReposResponse;
	'repos.select': BoatRepoSelectionResponse;
	'sandboxes.addSshKey': BoatSshKeyResponse;
	'sandboxes.agent.getPrompt': BoatPromptRunResponse;
	'sandboxes.agent.interrupt': BoatSandboxActionResponse;
	'sandboxes.agent.listConversations': BoatConversationsResponse;
	'sandboxes.agent.listEvents': BoatEventsResponse;
	'sandboxes.agent.prompt': BoatPromptResponse;
	'sandboxes.agent.steer': BoatSteerResponse;
	'sandboxes.commands.attach': {
		/** The response body as text. */
		text: string;
		/** The content type Boat answered with. */
		contentType: string | null;
	};
	'sandboxes.commands.get': BoatCommandInfoResponse;
	'sandboxes.commands.getLogs': BoatCommandLogsResponse;
	'sandboxes.commands.getStatus': BoatCommandStatusResponse;
	'sandboxes.commands.listHistory': BoatCommandListResponse;
	'sandboxes.commands.run': BoatCommandResponse | BoatCommandStartedResponse;
	'sandboxes.commands.stop': BoatCommandStopResponse;
	'sandboxes.create': BoatCreateSandboxResponse;
	'sandboxes.delete': BoatDeletionOperationResponse;
	'sandboxes.downloadArtifact': FileOutput;
	'sandboxes.files.createDownloadUrl': BoatFileUrlResponse;
	'sandboxes.files.createFolder': BoatFileInfoResponse;
	'sandboxes.files.createUploadUrl': BoatFileUrlResponse;
	'sandboxes.files.delete': BoatFileDeleteResponse;
	'sandboxes.files.find': BoatFileFindResponse;
	'sandboxes.files.getInfo': BoatFileInfoResponse;
	'sandboxes.files.list': BoatFileListResponse;
	'sandboxes.files.move': BoatFileMoveResponse;
	'sandboxes.files.read': BoatFileReadResponse;
	'sandboxes.files.replace': BoatFileReplaceResponse;
	'sandboxes.files.search': BoatFileSearchResponse;
	'sandboxes.files.setPermissions': BoatFileInfoResponse;
	'sandboxes.files.write': BoatFileWriteResponse;
	'sandboxes.fork': BoatSandboxActionResponse;
	'sandboxes.get': BoatSandboxInfoResponse;
	'sandboxes.getAiUsage': BoatSandboxAiUsageResponse;
	'sandboxes.getDesktopUrl': BoatDesktopResponse;
	'sandboxes.getNetworkPolicy': BoatNetworkPolicyResponse;
	'sandboxes.getStop': BoatStopOperationResponse;
	'sandboxes.getUsage': BoatSandboxUsageResponse;
	'sandboxes.hostPort': BoatHostPortResponse;
	'sandboxes.list': BoatSandboxListResponse;
	'sandboxes.listProcesses': BoatProcessListResponse;
	'sandboxes.recover': {
		ok?: boolean | null;
		type?: string | null;
		status?: string | null;
		message?: string | null;
	};
	'sandboxes.resume': BoatSandboxActionResponse;
	'sandboxes.setAiAccess': BoatSandboxAiAccessResponse;
	'sandboxes.setNetworkPolicy': BoatNetworkPolicyResponse;
	'sandboxes.share': {
		sandbox?: BoatSandbox | null;
		/** True when the sandbox was running: what runs on it still holds your logins in memory, so it stays `view` for the organization until you stop and resume it. */
		restartRequired?: boolean | null;
		message?: string | null;
	};
	'sandboxes.snapshots.deleteAll': BoatDeletionOperationListResponse;
	'sandboxes.snapshots.getLatest': BoatSnapshotLatestResponse;
	'sandboxes.snapshots.list': BoatSnapshotListResponse;
	'sandboxes.stop': BoatSandboxActionResponse;
	'sandboxes.unshare': {
		sandbox?: BoatSandbox | null;
		message?: string | null;
	};
	'sandboxes.update': BoatSandboxInfoResponse;
	'savedSnapshots.delete': BoatSavedSnapshotDeletedResponse;
	'savedSnapshots.get': BoatSavedSnapshotInfoResponse;
	'savedSnapshots.list': BoatSavedSnapshotListResponse;
	'savedSnapshots.save': BoatSavedSnapshotSavingResponse;
	'savedSnapshots.shares.create': BoatNamedSnapshotShareCreatedResponse;
	'savedSnapshots.shares.list': BoatNamedSnapshotShareListResponse;
	'savedSnapshots.shares.revoke': BoatNamedSnapshotShareRevokedResponse;
	'secrets.get': BoatSecretsResponse;
	'secrets.update': BoatSecretsResponse;
	'snapshots.delete': BoatDeletionOperationResponse;
	'snapshots.getDownload': BoatSnapshotDownloadResponse;
	'snapshots.getFile': FileOutput;
	'snapshots.getTree': BoatSnapshotTreeResponse;
	'snapshots.list': BoatSnapshotListResponse;
	'telemetry.delete': BoatTelemetryResponse;
	'telemetry.get': BoatTelemetryResponse;
	'telemetry.set': BoatTelemetrySetResponse;
	'webhooks.create': BoatWebhookSecretResponse;
	'webhooks.delete': BoatWebhookDeleteResponse;
	'webhooks.get': BoatWebhookResponse;
	'webhooks.list': BoatWebhookListResponse;
	'webhooks.rotateSecret': BoatWebhookSecretResponse;
	'webhooks.update': BoatWebhookResponse;
};
