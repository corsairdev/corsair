import { logEventFromContext } from 'corsair/core';
import type { BrexEndpoints } from '..';
import type { BrexEndpointOutputs } from './types';
import { makeBrexRequest } from '../client';

export const get: BrexEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBrexRequest<BrexEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'brex.example.get', { ...input }, 'completed');
	return response;
};
