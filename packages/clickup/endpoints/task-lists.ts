import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	TaskListsAddInput,
	TaskListsAddResponse,
	TaskListsRemoveInput,
	TaskListsRemoveResponse,
} from './types';

export async function add(
	ctx: ClickupRequestContext,
	input: TaskListsAddInput,
): Promise<TaskListsAddResponse> {
	const response = await makeClickupRequest<TaskListsAddResponse>(
		`list/${input.list_id}/task/${input.task_id}`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskLists.add',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}

export async function remove(
	ctx: ClickupRequestContext,
	input: TaskListsRemoveInput,
): Promise<TaskListsRemoveResponse> {
	const response = await makeClickupRequest<TaskListsRemoveResponse>(
		`list/${input.list_id}/task/${input.task_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskLists.remove',
		{ list_id: input.list_id },
		'completed',
	);
	return response;
}
