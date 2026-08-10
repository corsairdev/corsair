import { z } from 'zod';

// ── Common Schemas ────────────────────────────────────────────────────────────

const AlchemyNetworkSchema = z.enum([
	'eth-mainnet',
	'eth-sepolia',
	'polygon-mainnet',
	'arb-mainnet',
	'opt-mainnet',
	'base-mainnet',
]);

const BaseInputSchema = z.object({
	network: AlchemyNetworkSchema.optional(),
});

// ── Core JSON-RPC ─────────────────────────────────────────────────────────────

const GetBlockNumberInputSchema = BaseInputSchema;
export type GetBlockNumberInput = z.infer<typeof GetBlockNumberInputSchema>;

const GetBlockNumberResponseSchema = z.object({
	blockNumber: z.number(),
	hex: z.string(),
});
export type GetBlockNumberResponse = z.infer<
	typeof GetBlockNumberResponseSchema
>;

const GetBlockInputSchema = BaseInputSchema.extend({
	blockHashOrBlockTag: z.string().describe('Block number in hex, hash, or tag like "latest"'),
	fullTransactionObjects: z.boolean().optional().default(false),
});
export type GetBlockInput = z.infer<typeof GetBlockInputSchema>;

const GetBlockResponseSchema = z.object({
	number: z.string().nullable(),
	hash: z.string().nullable(),
	parentHash: z.string(),
	nonce: z.string().nullable(),
	sha3Uncles: z.string(),
	logsBloom: z.string().nullable(),
	transactionsRoot: z.string(),
	stateRoot: z.string(),
	receiptsRoot: z.string(),
	miner: z.string(),
	difficulty: z.string(),
	totalDifficulty: z.string().optional(),
	extraData: z.string(),
	size: z.string(),
	gasLimit: z.string(),
	gasUsed: z.string(),
	timestamp: z.string(),
	transactions: z.array(z.union([z.string(), z.record(z.string(), z.unknown())])),
	uncles: z.array(z.string()),
});
export type GetBlockResponse = z.infer<typeof GetBlockResponseSchema>;

const GetBalanceInputSchema = BaseInputSchema.extend({
	address: z.string(),
	blockTag: z.string().optional().default('latest'),
});
export type GetBalanceInput = z.infer<typeof GetBalanceInputSchema>;

const GetBalanceResponseSchema = z.object({
	balanceHex: z.string(),
});
export type GetBalanceResponse = z.infer<typeof GetBalanceResponseSchema>;

const GetTransactionInputSchema = BaseInputSchema.extend({
	transactionHash: z.string(),
});
export type GetTransactionInput = z.infer<typeof GetTransactionInputSchema>;

const GetTransactionResponseSchema = z.object({
	blockHash: z.string().nullable(),
	blockNumber: z.string().nullable(),
	from: z.string(),
	gas: z.string(),
	gasPrice: z.string(),
	hash: z.string(),
	input: z.string(),
	nonce: z.string(),
	to: z.string().nullable(),
	transactionIndex: z.string().nullable(),
	value: z.string(),
	v: z.string(),
	r: z.string(),
	s: z.string(),
}).passthrough();
export type GetTransactionResponse = z.infer<typeof GetTransactionResponseSchema>;

const GetTransactionReceiptInputSchema = BaseInputSchema.extend({
	transactionHash: z.string(),
});
export type GetTransactionReceiptInput = z.infer<
	typeof GetTransactionReceiptInputSchema
>;

const GetTransactionReceiptResponseSchema = z.object({
	transactionHash: z.string(),
	transactionIndex: z.string(),
	blockHash: z.string(),
	blockNumber: z.string(),
	from: z.string(),
	to: z.string().nullable(),
	cumulativeGasUsed: z.string(),
	gasUsed: z.string(),
	contractAddress: z.string().nullable(),
	logs: z.array(z.record(z.string(), z.unknown())),
	logsBloom: z.string(),
	status: z.string().optional(),
	root: z.string().optional(),
}).passthrough().nullable();
export type GetTransactionReceiptResponse = z.infer<
	typeof GetTransactionReceiptResponseSchema
