import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { makeClockifyRequest } from '../client';
import { ClockifyEndpointOutputSchemas } from './types';

export const list: ClockifyEndpoints['workspacesList'] = async (ctx, input) => {
	const response = await makeClockifyRequest<unknown>('workspaces', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'clockify.workspaces.list',
		{ ...input },
		'completed',
	);
	return ClockifyEndpointOutputSchemas.workspacesList.parse(response);
};
