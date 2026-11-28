// Generated with endpoints/operation-types.ts from Azure DevOps's OpenAPI spec:
// one entry per operation in azuredevops-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { azuredevopsSchemaEntry } from './openapi-schema';
import { createAzureDevopsOperation as op } from './operations';

export const azuredevopsEndpointsNested = {
	account: {
		accounts: {
			list: op('account.accounts.list'),
		},
	},
	approvalsAndChecks: {
		approvals: {
			get: op('approvalsAndChecks.approvals.get'),
			query: op('approvalsAndChecks.approvals.query'),
			update: op('approvalsAndChecks.approvals.update'),
		},
		checkConfigurations: {
			add: op('approvalsAndChecks.checkConfigurations.add'),
			delete: op('approvalsAndChecks.checkConfigurations.delete'),
			get: op('approvalsAndChecks.checkConfigurations.get'),
			list: op('approvalsAndChecks.checkConfigurations.list'),
			query: op('approvalsAndChecks.checkConfigurations.query'),
			update: op('approvalsAndChecks.checkConfigurations.update'),
		},
		checkEvaluations: {
			evaluate: op('approvalsAndChecks.checkEvaluations.evaluate'),
			get: op('approvalsAndChecks.checkEvaluations.get'),
		},
		pipelinePermissions: {
			get: op('approvalsAndChecks.pipelinePermissions.get'),
			updatePipelinePermisionsForResource: op(
				'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResource',
			),
			updatePipelinePermisionsForResources: op(
				'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResources',
			),
		},
	},
	artifacts: {
		artifactDetails: {
			getBadge: op('artifacts.artifactDetails.getBadge'),
			getPackage: op('artifacts.artifactDetails.getPackage'),
			getPackageVersion: op('artifacts.artifactDetails.getPackageVersion'),
			getPackageVersionProvenance: op(
				'artifacts.artifactDetails.getPackageVersionProvenance',
			),
			getPackageVersions: op('artifacts.artifactDetails.getPackageVersions'),
			getPackages: op('artifacts.artifactDetails.getPackages'),
			queryPackageMetrics: op('artifacts.artifactDetails.queryPackageMetrics'),
			queryPackageVersionMetrics: op(
				'artifacts.artifactDetails.queryPackageVersionMetrics',
			),
		},
		changeTracking: {
			getFeedChange: op('artifacts.changeTracking.getFeedChange'),
			getFeedChanges: op('artifacts.changeTracking.getFeedChanges'),
			getPackageChanges: op('artifacts.changeTracking.getPackageChanges'),
		},
		feedManagement: {
			createFeed: op('artifacts.feedManagement.createFeed'),
			createFeedView: op('artifacts.feedManagement.createFeedView'),
			deleteFeed: op('artifacts.feedManagement.deleteFeed'),
			deleteFeedView: op('artifacts.feedManagement.deleteFeedView'),
			getFeed: op('artifacts.feedManagement.getFeed'),
			getFeedPermissions: op('artifacts.feedManagement.getFeedPermissions'),
			getFeedView: op('artifacts.feedManagement.getFeedView'),
			getFeedViews: op('artifacts.feedManagement.getFeedViews'),
			getFeeds: op('artifacts.feedManagement.getFeeds'),
			setFeedPermissions: op('artifacts.feedManagement.setFeedPermissions'),
			updateFeed: op('artifacts.feedManagement.updateFeed'),
			updateFeedView: op('artifacts.feedManagement.updateFeedView'),
		},
		feedRecycleBin: {
			list: op('artifacts.feedRecycleBin.list'),
			permanentDeleteFeed: op('artifacts.feedRecycleBin.permanentDeleteFeed'),
			restoreDeletedFeed: op('artifacts.feedRecycleBin.restoreDeletedFeed'),
		},
		provenance: {
			createSession: op('artifacts.provenance.createSession'),
		},
		recycleBin: {
			emptyRecycleBin: op('artifacts.recycleBin.emptyRecycleBin'),
			getRecycleBinPackage: op('artifacts.recycleBin.getRecycleBinPackage'),
			getRecycleBinPackageVersion: op(
				'artifacts.recycleBin.getRecycleBinPackageVersion',
			),
			getRecycleBinPackageVersions: op(
				'artifacts.recycleBin.getRecycleBinPackageVersions',
			),
			getRecycleBinPackages: op('artifacts.recycleBin.getRecycleBinPackages'),
		},
		retentionPolicies: {
			deleteRetentionPolicy: op(
				'artifacts.retentionPolicies.deleteRetentionPolicy',
			),
			getRetentionPolicy: op('artifacts.retentionPolicies.getRetentionPolicy'),
			setRetentionPolicy: op('artifacts.retentionPolicies.setRetentionPolicy'),
		},
		serviceSettings: {
			getGlobalPermissions: op(
				'artifacts.serviceSettings.getGlobalPermissions',
			),
			setGlobalPermissions: op(
				'artifacts.serviceSettings.setGlobalPermissions',
			),
		},
	},
	artifactsPackageTypes: {
		maven: {
			deletePackageVersion: op(
				'artifactsPackageTypes.maven.deletePackageVersion',
			),
			deletePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.maven.deletePackageVersionFromRecycleBin',
			),
			downloadPackage: op('artifactsPackageTypes.maven.downloadPackage'),
			getPackageVersion: op('artifactsPackageTypes.maven.getPackageVersion'),
			getPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.maven.getPackageVersionFromRecycleBin',
			),
			getUpstreamingBehavior: op(
				'artifactsPackageTypes.maven.getUpstreamingBehavior',
			),
			restorePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.maven.restorePackageVersionFromRecycleBin',
			),
			setUpstreamingBehavior: op(
				'artifactsPackageTypes.maven.setUpstreamingBehavior',
			),
			updatePackageVersion: op(
				'artifactsPackageTypes.maven.updatePackageVersion',
			),
			updatePackageVersions: op(
				'artifactsPackageTypes.maven.updatePackageVersions',
			),
			updateRecycleBinPackages: op(
				'artifactsPackageTypes.maven.updateRecycleBinPackages',
			),
		},
		npm: {
			deletePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.npm.deletePackageVersionFromRecycleBin',
			),
			deleteScopedPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.npm.deleteScopedPackageVersionFromRecycleBin',
			),
			downloadPackage: op('artifactsPackageTypes.npm.downloadPackage'),
			downloadScopedPackage: op(
				'artifactsPackageTypes.npm.downloadScopedPackage',
			),
			getPackageReadme: op('artifactsPackageTypes.npm.getPackageReadme'),
			getPackageUpstreamingBehavior: op(
				'artifactsPackageTypes.npm.getPackageUpstreamingBehavior',
			),
			getPackageVersion: op('artifactsPackageTypes.npm.getPackageVersion'),
			getPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.npm.getPackageVersionFromRecycleBin',
			),
			getScopedPackageReadme: op(
				'artifactsPackageTypes.npm.getScopedPackageReadme',
			),
			getScopedPackageUpstreamingBehavior: op(
				'artifactsPackageTypes.npm.getScopedPackageUpstreamingBehavior',
			),
			getScopedPackageVersion: op(
				'artifactsPackageTypes.npm.getScopedPackageVersion',
			),
			getScopedPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.npm.getScopedPackageVersionFromRecycleBin',
			),
			restorePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.npm.restorePackageVersionFromRecycleBin',
			),
			restoreScopedPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.npm.restoreScopedPackageVersionFromRecycleBin',
			),
			setScopedUpstreamingBehavior: op(
				'artifactsPackageTypes.npm.setScopedUpstreamingBehavior',
			),
			setUpstreamingBehavior: op(
				'artifactsPackageTypes.npm.setUpstreamingBehavior',
			),
			unpublishPackage: op('artifactsPackageTypes.npm.unpublishPackage'),
			unpublishScopedPackage: op(
				'artifactsPackageTypes.npm.unpublishScopedPackage',
			),
			updatePackage: op('artifactsPackageTypes.npm.updatePackage'),
			updatePackages: op('artifactsPackageTypes.npm.updatePackages'),
			updateRecycleBinPackages: op(
				'artifactsPackageTypes.npm.updateRecycleBinPackages',
			),
			updateScopedPackage: op('artifactsPackageTypes.npm.updateScopedPackage'),
		},
		nuGet: {
			deletePackageVersion: op(
				'artifactsPackageTypes.nuGet.deletePackageVersion',
			),
			deletePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.nuGet.deletePackageVersionFromRecycleBin',
			),
			downloadPackage: op('artifactsPackageTypes.nuGet.downloadPackage'),
			getPackageVersion: op('artifactsPackageTypes.nuGet.getPackageVersion'),
			getPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.nuGet.getPackageVersionFromRecycleBin',
			),
			getUpstreamingBehavior: op(
				'artifactsPackageTypes.nuGet.getUpstreamingBehavior',
			),
			restorePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.nuGet.restorePackageVersionFromRecycleBin',
			),
			setUpstreamingBehavior: op(
				'artifactsPackageTypes.nuGet.setUpstreamingBehavior',
			),
			updatePackageVersion: op(
				'artifactsPackageTypes.nuGet.updatePackageVersion',
			),
			updatePackageVersions: op(
				'artifactsPackageTypes.nuGet.updatePackageVersions',
			),
			updateRecycleBinPackageVersions: op(
				'artifactsPackageTypes.nuGet.updateRecycleBinPackageVersions',
			),
		},
		python: {
			deletePackageVersion: op(
				'artifactsPackageTypes.python.deletePackageVersion',
			),
			deletePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.python.deletePackageVersionFromRecycleBin',
			),
			downloadPackage: op('artifactsPackageTypes.python.downloadPackage'),
			getPackageVersion: op('artifactsPackageTypes.python.getPackageVersion'),
			getPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.python.getPackageVersionFromRecycleBin',
			),
			getUpstreamingBehavior: op(
				'artifactsPackageTypes.python.getUpstreamingBehavior',
			),
			restorePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.python.restorePackageVersionFromRecycleBin',
			),
			setUpstreamingBehavior: op(
				'artifactsPackageTypes.python.setUpstreamingBehavior',
			),
			updatePackageVersion: op(
				'artifactsPackageTypes.python.updatePackageVersion',
			),
			updatePackageVersions: op(
				'artifactsPackageTypes.python.updatePackageVersions',
			),
			updateRecycleBinPackageVersions: op(
				'artifactsPackageTypes.python.updateRecycleBinPackageVersions',
			),
		},
		universal: {
			deletePackageVersion: op(
				'artifactsPackageTypes.universal.deletePackageVersion',
			),
			deletePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.universal.deletePackageVersionFromRecycleBin',
			),
			getPackageVersion: op(
				'artifactsPackageTypes.universal.getPackageVersion',
			),
			getPackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.universal.getPackageVersionFromRecycleBin',
			),
			restorePackageVersionFromRecycleBin: op(
				'artifactsPackageTypes.universal.restorePackageVersionFromRecycleBin',
			),
			updatePackageVersion: op(
				'artifactsPackageTypes.universal.updatePackageVersion',
			),
			updatePackageVersions: op(
				'artifactsPackageTypes.universal.updatePackageVersions',
			),
			updateRecycleBinPackageVersions: op(
				'artifactsPackageTypes.universal.updateRecycleBinPackageVersions',
			),
		},
	},
	audit: {
		actions: {
			list: op('audit.actions.list'),
		},
		auditLog: {
			query: op('audit.auditLog.query'),
		},
		downloadLog: {
			downloadLog: op('audit.downloadLog.downloadLog'),
		},
		streams: {
			create: op('audit.streams.create'),
			delete: op('audit.streams.delete'),
			queryAllStreams: op('audit.streams.queryAllStreams'),
			queryStreamById: op('audit.streams.queryStreamById'),
			updateStatus: op('audit.streams.updateStatus'),
			updateStream: op('audit.streams.updateStream'),
		},
	},
	build: {
		artifacts: {
			create: op('build.artifacts.create'),
			getArtifact: op('build.artifacts.getArtifact'),
			getFile: op('build.artifacts.getFile'),
			list: op('build.artifacts.list'),
		},
		attachments: {
			get: op('build.attachments.get'),
			list: op('build.attachments.list'),
		},
		authorizedresources: {
			authorizeProjectResources: op(
				'build.authorizedresources.authorizeProjectResources',
			),
			list: op('build.authorizedresources.list'),
		},
		badge: {
			get: op('build.badge.get'),
			getBuildBadgeData: op('build.badge.getBuildBadgeData'),
		},
		builds: {
			delete: op('build.builds.delete'),
			get: op('build.builds.get'),
			getBuildChanges: op('build.builds.getBuildChanges'),
			getBuildLog: op('build.builds.getBuildLog'),
			getBuildLogs: op('build.builds.getBuildLogs'),
			getBuildWorkItemsRefs: op('build.builds.getBuildWorkItemsRefs'),
			getBuildWorkItemsRefsFromCommits: op(
				'build.builds.getBuildWorkItemsRefsFromCommits',
			),
			getChangesBetweenBuilds: op('build.builds.getChangesBetweenBuilds'),
			getRetentionLeasesForBuild: op('build.builds.getRetentionLeasesForBuild'),
			getWorkItemsBetweenBuilds: op('build.builds.getWorkItemsBetweenBuilds'),
			list: op('build.builds.list'),
			queue: op('build.builds.queue'),
			updateBuild: op('build.builds.updateBuild'),
			updateBuilds: op('build.builds.updateBuilds'),
		},
		controllers: {
			get: op('build.controllers.get'),
			list: op('build.controllers.list'),
		},
		definitions: {
			create: op('build.definitions.create'),
			delete: op('build.definitions.delete'),
			get: op('build.definitions.get'),
			getDefinitionRevisions: op('build.definitions.getDefinitionRevisions'),
			list: op('build.definitions.list'),
			restoreDefinition: op('build.definitions.restoreDefinition'),
			update: op('build.definitions.update'),
		},
		folders: {
			create: op('build.folders.create'),
			delete: op('build.folders.delete'),
			list: op('build.folders.list'),
			update: op('build.folders.update'),
		},
		generalSettings: {
			get: op('build.generalSettings.get'),
			update: op('build.generalSettings.update'),
		},
		history: {
			get: op('build.history.get'),
		},
		latest: {
			get: op('build.latest.get'),
		},
		leases: {
			add: op('build.leases.add'),
			delete: op('build.leases.delete'),
			get: op('build.leases.get'),
			getRetentionLeasesByMinimalRetentionLeases: op(
				'build.leases.getRetentionLeasesByMinimalRetentionLeases',
			),
			getRetentionLeasesByOwnerId: op(
				'build.leases.getRetentionLeasesByOwnerId',
			),
			getRetentionLeasesByUserId: op('build.leases.getRetentionLeasesByUserId'),
			update: op('build.leases.update'),
		},
		metrics: {
			getDefinitionMetrics: op('build.metrics.getDefinitionMetrics'),
			getProjectMetrics: op('build.metrics.getProjectMetrics'),
		},
		options: {
			list: op('build.options.list'),
		},
		properties: {
			getBuildProperties: op('build.properties.getBuildProperties'),
			getDefinitionProperties: op('build.properties.getDefinitionProperties'),
			updateBuildProperties: op('build.properties.updateBuildProperties'),
			updateDefinitionProperties: op(
				'build.properties.updateDefinitionProperties',
			),
		},
		report: {
			get: op('build.report.get'),
		},
		resourceUsage: {
			get: op('build.resourceUsage.get'),
		},
		resources: {
			authorizeDefinitionResources: op(
				'build.resources.authorizeDefinitionResources',
			),
			list: op('build.resources.list'),
		},
		retention: {
			get: op('build.retention.get'),
			update: op('build.retention.update'),
		},
		settings: {
			get: op('build.settings.get'),
			update: op('build.settings.update'),
		},
		sourceProviders: {
			getFileContents: op('build.sourceProviders.getFileContents'),
			getPathContents: op('build.sourceProviders.getPathContents'),
			getPullRequest: op('build.sourceProviders.getPullRequest'),
			list: op('build.sourceProviders.list'),
			listBranches: op('build.sourceProviders.listBranches'),
			listRepositories: op('build.sourceProviders.listRepositories'),
			listWebhooks: op('build.sourceProviders.listWebhooks'),
			restoreWebhooks: op('build.sourceProviders.restoreWebhooks'),
		},
		stages: {
			update: op('build.stages.update'),
		},
		status: {
			get: op('build.status.get'),
		},
		tags: {
			addBuildTag: op('build.tags.addBuildTag'),
			addBuildTags: op('build.tags.addBuildTags'),
			addDefinitionTag: op('build.tags.addDefinitionTag'),
			addDefinitionTags: op('build.tags.addDefinitionTags'),
			deleteBuildTag: op('build.tags.deleteBuildTag'),
			deleteDefinitionTag: op('build.tags.deleteDefinitionTag'),
			deleteTag: op('build.tags.deleteTag'),
			getBuildTags: op('build.tags.getBuildTags'),
			getDefinitionTags: op('build.tags.getDefinitionTags'),
			getTags: op('build.tags.getTags'),
			updateBuildTags: op('build.tags.updateBuildTags'),
			updateDefinitionTags: op('build.tags.updateDefinitionTags'),
		},
		templates: {
			delete: op('build.templates.delete'),
			get: op('build.templates.get'),
			list: op('build.templates.list'),
			saveTemplate: op('build.templates.saveTemplate'),
		},
		timeline: {
			get: op('build.timeline.get'),
		},
		yaml: {
			get: op('build.yaml.get'),
		},
	},
	core: {
		avatar: {
			removeProjectAvatar: op('core.avatar.removeProjectAvatar'),
			setProjectAvatar: op('core.avatar.setProjectAvatar'),
		},
		categorizedTeams: {
			get: op('core.categorizedTeams.get'),
		},
		processes: {
			get: op('core.processes.get'),
			list: op('core.processes.list'),
		},
		projects: {
			create: op('core.projects.create'),
			delete: op('core.projects.delete'),
			get: op('core.projects.get'),
			getProjectProperties: op('core.projects.getProjectProperties'),
			list: op('core.projects.list'),
			setProjectProperties: op('core.projects.setProjectProperties'),
			update: op('core.projects.update'),
		},
		teams: {
			create: op('core.teams.create'),
			delete: op('core.teams.delete'),
			get: op('core.teams.get'),
			getAllTeams: op('core.teams.getAllTeams'),
			getTeamMembersWithExtendedProperties: op(
				'core.teams.getTeamMembersWithExtendedProperties',
			),
			getTeams: op('core.teams.getTeams'),
			update: op('core.teams.update'),
		},
	},
	dashboard: {
		dashboards: {
			create: op('dashboard.dashboards.create'),
			delete: op('dashboard.dashboards.delete'),
			get: op('dashboard.dashboards.get'),
			list: op('dashboard.dashboards.list'),
			replaceDashboard: op('dashboard.dashboards.replaceDashboard'),
			replaceDashboards: op('dashboard.dashboards.replaceDashboards'),
		},
		widgetTypes: {
			getWidgetMetadata: op('dashboard.widgetTypes.getWidgetMetadata'),
			getWidgetTypes: op('dashboard.widgetTypes.getWidgetTypes'),
		},
		widgets: {
			create: op('dashboard.widgets.create'),
			delete: op('dashboard.widgets.delete'),
			getWidget: op('dashboard.widgets.getWidget'),
			getWidgets: op('dashboard.widgets.getWidgets'),
			replaceWidget: op('dashboard.widgets.replaceWidget'),
			replaceWidgets: op('dashboard.widgets.replaceWidgets'),
			updateWidget: op('dashboard.widgets.updateWidget'),
			updateWidgets: op('dashboard.widgets.updateWidgets'),
		},
	},
	distributedTask: {
		agentclouds: {
			add: op('distributedTask.agentclouds.add'),
			delete: op('distributedTask.agentclouds.delete'),
			get: op('distributedTask.agentclouds.get'),
			list: op('distributedTask.agentclouds.list'),
			update: op('distributedTask.agentclouds.update'),
		},
		agentcloudtypes: {
			list: op('distributedTask.agentcloudtypes.list'),
		},
		agents: {
			add: op('distributedTask.agents.add'),
			delete: op('distributedTask.agents.delete'),
			getAgent: op('distributedTask.agents.getAgent'),
			getPoolPermission: op('distributedTask.agents.getPoolPermission'),
			list: op('distributedTask.agents.list'),
			replaceAgent: op('distributedTask.agents.replaceAgent'),
			update: op('distributedTask.agents.update'),
		},
		deploymentgroups: {
			add: op('distributedTask.deploymentgroups.add'),
			delete: op('distributedTask.deploymentgroups.delete'),
			get: op('distributedTask.deploymentgroups.get'),
			list: op('distributedTask.deploymentgroups.list'),
			update: op('distributedTask.deploymentgroups.update'),
		},
		elasticpoollogs: {
			list: op('distributedTask.elasticpoollogs.list'),
		},
		elasticpools: {
			create: op('distributedTask.elasticpools.create'),
			get: op('distributedTask.elasticpools.get'),
			list: op('distributedTask.elasticpools.list'),
			update: op('distributedTask.elasticpools.update'),
		},
		environmentdeploymentRecords: {
			list: op('distributedTask.environmentdeploymentRecords.list'),
		},
		environments: {
			add: op('distributedTask.environments.add'),
			delete: op('distributedTask.environments.delete'),
			get: op('distributedTask.environments.get'),
			list: op('distributedTask.environments.list'),
			update: op('distributedTask.environments.update'),
		},
		events: {
			postEvent: op('distributedTask.events.postEvent'),
		},
		kubernetes: {
			add: op('distributedTask.kubernetes.add'),
			delete: op('distributedTask.kubernetes.delete'),
			get: op('distributedTask.kubernetes.get'),
		},
		logs: {
			appendLogContent: op('distributedTask.logs.appendLogContent'),
			create: op('distributedTask.logs.create'),
		},
		nodes: {
			list: op('distributedTask.nodes.list'),
			update: op('distributedTask.nodes.update'),
		},
		oidctoken: {
			create: op('distributedTask.oidctoken.create'),
		},
		pools: {
			add: op('distributedTask.pools.add'),
			delete: op('distributedTask.pools.delete'),
			get: op('distributedTask.pools.get'),
			getAgentPools: op('distributedTask.pools.getAgentPools'),
			getAgentPoolsByIds: op('distributedTask.pools.getAgentPoolsByIds'),
			update: op('distributedTask.pools.update'),
		},
		queues: {
			add: op('distributedTask.queues.add'),
			delete: op('distributedTask.queues.delete'),
			get: op('distributedTask.queues.get'),
			getAgentQueues: op('distributedTask.queues.getAgentQueues'),
			getAgentQueuesByIds: op('distributedTask.queues.getAgentQueuesByIds'),
			getAgentQueuesByNames: op('distributedTask.queues.getAgentQueuesByNames'),
			getAgentQueuesForPools: op(
				'distributedTask.queues.getAgentQueuesForPools',
			),
		},
		records: {
			update: op('distributedTask.records.update'),
		},
		requests: {
			list: op('distributedTask.requests.list'),
		},
		targets: {
			delete: op('distributedTask.targets.delete'),
			get: op('distributedTask.targets.get'),
			list: op('distributedTask.targets.list'),
			update: op('distributedTask.targets.update'),
		},
		taskgroups: {
			add: op('distributedTask.taskgroups.add'),
			delete: op('distributedTask.taskgroups.delete'),
			list: op('distributedTask.taskgroups.list'),
			update: op('distributedTask.taskgroups.update'),
		},
		variablegroups: {
			add: op('distributedTask.variablegroups.add'),
			delete: op('distributedTask.variablegroups.delete'),
			get: op('distributedTask.variablegroups.get'),
			getVariableGroups: op('distributedTask.variablegroups.getVariableGroups'),
			getVariableGroupsById: op(
				'distributedTask.variablegroups.getVariableGroupsById',
			),
			shareVariableGroup: op(
				'distributedTask.variablegroups.shareVariableGroup',
			),
			update: op('distributedTask.variablegroups.update'),
		},
		yamlschema: {
			get: op('distributedTask.yamlschema.get'),
		},
	},
	extensionManagement: {
		installedExtensions: {
			get: op('extensionManagement.installedExtensions.get'),
			installExtensionByName: op(
				'extensionManagement.installedExtensions.installExtensionByName',
			),
			list: op('extensionManagement.installedExtensions.list'),
			uninstallExtensionByName: op(
				'extensionManagement.installedExtensions.uninstallExtensionByName',
			),
			update: op('extensionManagement.installedExtensions.update'),
		},
	},
	favorite: {
		favorites: {
			createFavorite: op('favorite.favorites.createFavorite'),
			createFavoriteOfOwner: op('favorite.favorites.createFavoriteOfOwner'),
			deleteFavoriteById: op('favorite.favorites.deleteFavoriteById'),
			deleteFavoriteOfOwnerById: op(
				'favorite.favorites.deleteFavoriteOfOwnerById',
			),
			getFavoriteByArtifact: op('favorite.favorites.getFavoriteByArtifact'),
			getFavoriteById: op('favorite.favorites.getFavoriteById'),
			getFavoriteOfOwnerById: op('favorite.favorites.getFavoriteOfOwnerById'),
			getFavorites: op('favorite.favorites.getFavorites'),
			getFavoritesOfOwner: op('favorite.favorites.getFavoritesOfOwner'),
		},
	},
	git: {
		annotatedTags: {
			create: op('git.annotatedTags.create'),
			get: op('git.annotatedTags.get'),
		},
		blobs: {
			getBlob: op('git.blobs.getBlob'),
			getBlobsZip: op('git.blobs.getBlobsZip'),
		},
		cherryPicks: {
			create: op('git.cherryPicks.create'),
			getCherryPick: op('git.cherryPicks.getCherryPick'),
			getCherryPickForRefName: op('git.cherryPicks.getCherryPickForRefName'),
		},
		commits: {
			get: op('git.commits.get'),
			getChanges: op('git.commits.getChanges'),
			getCommits: op('git.commits.getCommits'),
			getCommitsBatch: op('git.commits.getCommitsBatch'),
			getPushCommits: op('git.commits.getPushCommits'),
		},
		diffs: {
			get: op('git.diffs.get'),
		},
		forks: {
			createForkSyncRequest: op('git.forks.createForkSyncRequest'),
			getForkSyncRequest: op('git.forks.getForkSyncRequest'),
			getForkSyncRequests: op('git.forks.getForkSyncRequests'),
			list: op('git.forks.list'),
		},
		importRequests: {
			create: op('git.importRequests.create'),
			get: op('git.importRequests.get'),
			query: op('git.importRequests.query'),
			update: op('git.importRequests.update'),
		},
		items: {
			get: op('git.items.get'),
			getItemsBatch: op('git.items.getItemsBatch'),
			list: op('git.items.list'),
		},
		mergeBases: {
			list: op('git.mergeBases.list'),
		},
		merges: {
			create: op('git.merges.create'),
			get: op('git.merges.get'),
		},
		policyConfigurations: {
			get: op('git.policyConfigurations.get'),
		},
		pullRequestAttachments: {
			create: op('git.pullRequestAttachments.create'),
			delete: op('git.pullRequestAttachments.delete'),
			get: op('git.pullRequestAttachments.get'),
			list: op('git.pullRequestAttachments.list'),
		},
		pullRequestCommentLikes: {
			create: op('git.pullRequestCommentLikes.create'),
			delete: op('git.pullRequestCommentLikes.delete'),
			list: op('git.pullRequestCommentLikes.list'),
		},
		pullRequestCommits: {
			getPullRequestCommits: op('git.pullRequestCommits.getPullRequestCommits'),
			getPullRequestIterationCommits: op(
				'git.pullRequestCommits.getPullRequestIterationCommits',
			),
		},
		pullRequestIterationChanges: {
			get: op('git.pullRequestIterationChanges.get'),
		},
		pullRequestIterationStatuses: {
			create: op('git.pullRequestIterationStatuses.create'),
			delete: op('git.pullRequestIterationStatuses.delete'),
			get: op('git.pullRequestIterationStatuses.get'),
			list: op('git.pullRequestIterationStatuses.list'),
			update: op('git.pullRequestIterationStatuses.update'),
		},
		pullRequestIterations: {
			get: op('git.pullRequestIterations.get'),
			list: op('git.pullRequestIterations.list'),
		},
		pullRequestLabels: {
			create: op('git.pullRequestLabels.create'),
			delete: op('git.pullRequestLabels.delete'),
			get: op('git.pullRequestLabels.get'),
			list: op('git.pullRequestLabels.list'),
		},
		pullRequestProperties: {
			list: op('git.pullRequestProperties.list'),
			update: op('git.pullRequestProperties.update'),
		},
		pullRequestQuery: {
			get: op('git.pullRequestQuery.get'),
		},
		pullRequestReviewers: {
			createPullRequestReviewer: op(
				'git.pullRequestReviewers.createPullRequestReviewer',
			),
			createPullRequestReviewers: op(
				'git.pullRequestReviewers.createPullRequestReviewers',
			),
			createUnmaterializedPullRequestReviewer: op(
				'git.pullRequestReviewers.createUnmaterializedPullRequestReviewer',
			),
			delete: op('git.pullRequestReviewers.delete'),
			get: op('git.pullRequestReviewers.get'),
			list: op('git.pullRequestReviewers.list'),
			updatePullRequestReviewer: op(
				'git.pullRequestReviewers.updatePullRequestReviewer',
			),
			updatePullRequestReviewers: op(
				'git.pullRequestReviewers.updatePullRequestReviewers',
			),
		},
		pullRequestShare: {
			sharePullRequest: op('git.pullRequestShare.sharePullRequest'),
		},
		pullRequestStatuses: {
			create: op('git.pullRequestStatuses.create'),
			delete: op('git.pullRequestStatuses.delete'),
			get: op('git.pullRequestStatuses.get'),
			list: op('git.pullRequestStatuses.list'),
			update: op('git.pullRequestStatuses.update'),
		},
		pullRequestThreadComments: {
			create: op('git.pullRequestThreadComments.create'),
			delete: op('git.pullRequestThreadComments.delete'),
			get: op('git.pullRequestThreadComments.get'),
			list: op('git.pullRequestThreadComments.list'),
			update: op('git.pullRequestThreadComments.update'),
		},
		pullRequestThreads: {
			create: op('git.pullRequestThreads.create'),
			get: op('git.pullRequestThreads.get'),
			list: op('git.pullRequestThreads.list'),
			update: op('git.pullRequestThreads.update'),
		},
		pullRequestWorkItems: {
			list: op('git.pullRequestWorkItems.list'),
		},
		pullRequests: {
			create: op('git.pullRequests.create'),
			getPullRequest: op('git.pullRequests.getPullRequest'),
			getPullRequestById: op('git.pullRequests.getPullRequestById'),
			getPullRequests: op('git.pullRequests.getPullRequests'),
			getPullRequestsByProject: op('git.pullRequests.getPullRequestsByProject'),
			update: op('git.pullRequests.update'),
		},
		pushes: {
			create: op('git.pushes.create'),
			get: op('git.pushes.get'),
			list: op('git.pushes.list'),
		},
		refs: {
			list: op('git.refs.list'),
			updateRef: op('git.refs.updateRef'),
			updateRefs: op('git.refs.updateRefs'),
		},
		refsFavorites: {
			create: op('git.refsFavorites.create'),
			delete: op('git.refsFavorites.delete'),
			get: op('git.refsFavorites.get'),
			list: op('git.refsFavorites.list'),
		},
		repositories: {
			create: op('git.repositories.create'),
			delete: op('git.repositories.delete'),
			deleteRepositoryFromRecycleBin: op(
				'git.repositories.deleteRepositoryFromRecycleBin',
			),
			getDeletedRepositories: op('git.repositories.getDeletedRepositories'),
			getRecycleBinRepositories: op(
				'git.repositories.getRecycleBinRepositories',
			),
			getRepository: op('git.repositories.getRepository'),
			getRepositoryWithParent: op('git.repositories.getRepositoryWithParent'),
			list: op('git.repositories.list'),
			restoreRepositoryFromRecycleBin: op(
				'git.repositories.restoreRepositoryFromRecycleBin',
			),
			update: op('git.repositories.update'),
		},
		reverts: {
			create: op('git.reverts.create'),
			getRevert: op('git.reverts.getRevert'),
			getRevertForRefName: op('git.reverts.getRevertForRefName'),
		},
		stats: {
			get: op('git.stats.get'),
			list: op('git.stats.list'),
		},
		statuses: {
			create: op('git.statuses.create'),
			list: op('git.statuses.list'),
		},
		suggestions: {
			list: op('git.suggestions.list'),
		},
		trees: {
			get: op('git.trees.get'),
		},
	},
	graph: {
		avatars: {
			delete: op('graph.avatars.delete'),
			get: op('graph.avatars.get'),
			setAvatar: op('graph.avatars.setAvatar'),
		},
		descriptors: {
			get: op('graph.descriptors.get'),
		},
		groups: {
			create: op('graph.groups.create'),
			delete: op('graph.groups.delete'),
			get: op('graph.groups.get'),
			list: op('graph.groups.list'),
			update: op('graph.groups.update'),
		},
		membershipStates: {
			get: op('graph.membershipStates.get'),
		},
		memberships: {
			add: op('graph.memberships.add'),
			get: op('graph.memberships.get'),
			list: op('graph.memberships.list'),
			removeMembership: op('graph.memberships.removeMembership'),
		},
		providerInfo: {
			get: op('graph.providerInfo.get'),
		},
		requestAccess: {
			requestAccess: op('graph.requestAccess.requestAccess'),
		},
		servicePrincipals: {
			create: op('graph.servicePrincipals.create'),
			delete: op('graph.servicePrincipals.delete'),
			get: op('graph.servicePrincipals.get'),
			list: op('graph.servicePrincipals.list'),
		},
		storageKeys: {
			get: op('graph.storageKeys.get'),
		},
		subjectLookup: {
			lookupSubjects: op('graph.subjectLookup.lookupSubjects'),
		},
		subjectQuery: {
			query: op('graph.subjectQuery.query'),
		},
		users: {
			create: op('graph.users.create'),
			delete: op('graph.users.delete'),
			get: op('graph.users.get'),
			list: op('graph.users.list'),
			update: op('graph.users.update'),
		},
	},
	hooks: {
		consumers: {
			get: op('hooks.consumers.get'),
			getConsumerAction: op('hooks.consumers.getConsumerAction'),
			list: op('hooks.consumers.list'),
			listConsumerActions: op('hooks.consumers.listConsumerActions'),
		},
		diagnostics: {
			get: op('hooks.diagnostics.get'),
			update: op('hooks.diagnostics.update'),
		},
		notifications: {
			create: op('hooks.notifications.create'),
			get: op('hooks.notifications.get'),
			list: op('hooks.notifications.list'),
			query: op('hooks.notifications.query'),
		},
		publishers: {
			get: op('hooks.publishers.get'),
			getEventType: op('hooks.publishers.getEventType'),
			list: op('hooks.publishers.list'),
			listEventTypes: op('hooks.publishers.listEventTypes'),
			queryInputValues: op('hooks.publishers.queryInputValues'),
			queryPublishers: op('hooks.publishers.queryPublishers'),
		},
		subscriptions: {
			create: op('hooks.subscriptions.create'),
			createSubscriptionsQuery: op(
				'hooks.subscriptions.createSubscriptionsQuery',
			),
			delete: op('hooks.subscriptions.delete'),
			get: op('hooks.subscriptions.get'),
			list: op('hooks.subscriptions.list'),
			replaceSubscription: op('hooks.subscriptions.replaceSubscription'),
		},
	},
	ims: {
		identities: {
			readIdentities: op('ims.identities.readIdentities'),
		},
	},
	memberEntitlementManagement: {
		groupEntitlements: {
			add: op('memberEntitlementManagement.groupEntitlements.add'),
			delete: op('memberEntitlementManagement.groupEntitlements.delete'),
			get: op('memberEntitlementManagement.groupEntitlements.get'),
			list: op('memberEntitlementManagement.groupEntitlements.list'),
			update: op('memberEntitlementManagement.groupEntitlements.update'),
		},
		memberEntitlements: {
			searchMemberEntitlements: op(
				'memberEntitlementManagement.memberEntitlements.searchMemberEntitlements',
			),
		},
		members: {
			add: op('memberEntitlementManagement.members.add'),
			get: op('memberEntitlementManagement.members.get'),
			removeMemberFromGroup: op(
				'memberEntitlementManagement.members.removeMemberFromGroup',
			),
		},
		servicePrincipalEntitlements: {
			add: op('memberEntitlementManagement.servicePrincipalEntitlements.add'),
			delete: op(
				'memberEntitlementManagement.servicePrincipalEntitlements.delete',
			),
			get: op('memberEntitlementManagement.servicePrincipalEntitlements.get'),
			updateServicePrincipalEntitlement: op(
				'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlement',
			),
			updateServicePrincipalEntitlements: op(
				'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlements',
			),
		},
		userEntitlementSummary: {
			get: op('memberEntitlementManagement.userEntitlementSummary.get'),
		},
		userEntitlements: {
			add: op('memberEntitlementManagement.userEntitlements.add'),
			delete: op('memberEntitlementManagement.userEntitlements.delete'),
			get: op('memberEntitlementManagement.userEntitlements.get'),
			searchUserEntitlements: op(
				'memberEntitlementManagement.userEntitlements.searchUserEntitlements',
			),
			updateUserEntitlement: op(
				'memberEntitlementManagement.userEntitlements.updateUserEntitlement',
			),
			updateUserEntitlements: op(
				'memberEntitlementManagement.userEntitlements.updateUserEntitlements',
			),
		},
	},
	notification: {
		diagnosticLogs: {
			list: op('notification.diagnosticLogs.list'),
		},
		diagnostics: {
			get: op('notification.diagnostics.get'),
			update: op('notification.diagnostics.update'),
		},
		eventTypes: {
			get: op('notification.eventTypes.get'),
			list: op('notification.eventTypes.list'),
		},
		settings: {
			get: op('notification.settings.get'),
			update: op('notification.settings.update'),
		},
		subscribers: {
			get: op('notification.subscribers.get'),
			update: op('notification.subscribers.update'),
		},
		subscriptions: {
			create: op('notification.subscriptions.create'),
			delete: op('notification.subscriptions.delete'),
			get: op('notification.subscriptions.get'),
			getSubscriptionTemplates: op(
				'notification.subscriptions.getSubscriptionTemplates',
			),
			list: op('notification.subscriptions.list'),
			query: op('notification.subscriptions.query'),
			update: op('notification.subscriptions.update'),
			updateSubscriptionUserSettings: op(
				'notification.subscriptions.updateSubscriptionUserSettings',
			),
		},
	},
	operations: {
		operations: {
			get: op('operations.operations.get'),
		},
	},
	permissionsReport: {
		permissionsReport: {
			create: op('permissionsReport.permissionsReport.create'),
			get: op('permissionsReport.permissionsReport.get'),
			list: op('permissionsReport.permissionsReport.list'),
		},
		permissionsReportDownload: {
			download: op('permissionsReport.permissionsReportDownload.download'),
		},
	},
	pipelines: {
		artifacts: {
			get: op('pipelines.artifacts.get'),
		},
		logs: {
			get: op('pipelines.logs.get'),
			list: op('pipelines.logs.list'),
		},
		pipelines: {
			create: op('pipelines.pipelines.create'),
			get: op('pipelines.pipelines.get'),
			list: op('pipelines.pipelines.list'),
		},
		preview: {
			preview: op('pipelines.preview.preview'),
		},
		runs: {
			get: op('pipelines.runs.get'),
			list: op('pipelines.runs.list'),
			runPipeline: op('pipelines.runs.runPipeline'),
		},
	},
	policy: {
		configurations: {
			create: op('policy.configurations.create'),
			delete: op('policy.configurations.delete'),
			get: op('policy.configurations.get'),
			list: op('policy.configurations.list'),
			update: op('policy.configurations.update'),
		},
		evaluations: {
			get: op('policy.evaluations.get'),
			list: op('policy.evaluations.list'),
			requeuePolicyEvaluation: op('policy.evaluations.requeuePolicyEvaluation'),
		},
		revisions: {
			get: op('policy.revisions.get'),
			list: op('policy.revisions.list'),
		},
		types: {
			get: op('policy.types.get'),
			list: op('policy.types.list'),
		},
	},
	processadmin: {
		behaviors: {
			get: op('processadmin.behaviors.get'),
			list: op('processadmin.behaviors.list'),
		},
		processes: {
			exportProcessTemplate: op('processadmin.processes.exportProcessTemplate'),
			importProcessTemplate: op('processadmin.processes.importProcessTemplate'),
			importProcessTemplateStatus: op(
				'processadmin.processes.importProcessTemplateStatus',
			),
		},
	},
	processes: {
		behaviors: {
			create: op('processes.behaviors.create'),
			delete: op('processes.behaviors.delete'),
			get: op('processes.behaviors.get'),
			list: op('processes.behaviors.list'),
			update: op('processes.behaviors.update'),
		},
		controls: {
			create: op('processes.controls.create'),
			moveControlToGroup: op('processes.controls.moveControlToGroup'),
			removeControlFromGroup: op('processes.controls.removeControlFromGroup'),
			update: op('processes.controls.update'),
		},
		fields: {
			add: op('processes.fields.add'),
			get: op('processes.fields.get'),
			list: op('processes.fields.list'),
			removeWorkItemTypeField: op('processes.fields.removeWorkItemTypeField'),
			update: op('processes.fields.update'),
		},
		groups: {
			add: op('processes.groups.add'),
			moveGroupToPage: op('processes.groups.moveGroupToPage'),
			moveGroupToSection: op('processes.groups.moveGroupToSection'),
			removeGroup: op('processes.groups.removeGroup'),
			update: op('processes.groups.update'),
		},
		layout: {
			get: op('processes.layout.get'),
		},
		lists: {
			create: op('processes.lists.create'),
			delete: op('processes.lists.delete'),
			get: op('processes.lists.get'),
			list: op('processes.lists.list'),
			update: op('processes.lists.update'),
		},
		pages: {
			add: op('processes.pages.add'),
			removePage: op('processes.pages.removePage'),
			update: op('processes.pages.update'),
		},
		processes: {
			create: op('processes.processes.create'),
			delete: op('processes.processes.delete'),
			editProcess: op('processes.processes.editProcess'),
			get: op('processes.processes.get'),
			list: op('processes.processes.list'),
		},
		rules: {
			add: op('processes.rules.add'),
			delete: op('processes.rules.delete'),
			get: op('processes.rules.get'),
			list: op('processes.rules.list'),
			update: op('processes.rules.update'),
		},
		states: {
			create: op('processes.states.create'),
			delete: op('processes.states.delete'),
			get: op('processes.states.get'),
			hideStateDefinition: op('processes.states.hideStateDefinition'),
			list: op('processes.states.list'),
			update: op('processes.states.update'),
		},
		systemControls: {
			delete: op('processes.systemControls.delete'),
			list: op('processes.systemControls.list'),
			update: op('processes.systemControls.update'),
		},
		workItemTypes: {
			create: op('processes.workItemTypes.create'),
			delete: op('processes.workItemTypes.delete'),
			get: op('processes.workItemTypes.get'),
			list: op('processes.workItemTypes.list'),
			update: op('processes.workItemTypes.update'),
		},
		workItemTypesBehaviors: {
			add: op('processes.workItemTypesBehaviors.add'),
			get: op('processes.workItemTypesBehaviors.get'),
			list: op('processes.workItemTypesBehaviors.list'),
			removeBehaviorFromWorkItemType: op(
				'processes.workItemTypesBehaviors.removeBehaviorFromWorkItemType',
			),
			update: op('processes.workItemTypesBehaviors.update'),
		},
	},
	profile: {
		profiles: {
			get: op('profile.profiles.get'),
		},
	},
	release: {
		approvals: {
			list: op('release.approvals.list'),
			update: op('release.approvals.update'),
		},
		attachments: {
			getReleaseTaskAttachmentContent: op(
				'release.attachments.getReleaseTaskAttachmentContent',
			),
			getReleaseTaskAttachments: op(
				'release.attachments.getReleaseTaskAttachments',
			),
			getTaskAttachmentContent: op(
				'release.attachments.getTaskAttachmentContent',
			),
			getTaskAttachments: op('release.attachments.getTaskAttachments'),
		},
		definitions: {
			create: op('release.definitions.create'),
			delete: op('release.definitions.delete'),
			get: op('release.definitions.get'),
			getDefinitionRevision: op('release.definitions.getDefinitionRevision'),
			getReleaseDefinitionHistory: op(
				'release.definitions.getReleaseDefinitionHistory',
			),
			list: op('release.definitions.list'),
			update: op('release.definitions.update'),
		},
		deployments: {
			list: op('release.deployments.list'),
		},
		folders: {
			create: op('release.folders.create'),
			delete: op('release.folders.delete'),
			list: op('release.folders.list'),
			update: op('release.folders.update'),
		},
		gates: {
			update: op('release.gates.update'),
		},
		manualInterventions: {
			get: op('release.manualInterventions.get'),
			list: op('release.manualInterventions.list'),
			update: op('release.manualInterventions.update'),
		},
		releases: {
			create: op('release.releases.create'),
			getLogs: op('release.releases.getLogs'),
			getRelease: op('release.releases.getRelease'),
			getReleaseEnvironment: op('release.releases.getReleaseEnvironment'),
			getReleaseRevision: op('release.releases.getReleaseRevision'),
			getTaskLog: op('release.releases.getTaskLog'),
			list: op('release.releases.list'),
			updateRelease: op('release.releases.updateRelease'),
			updateReleaseEnvironment: op('release.releases.updateReleaseEnvironment'),
			updateReleaseResource: op('release.releases.updateReleaseResource'),
		},
	},
	search: {
		codeSearchResults: {
			fetchCodeSearchResults: op(
				'search.codeSearchResults.fetchCodeSearchResults',
			),
		},
		packageSearchResults: {
			fetchPackageSearchResults: op(
				'search.packageSearchResults.fetchPackageSearchResults',
			),
		},
		repositories: {
			get: op('search.repositories.get'),
		},
		tfvc: {
			get: op('search.tfvc.get'),
		},
		wikiSearchResults: {
			fetchWikiSearchResults: op(
				'search.wikiSearchResults.fetchWikiSearchResults',
			),
		},
		workItemSearchResults: {
			fetchWorkItemSearchResults: op(
				'search.workItemSearchResults.fetchWorkItemSearchResults',
			),
		},
	},
	security: {
		accessControlEntries: {
			removeAccessControlEntries: op(
				'security.accessControlEntries.removeAccessControlEntries',
			),
			setAccessControlEntries: op(
				'security.accessControlEntries.setAccessControlEntries',
			),
		},
		accessControlLists: {
			query: op('security.accessControlLists.query'),
			removeAccessControlLists: op(
				'security.accessControlLists.removeAccessControlLists',
			),
			setAccessControlLists: op(
				'security.accessControlLists.setAccessControlLists',
			),
		},
		permissions: {
			hasPermissions: op('security.permissions.hasPermissions'),
			hasPermissionsBatch: op('security.permissions.hasPermissionsBatch'),
			removePermission: op('security.permissions.removePermission'),
		},
		securityNamespaces: {
			query: op('security.securityNamespaces.query'),
		},
	},
	securityRoles: {
		roleassignments: {
			changeInheritance: op('securityRoles.roleassignments.changeInheritance'),
			list: op('securityRoles.roleassignments.list'),
			removeRoleAssignment: op(
				'securityRoles.roleassignments.removeRoleAssignment',
			),
			removeRoleAssignments: op(
				'securityRoles.roleassignments.removeRoleAssignments',
			),
			setRoleAssignment: op('securityRoles.roleassignments.setRoleAssignment'),
			setRoleAssignments: op(
				'securityRoles.roleassignments.setRoleAssignments',
			),
		},
		roledefinitions: {
			list: op('securityRoles.roledefinitions.list'),
		},
	},
	serviceEndpoint: {
		endpointproxy: {
			executeServiceEndpointRequest: op(
				'serviceEndpoint.endpointproxy.executeServiceEndpointRequest',
			),
			query: op('serviceEndpoint.endpointproxy.query'),
		},
		endpoints: {
			create: op('serviceEndpoint.endpoints.create'),
			delete: op('serviceEndpoint.endpoints.delete'),
			get: op('serviceEndpoint.endpoints.get'),
			getServiceEndpoints: op('serviceEndpoint.endpoints.getServiceEndpoints'),
			getServiceEndpointsByNames: op(
				'serviceEndpoint.endpoints.getServiceEndpointsByNames',
			),
			getServiceEndpointsWithRefreshedAuthentication: op(
				'serviceEndpoint.endpoints.getServiceEndpointsWithRefreshedAuthentication',
			),
			shareServiceEndpoint: op(
				'serviceEndpoint.endpoints.shareServiceEndpoint',
			),
			updateServiceEndpoint: op(
				'serviceEndpoint.endpoints.updateServiceEndpoint',
			),
			updateServiceEndpoints: op(
				'serviceEndpoint.endpoints.updateServiceEndpoints',
			),
		},
		executionhistory: {
			list: op('serviceEndpoint.executionhistory.list'),
		},
		types: {
			list: op('serviceEndpoint.types.list'),
		},
	},
	status: {
		health: {
			get: op('status.health.get'),
		},
	},
	symbol: {
		availability: {
			checkAvailability: op('symbol.availability.checkAvailability'),
		},
		client: {
			get: op('symbol.client.get'),
		},
		contents: {
			get: op('symbol.contents.get'),
		},
		requests: {
			createRequests: op('symbol.requests.createRequests'),
			createRequestsRequestIdDebugEntries: op(
				'symbol.requests.createRequestsRequestIdDebugEntries',
			),
			createRequestsRequestNameDebugEntries: op(
				'symbol.requests.createRequestsRequestNameDebugEntries',
			),
			deleteRequestsRequestId: op('symbol.requests.deleteRequestsRequestId'),
			deleteRequestsRequestName: op(
				'symbol.requests.deleteRequestsRequestName',
			),
			getRequestsRequestId: op('symbol.requests.getRequestsRequestId'),
			getRequestsRequestName: op('symbol.requests.getRequestsRequestName'),
			updateRequestsRequestId: op('symbol.requests.updateRequestsRequestId'),
			updateRequestsRequestName: op(
				'symbol.requests.updateRequestsRequestName',
			),
		},
		symsrv: {
			get: op('symbol.symsrv.get'),
		},
	},
	test: {
		attachments: {
			createTestResultAttachment: op(
				'test.attachments.createTestResultAttachment',
			),
			createTestRunAttachment: op('test.attachments.createTestRunAttachment'),
			createTestSubResultAttachment: op(
				'test.attachments.createTestSubResultAttachment',
			),
			getTestResultAttachmentZip: op(
				'test.attachments.getTestResultAttachmentZip',
			),
			getTestResultAttachments: op('test.attachments.getTestResultAttachments'),
			getTestRunAttachmentZip: op('test.attachments.getTestRunAttachmentZip'),
			getTestRunAttachments: op('test.attachments.getTestRunAttachments'),
			getTestSubResultAttachmentZip: op(
				'test.attachments.getTestSubResultAttachmentZip',
			),
			getTestSubResultAttachments: op(
				'test.attachments.getTestSubResultAttachments',
			),
		},
		codeCoverage: {
			getBuildCodeCoverage: op('test.codeCoverage.getBuildCodeCoverage'),
			getTestRunCodeCoverage: op('test.codeCoverage.getTestRunCodeCoverage'),
		},
		iterations: {
			get: op('test.iterations.get'),
			list: op('test.iterations.list'),
		},
		points: {
			getPoint: op('test.points.getPoint'),
			getPointsByQuery: op('test.points.getPointsByQuery'),
			list: op('test.points.list'),
			update: op('test.points.update'),
		},
		resultRetentionSettings: {
			get: op('test.resultRetentionSettings.get'),
			update: op('test.resultRetentionSettings.update'),
		},
		results: {
			add: op('test.results.add'),
			get: op('test.results.get'),
			list: op('test.results.list'),
			update: op('test.results.update'),
		},
		runs: {
			create: op('test.runs.create'),
			delete: op('test.runs.delete'),
			getTestRunById: op('test.runs.getTestRunById'),
			getTestRunStatistics: op('test.runs.getTestRunStatistics'),
			list: op('test.runs.list'),
			query: op('test.runs.query'),
			update: op('test.runs.update'),
		},
		session: {
			create: op('test.session.create'),
			list: op('test.session.list'),
			update: op('test.session.update'),
		},
		testCases: {
			delete: op('test.testCases.delete'),
		},
		testHistory: {
			query: op('test.testHistory.query'),
		},
		testSuites: {
			add: op('test.testSuites.add'),
			get: op('test.testSuites.get'),
			list: op('test.testSuites.list'),
			removeTestCasesFromSuiteUrl: op(
				'test.testSuites.removeTestCasesFromSuiteUrl',
			),
			update: op('test.testSuites.update'),
		},
	},
	testPlan: {
		configurations: {
			create: op('testPlan.configurations.create'),
			delete: op('testPlan.configurations.delete'),
			get: op('testPlan.configurations.get'),
			list: op('testPlan.configurations.list'),
			update: op('testPlan.configurations.update'),
		},
		suiteTestCase: {
			add: op('testPlan.suiteTestCase.add'),
			getTestCase: op('testPlan.suiteTestCase.getTestCase'),
			getTestCaseList: op('testPlan.suiteTestCase.getTestCaseList'),
			removeTestCasesFromSuite: op(
				'testPlan.suiteTestCase.removeTestCasesFromSuite',
			),
			removeTestCasesListFromSuite: op(
				'testPlan.suiteTestCase.removeTestCasesListFromSuite',
			),
			update: op('testPlan.suiteTestCase.update'),
		},
		testCaseClone: {
			cloneTestCase: op('testPlan.testCaseClone.cloneTestCase'),
			get: op('testPlan.testCaseClone.get'),
		},
		testCases: {
			delete: op('testPlan.testCases.delete'),
		},
		testPlanClone: {
			cloneTestPlan: op('testPlan.testPlanClone.cloneTestPlan'),
			get: op('testPlan.testPlanClone.get'),
		},
		testPlans: {
			create: op('testPlan.testPlans.create'),
			delete: op('testPlan.testPlans.delete'),
			get: op('testPlan.testPlans.get'),
			list: op('testPlan.testPlans.list'),
			update: op('testPlan.testPlans.update'),
		},
		testPoint: {
			getPoints: op('testPlan.testPoint.getPoints'),
			getPointsList: op('testPlan.testPoint.getPointsList'),
			update: op('testPlan.testPoint.update'),
		},
		testSuiteClone: {
			cloneTestSuite: op('testPlan.testSuiteClone.cloneTestSuite'),
			get: op('testPlan.testSuiteClone.get'),
		},
		testSuiteEntry: {
			list: op('testPlan.testSuiteEntry.list'),
			reorderSuiteEntries: op('testPlan.testSuiteEntry.reorderSuiteEntries'),
		},
		testSuites: {
			create: op('testPlan.testSuites.create'),
			delete: op('testPlan.testSuites.delete'),
			get: op('testPlan.testSuites.get'),
			getSuitesByTestCaseId: op('testPlan.testSuites.getSuitesByTestCaseId'),
			getTestSuitesForPlan: op('testPlan.testSuites.getTestSuitesForPlan'),
			update: op('testPlan.testSuites.update'),
		},
		variables: {
			create: op('testPlan.variables.create'),
			delete: op('testPlan.variables.delete'),
			get: op('testPlan.variables.get'),
			list: op('testPlan.variables.list'),
			update: op('testPlan.variables.update'),
		},
	},
	testResults: {
		attachments: {
			createTestIterationResultAttachment: op(
				'testResults.attachments.createTestIterationResultAttachment',
			),
			createTestResultAttachment: op(
				'testResults.attachments.createTestResultAttachment',
			),
			createTestRunAttachment: op(
				'testResults.attachments.createTestRunAttachment',
			),
			createTestSubResultAttachment: op(
				'testResults.attachments.createTestSubResultAttachment',
			),
			deleteTestResultAttachment: op(
				'testResults.attachments.deleteTestResultAttachment',
			),
			deleteTestRunAttachment: op(
				'testResults.attachments.deleteTestRunAttachment',
			),
			getTestIterationAttachmentZip: op(
				'testResults.attachments.getTestIterationAttachmentZip',
			),
			getTestResultAttachmentZip: op(
				'testResults.attachments.getTestResultAttachmentZip',
			),
			getTestResultAttachments: op(
				'testResults.attachments.getTestResultAttachments',
			),
			getTestRunAttachmentZip: op(
				'testResults.attachments.getTestRunAttachmentZip',
			),
			getTestRunAttachments: op(
				'testResults.attachments.getTestRunAttachments',
			),
			getTestSubResultAttachmentZip: op(
				'testResults.attachments.getTestSubResultAttachmentZip',
			),
			getTestSubResultAttachments: op(
				'testResults.attachments.getTestSubResultAttachments',
			),
		},
		bugs: {
			list: op('testResults.bugs.list'),
		},
		codecoverage: {
			get: op('testResults.codecoverage.get'),
			getBuildCodeCoverage: op('testResults.codecoverage.getBuildCodeCoverage'),
			getTestRunCodeCoverage: op(
				'testResults.codecoverage.getTestRunCodeCoverage',
			),
			update: op('testResults.codecoverage.update'),
		},
		filecoverage: {
			get: op('testResults.filecoverage.get'),
		},
		history: {
			query: op('testResults.history.query'),
		},
		messageLogs: {
			list: op('testResults.messageLogs.list'),
		},
		metrics: {
			get: op('testResults.metrics.get'),
		},
		resultDocument: {
			publishTestResultDocument: op(
				'testResults.resultDocument.publishTestResultDocument',
			),
		},
		resultMetaData: {
			query: op('testResults.resultMetaData.query'),
			update: op('testResults.resultMetaData.update'),
		},
		resultTrendByBuild: {
			query: op('testResults.resultTrendByBuild.query'),
		},
		resultTrendByRelease: {
			query: op('testResults.resultTrendByRelease.query'),
		},
		resultdetailsbybuild: {
			get: op('testResults.resultdetailsbybuild.get'),
		},
		resultdetailsbyrelease: {
			get: op('testResults.resultdetailsbyrelease.get'),
		},
		resultgroupsbybuild: {
			list: op('testResults.resultgroupsbybuild.list'),
		},
		resultgroupsbyrelease: {
			list: op('testResults.resultgroupsbyrelease.list'),
		},
		results: {
			add: op('testResults.results.add'),
			getTestResultById: op('testResults.results.getTestResultById'),
			getTestResults: op('testResults.results.getTestResults'),
			getTestResultsByQuery: op('testResults.results.getTestResultsByQuery'),
			getTestResultsByQueryWiql: op(
				'testResults.results.getTestResultsByQueryWiql',
			),
			update: op('testResults.results.update'),
		},
		resultsbybuild: {
			list: op('testResults.resultsbybuild.list'),
		},
		resultsbypipeline: {
			list: op('testResults.resultsbypipeline.list'),
		},
		resultsbyrelease: {
			list: op('testResults.resultsbyrelease.list'),
		},
		resultsgroupDetails: {
			testResultsGroupDetails: op(
				'testResults.resultsgroupDetails.testResultsGroupDetails',
			),
		},
		resultsummarybybuild: {
			query: op('testResults.resultsummarybybuild.query'),
		},
		resultsummarybypipeline: {
			query: op('testResults.resultsummarybypipeline.query'),
		},
		resultsummarybyrelease: {
			queryTestResultsReportForRelease: op(
				'testResults.resultsummarybyrelease.queryTestResultsReportForRelease',
			),
			queryTestResultsSummaryForReleases: op(
				'testResults.resultsummarybyrelease.queryTestResultsSummaryForReleases',
			),
		},
		resultsummarybyrequirement: {
			query: op('testResults.resultsummarybyrequirement.query'),
		},
		runs: {
			create: op('testResults.runs.create'),
			delete: op('testResults.runs.delete'),
			get: op('testResults.runs.get'),
			list: op('testResults.runs.list'),
			query: op('testResults.runs.query'),
			update: op('testResults.runs.update'),
		},
		runsummary: {
			get: op('testResults.runsummary.get'),
		},
		settings: {
			get: op('testResults.settings.get'),
			update: op('testResults.settings.update'),
		},
		similarTestResults: {
			list: op('testResults.similarTestResults.list'),
		},
		statistics: {
			get: op('testResults.statistics.get'),
		},
		status: {
			get: op('testResults.status.get'),
		},
		tags: {
			getTestTagsForBuild: op('testResults.tags.getTestTagsForBuild'),
			getTestTagsForRelease: op('testResults.tags.getTestTagsForRelease'),
			update: op('testResults.tags.update'),
		},
		tagsummary: {
			getTestTagSummaryForBuild: op(
				'testResults.tagsummary.getTestTagSummaryForBuild',
			),
			getTestTagSummaryForRelease: op(
				'testResults.tagsummary.getTestTagSummaryForRelease',
			),
		},
		testHistory: {
			query: op('testResults.testHistory.query'),
		},
		testattachments: {
			createBuildAttachmentInLogStore: op(
				'testResults.testattachments.createBuildAttachmentInLogStore',
			),
			createTestRunLogStoreAttachment: op(
				'testResults.testattachments.createTestRunLogStoreAttachment',
			),
			delete: op('testResults.testattachments.delete'),
			get: op('testResults.testattachments.get'),
			list: op('testResults.testattachments.list'),
		},
		testfailuretype: {
			create: op('testResults.testfailuretype.create'),
			delete: op('testResults.testfailuretype.delete'),
			list: op('testResults.testfailuretype.list'),
		},
		testlog: {
			getTestLogsForBuild: op('testResults.testlog.getTestLogsForBuild'),
			getTestResultLogs: op('testResults.testlog.getTestResultLogs'),
			getTestRunLogs: op('testResults.testlog.getTestRunLogs'),
			getTestSubResultLogs: op('testResults.testlog.getTestSubResultLogs'),
		},
		testlogstoreendpoint: {
			getTestLogStoreEndpointDetailsForBuildLog: op(
				'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForBuildLog',
			),
			getTestLogStoreEndpointDetailsForResultLog: op(
				'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForResultLog',
			),
			getTestLogStoreEndpointDetailsForRunLog: op(
				'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForRunLog',
			),
			getTestLogStoreEndpointDetailsForSubResultLog: op(
				'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForSubResultLog',
			),
			testLogStoreEndpointDetailsForBuild: op(
				'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForBuild',
			),
			testLogStoreEndpointDetailsForResult: op(
				'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForResult',
			),
			testLogStoreEndpointDetailsForRun: op(
				'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForRun',
			),
		},
		testsettings: {
			create: op('testResults.testsettings.create'),
			delete: op('testResults.testsettings.delete'),
			get: op('testResults.testsettings.get'),
		},
		workitems: {
			add: op('testResults.workitems.add'),
			delete: op('testResults.workitems.delete'),
			list: op('testResults.workitems.list'),
			queryTestMethodLinkedWorkItems: op(
				'testResults.workitems.queryTestMethodLinkedWorkItems',
			),
			queryTestResultWorkItems: op(
				'testResults.workitems.queryTestResultWorkItems',
			),
		},
	},
	tfvc: {
		branches: {
			get: op('tfvc.branches.get'),
			getBranchRefs: op('tfvc.branches.getBranchRefs'),
			getBranches: op('tfvc.branches.getBranches'),
		},
		changesets: {
			create: op('tfvc.changesets.create'),
			get: op('tfvc.changesets.get'),
			getBatchedChangesets: op('tfvc.changesets.getBatchedChangesets'),
			getChangesetChanges: op('tfvc.changesets.getChangesetChanges'),
			getChangesetWorkItems: op('tfvc.changesets.getChangesetWorkItems'),
			getChangesets: op('tfvc.changesets.getChangesets'),
		},
		items: {
			get: op('tfvc.items.get'),
			getItemsBatch: op('tfvc.items.getItemsBatch'),
			list: op('tfvc.items.list'),
		},
		labels: {
			get: op('tfvc.labels.get'),
			getLabelItems: op('tfvc.labels.getLabelItems'),
			list: op('tfvc.labels.list'),
		},
		shelvesets: {
			get: op('tfvc.shelvesets.get'),
			getShelvesetChanges: op('tfvc.shelvesets.getShelvesetChanges'),
			getShelvesetWorkItems: op('tfvc.shelvesets.getShelvesetWorkItems'),
			list: op('tfvc.shelvesets.list'),
		},
	},
	tokenAdmin: {
		personalAccessTokens: {
			list: op('tokenAdmin.personalAccessTokens.list'),
		},
		revocationRules: {
			create: op('tokenAdmin.revocationRules.create'),
		},
		revocations: {
			revokeAuthorizations: op('tokenAdmin.revocations.revokeAuthorizations'),
		},
	},
	tokens: {
		pats: {
			create: op('tokens.pats.create'),
			get: op('tokens.pats.get'),
			list: op('tokens.pats.list'),
			revoke: op('tokens.pats.revoke'),
			update: op('tokens.pats.update'),
		},
	},
	wiki: {
		attachments: {
			create: op('wiki.attachments.create'),
		},
		pageMoves: {
			create: op('wiki.pageMoves.create'),
		},
		pageStats: {
			get: op('wiki.pageStats.get'),
		},
		pages: {
			createOrUpdate: op('wiki.pages.createOrUpdate'),
			deletePage: op('wiki.pages.deletePage'),
			deletePageById: op('wiki.pages.deletePageById'),
			getPage: op('wiki.pages.getPage'),
			getPageById: op('wiki.pages.getPageById'),
			update: op('wiki.pages.update'),
		},
		pagesBatch: {
			get: op('wiki.pagesBatch.get'),
		},
		wikis: {
			create: op('wiki.wikis.create'),
			delete: op('wiki.wikis.delete'),
			get: op('wiki.wikis.get'),
			list: op('wiki.wikis.list'),
			update: op('wiki.wikis.update'),
		},
	},
	wit: {
		accountMyWorkRecentActivity: {
			list: op('wit.accountMyWorkRecentActivity.list'),
		},
		artifactLinkTypes: {
			list: op('wit.artifactLinkTypes.list'),
		},
		artifactUriQuery: {
			query: op('wit.artifactUriQuery.query'),
		},
		attachments: {
			create: op('wit.attachments.create'),
			get: op('wit.attachments.get'),
			uploadChunk: op('wit.attachments.uploadChunk'),
		},
		classificationNodes: {
			createOrUpdate: op('wit.classificationNodes.createOrUpdate'),
			delete: op('wit.classificationNodes.delete'),
			get: op('wit.classificationNodes.get'),
			getClassificationNodes: op(
				'wit.classificationNodes.getClassificationNodes',
			),
			getRootNodes: op('wit.classificationNodes.getRootNodes'),
			update: op('wit.classificationNodes.update'),
		},
		commentReactionsEngagedUsers: {
			list: op('wit.commentReactionsEngagedUsers.list'),
		},
		comments: {
			addComment: op('wit.comments.addComment'),
			addWorkItemComment: op('wit.comments.addWorkItemComment'),
			delete: op('wit.comments.delete'),
			getComment: op('wit.comments.getComment'),
			getComments: op('wit.comments.getComments'),
			getCommentsBatch: op('wit.comments.getCommentsBatch'),
			updateComment: op('wit.comments.updateComment'),
			updateWorkItemComment: op('wit.comments.updateWorkItemComment'),
		},
		commentsReactions: {
			create: op('wit.commentsReactions.create'),
			delete: op('wit.commentsReactions.delete'),
			list: op('wit.commentsReactions.list'),
		},
		commentsVersions: {
			get: op('wit.commentsVersions.get'),
			list: op('wit.commentsVersions.list'),
		},
		fields: {
			create: op('wit.fields.create'),
			delete: op('wit.fields.delete'),
			get: op('wit.fields.get'),
			list: op('wit.fields.list'),
			update: op('wit.fields.update'),
		},
		projectProcessMigration: {
			migrateProjectsProcess: op(
				'wit.projectProcessMigration.migrateProjectsProcess',
			),
		},
		queries: {
			create: op('wit.queries.create'),
			delete: op('wit.queries.delete'),
			get: op('wit.queries.get'),
			getQueriesBatch: op('wit.queries.getQueriesBatch'),
			list: op('wit.queries.list'),
			searchQueries: op('wit.queries.searchQueries'),
			update: op('wit.queries.update'),
		},
		recyclebin: {
			destroyWorkItem: op('wit.recyclebin.destroyWorkItem'),
			get: op('wit.recyclebin.get'),
			getDeletedWorkItemShallowReferences: op(
				'wit.recyclebin.getDeletedWorkItemShallowReferences',
			),
			getDeletedWorkItems: op('wit.recyclebin.getDeletedWorkItems'),
			restoreWorkItem: op('wit.recyclebin.restoreWorkItem'),
		},
		reportingWorkItemLinks: {
			get: op('wit.reportingWorkItemLinks.get'),
		},
		reportingWorkItemRevisions: {
			readReportingRevisionsGet: op(
				'wit.reportingWorkItemRevisions.readReportingRevisionsGet',
			),
			readReportingRevisionsPost: op(
				'wit.reportingWorkItemRevisions.readReportingRevisionsPost',
			),
		},
		revisions: {
			get: op('wit.revisions.get'),
			list: op('wit.revisions.list'),
		},
		sendMail: {
			sendMail: op('wit.sendMail.sendMail'),
		},
		tags: {
			delete: op('wit.tags.delete'),
			get: op('wit.tags.get'),
			list: op('wit.tags.list'),
			update: op('wit.tags.update'),
		},
		tempQueries: {
			create: op('wit.tempQueries.create'),
		},
		templates: {
			create: op('wit.templates.create'),
			delete: op('wit.templates.delete'),
			get: op('wit.templates.get'),
			list: op('wit.templates.list'),
			replaceTemplate: op('wit.templates.replaceTemplate'),
		},
		updates: {
			get: op('wit.updates.get'),
			list: op('wit.updates.list'),
		},
		wiql: {
			queryById: op('wit.wiql.queryById'),
			queryByWiql: op('wit.wiql.queryByWiql'),
		},
		workItemIcons: {
			get: op('wit.workItemIcons.get'),
			list: op('wit.workItemIcons.list'),
		},
		workItemRelationTypes: {
			get: op('wit.workItemRelationTypes.get'),
			list: op('wit.workItemRelationTypes.list'),
		},
		workItemRevisionsDiscussions: {
			readReportingDiscussions: op(
				'wit.workItemRevisionsDiscussions.readReportingDiscussions',
			),
		},
		workItemTransitions: {
			list: op('wit.workItemTransitions.list'),
		},
		workItemTypeCategories: {
			get: op('wit.workItemTypeCategories.get'),
			list: op('wit.workItemTypeCategories.list'),
		},
		workItemTypeStates: {
			list: op('wit.workItemTypeStates.list'),
		},
		workItemTypes: {
			get: op('wit.workItemTypes.get'),
			list: op('wit.workItemTypes.list'),
		},
		workItemTypesField: {
			get: op('wit.workItemTypesField.get'),
			list: op('wit.workItemTypesField.list'),
		},
		workItems: {
			create: op('wit.workItems.create'),
			delete: op('wit.workItems.delete'),
			deleteWorkItems: op('wit.workItems.deleteWorkItems'),
			getWorkItem: op('wit.workItems.getWorkItem'),
			getWorkItemTemplate: op('wit.workItems.getWorkItemTemplate'),
			getWorkItemsBatch: op('wit.workItems.getWorkItemsBatch'),
			list: op('wit.workItems.list'),
			update: op('wit.workItems.update'),
		},
	},
	work: {
		backlogconfiguration: {
			get: op('work.backlogconfiguration.get'),
		},
		backlogs: {
			getBacklog: op('work.backlogs.getBacklog'),
			getBacklogLevelWorkItems: op('work.backlogs.getBacklogLevelWorkItems'),
			list: op('work.backlogs.list'),
		},
		boardcolumns: {
			list: op('work.boardcolumns.list'),
		},
		boardparents: {
			list: op('work.boardparents.list'),
		},
		boardrows: {
			list: op('work.boardrows.list'),
		},
		boards: {
			get: op('work.boards.get'),
			list: op('work.boards.list'),
			setBoardOptions: op('work.boards.setBoardOptions'),
		},
		boardusersettings: {
			get: op('work.boardusersettings.get'),
			update: op('work.boardusersettings.update'),
		},
		capacities: {
			getCapacitiesWithIdentityRefAndTotals: op(
				'work.capacities.getCapacitiesWithIdentityRefAndTotals',
			),
			getCapacityWithIdentityRef: op(
				'work.capacities.getCapacityWithIdentityRef',
			),
			replaceCapacitiesWithIdentityRef: op(
				'work.capacities.replaceCapacitiesWithIdentityRef',
			),
			update: op('work.capacities.update'),
		},
		cardrulesettings: {
			get: op('work.cardrulesettings.get'),
			updateBoardCardRuleSettings: op(
				'work.cardrulesettings.updateBoardCardRuleSettings',
			),
			updateTaskboardCardRuleSettings: op(
				'work.cardrulesettings.updateTaskboardCardRuleSettings',
			),
		},
		cardsettings: {
			get: op('work.cardsettings.get'),
			updateBoardCardSettings: op('work.cardsettings.updateBoardCardSettings'),
			updateTaskboardCardSettings: op(
				'work.cardsettings.updateTaskboardCardSettings',
			),
		},
		chartimages: {
			getBoardChartImage: op('work.chartimages.getBoardChartImage'),
			getIterationChartImage: op('work.chartimages.getIterationChartImage'),
			getIterationsChartImage: op('work.chartimages.getIterationsChartImage'),
		},
		charts: {
			get: op('work.charts.get'),
			list: op('work.charts.list'),
			update: op('work.charts.update'),
		},
		columns: {
			list: op('work.columns.list'),
			update: op('work.columns.update'),
		},
		deliverytimeline: {
			get: op('work.deliverytimeline.get'),
		},
		iterationcapacities: {
			get: op('work.iterationcapacities.get'),
		},
		iterations: {
			delete: op('work.iterations.delete'),
			get: op('work.iterations.get'),
			getIterationWorkItems: op('work.iterations.getIterationWorkItems'),
			list: op('work.iterations.list'),
			postTeamIteration: op('work.iterations.postTeamIteration'),
		},
		plans: {
			create: op('work.plans.create'),
			delete: op('work.plans.delete'),
			get: op('work.plans.get'),
			list: op('work.plans.list'),
			update: op('work.plans.update'),
		},
		processconfiguration: {
			get: op('work.processconfiguration.get'),
		},
		rows: {
			list: op('work.rows.list'),
			update: op('work.rows.update'),
		},
		taskboardColumns: {
			get: op('work.taskboardColumns.get'),
			update: op('work.taskboardColumns.update'),
		},
		taskboardWorkItems: {
			list: op('work.taskboardWorkItems.list'),
			update: op('work.taskboardWorkItems.update'),
		},
		teamdaysoff: {
			get: op('work.teamdaysoff.get'),
			update: op('work.teamdaysoff.update'),
		},
		teamfieldvalues: {
			get: op('work.teamfieldvalues.get'),
			update: op('work.teamfieldvalues.update'),
		},
		teamsettings: {
			get: op('work.teamsettings.get'),
			update: op('work.teamsettings.update'),
		},
		workitemsorder: {
			reorderBacklogWorkItems: op(
				'work.workitemsorder.reorderBacklogWorkItems',
			),
			reorderIterationWorkItems: op(
				'work.workitemsorder.reorderIterationWorkItems',
			),
		},
	},
} as const;

export const azuredevopsEndpointSchemas = {
	'account.accounts.list': azuredevopsSchemaEntry('account.accounts.list'),
	'approvalsAndChecks.approvals.get': azuredevopsSchemaEntry(
		'approvalsAndChecks.approvals.get',
	),
	'approvalsAndChecks.approvals.query': azuredevopsSchemaEntry(
		'approvalsAndChecks.approvals.query',
	),
	'approvalsAndChecks.approvals.update': azuredevopsSchemaEntry(
		'approvalsAndChecks.approvals.update',
	),
	'approvalsAndChecks.checkConfigurations.add': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkConfigurations.add',
	),
	'approvalsAndChecks.checkConfigurations.delete': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkConfigurations.delete',
	),
	'approvalsAndChecks.checkConfigurations.get': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkConfigurations.get',
	),
	'approvalsAndChecks.checkConfigurations.list': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkConfigurations.list',
	),
	'approvalsAndChecks.checkConfigurations.query': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkConfigurations.query',
	),
	'approvalsAndChecks.checkConfigurations.update': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkConfigurations.update',
	),
	'approvalsAndChecks.checkEvaluations.evaluate': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkEvaluations.evaluate',
	),
	'approvalsAndChecks.checkEvaluations.get': azuredevopsSchemaEntry(
		'approvalsAndChecks.checkEvaluations.get',
	),
	'approvalsAndChecks.pipelinePermissions.get': azuredevopsSchemaEntry(
		'approvalsAndChecks.pipelinePermissions.get',
	),
	'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResource':
		azuredevopsSchemaEntry(
			'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResource',
		),
	'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResources':
		azuredevopsSchemaEntry(
			'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResources',
		),
	'artifacts.artifactDetails.getBadge': azuredevopsSchemaEntry(
		'artifacts.artifactDetails.getBadge',
	),
	'artifacts.artifactDetails.getPackage': azuredevopsSchemaEntry(
		'artifacts.artifactDetails.getPackage',
	),
	'artifacts.artifactDetails.getPackageVersion': azuredevopsSchemaEntry(
		'artifacts.artifactDetails.getPackageVersion',
	),
	'artifacts.artifactDetails.getPackageVersionProvenance':
		azuredevopsSchemaEntry(
			'artifacts.artifactDetails.getPackageVersionProvenance',
		),
	'artifacts.artifactDetails.getPackageVersions': azuredevopsSchemaEntry(
		'artifacts.artifactDetails.getPackageVersions',
	),
	'artifacts.artifactDetails.getPackages': azuredevopsSchemaEntry(
		'artifacts.artifactDetails.getPackages',
	),
	'artifacts.artifactDetails.queryPackageMetrics': azuredevopsSchemaEntry(
		'artifacts.artifactDetails.queryPackageMetrics',
	),
	'artifacts.artifactDetails.queryPackageVersionMetrics':
		azuredevopsSchemaEntry(
			'artifacts.artifactDetails.queryPackageVersionMetrics',
		),
	'artifacts.changeTracking.getFeedChange': azuredevopsSchemaEntry(
		'artifacts.changeTracking.getFeedChange',
	),
	'artifacts.changeTracking.getFeedChanges': azuredevopsSchemaEntry(
		'artifacts.changeTracking.getFeedChanges',
	),
	'artifacts.changeTracking.getPackageChanges': azuredevopsSchemaEntry(
		'artifacts.changeTracking.getPackageChanges',
	),
	'artifacts.feedManagement.createFeed': azuredevopsSchemaEntry(
		'artifacts.feedManagement.createFeed',
	),
	'artifacts.feedManagement.createFeedView': azuredevopsSchemaEntry(
		'artifacts.feedManagement.createFeedView',
	),
	'artifacts.feedManagement.deleteFeed': azuredevopsSchemaEntry(
		'artifacts.feedManagement.deleteFeed',
	),
	'artifacts.feedManagement.deleteFeedView': azuredevopsSchemaEntry(
		'artifacts.feedManagement.deleteFeedView',
	),
	'artifacts.feedManagement.getFeed': azuredevopsSchemaEntry(
		'artifacts.feedManagement.getFeed',
	),
	'artifacts.feedManagement.getFeedPermissions': azuredevopsSchemaEntry(
		'artifacts.feedManagement.getFeedPermissions',
	),
	'artifacts.feedManagement.getFeedView': azuredevopsSchemaEntry(
		'artifacts.feedManagement.getFeedView',
	),
	'artifacts.feedManagement.getFeedViews': azuredevopsSchemaEntry(
		'artifacts.feedManagement.getFeedViews',
	),
	'artifacts.feedManagement.getFeeds': azuredevopsSchemaEntry(
		'artifacts.feedManagement.getFeeds',
	),
	'artifacts.feedManagement.setFeedPermissions': azuredevopsSchemaEntry(
		'artifacts.feedManagement.setFeedPermissions',
	),
	'artifacts.feedManagement.updateFeed': azuredevopsSchemaEntry(
		'artifacts.feedManagement.updateFeed',
	),
	'artifacts.feedManagement.updateFeedView': azuredevopsSchemaEntry(
		'artifacts.feedManagement.updateFeedView',
	),
	'artifacts.feedRecycleBin.list': azuredevopsSchemaEntry(
		'artifacts.feedRecycleBin.list',
	),
	'artifacts.feedRecycleBin.permanentDeleteFeed': azuredevopsSchemaEntry(
		'artifacts.feedRecycleBin.permanentDeleteFeed',
	),
	'artifacts.feedRecycleBin.restoreDeletedFeed': azuredevopsSchemaEntry(
		'artifacts.feedRecycleBin.restoreDeletedFeed',
	),
	'artifacts.provenance.createSession': azuredevopsSchemaEntry(
		'artifacts.provenance.createSession',
	),
	'artifacts.recycleBin.emptyRecycleBin': azuredevopsSchemaEntry(
		'artifacts.recycleBin.emptyRecycleBin',
	),
	'artifacts.recycleBin.getRecycleBinPackage': azuredevopsSchemaEntry(
		'artifacts.recycleBin.getRecycleBinPackage',
	),
	'artifacts.recycleBin.getRecycleBinPackageVersion': azuredevopsSchemaEntry(
		'artifacts.recycleBin.getRecycleBinPackageVersion',
	),
	'artifacts.recycleBin.getRecycleBinPackageVersions': azuredevopsSchemaEntry(
		'artifacts.recycleBin.getRecycleBinPackageVersions',
	),
	'artifacts.recycleBin.getRecycleBinPackages': azuredevopsSchemaEntry(
		'artifacts.recycleBin.getRecycleBinPackages',
	),
	'artifacts.retentionPolicies.deleteRetentionPolicy': azuredevopsSchemaEntry(
		'artifacts.retentionPolicies.deleteRetentionPolicy',
	),
	'artifacts.retentionPolicies.getRetentionPolicy': azuredevopsSchemaEntry(
		'artifacts.retentionPolicies.getRetentionPolicy',
	),
	'artifacts.retentionPolicies.setRetentionPolicy': azuredevopsSchemaEntry(
		'artifacts.retentionPolicies.setRetentionPolicy',
	),
	'artifacts.serviceSettings.getGlobalPermissions': azuredevopsSchemaEntry(
		'artifacts.serviceSettings.getGlobalPermissions',
	),
	'artifacts.serviceSettings.setGlobalPermissions': azuredevopsSchemaEntry(
		'artifacts.serviceSettings.setGlobalPermissions',
	),
	'artifactsPackageTypes.maven.deletePackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.deletePackageVersion',
	),
	'artifactsPackageTypes.maven.deletePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.maven.deletePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.maven.downloadPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.downloadPackage',
	),
	'artifactsPackageTypes.maven.getPackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.getPackageVersion',
	),
	'artifactsPackageTypes.maven.getPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.maven.getPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.maven.getUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.getUpstreamingBehavior',
	),
	'artifactsPackageTypes.maven.restorePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.maven.restorePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.maven.setUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.setUpstreamingBehavior',
	),
	'artifactsPackageTypes.maven.updatePackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.updatePackageVersion',
	),
	'artifactsPackageTypes.maven.updatePackageVersions': azuredevopsSchemaEntry(
		'artifactsPackageTypes.maven.updatePackageVersions',
	),
	'artifactsPackageTypes.maven.updateRecycleBinPackages':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.maven.updateRecycleBinPackages',
		),
	'artifactsPackageTypes.npm.deletePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.deletePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.npm.deleteScopedPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.deleteScopedPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.npm.downloadPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.downloadPackage',
	),
	'artifactsPackageTypes.npm.downloadScopedPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.downloadScopedPackage',
	),
	'artifactsPackageTypes.npm.getPackageReadme': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.getPackageReadme',
	),
	'artifactsPackageTypes.npm.getPackageUpstreamingBehavior':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.getPackageUpstreamingBehavior',
		),
	'artifactsPackageTypes.npm.getPackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.getPackageVersion',
	),
	'artifactsPackageTypes.npm.getPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.getPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.npm.getScopedPackageReadme': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.getScopedPackageReadme',
	),
	'artifactsPackageTypes.npm.getScopedPackageUpstreamingBehavior':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.getScopedPackageUpstreamingBehavior',
		),
	'artifactsPackageTypes.npm.getScopedPackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.getScopedPackageVersion',
	),
	'artifactsPackageTypes.npm.getScopedPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.getScopedPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.npm.restorePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.restorePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.npm.restoreScopedPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.restoreScopedPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.npm.setScopedUpstreamingBehavior':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.npm.setScopedUpstreamingBehavior',
		),
	'artifactsPackageTypes.npm.setUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.setUpstreamingBehavior',
	),
	'artifactsPackageTypes.npm.unpublishPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.unpublishPackage',
	),
	'artifactsPackageTypes.npm.unpublishScopedPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.unpublishScopedPackage',
	),
	'artifactsPackageTypes.npm.updatePackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.updatePackage',
	),
	'artifactsPackageTypes.npm.updatePackages': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.updatePackages',
	),
	'artifactsPackageTypes.npm.updateRecycleBinPackages': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.updateRecycleBinPackages',
	),
	'artifactsPackageTypes.npm.updateScopedPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.npm.updateScopedPackage',
	),
	'artifactsPackageTypes.nuGet.deletePackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.deletePackageVersion',
	),
	'artifactsPackageTypes.nuGet.deletePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.nuGet.deletePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.nuGet.downloadPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.downloadPackage',
	),
	'artifactsPackageTypes.nuGet.getPackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.getPackageVersion',
	),
	'artifactsPackageTypes.nuGet.getPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.nuGet.getPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.nuGet.getUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.getUpstreamingBehavior',
	),
	'artifactsPackageTypes.nuGet.restorePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.nuGet.restorePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.nuGet.setUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.setUpstreamingBehavior',
	),
	'artifactsPackageTypes.nuGet.updatePackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.updatePackageVersion',
	),
	'artifactsPackageTypes.nuGet.updatePackageVersions': azuredevopsSchemaEntry(
		'artifactsPackageTypes.nuGet.updatePackageVersions',
	),
	'artifactsPackageTypes.nuGet.updateRecycleBinPackageVersions':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.nuGet.updateRecycleBinPackageVersions',
		),
	'artifactsPackageTypes.python.deletePackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.deletePackageVersion',
	),
	'artifactsPackageTypes.python.deletePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.python.deletePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.python.downloadPackage': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.downloadPackage',
	),
	'artifactsPackageTypes.python.getPackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.getPackageVersion',
	),
	'artifactsPackageTypes.python.getPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.python.getPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.python.getUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.getUpstreamingBehavior',
	),
	'artifactsPackageTypes.python.restorePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.python.restorePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.python.setUpstreamingBehavior': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.setUpstreamingBehavior',
	),
	'artifactsPackageTypes.python.updatePackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.updatePackageVersion',
	),
	'artifactsPackageTypes.python.updatePackageVersions': azuredevopsSchemaEntry(
		'artifactsPackageTypes.python.updatePackageVersions',
	),
	'artifactsPackageTypes.python.updateRecycleBinPackageVersions':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.python.updateRecycleBinPackageVersions',
		),
	'artifactsPackageTypes.universal.deletePackageVersion':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.deletePackageVersion',
		),
	'artifactsPackageTypes.universal.deletePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.deletePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.universal.getPackageVersion': azuredevopsSchemaEntry(
		'artifactsPackageTypes.universal.getPackageVersion',
	),
	'artifactsPackageTypes.universal.getPackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.getPackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.universal.restorePackageVersionFromRecycleBin':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.restorePackageVersionFromRecycleBin',
		),
	'artifactsPackageTypes.universal.updatePackageVersion':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.updatePackageVersion',
		),
	'artifactsPackageTypes.universal.updatePackageVersions':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.updatePackageVersions',
		),
	'artifactsPackageTypes.universal.updateRecycleBinPackageVersions':
		azuredevopsSchemaEntry(
			'artifactsPackageTypes.universal.updateRecycleBinPackageVersions',
		),
	'audit.actions.list': azuredevopsSchemaEntry('audit.actions.list'),
	'audit.auditLog.query': azuredevopsSchemaEntry('audit.auditLog.query'),
	'audit.downloadLog.downloadLog': azuredevopsSchemaEntry(
		'audit.downloadLog.downloadLog',
	),
	'audit.streams.create': azuredevopsSchemaEntry('audit.streams.create'),
	'audit.streams.delete': azuredevopsSchemaEntry('audit.streams.delete'),
	'audit.streams.queryAllStreams': azuredevopsSchemaEntry(
		'audit.streams.queryAllStreams',
	),
	'audit.streams.queryStreamById': azuredevopsSchemaEntry(
		'audit.streams.queryStreamById',
	),
	'audit.streams.updateStatus': azuredevopsSchemaEntry(
		'audit.streams.updateStatus',
	),
	'audit.streams.updateStream': azuredevopsSchemaEntry(
		'audit.streams.updateStream',
	),
	'build.artifacts.create': azuredevopsSchemaEntry('build.artifacts.create'),
	'build.artifacts.getArtifact': azuredevopsSchemaEntry(
		'build.artifacts.getArtifact',
	),
	'build.artifacts.getFile': azuredevopsSchemaEntry('build.artifacts.getFile'),
	'build.artifacts.list': azuredevopsSchemaEntry('build.artifacts.list'),
	'build.attachments.get': azuredevopsSchemaEntry('build.attachments.get'),
	'build.attachments.list': azuredevopsSchemaEntry('build.attachments.list'),
	'build.authorizedresources.authorizeProjectResources': azuredevopsSchemaEntry(
		'build.authorizedresources.authorizeProjectResources',
	),
	'build.authorizedresources.list': azuredevopsSchemaEntry(
		'build.authorizedresources.list',
	),
	'build.badge.get': azuredevopsSchemaEntry('build.badge.get'),
	'build.badge.getBuildBadgeData': azuredevopsSchemaEntry(
		'build.badge.getBuildBadgeData',
	),
	'build.builds.delete': azuredevopsSchemaEntry('build.builds.delete'),
	'build.builds.get': azuredevopsSchemaEntry('build.builds.get'),
	'build.builds.getBuildChanges': azuredevopsSchemaEntry(
		'build.builds.getBuildChanges',
	),
	'build.builds.getBuildLog': azuredevopsSchemaEntry(
		'build.builds.getBuildLog',
	),
	'build.builds.getBuildLogs': azuredevopsSchemaEntry(
		'build.builds.getBuildLogs',
	),
	'build.builds.getBuildWorkItemsRefs': azuredevopsSchemaEntry(
		'build.builds.getBuildWorkItemsRefs',
	),
	'build.builds.getBuildWorkItemsRefsFromCommits': azuredevopsSchemaEntry(
		'build.builds.getBuildWorkItemsRefsFromCommits',
	),
	'build.builds.getChangesBetweenBuilds': azuredevopsSchemaEntry(
		'build.builds.getChangesBetweenBuilds',
	),
	'build.builds.getRetentionLeasesForBuild': azuredevopsSchemaEntry(
		'build.builds.getRetentionLeasesForBuild',
	),
	'build.builds.getWorkItemsBetweenBuilds': azuredevopsSchemaEntry(
		'build.builds.getWorkItemsBetweenBuilds',
	),
	'build.builds.list': azuredevopsSchemaEntry('build.builds.list'),
	'build.builds.queue': azuredevopsSchemaEntry('build.builds.queue'),
	'build.builds.updateBuild': azuredevopsSchemaEntry(
		'build.builds.updateBuild',
	),
	'build.builds.updateBuilds': azuredevopsSchemaEntry(
		'build.builds.updateBuilds',
	),
	'build.controllers.get': azuredevopsSchemaEntry('build.controllers.get'),
	'build.controllers.list': azuredevopsSchemaEntry('build.controllers.list'),
	'build.definitions.create': azuredevopsSchemaEntry(
		'build.definitions.create',
	),
	'build.definitions.delete': azuredevopsSchemaEntry(
		'build.definitions.delete',
	),
	'build.definitions.get': azuredevopsSchemaEntry('build.definitions.get'),
	'build.definitions.getDefinitionRevisions': azuredevopsSchemaEntry(
		'build.definitions.getDefinitionRevisions',
	),
	'build.definitions.list': azuredevopsSchemaEntry('build.definitions.list'),
	'build.definitions.restoreDefinition': azuredevopsSchemaEntry(
		'build.definitions.restoreDefinition',
	),
	'build.definitions.update': azuredevopsSchemaEntry(
		'build.definitions.update',
	),
	'build.folders.create': azuredevopsSchemaEntry('build.folders.create'),
	'build.folders.delete': azuredevopsSchemaEntry('build.folders.delete'),
	'build.folders.list': azuredevopsSchemaEntry('build.folders.list'),
	'build.folders.update': azuredevopsSchemaEntry('build.folders.update'),
	'build.generalSettings.get': azuredevopsSchemaEntry(
		'build.generalSettings.get',
	),
	'build.generalSettings.update': azuredevopsSchemaEntry(
		'build.generalSettings.update',
	),
	'build.history.get': azuredevopsSchemaEntry('build.history.get'),
	'build.latest.get': azuredevopsSchemaEntry('build.latest.get'),
	'build.leases.add': azuredevopsSchemaEntry('build.leases.add'),
	'build.leases.delete': azuredevopsSchemaEntry('build.leases.delete'),
	'build.leases.get': azuredevopsSchemaEntry('build.leases.get'),
	'build.leases.getRetentionLeasesByMinimalRetentionLeases':
		azuredevopsSchemaEntry(
			'build.leases.getRetentionLeasesByMinimalRetentionLeases',
		),
	'build.leases.getRetentionLeasesByOwnerId': azuredevopsSchemaEntry(
		'build.leases.getRetentionLeasesByOwnerId',
	),
	'build.leases.getRetentionLeasesByUserId': azuredevopsSchemaEntry(
		'build.leases.getRetentionLeasesByUserId',
	),
	'build.leases.update': azuredevopsSchemaEntry('build.leases.update'),
	'build.metrics.getDefinitionMetrics': azuredevopsSchemaEntry(
		'build.metrics.getDefinitionMetrics',
	),
	'build.metrics.getProjectMetrics': azuredevopsSchemaEntry(
		'build.metrics.getProjectMetrics',
	),
	'build.options.list': azuredevopsSchemaEntry('build.options.list'),
	'build.properties.getBuildProperties': azuredevopsSchemaEntry(
		'build.properties.getBuildProperties',
	),
	'build.properties.getDefinitionProperties': azuredevopsSchemaEntry(
		'build.properties.getDefinitionProperties',
	),
	'build.properties.updateBuildProperties': azuredevopsSchemaEntry(
		'build.properties.updateBuildProperties',
	),
	'build.properties.updateDefinitionProperties': azuredevopsSchemaEntry(
		'build.properties.updateDefinitionProperties',
	),
	'build.report.get': azuredevopsSchemaEntry('build.report.get'),
	'build.resourceUsage.get': azuredevopsSchemaEntry('build.resourceUsage.get'),
	'build.resources.authorizeDefinitionResources': azuredevopsSchemaEntry(
		'build.resources.authorizeDefinitionResources',
	),
	'build.resources.list': azuredevopsSchemaEntry('build.resources.list'),
	'build.retention.get': azuredevopsSchemaEntry('build.retention.get'),
	'build.retention.update': azuredevopsSchemaEntry('build.retention.update'),
	'build.settings.get': azuredevopsSchemaEntry('build.settings.get'),
	'build.settings.update': azuredevopsSchemaEntry('build.settings.update'),
	'build.sourceProviders.getFileContents': azuredevopsSchemaEntry(
		'build.sourceProviders.getFileContents',
	),
	'build.sourceProviders.getPathContents': azuredevopsSchemaEntry(
		'build.sourceProviders.getPathContents',
	),
	'build.sourceProviders.getPullRequest': azuredevopsSchemaEntry(
		'build.sourceProviders.getPullRequest',
	),
	'build.sourceProviders.list': azuredevopsSchemaEntry(
		'build.sourceProviders.list',
	),
	'build.sourceProviders.listBranches': azuredevopsSchemaEntry(
		'build.sourceProviders.listBranches',
	),
	'build.sourceProviders.listRepositories': azuredevopsSchemaEntry(
		'build.sourceProviders.listRepositories',
	),
	'build.sourceProviders.listWebhooks': azuredevopsSchemaEntry(
		'build.sourceProviders.listWebhooks',
	),
	'build.sourceProviders.restoreWebhooks': azuredevopsSchemaEntry(
		'build.sourceProviders.restoreWebhooks',
	),
	'build.stages.update': azuredevopsSchemaEntry('build.stages.update'),
	'build.status.get': azuredevopsSchemaEntry('build.status.get'),
	'build.tags.addBuildTag': azuredevopsSchemaEntry('build.tags.addBuildTag'),
	'build.tags.addBuildTags': azuredevopsSchemaEntry('build.tags.addBuildTags'),
	'build.tags.addDefinitionTag': azuredevopsSchemaEntry(
		'build.tags.addDefinitionTag',
	),
	'build.tags.addDefinitionTags': azuredevopsSchemaEntry(
		'build.tags.addDefinitionTags',
	),
	'build.tags.deleteBuildTag': azuredevopsSchemaEntry(
		'build.tags.deleteBuildTag',
	),
	'build.tags.deleteDefinitionTag': azuredevopsSchemaEntry(
		'build.tags.deleteDefinitionTag',
	),
	'build.tags.deleteTag': azuredevopsSchemaEntry('build.tags.deleteTag'),
	'build.tags.getBuildTags': azuredevopsSchemaEntry('build.tags.getBuildTags'),
	'build.tags.getDefinitionTags': azuredevopsSchemaEntry(
		'build.tags.getDefinitionTags',
	),
	'build.tags.getTags': azuredevopsSchemaEntry('build.tags.getTags'),
	'build.tags.updateBuildTags': azuredevopsSchemaEntry(
		'build.tags.updateBuildTags',
	),
	'build.tags.updateDefinitionTags': azuredevopsSchemaEntry(
		'build.tags.updateDefinitionTags',
	),
	'build.templates.delete': azuredevopsSchemaEntry('build.templates.delete'),
	'build.templates.get': azuredevopsSchemaEntry('build.templates.get'),
	'build.templates.list': azuredevopsSchemaEntry('build.templates.list'),
	'build.templates.saveTemplate': azuredevopsSchemaEntry(
		'build.templates.saveTemplate',
	),
	'build.timeline.get': azuredevopsSchemaEntry('build.timeline.get'),
	'build.yaml.get': azuredevopsSchemaEntry('build.yaml.get'),
	'core.avatar.removeProjectAvatar': azuredevopsSchemaEntry(
		'core.avatar.removeProjectAvatar',
	),
	'core.avatar.setProjectAvatar': azuredevopsSchemaEntry(
		'core.avatar.setProjectAvatar',
	),
	'core.categorizedTeams.get': azuredevopsSchemaEntry(
		'core.categorizedTeams.get',
	),
	'core.processes.get': azuredevopsSchemaEntry('core.processes.get'),
	'core.processes.list': azuredevopsSchemaEntry('core.processes.list'),
	'core.projects.create': azuredevopsSchemaEntry('core.projects.create'),
	'core.projects.delete': azuredevopsSchemaEntry('core.projects.delete'),
	'core.projects.get': azuredevopsSchemaEntry('core.projects.get'),
	'core.projects.getProjectProperties': azuredevopsSchemaEntry(
		'core.projects.getProjectProperties',
	),
	'core.projects.list': azuredevopsSchemaEntry('core.projects.list'),
	'core.projects.setProjectProperties': azuredevopsSchemaEntry(
		'core.projects.setProjectProperties',
	),
	'core.projects.update': azuredevopsSchemaEntry('core.projects.update'),
	'core.teams.create': azuredevopsSchemaEntry('core.teams.create'),
	'core.teams.delete': azuredevopsSchemaEntry('core.teams.delete'),
	'core.teams.get': azuredevopsSchemaEntry('core.teams.get'),
	'core.teams.getAllTeams': azuredevopsSchemaEntry('core.teams.getAllTeams'),
	'core.teams.getTeamMembersWithExtendedProperties': azuredevopsSchemaEntry(
		'core.teams.getTeamMembersWithExtendedProperties',
	),
	'core.teams.getTeams': azuredevopsSchemaEntry('core.teams.getTeams'),
	'core.teams.update': azuredevopsSchemaEntry('core.teams.update'),
	'dashboard.dashboards.create': azuredevopsSchemaEntry(
		'dashboard.dashboards.create',
	),
	'dashboard.dashboards.delete': azuredevopsSchemaEntry(
		'dashboard.dashboards.delete',
	),
	'dashboard.dashboards.get': azuredevopsSchemaEntry(
		'dashboard.dashboards.get',
	),
	'dashboard.dashboards.list': azuredevopsSchemaEntry(
		'dashboard.dashboards.list',
	),
	'dashboard.dashboards.replaceDashboard': azuredevopsSchemaEntry(
		'dashboard.dashboards.replaceDashboard',
	),
	'dashboard.dashboards.replaceDashboards': azuredevopsSchemaEntry(
		'dashboard.dashboards.replaceDashboards',
	),
	'dashboard.widgetTypes.getWidgetMetadata': azuredevopsSchemaEntry(
		'dashboard.widgetTypes.getWidgetMetadata',
	),
	'dashboard.widgetTypes.getWidgetTypes': azuredevopsSchemaEntry(
		'dashboard.widgetTypes.getWidgetTypes',
	),
	'dashboard.widgets.create': azuredevopsSchemaEntry(
		'dashboard.widgets.create',
	),
	'dashboard.widgets.delete': azuredevopsSchemaEntry(
		'dashboard.widgets.delete',
	),
	'dashboard.widgets.getWidget': azuredevopsSchemaEntry(
		'dashboard.widgets.getWidget',
	),
	'dashboard.widgets.getWidgets': azuredevopsSchemaEntry(
		'dashboard.widgets.getWidgets',
	),
	'dashboard.widgets.replaceWidget': azuredevopsSchemaEntry(
		'dashboard.widgets.replaceWidget',
	),
	'dashboard.widgets.replaceWidgets': azuredevopsSchemaEntry(
		'dashboard.widgets.replaceWidgets',
	),
	'dashboard.widgets.updateWidget': azuredevopsSchemaEntry(
		'dashboard.widgets.updateWidget',
	),
	'dashboard.widgets.updateWidgets': azuredevopsSchemaEntry(
		'dashboard.widgets.updateWidgets',
	),
	'distributedTask.agentclouds.add': azuredevopsSchemaEntry(
		'distributedTask.agentclouds.add',
	),
	'distributedTask.agentclouds.delete': azuredevopsSchemaEntry(
		'distributedTask.agentclouds.delete',
	),
	'distributedTask.agentclouds.get': azuredevopsSchemaEntry(
		'distributedTask.agentclouds.get',
	),
	'distributedTask.agentclouds.list': azuredevopsSchemaEntry(
		'distributedTask.agentclouds.list',
	),
	'distributedTask.agentclouds.update': azuredevopsSchemaEntry(
		'distributedTask.agentclouds.update',
	),
	'distributedTask.agentcloudtypes.list': azuredevopsSchemaEntry(
		'distributedTask.agentcloudtypes.list',
	),
	'distributedTask.agents.add': azuredevopsSchemaEntry(
		'distributedTask.agents.add',
	),
	'distributedTask.agents.delete': azuredevopsSchemaEntry(
		'distributedTask.agents.delete',
	),
	'distributedTask.agents.getAgent': azuredevopsSchemaEntry(
		'distributedTask.agents.getAgent',
	),
	'distributedTask.agents.getPoolPermission': azuredevopsSchemaEntry(
		'distributedTask.agents.getPoolPermission',
	),
	'distributedTask.agents.list': azuredevopsSchemaEntry(
		'distributedTask.agents.list',
	),
	'distributedTask.agents.replaceAgent': azuredevopsSchemaEntry(
		'distributedTask.agents.replaceAgent',
	),
	'distributedTask.agents.update': azuredevopsSchemaEntry(
		'distributedTask.agents.update',
	),
	'distributedTask.deploymentgroups.add': azuredevopsSchemaEntry(
		'distributedTask.deploymentgroups.add',
	),
	'distributedTask.deploymentgroups.delete': azuredevopsSchemaEntry(
		'distributedTask.deploymentgroups.delete',
	),
	'distributedTask.deploymentgroups.get': azuredevopsSchemaEntry(
		'distributedTask.deploymentgroups.get',
	),
	'distributedTask.deploymentgroups.list': azuredevopsSchemaEntry(
		'distributedTask.deploymentgroups.list',
	),
	'distributedTask.deploymentgroups.update': azuredevopsSchemaEntry(
		'distributedTask.deploymentgroups.update',
	),
	'distributedTask.elasticpoollogs.list': azuredevopsSchemaEntry(
		'distributedTask.elasticpoollogs.list',
	),
	'distributedTask.elasticpools.create': azuredevopsSchemaEntry(
		'distributedTask.elasticpools.create',
	),
	'distributedTask.elasticpools.get': azuredevopsSchemaEntry(
		'distributedTask.elasticpools.get',
	),
	'distributedTask.elasticpools.list': azuredevopsSchemaEntry(
		'distributedTask.elasticpools.list',
	),
	'distributedTask.elasticpools.update': azuredevopsSchemaEntry(
		'distributedTask.elasticpools.update',
	),
	'distributedTask.environmentdeploymentRecords.list': azuredevopsSchemaEntry(
		'distributedTask.environmentdeploymentRecords.list',
	),
	'distributedTask.environments.add': azuredevopsSchemaEntry(
		'distributedTask.environments.add',
	),
	'distributedTask.environments.delete': azuredevopsSchemaEntry(
		'distributedTask.environments.delete',
	),
	'distributedTask.environments.get': azuredevopsSchemaEntry(
		'distributedTask.environments.get',
	),
	'distributedTask.environments.list': azuredevopsSchemaEntry(
		'distributedTask.environments.list',
	),
	'distributedTask.environments.update': azuredevopsSchemaEntry(
		'distributedTask.environments.update',
	),
	'distributedTask.events.postEvent': azuredevopsSchemaEntry(
		'distributedTask.events.postEvent',
	),
	'distributedTask.kubernetes.add': azuredevopsSchemaEntry(
		'distributedTask.kubernetes.add',
	),
	'distributedTask.kubernetes.delete': azuredevopsSchemaEntry(
		'distributedTask.kubernetes.delete',
	),
	'distributedTask.kubernetes.get': azuredevopsSchemaEntry(
		'distributedTask.kubernetes.get',
	),
	'distributedTask.logs.appendLogContent': azuredevopsSchemaEntry(
		'distributedTask.logs.appendLogContent',
	),
	'distributedTask.logs.create': azuredevopsSchemaEntry(
		'distributedTask.logs.create',
	),
	'distributedTask.nodes.list': azuredevopsSchemaEntry(
		'distributedTask.nodes.list',
	),
	'distributedTask.nodes.update': azuredevopsSchemaEntry(
		'distributedTask.nodes.update',
	),
	'distributedTask.oidctoken.create': azuredevopsSchemaEntry(
		'distributedTask.oidctoken.create',
	),
	'distributedTask.pools.add': azuredevopsSchemaEntry(
		'distributedTask.pools.add',
	),
	'distributedTask.pools.delete': azuredevopsSchemaEntry(
		'distributedTask.pools.delete',
	),
	'distributedTask.pools.get': azuredevopsSchemaEntry(
		'distributedTask.pools.get',
	),
	'distributedTask.pools.getAgentPools': azuredevopsSchemaEntry(
		'distributedTask.pools.getAgentPools',
	),
	'distributedTask.pools.getAgentPoolsByIds': azuredevopsSchemaEntry(
		'distributedTask.pools.getAgentPoolsByIds',
	),
	'distributedTask.pools.update': azuredevopsSchemaEntry(
		'distributedTask.pools.update',
	),
	'distributedTask.queues.add': azuredevopsSchemaEntry(
		'distributedTask.queues.add',
	),
	'distributedTask.queues.delete': azuredevopsSchemaEntry(
		'distributedTask.queues.delete',
	),
	'distributedTask.queues.get': azuredevopsSchemaEntry(
		'distributedTask.queues.get',
	),
	'distributedTask.queues.getAgentQueues': azuredevopsSchemaEntry(
		'distributedTask.queues.getAgentQueues',
	),
	'distributedTask.queues.getAgentQueuesByIds': azuredevopsSchemaEntry(
		'distributedTask.queues.getAgentQueuesByIds',
	),
	'distributedTask.queues.getAgentQueuesByNames': azuredevopsSchemaEntry(
		'distributedTask.queues.getAgentQueuesByNames',
	),
	'distributedTask.queues.getAgentQueuesForPools': azuredevopsSchemaEntry(
		'distributedTask.queues.getAgentQueuesForPools',
	),
	'distributedTask.records.update': azuredevopsSchemaEntry(
		'distributedTask.records.update',
	),
	'distributedTask.requests.list': azuredevopsSchemaEntry(
		'distributedTask.requests.list',
	),
	'distributedTask.targets.delete': azuredevopsSchemaEntry(
		'distributedTask.targets.delete',
	),
	'distributedTask.targets.get': azuredevopsSchemaEntry(
		'distributedTask.targets.get',
	),
	'distributedTask.targets.list': azuredevopsSchemaEntry(
		'distributedTask.targets.list',
	),
	'distributedTask.targets.update': azuredevopsSchemaEntry(
		'distributedTask.targets.update',
	),
	'distributedTask.taskgroups.add': azuredevopsSchemaEntry(
		'distributedTask.taskgroups.add',
	),
	'distributedTask.taskgroups.delete': azuredevopsSchemaEntry(
		'distributedTask.taskgroups.delete',
	),
	'distributedTask.taskgroups.list': azuredevopsSchemaEntry(
		'distributedTask.taskgroups.list',
	),
	'distributedTask.taskgroups.update': azuredevopsSchemaEntry(
		'distributedTask.taskgroups.update',
	),
	'distributedTask.variablegroups.add': azuredevopsSchemaEntry(
		'distributedTask.variablegroups.add',
	),
	'distributedTask.variablegroups.delete': azuredevopsSchemaEntry(
		'distributedTask.variablegroups.delete',
	),
	'distributedTask.variablegroups.get': azuredevopsSchemaEntry(
		'distributedTask.variablegroups.get',
	),
	'distributedTask.variablegroups.getVariableGroups': azuredevopsSchemaEntry(
		'distributedTask.variablegroups.getVariableGroups',
	),
	'distributedTask.variablegroups.getVariableGroupsById':
		azuredevopsSchemaEntry(
			'distributedTask.variablegroups.getVariableGroupsById',
		),
	'distributedTask.variablegroups.shareVariableGroup': azuredevopsSchemaEntry(
		'distributedTask.variablegroups.shareVariableGroup',
	),
	'distributedTask.variablegroups.update': azuredevopsSchemaEntry(
		'distributedTask.variablegroups.update',
	),
	'distributedTask.yamlschema.get': azuredevopsSchemaEntry(
		'distributedTask.yamlschema.get',
	),
	'extensionManagement.installedExtensions.get': azuredevopsSchemaEntry(
		'extensionManagement.installedExtensions.get',
	),
	'extensionManagement.installedExtensions.installExtensionByName':
		azuredevopsSchemaEntry(
			'extensionManagement.installedExtensions.installExtensionByName',
		),
	'extensionManagement.installedExtensions.list': azuredevopsSchemaEntry(
		'extensionManagement.installedExtensions.list',
	),
	'extensionManagement.installedExtensions.uninstallExtensionByName':
		azuredevopsSchemaEntry(
			'extensionManagement.installedExtensions.uninstallExtensionByName',
		),
	'extensionManagement.installedExtensions.update': azuredevopsSchemaEntry(
		'extensionManagement.installedExtensions.update',
	),
	'favorite.favorites.createFavorite': azuredevopsSchemaEntry(
		'favorite.favorites.createFavorite',
	),
	'favorite.favorites.createFavoriteOfOwner': azuredevopsSchemaEntry(
		'favorite.favorites.createFavoriteOfOwner',
	),
	'favorite.favorites.deleteFavoriteById': azuredevopsSchemaEntry(
		'favorite.favorites.deleteFavoriteById',
	),
	'favorite.favorites.deleteFavoriteOfOwnerById': azuredevopsSchemaEntry(
		'favorite.favorites.deleteFavoriteOfOwnerById',
	),
	'favorite.favorites.getFavoriteByArtifact': azuredevopsSchemaEntry(
		'favorite.favorites.getFavoriteByArtifact',
	),
	'favorite.favorites.getFavoriteById': azuredevopsSchemaEntry(
		'favorite.favorites.getFavoriteById',
	),
	'favorite.favorites.getFavoriteOfOwnerById': azuredevopsSchemaEntry(
		'favorite.favorites.getFavoriteOfOwnerById',
	),
	'favorite.favorites.getFavorites': azuredevopsSchemaEntry(
		'favorite.favorites.getFavorites',
	),
	'favorite.favorites.getFavoritesOfOwner': azuredevopsSchemaEntry(
		'favorite.favorites.getFavoritesOfOwner',
	),
	'git.annotatedTags.create': azuredevopsSchemaEntry(
		'git.annotatedTags.create',
	),
	'git.annotatedTags.get': azuredevopsSchemaEntry('git.annotatedTags.get'),
	'git.blobs.getBlob': azuredevopsSchemaEntry('git.blobs.getBlob'),
	'git.blobs.getBlobsZip': azuredevopsSchemaEntry('git.blobs.getBlobsZip'),
	'git.cherryPicks.create': azuredevopsSchemaEntry('git.cherryPicks.create'),
	'git.cherryPicks.getCherryPick': azuredevopsSchemaEntry(
		'git.cherryPicks.getCherryPick',
	),
	'git.cherryPicks.getCherryPickForRefName': azuredevopsSchemaEntry(
		'git.cherryPicks.getCherryPickForRefName',
	),
	'git.commits.get': azuredevopsSchemaEntry('git.commits.get'),
	'git.commits.getChanges': azuredevopsSchemaEntry('git.commits.getChanges'),
	'git.commits.getCommits': azuredevopsSchemaEntry('git.commits.getCommits'),
	'git.commits.getCommitsBatch': azuredevopsSchemaEntry(
		'git.commits.getCommitsBatch',
	),
	'git.commits.getPushCommits': azuredevopsSchemaEntry(
		'git.commits.getPushCommits',
	),
	'git.diffs.get': azuredevopsSchemaEntry('git.diffs.get'),
	'git.forks.createForkSyncRequest': azuredevopsSchemaEntry(
		'git.forks.createForkSyncRequest',
	),
	'git.forks.getForkSyncRequest': azuredevopsSchemaEntry(
		'git.forks.getForkSyncRequest',
	),
	'git.forks.getForkSyncRequests': azuredevopsSchemaEntry(
		'git.forks.getForkSyncRequests',
	),
	'git.forks.list': azuredevopsSchemaEntry('git.forks.list'),
	'git.importRequests.create': azuredevopsSchemaEntry(
		'git.importRequests.create',
	),
	'git.importRequests.get': azuredevopsSchemaEntry('git.importRequests.get'),
	'git.importRequests.query': azuredevopsSchemaEntry(
		'git.importRequests.query',
	),
	'git.importRequests.update': azuredevopsSchemaEntry(
		'git.importRequests.update',
	),
	'git.items.get': azuredevopsSchemaEntry('git.items.get'),
	'git.items.getItemsBatch': azuredevopsSchemaEntry('git.items.getItemsBatch'),
	'git.items.list': azuredevopsSchemaEntry('git.items.list'),
	'git.mergeBases.list': azuredevopsSchemaEntry('git.mergeBases.list'),
	'git.merges.create': azuredevopsSchemaEntry('git.merges.create'),
	'git.merges.get': azuredevopsSchemaEntry('git.merges.get'),
	'git.policyConfigurations.get': azuredevopsSchemaEntry(
		'git.policyConfigurations.get',
	),
	'git.pullRequestAttachments.create': azuredevopsSchemaEntry(
		'git.pullRequestAttachments.create',
	),
	'git.pullRequestAttachments.delete': azuredevopsSchemaEntry(
		'git.pullRequestAttachments.delete',
	),
	'git.pullRequestAttachments.get': azuredevopsSchemaEntry(
		'git.pullRequestAttachments.get',
	),
	'git.pullRequestAttachments.list': azuredevopsSchemaEntry(
		'git.pullRequestAttachments.list',
	),
	'git.pullRequestCommentLikes.create': azuredevopsSchemaEntry(
		'git.pullRequestCommentLikes.create',
	),
	'git.pullRequestCommentLikes.delete': azuredevopsSchemaEntry(
		'git.pullRequestCommentLikes.delete',
	),
	'git.pullRequestCommentLikes.list': azuredevopsSchemaEntry(
		'git.pullRequestCommentLikes.list',
	),
	'git.pullRequestCommits.getPullRequestCommits': azuredevopsSchemaEntry(
		'git.pullRequestCommits.getPullRequestCommits',
	),
	'git.pullRequestCommits.getPullRequestIterationCommits':
		azuredevopsSchemaEntry(
			'git.pullRequestCommits.getPullRequestIterationCommits',
		),
	'git.pullRequestIterationChanges.get': azuredevopsSchemaEntry(
		'git.pullRequestIterationChanges.get',
	),
	'git.pullRequestIterationStatuses.create': azuredevopsSchemaEntry(
		'git.pullRequestIterationStatuses.create',
	),
	'git.pullRequestIterationStatuses.delete': azuredevopsSchemaEntry(
		'git.pullRequestIterationStatuses.delete',
	),
	'git.pullRequestIterationStatuses.get': azuredevopsSchemaEntry(
		'git.pullRequestIterationStatuses.get',
	),
	'git.pullRequestIterationStatuses.list': azuredevopsSchemaEntry(
		'git.pullRequestIterationStatuses.list',
	),
	'git.pullRequestIterationStatuses.update': azuredevopsSchemaEntry(
		'git.pullRequestIterationStatuses.update',
	),
	'git.pullRequestIterations.get': azuredevopsSchemaEntry(
		'git.pullRequestIterations.get',
	),
	'git.pullRequestIterations.list': azuredevopsSchemaEntry(
		'git.pullRequestIterations.list',
	),
	'git.pullRequestLabels.create': azuredevopsSchemaEntry(
		'git.pullRequestLabels.create',
	),
	'git.pullRequestLabels.delete': azuredevopsSchemaEntry(
		'git.pullRequestLabels.delete',
	),
	'git.pullRequestLabels.get': azuredevopsSchemaEntry(
		'git.pullRequestLabels.get',
	),
	'git.pullRequestLabels.list': azuredevopsSchemaEntry(
		'git.pullRequestLabels.list',
	),
	'git.pullRequestProperties.list': azuredevopsSchemaEntry(
		'git.pullRequestProperties.list',
	),
	'git.pullRequestProperties.update': azuredevopsSchemaEntry(
		'git.pullRequestProperties.update',
	),
	'git.pullRequestQuery.get': azuredevopsSchemaEntry(
		'git.pullRequestQuery.get',
	),
	'git.pullRequestReviewers.createPullRequestReviewer': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.createPullRequestReviewer',
	),
	'git.pullRequestReviewers.createPullRequestReviewers': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.createPullRequestReviewers',
	),
	'git.pullRequestReviewers.createUnmaterializedPullRequestReviewer':
		azuredevopsSchemaEntry(
			'git.pullRequestReviewers.createUnmaterializedPullRequestReviewer',
		),
	'git.pullRequestReviewers.delete': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.delete',
	),
	'git.pullRequestReviewers.get': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.get',
	),
	'git.pullRequestReviewers.list': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.list',
	),
	'git.pullRequestReviewers.updatePullRequestReviewer': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.updatePullRequestReviewer',
	),
	'git.pullRequestReviewers.updatePullRequestReviewers': azuredevopsSchemaEntry(
		'git.pullRequestReviewers.updatePullRequestReviewers',
	),
	'git.pullRequestShare.sharePullRequest': azuredevopsSchemaEntry(
		'git.pullRequestShare.sharePullRequest',
	),
	'git.pullRequestStatuses.create': azuredevopsSchemaEntry(
		'git.pullRequestStatuses.create',
	),
	'git.pullRequestStatuses.delete': azuredevopsSchemaEntry(
		'git.pullRequestStatuses.delete',
	),
	'git.pullRequestStatuses.get': azuredevopsSchemaEntry(
		'git.pullRequestStatuses.get',
	),
	'git.pullRequestStatuses.list': azuredevopsSchemaEntry(
		'git.pullRequestStatuses.list',
	),
	'git.pullRequestStatuses.update': azuredevopsSchemaEntry(
		'git.pullRequestStatuses.update',
	),
	'git.pullRequestThreadComments.create': azuredevopsSchemaEntry(
		'git.pullRequestThreadComments.create',
	),
	'git.pullRequestThreadComments.delete': azuredevopsSchemaEntry(
		'git.pullRequestThreadComments.delete',
	),
	'git.pullRequestThreadComments.get': azuredevopsSchemaEntry(
		'git.pullRequestThreadComments.get',
	),
	'git.pullRequestThreadComments.list': azuredevopsSchemaEntry(
		'git.pullRequestThreadComments.list',
	),
	'git.pullRequestThreadComments.update': azuredevopsSchemaEntry(
		'git.pullRequestThreadComments.update',
	),
	'git.pullRequestThreads.create': azuredevopsSchemaEntry(
		'git.pullRequestThreads.create',
	),
	'git.pullRequestThreads.get': azuredevopsSchemaEntry(
		'git.pullRequestThreads.get',
	),
	'git.pullRequestThreads.list': azuredevopsSchemaEntry(
		'git.pullRequestThreads.list',
	),
	'git.pullRequestThreads.update': azuredevopsSchemaEntry(
		'git.pullRequestThreads.update',
	),
	'git.pullRequestWorkItems.list': azuredevopsSchemaEntry(
		'git.pullRequestWorkItems.list',
	),
	'git.pullRequests.create': azuredevopsSchemaEntry('git.pullRequests.create'),
	'git.pullRequests.getPullRequest': azuredevopsSchemaEntry(
		'git.pullRequests.getPullRequest',
	),
	'git.pullRequests.getPullRequestById': azuredevopsSchemaEntry(
		'git.pullRequests.getPullRequestById',
	),
	'git.pullRequests.getPullRequests': azuredevopsSchemaEntry(
		'git.pullRequests.getPullRequests',
	),
	'git.pullRequests.getPullRequestsByProject': azuredevopsSchemaEntry(
		'git.pullRequests.getPullRequestsByProject',
	),
	'git.pullRequests.update': azuredevopsSchemaEntry('git.pullRequests.update'),
	'git.pushes.create': azuredevopsSchemaEntry('git.pushes.create'),
	'git.pushes.get': azuredevopsSchemaEntry('git.pushes.get'),
	'git.pushes.list': azuredevopsSchemaEntry('git.pushes.list'),
	'git.refs.list': azuredevopsSchemaEntry('git.refs.list'),
	'git.refs.updateRef': azuredevopsSchemaEntry('git.refs.updateRef'),
	'git.refs.updateRefs': azuredevopsSchemaEntry('git.refs.updateRefs'),
	'git.refsFavorites.create': azuredevopsSchemaEntry(
		'git.refsFavorites.create',
	),
	'git.refsFavorites.delete': azuredevopsSchemaEntry(
		'git.refsFavorites.delete',
	),
	'git.refsFavorites.get': azuredevopsSchemaEntry('git.refsFavorites.get'),
	'git.refsFavorites.list': azuredevopsSchemaEntry('git.refsFavorites.list'),
	'git.repositories.create': azuredevopsSchemaEntry('git.repositories.create'),
	'git.repositories.delete': azuredevopsSchemaEntry('git.repositories.delete'),
	'git.repositories.deleteRepositoryFromRecycleBin': azuredevopsSchemaEntry(
		'git.repositories.deleteRepositoryFromRecycleBin',
	),
	'git.repositories.getDeletedRepositories': azuredevopsSchemaEntry(
		'git.repositories.getDeletedRepositories',
	),
	'git.repositories.getRecycleBinRepositories': azuredevopsSchemaEntry(
		'git.repositories.getRecycleBinRepositories',
	),
	'git.repositories.getRepository': azuredevopsSchemaEntry(
		'git.repositories.getRepository',
	),
	'git.repositories.getRepositoryWithParent': azuredevopsSchemaEntry(
		'git.repositories.getRepositoryWithParent',
	),
	'git.repositories.list': azuredevopsSchemaEntry('git.repositories.list'),
	'git.repositories.restoreRepositoryFromRecycleBin': azuredevopsSchemaEntry(
		'git.repositories.restoreRepositoryFromRecycleBin',
	),
	'git.repositories.update': azuredevopsSchemaEntry('git.repositories.update'),
	'git.reverts.create': azuredevopsSchemaEntry('git.reverts.create'),
	'git.reverts.getRevert': azuredevopsSchemaEntry('git.reverts.getRevert'),
	'git.reverts.getRevertForRefName': azuredevopsSchemaEntry(
		'git.reverts.getRevertForRefName',
	),
	'git.stats.get': azuredevopsSchemaEntry('git.stats.get'),
	'git.stats.list': azuredevopsSchemaEntry('git.stats.list'),
	'git.statuses.create': azuredevopsSchemaEntry('git.statuses.create'),
	'git.statuses.list': azuredevopsSchemaEntry('git.statuses.list'),
	'git.suggestions.list': azuredevopsSchemaEntry('git.suggestions.list'),
	'git.trees.get': azuredevopsSchemaEntry('git.trees.get'),
	'graph.avatars.delete': azuredevopsSchemaEntry('graph.avatars.delete'),
	'graph.avatars.get': azuredevopsSchemaEntry('graph.avatars.get'),
	'graph.avatars.setAvatar': azuredevopsSchemaEntry('graph.avatars.setAvatar'),
	'graph.descriptors.get': azuredevopsSchemaEntry('graph.descriptors.get'),
	'graph.groups.create': azuredevopsSchemaEntry('graph.groups.create'),
	'graph.groups.delete': azuredevopsSchemaEntry('graph.groups.delete'),
	'graph.groups.get': azuredevopsSchemaEntry('graph.groups.get'),
	'graph.groups.list': azuredevopsSchemaEntry('graph.groups.list'),
	'graph.groups.update': azuredevopsSchemaEntry('graph.groups.update'),
	'graph.membershipStates.get': azuredevopsSchemaEntry(
		'graph.membershipStates.get',
	),
	'graph.memberships.add': azuredevopsSchemaEntry('graph.memberships.add'),
	'graph.memberships.get': azuredevopsSchemaEntry('graph.memberships.get'),
	'graph.memberships.list': azuredevopsSchemaEntry('graph.memberships.list'),
	'graph.memberships.removeMembership': azuredevopsSchemaEntry(
		'graph.memberships.removeMembership',
	),
	'graph.providerInfo.get': azuredevopsSchemaEntry('graph.providerInfo.get'),
	'graph.requestAccess.requestAccess': azuredevopsSchemaEntry(
		'graph.requestAccess.requestAccess',
	),
	'graph.servicePrincipals.create': azuredevopsSchemaEntry(
		'graph.servicePrincipals.create',
	),
	'graph.servicePrincipals.delete': azuredevopsSchemaEntry(
		'graph.servicePrincipals.delete',
	),
	'graph.servicePrincipals.get': azuredevopsSchemaEntry(
		'graph.servicePrincipals.get',
	),
	'graph.servicePrincipals.list': azuredevopsSchemaEntry(
		'graph.servicePrincipals.list',
	),
	'graph.storageKeys.get': azuredevopsSchemaEntry('graph.storageKeys.get'),
	'graph.subjectLookup.lookupSubjects': azuredevopsSchemaEntry(
		'graph.subjectLookup.lookupSubjects',
	),
	'graph.subjectQuery.query': azuredevopsSchemaEntry(
		'graph.subjectQuery.query',
	),
	'graph.users.create': azuredevopsSchemaEntry('graph.users.create'),
	'graph.users.delete': azuredevopsSchemaEntry('graph.users.delete'),
	'graph.users.get': azuredevopsSchemaEntry('graph.users.get'),
	'graph.users.list': azuredevopsSchemaEntry('graph.users.list'),
	'graph.users.update': azuredevopsSchemaEntry('graph.users.update'),
	'hooks.consumers.get': azuredevopsSchemaEntry('hooks.consumers.get'),
	'hooks.consumers.getConsumerAction': azuredevopsSchemaEntry(
		'hooks.consumers.getConsumerAction',
	),
	'hooks.consumers.list': azuredevopsSchemaEntry('hooks.consumers.list'),
	'hooks.consumers.listConsumerActions': azuredevopsSchemaEntry(
		'hooks.consumers.listConsumerActions',
	),
	'hooks.diagnostics.get': azuredevopsSchemaEntry('hooks.diagnostics.get'),
	'hooks.diagnostics.update': azuredevopsSchemaEntry(
		'hooks.diagnostics.update',
	),
	'hooks.notifications.create': azuredevopsSchemaEntry(
		'hooks.notifications.create',
	),
	'hooks.notifications.get': azuredevopsSchemaEntry('hooks.notifications.get'),
	'hooks.notifications.list': azuredevopsSchemaEntry(
		'hooks.notifications.list',
	),
	'hooks.notifications.query': azuredevopsSchemaEntry(
		'hooks.notifications.query',
	),
	'hooks.publishers.get': azuredevopsSchemaEntry('hooks.publishers.get'),
	'hooks.publishers.getEventType': azuredevopsSchemaEntry(
		'hooks.publishers.getEventType',
	),
	'hooks.publishers.list': azuredevopsSchemaEntry('hooks.publishers.list'),
	'hooks.publishers.listEventTypes': azuredevopsSchemaEntry(
		'hooks.publishers.listEventTypes',
	),
	'hooks.publishers.queryInputValues': azuredevopsSchemaEntry(
		'hooks.publishers.queryInputValues',
	),
	'hooks.publishers.queryPublishers': azuredevopsSchemaEntry(
		'hooks.publishers.queryPublishers',
	),
	'hooks.subscriptions.create': azuredevopsSchemaEntry(
		'hooks.subscriptions.create',
	),
	'hooks.subscriptions.createSubscriptionsQuery': azuredevopsSchemaEntry(
		'hooks.subscriptions.createSubscriptionsQuery',
	),
	'hooks.subscriptions.delete': azuredevopsSchemaEntry(
		'hooks.subscriptions.delete',
	),
	'hooks.subscriptions.get': azuredevopsSchemaEntry('hooks.subscriptions.get'),
	'hooks.subscriptions.list': azuredevopsSchemaEntry(
		'hooks.subscriptions.list',
	),
	'hooks.subscriptions.replaceSubscription': azuredevopsSchemaEntry(
		'hooks.subscriptions.replaceSubscription',
	),
	'ims.identities.readIdentities': azuredevopsSchemaEntry(
		'ims.identities.readIdentities',
	),
	'memberEntitlementManagement.groupEntitlements.add': azuredevopsSchemaEntry(
		'memberEntitlementManagement.groupEntitlements.add',
	),
	'memberEntitlementManagement.groupEntitlements.delete':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.groupEntitlements.delete',
		),
	'memberEntitlementManagement.groupEntitlements.get': azuredevopsSchemaEntry(
		'memberEntitlementManagement.groupEntitlements.get',
	),
	'memberEntitlementManagement.groupEntitlements.list': azuredevopsSchemaEntry(
		'memberEntitlementManagement.groupEntitlements.list',
	),
	'memberEntitlementManagement.groupEntitlements.update':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.groupEntitlements.update',
		),
	'memberEntitlementManagement.memberEntitlements.searchMemberEntitlements':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.memberEntitlements.searchMemberEntitlements',
		),
	'memberEntitlementManagement.members.add': azuredevopsSchemaEntry(
		'memberEntitlementManagement.members.add',
	),
	'memberEntitlementManagement.members.get': azuredevopsSchemaEntry(
		'memberEntitlementManagement.members.get',
	),
	'memberEntitlementManagement.members.removeMemberFromGroup':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.members.removeMemberFromGroup',
		),
	'memberEntitlementManagement.servicePrincipalEntitlements.add':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.servicePrincipalEntitlements.add',
		),
	'memberEntitlementManagement.servicePrincipalEntitlements.delete':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.servicePrincipalEntitlements.delete',
		),
	'memberEntitlementManagement.servicePrincipalEntitlements.get':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.servicePrincipalEntitlements.get',
		),
	'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlement':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlement',
		),
	'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlements':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlements',
		),
	'memberEntitlementManagement.userEntitlementSummary.get':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.userEntitlementSummary.get',
		),
	'memberEntitlementManagement.userEntitlements.add': azuredevopsSchemaEntry(
		'memberEntitlementManagement.userEntitlements.add',
	),
	'memberEntitlementManagement.userEntitlements.delete': azuredevopsSchemaEntry(
		'memberEntitlementManagement.userEntitlements.delete',
	),
	'memberEntitlementManagement.userEntitlements.get': azuredevopsSchemaEntry(
		'memberEntitlementManagement.userEntitlements.get',
	),
	'memberEntitlementManagement.userEntitlements.searchUserEntitlements':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.userEntitlements.searchUserEntitlements',
		),
	'memberEntitlementManagement.userEntitlements.updateUserEntitlement':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.userEntitlements.updateUserEntitlement',
		),
	'memberEntitlementManagement.userEntitlements.updateUserEntitlements':
		azuredevopsSchemaEntry(
			'memberEntitlementManagement.userEntitlements.updateUserEntitlements',
		),
	'notification.diagnosticLogs.list': azuredevopsSchemaEntry(
		'notification.diagnosticLogs.list',
	),
	'notification.diagnostics.get': azuredevopsSchemaEntry(
		'notification.diagnostics.get',
	),
	'notification.diagnostics.update': azuredevopsSchemaEntry(
		'notification.diagnostics.update',
	),
	'notification.eventTypes.get': azuredevopsSchemaEntry(
		'notification.eventTypes.get',
	),
	'notification.eventTypes.list': azuredevopsSchemaEntry(
		'notification.eventTypes.list',
	),
	'notification.settings.get': azuredevopsSchemaEntry(
		'notification.settings.get',
	),
	'notification.settings.update': azuredevopsSchemaEntry(
		'notification.settings.update',
	),
	'notification.subscribers.get': azuredevopsSchemaEntry(
		'notification.subscribers.get',
	),
	'notification.subscribers.update': azuredevopsSchemaEntry(
		'notification.subscribers.update',
	),
	'notification.subscriptions.create': azuredevopsSchemaEntry(
		'notification.subscriptions.create',
	),
	'notification.subscriptions.delete': azuredevopsSchemaEntry(
		'notification.subscriptions.delete',
	),
	'notification.subscriptions.get': azuredevopsSchemaEntry(
		'notification.subscriptions.get',
	),
	'notification.subscriptions.getSubscriptionTemplates': azuredevopsSchemaEntry(
		'notification.subscriptions.getSubscriptionTemplates',
	),
	'notification.subscriptions.list': azuredevopsSchemaEntry(
		'notification.subscriptions.list',
	),
	'notification.subscriptions.query': azuredevopsSchemaEntry(
		'notification.subscriptions.query',
	),
	'notification.subscriptions.update': azuredevopsSchemaEntry(
		'notification.subscriptions.update',
	),
	'notification.subscriptions.updateSubscriptionUserSettings':
		azuredevopsSchemaEntry(
			'notification.subscriptions.updateSubscriptionUserSettings',
		),
	'operations.operations.get': azuredevopsSchemaEntry(
		'operations.operations.get',
	),
	'permissionsReport.permissionsReport.create': azuredevopsSchemaEntry(
		'permissionsReport.permissionsReport.create',
	),
	'permissionsReport.permissionsReport.get': azuredevopsSchemaEntry(
		'permissionsReport.permissionsReport.get',
	),
	'permissionsReport.permissionsReport.list': azuredevopsSchemaEntry(
		'permissionsReport.permissionsReport.list',
	),
	'permissionsReport.permissionsReportDownload.download':
		azuredevopsSchemaEntry(
			'permissionsReport.permissionsReportDownload.download',
		),
	'pipelines.artifacts.get': azuredevopsSchemaEntry('pipelines.artifacts.get'),
	'pipelines.logs.get': azuredevopsSchemaEntry('pipelines.logs.get'),
	'pipelines.logs.list': azuredevopsSchemaEntry('pipelines.logs.list'),
	'pipelines.pipelines.create': azuredevopsSchemaEntry(
		'pipelines.pipelines.create',
	),
	'pipelines.pipelines.get': azuredevopsSchemaEntry('pipelines.pipelines.get'),
	'pipelines.pipelines.list': azuredevopsSchemaEntry(
		'pipelines.pipelines.list',
	),
	'pipelines.preview.preview': azuredevopsSchemaEntry(
		'pipelines.preview.preview',
	),
	'pipelines.runs.get': azuredevopsSchemaEntry('pipelines.runs.get'),
	'pipelines.runs.list': azuredevopsSchemaEntry('pipelines.runs.list'),
	'pipelines.runs.runPipeline': azuredevopsSchemaEntry(
		'pipelines.runs.runPipeline',
	),
	'policy.configurations.create': azuredevopsSchemaEntry(
		'policy.configurations.create',
	),
	'policy.configurations.delete': azuredevopsSchemaEntry(
		'policy.configurations.delete',
	),
	'policy.configurations.get': azuredevopsSchemaEntry(
		'policy.configurations.get',
	),
	'policy.configurations.list': azuredevopsSchemaEntry(
		'policy.configurations.list',
	),
	'policy.configurations.update': azuredevopsSchemaEntry(
		'policy.configurations.update',
	),
	'policy.evaluations.get': azuredevopsSchemaEntry('policy.evaluations.get'),
	'policy.evaluations.list': azuredevopsSchemaEntry('policy.evaluations.list'),
	'policy.evaluations.requeuePolicyEvaluation': azuredevopsSchemaEntry(
		'policy.evaluations.requeuePolicyEvaluation',
	),
	'policy.revisions.get': azuredevopsSchemaEntry('policy.revisions.get'),
	'policy.revisions.list': azuredevopsSchemaEntry('policy.revisions.list'),
	'policy.types.get': azuredevopsSchemaEntry('policy.types.get'),
	'policy.types.list': azuredevopsSchemaEntry('policy.types.list'),
	'processadmin.behaviors.get': azuredevopsSchemaEntry(
		'processadmin.behaviors.get',
	),
	'processadmin.behaviors.list': azuredevopsSchemaEntry(
		'processadmin.behaviors.list',
	),
	'processadmin.processes.exportProcessTemplate': azuredevopsSchemaEntry(
		'processadmin.processes.exportProcessTemplate',
	),
	'processadmin.processes.importProcessTemplate': azuredevopsSchemaEntry(
		'processadmin.processes.importProcessTemplate',
	),
	'processadmin.processes.importProcessTemplateStatus': azuredevopsSchemaEntry(
		'processadmin.processes.importProcessTemplateStatus',
	),
	'processes.behaviors.create': azuredevopsSchemaEntry(
		'processes.behaviors.create',
	),
	'processes.behaviors.delete': azuredevopsSchemaEntry(
		'processes.behaviors.delete',
	),
	'processes.behaviors.get': azuredevopsSchemaEntry('processes.behaviors.get'),
	'processes.behaviors.list': azuredevopsSchemaEntry(
		'processes.behaviors.list',
	),
	'processes.behaviors.update': azuredevopsSchemaEntry(
		'processes.behaviors.update',
	),
	'processes.controls.create': azuredevopsSchemaEntry(
		'processes.controls.create',
	),
	'processes.controls.moveControlToGroup': azuredevopsSchemaEntry(
		'processes.controls.moveControlToGroup',
	),
	'processes.controls.removeControlFromGroup': azuredevopsSchemaEntry(
		'processes.controls.removeControlFromGroup',
	),
	'processes.controls.update': azuredevopsSchemaEntry(
		'processes.controls.update',
	),
	'processes.fields.add': azuredevopsSchemaEntry('processes.fields.add'),
	'processes.fields.get': azuredevopsSchemaEntry('processes.fields.get'),
	'processes.fields.list': azuredevopsSchemaEntry('processes.fields.list'),
	'processes.fields.removeWorkItemTypeField': azuredevopsSchemaEntry(
		'processes.fields.removeWorkItemTypeField',
	),
	'processes.fields.update': azuredevopsSchemaEntry('processes.fields.update'),
	'processes.groups.add': azuredevopsSchemaEntry('processes.groups.add'),
	'processes.groups.moveGroupToPage': azuredevopsSchemaEntry(
		'processes.groups.moveGroupToPage',
	),
	'processes.groups.moveGroupToSection': azuredevopsSchemaEntry(
		'processes.groups.moveGroupToSection',
	),
	'processes.groups.removeGroup': azuredevopsSchemaEntry(
		'processes.groups.removeGroup',
	),
	'processes.groups.update': azuredevopsSchemaEntry('processes.groups.update'),
	'processes.layout.get': azuredevopsSchemaEntry('processes.layout.get'),
	'processes.lists.create': azuredevopsSchemaEntry('processes.lists.create'),
	'processes.lists.delete': azuredevopsSchemaEntry('processes.lists.delete'),
	'processes.lists.get': azuredevopsSchemaEntry('processes.lists.get'),
	'processes.lists.list': azuredevopsSchemaEntry('processes.lists.list'),
	'processes.lists.update': azuredevopsSchemaEntry('processes.lists.update'),
	'processes.pages.add': azuredevopsSchemaEntry('processes.pages.add'),
	'processes.pages.removePage': azuredevopsSchemaEntry(
		'processes.pages.removePage',
	),
	'processes.pages.update': azuredevopsSchemaEntry('processes.pages.update'),
	'processes.processes.create': azuredevopsSchemaEntry(
		'processes.processes.create',
	),
	'processes.processes.delete': azuredevopsSchemaEntry(
		'processes.processes.delete',
	),
	'processes.processes.editProcess': azuredevopsSchemaEntry(
		'processes.processes.editProcess',
	),
	'processes.processes.get': azuredevopsSchemaEntry('processes.processes.get'),
	'processes.processes.list': azuredevopsSchemaEntry(
		'processes.processes.list',
	),
	'processes.rules.add': azuredevopsSchemaEntry('processes.rules.add'),
	'processes.rules.delete': azuredevopsSchemaEntry('processes.rules.delete'),
	'processes.rules.get': azuredevopsSchemaEntry('processes.rules.get'),
	'processes.rules.list': azuredevopsSchemaEntry('processes.rules.list'),
	'processes.rules.update': azuredevopsSchemaEntry('processes.rules.update'),
	'processes.states.create': azuredevopsSchemaEntry('processes.states.create'),
	'processes.states.delete': azuredevopsSchemaEntry('processes.states.delete'),
	'processes.states.get': azuredevopsSchemaEntry('processes.states.get'),
	'processes.states.hideStateDefinition': azuredevopsSchemaEntry(
		'processes.states.hideStateDefinition',
	),
	'processes.states.list': azuredevopsSchemaEntry('processes.states.list'),
	'processes.states.update': azuredevopsSchemaEntry('processes.states.update'),
	'processes.systemControls.delete': azuredevopsSchemaEntry(
		'processes.systemControls.delete',
	),
	'processes.systemControls.list': azuredevopsSchemaEntry(
		'processes.systemControls.list',
	),
	'processes.systemControls.update': azuredevopsSchemaEntry(
		'processes.systemControls.update',
	),
	'processes.workItemTypes.create': azuredevopsSchemaEntry(
		'processes.workItemTypes.create',
	),
	'processes.workItemTypes.delete': azuredevopsSchemaEntry(
		'processes.workItemTypes.delete',
	),
	'processes.workItemTypes.get': azuredevopsSchemaEntry(
		'processes.workItemTypes.get',
	),
	'processes.workItemTypes.list': azuredevopsSchemaEntry(
		'processes.workItemTypes.list',
	),
	'processes.workItemTypes.update': azuredevopsSchemaEntry(
		'processes.workItemTypes.update',
	),
	'processes.workItemTypesBehaviors.add': azuredevopsSchemaEntry(
		'processes.workItemTypesBehaviors.add',
	),
	'processes.workItemTypesBehaviors.get': azuredevopsSchemaEntry(
		'processes.workItemTypesBehaviors.get',
	),
	'processes.workItemTypesBehaviors.list': azuredevopsSchemaEntry(
		'processes.workItemTypesBehaviors.list',
	),
	'processes.workItemTypesBehaviors.removeBehaviorFromWorkItemType':
		azuredevopsSchemaEntry(
			'processes.workItemTypesBehaviors.removeBehaviorFromWorkItemType',
		),
	'processes.workItemTypesBehaviors.update': azuredevopsSchemaEntry(
		'processes.workItemTypesBehaviors.update',
	),
	'profile.profiles.get': azuredevopsSchemaEntry('profile.profiles.get'),
	'release.approvals.list': azuredevopsSchemaEntry('release.approvals.list'),
	'release.approvals.update': azuredevopsSchemaEntry(
		'release.approvals.update',
	),
	'release.attachments.getReleaseTaskAttachmentContent': azuredevopsSchemaEntry(
		'release.attachments.getReleaseTaskAttachmentContent',
	),
	'release.attachments.getReleaseTaskAttachments': azuredevopsSchemaEntry(
		'release.attachments.getReleaseTaskAttachments',
	),
	'release.attachments.getTaskAttachmentContent': azuredevopsSchemaEntry(
		'release.attachments.getTaskAttachmentContent',
	),
	'release.attachments.getTaskAttachments': azuredevopsSchemaEntry(
		'release.attachments.getTaskAttachments',
	),
	'release.definitions.create': azuredevopsSchemaEntry(
		'release.definitions.create',
	),
	'release.definitions.delete': azuredevopsSchemaEntry(
		'release.definitions.delete',
	),
	'release.definitions.get': azuredevopsSchemaEntry('release.definitions.get'),
	'release.definitions.getDefinitionRevision': azuredevopsSchemaEntry(
		'release.definitions.getDefinitionRevision',
	),
	'release.definitions.getReleaseDefinitionHistory': azuredevopsSchemaEntry(
		'release.definitions.getReleaseDefinitionHistory',
	),
	'release.definitions.list': azuredevopsSchemaEntry(
		'release.definitions.list',
	),
	'release.definitions.update': azuredevopsSchemaEntry(
		'release.definitions.update',
	),
	'release.deployments.list': azuredevopsSchemaEntry(
		'release.deployments.list',
	),
	'release.folders.create': azuredevopsSchemaEntry('release.folders.create'),
	'release.folders.delete': azuredevopsSchemaEntry('release.folders.delete'),
	'release.folders.list': azuredevopsSchemaEntry('release.folders.list'),
	'release.folders.update': azuredevopsSchemaEntry('release.folders.update'),
	'release.gates.update': azuredevopsSchemaEntry('release.gates.update'),
	'release.manualInterventions.get': azuredevopsSchemaEntry(
		'release.manualInterventions.get',
	),
	'release.manualInterventions.list': azuredevopsSchemaEntry(
		'release.manualInterventions.list',
	),
	'release.manualInterventions.update': azuredevopsSchemaEntry(
		'release.manualInterventions.update',
	),
	'release.releases.create': azuredevopsSchemaEntry('release.releases.create'),
	'release.releases.getLogs': azuredevopsSchemaEntry(
		'release.releases.getLogs',
	),
	'release.releases.getRelease': azuredevopsSchemaEntry(
		'release.releases.getRelease',
	),
	'release.releases.getReleaseEnvironment': azuredevopsSchemaEntry(
		'release.releases.getReleaseEnvironment',
	),
	'release.releases.getReleaseRevision': azuredevopsSchemaEntry(
		'release.releases.getReleaseRevision',
	),
	'release.releases.getTaskLog': azuredevopsSchemaEntry(
		'release.releases.getTaskLog',
	),
	'release.releases.list': azuredevopsSchemaEntry('release.releases.list'),
	'release.releases.updateRelease': azuredevopsSchemaEntry(
		'release.releases.updateRelease',
	),
	'release.releases.updateReleaseEnvironment': azuredevopsSchemaEntry(
		'release.releases.updateReleaseEnvironment',
	),
	'release.releases.updateReleaseResource': azuredevopsSchemaEntry(
		'release.releases.updateReleaseResource',
	),
	'search.codeSearchResults.fetchCodeSearchResults': azuredevopsSchemaEntry(
		'search.codeSearchResults.fetchCodeSearchResults',
	),
	'search.packageSearchResults.fetchPackageSearchResults':
		azuredevopsSchemaEntry(
			'search.packageSearchResults.fetchPackageSearchResults',
		),
	'search.repositories.get': azuredevopsSchemaEntry('search.repositories.get'),
	'search.tfvc.get': azuredevopsSchemaEntry('search.tfvc.get'),
	'search.wikiSearchResults.fetchWikiSearchResults': azuredevopsSchemaEntry(
		'search.wikiSearchResults.fetchWikiSearchResults',
	),
	'search.workItemSearchResults.fetchWorkItemSearchResults':
		azuredevopsSchemaEntry(
			'search.workItemSearchResults.fetchWorkItemSearchResults',
		),
	'security.accessControlEntries.removeAccessControlEntries':
		azuredevopsSchemaEntry(
			'security.accessControlEntries.removeAccessControlEntries',
		),
	'security.accessControlEntries.setAccessControlEntries':
		azuredevopsSchemaEntry(
			'security.accessControlEntries.setAccessControlEntries',
		),
	'security.accessControlLists.query': azuredevopsSchemaEntry(
		'security.accessControlLists.query',
	),
	'security.accessControlLists.removeAccessControlLists':
		azuredevopsSchemaEntry(
			'security.accessControlLists.removeAccessControlLists',
		),
	'security.accessControlLists.setAccessControlLists': azuredevopsSchemaEntry(
		'security.accessControlLists.setAccessControlLists',
	),
	'security.permissions.hasPermissions': azuredevopsSchemaEntry(
		'security.permissions.hasPermissions',
	),
	'security.permissions.hasPermissionsBatch': azuredevopsSchemaEntry(
		'security.permissions.hasPermissionsBatch',
	),
	'security.permissions.removePermission': azuredevopsSchemaEntry(
		'security.permissions.removePermission',
	),
	'security.securityNamespaces.query': azuredevopsSchemaEntry(
		'security.securityNamespaces.query',
	),
	'securityRoles.roleassignments.changeInheritance': azuredevopsSchemaEntry(
		'securityRoles.roleassignments.changeInheritance',
	),
	'securityRoles.roleassignments.list': azuredevopsSchemaEntry(
		'securityRoles.roleassignments.list',
	),
	'securityRoles.roleassignments.removeRoleAssignment': azuredevopsSchemaEntry(
		'securityRoles.roleassignments.removeRoleAssignment',
	),
	'securityRoles.roleassignments.removeRoleAssignments': azuredevopsSchemaEntry(
		'securityRoles.roleassignments.removeRoleAssignments',
	),
	'securityRoles.roleassignments.setRoleAssignment': azuredevopsSchemaEntry(
		'securityRoles.roleassignments.setRoleAssignment',
	),
	'securityRoles.roleassignments.setRoleAssignments': azuredevopsSchemaEntry(
		'securityRoles.roleassignments.setRoleAssignments',
	),
	'securityRoles.roledefinitions.list': azuredevopsSchemaEntry(
		'securityRoles.roledefinitions.list',
	),
	'serviceEndpoint.endpointproxy.executeServiceEndpointRequest':
		azuredevopsSchemaEntry(
			'serviceEndpoint.endpointproxy.executeServiceEndpointRequest',
		),
	'serviceEndpoint.endpointproxy.query': azuredevopsSchemaEntry(
		'serviceEndpoint.endpointproxy.query',
	),
	'serviceEndpoint.endpoints.create': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.create',
	),
	'serviceEndpoint.endpoints.delete': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.delete',
	),
	'serviceEndpoint.endpoints.get': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.get',
	),
	'serviceEndpoint.endpoints.getServiceEndpoints': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.getServiceEndpoints',
	),
	'serviceEndpoint.endpoints.getServiceEndpointsByNames':
		azuredevopsSchemaEntry(
			'serviceEndpoint.endpoints.getServiceEndpointsByNames',
		),
	'serviceEndpoint.endpoints.getServiceEndpointsWithRefreshedAuthentication':
		azuredevopsSchemaEntry(
			'serviceEndpoint.endpoints.getServiceEndpointsWithRefreshedAuthentication',
		),
	'serviceEndpoint.endpoints.shareServiceEndpoint': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.shareServiceEndpoint',
	),
	'serviceEndpoint.endpoints.updateServiceEndpoint': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.updateServiceEndpoint',
	),
	'serviceEndpoint.endpoints.updateServiceEndpoints': azuredevopsSchemaEntry(
		'serviceEndpoint.endpoints.updateServiceEndpoints',
	),
	'serviceEndpoint.executionhistory.list': azuredevopsSchemaEntry(
		'serviceEndpoint.executionhistory.list',
	),
	'serviceEndpoint.types.list': azuredevopsSchemaEntry(
		'serviceEndpoint.types.list',
	),
	'status.health.get': azuredevopsSchemaEntry('status.health.get'),
	'symbol.availability.checkAvailability': azuredevopsSchemaEntry(
		'symbol.availability.checkAvailability',
	),
	'symbol.client.get': azuredevopsSchemaEntry('symbol.client.get'),
	'symbol.contents.get': azuredevopsSchemaEntry('symbol.contents.get'),
	'symbol.requests.createRequests': azuredevopsSchemaEntry(
		'symbol.requests.createRequests',
	),
	'symbol.requests.createRequestsRequestIdDebugEntries': azuredevopsSchemaEntry(
		'symbol.requests.createRequestsRequestIdDebugEntries',
	),
	'symbol.requests.createRequestsRequestNameDebugEntries':
		azuredevopsSchemaEntry(
			'symbol.requests.createRequestsRequestNameDebugEntries',
		),
	'symbol.requests.deleteRequestsRequestId': azuredevopsSchemaEntry(
		'symbol.requests.deleteRequestsRequestId',
	),
	'symbol.requests.deleteRequestsRequestName': azuredevopsSchemaEntry(
		'symbol.requests.deleteRequestsRequestName',
	),
	'symbol.requests.getRequestsRequestId': azuredevopsSchemaEntry(
		'symbol.requests.getRequestsRequestId',
	),
	'symbol.requests.getRequestsRequestName': azuredevopsSchemaEntry(
		'symbol.requests.getRequestsRequestName',
	),
	'symbol.requests.updateRequestsRequestId': azuredevopsSchemaEntry(
		'symbol.requests.updateRequestsRequestId',
	),
	'symbol.requests.updateRequestsRequestName': azuredevopsSchemaEntry(
		'symbol.requests.updateRequestsRequestName',
	),
	'symbol.symsrv.get': azuredevopsSchemaEntry('symbol.symsrv.get'),
	'test.attachments.createTestResultAttachment': azuredevopsSchemaEntry(
		'test.attachments.createTestResultAttachment',
	),
	'test.attachments.createTestRunAttachment': azuredevopsSchemaEntry(
		'test.attachments.createTestRunAttachment',
	),
	'test.attachments.createTestSubResultAttachment': azuredevopsSchemaEntry(
		'test.attachments.createTestSubResultAttachment',
	),
	'test.attachments.getTestResultAttachmentZip': azuredevopsSchemaEntry(
		'test.attachments.getTestResultAttachmentZip',
	),
	'test.attachments.getTestResultAttachments': azuredevopsSchemaEntry(
		'test.attachments.getTestResultAttachments',
	),
	'test.attachments.getTestRunAttachmentZip': azuredevopsSchemaEntry(
		'test.attachments.getTestRunAttachmentZip',
	),
	'test.attachments.getTestRunAttachments': azuredevopsSchemaEntry(
		'test.attachments.getTestRunAttachments',
	),
	'test.attachments.getTestSubResultAttachmentZip': azuredevopsSchemaEntry(
		'test.attachments.getTestSubResultAttachmentZip',
	),
	'test.attachments.getTestSubResultAttachments': azuredevopsSchemaEntry(
		'test.attachments.getTestSubResultAttachments',
	),
	'test.codeCoverage.getBuildCodeCoverage': azuredevopsSchemaEntry(
		'test.codeCoverage.getBuildCodeCoverage',
	),
	'test.codeCoverage.getTestRunCodeCoverage': azuredevopsSchemaEntry(
		'test.codeCoverage.getTestRunCodeCoverage',
	),
	'test.iterations.get': azuredevopsSchemaEntry('test.iterations.get'),
	'test.iterations.list': azuredevopsSchemaEntry('test.iterations.list'),
	'test.points.getPoint': azuredevopsSchemaEntry('test.points.getPoint'),
	'test.points.getPointsByQuery': azuredevopsSchemaEntry(
		'test.points.getPointsByQuery',
	),
	'test.points.list': azuredevopsSchemaEntry('test.points.list'),
	'test.points.update': azuredevopsSchemaEntry('test.points.update'),
	'test.resultRetentionSettings.get': azuredevopsSchemaEntry(
		'test.resultRetentionSettings.get',
	),
	'test.resultRetentionSettings.update': azuredevopsSchemaEntry(
		'test.resultRetentionSettings.update',
	),
	'test.results.add': azuredevopsSchemaEntry('test.results.add'),
	'test.results.get': azuredevopsSchemaEntry('test.results.get'),
	'test.results.list': azuredevopsSchemaEntry('test.results.list'),
	'test.results.update': azuredevopsSchemaEntry('test.results.update'),
	'test.runs.create': azuredevopsSchemaEntry('test.runs.create'),
	'test.runs.delete': azuredevopsSchemaEntry('test.runs.delete'),
	'test.runs.getTestRunById': azuredevopsSchemaEntry(
		'test.runs.getTestRunById',
	),
	'test.runs.getTestRunStatistics': azuredevopsSchemaEntry(
		'test.runs.getTestRunStatistics',
	),
	'test.runs.list': azuredevopsSchemaEntry('test.runs.list'),
	'test.runs.query': azuredevopsSchemaEntry('test.runs.query'),
	'test.runs.update': azuredevopsSchemaEntry('test.runs.update'),
	'test.session.create': azuredevopsSchemaEntry('test.session.create'),
	'test.session.list': azuredevopsSchemaEntry('test.session.list'),
	'test.session.update': azuredevopsSchemaEntry('test.session.update'),
	'test.testCases.delete': azuredevopsSchemaEntry('test.testCases.delete'),
	'test.testHistory.query': azuredevopsSchemaEntry('test.testHistory.query'),
	'test.testSuites.add': azuredevopsSchemaEntry('test.testSuites.add'),
	'test.testSuites.get': azuredevopsSchemaEntry('test.testSuites.get'),
	'test.testSuites.list': azuredevopsSchemaEntry('test.testSuites.list'),
	'test.testSuites.removeTestCasesFromSuiteUrl': azuredevopsSchemaEntry(
		'test.testSuites.removeTestCasesFromSuiteUrl',
	),
	'test.testSuites.update': azuredevopsSchemaEntry('test.testSuites.update'),
	'testPlan.configurations.create': azuredevopsSchemaEntry(
		'testPlan.configurations.create',
	),
	'testPlan.configurations.delete': azuredevopsSchemaEntry(
		'testPlan.configurations.delete',
	),
	'testPlan.configurations.get': azuredevopsSchemaEntry(
		'testPlan.configurations.get',
	),
	'testPlan.configurations.list': azuredevopsSchemaEntry(
		'testPlan.configurations.list',
	),
	'testPlan.configurations.update': azuredevopsSchemaEntry(
		'testPlan.configurations.update',
	),
	'testPlan.suiteTestCase.add': azuredevopsSchemaEntry(
		'testPlan.suiteTestCase.add',
	),
	'testPlan.suiteTestCase.getTestCase': azuredevopsSchemaEntry(
		'testPlan.suiteTestCase.getTestCase',
	),
	'testPlan.suiteTestCase.getTestCaseList': azuredevopsSchemaEntry(
		'testPlan.suiteTestCase.getTestCaseList',
	),
	'testPlan.suiteTestCase.removeTestCasesFromSuite': azuredevopsSchemaEntry(
		'testPlan.suiteTestCase.removeTestCasesFromSuite',
	),
	'testPlan.suiteTestCase.removeTestCasesListFromSuite': azuredevopsSchemaEntry(
		'testPlan.suiteTestCase.removeTestCasesListFromSuite',
	),
	'testPlan.suiteTestCase.update': azuredevopsSchemaEntry(
		'testPlan.suiteTestCase.update',
	),
	'testPlan.testCaseClone.cloneTestCase': azuredevopsSchemaEntry(
		'testPlan.testCaseClone.cloneTestCase',
	),
	'testPlan.testCaseClone.get': azuredevopsSchemaEntry(
		'testPlan.testCaseClone.get',
	),
	'testPlan.testCases.delete': azuredevopsSchemaEntry(
		'testPlan.testCases.delete',
	),
	'testPlan.testPlanClone.cloneTestPlan': azuredevopsSchemaEntry(
		'testPlan.testPlanClone.cloneTestPlan',
	),
	'testPlan.testPlanClone.get': azuredevopsSchemaEntry(
		'testPlan.testPlanClone.get',
	),
	'testPlan.testPlans.create': azuredevopsSchemaEntry(
		'testPlan.testPlans.create',
	),
	'testPlan.testPlans.delete': azuredevopsSchemaEntry(
		'testPlan.testPlans.delete',
	),
	'testPlan.testPlans.get': azuredevopsSchemaEntry('testPlan.testPlans.get'),
	'testPlan.testPlans.list': azuredevopsSchemaEntry('testPlan.testPlans.list'),
	'testPlan.testPlans.update': azuredevopsSchemaEntry(
		'testPlan.testPlans.update',
	),
	'testPlan.testPoint.getPoints': azuredevopsSchemaEntry(
		'testPlan.testPoint.getPoints',
	),
	'testPlan.testPoint.getPointsList': azuredevopsSchemaEntry(
		'testPlan.testPoint.getPointsList',
	),
	'testPlan.testPoint.update': azuredevopsSchemaEntry(
		'testPlan.testPoint.update',
	),
	'testPlan.testSuiteClone.cloneTestSuite': azuredevopsSchemaEntry(
		'testPlan.testSuiteClone.cloneTestSuite',
	),
	'testPlan.testSuiteClone.get': azuredevopsSchemaEntry(
		'testPlan.testSuiteClone.get',
	),
	'testPlan.testSuiteEntry.list': azuredevopsSchemaEntry(
		'testPlan.testSuiteEntry.list',
	),
	'testPlan.testSuiteEntry.reorderSuiteEntries': azuredevopsSchemaEntry(
		'testPlan.testSuiteEntry.reorderSuiteEntries',
	),
	'testPlan.testSuites.create': azuredevopsSchemaEntry(
		'testPlan.testSuites.create',
	),
	'testPlan.testSuites.delete': azuredevopsSchemaEntry(
		'testPlan.testSuites.delete',
	),
	'testPlan.testSuites.get': azuredevopsSchemaEntry('testPlan.testSuites.get'),
	'testPlan.testSuites.getSuitesByTestCaseId': azuredevopsSchemaEntry(
		'testPlan.testSuites.getSuitesByTestCaseId',
	),
	'testPlan.testSuites.getTestSuitesForPlan': azuredevopsSchemaEntry(
		'testPlan.testSuites.getTestSuitesForPlan',
	),
	'testPlan.testSuites.update': azuredevopsSchemaEntry(
		'testPlan.testSuites.update',
	),
	'testPlan.variables.create': azuredevopsSchemaEntry(
		'testPlan.variables.create',
	),
	'testPlan.variables.delete': azuredevopsSchemaEntry(
		'testPlan.variables.delete',
	),
	'testPlan.variables.get': azuredevopsSchemaEntry('testPlan.variables.get'),
	'testPlan.variables.list': azuredevopsSchemaEntry('testPlan.variables.list'),
	'testPlan.variables.update': azuredevopsSchemaEntry(
		'testPlan.variables.update',
	),
	'testResults.attachments.createTestIterationResultAttachment':
		azuredevopsSchemaEntry(
			'testResults.attachments.createTestIterationResultAttachment',
		),
	'testResults.attachments.createTestResultAttachment': azuredevopsSchemaEntry(
		'testResults.attachments.createTestResultAttachment',
	),
	'testResults.attachments.createTestRunAttachment': azuredevopsSchemaEntry(
		'testResults.attachments.createTestRunAttachment',
	),
	'testResults.attachments.createTestSubResultAttachment':
		azuredevopsSchemaEntry(
			'testResults.attachments.createTestSubResultAttachment',
		),
	'testResults.attachments.deleteTestResultAttachment': azuredevopsSchemaEntry(
		'testResults.attachments.deleteTestResultAttachment',
	),
	'testResults.attachments.deleteTestRunAttachment': azuredevopsSchemaEntry(
		'testResults.attachments.deleteTestRunAttachment',
	),
	'testResults.attachments.getTestIterationAttachmentZip':
		azuredevopsSchemaEntry(
			'testResults.attachments.getTestIterationAttachmentZip',
		),
	'testResults.attachments.getTestResultAttachmentZip': azuredevopsSchemaEntry(
		'testResults.attachments.getTestResultAttachmentZip',
	),
	'testResults.attachments.getTestResultAttachments': azuredevopsSchemaEntry(
		'testResults.attachments.getTestResultAttachments',
	),
	'testResults.attachments.getTestRunAttachmentZip': azuredevopsSchemaEntry(
		'testResults.attachments.getTestRunAttachmentZip',
	),
	'testResults.attachments.getTestRunAttachments': azuredevopsSchemaEntry(
		'testResults.attachments.getTestRunAttachments',
	),
	'testResults.attachments.getTestSubResultAttachmentZip':
		azuredevopsSchemaEntry(
			'testResults.attachments.getTestSubResultAttachmentZip',
		),
	'testResults.attachments.getTestSubResultAttachments': azuredevopsSchemaEntry(
		'testResults.attachments.getTestSubResultAttachments',
	),
	'testResults.bugs.list': azuredevopsSchemaEntry('testResults.bugs.list'),
	'testResults.codecoverage.get': azuredevopsSchemaEntry(
		'testResults.codecoverage.get',
	),
	'testResults.codecoverage.getBuildCodeCoverage': azuredevopsSchemaEntry(
		'testResults.codecoverage.getBuildCodeCoverage',
	),
	'testResults.codecoverage.getTestRunCodeCoverage': azuredevopsSchemaEntry(
		'testResults.codecoverage.getTestRunCodeCoverage',
	),
	'testResults.codecoverage.update': azuredevopsSchemaEntry(
		'testResults.codecoverage.update',
	),
	'testResults.filecoverage.get': azuredevopsSchemaEntry(
		'testResults.filecoverage.get',
	),
	'testResults.history.query': azuredevopsSchemaEntry(
		'testResults.history.query',
	),
	'testResults.messageLogs.list': azuredevopsSchemaEntry(
		'testResults.messageLogs.list',
	),
	'testResults.metrics.get': azuredevopsSchemaEntry('testResults.metrics.get'),
	'testResults.resultDocument.publishTestResultDocument':
		azuredevopsSchemaEntry(
			'testResults.resultDocument.publishTestResultDocument',
		),
	'testResults.resultMetaData.query': azuredevopsSchemaEntry(
		'testResults.resultMetaData.query',
	),
	'testResults.resultMetaData.update': azuredevopsSchemaEntry(
		'testResults.resultMetaData.update',
	),
	'testResults.resultTrendByBuild.query': azuredevopsSchemaEntry(
		'testResults.resultTrendByBuild.query',
	),
	'testResults.resultTrendByRelease.query': azuredevopsSchemaEntry(
		'testResults.resultTrendByRelease.query',
	),
	'testResults.resultdetailsbybuild.get': azuredevopsSchemaEntry(
		'testResults.resultdetailsbybuild.get',
	),
	'testResults.resultdetailsbyrelease.get': azuredevopsSchemaEntry(
		'testResults.resultdetailsbyrelease.get',
	),
	'testResults.resultgroupsbybuild.list': azuredevopsSchemaEntry(
		'testResults.resultgroupsbybuild.list',
	),
	'testResults.resultgroupsbyrelease.list': azuredevopsSchemaEntry(
		'testResults.resultgroupsbyrelease.list',
	),
	'testResults.results.add': azuredevopsSchemaEntry('testResults.results.add'),
	'testResults.results.getTestResultById': azuredevopsSchemaEntry(
		'testResults.results.getTestResultById',
	),
	'testResults.results.getTestResults': azuredevopsSchemaEntry(
		'testResults.results.getTestResults',
	),
	'testResults.results.getTestResultsByQuery': azuredevopsSchemaEntry(
		'testResults.results.getTestResultsByQuery',
	),
	'testResults.results.getTestResultsByQueryWiql': azuredevopsSchemaEntry(
		'testResults.results.getTestResultsByQueryWiql',
	),
	'testResults.results.update': azuredevopsSchemaEntry(
		'testResults.results.update',
	),
	'testResults.resultsbybuild.list': azuredevopsSchemaEntry(
		'testResults.resultsbybuild.list',
	),
	'testResults.resultsbypipeline.list': azuredevopsSchemaEntry(
		'testResults.resultsbypipeline.list',
	),
	'testResults.resultsbyrelease.list': azuredevopsSchemaEntry(
		'testResults.resultsbyrelease.list',
	),
	'testResults.resultsgroupDetails.testResultsGroupDetails':
		azuredevopsSchemaEntry(
			'testResults.resultsgroupDetails.testResultsGroupDetails',
		),
	'testResults.resultsummarybybuild.query': azuredevopsSchemaEntry(
		'testResults.resultsummarybybuild.query',
	),
	'testResults.resultsummarybypipeline.query': azuredevopsSchemaEntry(
		'testResults.resultsummarybypipeline.query',
	),
	'testResults.resultsummarybyrelease.queryTestResultsReportForRelease':
		azuredevopsSchemaEntry(
			'testResults.resultsummarybyrelease.queryTestResultsReportForRelease',
		),
	'testResults.resultsummarybyrelease.queryTestResultsSummaryForReleases':
		azuredevopsSchemaEntry(
			'testResults.resultsummarybyrelease.queryTestResultsSummaryForReleases',
		),
	'testResults.resultsummarybyrequirement.query': azuredevopsSchemaEntry(
		'testResults.resultsummarybyrequirement.query',
	),
	'testResults.runs.create': azuredevopsSchemaEntry('testResults.runs.create'),
	'testResults.runs.delete': azuredevopsSchemaEntry('testResults.runs.delete'),
	'testResults.runs.get': azuredevopsSchemaEntry('testResults.runs.get'),
	'testResults.runs.list': azuredevopsSchemaEntry('testResults.runs.list'),
	'testResults.runs.query': azuredevopsSchemaEntry('testResults.runs.query'),
	'testResults.runs.update': azuredevopsSchemaEntry('testResults.runs.update'),
	'testResults.runsummary.get': azuredevopsSchemaEntry(
		'testResults.runsummary.get',
	),
	'testResults.settings.get': azuredevopsSchemaEntry(
		'testResults.settings.get',
	),
	'testResults.settings.update': azuredevopsSchemaEntry(
		'testResults.settings.update',
	),
	'testResults.similarTestResults.list': azuredevopsSchemaEntry(
		'testResults.similarTestResults.list',
	),
	'testResults.statistics.get': azuredevopsSchemaEntry(
		'testResults.statistics.get',
	),
	'testResults.status.get': azuredevopsSchemaEntry('testResults.status.get'),
	'testResults.tags.getTestTagsForBuild': azuredevopsSchemaEntry(
		'testResults.tags.getTestTagsForBuild',
	),
	'testResults.tags.getTestTagsForRelease': azuredevopsSchemaEntry(
		'testResults.tags.getTestTagsForRelease',
	),
	'testResults.tags.update': azuredevopsSchemaEntry('testResults.tags.update'),
	'testResults.tagsummary.getTestTagSummaryForBuild': azuredevopsSchemaEntry(
		'testResults.tagsummary.getTestTagSummaryForBuild',
	),
	'testResults.tagsummary.getTestTagSummaryForRelease': azuredevopsSchemaEntry(
		'testResults.tagsummary.getTestTagSummaryForRelease',
	),
	'testResults.testHistory.query': azuredevopsSchemaEntry(
		'testResults.testHistory.query',
	),
	'testResults.testattachments.createBuildAttachmentInLogStore':
		azuredevopsSchemaEntry(
			'testResults.testattachments.createBuildAttachmentInLogStore',
		),
	'testResults.testattachments.createTestRunLogStoreAttachment':
		azuredevopsSchemaEntry(
			'testResults.testattachments.createTestRunLogStoreAttachment',
		),
	'testResults.testattachments.delete': azuredevopsSchemaEntry(
		'testResults.testattachments.delete',
	),
	'testResults.testattachments.get': azuredevopsSchemaEntry(
		'testResults.testattachments.get',
	),
	'testResults.testattachments.list': azuredevopsSchemaEntry(
		'testResults.testattachments.list',
	),
	'testResults.testfailuretype.create': azuredevopsSchemaEntry(
		'testResults.testfailuretype.create',
	),
	'testResults.testfailuretype.delete': azuredevopsSchemaEntry(
		'testResults.testfailuretype.delete',
	),
	'testResults.testfailuretype.list': azuredevopsSchemaEntry(
		'testResults.testfailuretype.list',
	),
	'testResults.testlog.getTestLogsForBuild': azuredevopsSchemaEntry(
		'testResults.testlog.getTestLogsForBuild',
	),
	'testResults.testlog.getTestResultLogs': azuredevopsSchemaEntry(
		'testResults.testlog.getTestResultLogs',
	),
	'testResults.testlog.getTestRunLogs': azuredevopsSchemaEntry(
		'testResults.testlog.getTestRunLogs',
	),
	'testResults.testlog.getTestSubResultLogs': azuredevopsSchemaEntry(
		'testResults.testlog.getTestSubResultLogs',
	),
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForBuildLog':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForBuildLog',
		),
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForResultLog':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForResultLog',
		),
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForRunLog':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForRunLog',
		),
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForSubResultLog':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForSubResultLog',
		),
	'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForBuild':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForBuild',
		),
	'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForResult':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForResult',
		),
	'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForRun':
		azuredevopsSchemaEntry(
			'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForRun',
		),
	'testResults.testsettings.create': azuredevopsSchemaEntry(
		'testResults.testsettings.create',
	),
	'testResults.testsettings.delete': azuredevopsSchemaEntry(
		'testResults.testsettings.delete',
	),
	'testResults.testsettings.get': azuredevopsSchemaEntry(
		'testResults.testsettings.get',
	),
	'testResults.workitems.add': azuredevopsSchemaEntry(
		'testResults.workitems.add',
	),
	'testResults.workitems.delete': azuredevopsSchemaEntry(
		'testResults.workitems.delete',
	),
	'testResults.workitems.list': azuredevopsSchemaEntry(
		'testResults.workitems.list',
	),
	'testResults.workitems.queryTestMethodLinkedWorkItems':
		azuredevopsSchemaEntry(
			'testResults.workitems.queryTestMethodLinkedWorkItems',
		),
	'testResults.workitems.queryTestResultWorkItems': azuredevopsSchemaEntry(
		'testResults.workitems.queryTestResultWorkItems',
	),
	'tfvc.branches.get': azuredevopsSchemaEntry('tfvc.branches.get'),
	'tfvc.branches.getBranchRefs': azuredevopsSchemaEntry(
		'tfvc.branches.getBranchRefs',
	),
	'tfvc.branches.getBranches': azuredevopsSchemaEntry(
		'tfvc.branches.getBranches',
	),
	'tfvc.changesets.create': azuredevopsSchemaEntry('tfvc.changesets.create'),
	'tfvc.changesets.get': azuredevopsSchemaEntry('tfvc.changesets.get'),
	'tfvc.changesets.getBatchedChangesets': azuredevopsSchemaEntry(
		'tfvc.changesets.getBatchedChangesets',
	),
	'tfvc.changesets.getChangesetChanges': azuredevopsSchemaEntry(
		'tfvc.changesets.getChangesetChanges',
	),
	'tfvc.changesets.getChangesetWorkItems': azuredevopsSchemaEntry(
		'tfvc.changesets.getChangesetWorkItems',
	),
	'tfvc.changesets.getChangesets': azuredevopsSchemaEntry(
		'tfvc.changesets.getChangesets',
	),
	'tfvc.items.get': azuredevopsSchemaEntry('tfvc.items.get'),
	'tfvc.items.getItemsBatch': azuredevopsSchemaEntry(
		'tfvc.items.getItemsBatch',
	),
	'tfvc.items.list': azuredevopsSchemaEntry('tfvc.items.list'),
	'tfvc.labels.get': azuredevopsSchemaEntry('tfvc.labels.get'),
	'tfvc.labels.getLabelItems': azuredevopsSchemaEntry(
		'tfvc.labels.getLabelItems',
	),
	'tfvc.labels.list': azuredevopsSchemaEntry('tfvc.labels.list'),
	'tfvc.shelvesets.get': azuredevopsSchemaEntry('tfvc.shelvesets.get'),
	'tfvc.shelvesets.getShelvesetChanges': azuredevopsSchemaEntry(
		'tfvc.shelvesets.getShelvesetChanges',
	),
	'tfvc.shelvesets.getShelvesetWorkItems': azuredevopsSchemaEntry(
		'tfvc.shelvesets.getShelvesetWorkItems',
	),
	'tfvc.shelvesets.list': azuredevopsSchemaEntry('tfvc.shelvesets.list'),
	'tokenAdmin.personalAccessTokens.list': azuredevopsSchemaEntry(
		'tokenAdmin.personalAccessTokens.list',
	),
	'tokenAdmin.revocationRules.create': azuredevopsSchemaEntry(
		'tokenAdmin.revocationRules.create',
	),
	'tokenAdmin.revocations.revokeAuthorizations': azuredevopsSchemaEntry(
		'tokenAdmin.revocations.revokeAuthorizations',
	),
	'tokens.pats.create': azuredevopsSchemaEntry('tokens.pats.create'),
	'tokens.pats.get': azuredevopsSchemaEntry('tokens.pats.get'),
	'tokens.pats.list': azuredevopsSchemaEntry('tokens.pats.list'),
	'tokens.pats.revoke': azuredevopsSchemaEntry('tokens.pats.revoke'),
	'tokens.pats.update': azuredevopsSchemaEntry('tokens.pats.update'),
	'wiki.attachments.create': azuredevopsSchemaEntry('wiki.attachments.create'),
	'wiki.pageMoves.create': azuredevopsSchemaEntry('wiki.pageMoves.create'),
	'wiki.pageStats.get': azuredevopsSchemaEntry('wiki.pageStats.get'),
	'wiki.pages.createOrUpdate': azuredevopsSchemaEntry(
		'wiki.pages.createOrUpdate',
	),
	'wiki.pages.deletePage': azuredevopsSchemaEntry('wiki.pages.deletePage'),
	'wiki.pages.deletePageById': azuredevopsSchemaEntry(
		'wiki.pages.deletePageById',
	),
	'wiki.pages.getPage': azuredevopsSchemaEntry('wiki.pages.getPage'),
	'wiki.pages.getPageById': azuredevopsSchemaEntry('wiki.pages.getPageById'),
	'wiki.pages.update': azuredevopsSchemaEntry('wiki.pages.update'),
	'wiki.pagesBatch.get': azuredevopsSchemaEntry('wiki.pagesBatch.get'),
	'wiki.wikis.create': azuredevopsSchemaEntry('wiki.wikis.create'),
	'wiki.wikis.delete': azuredevopsSchemaEntry('wiki.wikis.delete'),
	'wiki.wikis.get': azuredevopsSchemaEntry('wiki.wikis.get'),
	'wiki.wikis.list': azuredevopsSchemaEntry('wiki.wikis.list'),
	'wiki.wikis.update': azuredevopsSchemaEntry('wiki.wikis.update'),
	'wit.accountMyWorkRecentActivity.list': azuredevopsSchemaEntry(
		'wit.accountMyWorkRecentActivity.list',
	),
	'wit.artifactLinkTypes.list': azuredevopsSchemaEntry(
		'wit.artifactLinkTypes.list',
	),
	'wit.artifactUriQuery.query': azuredevopsSchemaEntry(
		'wit.artifactUriQuery.query',
	),
	'wit.attachments.create': azuredevopsSchemaEntry('wit.attachments.create'),
	'wit.attachments.get': azuredevopsSchemaEntry('wit.attachments.get'),
	'wit.attachments.uploadChunk': azuredevopsSchemaEntry(
		'wit.attachments.uploadChunk',
	),
	'wit.classificationNodes.createOrUpdate': azuredevopsSchemaEntry(
		'wit.classificationNodes.createOrUpdate',
	),
	'wit.classificationNodes.delete': azuredevopsSchemaEntry(
		'wit.classificationNodes.delete',
	),
	'wit.classificationNodes.get': azuredevopsSchemaEntry(
		'wit.classificationNodes.get',
	),
	'wit.classificationNodes.getClassificationNodes': azuredevopsSchemaEntry(
		'wit.classificationNodes.getClassificationNodes',
	),
	'wit.classificationNodes.getRootNodes': azuredevopsSchemaEntry(
		'wit.classificationNodes.getRootNodes',
	),
	'wit.classificationNodes.update': azuredevopsSchemaEntry(
		'wit.classificationNodes.update',
	),
	'wit.commentReactionsEngagedUsers.list': azuredevopsSchemaEntry(
		'wit.commentReactionsEngagedUsers.list',
	),
	'wit.comments.addComment': azuredevopsSchemaEntry('wit.comments.addComment'),
	'wit.comments.addWorkItemComment': azuredevopsSchemaEntry(
		'wit.comments.addWorkItemComment',
	),
	'wit.comments.delete': azuredevopsSchemaEntry('wit.comments.delete'),
	'wit.comments.getComment': azuredevopsSchemaEntry('wit.comments.getComment'),
	'wit.comments.getComments': azuredevopsSchemaEntry(
		'wit.comments.getComments',
	),
	'wit.comments.getCommentsBatch': azuredevopsSchemaEntry(
		'wit.comments.getCommentsBatch',
	),
	'wit.comments.updateComment': azuredevopsSchemaEntry(
		'wit.comments.updateComment',
	),
	'wit.comments.updateWorkItemComment': azuredevopsSchemaEntry(
		'wit.comments.updateWorkItemComment',
	),
	'wit.commentsReactions.create': azuredevopsSchemaEntry(
		'wit.commentsReactions.create',
	),
	'wit.commentsReactions.delete': azuredevopsSchemaEntry(
		'wit.commentsReactions.delete',
	),
	'wit.commentsReactions.list': azuredevopsSchemaEntry(
		'wit.commentsReactions.list',
	),
	'wit.commentsVersions.get': azuredevopsSchemaEntry(
		'wit.commentsVersions.get',
	),
	'wit.commentsVersions.list': azuredevopsSchemaEntry(
		'wit.commentsVersions.list',
	),
	'wit.fields.create': azuredevopsSchemaEntry('wit.fields.create'),
	'wit.fields.delete': azuredevopsSchemaEntry('wit.fields.delete'),
	'wit.fields.get': azuredevopsSchemaEntry('wit.fields.get'),
	'wit.fields.list': azuredevopsSchemaEntry('wit.fields.list'),
	'wit.fields.update': azuredevopsSchemaEntry('wit.fields.update'),
	'wit.projectProcessMigration.migrateProjectsProcess': azuredevopsSchemaEntry(
		'wit.projectProcessMigration.migrateProjectsProcess',
	),
	'wit.queries.create': azuredevopsSchemaEntry('wit.queries.create'),
	'wit.queries.delete': azuredevopsSchemaEntry('wit.queries.delete'),
	'wit.queries.get': azuredevopsSchemaEntry('wit.queries.get'),
	'wit.queries.getQueriesBatch': azuredevopsSchemaEntry(
		'wit.queries.getQueriesBatch',
	),
	'wit.queries.list': azuredevopsSchemaEntry('wit.queries.list'),
	'wit.queries.searchQueries': azuredevopsSchemaEntry(
		'wit.queries.searchQueries',
	),
	'wit.queries.update': azuredevopsSchemaEntry('wit.queries.update'),
	'wit.recyclebin.destroyWorkItem': azuredevopsSchemaEntry(
		'wit.recyclebin.destroyWorkItem',
	),
	'wit.recyclebin.get': azuredevopsSchemaEntry('wit.recyclebin.get'),
	'wit.recyclebin.getDeletedWorkItemShallowReferences': azuredevopsSchemaEntry(
		'wit.recyclebin.getDeletedWorkItemShallowReferences',
	),
	'wit.recyclebin.getDeletedWorkItems': azuredevopsSchemaEntry(
		'wit.recyclebin.getDeletedWorkItems',
	),
	'wit.recyclebin.restoreWorkItem': azuredevopsSchemaEntry(
		'wit.recyclebin.restoreWorkItem',
	),
	'wit.reportingWorkItemLinks.get': azuredevopsSchemaEntry(
		'wit.reportingWorkItemLinks.get',
	),
	'wit.reportingWorkItemRevisions.readReportingRevisionsGet':
		azuredevopsSchemaEntry(
			'wit.reportingWorkItemRevisions.readReportingRevisionsGet',
		),
	'wit.reportingWorkItemRevisions.readReportingRevisionsPost':
		azuredevopsSchemaEntry(
			'wit.reportingWorkItemRevisions.readReportingRevisionsPost',
		),
	'wit.revisions.get': azuredevopsSchemaEntry('wit.revisions.get'),
	'wit.revisions.list': azuredevopsSchemaEntry('wit.revisions.list'),
	'wit.sendMail.sendMail': azuredevopsSchemaEntry('wit.sendMail.sendMail'),
	'wit.tags.delete': azuredevopsSchemaEntry('wit.tags.delete'),
	'wit.tags.get': azuredevopsSchemaEntry('wit.tags.get'),
	'wit.tags.list': azuredevopsSchemaEntry('wit.tags.list'),
	'wit.tags.update': azuredevopsSchemaEntry('wit.tags.update'),
	'wit.tempQueries.create': azuredevopsSchemaEntry('wit.tempQueries.create'),
	'wit.templates.create': azuredevopsSchemaEntry('wit.templates.create'),
	'wit.templates.delete': azuredevopsSchemaEntry('wit.templates.delete'),
	'wit.templates.get': azuredevopsSchemaEntry('wit.templates.get'),
	'wit.templates.list': azuredevopsSchemaEntry('wit.templates.list'),
	'wit.templates.replaceTemplate': azuredevopsSchemaEntry(
		'wit.templates.replaceTemplate',
	),
	'wit.updates.get': azuredevopsSchemaEntry('wit.updates.get'),
	'wit.updates.list': azuredevopsSchemaEntry('wit.updates.list'),
	'wit.wiql.queryById': azuredevopsSchemaEntry('wit.wiql.queryById'),
	'wit.wiql.queryByWiql': azuredevopsSchemaEntry('wit.wiql.queryByWiql'),
	'wit.workItemIcons.get': azuredevopsSchemaEntry('wit.workItemIcons.get'),
	'wit.workItemIcons.list': azuredevopsSchemaEntry('wit.workItemIcons.list'),
	'wit.workItemRelationTypes.get': azuredevopsSchemaEntry(
		'wit.workItemRelationTypes.get',
	),
	'wit.workItemRelationTypes.list': azuredevopsSchemaEntry(
		'wit.workItemRelationTypes.list',
	),
	'wit.workItemRevisionsDiscussions.readReportingDiscussions':
		azuredevopsSchemaEntry(
			'wit.workItemRevisionsDiscussions.readReportingDiscussions',
		),
	'wit.workItemTransitions.list': azuredevopsSchemaEntry(
		'wit.workItemTransitions.list',
	),
	'wit.workItemTypeCategories.get': azuredevopsSchemaEntry(
		'wit.workItemTypeCategories.get',
	),
	'wit.workItemTypeCategories.list': azuredevopsSchemaEntry(
		'wit.workItemTypeCategories.list',
	),
	'wit.workItemTypeStates.list': azuredevopsSchemaEntry(
		'wit.workItemTypeStates.list',
	),
	'wit.workItemTypes.get': azuredevopsSchemaEntry('wit.workItemTypes.get'),
	'wit.workItemTypes.list': azuredevopsSchemaEntry('wit.workItemTypes.list'),
	'wit.workItemTypesField.get': azuredevopsSchemaEntry(
		'wit.workItemTypesField.get',
	),
	'wit.workItemTypesField.list': azuredevopsSchemaEntry(
		'wit.workItemTypesField.list',
	),
	'wit.workItems.create': azuredevopsSchemaEntry('wit.workItems.create'),
	'wit.workItems.delete': azuredevopsSchemaEntry('wit.workItems.delete'),
	'wit.workItems.deleteWorkItems': azuredevopsSchemaEntry(
		'wit.workItems.deleteWorkItems',
	),
	'wit.workItems.getWorkItem': azuredevopsSchemaEntry(
		'wit.workItems.getWorkItem',
	),
	'wit.workItems.getWorkItemTemplate': azuredevopsSchemaEntry(
		'wit.workItems.getWorkItemTemplate',
	),
	'wit.workItems.getWorkItemsBatch': azuredevopsSchemaEntry(
		'wit.workItems.getWorkItemsBatch',
	),
	'wit.workItems.list': azuredevopsSchemaEntry('wit.workItems.list'),
	'wit.workItems.update': azuredevopsSchemaEntry('wit.workItems.update'),
	'work.backlogconfiguration.get': azuredevopsSchemaEntry(
		'work.backlogconfiguration.get',
	),
	'work.backlogs.getBacklog': azuredevopsSchemaEntry(
		'work.backlogs.getBacklog',
	),
	'work.backlogs.getBacklogLevelWorkItems': azuredevopsSchemaEntry(
		'work.backlogs.getBacklogLevelWorkItems',
	),
	'work.backlogs.list': azuredevopsSchemaEntry('work.backlogs.list'),
	'work.boardcolumns.list': azuredevopsSchemaEntry('work.boardcolumns.list'),
	'work.boardparents.list': azuredevopsSchemaEntry('work.boardparents.list'),
	'work.boardrows.list': azuredevopsSchemaEntry('work.boardrows.list'),
	'work.boards.get': azuredevopsSchemaEntry('work.boards.get'),
	'work.boards.list': azuredevopsSchemaEntry('work.boards.list'),
	'work.boards.setBoardOptions': azuredevopsSchemaEntry(
		'work.boards.setBoardOptions',
	),
	'work.boardusersettings.get': azuredevopsSchemaEntry(
		'work.boardusersettings.get',
	),
	'work.boardusersettings.update': azuredevopsSchemaEntry(
		'work.boardusersettings.update',
	),
	'work.capacities.getCapacitiesWithIdentityRefAndTotals':
		azuredevopsSchemaEntry(
			'work.capacities.getCapacitiesWithIdentityRefAndTotals',
		),
	'work.capacities.getCapacityWithIdentityRef': azuredevopsSchemaEntry(
		'work.capacities.getCapacityWithIdentityRef',
	),
	'work.capacities.replaceCapacitiesWithIdentityRef': azuredevopsSchemaEntry(
		'work.capacities.replaceCapacitiesWithIdentityRef',
	),
	'work.capacities.update': azuredevopsSchemaEntry('work.capacities.update'),
	'work.cardrulesettings.get': azuredevopsSchemaEntry(
		'work.cardrulesettings.get',
	),
	'work.cardrulesettings.updateBoardCardRuleSettings': azuredevopsSchemaEntry(
		'work.cardrulesettings.updateBoardCardRuleSettings',
	),
	'work.cardrulesettings.updateTaskboardCardRuleSettings':
		azuredevopsSchemaEntry(
			'work.cardrulesettings.updateTaskboardCardRuleSettings',
		),
	'work.cardsettings.get': azuredevopsSchemaEntry('work.cardsettings.get'),
	'work.cardsettings.updateBoardCardSettings': azuredevopsSchemaEntry(
		'work.cardsettings.updateBoardCardSettings',
	),
	'work.cardsettings.updateTaskboardCardSettings': azuredevopsSchemaEntry(
		'work.cardsettings.updateTaskboardCardSettings',
	),
	'work.chartimages.getBoardChartImage': azuredevopsSchemaEntry(
		'work.chartimages.getBoardChartImage',
	),
	'work.chartimages.getIterationChartImage': azuredevopsSchemaEntry(
		'work.chartimages.getIterationChartImage',
	),
	'work.chartimages.getIterationsChartImage': azuredevopsSchemaEntry(
		'work.chartimages.getIterationsChartImage',
	),
	'work.charts.get': azuredevopsSchemaEntry('work.charts.get'),
	'work.charts.list': azuredevopsSchemaEntry('work.charts.list'),
	'work.charts.update': azuredevopsSchemaEntry('work.charts.update'),
	'work.columns.list': azuredevopsSchemaEntry('work.columns.list'),
	'work.columns.update': azuredevopsSchemaEntry('work.columns.update'),
	'work.deliverytimeline.get': azuredevopsSchemaEntry(
		'work.deliverytimeline.get',
	),
	'work.iterationcapacities.get': azuredevopsSchemaEntry(
		'work.iterationcapacities.get',
	),
	'work.iterations.delete': azuredevopsSchemaEntry('work.iterations.delete'),
	'work.iterations.get': azuredevopsSchemaEntry('work.iterations.get'),
	'work.iterations.getIterationWorkItems': azuredevopsSchemaEntry(
		'work.iterations.getIterationWorkItems',
	),
	'work.iterations.list': azuredevopsSchemaEntry('work.iterations.list'),
	'work.iterations.postTeamIteration': azuredevopsSchemaEntry(
		'work.iterations.postTeamIteration',
	),
	'work.plans.create': azuredevopsSchemaEntry('work.plans.create'),
	'work.plans.delete': azuredevopsSchemaEntry('work.plans.delete'),
	'work.plans.get': azuredevopsSchemaEntry('work.plans.get'),
	'work.plans.list': azuredevopsSchemaEntry('work.plans.list'),
	'work.plans.update': azuredevopsSchemaEntry('work.plans.update'),
	'work.processconfiguration.get': azuredevopsSchemaEntry(
		'work.processconfiguration.get',
	),
	'work.rows.list': azuredevopsSchemaEntry('work.rows.list'),
	'work.rows.update': azuredevopsSchemaEntry('work.rows.update'),
	'work.taskboardColumns.get': azuredevopsSchemaEntry(
		'work.taskboardColumns.get',
	),
	'work.taskboardColumns.update': azuredevopsSchemaEntry(
		'work.taskboardColumns.update',
	),
	'work.taskboardWorkItems.list': azuredevopsSchemaEntry(
		'work.taskboardWorkItems.list',
	),
	'work.taskboardWorkItems.update': azuredevopsSchemaEntry(
		'work.taskboardWorkItems.update',
	),
	'work.teamdaysoff.get': azuredevopsSchemaEntry('work.teamdaysoff.get'),
	'work.teamdaysoff.update': azuredevopsSchemaEntry('work.teamdaysoff.update'),
	'work.teamfieldvalues.get': azuredevopsSchemaEntry(
		'work.teamfieldvalues.get',
	),
	'work.teamfieldvalues.update': azuredevopsSchemaEntry(
		'work.teamfieldvalues.update',
	),
	'work.teamsettings.get': azuredevopsSchemaEntry('work.teamsettings.get'),
	'work.teamsettings.update': azuredevopsSchemaEntry(
		'work.teamsettings.update',
	),
	'work.workitemsorder.reorderBacklogWorkItems': azuredevopsSchemaEntry(
		'work.workitemsorder.reorderBacklogWorkItems',
	),
	'work.workitemsorder.reorderIterationWorkItems': azuredevopsSchemaEntry(
		'work.workitemsorder.reorderIterationWorkItems',
	),
} satisfies RequiredPluginEndpointSchemas<typeof azuredevopsEndpointsNested>;

export const azuredevopsEndpointMeta = {
	'account.accounts.list': {
		riskLevel: 'read',
		description:
			'Get a list of accounts for a specific owner or a specific member. One of the following parameters is required: ownerId, memberId. Token scope: vso.profile.',
	},
	'approvalsAndChecks.approvals.get': {
		riskLevel: 'read',
		description: 'Get an approval. Token scope: vso.build.',
	},
	'approvalsAndChecks.approvals.query': {
		riskLevel: 'read',
		description:
			'List Approvals. This can be used to get a set of pending approvals in a pipeline, on an user or for a resource.. Token scope: vso.build.',
	},
	'approvalsAndChecks.approvals.update': {
		riskLevel: 'destructive',
		description:
			'Update approvals. Token scope: vso.build_execute, vso.pipelineresources_use.',
	},
	'approvalsAndChecks.checkConfigurations.add': {
		riskLevel: 'write',
		description:
			'Add a check configuration. Preview API (api-version 7.1-preview.1). Token scope: vso.build_execute, vso.pipelineresources_manage.',
	},
	'approvalsAndChecks.checkConfigurations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete check configuration by id. Preview API (api-version 7.1-preview.1). Token scope: vso.build_execute, vso.pipelineresources_manage. Cannot be undone.',
	},
	'approvalsAndChecks.checkConfigurations.get': {
		riskLevel: 'read',
		description:
			'Get Check configuration by Id. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'approvalsAndChecks.checkConfigurations.list': {
		riskLevel: 'read',
		description:
			'Get Check configuration by resource type and id. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'approvalsAndChecks.checkConfigurations.query': {
		riskLevel: 'read',
		description:
			'Get check configurations for multiple resources by resource type and id. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'approvalsAndChecks.checkConfigurations.update': {
		riskLevel: 'write',
		description:
			'Update check configuration. Preview API (api-version 7.1-preview.1). Token scope: vso.build_execute, vso.pipelineresources_manage.',
	},
	'approvalsAndChecks.checkEvaluations.evaluate': {
		riskLevel: 'read',
		description:
			'Initiate an evaluation for a check in a pipeline. Preview API (api-version 7.1-preview.1). Token scope: vso.build_execute.',
	},
	'approvalsAndChecks.checkEvaluations.get': {
		riskLevel: 'read',
		description:
			'Get details for a specific check evaluation. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'approvalsAndChecks.pipelinePermissions.get': {
		riskLevel: 'read',
		description:
			'Given a ResourceType and ResourceId, returns authorized definitions for that resource. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResource':
		{
			riskLevel: 'write',
			description:
				'Authorizes/Unauthorizes a list of definitions for a given resource. Preview API (api-version 7.1-preview.1). Token scope: vso.pipelineresources_manage.',
		},
	'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResources':
		{
			riskLevel: 'write',
			description:
				'Batch API to authorize/unauthorize a list of definitions for a multiple resources. Preview API (api-version 7.1-preview.1). Token scope: vso.pipelineresources_manage.',
		},
	'artifacts.artifactDetails.getBadge': {
		riskLevel: 'read',
		description:
			'Generate a SVG badge for the latest version of a package. The generated SVG is typically used as the image in an HTML link which takes users to the feed containing the package to accelerate discovery and consumption. The project parameter must be supplied if the feed was created in a project.',
	},
	'artifacts.artifactDetails.getPackage': {
		riskLevel: 'read',
		description:
			'Get details about a specific package. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.artifactDetails.getPackageVersion': {
		riskLevel: 'read',
		description:
			'Get details about a specific package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.artifactDetails.getPackageVersionProvenance': {
		riskLevel: 'read',
		description:
			'Gets provenance for a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifacts.artifactDetails.getPackageVersions': {
		riskLevel: 'read',
		description:
			'Get a list of package versions, optionally filtering by state. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.artifactDetails.getPackages': {
		riskLevel: 'read',
		description:
			'Get details about all of the packages in the feed. Use the various filters to include or exclude information from the result set. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.artifactDetails.queryPackageMetrics': {
		riskLevel: 'read',
		description:
			'Token scope: vso.packaging_write. (POST /{project}/_apis/packaging/Feeds/{feedId}/packagemetricsbatch)',
	},
	'artifacts.artifactDetails.queryPackageVersionMetrics': {
		riskLevel: 'read',
		description:
			'Token scope: vso.packaging_write. (POST /{project}/_apis/packaging/Feeds/{feedId}/Packages/{packageId}/versionmetricsbatch)',
	},
	'artifacts.changeTracking.getFeedChange': {
		riskLevel: 'read',
		description:
			'Query a feed to determine its current state. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.changeTracking.getFeedChanges': {
		riskLevel: 'read',
		description:
			'Query to determine which feeds have changed since the last call, tracked through the provided continuationToken. Only changes to a feed itself are returned and impact the continuationToken, not additions or alterations to packages within the feeds. Token scope: vso.packaging.',
	},
	'artifacts.changeTracking.getPackageChanges': {
		riskLevel: 'read',
		description:
			"Get a batch of package changes made to a feed. The changes returned are 'most recent change' so if an Add is followed by an Update before you begin enumerating, you'll only see one change in the batch. Token scope: vso.packaging.",
	},
	'artifacts.feedManagement.createFeed': {
		riskLevel: 'write',
		description:
			'Create a feed, a container for various package types. Feeds can be created in a project if the project parameter is included in the request url. If the project parameter is omitted, the feed will not be associated with a project and will be created at the organization level. Token scope: vso.packaging_write.',
	},
	'artifacts.feedManagement.createFeedView': {
		riskLevel: 'write',
		description:
			'Create a new view on the referenced feed. The project parameter must be supplied if the feed was created in a project. Token scope: vso.packaging_write.',
	},
	'artifacts.feedManagement.deleteFeed': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a feed and all its packages. The feed moves to the recycle bin and is reversible. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifacts.feedManagement.deleteFeedView': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a feed view. The project parameter must be supplied if the feed was created in a project. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifacts.feedManagement.getFeed': {
		riskLevel: 'read',
		description:
			'Get the settings for a specific feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.feedManagement.getFeedPermissions': {
		riskLevel: 'read',
		description:
			'Get the permissions for a feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.feedManagement.getFeedView': {
		riskLevel: 'read',
		description:
			'Get a view by Id. The project parameter must be supplied if the feed was created in a project. Token scope: vso.packaging.',
	},
	'artifacts.feedManagement.getFeedViews': {
		riskLevel: 'read',
		description:
			'Get all views for a feed. The project parameter must be supplied if the feed was created in a project. Token scope: vso.packaging.',
	},
	'artifacts.feedManagement.getFeeds': {
		riskLevel: 'read',
		description:
			'Get all feeds in an account where you have the provided role access. If the project parameter is present, gets all feeds in the given project. If omitted, gets all feeds in the organization. Token scope: vso.packaging.',
	},
	'artifacts.feedManagement.setFeedPermissions': {
		riskLevel: 'write',
		description:
			'Update the permissions on a feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage.',
	},
	'artifacts.feedManagement.updateFeed': {
		riskLevel: 'write',
		description:
			'Change the attributes of a feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage.',
	},
	'artifacts.feedManagement.updateFeedView': {
		riskLevel: 'write',
		description:
			'Update a view. The project parameter must be supplied if the feed was created in a project. Token scope: vso.packaging_manage.',
	},
	'artifacts.feedRecycleBin.list': {
		riskLevel: 'read',
		description:
			'Query for feeds within the recycle bin. If the project parameter is present, gets all feeds in recycle bin in the given project. If omitted, gets all feeds in recycle bin in the organization. Token scope: vso.packaging.',
	},
	'artifacts.feedRecycleBin.permanentDeleteFeed': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifacts.feedRecycleBin.restoreDeletedFeed': {
		riskLevel: 'destructive',
		description:
			'Token scope: vso.packaging_manage. (PATCH /{project}/_apis/packaging/feedrecyclebin/{feedId})',
	},
	'artifacts.provenance.createSession': {
		riskLevel: 'write',
		description:
			'Creates a session, a wrapper around a feed that can store additional metadata on the packages published to it. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifacts.recycleBin.emptyRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Queues a job to remove all package versions from a feed's recycle bin. Token scope: vso.packaging_manage. Cannot be undone.",
	},
	'artifacts.recycleBin.getRecycleBinPackage': {
		riskLevel: 'read',
		description:
			'Get information about a package and all its versions within the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.recycleBin.getRecycleBinPackageVersion': {
		riskLevel: 'read',
		description:
			'Get information about a package version within the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.recycleBin.getRecycleBinPackageVersions': {
		riskLevel: 'read',
		description:
			'Get a list of package versions within the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.recycleBin.getRecycleBinPackages': {
		riskLevel: 'read',
		description:
			'Query for packages within the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.retentionPolicies.deleteRetentionPolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the retention policy for a feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifacts.retentionPolicies.getRetentionPolicy': {
		riskLevel: 'read',
		description:
			'Get the retention policy for a feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifacts.retentionPolicies.setRetentionPolicy': {
		riskLevel: 'write',
		description:
			'Set the retention policy for a feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_write.',
	},
	'artifacts.serviceSettings.getGlobalPermissions': {
		riskLevel: 'read',
		description:
			'Get all service-wide feed creation and administration permissions. Token scope: vso.packaging.',
	},
	'artifacts.serviceSettings.setGlobalPermissions': {
		riskLevel: 'write',
		description:
			'Set service-wide permissions that govern feed creation and administration. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.maven.deletePackageVersion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a package version from the feed and move it to the feed's recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write. Cannot be undone.",
	},
	'artifactsPackageTypes.maven.deletePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Permanently delete a package from a feed's recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage. Cannot be undone.",
	},
	'artifactsPackageTypes.maven.downloadPackage': {
		riskLevel: 'read',
		description:
			'Fulfills Maven package file download requests by either returning the URL of the requested package file or, in the case of Azure DevOps Server (OnPrem), returning the content as a stream. The project parameter must be supplied if the feed was created in a project. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.maven.getPackageVersion': {
		riskLevel: 'read',
		description:
			'Get information about a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.maven.getPackageVersionFromRecycleBin': {
		riskLevel: 'read',
		description:
			'Get information about a package version in the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.maven.getUpstreamingBehavior': {
		riskLevel: 'read',
		description:
			'Get the upstreaming behavior of a package within the context of a feed. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.maven.restorePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			'Restore a package version from the recycle bin to its associated feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.maven.setUpstreamingBehavior': {
		riskLevel: 'write',
		description:
			'Set the upstreaming behavior of a package within the context of a feed The package does not need to necessarily exist in the feed prior to setting the behavior. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.maven.updatePackageVersion': {
		riskLevel: 'write',
		description:
			'Update state for a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.maven.updatePackageVersions': {
		riskLevel: 'write',
		description:
			'Update several packages from a single feed in a single request. The updates to the packages do not happen atomically. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.maven.updateRecycleBinPackages': {
		riskLevel: 'write',
		description:
			'Delete or restore several package versions from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.npm.deletePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a package version without an npm scope from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.npm.deleteScopedPackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a package version with an npm scope from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.npm.downloadPackage': {
		riskLevel: 'read',
		description:
			'Get an unscoped npm package. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.downloadScopedPackage': {
		riskLevel: 'read',
		description:
			'Token scope: vso.packaging. (GET /{project}/_apis/packaging/feeds/{feedId}/npm/packages/@{packageScope}/{unscopedPackageName}/versions/{packageVersion}/content)',
	},
	'artifactsPackageTypes.npm.getPackageReadme': {
		riskLevel: 'read',
		description:
			'Get the Readme for a package version that has no npm scope. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getPackageUpstreamingBehavior': {
		riskLevel: 'read',
		description:
			'Get the upstreaming behavior of the (scoped) package within the context of a feed. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getPackageVersion': {
		riskLevel: 'read',
		description:
			'Get information about an unscoped package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getPackageVersionFromRecycleBin': {
		riskLevel: 'read',
		description:
			'Get information about an unscoped package version in the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getScopedPackageReadme': {
		riskLevel: 'read',
		description:
			'Get the Readme for a package version with an npm scope. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getScopedPackageUpstreamingBehavior': {
		riskLevel: 'read',
		description:
			'Get the upstreaming behavior of the (unscoped) package within the context of a feed. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getScopedPackageVersion': {
		riskLevel: 'read',
		description:
			'Get information about a scoped package version (such as @scope/name). The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.getScopedPackageVersionFromRecycleBin': {
		riskLevel: 'read',
		description:
			'Get information about a scoped package version in the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.npm.restorePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			'Restore a package version without an npm scope from the recycle bin to its feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.npm.restoreScopedPackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			'Restore a package version with an npm scope from the recycle bin to its feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.npm.setScopedUpstreamingBehavior': {
		riskLevel: 'write',
		description:
			'Set the upstreaming behavior of a (scoped) package within the context of a feed The package does not need to necessarily exist in the feed prior to setting the behavior. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.npm.setUpstreamingBehavior': {
		riskLevel: 'write',
		description:
			'Set the upstreaming behavior of a (scoped) package within the context of a feed The package does not need to necessarily exist in the feed prior to setting the behavior. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.npm.unpublishPackage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unpublish an unscoped package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.npm.unpublishScopedPackage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unpublish a scoped package version (such as @scope/name). The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.npm.updatePackage': {
		riskLevel: 'write',
		description:
			'Token scope: vso.packaging_manage. (PATCH /{project}/_apis/packaging/feeds/{feedId}/npm/{packageName}/versions/{packageVersion})',
	},
	'artifactsPackageTypes.npm.updatePackages': {
		riskLevel: 'write',
		description:
			'Update several packages from a single feed in a single request. The updates to the packages do not happen atomically. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.npm.updateRecycleBinPackages': {
		riskLevel: 'write',
		description:
			'Delete or restore several package versions from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.npm.updateScopedPackage': {
		riskLevel: 'write',
		description:
			'Token scope: vso.packaging_manage. (PATCH /{project}/_apis/packaging/feeds/{feedId}/npm/@{packageScope}/{unscopedPackageName}/versions/{packageVersion})',
	},
	'artifactsPackageTypes.nuGet.deletePackageVersion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a package version from the feed to its paired recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.nuGet.deletePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a package version from a feed's recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage. Cannot be undone.",
	},
	'artifactsPackageTypes.nuGet.downloadPackage': {
		riskLevel: 'read',
		description:
			'Download a package version directly. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.nuGet.getPackageVersion': {
		riskLevel: 'read',
		description:
			'Get information about a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.nuGet.getPackageVersionFromRecycleBin': {
		riskLevel: 'read',
		description:
			"View a package version's deletion/recycled status The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.",
	},
	'artifactsPackageTypes.nuGet.getUpstreamingBehavior': {
		riskLevel: 'read',
		description:
			'Get the upstreaming behavior of a package within the context of a feed. Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.nuGet.restorePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			"Restore a package version from a feed's recycle bin back into the active feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.",
	},
	'artifactsPackageTypes.nuGet.setUpstreamingBehavior': {
		riskLevel: 'write',
		description:
			'Set the upstreaming behavior of a package within the context of a feed The package does not need to necessarily exist in the feed prior to setting the behavior. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.nuGet.updatePackageVersion': {
		riskLevel: 'write',
		description:
			'Set mutable state on a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.nuGet.updatePackageVersions': {
		riskLevel: 'write',
		description:
			'Update several packages from a single feed in a single request. The updates to the packages do not happen atomically. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.nuGet.updateRecycleBinPackageVersions': {
		riskLevel: 'write',
		description:
			'Delete or restore several package versions from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.python.deletePackageVersion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a package version, moving it to the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.python.deletePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a package version from the feed, moving it to the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.python.downloadPackage': {
		riskLevel: 'read',
		description:
			'Download a python package file directly. This API is intended for manual UI download options, not for programmatic access and scripting. The project parameter must be supplied if the feed was created in a project. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.python.getPackageVersion': {
		riskLevel: 'read',
		description:
			'Get information about a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.python.getPackageVersionFromRecycleBin': {
		riskLevel: 'read',
		description:
			'Get information about a package version in the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.python.getUpstreamingBehavior': {
		riskLevel: 'read',
		description:
			'Get the upstreaming behavior of a package within the context of a feed. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.python.restorePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			'Restore a package version from the recycle bin to its associated feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.python.setUpstreamingBehavior': {
		riskLevel: 'write',
		description:
			'Set the upstreaming behavior of a package within the context of a feed The package does not need to necessarily exist in the feed prior to setting the behavior. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.python.updatePackageVersion': {
		riskLevel: 'write',
		description:
			'Update state for a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.python.updatePackageVersions': {
		riskLevel: 'write',
		description:
			'Update several packages from a single feed in a single request. The updates to the packages do not happen atomically. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.python.updateRecycleBinPackageVersions': {
		riskLevel: 'write',
		description:
			'Delete or restore several package versions from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.universal.deletePackageVersion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a package version from a feed's recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage. Cannot be undone.",
	},
	'artifactsPackageTypes.universal.deletePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a package version from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage. Cannot be undone.',
	},
	'artifactsPackageTypes.universal.getPackageVersion': {
		riskLevel: 'read',
		description:
			'Show information about a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.universal.getPackageVersionFromRecycleBin': {
		riskLevel: 'read',
		description:
			'Get information about a package version in the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging.',
	},
	'artifactsPackageTypes.universal.restorePackageVersionFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			'Restore a package version from the recycle bin to its associated feed. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.universal.updatePackageVersion': {
		riskLevel: 'write',
		description:
			'Update information for a package version. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_manage.',
	},
	'artifactsPackageTypes.universal.updatePackageVersions': {
		riskLevel: 'write',
		description:
			'Update several packages from a single feed in a single request. The updates to the packages do not happen atomically. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'artifactsPackageTypes.universal.updateRecycleBinPackageVersions': {
		riskLevel: 'write',
		description:
			'Delete or restore several package versions from the recycle bin. The project parameter must be supplied if the feed was created in a project. If the feed is not associated with any project, omit the project parameter from the request. Preview API (api-version 7.1-preview.1). Token scope: vso.packaging_write.',
	},
	'audit.actions.list': {
		riskLevel: 'read',
		description:
			'Get all auditable actions filterable by area. Preview API (api-version 7.1-preview.1). Token scope: vso.auditlog.',
	},
	'audit.auditLog.query': {
		riskLevel: 'read',
		description:
			'Queries audit log entries. Preview API (api-version 7.1-preview.1). Token scope: vso.auditlog.',
	},
	'audit.downloadLog.downloadLog': {
		riskLevel: 'read',
		description:
			'Downloads audit log entries. Preview API (api-version 7.1-preview.1). Token scope: vso.auditlog.',
	},
	'audit.streams.create': {
		riskLevel: 'write',
		description:
			'Create new Audit Stream. Preview API (api-version 7.1-preview.1). Token scope: vso.auditstreams_manage.',
	},
	'audit.streams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Audit Stream. Preview API (api-version 7.1-preview.1). Token scope: vso.auditstreams_manage. Cannot be undone.',
	},
	'audit.streams.queryAllStreams': {
		riskLevel: 'read',
		description:
			'Return all Audit Streams scoped to an organization. Preview API (api-version 7.1-preview.1). Token scope: vso.auditlog.',
	},
	'audit.streams.queryStreamById': {
		riskLevel: 'read',
		description:
			'Return Audit Stream with id of streamId if one exists otherwise throw. Preview API (api-version 7.1-preview.1). Token scope: vso.auditlog.',
	},
	'audit.streams.updateStatus': {
		riskLevel: 'write',
		description:
			'Update existing Audit Stream status. Preview API (api-version 7.1-preview.1). Token scope: vso.auditstreams_manage.',
	},
	'audit.streams.updateStream': {
		riskLevel: 'write',
		description:
			'Update existing Audit Stream. Preview API (api-version 7.1-preview.1). Token scope: vso.auditstreams_manage.',
	},
	'build.artifacts.create': {
		riskLevel: 'write',
		description:
			'Associates an artifact with a build. Token scope: vso.build_execute.',
	},
	'build.artifacts.getArtifact': {
		riskLevel: 'read',
		description:
			'Gets a specific artifact for a build. Token scope: vso.build.',
	},
	'build.artifacts.getFile': {
		riskLevel: 'read',
		description: 'Gets a file from the build. Token scope: vso.build.',
	},
	'build.artifacts.list': {
		riskLevel: 'read',
		description: 'Gets all artifacts for a build. Token scope: vso.build.',
	},
	'build.attachments.get': {
		riskLevel: 'read',
		description: 'Gets a specific attachment. Token scope: vso.build.',
	},
	'build.attachments.list': {
		riskLevel: 'read',
		description:
			'Gets the list of attachments of a specific type that are associated with a build. Token scope: vso.build.',
	},
	'build.authorizedresources.authorizeProjectResources': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.build_execute, vso.pipelineresources_manage.',
	},
	'build.authorizedresources.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'build.badge.get': {
		riskLevel: 'read',
		description:
			'This endpoint is deprecated. Please see the Build Status REST endpoint. Token scope: vso.build.',
	},
	'build.badge.getBuildBadgeData': {
		riskLevel: 'read',
		description:
			'Gets a badge that indicates the status of the most recent build for the specified branch. Preview API (api-version 7.1-preview.2). Token scope: vso.build.',
	},
	'build.builds.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a build. Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.builds.get': {
		riskLevel: 'read',
		description:
			'Gets a build. Token scope: vso.build. (GET /{project}/_apis/build/builds/{buildId})',
	},
	'build.builds.getBuildChanges': {
		riskLevel: 'read',
		description:
			'Gets the changes associated with a build. Token scope: vso.build.',
	},
	'build.builds.getBuildLog': {
		riskLevel: 'read',
		description:
			'Gets an individual log file for a build. Token scope: vso.build.',
	},
	'build.builds.getBuildLogs': {
		riskLevel: 'read',
		description: 'Gets the logs for a build. Token scope: vso.build.',
	},
	'build.builds.getBuildWorkItemsRefs': {
		riskLevel: 'read',
		description:
			'Gets the work items associated with a build. Only work items in the same project are returned. Token scope: vso.build.',
	},
	'build.builds.getBuildWorkItemsRefsFromCommits': {
		riskLevel: 'read',
		description:
			'Gets the work items associated with a build, filtered to specific commits. Token scope: vso.build_execute.',
	},
	'build.builds.getChangesBetweenBuilds': {
		riskLevel: 'read',
		description:
			'Gets the changes made to the repository between two given builds. Token scope: vso.build.',
	},
	'build.builds.getRetentionLeasesForBuild': {
		riskLevel: 'read',
		description:
			'Gets all retention leases that apply to a specific build. Token scope: vso.build.',
	},
	'build.builds.getWorkItemsBetweenBuilds': {
		riskLevel: 'read',
		description:
			'Gets all the work items between two builds. Token scope: vso.build, vso.work.',
	},
	'build.builds.list': {
		riskLevel: 'read',
		description: 'Gets a list of builds. Token scope: vso.build.',
	},
	'build.builds.queue': {
		riskLevel: 'destructive',
		description:
			"Queues a build. Queues a build: it uses the organization's pipeline minutes or a self-hosted agent. Token scope: vso.build_execute.",
	},
	'build.builds.updateBuild': {
		riskLevel: 'write',
		description: 'Updates a build. Token scope: vso.build_execute.',
	},
	'build.builds.updateBuilds': {
		riskLevel: 'write',
		description: 'Updates multiple builds. Token scope: vso.build_execute.',
	},
	'build.controllers.get': {
		riskLevel: 'read',
		description: 'Gets a controller. Token scope: vso.build.',
	},
	'build.controllers.list': {
		riskLevel: 'read',
		description:
			'Gets controller, optionally filtered by name. Token scope: vso.build.',
	},
	'build.definitions.create': {
		riskLevel: 'write',
		description: 'Creates a new definition. Token scope: vso.build_execute.',
	},
	'build.definitions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a definition and all associated builds. Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.definitions.get': {
		riskLevel: 'read',
		description:
			'Gets a definition, optionally at a specific revision. Token scope: vso.build.',
	},
	'build.definitions.getDefinitionRevisions': {
		riskLevel: 'read',
		description: 'Gets all revisions of a definition. Token scope: vso.build.',
	},
	'build.definitions.list': {
		riskLevel: 'read',
		description: 'Gets a list of definitions. Token scope: vso.build.',
	},
	'build.definitions.restoreDefinition': {
		riskLevel: 'destructive',
		description:
			'Restores a deleted definition. Token scope: vso.build_execute.',
	},
	'build.definitions.update': {
		riskLevel: 'write',
		description:
			'Updates an existing build definition. In order for this operation to succeed, the value of the "Revision" property of the request body must match the existing build definition\'s. Token scope: vso.build_execute.',
	},
	'build.folders.create': {
		riskLevel: 'write',
		description:
			'Creates a new folder. Preview API (api-version 7.1-preview.2). Token scope: vso.build_execute.',
	},
	'build.folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a definition folder. Definitions and their corresponding builds will also be deleted. Preview API (api-version 7.1-preview.2). Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.folders.list': {
		riskLevel: 'read',
		description:
			'Gets a list of build definition folders. Preview API (api-version 7.1-preview.2). Token scope: vso.build.',
	},
	'build.folders.update': {
		riskLevel: 'write',
		description:
			'Updates an existing folder at given existing path. Preview API (api-version 7.1-preview.2). Token scope: vso.build_execute.',
	},
	'build.generalSettings.get': {
		riskLevel: 'read',
		description: 'Gets pipeline general settings. Token scope: vso.project.',
	},
	'build.generalSettings.update': {
		riskLevel: 'write',
		description:
			'Updates pipeline general settings. Token scope: vso.project_write.',
	},
	'build.history.get': {
		riskLevel: 'read',
		description:
			'Returns the retention history for the project collection. This includes pipelines that have custom retention rules that may prevent the retention job from cleaning them up, runs per pipeline with retention type, files associated with pipelines owned by the collection with retention type, and the… Token scope: vso.build.',
	},
	'build.latest.get': {
		riskLevel: 'read',
		description:
			'Gets the latest build for a definition, optionally scoped to a specific branch. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'build.leases.add': {
		riskLevel: 'write',
		description:
			'Adds new leases for pipeline runs. Token scope: vso.build_execute.',
	},
	'build.leases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes specific retention leases. Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.leases.get': {
		riskLevel: 'read',
		description:
			'Returns the details of the retention lease given a lease id. Token scope: vso.build.',
	},
	'build.leases.getRetentionLeasesByMinimalRetentionLeases': {
		riskLevel: 'read',
		description:
			'Returns any leases matching the specified MinimalRetentionLeases. Token scope: vso.build.',
	},
	'build.leases.getRetentionLeasesByOwnerId': {
		riskLevel: 'read',
		description:
			'Returns any leases owned by the specified entity, optionally scoped to a single pipeline definition and run. Token scope: vso.build.',
	},
	'build.leases.getRetentionLeasesByUserId': {
		riskLevel: 'read',
		description:
			'Returns any leases owned by the specified user, optionally scoped to a single pipeline definition and run. Token scope: vso.build.',
	},
	'build.leases.update': {
		riskLevel: 'write',
		description:
			'Updates the duration or pipeline protection status of a retention lease. Token scope: vso.build_execute.',
	},
	'build.metrics.getDefinitionMetrics': {
		riskLevel: 'read',
		description:
			'Gets build metrics for a definition. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'build.metrics.getProjectMetrics': {
		riskLevel: 'read',
		description:
			'Gets build metrics for a project. Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'build.options.list': {
		riskLevel: 'read',
		description:
			'Gets all build definition options supported by the system. Token scope: vso.build.',
	},
	'build.properties.getBuildProperties': {
		riskLevel: 'read',
		description: 'Gets properties for a build. Token scope: vso.build.',
	},
	'build.properties.getDefinitionProperties': {
		riskLevel: 'read',
		description: 'Gets properties for a definition. Token scope: vso.build.',
	},
	'build.properties.updateBuildProperties': {
		riskLevel: 'write',
		description:
			'Updates properties for a build. Token scope: vso.build_execute.',
	},
	'build.properties.updateDefinitionProperties': {
		riskLevel: 'write',
		description:
			'Updates properties for a definition. Token scope: vso.build_execute.',
	},
	'build.report.get': {
		riskLevel: 'read',
		description: 'Gets a build report. Token scope: vso.build.',
	},
	'build.resourceUsage.get': {
		riskLevel: 'read',
		description:
			'Gets information about build resources in the system. Preview API (api-version 7.1-preview.2). Token scope: vso.build.',
	},
	'build.resources.authorizeDefinitionResources': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.build_execute, vso.pipelineresources_manage.',
	},
	'build.resources.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.build.',
	},
	'build.retention.get': {
		riskLevel: 'read',
		description:
			"Gets the project's retention settings. Token scope: vso.build.",
	},
	'build.retention.update': {
		riskLevel: 'write',
		description:
			"Updates the project's retention settings. Token scope: vso.build_execute.",
	},
	'build.settings.get': {
		riskLevel: 'read',
		description: 'Gets the build settings. Token scope: vso.build.',
	},
	'build.settings.update': {
		riskLevel: 'write',
		description: 'Updates the build settings. Token scope: vso.build_execute.',
	},
	'build.sourceProviders.getFileContents': {
		riskLevel: 'read',
		description:
			'Gets the contents of a file in the given source code repository. Token scope: vso.build.',
	},
	'build.sourceProviders.getPathContents': {
		riskLevel: 'read',
		description:
			'Gets the contents of a directory in the given source code repository. Token scope: vso.build.',
	},
	'build.sourceProviders.getPullRequest': {
		riskLevel: 'read',
		description:
			'Gets a pull request object from source provider. Token scope: vso.build.',
	},
	'build.sourceProviders.list': {
		riskLevel: 'read',
		description:
			'Get a list of source providers and their capabilities. Token scope: vso.build.',
	},
	'build.sourceProviders.listBranches': {
		riskLevel: 'read',
		description:
			'Gets a list of branches for the given source code repository. Token scope: vso.build.',
	},
	'build.sourceProviders.listRepositories': {
		riskLevel: 'read',
		description:
			'Gets a list of source code repositories. Token scope: vso.build.',
	},
	'build.sourceProviders.listWebhooks': {
		riskLevel: 'read',
		description:
			'Gets a list of webhooks installed in the given source code repository. Token scope: vso.build.',
	},
	'build.sourceProviders.restoreWebhooks': {
		riskLevel: 'destructive',
		description:
			'Recreates the webhooks for the specified triggers in the given source code repository. Token scope: vso.build_execute.',
	},
	'build.stages.update': {
		riskLevel: 'write',
		description: 'Update a build stage. Token scope: vso.build_execute.',
	},
	'build.status.get': {
		riskLevel: 'read',
		description:
			'Gets the build status for a definition, optionally scoped to a specific branch, stage, job, and configuration. If there are more than one, then it is required to pass in a stageName value when specifying a jobName, and the same rule then applies for both if passing a configuration parameter. Preview API (api-version 7.1-preview.1).',
	},
	'build.tags.addBuildTag': {
		riskLevel: 'write',
		description: 'Adds a tag to a build. Token scope: vso.build_execute.',
	},
	'build.tags.addBuildTags': {
		riskLevel: 'write',
		description: 'Adds tags to a build. Token scope: vso.build_execute.',
	},
	'build.tags.addDefinitionTag': {
		riskLevel: 'write',
		description: 'Adds a tag to a definition. Token scope: vso.build_execute.',
	},
	'build.tags.addDefinitionTags': {
		riskLevel: 'write',
		description:
			'Adds multiple tags to a definition. Token scope: vso.build_execute.',
	},
	'build.tags.deleteBuildTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a tag from a build. NOTE: This API will not work for tags with special characters. To remove tags with special characters, use the PATCH method instead (in 6.0+) Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.tags.deleteDefinitionTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a tag from a definition. NOTE: This API will not work for tags with special characters. To remove tags with special characters, use the PATCH method instead (in 6.0+) Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.tags.deleteTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a tag from builds, definitions, and from the tag store. Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.tags.getBuildTags': {
		riskLevel: 'read',
		description: 'Gets the tags for a build. Token scope: vso.build.',
	},
	'build.tags.getDefinitionTags': {
		riskLevel: 'read',
		description: 'Gets the tags for a definition. Token scope: vso.build.',
	},
	'build.tags.getTags': {
		riskLevel: 'read',
		description:
			'Gets a list of all build tags in the project. Token scope: vso.build.',
	},
	'build.tags.updateBuildTags': {
		riskLevel: 'write',
		description:
			'Adds/Removes tags from a build. Token scope: vso.build_execute.',
	},
	'build.tags.updateDefinitionTags': {
		riskLevel: 'write',
		description:
			'Adds/Removes tags from a definition. Token scope: vso.build_execute.',
	},
	'build.templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a build definition template. Token scope: vso.build_execute. Cannot be undone.',
	},
	'build.templates.get': {
		riskLevel: 'read',
		description:
			'Gets a specific build definition template. Token scope: vso.build.',
	},
	'build.templates.list': {
		riskLevel: 'read',
		description: 'Gets all definition templates. Token scope: vso.build.',
	},
	'build.templates.saveTemplate': {
		riskLevel: 'write',
		description:
			'Updates an existing build definition template. Token scope: vso.build_execute.',
	},
	'build.timeline.get': {
		riskLevel: 'read',
		description: 'Gets details for a build. Token scope: vso.build.',
	},
	'build.yaml.get': {
		riskLevel: 'read',
		description:
			'Converts a definition to YAML, optionally at a specific revision. Token scope: vso.build.',
	},
	'core.avatar.removeProjectAvatar': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes the avatar for the project. Preview API (api-version 7.1-preview.1). Token scope: vso.project_manage. Cannot be undone.',
	},
	'core.avatar.setProjectAvatar': {
		riskLevel: 'write',
		description:
			'Sets the avatar for the project. Preview API (api-version 7.1-preview.1). Token scope: vso.project_manage.',
	},
	'core.categorizedTeams.get': {
		riskLevel: 'read',
		description:
			'Gets list of user readable teams in a project and teams user is member of (excluded from readable list). Preview API (api-version 7.1-preview.1). Token scope: vso.profile, vso.project.',
	},
	'core.processes.get': {
		riskLevel: 'read',
		description: 'Get a process by ID. Token scope: vso.work.',
	},
	'core.processes.list': {
		riskLevel: 'read',
		description: 'Get a list of processes. Token scope: vso.work.',
	},
	'core.projects.create': {
		riskLevel: 'write',
		description:
			'Queues a project to be created. Use the GetOperation to periodically check for create project status. Token scope: vso.project_manage.',
	},
	'core.projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Queues a project to be deleted. Use the GetOperation to periodically check for delete project status. Token scope: vso.project_manage. Cannot be undone.',
	},
	'core.projects.get': {
		riskLevel: 'read',
		description:
			'Get project with the specified id or name, optionally including capabilities. Token scope: vso.profile, vso.project.',
	},
	'core.projects.getProjectProperties': {
		riskLevel: 'read',
		description:
			'Get a collection of team project properties. Preview API (api-version 7.1-preview.1). Token scope: vso.profile, vso.project.',
	},
	'core.projects.list': {
		riskLevel: 'read',
		description:
			'Get all projects in the organization that the authenticated user has access to. Token scope: vso.profile, vso.project.',
	},
	'core.projects.setProjectProperties': {
		riskLevel: 'write',
		description:
			'Create, update, and delete team project properties. Preview API (api-version 7.1-preview.1). Token scope: vso.project_write.',
	},
	'core.projects.update': {
		riskLevel: 'write',
		description:
			"Update an existing project's name, abbreviation, description, or restore a project. Token scope: vso.project_write.",
	},
	'core.teams.create': {
		riskLevel: 'write',
		description:
			"Create a team in a team project. Possible failure scenarios Invalid project name/ID (project doesn't exist) 404 Invalid team name or description 400 Team already exists 400 Insufficient privileges 400. Token scope: vso.project_manage.",
	},
	'core.teams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a team. Token scope: vso.project_manage. Cannot be undone.',
	},
	'core.teams.get': {
		riskLevel: 'read',
		description:
			'Get a specific team. (GET /_apis/projects/{projectId}/teams/{teamId})',
	},
	'core.teams.getAllTeams': {
		riskLevel: 'read',
		description:
			'Get a list of all teams. Preview API (api-version 7.1-preview.3). Token scope: vso.project.',
	},
	'core.teams.getTeamMembersWithExtendedProperties': {
		riskLevel: 'read',
		description:
			'Get a list of members for a specific team. Token scope: vso.profile, vso.project.',
	},
	'core.teams.getTeams': {
		riskLevel: 'read',
		description: 'Get a list of teams. Token scope: vso.profile, vso.project.',
	},
	'core.teams.update': {
		riskLevel: 'write',
		description:
			"Update a team's name and/or description. Token scope: vso.project_write.",
	},
	'dashboard.dashboards.create': {
		riskLevel: 'write',
		description:
			'Create the supplied dashboard. Preview API (api-version 7.1-preview.3). Token scope: vso.dashboards_manage.',
	},
	'dashboard.dashboards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a dashboard given its ID. This also deletes the widgets associated with this dashboard. Preview API (api-version 7.1-preview.3). Token scope: vso.dashboards_manage. Cannot be undone.',
	},
	'dashboard.dashboards.get': {
		riskLevel: 'read',
		description:
			'Get a dashboard by its ID. Preview API (api-version 7.1-preview.3). Token scope: vso.dashboards.',
	},
	'dashboard.dashboards.list': {
		riskLevel: 'read',
		description:
			'Get a list of dashboards under a project. Preview API (api-version 7.1-preview.3). Token scope: vso.dashboards.',
	},
	'dashboard.dashboards.replaceDashboard': {
		riskLevel: 'destructive',
		description:
			'Replace configuration for the specified dashboard. Replaces Widget list on Dashboard, only if property is supplied. Preview API (api-version 7.1-preview.3). Token scope: vso.dashboards_manage.',
	},
	'dashboard.dashboards.replaceDashboards': {
		riskLevel: 'destructive',
		description:
			'Update the name and position of dashboards in the supplied group, and remove omitted dashboards. Does not modify dashboard content. Preview API (api-version 7.1-preview.3). Token scope: vso.dashboards_manage.',
	},
	'dashboard.widgetTypes.getWidgetMetadata': {
		riskLevel: 'read',
		description:
			'Get the widget metadata satisfying the specified contribution ID. Preview API (api-version 7.1-preview.1). Token scope: vso.dashboards.',
	},
	'dashboard.widgetTypes.getWidgetTypes': {
		riskLevel: 'read',
		description:
			'Get all available widget metadata in alphabetical order, including widgets marked with isVisibleFromCatalog == false. Preview API (api-version 7.1-preview.1). Token scope: vso.dashboards.',
	},
	'dashboard.widgets.create': {
		riskLevel: 'write',
		description:
			'Create a widget on the specified dashboard. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards_manage.',
	},
	'dashboard.widgets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the specified widget. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards_manage. Cannot be undone.',
	},
	'dashboard.widgets.getWidget': {
		riskLevel: 'read',
		description:
			'Get the current state of the specified widget. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards.',
	},
	'dashboard.widgets.getWidgets': {
		riskLevel: 'read',
		description:
			'Get widgets contained on the specified dashboard. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards.',
	},
	'dashboard.widgets.replaceWidget': {
		riskLevel: 'destructive',
		description:
			'Override the state of the specified widget. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards_manage.',
	},
	'dashboard.widgets.replaceWidgets': {
		riskLevel: 'destructive',
		description:
			'Replace the widgets on specified dashboard with the supplied widgets. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards_manage.',
	},
	'dashboard.widgets.updateWidget': {
		riskLevel: 'write',
		description:
			'Perform a partial update of the specified widget. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards_manage.',
	},
	'dashboard.widgets.updateWidgets': {
		riskLevel: 'write',
		description:
			'Update the supplied widgets on the dashboard using supplied state. State of existing Widgets not passed in the widget list is preserved. Preview API (api-version 7.1-preview.2). Token scope: vso.dashboards_manage.',
	},
	'distributedTask.agentclouds.add': {
		riskLevel: 'write',
		description:
			'Token scope: vso.agentpools_manage. (POST /_apis/distributedtask/agentclouds)',
	},
	'distributedTask.agentclouds.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Token scope: vso.agentpools_manage. Cannot be undone.',
	},
	'distributedTask.agentclouds.get': {
		riskLevel: 'read',
		description:
			'Token scope: vso.agentpools. (GET /_apis/distributedtask/agentclouds/{agentCloudId})',
	},
	'distributedTask.agentclouds.list': {
		riskLevel: 'read',
		description:
			'Token scope: vso.agentpools. (GET /_apis/distributedtask/agentclouds)',
	},
	'distributedTask.agentclouds.update': {
		riskLevel: 'write',
		description:
			'Token scope: vso.agentpools_manage. (PATCH /_apis/distributedtask/agentclouds/{agentCloudId})',
	},
	'distributedTask.agentcloudtypes.list': {
		riskLevel: 'read',
		description:
			'Get agent cloud types. Preview API (api-version 7.1-preview.1). Token scope: vso.agentpools.',
	},
	'distributedTask.agents.add': {
		riskLevel: 'destructive',
		description:
			"Adds an agent to a pool. You probably don't want to call this endpoint directly. Instead, configure an agent using the agent download package. Token scope: vso.agentpools_manage.",
	},
	'distributedTask.agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete an agent. You probably don't want to call this endpoint directly. Instead, use the agent configuration script to remove an agent from your organization. Token scope: vso.agentpools_manage. Cannot be undone.",
	},
	'distributedTask.agents.getAgent': {
		riskLevel: 'read',
		description: 'Get information about an agent. Token scope: vso.agentpools.',
	},
	'distributedTask.agents.getPoolPermission': {
		riskLevel: 'read',
		description: 'Get Permissions on Pool. Token scope: vso.agentpools.',
	},
	'distributedTask.agents.list': {
		riskLevel: 'read',
		description: 'Get a list of agents. Token scope: vso.agentpools.',
	},
	'distributedTask.agents.replaceAgent': {
		riskLevel: 'destructive',
		description:
			"Replace an agent. You probably don't want to call this endpoint directly. Instead, use the agent configuration script to remove and reconfigure an agent from your organization. Token scope: vso.agentpools_manage.",
	},
	'distributedTask.agents.update': {
		riskLevel: 'write',
		description: 'Update agent details. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.deploymentgroups.add': {
		riskLevel: 'write',
		description:
			'Create a deployment group. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.deploymentgroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a deployment group. Token scope: vso.machinegroup_manage. Cannot be undone.',
	},
	'distributedTask.deploymentgroups.get': {
		riskLevel: 'read',
		description:
			'Get a deployment group by its ID. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.deploymentgroups.list': {
		riskLevel: 'read',
		description:
			'Get a list of deployment groups by name or IDs. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.deploymentgroups.update': {
		riskLevel: 'write',
		description:
			'Update a deployment group. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.elasticpoollogs.list': {
		riskLevel: 'read',
		description:
			'Get elastic pool diagnostics logs for a specified Elastic Pool. Token scope: vso.agentpools.',
	},
	'distributedTask.elasticpools.create': {
		riskLevel: 'write',
		description:
			'Create a new elastic pool. This will create a new TaskAgentPool at the organization level. If a project id is provided, this will create a new TaskAgentQueue in the specified project. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.elasticpools.get': {
		riskLevel: 'read',
		description:
			'Returns the Elastic Pool with the specified Pool Id. Token scope: vso.agentpools.',
	},
	'distributedTask.elasticpools.list': {
		riskLevel: 'read',
		description:
			'Get a list of all Elastic Pools. Token scope: vso.agentpools.',
	},
	'distributedTask.elasticpools.update': {
		riskLevel: 'write',
		description:
			'Update settings on a specified Elastic Pool. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.environmentdeploymentRecords.list': {
		riskLevel: 'read',
		description:
			'Get environment deployment execution history. Token scope: vso.environment_manage.',
	},
	'distributedTask.environments.add': {
		riskLevel: 'write',
		description: 'Create an environment. Token scope: vso.environment_manage.',
	},
	'distributedTask.environments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the specified environment. Token scope: vso.environment_manage. Cannot be undone.',
	},
	'distributedTask.environments.get': {
		riskLevel: 'read',
		description:
			'Get an environment by its ID. Token scope: vso.environment_manage.',
	},
	'distributedTask.environments.list': {
		riskLevel: 'read',
		description: 'Get all environments. Token scope: vso.environment_manage.',
	},
	'distributedTask.environments.update': {
		riskLevel: 'write',
		description:
			'Update the specified environment. Token scope: vso.environment_manage.',
	},
	'distributedTask.events.postEvent': {
		riskLevel: 'write',
		description:
			'Send a pipeline job event to be processed by the execution plan.',
	},
	'distributedTask.kubernetes.add': {
		riskLevel: 'write',
		description:
			'Token scope: vso.environment_manage. (POST /{project}/_apis/distributedtask/environments/{environmentId}/providers/kubernetes)',
	},
	'distributedTask.kubernetes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Token scope: vso.environment_manage. Cannot be undone.',
	},
	'distributedTask.kubernetes.get': {
		riskLevel: 'read',
		description:
			'Token scope: vso.environment_manage. (GET /{project}/_apis/distributedtask/environments/{environmentId}/providers/kubernetes/{resourceId})',
	},
	'distributedTask.logs.appendLogContent': {
		riskLevel: 'write',
		description:
			"Append a log to a task's log. The log should be sent in the body of the request as a TaskLog object stream.",
	},
	'distributedTask.logs.create': {
		riskLevel: 'write',
		description:
			"Create a log and connect it to a pipeline run's execution plan.",
	},
	'distributedTask.nodes.list': {
		riskLevel: 'read',
		description:
			'Get a list of ElasticNodes currently in the ElasticPool. Token scope: vso.agentpools.',
	},
	'distributedTask.nodes.update': {
		riskLevel: 'write',
		description:
			'Update properties on a specified ElasticNode. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.oidctoken.create': {
		riskLevel: 'write',
		description: 'Preview API (api-version 7.1-preview.1).',
	},
	'distributedTask.pools.add': {
		riskLevel: 'write',
		description: 'Create an agent pool. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.pools.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an agent pool. Token scope: vso.agentpools_manage. Cannot be undone.',
	},
	'distributedTask.pools.get': {
		riskLevel: 'read',
		description:
			'Get information about an agent pool. Token scope: vso.agentpools.',
	},
	'distributedTask.pools.getAgentPools': {
		riskLevel: 'read',
		description: 'Get a list of agent pools. Token scope: vso.agentpools.',
	},
	'distributedTask.pools.getAgentPoolsByIds': {
		riskLevel: 'read',
		description: 'Get a list of agent pools. Token scope: vso.agentpools.',
	},
	'distributedTask.pools.update': {
		riskLevel: 'write',
		description:
			'Update properties on an agent pool. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.queues.add': {
		riskLevel: 'write',
		description:
			'Create a new agent queue to connect a project to an agent pool. Token scope: vso.agentpools_manage.',
	},
	'distributedTask.queues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes an agent queue from a project. Token scope: vso.agentpools_manage. Cannot be undone.',
	},
	'distributedTask.queues.get': {
		riskLevel: 'read',
		description:
			'Get information about an agent queue. Token scope: vso.agentpools.',
	},
	'distributedTask.queues.getAgentQueues': {
		riskLevel: 'read',
		description: 'Get a list of agent queues. Token scope: vso.agentpools.',
	},
	'distributedTask.queues.getAgentQueuesByIds': {
		riskLevel: 'read',
		description:
			'Get a list of agent queues by their IDs. Token scope: vso.agentpools.',
	},
	'distributedTask.queues.getAgentQueuesByNames': {
		riskLevel: 'read',
		description:
			'Get a list of agent queues by their names. Token scope: vso.agentpools.',
	},
	'distributedTask.queues.getAgentQueuesForPools': {
		riskLevel: 'read',
		description:
			'Get a list of agent queues by pool ids. Token scope: vso.agentpools.',
	},
	'distributedTask.records.update': {
		riskLevel: 'write',
		description:
			'Update timeline records if they already exist, otherwise create new ones for the same timeline.',
	},
	'distributedTask.requests.list': {
		riskLevel: 'read',
		description:
			'Token scope: vso.agentpools. (GET /_apis/distributedtask/agentclouds/{agentCloudId}/requests)',
	},
	'distributedTask.targets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a deployment target in a deployment group. This deletes the agent from associated deployment pool too. Token scope: vso.machinegroup_manage. Cannot be undone.',
	},
	'distributedTask.targets.get': {
		riskLevel: 'read',
		description:
			'Get a deployment target by its ID in a deployment group. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.targets.list': {
		riskLevel: 'read',
		description:
			'Get a list of deployment targets in a deployment group. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.targets.update': {
		riskLevel: 'write',
		description:
			'Update tags of a list of deployment targets in a deployment group. Token scope: vso.machinegroup_manage.',
	},
	'distributedTask.taskgroups.add': {
		riskLevel: 'write',
		description: 'Create a task group. Token scope: vso.taskgroups_write.',
	},
	'distributedTask.taskgroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a task group. Token scope: vso.taskgroups_manage. Cannot be undone.',
	},
	'distributedTask.taskgroups.list': {
		riskLevel: 'read',
		description: 'List task groups. Token scope: vso.taskgroups_read.',
	},
	'distributedTask.taskgroups.update': {
		riskLevel: 'write',
		description: 'Update a task group. Token scope: vso.taskgroups_manage.',
	},
	'distributedTask.variablegroups.add': {
		riskLevel: 'destructive',
		description:
			'Add a variable group. Token scope: vso.variablegroups_manage.',
	},
	'distributedTask.variablegroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a variable group. Token scope: vso.variablegroups_manage. Cannot be undone.',
	},
	'distributedTask.variablegroups.get': {
		riskLevel: 'read',
		description: 'Get a variable group. Token scope: vso.variablegroups_read.',
	},
	'distributedTask.variablegroups.getVariableGroups': {
		riskLevel: 'read',
		description: 'Get variable groups. Token scope: vso.variablegroups_read.',
	},
	'distributedTask.variablegroups.getVariableGroupsById': {
		riskLevel: 'read',
		description:
			'Get variable groups by ids. Token scope: vso.variablegroups_read.',
	},
	'distributedTask.variablegroups.shareVariableGroup': {
		riskLevel: 'write',
		description:
			'Add a variable group. Token scope: vso.variablegroups_manage.',
	},
	'distributedTask.variablegroups.update': {
		riskLevel: 'destructive',
		description:
			'Update a variable group. Token scope: vso.variablegroups_manage.',
	},
	'distributedTask.yamlschema.get': {
		riskLevel: 'read',
		description:
			'GET the Yaml schema used for Yaml file validation. Token scope: vso.agentpools.',
	},
	'extensionManagement.installedExtensions.get': {
		riskLevel: 'read',
		description:
			'Get an installed extension by its publisher and extension name. Preview API (api-version 7.1-preview.1). Token scope: vso.extension_manage.',
	},
	'extensionManagement.installedExtensions.installExtensionByName': {
		riskLevel: 'destructive',
		description:
			'Install the specified extension into the account / project collection. Preview API (api-version 7.1-preview.1). Token scope: vso.extension_manage.',
	},
	'extensionManagement.installedExtensions.list': {
		riskLevel: 'read',
		description:
			'List the installed extensions in the account / project collection. Preview API (api-version 7.1-preview.1). Token scope: vso.extension.',
	},
	'extensionManagement.installedExtensions.uninstallExtensionByName': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Uninstall the specified extension from the account / project collection. Preview API (api-version 7.1-preview.1). Token scope: vso.extension_manage. Cannot be undone.',
	},
	'extensionManagement.installedExtensions.update': {
		riskLevel: 'destructive',
		description:
			'Update an installed extension. Typically this API is used to enable or disable an extension. Preview API (api-version 7.1-preview.1). Token scope: vso.extension_manage.',
	},
	'favorite.favorites.createFavorite': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile_write.',
	},
	'favorite.favorites.createFavoriteOfOwner': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile_write.',
	},
	'favorite.favorites.deleteFavoriteById': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile_write. Cannot be undone.',
	},
	'favorite.favorites.deleteFavoriteOfOwnerById': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile_write. Cannot be undone.',
	},
	'favorite.favorites.getFavoriteByArtifact': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile.',
	},
	'favorite.favorites.getFavoriteById': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile.',
	},
	'favorite.favorites.getFavoriteOfOwnerById': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile.',
	},
	'favorite.favorites.getFavorites': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile.',
	},
	'favorite.favorites.getFavoritesOfOwner': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.profile.',
	},
	'git.annotatedTags.create': {
		riskLevel: 'write',
		description:
			"Create an annotated tag. Repositories have both a name and an identifier. Identifiers are globally unique, but several projects may contain a repository of the same name. You don't need to include the project if you specify a repository by ID. Token scope: vso.code_manage.",
	},
	'git.annotatedTags.get': {
		riskLevel: 'read',
		description:
			"Get an annotated tag. Repositories have both a name and an identifier. Identifiers are globally unique, but several projects may contain a repository of the same name. You don't need to include the project if you specify a repository by ID. Token scope: vso.code.",
	},
	'git.blobs.getBlob': {
		riskLevel: 'read',
		description:
			"Get a single blob. Repositories have both a name and an identifier. Identifiers are globally unique, but several projects may contain a repository of the same name. You don't need to include the project if you specify a repository by ID. Token scope: vso.code.",
	},
	'git.blobs.getBlobsZip': {
		riskLevel: 'read',
		description:
			'Gets one or more blobs in a zip file download. Token scope: vso.code.',
	},
	'git.cherryPicks.create': {
		riskLevel: 'write',
		description:
			'Cherry pick a specific commit or commits that are associated to a pull request into a new branch. Token scope: vso.code_manage.',
	},
	'git.cherryPicks.getCherryPick': {
		riskLevel: 'read',
		description:
			'Retrieve information about a cherry pick operation by cherry pick Id. Token scope: vso.code.',
	},
	'git.cherryPicks.getCherryPickForRefName': {
		riskLevel: 'read',
		description:
			'Retrieve information about a cherry pick operation for a specific branch. This operation is expensive due to the underlying object structure, so this API only looks at the 1000 most recent cherry pick operations. Token scope: vso.code.',
	},
	'git.commits.get': {
		riskLevel: 'read',
		description: 'Retrieve a particular commit. Token scope: vso.code.',
	},
	'git.commits.getChanges': {
		riskLevel: 'read',
		description:
			'Retrieve changes for a particular commit. Token scope: vso.code.',
	},
	'git.commits.getCommits': {
		riskLevel: 'read',
		description:
			'Retrieve git commits for a project Parameters that use the searchCriteria prefix in their name can be specified without it as query parameters, e.g. searchCriteria.$top -> $top. Token scope: vso.code.',
	},
	'git.commits.getCommitsBatch': {
		riskLevel: 'read',
		description:
			'Retrieve git commits for a project matching the search criteria. Token scope: vso.code.',
	},
	'git.commits.getPushCommits': {
		riskLevel: 'read',
		description:
			'Retrieve a list of commits associated with a particular push. Token scope: vso.code.',
	},
	'git.diffs.get': {
		riskLevel: 'read',
		description:
			'Find the closest common commit (the merge base) between base and target commits, and get the diff between either the base and target commits or common and target commits. Token scope: vso.code.',
	},
	'git.forks.createForkSyncRequest': {
		riskLevel: 'write',
		description:
			"Request that another repository's refs be fetched into this one. It syncs two existing forks. To create a fork, please see the repositories endpoint. Token scope: vso.code_write.",
	},
	'git.forks.getForkSyncRequest': {
		riskLevel: 'read',
		description:
			"Get a specific fork sync operation's details. Token scope: vso.code.",
	},
	'git.forks.getForkSyncRequests': {
		riskLevel: 'read',
		description:
			'Retrieve all requested fork sync operations on this repository. Token scope: vso.code.',
	},
	'git.forks.list': {
		riskLevel: 'read',
		description:
			'Retrieve all forks of a repository in the collection. Token scope: vso.code.',
	},
	'git.importRequests.create': {
		riskLevel: 'write',
		description: 'Create an import request. Token scope: vso.code_manage.',
	},
	'git.importRequests.get': {
		riskLevel: 'read',
		description: 'Retrieve a particular import request. Token scope: vso.code.',
	},
	'git.importRequests.query': {
		riskLevel: 'read',
		description:
			'Retrieve import requests for a repository. Token scope: vso.code.',
	},
	'git.importRequests.update': {
		riskLevel: 'write',
		description:
			'Retry or abandon a failed import request. There can only be one active import request associated with a repository. Marking a failed import request abandoned makes it inactive. Token scope: vso.code_manage.',
	},
	'git.items.get': {
		riskLevel: 'read',
		description:
			"Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content, which is always returned as a download. Token scope: vso.code.",
	},
	'git.items.getItemsBatch': {
		riskLevel: 'read',
		description:
			'Retrieves a batch of items in a repo / project for a given list of paths or a long path. Token scope: vso.code.',
	},
	'git.items.list': {
		riskLevel: 'read',
		description:
			"Get Item Metadata and/or Content for a collection of items. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download. Token scope: vso.code.",
	},
	'git.mergeBases.list': {
		riskLevel: 'read',
		description:
			'Find the merge bases of two commits, optionally across forks. If otherRepositoryId is not specified, the merge bases will only be calculated within the context of the local repositoryNameOrId. Token scope: vso.code.',
	},
	'git.merges.create': {
		riskLevel: 'write',
		description:
			'Request a git merge operation. Currently we support merging only 2 commits. Token scope: vso.code_manage.',
	},
	'git.merges.get': {
		riskLevel: 'read',
		description:
			"Get a specific merge operation's details. Token scope: vso.code.",
	},
	'git.policyConfigurations.get': {
		riskLevel: 'read',
		description:
			'Retrieve a list of policy configurations by a given set of scope/filtering criteria. Token scope: vso.code.',
	},
	'git.pullRequestAttachments.create': {
		riskLevel: 'write',
		description:
			'Attach a new file to a pull request. Token scope: vso.code_write.',
	},
	'git.pullRequestAttachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a pull request attachment. Token scope: vso.code_write. Cannot be undone.',
	},
	'git.pullRequestAttachments.get': {
		riskLevel: 'read',
		description:
			'Get the file content of a pull request attachment. Token scope: vso.code.',
	},
	'git.pullRequestAttachments.list': {
		riskLevel: 'read',
		description:
			'Get a list of files attached to a given pull request. Token scope: vso.code.',
	},
	'git.pullRequestCommentLikes.create': {
		riskLevel: 'write',
		description:
			'Add a like on a comment. Token scope: vso.code_write, vso.threads_full.',
	},
	'git.pullRequestCommentLikes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a like on a comment. Token scope: vso.code_write, vso.threads_full. Cannot be undone.',
	},
	'git.pullRequestCommentLikes.list': {
		riskLevel: 'read',
		description:
			'Get likes for a comment. Token scope: vso.code, vso.threads_full.',
	},
	'git.pullRequestCommits.getPullRequestCommits': {
		riskLevel: 'read',
		description:
			'Get the commits for the specified pull request. Token scope: vso.code.',
	},
	'git.pullRequestCommits.getPullRequestIterationCommits': {
		riskLevel: 'read',
		description:
			'Get the commits for the specified iteration of a pull request. Token scope: vso.code.',
	},
	'git.pullRequestIterationChanges.get': {
		riskLevel: 'read',
		description:
			'Retrieve the changes made in a pull request between two iterations. Token scope: vso.code.',
	},
	'git.pullRequestIterationStatuses.create': {
		riskLevel: 'write',
		description:
			'Create a pull request status on the iteration. This operation will have the same result as Create status on pull request with specified iteration ID in the request body. The only required field for the status is Context.Name that uniquely identifies the status. Token scope: vso.code_status, vso.code_write.',
	},
	'git.pullRequestIterationStatuses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete pull request iteration status. You can remove multiple statuses in one call by using Update operation. Token scope: vso.code_status, vso.code_write. Cannot be undone.',
	},
	'git.pullRequestIterationStatuses.get': {
		riskLevel: 'read',
		description:
			'Get the specific pull request iteration status by ID. The status ID is unique within the pull request across all iterations. Token scope: vso.code, vso.code_status.',
	},
	'git.pullRequestIterationStatuses.list': {
		riskLevel: 'read',
		description:
			'Get all the statuses associated with a pull request iteration. Token scope: vso.code, vso.code_status.',
	},
	'git.pullRequestIterationStatuses.update': {
		riskLevel: 'write',
		description:
			'Update pull request iteration statuses collection. The only supported operation type is remove. This operation allows to delete multiple statuses in one call. The path of the remove operation should refer to the ID of the pull request status. Token scope: vso.code_status, vso.code_write.',
	},
	'git.pullRequestIterations.get': {
		riskLevel: 'read',
		description:
			'Get the specified iteration for a pull request. Token scope: vso.code.',
	},
	'git.pullRequestIterations.list': {
		riskLevel: 'read',
		description:
			'Get the list of iterations for the specified pull request. Token scope: vso.code.',
	},
	'git.pullRequestLabels.create': {
		riskLevel: 'write',
		description:
			'Create a tag (if that does not exists yet) and add that as a label (tag) for a specified pull request. The only required field is the name of the new label (tag). Token scope: vso.code_write.',
	},
	'git.pullRequestLabels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a label (tag) from the set of those assigned to the pull request. The tag itself will not be deleted. Token scope: vso.code_write. Cannot be undone.',
	},
	'git.pullRequestLabels.get': {
		riskLevel: 'read',
		description:
			'Retrieves a single label (tag) that has been assigned to a pull request. Token scope: vso.code.',
	},
	'git.pullRequestLabels.list': {
		riskLevel: 'read',
		description:
			'Get all the labels (tags) assigned to a pull request. Token scope: vso.code.',
	},
	'git.pullRequestProperties.list': {
		riskLevel: 'read',
		description:
			'Get external properties of the pull request. Token scope: vso.code.',
	},
	'git.pullRequestProperties.update': {
		riskLevel: 'write',
		description:
			'Create or update pull request external properties. The patch operation can be add, replace or remove. For add operation, the path can be empty. If the path is empty, the value must be a list of key value pairs. For replace operation, the path cannot be empty. Token scope: vso.code_write.',
	},
	'git.pullRequestQuery.get': {
		riskLevel: 'read',
		description:
			'This API is used to find what pull requests are related to a given commit. It can be used to either find the pull request that created a particular merge commit or it can be used to find all pull requests that have ever merged a particular commit. Token scope: vso.code.',
	},
	'git.pullRequestReviewers.createPullRequestReviewer': {
		riskLevel: 'write',
		description:
			'Add a reviewer to a pull request or cast a vote. Token scope: vso.code_write.',
	},
	'git.pullRequestReviewers.createPullRequestReviewers': {
		riskLevel: 'write',
		description:
			'Add reviewers to a pull request. Token scope: vso.code_write.',
	},
	'git.pullRequestReviewers.createUnmaterializedPullRequestReviewer': {
		riskLevel: 'write',
		description:
			'Add an unmaterialized identity to the reviewers of a pull request. Token scope: vso.code_write.',
	},
	'git.pullRequestReviewers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a reviewer from a pull request. Token scope: vso.code_write. Cannot be undone.',
	},
	'git.pullRequestReviewers.get': {
		riskLevel: 'read',
		description:
			'Retrieve information about a particular reviewer on a pull request. Token scope: vso.code.',
	},
	'git.pullRequestReviewers.list': {
		riskLevel: 'read',
		description:
			'Retrieve the reviewers for a pull request. Token scope: vso.code.',
	},
	'git.pullRequestReviewers.updatePullRequestReviewer': {
		riskLevel: 'write',
		description:
			'Edit a reviewer entry. These fields are patchable: isFlagged, hasDeclined. Token scope: vso.code_write.',
	},
	'git.pullRequestReviewers.updatePullRequestReviewers': {
		riskLevel: 'write',
		description:
			'Reset the votes of multiple reviewers on a pull request. NOTE: This endpoint only supports updating votes, but does not support updating required reviewers (use policy) or display names. Token scope: vso.code_write.',
	},
	'git.pullRequestShare.sharePullRequest': {
		riskLevel: 'write',
		description:
			'Sends an e-mail notification about a specific pull request to a set of recipients. Token scope: vso.code_write.',
	},
	'git.pullRequestStatuses.create': {
		riskLevel: 'write',
		description:
			'Create a pull request status. The only required field for the status is Context.Name that uniquely identifies the status. Note that you can specify iterationId in the request body to post the status on the iteration. Token scope: vso.code_status, vso.code_write.',
	},
	'git.pullRequestStatuses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete pull request status. You can remove multiple statuses in one call by using Update operation. Token scope: vso.code_status, vso.code_write. Cannot be undone.',
	},
	'git.pullRequestStatuses.get': {
		riskLevel: 'read',
		description:
			'Get the specific pull request status by ID. The status ID is unique within the pull request across all iterations. Token scope: vso.code, vso.code_status.',
	},
	'git.pullRequestStatuses.list': {
		riskLevel: 'read',
		description:
			'Get all the statuses associated with a pull request. Token scope: vso.code, vso.code_status.',
	},
	'git.pullRequestStatuses.update': {
		riskLevel: 'write',
		description:
			'Update pull request statuses collection. The only supported operation type is remove. This operation allows to delete multiple statuses in one call. The path of the remove operation should refer to the ID of the pull request status. For example path="/1" refers to the pull request status with ID 1. Token scope: vso.code_status, vso.code_write.',
	},
	'git.pullRequestThreadComments.create': {
		riskLevel: 'write',
		description:
			'Create a comment on a specific thread in a pull request (up to 500 comments can be created per thread). Token scope: vso.code_write, vso.threads_full.',
	},
	'git.pullRequestThreadComments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a comment associated with a specific thread in a pull request. Token scope: vso.code_write, vso.threads_full. Cannot be undone.',
	},
	'git.pullRequestThreadComments.get': {
		riskLevel: 'read',
		description:
			'Retrieve a comment associated with a specific thread in a pull request. Token scope: vso.code, vso.threads_full.',
	},
	'git.pullRequestThreadComments.list': {
		riskLevel: 'read',
		description:
			'Retrieve all comments associated with a specific thread in a pull request. Token scope: vso.code, vso.threads_full.',
	},
	'git.pullRequestThreadComments.update': {
		riskLevel: 'write',
		description:
			'Update a comment associated with a specific thread in a pull request. Token scope: vso.code_write, vso.threads_full.',
	},
	'git.pullRequestThreads.create': {
		riskLevel: 'write',
		description:
			'Create a thread in a pull request. Token scope: vso.code_write, vso.threads_full.',
	},
	'git.pullRequestThreads.get': {
		riskLevel: 'read',
		description:
			'Retrieve a thread in a pull request. Token scope: vso.code, vso.threads_full.',
	},
	'git.pullRequestThreads.list': {
		riskLevel: 'read',
		description:
			'Retrieve all threads in a pull request. Token scope: vso.code, vso.threads_full.',
	},
	'git.pullRequestThreads.update': {
		riskLevel: 'write',
		description:
			'Update a thread in a pull request. Token scope: vso.code_write, vso.threads_full.',
	},
	'git.pullRequestWorkItems.list': {
		riskLevel: 'read',
		description:
			'Retrieve a list of work items associated with a pull request. Token scope: vso.code.',
	},
	'git.pullRequests.create': {
		riskLevel: 'write',
		description: 'Create a pull request. Token scope: vso.code_write.',
	},
	'git.pullRequests.getPullRequest': {
		riskLevel: 'read',
		description: 'Retrieve a pull request. Token scope: vso.code.',
	},
	'git.pullRequests.getPullRequestById': {
		riskLevel: 'read',
		description: 'Retrieve a pull request. Token scope: vso.code.',
	},
	'git.pullRequests.getPullRequests': {
		riskLevel: 'read',
		description:
			'Retrieve all pull requests matching a specified criteria. Please note that description field will be truncated up to 400 symbols in the result. Token scope: vso.code.',
	},
	'git.pullRequests.getPullRequestsByProject': {
		riskLevel: 'read',
		description:
			'Retrieve all pull requests matching a specified criteria. Please note that description field will be truncated up to 400 symbols in the result. Token scope: vso.code.',
	},
	'git.pullRequests.update': {
		riskLevel: 'destructive',
		description:
			'Update a pull request These are the properties that can be updated with the API: - Status - Title - Description (up to 4000 characters) - CompletionOptions - MergeOptions - AutoCompleteSetBy.Id - TargetRefName (when the PR retargeting feature is enabled) Attempting to update other properties… Setting status to completed merges the pull request. Token scope: vso.code_write.',
	},
	'git.pushes.create': {
		riskLevel: 'destructive',
		description: 'Push changes to the repository. Token scope: vso.code_write.',
	},
	'git.pushes.get': {
		riskLevel: 'read',
		description: 'Retrieves a particular push. Token scope: vso.code.',
	},
	'git.pushes.list': {
		riskLevel: 'read',
		description:
			'Retrieves pushes associated with the specified repository. Token scope: vso.code.',
	},
	'git.refs.list': {
		riskLevel: 'read',
		description:
			'Queries the provided repository for its refs and returns them. Token scope: vso.code.',
	},
	'git.refs.updateRef': {
		riskLevel: 'write',
		description: 'Lock or Unlock a branch. Token scope: vso.code_write.',
	},
	'git.refs.updateRefs': {
		riskLevel: 'write',
		description:
			'Creating, updating, or deleting refs(branches). Updating a ref means making it point at a different commit than it used to. You must specify both the old and new commit to avoid race conditions. Token scope: vso.code_write.',
	},
	'git.refsFavorites.create': {
		riskLevel: 'write',
		description: 'Creates a ref favorite. Token scope: vso.code.',
	},
	'git.refsFavorites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the refs favorite specified. Token scope: vso.code. Cannot be undone.',
	},
	'git.refsFavorites.get': {
		riskLevel: 'read',
		description:
			'Gets the refs favorite for a favorite Id. Token scope: vso.code.',
	},
	'git.refsFavorites.list': {
		riskLevel: 'read',
		description:
			'Gets the refs favorites for a repo and an identity. Token scope: vso.code.',
	},
	'git.repositories.create': {
		riskLevel: 'write',
		description:
			'Create a git repository in a team project. Token scope: vso.code_manage.',
	},
	'git.repositories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a git repository. Token scope: vso.code_manage. Cannot be undone.',
	},
	'git.repositories.deleteRepositoryFromRecycleBin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Destroy (hard delete) a soft-deleted Git repository. Token scope: vso.code_manage. Cannot be undone.',
	},
	'git.repositories.getDeletedRepositories': {
		riskLevel: 'read',
		description: 'Retrieve deleted git repositories. Token scope: vso.code.',
	},
	'git.repositories.getRecycleBinRepositories': {
		riskLevel: 'read',
		description:
			'Retrieve soft-deleted git repositories from the recycle bin. Token scope: vso.code.',
	},
	'git.repositories.getRepository': {
		riskLevel: 'read',
		description: 'Retrieve a git repository. Token scope: vso.code.',
	},
	'git.repositories.getRepositoryWithParent': {
		riskLevel: 'read',
		description: 'Retrieve a git repository. Token scope: vso.code.',
	},
	'git.repositories.list': {
		riskLevel: 'read',
		description: 'Retrieve git repositories. Token scope: vso.code.',
	},
	'git.repositories.restoreRepositoryFromRecycleBin': {
		riskLevel: 'destructive',
		description:
			'Recover a soft-deleted Git repository. Recently deleted repositories go into a soft-delete state for a period of time before they are hard deleted and become unrecoverable. Token scope: vso.code_manage.',
	},
	'git.repositories.update': {
		riskLevel: 'write',
		description:
			'Updates the Git repository with either a new repo name or a new default branch. Token scope: vso.code_manage.',
	},
	'git.reverts.create': {
		riskLevel: 'write',
		description:
			'Starts the operation to create a new branch which reverts changes introduced by either a specific commit or commits that are associated to a pull request. Token scope: vso.code_manage.',
	},
	'git.reverts.getRevert': {
		riskLevel: 'read',
		description:
			'Retrieve information about a revert operation by revert Id. Token scope: vso.code.',
	},
	'git.reverts.getRevertForRefName': {
		riskLevel: 'read',
		description:
			'Retrieve information about a revert operation for a specific branch. Token scope: vso.code.',
	},
	'git.stats.get': {
		riskLevel: 'read',
		description:
			'Retrieve statistics about a single branch. Token scope: vso.code.',
	},
	'git.stats.list': {
		riskLevel: 'read',
		description:
			'Retrieve statistics about all branches within a repository. Token scope: vso.code.',
	},
	'git.statuses.create': {
		riskLevel: 'write',
		description:
			'Create Git commit status. Token scope: vso.code_status, vso.code_write.',
	},
	'git.statuses.list': {
		riskLevel: 'read',
		description:
			'Get statuses associated with the Git commit. Token scope: vso.code, vso.code_status.',
	},
	'git.suggestions.list': {
		riskLevel: 'read',
		description:
			'Retrieve a pull request suggestion for a particular repository or team project. Token scope: vso.code.',
	},
	'git.trees.get': {
		riskLevel: 'read',
		description:
			'The Tree endpoint returns the collection of objects underneath the specified tree. Trees are folders in a Git repository. Repositories have both a name and an identifier. Identifiers are globally unique, but several projects may contain a repository of the same name. Token scope: vso.code.',
	},
	'graph.avatars.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Token scope: vso.graph_manage. Cannot be undone.',
	},
	'graph.avatars.get': {
		riskLevel: 'read',
		description:
			'Token scope: vso.graph. (GET /_apis/graph/Subjects/{subjectDescriptor}/avatars)',
	},
	'graph.avatars.setAvatar': {
		riskLevel: 'destructive',
		description:
			'Token scope: vso.graph_manage. (PUT /_apis/graph/Subjects/{subjectDescriptor}/avatars)',
	},
	'graph.descriptors.get': {
		riskLevel: 'read',
		description:
			'Resolve a storage key to a descriptor. Token scope: vso.graph.',
	},
	'graph.groups.create': {
		riskLevel: 'destructive',
		description:
			'Create a new Azure DevOps group or materialize an existing AAD group. The body of the request must be a derived type of GraphGroupCreationContext: * GraphGroupVstsCreationContext - Create a new Azure DevOps group that is not backed by an external provider. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage.',
	},
	'graph.groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes an Azure DevOps group from all of its parent groups. The group will still be visible, but membership checks for the group, and all descendants which derive membership through it, will return false.”. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage. Cannot be undone.',
	},
	'graph.groups.get': {
		riskLevel: 'read',
		description:
			'Get a group by its descriptor. The group will be returned even if it has been deleted from the account or has had all its memberships deleted. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.groups.list': {
		riskLevel: 'read',
		description:
			'Gets a list of all groups in the current scope (usually organization or account). The optional parameters are used to filter down the returned results. Returned results are in no guaranteed order. Since the list of groups may be large, results are returned in pages of groups. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.groups.update': {
		riskLevel: 'destructive',
		description:
			'Update the properties of an Azure DevOps group. Currently limited to only changing the description and account name. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage.',
	},
	'graph.membershipStates.get': {
		riskLevel: 'read',
		description:
			'Check whether a subject is active or inactive. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.memberships.add': {
		riskLevel: 'destructive',
		description:
			'Create a new membership between a container and subject. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage.',
	},
	'graph.memberships.get': {
		riskLevel: 'read',
		description:
			'Get a membership relationship between a container and subject. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.memberships.list': {
		riskLevel: 'read',
		description:
			"Get all the memberships where this descriptor is a member in the relationship. The default value for direction is 'up' meaning return all memberships where the subject is a member (e.g. all groups the subject is a member of). Preview API (api-version 7.1-preview.1). Token scope: vso.graph.",
	},
	'graph.memberships.removeMembership': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a membership between a container and subject. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage. Cannot be undone.',
	},
	'graph.providerInfo.get': {
		riskLevel: 'read',
		description:
			'Token scope: vso.graph. (GET /_apis/graph/Users/{userDescriptor}/providerinfo)',
	},
	'graph.requestAccess.requestAccess': {
		riskLevel: 'destructive',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.servicePrincipals.create': {
		riskLevel: 'destructive',
		description:
			'Materialize an existing AAD service principal into the ADO account. NOTE: Created service principals are not active in an account. Adding a service principal to an account is required before the service principal can be added to ADO groups or assigned an asset. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage.',
	},
	'graph.servicePrincipals.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disables a service principal. The service principal will still be visible, but membership checks for the service principal will return false. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage. Cannot be undone.',
	},
	'graph.servicePrincipals.get': {
		riskLevel: 'read',
		description:
			'Get a service principal by its descriptor. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.servicePrincipals.list': {
		riskLevel: 'read',
		description:
			'Get a list of all service principals in a given scope. Since the list of service principals may be large, results are returned in pages of service principals. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.storageKeys.get': {
		riskLevel: 'read',
		description:
			'Resolve a descriptor to a storage key. Token scope: vso.graph.',
	},
	'graph.subjectLookup.lookupSubjects': {
		riskLevel: 'destructive',
		description:
			'Resolve descriptors to users, groups or scopes (Subjects) in a batch. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.subjectQuery.query': {
		riskLevel: 'destructive',
		description:
			'Search for Azure Devops users, or/and groups. Results will be returned in a batch with no more than 100 graph subjects. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.users.create': {
		riskLevel: 'destructive',
		description:
			'Materialize an existing AAD or MSA user into the ADO account. NOTE: Created users are not active in an account unless they have been explicitly assigned a parent group at creation time or have signed in and been autolicensed through AAD group memberships. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage.',
	},
	'graph.users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disables a user. The user will still be visible, but membership checks for the user will return false. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage. Cannot be undone.',
	},
	'graph.users.get': {
		riskLevel: 'read',
		description:
			'Get a user by its descriptor. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.users.list': {
		riskLevel: 'read',
		description:
			'Get a list of all users in a given scope. Since the list of users may be large, results are returned in pages of users. If there are more results than can be returned in a single page, the result set will contain a continuation token for retrieval of the next set of results. Preview API (api-version 7.1-preview.1). Token scope: vso.graph.',
	},
	'graph.users.update': {
		riskLevel: 'destructive',
		description:
			'Map an existing user to a different user. The body of the request must be a derived type of GraphUserUpdateContext: * GraphUserOriginIdUpdateContext - Map an existing user in an account, to an existing user from an external AD or AAD backed provider using the OriginId as a reference. Preview API (api-version 7.1-preview.1). Token scope: vso.graph_manage.',
	},
	'hooks.consumers.get': {
		riskLevel: 'read',
		description:
			'Get a specific consumer service. Optionally filter out consumer actions that do not support any event types for the specified publisher. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.consumers.getConsumerAction': {
		riskLevel: 'read',
		description:
			'Get details about a specific consumer action. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.consumers.list': {
		riskLevel: 'read',
		description:
			'Get a list of available service hook consumer services. Optionally filter by consumers that support at least one event type from the specific publisher. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.consumers.listConsumerActions': {
		riskLevel: 'read',
		description:
			'Get a list of consumer actions for a specific consumer. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.diagnostics.get': {
		riskLevel: 'read',
		description: 'Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.diagnostics.update': {
		riskLevel: 'write',
		description: 'Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.notifications.create': {
		riskLevel: 'write',
		description:
			'Sends a test notification. This is useful for verifying the configuration of an updated or new service hooks subscription. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.notifications.get': {
		riskLevel: 'read',
		description:
			'Get a specific notification for a subscription. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.notifications.list': {
		riskLevel: 'read',
		description:
			'Get a list of notifications for a specific subscription. A notification includes details about the event, the request to and the response from the consumer service. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.notifications.query': {
		riskLevel: 'read',
		description:
			'Query for notifications. A notification includes details about the event, the request to and the response from the consumer service. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.publishers.get': {
		riskLevel: 'read',
		description:
			'Get a specific service hooks publisher. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.publishers.getEventType': {
		riskLevel: 'read',
		description:
			'Get a specific event type. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.publishers.list': {
		riskLevel: 'read',
		description:
			'Get a list of publishers. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.publishers.listEventTypes': {
		riskLevel: 'read',
		description:
			'Get the event types for a specific publisher. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.publishers.queryInputValues': {
		riskLevel: 'read',
		description:
			'(POST /_apis/hooks/publishers/{publisherId}/inputValuesQuery)',
	},
	'hooks.publishers.queryPublishers': {
		riskLevel: 'read',
		description:
			'Query for service hook publishers. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.subscriptions.create': {
		riskLevel: 'destructive',
		description:
			'Create a subscription. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.subscriptions.createSubscriptionsQuery': {
		riskLevel: 'write',
		description:
			'Query for service hook subscriptions. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a specific service hooks subscription. Token scope: vso.build, vso.code, vso.work. Cannot be undone.',
	},
	'hooks.subscriptions.get': {
		riskLevel: 'read',
		description:
			'Get a specific service hooks subscription. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.subscriptions.list': {
		riskLevel: 'read',
		description:
			'Get a list of subscriptions. Token scope: vso.build, vso.code, vso.work.',
	},
	'hooks.subscriptions.replaceSubscription': {
		riskLevel: 'destructive',
		description:
			'Update a subscription. ID for a subscription that you wish to update. Token scope: vso.build, vso.code, vso.work.',
	},
	'ims.identities.readIdentities': {
		riskLevel: 'read',
		description:
			'Resolve legacy identity information for use with older APIs such as the Security APIs. Token scope: vso.identity.',
	},
	'memberEntitlementManagement.groupEntitlements.add': {
		riskLevel: 'destructive',
		description:
			'Create a group entitlement with license rule, extension rule. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write.',
	},
	'memberEntitlementManagement.groupEntitlements.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a group entitlement. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write. Cannot be undone.',
	},
	'memberEntitlementManagement.groupEntitlements.get': {
		riskLevel: 'read',
		description:
			'Get a group entitlement. If the group entitlement does not exist, returns null. Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.groupEntitlements.list': {
		riskLevel: 'read',
		description:
			'Get the group entitlements for an account. Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.groupEntitlements.update': {
		riskLevel: 'destructive',
		description:
			'Update entitlements (License Rule, Extensions Rule, Project memberships etc.) for a group. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write.',
	},
	'memberEntitlementManagement.memberEntitlements.searchMemberEntitlements': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.members.add': {
		riskLevel: 'destructive',
		description:
			'Add a member to a Group. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write.',
	},
	'memberEntitlementManagement.members.get': {
		riskLevel: 'read',
		description:
			'Get direct members of a Group. Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.members.removeMemberFromGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a member from a Group. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write. Cannot be undone.',
	},
	'memberEntitlementManagement.servicePrincipalEntitlements.add': {
		riskLevel: 'destructive',
		description:
			'Add a service principal, assign license and extensions and make them a member of a project group in an account. Adding users or changing their access level can add paid licences to the organization. Preview API (api-version 7.1-preview.1). Token scope: vso.memberentitlementmanagement_write.',
	},
	'memberEntitlementManagement.servicePrincipalEntitlements.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a service principal from the account. The delete operation includes unassigning Extensions and Licenses and removing the service principal from all project memberships. Adding users or changing their access level can add paid licences to the organization. Preview API (api-version 7.1-preview.1). Token scope: vso.memberentitlementmanagement_write. Cannot be undone.',
	},
	'memberEntitlementManagement.servicePrincipalEntitlements.get': {
		riskLevel: 'read',
		description:
			'Get Service principal Entitlement for a service principal. Preview API (api-version 7.1-preview.1). Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlement':
		{
			riskLevel: 'destructive',
			description:
				'Edit the entitlements (License, Extensions, Projects, Teams etc) for a service principal. Adding users or changing their access level can add paid licences to the organization. Preview API (api-version 7.1-preview.1). Token scope: vso.memberentitlementmanagement_write.',
		},
	'memberEntitlementManagement.servicePrincipalEntitlements.updateServicePrincipalEntitlements':
		{
			riskLevel: 'destructive',
			description:
				'Edit the entitlements (License, Extensions, Projects, Teams etc) for one or more service principals. Adding users or changing their access level can add paid licences to the organization. Preview API (api-version 7.1-preview.1). Token scope: vso.memberentitlementmanagement_write.',
		},
	'memberEntitlementManagement.userEntitlementSummary.get': {
		riskLevel: 'read',
		description:
			'Get summary of Licenses, Extension, Projects, Groups and their assignments in the collection. Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.userEntitlements.add': {
		riskLevel: 'destructive',
		description:
			'Add a user, assign license and extensions and make them a member of a project group in an account. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write.',
	},
	'memberEntitlementManagement.userEntitlements.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user from the account. The delete operation includes unassigning Extensions and Licenses and removing the user from all project memberships. The user would continue to have access to the account if she is member of an AAD group, that is added directly to the account. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write. Cannot be undone.',
	},
	'memberEntitlementManagement.userEntitlements.get': {
		riskLevel: 'read',
		description:
			'Get User Entitlement for a user. Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.userEntitlements.searchUserEntitlements': {
		riskLevel: 'read',
		description:
			'Get a paged set of user entitlements matching the filter and sort criteria built with properties that match the select input. Token scope: vso.memberentitlementmanagement.',
	},
	'memberEntitlementManagement.userEntitlements.updateUserEntitlement': {
		riskLevel: 'destructive',
		description:
			'Edit the entitlements (License, Extensions, Projects, Teams etc) for a user. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write.',
	},
	'memberEntitlementManagement.userEntitlements.updateUserEntitlements': {
		riskLevel: 'destructive',
		description:
			'Edit the entitlements (License, Extensions, Projects, Teams etc) for one or more users. Adding users or changing their access level can add paid licences to the organization. Token scope: vso.memberentitlementmanagement_write.',
	},
	'notification.diagnosticLogs.list': {
		riskLevel: 'read',
		description:
			'Get a list of diagnostic logs for this service. Token scope: vso.notification_diagnostics.',
	},
	'notification.diagnostics.get': {
		riskLevel: 'read',
		description:
			'Get the diagnostics settings for a subscription. Token scope: vso.notification.',
	},
	'notification.diagnostics.update': {
		riskLevel: 'write',
		description:
			'Update the diagnostics settings for a subscription. Token scope: vso.notification_diagnostics, vso.notification_write.',
	},
	'notification.eventTypes.get': {
		riskLevel: 'read',
		description: 'Get a specific event type. Token scope: vso.notification.',
	},
	'notification.eventTypes.list': {
		riskLevel: 'read',
		description:
			'List available event types for this service. Optionally filter by only event types for the specified publisher. Token scope: vso.notification.',
	},
	'notification.settings.get': {
		riskLevel: 'read',
		description:
			'Token scope: vso.notification. (GET /_apis/notification/settings)',
	},
	'notification.settings.update': {
		riskLevel: 'write',
		description:
			'Token scope: vso.notification_write. (PATCH /_apis/notification/settings)',
	},
	'notification.subscribers.get': {
		riskLevel: 'read',
		description:
			'Get delivery preferences of a notifications subscriber. Token scope: vso.notification.',
	},
	'notification.subscribers.update': {
		riskLevel: 'write',
		description:
			'Update delivery preferences of a notifications subscriber. Token scope: vso.notification_write.',
	},
	'notification.subscriptions.create': {
		riskLevel: 'write',
		description:
			'Create a new subscription. Token scope: vso.notification_write.',
	},
	'notification.subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a subscription. Token scope: vso.notification_write. Cannot be undone.',
	},
	'notification.subscriptions.get': {
		riskLevel: 'read',
		description:
			'Get a notification subscription by its ID. Token scope: vso.notification.',
	},
	'notification.subscriptions.getSubscriptionTemplates': {
		riskLevel: 'read',
		description:
			'Get available subscription templates. Token scope: vso.notification.',
	},
	'notification.subscriptions.list': {
		riskLevel: 'read',
		description:
			'Get a list of notification subscriptions, either by subscription IDs or by all subscriptions for a given user or group. Token scope: vso.notification.',
	},
	'notification.subscriptions.query': {
		riskLevel: 'read',
		description:
			'Query for subscriptions. A subscription is returned if it matches one or more of the specified conditions. Token scope: vso.notification.',
	},
	'notification.subscriptions.update': {
		riskLevel: 'write',
		description:
			'Update an existing subscription. Depending on the type of subscription and permissions, the caller can update the description, filter settings, channel (delivery) settings and more. Token scope: vso.notification_write.',
	},
	'notification.subscriptions.updateSubscriptionUserSettings': {
		riskLevel: 'write',
		description:
			"Update the specified user's settings for the specified subscription. This API is typically used to opt in or out of a shared subscription. User settings can only be applied to shared subscriptions, like team subscriptions or default subscriptions. Token scope: vso.notification_write.",
	},
	'operations.operations.get': {
		riskLevel: 'read',
		description:
			'Gets an operation from the operationId using the given pluginId. Some scenarios don’t require a pluginId. If a pluginId is not included in the call then just the operationId will be used to find an operation.',
	},
	'permissionsReport.permissionsReport.create': {
		riskLevel: 'write',
		description:
			'Request a permissions report to be created asyncronously. Token scope: vso.security_manage.',
	},
	'permissionsReport.permissionsReport.get': {
		riskLevel: 'read',
		description:
			'Get a specific permissions report. Token scope: vso.security_manage.',
	},
	'permissionsReport.permissionsReport.list': {
		riskLevel: 'read',
		description:
			'Get a list of permissions reports. Token scope: vso.security_manage.',
	},
	'permissionsReport.permissionsReportDownload.download': {
		riskLevel: 'read',
		description:
			'Download the json results of a permissions report. Token scope: vso.security_manage.',
	},
	'pipelines.artifacts.get': {
		riskLevel: 'read',
		description:
			'Get a specific artifact from a pipeline run. Token scope: vso.build.',
	},
	'pipelines.logs.get': {
		riskLevel: 'read',
		description:
			'Get a specific log from a pipeline run. Token scope: vso.build.',
	},
	'pipelines.logs.list': {
		riskLevel: 'read',
		description:
			'Get a list of logs from a pipeline run. Token scope: vso.build.',
	},
	'pipelines.pipelines.create': {
		riskLevel: 'write',
		description: 'Create a pipeline. Token scope: vso.build_execute.',
	},
	'pipelines.pipelines.get': {
		riskLevel: 'read',
		description:
			'Gets a pipeline, optionally at the specified version. Token scope: vso.build.',
	},
	'pipelines.pipelines.list': {
		riskLevel: 'read',
		description: 'Get a list of pipelines. Token scope: vso.build.',
	},
	'pipelines.preview.preview': {
		riskLevel: 'read',
		description:
			'Queues a dry run of the pipeline and returns an object containing the final yaml. Token scope: vso.build.',
	},
	'pipelines.runs.get': {
		riskLevel: 'read',
		description:
			'Gets a run for a particular pipeline. Token scope: vso.build.',
	},
	'pipelines.runs.list': {
		riskLevel: 'read',
		description:
			'Gets top 10000 runs for a particular pipeline. Token scope: vso.build.',
	},
	'pipelines.runs.runPipeline': {
		riskLevel: 'destructive',
		description:
			"Runs a pipeline. Starts a pipeline run: it uses the organization's pipeline minutes or a self-hosted agent. Token scope: vso.build_execute.",
	},
	'policy.configurations.create': {
		riskLevel: 'write',
		description:
			'Create a policy configuration of a given policy type. Token scope: vso.code_write.',
	},
	'policy.configurations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a policy configuration by its ID. Token scope: vso.code_write. Cannot be undone.',
	},
	'policy.configurations.get': {
		riskLevel: 'read',
		description: 'Get a policy configuration by its ID. Token scope: vso.code.',
	},
	'policy.configurations.list': {
		riskLevel: 'read',
		description:
			"Get a list of policy configurations in a project. The 'scope' parameter for this API should not be used, except for legacy compatability reasons. It returns specifically scoped policies and does not support heirarchical nesting. Token scope: vso.code.",
	},
	'policy.configurations.update': {
		riskLevel: 'write',
		description:
			'Update a policy configuration by its ID. Token scope: vso.code_write.',
	},
	'policy.evaluations.get': {
		riskLevel: 'read',
		description:
			'Gets the present evaluation state of a policy. Each policy which applies to a pull request will have an evaluation state which is specific to that policy running in the context of that pull request. Each evaluation is uniquely identified via a Guid. Preview API (api-version 7.1-preview.1). Token scope: vso.code.',
	},
	'policy.evaluations.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of all the policy evaluation statuses for a specific pull request. Evaluations are retrieved using an artifact ID which uniquely identifies the pull request. Preview API (api-version 7.1-preview.1). Token scope: vso.code.',
	},
	'policy.evaluations.requeuePolicyEvaluation': {
		riskLevel: 'write',
		description:
			'Requeue the policy evaluation. Some policies define a "requeue" action which performs some policy-specific operation. You can trigger this operation by updating an existing policy evaluation and setting the PolicyEvaluationRecord.Status field to Queued. Preview API (api-version 7.1-preview.1). Token scope: vso.code_write.',
	},
	'policy.revisions.get': {
		riskLevel: 'read',
		description:
			'Retrieve a specific revision of a given policy by ID. Token scope: vso.code.',
	},
	'policy.revisions.list': {
		riskLevel: 'read',
		description:
			'Retrieve all revisions for a given policy. Token scope: vso.code.',
	},
	'policy.types.get': {
		riskLevel: 'read',
		description:
			'Retrieve a specific policy type by ID. Token scope: vso.code.',
	},
	'policy.types.list': {
		riskLevel: 'read',
		description: 'Retrieve all available policy types. Token scope: vso.code.',
	},
	'processadmin.behaviors.get': {
		riskLevel: 'read',
		description: 'Returns a behavior for the process. Token scope: vso.work.',
	},
	'processadmin.behaviors.list': {
		riskLevel: 'read',
		description:
			'Returns a list of behaviors for the process. Token scope: vso.work.',
	},
	'processadmin.processes.exportProcessTemplate': {
		riskLevel: 'read',
		description: 'Returns requested process template. Token scope: vso.work.',
	},
	'processadmin.processes.importProcessTemplate': {
		riskLevel: 'write',
		description:
			'Imports a process from zip file. Token scope: vso.work_write.',
	},
	'processadmin.processes.importProcessTemplateStatus': {
		riskLevel: 'read',
		description:
			'Tells whether promote has completed for the specified promote job ID. Token scope: vso.work.',
	},
	'processes.behaviors.create': {
		riskLevel: 'write',
		description:
			'Creates a single behavior in the given process. Token scope: vso.work_write.',
	},
	'processes.behaviors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a behavior in the process. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.behaviors.get': {
		riskLevel: 'read',
		description: 'Returns a behavior of the process. Token scope: vso.work.',
	},
	'processes.behaviors.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all behaviors in the process. Token scope: vso.work.',
	},
	'processes.behaviors.update': {
		riskLevel: 'write',
		description:
			'Replaces a behavior in the process. Token scope: vso.work_write.',
	},
	'processes.controls.create': {
		riskLevel: 'write',
		description: 'Creates a control in a group. Token scope: vso.work_write.',
	},
	'processes.controls.moveControlToGroup': {
		riskLevel: 'write',
		description:
			'Moves a control to a specified group. Token scope: vso.work_write.',
	},
	'processes.controls.removeControlFromGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a control from the work item form. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.controls.update': {
		riskLevel: 'write',
		description:
			'Updates a control on the work item form. Token scope: vso.work_write.',
	},
	'processes.fields.add': {
		riskLevel: 'write',
		description:
			'Adds a field to a work item type. Token scope: vso.work_write.',
	},
	'processes.fields.get': {
		riskLevel: 'read',
		description: 'Returns a field in a work item type. Token scope: vso.work.',
	},
	'processes.fields.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all fields in a work item type. Token scope: vso.work.',
	},
	'processes.fields.removeWorkItemTypeField': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a field from a work item type. Does not permanently delete the field. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.fields.update': {
		riskLevel: 'write',
		description:
			'Updates a field in a work item type. Token scope: vso.work_write.',
	},
	'processes.groups.add': {
		riskLevel: 'write',
		description:
			'Adds a group to the work item form. Token scope: vso.work_write.',
	},
	'processes.groups.moveGroupToPage': {
		riskLevel: 'write',
		description:
			'Moves a group to a different page and section. Token scope: vso.work_write.',
	},
	'processes.groups.moveGroupToSection': {
		riskLevel: 'write',
		description:
			'Moves a group to a different section. Token scope: vso.work_write.',
	},
	'processes.groups.removeGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a group from the work item form. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.groups.update': {
		riskLevel: 'write',
		description:
			'Updates a group in the work item form. Token scope: vso.work_write.',
	},
	'processes.layout.get': {
		riskLevel: 'read',
		description: 'Gets the form layout. Token scope: vso.work.',
	},
	'processes.lists.create': {
		riskLevel: 'write',
		description: 'Creates a picklist. Token scope: vso.work_write.',
	},
	'processes.lists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a picklist. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.lists.get': {
		riskLevel: 'read',
		description: 'Returns a picklist. Token scope: vso.work.',
	},
	'processes.lists.list': {
		riskLevel: 'read',
		description: 'Returns meta data of the picklist. Token scope: vso.work.',
	},
	'processes.lists.update': {
		riskLevel: 'write',
		description: 'Updates a list. Token scope: vso.work_write.',
	},
	'processes.pages.add': {
		riskLevel: 'write',
		description:
			'Adds a page to the work item form. Token scope: vso.work_write.',
	},
	'processes.pages.removePage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a page from the work item form. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.pages.update': {
		riskLevel: 'write',
		description:
			'Updates a page on the work item form. Token scope: vso.work_write.',
	},
	'processes.processes.create': {
		riskLevel: 'write',
		description: 'Creates a process. Token scope: vso.work_write.',
	},
	'processes.processes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a process of a specific ID. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.processes.editProcess': {
		riskLevel: 'write',
		description:
			'Edit a process of a specific ID. Token scope: vso.work_write.',
	},
	'processes.processes.get': {
		riskLevel: 'read',
		description:
			'Get a single process of a specified ID. Token scope: vso.work.',
	},
	'processes.processes.list': {
		riskLevel: 'read',
		description:
			'Get list of all processes including system and inherited. Token scope: vso.work.',
	},
	'processes.rules.add': {
		riskLevel: 'write',
		description:
			'Adds a rule to work item type in the process. Token scope: vso.work_write.',
	},
	'processes.rules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a rule from the work item type in the process. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.rules.get': {
		riskLevel: 'read',
		description:
			'Returns a single rule in the work item type of the process. Token scope: vso.work.',
	},
	'processes.rules.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all rules in the work item type of the process. Token scope: vso.work.',
	},
	'processes.rules.update': {
		riskLevel: 'write',
		description:
			'Updates a rule in the work item type of the process. Token scope: vso.work_write.',
	},
	'processes.states.create': {
		riskLevel: 'write',
		description:
			'Creates a state definition in the work item type of the process. Token scope: vso.work_write.',
	},
	'processes.states.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a state definition in the work item type of the process. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.states.get': {
		riskLevel: 'read',
		description:
			'Returns a single state definition in a work item type of the process. Token scope: vso.work.',
	},
	'processes.states.hideStateDefinition': {
		riskLevel: 'write',
		description:
			'Hides a state definition in the work item type of the process.Only states with customizationType:System can be hidden. Token scope: vso.work_write.',
	},
	'processes.states.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all state definitions in a work item type of the process. Token scope: vso.work.',
	},
	'processes.states.update': {
		riskLevel: 'write',
		description:
			'Updates a given state definition in the work item type of the process. Token scope: vso.work_write.',
	},
	'processes.systemControls.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a system control modification on the work item form. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.systemControls.list': {
		riskLevel: 'read',
		description:
			'Gets edited system controls for a work item type in a process. To get all system controls (base + edited) use layout API(s) Token scope: vso.work.',
	},
	'processes.systemControls.update': {
		riskLevel: 'write',
		description:
			'Updates/adds a system control on the work item form. Token scope: vso.work_write.',
	},
	'processes.workItemTypes.create': {
		riskLevel: 'write',
		description:
			'Creates a work item type in the process. Token scope: vso.work_write.',
	},
	'processes.workItemTypes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a work item type in the process. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.workItemTypes.get': {
		riskLevel: 'read',
		description:
			'Returns a single work item type in a process. Token scope: vso.work.',
	},
	'processes.workItemTypes.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all work item types in a process. Token scope: vso.work.',
	},
	'processes.workItemTypes.update': {
		riskLevel: 'write',
		description:
			'Updates a work item type of the process. Token scope: vso.work_write.',
	},
	'processes.workItemTypesBehaviors.add': {
		riskLevel: 'write',
		description:
			'Adds a behavior to the work item type of the process. Token scope: vso.work_write.',
	},
	'processes.workItemTypesBehaviors.get': {
		riskLevel: 'read',
		description:
			'Returns a behavior for the work item type of the process. Token scope: vso.work.',
	},
	'processes.workItemTypesBehaviors.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all behaviors for the work item type of the process. Token scope: vso.work.',
	},
	'processes.workItemTypesBehaviors.removeBehaviorFromWorkItemType': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a behavior for the work item type of the process. Token scope: vso.work_write. Cannot be undone.',
	},
	'processes.workItemTypesBehaviors.update': {
		riskLevel: 'write',
		description:
			'Updates a behavior for the work item type of the process. Token scope: vso.work_write.',
	},
	'profile.profiles.get': {
		riskLevel: 'read',
		description: 'Gets a user profile. Token scope: vso.profile.',
	},
	'release.approvals.list': {
		riskLevel: 'read',
		description: 'Get a list of approvals. Token scope: vso.release.',
	},
	'release.approvals.update': {
		riskLevel: 'destructive',
		description:
			'Update status of an approval. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_manage.',
	},
	'release.attachments.getReleaseTaskAttachmentContent': {
		riskLevel: 'read',
		description: 'Get a release task attachment. Token scope: vso.release.',
	},
	'release.attachments.getReleaseTaskAttachments': {
		riskLevel: 'read',
		description: 'Get the release task attachments. Token scope: vso.release.',
	},
	'release.attachments.getTaskAttachmentContent': {
		riskLevel: 'read',
		description:
			'GetTaskAttachmentContent API is deprecated. Use GetReleaseTaskAttachmentContent API instead. Token scope: vso.release.',
	},
	'release.attachments.getTaskAttachments': {
		riskLevel: 'read',
		description:
			'GetTaskAttachments API is deprecated. Use GetReleaseTaskAttachments API instead. Token scope: vso.release.',
	},
	'release.definitions.create': {
		riskLevel: 'write',
		description:
			'Create a release definition. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.definitions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a release definition. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_manage. Cannot be undone.',
	},
	'release.definitions.get': {
		riskLevel: 'read',
		description: 'Get a release definition. Token scope: vso.release.',
	},
	'release.definitions.getDefinitionRevision': {
		riskLevel: 'read',
		description:
			'Get release definition for a given definitionId and revision. Token scope: vso.release.',
	},
	'release.definitions.getReleaseDefinitionHistory': {
		riskLevel: 'read',
		description:
			'Get revision history for a release definition. Token scope: vso.release.',
	},
	'release.definitions.list': {
		riskLevel: 'read',
		description: 'Get a list of release definitions. Token scope: vso.release.',
	},
	'release.definitions.update': {
		riskLevel: 'write',
		description:
			'Update a release definition. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.deployments.list': {
		riskLevel: 'read',
		description:
			'Token scope: vso.release. (GET /{project}/_apis/release/deployments)',
	},
	'release.folders.create': {
		riskLevel: 'write',
		description:
			'This method is no longer supported. Use CreateFolder with folder parameter API. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a definition folder for given folder name and path and all it's existing definitions. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_manage. Cannot be undone.",
	},
	'release.folders.list': {
		riskLevel: 'read',
		description:
			'Gets folders. Token scope: vso.release. (GET /{project}/_apis/release/folders/{path})',
	},
	'release.folders.update': {
		riskLevel: 'write',
		description:
			'Updates an existing folder at given existing path. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.gates.update': {
		riskLevel: 'write',
		description:
			'Updates the gate for a deployment. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.manualInterventions.get': {
		riskLevel: 'read',
		description:
			'Get manual intervention for a given release and manual intervention id. Token scope: vso.release.',
	},
	'release.manualInterventions.list': {
		riskLevel: 'read',
		description:
			'List all manual interventions for a given release. Token scope: vso.release.',
	},
	'release.manualInterventions.update': {
		riskLevel: 'write',
		description:
			'Update manual intervention. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.releases.create': {
		riskLevel: 'destructive',
		description:
			'Create a release. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.releases.getLogs': {
		riskLevel: 'read',
		description: 'Get logs for a release Id. Token scope: vso.release.',
	},
	'release.releases.getRelease': {
		riskLevel: 'read',
		description: 'Get a Release. Token scope: vso.release.',
	},
	'release.releases.getReleaseEnvironment': {
		riskLevel: 'read',
		description: 'Get a release environment. Token scope: vso.release.',
	},
	'release.releases.getReleaseRevision': {
		riskLevel: 'read',
		description:
			'Get release for a given revision number. Token scope: vso.release.',
	},
	'release.releases.getTaskLog': {
		riskLevel: 'read',
		description:
			'Gets the task log of a release as a plain text file. Token scope: vso.release.',
	},
	'release.releases.list': {
		riskLevel: 'read',
		description: 'Get a list of releases. Token scope: vso.release.',
	},
	'release.releases.updateRelease': {
		riskLevel: 'write',
		description:
			'Update a complete release object. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.releases.updateReleaseEnvironment': {
		riskLevel: 'write',
		description:
			'Update the status of a release environment. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'release.releases.updateReleaseResource': {
		riskLevel: 'write',
		description:
			'Update few properties of a release. Release management lives on vsrm.dev.azure.com. Token scope: vso.release_execute.',
	},
	'search.codeSearchResults.fetchCodeSearchResults': {
		riskLevel: 'read',
		description:
			'Provides a set of results for the search text. Needs the Code Search extension (free, from the Marketplace) for code search. Token scope: vso.code.',
	},
	'search.packageSearchResults.fetchPackageSearchResults': {
		riskLevel: 'read',
		description:
			'Provides a set of results for the search text. Needs the Code Search extension (free, from the Marketplace) for code search. Token scope: vso.packaging.',
	},
	'search.repositories.get': {
		riskLevel: 'read',
		description:
			'Provides status of Repository. Needs the Code Search extension (free, from the Marketplace) for code search. Token scope: vso.code.',
	},
	'search.tfvc.get': {
		riskLevel: 'read',
		description:
			'Provides status of TFVC Repository. Needs the Code Search extension (free, from the Marketplace) for code search. Token scope: vso.code.',
	},
	'search.wikiSearchResults.fetchWikiSearchResults': {
		riskLevel: 'read',
		description:
			'Provides a set of results for the search request. Needs the Code Search extension (free, from the Marketplace) for code search. Token scope: vso.wiki.',
	},
	'search.workItemSearchResults.fetchWorkItemSearchResults': {
		riskLevel: 'read',
		description:
			'Provides a set of results for the search text. Needs the Code Search extension (free, from the Marketplace) for code search. Token scope: vso.work.',
	},
	'security.accessControlEntries.removeAccessControlEntries': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove the specified ACEs from the ACL belonging to the specified token. Token scope: vso.security_manage. Cannot be undone.',
	},
	'security.accessControlEntries.setAccessControlEntries': {
		riskLevel: 'destructive',
		description:
			'Add or update ACEs in the ACL for the provided token. The request body contains the target token, a list of ACEs and a optional merge parameter. In the case of a collision (by identity descriptor) with an existing ACE in the ACL, the "merge" parameter determines the behavior. Token scope: vso.security_manage.',
	},
	'security.accessControlLists.query': {
		riskLevel: 'read',
		description:
			'Return a list of access control lists for the specified security namespace and token. All ACLs in the security namespace will be retrieved if no optional parameters are provided.',
	},
	'security.accessControlLists.removeAccessControlLists': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove access control lists under the specfied security namespace. Token scope: vso.security_manage. Cannot be undone.',
	},
	'security.accessControlLists.setAccessControlLists': {
		riskLevel: 'destructive',
		description:
			'Create or update one or more access control lists. All data that currently exists for the ACLs supplied will be overwritten. Token scope: vso.security_manage.',
	},
	'security.permissions.hasPermissions': {
		riskLevel: 'read',
		description:
			'Evaluates whether the caller has the specified permissions on the specified set of security tokens.',
	},
	'security.permissions.hasPermissionsBatch': {
		riskLevel: 'destructive',
		description:
			'Evaluates multiple permissions for the calling user. Note: This method does not aggregate the results, nor does it short-circuit if one of the permissions evaluates to false.',
	},
	'security.permissions.removePermission': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes the specified permissions on a security token for a user or group. Token scope: vso.security_manage. Cannot be undone.',
	},
	'security.securityNamespaces.query': {
		riskLevel: 'read',
		description:
			'List all security namespaces or just the specified namespace.',
	},
	'securityRoles.roleassignments.changeInheritance': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.security_manage.',
	},
	'securityRoles.roleassignments.list': {
		riskLevel: 'read',
		description:
			'Get role assignments for the resource. Preview API (api-version 7.1-preview.1).',
	},
	'securityRoles.roleassignments.removeRoleAssignment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove the role assignment on a resource. Preview API (api-version 7.1-preview.1). Token scope: vso.security_manage. Cannot be undone.',
	},
	'securityRoles.roleassignments.removeRoleAssignments': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.security_manage.',
	},
	'securityRoles.roleassignments.setRoleAssignment': {
		riskLevel: 'write',
		description:
			'Set role assignment on a resource. Preview API (api-version 7.1-preview.1). Token scope: vso.security_manage.',
	},
	'securityRoles.roleassignments.setRoleAssignments': {
		riskLevel: 'write',
		description:
			'Set role assignments on a resource. Preview API (api-version 7.1-preview.1). Token scope: vso.security_manage.',
	},
	'securityRoles.roledefinitions.list': {
		riskLevel: 'read',
		description: 'Preview API (api-version 7.1-preview.1).',
	},
	'serviceEndpoint.endpointproxy.executeServiceEndpointRequest': {
		riskLevel: 'destructive',
		description:
			'Proxy for a GET request defined by a service endpoint. Token scope: vso.serviceendpoint_query.',
	},
	'serviceEndpoint.endpointproxy.query': {
		riskLevel: 'read',
		description:
			'Use ExecuteServiceEndpointRequest API Instead. Token scope: vso.serviceendpoint_query.',
	},
	'serviceEndpoint.endpoints.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new service endpoint. Token scope: vso.serviceendpoint_manage.',
	},
	'serviceEndpoint.endpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a service endpoint. Token scope: vso.serviceendpoint_manage. Cannot be undone.',
	},
	'serviceEndpoint.endpoints.get': {
		riskLevel: 'read',
		description:
			'Get the service endpoint details. Token scope: vso.serviceendpoint.',
	},
	'serviceEndpoint.endpoints.getServiceEndpoints': {
		riskLevel: 'read',
		description: 'Get the service endpoints. Token scope: vso.serviceendpoint.',
	},
	'serviceEndpoint.endpoints.getServiceEndpointsByNames': {
		riskLevel: 'read',
		description:
			'Get the service endpoints by name. Token scope: vso.serviceendpoint.',
	},
	'serviceEndpoint.endpoints.getServiceEndpointsWithRefreshedAuthentication': {
		riskLevel: 'read',
		description:
			'Gets the service endpoints and patch new authorization parameters. Token scope: vso.serviceendpoint_manage.',
	},
	'serviceEndpoint.endpoints.shareServiceEndpoint': {
		riskLevel: 'destructive',
		description:
			'Share service endpoint across projects. Token scope: vso.serviceendpoint_manage.',
	},
	'serviceEndpoint.endpoints.updateServiceEndpoint': {
		riskLevel: 'write',
		description:
			'Update the service endpoint. Token scope: vso.serviceendpoint_manage.',
	},
	'serviceEndpoint.endpoints.updateServiceEndpoints': {
		riskLevel: 'write',
		description:
			'Update the service endpoints. Token scope: vso.serviceendpoint_manage.',
	},
	'serviceEndpoint.executionhistory.list': {
		riskLevel: 'read',
		description:
			'Get service endpoint execution records. Token scope: vso.serviceendpoint.',
	},
	'serviceEndpoint.types.list': {
		riskLevel: 'read',
		description:
			'Get service endpoint types. Token scope: vso.serviceendpoint.',
	},
	'status.health.get': {
		riskLevel: 'read',
		description:
			'Queries status information for the service all-up, or scoped to a particular service and/or geography. Preview API (api-version 7.1-preview.1).',
	},
	'symbol.availability.checkAvailability': {
		riskLevel: 'read',
		description:
			'Check the availability of symbol service. This includes checking for feature flag, and possibly license in future. Note this is NOT an anonymous endpoint, and the caller will be redirected to authentication before hitting it. Token scope: vso.symbols.',
	},
	'symbol.client.get': {
		riskLevel: 'read',
		description: 'Get the client package. Token scope: vso.symbols.',
	},
	'symbol.contents.get': {
		riskLevel: 'read',
		description:
			'Get a stitched debug entry for a symbol request as specified by symbol request identifier and debug entry identifier. Token scope: vso.symbols.',
	},
	'symbol.requests.createRequests': {
		riskLevel: 'write',
		description: 'Create a new symbol request. Token scope: vso.symbols_write.',
	},
	'symbol.requests.createRequestsRequestIdDebugEntries': {
		riskLevel: 'write',
		description:
			'Create debug entries for a symbol request as specified by its identifier. Token scope: vso.symbols_write.',
	},
	'symbol.requests.createRequestsRequestNameDebugEntries': {
		riskLevel: 'write',
		description:
			'Create debug entries for a symbol request as specified by its name. Token scope: vso.symbols_write.',
	},
	'symbol.requests.deleteRequestsRequestId': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a symbol request by request identifier. Token scope: vso.symbols_manage. Cannot be undone.',
	},
	'symbol.requests.deleteRequestsRequestName': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a symbol request by request name. Token scope: vso.symbols_manage. Cannot be undone.',
	},
	'symbol.requests.getRequestsRequestId': {
		riskLevel: 'read',
		description:
			'Get a symbol request by request identifier. Token scope: vso.symbols.',
	},
	'symbol.requests.getRequestsRequestName': {
		riskLevel: 'read',
		description:
			'Get a symbol request by request name. Token scope: vso.symbols.',
	},
	'symbol.requests.updateRequestsRequestId': {
		riskLevel: 'write',
		description:
			'Update a symbol request by request identifier. Token scope: vso.symbols_write.',
	},
	'symbol.requests.updateRequestsRequestName': {
		riskLevel: 'write',
		description:
			'Update a symbol request by request name. Token scope: vso.symbols_write.',
	},
	'symbol.symsrv.get': {
		riskLevel: 'read',
		description:
			'Given a client key, returns the best matched debug entry. Token scope: vso.symbols.',
	},
	'test.attachments.createTestResultAttachment': {
		riskLevel: 'write',
		description: 'Attach a file to a test result. Token scope: vso.test_write.',
	},
	'test.attachments.createTestRunAttachment': {
		riskLevel: 'write',
		description: 'Attach a file to a test run. Token scope: vso.test_write.',
	},
	'test.attachments.createTestSubResultAttachment': {
		riskLevel: 'write',
		description: 'Attach a file to a test result. Token scope: vso.test_write.',
	},
	'test.attachments.getTestResultAttachmentZip': {
		riskLevel: 'read',
		description:
			'Download a test result attachment by its ID. Token scope: vso.test.',
	},
	'test.attachments.getTestResultAttachments': {
		riskLevel: 'read',
		description:
			'Get list of test result attachments reference. Token scope: vso.test.',
	},
	'test.attachments.getTestRunAttachmentZip': {
		riskLevel: 'read',
		description:
			'Download a test run attachment by its ID. Token scope: vso.test.',
	},
	'test.attachments.getTestRunAttachments': {
		riskLevel: 'read',
		description:
			'Get list of test run attachments reference. Token scope: vso.test.',
	},
	'test.attachments.getTestSubResultAttachmentZip': {
		riskLevel: 'read',
		description:
			'Download a test sub result attachment. Token scope: vso.test.',
	},
	'test.attachments.getTestSubResultAttachments': {
		riskLevel: 'read',
		description:
			'Get list of test sub result attachments. Token scope: vso.test.',
	},
	'test.codeCoverage.getBuildCodeCoverage': {
		riskLevel: 'read',
		description: 'Get code coverage data for a build. Token scope: vso.test.',
	},
	'test.codeCoverage.getTestRunCodeCoverage': {
		riskLevel: 'read',
		description:
			'Get code coverage data for a test run. Token scope: vso.test.',
	},
	'test.iterations.get': {
		riskLevel: 'read',
		description: 'Get iteration for a result. Token scope: vso.test.',
	},
	'test.iterations.list': {
		riskLevel: 'read',
		description: 'Get iterations for a result. Token scope: vso.test.',
	},
	'test.points.getPoint': {
		riskLevel: 'read',
		description: 'Get a test point. Token scope: vso.test.',
	},
	'test.points.getPointsByQuery': {
		riskLevel: 'read',
		description: 'Get test points using query. Token scope: vso.test_write.',
	},
	'test.points.list': {
		riskLevel: 'read',
		description: 'Get a list of test points. Token scope: vso.test.',
	},
	'test.points.update': {
		riskLevel: 'write',
		description: 'Update test points. Token scope: vso.test_write.',
	},
	'test.resultRetentionSettings.get': {
		riskLevel: 'read',
		description: 'Get test result retention settings. Token scope: vso.test.',
	},
	'test.resultRetentionSettings.update': {
		riskLevel: 'write',
		description:
			'Update test result retention settings. Token scope: vso.test_write.',
	},
	'test.results.add': {
		riskLevel: 'write',
		description: 'Add test results to a test run. Token scope: vso.test_write.',
	},
	'test.results.get': {
		riskLevel: 'read',
		description: 'Get a test result for a test run. Token scope: vso.test.',
	},
	'test.results.list': {
		riskLevel: 'read',
		description: 'Get test results for a test run. Token scope: vso.test.',
	},
	'test.results.update': {
		riskLevel: 'write',
		description:
			'Update test results in a test run. Token scope: vso.test_write.',
	},
	'test.runs.create': {
		riskLevel: 'write',
		description: 'Create new test run. Token scope: vso.test_write.',
	},
	'test.runs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a test run by its ID. Token scope: vso.test_write. Cannot be undone.',
	},
	'test.runs.getTestRunById': {
		riskLevel: 'read',
		description: 'Get a test run by its ID. Token scope: vso.test.',
	},
	'test.runs.getTestRunStatistics': {
		riskLevel: 'read',
		description:
			'Get test run statistics , used when we want to get summary of a run by outcome. Token scope: vso.test.',
	},
	'test.runs.list': {
		riskLevel: 'read',
		description: 'Get a list of test runs. Token scope: vso.test.',
	},
	'test.runs.query': {
		riskLevel: 'read',
		description:
			'Query Test Runs based on filters. Mandatory fields are minLastUpdatedDate and maxLastUpdatedDate. Token scope: vso.test.',
	},
	'test.runs.update': {
		riskLevel: 'write',
		description: 'Update test run by its ID. Token scope: vso.test_write.',
	},
	'test.session.create': {
		riskLevel: 'write',
		description: 'Create a test session. Token scope: vso.test_write.',
	},
	'test.session.list': {
		riskLevel: 'read',
		description: 'Get a list of test sessions. Token scope: vso.test.',
	},
	'test.session.update': {
		riskLevel: 'write',
		description: 'Update a test session. Token scope: vso.test_write.',
	},
	'test.testCases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a test case. Token scope: vso.test_write. Cannot be undone.',
	},
	'test.testHistory.query': {
		riskLevel: 'read',
		description:
			'Get history of a test method using TestHistoryQuery. Token scope: vso.test_write.',
	},
	'test.testSuites.add': {
		riskLevel: 'write',
		description: 'Add test cases to suite. Token scope: vso.test_write.',
	},
	'test.testSuites.get': {
		riskLevel: 'read',
		description:
			'Get a specific test case in a test suite with test case id. Token scope: vso.test.',
	},
	'test.testSuites.list': {
		riskLevel: 'read',
		description: 'Get all test cases in a suite. Token scope: vso.test.',
	},
	'test.testSuites.removeTestCasesFromSuiteUrl': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'The test points associated with the test cases are removed from the test suite. The test case work item is not deleted from the system. See test cases resource to delete a test case permanently. Token scope: vso.test_write. Cannot be undone.',
	},
	'test.testSuites.update': {
		riskLevel: 'write',
		description:
			'Updates the properties of the test case association in a suite. Token scope: vso.test_write.',
	},
	'testPlan.configurations.create': {
		riskLevel: 'write',
		description: 'Create a test configuration. Token scope: vso.test_write.',
	},
	'testPlan.configurations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a test configuration by its ID. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.configurations.get': {
		riskLevel: 'read',
		description: 'Get a test configuration. Token scope: vso.test.',
	},
	'testPlan.configurations.list': {
		riskLevel: 'read',
		description: 'Get a list of test configurations. Token scope: vso.test.',
	},
	'testPlan.configurations.update': {
		riskLevel: 'write',
		description:
			'Update a test configuration by its ID. Token scope: vso.test_write.',
	},
	'testPlan.suiteTestCase.add': {
		riskLevel: 'write',
		description:
			'Add test cases to a suite with specified configurations. Token scope: vso.test_write.',
	},
	'testPlan.suiteTestCase.getTestCase': {
		riskLevel: 'read',
		description:
			'Get a particular Test Case from a Suite. Token scope: vso.test.',
	},
	'testPlan.suiteTestCase.getTestCaseList': {
		riskLevel: 'read',
		description:
			'Get Test Case List return those test cases which have all the configuration Ids as mentioned in the optional parameter. If configuration Ids is null, it return all the test cases. Token scope: vso.test.',
	},
	'testPlan.suiteTestCase.removeTestCasesFromSuite': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes test cases from a suite based on the list of test case Ids provided. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.suiteTestCase.removeTestCasesListFromSuite': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes test cases from a suite based on the list of test case Ids provided. This API can be used to remove a larger number of test cases. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.suiteTestCase.update': {
		riskLevel: 'write',
		description:
			'Update the configurations for test cases. Token scope: vso.test_write.',
	},
	'testPlan.testCaseClone.cloneTestCase': {
		riskLevel: 'write',
		description:
			'Token scope: vso.test_write. (POST /{project}/_apis/testplan/TestCases/CloneTestCaseOperation)',
	},
	'testPlan.testCaseClone.get': {
		riskLevel: 'read',
		description: 'Get clone information. Token scope: vso.test.',
	},
	'testPlan.testCases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a test case. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.testPlanClone.cloneTestPlan': {
		riskLevel: 'write',
		description: 'Clone test plan. Token scope: vso.test_write.',
	},
	'testPlan.testPlanClone.get': {
		riskLevel: 'read',
		description: 'Get clone information. Token scope: vso.test.',
	},
	'testPlan.testPlans.create': {
		riskLevel: 'write',
		description: 'Create a test plan. Token scope: vso.test_write.',
	},
	'testPlan.testPlans.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a test plan. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.testPlans.get': {
		riskLevel: 'read',
		description: 'Get a test plan by Id. Token scope: vso.test.',
	},
	'testPlan.testPlans.list': {
		riskLevel: 'read',
		description: 'Get a list of test plans. Token scope: vso.test.',
	},
	'testPlan.testPlans.update': {
		riskLevel: 'write',
		description: 'Update a test plan. Token scope: vso.test_write.',
	},
	'testPlan.testPoint.getPoints': {
		riskLevel: 'read',
		description:
			'Get a particular Test Point from a suite. Token scope: vso.test.',
	},
	'testPlan.testPoint.getPointsList': {
		riskLevel: 'read',
		description:
			'Get all the points inside a suite based on some filters. Token scope: vso.test.',
	},
	'testPlan.testPoint.update': {
		riskLevel: 'write',
		description:
			'Update Test Points. This is used to Reset test point to active, update the outcome of a test point or update the tester of a test point. Token scope: vso.test_write.',
	},
	'testPlan.testSuiteClone.cloneTestSuite': {
		riskLevel: 'write',
		description: 'Clone test suite. Token scope: vso.test_write.',
	},
	'testPlan.testSuiteClone.get': {
		riskLevel: 'read',
		description: 'Get clone information. Token scope: vso.test.',
	},
	'testPlan.testSuiteEntry.list': {
		riskLevel: 'read',
		description:
			'Get a list of test suite entries in the test suite. Token scope: vso.test.',
	},
	'testPlan.testSuiteEntry.reorderSuiteEntries': {
		riskLevel: 'write',
		description:
			'Reorder test suite entries in the test suite. Token scope: vso.test_write.',
	},
	'testPlan.testSuites.create': {
		riskLevel: 'write',
		description: 'Create test suite. Token scope: vso.test_write.',
	},
	'testPlan.testSuites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete test suite. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.testSuites.get': {
		riskLevel: 'read',
		description: 'Get test suite by suite id. Token scope: vso.test.',
	},
	'testPlan.testSuites.getSuitesByTestCaseId': {
		riskLevel: 'read',
		description:
			'Find the list of all test suites in which a given test case is present. This is helpful if you need to find out which test suites are using a test case, when you need to make changes to a test case. Token scope: vso.test.',
	},
	'testPlan.testSuites.getTestSuitesForPlan': {
		riskLevel: 'read',
		description: 'Get test suites for plan. Token scope: vso.test.',
	},
	'testPlan.testSuites.update': {
		riskLevel: 'write',
		description: 'Update test suite. Token scope: vso.test_write.',
	},
	'testPlan.variables.create': {
		riskLevel: 'write',
		description: 'Create a test variable. Token scope: vso.test_write.',
	},
	'testPlan.variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a test variable by its ID. Token scope: vso.test_write. Cannot be undone.',
	},
	'testPlan.variables.get': {
		riskLevel: 'read',
		description: 'Get a test variable by its ID. Token scope: vso.test.',
	},
	'testPlan.variables.list': {
		riskLevel: 'read',
		description: 'Get a list of test variables. Token scope: vso.test.',
	},
	'testPlan.variables.update': {
		riskLevel: 'write',
		description:
			'Update a test variable by its ID. Token scope: vso.test_write.',
	},
	'testResults.attachments.createTestIterationResultAttachment': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.attachments.createTestResultAttachment': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.attachments.createTestRunAttachment': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.attachments.createTestSubResultAttachment': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.attachments.deleteTestResultAttachment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.attachments.deleteTestRunAttachment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.attachments.getTestIterationAttachmentZip': {
		riskLevel: 'read',
		description:
			'Returns a test iteration attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.attachments.getTestResultAttachmentZip': {
		riskLevel: 'read',
		description:
			'Returns a test result attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.attachments.getTestResultAttachments': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.attachments.getTestRunAttachmentZip': {
		riskLevel: 'read',
		description:
			'Returns a test run attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.attachments.getTestRunAttachments': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.attachments.getTestSubResultAttachmentZip': {
		riskLevel: 'read',
		description:
			'Returns a test sub result attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.attachments.getTestSubResultAttachments': {
		riskLevel: 'read',
		description:
			'Returns attachment references for test sub result. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.bugs.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.codecoverage.get': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.codecoverage.getBuildCodeCoverage': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.codecoverage.getTestRunCodeCoverage': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.codecoverage.update': {
		riskLevel: 'write',
		description:
			'http://(tfsserver):8080/tfs/DefaultCollection/_apis/test/CodeCoverage?buildId=10 Request: Json of code coverage summary. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.filecoverage.get': {
		riskLevel: 'read',
		description:
			'Get file coverage for the specified file. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.history.query': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.messageLogs.list': {
		riskLevel: 'read',
		description:
			'Get test run message logs. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.metrics.get': {
		riskLevel: 'read',
		description:
			'Get summary of test results. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultDocument.publishTestResultDocument': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.resultMetaData.query': {
		riskLevel: 'read',
		description:
			'Get list of test Result meta data details for corresponding testcasereferenceId. Preview API (api-version 7.1-preview.4). Token scope: vso.test_write.',
	},
	'testResults.resultMetaData.update': {
		riskLevel: 'write',
		description:
			'Update properties of test result meta data. Preview API (api-version 7.1-preview.4). Token scope: vso.test_write.',
	},
	'testResults.resultTrendByBuild.query': {
		riskLevel: 'read',
		description: 'Preview API (api-version 7.1-preview.1).',
	},
	'testResults.resultTrendByRelease.query': {
		riskLevel: 'read',
		description: 'Preview API (api-version 7.1-preview.1).',
	},
	'testResults.resultdetailsbybuild.get': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultdetailsbyrelease.get': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultgroupsbybuild.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultgroupsbyrelease.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.results.add': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.results.getTestResultById': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test.',
	},
	'testResults.results.getTestResults': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test.',
	},
	'testResults.results.getTestResultsByQuery': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.results.getTestResultsByQueryWiql': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.results.update': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.resultsbybuild.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultsbypipeline.list': {
		riskLevel: 'read',
		description:
			'Get a list of results. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultsbyrelease.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultsgroupDetails.testResultsGroupDetails': {
		riskLevel: 'read',
		description:
			'Get all the available groups details and for these groups get failed and aborted results. Preview API (api-version 7.1-preview.1).',
	},
	'testResults.resultsummarybybuild.query': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultsummarybypipeline.query': {
		riskLevel: 'read',
		description:
			'Get summary of test results. Preview API (api-version 7.1-preview.1).',
	},
	'testResults.resultsummarybyrelease.queryTestResultsReportForRelease': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.resultsummarybyrelease.queryTestResultsSummaryForReleases': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.resultsummarybyrequirement.query': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.runs.create': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.runs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.runs.get': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.runs.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.runs.query': {
		riskLevel: 'read',
		description:
			'Query Test Runs based on filters. Mandatory fields are minLastUpdatedDate and maxLastUpdatedDate. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.runs.update': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.runsummary.get': {
		riskLevel: 'read',
		description:
			'Get test run summary, used when we want to get summary of a run by outcome. Test run should be in completed state. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.settings.get': {
		riskLevel: 'read',
		description:
			'Get TestResultsSettings data. Preview API (api-version 7.1-preview.3).',
	},
	'testResults.settings.update': {
		riskLevel: 'write',
		description:
			'Update project settings of test results. Preview API (api-version 7.1-preview.3).',
	},
	'testResults.similarTestResults.list': {
		riskLevel: 'read',
		description:
			'Gets the list of results whose failure matches with the provided one. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.statistics.get': {
		riskLevel: 'read',
		description:
			'Get test run statistics , used when we want to get summary of a run by outcome. Token scope: vso.test.',
	},
	'testResults.status.get': {
		riskLevel: 'read',
		description:
			'Gets the coverage status for the last successful build of a definition, optionally scoped to a specific branch. Preview API (api-version 7.1-preview.1).',
	},
	'testResults.tags.getTestTagsForBuild': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.tags.getTestTagsForRelease': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.tags.update': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.tagsummary.getTestTagSummaryForBuild': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.tagsummary.getTestTagSummaryForRelease': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testHistory.query': {
		riskLevel: 'read',
		description:
			'Get history of a test method using TestHistoryQuery. Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.testattachments.createBuildAttachmentInLogStore': {
		riskLevel: 'write',
		description:
			'Creates an attachment in the LogStore for the specified buildId. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testattachments.createTestRunLogStoreAttachment': {
		riskLevel: 'write',
		description:
			'Creates an attachment in the LogStore for the specified runId. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testattachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the attachment with the specified filename for the specified runId from the LogStore. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.testattachments.get': {
		riskLevel: 'read',
		description:
			'Returns the attachment with the specified filename for the specified runId from the LogStore. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testattachments.list': {
		riskLevel: 'read',
		description:
			'Returns a list of attachments for the specified runId from the LogStore. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testfailuretype.create': {
		riskLevel: 'write',
		description:
			'Creates a new test failure type. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testfailuretype.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a test failure type with specified failureTypeId. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.testfailuretype.list': {
		riskLevel: 'read',
		description:
			'Returns the list of test failure types. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testlog.getTestLogsForBuild': {
		riskLevel: 'read',
		description:
			'Get list of build attachments reference. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testlog.getTestResultLogs': {
		riskLevel: 'read',
		description:
			'Get list of test result attachments reference. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testlog.getTestRunLogs': {
		riskLevel: 'read',
		description:
			'Get list of test run attachments reference. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testlog.getTestSubResultLogs': {
		riskLevel: 'read',
		description:
			'Get list of test subresult attachments reference. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForBuildLog':
		{
			riskLevel: 'read',
			description:
				'Get SAS Uri of a build attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
		},
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForResultLog':
		{
			riskLevel: 'read',
			description:
				'Get SAS Uri of a test results attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
		},
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForRunLog': {
		riskLevel: 'read',
		description:
			'Get SAS Uri of a test run attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.testlogstoreendpoint.getTestLogStoreEndpointDetailsForSubResultLog':
		{
			riskLevel: 'read',
			description:
				'Get SAS Uri of a test subresults attachment. Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
		},
	'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForBuild': {
		riskLevel: 'write',
		description:
			'Create and Get sas uri of the build container. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForResult': {
		riskLevel: 'write',
		description:
			'Create empty file for a result and Get Sas uri for the file. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForRun': {
		riskLevel: 'write',
		description:
			'Create empty file for a run and Get Sas uri for the file. Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testsettings.create': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write.',
	},
	'testResults.testsettings.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.testsettings.get': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.test.',
	},
	'testResults.workitems.add': {
		riskLevel: 'write',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.workitems.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write. Cannot be undone.',
	},
	'testResults.workitems.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test.',
	},
	'testResults.workitems.queryTestMethodLinkedWorkItems': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.2). Token scope: vso.test_write.',
	},
	'testResults.workitems.queryTestResultWorkItems': {
		riskLevel: 'read',
		description:
			'Query Test Result WorkItems based on filter. Preview API (api-version 7.1-preview.2). Token scope: vso.test.',
	},
	'tfvc.branches.get': {
		riskLevel: 'read',
		description:
			'Get a single branch hierarchy at the given path with parents or children as specified. Token scope: vso.code.',
	},
	'tfvc.branches.getBranchRefs': {
		riskLevel: 'read',
		description:
			'Get branch hierarchies below the specified scopePath. Token scope: vso.code.',
	},
	'tfvc.branches.getBranches': {
		riskLevel: 'read',
		description:
			'Get a collection of branch roots -- first-level children, branches with no parents. Token scope: vso.code.',
	},
	'tfvc.changesets.create': {
		riskLevel: 'write',
		description:
			'Create a new changeset. Accepts TfvcChangeset as JSON body. Token scope: vso.code_write.',
	},
	'tfvc.changesets.get': {
		riskLevel: 'read',
		description: 'Retrieve a Tfvc Changeset. Token scope: vso.code.',
	},
	'tfvc.changesets.getBatchedChangesets': {
		riskLevel: 'read',
		description:
			'Returns changesets for a given list of changeset Ids. Token scope: vso.code.',
	},
	'tfvc.changesets.getChangesetChanges': {
		riskLevel: 'read',
		description:
			'Retrieve Tfvc changes for a given changeset. Token scope: vso.code.',
	},
	'tfvc.changesets.getChangesetWorkItems': {
		riskLevel: 'read',
		description:
			'Retrieves the work items associated with a particular changeset. Token scope: vso.code.',
	},
	'tfvc.changesets.getChangesets': {
		riskLevel: 'read',
		description:
			"Retrieve Tfvc Changesets Note: This is a new version of the GetChangesets API that doesn't expose the unneeded queryParams present in the 1.0 version of the API. Token scope: vso.code.",
	},
	'tfvc.items.get': {
		riskLevel: 'read',
		description:
			"Get Item Metadata and/or Content for a single item. The download parameter is to indicate whether the content should be available as a download or just sent as a stream in the response. Doesn't apply to zipped content which is always returned as a download. Token scope: vso.code.",
	},
	'tfvc.items.getItemsBatch': {
		riskLevel: 'read',
		description:
			'Post for retrieving a set of items given a list of paths or a long path. Allows for specifying the recursionLevel and version descriptors for each path. Token scope: vso.code.',
	},
	'tfvc.items.list': {
		riskLevel: 'read',
		description: 'Get a list of Tfvc items. Token scope: vso.code.',
	},
	'tfvc.labels.get': {
		riskLevel: 'read',
		description: 'Get a single deep label. Token scope: vso.code.',
	},
	'tfvc.labels.getLabelItems': {
		riskLevel: 'read',
		description: 'Get items under a label. Token scope: vso.code.',
	},
	'tfvc.labels.list': {
		riskLevel: 'read',
		description:
			'Get a collection of shallow label references. Token scope: vso.code.',
	},
	'tfvc.shelvesets.get': {
		riskLevel: 'read',
		description: 'Get a single deep shelveset. Token scope: vso.code.',
	},
	'tfvc.shelvesets.getShelvesetChanges': {
		riskLevel: 'read',
		description: 'Get changes included in a shelveset. Token scope: vso.code.',
	},
	'tfvc.shelvesets.getShelvesetWorkItems': {
		riskLevel: 'read',
		description:
			'Get work items associated with a shelveset. Token scope: vso.code.',
	},
	'tfvc.shelvesets.list': {
		riskLevel: 'read',
		description:
			'Return a collection of shallow shelveset references. Token scope: vso.code.',
	},
	'tokenAdmin.personalAccessTokens.list': {
		riskLevel: 'read',
		description:
			'Lists of all the session token details of the personal access tokens (PATs) for a particular user. Token scope: vso.tokenadministration.',
	},
	'tokenAdmin.revocationRules.create': {
		riskLevel: 'destructive',
		description:
			'Creates a revocation rule to prevent the further usage of any OAuth authorizations that were created before the current point in time and which match the conditions in the rule. Not all kinds of OAuth authorizations can be revoked directly. Organization admins only. Token scope: vso.tokenadministration.',
	},
	'tokenAdmin.revocations.revokeAuthorizations': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes the listed OAuth authorizations. Organization admins only. Token scope: vso.tokenadministration.',
	},
	'tokens.pats.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new personal access token (PAT) for the requesting user. Personal access tokens: needs an Entra (Microsoft identity) token, not a PAT. Preview API (api-version 7.1-preview.1).',
	},
	'tokens.pats.get': {
		riskLevel: 'read',
		description:
			'Gets a single personal access token (PAT). Personal access tokens: needs an Entra (Microsoft identity) token, not a PAT. Preview API (api-version 7.1-preview.1).',
	},
	'tokens.pats.list': {
		riskLevel: 'read',
		description:
			'Gets a paged list of personal access tokens (PATs) created in this organization. Subsequent calls to the API require the same filtering options to be supplied. Personal access tokens: needs an Entra (Microsoft identity) token, not a PAT. Preview API (api-version 7.1-preview.1).',
	},
	'tokens.pats.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revokes a personal access token (PAT) by authorizationId. Personal access tokens: needs an Entra (Microsoft identity) token, not a PAT. Preview API (api-version 7.1-preview.1). Cannot be undone.',
	},
	'tokens.pats.update': {
		riskLevel: 'destructive',
		description:
			'Updates an existing personal access token (PAT) with the new parameters. To update a token, it must be valid (has not been revoked). Personal access tokens: needs an Entra (Microsoft identity) token, not a PAT. Preview API (api-version 7.1-preview.1).',
	},
	'wiki.attachments.create': {
		riskLevel: 'write',
		description:
			'Creates an attachment in the wiki. Token scope: vso.wiki_write.',
	},
	'wiki.pageMoves.create': {
		riskLevel: 'write',
		description:
			'Creates a page move operation that updates the path and order of the page as provided in the parameters. Token scope: vso.wiki_write.',
	},
	'wiki.pageStats.get': {
		riskLevel: 'read',
		description:
			'Returns page detail corresponding to Page ID. Token scope: vso.wiki.',
	},
	'wiki.pages.createOrUpdate': {
		riskLevel: 'write',
		description: 'Creates or edits a wiki page. Token scope: vso.wiki_write.',
	},
	'wiki.pages.deletePage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a wiki page. Token scope: vso.wiki_write. Cannot be undone.',
	},
	'wiki.pages.deletePageById': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a wiki page. Token scope: vso.wiki_write. Cannot be undone.',
	},
	'wiki.pages.getPage': {
		riskLevel: 'read',
		description:
			'Gets metadata or content of the wiki page for the provided path. Content negotiation is done based on the Accept header sent in the request. Token scope: vso.wiki.',
	},
	'wiki.pages.getPageById': {
		riskLevel: 'read',
		description:
			'Gets metadata or content of the wiki page for the provided page id. Content negotiation is done based on the Accept header sent in the request. Token scope: vso.wiki.',
	},
	'wiki.pages.update': {
		riskLevel: 'write',
		description: 'Edits a wiki page. Token scope: vso.wiki_write.',
	},
	'wiki.pagesBatch.get': {
		riskLevel: 'read',
		description: 'Returns pageable list of Wiki Pages. Token scope: vso.wiki.',
	},
	'wiki.wikis.create': {
		riskLevel: 'write',
		description: 'Creates the wiki resource. Token scope: vso.wiki_write.',
	},
	'wiki.wikis.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the wiki corresponding to the wiki ID or wiki name provided. Token scope: vso.wiki_write. Cannot be undone.',
	},
	'wiki.wikis.get': {
		riskLevel: 'read',
		description:
			'Gets the wiki corresponding to the wiki ID or wiki name provided. Token scope: vso.wiki.',
	},
	'wiki.wikis.list': {
		riskLevel: 'read',
		description:
			'Gets all wikis in a project or collection. Token scope: vso.wiki.',
	},
	'wiki.wikis.update': {
		riskLevel: 'write',
		description:
			'Updates the wiki corresponding to the wiki ID or wiki name provided using the update parameters. Token scope: vso.wiki_write.',
	},
	'wit.accountMyWorkRecentActivity.list': {
		riskLevel: 'read',
		description: 'Gets recent work item activities. Token scope: vso.work.',
	},
	'wit.artifactLinkTypes.list': {
		riskLevel: 'read',
		description:
			'Get the list of work item tracking outbound artifact link types. Token scope: vso.work.',
	},
	'wit.artifactUriQuery.query': {
		riskLevel: 'read',
		description:
			'Queries work items linked to a given list of artifact URI. Token scope: vso.work.',
	},
	'wit.attachments.create': {
		riskLevel: 'write',
		description:
			'Uploads an attachment. On accounts with higher attachment upload limits (>130MB), you will need to use chunked upload. To upload an attachment in multiple chunks, you first need to Start a Chunked Upload and then follow the example from the Upload Chunk section. Token scope: vso.work_write.',
	},
	'wit.attachments.get': {
		riskLevel: 'read',
		description: 'Downloads an attachment. Token scope: vso.work.',
	},
	'wit.attachments.uploadChunk': {
		riskLevel: 'write',
		description:
			'Uploads an attachment chunk. Before performing Upload a Chunk, make sure to have an attachment id returned in Start a Chunked Upload example on Create section. Specify the byte range of the chunk using Content-Length. Token scope: vso.work_write.',
	},
	'wit.classificationNodes.createOrUpdate': {
		riskLevel: 'write',
		description:
			'Create new or update an existing classification node. Token scope: vso.work_write.',
	},
	'wit.classificationNodes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an existing classification node. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.classificationNodes.get': {
		riskLevel: 'read',
		description:
			'Gets the classification node for a given node path. Token scope: vso.work.',
	},
	'wit.classificationNodes.getClassificationNodes': {
		riskLevel: 'read',
		description:
			'Gets root classification nodes or list of classification nodes for a given list of nodes ids, for a given project. In case ids parameter is supplied you will get list of classification nodes for those ids. Otherwise you will get root classification nodes for this project. Token scope: vso.work.',
	},
	'wit.classificationNodes.getRootNodes': {
		riskLevel: 'read',
		description:
			'Gets root classification nodes under the project. Token scope: vso.work.',
	},
	'wit.classificationNodes.update': {
		riskLevel: 'write',
		description:
			'Update an existing classification node. Token scope: vso.work_write.',
	},
	'wit.commentReactionsEngagedUsers.list': {
		riskLevel: 'read',
		description:
			'Get users who reacted on the comment. Preview API (api-version 7.1-preview.1). Token scope: vso.work.',
	},
	'wit.comments.addComment': {
		riskLevel: 'write',
		description:
			'Add a comment on a work item. Preview API (api-version 7.1-preview.4). Token scope: vso.work_write.',
	},
	'wit.comments.addWorkItemComment': {
		riskLevel: 'write',
		description:
			'Add a comment on a work item. Preview API (api-version 7.1-preview.4). Token scope: vso.work_write.',
	},
	'wit.comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a comment on a work item. Preview API (api-version 7.1-preview.4). Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.comments.getComment': {
		riskLevel: 'read',
		description:
			'Returns a work item comment. Preview API (api-version 7.1-preview.4). Token scope: vso.work.',
	},
	'wit.comments.getComments': {
		riskLevel: 'read',
		description:
			'Returns a list of work item comments, pageable. Preview API (api-version 7.1-preview.4). Token scope: vso.work.',
	},
	'wit.comments.getCommentsBatch': {
		riskLevel: 'read',
		description:
			'Returns a list of work item comments by ids. Preview API (api-version 7.1-preview.4). Token scope: vso.work.',
	},
	'wit.comments.updateComment': {
		riskLevel: 'write',
		description:
			'Update a comment on a work item. Preview API (api-version 7.1-preview.4). Token scope: vso.work_write.',
	},
	'wit.comments.updateWorkItemComment': {
		riskLevel: 'write',
		description:
			'Update a comment on a work item. Preview API (api-version 7.1-preview.4). Token scope: vso.work_write.',
	},
	'wit.commentsReactions.create': {
		riskLevel: 'write',
		description:
			'Adds a new reaction to a comment. Preview API (api-version 7.1-preview.1). Token scope: vso.work_write.',
	},
	'wit.commentsReactions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes an existing reaction on a comment. Preview API (api-version 7.1-preview.1). Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.commentsReactions.list': {
		riskLevel: 'read',
		description:
			'Gets reactions of a comment. Preview API (api-version 7.1-preview.1). Token scope: vso.work.',
	},
	'wit.commentsVersions.get': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.work.',
	},
	'wit.commentsVersions.list': {
		riskLevel: 'read',
		description:
			'Preview API (api-version 7.1-preview.1). Token scope: vso.work.',
	},
	'wit.fields.create': {
		riskLevel: 'write',
		description: 'Create a new field. Token scope: vso.work_write.',
	},
	'wit.fields.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the field. To undelete a filed, see "Update Field" API. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.fields.get': {
		riskLevel: 'read',
		description: 'Gets information on a specific field. Token scope: vso.work.',
	},
	'wit.fields.list': {
		riskLevel: 'read',
		description:
			'Returns information for all fields. The project ID/name parameter is optional. Token scope: vso.work.',
	},
	'wit.fields.update': {
		riskLevel: 'write',
		description: 'Update a field. Token scope: vso.work_write.',
	},
	'wit.projectProcessMigration.migrateProjectsProcess': {
		riskLevel: 'write',
		description:
			'Migrates a project to a different process within the same OOB type. For example, you can only migrate a project from agile/custom-agile to agile/custom-agile. Token scope: vso.work_write.',
	},
	'wit.queries.create': {
		riskLevel: 'write',
		description:
			'Creates a query, or moves a query. Learn more about Work Item Query Language (WIQL) syntax here. Token scope: vso.work_write.',
	},
	'wit.queries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a query or a folder. This deletes any permission change on the deleted query or folder and any of its descendants if it is a folder. It is important to note that the deleted permission changes cannot be recovered upon undeleting the query or folder. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.queries.get': {
		riskLevel: 'read',
		description:
			'Retrieves an individual query and its children. Token scope: vso.work.',
	},
	'wit.queries.getQueriesBatch': {
		riskLevel: 'read',
		description:
			'Gets a list of queries by ids (Maximum 1000) Token scope: vso.work.',
	},
	'wit.queries.list': {
		riskLevel: 'read',
		description:
			'Gets the root queries and their children. Token scope: vso.work.',
	},
	'wit.queries.searchQueries': {
		riskLevel: 'read',
		description:
			'Searches all queries the user has access to in the current project. Token scope: vso.work.',
	},
	'wit.queries.update': {
		riskLevel: 'write',
		description:
			'Update a query or a folder. This allows you to update, rename and move queries and folders. Token scope: vso.work_write.',
	},
	'wit.recyclebin.destroyWorkItem': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Destroys the specified work item permanently from the Recycle Bin. This action can not be undone. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.recyclebin.get': {
		riskLevel: 'read',
		description:
			'Gets a deleted work item from Recycle Bin. Token scope: vso.work.',
	},
	'wit.recyclebin.getDeletedWorkItemShallowReferences': {
		riskLevel: 'read',
		description:
			'Gets a list of the IDs and the URLs of the deleted the work items in the Recycle Bin. Token scope: vso.work.',
	},
	'wit.recyclebin.getDeletedWorkItems': {
		riskLevel: 'read',
		description:
			'Gets the work items from the recycle bin, whose IDs have been specified in the parameters. Token scope: vso.work.',
	},
	'wit.recyclebin.restoreWorkItem': {
		riskLevel: 'destructive',
		description:
			'Restores the deleted work item from Recycle Bin. Token scope: vso.work_write.',
	},
	'wit.reportingWorkItemLinks.get': {
		riskLevel: 'read',
		description: 'Get a batch of work item links. Token scope: vso.work.',
	},
	'wit.reportingWorkItemRevisions.readReportingRevisionsGet': {
		riskLevel: 'read',
		description:
			'Get a batch of work item revisions with the option of including deleted items. Token scope: vso.work.',
	},
	'wit.reportingWorkItemRevisions.readReportingRevisionsPost': {
		riskLevel: 'read',
		description:
			'Get a batch of work item revisions. This request may be used if your list of fields is large enough that it may run the URL over the length limit. Token scope: vso.work.',
	},
	'wit.revisions.get': {
		riskLevel: 'read',
		description:
			'Returns a fully hydrated work item for the requested revision. Token scope: vso.work.',
	},
	'wit.revisions.list': {
		riskLevel: 'read',
		description:
			'Returns the list of fully hydrated work item revisions, paged. Token scope: vso.work.',
	},
	'wit.sendMail.sendMail': {
		riskLevel: 'destructive',
		description:
			'RESTful method to send mail for selected/queried work items. Token scope: vso.work.',
	},
	'wit.tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the tag for the project. Please note, that the deleted tag will be removed from all Work Items as well as Pull Requests. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.tags.get': {
		riskLevel: 'read',
		description: 'Get the tag for the project. Token scope: vso.work.',
	},
	'wit.tags.list': {
		riskLevel: 'read',
		description: 'Get all the tags for the project. Token scope: vso.work.',
	},
	'wit.tags.update': {
		riskLevel: 'write',
		description: 'Update the tag for the project. Token scope: vso.work_write.',
	},
	'wit.tempQueries.create': {
		riskLevel: 'write',
		description:
			'Creates a temporary query Learn more about Work Item Query Language (WIQL) syntax here. Token scope: vso.work_write.',
	},
	'wit.templates.create': {
		riskLevel: 'write',
		description: 'Creates a template. Token scope: vso.work_write.',
	},
	'wit.templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the template with given id. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.templates.get': {
		riskLevel: 'read',
		description: 'Gets the template with specified id. Token scope: vso.work.',
	},
	'wit.templates.list': {
		riskLevel: 'read',
		description:
			'Gets template. Token scope: vso.work. (GET /{project}/{team}/_apis/wit/templates)',
	},
	'wit.templates.replaceTemplate': {
		riskLevel: 'destructive',
		description: 'Replace template contents. Token scope: vso.work_write.',
	},
	'wit.updates.get': {
		riskLevel: 'read',
		description:
			'Returns a single update for a work item. Token scope: vso.work.',
	},
	'wit.updates.list': {
		riskLevel: 'read',
		description:
			'Returns a the deltas between work item revisions. Token scope: vso.work.',
	},
	'wit.wiql.queryById': {
		riskLevel: 'read',
		description:
			'Gets the results of the query given the query ID. Token scope: vso.work.',
	},
	'wit.wiql.queryByWiql': {
		riskLevel: 'read',
		description:
			'Gets the results of the query given its WIQL. Token scope: vso.work.',
	},
	'wit.workItemIcons.get': {
		riskLevel: 'read',
		description:
			'Get a work item icon given the friendly name and icon color. Token scope: vso.work.',
	},
	'wit.workItemIcons.list': {
		riskLevel: 'read',
		description: 'Get a list of all work item icons. Token scope: vso.work.',
	},
	'wit.workItemRelationTypes.get': {
		riskLevel: 'read',
		description:
			'Gets the work item relation type definition. Token scope: vso.work.',
	},
	'wit.workItemRelationTypes.list': {
		riskLevel: 'read',
		description: 'Gets the work item relation types. Token scope: vso.work.',
	},
	'wit.workItemRevisionsDiscussions.readReportingDiscussions': {
		riskLevel: 'read',
		description:
			'Token scope: vso.work. (GET /{project}/_apis/wit/reporting/workItemRevisions/discussions)',
	},
	'wit.workItemTransitions.list': {
		riskLevel: 'read',
		description:
			'Returns the next state on the given work item IDs. Token scope: vso.work.',
	},
	'wit.workItemTypeCategories.get': {
		riskLevel: 'read',
		description:
			'Get specific work item type category by name. Token scope: vso.work.',
	},
	'wit.workItemTypeCategories.list': {
		riskLevel: 'read',
		description: 'Get all work item type categories. Token scope: vso.work.',
	},
	'wit.workItemTypeStates.list': {
		riskLevel: 'read',
		description:
			'Returns the state names and colors for a work item type. Token scope: vso.work.',
	},
	'wit.workItemTypes.get': {
		riskLevel: 'read',
		description: 'Returns a work item type definition. Token scope: vso.work.',
	},
	'wit.workItemTypes.list': {
		riskLevel: 'read',
		description: 'Returns the list of work item types. Token scope: vso.work.',
	},
	'wit.workItemTypesField.get': {
		riskLevel: 'read',
		description:
			'Get a field for a work item type with detailed references. Token scope: vso.work.',
	},
	'wit.workItemTypesField.list': {
		riskLevel: 'read',
		description:
			'Get a list of fields for a work item type with detailed references. Token scope: vso.work.',
	},
	'wit.workItems.create': {
		riskLevel: 'write',
		description:
			'Creates a single work item. The body is a JSON Patch list: [{ op: "add", path: "/fields/System.Title", value: "..." }]. Token scope: vso.work_write.',
	},
	'wit.workItems.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified work item and sends it to the Recycle Bin, so that it can be restored back, if required. Optionally, if the destroy parameter has been set to true, it destroys the work item permanently. Token scope: vso.work_write. Cannot be undone.',
	},
	'wit.workItems.deleteWorkItems': {
		riskLevel: 'write',
		description:
			'Deletes specified work items and sends them to the Recycle Bin, so that it can be restored back, if required. Optionally, if the destroy parameter has been set to true, it destroys the work item permanently. Token scope: vso.work_write.',
	},
	'wit.workItems.getWorkItem': {
		riskLevel: 'read',
		description: 'Returns a single work item. Token scope: vso.work.',
	},
	'wit.workItems.getWorkItemTemplate': {
		riskLevel: 'read',
		description:
			'Returns a single work item from a template. Token scope: vso.work.',
	},
	'wit.workItems.getWorkItemsBatch': {
		riskLevel: 'read',
		description:
			'Gets work items for a list of work item ids (Maximum 200) Token scope: vso.work.',
	},
	'wit.workItems.list': {
		riskLevel: 'read',
		description:
			'Returns a list of work items (Maximum 200) Token scope: vso.work.',
	},
	'wit.workItems.update': {
		riskLevel: 'write',
		description:
			'Updates a single work item. The body is a JSON Patch list: [{ op: "add", path: "/fields/System.Title", value: "..." }]. Token scope: vso.work_write.',
	},
	'work.backlogconfiguration.get': {
		riskLevel: 'read',
		description:
			'Gets backlog configuration for a team. Token scope: vso.work.',
	},
	'work.backlogs.getBacklog': {
		riskLevel: 'read',
		description: 'Get a backlog level. Token scope: vso.work.',
	},
	'work.backlogs.getBacklogLevelWorkItems': {
		riskLevel: 'read',
		description:
			'Get a list of work items within a backlog level. Token scope: vso.work.',
	},
	'work.backlogs.list': {
		riskLevel: 'read',
		description: 'List all backlog levels. Token scope: vso.work.',
	},
	'work.boardcolumns.list': {
		riskLevel: 'read',
		description:
			'Get available board columns in a project. Token scope: vso.work.',
	},
	'work.boardparents.list': {
		riskLevel: 'read',
		description:
			'Returns the list of parent field filter model for the given list of workitem ids. Token scope: vso.work.',
	},
	'work.boardrows.list': {
		riskLevel: 'read',
		description:
			'Get available board rows in a project. Token scope: vso.work.',
	},
	'work.boards.get': {
		riskLevel: 'read',
		description:
			'Get board. Token scope: vso.work. (GET /{project}/{team}/_apis/work/boards/{id})',
	},
	'work.boards.list': {
		riskLevel: 'read',
		description:
			'Get boards. Token scope: vso.work. (GET /{project}/{team}/_apis/work/boards)',
	},
	'work.boards.setBoardOptions': {
		riskLevel: 'write',
		description: 'Update board options. Token scope: vso.work_write.',
	},
	'work.boardusersettings.get': {
		riskLevel: 'read',
		description:
			'Get board user settings for a board id. Token scope: vso.work.',
	},
	'work.boardusersettings.update': {
		riskLevel: 'write',
		description:
			"Update board user settings for the board id We don't want stakeholders to update board settings (currently just autorefresh). The BacklogManagement feature check validates this. Token scope: vso.work_write.",
	},
	'work.capacities.getCapacitiesWithIdentityRefAndTotals': {
		riskLevel: 'read',
		description:
			"Get a team's capacity including total capacity and days off. Token scope: vso.work.",
	},
	'work.capacities.getCapacityWithIdentityRef': {
		riskLevel: 'read',
		description: "Get a team member's capacity. Token scope: vso.work.",
	},
	'work.capacities.replaceCapacitiesWithIdentityRef': {
		riskLevel: 'destructive',
		description: "Replace a team's capacity. Token scope: vso.work_write.",
	},
	'work.capacities.update': {
		riskLevel: 'write',
		description:
			"Update a team member's capacity. Token scope: vso.work_write.",
	},
	'work.cardrulesettings.get': {
		riskLevel: 'read',
		description:
			'Get board card Rule settings for the board id or board by name. Token scope: vso.work.',
	},
	'work.cardrulesettings.updateBoardCardRuleSettings': {
		riskLevel: 'write',
		description:
			'Update board card Rule settings for the board id or board by name. Token scope: vso.work_write.',
	},
	'work.cardrulesettings.updateTaskboardCardRuleSettings': {
		riskLevel: 'write',
		description:
			'Update taskboard card Rule settings. Token scope: vso.work_write.',
	},
	'work.cardsettings.get': {
		riskLevel: 'read',
		description:
			'Get board card settings for the board id or board by name. Token scope: vso.work.',
	},
	'work.cardsettings.updateBoardCardSettings': {
		riskLevel: 'write',
		description:
			'Update board card settings for the board id or board by name. Token scope: vso.work_write.',
	},
	'work.cardsettings.updateTaskboardCardSettings': {
		riskLevel: 'write',
		description: 'Update taskboard card settings. Token scope: vso.work_write.',
	},
	'work.chartimages.getBoardChartImage': {
		riskLevel: 'read',
		description: 'Get a board chart image. Token scope: vso.work.',
	},
	'work.chartimages.getIterationChartImage': {
		riskLevel: 'read',
		description: 'Get an iteration chart image. Token scope: vso.work.',
	},
	'work.chartimages.getIterationsChartImage': {
		riskLevel: 'read',
		description: 'Get an iterations chart image. Token scope: vso.work.',
	},
	'work.charts.get': {
		riskLevel: 'read',
		description: 'Get a board chart. Token scope: vso.work.',
	},
	'work.charts.list': {
		riskLevel: 'read',
		description: 'Get board charts. Token scope: vso.work.',
	},
	'work.charts.update': {
		riskLevel: 'write',
		description: 'Update a board chart. Token scope: vso.work_write.',
	},
	'work.columns.list': {
		riskLevel: 'read',
		description: 'Get columns on a board. Token scope: vso.work.',
	},
	'work.columns.update': {
		riskLevel: 'write',
		description: 'Update columns on a board. Token scope: vso.work_write.',
	},
	'work.deliverytimeline.get': {
		riskLevel: 'read',
		description: 'Get Delivery View Data. Token scope: vso.work.',
	},
	'work.iterationcapacities.get': {
		riskLevel: 'read',
		description:
			"Get an iteration's capacity for all teams in iteration. Token scope: vso.work.",
	},
	'work.iterations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a team's iteration by iterationId. Token scope: vso.work_write. Cannot be undone.",
	},
	'work.iterations.get': {
		riskLevel: 'read',
		description: "Get team's iteration by iterationId. Token scope: vso.work.",
	},
	'work.iterations.getIterationWorkItems': {
		riskLevel: 'read',
		description: 'Get work items for iteration. Token scope: vso.work.',
	},
	'work.iterations.list': {
		riskLevel: 'read',
		description:
			"Get a team's iterations using timeframe filter. Token scope: vso.work.",
	},
	'work.iterations.postTeamIteration': {
		riskLevel: 'write',
		description: 'Add an iteration to the team. Token scope: vso.work_write.',
	},
	'work.plans.create': {
		riskLevel: 'write',
		description: 'Add a new plan for the team. Token scope: vso.work_write.',
	},
	'work.plans.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the specified plan. Token scope: vso.work_write. Cannot be undone.',
	},
	'work.plans.get': {
		riskLevel: 'read',
		description:
			'Get the information for the specified plan. Token scope: vso.work.',
	},
	'work.plans.list': {
		riskLevel: 'read',
		description:
			'Get the information for all the plans configured for the given team. Token scope: vso.work.',
	},
	'work.plans.update': {
		riskLevel: 'write',
		description:
			'Update the information for the specified plan. Token scope: vso.work_write.',
	},
	'work.processconfiguration.get': {
		riskLevel: 'read',
		description: 'Get process configuration. Token scope: vso.work.',
	},
	'work.rows.list': {
		riskLevel: 'read',
		description: 'Get rows on a board. Token scope: vso.work.',
	},
	'work.rows.update': {
		riskLevel: 'write',
		description: 'Update rows on a board. Token scope: vso.work_write.',
	},
	'work.taskboardColumns.get': {
		riskLevel: 'read',
		description:
			'Token scope: vso.work. (GET /{project}/{team}/_apis/work/taskboardcolumns)',
	},
	'work.taskboardColumns.update': {
		riskLevel: 'write',
		description:
			'Token scope: vso.work_write. (PUT /{project}/{team}/_apis/work/taskboardcolumns)',
	},
	'work.taskboardWorkItems.list': {
		riskLevel: 'read',
		description:
			'Token scope: vso.work. (GET /{project}/{team}/_apis/work/taskboardworkitems/{iterationId})',
	},
	'work.taskboardWorkItems.update': {
		riskLevel: 'write',
		description:
			'Token scope: vso.work_write. (PATCH /{project}/{team}/_apis/work/taskboardworkitems/{iterationId}/{workItemId})',
	},
	'work.teamdaysoff.get': {
		riskLevel: 'read',
		description: "Get team's days off for an iteration. Token scope: vso.work.",
	},
	'work.teamdaysoff.update': {
		riskLevel: 'write',
		description:
			"Set a team's days off for an iteration. Token scope: vso.work_write.",
	},
	'work.teamfieldvalues.get': {
		riskLevel: 'read',
		description:
			'Get a collection of team field values. Token scope: vso.work.',
	},
	'work.teamfieldvalues.update': {
		riskLevel: 'write',
		description: 'Update team field values. Token scope: vso.work_write.',
	},
	'work.teamsettings.get': {
		riskLevel: 'read',
		description: "Get a team's settings. Token scope: vso.work.",
	},
	'work.teamsettings.update': {
		riskLevel: 'write',
		description: "Update a team's settings. Token scope: vso.work_write.",
	},
	'work.workitemsorder.reorderBacklogWorkItems': {
		riskLevel: 'write',
		description:
			'Reorder Product Backlog/Boards Work Items. Token scope: vso.work_write.',
	},
	'work.workitemsorder.reorderIterationWorkItems': {
		riskLevel: 'write',
		description:
			'Reorder Sprint Backlog/Taskboard Work Items. Token scope: vso.work_write.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof azuredevopsEndpointsNested
>;