>;

const CallInputSchema = BaseInputSchema.extend({
	transaction: z.object({
		from: z.string().optional(),
		to: z.string(),
		gas: z.string().optional(),
		gasPrice: z.string().optional(),
		value: z.string().optional(),
		data: z.string().optional(),
	}),
	blockTag: z.string().optional().default('latest'),
});
export type CallInput = z.infer<typeof CallInputSchema>;

const CallResponseSchema = z.object({
	data: z.string(),
});
export type CallResponse = z.infer<typeof CallResponseSchema>;

const SendRawTransactionInputSchema = BaseInputSchema.extend({
	signedTransaction: z.string(),
});
export type SendRawTransactionInput = z.infer<
	typeof SendRawTransactionInputSchema
>;

const SendRawTransactionResponseSchema = z.object({
	transactionHash: z.string(),
});
export type SendRawTransactionResponse = z.infer<
	typeof SendRawTransactionResponseSchema
>;

// ── NFT REST API v3 ───────────────────────────────────────────────────────────

const GetNftsForOwnerInputSchema = BaseInputSchema.extend({
	owner: z.string(),
	contractAddresses: z.array(z.string()).optional(),
	withMetadata: z.boolean().optional(),
	pageKey: z.string().optional(),
	pageSize: z.number().optional(),
});
export type GetNftsForOwnerInput = z.infer<typeof GetNftsForOwnerInputSchema>;

const NftSchema = z.object({
	contract: z.object({
		address: z.string(),
		name: z.string().optional(),
		symbol: z.string().optional(),
		totalSupply: z.string().optional(),
		tokenType: z.string().optional(),
	}).passthrough(),
	tokenId: z.string(),
	tokenType: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	tokenUri: z.string().optional(),
	image: z.object({
		cachedUrl: z.string().optional(),
		thumbnailUrl: z.string().optional(),
		pngUrl: z.string().optional(),
		contentType: z.string().optional(),
		size: z.number().optional(),
		originalUrl: z.string().optional(),
	}).passthrough().optional(),
	raw: z.record(z.string(), z.unknown()).optional(),
	collection: z.record(z.string(), z.unknown()).optional(),
	mint: z.record(z.string(), z.unknown()).optional(),
	owners: z.array(z.string()).optional(),
	timeLastUpdated: z.string().optional(),
	balance: z.string().optional(),
	acquiredAt: z.object({
		blockTimestamp: z.string().optional(),
		blockNumber: z.number().optional(),
	}).passthrough().optional(),
}).passthrough();

const GetNftsForOwnerResponseSchema = z.object({
	ownedNfts: z.array(NftSchema),
	totalCount: z.number().optional(),
	validAt: z.object({
		blockNumber: z.number().optional(),
		blockHash: z.string().optional(),
		blockTimestamp: z.string().optional(),
	}).passthrough().optional(),
	pageKey: z.string().optional(),
});
export type GetNftsForOwnerResponse = z.infer<
	typeof GetNftsForOwnerResponseSchema
>;

const GetNftMetadataInputSchema = BaseInputSchema.extend({
	contractAddress: z.string(),
	tokenId: z.string(),
	tokenType: z.string().optional(),
	refreshCache: z.boolean().optional(),
});
export type GetNftMetadataInput = z.infer<typeof GetNftMetadataInputSchema>;

const GetNftMetadataResponseSchema = NftSchema;
export type GetNftMetadataResponse = z.infer<
	typeof GetNftMetadataResponseSchema
>;

const GetOwnersForNftInputSchema = BaseInputSchema.extend({
	contractAddress: z.string(),
	tokenId: z.string(),
	pageKey: z.string().optional(),
});
export type GetOwnersForNftInput = z.infer<typeof GetOwnersForNftInputSchema>;

const GetOwnersForNftResponseSchema = z.object({
	owners: z.array(z.string()),
	pageKey: z.string().optional(),
});
export type GetOwnersForNftResponse = z.infer<
	typeof GetOwnersForNftResponseSchema
