import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	SpacesAvailableFieldsInput,
	SpacesAvailableFieldsResponse,
	SpacesCreateInput,
	SpacesCreateResponse,
	SpacesDeleteInput,
	SpacesDeleteResponse,
	SpacesGetInput,
	SpacesGetResponse,
	SpacesListInput,
	SpacesListResponse,
	SpacesTagsCreateInput,
	SpacesTagsCreateResponse,
	SpacesTagsDeleteInput,
	SpacesTagsDeleteResponse,
	SpacesTagsGetInput,
	SpacesTagsGetResponse,
	SpacesTagsUpdateInput,
	SpacesTagsUpdateResponse,
	SpacesUpdateInput,
	SpacesUpdateResponse,
	SpacesViewsCreateInput,
	SpacesViewsCreateResponse,
	SpacesViewsGetInput,
	SpacesViewsGetResponse,
} from './types';

export async function list(
	ctx: ClickupRequestContext,
	input: SpacesListInput,
): Promise<SpacesListResponse> {
	const { team_id, ...query } = input;
	const response = await makeClickupRequest<SpacesListResponse>(
		`team/${team_id}/space`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.list',
		{ team_id },
		'completed',
	);
	return response;
}

export async function get(
	ctx: ClickupRequestContext,
	input: SpacesGetInput,
): Promise<SpacesGetResponse> {
	const response = await makeClickupRequest<SpacesGetResponse>(
		`space/${input.space_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.get',
		{ space_id: input.space_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: SpacesCreateInput,
): Promise<SpacesCreateResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<SpacesCreateResponse>(
		`team/${team_id}/space`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.create',
		{ team_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: SpacesUpdateInput,
): Promise<SpacesUpdateResponse> {
	const { space_id, ...body } = input;
	const response = await makeClickupRequest<SpacesUpdateResponse>(
		`space/${space_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.update',
		{ space_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: SpacesDeleteInput,
): Promise<SpacesDeleteResponse> {
	const response = await makeClickupRequest<SpacesDeleteResponse>(
		`space/${input.space_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.delete',
		{ space_id: input.space_id },
		'completed',
	);
	return response;
}

export async function availableFields(
	ctx: ClickupRequestContext,
	input: SpacesAvailableFieldsInput,
): Promise<SpacesAvailableFieldsResponse> {
	const response = await makeClickupRequest<SpacesAvailableFieldsResponse>(
		`space/${input.space_id}/field`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.availableFields',
		{ space_id: input.space_id },
		'completed',
	);
	return response;
}

export async function tagsGet(
	ctx: ClickupRequestContext,
	input: SpacesTagsGetInput,
): Promise<SpacesTagsGetResponse> {
	const response = await makeClickupRequest<SpacesTagsGetResponse>(
		`space/${input.space_id}/tag`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.tagsGet',
		{ space_id: input.space_id },
		'completed',
	);
	return response;
}

export async function tagsCreate(
	ctx: ClickupRequestContext,
	input: SpacesTagsCreateInput,
): Promise<SpacesTagsCreateResponse> {
	const { space_id, name, tag_fg, tag_bg } = input;
	const response = await makeClickupRequest<SpacesTagsCreateResponse>(
		`space/${space_id}/tag`,
		ctx.key,
		{ method: 'POST', body: { tag: { name, tag_fg, tag_bg } } },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.tagsCreate',
		{ space_id },
		'completed',
	);
	return response;
}

export async function tagsUpdate(
	ctx: ClickupRequestContext,
	input: SpacesTagsUpdateInput,
): Promise<SpacesTagsUpdateResponse> {
	const { space_id, tag_name, name, tag_fg, tag_bg } = input;
	const response = await makeClickupRequest<SpacesTagsUpdateResponse>(
		`space/${space_id}/tag/${tag_name}`,
		ctx.key,
		{ method: 'PUT', body: { tag: { name, tag_fg, tag_bg } } },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.tagsUpdate',
		{ space_id, tag_name },
		'completed',
	);
	return response;
}

export async function tagsDelete(
	ctx: ClickupRequestContext,
	input: SpacesTagsDeleteInput,
): Promise<SpacesTagsDeleteResponse> {
	const { space_id, tag_name, ...body } = input;
	const response = await makeClickupRequest<SpacesTagsDeleteResponse>(
		`space/${space_id}/tag/${tag_name}`,
		ctx.key,
		{ method: 'DELETE', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.tagsDelete',
		{ space_id, tag_name },
		'completed',
	);
	return response;
}

export async function viewsGet(
	ctx: ClickupRequestContext,
	input: SpacesViewsGetInput,
): Promise<SpacesViewsGetResponse> {
	const response = await makeClickupRequest<SpacesViewsGetResponse>(
		`space/${input.space_id}/view`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.viewsGet',
		{ space_id: input.space_id },
		'completed',
	);
	return response;
}

export async function viewsCreate(
	ctx: ClickupRequestContext,
	input: SpacesViewsCreateInput,
): Promise<SpacesViewsCreateResponse> {
	const { space_id, ...body } = input;
	const response = await makeClickupRequest<SpacesViewsCreateResponse>(
		`space/${space_id}/view`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.spaces.viewsCreate',
		{ space_id },
		'completed',
	);
	return response;
}
