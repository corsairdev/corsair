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

import { Maps, Routing, Search, Traffic, Transit, Weather } from './endpoints';

import type {
	HereEndpointInputs,
	HereEndpointOutputs,
} from './endpoints/types';

import {
	HereEndpointInputSchemas,
	HereEndpointOutputSchemas,
} from './endpoints/types';

import { errorHandlers } from './error-handlers';

import { HereSchema } from './schema';

export type HerePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHerePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hereEndpointsNested>;
};

export type HereContext = CorsairPluginContext<
	typeof HereSchema,
	HerePluginOptions
>;

export type HereKeyBuilderContext = KeyBuilderContext<HerePluginOptions>;

export type HereBoundEndpoints = BindEndpoints<typeof hereEndpointsNested>;

type HereEndpoint<K extends keyof HereEndpointOutputs> = CorsairEndpoint<
	HereContext,
	HereEndpointInputs[K],
	HereEndpointOutputs[K]
>;

export type HereEndpoints = {
	[K in keyof HereEndpointOutputs]: HereEndpoint<K>;
};

const hereEndpointsNested = {
	search: {
		autosuggest: Search.autosuggest,
		autocomplete: Search.autocomplete,
		browse: Search.browse,
		discover: Search.discover,
		geocode: Search.geocode,
		reverseGeocode: Search.reverseGeocode,
		lookup: Search.lookup,
	},
	routing: {
		getRoutes: Routing.getRoutes,
		postRoutes: Routing.postRoutes,
		getIsolines: Routing.getIsolines,
		computeMatrix: Routing.computeMatrix,
		getMatrixResult: Routing.getMatrixResult,
		listMatrixProfiles: Routing.listMatrixProfiles,
		getMatrixProfile: Routing.getMatrixProfile,
		decodeRouteHandle: Routing.decodeRouteHandle,
		findWaypointSequence: Routing.findWaypointSequence,
	},
	weather: {
		getWeatherObservation: Weather.getWeatherObservation,
		getWeatherForecastDaily: Weather.getWeatherForecastDaily,
		getWeatherForecastHourly: Weather.getWeatherForecastHourly,
		getAstronomyForecast: Weather.getAstronomyForecast,
		getWeatherAlerts: Weather.getWeatherAlerts,
	},
	traffic: {
		getTrafficFlow: Traffic.getTrafficFlow,
		getTrafficIncidents: Traffic.getTrafficIncidents,
		getIncidentById: Traffic.getIncidentById,
	},
	transit: {
		getStations: Transit.getStations,
		getDepartures: Transit.getDepartures,
	},
	maps: {
		getMapImage: Maps.getMapImage,
		coordinatesToTileIndices: Maps.coordinatesToTileIndices,
	},
} as const;

