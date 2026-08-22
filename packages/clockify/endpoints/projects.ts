import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { clockifyQuery, makeClockifyRequest } from '../client';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './types';

export const list: ClockifyEndpoints['projectsList'] = async (ctx, input) => {
	const parsedInput = ClockifyEndpointInputSchemas.projectsList.parse(input);
	const query = clockifyQuery({
		page: parsedInput.page,
		'page-size': parsedInput.pageSize,
	});
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${parsedInput.workspaceId}/projects`,
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
		{ ...parsedInput },
		'completed',
	);
	return parsed;
};
