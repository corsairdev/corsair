import { logEventFromContext } from 'corsair/core';
import type { ApaleoEndpoints } from '..';
import type { ApaleoEndpointOutputs } from './types';
import { makeApaleoRequest } from '../client';

export const get: ApaleoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeApaleoRequest<ApaleoEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'apaleo.example.get', { ...input }, 'completed');
	return response;
};
