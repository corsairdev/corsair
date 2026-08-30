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
import { matchFixerTenantWebhook } from './webhooks/tenant-matcher';

export type FixerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFixerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Fixer plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 */
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
	ratesLatest: FixerEndpoint<'ratesLatest'>;
	ratesHistorical: FixerEndpoint<'ratesHistorical'>;
	symbolsList: FixerEndpoint<'symbolsList'>;
};

const fixerEndpointsNested = {
	rates: {
		latest: Rates.latest,
		historical: Rates.historical,
	},
	symbols: {
		list: Symbols.list,
	},
} as const;

// Fixer is a public read-only currency data API — it has no webhooks.
const fixerWebhooksNested = {} as const;

export const fixerEndpointSchemas = {
	'rates.latest': {
		input: FixerEndpointInputSchemas.ratesLatest,
		output: FixerEndpointOutputSchemas.ratesLatest,
	},
	'rates.historical': {
		input: FixerEndpointInputSchemas.ratesHistorical,
		output: FixerEndpointOutputSchemas.ratesHistorical,
	},
	'symbols.list': {
		input: FixerEndpointInputSchemas.symbolsList,
		output: FixerEndpointOutputSchemas.symbolsList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof fixerEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fixerEndpointMeta = {
	'rates.latest': {
		riskLevel: 'read',
		description:
			'Get real-time exchange rate data for all available or specified currencies. Use when you need current forex rates before performing currency conversions.',
	},
	'rates.historical': {
		riskLevel: 'read',
		description:
			'Get historical exchange rate data for a specific date. Use when you need past currency rates for all or selected currencies.',
	},
	'symbols.list': {
		riskLevel: 'read',
		description:
			'Retrieve all supported currency symbols and their full names. Use when you need to display or validate available currencies before performing conversions.',
	},
} satisfies RequiredPluginEndpointMeta<typeof fixerEndpointsNested>;

export const fixerAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFixerPlugin<T extends FixerPluginOptions> = CorsairPlugin<
	'fixer',
	typeof FixerSchema,
	typeof fixerEndpointsNested,
	typeof fixerWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFixerPlugin = BaseFixerPlugin<FixerPluginOptions>;

export type ExternalFixerPlugin<T extends FixerPluginOptions> =
	BaseFixerPlugin<T>;

export function fixer<const T extends FixerPluginOptions>(
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
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: fixerEndpointsNested,
		webhooks: fixerWebhooksNested,
		endpointMeta: fixerEndpointMeta,
		endpointSchemas: fixerEndpointSchemas,
		// No incoming webhook requests to match
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: matchFixerTenantWebhook,
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
				if (!res) {
					throw new AuthMissingError('fixer', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('fixer', 'api_key');
		},
	} satisfies InternalFixerPlugin;
}

export type {
	ExchangeRatesResponse,
	FixerEndpointInputs,
	FixerEndpointOutputs,
	GetHistoricalRatesInput,
	GetLatestRatesInput,
	GetSupportedSymbolsInput,
	SupportedSymbolsResponse,
} from './endpoints/types';
export {
	FixerEndpointInputSchemas,
	FixerEndpointOutputSchemas,
} from './endpoints/types';
export { FixerSchema } from './schema';

export type { FixerWebhookOutputs } from './webhooks/types';
