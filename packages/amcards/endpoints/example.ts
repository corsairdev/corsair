import { logEventFromContext } from 'corsair/core';
import type { AmcardsEndpoints } from '..';
import { makeAmcardsRequest } from '../client';
import type { AmcardsEndpointOutputs } from './types';

export const get: AmcardsEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAmcardsRequest<
		AmcardsEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'amcards.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
