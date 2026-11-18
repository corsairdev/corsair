import { defineEndpoint } from './factory';

export const list = defineEndpoint('tasks.list');
export const get = defineEndpoint('tasks.get');
export const create = defineEndpoint('tasks.create');
export const update = defineEndpoint('tasks.update');

export const endpoints = {
	list,
	get,
	create,
	update,
} as const;
