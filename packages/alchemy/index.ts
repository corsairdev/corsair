import type {
	AuthTypes,
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
import type { AlchemyNetwork } from './client';
import { Nft, Portfolio, Prices, Rpc, Token } from './endpoints';
import type {
	AlchemyEndpointInputs,
	AlchemyEndpointOutputs,
} from './endpoints/types';
import {
	AlchemyEndpointInputSchemas,
	AlchemyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AlchemySchema } from './schema';

export type AlchemyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Default Alchemy network label (e.g. eth-mainnet). Validated against allowlist. */
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

export type AlchemyBoundEndpoints = BindEndpoints<
	typeof alchemyEndpointsNested
>;

type AlchemyEndpoint<K extends keyof AlchemyEndpointOutputs> = CorsairEndpoint<
	AlchemyContext,
	AlchemyEndpointInputs[K],
	AlchemyEndpointOutputs[K]
>;

export type AlchemyEndpoints = {
	nftIsHolderOfCollection: AlchemyEndpoint<'nftIsHolderOfCollection'>;
	nftIsAirdrop: AlchemyEndpoint<'nftIsAirdrop'>;
	nftIsAirdropNft: AlchemyEndpoint<'nftIsAirdropNft'>;
	nftIsHolderOfContract: AlchemyEndpoint<'nftIsHolderOfContract'>;
	nftIsSpamContract: AlchemyEndpoint<'nftIsSpamContract'>;
	nftIsSpamContractV3: AlchemyEndpoint<'nftIsSpamContractV3'>;
	nftComputeRarityV3: AlchemyEndpoint<'nftComputeRarityV3'>;
	nftGetCollectionsForOwner: AlchemyEndpoint<'nftGetCollectionsForOwner'>;
	nftGetContractMetadataBatchV3: AlchemyEndpoint<'nftGetContractMetadataBatchV3'>;
	nftGetContractMetadataV3: AlchemyEndpoint<'nftGetContractMetadataV3'>;
	nftGetContractsForOwnerV3: AlchemyEndpoint<'nftGetContractsForOwnerV3'>;
	nftGetCollectionMetadata: AlchemyEndpoint<'nftGetCollectionMetadata'>;
	nftGetFloorPriceV3: AlchemyEndpoint<'nftGetFloorPriceV3'>;
	nftGetNftMetadata: AlchemyEndpoint<'nftGetNftMetadata'>;
	nftGetNftMetadataBatch: AlchemyEndpoint<'nftGetNftMetadataBatch'>;
	nftGetOwnersForNftV3: AlchemyEndpoint<'nftGetOwnersForNftV3'>;
	nftGetNftSalesV3: AlchemyEndpoint<'nftGetNftSalesV3'>;
	nftGetNftsForCollectionV3: AlchemyEndpoint<'nftGetNftsForCollectionV3'>;
	nftGetNftsForContract: AlchemyEndpoint<'nftGetNftsForContract'>;
	nftGetNftsForOwner: AlchemyEndpoint<'nftGetNftsForOwner'>;
	nftGetOwnersForCollection: AlchemyEndpoint<'nftGetOwnersForCollection'>;
	nftGetOwnersForContract: AlchemyEndpoint<'nftGetOwnersForContract'>;
	nftInvalidateContractV3: AlchemyEndpoint<'nftInvalidateContractV3'>;
	nftSearchContractMetadataV3: AlchemyEndpoint<'nftSearchContractMetadataV3'>;
	nftSummarizeNftAttributes: AlchemyEndpoint<'nftSummarizeNftAttributes'>;
	pricesGetHistoricalPrices: AlchemyEndpoint<'pricesGetHistoricalPrices'>;
	pricesGetTokenPricesByAddress: AlchemyEndpoint<'pricesGetTokenPricesByAddress'>;
	pricesGetPricesBySymbol: AlchemyEndpoint<'pricesGetPricesBySymbol'>;
	portfolioGetNftContractsByAddress: AlchemyEndpoint<'portfolioGetNftContractsByAddress'>;
	portfolioGetPortfolioNftsByAddress: AlchemyEndpoint<'portfolioGetPortfolioNftsByAddress'>;
	portfolioGetTokenBalancesByAddress: AlchemyEndpoint<'portfolioGetTokenBalancesByAddress'>;
	portfolioGetTokensByAddress: AlchemyEndpoint<'portfolioGetTokensByAddress'>;
	portfolioGetTransactionsHistoryByAddress: AlchemyEndpoint<'portfolioGetTransactionsHistoryByAddress'>;
	tokenGetTokenBalances: AlchemyEndpoint<'tokenGetTokenBalances'>;
	tokenGetTokenMetadata: AlchemyEndpoint<'tokenGetTokenMetadata'>;
	rpcGetTransactionCount: AlchemyEndpoint<'rpcGetTransactionCount'>;
};

export type AlchemyWebhooks = Record<string, never>;
export type AlchemyBoundWebhooks = BindWebhooks<AlchemyWebhooks>;

const alchemyEndpointsNested = {
	nft: {
		isHolderOfCollection: Nft.isHolderOfCollection,
		isAirdrop: Nft.isAirdrop,
		isAirdropNft: Nft.isAirdropNft,
		isHolderOfContract: Nft.isHolderOfContract,
		isSpamContract: Nft.isSpamContract,
		isSpamContractV3: Nft.isSpamContractV3,
		computeRarityV3: Nft.computeRarityV3,
		getCollectionsForOwner: Nft.getCollectionsForOwner,
		getContractMetadataBatchV3: Nft.getContractMetadataBatchV3,
		getContractMetadataV3: Nft.getContractMetadataV3,
		getContractsForOwnerV3: Nft.getContractsForOwnerV3,
		getCollectionMetadata: Nft.getCollectionMetadata,
		getFloorPriceV3: Nft.getFloorPriceV3,
		getNftMetadata: Nft.getNftMetadata,
		getNftMetadataBatch: Nft.getNftMetadataBatch,
		getOwnersForNftV3: Nft.getOwnersForNftV3,
		getNftSalesV3: Nft.getNftSalesV3,
		getNftsForCollectionV3: Nft.getNftsForCollectionV3,
		getNftsForContract: Nft.getNftsForContract,
		getNftsForOwner: Nft.getNftsForOwner,
		getOwnersForCollection: Nft.getOwnersForCollection,
		getOwnersForContract: Nft.getOwnersForContract,
		invalidateContractV3: Nft.invalidateContractV3,
		searchContractMetadataV3: Nft.searchContractMetadataV3,
		summarizeNftAttributes: Nft.summarizeNftAttributes,
	},
	prices: {
		getHistoricalPrices: Prices.getHistoricalPrices,
		getTokenPricesByAddress: Prices.getTokenPricesByAddress,
		getPricesBySymbol: Prices.getPricesBySymbol,
	},
	portfolio: {
		getNftContractsByAddress: Portfolio.getNftContractsByAddress,
		getPortfolioNftsByAddress: Portfolio.getPortfolioNftsByAddress,
		getTokenBalancesByAddress: Portfolio.getTokenBalancesByAddress,
		getTokensByAddress: Portfolio.getTokensByAddress,
		getTransactionsHistoryByAddress: Portfolio.getTransactionsHistoryByAddress,
	},
	token: {
		getTokenBalances: Token.getTokenBalances,
		getTokenMetadata: Token.getTokenMetadata,
	},
	rpc: {
		getTransactionCount: Rpc.getTransactionCount,
	},
} as const;

const alchemyWebhooksNested = {} as const;

export const alchemyEndpointSchemas = {
	'nft.isHolderOfCollection': {
		input: AlchemyEndpointInputSchemas.nftIsHolderOfCollection,
		output: AlchemyEndpointOutputSchemas.nftIsHolderOfCollection,
	},
	'nft.isAirdrop': {
		input: AlchemyEndpointInputSchemas.nftIsAirdrop,
		output: AlchemyEndpointOutputSchemas.nftIsAirdrop,
	},
	'nft.isAirdropNft': {
		input: AlchemyEndpointInputSchemas.nftIsAirdropNft,
		output: AlchemyEndpointOutputSchemas.nftIsAirdropNft,
	},
	'nft.isHolderOfContract': {
		input: AlchemyEndpointInputSchemas.nftIsHolderOfContract,
		output: AlchemyEndpointOutputSchemas.nftIsHolderOfContract,
	},
	'nft.isSpamContract': {
		input: AlchemyEndpointInputSchemas.nftIsSpamContract,
		output: AlchemyEndpointOutputSchemas.nftIsSpamContract,
	},
	'nft.isSpamContractV3': {
		input: AlchemyEndpointInputSchemas.nftIsSpamContractV3,
		output: AlchemyEndpointOutputSchemas.nftIsSpamContractV3,
	},
	'nft.computeRarityV3': {
		input: AlchemyEndpointInputSchemas.nftComputeRarityV3,
		output: AlchemyEndpointOutputSchemas.nftComputeRarityV3,
	},
	'nft.getCollectionsForOwner': {
		input: AlchemyEndpointInputSchemas.nftGetCollectionsForOwner,
		output: AlchemyEndpointOutputSchemas.nftGetCollectionsForOwner,
	},
	'nft.getContractMetadataBatchV3': {
		input: AlchemyEndpointInputSchemas.nftGetContractMetadataBatchV3,
		output: AlchemyEndpointOutputSchemas.nftGetContractMetadataBatchV3,
	},
	'nft.getContractMetadataV3': {
		input: AlchemyEndpointInputSchemas.nftGetContractMetadataV3,
		output: AlchemyEndpointOutputSchemas.nftGetContractMetadataV3,
	},
	'nft.getContractsForOwnerV3': {
		input: AlchemyEndpointInputSchemas.nftGetContractsForOwnerV3,
		output: AlchemyEndpointOutputSchemas.nftGetContractsForOwnerV3,
	},
	'nft.getCollectionMetadata': {
		input: AlchemyEndpointInputSchemas.nftGetCollectionMetadata,
		output: AlchemyEndpointOutputSchemas.nftGetCollectionMetadata,
	},
	'nft.getFloorPriceV3': {
		input: AlchemyEndpointInputSchemas.nftGetFloorPriceV3,
		output: AlchemyEndpointOutputSchemas.nftGetFloorPriceV3,
	},
	'nft.getNftMetadata': {
		input: AlchemyEndpointInputSchemas.nftGetNftMetadata,
		output: AlchemyEndpointOutputSchemas.nftGetNftMetadata,
	},
	'nft.getNftMetadataBatch': {
		input: AlchemyEndpointInputSchemas.nftGetNftMetadataBatch,
		output: AlchemyEndpointOutputSchemas.nftGetNftMetadataBatch,
	},
	'nft.getOwnersForNftV3': {
		input: AlchemyEndpointInputSchemas.nftGetOwnersForNftV3,
		output: AlchemyEndpointOutputSchemas.nftGetOwnersForNftV3,
	},
	'nft.getNftSalesV3': {
		input: AlchemyEndpointInputSchemas.nftGetNftSalesV3,
		output: AlchemyEndpointOutputSchemas.nftGetNftSalesV3,
	},
	'nft.getNftsForCollectionV3': {
		input: AlchemyEndpointInputSchemas.nftGetNftsForCollectionV3,
		output: AlchemyEndpointOutputSchemas.nftGetNftsForCollectionV3,
	},
	'nft.getNftsForContract': {
		input: AlchemyEndpointInputSchemas.nftGetNftsForContract,
		output: AlchemyEndpointOutputSchemas.nftGetNftsForContract,
	},
	'nft.getNftsForOwner': {
		input: AlchemyEndpointInputSchemas.nftGetNftsForOwner,
		output: AlchemyEndpointOutputSchemas.nftGetNftsForOwner,
	},
	'nft.getOwnersForCollection': {
		input: AlchemyEndpointInputSchemas.nftGetOwnersForCollection,
		output: AlchemyEndpointOutputSchemas.nftGetOwnersForCollection,
	},
	'nft.getOwnersForContract': {
		input: AlchemyEndpointInputSchemas.nftGetOwnersForContract,
		output: AlchemyEndpointOutputSchemas.nftGetOwnersForContract,
	},
	'nft.invalidateContractV3': {
		input: AlchemyEndpointInputSchemas.nftInvalidateContractV3,
		output: AlchemyEndpointOutputSchemas.nftInvalidateContractV3,
	},
	'nft.searchContractMetadataV3': {
		input: AlchemyEndpointInputSchemas.nftSearchContractMetadataV3,
		output: AlchemyEndpointOutputSchemas.nftSearchContractMetadataV3,
	},
	'nft.summarizeNftAttributes': {
		input: AlchemyEndpointInputSchemas.nftSummarizeNftAttributes,
		output: AlchemyEndpointOutputSchemas.nftSummarizeNftAttributes,
	},
	'prices.getHistoricalPrices': {
		input: AlchemyEndpointInputSchemas.pricesGetHistoricalPrices,
		output: AlchemyEndpointOutputSchemas.pricesGetHistoricalPrices,
	},
	'prices.getTokenPricesByAddress': {
		input: AlchemyEndpointInputSchemas.pricesGetTokenPricesByAddress,
		output: AlchemyEndpointOutputSchemas.pricesGetTokenPricesByAddress,
	},
	'prices.getPricesBySymbol': {
		input: AlchemyEndpointInputSchemas.pricesGetPricesBySymbol,
		output: AlchemyEndpointOutputSchemas.pricesGetPricesBySymbol,
	},
	'portfolio.getNftContractsByAddress': {
		input: AlchemyEndpointInputSchemas.portfolioGetNftContractsByAddress,
		output: AlchemyEndpointOutputSchemas.portfolioGetNftContractsByAddress,
	},
	'portfolio.getPortfolioNftsByAddress': {
		input: AlchemyEndpointInputSchemas.portfolioGetPortfolioNftsByAddress,
		output: AlchemyEndpointOutputSchemas.portfolioGetPortfolioNftsByAddress,
	},
	'portfolio.getTokenBalancesByAddress': {
		input: AlchemyEndpointInputSchemas.portfolioGetTokenBalancesByAddress,
		output: AlchemyEndpointOutputSchemas.portfolioGetTokenBalancesByAddress,
	},
	'portfolio.getTokensByAddress': {
		input: AlchemyEndpointInputSchemas.portfolioGetTokensByAddress,
		output: AlchemyEndpointOutputSchemas.portfolioGetTokensByAddress,
	},
	'portfolio.getTransactionsHistoryByAddress': {
		input: AlchemyEndpointInputSchemas.portfolioGetTransactionsHistoryByAddress,
		output:
			AlchemyEndpointOutputSchemas.portfolioGetTransactionsHistoryByAddress,
	},
	'token.getTokenBalances': {
		input: AlchemyEndpointInputSchemas.tokenGetTokenBalances,
		output: AlchemyEndpointOutputSchemas.tokenGetTokenBalances,
	},
	'token.getTokenMetadata': {
		input: AlchemyEndpointInputSchemas.tokenGetTokenMetadata,
		output: AlchemyEndpointOutputSchemas.tokenGetTokenMetadata,
	},
	'rpc.getTransactionCount': {
		input: AlchemyEndpointInputSchemas.rpcGetTransactionCount,
		output: AlchemyEndpointOutputSchemas.rpcGetTransactionCount,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof alchemyEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const alchemyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const alchemyEndpointMeta = {
	'nft.isHolderOfCollection': {
		riskLevel: 'read',
		description: 'Check if a wallet owns any NFT from a collection/contract.',
	},
	'nft.isAirdrop': {
		riskLevel: 'read',
		description: 'Check if an NFT token is marked as an airdrop.',
	},
	'nft.isAirdropNft': {
		riskLevel: 'read',
		description: 'Check whether an NFT was airdropped to its owner.',
	},
	'nft.isHolderOfContract': {
		riskLevel: 'read',
		description: 'Check if a wallet holds any NFT from a contract.',
	},
	'nft.isSpamContract': {
		riskLevel: 'read',
		description: 'Check if an NFT contract is marked as spam.',
	},
	'nft.isSpamContractV3': {
		riskLevel: 'read',
		description: 'Check if an NFT contract is marked as spam (v3).',
	},
	'nft.computeRarityV3': {
		riskLevel: 'read',
		description: 'Compute rarity for each attribute of an NFT.',
	},
	'nft.getCollectionsForOwner': {
		riskLevel: 'read',
		description: 'Get NFT collections held by an owner.',
	},
	'nft.getContractMetadataBatchV3': {
		riskLevel: 'read',
		description: 'Batch-fetch NFT contract metadata.',
	},
	'nft.getContractMetadataV3': {
		riskLevel: 'read',
		description: 'Get metadata for an NFT contract.',
	},
	'nft.getContractsForOwnerV3': {
		riskLevel: 'read',
		description: 'Get NFT contracts owned by an address.',
	},
	'nft.getCollectionMetadata': {
		riskLevel: 'read',
		description: 'Get collection metadata by marketplace slug.',
	},
	'nft.getFloorPriceV3': {
		riskLevel: 'read',
		description: 'Get floor price across marketplaces.',
	},
	'nft.getNftMetadata': {
		riskLevel: 'read',
		description: 'Get metadata for a specific NFT.',
	},
	'nft.getNftMetadataBatch': {
		riskLevel: 'read',
		description: 'Batch-fetch NFT metadata (up to 100).',
	},
	'nft.getOwnersForNftV3': {
		riskLevel: 'read',
		description: 'Get owners for a specific NFT.',
	},
	'nft.getNftSalesV3': {
		riskLevel: 'read',
		description: 'Get NFT sales across marketplaces.',
	},
	'nft.getNftsForCollectionV3': {
		riskLevel: 'read',
		description: 'Get NFTs for a collection slug or contract.',
	},
	'nft.getNftsForContract': {
		riskLevel: 'read',
		description: 'Get NFTs for a contract address.',
	},
	'nft.getNftsForOwner': {
		riskLevel: 'read',
		description: 'Get NFTs owned by an address.',
	},
	'nft.getOwnersForCollection': {
		riskLevel: 'read',
		description: 'Get owners for an NFT collection/contract.',
	},
	'nft.getOwnersForContract': {
		riskLevel: 'read',
		description: 'Get owners for an NFT contract.',
	},
	'nft.invalidateContractV3': {
		riskLevel: 'write',
		description: 'Invalidate cached metadata for an NFT contract.',
	},
	'nft.searchContractMetadataV3': {
		riskLevel: 'read',
		description: 'Search NFT contract metadata by keywords.',
	},
	'nft.summarizeNftAttributes': {
		riskLevel: 'read',
		description: 'Summarize attribute distribution for a collection.',
	},
	'prices.getHistoricalPrices': {
		riskLevel: 'read',
		description: 'Get historical token prices over a time range.',
	},
	'prices.getTokenPricesByAddress': {
		riskLevel: 'read',
		description: 'Get current token prices by address/network.',
	},
	'prices.getPricesBySymbol': {
		riskLevel: 'read',
		description: 'Get current token prices by symbol.',
	},
	'portfolio.getNftContractsByAddress': {
		riskLevel: 'read',
		description: 'Get NFT contracts for wallets across networks.',
	},
	'portfolio.getPortfolioNftsByAddress': {
		riskLevel: 'read',
		description: 'Get portfolio NFTs for wallets across networks.',
	},
	'portfolio.getTokenBalancesByAddress': {
		riskLevel: 'read',
		description: 'Get lightweight token balances across networks.',
	},
	'portfolio.getTokensByAddress': {
		riskLevel: 'read',
		description: 'Get fungible tokens with metadata and prices.',
	},
	'portfolio.getTransactionsHistoryByAddress': {
		riskLevel: 'read',
		description: 'Get transaction history across networks.',
	},
	'token.getTokenBalances': {
		riskLevel: 'read',
		description: 'Get ERC-20 token balances for an address (JSON-RPC).',
	},
	'token.getTokenMetadata': {
		riskLevel: 'read',
		description: 'Get ERC-20 token metadata (JSON-RPC).',
	},
	'rpc.getTransactionCount': {
		riskLevel: 'read',
		description: 'Get transaction count (nonce) for an address.',
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
			if (source !== 'endpoint') {
				return '';
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new Error(
				'Alchemy API key missing. Pass options.key or configure an api_key credential.',
			);
		},
	} satisfies InternalAlchemyPlugin;
}

export {
	ALCHEMY_NETWORKS,
	assertAlchemyNetwork,
	getAlchemyBaseUrl,
} from './client';
export type {
	AlchemyEndpointInputs,
	AlchemyEndpointOutputs,
} from './endpoints/types';
export {
	AlchemyEndpointInputSchemas,
	AlchemyEndpointOutputSchemas,
} from './endpoints/types';
