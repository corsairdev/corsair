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
import { Gas, Mempool, Multichain } from './endpoints';
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
	configureFilters: BlocknativeEndpoint<'configureFilters'>;
	subscribeTransactionHash: BlocknativeEndpoint<'subscribeTransactionHash'>;
	unsubscribeTransactionHash: BlocknativeEndpoint<'unsubscribeTransactionHash'>;
	subscribeMultichain: BlocknativeEndpoint<'subscribeMultichain'>;
	unsubscribeMultichain: BlocknativeEndpoint<'unsubscribeMultichain'>;
};

const blocknativeEndpointsNested = {
	gas: {
		getPrices: Gas.getPrices,
		getBaseFeeEstimates: Gas.getBaseFeeEstimates,
		getDistribution: Gas.getDistribution,
		getOracles: Gas.getOracles,
		getSupportedChains: Gas.getSupportedChains,
	},
	mempool: {
		configureFilters: Mempool.configureFilters,
		subscribeTransactionHash: Mempool.subscribeTransactionHash,
		unsubscribeTransactionHash: Mempool.unsubscribeTransactionHash,
	},
	multichain: {
		subscribe: Multichain.subscribe,
		unsubscribe: Multichain.unsubscribe,
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
	'mempool.configureFilters': {
		input: BlocknativeEndpointInputSchemas.configureFilters,
		output: BlocknativeEndpointOutputSchemas.configureFilters,
	},
	'mempool.subscribeTransactionHash': {
		input: BlocknativeEndpointInputSchemas.subscribeTransactionHash,
		output: BlocknativeEndpointOutputSchemas.subscribeTransactionHash,
	},
	'mempool.unsubscribeTransactionHash': {
		input: BlocknativeEndpointInputSchemas.unsubscribeTransactionHash,
		output: BlocknativeEndpointOutputSchemas.unsubscribeTransactionHash,
	},
	'multichain.subscribe': {
		input: BlocknativeEndpointInputSchemas.subscribeMultichain,
		output: BlocknativeEndpointOutputSchemas.subscribeMultichain,
	},
	'multichain.unsubscribe': {
		input: BlocknativeEndpointInputSchemas.unsubscribeMultichain,
		output: BlocknativeEndpointOutputSchemas.unsubscribeMultichain,
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
	'mempool.configureFilters': {
		riskLevel: 'write',
		description:
			'Prepare WebSocket initialize + configs/put messages for mempool filters and ABI decoding',
	},
	'mempool.subscribeTransactionHash': {
		riskLevel: 'write',
		description:
			'Prepare a WebSocket subscription message for Ethereum transaction state changes',
	},
	'mempool.unsubscribeTransactionHash': {
		riskLevel: 'write',
		description:
			'Prepare a WebSocket unsubscription message for an Ethereum transaction hash',
	},
	'multichain.subscribe': {
		riskLevel: 'write',
		description:
			'Generate WebSocket connection details to subscribe to a transaction or account across chains',
	},
	'multichain.unsubscribe': {
		riskLevel: 'write',
		description:
			'Return the Multichain SDK unsubscribe payload for an address or transaction hash',
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
	applyDappId,
	BLOCKNATIVE_API_BASE,
	BLOCKNATIVE_DAPP_ID_FIELD,
	BLOCKNATIVE_DAPP_ID_PLACEHOLDER,
	BLOCKNATIVE_WS_URL,
	BlocknativeAPIError,
	BlocknativeRateLimitError,
	makeBlocknativeRequest,
} from './client';
export type {
	BlocknativeEndpointInputs,
	BlocknativeEndpointOutputs,
	ConfigureFiltersInput,
	ConfigureFiltersOutput,
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
	SubscribeMultichainInput,
	SubscribeMultichainOutput,
	SubscribeTransactionHashInput,
	SubscribeTransactionHashOutput,
	UnsubscribeMultichainInput,
	UnsubscribeMultichainOutput,
	UnsubscribeTransactionHashInput,
	UnsubscribeTransactionHashOutput,
} from './endpoints/types';
