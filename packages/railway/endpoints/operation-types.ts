// Generated from Railway's GraphQL schema (backboard.railway.com/graphql/v2,
// introspected 2026-11-27); railway-manifest.json is the same contract as JSON.
// Inputs are the field's GraphQL arguments. Outputs are the selected fields:
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type RailwayJsonValue =
	| null
	| boolean
	| number
	| string
	| RailwayJsonValue[]
	| { [key: string]: RailwayJsonValue | undefined };

export const RAILWAY_OPERATION_IDS = [
	'accessGroupMembers.add',
	'accessGroupMembers.remove',
	'accessGroupProjects.attach',
	'accessGroupProjects.detach',
	'accessGroups.create',
	'accessGroups.delete',
	'accessGroups.update',
	'agentUsage.get',
	'agentUsage.setLimit',
	'apiTokens.create',
	'apiTokens.current',
	'apiTokens.delete',
	'apiTokens.list',
	'auditLogs.eventTypes',
	'auditLogs.get',
	'auditLogs.list',
	'billing.createFreePlanSubscription',
	'billing.togglePayoutsToCredits',
	'botScopeBindings.list',
	'botScopeBindings.remove',
	'buckets.create',
	'buckets.instanceDetails',
	'buckets.resetCredentials',
	'buckets.s3Credentials',
	'buckets.update',
	'canvasViews.merge',
	'canvasViews.mergePreview',
	'clearanceTokens.create',
	'clearanceTokens.revoke',
	'cloudAgentCheckpoints.create',
	'cloudAgentCheckpoints.delete',
	'cloudAgentCheckpoints.get',
	'cloudAgentCheckpoints.list',
	'cloudAgentConsoleSessions.list',
	'cloudAgentTasks.cancel',
	'cloudAgentTasks.dispatch',
	'cloudAgentTasks.get',
	'cloudAgentTasks.list',
	'cloudAgentTasks.models',
	'cloudAgentTasks.recover',
	'cloudAgentTasks.respond',
	'cloudAgents.archive',
	'cloudAgents.create',
	'cloudAgents.createDashboardFeedback',
	'cloudAgents.createFeedback',
	'cloudAgents.delete',
	'cloudAgents.deploy',
	'cloudAgents.fork',
	'cloudAgents.get',
	'cloudAgents.list',
	'cloudAgents.listMine',
	'cloudAgents.markSeen',
	'cloudAgents.renameSession',
	'cloudAgents.sleep',
	'cloudAgents.unarchive',
	'cloudAgents.wake',
	'customDomains.create',
	'customDomains.delete',
	'customDomains.get',
	'customDomains.isAvailable',
	'customDomains.issueCertificate',
	'customDomains.update',
	'databases.cancelPitrHaWorkflow',
	'databases.clearPitrHaWorkflowProgress',
	'databases.disablePitrForHaCluster',
	'databases.enablePitrForHaCluster',
	'databases.mysqlPitrRestorableWindow',
	'databases.passwordRotationProgress',
	'databases.pitrHaClusterReplicationHealth',
	'databases.pitrHaWorkflowProgress',
	'databases.postgresHaClusterUptime',
	'databases.resetPassword',
	'deploymentTriggers.create',
	'deploymentTriggers.delete',
	'deploymentTriggers.list',
	'deploymentTriggers.update',
	'deployments.approve',
	'deployments.buildLogs',
	'deployments.cancel',
	'deployments.createInstanceExecution',
	'deployments.events',
	'deployments.get',
	'deployments.instanceExecutions',
	'deployments.list',
	'deployments.logs',
	'deployments.redeploy',
	'deployments.remove',
	'deployments.restart',
	'deployments.rollback',
	'deployments.snapshot',
	'deployments.stop',
	'dnsQueryLogs.list',
	'dockerCompose.import',
	'domains.list',
	'egressGateways.clearAssociations',
	'egressGateways.createAssociation',
	'egressGateways.haMigrationPreview',
	'egressGateways.haPreview',
	'egressGateways.legacyPreview',
	'egressGateways.list',
	'egressGateways.rollbackFromHa',
	'egressGateways.upgradeToHa',
	'environmentPatches.commit',
	'environmentPatches.commitStaged',
	'environmentPatches.dismissFailure',
	'environmentPatches.get',
	'environmentPatches.list',
	'environmentPatches.restage',
	'environments.applyChangeSet',
	'environments.changeSetApplyStatus',
	'environments.create',
	'environments.delete',
	'environments.get',
	'environments.hasLegacyStaticEgress',
	'environments.history',
	'environments.iacPartialRelease',
	'environments.iacPartialTransfer',
	'environments.list',
	'environments.logs',
	'environments.overrideBase',
	'environments.pendingWork',
	'environments.previewChangeSet',
	'environments.rename',
	'environments.stageChanges',
	'environments.stagedChanges',
	'environments.triggerDeploys',
	'environments.unskipService',
	'environments.updateClearanceDefault',
	'environments.upsertConfigPlanComment',
	'events.list',
	'featureFlags.add',
	'featureFlags.listPlatform',
	'featureFlags.remove',
	'functionRuntimes.get',
	'functionRuntimes.list',
	'github.prInfo',
	'github.prInfoResult',
	'github.repoAccessAvailable',
	'github.repos.branches',
	'github.repos.deploy',
	'github.repos.get',
	'github.repos.isNameAvailable',
	'github.repos.list',
	'github.repos.update',
	'github.sshKeys',
	'github.writableScopes',
	'httpLogs.list',
	'httpMetrics.duration',
	'httpMetrics.get',
	'httpMetrics.groupedByStatus',
	'inviteCodes.get',
	'inviteCodes.use',
	'me.get',
	'metrics.get',
	'networkFlowLogs.list',
	'notificationDeliveries.get',
	'notificationDeliveries.list',
	'notificationDeliveries.markAsRead',
	'notificationRules.create',
	'notificationRules.delete',
	'notificationRules.list',
	'notificationRules.update',
	'notificationRules.upsertSlackChannel',
	'observabilityDashboardMonitors.create',
	'observabilityDashboardMonitors.remove',
	'observabilityDashboardMonitors.update',
	'observabilityDashboards.create',
	'observabilityDashboards.list',
	'observabilityDashboards.reset',
	'observabilityDashboards.update',
	'passkeys.list',
	'platform.stats',
	'platform.status',
	'preferences.get',
	'preferences.update',
	'privateNetworkEndpoints.get',
	'privateNetworkEndpoints.isNameAvailable',
	'privateNetworkEndpoints.rename',
	'privateNetworks.list',
	'projectFavorites.list',
	'projectFavorites.set',
	'projectInvitations.accept',
	'projectInvitations.create',
	'projectInvitations.createInviteCode',
	'projectInvitations.delete',
	'projectInvitations.get',
	'projectInvitations.inviteCode',
	'projectInvitations.list',
	'projectInvitations.resend',
	'projectMembers.add',
	'projectMembers.list',
	'projectMembers.remove',
	'projectMembers.update',
	'projectTokens.create',
	'projectTokens.delete',
	'projectTokens.get',
	'projectTokens.list',
	'projects.addFeatureFlag',
	'projects.cancelScheduledDelete',
	'projects.claim',
	'projects.compliance',
	'projects.confirmTransfer',
	'projects.create',
	'projects.delete',
	'projects.forceScheduledDelete',
	'projects.get',
	'projects.initiateTransfer',
	'projects.leave',
	'projects.list',
	'projects.listByIds',
	'projects.removeFeatureFlag',
	'projects.resourceAccess',
	'projects.scheduleDelete',
	'projects.serviceUsage',
	'projects.transfer',
	'projects.update',
	'projects.updateClearanceDefault',
	'projects.workspaceMembers',
	'railwayDomainDnsRecords.create',
	'railwayDomainDnsRecords.delete',
	'railwayDomainDnsRecords.list',
	'railwayDomainDnsRecords.update',
	'railwayDomainEmailForwardingRules.create',
	'railwayDomainEmailForwardingRules.delete',
	'railwayDomainEmailForwardingRules.list',
	'railwayDomainEmailForwardingRules.removeAll',
	'railwayDomainEmailForwardingRules.sendTest',
	'railwayDomainEmailForwardingRules.update',
	'railwayDomains.emailForwardingEligibility',
	'railwayDomains.emailForwardingLimits',
	'railwayDomains.get',
	'railwayDomains.getByName',
	'railwayDomains.list',
	'railwayDomains.setNameservers',
	'railwayDomains.update',
	'referral.get',
	'referral.update',
	'regions.list',
	'resourceAccess.get',
	'sandboxCheckpoints.create',
	'sandboxCheckpoints.delete',
	'sandboxCheckpoints.list',
	'sandboxCheckpoints.rename',
	'sandboxSessions.list',
	'sandboxes.buildTemplate',
	'sandboxes.create',
	'sandboxes.destroy',
	'sandboxes.get',
	'sandboxes.heartbeat',
	'sandboxes.list',
	'sandboxes.templateBuild',
	'serviceDomains.create',
	'serviceDomains.delete',
	'serviceDomains.isAvailable',
	'serviceDomains.update',
	'serviceInstances.autoDeployStatus',
	'serviceInstances.clearAutoUpdateSnooze',
	'serviceInstances.deploy',
	'serviceInstances.deployV2',
	'serviceInstances.dismissVulnRemediation',
	'serviceInstances.get',
	'serviceInstances.isUpdatable',
	'serviceInstances.limitOverride',
	'serviceInstances.limits',
	'serviceInstances.patchVulnNow',
	'serviceInstances.redeploy',
	'serviceInstances.snoozeAutoUpdate',
	'serviceInstances.update',
	'serviceInstances.updateAutoDeploy',
	'serviceInstances.updateAutoUpdateSchedule',
	'serviceInstances.updateClearance',
	'serviceInstances.updateLimits',
	'services.acknowledgeTakedown',
	'services.addFeatureFlag',
	'services.connect',
	'services.create',
	'services.delete',
	'services.disableCdn',
	'services.disconnect',
	'services.enableCdn',
	'services.generateShellToken',
	'services.get',
	'services.purgeCache',
	'services.removeFeatureFlag',
	'services.removeUpstreamUrl',
	'services.setUnderAttackMode',
	'services.update',
	'services.updateEdgeConfig',
	'services.updateEdgeRules',
	'services.updateKind',
	'services.validateEdgeRules',
	'sessions.delete',
	'sessions.list',
	'sharedVariables.configure',
	'signals.changes',
	'signals.create',
	'signals.delete',
	'signals.evaluate',
	'signals.get',
	'signals.list',
	'signals.replace',
	'signals.rollback',
	'signals.setDefault',
	'signals.setRule',
	'signals.unsetRule',
	'sshPublicKeys.approveSignup',
	'sshPublicKeys.create',
	'sshPublicKeys.delete',
	'sshPublicKeys.list',
	'sshPublicKeys.signupInfo',
	'tcpProxies.delete',
	'tcpProxies.list',
	'templates.clone',
	'templates.count',
	'templates.delete',
	'templates.deploy',
	'templates.ejectServiceSource',
	'templates.generate',
	'templates.get',
	'templates.list',
	'templates.metrics',
	'templates.publish',
	'templates.revert',
	'templates.search',
	'templates.sourceForProject',
	'templates.unpublish',
	'templates.updateVolume',
	'traces.get',
	'traces.list',
	'traces.status',
	'trustedDomains.create',
	'trustedDomains.delete',
	'trustedDomains.list',
	'trustedDomains.retriggerVerification',
	'trustedDomains.update',
	'twoFactor.get',
	'usage.estimated',
	'usage.get',
	'usage.removeLimit',
	'usage.setLimit',
	'user.agreeToFairUse',
	'user.delete',
	'user.disconnectDiscord',
	'user.pendingEmailChange',
	'user.removeProviderAuth',
	'user.updateTerms',
	'userProfile.get',
	'userProfile.update',
	'variables.delete',
	'variables.forServiceDeployment',
	'variables.list',
	'variables.upsert',
	'variables.upsertMany',
	'volumeInstanceBackupSchedules.list',
	'volumeInstanceBackupSchedules.update',
	'volumeInstanceBackups.create',
	'volumeInstanceBackups.delete',
	'volumeInstanceBackups.list',
	'volumeInstanceBackups.lock',
	'volumeInstanceBackups.restore',
	'volumeInstances.get',
	'volumeInstances.pitrRestore',
	'volumeInstances.pitrRestoreEstimate',
	'volumeInstances.update',
	'volumes.create',
	'volumes.delete',
	'volumes.update',
	'webhooks.test',
	'workflows.status',
	'workspaceApiTokens.delete',
	'workspaceApiTokens.list',
	'workspaceMembers.changeRole',
	'workspaceMembers.invite',
	'workspaceMembers.remove',
	'workspacePolicies.addDeploySource',
	'workspacePolicies.get',
	'workspacePolicies.removeDeploySource',
	'workspacePolicies.selectableDeploySources',
	'workspacePolicies.updateItem',
	'workspaceTemplates.list',
	'workspaces.complianceAgreements',
	'workspaces.createInviteCode',
	'workspaces.delete',
	'workspaces.get',
	'workspaces.getByCode',
	'workspaces.identityProviders',
	'workspaces.leave',
	'workspaces.listExternal',
	'workspaces.setRestrictProjectVisibilityToGroups',
	'workspaces.update',
	'workspaces.updateTwoFactorEnforcement',
	'workspaces.upsertSlackChannel',
	'workspaces.usageTotals',
	'workspaces.useInviteCode',
] as const;

export type RailwayOperationId = (typeof RAILWAY_OPERATION_IDS)[number];

export type RailwayAccessGroupCreateInputInput = {
	name: string;
	role: RailwayProjectRoleInput;
	workspaceId: string;
};

export type RailwayAccessGroupMemberInputInput = {
	accessGroupId: string;
	userId: string;
};

export type RailwayAccessGroupProjectInputInput = {
	accessGroupId: string;
	projectId: string;
};

export type RailwayAccessGroupUpdateInputInput = {
	name?: string;
	role?: RailwayProjectRoleInput;
};

export type RailwayActiveFeatureFlagInput =
	| 'AGENT_BYOK'
	| 'AGENT_BYOK_FIREWORKS'
	| 'AGENT_FORK_TASKS'
	| 'CHAT_SANDBOX'
	| 'CLEARANCE'
	| 'CLOUD_AGENTS'
	| 'CLOUD_AGENT_BUILDER'
	| 'CLOUD_AGENT_CHAT'
	| 'CLOUD_AGENT_ROOTFS_SIZE'
	| 'CONNECTOR_TUNNELS'
	| 'CS_MCP_EXPRESS'
	| 'DATABASE_AGENT_TOOLS'
	| 'HA_FOR_MONGO'
	| 'IN_DASHBOARD_SUPPORT'
	| 'MAGIC_CONFIG'
	| 'MANAGED_DATABASE_EDIT_WARNING'
	| 'MANAGED_DATABASE_SETUP'
	| 'PRIORITY_BOARDING'
	| 'RAILQL'
	| 'RAILWAY_AGENT_DASHBOARD'
	| 'RAILWAY_AUTOMATIONS'
	| 'TRACING'
	| 'VERIFIERS'
	| 'VM_STORAGE_TRACES';

export type RailwayActiveProjectFeatureFlagInput =
	| 'LEGACY_CONFIG_AS_CODE'
	| 'PLACEHOLDER'
	| 'RBS_VOLUMES'
	| 'TRACING_AUTO_INSTRUMENTATION'
	| 'VM_NEW_SERVICES'
	| 'VM_VOLUMES'
	| 'VOLUME_AUTO_GROW'
	| 'WEBSITES';

export type RailwayActiveServiceFeatureFlagInput =
	| 'COPY_VOLUME_TO_ENVIRONMENT'
	| 'LIVENESS_CHECKS'
	| 'PLACEHOLDER'
	| 'SKIPPED_BUILDS'
	| 'USE_DEPLOYMENT_VMS';

export type RailwayAgentDashboardFeedbackInputInput = {
	/** The agent the problem was in. Linked only if it is the caller's own. */
	cloudAgentId?: string;
	/** The error the person was shown. */
	error?: string;
	/** What failed, as the dashboard said. */
	failure?: string;
	/** problem: reported from something that failed, with what failed. */
	kind?: RailwayAgentDashboardFeedbackKindInput;
	message?: string;
	path?: string;
	replayUrl?: string;
	runId?: string;
	sentiment?: RailwayAgentDashboardFeedbackSentimentInput;
	userAgent?: string;
};

export type RailwayAgentDashboardFeedbackKindInput = 'feedback' | 'problem';

export type RailwayAgentDashboardFeedbackSentimentInput =
	| 'negative'
	| 'neutral'
	| 'positive';

export type RailwayAgentUsageLimitSetInputInput = {
	hardLimitCents: number;
	softLimitCents?: number;
	workspaceId: string;
};

export type RailwayApiTokenCreateInputInput = {
	name: string;
	workspaceId?: string;
};

export type RailwayAuditLogFilterInputInput = {
	/** Filter events created on or before this date */
	endDate?: string;
	/** Filter events for a single environment */
	environmentId?: string;
	/** List of event types to filter by */
	eventTypes?: Array<string>;
	/** Filter events for a single project */
	projectId?: string;
	/** Filter events created on or after this date */
	startDate?: string;
};

export type RailwayAutoUpdateScheduleWindowInputInput = {
	/** UTC weekday: 0 (Sunday) through 6 (Saturday) */
	day: number;
	/** UTC hour the window closes (exclusive), 1-24 */
	endHour: number;
	/** UTC hour the window opens (inclusive), 0-23 */
	startHour: number;
};

export type RailwayBaseEnvironmentOverrideInputInput = {
	baseEnvironmentOverrideId?: string;
};

export type RailwayBucketCreateInputInput = {
	/** [unimplemented] The environment to deploy the bucket instances into. If `null`, the bucket will not be deployed to any environment. `undefined` will deploy to all environments. */
	environmentId?: string;
	/** The name of the bucket */
	name?: string;
	/** The project to create the bucket in */
	projectId: string;
};

export type RailwayBucketUpdateInputInput = {
	name: string;
};

export type RailwayBuilderInput = 'HEROKU' | 'NIXPACKS' | 'PAKETO' | 'RAILPACK';

export type RailwayClearanceTokenCreateInputInput = {
	/** Limit the token to one persistent environment. Omit for every environment, including PR environments made later. */
	environmentId?: string;
	/** Days until the token expires: 1 to 365, default 90. */
	expiresInDays?: number;
	name: string;
	projectId: string;
};

/** Opt-in public code endpoint, provisioned only when creating a cloud agent. */
export type RailwayCloudAgentCodeEndpointInputInput = {
	/** Target port. Defaults to 4096; must be 1024-65535, excluding 8080 and 8790. */
	port?: number;
};

export type RailwayCloudAgentCreateInputInput = {
	/** Create the cloud agent from an existing checkpoint. */
	cloudAgentCheckpointId?: string;
	/** Provision a code-* domain. Omit to disable, including when restoring a checkpoint or bootstrap. */
	codeEndpoint?: RailwayCloudAgentCodeEndpointInputInput;
	environmentId: string;
	name?: string;
	/** Region to run the agent in, e.g. us-west2. Defaults to the checkpoint's region when booting from one, else the workspace's preferred region. */
	region?: string;
	source?: RailwayCloudAgentSourceInputInput;
	variables?: RailwayJsonValue;
};

export type RailwayCloudAgentFeedbackInputInput = {
	activeTools: Array<string>;
	agentVersion: string;
	cloudAgentId: string;
	description: string;
	elapsedMs?: number;
	lastProgressAgeMs?: number;
	model: string;
	reportId: string;
	reportedAtMs: number;
	runId?: string;
	runStartedAtMs?: number;
	sessionId: string;
	sessionName?: string;
	state: string;
	steps: number;
	tuiVersion: string;
};

/** Repo to clone into the agent's workspace: exactly one of repo/serviceId. */
export type RailwayCloudAgentSourceInputInput = {
	/** Ref to check out; defaults to the repo's default branch. */
	branch?: string;
	/** GitHub repo as owner/repo. */
	repo?: string;
	/** Resolve the repo from this service's source. */
	serviceId?: string;
};

export type RailwayCloudAgentTaskDispatchInputInput = {
	agentName?: string;
	/** false refuses, with code AGENT_CREATE_REQUIRED, a task that would start a new agent, so you can ask before one is billed. Nothing is created or charged. Defaults to true. */
	allowCreate?: boolean;
	/** Explicit agent reuse. Omit all targets to create a fresh agent. */
	cloudAgentId?: string;
	/** Up to 32 entries of {type, text?, ...scalar attributes} the model reads beside the prompt as background, not instructions: earlier messages, the page a user was on, a log excerpt. On a continued conversation, send only what is new since the last task: earlier turns are already in the session. */
	context?: RailwayJsonValue;
	/** Your conversation's id (e.g. linear:DEMO-1). The first task starts an agent; later tasks with the same key continue its session, each waiting for the one before it to finish. Mutually exclusive with replyToTaskId and cloudAgentId/sessionId. */
	conversationKey?: string;
	/** For chat clients: a prompt that starts a new conversation and asks for code to be written goes to the agent dashboard as a new run (its own build agent on the service's repository) instead, and the handle carries dashboardRunUrl. Questions and operations stay here. Needs the agent dashboard… */
	dashboardHandoff?: boolean;
	environmentId: string;
	externalRef?: string;
	idempotencyKey?: string;
	/** Up to 4 images the model sees with the prompt (screenshots, mockups), 5 MiB in total. Kept as the agent's attachments. */
	images?: Array<RailwayCloudAgentTaskImageInputInput>;
	/** Whether someone will answer the agent. true: it may ask a question, which parks the task in AWAITING_INPUT until your next prompt on the conversation (delivered as the answer) or a respond. false: nobody will answer, so it decides or gives up with a reason. Omit for neither. Requires PROMPT mode. */
	interactive?: boolean;
	metadata?: RailwayJsonValue;
	mode?: RailwayCloudAgentTaskModeInput;
	/** A model id from cloudAgentTaskModels. Applies when the task starts a conversation; a later turn may repeat it but not change it. Defaults to your agent model setting. */
	model?: string;
	/** JSON Schema object for structured output; requires PROMPT mode. */
	outputSchema?: RailwayJsonValue;
	projectId: string;
	prompt: string;
	/** One of the model's reasoningEfforts. May change between turns in PROMPT mode. */
	reasoningEffort?: string;
	/** Continue this task's original agent/session. Mutually exclusive with cloudAgentId/sessionId. */
	replyToTaskId?: string;
	/** Existing session to continue; requires cloudAgentId. */
	sessionId?: string;
	source?: RailwayCloudAgentSourceInputInput;
	/** Also send task.progress callbacks, at most one per task every 15 seconds. */
	webhookProgress?: boolean;
	webhookSecret?: string;
	webhookUrl?: string;
};

/** An image the model sees with the prompt: PNG, JPEG, or WebP. Send data or url, not both. */
export type RailwayCloudAgentTaskImageInputInput = {
	/** Base64 bytes, or a data: URL. Shares the request's 1 MB body limit; send larger images by url. */
	data?: string;
	filename?: string;
	/** Optional; checked against the bytes. */
	mediaType?: string;
	/** A public HTTPS URL Railway fetches when the task is dispatched, up to 5 MiB. */
	url?: string;
};

export type RailwayCloudAgentTaskInteractionActionInput =
	| 'ACCEPT'
	| 'ALLOW'
	| 'APPROVE'
	| 'CANCEL'
	| 'DECLINE'
	| 'DENY';

export type RailwayCloudAgentTaskModeInput = 'FOLLOW_UP' | 'PROMPT' | 'STEER';

export type RailwayCloudAgentTaskRespondInputInput = {
	action: RailwayCloudAgentTaskInteractionActionInput;
	/** Who gave the answer, for the audit log (e.g. linear:<userId>). Not verified. */
	answeredBy?: string;
	/** ACCEPT only: the form values, keyed by field name. */
	content?: RailwayJsonValue;
	/** pendingInteractions[].requestId */
	requestId: string;
	taskId: string;
};

export type RailwayCloudAgentTaskStatusInput =
	| 'AWAITING_INPUT'
	| 'CANCELLED'
	| 'COMPLETED'
	| 'FAILED'
	| 'PENDING'
	| 'RUNNING';

export type RailwayCreateNotificationRuleInputInput = {
	channelConfigs: Array<RailwayJsonValue>;
	ephemeralEnvironments?: boolean;
	eventTypes: Array<string>;
	projectId?: string;
	severities?: Array<RailwayNotificationSeverityInput>;
	workspaceId: string;
};

export type RailwayCustomDomainCreateInputInput = {
	domain: string;
	environmentId: string;
	projectId: string;
	serviceId: string;
	targetPort?: number;
};

export type RailwayDatabasePasswordResetInputInput = {
	databaseType: string;
	environmentId: string;
	serviceId: string;
};

export type RailwayDeploymentInstanceExecutionCreateInputInput = {
	serviceInstanceId: string;
};

export type RailwayDeploymentInstanceExecutionListInputInput = {
	environmentId: string;
	serviceId: string;
};

export type RailwayDeploymentListInputInput = {
	environmentId?: string;
	includeDeleted?: boolean;
	projectId?: string;
	serviceId?: string;
	status?: RailwayDeploymentStatusInputInput;
};

export type RailwayDeploymentStatusInput =
	| 'BUILDING'
	| 'CRASHED'
	| 'DEPLOYING'
	| 'FAILED'
	| 'INITIALIZING'
	| 'NEEDS_APPROVAL'
	| 'QUEUED'
	| 'REMOVED'
	| 'REMOVING'
	| 'SKIPPED'
	| 'SLEEPING'
	| 'SUCCESS'
	| 'WAITING';

export type RailwayDeploymentStatusInputInput = {
	in?: Array<RailwayDeploymentStatusInput>;
	notIn?: Array<RailwayDeploymentStatusInput>;
};

export type RailwayDeploymentTriggerCreateInputInput = {
	branch: string;
	checkSuites?: boolean;
	environmentId: string;
	projectId: string;
	provider: string;
	repository: string;
	rootDirectory?: string;
	serviceId: string;
};

export type RailwayDeploymentTriggerUpdateInputInput = {
	branch?: string;
	checkSuites?: boolean;
	repository?: string;
	rootDirectory?: string;
};

export type RailwayDisablePitrForHaClusterInputInput = {
	/** Environment containing the cluster */
	environmentId: string;
	/** Project containing the cluster (returned in payload) */
	projectId: string;
	/** The cluster's primary service (Postgres HA or MySQL HA). */
	rootServiceId: string;
};

export type RailwayDisableServiceCdnInputInput = {
	environmentId: string;
	serviceId: string;
};

export type RailwayEdgeCachingConfigInputInput = {
	defaultTtlSeconds?: number;
	htmlCaching?: string;
	mode?: string;
	purgeOnDeploy?: RailwayPurgeOnDeployInput;
	staleWhileRevalidate?: RailwayStaleWhileRevalidateInputInput;
};

export type RailwayEdgeConfigInputInput = {
	caching?: RailwayEdgeCachingConfigInputInput;
};

export type RailwayEgressGatewayCreateInputInput = {
	environmentId: string;
	region?: string;
	serviceId: string;
};

export type RailwayEgressGatewayServiceTargetInputInput = {
	allEnvironments?: boolean;
	environmentId: string;
	serviceId: string;
};

export type RailwayEnablePitrForHaClusterInputInput = {
	/** Environment containing the cluster */
	environmentId: string;
	/** Project containing the cluster (returned in payload) */
	projectId: string;
	/** The cluster's primary service (Postgres HA or MySQL HA). */
	rootServiceId: string;
};

export type RailwayEnableServiceCdnInputInput = {
	config?: RailwayEdgeConfigInputInput;
	environmentId: string;
	serviceId: string;
};

export type RailwayEnvironmentClearanceDefaultUpdateInputInput = {
	enabled: boolean;
	environmentId: string;
	projectId: string;
};

export type RailwayEnvironmentConfigPlanCommentUpsertInputInput = {
	environmentId: string;
	/** GitHub Actions OIDC token (id-token: write) with audience `railway`. Its `repository` claim proves the caller runs in the repo the comment is posted to. */
	githubOidcToken: string;
	/** Structured plan summary: { changes: [{ kind?, summary }], destructive, sourceTree, configEtag, changeSetHash, cliVersion? }. The comment body is composed server-side. */
	plan: RailwayJsonValue;
	prNumber: number;
};

