import { logEventFromContext } from 'corsair/core';
import type { WaboxappEndpoints } from '..';
import { makeWaboxappRequest } from '../client';
import type { WaboxappEndpointOutputs } from './types';

export const get: WaboxappEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeWaboxappRequest<
		WaboxappEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'waboxapp.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
