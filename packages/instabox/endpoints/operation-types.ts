// Generated from Instabox's OpenAPI spec (https://api.instabox.sh/openapi.json,
// fetched 2026-11-27); instabox-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileOutput } from 'corsair/http';

export type InstaboxJsonValue =
	| null
	| boolean
	| number
	| string
	| InstaboxJsonValue[]
	| { [key: string]: InstaboxJsonValue | undefined };

export const INSTABOX_OPERATION_IDS = [
	'exports.download',
	'exports.get',
	'feedback.send',
	'gpuQueue.cancel',
	'gpuQueue.list',
	'keys.create',
	'keys.list',
	'keys.revoke',
	'machines.activityLeases.release',
	'machines.activityLeases.renew',
	'machines.claimOomKill',
	'machines.connectionInfo',
	'machines.create',
	'machines.createAccess',
	'machines.createSnapshot',
	'machines.delete',
	'machines.desktop.createLink',
	'machines.desktop.get',
	'machines.desktop.revokeLinks',
	'machines.disk',
	'machines.exec',
	'machines.files.createUploadUrl',
	'machines.files.download',
	'machines.files.read',
	'machines.files.write',
	'machines.fork',
	'machines.get',
	'machines.history.get',
	'machines.history.list',
	'machines.list',
	'machines.logs',
	'machines.metrics',
	'machines.ports.create',
	'machines.ports.delete',
	'machines.ports.installAgent',
	'machines.ports.list',
	'machines.processes',
	'machines.restore',
	'machines.resume',
	'machines.secrets.get',
	'machines.secrets.refresh',
	'machines.secrets.update',
	'machines.ssh.createToken',
	'machines.ssh.issueCertificate',
	'machines.ssh.listTokens',
	'machines.ssh.revokeAllTokens',
	'machines.ssh.revokeToken',
	'machines.start',
	'machines.stop',
	'machines.suspend',
	'machines.update',
	'machines.usage',
	'machines.vault.get',
	'machines.vault.write',
	'machines.wake',
	'me.discord.get',
	'me.discord.unlink',
	'me.get',
	'operations.get',
	'orgs.billing.cancelSubscription',
	'orgs.billing.changePlan',
	'orgs.billing.checkout',
	'orgs.billing.getTopup',
	'orgs.billing.movePersonal',
	'orgs.billing.portal',
	'orgs.billing.resumeSubscription',
	'orgs.billing.subscribeWithCredits',
	'orgs.billing.topup',
	'orgs.billing.update',
	'orgs.create',
	'orgs.delete',
	'orgs.exports.create',
	'orgs.exports.list',
	'orgs.get',
	'orgs.github.installations.delete',
	'orgs.github.installations.list',
	'orgs.github.jobs.get',
	'orgs.github.jobs.list',
	'orgs.github.stats',
	'orgs.inviteCode.get',
	'orgs.inviteCode.regenerate',
	'orgs.invites.create',
	'orgs.invites.list',
	'orgs.invites.resend',
	'orgs.invites.revoke',
	'orgs.keys.create',
	'orgs.keys.list',
	'orgs.keys.revoke',
	'orgs.list',
	'orgs.members.changeRole',
	'orgs.members.list',
	'orgs.members.remove',
	'orgs.movePersonal',
	'orgs.redeemInvite',
	'orgs.secrets.delete',
	'orgs.secrets.import',
	'orgs.secrets.list',
	'orgs.secrets.set',
	'orgs.update',
	'orgs.webhooks.create',
	'orgs.webhooks.delete',
	'orgs.webhooks.deliveries.list',
	'orgs.webhooks.deliveries.retry',
	'orgs.webhooks.get',
	'orgs.webhooks.list',
	'orgs.webhooks.rotate',
	'orgs.webhooks.test',
	'orgs.webhooks.update',
	'ports.list',
	'sessions.list',
	'sessions.signOut',
	'snapshots.delete',
	'snapshots.files.list',
	'snapshots.get',
	'snapshots.list',
	'stats.get',
	'support.tickets.close',
	'support.tickets.get',
	'support.tickets.list',
	'support.tickets.reply',
	'templates.list',
	'usage.get',
	'usage.machines',
	'vault.delete',
	'vault.export',
	'vault.import',
	'vault.list',
	'vault.set',
	'vault.update',
] as const;

export type InstaboxOperationId = (typeof INSTABOX_OPERATION_IDS)[number];

export type InstaboxAPIKeyScopeInput =
	| 'machines:read'
	| 'machines:write'
	| 'machines:delete'
	| 'images:read'
	| 'images:write'
	| 'images:delete';

/** Absent: 1800 (30 minutes). The plan decides, and a value is honoured or refused, never silently replaced: a paid sandbox takes 300-1800 (5 to 30 minutes) in whole minutes, as sent, and 0 (off) where the plan allows always on (else `403 spec_not_allowed`); below 300 (1-299), above 1800, negative… */
export type InstaboxAutoSuspendAfterSecondsInput = number;

/** A reference to a direct (delivery env) Secret: its real value as the variable `env` (exported by login shells), as a file at `file` (home-relative; the value stays on tmpfs at /run/instabox/secrets/files and the home path is a symlink to it), or both. Names and paths only; values are never returned. */
export type InstaboxDirectSecretInput = {
	/** Not reserved (PATH, HOME, BASH_ENV, IFS, CA variables, ...) and no INSTABOX_ or SSH_ prefix. */
	env?: string;
	/** Clean path relative to the home directory, without .. components. */
	file?: string;
	secret: InstaboxSecretNameInput;
};

/** Maximum continuous runtime in minutes. -1 is unlimited; 0 sleeps immediately. Independent of idle auto-pause; whichever condition is reached first pauses the sandbox. On a free machine the service sets it and only an admin session can change it: each run starts at 120 minutes and grows with use… */
export type InstaboxMaxRunMinutesInput = number;

/** String labels. At most 32 keys of 1-64 characters `[A-Za-z0-9_.-]`, values of at most 512 characters, 8 KiB as JSON. */
export type InstaboxMetadataInput = Record<string, string>;

/** A sandbox's outbound network policy: where it may connect to on the internet. It only narrows: a destination the platform blocks stays blocked. Inbound access (SSH, exec, published ports) is not affected. A fork starts with its source's policy. Domains are allowed through DNS: the sandbox's… */
export type InstaboxNetworkPolicyInput = {
	/** Address ranges the sandbox may connect to, IPv4 or IPv6, such as `140.82.112.0/20`; one address is that address alone. A range with bits set beyond its length, the whole address space, and private, local and reserved ranges (which no sandbox reaches) are refused. */
	allowCidrs?: Array<string>;
	/** Names the sandbox may resolve and then connect to, over any protocol. `github.com` is that name only; `*.github.com` is every name under it and not `github.com` itself. Lower case, no scheme, port or path. */
	allowDomains?: Array<string>;
	/** `restricted`: the sandbox connects only to what `allowCidrs` and `allowDomains` name; with both empty, to nothing. `open`: no policy; only a request sends it, to remove a policy, and it takes no lists. */
	outbound: 'restricted' | 'open';
};

/** Wait in the GPU queue, or for a macOS sandbox in the Mac queue (`CreateMachineRequest.queue`, `StartMachineRequest.queue`); `{}` waits up to an hour for a GPU, up to 7 days for a Mac. */
export type InstaboxQueueRequestInput = {
	/** A macOS sandbox only. Start the sandbox as soon as a Mac is reserved for it, which starts the Mac's 24-hour lease and its billing. Absent or false, the member who made the request is emailed and the Mac is kept until `MachineQueue.offerExpiresAt` for a start of the sandbox to take it. */
	autoLease?: boolean;
	/** How long to wait. For a GPU, 60-86400 seconds (absent or 0, 3600); for a Mac, 60-604800 (absent or 0, 604800); another value is `400 bad_request`. Past it a waiting request expires; one that already has its GPU, or its Mac reserved, goes on. */
	maxWaitSeconds?: number;
};

/** Proxy supplies an opaque sandbox-specific placeholder for substitution in ordinary HTTPS headers on allowed hosts (port 443). Env supplies the real value, including credentials needed by native database clients. Unsupported traffic never falls back from proxy to env. */
export type InstaboxSecretDeliveryInput = 'proxy' | 'env';

/** Exact ASCII DNS hostnames, normalized to lowercase without a trailing dot, or a standalone `*` for every public HTTPS destination. Required for proxy delivery: omitted or empty is 400. No scheme, port, path, partial wildcard, IP literal, or local hostname. Destination checks also reject private… */
export type InstaboxSecretHostsInput = Array<string>;

/** A unique environment variable name within an org. The names a sandbox's env reserves are reserved (shell variables such as PATH, HOME, BASH_ENV, ENV and IFS, session and trust-store variables, and INSTABOX_ and SSH_ prefixes). A Secret saved under a name before it was reserved is not delivered:… */
export type InstaboxSecretNameInput = string;

/** Proxy selection only. All includes current and future proxy Secrets in the sandbox's org. Explicit names resolve to stable IDs. An empty array selects none. Deleting and recreating a name does not restore an explicit grant. Null is rejected. */
export type InstaboxSecretSelectionInput =
	| 'all'
	| Array<InstaboxSecretNameInput>;

/** UTF-8 text without NUL, at most 65536 bytes. Empty values are valid. Proxy values must also be valid HTTP header values without CR or LF. */
export type InstaboxSecretValueInput = string;

export type InstaboxWebhookEventTypeInput =
	| 'sandbox.created'
	| 'sandbox.started'
	| 'sandbox.stopped'
	| 'sandbox.suspended'
	| 'sandbox.error'
	| 'sandbox.deleted'
	| 'snapshot.created'
	| 'snapshot.failed'
	| 'snapshot.deleted';

export type InstaboxAPIKey = {
	createdAt?: string | null;
	/** The key's maker. */
	createdBy?: number | null;
	/** The maker's login. */
	createdByLogin?: string | null;
	expiresAt?: string | null;
	/** `key_...` a personal org's, `wkey_...` a workspace's. */
	id?: string | null;
	/** Updated at most once a minute. */
	lastUsedAt?: string | null;
	name?: string | null;
	/** The key's org. */
	orgId?: string | null;
	/** First 8 characters after `ibk_`, for recognizing the key. */
	prefix?: string | null;
	/** `APIKeyScope`s, or a workspace key's `workspace:admin`. */
	scopes?: Array<string> | null;
};

export type InstaboxAPIKeyList = {
	keys?: Array<InstaboxAPIKey> | null;
};

export type InstaboxActivityLease = {
	expiresAt?: string | null;
	id?: string | null;
	machineId?: string | null;
};

export type InstaboxCheckoutResponse = {
	/** The org; absent when the Checkout buys a new workspace. */
	org?: InstaboxOrg | null;
	/** The Stripe Checkout URL to send the user to; empty when the org is on the plan already (its credits covered the rest of the month, or the card on file paid). */
	url?: string | null;
};

export type InstaboxConnection = {
	/** User certificate in authorized_keys format. */
	certificate?: string | null;
	expiresAt?: string | null;
	host?: string | null;
	hostTrust?: InstaboxHostTrust | null;
	/** Connection ID (`cn_…`), also the certificate key ID. */
	id?: string | null;
	machineId?: string | null;
	port?: number | null;
	transport?: string | null;
	username?: string | null;
};

export type InstaboxConnectionInfo = {
	/** `mosh`: mosh works (a session that runs `mosh-server new` gets a relay UDP port in its `MOSH CONNECT` line). */
	capabilities?: Array<string> | null;
	host?: string | null;
	hostTrust?: InstaboxHostTrust | null;
	machineId?: string | null;
	/** Optional separate Mosh gateway host; defaults to host when absent. */
	moshHost?: string | null;
	/** SSH port for Mosh session bootstrap; defaults to port when absent. The UDP relay port is negotiated during bootstrap. */
	moshPort?: number | null;
	port?: number | null;
	transport?: string | null;
	/** The sandbox ID. */
	username?: string | null;
};

export type InstaboxCreatedAPIKey = {
	apiKey?: InstaboxAPIKey | null;
	/** The secret, shown only in this reply and to polls repeated within the 10-minute delivery window. */
	key?: string | null;
};

export type InstaboxDesktop = {
	/** The computer-use MCP's last tool calls (at most 20, oldest first), as its proxy logged them. */
	actions?: Array<InstaboxDesktopAction> | null;
	/** The sandbox's computer-use MCP honors the control (its wrapper runs the server through the proxy). False on a sandbox made before the proxy existed: a takeover would not pause its agent, so clients should offer watching only. */
	agentPausable?: boolean | null;
	/** The control file in the sandbox could not be written (its runtime directory is missing or not writable): takeover and handback cannot take effect. The reason, from the sandbox. */
	controlError?: string | null;
	/** Who drives the desktop: `agent` (the default; viewers watch) or `human` (a viewer took over, and the computer-use MCP refuses input until they hand back or 30 s pass without a call from them). */
	controller?: string | null;
	/** The last install failed; log holds its last lines. */
	failed?: boolean | null;
	/** Only on a `start` that started nothing because the desktop is not installed (`start` never installs), is still installing, or failed to install: what to send next. Absent otherwise. */
	hint?: string | null;
	installed?: boolean | null;
	installing?: boolean | null;
	/** The desktop the sandbox has. `vm` (a Windows or Mac sandbox): its VM's own screen, always running and controlled by every viewer (`controller` `human`, `yours`); `install`, `start`, `takeover` and `handback` change nothing. `x11` (absent from servers before this field): Xvnc and Xfce, installed… */
	kind?: string | null;
	log?: string | null;
	/** Only on `kind` `vm`: the guest OS. Clients map keys by it: on `macos`, a Mac's Command is the guest's Command (keysym Alt_L) and Option its Option (Meta_L). */
	os?: string | null;
	/** The VNC server answers: GET /v1/machines/{id}/vnc connects. */
	running?: boolean | null;
	/** The caller (its sign-in session or API key) is the viewer in control. Absent when false. */
	yours?: boolean | null;
};

export type InstaboxDesktopAction = {
	/** Its arguments, strings shortened to 80 characters. */
	args?: Record<string, InstaboxJsonValue> | null;
	/** Refused because a human controlled the desktop; it never reached the tool. */
	refused?: boolean | null;
	time?: string | null;
	/** The MCP tool called (click, type_text, get_app_state, ...). */
	tool?: string | null;
};

export type InstaboxDesktopStream = {
	expiresAt?: string | null;
	/** The dashboard's full-screen viewer, `<dashboard>/desktop/{id}#token=...`; open it or embed it in an iframe. */
	url?: string | null;
};

/** A reference to a direct (delivery env) Secret: its real value as the variable `env` (exported by login shells), as a file at `file` (home-relative; the value stays on tmpfs at /run/instabox/secrets/files and the home path is a symlink to it), or both. Names and paths only; values are never returned. */
export type InstaboxDirectSecret = {
	/** Not reserved (PATH, HOME, BASH_ENV, IFS, CA variables, ...) and no INSTABOX_ or SSH_ prefix. */
	env?: string | null;
	/** Clean path relative to the home directory, without .. components. */
	file?: string | null;
	secret?: InstaboxSecretName | null;
};

export type InstaboxDiscordLink = {
	/** The Discord user ID. */
	discordId?: string | null;
	linkedAt?: string | null;
	/** The Discord username when it was linked. */
	username?: string | null;
};

export type InstaboxDiscordStatus = {
	/** This server links Discord accounts. */
	configured?: boolean | null;
	/** The linked Discord account; null when none is linked. */
	link?: InstaboxDiscordLink | null;
};

export type InstaboxDiskWarning = {
	level?: string | null;
	/** What is full and how to free or add space (delete files, `instabox resize <box> --disk N` for /data: a running sandbox's disk grows live). */
	message?: string | null;
	/** The fullest filesystem (empty when it could not be read after a command ran out of space). */
	mount?: string | null;
	/** The command failed with No space left on device (or Disk quota exceeded). */
	noSpace?: boolean | null;
	usedPct?: number | null;
};

export type InstaboxError = {
	/** When it happened, for a stop the platform found (a sandbox's `lastError` with code `host_oom`, `vmm_crashed` or `guest_reboot_loop`; `hint` says what to do). The next successful start clears the error. Absent otherwise and from older servers. */
	at?: string | null;
	/** Machine-readable code. HTTP status per code is fixed. */
	code?: string | null;
	/** A URL documenting the error (credential errors). Absent otherwise. */
	docs?: string | null;
	/** The code's entry on the errors page, on every error response: https://instabox.sh/docs/errors#<code> with underscores as dashes (e.g. #credit-exhausted): its HTTP status, whether to retry and what to do. Snake case, unlike the other fields. Absent from a failed operation's `error` and from older… */
	docs_url?: string | null;
	/** The next step that fixes the error (credential errors, a start quota's refusal). Absent otherwise. */
	hint?: string | null;
	message?: string | null;
	/** For `operation_conflict`, the active operation. */
	operationId?: string | null;
	/** The same as `code` for credential errors (401 `missing_key`, `malformed_key`, `invalid_key`, `expired_key`, `revoked_key`, `session_expired`; 403 `missing_scope`). For 409 `machine_cooldown`, the automatic abuse check whose pause locks the sandbox: `abuse_egress_blocklist` (it tried to connect… */
	reason?: string | null;
	requestId?: string | null;
	/** For `missing_scope`, the scopes the route accepts; the key needs one of them. */
	requiredScopes?: Array<string> | null;
	/** Seconds to wait before trying again: a retryable `no_capacity` (60, as a 503 or on a failed operation's `error`), `rate_limited`, `machine_cooldown` and agent sign-up `quota_exceeded`. An error response also sends it as the `Retry-After` header; a failed operation's `error` has only this field.… */
	retryAfterSeconds?: number | null;
	/** True if the same request may succeed later. */
	retryable?: boolean | null;
};

export type InstaboxExecHistory = {
	/** Newest first. */
	commands?: Array<InstaboxExecHistoryEntry> | null;
	/** The `cursor` of the next (older) page; absent on the last page. */
	nextCursor?: string | null;
};

/** One command of a sandbox's history: an exec request that reached the sandbox, whoever sent it, as the server recorded it. `stdout` and `stderr` are set only by `GET /v1/machines/{id}/history/{execId}`. */
export type InstaboxExecHistoryEntry = {
	/** The request's `cmd`, its `argv` quoted for a shell, or its `historyCommand`; cut at 4096 bytes. */
	command?: string | null;
	/** The request's `cwd` (absent: HOME). */
	cwd?: string | null;
	durationMs?: number | null;
	endedAt?: string | null;
	/** The `ExecResult`'s exit code; -1 for `lost`, `cancelled` and `unreachable`. */
	exitCode?: number | null;
	/** Command ID (`ex_…`). */
	id?: string | null;
	machineId?: string | null;
	/** The stored output is cut: the history keeps the first 64 KiB of each stream. */
	outputTruncated?: boolean | null;
	/** The signal that killed the command, as the sandbox named it (absent otherwise). */
	signal?: string | null;
	startedAt?: string | null;
	/** How the command ended: `exited` (exit code reported; `signal` set if a signal killed it), `timed_out` (killed after `timeoutSeconds`), `lost` (the connection to the sandbox ended before the exit status; it may have run), `cancelled` (the client closed the request; the command was killed) or… */
	status?: string | null;
	/** The stored stderr (`GET /v1/machines/{id}/history/{execId}` only). */
	stderr?: string | null;
	/** Size of the stored stderr. */
	stderrBytes?: number | null;
	/** The stored stdout (`GET /v1/machines/{id}/history/{execId}` only). */
	stdout?: string | null;
	/** Size of the stored stdout. */
	stdoutBytes?: number | null;
	/** The client streamed the output (`Accept: text/event-stream`). */
	streamed?: boolean | null;
	timedOut?: boolean | null;
	/** The exec's result had its output cut at 1 MiB per stream (never for a streamed exec). */
	truncated?: boolean | null;
	/** The account that ran it. */
	userId?: number | null;
};

