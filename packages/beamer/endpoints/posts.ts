import { logEventFromContext } from 'corsair/core';
import type { BeamerEndpoints } from '..';
import { makeBeamerRequest } from '../client';
import type { BeamerEndpointOutputs } from './types';

export const get: BeamerEndpoints['postsGet'] = async (ctx, input) => {
	const response = await makeBeamerRequest<BeamerEndpointOutputs['postsGet']>(
		'/posts',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	await logEventFromContext(ctx, 'beamer.posts.get', { ...input }, 'completed');

	return response;
};
