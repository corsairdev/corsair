import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const resolve: PostmanEndpoints['commentsResolve'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['commentsResolve']
	>('/comments-resolutions/{threadId}', ctx.key, {
		method: 'POST',
		path: {
			threadId: input.threadId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.comments.resolve',
		{ ...input },
		'completed',
	);
	return response;
};
