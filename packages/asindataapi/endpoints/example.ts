import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import type { AsinDataApiEndpointOutputs } from './types';
import { makeAsinDataApiRequest } from '../client';

export const get: AsinDataApiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAsinDataApiRequest<AsinDataApiEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'asindataapi.example.get', { ...input }, 'completed');
	return response;
};
