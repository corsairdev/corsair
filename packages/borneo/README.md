# @corsair-dev/borneo

Borneo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/borneo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.getCloudAccountById` | `borneo.api.accounts.getCloudAccountById` | `read` | Get cloud account by id |
| `accounts.postAccountsWithFilterAndSortOptions` | `borneo.api.accounts.postAccountsWithFilterAndSortOptions` | `read` | Post accounts with filter and sort options |
| `accounts.retrieveAccountDetailsById` | `borneo.api.accounts.retrieveAccountDetailsById` | `read` | Retrieve account details by id |
| `assets.createNewAsset` | `borneo.api.assets.createNewAsset` | `write` | Create new asset |
| `assets.deleteAssetById` | `borneo.api.assets.deleteAssetById` | `destructive` | Delete asset by id |
| `assets.filterAndSortAssetsList` | `borneo.api.assets.filterAndSortAssetsList` | `read` | Filter and sort assets list |
| `assets.retrieveAssetById` | `borneo.api.assets.retrieveAssetById` | `read` | Retrieve asset by id |
| `assets.updateAssetInformationById` | `borneo.api.assets.updateAssetInformationById` | `write` | Update asset information by id |
| `audit.listEventsWithFilters` | `borneo.api.audit.listEventsWithFilters` | `read` | List events with filters |
| `audit.postFilteredAccessLogs` | `borneo.api.audit.postFilteredAccessLogs` | `read` | Post filtered access logs |
| `audit.postLogAuditRecordsWithFilterCriteria` | `borneo.api.audit.postLogAuditRecordsWithFilterCriteria` | `read` | Post log audit records with filter criteria |
| `breaches.deleteDataBreachById` | `borneo.api.breaches.deleteDataBreachById` | `destructive` | Delete data breach by id |
| `breaches.evaluateDataBreachImpact` | `borneo.api.breaches.evaluateDataBreachImpact` | `write` | Evaluate data breach impact |
| `breaches.fetchDataBreachEvaluation` | `borneo.api.breaches.fetchDataBreachEvaluation` | `read` | Fetch data breach evaluation |
| `breaches.listDataBreachesWithFilters` | `borneo.api.breaches.listDataBreachesWithFilters` | `read` | List data breaches with filters |
| `breaches.listDataBreachFilters` | `borneo.api.breaches.listDataBreachFilters` | `read` | List data breach filters |
| `breaches.postDataBreachInformation` | `borneo.api.breaches.postDataBreachInformation` | `write` | Post data breach information |
| `breaches.retrieveDataBreachById` | `borneo.api.breaches.retrieveDataBreachById` | `read` | Retrieve data breach by id |
| `breaches.updateDataBreachEntry` | `borneo.api.breaches.updateDataBreachEntry` | `write` | Update data breach entry |
| `categories.createNewInfotypeCategory` | `borneo.api.categories.createNewInfotypeCategory` | `write` | Create new infotype category |
| `categories.deleteCategoryByLabel` | `borneo.api.categories.deleteCategoryByLabel` | `destructive` | Delete category by label |
| `categories.getCategoryByLabel` | `borneo.api.categories.getCategoryByLabel` | `read` | Get category by label |
| `categories.updateCategoryInfotypes` | `borneo.api.categories.updateCategoryInfotypes` | `write` | Update category infotypes |
| `connectors.postConnectorWithFilteringOptions` | `borneo.api.connectors.postConnectorWithFilteringOptions` | `read` | Post connector with filtering options |
| `connectors.retrieveConnectorById` | `borneo.api.connectors.retrieveConnectorById` | `read` | Retrieve connector by id |
| `dashboard.createDashboardUser` | `borneo.api.dashboard.createDashboardUser` | `write` | Create dashboard user |
| `dashboard.deleteDashboardReportById` | `borneo.api.dashboard.deleteDashboardReportById` | `destructive` | Delete dashboard report by id |
| `dashboard.disableDashboardUserByUsername` | `borneo.api.dashboard.disableDashboardUserByUsername` | `write` | Disable dashboard user by username |
| `dashboard.downloadDashboardReport` | `borneo.api.dashboard.downloadDashboardReport` | `read` | Download dashboard report |
| `dashboard.downloadDashboardReportEdition` | `borneo.api.dashboard.downloadDashboardReportEdition` | `read` | Download dashboard report edition |
| `dashboard.enableDashboardUser` | `borneo.api.dashboard.enableDashboardUser` | `write` | Enable dashboard user |
| `dashboard.fetchDashboardReportById` | `borneo.api.dashboard.fetchDashboardReportById` | `read` | Fetch dashboard report by id |
| `dashboard.getDashboardReportEditionById` | `borneo.api.dashboard.getDashboardReportEditionById` | `read` | Get dashboard report edition by id |
| `dashboard.listDashboardReportEditions` | `borneo.api.dashboard.listDashboardReportEditions` | `read` | List dashboard report editions |
| `dashboard.listDashboardReportsWithFilters` | `borneo.api.dashboard.listDashboardReportsWithFilters` | `read` | List dashboard reports with filters |
| `dashboard.listDashboardUsersWithFilters` | `borneo.api.dashboard.listDashboardUsersWithFilters` | `read` | List dashboard users with filters |
| `dashboard.postCurrentDashboardUser` | `borneo.api.dashboard.postCurrentDashboardUser` | `read` | Post current dashboard user |
| `dashboard.postDashboardReport` | `borneo.api.dashboard.postDashboardReport` | `write` | Post dashboard report |
| `dashboard.removeDashboardUserByUsername` | `borneo.api.dashboard.removeDashboardUserByUsername` | `destructive` | Remove dashboard user by username |
| `dashboard.resetDashboardUserPassword` | `borneo.api.dashboard.resetDashboardUserPassword` | `write` | Reset dashboard user password |
| `dashboard.triggerDashboardReportByReportId` | `borneo.api.dashboard.triggerDashboardReportByReportId` | `write` | Trigger dashboard report by report id |
| `dashboard.updateDashboardUserDetails` | `borneo.api.dashboard.updateDashboardUserDetails` | `write` | Update dashboard user details |
| `dashboard.updateDashboardUserRoles` | `borneo.api.dashboard.updateDashboardUserRoles` | `write` | Update dashboard user roles |
| `departments.createDepartmentWithTranslations` | `borneo.api.departments.createDepartmentWithTranslations` | `write` | Create department with translations |
| `departments.deleteDepartmentById` | `borneo.api.departments.deleteDepartmentById` | `destructive` | Delete department by id |
| `departments.getDepartmentFilterList` | `borneo.api.departments.getDepartmentFilterList` | `read` | Get department filter list |
| `departments.listDepartmentsWithSortAndPagination` | `borneo.api.departments.listDepartmentsWithSortAndPagination` | `read` | List departments with sort and pagination |
| `departments.retrieveDepartmentInformation` | `borneo.api.departments.retrieveDepartmentInformation` | `read` | Retrieve department information |
| `departments.updateDepartmentName` | `borneo.api.departments.updateDepartmentName` | `write` | Update department name |
| `documents.createLegalDocumentEntry` | `borneo.api.documents.createLegalDocumentEntry` | `write` | Create legal document entry |
| `documents.deleteLegalDocumentById` | `borneo.api.documents.deleteLegalDocumentById` | `destructive` | Delete legal document by id |
| `documents.listDiscoveredDocument` | `borneo.api.documents.listDiscoveredDocument` | `read` | List discovered document |
| `documents.listLegalDocumentsWithPagination` | `borneo.api.documents.listLegalDocumentsWithPagination` | `read` | List legal documents with pagination |
| `documents.retrieveDiscoveredDocumentById` | `borneo.api.documents.retrieveDiscoveredDocumentById` | `read` | Retrieve discovered document by id |
| `documents.retrieveLegalDocumentById` | `borneo.api.documents.retrieveLegalDocumentById` | `read` | Retrieve legal document by id |
| `documents.updateDiscoveredDocumentStatus` | `borneo.api.documents.updateDiscoveredDocumentStatus` | `write` | Update discovered document status |
| `domains.createDomainWithPollingFrequency` | `borneo.api.domains.createDomainWithPollingFrequency` | `write` | Create domain with polling frequency |
| `domains.deleteDomainById` | `borneo.api.domains.deleteDomainById` | `destructive` | Delete domain by id |
| `domains.getDomainById` | `borneo.api.domains.getDomainById` | `read` | Get domain by id |
| `domains.listDomainsWithPaginationAndSorting` | `borneo.api.domains.listDomainsWithPaginationAndSorting` | `read` | List domains with pagination and sorting |
| `domains.pollDomainById` | `borneo.api.domains.pollDomainById` | `write` | Poll domain by id |
| `domains.updateDomainDetails` | `borneo.api.domains.updateDomainDetails` | `write` | Update domain details |
| `employees.createEmployeeWithJsonPayload` | `borneo.api.employees.createEmployeeWithJsonPayload` | `write` | Create employee with json payload |
| `employees.deleteEmployeeById` | `borneo.api.employees.deleteEmployeeById` | `destructive` | Delete employee by id |
| `employees.filterEmployeeList` | `borneo.api.employees.filterEmployeeList` | `read` | Filter employee list |
| `employees.listEmployeesWithFilters` | `borneo.api.employees.listEmployeesWithFilters` | `read` | List employees with filters |
| `employees.retrieveEmployeeDetailsById` | `borneo.api.employees.retrieveEmployeeDetailsById` | `read` | Retrieve employee details by id |
| `employees.updateEmployeeById` | `borneo.api.employees.updateEmployeeById` | `write` | Update employee by id |
| `headquarters.createHeadquarterEntry` | `borneo.api.headquarters.createHeadquarterEntry` | `write` | Create headquarter entry |
| `headquarters.deleteHeadquartersById` | `borneo.api.headquarters.deleteHeadquartersById` | `destructive` | Delete headquarters by id |
| `headquarters.getHeadquartersById` | `borneo.api.headquarters.getHeadquartersById` | `read` | Get headquarters by id |
| `headquarters.listHeadquartersWithSorting` | `borneo.api.headquarters.listHeadquartersWithSorting` | `read` | List headquarters with sorting |
| `headquarters.updateHeadquarterDetailsById` | `borneo.api.headquarters.updateHeadquarterDetailsById` | `write` | Update headquarter details by id |
| `infotypes.listDiscoveredInfotypes` | `borneo.api.infotypes.listDiscoveredInfotypes` | `read` | List discovered infotypes |
| `infotypes.retrieveDiscoveredInfotypeById` | `borneo.api.infotypes.retrieveDiscoveredInfotypeById` | `read` | Retrieve discovered infotype by id |
| `infotypes.updateDiscoveredInfotypeStatus` | `borneo.api.infotypes.updateDiscoveredInfotypeStatus` | `write` | Update discovered infotype status |
| `misc.listFilteredSortedCategories` | `borneo.api.misc.listFilteredSortedCategories` | `read` | List filtered sorted categories |
| `misc.listIssuesWithFilters` | `borneo.api.misc.listIssuesWithFilters` | `read` | List issues with filters |
| `misc.retrieveErrorDetailsById` | `borneo.api.misc.retrieveErrorDetailsById` | `read` | Retrieve error details by id |
| `misc.retrieveIssueById` | `borneo.api.misc.retrieveIssueById` | `read` | Retrieve issue by id |
| `misc.submitChatFeedback` | `borneo.api.misc.submitChatFeedback` | `write` | Submit chat feedback |
| `processing.createDpiaForProcessingActivity` | `borneo.api.processing.createDpiaForProcessingActivity` | `write` | Create dpia for processing activity |
| `processing.createProcessingActivity` | `borneo.api.processing.createProcessingActivity` | `write` | Create processing activity |
| `processing.createProcessingActivityThreshold` | `borneo.api.processing.createProcessingActivityThreshold` | `write` | Create processing activity threshold |
| `processing.createThresholdForProcessingActivity` | `borneo.api.processing.createThresholdForProcessingActivity` | `write` | Create threshold for processing activity |
| `processing.deleteDpiaById` | `borneo.api.processing.deleteDpiaById` | `destructive` | Delete dpia by id |
| `processing.deleteLopdpThresholdById` | `borneo.api.processing.deleteLopdpThresholdById` | `destructive` | Delete lopdp threshold by id |
| `processing.deleteProcessingActivityById` | `borneo.api.processing.deleteProcessingActivityById` | `destructive` | Delete processing activity by id |
| `processing.deleteThresholdById` | `borneo.api.processing.deleteThresholdById` | `destructive` | Delete threshold by id |
| `processing.exportProcessingActivitiesList` | `borneo.api.processing.exportProcessingActivitiesList` | `read` | Export processing activities list |
| `processing.getThresholdById` | `borneo.api.processing.getThresholdById` | `read` | Get threshold by id |
| `processing.listProcessingActivities` | `borneo.api.processing.listProcessingActivities` | `read` | List processing activities |
| `processing.listProcessingActivitiesFilters` | `borneo.api.processing.listProcessingActivitiesFilters` | `read` | List processing activities filters |
| `processing.listTomsWithFilterAndPaginationOptions` | `borneo.api.processing.listTomsWithFilterAndPaginationOptions` | `read` | List toms with filter and pagination options |
| `processing.putTomStatusAndNote` | `borneo.api.processing.putTomStatusAndNote` | `write` | Put tom status and note |
| `processing.retrieveDpiaById` | `borneo.api.processing.retrieveDpiaById` | `read` | Retrieve dpia by id |
| `processing.retrieveLopdpThresholdById` | `borneo.api.processing.retrieveLopdpThresholdById` | `read` | Retrieve lopdp threshold by id |
| `processing.retrieveProcessingActivityById` | `borneo.api.processing.retrieveProcessingActivityById` | `read` | Retrieve processing activity by id |
| `processing.retrieveTomById` | `borneo.api.processing.retrieveTomById` | `read` | Retrieve tom by id |
| `processing.updateDpiaById` | `borneo.api.processing.updateDpiaById` | `write` | Update dpia by id |
| `processing.updateLopdpThresholdById` | `borneo.api.processing.updateLopdpThresholdById` | `write` | Update lopdp threshold by id |
| `processing.updateProcessingActivityDetails` | `borneo.api.processing.updateProcessingActivityDetails` | `write` | Update processing activity details |
| `processing.updateThresholdById` | `borneo.api.processing.updateThresholdById` | `write` | Update threshold by id |
| `recipients.addDiscoveredRecipients` | `borneo.api.recipients.addDiscoveredRecipients` | `write` | Add discovered recipients |
| `recipients.archiveDiscoveredRecipient` | `borneo.api.recipients.archiveDiscoveredRecipient` | `destructive` | Archive discovered recipient |
| `recipients.createRecipientWithDetails` | `borneo.api.recipients.createRecipientWithDetails` | `write` | Create recipient with details |
| `recipients.deleteRecipientById` | `borneo.api.recipients.deleteRecipientById` | `destructive` | Delete recipient by id |
| `recipients.exportRecipientsListWithFilter` | `borneo.api.recipients.exportRecipientsListWithFilter` | `read` | Export recipients list with filter |
| `recipients.filterRecipientsList` | `borneo.api.recipients.filterRecipientsList` | `read` | Filter recipients list |
| `recipients.listDiscoveredRecipients` | `borneo.api.recipients.listDiscoveredRecipients` | `read` | List discovered recipients |
| `recipients.listFilterOptionsForRecipients` | `borneo.api.recipients.listFilterOptionsForRecipients` | `read` | List filter options for recipients |
| `recipients.listOrFilterRecipients` | `borneo.api.recipients.listOrFilterRecipients` | `read` | List or filter recipients |
| `recipients.postDiscoveredRecipientById` | `borneo.api.recipients.postDiscoveredRecipientById` | `read` | Post discovered recipient by id |
| `recipients.retrieveDiscoveredRecipientById` | `borneo.api.recipients.retrieveDiscoveredRecipientById` | `read` | Retrieve discovered recipient by id |
| `recipients.retrieveRecipientDetails` | `borneo.api.recipients.retrieveRecipientDetails` | `read` | Retrieve recipient details |
| `recipients.retrieveRecipientProcessingActivities` | `borneo.api.recipients.retrieveRecipientProcessingActivities` | `read` | Retrieve recipient processing activities |
| `recipients.updateDashboardReportFrequencyAndRecipients` | `borneo.api.recipients.updateDashboardReportFrequencyAndRecipients` | `write` | Update dashboard report frequency and recipients |
| `recipients.updateRecipientDetailsById` | `borneo.api.recipients.updateRecipientDetailsById` | `write` | Update recipient details by id |
| `recipients.updateRecipientStatusViaId` | `borneo.api.recipients.updateRecipientStatusViaId` | `write` | Update recipient status via id |
| `resources.deleteTagFromResource` | `borneo.api.resources.deleteTagFromResource` | `destructive` | Delete tag from resource |
| `resources.exportFilteredLeafResources` | `borneo.api.resources.exportFilteredLeafResources` | `read` | Export filtered leaf resources |
| `resources.exportInventoryResourceList` | `borneo.api.resources.exportInventoryResourceList` | `read` | Export inventory resource list |
| `resources.getResourceInventoryById` | `borneo.api.resources.getResourceInventoryById` | `read` | Get resource inventory by id |
| `resources.listInventoryResourcesWithFilters` | `borneo.api.resources.listInventoryResourcesWithFilters` | `read` | List inventory resources with filters |
| `resources.listLeafResourcesWithFilters` | `borneo.api.resources.listLeafResourcesWithFilters` | `read` | List leaf resources with filters |
| `resources.postClassificationStats` | `borneo.api.resources.postClassificationStats` | `read` | Post classification stats |
| `resources.postResourceLineageFilter` | `borneo.api.resources.postResourceLineageFilter` | `read` | Post resource lineage filter |
| `resources.postResourceStatsWithDeletedResources` | `borneo.api.resources.postResourceStatsWithDeletedResources` | `read` | Post resource stats with deleted resources |
| `resources.retrieveDataResourceStatistics` | `borneo.api.resources.retrieveDataResourceStatistics` | `read` | Retrieve data resource statistics |
| `resources.retrieveResourceCatalogById` | `borneo.api.resources.retrieveResourceCatalogById` | `read` | Retrieve resource catalog by id |
| `resources.retrieveResourceColumns` | `borneo.api.resources.retrieveResourceColumns` | `read` | Retrieve resource columns |
| `scans.accessScanIterationById` | `borneo.api.scans.accessScanIterationById` | `read` | Access scan iteration by id |
| `scans.createAndScheduleCloudResourceScan` | `borneo.api.scans.createAndScheduleCloudResourceScan` | `write` | Create and schedule cloud resource scan |
| `scans.exportInsightPageUsingScanId` | `borneo.api.scans.exportInsightPageUsingScanId` | `read` | Export insight page using scanid |
| `scans.filterAndListInspectionResults` | `borneo.api.scans.filterAndListInspectionResults` | `read` | Filter and list inspection results |
| `scans.getInsightByTypeAndId` | `borneo.api.scans.getInsightByTypeAndId` | `read` | Get insight by type and id |
| `scans.getScanByScanId` | `borneo.api.scans.getScanByScanId` | `read` | Get scan by scanid |
| `scans.listErrorDetailsFromFilteredScanIterations` | `borneo.api.scans.listErrorDetailsFromFilteredScanIterations` | `read` | List error details from filtered scan iterations |
| `scans.listInsightFilters` | `borneo.api.scans.listInsightFilters` | `read` | List insight filters |
| `scans.listScanExecutionResults` | `borneo.api.scans.listScanExecutionResults` | `read` | List scan execution results |
| `scans.listScanIterationsWithFilter` | `borneo.api.scans.listScanIterationsWithFilter` | `read` | List scan iterations with filter |
| `scans.listScansWithFilters` | `borneo.api.scans.listScansWithFilters` | `read` | List scans with filters |
| `scans.markScanFalsePositivesById` | `borneo.api.scans.markScanFalsePositivesById` | `write` | Mark scan false positives by id |
| `scans.pauseScanById` | `borneo.api.scans.pauseScanById` | `write` | Pause scan by id |
| `scans.postScanResourceStatus` | `borneo.api.scans.postScanResourceStatus` | `read` | Post scan resource status |
| `scans.resumeScanById` | `borneo.api.scans.resumeScanById` | `write` | Resume scan by id |
| `scans.scanLegalDocumentById` | `borneo.api.scans.scanLegalDocumentById` | `write` | Scan legal document byid |
| `scans.stopScanViaScanId` | `borneo.api.scans.stopScanViaScanId` | `write` | Stop scan via scanid |
| `scans.submitDetailedScanResults` | `borneo.api.scans.submitDetailedScanResults` | `write` | Submit detailed scan results |
| `support.postSupportChatQuery` | `borneo.api.support.postSupportChatQuery` | `write` | Post support chat query |
| `users.getUserProfileById` | `borneo.api.users.getUserProfileById` | `read` | Get user profile by id |
| `users.listUserProfileWithFiltersAndSorting` | `borneo.api.users.listUserProfileWithFiltersAndSorting` | `read` | List user profile with filters and sorting |
| `users.verifyEmailWithIdAndToken` | `borneo.api.users.verifyEmailWithIdAndToken` | `write` | Verify email with id and token |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/borneo

## License

Apache-2.0
