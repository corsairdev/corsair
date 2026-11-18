import { defineEndpoint } from './factory';

export const create = defineEndpoint('contacts.create');
export const update = defineEndpoint('contacts.update');
export const list = defineEndpoint('contacts.list');
export const get = defineEndpoint('contacts.get');

export const endpoints = {
	create,
	update,
	list,
	get,
} as const;
