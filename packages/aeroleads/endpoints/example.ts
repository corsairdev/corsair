import { logEventFromContext } from 'corsair/core';
import type { AeroleadsEndpoints } from '..';
import type { AeroleadsEndpointOutputs } from './types';
import { makeAeroleadsRequest } from '../client';

export const get: AeroleadsEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAeroleadsRequest<AeroleadsEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'aeroleads.example.get', { ...input }, 'completed');
	return response;
};
