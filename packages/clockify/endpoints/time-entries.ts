import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { makeClockifyRequest } from '../client';
import type { ClockifyEndpointOutputs } from './types';

export const create: ClockifyEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...body } = input;
	const response = await makeClockifyRequest<
		ClockifyEndpointOutputs['timeEntriesCreate']
	>(`workspaces/${workspaceId}/time-entries`, ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'clockify.timeEntries.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: ClockifyEndpoints['timeEntriesList'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...query } = input;
	const response = await makeClockifyRequest<
		ClockifyEndpointOutputs['timeEntriesList']
	>(`workspaces/${workspaceId}/time-entries`, ctx.key, {
		method: 'GET',
		query: query as Record<string, string | number | boolean | undefined>,
	});

	await logEventFromContext(
		ctx,
		'clockify.timeEntries.list',
		{ ...input },
		'completed',
	);
	return response;
};
