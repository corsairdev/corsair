import { z } from 'zod';
import type {
	AlertingRuleCreateInput,
	AlertingRuleCreateResponse,
	AlertingRuleDeleteInput,
	AlertingRuleDeleteResponse,
	AlertingRulesListInput,
	AlertingRulesListResponse,
	AlertingRuleTypesListInput,
	AlertingRuleTypesListResponse,
} from './alerting';
import {
	AlertingRuleCreateInputSchema,
	AlertingRuleCreateResponseSchema,
	AlertingRuleDeleteInputSchema,
	AlertingRuleDeleteResponseSchema,
	AlertingRulesListInputSchema,
	AlertingRulesListResponseSchema,
	AlertingRuleTypesListInputSchema,
	AlertingRuleTypesListResponseSchema,
} from './alerting';
import type {
	CasesCreateInput,
	CasesCreateResponse,
	CasesListInput,
	CasesListResponse,
} from './cases';
import {
	CasesCreateInputSchema,
	CasesCreateResponseSchema,
	CasesListInputSchema,
	CasesListResponseSchema,
} from './cases';
import type {
	ConnectorsCreateInput,
	ConnectorsCreateResponse,
	ConnectorsDeleteInput,
	ConnectorsDeleteResponse,
	ConnectorsGetInput,
	ConnectorsGetResponse,
	ConnectorsListInput,
	ConnectorsListResponse,
	ConnectorTypesListInput,
	ConnectorTypesListResponse,
} from './connectors';
import {
	ConnectorsCreateInputSchema,
	ConnectorsCreateResponseSchema,
	ConnectorsDeleteInputSchema,
	ConnectorsDeleteResponseSchema,
	ConnectorsGetInputSchema,
	ConnectorsGetResponseSchema,
	ConnectorsListInputSchema,
	ConnectorsListResponseSchema,
	ConnectorTypesListInputSchema,
	ConnectorTypesListResponseSchema,
} from './connectors';
import type {
	DashboardsCreateInput,
	DashboardsCreateResponse,
	DashboardsDeleteInput,
	DashboardsDeleteResponse,
	DashboardsGetInput,
	DashboardsGetResponse,
	DashboardsSearchInput,
	DashboardsSearchResponse,
	DashboardsUpsertInput,
	DashboardsUpsertResponse,
} from './dashboards';
import {
	DashboardsCreateInputSchema,
	DashboardsCreateResponseSchema,
	DashboardsDeleteInputSchema,
	DashboardsDeleteResponseSchema,
	DashboardsGetInputSchema,
	DashboardsGetResponseSchema,
	DashboardsSearchInputSchema,
	DashboardsSearchResponseSchema,
	DashboardsUpsertInputSchema,
	DashboardsUpsertResponseSchema,
} from './dashboards';
import type {
	DataViewsCreateInput,
	DataViewsCreateResponse,
	DataViewsListInput,
	DataViewsListResponse,
} from './data-views-ext';
import {
	DataViewsCreateInputSchema,
	DataViewsCreateResponseSchema,
	DataViewsListInputSchema,
	DataViewsListResponseSchema,
} from './data-views-ext';
import type {
	AlertsFindInput,
	AlertsFindResponse,
	DetectionRulesFindInput,
	DetectionRulesFindResponse,
} from './detection-engine';
import {
	AlertsFindInputSchema,
	AlertsFindResponseSchema,
	DetectionRulesFindInputSchema,
	DetectionRulesFindResponseSchema,
} from './detection-engine';
import type {
	FleetAgentPoliciesListInput,
	FleetAgentPoliciesListResponse,
	FleetAgentsSetupInput,
	FleetAgentsSetupResponse,
	FleetAgentsVersionsInput,
	FleetAgentsVersionsResponse,
	FleetCheckPermissionsInput,
	FleetCheckPermissionsResponse,
	FleetEnrollmentKeyGetInput,
	FleetEnrollmentKeyGetResponse,
	FleetEnrollmentKeysListInput,
	FleetEnrollmentKeysListResponse,
	FleetEpmCategoriesInput,
	FleetEpmCategoriesResponse,
	FleetEpmDataStreamsInput,
	FleetEpmDataStreamsResponse,
	FleetEpmPackageDetailsInput,
	FleetEpmPackageDetailsResponse,
	FleetEpmPackageFileInput,
	FleetEpmPackageFileResponse,
	FleetEpmPackageStatsInput,
	FleetEpmPackageStatsResponse,
	FleetEpmPackagesInstalledInput,
	FleetEpmPackagesInstalledResponse,
	FleetEpmPackagesLimitedInput,
	FleetEpmPackagesLimitedResponse,
	FleetEpmPackagesListInput,
	FleetEpmPackagesListResponse,
	FleetOutputDeleteInput,
	FleetOutputDeleteResponse,
	FleetPackagePoliciesListInput,
	FleetPackagePoliciesListResponse,
	FleetProxyDeleteInput,
	FleetProxyDeleteResponse,
	FleetServerHostGetInput,
	FleetServerHostGetResponse,
	FleetServerHostsListInput,
	FleetServerHostsListResponse,
} from './fleet';
import {
	FleetAgentPoliciesListInputSchema,
	FleetAgentPoliciesListResponseSchema,
	FleetAgentsSetupInputSchema,
	FleetAgentsSetupResponseSchema,
	FleetAgentsVersionsInputSchema,
	FleetAgentsVersionsResponseSchema,
	FleetCheckPermissionsInputSchema,
	FleetCheckPermissionsResponseSchema,
	FleetEnrollmentKeyGetInputSchema,
	FleetEnrollmentKeyGetResponseSchema,
	FleetEnrollmentKeysListInputSchema,
	FleetEnrollmentKeysListResponseSchema,
	FleetEpmCategoriesInputSchema,
	FleetEpmCategoriesResponseSchema,
	FleetEpmDataStreamsInputSchema,
	FleetEpmDataStreamsResponseSchema,
	FleetEpmPackageDetailsInputSchema,
	FleetEpmPackageDetailsResponseSchema,
	FleetEpmPackageFileInputSchema,
	FleetEpmPackageFileResponseSchema,
	FleetEpmPackageStatsInputSchema,
	FleetEpmPackageStatsResponseSchema,
	FleetEpmPackagesInstalledInputSchema,
	FleetEpmPackagesInstalledResponseSchema,
	FleetEpmPackagesLimitedInputSchema,
	FleetEpmPackagesLimitedResponseSchema,
	FleetEpmPackagesListInputSchema,
	FleetEpmPackagesListResponseSchema,
	FleetOutputDeleteInputSchema,
	FleetOutputDeleteResponseSchema,
	FleetPackagePoliciesListInputSchema,
	FleetPackagePoliciesListResponseSchema,
	FleetProxyDeleteInputSchema,
	FleetProxyDeleteResponseSchema,
	FleetServerHostGetInputSchema,
	FleetServerHostGetResponseSchema,
	FleetServerHostsListInputSchema,
	FleetServerHostsListResponseSchema,
} from './fleet';
import type {
	ListsDeleteInput,
	ListsDeleteResponse,
	OsquerySavedQueryDeleteInput,
	OsquerySavedQueryDeleteResponse,
} from './lists-osquery';
import {
	ListsDeleteInputSchema,
	ListsDeleteResponseSchema,
	OsquerySavedQueryDeleteInputSchema,
	OsquerySavedQueryDeleteResponseSchema,
} from './lists-osquery';
import type {
	IndexIndicesInput,
	IndexIndicesResponse,
	NodeMetricsInput,
	NodeMetricsResponse,
	ReportingJobsListInput,
	ReportingJobsListResponse,
} from './ops-unverified';
import {
	IndexIndicesInputSchema,
	IndexIndicesResponseSchema,
	NodeMetricsInputSchema,
	NodeMetricsResponseSchema,
	ReportingJobsListInputSchema,
	ReportingJobsListResponseSchema,
} from './ops-unverified';
import type {
	EndpointListItemsInput,
	EndpointListItemsResponse,
	EntityStoreEnginesInput,
	EntityStoreEnginesResponse,
	EntityStoreEntitiesListInput,
	EntityStoreEntitiesListResponse,
	EntityStoreStatusInput,
	EntityStoreStatusResponse,
} from './security';
import {
	EndpointListItemsInputSchema,
	EndpointListItemsResponseSchema,
	EntityStoreEnginesInputSchema,
	EntityStoreEnginesResponseSchema,
	EntityStoreEntitiesListInputSchema,
	EntityStoreEntitiesListResponseSchema,
	EntityStoreStatusInputSchema,
	EntityStoreStatusResponseSchema,
} from './security';

