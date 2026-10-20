import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	GuestsAddToFolderInput,
	GuestsAddToFolderResponse,
	GuestsAddToListInput,
	GuestsAddToListResponse,
	GuestsAddToTaskInput,
	GuestsAddToTaskResponse,
	GuestsGetInput,
	GuestsGetResponse,
	GuestsInviteInput,
	GuestsInviteResponse,
	GuestsRemoveFromFolderInput,
	GuestsRemoveFromFolderResponse,
	GuestsRemoveFromListInput,
	GuestsRemoveFromListResponse,
	GuestsRemoveFromTaskInput,
	GuestsRemoveFromTaskResponse,
	GuestsRemoveInput,
	GuestsRemoveResponse,
	GuestsUpdateInput,
	GuestsUpdateResponse,
} from './types';

export async function get(
	ctx: ClickupRequestContext,
	input: GuestsGetInput,
): Promise<GuestsGetResponse> {
	const response = await makeClickupRequest<GuestsGetResponse>(
		`team/${input.team_id}/guest/${input.guest_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.get',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function invite(
	ctx: ClickupRequestContext,
	input: GuestsInviteInput,
): Promise<GuestsInviteResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<GuestsInviteResponse>(
		`team/${team_id}/guest`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.invite',
		{ team_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: GuestsUpdateInput,
): Promise<GuestsUpdateResponse> {
	const { team_id, guest_id, ...body } = input;
	const response = await makeClickupRequest<GuestsUpdateResponse>(
		`team/${team_id}/guest/${guest_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.update',
		{ team_id },
		'completed',
	);
	return response;
}

export async function remove(
	ctx: ClickupRequestContext,
	input: GuestsRemoveInput,
): Promise<GuestsRemoveResponse> {
	const response = await makeClickupRequest<GuestsRemoveResponse>(
		`team/${input.team_id}/guest/${input.guest_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.remove',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function addToTask(
	ctx: ClickupRequestContext,
	input: GuestsAddToTaskInput,
): Promise<GuestsAddToTaskResponse> {
	const { task_id, guest_id, custom_task_ids, team_id, ...body } = input;
	const response = await makeClickupRequest<GuestsAddToTaskResponse>(
		`task/${task_id}/guest/${guest_id}`,
		ctx.key,
		{ method: 'POST', body, query: { custom_task_ids, team_id } },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.addToTask',
		{ task_id },
		'completed',
	);
	return response;
}

export async function removeFromTask(
	ctx: ClickupRequestContext,
	input: GuestsRemoveFromTaskInput,
): Promise<GuestsRemoveFromTaskResponse> {
	const { task_id, guest_id, ...query } = input;
	const response = await makeClickupRequest<GuestsRemoveFromTaskResponse>(
		`task/${task_id}/guest/${guest_id}`,
		ctx.key,
		{ method: 'DELETE', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.removeFromTask',
		{ task_id },
		'completed',
	);
	return response;
}

export async function addToList(
	ctx: ClickupRequestContext,
	input: GuestsAddToListInput,
): Promise<GuestsAddToListResponse> {
	const { list_id, guest_id, ...body } = input;
	const response = await makeClickupRequest<GuestsAddToListResponse>(
		`list/${list_id}/guest/${guest_id}`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.addToList',
		{ list_id },
		'completed',
	);
	return response;
}

export async function removeFromList(
	ctx: ClickupRequestContext,
	input: GuestsRemoveFromListInput,
): Promise<GuestsRemoveFromListResponse> {
	const response = await makeClickupRequest<GuestsRemoveFromListResponse>(
		`list/${input.list_id}/guest/${input.guest_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.removeFromList',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function addToFolder(
	ctx: ClickupRequestContext,
	input: GuestsAddToFolderInput,
): Promise<GuestsAddToFolderResponse> {
	const { folder_id, guest_id, ...body } = input;
	const response = await makeClickupRequest<GuestsAddToFolderResponse>(
		`folder/${folder_id}/guest/${guest_id}`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.addToFolder',
		{ folder_id },
		'completed',
	);
	return response;
}

export async function removeFromFolder(
	ctx: ClickupRequestContext,
	input: GuestsRemoveFromFolderInput,
): Promise<GuestsRemoveFromFolderResponse> {
	const response = await makeClickupRequest<GuestsRemoveFromFolderResponse>(
		`folder/${input.folder_id}/guest/${input.guest_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.guests.removeFromFolder',
		{ folder_id: input.folder_id },
		'completed',
	);
	return response;
}
