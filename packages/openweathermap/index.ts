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
import {
	AirPollution,
	Geocoding,
	History,
	Maps,
	Stations,
	Summary,
	Weather,
} from './endpoints';
import type {
	OpenWeatherMapEndpointInputs,
	OpenWeatherMapEndpointOutputs,
} from './endpoints/types';
import {
	OpenWeatherMapEndpointInputSchemas,
	OpenWeatherMapEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OpenWeatherMapSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type OpenWeatherMapPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalOpenWeatherMapPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the OpenWeatherMap plugin.
	 * Most endpoints are read-only; station mutations require write/destructive permissions.
	 */
	permissions?: PluginPermissionsConfig<typeof openWeatherMapEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ───────────────────────────────────────────────────���─────────────────────────

export type OpenWeatherMapContext = CorsairPluginContext<
	typeof OpenWeatherMapSchema,
	OpenWeatherMapPluginOptions
>;

export type OpenWeatherMapKeyBuilderContext =
	KeyBuilderContext<OpenWeatherMapPluginOptions>;

export type OpenWeatherMapBoundEndpoints = BindEndpoints<
	typeof openWeatherMapEndpointsNested
>;

type OpenWeatherMapEndpoint<K extends keyof OpenWeatherMapEndpointOutputs> =
	CorsairEndpoint<
		OpenWeatherMapContext,
		OpenWeatherMapEndpointInputs[K],
		OpenWeatherMapEndpointOutputs[K]
	>;

export type OpenWeatherMapEndpoints = {
	weather: {
		oneCall: OpenWeatherMapEndpoint<'oneCall'>;
		current: OpenWeatherMapEndpoint<'currentWeather'>;
		forecast5Day: OpenWeatherMapEndpoint<'forecast5Day'>;
		circleCity: OpenWeatherMapEndpoint<'circleCity'>;
	};
	history: {
		timeMachine: OpenWeatherMapEndpoint<'timeMachine'>;
	};
	summary: {
		daySummary: OpenWeatherMapEndpoint<'daySummary'>;
		overview: OpenWeatherMapEndpoint<'overview'>;
	};
	airPollution: {
		current: OpenWeatherMapEndpoint<'airPollutionCurrent'>;
		forecast: OpenWeatherMapEndpoint<'airPollutionForecast'>;
		history: OpenWeatherMapEndpoint<'airPollutionHistory'>;
	};
	geocoding: {
		direct: OpenWeatherMapEndpoint<'geocodingDirect'>;
		reverse: OpenWeatherMapEndpoint<'geocodingReverse'>;
		byZip: OpenWeatherMapEndpoint<'geocodingByZip'>;
	};
	maps: {
		weatherMapTile: OpenWeatherMapEndpoint<'weatherMapTile'>;
	};
	stations: {
		list: OpenWeatherMapEndpoint<'stationsList'>;
		get: OpenWeatherMapEndpoint<'stationsGet'>;
		create: OpenWeatherMapEndpoint<'stationsCreate'>;
		update: OpenWeatherMapEndpoint<'stationsUpdate'>;
		remove: OpenWeatherMapEndpoint<'stationsRemove'>;
		getMeasurements: OpenWeatherMapEndpoint<'stationsGetMeasurements'>;
		submitMeasurements: OpenWeatherMapEndpoint<'stationsSubmitMeasurements'>;
	};
};

const openWeatherMapEndpointsNested = {
	weather: {
		oneCall: Weather.oneCall,
		current: Weather.current,
		forecast5Day: Weather.forecast5Day,
		circleCity: Weather.circleCity,
	},
	history: {
		timeMachine: History.timeMachine,
	},
	summary: {
		daySummary: Summary.daySummary,
		overview: Summary.overview,
	},
	airPollution: {
		current: AirPollution.current,
		forecast: AirPollution.forecast,
		history: AirPollution.history,
	},
	geocoding: {
		direct: Geocoding.direct,
		reverse: Geocoding.reverse,
		byZip: Geocoding.byZip,
	},
	maps: {
		weatherMapTile: Maps.weatherMapTile,
	},
	stations: {
		list: Stations.list,
		get: Stations.get,
		create: Stations.create,
		update: Stations.update,
		remove: Stations.remove,
		getMeasurements: Stations.getMeasurements,
		submitMeasurements: Stations.submitMeasurements,
	},
} as const;

// No webhooks — OpenWeatherMap is a pull-based API
const openWeatherMapWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const openWeatherMapEndpointSchemas = {
	'weather.oneCall': {
		input: OpenWeatherMapEndpointInputSchemas.oneCall,
		output: OpenWeatherMapEndpointOutputSchemas.oneCall,
	},
	'weather.current': {
		input: OpenWeatherMapEndpointInputSchemas.currentWeather,
		output: OpenWeatherMapEndpointOutputSchemas.currentWeather,
	},
	'weather.forecast5Day': {
		input: OpenWeatherMapEndpointInputSchemas.forecast5Day,
		output: OpenWeatherMapEndpointOutputSchemas.forecast5Day,
	},
	'weather.circleCity': {
		input: OpenWeatherMapEndpointInputSchemas.circleCity,
		output: OpenWeatherMapEndpointOutputSchemas.circleCity,
	},
	'history.timeMachine': {
		input: OpenWeatherMapEndpointInputSchemas.timeMachine,
		output: OpenWeatherMapEndpointOutputSchemas.timeMachine,
	},
	'summary.daySummary': {
		input: OpenWeatherMapEndpointInputSchemas.daySummary,
		output: OpenWeatherMapEndpointOutputSchemas.daySummary,
	},
	'summary.overview': {
		input: OpenWeatherMapEndpointInputSchemas.overview,
		output: OpenWeatherMapEndpointOutputSchemas.overview,
	},
	'airPollution.current': {
		input: OpenWeatherMapEndpointInputSchemas.airPollutionCurrent,
		output: OpenWeatherMapEndpointOutputSchemas.airPollutionCurrent,
	},
	'airPollution.forecast': {
		input: OpenWeatherMapEndpointInputSchemas.airPollutionForecast,
		output: OpenWeatherMapEndpointOutputSchemas.airPollutionForecast,
	},
	'airPollution.history': {
		input: OpenWeatherMapEndpointInputSchemas.airPollutionHistory,
		output: OpenWeatherMapEndpointOutputSchemas.airPollutionHistory,
	},
	'geocoding.direct': {
		input: OpenWeatherMapEndpointInputSchemas.geocodingDirect,
		output: OpenWeatherMapEndpointOutputSchemas.geocodingDirect,
	},
	'geocoding.reverse': {
		input: OpenWeatherMapEndpointInputSchemas.geocodingReverse,
		output: OpenWeatherMapEndpointOutputSchemas.geocodingReverse,
	},
	'geocoding.byZip': {
		input: OpenWeatherMapEndpointInputSchemas.geocodingByZip,
		output: OpenWeatherMapEndpointOutputSchemas.geocodingByZip,
	},
	'maps.weatherMapTile': {
		input: OpenWeatherMapEndpointInputSchemas.weatherMapTile,
		output: OpenWeatherMapEndpointOutputSchemas.weatherMapTile,
	},
	'stations.list': {
		input: OpenWeatherMapEndpointInputSchemas.stationsList,
		output: OpenWeatherMapEndpointOutputSchemas.stationsList,
	},
	'stations.get': {
		input: OpenWeatherMapEndpointInputSchemas.stationsGet,
		output: OpenWeatherMapEndpointOutputSchemas.stationsGet,
	},
	'stations.create': {
		input: OpenWeatherMapEndpointInputSchemas.stationsCreate,
		output: OpenWeatherMapEndpointOutputSchemas.stationsCreate,
	},
	'stations.update': {
		input: OpenWeatherMapEndpointInputSchemas.stationsUpdate,
		output: OpenWeatherMapEndpointOutputSchemas.stationsUpdate,
	},
	'stations.remove': {
		input: OpenWeatherMapEndpointInputSchemas.stationsRemove,
		output: OpenWeatherMapEndpointOutputSchemas.stationsRemove,
	},
	'stations.getMeasurements': {
		input: OpenWeatherMapEndpointInputSchemas.stationsGetMeasurements,
		output: OpenWeatherMapEndpointOutputSchemas.stationsGetMeasurements,
	},
	'stations.submitMeasurements': {
		input: OpenWeatherMapEndpointInputSchemas.stationsSubmitMeasurements,
		output: OpenWeatherMapEndpointOutputSchemas.stationsSubmitMeasurements,
	},
} satisfies RequiredPluginEndpointSchemas<typeof openWeatherMapEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Risk-level metadata for each OpenWeatherMap endpoint.
 */
const openWeatherMapEndpointMeta = {
	'weather.oneCall': {
		riskLevel: 'read',
		description:
			'Get current weather, minutely/hourly/daily forecasts, and weather alerts for a location',
	},
	'weather.current': {
		riskLevel: 'read',
		description:
			'Get current weather for a location by city name, city ID, zip code, or coordinates',
	},
	'weather.forecast5Day': {
		riskLevel: 'read',
		description:
			'Get 5-day forecast in 3-hour steps (up to 40 timestamps) for a location',
	},
	'weather.circleCity': {
		riskLevel: 'read',
		description:
			'Get current weather for cities within a circle around a geographic point',
	},
	'history.timeMachine': {
		riskLevel: 'read',
		description:
			'Get historical weather data for a specific timestamp (available from 1979-01-01)',
	},
	'summary.daySummary': {
		riskLevel: 'read',
		description:
			'Get aggregated weather summary for a specific date (temperature, wind, precipitation)',
	},
	'summary.overview': {
		riskLevel: 'read',
		description:
			'Get a human-readable weather overview text for a location and date',
	},
	'airPollution.current': {
		riskLevel: 'read',
		description: 'Get current air pollution data for a latitude/longitude pair',
	},
	'airPollution.forecast': {
		riskLevel: 'read',
		description:
			'Get forecasted air pollution data for a latitude/longitude pair',
	},
	'airPollution.history': {
		riskLevel: 'read',
		description:
			'Get historical air pollution data for a latitude/longitude pair and time range',
	},
	'geocoding.direct': {
		riskLevel: 'read',
		description: 'Convert a location name into geographic coordinates',
	},
	'geocoding.reverse': {
		riskLevel: 'read',
		description: 'Convert geographic coordinates into location names',
	},
	'geocoding.byZip': {
		riskLevel: 'read',
		description: 'Convert a zip/post code into geographic coordinates',
	},
	'maps.weatherMapTile': {
		riskLevel: 'read',
		description:
			'Fetch a Weather Maps 2.0 tile image for a layer and coordinates',
	},
	'stations.list': {
		riskLevel: 'read',
		description:
			'List all weather stations registered to your OpenWeather account',
	},
	'stations.get': {
		riskLevel: 'read',
		description: 'Get details for a registered weather station by ID',
	},
	'stations.create': {
		riskLevel: 'write',
		description: 'Register a new personal weather station with OpenWeather',
	},
	'stations.update': {
		riskLevel: 'write',
		description:
			'Update a registered weather station name, location, or external ID',
	},
	'stations.remove': {
		riskLevel: 'destructive',
		description: 'Delete a registered weather station from your account',
	},
	'stations.getMeasurements': {
		riskLevel: 'read',
		description:
			'Get aggregated measurements from a registered station (minute/hour/day intervals)',
	},
	'stations.submitMeasurements': {
		riskLevel: 'write',
		description: 'Submit weather measurements from a registered station',
	},
} satisfies RequiredPluginEndpointMeta<typeof openWeatherMapEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const openWeatherMapAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseOpenWeatherMapPlugin<T extends OpenWeatherMapPluginOptions> =
	CorsairPlugin<
		'openweathermap',
		typeof OpenWeatherMapSchema,
		typeof openWeatherMapEndpointsNested,
		typeof openWeatherMapWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalOpenWeatherMapPlugin =
	BaseOpenWeatherMapPlugin<OpenWeatherMapPluginOptions>;

export type ExternalOpenWeatherMapPlugin<
	T extends OpenWeatherMapPluginOptions,
> = BaseOpenWeatherMapPlugin<T>;

// ──────────────────────────��──────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function openweathermap<const T extends OpenWeatherMapPluginOptions>(
	incomingOptions: OpenWeatherMapPluginOptions &
		// Safe: T extends OpenWeatherMapPluginOptions, so an empty object is a valid no-op default
		// when no options are passed. TypeScript requires the cast because it cannot verify T = {}.
		T = {} as OpenWeatherMapPluginOptions & T,
	// Safe: T extends OpenWeatherMapPluginOptions, so an empty object is a valid no-op default
	// when no options are passed. TypeScript requires the cast because it cannot verify T = {}.
): ExternalOpenWeatherMapPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'openweathermap',
		authConfig: openWeatherMapAuthConfig,
		schema: OpenWeatherMapSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: openWeatherMapEndpointsNested,
		webhooks: openWeatherMapWebhooksNested,
		endpointMeta: openWeatherMapEndpointMeta,
		endpointSchemas: openWeatherMapEndpointSchemas,
		// No webhooks — OpenWeatherMap is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OpenWeatherMapKeyBuilderContext, source) => {
			const authType = ctx.authType;

			// Direct key from options takes priority
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Retrieve from key manager
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('openweathermap', 'api_key');
		},
	} satisfies InternalOpenWeatherMapPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AirPollutionCurrentInput,
	AirPollutionForecastInput,
	AirPollutionHistoryInput,
	AirPollutionResponse,
	CircleCityInput,
	CircleCityResponse,
	CurrentWeather,
	CurrentWeatherInput,
	CurrentWeatherResponse,
	DailyForecast,
	DaySummaryInput,
	DaySummaryResponse,
	EmptySuccess,
	Forecast5DayInput,
	Forecast5DayResponse,
	GeocodingByZipInput,
	GeocodingByZipResponse,
	GeocodingDirectInput,
	GeocodingDirectResponse,
	GeocodingReverseInput,
	GeocodingReverseResponse,
	HistoricalWeatherData,
	HourlyForecast,
	MinutelyForecast,
	OneCallInput,
	OneCallResponse,
	OpenWeatherMapEndpointInputs,
	OpenWeatherMapEndpointOutputs,
	OpenWeatherMapExclude,
	OpenWeatherMapUnits,
	OverviewInput,
	OverviewResponse,
	Station,
	StationCreateInput,
	StationGetInput,
	StationGetMeasurementsInput,
	StationGetMeasurementsResponse,
	StationRemoveInput,
	StationSubmitMeasurementsInput,
	StationsListResponse,
	StationUpdateInput,
	TimeMachineInput,
	TimeMachineResponse,
	WeatherAlert,
	WeatherCondition,
	WeatherMapLayer,
	WeatherMapTileInput,
	WeatherMapTileResponse,
} from './endpoints/types';

