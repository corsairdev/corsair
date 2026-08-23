import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';

export const create: UniswapApiEndpoints['swapCreate'] = async (ctx, input) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['swapCreate']
	>('/v1/swap', ctx.key, {
		method: 'POST',
		body: {
			quote: input.quote,
			...(input.signature && { signature: input.signature }),
			...(input.refreshGasPrice !== undefined && {
				refreshGasPrice: input.refreshGasPrice,
			}),
			...(input.simulateTransaction !== undefined && {
				simulateTransaction: input.simulateTransaction,
			}),
		},
	});

	await logEventFromContext(ctx, 'uniswapapi.swap.create', {}, 'completed');
	return response;
};

export const getStatus: UniswapApiEndpoints['swapGetStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['swapGetStatus']
	>('/v1/swap_status', ctx.key, {
		method: 'GET',
		query: {
			txHash: input.txHash,
			chainId: input.chainId,
		},
	});

	await logEventFromContext(
		ctx,
		'uniswapapi.swap.getStatus',
		{ ...input },
		'completed',
	);
	return response;
};
