import type { EventLoggingContext } from 'corsair/core';
import { z } from 'zod';

const TransactionDataSchema = z
	.string()
	.min(1)
	.refine((data) => data !== '0x', {
		message: 'Transaction calldata must not be empty',
	});

const TransactionRequestSchema = z
	.object({
		to: z.string().min(1),
		data: TransactionDataSchema,
		value: z.string(),
		chainId: z.number(),
	})
	.passthrough();

const NonEmptyObjectSchema = z
	.record(z.string(), z.unknown())
	.refine((value) => Object.keys(value).length > 0, {
		message: 'Expected result object to include provider data',
	});

// ═══════════════════════════════════════════════════════════════════
// 1. Check Approval — POST /v1/check_approval
// ═══════════════════════════════════════════════════════════════════
const CheckApprovalInputSchema = z.object({
	token: z.string().describe('Token contract address'),
	amount: z.string().describe('Amount to check approval for'),
	walletAddress: z.string().describe('Wallet address to check'),
	chainId: z.number().describe('Chain ID'),
});
export type CheckApprovalInput = z.infer<typeof CheckApprovalInputSchema>;

const CheckApprovalResponseSchema = z
	.object({
		requestId: z.string(),
		approval: TransactionRequestSchema.nullable(),
		cancel: TransactionRequestSchema.nullable().optional(),
		gasFee: z.string().optional(),
		cancelGasFee: z.string().optional(),
	})
	.passthrough();
export type CheckApprovalResponse = z.infer<typeof CheckApprovalResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 2. Get Quote — POST /v1/quote
// ═══════════════════════════════════════════════════════════════════
const GetQuoteInputSchema = z.object({
	type: z.enum(['EXACT_INPUT', 'EXACT_OUTPUT']).describe('Swap type'),
	tokenIn: z.string().describe('Input token contract address'),
	tokenInChainId: z.number().describe('Input token chain ID'),
	tokenOut: z.string().describe('Output token contract address'),
	tokenOutChainId: z.number().describe('Output token chain ID'),
	amount: z.string().describe('Token amount (in smallest unit)'),
	swapper: z.string().describe('Address of the swapper wallet'),
	slippageTolerance: z
		.number()
		.optional()
		.describe('Slippage tolerance (e.g. 0.5 = 0.5%)'),
	urgency: z.enum(['normal', 'fast']).optional().describe('Trade urgency'),
	recipient: z
		.string()
		.optional()
		.describe('Recipient address, if different from swapper'),
	protocols: z
		.array(z.string())
		.optional()
		.describe('Protocols to route through'),
});
export type GetQuoteInput = z.infer<typeof GetQuoteInputSchema>;

