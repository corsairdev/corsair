import { logEventFromContext } from 'corsair/core';
import type { ForceManagerEndpoints } from '..';
import type { ForceManagerEndpointOutputs } from './types';
import { makeForceManagerRequest } from '../client';

export const get: ForceManagerEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeForceManagerRequest<ForceManagerEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'forcemanager.example.get', { ...input }, 'completed');
	return response;
};