export type InstaboxExecResult = {
	/** Set when the command failed with No space left on device (read again right after it), or a filesystem was at least 90% full when last read (read in the background after an exec or metrics call, at most once a minute). */
	diskWarning?: InstaboxDiskWarning | null;
	/** Exit status; 128+N if killed by standard signal N, otherwise 255 with `signal` set; 124 if timed out. */
	exitCode?: number | null;
	/** stdout or stderr had bytes that are not UTF-8 (binary output), replaced with U+FFFD, so the output is not what the command wrote. Absent when false; also set on a streamed exec's exit event. */
	invalidUtf8?: boolean | null;
	/** The OOM kill behind `oomKilled` (the newest, when several). */
	oomKill?: InstaboxOOMKill | null;
	/** The command exited non-zero and the sandbox's kernel OOM killer killed one of its own processes (the command or a child: its SSH session's cgroup; never another command's process, and each kill is reported once). `oomKill` says which, when the sandbox named it. Checked only for exit code 137, a… */
	oomKilled?: boolean | null;
	/** The signal that killed the command, as the sandbox named it (absent otherwise). */
	signal?: string | null;
	/** First 1 MiB of standard error. */
	stderr?: string | null;
	/** First 1 MiB of standard output. */
	stdout?: string | null;
	/** The command ran past `timeoutSeconds` and was killed. */
	timedOut?: boolean | null;
	/** stdout or stderr was longer than 1 MiB and was cut. */
	truncated?: boolean | null;
};

/** A `.tar.gz` of a sandbox's or a snapshot's `/data` disk (home and workspace), built from the disk's saved copy while its workspace is paused or disabled. Exactly one of `machineId` and `snapshotId` is set. */
export type InstaboxExport = {
	/** The archive's size, once ready. */
	bytes?: number | null;
	createdAt?: string | null;
	error?: string | null;
	/** When a ready archive is deleted, 7 days after it was built and never after the workspace's data. */
	expiresAt?: string | null;
	/** The archive's download name: `<name>-data-<date>.tar.gz`. */
	fileName?: string | null;
	/** `exp_...` */
	id?: string | null;
	machineId?: string | null;
	/** The sandbox's or snapshot's name when the export was asked for. */
	name?: string | null;
	orgId?: string | null;
	readyAt?: string | null;
	requestedBy?: number | null;
	/** When the disk was saved: the sandbox's last stop or pause, or the snapshot. */
	savedAt?: string | null;
	/** The archive's SHA-256 (hex), once ready; also its download ETag. */
	sha256?: string | null;
	snapshotId?: string | null;
	/** `ready`: download it. `failed`: `error` says why; ask again. `expired`: deleted; ask again while the workspace is paused or disabled. */
	status?: string | null;
};

export type InstaboxExportList = {
	/** True while the workspace is paused for a failed payment or disabled: exports can be asked for. */
	exportable?: boolean | null;
	/** When the workspace's sandboxes and snapshots are deleted. */
	purgeAt?: string | null;
	/** The sandboxes and snapshots the caller may export, each with its newest export that has not expired. */
	sources?: Array<InstaboxExportSource> | null;
};

export type InstaboxExportSource = {
	/** The size of its `/data` disk. */
	dataSizeBytes?: number | null;
	export?: InstaboxExport | null;
	/** True when it can be exported now: its workspace can (the list's `exportable`), or, for a sandbox, an abuse check locked it. Absent when false. */
	exportable?: boolean | null;
	id?: string | null;
	kind?: string | null;
	name?: string | null;
};

export type InstaboxFeedbackResult = {
	id?: string | null;
	status?: string | null;
	ticket?: {
		id?: string | null;
		/** The ticket in the dashboard. */
		url?: string | null;
	} | null;
};

export type InstaboxFileEntry = {
	modTime?: string | null;
	mode?: string | null;
	name?: string | null;
	/** Bytes; 0 for a directory. */
	size?: number | null;
	/** A symbolic link's target, as stored. */
	target?: string | null;
	type?: string | null;
};

export type InstaboxFileWritten = {
	/** The file is new (201); false when it replaced one (200). */
	created?: boolean | null;
	/** Octal permissions, for example 0644. */
	mode?: string | null;
	/** The file written, with symbolic links resolved. */
	path?: string | null;
	/** Hex SHA-256 of the bytes the server received and wrote. */
	sha256?: string | null;
	/** Bytes written. */
	size?: number | null;
};

export type InstaboxFiles = {
	/** The file is not UTF-8 text; content is empty. */
	binary?: boolean | null;
	/** A text file's content (UTF-8). */
	content?: string | null;
	/** A directory's entries, directories first, then by name. */
	entries?: Array<InstaboxFileEntry> | null;
	modTime?: string | null;
	/** As ls -l, for example drwxr-xr-x. */
	mode?: string | null;
	/** The path read, with symbolic links resolved. */
	path?: string | null;
	/** Bytes; 0 for a directory. */
	size?: number | null;
	/** The directory has more entries, or the file more bytes, than returned. */
	truncated?: boolean | null;
	type?: string | null;
};

/** One entry of `GET /v1/gpu-queue`. */
export type InstaboxGPUQueueEntry = {
	/** As in `MachineQueue`. */
	cancelling?: boolean | null;
	enqueuedAt?: string | null;
	expiresAt?: string | null;
	gpuType?: string | null;
	gpus?: number | null;
	id?: string | null;
	/** As in `MachineQueue`. */
	kind?: string | null;
	machineId?: string | null;
	/** The sandbox's name; absent once it is deleted. */
	machineName?: string | null;
	orgId?: string | null;
	/** As in `MachineQueue`; absent unless queued. */
	position?: number | null;
	/** Why an ended entry ended: `queue_expired`; `user` (a cancel or a stop) or `machine_deleted` for a cancel; for `failed`, the refusal's error code. */
	reason?: string | null;
	/** When the entry ended; absent while live. */
	resolvedAt?: string | null;
	/** `queued` and `dispatched` are live; `placed` (the sandbox ran), `expired`, `cancelled` and `failed` are ends. */
	state?: string | null;
};

export type InstaboxGPUQueueList = {
	entries?: Array<InstaboxGPUQueueEntry> | null;
	/** Pass as `cursor` for the next page; absent on the last page. */
	nextCursor?: string | null;
};

export type InstaboxGitHubInstallation = {
	/** The GitHub user or organization login the App is installed on. */
	account?: string | null;
	createdAt?: string | null;
	/** GitHub's installation ID. */
	id?: number | null;
	orgId?: string | null;
	/** Suspended on GitHub; its jobs start no boxes. */
	suspended?: boolean | null;
};

export type InstaboxGitHubInstallationList = {
	installations?: Array<InstaboxGitHubInstallation> | null;
};

export type InstaboxGitHubJob = {
	/** The GitHub login that triggered its run; left out for a job recorded before it was. */
	actor?: string | null;
	/** Its run's head branch; left out for a job recorded before it was. */
	branch?: string | null;
	/** Its run's head commit SHA; left out for a job recorded before it was. */
	commit?: string | null;
	completedAt?: string | null;
	/** How instabox learned the job completed: webhook (GitHub's completed event), runner_gone (GitHub removed its runner and answered the job ended), runner_gone_timeout (GitHub removed its runner but still had the job running after instabox waited 5 minutes; the box was deleted anyway), github_api… */
	completionSource?: string | null;
	/** GitHub's conclusion once completed: success, failure, cancelled... */
	conclusion?: string | null;
	/** When GitHub queued it. */
	createdAt?: string | null;
	/** The GitHub workflow job ID. */
	id?: number | null;
	job?: string | null;
	/** The job's runs-on labels. */
	labels?: Array<string> | null;
	/** The CI box the job holds: its own, or one handed to it while it waited. Omitted once it ran on another runner than that box's (ranOn). */
	machineId?: string | null;
	/** The runner GitHub ran the job on. */
	ranOn?: string | null;
	/** When instabox first had a runner ready for the job (its CI box's runner registered and started, or the pool runner that ran it; never before createdAt). Splits the wait: box ready (instabox's) up to it, pickup (GitHub's) from it to startedAt. Left out when not known: a job recorded before it… */
	readyAt?: string | null;
	/** Why the job waits, was refused or failed. */
	reason?: string | null;
	/** owner/name */
	repo?: string | null;
	/** The size label among them. */
	size?: string | null;
	/** The snapshot (name or ID, lower-case) its `SIZE-snapshot-<snapshot>` label (e.g. `instabox-medium-snapshot-acme-warm`) starts its box from instead of the stock `ci` template: a ready snapshot of a `ci` machine in the org the App install is linked to, else the job is refused, as is one of a… */
	snapshot?: string | null;
	/** When a runner took it; the wait is from createdAt. */
	startedAt?: string | null;
	state?: string | null;
	workflow?: string | null;
};

export type InstaboxGitHubJobBucket = {
	failed?: number | null;
	other?: number | null;
	passed?: number | null;
	/** When the step starts. */
	start?: string | null;
};

/** The org's jobs in each state group that `state` takes. */
export type InstaboxGitHubJobCounts = {
	all?: number | null;
	/** `completed` with conclusion `failure` or `timed_out`, `refused` or `failed`. */
	failed?: number | null;
	/** `starting` or `started`. */
	running?: number | null;
	/** `completed` with conclusion `success`. */
	succeeded?: number | null;
	waiting?: number | null;
};

export type InstaboxGitHubJobDay = {
	date?: string | null;
	/** Ran to its end on a CI box with conclusion `failure` or `timed_out`. */
	failed?: number | null;
	/** Did not run (refused, failed to start, cancelled first), ended otherwise (`cancelled`, `skipped`) or not done yet. */
	other?: number | null;
	passed?: number | null;
};

export type InstaboxGitHubJobDetail = {
	/** When its own CI box was created. Absent: no box yet, or GitHub ran the job on another job's box. */
	boxCreatedAt?: string | null;
	/** When that box first ran. */
	boxRunningAt?: string | null;
	/** Its run's branch, from GitHub. */
	branch?: string | null;
	/** Its run's commit SHA, from GitHub. */
	commit?: string | null;
	/** The first step that failed, from GitHub. */
	failedStep?: string | null;
	job?: InstaboxGitHubJob | null;
	memMiB?: number | null;
	/** The machine of its size. */
	vcpus?: number | null;
};

export type InstaboxGitHubJobList = {
	counts?: InstaboxGitHubJobCounts | null;
	/** More jobs of the state group asked for follow this page (next: offset + limit). */
	hasMore?: boolean | null;
	/** Where an owner or admin installs the App and links it to the org, in a browser signed in to instabox. */
	installUrl?: string | null;
	jobs?: Array<InstaboxGitHubJob> | null;
	/** An install of the GitHub App is linked to the org. */
	linked?: boolean | null;
	setup?: InstaboxGitHubJobSetup | null;
	/** Installs unlinked from the org when the member who linked them left it; their jobs start nothing until an owner or admin links them again. */
	unlinked?: Array<InstaboxGitHubUnlinkedInstallation> | null;
};

/** Seconds from a runner taking the job to its end. Absent when no job ended. */
export type InstaboxGitHubJobRun = {
	p50?: number | null;
	p90?: number | null;
};

/** What the CI page's setup steps count: only the jobs of the installs linked to the org now. An App uninstalled and installed again is a new install, so the setup starts over while the old jobs stay listed and in `counts`. */
export type InstaboxGitHubJobSetup = {
	/** A job came in. */
	queued?: boolean | null;
	/** A job ran to its end on a CI box, whatever its conclusion. */
	ran?: boolean | null;
	/** `starting` or `started`. */
	running?: number | null;
	waiting?: number | null;
};

export type InstaboxGitHubJobStats = {
	/** With step: every step from from, oldest first. */
	buckets?: Array<InstaboxGitHubJobBucket> | null;
	/** Each size with jobs, small to large. */
	bySize?: Array<InstaboxGitHubSizeWait> | null;
	/** How many days, today included. */
	days?: number | null;
	/** Jobs queued. */
	jobs?: number | null;
	/** Of those, jobs with conclusion `success`. */
	passed?: number | null;
	/** Every day, oldest first. */
	perDay?: Array<InstaboxGitHubJobDay> | null;
	/** Jobs that ran to their end on a CI box, whatever their conclusion. */
	ran?: number | null;
	run?: InstaboxGitHubJobRun | null;
	/** The step asked for, in seconds. */
	step?: number | null;
	wait?: InstaboxGitHubJobWait | null;
};

/** Seconds from queued to a runner taking the job. Absent when no job was taken. */
export type InstaboxGitHubJobWait = {
	/** Median until the box ran. */
	boot?: number | null;
	/** Median until GitHub gave the box's runner the job. */
	handover?: number | null;
	p50?: number | null;
	p90?: number | null;
	/** Pickup: from a runner ready to the runner taking the job (GitHub's part), over the same jobs. */
	pickup?: InstaboxGitHubJobWaitPart | null;
	/** Box ready: from queued to a runner ready for the job (instabox's part), over the jobs with a readyAt. */
	ready?: InstaboxGitHubJobWaitPart | null;
	/** Median until the CI box was created (plan limits, capacity), over jobs that ran on their own box. */
	slot?: number | null;
};

/** A part of the wait in seconds. Absent when no job of the range has a readyAt. */
export type InstaboxGitHubJobWaitPart = {
	p50?: number | null;
	p90?: number | null;
};

export type InstaboxGitHubSizeWait = {
	jobs?: number | null;
	/** Seconds; absent when none of its jobs was taken. */
	p50?: number | null;
	p90?: number | null;
	size?: string | null;
};

export type InstaboxGitHubUnlinkedInstallation = {
	/** The GitHub user or organization login the App is installed on. */
	account?: string | null;
	/** GitHub's installation ID. */
	id?: number | null;
	/** Why it was unlinked, e.g. `unlinked when alice left the workspace`. */
	reason?: string | null;
	unlinkedAt?: string | null;
};

export type InstaboxHostTrust = {
	principals?: Array<string> | null;
	/** SSH host certificate authority's public key, in authorized_keys format. */
	publicKey?: string | null;
	type?: string | null;
};

/** Explicit original-owner recovery of a retained legacy item. Save privately; contains a real value. */
export type InstaboxLegacyVaultExport = {
	item?: InstaboxVaultItem | null;
	value?: string | null;
};

/** A sandbox. */
export type InstaboxMachine = {
	/** With cooldownReason: what the owner is told about the pause behind the lock. Absent when cooldownReason is. */
	abuseLock?: InstaboxMachineAbuseLock | null;
	/** When the sandbox is stopped if it is running (set at creation with `archiveSeconds`): its files are kept and a start brings it back. Resuming does not clear it; a sandbox that is not running when it passes only has it cleared. Absent: none. */
	archiveAt?: string | null;
	/** The running sandbox is paused once it has been idle this many seconds (no agent working, no terminal input or output, little CPU); null: off. Pause, resume, stop and start keep it. */
	autoSuspendAfterSeconds?: number | null;
	/** When the sandbox was queued to pause automatically; a successful automatic resume or its next explicit operation clears it. Absent: none. */
	autoSuspendedAt?: string | null;
	/** While cooldownUntil has not passed, the automatic abuse check whose pause locks the sandbox, the same as a wake's 409 `machine_cooldown` Error.reason: `abuse_egress_blocklist` (it tried to connect to a blocked destination on the egress blocklist, not a DNS lookup), `abuse_network_flows`… */
	cooldownReason?: string | null;
	/** All wake paths are refused until this deadline, including admin actions: after a max-run suspension, or the 24-hour lock of an automatic abuse check's pause (cooldownReason). */
	cooldownUntil?: string | null;
	createdAt?: string | null;
	/** The OAuth app that created the sandbox, with a token of a person's grant (docs/oauth-apps.md). Absent: a person or a key did. */
	createdByApp?: InstaboxOAuthAppRef | null;
	/** When the sandbox is deleted, whatever its state (set at creation with `deleteAfterSeconds`). The delete is an ordinary `delete` operation (`trigger: delete_at`), queued at `deleteAt` (within about a second) once no other operation is in progress. Absent: never. */
	deleteAt?: string | null;
	desiredState?: InstaboxMachineState | null;
	/** Set on a stopped or paused free sandbox that cannot be started because its org's early free-sandbox allowance ended and as many free sandboxes as the standard limit allows are running: a start is refused (`402 early_allowance_ended`) until one is paused or deleted. Absent otherwise. */
	earlyAllowanceEnded?: boolean | null;
	/** The names of the sandbox's create-time `env`, sorted. Absent when it has none. The values are never shown: read them in the sandbox. */
	envNames?: Array<string> | null;
	/** A free-tier org's sandbox (docs/pricing.md): never billed, pauses after 30 idle minutes (another `autoSuspendAfterSeconds` is refused with 403). On a paid plan every sandbox is billed. */
	free?: boolean | null;
	/** The Linux user in the sandbox that SSH sessions, exec and the terminal log in as, fixed at create: the `guestUser` the create named, else `user` (a create from a snapshot: the snapshot's user). `dev` on sandboxes from templates without the `guest-user` capability, and on every sandbox created… */
	guestUser?: string | null;
	id?: string | null;
	/** Deprecated: `snapshot`, under its old name (same value). */
	image?: InstaboxSnapshotRef | null;
	lastError?: InstaboxError | null;
	/** The newest OOM kill (absent until one is seen, or when the kernel log no longer held it). */
	lastOom?: InstaboxOOMKill | null;
	/** The Mac lease a macOS sandbox runs under. Absent on every other sandbox, and while a macOS sandbox runs under none (stopped after its lease ended). */
	lease?: InstaboxMachineLease | null;
	maxRunMinutes?: InstaboxMaxRunMinutes | null;
	metadata?: InstaboxMetadata | null;
	name?: string | null;
	/** The sandbox's outbound network policy. Absent when it has none. */
	networkPolicy?: InstaboxNetworkPolicy | null;
	/** Processes the sandbox's kernel OOM killer killed since the sandbox was created (out of memory, or a memory cgroup's limit). Read from the sandbox about once a minute while it runs, and after an exec that exits non-zero; 0 on sandboxes whose host or guest agent predates the reading (absent from… */
	oomKills?: number | null;
	/** The active operation, if any. */
	operationId?: string | null;
	/** The org the sandbox counts against (docs/orgs.md). */
	orgId?: string | null;
	/** The sandbox's live GPU queue entry: a create or start with `queue` found no GPU of its type free, so the sandbox waits, `stopped` and holding no GPU, for one. Absent otherwise; once the sandbox is placed it is `running` with no `queue`. A macOS sandbox waiting for a Mac has one too, with `pool`. */
	queue?: InstaboxMachineQueue | null;
	/** When the running sandbox last became ready (`runtime.ready` turned true: SSH, exec and files work). For a new sandbox, `readyAt` minus `createdAt` is its create time; after a start or resume it is that start's. Absent while the sandbox is not ready, and on a sandbox that was already ready before… */
	readyAt?: string | null;
	/** Increases with each accepted change. */
	revision?: number | null;
	/** Start of the current continuous run, conservatively initialized on a first error observation too; resets only after confirmed sleep. */
	runStartedAt?: string | null;
	runtime?: InstaboxRuntime | null;
	snapshot?: InstaboxSnapshotRef | null;
	spec?: InstaboxMachineSpec | null;
	state?: InstaboxMachineState | null;
	storage?: InstaboxStorage | null;
	/** false: the sandbox cannot be paused, since its hosts keep no memory of a running sandbox (macOS). Stop the sandbox instead; its files are kept. Absent: it can. */
	suspendable?: boolean | null;
	template?: InstaboxTemplateRef | null;
	updatedAt?: string | null;
	/** Whether legacy Vault delivery is enabled. Independent of org Secret selections and delivery status at the sandbox's /secrets endpoint. */
	vault?: boolean | null;
};