export const hereEndpointSchemas = {
	'search.autosuggest': {
		input: HereEndpointInputSchemas.autosuggest,
		output: HereEndpointOutputSchemas.autosuggest,
	},
	'search.autocomplete': {
		input: HereEndpointInputSchemas.autocomplete,
		output: HereEndpointOutputSchemas.autocomplete,
	},
	'search.browse': {
		input: HereEndpointInputSchemas.browse,
		output: HereEndpointOutputSchemas.browse,
	},
	'search.discover': {
		input: HereEndpointInputSchemas.discover,
		output: HereEndpointOutputSchemas.discover,
	},
	'search.geocode': {
		input: HereEndpointInputSchemas.geocode,
		output: HereEndpointOutputSchemas.geocode,
	},
	'search.reverseGeocode': {
		input: HereEndpointInputSchemas.reverseGeocode,
		output: HereEndpointOutputSchemas.reverseGeocode,
	},
	'search.lookup': {
		input: HereEndpointInputSchemas.lookup,
		output: HereEndpointOutputSchemas.lookup,
	},
	'routing.getRoutes': {
		input: HereEndpointInputSchemas.getRoutes,
		output: HereEndpointOutputSchemas.getRoutes,
	},
	'routing.postRoutes': {
		input: HereEndpointInputSchemas.postRoutes,
		output: HereEndpointOutputSchemas.postRoutes,
	},
	'routing.getIsolines': {
		input: HereEndpointInputSchemas.getIsolines,
		output: HereEndpointOutputSchemas.getIsolines,
	},
	'routing.computeMatrix': {
		input: HereEndpointInputSchemas.computeMatrix,
		output: HereEndpointOutputSchemas.computeMatrix,
	},
	'routing.getMatrixResult': {
		input: HereEndpointInputSchemas.getMatrixResult,
		output: HereEndpointOutputSchemas.getMatrixResult,
	},
	'routing.listMatrixProfiles': {
		input: HereEndpointInputSchemas.listMatrixProfiles,
		output: HereEndpointOutputSchemas.listMatrixProfiles,
	},
	'routing.getMatrixProfile': {
		input: HereEndpointInputSchemas.getMatrixProfile,
		output: HereEndpointOutputSchemas.getMatrixProfile,
	},
	'routing.decodeRouteHandle': {
		input: HereEndpointInputSchemas.decodeRouteHandle,
		output: HereEndpointOutputSchemas.decodeRouteHandle,
	},
	'routing.findWaypointSequence': {
		input: HereEndpointInputSchemas.findWaypointSequence,
		output: HereEndpointOutputSchemas.findWaypointSequence,
	},
	'weather.getWeatherObservation': {
		input: HereEndpointInputSchemas.getWeatherObservation,
		output: HereEndpointOutputSchemas.getWeatherObservation,
	},
	'weather.getWeatherForecastDaily': {
		input: HereEndpointInputSchemas.getWeatherForecastDaily,
		output: HereEndpointOutputSchemas.getWeatherForecastDaily,
	},
	'weather.getWeatherForecastHourly': {
		input: HereEndpointInputSchemas.getWeatherForecastHourly,
		output: HereEndpointOutputSchemas.getWeatherForecastHourly,
	},
	'weather.getAstronomyForecast': {
		input: HereEndpointInputSchemas.getAstronomyForecast,
		output: HereEndpointOutputSchemas.getAstronomyForecast,
	},
	'weather.getWeatherAlerts': {
		input: HereEndpointInputSchemas.getWeatherAlerts,
		output: HereEndpointOutputSchemas.getWeatherAlerts,
	},
	'traffic.getTrafficFlow': {
		input: HereEndpointInputSchemas.getTrafficFlow,
		output: HereEndpointOutputSchemas.getTrafficFlow,
	},
	'traffic.getTrafficIncidents': {
		input: HereEndpointInputSchemas.getTrafficIncidents,
		output: HereEndpointOutputSchemas.getTrafficIncidents,
	},
	'traffic.getIncidentById': {
		input: HereEndpointInputSchemas.getIncidentById,
		output: HereEndpointOutputSchemas.getIncidentById,
	},
	'transit.getStations': {
		input: HereEndpointInputSchemas.getStations,
		output: HereEndpointOutputSchemas.getStations,
	},
	'transit.getDepartures': {
		input: HereEndpointInputSchemas.getDepartures,
		output: HereEndpointOutputSchemas.getDepartures,
	},
	'maps.getMapImage': {
		input: HereEndpointInputSchemas.getMapImage,
		output: HereEndpointOutputSchemas.getMapImage,
	},
	'maps.coordinatesToTileIndices': {
		input: HereEndpointInputSchemas.coordinatesToTileIndices,
		output: HereEndpointOutputSchemas.coordinatesToTileIndices,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof hereEndpointsNested>;

const hereEndpointMeta = {
	'search.autosuggest': {
		riskLevel: 'read',
		description:
			'Fetch typeahead completions for a partial search term near a location.',
	},
	'search.autocomplete': {
		riskLevel: 'read',
		description: 'Get address-focused completions for a partial address query.',
	},
	'search.browse': {
		riskLevel: 'read',
		description:
			'Search nearby places with optional category, food type, or name filters.',
	},
	'search.discover': {
		riskLevel: 'read',
		description:
			'Discover places and addresses from free-form text near a location.',
	},
	'search.geocode': {
		riskLevel: 'read',
		description: 'Convert a free-text or qualified address into coordinates.',
	},
	'search.reverseGeocode': {
		riskLevel: 'read',
		description: 'Convert lat,lng coordinates into a structured address.',
	},
	'search.lookup': {
		riskLevel: 'read',
		description: 'Load full place or address details by HERE id.',
	},
	'routing.getRoutes': {
		riskLevel: 'read',
		description:
			'Calculate routes between waypoints for car, truck, pedestrian, bicycle, scooter, taxi, or bus.',
	},
	'routing.postRoutes': {
		riskLevel: 'read',
		description:
			'Calculate routes via POST when avoid areas, EV options, or large bodies are required.',
	},
	'routing.getIsolines': {
		riskLevel: 'read',
		description:
			'Calculate reachable-area isolines by time, distance, or consumption.',
	},
	'routing.computeMatrix': {
		riskLevel: 'read',
		description:
			'Compute a travel-time and distance matrix between origins and destinations.',
	},
	'routing.getMatrixResult': {
		riskLevel: 'read',
		description: 'Fetch a completed matrix calculation by matrixId.',
	},
	'routing.listMatrixProfiles': {
		riskLevel: 'read',
		description: 'List predefined matrix routing profiles.',
	},
	'routing.getMatrixProfile': {
		riskLevel: 'read',
		description: 'Retrieve one matrix routing profile by id.',
	},
	'routing.decodeRouteHandle': {
		riskLevel: 'read',
		description: 'Decode a previously calculated Routing v8 route handle.',
	},
	'routing.findWaypointSequence': {
		riskLevel: 'read',
		description:
			'Optimize waypoint visit order between a fixed start and destination.',
	},
	'weather.getWeatherObservation': {
		riskLevel: 'read',
		description: 'Get current weather observations for a location.',
	},
	'weather.getWeatherForecastDaily': {
		riskLevel: 'read',
		description: 'Get a 7-day weather forecast (detailed or simple).',
	},
	'weather.getWeatherForecastHourly': {
		riskLevel: 'read',
		description: 'Get hourly weather forecasts for a location.',
	},
	'weather.getAstronomyForecast': {
		riskLevel: 'read',
		description: 'Get sunrise, sunset, and moon event times.',
	},
	'weather.getWeatherAlerts': {
		riskLevel: 'read',
		description: 'Get severe weather alerts for a location.',
	},
	'traffic.getTrafficFlow': {
		riskLevel: 'read',
		description: 'Get real-time traffic flow for a geospatial area.',
	},
	'traffic.getTrafficIncidents': {
		riskLevel: 'read',
		description: 'Get real-time traffic incidents for a geospatial area.',
	},
	'traffic.getIncidentById': {
		riskLevel: 'read',
		description: 'Get one traffic incident by id.',
	},
	'transit.getStations': {
		riskLevel: 'read',
		description: 'Search public transit stations around a location.',
	},
	'transit.getDepartures': {
		riskLevel: 'read',
		description: 'Get upcoming departures by station id or location.',
	},
	'maps.getMapImage': {
		riskLevel: 'read',
		description: 'Retrieve a static Map Image API v3 PNG or JPEG.',
	},
	'maps.coordinatesToTileIndices': {
		riskLevel: 'read',
		description:
			'Convert lat,lng to Web Mercator XYZ tile indices at a zoom level.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hereEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const hereAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHerePlugin<T extends HerePluginOptions> = CorsairPlugin<
	'here',
	typeof HereSchema,
	typeof hereEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalHerePlugin = BaseHerePlugin<HerePluginOptions>;

export type ExternalHerePlugin<T extends HerePluginOptions> = BaseHerePlugin<T>;

export function here<const T extends HerePluginOptions>(
	incomingOptions: HerePluginOptions & T = {} as HerePluginOptions & T,
): ExternalHerePlugin<T> {
	const options: HerePluginOptions & T = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'here',
		authConfig: hereAuthConfig,
		schema: HereSchema,
		options,
		hooks: options.hooks,
		endpoints: hereEndpointsNested,
		endpointMeta: hereEndpointMeta,
		endpointSchemas: hereEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HereKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('here', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('here', 'api_key');
		},
	} satisfies InternalHerePlugin;
}

export type {
	HereEndpointInputs,
	HereEndpointOutputs,
} from './endpoints/types';
