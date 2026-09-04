import { logEventFromContext } from 'corsair/core';
import type { CallerapiEndpoints } from '..';
import { makeCallerapiRequest } from '../client';
import type { CallerapiEndpointOutputs } from './types';

export const lookup: CallerapiEndpoints['lookup'] = async (ctx, input) => {
	const response = await makeCallerapiRequest<
		CallerapiEndpointOutputs['lookup']
	>(`lookup/${encodeURIComponent(input.phone)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'callerapi.lookup', { ...input }, 'completed');

	return response;
};
