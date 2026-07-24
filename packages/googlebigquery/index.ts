import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { getValidAccessToken } from './client';
import * as AnalyticsHubEndpoints from './endpoints/analytics-hub';
import * as ConnectionsEndpoints from './endpoints/connections';
import * as DatasetsEndpoints from './endpoints/datasets';
import * as IamEndpoints from './endpoints/iam';
import * as MlEndpoints from './endpoints/ml';
import * as QueriesEndpoints from './endpoints/queries';
import * as ReservationsEndpoints from './endpoints/reservations';
import * as RoutinesEndpoints from './endpoints/routines';
import * as TablesEndpoints from './endpoints/tables';
import type {
	GoogleBigqueryEndpointInputs,
	GoogleBigqueryEndpointOutputs,
} from './endpoints/types';
import {
	GoogleBigqueryEndpointInputSchemas,
	GoogleBigqueryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleBigquerySchema } from './schema';

export type GoogleBigqueryContext = CorsairPluginContext<
	typeof GoogleBigquerySchema,
	GoogleBigqueryPluginOptions
>;

export type GoogleBigqueryKeyBuilderContext =
	KeyBuilderContext<GoogleBigqueryPluginOptions>;

type GoogleBigqueryEndpoint<K extends keyof GoogleBigqueryEndpointOutputs> =
	CorsairEndpoint<
		GoogleBigqueryContext,
		GoogleBigqueryEndpointInputs[K],
		GoogleBigqueryEndpointOutputs[K]
	>;

