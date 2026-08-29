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
import { Gas } from './endpoints';
import type {
	BlocknativeEndpointInputs,
	BlocknativeEndpointOutputs,
} from './endpoints/types';
import {
	BlocknativeEndpointInputSchemas,
	BlocknativeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BlocknativeSchema } from './schema';

export type BlocknativePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBlocknativePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof blocknativeEndpointsNested>;
};

export type BlocknativeContext = CorsairPluginContext<
	typeof BlocknativeSchema,
	BlocknativePluginOptions
>;

export type BlocknativeKeyBuilderContext =
	KeyBuilderContext<BlocknativePluginOptions>;

export type BlocknativeBoundEndpoints = BindEndpoints<
	typeof blocknativeEndpointsNested
>;

type BlocknativeEndpoint<K extends keyof BlocknativeEndpointOutputs> =
	CorsairEndpoint<
		BlocknativeContext,
		BlocknativeEndpointInputs[K],
		BlocknativeEndpointOutputs[K]
	>;

export type BlocknativeEndpoints = {
	getGasPrices: BlocknativeEndpoint<'getGasPrices'>;
	getBaseFeeEstimates: BlocknativeEndpoint<'getBaseFeeEstimates'>;
	getGasDistribution: BlocknativeEndpoint<'getGasDistribution'>;
	getGasOracles: BlocknativeEndpoint<'getGasOracles'>;
	getSupportedChains: BlocknativeEndpoint<'getSupportedChains'>;
};

const blocknativeEndpointsNested = {
	gas: {
		getPrices: Gas.getPrices,
		getBaseFeeEstimates: Gas.getBaseFeeEstimates,
		getDistribution: Gas.getDistribution,
		getOracles: Gas.getOracles,
		getSupportedChains: Gas.getSupportedChains,
	},
} as const;

const blocknativeWebhooksNested = {} as const;

export const blocknativeEndpointSchemas = {
	'gas.getPrices': {
		input: BlocknativeEndpointInputSchemas.getGasPrices,
		output: BlocknativeEndpointOutputSchemas.getGasPrices,
	},
	'gas.getBaseFeeEstimates': {
		input: BlocknativeEndpointInputSchemas.getBaseFeeEstimates,
		output: BlocknativeEndpointOutputSchemas.getBaseFeeEstimates,
	},
	'gas.getDistribution': {
		input: BlocknativeEndpointInputSchemas.getGasDistribution,
		output: BlocknativeEndpointOutputSchemas.getGasDistribution,
	},
	'gas.getOracles': {
		input: BlocknativeEndpointInputSchemas.getGasOracles,
		output: BlocknativeEndpointOutputSchemas.getGasOracles,
	},
	'gas.getSupportedChains': {
		input: BlocknativeEndpointInputSchemas.getSupportedChains,
		output: BlocknativeEndpointOutputSchemas.getSupportedChains,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof blocknativeEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const blocknativeEndpointMeta = {
	'gas.getPrices': {
		riskLevel: 'read',
		description:
			'Fetch gas price estimates for specific inclusion probabilities (next block or ~10 seconds)',
	},
	'gas.getBaseFeeEstimates': {
		riskLevel: 'read',
		description:
			'Get real-time base fee, blob base fee, and priority fee predictions for the next 5 Ethereum blocks',
	},
	'gas.getDistribution': {
		riskLevel: 'read',
		description:
			'Retrieve the current mempool gas price distribution breakdown',
	},
	'gas.getOracles': {
		riskLevel: 'read',
		description: 'Retrieve metadata on supported gas oracles per chain',
	},
	'gas.getSupportedChains': {
		riskLevel: 'read',
		description:
			'Retrieve supported chains metadata for Blocknative gas services',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof blocknativeEndpointsNested
>;

export const blocknativeAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBlocknativePlugin<T extends BlocknativePluginOptions> =
	CorsairPlugin<
		'blocknative',
		typeof BlocknativeSchema,
		typeof blocknativeEndpointsNested,
		typeof blocknativeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBlocknativePlugin =
	BaseBlocknativePlugin<BlocknativePluginOptions>;

export type ExternalBlocknativePlugin<T extends BlocknativePluginOptions> =
	BaseBlocknativePlugin<T>;

export function blocknative<const T extends BlocknativePluginOptions>(
	incomingOptions: BlocknativePluginOptions &
		T = {} as BlocknativePluginOptions & T,
): ExternalBlocknativePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'blocknative',
		authConfig: blocknativeAuthConfig,
		schema: BlocknativeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: blocknativeEndpointsNested,
		webhooks: blocknativeWebhooksNested,
		endpointMeta: blocknativeEndpointMeta,
		endpointSchemas: blocknativeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BlocknativeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('blocknative', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('blocknative', 'api_key');
		},
	} satisfies InternalBlocknativePlugin;
}

export {
	BLOCKNATIVE_API_BASE,
	BlocknativeAPIError,
	BlocknativeRateLimitError,
	makeBlocknativeRequest,
} from './client';
export type {
	BlocknativeEndpointInputs,
	BlocknativeEndpointOutputs,
	GetBaseFeeEstimatesInput,
	GetBaseFeeEstimatesOutput,
	GetGasDistributionInput,
	GetGasDistributionOutput,
	GetGasOraclesInput,
	GetGasOraclesOutput,
	GetGasPricesInput,
	GetGasPricesOutput,
	GetSupportedChainsInput,
	GetSupportedChainsOutput,
} from './endpoints/types';