/** The owner's account of the abuse check's pause behind a sandbox's cooldownReason: when, what the sandbox did in a sentence (explanation) and in detail (what, with the exact address of a blocked destination, the address and port of a brute force, the swept port or scanned host and the count of a… */
export type InstaboxMachineAbuseLock = {
	/** How to contest the pause. */
	appeal?: string | null;
	/** When the sandbox was paused. */
	at?: string | null;
	/** The CPU check's mean share of the sandbox's vCPUs. */
	coreShare?: number | null;
	/** A network-flows finding's destinations, ports or connections. */
	count?: number | null;
	/** The blocked destination, the brute-forced or scanned address. */
	dst?: string | null;
	/** One plain sentence on what the sandbox did ("was reaching known abuse addresses ..."). */
	explanation?: string | null;
	/** A network-flows finding's kind: sweep, scan, brute or fanout. */
	kind?: string | null;
	/** That program's pool. */
	pool?: string | null;
	/** A brute force's destination port, or the swept port. A blocked destination's port is not recorded (the node keeps the address alone). */
	port?: number | null;
	/** The mining program the CPU check found running, when it confirmed one. */
	process?: string | null;
	/** The finding with its exact address and counts ("connected to blocked 47.91.89.3", "30 connections to 198.51.100.7:22 (brute force)", "swept port 22 across 500 destinations"). */
	what?: string | null;
};

export type InstaboxMachineDisk = {
	/** `/data`, then `/` (`/` alone where `/data` is not a filesystem of its own). */
	filesystems?: Array<InstaboxMachineFilesystem> | null;
	measuredAt?: string | null;
	/** Set when a filesystem is at least 90% full (bytes or inodes). */
	warning?: InstaboxDiskWarning | null;
};

export type InstaboxMachineFilesystem = {
	/** What the sandbox's user can still write. */
	availableBytes?: number | null;
	/** Inodes used, 0-100 (many small files). */
	inodesUsedPct?: number | null;
	/** `ok` below 80%, `high` from 80%, `critical` from 90%, `full` at 100% (bytes or inodes). */
	level?: string | null;
	/** `/data` (the disk) or `/` (the root filesystem). */
	mount?: string | null;
	sizeBytes?: number | null;
	usedBytes?: number | null;
	/** Used over used + available, 0-100 (df's Use%): writes fail with ENOSPC at 100. */
	usedPct?: number | null;
};

/** The Mac lease a macOS sandbox runs under (`Machine.lease`). */
export type InstaboxMachineLease = {
	/** Until when the lease is billed at least: the end of its minimum. */
	chargeUntil?: string | null;
	/** The lease's price per Mac-hour, all in. */
	hourUSD?: number | null;
	id?: number | null;
	/** Since when the Mac is leased to the org. */
	startedAt?: string | null;
};

export type InstaboxMachineList = {
	machines?: Array<InstaboxMachine> | null;
	/** Pass as `cursor` for the next page; null on the last page. */
	nextCursor?: string | null;
};

export type InstaboxMachineLogs = {
	/** Console output: the last `tail` lines, or with `after`, the output written since that cursor. Empty when there is none or with `consoleUnavailable`. */
	console?: string | null;
	/** `after` was past the end of the log because it was rotated and the kept previous 8 MiB no longer reach back to the cursor, so `console` starts again at the beginning of the current log and output in between is missing. A rotation the kept copy covers carries on without it. Absent when false. */
	consoleReset?: boolean | null;
	/** There is older console output than `console`: the log goes back further than `tail` lines, or than the bytes read for them (256 per line, at least 64 KiB, at most 1 MiB), so long lines give fewer than `tail`. Absent when false and with `after`. */
	consoleTruncated?: boolean | null;
	/** Why there is no console output, e.g. the sandbox's disks are in storage or its host is not answering. Absent when the console was read. */
	consoleUnavailable?: string | null;
	/** Where `console` ends; pass it as `after` to read only newer output. */
	cursor?: number | null;
	machineId?: string | null;
	/** The last 20 operations, oldest first. */
	operations?: Array<InstaboxOperation> | null;
	/** The sandbox's state, as on Machine. */
	state?: string | null;
};

/** One sample, measured on the host. Bytes throughout. */
export type InstaboxMachineMetric = {
	/** vCPUs. */
	cpuCount?: number | null;
	/** CPU time used over the sandbox's vCPUs, 0-100. */
	cpuUsedPct?: number | null;
	/** Storage reads, bytes per second over 90 s. Absent where the host does not report them yet. */
	diskReadBytesPerSec?: number | null;
	/** Disk (`/data`) size; the root filesystem is not counted. */
	diskTotal?: number | null;
	/** `/data`'s used bytes, on the latest sample of a running sandbox only (read inside it: the last read, refreshed in the background at most once a minute and at most 10 minutes old); absent otherwise. `disk` on the response has both filesystems. */
	diskUsed?: number | null;
	/** Storage writes, bytes per second over 90 s. Absent where the host does not report them yet. */
	diskWriteBytesPerSec?: number | null;
	/** GPU sandboxes only: the sandbox's GPUs. */
	gpuCount?: number | null;
	/** GPU sandboxes only: its GPU type's memory times gpuCount, bytes. */
	gpuMemTotal?: number | null;
	/** GPU sandboxes only: GPU memory in use, bytes, summed over the sandbox's GPUs. Absent where the host did not read it. */
	gpuMemUsed?: number | null;
	/** GPU sandboxes only: the share of the time a kernel ran on the sandbox's GPUs, averaged over them (0-100). Absent where the host did not read it. */
	gpuUsedPct?: number | null;
	/** Memory size. */
	memTotal?: number | null;
	/** Memory in use inside the sandbox: its size less what the guest reports as available, so page cache is not counted. A sandbox that does not report it shows the guest memory it has touched. */
	memUsed?: number | null;
	/** Network traffic to the sandbox, bytes per second over 90 s. Leaves out SSH and public port traffic. Absent where the host does not report it yet. */
	netInBytesPerSec?: number | null;
	/** Network traffic from the sandbox (egress), bytes per second over 90 s. Leaves out SSH and public port traffic. Absent where the host does not report it yet. */
	netOutBytesPerSec?: number | null;
	timestamp?: string | null;
};

export type InstaboxMachineMetrics = {
	/** The running sandbox's filesystem use, read inside it (the last read, refreshed in the background at most once a minute and at most 10 minutes old; the route never reads it itself, so the first call after a while may not have it); absent while it is not running or not read yet. */
	disk?: InstaboxMachineDisk | null;
	/** Oldest first. */
	metrics?: Array<InstaboxMachineMetric> | null;
};

/** A sandbox's live GPU queue or Mac queue entry (`Machine.queue`). A GPU entry has `gpuType` and `gpus`; a Mac entry has `pool`. */
export type InstaboxMachineQueue = {
	/** A Mac entry: the request's `QueueRequest.autoLease`. */
	autoLease?: boolean | null;
	/** A cancel was asked while the sandbox was starting: it is stopped (or deleted, for a `create` entry) when the start ends. */
	cancelling?: boolean | null;
	enqueuedAt?: string | null;
	/** When a still queued entry gives up (`expired`). */
	expiresAt?: string | null;
	gpuType?: string | null;
	gpus?: number | null;
	/** The entry's ID: cancel it with `DELETE /v1/gpu-queue/{id}` (the CLI's `instabox gpu queue cancel`), never by deleting the sandbox, which would destroy a stopped sandbox's disks. A Mac entry's ID starts `mq_`, and it has no cancel route: stop the sandbox (a `create` entry's sandbox is then deleted). */
	id?: string | null;
	/** `create`: a create from a template; the sandbox has no disks yet, and an expiry or a cancel deletes it. `start`: a start of a stopped sandbox, or a create from a GPU snapshot; an expiry or a cancel leaves it stopped with its disks. */
	kind?: string | null;
	/** A Mac entry in `offered`: the Mac is reserved until then. `POST /v1/machines/{id}/start` before it runs the sandbox on that Mac; past it the entry ends as an expired one and the Mac goes to the next in line. */
	offerExpiresAt?: string | null;
	/** A macOS sandbox's pool: the Mac model it waits for. Absent for a GPU entry. */
	pool?: string | null;
	/** The place in line among the type's queued entries, from 1, in dispatch order (workspaces holding fewer GPUs first, then the oldest; it can move both ways), or among its Mac pool's (the oldest first). Absent unless queued. */
	position?: number | null;
	/** `queued`: waiting for a GPU or a Mac; `offered` (a Mac entry only): a Mac is reserved for the sandbox until `offerExpiresAt`, and a start of the sandbox takes it; `dispatched`: a GPU or a Mac is claimed and the sandbox is starting. */
	state?: string | null;
};

export type InstaboxMachineSecrets = {
	/** Direct references (names and paths, never values), envSecrets included. */
	directSecrets?: Array<InstaboxDirectSecret> | null;
	/** Direct references that are exactly the same-name shorthand ({secret X, env X}, no file). Renamed and file references appear only in directSecrets. */
	envSecrets?: Array<InstaboxSecretName> | null;
	guest?: InstaboxSecretGuestStatus | null;
	/** Effective selected Secrets, including proxy all. Metadata only. */
	items?: Array<InstaboxSecret> | null;
	proxy?: InstaboxSecretProxyStatus | null;
	secrets?: InstaboxSecretSelection | null;
	/** Present when the server records proxied request counts: one entry per selected proxy Secret. */
	usage?: Array<InstaboxSecretUsage> | null;
	/** Version of this sandbox's selection configuration. */
	version?: number | null;
};

/** A sandbox's size. */
export type InstaboxMachineSpec = {
	/** The GPU type of its GPUs (`GET /v1/templates` `gpuTypes`); absent on a sandbox without one. */
	gpuType?: string | null;
	/** GPUs of `gpuType` the sandbox has (`gpu` on create); absent on a sandbox without one. */
	gpus?: number | null;
	/** Memory in MiB. */
	memMiB?: number | null;
	/** Disk (`/data`) size in GiB. */
	persistentDiskGiB?: number | null;
	/** System disk size in GiB, set by the template (only admins change it); absent: the template's. */
	rootDiskGiB?: number | null;
	vcpus?: number | null;
};

export type InstaboxMachineState = string;

export type InstaboxMachineUsage = {
	/** Disk (`/data`) size, current size, times the seconds the sandbox existed in the window. */
	diskGiBSeconds?: number | null;
	/** Bytes the sandbox sent to the public internet, by whole hour: every hour from the one `from` falls in up to `to`. Billed or not (the plan's free egress and free sandboxes included). */
	egressBytes?: number | null;
	from?: string | null;
	/** Memory GiB times running seconds. */
	memGiBSeconds?: number | null;
	/** Seconds the sandbox was running in the window. */
	runningSeconds?: number | null;
	to?: string | null;
	/** vCPUs times running seconds. */
	vcpuSeconds?: number | null;
};

export type InstaboxMachineVault = {
	/** The last write into the machine; null: none yet. */
	applied?: InstaboxVaultApplied | null;
	/** The machine takes the Vault. */
	enabled?: boolean | null;
	/** The items that apply with the machine's current metadata (none when enabled is false). */
	items?: Array<InstaboxMachineVaultItem> | null;
};

export type InstaboxMachineVaultItem = {
	kind?: string | null;
	name?: string | null;
	path?: string | null;
};

/** Maximum continuous runtime in minutes. -1 is unlimited; 0 sleeps immediately. Independent of idle auto-pause; whichever condition is reached first pauses the sandbox. On a free machine the service sets it and only an admin session can change it: each run starts at 120 minutes and grows with use… */
export type InstaboxMaxRunMinutes = number;

export type InstaboxMe = {
	/** This account passed the invite gate (admins always have). When `inviteRequired` and not `activated`, every route but this one, `POST /v1/invites/redeem` and `POST /v1/auth/logout` answers `403 invite_required`. */
	activated?: boolean | null;
	/** The user is an admin and may use the admin-only endpoints (`/v1/admin`). */
	admin?: boolean | null;
	/** Admins only: the origin of the admin console when it has its own (the server's `adminUrl`). Absent, the console is `/admin/` on the dashboard's origin. */
	adminUrl?: string | null;
	/** The sizes your new sandboxes may have in your personal org (no `rootDiskGiB`: the template's). The first is the server's `limits.machineSpec` (4 vCPUs and 8 GiB memory by default), what a create naming no size gets; the others are your plan's (Pro: 2/4, 4/8, 8/16; Builder: 2/4 up to 16/32; Team… */
	allowedSpecs?: Array<InstaboxMachineSpec> | null;
	/** Whether 0 (off) is a choice too, on `org`'s plan (the personal org's for a sign-in session). A sandbox in another org follows that org's plan: see its `workspaces` entry's `alwaysOnAllowed`. */
	alwaysOnAllowed?: boolean | null;
	avatarUrl?: string | null;
	/** Paid plans can be subscribed: the server has Stripe configured. False: the dashboard offers no plan actions and the billing routes answer 503. */
	billingEnabled?: boolean | null;
	/** Browser sessions only. Send it as `X-Instabox-CSRF` on every request that is not GET or HEAD. */
	csrfToken?: string | null;
	/** This site takes direct Secret file references and renamed variables (`directSecrets`) and exec `secretEnvs`. Absent: they are refused with 400 (same-name references work); clients should not send them, since a control host from before them would ignore or misread them. */
	directSecretRefs?: boolean | null;
	/** An administrator disabled the account. Absent otherwise. */
	disabled?: boolean | null;
	/** An admin's override of disk growth (`PATCH /v1/machines/{id}` `persistentDiskGiB`, `rootDiskGiB`): `allow` grows free sandboxes' disks too, `deny` none. Absent: paid sandboxes grow, free ones are fixed. */
	diskResize?: string | null;
	/** The account's email, which an org invite must be sent to for it to join. */
	email?: string | null;
	/** This server emails workspace invites (server.json `email`). Absent: creating or resending an invite answers 503. */
	emailInvites?: boolean | null;
	/** This session can only export the account's own data (docs/data-export.md, "Disabled accounts"): `GET /v1/orgs`, `GET` and `POST /v1/orgs/{id}/exports`, `GET /v1/exports/{id}` and its download. Every other route answers `403 account_disabled`. Absent otherwise. */
	exportOnly?: boolean | null;
	/** The idle auto-suspend every sandbox of this account gets on a server that offers no choice; absent when the account chooses (`manualLifecycle`, or `idleChoicesSeconds`). */
	fixedAutoSuspendSeconds?: number | null;
	/** The idle times offered (300 to 1800, 5 to 30 minutes; docs/pricing.md): a request may send any whole minute from the first to the last. 0 (off) is never listed: `alwaysOnAllowed` says whether it is a choice too. Absent with `manualLifecycle`. */
	idleChoicesSeconds?: Array<number> | null;
	/** This server gates new accounts behind an invite code (docs/invites.md). */
	inviteRequired?: boolean | null;
	/** GitHub login at last sign-in (display only). */
	login?: string | null;
	/** The server's Mac queue is on (`macQueue`): a macOS create or start that sends `queue` waits for a Mac when none is free. Absent: off, and `queue` on such a request is refused. */
	macQueue?: boolean | null;
	/** Clients show this account per-sandbox metrics (the dashboard's Metrics tab, `instabox metrics`): admins always, every account once the server sets `machineMetricsForAll`. Absent: hidden. `GET /v1/machines/{id}/metrics` answers either way. */
	machineMetrics?: boolean | null;
	/** An admin let this account manage its sandboxes' lifecycle (docs/idle-suspend.md): the `autoSuspendAfterSeconds` it sends applies (0: off). Otherwise every sandbox pauses after `fixedAutoSuspendSeconds` idle, whatever a request says. */
	manualLifecycle?: boolean | null;
	/** This account may move its personal plan into a workspace it owns (`POST /v1/orgs/{id}/billing/move-personal`): admins always, every account once the server sets `movePersonalForAll`. */
	movePersonal?: boolean | null;
	name?: string | null;
	/** The server offers outbound network policies to this caller: `networkPolicy` is a field of create, fork and `PATCH /v1/machines/{id}`, and clients show the feature. Absent: the field is unknown to the server (`400 unknown_field`). */
	networkPolicy?: boolean | null;
	/** This account may create and edit OAuth apps (`/v1/orgs/{id}/oauth/apps`): admins always, every account once the server sets `oauth.openPublishing`. Absent: hidden; those routes answer `403`. */
	oauthPublishing?: boolean | null;
	/** The org `allowedSpecs`, `idleChoicesSeconds` and `alwaysOnAllowed` describe: your personal org, or a workspace key's workspace. Absent from older servers. */
	org?: InstaboxOrgRef | null;
	/** Set for a workspace API key: its workspace. The user is then the workspace's owner, whom the key acts as. */
	orgId?: string | null;
	/** An account the invite gate holds back may buy a workspace (`POST /v1/orgs`) instead, and is activated once its plan takes effect (docs/invites.md). Absent: only an invite code lets it in. */
	paidActivation?: boolean | null;
	/** The paid plans an org can go on (Pro, Builder, Team) as this server sells them, for plan pickers. */
	plans?: Array<InstaboxPlanOffer> | null;
	/** This server takes `PATCH /v1/machines/{id}` `apply: "restart"` (one stop, resize, start operation). Absent: it answers `400 resize_restart_off`; resize with your own stop, `PATCH`, start. */
	resizeRestart?: boolean | null;
	/** The version of the rules of the road (the Terms of Service's acceptable use) this account last agreed to (`PUT /v1/me/terms`). Absent: none. */
	termsVersion?: string | null;
	/** Instabox user ID. */
	userId?: number | null;
	/** The account's place in the line invite codes go out from and its referral link (docs/invites.md, "Referrals"). Absent: not in line (activated, the gate off, or a live code claimed for its email). */
	waitlist?: {
		/** Absent when this server could not rank the line just now. */
		position?: number | null;
		referralUrl?: string | null;
	} | null;
	/** This server offers org webhooks (docs/webhooks.md). False: the dashboard hides them, the CLI says they are off and the webhook routes answer 404. */
	webhooksEnabled?: boolean | null;
	/** Your other orgs, each with its own plan and limits (`GET /v1/usage?org=ID`, `GET /v1/orgs/{id}`). Omitted when there are none, and for a workspace API key, which reaches only its own org. */
	workspaces?: Array<InstaboxOrgRef> | null;
};

/** String labels. At most 32 keys of 1-64 characters `[A-Za-z0-9_.-]`, values of at most 512 characters, 8 KiB as JSON. */
export type InstaboxMetadata = Record<string, string>;

/** The lease a macOS template's sandboxes take (`Template.minimumLease`): a whole Mac for the org. */
export type InstaboxMinimumLease = {
	/** The price per Mac-hour, all in: the sandboxes' vCPUs and memory are not billed on top. */
	hourUSD?: number | null;
	/** The least time the Mac is leased and billed. */
	hours?: number | null;
	/** `hourUSD` for `hours`: what the minimum costs. */
	minimumUSD?: number | null;
};

