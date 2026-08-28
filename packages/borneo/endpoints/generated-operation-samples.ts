/**
 * Minimal valid inputs generated from the same pinned Composio
 * metadata as the endpoint schemas. Test-only helper.
 */
export const BORNEO_OPERATION_SAMPLE_INPUTS = {
	getCloudAccountById: {
		cloudAccountId: 'test',
	},
	postAccountsWithFilterAndSortOptions: {},
	retrieveAccountDetailsById: {
		accountId: 'test',
	},
	createNewAsset: {
		name: 'test',
		type: 'applications',
	},
	deleteAssetById: {
		assetId: 'test',
	},
	filterAndSortAssetsList: {},
	retrieveAssetById: {
		assetId: 'test',
	},
	updateAssetInformationById: {
		name: 'test',
		type: 'applications',
		assetId: 'test',
	},
	listEventsWithFilters: {},
	postFilteredAccessLogs: {},
	postLogAuditRecordsWithFilterCriteria: {},
	deleteDataBreachById: {
		dataBreachId: 'test',
	},
	evaluateDataBreachImpact: {
		saveAsDraft: true,
		dataBreachId: 'test',
	},
	fetchDataBreachEvaluation: {
		dataBreachId: 'test',
	},
	listDataBreachFilters: {
		filterType: 'owner',
	},
	listDataBreachesWithFilters: {},
	postDataBreachInformation: {
		saveAsDraft: true,
		shortDescription: 'test',
	},
	retrieveDataBreachById: {
		dataBreachId: 'test',
	},
	updateDataBreachEntry: {
		saveAsDraft: true,
		dataBreachId: 'test',
		shortDescription: 'test',
	},
	createNewInfotypeCategory: {
		infotypes: [],
		categoryLabel: 'test',
	},
	deleteCategoryByLabel: {
		categoryLabel: 'test',
	},
	getCategoryByLabel: {
		categoryLabel: 'test',
	},
	updateCategoryInfotypes: {
		infotypes: [],
		categoryLabel: 'test',
	},
	postConnectorWithFilteringOptions: {},
	retrieveConnectorById: {
		connectorId: 'test',
	},
	createDashboardUser: {
		email: 'test',
	},
	deleteDashboardReportById: {
		dashboardReportId: 'test',
	},
	disableDashboardUserByUsername: {
		username: 'test',
	},
	downloadDashboardReport: {
		reportType: 'DATA_DISCOVERY_DASHBOARD',
	},
	downloadDashboardReportEdition: {
		reportEditionId: 'test',
	},
	enableDashboardUser: {
		username: 'test',
	},
	fetchDashboardReportById: {
		dashboardReportId: 'test',
	},
	getDashboardReportEditionById: {
		reportEditionId: 'test',
	},
	listDashboardReportEditions: {
		dashboardReportId: 'test',
	},
	listDashboardReportsWithFilters: {},
	listDashboardUsersWithFilters: {},
	postCurrentDashboardUser: {},
	postDashboardReport: {
		name: 'test',
		status: 'DELETED',
		reportTypes: [],
		triggerImmediately: true,
	},
	removeDashboardUserByUsername: {
		username: 'test',
	},
	resetDashboardUserPassword: {
		username: 'test',
	},
	triggerDashboardReportByReportId: {
		dashboardReportId: 'test',
	},
	updateDashboardUserDetails: {
		name: 'test',
		username: 'test',
	},
	updateDashboardUserRoles: {
		username: 'test',
		organisations: [],
	},
	createDepartmentWithTranslations: {},
	deleteDepartmentById: {
		departmentId: 'test',
	},
	getDepartmentFilterList: {},
	listDepartmentsWithSortAndPagination: {},
	retrieveDepartmentInformation: {
		departmentId: 'test',
	},
	updateDepartmentName: {
		departmentId: 'test',
	},
	createLegalDocumentEntry: {
		name: 'test',
		region: 'test',
		documentLink: 'test',
		isDiscoverInfotype: true,
	},
	deleteLegalDocumentById: {
		documentId: 'test',
	},
	listDiscoveredDocument: {},
	listLegalDocumentsWithPagination: {},
	retrieveDiscoveredDocumentById: {
		discoveredDocumentId: 'test',
	},
	retrieveLegalDocumentById: {
		documentId: 'test',
	},
	updateDiscoveredDocumentStatus: {
		status: 'ADDED',
		discoveredDocumentId: 'test',
	},
	createDomainWithPollingFrequency: {
		name: 'test',
		frequency: '12h',
	},
	deleteDomainById: {
		domainId: 'test',
	},
	getDomainById: {
		domainId: 'test',
	},
	listDomainsWithPaginationAndSorting: {},
	pollDomainById: {
		domainId: 'test',
	},
	updateDomainDetails: {
		name: 'test',
		domainId: 'test',
		frequency: '12h',
	},
	createEmployeeWithJsonPayload: {
		name: 'test',
		surname: 'test',
		createdBy: 'test',
	},
	deleteEmployeeById: {
		employeeId: 'test',
	},
	filterEmployeeList: {},
	listEmployeesWithFilters: {},
	retrieveEmployeeDetailsById: {
		employeeId: 'test',
	},
	updateEmployeeById: {
		employeeId: 'test',
	},
	createHeadquarterEntry: {
		city: 'test',
		name: 'test',
		address: 'test',
		country: 'test',
	},
	deleteHeadquartersById: {
		headquarterId: 'test',
	},
	getHeadquartersById: {
		headquarterId: 'test',
	},
	listHeadquartersWithSorting: {},
	updateHeadquarterDetailsById: {
		city: 'test',
		name: 'test',
		address: 'test',
		country: 'test',
		headquarterId: 'test',
	},
	listDiscoveredInfotypes: {},
	retrieveDiscoveredInfotypeById: {
		discoveredInfotypeId: 'test',
	},
	updateDiscoveredInfotypeStatus: {
		status: 'APPROVED',
		discoveredInfotypeId: 'test',
	},
	listFilteredSortedCategories: {},
	listIssuesWithFilters: {},
	retrieveErrorDetailsById: {
		errorId: 'test',
	},
	retrieveIssueById: {
		issueId: 'test',
	},
	submitChatFeedback: {},
	createDpiaForProcessingActivity: {
		status: 'activated',
		processingActivityId: 'test',
	},
	createProcessingActivity: {
		name: 'test',
		active: true,
	},
	createProcessingActivityThreshold: {
		processingActivityId: 'test',
	},
	createThresholdForProcessingActivity: {
		processingActivityId: 'test',
	},
	deleteDpiaById: {
		dpiaId: 'test',
	},
	deleteLopdpThresholdById: {
		lopdpThresholdId: 'test',
	},
	deleteProcessingActivityById: {
		processingActivityId: 'test',
	},
	deleteThresholdById: {
		thresholdId: 'test',
	},
	exportProcessingActivitiesList: {
		language: 'ar',
		exportTypes: [],
	},
	getThresholdById: {
		thresholdId: 'test',
	},
	listProcessingActivities: {},
	listProcessingActivitiesFilters: {
		filterType: 'asset',
	},
	listTomsWithFilterAndPaginationOptions: {},
	putTomStatusAndNote: {
		tomId: 'test',
		status: 'available',
	},
	retrieveDpiaById: {
		dpiaId: 'test',
	},
	retrieveLopdpThresholdById: {
		lopdpThresholdId: 'test',
	},
	retrieveProcessingActivityById: {
		processingActivityId: 'test',
	},
	retrieveTomById: {
		tomId: 'test',
	},
	updateDpiaById: {
		dpiaId: 'test',
		status: 'activated',
	},
	updateLopdpThresholdById: {
		lopdpThresholdId: 'test',
	},
	updateProcessingActivityDetails: {
		name: 'test',
		active: true,
		processingActivityId: 'test',
	},
	updateThresholdById: {
		thresholdId: 'test',
	},
	addDiscoveredRecipients: {
		discoveredRecipientIds: [],
	},
	archiveDiscoveredRecipient: {
		discoveredRecipientId: 'test',
	},
	createRecipientWithDetails: {
		name: 'test',
		status: 'archived',
		dataStorageLocation: [],
		recipientWarranties: [],
	},
	deleteRecipientById: {
		recipientId: 'test',
	},
	exportRecipientsListWithFilter: {
		exportTypes: [],
	},
	filterRecipientsList: {},
	listDiscoveredRecipients: {},
	listFilterOptionsForRecipients: {
		filterType: 'categories',
	},
	listOrFilterRecipients: {},
	postDiscoveredRecipientById: {
		discoveredRecipientId: 'test',
	},
	retrieveDiscoveredRecipientById: {
		discoveredRecipientId: 'test',
	},
	retrieveRecipientDetails: {
		recipientId: 'test',
	},
	retrieveRecipientProcessingActivities: {
		recipientId: 'test',
	},
	updateDashboardReportFrequencyAndRecipients: {
		dashboardReportId: 'test',
	},
	updateRecipientDetailsById: {
		name: 'test',
		status: 'archived',
		recipientId: 'test',
		dataStorageLocation: [],
		recipientWarranties: [],
	},
	updateRecipientStatusViaId: {
		recipientId: 'test',
	},
	deleteTagFromResource: {
		tagKey: 'test',
		tagResources: {},
	},
	exportFilteredLeafResources: {},
	exportInventoryResourceList: {},
	getResourceInventoryById: {
		resourceId: 'test',
	},
	listInventoryResourcesWithFilters: {},
	listLeafResourcesWithFilters: {},
	postClassificationStats: {},
	postResourceLineageFilter: {},
	postResourceStatsWithDeletedResources: {},
	retrieveDataResourceStatistics: {},
	retrieveResourceCatalogById: {
		resourceId: 'test',
	},
	retrieveResourceColumns: {
		parentResourceId: 'test',
	},
	accessScanIterationById: {
		scanIterationId: 'test',
	},
	createAndScheduleCloudResourceScan: {
		scheduleType: 'cron',
	},
	exportInsightPageUsingScanId: {
		scanId: 'test',
	},
	filterAndListInspectionResults: {
		type: 'page',
	},
	getInsightByTypeAndId: {
		id: 'test',
		type: 'page',
	},
	getScanByScanId: {
		scanId: 'test',
	},
	listErrorDetailsFromFilteredScanIterations: {},
	listInsightFilters: {},
	listScanExecutionResults: {},
	listScanIterationsWithFilter: {},
	listScansWithFilters: {},
	markScanFalsePositivesById: {
		scanId: 'test',
	},
	pauseScanById: {
		scanId: 'test',
	},
	postScanResourceStatus: {
		scanId: 'test',
	},
	resumeScanById: {
		scanId: 'test',
	},
	scanLegalDocumentById: {
		documentId: 'test',
	},
	stopScanViaScanId: {
		scanId: 'test',
	},
	submitDetailedScanResults: {
		scanId: 'test',
		resourceId: 'test',
		scanIterationId: 'test',
	},
	postSupportChatQuery: {
		query: 'test',
	},
	getUserProfileById: {
		userId: 'test',
	},
	listUserProfileWithFiltersAndSorting: {},
	verifyEmailWithIdAndToken: {
		token: 'test',
		verificationId: 'test',
	},
} as const;
