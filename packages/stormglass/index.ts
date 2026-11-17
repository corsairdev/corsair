import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { StormglassContext } from './context';
import {
	getAstronomy,
	getBio,
	getElevation,
	getExtremes,
	getHistoricalWeather,
	getSeaLevel,
	getSolar,
	getWeather,
	listStations,
	listStationsInArea,
} from './endpoints';
import {
	AstronomyInputSchema,
	AstronomyResponseSchema,
	BoxInputSchema,
	EmptyInputSchema,
	ExtremeListResponseSchema,
	HistoricalInputSchema,
	PointInputSchema,
	PointResponseSchema,
	SeaLevelResponseSchema,
	SeriesInputSchema,
	SeriesResponseSchema,
	StationListResponseSchema,
	TideInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StormglassSchema } from './schema';

export type { StormglassContext };

export type StormglassPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalStormglassPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stormglassEndpointsNested>;
};

export type StormglassKeyBuilderContext =
	KeyBuilderContext<StormglassPluginOptions>;

const stormglassEndpointsNested = {
	stations: { list: listStations, area: listStationsInArea },
	elevation: { get: getElevation },
	tides: { extremes: getExtremes, seaLevel: getSeaLevel },
	astronomy: { get: getAstronomy },
	solar: { get: getSolar },
	bio: { get: getBio },
	weather: { get: getWeather, historical: getHistoricalWeather },
} as const;

const stormglassWebhooksNested = {} as const;

export const stormglassEndpointSchemas = {
	'stations.list': {
		input: EmptyInputSchema,
		output: StationListResponseSchema,
	},
	'stations.area': { input: BoxInputSchema, output: StationListResponseSchema },
	'elevation.get': { input: PointInputSchema, output: PointResponseSchema },
	'tides.extremes': {
		input: TideInputSchema,
		output: ExtremeListResponseSchema,
	},
	'tides.seaLevel': { input: TideInputSchema, output: SeaLevelResponseSchema },
	'astronomy.get': {
		input: AstronomyInputSchema,
		output: AstronomyResponseSchema,
	},
	'solar.get': { input: SeriesInputSchema, output: SeriesResponseSchema },
	'bio.get': { input: SeriesInputSchema, output: SeriesResponseSchema },
	'weather.get': { input: SeriesInputSchema, output: SeriesResponseSchema },
	'weather.historical': {
		input: HistoricalInputSchema,
		output: SeriesResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stormglassEndpointsNested
>;

// Every Stormglass call counts against the account's daily request quota.
// Metered reads stay `read` (R8): none of these change or send anything.
const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const stormglassEndpointMeta = {
	'stations.list': read('List every tide station Stormglass has data for.'),
	'stations.area': read(
		'List tide stations inside a bounding box (lat,lng:lat,lng).',
	),
	'elevation.get': read(
		'Get elevation (land) or depth (sea, negative) in meters for one coordinate.',
	),
	'tides.extremes': read(
		'Get high and low tide times and heights near a coordinate, up to 10 days, from the nearest tide station.',
	),
	'tides.seaLevel': read(
		'Get the hourly astronomical sea level near a coordinate, up to 10 days, from the nearest tide station.',
	),
	'astronomy.get': read(
		'Get sunrise, sunset, dawn, dusk, moonrise, moonset and moon phase per day for one coordinate.',
	),
	'solar.get': read(
		'Get hourly solar values (uvIndex, radiation) for one coordinate.',
	),
	'bio.get': read(
		'Get hourly bio data (water chemistry, salinity, soil moisture and temperature) for one coordinate.',
	),
	'weather.get': read(
		'Get hourly weather and marine forecast values (wind, waves, swell, temperature, ...) for one coordinate. Covers the past 14 days and up to 10 days ahead.',
	),
	'weather.historical': read(
		'Get hourly historical weather for one coordinate from 2014 to about a week ago, up to 10 days per call. Needs start or end.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof stormglassEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const stormglassAuthConfig = {
	api_key: { account: [] as const },
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
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: StormglassKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('stormglass', 'api_key');
				return key;
			}
			return '';
		},
	} satisfies InternalStormglassPlugin;
}
