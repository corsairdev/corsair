import { logEventFromContext } from 'corsair/core';
import type { CallerapiEndpoints } from '..';
import { makeCallerapiRequest } from '../client';
import type { CallerapiEndpointOutputs } from './types';

export const portingHistory: CallerapiEndpoints['portingHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeCallerapiRequest<
		CallerapiEndpointOutputs['portingHistory']
	>(`porting-history/${encodeURIComponent(input.phone)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'callerapi.porting_history',
		{ ...input },
		'completed',
	);

	return response;
};
