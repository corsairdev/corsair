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
	input: UniswapApiEndpointInputs['swappableTokensGet'],
): Promise<UniswapApiEndpointOutputs['swappableTokensGet']> => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['swappableTokensGet']
	>('/v1/swappable_tokens', ctx.key, {
		method: 'GET',
		query: {
			tokenIn: input.tokenIn,
			tokenInChainId: input.tokenInChainId,
		},
	});
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.swappableTokensGet.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.swappableTokens.get',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
