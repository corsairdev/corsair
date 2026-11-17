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
	RoutingEndpoints,
	SearchEndpoints,
	TrafficEndpoints,
} from './endpoints';
import type {
	TomTomEndpointInputs,
	TomTomEndpointOutputs,
} from './endpoints/types';
import {
	TomTomEndpointInputSchemas,
	TomTomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TomTomSchema } from './schema';

export type TomTomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTomTomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tomtomEndpointsNested>;
};

export type TomTomContext = CorsairPluginContext<
	typeof TomTomSchema,
	TomTomPluginOptions
>;

export type TomTomKeyBuilderContext = KeyBuilderContext<TomTomPluginOptions>;

export type TomTomBoundEndpoints = BindEndpoints<typeof tomtomEndpointsNested>;

type TomTomEndpoint<K extends keyof TomTomEndpointOutputs> = CorsairEndpoint<
	TomTomContext,
	TomTomEndpointInputs[K],
	TomTomEndpointOutputs[K]
>;

export type TomTomEndpoints = {
	searchFuzzy: TomTomEndpoint<'fuzzySearch'>;
	searchGeocode: TomTomEndpoint<'geocode'>;
	searchReverseGeocode: TomTomEndpoint<'reverseGeocode'>;
	routingCalculate: TomTomEndpoint<'calculateRoute'>;
	trafficIncidents: TomTomEndpoint<'incidentDetails'>;
	trafficFlow: TomTomEndpoint<'trafficFlow'>;
	trafficTile: TomTomEndpoint<'trafficTile'>;
};

const tomtomEndpointsNested = {
	search: {
		fuzzy: SearchEndpoints.fuzzy,
		geocode: SearchEndpoints.geocode,
		reverseGeocode: SearchEndpoints.reverseGeocode,
	},
	routing: {
		calculate: RoutingEndpoints.calculate,
	},
	traffic: {
		incidents: TrafficEndpoints.incidents,
		flow: TrafficEndpoints.flow,
		tile: TrafficEndpoints.tile,
	},
} as const;

export const tomtomEndpointSchemas = {
	'search.fuzzy': {
		input: TomTomEndpointInputSchemas.fuzzySearch,
		output: TomTomEndpointOutputSchemas.fuzzySearch,
	},
	'search.geocode': {
		input: TomTomEndpointInputSchemas.geocode,
		output: TomTomEndpointOutputSchemas.geocode,
	},
	'search.reverseGeocode': {
		input: TomTomEndpointInputSchemas.reverseGeocode,
		output: TomTomEndpointOutputSchemas.reverseGeocode,
	},
	'routing.calculate': {
		input: TomTomEndpointInputSchemas.calculateRoute,
		output: TomTomEndpointOutputSchemas.calculateRoute,
	},
	'traffic.incidents': {
		input: TomTomEndpointInputSchemas.incidentDetails,
		output: TomTomEndpointOutputSchemas.incidentDetails,
	},
	'traffic.flow': {
		input: TomTomEndpointInputSchemas.trafficFlow,
		output: TomTomEndpointOutputSchemas.trafficFlow,
	},
	'traffic.tile': {
		input: TomTomEndpointInputSchemas.trafficTile,
		output: TomTomEndpointOutputSchemas.trafficTile,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tomtomEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const tomtomEndpointMeta = {
	'search.fuzzy': {
		riskLevel: 'read',
		description:
			'Search for places, addresses, streets and geography, with optional geo bias and country filters',
	},
	'search.geocode': {
		riskLevel: 'read',
		description: 'Turn an address into coordinates',
	},
	'search.reverseGeocode': {
		riskLevel: 'read',
		description: 'Turn coordinates into the nearest address',
	},
	'routing.calculate': {
		riskLevel: 'read',
		description:
			'Calculate a route between waypoints with travel mode, traffic and avoidance options; makes no booking',
	},
	'traffic.incidents': {
		riskLevel: 'read',
		description:
			'List live traffic incidents in a bounding box, with their delay and road numbers',
	},
	'traffic.flow': {
		riskLevel: 'read',
		description:
			'Read the current speed and free-flow speed on the road at a point',
	},
	'traffic.tile': {
		riskLevel: 'read',
		description: 'Fetch one traffic flow or incident map tile',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tomtomEndpointsNested>;

export type BaseTomTomPlugin<T extends TomTomPluginOptions> = CorsairPlugin<
	'tomtom',
	typeof TomTomSchema,
	typeof tomtomEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTomTomPlugin = BaseTomTomPlugin<TomTomPluginOptions>;

export type ExternalTomTomPlugin<T extends TomTomPluginOptions> =
	BaseTomTomPlugin<T>;

export function tomtom<const T extends TomTomPluginOptions>(
	incomingOptions: TomTomPluginOptions & T = {} as TomTomPluginOptions & T,
): ExternalTomTomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tomtom',
		schema: TomTomSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tomtomEndpointsNested,
		webhooks: {},
		endpointMeta: tomtomEndpointMeta,
		endpointSchemas: tomtomEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TomTomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('tomtom', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTomTomPlugin;
}

export { TomTomAPIError } from './client';

export type {
	CalculateRouteInput,
	FuzzySearchInput,
	GeocodeInput,
	IncidentDetailsInput,
	IncidentDetailsOutput,
	IncidentOutput,
	ReverseGeocodeInput,
	RouteOutput,
	SearchOutput,
	SearchResultOutput,
	TomTomEndpointInputs,
	TomTomEndpointOutputs,
	TrafficFlowInput,
	TrafficFlowOutput,
	TrafficTileInput,
} from './endpoints/types';
