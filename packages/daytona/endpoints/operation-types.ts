// Generated from Daytona's OpenAPI spec (https://api.daytona.sh/openapi.json,
// fetched 2026-11-27); daytona-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type DaytonaJsonValue =
	| null
	| boolean
	| number
	| string
	| DaytonaJsonValue[]
	| { [key: string]: DaytonaJsonValue | undefined };

export const DAYTONA_OPERATION_IDS = [
	'analytics.telemetry.getTrace',
	'analytics.telemetry.logs',
	'analytics.telemetry.metrics',
	'analytics.telemetry.traces',
	'analytics.usage.aggregated',
	'analytics.usage.bySandbox',
	'analytics.usage.chart',
	'analytics.usage.sandbox',
	'apiKeys.create',
	'apiKeys.delete',
	'apiKeys.getCurrent',
	'apiKeys.list',
	'audit.getOrganizationLogs',
	'audit.getScenarios',
	'config.get',
	'dockerRegistries.create',
	'dockerRegistries.delete',
	'dockerRegistries.get',
	'dockerRegistries.getTransientPushAccess',
	'dockerRegistries.list',
	'dockerRegistries.update',
	'health.live',
	'health.ready',
	'objectStorage.getPushAccess',
	'organizations.createRegion',
	'organizations.deleteRegion',
	'organizations.getGpuCapacity',
	'organizations.getOtelConfig',
	'organizations.getRegionById',
	'organizations.getUsageOverview',
	'organizations.listAvailableRegions',
	'organizations.listAvailableSandboxClasses',
	'organizations.listMembers',
	'organizations.regenerateProxyApiKey',
	'organizations.regenerateSnapshotManagerCredentials',
	'organizations.regenerateSshGatewayApiKey',
	'organizations.updateRegion',
	'regions.listShared',
	'runners.create',
	'runners.delete',
	'runners.getById',
	'runners.getFullById',
	'runners.list',
	'runners.updateDraining',
	'runners.updateScheduling',
	'sandboxes.addNodes',
	'sandboxes.archive',
	'sandboxes.create',
	'sandboxes.createSnapshot',
	'sandboxes.createSshAccess',
	'sandboxes.delete',
	'sandboxes.expireSignedPortPreviewUrl',
	'sandboxes.fork',
	'sandboxes.get',
	'sandboxes.getAncestors',
	'sandboxes.getBuildLogsUrl',
	'sandboxes.getForks',
	'sandboxes.getGangMembershipOperation',
	'sandboxes.getLogs',
	'sandboxes.getMetrics',
	'sandboxes.getParent',
	'sandboxes.getPortPreviewUrl',
	'sandboxes.getSignedPortPreviewUrl',
	'sandboxes.getSigningKey',
	'sandboxes.getToolboxProxyUrl',
	'sandboxes.getTraceSpans',
	'sandboxes.getTraces',
	'sandboxes.list',
	'sandboxes.pause',
	'sandboxes.recover',
	'sandboxes.removeNodes',
	'sandboxes.replaceLabels',
	'sandboxes.replaceNode',
	'sandboxes.resize',
	'sandboxes.revokeSshAccess',
	'sandboxes.rotateSigningKey',
	'sandboxes.setAutoArchiveInterval',
	'sandboxes.setAutoDeleteInterval',
	'sandboxes.setAutoPauseInterval',
	'sandboxes.setAutostopInterval',
	'sandboxes.setTtl',
	'sandboxes.start',
	'sandboxes.stop',
	'sandboxes.updateLastActivity',
	'sandboxes.updateNetworkSettings',
	'sandboxes.updatePublicStatus',
	'sandboxes.updateSecrets',
	'secrets.create',
	'secrets.delete',
	'secrets.get',
	'secrets.listPaginated',
	'secrets.update',
	'snapshots.activate',
	'snapshots.create',
	'snapshots.deactivate',
	'snapshots.get',
	'snapshots.getAll',
	'snapshots.getBuildLogsUrl',
	'snapshots.remove',
	'toolbox.computerUse.click',
	'toolbox.computerUse.deleteRecording',
	'toolbox.computerUse.downloadRecording',
	'toolbox.computerUse.drag',
	'toolbox.computerUse.findAccessibilityNodes',
	'toolbox.computerUse.focusAccessibilityNode',
	'toolbox.computerUse.getAccessibilityTree',
	'toolbox.computerUse.getComputerUseStatus',
	'toolbox.computerUse.getComputerUseSystemStatus',
	'toolbox.computerUse.getDisplayInfo',
	'toolbox.computerUse.getMousePosition',
	'toolbox.computerUse.getProcessErrors',
	'toolbox.computerUse.getProcessLogs',
	'toolbox.computerUse.getProcessStatus',
	'toolbox.computerUse.getRecording',
	'toolbox.computerUse.getWindows',
	'toolbox.computerUse.invokeAccessibilityNode',
	'toolbox.computerUse.keyDown',
	'toolbox.computerUse.keyUp',
	'toolbox.computerUse.listRecordings',
	'toolbox.computerUse.mouseDown',
	'toolbox.computerUse.mouseUp',
	'toolbox.computerUse.moveMouse',
	'toolbox.computerUse.pressHotkey',
	'toolbox.computerUse.pressKey',
	'toolbox.computerUse.restartProcess',
	'toolbox.computerUse.scroll',
	'toolbox.computerUse.setAccessibilityNodeValue',
	'toolbox.computerUse.startComputerUse',
	'toolbox.computerUse.startRecording',
	'toolbox.computerUse.stopComputerUse',
	'toolbox.computerUse.stopRecording',
	'toolbox.computerUse.takeCompressedRegionScreenshot',
	'toolbox.computerUse.takeCompressedScreenshot',
	'toolbox.computerUse.takeRegionScreenshot',
	'toolbox.computerUse.takeScreenshot',
	'toolbox.computerUse.typeText',
	'toolbox.files.bulkDownload',
	'toolbox.files.bulkUpload',
	'toolbox.files.createFolder',
	'toolbox.files.delete',
	'toolbox.files.download',
	'toolbox.files.findIn',
	'toolbox.files.getInfo',
	'toolbox.files.list',
	'toolbox.files.move',
	'toolbox.files.replaceIn',
	'toolbox.files.search',
	'toolbox.files.setPermissions',
	'toolbox.files.upload',
	'toolbox.git.addFiles',
	'toolbox.git.addRemote',
	'toolbox.git.authenticate',
	'toolbox.git.checkoutBranch',
	'toolbox.git.cloneRepository',
	'toolbox.git.commitChanges',
	'toolbox.git.configureUser',
	'toolbox.git.createBranch',
	'toolbox.git.deleteBranch',
	'toolbox.git.getCommitHistory',
	'toolbox.git.getConfig',
	'toolbox.git.getStatus',
	'toolbox.git.initRepository',
	'toolbox.git.listBranches',
	'toolbox.git.listRemotes',
	'toolbox.git.pullChanges',
	'toolbox.git.pushChanges',
	'toolbox.git.resetChanges',
	'toolbox.git.restoreFiles',
	'toolbox.git.setConfig',
	'toolbox.info.getUserHomeDir',
	'toolbox.info.getVersion',
	'toolbox.info.getWorkDir',
	'toolbox.interpreter.createInterpreterContext',
	'toolbox.interpreter.deleteInterpreterContext',
	'toolbox.interpreter.executeInterpreterCode',
	'toolbox.interpreter.listInterpreterContexts',
	'toolbox.lsp.completions',
	'toolbox.lsp.didClose',
	'toolbox.lsp.didOpen',
	'toolbox.lsp.documentSymbols',
	'toolbox.lsp.start',
	'toolbox.lsp.stop',
	'toolbox.lsp.workspaceSymbols',
	'toolbox.ports.get',
	'toolbox.ports.isInUse',
	'toolbox.process.codeRun',
	'toolbox.process.createPtySession',
	'toolbox.process.createSession',
	'toolbox.process.deletePtySession',
	'toolbox.process.deleteSession',
	'toolbox.process.executeCommand',
	'toolbox.process.getEntrypointLogs',
	'toolbox.process.getEntrypointSession',
	'toolbox.process.getPtySession',
	'toolbox.process.getSession',
	'toolbox.process.getSessionCommand',
	'toolbox.process.getSessionCommandLogs',
	'toolbox.process.listPtySessions',
	'toolbox.process.listSessions',
	'toolbox.process.resizePtySession',
	'toolbox.process.sendInput',
	'toolbox.process.sessionExecuteCommand',
	'toolbox.system.getSystemMetrics',
	'volumes.create',
	'volumes.delete',
	'volumes.get',
	'volumes.getByName',
	'volumes.list',
	'warmPools.create',
	'warmPools.delete',
	'warmPools.list',
	'warmPools.update',
	'webhooks.getAppPortalAccess',
	'webhooks.getInitializationStatus',
	'webhooks.initialize',
] as const;

export type DaytonaOperationId = (typeof DAYTONA_OPERATION_IDS)[number];

export type DaytonaCreateBuildInfoInput = {
	/** The Dockerfile content used for the build */
	dockerfileContent: string;
	/** The context hashes used for the build */
	contextHashes?: Array<string>;
};

/** The sandbox class supported by the runner. Defaults to container when omitted or null. */
export type DaytonaCreateRunnerSandboxClassInput =
	| 'container'
	| 'linux-vm'
	| 'windows'
	| null;

export type DaytonaDateFilterInput = {
	/** Match values greater than or equal to this timestamp (ISO 8601). */
	gte?: string;
	/** Match values less than or equal to this timestamp (ISO 8601). */
	lte?: string;
	/** Match values strictly greater than this timestamp (ISO 8601). */
	gt?: string;
	/** Match values strictly less than this timestamp (ISO 8601). */
	lt?: string;
};

export type DaytonaGangNodeResourcesInput = {
	/** CPU cores for the appended node. */
	cpu: number;
	/** Memory in GB for the appended node. */
	memory: number;
	/** Disk in GB for the appended node. */
	disk: number;
};

export type DaytonaGpuTypeInput =
	| 'H100'
	| 'H200'
	| 'B200'
	| 'B300'
	| 'L40S'
	| 'RTX-PRO-6000'
	| 'RTX-4090'
	| 'RTX-5090'
	| 'MI355X';

export type DaytonaIntFilterInput = {
	/** Match values equal to this value. */
	eq?: number;
	/** Match values not equal to this value. */
	not?: number;
	/** Match values present in this list. Accepts comma-separated values or repeated query parameters. Maximum 100 entries. */
	in?: Array<number>;
	/** Match values not present in this list. Accepts comma-separated values or repeated query parameters. Maximum 100 entries. */
	notIn?: Array<number>;
	/** Match values greater than or equal to this value. */
	gte?: number;
	/** Match values less than or equal to this value. */
	lte?: number;
	/** Match values strictly greater than this value. */
	gt?: number;
	/** Match values strictly less than this value. */
	lt?: number;
};

export type DaytonaSandboxClassInput = 'linux-vm' | 'container' | 'windows';

export type DaytonaSandboxListSortDirectionInput = 'asc' | 'desc';

export type DaytonaSandboxListSortFieldInput =
	| 'name'
	| 'cpu'
	| 'memoryGib'
	| 'diskGib'
	| 'lastActivityAt'
	| 'createdAt';

export type DaytonaSandboxStateInput =
	| 'creating'
	| 'restoring'
	| 'destroyed'
	| 'destroying'
	| 'started'
	| 'stopped'
	| 'starting'
	| 'stopping'
	| 'error'
	| 'build_failed'
	| 'pending_build'
	| 'building_snapshot'
	| 'unknown'
	| 'pulling_snapshot'
	| 'archived'
	| 'archiving'
	| 'resizing'
	| 'snapshotting'
	| 'forking'
	| 'pausing'
	| 'paused'
	| 'resuming';

export type DaytonaSandboxVolumeInput = {
	/** The ID or name of the volume. Resolved to the volume ID on sandbox create. */
	volumeId: string;
	/** The mount path for the volume */
	mountPath: string;
	/** Optional subpath within the volume to mount. When specified, only this S3 prefix will be accessible. When omitted, the entire volume is mounted. */
	subpath?: string;
};

export type DaytonaStringFilterInput = {
	/** Match values equal to this value. */
	eq?: string;
	/** Match values not equal to this value. */
	not?: string;
	/** Match values present in this list. Accepts comma-separated values or repeated query parameters. Maximum 100 entries. */
	in?: Array<string>;
	/** Match values not present in this list. Accepts comma-separated values or repeated query parameters. Maximum 100 entries. */
	notIn?: Array<string>;
};

export type DaytonaToolboxCompletionContextInput = {
	triggerCharacter?: string;
	triggerKind: number;
};

export type DaytonaToolboxLspPositionInput = {
	character: number;
	line: number;
};

export type DaytonaAnalyticsmodelsAggregatedUsage = {
	firstStart?: string | null;
	lastEnd?: string | null;
	sandboxCount?: number | null;
	totalCPUSeconds?: number | null;
	totalDiskGBSeconds?: number | null;
	totalGPUSeconds?: number | null;
	totalPrice?: number | null;
	totalRAMGBSeconds?: number | null;
};

export type DaytonaAnalyticsmodelsLogEntry = {
	body?: string | null;
	logAttributes?: Record<string, string> | null;
	resourceAttributes?: Record<string, string> | null;
	serviceName?: string | null;
	severityNumber?: number | null;
	severityText?: string | null;
	spanId?: string | null;
	timestamp?: string | null;
	traceId?: string | null;
};

export type DaytonaAnalyticsmodelsMetricPoint = {
	metricName?: string | null;
	timestamp?: string | null;
	value?: number | null;
};

export type DaytonaAnalyticsmodelsSandboxUsage = {
	firstStart?: string | null;
	lastEnd?: string | null;
	sandboxId?: string | null;
	totalCPUSeconds?: number | null;
	totalDiskGBSeconds?: number | null;
	totalGPUSeconds?: number | null;
	totalPrice?: number | null;
	totalRAMGBSeconds?: number | null;
};

export type DaytonaAnalyticsmodelsSpan = {
	durationMs?: number | null;
	parentSpanId?: string | null;
	spanAttributes?: Record<string, string> | null;
	spanId?: string | null;
	spanName?: string | null;
	statusCode?: string | null;
	statusMessage?: string | null;
	timestamp?: string | null;
	traceId?: string | null;
};

export type DaytonaAnalyticsmodelsTraceSummary = {
	endTime?: string | null;
	rootSpanName?: string | null;
	spanCount?: number | null;
	startTime?: string | null;
	statusCode?: string | null;
	totalDurationMs?: number | null;
	traceId?: string | null;
};

export type DaytonaAnalyticsmodelsUsageChartPoint = {
	cpu?: number | null;
	cpuPrice?: number | null;
	diskGB?: number | null;
	diskPrice?: number | null;
	ramGB?: number | null;
	ramPrice?: number | null;
	time?: string | null;
};

export type DaytonaAnalyticsmodelsUsagePeriod = {
	cpu?: number | null;
	diskGB?: number | null;
	endAt?: string | null;
	gpu?: number | null;
	price?: number | null;
	ramGB?: number | null;
	startAt?: string | null;
};

