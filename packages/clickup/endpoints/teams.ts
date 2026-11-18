import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	TeamsCreateInput,
	TeamsCreateResponse,
	TeamsDeleteInput,
	TeamsDeleteResponse,
	TeamsListInput,
	TeamsListResponse,
	TeamsUpdateInput,
	TeamsUpdateResponse,
} from './types';

export async function list(
	ctx: ClickupRequestContext,
	input: TeamsListInput,
): Promise<TeamsListResponse> {
	const response = await makeClickupRequest<TeamsListResponse>(
		'group',
		ctx.key,
		{ method: 'GET', query: { team_id: input.team_id } },
	);

	await logEventFromContext(
		ctx,
		'clickup.teams.list',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: TeamsCreateInput,
): Promise<TeamsCreateResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<TeamsCreateResponse>(
		`team/${team_id}/group`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.teams.create',
		{ team_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: TeamsUpdateInput,
): Promise<TeamsUpdateResponse> {
	const { group_id, ...body } = input;
	const response = await makeClickupRequest<TeamsUpdateResponse>(
		`group/${group_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.teams.update',
		{ group_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: TeamsDeleteInput,
): Promise<TeamsDeleteResponse> {
	const response = await makeClickupRequest<TeamsDeleteResponse>(
		`group/${input.group_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.teams.delete',
		{ group_id: input.group_id },
		'completed',
	);
	return response;
}