export type InstaboxMovedPersonalPlan = {
	apiKeys?: Array<string> | null;
	/** The credits do not cover feeUsd: the workspace is bought in Checkout first, and nothing moves. */
	checkoutNeeded?: boolean | null;
	/** Off a dry run with checkoutNeeded: the Checkout buying the workspace. */
	checkoutUrl?: string | null;
	/** Into a new workspace (`POST /v1/orgs/move-personal`): it was made; `into` is its ID, the ID the personal org had. */
	created?: boolean | null;
	/** The new grant holding the rest, expiring a year after the move (not set on a dry run). */
	creditId?: string | null;
	/** Credit grant IDs moved, balance and expiry unchanged. */
	credits?: Array<string> | null;
	dryRun?: boolean | null;
	/** The personal plan that ended; absent: none was active. */
	endedTier?: string | null;
	/** Of it, the share of grants that expired since the fee was drawn: not carried, since a move never extends a grant's life (estimated on a dry run too). */
	expiredUsd?: number | null;
	/** The new workspace's first fee, drawn from the moved credits. */
	feeUsd?: number | null;
	/** The personal org. After a move into a new workspace: the caller's new, empty personal org (the one before is `into`). */
	from?: string | null;
	into?: string | null;
	keptApiKeys?: Array<string> | null;
	/** Sandbox IDs moved. */
	machines?: Array<string> | null;
	/** Moved free sandboxes that became paid. */
	madePaid?: Array<string> | null;
	movedAt?: string | null;
	/** What pays the moved plan. */
	movedFunding?: string | null;
	/** The personal plan moved into the workspace with its subscription, card and renewal date (a workspace without a plan of its own); nothing was charged for it, and endedTier is absent. unusedUsd is then the rest of this month's allowance, moved into the workspace's month. */
	movedTier?: string | null;
	/** With movedTier: the personal usage so far beyond this month's allowance, billed at the move (credits first, then the card). */
	overageUsd?: number | null;
	/** Running sandboxes paused for the move and resumed after it. */
	paused?: Array<string> | null;
	/** Of it, what went back into the grants that paid the fee (estimated on a dry run). */
	returnedUsd?: number | null;
	secrets?: Array<string> | null;
	snapshots?: Array<string> | null;
	/** The new workspace's plan. */
	tier?: string | null;
	/** Unused share of this month's personal fee, carried as workspace credit. */
	unusedUsd?: number | null;
};

/** A sandbox's outbound network policy: where it may connect to on the internet. It only narrows: a destination the platform blocks stays blocked. Inbound access (SSH, exec, published ports) is not affected. A fork starts with its source's policy. Domains are allowed through DNS: the sandbox's… */
export type InstaboxNetworkPolicy = {
	/** Address ranges the sandbox may connect to, IPv4 or IPv6, such as `140.82.112.0/20`; one address is that address alone. A range with bits set beyond its length, the whole address space, and private, local and reserved ranges (which no sandbox reaches) are refused. */
	allowCidrs?: Array<string> | null;
	/** Names the sandbox may resolve and then connect to, over any protocol. `github.com` is that name only; `*.github.com` is every name under it and not `github.com` itself. Lower case, no scheme, port or path. */
	allowDomains?: Array<string> | null;
	/** `restricted`: the sandbox connects only to what `allowCidrs` and `allowDomains` name; with both empty, to nothing. `open`: no policy; only a request sends it, to remove a policy, and it takes no lists. */
	outbound?: string | null;
};

/** The public part of an OAuth app, shown on consent pages, grants and sandboxes. */
export type InstaboxOAuthAppRef = {
	/** `ibapp_...` */
	id?: string | null;
	/** A `data:` URI. Absent: no logo. */
	logo?: string | null;
	name?: string | null;
	/** The publishing workspace's name. Absent: none (a metadata document's or registered app). */
	publisher?: string | null;
	/** instabox verified the app's identity. */
	verified?: boolean | null;
};

export type InstaboxOOMClaim = {
	/** The newest OOM kill whose victim was in the cgroup (absent: none named). */
	oomKill?: InstaboxOOMKill | null;
};

/** A process the sandbox's kernel OOM killer killed. */
export type InstaboxOOMKill = {
	/** The anonymous part of rssBytes. */
	anonRssBytes?: number | null;
	/** When it was killed (to about a second). */
	at?: string | null;
	/** A memory cgroup's limit killed it (a container, a unit's MemoryMax), not the sandbox running out of memory. */
	cgroup?: boolean | null;
	pid?: number | null;
	/** The killed process's name: its comm (at most 15 bytes from the kernel), capped at 64 bytes. */
	process?: string | null;
	/** Its resident memory when it was killed (anonymous, file and shared). */
	rssBytes?: number | null;
	/** The killed process's user ID, when the kernel logged it. */
	uid?: number | null;
};

/** The progress of a change to a sandbox (`suspend` is pause; `restore` puts its disks back to a snapshot's; `move`, admin only, copies it to another host pool; `migrate`, admin only, moves a running one to another host with its processes). It does not return the request it was queued with (a… */
export type InstaboxOperation = {
	createdAt?: string | null;
	error?: InstaboxError | null;
	/** On the answer to `POST /v1/machines/{id}/fork`: the control host that took it keeps the source's delete deadline, idle auto-suspend, max run and metadata, and takes `autoSuspendAfterSeconds` and `maxRunMinutes`. Absent: a host from before that (during a rolling control deploy), which gave the… */
	forkInherited?: boolean | null;
	id?: string | null;
	/** The sandbox as it is when `GET /v1/operations/{id}` is read. Included when the operation `succeeded`, the sandbox still exists, and the caller may read sandboxes (`machines:read` for API keys). Later operations can change it; it is not a record of the state at completion. Absent otherwise, and… */
	machine?: InstaboxMachine | null;
	machineId?: string | null;
	/** Free text progress, e.g. scheduling, booting, waiting_ready, snapshotting. */
	phase?: string | null;
	/** The stop or delete of a macOS sandbox inside its Mac lease's minimum is not done now but at this time (the sandbox's `archiveAt` or `deleteAt`); the operation is `succeeded`. */
	scheduledAt?: string | null;
	/** `succeeded` and `failed` are terminal. */
	state?: string | null;
	/** Set when instabox started the operation itself: `idle` (paused when idle), `max_run` (maximum continuous runtime), `memory_pressure` (paused, its processes kept, because the host it ran on was running out of memory; the next use wakes it, as after `idle`), `request` (wake on use), `wake` (POST… */
	trigger?: string | null;
	/** On the answer to a half-size macOS create that opened a Mac: the second sandbox the create made on it (a Mac runs two sandboxes of half its size). */
	twin?: InstaboxTwinCreate | null;
	type?: string | null;
	updatedAt?: string | null;
};

/** An org (docs/orgs.md). Sandboxes are created in one and count against its plan. */
export type InstaboxOrg = {
	/** The sizes that may be created in the org, the default first (its plan's, then any an admin granted the org). */
	allowedSpecs?: Array<InstaboxMachineSpec> | null;
	billing?: InstaboxOrgBilling | null;
	/** Set while a workspace has no card on file. On the free tier its sandboxes then answer `402 payment_method_required` and running ones are paused (`trigger: payment_method`); they run again once one is added (`POST /v1/orgs/{id}/billing/checkout` with no tier, or the portal). */
	cardMissingAt?: string | null;
	createdAt?: string | null;
	/** Set while the workspace cannot be used: its plan ended (cancelled, unpaid, or its credits ran out). Its sandboxes answer `402 subscription_required`; they and its snapshots are deleted 30 days later unless it subscribes again. */
	disabledAt?: string | null;
	id?: string | null;
	/** `personal`: the account's own org, made when it signed up, on any tier but with no other members: it takes no invites. `workspace`: an org to share, on any tier; on the free tier it needs a card on file and has up to `limits.maxMembers` members. */
	kind?: string | null;
	limits?: InstaboxOrgLimits | null;
	name?: string | null;
	/** `kind` is `personal`. */
	personal?: boolean | null;
	/** Set on a disabled workspace: when its sandboxes and snapshots are deleted. Until then its people can download their `/data` (`POST /v1/orgs/{id}/exports`). */
	purgeAt?: string | null;
	/** Your role in the org. */
	role?: string | null;
	tier?: string | null;
	usage?: InstaboxOrgUsage | null;
};

/** The org's Stripe subscription (docs/pricing.md); absent when it never had one. */
export type InstaboxOrgBilling = {
	/** The subscription ends at periodEnd. */
	cancelAtPeriodEnd?: boolean | null;
	/** What pays the plan: a Stripe subscription, or the org's credits (renewed by the server on the 1st). */
	funding?: string | null;
	/** When an unpaid subscription ends (the failed charge's time; the next billing pass ends it). */
	graceUntil?: string | null;
	pastDueSince?: string | null;
	periodEnd?: string | null;
	periodStart?: string | null;
	/** A lower tier that applies at the next renewal. */
	scheduledTier?: string | null;
	/** `incomplete`: Checkout not completed; `past_due`: a charge failed, the plan stays until the next billing pass ends it (`graceUntil`). */
	status?: string | null;
	/** A Stripe subscription exists. */
	subscribed?: boolean | null;
	/** The subscribed tier. */
	tier?: string | null;
	/** Stripe invoices whose charge failed and are still open; until they are paid (the billing portal) the org cannot subscribe again, and a subscription it completed meanwhile does not take effect. */
	unpaidInvoiceIds?: Array<string> | null;
};

/** One GPU type's usage this month (`OrgUsage.gpu`). */
export type InstaboxOrgGPUUsage = {
	/** GPU-hours (running time times GPUs). */
	gpuHours?: number | null;
	/** The current price per GPU-hour (0: not priced). */
	hourUSD?: number | null;
	model?: string | null;
	type?: string | null;
	usd?: number | null;
};

export type InstaboxOrgInvite = {
	createdAt?: string | null;
	createdBy?: number | null;
	/** Where the invite was emailed, lowercased. Absent: a code with no recipient. */
	email?: string | null;
	expiresAt?: string | null;
	id?: string | null;
	orgId?: string | null;
	redeemedAt?: string | null;
	redeemedBy?: number | null;
	revokedAt?: string | null;
	role?: string | null;
};

export type InstaboxOrgInviteCode = {
	/** The code to hand out. */
	code?: string | null;
	createdAt?: string | null;
	/** How many people the workspace's codes let in together. */
	maxUses?: number | null;
	/** Who joined with any of the workspace's codes and when, oldest first. */
	redeemers?: Array<InstaboxOrgInviteRedeemer> | null;
	/** `used`: nobody else can join with it. */
	state?: string | null;
	/** How many people joined with any of the workspace's codes. */
	useCount?: number | null;
};

export type InstaboxOrgInviteList = {
	invites?: Array<InstaboxOrgInvite> | null;
};

export type InstaboxOrgInviteRedeemer = {
	/** The account's provider-verified email. Absent: it has none. */
	email?: string | null;
	login?: string | null;
	redeemedAt?: string | null;
};

export type InstaboxOrgLimits = {
	/** Whether the plan's sandboxes may turn idle auto-suspend off. */
	alwaysOn?: boolean | null;
	/** True when the org's early free-sandbox allowance (five, until 2026-12-01 00:00 UTC) has ended and it has more free sandboxes than `freeSandboxes`: only that many may run, the others are paused and a start of one is refused (`402 early_allowance_ended`). Absent otherwise. */
	earlyAllowanceEnded?: boolean | null;
	/** What a create past the plan's included starts does (start quotas): `fail` (the default), it is refused; `pay` (an owner or admin turns it on), it is charged as an extra start. A paid org's, with billing on; while the plan's start quota is a preview, shown to instabox admins only. */
	extraStarts?: string | null;
	/** The free sandboxes' running time a month when the server caps it; 0: no cap. */
	freeSandboxHours?: number | null;
	/** The free tier's sandbox allowance (never billed): limits.maxMachinesPerUser, or an admin's override on the org. */
	freeSandboxes?: number | null;
	/** How far its owner may grow a sandbox's disk (`/data`), in GiB (free 20, fixed: it neither grows nor shrinks; pro 200; builder 500; team and enterprise 1024); a disk already past it is kept. 0: no limit. */
	maxDiskGiB?: number | null;
	/** Sandboxes the org may have, in any state: on the free tier its allowance (`freeSandboxes`, never billed), on a paid plan the plan's count, every one billed; 0: no limit. An org over it keeps what it has but creates nothing more. */
	maxMachines?: number | null;
	/** Members the org may have, its owner and pending invites included; 0: no limit (a personal org: 1). */
	maxMembers?: number | null;
	/** Paid sandboxes that may run at once; 0: no limit. */
	maxRunning?: number | null;
	/** Live snapshots the org may have; 0: no limit. */
	maxSnapshots?: number | null;
	/** Cap on the disk (`/data`) allocated to the org's live sandboxes, in GiB: new sandboxes and snapshots in the org are refused (`429 quota_exceeded`) while it is over. 0: no limit. */
	maxStoredGiB?: number | null;
	/** The largest sandbox size the plan offers, by vCPUs. */
	maxVCPUs?: number | null;
	/** Always 0 (kept for older clients); the free sandbox has hours, not a credit. */
	monthlyCreditUSD?: number | null;
	/** Whether a paid org's owner and admins are emailed once a month when usage goes beyond what the month includes (pay as you go). */
	overageAlert?: boolean | null;
	/** A paid org's cap on this month's usage beyond its allowance (`PATCH /v1/orgs/{id}/billing`); null when none, 0 when nothing beyond the allowance is allowed. */
	spendCapUSD?: number | null;
	/** Sandbox starts (create, start, resume, wake) the org may make a minute; 0: no limit. */
	startsPerMinute?: number | null;
	/** Usage beyond what the month includes is charged to the card each time what is not charged yet reaches this, rather than all at the month's end; absent when only at the end, and for an org that is not charged so (credits-funded, no subscription, or a plan without a monthly fee). */
	thresholdBillingUSD?: number | null;
	/** A paid org's usage alert: its owner and admins are emailed once a month when usage reaches this share of what the month includes (the allowance plus the credits); 0: off. Absent where no email would go out: the free tier, billing off, no active or past-due subscription, or a plan without a… */
	usageAlertPercent?: number | null;
};

export type InstaboxOrgList = {
	orgs?: Array<InstaboxOrg> | null;
};

/** One host pool's Mac leases this month (`OrgUsage.macos`). */
export type InstaboxOrgMacOSUsage = {
	/** The current price per Mac-hour. */
	hourUSD?: number | null;
	/** Hours of leased Macs. */
	macHours?: number | null;
	pool?: string | null;
	usd?: number | null;
};

export type InstaboxOrgMachineUsage = {
	/** vCPU and memory at list prices, before the plan's allowance; 0 for a free sandbox. */
	computeUSD?: number | null;
	/** When the sandbox was deleted; absent for a live one. */
	deletedAt?: string | null;
	/** Disk (`/data`) size times the seconds the sandbox existed at that size in the window. */
	diskGiBSeconds?: number | null;
	/** That disk at the list price per GiB-hour, before the plan's included disk; 0 for a free sandbox and on the free plan. */
	diskUSD?: number | null;
	/** Bytes the sandbox sent to the public internet, by whole hour: every hour from the one `from` falls in up to `to`. */
	egressBytes?: number | null;
	/** Those bytes at the list price per GiB, before the plan's free egress; 0 for a free sandbox. */
	egressUSD?: number | null;
	/** A free sandbox; its compute, disk and egress are not billed. */
	free?: boolean | null;
	/** GPUs times running seconds in the window; absent without GPUs. */
	gpuSeconds?: number | null;
	/** Their GPU type; absent without one. */
	gpuType?: string | null;
	/** Its GPU time at the type's price per GPU-hour; absent without GPUs. */
	gpuUSD?: number | null;
	/** The sandbox's GPUs; absent without one. */
	gpus?: number | null;
	id?: string | null;
	/** Memory GiB times running seconds. */
	memGiBSeconds?: number | null;
	/** The sandbox's metadata; `{}` without any. */
	metadata?: Record<string, string> | null;
	/** The sandbox's name; null for a sandbox since moved to another workspace. */
	name?: string | null;
	/** Seconds the sandbox was running in the window. */
	runningSeconds?: number | null;
	/** vCPUs times running seconds. */
	vcpuSeconds?: number | null;
};

export type InstaboxOrgMachineUsageList = {
	from?: string | null;
	machines?: Array<InstaboxOrgMachineUsage> | null;
	to?: string | null;
	/** Sandboxes in the list, all pages. */
	total?: number | null;
};

export type InstaboxOrgMember = {
	/** When they joined. */
	createdAt?: string | null;
	/** Verified email, when available. */
	email?: string | null;
	login?: string | null;
	role?: string | null;
	userId?: number | null;
};

export type InstaboxOrgMemberList = {
	members?: Array<InstaboxOrgMember> | null;
};

export type InstaboxOrgRef = {
	/** Set on `GET /v1/me` (`org`, `workspaces`): this org's plan lets its sandboxes take `autoSuspendAfterSeconds` 0 (off). Absent on a plan that does not, elsewhere, and from older servers. */
	alwaysOnAllowed?: boolean | null;
	/** Org ID (org_...). */
	id?: string | null;
	kind?: string | null;
	name?: string | null;
	/** The org's plan. */
	tier?: string | null;
};

/** The org's usage this calendar month (UTC) as the hourly rating job priced it: running time by sandbox size, the allocated disk (`/data`) of the paid sandboxes beyond the plan's included disk, and egress beyond the plan's free egress a month, up to `ratedUntil`. Snapshots and the system disk are… */
export type InstaboxOrgUsage = {
	/** The `/data` of all the org's live sandboxes, free ones included, in GiB: what `limits.maxStoredGiB` is checked against. */
	allocatedDiskGiB?: number | null;
	/** Usage the month includes: the free credit, or what the subscription paid for. */
	allowanceUSD?: number | null;
	/** The disk being billed now: the sum over the org's paid sandboxes of their allocated `/data` (less `freeDiskGiBPerSandbox` each, 0 by default), less `includedDiskGiB`; 0 while the org is past due or disabled (nothing is rated then), and without sandboxes of an earlier account life. */
	billableDiskGiB?: number | null;
	/** Usage beyond the allowance already charged this month (threshold billing); the month's end bills overageUSD less it. */
	chargedUSD?: number | null;
	/** This month's usage so far, at the prices in force when rated. */
	costUSD?: number | null;
	/** The allowance left. */
	creditRemainingUSD?: number | null;
	/** When the earliest of the credits expires. */
	creditsExpireAt?: string | null;
	/** What the org's unexpired credits have left: they pay a plan's fee and usage beyond the allowance (docs/pricing.md, Credits). */
	creditsUSD?: number | null;
	/** What credits paid this month. */
	creditsUsedUSD?: number | null;
	/** Egress to the public internet beyond the plan's free egress this month (metered per machine, rated hourly). */
	egressGiB?: number | null;
	egressUSD?: number | null;
	/** This month's paid extra starts, as rated (in costUSD). Absent without any. */
	extraStarts?: number | null;
	/** Their price: the extra starts part of costUSD. */
	extraStartsUSD?: number | null;
	/** The `/data` of each paid sandbox that is not billed, in GiB: 0 by default (every allocated GiB is billed); an operator may configure more. Absent from older servers, which did not bill the first 20 GiB. */
	freeDiskGiBPerSandbox?: number | null;
	/** Of them, the free sandboxes (never billed). */
	freeMachines?: number | null;
	/** The free sandboxes' running time this month. */
	freeSandboxHours?: number | null;
	/** This month's GPU time by GPU type, rated per GPU-hour while the sandboxes run (in costUSD). Absent while the org has no GPU usage this month. */
	gpu?: Array<InstaboxOrgGPUUsage> | null;
	/** The sum of `gpu`'s `usd`: the GPU part of costUSD. */
	gpuUSD?: number | null;
	/** The disk the org's plan includes, all its paid sandboxes' `/data` together, in GiB (Pro 200, Builder 1024, Team 5120, Enterprise 0): each hour that much is not billed. Absent from older servers, which included none. */
	includedDiskGiB?: number | null;
	/** Live sandboxes now. */
	machines?: number | null;
	/** This month's Mac leases by host pool, rated per Mac-hour while a lease is open, on top of the sandboxes' vCPUs and memory (in costUSD). Absent while the org has no Mac lease this month. */
	macos?: Array<InstaboxOrgMacOSUsage> | null;
	/** The sum of `macos`'s `usd`: the macOS part of costUSD. */
	macosUSD?: number | null;
	memGiBHours?: number | null;
	/** The memory part of compute. */
	memUSD?: number | null;
	/** Usage beyond the allowance (billed at month end on a paid tier). */
	overageUSD?: number | null;
	periodEnd?: string | null;
	periodStart?: string | null;
	/** The rating job's cursor. */
	ratedUntil?: string | null;
	/** What may still be used before the org is stopped; 0 when there is no limit or nothing is left (see `limits`). */
	remainingUSD?: number | null;
	/** The paid sandboxes running or starting now: what `limits.maxRunning` is checked against when a sandbox is created, started or resumed. */
	running?: number | null;
	/** Compute: `vcpuUSD` plus `memUSD`. */
	runtimeUSD?: number | null;
	/** Live snapshots now. */
	snapshots?: number | null;
	/** The org's start quota and its creates now; absent when its plan has none, and for a caller who is not an instabox admin while the plan's quota is a preview. */
	starts?: InstaboxStartQuota | null;
	/** Deprecated: always null. */
	storageComputedAt?: string | null;
	/** Allocated disk (`/data`) of the paid sandboxes (less `freeDiskGiBPerSandbox` each, 0 by default) beyond the plan's `includedDiskGiB` each hour, in GiB-hours. */
	storageGiBHours?: number | null;
	storageUSD?: number | null;
	/** Deprecated: always null. Storage is billed on allocated disk, not stored bytes; use `billableDiskGiB`. */
	storedBytes?: number | null;
	/** The part of creditsUsedUSD that paid usage beyond the allowance this month (not a plan fee); threshold billing charges overageUSD less chargedUSD and it. */
	usageCreditsUSD?: number | null;
	vcpuHours?: number | null;
	/** The vCPU part of compute. */
	vcpuUSD?: number | null;
};

