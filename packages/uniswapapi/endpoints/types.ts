import type { EventLoggingContext } from 'corsair/core';
import { z } from 'zod';

const TransactionDataSchema = z
	.string()
	.min(1)
	.refine((data) => data !== '0x', {
		message: 'Transaction calldata must not be empty',
	});

// TransactionRequest per the Trading API spec: required fields are
// `to`, `data`, `value`, and `chainId`. `from` is declared required there too,
// but the gateway omits it on some approval transactions, so it stays optional
// here to avoid rejecting valid responses.
const TransactionRequestSchema = z
	.object({
		to: z.string().min(1),
		from: z.string().min(1).optional(),
		data: TransactionDataSchema,
		value: z.string(),
		chainId: z.number(),
		gasLimit: z.string().optional(),
		maxFeePerGas: z.string().optional(),
		maxPriorityFeePerGas: z.string().optional(),
		gasPrice: z.string().optional(),
	})
	.passthrough();

const NonEmptyObjectSchema = z
	.record(z.string(), z.unknown())
	.refine((value) => Object.keys(value).length > 0, {
		message: 'Expected result object to include provider data',
	});

const RequestIdSchema = z.string().min(1);

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
		requestId: RequestIdSchema,
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
const GetQuoteInputSchema = z
	.object({
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
			.describe('Slippage tolerance as a percentage (e.g. 0.5 = 0.5%)'),
		autoSlippage: z
			.enum(['DEFAULT'])
			.optional()
			.describe(
				'Let the API compute slippage automatically; cannot be combined with slippageTolerance',
			),
		urgency: z
			.enum(['normal', 'fast', 'urgent'])
			.optional()
			.describe('Trade urgency'),
		recipient: z
			.string()
			.optional()
			.describe('Recipient address, if different from swapper'),
		protocols: z
			.array(z.string())
			.optional()
			.describe('Protocols to route through'),
	})
	.superRefine((input, ctx) => {
		// The Trading API requires exactly one of the two slippage modes:
		// neither set, or both set, is rejected with a 400 by the API.
		if (
			(input.slippageTolerance === undefined) ===
			(input.autoSlippage === undefined)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Exactly one of slippageTolerance or autoSlippage must be provided',
			});
		}
	});
export type GetQuoteInput = z.infer<typeof GetQuoteInputSchema>;

const RoutingSchema = z.enum([
	'CLASSIC',
	'DUTCH_LIMIT',
	'DUTCH_V2',
	'DUTCH_V3',
	'BRIDGE',
	'LIMIT_ORDER',
	'PRIORITY',
	'WRAP',
	'UNWRAP',
	'CHAINED',
]);

const GetQuoteResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		routing: RoutingSchema,
		quote: NonEmptyObjectSchema,
		// The API always returns permitData on quotes, as null when no
		// Permit2 signature is needed for the route.
		permitData: z.record(z.string(), z.unknown()).nullable(),
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
	})
	.passthrough();
export type GetQuoteResponse = z.infer<typeof GetQuoteResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 3. Create Swap — POST /v1/swap
// ═══════════════════════════════════════════════════════════════════
const CreateSwapInputSchema = z
	.object({
		quote: NonEmptyObjectSchema.describe(
			'The quote object returned from /v1/quote',
		),
		signature: z
			.string()
			.optional()
			.describe(
				'Signed Permit2 message; required when the quote returned permitData',
			),
		permitData: z
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Permit2 message from the quote; must be sent together with its signature',
			),
		refreshGasPrice: z
			.boolean()
			.optional()
			.describe('Whether to refresh gas price'),
		simulateTransaction: z
			.boolean()
			.optional()
			.describe('Whether to simulate the transaction'),
	})
	.superRefine((input, ctx) => {
		// The API rejects /v1/swap requests where only one of the pair is set.
		const hasSignature = input.signature !== undefined;
		const hasPermitData = input.permitData !== undefined;
		if (hasSignature !== hasPermitData) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'signature and permitData must be provided together or omitted together',
			});
		}
	});
export type CreateSwapInput = z.infer<typeof CreateSwapInputSchema>;

const CreateSwapResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		swap: TransactionRequestSchema,
		gasFee: z.string().optional(),
	})
	.passthrough();
export type CreateSwapResponse = z.infer<typeof CreateSwapResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 4. Get Swap Status — GET /v1/swaps
// ═══════════════════════════════════════════════════════════════════
const GetSwapStatusInputSchema = z
	.object({
		txHashes: z
			.array(z.string().min(1))
			.optional()
			.describe('On-chain transaction hashes to query'),
		userOpHashes: z
			.array(z.string().min(1))
			.optional()
			.describe('ERC-4337 userOperation hashes to query'),
		// Required by the live API even though the published spec marks it
		// optional — requests without chainId fail validation.
		chainId: z.number().describe('Chain ID the transactions belong to'),
		swapper: z
			.string()
			.optional()
			.describe('Filter results by swapper address'),
	})
	.superRefine((input, ctx) => {
		const hasTxHashes = (input.txHashes?.length ?? 0) > 0;
		const hasUserOpHashes = (input.userOpHashes?.length ?? 0) > 0;
		if (!hasTxHashes && !hasUserOpHashes) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'At least one transaction hash or userOperation hash is required',
			});
		}
	});
