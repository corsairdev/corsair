import { z } from 'zod';
import {
	StartonCustomGas,
	StartonPaginationMeta,
	StartonSmartContract,
	StartonSmartContractUI,
	StartonSpeed,
	StartonTransaction,
	StartonWallet,
} from '../schema/database';

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

const JsonObject = z.record(z.string(), z.unknown());

/** Smart contract constructor/function argument: string | number | boolean | object. */
const ContractParam = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	JsonObject,
]);

// ─────────────────────────────────────────────────────────────────────────────
// Wallet — POST/GET /v3/kms/wallet
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Official: components.schemas.CreateWalletDto
 * `kmsId` is required — it identifies the Key Management System (e.g. the
 * project's default Starton-managed KMS) the wallet's private key is stored
 * under. Retrieve available KMS ids via the Starton dashboard or `GET /v3/kms`.
 */
const WalletCreateInputSchema = z.object({
	kmsId: z
		.string()
		.describe(
			'Id of the Key Management System the wallet key is stored under. Required. List available KMS via GET /v3/kms.',
		),
	name: z.string().optional().describe('Wallet name on Starton (off-chain).'),
	description: z
		.string()
		.optional()
		.describe('Wallet description on Starton (off-chain).'),
	metadata: JsonObject.optional().describe(
		'Arbitrary JSON stored alongside the wallet.',
	),
});
export type WalletCreateInput = z.infer<typeof WalletCreateInputSchema>;

/**
 * Official: GET /v3/kms/wallet query parameters.
 */
const WalletListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Number of returned page. By default the returned page is the first.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(2500)
		.optional()
		.describe(
			'Number of entities returned on each page. Defaults to 100, maximum 2500.',
		),
	/** Spec pattern: `^[\w\-\s]+$` — the API rejects other characters with a 400. */
	name: z
		.string()
		.regex(/^[\w\-\s]+$/)
		.optional()
		.describe('Filter by wallet name. Letters, digits, -, _ and spaces only.'),
	kmsId: z.string().optional().describe('Filter by Key Management System id.'),
});
export type WalletListInput = z.infer<typeof WalletListInputSchema>;

const WalletListResponseSchema = z.object({
	items: z.array(StartonWallet),
	meta: StartonPaginationMeta,
});
export type WalletListResponse = z.infer<typeof WalletListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Smart Contract — POST /v3/smart-contract/from-template,
// POST /v3/smart-contract/{network}/{address}/call,
// POST /v3/smart-contract/{network}/{address}/read
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Official: components.schemas.DeployFromTemplateDto
 */
const SmartContractDeployFromTemplateInputSchema = z.object({
	network: z
		.string()
		.describe(
			'Network of the smart contract, e.g. `polygon-mumbai`. List via GET /v3/network.',
		),
	signerWallet: z
		.string()
		.describe(
			'Address of the KMS wallet that signs and pays for the transaction.',
		),
	templateId: z
		.string()
		.describe(
			'Starton Library template to deploy, e.g. `ERC20_META_TRANSACTION`. List via GET /v3/smart-contract-template.',
		),
	name: z
		.string()
		.max(255)
		.describe('Contract name on Starton (off-chain). Max 255 characters.'),
	params: z
		.array(ContractParam)
		.default([])
		.describe(
			'Smart contract constructor parameters, in the order the template declares them.',
		),
	description: z
		.string()
		.optional()
		.describe('Contract description on Starton (off-chain).'),
	gasLimit: z.string().optional().describe('Optional gas limit.'),
	speed: StartonSpeed.optional().describe(
		'Gas speed. Defaults to `average`; use `custom` to supply customGas.',
	),
	customGas: StartonCustomGas.optional().describe(
		'Custom gas settings. Only used when speed is set to `custom`.',
	),
	nonce: z
		.number()
		.optional()
		.describe(
			'Manual nonce. If set, the Starton relayer will not assign one automatically.',
		),
	value: z
		.string()
		.optional()
		.describe(
			'Native-currency value sent with the deployment, in wei. For payable constructors.',
		),
	metadata: JsonObject.optional().describe(
		'Arbitrary JSON stored alongside the contract.',
	),
	uiData: StartonSmartContractUI.nullish().describe(
		'Dashboard display metadata Starton stores with the contract.',
	),
	simulate: z
		.boolean()
		.optional()
		.describe(
			'Simulate only: estimates gas and does NOT broadcast a transaction.',
		),
});
export type SmartContractDeployFromTemplateInput = z.infer<
	typeof SmartContractDeployFromTemplateInputSchema
