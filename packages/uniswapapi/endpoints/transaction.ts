import { logEventFromContext } from 'corsair/core';
import { makeUniswapApiRequest } from '../client';
import type {
	UniswapApiEndpointContext,
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const encode7702 = async (
	ctx: UniswapApiEndpointContext,
	input: UniswapApiEndpointInputs['transactionEncode7702'],
): Promise<UniswapApiEndpointOutputs['transactionEncode7702']> => {
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
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.transactionEncode7702.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.transaction.encode7702',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
