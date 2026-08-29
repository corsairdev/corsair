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
	key?: string;
	hooks?: InternalStormglassPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Stormglass plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Stormglass endpoint tree — invalid paths are type errors.
	 */
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
	elevationPoint: StormglassEndpoint<'elevationPoint'>;
	tideStationsArea: StormglassEndpoint<'tideStationsArea'>;
	tideStationsList: StormglassEndpoint<'tideStationsList'>;
	tideExtremesPoint: StormglassEndpoint<'tideExtremesPoint'>;
	solarPoint: StormglassEndpoint<'solarPoint'>;
	weatherPoint: StormglassEndpoint<'weatherPoint'>;
};

const stormglassEndpointsNested = {
	elevation: {
		point: Elevation.point,
	},
	tide: {
		stationsArea: Tide.stationsArea,
		stationsList: Tide.stationsList,
		extremesPoint: Tide.extremesPoint,
	},
	solar: {
		point: Solar.point,
	},
	weather: {
		point: Weather.point,
	},
} as const;

export const stormglassEndpointSchemas = {
	'elevation.point': {
		input: StormglassEndpointInputSchemas.elevationPoint,
		output: StormglassEndpointOutputSchemas.elevationPoint,
	},
	'tide.stationsArea': {
		input: StormglassEndpointInputSchemas.tideStationsArea,
		output: StormglassEndpointOutputSchemas.tideStationsArea,
	},
	'tide.stationsList': {
		input: StormglassEndpointInputSchemas.tideStationsList,
		output: StormglassEndpointOutputSchemas.tideStationsList,
	},
	'tide.extremesPoint': {
		input: StormglassEndpointInputSchemas.tideExtremesPoint,
		output: StormglassEndpointOutputSchemas.tideExtremesPoint,
	},
	'solar.point': {
		input: StormglassEndpointInputSchemas.solarPoint,
		output: StormglassEndpointOutputSchemas.solarPoint,
	},
	'weather.point': {
		input: StormglassEndpointInputSchemas.weatherPoint,
		output: StormglassEndpointOutputSchemas.weatherPoint,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stormglassEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each Stormglass endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const stormglassEndpointMeta = {
	'elevation.point': {
		riskLevel: 'read',
		description: 'Get elevation/bathymetry data for a geographic point',
	},
	'tide.stationsArea': {
		riskLevel: 'read',
		description: 'List tide stations within a bounding box',
	},
	'tide.stationsList': {
		riskLevel: 'read',
		description: 'List all available tide stations',
	},
	'tide.extremesPoint': {
		riskLevel: 'read',
		description: 'Get high/low tide extremes for a point',
	},
	'solar.point': {
		riskLevel: 'read',
		description: 'Get solar irradiation and sun-position data for a point',
	},
	'weather.point': {
		riskLevel: 'read',
		description: 'Get marine and land weather data for a point',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof stormglassEndpointsNested
>;

export const stormglassAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseStormglassPlugin<T extends StormglassPluginOptions> =
	CorsairPlugin<
		'stormglass',
		typeof StormglassSchema,
		typeof stormglassEndpointsNested,
		{},
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
		options: options,
		hooks: options.hooks,
		endpoints: stormglassEndpointsNested,
		webhooks: {},
		endpointMeta: stormglassEndpointMeta,
		endpointSchemas: stormglassEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StormglassKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
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

export { StormglassAPIError, StormglassRateLimitError } from './client';
export type {
	ElevationPointInput,
	ElevationPointResponse,
	SolarPointInput,
	SolarPointResponse,
	StormglassEndpointInputs,
	StormglassEndpointOutputs,
	TideExtremesPointInput,
	TideExtremesPointResponse,
	TideStationsAreaInput,
	TideStationsListInput,
	TideStationsResponse,
	WeatherPointInput,
	WeatherPointResponse,
} from './endpoints/types';
