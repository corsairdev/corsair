import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import type { GleapEndpointOutputs } from './types';
import { makeGleapRequest } from '../client';

export const get: GleapEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGleapRequest<GleapEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'gleap.example.get', { ...input }, 'completed');
	return response;
};