export type DaytonaAnnouncement = {
	/** The announcement text */
	text?: string | null;
	/** URL to learn more about the announcement */
	learnMoreUrl?: string | null;
};

export type DaytonaApiKeyList = {
	/** The name of the API key */
	name?: string | null;
	/** The masked API key value */
	value?: string | null;
	/** When the API key was created */
	createdAt?: string | null;
	/** The list of organization resource permissions assigned to the API key */
	permissions?: Array<string> | null;
	/** When the API key was last used */
	lastUsedAt?: string | null;
	/** When the API key expires */
	expiresAt?: string | null;
	/** The user ID of the user who created the API key */
	userId?: string | null;
	/** The organization ID associated with the API key */
	organizationId?: string | null;
};

export type DaytonaApiKeyResponse = {
	/** The name of the API key */
	name?: string | null;
	/** The API key value */
	value?: string | null;
	/** When the API key was created */
	createdAt?: string | null;
	/** The list of organization resource permissions assigned to the API key */
	permissions?: Array<string> | null;
	/** When the API key expires */
	expiresAt?: string | null;
};

export type DaytonaAuditLog = {
	id?: string | null;
	actorId?: string | null;
	actorEmail?: string | null;
	actorApiKeyPrefix?: string | null;
	actorApiKeySuffix?: string | null;
	/** Partner application that obtained the actor token, by its configured name */
	actorPartner?: string | null;
	organizationId?: string | null;
	action?: string | null;
	targetType?: string | null;
	targetId?: string | null;
	statusCode?: number | null;
	errorMessage?: string | null;
	ipAddress?: string | null;
	userAgent?: string | null;
	source?: string | null;
	metadata?: Record<string, DaytonaJsonValue> | null;
	createdAt?: string | null;
};

export type DaytonaAuditScenarios = {
	/** Supported audit log scenarios grouped by target type. Derived at runtime from the audited routes and system events, sorted by target type. */
	targets?: Array<DaytonaAuditTargetScenario> | null;
};

export type DaytonaAuditTargetScenario = {
	/** Resource type the actions apply to. Scenarios that are not scoped to a specific resource type (e.g. leaving an organization) are grouped under "other". */
	targetType?: string | null;
	/** Actions that can be audited against this target type, sorted alphabetically. */
	actions?: Array<string> | null;
};

export type DaytonaAvailableSandboxClass = {
	regionId?: string | null;
	sandboxClass?: DaytonaSandboxClass | null;
	gpuAvailable?: boolean | null;
	allowedGpuTypes?: Array<DaytonaGpuType> | null;
};

export type DaytonaBuildInfo = {
	/** The Dockerfile content used for the build */
	dockerfileContent?: string | null;
	/** The context hashes used for the build */
	contextHashes?: Array<string> | null;
	/** The creation timestamp */
	createdAt?: string | null;
	/** The last update timestamp */
	updatedAt?: string | null;
	/** The snapshot reference */
	snapshotRef?: string | null;
};

export type DaytonaCliOidcConfig = {
	/** WorkOS issuer of the Daytona CLI application */
	issuer?: string | null;
	/** WorkOS client ID of the Daytona CLI application */
	clientId?: string | null;
};

export type DaytonaCreateRegionResponse = {
	/** ID of the created region */
	id?: string | null;
	/** Proxy API key for the region */
	proxyApiKey?: string | null;
	/** SSH Gateway API key for the region */
	sshGatewayApiKey?: string | null;
	/** Snapshot Manager username for the region */
	snapshotManagerUsername?: string | null;
	/** Snapshot Manager password for the region */
	snapshotManagerPassword?: string | null;
};

export type DaytonaCreateRunnerResponse = {
	/** The ID of the runner */
	id?: string | null;
	/** The API key for the runner */
	apiKey?: string | null;
};

export type DaytonaDaytonaConfiguration = {
	/** Daytona version */
	version?: string | null;
	/** Commit sha of the source the app was built from */
	buildSha?: string | null;
	/** PostHog configuration */
	posthog?: DaytonaPosthogConfig | null;
	/** OIDC configuration */
	oidc?: DaytonaOidcConfig | null;
	/** OIDC configuration for org-SSO logins (Daytona Auth issuer). Present only when the secondary (org-SSO) issuer is configured; the dashboard uses it as its authority when entered via an organization SSO link. */
	ssoOidc?: DaytonaSsoOidcConfig | null;
	/** Feature flags forced on for this deployment regardless of PostHog targeting. Lets environments without PostHog (previews, local dev) enable flag-gated dashboard features. */
	forcedFeatureFlags?: Array<string> | null;
	/** Whether linked accounts are enabled */
	linkedAccountsEnabled?: boolean | null;
	/** System announcements */
	announcements?: Record<string, DaytonaAnnouncement> | null;
	/** Pylon application ID */
	pylonAppId?: string | null;
	/** Proxy template URL */
	proxyTemplateUrl?: string | null;
	/** Toolbox template URL */
	proxyToolboxUrl?: string | null;
	/** Default snapshot for sandboxes */
	defaultSnapshot?: string | null;
	/** Dashboard URL */
	dashboardUrl?: string | null;
	/** Maximum auto-archive interval in minutes */
	maxAutoArchiveInterval?: number | null;
	/** Whether maintenance mode is enabled */
	maintananceMode?: boolean | null;
	/** Current environment */
	environment?: string | null;
	/** Billing API URL */
	billingApiUrl?: string | null;
	/** Analytics API URL */
	analyticsApiUrl?: string | null;
	/** Base URL of the new Daytona dashboard. The dashboard links to it, with the selected organization id appended, from its "Switch to the new Daytona" entry point when that is enabled for the organization. Absent when the deployment does not advertise one. */
	v2DashboardUrl?: string | null;
	/** Stripe publishable key for client-side Stripe.js */
	stripePublishableKey?: string | null;
	/** SSH Gateway command */
	sshGatewayCommand?: string | null;
	/** Base64 encoded SSH Gateway public key */
	sshGatewayPublicKey?: string | null;
	/** Hostname of the SSH Gateway that sandbox SSH connections terminate at */
	sshGatewayHost?: string | null;
	/** TCP port of the SSH Gateway */
	sshGatewayPort?: number | null;
	/** SSH host public keys presented by the SSH Gateway, as OpenSSH public key lines (`<type> <base64>`). To build a known_hosts entry, prefix each with `sshGatewayHost` when `sshGatewayPort` is 22, or with `[sshGatewayHost]:sshGatewayPort` otherwise. */
	sshGatewayHostKeys?: Array<string> | null;
	/** SHA256 fingerprints of sshGatewayHostKeys, in the same order, in `ssh-keygen -lf` format. Compare against the fingerprint published at https://github.com/daytona/.github/blob/main/SECURITY.md#ssh-host-key-verification */
	sshGatewayHostKeyFingerprints?: Array<string> | null;
	/** Rate limit configuration */
	rateLimit?: DaytonaRateLimitConfig | null;
};

export type DaytonaDockerRegistry = {
	/** Registry ID */
	id?: string | null;
	/** Registry name */
	name?: string | null;
	/** Registry URL */
	url?: string | null;
	/** Registry username */
	username?: string | null;
	/** IAM role ARN for registry mTLS */
	mtlsRoleArn?: string | null;
	/** Secrets Manager ARN for registry mTLS */
	mtlsSecretArn?: string | null;
	/** Registry project */
	project?: string | null;
	/** Registry type */
	registryType?: string | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
};

export type DaytonaGangMembershipOperation = {
	id?: string | null;
	sandboxId?: string | null;
	type?: string | null;
	status?: string | null;
	phase?: string | null;
	expectedGeneration?: number | null;
	targetGeneration?: number | null;
	policyRevision?: number | null;
	errorReason?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	completedAt?: string | null;
};

export type DaytonaGangNodeFailure = {
	rank?: number | null;
	memberId?: string | null;
	incarnation?: number | null;
	reason?: string | null;
	reportedState?: DaytonaSandboxState | null;
	failedAt?: string | null;
	fencingStatus?: string | null;
	fencingError?: string | null;
};

export type DaytonaGpuCapacity = {
	gpuType?: DaytonaGpuType | null;
	/** GPU units available for on-demand placement across schedulable runners, including capacity occupied by spot sandboxes that are immediately reclaimable. */
	availableOnDemand?: number | null;
	/** GPU units currently free for spot placement across schedulable runners. */
	availableSpot?: number | null;
	/** Observed estimates of sandbox counts for each supported GPU count, ordered ascending and including zero counts. Each sandbox must fit on one runner. Sizes and purchase types are alternative uses of the same capacity; counts must not be added together. Capacity is not reserved; sandbox creation… */
	availableSandboxes?: Array<DaytonaGpuSandboxCapacity> | null;
};

export type DaytonaGpuCapacityResponse = {
	/** Time at which this capacity snapshot was calculated. Responses may be cached for up to five seconds. */
	observedAt?: string | null;
	capacity?: Array<DaytonaGpuCapacity> | null;
};

export type DaytonaGpuSandboxCapacity = {
	/** GPU units per sandbox. */
	gpuCount?: number | null;
	/** Estimated number of on-demand sandboxes that fit at observation time, including immediately reclaimable spot capacity. */
	onDemand?: number | null;
	/** Estimated number of spot sandboxes that fit in free capacity at observation time. */
	spot?: number | null;
};

export type DaytonaGpuType = string;

export type DaytonaHealthControllerCheck200Response = {
	status?: string | null;
	info?: Record<
		string,
		DaytonaHealthControllerCheck200ResponseInfoValue
	> | null;
	error?: Record<
		string,
		DaytonaHealthControllerCheck200ResponseInfoValue
	> | null;
	details?: Record<
		string,
		DaytonaHealthControllerCheck200ResponseInfoValue
	> | null;
};

export type DaytonaHealthControllerCheck200ResponseInfoValue = {
	status?: string | null;
};

export type DaytonaListSandboxesResponse = {
	/** List of results for the current page */
	items?: Array<DaytonaSandboxListItem> | null;
	/** Cursor for the next page of results */
	nextCursor?: string | null;
};

export type DaytonaListSecretsResponse = {
	/** List of results for the current page */
	items?: Array<DaytonaSecret> | null;
	/** Total number of secrets matching the filters */
	total?: number | null;
	/** Cursor for the next page of results */
	nextCursor?: string | null;
};

export type DaytonaLogEntry = {
	/** Timestamp of the log entry */
	timestamp?: string | null;
	/** Log message body */
	body?: string | null;
	/** Severity level text (e.g., INFO, WARN, ERROR) */
	severityText?: string | null;
	/** Severity level number */
	severityNumber?: number | null;
	/** Service name that generated the log */
	serviceName?: string | null;
	/** Resource attributes from OTEL */
	resourceAttributes?: Record<string, string> | null;
	/** Log-specific attributes */
	logAttributes?: Record<string, string> | null;
	/** Associated trace ID if available */
	traceId?: string | null;
	/** Associated span ID if available */
	spanId?: string | null;
};

export type DaytonaMetricDataPoint = {
	/** Timestamp of the data point */
	timestamp?: string | null;
	/** Value at this timestamp */
	value?: number | null;
};

export type DaytonaMetricSeries = {
	/** Name of the metric */
	metricName?: string | null;
	/** Data points for this metric */
	dataPoints?: Array<DaytonaMetricDataPoint> | null;
};

export type DaytonaMetricsResponse = {
	/** List of metric series */
	series?: Array<DaytonaMetricSeries> | null;
};

export type DaytonaOidcConfig = {
	/** OIDC issuer */
	issuer?: string | null;
	/** OIDC client ID */
	clientId?: string | null;
	/** OIDC audience */
	audience?: string | null;
	/** Which identity provider the advertised issuer above belongs to. The dashboard needs this because provider-specific logout URLs are not discoverable from the issuer alone: ending an Auth0 session uses its proprietary /v2/logout, which does not exist on WorkOS AuthKit. Anything that branches on… */
	provider?: string | null;
	/** WorkOS "Authentication API" custom domain the dashboard's client-side SDK should call instead of api.workos.com, so the refresh-token cookie is first-party. Present only when the provider is workos and a custom domain is configured (WorkOS production environments only); absent means the SDK runs… */
	authApiHostname?: string | null;
	/** WorkOS application the Daytona CLI logs in through, configured apart from the dashboard's so CLI sessions can have their own lifetime. Present only when the provider is workos and a CLI application is configured; absent means the CLI uses the issuer and client ID above. */
	cli?: DaytonaCliOidcConfig | null;
};

export type DaytonaOrganizationRole = {
	/** Role ID */
	id?: string | null;
	/** Role name */
	name?: string | null;
	/** Role description */
	description?: string | null;
	/** Roles assigned to the user */
	permissions?: Array<string> | null;
	/** Global role flag */
	isGlobal?: boolean | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
};

export type DaytonaOrganizationUsageOverview = {
	regionUsage?: Array<DaytonaRegionUsageOverview> | null;
	totalSnapshotQuota?: number | null;
	currentSnapshotUsage?: number | null;
	totalVolumeQuota?: number | null;
	currentVolumeUsage?: number | null;
};

export type DaytonaOrganizationUser = {
	/** User ID */
	userId?: string | null;
	/** Organization ID */
	organizationId?: string | null;
	/** User name */
	name?: string | null;
	/** User email */
	email?: string | null;
	/** Member role */
	role?: string | null;
	/** Roles assigned to the user */
	assignedRoles?: Array<DaytonaOrganizationRole> | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
};

export type DaytonaOtelConfig = {
	/** Endpoint */
	endpoint?: string | null;
	/** Headers */
	headers?: Record<string, string> | null;
	/** Organization ID the config belongs to */
	organizationId?: string | null;
};

export type DaytonaPaginatedAuditLogs = {
	items?: Array<DaytonaAuditLog> | null;
	total?: number | null;
	page?: number | null;
	totalPages?: number | null;
	/** Token for next page in cursor-based pagination */
	nextToken?: string | null;
};

export type DaytonaPaginatedLogs = {
	/** List of log entries */
	items?: Array<DaytonaLogEntry> | null;
	/** Total number of log entries matching the query */
	total?: number | null;
	/** Current page number */
	page?: number | null;
	/** Total number of pages */
	totalPages?: number | null;
};

export type DaytonaPaginatedSnapshots = {
	items?: Array<DaytonaSnapshotDto> | null;
	total?: number | null;
	page?: number | null;
	totalPages?: number | null;
};

export type DaytonaPaginatedTraces = {
	/** List of trace summaries */
	items?: Array<DaytonaTraceSummary> | null;
	/** Total number of traces matching the query */
	total?: number | null;
	/** Current page number */
	page?: number | null;
	/** Total number of pages */
	totalPages?: number | null;
};

export type DaytonaPortPreviewUrl = {
	/** ID of the sandbox */
	sandboxId?: string | null;
	/** Preview url */
	url?: string | null;
	/** Access token */
	token?: string | null;
};

export type DaytonaPosthogConfig = {
	/** PostHog API key */
	apiKey?: string | null;
	/** PostHog host URL */
	host?: string | null;
};

