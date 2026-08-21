import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import type { UnioneEndpointOutputs } from './types';

export const get: UnioneEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'unione.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
