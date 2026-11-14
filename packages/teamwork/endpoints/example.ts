import { logEventFromContext } from 'corsair/core';
import type { TeamworkEndpoints } from '..';
import type { TeamworkEndpointOutputs } from './types';
import { makeTeamworkRequest } from '../client';

export const get: TeamworkEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeTeamworkRequest<TeamworkEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'teamwork.example.get', { ...input }, 'completed');
	return response;
};
