import { makeEverhourRequest } from '../client';
import type { EverhourTask } from '../schema/database';

export const searchTasks = async (
	ctx: any,
	options: {
		query: string;
		project?: string;
		limit?: number;
		searchInClosed?: boolean;
	},
) => {
	return makeEverhourRequest<EverhourTask[]>('/tasks/search', ctx.key, {
		method: 'GET',
		query: options,
	});
};

export const getTask = async (ctx: any, options: { taskId: string }) => {
	return makeEverhourRequest<EverhourTask>(`/tasks/${options.taskId}`, ctx.key);
};

export const listTasksForProject = async (
	ctx: any,
	options: {
		projectId: string;
		query?: {
			query?: string;
			limit?: number;
			searchInClosed?: boolean;
			searchInUnscheduled?: boolean;
		};
	},
) => {
	return makeEverhourRequest<EverhourTask[]>(
		`/projects/${options.projectId}/tasks/search`,
		ctx.key,
		{
			method: 'GET',
			query: options.query,
		},
	);
};