export type GoogleBigqueryEndpoints = {
	queriesQuery: GoogleBigqueryEndpoint<'queriesQuery'>;
	queriesGetQueryResults: GoogleBigqueryEndpoint<'queriesGetQueryResults'>;
	queriesInsertJob: GoogleBigqueryEndpoint<'queriesInsertJob'>;
	queriesInsertJobWithUpload: GoogleBigqueryEndpoint<'queriesInsertJobWithUpload'>;
	queriesInsertAll: GoogleBigqueryEndpoint<'queriesInsertAll'>;
	queriesListJobs: GoogleBigqueryEndpoint<'queriesListJobs'>;
	queriesGetJob: GoogleBigqueryEndpoint<'queriesGetJob'>;
	queriesCancelJob: GoogleBigqueryEndpoint<'queriesCancelJob'>;
	queriesDeleteJobMetadata: GoogleBigqueryEndpoint<'queriesDeleteJobMetadata'>;
	datasetsList: GoogleBigqueryEndpoint<'datasetsList'>;
	datasetsGet: GoogleBigqueryEndpoint<'datasetsGet'>;
	datasetsCreate: GoogleBigqueryEndpoint<'datasetsCreate'>;
	datasetsUpdate: GoogleBigqueryEndpoint<'datasetsUpdate'>;
	datasetsPatch: GoogleBigqueryEndpoint<'datasetsPatch'>;
	datasetsDelete: GoogleBigqueryEndpoint<'datasetsDelete'>;
	datasetsUndelete: GoogleBigqueryEndpoint<'datasetsUndelete'>;
	tablesList: GoogleBigqueryEndpoint<'tablesList'>;
	tablesListTableData: GoogleBigqueryEndpoint<'tablesListTableData'>;
	tablesGetSchema: GoogleBigqueryEndpoint<'tablesGetSchema'>;
	tablesCreate: GoogleBigqueryEndpoint<'tablesCreate'>;
	tablesUpdate: GoogleBigqueryEndpoint<'tablesUpdate'>;
	tablesPatch: GoogleBigqueryEndpoint<'tablesPatch'>;
	tablesDelete: GoogleBigqueryEndpoint<'tablesDelete'>;
	routinesList: GoogleBigqueryEndpoint<'routinesList'>;
	routinesGet: GoogleBigqueryEndpoint<'routinesGet'>;
	routinesCreate: GoogleBigqueryEndpoint<'routinesCreate'>;
	routinesUpdate: GoogleBigqueryEndpoint<'routinesUpdate'>;
	routinesDelete: GoogleBigqueryEndpoint<'routinesDelete'>;
	iamGetTableIamPolicy: GoogleBigqueryEndpoint<'iamGetTableIamPolicy'>;
	iamGetRoutineIamPolicy: GoogleBigqueryEndpoint<'iamGetRoutineIamPolicy'>;
	iamSetRoutineIamPolicy: GoogleBigqueryEndpoint<'iamSetRoutineIamPolicy'>;
	iamTestRoutineIamPermissions: GoogleBigqueryEndpoint<'iamTestRoutineIamPermissions'>;
	iamGetConnectionIamPolicy: GoogleBigqueryEndpoint<'iamGetConnectionIamPolicy'>;
	iamListRowAccessPolicies: GoogleBigqueryEndpoint<'iamListRowAccessPolicies'>;
	iamCreateLocationsDatapolicies: GoogleBigqueryEndpoint<'iamCreateLocationsDatapolicies'>;
	iamListLocationsDatapolicies: GoogleBigqueryEndpoint<'iamListLocationsDatapolicies'>;
	iamGetServiceAccount: GoogleBigqueryEndpoint<'iamGetServiceAccount'>;
	connectionsListBigQueryConnections: GoogleBigqueryEndpoint<'connectionsListBigQueryConnections'>;
	connectionsListLocationsConnections: GoogleBigqueryEndpoint<'connectionsListLocationsConnections'>;
	connectionsCreate: GoogleBigqueryEndpoint<'connectionsCreate'>;
	connectionsUpdate: GoogleBigqueryEndpoint<'connectionsUpdate'>;
	reservationsList: GoogleBigqueryEndpoint<'reservationsList'>;
	reservationsCreate: GoogleBigqueryEndpoint<'reservationsCreate'>;
	reservationsListGroups: GoogleBigqueryEndpoint<'reservationsListGroups'>;
	reservationsListAssignments: GoogleBigqueryEndpoint<'reservationsListAssignments'>;
	reservationsCreateAssignment: GoogleBigqueryEndpoint<'reservationsCreateAssignment'>;
	reservationsSearchAllAssignments: GoogleBigqueryEndpoint<'reservationsSearchAllAssignments'>;
	reservationsListCapacityCommitments: GoogleBigqueryEndpoint<'reservationsListCapacityCommitments'>;
	reservationsCreateCapacityCommitment: GoogleBigqueryEndpoint<'reservationsCreateCapacityCommitment'>;
	analyticsHubListListings: GoogleBigqueryEndpoint<'analyticsHubListListings'>;
	analyticsHubListDataexchangesListings: GoogleBigqueryEndpoint<'analyticsHubListDataexchangesListings'>;
	analyticsHubCreateListing: GoogleBigqueryEndpoint<'analyticsHubCreateListing'>;
	analyticsHubCreateDataExchange: GoogleBigqueryEndpoint<'analyticsHubCreateDataExchange'>;
	analyticsHubListOrganizationDataExchanges: GoogleBigqueryEndpoint<'analyticsHubListOrganizationDataExchanges'>;
	analyticsHubListQueryTemplates: GoogleBigqueryEndpoint<'analyticsHubListQueryTemplates'>;
	analyticsHubCreateQueryTemplate: GoogleBigqueryEndpoint<'analyticsHubCreateQueryTemplate'>;
	mlListModels: GoogleBigqueryEndpoint<'mlListModels'>;
	mlGetBigqueryModel: GoogleBigqueryEndpoint<'mlGetBigqueryModel'>;
	mlPatchModel: GoogleBigqueryEndpoint<'mlPatchModel'>;
	mlDeleteModel: GoogleBigqueryEndpoint<'mlDeleteModel'>;
	mlListLocations: GoogleBigqueryEndpoint<'mlListLocations'>;
	mlListProjects: GoogleBigqueryEndpoint<'mlListProjects'>;
};

export type GoogleBigqueryBoundEndpoints = BindEndpoints<
	typeof googleBigqueryEndpointsNested
>;