export type DaytonaRateLimitConfig = {
	/** Failed authentication rate limit */
	failedAuth?: DaytonaRateLimitEntry | null;
	/** Authenticated rate limit */
	authenticated?: DaytonaRateLimitEntry | null;
	/** Sandbox create rate limit */
	sandboxCreate?: DaytonaRateLimitEntry | null;
	/** Sandbox lifecycle rate limit */
	sandboxLifecycle?: DaytonaRateLimitEntry | null;
	/** Sandbox list rate limit */
	sandboxList?: DaytonaRateLimitEntry | null;
};

export type DaytonaRateLimitEntry = {
	/** Rate limit TTL in seconds */
	ttl?: number | null;
	/** Rate limit max requests */
	limit?: number | null;
};

export type DaytonaRegenerateApiKeyResponse = {
	/** The newly generated API key */
	apiKey?: string | null;
};

export type DaytonaRegion = {
	/** Region ID */
	id?: string | null;
	/** Region name */
	name?: string | null;
	/** Organization ID */
	organizationId?: string | null;
	/** The type of the region */
	regionType?: DaytonaRegionType | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
	/** Proxy URL for the region */
	proxyUrl?: string | null;
	/** SSH Gateway URL for the region */
	sshGatewayUrl?: string | null;
	/** Snapshot Manager URL for the region */
	snapshotManagerUrl?: string | null;
	/** OTel collector endpoint for sandboxes created in this region. When set, sandbox OTel data is sent to this endpoint instead of the Daytona-hosted collector and will not be available in the Daytona analytics API or dashboard. */
	otelEndpoint?: string | null;
	/** S3 bucket in your AWS account that declarative-build context is uploaded to for this region. Requires buildContextBucketRegion and buildContextRoleArn. */
	buildContextBucket?: string | null;
	/** AWS region of buildContextBucket (standard aws partition only) */
	buildContextBucketRegion?: string | null;
	/** IAM role Daytona assumes (with your organization ID as ExternalId) to issue upload credentials for buildContextBucket */
	buildContextRoleArn?: string | null;
};

/** The type of the region */
export type DaytonaRegionType = string;

export type DaytonaRegionUsageOverview = {
	regionId?: string | null;
	sandboxClass?: DaytonaSandboxClass | null;
	totalCpuQuota?: number | null;
	currentCpuUsage?: number | null;
	totalMemoryQuota?: number | null;
	currentMemoryUsage?: number | null;
	totalDiskQuota?: number | null;
	currentDiskUsage?: number | null;
	totalGpuQuota?: number | null;
	currentGpuUsage?: number | null;
	allowedGpuTypes?: Array<DaytonaGpuType> | null;
	maxCpuPerSandbox?: number | null;
	maxMemoryPerSandbox?: number | null;
	maxDiskPerSandbox?: number | null;
	maxDiskPerNonEphemeralSandbox?: number | null;
	/** CPU maximum per requested GPU unit for GPU sandboxes. */
	maxCpuPerGpu?: number | null;
	/** Memory maximum per requested GPU unit for GPU sandboxes. */
	maxMemoryPerGpu?: number | null;
	/** Disk maximum per requested GPU unit for GPU sandboxes. */
	maxDiskPerGpu?: number | null;
};

export type DaytonaRegistryPushAccessDto = {
	/** Temporary username for registry authentication */
	username?: string | null;
	/** Temporary secret for registry authentication */
	secret?: string | null;
	/** Registry URL */
	registryUrl?: string | null;
	/** Registry ID */
	registryId?: string | null;
	/** Registry project ID */
	project?: string | null;
	/** Token expiration time in ISO format */
	expiresAt?: string | null;
};

export type DaytonaRunner = {
	/** The ID of the runner */
	id?: string | null;
	/** The domain of the runner */
	domain?: string | null;
	/** The API URL of the runner */
	apiUrl?: string | null;
	/** The proxy URL of the runner */
	proxyUrl?: string | null;
	/** The address of the runner SSH gateway; unset means the runner domain on the default port (2220) */
	sshGatewayUrl?: string | null;
	/** The CPU capacity of the runner */
	cpu?: number | null;
	/** The memory capacity of the runner in GiB */
	memory?: number | null;
	/** The disk capacity of the runner in GiB */
	disk?: number | null;
	/** The GPU capacity of the runner */
	gpu?: number | null;
	/** The type of GPU */
	gpuType?: string | null;
	/** The sandbox class supported by this runner */
	sandboxClass?: DaytonaSandboxClass | null;
	/** Current CPU usage percentage */
	currentCpuUsagePercentage?: number | null;
	/** Current RAM usage percentage */
	currentMemoryUsagePercentage?: number | null;
	/** Current disk usage percentage */
	currentDiskUsagePercentage?: number | null;
	/** Current allocated CPU */
	currentAllocatedCpu?: number | null;
	/** Current allocated memory in GiB */
	currentAllocatedMemoryGiB?: number | null;
	/** Current allocated disk in GiB */
	currentAllocatedDiskGiB?: number | null;
	/** Current snapshot count */
	currentSnapshotCount?: number | null;
	/** Current number of started sandboxes */
	currentStartedSandboxes?: number | null;
	/** Runner availability score */
	availabilityScore?: number | null;
	/** The region of the runner */
	region?: string | null;
	/** The name of the runner */
	name?: string | null;
	/** The state of the runner */
	state?: DaytonaRunnerState | null;
	/** The last time the runner was checked */
	lastChecked?: string | null;
	/** Whether the runner is unschedulable */
	unschedulable?: boolean | null;
	/** Tags associated with the runner */
	tags?: Array<string> | null;
	/** The creation timestamp of the runner */
	createdAt?: string | null;
	/** The last update timestamp of the runner */
	updatedAt?: string | null;
	/** The version of the runner (deprecated in favor of apiVersion) */
	version?: string | null;
	/** The api version of the runner */
	apiVersion?: string | null;
	/** The class of the runner. Deprecated and always returns "container" for backward compatibility - use sandboxClass instead. */
	runnerClass?: DaytonaRunnerClass | null;
	/** The app version of the runner */
	appVersion?: string | null;
	/** Deprecated runner class property */
	class?: string | null;
};

/** The class of the runner. Deprecated and always returns "container" for backward compatibility - use sandboxClass instead. */
export type DaytonaRunnerClass = string;

export type DaytonaRunnerFull = {
	/** The ID of the runner */
	id?: string | null;
	/** The domain of the runner */
	domain?: string | null;
	/** The API URL of the runner */
	apiUrl?: string | null;
	/** The proxy URL of the runner */
	proxyUrl?: string | null;
	/** The address of the runner SSH gateway; unset means the runner domain on the default port (2220) */
	sshGatewayUrl?: string | null;
	/** The CPU capacity of the runner */
	cpu?: number | null;
	/** The memory capacity of the runner in GiB */
	memory?: number | null;
	/** The disk capacity of the runner in GiB */
	disk?: number | null;
	/** The GPU capacity of the runner */
	gpu?: number | null;
	/** The type of GPU */
	gpuType?: string | null;
	/** The sandbox class supported by this runner */
	sandboxClass?: DaytonaSandboxClass | null;
	/** Current CPU usage percentage */
	currentCpuUsagePercentage?: number | null;
	/** Current RAM usage percentage */
	currentMemoryUsagePercentage?: number | null;
	/** Current disk usage percentage */
	currentDiskUsagePercentage?: number | null;
	/** Current allocated CPU */
	currentAllocatedCpu?: number | null;
	/** Current allocated memory in GiB */
	currentAllocatedMemoryGiB?: number | null;
	/** Current allocated disk in GiB */
	currentAllocatedDiskGiB?: number | null;
	/** Current snapshot count */
	currentSnapshotCount?: number | null;
	/** Current number of started sandboxes */
	currentStartedSandboxes?: number | null;
	/** Runner availability score */
	availabilityScore?: number | null;
	/** The region of the runner */
	region?: string | null;
	/** The name of the runner */
	name?: string | null;
	/** The state of the runner */
	state?: DaytonaRunnerState | null;
	/** The last time the runner was checked */
	lastChecked?: string | null;
	/** Whether the runner is unschedulable */
	unschedulable?: boolean | null;
	/** Tags associated with the runner */
	tags?: Array<string> | null;
	/** The creation timestamp of the runner */
	createdAt?: string | null;
	/** The last update timestamp of the runner */
	updatedAt?: string | null;
	/** The version of the runner (deprecated in favor of apiVersion) */
	version?: string | null;
	/** The api version of the runner */
	apiVersion?: string | null;
	/** The class of the runner. Deprecated and always returns "container" for backward compatibility - use sandboxClass instead. */
	runnerClass?: DaytonaRunnerClass | null;
	/** The app version of the runner */
	appVersion?: string | null;
	/** Deprecated runner class property */
	class?: string | null;
	/** The API key for the runner */
	apiKey?: string | null;
	/** The region type of the runner */
	regionType?: DaytonaRegionType | null;
};

/** The state of the runner */
export type DaytonaRunnerState = string;

export type DaytonaSandbox = {
	/** Nodes of the multi-node GPU sandbox in rank order. Rank 0 is this sandbox. Absent for single-node sandboxes. */
	nodes?: Array<DaytonaSandboxNode> | null;
	/** Committed logical topology generation. */
	topologyGeneration?: number | null;
	/** Physical incarnation for an internal node row. */
	incarnation?: number | null;
	/** Derived number of physical nodes in this sandbox. */
	nodeCount?: number | null;
	/** Rank within the multi-node GPU sandbox; present only on internal node rows. */
	nodeRank?: number | null;
	/** ID of the multi-node GPU sandbox (rank 0); present only on internal node rows. */
	headSandboxId?: string | null;
	/** The multi-node GPU sandbox remains usable but one or more fabric checks are degraded. */
	degraded?: boolean | null;
	/** The ID of the sandbox */
	id?: string | null;
	/** The organization ID of the sandbox */
	organizationId?: string | null;
	/** The name of the sandbox */
	name?: string | null;
	/** The snapshot used for the sandbox */
	snapshot?: string | null;
	/** The user associated with the project */
	user?: string | null;
	/** Environment variables for the sandbox */
	env?: Record<string, string> | null;
	/** Labels for the sandbox */
	labels?: Record<string, string> | null;
	/** Whether the sandbox http preview is public */
	public?: boolean | null;
	/** Whether to block all network access for the sandbox */
	networkBlockAll?: boolean | null;
	/** Whether the sandbox exposes KVM (/dev/kvm) to its guest */
	kvm?: boolean | null;
	/** Comma-separated list of allowed CIDR network addresses for the sandbox */
	networkAllowList?: string | null;
	/** Comma-separated list of allowed domains for the sandbox */
	domainAllowList?: string | null;
	/** Outbound proxy URL the sandbox HTTP(S) traffic is routed through. Applied via the HTTP(S)_PROXY environment variables (convenience routing); network-layer enforcement applies only when the sandbox also has a domainAllowList. Only returned on single-sandbox reads — never on list responses. */
	outboundProxyUrl?: string | null;
	/** OTel collector endpoint override for this sandbox. When set, sandbox OTel data is sent to this endpoint instead of the default collector and is not available in the Daytona analytics API or dashboard. Only returned on single-sandbox reads — never on list responses. */
	otelEndpointOverride?: string | null;
	/** The target environment for the sandbox */
	target?: string | null;
	/** The CPU quota for the sandbox; for a multi-node sandbox, this is the job total. */
	cpu?: number | null;
	/** The GPU quota for the sandbox; for a multi-node sandbox, this is the job total. */
	gpu?: number | null;
	/** Whether this is a spot GPU sandbox. Spot sandboxes may be instantly terminated to free capacity for on-demand GPU sandboxes. Absent on APIs that predate this field; treat as false. */
	spot?: boolean | null;
	/** When this sandbox was destroyed by spot preemption. Set only for spot-evicted sandboxes, which stay retrievable by ID for 24 hours after eviction. */
	spotEvictedAt?: string | null;
	/** When this sandbox was destroyed because it waited too long for a runner. Set only for queue-timeout sandboxes, which stay retrievable by ID for 24 hours after the timeout. */
	queueTimedOutAt?: string | null;
	/** The GPU type assigned to the sandbox */
	gpuType?: DaytonaGpuType | null;
	/** The memory quota for the sandbox; for a multi-node sandbox, this is the job total. */
	memory?: number | null;
	/** The disk quota for the sandbox; for a multi-node sandbox, this is the job total. */
	disk?: number | null;
	/** The state of the sandbox */
	state?: DaytonaSandboxState | null;
	/** The desired state of the sandbox */
	desiredState?: DaytonaSandboxDesiredState | null;
	/** The error reason of the sandbox */
	errorReason?: string | null;
	/** Outcome of the runner's most recent network policy change: why the network settings fields (what was requested) are not what the runner enforces. Absent when the latest change was applied; a new request leaves it as it is until its own outcome is known. */
	networkPolicyError?: string | null;
	/** Whether the sandbox error is recoverable. */
	recoverable?: boolean | null;
	/** Id of the warm pool this sandbox waits in; set only while it is an unclaimed member. */
	warmPoolId?: string | null;
	/** The state of the backup */
	backupState?: string | null;
	/** The creation timestamp of the last backup */
	backupCreatedAt?: string | null;
	/** Auto-stop interval in minutes (0 means disabled) */
	autoStopInterval?: number | null;
	/** Auto-pause interval in minutes (0 means disabled) */
	autoPauseInterval?: number | null;
	/** Auto-archive interval in minutes */
	autoArchiveInterval?: number | null;
	/** Auto-delete interval in minutes (negative value means disabled, 0 means delete immediately upon stopping) */
	autoDeleteInterval?: number | null;
	/** When the sandbox will be automatically destroyed, regardless of its state (only set when a TTL is configured) */
	autoDestroyAt?: string | null;
	/** Minutes to wait for runner assignment before cancelling sandbox creation. Null means the wait is unlimited. */
	queueTimeout?: number | null;
	/** Array of volumes attached to the sandbox */
	volumes?: Array<DaytonaSandboxVolume> | null;
	/** Build information for the sandbox */
	buildInfo?: DaytonaBuildInfo | null;
	/** The creation timestamp of the sandbox */
	createdAt?: string | null;
	/** The last update timestamp of the sandbox */
	updatedAt?: string | null;
	/** The last activity timestamp of the sandbox */
	lastActivityAt?: string | null;
	/** The class of the sandbox */
	sandboxClass?: string | null;
	/** The version of the daemon running in the sandbox */
	daemonVersion?: string | null;
	/** The runner ID of the sandbox */
	runnerId?: string | null;
	/** ID of the sandbox this sandbox is linked to. When set, the sandbox is co-located on the same runner as the linked sandbox. */
	linkedSandboxId?: string | null;
	/** The toolbox proxy URL for the sandbox */
	toolboxProxyUrl?: string | null;
};

export type DaytonaSandboxClass = string;

/** The desired state of the sandbox */
export type DaytonaSandboxDesiredState = string;

export type DaytonaSandboxLabels = {
	/** Key-value pairs of labels */
	labels?: Record<string, string> | null;
};

