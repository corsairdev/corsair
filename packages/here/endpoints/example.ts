import { logEventFromContext } from 'corsair/core';
import type { HereEndpoints } from '..';
import { makeHereRequest } from '../client';
import type { HereEndpointOutputs } from './types';

export const get: HereEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHereRequest<HereEndpointOutputs['exampleGet']>(
		'/v1/geocode',
		ctx.key,
		{
			method: 'GET',
			query: {
				q: input.q,
				...(input.limit !== undefined ? { limit: input.limit } : {}),
				...(input.at !== undefined ? { at: input.at } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'here.example.get', { ...input }, 'completed');

	return response;
};
