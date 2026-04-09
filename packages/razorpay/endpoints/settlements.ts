import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const list: RazorpayEndpoints['settlementsList'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['settlementsList']>(
		'settlements',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	await logEventFromContext(ctx, 'razorpay.settlements.list', { ...input }, 'completed');
	return result;
};

export const get: RazorpayEndpoints['settlementsGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['settlementsGet']>(
		`settlements/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'razorpay.settlements.get', { ...input }, 'completed');
	return result;
};
