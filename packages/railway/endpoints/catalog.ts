// Generated with endpoints/operation-types.ts from Railway's GraphQL schema:
// one entry per operation in railway-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { railwaySchemaEntry } from './openapi-schema';
import { createRailwayOperation as op } from './operations';

export const railwayEndpointsNested = {
	accessGroupMembers: {
		add: op('accessGroupMembers.add'),
		remove: op('accessGroupMembers.remove'),
	},
	accessGroupProjects: {
		attach: op('accessGroupProjects.attach'),
		detach: op('accessGroupProjects.detach'),
	},
	accessGroups: {
		create: op('accessGroups.create'),
		delete: op('accessGroups.delete'),
		update: op('accessGroups.update'),
	},
	agentUsage: {
		get: op('agentUsage.get'),
		setLimit: op('agentUsage.setLimit'),
	},
	apiTokens: {
		create: op('apiTokens.create'),
		current: op('apiTokens.current'),
		delete: op('apiTokens.delete'),
		list: op('apiTokens.list'),
	},
	auditLogs: {
		eventTypes: op('auditLogs.eventTypes'),
		get: op('auditLogs.get'),
		list: op('auditLogs.list'),
	},
	billing: {
		createFreePlanSubscription: op('billing.createFreePlanSubscription'),
		togglePayoutsToCredits: op('billing.togglePayoutsToCredits'),
	},
	botScopeBindings: {
		list: op('botScopeBindings.list'),
		remove: op('botScopeBindings.remove'),
	},
	buckets: {
		create: op('buckets.create'),
		instanceDetails: op('buckets.instanceDetails'),
		resetCredentials: op('buckets.resetCredentials'),
		s3Credentials: op('buckets.s3Credentials'),
		update: op('buckets.update'),
	},
	canvasViews: {
		merge: op('canvasViews.merge'),
		mergePreview: op('canvasViews.mergePreview'),
	},
	clearanceTokens: {
		create: op('clearanceTokens.create'),
		revoke: op('clearanceTokens.revoke'),
	},
	cloudAgentCheckpoints: {
		create: op('cloudAgentCheckpoints.create'),
		delete: op('cloudAgentCheckpoints.delete'),
		get: op('cloudAgentCheckpoints.get'),
		list: op('cloudAgentCheckpoints.list'),
	},
	cloudAgentConsoleSessions: {
		list: op('cloudAgentConsoleSessions.list'),
	},
	cloudAgentTasks: {
		cancel: op('cloudAgentTasks.cancel'),
		dispatch: op('cloudAgentTasks.dispatch'),
		get: op('cloudAgentTasks.get'),
		list: op('cloudAgentTasks.list'),
		models: op('cloudAgentTasks.models'),
		recover: op('cloudAgentTasks.recover'),
		respond: op('cloudAgentTasks.respond'),
	},
	cloudAgents: {
		archive: op('cloudAgents.archive'),
		create: op('cloudAgents.create'),
		createDashboardFeedback: op('cloudAgents.createDashboardFeedback'),
		createFeedback: op('cloudAgents.createFeedback'),
		delete: op('cloudAgents.delete'),
		deploy: op('cloudAgents.deploy'),
		fork: op('cloudAgents.fork'),
		get: op('cloudAgents.get'),
		list: op('cloudAgents.list'),
		listMine: op('cloudAgents.listMine'),
		markSeen: op('cloudAgents.markSeen'),
		renameSession: op('cloudAgents.renameSession'),
		sleep: op('cloudAgents.sleep'),
		unarchive: op('cloudAgents.unarchive'),
		wake: op('cloudAgents.wake'),
	},
	customDomains: {
		create: op('customDomains.create'),
		delete: op('customDomains.delete'),
		get: op('customDomains.get'),
		isAvailable: op('customDomains.isAvailable'),
		issueCertificate: op('customDomains.issueCertificate'),
		update: op('customDomains.update'),
	},
	databases: {
		cancelPitrHaWorkflow: op('databases.cancelPitrHaWorkflow'),
		clearPitrHaWorkflowProgress: op('databases.clearPitrHaWorkflowProgress'),
		disablePitrForHaCluster: op('databases.disablePitrForHaCluster'),
		enablePitrForHaCluster: op('databases.enablePitrForHaCluster'),
		mysqlPitrRestorableWindow: op('databases.mysqlPitrRestorableWindow'),
		passwordRotationProgress: op('databases.passwordRotationProgress'),
		pitrHaClusterReplicationHealth: op(
			'databases.pitrHaClusterReplicationHealth',
		),
		pitrHaWorkflowProgress: op('databases.pitrHaWorkflowProgress'),
		postgresHaClusterUptime: op('databases.postgresHaClusterUptime'),
		resetPassword: op('databases.resetPassword'),
	},
	deploymentTriggers: {
		create: op('deploymentTriggers.create'),
		delete: op('deploymentTriggers.delete'),
		list: op('deploymentTriggers.list'),
		update: op('deploymentTriggers.update'),
	},
	deployments: {
		approve: op('deployments.approve'),
		buildLogs: op('deployments.buildLogs'),
		cancel: op('deployments.cancel'),
		createInstanceExecution: op('deployments.createInstanceExecution'),
		events: op('deployments.events'),
		get: op('deployments.get'),
		instanceExecutions: op('deployments.instanceExecutions'),
		list: op('deployments.list'),
		logs: op('deployments.logs'),
		redeploy: op('deployments.redeploy'),
		remove: op('deployments.remove'),
		restart: op('deployments.restart'),
		rollback: op('deployments.rollback'),
		snapshot: op('deployments.snapshot'),
		stop: op('deployments.stop'),
	},
	dnsQueryLogs: {
		list: op('dnsQueryLogs.list'),
	},
	dockerCompose: {
		import: op('dockerCompose.import'),
	},
	domains: {
		list: op('domains.list'),
	},
	egressGateways: {
		clearAssociations: op('egressGateways.clearAssociations'),
		createAssociation: op('egressGateways.createAssociation'),
		haMigrationPreview: op('egressGateways.haMigrationPreview'),
		haPreview: op('egressGateways.haPreview'),
		legacyPreview: op('egressGateways.legacyPreview'),
		list: op('egressGateways.list'),
		rollbackFromHa: op('egressGateways.rollbackFromHa'),
		upgradeToHa: op('egressGateways.upgradeToHa'),
	},
	environmentPatches: {
		commit: op('environmentPatches.commit'),
		commitStaged: op('environmentPatches.commitStaged'),
		dismissFailure: op('environmentPatches.dismissFailure'),
		get: op('environmentPatches.get'),
		list: op('environmentPatches.list'),
		restage: op('environmentPatches.restage'),
	},
	environments: {
		applyChangeSet: op('environments.applyChangeSet'),
		changeSetApplyStatus: op('environments.changeSetApplyStatus'),
		create: op('environments.create'),
		delete: op('environments.delete'),
		get: op('environments.get'),
		hasLegacyStaticEgress: op('environments.hasLegacyStaticEgress'),
		history: op('environments.history'),
		iacPartialRelease: op('environments.iacPartialRelease'),
		iacPartialTransfer: op('environments.iacPartialTransfer'),
		list: op('environments.list'),
		logs: op('environments.logs'),
		overrideBase: op('environments.overrideBase'),
		pendingWork: op('environments.pendingWork'),
		previewChangeSet: op('environments.previewChangeSet'),
		rename: op('environments.rename'),
		stageChanges: op('environments.stageChanges'),
		stagedChanges: op('environments.stagedChanges'),
		triggerDeploys: op('environments.triggerDeploys'),
		unskipService: op('environments.unskipService'),
		updateClearanceDefault: op('environments.updateClearanceDefault'),
		upsertConfigPlanComment: op('environments.upsertConfigPlanComment'),
	},
	events: {
		list: op('events.list'),
	},
	featureFlags: {
		add: op('featureFlags.add'),
		listPlatform: op('featureFlags.listPlatform'),
		remove: op('featureFlags.remove'),
	},
	functionRuntimes: {
		get: op('functionRuntimes.get'),
		list: op('functionRuntimes.list'),
	},
	github: {
		prInfo: op('github.prInfo'),
		prInfoResult: op('github.prInfoResult'),
		repoAccessAvailable: op('github.repoAccessAvailable'),
		repos: {
			branches: op('github.repos.branches'),
			deploy: op('github.repos.deploy'),
			get: op('github.repos.get'),
			isNameAvailable: op('github.repos.isNameAvailable'),
			list: op('github.repos.list'),
			update: op('github.repos.update'),
		},
		sshKeys: op('github.sshKeys'),
		writableScopes: op('github.writableScopes'),
	},
	httpLogs: {
		list: op('httpLogs.list'),
	},
	httpMetrics: {
		duration: op('httpMetrics.duration'),
		get: op('httpMetrics.get'),
		groupedByStatus: op('httpMetrics.groupedByStatus'),
	},
	inviteCodes: {
		get: op('inviteCodes.get'),
		use: op('inviteCodes.use'),
	},
	me: {
		get: op('me.get'),
	},
	metrics: {
		get: op('metrics.get'),
	},
	networkFlowLogs: {
		list: op('networkFlowLogs.list'),
	},
	notificationDeliveries: {
		get: op('notificationDeliveries.get'),
		list: op('notificationDeliveries.list'),
		markAsRead: op('notificationDeliveries.markAsRead'),
	},
	notificationRules: {
		create: op('notificationRules.create'),
		delete: op('notificationRules.delete'),
		list: op('notificationRules.list'),
		update: op('notificationRules.update'),
		upsertSlackChannel: op('notificationRules.upsertSlackChannel'),
	},
	observabilityDashboardMonitors: {
		create: op('observabilityDashboardMonitors.create'),
		remove: op('observabilityDashboardMonitors.remove'),
		update: op('observabilityDashboardMonitors.update'),
	},
	observabilityDashboards: {
		create: op('observabilityDashboards.create'),
		list: op('observabilityDashboards.list'),
		reset: op('observabilityDashboards.reset'),
		update: op('observabilityDashboards.update'),
	},
	passkeys: {
		list: op('passkeys.list'),
	},
	platform: {
		stats: op('platform.stats'),
		status: op('platform.status'),
	},
	preferences: {
		get: op('preferences.get'),
		update: op('preferences.update'),
	},
	privateNetworkEndpoints: {
		get: op('privateNetworkEndpoints.get'),
		isNameAvailable: op('privateNetworkEndpoints.isNameAvailable'),
		rename: op('privateNetworkEndpoints.rename'),
	},
	privateNetworks: {
		list: op('privateNetworks.list'),
	},
	projectFavorites: {
		list: op('projectFavorites.list'),
		set: op('projectFavorites.set'),
	},
	projectInvitations: {
		accept: op('projectInvitations.accept'),
		create: op('projectInvitations.create'),
		createInviteCode: op('projectInvitations.createInviteCode'),
		delete: op('projectInvitations.delete'),
		get: op('projectInvitations.get'),
		inviteCode: op('projectInvitations.inviteCode'),
		list: op('projectInvitations.list'),
		resend: op('projectInvitations.resend'),
	},
	projectMembers: {
		add: op('projectMembers.add'),
		list: op('projectMembers.list'),
		remove: op('projectMembers.remove'),
		update: op('projectMembers.update'),
	},
	projectTokens: {
		create: op('projectTokens.create'),
		delete: op('projectTokens.delete'),
		get: op('projectTokens.get'),
		list: op('projectTokens.list'),
	},
	projects: {
		addFeatureFlag: op('projects.addFeatureFlag'),
		cancelScheduledDelete: op('projects.cancelScheduledDelete'),
		claim: op('projects.claim'),
		compliance: op('projects.compliance'),
		confirmTransfer: op('projects.confirmTransfer'),
		create: op('projects.create'),
		delete: op('projects.delete'),
		forceScheduledDelete: op('projects.forceScheduledDelete'),
		get: op('projects.get'),
		initiateTransfer: op('projects.initiateTransfer'),
		leave: op('projects.leave'),
		list: op('projects.list'),
		listByIds: op('projects.listByIds'),
		removeFeatureFlag: op('projects.removeFeatureFlag'),
		resourceAccess: op('projects.resourceAccess'),
		scheduleDelete: op('projects.scheduleDelete'),
		serviceUsage: op('projects.serviceUsage'),
		transfer: op('projects.transfer'),
		update: op('projects.update'),
		updateClearanceDefault: op('projects.updateClearanceDefault'),
		workspaceMembers: op('projects.workspaceMembers'),
	},
	railwayDomainDnsRecords: {
		create: op('railwayDomainDnsRecords.create'),
		delete: op('railwayDomainDnsRecords.delete'),
		list: op('railwayDomainDnsRecords.list'),
		update: op('railwayDomainDnsRecords.update'),
	},
	railwayDomainEmailForwardingRules: {
		create: op('railwayDomainEmailForwardingRules.create'),
		delete: op('railwayDomainEmailForwardingRules.delete'),
		list: op('railwayDomainEmailForwardingRules.list'),
		removeAll: op('railwayDomainEmailForwardingRules.removeAll'),
		sendTest: op('railwayDomainEmailForwardingRules.sendTest'),
		update: op('railwayDomainEmailForwardingRules.update'),
	},
	railwayDomains: {
		emailForwardingEligibility: op('railwayDomains.emailForwardingEligibility'),
		emailForwardingLimits: op('railwayDomains.emailForwardingLimits'),
		get: op('railwayDomains.get'),
		getByName: op('railwayDomains.getByName'),
		list: op('railwayDomains.list'),
		setNameservers: op('railwayDomains.setNameservers'),
		update: op('railwayDomains.update'),
	},
	referral: {
		get: op('referral.get'),
		update: op('referral.update'),
	},
	regions: {
		list: op('regions.list'),
	},
	resourceAccess: {
		get: op('resourceAccess.get'),
	},
	sandboxCheckpoints: {
		create: op('sandboxCheckpoints.create'),
		delete: op('sandboxCheckpoints.delete'),
		list: op('sandboxCheckpoints.list'),
		rename: op('sandboxCheckpoints.rename'),
	},
	sandboxSessions: {
		list: op('sandboxSessions.list'),
	},
	sandboxes: {
		buildTemplate: op('sandboxes.buildTemplate'),
		create: op('sandboxes.create'),
		destroy: op('sandboxes.destroy'),
		get: op('sandboxes.get'),
		heartbeat: op('sandboxes.heartbeat'),
		list: op('sandboxes.list'),
		templateBuild: op('sandboxes.templateBuild'),
	},
	serviceDomains: {
		create: op('serviceDomains.create'),
		delete: op('serviceDomains.delete'),
		isAvailable: op('serviceDomains.isAvailable'),
		update: op('serviceDomains.update'),
	},
	serviceInstances: {
		autoDeployStatus: op('serviceInstances.autoDeployStatus'),
		clearAutoUpdateSnooze: op('serviceInstances.clearAutoUpdateSnooze'),
		deploy: op('serviceInstances.deploy'),
		deployV2: op('serviceInstances.deployV2'),
		dismissVulnRemediation: op('serviceInstances.dismissVulnRemediation'),
		get: op('serviceInstances.get'),
		isUpdatable: op('serviceInstances.isUpdatable'),
		limitOverride: op('serviceInstances.limitOverride'),
		limits: op('serviceInstances.limits'),
		patchVulnNow: op('serviceInstances.patchVulnNow'),
		redeploy: op('serviceInstances.redeploy'),
		snoozeAutoUpdate: op('serviceInstances.snoozeAutoUpdate'),
		update: op('serviceInstances.update'),
		updateAutoDeploy: op('serviceInstances.updateAutoDeploy'),
		updateAutoUpdateSchedule: op('serviceInstances.updateAutoUpdateSchedule'),
		updateClearance: op('serviceInstances.updateClearance'),
		updateLimits: op('serviceInstances.updateLimits'),
	},
	services: {
		acknowledgeTakedown: op('services.acknowledgeTakedown'),
		addFeatureFlag: op('services.addFeatureFlag'),
		connect: op('services.connect'),
		create: op('services.create'),
		delete: op('services.delete'),
		disableCdn: op('services.disableCdn'),
		disconnect: op('services.disconnect'),
		enableCdn: op('services.enableCdn'),
		generateShellToken: op('services.generateShellToken'),
		get: op('services.get'),
		purgeCache: op('services.purgeCache'),
		removeFeatureFlag: op('services.removeFeatureFlag'),
		removeUpstreamUrl: op('services.removeUpstreamUrl'),
		setUnderAttackMode: op('services.setUnderAttackMode'),
		update: op('services.update'),
		updateEdgeConfig: op('services.updateEdgeConfig'),
		updateEdgeRules: op('services.updateEdgeRules'),
		updateKind: op('services.updateKind'),
		validateEdgeRules: op('services.validateEdgeRules'),
	},
	sessions: {
		delete: op('sessions.delete'),
		list: op('sessions.list'),
	},
	sharedVariables: {
		configure: op('sharedVariables.configure'),
	},
	signals: {
		changes: op('signals.changes'),
		create: op('signals.create'),
		delete: op('signals.delete'),
		evaluate: op('signals.evaluate'),
		get: op('signals.get'),
		list: op('signals.list'),
		replace: op('signals.replace'),
		rollback: op('signals.rollback'),
		setDefault: op('signals.setDefault'),
		setRule: op('signals.setRule'),
		unsetRule: op('signals.unsetRule'),
	},
	sshPublicKeys: {
		approveSignup: op('sshPublicKeys.approveSignup'),
		create: op('sshPublicKeys.create'),
		delete: op('sshPublicKeys.delete'),
		list: op('sshPublicKeys.list'),
		signupInfo: op('sshPublicKeys.signupInfo'),
	},
	tcpProxies: {
		delete: op('tcpProxies.delete'),
		list: op('tcpProxies.list'),
	},
	templates: {
		clone: op('templates.clone'),
		count: op('templates.count'),
		delete: op('templates.delete'),
		deploy: op('templates.deploy'),
		ejectServiceSource: op('templates.ejectServiceSource'),
		generate: op('templates.generate'),
		get: op('templates.get'),
		list: op('templates.list'),
		metrics: op('templates.metrics'),
		publish: op('templates.publish'),
		revert: op('templates.revert'),
		search: op('templates.search'),
		sourceForProject: op('templates.sourceForProject'),
		unpublish: op('templates.unpublish'),
		updateVolume: op('templates.updateVolume'),
	},
	traces: {
		get: op('traces.get'),
		list: op('traces.list'),
		status: op('traces.status'),
	},
	trustedDomains: {
		create: op('trustedDomains.create'),
		delete: op('trustedDomains.delete'),
		list: op('trustedDomains.list'),
		retriggerVerification: op('trustedDomains.retriggerVerification'),
		update: op('trustedDomains.update'),
	},
	twoFactor: {
		get: op('twoFactor.get'),
	},
	usage: {
		estimated: op('usage.estimated'),
		get: op('usage.get'),
		removeLimit: op('usage.removeLimit'),
		setLimit: op('usage.setLimit'),
	},
	user: {
		agreeToFairUse: op('user.agreeToFairUse'),
		delete: op('user.delete'),
		disconnectDiscord: op('user.disconnectDiscord'),
		pendingEmailChange: op('user.pendingEmailChange'),
		removeProviderAuth: op('user.removeProviderAuth'),
		updateTerms: op('user.updateTerms'),
	},
	userProfile: {
		get: op('userProfile.get'),
		update: op('userProfile.update'),
	},
	variables: {
		delete: op('variables.delete'),
		forServiceDeployment: op('variables.forServiceDeployment'),
		list: op('variables.list'),
		upsert: op('variables.upsert'),
		upsertMany: op('variables.upsertMany'),
	},
	volumeInstanceBackupSchedules: {
		list: op('volumeInstanceBackupSchedules.list'),
		update: op('volumeInstanceBackupSchedules.update'),
	},
	volumeInstanceBackups: {
		create: op('volumeInstanceBackups.create'),
		delete: op('volumeInstanceBackups.delete'),
		list: op('volumeInstanceBackups.list'),
		lock: op('volumeInstanceBackups.lock'),
		restore: op('volumeInstanceBackups.restore'),
	},
	volumeInstances: {
		get: op('volumeInstances.get'),
		pitrRestore: op('volumeInstances.pitrRestore'),
		pitrRestoreEstimate: op('volumeInstances.pitrRestoreEstimate'),
		update: op('volumeInstances.update'),
	},
	volumes: {
		create: op('volumes.create'),
		delete: op('volumes.delete'),
		update: op('volumes.update'),
	},
	webhooks: {
		test: op('webhooks.test'),
	},
	workflows: {
		status: op('workflows.status'),
	},
	workspaceApiTokens: {
		delete: op('workspaceApiTokens.delete'),
		list: op('workspaceApiTokens.list'),
	},
	workspaceMembers: {
		changeRole: op('workspaceMembers.changeRole'),
		invite: op('workspaceMembers.invite'),
		remove: op('workspaceMembers.remove'),
	},
	workspacePolicies: {
		addDeploySource: op('workspacePolicies.addDeploySource'),
		get: op('workspacePolicies.get'),
		removeDeploySource: op('workspacePolicies.removeDeploySource'),
		selectableDeploySources: op('workspacePolicies.selectableDeploySources'),
		updateItem: op('workspacePolicies.updateItem'),
	},
	workspaceTemplates: {
		list: op('workspaceTemplates.list'),
	},
	workspaces: {
		complianceAgreements: op('workspaces.complianceAgreements'),
		createInviteCode: op('workspaces.createInviteCode'),
		delete: op('workspaces.delete'),
		get: op('workspaces.get'),
		getByCode: op('workspaces.getByCode'),
		identityProviders: op('workspaces.identityProviders'),
		leave: op('workspaces.leave'),
		listExternal: op('workspaces.listExternal'),
		setRestrictProjectVisibilityToGroups: op(
			'workspaces.setRestrictProjectVisibilityToGroups',
		),
		update: op('workspaces.update'),
		updateTwoFactorEnforcement: op('workspaces.updateTwoFactorEnforcement'),
		upsertSlackChannel: op('workspaces.upsertSlackChannel'),
		usageTotals: op('workspaces.usageTotals'),
		useInviteCode: op('workspaces.useInviteCode'),
	},
} as const;

