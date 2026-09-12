import { logEventFromContext } from 'corsair/core';
import type { DocsumoEndpoints } from '..';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpointOutputs } from './types';

export const get: DocsumoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDocsumoRequest<
		DocsumoEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'docsumo.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
