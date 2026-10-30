import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { BlocknativeEndpoints } from '..';
import { makeBlocknativeRequest } from '../client';
import { BlocknativeChain, BlocknativeOracle } from '../schema';
import {
	GetBaseFeeEstimatesOutputSchema,
	GetGasDistributionOutputSchema,
	GetGasOraclesOutputSchema,
	GetGasPricesOutputSchema,
	GetSupportedChainsOutputSchema,
} from './types';

export const getGasPrices: BlocknativeEndpoints['getGasPrices'] = async (
	ctx,
	input,
) => {
	const response = await makeBlocknativeRequest(
		'/gasprices/blockprices',
		ctx.key,
		{
			schema: GetGasPricesOutputSchema,
			query: {
				chainid: input.chainid,
				system: input.system,
				network: input.network,
				confidenceLevels: input.confidenceLevels,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'blocknative.gas.getPrices',
		input,
		'completed',
	);
	return response;
};

export const getBaseFeeEstimates: BlocknativeEndpoints['getBaseFeeEstimates'] =
	async (ctx, input) => {
		const response = await makeBlocknativeRequest(
			'/gasprices/basefee-estimates',
			ctx.key,
			{ schema: GetBaseFeeEstimatesOutputSchema },
		);
		await logEventFromContext(
			ctx,
			'blocknative.gas.getBaseFeeEstimates',
			input,
			'completed',
		);
		return response;
	};

export const getGasDistribution: BlocknativeEndpoints['getGasDistribution'] =
	async (ctx, input) => {
		const response = await makeBlocknativeRequest(
			'/gasprices/distribution',
			ctx.key,
			{
				schema: GetGasDistributionOutputSchema,
				query: { chainid: input.chainid },
			},
		);
		await logEventFromContext(
			ctx,
			'blocknative.gas.getDistribution',
			input,
			'completed',
		);
		return response;
	};

export const getGasOracles: BlocknativeEndpoints['getGasOracles'] = async (
	ctx,
	input,
) => {
	const oracles = await makeBlocknativeRequest('/oracles', ctx.key, {
		schema: z.array(BlocknativeOracle),
	});
	const response = GetGasOraclesOutputSchema.parse({ oracles });
	await logEventFromContext(
		ctx,
		'blocknative.gas.getOracles',
		input,
		'completed',
	);
	return response;
};

export const getSupportedChains: BlocknativeEndpoints['getSupportedChains'] =
	async (ctx, input) => {
		const chains = await makeBlocknativeRequest('/chains', ctx.key, {
			schema: z.array(BlocknativeChain),
		});
		const response = GetSupportedChainsOutputSchema.parse({ chains });
		await logEventFromContext(
			ctx,
			'blocknative.gas.getSupportedChains',
			input,
			'completed',
		);
		return response;
	};