export const railwayEndpointSchemas = {
	'accessGroupMembers.add': railwaySchemaEntry('accessGroupMembers.add'),
	'accessGroupMembers.remove': railwaySchemaEntry('accessGroupMembers.remove'),
	'accessGroupProjects.attach': railwaySchemaEntry(
		'accessGroupProjects.attach',
	),
	'accessGroupProjects.detach': railwaySchemaEntry(
		'accessGroupProjects.detach',
	),
	'accessGroups.create': railwaySchemaEntry('accessGroups.create'),
	'accessGroups.delete': railwaySchemaEntry('accessGroups.delete'),
	'accessGroups.update': railwaySchemaEntry('accessGroups.update'),
	'agentUsage.get': railwaySchemaEntry('agentUsage.get'),
	'agentUsage.setLimit': railwaySchemaEntry('agentUsage.setLimit'),
	'apiTokens.create': railwaySchemaEntry('apiTokens.create'),
	'apiTokens.current': railwaySchemaEntry('apiTokens.current'),
	'apiTokens.delete': railwaySchemaEntry('apiTokens.delete'),
	'apiTokens.list': railwaySchemaEntry('apiTokens.list'),
	'auditLogs.eventTypes': railwaySchemaEntry('auditLogs.eventTypes'),
	'auditLogs.get': railwaySchemaEntry('auditLogs.get'),
	'auditLogs.list': railwaySchemaEntry('auditLogs.list'),
	'billing.createFreePlanSubscription': railwaySchemaEntry(
		'billing.createFreePlanSubscription',
	),
	'billing.togglePayoutsToCredits': railwaySchemaEntry(
		'billing.togglePayoutsToCredits',
	),
	'botScopeBindings.list': railwaySchemaEntry('botScopeBindings.list'),
	'botScopeBindings.remove': railwaySchemaEntry('botScopeBindings.remove'),
	'buckets.create': railwaySchemaEntry('buckets.create'),
	'buckets.instanceDetails': railwaySchemaEntry('buckets.instanceDetails'),
	'buckets.resetCredentials': railwaySchemaEntry('buckets.resetCredentials'),
	'buckets.s3Credentials': railwaySchemaEntry('buckets.s3Credentials'),
	'buckets.update': railwaySchemaEntry('buckets.update'),
	'canvasViews.merge': railwaySchemaEntry('canvasViews.merge'),
	'canvasViews.mergePreview': railwaySchemaEntry('canvasViews.mergePreview'),
	'clearanceTokens.create': railwaySchemaEntry('clearanceTokens.create'),
	'clearanceTokens.revoke': railwaySchemaEntry('clearanceTokens.revoke'),
	'cloudAgentCheckpoints.create': railwaySchemaEntry(
		'cloudAgentCheckpoints.create',
	),
	'cloudAgentCheckpoints.delete': railwaySchemaEntry(
		'cloudAgentCheckpoints.delete',
	),
	'cloudAgentCheckpoints.get': railwaySchemaEntry('cloudAgentCheckpoints.get'),
	'cloudAgentCheckpoints.list': railwaySchemaEntry(
		'cloudAgentCheckpoints.list',
	),
	'cloudAgentConsoleSessions.list': railwaySchemaEntry(
		'cloudAgentConsoleSessions.list',
	),
	'cloudAgentTasks.cancel': railwaySchemaEntry('cloudAgentTasks.cancel'),
	'cloudAgentTasks.dispatch': railwaySchemaEntry('cloudAgentTasks.dispatch'),
	'cloudAgentTasks.get': railwaySchemaEntry('cloudAgentTasks.get'),
	'cloudAgentTasks.list': railwaySchemaEntry('cloudAgentTasks.list'),
	'cloudAgentTasks.models': railwaySchemaEntry('cloudAgentTasks.models'),
	'cloudAgentTasks.recover': railwaySchemaEntry('cloudAgentTasks.recover'),
	'cloudAgentTasks.respond': railwaySchemaEntry('cloudAgentTasks.respond'),
	'cloudAgents.archive': railwaySchemaEntry('cloudAgents.archive'),
	'cloudAgents.create': railwaySchemaEntry('cloudAgents.create'),
	'cloudAgents.createDashboardFeedback': railwaySchemaEntry(
		'cloudAgents.createDashboardFeedback',
	),
	'cloudAgents.createFeedback': railwaySchemaEntry(
		'cloudAgents.createFeedback',
	),
	'cloudAgents.delete': railwaySchemaEntry('cloudAgents.delete'),
	'cloudAgents.deploy': railwaySchemaEntry('cloudAgents.deploy'),
	'cloudAgents.fork': railwaySchemaEntry('cloudAgents.fork'),
	'cloudAgents.get': railwaySchemaEntry('cloudAgents.get'),
	'cloudAgents.list': railwaySchemaEntry('cloudAgents.list'),
	'cloudAgents.listMine': railwaySchemaEntry('cloudAgents.listMine'),
	'cloudAgents.markSeen': railwaySchemaEntry('cloudAgents.markSeen'),
	'cloudAgents.renameSession': railwaySchemaEntry('cloudAgents.renameSession'),
	'cloudAgents.sleep': railwaySchemaEntry('cloudAgents.sleep'),
	'cloudAgents.unarchive': railwaySchemaEntry('cloudAgents.unarchive'),
	'cloudAgents.wake': railwaySchemaEntry('cloudAgents.wake'),
	'customDomains.create': railwaySchemaEntry('customDomains.create'),
	'customDomains.delete': railwaySchemaEntry('customDomains.delete'),
	'customDomains.get': railwaySchemaEntry('customDomains.get'),
	'customDomains.isAvailable': railwaySchemaEntry('customDomains.isAvailable'),
	'customDomains.issueCertificate': railwaySchemaEntry(
		'customDomains.issueCertificate',
	),
	'customDomains.update': railwaySchemaEntry('customDomains.update'),
	'databases.cancelPitrHaWorkflow': railwaySchemaEntry(
		'databases.cancelPitrHaWorkflow',
	),
	'databases.clearPitrHaWorkflowProgress': railwaySchemaEntry(
		'databases.clearPitrHaWorkflowProgress',
	),
	'databases.disablePitrForHaCluster': railwaySchemaEntry(
		'databases.disablePitrForHaCluster',
	),
	'databases.enablePitrForHaCluster': railwaySchemaEntry(
		'databases.enablePitrForHaCluster',
	),
	'databases.mysqlPitrRestorableWindow': railwaySchemaEntry(
		'databases.mysqlPitrRestorableWindow',
	),
	'databases.passwordRotationProgress': railwaySchemaEntry(
		'databases.passwordRotationProgress',
	),
	'databases.pitrHaClusterReplicationHealth': railwaySchemaEntry(
		'databases.pitrHaClusterReplicationHealth',
	),
	'databases.pitrHaWorkflowProgress': railwaySchemaEntry(
		'databases.pitrHaWorkflowProgress',
	),
	'databases.postgresHaClusterUptime': railwaySchemaEntry(
		'databases.postgresHaClusterUptime',
	),
	'databases.resetPassword': railwaySchemaEntry('databases.resetPassword'),
	'deploymentTriggers.create': railwaySchemaEntry('deploymentTriggers.create'),
	'deploymentTriggers.delete': railwaySchemaEntry('deploymentTriggers.delete'),
	'deploymentTriggers.list': railwaySchemaEntry('deploymentTriggers.list'),
	'deploymentTriggers.update': railwaySchemaEntry('deploymentTriggers.update'),
	'deployments.approve': railwaySchemaEntry('deployments.approve'),
	'deployments.buildLogs': railwaySchemaEntry('deployments.buildLogs'),
	'deployments.cancel': railwaySchemaEntry('deployments.cancel'),
	'deployments.createInstanceExecution': railwaySchemaEntry(
		'deployments.createInstanceExecution',
	),
	'deployments.events': railwaySchemaEntry('deployments.events'),
	'deployments.get': railwaySchemaEntry('deployments.get'),
	'deployments.instanceExecutions': railwaySchemaEntry(
		'deployments.instanceExecutions',
	),
	'deployments.list': railwaySchemaEntry('deployments.list'),
	'deployments.logs': railwaySchemaEntry('deployments.logs'),
	'deployments.redeploy': railwaySchemaEntry('deployments.redeploy'),
	'deployments.remove': railwaySchemaEntry('deployments.remove'),
	'deployments.restart': railwaySchemaEntry('deployments.restart'),
	'deployments.rollback': railwaySchemaEntry('deployments.rollback'),
	'deployments.snapshot': railwaySchemaEntry('deployments.snapshot'),
	'deployments.stop': railwaySchemaEntry('deployments.stop'),
	'dnsQueryLogs.list': railwaySchemaEntry('dnsQueryLogs.list'),
	'dockerCompose.import': railwaySchemaEntry('dockerCompose.import'),
	'domains.list': railwaySchemaEntry('domains.list'),
	'egressGateways.clearAssociations': railwaySchemaEntry(
		'egressGateways.clearAssociations',
	),
	'egressGateways.createAssociation': railwaySchemaEntry(
		'egressGateways.createAssociation',
	),
	'egressGateways.haMigrationPreview': railwaySchemaEntry(
		'egressGateways.haMigrationPreview',
	),
	'egressGateways.haPreview': railwaySchemaEntry('egressGateways.haPreview'),
	'egressGateways.legacyPreview': railwaySchemaEntry(
		'egressGateways.legacyPreview',
	),
	'egressGateways.list': railwaySchemaEntry('egressGateways.list'),
	'egressGateways.rollbackFromHa': railwaySchemaEntry(
		'egressGateways.rollbackFromHa',
	),
	'egressGateways.upgradeToHa': railwaySchemaEntry(
		'egressGateways.upgradeToHa',
	),
	'environmentPatches.commit': railwaySchemaEntry('environmentPatches.commit'),
	'environmentPatches.commitStaged': railwaySchemaEntry(
		'environmentPatches.commitStaged',
	),
	'environmentPatches.dismissFailure': railwaySchemaEntry(
		'environmentPatches.dismissFailure',
	),
	'environmentPatches.get': railwaySchemaEntry('environmentPatches.get'),
	'environmentPatches.list': railwaySchemaEntry('environmentPatches.list'),
	'environmentPatches.restage': railwaySchemaEntry(
		'environmentPatches.restage',
	),
	'environments.applyChangeSet': railwaySchemaEntry(
		'environments.applyChangeSet',
	),
	'environments.changeSetApplyStatus': railwaySchemaEntry(
		'environments.changeSetApplyStatus',
	),
	'environments.create': railwaySchemaEntry('environments.create'),
	'environments.delete': railwaySchemaEntry('environments.delete'),
	'environments.get': railwaySchemaEntry('environments.get'),
	'environments.hasLegacyStaticEgress': railwaySchemaEntry(
		'environments.hasLegacyStaticEgress',
	),
	'environments.history': railwaySchemaEntry('environments.history'),
	'environments.iacPartialRelease': railwaySchemaEntry(
		'environments.iacPartialRelease',
	),
	'environments.iacPartialTransfer': railwaySchemaEntry(
		'environments.iacPartialTransfer',
	),
	'environments.list': railwaySchemaEntry('environments.list'),
	'environments.logs': railwaySchemaEntry('environments.logs'),
	'environments.overrideBase': railwaySchemaEntry('environments.overrideBase'),
	'environments.pendingWork': railwaySchemaEntry('environments.pendingWork'),
	'environments.previewChangeSet': railwaySchemaEntry(
		'environments.previewChangeSet',
	),
	'environments.rename': railwaySchemaEntry('environments.rename'),
	'environments.stageChanges': railwaySchemaEntry('environments.stageChanges'),
	'environments.stagedChanges': railwaySchemaEntry(
		'environments.stagedChanges',
	),
	'environments.triggerDeploys': railwaySchemaEntry(
		'environments.triggerDeploys',
	),
	'environments.unskipService': railwaySchemaEntry(
		'environments.unskipService',
	),
	'environments.updateClearanceDefault': railwaySchemaEntry(
		'environments.updateClearanceDefault',
	),
	'environments.upsertConfigPlanComment': railwaySchemaEntry(
		'environments.upsertConfigPlanComment',
	),
	'events.list': railwaySchemaEntry('events.list'),
	'featureFlags.add': railwaySchemaEntry('featureFlags.add'),
	'featureFlags.listPlatform': railwaySchemaEntry('featureFlags.listPlatform'),
	'featureFlags.remove': railwaySchemaEntry('featureFlags.remove'),
	'functionRuntimes.get': railwaySchemaEntry('functionRuntimes.get'),
	'functionRuntimes.list': railwaySchemaEntry('functionRuntimes.list'),
	'github.prInfo': railwaySchemaEntry('github.prInfo'),
	'github.prInfoResult': railwaySchemaEntry('github.prInfoResult'),
	'github.repoAccessAvailable': railwaySchemaEntry(
		'github.repoAccessAvailable',
	),
	'github.repos.branches': railwaySchemaEntry('github.repos.branches'),
	'github.repos.deploy': railwaySchemaEntry('github.repos.deploy'),
	'github.repos.get': railwaySchemaEntry('github.repos.get'),
	'github.repos.isNameAvailable': railwaySchemaEntry(
		'github.repos.isNameAvailable',
	),
	'github.repos.list': railwaySchemaEntry('github.repos.list'),
	'github.repos.update': railwaySchemaEntry('github.repos.update'),
	'github.sshKeys': railwaySchemaEntry('github.sshKeys'),
	'github.writableScopes': railwaySchemaEntry('github.writableScopes'),
	'httpLogs.list': railwaySchemaEntry('httpLogs.list'),
	'httpMetrics.duration': railwaySchemaEntry('httpMetrics.duration'),
	'httpMetrics.get': railwaySchemaEntry('httpMetrics.get'),
	'httpMetrics.groupedByStatus': railwaySchemaEntry(
		'httpMetrics.groupedByStatus',
	),
	'inviteCodes.get': railwaySchemaEntry('inviteCodes.get'),
	'inviteCodes.use': railwaySchemaEntry('inviteCodes.use'),
	'me.get': railwaySchemaEntry('me.get'),
	'metrics.get': railwaySchemaEntry('metrics.get'),
	'networkFlowLogs.list': railwaySchemaEntry('networkFlowLogs.list'),
	'notificationDeliveries.get': railwaySchemaEntry(
		'notificationDeliveries.get',
	),
	'notificationDeliveries.list': railwaySchemaEntry(
		'notificationDeliveries.list',
	),
	'notificationDeliveries.markAsRead': railwaySchemaEntry(
		'notificationDeliveries.markAsRead',
	),
	'notificationRules.create': railwaySchemaEntry('notificationRules.create'),
	'notificationRules.delete': railwaySchemaEntry('notificationRules.delete'),
	'notificationRules.list': railwaySchemaEntry('notificationRules.list'),
	'notificationRules.update': railwaySchemaEntry('notificationRules.update'),
	'notificationRules.upsertSlackChannel': railwaySchemaEntry(
		'notificationRules.upsertSlackChannel',
	),
	'observabilityDashboardMonitors.create': railwaySchemaEntry(
		'observabilityDashboardMonitors.create',
	),
	'observabilityDashboardMonitors.remove': railwaySchemaEntry(
		'observabilityDashboardMonitors.remove',
	),
	'observabilityDashboardMonitors.update': railwaySchemaEntry(
		'observabilityDashboardMonitors.update',
	),
	'observabilityDashboards.create': railwaySchemaEntry(
		'observabilityDashboards.create',
	),
	'observabilityDashboards.list': railwaySchemaEntry(
		'observabilityDashboards.list',
	),
	'observabilityDashboards.reset': railwaySchemaEntry(
		'observabilityDashboards.reset',
	),
	'observabilityDashboards.update': railwaySchemaEntry(
		'observabilityDashboards.update',
	),
	'passkeys.list': railwaySchemaEntry('passkeys.list'),
	'platform.stats': railwaySchemaEntry('platform.stats'),
	'platform.status': railwaySchemaEntry('platform.status'),
	'preferences.get': railwaySchemaEntry('preferences.get'),
	'preferences.update': railwaySchemaEntry('preferences.update'),
	'privateNetworkEndpoints.get': railwaySchemaEntry(
		'privateNetworkEndpoints.get',
	),
	'privateNetworkEndpoints.isNameAvailable': railwaySchemaEntry(
		'privateNetworkEndpoints.isNameAvailable',
	),
	'privateNetworkEndpoints.rename': railwaySchemaEntry(
		'privateNetworkEndpoints.rename',
	),
	'privateNetworks.list': railwaySchemaEntry('privateNetworks.list'),
	'projectFavorites.list': railwaySchemaEntry('projectFavorites.list'),
	'projectFavorites.set': railwaySchemaEntry('projectFavorites.set'),
	'projectInvitations.accept': railwaySchemaEntry('projectInvitations.accept'),
	'projectInvitations.create': railwaySchemaEntry('projectInvitations.create'),
	'projectInvitations.createInviteCode': railwaySchemaEntry(
		'projectInvitations.createInviteCode',
	),
	'projectInvitations.delete': railwaySchemaEntry('projectInvitations.delete'),
	'projectInvitations.get': railwaySchemaEntry('projectInvitations.get'),
	'projectInvitations.inviteCode': railwaySchemaEntry(
		'projectInvitations.inviteCode',
	),
	'projectInvitations.list': railwaySchemaEntry('projectInvitations.list'),
	'projectInvitations.resend': railwaySchemaEntry('projectInvitations.resend'),
	'projectMembers.add': railwaySchemaEntry('projectMembers.add'),
	'projectMembers.list': railwaySchemaEntry('projectMembers.list'),
	'projectMembers.remove': railwaySchemaEntry('projectMembers.remove'),
	'projectMembers.update': railwaySchemaEntry('projectMembers.update'),
	'projectTokens.create': railwaySchemaEntry('projectTokens.create'),
	'projectTokens.delete': railwaySchemaEntry('projectTokens.delete'),
	'projectTokens.get': railwaySchemaEntry('projectTokens.get'),
	'projectTokens.list': railwaySchemaEntry('projectTokens.list'),
	'projects.addFeatureFlag': railwaySchemaEntry('projects.addFeatureFlag'),
	'projects.cancelScheduledDelete': railwaySchemaEntry(
		'projects.cancelScheduledDelete',
	),
	'projects.claim': railwaySchemaEntry('projects.claim'),
	'projects.compliance': railwaySchemaEntry('projects.compliance'),
	'projects.confirmTransfer': railwaySchemaEntry('projects.confirmTransfer'),
	'projects.create': railwaySchemaEntry('projects.create'),
	'projects.delete': railwaySchemaEntry('projects.delete'),
	'projects.forceScheduledDelete': railwaySchemaEntry(
		'projects.forceScheduledDelete',
	),
	'projects.get': railwaySchemaEntry('projects.get'),
	'projects.initiateTransfer': railwaySchemaEntry('projects.initiateTransfer'),
	'projects.leave': railwaySchemaEntry('projects.leave'),
	'projects.list': railwaySchemaEntry('projects.list'),
	'projects.listByIds': railwaySchemaEntry('projects.listByIds'),
	'projects.removeFeatureFlag': railwaySchemaEntry(
		'projects.removeFeatureFlag',
	),
	'projects.resourceAccess': railwaySchemaEntry('projects.resourceAccess'),
	'projects.scheduleDelete': railwaySchemaEntry('projects.scheduleDelete'),
	'projects.serviceUsage': railwaySchemaEntry('projects.serviceUsage'),
	'projects.transfer': railwaySchemaEntry('projects.transfer'),
	'projects.update': railwaySchemaEntry('projects.update'),
	'projects.updateClearanceDefault': railwaySchemaEntry(
		'projects.updateClearanceDefault',
	),
	'projects.workspaceMembers': railwaySchemaEntry('projects.workspaceMembers'),
	'railwayDomainDnsRecords.create': railwaySchemaEntry(
		'railwayDomainDnsRecords.create',
	),
	'railwayDomainDnsRecords.delete': railwaySchemaEntry(
		'railwayDomainDnsRecords.delete',
	),
	'railwayDomainDnsRecords.list': railwaySchemaEntry(
		'railwayDomainDnsRecords.list',
	),
	'railwayDomainDnsRecords.update': railwaySchemaEntry(
		'railwayDomainDnsRecords.update',
	),
	'railwayDomainEmailForwardingRules.create': railwaySchemaEntry(
		'railwayDomainEmailForwardingRules.create',
	),
	'railwayDomainEmailForwardingRules.delete': railwaySchemaEntry(
		'railwayDomainEmailForwardingRules.delete',
	),
	'railwayDomainEmailForwardingRules.list': railwaySchemaEntry(
		'railwayDomainEmailForwardingRules.list',
	),
	'railwayDomainEmailForwardingRules.removeAll': railwaySchemaEntry(
		'railwayDomainEmailForwardingRules.removeAll',
	),
	'railwayDomainEmailForwardingRules.sendTest': railwaySchemaEntry(
		'railwayDomainEmailForwardingRules.sendTest',
	),
	'railwayDomainEmailForwardingRules.update': railwaySchemaEntry(
		'railwayDomainEmailForwardingRules.update',
	),
	'railwayDomains.emailForwardingEligibility': railwaySchemaEntry(
		'railwayDomains.emailForwardingEligibility',
	),
	'railwayDomains.emailForwardingLimits': railwaySchemaEntry(
		'railwayDomains.emailForwardingLimits',
	),
	'railwayDomains.get': railwaySchemaEntry('railwayDomains.get'),
	'railwayDomains.getByName': railwaySchemaEntry('railwayDomains.getByName'),
	'railwayDomains.list': railwaySchemaEntry('railwayDomains.list'),
	'railwayDomains.setNameservers': railwaySchemaEntry(
		'railwayDomains.setNameservers',
	),
	'railwayDomains.update': railwaySchemaEntry('railwayDomains.update'),
	'referral.get': railwaySchemaEntry('referral.get'),
	'referral.update': railwaySchemaEntry('referral.update'),
	'regions.list': railwaySchemaEntry('regions.list'),
	'resourceAccess.get': railwaySchemaEntry('resourceAccess.get'),
	'sandboxCheckpoints.create': railwaySchemaEntry('sandboxCheckpoints.create'),
	'sandboxCheckpoints.delete': railwaySchemaEntry('sandboxCheckpoints.delete'),
	'sandboxCheckpoints.list': railwaySchemaEntry('sandboxCheckpoints.list'),
	'sandboxCheckpoints.rename': railwaySchemaEntry('sandboxCheckpoints.rename'),
	'sandboxSessions.list': railwaySchemaEntry('sandboxSessions.list'),
	'sandboxes.buildTemplate': railwaySchemaEntry('sandboxes.buildTemplate'),
	'sandboxes.create': railwaySchemaEntry('sandboxes.create'),
	'sandboxes.destroy': railwaySchemaEntry('sandboxes.destroy'),
	'sandboxes.get': railwaySchemaEntry('sandboxes.get'),
	'sandboxes.heartbeat': railwaySchemaEntry('sandboxes.heartbeat'),
	'sandboxes.list': railwaySchemaEntry('sandboxes.list'),
	'sandboxes.templateBuild': railwaySchemaEntry('sandboxes.templateBuild'),
	'serviceDomains.create': railwaySchemaEntry('serviceDomains.create'),
	'serviceDomains.delete': railwaySchemaEntry('serviceDomains.delete'),
	'serviceDomains.isAvailable': railwaySchemaEntry(
		'serviceDomains.isAvailable',
	),
	'serviceDomains.update': railwaySchemaEntry('serviceDomains.update'),
	'serviceInstances.autoDeployStatus': railwaySchemaEntry(
		'serviceInstances.autoDeployStatus',
	),
	'serviceInstances.clearAutoUpdateSnooze': railwaySchemaEntry(
		'serviceInstances.clearAutoUpdateSnooze',
	),
	'serviceInstances.deploy': railwaySchemaEntry('serviceInstances.deploy'),
	'serviceInstances.deployV2': railwaySchemaEntry('serviceInstances.deployV2'),
	'serviceInstances.dismissVulnRemediation': railwaySchemaEntry(
		'serviceInstances.dismissVulnRemediation',
	),
	'serviceInstances.get': railwaySchemaEntry('serviceInstances.get'),
	'serviceInstances.isUpdatable': railwaySchemaEntry(
		'serviceInstances.isUpdatable',
	),
	'serviceInstances.limitOverride': railwaySchemaEntry(
		'serviceInstances.limitOverride',
	),
	'serviceInstances.limits': railwaySchemaEntry('serviceInstances.limits'),
	'serviceInstances.patchVulnNow': railwaySchemaEntry(
		'serviceInstances.patchVulnNow',
	),
	'serviceInstances.redeploy': railwaySchemaEntry('serviceInstances.redeploy'),
	'serviceInstances.snoozeAutoUpdate': railwaySchemaEntry(
		'serviceInstances.snoozeAutoUpdate',
	),
	'serviceInstances.update': railwaySchemaEntry('serviceInstances.update'),
	'serviceInstances.updateAutoDeploy': railwaySchemaEntry(
		'serviceInstances.updateAutoDeploy',
	),
	'serviceInstances.updateAutoUpdateSchedule': railwaySchemaEntry(
		'serviceInstances.updateAutoUpdateSchedule',
	),
	'serviceInstances.updateClearance': railwaySchemaEntry(
		'serviceInstances.updateClearance',
	),
	'serviceInstances.updateLimits': railwaySchemaEntry(
		'serviceInstances.updateLimits',
	),
	'services.acknowledgeTakedown': railwaySchemaEntry(
		'services.acknowledgeTakedown',
	),
	'services.addFeatureFlag': railwaySchemaEntry('services.addFeatureFlag'),
	'services.connect': railwaySchemaEntry('services.connect'),
	'services.create': railwaySchemaEntry('services.create'),
	'services.delete': railwaySchemaEntry('services.delete'),
	'services.disableCdn': railwaySchemaEntry('services.disableCdn'),
	'services.disconnect': railwaySchemaEntry('services.disconnect'),
	'services.enableCdn': railwaySchemaEntry('services.enableCdn'),
	'services.generateShellToken': railwaySchemaEntry(
		'services.generateShellToken',
	),
	'services.get': railwaySchemaEntry('services.get'),
	'services.purgeCache': railwaySchemaEntry('services.purgeCache'),
	'services.removeFeatureFlag': railwaySchemaEntry(
		'services.removeFeatureFlag',
	),
	'services.removeUpstreamUrl': railwaySchemaEntry(
		'services.removeUpstreamUrl',
	),
	'services.setUnderAttackMode': railwaySchemaEntry(
		'services.setUnderAttackMode',
	),
	'services.update': railwaySchemaEntry('services.update'),
	'services.updateEdgeConfig': railwaySchemaEntry('services.updateEdgeConfig'),
	'services.updateEdgeRules': railwaySchemaEntry('services.updateEdgeRules'),
	'services.updateKind': railwaySchemaEntry('services.updateKind'),
	'services.validateEdgeRules': railwaySchemaEntry(
		'services.validateEdgeRules',
	),
	'sessions.delete': railwaySchemaEntry('sessions.delete'),
	'sessions.list': railwaySchemaEntry('sessions.list'),
	'sharedVariables.configure': railwaySchemaEntry('sharedVariables.configure'),
	'signals.changes': railwaySchemaEntry('signals.changes'),
	'signals.create': railwaySchemaEntry('signals.create'),
	'signals.delete': railwaySchemaEntry('signals.delete'),
	'signals.evaluate': railwaySchemaEntry('signals.evaluate'),
	'signals.get': railwaySchemaEntry('signals.get'),
	'signals.list': railwaySchemaEntry('signals.list'),
	'signals.replace': railwaySchemaEntry('signals.replace'),
	'signals.rollback': railwaySchemaEntry('signals.rollback'),
	'signals.setDefault': railwaySchemaEntry('signals.setDefault'),
	'signals.setRule': railwaySchemaEntry('signals.setRule'),
	'signals.unsetRule': railwaySchemaEntry('signals.unsetRule'),
	'sshPublicKeys.approveSignup': railwaySchemaEntry(
		'sshPublicKeys.approveSignup',
	),
	'sshPublicKeys.create': railwaySchemaEntry('sshPublicKeys.create'),
	'sshPublicKeys.delete': railwaySchemaEntry('sshPublicKeys.delete'),
	'sshPublicKeys.list': railwaySchemaEntry('sshPublicKeys.list'),
	'sshPublicKeys.signupInfo': railwaySchemaEntry('sshPublicKeys.signupInfo'),
	'tcpProxies.delete': railwaySchemaEntry('tcpProxies.delete'),
	'tcpProxies.list': railwaySchemaEntry('tcpProxies.list'),
	'templates.clone': railwaySchemaEntry('templates.clone'),
	'templates.count': railwaySchemaEntry('templates.count'),
	'templates.delete': railwaySchemaEntry('templates.delete'),
	'templates.deploy': railwaySchemaEntry('templates.deploy'),
	'templates.ejectServiceSource': railwaySchemaEntry(
		'templates.ejectServiceSource',
	),
	'templates.generate': railwaySchemaEntry('templates.generate'),
	'templates.get': railwaySchemaEntry('templates.get'),
	'templates.list': railwaySchemaEntry('templates.list'),
	'templates.metrics': railwaySchemaEntry('templates.metrics'),
	'templates.publish': railwaySchemaEntry('templates.publish'),
	'templates.revert': railwaySchemaEntry('templates.revert'),
	'templates.search': railwaySchemaEntry('templates.search'),
	'templates.sourceForProject': railwaySchemaEntry(
		'templates.sourceForProject',
	),
	'templates.unpublish': railwaySchemaEntry('templates.unpublish'),
	'templates.updateVolume': railwaySchemaEntry('templates.updateVolume'),
	'traces.get': railwaySchemaEntry('traces.get'),
	'traces.list': railwaySchemaEntry('traces.list'),
	'traces.status': railwaySchemaEntry('traces.status'),
	'trustedDomains.create': railwaySchemaEntry('trustedDomains.create'),
	'trustedDomains.delete': railwaySchemaEntry('trustedDomains.delete'),
	'trustedDomains.list': railwaySchemaEntry('trustedDomains.list'),
	'trustedDomains.retriggerVerification': railwaySchemaEntry(
		'trustedDomains.retriggerVerification',
	),
	'trustedDomains.update': railwaySchemaEntry('trustedDomains.update'),
	'twoFactor.get': railwaySchemaEntry('twoFactor.get'),
	'usage.estimated': railwaySchemaEntry('usage.estimated'),
	'usage.get': railwaySchemaEntry('usage.get'),
	'usage.removeLimit': railwaySchemaEntry('usage.removeLimit'),
	'usage.setLimit': railwaySchemaEntry('usage.setLimit'),
	'user.agreeToFairUse': railwaySchemaEntry('user.agreeToFairUse'),
	'user.delete': railwaySchemaEntry('user.delete'),
	'user.disconnectDiscord': railwaySchemaEntry('user.disconnectDiscord'),
	'user.pendingEmailChange': railwaySchemaEntry('user.pendingEmailChange'),
	'user.removeProviderAuth': railwaySchemaEntry('user.removeProviderAuth'),
	'user.updateTerms': railwaySchemaEntry('user.updateTerms'),
	'userProfile.get': railwaySchemaEntry('userProfile.get'),
	'userProfile.update': railwaySchemaEntry('userProfile.update'),
	'variables.delete': railwaySchemaEntry('variables.delete'),
	'variables.forServiceDeployment': railwaySchemaEntry(
		'variables.forServiceDeployment',
	),
	'variables.list': railwaySchemaEntry('variables.list'),
	'variables.upsert': railwaySchemaEntry('variables.upsert'),
	'variables.upsertMany': railwaySchemaEntry('variables.upsertMany'),
	'volumeInstanceBackupSchedules.list': railwaySchemaEntry(
		'volumeInstanceBackupSchedules.list',
	),
	'volumeInstanceBackupSchedules.update': railwaySchemaEntry(
		'volumeInstanceBackupSchedules.update',
	),
	'volumeInstanceBackups.create': railwaySchemaEntry(
		'volumeInstanceBackups.create',
	),
	'volumeInstanceBackups.delete': railwaySchemaEntry(
		'volumeInstanceBackups.delete',
	),
	'volumeInstanceBackups.list': railwaySchemaEntry(
		'volumeInstanceBackups.list',
	),
	'volumeInstanceBackups.lock': railwaySchemaEntry(
		'volumeInstanceBackups.lock',
	),
	'volumeInstanceBackups.restore': railwaySchemaEntry(
		'volumeInstanceBackups.restore',
	),
	'volumeInstances.get': railwaySchemaEntry('volumeInstances.get'),
	'volumeInstances.pitrRestore': railwaySchemaEntry(
		'volumeInstances.pitrRestore',
	),
	'volumeInstances.pitrRestoreEstimate': railwaySchemaEntry(
		'volumeInstances.pitrRestoreEstimate',
	),
	'volumeInstances.update': railwaySchemaEntry('volumeInstances.update'),
	'volumes.create': railwaySchemaEntry('volumes.create'),
	'volumes.delete': railwaySchemaEntry('volumes.delete'),
	'volumes.update': railwaySchemaEntry('volumes.update'),
	'webhooks.test': railwaySchemaEntry('webhooks.test'),
	'workflows.status': railwaySchemaEntry('workflows.status'),
	'workspaceApiTokens.delete': railwaySchemaEntry('workspaceApiTokens.delete'),
	'workspaceApiTokens.list': railwaySchemaEntry('workspaceApiTokens.list'),
	'workspaceMembers.changeRole': railwaySchemaEntry(
		'workspaceMembers.changeRole',
	),
	'workspaceMembers.invite': railwaySchemaEntry('workspaceMembers.invite'),
	'workspaceMembers.remove': railwaySchemaEntry('workspaceMembers.remove'),
	'workspacePolicies.addDeploySource': railwaySchemaEntry(
		'workspacePolicies.addDeploySource',
	),
	'workspacePolicies.get': railwaySchemaEntry('workspacePolicies.get'),
	'workspacePolicies.removeDeploySource': railwaySchemaEntry(
		'workspacePolicies.removeDeploySource',
	),
	'workspacePolicies.selectableDeploySources': railwaySchemaEntry(
		'workspacePolicies.selectableDeploySources',
	),
	'workspacePolicies.updateItem': railwaySchemaEntry(
		'workspacePolicies.updateItem',
	),
	'workspaceTemplates.list': railwaySchemaEntry('workspaceTemplates.list'),
	'workspaces.complianceAgreements': railwaySchemaEntry(
		'workspaces.complianceAgreements',
	),
	'workspaces.createInviteCode': railwaySchemaEntry(
		'workspaces.createInviteCode',
	),
	'workspaces.delete': railwaySchemaEntry('workspaces.delete'),
	'workspaces.get': railwaySchemaEntry('workspaces.get'),
	'workspaces.getByCode': railwaySchemaEntry('workspaces.getByCode'),
	'workspaces.identityProviders': railwaySchemaEntry(
		'workspaces.identityProviders',
	),
	'workspaces.leave': railwaySchemaEntry('workspaces.leave'),
	'workspaces.listExternal': railwaySchemaEntry('workspaces.listExternal'),
	'workspaces.setRestrictProjectVisibilityToGroups': railwaySchemaEntry(
		'workspaces.setRestrictProjectVisibilityToGroups',
	),
	'workspaces.update': railwaySchemaEntry('workspaces.update'),
	'workspaces.updateTwoFactorEnforcement': railwaySchemaEntry(
		'workspaces.updateTwoFactorEnforcement',
	),
	'workspaces.upsertSlackChannel': railwaySchemaEntry(
		'workspaces.upsertSlackChannel',
	),
	'workspaces.usageTotals': railwaySchemaEntry('workspaces.usageTotals'),
	'workspaces.useInviteCode': railwaySchemaEntry('workspaces.useInviteCode'),
} satisfies RequiredPluginEndpointSchemas<typeof railwayEndpointsNested>;

