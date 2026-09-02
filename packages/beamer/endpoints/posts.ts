import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { BeamerEndpoints } from '..';
import { makeBeamerRequest } from '../client';
import { PostsGetInputSchema, PostsGetResponseSchema } from './types';

export const get: BeamerEndpoints['postsGet'] = async (ctx, input) => {
	if (!ctx.key?.trim()) {
		throw new AuthMissingError('beamer', 'api_key');
	}

	const parsedInput = PostsGetInputSchema.parse(input);
	const response = await makeBeamerRequest<unknown>('/posts', ctx.key, {
		method: 'GET',
		query: {
			page: parsedInput.page,
			maxResults: parsedInput.maxResults,
			saveViews: false,
			ignoreRequestDetails: true,
		},
	});

	const parsed = PostsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'beamer.posts.get',
		{ ...parsedInput },
		'completed',
	);

	return parsed;
};
