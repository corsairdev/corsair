import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { POST_COMMENTS_QUERY } from './types';

export const listPostComments: HashnodeEndpoints['listPostComments'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['listPostComments']
	>(POST_COMMENTS_QUERY, ctx.key, {
		postId: input.postId,
		first: input.first ?? 10,
		after: input.after,
	});

	await logEventFromContext(
		ctx,
		'hashnode.listPostComments',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
