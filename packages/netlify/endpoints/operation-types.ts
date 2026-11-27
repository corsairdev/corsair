// Generated from Netlify's swagger (open-api.netlify.com/swagger.json, version 2.63.1,
// fetched 2026-11-27); netlify-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput } from 'corsair/http';

export type NetlifyJsonValue =
	| null
	| boolean
	| number
	| string
	| NetlifyJsonValue[]
	| { [key: string]: NetlifyJsonValue | undefined };

export const NETLIFY_OPERATION_IDS = [
	'accounts.audit.list',
	'accounts.builds.status',
	'accounts.cancel',
	'accounts.create',
	'accounts.get',
	'accounts.list',
	'accounts.listTypes',
	'accounts.members.add',
	'accounts.members.get',
	'accounts.members.list',
	'accounts.members.remove',
	'accounts.members.update',
	'accounts.sites.create',
	'accounts.sites.list',
	'accounts.update',
	'agentRunners.archive',
	'agentRunners.commitToBranch',
	'agentRunners.create',
	'agentRunners.createPullRequest',
	'agentRunners.createUploadUrl',
	'agentRunners.delete',
	'agentRunners.get',
	'agentRunners.getDiff',
	'agentRunners.list',
	'agentRunners.sessions.answer',
	'agentRunners.sessions.create',
	'agentRunners.sessions.delete',
	'agentRunners.sessions.get',
	'agentRunners.sessions.list',
	'agentRunners.sessions.stop',
	'agentRunners.sessions.update',
	'agentRunners.stop',
	'agentRunners.update',
	'aiGateway.getAccountToken',
	'aiGateway.getSiteToken',
	'aiGateway.listProviders',
	'billing.paymentMethods.list',
	'builds.appendLog',
	'builds.get',
	'builds.notifyStart',
	'cache.purge',
	'deployKeys.create',
	'deployKeys.delete',
	'deployKeys.get',
	'deployKeys.list',
	'deploys.cancel',
	'deploys.delete',
	'deploys.get',
	'deploys.lock',
	'deploys.unlock',
	'deploys.updateValidationsReport',
	'deploys.uploadEdgeFunction',
	'deploys.uploadFile',
	'deploys.uploadFunction',
	'deploys.uploadServer',
	'dns.records.create',
	'dns.records.delete',
	'dns.records.get',
	'dns.records.list',
	'dns.zones.create',
	'dns.zones.delete',
	'dns.zones.get',
	'dns.zones.list',
	'dns.zones.transfer',
	'env.create',
	'env.delete',
	'env.deleteValue',
	'env.get',
	'env.list',
	'env.listForSite',
	'env.setValue',
	'env.update',
	'forms.submissions.list',
	'hooks.create',
	'hooks.delete',
	'hooks.enable',
	'hooks.get',
	'hooks.list',
	'hooks.listTypes',
	'hooks.update',
	'oauth.tickets.create',
	'oauth.tickets.exchange',
	'oauth.tickets.get',
	'services.get',
	'services.getManifest',
	'services.list',
	'sites.agentRunnerHooks.create',
	'sites.agentRunnerHooks.delete',
	'sites.agentRunnerHooks.get',
	'sites.agentRunnerHooks.list',
	'sites.agentRunnerHooks.update',
	'sites.agentRunners.create',
	'sites.assets.create',
	'sites.assets.delete',
	'sites.assets.get',
	'sites.assets.getPublicSignature',
	'sites.assets.list',
	'sites.assets.update',
	'sites.buildHooks.create',
	'sites.buildHooks.delete',
	'sites.buildHooks.get',
	'sites.buildHooks.list',
	'sites.buildHooks.update',
	'sites.builds.create',
	'sites.builds.list',
	'sites.create',
	'sites.database.branches.create',
	'sites.database.branches.delete',
	'sites.database.branches.get',
	'sites.database.branches.list',
	'sites.database.branches.reset',
	'sites.database.branches.setComputeSettings',
	'sites.database.compute.clear',
	'sites.database.compute.get',
	'sites.database.compute.set',
	'sites.database.create',
	'sites.database.delete',
	'sites.database.get',
	'sites.database.migrations.get',
	'sites.database.migrations.list',
	'sites.database.migrations.run',
	'sites.database.snapshots.create',
	'sites.database.snapshots.delete',
	'sites.database.snapshots.list',
	'sites.database.snapshots.restore',
	'sites.delete',
	'sites.deployedBranches.list',
	'sites.deploys.create',
	'sites.deploys.delete',
	'sites.deploys.get',
	'sites.deploys.list',
	'sites.deploys.restore',
	'sites.deploys.rollback',
	'sites.deploys.update',
	'sites.devServerHooks.create',
	'sites.devServerHooks.delete',
	'sites.devServerHooks.get',
	'sites.devServerHooks.list',
	'sites.devServerHooks.update',
	'sites.devServers.create',
	'sites.devServers.deleteAll',
	'sites.devServers.get',
	'sites.devServers.list',
	'sites.devServers.markActivity',
	'sites.devServers.updateState',
	'sites.disable',
	'sites.dns.configure',
	'sites.dns.get',
	'sites.enable',
	'sites.files.get',
	'sites.files.list',
	'sites.forms.delete',
	'sites.forms.list',
	'sites.functions.list',
	'sites.get',
	'sites.identity.users.get',
	'sites.identity.users.lookup',
	'sites.list',
	'sites.metadata.get',
	'sites.metadata.update',
	'sites.serviceInstances.create',
	'sites.serviceInstances.delete',
	'sites.serviceInstances.get',
	'sites.serviceInstances.list',
	'sites.serviceInstances.update',
	'sites.snippets.create',
	'sites.snippets.delete',
	'sites.snippets.get',
	'sites.snippets.list',
	'sites.snippets.update',
	'sites.splitTests.create',
	'sites.splitTests.get',
	'sites.splitTests.list',
	'sites.splitTests.publish',
	'sites.splitTests.unpublish',
	'sites.splitTests.update',
	'sites.ssl.get',
	'sites.ssl.listCertificates',
	'sites.ssl.provision',
	'sites.submissions.list',
	'sites.unlinkRepo',
	'sites.update',
	'submissions.delete',
	'submissions.get',
	'user.me',
] as const;

export type NetlifyOperationId = (typeof NETLIFY_OPERATION_IDS)[number];

/** Metadata associated with a snapshot */
export type NetlifyDatabaseSnapshotMetadataInput = {
	/** Deploy information associated with the snapshot */
	deploy?: Record<string, NetlifyJsonValue>;
	/** The source that created the snapshot */
	source?: string;
};

export type NetlifyDeployInput = {
	id?: string;
	site_id?: string;
	user_id?: string;
	build_id?: string;
	state?: string;
	name?: string;
	url?: string;
	ssl_url?: string;
	admin_url?: string;
	deploy_url?: string;
	deploy_ssl_url?: string;
	screenshot_url?: string;
	review_id?: number;
	draft?: boolean;
	required?: Array<string>;
	required_functions?: Array<string>;
	/** An array of code_shas for the edge-function bundles that need to be uploaded to complete the deploy. */
	required_edge_functions?: Array<string>;
	/** The SHA256 digest of the deploy's Netlify Server bundle, when it still needs to be uploaded to complete the deploy. A deploy has at most one server, so this holds either nothing or a single digest. */
	required_server?: Array<string>;
	error_message?: string;
	branch?: string;
	commit_ref?: string;
	commit_url?: string;
	skipped?: boolean;
	created_at?: string;
	updated_at?: string;
	published_at?: string;
	title?: string;
	context?: string;
	locked?: boolean;
	review_url?: string;
	framework?: string;
	skew_protection_token?: string;
	function_schedules?: Array<NetlifyFunctionScheduleInput>;
	/** The functions region for this deploy as an airport code. */
	functions_region?: string;
	/** Functions in the deploy that explicitly specify their own region (airport code). */
	functions_region_overrides?: Array<{
		name?: string;
		region?: string;
	}>;
};

export type NetlifyDeployEnvironmentVariableInput = {
	key: string;
	value: string;
	is_secret: boolean;
	scopes: Array<'builds' | 'functions' | 'runtime' | 'post-processing'>;
};

/** Environment variable value model definition */
export type NetlifyEnvVarValueInput = {
	/** The environment variable value's universally unique ID */
	id?: string;
	/** The environment variable's unencrypted value */
	value?: string;
	/** The deploy context in which this value will be used. `dev` refers to local development when running `netlify dev`. */
	context?:
		| 'all'
		| 'dev'
		| 'dev-server'
		| 'branch-deploy'
		| 'deploy-preview'
		| 'production'
		| 'branch';
	/** An additional parameter for custom branches. Currently, this is used for specifying a branch name when `context=branch`. */
	context_parameter?: string;
};

export type NetlifyExcludedFunctionRouteInput = {
	pattern?: string;
	literal?: string;
	expression?: string;
};

export type NetlifyFunctionConfigInput = {
	display_name?: string;
	generator?: string;
	build_data?: Record<string, NetlifyJsonValue>;
	/** The function's memory allocation in MB. Mutually exclusive with `vcpu`. */
	memory?: number;
	routes?: Array<NetlifyFunctionRouteInput>;
	excluded_routes?: Array<NetlifyExcludedFunctionRouteInput>;
	priority?: number;
	region?: string;
	traffic_rules?: NetlifyTrafficRulesConfigInput;
	/** Number of vCPUs to provision for the function. Allowed range is 0.5–2. */
	vcpu?: number;
	event_subscriptions?: Array<string>;
};

export type NetlifyFunctionRouteInput = {
	pattern?: string;
	literal?: string;
	expression?: string;
	methods?: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'>;
	prefer_static?: boolean;
};

export type NetlifyFunctionScheduleInput = {
	name?: string;
	cron?: string;
};

export type NetlifyMetadataInput = Record<string, NetlifyJsonValue>;

export type NetlifyRepoInfoInput = {
	id?: number;
	provider?: string;
	deploy_key_id?: string;
	repo_path?: string;
	repo_branch?: string;
	dir?: string;
	/** The directory where Netlify can find your compiled functions to deploy them. Defaults to netlify/functions if not set. You can also define and override this setting in your project’s netlify.toml file. */
	functions_dir?: string;
	/** The build command to run. This is the command that Netlify runs to build your site. If a site has a netlify.toml file with a build command it will override this value. */
	cmd?: string;
	allowed_branches?: Array<string>;
	public_repo?: boolean;
	private_logs?: boolean;
	repo_url?: string;
	env?: Record<string, string>;
	installation_id?: number;
	/** When true, Netlify will not build your project automatically. You can build locally via the CLI and then publish new deploys manually via the CLI or the API. */
	stop_builds?: boolean;
};

