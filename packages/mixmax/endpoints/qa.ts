import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const qaList: MixmaxEndpoints['qaList'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['qaList']>(
		ctx,
		'/v1/qa',
		{
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		},
	);

	await logEventFromContext(ctx, 'mixmax.qa.list', { ...input }, 'completed');
	return result;
};

export const qaGet: MixmaxEndpoints['qaGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<MixmaxEndpointOutputs['qaGet']>(
		ctx,
		mixmaxPathParameter('/v1/qa/{id}', 'id', input.id),
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'mixmax.qa.get', { ...input }, 'completed');
	return result;
};