export type RailwayEnvironmentCreateInputInput = {
	/** If true, the changes will be applied in the background and the mutation will return immediately. If false, the mutation will wait for the changes to be applied before returning. */
	applyChangesInBackground?: boolean;
	ephemeral?: boolean;
	name: string;
	projectId: string;
	/** When committing the changes immediately, skip any initial deployments. */
	skipInitialDeploys?: boolean;
	/** Create the environment with all of the services, volumes, configuration, and variables from this source environment. */
	sourceEnvironmentId?: string;
	/** Stage the initial changes for the environment. If false (default), the changes will be committed immediately. */
	stageInitialChanges?: boolean;
};

export type RailwayEnvironmentRenameInputInput = {
	name: string;
};

export type RailwayEnvironmentTriggersDeployInputInput = {
	environmentId: string;
	projectId: string;
	serviceId: string;
};

export type RailwayEventFilterInputInput = {
	action?: RailwayEventStringListFilterInput;
	object?: RailwayEventStringListFilterInput;
	serviceId?: RailwayEventStringListFilterInput;
};

export type RailwayEventStringListFilterInput = {
	in?: Array<string>;
	notIn?: Array<string>;
};

export type RailwayExplicitOwnerInputInput = {
	/** The ID of the owner */
	id: string;
	/** The type of owner */
	type?: RailwayResourceOwnerTypeInput;
};

export type RailwayFeatureFlagToggleInputInput = {
	flag: RailwayActiveFeatureFlagInput;
};

/** Supported function runtime environments */
export type RailwayFunctionRuntimeNameInput = 'bun';

export type RailwayGitHubRepoDeployInputInput = {
	branch?: string;
	environmentId?: string;
	projectId: string;
	repo: string;
};

export type RailwayGitHubRepoUpdateInputInput = {
	environmentId: string;
	projectId: string;
	serviceId: string;
};

export type RailwayHistoryFilterInputInput = {
	actions?: Array<string>;
	/** ACTIVITY_FEED narrows history to what the dashboard's feed shows. It admits rows belonging to the project rather than to one environment, so a service arriving or leaving still appears. When `serviceIds` is given it also keeps rows that name no service, so the caller can scope them itself, and… */
	mode?: RailwayHistoryFilterModeInput;
	objects?: Array<string>;
	/** Any of '', 'applied', 'failed'. */
	outcomes?: Array<string>;
	serviceIds?: Array<string>;
	/** Inclusive ISO timestamp lower bound. */
	since?: string;
};

/** A named reading of history, not a peer of the filter's own fields: a mode expands into them. */
export type RailwayHistoryFilterModeInput = 'ACTIVITY_FEED';

/** Which HTTP metric an HTTP_METRICS_ITEM widget renders. */
export type RailwayHttpMetricKindInput =
	| 'LATENCY'
	| 'REQUESTS'
	| 'STATUS_RATIO';

/** A thing that can be measured on Railway. */
export type RailwayMetricMeasurementInput =
	| 'AGENT_CACHE_READ_TOKENS'
	| 'AGENT_CACHE_WRITE_TOKENS'
	| 'AGENT_INPUT_TOKENS'
	| 'AGENT_OUTPUT_TOKENS'
	| 'AGENT_SPEND_USD'
	| 'BACKUP_USAGE_GB'
	| 'CPU_LIMIT'
	| 'CPU_USAGE'
	| 'CPU_USAGE_2'
	| 'DISK_USAGE_GB'
	| 'EPHEMERAL_DISK_USAGE_GB'
	| 'MEASUREMENT_UNSPECIFIED'
	| 'MEMORY_LIMIT_GB'
	| 'MEMORY_USAGE_GB'
	| 'NETWORK_RX_GB'
	| 'NETWORK_TX_GB'
	| 'UNRECOGNIZED';

/** A property that can be used to group metrics. */
export type RailwayMetricTagInput =
	| 'BILLABLE'
	| 'DEPLOYMENT_ID'
	| 'DEPLOYMENT_INSTANCE_ID'
	| 'ENVIRONMENT_ID'
	| 'FEATURE'
	| 'HOST_TYPE'
	| 'KEY_UNSPECIFIED'
	| 'MODEL'
	| 'PLUGIN_ID'
	| 'PROJECT_ID'
	| 'REGION'
	| 'SERVICE_ID'
	| 'UNRECOGNIZED'
	| 'VM_ID'
	| 'VOLUME_ID'
	| 'VOLUME_INSTANCE_ID'
	| 'WORKLOAD_KIND';

export type RailwayMonitorConfigInputInput = {
	threshold?: RailwayMonitorThresholdConfigInputInput;
	type: RailwayMonitorTypeInput;
};

export type RailwayMonitorThresholdConditionInput = 'above' | 'below';

export type RailwayMonitorThresholdConfigInputInput = {
	condition: RailwayMonitorThresholdConditionInput;
	threshold: number;
};

export type RailwayMonitorTypeInput = 'threshold';

export type RailwayNotificationDeliveryFilterInputInput = {
	environmentId?: string;
	onlyUnread?: boolean;
	projectId?: string;
	status?: RailwayNotificationStatusInput;
	type?: RailwayNotificationDeliveryTypeInput;
	workspaceId?: string;
};

export type RailwayNotificationDeliveryTypeInput =
	| 'EMAIL'
	| 'INAPP'
	| 'WEBHOOK';

export type RailwayNotificationSeverityInput =
	| 'CRITICAL'
	| 'INFO'
	| 'NOTICE'
	| 'WARNING';

export type RailwayNotificationStatusInput = 'ACTIVE' | 'RESOLVED';

export type RailwayObservabilityDashboardCreateInputInput = {
	environmentId: string;
	/** If no items are provided, a default dashboard will be created. */
	items?: Array<RailwayObservabilityDashboardUpdateInputInput>;
};

export type RailwayObservabilityDashboardItemConfigInputInput = {
	httpMetric?: RailwayHttpMetricKindInput;
	logsFilter?: string;
	measurements?: Array<RailwayMetricMeasurementInput>;
	projectUsageProperties?: Array<RailwayProjectUsagePropertyInput>;
	/** The panel's RailQL query. Left out, the panel keeps its stored query and visualization. */
	query?: string;
	resourceIds?: Array<string>;
	/** How the panel draws its query, one the query's result allows. Absent means the default for the query's type. */
	visualization?: string;
};

export type RailwayObservabilityDashboardItemCreateInputInput = {
	config: RailwayObservabilityDashboardItemConfigInputInput;
	description?: string;
	id: string;
	name: string;
	type: RailwayObservabilityDashboardItemTypeInput;
};

export type RailwayObservabilityDashboardItemTypeInput =
	| 'DNS_LOGS_ITEM'
	| 'HTTP_LOGS_ITEM'
	| 'HTTP_METRICS_ITEM'
	| 'NETWORK_LOGS_ITEM'
	| 'PROJECT_USAGE_ITEM'
	| 'RAILQL_ITEM'
	| 'SERVICE_LOGS_ITEM'
	| 'SERVICE_METRICS_ITEM'
	| 'VOLUME_METRICS_ITEM';

export type RailwayObservabilityDashboardMonitorCreateInputInput = {
	config: RailwayMonitorConfigInputInput;
};

export type RailwayObservabilityDashboardMonitorUpdateInputInput = {
	config: RailwayMonitorConfigInputInput;
};

export type RailwayObservabilityDashboardUpdateInputInput = {
	dashboardItem: RailwayObservabilityDashboardItemCreateInputInput;
	displayConfig: RailwayJsonValue;
	id: string;
};

export type RailwayPreferencesUpdateDataInput = {
	buildFailedEmail?: boolean;
	changelogEmail?: boolean;
	communityEmail?: boolean;
	deployCrashedEmail?: boolean;
	ephemeralEnvironmentEmail?: boolean;
	marketingEmail?: boolean;
	subprocessorUpdatesEmail?: boolean;
	templateQueueEmail?: boolean;
	token?: string;
	usageEmail?: boolean;
};

export type RailwayProjectClearanceDefaultUpdateInputInput = {
	enabled: boolean;
	projectId: string;
};

export type RailwayProjectCreateInputInput = {
	defaultEnvironmentName?: string;
	description?: string;
	isMonorepo?: boolean;
	isPublic?: boolean;
	name?: string;
	prDeploys?: boolean;
	repo?: RailwayProjectCreateRepoInput;
	runtime?: RailwayPublicRuntimeInput;
	workspaceId?: string;
};

export type RailwayProjectCreateRepoInput = {
	branch: string;
	fullRepoName: string;
};

export type RailwayProjectFeatureFlagToggleInputInput = {
	flag: RailwayActiveProjectFeatureFlagInput;
	projectId: string;
};

export type RailwayProjectInviteeInput = {
	email: string;
	role: RailwayProjectRoleInput;
};

export type RailwayProjectMemberAddInputInput = {
	projectId: string;
	role: RailwayProjectRoleInput;
	userId: string;
};

export type RailwayProjectMemberRemoveInputInput = {
	projectId: string;
	userId: string;
};

export type RailwayProjectMemberUpdateInputInput = {
	projectId: string;
	role: RailwayProjectRoleInput;
	userId: string;
};

export type RailwayProjectRoleInput = 'ADMIN' | 'MEMBER' | 'VIEWER';

export type RailwayProjectTokenCreateInputInput = {
	environmentId: string;
	name: string;
	projectId: string;
};

export type RailwayProjectTransferConfirmInputInput = {
	destinationWorkspaceId?: string;
	ownershipTransferId: string;
	projectId: string;
};

export type RailwayProjectTransferInitiateInputInput = {
	memberId: string;
	projectId: string;
};

export type RailwayProjectTransferInputInput = {
	workspaceId: string;
};

export type RailwayProjectUpdateInputInput = {
	baseEnvironmentId?: string;
	/** Enable/disable pull request environments for PRs created by bots */
	botPrEnvironments?: boolean;
	description?: string;
	/** Enable focused PR environments that only deploy services affected by changed files */
	focusedPrEnvironments?: boolean;
	isPublic?: boolean;
	name?: string;
	prDeploys?: boolean;
};

export type RailwayProjectUsagePropertyInput =
	| 'BACKUP_USAGE'
	| 'CPU_USAGE'
	| 'CURRENT_USAGE'
	| 'DISK_USAGE'
	| 'ESTIMATED_USAGE'
	| 'MEMORY_USAGE'
	| 'NETWORK_USAGE';

export type RailwayProjectsOrderByInput =
	| 'CREATED_AT_DESC'
	| 'NAME_ASC'
	| 'UPDATED_AT_DESC';

export type RailwayPublicRuntimeInput = 'LEGACY' | 'UNSPECIFIED' | 'V2';

export type RailwayPurgeCacheScopeInput = 'ALL' | 'HTML';

export type RailwayPurgeOnDeployInput = 'ALL' | 'HTML' | 'OFF';

export type RailwayPurgeServiceCacheInputInput = {
	environmentId: string;
	scope: RailwayPurgeCacheScopeInput;
	serviceId: string;
};

export type RailwayRailwayDomainDnsRecordCreateInputInput = {
	answer: string;
	domain: string;
	host: string;
	priority?: number;
	ttl?: number;
	type: RailwayRailwayDomainDnsRecordTypeInput;
	workspaceId: string;
};

export type RailwayRailwayDomainDnsRecordDeleteInputInput = {
	domain: string;
	recordId: number;
	/** Confirms that deleting a mail exchange may also remove every forwarding address and its sibling exchanges. */
	removeEmailForwarding?: boolean;
	workspaceId: string;
};

export type RailwayRailwayDomainDnsRecordTypeInput =
	| 'A'
	| 'AAAA'
	| 'ANAME'
	| 'CNAME'
	| 'MX'
	| 'NS'
	| 'SRV'
	| 'TXT';

export type RailwayRailwayDomainDnsRecordUpdateInputInput = {
	answer: string;
	domain: string;
	host: string;
	priority?: number;
	recordId: number;
	ttl?: number;
	type: RailwayRailwayDomainDnsRecordTypeInput;
	workspaceId: string;
};

export type RailwayRailwayDomainEmailForwardingRemoveAllInputInput = {
	domain: string;
	workspaceId: string;
};

export type RailwayRailwayDomainEmailForwardingRuleCreateInputInput = {
	alias: string;
	destination: string;
	domain: string;
	workspaceId: string;
};

export type RailwayRailwayDomainEmailForwardingRuleDeleteInputInput = {
	alias: string;
	domain: string;
	workspaceId: string;
};

export type RailwayRailwayDomainEmailForwardingRuleTestInputInput = {
	alias: string;
	domain: string;
	workspaceId: string;
};

export type RailwayRailwayDomainEmailForwardingRuleUpdateInputInput = {
	alias: string;
	destination: string;
	domain: string;
	workspaceId: string;
};

export type RailwayRailwayDomainNameserversSetInputInput = {
	id: string;
	/** Hostnames of the nameservers to delegate to (2-13). Pass an empty list to reset to Name.com's account-level defaults for this domain. */
	nameservers: Array<string>;
};

export type RailwayRailwayDomainStatusInput =
	| 'ACTIVE'
	| 'EXPIRED'
	| 'PURCHASING'
	| 'REFUNDED';

export type RailwayRailwayDomainUpdateInputInput = {
	autoRenewEnabled?: boolean;
	id: string;
};

export type RailwayReferralInfoUpdateInputInput = {
	code: string;
	workspaceId: string;
};

/** Private Docker registry credentials. Only available for Pro plan deployments. */
export type RailwayRegistryCredentialsInputInput = {
	password: string;
	username: string;
};

export type RailwayResourceOwnerTypeInput = 'WORKSPACE';

export type RailwayRestartPolicyTypeInput = 'ALWAYS' | 'NEVER' | 'ON_FAILURE';

export type RailwaySandboxCreateInputInput = {
	environmentId: string;
	/** Minutes of inactivity before the sandbox is destroyed. Any value <= 0 means never idle out (plan-gated). Defaults to the plan's default idle timeout. */
	idleTimeoutMinutes?: number;
	/** Network access for the sandbox. Defaults to ISOLATED (no private network access). Public domains require PRIVATE to be selected explicitly. */
	networkIsolation?: RailwaySandboxNetworkIsolationInput;
	/** Railway-provided HTTP domains to publish, one per unique prefix and port. Supports up to 10 and requires explicitly selecting PRIVATE networking. Domain prefixes are generated when omitted. */
	publicDomains?: Array<RailwaySandboxDomainInputInput>;
	/** Region to place the sandbox in (e.g. us-west2, us-east4-eqdc4a). Defaults to the platform default region when omitted. */
	region?: string;
	/** Creation-time CPU and memory, including for forks and checkpoint restores. Each omitted or null field uses the workspace's sandbox default; explicit values must not exceed its independent VM maximum. */
	resources?: RailwaySandboxResourcesInputInput;
	/** Fork an existing running sandbox in this environment. Mutually exclusive with template. */
	sourceSandboxId?: string;
	template?: RailwaySandboxTemplateInputInput;
	/** Environment variables baked into the sandbox, available to every command. Values may contain Railway variable references (e.g. ${{shared.FOO}}, ${{ServiceName.BAR}}), resolved at create time. */
	variables?: Record<string, string>;
};

export type RailwaySandboxDomainInputInput = {
	/** Target port on the sandbox, from 1 through 65535. */
	port: number;
	/** Optional DNS label prefix for the generated domain. When omitted, a prefix is generated from the project name. Custom prefixes must be lowercase alphanumeric with optional interior hyphens, up to 46 characters. */
	prefix?: string;
};

/** Controls a sandbox's access to the environment's private network. */
export type RailwaySandboxNetworkIsolationInput = 'ISOLATED' | 'PRIVATE';

export type RailwaySandboxResourcesInputInput = {
	/** Positive vCPU for the new sandbox; fractional values are supported. Omitted or null uses the workspace's sandbox default. Must not exceed its VM maximum. */
	cpu?: number;
	/** Memory in decimal GB (1 GB = 1,000,000,000 bytes), rounded to whole bytes. Must be at least 1 byte and at most the workspace's VM maximum. Omitted or null uses its sandbox default. */
	memoryGB?: number;
};

export type RailwaySandboxTemplateInputInput = {
	/** Build a template by running these shell instructions on the base image. Mutually exclusive with name. */
	instructions?: Array<string>;
	/** Boot from a saved checkpoint with this name (one captured from a sandbox). Mutually exclusive with instructions. */
	name?: string;
	/** Placement region for the build sandbox. The resulting checkpoint lives in this region, and sandboxes created from the template boot there. Defaults to the platform default; only the cold build consults it (a built template's own region wins). */
	region?: string;
	/** Environment variables available to the template's build instructions. Values may contain Railway variable references (e.g. ${{shared.FOO}}, ${{ServiceName.BAR}}), resolved at build time. */
	variables?: Record<string, string>;
};

export type RailwayServiceConnectInputInput = {
	/** The branch to connect to. e.g. 'main' */
	branch?: string;
	/** Name of the Dockerhub or GHCR image to connect this service to. */
	image?: string;
	/** The full name of the repo to connect to. e.g. 'railwayapp/starters' */
	repo?: string;
};

export type RailwayServiceCreateInputInput = {
	branch?: string;
	/** Environment ID. If the specified environment is a fork, the service will only be created in it. Otherwise it will created in all environments that are not forks of other environments */
	environmentId?: string;
	icon?: string;
	/** Creates a Website when WEBSITE. Null for an ordinary service. */
	kind?: RailwayServiceKindInput;
	name?: string;
	projectId: string;
	registryCredentials?: RailwayRegistryCredentialsInputInput;
	source?: RailwayServiceSourceInputInput;
	/** Template ID. Required when templateServiceId is provided. */
	templateId?: string;
	/** Template service ID within the template's serializedConfig. Required when templateId is provided. */
	templateServiceId?: string;
	variables?: Record<string, string>;
};

export type RailwayServiceDomainCreateInputInput = {
	environmentId: string;
	serviceId: string;
	targetPort?: number;
};

export type RailwayServiceDomainUpdateInputInput = {
	domain: string;
	environmentId: string;
	serviceDomainId: string;
	serviceId: string;
	targetPort?: number;
};

export type RailwayServiceFeatureFlagToggleInputInput = {
	flag: RailwayActiveServiceFeatureFlagInput;
	serviceId: string;
};

export type RailwayServiceInstanceAutoDeployUpdateInputInput = {
	enabled: boolean;
	environmentId: string;
	projectId: string;
	serviceId: string;
};

export type RailwayServiceInstanceClearanceUpdateInputInput = {
	/** On or off. Null (or omitted) removes the service's own setting so it follows the environment's default. */
	enabled?: boolean;
	environmentId: string;
	projectId: string;
	serviceId: string;
};

export type RailwayServiceInstanceLimitsUpdateInputInput = {
	environmentId: string;
	/** Amount of memory in GB to allocate to the service instance */
	memoryGB?: number;
	serviceId: string;
	/** Number of vCPUs to allocate to the service instance */
	vCPUs?: number;
};

export type RailwayServiceInstanceUpdateInputInput = {
	/** Instrument the service's processes with eBPF (OBI) while its tracing is on. Reaches running containers within about a minute, no redeploy needed. */
	autoInstrumentationEnabled?: boolean;
	buildCommand?: string;
	builder?: RailwayBuilderInput;
	cronSchedule?: string;
	dockerfilePath?: string;
	drainingSeconds?: number;
	healthcheckPath?: string;
	healthcheckTimeout?: number;
	hideUnhealthyReplicas?: boolean;
	ipv6EgressEnabled?: boolean;
	multiRegionConfig?: RailwayJsonValue;
	nixpacksPlan?: RailwayJsonValue;
	numReplicas?: number;
	overlapSeconds?: number;
	preDeployCommand?: Array<string>;
	preDeployTimeoutSeconds?: number;
	railwayConfigFile?: string;
	region?: string;
	registryCredentials?: RailwayRegistryCredentialsInputInput;
	restartPolicyMaxRetries?: number;
	restartPolicyType?: RailwayRestartPolicyTypeInput;
	rootDirectory?: string;
	sleepApplication?: boolean;
	source?: RailwayServiceSourceInputInput;
	startCommand?: string;
	/** Trace requests to the service in this environment. Takes effect at the edge within seconds and in the app on the next deploy. */
	tracingEnabled?: boolean;
	watchPatterns?: Array<string>;
};

/** What a service is, when it isn't an ordinary service. A Website's builds upload a release that the edge serves. */
export type RailwayServiceKindInput = 'WEBSITE';

export type RailwayServiceKindUpdateInputInput = {
	/** WEBSITE for a Website. Null for an ordinary service. */
	kind?: RailwayServiceKindInput;
	serviceId: string;
};

export type RailwayServiceSourceInputInput = {
	image?: string;
	repo?: string;
};

export type RailwayServiceUpdateInputInput = {
	icon?: string;
	name?: string;
};

export type RailwaySetServiceUnderAttackModeInputInput = {
	durationSeconds?: number;
	enabled: boolean;
	environmentId: string;
	serviceId: string;
};

export type RailwaySharedVariableConfigureInputInput = {
	disabledServiceIds: Array<string>;
	enabledServiceIds: Array<string>;
	environmentId: string;
	name: string;
	projectId: string;
};

export type RailwayShellTokenInputInput = {
	environmentId: string;
	instanceId: string;
	kind?: string;
	port?: number;
	scope: string;
	serviceId?: string;
};

export type RailwaySignalCreateInputInput = {
	default: RailwayJsonValue;
	name: string;
	owner: string;
	type: RailwaySignalTypeInput;
	writableBy?: Array<string>;
};

export type RailwaySignalDefaultSetInputInput = {
	default: RailwayJsonValue;
	name: string;
	owner: string;
};

export type RailwaySignalDeleteInputInput = {
	name: string;
	owner: string;
};

export type RailwaySignalReplaceInputInput = {
	default: RailwayJsonValue;
	name: string;
	owner: string;
	type: RailwaySignalTypeInput;
};

export type RailwaySignalRollbackInputInput = {
	name: string;
	owner: string;
	seq: number | string;
};

export type RailwaySignalRuleSetInputInput = {
	expression: RailwayJsonValue;
	name: string;
	owner: string;
	ruleId: string;
	value: RailwayJsonValue;
};

export type RailwaySignalRuleUnsetInputInput = {
	name: string;
	owner: string;
	ruleId: string;
};

export type RailwaySignalTypeInput = 'bool' | 'json' | 'number' | 'string';

export type RailwaySortOrderInput = 'asc' | 'desc';

export type RailwaySshPublicKeyCreateInputInput = {
	name: string;
	publicKey: string;
	workspaceId?: string;
};

export type RailwayStaleWhileRevalidateInputInput = {
	enabled: boolean;
};

export type RailwayTakedownAcknowledgeInputInput = {
	acknowledgmentId: string;
	/** The exact statement shown to and confirmed by the admin. */
	statement: string;
};

export type RailwayTeamRoleInput = 'ADMIN' | 'MEMBER' | 'VIEWER';

export type RailwayTemplateCloneInputInput = {
	code: string;
	workspaceId?: string;
};

export type RailwayTemplateDeleteInputInput = {
	workspaceId?: string;
};

export type RailwayTemplateDeployV2InputInput = {
	environmentId?: string;
	/** An existing database service to convert. If you pass a cluster's proxy service, Railway uses the database behind it. */
	existingRootServiceId?: string;
	projectId?: string;
	serializedConfig: RailwayJsonValue;
	/** If true, create resources and patch but don't deploy. Returns patchId for later commit. */
	stageOnly?: boolean;
	templateId: string;
	workspaceId?: string;
};

export type RailwayTemplateGenerateInputInput = {
	environmentId?: string;
	projectId: string;
};

export type RailwayTemplatePublishInputInput = {
	category: string;
	demoProjectId?: string;
	description: string;
	image?: string;
	readme: string;
	workspaceId?: string;
};

export type RailwayTemplateRevertInputInput = {
	/** The environment ID containing the cluster */
	environmentId: string;
	/** The group ID to delete when reverting */
	groupId?: string;
	/** The project ID containing the cluster */
	projectId: string;
	/** The root service ID of the HA cluster to revert */
	rootServiceId: string;
	/** If true, stage changes instead of deploying. Returns patchId. */
	stageOnly?: boolean;
	/** The template code to revert (e.g., 'ha-postgres') */
	templateCode: string;
};

export type RailwayTemplateServiceSourceEjectInputInput = {
	projectId: string;
	repoName: string;
	repoOwner: string;
	/** Provide multiple serviceIds when ejecting services from a monorepo. */
	serviceIds: Array<string>;
	upstreamUrl: string;
};

export type RailwayUpdateNotificationRuleInputInput = {
	channelConfigs?: Array<RailwayJsonValue>;
	ephemeralEnvironments?: boolean;
	eventTypes?: Array<string>;
	severities?: Array<RailwayNotificationSeverityInput>;
};

export type RailwayUpdateServiceEdgeConfigInputInput = {
	config: RailwayEdgeConfigInputInput;
	environmentId: string;
	serviceId: string;
};

export type RailwayUpdateServiceEdgeRulesInputInput = {
	edgeRules?: RailwayJsonValue;
	environmentId: string;
	serviceId: string;
};

export type RailwayUsageLimitRemoveInputInput = {
	customerId: string;
};

export type RailwayUsageLimitSetInputInput = {
	customerId: string;
	hardLimitDollars?: number;
	softLimitDollars: number;
};

export type RailwayUserProfileUpdateInputInput = {
	bio?: string;
	isPublic: boolean;
	website?: string;
};

export type RailwayValidateServiceEdgeRulesInputInput = {
	edgeRules: RailwayJsonValue;
	environmentId: string;
	serviceId: string;
};

export type RailwayVariableCollectionUpsertInputInput = {
	environmentId: string;
	projectId: string;
	/** When set to true, removes all existing variables before upserting the new collection. */
	replace?: boolean;
	serviceId?: string;
	/** Skip deploys for affected services */
	skipDeploys?: boolean;
	variables: Record<string, string>;
};

export type RailwayVariableDeleteInputInput = {
	environmentId: string;
	name: string;
	projectId: string;
	serviceId?: string;
};

export type RailwayVariableUpsertInputInput = {
	environmentId: string;
	name: string;
	projectId: string;
	serviceId?: string;
	/** Skip deploys for affected services */
	skipDeploys?: boolean;
	value: string;
};

export type RailwayVolumeCreateInputInput = {
	/** The environment to deploy the volume instances into. If `null`, the volume will not be deployed to any environment. `undefined` will deploy to all environments. */
	environmentId?: string;
	/** The path in the container to mount the volume to */
	mountPath: string;
	/** The project to create the volume in */
	projectId: string;
	/** The region to create the volume instances in. If not provided, the default region will be used. */
	region?: string;
	/** The service to attach the volume to. If not provided, the volume will be disconnected. */
	serviceId?: string;
};

export type RailwayVolumeInstanceBackupScheduleKindInput =
	| 'DAILY'
	| 'MONTHLY'
	| 'WEEKLY';

export type RailwayVolumeInstanceUpdateInputInput = {
	/** The mount path of the volume instance. If not provided, the mount path will not be updated. */
	mountPath?: string;
	/** The service to attach the volume to. If not provided, the volume will be disconnected. */
	serviceId?: string;
	/** The state of the volume instance. If not provided, the state will not be updated. */
	state?: RailwayVolumeStateInput;
};

export type RailwayVolumeStateInput =
	| 'DELETED'
	| 'DELETING'
	| 'ERROR'
	| 'MIGRATING'
	| 'MIGRATION_PENDING'
	| 'READY'
	| 'RESTORING'
	| 'UPDATING';

export type RailwayVolumeUpdateInputInput = {
	/** The name of the volume */
	name?: string;
};

export type RailwayWebhookHeaderInputInput = {
	name: string;
	value: string;
};

export type RailwayWorkspaceInviteCodeCreateInputInput = {
	role: string;
};

export type RailwayWorkspacePermissionChangeInputInput = {
	role: RailwayTeamRoleInput;
	userId: string;
	workspaceId: string;
};

export type RailwayWorkspacePolicyDeploySourceTypeInput = 'GITHUB_ORG';

export type RailwayWorkspacePolicyItemUpdateInputInput = {
	enabled: boolean;
	policy: RailwayWorkspacePolicyNameInput;
};

export type RailwayWorkspacePolicyNameInput =
	| 'RESTRICT_DEPLOYS_TO_ALLOWED_SOURCES'
	| 'RESTRICT_PUBLIC_TCP_PROXIES'
	| 'RESTRICT_RAILWAY_DOMAIN_GENERATION';

