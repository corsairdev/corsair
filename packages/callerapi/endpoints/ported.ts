import { logEventFromContext } from 'corsair/core';
import type { CallerapiEndpoints } from '..';
import { makeCallerapiRequest } from '../client';
import type { CallerapiEndpointOutputs } from './types';

export const ported: CallerapiEndpoints['ported'] = async (ctx, input) => {
	const response = await makeCallerapiRequest<
		CallerapiEndpointOutputs['ported']
	>(`ported/${encodeURIComponent(input.phone)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'callerapi.ported', { ...input }, 'completed');

	return response;
};
