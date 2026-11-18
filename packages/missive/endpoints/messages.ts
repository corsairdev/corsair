import { defineEndpoint } from './factory';

export const create = defineEndpoint('messages.create');
export const get = defineEndpoint('messages.get');
export const list = defineEndpoint('messages.list');

export const endpoints = {
	create,
	get,
	list,
} as const;
