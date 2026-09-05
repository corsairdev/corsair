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
import {
	Alerting,
	Cases,
	Connectors,
	Dashboards,
	DataViews,
	DataViewsExt,
	DetectionEngine,
	Fleet,
	ListsOsquery,
	OpsUnverified,
	SavedObjects,
	Security,
	Status,
} from './endpoints';
import type {
	KibanaEndpointInputs,
	KibanaEndpointOutputs,
} from './endpoints/types';
import {
	KibanaEndpointInputSchemas,
	KibanaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KibanaSchema } from './schema';

export type KibanaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	elasticsearchBaseUrl?: string;
	hooks?: InternalKibanaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kibanaEndpointsNested>;
};

export const kibanaAuthConfig = {
	api_key: {
		account: ['base_url', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KibanaContext = CorsairPluginContext<
	typeof KibanaSchema,
	KibanaPluginOptions,
	undefined,
	typeof kibanaAuthConfig
>;

export type KibanaKeyBuilderContext = KeyBuilderContext<
	KibanaPluginOptions,
	typeof kibanaAuthConfig
>;

export type KibanaBoundEndpoints = BindEndpoints<typeof kibanaEndpointsNested>;

type KibanaEndpoint<K extends keyof KibanaEndpointOutputs> = CorsairEndpoint<
	KibanaContext,
	KibanaEndpointInputs[K],
	KibanaEndpointOutputs[K]
>;

export type KibanaEndpoints = {
	savedObjectsFind: KibanaEndpoint<'savedObjectsFind'>;
	savedObjectsGet: KibanaEndpoint<'savedObjectsGet'>;
	savedObjectsCreate: KibanaEndpoint<'savedObjectsCreate'>;
	savedObjectsUpdate: KibanaEndpoint<'savedObjectsUpdate'>;
	savedObjectsDelete: KibanaEndpoint<'savedObjectsDelete'>;
	dataViewsGet: KibanaEndpoint<'dataViewsGet'>;
	dataViewsList: KibanaEndpoint<'dataViewsList'>;
	dataViewsCreate: KibanaEndpoint<'dataViewsCreate'>;
	statusGet: KibanaEndpoint<'statusGet'>;
	dashboardsSearch: KibanaEndpoint<'dashboardsSearch'>;
	dashboardsCreate: KibanaEndpoint<'dashboardsCreate'>;
	dashboardsGet: KibanaEndpoint<'dashboardsGet'>;
	dashboardsUpsert: KibanaEndpoint<'dashboardsUpsert'>;
	dashboardsDelete: KibanaEndpoint<'dashboardsDelete'>;
	alertingRuleCreate: KibanaEndpoint<'alertingRuleCreate'>;
	alertingRulesList: KibanaEndpoint<'alertingRulesList'>;
	alertingRuleDelete: KibanaEndpoint<'alertingRuleDelete'>;
	alertingRuleTypesList: KibanaEndpoint<'alertingRuleTypesList'>;
	casesCreate: KibanaEndpoint<'casesCreate'>;
	casesList: KibanaEndpoint<'casesList'>;
	connectorsCreate: KibanaEndpoint<'connectorsCreate'>;
	connectorsGet: KibanaEndpoint<'connectorsGet'>;
	connectorsList: KibanaEndpoint<'connectorsList'>;
	connectorsDelete: KibanaEndpoint<'connectorsDelete'>;
	connectorTypesList: KibanaEndpoint<'connectorTypesList'>;
	fleetCheckPermissions: KibanaEndpoint<'fleetCheckPermissions'>;
	fleetAgentPoliciesList: KibanaEndpoint<'fleetAgentPoliciesList'>;
	fleetPackagePoliciesList: KibanaEndpoint<'fleetPackagePoliciesList'>;
	fleetEnrollmentKeysList: KibanaEndpoint<'fleetEnrollmentKeysList'>;
	fleetEnrollmentKeyGet: KibanaEndpoint<'fleetEnrollmentKeyGet'>;
	fleetServerHostsList: KibanaEndpoint<'fleetServerHostsList'>;
	fleetServerHostGet: KibanaEndpoint<'fleetServerHostGet'>;
	fleetOutputDelete: KibanaEndpoint<'fleetOutputDelete'>;
	fleetProxyDelete: KibanaEndpoint<'fleetProxyDelete'>;
	fleetAgentsSetup: KibanaEndpoint<'fleetAgentsSetup'>;
	fleetAgentsVersions: KibanaEndpoint<'fleetAgentsVersions'>;
	fleetEpmPackagesList: KibanaEndpoint<'fleetEpmPackagesList'>;
	fleetEpmPackagesLimited: KibanaEndpoint<'fleetEpmPackagesLimited'>;
	fleetEpmPackagesInstalled: KibanaEndpoint<'fleetEpmPackagesInstalled'>;
	fleetEpmPackageDetails: KibanaEndpoint<'fleetEpmPackageDetails'>;
	fleetEpmPackageFile: KibanaEndpoint<'fleetEpmPackageFile'>;
	fleetEpmPackageStats: KibanaEndpoint<'fleetEpmPackageStats'>;
	fleetEpmDataStreams: KibanaEndpoint<'fleetEpmDataStreams'>;
	fleetEpmCategories: KibanaEndpoint<'fleetEpmCategories'>;
	detectionRulesFind: KibanaEndpoint<'detectionRulesFind'>;
	detectionAlertsFind: KibanaEndpoint<'detectionAlertsFind'>;
	endpointListItems: KibanaEndpoint<'endpointListItems'>;
	entityStoreStatus: KibanaEndpoint<'entityStoreStatus'>;
	entityStoreEngines: KibanaEndpoint<'entityStoreEngines'>;
	entityStoreEntitiesList: KibanaEndpoint<'entityStoreEntitiesList'>;
	listsDelete: KibanaEndpoint<'listsDelete'>;
	osquerySavedQueryDelete: KibanaEndpoint<'osquerySavedQueryDelete'>;
	reportingJobsList: KibanaEndpoint<'reportingJobsList'>;
	nodeMetricsGet: KibanaEndpoint<'nodeMetricsGet'>;
	indexIndicesList: KibanaEndpoint<'indexIndicesList'>;
};

const kibanaEndpointsNested = {
	savedObjects: {
		find: SavedObjects.find,
		get: SavedObjects.get,
		create: SavedObjects.create,
		update: SavedObjects.update,
		delete: SavedObjects.remove,
	},
	dataViews: {
		get: DataViews.get,
		list: DataViewsExt.list,
		create: DataViewsExt.create,
	},
	status: {
		get: Status.get,
	},
	dashboards: {
		search: Dashboards.search,
		create: Dashboards.create,
		get: Dashboards.get,
		upsert: Dashboards.upsert,
		delete: Dashboards.remove,
	},
	alerting: {
		createRule: Alerting.createRule,
		listRules: Alerting.listRules,
		deleteRule: Alerting.deleteRule,
		listRuleTypes: Alerting.listRuleTypes,
	},
	cases: {
		create: Cases.create,
		list: Cases.list,
	},
	connectors: {
		create: Connectors.create,
		get: Connectors.get,
		list: Connectors.list,
		delete: Connectors.remove,
		listTypes: Connectors.listTypes,
	},
	fleet: {
		checkPermissions: Fleet.checkPermissions,
		agentPoliciesList: Fleet.agentPoliciesList,
		packagePoliciesList: Fleet.packagePoliciesList,
		enrollmentKeysList: Fleet.enrollmentKeysList,
		enrollmentKeyGet: Fleet.enrollmentKeyGet,
		serverHostsList: Fleet.serverHostsList,
		serverHostGet: Fleet.serverHostGet,
		outputDelete: Fleet.outputDelete,
		proxyDelete: Fleet.proxyDelete,
		agentsSetup: Fleet.agentsSetup,
		agentsVersions: Fleet.agentsVersions,
		epmPackagesList: Fleet.epmPackagesList,
		epmPackagesLimited: Fleet.epmPackagesLimited,
		epmPackagesInstalled: Fleet.epmPackagesInstalled,
		epmPackageDetails: Fleet.epmPackageDetails,
		epmPackageFile: Fleet.epmPackageFile,
		epmPackageStats: Fleet.epmPackageStats,
		epmDataStreams: Fleet.epmDataStreams,
		epmCategories: Fleet.epmCategories,
	},
	detection: {
		findRules: DetectionEngine.findRules,
		findAlerts: DetectionEngine.findAlerts,
	},
	security: {
		listEndpointItems: Security.listEndpointItems,
		entityStoreStatus: Security.entityStoreStatus,
		entityStoreEngines: Security.entityStoreEngines,
		entitiesList: Security.entitiesList,
	},
	lists: {
		delete: ListsOsquery.deleteList,
	},
	osquery: {
		deleteSavedQuery: ListsOsquery.deleteSavedQuery,
	},
	reporting: {
		listJobs: OpsUnverified.listJobs,
	},
	metrics: {
		get: OpsUnverified.nodeMetrics,
	},
	index: {
		listIndices: OpsUnverified.listIndices,
	},
} as const;

function schemaPair<K extends keyof typeof KibanaEndpointInputSchemas>(
	key: K,
): {
	input: (typeof KibanaEndpointInputSchemas)[K];
	output: (typeof KibanaEndpointOutputSchemas)[K];
} {
	return {
		input: KibanaEndpointInputSchemas[key],
		output: KibanaEndpointOutputSchemas[key],
	};
}

export const kibanaEndpointSchemas = {
	'savedObjects.find': schemaPair('savedObjectsFind'),
	'savedObjects.get': schemaPair('savedObjectsGet'),
	'savedObjects.create': schemaPair('savedObjectsCreate'),
	'savedObjects.update': schemaPair('savedObjectsUpdate'),
	'savedObjects.delete': schemaPair('savedObjectsDelete'),
	'dataViews.get': schemaPair('dataViewsGet'),
	'dataViews.list': schemaPair('dataViewsList'),
	'dataViews.create': schemaPair('dataViewsCreate'),
	'status.get': schemaPair('statusGet'),
	'dashboards.search': schemaPair('dashboardsSearch'),
	'dashboards.create': schemaPair('dashboardsCreate'),
	'dashboards.get': schemaPair('dashboardsGet'),
	'dashboards.upsert': schemaPair('dashboardsUpsert'),
	'dashboards.delete': schemaPair('dashboardsDelete'),
	'alerting.createRule': schemaPair('alertingRuleCreate'),
	'alerting.listRules': schemaPair('alertingRulesList'),
	'alerting.deleteRule': schemaPair('alertingRuleDelete'),
	'alerting.listRuleTypes': schemaPair('alertingRuleTypesList'),
	'cases.create': schemaPair('casesCreate'),
	'cases.list': schemaPair('casesList'),
	'connectors.create': schemaPair('connectorsCreate'),
	'connectors.get': schemaPair('connectorsGet'),
	'connectors.list': schemaPair('connectorsList'),
	'connectors.delete': schemaPair('connectorsDelete'),
	'connectors.listTypes': schemaPair('connectorTypesList'),
	'fleet.checkPermissions': schemaPair('fleetCheckPermissions'),
	'fleet.agentPoliciesList': schemaPair('fleetAgentPoliciesList'),
	'fleet.packagePoliciesList': schemaPair('fleetPackagePoliciesList'),
	'fleet.enrollmentKeysList': schemaPair('fleetEnrollmentKeysList'),
	'fleet.enrollmentKeyGet': schemaPair('fleetEnrollmentKeyGet'),
	'fleet.serverHostsList': schemaPair('fleetServerHostsList'),
	'fleet.serverHostGet': schemaPair('fleetServerHostGet'),
	'fleet.outputDelete': schemaPair('fleetOutputDelete'),
	'fleet.proxyDelete': schemaPair('fleetProxyDelete'),
	'fleet.agentsSetup': schemaPair('fleetAgentsSetup'),
	'fleet.agentsVersions': schemaPair('fleetAgentsVersions'),
	'fleet.epmPackagesList': schemaPair('fleetEpmPackagesList'),
	'fleet.epmPackagesLimited': schemaPair('fleetEpmPackagesLimited'),
	'fleet.epmPackagesInstalled': schemaPair('fleetEpmPackagesInstalled'),
	'fleet.epmPackageDetails': schemaPair('fleetEpmPackageDetails'),
	'fleet.epmPackageFile': schemaPair('fleetEpmPackageFile'),
	'fleet.epmPackageStats': schemaPair('fleetEpmPackageStats'),
	'fleet.epmDataStreams': schemaPair('fleetEpmDataStreams'),
	'fleet.epmCategories': schemaPair('fleetEpmCategories'),
	'detection.findRules': schemaPair('detectionRulesFind'),
	'detection.findAlerts': schemaPair('detectionAlertsFind'),
	'security.listEndpointItems': schemaPair('endpointListItems'),
	'security.entityStoreStatus': schemaPair('entityStoreStatus'),
	'security.entityStoreEngines': schemaPair('entityStoreEngines'),
	'security.entitiesList': schemaPair('entityStoreEntitiesList'),
	'lists.delete': schemaPair('listsDelete'),
	'osquery.deleteSavedQuery': schemaPair('osquerySavedQueryDelete'),
	'reporting.listJobs': schemaPair('reportingJobsList'),
	'metrics.get': schemaPair('nodeMetricsGet'),
	'index.listIndices': schemaPair('indexIndicesList'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kibanaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const kibanaEndpointMeta = {
	'savedObjects.find': {
		riskLevel: 'read',
		description: 'Find saved objects matching search query or type filters',
	},
	'savedObjects.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific saved object by type and ID',
	},
	'savedObjects.create': {
		riskLevel: 'write',
		description: 'Create a new saved object in Kibana',
	},
	'savedObjects.update': {
		riskLevel: 'write',
		description: 'Update attributes of an existing saved object by type and ID',
	},
	'savedObjects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a saved object by type and ID',
	},
	'dataViews.get': {
		riskLevel: 'read',
		description: 'Retrieve data view details by ID',
	},
	'dataViews.list': {
		riskLevel: 'read',
		description: 'List all data views in Kibana',
	},
	'dataViews.create': {
		riskLevel: 'write',
		description: 'Create a new data view in Kibana',
	},
	'status.get': {
		riskLevel: 'read',
		description: 'Retrieve health and version status of the Kibana instance',
	},
	'dashboards.search': {
		riskLevel: 'read',
		description: 'Search dashboards in Kibana',
	},
	'dashboards.create': {
		riskLevel: 'write',
		description: 'Create a new dashboard in Kibana',
	},
	'dashboards.get': {
		riskLevel: 'read',
		description: 'Retrieve a dashboard by ID',
	},
	'dashboards.upsert': {
		riskLevel: 'write',
		description: 'Create or update a dashboard by ID',
	},
	'dashboards.delete': {
		riskLevel: 'destructive',
		description: 'Delete a dashboard by ID',
	},
	'alerting.createRule': {
		riskLevel: 'write',
		description: 'Create a new alerting rule in Kibana',
	},
	'alerting.listRules': {
		riskLevel: 'read',
		description: 'List alerting rules with pagination and filters',
	},
	'alerting.deleteRule': {
		riskLevel: 'destructive',
		description: 'Delete an alerting rule by ID',
	},
	'alerting.listRuleTypes': {
		riskLevel: 'read',
		description: 'List available alerting rule types',
	},
	'cases.create': {
		riskLevel: 'write',
		description: 'Create a new case in Kibana',
	},
	'cases.list': {
		riskLevel: 'read',
		description: 'Find and list cases with filters',
	},
	'connectors.create': {
		riskLevel: 'write',
		description: 'Create a new connector in Kibana',
	},
	'connectors.get': {
		riskLevel: 'read',
		description: 'Retrieve a connector by ID',
	},
	'connectors.list': {
		riskLevel: 'read',
		description: 'List all connectors in Kibana',
	},
	'connectors.delete': {
		riskLevel: 'destructive',
		description: 'Delete a connector by ID',
	},
	'connectors.listTypes': {
		riskLevel: 'read',
		description: 'List available connector (action) types',
	},
	'fleet.checkPermissions': {
		riskLevel: 'read',
		description: 'Check permissions for the Fleet API',
	},
	'fleet.agentPoliciesList': {
		riskLevel: 'read',
		description: 'List Fleet agent policies with pagination',
	},
	'fleet.packagePoliciesList': {
		riskLevel: 'read',
		description: 'List Fleet package policies with pagination',
	},
	'fleet.enrollmentKeysList': {
		riskLevel: 'read',
		description: 'List Fleet enrollment API keys',
	},
	'fleet.enrollmentKeyGet': {
		riskLevel: 'read',
		description: 'Retrieve a Fleet enrollment API key by ID',
	},
	'fleet.serverHostsList': {
		riskLevel: 'read',
		description: 'List Fleet Server hosts',
	},
	'fleet.serverHostGet': {
		riskLevel: 'read',
		description: 'Retrieve a Fleet Server host by ID',
	},
	'fleet.outputDelete': {
		riskLevel: 'destructive',
		description: 'Delete a Fleet output by ID',
	},
	'fleet.proxyDelete': {
		riskLevel: 'destructive',
		description: 'Delete a Fleet proxy by ID',
	},
	'fleet.agentsSetup': {
		riskLevel: 'read',
		description: 'Check Fleet agents setup status',
	},
	'fleet.agentsVersions': {
		riskLevel: 'read',
		description: 'List available Fleet agent versions',
	},
	'fleet.epmPackagesList': {
		riskLevel: 'read',
		description: 'List available Fleet EPM packages',
	},
	'fleet.epmPackagesLimited': {
		riskLevel: 'read',
		description: 'List Fleet EPM package names only',
	},
	'fleet.epmPackagesInstalled': {
		riskLevel: 'read',
		description: 'List installed Fleet EPM packages',
	},
	'fleet.epmPackageDetails': {
		riskLevel: 'read',
		description: 'Retrieve details of a Fleet EPM package version',
	},
	'fleet.epmPackageFile': {
		riskLevel: 'read',
		description: 'Retrieve a file from a Fleet EPM package',
	},
	'fleet.epmPackageStats': {
		riskLevel: 'read',
		description: 'Retrieve usage statistics for a Fleet package',
	},
	'fleet.epmDataStreams': {
		riskLevel: 'read',
		description: 'List Fleet EPM data streams',
	},
	'fleet.epmCategories': {
		riskLevel: 'read',
		description: 'List Fleet EPM package categories',
	},
	'detection.findRules': {
		riskLevel: 'read',
		description: 'Find detection engine rules with filters',
	},
	'detection.findAlerts': {
		riskLevel: 'read',
		description: 'Find and aggregate detection alerts',
	},
	'security.listEndpointItems': {
		riskLevel: 'read',
		description: 'List Endpoint exception list items',
	},
	'security.entityStoreStatus': {
		riskLevel: 'read',
		description: 'Retrieve Entity Store status',
	},
	'security.entityStoreEngines': {
		riskLevel: 'read',
		description: 'Retrieve Entity Store engines',
	},
	'security.entitiesList': {
		riskLevel: 'read',
		description: 'List Entity Store entities',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a value list by ID',
	},
	'osquery.deleteSavedQuery': {
		riskLevel: 'destructive',
		description: 'Delete an Osquery saved query by ID',
	},
	'reporting.listJobs': {
		riskLevel: 'read',
		description: 'List Kibana reporting jobs',
	},
	'metrics.get': {
		riskLevel: 'read',
		description: 'Retrieve Elasticsearch node metrics',
	},
	'index.listIndices': {
		riskLevel: 'read',
		description: 'List indices via Index Management',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kibanaEndpointsNested>;

export type BaseKibanaPlugin<T extends KibanaPluginOptions> = CorsairPlugin<
	'kibana',
	typeof KibanaSchema,
	typeof kibanaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof kibanaAuthConfig
>;

export type InternalKibanaPlugin = BaseKibanaPlugin<KibanaPluginOptions>;

export type ExternalKibanaPlugin<T extends KibanaPluginOptions> =
	BaseKibanaPlugin<T>;

export function kibana<const T extends KibanaPluginOptions>(
	incomingOptions: KibanaPluginOptions & T = {} as KibanaPluginOptions & T,
): ExternalKibanaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kibana',
		authConfig: kibanaAuthConfig,
		schema: KibanaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: kibanaEndpointsNested,
		webhooks: {} as Record<string, never>,
		endpointMeta: kibanaEndpointMeta,
		endpointSchemas: kibanaEndpointSchemas,
		webhookSchemas: {} as Record<string, never>,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KibanaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalKibanaPlugin;
}

export type {
	AlertingRuleCreateInput,
	AlertingRuleCreateResponse,
	AlertingRuleDeleteInput,
	AlertingRuleDeleteResponse,
	AlertingRulesListInput,
	AlertingRulesListResponse,
	AlertingRuleTypesListInput,
	AlertingRuleTypesListResponse,
	AlertsFindInput,
	AlertsFindResponse,
	CasesCreateInput,
	CasesCreateResponse,
	CasesListInput,
	CasesListResponse,
	ConnectorTypesListInput,
	ConnectorTypesListResponse,
	ConnectorsCreateInput,
	ConnectorsCreateResponse,
	ConnectorsDeleteInput,
	ConnectorsDeleteResponse,
	ConnectorsGetInput,
	ConnectorsGetResponse,
	ConnectorsListInput,
	ConnectorsListResponse,
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
	DataViewsCreateInput,
	DataViewsCreateResponse,
	DataViewsGetInput,
	DataViewsGetResponse,
	DataViewsListInput,
	DataViewsListResponse,
	DetectionRulesFindInput,
	DetectionRulesFindResponse,
	EndpointListItemsInput,
	EndpointListItemsResponse,
	EntityStoreEnginesInput,
	EntityStoreEnginesResponse,
	EntityStoreEntitiesListInput,
	EntityStoreEntitiesListResponse,
	EntityStoreStatusInput,
	EntityStoreStatusResponse,
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
	IndexIndicesInput,
	IndexIndicesResponse,
	KibanaEndpointInputs,
	KibanaEndpointOutputs,
	ListsDeleteInput,
	ListsDeleteResponse,
	NodeMetricsInput,
	NodeMetricsResponse,
	OsquerySavedQueryDeleteInput,
	OsquerySavedQueryDeleteResponse,
	ReportingJobsListInput,
	ReportingJobsListResponse,
	SavedObjectsCreateInput,
	SavedObjectsCreateResponse,
	SavedObjectsDeleteInput,
	SavedObjectsDeleteResponse,
	SavedObjectsFindInput,
	SavedObjectsFindResponse,
	SavedObjectsGetInput,
	SavedObjectsGetResponse,
	SavedObjectsUpdateInput,
	SavedObjectsUpdateResponse,
	StatusGetInput,
	StatusGetResponse,
} from './endpoints/types';
