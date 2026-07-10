import { logEventFromContext } from 'corsair/core';
import type { HashnodeEndpoints } from '..';
import type { HashnodeEndpointOutputs } from './types';
import { makeHashnodeRequest } from '../client';

export const get: HashnodeEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<HashnodeEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'hashnode.example.get', { ...input }, 'completed');
	return response;
};