export type GetSwapStatusInput = z.infer<typeof GetSwapStatusInputSchema>;

const SwapStatusValueSchema = z.enum([
	'PENDING',
	'SUCCESS',
	'NOT_FOUND',
	'FAILED',
	'EXPIRED',
]);

const SwapStatusRowSchema = z
	.object({
		status: SwapStatusValueSchema,
		swapType: RoutingSchema.optional(),
		txHash: z.string().optional(),
		userOpHash: z.string().optional(),
		swapId: z.string().optional(),
		hashType: z.enum(['TX', 'USER_OP']).optional(),
	})
	.passthrough();

const GetSwapStatusResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		swaps: z.array(SwapStatusRowSchema),
	})
	.passthrough();
export type GetSwapStatusResponse = z.infer<typeof GetSwapStatusResponseSchema>;

// ═══════════════════════════════════════════════════════════════════
// 5. Get Gasless Orders — GET /v1/orders
// ═══════════════════════════════════════════════════════════════════
const OrderStatusValueSchema = z.enum([
	'open',
	'expired',
	'error',
	'cancelled',
	'filled',
	'unverified',
	'insufficient-funds',
]);

const GaslessOrderSchema = z
	.object({
		orderId: z.string(),
		orderStatus: OrderStatusValueSchema,
		chainId: z.number(),
		type: z.enum(['DutchLimit', 'Dutch', 'Dutch_V2', 'Dutch_V3', 'Priority']),
		encodedOrder: z.string().optional(),
		signature: z.string().optional(),
		nonce: z.string().optional(),
		quoteId: z.string().optional(),
		swapper: z.string().optional(),
		txHash: z.string().optional(),
	})
	.passthrough();

// UniswapX order IDs are 32-byte hex strings — the live API rejects any
// other format on /v1/orders.
const OrderIdSchema = z
	.string()
	.regex(/^0x[a-fA-F0-9]{64}$/, 'Order ID must be a 32-byte hex string');

const GetOrderStatusInputSchema = z
	.object({
		orderId: OrderIdSchema.optional().describe('Single UniswapX order ID'),
		orderIds: z
			.array(OrderIdSchema)
			.optional()
			.describe('Multiple UniswapX order IDs'),
		orderStatus: OrderStatusValueSchema.optional().describe(
			'Filter orders by status',
		),
		swapper: z.string().optional().describe('Filter orders by swapper address'),
		filler: z.string().optional().describe('Filter orders by filler address'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Maximum number of orders to return per page'),
		cursor: z
			.string()
			.optional()
			.describe('Pagination cursor from a previous response'),
		sortKey: z
			.enum(['createdAt'])
			.optional()
			.describe('Field to sort results by'),
	})
	.superRefine((input, ctx) => {
		// The live API rejects /v1/orders queries without an order ID —
		// status/swapper/filler only narrow the results, they cannot drive
		// the query on their own.
		const hasOrderRef =
			input.orderId !== undefined || (input.orderIds?.length ?? 0) > 0;
		if (!hasOrderRef) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'At least one of orderId or orderIds is required',
			});
		}
	});
export type GetOrderStatusInput = z.infer<typeof GetOrderStatusInputSchema>;

const GetOrderStatusResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		orders: z.array(GaslessOrderSchema),
		cursor: z.string().optional(),
	})
	.passthrough();
export type GetOrderStatusResponse = z.infer<
	typeof GetOrderStatusResponseSchema
>;

// ═══════════════════════════════════════════════════════════════════
// 6. Check Delegation — POST /v1/wallet/check_delegation
// ═══════════════════════════════════════════════════════════════════
const CheckDelegationInputSchema = z.object({
	walletAddresses: z
		.array(z.string().min(1))
		.min(1)
		.describe('Wallet addresses to check delegation for'),
	chainIds: z
		.array(z.number())
		.min(1)
		.describe('Chain IDs to check delegation status for'),
});
export type CheckDelegationInput = z.infer<typeof CheckDelegationInputSchema>;

const DelegationDetailsSchema = z
	.object({
		isWalletDelegatedToUniswap: z.boolean(),
		// Null when the wallet does not currently delegate to any address.
		currentDelegationAddress: z.string().nullable(),
		latestDelegationAddress: z.string(),
	})
	.passthrough();