export const SavedObjectsFindInputSchema = z.object({
	type: z.union([z.string(), z.array(z.string())]),
	search: z.string().optional(),
	page: z.number().optional(),
	per_page: z.number().optional(),
	sort_field: z.string().optional(),
	has_reference: z
		.object({
			type: z.string(),
			id: z.string(),
		})
		.optional(),
});
export type SavedObjectsFindInput = z.infer<typeof SavedObjectsFindInputSchema>;

export const SavedObjectsFindResponseSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number(),
		saved_objects: z.array(
			z.object({
				id: z.string(),
				type: z.string(),
				attributes: z.record(z.string(), z.unknown()),
				references: z.array(z.record(z.string(), z.unknown())).optional(),
				updated_at: z.string().optional(),
				version: z.string().optional(),
			}),
		),
	})
	.passthrough();
export type SavedObjectsFindResponse = z.infer<
	typeof SavedObjectsFindResponseSchema
>;

export const SavedObjectsGetInputSchema = z.object({
	type: z.string(),
	id: z.string(),
});
export type SavedObjectsGetInput = z.infer<typeof SavedObjectsGetInputSchema>;

export const SavedObjectsGetResponseSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: z.record(z.string(), z.unknown()),
		references: z.array(z.record(z.string(), z.unknown())).optional(),
		updated_at: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export type SavedObjectsGetResponse = z.infer<
	typeof SavedObjectsGetResponseSchema
