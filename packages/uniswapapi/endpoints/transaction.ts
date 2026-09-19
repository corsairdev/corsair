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
	>('/v1/wallet/encode_7702', ctx.key, {
		method: 'POST',
		body: {
			calls: input.calls,
			smartContractDelegationAddress: input.smartContractDelegationAddress,
			walletAddress: input.walletAddress,
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