// Response maps wallet address → chain ID (serialized as string map keys)
// → delegation details.
const CheckDelegationResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		delegationDetails: z.record(
			z.string(),
			z.record(z.string(), DelegationDetailsSchema),
		),
	})
	.passthrough();
export type CheckDelegationResponse = z.infer<
	typeof CheckDelegationResponseSchema
>;

// ═══════════════════════════════════════════════════════════════════
// 7. Encode 7702 Transaction — POST /v1/wallet/encode_7702
// ═══════════════════════════════════════════════════════════════════
const Encode7702CallSchema = z
	.object({
		to: z.string().min(1),
		from: z.string().min(1).optional(),
		// The API requires calldata to start with a 4-byte selector
		// (0x + at least 8 hex chars); shorter blobs fail validation.
		data: z
			.string()
			.regex(
				/^0x([a-fA-F0-9]{8})([a-fA-F0-9]*)$/,
				'Calldata must be hex starting with a 4-byte selector',
			),
		// The API requires hex-encoded wei (e.g. "0x0"); decimal strings fail
		// validation.
		value: z
			.string()
			.regex(/^0x[a-fA-F0-9]+$/, 'Value must be a hex-encoded wei string'),
		chainId: z.number(),
	})
	.passthrough();

const Encode7702TransactionInputSchema = z.object({
	calls: z
		.array(Encode7702CallSchema)
		.min(1)
		.describe('Transactions to encode; all calls must share the same chainId'),
	smartContractDelegationAddress: z
		.string()
		.min(1)
		.describe('Smart contract delegation implementation address to use'),
	walletAddress: z
		.string()
		.min(1)
		.describe('Wallet address the transactions are encoded for'),
});
export type Encode7702TransactionInput = z.infer<
	typeof Encode7702TransactionInputSchema
>;

const Encode7702TransactionResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		encoded: TransactionRequestSchema,
	})
	.passthrough();
export type Encode7702TransactionResponse = z.infer<
	typeof Encode7702TransactionResponseSchema
>;

// ═══════════════════════════════════════════════════════════════════
// 8. Get Swappable Tokens — GET /v1/swappable_tokens
// ═══════════════════════════════════════════════════════════════════
const GetSwappableTokensInputSchema = z.object({
	tokenIn: z.string().describe('Source token contract address'),
	tokenInChainId: z.number().describe('Source token chain ID'),
});
export type GetSwappableTokensInput = z.infer<
	typeof GetSwappableTokensInputSchema
>;

const SwappableTokenProjectSchema = z
	.object({
		logo: z.record(z.string(), z.unknown()).nullable().optional(),
		safetyLevel: z.string().optional(),
		isSpam: z.boolean().optional(),
	})
	.passthrough();

const SwappableTokenSchema = z
	.object({
		address: z.string(),
		chainId: z.number(),
		name: z.string(),
		symbol: z.string(),
		decimals: z.number(),
		project: SwappableTokenProjectSchema.optional(),
		isSpam: z.boolean().optional(),
	})
	.passthrough();

const GetSwappableTokensResponseSchema = z
	.object({
		requestId: RequestIdSchema,
		tokens: z.array(SwappableTokenSchema),
	})
	.passthrough();
export type GetSwappableTokensResponse = z.infer<
	typeof GetSwappableTokensResponseSchema
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
	swappableTokensGet: GetSwappableTokensInput;
};

export type UniswapApiEndpointOutputs = {
	approvalCheck: CheckApprovalResponse;
	quoteGet: GetQuoteResponse;
	swapCreate: CreateSwapResponse;
	swapGetStatus: GetSwapStatusResponse;
	orderGetStatus: GetOrderStatusResponse;
	delegationCheck: CheckDelegationResponse;
	transactionEncode7702: Encode7702TransactionResponse;
	swappableTokensGet: GetSwappableTokensResponse;
};

export const UniswapApiEndpointInputSchemas = {
	approvalCheck: CheckApprovalInputSchema,
	quoteGet: GetQuoteInputSchema,
	swapCreate: CreateSwapInputSchema,
	swapGetStatus: GetSwapStatusInputSchema,
	orderGetStatus: GetOrderStatusInputSchema,
	delegationCheck: CheckDelegationInputSchema,
	transactionEncode7702: Encode7702TransactionInputSchema,
	swappableTokensGet: GetSwappableTokensInputSchema,
} as const;

export const UniswapApiEndpointOutputSchemas = {
	approvalCheck: CheckApprovalResponseSchema,
	quoteGet: GetQuoteResponseSchema,
	swapCreate: CreateSwapResponseSchema,
	swapGetStatus: GetSwapStatusResponseSchema,
	orderGetStatus: GetOrderStatusResponseSchema,
	delegationCheck: CheckDelegationResponseSchema,
	transactionEncode7702: Encode7702TransactionResponseSchema,
	swappableTokensGet: GetSwappableTokensResponseSchema,
} as const;
