import { logEventFromContext } from 'corsair/core';
import { makeUniswapApiRequest } from '../client';
import type {
	UniswapApiEndpointContext,
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const get = async (
	ctx: UniswapApiEndpointContext,
	input: UniswapApiEndpointInputs['quoteGet'],
): Promise<UniswapApiEndpointOutputs['quoteGet']> => {
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
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.quoteGet.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.quote.get',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
