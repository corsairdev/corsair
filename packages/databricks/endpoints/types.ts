import { z } from 'zod';

export const DatabricksEndpointInputSchemas = {
	// DBFS & Files
	addBlockToDbfsStream: z.object({
		handle: z.number(),
		data: z.string().describe('Base64-encoded string block (max 1MB)'),
	}),
	createDbfsFileStream: z.object({
		path: z.string(),
		overwrite: z.boolean().optional(),
	}),
	deleteDbfsFileOrDirectory: z.object({
		path: z.string(),
		recursive: z.boolean().optional(),
	}),

	// Compute & Clusters
	addComputeInstanceProfile: z.object({
		instance_profile_arn: z.string(),
		iam_role_arn: z.string().optional(),
		is_meta_instance_profile: z.boolean().optional(),
	}),
	createComputeClusterPolicy: z.object({
		name: z.string(),
		definition: z.string().optional(),
		policy_family_id: z.string().optional(),
	}),
	createComputeInstancePool: z.object({
		instance_pool_name: z.string(),
		node_type_id: z.string(),
		min_idle_instances: z.number().optional(),
		max_capacity: z.number().optional(),
		idle_instance_autotermination_minutes: z.number().optional(),
	}),
	createDatabricksCluster: z.object({
		cluster_name: z.string(),
		spark_version: z.string(),
		node_type_id: z.string(),
		num_workers: z.number().optional(),
		autoscale: z
			.object({ min_workers: z.number(), max_workers: z.number() })
			.optional(),
		autotermination_minutes: z.number().optional(),
	}),
	createGlobalInitScript: z.object({
		name: z.string(),
		script: z.string().describe('Base64 encoded script'),
		position: z.number().optional(),
		enabled: z.boolean().optional(),
	}),
	deleteComputeClusterPolicy: z.object({
		policy_id: z.string(),
	}),
	deleteComputeInstancePool: z.object({
		instance_pool_id: z.string(),
	}),
	deleteDatabricksCluster: z.object({
		cluster_id: z.string(),
	}),
	deleteGlobalInitScript: z.object({
		script_id: z.string(),
	}),

	// IAM & Security
	addMemberToSecurityGroup: z.object({
		group_id: z.string(),
		member_id: z.string(),
	}),
	createIamGroupV2: z.object({
		displayName: z.string(),
		members: z.array(z.object({ value: z.string() })).optional(),
	}),
	createIamServicePrincipalV2: z.object({
		applicationId: z.string(),
		displayName: z.string().optional(),
	}),
	createIamUserV2: z.object({
		userName: z.string(),
		displayName: z.string().optional(),
		active: z.boolean().optional(),
	}),
	createIpAccessList: z.object({
		label: z.string(),
		list_type: z.enum(['ALLOW', 'BLOCK']),
		ip_addresses: z.array(z.string()),
	}),
	deleteIamGroupV2: z.object({
		id: z.string(),
	}),
	deleteIamServicePrincipalV2: z.object({
		id: z.string(),
	}),
	deleteIamUserV2: z.object({
		id: z.string(),
	}),

	// Catalog & Unity Catalog
	assignMetastoreToWorkspace: z.object({
		metastore_id: z.string(),
		workspace_id: z.number(),
		default_catalog_name: z.string().optional(),
	}),
	batchCreateAccessRequests: z.object({
		requests: z.array(
			z.object({
				securable_type: z.string(),
				securable_full_name: z.string(),
				privileges: z.array(z.string()),
			}),
		),
	}),
	checkTableExists: z.object({
		catalog_name: z.string(),
		schema_name: z.string(),
		table_name: z.string(),
	}),
	createCatalogConnection: z.object({
		name: z.string(),
		connection_type: z.string(),
		options: z.record(z.string(), z.string()),
	}),
	createCatalogCredential: z.object({
		name: z.string(),
		credential_type: z.string().optional(),
		aws_iam_role: z.object({ role_arn: z.string() }).optional(),
		azure_service_principal: z
			.object({
				directory_id: z.string(),
				application_id: z.string(),
				client_secret: z.string(),
			})
			.optional(),
		gcp_service_account_key: z
			.object({ email: z.string(), private_key: z.string() })
			.optional(),
	}),
	createExternalLocation: z.object({
		name: z.string(),
		url: z.string(),
		credential_name: z.string(),
	}),
	createMetastore: z.object({
		name: z.string(),
		storage_root: z.string(),
		owner: z.string().optional(),
	}),
	createStorageCredential: z.object({
		name: z.string(),
		aws_iam_role: z.object({ role_arn: z.string() }).optional(),
		azure_service_principal: z
			.object({
				directory_id: z.string(),
				application_id: z.string(),
				client_secret: z.string(),
			})
			.optional(),
	}),
	deleteCatalog: z.object({
		name: z.string(),
		force: z.boolean().optional(),
	}),
	deleteCatalogConnection: z.object({
		name: z.string(),
	}),
	deleteCatalogCredential: z.object({
		name: z.string(),
		force: z.boolean().optional(),
	}),
	deleteCatalogTable: z.object({
		full_name: z.string(),
	}),
	deleteExternalLocation: z.object({
		name: z.string(),
		force: z.boolean().optional(),
	}),
	deleteMetastore: z.object({
		id: z.string(),
		force: z.boolean().optional(),
	}),
	deleteOnlineTable: z.object({
		name: z.string(),
	}),
	deleteStorageCredential: z.object({
		name: z.string(),
		force: z.boolean().optional(),
	}),
	disableSystemSchema: z.object({
		metastore_id: z.string(),
		schema_name: z.string(),
	}),

	// Marketplace
	batchGetMarketplaceConsumerListings: z.object({
		ids: z.array(z.string()),
	}),
	batchGetMarketplaceConsumerProviders: z.object({
		ids: z.array(z.string()),
	}),
	createMarketplaceConsumerInstallation: z.object({
		listing_id: z.string(),
		catalog_name: z.string().optional(),
	}),
	createMarketplaceProviderListing: z.object({
		name: z.string(),
		summary: z.string(),
		listing_type: z.string(),
	}),
	createProviderAnalyticsDashboard: z.object({
		name: z.string().optional(),
	}),
	deleteListingFromExchange: z.object({
		exchange_id: z.string(),
		listing_id: z.string(),
	}),
	deleteMarketplaceConsumerInstallation: z.object({
		id: z.string(),
	}),

	// Jobs
	cancelAllJobRuns: z.object({
		job_id: z.number().optional(),
		all_queued_runs: z.boolean().optional(),
	}),
	cancelJobRun: z.object({
		run_id: z.number(),
	}),
	deleteDatabricksJobRun: z.object({
		run_id: z.number(),
	}),

	// SQL
	cancelSqlStatementExecution: z.object({
		statement_id: z.string(),
	}),
	createLegacySqlAlert: z.object({
		name: z.string(),
		query_id: z.string(),
		options: z.record(z.string(), z.unknown()).optional(),
	}),
	createLegacySqlQuery: z.object({
		name: z.string(),
		query: z.string(),
		data_source_id: z.string(),
	}),
	createLegacySqlQueryVisualization: z.object({
		query_id: z.string(),
		type: z.string(),
		name: z.string(),
		options: z.record(z.string(), z.unknown()).optional(),
	}),
	createSqlAlert: z.object({
		name: z.string(),
		query_id: z.string(),
		options: z.record(z.string(), z.unknown()).optional(),
	}),
	createSqlQuery: z.object({
		name: z.string(),
		query: z.string(),
		warehouse_id: z.string(),
	}),
	createSqlQueryVisualization: z.object({
		query_id: z.string(),
		type: z.string(),
		name: z.string(),
		options: z.record(z.string(), z.unknown()).optional(),
	}),
	deleteLegacySqlAlert: z.object({
		id: z.string(),
	}),
	deleteLegacySqlQuery: z.object({
		id: z.string(),
	}),
	deleteLegacySqlQueryVisualization: z.object({
		id: z.string(),
	}),
	deleteSqlAlert: z.object({
		id: z.string(),
	}),
	deleteSqlDashboard: z.object({
		id: z.string(),
	}),
	deleteSqlQuery: z.object({
		id: z.string(),
	}),
	deleteSqlWarehouse: z.object({
		id: z.string(),
	}),

	// Clean Rooms
	createCleanRoom: z.object({
		name: z.string(),
		collaborators: z.array(z.object({ collaborator_alias: z.string() })),
	}),
	createCleanRoomAutoApprovalRule: z.object({
		clean_room_name: z.string(),
		author_collaborator_alias: z.string().optional(),
		author_scope: z.string().optional(),
	}),

	// Data Quality & Monitors
	createDataQualityMonitor: z.object({
		table_name: z.string(),
		assets_dir: z.string(),
		output_schema_name: z.string(),
	}),
	createQualityMonitorV2: z.object({
		table_name: z.string(),
		assets_dir: z.string(),
		output_schema_name: z.string(),
	}),

	// Database Instance (Lakebase)
	createDatabaseInstance: z.object({
		name: z.string(),
		capacity: z.string().optional(),
	}),
	deleteDatabaseInstance: z.object({
		name: z.string(),
	}),
	deleteSyncedDatabaseTable: z.object({
		name: z.string(),
	}),

	// Apps
	createDatabricksApp: z.object({
		name: z.string(),
		spec: z.record(z.string(), z.unknown()).optional(),
	}),
	deleteDatabricksApp: z.object({
		name: z.string(),
	}),
	deployDatabricksApp: z.object({
		name: z.string(),
		source_code_path: z.string(),
	}),

	// Dashboards & Genie
	createGenieMessage: z.object({
		space_id: z.string(),
		conversation_id: z.string(),
		content: z.string(),
	}),
	createGenieSpace: z.object({
		warehouse_id: z.string(),
		serialized_space: z.string(),
	}),
	createLakeviewDashboard: z.object({
		display_name: z.string(),
		serialized_dashboard: z.string(),
	}),
	deleteGenieConversation: z.object({
		space_id: z.string(),
		conversation_id: z.string(),
	}),
	deleteGenieConversationMessage: z.object({
		space_id: z.string(),
		conversation_id: z.string(),
		message_id: z.string(),
	}),
	deleteLakeviewDashboardSchedule: z.object({
		dashboard_id: z.string(),
		schedule_id: z.string(),
	}),

	// MLflow & ML
	createLoggedModel: z.object({
		name: z.string(),
		experiment_id: z.string(),
	}),
	createMlExperiment: z.object({
		name: z.string(),
		artifact_location: z.string().optional(),
	}),
	createMlFeatureStoreOnlineStore: z.object({
		name: z.string(),
		store_type: z.string(),
	}),
	createMlForecastingExperiment: z.object({
		name: z.string(),
		target_col: z.string(),
	}),
	createMlflowExperimentRun: z.object({
		experiment_id: z.string(),
		name: z.string().optional(),
	}),
	deleteLoggedModel: z.object({
		model_id: z.string(),
	}),
	deleteLoggedModelTag: z.object({
		model_id: z.string(),
		key: z.string(),
	}),
	deleteMlExperiment: z.object({
		experiment_id: z.string(),
	}),
	deleteMlExperimentRun: z.object({
		run_id: z.string(),
	}),
	deleteMlExperimentRunTag: z.object({
		run_id: z.string(),
		key: z.string(),
	}),
	deleteMlExperimentRuns: z.object({
		experiment_id: z.string(),
		max_timestamp_millis: z.number(),
	}),
	deleteMlFeatureEngKafkaConfig: z.object({
		config_id: z.string(),
	}),
	deleteMlFeatureStoreOnlineStore: z.object({
		name: z.string(),
	}),
	deleteMlFeatureTag: z.object({
		feature_table_name: z.string(),
		feature_name: z.string(),
		tag_key: z.string(),
	}),

	// OAuth & Security Settings
	createOAuthServicePrincipalSecret: z.object({
		account_id: z.string(),
		service_principal_id: z.string(),
	}),
	createPersonalAccessToken: z.object({
		comment: z.string().optional(),
		lifetime_seconds: z.number().optional(),
	}),
	createNotificationDestination: z.object({
		display_name: z.string(),
		config: z.record(z.string(), z.unknown()),
	}),
	deleteNotificationDestination: z.object({
		id: z.string(),
	}),
	deleteOAuth2ServicePrincipalSecret: z.object({
		account_id: z.string(),
		service_principal_id: z.string(),
		secret_id: z.string(),
	}),
	deleteTokenManagement: z.object({
		token_id: z.string(),
	}),

	// Serving Endpoints & Vector Search
	createProvisionedThroughputEndpoint: z.object({
		name: z.string(),
		config: z.record(z.string(), z.unknown()),
	}),
	createVectorSearchEndpoint: z.object({
		name: z.string(),
		endpoint_type: z.string(),
	}),
	deleteServingEndpoint: z.object({
		name: z.string(),
	}),
	deleteVectorSearchIndex: z.object({
		name: z.string(),
	}),

	// Sharing
	createShare: z.object({
		name: z.string(),
	}),
	createSharingProvider: z.object({
		name: z.string(),
		authentication_type: z.string(),
	}),
	createSharingRecipient: z.object({
		name: z.string(),
		authentication_type: z.string(),
	}),
	deleteShare: z.object({
		name: z.string(),
	}),
	deleteSharingRecipient: z.object({
		name: z.string(),
	}),

	// Workspace & Secrets & Git & Repos
	createSecretScope: z.object({
		scope: z.string(),
		initial_manage_principal: z.string().optional(),
	}),
	createTagPolicy: z.object({
		tag_key: z.string(),
		values: z.array(z.string()).optional(),
	}),
	createWorkspaceDirectory: z.object({
		path: z.string(),
	}),
	createWorkspaceGitCredentials: z.object({
		git_username: z.string(),
		git_provider: z.string(),
		personal_access_token: z.string(),
	}),
	createWorkspaceRepo: z.object({
		url: z.string(),
		provider: z.string(),
		path: z.string().optional(),
	}),
	deleteAibiDashboardEmbeddingAccessPolicy: z.object({}),
	deleteAibiDashboardEmbeddingApprovedDomains: z.object({}),
	deleteCustomLlmAgent: z.object({
		agent_id: z.string(),
	}),
	deleteDashboardEmailSubscriptionsSetting: z.object({}),
	deleteDatabricksPipeline: z.object({
		pipeline_id: z.string(),
	}),
	deleteDefaultNamespaceSetting: z.object({}),
	deleteDefaultWarehouseIdSetting: z.object({}),
	deleteDisableLegacyAccessSetting: z.object({}),
	deleteDisableLegacyDbfsSetting: z.object({}),
	deleteLlmProxyPartnerSetting: z.object({}),
	deleteRestrictWorkspaceAdminsSetting: z.object({}),
	deleteSqlResultsDownloadSetting: z.object({}),
	deleteSecretScope: z.object({
		scope: z.string(),
	}),
	deleteSecretsAcl: z.object({
		scope: z.string(),
		principal: z.string(),
	}),
	deleteTagPolicy: z.object({
		tag_key: z.string(),
	}),
	deleteWorkspaceGitCredentials: z.object({
		credential_id: z.number(),
	}),
	deleteWorkspaceObject: z.object({
		path: z.string(),
		recursive: z.boolean().optional(),
	}),
	deleteWorkspaceRepo: z.object({
		repo_id: z.number(),
	}),
	deleteWorkspaceSecret: z.object({
		scope: z.string(),
		key: z.string(),
	}),
};

