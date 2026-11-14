import type {
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
	Collections,
	Datasets,
	Events,
	Queries,
	SavedQueries,
} from './endpoints';
import type {
	KeenEndpointInputs,
	KeenEndpointOutputs,
} from './endpoints/types';
import {
	KeenEndpointInputSchemas,
	KeenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KeenSchema } from './schema';

export type KeenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The Keen project ID, which is part of every request path. Falls back to
	 * the stored credential.
	 */
	projectId?: string;
	hooks?: InternalKeenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof keenEndpointsNested>;
};

/**
 * The project ID is an account-level field beside the key, so the key manager
 * generates `get_project_id()` for it. `get_integration_credentials` is only
 * installed for `oauth_2`, so the pair has to live on the account.
 */
export const keenAuthConfig = {
	api_key: {
		account: ['project_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KeenContext = CorsairPluginContext<
	typeof KeenSchema,
	KeenPluginOptions,
	undefined,
	typeof keenAuthConfig
>;

export type KeenKeyBuilderContext = KeyBuilderContext<
	KeenPluginOptions,
	typeof keenAuthConfig
>;

export type KeenBoundEndpoints = BindEndpoints<typeof keenEndpointsNested>;

type KeenEndpoint<K extends keyof KeenEndpointOutputs> = CorsairEndpoint<
	KeenContext,
	KeenEndpointInputs[K],
	KeenEndpointOutputs[K]
>;

export type KeenEndpoints = {
	eventsRecord: KeenEndpoint<'eventsRecord'>;
	eventsRecordMany: KeenEndpoint<'eventsRecordMany'>;
	collectionsList: KeenEndpoint<'collectionsList'>;
	collectionsGet: KeenEndpoint<'collectionsGet'>;
	propertiesGet: KeenEndpoint<'propertiesGet'>;
	queriesRun: KeenEndpoint<'queriesRun'>;
	queriesMultiAnalysis: KeenEndpoint<'queriesMultiAnalysis'>;
	savedQueriesList: KeenEndpoint<'savedQueriesList'>;
	savedQueriesGet: KeenEndpoint<'savedQueriesGet'>;
	savedQueriesCreate: KeenEndpoint<'savedQueriesCreate'>;
	savedQueriesResult: KeenEndpoint<'savedQueriesResult'>;
	savedQueriesRemove: KeenEndpoint<'savedQueriesRemove'>;
	datasetsList: KeenEndpoint<'datasetsList'>;
	datasetsGet: KeenEndpoint<'datasetsGet'>;
	datasetsResult: KeenEndpoint<'datasetsResult'>;
	datasetsRemove: KeenEndpoint<'datasetsRemove'>;
};

const keenEndpointsNested = {
	events: {
		record: Events.record,
		recordMany: Events.recordMany,
	},
	collections: {
		list: Collections.list,
		get: Collections.get,
	},
	properties: {
		get: Collections.property,
	},
	queries: {
		run: Queries.run,
		multiAnalysis: Queries.multiAnalysis,
	},
	savedQueries: {
		list: SavedQueries.list,
		get: SavedQueries.get,
		create: SavedQueries.create,
		result: SavedQueries.result,
		delete: SavedQueries.remove,
	},
	datasets: {
		list: Datasets.list,
		get: Datasets.get,
		result: Datasets.result,
		delete: Datasets.remove,
	},
} as const;

export const keenEndpointSchemas = {
	'events.record': {
		input: KeenEndpointInputSchemas.eventsRecord,
		output: KeenEndpointOutputSchemas.eventsRecord,
	},
	'events.recordMany': {
		input: KeenEndpointInputSchemas.eventsRecordMany,
		output: KeenEndpointOutputSchemas.eventsRecordMany,
	},
	'collections.list': {
		input: KeenEndpointInputSchemas.collectionsList,
		output: KeenEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: KeenEndpointInputSchemas.collectionsGet,
		output: KeenEndpointOutputSchemas.collectionsGet,
	},
	'properties.get': {
		input: KeenEndpointInputSchemas.propertiesGet,
		output: KeenEndpointOutputSchemas.propertiesGet,
	},
	'queries.run': {
		input: KeenEndpointInputSchemas.queriesRun,
		output: KeenEndpointOutputSchemas.queriesRun,
	},
	'queries.multiAnalysis': {
		input: KeenEndpointInputSchemas.queriesMultiAnalysis,
		output: KeenEndpointOutputSchemas.queriesMultiAnalysis,
	},
	'savedQueries.list': {
		input: KeenEndpointInputSchemas.savedQueriesList,
		output: KeenEndpointOutputSchemas.savedQueriesList,
	},
	'savedQueries.get': {
		input: KeenEndpointInputSchemas.savedQueriesGet,
		output: KeenEndpointOutputSchemas.savedQueriesGet,
	},
	'savedQueries.create': {
		input: KeenEndpointInputSchemas.savedQueriesCreate,
		output: KeenEndpointOutputSchemas.savedQueriesCreate,
	},
	'savedQueries.result': {
		input: KeenEndpointInputSchemas.savedQueriesResult,
		output: KeenEndpointOutputSchemas.savedQueriesResult,
	},
	'savedQueries.delete': {
		input: KeenEndpointInputSchemas.savedQueriesRemove,
		output: KeenEndpointOutputSchemas.savedQueriesRemove,
	},
	'datasets.list': {
		input: KeenEndpointInputSchemas.datasetsList,
		output: KeenEndpointOutputSchemas.datasetsList,
	},
	'datasets.get': {
		input: KeenEndpointInputSchemas.datasetsGet,
		output: KeenEndpointOutputSchemas.datasetsGet,
	},
	'datasets.result': {
		input: KeenEndpointInputSchemas.datasetsResult,
		output: KeenEndpointOutputSchemas.datasetsResult,
	},
	'datasets.delete': {
		input: KeenEndpointInputSchemas.datasetsRemove,
		output: KeenEndpointOutputSchemas.datasetsRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof keenEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const keenEndpointMeta = {
	'events.record': {
		riskLevel: 'write',
		description:
			'Record one event in a collection; Keen answers `created` and takes up to 10 seconds to make it queryable',
	},
	'events.recordMany': {
		riskLevel: 'write',
		description:
			'Record events across one or more collections in one request, with a result per event. Keen recommends batches of 5,000 or less',
	},
	'collections.list': {
		riskLevel: 'read',
		description:
			'Every event collection on the project, with its properties and types',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'One collection’s property names and their inferred types',
	},
	'properties.get': {
		riskLevel: 'read',
		description:
			'The type Keen inferred for one property, such as `num` or `string`',
	},
	'queries.run': {
		riskLevel: 'read',
		description:
			'Run one analysis (`count`, `sum`, `average`, `count_unique`, `percentile` and the rest) over a collection, with filters, grouping and intervals',
	},
	'queries.multiAnalysis': {
		riskLevel: 'read',
		description:
			'Run up to 10 analyses over one collection in one request, each under its own label',
	},
	'savedQueries.list': {
		riskLevel: 'read',
		description:
			'Every saved query on the project, with its definition and refresh rate',
	},
	'savedQueries.get': {
		riskLevel: 'read',
		description: 'One saved query’s definition',
	},
	'savedQueries.create': {
		riskLevel: 'write',
		description:
			'Create or replace a saved query by name, with the refresh rate that caches its result',
	},
	'savedQueries.result': {
		riskLevel: 'read',
		description:
			'The cached result of a saved query, which is what makes a dashboard load instantly',
	},
	'savedQueries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a saved query and its cached result; it cannot be restored',
	},
	'datasets.list': {
		riskLevel: 'read',
		description:
			'Cached dataset definitions, paged by `after_name`; `next_after_name` carries the cursor',
	},
	'datasets.get': {
		riskLevel: 'read',
		description:
			'One cached dataset’s definition, including how far behind its computation is',
	},
	'datasets.result': {
		riskLevel: 'read',
		description:
			'A cached dataset’s computed rows, selected by the values of its `index_by` properties',
	},
	'datasets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a cached dataset and its computed rows; it cannot be restored',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof keenEndpointsNested>;

export type BaseKeenPlugin<T extends KeenPluginOptions> = CorsairPlugin<
	'keen',
	typeof KeenSchema,
	typeof keenEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof keenAuthConfig
>;

export type InternalKeenPlugin = BaseKeenPlugin<KeenPluginOptions>;

export type ExternalKeenPlugin<T extends KeenPluginOptions> = BaseKeenPlugin<T>;

export function keen<const T extends KeenPluginOptions>(
	incomingOptions: KeenPluginOptions & T = {} as KeenPluginOptions & T,
): ExternalKeenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'keen',
		schema: KeenSchema,
		options,
		hooks: options.hooks,
		endpoints: keenEndpointsNested,
		webhooks: {},
		authConfig: keenAuthConfig,
		endpointMeta: keenEndpointMeta,
		endpointSchemas: keenEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KeenKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('keen', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKeenPlugin;
}

export {
	isKeenAuthError,
	isKeenNotFound,
	isKeenQueryIncomplete,
	isKeenRateLimit,
	KeenAPIError,
	keenErrorCode,
	redactKeenKey,
} from './client';

export type {
	CollectionGetResponse,
	CollectionsGetInput,
	CollectionsListInput,
	CollectionsListResponse,
	DatasetGetInput,
	DatasetGetResponse,
	DatasetRemoveInput,
	DatasetResultInput,
	DatasetResultResponse,
	DatasetsListInput,
	DatasetsListResponse,
	DeletedResponse,
	EventsRecordInput,
	EventsRecordManyInput,
	EventsRecordManyResponse,
	EventsRecordResponse,
	KeenAnalysisInput,
	KeenCollection,
	KeenDataset,
	KeenSavedQuery,
	PropertiesGetInput,
	PropertyGetResponse,
	QueriesMultiAnalysisInput,
	QueriesMultiAnalysisResponse,
	QueriesRunInput,
	QueriesRunResponse,
	SavedQueriesListInput,
	SavedQueriesListResponse,
	SavedQueryCreateInput,
	SavedQueryGetInput,
	SavedQueryRemoveInput,
	SavedQueryResponse,
	SavedQueryResultInput,
	SavedQueryResultResponse,
} from './endpoints/types';
