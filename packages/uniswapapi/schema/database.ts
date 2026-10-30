import { z } from 'zod';

// ── Token ──────────────────────────────────────────────────────────
export const UniswapToken = z.object({
	chainId: z.number(),
	address: z.string(),
	decimals: z.number(),
	symbol: z.string().optional(),
	name: z.string().optional(),
	buyFeeBps: z.string().optional(),
	sellFeeBps: z.string().optional(),
});
export type UniswapToken = z.infer<typeof UniswapToken>;

// ── Quote ──────────────────────────────────────────────────────────
export const UniswapQuote = z.object({
	requestId: z.string().optional(),
	quoteId: z.string().optional(),
	tokenIn: z.string(),
	tokenOut: z.string(),
	tokenInChainId: z.number(),
	tokenOutChainId: z.number(),
	amountIn: z.string().optional(),
	amountOut: z.string().optional(),
	swapper: z.string().optional(),
	gasEstimate: z.string().optional(),
	gasFeeUSD: z.string().optional(),
	gasFeeQuote: z.string().optional(),
	routeString: z.string().optional(),
});
export type UniswapQuote = z.infer<typeof UniswapQuote>;

// ── Swap Status ────────────────────────────────────────────────────
export const UniswapSwapStatus = z.object({
	txHash: z.string(),
	chainId: z.number(),
	status: z
		.enum(['PENDING', 'SUCCESS', 'NOT_FOUND', 'FAILED', 'EXPIRED'])
		.optional(),
});
export type UniswapSwapStatus = z.infer<typeof UniswapSwapStatus>;

// ── Approval ───────────────────────────────────────────────────────
export const UniswapApproval = z.object({
	walletAddress: z.string(),
	token: z.string(),
	amount: z.string(),
	chainId: z.number(),
	approvalNeeded: z.boolean().optional(),
});
export type UniswapApproval = z.infer<typeof UniswapApproval>;

// ── Gasless (UniswapX) Order ───────────────────────────────────────
export const UniswapGaslessOrder = z.object({
	orderId: z.string().optional(),
	orderHash: z.string().optional(),
	orderStatus: z.string().optional(),
	chainId: z.number().optional(),
	swapper: z.string().optional(),
	txHash: z.string().optional(),
});
export type UniswapGaslessOrder = z.infer<typeof UniswapGaslessOrder>;
