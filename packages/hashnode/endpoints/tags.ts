import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { TAG_QUERY } from './types';

export const getTag: HashnodeEndpoints['getTag'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<HashnodeEndpointOutputs['getTag']>(
		TAG_QUERY,
		ctx.key,
		{ slug: input.slug },
	);

	await logEventFromContext(ctx, 'hashnode.getTag', { ...input }, 'completed');
	return response;
};
