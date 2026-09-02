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
import { Rates, Symbols } from './endpoints';
import type {
	FixerEndpointInputs,
	FixerEndpointOutputs,
} from './endpoints/types';
import {
	FixerEndpointInputSchemas,
	FixerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FixerSchema } from './schema';

export type FixerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFixerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fixerEndpointsNested>;
};

export type FixerContext = CorsairPluginContext<
	typeof FixerSchema,
	FixerPluginOptions
>;

export type FixerKeyBuilderContext = KeyBuilderContext<FixerPluginOptions>;

export type FixerBoundEndpoints = BindEndpoints<typeof fixerEndpointsNested>;

type FixerEndpoint<K extends keyof FixerEndpointOutputs> = CorsairEndpoint<
	FixerContext,
	FixerEndpointInputs[K],
	FixerEndpointOutputs[K]
>;

export type FixerEndpoints = {
	symbolsList: FixerEndpoint<'symbolsList'>;
	ratesLatest: FixerEndpoint<'ratesLatest'>;
	ratesHistorical: FixerEndpoint<'ratesHistorical'>;
	ratesConvert: FixerEndpoint<'ratesConvert'>;
	ratesTimeseries: FixerEndpoint<'ratesTimeseries'>;
	ratesFluctuation: FixerEndpoint<'ratesFluctuation'>;
};

const fixerEndpointsNested = {
	symbols: {
		list: Symbols.list,
	},
	rates: {
		latest: Rates.latest,
		historical: Rates.historical,
		convert: Rates.convert,
		timeseries: Rates.timeseries,
		fluctuation: Rates.fluctuation,
	},
} as const;

export const fixerEndpointSchemas = {
	'symbols.list': {
		input: FixerEndpointInputSchemas.symbolsList,
		output: FixerEndpointOutputSchemas.symbolsList,
	},
	'rates.latest': {
		input: FixerEndpointInputSchemas.ratesLatest,
		output: FixerEndpointOutputSchemas.ratesLatest,
	},
	'rates.historical': {
		input: FixerEndpointInputSchemas.ratesHistorical,
		output: FixerEndpointOutputSchemas.ratesHistorical,
	},
	'rates.convert': {
		input: FixerEndpointInputSchemas.ratesConvert,
		output: FixerEndpointOutputSchemas.ratesConvert,
	},
	'rates.timeseries': {
		input: FixerEndpointInputSchemas.ratesTimeseries,
		output: FixerEndpointOutputSchemas.ratesTimeseries,
	},
	'rates.fluctuation': {
		input: FixerEndpointInputSchemas.ratesFluctuation,
		output: FixerEndpointOutputSchemas.ratesFluctuation,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fixerEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fixerEndpointMeta = {
	'symbols.list': {
		riskLevel: 'read',
		description: 'List all supported currency symbols and their full names',
	},
	'rates.latest': {
		riskLevel: 'read',
		description:
			'Get real-time exchange rates for all or specified target symbols relative to a base currency',
	},
	'rates.historical': {
		riskLevel: 'read',
		description:
			'Get historical exchange rates for a specific date (YYYY-MM-DD)',
	},
	'rates.convert': {
		riskLevel: 'read',
		description: 'Convert an amount from one currency to another',
	},
	'rates.timeseries': {
		riskLevel: 'read',
		description:
			'Get daily historical exchange rates within a specified date range',
	},
	'rates.fluctuation': {
		riskLevel: 'read',
		description:
			'Get currency exchange rate fluctuation data over a specified time period',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fixerEndpointsNested>;

export const fixerAuthConfig = {
	api_key: {
		account: ['api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFixerPlugin<T extends FixerPluginOptions> = CorsairPlugin<
	'fixer',
	typeof FixerSchema,
	typeof fixerEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFixerPlugin = BaseFixerPlugin<FixerPluginOptions>;

export type ExternalFixerPlugin<T extends FixerPluginOptions> =
	BaseFixerPlugin<T>;

/**
 * Creates and initializes the Fixer integration plugin for Corsair.
 *
 * @param incomingOptions - Optional configuration for API key and authentication
 * @returns An initialized Fixer plugin instance
 */
export function fixer<const T extends FixerPluginOptions>(
	// Cast required: `{}` cannot statically satisfy `FixerPluginOptions & T`
	// because T is a generic const extension; all options have defaults so this is safe.
	incomingOptions: FixerPluginOptions & T = {} as FixerPluginOptions & T,
): ExternalFixerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fixer',
		authConfig: fixerAuthConfig,
		schema: FixerSchema,
		options: options,
		hooks: options.hooks,
		endpoints: fixerEndpointsNested,
		endpointMeta: fixerEndpointMeta,
		endpointSchemas: fixerEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FixerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalFixerPlugin;
}

export type {
	FixerEndpointInputs,
	FixerEndpointOutputs,
	RatesConvertInput,
	RatesConvertResponse,
	RatesFluctuationInput,
	RatesFluctuationResponse,
	RatesHistoricalInput,
	RatesHistoricalResponse,
	RatesLatestInput,
	RatesLatestResponse,
	RatesTimeseriesInput,
	RatesTimeseriesResponse,
	SymbolsListInput,
	SymbolsListResponse,
} from './endpoints/types';
