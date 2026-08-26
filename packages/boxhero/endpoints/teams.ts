import { logEventFromContext } from 'corsair/core';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index.ts';
import type { BoxheroEndpointOutputs } from './types';

export const getTeamInfo: BoxheroEndpoints['teamsGetInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['teamsGetInfo']
	>('/v1/teams/linked', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'boxhero.teams.getInfo', input, 'completed');
	return response;
};