export type DaytonaSandboxListItem = {
	/** The ID of the sandbox */
	id?: string | null;
	/** The organization ID of the sandbox */
	organizationId?: string | null;
	/** The name of the sandbox */
	name?: string | null;
	/** The target environment for the sandbox */
	target?: string | null;
	/** The runner ID of the sandbox */
	runnerId?: string | null;
	/** The class of the sandbox */
	sandboxClass?: DaytonaSandboxClass | null;
	/** The state of the sandbox */
	state?: DaytonaSandboxState | null;
	/** The desired state of the sandbox */
	desiredState?: DaytonaSandboxDesiredState | null;
	/** The snapshot used for the sandbox */
	snapshot?: string | null;
	/** The user associated with the project */
	user?: string | null;
	/** The error reason of the sandbox */
	errorReason?: string | null;
	/** Whether the sandbox error is recoverable. */
	recoverable?: boolean | null;
	/** Whether the sandbox http preview is public */
	public?: boolean | null;
	/** Whether to block all network access for the sandbox */
	networkBlockAll?: boolean | null;
	/** Comma-separated list of allowed CIDR network addresses for the sandbox */
	networkAllowList?: string | null;
	/** Comma-separated list of allowed domains for the sandbox */
	domainAllowList?: string | null;
	/** The CPU quota for the sandbox */
	cpu?: number | null;
	/** The GPU quota for the sandbox */
	gpu?: number | null;
	/** Whether this is a spot GPU sandbox. Spot sandboxes may be instantly terminated to free capacity for on-demand GPU sandboxes. Absent on APIs that predate this field; treat as false. */
	spot?: boolean | null;
	/** When this sandbox was evicted by spot preemption. Set as soon as the sandbox is marked for eviction, so it is already present while the sandbox is still winding down. */
	spotEvictedAt?: string | null;
	/** When this sandbox was destroyed because it waited too long for a runner. Set only for queue-timeout sandboxes, which stay retrievable by ID for 24 hours after the timeout. */
	queueTimedOutAt?: string | null;
	/** The GPU type assigned to the sandbox */
	gpuType?: DaytonaGpuType | null;
	/** The memory quota for the sandbox */
	memory?: number | null;
	/** The disk quota for the sandbox */
	disk?: number | null;
	/** Labels for the sandbox */
	labels?: Record<string, string> | null;
	/** The state of the backup */
	backupState?: string | null;
	/** Auto-stop interval in minutes (0 means disabled) */
	autoStopInterval?: number | null;
	/** Auto-pause interval in minutes (0 means disabled) */
	autoPauseInterval?: number | null;
	/** Auto-archive interval in minutes */
	autoArchiveInterval?: number | null;
	/** Auto-delete interval in minutes (negative value means disabled, 0 means delete immediately upon stopping) */
	autoDeleteInterval?: number | null;
	/** When the sandbox will be automatically destroyed, regardless of its state (only set when a TTL is configured) */
	autoDestroyAt?: string | null;
	/** Minutes to wait for runner assignment before cancelling sandbox creation. Null means the wait is unlimited. */
	queueTimeout?: number | null;
	/** The creation timestamp of the sandbox */
	createdAt?: string | null;
	/** The last update timestamp of the sandbox */
	updatedAt?: string | null;
	/** The last activity timestamp of the sandbox */
	lastActivityAt?: string | null;
	/** The version of the daemon running in the sandbox */
	daemonVersion?: string | null;
	/** Id of the warm pool this sandbox waits in; set only while it is an unclaimed member */
	warmPoolId?: string | null;
	/** The toolbox proxy URL for the sandbox */
	toolboxProxyUrl?: string | null;
};

export type DaytonaSandboxNode = {
	rank?: number | null;
	id?: string | null;
	/** Current state of this logical rank. */
	state?: DaytonaSandboxState | null;
	/** Physical incarnation of this logical rank. */
	incarnation?: number | null;
	/** Failure details for this rank while the multi-node GPU sandbox is degraded. */
	failure?: DaytonaGangNodeFailure | null;
	/** CPU cores allocated to this node. */
	cpu?: number | null;
	/** GPU units allocated to this node. */
	gpu?: number | null;
	/** Memory allocated to this node in GB. */
	memory?: number | null;
	/** Disk allocated to this node in GB. */
	disk?: number | null;
	/** Rail-0 address assigned to this member. */
	fabricAddress?: string | null;
	/** Prefix length of the member rail-0 address. */
	fabricPrefixLength?: number | null;
	/** Latest fabric health reported by the assigned runner. */
	fabricHealthy?: boolean | null;
	/** Start of the current sustained unhealthy interval. */
	fabricUnhealthySince?: string | null;
};

export type DaytonaSandboxState = string;

export type DaytonaSandboxVolume = {
	/** The ID or name of the volume. Resolved to the volume ID on sandbox create. */
	volumeId?: string | null;
	/** The mount path for the volume */
	mountPath?: string | null;
	/** Optional subpath within the volume to mount. When specified, only this S3 prefix will be accessible. When omitted, the entire volume is mounted. */
	subpath?: string | null;
};

export type DaytonaSecret = {
	/** Secret ID */
	id?: string | null;
	/** Secret name */
	name?: string | null;
	/** Optional description of the secret */
	description?: string | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Opaque placeholder token injected as env var value in sandboxes */
	placeholder?: string | null;
	/** Allowed hosts this secret may be sent to */
	hosts?: Array<string> | null;
	/** Last update timestamp */
	updatedAt?: string | null;
};

export type DaytonaSignedPortPreviewUrl = {
	/** ID of the sandbox */
	sandboxId?: string | null;
	/** Port number of the signed preview URL */
	port?: number | null;
	/** Token of the signed preview URL */
	token?: string | null;
	/** Signed preview url */
	url?: string | null;
};

export type DaytonaSnapshotDto = {
	id?: string | null;
	organizationId?: string | null;
	general?: boolean | null;
	name?: string | null;
	imageName?: string | null;
	state?: DaytonaSnapshotState | null;
	size?: number | null;
	entrypoint?: Array<string> | null;
	cpu?: number | null;
	gpu?: number | null;
	/** The GPU type assigned to the snapshot */
	gpuType?: DaytonaGpuType | null;
	mem?: number | null;
	disk?: number | null;
	errorReason?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	lastUsedAt?: string | null;
	/** Build information for the snapshot */
	buildInfo?: DaytonaBuildInfo | null;
	/** IDs of regions where the snapshot is available */
	regionIds?: Array<string> | null;
	/** The initial runner ID of the snapshot */
	initialRunnerId?: string | null;
	/** The snapshot reference */
	ref?: string | null;
	/** The ID of the sandbox the snapshot was created from */
	sourceSandboxId?: string | null;
	/** The sandbox class of the snapshot */
	sandboxClass?: string | null;
};

export type DaytonaSnapshotManagerCredentials = {
	/** Snapshot Manager username for the region */
	username?: string | null;
	/** Snapshot Manager password for the region */
	password?: string | null;
};

export type DaytonaSnapshotState = string;

export type DaytonaSshAccessDto = {
	/** Unique identifier for the SSH access */
	id?: string | null;
	/** ID of the sandbox this SSH access is for */
	sandboxId?: string | null;
	/** SSH access token */
	token?: string | null;
	/** When the SSH access expires */
	expiresAt?: string | null;
	/** When the SSH access was created */
	createdAt?: string | null;
	/** When the SSH access was last updated */
	updatedAt?: string | null;
	/** SSH command to connect to the sandbox */
	sshCommand?: string | null;
};

export type DaytonaSsoOidcConfig = {
	/** OIDC issuer for org-SSO logins (Daytona Auth) */
	issuer?: string | null;
	/** OIDC client ID for org-SSO logins */
	clientId?: string | null;
};

export type DaytonaStorageAccessDto = {
	/** Access key for storage authentication */
	accessKey?: string | null;
	/** Secret key for storage authentication */
	secret?: string | null;
	/** Session token for storage authentication */
	sessionToken?: string | null;
	/** Storage URL */
	storageUrl?: string | null;
	/** Organization ID */
	organizationId?: string | null;
	/** S3 bucket name */
	bucket?: string | null;
	/** Region for the storage backend (e.g. "us-east-2") */
	region?: string | null;
};

