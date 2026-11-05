import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	FoldersCreateInput,
	FoldersCreateResponse,
	FoldersDeleteInput,
	FoldersDeleteResponse,
	FoldersGetInput,
	FoldersGetResponse,
	FoldersListInput,
	FoldersListResponse,
	FoldersUpdateInput,
	FoldersUpdateResponse,
	FoldersViewsCreateInput,
	FoldersViewsCreateResponse,
	FoldersViewsGetInput,
	FoldersViewsGetResponse,
} from './types';

export async function list(
	ctx: ClickupRequestContext,
	input: FoldersListInput,
): Promise<FoldersListResponse> {
	const { space_id, ...query } = input;
	const response = await makeClickupRequest<FoldersListResponse>(
		`space/${space_id}/folder`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.list',
		{ space_id },
		'completed',
	);
	return response;
}

export async function get(
	ctx: ClickupRequestContext,
	input: FoldersGetInput,
): Promise<FoldersGetResponse> {
	const response = await makeClickupRequest<FoldersGetResponse>(
		`folder/${input.folder_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.get',
		{ folder_id: input.folder_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: FoldersCreateInput,
): Promise<FoldersCreateResponse> {
	const { space_id, ...body } = input;
	const response = await makeClickupRequest<FoldersCreateResponse>(
		`space/${space_id}/folder`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.create',
		{ space_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: FoldersUpdateInput,
): Promise<FoldersUpdateResponse> {
	const { folder_id, ...body } = input;
	const response = await makeClickupRequest<FoldersUpdateResponse>(
		`folder/${folder_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.update',
		{ folder_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: FoldersDeleteInput,
): Promise<FoldersDeleteResponse> {
	const response = await makeClickupRequest<FoldersDeleteResponse>(
		`folder/${input.folder_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.delete',
		{ folder_id: input.folder_id },
		'completed',
	);
	return response;
}

export async function viewsGet(
	ctx: ClickupRequestContext,
	input: FoldersViewsGetInput,
): Promise<FoldersViewsGetResponse> {
	const response = await makeClickupRequest<FoldersViewsGetResponse>(
		`folder/${input.folder_id}/view`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.viewsGet',
		{ folder_id: input.folder_id },
		'completed',
	);
	return response;
}

export async function viewsCreate(
	ctx: ClickupRequestContext,
	input: FoldersViewsCreateInput,
): Promise<FoldersViewsCreateResponse> {
	const { folder_id, ...body } = input;
	const response = await makeClickupRequest<FoldersViewsCreateResponse>(
		`folder/${folder_id}/view`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.folders.viewsCreate',
		{ folder_id },
		'completed',
	);
	return response;
}
