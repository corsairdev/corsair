import { logEventFromContext } from 'corsair/core';
import { makePagerdutyRequest } from '../client';
import type { PagerdutyEndpoints } from '../index';
import type { PagerdutyEndpointOutputs } from './types';

export const get: PagerdutyEndpoints['usersGet'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<
		PagerdutyEndpointOutputs['usersGet']
	>(`users/${input.id}`, ctx.key, {
		query: {
			...(input.include && { 'include[]': input.include.join(',') }),
		},
	});

	await logEventFromContext(
		ctx,
		'pagerduty.users.get',
		{ id: input.id },
		'completed',
	);
	return result;
};