const googleBigqueryEndpointsNested = {
	queries: {
		query: QueriesEndpoints.query,
		getQueryResults: QueriesEndpoints.getQueryResults,
		insertJob: QueriesEndpoints.insertJob,
		insertJobWithUpload: QueriesEndpoints.insertJobWithUpload,
		insertAll: QueriesEndpoints.insertAll,
		listJobs: QueriesEndpoints.listJobs,
		getJob: QueriesEndpoints.getJob,
		cancelJob: QueriesEndpoints.cancelJob,
		deleteJobMetadata: QueriesEndpoints.deleteJobMetadata,
	},
	datasets: {
		list: DatasetsEndpoints.list,
		get: DatasetsEndpoints.get,
		create: DatasetsEndpoints.create,
		update: DatasetsEndpoints.update,
		patch: DatasetsEndpoints.patch,
		delete: DatasetsEndpoints.deleteDataset,
		undelete: DatasetsEndpoints.undelete,
	},
	tables: {
		list: TablesEndpoints.list,
		listTableData: TablesEndpoints.listTableData,
		getSchema: TablesEndpoints.getSchema,
		create: TablesEndpoints.create,
		update: TablesEndpoints.update,
		patch: TablesEndpoints.patch,
		delete: TablesEndpoints.deleteTable,
	},
	routines: {
		list: RoutinesEndpoints.list,
		get: RoutinesEndpoints.get,
		create: RoutinesEndpoints.create,
		update: RoutinesEndpoints.update,
		delete: RoutinesEndpoints.deleteRoutine,
	},
	iam: {
		getTableIamPolicy: IamEndpoints.getTableIamPolicy,
		getRoutineIamPolicy: IamEndpoints.getRoutineIamPolicy,
		setRoutineIamPolicy: IamEndpoints.setRoutineIamPolicy,
		testRoutineIamPermissions: IamEndpoints.testRoutineIamPermissions,
		getConnectionIamPolicy: IamEndpoints.getConnectionIamPolicy,
		listRowAccessPolicies: IamEndpoints.listRowAccessPolicies,
		createLocationsDatapolicies: IamEndpoints.createLocationsDatapolicies,
		listLocationsDatapolicies: IamEndpoints.listLocationsDatapolicies,
		getServiceAccount: IamEndpoints.getServiceAccount,
	},
	connections: {
		listBigQueryConnections: ConnectionsEndpoints.listBigQueryConnections,
		listLocationsConnections: ConnectionsEndpoints.listLocationsConnections,
		create: ConnectionsEndpoints.create,
		update: ConnectionsEndpoints.update,
	},
	reservations: {
		list: ReservationsEndpoints.list,
		create: ReservationsEndpoints.create,
		listGroups: ReservationsEndpoints.listGroups,
		listAssignments: ReservationsEndpoints.listAssignments,
		createAssignment: ReservationsEndpoints.createAssignment,
		searchAllAssignments: ReservationsEndpoints.searchAllAssignments,
		listCapacityCommitments: ReservationsEndpoints.listCapacityCommitments,
		createCapacityCommitment: ReservationsEndpoints.createCapacityCommitment,
	},
	analyticsHub: {
		listListings: AnalyticsHubEndpoints.listListings,
		listDataexchangesListings: AnalyticsHubEndpoints.listDataexchangesListings,
		createListing: AnalyticsHubEndpoints.createListing,
		createDataExchange: AnalyticsHubEndpoints.createDataExchange,
		listOrganizationDataExchanges:
			AnalyticsHubEndpoints.listOrganizationDataExchanges,
		listQueryTemplates: AnalyticsHubEndpoints.listQueryTemplates,
		createQueryTemplate: AnalyticsHubEndpoints.createQueryTemplate,
	},
	ml: {
		listModels: MlEndpoints.listModels,
		getBigqueryModel: MlEndpoints.getModel,
		patchModel: MlEndpoints.patchModel,
		deleteModel: MlEndpoints.deleteModel,
		listLocations: MlEndpoints.listLocations,
		listProjects: MlEndpoints.listProjects,
	},
} as const;

