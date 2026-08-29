import { logEventFromContext } from 'corsair/core';
import type { DynapicturesEndpoints } from '..';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpointOutputs } from './types';

export const get: DynapicturesEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDynapicturesRequest<
		DynapicturesEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'dynapictures.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
