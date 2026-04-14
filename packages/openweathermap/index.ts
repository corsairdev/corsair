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
import type { AuthTypes } from 'corsair/core';
import { Weather, History, Summary } from './endpoints';
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
	 * All endpoints are read-only, so the default mode is effectively 'open'.
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
	oneCall: OpenWeatherMapEndpoint<'oneCall'>;
	timeMachine: OpenWeatherMapEndpoint<'timeMachine'>;
	daySummary: OpenWeatherMapEndpoint<'daySummary'>;
	overview: OpenWeatherMapEndpoint<'overview'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ────────────────────────────────────��────────────────────────────────────────

const openWeatherMapEndpointsNested = {
	weather: {
		oneCall: Weather.oneCall,
	},
	history: {
		timeMachine: History.timeMachine,
	},
	summary: {
		daySummary: Summary.daySummary,
		overview: Summary.overview,
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
} satisfies RequiredPluginEndpointSchemas<typeof openWeatherMapEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Risk-level metadata for each OpenWeatherMap endpoint.
 * All endpoints are read-only — they only fetch weather data.
 */
const openWeatherMapEndpointMeta = {
	'weather.oneCall': {
		riskLevel: 'read',
		description:
			'Get current weather, minutely/hourly/daily forecasts, and weather alerts for a location',
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
} satisfies RequiredPluginEndpointMeta<typeof openWeatherMapEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const openWeatherMapAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
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
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'openweathermap',
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
			// Direct key from options takes priority
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Retrieve from key manager
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalOpenWeatherMapPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	OpenWeatherMapEndpointInputs,
	OpenWeatherMapEndpointOutputs,
	OneCallInput,
	OneCallResponse,
	TimeMachineInput,
	TimeMachineResponse,
	DaySummaryInput,
	DaySummaryResponse,
	OverviewInput,
	OverviewResponse,
	CurrentWeather,
	MinutelyForecast,
	HourlyForecast,
	DailyForecast,
	WeatherAlert,
	WeatherCondition,
	OpenWeatherMapUnits,
	OpenWeatherMapExclude,
	HistoricalWeatherData,
} from './endpoints/types';

export {
	OneCallInputSchema,
	OneCallResponseSchema,
	TimeMachineInputSchema,
	TimeMachineResponseSchema,
	DaySummaryInputSchema,
	DaySummaryResponseSchema,
	OverviewInputSchema,
	OverviewResponseSchema,
	OPENWEATHERMAP_UNITS,
	OPENWEATHERMAP_EXCLUDE,
} from './endpoints/types';
