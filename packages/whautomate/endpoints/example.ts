import { logEventFromContext } from 'corsair/core';
import type { WhautomateEndpoints } from '..';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpointOutputs } from './types';

export const get: WhautomateEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeWhautomateRequest<
		WhautomateEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'whautomate.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
