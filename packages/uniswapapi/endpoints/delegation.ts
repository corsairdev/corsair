import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';

export const check: UniswapApiEndpoints['delegationCheck'] = async (
	ctx,
	input,
) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['delegationCheck']
	>('/v1/check_delegation', ctx.key, {
		method: 'POST',
		body: {
			walletAddress: input.walletAddress,
			chainIds: input.chainIds,
		},
	});

	await logEventFromContext(
		ctx,
		'uniswapapi.delegation.check',
		{ ...input },
		'completed',
	);
	return response;
};
