import { logEventFromContext } from 'corsair/core';
import type { SimlaComEndpoints } from '..';
import type { SimlaComEndpointOutputs } from './types';
import { makeSimlaComRequest } from '../client';

export const get: SimlaComEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeSimlaComRequest<SimlaComEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'simlacom.example.get', { ...input }, 'completed');
	return response;
};
