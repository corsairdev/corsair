import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Directions,
	Geocoding,
	Isochrone,
	Matrix,
	Tilequery,
	Trips,
} from './endpoints';
import type {
	MapboxEndpointInputs,
	MapboxEndpointOutputs,
} from './endpoints/types';
import {
	MapboxEndpointInputSchemas,
	MapboxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MapboxSchema } from './schema';

export type MapboxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMapboxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mapboxEndpointsNested>;
};

export type MapboxContext = CorsairPluginContext<
	typeof MapboxSchema,
	MapboxPluginOptions
>;

export type MapboxKeyBuilderContext = KeyBuilderContext<MapboxPluginOptions>;

export type MapboxBoundEndpoints = BindEndpoints<typeof mapboxEndpointsNested>;

type MapboxEndpoint<K extends keyof MapboxEndpointOutputs> = CorsairEndpoint<
	MapboxContext,
	MapboxEndpointInputs[K],
	MapboxEndpointOutputs[K]
>;

export type MapboxEndpoints = {
	geocodingForward: MapboxEndpoint<'geocodingForward'>;
	geocodingReverse: MapboxEndpoint<'geocodingReverse'>;
	directionsRoute: MapboxEndpoint<'directionsRoute'>;
	matrixCalculate: MapboxEndpoint<'matrixCalculate'>;
	isochroneGet: MapboxEndpoint<'isochroneGet'>;
	tilequeryQuery: MapboxEndpoint<'tilequeryQuery'>;
	tripsOptimize: MapboxEndpoint<'tripsOptimize'>;
};

const mapboxEndpointsNested = {
	geocoding: {
		forward: Geocoding.forward,
		reverse: Geocoding.reverse,
	},
	directions: {
		route: Directions.route,
	},
	matrix: {
		calculate: Matrix.calculate,
	},
	isochrone: {
		get: Isochrone.get,
	},
	tilequery: {
		query: Tilequery.query,
	},
	trips: {
		optimize: Trips.optimize,
	},
} as const;

export const mapboxEndpointSchemas = {
	'geocoding.forward': {
		input: MapboxEndpointInputSchemas.geocodingForward,
		output: MapboxEndpointOutputSchemas.geocodingForward,
	},
	'geocoding.reverse': {
		input: MapboxEndpointInputSchemas.geocodingReverse,
		output: MapboxEndpointOutputSchemas.geocodingReverse,
	},
	'directions.route': {
		input: MapboxEndpointInputSchemas.directionsRoute,
		output: MapboxEndpointOutputSchemas.directionsRoute,
	},
	'matrix.calculate': {
		input: MapboxEndpointInputSchemas.matrixCalculate,
		output: MapboxEndpointOutputSchemas.matrixCalculate,
	},
	'isochrone.get': {
		input: MapboxEndpointInputSchemas.isochroneGet,
		output: MapboxEndpointOutputSchemas.isochroneGet,
	},
	'tilequery.query': {
		input: MapboxEndpointInputSchemas.tilequeryQuery,
		output: MapboxEndpointOutputSchemas.tilequeryQuery,
	},
	'trips.optimize': {
		input: MapboxEndpointInputSchemas.tripsOptimize,
		output: MapboxEndpointOutputSchemas.tripsOptimize,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mapboxEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// Every operation is a GET that changes nothing on Mapbox.
const mapboxEndpointMeta = {
	'geocoding.forward': {
		riskLevel: 'read',
		description:
			'Turn an address or place name into coordinates and structured address context; a query with no match returns an empty features list',
	},
	'geocoding.reverse': {
		riskLevel: 'read',
		description:
			'Turn a longitude and latitude into the address, place or other features at that point',
	},
	'directions.route': {
		riskLevel: 'read',
		description:
			'Get a route between 2 to 25 waypoints for driving, driving with traffic, walking or cycling, with optional steps, annotations and alternatives; throws when Mapbox finds no route',
	},
	'matrix.calculate': {
		riskLevel: 'read',
		description:
			'Get travel times, distances or both between up to 25 points (10 with traffic), as a sources by destinations table',
	},
	'isochrone.get': {
		riskLevel: 'read',
		description:
			'Get the area reachable from a point within up to four travel times or distances, as GeoJSON lines or polygons',
	},
	'tilequery.query': {
		riskLevel: 'read',
		description:
			'List the features of one or more vector tilesets at or near a point, nearest first',
	},
	'trips.optimize': {
		riskLevel: 'read',
		description:
			'Find the fastest order to visit 2 to 12 stops (Optimization v1, answered immediately); throws on NoSegment or an unsupported roundtrip/source/destination combination',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mapboxEndpointsNested>;

export type BaseMapboxPlugin<T extends MapboxPluginOptions> = CorsairPlugin<
	'mapbox',
	typeof MapboxSchema,
	typeof mapboxEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMapboxPlugin = BaseMapboxPlugin<MapboxPluginOptions>;

export type ExternalMapboxPlugin<T extends MapboxPluginOptions> =
	BaseMapboxPlugin<T>;

export function mapbox<const T extends MapboxPluginOptions>(
	incomingOptions: MapboxPluginOptions & T = {} as MapboxPluginOptions & T,
): ExternalMapboxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mapbox',
		schema: MapboxSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mapboxEndpointsNested,
		webhooks: {},
		endpointMeta: mapboxEndpointMeta,
		endpointSchemas: mapboxEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MapboxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('mapbox', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMapboxPlugin;
}

export { MapboxAPIError } from './client';

export type {
	DirectionsRouteInput,
	DirectionsRouteResponse,
	GeocodingFeature,
	GeocodingForwardInput,
	GeocodingResponse,
	GeocodingReverseInput,
	IsochroneGetInput,
	IsochroneGetResponse,
	MapboxCoordinate,
	MapboxEndpointInputs,
	MapboxEndpointOutputs,
	MatrixCalculateInput,
	MatrixCalculateResponse,
	TilequeryQueryInput,
	TilequeryQueryResponse,
	TripsOptimizeInput,
	TripsOptimizeResponse,
} from './endpoints/types';
