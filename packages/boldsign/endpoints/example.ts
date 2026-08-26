import { logEventFromContext } from 'corsair/core';
import type { BoldsignEndpoints } from '..';
import { makeBoldsignRequest } from '../client';
import type { BoldsignEndpointOutputs } from './types';

export const get: BoldsignEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBoldsignRequest<
		BoldsignEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'boldsign.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
