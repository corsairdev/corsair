import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const list: RazorpayEndpoints['subscriptionsList'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['subscriptionsList']>(
		'subscriptions',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	await logEventFromContext(ctx, 'razorpay.subscriptions.list', { ...input }, 'completed');
	return result;
};

export const get: RazorpayEndpoints['subscriptionsGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['subscriptionsGet']>(
		`subscriptions/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'razorpay.subscriptions.get', { ...input }, 'completed');
	return result;
};
