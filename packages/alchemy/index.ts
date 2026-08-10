import type {
	BindEndpoints,
	BindWebhooks,
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
import type { AlchemyEndpointInputs, AlchemyEndpointOutputs } from './endpoints/types';
import { AlchemyEndpointInputSchemas, AlchemyEndpointOutputSchemas } from './endpoints/types';
import { Core, Nft, Token, Transfers } from './endpoints';
import { AlchemySchema } from './schema';
import { errorHandlers } from './error-handlers';
import type { AlchemyNetwork } from './client';

export type AlchemyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	network?: AlchemyNetwork;
	hooks?: InternalAlchemyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof alchemyEndpointsNested>;
};

export type AlchemyContext = CorsairPluginContext<
	typeof AlchemySchema,
	AlchemyPluginOptions
>;

export type AlchemyKeyBuilderContext = KeyBuilderContext<AlchemyPluginOptions>;

export type AlchemyBoundEndpoints = BindEndpoints<typeof alchemyEndpointsNested>;

type AlchemyEndpoint<
	K extends keyof AlchemyEndpointOutputs,
> = CorsairEndpoint<
	AlchemyContext,
	AlchemyEndpointInputs[K],
	AlchemyEndpointOutputs[K]
>;

export type AlchemyEndpoints = {
	coreGetBlockNumber: AlchemyEndpoint<'coreGetBlockNumber'>;
	coreGetBlock: AlchemyEndpoint<'coreGetBlock'>;
	coreGetBalance: AlchemyEndpoint<'coreGetBalance'>;
	coreGetTransaction: AlchemyEndpoint<'coreGetTransaction'>;
	coreGetTransactionReceipt: AlchemyEndpoint<'coreGetTransactionReceipt'>;
	coreCall: AlchemyEndpoint<'coreCall'>;
	coreSendRawTransaction: AlchemyEndpoint<'coreSendRawTransaction'>;
	nftGetNftsForOwner: AlchemyEndpoint<'nftGetNftsForOwner'>;
	nftGetNftMetadata: AlchemyEndpoint<'nftGetNftMetadata'>;
	nftGetOwnersForNft: AlchemyEndpoint<'nftGetOwnersForNft'>;
	nftGetContractMetadata: AlchemyEndpoint<'nftGetContractMetadata'>;
	tokenGetTokenBalances: AlchemyEndpoint<'tokenGetTokenBalances'>;
	tokenGetTokenMetadata: AlchemyEndpoint<'tokenGetTokenMetadata'>;
	tokenGetTokenAllowance: AlchemyEndpoint<'tokenGetTokenAllowance'>;
	transfersGetAssetTransfers: AlchemyEndpoint<'transfersGetAssetTransfers'>;
};

// No webhooks for Alchemy in this integration
export type AlchemyWebhooks = Record<string, never>;
export type AlchemyBoundWebhooks = BindWebhooks<AlchemyWebhooks>;

const alchemyEndpointsNested = {
	core: {
		getBlockNumber: Core.getBlockNumber,
		getBlock: Core.getBlock,
		getBalance: Core.getBalance,
		getTransaction: Core.getTransaction,
		getTransactionReceipt: Core.getTransactionReceipt,
		call: Core.call,
		sendRawTransaction: Core.sendRawTransaction,
	},
	nft: {
		getNftsForOwner: Nft.getNftsForOwner,
		getNftMetadata: Nft.getNftMetadata,
		getOwnersForNft: Nft.getOwnersForNft,
		getContractMetadata: Nft.getContractMetadata,
	},
	token: {
		getTokenBalances: Token.getTokenBalances,
		getTokenMetadata: Token.getTokenMetadata,
		getTokenAllowance: Token.getTokenAllowance,
	},
	transfers: {
		getAssetTransfers: Transfers.getAssetTransfers,
	},
} as const;

const alchemyWebhooksNested = {} as const;

