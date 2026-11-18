import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	ListsCommentsCreateInput,
	ListsCommentsCreateResponse,
	ListsCommentsGetInput,
	ListsCommentsGetResponse,
	ListsCreateFolderlessInput,
	ListsCreateFolderlessResponse,
	ListsCreateFromTemplateInput,
	ListsCreateFromTemplateResponse,
	ListsCreateInput,
	ListsCreateResponse,
	ListsDeleteInput,
	ListsDeleteResponse,
	ListsFolderlessInput,
	ListsFolderlessResponse,
	ListsGetInput,
	ListsGetResponse,
	ListsListInput,
	ListsListResponse,
	ListsMembersInput,
	ListsMembersResponse,
	ListsUpdateInput,
	ListsUpdateResponse,
	ListsViewsCreateInput,
	ListsViewsCreateResponse,
	ListsViewsGetInput,
	ListsViewsGetResponse,
} from './types';

export async function list(
	ctx: ClickupRequestContext,
	input: ListsListInput,
): Promise<ListsListResponse> {
	const { folder_id, ...query } = input;
	const response = await makeClickupRequest<ListsListResponse>(
		`folder/${folder_id}/list`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.list',
		{ folder_id },
		'completed',
	);
	return response;
}

export async function folderless(
	ctx: ClickupRequestContext,
	input: ListsFolderlessInput,
): Promise<ListsFolderlessResponse> {
	const { space_id, ...query } = input;
	const response = await makeClickupRequest<ListsFolderlessResponse>(
		`space/${space_id}/list`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.folderless',
		{ space_id },
		'completed',
	);
	return response;
}

export async function get(
	ctx: ClickupRequestContext,
	input: ListsGetInput,
): Promise<ListsGetResponse> {
	const response = await makeClickupRequest<ListsGetResponse>(
		`list/${input.list_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.get',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: ListsCreateInput,
): Promise<ListsCreateResponse> {
	const { folder_id, ...body } = input;
	const response = await makeClickupRequest<ListsCreateResponse>(
		`folder/${folder_id}/list`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.create',
		{ folder_id },
		'completed',
	);
	return response;
}

export async function createFolderless(
	ctx: ClickupRequestContext,
	input: ListsCreateFolderlessInput,
): Promise<ListsCreateFolderlessResponse> {
	const { space_id, ...body } = input;
	const response = await makeClickupRequest<ListsCreateFolderlessResponse>(
		`space/${space_id}/list`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.createFolderless',
		{ space_id },
		'completed',
	);
	return response;
}

export async function createFromTemplate(
	ctx: ClickupRequestContext,
	input: ListsCreateFromTemplateInput,
): Promise<ListsCreateFromTemplateResponse> {
	const { folder_id, template_id } = input;
	const response = await makeClickupRequest<ListsCreateFromTemplateResponse>(
		`folder/${folder_id}/list_template/${template_id}`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.createFromTemplate',
		{ folder_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: ListsUpdateInput,
): Promise<ListsUpdateResponse> {
	const { list_id, ...body } = input;
	const response = await makeClickupRequest<ListsUpdateResponse>(
		`list/${list_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.update',
		{ list_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: ListsDeleteInput,
): Promise<ListsDeleteResponse> {
	const response = await makeClickupRequest<ListsDeleteResponse>(
		`list/${input.list_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.delete',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function members(
	ctx: ClickupRequestContext,
	input: ListsMembersInput,
): Promise<ListsMembersResponse> {
	const response = await makeClickupRequest<ListsMembersResponse>(
		`list/${input.list_id}/member`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.members',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function commentsGet(
	ctx: ClickupRequestContext,
	input: ListsCommentsGetInput,
): Promise<ListsCommentsGetResponse> {
	const { list_id, ...query } = input;
	const response = await makeClickupRequest<ListsCommentsGetResponse>(
		`list/${list_id}/comment`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.commentsGet',
		{ list_id },
		'completed',
	);
	return response;
}

export async function commentsCreate(
	ctx: ClickupRequestContext,
	input: ListsCommentsCreateInput,
): Promise<ListsCommentsCreateResponse> {
	const { list_id, ...body } = input;
	const response = await makeClickupRequest<ListsCommentsCreateResponse>(
		`list/${list_id}/comment`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.commentsCreate',
		{ list_id },
		'completed',
	);
	return response;
}

export async function viewsGet(
	ctx: ClickupRequestContext,
	input: ListsViewsGetInput,
): Promise<ListsViewsGetResponse> {
	const response = await makeClickupRequest<ListsViewsGetResponse>(
		`list/${input.list_id}/view`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.viewsGet',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function viewsCreate(
	ctx: ClickupRequestContext,
	input: ListsViewsCreateInput,
): Promise<ListsViewsCreateResponse> {
	const { list_id, ...body } = input;
	const response = await makeClickupRequest<ListsViewsCreateResponse>(
		`list/${list_id}/view`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.lists.viewsCreate',
		{ list_id },
		'completed',
	);
	return response;
}