/** A paid plan as this server sells it (server.json `plans`). */
export type InstaboxPlanOffer = {
	/** How far a sandbox's disk (`/data`) may grow on this plan, in GiB (free 20, fixed: it neither grows nor shrinks; pro 200; builder 500; team and enterprise 1024); a disk already past it is kept. 0: no limit. */
	maxDiskGiB?: number | null;
	/** Sandboxes the org may have on this plan, every one billed; 0: no limit. */
	maxMachines?: number | null;
	/** Paid sandboxes running at once; 0: no limit. */
	maxRunning?: number | null;
	/** The largest sandbox size's vCPUs. */
	maxVCPUs?: number | null;
	/** The monthly fee, also the usage it includes each month. */
	monthlyFeeUSD?: number | null;
	tier?: string | null;
};

export type InstaboxPortalResponse = {
	/** The Stripe customer portal URL to send the user to. */
	url?: string | null;
};

/** One process, as `ps -e -ww -o pid=,ppid=,user:64=,pcpu=,pmem=,etimes=,args=` reports it. */
export type InstaboxProcess = {
	/** The full command line. */
	command?: string | null;
	cpuPercent?: number | null;
	elapsedSeconds?: number | null;
	memPercent?: number | null;
	pid?: number | null;
	ppid?: number | null;
	user?: string | null;
};

export type InstaboxProcessList = {
	/** When the list was read. */
	capturedAt?: string | null;
	/** The list was read from the running sandbox for this request; false: the list the server stored last, for a stopped or paused sandbox. */
	live?: boolean | null;
	machineId?: string | null;
	/** Without `all`, kernel threads and the listing's own processes are left out. */
	processes?: Array<InstaboxProcess> | null;
	/** The sandbox's state now. */
	state?: string | null;
	/** What read it: a client's request, or the server just before a stop or a pause. */
	trigger?: string | null;
	/** The listing was cut; processes are missing. */
	truncated?: boolean | null;
};

export type InstaboxPublicPort = {
	/** `public`: anyone with the URL. `private`: only requests that carry the port's token (`_token` query parameter once, the cookie it sets, or `Authorization: Bearer`). */
	access?: string | null;
	/** `tcp` only: the TLS endpoint `host:port`; the client must send the host as SNI. psql: `host=<host> port=<port> sslmode=require`. */
	address?: string | null;
	createdAt?: string | null;
	/** Always null (public ports do not expire); kept for older in-guest instabox-port agents. */
	expiresAt?: null;
	/** The publication's ID; a new one after an unpublish, an access change or a token rotation. The URL does not change. */
	id?: string | null;
	machineId?: string | null;
	name?: string | null;
	port?: number | null;
	/** `http`: an HTTPS URL. `tcp`: a raw TCP service behind TLS at `address`, routed by SNI, always public (docs/public-ports.md, "Raw TCP ports"). */
	protocol?: string | null;
	/** A private port's token (`ibp_...`), only in the publish response that created or rotated it. */
	token?: string | null;
	/** `url` with `?_token=<token>`: the link to share. Present with `token`. */
	tokenUrl?: string | null;
	/** `https://<port>-<sandbox>.<domain>` for `http`, `tls://<address>` for `tcp`. Empty when public ports (or raw TCP ports) are not configured. */
	url?: string | null;
};

export type InstaboxPublicPortList = {
	/** Whether the server has public ports configured. */
	enabled?: boolean | null;
	ports?: Array<InstaboxPublicPort> | null;
};

export type InstaboxRuntime = {
	/** When the sandbox's host last answered; set with `hostUnreachable`. */
	hostLastSeenAt?: string | null;
	/** True while the host the sandbox runs on is not answering. The sandbox cannot be reached (exec, files and SSH fail with `503 host_unavailable`) and `ready` is false, whatever `state` says; `start` and `resume` of a running sandbox return `503 host_unavailable` instead of succeeding. Absent when… */
	hostUnreachable?: boolean | null;
	/** Set after a start or resume. False means the paused programs could not be brought back and the sandbox booted fresh (files are kept). */
	processesPreserved?: boolean | null;
	/** True only when the sandbox is running, reports all checks passing and, as checked when it boots or resumes, accepts exec, file and SSH connections. */
	ready?: boolean | null;
};

export type InstaboxSSHToken = {
	/** `ssh -p <port> <token>@<host>` (without `-p` on port 22). */
	command?: string | null;
	/** Absent: the token does not expire (`noExpiry`). */
	expiresAt?: string | null;
	host?: string | null;
	/** SHA256 fingerprint of the SSH server's host key, which ssh asks to confirm on the first connection. */
	hostKeyFingerprint?: string | null;
	/** Connection ID (`cn_…`) of the token's grant. */
	id?: string | null;
	machineId?: string | null;
	/** The same login with mosh: `mosh --ssh="ssh -p <port>" <token>@<host>` (`mosh <token>@<host>` on port 22). Absent when mosh is not available. */
	moshCommand?: string | null;
	name?: string | null;
	port?: number | null;
	/** `ibssh_` and 26 lowercase base32 characters (128 bits): the SSH user name. Shown only here. */
	token?: string | null;
};

export type InstaboxSSHTokenInfo = {
	command?: string | null;
	createdAt?: string | null;
	/** Absent: the token does not expire. */
	expiresAt?: string | null;
	/** With `port`, `token`, `command` and `moshCommand`: set only in a sign-in session, for a valid token the caller made, when the server kept it (a vault key is configured). */
	host?: string | null;
	id?: string | null;
	moshCommand?: string | null;
	name?: string | null;
	port?: number | null;
	revokedAt?: string | null;
	token?: string | null;
};

export type InstaboxSSHTokenList = {
	tokens?: Array<InstaboxSSHTokenInfo> | null;
};

export type InstaboxSSHTokensRevoked = {
	/** Tokens that were still valid. */
	revoked?: number | null;
};

/** Org Secret metadata. Values, ciphertext and placeholders are never returned. */
export type InstaboxSecret = {
	createdAt?: string | null;
	delivery?: InstaboxSecretDelivery | null;
	hosts?: InstaboxSecretHosts | null;
	/** Stable identity retained by replacements; deletion and recreation makes a new ID. */
	id?: string | null;
	name?: InstaboxSecretName | null;
	orgId?: string | null;
	/** Raw value size in bytes. */
	size?: number | null;
	updatedAt?: string | null;
	version?: number | null;
};

/** Proxy supplies an opaque sandbox-specific placeholder for substitution in ordinary HTTPS headers on allowed hosts (port 443). Env supplies the real value, including credentials needed by native database clients. Unsupported traffic never falls back from proxy to env. */
export type InstaboxSecretDelivery = string;

export type InstaboxSecretGuestItem = {
	delivery?: InstaboxSecretDelivery | null;
	/** A direct Secret's variable name. */
	env?: string | null;
	/** A direct Secret's home-relative file path. */
	file?: string | null;
	id?: string | null;
	name?: InstaboxSecretName | null;
	version?: number | null;
};

/** Managed environment and public CA installation. This does not prove existing processes reloaded values. Removing env access cannot remove values already copied into process memory, files, or snapshots. */
export type InstaboxSecretGuestStatus = {
	appliedAt?: string | null;
	/** Revision of the last installation attempt; check state for success. */
	appliedRevision?: number | null;
	/** Fixed delivery error, never arbitrary guest output or credential values. */
	error?: string | null;
	/** Metadata from the last successful installation. */
	items?: Array<InstaboxSecretGuestItem> | null;
	/** Desired policy revision. */
	revision?: number | null;
	state?: string | null;
};

/** Exact ASCII DNS hostnames, normalized to lowercase without a trailing dot, or a standalone `*` for every public HTTPS destination. Required for proxy delivery: omitted or empty is 400. No scheme, port, path, partial wildcard, IP literal, or local hostname. Destination checks also reject private… */
export type InstaboxSecretHosts = Array<string>;

export type InstaboxSecretList = {
	items?: Array<InstaboxSecret> | null;
};

/** A unique environment variable name within an org. The names a sandbox's env reserves are reserved (shell variables such as PATH, HOME, BASH_ENV, ENV and IFS, session and trust-store variables, and INSTABOX_ and SSH_ prefixes). A Secret saved under a name before it was reserved is not delivered:… */
export type InstaboxSecretName = string;

/** Last node acknowledgement, not continuous health. Policies expire within 60 seconds unless renewed. Revocation is pending until applied or the previous lease expires. Already admitted streams may finish. */
export type InstaboxSecretProxyStatus = {
	/** Last revision acknowledged by the node. */
	appliedRevision?: number | null;
	expiresAt?: string | null;
	/** Desired org policy revision. */
	revision?: number | null;
	state?: string | null;
};

/** Proxy selection only. All includes current and future proxy Secrets in the sandbox's org. Explicit names resolve to stable IDs. An empty array selects none. Deleting and recreating a name does not restore an explicit grant. Null is rejected. */
export type InstaboxSecretSelection = string | Array<InstaboxSecretName>;

/** This sandbox's HTTPS requests carrying the Secret's placeholder. requests had the real value injected; denied went to a host outside the Secret's hosts and were refused. Lags by up to a policy renewal and covers only hosts the proxy intercepts. */
export type InstaboxSecretUsage = {
	denied?: number | null;
	/** Last request with the value injected; denied requests do not move it. */
	lastUsedAt?: string | null;
	name?: InstaboxSecretName | null;
	requests?: number | null;
};

export type InstaboxSession = {
	createdAt?: string | null;
	/** The session making this request. */
	current?: boolean | null;
	expiresAt?: string | null;
	/** Revoke handle (`ss_…`). */
	id?: string | null;
	kind?: string | null;
	/** Last browser use, or the last token refresh of a CLI session. */
	lastUsedAt?: string | null;
};

export type InstaboxSessionList = {
	sessions?: Array<InstaboxSession> | null;
};

/** A saved copy of a sandbox (software and files). New sandboxes can be created from it. It belongs to its source sandbox's org: every member of the org sees, uses and deletes it. */
export type InstaboxSnapshot = {
	createdAt?: string | null;
	/** The logical size of the storage disk (`/data`) a sandbox created from it gets, not the bytes stored (the saved data is sparse and compressed); absent for system-files-only snapshots. Sandboxes created from it get at least this much storage. */
	dataSizeBytes?: number | null;
	/** The size a sandbox created from this snapshot gets when the create names none: with `sizeLocked`, the vCPUs and memory of the sandbox it was saved from, the only size a create from it may name; without (saved before this rule), the default size (`limits.machineSpec`, 4 vCPU / 8 GiB on… */
	defaultSpec?: InstaboxMachineSpec | null;
	description?: string | null;
	/** Why a `failed` snapshot failed. */
	error?: string | null;
	/** No longer computed; servers leave it out. (Was the stored bytes only this snapshot references.) */
	exclusiveBytes?: number | null;
	/** The source sandbox's Linux user (`Machine.guestUser`), which a sandbox created from this snapshot keeps unless the create names another. `dev` for snapshots of sandboxes from older templates. */
	guestUser?: string | null;
	/** `sn_...` (`im_...` for older snapshots). */
	id?: string | null;
	/** The Mac model (`TemplateModel.name`) a macOS snapshot was saved on. A create from it runs there unless it names another `model` or that model is closed. */
	model?: string | null;
	/** Unique among the org's live snapshots. */
	name?: string | null;
	/** The org the snapshot belongs to (its source sandbox's). */
	orgId?: string | null;
	/** When the visibility became community or official. */
	publishedAt?: string | null;
	/** Who shared or published it. */
	publisherLogin?: string | null;
	/** The logical size of the system disk a sandbox created from it gets (its provisioned capacity), not the bytes stored: a snapshot is saved sparse and compressed. */
	rootSizeBytes?: number | null;
	/** True for a snapshot (not of a GPU sandbox) saved since a create from a snapshot gets its source's size one to one: a create from it gets `defaultSpec`'s vCPUs and memory only (another is `400 spec_not_allowed`). Absent for older snapshots, which create at any size. */
	sizeLocked?: boolean | null;
	sourceMachineId?: string | null;
	/** The source sandbox's saved state (`storage.snapshotSeq`) this snapshot was taken from; 0 for a live snapshot of a sandbox that was never stopped. */
	sourceSnapshotSeq?: number | null;
	/** `ready` can be used. A snapshot of a running sandbox is `pending` while it uploads (its sizes are the sandbox's until then), then `ready` or `failed`. */
	status?: string | null;
	template?: InstaboxTemplateRef | null;
	/** Who can create from the snapshot (docs/community-templates.md): `private` (the default, its org's members), `community` (every signed-in account) or `official` (listed next to the built-in templates). Absent on older servers: treat as private. Handlers do not set community or official yet. */
	visibility?: string | null;
};

export type InstaboxSnapshotList = {
	snapshots?: Array<InstaboxSnapshot> | null;
};

export type InstaboxSnapshotRef = {
	id?: string | null;
};

/** The org's start quota: the sandbox creates its plan includes in the last 24 hours, hour and minute (sliding windows), and what a create past them costs. A create past a window's included creates is an extra start at `extraStartUSD` when the window charges and the org pays for extra starts, with… */
export type InstaboxStartQuota = {
	/** This month's UTC days that had paid extra starts, oldest first; their sum is `extraMonth` and `extraMonthUSD`. Absent without any. */
	days?: Array<InstaboxStartQuotaDay> | null;
	/** Paid extra starts in the last 24 hours. */
	extraDay?: number | null;
	/** Their price. */
	extraDayUSD?: number | null;
	/** Paid extra starts this month (UTC). */
	extraMonth?: number | null;
	/** Their price. */
	extraMonthUSD?: number | null;
	/** The plan's price of an extra start, whatever windows it is over, charged once. It applies only in windows that charge (`charge`); with none, nothing is charged whatever it is. */
	extraStartUSD?: number | null;
	/** The org's setting (`limits.extraStarts`). */
	extraStarts?: string | null;
	/** What the org's next create would cost: 0 when included; null when it would be refused. */
	nextStartUSD?: number | null;
	/** Every sandbox create of the org this month, extra or not; absent when not known. */
	startsMonth?: number | null;
	/** The plan's windows with included creates, the day first. */
	windows?: Array<InstaboxStartQuotaWindow> | null;
};

export type InstaboxStartQuotaDay = {
	/** The day (UTC), `YYYY-MM-DD`. */
	date?: string | null;
	/** The paid extra starts that day. */
	extraStarts?: number | null;
	/** Their price. */
	extraStartsUSD?: number | null;
};

export type InstaboxStartQuotaWindow = {
	/** Whether a create past `included` is a paid extra start rather than refused. */
	charge?: boolean | null;
	/** While the window is full (`used` at `max`): when a create can be made again. */
	freesAt?: string | null;
	/** The creates the plan includes in the window. */
	included?: number | null;
	/** The most creates the window allows, `included`, when it does not charge or extra starts fail. Absent: no limit, a create past `included` being a paid extra start. */
	max?: number | null;
	/** The org's creates in the window, extra starts included. */
	used?: number | null;
	/** The last 24 hours, 60 minutes or 60 seconds. */
	window?: string | null;
};

export type InstaboxStats = {
	at?: string | null;
	runningMachines?: number | null;
};

/** The sandbox's storage (`/data`, where HOME lives; `/` on macOS, whose disk is the root volume). */
export type InstaboxStorage = {
	mountPath?: string | null;
	persistent?: boolean | null;
	sizeGiB?: number | null;
	/** Sequence number of the sandbox's latest saved state; absent before the first stop or pause. */
	snapshotSeq?: number | null;
	/** False while the latest state of a stopped or paused sandbox is still being saved: for a few seconds after a stop or pause, or longer if saving fails (it is retried). A snapshot waits until it is true. */
	synced?: boolean | null;
};

