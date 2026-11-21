import { logEventFromContext } from 'corsair/core';
import type { ZohoBooksEndpoints } from '..';
import type { ZohoBooksEndpointOutputs } from './types';
import { makeZohoBooksRequest } from '../client';

export const get: ZohoBooksEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeZohoBooksRequest<ZohoBooksEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'zohobooks.example.get', { ...input }, 'completed');
	return response;
};
