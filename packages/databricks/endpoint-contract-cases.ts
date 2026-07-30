// Auto-generated endpoint contract cases (130 endpoints)
export const endpointContractCases = [
	{
		mod: 'Dbfs',
		fn: 'addBlockToDbfsStream',
		endpoint: 'dbfs/add-block',
		method: 'POST',
		input: {
			handle: 1,
			data: 'SGVsbG8=',
		},
		expectedBody: {
			handle: 1,
			data: 'SGVsbG8=',
		},
	},
	{
		mod: 'Dbfs',
		fn: 'createDbfsFileStream',
		endpoint: 'dbfs/create',
		method: 'POST',
		input: {
			path: '/tmp/test.txt',
		},
		expectedBody: {
			path: '/tmp/test.txt',
		},
	},
	{
		mod: 'Dbfs',
		fn: 'deleteDbfsFileOrDirectory',
		endpoint: 'dbfs/delete',
		method: 'POST',
		input: {
			path: '/tmp/test.txt',
		},
		expectedBody: {
			path: '/tmp/test.txt',
		},
	},
	{
		mod: 'Compute',
		fn: 'addComputeInstanceProfile',
		endpoint: 'instance-profiles/add',
		method: 'POST',
		input: {
			instance_profile_arn: 'arn:aws:iam::123:instance-profile/role',
		},
		expectedBody: {
			instance_profile_arn: 'arn:aws:iam::123:instance-profile/role',
		},
	},
	{
		mod: 'Compute',
		fn: 'createComputeClusterPolicy',
		endpoint: 'policies/clusters/create',
		method: 'POST',
		input: {
			name: 'Policy 1',
		},
		expectedBody: {
			name: 'Policy 1',
		},
	},
	{
		mod: 'Compute',
		fn: 'createComputeInstancePool',
		endpoint: 'instance-pools/create',
		method: 'POST',
		input: {
			instance_pool_name: 'Pool 1',
			node_type_id: 'i3.xlarge',
		},
		expectedBody: {
			instance_pool_name: 'Pool 1',
			node_type_id: 'i3.xlarge',
		},
	},
	{
		mod: 'Compute',
		fn: 'createDatabricksCluster',
		endpoint: 'clusters/create',
		method: 'POST',
		input: {
			cluster_name: 'Test',
			spark_version: '13.3.x',
			node_type_id: 'i3.xlarge',
		},
		expectedBody: {
			cluster_name: 'Test',
			spark_version: '13.3.x',
			node_type_id: 'i3.xlarge',
		},
	},
	{
		mod: 'Compute',
		fn: 'createGlobalInitScript',
		endpoint: 'global-init-scripts',
		method: 'POST',
		input: {
			name: 'init.sh',
			script: 'ZWNobyAx',
		},
		expectedBody: {
			name: 'init.sh',
			script: 'ZWNobyAx',
		},
	},
	{
		mod: 'Compute',
		fn: 'deleteComputeClusterPolicy',
		endpoint: 'policies/clusters/delete',
		method: 'POST',
		input: {
			policy_id: 'p-123',
		},
		expectedBody: {
			policy_id: 'p-123',
		},
	},
	{
		mod: 'Compute',
		fn: 'deleteComputeInstancePool',
		endpoint: 'instance-pools/delete',
		method: 'POST',
		input: {
			instance_pool_id: 'ip-123',
		},
		expectedBody: {
			instance_pool_id: 'ip-123',
		},
	},
	{
		mod: 'Compute',
		fn: 'deleteDatabricksCluster',
		endpoint: 'clusters/delete',
		method: 'POST',
		input: {
			cluster_id: 'c-123',
		},
		expectedBody: {
			cluster_id: 'c-123',
		},
	},
	{
		mod: 'Compute',
		fn: 'deleteGlobalInitScript',
		endpoint: 'global-init-scripts/s-123',
		method: 'DELETE',
		input: {
			script_id: 's-123',
		},
	},
	{
		mod: 'Iam',
		fn: 'addMemberToSecurityGroup',
		endpoint: 'groups/g-1/members',
		method: 'POST',
		input: {
			group_id: 'g-1',
			member_id: 'u-1',
		},
		expectedBody: {
			member_id: 'u-1',
		},
	},
	{
		mod: 'Iam',
		fn: 'createIamGroupV2',
		endpoint: 'preview/scim/v2/Groups',
		method: 'POST',
		input: {
			displayName: 'Eng',
		},
		expectedBody: {
			displayName: 'Eng',
		},
	},
	{
		mod: 'Iam',
		fn: 'createIamServicePrincipalV2',
		endpoint: 'preview/scim/v2/ServicePrincipals',
		method: 'POST',
		input: {
			applicationId: 'app-123',
		},
		expectedBody: {
			applicationId: 'app-123',
		},
	},
	{
		mod: 'Iam',
		fn: 'createIamUserV2',
		endpoint: 'preview/scim/v2/Users',
		method: 'POST',
		input: {
			userName: 'dev@company.com',
		},
		expectedBody: {
			userName: 'dev@company.com',
		},
	},
	{
		mod: 'Iam',
		fn: 'createIpAccessList',
		endpoint: 'ip-access-lists',
		method: 'POST',
		input: {
			label: 'Office',
			list_type: 'ALLOW',
			ip_addresses: ['1.2.3.4/32'],
		},
		expectedBody: {
			label: 'Office',
			list_type: 'ALLOW',
			ip_addresses: ['1.2.3.4/32'],
		},
	},
	{
		mod: 'Iam',
		fn: 'deleteIamGroupV2',
		endpoint: 'preview/scim/v2/Groups/g-123',
		method: 'DELETE',
		input: {
			id: 'g-123',
		},
	},
	{
		mod: 'Iam',
		fn: 'deleteIamServicePrincipalV2',
		endpoint: 'preview/scim/v2/ServicePrincipals/sp-123',
		method: 'DELETE',
		input: {
			id: 'sp-123',
		},
	},
	{
		mod: 'Iam',
		fn: 'deleteIamUserV2',
		endpoint: 'preview/scim/v2/Users/u-123',
		method: 'DELETE',
		input: {
			id: 'u-123',
		},
	},
	{
		mod: 'Catalog',
		fn: 'assignMetastoreToWorkspace',
		endpoint: 'unity-catalog/metastores/m-123/workspaces/100',
		method: 'PUT',
		input: {
			metastore_id: 'm-123',
			workspace_id: 100,
			default_catalog_name: 'main',
		},
		expectedBody: {
			default_catalog_name: 'main',
		},
	},
	{
		mod: 'Catalog',
		fn: 'batchCreateAccessRequests',
		endpoint: 'unity-catalog/access-requests/batch-create',
		method: 'POST',
		input: {
			requests: [],
		},
		expectedBody: {
			requests: [],
		},
	},
	{
		mod: 'Catalog',
		fn: 'checkTableExists',
		endpoint: 'unity-catalog/tables/main.default.events',
		method: 'GET',
		input: {
			catalog_name: 'main',
			schema_name: 'default',
			table_name: 'events',
		},
	},
	{
		mod: 'Catalog',
		fn: 'createCatalogConnection',
		endpoint: 'unity-catalog/connections',
		method: 'POST',
		input: {
			name: 'pg_conn',
			connection_type: 'POSTGRESQL',
			options: {
				host: 'localhost',
			},
		},
		expectedBody: {
			name: 'pg_conn',
			connection_type: 'POSTGRESQL',
			options: {
				host: 'localhost',
			},
		},
	},
	{
		mod: 'Catalog',
		fn: 'createCatalogCredential',
		endpoint: 'unity-catalog/credentials',
		method: 'POST',
		input: {
			name: 'aws_cred',
		},
		expectedBody: {
			name: 'aws_cred',
		},
	},
	{
		mod: 'Catalog',
		fn: 'createExternalLocation',
		endpoint: 'unity-catalog/external-locations',
		method: 'POST',
		input: {
			name: 'ext_s3',
			url: 's3://bucket/data',
			credential_name: 'aws_cred',
		},
		expectedBody: {
			name: 'ext_s3',
			url: 's3://bucket/data',
			credential_name: 'aws_cred',
		},
	},
	{
		mod: 'Catalog',
		fn: 'createMetastore',
		endpoint: 'unity-catalog/metastores',
		method: 'POST',
		input: {
			name: 'main_meta',
			storage_root: 's3://bucket/meta',
		},
		expectedBody: {
			name: 'main_meta',
			storage_root: 's3://bucket/meta',
		},
	},
	{
		mod: 'Catalog',
		fn: 'createStorageCredential',
		endpoint: 'unity-catalog/storage-credentials',
		method: 'POST',
		input: {
			name: 'aws_cred',
		},
		expectedBody: {
			name: 'aws_cred',
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteCatalog',
		endpoint: 'unity-catalog/catalogs/main',
		method: 'DELETE',
		input: {
			name: 'main',
			force: false,
		},
		expectedQuery: {
			force: false,
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteCatalogConnection',
		endpoint: 'unity-catalog/connections/pg_conn',
		method: 'DELETE',
		input: {
			name: 'pg_conn',
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteCatalogCredential',
		endpoint: 'unity-catalog/credentials/aws_cred',
		method: 'DELETE',
		input: {
			name: 'aws_cred',
			force: false,
		},
		expectedQuery: {
			force: false,
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteCatalogTable',
		endpoint: 'unity-catalog/tables/main.default.events',
		method: 'DELETE',
		input: {
			full_name: 'main.default.events',
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteExternalLocation',
		endpoint: 'unity-catalog/external-locations/ext_s3',
		method: 'DELETE',
		input: {
			name: 'ext_s3',
			force: false,
		},
		expectedQuery: {
			force: false,
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteMetastore',
		endpoint: 'unity-catalog/metastores/m-123',
		method: 'DELETE',
		input: {
			id: 'm-123',
			force: false,
		},
		expectedQuery: {
			force: false,
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteOnlineTable',
		endpoint: 'unity-catalog/online-tables/online_tbl',
		method: 'DELETE',
		input: {
			name: 'online_tbl',
		},
	},
	{
		mod: 'Catalog',
		fn: 'deleteStorageCredential',
		endpoint: 'unity-catalog/storage-credentials/aws_cred',
		method: 'DELETE',
		input: {
			name: 'aws_cred',
			force: false,
		},
		expectedQuery: {
			force: false,
		},
	},
	{
		mod: 'Catalog',
		fn: 'disableSystemSchema',
		endpoint: 'unity-catalog/metastores/m-123/system-schemas/system',
		method: 'DELETE',
		input: {
			metastore_id: 'm-123',
			schema_name: 'system',
		},
	},
	{
		mod: 'Marketplace',
		fn: 'batchGetMarketplaceConsumerListings',
		endpoint: 'marketplace/consumer/listings/batch-get',
		method: 'POST',
		input: {
			ids: ['l-1'],
		},
		expectedBody: {
			ids: ['l-1'],
		},
	},
	{
		mod: 'Marketplace',
		fn: 'batchGetMarketplaceConsumerProviders',
		endpoint: 'marketplace/consumer/providers/batch-get',
		method: 'POST',
		input: {
			ids: ['p-1'],
		},
		expectedBody: {
			ids: ['p-1'],
		},
	},
	{
		mod: 'Marketplace',
		fn: 'createMarketplaceConsumerInstallation',
		endpoint: 'marketplace/consumer/installations',
		method: 'POST',
		input: {
			listing_id: 'l-1',
		},
		expectedBody: {
			listing_id: 'l-1',
		},
	},
	{
		mod: 'Marketplace',
		fn: 'createMarketplaceProviderListing',
		endpoint: 'marketplace/provider/listings',
		method: 'POST',
		input: {
			name: 'Dataset',
			summary: 'Summary',
			listing_type: 'FREE',
		},
		expectedBody: {
			name: 'Dataset',
			summary: 'Summary',
			listing_type: 'FREE',
		},
	},
	{
		mod: 'Marketplace',
		fn: 'createProviderAnalyticsDashboard',
		endpoint: 'marketplace/provider/analytics-dashboards',
		method: 'POST',
		input: {},
		expectedBody: {},
	},
	{
		mod: 'Marketplace',
		fn: 'deleteListingFromExchange',
		endpoint: 'marketplace/provider/exchanges/e-1/listings/l-1',
		method: 'DELETE',
		input: {
			exchange_id: 'e-1',
			listing_id: 'l-1',
		},
	},
	{
		mod: 'Marketplace',
		fn: 'deleteMarketplaceConsumerInstallation',
		endpoint: 'marketplace/consumer/installations/inst-123',
		method: 'DELETE',
		input: {
			id: 'inst-123',
		},
	},
	{
		mod: 'Jobs',
		fn: 'cancelAllJobRuns',
		endpoint: 'jobs/runs/cancel-all',
		method: 'POST',
		input: {
			job_id: 10,
		},
		expectedBody: {
			job_id: 10,
		},
	},
	{
		mod: 'Jobs',
		fn: 'cancelJobRun',
		endpoint: 'jobs/runs/cancel',
		method: 'POST',
		input: {
			run_id: 10,
		},
		expectedBody: {
			run_id: 10,
		},
	},
	{
		mod: 'Jobs',
		fn: 'deleteDatabricksJobRun',
		endpoint: 'jobs/runs/delete',
		method: 'POST',
		input: {
			run_id: 10,
		},
		expectedBody: {
			run_id: 10,
		},
	},
	{
		mod: 'Sql',
		fn: 'cancelSqlStatementExecution',
		endpoint: 'sql/statements/stmt-1/cancel',
		method: 'POST',
		input: {
			statement_id: 'stmt-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'createLegacySqlAlert',
		endpoint: 'preview/sql/alerts',
		method: 'POST',
		input: {
			name: 'Alert',
			query_id: 'q-1',
		},
		expectedBody: {
			name: 'Alert',
			query_id: 'q-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'createLegacySqlQuery',
		endpoint: 'preview/sql/queries',
		method: 'POST',
		input: {
			name: 'Query',
			query: 'SELECT 1',
			data_source_id: 'ds-1',
		},
		expectedBody: {
			name: 'Query',
			query: 'SELECT 1',
			data_source_id: 'ds-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'createLegacySqlQueryVisualization',
		endpoint: 'preview/sql/visualizations',
		method: 'POST',
		input: {
			query_id: 'q-1',
			type: 'table',
			name: 'Vis',
		},
		expectedBody: {
			query_id: 'q-1',
			type: 'table',
			name: 'Vis',
		},
	},
	{
		mod: 'Sql',
		fn: 'createSqlAlert',
		endpoint: 'sql/alerts',
		method: 'POST',
		input: {
			name: 'Alert',
			query_id: 'q-1',
		},
		expectedBody: {
			name: 'Alert',
			query_id: 'q-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'createSqlQuery',
		endpoint: 'sql/queries',
		method: 'POST',
		input: {
			name: 'Query',
			query: 'SELECT 1',
			warehouse_id: 'w-1',
		},
		expectedBody: {
			name: 'Query',
			query: 'SELECT 1',
			warehouse_id: 'w-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'createSqlQueryVisualization',
		endpoint: 'sql/visualizations',
		method: 'POST',
		input: {
			query_id: 'q-1',
			type: 'table',
			name: 'Vis',
		},
		expectedBody: {
			query_id: 'q-1',
			type: 'table',
			name: 'Vis',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteLegacySqlAlert',
		endpoint: 'preview/sql/alerts/a-1',
		method: 'DELETE',
		input: {
			id: 'a-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteLegacySqlQuery',
		endpoint: 'preview/sql/queries/q-1',
		method: 'DELETE',
		input: {
			id: 'q-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteLegacySqlQueryVisualization',
		endpoint: 'preview/sql/visualizations/v-1',
		method: 'DELETE',
		input: {
			id: 'v-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteSqlAlert',
		endpoint: 'sql/alerts/a-1',
		method: 'DELETE',
		input: {
			id: 'a-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteSqlDashboard',
		endpoint: 'sql/dashboards/d-1',
		method: 'DELETE',
		input: {
			id: 'd-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteSqlQuery',
		endpoint: 'sql/queries/q-1',
		method: 'DELETE',
		input: {
			id: 'q-1',
		},
	},
	{
		mod: 'Sql',
		fn: 'deleteSqlWarehouse',
		endpoint: 'sql/warehouses/w-1',
		method: 'DELETE',
		input: {
			id: 'w-1',
		},
	},
	{
		mod: 'Cleanrooms',
		fn: 'createCleanRoom',
		endpoint: 'clean-rooms',
		method: 'POST',
		input: {
			name: 'room_1',
			collaborators: [
				{
					collaborator_alias: 'collab',
				},
			],
		},
		expectedBody: {
			name: 'room_1',
			collaborators: [
				{
					collaborator_alias: 'collab',
				},
			],
		},
	},
	{
		mod: 'Cleanrooms',
		fn: 'createCleanRoomAutoApprovalRule',
		endpoint: 'clean-rooms/auto-approval-rules',
		method: 'POST',
		input: {
			clean_room_name: 'room_1',
		},
		expectedBody: {
			clean_room_name: 'room_1',
		},
	},
	{
		mod: 'Dataquality',
		fn: 'createDataQualityMonitor',
		endpoint: 'quality-monitors',
		method: 'POST',
		input: {
			table_name: 'main.default.tbl',
			assets_dir: '/assets',
			output_schema_name: 'main.default',
		},
		expectedBody: {
			table_name: 'main.default.tbl',
			assets_dir: '/assets',
			output_schema_name: 'main.default',
		},
	},
	{
		mod: 'Dataquality',
		fn: 'createQualityMonitorV2',
		endpoint: 'quality-monitors-v2',
		method: 'POST',
		input: {
			table_name: 'main.default.tbl',
			assets_dir: '/assets',
			output_schema_name: 'main.default',
		},
		expectedBody: {
			table_name: 'main.default.tbl',
			assets_dir: '/assets',
			output_schema_name: 'main.default',
		},
	},
	{
		mod: 'Database',
		fn: 'createDatabaseInstance',
		endpoint: 'database/instances',
		method: 'POST',
		input: {
			name: 'lakebase_db',
		},
		expectedBody: {
			name: 'lakebase_db',
		},
	},
	{
		mod: 'Database',
		fn: 'deleteDatabaseInstance',
		endpoint: 'database/instances/lakebase_db',
		method: 'DELETE',
		input: {
			name: 'lakebase_db',
		},
	},
	{
		mod: 'Database',
		fn: 'deleteSyncedDatabaseTable',
		endpoint: 'database/synced-tables/synced_tbl',
		method: 'DELETE',
		input: {
			name: 'synced_tbl',
		},
	},
	{
		mod: 'Apps',
		fn: 'createDatabricksApp',
		endpoint: 'apps',
		method: 'POST',
		input: {
			name: 'my_app',
		},
		expectedBody: {
			name: 'my_app',
		},
	},
	{
		mod: 'Apps',
		fn: 'deleteDatabricksApp',
		endpoint: 'apps/my_app',
		method: 'DELETE',
		input: {
			name: 'my_app',
		},
	},
	{
		mod: 'Apps',
		fn: 'deployDatabricksApp',
		endpoint: 'apps/my_app/deployments',
		method: 'POST',
		input: {
			name: 'my_app',
			source_code_path: '/path',
		},
		expectedBody: {
			name: 'my_app',
			source_code_path: '/path',
		},
	},
	{
		mod: 'Dashboards',
		fn: 'createGenieMessage',
		endpoint: 'genie/spaces/sp-1/conversations/c-1/messages',
		method: 'POST',
		input: {
			space_id: 'sp-1',
			conversation_id: 'c-1',
			content: 'Hello',
		},
		expectedBody: {
			content: 'Hello',
		},
	},
	{
		mod: 'Dashboards',
		fn: 'createGenieSpace',
		endpoint: 'genie/spaces',
		method: 'POST',
		input: {
			warehouse_id: 'w-1',
			serialized_space: '{}',
		},
		expectedBody: {
			warehouse_id: 'w-1',
			serialized_space: '{}',
		},
	},
	{
		mod: 'Dashboards',
		fn: 'createLakeviewDashboard',
		endpoint: 'lakeview/dashboards',
		method: 'POST',
		input: {
			display_name: 'Dash',
			serialized_dashboard: '{}',
		},
		expectedBody: {
			display_name: 'Dash',
			serialized_dashboard: '{}',
		},
	},
	{
		mod: 'Dashboards',
		fn: 'deleteGenieConversation',
		endpoint: 'genie/spaces/sp-1/conversations/c-1',
		method: 'DELETE',
		input: {
			space_id: 'sp-1',
			conversation_id: 'c-1',
		},
	},
	{
		mod: 'Dashboards',
		fn: 'deleteGenieConversationMessage',
		endpoint: 'genie/spaces/sp-1/conversations/c-1/messages/m-1',
		method: 'DELETE',
		input: {
			space_id: 'sp-1',
			conversation_id: 'c-1',
			message_id: 'm-1',
		},
	},
	{
		mod: 'Dashboards',
		fn: 'deleteLakeviewDashboardSchedule',
		endpoint: 'lakeview/dashboards/d-1/schedules/s-1',
		method: 'DELETE',
		input: {
			dashboard_id: 'd-1',
			schedule_id: 's-1',
		},
	},
	{
		mod: 'Ml',
		fn: 'createLoggedModel',
		endpoint: 'mlflow/logged-models/create',
		method: 'POST',
		input: {
			name: 'model_v1',
			experiment_id: 'exp-123',
		},
		expectedBody: {
			name: 'model_v1',
			experiment_id: 'exp-123',
		},
	},
	{
		mod: 'Ml',
		fn: 'createMlExperiment',
		endpoint: 'mlflow/experiments/create',
		method: 'POST',
		input: {
			name: 'churn_exp',
		},
		expectedBody: {
			name: 'churn_exp',
		},
	},
	{
		mod: 'Ml',
		fn: 'createMlFeatureStoreOnlineStore',
		endpoint: 'feature-store/online-stores',
		method: 'POST',
		input: {
			name: 'store-123',
			store_type: 'ONLINE',
		},
		expectedBody: {
			name: 'store-123',
			store_type: 'ONLINE',
		},
	},
	{
		mod: 'Ml',
		fn: 'createMlForecastingExperiment',
		endpoint: 'automl/forecasting/experiments',
		method: 'POST',
		input: {
			name: 'forecast',
			target_col: 'y',
		},
		expectedBody: {
			name: 'forecast',
			target_col: 'y',
		},
	},
	{
		mod: 'Ml',
		fn: 'createMlflowExperimentRun',
		endpoint: 'mlflow/runs/create',
		method: 'POST',
		input: {
			experiment_id: 'exp-123',
		},
		expectedBody: {
			experiment_id: 'exp-123',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteLoggedModel',
		endpoint: 'mlflow/logged-models/m-123',
		method: 'DELETE',
		input: {
			model_id: 'm-123',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteLoggedModelTag',
		endpoint: 'mlflow/logged-models/m-123/tags/env',
		method: 'DELETE',
		input: {
			model_id: 'm-123',
			key: 'env',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlExperiment',
		endpoint: 'mlflow/experiments/delete',
		method: 'POST',
		input: {
			experiment_id: 'exp-123',
		},
		expectedBody: {
			experiment_id: 'exp-123',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlExperimentRun',
		endpoint: 'mlflow/runs/delete',
		method: 'POST',
		input: {
			run_id: 'run-123',
		},
		expectedBody: {
			run_id: 'run-123',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlExperimentRunTag',
		endpoint: 'mlflow/runs/delete-tag',
		method: 'POST',
		input: {
			run_id: 'run-123',
			key: 'env',
		},
		expectedBody: {
			run_id: 'run-123',
			key: 'env',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlExperimentRuns',
		endpoint: 'mlflow/runs/delete-bulk',
		method: 'POST',
		input: {
			experiment_id: 'exp-123',
			max_timestamp_millis: 0,
		},
		expectedBody: {
			experiment_id: 'exp-123',
			max_timestamp_millis: 0,
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlFeatureEngKafkaConfig',
		endpoint: 'feature-store/kafka-configs/cfg-1',
		method: 'DELETE',
		input: {
			config_id: 'cfg-1',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlFeatureStoreOnlineStore',
		endpoint: 'feature-store/online-stores/store-123',
		method: 'DELETE',
		input: {
			name: 'store-123',
		},
	},
	{
		mod: 'Ml',
		fn: 'deleteMlFeatureTag',
		endpoint: 'feature-store/feature-tables/ft/features/f1/tags/env',
		method: 'DELETE',
		input: {
			feature_table_name: 'ft',
			feature_name: 'f1',
			tag_key: 'env',
		},
	},
	{
		mod: 'Security',
		fn: 'createOAuthServicePrincipalSecret',
		endpoint: 'accounts/servicePrincipals/sp-123/credentials/secrets',
		method: 'POST',
		input: {
			service_principal_id: 'sp-123',
		},
	},
	{
		mod: 'Security',
		fn: 'createPersonalAccessToken',
		endpoint: 'token/create',
		method: 'POST',
		input: {
			comment: 'test',
			lifetime_seconds: 3600,
		},
		expectedBody: {
			comment: 'test',
			lifetime_seconds: 3600,
		},
	},
	{
		mod: 'Security',
		fn: 'createNotificationDestination',
		endpoint: 'notification-destinations',
		method: 'POST',
		input: {
			display_name: 'Email',
			config: {
				addresses: ['a@b.com'],
			},
		},
		expectedBody: {
			display_name: 'Email',
			config: {
				addresses: ['a@b.com'],
			},
		},
	},
	{
		mod: 'Security',
		fn: 'deleteNotificationDestination',
		endpoint: 'notification-destinations/nd-123',
		method: 'DELETE',
		input: {
			id: 'nd-123',
		},
	},
	{
		mod: 'Security',
		fn: 'deleteOAuth2ServicePrincipalSecret',
		endpoint: 'accounts/servicePrincipals/sp-123/credentials/secrets/sec-123',
		method: 'DELETE',
		input: {
			service_principal_id: 'sp-123',
			secret_id: 'sec-123',
		},
	},
	{
		mod: 'Security',
		fn: 'deleteTokenManagement',
		endpoint: 'token-management/tokens/tok-123',
		method: 'DELETE',
		input: {
			token_id: 'tok-123',
		},
	},
	{
		mod: 'Serving',
		fn: 'createProvisionedThroughputEndpoint',
		endpoint: 'serving-endpoints',
		method: 'POST',
		input: {
			name: 'llm_endpoint',
			config: {},
		},
		expectedBody: {
			name: 'llm_endpoint',
			config: {},
		},
	},
	{
		mod: 'Serving',
		fn: 'createVectorSearchEndpoint',
		endpoint: 'vector-search/endpoints',
		method: 'POST',
		input: {
			name: 'vs_endpoint',
			endpoint_type: 'STANDARD',
		},
		expectedBody: {
			name: 'vs_endpoint',
			endpoint_type: 'STANDARD',
		},
	},
	{
		mod: 'Serving',
		fn: 'deleteServingEndpoint',
		endpoint: 'serving-endpoints/llm_endpoint',
		method: 'DELETE',
		input: {
			name: 'llm_endpoint',
		},
	},
	{
		mod: 'Serving',
		fn: 'deleteVectorSearchIndex',
		endpoint: 'vector-search/indexes/idx-1',
		method: 'DELETE',
		input: {
			name: 'idx-1',
		},
	},
	{
		mod: 'Sharing',
		fn: 'createShare',
		endpoint: 'unity-catalog/shares',
		method: 'POST',
		input: {
			name: 's-1',
		},
		expectedBody: {
			name: 's-1',
		},
	},
	{
		mod: 'Sharing',
		fn: 'createSharingProvider',
		endpoint: 'unity-catalog/providers',
		method: 'POST',
		input: {
			name: 'p-1',
			authentication_type: 'TOKEN',
		},
		expectedBody: {
			name: 'p-1',
			authentication_type: 'TOKEN',
		},
	},
	{
		mod: 'Sharing',
		fn: 'createSharingRecipient',
		endpoint: 'unity-catalog/recipients',
		method: 'POST',
		input: {
			name: 'r-1',
			authentication_type: 'TOKEN',
		},
		expectedBody: {
			name: 'r-1',
			authentication_type: 'TOKEN',
		},
	},
	{
		mod: 'Sharing',
		fn: 'deleteShare',
		endpoint: 'unity-catalog/shares/s-1',
		method: 'DELETE',
		input: {
			name: 's-1',
		},
	},
	{
		mod: 'Sharing',
		fn: 'deleteSharingRecipient',
		endpoint: 'unity-catalog/recipients/r-1',
		method: 'DELETE',
		input: {
			name: 'r-1',
		},
	},
	{
		mod: 'Workspace',
		fn: 'createSecretScope',
		endpoint: 'secrets/scopes/create',
		method: 'POST',
		input: {
			scope: 'my_scope',
		},
		expectedBody: {
			scope: 'my_scope',
		},
	},
	{
		mod: 'Workspace',
		fn: 'createTagPolicy',
		endpoint: 'tags/tag-policies',
		method: 'POST',
		input: {
			tag_key: 'environment',
		},
		expectedBody: {
			tag_key: 'environment',
		},
	},
	{
		mod: 'Workspace',
		fn: 'createWorkspaceDirectory',
		endpoint: 'workspace/mkdirs',
		method: 'POST',
		input: {
			path: '/Workspace/Shared',
		},
		expectedBody: {
			path: '/Workspace/Shared',
		},
	},
	{
		mod: 'Workspace',
		fn: 'createWorkspaceGitCredentials',
		endpoint: 'git-credentials',
		method: 'POST',
		input: {
			git_username: 'user',
			git_provider: 'gitHub',
			personal_access_token: 'pat123',
		},
		expectedBody: {
			git_username: 'user',
			git_provider: 'gitHub',
			personal_access_token: 'pat123',
		},
	},
	{
		mod: 'Workspace',
		fn: 'createWorkspaceRepo',
		endpoint: 'repos',
		method: 'POST',
		input: {
			url: 'https://github.com/repo',
			provider: 'gitHub',
		},
		expectedBody: {
			url: 'https://github.com/repo',
			provider: 'gitHub',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteAibiDashboardEmbeddingAccessPolicy',
		endpoint: 'settings/aibi-dashboard-embedding-access-policy',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteAibiDashboardEmbeddingApprovedDomains',
		endpoint: 'settings/aibi-dashboard-embedding-approved-domains',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteCustomLlmAgent',
		endpoint: 'agent-bricks/custom-llms/agent-1',
		method: 'DELETE',
		input: {
			agent_id: 'agent-1',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteDashboardEmailSubscriptionsSetting',
		endpoint: 'settings/dashboard-email-subscriptions',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteDatabricksPipeline',
		endpoint: 'pipelines/pipe-1',
		method: 'DELETE',
		input: {
			pipeline_id: 'pipe-1',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteDefaultNamespaceSetting',
		endpoint: 'settings/default-namespace',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteDefaultWarehouseIdSetting',
		endpoint: 'settings/default-warehouse-id',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteDisableLegacyAccessSetting',
		endpoint: 'settings/disable-legacy-access',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteDisableLegacyDbfsSetting',
		endpoint: 'settings/disable-legacy-dbfs',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteLlmProxyPartnerSetting',
		endpoint: 'settings/llm-proxy-partner',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteRestrictWorkspaceAdminsSetting',
		endpoint: 'settings/restrict-workspace-admins',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteSqlResultsDownloadSetting',
		endpoint: 'settings/sql-results-download',
		method: 'DELETE',
		input: {},
	},
	{
		mod: 'Workspace',
		fn: 'deleteSecretScope',
		endpoint: 'secrets/scopes/delete',
		method: 'POST',
		input: {
			scope: 'my_scope',
		},
		expectedBody: {
			scope: 'my_scope',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteSecretsAcl',
		endpoint: 'secrets/acls/delete',
		method: 'POST',
		input: {
			scope: 'my_scope',
			principal: 'users@company.com',
		},
		expectedBody: {
			scope: 'my_scope',
			principal: 'users@company.com',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteTagPolicy',
		endpoint: 'tags/tag-policies/environment',
		method: 'DELETE',
		input: {
			tag_key: 'environment',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteWorkspaceGitCredentials',
		endpoint: 'git-credentials/1',
		method: 'DELETE',
		input: {
			credential_id: 1,
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteWorkspaceObject',
		endpoint: 'workspace/delete',
		method: 'POST',
		input: {
			path: '/Workspace/file',
		},
		expectedBody: {
			path: '/Workspace/file',
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteWorkspaceRepo',
		endpoint: 'repos/1',
		method: 'DELETE',
		input: {
			repo_id: 1,
		},
	},
	{
		mod: 'Workspace',
		fn: 'deleteWorkspaceSecret',
		endpoint: 'secrets/delete',
		method: 'POST',
		input: {
			scope: 'my_scope',
			key: 'secret_key',
		},
		expectedBody: {
			scope: 'my_scope',
			key: 'secret_key',
		},
	},
] as const;
