import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourTask } from '../schema/database';

export const searchTasks: EverhourEndpoints['searchTasks'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourTask[]>('/tasks/search', ctx.key, {
		method: 'GET',
		query: options,
	});
};

export const getTask: EverhourEndpoints['getTask'] = async (ctx, options) => {
	return makeEverhourRequest<EverhourTask>(`/tasks/${options.taskId}`, ctx.key);
};

export const listTasksForProject: EverhourEndpoints['listTasksForProject'] =
	async (ctx, options) => {
		return makeEverhourRequest<EverhourTask[]>(
			`/projects/${options.projectId}/tasks`,
			ctx.key,
			{
				method: 'GET',
				query: options.query,
			},
		);
	};

export const createTask: EverhourEndpoints['createTask'] = async (
	ctx,
	options,
) => {
	const { projectId, ...body } = options;
	return makeEverhourRequest<EverhourTask>(
		`/projects/${projectId}/tasks`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);
};
