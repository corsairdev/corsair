import { logEventFromContext } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import type { GrafbaseEndpointOutputs } from './types';
import { makeGrafbaseRequest } from '../client';

export const get: GrafbaseEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGrafbaseRequest<GrafbaseEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'grafbase.example.get', { ...input }, 'completed');
	return response;
};
