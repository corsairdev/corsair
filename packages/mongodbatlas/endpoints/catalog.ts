// Generated with endpoints/operation-types.ts from the Atlas Admin API v2
// spec: one entry per operation in mongodbatlas-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { mongodbatlasSchemaEntry } from './openapi-schema';
import { createMongoDBAtlasOperation as op } from './operations';

export const mongodbatlasEndpointsNested = {
	accessTracking: {
		getAccessHistoryCluster: op('accessTracking.getAccessHistoryCluster'),
		getAccessHistoryProcess: op('accessTracking.getAccessHistoryProcess'),
	},
	activityFeed: {
		getGroupActivityFeed: op('activityFeed.getGroupActivityFeed'),
		getOrgActivityFeed: op('activityFeed.getOrgActivityFeed'),
	},
	aiModelApiKeys: {
		createGroupModelKey: op('aiModelApiKeys.createGroupModelKey'),
		deleteGroupModelKey: op('aiModelApiKeys.deleteGroupModelKey'),
		getGroupModelKey: op('aiModelApiKeys.getGroupModelKey'),
		getOrgModelKey: op('aiModelApiKeys.getOrgModelKey'),
		listGroupModelKeys: op('aiModelApiKeys.listGroupModelKeys'),
		listOrgModelKeys: op('aiModelApiKeys.listOrgModelKeys'),
		updateGroupModelKey: op('aiModelApiKeys.updateGroupModelKey'),
	},
	aiModelRateLimits: {
		getGroupModelLimits: op('aiModelRateLimits.getGroupModelLimits'),
		getGroupRateLimits: op('aiModelRateLimits.getGroupRateLimits'),
		getOrgModelLimits: op('aiModelRateLimits.getOrgModelLimits'),
		getOrgRateLimits: op('aiModelRateLimits.getOrgRateLimits'),
		resetGroupModelLimits: op('aiModelRateLimits.resetGroupModelLimits'),
		resetGroupRateLimits: op('aiModelRateLimits.resetGroupRateLimits'),
		updateGroupRateLimits: op('aiModelRateLimits.updateGroupRateLimits'),
	},
	alertConfigurations: {
		createAlertConfig: op('alertConfigurations.createAlertConfig'),
		deleteAlertConfig: op('alertConfigurations.deleteAlertConfig'),
		getAlertConfig: op('alertConfigurations.getAlertConfig'),
		getAlertConfigs: op('alertConfigurations.getAlertConfigs'),
		listAlertConfigs: op('alertConfigurations.listAlertConfigs'),
		listMatcherFieldNames: op('alertConfigurations.listMatcherFieldNames'),
		toggleAlertConfig: op('alertConfigurations.toggleAlertConfig'),
		updateAlertConfig: op('alertConfigurations.updateAlertConfig'),
	},
	alerts: {
		acknowledgeAlert: op('alerts.acknowledgeAlert'),
		getAlert: op('alerts.getAlert'),
		getAlertConfigAlerts: op('alerts.getAlertConfigAlerts'),
		listAlerts: op('alerts.listAlerts'),
	},
	atlasSearch: {
		createClusterSearchDeployment: op(
			'atlasSearch.createClusterSearchDeployment',
		),
		createClusterSearchIndex: op('atlasSearch.createClusterSearchIndex'),
		deleteClusterSearchDeployment: op(
			'atlasSearch.deleteClusterSearchDeployment',
		),
		deleteClusterSearchIndex: op('atlasSearch.deleteClusterSearchIndex'),
		deleteIndexByName: op('atlasSearch.deleteIndexByName'),
		getClusterSearchDeployment: op('atlasSearch.getClusterSearchDeployment'),
		getClusterSearchIndex: op('atlasSearch.getClusterSearchIndex'),
		getIndexByName: op('atlasSearch.getIndexByName'),
		listClusterSearchIndexes: op('atlasSearch.listClusterSearchIndexes'),
		listSearchIndex: op('atlasSearch.listSearchIndex'),
		updateClusterSearchDeployment: op(
			'atlasSearch.updateClusterSearchDeployment',
		),
		updateClusterSearchIndex: op('atlasSearch.updateClusterSearchIndex'),
		updateIndexByName: op('atlasSearch.updateIndexByName'),
	},
	auditing: {
		getGroupAuditLog: op('auditing.getGroupAuditLog'),
		updateAuditLog: op('auditing.updateAuditLog'),
	},
	awsClustersDns: {
		getAwsCustomDns: op('awsClustersDns.getAwsCustomDns'),
		toggleAwsCustomDns: op('awsClustersDns.toggleAwsCustomDns'),
	},
	cloudBackups: {
		cancelBackupRestoreJob: op('cloudBackups.cancelBackupRestoreJob'),
		createBackupExport: op('cloudBackups.createBackupExport'),
		createBackupPrivateEndpoint: op('cloudBackups.createBackupPrivateEndpoint'),
		createBackupRestoreJob: op('cloudBackups.createBackupRestoreJob'),
		createCollectionRestoreJob: op('cloudBackups.createCollectionRestoreJob'),
		createExportBucket: op('cloudBackups.createExportBucket'),
		deleteBackupPrivateEndpoint: op('cloudBackups.deleteBackupPrivateEndpoint'),
		deleteBackupShardedCluster: op('cloudBackups.deleteBackupShardedCluster'),
		deleteClusterBackupSchedule: op('cloudBackups.deleteClusterBackupSchedule'),
		deleteClusterBackupSnapshot: op('cloudBackups.deleteClusterBackupSnapshot'),
		deleteExportBucket: op('cloudBackups.deleteExportBucket'),
		disableCompliancePolicy: op('cloudBackups.disableCompliancePolicy'),
		getBackupExport: op('cloudBackups.getBackupExport'),
		getBackupPrivateEndpoint: op('cloudBackups.getBackupPrivateEndpoint'),
		getBackupRestoreJob: op('cloudBackups.getBackupRestoreJob'),
		getBackupSchedule: op('cloudBackups.getBackupSchedule'),
		getBackupShardedCluster: op('cloudBackups.getBackupShardedCluster'),
		getBackupSnapshotDatabase: op('cloudBackups.getBackupSnapshotDatabase'),
		getClusterBackupSnapshot: op('cloudBackups.getClusterBackupSnapshot'),
		getCollectionRestoreJob: op('cloudBackups.getCollectionRestoreJob'),
		getCompliancePolicy: op('cloudBackups.getCompliancePolicy'),
		getExportBucket: op('cloudBackups.getExportBucket'),
		getRestoreJobCollection: op('cloudBackups.getRestoreJobCollection'),
		getSnapshotDatabaseCollection: op(
			'cloudBackups.getSnapshotDatabaseCollection',
		),
		listBackupExports: op('cloudBackups.listBackupExports'),
		listBackupPrivateEndpoints: op('cloudBackups.listBackupPrivateEndpoints'),
		listBackupRestoreJobs: op('cloudBackups.listBackupRestoreJobs'),
		listBackupShardedClusters: op('cloudBackups.listBackupShardedClusters'),
		listBackupSnapshotDatabases: op('cloudBackups.listBackupSnapshotDatabases'),
		listBackupSnapshots: op('cloudBackups.listBackupSnapshots'),
		listCollectionRestoreJobs: op('cloudBackups.listCollectionRestoreJobs'),
		listExportBuckets: op('cloudBackups.listExportBuckets'),
		listRestoreJobCollections: op('cloudBackups.listRestoreJobCollections'),
		listSnapshotDatabaseCollections: op(
			'cloudBackups.listSnapshotDatabaseCollections',
		),
		takeSnapshots: op('cloudBackups.takeSnapshots'),
		updateBackupExportBucket: op('cloudBackups.updateBackupExportBucket'),
		updateBackupSchedule: op('cloudBackups.updateBackupSchedule'),
		updateBackupSnapshot: op('cloudBackups.updateBackupSnapshot'),
		updateCompliancePolicy: op('cloudBackups.updateCompliancePolicy'),
	},
	cloudMigrationService: {
		createGroupLiveMigration: op(
			'cloudMigrationService.createGroupLiveMigration',
		),
		createLinkToken: op('cloudMigrationService.createLinkToken'),
		cutoverMigration: op('cloudMigrationService.cutoverMigration'),
		deleteLinkTokens: op('cloudMigrationService.deleteLinkTokens'),
		getGroupLiveMigration: op('cloudMigrationService.getGroupLiveMigration'),
		getMigrationValidateStatus: op(
			'cloudMigrationService.getMigrationValidateStatus',
		),
		listAvailableProjects: op('cloudMigrationService.listAvailableProjects'),
		validateLiveMigrations: op('cloudMigrationService.validateLiveMigrations'),
	},
	cloudProviderAccess: {
		authorizeProviderAccessRole: op(
			'cloudProviderAccess.authorizeProviderAccessRole',
		),
		createCloudProviderAccess: op(
			'cloudProviderAccess.createCloudProviderAccess',
		),
		deauthorizeProviderAccessRole: op(
			'cloudProviderAccess.deauthorizeProviderAccessRole',
		),
		getCloudProviderAccess: op('cloudProviderAccess.getCloudProviderAccess'),
		listCloudProviderAccess: op('cloudProviderAccess.listCloudProviderAccess'),
	},
	clusterOutageSimulation: {
		endOutageSimulation: op('clusterOutageSimulation.endOutageSimulation'),
		getOutageSimulation: op('clusterOutageSimulation.getOutageSimulation'),
		startOutageSimulation: op('clusterOutageSimulation.startOutageSimulation'),
	},
	clusters: {
		createCluster: op('clusters.createCluster'),
		deleteCluster: op('clusters.deleteCluster'),
		getCluster: op('clusters.getCluster'),
		getClusterAdaptiveSettings: op('clusters.getClusterAdaptiveSettings'),
		getClusterStatus: op('clusters.getClusterStatus'),
		getProcessArgs: op('clusters.getProcessArgs'),
		getSampleDatasetLoad: op('clusters.getSampleDatasetLoad'),
		grantMongoEmployeeAccess: op('clusters.grantMongoEmployeeAccess'),
		listClusterDetails: op('clusters.listClusterDetails'),
		listClusterProviderRegions: op('clusters.listClusterProviderRegions'),
		listClusters: op('clusters.listClusters'),
		pinFeatureCompatibilityVersion: op(
			'clusters.pinFeatureCompatibilityVersion',
		),
		requestSampleDatasetLoad: op('clusters.requestSampleDatasetLoad'),
		restartPrimaries: op('clusters.restartPrimaries'),
		revokeMongoEmployeeAccess: op('clusters.revokeMongoEmployeeAccess'),
		unpinFeatureCompatibilityVersion: op(
			'clusters.unpinFeatureCompatibilityVersion',
		),
		updateCluster: op('clusters.updateCluster'),
		updateClusterAdaptiveSettings: op('clusters.updateClusterAdaptiveSettings'),
		updateProcessArgs: op('clusters.updateProcessArgs'),
		upgradeTenantUpgrade: op('clusters.upgradeTenantUpgrade'),
		validateGroupClusterConfigurations: op(
			'clusters.validateGroupClusterConfigurations',
		),
	},
	collectionLevelMetrics: {
		getClusterNamespaces: op('collectionLevelMetrics.getClusterNamespaces'),
		getProcessNamespaces: op('collectionLevelMetrics.getProcessNamespaces'),
		listCollStatMeasurements: op(
			'collectionLevelMetrics.listCollStatMeasurements',
		),
		listCollStatMetrics: op('collectionLevelMetrics.listCollStatMetrics'),
		listPinnedNamespaces: op('collectionLevelMetrics.listPinnedNamespaces'),
		listProcessMeasurements: op(
			'collectionLevelMetrics.listProcessMeasurements',
		),
		pinNamespaces: op('collectionLevelMetrics.pinNamespaces'),
		unpinNamespaces: op('collectionLevelMetrics.unpinNamespaces'),
		updatePinnedNamespaces: op('collectionLevelMetrics.updatePinnedNamespaces'),
	},
	customDatabaseRoles: {
		createCustomDbRole: op('customDatabaseRoles.createCustomDbRole'),
		deleteCustomDbRole: op('customDatabaseRoles.deleteCustomDbRole'),
		getCustomDbRole: op('customDatabaseRoles.getCustomDbRole'),
		listCustomDbRoles: op('customDatabaseRoles.listCustomDbRoles'),
		updateCustomDbRole: op('customDatabaseRoles.updateCustomDbRole'),
	},
	dataFederation: {
		createDataFederation: op('dataFederation.createDataFederation'),
		createPrivateEndpointId: op('dataFederation.createPrivateEndpointId'),
		deleteDataFederation: op('dataFederation.deleteDataFederation'),
		deleteDataFederationLimit: op('dataFederation.deleteDataFederationLimit'),
		deletePrivateEndpointId: op('dataFederation.deletePrivateEndpointId'),
		downloadFederationQueryLogs: op(
			'dataFederation.downloadFederationQueryLogs',
		),
		getDataFederation: op('dataFederation.getDataFederation'),
		getDataFederationLimit: op('dataFederation.getDataFederationLimit'),
		getPrivateEndpointId: op('dataFederation.getPrivateEndpointId'),
		listDataFederation: op('dataFederation.listDataFederation'),
		listDataFederationLimits: op('dataFederation.listDataFederationLimits'),
		listPrivateEndpointIds: op('dataFederation.listPrivateEndpointIds'),
		setDataFederationLimit: op('dataFederation.setDataFederationLimit'),
		updateDataFederation: op('dataFederation.updateDataFederation'),
	},
	databaseUsers: {
		createDatabaseUser: op('databaseUsers.createDatabaseUser'),
		deleteDatabaseUser: op('databaseUsers.deleteDatabaseUser'),
		getDatabaseUser: op('databaseUsers.getDatabaseUser'),
		listDatabaseUsers: op('databaseUsers.listDatabaseUsers'),
		updateDatabaseUser: op('databaseUsers.updateDatabaseUser'),
	},
	encryptionAtRestUsingCustomerKeyManagement: {
		createRestPrivateEndpoint: op(
			'encryptionAtRestUsingCustomerKeyManagement.createRestPrivateEndpoint',
		),
		getEncryptionAtRest: op(
			'encryptionAtRestUsingCustomerKeyManagement.getEncryptionAtRest',
		),
		getRestPrivateEndpoint: op(
			'encryptionAtRestUsingCustomerKeyManagement.getRestPrivateEndpoint',
		),
		listRestPrivateEndpoints: op(
			'encryptionAtRestUsingCustomerKeyManagement.listRestPrivateEndpoints',
		),
		requestPrivateEndpointDeletion: op(
			'encryptionAtRestUsingCustomerKeyManagement.requestPrivateEndpointDeletion',
		),
		updateEncryptionAtRest: op(
			'encryptionAtRestUsingCustomerKeyManagement.updateEncryptionAtRest',
		),
	},
	events: {
		getGroupEvent: op('events.getGroupEvent'),
		getOrgEvent: op('events.getOrgEvent'),
		listEventTypes: op('events.listEventTypes'),
		listGroupEvents: op('events.listGroupEvents'),
		listOrgEvents: op('events.listOrgEvents'),
	},
	federatedAuthentication: {
		createIdentityProvider: op(
			'federatedAuthentication.createIdentityProvider',
		),
		createRoleMapping: op('federatedAuthentication.createRoleMapping'),
		deleteFederationSetting: op(
			'federatedAuthentication.deleteFederationSetting',
		),
		deleteIdentityProvider: op(
			'federatedAuthentication.deleteIdentityProvider',
		),
		deleteRoleMapping: op('federatedAuthentication.deleteRoleMapping'),
		getConnectedOrgConfig: op('federatedAuthentication.getConnectedOrgConfig'),
		getFederationSettings: op('federatedAuthentication.getFederationSettings'),
		getIdentityProvider: op('federatedAuthentication.getIdentityProvider'),
		getIdentityProviderMetadata: op(
			'federatedAuthentication.getIdentityProviderMetadata',
		),
		getRoleMapping: op('federatedAuthentication.getRoleMapping'),
		listConnectedOrgConfigs: op(
			'federatedAuthentication.listConnectedOrgConfigs',
		),
		listIdentityProviders: op('federatedAuthentication.listIdentityProviders'),
		listRoleMappings: op('federatedAuthentication.listRoleMappings'),
		removeConnectedOrgConfig: op(
			'federatedAuthentication.removeConnectedOrgConfig',
		),
		revokeIdentityProviderJwks: op(
			'federatedAuthentication.revokeIdentityProviderJwks',
		),
		updateConnectedOrgConfig: op(
			'federatedAuthentication.updateConnectedOrgConfig',
		),
		updateIdentityProvider: op(
			'federatedAuthentication.updateIdentityProvider',
		),
		updateRoleMapping: op('federatedAuthentication.updateRoleMapping'),
	},
	flexClusters: {
		createFlexCluster: op('flexClusters.createFlexCluster'),
		deleteFlexCluster: op('flexClusters.deleteFlexCluster'),
		getFlexCluster: op('flexClusters.getFlexCluster'),
		listFlexClusters: op('flexClusters.listFlexClusters'),
		tenantUpgrade: op('flexClusters.tenantUpgrade'),
		updateFlexCluster: op('flexClusters.updateFlexCluster'),
	},
	flexRestoreJobs: {
		createFlexRestoreJob: op('flexRestoreJobs.createFlexRestoreJob'),
		getFlexRestoreJob: op('flexRestoreJobs.getFlexRestoreJob'),
		listFlexRestoreJobs: op('flexRestoreJobs.listFlexRestoreJobs'),
	},
	flexSnapshots: {
		downloadFlexBackup: op('flexSnapshots.downloadFlexBackup'),
		getFlexBackupSnapshot: op('flexSnapshots.getFlexBackupSnapshot'),
		listFlexBackupSnapshots: op('flexSnapshots.listFlexBackupSnapshots'),
	},
	globalClusters: {
		createCustomZoneMapping: op('globalClusters.createCustomZoneMapping'),
		createManagedNamespace: op('globalClusters.createManagedNamespace'),
		deleteCustomZoneMapping: op('globalClusters.deleteCustomZoneMapping'),
		deleteManagedNamespaces: op('globalClusters.deleteManagedNamespaces'),
		getClusterGlobalWrites: op('globalClusters.getClusterGlobalWrites'),
	},
	invoices: {
		createCostExplorerProcess: op('invoices.createCostExplorerProcess'),
		createOrgInvoiceReport: op('invoices.createOrgInvoiceReport'),
		getCostExplorerUsage: op('invoices.getCostExplorerUsage'),
		getInvoice: op('invoices.getInvoice'),
		getInvoiceCsv: op('invoices.getInvoiceCsv'),
		getOrgAssociatedInvoices: op('invoices.getOrgAssociatedInvoices'),
		getOrgInvoiceReport: op('invoices.getOrgInvoiceReport'),
		getSku: op('invoices.getSku'),
		listInvoicePending: op('invoices.listInvoicePending'),
		listInvoices: op('invoices.listInvoices'),
		listOrgInvoiceReports: op('invoices.listOrgInvoiceReports'),
		listSkuServices: op('invoices.listSkuServices'),
		listSkus: op('invoices.listSkus'),
		searchInvoiceLineItems: op('invoices.searchInvoiceLineItems'),
	},
	ldapConfiguration: {
		deleteLdapUserMapping: op('ldapConfiguration.deleteLdapUserMapping'),
		getUserSecurity: op('ldapConfiguration.getUserSecurity'),
		getUserSecurityVerify: op('ldapConfiguration.getUserSecurityVerify'),
		updateUserSecurity: op('ldapConfiguration.updateUserSecurity'),
		verifyUserSecurityLdap: op('ldapConfiguration.verifyUserSecurityLdap'),
	},
	maintenanceWindows: {
		deferMaintenanceWindow: op('maintenanceWindows.deferMaintenanceWindow'),
		getMaintenanceWindow: op('maintenanceWindows.getMaintenanceWindow'),
		resetMaintenanceWindow: op('maintenanceWindows.resetMaintenanceWindow'),
		toggleMaintenanceAutoDefer: op(
			'maintenanceWindows.toggleMaintenanceAutoDefer',
		),
		updateMaintenanceWindow: op('maintenanceWindows.updateMaintenanceWindow'),
	},
	metricIntegrations: {
		createGroupMetricIntegration: op(
			'metricIntegrations.createGroupMetricIntegration',
		),
		deleteGroupMetricIntegration: op(
			'metricIntegrations.deleteGroupMetricIntegration',
		),
		getGroupMetricIntegration: op(
			'metricIntegrations.getGroupMetricIntegration',
		),
		listGroupMetricIntegrations: op(
			'metricIntegrations.listGroupMetricIntegrations',
		),
		updateGroupMetricIntegration: op(
			'metricIntegrations.updateGroupMetricIntegration',
		),
	},
	mongoDbCloudUsers: {
		addGroupUserRole: op('mongoDbCloudUsers.addGroupUserRole'),
		addGroupUsers: op('mongoDbCloudUsers.addGroupUsers'),
		addOrgRole: op('mongoDbCloudUsers.addOrgRole'),
		addOrgTeamUser: op('mongoDbCloudUsers.addOrgTeamUser'),
		createOrgUser: op('mongoDbCloudUsers.createOrgUser'),
		getGroupUser: op('mongoDbCloudUsers.getGroupUser'),
		getOrgUser: op('mongoDbCloudUsers.getOrgUser'),
		listGroupUsers: op('mongoDbCloudUsers.listGroupUsers'),
		listOrgUsers: op('mongoDbCloudUsers.listOrgUsers'),
		listTeamUsers: op('mongoDbCloudUsers.listTeamUsers'),
		removeGroupUser: op('mongoDbCloudUsers.removeGroupUser'),
		removeGroupUserRole: op('mongoDbCloudUsers.removeGroupUserRole'),
		removeOrgRole: op('mongoDbCloudUsers.removeOrgRole'),
		removeOrgTeamUser: op('mongoDbCloudUsers.removeOrgTeamUser'),
		removeOrgUser: op('mongoDbCloudUsers.removeOrgUser'),
		updateOrgUser: op('mongoDbCloudUsers.updateOrgUser'),
	},
	monitoringAndLogs: {
		downloadClusterLog: op('monitoringAndLogs.downloadClusterLog'),
		getDatabase: op('monitoringAndLogs.getDatabase'),
		getDatabaseMeasurements: op('monitoringAndLogs.getDatabaseMeasurements'),
		getGroupProcess: op('monitoringAndLogs.getGroupProcess'),
		getIndexMeasurements: op('monitoringAndLogs.getIndexMeasurements'),
		getProcessDisk: op('monitoringAndLogs.getProcessDisk'),
		getProcessDiskMeasurements: op(
			'monitoringAndLogs.getProcessDiskMeasurements',
		),
		getProcessMeasurements: op('monitoringAndLogs.getProcessMeasurements'),
		listDatabases: op('monitoringAndLogs.listDatabases'),
		listGroupProcesses: op('monitoringAndLogs.listGroupProcesses'),
		listHostFtsMetrics: op('monitoringAndLogs.listHostFtsMetrics'),
		listIndexMeasurements: op('monitoringAndLogs.listIndexMeasurements'),
		listMeasurements: op('monitoringAndLogs.listMeasurements'),
		listProcessDisks: op('monitoringAndLogs.listProcessDisks'),
	},
	networkPeering: {
		createGroupContainer: op('networkPeering.createGroupContainer'),
		createGroupPeer: op('networkPeering.createGroupPeer'),
		deleteGroupContainer: op('networkPeering.deleteGroupContainer'),
		deleteGroupPeer: op('networkPeering.deleteGroupPeer'),
		getGroupContainer: op('networkPeering.getGroupContainer'),
		getGroupPeer: op('networkPeering.getGroupPeer'),
		listGroupContainerAll: op('networkPeering.listGroupContainerAll'),
		listGroupContainers: op('networkPeering.listGroupContainers'),
		listGroupPeers: op('networkPeering.listGroupPeers'),
		updateGroupContainer: op('networkPeering.updateGroupContainer'),
		updateGroupPeer: op('networkPeering.updateGroupPeer'),
	},
	onlineArchive: {
		createOnlineArchive: op('onlineArchive.createOnlineArchive'),
		deleteOnlineArchive: op('onlineArchive.deleteOnlineArchive'),
		downloadQueryLogs: op('onlineArchive.downloadQueryLogs'),
		getOnlineArchive: op('onlineArchive.getOnlineArchive'),
		listOnlineArchives: op('onlineArchive.listOnlineArchives'),
		updateOnlineArchive: op('onlineArchive.updateOnlineArchive'),
	},
	organizations: {
		createOrg: op('organizations.createOrg'),
		deleteOrg: op('organizations.deleteOrg'),
		getOrg: op('organizations.getOrg'),
		getOrgDelegationSettings: op('organizations.getOrgDelegationSettings'),
		getOrgGroups: op('organizations.getOrgGroups'),
		getOrgMaintenanceSettings: op('organizations.getOrgMaintenanceSettings'),
		getOrgSettings: op('organizations.getOrgSettings'),
		listOrgs: op('organizations.listOrgs'),
		resetOrgMaintenanceSettings: op(
			'organizations.resetOrgMaintenanceSettings',
		),
		updateOrg: op('organizations.updateOrg'),
		updateOrgDelegationSettings: op(
			'organizations.updateOrgDelegationSettings',
		),
		updateOrgMaintenanceSettings: op(
			'organizations.updateOrgMaintenanceSettings',
		),
		updateOrgSettings: op('organizations.updateOrgSettings'),
	},
	overloadProtectionSimulation: {
		createClusterOverloadSimulation: op(
			'overloadProtectionSimulation.createClusterOverloadSimulation',
		),
		deleteClusterOverloadSimulation: op(
			'overloadProtectionSimulation.deleteClusterOverloadSimulation',
		),
		getClusterOverloadSimulation: op(
			'overloadProtectionSimulation.getClusterOverloadSimulation',
		),
		listClusterOverloadSimulations: op(
			'overloadProtectionSimulation.listClusterOverloadSimulations',
		),
	},
	performanceAdvisor: {
		disableManagedSlowMs: op('performanceAdvisor.disableManagedSlowMs'),
		enableManagedSlowMs: op('performanceAdvisor.enableManagedSlowMs'),
		getManagedSlowMs: op('performanceAdvisor.getManagedSlowMs'),
		listClusterSuggestedIndexes: op(
			'performanceAdvisor.listClusterSuggestedIndexes',
		),
		listDropIndexSuggestions: op('performanceAdvisor.listDropIndexSuggestions'),
		listPerformanceAdvisorNamespaces: op(
			'performanceAdvisor.listPerformanceAdvisorNamespaces',
		),
		listSchemaAdvice: op('performanceAdvisor.listSchemaAdvice'),
		listSlowQueryLogs: op('performanceAdvisor.listSlowQueryLogs'),
		listSuggestedIndexes: op('performanceAdvisor.listSuggestedIndexes'),
	},
	privateEndpointServices: {
		createPrivateEndpoint: op('privateEndpointServices.createPrivateEndpoint'),
		createPrivateEndpointService: op(
			'privateEndpointServices.createPrivateEndpointService',
		),
		deletePrivateEndpoint: op('privateEndpointServices.deletePrivateEndpoint'),
		deletePrivateEndpointService: op(
			'privateEndpointServices.deletePrivateEndpointService',
		),
		getPrivateEndpoint: op('privateEndpointServices.getPrivateEndpoint'),
		getPrivateEndpointService: op(
			'privateEndpointServices.getPrivateEndpointService',
		),
		getRegionalEndpointMode: op(
			'privateEndpointServices.getRegionalEndpointMode',
		),
		listPrivateEndpointService: op(
			'privateEndpointServices.listPrivateEndpointService',
		),
		toggleRegionalEndpointMode: op(
			'privateEndpointServices.toggleRegionalEndpointMode',
		),
		updatePrivateEndpointService: op(
			'privateEndpointServices.updatePrivateEndpointService',
		),
	},
	programmaticApiKeys: {
		addGroupApiKey: op('programmaticApiKeys.addGroupApiKey'),
		createGroupApiKey: op('programmaticApiKeys.createGroupApiKey'),
		createOrgAccessEntry: op('programmaticApiKeys.createOrgAccessEntry'),
		createOrgApiKey: op('programmaticApiKeys.createOrgApiKey'),
		deleteAccessEntry: op('programmaticApiKeys.deleteAccessEntry'),
		deleteOrgApiKey: op('programmaticApiKeys.deleteOrgApiKey'),
		getOrgAccessEntry: op('programmaticApiKeys.getOrgAccessEntry'),
		getOrgApiKey: op('programmaticApiKeys.getOrgApiKey'),
		listGroupApiKeys: op('programmaticApiKeys.listGroupApiKeys'),
		listOrgAccessEntries: op('programmaticApiKeys.listOrgAccessEntries'),
		listOrgApiKeys: op('programmaticApiKeys.listOrgApiKeys'),
		removeGroupApiKey: op('programmaticApiKeys.removeGroupApiKey'),
		updateApiKeyRoles: op('programmaticApiKeys.updateApiKeyRoles'),
		updateOrgApiKey: op('programmaticApiKeys.updateOrgApiKey'),
	},
	projectIpAccessList: {
		createAccessListEntry: op('projectIpAccessList.createAccessListEntry'),
		deleteAccessListEntry: op('projectIpAccessList.deleteAccessListEntry'),
		getAccessListEntry: op('projectIpAccessList.getAccessListEntry'),
		getAccessListStatus: op('projectIpAccessList.getAccessListStatus'),
		listAccessListEntries: op('projectIpAccessList.listAccessListEntries'),
	},
	projects: {
		createGroup: op('projects.createGroup'),
		deleteGroup: op('projects.deleteGroup'),
		deleteGroupLimit: op('projects.deleteGroupLimit'),
		getGroup: op('projects.getGroup'),
		getGroupByName: op('projects.getGroupByName'),
		getGroupIpAddresses: op('projects.getGroupIpAddresses'),
		getGroupLimit: op('projects.getGroupLimit'),
		getGroupSettings: op('projects.getGroupSettings'),
		getMongoDbVersions: op('projects.getMongoDbVersions'),
		listGroupLimits: op('projects.listGroupLimits'),
		listGroups: op('projects.listGroups'),
		migrateGroup: op('projects.migrateGroup'),
		setGroupLimit: op('projects.setGroupLimit'),
		updateGroup: op('projects.updateGroup'),
		updateGroupSettings: op('projects.updateGroupSettings'),
	},
	pushBasedLogExport: {
		createGroupLogIntegration: op(
			'pushBasedLogExport.createGroupLogIntegration',
		),
		createOrgLogIntegration: op('pushBasedLogExport.createOrgLogIntegration'),
		deleteGroupLogIntegration: op(
			'pushBasedLogExport.deleteGroupLogIntegration',
		),
		deleteOrgLogIntegration: op('pushBasedLogExport.deleteOrgLogIntegration'),
		getGroupLogIntegration: op('pushBasedLogExport.getGroupLogIntegration'),
		getOrgLogIntegration: op('pushBasedLogExport.getOrgLogIntegration'),
		listGroupLogIntegrations: op('pushBasedLogExport.listGroupLogIntegrations'),
		listOrgLogIntegrations: op('pushBasedLogExport.listOrgLogIntegrations'),
		updateGroupLogIntegration: op(
			'pushBasedLogExport.updateGroupLogIntegration',
		),
		updateOrgLogIntegration: op('pushBasedLogExport.updateOrgLogIntegration'),
	},
	querySampling: {
		createClusterQuerySampling: op('querySampling.createClusterQuerySampling'),
		deleteClusterQuerySampling: op('querySampling.deleteClusterQuerySampling'),
		getClusterQuerySampling: op('querySampling.getClusterQuerySampling'),
	},
	queryShapeInsights: {
		getClusterQueryShape: op('queryShapeInsights.getClusterQueryShape'),
		getQueryShapeDetails: op('queryShapeInsights.getQueryShapeDetails'),
		listClusterQueryShapes: op('queryShapeInsights.listClusterQueryShapes'),
		listQueryShapeSummaries: op('queryShapeInsights.listQueryShapeSummaries'),
		updateClusterQueryShape: op('queryShapeInsights.updateClusterQueryShape'),
	},
	rateLimiting: {
		getRateLimit: op('rateLimiting.getRateLimit'),
		listRateLimits: op('rateLimiting.listRateLimits'),
	},
	remoteMcpConfigurations: {
		createGroupMcpConfig: op('remoteMcpConfigurations.createGroupMcpConfig'),
		createGroupMcpSecret: op('remoteMcpConfigurations.createGroupMcpSecret'),
		createOrgMcpConfig: op('remoteMcpConfigurations.createOrgMcpConfig'),
		createOrgMcpSecret: op('remoteMcpConfigurations.createOrgMcpSecret'),
		deleteGroupMcpConfig: op('remoteMcpConfigurations.deleteGroupMcpConfig'),
		deleteGroupMcpSecret: op('remoteMcpConfigurations.deleteGroupMcpSecret'),
		deleteOrgMcpConfig: op('remoteMcpConfigurations.deleteOrgMcpConfig'),
		deleteOrgMcpSecret: op('remoteMcpConfigurations.deleteOrgMcpSecret'),
		getGroupMcpConfig: op('remoteMcpConfigurations.getGroupMcpConfig'),
		getGroupMcpSecret: op('remoteMcpConfigurations.getGroupMcpSecret'),
		getOrgMcpConfig: op('remoteMcpConfigurations.getOrgMcpConfig'),
		getOrgMcpSecret: op('remoteMcpConfigurations.getOrgMcpSecret'),
		listGroupMcpConfigs: op('remoteMcpConfigurations.listGroupMcpConfigs'),
		listGroupMcpSecrets: op('remoteMcpConfigurations.listGroupMcpSecrets'),
		listOrgMcpConfigs: op('remoteMcpConfigurations.listOrgMcpConfigs'),
		listOrgMcpSecrets: op('remoteMcpConfigurations.listOrgMcpSecrets'),
		updateGroupMcpConfig: op('remoteMcpConfigurations.updateGroupMcpConfig'),
		updateOrgMcpConfig: op('remoteMcpConfigurations.updateOrgMcpConfig'),
	},
	resourcePolicies: {
		createOrgResourcePolicy: op('resourcePolicies.createOrgResourcePolicy'),
		deleteOrgResourcePolicy: op('resourcePolicies.deleteOrgResourcePolicy'),
		getNonCompliantResources: op('resourcePolicies.getNonCompliantResources'),
		getOrgResourcePolicy: op('resourcePolicies.getOrgResourcePolicy'),
		listOrgResourcePolicies: op('resourcePolicies.listOrgResourcePolicies'),
		updateOrgResourcePolicy: op('resourcePolicies.updateOrgResourcePolicy'),
		validateResourcePolicies: op('resourcePolicies.validateResourcePolicies'),
	},
	rollingIndex: {
		createRollingIndex: op('rollingIndex.createRollingIndex'),
	},
	root: {
		getSystemStatus: op('root.getSystemStatus'),
		listControlPlaneAddresses: op('root.listControlPlaneAddresses'),
	},
	serviceAccounts: {
		createAccessList: op('serviceAccounts.createAccessList'),
		createGroupSecret: op('serviceAccounts.createGroupSecret'),
		createGroupServiceAccount: op('serviceAccounts.createGroupServiceAccount'),
		createOrgAccessList: op('serviceAccounts.createOrgAccessList'),
		createOrgSecret: op('serviceAccounts.createOrgSecret'),
		createOrgServiceAccount: op('serviceAccounts.createOrgServiceAccount'),
		deleteGroupAccessEntry: op('serviceAccounts.deleteGroupAccessEntry'),
		deleteGroupSecret: op('serviceAccounts.deleteGroupSecret'),
		deleteGroupServiceAccount: op('serviceAccounts.deleteGroupServiceAccount'),
		deleteOrgAccessEntry: op('serviceAccounts.deleteOrgAccessEntry'),
		deleteOrgSecret: op('serviceAccounts.deleteOrgSecret'),
		deleteOrgServiceAccount: op('serviceAccounts.deleteOrgServiceAccount'),
		getGroupServiceAccount: op('serviceAccounts.getGroupServiceAccount'),
		getOrgServiceAccount: op('serviceAccounts.getOrgServiceAccount'),
		getServiceAccountGroups: op('serviceAccounts.getServiceAccountGroups'),
		inviteGroupServiceAccount: op('serviceAccounts.inviteGroupServiceAccount'),
		listAccessList: op('serviceAccounts.listAccessList'),
		listGroupServiceAccounts: op('serviceAccounts.listGroupServiceAccounts'),
		listOrgAccessList: op('serviceAccounts.listOrgAccessList'),
		listOrgServiceAccounts: op('serviceAccounts.listOrgServiceAccounts'),
		updateGroupServiceAccount: op('serviceAccounts.updateGroupServiceAccount'),
		updateOrgServiceAccount: op('serviceAccounts.updateOrgServiceAccount'),
	},
	shardKeyAnalyzer: {
		createShardKeyAnalysis: op('shardKeyAnalyzer.createShardKeyAnalysis'),
		getAnalysisOperation: op('shardKeyAnalyzer.getAnalysisOperation'),
		getShardKeyAnalysis: op('shardKeyAnalyzer.getShardKeyAnalysis'),
		listAnalysisOperations: op('shardKeyAnalyzer.listAnalysisOperations'),
		listShardKeyAnalyses: op('shardKeyAnalyzer.listShardKeyAnalyses'),
	},
	shardingInsights: {
		getClusterShardMetric: op('shardingInsights.getClusterShardMetric'),
		getClusterShardingInsights: op(
			'shardingInsights.getClusterShardingInsights',
		),
		getShardMetricMeasurements: op(
			'shardingInsights.getShardMetricMeasurements',
		),
		listClusterShardMetrics: op('shardingInsights.listClusterShardMetrics'),
		listShardMetricMeasurements: op(
			'shardingInsights.listShardMetricMeasurements',
		),
	},
	shardingRecommendations: {
		getClusterShardingRecommendations: op(
			'shardingRecommendations.getClusterShardingRecommendations',
		),
	},
	streams: {
		acceptVpcPeeringConnection: op('streams.acceptVpcPeeringConnection'),
		createFailoverConnection: op('streams.createFailoverConnection'),
		createPrivateLinkConnection: op('streams.createPrivateLinkConnection'),
		createStreamConnection: op('streams.createStreamConnection'),
		createStreamProcessor: op('streams.createStreamProcessor'),
		createStreamWorkspace: op('streams.createStreamWorkspace'),
		createWorkspacePrivateEndpoint: op(
			'streams.createWorkspacePrivateEndpoint',
		),
		deletePrivateLinkConnection: op('streams.deletePrivateLinkConnection'),
		deleteStreamConnection: op('streams.deleteStreamConnection'),
		deleteStreamFailoverConnection: op(
			'streams.deleteStreamFailoverConnection',
		),
		deleteStreamProcessor: op('streams.deleteStreamProcessor'),
		deleteStreamWorkspace: op('streams.deleteStreamWorkspace'),
		deleteVpcPeeringConnection: op('streams.deleteVpcPeeringConnection'),
		deleteWorkspacePrivateEndpoint: op(
			'streams.deleteWorkspacePrivateEndpoint',
		),
		downloadAuditLogs: op('streams.downloadAuditLogs'),
		downloadOperationalLogs: op('streams.downloadOperationalLogs'),
		getAccountDetails: op('streams.getAccountDetails'),
		getPrivateLinkConnection: op('streams.getPrivateLinkConnection'),
		getStreamConnection: op('streams.getStreamConnection'),
		getStreamFailoverConnection: op('streams.getStreamFailoverConnection'),
		getStreamProcessor: op('streams.getStreamProcessor'),
		getStreamProcessors: op('streams.getStreamProcessors'),
		getStreamWorkspace: op('streams.getStreamWorkspace'),
		getWorkspacePrivateEndpoint: op('streams.getWorkspacePrivateEndpoint'),
		listActivePeeringConnections: op('streams.listActivePeeringConnections'),
		listFailoverConnections: op('streams.listFailoverConnections'),
		listPrivateLinkConnections: op('streams.listPrivateLinkConnections'),
		listStreamConnections: op('streams.listStreamConnections'),
		listStreamWorkspaces: op('streams.listStreamWorkspaces'),
		listVpcPeeringConnections: op('streams.listVpcPeeringConnections'),
		listWorkspacePrivateEndpoints: op('streams.listWorkspacePrivateEndpoints'),
		rejectVpcPeeringConnection: op('streams.rejectVpcPeeringConnection'),
		startStreamProcessor: op('streams.startStreamProcessor'),
		startStreamProcessorWith: op('streams.startStreamProcessorWith'),
		stopStreamProcessor: op('streams.stopStreamProcessor'),
		updatePrivateLinkConnection: op('streams.updatePrivateLinkConnection'),
		updateStreamConnection: op('streams.updateStreamConnection'),
		updateStreamFailoverConnection: op(
			'streams.updateStreamFailoverConnection',
		),
		updateStreamProcessor: op('streams.updateStreamProcessor'),
		updateStreamWorkspace: op('streams.updateStreamWorkspace'),
		withStreamSampleConnections: op('streams.withStreamSampleConnections'),
	},
	teams: {
		addGroupTeams: op('teams.addGroupTeams'),
		createOrgTeam: op('teams.createOrgTeam'),
		deleteOrgTeam: op('teams.deleteOrgTeam'),
		getGroupTeam: op('teams.getGroupTeam'),
		getOrgTeam: op('teams.getOrgTeam'),
		getTeamByName: op('teams.getTeamByName'),
		listGroupTeams: op('teams.listGroupTeams'),
		listOrgTeams: op('teams.listOrgTeams'),
		removeGroupTeam: op('teams.removeGroupTeam'),
		renameOrgTeam: op('teams.renameOrgTeam'),
		updateGroupTeam: op('teams.updateGroupTeam'),
	},
	thirdPartyIntegrations: {
		createGroupIntegration: op('thirdPartyIntegrations.createGroupIntegration'),
		deleteGroupIntegration: op('thirdPartyIntegrations.deleteGroupIntegration'),
		getGroupIntegration: op('thirdPartyIntegrations.getGroupIntegration'),
		listGroupIntegrations: op('thirdPartyIntegrations.listGroupIntegrations'),
		updateGroupIntegration: op('thirdPartyIntegrations.updateGroupIntegration'),
	},
	x509Authentication: {
		createDatabaseUserCert: op('x509Authentication.createDatabaseUserCert'),
		disableSecurityCustomerX509: op(
			'x509Authentication.disableSecurityCustomerX509',
		),
		listDatabaseUserCerts: op('x509Authentication.listDatabaseUserCerts'),
	},
} as const;

