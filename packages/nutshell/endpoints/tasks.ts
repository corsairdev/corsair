import { defineEndpoint } from './factory';

export const tasksGet = defineEndpoint('tasks.get');
export const tasksList = defineEndpoint('tasks.list');
export const tasksCreate = defineEndpoint('tasks.create');
export const tasksDelete = defineEndpoint('tasks.delete');
export const tasksUpdate = defineEndpoint('tasks.update');

export const endpoints = {
	tasks: {
		get: tasksGet,
		list: tasksList,
		create: tasksCreate,
		delete: tasksDelete,
		update: tasksUpdate,
	},
} as const;
