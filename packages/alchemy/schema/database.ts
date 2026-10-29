import { z } from 'zod';

/**
 * Local cache of NFT contract metadata from Alchemy NFT API
 * (`getContractMetadata` / portfolio NFT contracts).
 * Docs: https://www.alchemy.com/docs/data/nft-api/nft-api-endpoints/nft-api-endpoints/get-contract-metadata
 */
export const AlchemyNftContract = z.object({
	address: z.string(),
	network: z.string().optional(),
	name: z.string().nullable().optional(),
	symbol: z.string().nullable().optional(),
	totalSupply: z.string().nullable().optional(),
	tokenType: z.string().nullable().optional(),
	contractDeployer: z.string().nullable().optional(),
	deployedBlockNumber: z.number().nullable().optional(),
	/** OpenSea collectionName when present. */
	collectionName: z.string().nullable().optional(),
	collectionSlug: z.string().nullable().optional(),
	floorPrice: z.number().nullable().optional(),
	isSpam: z.boolean().nullable().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local cache of a single NFT token from `getNFTMetadata` / portfolio NFTs.
 * Docs: https://www.alchemy.com/docs/data/nft-api/nft-api-endpoints/nft-api-endpoints/get-nft-metadata
 */
export const AlchemyNft = z.object({
	network: z.string().optional(),
	contractAddress: z.string(),
	tokenId: z.string(),
	tokenType: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	tokenUri: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	collectionSlug: z.string().nullable().optional(),
	ownerAddress: z.string().nullable().optional(),
	balance: z.string().nullable().optional(),
	isSpam: z.boolean().nullable().optional(),
	timeLastUpdated: z.string().nullable().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local cache of ERC-20 / native token metadata from `alchemy_getTokenMetadata`
 * or Portfolio `tokens/by-address`.
 * Docs: https://www.alchemy.com/docs/reference/token-api
 */
export const AlchemyToken = z.object({
	network: z.string().optional(),
	/** Null for native gas tokens in Portfolio responses. */
	contractAddress: z.string().nullable(),
	name: z.string().nullable().optional(),
	symbol: z.string().nullable().optional(),
	decimals: z.number().nullable().optional(),
	logo: z.string().nullable().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local cache of a token price quote from Prices API
 * (`tokens/by-symbol` / `tokens/by-address`).
 * Docs: https://www.alchemy.com/docs/data/prices-api
 */
export const AlchemyTokenPrice = z.object({
	symbol: z.string().nullable().optional(),
	network: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	currency: z.string(),
	value: z.string(),
	lastUpdatedAt: z.string(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local cache of a wallet token balance (Portfolio balances or Token API).
 */
export const AlchemyTokenBalance = z.object({
	network: z.string(),
	walletAddress: z.string(),
	tokenAddress: z.string().nullable().optional(),
	tokenBalance: z.string(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type AlchemyNftContract = z.infer<typeof AlchemyNftContract>;
export type AlchemyNft = z.infer<typeof AlchemyNft>;
export type AlchemyToken = z.infer<typeof AlchemyToken>;
export type AlchemyTokenPrice = z.infer<typeof AlchemyTokenPrice>;
export type AlchemyTokenBalance = z.infer<typeof AlchemyTokenBalance>;
