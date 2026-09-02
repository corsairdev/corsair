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
import { currencies, rates } from './endpoints';
import type {
	FixerEndpointInputs,
	FixerEndpointOutputs,
} from './endpoints/types';
import {
	CurrenciesGetAllInputSchema,
	CurrenciesGetAllOutputSchema,
	RatesConvertInputSchema,
	RatesConvertOutputSchema,
	RatesHistoricalInputSchema,
	RatesHistoricalOutputSchema,
	RatesLatestInputSchema,
	RatesLatestOutputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FixerSchema } from './schema';

export type FixerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	accessKey?: string;
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
	[K in keyof FixerEndpointInputs]: FixerEndpoint<K>;
};

export const fixerEndpointsNested = {
	rates,
	currencies,
} as const;

export const fixerEndpointSchemas = {
	'rates.latest': {
		input: RatesLatestInputSchema,
		output: RatesLatestOutputSchema,
	},
	'rates.convert': {
		input: RatesConvertInputSchema,
		output: RatesConvertOutputSchema,
	},
	'rates.historical': {
		input: RatesHistoricalInputSchema,
		output: RatesHistoricalOutputSchema,
	},
	'currencies.getAll': {
		input: CurrenciesGetAllInputSchema,
		output: CurrenciesGetAllOutputSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fixerEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const fixerEndpointMeta = {
	'rates.latest': {
		riskLevel: 'read',
		description:
			'Retrieve real-time exchange rates for all or specified currencies',
	},
	'rates.convert': {
		riskLevel: 'read',
		description:
			'Convert amounts between two currencies using real-time or historical rates',
	},
	'rates.historical': {
		riskLevel: 'read',
		description:
			'Retrieve historical exchange rates for a specific date (YYYY-MM-DD)',
	},
	'currencies.getAll': {
		riskLevel: 'read',
		description: 'Retrieve list of supported currency symbols and names',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fixerEndpointsNested>;

export const fixerAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFixerPlugin<T extends FixerPluginOptions> = CorsairPlugin<
	'fixer',
	typeof FixerSchema,
	typeof fixerEndpointsNested,
	{},
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
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: fixerEndpointsNested,
		webhooks: {},
		endpointMeta: fixerEndpointMeta,
		endpointSchemas: fixerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FixerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.accessKey) {
				return options.accessKey;
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

export * from './endpoints/types';
