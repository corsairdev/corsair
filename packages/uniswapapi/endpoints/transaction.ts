import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';

export const encode7702: UniswapApiEndpoints['transactionEncode7702'] = async (
	ctx,
	input,
) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['transactionEncode7702']
	>('/v1/encode_7702_transaction', ctx.key, {
		method: 'POST',
		body: {
			transactions: input.transactions,
			walletAddress: input.walletAddress,
			chainId: input.chainId,
		},
	});

	await logEventFromContext(
		ctx,
		'uniswapapi.transaction.encode7702',
		{ ...input },
		'completed',
	);
	return response;
};
