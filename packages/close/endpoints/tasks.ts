import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksDeleteResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TasksUpdateResponse,
} from './types';

export const tasksList = async (
	ctx: CloseContext,
	input?: TasksListInput,
): Promise<TasksListResponse> => {
	const res = await makeCloseRequest<TasksListResponse>('task/', ctx.key, {
		method: 'GET',
		query: input,
	});
	return res;
};

export const tasksGet = async (
	ctx: CloseContext,
	input: TasksGetInput,
): Promise<TasksGetResponse> => {
	const res = await makeCloseRequest<TasksGetResponse>(
		`task/${input.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return res;
};

export const tasksCreate = async (
	ctx: CloseContext,
	input: TasksCreateInput,
): Promise<TasksCreateResponse> => {
	const res = await makeCloseRequest<TasksCreateResponse>('task/', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});
	return res;
};

export const tasksUpdate = async (
	ctx: CloseContext,
	input: TasksUpdateInput,
): Promise<TasksUpdateResponse> => {
	const { id, ...body } = input;
	const res = await makeCloseRequest<TasksUpdateResponse>(
		`task/${id}/`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);
	return res;
};

export const tasksDelete = async (
	ctx: CloseContext,
	input: TasksDeleteInput,
): Promise<TasksDeleteResponse> => {
	await makeCloseRequest<unknown>(`task/${input.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return { success: true, id: input.id };
};
