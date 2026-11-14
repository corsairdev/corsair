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
	autocomplete,
	boundaries,
	elevation,
	forwardGeocode,
	ipGeolocation,
	isoline,
	placeDetails,
	placesSearch,
	postcodeList,
	postcodeSearch,
	reverseGeocode,
	routeMatrix,
	routing,
	timezone,
} from './endpoints';
import type {
	GeoapifyEndpointInputs,
	GeoapifyEndpointOutputs,
} from './endpoints/types';
import {
	GeoapifyEndpointInputSchemas,
	GeoapifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GeoapifySchema } from './schema';

export type GeoapifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Geoapify API key. */
	key?: string;
	hooks?: InternalGeoapifyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof geoapifyEndpointsNested>;
};

export type GeoapifyContext = CorsairPluginContext<
	typeof GeoapifySchema,
	GeoapifyPluginOptions
>;

export type GeoapifyKeyBuilderContext =
	KeyBuilderContext<GeoapifyPluginOptions>;

export type GeoapifyBoundEndpoints = BindEndpoints<
	typeof geoapifyEndpointsNested
>;

type GeoapifyEndpoint<K extends keyof GeoapifyEndpointOutputs> =
	CorsairEndpoint<
		GeoapifyContext,
		GeoapifyEndpointInputs[K],
		GeoapifyEndpointOutputs[K]
	>;

export type GeoapifyEndpoints = {
	geocode: {
		forward: GeoapifyEndpoint<'forwardGeocode'>;
		reverse: GeoapifyEndpoint<'reverseGeocode'>;
		autocomplete: GeoapifyEndpoint<'autocomplete'>;
	};
	places: {
		search: GeoapifyEndpoint<'placesSearch'>;
		details: GeoapifyEndpoint<'placeDetails'>;
	};
	routing: {
		route: GeoapifyEndpoint<'routing'>;
		isoline: GeoapifyEndpoint<'isoline'>;
		matrix: GeoapifyEndpoint<'routeMatrix'>;
	};
	geo: {
		ip: GeoapifyEndpoint<'ipGeolocation'>;
		timezone: GeoapifyEndpoint<'timezone'>;
		postcodeSearch: GeoapifyEndpoint<'postcodeSearch'>;
		postcodeList: GeoapifyEndpoint<'postcodeList'>;
		boundaries: GeoapifyEndpoint<'boundaries'>;
		elevation: GeoapifyEndpoint<'elevation'>;
	};
};

const geoapifyEndpointsNested = {
	geocode: {
		forward: forwardGeocode,
		reverse: reverseGeocode,
		autocomplete,
	},
	places: {
		search: placesSearch,
		details: placeDetails,
	},
	routing: {
		route: routing,
		isoline,
		matrix: routeMatrix,
	},
	geo: {
		ip: ipGeolocation,
		timezone,
		postcodeSearch,
		postcodeList,
		boundaries,
		elevation,
	},
} as const;

