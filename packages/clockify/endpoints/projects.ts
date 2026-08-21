import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import { ClockifyEndpointOutputSchemas } from './types';

export const list: ClockifyEndpoints['projectsList'] = async (ctx, input) => {
	const query = clockifyQuery({
		page: input.page,
		'page-size': input.pageSize,
	});
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${input.workspaceId}/projects`,
		ctx.key,
		{
			method: 'GET',
			...(query ? { query } : {}),
		},
	);

	const parsed = ClockifyEndpointOutputSchemas.projectsList.parse(response);
	await logEventFromContext(
		ctx,
		'clockify.projects.list',
		{ ...input },
		'completed',
	);
	return parsed;
};
