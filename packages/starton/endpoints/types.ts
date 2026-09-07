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
	kmsId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	metadata: JsonObject.optional(),
});
export type WalletCreateInput = z.infer<typeof WalletCreateInputSchema>;

/**
 * Official: GET /v3/kms/wallet query parameters.
 */
const WalletListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(2500).optional(),
	/** Spec pattern: `^[\w\-\s]+$` — the API rejects other characters with a 400. */
	name: z
		.string()
		.regex(/^[\w\-\s]+$/)
		.optional(),
	kmsId: z.string().optional(),
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
	network: z.string(),
	signerWallet: z.string(),
	templateId: z.string(),
	name: z.string().max(255),
	params: z.array(ContractParam).default([]),
	description: z.string().optional(),
	gasLimit: z.string().optional(),
	speed: StartonSpeed.optional(),
	customGas: StartonCustomGas.optional(),
	nonce: z.number().optional(),
	value: z.string().optional(),
	metadata: JsonObject.optional(),
	uiData: StartonSmartContractUI.nullish(),
	/** Estimate gas instead of broadcasting. */
	simulate: z.boolean().optional(),
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
	network: z.string(),
	address: z.string(),
	functionName: z.string(),
	params: z.array(ContractParam).default([]),
	signerWallet: z.string(),
	speed: StartonSpeed.optional(),
	customGas: StartonCustomGas.optional(),
	gasLimit: z.string().optional(),
	nonce: z.number().optional(),
	value: z.string().optional(),
	/** Estimate gas instead of broadcasting. */
	simulate: z.boolean().optional(),
});
export type SmartContractCallInput = z.infer<
	typeof SmartContractCallInputSchema
>;

/**
 * Official: components.schemas.ReadDto
 */
const SmartContractReadInputSchema = z.object({
	network: z.string(),
	address: z.string(),
	functionName: z.string(),
	params: z.array(ContractParam).default([]),
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
	id: z.string(),
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
