// Generated endpoint registry for DeployHQ documented REST operations.
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { deployHQOperations } from './openapi-operations';
import { executeDeployHQOperation } from './runtime';

export const DeployHQEndpoints = {
	account: {
		getAccount: executeDeployHQOperation('account.getAccount'),
		replaceAccount: executeDeployHQOperation('account.replaceAccount'),
		updateAccount: executeDeployHQOperation('account.updateAccount'),
		billingStatusAccountBillingStatus: executeDeployHQOperation(
			'account.billingStatusAccountBillingStatus',
		),
		resetPasswordSubmitReset: executeDeployHQOperation(
			'account.resetPasswordSubmitReset',
		),
	},
	invoices: {
		listAccountInvoices: executeDeployHQOperation(
			'invoices.listAccountInvoices',
		),
		getAccountInvoice: executeDeployHQOperation('invoices.getAccountInvoice'),
	},
	networkAgents: {
		listAgents: executeDeployHQOperation('networkAgents.listAgents'),
		createAgent: executeDeployHQOperation('networkAgents.createAgent'),
		replaceAgent: executeDeployHQOperation('networkAgents.replaceAgent'),
		updateAgent: executeDeployHQOperation('networkAgents.updateAgent'),
		deleteAgent: executeDeployHQOperation('networkAgents.deleteAgent'),
		revokeAgent: executeDeployHQOperation('networkAgents.revokeAgent'),
	},
	signup: {
		createSignup: executeDeployHQOperation('signup.createSignup'),
	},
	beta: {
		createBetumEnrollment: executeDeployHQOperation(
			'beta.createBetumEnrollment',
		),
	},
	detection: {
		createDetection: executeDeployHQOperation('detection.createDetection'),
	},
	folders: {
		listFolders: executeDeployHQOperation('folders.listFolders'),
		createFolder: executeDeployHQOperation('folders.createFolder'),
		replaceFolder: executeDeployHQOperation('folders.replaceFolder'),
		updateFolder: executeDeployHQOperation('folders.updateFolder'),
		deleteFolder: executeDeployHQOperation('folders.deleteFolder'),
	},
	globalBuildCommands: {
		listGlobalBuildCommands: executeDeployHQOperation(
			'globalBuildCommands.listGlobalBuildCommands',
		),
		createGlobalBuildCommand: executeDeployHQOperation(
			'globalBuildCommands.createGlobalBuildCommand',
		),
		getGlobalBuildCommand: executeDeployHQOperation(
			'globalBuildCommands.getGlobalBuildCommand',
		),
		replaceGlobalBuildCommand: executeDeployHQOperation(
			'globalBuildCommands.replaceGlobalBuildCommand',
		),
		updateGlobalBuildCommand: executeDeployHQOperation(
			'globalBuildCommands.updateGlobalBuildCommand',
		),
		deleteGlobalBuildCommand: executeDeployHQOperation(
			'globalBuildCommands.deleteGlobalBuildCommand',
		),
	},
	globalConfigFiles: {
		listGlobalConfigFiles: executeDeployHQOperation(
			'globalConfigFiles.listGlobalConfigFiles',
		),
		createGlobalConfigFile: executeDeployHQOperation(
			'globalConfigFiles.createGlobalConfigFile',
		),
		getGlobalConfigFile: executeDeployHQOperation(
			'globalConfigFiles.getGlobalConfigFile',
		),
		replaceGlobalConfigFile: executeDeployHQOperation(
			'globalConfigFiles.replaceGlobalConfigFile',
		),
		updateGlobalConfigFile: executeDeployHQOperation(
			'globalConfigFiles.updateGlobalConfigFile',
		),
		deleteGlobalConfigFile: executeDeployHQOperation(
			'globalConfigFiles.deleteGlobalConfigFile',
		),
	},
	globalEnvironmentVariables: {
		listGlobalEnvironmentVariables: executeDeployHQOperation(
			'globalEnvironmentVariables.listGlobalEnvironmentVariables',
		),
		createGlobalEnvironmentVariable: executeDeployHQOperation(
			'globalEnvironmentVariables.createGlobalEnvironmentVariable',
		),
		getGlobalEnvironmentVariable: executeDeployHQOperation(
			'globalEnvironmentVariables.getGlobalEnvironmentVariable',
		),
		replaceGlobalEnvironmentVariable: executeDeployHQOperation(
			'globalEnvironmentVariables.replaceGlobalEnvironmentVariable',
		),
		updateGlobalEnvironmentVariable: executeDeployHQOperation(
			'globalEnvironmentVariables.updateGlobalEnvironmentVariable',
		),
		deleteGlobalEnvironmentVariable: executeDeployHQOperation(
			'globalEnvironmentVariables.deleteGlobalEnvironmentVariable',
		),
	},
	globalServers: {
		listGlobalServers: executeDeployHQOperation(
			'globalServers.listGlobalServers',
		),
		createGlobalServer: executeDeployHQOperation(
			'globalServers.createGlobalServer',
		),
		getGlobalServer: executeDeployHQOperation('globalServers.getGlobalServer'),
		replaceGlobalServer: executeDeployHQOperation(
			'globalServers.replaceGlobalServer',
		),
		updateGlobalServer: executeDeployHQOperation(
			'globalServers.updateGlobalServer',
		),
		deleteGlobalServer: executeDeployHQOperation(
			'globalServers.deleteGlobalServer',
		),
		copyToProjectGlobalServer: executeDeployHQOperation(
			'globalServers.copyToProjectGlobalServer',
		),
	},
	globalSshCommands: {
		listGlobalSshCommands: executeDeployHQOperation(
			'globalSshCommands.listGlobalSshCommands',
		),
		createGlobalSshCommand: executeDeployHQOperation(
			'globalSshCommands.createGlobalSshCommand',
		),
		getGlobalSshCommand: executeDeployHQOperation(
			'globalSshCommands.getGlobalSshCommand',
		),
		replaceGlobalSshCommand: executeDeployHQOperation(
			'globalSshCommands.replaceGlobalSshCommand',
		),
		updateGlobalSshCommand: executeDeployHQOperation(
			'globalSshCommands.updateGlobalSshCommand',
		),
		deleteGlobalSshCommand: executeDeployHQOperation(
			'globalSshCommands.deleteGlobalSshCommand',
		),
	},
	hostedResources: {
		listHostedResources: executeDeployHQOperation(
			'hostedResources.listHostedResources',
		),
		getHostedResource: executeDeployHQOperation(
			'hostedResources.getHostedResource',
		),
		retryProvisionHostedResourceRetryProvision: executeDeployHQOperation(
			'hostedResources.retryProvisionHostedResourceRetryProvision',
		),
		syncHostedResourceSync: executeDeployHQOperation(
			'hostedResources.syncHostedResourceSync',
		),
	},
	ipRanges: {
		listIpRanges: executeDeployHQOperation('ipRanges.listIpRanges'),
	},
	languageVersions: {
		listLanguageVersions: executeDeployHQOperation(
			'languageVersions.listLanguageVersions',
		),
		replaceProjectBuildConfigurationBuildLanguage: executeDeployHQOperation(
			'languageVersions.replaceProjectBuildConfigurationBuildLanguage',
		),
		updateProjectBuildConfigurationBuildLanguage: executeDeployHQOperation(
			'languageVersions.updateProjectBuildConfigurationBuildLanguage',
		),
		replaceProjectBuildLanguage: executeDeployHQOperation(
			'languageVersions.replaceProjectBuildLanguage',
		),
		updateProjectBuildLanguage: executeDeployHQOperation(
			'languageVersions.updateProjectBuildLanguage',
		),
		listProjectLanguageVersions: executeDeployHQOperation(
			'languageVersions.listProjectLanguageVersions',
		),
	},
	managedHosting: {
		listManagedHostingRegions: executeDeployHQOperation(
			'managedHosting.listManagedHostingRegions',
		),
		listManagedHostingSizes: executeDeployHQOperation(
			'managedHosting.listManagedHostingSizes',
		),
	},
	packages: {
		listPackages: executeDeployHQOperation('packages.listPackages'),
	},
	profile: {
		getProfile: executeDeployHQOperation('profile.getProfile'),
		replaceProfile: executeDeployHQOperation('profile.replaceProfile'),
		updateProfile: executeDeployHQOperation('profile.updateProfile'),
	},
	projects: {
		listProjects: executeDeployHQOperation('projects.listProjects'),
		createProject: executeDeployHQOperation('projects.createProject'),
		getProject: executeDeployHQOperation('projects.getProject'),
		replaceProject: executeDeployHQOperation('projects.replaceProject'),
		updateProject: executeDeployHQOperation('projects.updateProject'),
		deleteProject: executeDeployHQOperation('projects.deleteProject'),
		aiDeploymentOverviewProject: executeDeployHQOperation(
			'projects.aiDeploymentOverviewProject',
		),
		listProjectInsights: executeDeployHQOperation(
			'projects.listProjectInsights',
		),
		regenerateKeyProjectRegenerateKey: executeDeployHQOperation(
			'projects.regenerateKeyProjectRegenerateKey',
		),
		starProject: executeDeployHQOperation('projects.starProject'),
		undeployedChangesProjectUndeployedChange: executeDeployHQOperation(
			'projects.undeployedChangesProjectUndeployedChange',
		),
		uploadKeyProject: executeDeployHQOperation('projects.uploadKeyProject'),
		statusBadgeStatusBadge: executeDeployHQOperation(
			'projects.statusBadgeStatusBadge',
		),
		statusBadgeStatusBadgeByIdentifier: executeDeployHQOperation(
			'projects.statusBadgeStatusBadgeByIdentifier',
		),
	},
	automaticDeployments: {
		listProjectAutoDeployments: executeDeployHQOperation(
			'automaticDeployments.listProjectAutoDeployments',
		),
		createProjectAutoDeployment: executeDeployHQOperation(
			'automaticDeployments.createProjectAutoDeployment',
		),
	},
	buildCacheFiles: {
		listProjectBuildCacheFiles: executeDeployHQOperation(
			'buildCacheFiles.listProjectBuildCacheFiles',
		),
		createProjectBuildCacheFile: executeDeployHQOperation(
			'buildCacheFiles.createProjectBuildCacheFile',
		),
		replaceProjectBuildCacheFile: executeDeployHQOperation(
			'buildCacheFiles.replaceProjectBuildCacheFile',
		),
		updateProjectBuildCacheFile: executeDeployHQOperation(
			'buildCacheFiles.updateProjectBuildCacheFile',
		),
		deleteProjectBuildCacheFile: executeDeployHQOperation(
			'buildCacheFiles.deleteProjectBuildCacheFile',
		),
	},
	buildCommands: {
		listProjectBuildCommands: executeDeployHQOperation(
			'buildCommands.listProjectBuildCommands',
		),
		createProjectBuildCommand: executeDeployHQOperation(
			'buildCommands.createProjectBuildCommand',
		),
		linkGlobalProjectBuildCommandLinkGlobal: executeDeployHQOperation(
			'buildCommands.linkGlobalProjectBuildCommandLinkGlobal',
		),
		unlinkGlobalProjectBuildCommandUnlinkGlobal: executeDeployHQOperation(
			'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal',
		),
		replaceProjectBuildCommand: executeDeployHQOperation(
			'buildCommands.replaceProjectBuildCommand',
		),
		updateProjectBuildCommand: executeDeployHQOperation(
			'buildCommands.updateProjectBuildCommand',
		),
		deleteProjectBuildCommand: executeDeployHQOperation(
			'buildCommands.deleteProjectBuildCommand',
		),
	},
	buildConfigurations: {
		getProjectBuildConfiguration: executeDeployHQOperation(
			'buildConfigurations.getProjectBuildConfiguration',
		),
		listProjectBuildConfigurations: executeDeployHQOperation(
			'buildConfigurations.listProjectBuildConfigurations',
		),
		createProjectBuildConfiguration: executeDeployHQOperation(
			'buildConfigurations.createProjectBuildConfiguration',
		),
		getProjectBuildConfigurationById: executeDeployHQOperation(
			'buildConfigurations.getProjectBuildConfigurationById',
		),
		replaceProjectBuildConfiguration: executeDeployHQOperation(
			'buildConfigurations.replaceProjectBuildConfiguration',
		),
		updateProjectBuildConfiguration: executeDeployHQOperation(
			'buildConfigurations.updateProjectBuildConfiguration',
		),
		deleteProjectBuildConfiguration: executeDeployHQOperation(
			'buildConfigurations.deleteProjectBuildConfiguration',
		),
	},
	buildKnownHosts: {
		listProjectBuildKnownHosts: executeDeployHQOperation(
			'buildKnownHosts.listProjectBuildKnownHosts',
		),
		createProjectBuildKnownHost: executeDeployHQOperation(
			'buildKnownHosts.createProjectBuildKnownHost',
		),
		deleteProjectBuildKnownHost: executeDeployHQOperation(
			'buildKnownHosts.deleteProjectBuildKnownHost',
		),
	},
	sshCommands: {
		listProjectCommands: executeDeployHQOperation(
			'sshCommands.listProjectCommands',
		),
		createProjectCommand: executeDeployHQOperation(
			'sshCommands.createProjectCommand',
		),
		linkGlobalProjectCommandLinkGlobal: executeDeployHQOperation(
			'sshCommands.linkGlobalProjectCommandLinkGlobal',
		),
		unlinkGlobalProjectCommandUnlinkGlobal: executeDeployHQOperation(
			'sshCommands.unlinkGlobalProjectCommandUnlinkGlobal',
		),
		getProjectCommandById: executeDeployHQOperation(
			'sshCommands.getProjectCommandById',
		),
		replaceProjectCommand: executeDeployHQOperation(
			'sshCommands.replaceProjectCommand',
		),
		updateProjectCommand: executeDeployHQOperation(
			'sshCommands.updateProjectCommand',
		),
		deleteProjectCommand: executeDeployHQOperation(
			'sshCommands.deleteProjectCommand',
		),
		listProjectSshCommands: executeDeployHQOperation(
			'sshCommands.listProjectSshCommands',
		),
		createProjectSshCommand: executeDeployHQOperation(
			'sshCommands.createProjectSshCommand',
		),
		getProjectSshCommandById: executeDeployHQOperation(
			'sshCommands.getProjectSshCommandById',
		),
		replaceProjectSshCommand: executeDeployHQOperation(
			'sshCommands.replaceProjectSshCommand',
		),
		updateProjectSshCommand: executeDeployHQOperation(
			'sshCommands.updateProjectSshCommand',
		),
		deleteProjectSshCommand: executeDeployHQOperation(
			'sshCommands.deleteProjectSshCommand',
		),
	},
	configFiles: {
		listProjectConfigFiles: executeDeployHQOperation(
			'configFiles.listProjectConfigFiles',
		),
		createProjectConfigFile: executeDeployHQOperation(
			'configFiles.createProjectConfigFile',
		),
		getProjectConfigFileById: executeDeployHQOperation(
			'configFiles.getProjectConfigFileById',
		),
		replaceProjectConfigFile: executeDeployHQOperation(
			'configFiles.replaceProjectConfigFile',
		),
		updateProjectConfigFile: executeDeployHQOperation(
			'configFiles.updateProjectConfigFile',
		),
		deleteProjectConfigFile: executeDeployHQOperation(
			'configFiles.deleteProjectConfigFile',
		),
	},
	deploymentChecks: {
		listProjectDeploymentChecks: executeDeployHQOperation(
			'deploymentChecks.listProjectDeploymentChecks',
		),
		createProjectDeploymentCheck: executeDeployHQOperation(
			'deploymentChecks.createProjectDeploymentCheck',
		),
		getProjectDeploymentCheckById: executeDeployHQOperation(
			'deploymentChecks.getProjectDeploymentCheckById',
		),
		replaceProjectDeploymentCheck: executeDeployHQOperation(
			'deploymentChecks.replaceProjectDeploymentCheck',
		),
		updateProjectDeploymentCheck: executeDeployHQOperation(
			'deploymentChecks.updateProjectDeploymentCheck',
		),
		deleteProjectDeploymentCheck: executeDeployHQOperation(
			'deploymentChecks.deleteProjectDeploymentCheck',
		),
	},
	deployments: {
		listProjectDeployments: executeDeployHQOperation(
			'deployments.listProjectDeployments',
		),
		createProjectDeployment: executeDeployHQOperation(
			'deployments.createProjectDeployment',
		),
		listProjectDeploymentStepLogs: executeDeployHQOperation(
			'deployments.listProjectDeploymentStepLogs',
		),
		getProjectDeploymentById: executeDeployHQOperation(
			'deployments.getProjectDeploymentById',
		),
		abortProjectDeployment: executeDeployHQOperation(
			'deployments.abortProjectDeployment',
		),
		retryProjectDeploymentRetry: executeDeployHQOperation(
			'deployments.retryProjectDeploymentRetry',
		),
		rollbackProjectDeployment: executeDeployHQOperation(
			'deployments.rollbackProjectDeployment',
		),
	},
	environmentVariables: {
		listProjectEnvironmentVariables: executeDeployHQOperation(
			'environmentVariables.listProjectEnvironmentVariables',
		),
		createProjectEnvironmentVariable: executeDeployHQOperation(
			'environmentVariables.createProjectEnvironmentVariable',
		),
		getProjectEnvironmentVariableById: executeDeployHQOperation(
			'environmentVariables.getProjectEnvironmentVariableById',
		),
		replaceProjectEnvironmentVariable: executeDeployHQOperation(
			'environmentVariables.replaceProjectEnvironmentVariable',
		),
		updateProjectEnvironmentVariable: executeDeployHQOperation(
			'environmentVariables.updateProjectEnvironmentVariable',
		),
		deleteProjectEnvironmentVariable: executeDeployHQOperation(
			'environmentVariables.deleteProjectEnvironmentVariable',
		),
	},
	excludedFiles: {
		listProjectExcludedFiles: executeDeployHQOperation(
			'excludedFiles.listProjectExcludedFiles',
		),
		createProjectExcludedFile: executeDeployHQOperation(
			'excludedFiles.createProjectExcludedFile',
		),
		getProjectExcludedFileById: executeDeployHQOperation(
			'excludedFiles.getProjectExcludedFileById',
		),
		replaceProjectExcludedFile: executeDeployHQOperation(
			'excludedFiles.replaceProjectExcludedFile',
		),
		updateProjectExcludedFile: executeDeployHQOperation(
			'excludedFiles.updateProjectExcludedFile',
		),
		deleteProjectExcludedFile: executeDeployHQOperation(
			'excludedFiles.deleteProjectExcludedFile',
		),
	},
	integrations: {
		listProjectIntegrations: executeDeployHQOperation(
			'integrations.listProjectIntegrations',
		),
		createProjectIntegration: executeDeployHQOperation(
			'integrations.createProjectIntegration',
		),
		getProjectIntegrationById: executeDeployHQOperation(
			'integrations.getProjectIntegrationById',
		),
		replaceProjectIntegration: executeDeployHQOperation(
			'integrations.replaceProjectIntegration',
		),
		updateProjectIntegration: executeDeployHQOperation(
			'integrations.updateProjectIntegration',
		),
		deleteProjectIntegration: executeDeployHQOperation(
			'integrations.deleteProjectIntegration',
		),
	},
	repositories: {
		getProjectRepository: executeDeployHQOperation(
			'repositories.getProjectRepository',
		),
		createProjectRepository: executeDeployHQOperation(
			'repositories.createProjectRepository',
		),
		replaceProjectRepository: executeDeployHQOperation(
			'repositories.replaceProjectRepository',
		),
		updateProjectRepository: executeDeployHQOperation(
			'repositories.updateProjectRepository',
		),
		branchesProjectRepository: executeDeployHQOperation(
			'repositories.branchesProjectRepository',
		),
		commitInfoProjectRepository: executeDeployHQOperation(
			'repositories.commitInfoProjectRepository',
		),
		latestRevisionProjectRepository: executeDeployHQOperation(
			'repositories.latestRevisionProjectRepository',
		),
		recentCommitsProjectRepository: executeDeployHQOperation(
			'repositories.recentCommitsProjectRepository',
		),
	},
	scheduledDeployments: {
		listProjectScheduledDeployments: executeDeployHQOperation(
			'scheduledDeployments.listProjectScheduledDeployments',
		),
		createProjectScheduledDeployment: executeDeployHQOperation(
			'scheduledDeployments.createProjectScheduledDeployment',
		),
		getProjectScheduledDeploymentById: executeDeployHQOperation(
			'scheduledDeployments.getProjectScheduledDeploymentById',
		),
		replaceProjectScheduledDeployment: executeDeployHQOperation(
			'scheduledDeployments.replaceProjectScheduledDeployment',
		),
		updateProjectScheduledDeployment: executeDeployHQOperation(
			'scheduledDeployments.updateProjectScheduledDeployment',
		),
		deleteProjectScheduledDeployment: executeDeployHQOperation(
			'scheduledDeployments.deleteProjectScheduledDeployment',
		),
	},
	serverGroups: {
		listProjectServerGroups: executeDeployHQOperation(
			'serverGroups.listProjectServerGroups',
		),
		createProjectServerGroup: executeDeployHQOperation(
			'serverGroups.createProjectServerGroup',
		),
		getProjectServerGroupById: executeDeployHQOperation(
			'serverGroups.getProjectServerGroupById',
		),
		replaceProjectServerGroup: executeDeployHQOperation(
			'serverGroups.replaceProjectServerGroup',
		),
		updateProjectServerGroup: executeDeployHQOperation(
			'serverGroups.updateProjectServerGroup',
		),
		deleteProjectServerGroup: executeDeployHQOperation(
			'serverGroups.deleteProjectServerGroup',
		),
	},
	servers: {
		listProjectServers: executeDeployHQOperation('servers.listProjectServers'),
		createProjectServer: executeDeployHQOperation(
			'servers.createProjectServer',
		),
		getProjectServerById: executeDeployHQOperation(
			'servers.getProjectServerById',
		),
		replaceProjectServer: executeDeployHQOperation(
			'servers.replaceProjectServer',
		),
		updateProjectServer: executeDeployHQOperation(
			'servers.updateProjectServer',
		),
		deleteProjectServer: executeDeployHQOperation(
			'servers.deleteProjectServer',
		),
		resetHostKeyProjectServer: executeDeployHQOperation(
			'servers.resetHostKeyProjectServer',
		),
		serverMetricsProjectServerServerMetric: executeDeployHQOperation(
			'servers.serverMetricsProjectServerServerMetric',
		),
	},
	testAccess: {
		createProjectServerTestAccess: executeDeployHQOperation(
			'testAccess.createProjectServerTestAccess',
		),
		createProjectTestAccess: executeDeployHQOperation(
			'testAccess.createProjectTestAccess',
		),
		getProjectTestAccess: executeDeployHQOperation(
			'testAccess.getProjectTestAccess',
		),
	},
	security: {
		createSecurityApiKey: executeDeployHQOperation(
			'security.createSecurityApiKey',
		),
		deleteSecurityApiKey: executeDeployHQOperation(
			'security.deleteSecurityApiKey',
		),
	},
	sshKeys: {
		listSshKeys: executeDeployHQOperation('sshKeys.listSshKeys'),
		createSshKey: executeDeployHQOperation('sshKeys.createSshKey'),
		deleteSshKey: executeDeployHQOperation('sshKeys.deleteSshKey'),
		downloadPrivateKeySshKeyDownloadPrivateKey: executeDeployHQOperation(
			'sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey',
		),
	},
	teams: {
		listTeams: executeDeployHQOperation('teams.listTeams'),
		createTeam: executeDeployHQOperation('teams.createTeam'),
		getTeam: executeDeployHQOperation('teams.getTeam'),
		replaceTeam: executeDeployHQOperation('teams.replaceTeam'),
		updateTeam: executeDeployHQOperation('teams.updateTeam'),
		deleteTeam: executeDeployHQOperation('teams.deleteTeam'),
	},
	templates: {
		listTemplates: executeDeployHQOperation('templates.listTemplates'),
		createTemplate: executeDeployHQOperation('templates.createTemplate'),
		publicTemplatesTemplate: executeDeployHQOperation(
			'templates.publicTemplatesTemplate',
		),
		replaceTemplate: executeDeployHQOperation('templates.replaceTemplate'),
		updateTemplate: executeDeployHQOperation('templates.updateTemplate'),
		deleteTemplate: executeDeployHQOperation('templates.deleteTemplate'),
		showPublicTemplateTemplatePublic: executeDeployHQOperation(
			'templates.showPublicTemplateTemplatePublic',
		),
	},
	users: {
		listUsers: executeDeployHQOperation('users.listUsers'),
		createUser: executeDeployHQOperation('users.createUser'),
		getUser: executeDeployHQOperation('users.getUser'),
		replaceUser: executeDeployHQOperation('users.replaceUser'),
		updateUser: executeDeployHQOperation('users.updateUser'),
		deleteUser: executeDeployHQOperation('users.deleteUser'),
		resendInvitationUserResendInvitation: executeDeployHQOperation(
			'users.resendInvitationUserResendInvitation',
		),
	},
	zones: {
		listZones: executeDeployHQOperation('zones.listZones'),
	},
} as const;

