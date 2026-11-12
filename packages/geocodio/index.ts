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
	batchGeocode,
	batchReverse,
	distance,
	distanceMatrix,
	forwardGeocode,
	jobDelete,
	jobGet,
	jobsList,
	listDelete,
	listGet,
	listsAll,
	parse,
	reverseGeocode,
} from './endpoints';
import type {
	GeocodioEndpointInputs,
	GeocodioEndpointOutputs,
} from './endpoints/types';
import {
	GeocodioEndpointInputSchemas,
	GeocodioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GeocodioSchema } from './schema';

export type GeocodioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Geocodio API key. */
	key?: string;
	hooks?: InternalGeocodioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof geocodioEndpointsNested>;
};

export type GeocodioContext = CorsairPluginContext<
	typeof GeocodioSchema,
	GeocodioPluginOptions
>;

export type GeocodioKeyBuilderContext =
	KeyBuilderContext<GeocodioPluginOptions>;

export type GeocodioBoundEndpoints = BindEndpoints<
	typeof geocodioEndpointsNested
>;

type GeocodioEndpoint<K extends keyof GeocodioEndpointOutputs> =
	CorsairEndpoint<
		GeocodioContext,
		GeocodioEndpointInputs[K],
		GeocodioEndpointOutputs[K]
	>;

export type GeocodioEndpoints = {
	geocode: {
		forward: GeocodioEndpoint<'forwardGeocode'>;
		reverse: GeocodioEndpoint<'reverseGeocode'>;
		batch: GeocodioEndpoint<'batchGeocode'>;
		batchReverse: GeocodioEndpoint<'batchReverse'>;
		parse: GeocodioEndpoint<'parse'>;
	};
	distance: {
		fromOrigin: GeocodioEndpoint<'distance'>;
		matrix: GeocodioEndpoint<'distanceMatrix'>;
	};
	jobs: {
		list: GeocodioEndpoint<'jobsList'>;
		get: GeocodioEndpoint<'jobGet'>;
		delete: GeocodioEndpoint<'jobDelete'>;
	};
	lists: {
		all: GeocodioEndpoint<'listsAll'>;
		get: GeocodioEndpoint<'listGet'>;
		delete: GeocodioEndpoint<'listDelete'>;
	};
};

const geocodioEndpointsNested = {
	geocode: {
		forward: forwardGeocode,
		reverse: reverseGeocode,
		batch: batchGeocode,
		batchReverse,
		parse,
	},
	distance: {
		fromOrigin: distance,
		matrix: distanceMatrix,
	},
	jobs: {
		list: jobsList,
		get: jobGet,
		delete: jobDelete,
	},
	lists: {
		all: listsAll,
		get: listGet,
		delete: listDelete,
	},
} as const;

