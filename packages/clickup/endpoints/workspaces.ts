import { logEventFromContext } from 'corsair/core';
import type { ClickupEndpoints } from '..';
import { makeClickupRequest } from '../client';
import type { ClickupEndpointOutputs } from './types';

export const get: ClickupEndpoints['workspacesGet'] = async (ctx, input) => {
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['workspacesGet']
	>('team', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'clickup.workspaces.get',
		{ ...input },
		'completed',
	);
	return response;
};