export type RailwayWorkspaceTrustedDomainCreateInputInput = {
	domainName: string;
	role: string;
	workspaceId: string;
};

export type RailwayWorkspaceTrustedDomainUpdateInputInput = {
	autoJoinEnabled?: boolean;
	id: string;
	role?: string;
};

export type RailwayWorkspaceUpdateInputInput = {
	avatar?: string;
	name?: string;
	preferredRegion?: string;
};

export type RailwayWorkspaceUserInviteInputInput = {
	code: string;
	email: string;
};

export type RailwayWorkspaceUserRemoveInputInput = {
	userId: string;
};

export type RailwayCustomerTogglePayoutsToCreditsInputInput = {
	isWithdrawingToCredits: boolean;
};

export type RailwayAccessGroup = {
	createdAt?: string | null;
	id?: string | null;
	name?: string | null;
	role?: RailwayProjectRole | null;
	source?: RailwayAccessGroupSource | null;
	updatedAt?: string | null;
	workspace?: RailwayWorkspaceSummary | null;
	workspaceId?: string | null;
};

export type RailwayAccessGroupMember = {
	accessGroup?: RailwayAccessGroupSummary | null;
	accessGroupId?: string | null;
	createdAt?: string | null;
	id?: string | null;
	updatedAt?: string | null;
	user?: RailwayUserSummarySummary | null;
	userId?: string | null;
};

export type RailwayAccessGroupProject = {
	accessGroup?: RailwayAccessGroupSummary | null;
	accessGroupId?: string | null;
	createdAt?: string | null;
	id?: string | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	updatedAt?: string | null;
};

export type RailwayAccessGroupSource = string;

export type RailwayAccessGroupSummary = {
	createdAt?: string | null;
	id?: string | null;
	name?: string | null;
	role?: RailwayProjectRole | null;
	source?: RailwayAccessGroupSource | null;
	updatedAt?: string | null;
	workspaceId?: string | null;
};

export type RailwayAccessRuleSummary = {
	disallowed?: string | null;
};

export type RailwayActiveFeatureFlag = string;

export type RailwayActiveProjectFeatureFlag = string;

export type RailwayActiveServiceFeatureFlag = string;

export type RailwayAdoptionInfoSummary = {
	adoptionLevel?: number | null;
	createdAt?: string | null;
	deltaLevel?: number | null;
	id?: string | null;
	matchedIcpEmail?: string | null;
	monthlyEstimatedUsage?: number | null;
	numConfigFile?: number | null;
	numCronSchedule?: number | null;
	numDeploys?: number | null;
	numEnvs?: number | null;
	numFailedDeploys?: number | null;
	numHealthcheck?: number | null;
	numIconConfig?: number | null;
	numRegion?: number | null;
	numReplicas?: number | null;
	numRootDirectory?: number | null;
	numSeats?: number | null;
	numServices?: number | null;
	numVariables?: number | null;
	numWatchPatterns?: number | null;
	totalCores?: number | null;
	totalDisk?: number | null;
	totalNetwork?: number | null;
	updatedAt?: string | null;
};

export type RailwayAgentUsageSummary = {
	billingPeriodEnd?: string | null;
	hardLimitCents?: number | null;
	hasCustomHardLimit?: boolean | null;
	softLimitCents?: number | null;
	totalUsedCents?: number | null;
	usageRemaining?: number | null;
};

/** The aggregated usage of a single measurement. */
export type RailwayAggregatedUsage = {
	/** The measurement that was aggregated. */
	measurement?: RailwayMetricMeasurement | null;
	/** The tags that were used to group the metric. Only the tags that were used in the `groupBy` will be present. */
	tags?: RailwayMetricTagsSummary | null;
	/** The aggregated value. */
	value?: number | null;
};

/** The aggregated usage of a single measurement. */
export type RailwayAggregatedUsageSummary = {
	/** The measurement that was aggregated. */
	measurement?: RailwayMetricMeasurement | null;
	/** The aggregated value. */
	value?: number | null;
};

export type RailwayAllDomains = {
	customDomains?: Array<RailwayCustomDomainSummary> | null;
	serviceDomains?: Array<RailwayServiceDomainSummary> | null;
};

export type RailwayApiToken = {
	createdAt?: string | null;
	creator?: RailwayUserSummarySummary | null;
	displayToken?: string | null;
	expiresAt?: string | null;
	id?: string | null;
	name?: string | null;
	workspaceId?: string | null;
};

/** Information about the current API token and its accessible workspaces. */
export type RailwayApiTokenContext = {
	/** Workspaces this subject can operate on via this token or session. */
	workspaces?: Array<RailwayApiTokenWorkspaceSummary> | null;
};

export type RailwayApiTokenRateLimitSummary = {
	remainingPoints?: number | null;
	resetsAt?: string | null;
};

export type RailwayApiTokenWorkspaceSummary = {
	id?: string | null;
	name?: string | null;
};

export type RailwayAppliedByMemberSummary = {
	avatar?: string | null;
	email?: string | null;
	id?: string | null;
	name?: string | null;
	username?: string | null;
};

export type RailwayAuditLog = {
	context?: RailwayJsonValue | null;
	createdAt?: string | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	eventType?: string | null;
	id?: string | null;
	payload?: RailwayJsonValue | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	workspaceId?: string | null;
};

export type RailwayAuditLogEventTypeInfo = {
	description?: string | null;
	eventType?: string | null;
};

export type RailwayBotScopeBindingInfo = {
	canRemove?: boolean | null;
	id?: string | null;
	platform?: string | null;
	scopeId?: string | null;
	scopeName?: string | null;
	scopeType?: string | null;
	workspaceId?: string | null;
	workspaceName?: string | null;
};

export type RailwayBucket = {
	createdAt?: string | null;
	deletedAt?: string | null;
	groupId?: string | null;
	id?: string | null;
	name?: string | null;
	parentServiceId?: string | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	updatedAt?: string | null;
};

export type RailwayBucketInstanceDetails = {
	objectCount?: (number | string) | null;
	sizeBytes?: (number | string) | null;
};

export type RailwayBucketS3CompatibleCredentials = {
	accessKeyId?: string | null;
	bucketName?: string | null;
	createdAt?: string | null;
	endpoint?: string | null;
	region?: string | null;
	secretAccessKey?: string | null;
	urlStyle?: string | null;
};

export type RailwayBuilder = string;

export type RailwayCDNProvider = string;

export type RailwayCanvasViewMergePreview = {
	mutations?: Array<RailwayJsonValue> | null;
	state?: RailwayJsonValue | null;
};

/** The type of error that occurred during certificate issuance */
export type RailwayCertificateErrorType = string;

export type RailwayCertificateStatus = string;

export type RailwayCertificateStatusDetailed = string;

export type RailwayChangeOperationResultSummary = {
	kind?: string | null;
	outputs?: RailwayJsonValue | null;
	path?: string | null;
	status?: string | null;
	summary?: string | null;
};

export type RailwayChangeSetApplyResult = {
	changes?: Array<RailwayChangeOperationResultSummary> | null;
	deploymentId?: string | null;
	diagnostics?: RailwayJsonValue | null;
	id?: string | null;
	operationId?: string | null;
	stagedPatchId?: string | null;
	status?: string | null;
};

export type RailwayChangeSetPreview = {
	changeSet?: RailwayJsonValue | null;
	diagnostics?: RailwayJsonValue | null;
	effects?: RailwayJsonValue | null;
};

export type RailwayClearanceTokenCreatePayload = {
	clearanceToken?: RailwayClearanceTokenSummary | null;
	/** The token. Shown this once; it isn't stored. */
	token?: string | null;
};

/** A Railway Authentication machine token: gets non-human callers past the sign-in on a project's protected services. The token itself is only returned when it's created. */
export type RailwayClearanceTokenSummary = {
	createdAt?: string | null;
	/** Null means every environment of the project. */
	environmentId?: string | null;
	environmentName?: string | null;
	expiresAt?: string | null;
	id?: string | null;
	name?: string | null;
};

/** A persistent cloud agent for running coding harnesses. */
export type RailwayCloudAgent = {
	/** WebSocket endpoint of the in-VM harness gate, for the dashboard chat. Survives sleep: the domain is stable across sleep and wake. Prefers the machine observation; when that carries no gate domain it falls back to the domain network-cp actively serves, so an agent whose observation lagged still… */
	agentWsUrl?: string | null;
	/** When the agent was archived; null if it isn't. */
	archivedAt?: string | null;
	/** Target ID for console or command execution. Null while unavailable. */
	consoleTargetId?: string | null;
	createdAt?: string | null;
	/** The agent machine's public HTTP domain (port 8080) — the live preview. Prefers the observation (falling back to the first declared domain when 8080 was never requested); when the observation carries no domains it falls back to the domain network-cp actively serves on 8080, so a preview shows… */
	domain?: string | null;
	/** Every public domain on the agent's machine, one per port, in the order the machine declared them. */
	domains?: Array<RailwayCloudAgentDomainSummary> | null;
	environmentId?: string | null;
	id?: string | null;
	name?: string | null;
	/** The agent machine's own public HTTP domain (port 8080), known whether or not the machine is up: the observed one, else derived from the machine's id as the orchestrator names it. A fork's is its own machine's, never the source's. Null without a machine. */
	previewDomain?: string | null;
	/** Hostname on the environment's private network, e.g. <name>.railway.internal, reachable on any port from services in that environment. Null when the VM is isolated or its private endpoint isn't registered yet. */
	privateDomain?: string | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	/** Region the agent's machine runs in. Null briefly after creation, before the machine has been placed. */
	region?: string | null;
	/** Coding-agent sessions, one entry per session, newest first. Kept while the agent sleeps, so it still lists what it was doing. */
	sessions?: Array<RailwayCloudAgentSnapshotSummary> | null;
	/** Repo this agent's workspace was created from. Null for agents created without a source. */
	source?: RailwayCloudAgentSourceSummary | null;
	status?: RailwayCloudAgentStatus | null;
	/** Where the agent's work stands: its most urgent session's status. Kept while the agent sleeps. */
	workStatus?: RailwayCloudAgentWorkStatusSummary | null;
};

/** What a BLOCKED session waits on: a tool call to approve, a question to answer, or a login or credential. */
export type RailwayCloudAgentBlockedKind = string;

/** A checkpoint of a cloud agent's disk. */
export type RailwayCloudAgentCheckpoint = {
	createdAt?: string | null;
	/** Set when the checkpoint boots only in this environment. Null boots anywhere in the project. */
	environmentId?: string | null;
	/** Why the capture failed. */
	failureReason?: string | null;
	id?: string | null;
	name?: string | null;
	projectId?: string | null;
	/** Region the checkpoint was captured in. */
	region?: string | null;
	status?: RailwayCloudAgentCheckpointStatus | null;
};

/** Capture progress of a cloud agent checkpoint. */
export type RailwayCloudAgentCheckpointStatus = string;

export type RailwayCloudAgentDeployResult = {
	deploymentId?: string | null;
	serviceId?: string | null;
};

/** One public domain on an agent's machine. */
export type RailwayCloudAgentDomainSummary = {
	/** Resolved FQDN. */
	domain?: string | null;
	/** Target port on the workload this domain routes to. */
	port?: number | null;
	/** Label prefix the machine declared, e.g. app. */
	prefix?: string | null;
};

/** The state of one coding agent session in a cloud agent. */
export type RailwayCloudAgentSnapshotSummary = {
	harness?: string | null;
	lastEventKind?: string | null;
	/** The session's latest prompt, truncated for display. Null if none was reported or you can't manage this agent. */
	latestPrompt?: string | null;
	/** The session's first prompt, truncated for display. Null if none was reported or you can't manage this agent. */
	prompt?: string | null;
	sessionId?: string | null;
	/** Durable console session name the harness ran inside. Null on older VMs that don't report it. */
	sessionName?: string | null;
	/** One of: unknown, working, waiting, idle, failed, done. */
	state?: string | null;
	taskId?: string | null;
	terminal?: boolean | null;
	/** The session's generated title; fall back to latestPrompt, then prompt. Null until generated or if you can't manage this agent. */
	title?: string | null;
	updatedAt?: string | null;
};

export type RailwayCloudAgentSourceStatus = string;

/** Workspace provenance: the GitHub repo cloned into the agent's workspace at create time. */
export type RailwayCloudAgentSourceSummary = {
	/** Requested ref; null = the repo's default branch. */
	branch?: string | null;
	/** Selected checkout directory; null means /app. */
	dir?: string | null;
	/** owner/repo. */
	repo?: string | null;
	/** Service the repo was resolved from, when given. */
	serviceId?: string | null;
	/** Clone progress. Failed never blocks the agent; only CLONING should hold a launch. */
	status?: RailwayCloudAgentSourceStatus | null;
};

/** The current lifecycle state of a cloud agent. */
export type RailwayCloudAgentStatus = string;

/** A file the agent published and linked in its result. The URL rechecks access on every request and stays valid until expiresAt. */
export type RailwayCloudAgentTaskAttachmentSummary = {
	bytes?: number | null;
	contentType?: string | null;
	expiresAt?: string | null;
	filename?: string | null;
	id?: string | null;
	url?: string | null;
};

export type RailwayCloudAgentTaskCancelResult = {
	/** The status when cancel was requested. Poll cloudAgentTask for the outcome. */
	status?: RailwayCloudAgentTaskStatus | null;
	taskId?: string | null;
};

export type RailwayCloudAgentTaskHandle = {
	cloudAgentId?: string | null;
	/** Set when dashboardHandoff moved the prompt to the agent dashboard: the task is a new run there, not a turn on the agent asked for, and this is its link. Follow it there; its questions and approvals wait on the dashboard. */
	dashboardRunUrl?: string | null;
	/** The prompt answered the agent's open question on this session instead of starting a turn; taskId is the task that asked. */
	deliveredAsReply?: boolean | null;
	replayed?: boolean | null;
	sessionId?: string | null;
	status?: RailwayCloudAgentTaskStatus | null;
	taskId?: string | null;
};

export type RailwayCloudAgentTaskInteractionAction = string;

/** A question the task's run is waiting on: a tool approval or an MCP server's form. */
export type RailwayCloudAgentTaskInteractionSummary = {
	actions?: Array<RailwayCloudAgentTaskInteractionAction> | null;
	expiresAt?: string | null;
	/** Elicitation: the form fields to fill for ACCEPT. */
	fields?: RailwayJsonValue | null;
	kind?: string | null;
	message?: string | null;
	requestId?: string | null;
	requestedAt?: string | null;
	/** Elicitation: the MCP server asking. */
	server?: string | null;
	/** Approval: a preview of the tool call's arguments. */
	summary?: RailwayJsonValue | null;
	/** Approval: the tool waiting to run. */
	tool?: string | null;
};

export type RailwayCloudAgentTaskModelSummary = {
	displayName?: string | null;
	/** Pass as the dispatch's model. */
	id?: string | null;
	/** A new conversation runs on it when the task names none. */
	isDefault?: boolean | null;
	provider?: string | null;
	/** Empty when the model takes no reasoning effort. */
	reasoningEfforts?: Array<string> | null;
};

export type RailwayCloudAgentTaskModels = {
	defaultModel?: string | null;
	defaultReasoningEffort?: string | null;
	models?: Array<RailwayCloudAgentTaskModelSummary> | null;
};

export type RailwayCloudAgentTaskPage = {
	nextCursor?: string | null;
	tasks?: Array<RailwayCloudAgentTaskSummary> | null;
};

export type RailwayCloudAgentTaskProgressSummary = {
	attempt?: number | null;
	steps?: number | null;
	todos?: RailwayJsonValue | null;
	/** Tools running now, by name. */
	tools?: Array<string> | null;
	updatedAt?: string | null;
};

export type RailwayCloudAgentTaskRespondResult = {
	outcome?: string | null;
	taskId?: string | null;
};

export type RailwayCloudAgentTaskResult = {
	/** Files the agent linked in its result, once it ends. */
	attachments?: Array<RailwayCloudAgentTaskAttachmentSummary> | null;
	cloudAgentId?: string | null;
	completedAt?: string | null;
	error?: string | null;
	externalRef?: string | null;
	metadata?: RailwayJsonValue | null;
	/** The model the turn ran on, once it was submitted. */
	model?: string | null;
	/** Answer these with cloudAgentTaskRespond. */
	pendingInteractions?: Array<RailwayCloudAgentTaskInteractionSummary> | null;
	progress?: RailwayCloudAgentTaskProgressSummary | null;
	reasoningEffort?: string | null;
	sessionId?: string | null;
	sessionState?: string | null;
	status?: RailwayCloudAgentTaskStatus | null;
	structuredOutput?: RailwayJsonValue | null;
	taskId?: string | null;
	text?: string | null;
};

export type RailwayCloudAgentTaskStatus = string;

/** Task lifecycle and correlation. Read cloudAgentTask for the latest session response. */
export type RailwayCloudAgentTaskSummary = {
	cloudAgentId?: string | null;
	completedAt?: string | null;
	createdAt?: string | null;
	createdVia?: RailwayCloudAgentTaskVia | null;
	error?: string | null;
	externalRef?: string | null;
	id?: string | null;
	metadata?: RailwayJsonValue | null;
	/** The model the turn ran on, once it was submitted. */
	model?: string | null;
	promptPreview?: string | null;
	reasoningEffort?: string | null;
	requestedByUserId?: string | null;
	sessionId?: string | null;
	startedAt?: string | null;
	status?: RailwayCloudAgentTaskStatus | null;
	structuredOutput?: RailwayJsonValue | null;
	/** The turn's closing text, once it has finished. */
	text?: string | null;
};

export type RailwayCloudAgentTaskVia = string;

/** Where a cloud agent's work stands, named after the OSC 7501 program-status states. */
export type RailwayCloudAgentWorkState = string;

/** Where work stands, computed on read from the native harness's run events, else the VM's session report. */
export type RailwayCloudAgentWorkStatusSummary = {
	/** When the fact behind the state happened, by the VM's clock. */
	at?: string | null;
	/** What a BLOCKED session waits on. Null when the harness doesn't say. */
	kind?: RailwayCloudAgentBlockedKind | null;
	/** The session's latest status line: its open question, failure or final summary. Written by the agent; display as plain text. Null unless you can manage this agent. */
	message?: string | null;
	state?: RailwayCloudAgentWorkState | null;
	/** DONE or ERROR, and the owner hasn't looked since. On an agent: any session is. Cleared by cloudAgentMarkSeen. */
	unseen?: boolean | null;
};

export type RailwayComplianceAgreementsInfo = {
	/** Whether the workspace has a signed Business Associate Agreement (HIPAA) */
	hasBAA?: boolean | null;
	/** Whether the workspace has a Data Processing Agreement (GDPR) */
	hasDPA?: boolean | null;
};

export type RailwayConnectedServiceInstanceSummary = {
	environmentId?: string | null;
	projectId?: string | null;
	serviceId?: string | null;
	serviceName?: string | null;
};

export type RailwayCustomDomain = {
	createdAt?: string | null;
	deletedAt?: string | null;
	domain?: string | null;
	edgeId?: string | null;
	environmentId?: string | null;
	id?: string | null;
	isRailwayDomain?: boolean | null;
	projectId?: string | null;
	serviceId?: string | null;
	status?: RailwayCustomDomainStatusSummary | null;
	syncStatus?: RailwayCustomDomainSyncStatus | null;
	targetPort?: number | null;
	updatedAt?: string | null;
};

export type RailwayCustomDomainStatusSummary = {
	cdnProvider?: RailwayCDNProvider | null;
	/** Human-readable error message when certificate issuance fails */
	certificateErrorMessage?: string | null;
	/** Structured error type for programmatic handling */
	certificateErrorType?: RailwayCertificateErrorType | null;
	/** Whether the certificate issuance can be retried */
	certificateRetryable?: boolean | null;
	certificateStatus?: RailwayCertificateStatus | null;
	certificateStatusDetailed?: RailwayCertificateStatusDetailed | null;
	verificationDnsHost?: string | null;
	verificationToken?: string | null;
	verified?: boolean | null;
};

export type RailwayCustomDomainSummary = {
	createdAt?: string | null;
	deletedAt?: string | null;
	domain?: string | null;
	edgeId?: string | null;
	environmentId?: string | null;
	id?: string | null;
	isRailwayDomain?: boolean | null;
	projectId?: string | null;
	serviceId?: string | null;
	syncStatus?: RailwayCustomDomainSyncStatus | null;
	targetPort?: number | null;
	updatedAt?: string | null;
};

export type RailwayCustomDomainSyncStatus = string;

export type RailwayCustomerSummary = {
	/** The total amount of credits that have been applied during the current billing period. */
	appliedCredits?: number | null;
	billingEmail?: string | null;
	/** The total amount of unused credits for the customer. */
	creditBalance?: number | null;
	/** The current usage for the customer. This value is cached and may not be up to date. */
	currentUsage?: number | null;
	defaultPaymentMethodId?: string | null;
	hasExhaustedFreePlan?: boolean | null;
	id?: string | null;
	isPrepaying?: boolean | null;
	isTrialing?: boolean | null;
	isUsageSubscriber?: boolean | null;
	isWithdrawingToCredits?: boolean | null;
	remainingUsageCreditBalance?: number | null;
	state?: RailwaySubscriptionState | null;
	stripeCustomerId?: string | null;
	supportedWithdrawalPlatforms?: Array<RailwayWithdrawalPlatformTypes> | null;
	trialDaysRemaining?: number | null;
};

export type RailwayDatabasePasswordResetResponse = {
	newPassword?: string | null;
	/** True when an HA cluster's rotation is still running: `newPassword` is live only once `databasePasswordRotationProgress` reports DONE, and `updatedVariables` is empty until then. */
	rotationInProgress?: boolean | null;
	updatedVariables?: RailwayJsonValue | null;
};

export type RailwayDatabasePasswordRotationProgress = {
	completedMembers?: Array<string> | null;
	error?: string | null;
	memberServiceId?: string | null;
	memberServiceName?: string | null;
	phase?: string | null;
};

export type RailwayDeployment = {
	canRedeploy?: boolean | null;
	canRollback?: boolean | null;
	createdAt?: string | null;
	creator?: RailwayDeploymentCreatorSummary | null;
	/** Check if a deployment's instances have all stopped */
	deploymentStopped?: boolean | null;
	diagnosis?: RailwayJsonValue | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	id?: string | null;
	instances?: Array<RailwayDeploymentDeploymentInstanceSummary> | null;
	/** Older terminal deployment kept as history only: it can be redeployed but not rolled back to. Whether its snapshot's variables are still returned is DeploymentSnapshot.variablesRedacted. */
	isArchived?: boolean | null;
	meta?: RailwayJsonValue | null;
	projectId?: string | null;
	service?: RailwayServiceSummary | null;
	serviceId?: string | null;
	snapshotId?: string | null;
	sockets?: Array<RailwayDeploymentSocketSummary> | null;
	staticUrl?: string | null;
	status?: RailwayDeploymentStatus | null;
	statusUpdatedAt?: string | null;
	suggestAddServiceDomain?: boolean | null;
	updatedAt?: string | null;
	url?: string | null;
};

export type RailwayDeploymentCreatorSummary = {
	avatar?: string | null;
	email?: string | null;
	id?: string | null;
	name?: string | null;
};

export type RailwayDeploymentDeploymentInstanceSummary = {
	id?: string | null;
	status?: RailwayDeploymentInstanceStatus | null;
};

export type RailwayDeploymentEvent = {
	completedAt?: string | null;
	createdAt?: string | null;
	id?: string | null;
	payload?: RailwayDeploymentEventPayloadSummary | null;
	step?: RailwayDeploymentEventStep | null;
};

export type RailwayDeploymentEventPayloadSummary = {
	attempt?: number | null;
	detail?: string | null;
	durationMs?: number | null;
	error?: string | null;
	maxAttempts?: number | null;
	reason?: string | null;
	skipped?: boolean | null;
};

export type RailwayDeploymentEventStep = string;

export type RailwayDeploymentInstanceExecution = {
	completedAt?: string | null;
	createdAt?: string | null;
	deploymentId?: string | null;
	deploymentMeta?: RailwayJsonValue | null;
	id?: string | null;
	status?: RailwayDeploymentInstanceStatus | null;
	updatedAt?: string | null;
};

export type RailwayDeploymentInstanceStatus = string;

export type RailwayDeploymentSnapshot = {
	createdAt?: string | null;
	id?: string | null;
	updatedAt?: string | null;
	/** Empty for archived deployments, whose variables are not kept (see variablesRedacted). */
	variables?: Record<string, string> | null;
	/** True when the snapshot belongs only to archived deployments, so its variables are not returned. */
	variablesRedacted?: boolean | null;
};

export type RailwayDeploymentSocketSummary = {
	ipv6?: boolean | null;
	port?: number | null;
	processName?: string | null;
	updatedAt?: number | null;
};

export type RailwayDeploymentStatus = string;

export type RailwayDeploymentSummary = {
	canRedeploy?: boolean | null;
	canRollback?: boolean | null;
	createdAt?: string | null;
	/** Check if a deployment's instances have all stopped */
	deploymentStopped?: boolean | null;
	diagnosis?: RailwayJsonValue | null;
	environmentId?: string | null;
	id?: string | null;
	/** Older terminal deployment kept as history only: it can be redeployed but not rolled back to. Whether its snapshot's variables are still returned is DeploymentSnapshot.variablesRedacted. */
	isArchived?: boolean | null;
	meta?: RailwayJsonValue | null;
	projectId?: string | null;
	serviceId?: string | null;
	snapshotId?: string | null;
	staticUrl?: string | null;
	status?: RailwayDeploymentStatus | null;
	statusUpdatedAt?: string | null;
	suggestAddServiceDomain?: boolean | null;
	updatedAt?: string | null;
	url?: string | null;
};

export type RailwayDeploymentTrigger = {
	baseEnvironmentOverrideId?: string | null;
	branch?: string | null;
	checkSuites?: boolean | null;
	environmentId?: string | null;
	id?: string | null;
	projectId?: string | null;
	provider?: string | null;
	repository?: string | null;
	serviceId?: string | null;
	validCheckSuites?: number | null;
};

/** A single DNS query resolved for a service (one row per query, not aggregated) */
export type RailwayDnsQueryLog = {
	/** The IP addresses the name resolved to */
	answers?: Array<string> | null;
	/** Ordered CNAME targets the queried name aliased through before the final answer (empty when the response had no CNAME) */
	cnameChain?: Array<string> | null;
	/** The deployment ID */
	deploymentId?: string | null;
	/** The deployment instance ID */
	deploymentInstanceId?: string | null;
	/** The domain name that was looked up */
	qname?: string | null;
	/** The DNS record type queried (A, AAAA, TXT, ...) */
	qtype?: string | null;
	/** When the query was resolved (ISO timestamp) */
	queriedAt?: string | null;
	/** Whether the query targeted the internal zone or the public internet */
	queryZone?: RailwayDnsQueryZone | null;
	/** The DNS response code (NOERROR, NXDOMAIN, SERVFAIL, ...) or synthetic TIMEOUT/ERROR when no upstream response was received */
	rcode?: string | null;
	/** The service ID that made the queries */
	serviceId?: string | null;
};

/** Whether a DNS query targeted the internal zone or the public internet */
export type RailwayDnsQueryZone = string;

export type RailwayDockerComposeImport = {
	errors?: Array<string> | null;
	patch?: RailwayJsonValue | null;
};

export type RailwayDomainAvailable = {
	available?: boolean | null;
	message?: string | null;
};

export type RailwayEdgeCachingConfigSummary = {
	defaultTtlSeconds?: number | null;
	htmlCaching?: string | null;
	mode?: string | null;
	purgeOnDeploy?: RailwayPurgeOnDeploy | null;
};

export type RailwayEdgeConfig = {
	caching?: RailwayEdgeCachingConfigSummary | null;
	edgeRules?: RailwayJsonValue | null;
	enabled?: boolean | null;
	id?: string | null;
	overrides?: RailwayJsonValue | null;
	purgeEpoch?: number | null;
	purgeEpochByKind?: RailwayJsonValue | null;
	tracing?: RailwayEdgeTracingConfigSummary | null;
	underAttackModeUntil?: number | null;
};

export type RailwayEdgeConfigSummary = {
	edgeRules?: RailwayJsonValue | null;
	enabled?: boolean | null;
	id?: string | null;
	overrides?: RailwayJsonValue | null;
	purgeEpoch?: number | null;
	purgeEpochByKind?: RailwayJsonValue | null;
	underAttackModeUntil?: number | null;
};

export type RailwayEdgeRuleDiagnostic = {
	code?: string | null;
	message?: string | null;
	path?: string | null;
};

