import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const pollsList: MixmaxEndpoints['pollsList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['pollsList']>(
		ctx,
		'/v1/polls',
		{
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
				fields: input.fields,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'mixmax.polls.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const pollsGet: MixmaxEndpoints['pollsGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['pollsGet']>(
		ctx,
		mixmaxPathParameter('/v1/polls/{id}', 'id', input.id),
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'mixmax.polls.get', { ...input }, 'completed');
	return result;
};
