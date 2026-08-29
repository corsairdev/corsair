import { z } from 'zod';

/**
 * Chains API row.
 * Official: GET https://api.blocknative.com/chains
 * https://docs.blocknative.com/sitemap.md (Chains API)
 */
export const BlocknativeChain = z
	.object({
		arch: z.string().optional(),
		chainId: z.number().optional(),
		label: z.string().optional(),
		icon: z.string().optional(),
		system: z.string().optional(),
		network: z.string().optional(),
		features: z.array(z.string()).optional(),
	})
	.loose();

export type BlocknativeChain = z.infer<typeof BlocknativeChain>;

/**
 * Oracles API row.
 * Official: GET https://api.blocknative.com/oracles
 * https://docs.blocknative.com/gas-prediction/gas-platform-2
 */
export const BlocknativeOracle = z
	.object({
		arch: z.string().optional(),
		chainId: z.number().optional(),
		label: z.string().optional(),
		icon: z.string().optional(),
		system: z.string().optional(),
		network: z.string().optional(),
		addressByVersion: z.record(z.string(), z.string()).optional(),
		rpcUrl: z.string().optional(),
		blockExplorerUrl: z.string().optional(),
	})
	.loose();

export type BlocknativeOracle = z.infer<typeof BlocknativeOracle>;

/**
 * Block Price API estimatedPrices[] item (gwei).
 * Official: GET https://api.blocknative.com/gasprices/blockprices
 * https://docs.blocknative.com/gas-prediction/gas-platform
 */
export const BlocknativeEstimatedPrice = z
	.object({
		confidence: z.number().optional(),
		price: z.number().optional(),
		maxPriorityFeePerGas: z.number().nullable().optional(),
		maxFeePerGas: z.number().nullable().optional(),
	})
	.loose();

export type BlocknativeEstimatedPrice = z.infer<
	typeof BlocknativeEstimatedPrice
>;

/**
 * Block Price API blockPrices[] item.
 * Official: GET https://api.blocknative.com/gasprices/blockprices
 */
export const BlocknativeBlockPrice = z
	.object({
		blockNumber: z.number().optional(),
		estimatedTransactionCount: z.number().optional(),
		baseFeePerGas: z.number().nullable().optional(),
		blobBaseFeePerGas: z.number().nullable().optional(),
		estimatedPrices: z.array(BlocknativeEstimatedPrice).optional(),
	})
	.loose();

export type BlocknativeBlockPrice = z.infer<typeof BlocknativeBlockPrice>;

/**
 * Block Price API envelope.
 * Official: GET https://api.blocknative.com/gasprices/blockprices
 */
export const BlocknativeBlockPrices = z
	.object({
		system: z.string().optional(),
		network: z.string().optional(),
		unit: z.string().optional(),
		maxPrice: z.number().optional(),
		currentBlockNumber: z.number().optional(),
		msSinceLastBlock: z.number().optional(),
		blockPrices: z.array(BlocknativeBlockPrice).optional(),
	})
	.loose();

export type BlocknativeBlockPrices = z.infer<typeof BlocknativeBlockPrices>;

/**
 * Prediction API — base fee and blob fee for the next 5 blocks.
 * Official: GET https://api.blocknative.com/gasprices/basefee-estimates
 * https://docs.blocknative.com/gas-prediction/base-fee-estimates-api
 */
export const BlocknativeBaseFeeEstimates = z
	.object({
		system: z.string().optional(),
		network: z.string().optional(),
		unit: z.string().optional(),
		currentBlockNumber: z.number().optional(),
		msSinceLastBlock: z.number().optional(),
		baseFeePerGas: z.number().optional(),
		blobBaseFeePerGas: z.number().nullable().optional(),
		estimatedBaseFees: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

export type BlocknativeBaseFeeEstimates = z.infer<
	typeof BlocknativeBaseFeeEstimates
>;

/**
 * Gas Distribution API envelope.
 * Official: GET https://api.blocknative.com/gasprices/distribution
 * https://docs.blocknative.com/gas-prediction/gas-distribution-api
 */
export const BlocknativeGasDistribution = z
	.object({
		system: z.string().optional(),
		network: z.string().optional(),
		unit: z.string().optional(),
		maxPrice: z.number().optional(),
		currentBlockNumber: z.number().optional(),
		msSinceLastBlock: z.number().optional(),
		topNDistribution: z
			.object({
				distribution: z.array(z.array(z.number())).optional(),
				n: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type BlocknativeGasDistribution = z.infer<
	typeof BlocknativeGasDistribution
>;