export const deployHQEndpointSchemas = {
	'account.getAccount': {
		input: deployHQOperations['account.getAccount'].inputSchema,
		output: deployHQOperations['account.getAccount'].outputSchema,
	},
	'account.replaceAccount': {
		input: deployHQOperations['account.replaceAccount'].inputSchema,
		output: deployHQOperations['account.replaceAccount'].outputSchema,
	},
	'account.updateAccount': {
		input: deployHQOperations['account.updateAccount'].inputSchema,
		output: deployHQOperations['account.updateAccount'].outputSchema,
	},
	'account.billingStatusAccountBillingStatus': {
		input:
			deployHQOperations['account.billingStatusAccountBillingStatus']
				.inputSchema,
		output:
			deployHQOperations['account.billingStatusAccountBillingStatus']
				.outputSchema,
	},
	'invoices.listAccountInvoices': {
		input: deployHQOperations['invoices.listAccountInvoices'].inputSchema,
		output: deployHQOperations['invoices.listAccountInvoices'].outputSchema,
	},
	'invoices.getAccountInvoice': {
		input: deployHQOperations['invoices.getAccountInvoice'].inputSchema,
		output: deployHQOperations['invoices.getAccountInvoice'].outputSchema,
	},
	'networkAgents.listAgents': {
		input: deployHQOperations['networkAgents.listAgents'].inputSchema,
		output: deployHQOperations['networkAgents.listAgents'].outputSchema,
	},
	'networkAgents.createAgent': {
		input: deployHQOperations['networkAgents.createAgent'].inputSchema,
		output: deployHQOperations['networkAgents.createAgent'].outputSchema,
	},
	'networkAgents.replaceAgent': {
		input: deployHQOperations['networkAgents.replaceAgent'].inputSchema,
		output: deployHQOperations['networkAgents.replaceAgent'].outputSchema,
	},
	'networkAgents.updateAgent': {
		input: deployHQOperations['networkAgents.updateAgent'].inputSchema,
		output: deployHQOperations['networkAgents.updateAgent'].outputSchema,
	},
	'networkAgents.deleteAgent': {
		input: deployHQOperations['networkAgents.deleteAgent'].inputSchema,
		output: deployHQOperations['networkAgents.deleteAgent'].outputSchema,
	},
	'networkAgents.revokeAgent': {
		input: deployHQOperations['networkAgents.revokeAgent'].inputSchema,
		output: deployHQOperations['networkAgents.revokeAgent'].outputSchema,
	},
	'signup.createSignup': {
		input: deployHQOperations['signup.createSignup'].inputSchema,
		output: deployHQOperations['signup.createSignup'].outputSchema,
	},
	'beta.createBetumEnrollment': {
		input: deployHQOperations['beta.createBetumEnrollment'].inputSchema,
		output: deployHQOperations['beta.createBetumEnrollment'].outputSchema,
	},
	'detection.createDetection': {
		input: deployHQOperations['detection.createDetection'].inputSchema,
		output: deployHQOperations['detection.createDetection'].outputSchema,
	},
	'folders.listFolders': {
		input: deployHQOperations['folders.listFolders'].inputSchema,
		output: deployHQOperations['folders.listFolders'].outputSchema,
	},
	'folders.createFolder': {
		input: deployHQOperations['folders.createFolder'].inputSchema,
		output: deployHQOperations['folders.createFolder'].outputSchema,
	},
	'folders.replaceFolder': {
		input: deployHQOperations['folders.replaceFolder'].inputSchema,
		output: deployHQOperations['folders.replaceFolder'].outputSchema,
	},
	'folders.updateFolder': {
		input: deployHQOperations['folders.updateFolder'].inputSchema,
		output: deployHQOperations['folders.updateFolder'].outputSchema,
	},
	'folders.deleteFolder': {
		input: deployHQOperations['folders.deleteFolder'].inputSchema,
		output: deployHQOperations['folders.deleteFolder'].outputSchema,
	},
	'globalBuildCommands.listGlobalBuildCommands': {
		input:
			deployHQOperations['globalBuildCommands.listGlobalBuildCommands']
				.inputSchema,
		output:
			deployHQOperations['globalBuildCommands.listGlobalBuildCommands']
				.outputSchema,
	},
	'globalBuildCommands.createGlobalBuildCommand': {
		input:
			deployHQOperations['globalBuildCommands.createGlobalBuildCommand']
				.inputSchema,
		output:
			deployHQOperations['globalBuildCommands.createGlobalBuildCommand']
				.outputSchema,
	},
	'globalBuildCommands.getGlobalBuildCommand': {
		input:
			deployHQOperations['globalBuildCommands.getGlobalBuildCommand']
				.inputSchema,
		output:
			deployHQOperations['globalBuildCommands.getGlobalBuildCommand']
				.outputSchema,
	},
	'globalBuildCommands.replaceGlobalBuildCommand': {
		input:
			deployHQOperations['globalBuildCommands.replaceGlobalBuildCommand']
				.inputSchema,
		output:
			deployHQOperations['globalBuildCommands.replaceGlobalBuildCommand']
				.outputSchema,
	},
	'globalBuildCommands.updateGlobalBuildCommand': {
		input:
			deployHQOperations['globalBuildCommands.updateGlobalBuildCommand']
				.inputSchema,
		output:
			deployHQOperations['globalBuildCommands.updateGlobalBuildCommand']
				.outputSchema,
	},
	'globalBuildCommands.deleteGlobalBuildCommand': {
		input:
			deployHQOperations['globalBuildCommands.deleteGlobalBuildCommand']
				.inputSchema,
		output:
			deployHQOperations['globalBuildCommands.deleteGlobalBuildCommand']
				.outputSchema,
	},
	'globalConfigFiles.listGlobalConfigFiles': {
		input:
			deployHQOperations['globalConfigFiles.listGlobalConfigFiles'].inputSchema,
		output:
			deployHQOperations['globalConfigFiles.listGlobalConfigFiles']
				.outputSchema,
	},
	'globalConfigFiles.createGlobalConfigFile': {
		input:
			deployHQOperations['globalConfigFiles.createGlobalConfigFile']
				.inputSchema,
		output:
			deployHQOperations['globalConfigFiles.createGlobalConfigFile']
				.outputSchema,
	},
	'globalConfigFiles.getGlobalConfigFile': {
		input:
			deployHQOperations['globalConfigFiles.getGlobalConfigFile'].inputSchema,
		output:
			deployHQOperations['globalConfigFiles.getGlobalConfigFile'].outputSchema,
	},
	'globalConfigFiles.replaceGlobalConfigFile': {
		input:
			deployHQOperations['globalConfigFiles.replaceGlobalConfigFile']
				.inputSchema,
		output:
			deployHQOperations['globalConfigFiles.replaceGlobalConfigFile']
				.outputSchema,
	},
	'globalConfigFiles.updateGlobalConfigFile': {
		input:
			deployHQOperations['globalConfigFiles.updateGlobalConfigFile']
				.inputSchema,
		output:
			deployHQOperations['globalConfigFiles.updateGlobalConfigFile']
				.outputSchema,
	},
	'globalConfigFiles.deleteGlobalConfigFile': {
		input:
			deployHQOperations['globalConfigFiles.deleteGlobalConfigFile']
				.inputSchema,
		output:
			deployHQOperations['globalConfigFiles.deleteGlobalConfigFile']
				.outputSchema,
	},
	'globalEnvironmentVariables.listGlobalEnvironmentVariables': {
		input:
			deployHQOperations[
				'globalEnvironmentVariables.listGlobalEnvironmentVariables'
			].inputSchema,
		output:
			deployHQOperations[
				'globalEnvironmentVariables.listGlobalEnvironmentVariables'
			].outputSchema,
	},
	'globalEnvironmentVariables.createGlobalEnvironmentVariable': {
		input:
			deployHQOperations[
				'globalEnvironmentVariables.createGlobalEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'globalEnvironmentVariables.createGlobalEnvironmentVariable'
			].outputSchema,
	},
	'globalEnvironmentVariables.getGlobalEnvironmentVariable': {
		input:
			deployHQOperations[
				'globalEnvironmentVariables.getGlobalEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'globalEnvironmentVariables.getGlobalEnvironmentVariable'
			].outputSchema,
	},
	'globalEnvironmentVariables.replaceGlobalEnvironmentVariable': {
		input:
			deployHQOperations[
				'globalEnvironmentVariables.replaceGlobalEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'globalEnvironmentVariables.replaceGlobalEnvironmentVariable'
			].outputSchema,
	},
	'globalEnvironmentVariables.updateGlobalEnvironmentVariable': {
		input:
			deployHQOperations[
				'globalEnvironmentVariables.updateGlobalEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'globalEnvironmentVariables.updateGlobalEnvironmentVariable'
			].outputSchema,
	},
	'globalEnvironmentVariables.deleteGlobalEnvironmentVariable': {
		input:
			deployHQOperations[
				'globalEnvironmentVariables.deleteGlobalEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'globalEnvironmentVariables.deleteGlobalEnvironmentVariable'
			].outputSchema,
	},
	'globalServers.listGlobalServers': {
		input: deployHQOperations['globalServers.listGlobalServers'].inputSchema,
		output: deployHQOperations['globalServers.listGlobalServers'].outputSchema,
	},
	'globalServers.createGlobalServer': {
		input: deployHQOperations['globalServers.createGlobalServer'].inputSchema,
		output: deployHQOperations['globalServers.createGlobalServer'].outputSchema,
	},
	'globalServers.getGlobalServer': {
		input: deployHQOperations['globalServers.getGlobalServer'].inputSchema,
		output: deployHQOperations['globalServers.getGlobalServer'].outputSchema,
	},
	'globalServers.replaceGlobalServer': {
		input: deployHQOperations['globalServers.replaceGlobalServer'].inputSchema,
		output:
			deployHQOperations['globalServers.replaceGlobalServer'].outputSchema,
	},
	'globalServers.updateGlobalServer': {
		input: deployHQOperations['globalServers.updateGlobalServer'].inputSchema,
		output: deployHQOperations['globalServers.updateGlobalServer'].outputSchema,
	},
	'globalServers.deleteGlobalServer': {
		input: deployHQOperations['globalServers.deleteGlobalServer'].inputSchema,
		output: deployHQOperations['globalServers.deleteGlobalServer'].outputSchema,
	},
	'globalServers.copyToProjectGlobalServer': {
		input:
			deployHQOperations['globalServers.copyToProjectGlobalServer'].inputSchema,
		output:
			deployHQOperations['globalServers.copyToProjectGlobalServer']
				.outputSchema,
	},
	'globalSshCommands.listGlobalSshCommands': {
		input:
			deployHQOperations['globalSshCommands.listGlobalSshCommands'].inputSchema,
		output:
			deployHQOperations['globalSshCommands.listGlobalSshCommands']
				.outputSchema,
	},
	'globalSshCommands.createGlobalSshCommand': {
		input:
			deployHQOperations['globalSshCommands.createGlobalSshCommand']
				.inputSchema,
		output:
			deployHQOperations['globalSshCommands.createGlobalSshCommand']
				.outputSchema,
	},
	'globalSshCommands.getGlobalSshCommand': {
		input:
			deployHQOperations['globalSshCommands.getGlobalSshCommand'].inputSchema,
		output:
			deployHQOperations['globalSshCommands.getGlobalSshCommand'].outputSchema,
	},
	'globalSshCommands.replaceGlobalSshCommand': {
		input:
			deployHQOperations['globalSshCommands.replaceGlobalSshCommand']
				.inputSchema,
		output:
			deployHQOperations['globalSshCommands.replaceGlobalSshCommand']
				.outputSchema,
	},
	'globalSshCommands.updateGlobalSshCommand': {
		input:
			deployHQOperations['globalSshCommands.updateGlobalSshCommand']
				.inputSchema,
		output:
			deployHQOperations['globalSshCommands.updateGlobalSshCommand']
				.outputSchema,
	},
	'globalSshCommands.deleteGlobalSshCommand': {
		input:
			deployHQOperations['globalSshCommands.deleteGlobalSshCommand']
				.inputSchema,
		output:
			deployHQOperations['globalSshCommands.deleteGlobalSshCommand']
				.outputSchema,
	},
	'hostedResources.listHostedResources': {
		input:
			deployHQOperations['hostedResources.listHostedResources'].inputSchema,
		output:
			deployHQOperations['hostedResources.listHostedResources'].outputSchema,
	},
	'hostedResources.getHostedResource': {
		input: deployHQOperations['hostedResources.getHostedResource'].inputSchema,
		output:
			deployHQOperations['hostedResources.getHostedResource'].outputSchema,
	},
	'hostedResources.retryProvisionHostedResourceRetryProvision': {
		input:
			deployHQOperations[
				'hostedResources.retryProvisionHostedResourceRetryProvision'
			].inputSchema,
		output:
			deployHQOperations[
				'hostedResources.retryProvisionHostedResourceRetryProvision'
			].outputSchema,
	},
	'hostedResources.syncHostedResourceSync': {
		input:
			deployHQOperations['hostedResources.syncHostedResourceSync'].inputSchema,
		output:
			deployHQOperations['hostedResources.syncHostedResourceSync'].outputSchema,
	},
	'ipRanges.listIpRanges': {
		input: deployHQOperations['ipRanges.listIpRanges'].inputSchema,
		output: deployHQOperations['ipRanges.listIpRanges'].outputSchema,
	},
	'languageVersions.listLanguageVersions': {
		input:
			deployHQOperations['languageVersions.listLanguageVersions'].inputSchema,
		output:
			deployHQOperations['languageVersions.listLanguageVersions'].outputSchema,
	},
	'managedHosting.listManagedHostingRegions': {
		input:
			deployHQOperations['managedHosting.listManagedHostingRegions']
				.inputSchema,
		output:
			deployHQOperations['managedHosting.listManagedHostingRegions']
				.outputSchema,
	},
	'managedHosting.listManagedHostingSizes': {
		input:
			deployHQOperations['managedHosting.listManagedHostingSizes'].inputSchema,
		output:
			deployHQOperations['managedHosting.listManagedHostingSizes'].outputSchema,
	},
	'packages.listPackages': {
		input: deployHQOperations['packages.listPackages'].inputSchema,
		output: deployHQOperations['packages.listPackages'].outputSchema,
	},
	'profile.getProfile': {
		input: deployHQOperations['profile.getProfile'].inputSchema,
		output: deployHQOperations['profile.getProfile'].outputSchema,
	},
	'profile.replaceProfile': {
		input: deployHQOperations['profile.replaceProfile'].inputSchema,
		output: deployHQOperations['profile.replaceProfile'].outputSchema,
	},
	'profile.updateProfile': {
		input: deployHQOperations['profile.updateProfile'].inputSchema,
		output: deployHQOperations['profile.updateProfile'].outputSchema,
	},
	'projects.listProjects': {
		input: deployHQOperations['projects.listProjects'].inputSchema,
		output: deployHQOperations['projects.listProjects'].outputSchema,
	},
	'projects.createProject': {
		input: deployHQOperations['projects.createProject'].inputSchema,
		output: deployHQOperations['projects.createProject'].outputSchema,
	},
	'projects.getProject': {
		input: deployHQOperations['projects.getProject'].inputSchema,
		output: deployHQOperations['projects.getProject'].outputSchema,
	},
	'projects.replaceProject': {
		input: deployHQOperations['projects.replaceProject'].inputSchema,
		output: deployHQOperations['projects.replaceProject'].outputSchema,
	},
	'projects.updateProject': {
		input: deployHQOperations['projects.updateProject'].inputSchema,
		output: deployHQOperations['projects.updateProject'].outputSchema,
	},
	'projects.deleteProject': {
		input: deployHQOperations['projects.deleteProject'].inputSchema,
		output: deployHQOperations['projects.deleteProject'].outputSchema,
	},
	'projects.aiDeploymentOverviewProject': {
		input:
			deployHQOperations['projects.aiDeploymentOverviewProject'].inputSchema,
		output:
			deployHQOperations['projects.aiDeploymentOverviewProject'].outputSchema,
	},
	'projects.listProjectInsights': {
		input: deployHQOperations['projects.listProjectInsights'].inputSchema,
		output: deployHQOperations['projects.listProjectInsights'].outputSchema,
	},
	'projects.regenerateKeyProjectRegenerateKey': {
		input:
			deployHQOperations['projects.regenerateKeyProjectRegenerateKey']
				.inputSchema,
		output:
			deployHQOperations['projects.regenerateKeyProjectRegenerateKey']
				.outputSchema,
	},
	'projects.starProject': {
		input: deployHQOperations['projects.starProject'].inputSchema,
		output: deployHQOperations['projects.starProject'].outputSchema,
	},
	'projects.undeployedChangesProjectUndeployedChange': {
		input:
			deployHQOperations['projects.undeployedChangesProjectUndeployedChange']
				.inputSchema,
		output:
			deployHQOperations['projects.undeployedChangesProjectUndeployedChange']
				.outputSchema,
	},
	'projects.uploadKeyProject': {
		input: deployHQOperations['projects.uploadKeyProject'].inputSchema,
		output: deployHQOperations['projects.uploadKeyProject'].outputSchema,
	},
	'automaticDeployments.listProjectAutoDeployments': {
		input:
			deployHQOperations['automaticDeployments.listProjectAutoDeployments']
				.inputSchema,
		output:
			deployHQOperations['automaticDeployments.listProjectAutoDeployments']
				.outputSchema,
	},
	'automaticDeployments.createProjectAutoDeployment': {
		input:
			deployHQOperations['automaticDeployments.createProjectAutoDeployment']
				.inputSchema,
		output:
			deployHQOperations['automaticDeployments.createProjectAutoDeployment']
				.outputSchema,
	},
	'buildCacheFiles.listProjectBuildCacheFiles': {
		input:
			deployHQOperations['buildCacheFiles.listProjectBuildCacheFiles']
				.inputSchema,
		output:
			deployHQOperations['buildCacheFiles.listProjectBuildCacheFiles']
				.outputSchema,
	},
	'buildCacheFiles.createProjectBuildCacheFile': {
		input:
			deployHQOperations['buildCacheFiles.createProjectBuildCacheFile']
				.inputSchema,
		output:
			deployHQOperations['buildCacheFiles.createProjectBuildCacheFile']
				.outputSchema,
	},
	'buildCacheFiles.replaceProjectBuildCacheFile': {
		input:
			deployHQOperations['buildCacheFiles.replaceProjectBuildCacheFile']
				.inputSchema,
		output:
			deployHQOperations['buildCacheFiles.replaceProjectBuildCacheFile']
				.outputSchema,
	},
	'buildCacheFiles.updateProjectBuildCacheFile': {
		input:
			deployHQOperations['buildCacheFiles.updateProjectBuildCacheFile']
				.inputSchema,
		output:
			deployHQOperations['buildCacheFiles.updateProjectBuildCacheFile']
				.outputSchema,
	},
	'buildCacheFiles.deleteProjectBuildCacheFile': {
		input:
			deployHQOperations['buildCacheFiles.deleteProjectBuildCacheFile']
				.inputSchema,
		output:
			deployHQOperations['buildCacheFiles.deleteProjectBuildCacheFile']
				.outputSchema,
	},
	'buildCommands.listProjectBuildCommands': {
		input:
			deployHQOperations['buildCommands.listProjectBuildCommands'].inputSchema,
		output:
			deployHQOperations['buildCommands.listProjectBuildCommands'].outputSchema,
	},
	'buildCommands.createProjectBuildCommand': {
		input:
			deployHQOperations['buildCommands.createProjectBuildCommand'].inputSchema,
		output:
			deployHQOperations['buildCommands.createProjectBuildCommand']
				.outputSchema,
	},
	'buildCommands.linkGlobalProjectBuildCommandLinkGlobal': {
		input:
			deployHQOperations[
				'buildCommands.linkGlobalProjectBuildCommandLinkGlobal'
			].inputSchema,
		output:
			deployHQOperations[
				'buildCommands.linkGlobalProjectBuildCommandLinkGlobal'
			].outputSchema,
	},
	'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal': {
		input:
			deployHQOperations[
				'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal'
			].inputSchema,
		output:
			deployHQOperations[
				'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal'
			].outputSchema,
	},
	'buildCommands.replaceProjectBuildCommand': {
		input:
			deployHQOperations['buildCommands.replaceProjectBuildCommand']
				.inputSchema,
		output:
			deployHQOperations['buildCommands.replaceProjectBuildCommand']
				.outputSchema,
	},
	'buildCommands.updateProjectBuildCommand': {
		input:
			deployHQOperations['buildCommands.updateProjectBuildCommand'].inputSchema,
		output:
			deployHQOperations['buildCommands.updateProjectBuildCommand']
				.outputSchema,
	},
	'buildCommands.deleteProjectBuildCommand': {
		input:
			deployHQOperations['buildCommands.deleteProjectBuildCommand'].inputSchema,
		output:
			deployHQOperations['buildCommands.deleteProjectBuildCommand']
				.outputSchema,
	},
	'buildConfigurations.getProjectBuildConfiguration': {
		input:
			deployHQOperations['buildConfigurations.getProjectBuildConfiguration']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.getProjectBuildConfiguration']
				.outputSchema,
	},
	'buildConfigurations.listProjectBuildConfigurations': {
		input:
			deployHQOperations['buildConfigurations.listProjectBuildConfigurations']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.listProjectBuildConfigurations']
				.outputSchema,
	},
	'buildConfigurations.createProjectBuildConfiguration': {
		input:
			deployHQOperations['buildConfigurations.createProjectBuildConfiguration']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.createProjectBuildConfiguration']
				.outputSchema,
	},
	'buildConfigurations.getProjectBuildConfigurationById': {
		input:
			deployHQOperations['buildConfigurations.getProjectBuildConfigurationById']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.getProjectBuildConfigurationById']
				.outputSchema,
	},
	'buildConfigurations.replaceProjectBuildConfiguration': {
		input:
			deployHQOperations['buildConfigurations.replaceProjectBuildConfiguration']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.replaceProjectBuildConfiguration']
				.outputSchema,
	},
	'buildConfigurations.updateProjectBuildConfiguration': {
		input:
			deployHQOperations['buildConfigurations.updateProjectBuildConfiguration']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.updateProjectBuildConfiguration']
				.outputSchema,
	},
	'buildConfigurations.deleteProjectBuildConfiguration': {
		input:
			deployHQOperations['buildConfigurations.deleteProjectBuildConfiguration']
				.inputSchema,
		output:
			deployHQOperations['buildConfigurations.deleteProjectBuildConfiguration']
				.outputSchema,
	},
	'languageVersions.replaceProjectBuildConfigurationBuildLanguage': {
		input:
			deployHQOperations[
				'languageVersions.replaceProjectBuildConfigurationBuildLanguage'
			].inputSchema,
		output:
			deployHQOperations[
				'languageVersions.replaceProjectBuildConfigurationBuildLanguage'
			].outputSchema,
	},
	'languageVersions.updateProjectBuildConfigurationBuildLanguage': {
		input:
			deployHQOperations[
				'languageVersions.updateProjectBuildConfigurationBuildLanguage'
			].inputSchema,
		output:
			deployHQOperations[
				'languageVersions.updateProjectBuildConfigurationBuildLanguage'
			].outputSchema,
	},
	'buildKnownHosts.listProjectBuildKnownHosts': {
		input:
			deployHQOperations['buildKnownHosts.listProjectBuildKnownHosts']
				.inputSchema,
		output:
			deployHQOperations['buildKnownHosts.listProjectBuildKnownHosts']
				.outputSchema,
	},
	'buildKnownHosts.createProjectBuildKnownHost': {
		input:
			deployHQOperations['buildKnownHosts.createProjectBuildKnownHost']
				.inputSchema,
		output:
			deployHQOperations['buildKnownHosts.createProjectBuildKnownHost']
				.outputSchema,
	},
	'buildKnownHosts.deleteProjectBuildKnownHost': {
		input:
			deployHQOperations['buildKnownHosts.deleteProjectBuildKnownHost']
				.inputSchema,
		output:
			deployHQOperations['buildKnownHosts.deleteProjectBuildKnownHost']
				.outputSchema,
	},
	'languageVersions.replaceProjectBuildLanguage': {
		input:
			deployHQOperations['languageVersions.replaceProjectBuildLanguage']
				.inputSchema,
		output:
			deployHQOperations['languageVersions.replaceProjectBuildLanguage']
				.outputSchema,
	},
	'languageVersions.updateProjectBuildLanguage': {
		input:
			deployHQOperations['languageVersions.updateProjectBuildLanguage']
				.inputSchema,
		output:
			deployHQOperations['languageVersions.updateProjectBuildLanguage']
				.outputSchema,
	},
	'sshCommands.listProjectCommands': {
		input: deployHQOperations['sshCommands.listProjectCommands'].inputSchema,
		output: deployHQOperations['sshCommands.listProjectCommands'].outputSchema,
	},
	'sshCommands.createProjectCommand': {
		input: deployHQOperations['sshCommands.createProjectCommand'].inputSchema,
		output: deployHQOperations['sshCommands.createProjectCommand'].outputSchema,
	},
	'sshCommands.linkGlobalProjectCommandLinkGlobal': {
		input:
			deployHQOperations['sshCommands.linkGlobalProjectCommandLinkGlobal']
				.inputSchema,
		output:
			deployHQOperations['sshCommands.linkGlobalProjectCommandLinkGlobal']
				.outputSchema,
	},
	'sshCommands.unlinkGlobalProjectCommandUnlinkGlobal': {
		input:
			deployHQOperations['sshCommands.unlinkGlobalProjectCommandUnlinkGlobal']
				.inputSchema,
		output:
			deployHQOperations['sshCommands.unlinkGlobalProjectCommandUnlinkGlobal']
				.outputSchema,
	},
	'sshCommands.getProjectCommandById': {
		input: deployHQOperations['sshCommands.getProjectCommandById'].inputSchema,
		output:
			deployHQOperations['sshCommands.getProjectCommandById'].outputSchema,
	},
	'sshCommands.replaceProjectCommand': {
		input: deployHQOperations['sshCommands.replaceProjectCommand'].inputSchema,
		output:
			deployHQOperations['sshCommands.replaceProjectCommand'].outputSchema,
	},
	'sshCommands.updateProjectCommand': {
		input: deployHQOperations['sshCommands.updateProjectCommand'].inputSchema,
		output: deployHQOperations['sshCommands.updateProjectCommand'].outputSchema,
	},
	'sshCommands.deleteProjectCommand': {
		input: deployHQOperations['sshCommands.deleteProjectCommand'].inputSchema,
		output: deployHQOperations['sshCommands.deleteProjectCommand'].outputSchema,
	},
	'configFiles.listProjectConfigFiles': {
		input: deployHQOperations['configFiles.listProjectConfigFiles'].inputSchema,
		output:
			deployHQOperations['configFiles.listProjectConfigFiles'].outputSchema,
	},
	'configFiles.createProjectConfigFile': {
		input:
			deployHQOperations['configFiles.createProjectConfigFile'].inputSchema,
		output:
			deployHQOperations['configFiles.createProjectConfigFile'].outputSchema,
	},
	'configFiles.getProjectConfigFileById': {
		input:
			deployHQOperations['configFiles.getProjectConfigFileById'].inputSchema,
		output:
			deployHQOperations['configFiles.getProjectConfigFileById'].outputSchema,
	},
	'configFiles.replaceProjectConfigFile': {
		input:
			deployHQOperations['configFiles.replaceProjectConfigFile'].inputSchema,
		output:
			deployHQOperations['configFiles.replaceProjectConfigFile'].outputSchema,
	},
	'configFiles.updateProjectConfigFile': {
		input:
			deployHQOperations['configFiles.updateProjectConfigFile'].inputSchema,
		output:
			deployHQOperations['configFiles.updateProjectConfigFile'].outputSchema,
	},
	'configFiles.deleteProjectConfigFile': {
		input:
			deployHQOperations['configFiles.deleteProjectConfigFile'].inputSchema,
		output:
			deployHQOperations['configFiles.deleteProjectConfigFile'].outputSchema,
	},
	'deploymentChecks.listProjectDeploymentChecks': {
		input:
			deployHQOperations['deploymentChecks.listProjectDeploymentChecks']
				.inputSchema,
		output:
			deployHQOperations['deploymentChecks.listProjectDeploymentChecks']
				.outputSchema,
	},
	'deploymentChecks.createProjectDeploymentCheck': {
		input:
			deployHQOperations['deploymentChecks.createProjectDeploymentCheck']
				.inputSchema,
		output:
			deployHQOperations['deploymentChecks.createProjectDeploymentCheck']
				.outputSchema,
	},
	'deploymentChecks.getProjectDeploymentCheckById': {
		input:
			deployHQOperations['deploymentChecks.getProjectDeploymentCheckById']
				.inputSchema,
		output:
			deployHQOperations['deploymentChecks.getProjectDeploymentCheckById']
				.outputSchema,
	},
	'deploymentChecks.replaceProjectDeploymentCheck': {
		input:
			deployHQOperations['deploymentChecks.replaceProjectDeploymentCheck']
				.inputSchema,
		output:
			deployHQOperations['deploymentChecks.replaceProjectDeploymentCheck']
				.outputSchema,
	},
	'deploymentChecks.updateProjectDeploymentCheck': {
		input:
			deployHQOperations['deploymentChecks.updateProjectDeploymentCheck']
				.inputSchema,
		output:
			deployHQOperations['deploymentChecks.updateProjectDeploymentCheck']
				.outputSchema,
	},
	'deploymentChecks.deleteProjectDeploymentCheck': {
		input:
			deployHQOperations['deploymentChecks.deleteProjectDeploymentCheck']
				.inputSchema,
		output:
			deployHQOperations['deploymentChecks.deleteProjectDeploymentCheck']
				.outputSchema,
	},
	'deployments.listProjectDeployments': {
		input: deployHQOperations['deployments.listProjectDeployments'].inputSchema,
		output:
			deployHQOperations['deployments.listProjectDeployments'].outputSchema,
	},
	'deployments.createProjectDeployment': {
		input:
			deployHQOperations['deployments.createProjectDeployment'].inputSchema,
		output:
			deployHQOperations['deployments.createProjectDeployment'].outputSchema,
	},
	'deployments.listProjectDeploymentStepLogs': {
		input:
			deployHQOperations['deployments.listProjectDeploymentStepLogs']
				.inputSchema,
		output:
			deployHQOperations['deployments.listProjectDeploymentStepLogs']
				.outputSchema,
	},
	'deployments.getProjectDeploymentById': {
		input:
			deployHQOperations['deployments.getProjectDeploymentById'].inputSchema,
		output:
			deployHQOperations['deployments.getProjectDeploymentById'].outputSchema,
	},
	'deployments.abortProjectDeployment': {
		input: deployHQOperations['deployments.abortProjectDeployment'].inputSchema,
		output:
			deployHQOperations['deployments.abortProjectDeployment'].outputSchema,
	},
	'deployments.retryProjectDeploymentRetry': {
		input:
			deployHQOperations['deployments.retryProjectDeploymentRetry'].inputSchema,
		output:
			deployHQOperations['deployments.retryProjectDeploymentRetry']
				.outputSchema,
	},
	'deployments.rollbackProjectDeployment': {
		input:
			deployHQOperations['deployments.rollbackProjectDeployment'].inputSchema,
		output:
			deployHQOperations['deployments.rollbackProjectDeployment'].outputSchema,
	},
	'environmentVariables.listProjectEnvironmentVariables': {
		input:
			deployHQOperations['environmentVariables.listProjectEnvironmentVariables']
				.inputSchema,
		output:
			deployHQOperations['environmentVariables.listProjectEnvironmentVariables']
				.outputSchema,
	},
	'environmentVariables.createProjectEnvironmentVariable': {
		input:
			deployHQOperations[
				'environmentVariables.createProjectEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'environmentVariables.createProjectEnvironmentVariable'
			].outputSchema,
	},
	'environmentVariables.getProjectEnvironmentVariableById': {
		input:
			deployHQOperations[
				'environmentVariables.getProjectEnvironmentVariableById'
			].inputSchema,
		output:
			deployHQOperations[
				'environmentVariables.getProjectEnvironmentVariableById'
			].outputSchema,
	},
	'environmentVariables.replaceProjectEnvironmentVariable': {
		input:
			deployHQOperations[
				'environmentVariables.replaceProjectEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'environmentVariables.replaceProjectEnvironmentVariable'
			].outputSchema,
	},
	'environmentVariables.updateProjectEnvironmentVariable': {
		input:
			deployHQOperations[
				'environmentVariables.updateProjectEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'environmentVariables.updateProjectEnvironmentVariable'
			].outputSchema,
	},
	'environmentVariables.deleteProjectEnvironmentVariable': {
		input:
			deployHQOperations[
				'environmentVariables.deleteProjectEnvironmentVariable'
			].inputSchema,
		output:
			deployHQOperations[
				'environmentVariables.deleteProjectEnvironmentVariable'
			].outputSchema,
	},
	'excludedFiles.listProjectExcludedFiles': {
		input:
			deployHQOperations['excludedFiles.listProjectExcludedFiles'].inputSchema,
		output:
			deployHQOperations['excludedFiles.listProjectExcludedFiles'].outputSchema,
	},
	'excludedFiles.createProjectExcludedFile': {
		input:
			deployHQOperations['excludedFiles.createProjectExcludedFile'].inputSchema,
		output:
			deployHQOperations['excludedFiles.createProjectExcludedFile']
				.outputSchema,
	},
	'excludedFiles.getProjectExcludedFileById': {
		input:
			deployHQOperations['excludedFiles.getProjectExcludedFileById']
				.inputSchema,
		output:
			deployHQOperations['excludedFiles.getProjectExcludedFileById']
				.outputSchema,
	},
	'excludedFiles.replaceProjectExcludedFile': {
		input:
			deployHQOperations['excludedFiles.replaceProjectExcludedFile']
				.inputSchema,
		output:
			deployHQOperations['excludedFiles.replaceProjectExcludedFile']
				.outputSchema,
	},
	'excludedFiles.updateProjectExcludedFile': {
		input:
			deployHQOperations['excludedFiles.updateProjectExcludedFile'].inputSchema,
		output:
			deployHQOperations['excludedFiles.updateProjectExcludedFile']
				.outputSchema,
	},
	'excludedFiles.deleteProjectExcludedFile': {
		input:
			deployHQOperations['excludedFiles.deleteProjectExcludedFile'].inputSchema,
		output:
			deployHQOperations['excludedFiles.deleteProjectExcludedFile']
				.outputSchema,
	},
	'integrations.listProjectIntegrations': {
		input:
			deployHQOperations['integrations.listProjectIntegrations'].inputSchema,
		output:
			deployHQOperations['integrations.listProjectIntegrations'].outputSchema,
	},
	'integrations.createProjectIntegration': {
		input:
			deployHQOperations['integrations.createProjectIntegration'].inputSchema,
		output:
			deployHQOperations['integrations.createProjectIntegration'].outputSchema,
	},
	'integrations.getProjectIntegrationById': {
		input:
			deployHQOperations['integrations.getProjectIntegrationById'].inputSchema,
		output:
			deployHQOperations['integrations.getProjectIntegrationById'].outputSchema,
	},
	'integrations.replaceProjectIntegration': {
		input:
			deployHQOperations['integrations.replaceProjectIntegration'].inputSchema,
		output:
			deployHQOperations['integrations.replaceProjectIntegration'].outputSchema,
	},
	'integrations.updateProjectIntegration': {
		input:
			deployHQOperations['integrations.updateProjectIntegration'].inputSchema,
		output:
			deployHQOperations['integrations.updateProjectIntegration'].outputSchema,
	},
	'integrations.deleteProjectIntegration': {
		input:
			deployHQOperations['integrations.deleteProjectIntegration'].inputSchema,
		output:
			deployHQOperations['integrations.deleteProjectIntegration'].outputSchema,
	},
	'languageVersions.listProjectLanguageVersions': {
		input:
			deployHQOperations['languageVersions.listProjectLanguageVersions']
				.inputSchema,
		output:
			deployHQOperations['languageVersions.listProjectLanguageVersions']
				.outputSchema,
	},
	'repositories.getProjectRepository': {
		input: deployHQOperations['repositories.getProjectRepository'].inputSchema,
		output:
			deployHQOperations['repositories.getProjectRepository'].outputSchema,
	},
	'repositories.createProjectRepository': {
		input:
			deployHQOperations['repositories.createProjectRepository'].inputSchema,
		output:
			deployHQOperations['repositories.createProjectRepository'].outputSchema,
	},
	'repositories.replaceProjectRepository': {
		input:
			deployHQOperations['repositories.replaceProjectRepository'].inputSchema,
		output:
			deployHQOperations['repositories.replaceProjectRepository'].outputSchema,
	},
	'repositories.updateProjectRepository': {
		input:
			deployHQOperations['repositories.updateProjectRepository'].inputSchema,
		output:
			deployHQOperations['repositories.updateProjectRepository'].outputSchema,
	},
	'repositories.branchesProjectRepository': {
		input:
			deployHQOperations['repositories.branchesProjectRepository'].inputSchema,
		output:
			deployHQOperations['repositories.branchesProjectRepository'].outputSchema,
	},
	'repositories.commitInfoProjectRepository': {
		input:
			deployHQOperations['repositories.commitInfoProjectRepository']
				.inputSchema,
		output:
			deployHQOperations['repositories.commitInfoProjectRepository']
				.outputSchema,
	},
	'repositories.latestRevisionProjectRepository': {
		input:
			deployHQOperations['repositories.latestRevisionProjectRepository']
				.inputSchema,
		output:
			deployHQOperations['repositories.latestRevisionProjectRepository']
				.outputSchema,
	},
	'repositories.recentCommitsProjectRepository': {
		input:
			deployHQOperations['repositories.recentCommitsProjectRepository']
				.inputSchema,
		output:
			deployHQOperations['repositories.recentCommitsProjectRepository']
				.outputSchema,
	},
	'scheduledDeployments.listProjectScheduledDeployments': {
		input:
			deployHQOperations['scheduledDeployments.listProjectScheduledDeployments']
				.inputSchema,
		output:
			deployHQOperations['scheduledDeployments.listProjectScheduledDeployments']
				.outputSchema,
	},
	'scheduledDeployments.createProjectScheduledDeployment': {
		input:
			deployHQOperations[
				'scheduledDeployments.createProjectScheduledDeployment'
			].inputSchema,
		output:
			deployHQOperations[
				'scheduledDeployments.createProjectScheduledDeployment'
			].outputSchema,
	},
	'scheduledDeployments.getProjectScheduledDeploymentById': {
		input:
			deployHQOperations[
				'scheduledDeployments.getProjectScheduledDeploymentById'
			].inputSchema,
		output:
			deployHQOperations[
				'scheduledDeployments.getProjectScheduledDeploymentById'
			].outputSchema,
	},
	'scheduledDeployments.replaceProjectScheduledDeployment': {
		input:
			deployHQOperations[
				'scheduledDeployments.replaceProjectScheduledDeployment'
			].inputSchema,
		output:
			deployHQOperations[
				'scheduledDeployments.replaceProjectScheduledDeployment'
			].outputSchema,
	},
	'scheduledDeployments.updateProjectScheduledDeployment': {
		input:
			deployHQOperations[
				'scheduledDeployments.updateProjectScheduledDeployment'
			].inputSchema,
		output:
			deployHQOperations[
				'scheduledDeployments.updateProjectScheduledDeployment'
			].outputSchema,
	},
	'scheduledDeployments.deleteProjectScheduledDeployment': {
		input:
			deployHQOperations[
				'scheduledDeployments.deleteProjectScheduledDeployment'
			].inputSchema,
		output:
			deployHQOperations[
				'scheduledDeployments.deleteProjectScheduledDeployment'
			].outputSchema,
	},
	'serverGroups.listProjectServerGroups': {
		input:
			deployHQOperations['serverGroups.listProjectServerGroups'].inputSchema,
		output:
			deployHQOperations['serverGroups.listProjectServerGroups'].outputSchema,
	},
	'serverGroups.createProjectServerGroup': {
		input:
			deployHQOperations['serverGroups.createProjectServerGroup'].inputSchema,
		output:
			deployHQOperations['serverGroups.createProjectServerGroup'].outputSchema,
	},
	'serverGroups.getProjectServerGroupById': {
		input:
			deployHQOperations['serverGroups.getProjectServerGroupById'].inputSchema,
		output:
			deployHQOperations['serverGroups.getProjectServerGroupById'].outputSchema,
	},
	'serverGroups.replaceProjectServerGroup': {
		input:
			deployHQOperations['serverGroups.replaceProjectServerGroup'].inputSchema,
		output:
			deployHQOperations['serverGroups.replaceProjectServerGroup'].outputSchema,
	},
	'serverGroups.updateProjectServerGroup': {
		input:
			deployHQOperations['serverGroups.updateProjectServerGroup'].inputSchema,
		output:
			deployHQOperations['serverGroups.updateProjectServerGroup'].outputSchema,
	},
	'serverGroups.deleteProjectServerGroup': {
		input:
			deployHQOperations['serverGroups.deleteProjectServerGroup'].inputSchema,
		output:
			deployHQOperations['serverGroups.deleteProjectServerGroup'].outputSchema,
	},
	'servers.listProjectServers': {
		input: deployHQOperations['servers.listProjectServers'].inputSchema,
		output: deployHQOperations['servers.listProjectServers'].outputSchema,
	},
	'servers.createProjectServer': {
		input: deployHQOperations['servers.createProjectServer'].inputSchema,
		output: deployHQOperations['servers.createProjectServer'].outputSchema,
	},
	'servers.getProjectServerById': {
		input: deployHQOperations['servers.getProjectServerById'].inputSchema,
		output: deployHQOperations['servers.getProjectServerById'].outputSchema,
	},
	'servers.replaceProjectServer': {
		input: deployHQOperations['servers.replaceProjectServer'].inputSchema,
		output: deployHQOperations['servers.replaceProjectServer'].outputSchema,
	},
	'servers.updateProjectServer': {
		input: deployHQOperations['servers.updateProjectServer'].inputSchema,
		output: deployHQOperations['servers.updateProjectServer'].outputSchema,
	},
	'servers.deleteProjectServer': {
		input: deployHQOperations['servers.deleteProjectServer'].inputSchema,
		output: deployHQOperations['servers.deleteProjectServer'].outputSchema,
	},
	'servers.resetHostKeyProjectServer': {
		input: deployHQOperations['servers.resetHostKeyProjectServer'].inputSchema,
		output:
			deployHQOperations['servers.resetHostKeyProjectServer'].outputSchema,
	},
	'servers.serverMetricsProjectServerServerMetric': {
		input:
			deployHQOperations['servers.serverMetricsProjectServerServerMetric']
				.inputSchema,
		output:
			deployHQOperations['servers.serverMetricsProjectServerServerMetric']
				.outputSchema,
	},
	'testAccess.createProjectServerTestAccess': {
		input:
			deployHQOperations['testAccess.createProjectServerTestAccess']
				.inputSchema,
		output:
			deployHQOperations['testAccess.createProjectServerTestAccess']
				.outputSchema,
	},
	'sshCommands.listProjectSshCommands': {
		input: deployHQOperations['sshCommands.listProjectSshCommands'].inputSchema,
		output:
			deployHQOperations['sshCommands.listProjectSshCommands'].outputSchema,
	},
	'sshCommands.createProjectSshCommand': {
		input:
			deployHQOperations['sshCommands.createProjectSshCommand'].inputSchema,
		output:
			deployHQOperations['sshCommands.createProjectSshCommand'].outputSchema,
	},
	'sshCommands.getProjectSshCommandById': {
		input:
			deployHQOperations['sshCommands.getProjectSshCommandById'].inputSchema,
		output:
			deployHQOperations['sshCommands.getProjectSshCommandById'].outputSchema,
	},
	'sshCommands.replaceProjectSshCommand': {
		input:
			deployHQOperations['sshCommands.replaceProjectSshCommand'].inputSchema,
		output:
			deployHQOperations['sshCommands.replaceProjectSshCommand'].outputSchema,
	},
	'sshCommands.updateProjectSshCommand': {
		input:
			deployHQOperations['sshCommands.updateProjectSshCommand'].inputSchema,
		output:
			deployHQOperations['sshCommands.updateProjectSshCommand'].outputSchema,
	},
	'sshCommands.deleteProjectSshCommand': {
		input:
			deployHQOperations['sshCommands.deleteProjectSshCommand'].inputSchema,
		output:
			deployHQOperations['sshCommands.deleteProjectSshCommand'].outputSchema,
	},
	'testAccess.createProjectTestAccess': {
		input: deployHQOperations['testAccess.createProjectTestAccess'].inputSchema,
		output:
			deployHQOperations['testAccess.createProjectTestAccess'].outputSchema,
	},
	'testAccess.getProjectTestAccess': {
		input: deployHQOperations['testAccess.getProjectTestAccess'].inputSchema,
		output: deployHQOperations['testAccess.getProjectTestAccess'].outputSchema,
	},
	'account.resetPasswordSubmitReset': {
		input: deployHQOperations['account.resetPasswordSubmitReset'].inputSchema,
		output: deployHQOperations['account.resetPasswordSubmitReset'].outputSchema,
	},
	'security.createSecurityApiKey': {
		input: deployHQOperations['security.createSecurityApiKey'].inputSchema,
		output: deployHQOperations['security.createSecurityApiKey'].outputSchema,
	},
	'security.deleteSecurityApiKey': {
		input: deployHQOperations['security.deleteSecurityApiKey'].inputSchema,
		output: deployHQOperations['security.deleteSecurityApiKey'].outputSchema,
	},
	'sshKeys.listSshKeys': {
		input: deployHQOperations['sshKeys.listSshKeys'].inputSchema,
		output: deployHQOperations['sshKeys.listSshKeys'].outputSchema,
	},
	'sshKeys.createSshKey': {
		input: deployHQOperations['sshKeys.createSshKey'].inputSchema,
		output: deployHQOperations['sshKeys.createSshKey'].outputSchema,
	},
	'sshKeys.deleteSshKey': {
		input: deployHQOperations['sshKeys.deleteSshKey'].inputSchema,
		output: deployHQOperations['sshKeys.deleteSshKey'].outputSchema,
	},
	'sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey': {
		input:
			deployHQOperations['sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey']
				.inputSchema,
		output:
			deployHQOperations['sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey']
				.outputSchema,
	},
	'teams.listTeams': {
		input: deployHQOperations['teams.listTeams'].inputSchema,
		output: deployHQOperations['teams.listTeams'].outputSchema,
	},
	'teams.createTeam': {
		input: deployHQOperations['teams.createTeam'].inputSchema,
		output: deployHQOperations['teams.createTeam'].outputSchema,
	},
	'teams.getTeam': {
		input: deployHQOperations['teams.getTeam'].inputSchema,
		output: deployHQOperations['teams.getTeam'].outputSchema,
	},
	'teams.replaceTeam': {
		input: deployHQOperations['teams.replaceTeam'].inputSchema,
		output: deployHQOperations['teams.replaceTeam'].outputSchema,
	},
	'teams.updateTeam': {
		input: deployHQOperations['teams.updateTeam'].inputSchema,
		output: deployHQOperations['teams.updateTeam'].outputSchema,
	},
	'teams.deleteTeam': {
		input: deployHQOperations['teams.deleteTeam'].inputSchema,
		output: deployHQOperations['teams.deleteTeam'].outputSchema,
	},
	'templates.listTemplates': {
		input: deployHQOperations['templates.listTemplates'].inputSchema,
		output: deployHQOperations['templates.listTemplates'].outputSchema,
	},
	'templates.createTemplate': {
		input: deployHQOperations['templates.createTemplate'].inputSchema,
		output: deployHQOperations['templates.createTemplate'].outputSchema,
	},
	'templates.publicTemplatesTemplate': {
		input: deployHQOperations['templates.publicTemplatesTemplate'].inputSchema,
		output:
			deployHQOperations['templates.publicTemplatesTemplate'].outputSchema,
	},
	'templates.replaceTemplate': {
		input: deployHQOperations['templates.replaceTemplate'].inputSchema,
		output: deployHQOperations['templates.replaceTemplate'].outputSchema,
	},
	'templates.updateTemplate': {
		input: deployHQOperations['templates.updateTemplate'].inputSchema,
		output: deployHQOperations['templates.updateTemplate'].outputSchema,
	},
	'templates.deleteTemplate': {
		input: deployHQOperations['templates.deleteTemplate'].inputSchema,
		output: deployHQOperations['templates.deleteTemplate'].outputSchema,
	},
	'templates.showPublicTemplateTemplatePublic': {
		input:
			deployHQOperations['templates.showPublicTemplateTemplatePublic']
				.inputSchema,
		output:
			deployHQOperations['templates.showPublicTemplateTemplatePublic']
				.outputSchema,
	},
	'users.listUsers': {
		input: deployHQOperations['users.listUsers'].inputSchema,
		output: deployHQOperations['users.listUsers'].outputSchema,
	},
	'users.createUser': {
		input: deployHQOperations['users.createUser'].inputSchema,
		output: deployHQOperations['users.createUser'].outputSchema,
	},
	'users.getUser': {
		input: deployHQOperations['users.getUser'].inputSchema,
		output: deployHQOperations['users.getUser'].outputSchema,
	},
	'users.replaceUser': {
		input: deployHQOperations['users.replaceUser'].inputSchema,
		output: deployHQOperations['users.replaceUser'].outputSchema,
	},
	'users.updateUser': {
		input: deployHQOperations['users.updateUser'].inputSchema,
		output: deployHQOperations['users.updateUser'].outputSchema,
	},
	'users.deleteUser': {
		input: deployHQOperations['users.deleteUser'].inputSchema,
		output: deployHQOperations['users.deleteUser'].outputSchema,
	},
	'users.resendInvitationUserResendInvitation': {
		input:
			deployHQOperations['users.resendInvitationUserResendInvitation']
				.inputSchema,
		output:
			deployHQOperations['users.resendInvitationUserResendInvitation']
				.outputSchema,
	},
	'zones.listZones': {
		input: deployHQOperations['zones.listZones'].inputSchema,
		output: deployHQOperations['zones.listZones'].outputSchema,
	},
	'projects.statusBadgeStatusBadge': {
		input: deployHQOperations['projects.statusBadgeStatusBadge'].inputSchema,
		output: deployHQOperations['projects.statusBadgeStatusBadge'].outputSchema,
	},
	'projects.statusBadgeStatusBadgeByIdentifier': {
		input:
			deployHQOperations['projects.statusBadgeStatusBadgeByIdentifier']
				.inputSchema,
		output:
			deployHQOperations['projects.statusBadgeStatusBadgeByIdentifier']
				.outputSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof DeployHQEndpoints>;

export const deployHQEndpointMeta = {
	'account.getAccount': {
		riskLevel: deployHQOperations['account.getAccount'].riskLevel,
		description: deployHQOperations['account.getAccount'].description,
	},
	'account.replaceAccount': {
		riskLevel: deployHQOperations['account.replaceAccount'].riskLevel,
		description: deployHQOperations['account.replaceAccount'].description,
	},
	'account.updateAccount': {
		riskLevel: deployHQOperations['account.updateAccount'].riskLevel,
		description: deployHQOperations['account.updateAccount'].description,
	},
	'account.billingStatusAccountBillingStatus': {
		riskLevel:
			deployHQOperations['account.billingStatusAccountBillingStatus'].riskLevel,
		description:
			deployHQOperations['account.billingStatusAccountBillingStatus']
				.description,
	},
	'invoices.listAccountInvoices': {
		riskLevel: deployHQOperations['invoices.listAccountInvoices'].riskLevel,
		description: deployHQOperations['invoices.listAccountInvoices'].description,
	},
	'invoices.getAccountInvoice': {
		riskLevel: deployHQOperations['invoices.getAccountInvoice'].riskLevel,
		description: deployHQOperations['invoices.getAccountInvoice'].description,
	},
	'networkAgents.listAgents': {
		riskLevel: deployHQOperations['networkAgents.listAgents'].riskLevel,
		description: deployHQOperations['networkAgents.listAgents'].description,
	},
	'networkAgents.createAgent': {
		riskLevel: deployHQOperations['networkAgents.createAgent'].riskLevel,
		description: deployHQOperations['networkAgents.createAgent'].description,
	},
	'networkAgents.replaceAgent': {
		riskLevel: deployHQOperations['networkAgents.replaceAgent'].riskLevel,
		description: deployHQOperations['networkAgents.replaceAgent'].description,
	},
	'networkAgents.updateAgent': {
		riskLevel: deployHQOperations['networkAgents.updateAgent'].riskLevel,
		description: deployHQOperations['networkAgents.updateAgent'].description,
	},
	'networkAgents.deleteAgent': {
		riskLevel: deployHQOperations['networkAgents.deleteAgent'].riskLevel,
		description: deployHQOperations['networkAgents.deleteAgent'].description,
	},
	'networkAgents.revokeAgent': {
		riskLevel: deployHQOperations['networkAgents.revokeAgent'].riskLevel,
		description: deployHQOperations['networkAgents.revokeAgent'].description,
	},
	'signup.createSignup': {
		riskLevel: deployHQOperations['signup.createSignup'].riskLevel,
		description: deployHQOperations['signup.createSignup'].description,
	},
	'beta.createBetumEnrollment': {
		riskLevel: deployHQOperations['beta.createBetumEnrollment'].riskLevel,
		description: deployHQOperations['beta.createBetumEnrollment'].description,
	},
	'detection.createDetection': {
		riskLevel: deployHQOperations['detection.createDetection'].riskLevel,
		description: deployHQOperations['detection.createDetection'].description,
	},
	'folders.listFolders': {
		riskLevel: deployHQOperations['folders.listFolders'].riskLevel,
		description: deployHQOperations['folders.listFolders'].description,
	},
	'folders.createFolder': {
		riskLevel: deployHQOperations['folders.createFolder'].riskLevel,
		description: deployHQOperations['folders.createFolder'].description,
	},
	'folders.replaceFolder': {
		riskLevel: deployHQOperations['folders.replaceFolder'].riskLevel,
		description: deployHQOperations['folders.replaceFolder'].description,
	},
	'folders.updateFolder': {
		riskLevel: deployHQOperations['folders.updateFolder'].riskLevel,
		description: deployHQOperations['folders.updateFolder'].description,
	},
	'folders.deleteFolder': {
		riskLevel: deployHQOperations['folders.deleteFolder'].riskLevel,
		description: deployHQOperations['folders.deleteFolder'].description,
	},
	'globalBuildCommands.listGlobalBuildCommands': {
		riskLevel:
			deployHQOperations['globalBuildCommands.listGlobalBuildCommands']
				.riskLevel,
		description:
			deployHQOperations['globalBuildCommands.listGlobalBuildCommands']
				.description,
	},
	'globalBuildCommands.createGlobalBuildCommand': {
		riskLevel:
			deployHQOperations['globalBuildCommands.createGlobalBuildCommand']
				.riskLevel,
		description:
			deployHQOperations['globalBuildCommands.createGlobalBuildCommand']
				.description,
	},
	'globalBuildCommands.getGlobalBuildCommand': {
		riskLevel:
			deployHQOperations['globalBuildCommands.getGlobalBuildCommand'].riskLevel,
		description:
			deployHQOperations['globalBuildCommands.getGlobalBuildCommand']
				.description,
	},
	'globalBuildCommands.replaceGlobalBuildCommand': {
		riskLevel:
			deployHQOperations['globalBuildCommands.replaceGlobalBuildCommand']
				.riskLevel,
		description:
			deployHQOperations['globalBuildCommands.replaceGlobalBuildCommand']
				.description,
	},
	'globalBuildCommands.updateGlobalBuildCommand': {
		riskLevel:
			deployHQOperations['globalBuildCommands.updateGlobalBuildCommand']
				.riskLevel,
		description:
			deployHQOperations['globalBuildCommands.updateGlobalBuildCommand']
				.description,
	},
	'globalBuildCommands.deleteGlobalBuildCommand': {
		riskLevel:
			deployHQOperations['globalBuildCommands.deleteGlobalBuildCommand']
				.riskLevel,
		description:
			deployHQOperations['globalBuildCommands.deleteGlobalBuildCommand']
				.description,
	},
	'globalConfigFiles.listGlobalConfigFiles': {
		riskLevel:
			deployHQOperations['globalConfigFiles.listGlobalConfigFiles'].riskLevel,
		description:
			deployHQOperations['globalConfigFiles.listGlobalConfigFiles'].description,
	},
	'globalConfigFiles.createGlobalConfigFile': {
		riskLevel:
			deployHQOperations['globalConfigFiles.createGlobalConfigFile'].riskLevel,
		description:
			deployHQOperations['globalConfigFiles.createGlobalConfigFile']
				.description,
	},
	'globalConfigFiles.getGlobalConfigFile': {
		riskLevel:
			deployHQOperations['globalConfigFiles.getGlobalConfigFile'].riskLevel,
		description:
			deployHQOperations['globalConfigFiles.getGlobalConfigFile'].description,
	},
	'globalConfigFiles.replaceGlobalConfigFile': {
		riskLevel:
			deployHQOperations['globalConfigFiles.replaceGlobalConfigFile'].riskLevel,
		description:
			deployHQOperations['globalConfigFiles.replaceGlobalConfigFile']
				.description,
	},
	'globalConfigFiles.updateGlobalConfigFile': {
		riskLevel:
			deployHQOperations['globalConfigFiles.updateGlobalConfigFile'].riskLevel,
		description:
			deployHQOperations['globalConfigFiles.updateGlobalConfigFile']
				.description,
	},
	'globalConfigFiles.deleteGlobalConfigFile': {
		riskLevel:
			deployHQOperations['globalConfigFiles.deleteGlobalConfigFile'].riskLevel,
		description:
			deployHQOperations['globalConfigFiles.deleteGlobalConfigFile']
				.description,
	},
	'globalEnvironmentVariables.listGlobalEnvironmentVariables': {
		riskLevel:
			deployHQOperations[
				'globalEnvironmentVariables.listGlobalEnvironmentVariables'
			].riskLevel,
		description:
			deployHQOperations[
				'globalEnvironmentVariables.listGlobalEnvironmentVariables'
			].description,
	},
	'globalEnvironmentVariables.createGlobalEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'globalEnvironmentVariables.createGlobalEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'globalEnvironmentVariables.createGlobalEnvironmentVariable'
			].description,
	},
	'globalEnvironmentVariables.getGlobalEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'globalEnvironmentVariables.getGlobalEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'globalEnvironmentVariables.getGlobalEnvironmentVariable'
			].description,
	},
	'globalEnvironmentVariables.replaceGlobalEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'globalEnvironmentVariables.replaceGlobalEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'globalEnvironmentVariables.replaceGlobalEnvironmentVariable'
			].description,
	},
	'globalEnvironmentVariables.updateGlobalEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'globalEnvironmentVariables.updateGlobalEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'globalEnvironmentVariables.updateGlobalEnvironmentVariable'
			].description,
	},
	'globalEnvironmentVariables.deleteGlobalEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'globalEnvironmentVariables.deleteGlobalEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'globalEnvironmentVariables.deleteGlobalEnvironmentVariable'
			].description,
	},
	'globalServers.listGlobalServers': {
		riskLevel: deployHQOperations['globalServers.listGlobalServers'].riskLevel,
		description:
			deployHQOperations['globalServers.listGlobalServers'].description,
	},
	'globalServers.createGlobalServer': {
		riskLevel: deployHQOperations['globalServers.createGlobalServer'].riskLevel,
		description:
			deployHQOperations['globalServers.createGlobalServer'].description,
	},
	'globalServers.getGlobalServer': {
		riskLevel: deployHQOperations['globalServers.getGlobalServer'].riskLevel,
		description:
			deployHQOperations['globalServers.getGlobalServer'].description,
	},
	'globalServers.replaceGlobalServer': {
		riskLevel:
			deployHQOperations['globalServers.replaceGlobalServer'].riskLevel,
		description:
			deployHQOperations['globalServers.replaceGlobalServer'].description,
	},
	'globalServers.updateGlobalServer': {
		riskLevel: deployHQOperations['globalServers.updateGlobalServer'].riskLevel,
		description:
			deployHQOperations['globalServers.updateGlobalServer'].description,
	},
	'globalServers.deleteGlobalServer': {
		riskLevel: deployHQOperations['globalServers.deleteGlobalServer'].riskLevel,
		description:
			deployHQOperations['globalServers.deleteGlobalServer'].description,
	},
	'globalServers.copyToProjectGlobalServer': {
		riskLevel:
			deployHQOperations['globalServers.copyToProjectGlobalServer'].riskLevel,
		description:
			deployHQOperations['globalServers.copyToProjectGlobalServer'].description,
	},
	'globalSshCommands.listGlobalSshCommands': {
		riskLevel:
			deployHQOperations['globalSshCommands.listGlobalSshCommands'].riskLevel,
		description:
			deployHQOperations['globalSshCommands.listGlobalSshCommands'].description,
	},
	'globalSshCommands.createGlobalSshCommand': {
		riskLevel:
			deployHQOperations['globalSshCommands.createGlobalSshCommand'].riskLevel,
		description:
			deployHQOperations['globalSshCommands.createGlobalSshCommand']
				.description,
	},
	'globalSshCommands.getGlobalSshCommand': {
		riskLevel:
			deployHQOperations['globalSshCommands.getGlobalSshCommand'].riskLevel,
		description:
			deployHQOperations['globalSshCommands.getGlobalSshCommand'].description,
	},
	'globalSshCommands.replaceGlobalSshCommand': {
		riskLevel:
			deployHQOperations['globalSshCommands.replaceGlobalSshCommand'].riskLevel,
		description:
			deployHQOperations['globalSshCommands.replaceGlobalSshCommand']
				.description,
	},
	'globalSshCommands.updateGlobalSshCommand': {
		riskLevel:
			deployHQOperations['globalSshCommands.updateGlobalSshCommand'].riskLevel,
		description:
			deployHQOperations['globalSshCommands.updateGlobalSshCommand']
				.description,
	},
	'globalSshCommands.deleteGlobalSshCommand': {
		riskLevel:
			deployHQOperations['globalSshCommands.deleteGlobalSshCommand'].riskLevel,
		description:
			deployHQOperations['globalSshCommands.deleteGlobalSshCommand']
				.description,
	},
	'hostedResources.listHostedResources': {
		riskLevel:
			deployHQOperations['hostedResources.listHostedResources'].riskLevel,
		description:
			deployHQOperations['hostedResources.listHostedResources'].description,
	},
	'hostedResources.getHostedResource': {
		riskLevel:
			deployHQOperations['hostedResources.getHostedResource'].riskLevel,
		description:
			deployHQOperations['hostedResources.getHostedResource'].description,
	},
	'hostedResources.retryProvisionHostedResourceRetryProvision': {
		riskLevel:
			deployHQOperations[
				'hostedResources.retryProvisionHostedResourceRetryProvision'
			].riskLevel,
		description:
			deployHQOperations[
				'hostedResources.retryProvisionHostedResourceRetryProvision'
			].description,
	},
	'hostedResources.syncHostedResourceSync': {
		riskLevel:
			deployHQOperations['hostedResources.syncHostedResourceSync'].riskLevel,
		description:
			deployHQOperations['hostedResources.syncHostedResourceSync'].description,
	},
	'ipRanges.listIpRanges': {
		riskLevel: deployHQOperations['ipRanges.listIpRanges'].riskLevel,
		description: deployHQOperations['ipRanges.listIpRanges'].description,
	},
	'languageVersions.listLanguageVersions': {
		riskLevel:
			deployHQOperations['languageVersions.listLanguageVersions'].riskLevel,
		description:
			deployHQOperations['languageVersions.listLanguageVersions'].description,
	},
	'managedHosting.listManagedHostingRegions': {
		riskLevel:
			deployHQOperations['managedHosting.listManagedHostingRegions'].riskLevel,
		description:
			deployHQOperations['managedHosting.listManagedHostingRegions']
				.description,
	},
	'managedHosting.listManagedHostingSizes': {
		riskLevel:
			deployHQOperations['managedHosting.listManagedHostingSizes'].riskLevel,
		description:
			deployHQOperations['managedHosting.listManagedHostingSizes'].description,
	},
	'packages.listPackages': {
		riskLevel: deployHQOperations['packages.listPackages'].riskLevel,
		description: deployHQOperations['packages.listPackages'].description,
	},
	'profile.getProfile': {
		riskLevel: deployHQOperations['profile.getProfile'].riskLevel,
		description: deployHQOperations['profile.getProfile'].description,
	},
	'profile.replaceProfile': {
		riskLevel: deployHQOperations['profile.replaceProfile'].riskLevel,
		description: deployHQOperations['profile.replaceProfile'].description,
	},
	'profile.updateProfile': {
		riskLevel: deployHQOperations['profile.updateProfile'].riskLevel,
		description: deployHQOperations['profile.updateProfile'].description,
	},
	'projects.listProjects': {
		riskLevel: deployHQOperations['projects.listProjects'].riskLevel,
		description: deployHQOperations['projects.listProjects'].description,
	},
	'projects.createProject': {
		riskLevel: deployHQOperations['projects.createProject'].riskLevel,
		description: deployHQOperations['projects.createProject'].description,
	},
	'projects.getProject': {
		riskLevel: deployHQOperations['projects.getProject'].riskLevel,
		description: deployHQOperations['projects.getProject'].description,
	},
	'projects.replaceProject': {
		riskLevel: deployHQOperations['projects.replaceProject'].riskLevel,
		description: deployHQOperations['projects.replaceProject'].description,
	},
	'projects.updateProject': {
		riskLevel: deployHQOperations['projects.updateProject'].riskLevel,
		description: deployHQOperations['projects.updateProject'].description,
	},
	'projects.deleteProject': {
		riskLevel: deployHQOperations['projects.deleteProject'].riskLevel,
		description: deployHQOperations['projects.deleteProject'].description,
	},
	'projects.aiDeploymentOverviewProject': {
		riskLevel:
			deployHQOperations['projects.aiDeploymentOverviewProject'].riskLevel,
		description:
			deployHQOperations['projects.aiDeploymentOverviewProject'].description,
	},
	'projects.listProjectInsights': {
		riskLevel: deployHQOperations['projects.listProjectInsights'].riskLevel,
		description: deployHQOperations['projects.listProjectInsights'].description,
	},
	'projects.regenerateKeyProjectRegenerateKey': {
		riskLevel:
			deployHQOperations['projects.regenerateKeyProjectRegenerateKey']
				.riskLevel,
		description:
			deployHQOperations['projects.regenerateKeyProjectRegenerateKey']
				.description,
	},
	'projects.starProject': {
		riskLevel: deployHQOperations['projects.starProject'].riskLevel,
		description: deployHQOperations['projects.starProject'].description,
	},
	'projects.undeployedChangesProjectUndeployedChange': {
		riskLevel:
			deployHQOperations['projects.undeployedChangesProjectUndeployedChange']
				.riskLevel,
		description:
			deployHQOperations['projects.undeployedChangesProjectUndeployedChange']
				.description,
	},
	'projects.uploadKeyProject': {
		riskLevel: deployHQOperations['projects.uploadKeyProject'].riskLevel,
		description: deployHQOperations['projects.uploadKeyProject'].description,
	},
	'automaticDeployments.listProjectAutoDeployments': {
		riskLevel:
			deployHQOperations['automaticDeployments.listProjectAutoDeployments']
				.riskLevel,
		description:
			deployHQOperations['automaticDeployments.listProjectAutoDeployments']
				.description,
	},
	'automaticDeployments.createProjectAutoDeployment': {
		riskLevel:
			deployHQOperations['automaticDeployments.createProjectAutoDeployment']
				.riskLevel,
		description:
			deployHQOperations['automaticDeployments.createProjectAutoDeployment']
				.description,
	},
	'buildCacheFiles.listProjectBuildCacheFiles': {
		riskLevel:
			deployHQOperations['buildCacheFiles.listProjectBuildCacheFiles']
				.riskLevel,
		description:
			deployHQOperations['buildCacheFiles.listProjectBuildCacheFiles']
				.description,
	},
	'buildCacheFiles.createProjectBuildCacheFile': {
		riskLevel:
			deployHQOperations['buildCacheFiles.createProjectBuildCacheFile']
				.riskLevel,
		description:
			deployHQOperations['buildCacheFiles.createProjectBuildCacheFile']
				.description,
	},
	'buildCacheFiles.replaceProjectBuildCacheFile': {
		riskLevel:
			deployHQOperations['buildCacheFiles.replaceProjectBuildCacheFile']
				.riskLevel,
		description:
			deployHQOperations['buildCacheFiles.replaceProjectBuildCacheFile']
				.description,
	},
	'buildCacheFiles.updateProjectBuildCacheFile': {
		riskLevel:
			deployHQOperations['buildCacheFiles.updateProjectBuildCacheFile']
				.riskLevel,
		description:
			deployHQOperations['buildCacheFiles.updateProjectBuildCacheFile']
				.description,
	},
	'buildCacheFiles.deleteProjectBuildCacheFile': {
		riskLevel:
			deployHQOperations['buildCacheFiles.deleteProjectBuildCacheFile']
				.riskLevel,
		description:
			deployHQOperations['buildCacheFiles.deleteProjectBuildCacheFile']
				.description,
	},
	'buildCommands.listProjectBuildCommands': {
		riskLevel:
			deployHQOperations['buildCommands.listProjectBuildCommands'].riskLevel,
		description:
			deployHQOperations['buildCommands.listProjectBuildCommands'].description,
	},
	'buildCommands.createProjectBuildCommand': {
		riskLevel:
			deployHQOperations['buildCommands.createProjectBuildCommand'].riskLevel,
		description:
			deployHQOperations['buildCommands.createProjectBuildCommand'].description,
	},
	'buildCommands.linkGlobalProjectBuildCommandLinkGlobal': {
		riskLevel:
			deployHQOperations[
				'buildCommands.linkGlobalProjectBuildCommandLinkGlobal'
			].riskLevel,
		description:
			deployHQOperations[
				'buildCommands.linkGlobalProjectBuildCommandLinkGlobal'
			].description,
	},
	'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal': {
		riskLevel:
			deployHQOperations[
				'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal'
			].riskLevel,
		description:
			deployHQOperations[
				'buildCommands.unlinkGlobalProjectBuildCommandUnlinkGlobal'
			].description,
	},
	'buildCommands.replaceProjectBuildCommand': {
		riskLevel:
			deployHQOperations['buildCommands.replaceProjectBuildCommand'].riskLevel,
		description:
			deployHQOperations['buildCommands.replaceProjectBuildCommand']
				.description,
	},
	'buildCommands.updateProjectBuildCommand': {
		riskLevel:
			deployHQOperations['buildCommands.updateProjectBuildCommand'].riskLevel,
		description:
			deployHQOperations['buildCommands.updateProjectBuildCommand'].description,
	},
	'buildCommands.deleteProjectBuildCommand': {
		riskLevel:
			deployHQOperations['buildCommands.deleteProjectBuildCommand'].riskLevel,
		description:
			deployHQOperations['buildCommands.deleteProjectBuildCommand'].description,
	},
	'buildConfigurations.getProjectBuildConfiguration': {
		riskLevel:
			deployHQOperations['buildConfigurations.getProjectBuildConfiguration']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.getProjectBuildConfiguration']
				.description,
	},
	'buildConfigurations.listProjectBuildConfigurations': {
		riskLevel:
			deployHQOperations['buildConfigurations.listProjectBuildConfigurations']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.listProjectBuildConfigurations']
				.description,
	},
	'buildConfigurations.createProjectBuildConfiguration': {
		riskLevel:
			deployHQOperations['buildConfigurations.createProjectBuildConfiguration']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.createProjectBuildConfiguration']
				.description,
	},
	'buildConfigurations.getProjectBuildConfigurationById': {
		riskLevel:
			deployHQOperations['buildConfigurations.getProjectBuildConfigurationById']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.getProjectBuildConfigurationById']
				.description,
	},
	'buildConfigurations.replaceProjectBuildConfiguration': {
		riskLevel:
			deployHQOperations['buildConfigurations.replaceProjectBuildConfiguration']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.replaceProjectBuildConfiguration']
				.description,
	},
	'buildConfigurations.updateProjectBuildConfiguration': {
		riskLevel:
			deployHQOperations['buildConfigurations.updateProjectBuildConfiguration']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.updateProjectBuildConfiguration']
				.description,
	},
	'buildConfigurations.deleteProjectBuildConfiguration': {
		riskLevel:
			deployHQOperations['buildConfigurations.deleteProjectBuildConfiguration']
				.riskLevel,
		description:
			deployHQOperations['buildConfigurations.deleteProjectBuildConfiguration']
				.description,
	},
	'languageVersions.replaceProjectBuildConfigurationBuildLanguage': {
		riskLevel:
			deployHQOperations[
				'languageVersions.replaceProjectBuildConfigurationBuildLanguage'
			].riskLevel,
		description:
			deployHQOperations[
				'languageVersions.replaceProjectBuildConfigurationBuildLanguage'
			].description,
	},
	'languageVersions.updateProjectBuildConfigurationBuildLanguage': {
		riskLevel:
			deployHQOperations[
				'languageVersions.updateProjectBuildConfigurationBuildLanguage'
			].riskLevel,
		description:
			deployHQOperations[
				'languageVersions.updateProjectBuildConfigurationBuildLanguage'
			].description,
	},
	'buildKnownHosts.listProjectBuildKnownHosts': {
		riskLevel:
			deployHQOperations['buildKnownHosts.listProjectBuildKnownHosts']
				.riskLevel,
		description:
			deployHQOperations['buildKnownHosts.listProjectBuildKnownHosts']
				.description,
	},
	'buildKnownHosts.createProjectBuildKnownHost': {
		riskLevel:
			deployHQOperations['buildKnownHosts.createProjectBuildKnownHost']
				.riskLevel,
		description:
			deployHQOperations['buildKnownHosts.createProjectBuildKnownHost']
				.description,
	},
	'buildKnownHosts.deleteProjectBuildKnownHost': {
		riskLevel:
			deployHQOperations['buildKnownHosts.deleteProjectBuildKnownHost']
				.riskLevel,
		description:
			deployHQOperations['buildKnownHosts.deleteProjectBuildKnownHost']
				.description,
	},
	'languageVersions.replaceProjectBuildLanguage': {
		riskLevel:
			deployHQOperations['languageVersions.replaceProjectBuildLanguage']
				.riskLevel,
		description:
			deployHQOperations['languageVersions.replaceProjectBuildLanguage']
				.description,
	},
	'languageVersions.updateProjectBuildLanguage': {
		riskLevel:
			deployHQOperations['languageVersions.updateProjectBuildLanguage']
				.riskLevel,
		description:
			deployHQOperations['languageVersions.updateProjectBuildLanguage']
				.description,
	},
	'sshCommands.listProjectCommands': {
		riskLevel: deployHQOperations['sshCommands.listProjectCommands'].riskLevel,
		description:
			deployHQOperations['sshCommands.listProjectCommands'].description,
	},
	'sshCommands.createProjectCommand': {
		riskLevel: deployHQOperations['sshCommands.createProjectCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.createProjectCommand'].description,
	},
	'sshCommands.linkGlobalProjectCommandLinkGlobal': {
		riskLevel:
			deployHQOperations['sshCommands.linkGlobalProjectCommandLinkGlobal']
				.riskLevel,
		description:
			deployHQOperations['sshCommands.linkGlobalProjectCommandLinkGlobal']
				.description,
	},
	'sshCommands.unlinkGlobalProjectCommandUnlinkGlobal': {
		riskLevel:
			deployHQOperations['sshCommands.unlinkGlobalProjectCommandUnlinkGlobal']
				.riskLevel,
		description:
			deployHQOperations['sshCommands.unlinkGlobalProjectCommandUnlinkGlobal']
				.description,
	},
	'sshCommands.getProjectCommandById': {
		riskLevel:
			deployHQOperations['sshCommands.getProjectCommandById'].riskLevel,
		description:
			deployHQOperations['sshCommands.getProjectCommandById'].description,
	},
	'sshCommands.replaceProjectCommand': {
		riskLevel:
			deployHQOperations['sshCommands.replaceProjectCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.replaceProjectCommand'].description,
	},
	'sshCommands.updateProjectCommand': {
		riskLevel: deployHQOperations['sshCommands.updateProjectCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.updateProjectCommand'].description,
	},
	'sshCommands.deleteProjectCommand': {
		riskLevel: deployHQOperations['sshCommands.deleteProjectCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.deleteProjectCommand'].description,
	},
	'configFiles.listProjectConfigFiles': {
		riskLevel:
			deployHQOperations['configFiles.listProjectConfigFiles'].riskLevel,
		description:
			deployHQOperations['configFiles.listProjectConfigFiles'].description,
	},
	'configFiles.createProjectConfigFile': {
		riskLevel:
			deployHQOperations['configFiles.createProjectConfigFile'].riskLevel,
		description:
			deployHQOperations['configFiles.createProjectConfigFile'].description,
	},
	'configFiles.getProjectConfigFileById': {
		riskLevel:
			deployHQOperations['configFiles.getProjectConfigFileById'].riskLevel,
		description:
			deployHQOperations['configFiles.getProjectConfigFileById'].description,
	},
	'configFiles.replaceProjectConfigFile': {
		riskLevel:
			deployHQOperations['configFiles.replaceProjectConfigFile'].riskLevel,
		description:
			deployHQOperations['configFiles.replaceProjectConfigFile'].description,
	},
	'configFiles.updateProjectConfigFile': {
		riskLevel:
			deployHQOperations['configFiles.updateProjectConfigFile'].riskLevel,
		description:
			deployHQOperations['configFiles.updateProjectConfigFile'].description,
	},
	'configFiles.deleteProjectConfigFile': {
		riskLevel:
			deployHQOperations['configFiles.deleteProjectConfigFile'].riskLevel,
		description:
			deployHQOperations['configFiles.deleteProjectConfigFile'].description,
	},
	'deploymentChecks.listProjectDeploymentChecks': {
		riskLevel:
			deployHQOperations['deploymentChecks.listProjectDeploymentChecks']
				.riskLevel,
		description:
			deployHQOperations['deploymentChecks.listProjectDeploymentChecks']
				.description,
	},
	'deploymentChecks.createProjectDeploymentCheck': {
		riskLevel:
			deployHQOperations['deploymentChecks.createProjectDeploymentCheck']
				.riskLevel,
		description:
			deployHQOperations['deploymentChecks.createProjectDeploymentCheck']
				.description,
	},
	'deploymentChecks.getProjectDeploymentCheckById': {
		riskLevel:
			deployHQOperations['deploymentChecks.getProjectDeploymentCheckById']
				.riskLevel,
		description:
			deployHQOperations['deploymentChecks.getProjectDeploymentCheckById']
				.description,
	},
	'deploymentChecks.replaceProjectDeploymentCheck': {
		riskLevel:
			deployHQOperations['deploymentChecks.replaceProjectDeploymentCheck']
				.riskLevel,
		description:
			deployHQOperations['deploymentChecks.replaceProjectDeploymentCheck']
				.description,
	},
	'deploymentChecks.updateProjectDeploymentCheck': {
		riskLevel:
			deployHQOperations['deploymentChecks.updateProjectDeploymentCheck']
				.riskLevel,
		description:
			deployHQOperations['deploymentChecks.updateProjectDeploymentCheck']
				.description,
	},
	'deploymentChecks.deleteProjectDeploymentCheck': {
		riskLevel:
			deployHQOperations['deploymentChecks.deleteProjectDeploymentCheck']
				.riskLevel,
		description:
			deployHQOperations['deploymentChecks.deleteProjectDeploymentCheck']
				.description,
	},
	'deployments.listProjectDeployments': {
		riskLevel:
			deployHQOperations['deployments.listProjectDeployments'].riskLevel,
		description:
			deployHQOperations['deployments.listProjectDeployments'].description,
	},
	'deployments.createProjectDeployment': {
		riskLevel:
			deployHQOperations['deployments.createProjectDeployment'].riskLevel,
		description:
			deployHQOperations['deployments.createProjectDeployment'].description,
	},
	'deployments.listProjectDeploymentStepLogs': {
		riskLevel:
			deployHQOperations['deployments.listProjectDeploymentStepLogs'].riskLevel,
		description:
			deployHQOperations['deployments.listProjectDeploymentStepLogs']
				.description,
	},
	'deployments.getProjectDeploymentById': {
		riskLevel:
			deployHQOperations['deployments.getProjectDeploymentById'].riskLevel,
		description:
			deployHQOperations['deployments.getProjectDeploymentById'].description,
	},
	'deployments.abortProjectDeployment': {
		riskLevel:
			deployHQOperations['deployments.abortProjectDeployment'].riskLevel,
		description:
			deployHQOperations['deployments.abortProjectDeployment'].description,
	},
	'deployments.retryProjectDeploymentRetry': {
		riskLevel:
			deployHQOperations['deployments.retryProjectDeploymentRetry'].riskLevel,
		description:
			deployHQOperations['deployments.retryProjectDeploymentRetry'].description,
	},
	'deployments.rollbackProjectDeployment': {
		riskLevel:
			deployHQOperations['deployments.rollbackProjectDeployment'].riskLevel,
		description:
			deployHQOperations['deployments.rollbackProjectDeployment'].description,
	},
	'environmentVariables.listProjectEnvironmentVariables': {
		riskLevel:
			deployHQOperations['environmentVariables.listProjectEnvironmentVariables']
				.riskLevel,
		description:
			deployHQOperations['environmentVariables.listProjectEnvironmentVariables']
				.description,
	},
	'environmentVariables.createProjectEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'environmentVariables.createProjectEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'environmentVariables.createProjectEnvironmentVariable'
			].description,
	},
	'environmentVariables.getProjectEnvironmentVariableById': {
		riskLevel:
			deployHQOperations[
				'environmentVariables.getProjectEnvironmentVariableById'
			].riskLevel,
		description:
			deployHQOperations[
				'environmentVariables.getProjectEnvironmentVariableById'
			].description,
	},
	'environmentVariables.replaceProjectEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'environmentVariables.replaceProjectEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'environmentVariables.replaceProjectEnvironmentVariable'
			].description,
	},
	'environmentVariables.updateProjectEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'environmentVariables.updateProjectEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'environmentVariables.updateProjectEnvironmentVariable'
			].description,
	},
	'environmentVariables.deleteProjectEnvironmentVariable': {
		riskLevel:
			deployHQOperations[
				'environmentVariables.deleteProjectEnvironmentVariable'
			].riskLevel,
		description:
			deployHQOperations[
				'environmentVariables.deleteProjectEnvironmentVariable'
			].description,
	},
	'excludedFiles.listProjectExcludedFiles': {
		riskLevel:
			deployHQOperations['excludedFiles.listProjectExcludedFiles'].riskLevel,
		description:
			deployHQOperations['excludedFiles.listProjectExcludedFiles'].description,
	},
	'excludedFiles.createProjectExcludedFile': {
		riskLevel:
			deployHQOperations['excludedFiles.createProjectExcludedFile'].riskLevel,
		description:
			deployHQOperations['excludedFiles.createProjectExcludedFile'].description,
	},
	'excludedFiles.getProjectExcludedFileById': {
		riskLevel:
			deployHQOperations['excludedFiles.getProjectExcludedFileById'].riskLevel,
		description:
			deployHQOperations['excludedFiles.getProjectExcludedFileById']
				.description,
	},
	'excludedFiles.replaceProjectExcludedFile': {
		riskLevel:
			deployHQOperations['excludedFiles.replaceProjectExcludedFile'].riskLevel,
		description:
			deployHQOperations['excludedFiles.replaceProjectExcludedFile']
				.description,
	},
	'excludedFiles.updateProjectExcludedFile': {
		riskLevel:
			deployHQOperations['excludedFiles.updateProjectExcludedFile'].riskLevel,
		description:
			deployHQOperations['excludedFiles.updateProjectExcludedFile'].description,
	},
	'excludedFiles.deleteProjectExcludedFile': {
		riskLevel:
			deployHQOperations['excludedFiles.deleteProjectExcludedFile'].riskLevel,
		description:
			deployHQOperations['excludedFiles.deleteProjectExcludedFile'].description,
	},
	'integrations.listProjectIntegrations': {
		riskLevel:
			deployHQOperations['integrations.listProjectIntegrations'].riskLevel,
		description:
			deployHQOperations['integrations.listProjectIntegrations'].description,
	},
	'integrations.createProjectIntegration': {
		riskLevel:
			deployHQOperations['integrations.createProjectIntegration'].riskLevel,
		description:
			deployHQOperations['integrations.createProjectIntegration'].description,
	},
	'integrations.getProjectIntegrationById': {
		riskLevel:
			deployHQOperations['integrations.getProjectIntegrationById'].riskLevel,
		description:
			deployHQOperations['integrations.getProjectIntegrationById'].description,
	},
	'integrations.replaceProjectIntegration': {
		riskLevel:
			deployHQOperations['integrations.replaceProjectIntegration'].riskLevel,
		description:
			deployHQOperations['integrations.replaceProjectIntegration'].description,
	},
	'integrations.updateProjectIntegration': {
		riskLevel:
			deployHQOperations['integrations.updateProjectIntegration'].riskLevel,
		description:
			deployHQOperations['integrations.updateProjectIntegration'].description,
	},
	'integrations.deleteProjectIntegration': {
		riskLevel:
			deployHQOperations['integrations.deleteProjectIntegration'].riskLevel,
		description:
			deployHQOperations['integrations.deleteProjectIntegration'].description,
	},
	'languageVersions.listProjectLanguageVersions': {
		riskLevel:
			deployHQOperations['languageVersions.listProjectLanguageVersions']
				.riskLevel,
		description:
			deployHQOperations['languageVersions.listProjectLanguageVersions']
				.description,
	},
	'repositories.getProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.getProjectRepository'].riskLevel,
		description:
			deployHQOperations['repositories.getProjectRepository'].description,
	},
	'repositories.createProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.createProjectRepository'].riskLevel,
		description:
			deployHQOperations['repositories.createProjectRepository'].description,
	},
	'repositories.replaceProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.replaceProjectRepository'].riskLevel,
		description:
			deployHQOperations['repositories.replaceProjectRepository'].description,
	},
	'repositories.updateProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.updateProjectRepository'].riskLevel,
		description:
			deployHQOperations['repositories.updateProjectRepository'].description,
	},
	'repositories.branchesProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.branchesProjectRepository'].riskLevel,
		description:
			deployHQOperations['repositories.branchesProjectRepository'].description,
	},
	'repositories.commitInfoProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.commitInfoProjectRepository'].riskLevel,
		description:
			deployHQOperations['repositories.commitInfoProjectRepository']
				.description,
	},
	'repositories.latestRevisionProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.latestRevisionProjectRepository']
				.riskLevel,
		description:
			deployHQOperations['repositories.latestRevisionProjectRepository']
				.description,
	},
	'repositories.recentCommitsProjectRepository': {
		riskLevel:
			deployHQOperations['repositories.recentCommitsProjectRepository']
				.riskLevel,
		description:
			deployHQOperations['repositories.recentCommitsProjectRepository']
				.description,
	},
	'scheduledDeployments.listProjectScheduledDeployments': {
		riskLevel:
			deployHQOperations['scheduledDeployments.listProjectScheduledDeployments']
				.riskLevel,
		description:
			deployHQOperations['scheduledDeployments.listProjectScheduledDeployments']
				.description,
	},
	'scheduledDeployments.createProjectScheduledDeployment': {
		riskLevel:
			deployHQOperations[
				'scheduledDeployments.createProjectScheduledDeployment'
			].riskLevel,
		description:
			deployHQOperations[
				'scheduledDeployments.createProjectScheduledDeployment'
			].description,
	},
	'scheduledDeployments.getProjectScheduledDeploymentById': {
		riskLevel:
			deployHQOperations[
				'scheduledDeployments.getProjectScheduledDeploymentById'
			].riskLevel,
		description:
			deployHQOperations[
				'scheduledDeployments.getProjectScheduledDeploymentById'
			].description,
	},
	'scheduledDeployments.replaceProjectScheduledDeployment': {
		riskLevel:
			deployHQOperations[
				'scheduledDeployments.replaceProjectScheduledDeployment'
			].riskLevel,
		description:
			deployHQOperations[
				'scheduledDeployments.replaceProjectScheduledDeployment'
			].description,
	},
	'scheduledDeployments.updateProjectScheduledDeployment': {
		riskLevel:
			deployHQOperations[
				'scheduledDeployments.updateProjectScheduledDeployment'
			].riskLevel,
		description:
			deployHQOperations[
				'scheduledDeployments.updateProjectScheduledDeployment'
			].description,
	},
	'scheduledDeployments.deleteProjectScheduledDeployment': {
		riskLevel:
			deployHQOperations[
				'scheduledDeployments.deleteProjectScheduledDeployment'
			].riskLevel,
		description:
			deployHQOperations[
				'scheduledDeployments.deleteProjectScheduledDeployment'
			].description,
	},
	'serverGroups.listProjectServerGroups': {
		riskLevel:
			deployHQOperations['serverGroups.listProjectServerGroups'].riskLevel,
		description:
			deployHQOperations['serverGroups.listProjectServerGroups'].description,
	},
	'serverGroups.createProjectServerGroup': {
		riskLevel:
			deployHQOperations['serverGroups.createProjectServerGroup'].riskLevel,
		description:
			deployHQOperations['serverGroups.createProjectServerGroup'].description,
	},
	'serverGroups.getProjectServerGroupById': {
		riskLevel:
			deployHQOperations['serverGroups.getProjectServerGroupById'].riskLevel,
		description:
			deployHQOperations['serverGroups.getProjectServerGroupById'].description,
	},
	'serverGroups.replaceProjectServerGroup': {
		riskLevel:
			deployHQOperations['serverGroups.replaceProjectServerGroup'].riskLevel,
		description:
			deployHQOperations['serverGroups.replaceProjectServerGroup'].description,
	},
	'serverGroups.updateProjectServerGroup': {
		riskLevel:
			deployHQOperations['serverGroups.updateProjectServerGroup'].riskLevel,
		description:
			deployHQOperations['serverGroups.updateProjectServerGroup'].description,
	},
	'serverGroups.deleteProjectServerGroup': {
		riskLevel:
			deployHQOperations['serverGroups.deleteProjectServerGroup'].riskLevel,
		description:
			deployHQOperations['serverGroups.deleteProjectServerGroup'].description,
	},
	'servers.listProjectServers': {
		riskLevel: deployHQOperations['servers.listProjectServers'].riskLevel,
		description: deployHQOperations['servers.listProjectServers'].description,
	},
	'servers.createProjectServer': {
		riskLevel: deployHQOperations['servers.createProjectServer'].riskLevel,
		description: deployHQOperations['servers.createProjectServer'].description,
	},
	'servers.getProjectServerById': {
		riskLevel: deployHQOperations['servers.getProjectServerById'].riskLevel,
		description: deployHQOperations['servers.getProjectServerById'].description,
	},
	'servers.replaceProjectServer': {
		riskLevel: deployHQOperations['servers.replaceProjectServer'].riskLevel,
		description: deployHQOperations['servers.replaceProjectServer'].description,
	},
	'servers.updateProjectServer': {
		riskLevel: deployHQOperations['servers.updateProjectServer'].riskLevel,
		description: deployHQOperations['servers.updateProjectServer'].description,
	},
	'servers.deleteProjectServer': {
		riskLevel: deployHQOperations['servers.deleteProjectServer'].riskLevel,
		description: deployHQOperations['servers.deleteProjectServer'].description,
	},
	'servers.resetHostKeyProjectServer': {
		riskLevel:
			deployHQOperations['servers.resetHostKeyProjectServer'].riskLevel,
		description:
			deployHQOperations['servers.resetHostKeyProjectServer'].description,
	},
	'servers.serverMetricsProjectServerServerMetric': {
		riskLevel:
			deployHQOperations['servers.serverMetricsProjectServerServerMetric']
				.riskLevel,
		description:
			deployHQOperations['servers.serverMetricsProjectServerServerMetric']
				.description,
	},
	'testAccess.createProjectServerTestAccess': {
		riskLevel:
			deployHQOperations['testAccess.createProjectServerTestAccess'].riskLevel,
		description:
			deployHQOperations['testAccess.createProjectServerTestAccess']
				.description,
	},
	'sshCommands.listProjectSshCommands': {
		riskLevel:
			deployHQOperations['sshCommands.listProjectSshCommands'].riskLevel,
		description:
			deployHQOperations['sshCommands.listProjectSshCommands'].description,
	},
	'sshCommands.createProjectSshCommand': {
		riskLevel:
			deployHQOperations['sshCommands.createProjectSshCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.createProjectSshCommand'].description,
	},
	'sshCommands.getProjectSshCommandById': {
		riskLevel:
			deployHQOperations['sshCommands.getProjectSshCommandById'].riskLevel,
		description:
			deployHQOperations['sshCommands.getProjectSshCommandById'].description,
	},
	'sshCommands.replaceProjectSshCommand': {
		riskLevel:
			deployHQOperations['sshCommands.replaceProjectSshCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.replaceProjectSshCommand'].description,
	},
	'sshCommands.updateProjectSshCommand': {
		riskLevel:
			deployHQOperations['sshCommands.updateProjectSshCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.updateProjectSshCommand'].description,
	},
	'sshCommands.deleteProjectSshCommand': {
		riskLevel:
			deployHQOperations['sshCommands.deleteProjectSshCommand'].riskLevel,
		description:
			deployHQOperations['sshCommands.deleteProjectSshCommand'].description,
	},
	'testAccess.createProjectTestAccess': {
		riskLevel:
			deployHQOperations['testAccess.createProjectTestAccess'].riskLevel,
		description:
			deployHQOperations['testAccess.createProjectTestAccess'].description,
	},
	'testAccess.getProjectTestAccess': {
		riskLevel: deployHQOperations['testAccess.getProjectTestAccess'].riskLevel,
		description:
			deployHQOperations['testAccess.getProjectTestAccess'].description,
	},
	'account.resetPasswordSubmitReset': {
		riskLevel: deployHQOperations['account.resetPasswordSubmitReset'].riskLevel,
		description:
			deployHQOperations['account.resetPasswordSubmitReset'].description,
	},
	'security.createSecurityApiKey': {
		riskLevel: deployHQOperations['security.createSecurityApiKey'].riskLevel,
		description:
			deployHQOperations['security.createSecurityApiKey'].description,
	},
	'security.deleteSecurityApiKey': {
		riskLevel: deployHQOperations['security.deleteSecurityApiKey'].riskLevel,
		description:
			deployHQOperations['security.deleteSecurityApiKey'].description,
	},
	'sshKeys.listSshKeys': {
		riskLevel: deployHQOperations['sshKeys.listSshKeys'].riskLevel,
		description: deployHQOperations['sshKeys.listSshKeys'].description,
	},
	'sshKeys.createSshKey': {
		riskLevel: deployHQOperations['sshKeys.createSshKey'].riskLevel,
		description: deployHQOperations['sshKeys.createSshKey'].description,
	},
	'sshKeys.deleteSshKey': {
		riskLevel: deployHQOperations['sshKeys.deleteSshKey'].riskLevel,
		description: deployHQOperations['sshKeys.deleteSshKey'].description,
	},
	'sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey': {
		riskLevel:
			deployHQOperations['sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey']
				.riskLevel,
		description:
			deployHQOperations['sshKeys.downloadPrivateKeySshKeyDownloadPrivateKey']
				.description,
	},
	'teams.listTeams': {
		riskLevel: deployHQOperations['teams.listTeams'].riskLevel,
		description: deployHQOperations['teams.listTeams'].description,
	},
	'teams.createTeam': {
		riskLevel: deployHQOperations['teams.createTeam'].riskLevel,
		description: deployHQOperations['teams.createTeam'].description,
	},
	'teams.getTeam': {
		riskLevel: deployHQOperations['teams.getTeam'].riskLevel,
		description: deployHQOperations['teams.getTeam'].description,
	},
	'teams.replaceTeam': {
		riskLevel: deployHQOperations['teams.replaceTeam'].riskLevel,
		description: deployHQOperations['teams.replaceTeam'].description,
	},
	'teams.updateTeam': {
		riskLevel: deployHQOperations['teams.updateTeam'].riskLevel,
		description: deployHQOperations['teams.updateTeam'].description,
	},
	'teams.deleteTeam': {
		riskLevel: deployHQOperations['teams.deleteTeam'].riskLevel,
		description: deployHQOperations['teams.deleteTeam'].description,
	},
	'templates.listTemplates': {
		riskLevel: deployHQOperations['templates.listTemplates'].riskLevel,
		description: deployHQOperations['templates.listTemplates'].description,
	},
	'templates.createTemplate': {
		riskLevel: deployHQOperations['templates.createTemplate'].riskLevel,
		description: deployHQOperations['templates.createTemplate'].description,
	},
	'templates.publicTemplatesTemplate': {
		riskLevel:
			deployHQOperations['templates.publicTemplatesTemplate'].riskLevel,
		description:
			deployHQOperations['templates.publicTemplatesTemplate'].description,
	},
	'templates.replaceTemplate': {
		riskLevel: deployHQOperations['templates.replaceTemplate'].riskLevel,
		description: deployHQOperations['templates.replaceTemplate'].description,
	},
	'templates.updateTemplate': {
		riskLevel: deployHQOperations['templates.updateTemplate'].riskLevel,
		description: deployHQOperations['templates.updateTemplate'].description,
	},
	'templates.deleteTemplate': {
		riskLevel: deployHQOperations['templates.deleteTemplate'].riskLevel,
		description: deployHQOperations['templates.deleteTemplate'].description,
	},
	'templates.showPublicTemplateTemplatePublic': {
		riskLevel:
			deployHQOperations['templates.showPublicTemplateTemplatePublic']
				.riskLevel,
		description:
			deployHQOperations['templates.showPublicTemplateTemplatePublic']
				.description,
	},
	'users.listUsers': {
		riskLevel: deployHQOperations['users.listUsers'].riskLevel,
		description: deployHQOperations['users.listUsers'].description,
	},
	'users.createUser': {
		riskLevel: deployHQOperations['users.createUser'].riskLevel,
		description: deployHQOperations['users.createUser'].description,
	},
	'users.getUser': {
		riskLevel: deployHQOperations['users.getUser'].riskLevel,
		description: deployHQOperations['users.getUser'].description,
	},
	'users.replaceUser': {
		riskLevel: deployHQOperations['users.replaceUser'].riskLevel,
		description: deployHQOperations['users.replaceUser'].description,
	},
	'users.updateUser': {
		riskLevel: deployHQOperations['users.updateUser'].riskLevel,
		description: deployHQOperations['users.updateUser'].description,
	},
	'users.deleteUser': {
		riskLevel: deployHQOperations['users.deleteUser'].riskLevel,
		description: deployHQOperations['users.deleteUser'].description,
	},
	'users.resendInvitationUserResendInvitation': {
		riskLevel:
			deployHQOperations['users.resendInvitationUserResendInvitation']
				.riskLevel,
		description:
			deployHQOperations['users.resendInvitationUserResendInvitation']
				.description,
	},
	'zones.listZones': {
		riskLevel: deployHQOperations['zones.listZones'].riskLevel,
		description: deployHQOperations['zones.listZones'].description,
	},
	'projects.statusBadgeStatusBadge': {
		riskLevel: deployHQOperations['projects.statusBadgeStatusBadge'].riskLevel,
		description:
			deployHQOperations['projects.statusBadgeStatusBadge'].description,
	},
	'projects.statusBadgeStatusBadgeByIdentifier': {
		riskLevel:
			deployHQOperations['projects.statusBadgeStatusBadgeByIdentifier']
				.riskLevel,
		description:
			deployHQOperations['projects.statusBadgeStatusBadgeByIdentifier']
				.description,
	},
} as const satisfies RequiredPluginEndpointMeta<typeof DeployHQEndpoints>;

export type DeployHQBoundEndpointTree = typeof DeployHQEndpoints;