export const googleBigqueryEndpointSchemas = {
	'queries.query': {
		input: GoogleBigqueryEndpointInputSchemas.queriesQuery,
		output: GoogleBigqueryEndpointOutputSchemas.queriesQuery,
	},
	'queries.getQueryResults': {
		input: GoogleBigqueryEndpointInputSchemas.queriesGetQueryResults,
		output: GoogleBigqueryEndpointOutputSchemas.queriesGetQueryResults,
	},
	'queries.insertJob': {
		input: GoogleBigqueryEndpointInputSchemas.queriesInsertJob,
		output: GoogleBigqueryEndpointOutputSchemas.queriesInsertJob,
	},
	'queries.insertJobWithUpload': {
		input: GoogleBigqueryEndpointInputSchemas.queriesInsertJobWithUpload,
		output: GoogleBigqueryEndpointOutputSchemas.queriesInsertJobWithUpload,
	},
	'queries.insertAll': {
		input: GoogleBigqueryEndpointInputSchemas.queriesInsertAll,
		output: GoogleBigqueryEndpointOutputSchemas.queriesInsertAll,
	},
	'queries.listJobs': {
		input: GoogleBigqueryEndpointInputSchemas.queriesListJobs,
		output: GoogleBigqueryEndpointOutputSchemas.queriesListJobs,
	},
	'queries.getJob': {
		input: GoogleBigqueryEndpointInputSchemas.queriesGetJob,
		output: GoogleBigqueryEndpointOutputSchemas.queriesGetJob,
	},
	'queries.cancelJob': {
		input: GoogleBigqueryEndpointInputSchemas.queriesCancelJob,
		output: GoogleBigqueryEndpointOutputSchemas.queriesCancelJob,
	},
	'queries.deleteJobMetadata': {
		input: GoogleBigqueryEndpointInputSchemas.queriesDeleteJobMetadata,
		output: GoogleBigqueryEndpointOutputSchemas.queriesDeleteJobMetadata,
	},
	'datasets.list': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsList,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsList,
	},
	'datasets.get': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsGet,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsGet,
	},
	'datasets.create': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsCreate,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsCreate,
	},
	'datasets.update': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsUpdate,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsUpdate,
	},
	'datasets.patch': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsPatch,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsPatch,
	},
	'datasets.delete': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsDelete,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsDelete,
	},
	'datasets.undelete': {
		input: GoogleBigqueryEndpointInputSchemas.datasetsUndelete,
		output: GoogleBigqueryEndpointOutputSchemas.datasetsUndelete,
	},
	'tables.list': {
		input: GoogleBigqueryEndpointInputSchemas.tablesList,
		output: GoogleBigqueryEndpointOutputSchemas.tablesList,
	},
	'tables.listTableData': {
		input: GoogleBigqueryEndpointInputSchemas.tablesListTableData,
		output: GoogleBigqueryEndpointOutputSchemas.tablesListTableData,
	},
	'tables.getSchema': {
		input: GoogleBigqueryEndpointInputSchemas.tablesGetSchema,
		output: GoogleBigqueryEndpointOutputSchemas.tablesGetSchema,
	},
	'tables.create': {
		input: GoogleBigqueryEndpointInputSchemas.tablesCreate,
		output: GoogleBigqueryEndpointOutputSchemas.tablesCreate,
	},
	'tables.update': {
		input: GoogleBigqueryEndpointInputSchemas.tablesUpdate,
		output: GoogleBigqueryEndpointOutputSchemas.tablesUpdate,
	},
	'tables.patch': {
		input: GoogleBigqueryEndpointInputSchemas.tablesPatch,
		output: GoogleBigqueryEndpointOutputSchemas.tablesPatch,
	},
	'tables.delete': {
		input: GoogleBigqueryEndpointInputSchemas.tablesDelete,
		output: GoogleBigqueryEndpointOutputSchemas.tablesDelete,
	},
	'routines.list': {
		input: GoogleBigqueryEndpointInputSchemas.routinesList,
		output: GoogleBigqueryEndpointOutputSchemas.routinesList,
	},
	'routines.get': {
		input: GoogleBigqueryEndpointInputSchemas.routinesGet,
		output: GoogleBigqueryEndpointOutputSchemas.routinesGet,
	},
	'routines.create': {
		input: GoogleBigqueryEndpointInputSchemas.routinesCreate,
		output: GoogleBigqueryEndpointOutputSchemas.routinesCreate,
	},
	'routines.update': {
		input: GoogleBigqueryEndpointInputSchemas.routinesUpdate,
		output: GoogleBigqueryEndpointOutputSchemas.routinesUpdate,
	},
	'routines.delete': {
		input: GoogleBigqueryEndpointInputSchemas.routinesDelete,
		output: GoogleBigqueryEndpointOutputSchemas.routinesDelete,
	},
	'iam.getTableIamPolicy': {
		input: GoogleBigqueryEndpointInputSchemas.iamGetTableIamPolicy,
		output: GoogleBigqueryEndpointOutputSchemas.iamGetTableIamPolicy,
	},
	'iam.getRoutineIamPolicy': {
		input: GoogleBigqueryEndpointInputSchemas.iamGetRoutineIamPolicy,
		output: GoogleBigqueryEndpointOutputSchemas.iamGetRoutineIamPolicy,
	},
	'iam.setRoutineIamPolicy': {
		input: GoogleBigqueryEndpointInputSchemas.iamSetRoutineIamPolicy,
		output: GoogleBigqueryEndpointOutputSchemas.iamSetRoutineIamPolicy,
	},
	'iam.testRoutineIamPermissions': {
		input: GoogleBigqueryEndpointInputSchemas.iamTestRoutineIamPermissions,
		output: GoogleBigqueryEndpointOutputSchemas.iamTestRoutineIamPermissions,
	},
	'iam.getConnectionIamPolicy': {
		input: GoogleBigqueryEndpointInputSchemas.iamGetConnectionIamPolicy,
		output: GoogleBigqueryEndpointOutputSchemas.iamGetConnectionIamPolicy,
	},
	'iam.listRowAccessPolicies': {
		input: GoogleBigqueryEndpointInputSchemas.iamListRowAccessPolicies,
		output: GoogleBigqueryEndpointOutputSchemas.iamListRowAccessPolicies,
	},
	'iam.createLocationsDatapolicies': {
		input: GoogleBigqueryEndpointInputSchemas.iamCreateLocationsDatapolicies,
		output: GoogleBigqueryEndpointOutputSchemas.iamCreateLocationsDatapolicies,
	},
	'iam.listLocationsDatapolicies': {
		input: GoogleBigqueryEndpointInputSchemas.iamListLocationsDatapolicies,
		output: GoogleBigqueryEndpointOutputSchemas.iamListLocationsDatapolicies,
	},
	'iam.getServiceAccount': {
		input: GoogleBigqueryEndpointInputSchemas.iamGetServiceAccount,
		output: GoogleBigqueryEndpointOutputSchemas.iamGetServiceAccount,
	},
	'connections.listBigQueryConnections': {
		input:
			GoogleBigqueryEndpointInputSchemas.connectionsListBigQueryConnections,
		output:
			GoogleBigqueryEndpointOutputSchemas.connectionsListBigQueryConnections,
	},
	'connections.listLocationsConnections': {
		input:
			GoogleBigqueryEndpointInputSchemas.connectionsListLocationsConnections,
		output:
			GoogleBigqueryEndpointOutputSchemas.connectionsListLocationsConnections,
	},
	'connections.create': {
		input: GoogleBigqueryEndpointInputSchemas.connectionsCreate,
		output: GoogleBigqueryEndpointOutputSchemas.connectionsCreate,
	},
	'connections.update': {
		input: GoogleBigqueryEndpointInputSchemas.connectionsUpdate,
		output: GoogleBigqueryEndpointOutputSchemas.connectionsUpdate,
	},
	'reservations.list': {
		input: GoogleBigqueryEndpointInputSchemas.reservationsList,
		output: GoogleBigqueryEndpointOutputSchemas.reservationsList,
	},
	'reservations.create': {
		input: GoogleBigqueryEndpointInputSchemas.reservationsCreate,
		output: GoogleBigqueryEndpointOutputSchemas.reservationsCreate,
	},
	'reservations.listGroups': {
		input: GoogleBigqueryEndpointInputSchemas.reservationsListGroups,
		output: GoogleBigqueryEndpointOutputSchemas.reservationsListGroups,
	},
	'reservations.listAssignments': {
		input: GoogleBigqueryEndpointInputSchemas.reservationsListAssignments,
		output: GoogleBigqueryEndpointOutputSchemas.reservationsListAssignments,
	},
	'reservations.createAssignment': {
		input: GoogleBigqueryEndpointInputSchemas.reservationsCreateAssignment,
		output: GoogleBigqueryEndpointOutputSchemas.reservationsCreateAssignment,
	},
	'reservations.searchAllAssignments': {
		input: GoogleBigqueryEndpointInputSchemas.reservationsSearchAllAssignments,
		output:
			GoogleBigqueryEndpointOutputSchemas.reservationsSearchAllAssignments,
	},
	'reservations.listCapacityCommitments': {
		input:
			GoogleBigqueryEndpointInputSchemas.reservationsListCapacityCommitments,
		output:
			GoogleBigqueryEndpointOutputSchemas.reservationsListCapacityCommitments,
	},
	'reservations.createCapacityCommitment': {
		input:
			GoogleBigqueryEndpointInputSchemas.reservationsCreateCapacityCommitment,
		output:
			GoogleBigqueryEndpointOutputSchemas.reservationsCreateCapacityCommitment,
	},
	'analyticsHub.listListings': {
		input: GoogleBigqueryEndpointInputSchemas.analyticsHubListListings,
		output: GoogleBigqueryEndpointOutputSchemas.analyticsHubListListings,
	},
	'analyticsHub.listDataexchangesListings': {
		input:
			GoogleBigqueryEndpointInputSchemas.analyticsHubListDataexchangesListings,
		output:
			GoogleBigqueryEndpointOutputSchemas.analyticsHubListDataexchangesListings,
	},
	'analyticsHub.createListing': {
		input: GoogleBigqueryEndpointInputSchemas.analyticsHubCreateListing,
		output: GoogleBigqueryEndpointOutputSchemas.analyticsHubCreateListing,
	},
	'analyticsHub.createDataExchange': {
		input: GoogleBigqueryEndpointInputSchemas.analyticsHubCreateDataExchange,
		output: GoogleBigqueryEndpointOutputSchemas.analyticsHubCreateDataExchange,
	},
	'analyticsHub.listOrganizationDataExchanges': {
		input:
			GoogleBigqueryEndpointInputSchemas.analyticsHubListOrganizationDataExchanges,
		output:
			GoogleBigqueryEndpointOutputSchemas.analyticsHubListOrganizationDataExchanges,
	},
	'analyticsHub.listQueryTemplates': {
		input: GoogleBigqueryEndpointInputSchemas.analyticsHubListQueryTemplates,
		output: GoogleBigqueryEndpointOutputSchemas.analyticsHubListQueryTemplates,
	},
	'analyticsHub.createQueryTemplate': {
		input: GoogleBigqueryEndpointInputSchemas.analyticsHubCreateQueryTemplate,
		output: GoogleBigqueryEndpointOutputSchemas.analyticsHubCreateQueryTemplate,
	},
	'ml.listModels': {
		input: GoogleBigqueryEndpointInputSchemas.mlListModels,
		output: GoogleBigqueryEndpointOutputSchemas.mlListModels,
	},
	'ml.getBigqueryModel': {
		input: GoogleBigqueryEndpointInputSchemas.mlGetBigqueryModel,
		output: GoogleBigqueryEndpointOutputSchemas.mlGetBigqueryModel,
	},
	'ml.patchModel': {
		input: GoogleBigqueryEndpointInputSchemas.mlPatchModel,
		output: GoogleBigqueryEndpointOutputSchemas.mlPatchModel,
	},
	'ml.deleteModel': {
		input: GoogleBigqueryEndpointInputSchemas.mlDeleteModel,
		output: GoogleBigqueryEndpointOutputSchemas.mlDeleteModel,
	},
	'ml.listLocations': {
		input: GoogleBigqueryEndpointInputSchemas.mlListLocations,
		output: GoogleBigqueryEndpointOutputSchemas.mlListLocations,
	},
	'ml.listProjects': {
		input: GoogleBigqueryEndpointInputSchemas.mlListProjects,
		output: GoogleBigqueryEndpointOutputSchemas.mlListProjects,
	},
} as const;