export {
	AirPollutionCurrentInputSchema,
	AirPollutionForecastInputSchema,
	AirPollutionHistoryInputSchema,
	AirPollutionResponseSchema,
	CircleCityInputSchema,
	CircleCityResponseSchema,
	CurrentWeatherInputSchema,
	CurrentWeatherResponseSchema,
	DaySummaryInputSchema,
	DaySummaryResponseSchema,
	Forecast5DayInputSchema,
	Forecast5DayResponseSchema,
	GeocodingByZipInputSchema,
	GeocodingByZipResponseSchema,
	GeocodingDirectInputSchema,
	GeocodingDirectResponseSchema,
	GeocodingReverseInputSchema,
	GeocodingReverseResponseSchema,
	OneCallInputSchema,
	OneCallResponseSchema,
	OPENWEATHERMAP_EXCLUDE,
	OPENWEATHERMAP_UNITS,
	OverviewInputSchema,
	OverviewResponseSchema,
	STATION_MEASUREMENT_TYPES,
	StationCreateInputSchema,
	StationGetInputSchema,
	StationGetMeasurementsInputSchema,
	StationRemoveInputSchema,
	StationSubmitMeasurementsInputSchema,
	StationUpdateInputSchema,
	TimeMachineInputSchema,
	TimeMachineResponseSchema,
	WEATHER_MAP_LAYERS,
	WeatherMapTileInputSchema,
	WeatherMapTileResponseSchema,
} from './endpoints/types';