export type RailwayEdgeTracingConfigSummary = {
	enabled?: boolean | null;
	sampleRate?: number | null;
};

export type RailwayEgressGateway = {
	ipv4?: string | null;
	region?: string | null;
	zone?: string | null;
};

export type RailwayEgressGatewaySummary = {
	ipv4?: string | null;
	region?: string | null;
	zone?: string | null;
};

export type RailwayEgressMigrationEnvironmentResultSummary = {
	environmentId?: string | null;
	environmentName?: string | null;
	error?: string | null;
	success?: boolean | null;
};

export type RailwayEgressMigrationResult = {
	environments?: Array<RailwayEgressMigrationEnvironmentResultSummary> | null;
	ips?: Array<RailwayEgressGatewaySummary> | null;
};

export type RailwayEnvironment = {
	canAccess?: boolean | null;
	canvasGroupRefs?: RailwayJsonValue | null;
	/** Services whose edge caching was turned off when the Railway Authentication default last turned on. */
	clearanceCachingTurnedOff?: Array<string> | null;
	/** Whether Railway Authentication protects this environment's services that have no setting of their own. */
	clearanceDefault?: boolean | null;
	clearanceDefaultUpdatedAt?: string | null;
	/** When the current Railway Authentication default last finished reaching every service that inherits it. */
	clearancePropagatedAt?: string | null;
	clearancePropagationError?: string | null;
	/** How many of the environment's services follow its Railway Authentication default, and how many have their own on or off. */
	clearanceServiceCounts?: RailwayEnvironmentClearanceServiceCountsSummary | null;
	config?: RailwayJsonValue | null;
	/** Opaque snapshot token of the environment's IaC-relevant config. Echo it back as baseConfigEtag on environmentApplyChangeSet for optimistic concurrency. */
	configEtag?: string | null;
	createdAt?: string | null;
	deletedAt?: string | null;
	/** IaC resource address → partial name for this environment. '*' is the whole-project owner. Used so omit=delete only applies to resources this file already owns. */
	iacPartials?: RailwayJsonValue | null;
	id?: string | null;
	isEphemeral?: boolean | null;
	meta?: RailwayEnvironmentMetaSummary | null;
	name?: string | null;
	projectId?: string | null;
	sourceEnvironment?: RailwayEnvironmentSummary | null;
	/** Name of the environment this one was copied from. A project token can read this on its own environment. It does not grant access to the source environment. */
	sourceEnvironmentName?: string | null;
	unmergedChangesCount?: number | null;
	updatedAt?: string | null;
};

export type RailwayEnvironmentClearanceServiceCountsSummary = {
	inheriting?: number | null;
	off?: number | null;
	on?: number | null;
};

export type RailwayEnvironmentConfigPlanCommentUpsertResult = {
	commentId?: string | null;
	url?: string | null;
};

export type RailwayEnvironmentMetaSummary = {
	baseBranch?: string | null;
	branch?: string | null;
	latestSuccessfulGitHubDeploymentId?: number | null;
	prCommentId?: number | null;
	prNumber?: number | null;
	prRepo?: string | null;
	prTitle?: string | null;
	skippedResourceIds?: RailwayJsonValue | null;
};

export type RailwayEnvironmentPatch = {
	appliedAt?: string | null;
	appliedBy?: RailwayAppliedByMemberSummary | null;
	createdAt?: string | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	id?: string | null;
	lastAppliedError?: string | null;
	message?: string | null;
	patch?: RailwayJsonValue | null;
	status?: RailwayEnvironmentPatchStatus | null;
	updatedAt?: string | null;
	/** True when this patch is served from the long-term archive: variable names are kept, values are not. */
	variablesRedacted?: boolean | null;
};

export type RailwayEnvironmentPatchStatus = string;

export type RailwayEnvironmentSummary = {
	canAccess?: boolean | null;
	canvasGroupRefs?: RailwayJsonValue | null;
	/** Services whose edge caching was turned off when the Railway Authentication default last turned on. */
	clearanceCachingTurnedOff?: Array<string> | null;
	/** Whether Railway Authentication protects this environment's services that have no setting of their own. */
	clearanceDefault?: boolean | null;
	clearanceDefaultUpdatedAt?: string | null;
	/** When the current Railway Authentication default last finished reaching every service that inherits it. */
	clearancePropagatedAt?: string | null;
	clearancePropagationError?: string | null;
	config?: RailwayJsonValue | null;
	/** Opaque snapshot token of the environment's IaC-relevant config. Echo it back as baseConfigEtag on environmentApplyChangeSet for optimistic concurrency. */
	configEtag?: string | null;
	createdAt?: string | null;
	deletedAt?: string | null;
	/** IaC resource address → partial name for this environment. '*' is the whole-project owner. Used so omit=delete only applies to resources this file already owns. */
	iacPartials?: RailwayJsonValue | null;
	id?: string | null;
	isEphemeral?: boolean | null;
	name?: string | null;
	projectId?: string | null;
	/** Name of the environment this one was copied from. A project token can read this on its own environment. It does not grant access to the source environment. */
	sourceEnvironmentName?: string | null;
	unmergedChangesCount?: number | null;
	updatedAt?: string | null;
};

/** The estimated usage of a single measurement. */
export type RailwayEstimatedUsage = {
	/** The estimated value. */
	estimatedValue?: number | null;
	/** The measurement that was estimated. */
	measurement?: RailwayMetricMeasurement | null;
	projectId?: string | null;
};

export type RailwayEvent = {
	action?: string | null;
	/** Minimal event payload for activity feed list rendering. Avoids returning large deployment payload fields like commit messages. */
	activityPayload?: RailwayJsonValue | null;
	createdAt?: string | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	id?: string | null;
	object?: string | null;
	payload?: RailwayJsonValue | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	severity?: RailwayEventSeverity | null;
};

export type RailwayEventSeverity = string;

export type RailwayExternalWorkspace = {
	avatar?: string | null;
	banReason?: string | null;
	createdAt?: string | null;
	currentSessionHasAccess?: boolean | null;
	customerId?: string | null;
	customerState?: RailwaySubscriptionState | null;
	discordRole?: string | null;
	has2FAEnforcement?: boolean | null;
	hasAutomaticDiagnosis?: boolean | null;
	hasGuardrailsAccess?: boolean | null;
	hasSAML?: boolean | null;
	id?: string | null;
	isTrialing?: boolean | null;
	name?: string | null;
	plan?: RailwayPlan | null;
	preferredRegion?: string | null;
	projects?: Array<RailwayProjectSummary> | null;
	redactedDueTo2FAPending?: boolean | null;
	subscriptionPlanLimit?: RailwayJsonValue | null;
	teamId?: string | null;
};

export type RailwayFunctionRuntime = {
	/** The image of the function runtime */
	image?: string | null;
	/** The latest version of the function runtime */
	latestVersion?: RailwayFunctionRuntimeVersionSummary | null;
	/** The name of the function runtime */
	name?: RailwayFunctionRuntimeName | null;
	/** The versions of the function runtime */
	versions?: Array<RailwayFunctionRuntimeVersionSummary> | null;
};

/** Supported function runtime environments */
export type RailwayFunctionRuntimeName = string;

export type RailwayFunctionRuntimeVersionSummary = {
	image?: string | null;
	tag?: string | null;
};

export type RailwayGitHubAccess = {
	hasAccess?: boolean | null;
	isPublic?: boolean | null;
};

export type RailwayGitHubBranch = {
	name?: string | null;
};

export type RailwayGitHubCheckSummary = {
	name?: string | null;
	status?: string | null;
};

export type RailwayGitHubPRInfo = {
	additions?: number | null;
	author?: string | null;
	body?: string | null;
	changedFiles?: number | null;
	checks?: Array<RailwayGitHubCheckSummary> | null;
	deletions?: number | null;
	mergeable?: boolean | null;
	state?: string | null;
	title?: string | null;
};

export type RailwayGitHubPRInfoResult = {
	error?: string | null;
	prInfo?: RailwayGitHubPRInfoSummary | null;
};

export type RailwayGitHubPRInfoSummary = {
	additions?: number | null;
	author?: string | null;
	body?: string | null;
	changedFiles?: number | null;
	deletions?: number | null;
	mergeable?: boolean | null;
	state?: string | null;
	title?: string | null;
};

export type RailwayGitHubRepo = {
	defaultBranch?: string | null;
	description?: string | null;
	fullName?: string | null;
	id?: number | null;
	installationId?: string | null;
	isPrivate?: boolean | null;
	name?: string | null;
	ownerAvatarUrl?: string | null;
};

export type RailwayGitHubRepoWithoutInstallation = {
	defaultBranch?: string | null;
	description?: string | null;
	fullName?: string | null;
	id?: number | null;
	isPrivate?: boolean | null;
	name?: string | null;
};

/** An SSH public key from GitHub. */
export type RailwayGitHubSshKey = {
	id?: number | null;
	key?: string | null;
	title?: string | null;
};

/** The result of an HTTP duration metrics query. */
export type RailwayHttpDurationMetricsResult = {
	/** The samples of HTTP duration metrics. */
	samples?: Array<RailwayHttpDurationMetricsSampleSummary> | null;
};

/** A single sample of HTTP duration metrics. */
export type RailwayHttpDurationMetricsSampleSummary = {
	/** 50th percentile (median) request duration in milliseconds. */
	p50?: number | null;
	/** 90th percentile request duration in milliseconds. */
	p90?: number | null;
	/** 95th percentile request duration in milliseconds. */
	p95?: number | null;
	/** 99th percentile request duration in milliseconds. */
	p99?: number | null;
	/** The timestamp of the sample. Represented as number of seconds since the Unix epoch. */
	ts?: number | null;
};

/** The result of a http logs query. */
export type RailwayHttpLog = {
	/** The client user agent */
	clientUa?: string | null;
	/** The deployment ID that was requested */
	deploymentId?: string | null;
	/** The deployment instance ID that was requested */
	deploymentInstanceId?: string | null;
	/** The downstream HTTP protocol version */
	downstreamProto?: string | null;
	/** The edge region the client connected to */
	edgeRegion?: string | null;
	/** The requested host */
	host?: string | null;
	/** The http status of the log */
	httpStatus?: number | null;
	/** The request HTTP method */
	method?: string | null;
	/** The requested path */
	path?: string | null;
	/** The unique request ID */
	requestId?: string | null;
	/** Details about the upstream response */
	responseDetails?: string | null;
	/** Received bytes */
	rxBytes?: number | null;
	/** The source IP of the request */
	srcIp?: string | null;
	/** The timestamp the log was created */
	timestamp?: string | null;
	/** The total duration the request took */
	totalDuration?: number | null;
	/** Outgoing bytes */
	txBytes?: number | null;
	/** The upstream address */
	upstreamAddress?: string | null;
	/** Any upstream errors that occurred */
	upstreamErrors?: string | null;
	/** The upstream HTTP protocol version */
	upstreamProto?: string | null;
	/** How long the upstream request took to respond */
	upstreamRqDuration?: number | null;
};

/** HTTP metrics grouped by status code. */
export type RailwayHttpMetricsByStatusResult = {
	/** The samples of HTTP metrics for this status code. */
	samples?: Array<RailwayHttpMetricsSampleSummary> | null;
	/** The HTTP status code. */
	statusCode?: number | null;
};

/** The result of an HTTP metrics query. */
export type RailwayHttpMetricsResult = {
	/** The samples of HTTP metrics. */
	samples?: Array<RailwayHttpMetricsSampleSummary> | null;
};

/** A single sample of an HTTP metric. */
export type RailwayHttpMetricsSampleSummary = {
	/** The timestamp of the sample. Represented as number of seconds since the Unix epoch. */
	ts?: number | null;
	/** The value of the sample (count of requests). */
	value?: number | null;
};

export type RailwayIacPartialOwnershipResult = {
	/** Resource addresses whose ownership changed. */
	affectedResources?: Array<string> | null;
	/** The environment's complete ownership map after the change. */
	iacPartials?: RailwayJsonValue | null;
};

export type RailwayIncidentStatus = string;

export type RailwayIncidentSummary = {
	createdAt?: string | null;
	id?: string | null;
	message?: string | null;
	status?: RailwayIncidentStatus | null;
	url?: string | null;
};

export type RailwayInviteCode = {
	code?: string | null;
	createdAt?: string | null;
	/** When this invite link expires. */
	expiresAt?: string | null;
	id?: string | null;
	isExpired?: boolean | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	role?: RailwayProjectRole | null;
};

/** The result of a logs query. */
export type RailwayLog = {
	/** The attributes that were parsed from a structured log */
	attributes?: Array<RailwayLogAttributeSummary> | null;
	/** The contents of the log message */
	message?: string | null;
	/** The severity of the log message (eg. err) */
	severity?: string | null;
	/** The tags that were associated with the log */
	tags?: RailwayLogTagsSummary | null;
	/** The timestamp of the log message in format RFC3339 (nano) */
	timestamp?: string | null;
};

/** The attributes associated with a structured log */
export type RailwayLogAttributeSummary = {
	key?: string | null;
	value?: string | null;
};

/** The tags associated with a specific log */
export type RailwayLogTagsSummary = {
	deploymentId?: string | null;
	deploymentInstanceId?: string | null;
	environmentId?: string | null;
	projectId?: string | null;
	serviceId?: string | null;
	snapshotId?: string | null;
};

export type RailwayMaintainerWorkspaceSummary = {
	avatar?: string | null;
	id?: string | null;
	name?: string | null;
};

export type RailwayMaintenanceStatus = string;

export type RailwayMaintenanceSummary = {
	id?: string | null;
	message?: string | null;
	start?: string | null;
	status?: RailwayMaintenanceStatus | null;
	url?: string | null;
};

/** A thing that can be measured on Railway. */
export type RailwayMetricMeasurement = string;

/** A single sample of a metric. */
export type RailwayMetricSummary = {
	/** The timestamp of the sample. Represented has number of seconds since the Unix epoch. */
	ts?: number | null;
	/** The value of the sample. */
	value?: number | null;
};

/** The tags that were used to group the metric. */
export type RailwayMetricTagsSummary = {
	deploymentId?: string | null;
	deploymentInstanceId?: string | null;
	environmentId?: string | null;
	projectId?: string | null;
	region?: string | null;
	serviceId?: string | null;
	volumeId?: string | null;
	volumeInstanceId?: string | null;
};

/** The result of a metrics query. */
export type RailwayMetricsResult = {
	/** The measurement of the metric. */
	measurement?: RailwayMetricMeasurement | null;
	/** The tags that were used to group the metric. Only the tags that were used to by will be present. */
	tags?: RailwayMetricTagsSummary | null;
	/** The samples of the metric. */
	values?: Array<RailwayMetricSummary> | null;
};

export type RailwayMysqlPitrRestorableWindow = {
	archiveConfigured?: boolean | null;
	ceilingAt?: string | null;
	fetchedAt?: string | null;
	floorAt?: string | null;
	fullBackupCount?: number | null;
	fullBackupsTakenAt?: Array<string> | null;
	lineageCount?: number | null;
	listingTruncated?: boolean | null;
};

/** The direction of a network flow relative to the service */
export type RailwayNetworkFlowDirection = string;

/** The layer 4 protocol of a network flow */
export type RailwayNetworkFlowL4Protocol = string;

/** A single network flow log entry */
export type RailwayNetworkFlowLog = {
	/** Number of bytes transferred */
	byteCount?: number | null;
	/** When the flow capture ended (ISO timestamp) */
	captureEnd?: string | null;
	/** When the flow capture started (ISO timestamp) */
	captureStart?: string | null;
	/** The deployment ID */
	deploymentId?: string | null;
	/** The deployment instance ID */
	deploymentInstanceId?: string | null;
	/** Traffic direction (ingress or egress) */
	direction?: RailwayNetworkFlowDirection | null;
	/** If packets were dropped, the reason */
	dropCause?: string | null;
	/** Destination IP address */
	dstAddr?: string | null;
	/** Destination port number */
	dstPort?: number | null;
	/** Unique identifier for the flow */
	flowId?: string | null;
	/** Whether the flow is partial or complete */
	flowState?: RailwayNetworkFlowState | null;
	/** Layer 4 latency in milliseconds */
	l4LatencyMs?: number | null;
	/** Layer 4 protocol (TCP, UDP, ICMP, etc) */
	l4Protocol?: RailwayNetworkFlowL4Protocol | null;
	/** Number of packets transferred */
	packetCount?: number | null;
	/** Type of peer (service, internet, DNS, etc) */
	peerKind?: RailwayNetworkFlowPeerKind | null;
	/** Service instance ID of the peer (for service-to-service flows) */
	peerServiceId?: string | null;
	/** The service ID this flow belongs to */
	serviceId?: string | null;
	/** Source IP address */
	srcAddr?: string | null;
	/** Source port number */
	srcPort?: number | null;
};

/** The type of peer in a network flow */
export type RailwayNetworkFlowPeerKind = string;

/** The state of a network flow */
export type RailwayNetworkFlowState = string;

export type RailwayNotificationChannelSummary = {
	/** Webhook header values are write-only: the read side carries header names with null values. */
	config?: RailwayJsonValue | null;
	createdAt?: string | null;
	id?: string | null;
	updatedAt?: string | null;
	workspaceId?: string | null;
};

export type RailwayNotificationDelivery = {
	createdAt?: string | null;
	id?: string | null;
	notificationInstance?: RailwayNotificationInstanceSummary | null;
	readAt?: string | null;
	status?: RailwayNotificationDeliveryStatus | null;
	type?: RailwayNotificationDeliveryType | null;
	updatedAt?: string | null;
	userId?: string | null;
};

export type RailwayNotificationDeliveryStatus = string;

export type RailwayNotificationDeliveryType = string;

export type RailwayNotificationInstanceSummary = {
	createdAt?: string | null;
	environmentId?: string | null;
	eventId?: string | null;
	eventType?: string | null;
	id?: string | null;
	payload?: RailwayJsonValue | null;
	projectId?: string | null;
	resolvedAt?: string | null;
	resourceId?: string | null;
	resourceType?: string | null;
	serviceId?: string | null;
	severity?: RailwayNotificationSeverity | null;
	status?: RailwayNotificationStatus | null;
	updatedAt?: string | null;
	volumeId?: string | null;
	workspaceId?: string | null;
};

export type RailwayNotificationRule = {
	channels?: Array<RailwayNotificationChannelSummary> | null;
	createdAt?: string | null;
	environmentId?: string | null;
	ephemeralEnvironments?: boolean | null;
	eventTypes?: Array<string> | null;
	id?: string | null;
	projectId?: string | null;
	serviceId?: string | null;
	severities?: Array<RailwayNotificationSeverity> | null;
	updatedAt?: string | null;
	workspaceId?: string | null;
};

export type RailwayNotificationSeverity = string;

export type RailwayNotificationStatus = string;

export type RailwayObservabilityDashboard = {
	id?: string | null;
	items?: Array<RailwayObservabilityDashboardItemInstanceSummary> | null;
	/** Changes with every write to the dashboard. Pass it to observabilityDashboardUpdate, which refuses a save based on an older one. */
	revision?: string | null;
};

export type RailwayObservabilityDashboardItemInstanceSummary = {
	displayConfig?: RailwayJsonValue | null;
	id?: string | null;
};

export type RailwayOperationStatus = string;

export type RailwayPartnerProfileSummary = {
	category?: string | null;
	description?: string | null;
	slug?: string | null;
	type?: RailwayPartnerProfileType | null;
	website?: string | null;
};

export type RailwayPartnerProfileType = string;

export type RailwayPasskey = {
	aaguid?: string | null;
	backedUp?: boolean | null;
	createdAt?: string | null;
	credentialId?: string | null;
	deviceName?: string | null;
	deviceType?: string | null;
	displayName?: string | null;
	id?: string | null;
	lastUsedAt?: string | null;
	lastUsedDevice?: string | null;
	transports?: Array<string> | null;
	updatedAt?: string | null;
};

/** An email change the authenticated user requested and has not confirmed yet. */
export type RailwayPendingEmailChange = {
	/** The address the change is to. */
	email?: string | null;
	/** When the confirmation link stops working. */
	expiresAt?: string | null;
	requestedAt?: string | null;
};

/** Live replication health of an HA database cluster's members. Used to gate the Enable/Disable PITR buttons on the same 'caught up' definition the rollout enforces. */
export type RailwayPitrHaClusterReplicationHealth = {
	allHealthy?: boolean | null;
	checkedAt?: string | null;
	environmentId?: string | null;
	members?: Array<RailwayPitrHaMemberReplicationHealthSummary> | null;
	reachable?: boolean | null;
	rootServiceId?: string | null;
};

export type RailwayPitrHaMemberReplicationHealthSummary = {
	healthy?: boolean | null;
	isLeader?: boolean | null;
	lagMb?: number | null;
	patroniName?: string | null;
	serviceId?: string | null;
	serviceName?: string | null;
	state?: string | null;
};

export type RailwayPitrHaWorkflowDirection = string;

export type RailwayPitrHaWorkflowMemberProgressSummary = {
	isLeader?: boolean | null;
	serviceId?: string | null;
	serviceName?: string | null;
	status?: RailwayPitrHaWorkflowMemberStatus | null;
};

export type RailwayPitrHaWorkflowMemberStatus = string;

export type RailwayPitrHaWorkflowPhase = string;

/** Progress of an in-flight or recently completed PITR enable/disable rollout on an HA database cluster. */
export type RailwayPitrHaWorkflowProgress = {
	clusterMutated?: boolean | null;
	completedAt?: string | null;
	currentMemberServiceId?: string | null;
	direction?: RailwayPitrHaWorkflowDirection | null;
	engine?: string | null;
	environmentId?: string | null;
	errorMessage?: string | null;
	failedAtPhase?: RailwayPitrHaWorkflowPhase | null;
	members?: Array<RailwayPitrHaWorkflowMemberProgressSummary> | null;
	newLeaderServiceId?: string | null;
	phase?: RailwayPitrHaWorkflowPhase | null;
	projectId?: string | null;
	rootServiceId?: string | null;
	startedAt?: string | null;
	updatedAt?: string | null;
	workflowId?: string | null;
};

/** Estimated disk space a point-in-time restore to a target needs, and whether it fits your plan's largest volume. A conservative estimate for the restore dialog's warning. */
export type RailwayPitrRestoreScratchEstimate = {
	baseBackupLabel?: string | null;
	dataMB?: number | null;
	estimatedScratchMB?: number | null;
	likelyToFit?: boolean | null;
	planMaxSizeMB?: number | null;
	walMB?: number | null;
};

export type RailwayPlan = string;

export type RailwayPlatformFeatureFlag = string;

export type RailwayPlatformFeatureFlagStatus = {
	flag?: RailwayPlatformFeatureFlag | null;
	rolloutPercentage?: number | null;
	status?: boolean | null;
	type?: RailwayPlatformFeatureFlagType | null;
};

export type RailwayPlatformFeatureFlagType = string;

export type RailwayPlatformStatus = {
	incident?: RailwayIncidentSummary | null;
	isStable?: boolean | null;
	maintenance?: RailwayMaintenanceSummary | null;
};

export type RailwayPluginStatus = string;

export type RailwayPluginSummary = {
	createdAt?: string | null;
	deletedAt?: string | null;
	deprecatedAt?: string | null;
	friendlyName?: string | null;
	id?: string | null;
	logsEnabled?: boolean | null;
	migrationDatabaseServiceId?: string | null;
	name?: RailwayPluginType | null;
	status?: RailwayPluginStatus | null;
};

export type RailwayPluginType = string;

export type RailwayPostgresHaUptimeClusterReport = {
	cluster?: RailwayPostgresHaUptimeClusterSummary | null;
	daily?: Array<RailwayPostgresHaUptimeDaySummary> | null;
	windows?: Array<RailwayPostgresHaUptimeWindowSummary> | null;
};

export type RailwayPostgresHaUptimeClusterSummary = {
	availability?: number | null;
	degradedMinutes?: number | null;
	downMinutes?: number | null;
	environmentId?: string | null;
	environmentName?: string | null;
	excludedMinutes?: number | null;
	/** The last local probe round's redundancy reading, as JSON: the verdict, its class, the reading's counts (expected/healthy replicas, etcd, HAProxy) and every member's probe outcome and role. Null until a round has run for the cluster. */
	lastRedundancyRound?: string | null;
	measuredMinutes?: number | null;
	platformDownMinutes?: number | null;
	projectId?: string | null;
	projectName?: string | null;
	recent?: string | null;
	redundancy?: number | null;
	redundancyMeasuredMinutes?: number | null;
	region?: string | null;
	/** The cluster's root Postgres service. */
	rootServiceId?: string | null;
	rootServiceName?: string | null;
	unknownMinutes?: number | null;
	upMinutes?: number | null;
	windows?: number | null;
	workspaceName?: string | null;
};

export type RailwayPostgresHaUptimeDaySummary = {
	day?: string | null;
	degradedMinutes?: number | null;
	downMinutes?: number | null;
	excludedMinutes?: number | null;
	measuredMinutes?: number | null;
	redundancyMeasuredMinutes?: number | null;
	unknownMinutes?: number | null;
	upMinutes?: number | null;
};

export type RailwayPostgresHaUptimeWindowSummary = {
	customerInitiated?: boolean | null;
	endedAt?: string | null;
	environmentId?: string | null;
	environmentName?: string | null;
	evidence?: string | null;
	failureClass?: string | null;
	id?: string | null;
	minutes?: number | null;
	projectId?: string | null;
	projectName?: string | null;
	redundancyClass?: string | null;
	/** The cluster's root Postgres service. */
	rootServiceId?: string | null;
	sli?: string | null;
	startedAt?: string | null;
};

export type RailwayPreferences = {
	buildFailedEmail?: boolean | null;
	changelogEmail?: boolean | null;
	communityEmail?: boolean | null;
	deployCrashedEmail?: boolean | null;
	ephemeralEnvironmentEmail?: boolean | null;
	id?: string | null;
	marketingEmail?: boolean | null;
	subprocessorUpdatesEmail?: boolean | null;
	templateQueueEmail?: boolean | null;
	usageEmail?: boolean | null;
};

export type RailwayPrivateNetwork = {
	createdAt?: string | null;
	deletedAt?: string | null;
	dnsName?: string | null;
	environmentId?: string | null;
	name?: string | null;
	networkId?: (number | string) | null;
	projectId?: string | null;
	publicId?: string | null;
	tags?: Array<string> | null;
};

export type RailwayPrivateNetworkEndpoint = {
	createdAt?: string | null;
	deletedAt?: string | null;
	dnsName?: string | null;
	newDnsName?: string | null;
	privateIps?: Array<string> | null;
	publicId?: string | null;
	serviceInstanceId?: string | null;
	syncStatus?: RailwayPrivateNetworkEndpointSyncStatus | null;
	tags?: Array<string> | null;
};

export type RailwayPrivateNetworkEndpointSyncStatus = string;

export type RailwayProject = {
	baseEnvironment?: RailwayEnvironmentSummary | null;
	baseEnvironmentId?: string | null;
	botPrEnvironments?: boolean | null;
	/** Whether environments created from now on start with Railway Authentication protecting services that have no setting of their own. Existing environments keep their own default. */
	clearanceDefaultForNewEnvironments?: boolean | null;
	/** The project's Railway Authentication tokens that still work (not revoked, not expired), newest first. */
	clearanceTokens?: Array<RailwayClearanceTokenSummary> | null;
	createdAt?: string | null;
	deletedAt?: string | null;
	description?: string | null;
	expiredAt?: string | null;
	featureFlags?: Array<RailwayActiveProjectFeatureFlag> | null;
	focusedPrEnvironments?: boolean | null;
	id?: string | null;
	isPublic?: boolean | null;
	isTempProject?: boolean | null;
	members?: Array<RailwayProjectMemberSummary> | null;
	name?: string | null;
	prDeploys?: boolean | null;
	/** The id of the oldest non-ephemeral environment for this project (typically production). Used by the dashboard to render project cards without fetching the full environments connection. */
	primaryEnvironmentId?: string | null;
	subscriptionPlanLimit?: RailwayJsonValue | null;
	subscriptionType?: RailwaySubscriptionPlanType | null;
	updatedAt?: string | null;
	/** Highest project-scoped role the current user holds on this project, through a direct project permission or an access group. Does not include the workspace role. */
	viewerRole?: RailwayProjectRole | null;
	workspace?: RailwayWorkspaceSummary | null;
	workspaceId?: string | null;
};

