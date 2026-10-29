import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Apps,
	Catalog,
	Cleanrooms,
	Compute,
	Dashboards,
	Database,
	Dataquality,
	Dbfs,
	Iam,
	Jobs,
	Marketplace,
	Ml,
	Security,
	Serving,
	Sharing,
	Sql,
	Workspace,
} from './endpoints';
import type {
	DatabricksEndpointInputs,
	DatabricksEndpointOutputs,
} from './endpoints/types';
import {
	DatabricksEndpointInputSchemas,
	DatabricksEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { DatabricksSchema } from './schema';
import { resolveDatabricksOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDatabricksTenantWebhook } from './webhooks/tenant-matcher';

export type DatabricksPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	host?: string;
	webhookSecret?: string;
	hooks?: InternalDatabricksPlugin['hooks'];
	webhookHooks?: InternalDatabricksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof databricksEndpointsNested>;
};

export type DatabricksContext = CorsairPluginContext<
	typeof DatabricksSchema,
	DatabricksPluginOptions
>;

export type DatabricksKeyBuilderContext =
	KeyBuilderContext<DatabricksPluginOptions>;

export type DatabricksBoundEndpoints = BindEndpoints<
	typeof databricksEndpointsNested
>;

type DatabricksEndpoint<K extends keyof DatabricksEndpointOutputs> =
	CorsairEndpoint<
		DatabricksContext,
		DatabricksEndpointInputs[K],
		DatabricksEndpointOutputs[K]
	>;

export type DatabricksEndpoints = {
	// DBFS
	addBlockToDbfsStream: DatabricksEndpoint<'addBlockToDbfsStream'>;
	createDbfsFileStream: DatabricksEndpoint<'createDbfsFileStream'>;
	deleteDbfsFileOrDirectory: DatabricksEndpoint<'deleteDbfsFileOrDirectory'>;

	// Compute
	addComputeInstanceProfile: DatabricksEndpoint<'addComputeInstanceProfile'>;
	createComputeClusterPolicy: DatabricksEndpoint<'createComputeClusterPolicy'>;
	createComputeInstancePool: DatabricksEndpoint<'createComputeInstancePool'>;
	createDatabricksCluster: DatabricksEndpoint<'createDatabricksCluster'>;
	createGlobalInitScript: DatabricksEndpoint<'createGlobalInitScript'>;
	deleteComputeClusterPolicy: DatabricksEndpoint<'deleteComputeClusterPolicy'>;
	deleteComputeInstancePool: DatabricksEndpoint<'deleteComputeInstancePool'>;
	deleteDatabricksCluster: DatabricksEndpoint<'deleteDatabricksCluster'>;
	deleteGlobalInitScript: DatabricksEndpoint<'deleteGlobalInitScript'>;

	// IAM & Security
	addMemberToSecurityGroup: DatabricksEndpoint<'addMemberToSecurityGroup'>;
	createIamGroupV2: DatabricksEndpoint<'createIamGroupV2'>;
	createIamServicePrincipalV2: DatabricksEndpoint<'createIamServicePrincipalV2'>;
	createIamUserV2: DatabricksEndpoint<'createIamUserV2'>;
	createIpAccessList: DatabricksEndpoint<'createIpAccessList'>;
	deleteIamGroupV2: DatabricksEndpoint<'deleteIamGroupV2'>;
	deleteIamServicePrincipalV2: DatabricksEndpoint<'deleteIamServicePrincipalV2'>;
	deleteIamUserV2: DatabricksEndpoint<'deleteIamUserV2'>;

	// Catalog
	assignMetastoreToWorkspace: DatabricksEndpoint<'assignMetastoreToWorkspace'>;
	batchCreateAccessRequests: DatabricksEndpoint<'batchCreateAccessRequests'>;
	checkTableExists: DatabricksEndpoint<'checkTableExists'>;
	createCatalogConnection: DatabricksEndpoint<'createCatalogConnection'>;
	createCatalogCredential: DatabricksEndpoint<'createCatalogCredential'>;
	createExternalLocation: DatabricksEndpoint<'createExternalLocation'>;
	createMetastore: DatabricksEndpoint<'createMetastore'>;
	createStorageCredential: DatabricksEndpoint<'createStorageCredential'>;
	deleteCatalog: DatabricksEndpoint<'deleteCatalog'>;
	deleteCatalogConnection: DatabricksEndpoint<'deleteCatalogConnection'>;
	deleteCatalogCredential: DatabricksEndpoint<'deleteCatalogCredential'>;
	deleteCatalogTable: DatabricksEndpoint<'deleteCatalogTable'>;
	deleteExternalLocation: DatabricksEndpoint<'deleteExternalLocation'>;
	deleteMetastore: DatabricksEndpoint<'deleteMetastore'>;
	deleteOnlineTable: DatabricksEndpoint<'deleteOnlineTable'>;
	deleteStorageCredential: DatabricksEndpoint<'deleteStorageCredential'>;
	disableSystemSchema: DatabricksEndpoint<'disableSystemSchema'>;

	// Marketplace
	batchGetMarketplaceConsumerListings: DatabricksEndpoint<'batchGetMarketplaceConsumerListings'>;
	batchGetMarketplaceConsumerProviders: DatabricksEndpoint<'batchGetMarketplaceConsumerProviders'>;
	createMarketplaceConsumerInstallation: DatabricksEndpoint<'createMarketplaceConsumerInstallation'>;
	createMarketplaceProviderListing: DatabricksEndpoint<'createMarketplaceProviderListing'>;
	createProviderAnalyticsDashboard: DatabricksEndpoint<'createProviderAnalyticsDashboard'>;
	deleteListingFromExchange: DatabricksEndpoint<'deleteListingFromExchange'>;
	deleteMarketplaceConsumerInstallation: DatabricksEndpoint<'deleteMarketplaceConsumerInstallation'>;

	// Jobs
	cancelAllJobRuns: DatabricksEndpoint<'cancelAllJobRuns'>;
	cancelJobRun: DatabricksEndpoint<'cancelJobRun'>;
	deleteDatabricksJobRun: DatabricksEndpoint<'deleteDatabricksJobRun'>;

	// SQL
	cancelSqlStatementExecution: DatabricksEndpoint<'cancelSqlStatementExecution'>;
	createLegacySqlAlert: DatabricksEndpoint<'createLegacySqlAlert'>;
	createLegacySqlQuery: DatabricksEndpoint<'createLegacySqlQuery'>;
	createLegacySqlQueryVisualization: DatabricksEndpoint<'createLegacySqlQueryVisualization'>;
	createSqlAlert: DatabricksEndpoint<'createSqlAlert'>;
	createSqlQuery: DatabricksEndpoint<'createSqlQuery'>;
	createSqlQueryVisualization: DatabricksEndpoint<'createSqlQueryVisualization'>;
	deleteLegacySqlAlert: DatabricksEndpoint<'deleteLegacySqlAlert'>;
	deleteLegacySqlQuery: DatabricksEndpoint<'deleteLegacySqlQuery'>;
	deleteLegacySqlQueryVisualization: DatabricksEndpoint<'deleteLegacySqlQueryVisualization'>;
	deleteSqlAlert: DatabricksEndpoint<'deleteSqlAlert'>;
	deleteSqlDashboard: DatabricksEndpoint<'deleteSqlDashboard'>;
	deleteSqlQuery: DatabricksEndpoint<'deleteSqlQuery'>;
	deleteSqlWarehouse: DatabricksEndpoint<'deleteSqlWarehouse'>;

	// Clean Rooms
	createCleanRoom: DatabricksEndpoint<'createCleanRoom'>;
	createCleanRoomAutoApprovalRule: DatabricksEndpoint<'createCleanRoomAutoApprovalRule'>;

	// Data Quality
	createDataQualityMonitor: DatabricksEndpoint<'createDataQualityMonitor'>;
	createQualityMonitorV2: DatabricksEndpoint<'createQualityMonitorV2'>;

	// Database
	createDatabaseInstance: DatabricksEndpoint<'createDatabaseInstance'>;
	deleteDatabaseInstance: DatabricksEndpoint<'deleteDatabaseInstance'>;
	deleteSyncedDatabaseTable: DatabricksEndpoint<'deleteSyncedDatabaseTable'>;

	// Apps
	createDatabricksApp: DatabricksEndpoint<'createDatabricksApp'>;
	deleteDatabricksApp: DatabricksEndpoint<'deleteDatabricksApp'>;
	deployDatabricksApp: DatabricksEndpoint<'deployDatabricksApp'>;

	// Dashboards & Genie
	createGenieMessage: DatabricksEndpoint<'createGenieMessage'>;
	createGenieSpace: DatabricksEndpoint<'createGenieSpace'>;
	createLakeviewDashboard: DatabricksEndpoint<'createLakeviewDashboard'>;
	deleteGenieConversation: DatabricksEndpoint<'deleteGenieConversation'>;
	deleteGenieConversationMessage: DatabricksEndpoint<'deleteGenieConversationMessage'>;
	deleteLakeviewDashboardSchedule: DatabricksEndpoint<'deleteLakeviewDashboardSchedule'>;

	// ML
	createLoggedModel: DatabricksEndpoint<'createLoggedModel'>;
	createMlExperiment: DatabricksEndpoint<'createMlExperiment'>;
	createMlFeatureStoreOnlineStore: DatabricksEndpoint<'createMlFeatureStoreOnlineStore'>;
	createMlForecastingExperiment: DatabricksEndpoint<'createMlForecastingExperiment'>;
	createMlflowExperimentRun: DatabricksEndpoint<'createMlflowExperimentRun'>;
	deleteLoggedModel: DatabricksEndpoint<'deleteLoggedModel'>;
	deleteLoggedModelTag: DatabricksEndpoint<'deleteLoggedModelTag'>;
	deleteMlExperiment: DatabricksEndpoint<'deleteMlExperiment'>;
	deleteMlExperimentRun: DatabricksEndpoint<'deleteMlExperimentRun'>;
	deleteMlExperimentRunTag: DatabricksEndpoint<'deleteMlExperimentRunTag'>;
	deleteMlExperimentRuns: DatabricksEndpoint<'deleteMlExperimentRuns'>;
	deleteMlFeatureEngKafkaConfig: DatabricksEndpoint<'deleteMlFeatureEngKafkaConfig'>;
	deleteMlFeatureStoreOnlineStore: DatabricksEndpoint<'deleteMlFeatureStoreOnlineStore'>;
	deleteMlFeatureTag: DatabricksEndpoint<'deleteMlFeatureTag'>;

	// Security
	createOAuthServicePrincipalSecret: DatabricksEndpoint<'createOAuthServicePrincipalSecret'>;
	createPersonalAccessToken: DatabricksEndpoint<'createPersonalAccessToken'>;
	createNotificationDestination: DatabricksEndpoint<'createNotificationDestination'>;
	deleteNotificationDestination: DatabricksEndpoint<'deleteNotificationDestination'>;
	deleteOAuth2ServicePrincipalSecret: DatabricksEndpoint<'deleteOAuth2ServicePrincipalSecret'>;
	deleteTokenManagement: DatabricksEndpoint<'deleteTokenManagement'>;

	// Serving
	createProvisionedThroughputEndpoint: DatabricksEndpoint<'createProvisionedThroughputEndpoint'>;
	createVectorSearchEndpoint: DatabricksEndpoint<'createVectorSearchEndpoint'>;
	deleteServingEndpoint: DatabricksEndpoint<'deleteServingEndpoint'>;
	deleteVectorSearchIndex: DatabricksEndpoint<'deleteVectorSearchIndex'>;

	// Sharing
	createShare: DatabricksEndpoint<'createShare'>;
	createSharingProvider: DatabricksEndpoint<'createSharingProvider'>;
	createSharingRecipient: DatabricksEndpoint<'createSharingRecipient'>;
	deleteShare: DatabricksEndpoint<'deleteShare'>;
	deleteSharingRecipient: DatabricksEndpoint<'deleteSharingRecipient'>;

	// Workspace
	createSecretScope: DatabricksEndpoint<'createSecretScope'>;
	createTagPolicy: DatabricksEndpoint<'createTagPolicy'>;
	createWorkspaceDirectory: DatabricksEndpoint<'createWorkspaceDirectory'>;
	createWorkspaceGitCredentials: DatabricksEndpoint<'createWorkspaceGitCredentials'>;
	createWorkspaceRepo: DatabricksEndpoint<'createWorkspaceRepo'>;
	deleteAibiDashboardEmbeddingAccessPolicy: DatabricksEndpoint<'deleteAibiDashboardEmbeddingAccessPolicy'>;
	deleteAibiDashboardEmbeddingApprovedDomains: DatabricksEndpoint<'deleteAibiDashboardEmbeddingApprovedDomains'>;
	deleteCustomLlmAgent: DatabricksEndpoint<'deleteCustomLlmAgent'>;
	deleteDashboardEmailSubscriptionsSetting: DatabricksEndpoint<'deleteDashboardEmailSubscriptionsSetting'>;
	deleteDatabricksPipeline: DatabricksEndpoint<'deleteDatabricksPipeline'>;
	deleteDefaultNamespaceSetting: DatabricksEndpoint<'deleteDefaultNamespaceSetting'>;
	deleteDefaultWarehouseIdSetting: DatabricksEndpoint<'deleteDefaultWarehouseIdSetting'>;
	deleteDisableLegacyAccessSetting: DatabricksEndpoint<'deleteDisableLegacyAccessSetting'>;
	deleteDisableLegacyDbfsSetting: DatabricksEndpoint<'deleteDisableLegacyDbfsSetting'>;
	deleteLlmProxyPartnerSetting: DatabricksEndpoint<'deleteLlmProxyPartnerSetting'>;
	deleteRestrictWorkspaceAdminsSetting: DatabricksEndpoint<'deleteRestrictWorkspaceAdminsSetting'>;
	deleteSqlResultsDownloadSetting: DatabricksEndpoint<'deleteSqlResultsDownloadSetting'>;
	deleteSecretScope: DatabricksEndpoint<'deleteSecretScope'>;
	deleteSecretsAcl: DatabricksEndpoint<'deleteSecretsAcl'>;
	deleteTagPolicy: DatabricksEndpoint<'deleteTagPolicy'>;
	deleteWorkspaceGitCredentials: DatabricksEndpoint<'deleteWorkspaceGitCredentials'>;
	deleteWorkspaceObject: DatabricksEndpoint<'deleteWorkspaceObject'>;
	deleteWorkspaceRepo: DatabricksEndpoint<'deleteWorkspaceRepo'>;
	deleteWorkspaceSecret: DatabricksEndpoint<'deleteWorkspaceSecret'>;
};

