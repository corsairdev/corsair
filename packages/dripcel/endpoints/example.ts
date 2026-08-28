import { logEventFromContext } from 'corsair/core';
import type { DripcelEndpoints } from '..';
import { makeDripcelRequest } from '../client';
import type { DripcelEndpointOutputs } from './types';

export const get: DripcelEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'dripcel.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