export type RailwayProjectComplianceInfo = {
	/** Permissions for each project member */
	memberPermissions?: Array<RailwayProjectMemberPermissionsInfoSummary> | null;
	projectId?: string | null;
	projectName?: string | null;
	/** Backup schedules for database services */
	serviceBackups?: Array<RailwayServiceBackupInfoSummary> | null;
	/** 2FA status for each project member */
	twoFactorMembers?: Array<RailwayProjectMemberTwoFactorInfoSummary> | null;
	workspaceId?: string | null;
};

/** One settled change in an environment: a system event or a terminal operation (patch, deploy, …). */
export type RailwayProjectHistoryEntry = {
	action?: string | null;
	/** Minimal payload for activity feed list rendering. Same trimming as Event.activityPayload. */
	activityPayload?: RailwayJsonValue | null;
	actor?: RailwayProjectOperationActorSummary | null;
	changes?: RailwayJsonValue | null;
	/** When the change settled. */
	createdAt?: string | null;
	id?: string | null;
	object?: string | null;
	/** '' for a plain event; e.g. 'patch', 'deploy' for operations. */
	operationKind?: string | null;
	/** '' for a plain event; 'applied' or 'failed' for operations. */
	outcome?: string | null;
	parentRef?: string | null;
	payload?: RailwayJsonValue | null;
	serviceIds?: Array<string> | null;
	severity?: RailwayEventSeverity | null;
	source?: string | null;
	workflowId?: string | null;
};

export type RailwayProjectInvitation = {
	email?: string | null;
	expiresAt?: string | null;
	id?: string | null;
	inviter?: RailwayProjectInvitationInviterSummary | null;
	isExpired?: boolean | null;
	project?: RailwayPublicProjectInformationSummary | null;
};

export type RailwayProjectInvitationInviterSummary = {
	email?: string | null;
	name?: string | null;
};

export type RailwayProjectMember = {
	avatar?: string | null;
	email?: string | null;
	id?: string | null;
	name?: string | null;
	role?: RailwayProjectRole | null;
};

export type RailwayProjectMemberPermissionsInfoSummary = {
	email?: string | null;
	name?: string | null;
	role?: RailwayProjectRole | null;
};

export type RailwayProjectMemberSummary = {
	avatar?: string | null;
	email?: string | null;
	id?: string | null;
	name?: string | null;
	role?: RailwayProjectRole | null;
};

export type RailwayProjectMemberTwoFactorInfoSummary = {
	email?: string | null;
	/** List of enabled 2FA methods (AUTHENTICATOR, PASSKEY) */
	enabledMethods?: Array<RailwayTwoFactorMethodCompliance> | null;
	name?: string | null;
	twoFactorAuthEnabled?: boolean | null;
};

export type RailwayProjectOperation = {
	actor?: RailwayProjectOperationActorSummary | null;
	changes?: RailwayJsonValue | null;
	/** In-flight child operations (e.g. deployments created by this patch). */
	children?: Array<RailwayProjectOperationSummary> | null;
	environmentId?: string | null;
	finishedAt?: string | null;
	id?: string | null;
	kind?: string | null;
	parentRef?: string | null;
	startedAt?: string | null;
	status?: RailwayOperationStatus | null;
	workflowId?: string | null;
};

export type RailwayProjectOperationActorSummary = {
	onBehalfOf?: string | null;
	principal?: string | null;
	surface?: string | null;
};

export type RailwayProjectOperationSummary = {
	changes?: RailwayJsonValue | null;
	environmentId?: string | null;
	finishedAt?: string | null;
	id?: string | null;
	kind?: string | null;
	parentRef?: string | null;
	startedAt?: string | null;
	status?: RailwayOperationStatus | null;
	workflowId?: string | null;
};

export type RailwayProjectPermission = {
	id?: string | null;
	projectId?: string | null;
	role?: RailwayProjectRole | null;
	userId?: string | null;
};

export type RailwayProjectResourceAccess = {
	customDomain?: RailwayAccessRuleSummary | null;
	databaseDeployment?: RailwayAccessRuleSummary | null;
	deployment?: RailwayAccessRuleSummary | null;
	environment?: RailwayAccessRuleSummary | null;
	sandbox?: RailwayAccessRuleSummary | null;
};

export type RailwayProjectRole = string;

export type RailwayProjectServiceUsagePage = {
	pageInfo?: RailwayProjectServiceUsagePageInfoSummary | null;
	usage?: Array<RailwayAggregatedUsageSummary> | null;
};

export type RailwayProjectServiceUsagePageInfoSummary = {
	endCursor?: string | null;
	hasNextPage?: boolean | null;
};

export type RailwayProjectSummary = {
	baseEnvironmentId?: string | null;
	botPrEnvironments?: boolean | null;
	/** Whether environments created from now on start with Railway Authentication protecting services that have no setting of their own. Existing environments keep their own default. */
	clearanceDefaultForNewEnvironments?: boolean | null;
	createdAt?: string | null;
	deletedAt?: string | null;
	description?: string | null;
	expiredAt?: string | null;
	featureFlags?: Array<RailwayActiveProjectFeatureFlag> | null;
	focusedPrEnvironments?: boolean | null;
	id?: string | null;
	isPublic?: boolean | null;
	isTempProject?: boolean | null;
	name?: string | null;
	prDeploys?: boolean | null;
	/** The id of the oldest non-ephemeral environment for this project (typically production). Used by the dashboard to render project cards without fetching the full environments connection. */
	primaryEnvironmentId?: string | null;
	subscriptionPlanLimit?: RailwayJsonValue | null;
	subscriptionType?: RailwaySubscriptionPlanType | null;
	updatedAt?: string | null;
	/** Highest project-scoped role the current user holds on this project, through a direct project permission or an access group. Does not include the workspace role. */
	viewerRole?: RailwayProjectRole | null;
	workspaceId?: string | null;
};

export type RailwayProjectToken = {
	createdAt?: string | null;
	displayToken?: string | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	id?: string | null;
	name?: string | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
};

export type RailwayProjectWorkspaceMemberSummary = {
	email?: string | null;
	/** List of enabled 2FA methods (AUTHENTICATOR, PASSKEY) */
	enabledMethods?: Array<RailwayTwoFactorMethodProjectWorkspace> | null;
	name?: string | null;
	twoFactorAuthEnabled?: boolean | null;
};

export type RailwayProjectWorkspaceMembersResponse = {
	members?: Array<RailwayProjectWorkspaceMemberSummary> | null;
	projectId?: string | null;
	projectName?: string | null;
	workspaceId?: string | null;
};

export type RailwayPublicProjectInformationSummary = {
	id?: string | null;
	name?: string | null;
};

/** One of: InviteCode, ProjectInvitation. */
export type RailwayPublicProjectInvitation = {
	__typename?: string | null;
};

export type RailwayPublicStats = {
	totalDeploymentsLastMonth?: number | null;
	totalLogsLastMonth?: (number | string) | null;
	totalProjects?: number | null;
	totalRequestsLastMonth?: (number | string) | null;
	totalServices?: number | null;
	totalUsers?: number | null;
};

export type RailwayPurgeOnDeploy = string;

export type RailwayRailwayDomain = {
	autoRenewEnabled?: boolean | null;
	connectedServiceInstances?: Array<RailwayConnectedServiceInstanceSummary> | null;
	createdAt?: string | null;
	domain?: string | null;
	id?: string | null;
	/** Authoritative nameservers currently delegated for this domain at the registrar. */
	nameservers?: RailwayRailwayDomainNameserversSummary | null;
	nextBillingDate?: string | null;
	purchasePrice?: number | null;
	registrationYears?: number | null;
	renewalPrice?: number | null;
	status?: RailwayRailwayDomainStatus | null;
	workspaceId?: string | null;
	workspaceName?: string | null;
};

export type RailwayRailwayDomainDnsRecord = {
	answer?: string | null;
	domainName?: string | null;
	fqdn?: string | null;
	host?: string | null;
	id?: number | null;
	priority?: number | null;
	ttl?: number | null;
	type?: RailwayRailwayDomainDnsRecordType | null;
};

export type RailwayRailwayDomainDnsRecordType = string;

export type RailwayRailwayDomainEmailForwardingEligibility = string;

export type RailwayRailwayDomainEmailForwardingLimits = {
	maxAliases?: number | null;
};

export type RailwayRailwayDomainEmailForwardingRule = {
	/** Local part of the forwarded address, without the domain. */
	alias?: string | null;
	/** The external inbox mail for this alias is delivered to. */
	destination?: string | null;
};

/** What removing forwarding took out of the zone. */
export type RailwayRailwayDomainEmailForwardingTeardown = {
	addressesRemoved?: number | null;
	mailRecordsRemoved?: number | null;
};

export type RailwayRailwayDomainNameservers = {
	/** True when the domain is delegated to Name.com's nameservers (Railway-managed DNS). */
	isDefault?: boolean | null;
	nameservers?: Array<string> | null;
};

export type RailwayRailwayDomainNameserversSummary = {
	/** True when the domain is delegated to Name.com's nameservers (Railway-managed DNS). */
	isDefault?: boolean | null;
	nameservers?: Array<string> | null;
};

export type RailwayRailwayDomainStatus = string;

export type RailwayReferralInfo = {
	code?: string | null;
	id?: string | null;
	referralStats?: RailwayReferralStatsSummary | null;
	status?: string | null;
};

export type RailwayReferralStatsSummary = {
	credited?: number | null;
	pending?: number | null;
};

export type RailwayReferralStatus = string;

export type RailwayReferralUserSummary = {
	code?: string | null;
	id?: string | null;
	status?: RailwayReferralStatus | null;
};

export type RailwayRegion = {
	/** Region country */
	country?: string | null;
	/** Region ID (airport code) */
	id?: string | null;
	location?: string | null;
	name?: string | null;
	region?: string | null;
	workspaceId?: string | null;
};

export type RailwayRegistrationStatus = string;

/** The repo config file as of the most recent deployment that read it. */
export type RailwayResolvedFileConfigSummary = {
	/** Commit the config was read from. */
	commitHash?: string | null;
	/** Path of the config file that was read, or null when the repo has none. */
	configFile?: string | null;
	/** Deployment this config was read from. */
	deploymentId?: string | null;
	/** Manifest parsed from the config file. Empty means the repo has no config file. */
	fileManifest?: RailwayJsonValue | null;
	/** Manifest property path to its location within the config file. */
	propertyFileMapping?: RailwayJsonValue | null;
	repo?: string | null;
	/** When that deployment was created. Surface this when it is older than the latest deployment, so a stale config is not presented as current. */
	resolvedAt?: string | null;
};

export type RailwayResourceAccess = {
	deployment?: RailwayAccessRuleSummary | null;
	project?: RailwayAccessRuleSummary | null;
};

export type RailwayRestartPolicyType = string;

export type RailwaySSHSignupClaimableWorkspaceSummary = {
	id?: string | null;
	name?: string | null;
};

export type RailwaySSHSignupInfo = {
	claimableWorkspaces?: Array<RailwaySSHSignupClaimableWorkspaceSummary> | null;
	fingerprint?: string | null;
	origin?: RailwaySSHSignupOriginSummary | null;
	trial?: RailwaySSHSignupTrialSummary | null;
};

/** Where the terminal that started an SSH signup connected from. */
export type RailwaySSHSignupOriginSummary = {
	ip?: string | null;
	requestedAt?: string | null;
	/** Whether this request comes from the same IP as the terminal. False when the terminal's IP is unknown. */
	sameNetwork?: boolean | null;
};

/** The anonymous trial box the offered SSH key currently owns; approving the signup claims it. */
export type RailwaySSHSignupTrialSummary = {
	buildExpiresAt?: string | null;
	cloudAgentId?: string | null;
	projectId?: string | null;
	projectName?: string | null;
};

export type RailwaySandbox = {
	createdAt?: string | null;
	/** Railway-provided public HTTP domains whose routes have been published. */
	domains?: Array<RailwaySandboxDomainSummary> | null;
	environmentId?: string | null;
	id?: string | null;
	/** Minutes of inactivity before the sandbox is destroyed. 0 means it never idles out; null means unknown, including for a destroyed sandbox. */
	idleTimeoutMinutes?: number | null;
	networkIsolation?: RailwaySandboxNetworkIsolation | null;
	/** Hostname on the environment's private network, e.g. <name>.railway.internal, reachable on any port from services in that environment. Null when the VM is isolated or its private endpoint isn't registered yet. */
	privateDomain?: string | null;
	region?: string | null;
	status?: RailwaySandboxStatus | null;
};

/** A bootable snapshot of a sandbox's disk, scoped to an environment. Built from a template recipe or captured from a running sandbox. */
export type RailwaySandboxCheckpoint = {
	createdAt?: string | null;
	environmentId?: string | null;
	id?: string | null;
	/** The checkpoint's identity within the environment (same as id): a recipe content hash for a built template, or the user-given name for one captured from a sandbox. */
	key?: string | null;
};

/** One public domain on a sandbox. */
export type RailwaySandboxDomainSummary = {
	/** Resolved FQDN. */
	domain?: string | null;
	/** Target port on the sandbox this domain routes to. */
	port?: number | null;
	/** Label prefix requested when the sandbox was created. */
	prefix?: string | null;
};

/** Controls a sandbox's access to the environment's private network. */
export type RailwaySandboxNetworkIsolation = string;

/** A resumable session inside a sandbox: an interactive shell or a one-off exec command. */
export type RailwaySandboxSession = {
	/** Whether a client is currently connected. */
	attached?: boolean | null;
	/** The command being run; empty for an interactive shell. */
	command?: string | null;
	createdAt?: string | null;
	/** For an interactive shell, whether a foreground program currently holds the terminal. Null otherwise, or when the runtime can't report it. */
	foregroundActive?: boolean | null;
	kind?: RailwaySandboxSessionKind | null;
	/** Stable session name; reconnect/attach by this. */
	name?: string | null;
	runState?: RailwaySandboxSessionRunStateSummary | null;
};

/** Whether a session is an interactive shell or a one-off exec command. */
export type RailwaySandboxSessionKind = string;

/** A session's process lifecycle. */
export type RailwaySandboxSessionRunStateSummary = {
	/** Process exit code; only meaningful once running is false. */
	exitCode?: number | null;
	/** When the process exited; null while running. */
	exitedAt?: string | null;
	/** Whether the process is still alive. */
	running?: boolean | null;
};

export type RailwaySandboxStatus = string;

/** The state of a template build, derived from its workflow and the existence of its checkpoint. READY means the checkpoint exists and can be booted. */
export type RailwaySandboxTemplateBuild = {
	environmentId?: string | null;
	/** The template's resolved-content hash. */
	id?: string | null;
	status?: RailwaySandboxTemplateBuildStatus | null;
};

export type RailwaySandboxTemplateBuildStatus = string;

export type RailwayService = {
	createdAt?: string | null;
	deletedAt?: string | null;
	featureFlags?: Array<RailwayActiveServiceFeatureFlag> | null;
	groupId?: string | null;
	/** Whether this service has hidden registry credentials from a template. When true, the credentials are stored in the template and used during deployment. */
	hasHiddenRegistryCredentialsFromTemplate?: boolean | null;
	icon?: string | null;
	id?: string | null;
	/** Whether this service has an active restriction that limits its capabilities. */
	isRestricted?: boolean | null;
	/** Null for an ordinary service. */
	kind?: RailwayServiceKind | null;
	name?: string | null;
	/** The takedown notice blocking deployment, readable by workspace members and staff. Public-project visibility does not grant notice access. */
	pendingTakedownAcknowledgment?: RailwayServiceTakedownAcknowledgmentSummary | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
	/** Every takedown requirement this service has had, newest first, outstanding or cleared. Retained after the service deploys again so the history survives the redeploy it permitted. */
	takedownAcknowledgments?: Array<RailwayServiceTakedownAcknowledgmentSummary> | null;
	templateId?: string | null;
	templateServiceId?: string | null;
	templateThreadSlug?: string | null;
	updatedAt?: string | null;
};

export type RailwayServiceBackupInfoSummary = {
	/** List of enabled backup schedule kinds (DAILY, WEEKLY, MONTHLY) */
	schedules?: Array<RailwayVolumeInstanceBackupScheduleKind> | null;
	serviceId?: string | null;
	serviceName?: string | null;
};

export type RailwayServiceDomain = {
	createdAt?: string | null;
	deletedAt?: string | null;
	domain?: string | null;
	edgeId?: string | null;
	environmentId?: string | null;
	id?: string | null;
	newDomainName?: string | null;
	newHostLabel?: string | null;
	projectId?: string | null;
	serviceId?: string | null;
	suffix?: string | null;
	syncStatus?: RailwayServiceDomainSyncStatus | null;
	targetPort?: number | null;
	updatedAt?: string | null;
};

export type RailwayServiceDomainSummary = {
	createdAt?: string | null;
	deletedAt?: string | null;
	domain?: string | null;
	edgeId?: string | null;
	environmentId?: string | null;
	id?: string | null;
	newDomainName?: string | null;
	newHostLabel?: string | null;
	projectId?: string | null;
	serviceId?: string | null;
	suffix?: string | null;
	syncStatus?: RailwayServiceDomainSyncStatus | null;
	targetPort?: number | null;
	updatedAt?: string | null;
};

export type RailwayServiceDomainSyncStatus = string;

export type RailwayServiceInstance = {
	/** All currently active (deployed and running) deployments for this service instance */
	activeDeployments?: Array<RailwayDeploymentSummary> | null;
	/** Instrument the service's processes with eBPF (OBI) for supported runtimes, no code changes. Only active while tracingEnabled is true. */
	autoInstrumentationEnabled?: boolean | null;
	buildCommand?: string | null;
	builder?: RailwayBuilder | null;
	/** This service's own Railway Authentication setting. Null means no setting of its own: it follows the environment's default (see clearanceEffective). */
	clearance?: boolean | null;
	/** Whether Railway Authentication protects this service's HTTP domains: its own setting, else its environment's default. */
	clearanceEffective?: boolean | null;
	createdAt?: string | null;
	cronSchedule?: string | null;
	deletedAt?: string | null;
	dockerfilePath?: string | null;
	drainingSeconds?: number | null;
	edgeConfig?: RailwayEdgeConfigSummary | null;
	environmentId?: string | null;
	/** Whether any deployment was ever created for this service instance, including deployments that have since been removed. Distinguishes a service that was torn down (all deployments removed) from one that has never deployed — latestDeployment and activeDeployments are null/empty for both. */
	hasEverDeployed?: boolean | null;
	healthcheckPath?: string | null;
	healthcheckTimeout?: number | null;
	hideUnhealthyReplicas?: boolean | null;
	id?: string | null;
	ipv6EgressEnabled?: boolean | null;
	isUpdatable?: boolean | null;
	/** The most recent deployment for this service instance */
	latestDeployment?: RailwayDeploymentSummary | null;
	nextCronRunAt?: string | null;
	nixpacksPlan?: RailwayJsonValue | null;
	numReplicas?: number | null;
	overlapSeconds?: number | null;
	preDeployCommand?: RailwayJsonValue | null;
	preDeployTimeoutSeconds?: number | null;
	railpackInfo?: RailwayJsonValue | null;
	railwayConfigFile?: string | null;
	region?: string | null;
	/** Config read from the repo's config file, taken from the most recent deployment that actually read it. Null when no deployment has resolved a config file yet. An empty `fileManifest` is a real answer and means the repo has no config file — do not read this off the latest deployment instead, since… */
	resolvedFileConfig?: RailwayResolvedFileConfigSummary | null;
	restartPolicyMaxRetries?: number | null;
	restartPolicyType?: RailwayRestartPolicyType | null;
	rootDirectory?: string | null;
	service?: RailwayServiceSummary | null;
	serviceId?: string | null;
	serviceName?: string | null;
	sleepApplication?: boolean | null;
	source?: RailwayServiceSourceSummary | null;
	startCommand?: string | null;
	/** Trace requests to the service in this environment: the edge records a span per client-facing request to its domains and the next deploy provides the OpenTelemetry exporter variables. */
	tracingEnabled?: boolean | null;
	updatedAt?: string | null;
	upstreamUrl?: string | null;
	watchPatterns?: Array<string> | null;
};

export type RailwayServiceInstanceAutoDeployStatus = {
	canEnable?: boolean | null;
	enabled?: boolean | null;
	reason?: string | null;
};

export type RailwayServiceInstanceAutoDeployUpdateResult = {
	enabled?: boolean | null;
};

/** What a service is, when it isn't an ordinary service. A Website's builds upload a release that the edge serves. */
export type RailwayServiceKind = string;

export type RailwayServiceSourceSummary = {
	image?: string | null;
	repo?: string | null;
};

export type RailwayServiceSummary = {
	createdAt?: string | null;
	deletedAt?: string | null;
	featureFlags?: Array<RailwayActiveServiceFeatureFlag> | null;
	groupId?: string | null;
	/** Whether this service has hidden registry credentials from a template. When true, the credentials are stored in the template and used during deployment. */
	hasHiddenRegistryCredentialsFromTemplate?: boolean | null;
	icon?: string | null;
	id?: string | null;
	/** Whether this service has an active restriction that limits its capabilities. */
	isRestricted?: boolean | null;
	/** Null for an ordinary service. */
	kind?: RailwayServiceKind | null;
	name?: string | null;
	projectId?: string | null;
	templateId?: string | null;
	templateServiceId?: string | null;
	templateThreadSlug?: string | null;
	updatedAt?: string | null;
};

/** A takedown notice the customer must acknowledge before the service can deploy again. */
export type RailwayServiceTakedownAcknowledgment = {
	acknowledgedAt?: string | null;
	/** The person who attested. Retained after the service deploys again, so the record outlives the gate it cleared. */
	acknowledgedBy?: RailwayUserSummarySummary | null;
	/** The attestation exactly as it was worded when it was confirmed. */
	acknowledgedStatement?: string | null;
	clearedAt?: string | null;
	customerNotice?: string | null;
	/** False when no customer-visible notice beyond the dashboard page was recorded, so the UI can say so rather than implying the original complaint is linked. */
	hasExternalNotice?: boolean | null;
	/** Customer-safe statement of what happened and why. */
	headline?: string | null;
	id?: string | null;
	/** What the customer has to do before deploying again. */
	instruction?: string | null;
	/** The service teardown has not yet completed; acknowledgment remains unavailable. */
	isApplying?: boolean | null;
	noticeKind?: RailwayTakedownNoticeKind | null;
	/** Where to read the notice. Always resolvable: it falls back to the dashboard restriction detail page. */
	noticeUrl?: string | null;
	restrictionId?: string | null;
	/** The attestation the customer must explicitly confirm. Opening or reading the notice is not acknowledgment. */
	statement?: string | null;
	status?: RailwayTakedownAcknowledgmentStatus | null;
	takenDownAt?: string | null;
};

/** A takedown notice the customer must acknowledge before the service can deploy again. */
export type RailwayServiceTakedownAcknowledgmentSummary = {
	acknowledgedAt?: string | null;
	/** The attestation exactly as it was worded when it was confirmed. */
	acknowledgedStatement?: string | null;
	clearedAt?: string | null;
	customerNotice?: string | null;
	/** False when no customer-visible notice beyond the dashboard page was recorded, so the UI can say so rather than implying the original complaint is linked. */
	hasExternalNotice?: boolean | null;
	/** Customer-safe statement of what happened and why. */
	headline?: string | null;
	id?: string | null;
	/** What the customer has to do before deploying again. */
	instruction?: string | null;
	/** The service teardown has not yet completed; acknowledgment remains unavailable. */
	isApplying?: boolean | null;
	noticeKind?: RailwayTakedownNoticeKind | null;
	/** Where to read the notice. Always resolvable: it falls back to the dashboard restriction detail page. */
	noticeUrl?: string | null;
	restrictionId?: string | null;
	/** The attestation the customer must explicitly confirm. Opening or reading the notice is not acknowledgment. */
	statement?: string | null;
	status?: RailwayTakedownAcknowledgmentStatus | null;
	takenDownAt?: string | null;
};

/** Whether a service's requests are producing spans, per exporting hop. The edge tracing a request says nothing about the app behind it. */
export type RailwayServiceTracingStatus = {
	/** When the edge last exported a span for a request to the service; null when it never has within retention */
	lastEdgeSpanAt?: string | null;
	/** When the service's own app last exported a span; null when it never has within retention */
	lastServiceSpanAt?: string | null;
	serviceId?: string | null;
};

export type RailwaySession = {
	createdAt?: string | null;
	expiredAt?: string | null;
	id?: string | null;
	isCurrent?: boolean | null;
	name?: string | null;
	type?: RailwaySessionType | null;
	updatedAt?: string | null;
};

export type RailwaySessionType = string;

export type RailwaySignal = {
	createdAt?: string | null;
	createdBy?: string | null;
	default?: RailwayJsonValue | null;
	id?: string | null;
	name?: string | null;
	owner?: string | null;
	rules?: RailwayJsonValue | null;
	type?: RailwaySignalType | null;
	updatedAt?: string | null;
	version?: (number | string) | null;
	writableBy?: Array<string> | null;
};

export type RailwaySignalChange = {
	authorId?: string | null;
	createdAt?: string | null;
	id?: string | null;
	kind?: RailwaySignalChangeKind | null;
	payload?: RailwayJsonValue | null;
	prevState?: RailwayJsonValue | null;
	seq?: (number | string) | null;
	signalId?: string | null;
};

export type RailwaySignalChangeKind = string;

export type RailwaySignalEvaluation = {
	reason?: RailwaySignalEvaluationReason | null;
	trace?: RailwayJsonValue | null;
	value?: RailwayJsonValue | null;
};

export type RailwaySignalEvaluationReason = string;

export type RailwaySignalType = string;

export type RailwaySimilarTemplateSummary = {
	code?: string | null;
	createdAt?: string | null;
	deploys?: number | null;
	description?: string | null;
	health?: number | null;
	image?: string | null;
	name?: string | null;
	userId?: string | null;
	workspaceId?: string | null;
};

export type RailwaySshPublicKey = {
	createdAt?: string | null;
	fingerprint?: string | null;
	id?: string | null;
	name?: string | null;
	publicKey?: string | null;
	updatedAt?: string | null;
	userId?: string | null;
	workspaceId?: string | null;
};

export type RailwaySubscriptionPlanType = string;

export type RailwaySubscriptionState = string;

export type RailwayTCPProxy = {
	applicationPort?: number | null;
	createdAt?: string | null;
	deletedAt?: string | null;
	domain?: string | null;
	environmentId?: string | null;
	id?: string | null;
	proxyPort?: number | null;
	serviceId?: string | null;
	syncStatus?: RailwayTCPProxySyncStatus | null;
	updatedAt?: string | null;
};

export type RailwayTCPProxySyncStatus = string;

export type RailwayTakedownAcknowledgmentStatus = string;

/** Which complaint a takedown answered. OTHER keeps generic wording rather than asserting a legal basis Railway did not record. */
export type RailwayTakedownNoticeKind = string;

export type RailwayTeamRole = string;

export type RailwayTemplate = {
	activeProjects?: number | null;
	canvasConfig?: RailwayJsonValue | null;
	category?: string | null;
	code?: string | null;
	communityThreadSlug?: string | null;
	createdAt?: string | null;
	creator?: RailwayTemplateCreatorSummary | null;
	demoProjectId?: string | null;
	description?: string | null;
	guides?: RailwayTemplateGuideSummary | null;
	health?: number | null;
	id?: string | null;
	image?: string | null;
	isApproved?: boolean | null;
	isOuterEdge?: boolean | null;
	isV2Template?: boolean | null;
	isVerified?: boolean | null;
	languages?: Array<string> | null;
	maintainer?: RailwayMaintainerWorkspaceSummary | null;
	name?: string | null;
	projects?: number | null;
	/** This template's workspace's publishing limits and usage. Null for anyone but the template's owner, and for a template with no workspace. */
	publishingAllowance?: RailwayTemplatePublishingAllowanceSummary | null;
	/** The active restriction stopping this workspace publishing templates, so a restricted author can be sent to the page that explains it and takes the appeal. Null when publishing is not restricted, and for anyone but the template's owner: the `template` query is public, and whether a workspace is… */
	publishingRestrictionId?: string | null;
	readme?: string | null;
	recentProjects?: number | null;
	serializedConfig?: RailwayJsonValue | null;
	similarTemplates?: Array<RailwaySimilarTemplateSummary> | null;
	status?: RailwayTemplateStatus | null;
	supportHealthMetrics?: RailwayJsonValue | null;
	tags?: Array<string> | null;
	totalPayout?: number | null;
	updatedAt?: string | null;
	workspaceId?: string | null;
};