>;

const GetContractMetadataInputSchema = BaseInputSchema.extend({
	contractAddress: z.string(),
});
export type GetContractMetadataInput = z.infer<
	typeof GetContractMetadataInputSchema
>;

const GetContractMetadataResponseSchema = z.object({
	address: z.string(),
	name: z.string().nullable().optional(),
	symbol: z.string().nullable().optional(),
	totalSupply: z.string().nullable().optional(),
	tokenType: z.string().nullable().optional(),
	contractDeployer: z.string().nullable().optional(),
	deployedBlockNumber: z.number().nullable().optional(),
	openSeaMetadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();
export type GetContractMetadataResponse = z.infer<
	typeof GetContractMetadataResponseSchema
>;

// ── Token API (JSON-RPC) ──────────────────────────────────────────────────────

const GetTokenBalancesInputSchema = BaseInputSchema.extend({
	address: z.string(),
	tokenAddresses: z.array(z.string()).optional(),
});
export type GetTokenBalancesInput = z.infer<typeof GetTokenBalancesInputSchema>;

const GetTokenBalancesResponseSchema = z.object({
	address: z.string(),
	tokenBalances: z.array(
		z.object({
			contractAddress: z.string(),
			tokenBalance: z.string().nullable(),
			error: z.string().nullable().optional(),
		}),
	),
});
export type GetTokenBalancesResponse = z.infer<
	typeof GetTokenBalancesResponseSchema
>;

const GetTokenMetadataInputSchema = BaseInputSchema.extend({
	contractAddress: z.string(),
});
export type GetTokenMetadataInput = z.infer<typeof GetTokenMetadataInputSchema>;

const GetTokenMetadataResponseSchema = z.object({
	decimals: z.number().nullable().optional(),
	logo: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	symbol: z.string().nullable().optional(),
}).passthrough();
export type GetTokenMetadataResponse = z.infer<
	typeof GetTokenMetadataResponseSchema
>;

const GetTokenAllowanceInputSchema = BaseInputSchema.extend({
	contract: z.string(),
	owner: z.string(),
	spender: z.string(),
});
export type GetTokenAllowanceInput = z.infer<
	typeof GetTokenAllowanceInputSchema
>;

const GetTokenAllowanceResponseSchema = z.object({
	allowance: z.string(),
});
export type GetTokenAllowanceResponse = z.infer<
	typeof GetTokenAllowanceResponseSchema
>;

// ── Asset Transfers API (JSON-RPC) ────────────────────────────────────────────

const GetAssetTransfersInputSchema = BaseInputSchema.extend({
	fromBlock: z.string().optional(),
	toBlock: z.string().optional(),
	fromAddress: z.string().optional(),
	toAddress: z.string().optional(),
	contractAddresses: z.array(z.string()).optional(),
	category: z.array(z.string()).optional(),
	maxCount: z.number().optional(),
	pageKey: z.string().optional(),
	withMetadata: z.boolean().optional(),
	excludeZeroValue: z.boolean().optional(),
});
export type GetAssetTransfersInput = z.infer<
	typeof GetAssetTransfersInputSchema
>;

const AssetTransferSchema = z.object({
	blockNum: z.string(),
	hash: z.string(),
	from: z.string(),
	to: z.string().nullable(),
	value: z.number().nullable(),
	erc721TokenId: z.string().nullable(),
	erc1155Metadata: z.array(z.record(z.string(), z.unknown())).nullable(),
	asset: z.string().nullable(),
	category: z.string(),
	rawContract: z.object({
		value: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		decimal: z.number().nullable().optional(),
	}).passthrough().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

const GetAssetTransfersResponseSchema = z.object({
	transfers: z.array(AssetTransferSchema),
	pageKey: z.string().optional(),
});
export type GetAssetTransfersResponse = z.infer<
	typeof GetAssetTransfersResponseSchema
>;

// ── Export Map ───────────────────────────────────────────────────────────────

export type AlchemyEndpointInputs = {
	coreGetBlockNumber: GetBlockNumberInput;
	coreGetBlock: GetBlockInput;
	coreGetBalance: GetBalanceInput;
	coreGetTransaction: GetTransactionInput;
	coreGetTransactionReceipt: GetTransactionReceiptInput;
	coreCall: CallInput;
	coreSendRawTransaction: SendRawTransactionInput;
	nftGetNftsForOwner: GetNftsForOwnerInput;
	nftGetNftMetadata: GetNftMetadataInput;
	nftGetOwnersForNft: GetOwnersForNftInput;
	nftGetContractMetadata: GetContractMetadataInput;
	tokenGetTokenBalances: GetTokenBalancesInput;
	tokenGetTokenMetadata: GetTokenMetadataInput;
	tokenGetTokenAllowance: GetTokenAllowanceInput;
	transfersGetAssetTransfers: GetAssetTransfersInput;
};

export type AlchemyEndpointOutputs = {
	coreGetBlockNumber: GetBlockNumberResponse;
	coreGetBlock: GetBlockResponse;
	coreGetBalance: GetBalanceResponse;
	coreGetTransaction: GetTransactionResponse;
	coreGetTransactionReceipt: GetTransactionReceiptResponse;
	coreCall: CallResponse;
	coreSendRawTransaction: SendRawTransactionResponse;
	nftGetNftsForOwner: GetNftsForOwnerResponse;
	nftGetNftMetadata: GetNftMetadataResponse;
	nftGetOwnersForNft: GetOwnersForNftResponse;
	nftGetContractMetadata: GetContractMetadataResponse;
	tokenGetTokenBalances: GetTokenBalancesResponse;
	tokenGetTokenMetadata: GetTokenMetadataResponse;
	tokenGetTokenAllowance: GetTokenAllowanceResponse;
	transfersGetAssetTransfers: GetAssetTransfersResponse;
};

export const AlchemyEndpointInputSchemas = {
	coreGetBlockNumber: GetBlockNumberInputSchema,
	coreGetBlock: GetBlockInputSchema,
	coreGetBalance: GetBalanceInputSchema,
	coreGetTransaction: GetTransactionInputSchema,
	coreGetTransactionReceipt: GetTransactionReceiptInputSchema,
	coreCall: CallInputSchema,
	coreSendRawTransaction: SendRawTransactionInputSchema,
	nftGetNftsForOwner: GetNftsForOwnerInputSchema,
	nftGetNftMetadata: GetNftMetadataInputSchema,
	nftGetOwnersForNft: GetOwnersForNftInputSchema,
	nftGetContractMetadata: GetContractMetadataInputSchema,
	tokenGetTokenBalances: GetTokenBalancesInputSchema,
	tokenGetTokenMetadata: GetTokenMetadataInputSchema,
	tokenGetTokenAllowance: GetTokenAllowanceInputSchema,
	transfersGetAssetTransfers: GetAssetTransfersInputSchema,
} as const;

export const AlchemyEndpointOutputSchemas = {
	coreGetBlockNumber: GetBlockNumberResponseSchema,
	coreGetBlock: GetBlockResponseSchema,
	coreGetBalance: GetBalanceResponseSchema,
	coreGetTransaction: GetTransactionResponseSchema,
	coreGetTransactionReceipt: GetTransactionReceiptResponseSchema,
	coreCall: CallResponseSchema,
	coreSendRawTransaction: SendRawTransactionResponseSchema,
	nftGetNftsForOwner: GetNftsForOwnerResponseSchema,
	nftGetNftMetadata: GetNftMetadataResponseSchema,
	nftGetOwnersForNft: GetOwnersForNftResponseSchema,
	nftGetContractMetadata: GetContractMetadataResponseSchema,
	tokenGetTokenBalances: GetTokenBalancesResponseSchema,
	tokenGetTokenMetadata: GetTokenMetadataResponseSchema,
	tokenGetTokenAllowance: GetTokenAllowanceResponseSchema,
	transfersGetAssetTransfers: GetAssetTransfersResponseSchema,
} as const;