const GetQuoteResponseSchema = z
	.object({
		requestId: z.string(),
		routing: z.string(),
		quote: NonEmptyObjectSchema,
		quoteId: z.string().optional(),
		tokenIn: z.string().optional(),
		tokenOut: z.string().optional(),
		amountIn: z.string().optional(),
		amountOut: z.string().optional(),
		swapper: z.string().optional(),
		gasEstimate: z.string().optional(),
		gasFee: z.string().optional(),
		gasFeeUSD: z.string().optional(),
		route: z.array(z.array(z.record(z.string(), z.unknown()))).optional(),
		routeString: z.string().optional(),
		permitData: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type GetQuoteResponse = z.infer<typeof GetQuoteResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 3. Create Swap — POST /v1/swap
// ═══════════════════════════════════════════════════════════════════
const CreateSwapInputSchema = z.object({
	quote: z
		.record(z.string(), z.unknown())
		.describe('The quote object returned from /v1/quote'),
	signature: z.string().optional().describe('Permit2 signature if applicable'),
	refreshGasPrice: z
		.boolean()
		.optional()
		.describe('Whether to refresh gas price'),
	simulateTransaction: z
		.boolean()
		.optional()
		.describe('Whether to simulate the transaction'),
});
export type CreateSwapInput = z.infer<typeof CreateSwapInputSchema>;

const CreateSwapResponseSchema = z
	.object({
		requestId: z.string(),
		swap: TransactionRequestSchema,
		to: z.string().optional(),
		data: TransactionDataSchema.optional(),
		value: z.string().optional(),
		gasLimit: z.string().optional(),
		gasFee: z.string().optional(),
		chainId: z.number().optional(),
	})
	.passthrough();
export type CreateSwapResponse = z.infer<typeof CreateSwapResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 4. Get Swap Status — GET /v1/swap_status
// ═══════════════════════════════════════════════════════════════════
const GetSwapStatusInputSchema = z.object({
	txHash: z.string().describe('Transaction hash to check status for'),
	chainId: z.number().describe('Chain ID'),
});
export type GetSwapStatusInput = z.infer<typeof GetSwapStatusInputSchema>;

const GetSwapStatusResponseSchema = z
	.object({
		status: z.string(),
		txHash: z.string().optional(),
		chainId: z.number().optional(),
	})
	.passthrough();
export type GetSwapStatusResponse = z.infer<typeof GetSwapStatusResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 5. Get Gasless Order Status — GET /v1/orders
// ═══════════════════════════════════════════════════════════════════
const GetOrderStatusInputSchema = z.object({
	orderId: z.string().describe('UniswapX order ID'),
});
export type GetOrderStatusInput = z.infer<typeof GetOrderStatusInputSchema>;

const GetOrderStatusResponseSchema = z
	.object({
		orderStatus: z.string(),
		orderId: z.string().optional(),
		orderHash: z.string().optional(),
		chainId: z.number().optional(),
		swapper: z.string().optional(),
		txHash: z.string().optional(),
	})
	.passthrough();
export type GetOrderStatusResponse = z.infer<
	typeof GetOrderStatusResponseSchema
>;

// ═══════════════════════════════════════════════════════════════════
// 6. Check Delegation — POST /v1/check_delegation
// ═══════════════════════════════════════════════════════════════════
const CheckDelegationInputSchema = z.object({
	walletAddress: z.string().describe('Wallet address to check delegation for'),
	chainIds: z.array(z.number()).describe('Chain IDs to check'),
});
export type CheckDelegationInput = z.infer<typeof CheckDelegationInputSchema>;

const CheckDelegationResponseSchema = z
	.object({
		delegations: z
			.array(
				z
					.object({
						chainId: z.number(),
						delegated: z.boolean(),
						delegateAddress: z.string().optional(),
					})
					.passthrough(),
			)
			.min(1),
	})
	.passthrough();
export type CheckDelegationResponse = z.infer<
	typeof CheckDelegationResponseSchema
>;

// ═══════════════════════════════════════════════════════════════════
// 7. Encode 7702 Transaction — POST /v1/encode_7702_transaction
// ═══════════════════════════════════════════════════════════════════
const Encode7702TransactionInputSchema = z.object({
	transactions: z
		.array(
			z
				.object({
					to: z.string(),
					data: z.string(),
					value: z.string().optional(),
				})
				.passthrough(),
		)
		.describe('Transactions to batch'),
	walletAddress: z.string().describe('Smart contract wallet address'),
	chainId: z.number().describe('Chain ID'),
});
export type Encode7702TransactionInput = z.infer<
	typeof Encode7702TransactionInputSchema
>;

const Encode7702TransactionResponseSchema = z
	.object({
		to: z.string().min(1),
		data: TransactionDataSchema,
		value: z.string(),
		chainId: z.number(),
	})
	.passthrough();
export type Encode7702TransactionResponse = z.infer<
	typeof Encode7702TransactionResponseSchema
>;

// ═══════════════════════════════════════════════════════════════════
// Aggregate types
// ═══════════════════════════════════════════════════════════════════

export type UniswapApiEndpointContext = EventLoggingContext & { key: string };

export type UniswapApiEndpointInputs = {
	approvalCheck: CheckApprovalInput;
	quoteGet: GetQuoteInput;
	swapCreate: CreateSwapInput;
	swapGetStatus: GetSwapStatusInput;
	orderGetStatus: GetOrderStatusInput;
	delegationCheck: CheckDelegationInput;
	transactionEncode7702: Encode7702TransactionInput;
};

export type UniswapApiEndpointOutputs = {
	approvalCheck: CheckApprovalResponse;
	quoteGet: GetQuoteResponse;
	swapCreate: CreateSwapResponse;
	swapGetStatus: GetSwapStatusResponse;
	orderGetStatus: GetOrderStatusResponse;
	delegationCheck: CheckDelegationResponse;
	transactionEncode7702: Encode7702TransactionResponse;
};

export const UniswapApiEndpointInputSchemas = {
	approvalCheck: CheckApprovalInputSchema,
	quoteGet: GetQuoteInputSchema,
	swapCreate: CreateSwapInputSchema,
	swapGetStatus: GetSwapStatusInputSchema,
	orderGetStatus: GetOrderStatusInputSchema,
	delegationCheck: CheckDelegationInputSchema,
	transactionEncode7702: Encode7702TransactionInputSchema,
} as const;

export const UniswapApiEndpointOutputSchemas = {
	approvalCheck: CheckApprovalResponseSchema,
	quoteGet: GetQuoteResponseSchema,
	swapCreate: CreateSwapResponseSchema,
	swapGetStatus: GetSwapStatusResponseSchema,
	orderGetStatus: GetOrderStatusResponseSchema,
	delegationCheck: CheckDelegationResponseSchema,
	transactionEncode7702: Encode7702TransactionResponseSchema,
} as const;
