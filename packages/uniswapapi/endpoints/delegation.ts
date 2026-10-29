import { logEventFromContext } from 'corsair/core';
import { makeUniswapApiRequest } from '../client';
import type {
	UniswapApiEndpointContext,
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const check = async (
	ctx: UniswapApiEndpointContext,
	input: UniswapApiEndpointInputs['delegationCheck'],
): Promise<UniswapApiEndpointOutputs['delegationCheck']> => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['delegationCheck']
	>('/v1/wallet/check_delegation', ctx.key, {
		method: 'POST',
		body: {
			walletAddresses: input.walletAddresses,
			chainIds: input.chainIds,
		},
	});
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.delegationCheck.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.delegation.check',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
