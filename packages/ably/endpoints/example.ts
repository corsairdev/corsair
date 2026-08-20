import { logEventFromContext } from 'corsair/core';
import type { AblyEndpoints } from '..';
import { makeAblyRequest } from '../client';
import type { AblyEndpointOutputs } from './types';

export const get: AblyEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAblyRequest<AblyEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'ably.example.get', { ...input }, 'completed');
	return response;
};
