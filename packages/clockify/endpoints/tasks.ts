import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { makeClockifyRequest } from '../client';
import { ClockifyEndpointOutputSchemas } from './types';

export const list: ClockifyEndpoints['tasksList'] = async (ctx, input) => {
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${input.workspaceId}/projects/${input.projectId}/tasks`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clockify.tasks.list',
		{ ...input },
		'completed',
	);
	return ClockifyEndpointOutputSchemas.tasksList.parse(response);
};
