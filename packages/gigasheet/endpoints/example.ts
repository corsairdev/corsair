import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import type { GigasheetEndpointOutputs } from './types';
import { makeGigasheetRequest } from '../client';

export const get: GigasheetEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGigasheetRequest<GigasheetEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'gigasheet.example.get', { ...input }, 'completed');
	return response;
};