export type RailwayTemplateCreatorSummary = {
	avatar?: string | null;
	hasPublicProfile?: boolean | null;
	name?: string | null;
	username?: string | null;
};

export type RailwayTemplateDeployPayload = {
	operationId?: string | null;
	projectId?: string | null;
	workflowId?: string | null;
};

export type RailwayTemplateGuideSummary = {
	post?: string | null;
	video?: string | null;
};

export type RailwayTemplateMetrics = {
	activeDeployments?: number | null;
	deploymentsLast90Days?: number | null;
	earningsLast30Days?: number | null;
	earningsLast90Days?: number | null;
	eligibleForSupportBonus?: boolean | null;
	supportHealth?: number | null;
	templateHealth?: number | null;
	totalDeployments?: number | null;
	totalEarnings?: number | null;
};

/** How many templates this template's workspace may have live, and how many it has. New publishes are also rate limited per day; that limit is not reported here and surfaces as an error when hit. See https://docs.railway.com/templates/publish-and-share#publishing-limits */
export type RailwayTemplatePublishingAllowanceSummary = {
	/** Why the live limit stops this template being published, or null when it doesn't. Always null for a template that is already live: limits gate going live, not edits. */
	blockedReason?: string | null;
	/** Distinct other workspaces that have deployed any of this workspace's templates. */
	deployingWorkspaces?: number | null;
	/** Deploying workspaces it takes to raise the live limit by one. */
	deployingWorkspacesPerExtraLive?: number | null;
	/** Null when exempt. */
	liveLimit?: number | null;
	liveTemplates?: number | null;
	status?: RailwayTemplatePublishingStatus | null;
	workspaceAgeDays?: number | null;
};

export type RailwayTemplatePublishingStatus = string;

export type RailwayTemplateSearchResult = {
	code?: string | null;
	creatorName?: string | null;
	deploymentCount?: number | null;
	description?: string | null;
	healthScore?: number | null;
	id?: string | null;
	image?: string | null;
	isVerified?: boolean | null;
	name?: string | null;
};

export type RailwayTemplateStatus = string;

/** One span of a trace */
export type RailwayTraceSpan = {
	/** Which hop exported the span: edge, proxy or service */
	component?: string | null;
	deploymentId?: string | null;
	deploymentInstanceId?: string | null;
	durationMs?: number | null;
	events?: Array<RailwayTraceSpanEventSummary> | null;
	/** INTERNAL, SERVER, CLIENT, PRODUCER, CONSUMER or UNSPECIFIED */
	kind?: string | null;
	links?: Array<RailwayTraceSpanLinkSummary> | null;
	name?: string | null;
	/** Absent on a root span */
	parentSpanId?: string | null;
	/** Resource attributes as exported, without the railway.* keys Railway promotes into typed fields, and with cloud.region as the airport code of the region (edge/<pop> on an edge span) */
	resourceAttributes?: RailwayJsonValue | null;
	/** Railway service the span belongs to, when known */
	serviceId?: string | null;
	/** The exporter's service.name resource attribute */
	serviceName?: string | null;
	spanAttributes?: RailwayJsonValue | null;
	/** 16 lower-case hex characters */
	spanId?: string | null;
	/** ISO timestamp */
	startedAt?: string | null;
	/** UNSET, OK or ERROR */
	statusCode?: string | null;
	statusMessage?: string | null;
	traceId?: string | null;
};

/** A timestamped event on a span */
export type RailwayTraceSpanEventSummary = {
	attributes?: RailwayJsonValue | null;
	name?: string | null;
	timestamp?: string | null;
};

/** A link from a span to a span in another trace */
export type RailwayTraceSpanLinkSummary = {
	spanId?: string | null;
	traceId?: string | null;
};

/** One trace of an environment: the request as a whole, summarised from its spans */
export type RailwayTraceSummary = {
	/** From the earliest span start to the latest span end */
	durationMs?: number | null;
	/** Spans with an error status */
	errorCount?: number | null;
	/** Whether the edge exported any span of the trace */
	hasEdge?: boolean | null;
	/** Which hop exported the root span: edge (hikari), proxy (tcp-proxy) or service */
	rootComponent?: string | null;
	/** The root span's server.address, when it set one */
	rootServerAddress?: string | null;
	/** Railway service the root span belongs to */
	rootServiceId?: string | null;
	/** The root span's service.name */
	rootServiceName?: string | null;
	/** Name of the root span, or of the earliest span when the root is missing */
	rootSpanName?: string | null;
	/** The root span's url.path, when it set one */
	rootUrlPath?: string | null;
	/** service.name of the earliest span a service exported; null when the request never reached one */
	serviceName?: string | null;
	spanCount?: number | null;
	/** Start of the earliest span (ISO timestamp) */
	startedAt?: string | null;
	/** W3C trace id, 32 lower-case hex characters */
	traceId?: string | null;
};

export type RailwayTrustedDomain = {
	autoJoinEnabled?: boolean | null;
	domainName?: string | null;
	id?: string | null;
	role?: string | null;
	status?: RailwayTrustedDomainStatus | null;
	verificationData?: RailwayTrustedDomainVerificationDataSummary | null;
	verificationType?: string | null;
	workspaceId?: string | null;
};

export type RailwayTrustedDomainStatus = string;

export type RailwayTrustedDomainVerificationDataSummary = {
	dnsHost?: string | null;
	token?: string | null;
};

export type RailwayTwoFactorInfo = {
	hasRecoveryCodes?: boolean | null;
	isVerified?: boolean | null;
};

export type RailwayTwoFactorMethodCompliance = string;

export type RailwayTwoFactorMethodProjectWorkspace = string;

export type RailwayUser = {
	agreedFairUse?: boolean | null;
	apiTokenRateLimit?: RailwayApiTokenRateLimitSummary | null;
	avatar?: string | null;
	createdAt?: string | null;
	email?: string | null;
	featureFlags?: Array<RailwayActiveFeatureFlag> | null;
	githubProviderId?: string | null;
	githubUsername?: string | null;
	has2FA?: boolean | null;
	hasPasskeys?: boolean | null;
	id?: string | null;
	isAdmin?: boolean | null;
	isConductor?: boolean | null;
	isVerified?: boolean | null;
	lastLogin?: string | null;
	name?: string | null;
	profile?: RailwayUserProfileSummary | null;
	registrationStatus?: RailwayRegistrationStatus | null;
	riskLevel?: number | null;
	termsAgreedOn?: string | null;
	username?: string | null;
	/** Workspaces user is member of */
	workspaces?: Array<RailwayWorkspaceSummary> | null;
};

export type RailwayUserProfileResponse = {
	avatar?: string | null;
	createdAt?: string | null;
	id?: string | null;
	name?: string | null;
	profile?: RailwayUserProfileSummary | null;
	totalDeploys?: number | null;
	username?: string | null;
};

export type RailwayUserProfileSummary = {
	bio?: string | null;
	isPublic?: boolean | null;
	website?: string | null;
};

export type RailwayUserSummarySummary = {
	avatar?: string | null;
	email?: string | null;
	id?: string | null;
	name?: string | null;
	username?: string | null;
};

export type RailwayVariable = {
	createdAt?: string | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	id?: string | null;
	isSealed?: boolean | null;
	name?: string | null;
	plugin?: RailwayPluginSummary | null;
	references?: Array<string> | null;
	service?: RailwayServiceSummary | null;
	serviceId?: string | null;
	updatedAt?: string | null;
};

export type RailwayVolume = {
	createdAt?: string | null;
	id?: string | null;
	name?: string | null;
	project?: RailwayProjectSummary | null;
	projectId?: string | null;
};

export type RailwayVolumeInstance = {
	createdAt?: string | null;
	currentSizeMB?: number | null;
	deletedAt?: string | null;
	environment?: RailwayEnvironmentSummary | null;
	environmentId?: string | null;
	externalId?: string | null;
	id?: string | null;
	isPendingDeletion?: boolean | null;
	mountPath?: string | null;
	region?: string | null;
	service?: RailwayServiceSummary | null;
	serviceId?: string | null;
	sizeMB?: number | null;
	state?: RailwayVolumeState | null;
	volume?: RailwayVolumeSummary | null;
	volumeId?: string | null;
};

export type RailwayVolumeInstanceBackup = {
	createdAt?: string | null;
	creatorId?: string | null;
	expiresAt?: string | null;
	externalId?: string | null;
	id?: string | null;
	name?: string | null;
	referencedMB?: number | null;
	scheduleId?: string | null;
	usedMB?: number | null;
	volumeInstanceSizeMB?: number | null;
};

export type RailwayVolumeInstanceBackupSchedule = {
	createdAt?: string | null;
	cron?: string | null;
	id?: string | null;
	kind?: RailwayVolumeInstanceBackupScheduleKind | null;
	name?: string | null;
	retentionSeconds?: number | null;
};

export type RailwayVolumeInstanceBackupScheduleKind = string;

export type RailwayVolumeState = string;

export type RailwayVolumeSummary = {
	createdAt?: string | null;
	id?: string | null;
	name?: string | null;
	projectId?: string | null;
};

export type RailwayWithdrawalPlatformTypes = string;

export type RailwayWorkflowId = {
	/** Why MySQL archive continuity could not be verified. The restore remains allowed and its image performs the authoritative replay check. */
	archiveContinuityUnverifiedReason?: string | null;
	/** For MySQL PITR restores, whether archive continuity was verified before the workflow started. */
	archiveContinuityVerified?: boolean | null;
	workflowId?: string | null;
};

export type RailwayWorkflowResult = {
	error?: string | null;
	status?: RailwayWorkflowStatus | null;
};

export type RailwayWorkflowStatus = string;

export type RailwayWorkspace = {
	adoptionHistory?: Array<RailwayAdoptionInfoSummary> | null;
	adoptionLevel?: number | null;
	apiTokenRateLimit?: RailwayApiTokenRateLimitSummary | null;
	avatar?: string | null;
	createdAt?: string | null;
	customer?: RailwayCustomerSummary | null;
	discordRole?: string | null;
	/** Whether 2FA enforcement is enabled for this workspace. */
	has2FAEnforcement?: boolean | null;
	/** Whether automatic deployment diagnosis is enabled for this workspace. */
	hasAutomaticDiagnosis?: boolean | null;
	/** Whether this workspace has access to guardrails policies. */
	hasGuardrailsAccess?: boolean | null;
	/** Whether this workspace has a signed HIPAA Business Associate Agreement, from either the legacy hasBAA flag or the HIPAA_BAA spend commitment feature. */
	hasHipaaBAA?: boolean | null;
	hasSAML?: boolean | null;
	id?: string | null;
	members?: Array<RailwayWorkspaceMemberSummary> | null;
	name?: string | null;
	partnerProfile?: RailwayPartnerProfileSummary | null;
	plan?: RailwayPlan | null;
	preferredRegion?: string | null;
	/** Total number of projects in this workspace. Used by the dashboard to show an exact count without paginating through every project. */
	projectCount?: number | null;
	/** Whether the current user's access is redacted due to pending 2FA requirement. Returns true if the user is a workspace member, workspace has 2FA enforcement enabled, and the current user needs to enable 2FA. */
	redactedDueTo2FAPending?: boolean | null;
	referredUsers?: Array<RailwayReferralUserSummary> | null;
	restrictProjectVisibilityToGroups?: boolean | null;
	slackChannelId?: string | null;
	subscriptionPlanLimit?: RailwayJsonValue | null;
	updatedAt?: string | null;
	/** Get a list of user emails in the workspace who do not have verified 2FA enabled. Returns an empty array if all users have 2FA enabled. */
	usersWithout2FA?: Array<string> | null;
};

export type RailwayWorkspaceIdPConnectionStatus = string;

export type RailwayWorkspaceIdPConnectionSummary = {
	createdAt?: string | null;
	provider?: string | null;
	status?: RailwayWorkspaceIdPConnectionStatus | null;
	updatedAt?: string | null;
};

export type RailwayWorkspaceIdentityProvider = {
	connection?: RailwayWorkspaceIdPConnectionSummary | null;
	createdAt?: string | null;
	enforcementEnabledAt?: string | null;
	id?: string | null;
	updatedAt?: string | null;
	workspace?: RailwayWorkspaceSummary | null;
	workspaceId?: string | null;
};

export type RailwayWorkspaceMemberSummary = {
	avatar?: string | null;
	email?: string | null;
	/** Only retrieved if requested by an admin */
	featureFlags?: Array<RailwayActiveFeatureFlag> | null;
	id?: string | null;
	name?: string | null;
	role?: RailwayTeamRole | null;
	/** Only retrieved if requested by an admin */
	twoFactorAuthEnabled?: boolean | null;
};

export type RailwayWorkspacePolicy = {
	id?: string | null;
	restrictDeploysToAllowedSources?: boolean | null;
	restrictPublicTcpProxies?: boolean | null;
	restrictRailwayDomainGeneration?: boolean | null;
};

export type RailwayWorkspacePolicyDeploySourceAllowlist = {
	addedBy?: RailwayUserSummarySummary | null;
	createdAt?: string | null;
	id?: string | null;
	sourceIcon?: string | null;
	sourceId?: string | null;
	sourceName?: string | null;
	sourceType?: RailwayWorkspacePolicyDeploySourceType | null;
};

export type RailwayWorkspacePolicyDeploySourceType = string;

export type RailwayWorkspacePolicySelectableDeploySource = {
	sourceIcon?: string | null;
	sourceId?: string | null;
	sourceName?: string | null;
	sourceType?: RailwayWorkspacePolicyDeploySourceType | null;
};

export type RailwayWorkspaceSummary = {
	adoptionLevel?: number | null;
	avatar?: string | null;
	createdAt?: string | null;
	discordRole?: string | null;
	/** Whether 2FA enforcement is enabled for this workspace. */
	has2FAEnforcement?: boolean | null;
	/** Whether automatic deployment diagnosis is enabled for this workspace. */
	hasAutomaticDiagnosis?: boolean | null;
	/** Whether this workspace has access to guardrails policies. */
	hasGuardrailsAccess?: boolean | null;
	/** Whether this workspace has a signed HIPAA Business Associate Agreement, from either the legacy hasBAA flag or the HIPAA_BAA spend commitment feature. */
	hasHipaaBAA?: boolean | null;
	hasSAML?: boolean | null;
	id?: string | null;
	name?: string | null;
	plan?: RailwayPlan | null;
	preferredRegion?: string | null;
	/** Total number of projects in this workspace. Used by the dashboard to show an exact count without paginating through every project. */
	projectCount?: number | null;
	/** Whether the current user's access is redacted due to pending 2FA requirement. Returns true if the user is a workspace member, workspace has 2FA enforcement enabled, and the current user needs to enable 2FA. */
	redactedDueTo2FAPending?: boolean | null;
	restrictProjectVisibilityToGroups?: boolean | null;
	slackChannelId?: string | null;
	subscriptionPlanLimit?: RailwayJsonValue | null;
	updatedAt?: string | null;
	/** Get a list of user emails in the workspace who do not have verified 2FA enabled. Returns an empty array if all users have 2FA enabled. */
	usersWithout2FA?: Array<string> | null;
};

