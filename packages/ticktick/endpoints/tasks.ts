import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedTickTickRequest } from '../client';
import type { TickTickEndpoints } from '../index';
import type {
	CreateTaskResponse,
	GetTaskResponse,
	TickTickProject,
	TickTickTask,
	UpdateTaskResponse,
} from './types';

export const create: TickTickEndpoints['createTask'] = async (ctx, input) => {
	const response = await makeAuthenticatedTickTickRequest<CreateTaskResponse>(
		'task',
		ctx,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.task.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const complete: TickTickEndpoints['completeTask'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedTickTickRequest<void>(
		`project/${input.projectId}/task/${input.taskId}/complete`,
		ctx,
		{
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.task.complete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteTask: TickTickEndpoints['deleteTask'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedTickTickRequest<void>(
		`project/${input.projectId}/task/${input.taskId}`,
		ctx,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.task.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const get: TickTickEndpoints['getTask'] = async (ctx, input) => {
	const response = await makeAuthenticatedTickTickRequest<GetTaskResponse>(
		`project/${input.projectId}/task/${input.taskId}`,
		ctx,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.task.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: TickTickEndpoints['updateTask'] = async (ctx, input) => {
	const { taskId, ...body } = input;
	const response = await makeAuthenticatedTickTickRequest<UpdateTaskResponse>(
		`task/${taskId}`,
		ctx,
		{
			method: 'POST',
			body: {
				// id is a required body field on the official endpoint; projectId
				// rides along in the rest payload as the schema requires it
				id: taskId,
				...body,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'ticktick.task.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const listAll: TickTickEndpoints['listAllTasks'] = async (
	ctx,
	input,
) => {
	const projects = await makeAuthenticatedTickTickRequest<TickTickProject[]>(
		'project',
		ctx,
		{
			method: 'GET',
		},
	);

	// Fetched sequentially so an account with many projects does not burst past
	// the provider's rate limit; failures propagate to the error handlers
	// instead of returning a partial list that looks complete
	const allTasks: TickTickTask[] = [];
	for (const project of projects) {
		const projectData = await makeAuthenticatedTickTickRequest<{
			tasks: TickTickTask[];
		}>(`project/${project.id}/data`, ctx, {
			method: 'GET',
		});
		if (projectData && Array.isArray(projectData.tasks)) {
			allTasks.push(...projectData.tasks);
		}
	}

	await logEventFromContext(
		ctx,
		'ticktick.task.listAll',
		{ ...input },
		'completed',
	);
	return allTasks;
};
