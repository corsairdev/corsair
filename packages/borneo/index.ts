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
import { BORNEO_OPERATIONS } from './operations';
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
	timeoutMs?: number;
	signal?: AbortSignal;
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

export const borneoEndpointSchemas: RequiredPluginEndpointSchemas<typeof borneoEndpointsNested> = {
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

const borneoEndpointMeta = Object.fromEntries(
	BORNEO_OPERATIONS.map((operation) => [
		`${operation.group}.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			description: operation.title,
		},
	]),
) as RequiredPluginEndpointMeta<
	typeof borneoEndpointsNested
> satisfies RequiredPluginEndpointMeta<typeof borneoEndpointsNested>;

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
