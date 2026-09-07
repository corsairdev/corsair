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
import {
	TasksCreateInputSchema,
	TasksCreateResponseSchema,
	TasksDeleteInputSchema,
	TasksDeleteResponseSchema,
	TasksGetInputSchema,
	TasksGetResponseSchema,
	TasksListInputSchema,
	TasksListResponseSchema,
	TasksUpdateInputSchema,
	TasksUpdateResponseSchema,
} from './types';

export const tasksList = async (
	ctx: CloseContext,
	input?: TasksListInput,
): Promise<TasksListResponse> => {
	const parsedInput = input ? TasksListInputSchema.parse(input) : undefined;
	const res = await makeCloseRequest<unknown>('task/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return TasksListResponseSchema.parse(res);
};

export const tasksGet = async (
	ctx: CloseContext,
	input: TasksGetInput,
): Promise<TasksGetResponse> => {
	const parsedInput = TasksGetInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>(
		`task/${parsedInput.id}/`,
		ctx.key,
		{ method: 'GET' },
	);
	return TasksGetResponseSchema.parse(res);
};

export const tasksCreate = async (
	ctx: CloseContext,
	input: TasksCreateInput,
): Promise<TasksCreateResponse> => {
	const parsedInput = TasksCreateInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>('task/', ctx.key, {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return TasksCreateResponseSchema.parse(res);
};

export const tasksUpdate = async (
	ctx: CloseContext,
	input: TasksUpdateInput,
): Promise<TasksUpdateResponse> => {
	const parsedInput = TasksUpdateInputSchema.parse(input);
	const { id, ...body } = parsedInput;
	const res = await makeCloseRequest<unknown>(`task/${id}/`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	return TasksUpdateResponseSchema.parse(res);
};

export const tasksDelete = async (
	ctx: CloseContext,
	input: TasksDeleteInput,
): Promise<TasksDeleteResponse> => {
	const parsedInput = TasksDeleteInputSchema.parse(input);
	await makeCloseRequest<unknown>(`task/${parsedInput.id}/`, ctx.key, {
		method: 'DELETE',
	});
	return TasksDeleteResponseSchema.parse({ success: true, id: parsedInput.id });
};