export type NetlifyTrafficRulesAggregateConfigInput = {
	keys?: Array<{
		type?: 'ip' | 'domain';
	}>;
};

export type NetlifyTrafficRulesConfigInput = {
	action?: {
		type?: string;
		config?: {
			to?: string;
			rate_limit_config?: NetlifyTrafficRulesRateLimitConfigInput;
			aggregate?: NetlifyTrafficRulesAggregateConfigInput;
		};
	};
};

export type NetlifyTrafficRulesRateLimitConfigInput = {
	algorithm?: 'sliding_window';
	window_size?: number;
	window_limit?: number;
};

export type NetlifyDeployValidationsReport = {
	/** The id of the deploy validations report */
	id?: string | null;
	/** The id of the deploy */
	deploy_id?: string | null;
	secret_scan_result?: NetlifyDeployValidationsReportSecretScanResult | null;
};

export type NetlifyDeployValidationsReportSecretScanResult = {
	/** The number of files scanned */
	scannedFilesCount?: number | null;
	/** The list of secrets scan matches */
	secretsScanMatches?: Array<string> | null;
};

export type NetlifyAccessToken = {
	id?: string | null;
	access_token?: string | null;
	user_id?: string | null;
	user_email?: string | null;
	created_at?: string | null;
};

export type NetlifyAccountMembership = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	type?: string | null;
	capabilities?: {
		sites?: NetlifyAccountUsageCapability | null;
		collaborators?: NetlifyAccountUsageCapability | null;
	} | null;
	billing_name?: string | null;
	billing_email?: string | null;
	billing_details?: string | null;
	billing_period?: string | null;
	payment_method_id?: string | null;
	type_name?: string | null;
	type_id?: string | null;
	owner_ids?: Array<string> | null;
	roles_allowed?: Array<string> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type NetlifyAccountType = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	capabilities?: Record<string, NetlifyJsonValue> | null;
	/** Price in dollars (Netlify sends a string for some plans). */
	monthly_dollar_price?: (number | string) | null;
	/** Price in dollars (Netlify sends a string for some plans). */
	yearly_dollar_price?: (number | string) | null;
	/** Price in dollars (Netlify sends a string for some plans). */
	monthly_seats_addon_dollar_price?: (number | string) | null;
	/** Price in dollars (Netlify sends a string for some plans). */
	yearly_seats_addon_dollar_price?: (number | string) | null;
};

export type NetlifyAccountUsageCapability = {
	included?: number | null;
	used?: number | null;
};

export type NetlifyAgentRunner = {
	id?: string | null;
	site_id?: string | null;
	parent_agent_runner_id?: string | null;
	/** One of `new`, `running`, `await_input`, `interrupted`, `error`, `done`, `cancelled` or `archived`. */
	state?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	done_at?: string | null;
	title?: string | null;
	branch?: string | null;
	result_branch?: string | null;
	pr_url?: string | null;
	pr_branch?: string | null;
	/** One of `open`, `draft`, `merged` or `closed`. */
	pr_state?: string | null;
	pr_number?: number | null;
	pr_is_being_created?: boolean | null;
	pr_error?: string | null;
	/** What the agent is working on in the active session. */
	current_task?: string | null;
	result_diff?: string | null;
	sha?: string | null;
	merge_commit_sha?: string | null;
	merge_commit_error?: string | null;
	merge_commit_is_being_created?: boolean | null;
	base_deploy_id?: string | null;
	attached_file_keys?: Array<string> | null;
	active_session_created_at?: string | null;
	/** Whether the run has changes, available from `GET /agent_runners/{agent_runner_id}/diff`. */
	has_result_diff?: boolean | null;
	latest_session_deploy_id?: string | null;
	latest_session_deploy_url?: string | null;
	/** State of the deploy building the latest preview. Null until that deploy exists; `ready` once the preview is live. */
	preview_state?: string | null;
	user?: NetlifyAgentRunnerUser | null;
};

export type NetlifyAgentRunnerHook = {
	id?: string | null;
	site_id?: string | null;
	title?: string | null;
	branch?: string | null;
	prompt?: string | null;
	agent?: string | null;
	url?: string | null;
	msg?: string | null;
	created_at?: string | null;
};

export type NetlifyAgentRunnerHookCreated = NetlifyAgentRunnerHook & {
	secret?: string | null;
};

export type NetlifyAgentRunnerSession = {
	id?: string | null;
	agent_runner_id?: string | null;
	dev_server_id?: string | null;
	/** One of `new`, `running`, `await_input`, `interrupted`, `error`, `done` or `cancelled`. */
	state?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	done_at?: string | null;
	/** When the session paused waiting on an interaction. Null once it resumes. */
	paused_at?: string | null;
	title?: string | null;
	prompt?: string | null;
	agent_config?: NetlifyAgentRunnerSessionConfig | null;
	/** The agent's summary of what it did. */
	result?: string | null;
	result_diff?: string | null;
	commit_sha?: string | null;
	deploy_id?: string | null;
	/** URL of the session's deploy preview. */
	deploy_url?: string | null;
	duration?: number | null;
	usage?: NetlifyAgentRunnerSessionUsage | null;
	/** Questions and requests from the agent, keyed by reference ID. A pending one pauses the session in `await_input` until it's answered or skipped. */
	interactions?: Record<string, NetlifyAgentRunnerSessionInteraction> | null;
	steps?: Array<NetlifyAgentRunnerSessionStep> | null;
	user?: NetlifyAgentRunnerUser | null;
	attached_file_keys?: Array<string> | null;
	result_zip_file_name?: string | null;
	is_published?: boolean | null;
};

export type NetlifyAgentRunnerSessionConfig = {
	agent?: string | null;
	model?: string | null;
};

export type NetlifyAgentRunnerSessionInteraction = {
	/** One of `question`, `authorization` or `setup_request`. Only questions can be answered; the others can only be skipped. */
	type?: string | null;
	/** One of `pending`, `answered` or `skipped`. */
	status?: string | null;
	/** For a question, an array of questions, each with `question`, an optional `header`, `multiSelect` and `options` (each with `label` and an optional `description`). For `authorization` and `setup_request`, an object describing the request. */
	payload?: NetlifyJsonValue | null;
	/** Answers aligned to `payload`; null entries were skipped. */
	response?: Array<NetlifyJsonValue> | null;
};

export type NetlifyAgentRunnerSessionStep = {
	title?: string | null;
	message?: string | null;
};

export type NetlifyAgentRunnerSessionUsage = {
	total_input_tokens?: number | null;
	total_output_tokens?: number | null;
	total_cached_input_tokens?: number | null;
	total_cached_output_tokens?: number | null;
	total_tokens?: number | null;
	/** Credits the session used. */
	total_credits_cost?: number | null;
};

export type NetlifyAgentRunnerUser = {
	id?: string | null;
	full_name?: string | null;
	email?: string | null;
	avatar_url?: string | null;
};

export type NetlifyAiGatewayToken = {
	/** The AI Gateway authentication token */
	token?: string | null;
	/** AI gateway base url */
	url?: string | null;
	/** Unix timestamp when the token expires */
	expires_at?: number | null;
};

