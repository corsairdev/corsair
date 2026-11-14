import { logEventFromContext } from 'corsair/core';
import type { StackExchangeEndpoints } from '..';
import type { StackExchangeEndpointOutputs } from './types';
import { makeStackExchangeRequest } from '../client';

export const get: StackExchangeEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeStackExchangeRequest<StackExchangeEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'stackexchange.example.get', { ...input }, 'completed');
	return response;
};
