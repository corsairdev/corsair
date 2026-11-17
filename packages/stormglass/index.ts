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
import type { StormglassContext } from './context';
import {
	getElevation,
	getExtremes,
	getSolar,
	getWeather,
	listStations,
	listStationsInArea,
} from './endpoints';
import {
	BoxInputSchema,
	EmptyInputSchema,
	ExtremeListResponseSchema,
	PointInputSchema,
	PointResponseSchema,
	SeriesInputSchema,
	SeriesResponseSchema,
	StationListResponseSchema,
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
	tides: { extremes: getExtremes },
	solar: { get: getSolar },
	weather: { get: getWeather },
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
		input: PointInputSchema,
		output: ExtremeListResponseSchema,
	},
	'solar.get': { input: SeriesInputSchema, output: SeriesResponseSchema },
	'weather.get': { input: SeriesInputSchema, output: SeriesResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof stormglassEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const spend = (description: string) =>
	({ riskLevel: 'write', description }) as const;

const stormglassEndpointMeta = {
	'stations.list': read(
		'List tide stations. Each request counts against the daily quota.',
	),
	'stations.area': read('List tide stations inside a bounding box.'),
	'elevation.get': spend(
		'Read elevation for one coordinate. This counts against the daily quota.',
	),
	'tides.extremes': spend(
		'Read high and low tides for one coordinate. This counts against the daily quota.',
	),
	'solar.get': spend(
		'Read solar values for one coordinate. This counts against the daily quota.',
	),
	'weather.get': spend(
		'Read weather values for one coordinate. This counts against the daily quota.',
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
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalStormglassPlugin;
}
