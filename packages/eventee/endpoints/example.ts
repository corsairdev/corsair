import { logEventFromContext } from 'corsair/core';
import type { EventeeEndpoints } from '..';
import type { EventeeEndpointOutputs } from './types';
import { makeEventeeRequest } from '../client';

export const get: EventeeEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeEventeeRequest<EventeeEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'eventee.example.get', { ...input }, 'completed');
	return response;
};
