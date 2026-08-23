import { logEventFromContext } from 'corsair/core';
import type { UniswapApiEndpoints } from '..';
import { makeUniswapApiRequest } from '../client';
import type { UniswapApiEndpointOutputs } from './types';

export const getStatus: UniswapApiEndpoints['orderGetStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['orderGetStatus']
	>('/v1/order_status', ctx.key, {
		method: 'GET',
		query: {
			orderId: input.orderId,
		},
	});

	await logEventFromContext(
		ctx,
		'uniswapapi.order.getStatus',
		{ ...input },
		'completed',
	);
	return response;
};