/** A template version a sandbox can start from. Versions never change. */
export type InstaboxTemplate = {
	arch?: string | null;
	/** `identity-reset`: its sandboxes can be snapshotted. `root-grow`: an admin can grow its sandboxes' sizes. `orca`: its sandboxes run an Orca runtime (`POST /v1/machines/{id}/orca-connections`). `activity`: it ships activity probes for its agents, so pausing when idle (`autoSuspendAfterSeconds`)… */
	capabilities?: Array<string> | null;
	/** Whether a create may name this template (`POST /v1/machines` `templateId`): false for a `hidden` one, which is refused with `400`. The org's plan may still refuse a creatable one (`403 template_not_allowed`; the free plan creates from agent-browser, android, omarchy or ci only). Absent on… */
	creatable?: boolean | null;
	/** This is the version a create naming neither `templateId` nor `snapshotId` gets (the `latest` agent-browser). Absent on servers older than this field. */
	default?: boolean | null;
	defaultSpec?: InstaboxMachineSpec | null;
	description?: string | null;
	/** sha256:<rootfs sha> */
	digest?: string | null;
	/** A GPU template: a create from it needs `gpu` (CreateMachineRequest), and a create with `gpu` takes only a GPU template. GPU sandboxes are for paid plans. */
	gpu?: boolean | null;
	/** On a GPU template, how its sandboxes run: `vm` (gVisor on a cloud GPU VM) or `metal` (a VM with whole GPUs on bare metal). It decides which GPU types `gpuTypes` lists; absent means `vm`. */
	gpuMode?: string | null;
	/** On a GPU template, the GPU types a create from it may ask for. Absent on every other template. */
	gpuTypes?: Array<InstaboxTemplateGPUType> | null;
	/** This template is no longer offered for new sandboxes: a create naming it is refused. It is still listed so that sandboxes and snapshots built on it keep showing its size and capabilities. */
	hidden?: boolean | null;
	id?: string | null;
	/** The guest kernel this version runs, `sha256:<hex>`: every sandbox created from it is pinned to that kernel for its whole life (cold boots, snapshots, restores and moves never use another) and is placed only on hosts that have it. Absent: the host's default kernel (every template before this field). */
	kernel?: string | null;
	/** This is the version a create naming this `templateId` without a `templateVersion` gets: set on one creatable version per id. Absent on servers older than this field: the last listed version of the id, when it is creatable (a hidden one: none). */
	latest?: boolean | null;
	/** On a macOS template: a sandbox from it leases a whole Mac to its org for at least `hours`, and a create needs `acceptMinimumLease` (CreateMachineRequest). Absent on every other template. */
	minimumLease?: InstaboxMinimumLease | null;
	/** On a macOS template, the Mac models a create may pick with `model` (CreateMachineRequest), each with its sizes and lease. One of them is `pool`'s, with the template's own `defaultSpec` and `sizes`. Absent: the template runs on one model. */
	models?: Array<InstaboxTemplateModel> | null;
	/** The template's guest OS. Absent (an older server): linux. */
	os?: string | null;
	/** The host pool every sandbox of this version runs in (e.g. `mac-m2pro` for macOS on M2 Pro Macs); its `defaultSpec` and `sizes` are then the sizes such a sandbox gets, whatever the plan's sizes and vCPU limit. Absent: the default placement and the server's sandbox size. */
	pool?: string | null;
	/** New sandboxes of this template version start faster: they come from an already booted copy, one per `prebootSpecs` entry (absent: its `defaultSpec`). Otherwise, or when no such copy is ready, the sandbox boots as usual. */
	preboot?: boolean | null;
	/** The sizes `preboot` applies to. Absent: `defaultSpec` only. */
	prebootSpecs?: Array<InstaboxMachineSpec> | null;
	/** An internal test: only the accounts the operator listed, and admins, see it in this list or can create from it (a create by anyone else answers as for an unknown template). Sandboxes that exist keep working for their owners. */
	restricted?: boolean | null;
	/** Software baked into the template, e.g. {"herdr":"0.9.3"}. */
	runtime?: Record<string, string> | null;
	/** A pool template's sizes besides `defaultSpec` (`vcpus` and `memMiB`; the disks are `defaultSpec`'s). A create names one with `vcpus` and `memMiB`; leaving the size out gets `defaultSpec`. */
	sizes?: Array<InstaboxMachineSpec> | null;
	/** A new version on its way to the hosts: a create may name it with `templateVersion`. A create without one gets it only once no host holds the current latest version any more; the operator's promote makes it the latest. */
	staged?: boolean | null;
	version?: string | null;
};

/** A GPU type a GPU template offers (`Template.gpuTypes`). */
export type InstaboxTemplateGPUType = {
	/** The GPU counts a create may ask for, ascending: the powers of two up to `maxPerMachine` (1, 2 and 4 for a type whose hosts have 4 GPUs), so every host's GPUs split evenly. Any other count is `400 bad_request` naming these. */
	counts?: Array<number> | null;
	/** This template is the one a create with this GPU type and no `templateId` gets. A type is listed on every GPU template of its mode, and is the default of one. */
	default?: boolean | null;
	/** The largest GPU count a create may ask for. */
	maxPerMachine?: number | null;
	/** GPU memory per GPU in GiB. */
	memGiB?: number | null;
	model?: string | null;
	/** How many GPUs of this type wait in the GPU queue now (queued requests, not yet starting): the line a create or start with `queue` joins. Absent while the server has no GPU queue. */
	queued?: number | null;
	/** The sizes a create may pick, per GPU: a sandbox with N GPUs gets N times the vCPUs and memory and the disk once. A create that names no size gets the first. */
	sizes?: Array<InstaboxMachineSpec> | null;
	/** What `gpu` names on create. */
	type?: string | null;
};

export type InstaboxTemplateList = {
	templates?: Array<InstaboxTemplate> | null;
};

/** One Mac model of a macOS template (`Template.models`). */
export type InstaboxTemplateModel = {
	/** The model's Macs take no new leases: a create or start succeeds only on a Mac its org still leases. */
	closed?: boolean | null;
	/** The size a create of this model gets when it names none. */
	defaultSpec?: InstaboxMachineSpec | null;
	/** The model's name for people. */
	label?: string | null;
	/** As `Template.minimumLease`, for this model's Macs. */
	minimumLease?: InstaboxMinimumLease | null;
	/** What `model` names on create. */
	name?: string | null;
	/** The host pool of the model's Macs. */
	pool?: string | null;
	/** The sizes the site keeps booted ahead of creates on this model's Macs. */
	prebootSpecs?: Array<InstaboxMachineSpec> | null;
	/** The model's sizes besides `defaultSpec`; a create names one with `vcpus` and `memMiB`. */
	sizes?: Array<InstaboxMachineSpec> | null;
};

export type InstaboxTemplateRef = {
	digest?: string | null;
	id?: string | null;
	/** The guest kernel the sandbox is pinned to, `sha256:<hex>`; absent: the host's default. */
	kernel?: string | null;
	version?: string | null;
};

export type InstaboxTopUp = {
	amountUSD?: number | null;
	createdAt?: string | null;
	/** The credit grant a paid top-up became. */
	creditId?: string | null;
	id?: string | null;
	method?: string | null;
	paidAt?: string | null;
	status?: string | null;
	taxUSD?: number | null;
	totalUSD?: number | null;
};

export type InstaboxTopUpOptions = {
	card?: {
		brand?: string | null;
		last4?: string | null;
	} | null;
	creditsUSD?: number | null;
	maxUSD?: number | null;
	minUSD?: number | null;
};

export type InstaboxTopUpResponse = {
	creditsUSD?: number | null;
	topUp?: InstaboxTopUp | null;
	/** The Stripe Checkout page (newCard). */
	url?: string | null;
};

/** The twin sandbox of a half-size macOS create and its create operation (`Operation.twin`). */
export type InstaboxTwinCreate = {
	machineId?: string | null;
	name?: string | null;
	operationId?: string | null;
};

export type InstaboxUploadURL = {
	expiresAt?: string | null;
	/** The largest body the URL takes (5 GiB). */
	maxBytes?: number | null;
	method?: string | null;
	path?: string | null;
	/** PUT the file's raw bytes here; it carries its own credential. */
	url?: string | null;
};

export type InstaboxUsage = {
	/** The `/data` of all your live sandboxes, in GiB, read live: what `limits.maxStoredGiB` is checked against and what storage is billed on. Absent from older servers. */
	allocatedDiskGiB?: number | null;
	/** When the byte figures (`logicalBytes`, `storedBytes`, `storage`) were last computed. They are no longer updated: the scheduled measurement is off, so they are the last ones computed and may be stale, including nonzero for an org that has deleted everything since. An org never measured that… */
	computedAt?: string | null;
	/** This calendar month's (UTC) cost in USD as the hourly rating priced it (`costUSD`, with `runtimeUSD`, `storageUSD` and `egressUSD`), up to `ratedUntil`; the allowance (`allowanceUSD`, `creditRemainingUSD`, `overageUSD`) and the credit balance (`creditsUSD`, `creditsExpireAt`). The same figures… */
	cost?: InstaboxOrgUsage | null;
	/** No longer computed: always 0. (Was the part of storedBytes no other org shares.) */
	exclusiveBytes?: number | null;
	/** Deprecated: `snapshots` (same value). */
	images?: number | null;
	limits?: InstaboxUsageLimits | null;
	/** Full size of your sandboxes and snapshots, as of `computedAt` (no longer updated). */
	logicalBytes?: number | null;
	/** Your sandboxes, in any state. */
	machines?: number | null;
	/** The org these figures and limits describe: your personal org by default, a workspace key's workspace, or the one named with `org`. Absent from older servers. */
	org?: InstaboxOrgRef | null;
	/** Your snapshots. */
	snapshots?: number | null;
	/** storedBytes by sandbox, from the same measurement (no longer updated). Absent for an org never measured, and from older servers. */
	storage?: InstaboxUsageStorage | null;
	/** What they take up once compressed, with shared data counted once and the templates' own content (an unchanged root filesystem) not counted, as of `computedAt`. No longer updated: the limit and billing count `allocatedDiskGiB`. */
	storedBytes?: number | null;
};

/** Your limits. An admin may change maxMachines per user. */
export type InstaboxUsageLimits = {
	/** Snapshots of running sandboxes are allowed (some may still be refused until the server is fully updated). Absent: they are not. */
	liveSnapshots?: boolean | null;
	/** The default size, what a create naming no size gets (4 vCPUs, 8 GiB memory by default; no rootDiskGiB: the template's). Absent from servers before fixed sizes. */
	machineSpec?: InstaboxMachineSpec | null;
	/** Every size your new sandboxes may have in your personal org, as `GET /v1/me` `allowedSpecs`: machineSpec first, then its plan's others (Pro: 2/4, 4/8, 8/16; Builder: 2/4 up to 16/32; Team and Enterprise: 2/4 up to 32/64) and any size an admin granted it. Pick one by naming its vcpus and memMiB… */
	machineSpecs?: Array<InstaboxMachineSpec> | null;
	/** Deprecated: `maxSnapshots` (same value). */
	maxImages?: number | null;
	/** Sandboxes in any state, checked on create (default 1). 0 with maxMachines in `unlimited`: no limit (a paid plan without one); 0 otherwise: none allowed. There are no vCPU or memory quotas. */
	maxMachines?: number | null;
	/** Saved snapshots. 0: no limit (listed in `unlimited`). */
	maxSnapshots?: number | null;
	/** Stored data limit (default 200), checked against allocatedDiskGiB when you create a sandbox or snapshot. 0: no limit (listed in `unlimited`). */
	maxStoredGiB?: number | null;
	/** Org Secret APIs are available alongside the per-user Vault. Absent or false: use Vault. */
	orgSecrets?: boolean | null;
	/** The count limits above that do not apply. Each is still sent as 0 for older clients, but means no limit, not none allowed; a 0 not listed is a real 0 (a free org's maxMachines 0: no free sandboxes). Always an array from current servers (empty when every limit applies); absent or null from older… */
	unlimited?: Array<string> | null;
	/** Vault limits per user; also used for org Secret quotas when orgSecrets is true. */
	vault?: InstaboxVaultLimits | null;
};

export type InstaboxUsageMachineStorage = {
	/** Its saved disks' share of storedBytes: `/data` and what was written on the root filesystem (0 until its disks are first saved, on stop, pause or snapshot). */
	diskBytes?: number | null;
	id?: string | null;
	name?: string | null;
	/** Size of its storage (`/data`). */
	sizeBytes?: number | null;
	/** Their share. */
	snapshotBytes?: number | null;
	/** Its snapshots. */
	snapshots?: number | null;
	state?: string | null;
};

/** storedBytes by sandbox, from the same measurement. Data that several of your sandboxes and snapshots share is split evenly between them, so the figures sum to storedBytes. */
export type InstaboxUsageStorage = {
	/** Their share of storedBytes. */
	deletedMachineSnapshotBytes?: number | null;
	/** Snapshots whose sandbox is deleted. */
	deletedMachineSnapshots?: number | null;
	/** Your sandboxes. */
	machines?: Array<InstaboxUsageMachineStorage> | null;
};

/** One write of the Vault into a machine. */
export type InstaboxVaultApplied = {
	at?: string | null;
	/** The variables exported. */
	env?: Array<string> | null;
	/** Why the write failed, when it did. */
	error?: string | null;
	/** The files written (or, when the write failed, those of the last write, kept for the next reconciliation). */
	files?: Array<InstaboxVaultFile> | null;
	/** Files that no longer apply but were left (changed in the machine since, or not writable). */
	kept?: Array<InstaboxVaultKept> | null;
	/** Files of an earlier write removed because they no longer apply. */
	removed?: Array<string> | null;
};

export type InstaboxVaultFile = {
	path?: string | null;
	/** Hex sha256 of the content written. */
	sha256?: string | null;
};

/** Per-user Vault metadata (docs/vault.md). Values are absent from lists. */
export type InstaboxVaultItem = {
	createdAt?: string | null;
	/** `vi_…` */
	id?: string | null;
	/** The item's sandbox delivery kind. */
	kind?: string | null;
	/** The caller's live machines the item applies to (selector matches, Vault not off). */
	machines?: number | null;
	/** Reason an item was retained for recovery. */
	migrationReason?: string | null;
	migrationState?: string | null;
	/** Unique per user. An env item's name is the variable's name. */
	name?: string | null;
	/** File items: the target, relative to the home directory. */
	path?: string | null;
	/** Historical labels; these do not control org Secret selection. */
	selector?: Record<string, string> | null;
	/** The value's size in bytes. */
	size?: number | null;
	updatedAt?: string | null;
};

export type InstaboxVaultItemList = {
	items?: Array<InstaboxVaultItem> | null;
};

export type InstaboxVaultKept = {
	path?: string | null;
	reason?: string | null;
};

export type InstaboxVaultLimits = {
	/** Raw bytes of all Secret values per org (server default 262144). */
	maxBytes?: number | null;
	/** Secrets per org (server default 100). */
	maxItems?: number | null;
};

/** An org's webhook endpoint. */
export type InstaboxWebhook = {
	createdAt?: string | null;
	description?: string | null;
	/** Why the server disabled it: every attempt failed for 5 days. Absent when an admin did, or it is enabled. */
	disabledReason?: string | null;
	enabled?: boolean | null;
	events?: Array<InstaboxWebhookEventType> | null;
	/** The first failed attempt since the last success. */
	failingSince?: string | null;
	id?: string | null;
	orgId?: string | null;
	/** The signing secret (`whsec_` + base64 key), only in the responses of create and rotate. */
	secret?: string | null;
	updatedAt?: string | null;
	url?: string | null;
};

export type InstaboxWebhookAttempt = {
	at?: string | null;
	attempt?: number | null;
	durationMs?: number | null;
	error?: string | null;
	/** The first KiB of the response body. */
	response?: string | null;
	/** The response status; absent when there was no response. */
	status?: number | null;
};

export type InstaboxWebhookDelivery = {
	attemptLog?: Array<InstaboxWebhookAttempt> | null;
	attempts?: number | null;
	createdAt?: string | null;
	eventId?: string | null;
	eventType?: string | null;
	id?: string | null;
	lastAttemptAt?: string | null;
	lastError?: string | null;
	lastStatus?: number | null;
	/** Pending only. */
	nextAttemptAt?: string | null;
	payload?: InstaboxWebhookEvent | null;
	/** Whether POST .../retry would queue this delivery now: false while it is pending, and once its event is too old to retry (409 operation_conflict otherwise). */
	retryable?: boolean | null;
	state?: string | null;
};

export type InstaboxWebhookDeliveryList = {
	items?: Array<InstaboxWebhookDelivery> | null;
	nextCursor?: string | null;
};

/** The body of every webhook request. Requests are signed per Standard Webhooks: `webhook-id` (the event ID: deduplicate on it), `webhook-timestamp` (Unix seconds) and `webhook-signature` (`v1,<base64 HMAC-SHA256 of "<id>.<timestamp>.<body>">`, space separated when two secrets sign). */
export type InstaboxWebhookEvent = {
	createdAt?: string | null;
	/** sandbox.*: `sandbox` {id, name, metadata}, `previousState`, `state`, `reason` (user, idle, archive, wake, admin, system, ...), `operationId`, and on sandbox.error `error`. snapshot.*: `snapshot` {id, name, description, sourceSandboxId, status}, and on snapshot.failed `error`. */
	data?: Record<string, InstaboxJsonValue> | null;
	id?: string | null;
	orgId?: string | null;
	/** A WebhookEventType, or webhook.test. */
	type?: string | null;
};

export type InstaboxWebhookEventType = string;

export type InstaboxWebhookList = {
	eventTypes?: Array<InstaboxWebhookEventType> | null;
	items?: Array<InstaboxWebhook> | null;
	/** How many endpoints the org may have (default 10). */
	maxEndpoints?: number | null;
};