export type DatabricksBoundWebhooks = BindWebhooks<Record<string, never>>;

const databricksEndpointsNested = {
	dbfs: {
		addBlockToDbfsStream: Dbfs.addBlockToDbfsStream,
		createDbfsFileStream: Dbfs.createDbfsFileStream,
		deleteDbfsFileOrDirectory: Dbfs.deleteDbfsFileOrDirectory,
	},
	compute: {
		addComputeInstanceProfile: Compute.addComputeInstanceProfile,
		createComputeClusterPolicy: Compute.createComputeClusterPolicy,
		createComputeInstancePool: Compute.createComputeInstancePool,
		createDatabricksCluster: Compute.createDatabricksCluster,
		createGlobalInitScript: Compute.createGlobalInitScript,
		deleteComputeClusterPolicy: Compute.deleteComputeClusterPolicy,
		deleteComputeInstancePool: Compute.deleteComputeInstancePool,
		deleteDatabricksCluster: Compute.deleteDatabricksCluster,
		deleteGlobalInitScript: Compute.deleteGlobalInitScript,
	},
	iam: {
		addMemberToSecurityGroup: Iam.addMemberToSecurityGroup,
		createIamGroupV2: Iam.createIamGroupV2,
		createIamServicePrincipalV2: Iam.createIamServicePrincipalV2,
		createIamUserV2: Iam.createIamUserV2,
		createIpAccessList: Iam.createIpAccessList,
		deleteIamGroupV2: Iam.deleteIamGroupV2,
		deleteIamServicePrincipalV2: Iam.deleteIamServicePrincipalV2,
		deleteIamUserV2: Iam.deleteIamUserV2,
	},
	catalog: {
		assignMetastoreToWorkspace: Catalog.assignMetastoreToWorkspace,
		batchCreateAccessRequests: Catalog.batchCreateAccessRequests,
		checkTableExists: Catalog.checkTableExists,
		createCatalogConnection: Catalog.createCatalogConnection,
		createCatalogCredential: Catalog.createCatalogCredential,
		createExternalLocation: Catalog.createExternalLocation,
		createMetastore: Catalog.createMetastore,
		createStorageCredential: Catalog.createStorageCredential,
		deleteCatalog: Catalog.deleteCatalog,
		deleteCatalogConnection: Catalog.deleteCatalogConnection,
		deleteCatalogCredential: Catalog.deleteCatalogCredential,
		deleteCatalogTable: Catalog.deleteCatalogTable,
		deleteExternalLocation: Catalog.deleteExternalLocation,
		deleteMetastore: Catalog.deleteMetastore,
		deleteOnlineTable: Catalog.deleteOnlineTable,
		deleteStorageCredential: Catalog.deleteStorageCredential,
		disableSystemSchema: Catalog.disableSystemSchema,
	},
	marketplace: {
		batchGetMarketplaceConsumerListings:
			Marketplace.batchGetMarketplaceConsumerListings,
		batchGetMarketplaceConsumerProviders:
			Marketplace.batchGetMarketplaceConsumerProviders,
		createMarketplaceConsumerInstallation:
			Marketplace.createMarketplaceConsumerInstallation,
		createMarketplaceProviderListing:
			Marketplace.createMarketplaceProviderListing,
		createProviderAnalyticsDashboard:
			Marketplace.createProviderAnalyticsDashboard,
		deleteListingFromExchange: Marketplace.deleteListingFromExchange,
		deleteMarketplaceConsumerInstallation:
			Marketplace.deleteMarketplaceConsumerInstallation,
	},
	jobs: {
		cancelAllJobRuns: Jobs.cancelAllJobRuns,
		cancelJobRun: Jobs.cancelJobRun,
		deleteDatabricksJobRun: Jobs.deleteDatabricksJobRun,
	},
	sql: {
		cancelSqlStatementExecution: Sql.cancelSqlStatementExecution,
		createLegacySqlAlert: Sql.createLegacySqlAlert,
		createLegacySqlQuery: Sql.createLegacySqlQuery,
		createLegacySqlQueryVisualization: Sql.createLegacySqlQueryVisualization,
		createSqlAlert: Sql.createSqlAlert,
		createSqlQuery: Sql.createSqlQuery,
		createSqlQueryVisualization: Sql.createSqlQueryVisualization,
		deleteLegacySqlAlert: Sql.deleteLegacySqlAlert,
		deleteLegacySqlQuery: Sql.deleteLegacySqlQuery,
		deleteLegacySqlQueryVisualization: Sql.deleteLegacySqlQueryVisualization,
		deleteSqlAlert: Sql.deleteSqlAlert,
		deleteSqlDashboard: Sql.deleteSqlDashboard,
		deleteSqlQuery: Sql.deleteSqlQuery,
		deleteSqlWarehouse: Sql.deleteSqlWarehouse,
	},
	cleanrooms: {
		createCleanRoom: Cleanrooms.createCleanRoom,
		createCleanRoomAutoApprovalRule: Cleanrooms.createCleanRoomAutoApprovalRule,
	},
	dataquality: {
		createDataQualityMonitor: Dataquality.createDataQualityMonitor,
		createQualityMonitorV2: Dataquality.createQualityMonitorV2,
	},
	database: {
		createDatabaseInstance: Database.createDatabaseInstance,
		deleteDatabaseInstance: Database.deleteDatabaseInstance,
		deleteSyncedDatabaseTable: Database.deleteSyncedDatabaseTable,
	},
	apps: {
		createDatabricksApp: Apps.createDatabricksApp,
		deleteDatabricksApp: Apps.deleteDatabricksApp,
		deployDatabricksApp: Apps.deployDatabricksApp,
	},
	dashboards: {
		createGenieMessage: Dashboards.createGenieMessage,
		createGenieSpace: Dashboards.createGenieSpace,
		createLakeviewDashboard: Dashboards.createLakeviewDashboard,
		deleteGenieConversation: Dashboards.deleteGenieConversation,
		deleteGenieConversationMessage: Dashboards.deleteGenieConversationMessage,
		deleteLakeviewDashboardSchedule: Dashboards.deleteLakeviewDashboardSchedule,
	},
	ml: {
		createLoggedModel: Ml.createLoggedModel,
		createMlExperiment: Ml.createMlExperiment,
		createMlFeatureStoreOnlineStore: Ml.createMlFeatureStoreOnlineStore,
		createMlForecastingExperiment: Ml.createMlForecastingExperiment,
		createMlflowExperimentRun: Ml.createMlflowExperimentRun,
		deleteLoggedModel: Ml.deleteLoggedModel,
		deleteLoggedModelTag: Ml.deleteLoggedModelTag,
		deleteMlExperiment: Ml.deleteMlExperiment,
		deleteMlExperimentRun: Ml.deleteMlExperimentRun,
		deleteMlExperimentRunTag: Ml.deleteMlExperimentRunTag,
		deleteMlExperimentRuns: Ml.deleteMlExperimentRuns,
		deleteMlFeatureEngKafkaConfig: Ml.deleteMlFeatureEngKafkaConfig,
		deleteMlFeatureStoreOnlineStore: Ml.deleteMlFeatureStoreOnlineStore,
		deleteMlFeatureTag: Ml.deleteMlFeatureTag,
	},
	security: {
		createOAuthServicePrincipalSecret:
			Security.createOAuthServicePrincipalSecret,
		createPersonalAccessToken: Security.createPersonalAccessToken,
		createNotificationDestination: Security.createNotificationDestination,
		deleteNotificationDestination: Security.deleteNotificationDestination,
		deleteOAuth2ServicePrincipalSecret:
			Security.deleteOAuth2ServicePrincipalSecret,
		deleteTokenManagement: Security.deleteTokenManagement,
	},
	serving: {
		createProvisionedThroughputEndpoint:
			Serving.createProvisionedThroughputEndpoint,
		createVectorSearchEndpoint: Serving.createVectorSearchEndpoint,
		deleteServingEndpoint: Serving.deleteServingEndpoint,
		deleteVectorSearchIndex: Serving.deleteVectorSearchIndex,
	},
	sharing: {
		createShare: Sharing.createShare,
		createSharingProvider: Sharing.createSharingProvider,
		createSharingRecipient: Sharing.createSharingRecipient,
		deleteShare: Sharing.deleteShare,
		deleteSharingRecipient: Sharing.deleteSharingRecipient,
	},
	workspace: {
		createSecretScope: Workspace.createSecretScope,
		createTagPolicy: Workspace.createTagPolicy,
		createWorkspaceDirectory: Workspace.createWorkspaceDirectory,
		createWorkspaceGitCredentials: Workspace.createWorkspaceGitCredentials,
		createWorkspaceRepo: Workspace.createWorkspaceRepo,
		deleteAibiDashboardEmbeddingAccessPolicy:
			Workspace.deleteAibiDashboardEmbeddingAccessPolicy,
		deleteAibiDashboardEmbeddingApprovedDomains:
			Workspace.deleteAibiDashboardEmbeddingApprovedDomains,
		deleteCustomLlmAgent: Workspace.deleteCustomLlmAgent,
		deleteDashboardEmailSubscriptionsSetting:
			Workspace.deleteDashboardEmailSubscriptionsSetting,
		deleteDatabricksPipeline: Workspace.deleteDatabricksPipeline,
		deleteDefaultNamespaceSetting: Workspace.deleteDefaultNamespaceSetting,
		deleteDefaultWarehouseIdSetting: Workspace.deleteDefaultWarehouseIdSetting,
		deleteDisableLegacyAccessSetting:
			Workspace.deleteDisableLegacyAccessSetting,
		deleteDisableLegacyDbfsSetting: Workspace.deleteDisableLegacyDbfsSetting,
		deleteLlmProxyPartnerSetting: Workspace.deleteLlmProxyPartnerSetting,
		deleteRestrictWorkspaceAdminsSetting:
			Workspace.deleteRestrictWorkspaceAdminsSetting,
		deleteSqlResultsDownloadSetting: Workspace.deleteSqlResultsDownloadSetting,
		deleteSecretScope: Workspace.deleteSecretScope,
		deleteSecretsAcl: Workspace.deleteSecretsAcl,
		deleteTagPolicy: Workspace.deleteTagPolicy,
		deleteWorkspaceGitCredentials: Workspace.deleteWorkspaceGitCredentials,
		deleteWorkspaceObject: Workspace.deleteWorkspaceObject,
		deleteWorkspaceRepo: Workspace.deleteWorkspaceRepo,
		deleteWorkspaceSecret: Workspace.deleteWorkspaceSecret,
	},
} as const;

