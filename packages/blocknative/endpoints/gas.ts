import { logEventFromContext } from 'corsair/core';
import type { BlocknativeEndpoints } from '..';
import { makeBlocknativeRequest } from '../client';
import type {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from '../schema';

export const getGasPrices: BlocknativeEndpoints['getGasPrices'] = async (
	ctx,
	input,
) => {
	const response = await makeBlocknativeRequest<BlocknativeBlockPrices>(
		'/gasprices/blockprices',
		ctx.key,
		{
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
		const response = await makeBlocknativeRequest<BlocknativeBaseFeeEstimates>(
			'/gasprices/basefee-estimates',
			ctx.key,
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
		const response = await makeBlocknativeRequest<BlocknativeGasDistribution>(
			'/gasprices/distribution',
			ctx.key,
			{ query: { chainid: input.chainid } },
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
	const oracles = await makeBlocknativeRequest<BlocknativeOracle[]>(
		'/oracles',
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'blocknative.gas.getOracles',
		input,
		'completed',
	);
	return { oracles: Array.isArray(oracles) ? oracles : [] };
};

export const getSupportedChains: BlocknativeEndpoints['getSupportedChains'] =
	async (ctx, input) => {
		const chains = await makeBlocknativeRequest<BlocknativeChain[]>(
			'/chains',
			ctx.key,
		);
		await logEventFromContext(
			ctx,
			'blocknative.gas.getSupportedChains',
			input,
			'completed',
		);
		return { chains: Array.isArray(chains) ? chains : [] };
	};