export type InstaboxOperationInputs = {
	'exports.download': {
		id: string;
	};
	'exports.get': {
		id: string;
	};
	'feedback.send': {
		area?: string;
		client_version?: string;
		command?: string;
		component:
			| 'cli'
			| 'api'
			| 'sandbox'
			| 'dashboard'
			| 'skills'
			| 'docs'
			| 'other';
		detail: string;
		doc_ref?: string;
		error?: string;
		expected?: string;
		os?: string;
		sandbox?: string;
		severity?: 'blocker' | 'major' | 'minor';
		title: string;
		type: 'bug' | 'feature-request' | 'friction' | 'other';
		workaround?: string;
	};
	'gpuQueue.cancel': {
		/** The entry's ID (`gq_...`). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
	};
	'gpuQueue.list': {
		/** The org whose entries to list. */
		orgId?: string;
		/** Only the entries in this state. */
		state?:
			| 'queued'
			| 'dispatched'
			| 'placed'
			| 'expired'
			| 'cancelled'
			| 'failed';
		/** Page size (1-200, default 50). */
		limit?: number;
		/** Opaque `nextCursor` from a previous page. */
		cursor?: string;
	};
	'keys.create': {
		/** Days until the key expires, 1-365. 0 or absent: it does not expire. */
		expiresInDays?: number;
		name: string;
		scopes: Array<InstaboxAPIKeyScopeInput>;
	};
	'keys.list': Record<string, never>;
	'keys.revoke': {
		id: string;
	};
	'machines.activityLeases.release': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Caller-chosen task identifier. Reusing it renews the same lease. */
		leaseID: string;
	};
	'machines.activityLeases.renew': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Caller-chosen task identifier. Reusing it renews the same lease. */
		leaseID: string;
		/** 30-3600 seconds; 0 or absent uses 300. */
		ttlSeconds?: number;
	};
	'machines.claimOomKill': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** The sandbox boot the job ran in (/proc/sys/kernel/random/boot_id): only that boot's kills are returned, since session scope names repeat after a restart. */
		bootId: string;
		/** A background job's cgroup in the sandbox: a session scope such as /user.slice/user-1000.slice/session-3.scope. */
		cgroup: string;
	};
	'machines.connectionInfo': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.create': {
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** Accepts the Mac lease of a macOS sandbox (the template's `minimumLease`, `GET /v1/templates`): a whole Mac for the org for at least 24 hours, billed whatever the sandbox does. Required to create one: without it the create is `400 minimum_lease_required` and nothing is placed. */
		acceptMinimumLease?: boolean;
		/** Sets `archiveAt` to now plus this many seconds: the sandbox is stopped then if it is running. 0 or absent: none. */
		archiveSeconds?: number;
		autoSuspendAfterSeconds?: InstaboxAutoSuspendAfterSecondsInput;
		/** Sets `deleteAt` to now plus this many seconds (60-86400, else 400): the sandbox is then deleted, whatever its state, so it cannot outlive a client that died (`instabox run` sets it). 0 or absent: never. A server without this field ignores it. */
		deleteAfterSeconds?: number;
		/** Default: running. */
		desiredState?: 'running' | 'stopped';
		/** Direct (delivery env) Secrets from this org, each as a variable and/or a home file. Real values enter the sandbox; prefer proxy Secrets for HTTPS API keys. A fork that sends none of secrets, envSecrets and directSecrets copies its source's selection. */
		directSecrets?: Array<InstaboxDirectSecretInput>;
		/** Environment variables for the whole sandbox: every login shell exports them (exec, SSH, the terminal and what they start), from the first command on and again after each start and resume. Names match `^[A-Za-z_][A-Za-z0-9_]{0,127}$`; `BASH_ENV`, `ENV`, `HOME`, `HOSTNAME`, `IFS`, `LOGNAME`,… */
		env?: Record<string, string>;
		/** Explicit env Secret names from this org; omitted or [] selects none. No all mode; null is rejected. Real values enter the sandbox. Shorthand for directSecrets entries with env = the Secret's name; not sent together with directSecrets. */
		envSecrets?: Array<InstaboxSecretNameInput>;
		/** When no host has room for the sandbox right now, refuse the create at once with `503 no_capacity` (`retryable`; nothing is created, there is no operation and the `Idempotency-Key` is not kept) instead of answering 202 with an operation that then fails with `no_capacity`. Every other check and… */
		failFast?: boolean;
		/** GPUs for the sandbox: `TYPE` (one GPU) or `TYPE:COUNT`, such as `l4` or `l4:2`, a type of the GPU template's `gpuTypes` (`GET /v1/templates`). GPU sandboxes are for paid plans: a free org's create is `403 template_not_allowed`. The count is one of the type's `counts`: the powers of two up to its… */
		gpu?: string;
		/** The sandbox's Linux user (`Machine.guestUser`), so `ssh <sandbox>` over your own network (Tailscale) logs in as the same name as on your computer. Lowercase letters, digits, `_` and `-`, starting with a letter or `_`, at most 32 characters; reserved names (`root`, `instabox`, the Debian base… */
		guestUser?: string;
		/** Deprecated: `snapshotId` under its old name (both: they must be equal). The reply carries a `Deprecation` header. */
		imageId?: string;
		maxRunMinutes?: InstaboxMaxRunMinutesInput;
		/** Like vcpus: the memory (MiB) of one of your sizes, such as 8192 with vcpus 4; 0 or a negative is `400 bad_request`. */
		memMiB?: number;
		metadata?: InstaboxMetadataInput;
		/** The Mac model of a macOS template with `models`, by its `name`: the sandbox runs on that model's Macs, at one of that model's sizes. Absent: the template's `pool`, or its first open model when that pool's model is `closed`. With `snapshotId`: the model to run the snapshot on, at that model's… */
		model?: string;
		/** 1-63 lowercase letters, digits or `-`, starting with a letter or digit; unique among the org's sandboxes. Absent or empty: `box-` and 8 random hex digits (the operation's `machineId` and the sandbox carry it). */
		name?: string;
		/** Limits where the sandbox may connect to, from its first boot. Absent: no limit. A sandbox from a snapshot takes only its own. Linux sandboxes only: a GPU, macOS or Windows sandbox is refused (400). While no host can apply a policy the create is refused (`503 host_unavailable`) and nothing is… */
		networkPolicy?: InstaboxNetworkPolicyInput;
		/** The org the sandbox counts against and is shared with (`GET /v1/orgs`); you must be a member. Absent: your personal org, or with `snapshotId` the snapshot's org (a sandbox from a snapshot lives in the snapshot's org; another is `400 bad_request`). Secret selections always resolve within this… */
		orgId?: string;
		/** Storage (`/data`) size in GiB. The disks come with the size: storage gets the size's (20 GiB on api.instabox.sh), or a snapshot's storage size when that is larger. Absent or exactly that size: accepted; any other is `400 spec_not_allowed` whose message names the size's storage next to what was… */
		persistentDiskGiB?: number;
		/** Admins only: the host pool to place the sandbox in and no other (docs/hybrid-pools.md), "default" included. With snapshotId it must be the snapshot's pool. Absent: the user's pool assignment, else the server's placement.createPools. */
		pool?: string;
		/** Wait for a GPU instead of failing with `no_capacity` (a create with `gpu`, or from a GPU snapshot; not with `failFast`, else `400 bad_request`). The answer is the usual 202 operation. When a GPU of the type is free the sandbox is placed as without `queue`; when none is, or the type already has… */
		queue?: InstaboxQueueRequestInput;
		/** System files size in GiB. Like persistentDiskGiB: system files get the template's size (or the snapshot's); naming any other is `400 spec_not_allowed` (the message names the size's root disk), 0 or a negative `400 bad_request`; grow it later with `PATCH /v1/machines/{id}`. */
		rootDiskGiB?: number;
		/** Proxy Secrets from this org. All includes current and future proxy Secrets; [] selects none. Omit both secrets and envSecrets to retain only existing Vault delivery. When envSecrets alone is supplied, proxy selection defaults to all; directSecrets alone selects no proxy Secrets. Null is rejected. */
		secrets?: InstaboxSecretSelectionInput;
		/** Create from this snapshot of yours: its system files and storage (empty storage for a system-files-only snapshot). */
		snapshotId?: string;
		/** The template to create from (`GET /v1/templates`, one with `creatable` true), optionally with a version as `id@version` (e.g. `agent-browser@2026-10-15.4`, the same as `templateVersion`). Absent (and no `snapshotId` or `templateVersion`): agent-browser. An unknown or retired one is refused with… */
		templateId?: string;
		/** Default: the version `GET /v1/templates` marks `latest`. `templateId` may name it instead, as `id@version` (e.g. `agent-browser@2026-10-15.4`); both at once must agree. A version the template does not have is `400 bad_request` whose message lists its versions, newest first, the `latest` (or… */
		templateVersion?: string;
		/** False disables legacy Vault delivery. Org Secret selections are independent. */
		vault?: boolean;
		/** Absent: the default size (4 vCPUs, 8 GiB memory; `limits.machineSpec`). From a snapshot with `sizeLocked` (not of a GPU sandbox): the vCPUs and memory of the sandbox it was saved from (the snapshot's `defaultSpec`), absent or named; any other is `400 spec_not_allowed` stating the snapshot's… */
		vcpus?: number;
	};
	'machines.createAccess': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		kind: 'terminal' | 'vnc';
		/** Issue a ticket even when routing points to the combined API, for reconnecting an existing access watch. */
		requireTicket?: boolean;
		/** Optional access origin for pre-cutover validation. Requires an administrator sign-in (API keys cannot use it). Only this response targets that origin; global routing is unchanged. */
		webUrl?: string;
	};
	'machines.createSnapshot': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		description?: string;
		/** Saved to fork its source (`instabox fork`, when the native fork cannot run). For a free source, the server records its max-run window as activity extended it, and a sandbox the same user creates from this snapshot in the next 30 minutes starts with that window, as a native fork does. Names no… */
		forFork?: boolean;
		/** Unique among the workspace's snapshots; 1-128 letters, digits, '.', '_' or '-', starting with a letter or digit and not with sn_ or im_. */
		name: string;
		/** Save the system files only, not the storage (`/data`). */
		rootOnly?: boolean;
	};
	'machines.delete': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** X-Confirm-Delete header: the ID or exact name of what is deleted. Left out, the plugin sends the id from the path. */
		confirm_delete?: string;
		/** `true` deletes a macOS sandbox at once inside its Mac lease's minimum, which is still billed. Without it such a delete is scheduled for the minimum's end (the sandbox's `deleteAt`, the operation's `scheduledAt`). No effect on other sandboxes. */
		now?: boolean;
	};
	'machines.desktop.createLink': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** How long the link opens the desktop. */
		ttlSeconds?: number;
		/** The link only shows the desktop; the server drops the viewer's input. */
		viewOnly?: boolean;
	};
	'machines.desktop.get': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		action?: 'status' | 'install' | 'start' | 'takeover' | 'handback';
		/** Screen height in pixels for start, 600-1600 (default 800). */
		height?: number;
		/** Screen width in pixels for start, 800-2560 (default 1280). */
		width?: number;
	};
	'machines.desktop.revokeLinks': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.disk': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.exec': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
		/** The program and its arguments, run with no shell: each element reaches the program exactly as sent (no expansion of `$`, `*` or `~`, no word splitting, quotes or redirections; `""` is an empty argument). `argv[0]` must not be empty and is looked up on the login profile's `PATH`; the login… */
		argv?: Array<string>;
		/** Shell command, run with `bash -lc`. At most 64 KiB, no NUL bytes. Set this or `argv`; an empty `cmd` is no `cmd`. */
		cmd?: string;
		/** Working directory (default HOME, `/data/home`). */
		cwd?: string;
		/** Environment variables exported before the command (after the login profile). Names match `^[A-Za-z_][A-Za-z0-9_]*$`. */
		envs?: Record<string, string>;
		/** How the command appears in the sandbox's history instead of `cmd` or `argv`, for a wrapper that runs something else (the CLI's `exec --background`). Cut at 4096 bytes like them; no NUL bytes. */
		historyCommand?: string;
		/** Leave the command out of the sandbox's history (`GET /v1/machines/{id}/history`): for a client's own housekeeping commands, such as the CLI's job polls. Does not go with `historyCommand`. */
		noHistory?: boolean;
		/** Direct (delivery env) Secrets of the sandbox's org exported for this command only: variable name -> Secret name. Resolved at exec time, never stored or written into the sandbox; each use is audited by name. A name may not also be in `envs`; reserved variables are refused. A proxy or missing… */
		secretEnvs?: Record<string, InstaboxSecretNameInput>;
		/** Text fed to the command, then EOF. It is a JSON string, so the command reads its UTF-8 bytes: NUL, CR and LF arrive unchanged (escaped as `\u0000`, `\r`, `\n`). At most 1 MiB (1048576 bytes) of UTF-8, counted in bytes, not characters (`é` is 2): more is `400 bad_request` `stdin is longer than… */
		stdin?: string;
		/** Default 60, max 600. */
		timeoutSeconds?: number;
	};
	'machines.files.createUploadUrl': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Lifetime; default 900. */
		expiresInSeconds?: number;
		/** Octal permissions, for example 0755 (default an existing file's, else 0644). */
		mode?: string;
		/** Create missing parent directories. */
		parents?: boolean;
		/** Absolute path of the file to write. */
		path: string;
	};
	'machines.files.download': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Absolute path of the file, at most 4096 bytes. */
		path: string;
		/** Range header, such as bytes=0-1048575, to download part of the file. */
		range?: string;
		/** If-Range header: the ETag of the earlier part, so a changed file comes back whole. */
		if_range?: string;
	};
	'machines.files.read': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Absolute path, at most 4096 bytes (default "/"). */
		path?: string;
	};
	'machines.files.write': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Absolute path of the file, at most 4096 bytes; not ending in "/". */
		path: string;
		/** Octal permissions, for example 0755 (default an existing file's, else 0644). */
		mode?: string;
		/** Create missing parent directories (mkdir -p). */
		parents?: boolean;
		/** An upload URL's signed token; replaces the credential. */
		token?: string;
		/** The file content: UTF-8 text, or base64 when encoding is base64. */
		content: string;
		/** How content is written: 'utf8' (default) or 'base64' for binary data. */
		encoding?: 'utf8' | 'base64';
	};
	'machines.fork': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** As in CreateMachineRequest: required to fork a macOS sandbox (`400 minimum_lease_required` without it). */
		acceptMinimumLease?: boolean;
		/** As in CreateMachineRequest. Absent: the source's (0, off, when it has none), checked against the plan as a create's. */
		autoSuspendAfterSeconds?: number;
		/** As in CreateMachineRequest (60-86400). Absent or 0: the source's delete deadline, the same instant (none if the source has none); a source due within 60 seconds is then refused with 400. */
		deleteAfterSeconds?: number;
		/** As in CreateMachineRequest; alone, it selects no proxy Secrets. */
		directSecrets?: Array<InstaboxDirectSecretInput>;
		/** As in CreateMachineRequest. */
		envSecrets?: Array<InstaboxSecretNameInput>;
		/** As in CreateMachineRequest. Absent: the source's (the plan default when it has none), checked as a create's. */
		maxRunMinutes?: number;
		memMiB?: number;
		/** Labels added to the source's (a key here replaces the source's), at most 31 keys here and 32 in all (`instabox-fork-of` is set to the source's ID). Absent: the source's labels. */
		metadata?: Record<string, string>;
		/** The new sandbox's name (as in CreateMachineRequest). Absent: `<source>-fork-` and 4 random hex digits. */
		name?: string;
		/** As in CreateMachineRequest. Absent: the source's policy; `outbound: open` gives a fork without one. Only where the server offers network policies: elsewhere this field is unknown (`400 unknown_field`). */
		networkPolicy?: InstaboxNetworkPolicyInput;
		/** The fork's own proxy selection, as in CreateMachineRequest. Absent together with envSecrets and directSecrets: the source's selection is copied. */
		secrets?: InstaboxSecretSelectionInput;
		/** With `memMiB`, one of the org's sizes, or of the template's `defaultSpec` and `sizes` when it has a `pool`. Absent: the source's size. */
		vcpus?: number;
	};
	'machines.get': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
	};
	'machines.history.get': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
		/** A command ID (`ex_…`) from the history, or `latest` for the newest command. */
		execId: string;
	};
	'machines.history.list': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
		/** Default 50. */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'machines.list': {
		/** Opaque `nextCursor` from a previous page. */
		cursor?: string;
		/** Page size. */
		limit?: number;
		/** `key:value` (split at the first `:`); only sandboxes whose metadata has the key with exactly that value. Repeatable; all terms must match (AND). */
		metadata?: Array<string>;
	};
	'machines.logs': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Lines of console output to return (default 200, at most 5000), fewer when the lines are long (see `consoleTruncated`). Ignored with `after`. */
		tail?: number;
		/** A `cursor` from a previous response: return only the console output written since (up to 1 MiB). */
		after?: number;
	};
	'machines.metrics': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** RFC 3339 time, in the last 24 hours. */
		since?: string;
	};
	'machines.ports.create': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Omitted: the current access, or public for a new port. Changing it ends the old publication's connections. `private` is for `http` ports only. */
		access?: 'public' | 'private';
		/** Omitted: the current name, or "Port N" for a new port. */
		name?: string;
		/** Desktop port 5901 and Orca port 6768 (plus the configured Orca port) are reserved. */
		port: number;
		/** Omitted: the current protocol, or `http` for a new port. `tcp` publishes a raw TCP service behind TLS when the server enables it (403 otherwise; admins only while in preview); paid plans only, at most 5 per org by default (429). A port already published with the other protocol answers 409 until… */
		protocol?: 'http' | 'tcp';
		/** With a private port: a new token, returned in the response; connections that used the old one close. 400 for a public port. */
		rotateToken?: boolean;
	};
	'machines.ports.delete': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		port: number;
	};
	'machines.ports.installAgent': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.ports.list': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.processes': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
		/** Also list kernel threads and the listing's own processes. */
		all?: boolean;
	};
	'machines.restore': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** As in StartMachineRequest: required when the restore boots a macOS sandbox whose Mac lease ended. */
		acceptMinimumLease?: boolean;
		/** `running` (default) boots the restored disks; `stopped` leaves the sandbox stopped with them. */
		desiredState?: 'running' | 'stopped';
		/** The snapshot whose disks the sandbox gets (`sn_...`, or an older `im_...` ID). Absent: the snapshot the sandbox was created from; a sandbox created from a template needs it (`400`). */
		snapshotId?: string;
		/** For a running sandbox: how long to wait for a clean shutdown before it is forced off (0-600; 0: the server default), as for stop. */
		timeoutSeconds?: number;
	};
	'machines.resume': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** False disables legacy Vault delivery without changing org Secret selections. */
		vault?: boolean;
	};
	'machines.secrets.get': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
	};
	'machines.secrets.refresh': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
	};
	'machines.secrets.update': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
		/** Replaces the direct references in full; [] clears. Not sent together with envSecrets. Null is rejected. */
		directSecrets?: Array<InstaboxDirectSecretInput>;
		/** Explicit env names; [] clears. Omission keeps the prior list. Null and all are rejected. */
		envSecrets?: Array<InstaboxSecretNameInput>;
		secrets?: InstaboxSecretSelectionInput;
	};
	'machines.ssh.createToken': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Optional display name; whitespace is trimmed, at most 100 UTF-8 bytes. Existing callers may omit it. */
		name?: string;
		/** A token that works until it is revoked: the reply has no `expiresAt`. Does not go with `ttlSeconds`. */
		noExpiry?: boolean;
		/** Default 604800 (7 days), max 2592000 (30 days). */
		ttlSeconds?: number;
	};
	'machines.ssh.issueCertificate': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** Client public key in authorized_keys format. */
		publicKey: string;
		/** Default 3600, max 86400. */
		ttlSeconds?: number;
	};
	'machines.ssh.listTokens': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.ssh.revokeAllTokens': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'machines.ssh.revokeToken': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		tokenID: string;
	};
	'machines.start': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** As in CreateMachineRequest: required when the start of a macOS sandbox may open a Mac lease (its org's lease of its Mac ended); `400 minimum_lease_required` without it. */
		acceptMinimumLease?: boolean;
		/** Admin only: place the sandbox on this host. While `storage.synced` is false the sandbox can only start on its current host; another host gets `409 operation_conflict`. */
		host?: string;
		/** New memory (MiB) of the stopped sandbox, as `vcpus`; absent: its current size. */
		memMiB?: number;
		/** For a stopped GPU sandbox: wait for a GPU instead of failing with `no_capacity`, as `CreateMachineRequest.queue`. With none free (or requests of the type already waiting) the operation ends `succeeded`, the sandbox `stopped` with `queue` set; if none frees up by `expiresAt` it stays `stopped`… */
		queue?: InstaboxQueueRequestInput;
		/** Boot a stopped sandbox without running its data-init.d hooks (`/usr/local/lib/instabox/data-init.d`, the template's and your own), so a hook that blocks the boot can be fixed from inside. Everything else of the boot runs; the next start runs the hooks again. A running sandbox is `409… */
		rescue?: boolean;
		/** False disables legacy Vault delivery without changing org Secret selections. */
		vault?: boolean;
		/** Start a stopped paid sandbox at another of the workspace's `allowedSpecs`, as `PATCH` `vcpus`/`memMiB` then `start` would: with `memMiB`, one of them (alone: the one size with that many vCPUs). Absent: its current size. The size is stored before the start and the boot asks for it; read it from… */
		vcpus?: number;
	};
	'machines.stop': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** Stops a macOS sandbox at once inside its Mac lease's minimum, which is still billed. Without it such a stop is scheduled for the minimum's end (the operation's `scheduledAt`). The query `?now=true` does the same, and is how a delete asks for it. */
		now?: boolean;
		/** How long to wait for a clean shutdown before the sandbox is forced off. */
		timeoutSeconds?: number;
	};
	'machines.suspend': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
	};
	'machines.update': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** `restart`: a running or paused sandbox whose change needs a stop is stopped, resized and started again by one `resize` operation (`202`); see the operation. Absent: such a change is `409`. Anything else is `400 bad_request`. */
		apply?: 'restart';
		/** The plan's rule (`AutoSuspendAfterSeconds`): a paid sandbox takes 300-1800 in whole minutes, as sent, or 0 (off) where the plan allows always on; below 300, above 1800 or not a multiple of 60 is `400 bad_request`; the free sandbox takes only 1800 (else `403 spec_not_allowed`), and 0 without… */
		autoSuspendAfterSeconds?: number;
		/** `true` clears a stop or delete scheduled for the end of a macOS sandbox's Mac lease minimum (`archiveAt` and `deleteAt`). */
		cancelScheduled?: boolean;
		maxRunMinutes?: InstaboxMaxRunMinutesInput;
		/** New memory (MiB) of a stopped paid sandbox, as `vcpus`; 0 or absent: unchanged. */
		memMiB?: number;
		/** Replaces the metadata (same limits as `Metadata`); {} clears it; null or absent: unchanged. */
		metadata?: Record<string, string> | null;
		/** New name, unique among the org's live sandboxes; 1-63 of a-z, 0-9, '-', starting with a letter or digit. Absent: unchanged. */
		name?: string;
		/** Replaces the sandbox's outbound network policy as a whole, in any state; `outbound: open` removes it; absent: unchanged. A running or paused sandbox takes it at once, without a restart: the reply comes after its host has it, and connections the new policy does not allow are closed. A refusal… */
		networkPolicy?: InstaboxNetworkPolicyInput;
		/** New disk (`/data`) size in GiB, 1-1024, up to the plan's `maxDiskGiB`; 0 or absent: unchanged. Grow: a running box grows online (no restart, processes keep running); if it can't (rare: the box is unreachable or its host is older), `409 grow_needs_stop` (stop it and send the size again); a… */
		persistentDiskGiB?: number;
		/** Admins only: new root filesystem size in GiB (the template sizes it). From anyone else it is `400 spec_not_allowed`; grow the disk with `persistentDiskGiB`. */
		rootDiskGiB?: number;
		/** False disables legacy Vault delivery; true cannot re-enable the legacy flag; absent is unchanged. Org Secret selections are independent. */
		vault?: boolean;
		/** New vCPUs of a stopped paid sandbox: with `memMiB`, one of the workspace's `allowedSpecs`, or of its template's `defaultSpec` and `sizes` when the template has a `pool` (alone: the one size with that many vCPUs); 0 or absent: unchanged. Applied at its next start (see the operation). Running is… */
		vcpus?: number;
	};
	'machines.usage': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
		from?: string;
		to?: string;
	};
	'machines.vault.get': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
	};
	'machines.vault.write': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters) or the sandbox's name (unique among your sandboxes; names never contain `_`, so the two never collide). Older servers take only the ID and answer `404` for a name. */
		id: string;
	};
	'machines.wake': {
		/** Sandbox ID (`m_` + 26 lowercase base32 characters). */
		id: string;
	};
	'me.discord.get': Record<string, never>;
	'me.discord.unlink': Record<string, never>;
	'me.get': Record<string, never>;
	'operations.get': {
		/** Operation ID (`op_…`). */
		id: string;
		/** Long-poll for up to this long: a duration such as `25s` or `500ms`, or whole seconds (`25`). Capped at 30s; absent or `0` answers at once. */
		wait?: string;
	};
	'orgs.billing.cancelSubscription': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.billing.changePlan': {
		/** Org ID (org_...). */
		id: string;
		tier: 'pro' | 'builder' | 'team';
	};
	'orgs.billing.checkout': {
		/** Org ID (org_...). */
		id: string;
		/** The tier to subscribe to; absent: a disabled workspace's own, or on a free workspace a card to save. */
		tier?: 'pro' | 'builder' | 'team';
	};
	'orgs.billing.getTopup': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.billing.movePersonal': {
		/** Workspace ID (org_...) to move into. */
		id: string;
		/** Report what would happen; change nothing. */
		dryRun?: boolean;
	};
	'orgs.billing.portal': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.billing.resumeSubscription': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.billing.subscribeWithCredits': {
		/** Org ID (org_...). */
		id: string;
		tier: 'pro' | 'builder' | 'team';
	};
	'orgs.billing.topup': {
		/** Org ID (org_...). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** The credits, whole USD, before tax. */
		amountUSD: number;
		/** Pay with another card in Stripe Checkout instead of the card on file. */
		newCard?: boolean;
	};
	'orgs.billing.update': {
		/** Org ID (org_...). */
		id: string;
		/** What a create past the plan's included starts does: `fail` (refused, the default) or `pay` (charged, once an owner or admin turns it on). */
		extraStarts?: 'pay' | 'fail';
		/** Whether to email when usage goes beyond what the month includes. */
		overageAlert?: boolean;
		/** The cap on this month's usage beyond the allowance; 0: nothing beyond it; -1: no cap. */
		spendCapUSD?: number;
		/** The usage alert's share of what the month includes; 0: off. */
		usageAlertPercent?: number;
	};
	'orgs.create': {
		name: string;
		tier: 'pro' | 'builder' | 'team';
	};
	'orgs.delete': {
		/** Org ID (org_...). */
		id: string;
		/** The workspace's name, exactly: the confirmation. */
		name: string;
	};
	'orgs.exports.create': {
		/** Organization ID. The caller must be a member. */
		id: string;
		machineId?: string;
		snapshotId?: string;
	};
	'orgs.exports.list': {
		/** Organization ID. The caller must be a member. */
		id: string;
	};
	'orgs.get': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.github.installations.delete': {
		/** Org ID (org_...). */
		id: string;
		/** GitHub's installation ID (the `id` of an install in the list above). */
		installationId: number;
	};
	'orgs.github.installations.list': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.github.jobs.get': {
		/** Org ID (org_...). */
		id: string;
		/** GitHub's job ID. */
		job: number;
	};
	'orgs.github.jobs.list': {
		/** Org ID (org_...). */
		id: string;
		/** The jobs of one state group: `running` (`starting` or `started`), `waiting`, `succeeded` (`completed` with conclusion `success`) or `failed` (`completed` with conclusion `failure` or `timed_out`, `refused` or `failed`; `cancelled` and `skipped` are not failures). */
		state?: 'all' | 'running' | 'waiting' | 'succeeded' | 'failed';
		/** Page size. */
		limit?: number;
		/** Only the jobs queued at or after this time (RFC 3339); `counts` follow it. */
		from?: string;
		/** Only the jobs queued before this time (RFC 3339), after `from`; `counts` follow it. */
		to?: string;
		/** Jobs of the group to skip. */
		offset?: number;
	};
	'orgs.github.stats': {
		/** Org ID (org_...). */
		id: string;
		/** The IANA time zone days are counted in, such as America/Los_Angeles. */
		tz?: string;
		/** Only jobs queued at or after this time (RFC 3339); needs step. */
		from?: string;
		/** Only jobs queued before this time (RFC 3339); after from, and needs step. */
		to?: string;
		/** Count the jobs in buckets of this many seconds from from (needed) to to or now, at most 1000 buckets; perDay is then empty. A day (86400) counts the days of tz from from's midnight, each a day also when the clocks change. Needed with from or to: without it the days are the last 7. */
		step?: number;
	};
	'orgs.inviteCode.get': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.inviteCode.regenerate': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.invites.create': {
		/** Org ID (org_...). */
		id: string;
		/** Whom to invite; only an account with this email can join with it. */
		email: string;
		/** The role the invitee joins with (default member). */
		role?: 'admin' | 'member';
	};
	'orgs.invites.list': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.invites.resend': {
		/** Org ID (org_...). */
		id: string;
		/** Invite ID (oi_...). */
		inviteId: string;
	};
	'orgs.invites.revoke': {
		/** Org ID (org_...). */
		id: string;
		/** Invite ID (oi_...). */
		inviteId: string;
	};
	'orgs.keys.create': {
		/** Org ID (org_...). */
		id: string;
		/** Days until the key expires, 1-365. 0 or absent: it does not expire. */
		expiresInDays?: number;
		name: string;
		/** `APIKeyScope`s, or in a workspace `workspace:admin` (also what absent means there). A personal org's key needs some. */
		scopes?: Array<string>;
	};
	'orgs.keys.list': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.keys.revoke': {
		/** Org ID (org_...). */
		id: string;
		keyId: string;
	};
	'orgs.list': Record<string, never>;
	'orgs.members.changeRole': {
		/** Org ID (org_...). */
		id: string;
		/** The member's user ID. */
		userId: number;
		role: 'admin' | 'member';
	};
	'orgs.members.list': {
		/** Org ID (org_...). */
		id: string;
	};
	'orgs.members.remove': {
		/** Org ID (org_...). */
		id: string;
		/** The member's user ID. */
		userId: number;
	};
	'orgs.movePersonal': {
		/** Report what would happen; change nothing. */
		dryRun?: boolean;
		/** The new workspace's name. */
		name: string;
		/** Optional: the personal plan's tier, which the workspace keeps. Another tier is refused. */
		tier?: 'pro' | 'builder' | 'team';
	};
	'orgs.redeemInvite': {
		code: string;
	};
	'orgs.secrets.delete': {
		/** Organization ID. */
		id: string;
		name: InstaboxSecretNameInput;
	};
	'orgs.secrets.import': {
		/** Organization ID. */
		id: string;
		delivery: InstaboxSecretDeliveryInput;
		hosts?: InstaboxSecretHostsInput;
		/** Names and values to replace atomically; omitted names stay unchanged. Null values are rejected. */
		values: Record<string, InstaboxSecretValueInput>;
	};
	'orgs.secrets.list': {
		/** Organization ID. The caller must be a member. */
		id: string;
	};
	'orgs.secrets.set': {
		/** Organization ID. */
		id: string;
		name: InstaboxSecretNameInput;
		delivery: InstaboxSecretDeliveryInput;
		hosts?: InstaboxSecretHostsInput;
		value: InstaboxSecretValueInput;
	};
	'orgs.update': {
		/** Org ID (org_...). */
		id: string;
		name: string;
	};
	'orgs.webhooks.create': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		description?: string;
		enabled?: boolean;
		events: Array<InstaboxWebhookEventTypeInput>;
		url: string;
	};
	'orgs.webhooks.delete': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
	};
	'orgs.webhooks.deliveries.list': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'orgs.webhooks.deliveries.retry': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
		deliveryId: string;
	};
	'orgs.webhooks.get': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
	};
	'orgs.webhooks.list': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
	};
	'orgs.webhooks.rotate': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
	};
	'orgs.webhooks.test': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
	};
	'orgs.webhooks.update': {
		/** Organization ID. The caller must be its owner or an admin. */
		id: string;
		webhookId: string;
		description?: string;
		enabled?: boolean;
		events?: Array<InstaboxWebhookEventTypeInput>;
		url?: string;
	};
	'ports.list': Record<string, never>;
	'sessions.list': Record<string, never>;
	'sessions.signOut': {
		id: string;
	};
	'snapshots.delete': {
		/** Snapshot ID (`sn_`, or `im_` for older snapshots, + 26 lowercase base32 characters). */
		id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** X-Confirm-Delete header: the ID or exact name of what is deleted. Left out, the plugin sends the id from the path. */
		confirm_delete?: string;
	};
	'snapshots.files.list': {
		/** Snapshot ID (`sn_`, or `im_` for older snapshots, + 26 lowercase base32 characters). */
		id: string;
		/** Absolute path, at most 4096 bytes (default "/"). */
		path?: string;
	};
	'snapshots.get': {
		/** Snapshot ID (`sn_`, or `im_` for older snapshots, + 26 lowercase base32 characters). */
		id: string;
	};
	'snapshots.list': Record<string, never>;
	'stats.get': Record<string, never>;
	'support.tickets.close': {
		id: string;
	};
	'support.tickets.get': {
		id: string;
	};
	'support.tickets.list': {
		offset?: number;
	};
	'support.tickets.reply': {
		id: string;
		body: string;
	};
	'templates.list': Record<string, never>;
	'usage.get': {
		/** An org you belong to (org_...), personal or workspace, to report instead of the default. A workspace API key may name only its own workspace. An org you are not a member of, or that does not exist, answers `404 not_found`, as `GET /v1/orgs/{id}` does. */
		org?: string;
	};
	'usage.machines': {
		/** As in `GET /v1/usage`. */
		org?: string;
		/** Only the sandboxes whose ID or name contains this, ignoring case. `total` counts the matches. */
		q?: string;
		/** `key:value` (split at the first `:`); only sandboxes whose metadata has the key with exactly that value. Repeatable; all terms must match (AND). `total` counts the matches. */
		metadata?: Array<string>;
		/** Start of the window (RFC 3339). Default the start of this month (UTC). */
		from?: string;
		/** End of the window (RFC 3339), after `from`. Default now. */
		to?: string;
		sort?: 'computeUSD' | 'vcpuSeconds' | 'memGiBSeconds';
		order?: 'asc' | 'desc';
		limit?: number;
		offset?: number;
	};
	'vault.delete': {
		/** The item's name. An env item's name is the variable's name. */
		name: string;
	};
	'vault.export': {
		name: string;
	};
	'vault.import': {
		selector?: InstaboxMetadataInput;
		values: Record<string, string>;
	};
	'vault.list': Record<string, never>;
	'vault.set': {
		/** The item's name. An env item's name is the variable's name. */
		name: string;
		kind: 'env' | 'file';
		/** File items only: the target, relative to the home directory. */
		path?: string;
		/** Absent or {}: the item applies to every machine. */
		selector?: Record<string, string>;
		/** UTF-8 text without NUL bytes, 1 byte to 64 KiB, stored as given. */
		value: string;
	};
	'vault.update': {
		/** The item's name. An env item's name is the variable's name. */
		name: string;
		/** The new selector; {} clears it. */
		selector: Record<string, string>;
	};
};

