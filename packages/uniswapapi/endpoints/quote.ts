import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';

export const get: UniswapApiEndpoints['quoteGet'] = async (ctx, input) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['quoteGet']
	>('/v1/quote', ctx.key, {
		method: 'POST',
		body: {
			type: input.type,
			tokenIn: input.tokenIn,
			tokenInChainId: input.tokenInChainId,
			tokenOut: input.tokenOut,
			tokenOutChainId: input.tokenOutChainId,
			amount: input.amount,
			swapper: input.swapper,
			...(input.slippageTolerance !== undefined && {
				slippageTolerance: input.slippageTolerance,
			}),
			...(input.urgency && { urgency: input.urgency }),
			...(input.recipient && { recipient: input.recipient }),
			...(input.protocols && { protocols: input.protocols }),
		},
	});

	await logEventFromContext(
		ctx,
		'uniswapapi.quote.get',
		{ ...input },
		'completed',
	);
	return response;
};