export const geoapifyEndpointSchemas = {
	'geocode.forward': {
		input: GeoapifyEndpointInputSchemas.forwardGeocode,
		output: GeoapifyEndpointOutputSchemas.forwardGeocode,
	},
	'geocode.reverse': {
		input: GeoapifyEndpointInputSchemas.reverseGeocode,
		output: GeoapifyEndpointOutputSchemas.reverseGeocode,
	},
	'geocode.autocomplete': {
		input: GeoapifyEndpointInputSchemas.autocomplete,
		output: GeoapifyEndpointOutputSchemas.autocomplete,
	},
	'places.search': {
		input: GeoapifyEndpointInputSchemas.placesSearch,
		output: GeoapifyEndpointOutputSchemas.placesSearch,
	},
	'places.details': {
		input: GeoapifyEndpointInputSchemas.placeDetails,
		output: GeoapifyEndpointOutputSchemas.placeDetails,
	},
	'routing.route': {
		input: GeoapifyEndpointInputSchemas.routing,
		output: GeoapifyEndpointOutputSchemas.routing,
	},
	'routing.isoline': {
		input: GeoapifyEndpointInputSchemas.isoline,
		output: GeoapifyEndpointOutputSchemas.isoline,
	},
	'routing.matrix': {
		input: GeoapifyEndpointInputSchemas.routeMatrix,
		output: GeoapifyEndpointOutputSchemas.routeMatrix,
	},
	'geo.ip': {
		input: GeoapifyEndpointInputSchemas.ipGeolocation,
		output: GeoapifyEndpointOutputSchemas.ipGeolocation,
	},
	'geo.timezone': {
		input: GeoapifyEndpointInputSchemas.timezone,
		output: GeoapifyEndpointOutputSchemas.timezone,
	},
	'geo.postcodeSearch': {
		input: GeoapifyEndpointInputSchemas.postcodeSearch,
		output: GeoapifyEndpointOutputSchemas.postcodeSearch,
	},
	'geo.postcodeList': {
		input: GeoapifyEndpointInputSchemas.postcodeList,
		output: GeoapifyEndpointOutputSchemas.postcodeList,
	},
	'geo.boundaries': {
		input: GeoapifyEndpointInputSchemas.boundaries,
		output: GeoapifyEndpointOutputSchemas.boundaries,
	},
	'geo.elevation': {
		input: GeoapifyEndpointInputSchemas.elevation,
		output: GeoapifyEndpointOutputSchemas.elevation,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof geoapifyEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const geoapifyEndpointMeta = {
	'geocode.forward': {
		riskLevel: 'read',
		description:
			'Turn an address or place name into coordinates, a formatted address and its components, with a confidence for the match',
	},
	'geocode.reverse': {
		riskLevel: 'read',
		description:
			'Turn a latitude and longitude into the address at that point, with its full set of components',
	},
	'geocode.autocomplete': {
		riskLevel: 'read',
		description:
			'Suggest addresses from a partial one as a user types, which is what a search box needs',
	},
	'places.search': {
		riskLevel: 'read',
		description:
			'Find places by category within an area, such as restaurants inside a circle, with the details each place carries',
	},
	'places.details': {
		riskLevel: 'read',
		description:
			'Read one place by its ID, with its address, categories, contact details and opening hours',
	},
	'routing.route': {
		riskLevel: 'read',
		description:
			'Calculate a route between waypoints, with distance, time and optional turn-by-turn steps and geometry',
	},
	'routing.isoline': {
		riskLevel: 'read',
		description:
			'Calculate the area reachable from a point within a time or distance, one polygon per range. A slow calculation returns only an id to read it with later',
	},
	'routing.matrix': {
		riskLevel: 'read',
		description:
			'Calculate the time and distance between every source and target, one row per source. A pair with no route has null distance and time',
	},
	'geo.ip': {
		riskLevel: 'read',
		description:
			'Locate an IP address, or the caller when none is given, returning its country, city and coordinates',
	},
	'geo.timezone': {
		riskLevel: 'read',
		description:
			'Read the time zone at a point, including whether daylight saving applies at a given moment',
	},
	'geo.postcodeSearch': {
		riskLevel: 'read',
		description:
			'Look up a postcode, returning its coordinates and the places it covers',
	},
	'geo.postcodeList': {
		riskLevel: 'read',
		description:
			'Search postcodes by a prefix or a spatial filter, which is what a postcode autocomplete needs',
	},
	'geo.boundaries': {
		riskLevel: 'read',
		description:
			'Read the administrative boundaries a place belongs to, such as its city, county and country',
	},
	'geo.elevation': {
		riskLevel: 'read',
		description:
			'Sample the terrain elevation at one or more points, in metres or feet',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof geoapifyEndpointsNested>;

/**
 * Geoapify takes its key as the `apiKey` query parameter. There is no keyless
 * mode, so a call with neither an option nor a stored key is refused here
 * rather than sent and rejected with a 401.
 */
export const geoapifyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGeoapifyPlugin<T extends GeoapifyPluginOptions> = CorsairPlugin<
	'geoapify',
	typeof GeoapifySchema,
	typeof geoapifyEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof geoapifyAuthConfig
>;

export type InternalGeoapifyPlugin = BaseGeoapifyPlugin<GeoapifyPluginOptions>;

export type ExternalGeoapifyPlugin<T extends GeoapifyPluginOptions> =
	BaseGeoapifyPlugin<T>;

export function geoapify<const T extends GeoapifyPluginOptions>(
	incomingOptions: GeoapifyPluginOptions & T = {} as GeoapifyPluginOptions & T,
): ExternalGeoapifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'geoapify',
		schema: GeoapifySchema,
		options,
		hooks: options.hooks,
		endpoints: geoapifyEndpointsNested,
		webhooks: {},
		authConfig: geoapifyAuthConfig,
		endpointMeta: geoapifyEndpointMeta,
		endpointSchemas: geoapifyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GeoapifyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			// There are no webhooks, and Geoapify has no keyless mode.
			throw new AuthMissingError('geoapify', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGeoapifyPlugin;
}

export { GeoapifyAPIError, geoapifyErrorInfo } from './client';

export type {
	GeoapifyAddress,
	GeoapifyAutocompleteInput,
	GeoapifyBoundariesInput,
	GeoapifyBoundariesResponse,
	GeoapifyElevationInput,
	GeoapifyElevationResponse,
	GeoapifyEndpointInputs,
	GeoapifyEndpointOutputs,
	GeoapifyForwardGeocodeInput,
	GeoapifyGatewayError,
	GeoapifyGeocodeResponse,
	GeoapifyIpGeolocationInput,
	GeoapifyIpGeolocationResponse,
	GeoapifyIsolineInput,
	GeoapifyIsolineResponse,
	GeoapifyPlace,
	GeoapifyPlaceDetailsInput,
	GeoapifyPlacesInput,
	GeoapifyPlacesResponse,
	GeoapifyPostcodeListInput,
	GeoapifyPostcodeResponse,
	GeoapifyPostcodeSearchInput,
	GeoapifyReverseGeocodeInput,
	GeoapifyRouteMatrixInput,
	GeoapifyRouteMatrixResponse,
	GeoapifyRoutingInput,
	GeoapifyRoutingResponse,
	GeoapifyTimezoneInput,
	GeoapifyTimezoneResponse,
} from './endpoints/types';
