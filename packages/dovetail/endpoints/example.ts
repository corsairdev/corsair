import { logEventFromContext } from 'corsair/core';
import type { DovetailEndpoints } from '..';
import type { DovetailEndpointOutputs } from './types';
import { makeDovetailRequest } from '../client';

export const get: DovetailEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDovetailRequest<DovetailEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'dovetail.example.get', { ...input }, 'completed');
	return response;
};
