import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointJob,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Catalog,
	Destinations,
	Functions,
	Regulations,
	Sources,
	TrackingPlans,
	Warehouses,
	Workspaces,
} from './endpoints';
import type {
	SegmentEndpointInputs,
	SegmentEndpointOutputs,
} from './endpoints/types';
import {
	SegmentEndpointInputSchemas,
	SegmentEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SegmentSchema } from './schema';

export type SegmentPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	// EU workspaces answer every call with 403 from the US host, so the base
	// URL must be overridable: pass https://eu1.api.segmentapis.com.
	baseUrl?: string;
	hooks?: InternalSegmentPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof segmentEndpointsNested>;
};

export type SegmentContext = CorsairPluginContext<
	typeof SegmentSchema,
	SegmentPluginOptions
>;

export type SegmentKeyBuilderContext = KeyBuilderContext<SegmentPluginOptions>;

export type SegmentBoundEndpoints = BindEndpoints<
	typeof segmentEndpointsNested
>;

type SegmentEndpoint<K extends keyof SegmentEndpointOutputs> = CorsairEndpoint<
	SegmentContext,
	SegmentEndpointInputs[K],
	SegmentEndpointOutputs[K]
>;

export type SegmentEndpoints = {
	workspacesGet: SegmentEndpoint<'workspacesGet'>;
	sourcesList: SegmentEndpoint<'sourcesList'>;
	sourcesGet: SegmentEndpoint<'sourcesGet'>;
	sourcesCreate: SegmentEndpoint<'sourcesCreate'>;
	sourcesUpdate: SegmentEndpoint<'sourcesUpdate'>;
	sourcesDelete: SegmentEndpoint<'sourcesDelete'>;
	sourcesListConnectedDestinations: SegmentEndpoint<'sourcesListConnectedDestinations'>;
	sourcesListConnectedWarehouses: SegmentEndpoint<'sourcesListConnectedWarehouses'>;
	sourcesUpdateSchemaSettings: SegmentEndpoint<'sourcesUpdateSchemaSettings'>;
	sourcesCreateWriteKey: SegmentEndpoint<'sourcesCreateWriteKey'>;
	sourcesRemoveWriteKey: SegmentEndpoint<'sourcesRemoveWriteKey'>;
	destinationsList: SegmentEndpoint<'destinationsList'>;
	destinationsGet: SegmentEndpoint<'destinationsGet'>;
	destinationsCreate: SegmentEndpoint<'destinationsCreate'>;
	destinationsUpdate: SegmentEndpoint<'destinationsUpdate'>;
	destinationsDelete: SegmentEndpoint<'destinationsDelete'>;
	warehousesList: SegmentEndpoint<'warehousesList'>;
	warehousesGet: SegmentEndpoint<'warehousesGet'>;
	warehousesGetConnectionState: SegmentEndpoint<'warehousesGetConnectionState'>;
	warehousesListConnectedSources: SegmentEndpoint<'warehousesListConnectedSources'>;
	warehousesValidate: SegmentEndpoint<'warehousesValidate'>;
	warehousesCreate: SegmentEndpoint<'warehousesCreate'>;
	warehousesUpdate: SegmentEndpoint<'warehousesUpdate'>;
	warehousesAddSourceConnection: SegmentEndpoint<'warehousesAddSourceConnection'>;
	warehousesDelete: SegmentEndpoint<'warehousesDelete'>;
	warehousesRemoveSourceConnection: SegmentEndpoint<'warehousesRemoveSourceConnection'>;
	trackingPlansList: SegmentEndpoint<'trackingPlansList'>;
	trackingPlansGet: SegmentEndpoint<'trackingPlansGet'>;
	trackingPlansListRules: SegmentEndpoint<'trackingPlansListRules'>;
	trackingPlansListSources: SegmentEndpoint<'trackingPlansListSources'>;
	trackingPlansCreate: SegmentEndpoint<'trackingPlansCreate'>;
	trackingPlansUpdate: SegmentEndpoint<'trackingPlansUpdate'>;
	trackingPlansReplaceRules: SegmentEndpoint<'trackingPlansReplaceRules'>;
	trackingPlansAddSource: SegmentEndpoint<'trackingPlansAddSource'>;
	trackingPlansDelete: SegmentEndpoint<'trackingPlansDelete'>;
	trackingPlansRemoveSource: SegmentEndpoint<'trackingPlansRemoveSource'>;
	functionsList: SegmentEndpoint<'functionsList'>;
	functionsGet: SegmentEndpoint<'functionsGet'>;
	functionsListVersions: SegmentEndpoint<'functionsListVersions'>;
	functionsGetVersion: SegmentEndpoint<'functionsGetVersion'>;
	functionsCreate: SegmentEndpoint<'functionsCreate'>;
	functionsUpdate: SegmentEndpoint<'functionsUpdate'>;
	functionsDeploy: SegmentEndpoint<'functionsDeploy'>;
	functionsRestoreVersion: SegmentEndpoint<'functionsRestoreVersion'>;
	functionsDelete: SegmentEndpoint<'functionsDelete'>;
	catalogListDestinations: SegmentEndpoint<'catalogListDestinations'>;
	catalogGetDestination: SegmentEndpoint<'catalogGetDestination'>;
	catalogListSources: SegmentEndpoint<'catalogListSources'>;
	catalogGetSource: SegmentEndpoint<'catalogGetSource'>;
	regulationsList: SegmentEndpoint<'regulationsList'>;
	regulationsCreate: SegmentEndpoint<'regulationsCreate'>;
	regulationsGet: SegmentEndpoint<'regulationsGet'>;
};