export const alchemyEndpointSchemas = {
	'core.getBlockNumber': {
		input: AlchemyEndpointInputSchemas.coreGetBlockNumber,
		output: AlchemyEndpointOutputSchemas.coreGetBlockNumber,
	},
	'core.getBlock': {
		input: AlchemyEndpointInputSchemas.coreGetBlock,
		output: AlchemyEndpointOutputSchemas.coreGetBlock,
	},
	'core.getBalance': {
		input: AlchemyEndpointInputSchemas.coreGetBalance,
		output: AlchemyEndpointOutputSchemas.coreGetBalance,
	},
	'core.getTransaction': {
		input: AlchemyEndpointInputSchemas.coreGetTransaction,
		output: AlchemyEndpointOutputSchemas.coreGetTransaction,
	},
	'core.getTransactionReceipt': {
		input: AlchemyEndpointInputSchemas.coreGetTransactionReceipt,
		output: AlchemyEndpointOutputSchemas.coreGetTransactionReceipt,
	},
	'core.call': {
		input: AlchemyEndpointInputSchemas.coreCall,
		output: AlchemyEndpointOutputSchemas.coreCall,
	},
	'core.sendRawTransaction': {
		input: AlchemyEndpointInputSchemas.coreSendRawTransaction,
		output: AlchemyEndpointOutputSchemas.coreSendRawTransaction,
	},
	'nft.getNftsForOwner': {
		input: AlchemyEndpointInputSchemas.nftGetNftsForOwner,
		output: AlchemyEndpointOutputSchemas.nftGetNftsForOwner,
	},
	'nft.getNftMetadata': {
		input: AlchemyEndpointInputSchemas.nftGetNftMetadata,
		output: AlchemyEndpointOutputSchemas.nftGetNftMetadata,
	},
	'nft.getOwnersForNft': {
		input: AlchemyEndpointInputSchemas.nftGetOwnersForNft,
		output: AlchemyEndpointOutputSchemas.nftGetOwnersForNft,
	},
	'nft.getContractMetadata': {
		input: AlchemyEndpointInputSchemas.nftGetContractMetadata,
		output: AlchemyEndpointOutputSchemas.nftGetContractMetadata,
	},
	'token.getTokenBalances': {
		input: AlchemyEndpointInputSchemas.tokenGetTokenBalances,
		output: AlchemyEndpointOutputSchemas.tokenGetTokenBalances,
	},
	'token.getTokenMetadata': {
		input: AlchemyEndpointInputSchemas.tokenGetTokenMetadata,
		output: AlchemyEndpointOutputSchemas.tokenGetTokenMetadata,
	},
	'token.getTokenAllowance': {
		input: AlchemyEndpointInputSchemas.tokenGetTokenAllowance,
		output: AlchemyEndpointOutputSchemas.tokenGetTokenAllowance,
	},
	'transfers.getAssetTransfers': {
		input: AlchemyEndpointInputSchemas.transfersGetAssetTransfers,
		output: AlchemyEndpointOutputSchemas.transfersGetAssetTransfers,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof alchemyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const alchemyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const alchemyEndpointMeta = {
	'core.getBlockNumber': {
		riskLevel: 'read',
		description: 'Returns the number of most recent block.',
	},
	'core.getBlock': {
		riskLevel: 'read',
		description: 'Returns information about a block by hash or block number.',
	},
	'core.getBalance': {
		riskLevel: 'read',
		description: 'Returns the balance of the account of given address.',
	},
	'core.getTransaction': {
		riskLevel: 'read',
		description: 'Returns the information about a transaction requested by transaction hash.',
	},
	'core.getTransactionReceipt': {
		riskLevel: 'read',
		description: 'Returns the receipt of a transaction by transaction hash.',
	},
	'core.call': {
		riskLevel: 'read',
		description: 'Executes a new message call immediately without creating a transaction on the block chain.',
	},
	'core.sendRawTransaction': {
		riskLevel: 'write',
		description: 'Creates new message call transaction or a contract creation for signed transactions.',
	},
	'nft.getNftsForOwner': {
		riskLevel: 'read',
		description: 'Get all NFTs owned by the provided address.',
	},
	'nft.getNftMetadata': {
		riskLevel: 'read',
		description: 'Get the NFT metadata for an NFT.',
	},
	'nft.getOwnersForNft': {
		riskLevel: 'read',
		description: 'Get all the owners for a given NFT.',
	},
	'nft.getContractMetadata': {
		riskLevel: 'read',
		description: 'Get the metadata associated with an NFT contract.',
	},
	'token.getTokenBalances': {
		riskLevel: 'read',
		description: 'Returns ERC20 token balances for a specific address.',
	},
	'token.getTokenMetadata': {
		riskLevel: 'read',
		description: 'Returns metadata for a given token contract address.',
	},
	'token.getTokenAllowance': {
		riskLevel: 'read',
		description: 'Returns the amount which spender is still allowed to withdraw from owner.',
	},
	'transfers.getAssetTransfers': {
		riskLevel: 'read',
		description: 'Get historical transactions and asset transfers (ETH, ERC20, ERC721, ERC1155).',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof alchemyEndpointsNested>;


export type BaseAlchemyPlugin<T extends AlchemyPluginOptions> = CorsairPlugin<
	'alchemy',
	typeof AlchemySchema,
	typeof alchemyEndpointsNested,
	typeof alchemyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAlchemyPlugin = BaseAlchemyPlugin<AlchemyPluginOptions>;

export type ExternalAlchemyPlugin<T extends AlchemyPluginOptions> =
	BaseAlchemyPlugin<T>;

export function alchemy<const T extends AlchemyPluginOptions>(
	incomingOptions: AlchemyPluginOptions & T = {} as AlchemyPluginOptions & T,
): ExternalAlchemyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'alchemy',
		authConfig: alchemyAuthConfig,
		schema: AlchemySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: alchemyEndpointsNested,
		webhooks: alchemyWebhooksNested,
		endpointMeta: alchemyEndpointMeta,
		endpointSchemas: alchemyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AlchemyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAlchemyPlugin;
}

export type {
	AlchemyEndpointInputs,
	AlchemyEndpointOutputs,
} from './endpoints/types';

export {
	AlchemyEndpointInputSchemas,
	AlchemyEndpointOutputSchemas,
} from './endpoints/types';
