import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getTeams: VercelEndpoints['teamsGetTeams'] = async (
	ctx,
	_input,
) => {
	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['teamsGetTeams']
	>('/v2/teams', ctx);

	if (result && result.teams && ctx.db.teams) {
		for (const team of result.teams) {
			await ctx.db.teams.upsertByEntityId(team.id, {
				id: team.id,
				slug: team.slug,
				name: team.name,
				createdAt: team.createdAt,
				updatedAt: team.updatedAt,
				avatar: team.avatar,
			});
		}
	}

	await logEventFromContext(ctx, 'vercel.teams.getTeams', {}, 'completed');
	return result;
};
