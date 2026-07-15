import { logEventFromContext } from 'corsair/core';
import type { RetailedEndpoints } from '..';
import { makeRetailedRequest } from '../client';
import type { RetailedEndpointOutputs } from './types';

export const get: RetailedEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'retailed.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
