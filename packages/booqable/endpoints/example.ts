import { logEventFromContext } from 'corsair/core';
import type { BooqableEndpoints } from '..';
import { makeBooqableRequest } from '../client';
import type { BooqableEndpointOutputs } from './types';

export const get: BooqableEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBooqableRequest<
		BooqableEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'booqable.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