const segmentEndpointsNested = {
	workspaces: {
		get: Workspaces.get,
	},
	sources: {
		list: Sources.list,
		get: Sources.get,
		create: Sources.create,
		update: Sources.update,
		delete: Sources.remove,
		listConnectedDestinations: Sources.listConnectedDestinations,
		listConnectedWarehouses: Sources.listConnectedWarehouses,
		updateSchemaSettings: Sources.updateSchemaSettings,
		createWriteKey: Sources.createWriteKey,
		removeWriteKey: Sources.removeWriteKey,
	},
	destinations: {
		list: Destinations.list,
		get: Destinations.get,
		create: Destinations.create,
		update: Destinations.update,
		delete: Destinations.remove,
	},
	warehouses: {
		list: Warehouses.list,
		get: Warehouses.get,
		getConnectionState: Warehouses.getConnectionState,
		listConnectedSources: Warehouses.listConnectedSources,
		validate: Warehouses.validate,
		create: Warehouses.create,
		update: Warehouses.update,
		addSourceConnection: Warehouses.addSourceConnection,
		delete: Warehouses.remove,
		removeSourceConnection: Warehouses.removeSourceConnection,
	},
	trackingPlans: {
		list: TrackingPlans.list,
		get: TrackingPlans.get,
		listRules: TrackingPlans.listRules,
		listSources: TrackingPlans.listSources,
		create: TrackingPlans.create,
		update: TrackingPlans.update,
		replaceRules: TrackingPlans.replaceRules,
		addSource: TrackingPlans.addSource,
		delete: TrackingPlans.remove,
		removeSource: TrackingPlans.removeSource,
	},
	functions: {
		list: Functions.list,
		get: Functions.get,
		listVersions: Functions.listVersions,
		getVersion: Functions.getVersion,
		create: Functions.create,
		update: Functions.update,
		deploy: Functions.deploy,
		restoreVersion: Functions.restoreVersion,
		delete: Functions.remove,
	},
	catalog: {
		listDestinations: Catalog.listDestinations,
		getDestination: Catalog.getDestination,
		listSources: Catalog.listSources,
		getSource: Catalog.getSource,
	},
	regulations: {
		list: Regulations.list,
		create: Regulations.create,
		get: Regulations.get,
	},
} as const;

