import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './types';

export const list: ClockifyEndpoints['tasksList'] = async (ctx, input) => {
	const parsedInput = ClockifyEndpointInputSchemas.tasksList.parse(input);
	const query = clockifyQuery({
		page: parsedInput.page,
		'page-size': parsedInput.pageSize,
	});
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${parsedInput.workspaceId}/projects/${parsedInput.projectId}/tasks`,
		ctx.key,
		{
			method: 'GET',
			...(query ? { query } : {}),
		},
	);

	const parsed = ClockifyEndpointOutputSchemas.tasksList.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.tasks.list',
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
