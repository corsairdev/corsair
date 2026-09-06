import { makeEverhourRequest } from '../client';
import type { EverhourTask } from '../schema/database';

export const searchTasks = async (
	apiKey: string,
	options: {
		query: string;
		project?: string;
		limit?: number;
		searchInClosed?: boolean;
	},
) => {
	return makeEverhourRequest<EverhourTask[]>('/tasks/search', apiKey, {
		method: 'GET',
		query: options,
	});
};

export const getTask = async (apiKey: string, options: { taskId: string }) => {
	return makeEverhourRequest<EverhourTask>(`/tasks/${options.taskId}`, apiKey);
};

export const listTasksForProject = async (
	apiKey: string,
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
		apiKey,
		{
			method: 'GET',
			query: options.query,
		},
	);
};
