import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import {
	makeGleapRequest,
	resolveGleapTarget,
	successOnEmptyBody,
} from '../client';
import type {
	TeamsCreateOutput,
	TeamsDeleteOutput,
	TeamsListOutput,
	TeamsUpdateOutput,
} from './types';
import { GleapEndpointInputSchemas, GleapEndpointOutputSchemas } from './types';

export const list: GleapEndpoints['teamsList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.teamsList.parse(input);
	const response = await makeGleapRequest<TeamsListOutput>('/teams', ctx.key, {
		method: 'GET',
		...(await resolveGleapTarget(ctx, parsed.project)),
	});
	const output = GleapEndpointOutputSchemas.teamsList.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.teams.list',
		{ count: output.length },
		'completed',
	);
	return output;
};

export const create: GleapEndpoints['teamsCreate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.teamsCreate.parse(input);
	const { project, ...body } = parsed;
	const response = await makeGleapRequest<TeamsCreateOutput>(
		'/teams',
		ctx.key,
		{
			method: 'POST',
			body,
			...(await resolveGleapTarget(ctx, project)),
		},
	);
	const output = GleapEndpointOutputSchemas.teamsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.teams.create',
		{ completed: true },
		'completed',
	);
	return output;
};

export const update: GleapEndpoints['teamsUpdate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.teamsUpdate.parse(input);
	const { teamId, project, ...body } = parsed;
	const response = await makeGleapRequest<TeamsUpdateOutput>(
		`/teams/${encodeURIComponent(teamId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
			...(await resolveGleapTarget(ctx, project)),
		},
	);
	const output = GleapEndpointOutputSchemas.teamsUpdate.parse(response);
	await logEventFromContext(ctx, 'gleap.teams.update', { teamId }, 'completed');
	return output;
};

export const del: GleapEndpoints['teamsDelete'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.teamsDelete.parse(input);
	const response = await makeGleapRequest<TeamsDeleteOutput>(
		`/teams/${encodeURIComponent(parsed.teamId)}`,
		ctx.key,
		{
			method: 'DELETE',
			...(await resolveGleapTarget(ctx, parsed.project)),
		},
	);
	const output = GleapEndpointOutputSchemas.teamsDelete.parse(
		successOnEmptyBody(response),
	);
	await logEventFromContext(
		ctx,
		'gleap.teams.delete',
		{ teamId: parsed.teamId },
		'completed',
	);
	return output;
};