export type DaytonaToolboxAccessibilityBounds = {
	height?: number | null;
	width?: number | null;
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxAccessibilityNodesResponse = {
	matches?: Array<DaytonaToolboxcomputeruseAccessibilityNode> | null;
	truncated?: boolean | null;
};

export type DaytonaToolboxAccessibilityTreeResponse = {
	root?: DaytonaToolboxcomputeruseAccessibilityNode | null;
	truncated?: boolean | null;
};

export type DaytonaToolboxChart = {
	elements?: Array<DaytonaToolboxChartElement> | null;
	png?: string | null;
	title?: string | null;
	type?: string | null;
	x_label?: string | null;
	x_scale?: string | null;
	x_tick_labels?: Array<string> | null;
	x_ticks?: Array<number> | null;
	y_label?: string | null;
	y_scale?: string | null;
	y_tick_labels?: Array<string> | null;
	y_ticks?: Array<number> | null;
};

export type DaytonaToolboxChartElement = {
	angle?: number | null;
	first_quartile?: number | null;
	group?: string | null;
	label?: string | null;
	max?: number | null;
	median?: number | null;
	min?: number | null;
	outliers?: Array<number> | null;
	png?: string | null;
	points?: Array<Array<number>> | null;
	radius?: number | null;
	third_quartile?: number | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
	x_label?: string | null;
	y_label?: string | null;
};

export type DaytonaToolboxCodeRunArtifacts = {
	charts?: Array<DaytonaToolboxChart> | null;
};

export type DaytonaToolboxCodeRunResponse = {
	artifacts?: DaytonaToolboxCodeRunArtifacts | null;
	exitCode?: number | null;
	result?: string | null;
};

export type DaytonaToolboxCommand = {
	command?: string | null;
	exitCode?: number | null;
	id?: string | null;
};

export type DaytonaToolboxCompletionItem = {
	detail?: string | null;
	documentation?: DaytonaJsonValue | null;
	filterText?: string | null;
	insertText?: string | null;
	kind?: number | null;
	label?: string | null;
	sortText?: string | null;
};

export type DaytonaToolboxCompletionList = {
	isIncomplete?: boolean | null;
	items?: Array<DaytonaToolboxCompletionItem> | null;
};

export type DaytonaToolboxComputerUseStartResponse = {
	message?: string | null;
	status?: Record<string, DaytonaToolboxProcessStatus> | null;
};

export type DaytonaToolboxComputerUseStatusResponse = {
	status?: string | null;
};

export type DaytonaToolboxComputerUseStopResponse = {
	message?: string | null;
	status?: Record<string, DaytonaToolboxProcessStatus> | null;
};

export type DaytonaToolboxDisplayInfo = {
	height?: number | null;
	id?: number | null;
	isActive?: boolean | null;
	width?: number | null;
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxDisplayInfoResponse = {
	displays?: Array<DaytonaToolboxDisplayInfo> | null;
};

export type DaytonaToolboxEmpty = Record<string, DaytonaJsonValue>;

export type DaytonaToolboxExecuteResponse = {
	exitCode?: number | null;
	result?: string | null;
};

export type DaytonaToolboxFileInfo = {
	group?: string | null;
	isDir?: boolean | null;
	/** Deprecated: ModTime uses Go's time.String() layout which is not a standard format. Use ModifiedAt instead, which is serialized as ISO 8601 / RFC 3339. */
	modTime?: string | null;
	mode?: string | null;
	modifiedAt?: string | null;
	name?: string | null;
	owner?: string | null;
	/** Full path of the entry */
	path?: string | null;
	permissions?: string | null;
	size?: number | null;
};

export type DaytonaToolboxFileStatus = {
	extra?: string | null;
	name?: string | null;
	staging?: DaytonaToolboxStatus | null;
	worktree?: DaytonaToolboxStatus | null;
};

export type DaytonaToolboxGitCommitInfo = {
	author?: string | null;
	email?: string | null;
	hash?: string | null;
	message?: string | null;
	timestamp?: string | null;
};

export type DaytonaToolboxGitCommitResponse = {
	hash?: string | null;
};

export type DaytonaToolboxGitConfigResponse = {
	/** Value is the config value, null when the key is not set. */
	value?: string | null;
};

export type DaytonaToolboxGitRemote = {
	name?: string | null;
	url?: string | null;
};

export type DaytonaToolboxGitStatus = {
	ahead?: number | null;
	behind?: number | null;
	branchPublished?: boolean | null;
	currentBranch?: string | null;
	/** Detached is true when HEAD is not on a branch (detached HEAD state). */
	detached?: boolean | null;
	fileStatus?: Array<DaytonaToolboxFileStatus> | null;
	/** Upstream is the upstream tracking branch (e.g. "origin/main"), empty when unset. */
	upstream?: string | null;
};

export type DaytonaToolboxInterpreterContext = {
	active?: boolean | null;
	createdAt?: string | null;
	cwd?: string | null;
	id?: string | null;
	language?: string | null;
};

export type DaytonaToolboxIsPortInUseResponse = {
	isInUse?: boolean | null;
};

export type DaytonaToolboxListBranchResponse = {
	branches?: Array<string> | null;
	/** Current is the name of the checked out branch (empty when HEAD is detached). */
	current?: string | null;
};

export type DaytonaToolboxListContextsResponse = {
	contexts?: Array<DaytonaToolboxInterpreterContext> | null;
};

export type DaytonaToolboxListRecordingsResponse = {
	recordings?: Array<DaytonaToolboxRecording> | null;
};

export type DaytonaToolboxListRemotesResponse = {
	remotes?: Array<DaytonaToolboxGitRemote> | null;
};

export type DaytonaToolboxLspLocation = {
	range?: DaytonaToolboxLspRange | null;
	uri?: string | null;
};

export type DaytonaToolboxLspPosition = {
	character?: number | null;
	line?: number | null;
};

export type DaytonaToolboxLspRange = {
	end?: DaytonaToolboxLspPosition | null;
	start?: DaytonaToolboxLspPosition | null;
};

export type DaytonaToolboxLspSymbol = {
	kind?: number | null;
	location?: DaytonaToolboxLspLocation | null;
	name?: string | null;
};

export type DaytonaToolboxMatch = {
	content?: string | null;
	file?: string | null;
	line?: number | null;
};

export type DaytonaToolboxMouseClickResponse = {
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxMouseDragResponse = {
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxMousePositionResponse = {
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxPortList = {
	ports?: Array<number> | null;
};

export type DaytonaToolboxPosition = {
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxProcessErrorsResponse = {
	errors?: string | null;
	processName?: string | null;
};

export type DaytonaToolboxProcessLogsResponse = {
	logs?: string | null;
	processName?: string | null;
};

export type DaytonaToolboxProcessRestartResponse = {
	message?: string | null;
	processName?: string | null;
};

export type DaytonaToolboxProcessStatus = {
	autoRestart?: boolean | null;
	pid?: number | null;
	priority?: number | null;
	running?: boolean | null;
};

export type DaytonaToolboxProcessStatusResponse = {
	processName?: string | null;
	running?: boolean | null;
};

export type DaytonaToolboxProxyUrl = {
	/** The toolbox proxy URL for the sandbox */
	url?: string | null;
};

export type DaytonaToolboxPtyCreateResponse = {
	sessionId?: string | null;
};

export type DaytonaToolboxPtyListResponse = {
	sessions?: Array<DaytonaToolboxPtySessionInfo> | null;
};

export type DaytonaToolboxPtySessionInfo = {
	active?: boolean | null;
	cols?: number | null;
	createdAt?: string | null;
	cwd?: string | null;
	envs?: Record<string, string> | null;
	id?: string | null;
	/** Whether this session uses lazy start */
	lazyStart?: boolean | null;
	rows?: number | null;
};

export type DaytonaToolboxRecording = {
	durationSeconds?: number | null;
	endTime?: string | null;
	fileName?: string | null;
	filePath?: string | null;
	id?: string | null;
	sizeBytes?: number | null;
	startTime?: string | null;
	status?: string | null;
};

export type DaytonaToolboxReplaceResult = {
	error?: string | null;
	file?: string | null;
	success?: boolean | null;
};

export type DaytonaToolboxScreenshotResponse = {
	cursorPosition?: DaytonaToolboxPosition | null;
	screenshot?: string | null;
	sizeBytes?: number | null;
};

export type DaytonaToolboxScrollResponse = {
	success?: boolean | null;
};

export type DaytonaToolboxSearchFilesResponse = {
	files?: Array<string> | null;
};

export type DaytonaToolboxSession = {
	commands?: Array<DaytonaToolboxCommand> | null;
	sessionId?: string | null;
};

export type DaytonaToolboxSessionCommandLogsResponse = {
	output?: string | null;
	stderr?: string | null;
	stdout?: string | null;
};

export type DaytonaToolboxSessionExecuteResponse = {
	cmdId?: string | null;
	exitCode?: number | null;
	output?: string | null;
	stderr?: string | null;
	stdout?: string | null;
};

export type DaytonaToolboxStatus = string;

export type DaytonaToolboxSystemMetrics = {
	cpuCount?: number | null;
	cpuUsedPct?: number | null;
	diskFree?: number | null;
	diskTotal?: number | null;
	diskUsed?: number | null;
	memCache?: number | null;
	memTotal?: number | null;
	memUsed?: number | null;
	timestamp?: string | null;
	timestampUnix?: number | null;
};

export type DaytonaToolboxUploadFilesResponse = {
	errors?: Array<string> | null;
	files?: Array<DaytonaToolboxfsFileResult> | null;
};

export type DaytonaToolboxUploadedFile = {
	name?: string | null;
	path?: string | null;
	type?: string | null;
};

export type DaytonaToolboxUserHomeDirResponse = {
	dir?: string | null;
};

export type DaytonaToolboxWindowInfo = {
	height?: number | null;
	id?: number | null;
	isActive?: boolean | null;
	title?: string | null;
	width?: number | null;
	x?: number | null;
	y?: number | null;
};

export type DaytonaToolboxWindowsResponse = {
	windows?: Array<DaytonaToolboxWindowInfo> | null;
};

export type DaytonaToolboxWorkDirResponse = {
	dir?: string | null;
};

export type DaytonaToolboxcomputeruseAccessibilityNode = {
	actions?: Array<string> | null;
	bounds?: DaytonaToolboxAccessibilityBounds | null;
	children?: Array<DaytonaToolboxcomputeruseAccessibilityNode> | null;
	description?: string | null;
	id?: string | null;
	name?: string | null;
	role?: string | null;
	states?: Array<string> | null;
};

export type DaytonaToolboxfsFileResult = {
	bytes?: number | null;
	path?: string | null;
};

export type DaytonaToolboxginH = Record<string, DaytonaJsonValue>;

export type DaytonaTraceSpan = {
	/** Trace identifier */
	traceId?: string | null;
	/** Span identifier */
	spanId?: string | null;
	/** Parent span identifier */
	parentSpanId?: string | null;
	/** Span name */
	spanName?: string | null;
	/** Span start timestamp */
	timestamp?: string | null;
	/** Span duration in nanoseconds */
	durationNs?: number | null;
	/** Span attributes */
	spanAttributes?: Record<string, string> | null;
	/** Status code of the span */
	statusCode?: string | null;
	/** Status message */
	statusMessage?: string | null;
};

export type DaytonaTraceSummary = {
	/** Unique trace identifier */
	traceId?: string | null;
	/** Name of the root span */
	rootSpanName?: string | null;
	/** Trace start time */
	startTime?: string | null;
	/** Trace end time */
	endTime?: string | null;
	/** Total duration in milliseconds */
	durationMs?: number | null;
	/** Number of spans in this trace */
	spanCount?: number | null;
	/** Status code of the trace */
	statusCode?: string | null;
};

export type DaytonaUrl = {
	/** URL response */
	url?: string | null;
};

export type DaytonaVolumeDto = {
	/** Volume ID */
	id?: string | null;
	/** Volume name */
	name?: string | null;
	/** Organization ID */
	organizationId?: string | null;
	/** Volume state */
	state?: DaytonaVolumeState | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
	/** Last used timestamp */
	lastUsedAt?: string | null;
	/** The error reason of the volume */
	errorReason?: string | null;
};

/** Volume state */
export type DaytonaVolumeState = string;

export type DaytonaWarmPool = {
	id?: string | null;
	organizationId?: string | null;
	snapshot?: string | null;
	target?: string | null;
	/** Desired number of warm sandboxes */
	pool?: number | null;
	/** Current number of ready warm sandboxes in the pool */
	currentSize?: number | null;
	cpu?: number | null;
	mem?: number | null;
	disk?: number | null;
	osUser?: string | null;
	env?: Record<string, string> | null;
	errorReason?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type DaytonaWebhookAppPortalAccess = {
	/** The authentication token for the Svix consumer app portal */
	token?: string | null;
	/** The URL to the webhook app portal */
	url?: string | null;
};

export type DaytonaWebhookInitializationStatus = {
	/** Organization ID */
	organizationId?: string | null;
	/** The ID of the Svix application */
	svixApplicationId?: string | null;
	/** The error reason for the last initialization attempt */
	lastError?: string | null;
	/** The number of times the initialization has been attempted */
	retryCount?: number | null;
	/** When the webhook initialization was created */
	createdAt?: string | null;
	/** When the webhook initialization was last updated */
	updatedAt?: string | null;
};

export type DaytonaOperationInputs = {
	'analytics.telemetry.getTrace': {
		/** Organization ID */
		organizationId: string;
		/** Sandbox ID */
		sandboxId: string;
		/** Trace ID */
		traceId: string;
	};
	'analytics.telemetry.logs': {
		/** Organization ID */
		organizationId: string;
		/** Sandbox ID */
		sandboxId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
		/** Comma-separated severity levels */
		severity?: string;
		/** Search text (ILIKE) */
		search?: string;
		/** Page size */
		limit?: number;
		/** Offset */
		offset?: number;
	};
	'analytics.telemetry.metrics': {
		/** Organization ID */
		organizationId: string;
		/** Sandbox ID */
		sandboxId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
		/** Comma-separated metric names */
		metricNames?: string;
	};
	'analytics.telemetry.traces': {
		/** Organization ID */
		organizationId: string;
		/** Sandbox ID */
		sandboxId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
		/** Page size */
		limit?: number;
		/** Offset */
		offset?: number;
	};
	'analytics.usage.aggregated': {
		/** Organization ID */
		organizationId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
	};
	'analytics.usage.bySandbox': {
		/** Organization ID */
		organizationId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
	};
	'analytics.usage.chart': {
		/** Organization ID */
		organizationId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
		/** Region filter */
		region?: string;
	};
	'analytics.usage.sandbox': {
		/** Organization ID */
		organizationId: string;
		/** Sandbox ID */
		sandboxId: string;
		/** Start time (RFC3339) */
		from: string;
		/** End time (RFC3339) */
		to: string;
	};
	'apiKeys.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** The name of the API key */
		name: string;
		/** The list of organization resource permissions explicitly assigned to the API key */
		permissions: Array<
			| 'write:registries'
			| 'delete:registries'
			| 'write:snapshots'
			| 'delete:snapshots'
			| 'write:sandboxes'
			| 'delete:sandboxes'
			| 'read:volumes'
			| 'write:volumes'
			| 'delete:volumes'
			| 'write:regions'
			| 'delete:regions'
			| 'read:runners'
			| 'write:runners'
			| 'delete:runners'
			| 'read:audit_logs'
			| 'manage:api_keys'
			| 'manage:secrets'
			| 'read:limits'
			| 'manage:sso'
			| 'read:billing'
			| 'manage:billing'
		>;
		/** When the API key expires */
		expiresAt?: string | null;
	};
	'apiKeys.delete': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		name: string;
	};
	'apiKeys.getCurrent': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'apiKeys.list': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'audit.getOrganizationLogs': {
		/** Organization ID */
		organizationId: string;
		/** Page number of the results */
		page?: number;
		/** Number of results per page */
		limit?: number;
		/** Deprecated alias for `createdAt[gte]`. From date (ISO 8601 format). */
		from?: string;
		/** Deprecated alias for `createdAt[lte]`. To date (ISO 8601 format). */
		to?: string;
		/** Token for cursor-based pagination. When provided, takes precedence over page parameter. */
		nextToken?: string;
		/** Filter by audit log ID. */
		id?: DaytonaStringFilterInput;
		/** Filter by actor user ID. */
		actorId?: DaytonaStringFilterInput;
		/** Filter by actor email. */
		actorEmail?: DaytonaStringFilterInput;
		/** Filter by actor API key prefix. */
		actorApiKeyPrefix?: DaytonaStringFilterInput;
		/** Filter by actor API key suffix. */
		actorApiKeySuffix?: DaytonaStringFilterInput;
		/** Filter by action. */
		action?: DaytonaStringFilterInput;
		/** Filter by target type. */
		targetType?: DaytonaStringFilterInput;
		/** Filter by target ID. */
		targetId?: DaytonaStringFilterInput;
		/** Filter by HTTP status code. */
		statusCode?: DaytonaIntFilterInput;
		/** Filter by creation timestamp. */
		createdAt?: DaytonaDateFilterInput;
		/** Filter by the partner application that obtained the actor token. */
		actorPartner?: DaytonaStringFilterInput;
	};
	'audit.getScenarios': Record<string, never>;
	'config.get': Record<string, never>;
	'dockerRegistries.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** IAM role ARN for registry mTLS; supply with mtlsSecretArn, or set both to null to clear */
		mtlsRoleArn?: string | null;
		/** Secrets Manager ARN for registry mTLS; supply with mtlsRoleArn, or set both to null to clear */
		mtlsSecretArn?: string | null;
		/** Registry name */
		name: string;
		/** Registry URL */
		url: string;
		/** Registry username */
		username: string;
		/** Registry password */
		password: string;
		/** Registry project */
		project?: string;
	};
	'dockerRegistries.delete': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the docker registry */
		id: string;
	};
	'dockerRegistries.get': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the docker registry */
		id: string;
	};
	'dockerRegistries.getTransientPushAccess': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the region where the snapshot will be available (defaults to organization default region) */
		regionId?: string;
	};
	'dockerRegistries.list': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'dockerRegistries.update': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the docker registry */
		id: string;
		/** IAM role ARN for registry mTLS; supply with mtlsSecretArn, or set both to null to clear */
		mtlsRoleArn?: string | null;
		/** Secrets Manager ARN for registry mTLS; supply with mtlsRoleArn, or set both to null to clear */
		mtlsSecretArn?: string | null;
		/** Registry name */
		name: string;
		/** Registry URL */
		url: string;
		/** Registry username */
		username: string;
		/** Registry password */
		password?: string;
		/** Registry project */
		project?: string;
	};
	'health.live': Record<string, never>;
	'health.ready': Record<string, never>;
	'objectStorage.getPushAccess': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region the build context will be used in. When that region has its own build-context bucket, the returned credentials target it; otherwise they target the Daytona-hosted bucket. */
		regionId?: string;
	};
	'organizations.createRegion': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region name */
		name: string;
		/** Proxy URL for the region */
		proxyUrl?: string | null;
		/** SSH Gateway URL for the region */
		sshGatewayUrl?: string | null;
		/** Snapshot Manager URL for the region */
		snapshotManagerUrl?: string | null;
		/** OTel collector endpoint for sandboxes created in this region. When set, sandbox OTel data is sent to this endpoint instead of the Daytona-hosted collector and will not be available in the Daytona analytics API or dashboard. */
		otelEndpoint?: string | null;
		/** S3 bucket in your AWS account that declarative-build context is uploaded to for this region. Requires buildContextBucketRegion and buildContextRoleArn. */
		buildContextBucket?: string | null;
		/** AWS region of buildContextBucket (standard aws partition only) */
		buildContextBucketRegion?: string | null;
		/** IAM role Daytona assumes (with your organization ID as ExternalId) to issue upload credentials for buildContextBucket */
		buildContextRoleArn?: string | null;
	};
	'organizations.deleteRegion': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region ID */
		id: string;
	};
	'organizations.getGpuCapacity': {
		/** Organization ID */
		organizationId: string;
	};
	'organizations.getOtelConfig': {
		/** Organization ID */
		organizationId: string;
	};
	'organizations.getRegionById': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region ID */
		id: string;
	};
	'organizations.getUsageOverview': {
		/** Organization ID */
		organizationId: string;
	};
	'organizations.listAvailableRegions': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'organizations.listAvailableSandboxClasses': {
		/** Organization ID */
		organizationId: string;
	};
	'organizations.listMembers': {
		/** Organization ID */
		organizationId: string;
	};
	'organizations.regenerateProxyApiKey': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region ID */
		id: string;
	};
	'organizations.regenerateSnapshotManagerCredentials': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region ID */
		id: string;
	};
	'organizations.regenerateSshGatewayApiKey': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region ID */
		id: string;
	};
	'organizations.updateRegion': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Region ID */
		id: string;
		/** Proxy URL for the region */
		proxyUrl?: string | null;
		/** SSH Gateway URL for the region */
		sshGatewayUrl?: string | null;
		/** Snapshot Manager URL for the region */
		snapshotManagerUrl?: string | null;
		/** OTel collector endpoint for sandboxes created in this region. When set, sandbox OTel data is sent to this endpoint instead of the Daytona-hosted collector and will not be available in the Daytona analytics API or dashboard. */
		otelEndpoint?: string | null;
		/** S3 bucket in your AWS account that declarative-build context is uploaded to for this region. Requires buildContextBucketRegion and buildContextRoleArn. */
		buildContextBucket?: string | null;
		/** AWS region of buildContextBucket (standard aws partition only) */
		buildContextBucketRegion?: string | null;
		/** IAM role Daytona assumes (with your organization ID as ExternalId) to issue upload credentials for buildContextBucket */
		buildContextRoleArn?: string | null;
	};
	'regions.listShared': Record<string, never>;
	'runners.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		regionId: string;
		name: string;
		/** Tags to associate with the runner */
		tags?: Array<string>;
		/** The sandbox class supported by the runner. Defaults to container when omitted or null. */
		sandboxClass?: DaytonaCreateRunnerSandboxClassInput;
	};
	'runners.delete': {
		/** Runner ID */
		id: string;
		/** Delete the runner without waiting for sandboxes already marked for destruction. Requires the runner to have stopped reporting as ready. */
		force?: boolean;
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'runners.getById': {
		/** Runner ID */
		id: string;
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'runners.getFullById': {
		/** Runner ID */
		id: string;
	};
	'runners.list': {
		/** Filter runners by region ID */
		regionId?: string;
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'runners.updateDraining': {
		/** Runner ID */
		id: string;
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'runners.updateScheduling': {
		/** Runner ID */
		id: string;
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'sandboxes.addNodes': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		/** Current sandbox topology generation. */
		expectedGeneration: number;
		/** One resource specification per appended rank. */
		nodes: Array<DaytonaGangNodeResourcesInput>;
	};
	'sandboxes.archive': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
	};
	'sandboxes.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** The name of the sandbox. If not provided, the sandbox ID will be used as the name */
		name?: string;
		/** The ID or name of the snapshot used for the sandbox */
		snapshot?: string;
		/** The user associated with the project */
		user?: string;
		/** Environment variables for the sandbox */
		env?: Record<string, string>;
		/** Labels for the sandbox */
		labels?: Record<string, string>;
		/** Whether the sandbox http preview is publicly accessible */
		public?: boolean;
		/** Whether to block all network access for the sandbox */
		networkBlockAll?: boolean;
		/** Expose KVM (/dev/kvm) inside the sandbox via nested virtualization. linux-vm snapshots only. Requires the sandbox_kvm feature for the organization. */
		kvm?: boolean;
		/** Comma-separated list of allowed CIDR network addresses for the sandbox */
		networkAllowList?: string;
		/** Comma-separated list of allowed domains for the sandbox */
		domainAllowList?: string;
		/** Outbound proxy URL to route the sandbox HTTP(S) traffic through (http or https; credentials may be included in the URL). On its own this is convenience routing, not a security boundary: it is applied by injecting the standard HTTP(S)_PROXY environment variables at creation, so a process that… */
		outboundProxyUrl?: string;
		/** OTel collector endpoint override for this sandbox. When set, sandbox OTel data is sent to this endpoint instead of the default collector (the Daytona-hosted collector or the region-configured endpoint) and will not be available in the Daytona analytics API or dashboard. */
		otelEndpointOverride?: string;
		/** The target (region) where the sandbox will be created */
		target?: string;
		/** CPU cores allocated to the sandbox. On a multi-node sandbox this scalar applies to every node. */
		cpu?: number;
		/** CPU cores for each node in rank order. Specify either cpu or cpuPerNode. */
		cpuPerNode?: Array<number> | null;
		/** GPU units allocated to the sandbox */
		gpu?: number;
		/** Preferred GPU type for the sandbox. Accepts a single value or an ordered preference list — the scheduler tries each in order and pins the sandbox to the first that has capacity. */
		gpuType?: Array<DaytonaGpuTypeInput>;
		/** GPU-only. When true, the sandbox may be instantly terminated without notice to free GPU capacity for an on-demand (non-spot) GPU sandbox. Ignored / rejected when the sandbox requests no GPUs. */
		spot?: boolean;
		/** Memory in GB allocated to the sandbox. On a multi-node sandbox this scalar applies to every node. */
		memory?: number;
		/** Memory in GB for each node in rank order. Specify either memory or memoryPerNode. */
		memoryPerNode?: Array<number> | null;
		/** Disk space in GB allocated to the sandbox. On a multi-node sandbox this scalar applies to every node. */
		disk?: number;
		/** Disk space in GB for each node in rank order. Specify either disk or diskPerNode. */
		diskPerNode?: Array<number> | null;
		/** Auto-stop interval in minutes (0 means disabled) */
		autoStopInterval?: number;
		/** Auto-pause interval in minutes (0 means disabled). Only supported for sandbox classes that support pausing. Not allowed for ephemeral sandboxes. At most one of autoStopInterval and autoPauseInterval may be non-zero. For non-ephemeral sandbox classes that support pausing, defaults to 60 minutes… */
		autoPauseInterval?: number;
		/** Auto-archive interval in minutes (0 means the maximum interval will be used) */
		autoArchiveInterval?: number;
		/** Auto-delete interval in minutes (negative value means disabled, 0 means delete immediately upon stopping) */
		autoDeleteInterval?: number;
		/** Maximum time to live in minutes, counted as wall-clock time since creation regardless of sandbox state (0 means disabled). When it elapses the sandbox is destroyed, even if it is stopped, paused, or archived. Subject to the maximum sandbox lifespan configured for the organization region and… */
		ttlMinutes?: number;
		/** Minutes to wait for runner assignment before cancelling sandbox creation. Applies only while the sandbox is unassigned in pending_build or pulling_snapshot. Only honored when default queue timeout is enabled for the organization. Omit to use the organization default; null/omit with no… */
		queueTimeout?: number;
		/** Array of volumes to attach to the sandbox */
		volumes?: Array<DaytonaSandboxVolumeInput>;
		/** Build information for the sandbox */
		buildInfo?: DaytonaCreateBuildInfoInput;
		/** ID or name of an existing sandbox to link the new sandbox to. The new sandbox will be scheduled on the same runner as the linked sandbox so a local network can be established between them. Linked sandboxes must be ephemeral (autoDeleteInterval=0) and cannot themselves be linked to another… */
		linkedSandbox?: string;
		/** Secrets to mount in this sandbox. Each entry maps an env var name to a vault secret name. */
		secrets?: Array<Record<string, string>>;
	};
	'sandboxes.createSnapshot': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		/** Name for the new snapshot */
		name: string;
		/** Include the VM's memory in the snapshot. VM sandboxes only. When true the sandbox must be STARTED; when false (default) VM sandboxes must be STOPPED. Container sandboxes do not support memory snapshots. */
		includeMemory?: boolean;
	};
	'sandboxes.createSshAccess': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Expiration time in minutes (default: 60, maximum: 1440) */
		expiresInMinutes?: number;
	};
	'sandboxes.delete': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
	};
	'sandboxes.expireSignedPortPreviewUrl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Port number to expire signed preview URL for */
		port: number;
		/** Token to expire signed preview URL for */
		token: string;
	};
	'sandboxes.fork': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		/** The name for the forked sandbox. If not provided, a unique name will be generated. */
		name?: string;
	};
	'sandboxes.get': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Include verbose output */
		verbose?: boolean;
	};
	'sandboxes.getAncestors': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
	};
	'sandboxes.getBuildLogsUrl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
	};
	'sandboxes.getForks': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		includeDestroyed?: boolean;
	};
	'sandboxes.getGangMembershipOperation': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		operationId: string;
	};
	'sandboxes.getLogs': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
		/** Start of time range (ISO 8601) */
		from: string;
		/** End of time range (ISO 8601) */
		to: string;
		/** Page number (1-indexed) */
		page?: number;
		/** Number of items per page */
		limit?: number;
		/** Filter by severity levels (DEBUG, INFO, WARN, ERROR) */
		severities?: Array<string>;
		/** Search in log body */
		search?: string;
	};
	'sandboxes.getMetrics': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
		/** Start of time range (ISO 8601) */
		from: string;
		/** End of time range (ISO 8601) */
		to: string;
		/** Filter by metric names */
		metricNames?: Array<string>;
	};
	'sandboxes.getParent': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
	};
	'sandboxes.getPortPreviewUrl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Port number to get preview URL for */
		port: number;
	};
	'sandboxes.getSignedPortPreviewUrl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Port number to get signed preview URL for */
		port: number;
		/** Expiration time in seconds (default: 60 seconds) */
		expiresInSeconds?: number;
	};
	'sandboxes.getSigningKey': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
	};
	'sandboxes.getToolboxProxyUrl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
	};
	'sandboxes.getTraceSpans': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
		/** ID of the trace */
		traceId: string;
	};
	'sandboxes.getTraces': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
		/** Start of time range (ISO 8601) */
		from: string;
		/** End of time range (ISO 8601) */
		to: string;
		/** Page number (1-indexed) */
		page?: number;
		/** Number of items per page */
		limit?: number;
	};
	'sandboxes.list': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Pagination cursor from a previous response */
		cursor?: string;
		/** Number of results per page */
		limit?: number;
		/** Filter by ID prefix (case-insensitive) */
		id?: string;
		/** Filter by name prefix (case-insensitive) */
		name?: string;
		/** JSON encoded labels to filter by */
		labels?: string;
		/** Include results with errored state and deleted desired state */
		includeErroredDeleted?: boolean;
		/** Include unclaimed warm pool sandboxes (excluded by default) */
		includeWarm?: boolean;
		/** List of states to filter by. */
		states?: Array<DaytonaSandboxStateInput>;
		/** List of snapshot names to filter by */
		snapshots?: Array<string>;
		/** List of regions IDs to filter by */
		regionIds?: Array<string>;
		/** List of sandbox classes to filter by */
		sandboxClasses?: Array<DaytonaSandboxClassInput>;
		/** Minimum CPU */
		minCpu?: number;
		/** Maximum CPU */
		maxCpu?: number;
		/** Minimum memory in GiB */
		minMemoryGiB?: number;
		/** Maximum memory in GiB */
		maxMemoryGiB?: number;
		/** Minimum disk space in GiB */
		minDiskGiB?: number;
		/** Maximum disk space in GiB */
		maxDiskGiB?: number;
		/** Minimum GPU */
		minGpu?: number;
		/** Maximum GPU */
		maxGpu?: number;
		/** Filter by public status */
		isPublic?: boolean;
		/** Filter by recoverable status */
		isRecoverable?: boolean;
		/** Include items created after this timestamp */
		createdAtAfter?: string;
		/** Include items created before this timestamp */
		createdAtBefore?: string;
		/** Include items with last event after this timestamp */
		lastEventAfter?: string;
		/** Include items with last event before this timestamp */
		lastEventBefore?: string;
		/** Include items scheduled for auto destroy after this timestamp */
		autoDestroyAtAfter?: string;
		/** Include items scheduled for auto destroy before this timestamp */
		autoDestroyAtBefore?: string;
		/** Field to sort by */
		sort?: DaytonaSandboxListSortFieldInput;
		/** Direction to sort by */
		order?: DaytonaSandboxListSortDirectionInput;
	};
	'sandboxes.pause': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
	};
	'sandboxes.recover': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** If true, the sandbox is left in STOPPED after recovery instead of being started. */
		skipStart?: boolean;
	};
	'sandboxes.removeNodes': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		/** Current sandbox topology generation. */
		expectedGeneration: number;
		/** Number of highest ranks to remove. */
		count: number;
	};
	'sandboxes.replaceLabels': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Key-value pairs of labels */
		labels: Record<string, string>;
	};
	'sandboxes.replaceNode': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		sandboxIdOrName: string;
		rank: string;
		/** Current sandbox topology generation. */
		expectedGeneration: number;
	};
	'sandboxes.resize': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** CPU cores to allocate to the sandbox (minimum: 1) */
		cpu?: number;
		/** Memory in GB to allocate to the sandbox (minimum: 1) */
		memory?: number;
		/** Disk space in GB to allocate to the sandbox (can only be increased) */
		disk?: number;
	};
	'sandboxes.revokeSshAccess': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** SSH access token to revoke. If not provided, all SSH access for the sandbox will be revoked. */
		token?: string;
	};
	'sandboxes.rotateSigningKey': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
	};
	'sandboxes.setAutoArchiveInterval': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Auto-archive interval in minutes (0 means the maximum interval will be used) */
		interval: number;
	};
	'sandboxes.setAutoDeleteInterval': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Auto-delete interval in minutes (negative value means disabled, 0 means delete immediately upon stopping) */
		interval: number;
	};
	'sandboxes.setAutoPauseInterval': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Auto-pause interval in minutes (0 to disable) */
		interval: number;
	};
	'sandboxes.setAutostopInterval': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Auto-stop interval in minutes (0 to disable) */
		interval: number;
	};
	'sandboxes.setTtl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Maximum time to live in minutes, re-anchored from the current time (0 to disable). When it elapses the sandbox is destroyed, even if it is stopped, paused, or archived. On a multi-node head, expiry destroys every member and all ephemeral local data */
		ttlMinutes: number;
	};
	'sandboxes.start': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
	};
	'sandboxes.stop': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Force stop the sandbox using SIGKILL instead of SIGTERM */
		force?: boolean;
	};
	'sandboxes.updateLastActivity': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the sandbox */
		sandboxId: string;
		/** Optional type of interaction that reset the activity timer. */
		activityType?: string;
	};
	'sandboxes.updateNetworkSettings': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Whether to block all network access for the sandbox */
		networkBlockAll?: boolean;
		/** Comma-separated list of allowed CIDR network addresses for the sandbox */
		networkAllowList?: string;
		/** Comma-separated list of allowed domains for the sandbox */
		domainAllowList?: string;
	};
	'sandboxes.updatePublicStatus': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Public status to set */
		isPublic: boolean;
	};
	'sandboxes.updateSecrets': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID or name of the sandbox */
		sandboxIdOrName: string;
		/** Secrets to mount in this sandbox, replacing the previously mounted set. Each entry maps an env var name to a vault secret name. Pass an empty array to detach all secrets. */
		secrets: Array<Record<string, string>>;
	};
	'secrets.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Secret name (alphanumeric, hyphens, underscores) */
		name: string;
		/** Secret value */
		value: string;
		/** Optional description of the secret */
		description?: string;
		/** Allowed hosts this secret may be sent to */
		hosts?: Array<string>;
	};
	'secrets.delete': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the secret */
		secretId: string;
	};
	'secrets.get': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the secret */
		secretId: string;
	};
	'secrets.listPaginated': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Pagination cursor from a previous response */
		cursor?: string;
		/** Number of results per page */
		limit?: number;
		/** Filter by partial name match */
		name?: string;
		/** Field to sort by */
		sort?: 'name' | 'createdAt' | 'updatedAt';
		/** Direction to sort by */
		order?: 'asc' | 'desc';
	};
	'secrets.update': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the secret */
		secretId: string;
		/** New secret value */
		value?: string;
		/** Optional description of the secret */
		description?: string;
		/** Allowed hosts this secret may be sent to */
		hosts?: Array<string>;
	};
	'snapshots.activate': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Snapshot ID */
		id: string;
	};
	'snapshots.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** The name of the snapshot */
		name: string;
		/** The image name of the snapshot */
		imageName?: string;
		/** The entrypoint command for the snapshot */
		entrypoint?: Array<string>;
		/** CPU cores allocated to the resulting sandbox */
		cpu?: number;
		/** GPU units allocated to the resulting sandbox */
		gpu?: number;
		/** Preferred GPU type for the resulting sandbox. */
		gpuType?: Array<DaytonaGpuTypeInput>;
		/** Memory allocated to the resulting sandbox in GB */
		memory?: number;
		/** Disk space allocated to the sandbox in GB */
		disk?: number;
		/** Build information for the snapshot */
		buildInfo?: DaytonaCreateBuildInfoInput;
		/** ID of the region where the snapshot will be available. Defaults to organization default region if not specified. */
		regionId?: string;
		/** Target sandbox class. Determines which runners can host sandboxes created from this snapshot. */
		sandboxClass?: DaytonaSandboxClassInput;
	};
	'snapshots.deactivate': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Snapshot ID */
		id: string;
	};
	'snapshots.get': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Snapshot ID or name */
		id: string;
	};
	'snapshots.getAll': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Page number of the results */
		page?: number;
		/** Number of results per page */
		limit?: number;
		/** Filter by partial name match */
		name?: string;
		/** Filter by the ID of the sandbox the snapshot was created from */
		sourceSandboxId?: string;
		/** Field to sort by */
		sort?: 'name' | 'state' | 'lastUsedAt' | 'createdAt';
		/** Direction to sort by */
		order?: 'asc' | 'desc';
	};
	'snapshots.getBuildLogsUrl': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Snapshot ID */
		id: string;
	};
	'snapshots.remove': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Snapshot ID */
		id: string;
	};
	'toolbox.computerUse.click': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** left, right, middle */
		button?: string;
		/** Clicks is a pointer so an omitted value is distinguishable from an explicit 0, which must be rejected rather than silently defaulted. */
		clicks?: number;
		double?: boolean;
		modifiers?: Array<string>;
		x?: number;
		y?: number;
	};
	'toolbox.computerUse.deleteRecording': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Recording ID */
		id: string;
	};
	'toolbox.computerUse.downloadRecording': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Recording ID */
		id: string;
	};
	'toolbox.computerUse.drag': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		button?: string;
		endX?: number;
		endY?: number;
		modifiers?: Array<string>;
		startX?: number;
		startY?: number;
	};
	'toolbox.computerUse.findAccessibilityNodes': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		limit?: number;
		name?: string;
		/** "exact" | "substring" | "regex" */
		nameMatch?: string;
		pid?: number;
		role?: string;
		scope?: string;
		states?: Array<string>;
	};
	'toolbox.computerUse.focusAccessibilityNode': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		id: string;
	};
	'toolbox.computerUse.getAccessibilityTree': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Scope: focused | pid | all (default: focused) */
		scope?: string;
		/** Process ID when scope=pid */
		pid?: number;
		/** Max tree depth (-1 unbounded, 0 root only; default -1) */
		maxDepth?: number;
	};
	'toolbox.computerUse.getComputerUseStatus': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.getComputerUseSystemStatus': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.getDisplayInfo': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.getMousePosition': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.getProcessErrors': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Process name to get errors for */
		processName: string;
	};
	'toolbox.computerUse.getProcessLogs': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Process name to get logs for */
		processName: string;
	};
	'toolbox.computerUse.getProcessStatus': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Process name to check */
		processName: string;
	};
	'toolbox.computerUse.getRecording': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Recording ID */
		id: string;
	};
	'toolbox.computerUse.getWindows': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.invokeAccessibilityNode': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		action?: string;
		id: string;
	};
	'toolbox.computerUse.keyDown': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** e.g., "ctrl", "shift", "a" */
		key: string;
	};
	'toolbox.computerUse.keyUp': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** e.g., "ctrl", "shift", "a" */
		key: string;
	};
	'toolbox.computerUse.listRecordings': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.mouseDown': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** left, right, middle */
		button?: string;
		x?: number;
		y?: number;
	};
	'toolbox.computerUse.mouseUp': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** left, right, middle */
		button?: string;
		x?: number;
		y?: number;
	};
	'toolbox.computerUse.moveMouse': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		x?: number;
		y?: number;
	};
	'toolbox.computerUse.pressHotkey': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** e.g., "ctrl+c", "cmd+v" */
		keys?: string;
	};
	'toolbox.computerUse.pressKey': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		key?: string;
		/** ctrl, alt, shift, cmd */
		modifiers?: Array<string>;
	};
	'toolbox.computerUse.restartProcess': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Process name to restart */
		processName: string;
	};
	'toolbox.computerUse.scroll': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		amount?: number;
		/** up, down, left, right */
		direction?: string;
		modifiers?: Array<string>;
		x?: number;
		y?: number;
	};
	'toolbox.computerUse.setAccessibilityNodeValue': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		id: string;
		value?: string;
	};
	'toolbox.computerUse.startComputerUse': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.startRecording': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		label?: string;
	};
	'toolbox.computerUse.stopComputerUse': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.computerUse.stopRecording': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		id: string;
	};
	'toolbox.computerUse.takeCompressedRegionScreenshot': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** X coordinate of the region */
		x: number;
		/** Y coordinate of the region */
		y: number;
		/** Width of the region */
		width: number;
		/** Height of the region */
		height: number;
		/** Whether to show cursor in screenshot */
		showCursor?: boolean;
		/** Image format (png or jpeg) */
		format?: string;
		/** JPEG quality (1-100) */
		quality?: number;
		/** Scale factor (0.1-1.0) */
		scale?: number;
	};
	'toolbox.computerUse.takeCompressedScreenshot': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Whether to show cursor in screenshot */
		showCursor?: boolean;
		/** Image format (png or jpeg) */
		format?: string;
		/** JPEG quality (1-100) */
		quality?: number;
		/** Scale factor (0.1-1.0) */
		scale?: number;
	};
	'toolbox.computerUse.takeRegionScreenshot': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** X coordinate of the region */
		x: number;
		/** Y coordinate of the region */
		y: number;
		/** Width of the region */
		width: number;
		/** Height of the region */
		height: number;
		/** Whether to show cursor in screenshot */
		showCursor?: boolean;
	};
	'toolbox.computerUse.takeScreenshot': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Whether to show cursor in screenshot */
		showCursor?: boolean;
	};
	'toolbox.computerUse.typeText': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** milliseconds between keystrokes */
		delay?: number;
		text?: string;
	};
	'toolbox.files.bulkDownload': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		paths: Array<string>;
	};
	'toolbox.files.bulkUpload': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.files.createFolder': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Folder path to create */
		path: string;
		/** Octal permission mode (default: 0755) */
		mode: string;
	};
	'toolbox.files.delete': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** File or directory path to delete */
		path: string;
		/** Enable recursive deletion for directories */
		recursive?: boolean;
	};
	'toolbox.files.download': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** File path to download */
		path: string;
	};
	'toolbox.files.findIn': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Directory path to search in */
		path: string;
		/** Text pattern to search for */
		pattern: string;
	};
	'toolbox.files.getInfo': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** File or directory path */
		path: string;
	};
	'toolbox.files.list': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Directory path to list (defaults to working directory) */
		path?: string;
		/** How many levels deep to list (default: 1, must be >= 1) */
		depth?: number;
	};
	'toolbox.files.move': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Source file or directory path */
		source: string;
		/** Destination file or directory path */
		destination: string;
	};
	'toolbox.files.replaceIn': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		files: Array<string>;
		newValue: string;
		pattern: string;
	};
	'toolbox.files.search': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Directory path to search in */
		path: string;
		/** File pattern to match (e.g., *.txt, *.go) */
		pattern: string;
	};
	'toolbox.files.setPermissions': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** File or directory path */
		path: string;
		/** Owner (username or UID) */
		owner?: string;
		/** Group (group name or GID) */
		group?: string;
		/** File mode in octal format (e.g., 0755) */
		mode?: string;
	};
	'toolbox.files.upload': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Destination path for the uploaded file */
		path: string;
		/** File to upload (multipart/form-data) */
		file?: FileInput;
	};
	'toolbox.git.addFiles': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** files to add (use . for all files) */
		files: Array<string>;
		path: string;
	};
	'toolbox.git.addRemote': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Fetch fetches from the remote immediately after adding it. */
		fetch?: boolean;
		name: string;
		/** Overwrite replaces an existing remote with the same name. */
		overwrite?: boolean;
		path: string;
		url: string;
	};
	'toolbox.git.authenticate': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Host defaults to github.com. */
		host?: string;
		password: string;
		/** Protocol defaults to https. */
		protocol?: string;
		username: string;
	};
	'toolbox.git.checkoutBranch': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		branch: string;
		path: string;
	};
	'toolbox.git.cloneRepository': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		branch?: string;
		commit_id?: string;
		/** Depth creates a shallow clone truncated to the given number of commits. */
		depth?: number;
		/** Skip TLS certificate verification for this clone. Defaults to false (verify). Set to true ONLY for trusted internal Git servers with self-signed or private-CA certs; credentials, if supplied, will be transmitted over an unverified TLS connection and are exposed to any MITM on the route. */
		insecure_skip_tls?: boolean;
		password?: string;
		path: string;
		url: string;
		username?: string;
	};
	'toolbox.git.commitChanges': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		allow_empty?: boolean;
		author: string;
		email: string;
		message: string;
		path: string;
	};
	'toolbox.git.configureUser': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		email: string;
		name: string;
		/** Path is the repository path, required when scope is "local". */
		path?: string;
		/** Scope is one of global (default), local or system. */
		scope?: string;
	};
	'toolbox.git.createBranch': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		name: string;
		path: string;
	};
	'toolbox.git.deleteBranch': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		name: string;
		path: string;
	};
	'toolbox.git.getCommitHistory': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Repository path */
		path: string;
	};
	'toolbox.git.getConfig': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Config key (e.g. user.name) */
		key: string;
		/** Repository path (required for local scope) */
		path?: string;
		/** Config scope: global (default), local or system */
		scope?: string;
	};
	'toolbox.git.getStatus': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Repository path */
		path: string;
	};
	'toolbox.git.initRepository': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Bare creates a repository without a working tree. */
		bare?: boolean;
		/** InitialBranch sets the name of the initial branch. */
		initial_branch?: string;
		path: string;
	};
	'toolbox.git.listBranches': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Repository path */
		path: string;
	};
	'toolbox.git.listRemotes': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Repository path */
		path: string;
	};
	'toolbox.git.pullChanges': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Branch to pull (defaults to the current branch's upstream). */
		branch?: string;
		password?: string;
		path: string;
		/** Remote to pull from (defaults to "origin"). */
		remote?: string;
		username?: string;
	};
	'toolbox.git.pushChanges': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Branch to push (defaults to the current branch). */
		branch?: string;
		password?: string;
		path: string;
		/** Remote to push to (defaults to "origin"). */
		remote?: string;
		/** SetUpstream records the pushed branch as the upstream tracking branch. */
		set_upstream?: boolean;
		username?: string;
	};
	'toolbox.git.resetChanges': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Files constrains the reset to the given paths. */
		files?: Array<string>;
		/** Mode is one of soft, mixed (default), hard, merge or keep. */
		mode?: string;
		path: string;
		/** Target is the revision to reset to (defaults to HEAD). */
		target?: string;
	};
	'toolbox.git.restoreFiles': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		files: Array<string>;
		path: string;
		/** Source restores file contents from the given revision instead of the index. */
		source?: string;
		/** Staged restores the staging index for the given files. */
		staged?: boolean;
		/** Worktree restores the working tree for the given files. */
		worktree?: boolean;
	};
	'toolbox.git.setConfig': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		key: string;
		/** Path is the repository path, required when scope is "local". */
		path?: string;
		/** Scope is one of global (default), local or system. */
		scope?: string;
		value: string;
	};
	'toolbox.info.getUserHomeDir': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.info.getVersion': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.info.getWorkDir': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.interpreter.createInterpreterContext': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		cwd?: string;
		language?: string;
	};
	'toolbox.interpreter.deleteInterpreterContext': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Context ID */
		id: string;
	};
	'toolbox.interpreter.executeInterpreterCode': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.interpreter.listInterpreterContexts': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.lsp.completions': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		context?: DaytonaToolboxCompletionContextInput;
		languageId: string;
		pathToProject: string;
		position: DaytonaToolboxLspPositionInput;
		uri: string;
	};
	'toolbox.lsp.didClose': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		languageId: string;
		pathToProject: string;
		uri: string;
	};
	'toolbox.lsp.didOpen': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		languageId: string;
		pathToProject: string;
		uri: string;
	};
	'toolbox.lsp.documentSymbols': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Language ID (e.g., python, typescript) */
		languageId: string;
		/** Path to project */
		pathToProject: string;
		/** Document URI */
		uri: string;
	};
	'toolbox.lsp.start': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		languageId: string;
		pathToProject: string;
	};
	'toolbox.lsp.stop': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		languageId: string;
		pathToProject: string;
	};
	'toolbox.lsp.workspaceSymbols': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Search query */
		query: string;
		/** Language ID (e.g., python, typescript) */
		languageId: string;
		/** Path to project */
		pathToProject: string;
	};
	'toolbox.ports.get': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.ports.isInUse': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Port number (3000-9999) */
		port: number;
	};
	'toolbox.process.codeRun': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		argv?: Array<string>;
		code: string;
		envs?: Record<string, string>;
		/** python, javascript, typescript */
		language: string;
		timeout?: number;
	};
	'toolbox.process.createPtySession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		cols?: number;
		cwd?: string;
		envs?: Record<string, string>;
		id?: string;
		/** Don't start PTY until first client connects */
		lazyStart?: boolean;
		rows?: number;
	};
	'toolbox.process.createSession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		sessionId: string;
	};
	'toolbox.process.deletePtySession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** PTY session ID */
		sessionId: string;
	};
	'toolbox.process.deleteSession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Session ID */
		sessionId: string;
	};
	'toolbox.process.executeCommand': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		command: string;
		/** Current working directory */
		cwd?: string;
		/** Environment variables to set for the command */
		envs?: Record<string, string>;
		/** Timeout in seconds, defaults to 10 seconds */
		timeout?: number;
	};
	'toolbox.process.getEntrypointLogs': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Follow logs in real-time (WebSocket only) */
		follow?: boolean;
	};
	'toolbox.process.getEntrypointSession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.process.getPtySession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** PTY session ID */
		sessionId: string;
	};
	'toolbox.process.getSession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Session ID */
		sessionId: string;
	};
	'toolbox.process.getSessionCommand': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Session ID */
		sessionId: string;
		/** Command ID */
		commandId: string;
	};
	'toolbox.process.getSessionCommandLogs': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Session ID */
		sessionId: string;
		/** Command ID */
		commandId: string;
		/** Follow logs in real-time (WebSocket only) */
		follow?: boolean;
	};
	'toolbox.process.listPtySessions': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.process.listSessions': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'toolbox.process.resizePtySession': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** PTY session ID */
		sessionId: string;
		cols: number;
		rows: number;
	};
	'toolbox.process.sendInput': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Session ID */
		sessionId: string;
		/** Command ID */
		commandId: string;
		data: string;
	};
	'toolbox.process.sessionExecuteCommand': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
		/** Session ID */
		sessionId: string;
		async?: boolean;
		command: string;
		runAsync?: boolean;
		suppressInputEcho?: boolean;
	};
	'toolbox.system.getSystemMetrics': {
		/** The sandbox id or name. The plugin reads its toolbox proxy URL first. */
		sandbox_id: string;
	};
	'volumes.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		name: string;
	};
	'volumes.delete': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the volume */
		volumeId: string;
	};
	'volumes.get': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** ID of the volume */
		volumeId: string;
	};
	'volumes.getByName': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Name of the volume */
		name: string;
	};
	'volumes.list': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Include deleted volumes in the response */
		includeDeleted?: boolean;
	};
	'warmPools.create': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** The snapshot (id or name) to keep warm sandboxes for. A pool only serves sandbox creates that use this snapshot with the default OS user and no custom env, volumes or secrets. */
		snapshot: string;
		/** Number of warm sandboxes to keep ready (capped by the organization quota) */
		pool: number;
		/** Target region for the warm pool. Defaults to the organization default region. */
		target?: string;
	};
	'warmPools.delete': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Warm pool ID */
		id: string;
	};
	'warmPools.list': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
	};
	'warmPools.update': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Warm pool ID */
		id: string;
		/** New desired number of warm sandboxes (0 drains the pool) */
		pool: number;
	};
	'webhooks.getAppPortalAccess': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		organizationId: string;
	};
	'webhooks.getInitializationStatus': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		organizationId: string;
	};
	'webhooks.initialize': {
		/** X-Daytona-Organization-ID header: the organization to act in. Left out, the plugin sends its organizationId option, if set; a key belongs to one organization anyway. */
		organization_id?: string;
		/** Organization ID */
		organizationId: string;
	};
};

