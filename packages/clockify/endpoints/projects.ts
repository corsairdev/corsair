import { logEventFromContext } from 'corsair/core';
import type { ClockifyEndpoints } from '..';
import { makeClockifyRequest } from '../client';
import { ClockifyEndpointOutputSchemas } from './types';

export const list: ClockifyEndpoints['projectsList'] = async (ctx, input) => {
	const response = await makeClockifyRequest<unknown>(
		`workspaces/${input.workspaceId}/projects`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clockify.projects.list',
		{ ...input },
		'completed',
	);
	return ClockifyEndpointOutputSchemas.projectsList.parse(response);
};