export const mongodbatlasEndpointSchemas = {
	'accessTracking.getAccessHistoryCluster': mongodbatlasSchemaEntry(
		'accessTracking.getAccessHistoryCluster',
	),
	'accessTracking.getAccessHistoryProcess': mongodbatlasSchemaEntry(
		'accessTracking.getAccessHistoryProcess',
	),
	'activityFeed.getGroupActivityFeed': mongodbatlasSchemaEntry(
		'activityFeed.getGroupActivityFeed',
	),
	'activityFeed.getOrgActivityFeed': mongodbatlasSchemaEntry(
		'activityFeed.getOrgActivityFeed',
	),
	'aiModelApiKeys.createGroupModelKey': mongodbatlasSchemaEntry(
		'aiModelApiKeys.createGroupModelKey',
	),
	'aiModelApiKeys.deleteGroupModelKey': mongodbatlasSchemaEntry(
		'aiModelApiKeys.deleteGroupModelKey',
	),
	'aiModelApiKeys.getGroupModelKey': mongodbatlasSchemaEntry(
		'aiModelApiKeys.getGroupModelKey',
	),
	'aiModelApiKeys.getOrgModelKey': mongodbatlasSchemaEntry(
		'aiModelApiKeys.getOrgModelKey',
	),
	'aiModelApiKeys.listGroupModelKeys': mongodbatlasSchemaEntry(
		'aiModelApiKeys.listGroupModelKeys',
	),
	'aiModelApiKeys.listOrgModelKeys': mongodbatlasSchemaEntry(
		'aiModelApiKeys.listOrgModelKeys',
	),
	'aiModelApiKeys.updateGroupModelKey': mongodbatlasSchemaEntry(
		'aiModelApiKeys.updateGroupModelKey',
	),
	'aiModelRateLimits.getGroupModelLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.getGroupModelLimits',
	),
	'aiModelRateLimits.getGroupRateLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.getGroupRateLimits',
	),
	'aiModelRateLimits.getOrgModelLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.getOrgModelLimits',
	),
	'aiModelRateLimits.getOrgRateLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.getOrgRateLimits',
	),
	'aiModelRateLimits.resetGroupModelLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.resetGroupModelLimits',
	),
	'aiModelRateLimits.resetGroupRateLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.resetGroupRateLimits',
	),
	'aiModelRateLimits.updateGroupRateLimits': mongodbatlasSchemaEntry(
		'aiModelRateLimits.updateGroupRateLimits',
	),
	'alertConfigurations.createAlertConfig': mongodbatlasSchemaEntry(
		'alertConfigurations.createAlertConfig',
	),
	'alertConfigurations.deleteAlertConfig': mongodbatlasSchemaEntry(
		'alertConfigurations.deleteAlertConfig',
	),
	'alertConfigurations.getAlertConfig': mongodbatlasSchemaEntry(
		'alertConfigurations.getAlertConfig',
	),
	'alertConfigurations.getAlertConfigs': mongodbatlasSchemaEntry(
		'alertConfigurations.getAlertConfigs',
	),
	'alertConfigurations.listAlertConfigs': mongodbatlasSchemaEntry(
		'alertConfigurations.listAlertConfigs',
	),
	'alertConfigurations.listMatcherFieldNames': mongodbatlasSchemaEntry(
		'alertConfigurations.listMatcherFieldNames',
	),
	'alertConfigurations.toggleAlertConfig': mongodbatlasSchemaEntry(
		'alertConfigurations.toggleAlertConfig',
	),
	'alertConfigurations.updateAlertConfig': mongodbatlasSchemaEntry(
		'alertConfigurations.updateAlertConfig',
	),
	'alerts.acknowledgeAlert': mongodbatlasSchemaEntry('alerts.acknowledgeAlert'),
	'alerts.getAlert': mongodbatlasSchemaEntry('alerts.getAlert'),
	'alerts.getAlertConfigAlerts': mongodbatlasSchemaEntry(
		'alerts.getAlertConfigAlerts',
	),
	'alerts.listAlerts': mongodbatlasSchemaEntry('alerts.listAlerts'),
	'atlasSearch.createClusterSearchDeployment': mongodbatlasSchemaEntry(
		'atlasSearch.createClusterSearchDeployment',
	),
	'atlasSearch.createClusterSearchIndex': mongodbatlasSchemaEntry(
		'atlasSearch.createClusterSearchIndex',
	),
	'atlasSearch.deleteClusterSearchDeployment': mongodbatlasSchemaEntry(
		'atlasSearch.deleteClusterSearchDeployment',
	),
	'atlasSearch.deleteClusterSearchIndex': mongodbatlasSchemaEntry(
		'atlasSearch.deleteClusterSearchIndex',
	),
	'atlasSearch.deleteIndexByName': mongodbatlasSchemaEntry(
		'atlasSearch.deleteIndexByName',
	),
	'atlasSearch.getClusterSearchDeployment': mongodbatlasSchemaEntry(
		'atlasSearch.getClusterSearchDeployment',
	),
	'atlasSearch.getClusterSearchIndex': mongodbatlasSchemaEntry(
		'atlasSearch.getClusterSearchIndex',
	),
	'atlasSearch.getIndexByName': mongodbatlasSchemaEntry(
		'atlasSearch.getIndexByName',
	),
	'atlasSearch.listClusterSearchIndexes': mongodbatlasSchemaEntry(
		'atlasSearch.listClusterSearchIndexes',
	),
	'atlasSearch.listSearchIndex': mongodbatlasSchemaEntry(
		'atlasSearch.listSearchIndex',
	),
	'atlasSearch.updateClusterSearchDeployment': mongodbatlasSchemaEntry(
		'atlasSearch.updateClusterSearchDeployment',
	),
	'atlasSearch.updateClusterSearchIndex': mongodbatlasSchemaEntry(
		'atlasSearch.updateClusterSearchIndex',
	),
	'atlasSearch.updateIndexByName': mongodbatlasSchemaEntry(
		'atlasSearch.updateIndexByName',
	),
	'auditing.getGroupAuditLog': mongodbatlasSchemaEntry(
		'auditing.getGroupAuditLog',
	),
	'auditing.updateAuditLog': mongodbatlasSchemaEntry('auditing.updateAuditLog'),
	'awsClustersDns.getAwsCustomDns': mongodbatlasSchemaEntry(
		'awsClustersDns.getAwsCustomDns',
	),
	'awsClustersDns.toggleAwsCustomDns': mongodbatlasSchemaEntry(
		'awsClustersDns.toggleAwsCustomDns',
	),
	'cloudBackups.cancelBackupRestoreJob': mongodbatlasSchemaEntry(
		'cloudBackups.cancelBackupRestoreJob',
	),
	'cloudBackups.createBackupExport': mongodbatlasSchemaEntry(
		'cloudBackups.createBackupExport',
	),
	'cloudBackups.createBackupPrivateEndpoint': mongodbatlasSchemaEntry(
		'cloudBackups.createBackupPrivateEndpoint',
	),
	'cloudBackups.createBackupRestoreJob': mongodbatlasSchemaEntry(
		'cloudBackups.createBackupRestoreJob',
	),
	'cloudBackups.createCollectionRestoreJob': mongodbatlasSchemaEntry(
		'cloudBackups.createCollectionRestoreJob',
	),
	'cloudBackups.createExportBucket': mongodbatlasSchemaEntry(
		'cloudBackups.createExportBucket',
	),
	'cloudBackups.deleteBackupPrivateEndpoint': mongodbatlasSchemaEntry(
		'cloudBackups.deleteBackupPrivateEndpoint',
	),
	'cloudBackups.deleteBackupShardedCluster': mongodbatlasSchemaEntry(
		'cloudBackups.deleteBackupShardedCluster',
	),
	'cloudBackups.deleteClusterBackupSchedule': mongodbatlasSchemaEntry(
		'cloudBackups.deleteClusterBackupSchedule',
	),
	'cloudBackups.deleteClusterBackupSnapshot': mongodbatlasSchemaEntry(
		'cloudBackups.deleteClusterBackupSnapshot',
	),
	'cloudBackups.deleteExportBucket': mongodbatlasSchemaEntry(
		'cloudBackups.deleteExportBucket',
	),
	'cloudBackups.disableCompliancePolicy': mongodbatlasSchemaEntry(
		'cloudBackups.disableCompliancePolicy',
	),
	'cloudBackups.getBackupExport': mongodbatlasSchemaEntry(
		'cloudBackups.getBackupExport',
	),
	'cloudBackups.getBackupPrivateEndpoint': mongodbatlasSchemaEntry(
		'cloudBackups.getBackupPrivateEndpoint',
	),
	'cloudBackups.getBackupRestoreJob': mongodbatlasSchemaEntry(
		'cloudBackups.getBackupRestoreJob',
	),
	'cloudBackups.getBackupSchedule': mongodbatlasSchemaEntry(
		'cloudBackups.getBackupSchedule',
	),
	'cloudBackups.getBackupShardedCluster': mongodbatlasSchemaEntry(
		'cloudBackups.getBackupShardedCluster',
	),
	'cloudBackups.getBackupSnapshotDatabase': mongodbatlasSchemaEntry(
		'cloudBackups.getBackupSnapshotDatabase',
	),
	'cloudBackups.getClusterBackupSnapshot': mongodbatlasSchemaEntry(
		'cloudBackups.getClusterBackupSnapshot',
	),
	'cloudBackups.getCollectionRestoreJob': mongodbatlasSchemaEntry(
		'cloudBackups.getCollectionRestoreJob',
	),
	'cloudBackups.getCompliancePolicy': mongodbatlasSchemaEntry(
		'cloudBackups.getCompliancePolicy',
	),
	'cloudBackups.getExportBucket': mongodbatlasSchemaEntry(
		'cloudBackups.getExportBucket',
	),
	'cloudBackups.getRestoreJobCollection': mongodbatlasSchemaEntry(
		'cloudBackups.getRestoreJobCollection',
	),
	'cloudBackups.getSnapshotDatabaseCollection': mongodbatlasSchemaEntry(
		'cloudBackups.getSnapshotDatabaseCollection',
	),
	'cloudBackups.listBackupExports': mongodbatlasSchemaEntry(
		'cloudBackups.listBackupExports',
	),
	'cloudBackups.listBackupPrivateEndpoints': mongodbatlasSchemaEntry(
		'cloudBackups.listBackupPrivateEndpoints',
	),
	'cloudBackups.listBackupRestoreJobs': mongodbatlasSchemaEntry(
		'cloudBackups.listBackupRestoreJobs',
	),
	'cloudBackups.listBackupShardedClusters': mongodbatlasSchemaEntry(
		'cloudBackups.listBackupShardedClusters',
	),
	'cloudBackups.listBackupSnapshotDatabases': mongodbatlasSchemaEntry(
		'cloudBackups.listBackupSnapshotDatabases',
	),
	'cloudBackups.listBackupSnapshots': mongodbatlasSchemaEntry(
		'cloudBackups.listBackupSnapshots',
	),
	'cloudBackups.listCollectionRestoreJobs': mongodbatlasSchemaEntry(
		'cloudBackups.listCollectionRestoreJobs',
	),
	'cloudBackups.listExportBuckets': mongodbatlasSchemaEntry(
		'cloudBackups.listExportBuckets',
	),
	'cloudBackups.listRestoreJobCollections': mongodbatlasSchemaEntry(
		'cloudBackups.listRestoreJobCollections',
	),
	'cloudBackups.listSnapshotDatabaseCollections': mongodbatlasSchemaEntry(
		'cloudBackups.listSnapshotDatabaseCollections',
	),
	'cloudBackups.takeSnapshots': mongodbatlasSchemaEntry(
		'cloudBackups.takeSnapshots',
	),
	'cloudBackups.updateBackupExportBucket': mongodbatlasSchemaEntry(
		'cloudBackups.updateBackupExportBucket',
	),
	'cloudBackups.updateBackupSchedule': mongodbatlasSchemaEntry(
		'cloudBackups.updateBackupSchedule',
	),
	'cloudBackups.updateBackupSnapshot': mongodbatlasSchemaEntry(
		'cloudBackups.updateBackupSnapshot',
	),
	'cloudBackups.updateCompliancePolicy': mongodbatlasSchemaEntry(
		'cloudBackups.updateCompliancePolicy',
	),
	'cloudMigrationService.createGroupLiveMigration': mongodbatlasSchemaEntry(
		'cloudMigrationService.createGroupLiveMigration',
	),
	'cloudMigrationService.createLinkToken': mongodbatlasSchemaEntry(
		'cloudMigrationService.createLinkToken',
	),
	'cloudMigrationService.cutoverMigration': mongodbatlasSchemaEntry(
		'cloudMigrationService.cutoverMigration',
	),
	'cloudMigrationService.deleteLinkTokens': mongodbatlasSchemaEntry(
		'cloudMigrationService.deleteLinkTokens',
	),
	'cloudMigrationService.getGroupLiveMigration': mongodbatlasSchemaEntry(
		'cloudMigrationService.getGroupLiveMigration',
	),
	'cloudMigrationService.getMigrationValidateStatus': mongodbatlasSchemaEntry(
		'cloudMigrationService.getMigrationValidateStatus',
	),
	'cloudMigrationService.listAvailableProjects': mongodbatlasSchemaEntry(
		'cloudMigrationService.listAvailableProjects',
	),
	'cloudMigrationService.validateLiveMigrations': mongodbatlasSchemaEntry(
		'cloudMigrationService.validateLiveMigrations',
	),
	'cloudProviderAccess.authorizeProviderAccessRole': mongodbatlasSchemaEntry(
		'cloudProviderAccess.authorizeProviderAccessRole',
	),
	'cloudProviderAccess.createCloudProviderAccess': mongodbatlasSchemaEntry(
		'cloudProviderAccess.createCloudProviderAccess',
	),
	'cloudProviderAccess.deauthorizeProviderAccessRole': mongodbatlasSchemaEntry(
		'cloudProviderAccess.deauthorizeProviderAccessRole',
	),
	'cloudProviderAccess.getCloudProviderAccess': mongodbatlasSchemaEntry(
		'cloudProviderAccess.getCloudProviderAccess',
	),
	'cloudProviderAccess.listCloudProviderAccess': mongodbatlasSchemaEntry(
		'cloudProviderAccess.listCloudProviderAccess',
	),
	'clusterOutageSimulation.endOutageSimulation': mongodbatlasSchemaEntry(
		'clusterOutageSimulation.endOutageSimulation',
	),
	'clusterOutageSimulation.getOutageSimulation': mongodbatlasSchemaEntry(
		'clusterOutageSimulation.getOutageSimulation',
	),
	'clusterOutageSimulation.startOutageSimulation': mongodbatlasSchemaEntry(
		'clusterOutageSimulation.startOutageSimulation',
	),
	'clusters.createCluster': mongodbatlasSchemaEntry('clusters.createCluster'),
	'clusters.deleteCluster': mongodbatlasSchemaEntry('clusters.deleteCluster'),
	'clusters.getCluster': mongodbatlasSchemaEntry('clusters.getCluster'),
	'clusters.getClusterAdaptiveSettings': mongodbatlasSchemaEntry(
		'clusters.getClusterAdaptiveSettings',
	),
	'clusters.getClusterStatus': mongodbatlasSchemaEntry(
		'clusters.getClusterStatus',
	),
	'clusters.getProcessArgs': mongodbatlasSchemaEntry('clusters.getProcessArgs'),
	'clusters.getSampleDatasetLoad': mongodbatlasSchemaEntry(
		'clusters.getSampleDatasetLoad',
	),
	'clusters.grantMongoEmployeeAccess': mongodbatlasSchemaEntry(
		'clusters.grantMongoEmployeeAccess',
	),
	'clusters.listClusterDetails': mongodbatlasSchemaEntry(
		'clusters.listClusterDetails',
	),
	'clusters.listClusterProviderRegions': mongodbatlasSchemaEntry(
		'clusters.listClusterProviderRegions',
	),
	'clusters.listClusters': mongodbatlasSchemaEntry('clusters.listClusters'),
	'clusters.pinFeatureCompatibilityVersion': mongodbatlasSchemaEntry(
		'clusters.pinFeatureCompatibilityVersion',
	),
	'clusters.requestSampleDatasetLoad': mongodbatlasSchemaEntry(
		'clusters.requestSampleDatasetLoad',
	),
	'clusters.restartPrimaries': mongodbatlasSchemaEntry(
		'clusters.restartPrimaries',
	),
	'clusters.revokeMongoEmployeeAccess': mongodbatlasSchemaEntry(
		'clusters.revokeMongoEmployeeAccess',
	),
	'clusters.unpinFeatureCompatibilityVersion': mongodbatlasSchemaEntry(
		'clusters.unpinFeatureCompatibilityVersion',
	),
	'clusters.updateCluster': mongodbatlasSchemaEntry('clusters.updateCluster'),
	'clusters.updateClusterAdaptiveSettings': mongodbatlasSchemaEntry(
		'clusters.updateClusterAdaptiveSettings',
	),
	'clusters.updateProcessArgs': mongodbatlasSchemaEntry(
		'clusters.updateProcessArgs',
	),
	'clusters.upgradeTenantUpgrade': mongodbatlasSchemaEntry(
		'clusters.upgradeTenantUpgrade',
	),
	'clusters.validateGroupClusterConfigurations': mongodbatlasSchemaEntry(
		'clusters.validateGroupClusterConfigurations',
	),
	'collectionLevelMetrics.getClusterNamespaces': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.getClusterNamespaces',
	),
	'collectionLevelMetrics.getProcessNamespaces': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.getProcessNamespaces',
	),
	'collectionLevelMetrics.listCollStatMeasurements': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.listCollStatMeasurements',
	),
	'collectionLevelMetrics.listCollStatMetrics': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.listCollStatMetrics',
	),
	'collectionLevelMetrics.listPinnedNamespaces': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.listPinnedNamespaces',
	),
	'collectionLevelMetrics.listProcessMeasurements': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.listProcessMeasurements',
	),
	'collectionLevelMetrics.pinNamespaces': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.pinNamespaces',
	),
	'collectionLevelMetrics.unpinNamespaces': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.unpinNamespaces',
	),
	'collectionLevelMetrics.updatePinnedNamespaces': mongodbatlasSchemaEntry(
		'collectionLevelMetrics.updatePinnedNamespaces',
	),
	'customDatabaseRoles.createCustomDbRole': mongodbatlasSchemaEntry(
		'customDatabaseRoles.createCustomDbRole',
	),
	'customDatabaseRoles.deleteCustomDbRole': mongodbatlasSchemaEntry(
		'customDatabaseRoles.deleteCustomDbRole',
	),
	'customDatabaseRoles.getCustomDbRole': mongodbatlasSchemaEntry(
		'customDatabaseRoles.getCustomDbRole',
	),
	'customDatabaseRoles.listCustomDbRoles': mongodbatlasSchemaEntry(
		'customDatabaseRoles.listCustomDbRoles',
	),
	'customDatabaseRoles.updateCustomDbRole': mongodbatlasSchemaEntry(
		'customDatabaseRoles.updateCustomDbRole',
	),
	'dataFederation.createDataFederation': mongodbatlasSchemaEntry(
		'dataFederation.createDataFederation',
	),
	'dataFederation.createPrivateEndpointId': mongodbatlasSchemaEntry(
		'dataFederation.createPrivateEndpointId',
	),
	'dataFederation.deleteDataFederation': mongodbatlasSchemaEntry(
		'dataFederation.deleteDataFederation',
	),
	'dataFederation.deleteDataFederationLimit': mongodbatlasSchemaEntry(
		'dataFederation.deleteDataFederationLimit',
	),
	'dataFederation.deletePrivateEndpointId': mongodbatlasSchemaEntry(
		'dataFederation.deletePrivateEndpointId',
	),
	'dataFederation.downloadFederationQueryLogs': mongodbatlasSchemaEntry(
		'dataFederation.downloadFederationQueryLogs',
	),
	'dataFederation.getDataFederation': mongodbatlasSchemaEntry(
		'dataFederation.getDataFederation',
	),
	'dataFederation.getDataFederationLimit': mongodbatlasSchemaEntry(
		'dataFederation.getDataFederationLimit',
	),
	'dataFederation.getPrivateEndpointId': mongodbatlasSchemaEntry(
		'dataFederation.getPrivateEndpointId',
	),
	'dataFederation.listDataFederation': mongodbatlasSchemaEntry(
		'dataFederation.listDataFederation',
	),
	'dataFederation.listDataFederationLimits': mongodbatlasSchemaEntry(
		'dataFederation.listDataFederationLimits',
	),
	'dataFederation.listPrivateEndpointIds': mongodbatlasSchemaEntry(
		'dataFederation.listPrivateEndpointIds',
	),
	'dataFederation.setDataFederationLimit': mongodbatlasSchemaEntry(
		'dataFederation.setDataFederationLimit',
	),
	'dataFederation.updateDataFederation': mongodbatlasSchemaEntry(
		'dataFederation.updateDataFederation',
	),
	'databaseUsers.createDatabaseUser': mongodbatlasSchemaEntry(
		'databaseUsers.createDatabaseUser',
	),
	'databaseUsers.deleteDatabaseUser': mongodbatlasSchemaEntry(
		'databaseUsers.deleteDatabaseUser',
	),
	'databaseUsers.getDatabaseUser': mongodbatlasSchemaEntry(
		'databaseUsers.getDatabaseUser',
	),
	'databaseUsers.listDatabaseUsers': mongodbatlasSchemaEntry(
		'databaseUsers.listDatabaseUsers',
	),
	'databaseUsers.updateDatabaseUser': mongodbatlasSchemaEntry(
		'databaseUsers.updateDatabaseUser',
	),
	'encryptionAtRestUsingCustomerKeyManagement.createRestPrivateEndpoint':
		mongodbatlasSchemaEntry(
			'encryptionAtRestUsingCustomerKeyManagement.createRestPrivateEndpoint',
		),
	'encryptionAtRestUsingCustomerKeyManagement.getEncryptionAtRest':
		mongodbatlasSchemaEntry(
			'encryptionAtRestUsingCustomerKeyManagement.getEncryptionAtRest',
		),
	'encryptionAtRestUsingCustomerKeyManagement.getRestPrivateEndpoint':
		mongodbatlasSchemaEntry(
			'encryptionAtRestUsingCustomerKeyManagement.getRestPrivateEndpoint',
		),
	'encryptionAtRestUsingCustomerKeyManagement.listRestPrivateEndpoints':
		mongodbatlasSchemaEntry(
			'encryptionAtRestUsingCustomerKeyManagement.listRestPrivateEndpoints',
		),
	'encryptionAtRestUsingCustomerKeyManagement.requestPrivateEndpointDeletion':
		mongodbatlasSchemaEntry(
			'encryptionAtRestUsingCustomerKeyManagement.requestPrivateEndpointDeletion',
		),
	'encryptionAtRestUsingCustomerKeyManagement.updateEncryptionAtRest':
		mongodbatlasSchemaEntry(
			'encryptionAtRestUsingCustomerKeyManagement.updateEncryptionAtRest',
		),
	'events.getGroupEvent': mongodbatlasSchemaEntry('events.getGroupEvent'),
	'events.getOrgEvent': mongodbatlasSchemaEntry('events.getOrgEvent'),
	'events.listEventTypes': mongodbatlasSchemaEntry('events.listEventTypes'),
	'events.listGroupEvents': mongodbatlasSchemaEntry('events.listGroupEvents'),
	'events.listOrgEvents': mongodbatlasSchemaEntry('events.listOrgEvents'),
	'federatedAuthentication.createIdentityProvider': mongodbatlasSchemaEntry(
		'federatedAuthentication.createIdentityProvider',
	),
	'federatedAuthentication.createRoleMapping': mongodbatlasSchemaEntry(
		'federatedAuthentication.createRoleMapping',
	),
	'federatedAuthentication.deleteFederationSetting': mongodbatlasSchemaEntry(
		'federatedAuthentication.deleteFederationSetting',
	),
	'federatedAuthentication.deleteIdentityProvider': mongodbatlasSchemaEntry(
		'federatedAuthentication.deleteIdentityProvider',
	),
	'federatedAuthentication.deleteRoleMapping': mongodbatlasSchemaEntry(
		'federatedAuthentication.deleteRoleMapping',
	),
	'federatedAuthentication.getConnectedOrgConfig': mongodbatlasSchemaEntry(
		'federatedAuthentication.getConnectedOrgConfig',
	),
	'federatedAuthentication.getFederationSettings': mongodbatlasSchemaEntry(
		'federatedAuthentication.getFederationSettings',
	),
	'federatedAuthentication.getIdentityProvider': mongodbatlasSchemaEntry(
		'federatedAuthentication.getIdentityProvider',
	),
	'federatedAuthentication.getIdentityProviderMetadata':
		mongodbatlasSchemaEntry(
			'federatedAuthentication.getIdentityProviderMetadata',
		),
	'federatedAuthentication.getRoleMapping': mongodbatlasSchemaEntry(
		'federatedAuthentication.getRoleMapping',
	),
	'federatedAuthentication.listConnectedOrgConfigs': mongodbatlasSchemaEntry(
		'federatedAuthentication.listConnectedOrgConfigs',
	),
	'federatedAuthentication.listIdentityProviders': mongodbatlasSchemaEntry(
		'federatedAuthentication.listIdentityProviders',
	),
	'federatedAuthentication.listRoleMappings': mongodbatlasSchemaEntry(
		'federatedAuthentication.listRoleMappings',
	),
	'federatedAuthentication.removeConnectedOrgConfig': mongodbatlasSchemaEntry(
		'federatedAuthentication.removeConnectedOrgConfig',
	),
	'federatedAuthentication.revokeIdentityProviderJwks': mongodbatlasSchemaEntry(
		'federatedAuthentication.revokeIdentityProviderJwks',
	),
	'federatedAuthentication.updateConnectedOrgConfig': mongodbatlasSchemaEntry(
		'federatedAuthentication.updateConnectedOrgConfig',
	),
	'federatedAuthentication.updateIdentityProvider': mongodbatlasSchemaEntry(
		'federatedAuthentication.updateIdentityProvider',
	),
	'federatedAuthentication.updateRoleMapping': mongodbatlasSchemaEntry(
		'federatedAuthentication.updateRoleMapping',
	),
	'flexClusters.createFlexCluster': mongodbatlasSchemaEntry(
		'flexClusters.createFlexCluster',
	),
	'flexClusters.deleteFlexCluster': mongodbatlasSchemaEntry(
		'flexClusters.deleteFlexCluster',
	),
	'flexClusters.getFlexCluster': mongodbatlasSchemaEntry(
		'flexClusters.getFlexCluster',
	),
	'flexClusters.listFlexClusters': mongodbatlasSchemaEntry(
		'flexClusters.listFlexClusters',
	),
	'flexClusters.tenantUpgrade': mongodbatlasSchemaEntry(
		'flexClusters.tenantUpgrade',
	),
	'flexClusters.updateFlexCluster': mongodbatlasSchemaEntry(
		'flexClusters.updateFlexCluster',
	),
	'flexRestoreJobs.createFlexRestoreJob': mongodbatlasSchemaEntry(
		'flexRestoreJobs.createFlexRestoreJob',
	),
	'flexRestoreJobs.getFlexRestoreJob': mongodbatlasSchemaEntry(
		'flexRestoreJobs.getFlexRestoreJob',
	),
	'flexRestoreJobs.listFlexRestoreJobs': mongodbatlasSchemaEntry(
		'flexRestoreJobs.listFlexRestoreJobs',
	),
	'flexSnapshots.downloadFlexBackup': mongodbatlasSchemaEntry(
		'flexSnapshots.downloadFlexBackup',
	),
	'flexSnapshots.getFlexBackupSnapshot': mongodbatlasSchemaEntry(
		'flexSnapshots.getFlexBackupSnapshot',
	),
	'flexSnapshots.listFlexBackupSnapshots': mongodbatlasSchemaEntry(
		'flexSnapshots.listFlexBackupSnapshots',
	),
	'globalClusters.createCustomZoneMapping': mongodbatlasSchemaEntry(
		'globalClusters.createCustomZoneMapping',
	),
	'globalClusters.createManagedNamespace': mongodbatlasSchemaEntry(
		'globalClusters.createManagedNamespace',
	),
	'globalClusters.deleteCustomZoneMapping': mongodbatlasSchemaEntry(
		'globalClusters.deleteCustomZoneMapping',
	),
	'globalClusters.deleteManagedNamespaces': mongodbatlasSchemaEntry(
		'globalClusters.deleteManagedNamespaces',
	),
	'globalClusters.getClusterGlobalWrites': mongodbatlasSchemaEntry(
		'globalClusters.getClusterGlobalWrites',
	),
	'invoices.createCostExplorerProcess': mongodbatlasSchemaEntry(
		'invoices.createCostExplorerProcess',
	),
	'invoices.createOrgInvoiceReport': mongodbatlasSchemaEntry(
		'invoices.createOrgInvoiceReport',
	),
	'invoices.getCostExplorerUsage': mongodbatlasSchemaEntry(
		'invoices.getCostExplorerUsage',
	),
	'invoices.getInvoice': mongodbatlasSchemaEntry('invoices.getInvoice'),
	'invoices.getInvoiceCsv': mongodbatlasSchemaEntry('invoices.getInvoiceCsv'),
	'invoices.getOrgAssociatedInvoices': mongodbatlasSchemaEntry(
		'invoices.getOrgAssociatedInvoices',
	),
	'invoices.getOrgInvoiceReport': mongodbatlasSchemaEntry(
		'invoices.getOrgInvoiceReport',
	),
	'invoices.getSku': mongodbatlasSchemaEntry('invoices.getSku'),
	'invoices.listInvoicePending': mongodbatlasSchemaEntry(
		'invoices.listInvoicePending',
	),
	'invoices.listInvoices': mongodbatlasSchemaEntry('invoices.listInvoices'),
	'invoices.listOrgInvoiceReports': mongodbatlasSchemaEntry(
		'invoices.listOrgInvoiceReports',
	),
	'invoices.listSkuServices': mongodbatlasSchemaEntry(
		'invoices.listSkuServices',
	),
	'invoices.listSkus': mongodbatlasSchemaEntry('invoices.listSkus'),
	'invoices.searchInvoiceLineItems': mongodbatlasSchemaEntry(
		'invoices.searchInvoiceLineItems',
	),
	'ldapConfiguration.deleteLdapUserMapping': mongodbatlasSchemaEntry(
		'ldapConfiguration.deleteLdapUserMapping',
	),
	'ldapConfiguration.getUserSecurity': mongodbatlasSchemaEntry(
		'ldapConfiguration.getUserSecurity',
	),
	'ldapConfiguration.getUserSecurityVerify': mongodbatlasSchemaEntry(
		'ldapConfiguration.getUserSecurityVerify',
	),
	'ldapConfiguration.updateUserSecurity': mongodbatlasSchemaEntry(
		'ldapConfiguration.updateUserSecurity',
	),
	'ldapConfiguration.verifyUserSecurityLdap': mongodbatlasSchemaEntry(
		'ldapConfiguration.verifyUserSecurityLdap',
	),
	'maintenanceWindows.deferMaintenanceWindow': mongodbatlasSchemaEntry(
		'maintenanceWindows.deferMaintenanceWindow',
	),
	'maintenanceWindows.getMaintenanceWindow': mongodbatlasSchemaEntry(
		'maintenanceWindows.getMaintenanceWindow',
	),
	'maintenanceWindows.resetMaintenanceWindow': mongodbatlasSchemaEntry(
		'maintenanceWindows.resetMaintenanceWindow',
	),
	'maintenanceWindows.toggleMaintenanceAutoDefer': mongodbatlasSchemaEntry(
		'maintenanceWindows.toggleMaintenanceAutoDefer',
	),
	'maintenanceWindows.updateMaintenanceWindow': mongodbatlasSchemaEntry(
		'maintenanceWindows.updateMaintenanceWindow',
	),
	'metricIntegrations.createGroupMetricIntegration': mongodbatlasSchemaEntry(
		'metricIntegrations.createGroupMetricIntegration',
	),
	'metricIntegrations.deleteGroupMetricIntegration': mongodbatlasSchemaEntry(
		'metricIntegrations.deleteGroupMetricIntegration',
	),
	'metricIntegrations.getGroupMetricIntegration': mongodbatlasSchemaEntry(
		'metricIntegrations.getGroupMetricIntegration',
	),
	'metricIntegrations.listGroupMetricIntegrations': mongodbatlasSchemaEntry(
		'metricIntegrations.listGroupMetricIntegrations',
	),
	'metricIntegrations.updateGroupMetricIntegration': mongodbatlasSchemaEntry(
		'metricIntegrations.updateGroupMetricIntegration',
	),
	'mongoDbCloudUsers.addGroupUserRole': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.addGroupUserRole',
	),
	'mongoDbCloudUsers.addGroupUsers': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.addGroupUsers',
	),
	'mongoDbCloudUsers.addOrgRole': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.addOrgRole',
	),
	'mongoDbCloudUsers.addOrgTeamUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.addOrgTeamUser',
	),
	'mongoDbCloudUsers.createOrgUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.createOrgUser',
	),
	'mongoDbCloudUsers.getGroupUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.getGroupUser',
	),
	'mongoDbCloudUsers.getOrgUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.getOrgUser',
	),
	'mongoDbCloudUsers.listGroupUsers': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.listGroupUsers',
	),
	'mongoDbCloudUsers.listOrgUsers': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.listOrgUsers',
	),
	'mongoDbCloudUsers.listTeamUsers': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.listTeamUsers',
	),
	'mongoDbCloudUsers.removeGroupUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.removeGroupUser',
	),
	'mongoDbCloudUsers.removeGroupUserRole': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.removeGroupUserRole',
	),
	'mongoDbCloudUsers.removeOrgRole': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.removeOrgRole',
	),
	'mongoDbCloudUsers.removeOrgTeamUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.removeOrgTeamUser',
	),
	'mongoDbCloudUsers.removeOrgUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.removeOrgUser',
	),
	'mongoDbCloudUsers.updateOrgUser': mongodbatlasSchemaEntry(
		'mongoDbCloudUsers.updateOrgUser',
	),
	'monitoringAndLogs.downloadClusterLog': mongodbatlasSchemaEntry(
		'monitoringAndLogs.downloadClusterLog',
	),
	'monitoringAndLogs.getDatabase': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getDatabase',
	),
	'monitoringAndLogs.getDatabaseMeasurements': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getDatabaseMeasurements',
	),
	'monitoringAndLogs.getGroupProcess': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getGroupProcess',
	),
	'monitoringAndLogs.getIndexMeasurements': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getIndexMeasurements',
	),
	'monitoringAndLogs.getProcessDisk': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getProcessDisk',
	),
	'monitoringAndLogs.getProcessDiskMeasurements': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getProcessDiskMeasurements',
	),
	'monitoringAndLogs.getProcessMeasurements': mongodbatlasSchemaEntry(
		'monitoringAndLogs.getProcessMeasurements',
	),
	'monitoringAndLogs.listDatabases': mongodbatlasSchemaEntry(
		'monitoringAndLogs.listDatabases',
	),
	'monitoringAndLogs.listGroupProcesses': mongodbatlasSchemaEntry(
		'monitoringAndLogs.listGroupProcesses',
	),
	'monitoringAndLogs.listHostFtsMetrics': mongodbatlasSchemaEntry(
		'monitoringAndLogs.listHostFtsMetrics',
	),
	'monitoringAndLogs.listIndexMeasurements': mongodbatlasSchemaEntry(
		'monitoringAndLogs.listIndexMeasurements',
	),
	'monitoringAndLogs.listMeasurements': mongodbatlasSchemaEntry(
		'monitoringAndLogs.listMeasurements',
	),
	'monitoringAndLogs.listProcessDisks': mongodbatlasSchemaEntry(
		'monitoringAndLogs.listProcessDisks',
	),
	'networkPeering.createGroupContainer': mongodbatlasSchemaEntry(
		'networkPeering.createGroupContainer',
	),
	'networkPeering.createGroupPeer': mongodbatlasSchemaEntry(
		'networkPeering.createGroupPeer',
	),
	'networkPeering.deleteGroupContainer': mongodbatlasSchemaEntry(
		'networkPeering.deleteGroupContainer',
	),
	'networkPeering.deleteGroupPeer': mongodbatlasSchemaEntry(
		'networkPeering.deleteGroupPeer',
	),
	'networkPeering.getGroupContainer': mongodbatlasSchemaEntry(
		'networkPeering.getGroupContainer',
	),
	'networkPeering.getGroupPeer': mongodbatlasSchemaEntry(
		'networkPeering.getGroupPeer',
	),
	'networkPeering.listGroupContainerAll': mongodbatlasSchemaEntry(
		'networkPeering.listGroupContainerAll',
	),
	'networkPeering.listGroupContainers': mongodbatlasSchemaEntry(
		'networkPeering.listGroupContainers',
	),
	'networkPeering.listGroupPeers': mongodbatlasSchemaEntry(
		'networkPeering.listGroupPeers',
	),
	'networkPeering.updateGroupContainer': mongodbatlasSchemaEntry(
		'networkPeering.updateGroupContainer',
	),
	'networkPeering.updateGroupPeer': mongodbatlasSchemaEntry(
		'networkPeering.updateGroupPeer',
	),
	'onlineArchive.createOnlineArchive': mongodbatlasSchemaEntry(
		'onlineArchive.createOnlineArchive',
	),
	'onlineArchive.deleteOnlineArchive': mongodbatlasSchemaEntry(
		'onlineArchive.deleteOnlineArchive',
	),
	'onlineArchive.downloadQueryLogs': mongodbatlasSchemaEntry(
		'onlineArchive.downloadQueryLogs',
	),
	'onlineArchive.getOnlineArchive': mongodbatlasSchemaEntry(
		'onlineArchive.getOnlineArchive',
	),
	'onlineArchive.listOnlineArchives': mongodbatlasSchemaEntry(
		'onlineArchive.listOnlineArchives',
	),
	'onlineArchive.updateOnlineArchive': mongodbatlasSchemaEntry(
		'onlineArchive.updateOnlineArchive',
	),
	'organizations.createOrg': mongodbatlasSchemaEntry('organizations.createOrg'),
	'organizations.deleteOrg': mongodbatlasSchemaEntry('organizations.deleteOrg'),
	'organizations.getOrg': mongodbatlasSchemaEntry('organizations.getOrg'),
	'organizations.getOrgDelegationSettings': mongodbatlasSchemaEntry(
		'organizations.getOrgDelegationSettings',
	),
	'organizations.getOrgGroups': mongodbatlasSchemaEntry(
		'organizations.getOrgGroups',
	),
	'organizations.getOrgMaintenanceSettings': mongodbatlasSchemaEntry(
		'organizations.getOrgMaintenanceSettings',
	),
	'organizations.getOrgSettings': mongodbatlasSchemaEntry(
		'organizations.getOrgSettings',
	),
	'organizations.listOrgs': mongodbatlasSchemaEntry('organizations.listOrgs'),
	'organizations.resetOrgMaintenanceSettings': mongodbatlasSchemaEntry(
		'organizations.resetOrgMaintenanceSettings',
	),
	'organizations.updateOrg': mongodbatlasSchemaEntry('organizations.updateOrg'),
	'organizations.updateOrgDelegationSettings': mongodbatlasSchemaEntry(
		'organizations.updateOrgDelegationSettings',
	),
	'organizations.updateOrgMaintenanceSettings': mongodbatlasSchemaEntry(
		'organizations.updateOrgMaintenanceSettings',
	),
	'organizations.updateOrgSettings': mongodbatlasSchemaEntry(
		'organizations.updateOrgSettings',
	),
	'overloadProtectionSimulation.createClusterOverloadSimulation':
		mongodbatlasSchemaEntry(
			'overloadProtectionSimulation.createClusterOverloadSimulation',
		),
	'overloadProtectionSimulation.deleteClusterOverloadSimulation':
		mongodbatlasSchemaEntry(
			'overloadProtectionSimulation.deleteClusterOverloadSimulation',
		),
	'overloadProtectionSimulation.getClusterOverloadSimulation':
		mongodbatlasSchemaEntry(
			'overloadProtectionSimulation.getClusterOverloadSimulation',
		),
	'overloadProtectionSimulation.listClusterOverloadSimulations':
		mongodbatlasSchemaEntry(
			'overloadProtectionSimulation.listClusterOverloadSimulations',
		),
	'performanceAdvisor.disableManagedSlowMs': mongodbatlasSchemaEntry(
		'performanceAdvisor.disableManagedSlowMs',
	),
	'performanceAdvisor.enableManagedSlowMs': mongodbatlasSchemaEntry(
		'performanceAdvisor.enableManagedSlowMs',
	),
	'performanceAdvisor.getManagedSlowMs': mongodbatlasSchemaEntry(
		'performanceAdvisor.getManagedSlowMs',
	),
	'performanceAdvisor.listClusterSuggestedIndexes': mongodbatlasSchemaEntry(
		'performanceAdvisor.listClusterSuggestedIndexes',
	),
	'performanceAdvisor.listDropIndexSuggestions': mongodbatlasSchemaEntry(
		'performanceAdvisor.listDropIndexSuggestions',
	),
	'performanceAdvisor.listPerformanceAdvisorNamespaces':
		mongodbatlasSchemaEntry(
			'performanceAdvisor.listPerformanceAdvisorNamespaces',
		),
	'performanceAdvisor.listSchemaAdvice': mongodbatlasSchemaEntry(
		'performanceAdvisor.listSchemaAdvice',
	),
	'performanceAdvisor.listSlowQueryLogs': mongodbatlasSchemaEntry(
		'performanceAdvisor.listSlowQueryLogs',
	),
	'performanceAdvisor.listSuggestedIndexes': mongodbatlasSchemaEntry(
		'performanceAdvisor.listSuggestedIndexes',
	),
	'privateEndpointServices.createPrivateEndpoint': mongodbatlasSchemaEntry(
		'privateEndpointServices.createPrivateEndpoint',
	),
	'privateEndpointServices.createPrivateEndpointService':
		mongodbatlasSchemaEntry(
			'privateEndpointServices.createPrivateEndpointService',
		),
	'privateEndpointServices.deletePrivateEndpoint': mongodbatlasSchemaEntry(
		'privateEndpointServices.deletePrivateEndpoint',
	),
	'privateEndpointServices.deletePrivateEndpointService':
		mongodbatlasSchemaEntry(
			'privateEndpointServices.deletePrivateEndpointService',
		),
	'privateEndpointServices.getPrivateEndpoint': mongodbatlasSchemaEntry(
		'privateEndpointServices.getPrivateEndpoint',
	),
	'privateEndpointServices.getPrivateEndpointService': mongodbatlasSchemaEntry(
		'privateEndpointServices.getPrivateEndpointService',
	),
	'privateEndpointServices.getRegionalEndpointMode': mongodbatlasSchemaEntry(
		'privateEndpointServices.getRegionalEndpointMode',
	),
	'privateEndpointServices.listPrivateEndpointService': mongodbatlasSchemaEntry(
		'privateEndpointServices.listPrivateEndpointService',
	),
	'privateEndpointServices.toggleRegionalEndpointMode': mongodbatlasSchemaEntry(
		'privateEndpointServices.toggleRegionalEndpointMode',
	),
	'privateEndpointServices.updatePrivateEndpointService':
		mongodbatlasSchemaEntry(
			'privateEndpointServices.updatePrivateEndpointService',
		),
	'programmaticApiKeys.addGroupApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.addGroupApiKey',
	),
	'programmaticApiKeys.createGroupApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.createGroupApiKey',
	),
	'programmaticApiKeys.createOrgAccessEntry': mongodbatlasSchemaEntry(
		'programmaticApiKeys.createOrgAccessEntry',
	),
	'programmaticApiKeys.createOrgApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.createOrgApiKey',
	),
	'programmaticApiKeys.deleteAccessEntry': mongodbatlasSchemaEntry(
		'programmaticApiKeys.deleteAccessEntry',
	),
	'programmaticApiKeys.deleteOrgApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.deleteOrgApiKey',
	),
	'programmaticApiKeys.getOrgAccessEntry': mongodbatlasSchemaEntry(
		'programmaticApiKeys.getOrgAccessEntry',
	),
	'programmaticApiKeys.getOrgApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.getOrgApiKey',
	),
	'programmaticApiKeys.listGroupApiKeys': mongodbatlasSchemaEntry(
		'programmaticApiKeys.listGroupApiKeys',
	),
	'programmaticApiKeys.listOrgAccessEntries': mongodbatlasSchemaEntry(
		'programmaticApiKeys.listOrgAccessEntries',
	),
	'programmaticApiKeys.listOrgApiKeys': mongodbatlasSchemaEntry(
		'programmaticApiKeys.listOrgApiKeys',
	),
	'programmaticApiKeys.removeGroupApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.removeGroupApiKey',
	),
	'programmaticApiKeys.updateApiKeyRoles': mongodbatlasSchemaEntry(
		'programmaticApiKeys.updateApiKeyRoles',
	),
	'programmaticApiKeys.updateOrgApiKey': mongodbatlasSchemaEntry(
		'programmaticApiKeys.updateOrgApiKey',
	),
	'projectIpAccessList.createAccessListEntry': mongodbatlasSchemaEntry(
		'projectIpAccessList.createAccessListEntry',
	),
	'projectIpAccessList.deleteAccessListEntry': mongodbatlasSchemaEntry(
		'projectIpAccessList.deleteAccessListEntry',
	),
	'projectIpAccessList.getAccessListEntry': mongodbatlasSchemaEntry(
		'projectIpAccessList.getAccessListEntry',
	),
	'projectIpAccessList.getAccessListStatus': mongodbatlasSchemaEntry(
		'projectIpAccessList.getAccessListStatus',
	),
	'projectIpAccessList.listAccessListEntries': mongodbatlasSchemaEntry(
		'projectIpAccessList.listAccessListEntries',
	),
	'projects.createGroup': mongodbatlasSchemaEntry('projects.createGroup'),
	'projects.deleteGroup': mongodbatlasSchemaEntry('projects.deleteGroup'),
	'projects.deleteGroupLimit': mongodbatlasSchemaEntry(
		'projects.deleteGroupLimit',
	),
	'projects.getGroup': mongodbatlasSchemaEntry('projects.getGroup'),
	'projects.getGroupByName': mongodbatlasSchemaEntry('projects.getGroupByName'),
	'projects.getGroupIpAddresses': mongodbatlasSchemaEntry(
		'projects.getGroupIpAddresses',
	),
	'projects.getGroupLimit': mongodbatlasSchemaEntry('projects.getGroupLimit'),
	'projects.getGroupSettings': mongodbatlasSchemaEntry(
		'projects.getGroupSettings',
	),
	'projects.getMongoDbVersions': mongodbatlasSchemaEntry(
		'projects.getMongoDbVersions',
	),
	'projects.listGroupLimits': mongodbatlasSchemaEntry(
		'projects.listGroupLimits',
	),
	'projects.listGroups': mongodbatlasSchemaEntry('projects.listGroups'),
	'projects.migrateGroup': mongodbatlasSchemaEntry('projects.migrateGroup'),
	'projects.setGroupLimit': mongodbatlasSchemaEntry('projects.setGroupLimit'),
	'projects.updateGroup': mongodbatlasSchemaEntry('projects.updateGroup'),
	'projects.updateGroupSettings': mongodbatlasSchemaEntry(
		'projects.updateGroupSettings',
	),
	'pushBasedLogExport.createGroupLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.createGroupLogIntegration',
	),
	'pushBasedLogExport.createOrgLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.createOrgLogIntegration',
	),
	'pushBasedLogExport.deleteGroupLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.deleteGroupLogIntegration',
	),
	'pushBasedLogExport.deleteOrgLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.deleteOrgLogIntegration',
	),
	'pushBasedLogExport.getGroupLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.getGroupLogIntegration',
	),
	'pushBasedLogExport.getOrgLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.getOrgLogIntegration',
	),
	'pushBasedLogExport.listGroupLogIntegrations': mongodbatlasSchemaEntry(
		'pushBasedLogExport.listGroupLogIntegrations',
	),
	'pushBasedLogExport.listOrgLogIntegrations': mongodbatlasSchemaEntry(
		'pushBasedLogExport.listOrgLogIntegrations',
	),
	'pushBasedLogExport.updateGroupLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.updateGroupLogIntegration',
	),
	'pushBasedLogExport.updateOrgLogIntegration': mongodbatlasSchemaEntry(
		'pushBasedLogExport.updateOrgLogIntegration',
	),
	'querySampling.createClusterQuerySampling': mongodbatlasSchemaEntry(
		'querySampling.createClusterQuerySampling',
	),
	'querySampling.deleteClusterQuerySampling': mongodbatlasSchemaEntry(
		'querySampling.deleteClusterQuerySampling',
	),
	'querySampling.getClusterQuerySampling': mongodbatlasSchemaEntry(
		'querySampling.getClusterQuerySampling',
	),
	'queryShapeInsights.getClusterQueryShape': mongodbatlasSchemaEntry(
		'queryShapeInsights.getClusterQueryShape',
	),
	'queryShapeInsights.getQueryShapeDetails': mongodbatlasSchemaEntry(
		'queryShapeInsights.getQueryShapeDetails',
	),
	'queryShapeInsights.listClusterQueryShapes': mongodbatlasSchemaEntry(
		'queryShapeInsights.listClusterQueryShapes',
	),
	'queryShapeInsights.listQueryShapeSummaries': mongodbatlasSchemaEntry(
		'queryShapeInsights.listQueryShapeSummaries',
	),
	'queryShapeInsights.updateClusterQueryShape': mongodbatlasSchemaEntry(
		'queryShapeInsights.updateClusterQueryShape',
	),
	'rateLimiting.getRateLimit': mongodbatlasSchemaEntry(
		'rateLimiting.getRateLimit',
	),
	'rateLimiting.listRateLimits': mongodbatlasSchemaEntry(
		'rateLimiting.listRateLimits',
	),
	'remoteMcpConfigurations.createGroupMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.createGroupMcpConfig',
	),
	'remoteMcpConfigurations.createGroupMcpSecret': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.createGroupMcpSecret',
	),
	'remoteMcpConfigurations.createOrgMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.createOrgMcpConfig',
	),
	'remoteMcpConfigurations.createOrgMcpSecret': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.createOrgMcpSecret',
	),
	'remoteMcpConfigurations.deleteGroupMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.deleteGroupMcpConfig',
	),
	'remoteMcpConfigurations.deleteGroupMcpSecret': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.deleteGroupMcpSecret',
	),
	'remoteMcpConfigurations.deleteOrgMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.deleteOrgMcpConfig',
	),
	'remoteMcpConfigurations.deleteOrgMcpSecret': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.deleteOrgMcpSecret',
	),
	'remoteMcpConfigurations.getGroupMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.getGroupMcpConfig',
	),
	'remoteMcpConfigurations.getGroupMcpSecret': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.getGroupMcpSecret',
	),
	'remoteMcpConfigurations.getOrgMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.getOrgMcpConfig',
	),
	'remoteMcpConfigurations.getOrgMcpSecret': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.getOrgMcpSecret',
	),
	'remoteMcpConfigurations.listGroupMcpConfigs': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.listGroupMcpConfigs',
	),
	'remoteMcpConfigurations.listGroupMcpSecrets': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.listGroupMcpSecrets',
	),
	'remoteMcpConfigurations.listOrgMcpConfigs': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.listOrgMcpConfigs',
	),
	'remoteMcpConfigurations.listOrgMcpSecrets': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.listOrgMcpSecrets',
	),
	'remoteMcpConfigurations.updateGroupMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.updateGroupMcpConfig',
	),
	'remoteMcpConfigurations.updateOrgMcpConfig': mongodbatlasSchemaEntry(
		'remoteMcpConfigurations.updateOrgMcpConfig',
	),
	'resourcePolicies.createOrgResourcePolicy': mongodbatlasSchemaEntry(
		'resourcePolicies.createOrgResourcePolicy',
	),
	'resourcePolicies.deleteOrgResourcePolicy': mongodbatlasSchemaEntry(
		'resourcePolicies.deleteOrgResourcePolicy',
	),
	'resourcePolicies.getNonCompliantResources': mongodbatlasSchemaEntry(
		'resourcePolicies.getNonCompliantResources',
	),
	'resourcePolicies.getOrgResourcePolicy': mongodbatlasSchemaEntry(
		'resourcePolicies.getOrgResourcePolicy',
	),
	'resourcePolicies.listOrgResourcePolicies': mongodbatlasSchemaEntry(
		'resourcePolicies.listOrgResourcePolicies',
	),
	'resourcePolicies.updateOrgResourcePolicy': mongodbatlasSchemaEntry(
		'resourcePolicies.updateOrgResourcePolicy',
	),
	'resourcePolicies.validateResourcePolicies': mongodbatlasSchemaEntry(
		'resourcePolicies.validateResourcePolicies',
	),
	'rollingIndex.createRollingIndex': mongodbatlasSchemaEntry(
		'rollingIndex.createRollingIndex',
	),
	'root.getSystemStatus': mongodbatlasSchemaEntry('root.getSystemStatus'),
	'root.listControlPlaneAddresses': mongodbatlasSchemaEntry(
		'root.listControlPlaneAddresses',
	),
	'serviceAccounts.createAccessList': mongodbatlasSchemaEntry(
		'serviceAccounts.createAccessList',
	),
	'serviceAccounts.createGroupSecret': mongodbatlasSchemaEntry(
		'serviceAccounts.createGroupSecret',
	),
	'serviceAccounts.createGroupServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.createGroupServiceAccount',
	),
	'serviceAccounts.createOrgAccessList': mongodbatlasSchemaEntry(
		'serviceAccounts.createOrgAccessList',
	),
	'serviceAccounts.createOrgSecret': mongodbatlasSchemaEntry(
		'serviceAccounts.createOrgSecret',
	),
	'serviceAccounts.createOrgServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.createOrgServiceAccount',
	),
	'serviceAccounts.deleteGroupAccessEntry': mongodbatlasSchemaEntry(
		'serviceAccounts.deleteGroupAccessEntry',
	),
	'serviceAccounts.deleteGroupSecret': mongodbatlasSchemaEntry(
		'serviceAccounts.deleteGroupSecret',
	),
	'serviceAccounts.deleteGroupServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.deleteGroupServiceAccount',
	),
	'serviceAccounts.deleteOrgAccessEntry': mongodbatlasSchemaEntry(
		'serviceAccounts.deleteOrgAccessEntry',
	),
	'serviceAccounts.deleteOrgSecret': mongodbatlasSchemaEntry(
		'serviceAccounts.deleteOrgSecret',
	),
	'serviceAccounts.deleteOrgServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.deleteOrgServiceAccount',
	),
	'serviceAccounts.getGroupServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.getGroupServiceAccount',
	),
	'serviceAccounts.getOrgServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.getOrgServiceAccount',
	),
	'serviceAccounts.getServiceAccountGroups': mongodbatlasSchemaEntry(
		'serviceAccounts.getServiceAccountGroups',
	),
	'serviceAccounts.inviteGroupServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.inviteGroupServiceAccount',
	),
	'serviceAccounts.listAccessList': mongodbatlasSchemaEntry(
		'serviceAccounts.listAccessList',
	),
	'serviceAccounts.listGroupServiceAccounts': mongodbatlasSchemaEntry(
		'serviceAccounts.listGroupServiceAccounts',
	),
	'serviceAccounts.listOrgAccessList': mongodbatlasSchemaEntry(
		'serviceAccounts.listOrgAccessList',
	),
	'serviceAccounts.listOrgServiceAccounts': mongodbatlasSchemaEntry(
		'serviceAccounts.listOrgServiceAccounts',
	),
	'serviceAccounts.updateGroupServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.updateGroupServiceAccount',
	),
	'serviceAccounts.updateOrgServiceAccount': mongodbatlasSchemaEntry(
		'serviceAccounts.updateOrgServiceAccount',
	),
	'shardKeyAnalyzer.createShardKeyAnalysis': mongodbatlasSchemaEntry(
		'shardKeyAnalyzer.createShardKeyAnalysis',
	),
	'shardKeyAnalyzer.getAnalysisOperation': mongodbatlasSchemaEntry(
		'shardKeyAnalyzer.getAnalysisOperation',
	),
	'shardKeyAnalyzer.getShardKeyAnalysis': mongodbatlasSchemaEntry(
		'shardKeyAnalyzer.getShardKeyAnalysis',
	),
	'shardKeyAnalyzer.listAnalysisOperations': mongodbatlasSchemaEntry(
		'shardKeyAnalyzer.listAnalysisOperations',
	),
	'shardKeyAnalyzer.listShardKeyAnalyses': mongodbatlasSchemaEntry(
		'shardKeyAnalyzer.listShardKeyAnalyses',
	),
	'shardingInsights.getClusterShardMetric': mongodbatlasSchemaEntry(
		'shardingInsights.getClusterShardMetric',
	),
	'shardingInsights.getClusterShardingInsights': mongodbatlasSchemaEntry(
		'shardingInsights.getClusterShardingInsights',
	),
	'shardingInsights.getShardMetricMeasurements': mongodbatlasSchemaEntry(
		'shardingInsights.getShardMetricMeasurements',
	),
	'shardingInsights.listClusterShardMetrics': mongodbatlasSchemaEntry(
		'shardingInsights.listClusterShardMetrics',
	),
	'shardingInsights.listShardMetricMeasurements': mongodbatlasSchemaEntry(
		'shardingInsights.listShardMetricMeasurements',
	),
	'shardingRecommendations.getClusterShardingRecommendations':
		mongodbatlasSchemaEntry(
			'shardingRecommendations.getClusterShardingRecommendations',
		),
	'streams.acceptVpcPeeringConnection': mongodbatlasSchemaEntry(
		'streams.acceptVpcPeeringConnection',
	),
	'streams.createFailoverConnection': mongodbatlasSchemaEntry(
		'streams.createFailoverConnection',
	),
	'streams.createPrivateLinkConnection': mongodbatlasSchemaEntry(
		'streams.createPrivateLinkConnection',
	),
	'streams.createStreamConnection': mongodbatlasSchemaEntry(
		'streams.createStreamConnection',
	),
	'streams.createStreamProcessor': mongodbatlasSchemaEntry(
		'streams.createStreamProcessor',
	),
	'streams.createStreamWorkspace': mongodbatlasSchemaEntry(
		'streams.createStreamWorkspace',
	),
	'streams.createWorkspacePrivateEndpoint': mongodbatlasSchemaEntry(
		'streams.createWorkspacePrivateEndpoint',
	),
	'streams.deletePrivateLinkConnection': mongodbatlasSchemaEntry(
		'streams.deletePrivateLinkConnection',
	),
	'streams.deleteStreamConnection': mongodbatlasSchemaEntry(
		'streams.deleteStreamConnection',
	),
	'streams.deleteStreamFailoverConnection': mongodbatlasSchemaEntry(
		'streams.deleteStreamFailoverConnection',
	),
	'streams.deleteStreamProcessor': mongodbatlasSchemaEntry(
		'streams.deleteStreamProcessor',
	),
	'streams.deleteStreamWorkspace': mongodbatlasSchemaEntry(
		'streams.deleteStreamWorkspace',
	),
	'streams.deleteVpcPeeringConnection': mongodbatlasSchemaEntry(
		'streams.deleteVpcPeeringConnection',
	),
	'streams.deleteWorkspacePrivateEndpoint': mongodbatlasSchemaEntry(
		'streams.deleteWorkspacePrivateEndpoint',
	),
	'streams.downloadAuditLogs': mongodbatlasSchemaEntry(
		'streams.downloadAuditLogs',
	),
	'streams.downloadOperationalLogs': mongodbatlasSchemaEntry(
		'streams.downloadOperationalLogs',
	),
	'streams.getAccountDetails': mongodbatlasSchemaEntry(
		'streams.getAccountDetails',
	),
	'streams.getPrivateLinkConnection': mongodbatlasSchemaEntry(
		'streams.getPrivateLinkConnection',
	),
	'streams.getStreamConnection': mongodbatlasSchemaEntry(
		'streams.getStreamConnection',
	),
	'streams.getStreamFailoverConnection': mongodbatlasSchemaEntry(
		'streams.getStreamFailoverConnection',
	),
	'streams.getStreamProcessor': mongodbatlasSchemaEntry(
		'streams.getStreamProcessor',
	),
	'streams.getStreamProcessors': mongodbatlasSchemaEntry(
		'streams.getStreamProcessors',
	),
	'streams.getStreamWorkspace': mongodbatlasSchemaEntry(
		'streams.getStreamWorkspace',
	),
	'streams.getWorkspacePrivateEndpoint': mongodbatlasSchemaEntry(
		'streams.getWorkspacePrivateEndpoint',
	),
	'streams.listActivePeeringConnections': mongodbatlasSchemaEntry(
		'streams.listActivePeeringConnections',
	),
	'streams.listFailoverConnections': mongodbatlasSchemaEntry(
		'streams.listFailoverConnections',
	),
	'streams.listPrivateLinkConnections': mongodbatlasSchemaEntry(
		'streams.listPrivateLinkConnections',
	),
	'streams.listStreamConnections': mongodbatlasSchemaEntry(
		'streams.listStreamConnections',
	),
	'streams.listStreamWorkspaces': mongodbatlasSchemaEntry(
		'streams.listStreamWorkspaces',
	),
	'streams.listVpcPeeringConnections': mongodbatlasSchemaEntry(
		'streams.listVpcPeeringConnections',
	),
	'streams.listWorkspacePrivateEndpoints': mongodbatlasSchemaEntry(
		'streams.listWorkspacePrivateEndpoints',
	),
	'streams.rejectVpcPeeringConnection': mongodbatlasSchemaEntry(
		'streams.rejectVpcPeeringConnection',
	),
	'streams.startStreamProcessor': mongodbatlasSchemaEntry(
		'streams.startStreamProcessor',
	),
	'streams.startStreamProcessorWith': mongodbatlasSchemaEntry(
		'streams.startStreamProcessorWith',
	),
	'streams.stopStreamProcessor': mongodbatlasSchemaEntry(
		'streams.stopStreamProcessor',
	),
	'streams.updatePrivateLinkConnection': mongodbatlasSchemaEntry(
		'streams.updatePrivateLinkConnection',
	),
	'streams.updateStreamConnection': mongodbatlasSchemaEntry(
		'streams.updateStreamConnection',
	),
	'streams.updateStreamFailoverConnection': mongodbatlasSchemaEntry(
		'streams.updateStreamFailoverConnection',
	),
	'streams.updateStreamProcessor': mongodbatlasSchemaEntry(
		'streams.updateStreamProcessor',
	),
	'streams.updateStreamWorkspace': mongodbatlasSchemaEntry(
		'streams.updateStreamWorkspace',
	),
	'streams.withStreamSampleConnections': mongodbatlasSchemaEntry(
		'streams.withStreamSampleConnections',
	),
	'teams.addGroupTeams': mongodbatlasSchemaEntry('teams.addGroupTeams'),
	'teams.createOrgTeam': mongodbatlasSchemaEntry('teams.createOrgTeam'),
	'teams.deleteOrgTeam': mongodbatlasSchemaEntry('teams.deleteOrgTeam'),
	'teams.getGroupTeam': mongodbatlasSchemaEntry('teams.getGroupTeam'),
	'teams.getOrgTeam': mongodbatlasSchemaEntry('teams.getOrgTeam'),
	'teams.getTeamByName': mongodbatlasSchemaEntry('teams.getTeamByName'),
	'teams.listGroupTeams': mongodbatlasSchemaEntry('teams.listGroupTeams'),
	'teams.listOrgTeams': mongodbatlasSchemaEntry('teams.listOrgTeams'),
	'teams.removeGroupTeam': mongodbatlasSchemaEntry('teams.removeGroupTeam'),
	'teams.renameOrgTeam': mongodbatlasSchemaEntry('teams.renameOrgTeam'),
	'teams.updateGroupTeam': mongodbatlasSchemaEntry('teams.updateGroupTeam'),
	'thirdPartyIntegrations.createGroupIntegration': mongodbatlasSchemaEntry(
		'thirdPartyIntegrations.createGroupIntegration',
	),
	'thirdPartyIntegrations.deleteGroupIntegration': mongodbatlasSchemaEntry(
		'thirdPartyIntegrations.deleteGroupIntegration',
	),
	'thirdPartyIntegrations.getGroupIntegration': mongodbatlasSchemaEntry(
		'thirdPartyIntegrations.getGroupIntegration',
	),
	'thirdPartyIntegrations.listGroupIntegrations': mongodbatlasSchemaEntry(
		'thirdPartyIntegrations.listGroupIntegrations',
	),
	'thirdPartyIntegrations.updateGroupIntegration': mongodbatlasSchemaEntry(
		'thirdPartyIntegrations.updateGroupIntegration',
	),
	'x509Authentication.createDatabaseUserCert': mongodbatlasSchemaEntry(
		'x509Authentication.createDatabaseUserCert',
	),
	'x509Authentication.disableSecurityCustomerX509': mongodbatlasSchemaEntry(
		'x509Authentication.disableSecurityCustomerX509',
	),
	'x509Authentication.listDatabaseUserCerts': mongodbatlasSchemaEntry(
		'x509Authentication.listDatabaseUserCerts',
	),
} satisfies RequiredPluginEndpointSchemas<typeof mongodbatlasEndpointsNested>;

