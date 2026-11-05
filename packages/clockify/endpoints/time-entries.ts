import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './types';

export const create: ClockifyEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ClockifyEndpointInputSchemas.timeEntriesCreate.parse(input);
	const { workspaceId, ...body } = parsedInput;
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${workspaceId}/time-entries`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
			retries: false,
		},
	);

	const parsed =
		ClockifyEndpointOutputSchemas.timeEntriesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.timeEntries.create',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};

export const list: ClockifyEndpoints['timeEntriesList'] = async (
	ctx,
	input,
) => {
	const parsedInput = ClockifyEndpointInputSchemas.timeEntriesList.parse(input);
	const { workspaceId, userId, project, page, pageSize, description } =
		parsedInput;
	const query = clockifyQuery({
		description,
		project,
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
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
