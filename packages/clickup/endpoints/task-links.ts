import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	TaskLinksAddInput,
	TaskLinksAddResponse,
	TaskLinksDeleteInput,
	TaskLinksDeleteResponse,
} from './types';

export async function add(
	ctx: ClickupRequestContext,
	input: TaskLinksAddInput,
): Promise<TaskLinksAddResponse> {
	const { task_id, links_to, ...query } = input;
	const response = await makeClickupRequest<TaskLinksAddResponse>(
		`task/${task_id}/link/${links_to}`,
		ctx.key,
		{ method: 'POST', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskLinks.add',
		{ task_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: TaskLinksDeleteInput,
): Promise<TaskLinksDeleteResponse> {
	const { task_id, links_to, ...query } = input;
	const response = await makeClickupRequest<TaskLinksDeleteResponse>(
		`task/${task_id}/link/${links_to}`,
		ctx.key,
		{ method: 'DELETE', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.taskLinks.delete',
		{ task_id },
		'completed',
	);
	return response;
}
