import { logEventFromContext } from '../../utils/events';
import type { PagerdutyEndpoints } from '..';
import { makePagerdutyRequest } from '../client';
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
