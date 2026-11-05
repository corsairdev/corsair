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
import {
	AirQuality,
	Disasters,
	Elevation,
	Fire,
	Geocode,
	Ili,
	Pollen,
	Weather,
} from './endpoints';
import type {
	AmbeeEndpointInputs,
	AmbeeEndpointOutputs,
} from './endpoints/types';
import {
	AmbeeEndpointInputSchemas,
	AmbeeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmbeeSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type AmbeePluginOptions = {
	/** Authentication method. Ambee only supports API keys. */
	authType?: PickAuth<'api_key'>;
	/**
	 * Ambee API key, sent as the `x-api-key` header. When omitted the key is
	 * resolved from the account key manager instead.
	 */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalAmbeePlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Ambee plugin. Every endpoint is a
	 * read-only environmental data lookup.
	 */
	permissions?: PluginPermissionsConfig<typeof ambeeEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type AmbeeContext = CorsairPluginContext<
	typeof AmbeeSchema,
	AmbeePluginOptions,
	undefined,
	typeof ambeeAuthConfig
>;

export type AmbeeKeyBuilderContext = KeyBuilderContext<
	AmbeePluginOptions,
	typeof ambeeAuthConfig
>;

export type AmbeeBoundEndpoints = BindEndpoints<typeof ambeeEndpointsNested>;

type AmbeeEndpoint<K extends keyof AmbeeEndpointOutputs> = CorsairEndpoint<
	AmbeeContext,
	AmbeeEndpointInputs[K],
	AmbeeEndpointOutputs[K]
>;

export type AmbeeEndpoints = {
	airQualityGetLatestByLatLng: AmbeeEndpoint<'airQualityGetLatestByLatLng'>;
	airQualityGetLatestByCity: AmbeeEndpoint<'airQualityGetLatestByCity'>;
	airQualityGetLatestByPostalCode: AmbeeEndpoint<'airQualityGetLatestByPostalCode'>;
	airQualityGetLatestByCountryCode: AmbeeEndpoint<'airQualityGetLatestByCountryCode'>;
	airQualityGetHistoryByLatLng: AmbeeEndpoint<'airQualityGetHistoryByLatLng'>;
	airQualityGetHistoryByPostalCode: AmbeeEndpoint<'airQualityGetHistoryByPostalCode'>;
	airQualityGetForecastByLatLng: AmbeeEndpoint<'airQualityGetForecastByLatLng'>;
	weatherGetLatest: AmbeeEndpoint<'weatherGetLatest'>;
	weatherGetHistory: AmbeeEndpoint<'weatherGetHistory'>;
	weatherGetForecast: AmbeeEndpoint<'weatherGetForecast'>;
	pollenGetLatest: AmbeeEndpoint<'pollenGetLatest'>;
	pollenGetHistory: AmbeeEndpoint<'pollenGetHistory'>;
	pollenGetForecast: AmbeeEndpoint<'pollenGetForecast'>;
	fireGetLatestByLatLng: AmbeeEndpoint<'fireGetLatestByLatLng'>;
	fireGetLatestByPlace: AmbeeEndpoint<'fireGetLatestByPlace'>;
	fireGetRiskByLatLng: AmbeeEndpoint<'fireGetRiskByLatLng'>;
	fireGetRiskByPlace: AmbeeEndpoint<'fireGetRiskByPlace'>;
	elevationGetByLatLng: AmbeeEndpoint<'elevationGetByLatLng'>;
	elevationGetByPlace: AmbeeEndpoint<'elevationGetByPlace'>;
	iliGetForecastByLatLng: AmbeeEndpoint<'iliGetForecastByLatLng'>;
	disastersGetLatestByLatLng: AmbeeEndpoint<'disastersGetLatestByLatLng'>;
	disastersGetLatestByCountryCode: AmbeeEndpoint<'disastersGetLatestByCountryCode'>;
	disastersGetLatestByContinent: AmbeeEndpoint<'disastersGetLatestByContinent'>;
	disastersGetHistoryByLatLng: AmbeeEndpoint<'disastersGetHistoryByLatLng'>;
	disastersGetHistoryByCountryCode: AmbeeEndpoint<'disastersGetHistoryByCountryCode'>;
	disastersGetHistoryByContinent: AmbeeEndpoint<'disastersGetHistoryByContinent'>;
	disastersGetHistoryByDateRange: AmbeeEndpoint<'disastersGetHistoryByDateRange'>;
	geocodeByPlace: AmbeeEndpoint<'geocodeByPlace'>;
	geocodeReverseByLatLng: AmbeeEndpoint<'geocodeReverseByLatLng'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const ambeeEndpointsNested = {
	airQuality: {
		getLatestByLatLng: AirQuality.getLatestByLatLng,
		getLatestByCity: AirQuality.getLatestByCity,
		getLatestByPostalCode: AirQuality.getLatestByPostalCode,
		getLatestByCountryCode: AirQuality.getLatestByCountryCode,
		getHistoryByLatLng: AirQuality.getHistoryByLatLng,
		getHistoryByPostalCode: AirQuality.getHistoryByPostalCode,
		getForecastByLatLng: AirQuality.getForecastByLatLng,
	},
	weather: {
		getLatest: Weather.getLatest,
		getHistory: Weather.getHistory,
		getForecast: Weather.getForecast,
	},
	pollen: {
		getLatest: Pollen.getLatest,
		getHistory: Pollen.getHistory,
		getForecast: Pollen.getForecast,
	},
	fire: {
		getLatestByLatLng: Fire.getLatestByLatLng,
		getLatestByPlace: Fire.getLatestByPlace,
		getRiskByLatLng: Fire.getRiskByLatLng,
		getRiskByPlace: Fire.getRiskByPlace,
	},
	elevation: {
		getByLatLng: Elevation.getByLatLng,
		getByPlace: Elevation.getByPlace,
	},
	ili: {
		getForecastByLatLng: Ili.getForecastByLatLng,
	},
	disasters: {
		getLatestByLatLng: Disasters.getLatestByLatLng,
		getLatestByCountryCode: Disasters.getLatestByCountryCode,
		getLatestByContinent: Disasters.getLatestByContinent,
		getHistoryByLatLng: Disasters.getHistoryByLatLng,
		getHistoryByCountryCode: Disasters.getHistoryByCountryCode,
		getHistoryByContinent: Disasters.getHistoryByContinent,
		getHistoryByDateRange: Disasters.getHistoryByDateRange,
	},
	geocode: {
		byPlace: Geocode.byPlace,
		reverseByLatLng: Geocode.reverseByLatLng,
	},
} as const;

// No webhooks — Ambee is a pull-based API with no event delivery.
const ambeeWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const ambeeEndpointSchemas = {
	'airQuality.getLatestByLatLng': {
		input: AmbeeEndpointInputSchemas.airQualityGetLatestByLatLng,
		output: AmbeeEndpointOutputSchemas.airQualityGetLatestByLatLng,
	},
	'airQuality.getLatestByCity': {
		input: AmbeeEndpointInputSchemas.airQualityGetLatestByCity,
		output: AmbeeEndpointOutputSchemas.airQualityGetLatestByCity,
	},
	'airQuality.getLatestByPostalCode': {
		input: AmbeeEndpointInputSchemas.airQualityGetLatestByPostalCode,
		output: AmbeeEndpointOutputSchemas.airQualityGetLatestByPostalCode,
	},
	'airQuality.getLatestByCountryCode': {
		input: AmbeeEndpointInputSchemas.airQualityGetLatestByCountryCode,
		output: AmbeeEndpointOutputSchemas.airQualityGetLatestByCountryCode,
	},
	'airQuality.getHistoryByLatLng': {
		input: AmbeeEndpointInputSchemas.airQualityGetHistoryByLatLng,
		output: AmbeeEndpointOutputSchemas.airQualityGetHistoryByLatLng,
	},
	'airQuality.getHistoryByPostalCode': {
		input: AmbeeEndpointInputSchemas.airQualityGetHistoryByPostalCode,
		output: AmbeeEndpointOutputSchemas.airQualityGetHistoryByPostalCode,
	},
	'airQuality.getForecastByLatLng': {
		input: AmbeeEndpointInputSchemas.airQualityGetForecastByLatLng,
		output: AmbeeEndpointOutputSchemas.airQualityGetForecastByLatLng,
	},
	'weather.getLatest': {
		input: AmbeeEndpointInputSchemas.weatherGetLatest,
		output: AmbeeEndpointOutputSchemas.weatherGetLatest,
	},
	'weather.getHistory': {
		input: AmbeeEndpointInputSchemas.weatherGetHistory,
		output: AmbeeEndpointOutputSchemas.weatherGetHistory,
	},
	'weather.getForecast': {
		input: AmbeeEndpointInputSchemas.weatherGetForecast,
		output: AmbeeEndpointOutputSchemas.weatherGetForecast,
	},
	'pollen.getLatest': {
		input: AmbeeEndpointInputSchemas.pollenGetLatest,
		output: AmbeeEndpointOutputSchemas.pollenGetLatest,
	},
	'pollen.getHistory': {
		input: AmbeeEndpointInputSchemas.pollenGetHistory,
		output: AmbeeEndpointOutputSchemas.pollenGetHistory,
	},
	'pollen.getForecast': {
		input: AmbeeEndpointInputSchemas.pollenGetForecast,
		output: AmbeeEndpointOutputSchemas.pollenGetForecast,
	},
	'fire.getLatestByLatLng': {
		input: AmbeeEndpointInputSchemas.fireGetLatestByLatLng,
		output: AmbeeEndpointOutputSchemas.fireGetLatestByLatLng,
	},
	'fire.getLatestByPlace': {
		input: AmbeeEndpointInputSchemas.fireGetLatestByPlace,
		output: AmbeeEndpointOutputSchemas.fireGetLatestByPlace,
	},
	'fire.getRiskByLatLng': {
		input: AmbeeEndpointInputSchemas.fireGetRiskByLatLng,
		output: AmbeeEndpointOutputSchemas.fireGetRiskByLatLng,
	},
	'fire.getRiskByPlace': {
		input: AmbeeEndpointInputSchemas.fireGetRiskByPlace,
		output: AmbeeEndpointOutputSchemas.fireGetRiskByPlace,
	},
	'elevation.getByLatLng': {
		input: AmbeeEndpointInputSchemas.elevationGetByLatLng,
		output: AmbeeEndpointOutputSchemas.elevationGetByLatLng,
	},
	'elevation.getByPlace': {
		input: AmbeeEndpointInputSchemas.elevationGetByPlace,
		output: AmbeeEndpointOutputSchemas.elevationGetByPlace,
	},
	'ili.getForecastByLatLng': {
		input: AmbeeEndpointInputSchemas.iliGetForecastByLatLng,
		output: AmbeeEndpointOutputSchemas.iliGetForecastByLatLng,
	},
	'disasters.getLatestByLatLng': {
		input: AmbeeEndpointInputSchemas.disastersGetLatestByLatLng,
		output: AmbeeEndpointOutputSchemas.disastersGetLatestByLatLng,
	},
	'disasters.getLatestByCountryCode': {
		input: AmbeeEndpointInputSchemas.disastersGetLatestByCountryCode,
		output: AmbeeEndpointOutputSchemas.disastersGetLatestByCountryCode,
	},
	'disasters.getLatestByContinent': {
		input: AmbeeEndpointInputSchemas.disastersGetLatestByContinent,
		output: AmbeeEndpointOutputSchemas.disastersGetLatestByContinent,
	},
	'disasters.getHistoryByLatLng': {
		input: AmbeeEndpointInputSchemas.disastersGetHistoryByLatLng,
		output: AmbeeEndpointOutputSchemas.disastersGetHistoryByLatLng,
	},
	'disasters.getHistoryByCountryCode': {
		input: AmbeeEndpointInputSchemas.disastersGetHistoryByCountryCode,
		output: AmbeeEndpointOutputSchemas.disastersGetHistoryByCountryCode,
	},
	'disasters.getHistoryByContinent': {
		input: AmbeeEndpointInputSchemas.disastersGetHistoryByContinent,
		output: AmbeeEndpointOutputSchemas.disastersGetHistoryByContinent,
	},
	'disasters.getHistoryByDateRange': {
		input: AmbeeEndpointInputSchemas.disastersGetHistoryByDateRange,
		output: AmbeeEndpointOutputSchemas.disastersGetHistoryByDateRange,
	},
	'geocode.byPlace': {
		input: AmbeeEndpointInputSchemas.geocodeByPlace,
		output: AmbeeEndpointOutputSchemas.geocodeByPlace,
	},
	'geocode.reverseByLatLng': {
		input: AmbeeEndpointInputSchemas.geocodeReverseByLatLng,
		output: AmbeeEndpointOutputSchemas.geocodeReverseByLatLng,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ambeeEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every Ambee endpoint is a read-only environmental data lookup — nothing the
 * plugin exposes mutates provider-side state.
 */
const ambeeEndpointMeta = {
	'airQuality.getLatestByLatLng': {
		riskLevel: 'read',
		description:
			'Get the latest air quality (AQI and pollutant concentrations) for a latitude/longitude',
	},
	'airQuality.getLatestByCity': {
		riskLevel: 'read',
		description: 'Get the latest air quality for the stations in a city',
	},
	'airQuality.getLatestByPostalCode': {
		riskLevel: 'read',
		description: 'Get the latest air quality for a postal code and country',
	},
	'airQuality.getLatestByCountryCode': {
		riskLevel: 'read',
		description:
			'Get the latest air quality for the monitoring stations across a country',
	},
	'airQuality.getHistoryByLatLng': {
		riskLevel: 'read',
		description:
			'Get hourly historical air quality for a latitude/longitude over a time range',
	},
	'airQuality.getHistoryByPostalCode': {
		riskLevel: 'read',
		description:
			'Get hourly historical air quality for a postal code over a time range',
	},
	'airQuality.getForecastByLatLng': {
		riskLevel: 'read',
		description:
			'Get the hourly air quality forecast for a latitude/longitude (next 48 hours)',
	},
	'weather.getLatest': {
		riskLevel: 'read',
		description:
			'Get current weather conditions (temperature, humidity, wind, UV) for a latitude/longitude',
	},
	'weather.getHistory': {
		riskLevel: 'read',
		description:
			'Get hourly historical weather for a latitude/longitude over a time range',
	},
	'weather.getForecast': {
		riskLevel: 'read',
		description:
			'Get the hourly weather forecast for a latitude/longitude (next 72 hours)',
	},
	'pollen.getLatest': {
		riskLevel: 'read',
		description:
			'Get the latest grass, tree and weed pollen counts and risk levels for a location',
	},
	'pollen.getHistory': {
		riskLevel: 'read',
		description:
			'Get historical pollen counts for a location over a time range',
	},
	'pollen.getForecast': {
		riskLevel: 'read',
		description:
			'Get the pollen forecast for a location (48 hours hourly or 120 hours 3-hourly)',
	},
	'fire.getLatestByLatLng': {
		riskLevel: 'read',
		description:
			'Get wildfires detected or reported near a latitude/longitude in the last 7 days',
	},
	'fire.getLatestByPlace': {
		riskLevel: 'read',
		description:
			'Get wildfires detected or reported near a named place in the last 7 days',
	},
	'fire.getRiskByLatLng': {
		riskLevel: 'read',
		description:
			'Get the wildfire risk forecast for a latitude/longitude (up to 4 weeks ahead)',
	},
	'fire.getRiskByPlace': {
		riskLevel: 'read',
		description:
			'Get the wildfire risk forecast for a named place (up to 4 weeks ahead)',
	},
	'elevation.getByLatLng': {
		riskLevel: 'read',
		description: 'Get the ground elevation at a latitude/longitude',
	},
	'elevation.getByPlace': {
		riskLevel: 'read',
		description: 'Get the ground elevation for a named place',
	},
	'ili.getForecastByLatLng': {
		riskLevel: 'read',
		description:
			'Get the daily influenza-like-illness risk forecast for a latitude/longitude',
	},
	'disasters.getLatestByLatLng': {
		riskLevel: 'read',
		description:
			'Get the latest natural disasters near a latitude/longitude (paginated)',
	},
	'disasters.getLatestByCountryCode': {
		riskLevel: 'read',
		description: 'Get the latest natural disasters in a country (paginated)',
	},
	'disasters.getLatestByContinent': {
		riskLevel: 'read',
		description: 'Get the latest natural disasters on a continent (paginated)',
	},
	'disasters.getHistoryByLatLng': {
		riskLevel: 'read',
		description:
			'Get historical natural disasters near a latitude/longitude over a date range (paginated)',
	},
	'disasters.getHistoryByCountryCode': {
		riskLevel: 'read',
		description:
			'Get historical natural disasters in a country over a date range (paginated)',
	},
	'disasters.getHistoryByContinent': {
		riskLevel: 'read',
		description:
			'Get historical natural disasters on a continent over a date range (paginated)',
	},
	'disasters.getHistoryByDateRange': {
		riskLevel: 'read',
		description:
			'Get historical natural disasters worldwide over a date range (paginated)',
	},
	'geocode.byPlace': {
		riskLevel: 'read',
		description: 'Geocode a place name or address into coordinates',
	},
	'geocode.reverseByLatLng': {
		riskLevel: 'read',
		description:
			'Reverse-geocode a latitude/longitude into a human-readable address',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ambeeEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Ambee issues a single account-level API key that unlocks every product the
 * subscription covers, so no per-product key fields are needed beyond the
 * base `api_key` credential.
 */
export const ambeeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseAmbeePlugin<T extends AmbeePluginOptions> = CorsairPlugin<
	'ambee',
	typeof AmbeeSchema,
	typeof ambeeEndpointsNested,
	typeof ambeeWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof ambeeAuthConfig
>;

export type InternalAmbeePlugin = BaseAmbeePlugin<AmbeePluginOptions>;

export type ExternalAmbeePlugin<T extends AmbeePluginOptions> =
	BaseAmbeePlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function ambee<const T extends AmbeePluginOptions>(
	// Safe: T extends AmbeePluginOptions, so an empty object is a valid no-op
	// default when no options are passed. TypeScript requires the cast because
	// it cannot verify T = {}.
	incomingOptions: AmbeePluginOptions & T = {} as AmbeePluginOptions & T,
): ExternalAmbeePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ambee',
		authConfig: ambeeAuthConfig,
		schema: AmbeeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: ambeeEndpointsNested,
		webhooks: ambeeWebhooksNested,
		endpointMeta: ambeeEndpointMeta,
		endpointSchemas: ambeeEndpointSchemas,
		// No webhooks — Ambee is a pull-based API.
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmbeeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// `ctx.keys` is only attached when the host app configures both a
			// database and a KEK, even though the type declares it as always
			// present — the `?.` keeps a key-manager-less setup (plugin
			// configured with `key` alone) from throwing a raw TypeError.
			if (source === 'endpoint') {
				const res = await ctx.keys?.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAmbeePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export { AMBEE_API_BASE, AmbeeAPIError } from './client';
export type {
	AirQualityGetForecastByLatLngInput,
	AirQualityGetHistoryByLatLngInput,
	AirQualityGetHistoryByPostalCodeInput,
	AirQualityGetLatestByCityInput,
	AirQualityGetLatestByCountryCodeInput,
	AirQualityGetLatestByLatLngInput,
	AirQualityGetLatestByPostalCodeInput,
	AirQualityReading,
	AirQualitySeriesResponse,
	AirQualityStation,
	AirQualityStationsResponse,
	AmbeeEndpointInputs,
	AmbeeEndpointOutputs,
	DisasterEvent,
	DisasterResponse,
	DisastersGetHistoryByContinentInput,
	DisastersGetHistoryByCountryCodeInput,
	DisastersGetHistoryByDateRangeInput,
	DisastersGetHistoryByLatLngInput,
	DisastersGetLatestByContinentInput,
	DisastersGetLatestByCountryCodeInput,
	DisastersGetLatestByLatLngInput,
	ElevationGetByLatLngInput,
	ElevationGetByPlaceInput,
	ElevationReading,
	ElevationResponse,
	FireEvent,
	FireGetLatestByLatLngInput,
	FireGetLatestByPlaceInput,
	FireGetRiskByLatLngInput,
	FireGetRiskByPlaceInput,
	FireResponse,
	FireRisk,
	FireRiskResponse,
	GeocodeByPlaceInput,
	GeocodeResponse,
	GeocodeResult,
	GeocodeReverseByLatLngInput,
	IliForecastEntry,
	IliForecastResponse,
	IliGetForecastByLatLngInput,
	PollenGetForecastInput,
	PollenGetHistoryInput,
	PollenGetLatestInput,
	PollenReading,
	PollenResponse,
	WeatherGetForecastInput,
	WeatherGetHistoryInput,
	WeatherGetLatestInput,
	WeatherLatestResponse,
	WeatherPoint,
	WeatherSeriesResponse,
} from './endpoints/types';
export {
	AmbeeEndpointInputSchemas,
	AmbeeEndpointOutputSchemas,
} from './endpoints/types';
