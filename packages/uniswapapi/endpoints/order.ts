import { logEventFromContext } from 'corsair/core';
import { makeUniswapApiRequest } from '../client';
import type {
	UniswapApiEndpointContext,
	UniswapApiEndpointInputs,
	UniswapApiEndpointOutputs,
} from './types';
import { UniswapApiEndpointOutputSchemas } from './types';

export const getStatus = async (
	ctx: UniswapApiEndpointContext,
	input: UniswapApiEndpointInputs['orderGetStatus'],
): Promise<UniswapApiEndpointOutputs['orderGetStatus']> => {
	const response = await makeUniswapApiRequest<
		UniswapApiEndpointOutputs['orderGetStatus']
	>('/v1/orders', ctx.key, {
		method: 'GET',
		query: {
			orderId: input.orderId,
			orderIds: input.orderIds,
			orderStatus: input.orderStatus,
			swapper: input.swapper,
			filler: input.filler,
			limit: input.limit,
			cursor: input.cursor,
			sortKey: input.sortKey,
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
