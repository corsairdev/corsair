import { z } from 'zod';

/**
 * Shared transaction lifecycle status/state enums.
 * Official: components.schemas.Transaction / SmartContract
 * https://github.com/starton-io/starton-openapi
 */
export const StartonTransactionStatus = z.enum([
	'UNSIGNED',
	'ERROR_TX',
	'ERROR_PUBLISH',
	'PUBLISHED',
	'RECEIVED_BY_STARTON',
	'CREATED_BY_STARTON',
	'COULD_NOT_ESTIMATE_GAS_PRICE',
	'COULD_NOT_INCREASE_GAS_PRICE',
	'GAS_PRICE_ESTIMATED',
	'INVALID_GAS_PRICE',
	'REPLACEMENT_GAS_PRICE_UNDERPRICED',
	'COULD_NOT_ESTIMATE_GAS_LIMIT',
	'GAS_LIMIT_ESTIMATED',
	'EXECUTION_WILL_FAIL',
	'INVALID_ARGUMENT',
	'INSUFFICIENT_FUNDS',
	'INSUFFICIENT_FUNDS_AFTER_BROADCAST',
	'COULD_NOT_ASSIGN_NONCE',
	'COULD_NOT_UNSTUCK_NONCE',
	'NONCE_ASSIGNED',
	'NONCE_EXPIRED',
	'COULD_NOT_SIGN',
	'SIGNED',
	'SENT_TO_MEMPOOL',
	'COULD_NOT_BROADCAST',
	'ALREADY_KNOWN',
	'MINED',
	'CONFIRMED',
	'REPLACED',
	'FAILED',
	'MONITORING_IN_PROGRESS',
	'STUCK_BY_PREVIOUS_TRANSACTION',
	'MAX_GAS_PRICE_REACH',
	'GAS_PRICE_INCREASED',
	'NEW_TRANSACTION_HASH',
	'UNKNOWN',
	'MONITORING_INTERRUPTED',
]);
export type StartonTransactionStatus = z.infer<typeof StartonTransactionStatus>;

export const StartonTransactionState = z.enum([
	'SUCCESS',
	'PENDING',
	'MANUAL_ACTION_REQUIRED',
	'ERROR',
]);
export type StartonTransactionState = z.infer<typeof StartonTransactionState>;

export const StartonSpeed = z.enum([
	'low',
	'average',
	'fast',
	'fastest',
	'custom',
]);
export type StartonSpeed = z.infer<typeof StartonSpeed>;

/**
 * Official: components.schemas.CustomGasDto
 */
export const StartonCustomGas = z
	.object({
		gasPrice: z.string().optional(),
		maxFeePerGas: z.string().optional(),
		maxPriorityFeePerGas: z.string().optional(),
	})
	.loose();
export type StartonCustomGas = z.infer<typeof StartonCustomGas>;

/**
 * Official: components.schemas.TransactionLog
 */
export const StartonTransactionLog = z
	.object({
		message: z.string(),
		type: StartonTransactionStatus,
		context: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.string(),
	})
	.loose();
export type StartonTransactionLog = z.infer<typeof StartonTransactionLog>;

/**
 * Starton relayer Transaction object.
 * Official: GET /v3/transaction/{id}
 * https://github.com/starton-io/starton-openapi (components.schemas.Transaction)
 */
export const StartonTransaction = z
	.object({
		id: z.string(),
		blockHash: z.string().nullable().optional(),
		blockNumber: z.number().nullable().optional(),
		chainId: z.number(),
		network: z.string(),
		data: z.string().nullable().optional(),
		from: z.string(),
		gasLimit: z.string().nullable().optional(),
		gasPrice: z.string().nullable().optional(),
		maxFeePerGas: z.string().nullable().optional(),
		maxPriorityFeePerGas: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		nonce: z.number().nullable().optional(),
		type: z.number().nullable().optional(),
		signerWallet: z.string(),
		publishedDate: z.string().nullable().optional(),
		minedDate: z.string().nullable().optional(),
		signedTransaction: z.string().nullable().optional(),
		status: StartonTransactionStatus,
		state: StartonTransactionState,
		speed: StartonSpeed.nullable().optional(),
		logs: z.array(StartonTransactionLog),
		to: z.string().nullable().optional(),
		transactionHash: z.string().nullable().optional(),
		value: z.string(),
		automaticNonce: z.boolean(),
		isDeployTransaction: z.boolean(),
		projectId: z.string(),
		parentTransaction: z.string().nullable().optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.loose();
export type StartonTransaction = z.infer<typeof StartonTransaction>;

/**
 * Starton KMS-managed Wallet object.
 * Official: GET/POST /v3/kms/wallet
 * https://github.com/starton-io/starton-openapi (components.schemas.Wallet)
 */
export const StartonWallet = z
	.object({
		address: z.string(),
		providerKeyId: z.string(),
		kmsId: z.string(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		projectId: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.loose();
export type StartonWallet = z.infer<typeof StartonWallet>;

/**
 * Dashboard/UI metadata Starton stores alongside a contract.
 * Official: components.schemas.SmartContractUIDto
 */
export const StartonSmartContractUI = z
	.object({
		version: z.literal('1'),
		deployMethod: z.enum(['web3', 'kms']),
		imported: z.boolean(),
		deployType: z.string().optional(),
		chainId: z.number().optional(),
	})
	.loose();
export type StartonSmartContractUI = z.infer<typeof StartonSmartContractUI>;

/**
 * Deployed/managed Smart Contract object.
 * Official: GET /v3/smart-contract/{network}/{address}
 * https://github.com/starton-io/starton-openapi (components.schemas.SmartContract)
 */
export const StartonSmartContract = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
		network: z.string(),
		abi: z.array(z.record(z.string(), z.unknown())).optional(),
		address: z.string(),
		params: z.array(z.string()).nullable().optional(),
		compilationDetails: z.record(z.string(), z.unknown()).nullable().optional(),
		creationHash: z.string().nullable().optional(),
		status: StartonTransactionStatus,
		state: StartonTransactionState,
		minedDate: z.string().nullable().optional(),
		blockNumber: z.number().nullable().optional(),
		templateId: z.string().nullable().optional(),
		projectId: z.string(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		uiData: StartonSmartContractUI.nullable().optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.loose();
export type StartonSmartContract = z.infer<typeof StartonSmartContract>;

/**
 * Official: components.schemas.PaginationData
 */
export const StartonPaginationMeta = z
	.object({
		itemCount: z.number(),
		totalItems: z.number().optional(),
		itemsPerPage: z.number(),
		totalPages: z.number().optional(),
		currentPage: z.number(),
	})
	.loose();
export type StartonPaginationMeta = z.infer<typeof StartonPaginationMeta>;