export const geocodioEndpointSchemas = {
	'geocode.forward': {
		input: GeocodioEndpointInputSchemas.forwardGeocode,
		output: GeocodioEndpointOutputSchemas.forwardGeocode,
	},
	'geocode.reverse': {
		input: GeocodioEndpointInputSchemas.reverseGeocode,
		output: GeocodioEndpointOutputSchemas.reverseGeocode,
	},
	'geocode.batch': {
		input: GeocodioEndpointInputSchemas.batchGeocode,
		output: GeocodioEndpointOutputSchemas.batchGeocode,
	},
	'geocode.batchReverse': {
		input: GeocodioEndpointInputSchemas.batchReverse,
		output: GeocodioEndpointOutputSchemas.batchReverse,
	},
	'geocode.parse': {
		input: GeocodioEndpointInputSchemas.parse,
		output: GeocodioEndpointOutputSchemas.parse,
	},
	'distance.fromOrigin': {
		input: GeocodioEndpointInputSchemas.distance,
		output: GeocodioEndpointOutputSchemas.distance,
	},
	'distance.matrix': {
		input: GeocodioEndpointInputSchemas.distanceMatrix,
		output: GeocodioEndpointOutputSchemas.distanceMatrix,
	},
	'jobs.list': {
		input: GeocodioEndpointInputSchemas.jobsList,
		output: GeocodioEndpointOutputSchemas.jobsList,
	},
	'jobs.get': {
		input: GeocodioEndpointInputSchemas.jobGet,
		output: GeocodioEndpointOutputSchemas.jobGet,
	},
	'jobs.delete': {
		input: GeocodioEndpointInputSchemas.jobDelete,
		output: GeocodioEndpointOutputSchemas.jobDelete,
	},
	'lists.all': {
		input: GeocodioEndpointInputSchemas.listsAll,
		output: GeocodioEndpointOutputSchemas.listsAll,
	},
	'lists.get': {
		input: GeocodioEndpointInputSchemas.listGet,
		output: GeocodioEndpointOutputSchemas.listGet,
	},
	'lists.delete': {
		input: GeocodioEndpointInputSchemas.listDelete,
		output: GeocodioEndpointOutputSchemas.listDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof geocodioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const geocodioEndpointMeta = {
	'geocode.forward': {
		riskLevel: 'read',
		description:
			'Turn an address into coordinates, with a confidence score, the accuracy type that says how the match was made, and the parsed components. Data appends such as timezone or congressional district come back under `fields`',
	},
	'geocode.reverse': {
		riskLevel: 'read',
		description:
			'Turn a latitude and longitude into the nearest address, with the same confidence and components a forward lookup returns',
	},
	'geocode.batch': {
		riskLevel: 'read',
		description:
			'Geocode up to 10,000 addresses in one request, answered in the order they were sent',
	},
	'geocode.batchReverse': {
		riskLevel: 'read',
		description:
			'Reverse geocode up to 10,000 coordinate pairs in one request, answered in the order they were sent',
	},
	'geocode.parse': {
		riskLevel: 'read',
		description:
			'Split an address into its components without geocoding it, so it costs no lookup',
	},
	'distance.fromOrigin': {
		riskLevel: 'read',
		description:
			'Measure driving or straight-line distance and duration from one origin to many destinations, optionally filtering and sorting by either',
	},
	'distance.matrix': {
		riskLevel: 'read',
		description:
			'Measure every origin against every destination, or pair each origin with one destination, in a single request',
	},
	'jobs.list': {
		riskLevel: 'read',
		description: 'List the asynchronous distance matrix jobs on the account',
	},
	'jobs.get': {
		riskLevel: 'read',
		description:
			'Read one distance job, whose status says whether its result is ready',
	},
	'jobs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a distance job and its stored result',
	},
	'lists.all': {
		riskLevel: 'read',
		description: 'List the uploaded spreadsheets and their processing status',
	},
	'lists.get': {
		riskLevel: 'read',
		description:
			'Read one spreadsheet list, whose status and download URL say when its results are ready',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an uploaded spreadsheet and its results',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof geocodioEndpointsNested>;

/**
 * Geocodio takes its key as the `api_key` query parameter. There is no keyless
 * mode, so a call with neither an option nor a stored key is refused here
 * rather than sent and rejected with a 403.
 */
export const geocodioAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGeocodioPlugin<T extends GeocodioPluginOptions> = CorsairPlugin<
	'geocodio',
	typeof GeocodioSchema,
	typeof geocodioEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof geocodioAuthConfig
>;

export type InternalGeocodioPlugin = BaseGeocodioPlugin<GeocodioPluginOptions>;

export type ExternalGeocodioPlugin<T extends GeocodioPluginOptions> =
	BaseGeocodioPlugin<T>;

export function geocodio<const T extends GeocodioPluginOptions>(
	incomingOptions: GeocodioPluginOptions & T = {} as GeocodioPluginOptions & T,
): ExternalGeocodioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'geocodio',
		schema: GeocodioSchema,
		options,
		hooks: options.hooks,
		endpoints: geocodioEndpointsNested,
		webhooks: {},
		authConfig: geocodioAuthConfig,
		endpointMeta: geocodioEndpointMeta,
		endpointSchemas: geocodioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GeocodioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			// There are no webhooks, and Geocodio has no keyless mode.
			throw new AuthMissingError('geocodio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGeocodioPlugin;
}

export { GeocodioAPIError } from './client';

export type {
	GeocodioAddressComponents,
	GeocodioBatchGeocodeInput,
	GeocodioBatchReverseInput,
	GeocodioDistanceCell,
	GeocodioDistanceInput,
	GeocodioDistanceMatrixInput,
	GeocodioDistanceMatrixResponse,
	GeocodioDistanceResponse,
	GeocodioEndpointInputs,
	GeocodioEndpointOutputs,
	GeocodioForwardGeocodeInput,
	GeocodioGeocodeResponse,
	GeocodioGeocodeResult,
	GeocodioJob,
	GeocodioJobDeleteInput,
	GeocodioJobGetInput,
	GeocodioJobListInput,
	GeocodioJobListResponse,
	GeocodioList,
	GeocodioListAllInput,
	GeocodioListDeleteInput,
	GeocodioListGetInput,
	GeocodioListResponse,
	GeocodioParseInput,
	GeocodioParseResponse,
	GeocodioReverseGeocodeInput,
} from './endpoints/types';