const databricksWebhooksNested = {} as const;

export const databricksEndpointSchemas = {
	'dbfs.addBlockToDbfsStream': {
		input: DatabricksEndpointInputSchemas.addBlockToDbfsStream,
		output: DatabricksEndpointOutputSchemas.addBlockToDbfsStream,
	},
	'dbfs.createDbfsFileStream': {
		input: DatabricksEndpointInputSchemas.createDbfsFileStream,
		output: DatabricksEndpointOutputSchemas.createDbfsFileStream,
	},
	'dbfs.deleteDbfsFileOrDirectory': {
		input: DatabricksEndpointInputSchemas.deleteDbfsFileOrDirectory,
		output: DatabricksEndpointOutputSchemas.deleteDbfsFileOrDirectory,
	},
	'compute.addComputeInstanceProfile': {
		input: DatabricksEndpointInputSchemas.addComputeInstanceProfile,
		output: DatabricksEndpointOutputSchemas.addComputeInstanceProfile,
	},
	'compute.createComputeClusterPolicy': {
		input: DatabricksEndpointInputSchemas.createComputeClusterPolicy,
		output: DatabricksEndpointOutputSchemas.createComputeClusterPolicy,
	},
	'compute.createComputeInstancePool': {
		input: DatabricksEndpointInputSchemas.createComputeInstancePool,
		output: DatabricksEndpointOutputSchemas.createComputeInstancePool,
	},
	'compute.createDatabricksCluster': {
		input: DatabricksEndpointInputSchemas.createDatabricksCluster,
		output: DatabricksEndpointOutputSchemas.createDatabricksCluster,
	},
	'compute.createGlobalInitScript': {
		input: DatabricksEndpointInputSchemas.createGlobalInitScript,
		output: DatabricksEndpointOutputSchemas.createGlobalInitScript,
	},
	'compute.deleteComputeClusterPolicy': {
		input: DatabricksEndpointInputSchemas.deleteComputeClusterPolicy,
		output: DatabricksEndpointOutputSchemas.deleteComputeClusterPolicy,
	},
	'compute.deleteComputeInstancePool': {
		input: DatabricksEndpointInputSchemas.deleteComputeInstancePool,
		output: DatabricksEndpointOutputSchemas.deleteComputeInstancePool,
	},
	'compute.deleteDatabricksCluster': {
		input: DatabricksEndpointInputSchemas.deleteDatabricksCluster,
		output: DatabricksEndpointOutputSchemas.deleteDatabricksCluster,
	},
	'compute.deleteGlobalInitScript': {
		input: DatabricksEndpointInputSchemas.deleteGlobalInitScript,
		output: DatabricksEndpointOutputSchemas.deleteGlobalInitScript,
	},
	'iam.addMemberToSecurityGroup': {
		input: DatabricksEndpointInputSchemas.addMemberToSecurityGroup,
		output: DatabricksEndpointOutputSchemas.addMemberToSecurityGroup,
	},
	'iam.createIamGroupV2': {
		input: DatabricksEndpointInputSchemas.createIamGroupV2,
		output: DatabricksEndpointOutputSchemas.createIamGroupV2,
	},
	'iam.createIamServicePrincipalV2': {
		input: DatabricksEndpointInputSchemas.createIamServicePrincipalV2,
		output: DatabricksEndpointOutputSchemas.createIamServicePrincipalV2,
	},
	'iam.createIamUserV2': {
		input: DatabricksEndpointInputSchemas.createIamUserV2,
		output: DatabricksEndpointOutputSchemas.createIamUserV2,
	},
	'iam.createIpAccessList': {
		input: DatabricksEndpointInputSchemas.createIpAccessList,
		output: DatabricksEndpointOutputSchemas.createIpAccessList,
	},
	'iam.deleteIamGroupV2': {
		input: DatabricksEndpointInputSchemas.deleteIamGroupV2,
		output: DatabricksEndpointOutputSchemas.deleteIamGroupV2,
	},
	'iam.deleteIamServicePrincipalV2': {
		input: DatabricksEndpointInputSchemas.deleteIamServicePrincipalV2,
		output: DatabricksEndpointOutputSchemas.deleteIamServicePrincipalV2,
	},
	'iam.deleteIamUserV2': {
		input: DatabricksEndpointInputSchemas.deleteIamUserV2,
		output: DatabricksEndpointOutputSchemas.deleteIamUserV2,
	},
	'catalog.assignMetastoreToWorkspace': {
		input: DatabricksEndpointInputSchemas.assignMetastoreToWorkspace,
		output: DatabricksEndpointOutputSchemas.assignMetastoreToWorkspace,
	},
	'catalog.batchCreateAccessRequests': {
		input: DatabricksEndpointInputSchemas.batchCreateAccessRequests,
		output: DatabricksEndpointOutputSchemas.batchCreateAccessRequests,
	},
	'catalog.checkTableExists': {
		input: DatabricksEndpointInputSchemas.checkTableExists,
		output: DatabricksEndpointOutputSchemas.checkTableExists,
	},
	'catalog.createCatalogConnection': {
		input: DatabricksEndpointInputSchemas.createCatalogConnection,
		output: DatabricksEndpointOutputSchemas.createCatalogConnection,
	},
	'catalog.createCatalogCredential': {
		input: DatabricksEndpointInputSchemas.createCatalogCredential,
		output: DatabricksEndpointOutputSchemas.createCatalogCredential,
	},
	'catalog.createExternalLocation': {
		input: DatabricksEndpointInputSchemas.createExternalLocation,
		output: DatabricksEndpointOutputSchemas.createExternalLocation,
	},
	'catalog.createMetastore': {
		input: DatabricksEndpointInputSchemas.createMetastore,
		output: DatabricksEndpointOutputSchemas.createMetastore,
	},
	'catalog.createStorageCredential': {
		input: DatabricksEndpointInputSchemas.createStorageCredential,
		output: DatabricksEndpointOutputSchemas.createStorageCredential,
	},
	'catalog.deleteCatalog': {
		input: DatabricksEndpointInputSchemas.deleteCatalog,
		output: DatabricksEndpointOutputSchemas.deleteCatalog,
	},
	'catalog.deleteCatalogConnection': {
		input: DatabricksEndpointInputSchemas.deleteCatalogConnection,
		output: DatabricksEndpointOutputSchemas.deleteCatalogConnection,
	},
	'catalog.deleteCatalogCredential': {
		input: DatabricksEndpointInputSchemas.deleteCatalogCredential,
		output: DatabricksEndpointOutputSchemas.deleteCatalogCredential,
	},
	'catalog.deleteCatalogTable': {
		input: DatabricksEndpointInputSchemas.deleteCatalogTable,
		output: DatabricksEndpointOutputSchemas.deleteCatalogTable,
	},
	'catalog.deleteExternalLocation': {
		input: DatabricksEndpointInputSchemas.deleteExternalLocation,
		output: DatabricksEndpointOutputSchemas.deleteExternalLocation,
	},
	'catalog.deleteMetastore': {
		input: DatabricksEndpointInputSchemas.deleteMetastore,
		output: DatabricksEndpointOutputSchemas.deleteMetastore,
	},
	'catalog.deleteOnlineTable': {
		input: DatabricksEndpointInputSchemas.deleteOnlineTable,
		output: DatabricksEndpointOutputSchemas.deleteOnlineTable,
	},
	'catalog.deleteStorageCredential': {
		input: DatabricksEndpointInputSchemas.deleteStorageCredential,
		output: DatabricksEndpointOutputSchemas.deleteStorageCredential,
	},
	'catalog.disableSystemSchema': {
		input: DatabricksEndpointInputSchemas.disableSystemSchema,
		output: DatabricksEndpointOutputSchemas.disableSystemSchema,
	},
	'marketplace.batchGetMarketplaceConsumerListings': {
		input: DatabricksEndpointInputSchemas.batchGetMarketplaceConsumerListings,
		output: DatabricksEndpointOutputSchemas.batchGetMarketplaceConsumerListings,
	},
	'marketplace.batchGetMarketplaceConsumerProviders': {
		input: DatabricksEndpointInputSchemas.batchGetMarketplaceConsumerProviders,
		output:
			DatabricksEndpointOutputSchemas.batchGetMarketplaceConsumerProviders,
	},
	'marketplace.createMarketplaceConsumerInstallation': {
		input: DatabricksEndpointInputSchemas.createMarketplaceConsumerInstallation,
		output:
			DatabricksEndpointOutputSchemas.createMarketplaceConsumerInstallation,
	},
	'marketplace.createMarketplaceProviderListing': {
		input: DatabricksEndpointInputSchemas.createMarketplaceProviderListing,
		output: DatabricksEndpointOutputSchemas.createMarketplaceProviderListing,
	},
	'marketplace.createProviderAnalyticsDashboard': {
		input: DatabricksEndpointInputSchemas.createProviderAnalyticsDashboard,
		output: DatabricksEndpointOutputSchemas.createProviderAnalyticsDashboard,
	},
	'marketplace.deleteListingFromExchange': {
		input: DatabricksEndpointInputSchemas.deleteListingFromExchange,
		output: DatabricksEndpointOutputSchemas.deleteListingFromExchange,
	},
	'marketplace.deleteMarketplaceConsumerInstallation': {
		input: DatabricksEndpointInputSchemas.deleteMarketplaceConsumerInstallation,
		output:
			DatabricksEndpointOutputSchemas.deleteMarketplaceConsumerInstallation,
	},
	'jobs.cancelAllJobRuns': {
		input: DatabricksEndpointInputSchemas.cancelAllJobRuns,
		output: DatabricksEndpointOutputSchemas.cancelAllJobRuns,
	},
	'jobs.cancelJobRun': {
		input: DatabricksEndpointInputSchemas.cancelJobRun,
		output: DatabricksEndpointOutputSchemas.cancelJobRun,
	},
	'jobs.deleteDatabricksJobRun': {
		input: DatabricksEndpointInputSchemas.deleteDatabricksJobRun,
		output: DatabricksEndpointOutputSchemas.deleteDatabricksJobRun,
	},
	'sql.cancelSqlStatementExecution': {
		input: DatabricksEndpointInputSchemas.cancelSqlStatementExecution,
		output: DatabricksEndpointOutputSchemas.cancelSqlStatementExecution,
	},
	'sql.createLegacySqlAlert': {
		input: DatabricksEndpointInputSchemas.createLegacySqlAlert,
		output: DatabricksEndpointOutputSchemas.createLegacySqlAlert,
	},
	'sql.createLegacySqlQuery': {
		input: DatabricksEndpointInputSchemas.createLegacySqlQuery,
		output: DatabricksEndpointOutputSchemas.createLegacySqlQuery,
	},
	'sql.createLegacySqlQueryVisualization': {
		input: DatabricksEndpointInputSchemas.createLegacySqlQueryVisualization,
		output: DatabricksEndpointOutputSchemas.createLegacySqlQueryVisualization,
	},
	'sql.createSqlAlert': {
		input: DatabricksEndpointInputSchemas.createSqlAlert,
		output: DatabricksEndpointOutputSchemas.createSqlAlert,
	},
	'sql.createSqlQuery': {
		input: DatabricksEndpointInputSchemas.createSqlQuery,
		output: DatabricksEndpointOutputSchemas.createSqlQuery,
	},
	'sql.createSqlQueryVisualization': {
		input: DatabricksEndpointInputSchemas.createSqlQueryVisualization,
		output: DatabricksEndpointOutputSchemas.createSqlQueryVisualization,
	},
	'sql.deleteLegacySqlAlert': {
		input: DatabricksEndpointInputSchemas.deleteLegacySqlAlert,
		output: DatabricksEndpointOutputSchemas.deleteLegacySqlAlert,
	},
	'sql.deleteLegacySqlQuery': {
		input: DatabricksEndpointInputSchemas.deleteLegacySqlQuery,
		output: DatabricksEndpointOutputSchemas.deleteLegacySqlQuery,
	},
	'sql.deleteLegacySqlQueryVisualization': {
		input: DatabricksEndpointInputSchemas.deleteLegacySqlQueryVisualization,
		output: DatabricksEndpointOutputSchemas.deleteLegacySqlQueryVisualization,
	},
	'sql.deleteSqlAlert': {
		input: DatabricksEndpointInputSchemas.deleteSqlAlert,
		output: DatabricksEndpointOutputSchemas.deleteSqlAlert,
	},
	'sql.deleteSqlDashboard': {
		input: DatabricksEndpointInputSchemas.deleteSqlDashboard,
		output: DatabricksEndpointOutputSchemas.deleteSqlDashboard,
	},
	'sql.deleteSqlQuery': {
		input: DatabricksEndpointInputSchemas.deleteSqlQuery,
		output: DatabricksEndpointOutputSchemas.deleteSqlQuery,
	},
	'sql.deleteSqlWarehouse': {
		input: DatabricksEndpointInputSchemas.deleteSqlWarehouse,
		output: DatabricksEndpointOutputSchemas.deleteSqlWarehouse,
	},
	'cleanrooms.createCleanRoom': {
		input: DatabricksEndpointInputSchemas.createCleanRoom,
		output: DatabricksEndpointOutputSchemas.createCleanRoom,
	},
	'cleanrooms.createCleanRoomAutoApprovalRule': {
		input: DatabricksEndpointInputSchemas.createCleanRoomAutoApprovalRule,
		output: DatabricksEndpointOutputSchemas.createCleanRoomAutoApprovalRule,
	},
	'dataquality.createDataQualityMonitor': {
		input: DatabricksEndpointInputSchemas.createDataQualityMonitor,
		output: DatabricksEndpointOutputSchemas.createDataQualityMonitor,
	},
	'dataquality.createQualityMonitorV2': {
		input: DatabricksEndpointInputSchemas.createQualityMonitorV2,
		output: DatabricksEndpointOutputSchemas.createQualityMonitorV2,
	},
	'database.createDatabaseInstance': {
		input: DatabricksEndpointInputSchemas.createDatabaseInstance,
		output: DatabricksEndpointOutputSchemas.createDatabaseInstance,
	},
	'database.deleteDatabaseInstance': {
		input: DatabricksEndpointInputSchemas.deleteDatabaseInstance,
		output: DatabricksEndpointOutputSchemas.deleteDatabaseInstance,
	},
	'database.deleteSyncedDatabaseTable': {
		input: DatabricksEndpointInputSchemas.deleteSyncedDatabaseTable,
		output: DatabricksEndpointOutputSchemas.deleteSyncedDatabaseTable,
	},
	'apps.createDatabricksApp': {
		input: DatabricksEndpointInputSchemas.createDatabricksApp,
		output: DatabricksEndpointOutputSchemas.createDatabricksApp,
	},
	'apps.deleteDatabricksApp': {
		input: DatabricksEndpointInputSchemas.deleteDatabricksApp,
		output: DatabricksEndpointOutputSchemas.deleteDatabricksApp,
	},
	'apps.deployDatabricksApp': {
		input: DatabricksEndpointInputSchemas.deployDatabricksApp,
		output: DatabricksEndpointOutputSchemas.deployDatabricksApp,
	},
	'dashboards.createGenieMessage': {
		input: DatabricksEndpointInputSchemas.createGenieMessage,
		output: DatabricksEndpointOutputSchemas.createGenieMessage,
	},
	'dashboards.createGenieSpace': {
		input: DatabricksEndpointInputSchemas.createGenieSpace,
		output: DatabricksEndpointOutputSchemas.createGenieSpace,
	},
	'dashboards.createLakeviewDashboard': {
		input: DatabricksEndpointInputSchemas.createLakeviewDashboard,
		output: DatabricksEndpointOutputSchemas.createLakeviewDashboard,
	},
	'dashboards.deleteGenieConversation': {
		input: DatabricksEndpointInputSchemas.deleteGenieConversation,
		output: DatabricksEndpointOutputSchemas.deleteGenieConversation,
	},
	'dashboards.deleteGenieConversationMessage': {
		input: DatabricksEndpointInputSchemas.deleteGenieConversationMessage,
		output: DatabricksEndpointOutputSchemas.deleteGenieConversationMessage,
	},
	'dashboards.deleteLakeviewDashboardSchedule': {
		input: DatabricksEndpointInputSchemas.deleteLakeviewDashboardSchedule,
		output: DatabricksEndpointOutputSchemas.deleteLakeviewDashboardSchedule,
	},
	'ml.createLoggedModel': {
		input: DatabricksEndpointInputSchemas.createLoggedModel,
		output: DatabricksEndpointOutputSchemas.createLoggedModel,
	},
	'ml.createMlExperiment': {
		input: DatabricksEndpointInputSchemas.createMlExperiment,
		output: DatabricksEndpointOutputSchemas.createMlExperiment,
	},
	'ml.createMlFeatureStoreOnlineStore': {
		input: DatabricksEndpointInputSchemas.createMlFeatureStoreOnlineStore,
		output: DatabricksEndpointOutputSchemas.createMlFeatureStoreOnlineStore,
	},
	'ml.createMlForecastingExperiment': {
		input: DatabricksEndpointInputSchemas.createMlForecastingExperiment,
		output: DatabricksEndpointOutputSchemas.createMlForecastingExperiment,
	},
	'ml.createMlflowExperimentRun': {
		input: DatabricksEndpointInputSchemas.createMlflowExperimentRun,
		output: DatabricksEndpointOutputSchemas.createMlflowExperimentRun,
	},
	'ml.deleteLoggedModel': {
		input: DatabricksEndpointInputSchemas.deleteLoggedModel,
		output: DatabricksEndpointOutputSchemas.deleteLoggedModel,
	},
	'ml.deleteLoggedModelTag': {
		input: DatabricksEndpointInputSchemas.deleteLoggedModelTag,
		output: DatabricksEndpointOutputSchemas.deleteLoggedModelTag,
	},
	'ml.deleteMlExperiment': {
		input: DatabricksEndpointInputSchemas.deleteMlExperiment,
		output: DatabricksEndpointOutputSchemas.deleteMlExperiment,
	},
	'ml.deleteMlExperimentRun': {
		input: DatabricksEndpointInputSchemas.deleteMlExperimentRun,
		output: DatabricksEndpointOutputSchemas.deleteMlExperimentRun,
	},
	'ml.deleteMlExperimentRunTag': {
		input: DatabricksEndpointInputSchemas.deleteMlExperimentRunTag,
		output: DatabricksEndpointOutputSchemas.deleteMlExperimentRunTag,
	},
	'ml.deleteMlExperimentRuns': {
		input: DatabricksEndpointInputSchemas.deleteMlExperimentRuns,
		output: DatabricksEndpointOutputSchemas.deleteMlExperimentRuns,
	},
	'ml.deleteMlFeatureEngKafkaConfig': {
		input: DatabricksEndpointInputSchemas.deleteMlFeatureEngKafkaConfig,
		output: DatabricksEndpointOutputSchemas.deleteMlFeatureEngKafkaConfig,
	},
	'ml.deleteMlFeatureStoreOnlineStore': {
		input: DatabricksEndpointInputSchemas.deleteMlFeatureStoreOnlineStore,
		output: DatabricksEndpointOutputSchemas.deleteMlFeatureStoreOnlineStore,
	},
	'ml.deleteMlFeatureTag': {
		input: DatabricksEndpointInputSchemas.deleteMlFeatureTag,
		output: DatabricksEndpointOutputSchemas.deleteMlFeatureTag,
	},
	'security.createOAuthServicePrincipalSecret': {
		input: DatabricksEndpointInputSchemas.createOAuthServicePrincipalSecret,
		output: DatabricksEndpointOutputSchemas.createOAuthServicePrincipalSecret,
	},
	'security.createPersonalAccessToken': {
		input: DatabricksEndpointInputSchemas.createPersonalAccessToken,
		output: DatabricksEndpointOutputSchemas.createPersonalAccessToken,
	},
	'security.createNotificationDestination': {
		input: DatabricksEndpointInputSchemas.createNotificationDestination,
		output: DatabricksEndpointOutputSchemas.createNotificationDestination,
	},
	'security.deleteNotificationDestination': {
		input: DatabricksEndpointInputSchemas.deleteNotificationDestination,
		output: DatabricksEndpointOutputSchemas.deleteNotificationDestination,
	},
	'security.deleteOAuth2ServicePrincipalSecret': {
		input: DatabricksEndpointInputSchemas.deleteOAuth2ServicePrincipalSecret,
		output: DatabricksEndpointOutputSchemas.deleteOAuth2ServicePrincipalSecret,
	},
	'security.deleteTokenManagement': {
		input: DatabricksEndpointInputSchemas.deleteTokenManagement,
		output: DatabricksEndpointOutputSchemas.deleteTokenManagement,
	},
	'serving.createProvisionedThroughputEndpoint': {
		input: DatabricksEndpointInputSchemas.createProvisionedThroughputEndpoint,
		output: DatabricksEndpointOutputSchemas.createProvisionedThroughputEndpoint,
	},
	'serving.createVectorSearchEndpoint': {
		input: DatabricksEndpointInputSchemas.createVectorSearchEndpoint,
		output: DatabricksEndpointOutputSchemas.createVectorSearchEndpoint,
	},
	'serving.deleteServingEndpoint': {
		input: DatabricksEndpointInputSchemas.deleteServingEndpoint,
		output: DatabricksEndpointOutputSchemas.deleteServingEndpoint,
	},
	'serving.deleteVectorSearchIndex': {
		input: DatabricksEndpointInputSchemas.deleteVectorSearchIndex,
		output: DatabricksEndpointOutputSchemas.deleteVectorSearchIndex,
	},
	'sharing.createShare': {
		input: DatabricksEndpointInputSchemas.createShare,
		output: DatabricksEndpointOutputSchemas.createShare,
	},
	'sharing.createSharingProvider': {
		input: DatabricksEndpointInputSchemas.createSharingProvider,
		output: DatabricksEndpointOutputSchemas.createSharingProvider,
	},
	'sharing.createSharingRecipient': {
		input: DatabricksEndpointInputSchemas.createSharingRecipient,
		output: DatabricksEndpointOutputSchemas.createSharingRecipient,
	},
	'sharing.deleteShare': {
		input: DatabricksEndpointInputSchemas.deleteShare,
		output: DatabricksEndpointOutputSchemas.deleteShare,
	},
	'sharing.deleteSharingRecipient': {
		input: DatabricksEndpointInputSchemas.deleteSharingRecipient,
		output: DatabricksEndpointOutputSchemas.deleteSharingRecipient,
	},
	'workspace.createSecretScope': {
		input: DatabricksEndpointInputSchemas.createSecretScope,
		output: DatabricksEndpointOutputSchemas.createSecretScope,
	},
	'workspace.createTagPolicy': {
		input: DatabricksEndpointInputSchemas.createTagPolicy,
		output: DatabricksEndpointOutputSchemas.createTagPolicy,
	},
	'workspace.createWorkspaceDirectory': {
		input: DatabricksEndpointInputSchemas.createWorkspaceDirectory,
		output: DatabricksEndpointOutputSchemas.createWorkspaceDirectory,
	},
	'workspace.createWorkspaceGitCredentials': {
		input: DatabricksEndpointInputSchemas.createWorkspaceGitCredentials,
		output: DatabricksEndpointOutputSchemas.createWorkspaceGitCredentials,
	},
	'workspace.createWorkspaceRepo': {
		input: DatabricksEndpointInputSchemas.createWorkspaceRepo,
		output: DatabricksEndpointOutputSchemas.createWorkspaceRepo,
	},
	'workspace.deleteAibiDashboardEmbeddingAccessPolicy': {
		input:
			DatabricksEndpointInputSchemas.deleteAibiDashboardEmbeddingAccessPolicy,
		output:
			DatabricksEndpointOutputSchemas.deleteAibiDashboardEmbeddingAccessPolicy,
	},
	'workspace.deleteAibiDashboardEmbeddingApprovedDomains': {
		input:
			DatabricksEndpointInputSchemas.deleteAibiDashboardEmbeddingApprovedDomains,
		output:
			DatabricksEndpointOutputSchemas.deleteAibiDashboardEmbeddingApprovedDomains,
	},
	'workspace.deleteCustomLlmAgent': {
		input: DatabricksEndpointInputSchemas.deleteCustomLlmAgent,
		output: DatabricksEndpointOutputSchemas.deleteCustomLlmAgent,
	},
	'workspace.deleteDashboardEmailSubscriptionsSetting': {
		input:
			DatabricksEndpointInputSchemas.deleteDashboardEmailSubscriptionsSetting,
		output:
			DatabricksEndpointOutputSchemas.deleteDashboardEmailSubscriptionsSetting,
	},
	'workspace.deleteDatabricksPipeline': {
		input: DatabricksEndpointInputSchemas.deleteDatabricksPipeline,
		output: DatabricksEndpointOutputSchemas.deleteDatabricksPipeline,
	},
	'workspace.deleteDefaultNamespaceSetting': {
		input: DatabricksEndpointInputSchemas.deleteDefaultNamespaceSetting,
		output: DatabricksEndpointOutputSchemas.deleteDefaultNamespaceSetting,
	},
	'workspace.deleteDefaultWarehouseIdSetting': {
		input: DatabricksEndpointInputSchemas.deleteDefaultWarehouseIdSetting,
		output: DatabricksEndpointOutputSchemas.deleteDefaultWarehouseIdSetting,
	},
	'workspace.deleteDisableLegacyAccessSetting': {
		input: DatabricksEndpointInputSchemas.deleteDisableLegacyAccessSetting,
		output: DatabricksEndpointOutputSchemas.deleteDisableLegacyAccessSetting,
	},
	'workspace.deleteDisableLegacyDbfsSetting': {
		input: DatabricksEndpointInputSchemas.deleteDisableLegacyDbfsSetting,
		output: DatabricksEndpointOutputSchemas.deleteDisableLegacyDbfsSetting,
	},
	'workspace.deleteLlmProxyPartnerSetting': {
		input: DatabricksEndpointInputSchemas.deleteLlmProxyPartnerSetting,
		output: DatabricksEndpointOutputSchemas.deleteLlmProxyPartnerSetting,
	},
	'workspace.deleteRestrictWorkspaceAdminsSetting': {
		input: DatabricksEndpointInputSchemas.deleteRestrictWorkspaceAdminsSetting,
		output:
			DatabricksEndpointOutputSchemas.deleteRestrictWorkspaceAdminsSetting,
	},
	'workspace.deleteSqlResultsDownloadSetting': {
		input: DatabricksEndpointInputSchemas.deleteSqlResultsDownloadSetting,
		output: DatabricksEndpointOutputSchemas.deleteSqlResultsDownloadSetting,
	},
	'workspace.deleteSecretScope': {
		input: DatabricksEndpointInputSchemas.deleteSecretScope,
		output: DatabricksEndpointOutputSchemas.deleteSecretScope,
	},
	'workspace.deleteSecretsAcl': {
		input: DatabricksEndpointInputSchemas.deleteSecretsAcl,
		output: DatabricksEndpointOutputSchemas.deleteSecretsAcl,
	},
	'workspace.deleteTagPolicy': {
		input: DatabricksEndpointInputSchemas.deleteTagPolicy,
		output: DatabricksEndpointOutputSchemas.deleteTagPolicy,
	},
	'workspace.deleteWorkspaceGitCredentials': {
		input: DatabricksEndpointInputSchemas.deleteWorkspaceGitCredentials,
		output: DatabricksEndpointOutputSchemas.deleteWorkspaceGitCredentials,
	},
	'workspace.deleteWorkspaceObject': {
		input: DatabricksEndpointInputSchemas.deleteWorkspaceObject,
		output: DatabricksEndpointOutputSchemas.deleteWorkspaceObject,
	},
	'workspace.deleteWorkspaceRepo': {
		input: DatabricksEndpointInputSchemas.deleteWorkspaceRepo,
		output: DatabricksEndpointOutputSchemas.deleteWorkspaceRepo,
	},
	'workspace.deleteWorkspaceSecret': {
		input: DatabricksEndpointInputSchemas.deleteWorkspaceSecret,
		output: DatabricksEndpointOutputSchemas.deleteWorkspaceSecret,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof databricksEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const databricksEndpointMeta = {
	'dbfs.addBlockToDbfsStream': {
		riskLevel: 'write',
		description: 'Add block to DBFS stream',
	},
	'dbfs.createDbfsFileStream': {
		riskLevel: 'write',
		description: 'Create DBFS file stream',
	},
	'dbfs.deleteDbfsFileOrDirectory': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete file or directory from DBFS',
	},

	'compute.addComputeInstanceProfile': {
		riskLevel: 'write',
		description: 'Add compute instance profile',
	},
	'compute.createComputeClusterPolicy': {
		riskLevel: 'write',
		description: 'Create cluster policy',
	},
	'compute.createComputeInstancePool': {
		riskLevel: 'write',
		description: 'Create instance pool',
	},
	'compute.createDatabricksCluster': {
		riskLevel: 'write',
		description: 'Create Spark cluster',
	},
	'compute.createGlobalInitScript': {
		riskLevel: 'write',
		description: 'Create global init script',
	},
	'compute.deleteComputeClusterPolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete cluster policy',
	},
	'compute.deleteComputeInstancePool': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete instance pool',
	},
	'compute.deleteDatabricksCluster': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Terminate Spark cluster',
	},
	'compute.deleteGlobalInitScript': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete global init script',
	},

	'iam.addMemberToSecurityGroup': {
		riskLevel: 'write',
		description: 'Add member to security group',
	},
	'iam.createIamGroupV2': {
		riskLevel: 'write',
		description: 'Create IAM group',
	},
	'iam.createIamServicePrincipalV2': {
		riskLevel: 'write',
		description: 'Create IAM service principal',
	},
	'iam.createIamUserV2': { riskLevel: 'write', description: 'Create IAM user' },
	'iam.createIpAccessList': {
		riskLevel: 'write',
		description: 'Create IP access list',
	},
	'iam.deleteIamGroupV2': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete IAM group',
	},
	'iam.deleteIamServicePrincipalV2': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete service principal',
	},
	'iam.deleteIamUserV2': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user',
	},

	'catalog.assignMetastoreToWorkspace': {
		riskLevel: 'write',
		description: 'Assign metastore to workspace',
	},
	'catalog.batchCreateAccessRequests': {
		riskLevel: 'write',
		description: 'Batch create access requests',
	},
	'catalog.checkTableExists': {
		riskLevel: 'read',
		description: 'Check table existence',
	},
	'catalog.createCatalogConnection': {
		riskLevel: 'write',
		description: 'Create catalog connection',
	},
	'catalog.createCatalogCredential': {
		riskLevel: 'write',
		description: 'Create catalog credential',
	},
	'catalog.createExternalLocation': {
		riskLevel: 'write',
		description: 'Create external location',
	},
	'catalog.createMetastore': {
		riskLevel: 'write',
		description: 'Create Unity Catalog metastore',
	},
	'catalog.createStorageCredential': {
		riskLevel: 'write',
		description: 'Create storage credential',
	},
	'catalog.deleteCatalog': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete catalog',
	},
	'catalog.deleteCatalogConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete catalog connection',
	},
	'catalog.deleteCatalogCredential': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete catalog credential',
	},
	'catalog.deleteCatalogTable': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete catalog table',
	},
	'catalog.deleteExternalLocation': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete external location',
	},
	'catalog.deleteMetastore': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete metastore',
	},
	'catalog.deleteOnlineTable': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete online table',
	},
	'catalog.deleteStorageCredential': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete storage credential',
	},
	'catalog.disableSystemSchema': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Disable system schema',
	},

	'marketplace.batchGetMarketplaceConsumerListings': {
		riskLevel: 'read',
		description: 'Batch get consumer listings',
	},
	'marketplace.batchGetMarketplaceConsumerProviders': {
		riskLevel: 'read',
		description: 'Batch get consumer providers',
	},
	'marketplace.createMarketplaceConsumerInstallation': {
		riskLevel: 'write',
		description: 'Create marketplace consumer installation',
	},
	'marketplace.createMarketplaceProviderListing': {
		riskLevel: 'write',
		description: 'Create marketplace provider listing',
	},
	'marketplace.createProviderAnalyticsDashboard': {
		riskLevel: 'write',
		description: 'Create provider analytics dashboard',
	},
	'marketplace.deleteListingFromExchange': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete listing from exchange',
	},
	'marketplace.deleteMarketplaceConsumerInstallation': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete marketplace consumer installation',
	},

	'jobs.cancelAllJobRuns': {
		riskLevel: 'write',
		description: 'Cancel all job runs',
	},
	'jobs.cancelJobRun': { riskLevel: 'write', description: 'Cancel job run' },
	'jobs.deleteDatabricksJobRun': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete job run',
	},

	'sql.cancelSqlStatementExecution': {
		riskLevel: 'write',
		description: 'Cancel SQL statement execution',
	},
	'sql.createLegacySqlAlert': {
		riskLevel: 'write',
		description: 'Create legacy SQL alert',
	},
	'sql.createLegacySqlQuery': {
		riskLevel: 'write',
		description: 'Create legacy SQL query',
	},
	'sql.createLegacySqlQueryVisualization': {
		riskLevel: 'write',
		description: 'Create legacy SQL visualization',
	},
	'sql.createSqlAlert': { riskLevel: 'write', description: 'Create SQL alert' },
	'sql.createSqlQuery': { riskLevel: 'write', description: 'Create SQL query' },
	'sql.createSqlQueryVisualization': {
		riskLevel: 'write',
		description: 'Create SQL query visualization',
	},
	'sql.deleteLegacySqlAlert': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete legacy SQL alert',
	},
	'sql.deleteLegacySqlQuery': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete legacy SQL query',
	},
	'sql.deleteLegacySqlQueryVisualization': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete legacy SQL visualization',
	},
	'sql.deleteSqlAlert': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete SQL alert',
	},
	'sql.deleteSqlDashboard': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete SQL dashboard',
	},
	'sql.deleteSqlQuery': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete SQL query',
	},
	'sql.deleteSqlWarehouse': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete SQL warehouse',
	},

	'cleanrooms.createCleanRoom': {
		riskLevel: 'write',
		description: 'Create clean room',
	},
	'cleanrooms.createCleanRoomAutoApprovalRule': {
		riskLevel: 'write',
		description: 'Create clean room auto approval rule',
	},

	'dataquality.createDataQualityMonitor': {
		riskLevel: 'write',
		description: 'Create data quality monitor',
	},
	'dataquality.createQualityMonitorV2': {
		riskLevel: 'write',
		description: 'Create quality monitor V2',
	},

	'database.createDatabaseInstance': {
		riskLevel: 'write',
		description: 'Create database instance',
	},
	'database.deleteDatabaseInstance': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete database instance',
	},
	'database.deleteSyncedDatabaseTable': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete synced database table',
	},

	'apps.createDatabricksApp': { riskLevel: 'write', description: 'Create app' },
	'apps.deleteDatabricksApp': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete app',
	},
	'apps.deployDatabricksApp': { riskLevel: 'write', description: 'Deploy app' },

	'dashboards.createGenieMessage': {
		riskLevel: 'write',
		description: 'Create Genie message',
	},
	'dashboards.createGenieSpace': {
		riskLevel: 'write',
		description: 'Create Genie space',
	},
	'dashboards.createLakeviewDashboard': {
		riskLevel: 'write',
		description: 'Create Lakeview dashboard',
	},
	'dashboards.deleteGenieConversation': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Genie conversation',
	},
	'dashboards.deleteGenieConversationMessage': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Genie message',
	},
	'dashboards.deleteLakeviewDashboardSchedule': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Lakeview schedule',
	},

	'ml.createLoggedModel': {
		riskLevel: 'write',
		description: 'Create logged model',
	},
	'ml.createMlExperiment': {
		riskLevel: 'write',
		description: 'Create ML experiment',
	},
	'ml.createMlFeatureStoreOnlineStore': {
		riskLevel: 'write',
		description: 'Create ML online feature store',
	},
	'ml.createMlForecastingExperiment': {
		riskLevel: 'write',
		description: 'Create ML forecasting experiment',
	},
	'ml.createMlflowExperimentRun': {
		riskLevel: 'write',
		description: 'Create MLflow experiment run',
	},
	'ml.deleteLoggedModel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete logged model',
	},
	'ml.deleteLoggedModelTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete logged model tag',
	},
	'ml.deleteMlExperiment': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ML experiment',
	},
	'ml.deleteMlExperimentRun': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ML run',
	},
	'ml.deleteMlExperimentRunTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ML run tag',
	},
	'ml.deleteMlExperimentRuns': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ML runs',
	},
	'ml.deleteMlFeatureEngKafkaConfig': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Kafka config',
	},
	'ml.deleteMlFeatureStoreOnlineStore': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ML online store',
	},
	'ml.deleteMlFeatureTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ML feature tag',
	},

	'security.createOAuthServicePrincipalSecret': {
		riskLevel: 'write',
		description: 'Create OAuth SP secret',
	},
	'security.createPersonalAccessToken': {
		riskLevel: 'write',
		description: 'Create personal access token',
	},
	'security.createNotificationDestination': {
		riskLevel: 'write',
		description: 'Create notification destination',
	},
	'security.deleteNotificationDestination': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete notification destination',
	},
	'security.deleteOAuth2ServicePrincipalSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete OAuth SP secret',
	},
	'security.deleteTokenManagement': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete token management',
	},

	'serving.createProvisionedThroughputEndpoint': {
		riskLevel: 'write',
		description: 'Create provisioned throughput endpoint',
	},
	'serving.createVectorSearchEndpoint': {
		riskLevel: 'write',
		description: 'Create vector search endpoint',
	},
	'serving.deleteServingEndpoint': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete serving endpoint',
	},
	'serving.deleteVectorSearchIndex': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete vector search index',
	},

	'sharing.createShare': { riskLevel: 'write', description: 'Create share' },
	'sharing.createSharingProvider': {
		riskLevel: 'write',
		description: 'Create sharing provider',
	},
	'sharing.createSharingRecipient': {
		riskLevel: 'write',
		description: 'Create sharing recipient',
	},
	'sharing.deleteShare': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete share',
	},
	'sharing.deleteSharingRecipient': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete sharing recipient',
	},

	'workspace.createSecretScope': {
		riskLevel: 'write',
		description: 'Create secret scope',
	},
	'workspace.createTagPolicy': {
		riskLevel: 'write',
		description: 'Create tag policy',
	},
	'workspace.createWorkspaceDirectory': {
		riskLevel: 'write',
		description: 'Create workspace directory',
	},
	'workspace.createWorkspaceGitCredentials': {
		riskLevel: 'write',
		description: 'Create workspace git credentials',
	},
	'workspace.createWorkspaceRepo': {
		riskLevel: 'write',
		description: 'Create workspace repo',
	},
	'workspace.deleteAibiDashboardEmbeddingAccessPolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete AI/BI dashboard embedding access policy',
	},
	'workspace.deleteAibiDashboardEmbeddingApprovedDomains': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete AI/BI embedding approved domains',
	},
	'workspace.deleteCustomLlmAgent': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete custom LLM agent',
	},
	'workspace.deleteDashboardEmailSubscriptionsSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete dashboard email subscriptions setting',
	},
	'workspace.deleteDatabricksPipeline': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Databricks pipeline',
	},
	'workspace.deleteDefaultNamespaceSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete default namespace setting',
	},
	'workspace.deleteDefaultWarehouseIdSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete default warehouse ID setting',
	},
	'workspace.deleteDisableLegacyAccessSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete disable legacy access setting',
	},
	'workspace.deleteDisableLegacyDbfsSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete disable legacy DBFS setting',
	},
	'workspace.deleteLlmProxyPartnerSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete LLM proxy partner setting',
	},
	'workspace.deleteRestrictWorkspaceAdminsSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete restrict workspace admins setting',
	},
	'workspace.deleteSqlResultsDownloadSetting': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete SQL results download setting',
	},
	'workspace.deleteSecretScope': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete secret scope',
	},
	'workspace.deleteSecretsAcl': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete secrets ACL',
	},
	'workspace.deleteTagPolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete tag policy',
	},
	'workspace.deleteWorkspaceGitCredentials': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete workspace git credentials',
	},
	'workspace.deleteWorkspaceObject': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete workspace object',
	},
	'workspace.deleteWorkspaceRepo': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete workspace repo',
	},
	'workspace.deleteWorkspaceSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete workspace secret',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof databricksEndpointsNested
