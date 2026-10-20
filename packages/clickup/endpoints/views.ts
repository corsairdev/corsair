import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	ViewsChatCommentsCreateInput,
	ViewsChatCommentsCreateResponse,
	ViewsChatCommentsGetInput,
	ViewsChatCommentsGetResponse,
	ViewsDeleteInput,
	ViewsDeleteResponse,
	ViewsGetInput,
	ViewsGetResponse,
	ViewsTasksInput,
	ViewsTasksResponse,
	ViewsUpdateInput,
	ViewsUpdateResponse,
} from './types';

export async function get(
	ctx: ClickupRequestContext,
	input: ViewsGetInput,
): Promise<ViewsGetResponse> {
	const response = await makeClickupRequest<ViewsGetResponse>(
		`view/${input.view_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.views.get',
		{ view_id: input.view_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: ViewsUpdateInput,
): Promise<ViewsUpdateResponse> {
	const { view_id, ...body } = input;
	const response = await makeClickupRequest<ViewsUpdateResponse>(
		`view/${view_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.views.update',
		{ view_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: ViewsDeleteInput,
): Promise<ViewsDeleteResponse> {
	const response = await makeClickupRequest<ViewsDeleteResponse>(
		`view/${input.view_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.views.delete',
		{ view_id: input.view_id },
		'completed',
	);
	return response;
}

export async function tasks(
	ctx: ClickupRequestContext,
	input: ViewsTasksInput,
): Promise<ViewsTasksResponse> {
	const { view_id, ...query } = input;
	const response = await makeClickupRequest<ViewsTasksResponse>(
		`view/${view_id}/task`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.views.tasks',
		{ view_id },
		'completed',
	);
	return response;
}

export async function chatCommentsGet(
	ctx: ClickupRequestContext,
	input: ViewsChatCommentsGetInput,
): Promise<ViewsChatCommentsGetResponse> {
	const { view_id, ...query } = input;
	const response = await makeClickupRequest<ViewsChatCommentsGetResponse>(
		`view/${view_id}/comment`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.views.chatCommentsGet',
		{ view_id },
		'completed',
	);
	return response;
}

export async function chatCommentsCreate(
	ctx: ClickupRequestContext,
	input: ViewsChatCommentsCreateInput,
): Promise<ViewsChatCommentsCreateResponse> {
	const { view_id, ...body } = input;
	const response = await makeClickupRequest<ViewsChatCommentsCreateResponse>(
		`view/${view_id}/comment`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.views.chatCommentsCreate',
		{ view_id },
		'completed',
	);
	return response;
}