export type InstaboxOperationOutputs = {
	'exports.download': FileOutput;
	'exports.get': InstaboxExport;
	'feedback.send': InstaboxFeedbackResult;
	'gpuQueue.cancel': InstaboxGPUQueueEntry;
	'gpuQueue.list': InstaboxGPUQueueList;
	'keys.create': InstaboxCreatedAPIKey;
	'keys.list': InstaboxAPIKeyList;
	'keys.revoke': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'machines.activityLeases.release': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'machines.activityLeases.renew': InstaboxActivityLease;
	'machines.claimOomKill': InstaboxOOMClaim;
	'machines.connectionInfo': InstaboxConnectionInfo;
	'machines.create': InstaboxOperation;
	'machines.createAccess': {
		expiresAt?: string | null;
		protocol?: string | null;
		token?: string | null;
		url?: string | null;
		watchUrl?: string | null;
	};
	'machines.createSnapshot': InstaboxSnapshot;
	'machines.delete': InstaboxOperation;
	'machines.desktop.createLink': InstaboxDesktopStream;
	'machines.desktop.get': InstaboxDesktop;
	'machines.desktop.revokeLinks': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'machines.disk': InstaboxMachineDisk;
	'machines.exec': InstaboxExecResult;
	'machines.files.createUploadUrl': InstaboxUploadURL;
	'machines.files.download': FileOutput;
	'machines.files.read': InstaboxFiles;
	'machines.files.write': InstaboxFileWritten;
	'machines.fork': InstaboxOperation;
	'machines.get': InstaboxMachine;
	'machines.history.get': InstaboxExecHistoryEntry;
	'machines.history.list': InstaboxExecHistory;
	'machines.list': InstaboxMachineList;
	'machines.logs': InstaboxMachineLogs;
	'machines.metrics': InstaboxMachineMetrics;
	'machines.ports.create': InstaboxPublicPort;
	'machines.ports.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'machines.ports.installAgent': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'machines.ports.list': InstaboxPublicPortList;
	'machines.processes': InstaboxProcessList;
	'machines.restore': InstaboxOperation;
	'machines.resume': InstaboxOperation;
	'machines.secrets.get': InstaboxMachineSecrets;
	'machines.secrets.refresh': InstaboxMachineSecrets;
	'machines.secrets.update': InstaboxMachineSecrets;
	'machines.ssh.createToken': InstaboxSSHToken;
	'machines.ssh.issueCertificate': InstaboxConnection;
	'machines.ssh.listTokens': InstaboxSSHTokenList;
	'machines.ssh.revokeAllTokens': InstaboxSSHTokensRevoked;
	'machines.ssh.revokeToken': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'machines.start': InstaboxOperation;
	'machines.stop': InstaboxOperation;
	'machines.suspend': InstaboxOperation;
	'machines.update': InstaboxMachine | InstaboxOperation;
	'machines.usage': InstaboxMachineUsage;
	'machines.vault.get': InstaboxMachineVault;
	'machines.vault.write': InstaboxVaultApplied;
	'machines.wake': InstaboxMachine;
	'me.discord.get': InstaboxDiscordStatus;
	'me.discord.unlink': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'me.get': InstaboxMe;
	'operations.get': InstaboxOperation;
	'orgs.billing.cancelSubscription': InstaboxOrg;
	'orgs.billing.changePlan': InstaboxOrg;
	'orgs.billing.checkout': InstaboxCheckoutResponse;
	'orgs.billing.getTopup': InstaboxTopUpOptions;
	'orgs.billing.movePersonal': InstaboxMovedPersonalPlan;
	'orgs.billing.portal': InstaboxPortalResponse;
	'orgs.billing.resumeSubscription': InstaboxOrg;
	'orgs.billing.subscribeWithCredits': InstaboxOrg;
	'orgs.billing.topup': InstaboxTopUpResponse;
	'orgs.billing.update': InstaboxOrg;
	'orgs.create': InstaboxCheckoutResponse;
	'orgs.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.exports.create': InstaboxExport;
	'orgs.exports.list': InstaboxExportList;
	'orgs.get': InstaboxOrg;
	'orgs.github.installations.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.github.installations.list': InstaboxGitHubInstallationList;
	'orgs.github.jobs.get': InstaboxGitHubJobDetail;
	'orgs.github.jobs.list': InstaboxGitHubJobList;
	'orgs.github.stats': InstaboxGitHubJobStats;
	'orgs.inviteCode.get': InstaboxOrgInviteCode;
	'orgs.inviteCode.regenerate': InstaboxOrgInviteCode;
	'orgs.invites.create': InstaboxOrgInvite;
	'orgs.invites.list': InstaboxOrgInviteList;
	'orgs.invites.resend': InstaboxOrgInvite;
	'orgs.invites.revoke': InstaboxOrgInvite;
	'orgs.keys.create': InstaboxCreatedAPIKey;
	'orgs.keys.list': InstaboxAPIKeyList;
	'orgs.keys.revoke': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.list': InstaboxOrgList;
	'orgs.members.changeRole': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.members.list': InstaboxOrgMemberList;
	'orgs.members.remove': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.movePersonal': InstaboxMovedPersonalPlan;
	'orgs.redeemInvite': InstaboxOrg;
	'orgs.secrets.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.secrets.import': InstaboxSecretList;
	'orgs.secrets.list': InstaboxSecretList;
	'orgs.secrets.set': InstaboxSecret;
	'orgs.update': InstaboxOrg;
	'orgs.webhooks.create': InstaboxWebhook;
	'orgs.webhooks.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.webhooks.deliveries.list': InstaboxWebhookDeliveryList;
	'orgs.webhooks.deliveries.retry': InstaboxWebhookDelivery;
	'orgs.webhooks.get': InstaboxWebhook;
	'orgs.webhooks.list': InstaboxWebhookList;
	'orgs.webhooks.rotate': InstaboxWebhook;
	'orgs.webhooks.test': InstaboxWebhookDelivery;
	'orgs.webhooks.update': InstaboxWebhook;
	'ports.list': InstaboxPublicPortList;
	'sessions.list': InstaboxSessionList;
	'sessions.signOut': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'snapshots.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'snapshots.files.list': InstaboxFiles;
	'snapshots.get': InstaboxSnapshot;
	'snapshots.list': InstaboxSnapshotList;
	'stats.get': InstaboxStats;
	'support.tickets.close': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'support.tickets.get': Record<string, InstaboxJsonValue>;
	'support.tickets.list': Record<string, InstaboxJsonValue>;
	'support.tickets.reply': Record<string, InstaboxJsonValue>;
	'templates.list': InstaboxTemplateList;
	'usage.get': InstaboxUsage;
	'usage.machines': InstaboxOrgMachineUsageList;
	'vault.delete': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'vault.export': InstaboxLegacyVaultExport;
	'vault.import': {
		/** Instabox accepted the call; it answered with no body. */
		success: true;
	};
	'vault.list': InstaboxVaultItemList;
	'vault.set': InstaboxVaultItem;
	'vault.update': InstaboxVaultItem;
};
