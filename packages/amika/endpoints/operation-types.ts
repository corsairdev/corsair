// Generated from Amika's OpenAPI spec (https://app.amika.dev/api/v0beta1/openapi.json,
// fetched 2026-11-22); amika-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type AmikaJsonValue =
	| null
	| boolean
	| number
	| string
	| AmikaJsonValue[]
	| { [key: string]: AmikaJsonValue | undefined };

export const AMIKA_OPERATION_IDS = [
	'agentCredentials.claude.check',
	'agentCredentials.claude.create',
	'agentCredentials.claude.delete',
	'agentCredentials.claude.list',
	'agentCredentials.codex.create',
	'agentCredentials.codex.delete',
	'agentCredentials.codex.list',
	'agentCredentials.pi.delete',
	'agentCredentials.pi.get',
	'agentCredentials.pi.set',
	'agentSessions.get',
	'agentSessions.list',
	'agentSessions.send',
	'apiKeys.create',
	'apiKeys.delete',
	'apiKeys.list',
	'cloudAccounts.create',
	'cloudAccounts.delete',
	'cloudAccounts.get',
	'cloudAccounts.list',
	'cloudAccounts.listSizes',
	'cloudAccounts.update',
	'commandRuns.cancel',
	'commandRuns.create',
	'commandRuns.get',
	'commandRuns.list',
	'commandRuns.listEvents',
	'gitUserSettings.get',
	'gitUserSettings.set',
	'hosts.checkHealth',
	'hosts.create',
	'hosts.delete',
	'hosts.enrol',
	'hosts.get',
	'hosts.list',
	'hosts.replace',
	'integrations.disconnect',
	'integrations.list',
	'jobRuns.cancel',
	'jobRuns.get',
	'jobRuns.list',
	'jobRuns.start',
	'jobs.create',
	'jobs.delete',
	'jobs.get',
	'jobs.list',
	'jobs.update',
	'linear.settings.get',
	'linear.settings.set',
	'repositories.clearImage',
	'repositories.get',
	'repositories.integrations.list',
	'repositories.integrations.set',
	'repositories.list',
	'repositories.upsert',
	'rigs.create',
	'rigs.createSshSession',
	'rigs.createTerminalTicket',
	'rigs.delete',
	'rigs.get',
	'rigs.getSlackConversation',
	'rigs.getSlackMetadata',
	'rigs.list',
	'rigs.listIntegrations',
	'rigs.listLifecycleEvents',
	'rigs.services.create',
	'rigs.services.createToken',
	'rigs.services.delete',
	'rigs.services.list',
	'rigs.services.replace',
	'rigs.sessions.create',
	'rigs.sessions.get',
	'rigs.sessions.getLatest',
	'rigs.sessions.list',
	'rigs.sessions.update',
	'rigs.start',
	'rigs.stop',
	'secrets.create',
	'secrets.delete',
	'secrets.list',
	'secrets.sshPublicKeys.delete',
	'secrets.sshPublicKeys.list',
	'secrets.sshPublicKeys.upsert',
	'secrets.update',
	'serviceDefinitions.create',
	'serviceDefinitions.delete',
	'serviceDefinitions.update',
	'services.list',
	'slack.channelSettings.delete',
	'slack.channelSettings.list',
	'slack.channelSettings.set',
	'slack.settings.get',
	'slack.settings.set',
	'snapshots.create',
	'snapshots.delete',
	'snapshots.get',
	'snapshots.list',
	'snapshots.previewScrub',
] as const;

export type AmikaOperationId = (typeof AMIKA_OPERATION_IDS)[number];

/** Start a job run at each time that `schedule` matches. */
export type AmikaCronTriggerInput = {
	kind: 'cron';
	/** 5-field cron expression (minute, hour, day of month, month, day of week), or `@hourly`, `@daily`, `@weekly`, `@monthly`, `@yearly`. Fires must be at least 5 minutes apart. */
	schedule: string;
	/** IANA time zone to read `schedule` in, with DST. Default `UTC`. */
	timezone?: string;
};

export type AmikaHostCapabilitiesInput = {
	runtimes: Record<
		string,
		{
			kind: 'vm' | 'container' | 'host';
			os: 'linux' | 'macos';
			arch?: string;
			max_running?: number;
			snapshots: boolean;
			sizes: Record<
				string,
				{
					vcpus: number;
					memory_gib: number;
					disk_gib: number;
					disk_grow_only?: boolean;
				}
			>;
			resources?: {
				vcpus: number;
				memory_gib: number;
				disk_gib: number;
			};
			ssh_user?: string;
		}
	>;
	presets: Record<
		string,
		{
			os: 'linux' | 'macos';
			default_runtime: string;
			runtimes: Array<string>;
		}
	>;
} | null;

/** One command of a job, as a `CreateCommandRunRequest` body without `rig_status_on_finish`. Step 0 must set exactly one rig selector. Later steps must set none: they run on step 0's rig. A `rig_create` name is a prefix: each job run appends `-` and 12 hex characters. */
export type AmikaJobStepInput = {
	/** Existing rig to run on, by id. */
	rig_id?: string;
	/** Existing rig to run on, by name. */
	rig_name?: string;
	/** Existing rig to run on, by id or name. Returns 409 `resource_ref_ambiguous` if the value matches one rig's id and another rig's name. */
	rig_ref?: string;
	/** Create a new rig with this `POST /rigs` body, then run on it. Returns 409 `sandbox_name_conflict` if the name is in use. */
	rig_create?: {
		name: string;
		repo_url?: string;
		git_url?: string;
		github_url?: string;
		branch?: string;
		new_branch_name?: string;
		provider?:
			| 'daytona'
			| 'e2b'
			| 'freestyle'
			| 'vercel'
			| 'instabox'
			| 'smol'
			| 'lume'
			| 'amika-hostd'
			| 'simulate';
		host_id?: string;
		/** Run the rig in this connected cloud account (by id). At most one of cloud_account_id, cloud_account_name, cloud_account_ref. Cannot be combined with host_id. */
		cloud_account_id?: string;
		/** Run the rig in the connected cloud account with this name; `amika` means Amika Cloud. `provider` narrows the name. */
		cloud_account_name?: string;
		/** Run the rig in the connected cloud account with this id or name. */
		cloud_account_ref?: string;
		/** With `host_id`, the host runtime to run the rig on (`smol`, `lume`). Omitted, the rig runs on its preset's default runtime on that host. Requires `host_id`. */
		runtime?: string;
		/** With `host_id`, the rig's resources, in place of a named `size`: 1 to 16 vCPUs, at least 64 MiB of memory in whole MiB, and a disk of at least 1 GiB. Requires `host_id`, and cannot be combined with `size`. */
		resources?: {
			vcpus: number;
			memoryGib: number;
			diskGib: number;
		};
		auto_stop_interval?: number;
		auto_delete_interval?: number;
		amika_opencode_web?: string | number | AmikaJsonValue | null;
		env_vars?: Record<string, string>;
		secret_env_vars?: Record<string, string>;
		disabled_repo_env_var_names?: Array<string>;
		setup_script_text?: string;
		skip_setup_script?: boolean;
		agent_credentials?: Array<{
			kind: 'claude' | 'codex';
			name?: string;
			type?: 'oauth' | 'api_key';
			none?: true;
		}>;
		preset?: 'coder' | 'coder-plus-docker' | 'macos-coder';
		/** Providerless sandbox size (for example `a0.m`). Legacy names such as `m` and `medium` are also accepted. The provider is inferred from `provider` or the server default; when omitted, the size defaults to that provider's medium tier. With `host_id`, names one of the host's own sizes instead; a… */
		size?: string;
		snapshot?: string | null;
		integration_ids?: Array<string>;
		agent?: 'claude' | 'codex';
		github_auth_mode?: 'pat' | 'app_token';
		/** The Amika API key the rig gets as `AMIKA_API_KEY`. `{"mode": "new", "scope": "org"}` (default): a new organization key. `{"mode": "new", "scope": "user"}`: a new key for the calling user; a caller with no user cannot use it. `{"mode": "none"}`: no key, and `AMIKA_API_KEY` is not set. A new key… */
		amika_api_key?:
			| {
					mode: 'new';
					scope: 'org' | 'user';
			  }
			| {
					mode: 'none';
			  };
	};
	/** FIFO lane on the rig. Runs in one session start in creation order, one at a time. Runs in different sessions run in parallel. Default `default`. */
	session?: string;
	/** Shell command. Amika runs it with `bash -e -o pipefail`. */
	command: string;
	/** Maximum run time of the command, in milliseconds. The clock starts when the command process starts. At the limit, the conclusion is `timed_out`. */
	timeout_ms: number;
	/** Maximum wait from creation until the command process starts, in milliseconds. The wait includes the session queue, rig start, and workspace setup. At the limit, the conclusion is `queue_timed_out`. Omit for no limit. */
	queue_timeout_ms?: number;
	/** Working directory of the command. Absolute, or relative to the agent directory (`AMIKA_AGENT_CWD`). Default: the agent directory. */
	cwd?: string;
};

