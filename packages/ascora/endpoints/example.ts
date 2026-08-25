import { logEventFromContext } from 'corsair/core';
import type { AscoraEndpoints } from '..';
import { makeAscoraRequest } from '../client';
import type { AscoraEndpointOutputs } from './types';

export const get: AscoraEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAscoraRequest<AscoraEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'ascora.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