export type GoogleBigqueryPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleBigqueryPlugin['hooks'];
	webhookHooks?: InternalGoogleBigqueryPlugin['webhookHooks'];
	/**
	 * Permission configuration for the Google BigQuery plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Google BigQuery endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof googleBigqueryEndpointsNested>;
};

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each Google BigQuery endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const googleBigqueryEndpointMeta = {
	'queries.query': {
		riskLevel: 'read',
		description: 'Run a SQL query and return inline results',
	},
	'queries.getQueryResults': {
		riskLevel: 'read',
		description:
			'Fetch additional pages of results for a running/completed query job',
	},
	'queries.insertJob': {
		riskLevel: 'write',
		description: 'Start a query, load, extract, or copy job (supports dry-run)',
	},
	'queries.insertJobWithUpload': {
		riskLevel: 'write',
		description:
			'Start a load job that uploads an inline file as the data source',
	},
	'queries.insertAll': {
		riskLevel: 'write',
		description:
			'Stream rows into a table (supports insertId-based deduplication)',
	},
	'queries.listJobs': {
		riskLevel: 'read',
		description: 'List jobs for a project',
	},
	'queries.getJob': {
		riskLevel: 'read',
		description: 'Get a job by ID',
	},
	'queries.cancelJob': {
		riskLevel: 'destructive',
		description: 'Request cancellation of a running job [DESTRUCTIVE]',
	},
	'queries.deleteJobMetadata': {
		riskLevel: 'destructive',
		description: "Delete a job's metadata [DESTRUCTIVE]",
	},
	'datasets.list': {
		riskLevel: 'read',
		description: 'List datasets in a project',
	},
	'datasets.get': {
		riskLevel: 'read',
		description: 'Get a dataset by ID',
	},
	'datasets.create': {
		riskLevel: 'write',
		description: 'Create a new dataset',
	},
	'datasets.update': {
		riskLevel: 'write',
		description: 'Replace a dataset (full update)',
	},
	'datasets.patch': {
		riskLevel: 'write',
		description: 'Partially update a dataset',
	},
	'datasets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a dataset [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'datasets.undelete': {
		riskLevel: 'write',
		description: 'Restore a recently deleted dataset',
	},
	'tables.list': {
		riskLevel: 'read',
		description: 'List tables in a dataset',
	},
	'tables.listTableData': {
		riskLevel: 'read',
		description: "List a table's row data",
	},
	'tables.getSchema': {
		riskLevel: 'read',
		description: "Get a table's schema and metadata",
	},
	'tables.create': {
		riskLevel: 'write',
		description: 'Create a new table or view',
	},
	'tables.update': {
		riskLevel: 'write',
		description: 'Replace a table (full update)',
	},
	'tables.patch': {
		riskLevel: 'write',
		description: 'Partially update a table',
	},
	'tables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a table [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'routines.list': {
		riskLevel: 'read',
		description: 'List routines (UDFs/stored procedures) in a dataset',
	},
	'routines.get': {
		riskLevel: 'read',
		description: 'Get a routine by ID',
	},
	'routines.create': {
		riskLevel: 'write',
		description: 'Create a new routine (UDF or stored procedure)',
	},
	'routines.update': {
		riskLevel: 'write',
		description: 'Replace a routine (full update)',
	},
	'routines.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a routine [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'iam.getTableIamPolicy': {
		riskLevel: 'read',
		description: "Get a table's IAM policy",
	},
	'iam.getRoutineIamPolicy': {
		riskLevel: 'read',
		description: "Get a routine's IAM policy",
	},
	'iam.setRoutineIamPolicy': {
		riskLevel: 'write',
		description: "Replace a routine's IAM policy",
	},
	'iam.testRoutineIamPermissions': {
		riskLevel: 'read',
		description: 'Test which permissions the caller has on a routine',
	},
	'iam.getConnectionIamPolicy': {
		riskLevel: 'read',
		description: "Get a connection's IAM policy",
	},
	'iam.listRowAccessPolicies': {
		riskLevel: 'read',
		description: "List a table's row-level access policies",
	},
	'iam.createLocationsDatapolicies': {
		riskLevel: 'write',
		description: 'Create a column-level security / data masking policy',
	},
	'iam.listLocationsDatapolicies': {
		riskLevel: 'read',
		description: 'List data policies in a location',
	},
	'iam.getServiceAccount': {
		riskLevel: 'read',
		description: "Get the project's BigQuery service account email",
	},
	'connections.listBigQueryConnections': {
		riskLevel: 'read',
		description: 'List BigQuery connections across all locations',
	},
	'connections.listLocationsConnections': {
		riskLevel: 'read',
		description: 'List BigQuery connections in a specific location',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a new external data source connection',
	},
	'connections.update': {
		riskLevel: 'write',
		description: 'Update an existing connection',
	},
	'reservations.list': {
		riskLevel: 'read',
		description: 'List slot reservations in a location',
	},
	'reservations.create': {
		riskLevel: 'write',
		description: 'Create a new slot reservation (has billing impact)',
	},
	'reservations.listGroups': {
		riskLevel: 'read',
		description: 'List reservation groups in a location',
	},
	'reservations.listAssignments': {
		riskLevel: 'read',
		description: "List a reservation's assignments",
	},
	'reservations.createAssignment': {
		riskLevel: 'write',
		description: 'Assign a project/folder/org to a reservation',
	},
	'reservations.searchAllAssignments': {
		riskLevel: 'read',
		description: 'Search assignments across a location',
	},
	'reservations.listCapacityCommitments': {
		riskLevel: 'read',
		description: 'List capacity commitments in a location',
	},
	'reservations.createCapacityCommitment': {
		riskLevel: 'write',
		description: 'Purchase a new capacity commitment (has billing impact)',
	},
	'analyticsHub.listListings': {
		riskLevel: 'read',
		description: 'List listings in a data exchange',
	},
	'analyticsHub.listDataexchangesListings': {
		riskLevel: 'read',
		description: 'List data exchanges in a location',
	},
	'analyticsHub.createListing': {
		riskLevel: 'write',
		description: 'Create a new listing (shareable dataset) in a data exchange',
	},
	'analyticsHub.createDataExchange': {
		riskLevel: 'write',
		description: 'Create a new data exchange',
	},
	'analyticsHub.listOrganizationDataExchanges': {
		riskLevel: 'read',
		description: 'List data exchanges across an organization',
	},
	'analyticsHub.listQueryTemplates': {
		riskLevel: 'read',
		description: 'List query templates in a data exchange',
	},
	'analyticsHub.createQueryTemplate': {
		riskLevel: 'write',
		description: 'Create a new query template in a data exchange',
	},
	'ml.listModels': {
		riskLevel: 'read',
		description: 'List BigQuery ML models in a dataset',
	},
	'ml.getBigqueryModel': {
		riskLevel: 'read',
		description: 'Get a BigQuery ML model by ID',
	},
	'ml.patchModel': {
		riskLevel: 'write',
		description: "Partially update a model's metadata",
	},
	'ml.deleteModel': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a model [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'ml.listLocations': {
		riskLevel: 'read',
		description: 'List available BigQuery locations for a project',
	},
	'ml.listProjects': {
		riskLevel: 'read',
		description: 'List projects visible to the caller',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleBigqueryEndpointsNested
>;

export const googleBigqueryAuthConfig = {
	oauth_2: {
		account: ['project_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleBigqueryPlugin<T extends GoogleBigqueryPluginOptions> =
	CorsairPlugin<
		'googlebigquery',
		typeof GoogleBigquerySchema,
		typeof googleBigqueryEndpointsNested,
		never,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleBigqueryPlugin =
	BaseGoogleBigqueryPlugin<GoogleBigqueryPluginOptions>;

export type ExternalGoogleBigqueryPlugin<
	T extends GoogleBigqueryPluginOptions,
> = BaseGoogleBigqueryPlugin<T>;

export function googlebigquery<const T extends GoogleBigqueryPluginOptions>(
	incomingOptions: GoogleBigqueryPluginOptions &
		T = {} as GoogleBigqueryPluginOptions & T,
): ExternalGoogleBigqueryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlebigquery',
		authConfig: googleBigqueryAuthConfig,
		schema: GoogleBigquerySchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/bigquery',
				'https://www.googleapis.com/auth/cloud-platform',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleBigqueryEndpointsNested,
		endpointMeta: googleBigqueryEndpointMeta,
		endpointSchemas: googleBigqueryEndpointSchemas,
		errorHandlers: errorHandlers,
		keyBuilder: async (ctx: GoogleBigqueryKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new AuthMissingError('googlebigquery', 'oauth_2');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[corsair:googlebigquery] No client id or client secret',
					);
				}

				try {
					const result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
					});

					if (result.refreshed) {
						await Promise.all([
							ctx.keys.set_access_token(result.accessToken),
							ctx.keys.set_expires_at(String(result.expiresAt)),
						]);
					}

					// ctx type doesn't declare _refreshAuth; cast to attach side-channel callback for token refresh
					(ctx as Record<string, unknown>)._refreshAuth = async () => {
						const freshResult = await getValidAccessToken({
							accessToken: null,
							expiresAt: null,
							refreshToken,
							clientId: res.client_id!,
							clientSecret: res.client_secret!,
							forceRefresh: true,
						});
						await ctx.keys.set_access_token(freshResult.accessToken);
						await ctx.keys.set_expires_at(String(freshResult.expiresAt));
						return freshResult.accessToken;
					};

					return result.accessToken;
				} catch (error) {
					throw new Error(
						`[corsair:googlebigquery] Failed to get valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			throw new AuthMissingError('googlebigquery', 'oauth_2');
		},
	} satisfies InternalGoogleBigqueryPlugin;
}

export type {
	GoogleBigqueryEndpointInputs,
	GoogleBigqueryEndpointOutputs,
} from './endpoints/types';
