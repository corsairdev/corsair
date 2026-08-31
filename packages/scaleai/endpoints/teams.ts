import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';
import type { GetTeamsResponse, ScaleTeammateSchema } from './types';

type Teammate = z.infer<typeof ScaleTeammateSchema>;

export const getTeams: ScaleAiEndpoints['getTeams'] = async (ctx) => {
	const response = await makeScaleAiRequest<GetTeamsResponse>(
		'teams',
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.teams.list',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const inviteTeamMember: ScaleAiEndpoints['inviteTeamMember'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<Teammate[]>(
		'teams/invite',
		ctx.key,
		{
			method: 'POST',
			body: { emails: input.emails, team_role: input.role },
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.teams.invite',
		{ email_count: input.emails.length, role: input.role },
		'completed',
	);
	return response;
};
