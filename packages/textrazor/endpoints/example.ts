import { logEventFromContext } from 'corsair/core';
import type { TextrazorEndpoints } from '..';
import { makeTextrazorRequest } from '../client';
import type { TextrazorEndpointOutputs } from './types';

export const get: TextrazorEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTextrazorRequest<
		TextrazorEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'textrazor.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
