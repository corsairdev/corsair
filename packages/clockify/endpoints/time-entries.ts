import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import { ClockifyEndpointOutputSchemas } from './types';

export const create: ClockifyEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const { workspaceId, ...body } = input;
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${workspaceId}/time-entries`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed =
		ClockifyEndpointOutputSchemas.timeEntriesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.timeEntries.create',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const list: ClockifyEndpoints['timeEntriesList'] = async (
	ctx,
	input,
) => {
	const { workspaceId, userId, projectId, page, pageSize, description } = input;
	const query = clockifyQuery({
		description,
		project: projectId,
		page,
		'page-size': pageSize,
	});
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${workspaceId}/user/${userId}/time-entries`,
		ctx.key,
		{
			method: 'GET',
			...(query ? { query } : {}),
		},
	);

	const parsed = ClockifyEndpointOutputSchemas.timeEntriesList.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.timeEntries.list',
		{ ...input },
		'completed',
	);
	return parsed;
};