>;

export const SavedObjectsCreateInputSchema = z.object({
	type: z.string(),
	id: z.string().optional(),
	attributes: z.record(z.string(), z.unknown()),
	references: z.array(z.record(z.string(), z.unknown())).optional(),
	overwrite: z.boolean().optional(),
});
export type SavedObjectsCreateInput = z.infer<
	typeof SavedObjectsCreateInputSchema
>;

export const SavedObjectsCreateResponseSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: z.record(z.string(), z.unknown()),
		references: z.array(z.record(z.string(), z.unknown())).optional(),
		updated_at: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export type SavedObjectsCreateResponse = z.infer<
	typeof SavedObjectsCreateResponseSchema
>;

export const SavedObjectsDeleteInputSchema = z.object({
	type: z.string(),
	id: z.string(),
});
export type SavedObjectsDeleteInput = z.infer<
	typeof SavedObjectsDeleteInputSchema
>;

export const SavedObjectsDeleteResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type SavedObjectsDeleteResponse = z.infer<
	typeof SavedObjectsDeleteResponseSchema
>;

export const SavedObjectsUpdateInputSchema = z.object({
	type: z.string(),
	id: z.string(),
	attributes: z.record(z.string(), z.unknown()),
	references: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type SavedObjectsUpdateInput = z.infer<
	typeof SavedObjectsUpdateInputSchema
>;

export const SavedObjectsUpdateResponseSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: z.record(z.string(), z.unknown()),
		references: z.array(z.record(z.string(), z.unknown())).optional(),
		updated_at: z.string().optional(),
		version: z.string().optional(),
	})
	.passthrough();
export type SavedObjectsUpdateResponse = z.infer<
	typeof SavedObjectsUpdateResponseSchema
>;

export const DataViewsGetInputSchema = z.object({
	id: z.string(),
});
export type DataViewsGetInput = z.infer<typeof DataViewsGetInputSchema>;

export const DataViewsGetResponseSchema = z
	.object({
		data_view: z.object({
			id: z.string(),
			title: z.string(),
			name: z.string().optional(),
			timeFieldName: z.string().optional(),
			sourceFilters: z.array(z.record(z.string(), z.unknown())).optional(),
		}),
	})
	.passthrough();
export type DataViewsGetResponse = z.infer<typeof DataViewsGetResponseSchema>;

export const StatusGetInputSchema = z.object({});
export type StatusGetInput = z.infer<typeof StatusGetInputSchema>;