export const railwayEndpointMeta = {
	'accessGroupMembers.add': {
		riskLevel: 'destructive',
		description: 'Add a workspace member to an access group',
	},
	'accessGroupMembers.remove': {
		riskLevel: 'destructive',
		description: 'Remove a member from an access group',
	},
	'accessGroupProjects.attach': {
		riskLevel: 'write',
		description: 'Attach a project to an access group',
	},
	'accessGroupProjects.detach': {
		riskLevel: 'write',
		description: 'Detach a project from an access group',
	},
	'accessGroups.create': {
		riskLevel: 'write',
		description: 'Create an access group in a workspace',
	},
	'accessGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an access group',
	},
	'accessGroups.update': {
		riskLevel: 'write',
		description: "Update an access group's name or role",
	},
	'agentUsage.get': {
		riskLevel: 'read',
		description: 'Get unified AI usage for a workspace',
	},
	'agentUsage.setLimit': {
		riskLevel: 'destructive',
		description: 'Set agent usage limit for a workspace',
	},
	'apiTokens.create': {
		riskLevel: 'destructive',
		description: 'Creates a new API token',
	},
	'apiTokens.current': {
		riskLevel: 'read',
		description:
			'Introspect the current API token and its accessible workspaces',
	},
	'apiTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an API token',
	},
	'apiTokens.list': {
		riskLevel: 'read',
		description:
			'Gets all API tokens for the authenticated user, one page at a time (first/after)',
	},
	'auditLogs.eventTypes': {
		riskLevel: 'read',
		description:
			'Get a list of all audit log event types and their description',
	},
	'auditLogs.get': {
		riskLevel: 'read',
		description: 'Get an audit log by ID',
	},
	'auditLogs.list': {
		riskLevel: 'read',
		description:
			'Gets audit logs for a workspace, one page at a time (first/after)',
	},
	'billing.createFreePlanSubscription': {
		riskLevel: 'destructive',
		description: 'Create a free plan subscription for a customer',
	},
	'billing.togglePayoutsToCredits': {
		riskLevel: 'destructive',
		description:
			'Toggle whether a customer is automatically withdrawing to credits',
	},
	'botScopeBindings.list': {
		riskLevel: 'read',
		description:
			"Railway agent chat bindings (Slack/Discord scope → workspace) across the caller's workspaces",
	},
	'botScopeBindings.remove': {
		riskLevel: 'destructive',
		description:
			"Remove a Railway agent chat binding. Requires admin on the binding's workspace",
	},
	'buckets.create': {
		riskLevel: 'destructive',
		description: 'Create a bucket in a project',
	},
	'buckets.instanceDetails': {
		riskLevel: 'read',
		description: 'Get the S3-compatible credentials for a bucket',
	},
	'buckets.resetCredentials': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset the credentials for a bucket in an environment',
	},
	'buckets.s3Credentials': {
		riskLevel: 'read',
		description: 'Get the S3-compatible credentials for a bucket',
	},
	'buckets.update': {
		riskLevel: 'write',
		description: 'Updates a bucket',
	},
	'canvasViews.merge': {
		riskLevel: 'destructive',
		description:
			'Merge a canvas layout from one environment into another. Re-computes the merge from current state and applies mutations',
	},
	'canvasViews.mergePreview': {
		riskLevel: 'read',
		description:
			'Preview a canvas layout merge from one environment to another. Returns the merged state and the mutations needed to reach it',
	},
	'clearanceTokens.create': {
		riskLevel: 'destructive',
		description:
			"Creates a Railway Authentication token for a project's protected services and returns it once. Requires a workspace admin and the workspace's Railway Authentication entitlement",
	},
	'clearanceTokens.revoke': {
		riskLevel: 'destructive',
		description:
			'Revokes a Railway Authentication token. Requires a workspace admin; works without the entitlement. Revoking a revoked token succeeds',
	},
	'cloudAgentCheckpoints.create': {
		riskLevel: 'destructive',
		description:
			"Checkpoint the agent's disk. Poll cloudAgentCheckpoint until SUCCEEDED",
	},
	'cloudAgentCheckpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a checkpoint',
	},
	'cloudAgentCheckpoints.get': {
		riskLevel: 'read',
		description: 'A cloud agent checkpoint by ID',
	},
	'cloudAgentCheckpoints.list': {
		riskLevel: 'read',
		description:
			'Cloud agent checkpoints in an environment, newest first, one page at a time (first/after)',
	},
	'cloudAgentConsoleSessions.list': {
		riskLevel: 'read',
		description:
			"Shell and exec sessions running on a cloud agent's VM that you can reconnect to. Null if the agent has no running machine, one page at a time (first/after)",
	},
	'cloudAgentTasks.cancel': {
		riskLevel: 'write',
		description:
			'Stop a task. Before its prompt is sent it never starts; after, only its own run is aborted. The task ends CANCELLED, with "The task was cancelled" as its error. A finished task is left as is',
	},
	'cloudAgentTasks.dispatch': {
		riskLevel: 'destructive',
		description:
			'Start a task and return its handle. Creates a fresh agent by default; replyToTaskId continues the original conversation',
	},
	'cloudAgentTasks.get': {
		riskLevel: 'read',
		description:
			"Read a task turn without waking the VM: the latest on the agent/session, or taskId's",
	},
	'cloudAgentTasks.list': {
		riskLevel: 'read',
		description:
			"List task records in an environment, newest first. Filter to one agent, or with sessionId to one session's turns",
	},
	'cloudAgentTasks.models': {
		riskLevel: 'read',
		description:
			'The models a task in this environment can run on, and the default a new conversation starts on',
	},
	'cloudAgentTasks.recover': {
		riskLevel: 'destructive',
		description:
			'Recover the latest task response from the agent. May wake the VM',
	},
	'cloudAgentTasks.respond': {
		riskLevel: 'destructive',
		description:
			'Answer a question the task is waiting on. Wakes a sleeping VM to deliver it (the question survives sleep); poll cloudAgentTask for the outcome',
	},
	'cloudAgents.archive': {
		riskLevel: 'write',
		description:
			'Archive a cloud agent, hiding it from lists of unarchived agents. Requires permission to manage the agent',
	},
	'cloudAgents.create': {
		riskLevel: 'destructive',
		description: 'Create a cloud agent',
	},
	'cloudAgents.createDashboardFeedback': {
		riskLevel: 'write',
		description:
			'Send feedback about the agent dashboard to the Railway team. True once delivered',
	},
	'cloudAgents.createFeedback': {
		riskLevel: 'write',
		description:
			'Send lightweight agent feedback to Railway. Returns the report ID after delivery',
	},
	'cloudAgents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a cloud agent',
	},
	'cloudAgents.deploy': {
		riskLevel: 'destructive',
		description:
			"Build the agent's code inside its own VM and deploy it. Creates the named service (default: the agent's name) or reuses it. Needs an agent booted with the builder",
	},
	'cloudAgents.fork': {
		riskLevel: 'destructive',
		description:
			'Duplicate a running cloud agent. With sessionId, the new agent keeps that chat and its history; without it, it starts with no chats',
	},
	'cloudAgents.get': {
		riskLevel: 'read',
		description:
			'A cloud agent by ID, within an environment. Null when the agent belongs to another one, so a caller cannot render an agent it has switched away from',
	},
	'cloudAgents.list': {
		riskLevel: 'read',
		description: 'Cloud agents in an environment',
	},
	'cloudAgents.listMine': {
		riskLevel: 'read',
		description:
			'Cloud agents you own, across every project and environment you can reach. Answers "where are my agents" in one request; `cloudAgents` needs one call per environment. Machine fields (`status`, `domain`, `domains`) read the last observed state in batched queries, so selecting them across many environments is fine',
	},
	'cloudAgents.markSeen': {
		riskLevel: 'write',
		description:
			"Mark the agent's finished and failed sessions as seen, or only sessionId's. Requires permission to manage the agent",
	},
	'cloudAgents.renameSession': {
		riskLevel: 'write',
		description:
			"Set a session's title, shown over its generated one. An empty title clears it",
	},
	'cloudAgents.sleep': {
		riskLevel: 'write',
		description:
			'Sleep a running cloud agent, keeping its volume. Processes on the machine are terminated; waking re-runs its entrypoint',
	},
	'cloudAgents.unarchive': {
		riskLevel: 'write',
		description:
			'Restore an archived cloud agent. Requires permission to manage the agent',
	},
	'cloudAgents.wake': {
		riskLevel: 'destructive',
		description: 'Wake a sleeping cloud agent',
	},
	'customDomains.create': {
		riskLevel: 'write',
		description: 'Creates a new custom domain',
	},
	'customDomains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a custom domain',
	},
	'customDomains.get': {
		riskLevel: 'read',
		description: 'Fetch details for a custom domain',
	},
	'customDomains.isAvailable': {
		riskLevel: 'read',
		description: 'Checks if a custom domain is available',
	},
	'customDomains.issueCertificate': {
		riskLevel: 'destructive',
		description: 'Issues a new certificate',
	},
	'customDomains.update': {
		riskLevel: 'write',
		description: 'Updates a custom domain',
	},
	'databases.cancelPitrHaWorkflow': {
		riskLevel: 'write',
		description:
			'Cancels an in-progress PITR enable/disable rollout on an HA database cluster and resets its progress so the UI re-reads from the live cluster. No-ops when nothing is running',
	},
	'databases.clearPitrHaWorkflowProgress': {
		riskLevel: 'write',
		description:
			'Clears the recorded progress of a finished PITR enable/disable rollout so the Backups page starts fresh. A rollout still in progress cannot be cleared',
	},
	'databases.disablePitrForHaCluster': {
		riskLevel: 'write',
		description:
			'Disables point-in-time recovery on an HA database cluster with the same rolling rollout as enable. The backup bucket is left intact, so existing backup history is preserved',
	},
	'databases.enablePitrForHaCluster': {
		riskLevel: 'destructive',
		description:
			'Enables point-in-time recovery on an HA database cluster (Postgres HA, MySQL HA) with a rolling, near-zero-downtime rollout across its members. Safe to retry',
	},
	'databases.mysqlPitrRestorableWindow': {
		riskLevel: 'read',
		description:
			"The point-in-time window a MySQL service's binlog archive can restore to, resolved from the archive bucket: the oldest full backup (floor), the newest shipped binlog (ceiling) and every full backup's timestamp. archiveConfigured is false when the service carries no complete BINLOG_ARCHIVE_* contract",
	},
	'databases.passwordRotationProgress': {
		riskLevel: 'read',
		description:
			'Progress of the HA password rotation running for a cluster, or null when none is',
	},
	'databases.pitrHaClusterReplicationHealth': {
		riskLevel: 'read',
		description:
			"Live replication health for an HA database cluster (Postgres HA, MySQL HA). Use it to gate the Enable/Disable PITR buttons so a rollout can't start while a member is too far behind to rejoin. Returns null when the service isn't an HA root",
	},
	'databases.pitrHaWorkflowProgress': {
		riskLevel: 'read',
		description:
			'One-shot read of the current progress of a PITR enable/disable rollout on an HA database cluster. Use it to rehydrate state on page load, then poll this field for updates. Returns null when no rollout has run recently',
	},
	'databases.postgresHaClusterUptime': {
		riskLevel: 'read',
		description:
			"One Postgres HA cluster's uptime SLI over the last N days: its row, its windows, its daily rollups. The cluster is named by any of its member services, since an environment can hold more than one. Errors when the service is not part of a Postgres HA cluster",
	},
	'databases.resetPassword': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset database credentials, coordinating all members for an HA cluster. On an HA cluster the rotation keeps running after this returns (`rotationInProgress`); follow `databasePasswordRotationProgress` until it reports DONE',
	},
	'deploymentTriggers.create': {
		riskLevel: 'write',
		description: 'Creates a deployment trigger',
	},
	'deploymentTriggers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a deployment trigger',
	},
	'deploymentTriggers.list': {
		riskLevel: 'read',
		description: 'All deployment triggers, one page at a time (first/after)',
	},
	'deploymentTriggers.update': {
		riskLevel: 'write',
		description: 'Updates a deployment trigger',
	},
	'deployments.approve': {
		riskLevel: 'destructive',
		description: 'Approves a deployment',
	},
	'deployments.buildLogs': {
		riskLevel: 'read',
		description: 'Get the build log lines of a deployment',
	},
	'deployments.cancel': {
		riskLevel: 'write',
		description: 'Cancels a deployment',
	},
	'deployments.createInstanceExecution': {
		riskLevel: 'destructive',
		description: 'Invoke a deployment instance execution',
	},
	'deployments.events': {
		riskLevel: 'read',
		description:
			'Get the deployment events for a deployment, one page at a time (first/after)',
	},
	'deployments.get': {
		riskLevel: 'read',
		description: 'Find a single deployment',
	},
	'deployments.instanceExecutions': {
		riskLevel: 'read',
		description:
			'Get the deployment instance executions for a deployment, one page at a time (first/after)',
	},
	'deployments.list': {
		riskLevel: 'read',
		description: 'Get all deployments, one page at a time (first/after)',
	},
	'deployments.logs': {
		riskLevel: 'read',
		description:
			'Get the runtime log lines of a deployment, optionally filtered and between two dates',
	},
	'deployments.redeploy': {
		riskLevel: 'destructive',
		description: 'Redeploys a deployment',
	},
	'deployments.remove': {
		riskLevel: 'destructive',
		description: 'Removes a deployment',
	},
	'deployments.restart': {
		riskLevel: 'destructive',
		description: 'Restarts a deployment',
	},
	'deployments.rollback': {
		riskLevel: 'destructive',
		description: 'Rolls back to a deployment',
	},
	'deployments.snapshot': {
		riskLevel: 'read',
		description: 'Find a single DeploymentSnapshot',
	},
	'deployments.stop': {
		riskLevel: 'destructive',
		description: 'Stops a deployment',
	},
	'dnsQueryLogs.list': {
		riskLevel: 'read',
		description: 'Fetch individual DNS query logs for an environment',
	},
	'dockerCompose.import': {
		riskLevel: 'destructive',
		description: 'Create services and volumes from docker compose',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'All domains for a service instance',
	},
	'egressGateways.clearAssociations': {
		riskLevel: 'destructive',
		description: 'Clear all egress gateway associations for a service instance',
	},
	'egressGateways.createAssociation': {
		riskLevel: 'destructive',
		description:
			'Create a new egress gateway association for a service instance',
	},
	'egressGateways.haMigrationPreview': {
		riskLevel: 'read',
		description:
			"Preview the HA static egress IPs that would be assigned, without applying them. Set allEnvironments to cover all of the service's environments",
	},
	'egressGateways.haPreview': {
		riskLevel: 'read',
		description:
			'Preview HA static egress IPs that would be assigned without persisting',
	},
	'egressGateways.legacyPreview': {
		riskLevel: 'read',
		description:
			'Preview legacy static egress IP that would be assigned without persisting',
	},
	'egressGateways.list': {
		riskLevel: 'read',
		description: 'All egress gateways assigned to a service instance',
	},
	'egressGateways.rollbackFromHa': {
		riskLevel: 'write',
		description:
			"Switch a service from HA static egress IPs back to a standard static IP. Set allEnvironments to apply to all of the service's environments",
	},
	'egressGateways.upgradeToHa': {
		riskLevel: 'destructive',
		description:
			"Enable HA static egress IPs for a service. Set allEnvironments to apply to all of the service's environments",
	},
	'environmentPatches.commit': {
		riskLevel: 'destructive',
		description: 'Commit the provided patch to the environment',
	},
	'environmentPatches.commitStaged': {
		riskLevel: 'destructive',
		description: 'Commits the staged changes for a single environment',
	},
	'environmentPatches.dismissFailure': {
		riskLevel: 'write',
		description:
			"Acknowledge a FAILED patch so it no longer shows as the environment's latest failure. The patch is left untouched",
	},
	'environmentPatches.get': {
		riskLevel: 'read',
		description: 'Get a single environment patch by ID',
	},
	'environmentPatches.list': {
		riskLevel: 'read',
		description:
			'Get the patches for an environment, one page at a time (first/after)',
	},
	'environmentPatches.restage': {
		riskLevel: 'write',
		description:
			"Copy a FAILED patch's changes into the environment's staged patch (creating one if needed). The FAILED patch is left untouched",
	},
	'environments.applyChangeSet': {
		riskLevel: 'destructive',
		description:
			'Experimental: applies an intent-level RailwayChangeSet and returns operation results',
	},
	'environments.changeSetApplyStatus': {
		riskLevel: 'read',
		description:
			'Returns the status or completed result of an asynchronous RailwayChangeSet apply',
	},
	'environments.create': {
		riskLevel: 'destructive',
		description: 'Creates a new environment',
	},
	'environments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an environment',
	},
	'environments.get': {
		riskLevel: 'read',
		description: 'Find a single environment',
	},
	'environments.hasLegacyStaticEgress': {
		riskLevel: 'read',
		description:
			'Whether any service in the environment is on legacy static egress (not HA). Used to surface the HA migration banner',
	},
	'environments.history': {
		riskLevel: 'read',
		description:
			'Settled history for an environment (system events + terminal operations), newest first. Cursor-paginated, one page at a time (first/after)',
	},
	'environments.iacPartialRelease': {
		riskLevel: 'write',
		description:
			'Release resources from a named IaC partial without deleting, redeploying, or changing them. Omit resources to release the entire partial. Whole-project management is possible once no named partials remain. A later named-partial apply can claim released resources again',
	},
	'environments.iacPartialTransfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer resources between named IaC partials without deleting, redeploying, or changing them. Omit resources to transfer the entire source partial. The destination may be a new or existing partial',
	},
	'environments.list': {
		riskLevel: 'read',
		description:
			'Gets all environments for a project, one page at a time (first/after)',
	},
	'environments.logs': {
		riskLevel: 'read',
		description:
			'Fetch logs for a project environment. Build logs are excluded unless a snapshot ID is explicitly provided in the filter',
	},
	'environments.overrideBase': {
		riskLevel: 'write',
		description: 'Sets the base environment override for a deployment trigger',
	},
	'environments.pendingWork': {
		riskLevel: 'read',
		description:
			'Pending project-mutating work for an environment. Unions registered OperationSources (patches, standalone deploys) and returns parent rows only — not a stored inbox',
	},
	'environments.previewChangeSet': {
		riskLevel: 'read',
		description:
			'Experimental: previews an intent-level RailwayChangeSet without side effects',
	},
	'environments.rename': {
		riskLevel: 'write',
		description: 'Renames an environment',
	},
	'environments.stageChanges': {
		riskLevel: 'write',
		description: 'Sets the staged patch for a single environment',
	},
	'environments.stagedChanges': {
		riskLevel: 'read',
		description: 'Get the latest staged commit for a single environment',
	},
	'environments.triggerDeploys': {
		riskLevel: 'destructive',
		description: 'Deploys all connected triggers for an environment',
	},
	'environments.unskipService': {
		riskLevel: 'write',
		description:
			'Deploy a service that was skipped when its environment was created, along with its skipped transitive dependencies',
	},
	'environments.updateClearanceDefault': {
		riskLevel: 'write',
		description:
			"Sets whether Railway Authentication protects an environment's services that have no setting of their own, and pushes it to them. Requires a workspace admin; turning it on also requires the workspace's Railway Authentication entitlement. Services with edge caching on that it protects have their caching turned off",
	},
	'environments.upsertConfigPlanComment': {
		riskLevel: 'write',
		description:
			'Posts or updates a `railway config plan` comment on a GitHub pull request under the Railway app identity. The caller proves it runs in the target repo with a GitHub Actions OIDC token; the comment body is composed server-side from the structured plan',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'Gets the events for a project, one page at a time (first/after)',
	},
	'featureFlags.add': {
		riskLevel: 'write',
		description: 'Add a feature flag for a user',
	},
	'featureFlags.listPlatform': {
		riskLevel: 'read',
		description:
			'Returns the platform feature flags enabled for the current user',
	},
	'featureFlags.remove': {
		riskLevel: 'destructive',
		description: 'Remove a feature flag for a user',
	},
	'functionRuntimes.get': {
		riskLevel: 'read',
		description: 'Get information about a specific function runtime',
	},
	'functionRuntimes.list': {
		riskLevel: 'read',
		description: 'List available function runtimes',
	},
	'github.prInfo': {
		riskLevel: 'read',
		description: 'Get info for a GitHub pull request',
	},
	'github.prInfoResult': {
		riskLevel: 'read',
		description: 'Get info for a GitHub pull request, including fetch errors',
	},
	'github.repoAccessAvailable': {
		riskLevel: 'read',
		description: 'Checks if user has access to GitHub repository',
	},
	'github.repos.branches': {
		riskLevel: 'read',
		description:
			'Get branches for a GitHub repo that the authenticated user has access to',
	},
	'github.repos.deploy': {
		riskLevel: 'destructive',
		description: 'Deploys a GitHub repo',
	},
	'github.repos.get': {
		riskLevel: 'read',
		description: 'Checks if user has access to GitHub repository',
	},
	'github.repos.isNameAvailable': {
		riskLevel: 'read',
		description: 'Check if a repo name is available',
	},
	'github.repos.list': {
		riskLevel: 'read',
		description: 'Get a list of repos for a user that Railway has access to',
	},
	'github.repos.update': {
		riskLevel: 'write',
		description: 'Updates a GitHub repo through the linked template',
	},
	'github.sshKeys': {
		riskLevel: 'read',
		description:
			"Gets SSH public keys from the authenticated user's GitHub account",
	},
	'github.writableScopes': {
		riskLevel: 'read',
		description:
			'Get a list of scopes the user has installed the installation to',
	},
	'httpLogs.list': {
		riskLevel: 'read',
		description: 'Fetch HTTP logs for a deployment',
	},
	'httpMetrics.duration': {
		riskLevel: 'read',
		description:
			'Get HTTP request duration metrics for a service (avg, p50, p90, p95, p99)',
	},
	'httpMetrics.get': {
		riskLevel: 'read',
		description: 'Get HTTP request metrics for a service',
	},
	'httpMetrics.groupedByStatus': {
		riskLevel: 'read',
		description:
			'Get HTTP request metrics for a service, grouped by status code',
	},
	'inviteCodes.get': {
		riskLevel: 'read',
		description: 'Get an invite code by the code',
	},
	'inviteCodes.use': {
		riskLevel: 'write',
		description: 'Join a project using an invite code',
	},
	'me.get': {
		riskLevel: 'read',
		description: 'Get the user the token belongs to, with their workspaces',
	},
	'metrics.get': {
		riskLevel: 'read',
		description: 'Get metrics for a project, environment, and service',
	},
	'networkFlowLogs.list': {
		riskLevel: 'read',
		description: 'Fetch individual network flow logs for an environment',
	},
	'notificationDeliveries.get': {
		riskLevel: 'read',
		description:
			'Gets a notification delivery by ID for the authenticated user',
	},
	'notificationDeliveries.list': {
		riskLevel: 'read',
		description:
			'Gets notification deliveries for the authenticated user, one page at a time (first/after)',
	},
	'notificationDeliveries.markAsRead': {
		riskLevel: 'write',
		description: 'Marks notification deliveries as read',
	},
	'notificationRules.create': {
		riskLevel: 'write',
		description: 'Create a new notification rule',
	},
	'notificationRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a notification rule',
	},
	'notificationRules.list': {
		riskLevel: 'read',
		description: 'Get all notification rules for a workspace and project',
	},
	'notificationRules.update': {
		riskLevel: 'write',
		description: 'Update a notification rule',
	},
	'notificationRules.upsertSlackChannel': {
		riskLevel: 'write',
		description: 'Generate a Slack channel for a workspace',
	},
	'observabilityDashboardMonitors.create': {
		riskLevel: 'write',
		description: 'Create an observability monitor for a dashboard item',
	},
	'observabilityDashboardMonitors.remove': {
		riskLevel: 'destructive',
		description: 'Remove an observability monitor from a dashboard item',
	},
	'observabilityDashboardMonitors.update': {
		riskLevel: 'write',
		description: 'Update an observability monitor for a dashboard item',
	},
	'observabilityDashboards.create': {
		riskLevel: 'write',
		description: 'Create an observability dashboard',
	},
	'observabilityDashboards.list': {
		riskLevel: 'read',
		description:
			'Get all observability dashboards for an environment, one page at a time (first/after)',
	},
	'observabilityDashboards.reset': {
		riskLevel: 'write',
		description: 'Reset an observability dashboard to default dashboard items',
	},
	'observabilityDashboards.update': {
		riskLevel: 'write',
		description: 'Update an observability dashboard',
	},
	'passkeys.list': {
		riskLevel: 'read',
		description:
			'Gets all passkeys for the authenticated user, one page at a time (first/after)',
	},
	'platform.stats': {
		riskLevel: 'read',
		description: 'Get public Railway stats',
	},
	'platform.status': {
		riskLevel: 'read',
		description: 'Get the current status of the platform',
	},
	'preferences.get': {
		riskLevel: 'read',
		description: 'Get the email preferences for a user',
	},
	'preferences.update': {
		riskLevel: 'write',
		description: 'Update the email preferences for a user',
	},
	'privateNetworkEndpoints.get': {
		riskLevel: 'read',
		description: 'Get a private network endpoint for a service instance',
	},
	'privateNetworkEndpoints.isNameAvailable': {
		riskLevel: 'read',
		description: 'Check if an endpoint name is available',
	},
	'privateNetworkEndpoints.rename': {
		riskLevel: 'write',
		description: 'Rename a private network endpoint',
	},
	'privateNetworks.list': {
		riskLevel: 'read',
		description: 'List private networks for an environment',
	},
	'projectFavorites.list': {
		riskLevel: 'read',
		description:
			"The authenticated user's favorited project ids in a workspace, in the order the Favorites row should render them. Defaults to the order they were starred in",
	},
	'projectFavorites.set': {
		riskLevel: 'write',
		description:
			'Star or unstar a project for the authenticated user. Returns the resulting state',
	},
	'projectInvitations.accept': {
		riskLevel: 'write',
		description: 'Accept a project invitation using the invite code',
	},
	'projectInvitations.create': {
		riskLevel: 'destructive',
		description: 'Create an invitation for a project',
	},
	'projectInvitations.createInviteCode': {
		riskLevel: 'destructive',
		description:
			'Create a 24-hour project invite link, reusing a link created within the last hour',
	},
	'projectInvitations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an invitation for a project',
	},
	'projectInvitations.get': {
		riskLevel: 'read',
		description: 'Get a project invitation by code',
	},
	'projectInvitations.inviteCode': {
		riskLevel: 'read',
		description: 'Get an invite code for a project for a specifc role',
	},
	'projectInvitations.list': {
		riskLevel: 'read',
		description: 'Get invitations for a project',
	},
	'projectInvitations.resend': {
		riskLevel: 'destructive',
		description: 'Resend an invitation for a project',
	},
	'projectMembers.add': {
		riskLevel: 'destructive',
		description:
			"Add a workspace member to a project with a specific role. The user must already be a member of the project's workspace",
	},
	'projectMembers.list': {
		riskLevel: 'read',
		description: 'Gets users who belong to a project along with their role',
	},
	'projectMembers.remove': {
		riskLevel: 'destructive',
		description: 'Remove user from a project',
	},
	'projectMembers.update': {
		riskLevel: 'destructive',
		description: 'Change the role for a user within a project',
	},
	'projectTokens.create': {
		riskLevel: 'destructive',
		description:
			'Create a token for a project that has access to a specific environment',
	},
	'projectTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project token',
	},
	'projectTokens.get': {
		riskLevel: 'read',
		description: 'Get a single project token by the value in the header',
	},
	'projectTokens.list': {
		riskLevel: 'read',
		description:
			'Get all project tokens for a project, one page at a time (first/after)',
	},
	'projects.addFeatureFlag': {
		riskLevel: 'write',
		description: 'Add a feature flag for a project',
	},
	'projects.cancelScheduledDelete': {
		riskLevel: 'write',
		description: 'Cancel scheduled deletion of a project',
	},
	'projects.claim': {
		riskLevel: 'write',
		description: 'Claims a project',
	},
	'projects.compliance': {
		riskLevel: 'read',
		description:
			'Get comprehensive compliance information for a project including 2FA status, member permissions, backup schedules, and compliance agreements. Requires workspace API token with admin access',
	},
	'projects.confirmTransfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Confirm the transfer of project ownership',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project in a workspace (workspaceId), with an optional description and default environment name',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a project with every environment, service, deployment, volume and variable in it',
	},
	'projects.forceScheduledDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Force delete a scheduled deletion of a project (skips the grace period)',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by ID',
	},
	'projects.initiateTransfer': {
		riskLevel: 'destructive',
		description: 'Initiate the transfer of project ownership',
	},
	'projects.leave': {
		riskLevel: 'destructive',
		description: 'Leave project as currently authenticated user',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List the projects the token can see (all workspaces, or one with workspaceId), as a page of nodes',
	},
	'projects.listByIds': {
		riskLevel: 'read',
		description:
			'Fetch multiple projects by id. Skips ids the caller cannot access (does not throw on partial denial). Intended for batched dashboard hydration of a small viewport-sized set of cards',
	},
	'projects.removeFeatureFlag': {
		riskLevel: 'destructive',
		description: 'Remove a feature flag for a project',
	},
	'projects.resourceAccess': {
		riskLevel: 'read',
		description: 'Get resource access rules for project-specific actions',
	},
	'projects.scheduleDelete': {
		riskLevel: 'destructive',
		description: 'Deletes a project with a 48 hour grace period',
	},
	'projects.serviceUsage': {
		riskLevel: 'read',
		description:
			'Get paginated usage grouped by project and service for a workspace',
	},
	'projects.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Transfer a project to a workspace',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Updates a project',
	},
	'projects.updateClearanceDefault': {
		riskLevel: 'write',
		description:
			"Sets whether environments created from now on start with Railway Authentication protecting services that have no setting of their own. Existing environments are unchanged. Requires a workspace admin; turning it on also requires the workspace's Railway Authentication entitlement",
	},
	'projects.workspaceMembers': {
		riskLevel: 'read',
		description: 'Get workspace members for a project with 2FA details',
	},
	'railwayDomainDnsRecords.create': {
		riskLevel: 'write',
		description: 'Create a DNS record for a Railway domain',
	},
	'railwayDomainDnsRecords.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a DNS record for a Railway domain',
	},
	'railwayDomainDnsRecords.list': {
		riskLevel: 'read',
		description: 'List DNS records for a Railway domain',
	},
	'railwayDomainDnsRecords.update': {
		riskLevel: 'write',
		description: 'Update a DNS record for a Railway domain',
	},
	'railwayDomainEmailForwardingRules.create': {
		riskLevel: 'write',
		description: 'Forward an address on this domain to an external inbox',
	},
	'railwayDomainEmailForwardingRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Stop forwarding an address on this domain',
	},
	'railwayDomainEmailForwardingRules.list': {
		riskLevel: 'read',
		description: 'List email forwarding rules for a Railway domain',
	},
	'railwayDomainEmailForwardingRules.removeAll': {
		riskLevel: 'destructive',
		description:
			'Stop forwarding every address on this domain, and remove the mail records that delivered them',
	},
	'railwayDomainEmailForwardingRules.sendTest': {
		riskLevel: 'destructive',
		description:
			'Send a message to a forwarded address so the customer can confirm it delivers',
	},
	'railwayDomainEmailForwardingRules.update': {
		riskLevel: 'write',
		description: 'Change where a forwarded address delivers',
	},
	'railwayDomains.emailForwardingEligibility': {
		riskLevel: 'read',
		description:
			"Whether email forwarding can be offered on this domain, or why it can't",
	},
	'railwayDomains.emailForwardingLimits': {
		riskLevel: 'read',
		description:
			"Caps the forwarding UI surfaces before a rule is rejected server-side. Pass workspaceId for that workspace's alias allowance; without it the highest plan's is returned",
	},
	'railwayDomains.get': {
		riskLevel: 'read',
		description: 'Get a Railway domain by ID',
	},
	'railwayDomains.getByName': {
		riskLevel: 'read',
		description: 'Get a Railway domain by its domain name within a workspace',
	},
	'railwayDomains.list': {
		riskLevel: 'read',
		description: 'Get Railway domains for a workspace',
	},
	'railwayDomains.setNameservers': {
		riskLevel: 'destructive',
		description:
			"Delegate the domain's authoritative nameservers to an external DNS provider, or reset to Railway defaults by passing an empty list",
	},
	'railwayDomains.update': {
		riskLevel: 'write',
		description: "Update a Railway domain's settings",
	},
	'referral.get': {
		riskLevel: 'read',
		description: 'Gets the ReferralInfo for the authenticated user',
	},
	'referral.update': {
		riskLevel: 'write',
		description: 'Updates the ReferralInfo for the authenticated user',
	},
	'regions.list': {
		riskLevel: 'read',
		description: 'List available regions',
	},
	'resourceAccess.get': {
		riskLevel: 'read',
		description: 'Get resource access for the current user or workspace',
	},
	'sandboxCheckpoints.create': {
		riskLevel: 'write',
		description:
			"Capture a running sandbox's current disk into a reusable, named checkpoint. Synchronous: the checkpoint is ready when this returns",
	},
	'sandboxCheckpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sandbox checkpoint',
	},
	'sandboxCheckpoints.list': {
		riskLevel: 'read',
		description: 'List named sandbox checkpoints in an environment',
	},
	'sandboxCheckpoints.rename': {
		riskLevel: 'write',
		description: 'Rename a sandbox checkpoint',
	},
	'sandboxSessions.list': {
		riskLevel: 'read',
		description:
			"Resumable sessions inside a sandbox — interactive shells and one-off exec commands, live or recently exited. Null when the sandbox can't report them (e.g. its vm-init predates session listing), one page at a time (first/after)",
	},
	'sandboxes.buildTemplate': {
		riskLevel: 'destructive',
		description: 'Build a sandbox template into a bootable checkpoint',
	},
	'sandboxes.create': {
		riskLevel: 'destructive',
		description: 'Create a sandbox in an environment',
	},
	'sandboxes.destroy': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroy a sandbox',
	},
	'sandboxes.get': {
		riskLevel: 'read',
		description: 'Get a sandbox by id',
	},
	'sandboxes.heartbeat': {
		riskLevel: 'write',
		description: "Extend a sandbox's lifetime",
	},
	'sandboxes.list': {
		riskLevel: 'read',
		description:
			'List sandboxes in an environment, newest first. Passing first/after paginates; omitting them returns the full list, one page at a time (first/after)',
	},
	'sandboxes.templateBuild': {
		riskLevel: 'read',
		description:
			"Get a template's build state by id (the recipe content hash). READY once its checkpoint exists; BUILDING/FAILED reflect the build workflow",
	},
	'serviceDomains.create': {
		riskLevel: 'write',
		description: 'Creates a new service domain',
	},
	'serviceDomains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a service domain',
	},
	'serviceDomains.isAvailable': {
		riskLevel: 'read',
		description: 'Checks if a service domain is available',
	},
	'serviceDomains.update': {
		riskLevel: 'write',
		description: 'Updates a service domain',
	},
	'serviceInstances.autoDeployStatus': {
		riskLevel: 'read',
		description:
			'Returns the auto-deploy status for a service instance, including whether it can be enabled',
	},
	'serviceInstances.clearAutoUpdateSnooze': {
		riskLevel: 'write',
		description:
			'Undo an active auto-update skip for a service instance, applied immediately (no config staging, no redeploy). The recurring maintenance window and update policy are untouched — the next scheduled occurrence fires normally again',
	},
	'serviceInstances.deploy': {
		riskLevel: 'destructive',
		description:
			'Deploy the service in an environment from its latest source; the deployment runs on usage-billed compute',
	},
	'serviceInstances.deployV2': {
		riskLevel: 'destructive',
		description:
			'Deploy the service in an environment from its latest source (or a commit) and return the new deployment id; runs on usage-billed compute',
	},
	'serviceInstances.dismissVulnRemediation': {
		riskLevel: 'write',
		description:
			'Dismiss a pending database security update and cancel its scheduled redeploy',
	},
	'serviceInstances.get': {
		riskLevel: 'read',
		description:
			'Get a service instance belonging to a service and environment',
	},
	'serviceInstances.isUpdatable': {
		riskLevel: 'read',
		description:
			'Check if the upstream repo for a service has an update available',
	},
	'serviceInstances.limitOverride': {
		riskLevel: 'read',
		description:
			'Get the service instance resource limit overrides (null if no overrides set)',
	},
	'serviceInstances.limits': {
		riskLevel: 'read',
		description:
			'Get the merged resource limits for a service instance (includes plan defaults)',
	},
	'serviceInstances.patchVulnNow': {
		riskLevel: 'destructive',
		description:
			'Apply a pending database security update now (backup, then redeploy). Returns the new deployment id',
	},
	'serviceInstances.redeploy': {
		riskLevel: 'destructive',
		description: 'Redeploy a service instance',
	},
	'serviceInstances.snoozeAutoUpdate': {
		riskLevel: 'write',
		description:
			'Skip the next scheduled auto-update for a service instance. Takes effect immediately, with no staged change and no redeploy. The maintenance window and update policy stay as they are. This only delays the next scheduled update',
	},
	'serviceInstances.update': {
		riskLevel: 'write',
		description: 'Update a service instance',
	},
	'serviceInstances.updateAutoDeploy': {
		riskLevel: 'write',
		description: 'Enables or disables auto-deploy for a service instance',
	},
	'serviceInstances.updateAutoUpdateSchedule': {
		riskLevel: 'write',
		description:
			'Update the auto-update maintenance window for a service instance, applied immediately (no config staging, no redeploy). Only the schedule changes — the update policy is untouched',
	},
	'serviceInstances.updateClearance': {
		riskLevel: 'write',
		description:
			"Sets a service instance's own Railway Authentication setting: on, off, or none (follow the environment's default). Requires a workspace admin; ending up on also requires the workspace's Railway Authentication entitlement and edge caching off",
	},
	'serviceInstances.updateLimits': {
		riskLevel: 'write',
		description: 'Update the resource limits for a service instance',
	},
	'services.acknowledgeTakedown': {
		riskLevel: 'write',
		description:
			'Record that a workspace admin confirms subsequent deployments will exclude the content named in this notice, lifting its persistent takedown restriction. any other restriction on the service, and any other outstanding takedown, still applies. It permits a subsequent deployment; it does not restore an earlier one, and it is not Railway verifying the removal',
	},
	'services.addFeatureFlag': {
		riskLevel: 'write',
		description: 'Add a feature flag for a service',
	},
	'services.connect': {
		riskLevel: 'destructive',
		description: 'Connect a service to a source',
	},
	'services.create': {
		riskLevel: 'destructive',
		description:
			'Create a service in a project from an image or a GitHub repo (source); a service with a source deploys right away and uses credits',
	},
	'services.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a service',
	},
	'services.disableCdn': {
		riskLevel: 'write',
		description: 'Disables CDN for a service, soft-deleting the edge config',
	},
	'services.disconnect': {
		riskLevel: 'write',
		description: 'Disconnect a service from a repo',
	},
	'services.enableCdn': {
		riskLevel: 'destructive',
		description:
			'Enables CDN for a service, creating an edge config and attaching all live domains',
	},
	'services.generateShellToken': {
		riskLevel: 'destructive',
		description:
			'Creates a short-lived (5-minute) token for opening a shell, file, or network session to a running deployment',
	},
	'services.get': {
		riskLevel: 'read',
		description: 'Get a service by ID',
	},
	'services.purgeCache': {
		riskLevel: 'write',
		description:
			"Purges the CDN cache for a service. Bumps the edge config's purge epoch so every edge node treats prior cached entries as stale on next request. Idempotent; returns true even if CDN is disabled for the service",
	},
	'services.removeFeatureFlag': {
		riskLevel: 'destructive',
		description: 'Remove a feature flag for a service',
	},
	'services.removeUpstreamUrl': {
		riskLevel: 'destructive',
		description:
			'Remove the upstream URL from all service instances for this service',
	},
	'services.setUnderAttackMode': {
		riskLevel: 'write',
		description:
			"Enables or disables Under Attack Mode for a service. While enabled, the edge serves a browser challenge to unverified visitors of the service's edge-routed domains; non-browser clients (APIs, webhooks) without a clearance cookie are rejected with a 429. Optionally time-boxed via durationSeconds, after which the mode disarms automatically",
	},
	'services.update': {
		riskLevel: 'write',
		description: 'Updates a service',
	},
	'services.updateEdgeConfig': {
		riskLevel: 'write',
		description: 'Updates the edge config (caching settings) for a service',
	},
	'services.updateEdgeRules': {
		riskLevel: 'write',
		description:
			"Replaces the service's edge rules (whole-section replace; null clears). Rules are boolean expressions over request attributes plus one action (block/allow/challenge/redirect/cache_override), evaluated at the edge before requests reach the service. The ruleset is validated server-side; invalid rulesets are rejected with per-rule diagnostics and nothing is written. Rules without an id get a server-assigned stable `rul_` id",
	},
	'services.updateKind': {
		riskLevel: 'write',
		description:
			"Makes an ordinary service a Website (kind WEBSITE) and redeploys it in every environment where it has a deployment. A Website can't be made an ordinary service (kind null) yet. Returns false when the service already has that kind",
	},
	'services.validateEdgeRules': {
		riskLevel: 'read',
		description:
			'Validates an edge ruleset without writing it — returns the same diagnostics updateServiceEdgeRules would reject with (empty list = valid). For live feedback in rule editors',
	},
	'sessions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a session',
	},
	'sessions.list': {
		riskLevel: 'read',
		description:
			'Gets all sessions for authenticated user, one page at a time (first/after)',
	},
	'sharedVariables.configure': {
		riskLevel: 'write',
		description: 'Configure a shared variable',
	},
	'signals.changes': {
		riskLevel: 'read',
		description: 'Recent audit log entries for a signal',
	},
	'signals.create': {
		riskLevel: 'write',
		description: 'Register a new signal for an owner scope',
	},
	'signals.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a signal and its audit log',
	},
	'signals.evaluate': {
		riskLevel: 'read',
		description:
			'Evaluate a signal against an evaluation context (pure resolution; does not mutate registry state)',
	},
	'signals.get': {
		riskLevel: 'read',
		description: 'Fetch a single signal by owner scope and name',
	},
	'signals.list': {
		riskLevel: 'read',
		description: 'List signals registered for an owner scope',
	},
	'signals.replace': {
		riskLevel: 'write',
		description:
			"Replace a signal's type and default, clearing all rules. Destructive — intended for CLI --force re-type",
	},
	'signals.rollback': {
		riskLevel: 'write',
		description:
			'Restore a signal to the snapshot captured before a change (reads prevState from the target change row)',
	},
	'signals.setDefault': {
		riskLevel: 'write',
		description: "Change a signal's canonical default (production floor)",
	},
	'signals.setRule': {
		riskLevel: 'write',
		description:
			'Attach or replace a rule on a signal. Matching rules must agree at resolution time or the default is returned',
	},
	'signals.unsetRule': {
		riskLevel: 'write',
		description: 'Remove a rule from a signal',
	},
	'sshPublicKeys.approveSignup': {
		riskLevel: 'destructive',
		description:
			'Approve an SSH signup: register the offered SSH key on the authenticated account so the agent is recognized. When the key owns an anonymous trial box, claims that trial into workspaceId and re-owns the key',
	},
	'sshPublicKeys.create': {
		riskLevel: 'destructive',
		description:
			"Creates a new SSH public key. When workspaceId is provided (or omitted under a workspace-scoped API token, in which case it defaults to the token's workspace), the key is owned by the workspace and can be used by anyone authenticating as that workspace via native SSH; requires workspace ADMIN access. Otherwise the key is owned by the authenticated user",
	},
	'sshPublicKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an SSH public key',
	},
	'sshPublicKeys.list': {
		riskLevel: 'read',
		description:
			"Gets SSH public keys. If workspaceId is provided, returns the keys owned by that workspace (requires workspace MEMBER access). Under a workspace-scoped API token, workspaceId defaults to the token's workspace when omitted; otherwise returns the authenticated user's personal keys, one page at a time (first/after)",
	},
	'sshPublicKeys.signupInfo': {
		riskLevel: 'read',
		description:
			'Details for an SSH signup confirm page: the SSH key fingerprint to verify before binding it to the account, and the trial box it owns if any',
	},
	'tcpProxies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a TCP proxy by id',
	},
	'tcpProxies.list': {
		riskLevel: 'read',
		description: 'All TCP proxies for a service instance',
	},
	'templates.clone': {
		riskLevel: 'write',
		description: 'Duplicates an existing template',
	},
	'templates.count': {
		riskLevel: 'read',
		description: 'Count all published templates',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a template',
	},
	'templates.deploy': {
		riskLevel: 'destructive',
		description:
			'Deploy a template (by id or code) into a project and environment; the services it creates run on usage-billed compute',
	},
	'templates.ejectServiceSource': {
		riskLevel: 'write',
		description:
			'Ejects a service from the template and creates a new repo in the provided org',
	},
	'templates.generate': {
		riskLevel: 'write',
		description: 'Generate a template for a project',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a template by code or ID or GitHub owner and repo',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'Get all published templates, one page at a time (first/after)',
	},
	'templates.metrics': {
		riskLevel: 'read',
		description: 'Get the metrics for a template',
	},
	'templates.publish': {
		riskLevel: 'write',
		description: 'Publishes a template',
	},
	'templates.revert': {
		riskLevel: 'write',
		description:
			'Reverts an HA cluster to standalone mode using template metadata to derive variables to remove',
	},
	'templates.search': {
		riskLevel: 'read',
		description:
			'Search published templates using the backend-ranked template search index, one page at a time (first/after)',
	},
	'templates.sourceForProject': {
		riskLevel: 'read',
		description: 'Get the source template for a project',
	},
	'templates.unpublish': {
		riskLevel: 'write',
		description: 'Unpublishes a template',
	},
	'templates.updateVolume': {
		riskLevel: 'write',
		description:
			"Sets the default size (in MB) for a volume mount in a template's config. New volumes created when the template is deployed are provisioned at this size, clamped to the deployer's plan maximum. Pass sizeMB: null to clear the pre-size and fall back to the plan default. Editing a template requires maintainer access",
	},
	'traces.get': {
		riskLevel: 'read',
		description:
			'The spans of one trace, oldest first. Only spans belonging to the environment are returned',
	},
	'traces.list': {
		riskLevel: 'read',
		description:
			'Traces of an environment with at least one span matching the filter, newest first',
	},
	'traces.status': {
		riskLevel: 'read',
		description:
			'Span activity per service of an environment within retention; a service absent from the list has produced no spans at all',
	},
	'trustedDomains.create': {
		riskLevel: 'write',
		description: 'Create a new trusted domain for this workspace',
	},
	'trustedDomains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a trusted domain',
	},
	'trustedDomains.list': {
		riskLevel: 'read',
		description:
			'Get all trusted domains for a workspace, one page at a time (first/after)',
	},
	'trustedDomains.retriggerVerification': {
		riskLevel: 'write',
		description: 'Check the DNS record for a workspace email domain',
	},
	'trustedDomains.update': {
		riskLevel: 'write',
		description:
			'Update the automatic joining policy for a workspace email domain',
	},
	'twoFactor.get': {
		riskLevel: 'read',
		description: 'Gets the TwoFactorInfo for the authenticated user',
	},
	'usage.estimated': {
		riskLevel: 'read',
		description:
			'Get the estimated total cost of the project at the end of the current billing cycle. If no `startDate` is provided, the usage for the current billing period of the project owner is returned',
	},
	'usage.get': {
		riskLevel: 'read',
		description:
			'Get the usage for a single project or all projects for a user/workspace. If no `projectId` or `workspaceId` is provided, the usage for the current user is returned. If no `startDate` is provided, the usage for the current billing period of the project owner is returned',
	},
	'usage.removeLimit': {
		riskLevel: 'destructive',
		description: 'Remove the usage limit for a customer',
	},
	'usage.setLimit': {
		riskLevel: 'destructive',
		description: 'Set the usage limit for a customer',
	},
	'user.agreeToFairUse': {
		riskLevel: 'write',
		description:
			'Agree to the fair use policy for the currently authenticated user',
	},
	'user.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the currently authenticated user',
	},
	'user.disconnectDiscord': {
		riskLevel: 'write',
		description: 'Disconnect your Railway account from Discord',
	},
	'user.pendingEmailChange': {
		riskLevel: 'read',
		description:
			"The authenticated user's unconfirmed email change, if there is one",
	},
	'user.removeProviderAuth': {
		riskLevel: 'destructive',
		description: 'Deletes a ProviderAuth',
	},
	'user.updateTerms': {
		riskLevel: 'write',
		description: 'Update date of TermsAgreedOn',
	},
	'userProfile.get': {
		riskLevel: 'read',
		description: 'Get the public profile for a user',
	},
	'userProfile.update': {
		riskLevel: 'write',
		description: 'Updates the profile for the authenticated user',
	},
	'variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a variable',
	},
	'variables.forServiceDeployment': {
		riskLevel: 'read',
		description:
			'All rendered variables that are required for a service deployment',
	},
	'variables.list': {
		riskLevel: 'read',
		description:
			'Get the variables of a service in an environment (or the shared ones without serviceId), as a name -> value map',
	},
	'variables.upsert': {
		riskLevel: 'write',
		description:
			'Create or change one variable; Railway redeploys the service unless skipDeploys is set',
	},
	'variables.upsertMany': {
		riskLevel: 'write',
		description:
			'Create or change several variables at once (replace: true drops the others); redeploys unless skipDeploys is set',
	},
	'volumeInstanceBackupSchedules.list': {
		riskLevel: 'read',
		description: 'List backups schedules of a volume instance',
	},
	'volumeInstanceBackupSchedules.update': {
		riskLevel: 'write',
		description: 'Manage schedule for backups of a volume instance',
	},
	'volumeInstanceBackups.create': {
		riskLevel: 'destructive',
		description: 'Create backup of a volume instance',
	},
	'volumeInstanceBackups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes volume instance backup',
	},
	'volumeInstanceBackups.list': {
		riskLevel: 'read',
		description: 'List backups of a volume instance',
	},
	'volumeInstanceBackups.lock': {
		riskLevel: 'write',
		description: 'Removes backup expiration date',
	},
	'volumeInstanceBackups.restore': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Restore a volume instance from a backup',
	},
	'volumeInstances.get': {
		riskLevel: 'read',
		description: 'Get a single volume instance by id',
	},
	'volumeInstances.pitrRestore': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Point-in-time restore. Creates a brand-new database service in the project, recovered to the target timestamp from the source service's backup history. The source service stays online and untouched",
	},
	'volumeInstances.pitrRestoreEstimate': {
		riskLevel: 'read',
		description:
			"Estimated disk space a point-in-time restore to this target needs, and whether it fits your plan's largest volume. Returns null when no estimate is available",
	},
	'volumeInstances.update': {
		riskLevel: 'write',
		description:
			'Update a volume instance. If no environmentId is provided, all volume instances for the volume will be updated',
	},
	'volumes.create': {
		riskLevel: 'destructive',
		description: 'Create a persistent volume in a project',
	},
	'volumes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a persistent volume in a project',
	},
	'volumes.update': {
		riskLevel: 'write',
		description: 'Update a persistent volume in a project',
	},
	'webhooks.test': {
		riskLevel: 'destructive',
		description:
			'Test a webhook URL by sending a sample payload. Returns the HTTP status code. Custom headers come from `headers`, plus the stored headers of `notificationRuleId` for names not passed',
	},
	'workflows.status': {
		riskLevel: 'read',
		description: 'Gets the status of a workflow',
	},
	'workspaceApiTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes an API token scoped to a workspace. Requires workspace admin access',
	},
	'workspaceApiTokens.list': {
		riskLevel: 'read',
		description:
			'Lists API tokens scoped to a workspace. Requires workspace admin access, one page at a time (first/after)',
	},
	'workspaceMembers.changeRole': {
		riskLevel: 'destructive',
		description: 'Changes a user workspace permissions',
	},
	'workspaceMembers.invite': {
		riskLevel: 'destructive',
		description: 'Invite a user by email to a workspace',
	},
	'workspaceMembers.remove': {
		riskLevel: 'destructive',
		description: 'Remove a user from a workspace',
	},
	'workspacePolicies.addDeploySource': {
		riskLevel: 'write',
		description: 'Add a deploy source to a workspace policy allowlist',
	},
	'workspacePolicies.get': {
		riskLevel: 'read',
		description: 'Get the policies for a workspace',
	},
	'workspacePolicies.removeDeploySource': {
		riskLevel: 'destructive',
		description: 'Remove a deploy source from a workspace policy allowlist',
	},
	'workspacePolicies.selectableDeploySources': {
		riskLevel: 'read',
		description: 'List deploy sources that can be added to a workspace policy',
	},
	'workspacePolicies.updateItem': {
		riskLevel: 'write',
		description:
			'Enable or disable a workspace policy. Enterprise workspaces only',
	},
	'workspaceTemplates.list': {
		riskLevel: 'read',
		description:
			'Get all templates for a workspace, one page at a time (first/after)',
	},
	'workspaces.complianceAgreements': {
		riskLevel: 'read',
		description:
			'Get compliance agreements for a workspace including HIPAA BAA and GDPR DPA status',
	},
	'workspaces.createInviteCode': {
		riskLevel: 'destructive',
		description: 'Get an invite code for a workspace and role',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a workspace and all data associated with it',
	},
	'workspaces.get': {
		riskLevel: 'read',
		description: 'Get the workspace',
	},
	'workspaces.getByCode': {
		riskLevel: 'read',
		description: 'Find a workspace by invite code',
	},
	'workspaces.identityProviders': {
		riskLevel: 'read',
		description:
			'Gets all identity providers of a workspace, one page at a time (first/after)',
	},
	'workspaces.leave': {
		riskLevel: 'destructive',
		description: 'Leave a workspace',
	},
	'workspaces.listExternal': {
		riskLevel: 'read',
		description:
			"Get the workspaces the user doesn't belong to, but needs access (like when invited to a project)",
	},
	'workspaces.setRestrictProjectVisibilityToGroups': {
		riskLevel: 'write',
		description:
			'Control whether non-admin project visibility is restricted to access groups and direct project permissions',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update a workspace by id',
	},
	'workspaces.updateTwoFactorEnforcement': {
		riskLevel: 'destructive',
		description: 'Enable or disable 2FA enforcement for a workspace',
	},
	'workspaces.upsertSlackChannel': {
		riskLevel: 'write',
		description: 'Generate a Slack channel for a workspace',
	},
	'workspaces.usageTotals': {
		riskLevel: 'read',
		description:
			'Workspace-wide SUM of the same UI usage rollup as `usage` grouped by project. Use this for the usage-page header so it does not wait on per-project rows. Deleted projects that still bill are included when `includeDeleted` is true',
	},
	'workspaces.useInviteCode': {
		riskLevel: 'write',
		description: 'Use an invite code to join a workspace',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof railwayEndpointsNested>;
