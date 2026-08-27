import { logEventFromContext } from 'corsair/core';
import { makeVestaboardRequest, VESTABOARD_PLATFORM_API_BASE } from '../client';
import type { VestaboardEndpoints } from '../index';
import type { VestaboardEndpointOutputs } from './types';

export const list: VestaboardEndpoints['subscriptionsList'] = async (ctx, _input) => {
	const result = await makeVestaboardRequest<VestaboardEndpointOutputs['subscriptionsList']>(
		'subscriptions',
		ctx.key,
		{
			method: 'GET',
			baseUrl: VESTABOARD_PLATFORM_API_BASE,
			apiSecret: ctx.options.apiSecret,
		},
	);

	if (result.subscriptions && ctx.db?.subscriptions) {
		for (const sub of result.subscriptions) {
			if (sub._id) {
				try {
					await ctx.db.subscriptions.upsertByEntityId(sub._id, {
						...sub,
					});
				} catch (error) {
					console.warn(`Failed to save subscription ${sub._id} to database:`, error);
				}
			}
		}
	}

	await logEventFromContext(ctx, 'vestaboard.subscriptions.list', {}, 'completed');
	return result;
};

export const get: VestaboardEndpoints['subscriptionsGet'] = async (ctx, input) => {
	const result = await makeVestaboardRequest<VestaboardEndpointOutputs['subscriptionsGet']>(
		`subscriptions/${input.subscriptionId}/message`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: VESTABOARD_PLATFORM_API_BASE,
			apiSecret: ctx.options.apiSecret,
		},
	);

	await logEventFromContext(
		ctx,
		'vestaboard.subscriptions.get',
		{ subscriptionId: input.subscriptionId },
		'completed',
	);
	return result;
};

export const postMessage: VestaboardEndpoints['subscriptionsPostMessage'] = async (ctx, input) => {
	const payload = input.characters
		? input.characters
		: input.text
			? { text: input.text }
			: { text: '' };

	const result = await makeVestaboardRequest<VestaboardEndpointOutputs['subscriptionsPostMessage']>(
		`subscriptions/${input.subscriptionId}/message`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: VESTABOARD_PLATFORM_API_BASE,
			apiSecret: ctx.options.apiSecret,
			body: payload,
		},
	);

	await logEventFromContext(
		ctx,
		'vestaboard.subscriptions.postMessage',
		{ subscriptionId: input.subscriptionId, text: input.text },
		'completed',
	);
	return result;
};
