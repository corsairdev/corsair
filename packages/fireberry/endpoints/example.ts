import { logEventFromContext } from 'corsair/core';
import type { FireberryEndpoints } from '..';
import type { FireberryEndpointOutputs } from './types';
import { makeFireberryRequest } from '../client';

export const get: FireberryEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFireberryRequest<FireberryEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'fireberry.example.get', { ...input }, 'completed');
	return response;
};