export type RailwayOperationInputs = {
	'accessGroupMembers.add': {
		input: RailwayAccessGroupMemberInputInput;
	};
	'accessGroupMembers.remove': {
		input: RailwayAccessGroupMemberInputInput;
	};
	'accessGroupProjects.attach': {
		input: RailwayAccessGroupProjectInputInput;
	};
	'accessGroupProjects.detach': {
		input: RailwayAccessGroupProjectInputInput;
	};
	'accessGroups.create': {
		input: RailwayAccessGroupCreateInputInput;
	};
	'accessGroups.delete': {
		id: string;
	};
	'accessGroups.update': {
		id: string;
		input: RailwayAccessGroupUpdateInputInput;
	};
	'agentUsage.get': {
		workspaceId: string;
	};
	'agentUsage.setLimit': {
		input: RailwayAgentUsageLimitSetInputInput;
	};
	'apiTokens.create': {
		input: RailwayApiTokenCreateInputInput;
	};
	'apiTokens.current': Record<string, never>;
	'apiTokens.delete': {
		id: string;
	};
	'apiTokens.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
	};
	'auditLogs.eventTypes': Record<string, never>;
	'auditLogs.get': {
		/** The ID of the audit log entry */
		id: string;
		/** The ID of the workspace */
		workspaceId: string;
	};
	'auditLogs.list': {
		after?: string;
		before?: string;
		filter?: RailwayAuditLogFilterInputInput;
		first?: number;
		last?: number;
		sort?: RailwaySortOrderInput;
		workspaceId: string;
	};
	'billing.createFreePlanSubscription': {
		id: string;
	};
	'billing.togglePayoutsToCredits': {
		customerId: string;
		input: RailwayCustomerTogglePayoutsToCreditsInputInput;
	};
	'botScopeBindings.list': Record<string, never>;
	'botScopeBindings.remove': {
		id: string;
	};
	'buckets.create': {
		input: RailwayBucketCreateInputInput;
	};
	'buckets.instanceDetails': {
		bucketId: string;
		environmentId: string;
	};
	'buckets.resetCredentials': {
		bucketId: string;
		environmentId: string;
		projectId: string;
		redeployDependents?: boolean;
	};
	'buckets.s3Credentials': {
		bucketId: string;
		environmentId: string;
		projectId: string;
	};
	'buckets.update': {
		id: string;
		input: RailwayBucketUpdateInputInput;
	};
	'canvasViews.merge': {
		sourceEnvironmentId: string;
		targetEnvironmentId: string;
	};
	'canvasViews.mergePreview': {
		sourceEnvironmentId: string;
		targetEnvironmentId: string;
	};
	'clearanceTokens.create': {
		input: RailwayClearanceTokenCreateInputInput;
	};
	'clearanceTokens.revoke': {
		id: string;
	};
	'cloudAgentCheckpoints.create': {
		id: string;
		name?: string;
	};
	'cloudAgentCheckpoints.delete': {
		id: string;
	};
	'cloudAgentCheckpoints.get': {
		id: string;
	};
	'cloudAgentCheckpoints.list': {
		after?: string;
		before?: string;
		environmentId: string;
		first?: number;
		last?: number;
	};
	'cloudAgentConsoleSessions.list': {
		after?: string;
		before?: string;
		cloudAgentId: string;
		first?: number;
		last?: number;
	};
	'cloudAgentTasks.cancel': {
		taskId: string;
	};
	'cloudAgentTasks.dispatch': {
		input: RailwayCloudAgentTaskDispatchInputInput;
	};
	'cloudAgentTasks.get': {
		cloudAgentId: string;
		sessionId: string;
		/** An earlier turn on this session; default the latest. */
		taskId?: string;
	};
	'cloudAgentTasks.list': {
		cloudAgentId?: string;
		cursor?: string;
		environmentId: string;
		limit?: number;
		/** Requires cloudAgentId. */
		sessionId?: string;
		status?: RailwayCloudAgentTaskStatusInput;
	};
	'cloudAgentTasks.models': {
		environmentId: string;
		projectId: string;
	};
	'cloudAgentTasks.recover': {
		cloudAgentId: string;
		sessionId: string;
	};
	'cloudAgentTasks.respond': {
		input: RailwayCloudAgentTaskRespondInputInput;
	};
	'cloudAgents.archive': {
		id: string;
	};
	'cloudAgents.create': {
		input: RailwayCloudAgentCreateInputInput;
	};
	'cloudAgents.createDashboardFeedback': {
		input: RailwayAgentDashboardFeedbackInputInput;
	};
	'cloudAgents.createFeedback': {
		input: RailwayCloudAgentFeedbackInputInput;
	};
	'cloudAgents.delete': {
		id: string;
	};
	'cloudAgents.deploy': {
		id: string;
		path?: string;
		/** Replicas per region, e.g. { "us-west2": 3 }. Saved on the service; omit to keep its current regions. */
		regions?: RailwayJsonValue;
		serviceName?: string;
	};
	'cloudAgents.fork': {
		id: string;
		name?: string;
		/** The harness's session id of the chat to carry over. */
		sessionId?: string;
		variables?: RailwayJsonValue;
	};
	'cloudAgents.get': {
		environmentId: string;
		id: string;
	};
	'cloudAgents.list': {
		/** true: only archived agents; false: only unarchived ones. By default both. */
		archived?: boolean;
		environmentId: string;
		/** Return only the agents that belong to you. By default every agent in the environment is returned, including your teammates'. */
		mine?: boolean;
	};
	'cloudAgents.listMine': {
		/** true: only archived agents; false: only unarchived ones. By default both. */
		archived?: boolean;
	};
	'cloudAgents.markSeen': {
		cloudAgentId: string;
		/** The harness's session id. */
		sessionId?: string;
	};
	'cloudAgents.renameSession': {
		cloudAgentId: string;
		/** The harness's session id. */
		sessionId: string;
		title: string;
	};
	'cloudAgents.sleep': {
		id: string;
	};
	'cloudAgents.unarchive': {
		id: string;
	};
	'cloudAgents.wake': {
		id: string;
	};
	'customDomains.create': {
		input: RailwayCustomDomainCreateInputInput;
	};
	'customDomains.delete': {
		id: string;
	};
	'customDomains.get': {
		id: string;
		projectId: string;
	};
	'customDomains.isAvailable': {
		domain: string;
	};
	'customDomains.issueCertificate': {
		id: string;
	};
	'customDomains.update': {
		environmentId: string;
		id: string;
		targetPort?: number;
	};
	'databases.cancelPitrHaWorkflow': {
		environmentId: string;
		rootServiceId: string;
	};
	'databases.clearPitrHaWorkflowProgress': {
		environmentId: string;
		rootServiceId: string;
	};
	'databases.disablePitrForHaCluster': {
		input: RailwayDisablePitrForHaClusterInputInput;
	};
	'databases.enablePitrForHaCluster': {
		input: RailwayEnablePitrForHaClusterInputInput;
	};
	'databases.mysqlPitrRestorableWindow': {
		environmentId: string;
		serviceId: string;
	};
	'databases.passwordRotationProgress': {
		environmentId: string;
		serviceId: string;
	};
	'databases.pitrHaClusterReplicationHealth': {
		environmentId: string;
		rootServiceId: string;
	};
	'databases.pitrHaWorkflowProgress': {
		environmentId: string;
		rootServiceId: string;
	};
	'databases.postgresHaClusterUptime': {
		days?: number;
		environmentId: string;
		/** Any member service of the cluster. */
		serviceId: string;
	};
	'databases.resetPassword': {
		input: RailwayDatabasePasswordResetInputInput;
	};
	'deploymentTriggers.create': {
		input: RailwayDeploymentTriggerCreateInputInput;
	};
	'deploymentTriggers.delete': {
		id: string;
	};
	'deploymentTriggers.list': {
		after?: string;
		before?: string;
		environmentId: string;
		first?: number;
		last?: number;
		projectId: string;
		serviceId: string;
	};
	'deploymentTriggers.update': {
		id: string;
		input: RailwayDeploymentTriggerUpdateInputInput;
	};
	'deployments.approve': {
		id: string;
	};
	'deployments.buildLogs': {
		deploymentId: string;
		endDate?: string;
		/** Filter logs by a string. Providing an empty value will match all logs. */
		filter?: string;
		/** Limit the number of logs returned (defaults 100, max 5000) */
		limit?: number;
		startDate?: string;
	};
	'deployments.cancel': {
		id: string;
	};
	'deployments.createInstanceExecution': {
		input: RailwayDeploymentInstanceExecutionCreateInputInput;
	};
	'deployments.events': {
		after?: string;
		before?: string;
		first?: number;
		id: string;
		last?: number;
	};
	'deployments.get': {
		id: string;
	};
	'deployments.instanceExecutions': {
		after?: string;
		before?: string;
		first?: number;
		input: RailwayDeploymentInstanceExecutionListInputInput;
		last?: number;
	};
	'deployments.list': {
		after?: string;
		before?: string;
		first?: number;
		input: RailwayDeploymentListInputInput;
		last?: number;
	};
	'deployments.logs': {
		deploymentId: string;
		endDate?: string;
		/** Filter logs by a string. Providing an empty value will match all logs. */
		filter?: string;
		/** Limit the number of logs returned (defaults 100, max 5000) */
		limit?: number;
		startDate?: string;
	};
	'deployments.redeploy': {
		id: string;
		usePreviousImageTag?: boolean;
	};
	'deployments.remove': {
		id: string;
	};
	'deployments.restart': {
		id: string;
	};
	'deployments.rollback': {
		id: string;
	};
	'deployments.snapshot': {
		deploymentId: string;
	};
	'deployments.stop': {
		id: string;
	};
	'dnsQueryLogs.list': {
		/** Latest date to look for logs after the anchor */
		afterDate?: string;
		/** Limit logs returned after the anchor */
		afterLimit?: number;
		/** Target date time to look for logs */
		anchorDate?: string;
		/** Oldest date to look for logs before the anchor */
		beforeDate?: string;
		/** Limit logs returned before the anchor */
		beforeLimit?: number;
		/** Filter by deployment instance / sandbox ID (optional) */
		deploymentInstanceId?: string;
		environmentId: string;
		/** Filter expression (e.g., @rcode:NXDOMAIN @qtype:A @domain:example.com @status:failed). Prefix a term with - to exclude it; repeat a key to match any of its values */
		filter?: string;
		/** Filter by service ID (optional) */
		serviceId?: string;
	};
	'dockerCompose.import': {
		environmentId: string;
		projectId: string;
		skipStagingPatch?: boolean;
		yaml: string;
	};
	'domains.list': {
		environmentId: string;
		projectId: string;
		serviceId: string;
	};
	'egressGateways.clearAssociations': {
		input: RailwayEgressGatewayServiceTargetInputInput;
	};
	'egressGateways.createAssociation': {
		input: RailwayEgressGatewayCreateInputInput;
	};
	'egressGateways.haMigrationPreview': {
		input: RailwayEgressGatewayServiceTargetInputInput;
	};
	'egressGateways.haPreview': {
		environmentId: string;
		serviceId: string;
	};
	'egressGateways.legacyPreview': {
		environmentId: string;
		serviceId: string;
	};
	'egressGateways.list': {
		environmentId: string;
		serviceId: string;
	};
	'egressGateways.rollbackFromHa': {
		input: RailwayEgressGatewayServiceTargetInputInput;
	};
	'egressGateways.upgradeToHa': {
		input: RailwayEgressGatewayServiceTargetInputInput;
	};
	'environmentPatches.commit': {
		commitMessage?: string;
		environmentId: string;
		patch?: RailwayJsonValue;
		/** Skip deploys for services affected by this patch. */
		skipDeploys?: boolean;
	};
	'environmentPatches.commitStaged': {
		commitMessage?: string;
		environmentId: string;
		/** Skip deploys for services affected by this patch. */
		skipDeploys?: boolean;
	};
	'environmentPatches.dismissFailure': {
		patchId: string;
	};
	'environmentPatches.get': {
		/** The patch's environment, when known. Speeds up lookups of archived patches. */
		environmentId?: string;
		id: string;
	};
	'environmentPatches.list': {
		after?: string;
		before?: string;
		environmentId: string;
		first?: number;
		last?: number;
	};
	'environmentPatches.restage': {
		patchId: string;
	};
	'environments.applyChangeSet': {
		/** Snapshot token from Environment.configEtag the plan was computed against. When set, the apply is rejected if the environment has changed since. */
		baseConfigEtag?: string;
		commitMessage?: string;
		environmentId: string;
		input: RailwayJsonValue;
		/** Defaults to true for compatibility. Async-capable clients set false and poll environmentChangeSetApply. */
		waitForCompletion?: boolean;
	};
	'environments.changeSetApplyStatus': {
		environmentId: string;
		id: string;
	};
	'environments.create': {
		input: RailwayEnvironmentCreateInputInput;
	};
	'environments.delete': {
		id: string;
	};
	'environments.get': {
		id: string;
		projectId?: string;
	};
	'environments.hasLegacyStaticEgress': {
		environmentId: string;
	};
	'environments.history': {
		after?: string;
		environmentId: string;
		filter?: RailwayHistoryFilterInputInput;
		first?: number;
	};
	'environments.iacPartialRelease': {
		/** Snapshot token from Environment.configEtag the ownership preview was computed against. When set, the release is rejected if the environment has changed since. */
		baseConfigEtag?: string;
		environmentId: string;
		partial: string;
		/** Resource addresses to release (for example service.api). Every address must belong to the named partial. Omit to release all of its resources; an empty list is rejected. */
		resources?: Array<string>;
	};
	'environments.iacPartialTransfer': {
		/** Snapshot token from Environment.configEtag the ownership preview was computed against. When set, the transfer is rejected if the environment has changed since. */
		baseConfigEtag?: string;
		environmentId: string;
		fromPartial: string;
		/** Resource addresses to transfer (for example service.api). Every address must belong to fromPartial. Omit to transfer all of its resources; an empty list is rejected. */
		resources?: Array<string>;
		toPartial: string;
	};
	'environments.list': {
		after?: string;
		before?: string;
		first?: number;
		isEphemeral?: boolean;
		last?: number;
		projectId: string;
	};
	'environments.logs': {
		/** Latest date to look for logs after the anchor */
		afterDate?: string;
		/** Limit the number of logs returned after the anchor */
		afterLimit?: number;
		/** Target date time to look for logs */
		anchorDate?: string;
		/** Oldest date to look for logs before the anchor */
		beforeDate?: string;
		/** Limit the number of logs returned before the anchor */
		beforeLimit?: number;
		environmentId: string;
		/** Filter logs using a query syntax */
		filter?: string;
	};
	'environments.overrideBase': {
		id: string;
		input: RailwayBaseEnvironmentOverrideInputInput;
	};
	'environments.pendingWork': {
		environmentId: string;
	};
	'environments.previewChangeSet': {
		environmentId: string;
		input: RailwayJsonValue;
	};
	'environments.rename': {
		id: string;
		input: RailwayEnvironmentRenameInputInput;
	};
	'environments.stageChanges': {
		environmentId: string;
		input: RailwayJsonValue;
		/** Merge the input patch into the existing staged patch. */
		merge?: boolean;
	};
	'environments.stagedChanges': {
		environmentId: string;
	};
	'environments.triggerDeploys': {
		input: RailwayEnvironmentTriggersDeployInputInput;
	};
	'environments.unskipService': {
		environmentId: string;
		serviceId: string;
	};
	'environments.updateClearanceDefault': {
		input: RailwayEnvironmentClearanceDefaultUpdateInputInput;
	};
	'environments.upsertConfigPlanComment': {
		input: RailwayEnvironmentConfigPlanCommentUpsertInputInput;
	};
	'events.list': {
		after?: string;
		before?: string;
		environmentId?: string;
		filter?: RailwayEventFilterInputInput;
		first?: number;
		last?: number;
		projectId: string;
	};
	'featureFlags.add': {
		input: RailwayFeatureFlagToggleInputInput;
	};
	'featureFlags.listPlatform': Record<string, never>;
	'featureFlags.remove': {
		input: RailwayFeatureFlagToggleInputInput;
	};
	'functionRuntimes.get': {
		name: RailwayFunctionRuntimeNameInput;
	};
	'functionRuntimes.list': Record<string, never>;
	'github.prInfo': {
		prNumber: number;
		serviceId: string;
	};
	'github.prInfoResult': {
		prNumber: number;
		serviceId: string;
	};
	'github.repoAccessAvailable': {
		fullRepoName: string;
	};
	'github.repos.branches': {
		owner: string;
		repo: string;
	};
	'github.repos.deploy': {
		input: RailwayGitHubRepoDeployInputInput;
	};
	'github.repos.get': {
		fullRepoName: string;
	};
	'github.repos.isNameAvailable': {
		fullRepoName: string;
	};
	'github.repos.list': Record<string, never>;
	'github.repos.update': {
		input: RailwayGitHubRepoUpdateInputInput;
	};
	'github.sshKeys': Record<string, never>;
	'github.writableScopes': Record<string, never>;
	'httpLogs.list': {
		/** Latest date to look for logs after the anchor */
		afterDate?: string;
		/** Limit the number of logs returned after the anchor */
		afterLimit?: number;
		/** Target date time to look for logs */
		anchorDate?: string;
		/** Oldest date to look for logs before the anchor */
		beforeDate?: string;
		/** Limit the number of logs returned before the anchor */
		beforeLimit?: number;
		deploymentId: string;
		/** Filter logs using a query syntax */
		filter?: string;
		/** Limit the number of logs returned (defaults 100, max 5000) */
		limit?: number;
	};
	'httpMetrics.duration': {
		/** The end of the period to get metrics for. */
		endDate: string;
		environmentId: string;
		/** Filter by HTTP method (e.g., GET, POST) */
		method?: string;
		/** Filter by request path */
		path?: string;
		serviceId: string;
		/** The start of the period to get metrics for. */
		startDate: string;
		/** Filter by HTTP status code (e.g., 200, 404, 500) */
		statusCode?: number;
		/** The frequency of data points in the response. If the `stepSeconds` is 60, then the response will contain one data point per minute. */
		stepSeconds?: number;
	};
	'httpMetrics.get': {
		/** The end of the period to get metrics for. */
		endDate: string;
		environmentId: string;
		/** Filter by HTTP method (e.g., GET, POST) */
		method?: string;
		/** Filter by request path */
		path?: string;
		serviceId: string;
		/** The start of the period to get metrics for. */
		startDate: string;
		/** Filter by HTTP status code (e.g., 200, 404, 500) */
		statusCode?: number;
		/** The frequency of data points in the response. If the `stepSeconds` is 60, then the response will contain one data point per minute. */
		stepSeconds?: number;
	};
	'httpMetrics.groupedByStatus': {
		/** The end of the period to get metrics for. */
		endDate: string;
		environmentId: string;
		/** Filter by HTTP method (e.g., GET, POST) */
		method?: string;
		/** Filter by request path */
		path?: string;
		serviceId: string;
		/** The start of the period to get metrics for. */
		startDate: string;
		/** The frequency of data points in the response. If the `stepSeconds` is 60, then the response will contain one data point per minute. */
		stepSeconds?: number;
	};
	'inviteCodes.get': {
		code: string;
	};
	'inviteCodes.use': {
		code: string;
	};
	'me.get': Record<string, never>;
	'metrics.get': {
		/** The averaging window when computing CPU usage. By default, it is the same as the `sampleRateSeconds`. */
		averagingWindowSeconds?: number;
		/** The end of the period to get metrics for. If not provided, the current datetime is used. */
		endDate?: string;
		environmentId?: string;
		/** What to group the aggregated usage by. By default, it is grouped over the entire project. */
		groupBy?: Array<RailwayMetricTagInput>;
		/** Whether or not to include deleted projects in the results */
		includeDeleted?: boolean;
		measurements: Array<RailwayMetricMeasurementInput>;
		projectId?: string;
		/** The frequency of data points in the response. If the `sampleRateSeconds` is 60, then the response will contain one data point per minute. */
		sampleRateSeconds?: number;
		serviceId?: string;
		/** The start of the period to get metrics for. */
		startDate: string;
		volumeId?: string;
		volumeInstanceExternalId?: string;
		workspaceId?: string;
	};
	'networkFlowLogs.list': {
		/** Latest date to look for logs after the anchor */
		afterDate?: string;
		/** Limit logs returned after the anchor */
		afterLimit?: number;
		/** Target date time to look for logs */
		anchorDate?: string;
		/** Oldest date to look for logs before the anchor */
		beforeDate?: string;
		/** Limit logs returned before the anchor */
		beforeLimit?: number;
		/** Filter by deployment instance / sandbox ID (optional) */
		deploymentInstanceId?: string;
		environmentId: string;
		/** Filter expression (e.g., @protocol:tcp @direction:egress @dropped:true) */
		filter?: string;
		/** Filter by service ID (optional) */
		serviceId?: string;
	};
	'notificationDeliveries.get': {
		id: string;
	};
	'notificationDeliveries.list': {
		after?: string;
		before?: string;
		filter?: RailwayNotificationDeliveryFilterInputInput;
		first?: number;
		last?: number;
	};
	'notificationDeliveries.markAsRead': {
		deliveryIds: Array<string>;
	};
	'notificationRules.create': {
		input: RailwayCreateNotificationRuleInputInput;
	};
	'notificationRules.delete': {
		id: string;
	};
	'notificationRules.list': {
		projectId?: string;
		workspaceId: string;
	};
	'notificationRules.update': {
		id: string;
		input: RailwayUpdateNotificationRuleInputInput;
	};
	'notificationRules.upsertSlackChannel': {
		workspaceId: string;
	};
	'observabilityDashboardMonitors.create': {
		dashboardItemId: string;
		input: RailwayObservabilityDashboardMonitorCreateInputInput;
	};
	'observabilityDashboardMonitors.remove': {
		id: string;
	};
	'observabilityDashboardMonitors.update': {
		id: string;
		input: RailwayObservabilityDashboardMonitorUpdateInputInput;
	};
	'observabilityDashboards.create': {
		input: RailwayObservabilityDashboardCreateInputInput;
	};
	'observabilityDashboards.list': {
		after?: string;
		before?: string;
		environmentId: string;
		first?: number;
		last?: number;
	};
	'observabilityDashboards.reset': {
		id: string;
	};
	'observabilityDashboards.update': {
		id: string;
		input: Array<RailwayObservabilityDashboardUpdateInputInput>;
		/** The dashboard's revision when it was read. Given, a save based on an older one is refused with DASHBOARD_CHANGED. */
		revision?: string;
	};
	'passkeys.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
	};
	'platform.stats': Record<string, never>;
	'platform.status': Record<string, never>;
	'preferences.get': {
		token?: string;
	};
	'preferences.update': {
		input: RailwayPreferencesUpdateDataInput;
	};
	'privateNetworkEndpoints.get': {
		environmentId: string;
		privateNetworkId: string;
		serviceId: string;
	};
	'privateNetworkEndpoints.isNameAvailable': {
		environmentId: string;
		prefix: string;
		privateNetworkId: string;
	};
	'privateNetworkEndpoints.rename': {
		dnsName: string;
		id: string;
		privateNetworkId: string;
	};
	'privateNetworks.list': {
		environmentId: string;
	};
	'projectFavorites.list': {
		orderBy?: RailwayProjectsOrderByInput;
		workspaceId: string;
	};
	'projectFavorites.set': {
		favorite: boolean;
		projectId: string;
	};
	'projectInvitations.accept': {
		code: string;
	};
	'projectInvitations.create': {
		id: string;
		input: RailwayProjectInviteeInput;
	};
	'projectInvitations.createInviteCode': {
		projectId: string;
		role: RailwayProjectRoleInput;
	};
	'projectInvitations.delete': {
		id: string;
	};
	'projectInvitations.get': {
		code: string;
	};
	'projectInvitations.inviteCode': {
		projectId: string;
		role: RailwayProjectRoleInput;
	};
	'projectInvitations.list': {
		id: string;
	};
	'projectInvitations.resend': {
		id: string;
	};
	'projectMembers.add': {
		input: RailwayProjectMemberAddInputInput;
	};
	'projectMembers.list': {
		projectId: string;
	};
	'projectMembers.remove': {
		input: RailwayProjectMemberRemoveInputInput;
	};
	'projectMembers.update': {
		input: RailwayProjectMemberUpdateInputInput;
	};
	'projectTokens.create': {
		input: RailwayProjectTokenCreateInputInput;
	};
	'projectTokens.delete': {
		id: string;
	};
	'projectTokens.get': Record<string, never>;
	'projectTokens.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		projectId: string;
	};
	'projects.addFeatureFlag': {
		input: RailwayProjectFeatureFlagToggleInputInput;
	};
	'projects.cancelScheduledDelete': {
		id: string;
	};
	'projects.claim': {
		id: string;
		workspaceId: string;
	};
	'projects.compliance': {
		projectId: string;
	};
	'projects.confirmTransfer': {
		input: RailwayProjectTransferConfirmInputInput;
	};
	'projects.create': {
		input: RailwayProjectCreateInputInput;
	};
	'projects.delete': {
		id: string;
	};
	'projects.forceScheduledDelete': {
		id: string;
	};
	'projects.get': {
		id: string;
	};
	'projects.initiateTransfer': {
		input: RailwayProjectTransferInitiateInputInput;
	};
	'projects.leave': {
		id: string;
	};
	'projects.list': {
		after?: string;
		before?: string;
		first?: number;
		includeDeleted?: boolean;
		last?: number;
		orderBy?: RailwayProjectsOrderByInput;
		userId?: string;
		workspaceId?: string;
	};
	'projects.listByIds': {
		ids: Array<string>;
	};
	'projects.removeFeatureFlag': {
		input: RailwayProjectFeatureFlagToggleInputInput;
	};
	'projects.resourceAccess': {
		projectId: string;
	};
	'projects.scheduleDelete': {
		id: string;
	};
	'projects.serviceUsage': {
		/** Project ID cursor returned from the previous page. */
		after?: string;
		endDate: string;
		/** Number of projects to include in this page. Max 50. */
		first?: number;
		/** Whether to include deleted projects in usage. */
		includeDeleted?: boolean;
		measurements: Array<RailwayMetricMeasurementInput>;
		startDate: string;
		workspaceId: string;
	};
	'projects.transfer': {
		input: RailwayProjectTransferInputInput;
		projectId: string;
	};
	'projects.update': {
		id: string;
		input: RailwayProjectUpdateInputInput;
	};
	'projects.updateClearanceDefault': {
		input: RailwayProjectClearanceDefaultUpdateInputInput;
	};
	'projects.workspaceMembers': {
		projectId: string;
	};
	'railwayDomainDnsRecords.create': {
		input: RailwayRailwayDomainDnsRecordCreateInputInput;
	};
	'railwayDomainDnsRecords.delete': {
		input: RailwayRailwayDomainDnsRecordDeleteInputInput;
	};
	'railwayDomainDnsRecords.list': {
		domain: string;
		workspaceId: string;
	};
	'railwayDomainDnsRecords.update': {
		input: RailwayRailwayDomainDnsRecordUpdateInputInput;
	};
	'railwayDomainEmailForwardingRules.create': {
		input: RailwayRailwayDomainEmailForwardingRuleCreateInputInput;
	};
	'railwayDomainEmailForwardingRules.delete': {
		input: RailwayRailwayDomainEmailForwardingRuleDeleteInputInput;
	};
	'railwayDomainEmailForwardingRules.list': {
		domain: string;
		workspaceId: string;
	};
	'railwayDomainEmailForwardingRules.removeAll': {
		input: RailwayRailwayDomainEmailForwardingRemoveAllInputInput;
	};
	'railwayDomainEmailForwardingRules.sendTest': {
		input: RailwayRailwayDomainEmailForwardingRuleTestInputInput;
	};
	'railwayDomainEmailForwardingRules.update': {
		input: RailwayRailwayDomainEmailForwardingRuleUpdateInputInput;
	};
	'railwayDomains.emailForwardingEligibility': {
		domain: string;
		workspaceId: string;
	};
	'railwayDomains.emailForwardingLimits': {
		workspaceId?: string;
	};
	'railwayDomains.get': {
		id: string;
	};
	'railwayDomains.getByName': {
		domain: string;
		workspaceId: string;
	};
	'railwayDomains.list': {
		status?: RailwayRailwayDomainStatusInput;
		workspaceId: string;
	};
	'railwayDomains.setNameservers': {
		input: RailwayRailwayDomainNameserversSetInputInput;
	};
	'railwayDomains.update': {
		input: RailwayRailwayDomainUpdateInputInput;
	};
	'referral.get': {
		workspaceId: string;
	};
	'referral.update': {
		input: RailwayReferralInfoUpdateInputInput;
	};
	'regions.list': {
		projectId?: string;
	};
	'resourceAccess.get': {
		explicitResourceOwner: RailwayExplicitOwnerInputInput;
	};
	'sandboxCheckpoints.create': {
		environmentId: string;
		name: string;
		sandboxId: string;
	};
	'sandboxCheckpoints.delete': {
		environmentId: string;
		id: string;
	};
	'sandboxCheckpoints.list': {
		environmentId: string;
	};
	'sandboxCheckpoints.rename': {
		environmentId: string;
		id: string;
		name: string;
	};
	'sandboxSessions.list': {
		after?: string;
		before?: string;
		environmentId: string;
		first?: number;
		id: string;
		last?: number;
	};
	'sandboxes.buildTemplate': {
		environmentId: string;
		input: RailwaySandboxTemplateInputInput;
	};
	'sandboxes.create': {
		input: RailwaySandboxCreateInputInput;
	};
	'sandboxes.destroy': {
		environmentId: string;
		id: string;
	};
	'sandboxes.get': {
		environmentId: string;
		id: string;
	};
	'sandboxes.heartbeat': {
		environmentId: string;
		id: string;
	};
	'sandboxes.list': {
		/** true = live sandboxes only (excludes destroyed; FAILED and transitional states are still included), false = destroyed only, omitted = all. */
		active?: boolean;
		after?: string;
		before?: string;
		environmentId: string;
		first?: number;
		last?: number;
	};
	'sandboxes.templateBuild': {
		environmentId: string;
		id: string;
	};
	'serviceDomains.create': {
		input: RailwayServiceDomainCreateInputInput;
	};
	'serviceDomains.delete': {
		id: string;
	};
	'serviceDomains.isAvailable': {
		domain: string;
	};
	'serviceDomains.update': {
		input: RailwayServiceDomainUpdateInputInput;
	};
	'serviceInstances.autoDeployStatus': {
		environmentId: string;
		projectId: string;
		serviceId: string;
	};
	'serviceInstances.clearAutoUpdateSnooze': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.deploy': {
		commitSha?: string;
		environmentId: string;
		latestCommit?: boolean;
		serviceId: string;
	};
	'serviceInstances.deployV2': {
		commitSha?: string;
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.dismissVulnRemediation': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.get': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.isUpdatable': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.limitOverride': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.limits': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.patchVulnNow': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.redeploy': {
		environmentId: string;
		serviceId: string;
	};
	'serviceInstances.snoozeAutoUpdate': {
		environmentId: string;
		serviceId: string;
		/** How many days to skip, from now (default 7 — covers any weekly schedule shape). Between 1 and 14. */
		snoozeDays?: number;
	};
	'serviceInstances.update': {
		/** [Experimental] Environment ID. If the environment is a fork, the service will only be updated in it. Otherwise it will updated in all environments that are not forks of other environments */
		environmentId?: string;
		input: RailwayServiceInstanceUpdateInputInput;
		serviceId: string;
	};
	'serviceInstances.updateAutoDeploy': {
		input: RailwayServiceInstanceAutoDeployUpdateInputInput;
	};
	'serviceInstances.updateAutoUpdateSchedule': {
		environmentId: string;
		/** The full replacement set of weekly UTC maintenance windows (at least one) */
		schedule: Array<RailwayAutoUpdateScheduleWindowInputInput>;
		serviceId: string;
	};
	'serviceInstances.updateClearance': {
		input: RailwayServiceInstanceClearanceUpdateInputInput;
	};
	'serviceInstances.updateLimits': {
		input: RailwayServiceInstanceLimitsUpdateInputInput;
	};
	'services.acknowledgeTakedown': {
		input: RailwayTakedownAcknowledgeInputInput;
	};
	'services.addFeatureFlag': {
		input: RailwayServiceFeatureFlagToggleInputInput;
	};
	'services.connect': {
		id: string;
		input: RailwayServiceConnectInputInput;
	};
	'services.create': {
		input: RailwayServiceCreateInputInput;
	};
	'services.delete': {
		/** Environment ID. When set, the service is deleted only in that environment; the service itself is deleted once no instances remain in any environment. When omitted, the service is deleted in every environment that is not a fork of another environment. */
		environmentId?: string;
		id: string;
	};
	'services.disableCdn': {
		input: RailwayDisableServiceCdnInputInput;
	};
	'services.disconnect': {
		id: string;
	};
	'services.enableCdn': {
		input: RailwayEnableServiceCdnInputInput;
	};
	'services.generateShellToken': {
		input: RailwayShellTokenInputInput;
	};
	'services.get': {
		id: string;
	};
	'services.purgeCache': {
		input: RailwayPurgeServiceCacheInputInput;
	};
	'services.removeFeatureFlag': {
		input: RailwayServiceFeatureFlagToggleInputInput;
	};
	'services.removeUpstreamUrl': {
		id: string;
	};
	'services.setUnderAttackMode': {
		input: RailwaySetServiceUnderAttackModeInputInput;
	};
	'services.update': {
		id: string;
		input: RailwayServiceUpdateInputInput;
	};
	'services.updateEdgeConfig': {
		input: RailwayUpdateServiceEdgeConfigInputInput;
	};
	'services.updateEdgeRules': {
		input: RailwayUpdateServiceEdgeRulesInputInput;
	};
	'services.updateKind': {
		input: RailwayServiceKindUpdateInputInput;
	};
	'services.validateEdgeRules': {
		input: RailwayValidateServiceEdgeRulesInputInput;
	};
	'sessions.delete': {
		id: string;
	};
	'sessions.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
	};
	'sharedVariables.configure': {
		input: RailwaySharedVariableConfigureInputInput;
	};
	'signals.changes': {
		limit?: number;
		name: string;
		owner?: string;
	};
	'signals.create': {
		input: RailwaySignalCreateInputInput;
	};
	'signals.delete': {
		input: RailwaySignalDeleteInputInput;
	};
	'signals.evaluate': {
		context: RailwayJsonValue;
		name: string;
		owner?: string;
	};
	'signals.get': {
		name: string;
		owner?: string;
	};
	'signals.list': {
		owner?: string;
	};
	'signals.replace': {
		input: RailwaySignalReplaceInputInput;
	};
	'signals.rollback': {
		input: RailwaySignalRollbackInputInput;
	};
	'signals.setDefault': {
		input: RailwaySignalDefaultSetInputInput;
	};
	'signals.setRule': {
		input: RailwaySignalRuleSetInputInput;
	};
	'signals.unsetRule': {
		input: RailwaySignalRuleUnsetInputInput;
	};
	'sshPublicKeys.approveSignup': {
		code: string;
		workspaceId?: string;
	};
	'sshPublicKeys.create': {
		input: RailwaySshPublicKeyCreateInputInput;
	};
	'sshPublicKeys.delete': {
		id: string;
	};
	'sshPublicKeys.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		workspaceId?: string;
	};
	'sshPublicKeys.signupInfo': {
		code: string;
	};
	'tcpProxies.delete': {
		id: string;
	};
	'tcpProxies.list': {
		environmentId: string;
		serviceId: string;
	};
	'templates.clone': {
		input: RailwayTemplateCloneInputInput;
	};
	'templates.count': Record<string, never>;
	'templates.delete': {
		id: string;
		input: RailwayTemplateDeleteInputInput;
	};
	'templates.deploy': {
		input: RailwayTemplateDeployV2InputInput;
	};
	'templates.ejectServiceSource': {
		input: RailwayTemplateServiceSourceEjectInputInput;
	};
	'templates.generate': {
		input: RailwayTemplateGenerateInputInput;
	};
	'templates.get': {
		code?: string;
		id?: string;
		owner?: string;
		repo?: string;
	};
	'templates.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		/** If set to true, only recommended templates will be returned. */
		recommended?: boolean;
		/** If set to true, only verified templates will be returned. */
		verified?: boolean;
	};
	'templates.metrics': {
		id: string;
	};
	'templates.publish': {
		id: string;
		input: RailwayTemplatePublishInputInput;
	};
	'templates.revert': {
		input: RailwayTemplateRevertInputInput;
	};
	'templates.search': {
		after?: string;
		before?: string;
		/** If set, only templates in this category will be returned. */
		category?: string;
		first?: number;
		last?: number;
		/** Search term to filter templates. Empty query returns browse-style results. */
		query: string;
		/** If set, only templates matching this verification state will be returned. */
		verified?: boolean;
	};
	'templates.sourceForProject': {
		projectId: string;
	};
	'templates.unpublish': {
		id: string;
	};
	'templates.updateVolume': {
		serviceId: string;
		sizeMB?: number;
		templateId: string;
		volumeId: string;
	};
	'traces.get': {
		environmentId: string;
		/** Spans returned (defaults 1000, max 2000) */
		maxSpans?: number;
		/** W3C trace id, 32 hex characters */
		traceId: string;
	};
	'traces.list': {
		/** Latest span start to consider (ISO); defaults to now */
		endDate?: string;
		environmentId: string;
		/** Filter expression over spans, e.g. @status:error @component:edge @duration:>500 @http.route:/api/users. Built-in fields: trace, span, name, serviceName, service, deployment, replica, component, kind, status, duration (ms). Any other @key looks the key up in the span and resource attributes; free… */
		filter?: string;
		/** Traces returned (defaults 100, max 500) */
		limit?: number;
		/** Only traces with a span from this Railway service (optional) */
		serviceId?: string;
		/** Oldest span start to consider (ISO). Clamped to the project's retention; defaults to one hour ago */
		startDate?: string;
	};
	'traces.status': {
		environmentId: string;
	};
	'trustedDomains.create': {
		input: RailwayWorkspaceTrustedDomainCreateInputInput;
	};
	'trustedDomains.delete': {
		id: string;
	};
	'trustedDomains.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		workspaceId: string;
	};
	'trustedDomains.retriggerVerification': {
		id: string;
	};
	'trustedDomains.update': {
		input: RailwayWorkspaceTrustedDomainUpdateInputInput;
	};
	'twoFactor.get': Record<string, never>;
	'usage.estimated': {
		/** Whether to include deleted projects in estimations. */
		includeDeleted?: boolean;
		measurements: Array<RailwayMetricMeasurementInput>;
		projectId?: string;
		workspaceId?: string;
	};
	'usage.get': {
		endDate?: string;
		/** What to group the aggregated usage by. By default, it is grouped over the entire project. */
		groupBy?: Array<RailwayMetricTagInput>;
		/** Whether to include deleted projects in the usage. */
		includeDeleted?: boolean;
		measurements: Array<RailwayMetricMeasurementInput>;
		projectId?: string;
		startDate?: string;
		workspaceId?: string;
	};
	'usage.removeLimit': {
		input: RailwayUsageLimitRemoveInputInput;
	};
	'usage.setLimit': {
		input: RailwayUsageLimitSetInputInput;
	};
	'user.agreeToFairUse': {
		agree: boolean;
	};
	'user.delete': Record<string, never>;
	'user.disconnectDiscord': Record<string, never>;
	'user.pendingEmailChange': Record<string, never>;
	'user.removeProviderAuth': {
		id: string;
	};
	'user.updateTerms': Record<string, never>;
	'userProfile.get': {
		username: string;
	};
	'userProfile.update': {
		input: RailwayUserProfileUpdateInputInput;
	};
	'variables.delete': {
		input: RailwayVariableDeleteInputInput;
	};
	'variables.forServiceDeployment': {
		environmentId: string;
		projectId: string;
		serviceId: string;
	};
	'variables.list': {
		environmentId: string;
		projectId: string;
		/** Provide a serviceId to get all variables for a specific service. */
		serviceId?: string;
		unrendered?: boolean;
	};
	'variables.upsert': {
		input: RailwayVariableUpsertInputInput;
	};
	'variables.upsertMany': {
		input: RailwayVariableCollectionUpsertInputInput;
	};
	'volumeInstanceBackupSchedules.list': {
		/** The id of the volume instance to list the schedules of */
		volumeInstanceId: string;
	};
	'volumeInstanceBackupSchedules.update': {
		/** The frequency/retention of the backups */
		kinds: Array<RailwayVolumeInstanceBackupScheduleKindInput>;
		/** The id of the volume instance to create a backup of */
		volumeInstanceId: string;
	};
	'volumeInstanceBackups.create': {
		/** Optional name/label for the backup. Defaults to 'Manual' if not provided. */
		name?: string;
		/** The id of the volume instance to create a backup of */
		volumeInstanceId: string;
	};
	'volumeInstanceBackups.delete': {
		/** The volume instance's backup id */
		volumeInstanceBackupId: string;
		/** The volume instance's id */
		volumeInstanceId: string;
	};
	'volumeInstanceBackups.list': {
		/** The id of the volume instance to list the backups of */
		volumeInstanceId: string;
	};
	'volumeInstanceBackups.lock': {
		/** The id of the backup to lock */
		volumeInstanceBackupId: string;
		/** The id of the volume instance to be restored from */
		volumeInstanceId: string;
	};
	'volumeInstanceBackups.restore': {
		/** Optional: for HA cluster restores, service IDs of replicas that should also receive the backup */
		replicaServiceIds?: Array<string>;
		/** The id of the backup to be restored from */
		volumeInstanceBackupId: string;
		/** The id of the volume instance to be restored from */
		volumeInstanceId: string;
		/** Service IDs whose volumes should be wiped (replaced with fresh empty volumes) as part of this restore */
		wipeServiceIds?: Array<string>;
	};
	'volumeInstances.get': {
		id: string;
	};
	'volumeInstances.pitrRestore': {
		/** Optional name for the new restored service. Defaults to '<source>-restored-YYYYMMDD-HHMM'. */
		newServiceName?: string;
		/** One of the source's backup histories, as listed by the backup history picker. Pass null to use the source's current history. */
		sourceRepoPath?: string;
		/** Point-in-time target. Must be within the available restore window. */
		targetTimestamp: string;
		/** The id of the volume instance to restore from */
		volumeInstanceId: string;
	};
	'volumeInstances.pitrRestoreEstimate': {
		/** One of the source's backup histories, as listed by the backup history picker. Pass null to use the source's current history. */
		sourceRepoPath?: string;
		/** Point-in-time target the estimate is computed for */
		targetTimestamp: string;
		/** The id of the source volume instance to restore from */
		volumeInstanceId: string;
	};
	'volumeInstances.update': {
		/** The environment of the volume instance to update. If null, all instances for the volume will be updated */
		environmentId?: string;
		input: RailwayVolumeInstanceUpdateInputInput;
		/** The id of the volume to update */
		volumeId: string;
	};
	'volumes.create': {
		input: RailwayVolumeCreateInputInput;
	};
	'volumes.delete': {
		volumeId: string;
	};
	'volumes.update': {
		input: RailwayVolumeUpdateInputInput;
		volumeId: string;
	};
	'webhooks.test': {
		headers?: Array<RailwayWebhookHeaderInputInput>;
		notificationRuleId?: string;
		payload: string;
		url: string;
	};
	'workflows.status': {
		workflowId: string;
	};
	'workspaceApiTokens.delete': {
		id: string;
		workspaceId: string;
	};
	'workspaceApiTokens.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		workspaceId: string;
	};
	'workspaceMembers.changeRole': {
		input: RailwayWorkspacePermissionChangeInputInput;
	};
	'workspaceMembers.invite': {
		input: RailwayWorkspaceUserInviteInputInput;
		workspaceId: string;
	};
	'workspaceMembers.remove': {
		input: RailwayWorkspaceUserRemoveInputInput;
		workspaceId: string;
	};
	'workspacePolicies.addDeploySource': {
		sourceId: string;
		sourceType: RailwayWorkspacePolicyDeploySourceTypeInput;
		workspaceId: string;
	};
	'workspacePolicies.get': {
		workspaceId: string;
	};
	'workspacePolicies.removeDeploySource': {
		id: string;
	};
	'workspacePolicies.selectableDeploySources': {
		sourceType: RailwayWorkspacePolicyDeploySourceTypeInput;
		workspaceId: string;
	};
	'workspacePolicies.updateItem': {
		enabled?: boolean;
		input?: RailwayWorkspacePolicyItemUpdateInputInput;
		policy?: RailwayWorkspacePolicyNameInput;
		workspaceId: string;
	};
	'workspaceTemplates.list': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		workspaceId: string;
	};
	'workspaces.complianceAgreements': {
		workspaceId: string;
	};
	'workspaces.createInviteCode': {
		input: RailwayWorkspaceInviteCodeCreateInputInput;
		workspaceId: string;
	};
	'workspaces.delete': {
		id: string;
	};
	'workspaces.get': {
		workspaceId: string;
	};
	'workspaces.getByCode': {
		code: string;
	};
	'workspaces.identityProviders': {
		after?: string;
		before?: string;
		first?: number;
		last?: number;
		workspaceId: string;
	};
	'workspaces.leave': {
		id: string;
	};
	'workspaces.listExternal': {
		projectId?: string;
	};
	'workspaces.setRestrictProjectVisibilityToGroups': {
		enabled: boolean;
		workspaceId: string;
	};
	'workspaces.update': {
		id: string;
		input: RailwayWorkspaceUpdateInputInput;
	};
	'workspaces.updateTwoFactorEnforcement': {
		enabled: boolean;
		workspaceId: string;
	};
	'workspaces.upsertSlackChannel': {
		id: string;
	};
	'workspaces.usageTotals': {
		endDate?: string;
		/** Whether to include deleted projects in the usage. */
		includeDeleted?: boolean;
		measurements: Array<RailwayMetricMeasurementInput>;
		startDate?: string;
		workspaceId?: string;
	};
	'workspaces.useInviteCode': {
		code: string;
	};
};

