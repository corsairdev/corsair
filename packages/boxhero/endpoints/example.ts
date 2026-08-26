import { logEventFromContext } from 'corsair/core';
import type { BoxheroEndpoints } from '..';
import type { BoxheroEndpointOutputs } from './types';
import { makeBoxheroRequest } from '../client';

export const get: BoxheroEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBoxheroRequest<BoxheroEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'boxhero.example.get', { ...input }, 'completed');
	return response;
};