export const DatabricksEndpointOutputSchemas = {
	addBlockToDbfsStream: z.object({ success: z.boolean() }),
	createDbfsFileStream: z.object({ handle: z.number() }),
	deleteDbfsFileOrDirectory: z.object({ success: z.boolean() }),
	addComputeInstanceProfile: z.object({ success: z.boolean() }),
	createComputeClusterPolicy: z.object({ policy_id: z.string() }),
	createComputeInstancePool: z.object({ instance_pool_id: z.string() }),
	createDatabricksCluster: z.object({ cluster_id: z.string() }),
	createGlobalInitScript: z.object({ script_id: z.string() }),
	deleteComputeClusterPolicy: z.object({ success: z.boolean() }),
	deleteComputeInstancePool: z.object({ success: z.boolean() }),
	deleteDatabricksCluster: z.object({ success: z.boolean() }),
	deleteGlobalInitScript: z.object({ success: z.boolean() }),
	addMemberToSecurityGroup: z.object({ success: z.boolean() }),
	createIamGroupV2: z.object({ id: z.string(), displayName: z.string() }),
	createIamServicePrincipalV2: z.object({
		id: z.string(),
		applicationId: z.string(),
	}),
	createIamUserV2: z.object({ id: z.string(), userName: z.string() }),
	createIpAccessList: z.object({
		ip_access_list: z.object({ list_id: z.string() }),
	}),
	deleteIamGroupV2: z.object({ success: z.boolean() }),
	deleteIamServicePrincipalV2: z.object({ success: z.boolean() }),
	deleteIamUserV2: z.object({ success: z.boolean() }),
	assignMetastoreToWorkspace: z.object({ success: z.boolean() }),
	batchCreateAccessRequests: z.object({
		responses: z.array(z.unknown()).optional(),
	}),
	checkTableExists: z.object({ exists: z.boolean() }),
	createCatalogConnection: z.object({ name: z.string() }),
	createCatalogCredential: z.object({ name: z.string() }),
	createExternalLocation: z.object({ name: z.string() }),
	createMetastore: z.object({ metastore_id: z.string() }),
	createStorageCredential: z.object({ name: z.string() }),
	deleteCatalog: z.object({ success: z.boolean() }),
	deleteCatalogConnection: z.object({ success: z.boolean() }),
	deleteCatalogCredential: z.object({ success: z.boolean() }),
	deleteCatalogTable: z.object({ success: z.boolean() }),
	deleteExternalLocation: z.object({ success: z.boolean() }),
	deleteMetastore: z.object({ success: z.boolean() }),
	deleteOnlineTable: z.object({ success: z.boolean() }),
	deleteStorageCredential: z.object({ success: z.boolean() }),
	disableSystemSchema: z.object({ success: z.boolean() }),
	batchGetMarketplaceConsumerListings: z.object({
		listings: z.array(z.record(z.string(), z.unknown())),
	}),
	batchGetMarketplaceConsumerProviders: z.object({
		providers: z.array(z.record(z.string(), z.unknown())),
	}),
	createMarketplaceConsumerInstallation: z.object({ id: z.string() }),
	createMarketplaceProviderListing: z.object({ id: z.string() }),
	createProviderAnalyticsDashboard: z.object({
		dashboard_id: z.string().optional(),
	}),
	deleteListingFromExchange: z.object({ success: z.boolean() }),
	deleteMarketplaceConsumerInstallation: z.object({ success: z.boolean() }),
	cancelAllJobRuns: z.object({ success: z.boolean() }),
	cancelJobRun: z.object({ success: z.boolean() }),
	deleteDatabricksJobRun: z.object({ success: z.boolean() }),
	cancelSqlStatementExecution: z.object({ status: z.string() }),
	createLegacySqlAlert: z.object({ id: z.string() }),
	createLegacySqlQuery: z.object({ id: z.string() }),
	createLegacySqlQueryVisualization: z.object({ id: z.string() }),
	createSqlAlert: z.object({ id: z.string() }),
	createSqlQuery: z.object({ id: z.string() }),
	createSqlQueryVisualization: z.object({ id: z.string() }),
	deleteLegacySqlAlert: z.object({ success: z.boolean() }),
	deleteLegacySqlQuery: z.object({ success: z.boolean() }),
	deleteLegacySqlQueryVisualization: z.object({ success: z.boolean() }),
	deleteSqlAlert: z.object({ success: z.boolean() }),
	deleteSqlDashboard: z.object({ success: z.boolean() }),
	deleteSqlQuery: z.object({ success: z.boolean() }),
	deleteSqlWarehouse: z.object({ success: z.boolean() }),
	createCleanRoom: z.object({
		name: z.string(),
		status: z.string().optional(),
	}),
	createCleanRoomAutoApprovalRule: z.object({ rule_id: z.string().optional() }),
	createDataQualityMonitor: z.object({ monitor_id: z.string().optional() }),
	createQualityMonitorV2: z.object({ monitor_id: z.string().optional() }),
	createDatabaseInstance: z.object({
		name: z.string(),
		status: z.string().optional(),
	}),
	deleteDatabaseInstance: z.object({ success: z.boolean() }),
	deleteSyncedDatabaseTable: z.object({ success: z.boolean() }),
	createDatabricksApp: z.object({ name: z.string() }),
	deleteDatabricksApp: z.object({ success: z.boolean() }),
	deployDatabricksApp: z.object({ deployment_id: z.string().optional() }),
	createGenieMessage: z.object({
		message_id: z.string().optional(),
		status: z.string().optional(),
	}),
	createGenieSpace: z.object({ space_id: z.string() }),
	createLakeviewDashboard: z.object({ dashboard_id: z.string().optional() }),
	deleteGenieConversation: z.object({ success: z.boolean() }),
	deleteGenieConversationMessage: z.object({ success: z.boolean() }),
	deleteLakeviewDashboardSchedule: z.object({ success: z.boolean() }),
	createLoggedModel: z.object({ model_id: z.string() }),
	createMlExperiment: z.object({ experiment_id: z.string() }),
	createMlFeatureStoreOnlineStore: z.object({ name: z.string() }),
	createMlForecastingExperiment: z.object({ experiment_id: z.string() }),
	createMlflowExperimentRun: z.object({ run_id: z.string() }),
	deleteLoggedModel: z.object({ success: z.boolean() }),
	deleteLoggedModelTag: z.object({ success: z.boolean() }),
	deleteMlExperiment: z.object({ success: z.boolean() }),
	deleteMlExperimentRun: z.object({ success: z.boolean() }),
	deleteMlExperimentRunTag: z.object({ success: z.boolean() }),
	deleteMlExperimentRuns: z.object({ success: z.boolean() }),
	deleteMlFeatureEngKafkaConfig: z.object({ success: z.boolean() }),
	deleteMlFeatureStoreOnlineStore: z.object({ success: z.boolean() }),
	deleteMlFeatureTag: z.object({ success: z.boolean() }),
	createOAuthServicePrincipalSecret: z.object({
		secret_id: z.string(),
		secret_value: z.string().optional(),
	}),
	createPersonalAccessToken: z.object({
		token_value: z.string().optional(),
		token_info: z.record(z.string(), z.unknown()).optional(),
	}),
	createNotificationDestination: z.object({ id: z.string() }),
	deleteNotificationDestination: z.object({ success: z.boolean() }),
	deleteOAuth2ServicePrincipalSecret: z.object({ success: z.boolean() }),
	deleteTokenManagement: z.object({ success: z.boolean() }),
	createProvisionedThroughputEndpoint: z.object({ name: z.string() }),
	createVectorSearchEndpoint: z.object({ name: z.string() }),
	deleteServingEndpoint: z.object({ success: z.boolean() }),
	deleteVectorSearchIndex: z.object({ success: z.boolean() }),
	createShare: z.object({ name: z.string() }),
	createSharingProvider: z.object({ name: z.string() }),
	createSharingRecipient: z.object({ name: z.string() }),
	deleteShare: z.object({ success: z.boolean() }),
	deleteSharingRecipient: z.object({ success: z.boolean() }),
	createSecretScope: z.object({ success: z.boolean() }),
	createTagPolicy: z.object({ tag_key: z.string() }),
	createWorkspaceDirectory: z.object({ success: z.boolean() }),
	createWorkspaceGitCredentials: z.object({
		credential_id: z.number().optional(),
	}),
	createWorkspaceRepo: z.object({ id: z.number().optional() }),
	deleteAibiDashboardEmbeddingAccessPolicy: z.object({ success: z.boolean() }),
	deleteAibiDashboardEmbeddingApprovedDomains: z.object({
		success: z.boolean(),
	}),
	deleteCustomLlmAgent: z.object({ success: z.boolean() }),
	deleteDashboardEmailSubscriptionsSetting: z.object({ success: z.boolean() }),
	deleteDatabricksPipeline: z.object({ success: z.boolean() }),
	deleteDefaultNamespaceSetting: z.object({ success: z.boolean() }),
	deleteDefaultWarehouseIdSetting: z.object({ success: z.boolean() }),
	deleteDisableLegacyAccessSetting: z.object({ success: z.boolean() }),
	deleteDisableLegacyDbfsSetting: z.object({ success: z.boolean() }),
	deleteLlmProxyPartnerSetting: z.object({ success: z.boolean() }),
	deleteRestrictWorkspaceAdminsSetting: z.object({ success: z.boolean() }),
	deleteSqlResultsDownloadSetting: z.object({ success: z.boolean() }),
	deleteSecretScope: z.object({ success: z.boolean() }),
	deleteSecretsAcl: z.object({ success: z.boolean() }),
	deleteTagPolicy: z.object({ success: z.boolean() }),
	deleteWorkspaceGitCredentials: z.object({ success: z.boolean() }),
	deleteWorkspaceObject: z.object({ success: z.boolean() }),
	deleteWorkspaceRepo: z.object({ success: z.boolean() }),
	deleteWorkspaceSecret: z.object({ success: z.boolean() }),
};

export type DatabricksEndpointInputs = {
	[K in keyof typeof DatabricksEndpointInputSchemas]: z.infer<
		(typeof DatabricksEndpointInputSchemas)[K]
	>;
};

export type DatabricksEndpointOutputs = {
	[K in keyof typeof DatabricksEndpointOutputSchemas]: z.infer<
		(typeof DatabricksEndpointOutputSchemas)[K]
	>;
};
