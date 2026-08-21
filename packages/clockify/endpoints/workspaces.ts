import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { makeClockifyRequest } from '../client';
import type { ClockifyEndpointOutputs } from './types';

export const list: ClockifyEndpoints['workspacesList'] = async (ctx, input) => {
	const response = await makeClockifyRequest<
		ClockifyEndpointOutputs['workspacesList']
	>('workspaces', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'clockify.workspaces.list',
		{ ...input },
		'completed',
	);
	return response;
};
