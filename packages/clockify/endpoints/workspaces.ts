import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { makeClockifyRequest } from '../client';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './types';

export const list: ClockifyEndpoints['workspacesList'] = async (ctx, input) => {
	const parsedInput = ClockifyEndpointInputSchemas.workspacesList.parse(input);
	const response = await makeClockifyRequest<unknown>('workspaces', ctx.key, {
		method: 'GET',
	});

	const parsed = ClockifyEndpointOutputSchemas.workspacesList.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.workspaces.list',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
