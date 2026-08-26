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
	Approval,
	Delegation,
	Order,
	Quote,
	Swap,
	SwappableTokens,
	Transaction,
} from './endpoints';
import type {
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './endpoints/types';
import {
	UniswapApiEndpointInputSchemas,
	UniswapApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { UniswapApiSchema } from './schema';

export type UniswapApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalUniswapApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof uniswapApiEndpointsNested>;
};

export type UniswapApiContext = CorsairPluginContext<
	typeof UniswapApiSchema,
	UniswapApiPluginOptions
>;

export type UniswapApiKeyBuilderContext =
	KeyBuilderContext<UniswapApiPluginOptions>;

export type UniswapApiBoundEndpoints = BindEndpoints<
	typeof uniswapApiEndpointsNested
>;

type UniswapApiEndpoint<K extends keyof UniswapApiEndpointOutputs> =
	CorsairEndpoint<
		UniswapApiContext,
		UniswapApiEndpointInputs[K],
		UniswapApiEndpointOutputs[K]
	>;

export type UniswapApiEndpoints = {
	approvalCheck: UniswapApiEndpoint<'approvalCheck'>;
	quoteGet: UniswapApiEndpoint<'quoteGet'>;
	swapCreate: UniswapApiEndpoint<'swapCreate'>;
	swapGetStatus: UniswapApiEndpoint<'swapGetStatus'>;
	orderGetStatus: UniswapApiEndpoint<'orderGetStatus'>;
	delegationCheck: UniswapApiEndpoint<'delegationCheck'>;
	transactionEncode7702: UniswapApiEndpoint<'transactionEncode7702'>;
	swappableTokensGet: UniswapApiEndpoint<'swappableTokensGet'>;
};

const uniswapApiEndpointsNested = {
	approval: {
		check: Approval.check,
	},
	quote: {
		get: Quote.get,
	},
	swap: {
		create: Swap.create,
		getStatus: Swap.getStatus,
	},
	order: {
		getStatus: Order.getStatus,
	},
	delegation: {
		check: Delegation.check,
	},
	transaction: {
		encode7702: Transaction.encode7702,
	},
	swappableTokens: {
		get: SwappableTokens.get,
	},
} as const;

// No webhooks — Uniswap Trading API uses polling for status
const uniswapApiWebhooksNested = {} as const;

export const uniswapApiEndpointSchemas = {
	'approval.check': {
		input: UniswapApiEndpointInputSchemas.approvalCheck,
		output: UniswapApiEndpointOutputSchemas.approvalCheck,
	},
	'quote.get': {
		input: UniswapApiEndpointInputSchemas.quoteGet,
		output: UniswapApiEndpointOutputSchemas.quoteGet,
	},
	'swap.create': {
		input: UniswapApiEndpointInputSchemas.swapCreate,
		output: UniswapApiEndpointOutputSchemas.swapCreate,
	},
	'swap.getStatus': {
		input: UniswapApiEndpointInputSchemas.swapGetStatus,
		output: UniswapApiEndpointOutputSchemas.swapGetStatus,
	},
	'order.getStatus': {
		input: UniswapApiEndpointInputSchemas.orderGetStatus,
		output: UniswapApiEndpointOutputSchemas.orderGetStatus,
	},
	'delegation.check': {
		input: UniswapApiEndpointInputSchemas.delegationCheck,
		output: UniswapApiEndpointOutputSchemas.delegationCheck,
	},
	'transaction.encode7702': {
		input: UniswapApiEndpointInputSchemas.transactionEncode7702,
		output: UniswapApiEndpointOutputSchemas.transactionEncode7702,
	},
	'swappableTokens.get': {
		input: UniswapApiEndpointInputSchemas.swappableTokensGet,
		output: UniswapApiEndpointOutputSchemas.swappableTokensGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof uniswapApiEndpointsNested
>;

const uniswapApiWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key';

const uniswapApiEndpointMeta = {
	'approval.check': {
		riskLevel: 'read',
		description: 'Check if a wallet has the required token approval for a swap',
	},
	'quote.get': {
		riskLevel: 'read',
		description: 'Get a swap/bridge/wrap quote with route and estimated gas',
	},
	'swap.create': {
		riskLevel: 'write',
		description: 'Create swap calldata (unsigned transaction) for broadcast',
	},
	'swap.getStatus': {
		riskLevel: 'read',
		description:
			'Get swap status (PENDING, SUCCESS, NOT_FOUND, FAILED, EXPIRED) by tx or userOp hash',
	},
	'order.getStatus': {
		riskLevel: 'read',
		description: 'Get the status and details of a gasless UniswapX order',
	},
	'delegation.check': {
		riskLevel: 'read',
		description:
			'Check wallet delegation status for smart contract wallets across chains',
	},
	'transaction.encode7702': {
		riskLevel: 'write',
		description:
			'Batch transactions into one for EIP-7702 smart contract wallet execution',
	},
	'swappableTokens.get': {
		riskLevel: 'read',
		description:
			'List tokens and chains a source token can be swapped or bridged to',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof uniswapApiEndpointsNested
>;

export const uniswapApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseUniswapApiPlugin<T extends UniswapApiPluginOptions> =
	CorsairPlugin<
		'uniswapapi',
		typeof UniswapApiSchema,
		typeof uniswapApiEndpointsNested,
		typeof uniswapApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalUniswapApiPlugin =
	BaseUniswapApiPlugin<UniswapApiPluginOptions>;

export type ExternalUniswapApiPlugin<T extends UniswapApiPluginOptions> =
	BaseUniswapApiPlugin<T>;

export function uniswapapi<const T extends UniswapApiPluginOptions>(
	incomingOptions: UniswapApiPluginOptions & T = {} as UniswapApiPluginOptions &
		T,
): ExternalUniswapApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'uniswapapi',
		authConfig: uniswapApiAuthConfig,
		schema: UniswapApiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: uniswapApiEndpointsNested,
		webhooks: uniswapApiWebhooksNested,
		endpointMeta: uniswapApiEndpointMeta,
		endpointSchemas: uniswapApiEndpointSchemas,
		webhookSchemas: uniswapApiWebhookSchemas,
		pluginWebhookMatcher: (_request) => {
			// No webhooks — Uniswap Trading API uses polling
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: UniswapApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('uniswapapi', 'api_key');
		},
	} satisfies InternalUniswapApiPlugin;
}

export type {
	CheckApprovalInput,
	CheckApprovalResponse,
	CheckDelegationInput,
	CheckDelegationResponse,
	CreateSwapInput,
	CreateSwapResponse,
	Encode7702TransactionInput,
	Encode7702TransactionResponse,
	GetOrderStatusInput,
	GetOrderStatusResponse,
	GetQuoteInput,
	GetQuoteResponse,
	GetSwappableTokensInput,
	GetSwappableTokensResponse,
	GetSwapStatusInput,
	GetSwapStatusResponse,
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './endpoints/types';
