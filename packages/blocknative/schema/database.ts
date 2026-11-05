import { z } from 'zod';

/**
 * Chains API row.
 * Official: GET https://api.blocknative.com/chains
 */
export const BlocknativeChain = z.object({
	arch: z.string().min(1).optional(),
	chainId: z.number().int().positive(),
	label: z.string().min(1),
	icon: z.string().optional(),
	system: z.string().min(1).optional(),
	network: z.string().min(1).optional(),
	features: z.array(z.string()).optional(),
});

export type BlocknativeChain = z.infer<typeof BlocknativeChain>;

/**
 * Oracles API row.
 * Official: GET https://api.blocknative.com/oracles
 */
export const BlocknativeOracle = z.object({
	arch: z.string().min(1).optional(),
	chainId: z.number().int().positive(),
	label: z.string().min(1),
	icon: z.string().optional(),
	system: z.string().min(1).optional(),
	network: z.string().min(1).optional(),
	addressByVersion: z.record(z.string(), z.string()).optional(),
	rpcUrl: z.string().optional(),
	blockExplorerUrl: z.string().optional(),
});

export type BlocknativeOracle = z.infer<typeof BlocknativeOracle>;

/**
 * Block Price API estimatedPrices[] item (gwei).
 * Official: GET https://api.blocknative.com/gasprices/blockprices
 */
export const BlocknativeEstimatedPrice = z.object({
	confidence: z.number(),
	price: z.number(),
	maxPriorityFeePerGas: z.number().nullable().optional(),
	maxFeePerGas: z.number().nullable().optional(),
});

export type BlocknativeEstimatedPrice = z.infer<
	typeof BlocknativeEstimatedPrice
>;

/**
 * Block Price API blockPrices[] item.
 * Official: GET https://api.blocknative.com/gasprices/blockprices
 */
export const BlocknativeBlockPrice = z.object({
	blockNumber: z.number().int().positive(),
	estimatedTransactionCount: z.number().optional(),
	baseFeePerGas: z.number().nullable().optional(),
	blobBaseFeePerGas: z.number().nullable().optional(),
	estimatedPrices: z.array(BlocknativeEstimatedPrice).min(1),
});

export type BlocknativeBlockPrice = z.infer<typeof BlocknativeBlockPrice>;

/**
 * Block Price API envelope.
 * Official: GET https://api.blocknative.com/gasprices/blockprices
 */
export const BlocknativeBlockPrices = z.object({
	system: z.string().min(1),
	network: z.string().min(1),
	unit: z.string().min(1),
	maxPrice: z.number().optional(),
	currentBlockNumber: z.number().optional(),
	msSinceLastBlock: z.number().optional(),
	blockPrices: z.array(BlocknativeBlockPrice).min(1),
});

export type BlocknativeBlockPrices = z.infer<typeof BlocknativeBlockPrices>;

const BlocknativePendingBaseFee = z.object({
	confidence: z.number(),
	baseFee: z.number(),
});

/**
 * Prediction API — base fee and blob fee for the next 5 blocks.
 * Official: GET https://api.blocknative.com/gasprices/basefee-estimates
 */
export const BlocknativeBaseFeeEstimates = z.object({
	system: z.string().min(1),
	network: z.string().min(1),
	unit: z.string().min(1),
	currentBlockNumber: z.number().optional(),
	msSinceLastBlock: z.number().optional(),
	baseFeePerGas: z.number().optional(),
	blobBaseFeePerGas: z.number().nullable().optional(),
	estimatedBaseFees: z
		.array(z.record(z.string(), z.array(BlocknativePendingBaseFee)))
		.min(1),
});

export type BlocknativeBaseFeeEstimates = z.infer<
	typeof BlocknativeBaseFeeEstimates
>;

/**
 * Gas Distribution API envelope.
 * Official: GET https://api.blocknative.com/gasprices/distribution
 */
export const BlocknativeGasDistribution = z.object({
	system: z.string().min(1),
	network: z.string().min(1),
	unit: z.string().min(1),
	maxPrice: z.number().optional(),
	currentBlockNumber: z.number().optional(),
	msSinceLastBlock: z.number().optional(),
	topNDistribution: z.object({
		distribution: z.array(z.array(z.number()).min(2)).min(1),
		n: z.number(),
	}),
});

export type BlocknativeGasDistribution = z.infer<
	typeof BlocknativeGasDistribution
>;