export const StatusGetResponseSchema = z
	.object({
		name: z.string().optional(),
		version: z
			.object({
				number: z.string().optional(),
				build_hash: z.string().optional(),
				build_number: z.number().optional(),
				build_snapshot: z.boolean().optional(),
			})
			.optional(),
		status: z
			.object({
				overall: z
					.object({
						state: z.string().optional(),
						title: z.string().optional(),
						nickname: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.passthrough();
export type StatusGetResponse = z.infer<typeof StatusGetResponseSchema>;

export type KibanaEndpointInputs = {
	savedObjectsFind: SavedObjectsFindInput;
	savedObjectsGet: SavedObjectsGetInput;
	savedObjectsCreate: SavedObjectsCreateInput;
	savedObjectsUpdate: SavedObjectsUpdateInput;
	savedObjectsDelete: SavedObjectsDeleteInput;
	dataViewsGet: DataViewsGetInput;
	dataViewsList: DataViewsListInput;
	dataViewsCreate: DataViewsCreateInput;
	statusGet: StatusGetInput;
	dashboardsSearch: DashboardsSearchInput;
	dashboardsCreate: DashboardsCreateInput;
	dashboardsGet: DashboardsGetInput;
	dashboardsUpsert: DashboardsUpsertInput;
	dashboardsDelete: DashboardsDeleteInput;
	alertingRuleCreate: AlertingRuleCreateInput;
	alertingRulesList: AlertingRulesListInput;
	alertingRuleDelete: AlertingRuleDeleteInput;
	alertingRuleTypesList: AlertingRuleTypesListInput;
	casesCreate: CasesCreateInput;
	casesList: CasesListInput;
	connectorsCreate: ConnectorsCreateInput;
	connectorsGet: ConnectorsGetInput;
	connectorsList: ConnectorsListInput;
	connectorsDelete: ConnectorsDeleteInput;
	connectorTypesList: ConnectorTypesListInput;
	fleetCheckPermissions: FleetCheckPermissionsInput;
	fleetAgentPoliciesList: FleetAgentPoliciesListInput;
	fleetPackagePoliciesList: FleetPackagePoliciesListInput;
	fleetEnrollmentKeysList: FleetEnrollmentKeysListInput;
	fleetEnrollmentKeyGet: FleetEnrollmentKeyGetInput;
	fleetServerHostsList: FleetServerHostsListInput;
	fleetServerHostGet: FleetServerHostGetInput;
	fleetOutputDelete: FleetOutputDeleteInput;
	fleetProxyDelete: FleetProxyDeleteInput;
	fleetAgentsSetup: FleetAgentsSetupInput;
	fleetAgentsVersions: FleetAgentsVersionsInput;
	fleetEpmPackagesList: FleetEpmPackagesListInput;
	fleetEpmPackagesLimited: FleetEpmPackagesLimitedInput;
	fleetEpmPackagesInstalled: FleetEpmPackagesInstalledInput;
	fleetEpmPackageDetails: FleetEpmPackageDetailsInput;
	fleetEpmPackageFile: FleetEpmPackageFileInput;
	fleetEpmPackageStats: FleetEpmPackageStatsInput;
	fleetEpmDataStreams: FleetEpmDataStreamsInput;
	fleetEpmCategories: FleetEpmCategoriesInput;
	detectionRulesFind: DetectionRulesFindInput;
	detectionAlertsFind: AlertsFindInput;
	endpointListItems: EndpointListItemsInput;
	entityStoreStatus: EntityStoreStatusInput;
	entityStoreEngines: EntityStoreEnginesInput;
	entityStoreEntitiesList: EntityStoreEntitiesListInput;
	listsDelete: ListsDeleteInput;
	osquerySavedQueryDelete: OsquerySavedQueryDeleteInput;
	reportingJobsList: ReportingJobsListInput;
	nodeMetricsGet: NodeMetricsInput;
	indexIndicesList: IndexIndicesInput;
};

export type KibanaEndpointOutputs = {
	savedObjectsFind: SavedObjectsFindResponse;
	savedObjectsGet: SavedObjectsGetResponse;
	savedObjectsCreate: SavedObjectsCreateResponse;
	savedObjectsUpdate: SavedObjectsUpdateResponse;
	savedObjectsDelete: SavedObjectsDeleteResponse;
	dataViewsGet: DataViewsGetResponse;
	dataViewsList: DataViewsListResponse;
	dataViewsCreate: DataViewsCreateResponse;
	statusGet: StatusGetResponse;
	dashboardsSearch: DashboardsSearchResponse;
	dashboardsCreate: DashboardsCreateResponse;
	dashboardsGet: DashboardsGetResponse;
	dashboardsUpsert: DashboardsUpsertResponse;
	dashboardsDelete: DashboardsDeleteResponse;
	alertingRuleCreate: AlertingRuleCreateResponse;
	alertingRulesList: AlertingRulesListResponse;
	alertingRuleDelete: AlertingRuleDeleteResponse;
	alertingRuleTypesList: AlertingRuleTypesListResponse;
	casesCreate: CasesCreateResponse;
	casesList: CasesListResponse;
	connectorsCreate: ConnectorsCreateResponse;
	connectorsGet: ConnectorsGetResponse;
	connectorsList: ConnectorsListResponse;
	connectorsDelete: ConnectorsDeleteResponse;
	connectorTypesList: ConnectorTypesListResponse;
	fleetCheckPermissions: FleetCheckPermissionsResponse;
	fleetAgentPoliciesList: FleetAgentPoliciesListResponse;
	fleetPackagePoliciesList: FleetPackagePoliciesListResponse;
	fleetEnrollmentKeysList: FleetEnrollmentKeysListResponse;
	fleetEnrollmentKeyGet: FleetEnrollmentKeyGetResponse;
	fleetServerHostsList: FleetServerHostsListResponse;
	fleetServerHostGet: FleetServerHostGetResponse;
	fleetOutputDelete: FleetOutputDeleteResponse;
	fleetProxyDelete: FleetProxyDeleteResponse;
	fleetAgentsSetup: FleetAgentsSetupResponse;
	fleetAgentsVersions: FleetAgentsVersionsResponse;
	fleetEpmPackagesList: FleetEpmPackagesListResponse;
	fleetEpmPackagesLimited: FleetEpmPackagesLimitedResponse;
	fleetEpmPackagesInstalled: FleetEpmPackagesInstalledResponse;
	fleetEpmPackageDetails: FleetEpmPackageDetailsResponse;
	fleetEpmPackageFile: FleetEpmPackageFileResponse;
	fleetEpmPackageStats: FleetEpmPackageStatsResponse;
	fleetEpmDataStreams: FleetEpmDataStreamsResponse;
	fleetEpmCategories: FleetEpmCategoriesResponse;
	detectionRulesFind: DetectionRulesFindResponse;
	detectionAlertsFind: AlertsFindResponse;
	endpointListItems: EndpointListItemsResponse;
	entityStoreStatus: EntityStoreStatusResponse;
	entityStoreEngines: EntityStoreEnginesResponse;
	entityStoreEntitiesList: EntityStoreEntitiesListResponse;
	listsDelete: ListsDeleteResponse;
	osquerySavedQueryDelete: OsquerySavedQueryDeleteResponse;
	reportingJobsList: ReportingJobsListResponse;
	nodeMetricsGet: NodeMetricsResponse;
	indexIndicesList: IndexIndicesResponse;
};

export const KibanaEndpointInputSchemas = {
	savedObjectsFind: SavedObjectsFindInputSchema,
	savedObjectsGet: SavedObjectsGetInputSchema,
	savedObjectsCreate: SavedObjectsCreateInputSchema,
	savedObjectsUpdate: SavedObjectsUpdateInputSchema,
	savedObjectsDelete: SavedObjectsDeleteInputSchema,
	dataViewsGet: DataViewsGetInputSchema,
	dataViewsList: DataViewsListInputSchema,
	dataViewsCreate: DataViewsCreateInputSchema,
	statusGet: StatusGetInputSchema,
	dashboardsSearch: DashboardsSearchInputSchema,
	dashboardsCreate: DashboardsCreateInputSchema,
	dashboardsGet: DashboardsGetInputSchema,
	dashboardsUpsert: DashboardsUpsertInputSchema,
	dashboardsDelete: DashboardsDeleteInputSchema,
	alertingRuleCreate: AlertingRuleCreateInputSchema,
	alertingRulesList: AlertingRulesListInputSchema,
	alertingRuleDelete: AlertingRuleDeleteInputSchema,
	alertingRuleTypesList: AlertingRuleTypesListInputSchema,
	casesCreate: CasesCreateInputSchema,
	casesList: CasesListInputSchema,
	connectorsCreate: ConnectorsCreateInputSchema,
	connectorsGet: ConnectorsGetInputSchema,
	connectorsList: ConnectorsListInputSchema,
	connectorsDelete: ConnectorsDeleteInputSchema,
	connectorTypesList: ConnectorTypesListInputSchema,
	fleetCheckPermissions: FleetCheckPermissionsInputSchema,
	fleetAgentPoliciesList: FleetAgentPoliciesListInputSchema,
	fleetPackagePoliciesList: FleetPackagePoliciesListInputSchema,
	fleetEnrollmentKeysList: FleetEnrollmentKeysListInputSchema,
	fleetEnrollmentKeyGet: FleetEnrollmentKeyGetInputSchema,
	fleetServerHostsList: FleetServerHostsListInputSchema,
	fleetServerHostGet: FleetServerHostGetInputSchema,
	fleetOutputDelete: FleetOutputDeleteInputSchema,
	fleetProxyDelete: FleetProxyDeleteInputSchema,
	fleetAgentsSetup: FleetAgentsSetupInputSchema,
	fleetAgentsVersions: FleetAgentsVersionsInputSchema,
	fleetEpmPackagesList: FleetEpmPackagesListInputSchema,
	fleetEpmPackagesLimited: FleetEpmPackagesLimitedInputSchema,
	fleetEpmPackagesInstalled: FleetEpmPackagesInstalledInputSchema,
	fleetEpmPackageDetails: FleetEpmPackageDetailsInputSchema,
	fleetEpmPackageFile: FleetEpmPackageFileInputSchema,
	fleetEpmPackageStats: FleetEpmPackageStatsInputSchema,
	fleetEpmDataStreams: FleetEpmDataStreamsInputSchema,
	fleetEpmCategories: FleetEpmCategoriesInputSchema,
	detectionRulesFind: DetectionRulesFindInputSchema,
	detectionAlertsFind: AlertsFindInputSchema,
	endpointListItems: EndpointListItemsInputSchema,
	entityStoreStatus: EntityStoreStatusInputSchema,
	entityStoreEngines: EntityStoreEnginesInputSchema,
	entityStoreEntitiesList: EntityStoreEntitiesListInputSchema,
	listsDelete: ListsDeleteInputSchema,
	osquerySavedQueryDelete: OsquerySavedQueryDeleteInputSchema,
	reportingJobsList: ReportingJobsListInputSchema,
	nodeMetricsGet: NodeMetricsInputSchema,
	indexIndicesList: IndexIndicesInputSchema,
} as const;

export const KibanaEndpointOutputSchemas = {
	savedObjectsFind: SavedObjectsFindResponseSchema,
	savedObjectsGet: SavedObjectsGetResponseSchema,
	savedObjectsCreate: SavedObjectsCreateResponseSchema,
	savedObjectsUpdate: SavedObjectsUpdateResponseSchema,
	savedObjectsDelete: SavedObjectsDeleteResponseSchema,
	dataViewsGet: DataViewsGetResponseSchema,
	dataViewsList: DataViewsListResponseSchema,
	dataViewsCreate: DataViewsCreateResponseSchema,
	statusGet: StatusGetResponseSchema,
	dashboardsSearch: DashboardsSearchResponseSchema,
	dashboardsCreate: DashboardsCreateResponseSchema,
	dashboardsGet: DashboardsGetResponseSchema,
	dashboardsUpsert: DashboardsUpsertResponseSchema,
	dashboardsDelete: DashboardsDeleteResponseSchema,
	alertingRuleCreate: AlertingRuleCreateResponseSchema,
	alertingRulesList: AlertingRulesListResponseSchema,
	alertingRuleDelete: AlertingRuleDeleteResponseSchema,
	alertingRuleTypesList: AlertingRuleTypesListResponseSchema,
	casesCreate: CasesCreateResponseSchema,
	casesList: CasesListResponseSchema,
	connectorsCreate: ConnectorsCreateResponseSchema,
	connectorsGet: ConnectorsGetResponseSchema,
	connectorsList: ConnectorsListResponseSchema,
	connectorsDelete: ConnectorsDeleteResponseSchema,
	connectorTypesList: ConnectorTypesListResponseSchema,
	fleetCheckPermissions: FleetCheckPermissionsResponseSchema,
	fleetAgentPoliciesList: FleetAgentPoliciesListResponseSchema,
	fleetPackagePoliciesList: FleetPackagePoliciesListResponseSchema,
	fleetEnrollmentKeysList: FleetEnrollmentKeysListResponseSchema,
	fleetEnrollmentKeyGet: FleetEnrollmentKeyGetResponseSchema,
	fleetServerHostsList: FleetServerHostsListResponseSchema,
	fleetServerHostGet: FleetServerHostGetResponseSchema,
	fleetOutputDelete: FleetOutputDeleteResponseSchema,
	fleetProxyDelete: FleetProxyDeleteResponseSchema,
	fleetAgentsSetup: FleetAgentsSetupResponseSchema,
	fleetAgentsVersions: FleetAgentsVersionsResponseSchema,
	fleetEpmPackagesList: FleetEpmPackagesListResponseSchema,
	fleetEpmPackagesLimited: FleetEpmPackagesLimitedResponseSchema,
	fleetEpmPackagesInstalled: FleetEpmPackagesInstalledResponseSchema,
	fleetEpmPackageDetails: FleetEpmPackageDetailsResponseSchema,
	fleetEpmPackageFile: FleetEpmPackageFileResponseSchema,
	fleetEpmPackageStats: FleetEpmPackageStatsResponseSchema,
	fleetEpmDataStreams: FleetEpmDataStreamsResponseSchema,
	fleetEpmCategories: FleetEpmCategoriesResponseSchema,
	detectionRulesFind: DetectionRulesFindResponseSchema,
	detectionAlertsFind: AlertsFindResponseSchema,
	endpointListItems: EndpointListItemsResponseSchema,
	entityStoreStatus: EntityStoreStatusResponseSchema,
	entityStoreEngines: EntityStoreEnginesResponseSchema,
	entityStoreEntitiesList: EntityStoreEntitiesListResponseSchema,
	listsDelete: ListsDeleteResponseSchema,
	osquerySavedQueryDelete: OsquerySavedQueryDeleteResponseSchema,
	reportingJobsList: ReportingJobsListResponseSchema,
	nodeMetricsGet: NodeMetricsResponseSchema,
	indexIndicesList: IndexIndicesResponseSchema,
} as const;

export type {
	AlertingRuleCreateInput,
	AlertingRuleCreateResponse,
	AlertingRuleDeleteInput,
	AlertingRuleDeleteResponse,
	AlertingRulesListInput,
	AlertingRulesListResponse,
	AlertingRuleTypesListInput,
	AlertingRuleTypesListResponse,
} from './alerting';
export {
	AlertingRuleCreateInputSchema,
	AlertingRuleCreateResponseSchema,
	AlertingRuleDeleteInputSchema,
	AlertingRuleDeleteResponseSchema,
	AlertingRulesListInputSchema,
	AlertingRulesListResponseSchema,
	AlertingRuleTypesListInputSchema,
	AlertingRuleTypesListResponseSchema,
} from './alerting';
export type {
	CasesCreateInput,
	CasesCreateResponse,
	CasesListInput,
	CasesListResponse,
} from './cases';
export {
	CasesCreateInputSchema,
	CasesCreateResponseSchema,
	CasesListInputSchema,
	CasesListResponseSchema,
} from './cases';
export type {
	ConnectorsCreateInput,
	ConnectorsCreateResponse,
	ConnectorsDeleteInput,
	ConnectorsDeleteResponse,
	ConnectorsGetInput,
	ConnectorsGetResponse,
	ConnectorsListInput,
	ConnectorsListResponse,
	ConnectorTypesListInput,
	ConnectorTypesListResponse,
} from './connectors';
export {
	ConnectorsCreateInputSchema,
	ConnectorsCreateResponseSchema,
	ConnectorsDeleteInputSchema,
	ConnectorsDeleteResponseSchema,
	ConnectorsGetInputSchema,
	ConnectorsGetResponseSchema,
	ConnectorsListInputSchema,
	ConnectorsListResponseSchema,
	ConnectorTypesListInputSchema,
	ConnectorTypesListResponseSchema,
} from './connectors';
export type {
	DashboardsCreateInput,
	DashboardsCreateResponse,
	DashboardsDeleteInput,
	DashboardsDeleteResponse,
	DashboardsGetInput,
	DashboardsGetResponse,
	DashboardsSearchInput,
	DashboardsSearchResponse,
	DashboardsUpsertInput,
	DashboardsUpsertResponse,
} from './dashboards';
export {
	DashboardsCreateInputSchema,
	DashboardsCreateResponseSchema,
	DashboardsDeleteInputSchema,
	DashboardsDeleteResponseSchema,
	DashboardsGetInputSchema,
	DashboardsGetResponseSchema,
	DashboardsSearchInputSchema,
	DashboardsSearchResponseSchema,
	DashboardsUpsertInputSchema,
	DashboardsUpsertResponseSchema,
} from './dashboards';
export type {
	DataViewsCreateInput,
	DataViewsCreateResponse,
	DataViewsListInput,
	DataViewsListResponse,
} from './data-views-ext';
export {
	DataViewsCreateInputSchema,
	DataViewsCreateResponseSchema,
	DataViewsListInputSchema,
	DataViewsListResponseSchema,
} from './data-views-ext';
export type {
	AlertsFindInput,
	AlertsFindResponse,
	DetectionRulesFindInput,
	DetectionRulesFindResponse,
} from './detection-engine';
export {
	AlertsFindInputSchema,
	AlertsFindResponseSchema,
	DetectionRulesFindInputSchema,
	DetectionRulesFindResponseSchema,
} from './detection-engine';
export type {
	FleetAgentPoliciesListInput,
	FleetAgentPoliciesListResponse,
	FleetAgentsSetupInput,
	FleetAgentsSetupResponse,
	FleetAgentsVersionsInput,
	FleetAgentsVersionsResponse,
	FleetCheckPermissionsInput,
	FleetCheckPermissionsResponse,
	FleetEnrollmentKeyGetInput,
	FleetEnrollmentKeyGetResponse,
	FleetEnrollmentKeysListInput,
	FleetEnrollmentKeysListResponse,
	FleetEpmCategoriesInput,
	FleetEpmCategoriesResponse,
	FleetEpmDataStreamsInput,
	FleetEpmDataStreamsResponse,
	FleetEpmPackageDetailsInput,
	FleetEpmPackageDetailsResponse,
	FleetEpmPackageFileInput,
	FleetEpmPackageFileResponse,
	FleetEpmPackageStatsInput,
	FleetEpmPackageStatsResponse,
	FleetEpmPackagesInstalledInput,
	FleetEpmPackagesInstalledResponse,
	FleetEpmPackagesLimitedInput,
	FleetEpmPackagesLimitedResponse,
	FleetEpmPackagesListInput,
	FleetEpmPackagesListResponse,
	FleetOutputDeleteInput,
	FleetOutputDeleteResponse,
	FleetPackagePoliciesListInput,
	FleetPackagePoliciesListResponse,
	FleetProxyDeleteInput,
	FleetProxyDeleteResponse,
	FleetServerHostGetInput,
	FleetServerHostGetResponse,
	FleetServerHostsListInput,
	FleetServerHostsListResponse,
} from './fleet';
export {
	FleetAgentPoliciesListInputSchema,
	FleetAgentPoliciesListResponseSchema,
	FleetAgentsSetupInputSchema,
	FleetAgentsSetupResponseSchema,
	FleetAgentsVersionsInputSchema,
	FleetAgentsVersionsResponseSchema,
	FleetCheckPermissionsInputSchema,
	FleetCheckPermissionsResponseSchema,
	FleetEnrollmentKeyGetInputSchema,
	FleetEnrollmentKeyGetResponseSchema,
	FleetEnrollmentKeysListInputSchema,
	FleetEnrollmentKeysListResponseSchema,
	FleetEpmCategoriesInputSchema,
	FleetEpmCategoriesResponseSchema,
	FleetEpmDataStreamsInputSchema,
	FleetEpmDataStreamsResponseSchema,
	FleetEpmPackageDetailsInputSchema,
	FleetEpmPackageDetailsResponseSchema,
	FleetEpmPackageFileInputSchema,
	FleetEpmPackageFileResponseSchema,
	FleetEpmPackageStatsInputSchema,
	FleetEpmPackageStatsResponseSchema,
	FleetEpmPackagesInstalledInputSchema,
	FleetEpmPackagesInstalledResponseSchema,
	FleetEpmPackagesLimitedInputSchema,
	FleetEpmPackagesLimitedResponseSchema,
	FleetEpmPackagesListInputSchema,
	FleetEpmPackagesListResponseSchema,
	FleetOutputDeleteInputSchema,
	FleetOutputDeleteResponseSchema,
	FleetPackagePoliciesListInputSchema,
	FleetPackagePoliciesListResponseSchema,
	FleetProxyDeleteInputSchema,
	FleetProxyDeleteResponseSchema,
	FleetServerHostGetInputSchema,
	FleetServerHostGetResponseSchema,
	FleetServerHostsListInputSchema,
	FleetServerHostsListResponseSchema,
} from './fleet';
export type {
	ListsDeleteInput,
	ListsDeleteResponse,
	OsquerySavedQueryDeleteInput,
	OsquerySavedQueryDeleteResponse,
} from './lists-osquery';
export {
	ListsDeleteInputSchema,
	ListsDeleteResponseSchema,
	OsquerySavedQueryDeleteInputSchema,
	OsquerySavedQueryDeleteResponseSchema,
} from './lists-osquery';
export type {
	IndexIndicesInput,
	IndexIndicesResponse,
	NodeMetricsInput,
	NodeMetricsResponse,
	ReportingJobsListInput,
	ReportingJobsListResponse,
} from './ops-unverified';
export {
	IndexIndicesInputSchema,
	IndexIndicesResponseSchema,
	NodeMetricsInputSchema,
	NodeMetricsResponseSchema,
	ReportingJobsListInputSchema,
	ReportingJobsListResponseSchema,
} from './ops-unverified';
export type {
	EndpointListItemsInput,
	EndpointListItemsResponse,
	EntityStoreEnginesInput,
	EntityStoreEnginesResponse,
	EntityStoreEntitiesListInput,
	EntityStoreEntitiesListResponse,
	EntityStoreStatusInput,
	EntityStoreStatusResponse,
} from './security';
export {
	EndpointListItemsInputSchema,
	EndpointListItemsResponseSchema,
	EntityStoreEnginesInputSchema,
	EntityStoreEnginesResponseSchema,
	EntityStoreEntitiesListInputSchema,
	EntityStoreEntitiesListResponseSchema,
	EntityStoreStatusInputSchema,
	EntityStoreStatusResponseSchema,
} from './security';