export const segmentEndpointSchemas = {
	'workspaces.get': {
		input: SegmentEndpointInputSchemas.workspacesGet,
		output: SegmentEndpointOutputSchemas.workspacesGet,
	},
	'sources.list': {
		input: SegmentEndpointInputSchemas.sourcesList,
		output: SegmentEndpointOutputSchemas.sourcesList,
	},
	'sources.get': {
		input: SegmentEndpointInputSchemas.sourcesGet,
		output: SegmentEndpointOutputSchemas.sourcesGet,
	},
	'sources.create': {
		input: SegmentEndpointInputSchemas.sourcesCreate,
		output: SegmentEndpointOutputSchemas.sourcesCreate,
	},
	'sources.update': {
		input: SegmentEndpointInputSchemas.sourcesUpdate,
		output: SegmentEndpointOutputSchemas.sourcesUpdate,
	},
	'sources.delete': {
		input: SegmentEndpointInputSchemas.sourcesDelete,
		output: SegmentEndpointOutputSchemas.sourcesDelete,
	},
	'sources.listConnectedDestinations': {
		input: SegmentEndpointInputSchemas.sourcesListConnectedDestinations,
		output: SegmentEndpointOutputSchemas.sourcesListConnectedDestinations,
	},
	'sources.listConnectedWarehouses': {
		input: SegmentEndpointInputSchemas.sourcesListConnectedWarehouses,
		output: SegmentEndpointOutputSchemas.sourcesListConnectedWarehouses,
	},
	'sources.updateSchemaSettings': {
		input: SegmentEndpointInputSchemas.sourcesUpdateSchemaSettings,
		output: SegmentEndpointOutputSchemas.sourcesUpdateSchemaSettings,
	},
	'sources.createWriteKey': {
		input: SegmentEndpointInputSchemas.sourcesCreateWriteKey,
		output: SegmentEndpointOutputSchemas.sourcesCreateWriteKey,
	},
	'sources.removeWriteKey': {
		input: SegmentEndpointInputSchemas.sourcesRemoveWriteKey,
		output: SegmentEndpointOutputSchemas.sourcesRemoveWriteKey,
	},
	'destinations.list': {
		input: SegmentEndpointInputSchemas.destinationsList,
		output: SegmentEndpointOutputSchemas.destinationsList,
	},
	'destinations.get': {
		input: SegmentEndpointInputSchemas.destinationsGet,
		output: SegmentEndpointOutputSchemas.destinationsGet,
	},
	'destinations.create': {
		input: SegmentEndpointInputSchemas.destinationsCreate,
		output: SegmentEndpointOutputSchemas.destinationsCreate,
	},
	'destinations.update': {
		input: SegmentEndpointInputSchemas.destinationsUpdate,
		output: SegmentEndpointOutputSchemas.destinationsUpdate,
	},
	'destinations.delete': {
		input: SegmentEndpointInputSchemas.destinationsDelete,
		output: SegmentEndpointOutputSchemas.destinationsDelete,
	},
	'warehouses.list': {
		input: SegmentEndpointInputSchemas.warehousesList,
		output: SegmentEndpointOutputSchemas.warehousesList,
	},
	'warehouses.get': {
		input: SegmentEndpointInputSchemas.warehousesGet,
		output: SegmentEndpointOutputSchemas.warehousesGet,
	},
	'warehouses.getConnectionState': {
		input: SegmentEndpointInputSchemas.warehousesGetConnectionState,
		output: SegmentEndpointOutputSchemas.warehousesGetConnectionState,
	},
	'warehouses.listConnectedSources': {
		input: SegmentEndpointInputSchemas.warehousesListConnectedSources,
		output: SegmentEndpointOutputSchemas.warehousesListConnectedSources,
	},
	'warehouses.validate': {
		input: SegmentEndpointInputSchemas.warehousesValidate,
		output: SegmentEndpointOutputSchemas.warehousesValidate,
	},
	'warehouses.create': {
		input: SegmentEndpointInputSchemas.warehousesCreate,
		output: SegmentEndpointOutputSchemas.warehousesCreate,
	},
	'warehouses.update': {
		input: SegmentEndpointInputSchemas.warehousesUpdate,
		output: SegmentEndpointOutputSchemas.warehousesUpdate,
	},
	'warehouses.addSourceConnection': {
		input: SegmentEndpointInputSchemas.warehousesAddSourceConnection,
		output: SegmentEndpointOutputSchemas.warehousesAddSourceConnection,
	},
	'warehouses.delete': {
		input: SegmentEndpointInputSchemas.warehousesDelete,
		output: SegmentEndpointOutputSchemas.warehousesDelete,
	},
	'warehouses.removeSourceConnection': {
		input: SegmentEndpointInputSchemas.warehousesRemoveSourceConnection,
		output: SegmentEndpointOutputSchemas.warehousesRemoveSourceConnection,
	},
	'trackingPlans.list': {
		input: SegmentEndpointInputSchemas.trackingPlansList,
		output: SegmentEndpointOutputSchemas.trackingPlansList,
	},
	'trackingPlans.get': {
		input: SegmentEndpointInputSchemas.trackingPlansGet,
		output: SegmentEndpointOutputSchemas.trackingPlansGet,
	},
	'trackingPlans.listRules': {
		input: SegmentEndpointInputSchemas.trackingPlansListRules,
		output: SegmentEndpointOutputSchemas.trackingPlansListRules,
	},
	'trackingPlans.listSources': {
		input: SegmentEndpointInputSchemas.trackingPlansListSources,
		output: SegmentEndpointOutputSchemas.trackingPlansListSources,
	},
	'trackingPlans.create': {
		input: SegmentEndpointInputSchemas.trackingPlansCreate,
		output: SegmentEndpointOutputSchemas.trackingPlansCreate,
	},
	'trackingPlans.update': {
		input: SegmentEndpointInputSchemas.trackingPlansUpdate,
		output: SegmentEndpointOutputSchemas.trackingPlansUpdate,
	},
	'trackingPlans.replaceRules': {
		input: SegmentEndpointInputSchemas.trackingPlansReplaceRules,
		output: SegmentEndpointOutputSchemas.trackingPlansReplaceRules,
	},
	'trackingPlans.addSource': {
		input: SegmentEndpointInputSchemas.trackingPlansAddSource,
		output: SegmentEndpointOutputSchemas.trackingPlansAddSource,
	},
	'trackingPlans.delete': {
		input: SegmentEndpointInputSchemas.trackingPlansDelete,
		output: SegmentEndpointOutputSchemas.trackingPlansDelete,
	},
	'trackingPlans.removeSource': {
		input: SegmentEndpointInputSchemas.trackingPlansRemoveSource,
		output: SegmentEndpointOutputSchemas.trackingPlansRemoveSource,
	},
	'functions.list': {
		input: SegmentEndpointInputSchemas.functionsList,
		output: SegmentEndpointOutputSchemas.functionsList,
	},
	'functions.get': {
		input: SegmentEndpointInputSchemas.functionsGet,
		output: SegmentEndpointOutputSchemas.functionsGet,
	},
	'functions.listVersions': {
		input: SegmentEndpointInputSchemas.functionsListVersions,
		output: SegmentEndpointOutputSchemas.functionsListVersions,
	},
	'functions.getVersion': {
		input: SegmentEndpointInputSchemas.functionsGetVersion,
		output: SegmentEndpointOutputSchemas.functionsGetVersion,
	},
	'functions.create': {
		input: SegmentEndpointInputSchemas.functionsCreate,
		output: SegmentEndpointOutputSchemas.functionsCreate,
	},
	'functions.update': {
		input: SegmentEndpointInputSchemas.functionsUpdate,
		output: SegmentEndpointOutputSchemas.functionsUpdate,
	},
	'functions.deploy': {
		input: SegmentEndpointInputSchemas.functionsDeploy,
		output: SegmentEndpointOutputSchemas.functionsDeploy,
	},
	'functions.restoreVersion': {
		input: SegmentEndpointInputSchemas.functionsRestoreVersion,
		output: SegmentEndpointOutputSchemas.functionsRestoreVersion,
	},
	'functions.delete': {
		input: SegmentEndpointInputSchemas.functionsDelete,
		output: SegmentEndpointOutputSchemas.functionsDelete,
	},
	'catalog.listDestinations': {
		input: SegmentEndpointInputSchemas.catalogListDestinations,
		output: SegmentEndpointOutputSchemas.catalogListDestinations,
	},
	'catalog.getDestination': {
		input: SegmentEndpointInputSchemas.catalogGetDestination,
		output: SegmentEndpointOutputSchemas.catalogGetDestination,
	},
	'catalog.listSources': {
		input: SegmentEndpointInputSchemas.catalogListSources,
		output: SegmentEndpointOutputSchemas.catalogListSources,
	},
	'catalog.getSource': {
		input: SegmentEndpointInputSchemas.catalogGetSource,
		output: SegmentEndpointOutputSchemas.catalogGetSource,
	},
	'regulations.list': {
		input: SegmentEndpointInputSchemas.regulationsList,
		output: SegmentEndpointOutputSchemas.regulationsList,
	},
	'regulations.create': {
		input: SegmentEndpointInputSchemas.regulationsCreate,
		output: SegmentEndpointOutputSchemas.regulationsCreate,
	},
	'regulations.get': {
		input: SegmentEndpointInputSchemas.regulationsGet,
		output: SegmentEndpointOutputSchemas.regulationsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof segmentEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// PARTIAL_SUCCESS is terminal-done, not failed: the run has ended and some
// subjects were processed; nothing more will happen. There is no cancel
// operation, so the job has none.
const REGULATION_JOB = {
	idPath: 'data.regulateId',
	status: {
		op: 'regulations.get',
		idArg: 'regulateId',
		statusPath: 'data.regulation.overallStatus',
		done: ['FINISHED', 'PARTIAL_SUCCESS'],
		failed: ['FAILED', 'INVALID', 'NOT_SUPPORTED'],
	},
} as const satisfies EndpointJob;

const segmentEndpointMeta = {
	'workspaces.get': {
		riskLevel: 'read',
		description: 'Get the Workspace the token belongs to',
	},
	'sources.list': {
		riskLevel: 'read',
		description:
			'List the Sources in the Workspace; each row embeds its write keys',
	},
	'sources.get': {
		riskLevel: 'read',
		description: 'Get one Source by id, with its write keys and settings',
	},
	'sources.create': {
		riskLevel: 'write',
		description:
			'Create a Source from a catalog metadata id and its settings; with disconnectAllWarehouses it also detaches warehouses from the slug',
	},
	'sources.update': {
		riskLevel: 'write',
		description: 'Update a Source name, slug, enabled flag or settings',
	},
	'sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Source permanently; its data in downstream warehouses remains but the configuration is gone',
	},
	'sources.listConnectedDestinations': {
		riskLevel: 'read',
		description: 'List the Destinations connected to a Source',
	},
	'sources.listConnectedWarehouses': {
		riskLevel: 'read',
		description: 'List the Warehouses connected to a Source',
	},
	'sources.updateSchemaSettings': {
		riskLevel: 'write',
		description:
			"Change a Source's schema settings, such as allowing unplanned events or forwarding violations",
	},
	'sources.createWriteKey': {
		riskLevel: 'write',
		description:
			'Create a new write key for a Source and return the Source; the key is a credential that can send data to Segment',
	},
	'sources.removeWriteKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a write key from a Source; senders using it immediately fail',
	},
	'destinations.list': {
		riskLevel: 'read',
		description: 'List the Destinations connected in the Workspace',
	},
	'destinations.get': {
		riskLevel: 'read',
		description: 'Get one Destination by id',
	},
	'destinations.create': {
		riskLevel: 'write',
		description:
			'Create a Destination from a catalog metadata id, a source id and its settings; it starts receiving data once enabled',
	},
	'destinations.update': {
		riskLevel: 'write',
		description: 'Update a Destination name, enabled flag or settings',
	},
	'destinations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Destination permanently',
	},
	'warehouses.list': {
		riskLevel: 'read',
		description: 'List the Warehouses in the Workspace',
	},
	'warehouses.get': {
		riskLevel: 'read',
		description: 'Get one Warehouse by id',
	},
	'warehouses.getConnectionState': {
		riskLevel: 'read',
		description:
			"Read a Warehouse's current connection state: CONNECTED or FAILED",
	},
	'warehouses.listConnectedSources': {
		riskLevel: 'read',
		description: 'List the Sources connected to a Warehouse',
	},
	'warehouses.validate': {
		riskLevel: 'read',
		description:
			'Check a set of Warehouse credentials by attempting to connect; synchronous, answers CONNECTED or FAILED',
	},
	'warehouses.create': {
		riskLevel: 'write',
		description:
			'Create a Warehouse from a catalog metadata id and its connection settings',
	},
	'warehouses.update': {
		riskLevel: 'write',
		description:
			'Update a Warehouse name, enabled flag or settings; the API requires settings on every call',
	},
	'warehouses.addSourceConnection': {
		riskLevel: 'write',
		description: 'Connect a Source to a Warehouse so its data loads there',
	},
	'warehouses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Warehouse permanently',
	},
	'warehouses.removeSourceConnection': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Disconnect a Source from a Warehouse',
	},
	'trackingPlans.list': {
		riskLevel: 'read',
		description: 'List the Tracking Plans in the Workspace, optionally by type',
	},
	'trackingPlans.get': {
		riskLevel: 'read',
		description: 'Get one Tracking Plan by id',
	},
	'trackingPlans.listRules': {
		riskLevel: 'read',
		description: "List a Tracking Plan's event and trait rules",
	},
	'trackingPlans.listSources': {
		riskLevel: 'read',
		description: 'List the Sources connected to a Tracking Plan',
	},
	'trackingPlans.create': {
		riskLevel: 'write',
		description: 'Create a Tracking Plan with a name and a type',
	},
	'trackingPlans.update': {
		riskLevel: 'write',
		description: 'Rename a Tracking Plan or change its description',
	},
	'trackingPlans.replaceRules': {
		riskLevel: 'write',
		description:
			"Replace a Tracking Plan's whole rule set; rules absent from the array are removed",
	},
	'trackingPlans.addSource': {
		riskLevel: 'write',
		description:
			'Connect a Source to a Tracking Plan so its events are enforced',
	},
	'trackingPlans.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Tracking Plan permanently',
	},
	'trackingPlans.removeSource': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Disconnect a Source from a Tracking Plan',
	},
	'functions.list': {
		riskLevel: 'read',
		description: 'List Functions of one resource type in the Workspace',
	},
	'functions.get': {
		riskLevel: 'read',
		description: 'Get one Function by id, including its code',
	},
	'functions.listVersions': {
		riskLevel: 'read',
		description: "List a Function's saved versions",
	},
	'functions.getVersion': {
		riskLevel: 'read',
		description: 'Get one saved version of a Function',
	},
	'functions.create': {
		riskLevel: 'write',
		description:
			'Create a Function from JavaScript code, a name and a resource type',
	},
	'functions.update': {
		riskLevel: 'write',
		description:
			"Update a Function's code or metadata; the new code runs after the next deploy",
	},
	'functions.deploy': {
		riskLevel: 'write',
		description:
			'Deploy a Function: its latest saved code goes live for the resources using it',
	},
	'functions.restoreVersion': {
		riskLevel: 'write',
		description: "Restore a Function's code to a saved version",
	},
	'functions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Function permanently',
	},
	'catalog.listDestinations': {
		riskLevel: 'read',
		description:
			'List the Destination catalog; each item holds the settings its instances need',
	},
	'catalog.getDestination': {
		riskLevel: 'read',
		description:
			'Get one Destination catalog item; its id is the metadataId destinations.create needs',
	},
	'catalog.listSources': {
		riskLevel: 'read',
		description:
			'List the Source catalog; each item holds the settings its instances need',
	},
	'catalog.getSource': {
		riskLevel: 'read',
		description:
			'Get one Source catalog item; its id is the metadataId sources.create needs',
	},
	'regulations.list': {
		riskLevel: 'read',
		description:
			'List the Workspace deletion and suppression runs and their statuses',
	},
	'regulations.create': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Start a deletion or suppression run that permanently removes the named users data from Segment and downstream systems; cannot be cancelled or undone',
		job: REGULATION_JOB,
	},
	'regulations.get': {
		riskLevel: 'read',
		description: 'Read one deletion or suppression run and its status',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof segmentEndpointsNested>;

export type BaseSegmentPlugin<T extends SegmentPluginOptions> = CorsairPlugin<
	'segment',
	typeof SegmentSchema,
	typeof segmentEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSegmentPlugin = BaseSegmentPlugin<SegmentPluginOptions>;

export type ExternalSegmentPlugin<T extends SegmentPluginOptions> =
	BaseSegmentPlugin<T>;

export function segment<const T extends SegmentPluginOptions>(
	incomingOptions: SegmentPluginOptions & T = {} as SegmentPluginOptions & T,
): ExternalSegmentPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'segment',
		schema: SegmentSchema,
		options: options,
		hooks: options.hooks,
		endpoints: segmentEndpointsNested,
		webhooks: {},
		endpointMeta: segmentEndpointMeta,
		endpointSchemas: segmentEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SegmentKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('segment', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSegmentPlugin;
}

export { SegmentAPIError } from './client';
export type {
	SegmentDestination,
	SegmentDestinationMetadata,
	SegmentEndpointInputs,
	SegmentEndpointOutputs,
	SegmentFunction,
	SegmentPagination,
	SegmentPaginationOutput,
	SegmentRegulation,
	SegmentRule,
	SegmentSource,
	SegmentSourceMetadata,
	SegmentTrackingPlan,
	SegmentWarehouse,
	SegmentWorkspace,
} from './endpoints/types';
export {
	SEGMENT_FUNCTION_RESOURCE_TYPES,
	SEGMENT_REGULATION_STATUSES,
	SEGMENT_REGULATION_TYPES,
	SEGMENT_TRACKING_PLAN_TYPES,
} from './endpoints/types';
