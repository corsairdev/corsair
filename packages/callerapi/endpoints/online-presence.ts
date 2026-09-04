import { logEventFromContext } from 'corsair/core';
import type { CallerapiEndpoints } from '..';
import { makeCallerapiRequest } from '../client';
import type { CallerapiEndpointOutputs } from './types';

export const onlinePresence: CallerapiEndpoints['onlinePresence'] = async (
	ctx,
	input,
) => {
	const response = await makeCallerapiRequest<
		CallerapiEndpointOutputs['onlinePresence']
	>(`online-presence/${encodeURIComponent(input.phone)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'callerapi.online_presence',
		{ ...input },
		'completed',
	);

	return response;
};
