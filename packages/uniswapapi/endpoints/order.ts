import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const getStatus: UniswapApiEndpoints['orderGetStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['orderGetStatus']
	>('/v1/orders', ctx.key, {
		method: 'GET',
		query: {
			orderId: input.orderId,
		},
	});
	const parsedResponse =
		UniswapApiEndpointOutputSchemas.orderGetStatus.parse(response);

	await logEventFromContext(
		ctx,
		'uniswapapi.order.getStatus',
		{ ...input },
		'completed',
	);
	return parsedResponse;
};
