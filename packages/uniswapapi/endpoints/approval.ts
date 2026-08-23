import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const check: UniswapApiEndpoints['approvalCheck'] = async (
	ctx,
	input,
) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['approvalCheck']
	>('/v1/check_approval', ctx.key, {
		method: 'POST',
		body: {
			token: input.token,
			amount: input.amount,
			walletAddress: input.walletAddress,
			chainId: input.chainId,
		},
	});
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.approvalCheck.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.approval.check',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
