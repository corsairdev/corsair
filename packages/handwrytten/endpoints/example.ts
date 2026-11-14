import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import type { HandwryttenEndpointOutputs } from './types';
import { makeHandwryttenRequest } from '../client';

export const get: HandwryttenEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHandwryttenRequest<HandwryttenEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'handwrytten.example.get', { ...input }, 'completed');
	return response;
};