/** When the job starts a job run. `cron` is the only kind. */
export type AmikaJobTriggerInput = AmikaCronTriggerInput;

export type AmikaAgentSession = {
	id?: string | null;
	sandbox_id?: string | null;
	org_id?: string | null;
	agent_name?: string | null;
	status?: string | null;
	started_at?: string | null;
	ended_at?: (string | AmikaJsonValue | null) | null;
	metadata?: Record<string, AmikaJsonValue | null> | null;
	preview?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaAgentSessionDetail = AmikaAgentSessionSummary & {
	messages?: Array<AmikaAgentSessionMessage> | null;
};

export type AmikaAgentSessionMessage = {
	role?: string | null;
	content?: string | null;
	timestamp?: string | null;
	is_error?: boolean | null;
};

export type AmikaAgentSessionSendResponse = {
	session_id?: string | null;
	sandbox_id?: string | null;
	agent?: string | null;
	response?: string | null;
	/** True when the turn failed. The failure is still a 200: `response` carries the agent CLI's own message (e.g. "Not logged in · Please run /login"). */
	is_error?: boolean | null;
	is_new_session?: boolean | null;
	created_sandbox?: boolean | null;
	usage?: AmikaAgentSessionUsage | null;
};

export type AmikaAgentSessionSummary = {
	session_id?: string | null;
	sandbox_id?: string | null;
	sandbox_name?: string | null;
	agent?: string | null;
	status?: string | null;
	preview?: string | null;
	model?: string | null;
	effort?: string | null;
	started_at?: string | null;
	ended_at?: (string | AmikaJsonValue | null) | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaAgentSessionUsage = {
	cost_usd?: number | null;
	input_tokens?: number | null;
	output_tokens?: number | null;
	cache_read_tokens?: number | null;
	cache_creation_tokens?: number | null;
	duration_ms?: number | null;
	num_turns?: number | null;
};

export type AmikaAgentSessionsList = {
	sessions?: Array<AmikaAgentSession> | null;
	total?: number | null;
};

export type AmikaApiKeySummary = {
	id?: string | null;
	name?: string | null;
	/** Whether the key is scoped to the caller's organization or to the individual user who owns it. */
	scope?: string | null;
	obfuscatedValue?: string | null;
	lastUsedAt?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type AmikaApiKeyWithValue = AmikaApiKeySummary & {
	value?: string | null;
};

export type AmikaCloudAccount = {
	id?: string | null;
	provider?: string | null;
	name?: string | null;
	is_default?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaCloudAccountSizes = {
	/** The sizes a rig in this account may take, smallest first: those whose vCPUs and memory match a size the provider reports for the account's key. */
	sizes?: Array<string> | null;
	/** False when the provider could not be asked: `sizes` is then Amika's table, and the provider refuses a size the account's plan lacks. */
	from_provider?: boolean | null;
};

/** One shell command on one rig. Amika records its lifecycle, output, and exit code. */
export type AmikaCommandRun = {
	/** Command run id (`cr_…`). */
	id?: string | null;
	/** Rig the run runs on. Null after the rig is deleted. */
	rig_id?: string | null;
	/** Name of the rig. Null after the rig is deleted. */
	rig_name?: string | null;
	/** Session (FIFO lane) of the run on the rig. */
	session?: string | null;
	source?: AmikaCommandRunSource | null;
	/** `queued`: waiting for its session, the rig, or the workspace. `in_progress`: the command started. `completed`: finished; see `conclusion`. */
	status?: string | null;
	/** Detailed step of the run, for progress displays. Use `status` for logic. */
	controller_phase?: string | null;
	/** Result of a `completed` run. Null before completion. `success`: exit code 0. `failure`: non-zero exit code. `cancelled`: cancelled by request. `timed_out`: the command exceeded `timeout_ms`. `queue_timed_out`: the command did not start within `queue_timeout_ms`. `error`: Amika could not run the… */
	conclusion?: string | null;
	/** Exit code of the command. Null if the command did not exit. */
	exit_code?: number | null;
	/** Where the command runs. `rig`: the rig's own files. `git_checkout`: a fresh checkout of `repository_url` at `revision`, made for GitHub Actions runs. */
	workspace?:
		| (
				| {
						kind?: string | null;
						repository_url?: string | null;
						revision?: string | null;
				  }
				| {
						kind?: string | null;
				  }
		  )
		| null;
	/** Shell command. */
	command?: string | null;
	/** Working directory as requested. Null: the agent directory (`AMIKA_AGENT_CWD`). */
	cwd?: string | null;
	/** Maximum run time of the command, in ms. */
	timeout_ms?: number | null;
	/** Maximum wait before the command starts, in ms. Null: no limit. */
	queue_timeout_ms?: number | null;
	/** Status to give the rig when its last incomplete run finishes. If more than one run sets it, the run that started last decides. Omit to restore the rig's status from before the runs. */
	rig_status_on_finish?: string | null;
	/** When a cancel was requested. */
	cancel_requested_at?: (string | AmikaJsonValue | null) | null;
	/** When the run left the queue. */
	started_at?: (string | AmikaJsonValue | null) | null;
	/** When the run completed. */
	completed_at?: (string | AmikaJsonValue | null) | null;
	/** When the run was created. */
	created_at?: string | null;
	/** When the run last changed. */
	updated_at?: string | null;
};

/** One chunk of output from a command run. */
export type AmikaCommandRunEvent = {
	/** Position of the event in the run's output. Starts at 1. */
	sequence?: number | null;
	/** `stdout` or `stderr` of the command, or `system` for messages from Amika about the run. */
	stream?: string | null;
	/** Output text. */
	content?: string | null;
	/** Length of `content` in bytes. */
	byte_length?: number | null;
	/** When Amika recorded the event. */
	created_at?: string | null;
};

/** Why the run exists. Set at creation. Filter by it with `source_kind` and `source_id`. */
export type AmikaCommandRunSource =
	| AmikaCommandRunSourceApi
	| AmikaCommandRunSourceGithubActions
	| AmikaCommandRunSourceGithubActionsRunner
	| AmikaCommandRunSourceJob;

/** Created through `POST /command-runs`. */
export type AmikaCommandRunSourceApi = {
	kind?: string | null;
};

/** Created by a GitHub Actions workflow step. */
export type AmikaCommandRunSourceGithubActions = {
	kind?: string | null;
	repository?: {
		id?: string | null;
		owner?: string | null;
		name?: string | null;
		url?: string | null;
	} | null;
	source_sha?: string | null;
	git_ref?: string | null;
	head_branch?: string | null;
	pull_request_number?: number | null;
	workflow_ref?: string | null;
	workflow_run_id?: string | null;
	workflow_run_attempt?: number | null;
	workflow_job_key?: string | null;
};

/** Runs a self-hosted GitHub Actions runner that Amika started for a queued job. */
export type AmikaCommandRunSourceGithubActionsRunner = {
	kind?: string | null;
	repository?: {
		id?: string | null;
		owner?: string | null;
		name?: string | null;
		url?: string | null;
	} | null;
	installation_id?: string | null;
	runner_name?: string | null;
	label_set?: Array<string> | null;
	requested_for_job_id?: string | null;
};

/** One step of a job run. */
export type AmikaCommandRunSourceJob = {
	kind?: string | null;
	job_id?: string | null;
	job_run_id?: string | null;
	/** Index of the job step. Null for the finish run, which only applies the job's `rig_status_on_finish`. */
	step?: number | null;
};

export type AmikaCredentialCheckResponse =
	| {
			status?: string | null;
	  }
	| {
			status?: string | null;
			message?: string | null;
	  };

/** Start a job run at each time that `schedule` matches. */
export type AmikaCronTrigger = {
	kind?: string | null;
	/** 5-field cron expression (minute, hour, day of month, month, day of week), or `@hourly`, `@daily`, `@weekly`, `@monthly`, `@yearly`. Fires must be at least 5 minutes apart. */
	schedule?: string | null;
	/** IANA time zone to read `schedule` in, with DST. Default `UTC`. */
	timezone?: string | null;
};

export type AmikaDirectWebSocketSshSessionResponse = {
	session_id?: string | null;
	transport?: string | null;
	connect_url?: string | null;
	connect_credential?: string | null;
	sandbox_id?: string | null;
	ssh_user?: string | null;
	host_public_key?: string | null;
};

export type AmikaExperimentalDaytonaSnapshot = {
	name?: string | null;
	state?: string | null;
	imageName?: string | null;
	cpu?: number | null;
	memory?: number | null;
	disk?: number | null;
	createdAt?: string | null;
	updatedAt?: string | null;
} | null;

export type AmikaGetSandboxResponse = AmikaRig & {
	hostname?: string | null;
};

export type AmikaGitUserSettingsResponse =
	| {
			configured?: boolean | null;
			name?: string | null;
			email?: string | null;
			suggestion?: {
				name?: string | null;
				email?: string | null;
			} | null;
	  }
	| {
			configured?: boolean | null;
			suggestion?: {
				name?: string | null;
				email?: string | null;
			} | null;
	  };

export type AmikaGitUserSettingsRow = {
	id?: string | null;
	org_id?: string | null;
	user_id?: string | null;
	name?: string | null;
	email?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaHost = {
	id?: string | null;
	hostname?: string | null;
	url?: string | null;
	org_id?: string | null;
	sizes?: Record<
		string,
		{
			vcpus?: number | null;
			memoryGib?: number | null;
			diskGib?: number | null;
			diskGrowOnly?: boolean | null;
		}
	> | null;
	capabilities?: AmikaHostCapabilities | null;
	transport_mode?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaHostCapabilities = {
	runtimes?: Record<
		string,
		{
			kind?: string | null;
			os?: string | null;
			arch?: string | null;
			max_running?: number | null;
			snapshots?: boolean | null;
			sizes?: Record<
				string,
				{
					vcpus?: number | null;
					memory_gib?: number | null;
					disk_gib?: number | null;
					disk_grow_only?: boolean | null;
				}
			> | null;
			resources?: {
				vcpus?: number | null;
				memory_gib?: number | null;
				disk_gib?: number | null;
			} | null;
			ssh_user?: string | null;
		}
	> | null;
	presets?: Record<
		string,
		{
			os?: string | null;
			default_runtime?: string | null;
			runtimes?: Array<string> | null;
		}
	> | null;
} | null;

export type AmikaHostEnrolmentResponse = {
	/** The host's secret, whole and opaque. Sent as `x-amika-host-token` when the host dials the gateway. */
	credential?: string | null;
	/** How many times this host's credential has been replaced. The gateway fences a stale connection with it, so a daemon that reconnects sends the generation it enrolled with. */
	generation?: number | null;
	/** The WebSocket address to dial, path included. */
	gateway_url?: string | null;
	/** Always `tunnel`. A `listen` host is refused: it binds a port and is reached at its registered URL. */
	transport_mode?: string | null;
};

export type AmikaHostHealthResponse = {
	id?: string | null;
	status?: string | null;
	message?: string | null;
};

export type AmikaHostListItem = AmikaHost & {
	rig?: {
		id?: string | null;
		name?: string | null;
	} | null;
};

/** A trigger and an ordered list of steps. Each time the trigger fires, the job starts a job run. Read past job runs with `GET /job-runs?job_id=…`. */
export type AmikaJob = {
	/** Job id (`job_…`). */
	id?: string | null;
	/** Unique name in the organization. */
	name?: string | null;
	/** Free text for people. */
	description?: string | null;
	/** `false` while the job is paused. */
	enabled?: boolean | null;
	trigger?: AmikaJobTrigger | null;
	/** Commands of each job run, in order. */
	steps?: Array<AmikaJobStep> | null;
	/** Status to give the rig when the job run ends, after success or failure. When set, the rig stays up between steps. Omit to restore the rig's status from before the job run. */
	rig_status_on_finish?: string | null;
	/** `skip` (default): do not start a scheduled job run while an earlier run of this job is `pending` or `running`; record it as `skipped`. `allow`: start it. */
	overlap_policy?: string | null;
	/** Next time the trigger fires. Amika starts the job run within 30 seconds of it. Null while the job is paused. */
	next_run_at?: (string | AmikaJsonValue | null) | null;
	/** When the job was created. */
	created_at?: string | null;
	/** When the job last changed. */
	updated_at?: string | null;
};

/** One execution of a job. It runs the job's steps in order on one rig, one command run per step, and stops at the first step that fails. */
export type AmikaJobRun = {
	/** Job run id (`jr_…`). */
	id?: string | null;
	/** Job of this job run. */
	job_id?: string | null;
	/** `cron`: the job's schedule. `manual`: `POST /job-runs`. */
	trigger_kind?: string | null;
	/** Time the schedule fired, or the request time for `manual`. Compare with `created_at` to see the delay. */
	scheduled_at?: string | null;
	/** `pending`: recorded; no step started. `running`: a step's run, or the finish run, did not complete. `succeeded`: every step concluded `success`. `failed`: a step did not succeed, or Amika could not create its run; later steps did not start. `skipped`: `overlap_policy` dropped it. `cancelled`:… */
	status?: string | null;
	/** Index of the step in progress, or of the step that ended the job run. */
	current_step?: number | null;
	/** Number of steps. */
	step_count?: number | null;
	/** The job's steps when the job run was recorded. Later changes to the job do not change them. */
	steps?: Array<AmikaJobStep> | null;
	/** One command run per started step, in step order. Read each with `GET /command-runs/{id}`. */
	command_run_ids?: Array<string> | null;
	/** Command run that applied the job's `rig_status_on_finish` when no step run could. Null when not necessary. */
	finish_command_run_id?: string | null;
	/** Why the job run failed, was skipped, or was cancelled. A `running` job run with an `error` waits for its finish run. */
	error?: string | null;
	/** When `POST /job-runs/{id}/cancel` was called. A `running` job run with this set starts no more steps, and becomes `cancelled` once its current step and any finish run complete. */
	cancel_requested_at?: (string | AmikaJsonValue | null) | null;
	/** Rig of step 0's run. Null before step 0 has a run, and after the rig is deleted. */
	rig_id?: string | null;
	/** Name of the rig. Null when `rig_id` is null. */
	rig_name?: string | null;
	/** When the job run was recorded. */
	created_at?: string | null;
	/** When the job run last changed. */
	updated_at?: string | null;
	/** When the job run became `succeeded`, `failed`, `skipped`, or `cancelled`. */
	completed_at?: (string | AmikaJsonValue | null) | null;
};

/** One command of a job, as a `CreateCommandRunRequest` body without `rig_status_on_finish`. Step 0 must set exactly one rig selector. Later steps must set none: they run on step 0's rig. A `rig_create` name is a prefix: each job run appends `-` and 12 hex characters. */
export type AmikaJobStep = {
	/** Existing rig to run on, by id. */
	rig_id?: string | null;
	/** Existing rig to run on, by name. */
	rig_name?: string | null;
	/** Existing rig to run on, by id or name. Returns 409 `resource_ref_ambiguous` if the value matches one rig's id and another rig's name. */
	rig_ref?: string | null;
	/** Create a new rig with this `POST /rigs` body, then run on it. Returns 409 `sandbox_name_conflict` if the name is in use. */
	rig_create?: {
		name?: string | null;
		repo_url?: string | null;
		git_url?: string | null;
		github_url?: string | null;
		branch?: string | null;
		new_branch_name?: string | null;
		provider?: string | null;
		host_id?: string | null;
		/** Run the rig in this connected cloud account (by id). At most one of cloud_account_id, cloud_account_name, cloud_account_ref. Cannot be combined with host_id. */
		cloud_account_id?: string | null;
		/** Run the rig in the connected cloud account with this name; `amika` means Amika Cloud. `provider` narrows the name. */
		cloud_account_name?: string | null;
		/** Run the rig in the connected cloud account with this id or name. */
		cloud_account_ref?: string | null;
		/** With `host_id`, the host runtime to run the rig on (`smol`, `lume`). Omitted, the rig runs on its preset's default runtime on that host. Requires `host_id`. */
		runtime?: string | null;
		/** With `host_id`, the rig's resources, in place of a named `size`: 1 to 16 vCPUs, at least 64 MiB of memory in whole MiB, and a disk of at least 1 GiB. Requires `host_id`, and cannot be combined with `size`. */
		resources?: {
			vcpus?: number | null;
			memoryGib?: number | null;
			diskGib?: number | null;
		} | null;
		auto_stop_interval?: number | null;
		auto_delete_interval?: number | null;
		amika_opencode_web?: (string | number | AmikaJsonValue | null) | null;
		env_vars?: Record<string, string> | null;
		secret_env_vars?: Record<string, string> | null;
		disabled_repo_env_var_names?: Array<string> | null;
		setup_script_text?: string | null;
		skip_setup_script?: boolean | null;
		agent_credentials?: Array<{
			kind?: string | null;
			name?: string | null;
			type?: string | null;
			none?: boolean | null;
		}> | null;
		preset?: string | null;
		/** Providerless sandbox size (for example `a0.m`). Legacy names such as `m` and `medium` are also accepted. The provider is inferred from `provider` or the server default; when omitted, the size defaults to that provider's medium tier. With `host_id`, names one of the host's own sizes instead; a… */
		size?: string | null;
		snapshot?: string | null;
		integration_ids?: Array<string> | null;
		agent?: string | null;
		github_auth_mode?: string | null;
		/** The Amika API key the rig gets as `AMIKA_API_KEY`. `{"mode": "new", "scope": "org"}` (default): a new organization key. `{"mode": "new", "scope": "user"}`: a new key for the calling user; a caller with no user cannot use it. `{"mode": "none"}`: no key, and `AMIKA_API_KEY` is not set. A new key… */
		amika_api_key?:
			| (
					| {
							mode?: string | null;
							scope?: string | null;
					  }
					| {
							mode?: string | null;
					  }
			  )
			| null;
	} | null;
	/** FIFO lane on the rig. Runs in one session start in creation order, one at a time. Runs in different sessions run in parallel. Default `default`. */
	session?: string | null;
	/** Shell command. Amika runs it with `bash -e -o pipefail`. */
	command?: string | null;
	/** Maximum run time of the command, in milliseconds. The clock starts when the command process starts. At the limit, the conclusion is `timed_out`. */
	timeout_ms?: number | null;
	/** Maximum wait from creation until the command process starts, in milliseconds. The wait includes the session queue, rig start, and workspace setup. At the limit, the conclusion is `queue_timed_out`. Omit for no limit. */
	queue_timeout_ms?: number | null;
	/** Working directory of the command. Absolute, or relative to the agent directory (`AMIKA_AGENT_CWD`). Default: the agent directory. */
	cwd?: string | null;
};

/** When the job starts a job run. `cron` is the only kind. */
export type AmikaJobTrigger = AmikaCronTrigger;

export type AmikaLinearOrgSettings = {
	org_id?: string | null;
	repository_id?: string | null;
	agent_name?: string | null;
	system_prompt?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaListAgentSessionsResponse = {
	sessions?: Array<AmikaAgentSessionSummary> | null;
	total?: number | null;
};

export type AmikaListApiKeysResponse = {
	data?: Array<AmikaApiKeySummary> | null;
	pageInfo?: {
		after?: string | null;
		hasNextPage?: boolean | null;
	} | null;
};

export type AmikaListCloudAccountsResponse = {
	items?: Array<AmikaCloudAccount> | null;
};

export type AmikaListCommandRunEventsResponse = {
	/** Events in sequence order. */
	items?: Array<AmikaCommandRunEvent> | null;
	/** Send as `after` in the next request. Equals `after` when there are no new events. */
	next_sequence?: number | null;
};

export type AmikaListCommandRunsResponse = {
	/** Command runs, newest first. */
	items?: Array<AmikaCommandRun> | null;
};

export type AmikaListCredentialsResponse = Array<{
	id?: string | null;
	name?: string | null;
	type?: string | null;
	scope?: string | null;
}>;

export type AmikaListIntegrationCredentialsResponse = Array<{
	provider?: string | null;
	connected?: boolean | null;
}>;

export type AmikaListJobRunsResponse = {
	/** Job runs, newest first. With `latest_per_job`, the latest of each job, sorted by job id. */
	items?: Array<AmikaJobRun> | null;
	/** With `latest_per_job`: send as `cursor` to get the next page; null on the last page. Otherwise always null. */
	next_cursor?: string | null;
};

export type AmikaListJobsResponse = {
	/** Jobs, sorted by name. */
	items?: Array<AmikaJob> | null;
	/** Send as `cursor` to get the next page. Null on the last page. */
	next_cursor?: string | null;
};

export type AmikaListRepositoriesResponse = Array<AmikaRepository>;

export type AmikaListSandboxServicesResponse = {
	items?: Array<AmikaSandboxService> | null;
};

export type AmikaListSandboxSnapshotsResponse = {
	items?: Array<AmikaSandboxSnapshot> | null;
};

export type AmikaListSandboxesResponse = Array<AmikaRig>;

export type AmikaListSecretsResponse = Array<AmikaSecretSummary>;

export type AmikaListSshPublicKeysResponse = Array<AmikaSshPublicKeySummary>;

export type AmikaOkStatus = {
	ok?: boolean | null;
};

export type AmikaPiStatus = {
	configured?: boolean | null;
	secretId?: string | null;
};

export type AmikaRepoIntegrationsResponse = Array<{
	id?: string | null;
	repository_id?: string | null;
	org_id?: string | null;
	name?: string | null;
	mcp_server_type?: string | null;
	mcp_server_url?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}>;

export type AmikaRepository = {
	id?: string | null;
	org_id?: string | null;
	user_id?: string | null;
	repo_url?: string | null;
	setup_script?: string | null;
	start_script?: string | null;
	sandbox_preset?: string | null;
	sandbox_size?: string | null;
	default_snapshot?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaRig = {
	id?: string | null;
	user_id?: string | null;
	org_id?: string | null;
	name?: string | null;
	provider?: string | null;
	provider_sandbox_id?: string | null;
	amika_opencode_web?: string | null;
	repo_name?: string | null;
	repo_provider?: string | null;
	repo_id?: string | null;
	repo_url?: string | null;
	branch?: string | null;
	commit_hash?: string | null;
	snapshot?: string | null;
	snapshot_name?: string | null;
	sandbox_preset?: string | null;
	sandbox_size?: string | null;
	sandbox_size_config?: {
		name?: string | null;
		vcpus?: number | null;
		memoryGib?: number | null;
		diskGib?: number | null;
		diskGrowOnly?: boolean | null;
	} | null;
	github_auth_mode?: string | null;
	github_credential_provisioned?: boolean | null;
	error_message?: string | null;
	current_session_id?: string | null;
	services?: Array<{
		name?: string | null;
		url?: string | null;
		hostPort?: number | null;
		containerPort?: number | null;
		protocol?: string | null;
		kind?: string | null;
	}> | null;
	status?: string | null;
	setup_status?: string | null;
	live_state_pending?: boolean | null;
	urls_expire_at?: (string | AmikaJsonValue | null) | null;
	secret_names?: Array<string> | null;
	mounted_secrets?: Array<{
		name?: string | null;
		scope?: string | null;
		managed?: boolean | null;
		credential_type?: string | null;
		provider?: string | null;
	}> | null;
	resolved_agent_credentials?: Array<
		| {
				kind?: string | null;
				outcome?: string | null;
				name?: string | null;
				type?: string | null;
				source?: string | null;
		  }
		| {
				kind?: string | null;
				outcome?: string | null;
				reason?: string | null;
		  }
	> | null;
	agent_credentials?: Array<{
		kind?: string | null;
		name?: string | null;
		scope?: string | null;
		credential_type?: string | null;
		inject_target?: string | null;
	}> | null;
	created_by?: {
		name?: string | null;
		email?: string | null;
	} | null;
	agent_cwd?: string | null;
	ssh_key_status?: string | null;
	origin?: string | null;
	host_id?: string | null;
	/** The org's connected cloud account the rig runs in, or null for Amika Cloud. */
	cloud_account?: {
		id?: string | null;
		name?: string | null;
	} | null;
	runtime?: string | null;
	os?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaSandboxIntegrationsResponse = Array<{
	sandbox_id?: string | null;
	name?: string | null;
	mcp_server_type?: string | null;
	mcp_server_url?: string | null;
}>;

export type AmikaSandboxLifecycleEvent = {
	id?: string | null;
	run_kind?: string | null;
	step?: string | null;
	status?: string | null;
	detail?: string | null;
	created_at?: string | null;
};

export type AmikaSandboxLifecycleEventsResponse = {
	events?: Array<AmikaSandboxLifecycleEvent> | null;
	count?: number | null;
};

export type AmikaSandboxScrubPreviewResponse = {
	files?: Array<string> | null;
	restored_files?: Array<string> | null;
	env_vars?: Array<string> | null;
};

export type AmikaSandboxService = {
	id?: string | null;
	sandbox_id?: string | null;
	name?: string | null;
	port?: number | null;
	url_scheme?: string | null;
	protocol?: string | null;
	url?: string | null;
	host_port?: number | null;
	source?: string | null;
	kind?: string | null;
	created_at?: (string | AmikaJsonValue | null) | null;
	updated_at?: (string | AmikaJsonValue | null) | null;
};

export type AmikaSandboxServiceToken = {
	/** The service's address on the rig's host, ending in `/`. It carries no credential. */
	url?: string | null;
	/** The request header the token goes in, as `Bearer <token>`. */
	header?: string | null;
	token?: string | null;
	expires_at?: string | null;
};

export type AmikaSandboxSlackMetadataResponse = {
	metadata?: Record<
		string,
		{
			conversation_id?: string | null;
			team_id?: string | null;
			team_name?: string | null;
			team_icon_url?: string | null;
			channel_id?: string | null;
			channel_name?: string | null;
			thread_id?: string | null;
			preview?: string | null;
			status?: string | null;
			agent_name?: string | null;
		}
	> | null;
};

export type AmikaSandboxSnapshot = {
	id?: string | null;
	snapshot?: string | null;
	provider?: string | null;
	host_id?: string | null;
	cloud_account_id?: string | null;
	description?: string | null;
	source_sandbox_id?: string | null;
	source_sandbox_name?: string | null;
	repository_id?: string | null;
	repository_url?: string | null;
	base_snapshot?: string | null;
	sandbox_preset?: string | null;
	sandbox_size?: string | null;
	capture_mode?: string | null;
	state?: string | null;
	error_message?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	daytona?: AmikaExperimentalDaytonaSnapshot | null;
};

export type AmikaSecretSummary = {
	id?: string | null;
	org_id?: string | null;
	user_id?: string | null;
	name?: string | null;
	description?: string | null;
	scope?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaServiceDefinition = {
	id?: string | null;
	name?: string | null;
	ports?: Array<{
		port?: number | null;
		protocol?: string | null;
		url_scheme?: string | null;
	}> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaSlackChannelSettings = {
	org_id?: string | null;
	slack_team_id?: string | null;
	slack_channel_id?: string | null;
	repository_id?: string | null;
	agent_name?: string | null;
	system_prompt?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaSlackChannelSettingsList = {
	settings?: Array<AmikaSlackChannelSettings> | null;
	seen_channels?: Array<AmikaSlackSeenChannel> | null;
};

export type AmikaSlackConversationResponse = {
	conversation?: {
		conversation_id?: string | null;
		team_id?: string | null;
		team_name?: string | null;
		channel_id?: string | null;
		channel_name?: string | null;
		thread_id?: string | null;
		status?: string | null;
		agent_name?: string | null;
		messages?: Array<{
			id?: string | null;
			author?: string | null;
			direction?: string | null;
			contents?: string | null;
			occurred_at?: string | null;
			is_error?: boolean | null;
		}> | null;
	} | null;
};

export type AmikaSlackOrgSettings = {
	org_id?: string | null;
	repository_id?: string | null;
	agent_name?: string | null;
	system_prompt?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type AmikaSlackSeenChannel = {
	slack_team_id?: string | null;
	slack_team_name?: string | null;
	slack_channel_id?: string | null;
	slack_channel_name?: string | null;
	last_seen_at?: string | null;
};

export type AmikaSshPublicKeySummary = {
	id?: string | null;
	name?: string | null;
	public_key?: string | null;
	scope?: string | null;
};

export type AmikaTerminalTicketResponse = {
	ticket?: string | null;
	org_id?: string | null;
};

export type AmikaOperationInputs = {
	'agentCredentials.claude.check': {
		id: string;
	};
	'agentCredentials.claude.create': {
		name: string;
		value: string;
		type: 'oauth' | 'api_key';
		scope?: 'user' | 'org';
	};
	'agentCredentials.claude.delete': {
		id: string;
	};
	'agentCredentials.claude.list': Record<string, never>;
	'agentCredentials.codex.create': {
		name: string;
		value: string;
		type: 'oauth' | 'api_key';
		scope?: 'user' | 'org';
	};
	'agentCredentials.codex.delete': {
		id: string;
	};
	'agentCredentials.codex.list': Record<string, never>;
	'agentCredentials.pi.delete': Record<string, never>;
	'agentCredentials.pi.get': Record<string, never>;
	'agentCredentials.pi.set': {
		authJson?: string;
		source?: {
			agent: 'claude' | 'codex';
			secretId: string;
		};
	};
	'agentSessions.get': {
		id: string;
	};
	'agentSessions.list': {
		limit?: number;
		offset?: number | null;
	};
	'agentSessions.send': {
		message: string;
		agent?: 'claude' | 'codex';
		session_id?: string;
		/** Route into the sandbox with this id instead of a fresh one. Matches by id only; send `sandbox_name` or `sandbox_ref` to name the sandbox. At most one of `sandbox_id`, `sandbox_name`, `sandbox_ref`. */
		sandbox_id?: string;
		/** Route into the sandbox with this name instead of a fresh one. At most one of `sandbox_id`, `sandbox_name`, `sandbox_ref`. */
		sandbox_name?: string;
		/** Route into the sandbox with this id or name instead of a fresh one; 409 `resource_ref_ambiguous` if the value is one sandbox's id and another's name. At most one of `sandbox_id`, `sandbox_name`, `sandbox_ref`. */
		sandbox_ref?: string;
		new_session?: boolean;
		model?:
			| 'fable'
			| 'opus'
			| 'sonnet'
			| 'haiku'
			| 'gpt-5.6-sol'
			| 'gpt-5.6-terra'
			| 'gpt-5.6-luna'
			| 'gpt-5.5'
			| 'gpt-5.2'
			| null;
		effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max' | null;
		repo_url?: string;
		branch?: string;
		new_branch_name?: string;
	};
	'apiKeys.create': {
		/** Human-readable name for the API key. */
		name: string;
		/** Scope of the key to create. Defaults to `organization`; pass `user` to mint a key owned by the calling user. */
		scope?: 'organization' | 'user';
	};
	'apiKeys.delete': {
		/** WorkOS API key id. */
		id: string;
		/** Scope of the key to delete. Defaults to `organization`; pass `user` to revoke a user-scoped key. */
		scope?: 'organization' | 'user';
	};
	'apiKeys.list': {
		/** Restrict the listing to a single scope. Omit to list both organization- and user-scoped keys merged together. */
		scope?: 'organization' | 'user';
		/** Pagination cursor returned by a previous list call. */
		after?: string;
		/** Maximum number of API keys to return. */
		limit?: number;
	};
	'cloudAccounts.create': {
		provider: 'instabox';
		name: string;
		/** The provider API key. Stored encrypted; never returned. */
		api_key: string;
		/** Make this the provider's default account. Omitted means false. True unsets the provider's previous default. */
		is_default?: boolean;
	};
	'cloudAccounts.delete': {
		/** Cloud account id (`cacc_…`) or name. `by` sets how to read it. */
		ref: string;
		/** How to read `{ref}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches more than one account. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Only match an account on this provider. A name is unique per provider, so this picks one when the org uses the name on several. */
		provider?: 'instabox';
	};
	'cloudAccounts.get': {
		/** Cloud account id (`cacc_…`) or name. `by` sets how to read it. */
		ref: string;
		/** How to read `{ref}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches more than one account. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Only match an account on this provider. A name is unique per provider, so this picks one when the org uses the name on several. */
		provider?: 'instabox';
	};
	'cloudAccounts.list': {
		/** Only accounts on this provider. */
		provider?: 'instabox';
	};
	'cloudAccounts.listSizes': {
		/** Cloud account id (`cacc_…`) or name. `by` sets how to read it. */
		ref: string;
		/** How to read `{ref}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches more than one account. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Only match an account on this provider. A name is unique per provider, so this picks one when the org uses the name on several. */
		provider?: 'instabox';
	};
	'cloudAccounts.update': {
		/** Cloud account id (`cacc_…`) or name. `by` sets how to read it. */
		ref: string;
		/** How to read `{ref}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches more than one account. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Only match an account on this provider. A name is unique per provider, so this picks one when the org uses the name on several. */
		provider?: 'instabox';
		name?: string;
		/** Replace the stored provider API key. */
		api_key?: string;
		/** True makes this the provider's default account and unsets the previous one. False unsets it. */
		is_default?: boolean;
	};
	'commandRuns.cancel': {
		/** Command run id (`cr_…`). */
		id: string;
	};
	'commandRuns.create': {
		/** Idempotency-Key header: a retry with the same key and body returns the run or job this key already made. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		/** Existing rig to run on, by id. */
		rig_id?: string;
		/** Existing rig to run on, by name. */
		rig_name?: string;
		/** Existing rig to run on, by id or name. Returns 409 `resource_ref_ambiguous` if the value matches one rig's id and another rig's name. */
		rig_ref?: string;
		/** Create a new rig with this `POST /rigs` body, then run on it. Returns 409 `sandbox_name_conflict` if the name is in use. */
		rig_create?: {
			name: string;
			repo_url?: string;
			git_url?: string;
			github_url?: string;
			branch?: string;
			new_branch_name?: string;
			provider?:
				| 'daytona'
				| 'e2b'
				| 'freestyle'
				| 'vercel'
				| 'instabox'
				| 'smol'
				| 'lume'
				| 'amika-hostd'
				| 'simulate';
			host_id?: string;
			/** Run the rig in this connected cloud account (by id). At most one of cloud_account_id, cloud_account_name, cloud_account_ref. Cannot be combined with host_id. */
			cloud_account_id?: string;
			/** Run the rig in the connected cloud account with this name; `amika` means Amika Cloud. `provider` narrows the name. */
			cloud_account_name?: string;
			/** Run the rig in the connected cloud account with this id or name. */
			cloud_account_ref?: string;
			/** With `host_id`, the host runtime to run the rig on (`smol`, `lume`). Omitted, the rig runs on its preset's default runtime on that host. Requires `host_id`. */
			runtime?: string;
			/** With `host_id`, the rig's resources, in place of a named `size`: 1 to 16 vCPUs, at least 64 MiB of memory in whole MiB, and a disk of at least 1 GiB. Requires `host_id`, and cannot be combined with `size`. */
			resources?: {
				vcpus: number;
				memoryGib: number;
				diskGib: number;
			};
			auto_stop_interval?: number;
			auto_delete_interval?: number;
			amika_opencode_web?: string | number | AmikaJsonValue | null;
			env_vars?: Record<string, string>;
			secret_env_vars?: Record<string, string>;
			disabled_repo_env_var_names?: Array<string>;
			setup_script_text?: string;
			skip_setup_script?: boolean;
			agent_credentials?: Array<{
				kind: 'claude' | 'codex';
				name?: string;
				type?: 'oauth' | 'api_key';
				none?: true;
			}>;
			preset?: 'coder' | 'coder-plus-docker' | 'macos-coder';
			/** Providerless sandbox size (for example `a0.m`). Legacy names such as `m` and `medium` are also accepted. The provider is inferred from `provider` or the server default; when omitted, the size defaults to that provider's medium tier. With `host_id`, names one of the host's own sizes instead; a… */
			size?: string;
			snapshot?: string | null;
			integration_ids?: Array<string>;
			agent?: 'claude' | 'codex';
			github_auth_mode?: 'pat' | 'app_token';
			/** The Amika API key the rig gets as `AMIKA_API_KEY`. `{"mode": "new", "scope": "org"}` (default): a new organization key. `{"mode": "new", "scope": "user"}`: a new key for the calling user; a caller with no user cannot use it. `{"mode": "none"}`: no key, and `AMIKA_API_KEY` is not set. A new key… */
			amika_api_key?:
				| {
						mode: 'new';
						scope: 'org' | 'user';
				  }
				| {
						mode: 'none';
				  };
		};
		/** FIFO lane on the rig. Runs in one session start in creation order, one at a time. Runs in different sessions run in parallel. Default `default`. */
		session?: string;
		/** Shell command. Amika runs it with `bash -e -o pipefail`. */
		command: string;
		/** Maximum run time of the command, in milliseconds. The clock starts when the command process starts. At the limit, the conclusion is `timed_out`. */
		timeout_ms: number;
		/** Maximum wait from creation until the command process starts, in milliseconds. The wait includes the session queue, rig start, and workspace setup. At the limit, the conclusion is `queue_timed_out`. Omit for no limit. */
		queue_timeout_ms?: number;
		/** Status to give the rig when its last incomplete run finishes. If more than one run sets it, the run that started last decides. Omit to restore the rig's status from before the runs. */
		rig_status_on_finish?: 'active' | 'stopped' | 'deleted';
		/** Working directory of the command. Absolute, or relative to the agent directory (`AMIKA_AGENT_CWD`). Default: the agent directory. */
		cwd?: string;
	};
	'commandRuns.get': {
		/** Command run id (`cr_…`). */
		id: string;
	};
	'commandRuns.list': {
		/** Only runs on this rig. `rig_by` sets how to read the value. */
		rig?: string;
		/** How to read `rig`: `id`, `name`, or `ref` (id or name; the default). `name_or_id` is an alias for `ref`. */
		rig_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Only runs in this session. */
		session?: string;
		/** Only runs with this status. */
		status?: 'queued' | 'in_progress' | 'completed';
		/** Only runs with this source kind. */
		source_kind?: 'api' | 'github_actions' | 'github_actions_runner' | 'job';
		/** Only runs with this canonical source id. Requires `source_kind`. For `job`, the id is the job id. */
		source_id?: string;
		/** Maximum number of runs to return. 1 to 100, default 20. */
		limit?: number;
	};
	'commandRuns.listEvents': {
		/** Command run id (`cr_…`). */
		id: string;
		/** Return events with a sequence number greater than this value. Send the `next_sequence` of the previous response. Default 0. */
		after?: number | null;
		/** Maximum number of events to return. 1 to 200, default 100. */
		limit?: number;
	};
	'gitUserSettings.get': Record<string, never>;
	'gitUserSettings.set': {
		name: string;
		email: string;
	};
	'hosts.checkHealth': {
		id: string;
	};
	'hosts.create': {
		hostname: string;
		url?: string | null;
		secret: string;
		sizes?: Record<
			string,
			{
				vcpus: number;
				memoryGib: number;
				diskGib: number;
				diskGrowOnly: boolean;
			}
		>;
		capabilities?: AmikaHostCapabilitiesInput;
		transport_mode?: 'listen' | 'tunnel';
	};
	'hosts.delete': {
		id: string;
	};
	'hosts.enrol': {
		id: string;
	};
	'hosts.get': {
		id: string;
	};
	'hosts.list': Record<string, never>;
	'hosts.replace': {
		id: string;
		hostname: string;
		url?: string | null;
		secret?: string;
		sizes?: Record<
			string,
			{
				vcpus: number;
				memoryGib: number;
				diskGib: number;
				diskGrowOnly: boolean;
			}
		>;
		capabilities?: AmikaHostCapabilitiesInput;
		transport_mode?: 'listen' | 'tunnel';
	};
	'integrations.disconnect': {
		provider: string;
	};
	'integrations.list': Record<string, never>;
	'jobRuns.cancel': {
		/** Job run id (`jr_…`). */
		id: string;
	};
	'jobRuns.get': {
		/** Job run id (`jr_…`). */
		id: string;
	};
	'jobRuns.list': {
		/** Only job runs of this job, by id. */
		job_id?: string;
		/** Only job runs of this job, by name. */
		job_name?: string;
		/** Only job runs of this job, by id or name. */
		job_ref?: string;
		/** Only job runs on this rig. `rig_by` sets how to read the value. */
		rig?: string;
		/** How to read `rig`: `id`, `name`, or `ref` (id or name; the default). `name_or_id` is an alias for `ref`. */
		rig_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Only job runs with this status. */
		status?:
			| 'pending'
			| 'running'
			| 'succeeded'
			| 'failed'
			| 'skipped'
			| 'cancelled';
		/** Only job runs with this trigger kind. */
		trigger_kind?: 'cron' | 'manual';
		/** Maximum number of job runs to return. 1 to 100, default 20. */
		limit?: number;
		/** `true`: return only the latest matching job run of each job, sorted by job id, in pages. */
		latest_per_job?: 'true' | 'false';
		/** Send the `next_cursor` of the previous page. Requires `latest_per_job=true`. */
		cursor?: string;
	};
	'jobRuns.start': {
		/** Idempotency-Key header: a retry with the same key and body returns the run or job this key already made. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		/** Job to run, by id. */
		job_id?: string;
		/** Job to run, by name. */
		job_name?: string;
		/** Job to run, by id or name. Returns 409 `resource_ref_ambiguous` if the value matches one job's id and another job's name. */
		job_ref?: string;
	};
	'jobs.create': {
		/** Idempotency-Key header: a retry with the same key and body returns the run or job this key already made. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		/** Unique name in the organization. */
		name: string;
		/** Free text for people. */
		description?: string;
		trigger: AmikaJobTriggerInput;
		/** 1 to 20 commands. A job run runs them in order, one command run each. A step starts only after the previous step succeeds. */
		steps: Array<AmikaJobStepInput>;
		/** Status to give the rig when the job run ends, after success or failure. When set, the rig stays up between steps. Omit to restore the rig's status from before the job run. */
		rig_status_on_finish?: 'active' | 'stopped' | 'deleted';
		/** `skip` (default): do not start a scheduled job run while an earlier run of this job is `pending` or `running`; record it as `skipped`. `allow`: start it. */
		overlap_policy?: 'skip' | 'allow';
		/** Set `false` to create the job paused. Default `true`. */
		enabled?: boolean;
	};
	'jobs.delete': {
		/** Job id (`job_…`) or name. `by` sets how to read it. */
		job: string;
		/** How to read `{job}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches one job's id and another job's name. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'jobs.get': {
		/** Job id (`job_…`) or name. `by` sets how to read it. */
		job: string;
		/** How to read `{job}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches one job's id and another job's name. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'jobs.list': {
		/** `true`: only enabled jobs. `false`: only paused jobs. */
		enabled?: 'true' | 'false';
		/** Only jobs with this trigger kind. */
		trigger_kind?: 'cron';
		/** Maximum number of jobs to return. 1 to 100, default 50. */
		limit?: number;
		/** Send the `next_cursor` of the previous page. */
		cursor?: string;
	};
	'jobs.update': {
		/** Job id (`job_…`) or name. `by` sets how to read it. */
		job: string;
		/** How to read `{job}`: `id`, `name`, or `ref` (id or name; the default). `ref` returns 409 `resource_ref_ambiguous` if the value matches one job's id and another job's name. `name_or_id` is an alias for `ref`. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Unique name in the organization. */
		name?: string;
		/** Free text for people. Null clears it. */
		description?: string | null;
		/** `false` pauses the job. `true` resumes it at its next future time. Missed times do not run. */
		enabled?: boolean;
		trigger?: AmikaJobTriggerInput;
		/** Replaces the whole list. Job runs that already started keep their steps. */
		steps?: Array<AmikaJobStepInput>;
		/** Status to give the rig when the job run ends, after success or failure. When set, the rig stays up between steps. Omit to restore the rig's status from before the job run. Null clears it. */
		rig_status_on_finish?: 'active' | 'stopped' | 'deleted' | null;
		/** `skip` (default): do not start a scheduled job run while an earlier run of this job is `pending` or `running`; record it as `skipped`. `allow`: start it. */
		overlap_policy?: 'skip' | 'allow';
	};
	'linear.settings.get': Record<string, never>;
	'linear.settings.set': {
		repository_id: string | null;
		agent_name: 'claude' | 'codex' | null;
		system_prompt: string | null;
	};
	'repositories.clearImage': {
		id: string;
	};
	'repositories.get': {
		id: string;
	};
	'repositories.integrations.list': {
		id: string;
	};
	'repositories.integrations.set': {
		id: string;
		integrations: Array<
			| {
					name: string;
					mcp_server_type: 'http';
					mcp_server_url: string;
			  }
			| {
					name: 'playwright';
					mcp_server_type: 'stdio';
					mcp_server_url?: string;
			  }
		>;
	};
	'repositories.list': Record<string, never>;
	'repositories.upsert': {
		repo_url: string;
		setup_script?: string;
		start_script?: string;
		sandbox_preset?: string | null;
		sandbox_size?: string | null;
		default_snapshot?: string | null;
	};
	'rigs.create': {
		name: string;
		repo_url?: string;
		git_url?: string;
		github_url?: string;
		branch?: string;
		new_branch_name?: string;
		provider?:
			| 'daytona'
			| 'e2b'
			| 'freestyle'
			| 'vercel'
			| 'instabox'
			| 'smol'
			| 'lume'
			| 'amika-hostd'
			| 'simulate';
		host_id?: string;
		/** Run the rig in this connected cloud account (by id). At most one of cloud_account_id, cloud_account_name, cloud_account_ref. Cannot be combined with host_id. */
		cloud_account_id?: string;
		/** Run the rig in the connected cloud account with this name; `amika` means Amika Cloud. `provider` narrows the name. */
		cloud_account_name?: string;
		/** Run the rig in the connected cloud account with this id or name. */
		cloud_account_ref?: string;
		/** With `host_id`, the host runtime to run the rig on (`smol`, `lume`). Omitted, the rig runs on its preset's default runtime on that host. Requires `host_id`. */
		runtime?: string;
		/** With `host_id`, the rig's resources, in place of a named `size`: 1 to 16 vCPUs, at least 64 MiB of memory in whole MiB, and a disk of at least 1 GiB. Requires `host_id`, and cannot be combined with `size`. */
		resources?: {
			vcpus: number;
			memoryGib: number;
			diskGib: number;
		};
		auto_stop_interval?: number;
		auto_delete_interval?: number;
		amika_opencode_web?: string | number | AmikaJsonValue | null;
		env_vars?: Record<string, string>;
		secret_env_vars?: Record<string, string>;
		disabled_repo_env_var_names?: Array<string>;
		setup_script_text?: string;
		skip_setup_script?: boolean;
		agent_credentials?: Array<{
			kind: 'claude' | 'codex';
			name?: string;
			type?: 'oauth' | 'api_key';
			none?: true;
		}>;
		preset?: 'coder' | 'coder-plus-docker' | 'macos-coder';
		/** Providerless sandbox size (for example `a0.m`). Legacy names such as `m` and `medium` are also accepted. The provider is inferred from `provider` or the server default; when omitted, the size defaults to that provider's medium tier. With `host_id`, names one of the host's own sizes instead; a… */
		size?: string;
		snapshot?: string | null;
		integration_ids?: Array<string>;
		agent?: 'claude' | 'codex';
		github_auth_mode?: 'pat' | 'app_token';
		/** The Amika API key the rig gets as `AMIKA_API_KEY`. `{"mode": "new", "scope": "org"}` (default): a new organization key. `{"mode": "new", "scope": "user"}`: a new key for the calling user; a caller with no user cannot use it. `{"mode": "none"}`: no key, and `AMIKA_API_KEY` is not set. A new key… */
		amika_api_key?:
			| {
					mode: 'new';
					scope: 'org' | 'user';
			  }
			| {
					mode: 'none';
			  };
	};
	'rigs.createSshSession': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.createTerminalTicket': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.delete': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Delete Amika's record of the rig even if its host or provider cannot be reached to destroy the machine. The machine is left running. */
		forget?: 'true' | 'false';
	};
	'rigs.get': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.getSlackConversation': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.getSlackMetadata': Record<string, never>;
	'rigs.list': {
		/** If set, only return rigs on this one of the organization's own hosts. */
		host_id?: string;
		/** Set to `false` to skip reading each active rig's live state from its provider. Statuses are then derived from stored state, and rows whose status is unconfirmed carry `live_state_pending: true`. */
		live_state?: 'true' | 'false';
	};
	'rigs.listIntegrations': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.listLifecycleEvents': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.services.create': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Service name: a single DNS label, unique per sandbox. */
		name: string;
		/** Container port the service listens on. */
		port: number;
		/** URL scheme the gateway serves the service over. */
		url_scheme: 'http' | 'https';
	};
	'rigs.services.createToken': {
		id: string;
		/** Service reference: its name (default) or row id. Use `by` to choose. */
		ref: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** How to interpret the service `{ref}`: name (default), id, or ref/name_or_id (matches either; rejects ambiguity). */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** How long the token lives, in seconds: 1 to 86400. Defaults to an hour. */
		ttl_seconds?: number;
	};
	'rigs.services.delete': {
		id: string;
		/** Service reference: its name (default) or row id. Use `by` to choose. */
		ref: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** How to interpret the service `{ref}`: name (default), id, or ref/name_or_id (matches either; rejects ambiguity). */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.services.list': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.services.replace': {
		id: string;
		/** Service reference: its name (default) or row id. Use `by` to choose. */
		ref: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** How to interpret the service `{ref}`: name (default), id, or ref/name_or_id (matches either; rejects ambiguity). */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		/** Service name: a single DNS label, unique per sandbox. */
		name: string;
		/** Container port the service listens on. */
		port: number;
		/** URL scheme the gateway serves the service over. */
		url_scheme: 'http' | 'https';
	};
	'rigs.sessions.create': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		agent_name: string;
		metadata?: Record<string, AmikaJsonValue | null>;
	};
	'rigs.sessions.get': {
		id: string;
		sessionId: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.sessions.getLatest': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'rigs.sessions.list': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		status?: string;
		limit?: number;
		offset?: number | null;
		agent_name?: string;
		exclude_source?: string;
		source?: string;
	};
	'rigs.sessions.update': {
		id: string;
		sessionId: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		sandbox_by?: 'name' | 'id' | 'ref' | 'name_or_id';
		status?: 'active' | 'completed' | 'failed';
		metadata?: Record<string, AmikaJsonValue | null>;
	};
	'rigs.start': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
		skip_start_script?: 'true' | 'false';
	};
	'rigs.stop': {
		id: string;
		/** How to interpret the sandbox `{id}` path param: ref/name_or_id (default; matches an id or a name and rejects an ambiguous match with 409 `resource_ref_ambiguous`), name, or id. */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'secrets.create': {
		name: string;
		value: string;
		scope?: 'user' | 'org';
		description?: string | null;
	};
	'secrets.delete': {
		id: string;
	};
	'secrets.list': Record<string, never>;
	'secrets.sshPublicKeys.delete': {
		id: string;
	};
	'secrets.sshPublicKeys.list': Record<string, never>;
	'secrets.sshPublicKeys.upsert': {
		name: string;
		public_key: string;
	};
	'secrets.update': {
		id: string;
		name?: string;
		value?: string;
		scope?: 'user' | 'org';
		description?: string | null;
	};
	'serviceDefinitions.create': {
		repo_url: string;
		name: string;
		ports: Array<{
			port: number;
			protocol?: 'tcp' | 'udp';
			url_scheme?: 'http' | 'https' | null;
		}>;
	};
	'serviceDefinitions.delete': {
		id: string;
	};
	'serviceDefinitions.update': {
		id: string;
		name: string;
		ports: Array<{
			port: number;
			protocol?: 'tcp' | 'udp';
			url_scheme?: 'http' | 'https' | null;
		}>;
	};
	'services.list': {
		/** Only this sandbox's services, by sandbox id. */
		sandbox_id?: string;
		/** Only this sandbox's services, by sandbox name. */
		sandbox_name?: string;
		/** Only this sandbox's services, by id or name (rejected if both match). */
		sandbox_ref?: string;
	};
	'slack.channelSettings.delete': {
		slack_team_id: string;
		slack_channel_id: string;
	};
	'slack.channelSettings.list': Record<string, never>;
	'slack.channelSettings.set': {
		slack_team_id: string;
		slack_channel_id: string;
		repository_id?: string | null;
		agent_name?: 'claude' | 'codex' | null;
		system_prompt?: string | null;
	};
	'slack.settings.get': Record<string, never>;
	'slack.settings.set': {
		repository_id: string | null;
		agent_name: 'claude' | 'codex' | null;
		system_prompt: string | null;
	};
	'snapshots.create': {
		/** Source sandbox, by id. */
		sandbox_id?: string;
		/** Source sandbox, by name. */
		sandbox_name?: string;
		/** Source sandbox, by id or name; rejected if both match. */
		sandbox_ref?: string;
		name: string;
		description?: string;
		/** scrub_and_delete (default): remove Amika-injected secrets (credential files + injected env vars) from the sandbox, capture the snapshot from the clean filesystem, then delete the source sandbox. full: capture everything as-is — including secrets — and keep the sandbox running. */
		mode?: 'scrub_and_delete' | 'full';
	};
	'snapshots.delete': {
		/** Snapshot reference: its fully-qualified name (default) or row id. Use the `by` query param to choose. */
		ref: string;
		/** How to interpret the reference: name (default), id, or ref/name_or_id (matches either; rejects ambiguity). */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'snapshots.get': {
		/** Snapshot reference: its fully-qualified name (default) or row id. Use the `by` query param to choose. */
		ref: string;
		/** How to interpret the reference: name (default), id, or ref/name_or_id (matches either; rejects ambiguity). */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
	'snapshots.list': {
		/** If set, only return snapshots taken from sandboxes attached to this repository. */
		repository_id?: string;
		/** If set, only return snapshots captured from this sandbox, by sandbox id. An id that names no sandbox returns an empty list. */
		source_sandbox_id?: string;
		/** If set, only return snapshots captured from this sandbox, by sandbox name. 404 when no sandbox has the name. */
		source_sandbox_name?: string;
		/** If set, only return snapshots captured from this sandbox, by id or name. 404 when neither matches; 409 `resource_ref_ambiguous` when the value is one sandbox's id and another's name. */
		source_sandbox_ref?: string;
	};
	'snapshots.previewScrub': {
		/** The sandbox whose injected secrets would be scrubbed. */
		sandbox?: string;
		/** How to interpret `sandbox`: name (default), id, or ref/name_or_id (matches either; rejects ambiguity). */
		by?: 'name' | 'id' | 'ref' | 'name_or_id';
	};
};

export type AmikaOperationOutputs = {
	'agentCredentials.claude.check': AmikaCredentialCheckResponse;
	'agentCredentials.claude.create': AmikaSecretSummary;
	'agentCredentials.claude.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'agentCredentials.claude.list': AmikaListCredentialsResponse;
	'agentCredentials.codex.create': AmikaSecretSummary;
	'agentCredentials.codex.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'agentCredentials.codex.list': AmikaListCredentialsResponse;
	'agentCredentials.pi.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'agentCredentials.pi.get': AmikaPiStatus;
	'agentCredentials.pi.set': AmikaPiStatus;
	'agentSessions.get': AmikaAgentSessionDetail;
	'agentSessions.list': AmikaListAgentSessionsResponse;
	'agentSessions.send': AmikaAgentSessionSendResponse;
	'apiKeys.create': AmikaApiKeyWithValue;
	'apiKeys.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'apiKeys.list': AmikaListApiKeysResponse;
	'cloudAccounts.create': AmikaCloudAccount;
	'cloudAccounts.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'cloudAccounts.get': AmikaCloudAccount;
	'cloudAccounts.list': AmikaListCloudAccountsResponse;
	'cloudAccounts.listSizes': AmikaCloudAccountSizes;
	'cloudAccounts.update': AmikaCloudAccount;
	'commandRuns.cancel': AmikaCommandRun;
	'commandRuns.create': AmikaCommandRun;
	'commandRuns.get': AmikaCommandRun;
	'commandRuns.list': AmikaListCommandRunsResponse;
	'commandRuns.listEvents': AmikaListCommandRunEventsResponse;
	'gitUserSettings.get': AmikaGitUserSettingsResponse;
	'gitUserSettings.set': AmikaGitUserSettingsRow;
	'hosts.checkHealth': AmikaHostHealthResponse;
	'hosts.create': AmikaHost;
	'hosts.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'hosts.enrol': AmikaHostEnrolmentResponse;
	'hosts.get': AmikaHost;
	'hosts.list': Array<AmikaHostListItem>;
	'hosts.replace': AmikaHost;
	'integrations.disconnect': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'integrations.list': AmikaListIntegrationCredentialsResponse;
	'jobRuns.cancel': AmikaJobRun;
	'jobRuns.get': AmikaJobRun;
	'jobRuns.list': AmikaListJobRunsResponse;
	'jobRuns.start': AmikaJobRun;
	'jobs.create': AmikaJob;
	'jobs.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'jobs.get': AmikaJob;
	'jobs.list': AmikaListJobsResponse;
	'jobs.update': AmikaJob;
	'linear.settings.get': AmikaLinearOrgSettings;
	'linear.settings.set': AmikaLinearOrgSettings;
	'repositories.clearImage': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'repositories.get': AmikaRepository;
	'repositories.integrations.list': AmikaRepoIntegrationsResponse;
	'repositories.integrations.set': AmikaRepoIntegrationsResponse;
	'repositories.list': AmikaListRepositoriesResponse;
	'repositories.upsert': AmikaRepository;
	'rigs.create': AmikaRig;
	'rigs.createSshSession': AmikaDirectWebSocketSshSessionResponse;
	'rigs.createTerminalTicket': AmikaTerminalTicketResponse;
	'rigs.delete': AmikaOkStatus;
	'rigs.get': AmikaGetSandboxResponse;
	'rigs.getSlackConversation': AmikaSlackConversationResponse;
	'rigs.getSlackMetadata': AmikaSandboxSlackMetadataResponse;
	'rigs.list': AmikaListSandboxesResponse;
	'rigs.listIntegrations': AmikaSandboxIntegrationsResponse;
	'rigs.listLifecycleEvents': AmikaSandboxLifecycleEventsResponse;
	'rigs.services.create': AmikaSandboxService;
	'rigs.services.createToken': AmikaSandboxServiceToken;
	'rigs.services.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'rigs.services.list': AmikaListSandboxServicesResponse;
	'rigs.services.replace': AmikaSandboxService;
	'rigs.sessions.create': AmikaAgentSessionDetail;
	'rigs.sessions.get': AmikaAgentSessionDetail;
	'rigs.sessions.getLatest': AmikaAgentSessionDetail;
	'rigs.sessions.list': AmikaAgentSessionsList;
	'rigs.sessions.update': AmikaAgentSessionDetail;
	'rigs.start': AmikaOkStatus;
	'rigs.stop': AmikaOkStatus;
	'secrets.create': AmikaSecretSummary;
	'secrets.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'secrets.list': AmikaListSecretsResponse;
	'secrets.sshPublicKeys.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'secrets.sshPublicKeys.list': AmikaListSshPublicKeysResponse;
	'secrets.sshPublicKeys.upsert': AmikaSshPublicKeySummary;
	'secrets.update': AmikaSecretSummary;
	'serviceDefinitions.create': AmikaServiceDefinition;
	'serviceDefinitions.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'serviceDefinitions.update': AmikaServiceDefinition;
	'services.list': AmikaListSandboxServicesResponse;
	'slack.channelSettings.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'slack.channelSettings.list': AmikaSlackChannelSettingsList;
	'slack.channelSettings.set': AmikaSlackChannelSettings;
	'slack.settings.get': AmikaSlackOrgSettings;
	'slack.settings.set': AmikaSlackOrgSettings;
	'snapshots.create': AmikaSandboxSnapshot;
	'snapshots.delete': {
		/** Amika accepted the call; it answers with no body. */
		success: true;
	};
	'snapshots.get': AmikaSandboxSnapshot;
	'snapshots.list': AmikaListSandboxSnapshotsResponse;
	'snapshots.previewScrub': AmikaSandboxScrubPreviewResponse;
};
