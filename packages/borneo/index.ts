import type {
	AuthTypes,
	BindEndpoints,
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
	Accounts,
	Assets,
	Audit,
	Breaches,
	Categories,
	Connectors,
	Dashboard,
	Departments,
	Documents,
	Domains,
	Employees,
	Headquarters,
	Infotypes,
	Misc,
	Processing,
	Recipients,
	Resources,
	Scans,
	Support,
	Users,
} from './endpoints';
import type {
	BorneoEndpointInputs,
	BorneoEndpointOutputs,
} from './endpoints/types';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { BorneoOperationName } from './operations';
import { BorneoSchema } from './schema';

export const borneoAuthConfig = {
	api_key: {
		account: ['base_url'] as const,
	},
	oauth_2: {
		account: ['base_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BorneoPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	composioApiKey?: string;
	connectedAccountId?: string;
	userId?: string;
	composioBaseUrl?: string;
	borneoCredential?: string;
	baseUrl?: string;
	credentialHeaderName?: string;
	credentialPrefix?: string;
	hooks?: InternalBorneoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof borneoEndpointsNested>;
};

export type BorneoContext = CorsairPluginContext<
	typeof BorneoSchema,
	BorneoPluginOptions,
	undefined,
	typeof borneoAuthConfig
>;

export type BorneoKeyBuilderContext = KeyBuilderContext<
	BorneoPluginOptions,
	typeof borneoAuthConfig
>;

type BorneoEndpoint<K extends BorneoOperationName> = CorsairEndpoint<
	BorneoContext,
	BorneoEndpointInputs[K],
	BorneoEndpointOutputs[K]
>;

export type BorneoEndpoints = {
	[K in BorneoOperationName]: BorneoEndpoint<K>;
};

const borneoEndpointsNested = {
	accounts: Accounts,
	assets: Assets,
	audit: Audit,
	breaches: Breaches,
	categories: Categories,
	connectors: Connectors,
	dashboard: Dashboard,
	departments: Departments,
	documents: Documents,
	domains: Domains,
	employees: Employees,
	headquarters: Headquarters,
	infotypes: Infotypes,
	misc: Misc,
	processing: Processing,
	recipients: Recipients,
	resources: Resources,
	scans: Scans,
	support: Support,
	users: Users,
} as const;

export type BorneoBoundEndpoints = BindEndpoints<typeof borneoEndpointsNested>;

export const borneoEndpointSchemas = {
	'accounts.getCloudAccountById': {
		input: BorneoEndpointInputSchemas.getCloudAccountById,
		output: BorneoEndpointOutputSchemas.getCloudAccountById,
	},
	'accounts.postAccountsWithFilterAndSortOptions': {
		input: BorneoEndpointInputSchemas.postAccountsWithFilterAndSortOptions,
		output: BorneoEndpointOutputSchemas.postAccountsWithFilterAndSortOptions,
	},
	'accounts.retrieveAccountDetailsById': {
		input: BorneoEndpointInputSchemas.retrieveAccountDetailsById,
		output: BorneoEndpointOutputSchemas.retrieveAccountDetailsById,
	},
	'assets.createNewAsset': {
		input: BorneoEndpointInputSchemas.createNewAsset,
		output: BorneoEndpointOutputSchemas.createNewAsset,
	},
	'assets.deleteAssetById': {
		input: BorneoEndpointInputSchemas.deleteAssetById,
		output: BorneoEndpointOutputSchemas.deleteAssetById,
	},
	'assets.filterAndSortAssetsList': {
		input: BorneoEndpointInputSchemas.filterAndSortAssetsList,
		output: BorneoEndpointOutputSchemas.filterAndSortAssetsList,
	},
	'assets.retrieveAssetById': {
		input: BorneoEndpointInputSchemas.retrieveAssetById,
		output: BorneoEndpointOutputSchemas.retrieveAssetById,
	},
	'assets.updateAssetInformationById': {
		input: BorneoEndpointInputSchemas.updateAssetInformationById,
		output: BorneoEndpointOutputSchemas.updateAssetInformationById,
	},
	'audit.listEventsWithFilters': {
		input: BorneoEndpointInputSchemas.listEventsWithFilters,
		output: BorneoEndpointOutputSchemas.listEventsWithFilters,
	},
	'audit.postFilteredAccessLogs': {
		input: BorneoEndpointInputSchemas.postFilteredAccessLogs,
		output: BorneoEndpointOutputSchemas.postFilteredAccessLogs,
	},
	'audit.postLogAuditRecordsWithFilterCriteria': {
		input: BorneoEndpointInputSchemas.postLogAuditRecordsWithFilterCriteria,
		output: BorneoEndpointOutputSchemas.postLogAuditRecordsWithFilterCriteria,
	},
	'breaches.deleteDataBreachById': {
		input: BorneoEndpointInputSchemas.deleteDataBreachById,
		output: BorneoEndpointOutputSchemas.deleteDataBreachById,
	},
	'breaches.evaluateDataBreachImpact': {
		input: BorneoEndpointInputSchemas.evaluateDataBreachImpact,
		output: BorneoEndpointOutputSchemas.evaluateDataBreachImpact,
	},
	'breaches.fetchDataBreachEvaluation': {
		input: BorneoEndpointInputSchemas.fetchDataBreachEvaluation,
		output: BorneoEndpointOutputSchemas.fetchDataBreachEvaluation,
	},
	'breaches.listDataBreachFilters': {
		input: BorneoEndpointInputSchemas.listDataBreachFilters,
		output: BorneoEndpointOutputSchemas.listDataBreachFilters,
	},
	'breaches.listDataBreachesWithFilters': {
		input: BorneoEndpointInputSchemas.listDataBreachesWithFilters,
		output: BorneoEndpointOutputSchemas.listDataBreachesWithFilters,
	},
	'breaches.postDataBreachInformation': {
		input: BorneoEndpointInputSchemas.postDataBreachInformation,
		output: BorneoEndpointOutputSchemas.postDataBreachInformation,
	},
	'breaches.retrieveDataBreachById': {
		input: BorneoEndpointInputSchemas.retrieveDataBreachById,
		output: BorneoEndpointOutputSchemas.retrieveDataBreachById,
	},
	'breaches.updateDataBreachEntry': {
		input: BorneoEndpointInputSchemas.updateDataBreachEntry,
		output: BorneoEndpointOutputSchemas.updateDataBreachEntry,
	},
	'categories.createNewInfotypeCategory': {
		input: BorneoEndpointInputSchemas.createNewInfotypeCategory,
		output: BorneoEndpointOutputSchemas.createNewInfotypeCategory,
	},
	'categories.deleteCategoryByLabel': {
		input: BorneoEndpointInputSchemas.deleteCategoryByLabel,
		output: BorneoEndpointOutputSchemas.deleteCategoryByLabel,
	},
	'categories.getCategoryByLabel': {
		input: BorneoEndpointInputSchemas.getCategoryByLabel,
		output: BorneoEndpointOutputSchemas.getCategoryByLabel,
	},
	'categories.updateCategoryInfotypes': {
		input: BorneoEndpointInputSchemas.updateCategoryInfotypes,
		output: BorneoEndpointOutputSchemas.updateCategoryInfotypes,
	},
	'connectors.postConnectorWithFilteringOptions': {
		input: BorneoEndpointInputSchemas.postConnectorWithFilteringOptions,
		output: BorneoEndpointOutputSchemas.postConnectorWithFilteringOptions,
	},
	'connectors.retrieveConnectorById': {
		input: BorneoEndpointInputSchemas.retrieveConnectorById,
		output: BorneoEndpointOutputSchemas.retrieveConnectorById,
	},
	'dashboard.createDashboardUser': {
		input: BorneoEndpointInputSchemas.createDashboardUser,
		output: BorneoEndpointOutputSchemas.createDashboardUser,
	},
	'dashboard.deleteDashboardReportById': {
		input: BorneoEndpointInputSchemas.deleteDashboardReportById,
		output: BorneoEndpointOutputSchemas.deleteDashboardReportById,
	},
	'dashboard.disableDashboardUserByUsername': {
		input: BorneoEndpointInputSchemas.disableDashboardUserByUsername,
		output: BorneoEndpointOutputSchemas.disableDashboardUserByUsername,
	},
	'dashboard.downloadDashboardReport': {
		input: BorneoEndpointInputSchemas.downloadDashboardReport,
		output: BorneoEndpointOutputSchemas.downloadDashboardReport,
	},
	'dashboard.downloadDashboardReportEdition': {
		input: BorneoEndpointInputSchemas.downloadDashboardReportEdition,
		output: BorneoEndpointOutputSchemas.downloadDashboardReportEdition,
	},
	'dashboard.enableDashboardUser': {
		input: BorneoEndpointInputSchemas.enableDashboardUser,
		output: BorneoEndpointOutputSchemas.enableDashboardUser,
	},
	'dashboard.fetchDashboardReportById': {
		input: BorneoEndpointInputSchemas.fetchDashboardReportById,
		output: BorneoEndpointOutputSchemas.fetchDashboardReportById,
	},
	'dashboard.getDashboardReportEditionById': {
		input: BorneoEndpointInputSchemas.getDashboardReportEditionById,
		output: BorneoEndpointOutputSchemas.getDashboardReportEditionById,
	},
	'dashboard.listDashboardReportEditions': {
		input: BorneoEndpointInputSchemas.listDashboardReportEditions,
		output: BorneoEndpointOutputSchemas.listDashboardReportEditions,
	},
	'dashboard.listDashboardReportsWithFilters': {
		input: BorneoEndpointInputSchemas.listDashboardReportsWithFilters,
		output: BorneoEndpointOutputSchemas.listDashboardReportsWithFilters,
	},
	'dashboard.listDashboardUsersWithFilters': {
		input: BorneoEndpointInputSchemas.listDashboardUsersWithFilters,
		output: BorneoEndpointOutputSchemas.listDashboardUsersWithFilters,
	},
	'dashboard.postCurrentDashboardUser': {
		input: BorneoEndpointInputSchemas.postCurrentDashboardUser,
		output: BorneoEndpointOutputSchemas.postCurrentDashboardUser,
	},
	'dashboard.postDashboardReport': {
		input: BorneoEndpointInputSchemas.postDashboardReport,
		output: BorneoEndpointOutputSchemas.postDashboardReport,
	},
	'dashboard.removeDashboardUserByUsername': {
		input: BorneoEndpointInputSchemas.removeDashboardUserByUsername,
		output: BorneoEndpointOutputSchemas.removeDashboardUserByUsername,
	},
	'dashboard.resetDashboardUserPassword': {
		input: BorneoEndpointInputSchemas.resetDashboardUserPassword,
		output: BorneoEndpointOutputSchemas.resetDashboardUserPassword,
	},
	'dashboard.triggerDashboardReportByReportId': {
		input: BorneoEndpointInputSchemas.triggerDashboardReportByReportId,
		output: BorneoEndpointOutputSchemas.triggerDashboardReportByReportId,
	},
	'dashboard.updateDashboardUserDetails': {
		input: BorneoEndpointInputSchemas.updateDashboardUserDetails,
		output: BorneoEndpointOutputSchemas.updateDashboardUserDetails,
	},
	'dashboard.updateDashboardUserRoles': {
		input: BorneoEndpointInputSchemas.updateDashboardUserRoles,
		output: BorneoEndpointOutputSchemas.updateDashboardUserRoles,
	},
	'departments.createDepartmentWithTranslations': {
		input: BorneoEndpointInputSchemas.createDepartmentWithTranslations,
		output: BorneoEndpointOutputSchemas.createDepartmentWithTranslations,
	},
	'departments.deleteDepartmentById': {
		input: BorneoEndpointInputSchemas.deleteDepartmentById,
		output: BorneoEndpointOutputSchemas.deleteDepartmentById,
	},
	'departments.getDepartmentFilterList': {
		input: BorneoEndpointInputSchemas.getDepartmentFilterList,
		output: BorneoEndpointOutputSchemas.getDepartmentFilterList,
	},
	'departments.listDepartmentsWithSortAndPagination': {
		input: BorneoEndpointInputSchemas.listDepartmentsWithSortAndPagination,
		output: BorneoEndpointOutputSchemas.listDepartmentsWithSortAndPagination,
	},
	'departments.retrieveDepartmentInformation': {
		input: BorneoEndpointInputSchemas.retrieveDepartmentInformation,
		output: BorneoEndpointOutputSchemas.retrieveDepartmentInformation,
	},
	'departments.updateDepartmentName': {
		input: BorneoEndpointInputSchemas.updateDepartmentName,
		output: BorneoEndpointOutputSchemas.updateDepartmentName,
	},
	'documents.createLegalDocumentEntry': {
		input: BorneoEndpointInputSchemas.createLegalDocumentEntry,
		output: BorneoEndpointOutputSchemas.createLegalDocumentEntry,
	},
	'documents.deleteLegalDocumentById': {
		input: BorneoEndpointInputSchemas.deleteLegalDocumentById,
		output: BorneoEndpointOutputSchemas.deleteLegalDocumentById,
	},
	'documents.listDiscoveredDocument': {
		input: BorneoEndpointInputSchemas.listDiscoveredDocument,
		output: BorneoEndpointOutputSchemas.listDiscoveredDocument,
	},
	'documents.listLegalDocumentsWithPagination': {
		input: BorneoEndpointInputSchemas.listLegalDocumentsWithPagination,
		output: BorneoEndpointOutputSchemas.listLegalDocumentsWithPagination,
	},
	'documents.retrieveDiscoveredDocumentById': {
		input: BorneoEndpointInputSchemas.retrieveDiscoveredDocumentById,
		output: BorneoEndpointOutputSchemas.retrieveDiscoveredDocumentById,
	},
	'documents.retrieveLegalDocumentById': {
		input: BorneoEndpointInputSchemas.retrieveLegalDocumentById,
		output: BorneoEndpointOutputSchemas.retrieveLegalDocumentById,
	},
	'documents.updateDiscoveredDocumentStatus': {
		input: BorneoEndpointInputSchemas.updateDiscoveredDocumentStatus,
		output: BorneoEndpointOutputSchemas.updateDiscoveredDocumentStatus,
	},
	'domains.createDomainWithPollingFrequency': {
		input: BorneoEndpointInputSchemas.createDomainWithPollingFrequency,
		output: BorneoEndpointOutputSchemas.createDomainWithPollingFrequency,
	},
	'domains.deleteDomainById': {
		input: BorneoEndpointInputSchemas.deleteDomainById,
		output: BorneoEndpointOutputSchemas.deleteDomainById,
	},
	'domains.getDomainById': {
		input: BorneoEndpointInputSchemas.getDomainById,
		output: BorneoEndpointOutputSchemas.getDomainById,
	},
	'domains.listDomainsWithPaginationAndSorting': {
		input: BorneoEndpointInputSchemas.listDomainsWithPaginationAndSorting,
		output: BorneoEndpointOutputSchemas.listDomainsWithPaginationAndSorting,
	},
	'domains.pollDomainById': {
		input: BorneoEndpointInputSchemas.pollDomainById,
		output: BorneoEndpointOutputSchemas.pollDomainById,
	},
	'domains.updateDomainDetails': {
		input: BorneoEndpointInputSchemas.updateDomainDetails,
		output: BorneoEndpointOutputSchemas.updateDomainDetails,
	},
	'employees.createEmployeeWithJsonPayload': {
		input: BorneoEndpointInputSchemas.createEmployeeWithJsonPayload,
		output: BorneoEndpointOutputSchemas.createEmployeeWithJsonPayload,
	},
	'employees.deleteEmployeeById': {
		input: BorneoEndpointInputSchemas.deleteEmployeeById,
		output: BorneoEndpointOutputSchemas.deleteEmployeeById,
	},
	'employees.filterEmployeeList': {
		input: BorneoEndpointInputSchemas.filterEmployeeList,
		output: BorneoEndpointOutputSchemas.filterEmployeeList,
	},
	'employees.listEmployeesWithFilters': {
		input: BorneoEndpointInputSchemas.listEmployeesWithFilters,
		output: BorneoEndpointOutputSchemas.listEmployeesWithFilters,
	},
	'employees.retrieveEmployeeDetailsById': {
		input: BorneoEndpointInputSchemas.retrieveEmployeeDetailsById,
		output: BorneoEndpointOutputSchemas.retrieveEmployeeDetailsById,
	},
	'employees.updateEmployeeById': {
		input: BorneoEndpointInputSchemas.updateEmployeeById,
		output: BorneoEndpointOutputSchemas.updateEmployeeById,
	},
	'headquarters.createHeadquarterEntry': {
		input: BorneoEndpointInputSchemas.createHeadquarterEntry,
		output: BorneoEndpointOutputSchemas.createHeadquarterEntry,
	},
	'headquarters.deleteHeadquartersById': {
		input: BorneoEndpointInputSchemas.deleteHeadquartersById,
		output: BorneoEndpointOutputSchemas.deleteHeadquartersById,
	},
	'headquarters.getHeadquartersById': {
		input: BorneoEndpointInputSchemas.getHeadquartersById,
		output: BorneoEndpointOutputSchemas.getHeadquartersById,
	},
	'headquarters.listHeadquartersWithSorting': {
		input: BorneoEndpointInputSchemas.listHeadquartersWithSorting,
		output: BorneoEndpointOutputSchemas.listHeadquartersWithSorting,
	},
	'headquarters.updateHeadquarterDetailsById': {
		input: BorneoEndpointInputSchemas.updateHeadquarterDetailsById,
		output: BorneoEndpointOutputSchemas.updateHeadquarterDetailsById,
	},
	'infotypes.listDiscoveredInfotypes': {
		input: BorneoEndpointInputSchemas.listDiscoveredInfotypes,
		output: BorneoEndpointOutputSchemas.listDiscoveredInfotypes,
	},
	'infotypes.retrieveDiscoveredInfotypeById': {
		input: BorneoEndpointInputSchemas.retrieveDiscoveredInfotypeById,
		output: BorneoEndpointOutputSchemas.retrieveDiscoveredInfotypeById,
	},
	'infotypes.updateDiscoveredInfotypeStatus': {
		input: BorneoEndpointInputSchemas.updateDiscoveredInfotypeStatus,
		output: BorneoEndpointOutputSchemas.updateDiscoveredInfotypeStatus,
	},
	'misc.listFilteredSortedCategories': {
		input: BorneoEndpointInputSchemas.listFilteredSortedCategories,
		output: BorneoEndpointOutputSchemas.listFilteredSortedCategories,
	},
	'misc.listIssuesWithFilters': {
		input: BorneoEndpointInputSchemas.listIssuesWithFilters,
		output: BorneoEndpointOutputSchemas.listIssuesWithFilters,
	},
	'misc.retrieveErrorDetailsById': {
		input: BorneoEndpointInputSchemas.retrieveErrorDetailsById,
		output: BorneoEndpointOutputSchemas.retrieveErrorDetailsById,
	},
	'misc.retrieveIssueById': {
		input: BorneoEndpointInputSchemas.retrieveIssueById,
		output: BorneoEndpointOutputSchemas.retrieveIssueById,
	},
	'misc.submitChatFeedback': {
		input: BorneoEndpointInputSchemas.submitChatFeedback,
		output: BorneoEndpointOutputSchemas.submitChatFeedback,
	},
	'processing.createDpiaForProcessingActivity': {
		input: BorneoEndpointInputSchemas.createDpiaForProcessingActivity,
		output: BorneoEndpointOutputSchemas.createDpiaForProcessingActivity,
	},
	'processing.createProcessingActivity': {
		input: BorneoEndpointInputSchemas.createProcessingActivity,
		output: BorneoEndpointOutputSchemas.createProcessingActivity,
	},
	'processing.createProcessingActivityThreshold': {
		input: BorneoEndpointInputSchemas.createProcessingActivityThreshold,
		output: BorneoEndpointOutputSchemas.createProcessingActivityThreshold,
	},
	'processing.createThresholdForProcessingActivity': {
		input: BorneoEndpointInputSchemas.createThresholdForProcessingActivity,
		output: BorneoEndpointOutputSchemas.createThresholdForProcessingActivity,
	},
	'processing.deleteDpiaById': {
		input: BorneoEndpointInputSchemas.deleteDpiaById,
		output: BorneoEndpointOutputSchemas.deleteDpiaById,
	},
	'processing.deleteLopdpThresholdById': {
		input: BorneoEndpointInputSchemas.deleteLopdpThresholdById,
		output: BorneoEndpointOutputSchemas.deleteLopdpThresholdById,
	},
	'processing.deleteProcessingActivityById': {
		input: BorneoEndpointInputSchemas.deleteProcessingActivityById,
		output: BorneoEndpointOutputSchemas.deleteProcessingActivityById,
	},
	'processing.deleteThresholdById': {
		input: BorneoEndpointInputSchemas.deleteThresholdById,
		output: BorneoEndpointOutputSchemas.deleteThresholdById,
	},
	'processing.exportProcessingActivitiesList': {
		input: BorneoEndpointInputSchemas.exportProcessingActivitiesList,
		output: BorneoEndpointOutputSchemas.exportProcessingActivitiesList,
	},
	'processing.getThresholdById': {
		input: BorneoEndpointInputSchemas.getThresholdById,
		output: BorneoEndpointOutputSchemas.getThresholdById,
	},
	'processing.listProcessingActivities': {
		input: BorneoEndpointInputSchemas.listProcessingActivities,
		output: BorneoEndpointOutputSchemas.listProcessingActivities,
	},
	'processing.listProcessingActivitiesFilters': {
		input: BorneoEndpointInputSchemas.listProcessingActivitiesFilters,
		output: BorneoEndpointOutputSchemas.listProcessingActivitiesFilters,
	},
	'processing.listTomsWithFilterAndPaginationOptions': {
		input: BorneoEndpointInputSchemas.listTomsWithFilterAndPaginationOptions,
		output: BorneoEndpointOutputSchemas.listTomsWithFilterAndPaginationOptions,
	},
	'processing.putTomStatusAndNote': {
		input: BorneoEndpointInputSchemas.putTomStatusAndNote,
		output: BorneoEndpointOutputSchemas.putTomStatusAndNote,
	},
	'processing.retrieveDpiaById': {
		input: BorneoEndpointInputSchemas.retrieveDpiaById,
		output: BorneoEndpointOutputSchemas.retrieveDpiaById,
	},
	'processing.retrieveLopdpThresholdById': {
		input: BorneoEndpointInputSchemas.retrieveLopdpThresholdById,
		output: BorneoEndpointOutputSchemas.retrieveLopdpThresholdById,
	},
	'processing.retrieveProcessingActivityById': {
		input: BorneoEndpointInputSchemas.retrieveProcessingActivityById,
		output: BorneoEndpointOutputSchemas.retrieveProcessingActivityById,
	},
	'processing.retrieveTomById': {
		input: BorneoEndpointInputSchemas.retrieveTomById,
		output: BorneoEndpointOutputSchemas.retrieveTomById,
	},
	'processing.updateDpiaById': {
		input: BorneoEndpointInputSchemas.updateDpiaById,
		output: BorneoEndpointOutputSchemas.updateDpiaById,
	},
	'processing.updateLopdpThresholdById': {
		input: BorneoEndpointInputSchemas.updateLopdpThresholdById,
		output: BorneoEndpointOutputSchemas.updateLopdpThresholdById,
	},
	'processing.updateProcessingActivityDetails': {
		input: BorneoEndpointInputSchemas.updateProcessingActivityDetails,
		output: BorneoEndpointOutputSchemas.updateProcessingActivityDetails,
	},
	'processing.updateThresholdById': {
		input: BorneoEndpointInputSchemas.updateThresholdById,
		output: BorneoEndpointOutputSchemas.updateThresholdById,
	},
	'recipients.addDiscoveredRecipients': {
		input: BorneoEndpointInputSchemas.addDiscoveredRecipients,
		output: BorneoEndpointOutputSchemas.addDiscoveredRecipients,
	},
	'recipients.archiveDiscoveredRecipient': {
		input: BorneoEndpointInputSchemas.archiveDiscoveredRecipient,
		output: BorneoEndpointOutputSchemas.archiveDiscoveredRecipient,
	},
	'recipients.createRecipientWithDetails': {
		input: BorneoEndpointInputSchemas.createRecipientWithDetails,
		output: BorneoEndpointOutputSchemas.createRecipientWithDetails,
	},
	'recipients.deleteRecipientById': {
		input: BorneoEndpointInputSchemas.deleteRecipientById,
		output: BorneoEndpointOutputSchemas.deleteRecipientById,
	},
	'recipients.exportRecipientsListWithFilter': {
		input: BorneoEndpointInputSchemas.exportRecipientsListWithFilter,
		output: BorneoEndpointOutputSchemas.exportRecipientsListWithFilter,
	},
	'recipients.filterRecipientsList': {
		input: BorneoEndpointInputSchemas.filterRecipientsList,
		output: BorneoEndpointOutputSchemas.filterRecipientsList,
	},
	'recipients.listDiscoveredRecipients': {
		input: BorneoEndpointInputSchemas.listDiscoveredRecipients,
		output: BorneoEndpointOutputSchemas.listDiscoveredRecipients,
	},
	'recipients.listFilterOptionsForRecipients': {
		input: BorneoEndpointInputSchemas.listFilterOptionsForRecipients,
		output: BorneoEndpointOutputSchemas.listFilterOptionsForRecipients,
	},
	'recipients.listOrFilterRecipients': {
		input: BorneoEndpointInputSchemas.listOrFilterRecipients,
		output: BorneoEndpointOutputSchemas.listOrFilterRecipients,
	},
	'recipients.postDiscoveredRecipientById': {
		input: BorneoEndpointInputSchemas.postDiscoveredRecipientById,
		output: BorneoEndpointOutputSchemas.postDiscoveredRecipientById,
	},
	'recipients.retrieveDiscoveredRecipientById': {
		input: BorneoEndpointInputSchemas.retrieveDiscoveredRecipientById,
		output: BorneoEndpointOutputSchemas.retrieveDiscoveredRecipientById,
	},
	'recipients.retrieveRecipientDetails': {
		input: BorneoEndpointInputSchemas.retrieveRecipientDetails,
		output: BorneoEndpointOutputSchemas.retrieveRecipientDetails,
	},
	'recipients.retrieveRecipientProcessingActivities': {
		input: BorneoEndpointInputSchemas.retrieveRecipientProcessingActivities,
		output: BorneoEndpointOutputSchemas.retrieveRecipientProcessingActivities,
	},
	'recipients.updateDashboardReportFrequencyAndRecipients': {
		input:
			BorneoEndpointInputSchemas.updateDashboardReportFrequencyAndRecipients,
		output:
			BorneoEndpointOutputSchemas.updateDashboardReportFrequencyAndRecipients,
	},
	'recipients.updateRecipientDetailsById': {
		input: BorneoEndpointInputSchemas.updateRecipientDetailsById,
		output: BorneoEndpointOutputSchemas.updateRecipientDetailsById,
	},
	'recipients.updateRecipientStatusViaId': {
		input: BorneoEndpointInputSchemas.updateRecipientStatusViaId,
		output: BorneoEndpointOutputSchemas.updateRecipientStatusViaId,
	},
	'resources.deleteTagFromResource': {
		input: BorneoEndpointInputSchemas.deleteTagFromResource,
		output: BorneoEndpointOutputSchemas.deleteTagFromResource,
	},
	'resources.exportFilteredLeafResources': {
		input: BorneoEndpointInputSchemas.exportFilteredLeafResources,
		output: BorneoEndpointOutputSchemas.exportFilteredLeafResources,
	},
	'resources.exportInventoryResourceList': {
		input: BorneoEndpointInputSchemas.exportInventoryResourceList,
		output: BorneoEndpointOutputSchemas.exportInventoryResourceList,
	},
	'resources.getResourceInventoryById': {
		input: BorneoEndpointInputSchemas.getResourceInventoryById,
		output: BorneoEndpointOutputSchemas.getResourceInventoryById,
	},
	'resources.listInventoryResourcesWithFilters': {
		input: BorneoEndpointInputSchemas.listInventoryResourcesWithFilters,
		output: BorneoEndpointOutputSchemas.listInventoryResourcesWithFilters,
	},
	'resources.listLeafResourcesWithFilters': {
		input: BorneoEndpointInputSchemas.listLeafResourcesWithFilters,
		output: BorneoEndpointOutputSchemas.listLeafResourcesWithFilters,
	},
	'resources.postClassificationStats': {
		input: BorneoEndpointInputSchemas.postClassificationStats,
		output: BorneoEndpointOutputSchemas.postClassificationStats,
	},
	'resources.postResourceLineageFilter': {
		input: BorneoEndpointInputSchemas.postResourceLineageFilter,
		output: BorneoEndpointOutputSchemas.postResourceLineageFilter,
	},
	'resources.postResourceStatsWithDeletedResources': {
		input: BorneoEndpointInputSchemas.postResourceStatsWithDeletedResources,
		output: BorneoEndpointOutputSchemas.postResourceStatsWithDeletedResources,
	},
	'resources.retrieveDataResourceStatistics': {
		input: BorneoEndpointInputSchemas.retrieveDataResourceStatistics,
		output: BorneoEndpointOutputSchemas.retrieveDataResourceStatistics,
	},
	'resources.retrieveResourceCatalogById': {
		input: BorneoEndpointInputSchemas.retrieveResourceCatalogById,
		output: BorneoEndpointOutputSchemas.retrieveResourceCatalogById,
	},
	'resources.retrieveResourceColumns': {
		input: BorneoEndpointInputSchemas.retrieveResourceColumns,
		output: BorneoEndpointOutputSchemas.retrieveResourceColumns,
	},
	'scans.accessScanIterationById': {
		input: BorneoEndpointInputSchemas.accessScanIterationById,
		output: BorneoEndpointOutputSchemas.accessScanIterationById,
	},
	'scans.createAndScheduleCloudResourceScan': {
		input: BorneoEndpointInputSchemas.createAndScheduleCloudResourceScan,
		output: BorneoEndpointOutputSchemas.createAndScheduleCloudResourceScan,
	},
	'scans.exportInsightPageUsingScanId': {
		input: BorneoEndpointInputSchemas.exportInsightPageUsingScanId,
		output: BorneoEndpointOutputSchemas.exportInsightPageUsingScanId,
	},
	'scans.filterAndListInspectionResults': {
		input: BorneoEndpointInputSchemas.filterAndListInspectionResults,
		output: BorneoEndpointOutputSchemas.filterAndListInspectionResults,
	},
	'scans.getInsightByTypeAndId': {
		input: BorneoEndpointInputSchemas.getInsightByTypeAndId,
		output: BorneoEndpointOutputSchemas.getInsightByTypeAndId,
	},
	'scans.getScanByScanId': {
		input: BorneoEndpointInputSchemas.getScanByScanId,
		output: BorneoEndpointOutputSchemas.getScanByScanId,
	},
	'scans.listErrorDetailsFromFilteredScanIterations': {
		input:
			BorneoEndpointInputSchemas.listErrorDetailsFromFilteredScanIterations,
		output:
			BorneoEndpointOutputSchemas.listErrorDetailsFromFilteredScanIterations,
	},
	'scans.listInsightFilters': {
		input: BorneoEndpointInputSchemas.listInsightFilters,
		output: BorneoEndpointOutputSchemas.listInsightFilters,
	},
	'scans.listScanExecutionResults': {
		input: BorneoEndpointInputSchemas.listScanExecutionResults,
		output: BorneoEndpointOutputSchemas.listScanExecutionResults,
	},
	'scans.listScanIterationsWithFilter': {
		input: BorneoEndpointInputSchemas.listScanIterationsWithFilter,
		output: BorneoEndpointOutputSchemas.listScanIterationsWithFilter,
	},
	'scans.listScansWithFilters': {
		input: BorneoEndpointInputSchemas.listScansWithFilters,
		output: BorneoEndpointOutputSchemas.listScansWithFilters,
	},
	'scans.markScanFalsePositivesById': {
		input: BorneoEndpointInputSchemas.markScanFalsePositivesById,
		output: BorneoEndpointOutputSchemas.markScanFalsePositivesById,
	},
	'scans.pauseScanById': {
		input: BorneoEndpointInputSchemas.pauseScanById,
		output: BorneoEndpointOutputSchemas.pauseScanById,
	},
	'scans.postScanResourceStatus': {
		input: BorneoEndpointInputSchemas.postScanResourceStatus,
		output: BorneoEndpointOutputSchemas.postScanResourceStatus,
	},
	'scans.resumeScanById': {
		input: BorneoEndpointInputSchemas.resumeScanById,
		output: BorneoEndpointOutputSchemas.resumeScanById,
	},
	'scans.scanLegalDocumentById': {
		input: BorneoEndpointInputSchemas.scanLegalDocumentById,
		output: BorneoEndpointOutputSchemas.scanLegalDocumentById,
	},
	'scans.stopScanViaScanId': {
		input: BorneoEndpointInputSchemas.stopScanViaScanId,
		output: BorneoEndpointOutputSchemas.stopScanViaScanId,
	},
	'scans.submitDetailedScanResults': {
		input: BorneoEndpointInputSchemas.submitDetailedScanResults,
		output: BorneoEndpointOutputSchemas.submitDetailedScanResults,
	},
	'support.postSupportChatQuery': {
		input: BorneoEndpointInputSchemas.postSupportChatQuery,
		output: BorneoEndpointOutputSchemas.postSupportChatQuery,
	},
	'users.getUserProfileById': {
		input: BorneoEndpointInputSchemas.getUserProfileById,
		output: BorneoEndpointOutputSchemas.getUserProfileById,
	},
	'users.listUserProfileWithFiltersAndSorting': {
		input: BorneoEndpointInputSchemas.listUserProfileWithFiltersAndSorting,
		output: BorneoEndpointOutputSchemas.listUserProfileWithFiltersAndSorting,
	},
	'users.verifyEmailWithIdAndToken': {
		input: BorneoEndpointInputSchemas.verifyEmailWithIdAndToken,
		output: BorneoEndpointOutputSchemas.verifyEmailWithIdAndToken,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof borneoEndpointsNested
>;

const borneoEndpointMeta = {
	'accounts.getCloudAccountById': {
		riskLevel: 'read',
		description: 'Get cloud account by id',
	},
	'accounts.postAccountsWithFilterAndSortOptions': {
		riskLevel: 'write',
		description: 'Post accounts with filter and sort options',
	},
	'accounts.retrieveAccountDetailsById': {
		riskLevel: 'read',
		description: 'Retrieve account details by id',
	},
	'assets.createNewAsset': {
		riskLevel: 'write',
		description: 'Create new asset',
	},
	'assets.deleteAssetById': {
		riskLevel: 'destructive',
		description: 'Delete asset by id',
	},
	'assets.filterAndSortAssetsList': {
		riskLevel: 'read',
		description: 'Filter and sort assets list',
	},
	'assets.retrieveAssetById': {
		riskLevel: 'read',
		description: 'Retrieve asset by id',
	},
	'assets.updateAssetInformationById': {
		riskLevel: 'write',
		description: 'Update asset information by id',
	},
	'audit.listEventsWithFilters': {
		riskLevel: 'read',
		description: 'List events with filters',
	},
	'audit.postFilteredAccessLogs': {
		riskLevel: 'write',
		description: 'Post filtered access logs',
	},
	'audit.postLogAuditRecordsWithFilterCriteria': {
		riskLevel: 'write',
		description: 'Post log audit records with filter criteria',
	},
	'breaches.deleteDataBreachById': {
		riskLevel: 'destructive',
		description: 'Delete data breach by id',
	},
	'breaches.evaluateDataBreachImpact': {
		riskLevel: 'write',
		description: 'Evaluate data breach impact',
	},
	'breaches.fetchDataBreachEvaluation': {
		riskLevel: 'read',
		description: 'Fetch data breach evaluation',
	},
	'breaches.listDataBreachFilters': {
		riskLevel: 'read',
		description: 'List data breach filters',
	},
	'breaches.listDataBreachesWithFilters': {
		riskLevel: 'read',
		description: 'List data breaches with filters',
	},
	'breaches.postDataBreachInformation': {
		riskLevel: 'write',
		description: 'Post data breach information',
	},
	'breaches.retrieveDataBreachById': {
		riskLevel: 'read',
		description: 'Retrieve data breach by id',
	},
	'breaches.updateDataBreachEntry': {
		riskLevel: 'write',
		description: 'Update data breach entry',
	},
	'categories.createNewInfotypeCategory': {
		riskLevel: 'write',
		description: 'Create new infotype category',
	},
	'categories.deleteCategoryByLabel': {
		riskLevel: 'destructive',
		description: 'Delete category by label',
	},
	'categories.getCategoryByLabel': {
		riskLevel: 'read',
		description: 'Get category by label',
	},
	'categories.updateCategoryInfotypes': {
		riskLevel: 'write',
		description: 'Update category infotypes',
	},
	'connectors.postConnectorWithFilteringOptions': {
		riskLevel: 'write',
		description: 'Post connector with filtering options',
	},
	'connectors.retrieveConnectorById': {
		riskLevel: 'read',
		description: 'Retrieve connector by id',
	},
	'dashboard.createDashboardUser': {
		riskLevel: 'write',
		description: 'Create dashboard user',
	},
	'dashboard.deleteDashboardReportById': {
		riskLevel: 'destructive',
		description: 'Delete dashboard report by id',
	},
	'dashboard.disableDashboardUserByUsername': {
		riskLevel: 'write',
		description: 'Disable dashboard user by username',
	},
	'dashboard.downloadDashboardReport': {
		riskLevel: 'read',
		description: 'Download dashboard report',
	},
	'dashboard.downloadDashboardReportEdition': {
		riskLevel: 'read',
		description: 'Download dashboard report edition',
	},
	'dashboard.enableDashboardUser': {
		riskLevel: 'write',
		description: 'Enable dashboard user',
	},
	'dashboard.fetchDashboardReportById': {
		riskLevel: 'read',
		description: 'Fetch dashboard report by id',
	},
	'dashboard.getDashboardReportEditionById': {
		riskLevel: 'read',
		description: 'Get dashboard report edition by id',
	},
	'dashboard.listDashboardReportEditions': {
		riskLevel: 'read',
		description: 'List dashboard report editions',
	},
	'dashboard.listDashboardReportsWithFilters': {
		riskLevel: 'read',
		description: 'List dashboard reports with filters',
	},
	'dashboard.listDashboardUsersWithFilters': {
		riskLevel: 'read',
		description: 'List dashboard users with filters',
	},
	'dashboard.postCurrentDashboardUser': {
		riskLevel: 'write',
		description: 'Post current dashboard user',
	},
	'dashboard.postDashboardReport': {
		riskLevel: 'write',
		description: 'Post dashboard report',
	},
	'dashboard.removeDashboardUserByUsername': {
		riskLevel: 'destructive',
		description: 'Remove dashboard user by username',
	},
	'dashboard.resetDashboardUserPassword': {
		riskLevel: 'write',
		description: 'Reset dashboard user password',
	},
	'dashboard.triggerDashboardReportByReportId': {
		riskLevel: 'write',
		description: 'Trigger dashboard report by report id',
	},
	'dashboard.updateDashboardUserDetails': {
		riskLevel: 'write',
		description: 'Update dashboard user details',
	},
	'dashboard.updateDashboardUserRoles': {
		riskLevel: 'write',
		description: 'Update dashboard user roles',
	},
	'departments.createDepartmentWithTranslations': {
		riskLevel: 'write',
		description: 'Create department with translations',
	},
	'departments.deleteDepartmentById': {
		riskLevel: 'destructive',
		description: 'Delete department by id',
	},
	'departments.getDepartmentFilterList': {
		riskLevel: 'read',
		description: 'Get department filter list',
	},
	'departments.listDepartmentsWithSortAndPagination': {
		riskLevel: 'read',
		description: 'List departments with sort and pagination',
	},
	'departments.retrieveDepartmentInformation': {
		riskLevel: 'read',
		description: 'Retrieve department information',
	},
	'departments.updateDepartmentName': {
		riskLevel: 'write',
		description: 'Update department name',
	},
	'documents.createLegalDocumentEntry': {
		riskLevel: 'write',
		description: 'Create legal document entry',
	},
	'documents.deleteLegalDocumentById': {
		riskLevel: 'destructive',
		description: 'Delete legal document by id',
	},
	'documents.listDiscoveredDocument': {
		riskLevel: 'read',
		description: 'List discovered document',
	},
	'documents.listLegalDocumentsWithPagination': {
		riskLevel: 'read',
		description: 'List legal documents with pagination',
	},
	'documents.retrieveDiscoveredDocumentById': {
		riskLevel: 'read',
		description: 'Retrieve discovered document by id',
	},
	'documents.retrieveLegalDocumentById': {
		riskLevel: 'read',
		description: 'Retrieve legal document by id',
	},
	'documents.updateDiscoveredDocumentStatus': {
		riskLevel: 'write',
		description: 'Update discovered document status',
	},
	'domains.createDomainWithPollingFrequency': {
		riskLevel: 'write',
		description: 'Create domain with polling frequency',
	},
	'domains.deleteDomainById': {
		riskLevel: 'destructive',
		description: 'Delete domain by id',
	},
	'domains.getDomainById': {
		riskLevel: 'read',
		description: 'Get domain by id',
	},
	'domains.listDomainsWithPaginationAndSorting': {
		riskLevel: 'read',
		description: 'List domains with pagination and sorting',
	},
	'domains.pollDomainById': {
		riskLevel: 'write',
		description: 'Poll domain by id',
	},
	'domains.updateDomainDetails': {
		riskLevel: 'write',
		description: 'Update domain details',
	},
	'employees.createEmployeeWithJsonPayload': {
		riskLevel: 'write',
		description: 'Create employee with json payload',
	},
	'employees.deleteEmployeeById': {
		riskLevel: 'destructive',
		description: 'Delete employee by id',
	},
	'employees.filterEmployeeList': {
		riskLevel: 'read',
		description: 'Filter employee list',
	},
	'employees.listEmployeesWithFilters': {
		riskLevel: 'read',
		description: 'List employees with filters',
	},
	'employees.retrieveEmployeeDetailsById': {
		riskLevel: 'read',
		description: 'Retrieve employee details by id',
	},
	'employees.updateEmployeeById': {
		riskLevel: 'write',
		description: 'Update employee by id',
	},
	'headquarters.createHeadquarterEntry': {
		riskLevel: 'write',
		description: 'Create headquarter entry',
	},
	'headquarters.deleteHeadquartersById': {
		riskLevel: 'destructive',
		description: 'Delete headquarters by id',
	},
	'headquarters.getHeadquartersById': {
		riskLevel: 'read',
		description: 'Get headquarters by id',
	},
	'headquarters.listHeadquartersWithSorting': {
		riskLevel: 'read',
		description: 'List headquarters with sorting',
	},
	'headquarters.updateHeadquarterDetailsById': {
		riskLevel: 'write',
		description: 'Update headquarter details by id',
	},
	'infotypes.listDiscoveredInfotypes': {
		riskLevel: 'read',
		description: 'List discovered infotypes',
	},
	'infotypes.retrieveDiscoveredInfotypeById': {
		riskLevel: 'read',
		description: 'Retrieve discovered infotype by id',
	},
	'infotypes.updateDiscoveredInfotypeStatus': {
		riskLevel: 'write',
		description: 'Update discovered infotype status',
	},
	'misc.listFilteredSortedCategories': {
		riskLevel: 'read',
		description: 'List filtered sorted categories',
	},
	'misc.listIssuesWithFilters': {
		riskLevel: 'read',
		description: 'List issues with filters',
	},
	'misc.retrieveErrorDetailsById': {
		riskLevel: 'read',
		description: 'Retrieve error details by id',
	},
	'misc.retrieveIssueById': {
		riskLevel: 'read',
		description: 'Retrieve issue by id',
	},
	'misc.submitChatFeedback': {
		riskLevel: 'write',
		description: 'Submit chat feedback',
	},
	'processing.createDpiaForProcessingActivity': {
		riskLevel: 'write',
		description: 'Create dpia for processing activity',
	},
	'processing.createProcessingActivity': {
		riskLevel: 'write',
		description: 'Create processing activity',
	},
	'processing.createProcessingActivityThreshold': {
		riskLevel: 'write',
		description: 'Create processing activity threshold',
	},
	'processing.createThresholdForProcessingActivity': {
		riskLevel: 'write',
		description: 'Create threshold for processing activity',
	},
	'processing.deleteDpiaById': {
		riskLevel: 'destructive',
		description: 'Delete dpia by id',
	},
	'processing.deleteLopdpThresholdById': {
		riskLevel: 'destructive',
		description: 'Delete lopdp threshold by id',
	},
	'processing.deleteProcessingActivityById': {
		riskLevel: 'destructive',
		description: 'Delete processing activity by id',
	},
	'processing.deleteThresholdById': {
		riskLevel: 'destructive',
		description: 'Delete threshold by id',
	},
	'processing.exportProcessingActivitiesList': {
		riskLevel: 'read',
		description: 'Export processing activities list',
	},
	'processing.getThresholdById': {
		riskLevel: 'read',
		description: 'Get threshold by id',
	},
	'processing.listProcessingActivities': {
		riskLevel: 'read',
		description: 'List processing activities',
	},
	'processing.listProcessingActivitiesFilters': {
		riskLevel: 'read',
		description: 'List processing activities filters',
	},
	'processing.listTomsWithFilterAndPaginationOptions': {
		riskLevel: 'read',
		description: 'List toms with filter and pagination options',
	},
	'processing.putTomStatusAndNote': {
		riskLevel: 'write',
		description: 'Put tom status and note',
	},
	'processing.retrieveDpiaById': {
		riskLevel: 'read',
		description: 'Retrieve dpia by id',
	},
	'processing.retrieveLopdpThresholdById': {
		riskLevel: 'read',
		description: 'Retrieve lopdp threshold by id',
	},
	'processing.retrieveProcessingActivityById': {
		riskLevel: 'read',
		description: 'Retrieve processing activity by id',
	},
	'processing.retrieveTomById': {
		riskLevel: 'read',
		description: 'Retrieve tom by id',
	},
	'processing.updateDpiaById': {
		riskLevel: 'write',
		description: 'Update dpia by id',
	},
	'processing.updateLopdpThresholdById': {
		riskLevel: 'write',
		description: 'Update lopdp threshold by id',
	},
	'processing.updateProcessingActivityDetails': {
		riskLevel: 'write',
		description: 'Update processing activity details',
	},
	'processing.updateThresholdById': {
		riskLevel: 'write',
		description: 'Update threshold by id',
	},
	'recipients.addDiscoveredRecipients': {
		riskLevel: 'write',
		description: 'Add discovered recipients',
	},
	'recipients.archiveDiscoveredRecipient': {
		riskLevel: 'write',
		description: 'Archive discovered recipient',
	},
	'recipients.createRecipientWithDetails': {
		riskLevel: 'write',
		description: 'Create recipient with details',
	},
	'recipients.deleteRecipientById': {
		riskLevel: 'destructive',
		description: 'Delete recipient by id',
	},
	'recipients.exportRecipientsListWithFilter': {
		riskLevel: 'read',
		description: 'Export recipients list with filter',
	},
	'recipients.filterRecipientsList': {
		riskLevel: 'read',
		description: 'Filter recipients list',
	},
	'recipients.listDiscoveredRecipients': {
		riskLevel: 'read',
		description: 'List discovered recipients',
	},
	'recipients.listFilterOptionsForRecipients': {
		riskLevel: 'read',
		description: 'List filter options for recipients',
	},
	'recipients.listOrFilterRecipients': {
		riskLevel: 'read',
		description: 'List or filter recipients',
	},
	'recipients.postDiscoveredRecipientById': {
		riskLevel: 'write',
		description: 'Post discovered recipient by id',
	},
	'recipients.retrieveDiscoveredRecipientById': {
		riskLevel: 'read',
		description: 'Retrieve discovered recipient by id',
	},
	'recipients.retrieveRecipientDetails': {
		riskLevel: 'read',
		description: 'Retrieve recipient details',
	},
	'recipients.retrieveRecipientProcessingActivities': {
		riskLevel: 'read',
		description: 'Retrieve recipient processing activities',
	},
	'recipients.updateDashboardReportFrequencyAndRecipients': {
		riskLevel: 'write',
		description: 'Update dashboard report frequency and recipients',
	},
	'recipients.updateRecipientDetailsById': {
		riskLevel: 'write',
		description: 'Update recipient details by id',
	},
	'recipients.updateRecipientStatusViaId': {
		riskLevel: 'write',
		description: 'Update recipient status via id',
	},
	'resources.deleteTagFromResource': {
		riskLevel: 'destructive',
		description: 'Delete tag from resource',
	},
	'resources.exportFilteredLeafResources': {
		riskLevel: 'read',
		description: 'Export filtered leaf resources',
	},
	'resources.exportInventoryResourceList': {
		riskLevel: 'read',
		description: 'Export inventory resource list',
	},
	'resources.getResourceInventoryById': {
		riskLevel: 'read',
		description: 'Get resource inventory by id',
	},
	'resources.listInventoryResourcesWithFilters': {
		riskLevel: 'read',
		description: 'List inventory resources with filters',
	},
	'resources.listLeafResourcesWithFilters': {
		riskLevel: 'read',
		description: 'List leaf resources with filters',
	},
	'resources.postClassificationStats': {
		riskLevel: 'write',
		description: 'Post classification stats',
	},
	'resources.postResourceLineageFilter': {
		riskLevel: 'write',
		description: 'Post resource lineage filter',
	},
	'resources.postResourceStatsWithDeletedResources': {
		riskLevel: 'write',
		description: 'Post resource stats with deleted resources',
	},
	'resources.retrieveDataResourceStatistics': {
		riskLevel: 'read',
		description: 'Retrieve data resource statistics',
	},
	'resources.retrieveResourceCatalogById': {
		riskLevel: 'read',
		description: 'Retrieve resource catalog by id',
	},
	'resources.retrieveResourceColumns': {
		riskLevel: 'read',
		description: 'Retrieve resource columns',
	},
	'scans.accessScanIterationById': {
		riskLevel: 'read',
		description: 'Access scan iteration by id',
	},
	'scans.createAndScheduleCloudResourceScan': {
		riskLevel: 'write',
		description: 'Create and schedule cloud resource scan',
	},
	'scans.exportInsightPageUsingScanId': {
		riskLevel: 'read',
		description: 'Export insight page using scanid',
	},
	'scans.filterAndListInspectionResults': {
		riskLevel: 'read',
		description: 'Filter and list inspection results',
	},
	'scans.getInsightByTypeAndId': {
		riskLevel: 'read',
		description: 'Get insight by type and id',
	},
	'scans.getScanByScanId': {
		riskLevel: 'read',
		description: 'Get scan by scanid',
	},
	'scans.listErrorDetailsFromFilteredScanIterations': {
		riskLevel: 'read',
		description: 'List error details from filtered scan iterations',
	},
	'scans.listInsightFilters': {
		riskLevel: 'read',
		description: 'List insight filters',
	},
	'scans.listScanExecutionResults': {
		riskLevel: 'read',
		description: 'List scan execution results',
	},
	'scans.listScanIterationsWithFilter': {
		riskLevel: 'read',
		description: 'List scan iterations with filter',
	},
	'scans.listScansWithFilters': {
		riskLevel: 'read',
		description: 'List scans with filters',
	},
	'scans.markScanFalsePositivesById': {
		riskLevel: 'write',
		description: 'Mark scan false positives by id',
	},
	'scans.pauseScanById': {
		riskLevel: 'write',
		description: 'Pause scan by id',
	},
	'scans.postScanResourceStatus': {
		riskLevel: 'write',
		description: 'Post scan resource status',
	},
	'scans.resumeScanById': {
		riskLevel: 'write',
		description: 'Resume scan by id',
	},
	'scans.scanLegalDocumentById': {
		riskLevel: 'write',
		description: 'Scan legal document byid',
	},
	'scans.stopScanViaScanId': {
		riskLevel: 'write',
		description: 'Stop scan via scanid',
	},
	'scans.submitDetailedScanResults': {
		riskLevel: 'write',
		description: 'Submit detailed scan results',
	},
	'support.postSupportChatQuery': {
		riskLevel: 'write',
		description: 'Post support chat query',
	},
	'users.getUserProfileById': {
		riskLevel: 'read',
		description: 'Get user profile by id',
	},
	'users.listUserProfileWithFiltersAndSorting': {
		riskLevel: 'read',
		description: 'List user profile with filters and sorting',
	},
	'users.verifyEmailWithIdAndToken': {
		riskLevel: 'write',
		description: 'Verify email with id and token',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof borneoEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBorneoPlugin<T extends BorneoPluginOptions> = CorsairPlugin<
	'borneo',
	typeof BorneoSchema,
	typeof borneoEndpointsNested,
	Record<never, never>,
	T,
	typeof defaultAuthType,
	typeof borneoAuthConfig
>;

export type InternalBorneoPlugin = BaseBorneoPlugin<BorneoPluginOptions>;
export type ExternalBorneoPlugin<T extends BorneoPluginOptions> =
	BaseBorneoPlugin<T>;

/**
 * Creates a configured Borneo Corsair plugin.
 *
 * Provider credentials remain separate from the Composio project API key,
 * while endpoint metadata supplies the operation safety classification.
 */
export function borneo<const T extends BorneoPluginOptions>(
	incomingOptions: BorneoPluginOptions & T = {} as BorneoPluginOptions & T,
): ExternalBorneoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'borneo',
		authConfig: borneoAuthConfig,
		schema: BorneoSchema,
		options,
		hooks: options.hooks,
		endpoints: borneoEndpointsNested,
		webhooks: {},
		endpointMeta: borneoEndpointMeta,
		endpointSchemas: borneoEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BorneoKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('borneo', 'api_key');
			}
			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('borneo', 'api_key');
				}
				return key;
			}

			if (ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();
				if (!token) {
					throw new AuthMissingError('borneo', 'oauth_2');
				}
				return token;
			}

			throw new AuthMissingError('borneo', 'api_key');
		},
	} satisfies InternalBorneoPlugin;
}

export type {
	BorneoEndpointInputs,
	BorneoEndpointOutputs,
	BorneoToolInput,
	BorneoToolResponse,
} from './endpoints/types';
