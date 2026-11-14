import { z } from 'zod';

const slug = z
	.string()
	.min(1)
	.refine(
		(s) => s !== '.' && s !== '..' && !/[\\/"']/.test(s),
		'Invalid path slug',
	);
const page = {
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
};
const hardwareType = z.enum(['ASIC', 'GPU', 'CPU', 'FPGA']);
const coin = z
	.object({
		slug: z.string(),
		symbol: z.string(),
		name: z.string().optional(),
		algorithm: z.string().optional(),
		networkHashrate: z.number().nullable().optional(),
		difficulty: z.number().nullable().optional(),
		blockReward: z.number().nullable().optional(),
		blockTimeSeconds: z.number().nullable().optional(),
		priceUsd: z.number().nullable().optional(),
		marketCapUsd: z.number().nullable().optional(),
		volume24hUsd: z.number().nullable().optional(),
		confidence: z.number().int().nullable().optional(),
		dataUpdatedAt: z.string().nullable().optional(),
	})
	.passthrough();
const hardware = z
	.object({
		slug: z.string(),
		manufacturer: z.string(),
		model: z.string(),
		type: hardwareType,
		powerWatts: z.number().nullable(),
		releaseDate: z.string().nullable(),
	})
	.passthrough();
const algorithm = z
	.object({
		slug: z.string(),
		name: z.string(),
		unit: z.string(),
		coins: z.number().int(),
	})
	.passthrough();
const pool = z
	.object({
		slug: z.string(),
		name: z.string(),
		website: z.string().nullable(),
		type: z.string().optional(),
		defaultFee: z.number().nullable(),
		coins: z.number().int(),
		lastOkAt: z.string().nullable(),
	})
	.passthrough();
const envelope = <T extends z.ZodType>(item: T) =>
	z
		.object({
			generatedAt: z.string().optional(),
			offset: z.number().int(),
			limit: z.number().int(),
			count: z.number().int(),
			results: z.array(item),
			notice: z.string().optional(),
		})
		.passthrough();

export const coins_listInput = z.object({
	algorithm: z.string().optional(),
	verified: z.boolean().optional(),
	...page,
});
export const coins_listOutput = envelope(coin);
export const coins_getInput = z.object({ slug });
export const coins_getOutput = z
	.object({
		generatedAt: z.string(),
		dataUpdatedAt: z.string().nullable(),
		confidence: z.number().int(),
		coin: coin.extend({
			website: z.string().nullable(),
			explorerUrl: z.string().nullable(),
			consensusType: z.string().nullable(),
			coinType: z.enum(['coin', 'pool']),
			circulatingSupply: z.number().nullable(),
			maxSupply: z.number().nullable(),
		}),
	})
	.passthrough();
export const coins_historyInput = z.object({ slug, ...page });
export const coins_historyOutput = z
	.object({
		coin: z.string(),
		symbol: z.string(),
		offset: z.number().int(),
		limit: z.number().int(),
		count: z.number().int(),
		results: z.array(
			z
				.object({
					t: z.string(),
					difficulty: z.number().nullable(),
					networkHashrate: z.number().nullable(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export const hardware_listInput = z.object({
	type: hardwareType.optional(),
	...page,
});
export const hardware_listOutput = envelope(hardware);
export const hardware_getInput = z.object({ slug });
export const hardware_getOutput = z
	.object({
		hardware: z
			.object({
				slug: z.string(),
				name: z.string(),
				manufacturer: z.string(),
				type: hardwareType,
				defaultPowerWatts: z.number().nullable(),
				releaseDate: z.string().nullable(),
				specs: z.array(z.string()),
			})
			.passthrough(),
	})
	.passthrough();
export const algorithms_listInput = z.object(page);
// The provider's algorithms example omits pagination metadata even though its
// response description lists it.
export const algorithms_listOutput = envelope(algorithm).extend({
	offset: z.number().int().optional(),
	limit: z.number().int().optional(),
});
export const algorithms_getInput = z.object({ slug });
export const algorithms_getOutput = z
	.object({
		algorithm: z
			.object({
				slug: z.string(),
				name: z.string(),
				unit: z.string(),
				coins: z.array(coin),
				hardware: z.array(
					z
						.object({
							slug: z.string(),
							name: z.string(),
							type: hardwareType,
							hashrateHs: z.number(),
							powerWatts: z.number().nullable(),
						})
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export const pools_listInput = z.object(page);
export const pools_listOutput = envelope(pool);
export const pools_getInput = z.object({ slug });
export const pools_getOutput = z
	.object({
		pool: z
			.object({
				slug: z.string(),
				name: z.string(),
				website: z.string().nullable(),
				type: z.string().optional(),
				founded: z.string().nullable(),
				coins: z.array(
					z
						.object({
							coin: z.string(),
							symbol: z.string(),
							algorithm: z.string(),
							fee: z.number().nullable(),
							payoutScheme: z.string().nullable(),
							minPayout: z.number().nullable(),
						})
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
export const profitability_rankInput = z.object({
	hardware: z.string().optional(),
	hashrate: z.number().optional(),
	algorithm: z.string().optional(),
	power: z.number().optional(),
	quantity: z.number().int().optional(),
	electricity: z.number().optional(),
	poolFee: z.number().min(0).max(0.2).optional(),
	verifiedOnly: z.boolean().optional(),
	limit: z.number().int().max(100).optional(),
	window: z.enum(['current', '6h', '24h', '3d']).optional(),
});
export const profitability_rankOutput = z
	.object({
		hardware: z
			.object({ slug: z.string(), name: z.string() })
			.passthrough()
			.nullable(),
		electricityPrice: z.number(),
		currency: z.string(),
		results: z.array(
			z
				.object({
					coin: z
						.object({
							slug: z.string(),
							symbol: z.string(),
							name: z.string().optional(),
							algorithm: z.string(),
						})
						.passthrough(),
					coinsPerDay: z.number(),
					revenuePerDay: z.number(),
					electricityPerDay: z.number(),
					profitPerDay: z.number(),
					profitMargin: z.number().nullable(),
					breakEvenElectricityPrice: z.number().nullable(),
					confidenceScore: z.number().int(),
				})
				.passthrough(),
		),
	})
	.passthrough();

export const MinerstatEndpointInputSchemas = {
	coins_list: coins_listInput,
	coins_get: coins_getInput,
	coins_history: coins_historyInput,
	hardware_list: hardware_listInput,
	hardware_get: hardware_getInput,
	algorithms_list: algorithms_listInput,
	algorithms_get: algorithms_getInput,
	pools_list: pools_listInput,
	pools_get: pools_getInput,
	profitability_rank: profitability_rankInput,
} as const;

export const MinerstatEndpointOutputSchemas = {
	coins_list: coins_listOutput,
	coins_get: coins_getOutput,
	coins_history: coins_historyOutput,
	hardware_list: hardware_listOutput,
	hardware_get: hardware_getOutput,
	algorithms_list: algorithms_listOutput,
	algorithms_get: algorithms_getOutput,
	pools_list: pools_listOutput,
	pools_get: pools_getOutput,
	profitability_rank: profitability_rankOutput,
} as const;
