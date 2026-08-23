import { logEventFromContext } from 'corsair/core';
import { makeUniswapApiRequest } from '../client';
import type {
	UniswapApiEndpointContext,
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const create = async (
	ctx: UniswapApiEndpointContext,
	input: UniswapApiEndpointInputs['swapCreate'],
): Promise<UniswapApiEndpointOutputs['swapCreate']> => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['swapCreate']
	>('/v1/swap', ctx.key, {
		method: 'POST',
		body: {
			quote: input.quote,
			// The API requires signature and permitData to be sent together
			// (or both omitted); the input schema enforces that pairing.
			...(input.signature && { signature: input.signature }),
			...(input.permitData && { permitData: input.permitData }),
			...(input.refreshGasPrice !== undefined && {
				refreshGasPrice: input.refreshGasPrice,
			}),
			...(input.simulateTransaction !== undefined && {
				simulateTransaction: input.simulateTransaction,
			}),
		},
	});
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.swapCreate.parse(response);

	await logEventFromContext(ctx, 'uniswapapi.swap.create', {}, 'completed');
	return parsedResponse;
};

export const getStatus = async (
	ctx: UniswapApiEndpointContext,
	input: UniswapApiEndpointInputs['swapGetStatus'],
): Promise<UniswapApiEndpointOutputs['swapGetStatus']> => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['swapGetStatus']
	>('/v1/swaps', ctx.key, {
		method: 'GET',
		query: {
			txHashes: input.txHashes,
			userOpHashes: input.userOpHashes,
			chainId: input.chainId,
			swapper: input.swapper,
		},
	});
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.swapGetStatus.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.swap.getStatus',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
