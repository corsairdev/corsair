import { logEventFromContext } from 'corsair/core';
import type { BeaconstacEndpoints } from '..';
import { makeBeaconstacRequest } from '../client';
import type { BeaconstacEndpointOutputs } from './types';

export const get: BeaconstacEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBeaconstacRequest<
		BeaconstacEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'beaconstac.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
