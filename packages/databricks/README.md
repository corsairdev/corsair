# @corsair-dev/databricks

Databricks plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/databricks
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apps.createDatabricksApp` | `databricks.api.apps.createDatabricksApp` | `write` | Create app |
| `apps.deleteDatabricksApp` | `databricks.api.apps.deleteDatabricksApp` | `destructive` | Delete app |
| `apps.deployDatabricksApp` | `databricks.api.apps.deployDatabricksApp` | `write` | Deploy app |
| `catalog.assignMetastoreToWorkspace` | `databricks.api.catalog.assignMetastoreToWorkspace` | `write` | Assign metastore to workspace |
| `catalog.batchCreateAccessRequests` | `databricks.api.catalog.batchCreateAccessRequests` | `write` | Batch create access requests |
| `catalog.checkTableExists` | `databricks.api.catalog.checkTableExists` | `read` | Check table existence |
| `catalog.createCatalogConnection` | `databricks.api.catalog.createCatalogConnection` | `write` | Create catalog connection |
| `catalog.createCatalogCredential` | `databricks.api.catalog.createCatalogCredential` | `write` | Create catalog credential |
| `catalog.createExternalLocation` | `databricks.api.catalog.createExternalLocation` | `write` | Create external location |
| `catalog.createMetastore` | `databricks.api.catalog.createMetastore` | `write` | Create Unity Catalog metastore |
| `catalog.createStorageCredential` | `databricks.api.catalog.createStorageCredential` | `write` | Create storage credential |
| `catalog.deleteCatalog` | `databricks.api.catalog.deleteCatalog` | `destructive` | Delete catalog |
| `catalog.deleteCatalogConnection` | `databricks.api.catalog.deleteCatalogConnection` | `destructive` | Delete catalog connection |
| `catalog.deleteCatalogCredential` | `databricks.api.catalog.deleteCatalogCredential` | `destructive` | Delete catalog credential |
| `catalog.deleteCatalogTable` | `databricks.api.catalog.deleteCatalogTable` | `destructive` | Delete catalog table |
| `catalog.deleteExternalLocation` | `databricks.api.catalog.deleteExternalLocation` | `destructive` | Delete external location |
| `catalog.deleteMetastore` | `databricks.api.catalog.deleteMetastore` | `destructive` | Delete metastore |
| `catalog.deleteOnlineTable` | `databricks.api.catalog.deleteOnlineTable` | `destructive` | Delete online table |
| `catalog.deleteStorageCredential` | `databricks.api.catalog.deleteStorageCredential` | `destructive` | Delete storage credential |
| `catalog.disableSystemSchema` | `databricks.api.catalog.disableSystemSchema` | `destructive` | Disable system schema |
| `cleanrooms.createCleanRoom` | `databricks.api.cleanrooms.createCleanRoom` | `write` | Create clean room |
| `cleanrooms.createCleanRoomAutoApprovalRule` | `databricks.api.cleanrooms.createCleanRoomAutoApprovalRule` | `write` | Create clean room auto approval rule |
| `compute.addComputeInstanceProfile` | `databricks.api.compute.addComputeInstanceProfile` | `write` | Add compute instance profile |
| `compute.createComputeClusterPolicy` | `databricks.api.compute.createComputeClusterPolicy` | `write` | Create cluster policy |
| `compute.createComputeInstancePool` | `databricks.api.compute.createComputeInstancePool` | `write` | Create instance pool |
| `compute.createDatabricksCluster` | `databricks.api.compute.createDatabricksCluster` | `write` | Create Spark cluster |
| `compute.createGlobalInitScript` | `databricks.api.compute.createGlobalInitScript` | `write` | Create global init script |
| `compute.deleteComputeClusterPolicy` | `databricks.api.compute.deleteComputeClusterPolicy` | `destructive` | Delete cluster policy |
| `compute.deleteComputeInstancePool` | `databricks.api.compute.deleteComputeInstancePool` | `destructive` | Delete instance pool |
| `compute.deleteDatabricksCluster` | `databricks.api.compute.deleteDatabricksCluster` | `destructive` | Terminate Spark cluster |
| `compute.deleteGlobalInitScript` | `databricks.api.compute.deleteGlobalInitScript` | `destructive` | Delete global init script |
| `dashboards.createGenieMessage` | `databricks.api.dashboards.createGenieMessage` | `write` | Create Genie message |
| `dashboards.createGenieSpace` | `databricks.api.dashboards.createGenieSpace` | `write` | Create Genie space |
| `dashboards.createLakeviewDashboard` | `databricks.api.dashboards.createLakeviewDashboard` | `write` | Create Lakeview dashboard |
| `dashboards.deleteGenieConversation` | `databricks.api.dashboards.deleteGenieConversation` | `destructive` | Delete Genie conversation |
| `dashboards.deleteGenieConversationMessage` | `databricks.api.dashboards.deleteGenieConversationMessage` | `destructive` | Delete Genie message |
| `dashboards.deleteLakeviewDashboardSchedule` | `databricks.api.dashboards.deleteLakeviewDashboardSchedule` | `destructive` | Delete Lakeview schedule |
| `database.createDatabaseInstance` | `databricks.api.database.createDatabaseInstance` | `write` | Create database instance |
| `database.deleteDatabaseInstance` | `databricks.api.database.deleteDatabaseInstance` | `destructive` | Delete database instance |
| `database.deleteSyncedDatabaseTable` | `databricks.api.database.deleteSyncedDatabaseTable` | `destructive` | Delete synced database table |
| `dataquality.createDataQualityMonitor` | `databricks.api.dataquality.createDataQualityMonitor` | `write` | Create data quality monitor |
| `dataquality.createQualityMonitorV2` | `databricks.api.dataquality.createQualityMonitorV2` | `write` | Create quality monitor V2 |
| `dbfs.addBlockToDbfsStream` | `databricks.api.dbfs.addBlockToDbfsStream` | `write` | Add block to DBFS stream |
| `dbfs.createDbfsFileStream` | `databricks.api.dbfs.createDbfsFileStream` | `write` | Create DBFS file stream |
| `dbfs.deleteDbfsFileOrDirectory` | `databricks.api.dbfs.deleteDbfsFileOrDirectory` | `destructive` | Delete file or directory from DBFS |
| `iam.addMemberToSecurityGroup` | `databricks.api.iam.addMemberToSecurityGroup` | `write` | Add member to security group |
| `iam.createIamGroupV2` | `databricks.api.iam.createIamGroupV2` | `write` | Create IAM group |
| `iam.createIamServicePrincipalV2` | `databricks.api.iam.createIamServicePrincipalV2` | `write` | Create IAM service principal |
| `iam.createIamUserV2` | `databricks.api.iam.createIamUserV2` | `write` | Create IAM user |
| `iam.createIpAccessList` | `databricks.api.iam.createIpAccessList` | `write` | Create IP access list |
| `iam.deleteIamGroupV2` | `databricks.api.iam.deleteIamGroupV2` | `destructive` | Delete IAM group |
| `iam.deleteIamServicePrincipalV2` | `databricks.api.iam.deleteIamServicePrincipalV2` | `destructive` | Delete service principal |
| `iam.deleteIamUserV2` | `databricks.api.iam.deleteIamUserV2` | `destructive` | Delete user |
| `jobs.cancelAllJobRuns` | `databricks.api.jobs.cancelAllJobRuns` | `write` | Cancel all job runs |
| `jobs.cancelJobRun` | `databricks.api.jobs.cancelJobRun` | `write` | Cancel job run |
| `jobs.deleteDatabricksJobRun` | `databricks.api.jobs.deleteDatabricksJobRun` | `destructive` | Delete job run |
| `marketplace.batchGetMarketplaceConsumerListings` | `databricks.api.marketplace.batchGetMarketplaceConsumerListings` | `read` | Batch get consumer listings |
| `marketplace.batchGetMarketplaceConsumerProviders` | `databricks.api.marketplace.batchGetMarketplaceConsumerProviders` | `read` | Batch get consumer providers |
| `marketplace.createMarketplaceConsumerInstallation` | `databricks.api.marketplace.createMarketplaceConsumerInstallation` | `write` | Create marketplace consumer installation |
| `marketplace.createMarketplaceProviderListing` | `databricks.api.marketplace.createMarketplaceProviderListing` | `write` | Create marketplace provider listing |
| `marketplace.createProviderAnalyticsDashboard` | `databricks.api.marketplace.createProviderAnalyticsDashboard` | `write` | Create provider analytics dashboard |
| `marketplace.deleteListingFromExchange` | `databricks.api.marketplace.deleteListingFromExchange` | `destructive` | Delete listing from exchange |
| `marketplace.deleteMarketplaceConsumerInstallation` | `databricks.api.marketplace.deleteMarketplaceConsumerInstallation` | `destructive` | Delete marketplace consumer installation |
| `ml.createLoggedModel` | `databricks.api.ml.createLoggedModel` | `write` | Create logged model |
| `ml.createMlExperiment` | `databricks.api.ml.createMlExperiment` | `write` | Create ML experiment |
| `ml.createMlFeatureStoreOnlineStore` | `databricks.api.ml.createMlFeatureStoreOnlineStore` | `write` | Create ML online feature store |
| `ml.createMlflowExperimentRun` | `databricks.api.ml.createMlflowExperimentRun` | `write` | Create MLflow experiment run |
| `ml.createMlForecastingExperiment` | `databricks.api.ml.createMlForecastingExperiment` | `write` | Create ML forecasting experiment |
| `ml.deleteLoggedModel` | `databricks.api.ml.deleteLoggedModel` | `destructive` | Delete logged model |
| `ml.deleteLoggedModelTag` | `databricks.api.ml.deleteLoggedModelTag` | `destructive` | Delete logged model tag |
| `ml.deleteMlExperiment` | `databricks.api.ml.deleteMlExperiment` | `destructive` | Delete ML experiment |
| `ml.deleteMlExperimentRun` | `databricks.api.ml.deleteMlExperimentRun` | `destructive` | Delete ML run |
| `ml.deleteMlExperimentRuns` | `databricks.api.ml.deleteMlExperimentRuns` | `destructive` | Delete ML runs |
| `ml.deleteMlExperimentRunTag` | `databricks.api.ml.deleteMlExperimentRunTag` | `destructive` | Delete ML run tag |
| `ml.deleteMlFeatureEngKafkaConfig` | `databricks.api.ml.deleteMlFeatureEngKafkaConfig` | `destructive` | Delete Kafka config |
| `ml.deleteMlFeatureStoreOnlineStore` | `databricks.api.ml.deleteMlFeatureStoreOnlineStore` | `destructive` | Delete ML online store |
| `ml.deleteMlFeatureTag` | `databricks.api.ml.deleteMlFeatureTag` | `destructive` | Delete ML feature tag |
| `security.createNotificationDestination` | `databricks.api.security.createNotificationDestination` | `write` | Create notification destination |
| `security.createOAuthServicePrincipalSecret` | `databricks.api.security.createOAuthServicePrincipalSecret` | `write` | Create OAuth SP secret |
| `security.createPersonalAccessToken` | `databricks.api.security.createPersonalAccessToken` | `write` | Create personal access token |
| `security.deleteNotificationDestination` | `databricks.api.security.deleteNotificationDestination` | `destructive` | Delete notification destination |
| `security.deleteOAuth2ServicePrincipalSecret` | `databricks.api.security.deleteOAuth2ServicePrincipalSecret` | `destructive` | Delete OAuth SP secret |
| `security.deleteTokenManagement` | `databricks.api.security.deleteTokenManagement` | `destructive` | Delete token management |
| `serving.createProvisionedThroughputEndpoint` | `databricks.api.serving.createProvisionedThroughputEndpoint` | `write` | Create provisioned throughput endpoint |
| `serving.createVectorSearchEndpoint` | `databricks.api.serving.createVectorSearchEndpoint` | `write` | Create vector search endpoint |
| `serving.deleteServingEndpoint` | `databricks.api.serving.deleteServingEndpoint` | `destructive` | Delete serving endpoint |
| `serving.deleteVectorSearchIndex` | `databricks.api.serving.deleteVectorSearchIndex` | `destructive` | Delete vector search index |
| `sharing.createShare` | `databricks.api.sharing.createShare` | `write` | Create share |
| `sharing.createSharingProvider` | `databricks.api.sharing.createSharingProvider` | `write` | Create sharing provider |
| `sharing.createSharingRecipient` | `databricks.api.sharing.createSharingRecipient` | `write` | Create sharing recipient |
| `sharing.deleteShare` | `databricks.api.sharing.deleteShare` | `destructive` | Delete share |
| `sharing.deleteSharingRecipient` | `databricks.api.sharing.deleteSharingRecipient` | `destructive` | Delete sharing recipient |
| `sql.cancelSqlStatementExecution` | `databricks.api.sql.cancelSqlStatementExecution` | `write` | Cancel SQL statement execution |
| `sql.createLegacySqlAlert` | `databricks.api.sql.createLegacySqlAlert` | `write` | Create legacy SQL alert |
| `sql.createLegacySqlQuery` | `databricks.api.sql.createLegacySqlQuery` | `write` | Create legacy SQL query |
| `sql.createLegacySqlQueryVisualization` | `databricks.api.sql.createLegacySqlQueryVisualization` | `write` | Create legacy SQL visualization |
| `sql.createSqlAlert` | `databricks.api.sql.createSqlAlert` | `write` | Create SQL alert |
| `sql.createSqlQuery` | `databricks.api.sql.createSqlQuery` | `write` | Create SQL query |
| `sql.createSqlQueryVisualization` | `databricks.api.sql.createSqlQueryVisualization` | `write` | Create SQL query visualization |
| `sql.deleteLegacySqlAlert` | `databricks.api.sql.deleteLegacySqlAlert` | `destructive` | Delete legacy SQL alert |
| `sql.deleteLegacySqlQuery` | `databricks.api.sql.deleteLegacySqlQuery` | `destructive` | Delete legacy SQL query |
| `sql.deleteLegacySqlQueryVisualization` | `databricks.api.sql.deleteLegacySqlQueryVisualization` | `destructive` | Delete legacy SQL visualization |
| `sql.deleteSqlAlert` | `databricks.api.sql.deleteSqlAlert` | `destructive` | Delete SQL alert |
| `sql.deleteSqlDashboard` | `databricks.api.sql.deleteSqlDashboard` | `destructive` | Delete SQL dashboard |
| `sql.deleteSqlQuery` | `databricks.api.sql.deleteSqlQuery` | `destructive` | Delete SQL query |
| `sql.deleteSqlWarehouse` | `databricks.api.sql.deleteSqlWarehouse` | `destructive` | Delete SQL warehouse |
| `workspace.createSecretScope` | `databricks.api.workspace.createSecretScope` | `write` | Create secret scope |
| `workspace.createTagPolicy` | `databricks.api.workspace.createTagPolicy` | `write` | Create tag policy |
| `workspace.createWorkspaceDirectory` | `databricks.api.workspace.createWorkspaceDirectory` | `write` | Create workspace directory |
| `workspace.createWorkspaceGitCredentials` | `databricks.api.workspace.createWorkspaceGitCredentials` | `write` | Create workspace git credentials |
| `workspace.createWorkspaceRepo` | `databricks.api.workspace.createWorkspaceRepo` | `write` | Create workspace repo |
| `workspace.deleteAibiDashboardEmbeddingAccessPolicy` | `databricks.api.workspace.deleteAibiDashboardEmbeddingAccessPolicy` | `destructive` | Delete AI/BI dashboard embedding access policy |
| `workspace.deleteAibiDashboardEmbeddingApprovedDomains` | `databricks.api.workspace.deleteAibiDashboardEmbeddingApprovedDomains` | `destructive` | Delete AI/BI embedding approved domains |
| `workspace.deleteCustomLlmAgent` | `databricks.api.workspace.deleteCustomLlmAgent` | `destructive` | Delete custom LLM agent |
| `workspace.deleteDashboardEmailSubscriptionsSetting` | `databricks.api.workspace.deleteDashboardEmailSubscriptionsSetting` | `destructive` | Delete dashboard email subscriptions setting |
| `workspace.deleteDatabricksPipeline` | `databricks.api.workspace.deleteDatabricksPipeline` | `destructive` | Delete Databricks pipeline |
| `workspace.deleteDefaultNamespaceSetting` | `databricks.api.workspace.deleteDefaultNamespaceSetting` | `destructive` | Delete default namespace setting |
| `workspace.deleteDefaultWarehouseIdSetting` | `databricks.api.workspace.deleteDefaultWarehouseIdSetting` | `destructive` | Delete default warehouse ID setting |
| `workspace.deleteDisableLegacyAccessSetting` | `databricks.api.workspace.deleteDisableLegacyAccessSetting` | `destructive` | Delete disable legacy access setting |
| `workspace.deleteDisableLegacyDbfsSetting` | `databricks.api.workspace.deleteDisableLegacyDbfsSetting` | `destructive` | Delete disable legacy DBFS setting |
| `workspace.deleteLlmProxyPartnerSetting` | `databricks.api.workspace.deleteLlmProxyPartnerSetting` | `destructive` | Delete LLM proxy partner setting |
| `workspace.deleteRestrictWorkspaceAdminsSetting` | `databricks.api.workspace.deleteRestrictWorkspaceAdminsSetting` | `destructive` | Delete restrict workspace admins setting |
| `workspace.deleteSecretsAcl` | `databricks.api.workspace.deleteSecretsAcl` | `destructive` | Delete secrets ACL |
| `workspace.deleteSecretScope` | `databricks.api.workspace.deleteSecretScope` | `destructive` | Delete secret scope |
| `workspace.deleteSqlResultsDownloadSetting` | `databricks.api.workspace.deleteSqlResultsDownloadSetting` | `destructive` | Delete SQL results download setting |
| `workspace.deleteTagPolicy` | `databricks.api.workspace.deleteTagPolicy` | `destructive` | Delete tag policy |
| `workspace.deleteWorkspaceGitCredentials` | `databricks.api.workspace.deleteWorkspaceGitCredentials` | `destructive` | Delete workspace git credentials |
| `workspace.deleteWorkspaceObject` | `databricks.api.workspace.deleteWorkspaceObject` | `destructive` | Delete workspace object |
| `workspace.deleteWorkspaceRepo` | `databricks.api.workspace.deleteWorkspaceRepo` | `destructive` | Delete workspace repo |
| `workspace.deleteWorkspaceSecret` | `databricks.api.workspace.deleteWorkspaceSecret` | `destructive` | Delete workspace secret |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/databricks

## License

Apache-2.0
