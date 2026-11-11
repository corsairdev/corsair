import { defineEndpoint } from './factory';

export const list = defineEndpoint('responses.list');
export const get = defineEndpoint('responses.get');
export const create = defineEndpoint('responses.create');
export const update = defineEndpoint('responses.update');
export const deleteResponse = defineEndpoint('responses.delete');

export const endpoints = {
	list,
	get,
	create,
	update,
	delete: deleteResponse,
} as const;