>;

export const databricksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDatabricksPlugin<T extends DatabricksPluginOptions> =
	CorsairPlugin<
		'databricks',
		typeof DatabricksSchema,
		typeof databricksEndpointsNested,
		typeof databricksWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDatabricksPlugin =
	BaseDatabricksPlugin<DatabricksPluginOptions>;
export type ExternalDatabricksPlugin<T extends DatabricksPluginOptions> =
	BaseDatabricksPlugin<T>;

export function databricks<const T extends DatabricksPluginOptions>(
	incomingOptions: DatabricksPluginOptions & T = {} as DatabricksPluginOptions &
		T,
): ExternalDatabricksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'databricks',
		authConfig: databricksAuthConfig,
		schema: DatabricksSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: databricksEndpointsNested,
		webhooks: databricksWebhooksNested,
		endpointMeta: databricksEndpointMeta,
		endpointSchemas: databricksEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-databricks-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDatabricksTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDatabricksOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DatabricksKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:databricks:webhook_signature]: Databricks webhook secret is missing',
					);
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('databricks', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('databricks', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('databricks', ctx.authType);
		},
	} satisfies InternalDatabricksPlugin;
}

export type {
	DatabricksEndpointInputs,
	DatabricksEndpointOutputs,
} from './endpoints/types';
