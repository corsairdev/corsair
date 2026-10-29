import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	TaskCommentsCreateInput,
	TaskCommentsCreateResponse,
	TaskCommentsDeleteInput,
	TaskCommentsDeleteResponse,
	TaskCommentsGetInput,
	TaskCommentsGetResponse,
	TaskCommentsUpdateInput,
	TaskCommentsUpdateResponse,
	ThreadedCommentsCreateInput,
	ThreadedCommentsCreateResponse,
	ThreadedCommentsGetInput,
	ThreadedCommentsGetResponse,
} from './types';

export async function get(
	ctx: ClickupRequestContext,
	input: TaskCommentsGetInput,
): Promise<TaskCommentsGetResponse> {
	const { task_id, ...query } = input;
	const response = await makeClickupRequest<TaskCommentsGetResponse>(
		`task/${task_id}/comment`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskComments.get',
		{ task_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: TaskCommentsCreateInput,
): Promise<TaskCommentsCreateResponse> {
	const { task_id, custom_task_ids, team_id, ...body } = input;
	const response = await makeClickupRequest<TaskCommentsCreateResponse>(
		`task/${task_id}/comment`,
		ctx.key,
		{ method: 'POST', body, query: { custom_task_ids, team_id } },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskComments.create',
		{ task_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: TaskCommentsUpdateInput,
): Promise<TaskCommentsUpdateResponse> {
	const { comment_id, ...body } = input;
	const response = await makeClickupRequest<TaskCommentsUpdateResponse>(
		`comment/${comment_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskComments.update',
		{ comment_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: TaskCommentsDeleteInput,
): Promise<TaskCommentsDeleteResponse> {
	const response = await makeClickupRequest<TaskCommentsDeleteResponse>(
		`comment/${input.comment_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskComments.delete',
		{ comment_id: input.comment_id },
		'completed',
	);
	return response;
}

export async function threadedCreate(
	ctx: ClickupRequestContext,
	input: ThreadedCommentsCreateInput,
): Promise<ThreadedCommentsCreateResponse> {
	const { comment_id, ...body } = input;
	const response = await makeClickupRequest<ThreadedCommentsCreateResponse>(
		`comment/${comment_id}/reply`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskComments.threadedCreate',
		{ comment_id },
		'completed',
	);
	return response;
}

export async function threadedGet(
	ctx: ClickupRequestContext,
	input: ThreadedCommentsGetInput,
): Promise<ThreadedCommentsGetResponse> {
	const response = await makeClickupRequest<ThreadedCommentsGetResponse>(
		`comment/${input.comment_id}/reply`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskComments.threadedGet',
		{ comment_id: input.comment_id },
		'completed',
	);
	return response;
}