export type NetlifyAsset = {
	id?: string | null;
	site_id?: string | null;
	creator_id?: string | null;
	name?: string | null;
	state?: string | null;
	content_type?: string | null;
	url?: string | null;
	key?: string | null;
	visibility?: string | null;
	size?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type NetlifyAssetForm = {
	url?: string | null;
	fields?: Record<string, string> | null;
};

export type NetlifyAssetPublicSignature = {
	url?: string | null;
};

export type NetlifyAssetSignature = {
	form?: NetlifyAssetForm | null;
	asset?: NetlifyAsset | null;
};

export type NetlifyAuditLog = {
	id?: string | null;
	account_id?: string | null;
	payload?: {
		actor_id?: string | null;
		actor_name?: string | null;
		actor_email?: string | null;
		action?: string | null;
		timestamp?: string | null;
		log_type?: string | null;
	} | null;
};

export type NetlifyBuild = {
	id?: string | null;
	deploy_id?: string | null;
	sha?: string | null;
	done?: boolean | null;
	error?: string | null;
	created_at?: string | null;
};

export type NetlifyBuildHook = {
	id?: string | null;
	title?: string | null;
	branch?: string | null;
	url?: string | null;
	site_id?: string | null;
	created_at?: string | null;
};

export type NetlifyBuildStatus = {
	active?: number | null;
	pending_concurrency?: number | null;
	enqueued?: number | null;
	build_count?: number | null;
	minutes?: {
		current?: number | null;
		current_average_sec?: number | null;
		previous?: number | null;
		period_start_date?: string | null;
		period_end_date?: string | null;
		last_updated_at?: string | null;
		included_minutes?: string | null;
		included_minutes_with_packs?: string | null;
	} | null;
};

/** Compute endpoint status for a branch */
export type NetlifyDatabaseBranchCompute = {
	/** The current state of the compute endpoint */
	current_state?: string | null;
	/** Minimum compute units for autoscaling */
	autoscaling_limit_min_cu?: number | null;
	/** Maximum compute units for autoscaling */
	autoscaling_limit_max_cu?: number | null;
	/** Seconds of inactivity before the compute endpoint is suspended */
	suspend_timeout_seconds?: number | null;
	/** When the compute endpoint was last active */
	last_active?: string | null;
};

/** Detailed information about a database branch */
export type NetlifyDatabaseBranchDetail = {
	/** The branch identifier */
	branch_id?: string | null;
	/** The branch name */
	name?: string | null;
	/** The connection string for the branch */
	connection_string?: string | null;
	/** The current state of the branch */
	state?: string | null;
	/** The logical size of the branch in bytes */
	logical_size_bytes?: number | null;
	/** When the branch was created */
	created_at?: string | null;
	/** When the branch was last updated */
	updated_at?: string | null;
	/** When the branch was last active */
	last_active_at?: string | null;
	compute?: NetlifyDatabaseBranchCompute | null;
	/** Metadata associated with the branch */
	metadata?: Record<string, NetlifyJsonValue> | null;
};

/** Response containing the database branch connection string */
export type NetlifyDatabaseBranchResponse = {
	/** The connection string for the database branch */
	connection_string?: string | null;
	/** Metadata associated with the branch */
	metadata?: Record<string, NetlifyJsonValue> | null;
};

/** Response containing a list of database branches */
export type NetlifyDatabaseBranchesResponse = {
	/** List of database branches */
	branches?: Array<NetlifyDatabaseBranchDetail> | null;
};

/** Compute settings for a database or branch */
export type NetlifyDatabaseComputeSettings = {
	/** Minimum compute units */
	min_cu?: number | null;
	/** Maximum compute units */
	max_cu?: number | null;
	/** Seconds of inactivity before suspension */
	sleep_timeout_seconds?: number | null;
};

/** A migration available to a database branch */
export type NetlifyDatabaseMigration = {
	/** The migration version number */
	version?: number | null;
	/** The migration name */
	name?: string | null;
	/** The path to the migration file in the deploy bundle */
	path?: string | null;
	/** Whether this migration has been applied to the branch */
	applied?: boolean | null;
};

/** A migration with its file contents */
export type NetlifyDatabaseMigrationDetail = {
	/** The migration version number */
	version?: number | null;
	/** The migration name */
	name?: string | null;
	/** The path to the migration file in the deploy bundle */
	path?: string | null;
	/** The raw contents of the migration file */
	content?: string | null;
};

/** Response containing the database connection string */
export type NetlifyDatabaseResponse = {
	/** The connection string for the database */
	connection_string?: string | null;
};

/** A point-in-time snapshot of a database branch */
export type NetlifyDatabaseSnapshot = {
	/** The unique identifier of the snapshot */
	id?: string | null;
	/** The ID of the branch that was snapshotted */
	source_branch_id?: string | null;
	/** Whether this snapshot was manually created */
	manual?: boolean | null;
	/** When the snapshot was created */
	created_at?: string | null;
	/** When the snapshot expires */
	expires_at?: string | null;
	/** The point-in-time timestamp of the snapshot */
	timestamp?: string | null;
	metadata?: NetlifyDatabaseSnapshotMetadata | null;
};

/** Metadata associated with a snapshot */
export type NetlifyDatabaseSnapshotMetadata = {
	/** Deploy information associated with the snapshot */
	deploy?: Record<string, NetlifyJsonValue> | null;
	/** The source that created the snapshot */
	source?: string | null;
};

/** Response containing a list of database snapshots */
export type NetlifyDatabaseSnapshotsResponse = {
	/** List of database snapshots */
	snapshots?: Array<NetlifyDatabaseSnapshot> | null;
};

export type NetlifyDeploy = {
	id?: string | null;
	site_id?: string | null;
	user_id?: string | null;
	build_id?: string | null;
	state?: string | null;
	name?: string | null;
	url?: string | null;
	ssl_url?: string | null;
	admin_url?: string | null;
	deploy_url?: string | null;
	deploy_ssl_url?: string | null;
	screenshot_url?: string | null;
	review_id?: number | null;
	draft?: boolean | null;
	required?: Array<string> | null;
	required_functions?: Array<string> | null;
	/** An array of code_shas for the edge-function bundles that need to be uploaded to complete the deploy. */
	required_edge_functions?: Array<string> | null;
	/** The SHA256 digest of the deploy's Netlify Server bundle, when it still needs to be uploaded to complete the deploy. A deploy has at most one server, so this holds either nothing or a single digest. */
	required_server?: Array<string> | null;
	error_message?: string | null;
	branch?: string | null;
	commit_ref?: string | null;
	commit_url?: string | null;
	skipped?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	published_at?: string | null;
	title?: string | null;
	context?: string | null;
	locked?: boolean | null;
	review_url?: string | null;
	framework?: string | null;
	skew_protection_token?: string | null;
	function_schedules?: Array<NetlifyFunctionSchedule> | null;
	/** The functions region for this deploy as an airport code. */
	functions_region?: string | null;
	/** Functions in the deploy that explicitly specify their own region (airport code). */
	functions_region_overrides?: Array<{
		name?: string | null;
		region?: string | null;
	}> | null;
};

export type NetlifyDeployKey = {
	id?: string | null;
	public_key?: string | null;
	created_at?: string | null;
};

export type NetlifyDeployedBranch = {
	id?: string | null;
	deploy_id?: string | null;
	name?: string | null;
	slug?: string | null;
	url?: string | null;
	ssl_url?: string | null;
};

export type NetlifyDevServer = {
	id?: string | null;
	site_id?: string | null;
	branch?: string | null;
	url?: string | null;
	state?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	starting_at?: string | null;
	error_at?: string | null;
	live_at?: string | null;
	done_at?: string | null;
	title?: string | null;
};

export type NetlifyDevServerHook = {
	id?: string | null;
	title?: string | null;
	branch?: string | null;
	url?: string | null;
	site_id?: string | null;
	created_at?: string | null;
	type?: string | null;
};

export type NetlifyDnsRecord = {
	id?: string | null;
	hostname?: string | null;
	type?: string | null;
	value?: string | null;
	ttl?: number | null;
	priority?: number | null;
	dns_zone_id?: string | null;
	site_id?: string | null;
	flag?: number | null;
	tag?: string | null;
	managed?: boolean | null;
};

export type NetlifyDnsRecords = Array<NetlifyDnsRecord>;

export type NetlifyDnsZone = {
	id?: string | null;
	name?: string | null;
	errors?: Array<string> | null;
	supported_record_types?: Array<string> | null;
	user_id?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	records?: Array<NetlifyDnsRecord> | null;
	dns_servers?: Array<string> | null;
	account_id?: string | null;
	site_id?: string | null;
	account_slug?: string | null;
	account_name?: string | null;
	domain?: string | null;
	ipv6_enabled?: boolean | null;
	dedicated?: boolean | null;
};

export type NetlifyDnsZones = Array<NetlifyDnsZone>;

/** Environment variable model definition */
export type NetlifyEnvVar = {
	/** The environment variable key, like ALGOLIA_ID (case-sensitive) */
	key?: string | null;
	/** The scopes that this environment variable is set to */
	scopes?: Array<string> | null;
	/** An array of Value objects containing values and metadata */
	values?: Array<NetlifyEnvVarValue> | null;
	/** Secret values are only readable by code running on Netlify's systems. With secrets, only the local development context values are readable from the UI, API, and CLI. By default, environment variable values are not secret. */
	is_secret?: boolean | null;
	/** The timestamp of when the value was last updated */
	updated_at?: string | null;
	updated_by?: NetlifyEnvVarUser | null;
};

export type NetlifyEnvVarUser = {
	/** The user's unique identifier */
	id?: string | null;
	/** The user's full name (first and last) */
	full_name?: string | null;
	/** The user's email address */
	email?: string | null;
	/** A URL pointing to the user's avatar */
	avatar_url?: string | null;
};

/** Environment variable value model definition */
export type NetlifyEnvVarValue = {
	/** The environment variable value's universally unique ID */
	id?: string | null;
	/** The environment variable's unencrypted value */
	value?: string | null;
	/** The deploy context in which this value will be used. `dev` refers to local development when running `netlify dev`. */
	context?: string | null;
	/** An additional parameter for custom branches. Currently, this is used for specifying a branch name when `context=branch`. */
	context_parameter?: string | null;
};

export type NetlifyFile = {
	id?: string | null;
	path?: string | null;
	sha?: string | null;
	mime_type?: string | null;
	size?: number | null;
};

export type NetlifyForm = {
	id?: string | null;
	site_id?: string | null;
	name?: string | null;
	paths?: Array<string> | null;
	submission_count?: number | null;
	fields?: Array<Record<string, NetlifyJsonValue>> | null;
	created_at?: string | null;
};

export type NetlifyFunction = {
	id?: string | null;
	name?: string | null;
	sha?: string | null;
	region?: string | null;
};

export type NetlifyFunctionSchedule = {
	name?: string | null;
	cron?: string | null;
};

export type NetlifyHook = {
	id?: string | null;
	site_id?: string | null;
	type?: string | null;
	event?: string | null;
	data?: Record<string, NetlifyJsonValue> | null;
	created_at?: string | null;
	updated_at?: string | null;
	disabled?: boolean | null;
};

export type NetlifyHookType = {
	name?: string | null;
	events?: Array<string> | null;
	fields?: Array<Record<string, NetlifyJsonValue>> | null;
};

export type NetlifyIdentityUser = {
	id?: string | null;
	email?: string | null;
	aud?: string | null;
	role?: string | null;
	confirmed_at?: string | null;
	invited_at?: string | null;
	confirmation_sent_at?: string | null;
	recovery_sent_at?: string | null;
	email_change_sent_at?: string | null;
	last_sign_in_at?: string | null;
	app_metadata?: {
		provider?: string | null;
		roles?: Array<string> | null;
	} | null;
	user_metadata?: Record<string, NetlifyJsonValue> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Response containing the list of migrations for a branch */
export type NetlifyListDatabaseMigrationsResponse = {
	/** List of migrations */
	migrations?: Array<NetlifyDatabaseMigration> | null;
};

export type NetlifyMember = {
	id?: string | null;
	full_name?: string | null;
	email?: string | null;
	avatar?: string | null;
	role?: string | null;
};

export type NetlifyMetadata = Record<string, NetlifyJsonValue>;

export type NetlifyPaymentMethod = {
	id?: string | null;
	method_name?: string | null;
	type?: string | null;
	state?: string | null;
	data?: {
		card_type?: string | null;
		last4?: string | null;
		email?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type NetlifyProviderDefinition = {
	token_env_var?: string | null;
	url_env_var?: string | null;
	models?: Array<string> | null;
};

export type NetlifyRepoInfo = {
	id?: number | null;
	provider?: string | null;
	deploy_key_id?: string | null;
	repo_path?: string | null;
	repo_branch?: string | null;
	dir?: string | null;
	/** The directory where Netlify can find your compiled functions to deploy them. Defaults to netlify/functions if not set. You can also define and override this setting in your project’s netlify.toml file. */
	functions_dir?: string | null;
	/** The build command to run. This is the command that Netlify runs to build your site. If a site has a netlify.toml file with a build command it will override this value. */
	cmd?: string | null;
	allowed_branches?: Array<string> | null;
	public_repo?: boolean | null;
	private_logs?: boolean | null;
	repo_url?: string | null;
	env?: Record<string, string> | null;
	installation_id?: number | null;
	/** When true, Netlify will not build your project automatically. You can build locally via the CLI and then publish new deploys manually via the CLI or the API. */
	stop_builds?: boolean | null;
};

/** Response for a database branch reset */
export type NetlifyResetDatabaseBranchResponse = {
	/** Whether the branch was actually re-forked. False when the target was already in sync with the source and `force=true` was not set. */
	reset?: boolean | null;
	/** The connection string for the reset (or unchanged) branch */
	connection_string?: string | null;
	/** Metadata associated with the branch */
	metadata?: Record<string, NetlifyJsonValue> | null;
};

export type NetlifyService = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	service_path?: string | null;
	long_description?: string | null;
	description?: string | null;
	events?: Array<Record<string, NetlifyJsonValue>> | null;
	tags?: Array<string> | null;
	icon?: string | null;
	manifest_url?: string | null;
	environments?: Array<string> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type NetlifyServiceInstance = {
	id?: string | null;
	url?: string | null;
	config?: Record<string, NetlifyJsonValue> | null;
	external_attributes?: Record<string, NetlifyJsonValue> | null;
	service_slug?: string | null;
	service_path?: string | null;
	service_name?: string | null;
	env?: Record<string, NetlifyJsonValue> | null;
	snippets?: Array<Record<string, NetlifyJsonValue>> | null;
	auth_url?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type NetlifySite = {
	id?: string | null;
	state?: string | null;
	plan?: string | null;
	name?: string | null;
	custom_domain?: string | null;
	domain_aliases?: Array<string> | null;
	branch_deploy_custom_domain?: string | null;
	deploy_preview_custom_domain?: string | null;
	password?: string | null;
	notification_email?: string | null;
	url?: string | null;
	ssl_url?: string | null;
	admin_url?: string | null;
	screenshot_url?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	user_id?: string | null;
	session_id?: string | null;
	ssl?: boolean | null;
	force_ssl?: boolean | null;
	managed_dns?: boolean | null;
	deploy_url?: string | null;
	published_deploy?: NetlifyDeploy | null;
	account_id?: string | null;
	account_name?: string | null;
	account_slug?: string | null;
	git_provider?: string | null;
	deploy_hook?: string | null;
	/** Feature flags and limits of the site's plan (strings, booleans, numbers or objects). */
	capabilities?: Record<string, NetlifyJsonValue> | null;
	processing_settings?: {
		html?: {
			pretty_urls?: boolean | null;
		} | null;
	} | null;
	build_settings?: NetlifyRepoInfo | null;
	id_domain?: string | null;
	default_hooks_data?: {
		access_token?: string | null;
	} | null;
	build_image?: string | null;
	prerender?: string | null;
	functions_region?: string | null;
	prevent_non_git_prod_deploys?: boolean | null;
	/** The site's Netlify Identity instance, when Identity is on (pass it to sites.identity.users.*). */
	identity_instance_id?: string | null;
};

export type NetlifySiteFunction = {
	branch?: string | null;
	created_at?: string | null;
	functions?: Array<Record<string, NetlifyJsonValue>> | null;
	id?: string | null;
	log_type?: string | null;
	provider?: string | null;
};

export type NetlifySniCertificate = {
	state?: string | null;
	domains?: Array<string> | null;
	created_at?: string | null;
	updated_at?: string | null;
	expires_at?: string | null;
};

export type NetlifySnippet = {
	/** The snippet's id (Netlify sends it as a string). */
	id?: (number | string) | null;
	site_id?: string | null;
	title?: string | null;
	general?: string | null;
	general_position?: string | null;
	goal?: string | null;
	goal_position?: string | null;
};

export type NetlifySplitTest = {
	id?: string | null;
	site_id?: string | null;
	name?: string | null;
	path?: string | null;
	branches?: Array<Record<string, NetlifyJsonValue>> | null;
	active?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	unpublished_at?: string | null;
};

export type NetlifySplitTests = Array<NetlifySplitTest>;

export type NetlifySubmission = {
	id?: string | null;
	number?: number | null;
	email?: string | null;
	name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	company?: string | null;
	summary?: string | null;
	body?: string | null;
	data?: Record<string, NetlifyJsonValue> | null;
	created_at?: string | null;
	site_url?: string | null;
};

export type NetlifyTicket = {
	id?: string | null;
	client_id?: string | null;
	authorized?: boolean | null;
	created_at?: string | null;
};

export type NetlifyUser = {
	id?: string | null;
	uid?: string | null;
	full_name?: string | null;
	avatar_url?: string | null;
	email?: string | null;
	affiliate_id?: string | null;
	site_count?: number | null;
	created_at?: string | null;
	last_login?: string | null;
	login_providers?: Array<string> | null;
	onboarding_progress?: {
		slides?: string | null;
	} | null;
};

export type NetlifyWebhookPayloads = {
	deploy: NetlifyDeploy;
	devServer: NetlifyDevServer;
	splitTest: NetlifySplitTest;
	submission: NetlifySubmission;
};

export type NetlifyOperationInputs = {
	'accounts.audit.list': {
		account_id: string;
		query?: string;
		log_type?: string;
		page?: number;
		per_page?: number;
	};
	'accounts.builds.status': {
		account_id: string;
	};
	'accounts.cancel': {
		account_id: string;
	};
	'accounts.create': {
		name: string;
		type_id: string;
		payment_method_id?: string;
		period?: 'monthly' | 'yearly';
		extra_seats_block?: number;
	};
	'accounts.get': {
		account_id: string;
	};
	'accounts.list': {
		minimal?: boolean;
	};
	'accounts.listTypes': Record<string, never>;
	'accounts.members.add': {
		account_slug: string;
		role?: 'Owner' | 'Developer' | 'Billing Admin' | 'Reviewer';
		email?: string;
	};
	'accounts.members.get': {
		account_slug: string;
		member_id: string;
	};
	'accounts.members.list': {
		account_slug: string;
	};
	'accounts.members.remove': {
		account_slug: string;
		member_id: string;
	};
	'accounts.members.update': {
		account_slug: string;
		member_id: string;
		role?: 'Owner' | 'Developer' | 'Billing Admin' | 'Reviewer';
		site_access?: 'all' | 'none' | 'selected';
		site_ids?: Array<string>;
	};
	'accounts.sites.create': {
		configure_dns?: boolean;
		account_slug: string;
		id?: string;
		state?: string;
		plan?: string;
		name?: string;
		custom_domain?: string;
		domain_aliases?: Array<string>;
		branch_deploy_custom_domain?: string;
		deploy_preview_custom_domain?: string;
		password?: string;
		notification_email?: string;
		url?: string;
		ssl_url?: string;
		admin_url?: string;
		screenshot_url?: string;
		created_at?: string;
		updated_at?: string;
		user_id?: string;
		session_id?: string;
		ssl?: boolean;
		force_ssl?: boolean;
		managed_dns?: boolean;
		deploy_url?: string;
		published_deploy?: NetlifyDeployInput;
		account_id?: string;
		account_name?: string;
		git_provider?: string;
		deploy_hook?: string;
		capabilities?: Record<string, Record<string, NetlifyJsonValue>>;
		processing_settings?: {
			html?: {
				pretty_urls?: boolean;
			};
		};
		build_settings?: NetlifyRepoInfoInput;
		id_domain?: string;
		default_hooks_data?: {
			access_token?: string;
		};
		build_image?: string;
		prerender?: string;
		functions_region?: string;
		prevent_non_git_prod_deploys?: boolean;
		repo?: NetlifyRepoInfoInput;
	};
	'accounts.sites.list': {
		name?: string;
		account_slug: string;
		page?: number;
		per_page?: number;
	};
	'accounts.update': {
		account_id: string;
		name?: string;
		slug?: string;
		type_id?: string;
		extra_seats_block?: number;
		billing_name?: string;
		billing_email?: string;
		billing_details?: string;
	};
	'agentRunners.archive': {
		agent_runner_id: string;
	};
	'agentRunners.commitToBranch': {
		agent_runner_id: string;
		target_branch: string;
	};
	'agentRunners.create': {
		site_id: string;
		deploy_id?: string;
		branch?: string;
		prompt?: string;
		agent?: string;
		model?: string;
		parent_agent_runner_id?: string;
		dev_server_image?: string;
		file_keys?: Array<string>;
	};
	'agentRunners.createPullRequest': {
		agent_runner_id: string;
	};
	'agentRunners.createUploadUrl': {
		account_id: string;
		filename: string;
		content_type: string;
	};
	'agentRunners.delete': {
		agent_runner_id: string;
	};
	'agentRunners.get': {
		agent_runner_id: string;
	};
	'agentRunners.getDiff': {
		agent_runner_id: string;
		page?: number;
		per_page?: number;
		/** Replace binary file contents with a placeholder, keeping the file headers. */
		strip_binary?: boolean;
	};
	'agentRunners.list': {
		site_id: string;
		account_id: string;
		page?: number;
		per_page?: number;
		/** Only runs in this state: `new`, `running`, `await_input`, `interrupted`, `error`, `done`, `cancelled` or `archived`. */
		state?: string;
		title?: string;
		branch?: string;
		result_branch?: string;
		/** Only runs started by this user. */
		user_id?: string;
		/** Unix timestamp. Only runs created at or after this time. */
		from?: number;
		/** Unix timestamp. Only runs created before this time. */
		to?: number;
	};
	'agentRunners.sessions.answer': {
		agent_runner_id: string;
		agent_runner_session_id: string;
		/** Key of the pending interaction in the session's `interactions`. */
		refId: string;
		/** One entry per question in the interaction's `payload`: a string, an array of strings for a multi-select question, or null to skip that question. */
		response?: Array<NetlifyJsonValue>;
		/** Skip the whole interaction instead of answering it. */
		skipped?: boolean;
		/** Instruction for the agent when skipping. */
		instruction?: string;
	};
	'agentRunners.sessions.create': {
		agent_runner_id: string;
		/** Use the request body instead. */
		prompt?: string;
		/** Use the request body instead. */
		agent?: string;
		/** Use the request body instead. */
		model?: string;
		/** Use the request body instead. */
		file_keys?: Array<string>;
		/** `normal` (the default) changes code; `ask` answers questions without changing code. */
		mode?: 'normal' | 'ask';
	};
	'agentRunners.sessions.delete': {
		agent_runner_id: string;
		agent_runner_session_id: string;
	};
	'agentRunners.sessions.get': {
		agent_runner_id: string;
		agent_runner_session_id: string;
	};
	'agentRunners.sessions.list': {
		agent_runner_id: string;
		page?: number;
		per_page?: number;
		/** Only sessions in this state: `new`, `running`, `await_input`, `interrupted`, `error`, `done` or `cancelled`. */
		state?: string;
		/** Unix timestamp. Only sessions created at or after this time. */
		from?: number;
		/** Unix timestamp. Only sessions created before this time. */
		to?: number;
		order_by?: 'asc' | 'desc';
	};
	'agentRunners.sessions.stop': {
		agent_runner_id: string;
		agent_runner_session_id: string;
	};
	'agentRunners.sessions.update': {
		agent_runner_id: string;
		agent_runner_session_id: string;
		is_published?: boolean;
	};
	'agentRunners.stop': {
		agent_runner_id: string;
	};
	'agentRunners.update': {
		agent_runner_id: string;
	};
	'aiGateway.getAccountToken': {
		/** The account ID */
		account_id: string;
	};
	'aiGateway.getSiteToken': {
		/** The site ID */
		site_id: string;
	};
	'aiGateway.listProviders': Record<string, never>;
	'billing.paymentMethods.list': Record<string, never>;
	'builds.appendLog': {
		build_id: string;
		message?: string;
		error?: boolean;
		section?:
			| 'initializing'
			| 'building'
			| 'deploying'
			| 'cleanup'
			| 'postprocessing';
	};
	'builds.get': {
		build_id: string;
	};
	'builds.notifyStart': {
		build_id: string;
		buildbot_version?: string;
		build_version?: string;
		task_id?: string;
	};
	'cache.purge': {
		site_id?: string;
		site_slug?: string;
		cache_tags?: Array<string>;
	};
	'deployKeys.create': Record<string, never>;
	'deployKeys.delete': {
		key_id: string;
	};
	'deployKeys.get': {
		key_id: string;
	};
	'deployKeys.list': Record<string, never>;
	'deploys.cancel': {
		deploy_id: string;
	};
	'deploys.delete': {
		deploy_id: string;
	};
	'deploys.get': {
		deploy_id: string;
	};
	'deploys.lock': {
		deploy_id: string;
	};
	'deploys.unlock': {
		deploy_id: string;
	};
	'deploys.updateValidationsReport': {
		/** The ID of the deploy */
		deploy_id: string;
		secrets_scan?: Record<string, NetlifyJsonValue>;
	};
	'deploys.uploadEdgeFunction': {
		deploy_id: string;
		code_sha: string;
		/** How many times this upload was retried before (sent as X-Nf-Retry-Count). */
		retry_count?: number;
		/** The file to upload: its bytes are the whole request body. */
		file: FileInput;
	};
	'deploys.uploadFile': {
		deploy_id: string;
		path: string;
		size?: number;
		/** The file to upload: its bytes are the whole request body. */
		file: FileInput;
	};
	'deploys.uploadFunction': {
		deploy_id: string;
		name: string;
		runtime?: string;
		invocation_mode?: string;
		timeout?: number;
		size?: number;
		/** How many times this upload was retried before (sent as X-Nf-Retry-Count). */
		retry_count?: number;
		/** The file to upload: its bytes are the whole request body. */
		file: FileInput;
	};
	'deploys.uploadServer': {
		deploy_id: string;
		code_sha: string;
		size?: number;
		/** How many times this upload was retried before (sent as X-Nf-Retry-Count). */
		retry_count?: number;
		/** The file to upload: its bytes are the whole request body. */
		file: FileInput;
	};
	'dns.records.create': {
		zone_id: string;
		type?: string;
		hostname?: string;
		value?: string;
		ttl?: number;
		priority?: number;
		weight?: number;
		port?: number;
		flag?: number;
		tag?: string;
	};
	'dns.records.delete': {
		zone_id: string;
		dns_record_id: string;
	};
	'dns.records.get': {
		zone_id: string;
		dns_record_id: string;
	};
	'dns.records.list': {
		zone_id: string;
	};
	'dns.zones.create': {
		account_slug?: string;
		site_id?: string;
		name?: string;
	};
	'dns.zones.delete': {
		zone_id: string;
	};
	'dns.zones.get': {
		zone_id: string;
	};
	'dns.zones.list': {
		account_slug?: string;
	};
	'dns.zones.transfer': {
		zone_id: string;
		/** the account of the dns zone */
		account_id: string;
		/** the account you want to transfer the dns zone to */
		transfer_account_id: string;
		/** the user you want to transfer the dns zone to */
		transfer_user_id: string;
	};
	'env.create': {
		/** Scope response to account_id */
		account_id: string;
		/** If provided, create an environment variable on the site level, not the account level */
		site_id?: string;
		env_vars?: Array<{
			/** The existing or new name of the key, if you wish to rename it (case-sensitive) */
			key?: string;
			/** The scopes that this environment variable is set to (Pro plans and above) */
			scopes?: Array<'builds' | 'functions' | 'runtime' | 'post-processing'>;
			values?: Array<NetlifyEnvVarValueInput>;
			/** Secret values are only readable by code running on Netlify's systems. With secrets, only the local development context values are readable from the UI, API, and CLI. By default, environment variable values are not secret. */
			is_secret?: boolean;
		}>;
	};
	'env.delete': {
		/** Scope response to account_id */
		account_id: string;
		/** The environment variable key (case-sensitive) */
		key: string;
		/** If provided, delete the environment variable from this site */
		site_id?: string;
	};
	'env.deleteValue': {
		/** Scope response to account_id */
		account_id: string;
		/** The environment variable value's ID */
		id: string;
		/** The environment variable key name (case-sensitive) */
		key: string;
		/** If provided, delete the value from an environment variable on this site */
		site_id?: string;
	};
	'env.get': {
		/** Scope response to account_id */
		account_id: string;
		/** The environment variable key (case-sensitive) */
		key: string;
		/** If provided, return the environment variable for a specific site (no merging is performed) */
		site_id?: string;
	};
	'env.list': {
		/** Scope response to account_id */
		account_id: string;
		/** Filter by deploy context */
		context_name?:
			| 'all'
			| 'dev'
			| 'dev-server'
			| 'branch-deploy'
			| 'deploy-preview'
			| 'production';
		/** Filter by scope */
		scope?: 'builds' | 'functions' | 'runtime' | 'post-processing';
		/** If specified, only return environment variables set on this site */
		site_id?: string;
	};
	'env.listForSite': {
		/** Filter by deploy context */
		context_name?:
			| 'all'
			| 'dev'
			| 'dev-server'
			| 'branch-deploy'
			| 'deploy-preview'
			| 'production';
		/** Filter by scope */
		scope?: 'builds' | 'functions' | 'runtime' | 'post_processing';
		/** Scope response to site_id */
		site_id: string;
	};
	'env.setValue': {
		/** Scope response to account_id */
		account_id: string;
		/** The existing environment variable key name (case-sensitive) */
		key: string;
		/** If provided, update an environment variable set on this site */
		site_id?: string;
		/** The deploy context in which this value will be used. `dev` refers to local development when running `netlify dev`. `branch` must be provided with a value in `context_parameter`. */
		context?:
			| 'all'
			| 'dev'
			| 'dev-server'
			| 'branch-deploy'
			| 'deploy-preview'
			| 'production'
			| 'branch';
		/** An additional parameter for custom branches. Currently, this is used for providing a branch name when `context=branch`. */
		context_parameter?: string;
		/** The environment variable's unencrypted value */
		value?: string;
	};
	'env.update': {
		/** Scope response to account_id */
		account_id: string;
		/** The existing environment variable key name (case-sensitive) */
		key: string;
		/** If provided, update an environment variable set on this site */
		site_id?: string;
		/** A new name for the variable; leave it out to keep `key`. */
		new_key?: string;
		/** The scopes that this environment variable is set to (Pro plans and above) */
		scopes?: Array<'builds' | 'functions' | 'runtime' | 'post-processing'>;
		values?: Array<NetlifyEnvVarValueInput>;
		/** Secret values are only readable by code running on Netlify's systems. With secrets, only the local development context values are readable from the UI, API, and CLI. By default, environment variable values are not secret. */
		is_secret?: boolean;
	};
	'forms.submissions.list': {
		form_id: string;
		page?: number;
		per_page?: number;
	};
	'hooks.create': {
		site_id: string;
		id?: string;
		type?: string;
		event?: string;
		data?: Record<string, NetlifyJsonValue>;
		created_at?: string;
		updated_at?: string;
		disabled?: boolean;
	};
	'hooks.delete': {
		hook_id: string;
	};
	'hooks.enable': {
		hook_id: string;
	};
	'hooks.get': {
		hook_id: string;
	};
	'hooks.list': {
		site_id: string;
		/** Only return hooks attached to this form. */
		form_id?: string;
		/** Only return hooks for this event name. */
		event?: string;
	};
	'hooks.listTypes': {
		/** Only return the hook types available to this site. */
		site_id?: string;
	};
	'hooks.update': {
		hook_id: string;
		id?: string;
		site_id?: string;
		type?: string;
		event?: string;
		data?: Record<string, NetlifyJsonValue>;
		created_at?: string;
		updated_at?: string;
		disabled?: boolean;
	};
	'oauth.tickets.create': {
		client_id: string;
		message?: string;
	};
	'oauth.tickets.exchange': {
		ticket_id: string;
	};
	'oauth.tickets.get': {
		ticket_id: string;
	};
	'services.get': {
		addonName: string;
	};
	'services.getManifest': {
		addonName: string;
	};
	'services.list': {
		search?: string;
	};
	'sites.agentRunnerHooks.create': {
		site_id: string;
		title?: string;
		branch?: string;
		prompt?: string;
		agent?: string;
	};
	'sites.agentRunnerHooks.delete': {
		site_id: string;
		id: string;
	};
	'sites.agentRunnerHooks.get': {
		site_id: string;
		id: string;
	};
	'sites.agentRunnerHooks.list': {
		site_id: string;
	};
	'sites.agentRunnerHooks.update': {
		site_id: string;
		id: string;
		title?: string;
		branch?: string;
		prompt?: string;
		agent?: string;
	};
	'sites.agentRunners.create': {
		/** The site's ID or one of its hostnames. */
		site_id: string;
		prompt: string;
		/** Branch to start from. Defaults to the site's production branch. */
		branch?: string;
		/** Deploy to start from. Takes precedence over `branch`. */
		deploy_id?: string;
		/** Agent to run, for example `claude` or `codex`. */
		agent?: string;
		/** Model for the agent to use. Omit to let Netlify choose. */
		model?: string;
		/** Reasoning effort. Omit to let the agent decide. */
		effort?: 'low' | 'medium' | 'high';
		/** `normal` (the default) changes code; `ask` answers questions without changing code. */
		mode?: 'normal' | 'ask';
	};
	'sites.assets.create': {
		site_id: string;
		name: string;
		size: number;
		content_type: string;
		visibility?: string;
	};
	'sites.assets.delete': {
		site_id: string;
		asset_id: string;
	};
	'sites.assets.get': {
		site_id: string;
		asset_id: string;
	};
	'sites.assets.getPublicSignature': {
		site_id: string;
		asset_id: string;
	};
	'sites.assets.list': {
		site_id: string;
	};
	'sites.assets.update': {
		site_id: string;
		asset_id: string;
		state: string;
	};
	'sites.buildHooks.create': {
		site_id: string;
		title?: string;
		branch?: string;
	};
	'sites.buildHooks.delete': {
		site_id: string;
		id: string;
	};
	'sites.buildHooks.get': {
		site_id: string;
		id: string;
	};
	'sites.buildHooks.list': {
		site_id: string;
	};
	'sites.buildHooks.update': {
		site_id: string;
		id: string;
		title?: string;
		branch?: string;
	};
	'sites.builds.create': {
		site_id: string;
		/** If no branch is specified, it is treated as a production deploy If a branch IS specified and matches the main branch, it is also production If a branch is specified and doesn't match the main branch, it is a branch deploy */
		branch?: string;
		/** Whether to clear the build cache before building */
		clear_cache?: boolean;
		/** The commit SHA to build; when omitted, the head of the branch or pull request is fetched from the git host. Ignored for zip uploads */
		commit_sha?: string;
		/** Whether to create a draft deploy, which uses the deploy-preview context and is never published; review_id builds are always drafts */
		draft?: boolean;
		/** The build image tag to use for the build */
		image?: string;
		/** The merge/pull request ID to build; triggers a deploy preview. Ignored for zip uploads */
		review_id?: number;
		/** The build template to use for the build */
		template_id?: string;
		/** The title of the build */
		title?: string;
		/** A zip file containing the site files to build. Only used with Content-Type 'multipart/form-data'. Alternatively, set Content-Type to 'application/zip' and send the zip as the raw request body (no 'zip' parameter needed). */
		zip?: FileInput;
	};
	'sites.builds.list': {
		site_id: string;
		page?: number;
		per_page?: number;
	};
	'sites.create': {
		configure_dns?: boolean;
		id?: string;
		state?: string;
		plan?: string;
		name?: string;
		custom_domain?: string;
		domain_aliases?: Array<string>;
		branch_deploy_custom_domain?: string;
		deploy_preview_custom_domain?: string;
		password?: string;
		notification_email?: string;
		url?: string;
		ssl_url?: string;
		admin_url?: string;
		screenshot_url?: string;
		created_at?: string;
		updated_at?: string;
		user_id?: string;
		session_id?: string;
		ssl?: boolean;
		force_ssl?: boolean;
		managed_dns?: boolean;
		deploy_url?: string;
		published_deploy?: NetlifyDeployInput;
		account_id?: string;
		account_name?: string;
		account_slug?: string;
		git_provider?: string;
		deploy_hook?: string;
		capabilities?: Record<string, Record<string, NetlifyJsonValue>>;
		processing_settings?: {
			html?: {
				pretty_urls?: boolean;
			};
		};
		build_settings?: NetlifyRepoInfoInput;
		id_domain?: string;
		default_hooks_data?: {
			access_token?: string;
		};
		build_image?: string;
		prerender?: string;
		functions_region?: string;
		prevent_non_git_prod_deploys?: boolean;
		repo?: NetlifyRepoInfoInput;
	};
	'sites.database.branches.create': {
		site_id: string;
		/** The ID of the parent branch to create the new branch from. Defaults to the production branch if not specified. */
		parent_branch_id?: string;
		/** The branch identifier */
		branch_id: string;
		/** Arbitrary metadata to associate with the branch */
		metadata?: Record<string, NetlifyJsonValue>;
	};
	'sites.database.branches.delete': {
		site_id: string;
		/** The branch ID */
		branch_id: string;
	};
	'sites.database.branches.get': {
		site_id: string;
		/** The branch ID */
		branch_id: string;
		/** The database role to use for the connection string. Defaults to netlifydb_owner if not specified. */
		role?: 'netlifydb_owner' | 'netlifydb_readonly';
	};
	'sites.database.branches.list': {
		site_id: string;
	};
	'sites.database.branches.reset': {
		site_id: string;
		/** The branch ID to reset */
		branch_id: string;
		/** If true, resets the branch even when it is already in sync with the source. */
		force?: boolean;
		/** The database role to use for the returned connection string. Defaults to netlifydb_owner if not specified. */
		role?: 'netlifydb_owner' | 'netlifydb_readonly';
		/** The ID of the branch to re-fork the target branch from. Defaults to "production" if not specified. */
		source_branch_id?: string;
	};
	'sites.database.branches.setComputeSettings': {
		site_id: string;
		/** The branch ID */
		branch_id: string;
		/** Minimum compute units (0.25 to 16.0). Must be less than or equal to max_cu. */
		min_cu?: number;
		/** Maximum compute units (0.25 to 16.0). Must be greater than or equal to min_cu. max_cu - min_cu must not exceed 8.0. */
		max_cu?: number;
		/** Seconds of inactivity before the compute endpoint is suspended. Use -1 for always on, or a non-negative value. */
		sleep_timeout_seconds?: number;
	};
	'sites.database.compute.clear': {
		site_id: string;
	};
	'sites.database.compute.get': {
		site_id: string;
	};
	'sites.database.compute.set': {
		site_id: string;
		/** Minimum compute units (0.25 to 16.0). Must be less than or equal to max_cu. */
		min_cu?: number;
		/** Maximum compute units (0.25 to 16.0). Must be greater than or equal to min_cu. max_cu - min_cu must not exceed 8.0. */
		max_cu?: number;
		/** Seconds of inactivity before the compute endpoint is suspended. Use -1 for always on, or a non-negative value. */
		sleep_timeout_seconds?: number;
	};
	'sites.database.create': {
		site_id: string;
		/** The region where the database should be created. Defaults to the site's functions region if not specified. */
		region?: string;
	};
	'sites.database.delete': {
		site_id: string;
	};
	'sites.database.get': {
		site_id: string;
		/** The database role to use for the connection string. Defaults to netlifydb_owner if not specified. */
		role?: 'netlifydb_owner' | 'netlifydb_readonly';
	};
	'sites.database.migrations.get': {
		site_id: string;
		/** The migration name */
		name: string;
		/** The branch ID to look up the migration on. Defaults to the currently published deploy's branch. */
		branch?: string;
	};
	'sites.database.migrations.list': {
		site_id: string;
		/** The branch ID to list migrations for. Defaults to "production" if not specified. */
		branch?: string;
	};
	'sites.database.migrations.run': {
		site_id: string;
		/** The deploy ID to run migrations for */
		deploy_id: string;
		/** If true, validates migrations without applying them. */
		dry_run?: boolean;
	};
	'sites.database.snapshots.create': {
		site_id: string;
		/** The ID of the branch to snapshot. Defaults to "production" if not specified. */
		branch_id?: string;
		/** A name for the snapshot */
		name?: string;
		metadata?: NetlifyDatabaseSnapshotMetadataInput;
	};
	'sites.database.snapshots.delete': {
		site_id: string;
		/** The snapshot ID */
		snapshot_id: string;
	};
	'sites.database.snapshots.list': {
		site_id: string;
	};
	'sites.database.snapshots.restore': {
		site_id: string;
		/** The snapshot ID to restore */
		snapshot_id: string;
		/** The ID of the branch to restore the snapshot to. Defaults to "production" if not specified. */
		branch_id?: string;
	};
	'sites.delete': {
		site_id: string;
	};
	'sites.deployedBranches.list': {
		site_id: string;
	};
	'sites.deploys.create': {
		site_id: string;
		'deploy-previews'?: boolean;
		production?: boolean;
		state?:
			| 'new'
			| 'pending_review'
			| 'accepted'
			| 'rejected'
			| 'enqueued'
			| 'building'
			| 'uploading'
			| 'uploaded'
			| 'preparing'
			| 'prepared'
			| 'processing'
			| 'processed'
			| 'ready'
			| 'error'
			| 'retrying';
		branch?: string;
		'latest-published'?: boolean;
		title?: string;
		/** A hash mapping file paths to SHA1 digests of the file contents. */
		files?: Record<string, NetlifyJsonValue>;
		/** A zip of the site files, sent as the whole request body (Content-Type application/zip) instead of a `files` digest; the other body fields are then left out. */
		zip?: FileInput;
		draft?: boolean;
		async?: boolean;
		functions?: Record<string, NetlifyJsonValue>;
		/** A hash mapping edge-function bundle formats to the code_sha of each bundle. The response's required_edge_functions lists which of these still need to be uploaded. */
		edge_functions?: Record<string, NetlifyJsonValue>;
		/** The deploy's Netlify Server. A deploy has at most one. The response's required_server says whether it still needs to be uploaded. */
		server?: {
			/** The SHA256 digest of the server bundle. */
			sha: string;
			/** Where the server runs. Defaults to the region configured at the site level when absent. */
			region?: string;
			/** The size of the instances the server runs on. A default size is used when absent. */
			instance_size?: 'small' | 'medium' | 'large';
			/** The paths the server handles. */
			routes?: Array<NetlifyFunctionRouteInput>;
			/** Paths within `routes` that the server does not handle. */
			excluded_routes?: Array<NetlifyExcludedFunctionRouteInput>;
			/** The runtime version the server was built for, such as `nodejs24.x`. A default version is used when absent. */
			runtime_version?: string;
			/** How many instances of the server run. */
			scale?: {
				/** The minimum number of instances the server keeps running. Defaults to 0 when absent. */
				min?: number;
				/** The maximum number of instances the server scales to. Defaults to the highest the account's plan allows when absent. */
				max?: number;
			};
		};
		function_schedules?: Array<NetlifyFunctionScheduleInput>;
		functions_config?: Record<string, NetlifyFunctionConfigInput>;
		framework?: string;
		framework_version?: string;
		/** A list of deploy-specific environment variable data. Data specified this way applies only to this specific deploy and is merged into any existing environment variables set on the account and site. Deploy-specific environment variable data takes precedence over account and site environment… */
		environment?: Array<NetlifyDeployEnvironmentVariableInput>;
	};
	'sites.deploys.delete': {
		deploy_id: string;
		site_id: string;
	};
	'sites.deploys.get': {
		site_id: string;
		deploy_id: string;
	};
	'sites.deploys.list': {
		site_id: string;
		'deploy-previews'?: boolean;
		production?: boolean;
		state?:
			| 'new'
			| 'pending_review'
			| 'accepted'
			| 'rejected'
			| 'enqueued'
			| 'building'
			| 'uploading'
			| 'uploaded'
			| 'preparing'
			| 'prepared'
			| 'processing'
			| 'processed'
			| 'ready'
			| 'error'
			| 'retrying';
		branch?: string;
		'latest-published'?: boolean;
		page?: number;
		per_page?: number;
	};
	'sites.deploys.restore': {
		site_id: string;
		deploy_id: string;
	};
	'sites.deploys.rollback': {
		site_id: string;
	};
	'sites.deploys.update': {
		site_id: string;
		deploy_id: string;
		commit_ref?: string;
		/** A hash mapping file paths to SHA1 digests of the file contents. */
		files?: Record<string, NetlifyJsonValue>;
		/** A zip of the site files, sent as the whole request body (Content-Type application/zip) instead of a `files` digest; the other body fields are then left out. */
		zip?: FileInput;
		draft?: boolean;
		async?: boolean;
		functions?: Record<string, NetlifyJsonValue>;
		/** A hash mapping edge-function bundle formats to the code_sha of each bundle. The response's required_edge_functions lists which of these still need to be uploaded. */
		edge_functions?: Record<string, NetlifyJsonValue>;
		/** The deploy's Netlify Server. A deploy has at most one. The response's required_server says whether it still needs to be uploaded. */
		server?: {
			/** The SHA256 digest of the server bundle. */
			sha: string;
			/** Where the server runs. Defaults to the region configured at the site level when absent. */
			region?: string;
			/** The size of the instances the server runs on. A default size is used when absent. */
			instance_size?: 'small' | 'medium' | 'large';
			/** The paths the server handles. */
			routes?: Array<NetlifyFunctionRouteInput>;
			/** Paths within `routes` that the server does not handle. */
			excluded_routes?: Array<NetlifyExcludedFunctionRouteInput>;
			/** The runtime version the server was built for, such as `nodejs24.x`. A default version is used when absent. */
			runtime_version?: string;
			/** How many instances of the server run. */
			scale?: {
				/** The minimum number of instances the server keeps running. Defaults to 0 when absent. */
				min?: number;
				/** The maximum number of instances the server scales to. Defaults to the highest the account's plan allows when absent. */
				max?: number;
			};
		};
		function_schedules?: Array<NetlifyFunctionScheduleInput>;
		functions_config?: Record<string, NetlifyFunctionConfigInput>;
		branch?: string;
		framework?: string;
		framework_version?: string;
		/** A list of deploy-specific environment variable data. Data specified this way applies only to this specific deploy and is merged into any existing environment variables set on the account and site. Deploy-specific environment variable data takes precedence over account and site environment… */
		environment?: Array<NetlifyDeployEnvironmentVariableInput>;
	};
	'sites.devServerHooks.create': {
		site_id: string;
		title?: string;
		branch?: string;
		type?: 'new_dev_server' | 'content_refresh';
	};
	'sites.devServerHooks.delete': {
		site_id: string;
		id: string;
	};
	'sites.devServerHooks.get': {
		site_id: string;
		id: string;
	};
	'sites.devServerHooks.list': {
		site_id: string;
	};
	'sites.devServerHooks.update': {
		site_id: string;
		id: string;
		title?: string;
		branch?: string;
		type?: 'new_dev_server' | 'content_refresh';
	};
	'sites.devServers.create': {
		site_id: string;
		branch?: string;
	};
	'sites.devServers.deleteAll': {
		site_id: string;
		branch?: string;
	};
	'sites.devServers.get': {
		site_id: string;
		dev_server_id: string;
	};
	'sites.devServers.list': {
		site_id: string;
		page?: number;
		per_page?: number;
	};
	'sites.devServers.markActivity': {
		site_id: string;
		dev_server_id: string;
	};
	'sites.devServers.updateState': {
		site_id: string;
		dev_server_id: string;
		state: 'starting' | 'live' | 'error' | 'done';
		task_id?: string;
		error?: string;
	};
	'sites.disable': {
		site_id: string;
		/** Reason for disabling the site */
		reason: string;
	};
	'sites.dns.configure': {
		site_id: string;
	};
	'sites.dns.get': {
		site_id: string;
	};
	'sites.enable': {
		site_id: string;
	};
	'sites.files.get': {
		site_id: string;
		file_path: string;
	};
	'sites.files.list': {
		site_id: string;
	};
	'sites.forms.delete': {
		site_id: string;
		form_id: string;
	};
	'sites.forms.list': {
		site_id: string;
	};
	'sites.functions.list': {
		site_id: string;
		filter?: string;
	};
	'sites.get': {
		site_id: string;
		feature_flags?: string;
	};
	'sites.identity.users.get': {
		site_id: string;
		/** The site's Identity instance ID, returned as `identity_instance_id` by `getSite`. */
		identity_id: string;
		/** The Identity user's UUID. */
		user_id: string;
	};
	'sites.identity.users.lookup': {
		site_id: string;
		/** The site's Identity instance ID, returned as `identity_instance_id` by `getSite`. */
		identity_id: string;
		email: string;
	};
	'sites.list': {
		name?: string;
		filter?: 'all' | 'owner' | 'guest';
		page?: number;
		per_page?: number;
	};
	'sites.metadata.get': {
		site_id: string;
	};
	'sites.metadata.update': {
		site_id: string;
		metadata: NetlifyMetadataInput;
	};
	'sites.serviceInstances.create': {
		site_id: string;
		addon: string;
		config: Record<string, NetlifyJsonValue>;
	};
	'sites.serviceInstances.delete': {
		site_id: string;
		addon: string;
		instance_id: string;
	};
	'sites.serviceInstances.get': {
		site_id: string;
		addon: string;
		instance_id: string;
	};
	'sites.serviceInstances.list': {
		site_id: string;
	};
	'sites.serviceInstances.update': {
		site_id: string;
		addon: string;
		instance_id: string;
		config: Record<string, NetlifyJsonValue>;
	};
	'sites.snippets.create': {
		site_id: string;
		id?: number;
		title?: string;
		general?: string;
		general_position?: string;
		goal?: string;
		goal_position?: string;
	};
	'sites.snippets.delete': {
		site_id: string;
		snippet_id: string;
	};
	'sites.snippets.get': {
		site_id: string;
		snippet_id: string;
	};
	'sites.snippets.list': {
		site_id: string;
	};
	'sites.snippets.update': {
		site_id: string;
		snippet_id: string;
		id?: number;
		title?: string;
		general?: string;
		general_position?: string;
		goal?: string;
		goal_position?: string;
	};
	'sites.splitTests.create': {
		site_id: string;
		branch_tests?: Record<string, NetlifyJsonValue>;
	};
	'sites.splitTests.get': {
		site_id: string;
		split_test_id: string;
	};
	'sites.splitTests.list': {
		site_id: string;
	};
	'sites.splitTests.publish': {
		site_id: string;
		split_test_id: string;
	};
	'sites.splitTests.unpublish': {
		site_id: string;
		split_test_id: string;
	};
	'sites.splitTests.update': {
		site_id: string;
		split_test_id: string;
		branch_tests?: Record<string, NetlifyJsonValue>;
	};
	'sites.ssl.get': {
		site_id: string;
	};
	'sites.ssl.listCertificates': {
		site_id: string;
		domain: string;
	};
	'sites.ssl.provision': {
		site_id: string;
		/** PEM-encoded certificate. Required when updating an existing certificate. */
		certificate?: string;
		/** PEM-encoded private key. Required when updating an existing certificate. */
		key?: string;
		/** PEM-encoded CA certificate chain. Required when updating an existing certificate. */
		ca_certificates?: string;
	};
	'sites.submissions.list': {
		site_id: string;
		page?: number;
		per_page?: number;
	};
	'sites.unlinkRepo': {
		site_id: string;
	};
	'sites.update': {
		site_id: string;
		id?: string;
		state?: string;
		plan?: string;
		name?: string;
		custom_domain?: string;
		domain_aliases?: Array<string>;
		branch_deploy_custom_domain?: string;
		deploy_preview_custom_domain?: string;
		password?: string;
		notification_email?: string;
		url?: string;
		ssl_url?: string;
		admin_url?: string;
		screenshot_url?: string;
		created_at?: string;
		updated_at?: string;
		user_id?: string;
		session_id?: string;
		ssl?: boolean;
		force_ssl?: boolean;
		managed_dns?: boolean;
		deploy_url?: string;
		published_deploy?: NetlifyDeployInput;
		account_id?: string;
		account_name?: string;
		account_slug?: string;
		git_provider?: string;
		deploy_hook?: string;
		capabilities?: Record<string, Record<string, NetlifyJsonValue>>;
		processing_settings?: {
			html?: {
				pretty_urls?: boolean;
			};
		};
		build_settings?: NetlifyRepoInfoInput;
		id_domain?: string;
		default_hooks_data?: {
			access_token?: string;
		};
		build_image?: string;
		prerender?: string;
		functions_region?: string;
		prevent_non_git_prod_deploys?: boolean;
		repo?: NetlifyRepoInfoInput;
	};
	'submissions.delete': {
		submission_id: string;
	};
	'submissions.get': {
		submission_id: string;
		query?: string;
		page?: number;
		per_page?: number;
	};
	'user.me': Record<string, never>;
};

export type NetlifyOperationOutputs = {
	'accounts.audit.list': {
		/** One page of results. */
		items: Array<NetlifyAuditLog>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'accounts.builds.status': NetlifyBuildStatus;
	'accounts.cancel': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'accounts.create': NetlifyAccountMembership;
	'accounts.get': NetlifyAccountMembership;
	'accounts.list': Array<NetlifyAccountMembership>;
	'accounts.listTypes': Array<NetlifyAccountType>;
	'accounts.members.add': Array<NetlifyMember>;
	'accounts.members.get': NetlifyMember;
	'accounts.members.list': Array<NetlifyMember>;
	'accounts.members.remove': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'accounts.members.update': NetlifyMember;
	'accounts.sites.create': NetlifySite;
	'accounts.sites.list': {
		/** One page of results. */
		items: Array<NetlifySite>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'accounts.update': NetlifyAccountMembership;
	'agentRunners.archive': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'agentRunners.commitToBranch': NetlifyAgentRunner;
	'agentRunners.create': NetlifyAgentRunner;
	'agentRunners.createPullRequest': NetlifyAgentRunner;
	'agentRunners.createUploadUrl': {
		/** Presigned URL to upload the file to with a PUT request. Expires after one hour. */
		upload_url?: string | null;
		/** Storage key of the uploaded file. */
		file_key?: string | null;
	};
	'agentRunners.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'agentRunners.get': NetlifyAgentRunner;
	'agentRunners.getDiff': {
		/** The body Netlify answered with (plain text, such as a diff). */
		text: string;
	};
	'agentRunners.list': {
		/** One page of results. */
		items: Array<NetlifyAgentRunner>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'agentRunners.sessions.answer': NetlifyAgentRunnerSession;
	'agentRunners.sessions.create': NetlifyAgentRunnerSession;
	'agentRunners.sessions.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'agentRunners.sessions.get': NetlifyAgentRunnerSession;
	'agentRunners.sessions.list': {
		/** One page of results. */
		items: Array<NetlifyAgentRunnerSession>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'agentRunners.sessions.stop': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'agentRunners.sessions.update': NetlifyAgentRunnerSession;
	'agentRunners.stop': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'agentRunners.update': NetlifyAgentRunner;
	'aiGateway.getAccountToken': NetlifyAiGatewayToken;
	'aiGateway.getSiteToken': NetlifyAiGatewayToken;
	'aiGateway.listProviders': {
		providers?: Record<string, NetlifyProviderDefinition> | null;
	};
	'billing.paymentMethods.list': Array<NetlifyPaymentMethod>;
	'builds.appendLog': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'builds.get': NetlifyBuild;
	'builds.notifyStart': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'cache.purge': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'deployKeys.create': NetlifyDeployKey;
	'deployKeys.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'deployKeys.get': NetlifyDeployKey;
	'deployKeys.list': Array<NetlifyDeployKey>;
	'deploys.cancel': NetlifyDeploy;
	'deploys.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'deploys.get': NetlifyDeploy;
	'deploys.lock': NetlifyDeploy;
	'deploys.unlock': NetlifyDeploy;
	'deploys.updateValidationsReport': NetlifyDeployValidationsReport;
	'deploys.uploadEdgeFunction': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'deploys.uploadFile': NetlifyFile;
	'deploys.uploadFunction': NetlifyFunction;
	'deploys.uploadServer': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'dns.records.create': NetlifyDnsRecord;
	'dns.records.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'dns.records.get': NetlifyDnsRecord;
	'dns.records.list': NetlifyDnsRecords;
	'dns.zones.create': NetlifyDnsZone;
	'dns.zones.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'dns.zones.get': NetlifyDnsZone;
	'dns.zones.list': NetlifyDnsZones;
	'dns.zones.transfer': NetlifyDnsZone;
	'env.create': Array<NetlifyEnvVar>;
	'env.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'env.deleteValue': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'env.get': NetlifyEnvVar;
	'env.list': Array<NetlifyEnvVar>;
	'env.listForSite': Array<NetlifyEnvVar>;
	'env.setValue': NetlifyEnvVar;
	'env.update': NetlifyEnvVar;
	'forms.submissions.list': {
		/** One page of results. */
		items: Array<NetlifySubmission>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'hooks.create': NetlifyHook;
	'hooks.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'hooks.enable': NetlifyHook;
	'hooks.get': NetlifyHook;
	'hooks.list': Array<NetlifyHook>;
	'hooks.listTypes': Array<NetlifyHookType>;
	'hooks.update': NetlifyHook;
	'oauth.tickets.create': NetlifyTicket;
	'oauth.tickets.exchange': NetlifyAccessToken;
	'oauth.tickets.get': NetlifyTicket;
	'services.get': NetlifyService;
	'services.getManifest': Record<string, NetlifyJsonValue>;
	'services.list': Array<NetlifyService>;
	'sites.agentRunnerHooks.create': NetlifyAgentRunnerHookCreated;
	'sites.agentRunnerHooks.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.agentRunnerHooks.get': NetlifyAgentRunnerHook;
	'sites.agentRunnerHooks.list': Array<NetlifyAgentRunnerHook>;
	'sites.agentRunnerHooks.update': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.agentRunners.create': NetlifyAgentRunner;
	'sites.assets.create': NetlifyAssetSignature;
	'sites.assets.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.assets.get': NetlifyAsset;
	'sites.assets.getPublicSignature': NetlifyAssetPublicSignature;
	'sites.assets.list': Array<NetlifyAsset>;
	'sites.assets.update': NetlifyAsset;
	'sites.buildHooks.create': NetlifyBuildHook;
	'sites.buildHooks.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.buildHooks.get': NetlifyBuildHook;
	'sites.buildHooks.list': Array<NetlifyBuildHook>;
	'sites.buildHooks.update': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.builds.create': NetlifyBuild;
	'sites.builds.list': {
		/** One page of results. */
		items: Array<NetlifyBuild>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'sites.create': NetlifySite;
	'sites.database.branches.create': NetlifyDatabaseBranchResponse;
	'sites.database.branches.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.database.branches.get': NetlifyDatabaseBranchResponse;
	'sites.database.branches.list': NetlifyDatabaseBranchesResponse;
	'sites.database.branches.reset': NetlifyResetDatabaseBranchResponse;
	'sites.database.branches.setComputeSettings': NetlifyDatabaseComputeSettings;
	'sites.database.compute.clear': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.database.compute.get': NetlifyDatabaseComputeSettings;
	'sites.database.compute.set': NetlifyDatabaseComputeSettings;
	'sites.database.create': NetlifyDatabaseResponse;
	'sites.database.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.database.get': NetlifyDatabaseResponse;
	'sites.database.migrations.get': NetlifyDatabaseMigrationDetail;
	'sites.database.migrations.list': NetlifyListDatabaseMigrationsResponse;
	'sites.database.migrations.run': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.database.snapshots.create': NetlifyDatabaseSnapshot;
	'sites.database.snapshots.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.database.snapshots.list': NetlifyDatabaseSnapshotsResponse;
	'sites.database.snapshots.restore': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.deployedBranches.list': Array<NetlifyDeployedBranch>;
	'sites.deploys.create': NetlifyDeploy;
	'sites.deploys.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.deploys.get': NetlifyDeploy;
	'sites.deploys.list': {
		/** One page of results. */
		items: Array<NetlifyDeploy>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'sites.deploys.restore': NetlifyDeploy;
	'sites.deploys.rollback': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.deploys.update': NetlifyDeploy;
	'sites.devServerHooks.create': NetlifyDevServerHook;
	'sites.devServerHooks.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.devServerHooks.get': NetlifyDevServerHook;
	'sites.devServerHooks.list': Array<NetlifyDevServerHook>;
	'sites.devServerHooks.update': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.devServers.create': Array<NetlifyDevServer>;
	'sites.devServers.deleteAll': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.devServers.get': NetlifyDevServer;
	'sites.devServers.list': {
		/** One page of results. */
		items: Array<NetlifyDevServer>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'sites.devServers.markActivity': NetlifyDevServer;
	'sites.devServers.updateState': NetlifyDevServer;
	'sites.disable': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.dns.configure': Array<NetlifyDnsZone>;
	'sites.dns.get': Array<NetlifyDnsZone>;
	'sites.enable': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.files.get': NetlifyFile;
	'sites.files.list': Array<NetlifyFile>;
	'sites.forms.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.forms.list': Array<NetlifyForm>;
	'sites.functions.list':
		| Array<NetlifySiteFunction>
		| Record<string, NetlifyJsonValue>;
	'sites.get': NetlifySite;
	'sites.identity.users.get': NetlifyIdentityUser;
	'sites.identity.users.lookup': NetlifyIdentityUser;
	'sites.list': {
		/** One page of results. */
		items: Array<NetlifySite>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'sites.metadata.get': NetlifyMetadata;
	'sites.metadata.update': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.serviceInstances.create': NetlifyServiceInstance;
	'sites.serviceInstances.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.serviceInstances.get': NetlifyServiceInstance;
	'sites.serviceInstances.list': Array<NetlifyServiceInstance>;
	'sites.serviceInstances.update': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.snippets.create': NetlifySnippet | null;
	'sites.snippets.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.snippets.get': NetlifySnippet;
	'sites.snippets.list': Array<NetlifySnippet>;
	'sites.snippets.update': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.splitTests.create': NetlifySplitTest;
	'sites.splitTests.get': NetlifySplitTest;
	'sites.splitTests.list': NetlifySplitTests;
	'sites.splitTests.publish': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.splitTests.unpublish': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'sites.splitTests.update': NetlifySplitTest;
	'sites.ssl.get': NetlifySniCertificate | null;
	'sites.ssl.listCertificates': Array<NetlifySniCertificate>;
	'sites.ssl.provision': NetlifySniCertificate;
	'sites.submissions.list': {
		/** One page of results. */
		items: Array<NetlifySubmission>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'sites.unlinkRepo': NetlifySite;
	'sites.update': NetlifySite;
	'submissions.delete': {
		/** Netlify accepted the call; it answered with no body. */
		success: true;
	};
	'submissions.get': {
		/** One page of results. */
		items: Array<NetlifySubmission>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.me': NetlifyUser;
};
