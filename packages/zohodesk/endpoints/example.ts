import { logEventFromContext } from 'corsair/core';
import type { ZohoDeskEndpoints } from '..';
import { makeZohoDeskRequest } from '../client';
import type { ZohoDeskEndpointOutputs } from './types';

export const get: ZohoDeskEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeZohoDeskRequest<
		ZohoDeskEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'zohodesk.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
