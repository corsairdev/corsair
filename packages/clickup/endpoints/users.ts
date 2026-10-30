import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	UsersGetInput,
	UsersGetResponse,
	UsersInviteInput,
	UsersInviteResponse,
	UsersRemoveInput,
	UsersRemoveResponse,
	UsersUpdateInput,
	UsersUpdateResponse,
} from './types';

export async function get(
	ctx: ClickupRequestContext,
	input: UsersGetInput,
): Promise<UsersGetResponse> {
	const response = await makeClickupRequest<UsersGetResponse>(
		`team/${input.team_id}/user/${input.user_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.users.get',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function invite(
	ctx: ClickupRequestContext,
	input: UsersInviteInput,
): Promise<UsersInviteResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<UsersInviteResponse>(
		`team/${team_id}/user`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.users.invite',
		{ team_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: UsersUpdateInput,
): Promise<UsersUpdateResponse> {
	const { team_id, user_id, ...body } = input;
	const response = await makeClickupRequest<UsersUpdateResponse>(
		`team/${team_id}/user/${user_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.users.update',
		{ team_id },
		'completed',
	);
	return response;
}

export async function remove(
	ctx: ClickupRequestContext,
	input: UsersRemoveInput,
): Promise<UsersRemoveResponse> {
	const response = await makeClickupRequest<UsersRemoveResponse>(
		`team/${input.team_id}/user/${input.user_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.users.remove',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}
