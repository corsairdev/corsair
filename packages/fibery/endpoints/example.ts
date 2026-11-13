import { logEventFromContext } from 'corsair/core';
import type { FiberyEndpoints } from '..';
import type { FiberyEndpointOutputs } from './types';
import { makeFiberyRequest } from '../client';

export const get: FiberyEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFiberyRequest<FiberyEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'fibery.example.get', { ...input }, 'completed');
	return response;
};
