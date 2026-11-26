import { logEventFromContext } from 'corsair/core';
import type { FathomAiEndpoints } from '..';
import { makeFathomAiRequest } from '../client';
import {
	FathomAiEndpointInputSchemas,
	FathomAiEndpointOutputSchemas,
} from './types';

export const list: FathomAiEndpoints['teamsList'] = async (ctx, input) => {
	const query = FathomAiEndpointInputSchemas.teamsList.parse(input);
	const response = FathomAiEndpointOutputSchemas.teamsList.parse(
		await makeFathomAiRequest('/teams', ctx.key, { method: 'GET', query }),
	);
	for (const team of response.items) {
		await ctx.db.teams.upsertByEntityId(team.name, team);
	}
	await logEventFromContext(
		ctx,
		'fathomai.teams.list',
		{ count: response.items.length },
		'completed',
	);
	return response;
};

export const listMembers: FathomAiEndpoints['teamMembersList'] = async (
	ctx,
	input,
) => {
	const query = FathomAiEndpointInputSchemas.teamMembersList.parse(input);
	const response = FathomAiEndpointOutputSchemas.teamMembersList.parse(
		await makeFathomAiRequest('/team_members', ctx.key, {
			method: 'GET',
			query,
		}),
	);
	for (const member of response.items) {
		await ctx.db.teamMembers.upsertByEntityId(member.email, member);
	}
	await logEventFromContext(
		ctx,
		'fathomai.teamMembers.list',
		{ count: response.items.length },
		'completed',
	);
	return response;
};
