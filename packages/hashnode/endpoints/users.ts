import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { ME_QUERY, USER_QUERY } from './types';

export const me: HashnodeEndpoints['me'] = async (ctx) => {
	const response = await makeHashnodeRequest<HashnodeEndpointOutputs['me']>(
		ME_QUERY,
		ctx.key,
	);

	await logEventFromContext(ctx, 'hashnode.me', {}, 'completed');
	return response;
};

export const getUser: HashnodeEndpoints['getUser'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getUser']
	>(USER_QUERY, ctx.key, { username: input.username });

	await logEventFromContext(ctx, 'hashnode.getUser', { ...input }, 'completed');
	return response;
};
