import { z } from 'zod';
import { ALCHEMY_NETWORKS } from '../client';

const AlchemyNetworkSchema = z.enum(ALCHEMY_NETWORKS);
const BaseInputSchema = z.object({
	network: AlchemyNetworkSchema.optional(),
});

const AddressNetworkPairSchema = z.object({
	address: z.string(),
	networks: z.array(z.string()).min(1),
});

const OpenSeaMetadataSchema = z
	.object({
		collectionName: z.string().nullable().optional(),
		collectionSlug: z.string().nullable().optional(),
		safelistRequestStatus: z.string().nullable().optional(),
		imageUrl: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		externalUrl: z.string().nullable().optional(),
		twitterUsername: z.string().nullable().optional(),
		discordUrl: z.string().nullable().optional(),
		bannerImageUrl: z.string().nullable().optional(),
		floorPrice: z.number().nullable().optional(),
	})
	.passthrough()
	.optional();

const NftContractSchema = z
	.object({
		address: z.string(),
		name: z.string().nullable().optional(),
		symbol: z.string().nullable().optional(),
		totalSupply: z.string().nullable().optional(),
		tokenType: z.string().nullable().optional(),
		contractDeployer: z.string().nullable().optional(),
		deployedBlockNumber: z.number().nullable().optional(),
		openSeaMetadata: OpenSeaMetadataSchema,
		isSpam: z.boolean().nullable().optional(),
		spamClassifications: z.array(z.string()).optional(),
	})
	.passthrough();

const NftImageSchema = z
	.object({
		cachedUrl: z.string().nullable().optional(),
		thumbnailUrl: z.string().nullable().optional(),
		pngUrl: z.string().nullable().optional(),
		contentType: z.string().nullable().optional(),
		size: z.number().nullable().optional(),
		originalUrl: z.string().nullable().optional(),
	})
	.passthrough()
	.optional();

/** Shape from Alchemy NFT API getNFTMetadata / ownedNfts items. */
export const AlchemyNftSchema = z
	.object({
		contract: NftContractSchema.optional(),
		contractAddress: z.string().optional(),
		tokenId: z.string(),
		tokenType: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		tokenUri: z.string().nullable().optional(),
		image: NftImageSchema,
		animation: z.record(z.string(), z.unknown()).nullable().optional(),
		raw: z.record(z.string(), z.unknown()).optional(),
		collection: z.record(z.string(), z.unknown()).nullable().optional(),
		mint: z.record(z.string(), z.unknown()).nullable().optional(),
		owners: z.array(z.string()).nullable().optional(),
		timeLastUpdated: z.string().nullable().optional(),
		balance: z.string().nullable().optional(),
		acquiredAt: z.record(z.string(), z.unknown()).nullable().optional(),
		network: z.string().optional(),
		address: z.string().optional(),
		isSpam: z.boolean().nullable().optional(),
		spamClassifications: z.array(z.string()).optional(),
	})
	.passthrough();

const LooseObject = z.record(z.string(), z.unknown());

// ── NFT ownership / spam ─────────────────────────────────────────────────────

const HolderInput = BaseInputSchema.extend({
	wallet: z.string(),
	contractAddress: z.string(),
});
const HolderResponse = z
	.object({ isHolderOfContract: z.boolean() })
	.passthrough();

const AirdropInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	tokenId: z.string(),
});
const AirdropResponse = z.boolean();

const SpamInput = BaseInputSchema.extend({
	contractAddress: z.string(),
});
const SpamResponse = z.boolean();

const ComputeRarityInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	tokenId: z.string(),
});
const ComputeRarityResponse = z
	.object({
		rarities: z
			.array(
				z
					.object({
						traitType: z.string().optional(),
						value: z.union([z.string(), z.number()]).optional(),
						prevalence: z.number().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const GetCollectionsForOwnerInput = BaseInputSchema.extend({
	owner: z.string(),
	withMetadata: z.boolean().optional(),
	includeFilters: z.array(z.string()).optional(),
	excludeFilters: z.array(z.string()).optional(),
	pageKey: z.string().optional(),
	pageSize: z.number().optional(),
});
const GetCollectionsForOwnerResponse = z
	.object({
		collections: z.array(LooseObject).optional(),
		totalCount: z.number().optional(),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const GetContractMetadataBatchInput = BaseInputSchema.extend({
	contractAddresses: z.array(z.string()).min(1),
});
const GetContractMetadataBatchResponse = z
	.object({
		contracts: z.array(NftContractSchema).optional(),
	})
	.passthrough();

const GetContractMetadataInput = BaseInputSchema.extend({
	contractAddress: z.string(),
});
const GetContractMetadataResponse = NftContractSchema;

const GetContractsForOwnerInput = BaseInputSchema.extend({
	owner: z.string(),
	withMetadata: z.boolean().optional(),
	includeFilters: z.array(z.string()).optional(),
	excludeFilters: z.array(z.string()).optional(),
	pageKey: z.string().optional(),
	pageSize: z.number().optional(),
	orderBy: z.string().optional(),
});
const GetContractsForOwnerResponse = z
	.object({
		contracts: z.array(LooseObject).optional(),
		totalCount: z.number().optional(),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const GetCollectionMetadataInput = BaseInputSchema.extend({
	collectionSlug: z.string(),
});
const GetCollectionMetadataResponse = LooseObject;

const GetFloorPriceInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	collectionSlug: z.string().optional(),
});
const GetFloorPriceResponse = LooseObject;

const GetNftMetadataInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	tokenId: z.string(),
	tokenType: z.enum(['ERC721', 'ERC1155']).optional(),
	tokenUriTimeoutInMs: z.number().optional(),
	refreshCache: z.boolean().optional(),
});
const GetNftMetadataResponse = AlchemyNftSchema;

const GetNftMetadataBatchInput = BaseInputSchema.extend({
	tokens: z
		.array(
			z.object({
				contractAddress: z.string(),
				tokenId: z.string(),
				tokenType: z.enum(['ERC721', 'ERC1155']).optional(),
			}),
		)
		.min(1)
		.max(100),
	tokenUriTimeoutInMs: z.number().optional(),
	refreshCache: z.boolean().optional(),
});
const GetNftMetadataBatchResponse = z
	.object({ nfts: z.array(AlchemyNftSchema).optional() })
	.passthrough();

const GetOwnersForNftInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	tokenId: z.string(),
	pageKey: z.string().optional(),
});
const GetOwnersForNftResponse = z
	.object({
		owners: z.array(z.string()),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const GetNftSalesInput = BaseInputSchema.extend({
	fromBlock: z.union([z.string(), z.number()]).optional(),
	toBlock: z.union([z.string(), z.number()]).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	marketplace: z.string().optional(),
	contractAddress: z.string().optional(),
	tokenId: z.string().optional(),
	buyerAddress: z.string().optional(),
	sellerAddress: z.string().optional(),
	taker: z.enum(['BUYER', 'SELLER']).optional(),
	limit: z.number().optional(),
	pageKey: z.string().optional(),
});
const GetNftSalesResponse = z
	.object({
		nftSales: z.array(LooseObject).optional(),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const GetNftsForCollectionInput = BaseInputSchema.extend({
	collectionSlug: z.string().optional(),
	contractAddress: z.string().optional(),
	withMetadata: z.boolean().optional(),
	startToken: z.string().optional(),
	limit: z.number().optional(),
	tokenUriTimeoutInMs: z.number().optional(),
}).refine((v) => Boolean(v.collectionSlug || v.contractAddress), {
	message: 'Provide collectionSlug or contractAddress',
});
const GetNftsForCollectionResponse = z
	.object({
		nfts: z.array(AlchemyNftSchema).optional(),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const GetNftsForContractInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	withMetadata: z.boolean().optional(),
	startToken: z.string().optional(),
	limit: z.number().optional(),
	tokenUriTimeoutInMs: z.number().optional(),
});
const GetNftsForContractResponse = GetNftsForCollectionResponse;

const GetNftsForOwnerInput = BaseInputSchema.extend({
	owner: z.string(),
	contractAddresses: z.array(z.string()).optional(),
	withMetadata: z.boolean().optional(),
	orderBy: z.string().optional(),
	excludeFilters: z.array(z.string()).optional(),
	includeFilters: z.array(z.string()).optional(),
	spamConfidenceLevel: z.string().optional(),
	tokenUriTimeoutInMs: z.number().optional(),
	pageKey: z.string().optional(),
	pageSize: z.number().optional(),
});
const GetNftsForOwnerResponse = z
	.object({
		ownedNfts: z.array(AlchemyNftSchema),
		totalCount: z.number().optional(),
		validAt: LooseObject.optional(),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const GetOwnersForContractInput = BaseInputSchema.extend({
	contractAddress: z.string(),
	withTokenBalances: z.boolean().optional(),
	block: z.string().optional(),
	pageKey: z.string().optional(),
});
const GetOwnersForContractResponse = z
	.object({
		owners: z.array(z.union([z.string(), LooseObject])),
		pageKey: z.string().nullable().optional(),
	})
	.passthrough();

const InvalidateContractInput = BaseInputSchema.extend({
	contractAddress: z.string(),
});
const InvalidateContractResponse = z
	.object({
		/** Docs return string "true"/"false", not a JSON boolean. */
		success: z.union([z.boolean(), z.string()]).optional(),
		numTokensInvalidated: z.number().optional(),
		message: z.string().optional(),
	})
	.passthrough();

const SearchContractMetadataInput = BaseInputSchema.extend({
	query: z.string(),
});
const SearchContractMetadataResponse = z
	.object({ contracts: z.array(NftContractSchema).optional() })
	.passthrough();

const SummarizeNftAttributesInput = BaseInputSchema.extend({
	contractAddress: z.string(),
});
const SummarizeNftAttributesResponse = LooseObject;

// ── Prices ───────────────────────────────────────────────────────────────────

const GetHistoricalPricesInput = z
	.object({
		symbol: z.string().optional(),
		network: z.string().optional(),
		address: z.string().optional(),
		startTime: z.union([z.string(), z.number()]),
		endTime: z.union([z.string(), z.number()]),
		interval: z.enum(['5m', '1h', '1d']).optional(),
		withMarketData: z.boolean().optional(),
	})
	.refine(
		(v) => {
			const bySymbol = Boolean(v.symbol) && !v.network && !v.address;
			const byAddress = !v.symbol && Boolean(v.network && v.address);
			return bySymbol || byAddress;
		},
		{
			message:
				'Provide either symbol OR both network and address (not both methods)',
		},
	);
const GetHistoricalPricesResponse = z
	.object({
		symbol: z.string().optional(),
		network: z.string().optional(),
		address: z.string().optional(),
		currency: z.string().optional(),
		data: z.array(
			z
				.object({
					value: z.string(),
					timestamp: z.string(),
					marketCap: z.string().optional(),
					totalVolume: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

const GetTokenPricesByAddressInput = z.object({
	addresses: z
		.array(
			z.object({
				network: z.string(),
				address: z.string(),
			}),
		)
		.min(1)
		.max(25),
});
const GetTokenPricesByAddressResponse = z
	.object({
		data: z.array(
			z
				.object({
					network: z.string().optional(),
					address: z.string().optional(),
					prices: z
						.array(
							z
								.object({
									currency: z.string(),
									value: z.string(),
									lastUpdatedAt: z.string(),
								})
								.passthrough(),
						)
						.optional(),
					error: LooseObject.optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

const GetPricesBySymbolInput = z.object({
	symbols: z.array(z.string()).min(1).max(25),
});
const GetPricesBySymbolResponse = z
	.object({
		data: z.array(
			z
				.object({
					symbol: z.string(),
					prices: z
						.array(
							z
								.object({
									currency: z.string(),
									value: z.string(),
									lastUpdatedAt: z.string(),
								})
								.passthrough(),
						)
						.optional(),
					error: LooseObject.optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

// ── Portfolio / Data API ─────────────────────────────────────────────────────

const PortfolioAddressesInput = z.object({
	addresses: z.array(AddressNetworkPairSchema).min(1),
	withMetadata: z.boolean().optional(),
	pageKey: z.string().optional(),
	pageSize: z.number().optional(),
	orderBy: z.string().optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
});

const GetNftContractsByAddressInput = PortfolioAddressesInput;
const GetNftContractsByAddressResponse = z
	.object({
		data: z
			.object({
				contracts: z.array(LooseObject).optional(),
				totalCount: z.number().optional(),
				pageKey: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

const GetPortfolioNftsByAddressInput = PortfolioAddressesInput.extend({
	excludeFilters: z.array(z.string()).optional(),
	includeFilters: z.array(z.string()).optional(),
	spamConfidenceLevel: z.string().optional(),
});
const GetPortfolioNftsByAddressResponse = z
	.object({
		data: z
			.object({
				ownedNfts: z.array(AlchemyNftSchema).optional(),
				totalCount: z.number().optional(),
				pageKey: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

const GetTokenBalancesByAddressInput = z.object({
	addresses: z.array(AddressNetworkPairSchema).min(1).max(3),
	includeNativeTokens: z.boolean().optional(),
	includeErc20Tokens: z.boolean().optional(),
	pageKey: z.string().optional(),
});
const GetTokenBalancesByAddressResponse = z
	.object({
		data: z
			.object({
				tokens: z
					.array(
						z
							.object({
								network: z.string(),
								address: z.string(),
								tokenAddress: z.string().nullable().optional(),
								tokenBalance: z.string(),
							})
							.passthrough(),
					)
					.optional(),
				pageKey: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

const GetTokensByAddressInput = z.object({
	addresses: z.array(AddressNetworkPairSchema).min(1).max(2),
	withMetadata: z.boolean().optional(),
	withPrices: z.boolean().optional(),
	includeNativeTokens: z.boolean().optional(),
	includeErc20Tokens: z.boolean().optional(),
	pageKey: z.string().optional(),
});
const GetTokensByAddressResponse = z
	.object({
		data: z
			.object({
				tokens: z
					.array(
						z
							.object({
								network: z.string(),
								address: z.string(),
								tokenAddress: z.string().nullable().optional(),
								tokenBalance: z.string(),
								tokenMetadata: LooseObject.optional(),
								tokenPrices: z.array(LooseObject).optional(),
								error: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				pageKey: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

const GetTransactionsHistoryByAddressInput = z.object({
	addresses: z.array(AddressNetworkPairSchema).min(1).max(1),
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().max(50).optional(),
});
const GetTransactionsHistoryByAddressResponse = z
	.object({
		transactions: z.array(LooseObject).optional(),
		before: z.string().optional(),
		after: z.string().optional(),
		totalCount: z.number().optional(),
	})
	.passthrough();

// ── Token JSON-RPC ───────────────────────────────────────────────────────────

const GetTokenBalancesInput = BaseInputSchema.extend({
	address: z.string(),
	tokenAddresses: z.array(z.string()).optional(),
});
const GetTokenBalancesResponse = z
	.object({
		address: z.string(),
		tokenBalances: z.array(
			z.object({
				contractAddress: z.string(),
				tokenBalance: z.string().nullable(),
				error: z.string().nullable().optional(),
			}),
		),
	})
	.passthrough();

const GetTokenMetadataInput = BaseInputSchema.extend({
	contractAddress: z.string(),
});
const GetTokenMetadataResponse = z
	.object({
		decimals: z.number().nullable().optional(),
		logo: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		symbol: z.string().nullable().optional(),
	})
	.passthrough();

const GetTransactionCountInput = BaseInputSchema.extend({
	address: z.string(),
	blockTag: z.string().optional().default('latest'),
});
const GetTransactionCountResponse = z.object({
	count: z.number(),
	hex: z.string(),
});

export type AlchemyEndpointInputs = {
	nftIsHolderOfCollection: z.infer<typeof HolderInput>;
	nftIsAirdrop: z.infer<typeof AirdropInput>;
	nftIsAirdropNft: z.infer<typeof AirdropInput>;
	nftIsHolderOfContract: z.infer<typeof HolderInput>;
	nftIsSpamContract: z.infer<typeof SpamInput>;
	nftIsSpamContractV3: z.infer<typeof SpamInput>;
	nftComputeRarityV3: z.infer<typeof ComputeRarityInput>;
	nftGetCollectionsForOwner: z.infer<typeof GetCollectionsForOwnerInput>;
	nftGetContractMetadataBatchV3: z.infer<typeof GetContractMetadataBatchInput>;
	nftGetContractMetadataV3: z.infer<typeof GetContractMetadataInput>;
	nftGetContractsForOwnerV3: z.infer<typeof GetContractsForOwnerInput>;
	nftGetCollectionMetadata: z.infer<typeof GetCollectionMetadataInput>;
	nftGetFloorPriceV3: z.infer<typeof GetFloorPriceInput>;
	nftGetNftMetadata: z.infer<typeof GetNftMetadataInput>;
	nftGetNftMetadataBatch: z.infer<typeof GetNftMetadataBatchInput>;
	nftGetOwnersForNftV3: z.infer<typeof GetOwnersForNftInput>;
	nftGetNftSalesV3: z.infer<typeof GetNftSalesInput>;
	nftGetNftsForCollectionV3: z.infer<typeof GetNftsForCollectionInput>;
	nftGetNftsForContract: z.infer<typeof GetNftsForContractInput>;
	nftGetNftsForOwner: z.infer<typeof GetNftsForOwnerInput>;
	nftGetOwnersForCollection: z.infer<typeof GetOwnersForContractInput>;
	nftGetOwnersForContract: z.infer<typeof GetOwnersForContractInput>;
	nftInvalidateContractV3: z.infer<typeof InvalidateContractInput>;
	nftSearchContractMetadataV3: z.infer<typeof SearchContractMetadataInput>;
	nftSummarizeNftAttributes: z.infer<typeof SummarizeNftAttributesInput>;
	pricesGetHistoricalPrices: z.infer<typeof GetHistoricalPricesInput>;
	pricesGetTokenPricesByAddress: z.infer<typeof GetTokenPricesByAddressInput>;
	pricesGetPricesBySymbol: z.infer<typeof GetPricesBySymbolInput>;
	portfolioGetNftContractsByAddress: z.infer<
		typeof GetNftContractsByAddressInput
	>;
	portfolioGetPortfolioNftsByAddress: z.infer<
		typeof GetPortfolioNftsByAddressInput
	>;
	portfolioGetTokenBalancesByAddress: z.infer<
		typeof GetTokenBalancesByAddressInput
	>;
	portfolioGetTokensByAddress: z.infer<typeof GetTokensByAddressInput>;
	portfolioGetTransactionsHistoryByAddress: z.infer<
		typeof GetTransactionsHistoryByAddressInput
	>;
	tokenGetTokenBalances: z.infer<typeof GetTokenBalancesInput>;
	tokenGetTokenMetadata: z.infer<typeof GetTokenMetadataInput>;
	rpcGetTransactionCount: z.infer<typeof GetTransactionCountInput>;
};

export type AlchemyEndpointOutputs = {
	nftIsHolderOfCollection: z.infer<typeof HolderResponse>;
	nftIsAirdrop: z.infer<typeof AirdropResponse>;
	nftIsAirdropNft: z.infer<typeof AirdropResponse>;
	nftIsHolderOfContract: z.infer<typeof HolderResponse>;
	nftIsSpamContract: z.infer<typeof SpamResponse>;
	nftIsSpamContractV3: z.infer<typeof SpamResponse>;
	nftComputeRarityV3: z.infer<typeof ComputeRarityResponse>;
	nftGetCollectionsForOwner: z.infer<typeof GetCollectionsForOwnerResponse>;
	nftGetContractMetadataBatchV3: z.infer<
		typeof GetContractMetadataBatchResponse
	>;
	nftGetContractMetadataV3: z.infer<typeof GetContractMetadataResponse>;
	nftGetContractsForOwnerV3: z.infer<typeof GetContractsForOwnerResponse>;
	nftGetCollectionMetadata: z.infer<typeof GetCollectionMetadataResponse>;
	nftGetFloorPriceV3: z.infer<typeof GetFloorPriceResponse>;
	nftGetNftMetadata: z.infer<typeof GetNftMetadataResponse>;
	nftGetNftMetadataBatch: z.infer<typeof GetNftMetadataBatchResponse>;
	nftGetOwnersForNftV3: z.infer<typeof GetOwnersForNftResponse>;
	nftGetNftSalesV3: z.infer<typeof GetNftSalesResponse>;
	nftGetNftsForCollectionV3: z.infer<typeof GetNftsForCollectionResponse>;
	nftGetNftsForContract: z.infer<typeof GetNftsForContractResponse>;
	nftGetNftsForOwner: z.infer<typeof GetNftsForOwnerResponse>;
	nftGetOwnersForCollection: z.infer<typeof GetOwnersForContractResponse>;
	nftGetOwnersForContract: z.infer<typeof GetOwnersForContractResponse>;
	nftInvalidateContractV3: z.infer<typeof InvalidateContractResponse>;
	nftSearchContractMetadataV3: z.infer<typeof SearchContractMetadataResponse>;
	nftSummarizeNftAttributes: z.infer<typeof SummarizeNftAttributesResponse>;
	pricesGetHistoricalPrices: z.infer<typeof GetHistoricalPricesResponse>;
	pricesGetTokenPricesByAddress: z.infer<
		typeof GetTokenPricesByAddressResponse
	>;
	pricesGetPricesBySymbol: z.infer<typeof GetPricesBySymbolResponse>;
	portfolioGetNftContractsByAddress: z.infer<
		typeof GetNftContractsByAddressResponse
	>;
	portfolioGetPortfolioNftsByAddress: z.infer<
		typeof GetPortfolioNftsByAddressResponse
	>;
	portfolioGetTokenBalancesByAddress: z.infer<
		typeof GetTokenBalancesByAddressResponse
	>;
	portfolioGetTokensByAddress: z.infer<typeof GetTokensByAddressResponse>;
	portfolioGetTransactionsHistoryByAddress: z.infer<
		typeof GetTransactionsHistoryByAddressResponse
	>;
	tokenGetTokenBalances: z.infer<typeof GetTokenBalancesResponse>;
	tokenGetTokenMetadata: z.infer<typeof GetTokenMetadataResponse>;
	rpcGetTransactionCount: z.infer<typeof GetTransactionCountResponse>;
};

export const AlchemyEndpointInputSchemas = {
	nftIsHolderOfCollection: HolderInput,
	nftIsAirdrop: AirdropInput,
	nftIsAirdropNft: AirdropInput,
	nftIsHolderOfContract: HolderInput,
	nftIsSpamContract: SpamInput,
	nftIsSpamContractV3: SpamInput,
	nftComputeRarityV3: ComputeRarityInput,
	nftGetCollectionsForOwner: GetCollectionsForOwnerInput,
	nftGetContractMetadataBatchV3: GetContractMetadataBatchInput,
	nftGetContractMetadataV3: GetContractMetadataInput,
	nftGetContractsForOwnerV3: GetContractsForOwnerInput,
	nftGetCollectionMetadata: GetCollectionMetadataInput,
	nftGetFloorPriceV3: GetFloorPriceInput,
	nftGetNftMetadata: GetNftMetadataInput,
	nftGetNftMetadataBatch: GetNftMetadataBatchInput,
	nftGetOwnersForNftV3: GetOwnersForNftInput,
	nftGetNftSalesV3: GetNftSalesInput,
	nftGetNftsForCollectionV3: GetNftsForCollectionInput,
	nftGetNftsForContract: GetNftsForContractInput,
	nftGetNftsForOwner: GetNftsForOwnerInput,
	nftGetOwnersForCollection: GetOwnersForContractInput,
	nftGetOwnersForContract: GetOwnersForContractInput,
	nftInvalidateContractV3: InvalidateContractInput,
	nftSearchContractMetadataV3: SearchContractMetadataInput,
	nftSummarizeNftAttributes: SummarizeNftAttributesInput,
	pricesGetHistoricalPrices: GetHistoricalPricesInput,
	pricesGetTokenPricesByAddress: GetTokenPricesByAddressInput,
	pricesGetPricesBySymbol: GetPricesBySymbolInput,
	portfolioGetNftContractsByAddress: GetNftContractsByAddressInput,
	portfolioGetPortfolioNftsByAddress: GetPortfolioNftsByAddressInput,
	portfolioGetTokenBalancesByAddress: GetTokenBalancesByAddressInput,
	portfolioGetTokensByAddress: GetTokensByAddressInput,
	portfolioGetTransactionsHistoryByAddress:
		GetTransactionsHistoryByAddressInput,
	tokenGetTokenBalances: GetTokenBalancesInput,
	tokenGetTokenMetadata: GetTokenMetadataInput,
	rpcGetTransactionCount: GetTransactionCountInput,
} as const;

export const AlchemyEndpointOutputSchemas = {
	nftIsHolderOfCollection: HolderResponse,
	nftIsAirdrop: AirdropResponse,
	nftIsAirdropNft: AirdropResponse,
	nftIsHolderOfContract: HolderResponse,
	nftIsSpamContract: SpamResponse,
	nftIsSpamContractV3: SpamResponse,
	nftComputeRarityV3: ComputeRarityResponse,
	nftGetCollectionsForOwner: GetCollectionsForOwnerResponse,
	nftGetContractMetadataBatchV3: GetContractMetadataBatchResponse,
	nftGetContractMetadataV3: GetContractMetadataResponse,
	nftGetContractsForOwnerV3: GetContractsForOwnerResponse,
	nftGetCollectionMetadata: GetCollectionMetadataResponse,
	nftGetFloorPriceV3: GetFloorPriceResponse,
	nftGetNftMetadata: GetNftMetadataResponse,
	nftGetNftMetadataBatch: GetNftMetadataBatchResponse,
	nftGetOwnersForNftV3: GetOwnersForNftResponse,
	nftGetNftSalesV3: GetNftSalesResponse,
	nftGetNftsForCollectionV3: GetNftsForCollectionResponse,
	nftGetNftsForContract: GetNftsForContractResponse,
	nftGetNftsForOwner: GetNftsForOwnerResponse,
	nftGetOwnersForCollection: GetOwnersForContractResponse,
	nftGetOwnersForContract: GetOwnersForContractResponse,
	nftInvalidateContractV3: InvalidateContractResponse,
	nftSearchContractMetadataV3: SearchContractMetadataResponse,
	nftSummarizeNftAttributes: SummarizeNftAttributesResponse,
	pricesGetHistoricalPrices: GetHistoricalPricesResponse,
	pricesGetTokenPricesByAddress: GetTokenPricesByAddressResponse,
	pricesGetPricesBySymbol: GetPricesBySymbolResponse,
	portfolioGetNftContractsByAddress: GetNftContractsByAddressResponse,
	portfolioGetPortfolioNftsByAddress: GetPortfolioNftsByAddressResponse,
	portfolioGetTokenBalancesByAddress: GetTokenBalancesByAddressResponse,
	portfolioGetTokensByAddress: GetTokensByAddressResponse,
	portfolioGetTransactionsHistoryByAddress:
		GetTransactionsHistoryByAddressResponse,
	tokenGetTokenBalances: GetTokenBalancesResponse,
	tokenGetTokenMetadata: GetTokenMetadataResponse,
	rpcGetTransactionCount: GetTransactionCountResponse,
} as const;