>;

const SmartContractDeployFromTemplateResponseSchema = z.object({
	smartContract: StartonSmartContract,
	transaction: StartonTransaction,
});
export type SmartContractDeployFromTemplateResponse = z.infer<
	typeof SmartContractDeployFromTemplateResponseSchema
>;

/**
 * Official: components.schemas.CallDto
 */
const SmartContractCallInputSchema = z.object({
	network: z
		.string()
		.describe(
			'Network of the smart contract, e.g. `polygon-mumbai`. List via GET /v3/network.',
		),
	address: z.string().describe('Address of the deployed smart contract.'),
	functionName: z
		.string()
		.describe(
			'Name of the contract function to execute. Must be state-changing; use smartContract.read for view functions.',
		),
	params: z
		.array(ContractParam)
		.default([])
		.describe('Function arguments, in the order the ABI declares them.'),
	signerWallet: z
		.string()
		.describe(
			'Address of the KMS wallet that signs and pays for the transaction.',
		),
	speed: StartonSpeed.optional().describe(
		'Gas speed. Defaults to `average`; use `custom` to supply customGas.',
	),
	customGas: StartonCustomGas.optional().describe(
		'Custom gas settings. Only used when speed is set to `custom`.',
	),
	gasLimit: z.string().optional().describe('Optional gas limit.'),
	nonce: z
		.number()
		.optional()
		.describe(
			'Manual nonce. If set, the Starton relayer will not assign one automatically.',
		),
	value: z
		.string()
		.optional()
		.describe('Native-currency value sent with the call, in wei.'),
	simulate: z
		.boolean()
		.optional()
		.describe(
			'Simulate only: estimates gas and does NOT broadcast a transaction.',
		),
});
export type SmartContractCallInput = z.infer<
	typeof SmartContractCallInputSchema
>;

/**
 * Official: components.schemas.ReadDto
 */
const SmartContractReadInputSchema = z.object({
	network: z
		.string()
		.describe(
			'Network of the smart contract, e.g. `polygon-mumbai`. List via GET /v3/network.',
		),
	address: z.string().describe('Address of the deployed smart contract.'),
	functionName: z
		.string()
		.describe('Name of the read-only (view) contract function to call.'),
	params: z
		.array(ContractParam)
		.default([])
		.describe('Function arguments, in the order the ABI declares them.'),
});
export type SmartContractReadInput = z.infer<
	typeof SmartContractReadInputSchema
>;

/**
 * Official: components.schemas.ReadSmartContractResponse
 */
const SmartContractReadResponseSchema = z.object({
	response: z.union([
		z.string(),
		z.number(),
		z.boolean(),
		JsonObject,
		z.array(z.unknown()),
	]),
	params: z.array(ContractParam),
	functionName: z.string(),
	address: z.string(),
	network: z.string(),
});
export type SmartContractReadResponse = z.infer<
	typeof SmartContractReadResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Transaction — GET /v3/transaction/{id}
// ─────────────────────────────────────────────────────────────────────────────

const TransactionGetInputSchema = z.object({
	id: z
		.string()
		.describe(
			'Starton transaction id, as returned by smartContract.call or smartContract.deployFromTemplate.',
		),
});
export type TransactionGetInput = z.infer<typeof TransactionGetInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schema maps
// ─────────────────────────────────────────────────────────────────────────────

export const StartonEndpointInputSchemas = {
	walletCreate: WalletCreateInputSchema,
	walletList: WalletListInputSchema,
	smartContractDeployFromTemplate: SmartContractDeployFromTemplateInputSchema,
	smartContractCall: SmartContractCallInputSchema,
	smartContractRead: SmartContractReadInputSchema,
	transactionGet: TransactionGetInputSchema,
} as const;

export const StartonEndpointOutputSchemas = {
	walletCreate: StartonWallet,
	walletList: WalletListResponseSchema,
	smartContractDeployFromTemplate:
		SmartContractDeployFromTemplateResponseSchema,
	smartContractCall: StartonTransaction,
	smartContractRead: SmartContractReadResponseSchema,
	transactionGet: StartonTransaction,
} as const;

export type StartonEndpointInputs = {
	[K in keyof typeof StartonEndpointInputSchemas]: z.infer<
		(typeof StartonEndpointInputSchemas)[K]
	>;
};

export type StartonEndpointOutputs = {
	[K in keyof typeof StartonEndpointOutputSchemas]: z.infer<
		(typeof StartonEndpointOutputSchemas)[K]
	>;
};
