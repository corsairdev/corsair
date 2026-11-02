import { logEventFromContext } from 'corsair/core';
import type { WoodpeckerCoEndpoints } from '..';
import { makeWoodpeckerCoRequest } from '../client';
import type { WoodpeckerCoEndpointOutputs } from './types';

export const get: WoodpeckerCoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeWoodpeckerCoRequest<
		WoodpeckerCoEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'woodpeckerco.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
