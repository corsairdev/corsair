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
import { AirQuality, Fire, Geocode, Pollen, Weather } from './endpoints';
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
	AirQualityGetLatestByLatLngInput,
	AirQualityGetLatestByPostalCodeInput,
	AirQualityReading,
	AirQualitySeriesResponse,
	AirQualityStation,
	AirQualityStationsResponse,
	AmbeeEndpointInputs,
	AmbeeEndpointOutputs,
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
