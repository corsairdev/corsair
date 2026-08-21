import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import { ClockifyEndpointOutputSchemas } from './types';

export const list: ClockifyEndpoints['tasksList'] = async (ctx, input) => {
	const query = clockifyQuery({
		page: input.page,
		'page-size': input.pageSize,
	});
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${input.workspaceId}/projects/${input.projectId}/tasks`,
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
		{ ...input },
		'completed',
	);
	return parsed;
};
