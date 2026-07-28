import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import { HashnodeEndpointOutputSchemas, ME_QUERY, USER_QUERY } from './types';

export const me: HashnodeEndpoints['me'] = async (ctx) => {
	const response = await makeHashnodeRequest(
		ME_QUERY,
		ctx.key,
		undefined,
		HashnodeEndpointOutputSchemas.me,
	);

	await logEventFromContext(ctx, 'hashnode.me', {}, 'completed');
	return response;
};

export const getUser: HashnodeEndpoints['getUser'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		USER_QUERY,
		ctx.key,
		{ username: input.username },
		HashnodeEndpointOutputSchemas.getUser,
	);

	await logEventFromContext(
		ctx,
		'hashnode.getUser',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
