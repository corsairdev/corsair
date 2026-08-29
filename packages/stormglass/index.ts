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
import { AuthMissingError } from 'corsair/core';
import { Elevation, Solar, Tide, Weather } from './endpoints';
import type {
	StormglassEndpointInputs,
	StormglassEndpointOutputs,
} from './endpoints/types';
import {
	StormglassEndpointInputSchemas,
	StormglassEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StormglassSchema } from './schema';

export type StormglassPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager). */
	key?: string;
	hooks?: InternalStormglassPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stormglassEndpointsNested>;
};

export type StormglassContext = CorsairPluginContext<
	typeof StormglassSchema,
	StormglassPluginOptions
>;

export type StormglassKeyBuilderContext =
	KeyBuilderContext<StormglassPluginOptions>;

export type StormglassBoundEndpoints = BindEndpoints<
	typeof stormglassEndpointsNested
>;

type StormglassEndpoint<K extends keyof StormglassEndpointOutputs> =
	CorsairEndpoint<
		StormglassContext,
		StormglassEndpointInputs[K],
		StormglassEndpointOutputs[K]
	>;

export type StormglassEndpoints = {
	weather: {
		getPoint: StormglassEndpoint<'weatherGetPoint'>;
	};
	solar: {
		getPoint: StormglassEndpoint<'solarGetPoint'>;
	};
	tide: {
		getExtremesPoint: StormglassEndpoint<'tideGetExtremesPoint'>;
		listStations: StormglassEndpoint<'tideListStations'>;
		getStationsInArea: StormglassEndpoint<'tideGetStationsInArea'>;
	};
	elevation: {
		getPoint: StormglassEndpoint<'elevationGetPoint'>;
	};
};

const stormglassEndpointsNested = {
	weather: {
		getPoint: Weather.getPoint,
	},
	solar: {
		getPoint: Solar.getPoint,
	},
	tide: {
		getExtremesPoint: Tide.getExtremesPoint,
		listStations: Tide.listStations,
		getStationsInArea: Tide.getStationsInArea,
	},
	elevation: {
		getPoint: Elevation.getPoint,
	},
} as const;

// No webhooks — Stormglass is a pull-based API.
const stormglassWebhooksNested = {} as const;

export const stormglassEndpointSchemas = {
	'weather.getPoint': {
		input: StormglassEndpointInputSchemas.weatherGetPoint,
		output: StormglassEndpointOutputSchemas.weatherGetPoint,
	},
	'solar.getPoint': {
		input: StormglassEndpointInputSchemas.solarGetPoint,
		output: StormglassEndpointOutputSchemas.solarGetPoint,
	},
	'tide.getExtremesPoint': {
		input: StormglassEndpointInputSchemas.tideGetExtremesPoint,
		output: StormglassEndpointOutputSchemas.tideGetExtremesPoint,
	},
	'tide.listStations': {
		input: StormglassEndpointInputSchemas.tideListStations,
		output: StormglassEndpointOutputSchemas.tideListStations,
	},
	'tide.getStationsInArea': {
		input: StormglassEndpointInputSchemas.tideGetStationsInArea,
		output: StormglassEndpointOutputSchemas.tideGetStationsInArea,
	},
	'elevation.getPoint': {
		input: StormglassEndpointInputSchemas.elevationGetPoint,
		output: StormglassEndpointOutputSchemas.elevationGetPoint,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stormglassEndpointsNested
>;

const stormglassEndpointMeta = {
	'weather.getPoint': {
		riskLevel: 'read',
		description:
			'Fetch marine and land weather data (waves, wind, temperature, etc.) for a coordinate',
	},
	'solar.getPoint': {
		riskLevel: 'read',
		description: 'Fetch solar irradiation and UV index data for a coordinate',
	},
	'tide.getExtremesPoint': {
		riskLevel: 'read',
		description:
			'Get high and low tide times with sea level heights for a coordinate',
	},
	'tide.listStations': {
		riskLevel: 'read',
		description: 'List all tide stations Stormglass has data for',
	},
	'tide.getStationsInArea': {
		riskLevel: 'read',
		description: 'List tide stations within a geographic bounding box',
	},
	'elevation.getPoint': {
		riskLevel: 'read',
		description:
			'Fetch elevation (bathymetry/topography) data for a coordinate',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof stormglassEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const stormglassAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseStormglassPlugin<T extends StormglassPluginOptions> =
	CorsairPlugin<
		'stormglass',
		typeof StormglassSchema,
		typeof stormglassEndpointsNested,
		typeof stormglassWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalStormglassPlugin =
	BaseStormglassPlugin<StormglassPluginOptions>;

export type ExternalStormglassPlugin<T extends StormglassPluginOptions> =
	BaseStormglassPlugin<T>;

export function stormglass<const T extends StormglassPluginOptions>(
	incomingOptions: StormglassPluginOptions & T = {} as StormglassPluginOptions &
		T,
): ExternalStormglassPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'stormglass',
		authConfig: stormglassAuthConfig,
		schema: StormglassSchema,
		options,
		hooks: options.hooks,
		endpoints: stormglassEndpointsNested,
		webhooks: stormglassWebhooksNested,
		endpointMeta: stormglassEndpointMeta,
		endpointSchemas: stormglassEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StormglassKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('stormglass', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('stormglass', 'api_key');
		},
	} satisfies InternalStormglassPlugin;
}

export { StormglassAPIError } from './client';
export type {
	ElevationPointInput,
	ElevationPointResponse,
	SolarPointInput,
	SolarPointResponse,
	StormglassEndpointInputs,
	StormglassEndpointOutputs,
	StormglassMeta,
	StormglassSolarParam,
	StormglassSource,
	StormglassTideStation,
	StormglassWeatherParam,
	TideExtremesPointInput,
	TideExtremesPointResponse,
	TideStationsAreaInput,
	TideStationsAreaResponse,
	TideStationsListInput,
	TideStationsListResponse,
	WeatherPointInput,
	WeatherPointResponse,
} from './endpoints/types';
export {
	STORMGLASS_SOLAR_PARAMS,
	STORMGLASS_SOURCES,
	STORMGLASS_WEATHER_PARAMS,
} from './endpoints/types';
