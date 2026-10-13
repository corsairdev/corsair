import { z } from 'zod';
import {
	StartonCustomGas,
	StartonPaginationMeta,
	StartonPin,
	StartonSmartContract,
	StartonSmartContractTemplate,
	StartonSmartContractUI,
	StartonSpeed,
	StartonTransaction,
	StartonWallet,
	StartonWatcher,
	StartonWebhook,
	StartonWebhookStatus,
} from '../schema/database';

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

// Request-only copies of the response schemas: a plain z.object strips unknown
// keys, so nothing undocumented reaches Starton from these nested inputs.
const CustomGasInput = z.object(StartonCustomGas.shape);
const SmartContractUIInput = z.object(StartonSmartContractUI.shape);

// Safe: the values are only forwarded to Starton, never read.
// A narrower type is not practical because the API documents no stricter shape.
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
	customGas: CustomGasInput.optional().describe(
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
	uiData: SmartContractUIInput.nullish().describe(
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
	customGas: CustomGasInput.optional().describe(
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
		// Safe: elements are only forwarded to Starton, never read.
		// A narrower type is not practical because the API documents no stricter element shape.
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
// Paginated list endpoints — GET /v3/smart-contract,
// GET /v3/smart-contract-template, GET /v3/webhook
// ─────────────────────────────────────────────────────────────────────────────

/** Official: the `page` / `limit` query parameters every v3 list route takes. */
const PaginationInputSchema = z.object({
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
});

const paginated = <T extends z.ZodType>(item: T) =>
	z.object({ items: z.array(item), meta: StartonPaginationMeta });

/** Official: GET /v3/smart-contract query parameters. */
const SmartContractListInputSchema = PaginationInputSchema.extend({
	network: z
		.string()
		.optional()
		.describe('Filter by network, e.g. `polygon-amoy`.'),
	address: z.string().optional().describe('Filter by contract address.'),
	includeAbi: z
		.boolean()
		.optional()
		.describe('Include each contract ABI in the response.'),
	includeCompilationDetails: z
		.boolean()
		.optional()
		.describe('Include each contract compilation details in the response.'),
});
export type SmartContractListInput = z.infer<
	typeof SmartContractListInputSchema
>;

/** Official: GET /v3/smart-contract-template query parameters. */
const TemplateListInputSchema = PaginationInputSchema.extend({
	isAudited: z
		.boolean()
		.optional()
		.describe('Only return templates audited by Starton.'),
	isActivated: z
		.boolean()
		.optional()
		.describe('Only return activated (deployable) templates.'),
	/** Spec pattern: `^[\w\-\s]+$` — the API rejects other characters with a 400. */
	name: z
		.string()
		.regex(/^[\w\-\s]+$/)
		.optional()
		.describe(
			'Filter by template name. Letters, digits, -, _ and spaces only.',
		),
	blockchain: z
		.string()
		.optional()
		.describe('Filter by supported blockchain, e.g. `ethereum`.'),
	category: StartonSmartContractTemplate.shape.category
		.optional()
		.describe('Filter by template category.'),
	includeCompilationDetails: z
		.boolean()
		.optional()
		.describe('Include each template compilation details.'),
	includeForm: z
		.boolean()
		.optional()
		.describe('Include each template deployment form definition.'),
});
export type TemplateListInput = z.infer<typeof TemplateListInputSchema>;

/** Official: GET /v3/webhook query parameters. */
const WebhookListInputSchema = PaginationInputSchema.extend({
	status: StartonWebhookStatus.optional().describe(
		'Filter by delivery status.',
	),
});
export type WebhookListInput = z.infer<typeof WebhookListInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Watcher — GET/DELETE /v3/watcher/{id}
// ─────────────────────────────────────────────────────────────────────────────

const WatcherIdInputSchema = z.object({
	id: z.string().describe('Starton watcher id.'),
});
export type WatcherIdInput = z.infer<typeof WatcherIdInputSchema>;

/** Official: DELETE /v3/watcher/{id} returns a bare number (rows deleted). */
const WatcherDeleteResponseSchema = z.number();

// ─────────────────────────────────────────────────────────────────────────────
// IPFS — POST /v3/ipfs/file (multipart/form-data)
// ─────────────────────────────────────────────────────────────────────────────

const IpfsUploadFileInputSchema = z.object({
	content: z
		.base64()
		.min(1)
		.describe('File contents, base64-encoded (standard alphabet, padded).'),
	filename: z
		.string()
		.min(1)
		.describe('File name stored on the pin, e.g. `metadata.json`.'),
	contentType: z
		.string()
		.optional()
		.describe('MIME type of the file. Defaults to application/octet-stream.'),
	metadata: JsonObject.optional().describe(
		'Arbitrary JSON stored alongside the pin.',
	),
});
export type IpfsUploadFileInput = z.infer<typeof IpfsUploadFileInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schema maps
// ─────────────────────────────────────────────────────────────────────────────

export const StartonEndpointInputSchemas = {
	walletCreate: WalletCreateInputSchema,
	walletList: WalletListInputSchema,
	smartContractDeployFromTemplate: SmartContractDeployFromTemplateInputSchema,
	smartContractCall: SmartContractCallInputSchema,
	smartContractRead: SmartContractReadInputSchema,
	smartContractList: SmartContractListInputSchema,
	templateList: TemplateListInputSchema,
	transactionGet: TransactionGetInputSchema,
	watcherGet: WatcherIdInputSchema,
	watcherDelete: WatcherIdInputSchema,
	webhookList: WebhookListInputSchema,
	ipfsUploadFile: IpfsUploadFileInputSchema,
} as const;

export const StartonEndpointOutputSchemas = {
	walletCreate: StartonWallet,
	walletList: WalletListResponseSchema,
	smartContractDeployFromTemplate:
		SmartContractDeployFromTemplateResponseSchema,
	smartContractCall: StartonTransaction,
	smartContractRead: SmartContractReadResponseSchema,
	smartContractList: paginated(StartonSmartContract),
	templateList: paginated(StartonSmartContractTemplate),
	transactionGet: StartonTransaction,
	watcherGet: StartonWatcher,
	watcherDelete: WatcherDeleteResponseSchema,
	webhookList: paginated(StartonWebhook),
	ipfsUploadFile: StartonPin,
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
