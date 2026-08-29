import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const get: BlackbaudEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBlackbaudRequest<
		BlackbaudEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'blackbaud.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
