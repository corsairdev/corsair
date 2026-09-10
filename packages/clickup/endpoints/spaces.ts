import { logEventFromContext } from 'corsair/core';
import type { ClickupEndpoints } from '..';
import { makeClickupRequest } from '../client';
import type { ClickupEndpointOutputs } from './types';

export const list: ClickupEndpoints['spacesList'] = async (ctx, input) => {
	const response = await makeClickupRequest<
		ClickupEndpointOutputs['spacesList']
	>(`team/${input.team_id}/space`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'clickup.spaces.list',
		{ ...input },
		'completed',
	);
	return response;
};