export const mongodbatlasEndpointMeta = {
	'accessTracking.getAccessHistoryCluster': {
		riskLevel: 'read',
		description:
			"Return Database Access History for One Cluster by Cluster Name: returns the access logs of one cluster identified by the cluster's name",
	},
	'accessTracking.getAccessHistoryProcess': {
		riskLevel: 'read',
		description:
			"Return Database Access History for One Cluster by Hostname: returns the access logs of one cluster identified by the cluster's hostname",
	},
	'activityFeed.getGroupActivityFeed': {
		riskLevel: 'read',
		description:
			'Return Pre-Filtered Activity Feed Link for One Project: returns a pre-filtered activity feed link for the specified project based on the provided date range and event types',
	},
	'activityFeed.getOrgActivityFeed': {
		riskLevel: 'read',
		description:
			'Return Pre-Filtered Activity Feed Link for One Organization: returns a pre-filtered activity feed link for the specified organization based on the provided date range and event types',
	},
	'aiModelApiKeys.createGroupModelKey': {
		riskLevel: 'write',
		description:
			'Create New AI Model API Key: create a new AI model API key for the given group',
	},
	'aiModelApiKeys.deleteGroupModelKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Existing AI Model API Key: delete an existing AI model API key in the given group',
	},
	'aiModelApiKeys.getGroupModelKey': {
		riskLevel: 'read',
		description:
			'Return Single AI Model API Key for One Group: retrieve a single AI model API key for the given group',
	},
	'aiModelApiKeys.getOrgModelKey': {
		riskLevel: 'read',
		description:
			'Return Single AI Model API Key for One Organization: retrieve a single AI model API key for the given organization',
	},
	'aiModelApiKeys.listGroupModelKeys': {
		riskLevel: 'read',
		description:
			'Return AI Model API Keys for One Group: retrieve AI model API keys for the given group (paged with pageNum / itemsPerPage)',
	},
	'aiModelApiKeys.listOrgModelKeys': {
		riskLevel: 'read',
		description:
			'Return AI Model API Keys for One Organization: retrieve AI model API keys for the given organization (paged with pageNum / itemsPerPage)',
	},
	'aiModelApiKeys.updateGroupModelKey': {
		riskLevel: 'write',
		description:
			'Update Existing AI Model API Key: update an existing AI model API key in the given group',
	},
	'aiModelRateLimits.getGroupModelLimits': {
		riskLevel: 'read',
		description:
			'Return AI Model Rate Limits for One Group: retrieve AI model rate limits for the given group (paged with pageNum / itemsPerPage)',
	},
	'aiModelRateLimits.getGroupRateLimits': {
		riskLevel: 'read',
		description:
			'Return Single AI Model Rate Limit for One Group: retrieve a single scoped AI model rate limit for the given group',
	},
	'aiModelRateLimits.getOrgModelLimits': {
		riskLevel: 'read',
		description:
			'Return AI Model Rate Limits for One Organization: retrieve AI model rate limits for the given organization (paged with pageNum / itemsPerPage)',
	},
	'aiModelRateLimits.getOrgRateLimits': {
		riskLevel: 'read',
		description:
			'Return Single AI Model Rate Limit for One Organization: retrieve a single scoped AI model rate limit for the given organization',
	},
	'aiModelRateLimits.resetGroupModelLimits': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset AI Model Rate Limit for One Model Group: reset the scoped AI model rate limit for the given model group to default values',
	},
	'aiModelRateLimits.resetGroupRateLimits': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset AI Model Rate Limits for Group: reset the AI Model rate limits for the given group to default values',
	},
	'aiModelRateLimits.updateGroupRateLimits': {
		riskLevel: 'write',
		description:
			'Update AI Model Rate Limit: update a scoped AI model rate limit for the given model group',
	},
	'alertConfigurations.createAlertConfig': {
		riskLevel: 'write',
		description:
			'Create One Alert Configuration in One Project: creates one alert configuration for the specified project',
	},
	'alertConfigurations.deleteAlertConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Alert Configuration from One Project: removes one alert configuration from the specified project',
	},
	'alertConfigurations.getAlertConfig': {
		riskLevel: 'read',
		description:
			'Return One Alert Configuration from One Project: returns the specified alert configuration from the specified project',
	},
	'alertConfigurations.getAlertConfigs': {
		riskLevel: 'read',
		description:
			'Return All Alert Configurations Set for One Alert: returns all alert configurations set for the specified alert (paged with pageNum / itemsPerPage)',
	},
	'alertConfigurations.listAlertConfigs': {
		riskLevel: 'read',
		description:
			'Return All Alert Configurations in One Project: returns all alert configurations for one project (paged with pageNum / itemsPerPage)',
	},
	'alertConfigurations.listMatcherFieldNames': {
		riskLevel: 'read',
		description:
			'Return All Alert Configuration Matchers Field Names: get all field names that the `matchers.fieldName` parameter accepts when you create or update an Alert Configuration',
	},
	'alertConfigurations.toggleAlertConfig': {
		riskLevel: 'write',
		description:
			'Toggle State of One Alert Configuration in One Project: enables or disables the specified alert configuration in the specified project',
	},
	'alertConfigurations.updateAlertConfig': {
		riskLevel: 'write',
		description:
			'Update One Alert Configuration in One Project: updates one alert configuration in the specified project',
	},
	'alerts.acknowledgeAlert': {
		riskLevel: 'write',
		description:
			'Acknowledge One Alert from One Project: confirms receipt of one existing alert',
	},
	'alerts.getAlert': {
		riskLevel: 'read',
		description: 'Return One Alert from One Project: returns one alert',
	},
	'alerts.getAlertConfigAlerts': {
		riskLevel: 'read',
		description:
			'Return All Open Alerts for One Alert Configuration: returns all open alerts that the specified alert configuration triggers (paged with pageNum / itemsPerPage)',
	},
	'alerts.listAlerts': {
		riskLevel: 'read',
		description:
			'Return All Alerts from One Project: returns all alerts (paged with pageNum / itemsPerPage)',
	},
	'atlasSearch.createClusterSearchDeployment': {
		riskLevel: 'destructive',
		description:
			'Create Search Nodes: creates Search Nodes for the specified cluster',
	},
	'atlasSearch.createClusterSearchIndex': {
		riskLevel: 'destructive',
		description:
			'Create One Atlas Search Index: creates one Atlas Search index on the specified collection',
	},
	'atlasSearch.deleteClusterSearchDeployment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Search Nodes: deletes the Search Nodes for the specified cluster',
	},
	'atlasSearch.deleteClusterSearchIndex': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Atlas Search Index by ID: removes one Atlas Search index that you identified with its unique ID',
	},
	'atlasSearch.deleteIndexByName': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Atlas Search Index by Name: removes one Atlas Search index that you identified with its database, collection, and name',
	},
	'atlasSearch.getClusterSearchDeployment': {
		riskLevel: 'read',
		description:
			'Return All Search Nodes: returns the Search Nodes for the specified cluster',
	},
	'atlasSearch.getClusterSearchIndex': {
		riskLevel: 'read',
		description:
			'Return One Atlas Search Index by ID: returns one Atlas Search index in the specified project',
	},
	'atlasSearch.getIndexByName': {
		riskLevel: 'read',
		description:
			'Return One Atlas Search Index by Name: returns one Atlas Search index in the specified project',
	},
	'atlasSearch.listClusterSearchIndexes': {
		riskLevel: 'read',
		description:
			'Return All Atlas Search Indexes for One Cluster: returns all Atlas Search indexes on the specified cluster',
	},
	'atlasSearch.listSearchIndex': {
		riskLevel: 'read',
		description:
			'Return All Atlas Search Indexes for One Collection: returns all Atlas Search indexes on the specified collection',
	},
	'atlasSearch.updateClusterSearchDeployment': {
		riskLevel: 'write',
		description:
			'Update Search Nodes: updates the Search Nodes for the specified cluster',
	},
	'atlasSearch.updateClusterSearchIndex': {
		riskLevel: 'write',
		description:
			'Update One Atlas Search Index by ID: updates one Atlas Search index that you identified with its unique ID',
	},
	'atlasSearch.updateIndexByName': {
		riskLevel: 'write',
		description:
			'Update One Atlas Search Index by Name: updates one Atlas Search index that you identified with its database, collection name, and index name',
	},
	'auditing.getGroupAuditLog': {
		riskLevel: 'read',
		description:
			'Return Auditing Configuration for One Project: returns the auditing configuration for the specified project',
	},
	'auditing.updateAuditLog': {
		riskLevel: 'write',
		description:
			'Update Auditing Configuration for One Project: updates the auditing configuration for the specified project',
	},
	'awsClustersDns.getAwsCustomDns': {
		riskLevel: 'read',
		description:
			'Return One Custom DNS Configuration for Atlas Clusters on AWS: returns the custom DNS configuration for AWS clusters in the specified project',
	},
	'awsClustersDns.toggleAwsCustomDns': {
		riskLevel: 'write',
		description:
			'Update State of One Custom DNS Configuration for Atlas Clusters on AWS: enables or disables the custom DNS configuration for AWS clusters in the specified project',
	},
	'cloudBackups.cancelBackupRestoreJob': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel One Restore Job for One Cluster: cancels one cloud backup restore job of one cluster from the specified project',
	},
	'cloudBackups.createBackupExport': {
		riskLevel: 'write',
		description:
			'Create One Snapshot Export Job: exports one backup Snapshot for dedicated Atlas cluster using Cloud Backups to an Export Bucket',
	},
	'cloudBackups.createBackupPrivateEndpoint': {
		riskLevel: 'write',
		description:
			'Create One Object Storage Private Endpoint for Cloud Backups for One Cloud Provider in One Project: creates a private endpoint in the specified region for secure, private connectivity between Atlas and cloud provider object storage services for backup operations',
	},
	'cloudBackups.createBackupRestoreJob': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create One Restore Job of One Cluster: restores one snapshot of one cluster from the specified project',
	},
	'cloudBackups.createCollectionRestoreJob': {
		riskLevel: 'write',
		description:
			'Create One Collection Restore Job: creates one collection-level restore job for one cluster from the specified project',
	},
	'cloudBackups.createExportBucket': {
		riskLevel: 'destructive',
		description:
			'Create One Snapshot Export Bucket: creates a Snapshot Export Bucket for an AWS S3 Bucket, Azure Blob Storage Container, or Google Cloud Storage Bucket',
	},
	'cloudBackups.deleteBackupPrivateEndpoint': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Object Storage Private Endpoint for Cloud Backups for One Cloud Provider from One Project: deletes one private endpoint, identified by its ID, for object storage backup operations',
	},
	'cloudBackups.deleteBackupShardedCluster': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Sharded Cluster Cloud Backup: removes one snapshot of one sharded cluster from the specified project',
	},
	'cloudBackups.deleteClusterBackupSchedule': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove All Cloud Backup Schedules: removes all cloud backup schedules for the specified cluster',
	},
	'cloudBackups.deleteClusterBackupSnapshot': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Replica Set Cloud Backup: removes the specified snapshot',
	},
	'cloudBackups.deleteExportBucket': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete One Snapshot Export Bucket: deletes an Export Bucket',
	},
	'cloudBackups.disableCompliancePolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disable Backup Compliance Policy Settings: disables the Backup Compliance Policy settings with the specified project',
	},
	'cloudBackups.getBackupExport': {
		riskLevel: 'read',
		description:
			'Return One Snapshot Export Job: returns one Cloud Backup Snapshot Export Job associated with the specified Atlas cluster',
	},
	'cloudBackups.getBackupPrivateEndpoint': {
		riskLevel: 'read',
		description:
			'Return One Object Storage Private Endpoint for Cloud Backups for One Cloud Provider in One Project: returns one private endpoint, identified by its ID, for object storage backup operations',
	},
	'cloudBackups.getBackupRestoreJob': {
		riskLevel: 'read',
		description:
			'Return One Restore Job for One Cluster: returns one cloud backup restore job for one cluster from the specified project',
	},
	'cloudBackups.getBackupSchedule': {
		riskLevel: 'read',
		description:
			'Return One Cloud Backup Schedule: returns the cloud backup schedule for the specified cluster within the specified project',
	},
	'cloudBackups.getBackupShardedCluster': {
		riskLevel: 'read',
		description:
			'Return One Sharded Cluster Cloud Backup: returns one snapshot of one sharded cluster from the specified project',
	},
	'cloudBackups.getBackupSnapshotDatabase': {
		riskLevel: 'read',
		description:
			'Return One Database in One Snapshot: returns one database that exists in the specified snapshot',
	},
	'cloudBackups.getClusterBackupSnapshot': {
		riskLevel: 'read',
		description:
			'Return One Replica Set Cloud Backup: returns one snapshot from the specified cluster',
	},
	'cloudBackups.getCollectionRestoreJob': {
		riskLevel: 'read',
		description:
			'Return One Collection Restore Job for One Cluster: returns one collection restore job for one cluster from the specified project',
	},
	'cloudBackups.getCompliancePolicy': {
		riskLevel: 'read',
		description:
			'Return Backup Compliance Policy Settings: returns the Backup Compliance Policy settings with the specified project',
	},
	'cloudBackups.getExportBucket': {
		riskLevel: 'read',
		description:
			'Return One Snapshot Export Bucket: returns one Export Bucket associated with the specified Project',
	},
	'cloudBackups.getRestoreJobCollection': {
		riskLevel: 'read',
		description:
			'Return One Collection State for One Collection Restore Job: returns one collection-level restore state for one collection restore job from the specified project',
	},
	'cloudBackups.getSnapshotDatabaseCollection': {
		riskLevel: 'read',
		description:
			'Return One Collection in One Database in One Snapshot: returns one collection that exists in the specified database in the snapshot',
	},
	'cloudBackups.listBackupExports': {
		riskLevel: 'read',
		description:
			'Return All Snapshot Export Jobs: returns all Cloud Backup Snapshot Export Jobs associated with the specified Atlas cluster (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listBackupPrivateEndpoints': {
		riskLevel: 'read',
		description:
			'Return Object Storage Private Endpoints for Cloud Backups for One Cloud Provider in One Project: returns the private endpoints of the specified cloud provider for object storage backup operations (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listBackupRestoreJobs': {
		riskLevel: 'read',
		description:
			'Return All Restore Jobs for One Cluster: returns all cloud backup restore jobs for one cluster from the specified project (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listBackupShardedClusters': {
		riskLevel: 'read',
		description:
			'Return All Sharded Cluster Cloud Backups: returns all snapshots of one sharded cluster from the specified project',
	},
	'cloudBackups.listBackupSnapshotDatabases': {
		riskLevel: 'read',
		description:
			'Return Databases in One Snapshot: returns the list of databases that exist in the specified snapshot (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listBackupSnapshots': {
		riskLevel: 'read',
		description:
			'Return All Replica Set Cloud Backups: returns all snapshots of one cluster from the specified project (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listCollectionRestoreJobs': {
		riskLevel: 'read',
		description:
			'Return All Collection Restore Jobs for One Cluster: returns all collection restore jobs for one cluster from the specified project (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listExportBuckets': {
		riskLevel: 'read',
		description:
			'Return All Snapshot Export Buckets: returns all Export Buckets associated with the specified Project (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listRestoreJobCollections': {
		riskLevel: 'read',
		description:
			'Return All Collection States for One Collection Restore Job: returns all collection-level restore states for one collection restore job from the specified project (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.listSnapshotDatabaseCollections': {
		riskLevel: 'read',
		description:
			'Return Collections in One Database in One Snapshot: returns the list of collections in the specified database that exist in the snapshot (paged with pageNum / itemsPerPage)',
	},
	'cloudBackups.takeSnapshots': {
		riskLevel: 'destructive',
		description:
			'Take One On-Demand Snapshot: takes one on-demand snapshot for the specified cluster',
	},
	'cloudBackups.updateBackupExportBucket': {
		riskLevel: 'write',
		description:
			'Update One Export Bucket Private Networking Settings: updates the private networking settings for one snapshot export bucket in the specified project',
	},
	'cloudBackups.updateBackupSchedule': {
		riskLevel: 'write',
		description:
			'Update Cloud Backup Schedule for One Cluster: updates the cloud backup schedule for one cluster within the specified project',
	},
	'cloudBackups.updateBackupSnapshot': {
		riskLevel: 'write',
		description:
			'Update Expiration Date for One Cloud Backup: changes the expiration date for one cloud backup snapshot for one cluster in the specified project, the requesting Service Account or API Key must have the Project Backup Manager role',
	},
	'cloudBackups.updateCompliancePolicy': {
		riskLevel: 'write',
		description:
			'Update Backup Compliance Policy Settings: updates the Backup Compliance Policy settings for the specified project',
	},
	'cloudMigrationService.createGroupLiveMigration': {
		riskLevel: 'write',
		description:
			'Create One Migration for One Local Managed Cluster to MongoDB Atlas: migrate one cluster that Cloud or Ops Manager manages to MongoDB Atlas',
	},
	'cloudMigrationService.createLinkToken': {
		riskLevel: 'destructive',
		description:
			'Create One Link-Token: create one link-token that contains all the information required to complete the link',
	},
	'cloudMigrationService.cutoverMigration': {
		riskLevel: 'write',
		description:
			'Cut Over One Migrated Cluster: cut over the migrated cluster to MongoDB Atlas',
	},
	'cloudMigrationService.deleteLinkTokens': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Link-Token: remove one organization link and its associated public API key',
	},
	'cloudMigrationService.getGroupLiveMigration': {
		riskLevel: 'read',
		description:
			'Return One Migration Job: return details of one cluster migration job',
	},
	'cloudMigrationService.getMigrationValidateStatus': {
		riskLevel: 'read',
		description:
			'Return One Migration Validation Job: return the status of one migration validation job',
	},
	'cloudMigrationService.listAvailableProjects': {
		riskLevel: 'read',
		description:
			'Return All Projects Available for Migration: return all projects that you can migrate to the specified organization',
	},
	'cloudMigrationService.validateLiveMigrations': {
		riskLevel: 'read',
		description:
			'Validate One Migration Request: verifies whether the provided credentials, available disk space, MongoDB versions, and so on meet the requirements of the migration request',
	},
	'cloudProviderAccess.authorizeProviderAccessRole': {
		riskLevel: 'write',
		description:
			'Authorize One Cloud Provider Access Role: grants access to the specified project for the specified access role',
	},
	'cloudProviderAccess.createCloudProviderAccess': {
		riskLevel: 'write',
		description:
			'Create One Cloud Provider Access Role: creates one access role for the specified cloud provider',
	},
	'cloudProviderAccess.deauthorizeProviderAccessRole': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deauthorize One Cloud Provider Access Role: revokes access to the specified project for the specified access role',
	},
	'cloudProviderAccess.getCloudProviderAccess': {
		riskLevel: 'read',
		description:
			'Return One Cloud Provider Access Role: returns the access role with the specified id and with access to the specified project',
	},
	'cloudProviderAccess.listCloudProviderAccess': {
		riskLevel: 'read',
		description:
			'Return All Cloud Provider Access Roles: returns all cloud provider access roles with access to the specified project',
	},
	'clusterOutageSimulation.endOutageSimulation': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'End One Outage Simulation: ends a cluster outage simulation',
	},
	'clusterOutageSimulation.getOutageSimulation': {
		riskLevel: 'read',
		description:
			'Return One Outage Simulation: returns one outage simulation for one cluster',
	},
	'clusterOutageSimulation.startOutageSimulation': {
		riskLevel: 'destructive',
		description:
			'Start One Outage Simulation: starts a cluster outage simulation',
	},
	'clusters.createCluster': {
		riskLevel: 'destructive',
		description:
			'Create One Cluster in One Project: creates one cluster in the specified project',
	},
	'clusters.deleteCluster': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Cluster from One Project: removes one cluster from the specified project',
	},
	'clusters.getCluster': {
		riskLevel: 'read',
		description:
			'Return One Cluster from One Project: returns the details for one cluster in the specified project',
	},
	'clusters.getClusterAdaptiveSettings': {
		riskLevel: 'read',
		description:
			'Return Adaptive Settings for One Cluster: returns the Adaptive Settings for the specified cluster, including client-provided overrides and the effective settings derived from those overrides and Atlas-managed defaults',
	},
	'clusters.getClusterStatus': {
		riskLevel: 'read',
		description:
			'Return Status of All Cluster Operations: returns the status of all changes that you made to the specified cluster in the specified project',
	},
	'clusters.getProcessArgs': {
		riskLevel: 'read',
		description:
			'Return Advanced Configuration Options for One Cluster: returns the advanced configuration details for one cluster in the specified project',
	},
	'clusters.getSampleDatasetLoad': {
		riskLevel: 'read',
		description:
			'Return Status of Sample Dataset Load for One Cluster: checks the progress of loading the sample dataset into one cluster',
	},
	'clusters.grantMongoEmployeeAccess': {
		riskLevel: 'write',
		description:
			'Grant MongoDB Employee Cluster Access for One Cluster: grants MongoDB employee cluster access for the given duration and at the specified level for one cluster',
	},
	'clusters.listClusterDetails': {
		riskLevel: 'read',
		description:
			'Return All Authorized Clusters in All Projects: returns the details for all clusters in all projects to which you have access (paged with pageNum / itemsPerPage)',
	},
	'clusters.listClusterProviderRegions': {
		riskLevel: 'read',
		description:
			'Return All Cloud Provider Regions: returns the list of regions available for the specified cloud provider at the specified tier (paged with pageNum / itemsPerPage)',
	},
	'clusters.listClusters': {
		riskLevel: 'read',
		description:
			'Return All Clusters in One Project: returns the details for all clusters in the specific project to which you have access (paged with pageNum / itemsPerPage)',
	},
	'clusters.pinFeatureCompatibilityVersion': {
		riskLevel: 'write',
		description:
			'Pin Feature Compatibility Version for One Cluster in One Project: pins the Feature Compatibility Version (FCV) to the current MongoDB version and sets the pin expiration date',
	},
	'clusters.requestSampleDatasetLoad': {
		riskLevel: 'write',
		description:
			'Load Sample Dataset into One Cluster: requests loading the MongoDB sample dataset into the specified cluster',
	},
	'clusters.restartPrimaries': {
		riskLevel: 'destructive',
		description:
			'Test Failover for One Cluster: starts a failover test for the specified cluster in the specified project',
	},
	'clusters.revokeMongoEmployeeAccess': {
		riskLevel: 'destructive',
		description:
			'Revoke MongoDB Employee Cluster Access for One Cluster: revokes a previously granted MongoDB employee cluster access',
	},
	'clusters.unpinFeatureCompatibilityVersion': {
		riskLevel: 'write',
		description:
			'Unpin Feature Compatibility Version for One Cluster in One Project: unpins the current fixed Feature Compatibility Version (FCV)',
	},
	'clusters.updateCluster': {
		riskLevel: 'destructive',
		description:
			'Update One Cluster in One Project: updates the details for one cluster in the specified project',
	},
	'clusters.updateClusterAdaptiveSettings': {
		riskLevel: 'write',
		description:
			'Update Adaptive Settings for One Cluster: updates the client-provided Adaptive Settings overrides for the specified cluster and returns the resulting Adaptive Settings, including the effective settings derived from those overrides and Atlas-managed defaults',
	},
	'clusters.updateProcessArgs': {
		riskLevel: 'write',
		description:
			'Update Advanced Configuration Options for One Cluster: updates the advanced configuration details for one cluster in the specified project',
	},
	'clusters.upgradeTenantUpgrade': {
		riskLevel: 'destructive',
		description:
			'Upgrade One Shared-Tier Cluster: upgrades a shared-tier cluster to a Flex or Dedicated (M10+) cluster in the specified project',
	},
	'clusters.validateGroupClusterConfigurations': {
		riskLevel: 'read',
		description:
			'Validate One Cluster Configuration: checks if the given cluster configuration is valid and ready to be used to create or edit a cluster',
	},
	'collectionLevelMetrics.getClusterNamespaces': {
		riskLevel: 'read',
		description:
			'Return Ranked Namespaces from One Cluster: return the subset of namespaces from the given cluster sorted by highest total execution time (descending) within the given time window',
	},
	'collectionLevelMetrics.getProcessNamespaces': {
		riskLevel: 'read',
		description:
			'Return Ranked Namespaces from One Host: return the subset of namespaces from the given process ranked by highest total execution time (descending) within the given time window',
	},
	'collectionLevelMetrics.listCollStatMeasurements': {
		riskLevel: 'read',
		description:
			'Return Cluster-Level Query Latency: get a list of the Coll Stats Latency cluster-level measurements for the given namespace',
	},
	'collectionLevelMetrics.listCollStatMetrics': {
		riskLevel: 'read',
		description:
			'Return All Metric Names: returns all available Coll Stats Latency metric names and their respective units for the specified project at the time of request',
	},
	'collectionLevelMetrics.listPinnedNamespaces': {
		riskLevel: 'read',
		description:
			"Return Pinned Namespaces: returns a list of given cluster's pinned namespaces, a set of namespaces manually selected by users to collect query latency metrics on",
	},
	'collectionLevelMetrics.listProcessMeasurements': {
		riskLevel: 'read',
		description:
			'Return Host-Level Query Latency: get a list of the Coll Stats Latency process-level measurements for the given namespace',
	},
	'collectionLevelMetrics.pinNamespaces': {
		riskLevel: 'write',
		description:
			'Pin Namespaces: pin provided list of namespaces for collection-level latency metrics collection for the given Group and Cluster',
	},
	'collectionLevelMetrics.unpinNamespaces': {
		riskLevel: 'write',
		description:
			'Unpin Namespaces: unpin provided list of namespaces for collection-level latency metrics collection for the given Group and Cluster',
	},
	'collectionLevelMetrics.updatePinnedNamespaces': {
		riskLevel: 'write',
		description:
			'Add Pinned Namespaces: add provided list of namespaces to existing pinned namespaces list for collection-level latency metrics collection for the given Group and Cluster',
	},
	'customDatabaseRoles.createCustomDbRole': {
		riskLevel: 'write',
		description:
			'Create One Custom Role: creates one custom role in the specified project',
	},
	'customDatabaseRoles.deleteCustomDbRole': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Custom Role from One Project: removes one custom role from the specified project',
	},
	'customDatabaseRoles.getCustomDbRole': {
		riskLevel: 'read',
		description:
			'Return One Custom Role in One Project: returns one custom role for the specified project',
	},
	'customDatabaseRoles.listCustomDbRoles': {
		riskLevel: 'read',
		description:
			'Return All Custom Roles in One Project: returns all custom roles for the specified project',
	},
	'customDatabaseRoles.updateCustomDbRole': {
		riskLevel: 'write',
		description:
			'Update One Custom Role in One Project: updates one custom role in the specified project',
	},
	'dataFederation.createDataFederation': {
		riskLevel: 'destructive',
		description:
			'Create One Federated Database Instance in One Project: creates one federated database instance in the specified project',
	},
	'dataFederation.createPrivateEndpointId': {
		riskLevel: 'destructive',
		description:
			'Create One Federated Database Instance and Online Archive Private Endpoint for One Project: adds one private endpoint for Federated Database Instances and Online Archives to the specified projects',
	},
	'dataFederation.deleteDataFederation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Federated Database Instance from One Project: removes one federated database instance from the specified project',
	},
	'dataFederation.deleteDataFederationLimit': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Query Limit for One Federated Database Instance: deletes one query limit for one federated database instance',
	},
	'dataFederation.deletePrivateEndpointId': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Federated Database Instance and Online Archive Private Endpoint from One Project: removes one private endpoint for Federated Database Instances and Online Archives in the specified project',
	},
	'dataFederation.downloadFederationQueryLogs': {
		riskLevel: 'read',
		description:
			'Download Query Logs for One Federated Database Instance: downloads the query logs for the specified federated database instance (returned as a file)',
	},
	'dataFederation.getDataFederation': {
		riskLevel: 'read',
		description:
			'Return One Federated Database Instance in One Project: returns the details of one federated database instance within the specified project',
	},
	'dataFederation.getDataFederationLimit': {
		riskLevel: 'read',
		description:
			'Return One Federated Database Instance Query Limit for One Project: returns the details of one query limit for the specified federated database instance in the specified project',
	},
	'dataFederation.getPrivateEndpointId': {
		riskLevel: 'read',
		description:
			'Return One Federated Database Instance and Online Archive Private Endpoint in One Project: returns the specified private endpoint for Federated Database Instances or Online Archives in the specified project',
	},
	'dataFederation.listDataFederation': {
		riskLevel: 'read',
		description:
			'Return All Federated Database Instances in One Project: returns the details of all federated database instances in the specified project',
	},
	'dataFederation.listDataFederationLimits': {
		riskLevel: 'read',
		description:
			'Return All Query Limits for One Federated Database Instance: returns query limits for a federated databases instance in the specified project',
	},
	'dataFederation.listPrivateEndpointIds': {
		riskLevel: 'read',
		description:
			'Return All Federated Database Instance and Online Archive Private Endpoints in One Project: returns all private endpoints for Federated Database Instances and Online Archives in the specified project (paged with pageNum / itemsPerPage)',
	},
	'dataFederation.setDataFederationLimit': {
		riskLevel: 'write',
		description:
			'Configure One Query Limit for One Federated Database Instance: creates or updates one query limit for one federated database instance',
	},
	'dataFederation.updateDataFederation': {
		riskLevel: 'write',
		description:
			'Update One Federated Database Instance in One Project: updates the details of one federated database instance in the specified project',
	},
	'databaseUsers.createDatabaseUser': {
		riskLevel: 'write',
		description:
			'Create One Database User in One Project: creates one database user in the specified project',
	},
	'databaseUsers.deleteDatabaseUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Database User from One Project: removes one database user from the specified project',
	},
	'databaseUsers.getDatabaseUser': {
		riskLevel: 'read',
		description:
			'Return One Database User from One Project: returns one database user that belong to the specified project',
	},
	'databaseUsers.listDatabaseUsers': {
		riskLevel: 'read',
		description:
			'Return All Database Users in One Project: returns all database users that belong to the specified project (paged with pageNum / itemsPerPage)',
	},
	'databaseUsers.updateDatabaseUser': {
		riskLevel: 'write',
		description:
			'Update One Database User in One Project: updates one database user that belongs to the specified project',
	},
	'encryptionAtRestUsingCustomerKeyManagement.createRestPrivateEndpoint': {
		riskLevel: 'write',
		description:
			'Create One Private Endpoint for Encryption at Rest Using Customer Key Management for One Cloud Provider in One Project: creates a private endpoint in the specified region for encryption at rest using customer key management',
	},
	'encryptionAtRestUsingCustomerKeyManagement.getEncryptionAtRest': {
		riskLevel: 'read',
		description:
			'Return One Configuration for Encryption at Rest Using Customer-Managed Keys for One Project: returns the configuration for encryption at rest using the keys you manage through your cloud provider',
	},
	'encryptionAtRestUsingCustomerKeyManagement.getRestPrivateEndpoint': {
		riskLevel: 'read',
		description:
			'Return One Private Endpoint for Encryption at Rest Using Customer Key Management for One Cloud Provider in One Project: returns one private endpoint, identified by its ID, for encryption at rest using Customer Key Management',
	},
	'encryptionAtRestUsingCustomerKeyManagement.listRestPrivateEndpoints': {
		riskLevel: 'read',
		description:
			'Return Private Endpoints for Encryption at Rest Using Customer Key Management for One Cloud Provider in One Project: returns the private endpoints of the specified cloud provider for encryption at rest using customer key management (paged with pageNum / itemsPerPage)',
	},
	'encryptionAtRestUsingCustomerKeyManagement.requestPrivateEndpointDeletion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Private Endpoint for Encryption at Rest Using Customer Key Management for One Cloud Provider from One Project: deletes one private endpoint, identified by its ID, for encryption at rest using Customer Key Management',
	},
	'encryptionAtRestUsingCustomerKeyManagement.updateEncryptionAtRest': {
		riskLevel: 'write',
		description:
			'Update Encryption at Rest Configuration in One Project: updates the configuration for encryption at rest using the keys you manage through your cloud provider',
	},
	'events.getGroupEvent': {
		riskLevel: 'read',
		description:
			'Return One Event from One Project: returns one event for the specified project',
	},
	'events.getOrgEvent': {
		riskLevel: 'read',
		description:
			'Return One Event from One Organization: returns one event for the specified organization',
	},
	'events.listEventTypes': {
		riskLevel: 'read',
		description:
			'Return All Event Types: returns a list of all event types, along with a description and additional metadata about each event (paged with pageNum / itemsPerPage)',
	},
	'events.listGroupEvents': {
		riskLevel: 'read',
		description:
			'Return Events from One Project: returns events for the specified project (paged with pageNum / itemsPerPage)',
	},
	'events.listOrgEvents': {
		riskLevel: 'read',
		description:
			'Return Events from One Organization: returns events for the specified organization (paged with pageNum / itemsPerPage)',
	},
	'federatedAuthentication.createIdentityProvider': {
		riskLevel: 'write',
		description:
			'Create One Identity Provider: creates one identity provider within the specified federation',
	},
	'federatedAuthentication.createRoleMapping': {
		riskLevel: 'write',
		description:
			'Create One Role Mapping in One Organization Configuration: adds one role mapping to the specified organization in the specified federation',
	},
	'federatedAuthentication.deleteFederationSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Federation Settings Instance: deletes the federation settings instance and all associated data, including identity providers and domains',
	},
	'federatedAuthentication.deleteIdentityProvider': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Identity Provider: deletes one identity provider in the specified federation',
	},
	'federatedAuthentication.deleteRoleMapping': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Role Mapping from One Organization: removes one role mapping in the specified organization from the specified federation',
	},
	'federatedAuthentication.getConnectedOrgConfig': {
		riskLevel: 'read',
		description:
			'Return One Organization Configuration from One Federation: returns the specified connected organization configuration from the specified federation',
	},
	'federatedAuthentication.getFederationSettings': {
		riskLevel: 'read',
		description:
			'Return Federation Settings for One Organization: returns information about the federation settings for the specified organization',
	},
	'federatedAuthentication.getIdentityProvider': {
		riskLevel: 'read',
		description:
			"Return One Identity Provider by ID: returns one identity provider in the specified federation by the identity provider's id",
	},
	'federatedAuthentication.getIdentityProviderMetadata': {
		riskLevel: 'read',
		description:
			'Return Metadata of One Identity Provider: returns the metadata of one identity provider in the specified federation',
	},
	'federatedAuthentication.getRoleMapping': {
		riskLevel: 'read',
		description:
			'Return One Role Mapping from One Organization: returns one role mapping from the specified organization in the specified federation',
	},
	'federatedAuthentication.listConnectedOrgConfigs': {
		riskLevel: 'read',
		description:
			'Return All Organization Configurations from One Federation: returns all connected organization configurations in the specified federation (paged with pageNum / itemsPerPage)',
	},
	'federatedAuthentication.listIdentityProviders': {
		riskLevel: 'read',
		description:
			'Return All Identity Providers in One Federation: returns all identity providers with the provided protocol and type in the specified federation (paged with pageNum / itemsPerPage)',
	},
	'federatedAuthentication.listRoleMappings': {
		riskLevel: 'read',
		description:
			'Return All Role Mappings from One Organization: returns all role mappings from the specified organization in the specified federation',
	},
	'federatedAuthentication.removeConnectedOrgConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Organization Configuration from One Federation: removes one connected organization configuration from the specified federation',
	},
	'federatedAuthentication.revokeIdentityProviderJwks': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke JWKS from One OIDC Identity Provider: revokes the JWKS tokens from the requested OIDC identity provider',
	},
	'federatedAuthentication.updateConnectedOrgConfig': {
		riskLevel: 'write',
		description:
			'Update One Organization Configuration in One Federation: updates one connected organization configuration from the specified federation',
	},
	'federatedAuthentication.updateIdentityProvider': {
		riskLevel: 'write',
		description:
			'Update One Identity Provider: updates one identity provider in the specified federation',
	},
	'federatedAuthentication.updateRoleMapping': {
		riskLevel: 'write',
		description:
			'Update One Role Mapping in One Organization: updates one role mapping in the specified organization in the specified federation',
	},
	'flexClusters.createFlexCluster': {
		riskLevel: 'destructive',
		description:
			'Create One Flex Cluster in One Project: creates one flex cluster in the specified project',
	},
	'flexClusters.deleteFlexCluster': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Flex Cluster from One Project: removes one flex cluster from the specified project',
	},
	'flexClusters.getFlexCluster': {
		riskLevel: 'read',
		description:
			'Return One Flex Cluster from One Project: returns details for one flex cluster in the specified project',
	},
	'flexClusters.listFlexClusters': {
		riskLevel: 'read',
		description:
			'Return All Flex Clusters from One Project: returns details for all flex clusters in the specified project (paged with pageNum / itemsPerPage)',
	},
	'flexClusters.tenantUpgrade': {
		riskLevel: 'write',
		description:
			'Upgrade One Flex Cluster: upgrades a flex cluster to a dedicated cluster (M10+) in the specified project',
	},
	'flexClusters.updateFlexCluster': {
		riskLevel: 'write',
		description:
			'Update One Flex Cluster in One Project: updates one flex cluster in the specified project',
	},
	'flexRestoreJobs.createFlexRestoreJob': {
		riskLevel: 'write',
		description:
			'Create One Restore Job for One Flex Cluster: restores one snapshot of one flex cluster from the specified project',
	},
	'flexRestoreJobs.getFlexRestoreJob': {
		riskLevel: 'read',
		description:
			'Return One Restore Job for One Flex Cluster: returns one restore job for one flex cluster from the specified project',
	},
	'flexRestoreJobs.listFlexRestoreJobs': {
		riskLevel: 'read',
		description:
			'Return All Restore Jobs for One Flex Cluster: returns all restore jobs for one flex cluster from the specified project (paged with pageNum / itemsPerPage)',
	},
	'flexSnapshots.downloadFlexBackup': {
		riskLevel: 'read',
		description:
			'Download One Flex Cluster Snapshot: requests one snapshot for the specified flex cluster',
	},
	'flexSnapshots.getFlexBackupSnapshot': {
		riskLevel: 'read',
		description:
			'Return One Snapshot for One Flex Cluster: returns one snapshot of one flex cluster from the specified project',
	},
	'flexSnapshots.listFlexBackupSnapshots': {
		riskLevel: 'read',
		description:
			'Return All Snapshots for One Flex Cluster: returns all snapshots of one flex cluster from the specified project (paged with pageNum / itemsPerPage)',
	},
	'globalClusters.createCustomZoneMapping': {
		riskLevel: 'write',
		description:
			'Add One Custom Zone Mapping to One Global Cluster: creates one custom zone mapping for the specified global cluster',
	},
	'globalClusters.createManagedNamespace': {
		riskLevel: 'write',
		description:
			'Create One Managed Namespace in One Global Cluster: creates one managed namespace within the specified global cluster',
	},
	'globalClusters.deleteCustomZoneMapping': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove All Custom Zone Mappings from One Global Cluster: removes all custom zone mappings for the specified global cluster',
	},
	'globalClusters.deleteManagedNamespaces': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Managed Namespace from One Global Cluster: removes one managed namespace within the specified global cluster',
	},
	'globalClusters.getClusterGlobalWrites': {
		riskLevel: 'read',
		description:
			'Return One Managed Namespace in One Global Cluster: returns one managed namespace within the specified global cluster',
	},
	'invoices.createCostExplorerProcess': {
		riskLevel: 'write',
		description:
			'Create One Cost Explorer Query Process: creates a query process within the Cost Explorer for the given parameters',
	},
	'invoices.createOrgInvoiceReport': {
		riskLevel: 'destructive',
		description:
			'Create One Invoice Report: requests asynchronous generation of a report for the specified invoice',
	},
	'invoices.getCostExplorerUsage': {
		riskLevel: 'read',
		description:
			'Return Usage Details for One Cost Explorer Query: returns the usage details for a Cost Explorer query, if the query is finished and the data is ready to be viewed',
	},
	'invoices.getInvoice': {
		riskLevel: 'read',
		description:
			'Return One Invoice for One Organization: returns one invoice that MongoDB issued to the specified organization',
	},
	'invoices.getInvoiceCsv': {
		riskLevel: 'read',
		description:
			'Return One Invoice as CSV for One Organization: returns one invoice that MongoDB issued to the specified organization in CSV format (returned as a file)',
	},
	'invoices.getOrgAssociatedInvoices': {
		riskLevel: 'read',
		description:
			'Return Associated Invoices: returns a list of invoice IDs for the specified organization and month/year',
	},
	'invoices.getOrgInvoiceReport': {
		riskLevel: 'read',
		description:
			'Return One Invoice Report: returns the status and details of a previously requested invoice report',
	},
	'invoices.getSku': {
		riskLevel: 'read',
		description:
			'Return One Stock Keeping Unit: returns details about a single SKU (Stock Keeping Unit) by its identifier',
	},
	'invoices.listInvoicePending': {
		riskLevel: 'read',
		description:
			'Return All Pending Invoices for One Organization: returns all invoices accruing charges for the current billing cycle for the specified organization',
	},
	'invoices.listInvoices': {
		riskLevel: 'read',
		description:
			'Return All Invoices for One Organization: returns all invoices that MongoDB issued to the specified organization (paged with pageNum / itemsPerPage)',
	},
	'invoices.listOrgInvoiceReports': {
		riskLevel: 'read',
		description:
			'Return All Invoice Reports for One Invoice: returns all unexpired reports for the specified invoice, newest first (paged with pageNum / itemsPerPage)',
	},
	'invoices.listSkuServices': {
		riskLevel: 'read',
		description:
			'Return All Stock Keeping Unit Services: returns all launched SKU services (paged with pageNum / itemsPerPage)',
	},
	'invoices.listSkus': {
		riskLevel: 'read',
		description:
			'Return All Stock Keeping Units: returns all available SKUs (Stock Keeping Units) that can appear on MongoDB invoices (paged with pageNum / itemsPerPage)',
	},
	'invoices.searchInvoiceLineItems': {
		riskLevel: 'read',
		description:
			'Return All Line Items for One Invoice by Invoice ID: query the `lineItems` of the specified invoice and return the result JSON (paged with pageNum / itemsPerPage)',
	},
	'ldapConfiguration.deleteLdapUserMapping': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove LDAP User to DN Mapping: removes the current LDAP Distinguished Name mapping captured in the ``userToDNMapping`` document from the LDAP configuration for the specified project',
	},
	'ldapConfiguration.getUserSecurity': {
		riskLevel: 'read',
		description:
			'Return LDAP or X.509 Configuration: returns the current LDAP configuration for the specified project',
	},
	'ldapConfiguration.getUserSecurityVerify': {
		riskLevel: 'read',
		description:
			'Return Status of LDAP Configuration Verification in One Project: returns the status of one request to verify one LDAP configuration for the specified project',
	},
	'ldapConfiguration.updateUserSecurity': {
		riskLevel: 'write',
		description:
			'Update LDAP or X.509 Configuration: edits the LDAP configuration for the specified project',
	},
	'ldapConfiguration.verifyUserSecurityLdap': {
		riskLevel: 'write',
		description:
			'Verify LDAP Configuration in One Project: verifies the LDAP configuration for the specified project',
	},
	'maintenanceWindows.deferMaintenanceWindow': {
		riskLevel: 'write',
		description:
			'Defer One Maintenance Window for One Project: defers the maintenance window for the specified project',
	},
	'maintenanceWindows.getMaintenanceWindow': {
		riskLevel: 'read',
		description:
			'Return One Maintenance Window for One Project: returns the maintenance window for the specified project',
	},
	'maintenanceWindows.resetMaintenanceWindow': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset One Maintenance Window for One Project: resets the maintenance window for the specified project',
	},
	'maintenanceWindows.toggleMaintenanceAutoDefer': {
		riskLevel: 'write',
		description:
			'Toggle Automatic Deferral of Maintenance for One Project: toggles automatic deferral of the maintenance window for the specified project',
	},
	'maintenanceWindows.updateMaintenanceWindow': {
		riskLevel: 'write',
		description:
			'Update One Maintenance Window for One Project: updates the maintenance window for the specified project',
	},
	'metricIntegrations.createGroupMetricIntegration': {
		riskLevel: 'write',
		description:
			'Create One Metric Integration: creates a new metric integration configuration identified by a unique ID',
	},
	'metricIntegrations.deleteGroupMetricIntegration': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Metric Integration: removes the configuration for one metric integration identified by its unique ID',
	},
	'metricIntegrations.getGroupMetricIntegration': {
		riskLevel: 'read',
		description:
			'Return One Metric Integration: returns the configuration for one metric integration identified by its unique ID',
	},
	'metricIntegrations.listGroupMetricIntegrations': {
		riskLevel: 'read',
		description:
			'Return All Active Metric Integrations: returns all metric integration configurations for the project (paged with pageNum / itemsPerPage)',
	},
	'metricIntegrations.updateGroupMetricIntegration': {
		riskLevel: 'write',
		description:
			'Update One Metric Integration: updates the configuration for one metric integration identified by its unique ID',
	},
	'mongoDbCloudUsers.addGroupUserRole': {
		riskLevel: 'write',
		description:
			'Add One Project Role to One MongoDB Cloud User: adds one project-level role to the MongoDB Cloud user',
	},
	'mongoDbCloudUsers.addGroupUsers': {
		riskLevel: 'write',
		description:
			'Add One MongoDB Cloud User to One Project: adds one MongoDB Cloud user to one project',
	},
	'mongoDbCloudUsers.addOrgRole': {
		riskLevel: 'destructive',
		description:
			'Add One Organization Role to One MongoDB Cloud User: adds one organization-level role to the MongoDB Cloud user',
	},
	'mongoDbCloudUsers.addOrgTeamUser': {
		riskLevel: 'write',
		description:
			'Add One MongoDB Cloud User to One Team: adds one MongoDB Cloud user to one team',
	},
	'mongoDbCloudUsers.createOrgUser': {
		riskLevel: 'destructive',
		description:
			'Add One MongoDB Cloud User to One Organization: invites one new or existing MongoDB Cloud user to join the organization',
	},
	'mongoDbCloudUsers.getGroupUser': {
		riskLevel: 'read',
		description:
			'Return One MongoDB Cloud User in One Project: returns information about the specified MongoDB Cloud user within the context of the specified project',
	},
	'mongoDbCloudUsers.getOrgUser': {
		riskLevel: 'read',
		description:
			'Return One MongoDB Cloud User in One Organization: returns information about the specified MongoDB Cloud user within the context of the specified organization',
	},
	'mongoDbCloudUsers.listGroupUsers': {
		riskLevel: 'read',
		description:
			'Return All MongoDB Cloud Users in One Project: returns details about the pending and active MongoDB Cloud users associated with the specified project (paged with pageNum / itemsPerPage)',
	},
	'mongoDbCloudUsers.listOrgUsers': {
		riskLevel: 'read',
		description:
			'Return All MongoDB Cloud Users in One Organization: returns details about the pending and active MongoDB Cloud users associated with the specified organization (paged with pageNum / itemsPerPage)',
	},
	'mongoDbCloudUsers.listTeamUsers': {
		riskLevel: 'read',
		description:
			'Return All MongoDB Cloud Users Assigned to One Team: returns details about the pending and active MongoDB Cloud users associated with the specified team in the organization (paged with pageNum / itemsPerPage)',
	},
	'mongoDbCloudUsers.removeGroupUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One MongoDB Cloud User from One Project: removes one MongoDB Cloud user from the specified project',
	},
	'mongoDbCloudUsers.removeGroupUserRole': {
		riskLevel: 'destructive',
		description:
			'Remove One Project Role from One MongoDB Cloud User: removes one project-level role from the MongoDB Cloud user',
	},
	'mongoDbCloudUsers.removeOrgRole': {
		riskLevel: 'destructive',
		description:
			'Remove One Organization Role from One MongoDB Cloud User: removes one organization-level role from the MongoDB Cloud user',
	},
	'mongoDbCloudUsers.removeOrgTeamUser': {
		riskLevel: 'destructive',
		description:
			'Remove One MongoDB Cloud User from One Team: removes one MongoDB Cloud user from one team',
	},
	'mongoDbCloudUsers.removeOrgUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One MongoDB Cloud User from One Organization: removes one MongoDB Cloud user in the specified organization',
	},
	'mongoDbCloudUsers.updateOrgUser': {
		riskLevel: 'write',
		description:
			'Update One MongoDB Cloud User in One Organization: updates one MongoDB Cloud user in the specified organization',
	},
	'monitoringAndLogs.downloadClusterLog': {
		riskLevel: 'read',
		description:
			'Download Logs for One Cluster Host in One Project: returns a compressed (.gz) log file that contains a range of log messages for the specified host for the specified project (returned as a file)',
	},
	'monitoringAndLogs.getDatabase': {
		riskLevel: 'read',
		description:
			'Return One Database for One MongoDB Process: returns one database running on the specified host for the specified project',
	},
	'monitoringAndLogs.getDatabaseMeasurements': {
		riskLevel: 'read',
		description:
			'Return Measurements for One Database in One MongoDB Process: returns the measurements of one database for the specified host for the specified project',
	},
	'monitoringAndLogs.getGroupProcess': {
		riskLevel: 'read',
		description:
			'Return One MongoDB Process by ID: returns the processes for the specified host for the specified project',
	},
	'monitoringAndLogs.getIndexMeasurements': {
		riskLevel: 'read',
		description:
			'Return Atlas Search Metrics for One Index in One Namespace: returns the Atlas Search metrics data series within the provided time range for one namespace and index name on the specified process',
	},
	'monitoringAndLogs.getProcessDisk': {
		riskLevel: 'read',
		description:
			'Return Measurements for One Disk: returns measurement details for one disk or partition for the specified host for the specified project',
	},
	'monitoringAndLogs.getProcessDiskMeasurements': {
		riskLevel: 'read',
		description:
			'Return Measurements of One Disk for One MongoDB Process: returns the measurements of one disk or partition for the specified host for the specified project',
	},
	'monitoringAndLogs.getProcessMeasurements': {
		riskLevel: 'read',
		description:
			'Return Measurements for One MongoDB Process: returns disk, partition, or host measurements per process for the specified host for the specified project',
	},
	'monitoringAndLogs.listDatabases': {
		riskLevel: 'read',
		description:
			'Return Available Databases for One MongoDB Process: returns the list of databases running on the specified host for the specified project (paged with pageNum / itemsPerPage)',
	},
	'monitoringAndLogs.listGroupProcesses': {
		riskLevel: 'read',
		description:
			'Return All MongoDB Processes in One Project: returns details of all processes for the specified project (paged with pageNum / itemsPerPage)',
	},
	'monitoringAndLogs.listHostFtsMetrics': {
		riskLevel: 'read',
		description:
			'Return All Atlas Search Metric Types for One Process: returns all Atlas Search metric types available for one process in the specified project',
	},
	'monitoringAndLogs.listIndexMeasurements': {
		riskLevel: 'read',
		description:
			'Return All Atlas Search Index Metrics for One Namespace: returns the Atlas Search index metrics within the specified time range for one namespace in the specified process',
	},
	'monitoringAndLogs.listMeasurements': {
		riskLevel: 'read',
		description:
			'Return Atlas Search Hardware and Status Metrics: returns the Atlas Search hardware and status data series within the provided time range for one process in the specified project',
	},
	'monitoringAndLogs.listProcessDisks': {
		riskLevel: 'read',
		description:
			'Return Available Disks for One MongoDB Process: returns the list of disks or partitions for the specified host for the specified project (paged with pageNum / itemsPerPage)',
	},
	'networkPeering.createGroupContainer': {
		riskLevel: 'write',
		description:
			'Create One Network Peering Container: creates one new network peering container in the specified project',
	},
	'networkPeering.createGroupPeer': {
		riskLevel: 'write',
		description:
			'Create One Network Peering Connection: creates one new network peering connection in the specified project',
	},
	'networkPeering.deleteGroupContainer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Network Peering Container: removes one network peering container in the specified project',
	},
	'networkPeering.deleteGroupPeer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Network Peering Connection: removes one network peering connection in the specified project',
	},
	'networkPeering.getGroupContainer': {
		riskLevel: 'read',
		description:
			'Return One Network Peering Container: returns details about one network peering container in one specified project',
	},
	'networkPeering.getGroupPeer': {
		riskLevel: 'read',
		description:
			'Return One Network Peering Connection in One Project: returns details about one specified network peering connection in the specified project',
	},
	'networkPeering.listGroupContainerAll': {
		riskLevel: 'read',
		description:
			'Return All Network Peering Containers in One Project: returns details about all network peering containers in the specified project (paged with pageNum / itemsPerPage)',
	},
	'networkPeering.listGroupContainers': {
		riskLevel: 'read',
		description:
			'Return All Network Peering Containers in One Project for One Cloud Provider: returns details about all network peering containers in the specified project for the specified cloud provider (paged with pageNum / itemsPerPage)',
	},
	'networkPeering.listGroupPeers': {
		riskLevel: 'read',
		description:
			'Return All Network Peering Connections in One Project: returns details about all network peering connections in the specified project (paged with pageNum / itemsPerPage)',
	},
	'networkPeering.updateGroupContainer': {
		riskLevel: 'write',
		description:
			'Update One Network Peering Container: updates the network details and labels of one specified network peering container in the specified project',
	},
	'networkPeering.updateGroupPeer': {
		riskLevel: 'write',
		description:
			'Update One Network Peering Connection: updates one specified network peering connection in the specified project',
	},
	'onlineArchive.createOnlineArchive': {
		riskLevel: 'destructive',
		description: 'Create One Online Archive: creates one online archive',
	},
	'onlineArchive.deleteOnlineArchive': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove One Online Archive: removes one online archive',
	},
	'onlineArchive.downloadQueryLogs': {
		riskLevel: 'read',
		description:
			'Download Online Archive Query Logs: downloads query logs for the specified online archive (returned as a file)',
	},
	'onlineArchive.getOnlineArchive': {
		riskLevel: 'read',
		description:
			'Return One Online Archive: returns one online archive for one cluster',
	},
	'onlineArchive.listOnlineArchives': {
		riskLevel: 'read',
		description:
			'Return All Online Archives for One Cluster: returns details of all online archives (paged with pageNum / itemsPerPage)',
	},
	'onlineArchive.updateOnlineArchive': {
		riskLevel: 'write',
		description:
			'Update One Online Archive: updates, pauses, or resumes one online archive',
	},
	'organizations.createOrg': {
		riskLevel: 'destructive',
		description:
			"Create One Organization: creates one organization in MongoDB Cloud and links it to the requesting Service Account's or API Key's organization",
	},
	'organizations.deleteOrg': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove One Organization: removes one specified organization',
	},
	'organizations.getOrg': {
		riskLevel: 'read',
		description:
			'Return One Organization: returns one organization to which the requesting Service Account or API Key has access',
	},
	'organizations.getOrgDelegationSettings': {
		riskLevel: 'read',
		description:
			'Return Delegation Settings for One Organization: returns the delegation settings for the specified organization',
	},
	'organizations.getOrgGroups': {
		riskLevel: 'read',
		description:
			'Return All Projects in One Organization: returns multiple projects in the specified organization (paged with pageNum / itemsPerPage)',
	},
	'organizations.getOrgMaintenanceSettings': {
		riskLevel: 'read',
		description:
			'Return Maintenance Settings for One Organization: returns maintenance settings for the specified organization',
	},
	'organizations.getOrgSettings': {
		riskLevel: 'read',
		description:
			"Return Settings for One Organization: returns details about the specified organization's settings",
	},
	'organizations.listOrgs': {
		riskLevel: 'read',
		description:
			'Return All Organizations: returns all organizations to which the requesting Service Account or API Key has access (paged with pageNum / itemsPerPage)',
	},
	'organizations.resetOrgMaintenanceSettings': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Reset Maintenance Settings for One Organization: resets maintenance settings for the specified organization to their default values',
	},
	'organizations.updateOrg': {
		riskLevel: 'write',
		description: 'Update One Organization: updates one organization',
	},
	'organizations.updateOrgDelegationSettings': {
		riskLevel: 'write',
		description:
			'Update Delegation Settings for One Organization: updates the delegation settings for the specified organization',
	},
	'organizations.updateOrgMaintenanceSettings': {
		riskLevel: 'write',
		description:
			'Update Maintenance Settings for One Organization: updates maintenance settings for the specified organization',
	},
	'organizations.updateOrgSettings': {
		riskLevel: 'destructive',
		description:
			"Update Settings for One Organization: updates the organization's settings",
	},
	'overloadProtectionSimulation.createClusterOverloadSimulation': {
		riskLevel: 'destructive',
		description:
			'Create One Overload Protection Simulation: starts an overload protection simulation for one cluster',
	},
	'overloadProtectionSimulation.deleteClusterOverloadSimulation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Overload Protection Simulation: deletes the overload protection simulation for one cluster',
	},
	'overloadProtectionSimulation.getClusterOverloadSimulation': {
		riskLevel: 'read',
		description:
			'Return One Overload Protection Simulation: returns the overload protection simulation for one cluster',
	},
	'overloadProtectionSimulation.listClusterOverloadSimulations': {
		riskLevel: 'read',
		description:
			'Return All Overload Protection Simulations: returns all overload protection simulations for one cluster (paged with pageNum / itemsPerPage)',
	},
	'performanceAdvisor.disableManagedSlowMs': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disable Managed Slow Operation Threshold: disables the slow operation threshold that MongoDB Cloud calculated for the specified project',
	},
	'performanceAdvisor.enableManagedSlowMs': {
		riskLevel: 'write',
		description:
			'Enable Managed Slow Operation Threshold: enables MongoDB Cloud to use its slow operation threshold for the specified project',
	},
	'performanceAdvisor.getManagedSlowMs': {
		riskLevel: 'read',
		description:
			'Return Managed Slow Operation Threshold Status: get whether the Managed Slow MS feature is enabled',
	},
	'performanceAdvisor.listClusterSuggestedIndexes': {
		riskLevel: 'read',
		description:
			'Return All Suggested Indexes: returns the indexes that the Performance Advisor suggests',
	},
	'performanceAdvisor.listDropIndexSuggestions': {
		riskLevel: 'read',
		description:
			'Return All Suggested Indexes to Drop: returns the indexes that the Performance Advisor suggests to drop',
	},
	'performanceAdvisor.listPerformanceAdvisorNamespaces': {
		riskLevel: 'read',
		description:
			'Return All Namespaces for One Host: returns up to 20 namespaces for collections experiencing slow queries on the specified host',
	},
	'performanceAdvisor.listSchemaAdvice': {
		riskLevel: 'read',
		description:
			'Return Schema Advice: returns the schema suggestions that the Performance Advisor detects',
	},
	'performanceAdvisor.listSlowQueryLogs': {
		riskLevel: 'read',
		description:
			'Return Slow Queries: returns log lines for slow queries that the Performance Advisor and Query Profiler identified',
	},
	'performanceAdvisor.listSuggestedIndexes': {
		riskLevel: 'read',
		description:
			'Return All Suggested Indexes: returns the indexes that the Performance Advisor suggests (paged with pageNum / itemsPerPage)',
	},
	'privateEndpointServices.createPrivateEndpoint': {
		riskLevel: 'destructive',
		description:
			'Create One Private Endpoint for One Provider: creates one private endpoint for the specified cloud service provider',
	},
	'privateEndpointServices.createPrivateEndpointService': {
		riskLevel: 'destructive',
		description:
			'Create One Private Endpoint Service for One Provider: creates one private endpoint service for the specified cloud service provider',
	},
	'privateEndpointServices.deletePrivateEndpoint': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Private Endpoint for One Provider: removes one private endpoint from the specified project and private endpoint service, as managed by the specified cloud service provider',
	},
	'privateEndpointServices.deletePrivateEndpointService': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Private Endpoint Service for One Provider: removes one private endpoint service from the specified project',
	},
	'privateEndpointServices.getPrivateEndpoint': {
		riskLevel: 'read',
		description:
			'Return One Private Endpoint for One Provider: returns the connection state of the specified private endpoint',
	},
	'privateEndpointServices.getPrivateEndpointService': {
		riskLevel: 'read',
		description:
			'Return One Private Endpoint Service for One Provider: returns the name, interfaces, and state of the specified private endpoint service from one project',
	},
	'privateEndpointServices.getRegionalEndpointMode': {
		riskLevel: 'read',
		description:
			'Return Regionalized Private Endpoint Status: checks whether each region in the specified cloud service provider can create multiple private endpoints per region',
	},
	'privateEndpointServices.listPrivateEndpointService': {
		riskLevel: 'read',
		description:
			'Return All Private Endpoint Services for One Provider: returns the name, interfaces, and state of all private endpoint services for the specified cloud service provider',
	},
	'privateEndpointServices.toggleRegionalEndpointMode': {
		riskLevel: 'write',
		description:
			'Toggle Regionalized Private Endpoint Status: enables or disables the ability to create multiple private endpoints per region in all cloud service providers in one project',
	},
	'privateEndpointServices.updatePrivateEndpointService': {
		riskLevel: 'write',
		description:
			'Update One Private Endpoint Service for One Provider: updates the specified private endpoint service for the project',
	},
	'programmaticApiKeys.addGroupApiKey': {
		riskLevel: 'write',
		description:
			'Assign One Organization API Key to One Project: assigns the specified organization API key to the specified project',
	},
	'programmaticApiKeys.createGroupApiKey': {
		riskLevel: 'destructive',
		description:
			'Create and Assign One Organization API Key to One Project: creates and assigns the specified organization API key to the specified project',
	},
	'programmaticApiKeys.createOrgAccessEntry': {
		riskLevel: 'destructive',
		description:
			'Create One Access List Entry for One Organization API Key: creates the access list entries for the specified organization API key (paged with pageNum / itemsPerPage)',
	},
	'programmaticApiKeys.createOrgApiKey': {
		riskLevel: 'destructive',
		description:
			'Create One Organization API Key: creates one API key for the specified organization',
	},
	'programmaticApiKeys.deleteAccessEntry': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Access List Entry for One Organization API Key: removes the specified access list entry from the specified organization API key',
	},
	'programmaticApiKeys.deleteOrgApiKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Organization API Key: removes one organization API key from the specified organization',
	},
	'programmaticApiKeys.getOrgAccessEntry': {
		riskLevel: 'read',
		description:
			'Return One Access List Entry for One Organization API Key: returns one access list entry for the specified organization API key',
	},
	'programmaticApiKeys.getOrgApiKey': {
		riskLevel: 'read',
		description:
			'Return One Organization API Key: returns one organization API key',
	},
	'programmaticApiKeys.listGroupApiKeys': {
		riskLevel: 'read',
		description:
			'Return All Organization API Keys Assigned to One Project: returns all organization API keys that you assigned to the specified project (paged with pageNum / itemsPerPage)',
	},
	'programmaticApiKeys.listOrgAccessEntries': {
		riskLevel: 'read',
		description:
			'Return All Access List Entries for One Organization API Key: returns all access list entries that you configured for the specified organization API key (paged with pageNum / itemsPerPage)',
	},
	'programmaticApiKeys.listOrgApiKeys': {
		riskLevel: 'read',
		description:
			'Return All Organization API Keys: returns all organization API keys for the specified organization (paged with pageNum / itemsPerPage)',
	},
	'programmaticApiKeys.removeGroupApiKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unassign One Organization API Key from One Project: removes one organization API key from the specified project',
	},
	'programmaticApiKeys.updateApiKeyRoles': {
		riskLevel: 'destructive',
		description:
			'Update Organization API Key Roles for One Project: updates the roles of the organization API key that you specify for the project that you specify (paged with pageNum / itemsPerPage)',
	},
	'programmaticApiKeys.updateOrgApiKey': {
		riskLevel: 'write',
		description:
			'Update One Organization API Key: updates one organization API key in the specified organization',
	},
	'projectIpAccessList.createAccessListEntry': {
		riskLevel: 'write',
		description:
			'Add Entries to Project IP Access List: adds one or more access list entries to the specified project (paged with pageNum / itemsPerPage)',
	},
	'projectIpAccessList.deleteAccessListEntry': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove One Entry from One Project IP Access List: removes one access list entry from the specified project's IP access list",
	},
	'projectIpAccessList.getAccessListEntry': {
		riskLevel: 'read',
		description:
			"Return One Project IP Access List Entry: returns one access list entry from the specified project's IP access list",
	},
	'projectIpAccessList.getAccessListStatus': {
		riskLevel: 'read',
		description:
			'Return Status of One Project IP Access List Entry: returns the status of one project IP access list entry',
	},
	'projectIpAccessList.listAccessListEntries': {
		riskLevel: 'read',
		description:
			"Return All Project IP Access List Entries: returns all access list entries from the specified project's IP access list (paged with pageNum / itemsPerPage)",
	},
	'projects.createGroup': {
		riskLevel: 'write',
		description: 'Create One Project: creates one project',
	},
	'projects.deleteGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove One Project: removes the specified project',
	},
	'projects.deleteGroupLimit': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Project Limit: removes the specified project limit',
	},
	'projects.getGroup': {
		riskLevel: 'read',
		description:
			'Return One Project: returns details about the specified project',
	},
	'projects.getGroupByName': {
		riskLevel: 'read',
		description:
			'Return One Project by Name: returns details about the specified project',
	},
	'projects.getGroupIpAddresses': {
		riskLevel: 'read',
		description:
			'Return All IP Addresses for One Project: returns all IP addresses for this project',
	},
	'projects.getGroupLimit': {
		riskLevel: 'read',
		description:
			'Return One Limit for One Project: returns the specified limit for the specified project',
	},
	'projects.getGroupSettings': {
		riskLevel: 'read',
		description:
			"Return Project Settings: returns details about the specified project's settings",
	},
	'projects.getMongoDbVersions': {
		riskLevel: 'read',
		description:
			'Return All Available MongoDB LTS Versions for Clusters in One Project: returns the MongoDB Long Term Support Major Versions available to new clusters in this project (paged with pageNum / itemsPerPage)',
	},
	'projects.listGroupLimits': {
		riskLevel: 'read',
		description:
			'Return All Limits for One Project: returns all the limits for the specified project',
	},
	'projects.listGroups': {
		riskLevel: 'read',
		description:
			'Return All Projects: returns details about all projects (paged with pageNum / itemsPerPage)',
	},
	'projects.migrateGroup': {
		riskLevel: 'write',
		description:
			'Migrate One Project to Another Organization: migrates a project from its current organization to another organization',
	},
	'projects.setGroupLimit': {
		riskLevel: 'write',
		description: 'Set One Project Limit: sets the specified project limit',
	},
	'projects.updateGroup': {
		riskLevel: 'write',
		description:
			'Update One Project: updates the human-readable label that identifies the specified project, or the tags associated with the project',
	},
	'projects.updateGroupSettings': {
		riskLevel: 'write',
		description:
			'Update Project Settings: updates the settings of the specified project',
	},
	'pushBasedLogExport.createGroupLogIntegration': {
		riskLevel: 'write',
		description:
			'Create One Log Integration: creates a new log integration configuration identified by a unique ID',
	},
	'pushBasedLogExport.createOrgLogIntegration': {
		riskLevel: 'destructive',
		description:
			'Create One Organization Log Integration: creates a new organization-level log integration configuration identified by a unique ID',
	},
	'pushBasedLogExport.deleteGroupLogIntegration': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Log Integration: removes the configuration for one log integration identified by its unique ID',
	},
	'pushBasedLogExport.deleteOrgLogIntegration': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Organization Log Integration: removes one organization-level log integration configuration identified by its unique ID',
	},
	'pushBasedLogExport.getGroupLogIntegration': {
		riskLevel: 'read',
		description:
			'Return One Log Integration: returns the configuration for one log integration identified by its unique ID',
	},
	'pushBasedLogExport.getOrgLogIntegration': {
		riskLevel: 'read',
		description:
			'Return One Organization Log Integration: returns the configuration for one organization-level log integration identified by its unique ID',
	},
	'pushBasedLogExport.listGroupLogIntegrations': {
		riskLevel: 'read',
		description:
			'Return All Active Log Integrations: returns all log integration configurations for the project (paged with pageNum / itemsPerPage)',
	},
	'pushBasedLogExport.listOrgLogIntegrations': {
		riskLevel: 'read',
		description:
			'Return All Organization Log Integrations: returns all log integration configurations for the organization (paged with pageNum / itemsPerPage)',
	},
	'pushBasedLogExport.updateGroupLogIntegration': {
		riskLevel: 'write',
		description:
			'Update One Log Integration: updates the configuration for one log integration identified by its unique ID',
	},
	'pushBasedLogExport.updateOrgLogIntegration': {
		riskLevel: 'write',
		description:
			'Update One Organization Log Integration: updates one organization-level log integration configuration identified by its unique ID',
	},
	'querySampling.createClusterQuerySampling': {
		riskLevel: 'destructive',
		description:
			'Create Query Sampling for One Namespace: starts query sampling on one namespace of the specified cluster',
	},
	'querySampling.deleteClusterQuerySampling': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove Query Sampling from One Namespace: stops query sampling on one namespace of the specified cluster',
	},
	'querySampling.getClusterQuerySampling': {
		riskLevel: 'read',
		description:
			'Return Query Sampling State for One Namespace: returns the query sampling state of one namespace of the specified cluster, including counters for the operations sampled so far',
	},
	'queryShapeInsights.getClusterQueryShape': {
		riskLevel: 'read',
		description:
			'Return One Query Shape: returns the details for a single query shape',
	},
	'queryShapeInsights.getQueryShapeDetails': {
		riskLevel: 'read',
		description:
			'Return Query Shape Details: returns the metadata and statistics summary for a given query shape hash',
	},
	'queryShapeInsights.listClusterQueryShapes': {
		riskLevel: 'read',
		description:
			'Return All Query Shapes: returns a list of query shapes for one cluster (paged with pageNum / itemsPerPage)',
	},
	'queryShapeInsights.listQueryShapeSummaries': {
		riskLevel: 'read',
		description:
			'Return Query Statistic Summaries: returns a list of query shape statistics summaries for a given cluster',
	},
	'queryShapeInsights.updateClusterQueryShape': {
		riskLevel: 'write',
		description:
			'Update Query Shape Rejection Status: updates the rejection status of a query shape',
	},
	'rateLimiting.getRateLimit': {
		riskLevel: 'read',
		description: 'Return One Rate Limit: get one rate limit endpoint set',
	},
	'rateLimiting.listRateLimits': {
		riskLevel: 'read',
		description:
			'Return All Rate Limits: get all rate limits for all v2 Atlas Administration API endpoint sets (paged with pageNum / itemsPerPage)',
	},
	'remoteMcpConfigurations.createGroupMcpConfig': {
		riskLevel: 'write',
		description:
			'Create One MCP Configuration for One Project: creates an MCP configuration for the specified project',
	},
	'remoteMcpConfigurations.createGroupMcpSecret': {
		riskLevel: 'write',
		description:
			'Create One Secret for One Project MCP Configuration: creates a new secret on the ingress service account of the specified project-level MCP configuration',
	},
	'remoteMcpConfigurations.createOrgMcpConfig': {
		riskLevel: 'destructive',
		description:
			'Create One MCP Configuration for One Organization: creates an MCP configuration for the specified organization',
	},
	'remoteMcpConfigurations.createOrgMcpSecret': {
		riskLevel: 'destructive',
		description:
			'Create One Secret for One Organization MCP Configuration: creates a new secret on the ingress service account of the specified organization-level MCP configuration',
	},
	'remoteMcpConfigurations.deleteGroupMcpConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One MCP Configuration for One Project: deletes the MCP configuration with the specified ID for the specified project',
	},
	'remoteMcpConfigurations.deleteGroupMcpSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Secret for One Project MCP Configuration: deletes the specified secret from the ingress service account of the specified project-level MCP configuration',
	},
	'remoteMcpConfigurations.deleteOrgMcpConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One MCP Configuration for One Organization: deletes the MCP configuration with the specified ID for the specified organization',
	},
	'remoteMcpConfigurations.deleteOrgMcpSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Secret for One Organization MCP Configuration: deletes the specified secret from the ingress service account of the specified organization-level MCP configuration',
	},
	'remoteMcpConfigurations.getGroupMcpConfig': {
		riskLevel: 'read',
		description:
			'Return One MCP Configuration for One Project: returns the MCP configuration with the specified ID for the specified project',
	},
	'remoteMcpConfigurations.getGroupMcpSecret': {
		riskLevel: 'read',
		description:
			'Return One Secret for One Project MCP Configuration: returns metadata for the specified secret on the ingress service account of a project-level MCP configuration',
	},
	'remoteMcpConfigurations.getOrgMcpConfig': {
		riskLevel: 'read',
		description:
			'Return One MCP Configuration for One Organization: returns the MCP configuration with the specified ID for the specified organization',
	},
	'remoteMcpConfigurations.getOrgMcpSecret': {
		riskLevel: 'read',
		description:
			'Return One Secret for One Organization MCP Configuration: returns metadata for the specified secret on the ingress service account of an organization-level MCP configuration',
	},
	'remoteMcpConfigurations.listGroupMcpConfigs': {
		riskLevel: 'read',
		description:
			'Return All MCP Configurations for One Project: returns all MCP configurations associated with the specified project (paged with pageNum / itemsPerPage)',
	},
	'remoteMcpConfigurations.listGroupMcpSecrets': {
		riskLevel: 'read',
		description:
			'Return All Secrets for One Project MCP Configuration: returns metadata for all secrets on the ingress service account of the specified project-level MCP configuration (paged with pageNum / itemsPerPage)',
	},
	'remoteMcpConfigurations.listOrgMcpConfigs': {
		riskLevel: 'read',
		description:
			'Return All MCP Configurations for One Organization: returns all MCP configurations associated with the specified organization (paged with pageNum / itemsPerPage)',
	},
	'remoteMcpConfigurations.listOrgMcpSecrets': {
		riskLevel: 'read',
		description:
			'Return All Secrets for One Organization MCP Configuration: returns metadata for all secrets on the ingress service account of the specified organization-level MCP configuration (paged with pageNum / itemsPerPage)',
	},
	'remoteMcpConfigurations.updateGroupMcpConfig': {
		riskLevel: 'write',
		description:
			'Update One MCP Configuration for One Project: updates the specified MCP configuration for the project',
	},
	'remoteMcpConfigurations.updateOrgMcpConfig': {
		riskLevel: 'write',
		description:
			'Update One MCP Configuration for One Organization: updates the specified MCP configuration for the organization',
	},
	'resourcePolicies.createOrgResourcePolicy': {
		riskLevel: 'destructive',
		description:
			'Create One Atlas Resource Policy: create one Atlas Resource Policy for an organization',
	},
	'resourcePolicies.deleteOrgResourcePolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Atlas Resource Policy: delete one Atlas Resource Policy for an organization',
	},
	'resourcePolicies.getNonCompliantResources': {
		riskLevel: 'read',
		description:
			'Return All Non-Compliant Resources: return all non-compliant resources for an organization',
	},
	'resourcePolicies.getOrgResourcePolicy': {
		riskLevel: 'read',
		description:
			'Return One Atlas Resource Policy: return one Atlas Resource Policy for an organization',
	},
	'resourcePolicies.listOrgResourcePolicies': {
		riskLevel: 'read',
		description:
			'Return All Atlas Resource Policies: return all Atlas Resource Policies for the organization',
	},
	'resourcePolicies.updateOrgResourcePolicy': {
		riskLevel: 'write',
		description:
			'Update One Atlas Resource Policy: update one Atlas Resource Policy for an organization',
	},
	'resourcePolicies.validateResourcePolicies': {
		riskLevel: 'read',
		description:
			'Validate One Atlas Resource Policy: validate one Atlas Resource Policy for an organization',
	},
	'rollingIndex.createRollingIndex': {
		riskLevel: 'destructive',
		description:
			'Create One Rolling Index: creates an index on the cluster identified by its name in a rolling manner',
	},
	'root.getSystemStatus': {
		riskLevel: 'read',
		description:
			'Return the Status of This MongoDB Application: this resource returns information about the MongoDB application along with API key meta data',
	},
	'root.listControlPlaneAddresses': {
		riskLevel: 'read',
		description:
			'Return All Control Plane IP Addresses: returns all control plane IP addresses',
	},
	'serviceAccounts.createAccessList': {
		riskLevel: 'write',
		description:
			'Add Access List Entries for One Project Service Account: add Access List Entries for the specified Service Account for the project (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.createGroupSecret': {
		riskLevel: 'destructive',
		description:
			'Create One Project Service Account Secret: create a secret for the specified Service Account in the specified Project',
	},
	'serviceAccounts.createGroupServiceAccount': {
		riskLevel: 'destructive',
		description:
			'Create One Project Service Account: creates one Service Account for the specified Project',
	},
	'serviceAccounts.createOrgAccessList': {
		riskLevel: 'destructive',
		description:
			'Add Access List Entries for One Organization Service Account: add Access List Entries for the specified Service Account for the organization (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.createOrgSecret': {
		riskLevel: 'destructive',
		description:
			'Create One Organization Service Account Secret: create a secret for the specified Service Account',
	},
	'serviceAccounts.createOrgServiceAccount': {
		riskLevel: 'destructive',
		description:
			'Create One Organization Service Account: creates one Service Account for the specified Organization',
	},
	'serviceAccounts.deleteGroupAccessEntry': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Access List Entry from One Project Service Account: removes the specified access list entry from the specified Service Account for the project',
	},
	'serviceAccounts.deleteGroupSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Project Service Account Secret: deletes the specified Service Account secret',
	},
	'serviceAccounts.deleteGroupServiceAccount': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Project Service Account: removes the specified Service Account from the specified project',
	},
	'serviceAccounts.deleteOrgAccessEntry': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Access List Entry from One Organization Service Account: removes the specified access list entry from the specified Service Account for the organization',
	},
	'serviceAccounts.deleteOrgSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Organization Service Account Secret: deletes the specified Service Account secret',
	},
	'serviceAccounts.deleteOrgServiceAccount': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Organization Service Account: deletes the specified Service Account',
	},
	'serviceAccounts.getGroupServiceAccount': {
		riskLevel: 'read',
		description:
			'Return One Project Service Account: returns one Service Account in the specified Project',
	},
	'serviceAccounts.getOrgServiceAccount': {
		riskLevel: 'read',
		description:
			'Return One Organization Service Account: returns the specified Service Account',
	},
	'serviceAccounts.getServiceAccountGroups': {
		riskLevel: 'read',
		description:
			'Return All Service Account Project Assignments: returns a list of all projects the specified Service Account is a part of (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.inviteGroupServiceAccount': {
		riskLevel: 'destructive',
		description:
			'Assign One Service Account to One Project: assigns the specified Service Account to the specified Project',
	},
	'serviceAccounts.listAccessList': {
		riskLevel: 'read',
		description:
			'Return All Access List Entries for One Project Service Account: returns all access list entries that you configured for the specified Service Account for the project (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.listGroupServiceAccounts': {
		riskLevel: 'read',
		description:
			'Return All Project Service Accounts: returns all Service Accounts for the specified Project (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.listOrgAccessList': {
		riskLevel: 'read',
		description:
			'Return All Access List Entries for One Organization Service Account: returns all access list entries that you configured for the specified Service Account for the organization (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.listOrgServiceAccounts': {
		riskLevel: 'read',
		description:
			'Return All Organization Service Accounts: returns all Service Accounts for the specified Organization (paged with pageNum / itemsPerPage)',
	},
	'serviceAccounts.updateGroupServiceAccount': {
		riskLevel: 'write',
		description:
			'Update One Project Service Account: updates one Service Account in the specified Project',
	},
	'serviceAccounts.updateOrgServiceAccount': {
		riskLevel: 'write',
		description:
			'Update One Organization Service Account: updates the specified Service Account in the specified Organization',
	},
	'shardKeyAnalyzer.createShardKeyAnalysis': {
		riskLevel: 'write',
		description:
			'Create One Shard Key Analysis for One Cluster: analyzes how well one candidate shard key would distribute one collection across the shards of the specified cluster',
	},
	'shardKeyAnalyzer.getAnalysisOperation': {
		riskLevel: 'read',
		description:
			'Return One Shard Key Analysis Operation for One Cluster: returns the progress of one shard key analysis for the specified cluster',
	},
	'shardKeyAnalyzer.getShardKeyAnalysis': {
		riskLevel: 'read',
		description:
			'Return One Shard Key Analysis for One Cluster: returns one completed shard key analysis for the specified cluster',
	},
	'shardKeyAnalyzer.listAnalysisOperations': {
		riskLevel: 'read',
		description:
			'Return All Shard Key Analysis Operations for One Cluster: returns every shard key analysis attempt for the specified cluster, newest first, including attempts that are still running and attempts that failed (paged with pageNum / itemsPerPage)',
	},
	'shardKeyAnalyzer.listShardKeyAnalyses': {
		riskLevel: 'read',
		description:
			'Return All Shard Key Analyses for One Cluster: returns all completed shard key analyses for the specified cluster, newest first (paged with pageNum / itemsPerPage)',
	},
	'shardingInsights.getClusterShardMetric': {
		riskLevel: 'read',
		description:
			'Return One Shard in One Cluster: returns the size, load and open alerts of one shard in one sharded cluster',
	},
	'shardingInsights.getClusterShardingInsights': {
		riskLevel: 'read',
		description:
			'Return Sharding Insights for One Cluster: returns the cluster-level sharding state of one sharded cluster: the number of shards, the balancer state, the availability of the config servers, and the configured balancing window',
	},
	'shardingInsights.getShardMetricMeasurements': {
		riskLevel: 'read',
		description:
			'Return Measurements for One Shard: returns time series of the requested measurements for one shard of the specified sharded cluster',
	},
	'shardingInsights.listClusterShardMetrics': {
		riskLevel: 'read',
		description:
			'Return All Shards in One Cluster: returns the size and load of every shard in one sharded cluster (paged with pageNum / itemsPerPage)',
	},
	'shardingInsights.listShardMetricMeasurements': {
		riskLevel: 'read',
		description:
			'Return Measurements for All Shards of One Cluster: returns time series of the requested measurements for every shard of the specified sharded cluster, one series per shard and measurement',
	},
	'shardingRecommendations.getClusterShardingRecommendations': {
		riskLevel: 'read',
		description:
			'Return Sharding Recommendations for One Cluster: returns the active Sharding Advisor recommendations for one cluster',
	},
	'streams.acceptVpcPeeringConnection': {
		riskLevel: 'write',
		description:
			'Accept One Incoming VPC Peering Connection: requests the acceptance of an incoming VPC Peering connection',
	},
	'streams.createFailoverConnection': {
		riskLevel: 'write',
		description:
			'Create One Failover Stream Connection: creates one failover connection for a stream workspace in the specified project',
	},
	'streams.createPrivateLinkConnection': {
		riskLevel: 'destructive',
		description:
			'Create One Private Link Connection: creates one Private Link in the specified project',
	},
	'streams.createStreamConnection': {
		riskLevel: 'destructive',
		description:
			'Create One Stream Connection: creates one connection for a stream workspace in the specified project',
	},
	'streams.createStreamProcessor': {
		riskLevel: 'destructive',
		description:
			'Create One Stream Processor: create one Stream Processor within the specified stream workspace',
	},
	'streams.createStreamWorkspace': {
		riskLevel: 'destructive',
		description:
			'Create One Stream Workspace: creates one stream workspace in the specified project',
	},
	'streams.createWorkspacePrivateEndpoint': {
		riskLevel: 'write',
		description:
			'Create One Workspace Private Endpoint for Atlas Stream Processing: registers one VPC endpoint for Atlas Stream Processing in the specified project',
	},
	'streams.deletePrivateLinkConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Private Link Connection: deletes one Private Link in the specified project',
	},
	'streams.deleteStreamConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Stream Connection: delete one connection of the specified stream workspace',
	},
	'streams.deleteStreamFailoverConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Stream Failover Connection: delete one failover connection of the specified stream workspace',
	},
	'streams.deleteStreamProcessor': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Stream Processor: delete a Stream Processor within the specified stream workspace',
	},
	'streams.deleteStreamWorkspace': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One Stream Workspace: delete one stream workspace in the specified project',
	},
	'streams.deleteVpcPeeringConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete One VPC Peering Connection: deletes an incoming VPC Peering connection',
	},
	'streams.deleteWorkspacePrivateEndpoint': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Workspace Private Endpoint for Atlas Stream Processing: removes one private endpoint registered for Atlas Stream Processing in the specified project',
	},
	'streams.downloadAuditLogs': {
		riskLevel: 'read',
		description:
			'Download Audit Logs for One Atlas Stream Processing Workspace: downloads the audit logs for the specified Atlas Streams Processing workspace or stream processor (returned as a file)',
	},
	'streams.downloadOperationalLogs': {
		riskLevel: 'read',
		description:
			'Download Operational Logs for One Atlas Stream Processing Workspace: downloads the operational logs for the specified Atlas Streams Processing workspace or stream processor (returned as a file)',
	},
	'streams.getAccountDetails': {
		riskLevel: 'read',
		description:
			'Return Account ID and VPC ID for One Project and Region: returns the Account ID, and the VPC ID for the group and region specified',
	},
	'streams.getPrivateLinkConnection': {
		riskLevel: 'read',
		description:
			'Return One Private Link Connection: returns the details of one Private Link connection within the project',
	},
	'streams.getStreamConnection': {
		riskLevel: 'read',
		description:
			'Return One Stream Connection: returns the details of one stream connection within the specified stream workspace',
	},
	'streams.getStreamFailoverConnection': {
		riskLevel: 'read',
		description:
			'Return One Stream Failover Connection: get one failover connection of the specified stream workspace',
	},
	'streams.getStreamProcessor': {
		riskLevel: 'read',
		description:
			'Return One Stream Processor: get one Stream Processor within the specified stream workspace',
	},
	'streams.getStreamProcessors': {
		riskLevel: 'read',
		description:
			'Return All Stream Processors in One Stream Workspace: returns all Stream Processors within the specified stream workspace, including information on which processors are failover-eligible (paged with pageNum / itemsPerPage)',
	},
	'streams.getStreamWorkspace': {
		riskLevel: 'read',
		description:
			'Return One Stream Workspace: returns the details of one stream workspace within the specified project',
	},
	'streams.getWorkspacePrivateEndpoint': {
		riskLevel: 'read',
		description:
			'Return One Workspace Private Endpoint for Atlas Stream Processing: returns one private endpoint registered for Atlas Stream Processing in the specified project',
	},
	'streams.listActivePeeringConnections': {
		riskLevel: 'read',
		description:
			'Return All Active Incoming VPC Peering Connections: returns a list of active incoming VPC Peering Connections (paged with pageNum / itemsPerPage)',
	},
	'streams.listFailoverConnections': {
		riskLevel: 'read',
		description:
			'Return All Stream Failover Connections: returns all failover connections for the specified connection in a stream workspace (paged with pageNum / itemsPerPage)',
	},
	'streams.listPrivateLinkConnections': {
		riskLevel: 'read',
		description:
			'Return All Private Link Connections: returns all Private Link connections for the specified project (paged with pageNum / itemsPerPage)',
	},
	'streams.listStreamConnections': {
		riskLevel: 'read',
		description:
			'Return All Connections of the Stream Workspaces: returns all connections of the stream workspace for the specified project (paged with pageNum / itemsPerPage)',
	},
	'streams.listStreamWorkspaces': {
		riskLevel: 'read',
		description:
			'Return All Stream Workspaces in One Project: returns all stream workspaces for the specified project (paged with pageNum / itemsPerPage)',
	},
	'streams.listVpcPeeringConnections': {
		riskLevel: 'read',
		description:
			'Return All VPC Peering Connections: returns a list of incoming VPC Peering Connections (paged with pageNum / itemsPerPage)',
	},
	'streams.listWorkspacePrivateEndpoints': {
		riskLevel: 'read',
		description:
			'Return All Workspace Private Endpoints for Atlas Stream Processing: returns all private endpoints registered for Atlas Stream Processing in the specified project (paged with pageNum / itemsPerPage)',
	},
	'streams.rejectVpcPeeringConnection': {
		riskLevel: 'write',
		description:
			'Reject One Incoming VPC Peering Connection: requests the rejection of an incoming VPC Peering connection',
	},
	'streams.startStreamProcessor': {
		riskLevel: 'destructive',
		description:
			'Start One Stream Processor: start a Stream Processor within the specified stream workspace',
	},
	'streams.startStreamProcessorWith': {
		riskLevel: 'destructive',
		description:
			'Start One Stream Processor With Options: start a Stream Processor within the specified stream workspace',
	},
	'streams.stopStreamProcessor': {
		riskLevel: 'write',
		description:
			'Stop One Stream Processor: stop a Stream Processor within the specified stream workspace',
	},
	'streams.updatePrivateLinkConnection': {
		riskLevel: 'write',
		description:
			'Update One Private Link Connection: updates one Private Link connection in the specified project',
	},
	'streams.updateStreamConnection': {
		riskLevel: 'write',
		description:
			'Update One Stream Connection: update one connection for the specified stream workspace in the specified project',
	},
	'streams.updateStreamFailoverConnection': {
		riskLevel: 'write',
		description:
			'Update One Stream Failover Connection: update one failover connection of the specified stream workspace',
	},
	'streams.updateStreamProcessor': {
		riskLevel: 'write',
		description:
			'Update One Stream Processor: modify one existing Stream Processor within the specified stream workspace',
	},
	'streams.updateStreamWorkspace': {
		riskLevel: 'write',
		description:
			'Update One Stream Workspace: update one stream workspace in the specified project',
	},
	'streams.withStreamSampleConnections': {
		riskLevel: 'write',
		description:
			'Create One Stream Workspace with Sample Connections: creates one stream workspace in the specified project with sample connections',
	},
	'teams.addGroupTeams': {
		riskLevel: 'write',
		description:
			'Add Multiple Teams to One Project: adds multiple teams to the specified project',
	},
	'teams.createOrgTeam': {
		riskLevel: 'destructive',
		description:
			'Create One Team in One Organization: creates one team in the specified organization',
	},
	'teams.deleteOrgTeam': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Team from One Organization: removes one team specified using its unique 24-hexadecimal digit identifier from the organization specified using its unique 24-hexadecimal digit identifier',
	},
	'teams.getGroupTeam': {
		riskLevel: 'read',
		description:
			'Return One Team in One Project: returns one team to which the authenticated user has access in the project specified using its unique 24-hexadecimal digit identifier',
	},
	'teams.getOrgTeam': {
		riskLevel: 'read',
		description:
			'Return One Team by ID: returns one team that you identified using its unique 24-hexadecimal digit ID',
	},
	'teams.getTeamByName': {
		riskLevel: 'read',
		description:
			'Return One Team by Name: returns one team that you identified using its human-readable name',
	},
	'teams.listGroupTeams': {
		riskLevel: 'read',
		description:
			'Return All Teams in One Project: returns all teams to which the authenticated user has access in the project specified using its unique 24-hexadecimal digit identifier (paged with pageNum / itemsPerPage)',
	},
	'teams.listOrgTeams': {
		riskLevel: 'read',
		description:
			'Return All Teams in One Organization: returns all teams that belong to the specified organization (paged with pageNum / itemsPerPage)',
	},
	'teams.removeGroupTeam': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Team from One Project: removes one team specified using its unique 24-hexadecimal digit identifier from the project specified using its unique 24-hexadecimal digit identifier',
	},
	'teams.renameOrgTeam': {
		riskLevel: 'write',
		description:
			'Rename One Team: renames one team in the specified organization',
	},
	'teams.updateGroupTeam': {
		riskLevel: 'write',
		description:
			'Update Team Roles in One Project: updates the project roles assigned to the specified team',
	},
	'thirdPartyIntegrations.createGroupIntegration': {
		riskLevel: 'write',
		description:
			'Create One Third-Party Service Integration: adds the settings for configuring one third-party service integration (paged with pageNum / itemsPerPage)',
	},
	'thirdPartyIntegrations.deleteGroupIntegration': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove One Third-Party Service Integration: removes the settings that permit configuring one third-party service integration',
	},
	'thirdPartyIntegrations.getGroupIntegration': {
		riskLevel: 'read',
		description:
			'Return One Third-Party Service Integration: returns the settings for configuring integration with one third-party service',
	},
	'thirdPartyIntegrations.listGroupIntegrations': {
		riskLevel: 'read',
		description:
			'Return All Active Third-Party Service Integrations: returns the settings that permit integrations with all configured third-party services (paged with pageNum / itemsPerPage)',
	},
	'thirdPartyIntegrations.updateGroupIntegration': {
		riskLevel: 'write',
		description:
			'Update One Third-Party Service Integration: updates the settings for configuring integration with one third-party service (paged with pageNum / itemsPerPage)',
	},
	'x509Authentication.createDatabaseUserCert': {
		riskLevel: 'write',
		description:
			'Create One X.509 Certificate for One Database User: generates one X.509 certificate for the specified MongoDB user',
	},
	'x509Authentication.disableSecurityCustomerX509': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disable Customer-Managed X.509: clears the customer-managed X.509 settings on a project, including the uploaded Certificate Authority, which disables self-managed X.509',
	},
	'x509Authentication.listDatabaseUserCerts': {
		riskLevel: 'read',
		description:
			'Return All X.509 Certificates Assigned to One Database User: returns all unexpired X.509 certificates for the specified MongoDB user (paged with pageNum / itemsPerPage)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mongodbatlasEndpointsNested
>;
