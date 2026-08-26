import { logEventFromContext } from 'corsair/core';
import type { BestBuyEndpoints } from '..';
import { makeBestBuyRequest } from '../client';
import type { BestBuyEndpointOutputs } from './types';

export const get: BestBuyEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBestBuyRequest<
		BestBuyEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'bestbuy.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