export type RailwayOperationOutputs = {
	'accessGroupMembers.add': RailwayAccessGroupMember;
	'accessGroupMembers.remove': boolean;
	'accessGroupProjects.attach': RailwayAccessGroupProject;
	'accessGroupProjects.detach': boolean;
	'accessGroups.create': RailwayAccessGroup;
	'accessGroups.delete': boolean;
	'accessGroups.update': RailwayAccessGroup;
	'agentUsage.get': RailwayAgentUsageSummary;
	'agentUsage.setLimit': boolean;
	'apiTokens.create': string;
	'apiTokens.current': RailwayApiTokenContext;
	'apiTokens.delete': boolean;
	'apiTokens.list': {
		/** The nodes of this page. */
		items?: Array<RailwayApiToken> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'auditLogs.eventTypes': Array<RailwayAuditLogEventTypeInfo>;
	'auditLogs.get': RailwayAuditLog;
	'auditLogs.list': {
		/** The nodes of this page. */
		items?: Array<RailwayAuditLog> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'billing.createFreePlanSubscription': boolean;
	'billing.togglePayoutsToCredits': boolean;
	'botScopeBindings.list': Array<RailwayBotScopeBindingInfo>;
	'botScopeBindings.remove': boolean;
	'buckets.create': RailwayBucket;
	'buckets.instanceDetails': RailwayBucketInstanceDetails | null;
	'buckets.resetCredentials': RailwayBucketS3CompatibleCredentials;
	'buckets.s3Credentials': Array<RailwayBucketS3CompatibleCredentials>;
	'buckets.update': RailwayBucket;
	'canvasViews.merge': boolean;
	'canvasViews.mergePreview': RailwayCanvasViewMergePreview;
	'clearanceTokens.create': RailwayClearanceTokenCreatePayload;
	'clearanceTokens.revoke': boolean;
	'cloudAgentCheckpoints.create': RailwayCloudAgentCheckpoint;
	'cloudAgentCheckpoints.delete': boolean;
	'cloudAgentCheckpoints.get': RailwayCloudAgentCheckpoint;
	'cloudAgentCheckpoints.list': {
		/** The nodes of this page. */
		items?: Array<RailwayCloudAgentCheckpoint> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'cloudAgentConsoleSessions.list': {
		/** The nodes of this page. */
		items?: Array<RailwaySandboxSession> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'cloudAgentTasks.cancel': RailwayCloudAgentTaskCancelResult;
	'cloudAgentTasks.dispatch': RailwayCloudAgentTaskHandle;
	'cloudAgentTasks.get': RailwayCloudAgentTaskResult;
	'cloudAgentTasks.list': RailwayCloudAgentTaskPage;
	'cloudAgentTasks.models': RailwayCloudAgentTaskModels;
	'cloudAgentTasks.recover': RailwayCloudAgentTaskResult;
	'cloudAgentTasks.respond': RailwayCloudAgentTaskRespondResult;
	'cloudAgents.archive': boolean;
	'cloudAgents.create': RailwayCloudAgent;
	'cloudAgents.createDashboardFeedback': boolean;
	'cloudAgents.createFeedback': string;
	'cloudAgents.delete': boolean;
	'cloudAgents.deploy': RailwayCloudAgentDeployResult;
	'cloudAgents.fork': RailwayCloudAgent;
	'cloudAgents.get': RailwayCloudAgent | null;
	'cloudAgents.list': Array<RailwayCloudAgent>;
	'cloudAgents.listMine': Array<RailwayCloudAgent>;
	'cloudAgents.markSeen': boolean;
	'cloudAgents.renameSession': boolean;
	'cloudAgents.sleep': RailwayCloudAgent;
	'cloudAgents.unarchive': boolean;
	'cloudAgents.wake': RailwayCloudAgent;
	'customDomains.create': RailwayCustomDomain;
	'customDomains.delete': boolean;
	'customDomains.get': RailwayCustomDomain;
	'customDomains.isAvailable': RailwayDomainAvailable;
	'customDomains.issueCertificate': boolean;
	'customDomains.update': boolean;
	'databases.cancelPitrHaWorkflow': boolean;
	'databases.clearPitrHaWorkflowProgress': boolean;
	'databases.disablePitrForHaCluster': RailwayTemplateDeployPayload;
	'databases.enablePitrForHaCluster': RailwayTemplateDeployPayload;
	'databases.mysqlPitrRestorableWindow': RailwayMysqlPitrRestorableWindow;
	'databases.passwordRotationProgress': RailwayDatabasePasswordRotationProgress | null;
	'databases.pitrHaClusterReplicationHealth': RailwayPitrHaClusterReplicationHealth | null;
	'databases.pitrHaWorkflowProgress': RailwayPitrHaWorkflowProgress | null;
	'databases.postgresHaClusterUptime': RailwayPostgresHaUptimeClusterReport;
	'databases.resetPassword': RailwayDatabasePasswordResetResponse;
	'deploymentTriggers.create': RailwayDeploymentTrigger;
	'deploymentTriggers.delete': boolean;
	'deploymentTriggers.list': {
		/** The nodes of this page. */
		items?: Array<RailwayDeploymentTrigger> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'deploymentTriggers.update': RailwayDeploymentTrigger;
	'deployments.approve': boolean;
	'deployments.buildLogs': Array<RailwayLog>;
	'deployments.cancel': boolean;
	'deployments.createInstanceExecution': boolean;
	'deployments.events': {
		/** The nodes of this page. */
		items?: Array<RailwayDeploymentEvent> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'deployments.get': RailwayDeployment;
	'deployments.instanceExecutions': {
		/** The nodes of this page. */
		items?: Array<RailwayDeploymentInstanceExecution> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'deployments.list': {
		/** The nodes of this page. */
		items?: Array<RailwayDeployment> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'deployments.logs': Array<RailwayLog>;
	'deployments.redeploy': RailwayDeployment;
	'deployments.remove': boolean;
	'deployments.restart': boolean;
	'deployments.rollback': boolean;
	'deployments.snapshot': RailwayDeploymentSnapshot | null;
	'deployments.stop': boolean;
	'dnsQueryLogs.list': Array<RailwayDnsQueryLog>;
	'dockerCompose.import': RailwayDockerComposeImport;
	'domains.list': RailwayAllDomains;
	'egressGateways.clearAssociations': boolean;
	'egressGateways.createAssociation': Array<RailwayEgressGateway>;
	'egressGateways.haMigrationPreview': RailwayEgressMigrationResult;
	'egressGateways.haPreview': Array<RailwayEgressGateway>;
	'egressGateways.legacyPreview': Array<RailwayEgressGateway>;
	'egressGateways.list': Array<RailwayEgressGateway>;
	'egressGateways.rollbackFromHa': Array<RailwayEgressGateway>;
	'egressGateways.upgradeToHa': Array<RailwayEgressGateway>;
	'environmentPatches.commit': string;
	'environmentPatches.commitStaged': string;
	'environmentPatches.dismissFailure': boolean;
	'environmentPatches.get': RailwayEnvironmentPatch;
	'environmentPatches.list': {
		/** The nodes of this page. */
		items?: Array<RailwayEnvironmentPatch> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'environmentPatches.restage': RailwayEnvironmentPatch;
	'environments.applyChangeSet': RailwayChangeSetApplyResult;
	'environments.changeSetApplyStatus': RailwayChangeSetApplyResult;
	'environments.create': RailwayEnvironment;
	'environments.delete': boolean;
	'environments.get': RailwayEnvironment;
	'environments.hasLegacyStaticEgress': boolean;
	'environments.history': {
		/** The nodes of this page. */
		items?: Array<RailwayProjectHistoryEntry> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'environments.iacPartialRelease': RailwayIacPartialOwnershipResult;
	'environments.iacPartialTransfer': RailwayIacPartialOwnershipResult;
	'environments.list': {
		/** The nodes of this page. */
		items?: Array<RailwayEnvironment> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'environments.logs': Array<RailwayLog>;
	'environments.overrideBase': boolean;
	'environments.pendingWork': Array<RailwayProjectOperation>;
	'environments.previewChangeSet': RailwayChangeSetPreview;
	'environments.rename': RailwayEnvironment;
	'environments.stageChanges': RailwayEnvironmentPatch;
	'environments.stagedChanges': RailwayEnvironmentPatch;
	'environments.triggerDeploys': boolean;
	'environments.unskipService': boolean;
	'environments.updateClearanceDefault': boolean;
	'environments.upsertConfigPlanComment': RailwayEnvironmentConfigPlanCommentUpsertResult;
	'events.list': {
		/** The nodes of this page. */
		items?: Array<RailwayEvent> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'featureFlags.add': boolean;
	'featureFlags.listPlatform': Array<RailwayPlatformFeatureFlagStatus>;
	'featureFlags.remove': boolean;
	'functionRuntimes.get': RailwayFunctionRuntime;
	'functionRuntimes.list': Array<RailwayFunctionRuntime>;
	'github.prInfo': RailwayGitHubPRInfo | null;
	'github.prInfoResult': RailwayGitHubPRInfoResult;
	'github.repoAccessAvailable': RailwayGitHubAccess;
	'github.repos.branches': Array<RailwayGitHubBranch>;
	'github.repos.deploy': string;
	'github.repos.get': RailwayGitHubRepoWithoutInstallation;
	'github.repos.isNameAvailable': boolean;
	'github.repos.list': Array<RailwayGitHubRepo>;
	'github.repos.update': boolean;
	'github.sshKeys': Array<RailwayGitHubSshKey>;
	'github.writableScopes': Array<string>;
	'httpLogs.list': Array<RailwayHttpLog>;
	'httpMetrics.duration': RailwayHttpDurationMetricsResult;
	'httpMetrics.get': RailwayHttpMetricsResult;
	'httpMetrics.groupedByStatus': Array<RailwayHttpMetricsByStatusResult>;
	'inviteCodes.get': RailwayInviteCode;
	'inviteCodes.use': RailwayProject;
	'me.get': RailwayUser;
	'metrics.get': Array<RailwayMetricsResult>;
	'networkFlowLogs.list': Array<RailwayNetworkFlowLog>;
	'notificationDeliveries.get': RailwayNotificationDelivery | null;
	'notificationDeliveries.list': {
		/** The nodes of this page. */
		items?: Array<RailwayNotificationDelivery> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'notificationDeliveries.markAsRead': boolean;
	'notificationRules.create': RailwayNotificationRule;
	'notificationRules.delete': boolean;
	'notificationRules.list': Array<RailwayNotificationRule>;
	'notificationRules.update': RailwayNotificationRule;
	'notificationRules.upsertSlackChannel': boolean;
	'observabilityDashboardMonitors.create': boolean;
	'observabilityDashboardMonitors.remove': boolean;
	'observabilityDashboardMonitors.update': boolean;
	'observabilityDashboards.create': boolean;
	'observabilityDashboards.list': {
		/** The nodes of this page. */
		items?: Array<RailwayObservabilityDashboard> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'observabilityDashboards.reset': boolean;
	'observabilityDashboards.update': boolean;
	'passkeys.list': {
		/** The nodes of this page. */
		items?: Array<RailwayPasskey> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'platform.stats': RailwayPublicStats;
	'platform.status': RailwayPlatformStatus;
	'preferences.get': RailwayPreferences;
	'preferences.update': RailwayPreferences;
	'privateNetworkEndpoints.get': RailwayPrivateNetworkEndpoint | null;
	'privateNetworkEndpoints.isNameAvailable': boolean;
	'privateNetworkEndpoints.rename': boolean;
	'privateNetworks.list': Array<RailwayPrivateNetwork>;
	'projectFavorites.list': Array<string>;
	'projectFavorites.set': boolean;
	'projectInvitations.accept': RailwayProjectPermission;
	'projectInvitations.create': RailwayProjectInvitation;
	'projectInvitations.createInviteCode': RailwayInviteCode;
	'projectInvitations.delete': boolean;
	'projectInvitations.get': RailwayPublicProjectInvitation;
	'projectInvitations.inviteCode': RailwayInviteCode;
	'projectInvitations.list': Array<RailwayProjectInvitation>;
	'projectInvitations.resend': RailwayProjectInvitation;
	'projectMembers.add': RailwayProjectMember;
	'projectMembers.list': Array<RailwayProjectMember>;
	'projectMembers.remove': Array<RailwayProjectMember>;
	'projectMembers.update': RailwayProjectMember;
	'projectTokens.create': string;
	'projectTokens.delete': boolean;
	'projectTokens.get': RailwayProjectToken;
	'projectTokens.list': {
		/** The nodes of this page. */
		items?: Array<RailwayProjectToken> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'projects.addFeatureFlag': boolean;
	'projects.cancelScheduledDelete': boolean;
	'projects.claim': RailwayProject;
	'projects.compliance': RailwayProjectComplianceInfo;
	'projects.confirmTransfer': boolean;
	'projects.create': RailwayProject;
	'projects.delete': boolean;
	'projects.forceScheduledDelete': boolean;
	'projects.get': RailwayProject;
	'projects.initiateTransfer': boolean;
	'projects.leave': boolean;
	'projects.list': {
		/** The nodes of this page. */
		items?: Array<RailwayProject> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'projects.listByIds': Array<RailwayProject>;
	'projects.removeFeatureFlag': boolean;
	'projects.resourceAccess': RailwayProjectResourceAccess;
	'projects.scheduleDelete': boolean;
	'projects.serviceUsage': RailwayProjectServiceUsagePage;
	'projects.transfer': boolean;
	'projects.update': RailwayProject;
	'projects.updateClearanceDefault': boolean;
	'projects.workspaceMembers': RailwayProjectWorkspaceMembersResponse;
	'railwayDomainDnsRecords.create': RailwayRailwayDomainDnsRecord;
	'railwayDomainDnsRecords.delete': boolean;
	'railwayDomainDnsRecords.list': Array<RailwayRailwayDomainDnsRecord>;
	'railwayDomainDnsRecords.update': RailwayRailwayDomainDnsRecord;
	'railwayDomainEmailForwardingRules.create': RailwayRailwayDomainEmailForwardingRule;
	'railwayDomainEmailForwardingRules.delete': boolean;
	'railwayDomainEmailForwardingRules.list': Array<RailwayRailwayDomainEmailForwardingRule>;
	'railwayDomainEmailForwardingRules.removeAll': RailwayRailwayDomainEmailForwardingTeardown;
	'railwayDomainEmailForwardingRules.sendTest': RailwayRailwayDomainEmailForwardingRule;
	'railwayDomainEmailForwardingRules.update': RailwayRailwayDomainEmailForwardingRule;
	'railwayDomains.emailForwardingEligibility': RailwayRailwayDomainEmailForwardingEligibility;
	'railwayDomains.emailForwardingLimits': RailwayRailwayDomainEmailForwardingLimits;
	'railwayDomains.get': RailwayRailwayDomain;
	'railwayDomains.getByName': RailwayRailwayDomain;
	'railwayDomains.list': Array<RailwayRailwayDomain>;
	'railwayDomains.setNameservers': RailwayRailwayDomainNameservers;
	'railwayDomains.update': RailwayRailwayDomain;
	'referral.get': RailwayReferralInfo;
	'referral.update': RailwayReferralInfo;
	'regions.list': Array<RailwayRegion>;
	'resourceAccess.get': RailwayResourceAccess;
	'sandboxCheckpoints.create': RailwaySandboxCheckpoint;
	'sandboxCheckpoints.delete': boolean;
	'sandboxCheckpoints.list': Array<RailwaySandboxCheckpoint>;
	'sandboxCheckpoints.rename': RailwaySandboxCheckpoint;
	'sandboxSessions.list': {
		/** The nodes of this page. */
		items?: Array<RailwaySandboxSession> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'sandboxes.buildTemplate': RailwaySandboxTemplateBuild;
	'sandboxes.create': RailwaySandbox;
	'sandboxes.destroy': RailwaySandbox | null;
	'sandboxes.get': RailwaySandbox | null;
	'sandboxes.heartbeat': RailwaySandbox | null;
	'sandboxes.list': {
		/** The nodes of this page. */
		items?: Array<RailwaySandbox> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'sandboxes.templateBuild': RailwaySandboxTemplateBuild;
	'serviceDomains.create': RailwayServiceDomain;
	'serviceDomains.delete': boolean;
	'serviceDomains.isAvailable': RailwayDomainAvailable;
	'serviceDomains.update': boolean;
	'serviceInstances.autoDeployStatus': RailwayServiceInstanceAutoDeployStatus;
	'serviceInstances.clearAutoUpdateSnooze': boolean;
	'serviceInstances.deploy': boolean;
	'serviceInstances.deployV2': string;
	'serviceInstances.dismissVulnRemediation': boolean;
	'serviceInstances.get': RailwayServiceInstance;
	'serviceInstances.isUpdatable': boolean;
	'serviceInstances.limitOverride': RailwayJsonValue | null;
	'serviceInstances.limits': RailwayJsonValue;
	'serviceInstances.patchVulnNow': string;
	'serviceInstances.redeploy': boolean;
	'serviceInstances.snoozeAutoUpdate': boolean;
	'serviceInstances.update': boolean;
	'serviceInstances.updateAutoDeploy': RailwayServiceInstanceAutoDeployUpdateResult;
	'serviceInstances.updateAutoUpdateSchedule': boolean;
	'serviceInstances.updateClearance': boolean;
	'serviceInstances.updateLimits': boolean;
	'services.acknowledgeTakedown': RailwayServiceTakedownAcknowledgment;
	'services.addFeatureFlag': boolean;
	'services.connect': RailwayService;
	'services.create': RailwayService;
	'services.delete': boolean;
	'services.disableCdn': boolean;
	'services.disconnect': RailwayService;
	'services.enableCdn': RailwayEdgeConfig;
	'services.generateShellToken': string;
	'services.get': RailwayService;
	'services.purgeCache': boolean;
	'services.removeFeatureFlag': boolean;
	'services.removeUpstreamUrl': RailwayService;
	'services.setUnderAttackMode': RailwayEdgeConfig;
	'services.update': RailwayService;
	'services.updateEdgeConfig': RailwayEdgeConfig;
	'services.updateEdgeRules': RailwayEdgeConfig;
	'services.updateKind': boolean;
	'services.validateEdgeRules': Array<RailwayEdgeRuleDiagnostic>;
	'sessions.delete': boolean;
	'sessions.list': {
		/** The nodes of this page. */
		items?: Array<RailwaySession> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'sharedVariables.configure': RailwayVariable;
	'signals.changes': Array<RailwaySignalChange>;
	'signals.create': RailwaySignal;
	'signals.delete': RailwaySignal;
	'signals.evaluate': RailwaySignalEvaluation;
	'signals.get': RailwaySignal | null;
	'signals.list': Array<RailwaySignal>;
	'signals.replace': RailwaySignal;
	'signals.rollback': RailwaySignal;
	'signals.setDefault': RailwaySignal;
	'signals.setRule': RailwaySignal;
	'signals.unsetRule': RailwaySignal;
	'sshPublicKeys.approveSignup': boolean;
	'sshPublicKeys.create': RailwaySshPublicKey;
	'sshPublicKeys.delete': boolean;
	'sshPublicKeys.list': {
		/** The nodes of this page. */
		items?: Array<RailwaySshPublicKey> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'sshPublicKeys.signupInfo': RailwaySSHSignupInfo;
	'tcpProxies.delete': boolean;
	'tcpProxies.list': Array<RailwayTCPProxy>;
	'templates.clone': RailwayTemplate;
	'templates.count': number;
	'templates.delete': boolean;
	'templates.deploy': RailwayTemplateDeployPayload;
	'templates.ejectServiceSource': boolean;
	'templates.generate': RailwayTemplate;
	'templates.get': RailwayTemplate;
	'templates.list': {
		/** The nodes of this page. */
		items?: Array<RailwayTemplate> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'templates.metrics': RailwayTemplateMetrics;
	'templates.publish': RailwayTemplate;
	'templates.revert': RailwayTemplateDeployPayload;
	'templates.search': {
		/** The nodes of this page. */
		items?: Array<RailwayTemplateSearchResult> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'templates.sourceForProject': RailwayTemplate | null;
	'templates.unpublish': boolean;
	'templates.updateVolume': RailwayTemplate;
	'traces.get': Array<RailwayTraceSpan>;
	'traces.list': Array<RailwayTraceSummary>;
	'traces.status': Array<RailwayServiceTracingStatus>;
	'trustedDomains.create': RailwayTrustedDomain;
	'trustedDomains.delete': boolean;
	'trustedDomains.list': {
		/** The nodes of this page. */
		items?: Array<RailwayTrustedDomain> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'trustedDomains.retriggerVerification': RailwayTrustedDomain | null;
	'trustedDomains.update': RailwayTrustedDomain;
	'twoFactor.get': RailwayTwoFactorInfo;
	'usage.estimated': Array<RailwayEstimatedUsage>;
	'usage.get': Array<RailwayAggregatedUsage>;
	'usage.removeLimit': boolean;
	'usage.setLimit': boolean;
	'user.agreeToFairUse': boolean;
	'user.delete': boolean;
	'user.disconnectDiscord': boolean;
	'user.pendingEmailChange': RailwayPendingEmailChange | null;
	'user.removeProviderAuth': boolean;
	'user.updateTerms': RailwayUser | null;
	'userProfile.get': RailwayUserProfileResponse;
	'userProfile.update': boolean;
	'variables.delete': boolean;
	'variables.forServiceDeployment': Record<string, string>;
	'variables.list': Record<string, string>;
	'variables.upsert': boolean;
	'variables.upsertMany': boolean;
	'volumeInstanceBackupSchedules.list': Array<RailwayVolumeInstanceBackupSchedule>;
	'volumeInstanceBackupSchedules.update': boolean;
	'volumeInstanceBackups.create': RailwayWorkflowId;
	'volumeInstanceBackups.delete': RailwayWorkflowId;
	'volumeInstanceBackups.list': Array<RailwayVolumeInstanceBackup>;
	'volumeInstanceBackups.lock': boolean;
	'volumeInstanceBackups.restore': RailwayWorkflowId;
	'volumeInstances.get': RailwayVolumeInstance;
	'volumeInstances.pitrRestore': RailwayWorkflowId;
	'volumeInstances.pitrRestoreEstimate': RailwayPitrRestoreScratchEstimate | null;
	'volumeInstances.update': boolean;
	'volumes.create': RailwayVolume;
	'volumes.delete': boolean;
	'volumes.update': RailwayVolume;
	'webhooks.test': number;
	'workflows.status': RailwayWorkflowResult;
	'workspaceApiTokens.delete': boolean;
	'workspaceApiTokens.list': {
		/** The nodes of this page. */
		items?: Array<RailwayApiToken> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'workspaceMembers.changeRole': boolean;
	'workspaceMembers.invite': boolean;
	'workspaceMembers.remove': boolean;
	'workspacePolicies.addDeploySource': RailwayWorkspacePolicyDeploySourceAllowlist;
	'workspacePolicies.get': RailwayWorkspacePolicy | null;
	'workspacePolicies.removeDeploySource': boolean;
	'workspacePolicies.selectableDeploySources': Array<RailwayWorkspacePolicySelectableDeploySource>;
	'workspacePolicies.updateItem': boolean;
	'workspaceTemplates.list': {
		/** The nodes of this page. */
		items?: Array<RailwayTemplate> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'workspaces.complianceAgreements': RailwayComplianceAgreementsInfo;
	'workspaces.createInviteCode': string;
	'workspaces.delete': boolean;
	'workspaces.get': RailwayWorkspace;
	'workspaces.getByCode': RailwayWorkspace;
	'workspaces.identityProviders': {
		/** The nodes of this page. */
		items?: Array<RailwayWorkspaceIdentityProvider> | null;
		pageInfo?: {
			hasNextPage?: boolean | null;
			hasPreviousPage?: boolean | null;
			/** Pass as `before` for the page before. */
			startCursor?: string | null;
			/** Pass as `after` for the next page. */
			endCursor?: string | null;
		} | null;
	};
	'workspaces.leave': boolean;
	'workspaces.listExternal': Array<RailwayExternalWorkspace>;
	'workspaces.setRestrictProjectVisibilityToGroups': boolean;
	'workspaces.update': boolean;
	'workspaces.updateTwoFactorEnforcement': boolean;
	'workspaces.upsertSlackChannel': boolean;
	'workspaces.usageTotals': Array<RailwayAggregatedUsage>;
	'workspaces.useInviteCode': RailwayWorkspace;
};