export type DaytonaOperationOutputs = {
	'analytics.telemetry.getTrace': Array<DaytonaAnalyticsmodelsSpan>;
	'analytics.telemetry.logs': Array<DaytonaAnalyticsmodelsLogEntry>;
	'analytics.telemetry.metrics': Array<DaytonaAnalyticsmodelsMetricPoint>;
	'analytics.telemetry.traces': Array<DaytonaAnalyticsmodelsTraceSummary>;
	'analytics.usage.aggregated': DaytonaAnalyticsmodelsAggregatedUsage;
	'analytics.usage.bySandbox': Array<DaytonaAnalyticsmodelsSandboxUsage>;
	'analytics.usage.chart': Array<DaytonaAnalyticsmodelsUsageChartPoint>;
	'analytics.usage.sandbox': Array<DaytonaAnalyticsmodelsUsagePeriod>;
	'apiKeys.create': DaytonaApiKeyResponse;
	'apiKeys.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'apiKeys.getCurrent': DaytonaApiKeyList;
	'apiKeys.list': Array<DaytonaApiKeyList>;
	'audit.getOrganizationLogs': DaytonaPaginatedAuditLogs;
	'audit.getScenarios': DaytonaAuditScenarios;
	'config.get': DaytonaDaytonaConfiguration;
	'dockerRegistries.create': DaytonaDockerRegistry;
	'dockerRegistries.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'dockerRegistries.get': DaytonaDockerRegistry;
	'dockerRegistries.getTransientPushAccess': DaytonaRegistryPushAccessDto;
	'dockerRegistries.list': Array<DaytonaDockerRegistry>;
	'dockerRegistries.update': DaytonaDockerRegistry;
	'health.live': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'health.ready': DaytonaHealthControllerCheck200Response;
	'objectStorage.getPushAccess': DaytonaStorageAccessDto;
	'organizations.createRegion': DaytonaCreateRegionResponse;
	'organizations.deleteRegion': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'organizations.getGpuCapacity': DaytonaGpuCapacityResponse;
	'organizations.getOtelConfig': DaytonaOtelConfig;
	'organizations.getRegionById': DaytonaRegion;
	'organizations.getUsageOverview': DaytonaOrganizationUsageOverview;
	'organizations.listAvailableRegions': Array<DaytonaRegion>;
	'organizations.listAvailableSandboxClasses': Array<DaytonaAvailableSandboxClass>;
	'organizations.listMembers': Array<DaytonaOrganizationUser>;
	'organizations.regenerateProxyApiKey': DaytonaRegenerateApiKeyResponse;
	'organizations.regenerateSnapshotManagerCredentials': DaytonaSnapshotManagerCredentials;
	'organizations.regenerateSshGatewayApiKey': DaytonaRegenerateApiKeyResponse;
	'organizations.updateRegion': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'regions.listShared': Array<DaytonaRegion>;
	'runners.create': DaytonaCreateRunnerResponse;
	'runners.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'runners.getById': DaytonaRunner;
	'runners.getFullById': DaytonaRunnerFull;
	'runners.list': Array<DaytonaRunner>;
	'runners.updateDraining': DaytonaRunner;
	'runners.updateScheduling': DaytonaRunner;
	'sandboxes.addNodes': DaytonaGangMembershipOperation;
	'sandboxes.archive': DaytonaSandbox;
	'sandboxes.create': DaytonaSandbox;
	'sandboxes.createSnapshot': DaytonaSandbox;
	'sandboxes.createSshAccess': DaytonaSshAccessDto;
	'sandboxes.delete': DaytonaSandbox;
	'sandboxes.expireSignedPortPreviewUrl': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'sandboxes.fork': DaytonaSandbox;
	'sandboxes.get': DaytonaSandbox;
	'sandboxes.getAncestors': Array<DaytonaSandbox>;
	'sandboxes.getBuildLogsUrl': DaytonaUrl;
	'sandboxes.getForks': Array<DaytonaSandbox>;
	'sandboxes.getGangMembershipOperation': DaytonaGangMembershipOperation;
	'sandboxes.getLogs': DaytonaPaginatedLogs;
	'sandboxes.getMetrics': DaytonaMetricsResponse;
	'sandboxes.getParent': DaytonaSandbox;
	'sandboxes.getPortPreviewUrl': DaytonaPortPreviewUrl;
	'sandboxes.getSignedPortPreviewUrl': DaytonaSignedPortPreviewUrl;
	'sandboxes.getSigningKey': string;
	'sandboxes.getToolboxProxyUrl': DaytonaToolboxProxyUrl;
	'sandboxes.getTraceSpans': Array<DaytonaTraceSpan>;
	'sandboxes.getTraces': DaytonaPaginatedTraces;
	'sandboxes.list': DaytonaListSandboxesResponse;
	'sandboxes.pause': DaytonaSandbox;
	'sandboxes.recover': DaytonaSandbox;
	'sandboxes.removeNodes': DaytonaGangMembershipOperation;
	'sandboxes.replaceLabels': DaytonaSandboxLabels;
	'sandboxes.replaceNode': DaytonaGangMembershipOperation;
	'sandboxes.resize': DaytonaSandbox;
	'sandboxes.revokeSshAccess': DaytonaSandbox;
	'sandboxes.rotateSigningKey': string;
	'sandboxes.setAutoArchiveInterval': DaytonaSandbox;
	'sandboxes.setAutoDeleteInterval': DaytonaSandbox;
	'sandboxes.setAutoPauseInterval': DaytonaSandbox;
	'sandboxes.setAutostopInterval': DaytonaSandbox;
	'sandboxes.setTtl': DaytonaSandbox;
	'sandboxes.start': DaytonaSandbox;
	'sandboxes.stop': DaytonaSandbox;
	'sandboxes.updateLastActivity': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'sandboxes.updateNetworkSettings': DaytonaSandbox;
	'sandboxes.updatePublicStatus': DaytonaSandbox;
	'sandboxes.updateSecrets': DaytonaSandbox;
	'secrets.create': DaytonaSecret;
	'secrets.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'secrets.get': DaytonaSecret;
	'secrets.listPaginated': DaytonaListSecretsResponse;
	'secrets.update': DaytonaSecret;
	'snapshots.activate': DaytonaSnapshotDto;
	'snapshots.create': DaytonaSnapshotDto;
	'snapshots.deactivate': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'snapshots.get': DaytonaSnapshotDto;
	'snapshots.getAll': DaytonaPaginatedSnapshots;
	'snapshots.getBuildLogsUrl': DaytonaUrl;
	'snapshots.remove': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.computerUse.click': DaytonaToolboxMouseClickResponse;
	'toolbox.computerUse.deleteRecording': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.computerUse.downloadRecording': FileOutput;
	'toolbox.computerUse.drag': DaytonaToolboxMouseDragResponse;
	'toolbox.computerUse.findAccessibilityNodes': DaytonaToolboxAccessibilityNodesResponse;
	'toolbox.computerUse.focusAccessibilityNode': DaytonaToolboxEmpty;
	'toolbox.computerUse.getAccessibilityTree': DaytonaToolboxAccessibilityTreeResponse;
	'toolbox.computerUse.getComputerUseStatus': DaytonaToolboxComputerUseStatusResponse;
	'toolbox.computerUse.getComputerUseSystemStatus': DaytonaToolboxComputerUseStatusResponse;
	'toolbox.computerUse.getDisplayInfo': DaytonaToolboxDisplayInfoResponse;
	'toolbox.computerUse.getMousePosition': DaytonaToolboxMousePositionResponse;
	'toolbox.computerUse.getProcessErrors': DaytonaToolboxProcessErrorsResponse;
	'toolbox.computerUse.getProcessLogs': DaytonaToolboxProcessLogsResponse;
	'toolbox.computerUse.getProcessStatus': DaytonaToolboxProcessStatusResponse;
	'toolbox.computerUse.getRecording': DaytonaToolboxRecording;
	'toolbox.computerUse.getWindows': DaytonaToolboxWindowsResponse;
	'toolbox.computerUse.invokeAccessibilityNode': DaytonaToolboxEmpty;
	'toolbox.computerUse.keyDown': DaytonaToolboxEmpty;
	'toolbox.computerUse.keyUp': DaytonaToolboxEmpty;
	'toolbox.computerUse.listRecordings': DaytonaToolboxListRecordingsResponse;
	'toolbox.computerUse.mouseDown': DaytonaToolboxMousePositionResponse;
	'toolbox.computerUse.mouseUp': DaytonaToolboxMousePositionResponse;
	'toolbox.computerUse.moveMouse': DaytonaToolboxMousePositionResponse;
	'toolbox.computerUse.pressHotkey': DaytonaToolboxEmpty;
	'toolbox.computerUse.pressKey': DaytonaToolboxEmpty;
	'toolbox.computerUse.restartProcess': DaytonaToolboxProcessRestartResponse;
	'toolbox.computerUse.scroll': DaytonaToolboxScrollResponse;
	'toolbox.computerUse.setAccessibilityNodeValue': DaytonaToolboxEmpty;
	'toolbox.computerUse.startComputerUse': DaytonaToolboxComputerUseStartResponse;
	'toolbox.computerUse.startRecording': DaytonaToolboxRecording;
	'toolbox.computerUse.stopComputerUse': DaytonaToolboxComputerUseStopResponse;
	'toolbox.computerUse.stopRecording': DaytonaToolboxRecording;
	'toolbox.computerUse.takeCompressedRegionScreenshot': DaytonaToolboxScreenshotResponse;
	'toolbox.computerUse.takeCompressedScreenshot': DaytonaToolboxScreenshotResponse;
	'toolbox.computerUse.takeRegionScreenshot': DaytonaToolboxScreenshotResponse;
	'toolbox.computerUse.takeScreenshot': DaytonaToolboxScreenshotResponse;
	'toolbox.computerUse.typeText': DaytonaToolboxEmpty;
	'toolbox.files.bulkDownload': FileOutput;
	'toolbox.files.bulkUpload': DaytonaToolboxUploadFilesResponse;
	'toolbox.files.createFolder': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.files.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.files.download': FileOutput;
	'toolbox.files.findIn': Array<DaytonaToolboxMatch>;
	'toolbox.files.getInfo': DaytonaToolboxFileInfo;
	'toolbox.files.list': Array<DaytonaToolboxFileInfo>;
	'toolbox.files.move': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.files.replaceIn': Array<DaytonaToolboxReplaceResult>;
	'toolbox.files.search': DaytonaToolboxSearchFilesResponse;
	'toolbox.files.setPermissions': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.files.upload': DaytonaToolboxUploadedFile;
	'toolbox.git.addFiles': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.addRemote': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.authenticate': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.checkoutBranch': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.cloneRepository': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.commitChanges': DaytonaToolboxGitCommitResponse;
	'toolbox.git.configureUser': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.createBranch': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.deleteBranch': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.getCommitHistory': Array<DaytonaToolboxGitCommitInfo>;
	'toolbox.git.getConfig': DaytonaToolboxGitConfigResponse;
	'toolbox.git.getStatus': DaytonaToolboxGitStatus;
	'toolbox.git.initRepository': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.listBranches': DaytonaToolboxListBranchResponse;
	'toolbox.git.listRemotes': DaytonaToolboxListRemotesResponse;
	'toolbox.git.pullChanges': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.pushChanges': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.resetChanges': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.restoreFiles': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.git.setConfig': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.info.getUserHomeDir': DaytonaToolboxUserHomeDirResponse;
	'toolbox.info.getVersion': Record<string, string>;
	'toolbox.info.getWorkDir': DaytonaToolboxWorkDirResponse;
	'toolbox.interpreter.createInterpreterContext': DaytonaToolboxInterpreterContext;
	'toolbox.interpreter.deleteInterpreterContext': Record<string, string>;
	'toolbox.interpreter.executeInterpreterCode': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.interpreter.listInterpreterContexts': DaytonaToolboxListContextsResponse;
	'toolbox.lsp.completions': DaytonaToolboxCompletionList;
	'toolbox.lsp.didClose': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.lsp.didOpen': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.lsp.documentSymbols': Array<DaytonaToolboxLspSymbol>;
	'toolbox.lsp.start': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.lsp.stop': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.lsp.workspaceSymbols': Array<DaytonaToolboxLspSymbol>;
	'toolbox.ports.get': DaytonaToolboxPortList;
	'toolbox.ports.isInUse': DaytonaToolboxIsPortInUseResponse;
	'toolbox.process.codeRun': DaytonaToolboxCodeRunResponse;
	'toolbox.process.createPtySession': DaytonaToolboxPtyCreateResponse;
	'toolbox.process.createSession': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.process.deletePtySession': DaytonaToolboxginH;
	'toolbox.process.deleteSession': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.process.executeCommand': DaytonaToolboxExecuteResponse;
	'toolbox.process.getEntrypointLogs':
		| DaytonaToolboxSessionCommandLogsResponse
		| string;
	'toolbox.process.getEntrypointSession': DaytonaToolboxSession;
	'toolbox.process.getPtySession': DaytonaToolboxPtySessionInfo;
	'toolbox.process.getSession': DaytonaToolboxSession;
	'toolbox.process.getSessionCommand': DaytonaToolboxCommand;
	'toolbox.process.getSessionCommandLogs':
		| DaytonaToolboxSessionCommandLogsResponse
		| string;
	'toolbox.process.listPtySessions': DaytonaToolboxPtyListResponse;
	'toolbox.process.listSessions': Array<DaytonaToolboxSession>;
	'toolbox.process.resizePtySession': DaytonaToolboxPtySessionInfo;
	'toolbox.process.sendInput': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'toolbox.process.sessionExecuteCommand': DaytonaToolboxSessionExecuteResponse;
	'toolbox.system.getSystemMetrics': DaytonaToolboxSystemMetrics;
	'volumes.create': DaytonaVolumeDto;
	'volumes.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'volumes.get': DaytonaVolumeDto;
	'volumes.getByName': DaytonaVolumeDto;
	'volumes.list': Array<DaytonaVolumeDto>;
	'warmPools.create': DaytonaWarmPool;
	'warmPools.delete': {
		/** Daytona accepted the call; it answered with no body. */
		success: true;
	};
	'warmPools.list': Array<DaytonaWarmPool>;
	'warmPools.update': DaytonaWarmPool;
	'webhooks.getAppPortalAccess': DaytonaWebhookAppPortalAccess;
	'webhooks.getInitializationStatus': DaytonaWebhookInitializationStatus;
	'webhooks.initialize': DaytonaWebhookInitializationStatus;
};
