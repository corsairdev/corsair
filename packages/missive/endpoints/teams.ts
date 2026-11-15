import { defineEndpoint } from './factory';

export const list = defineEndpoint('teams.list');
export const create = defineEndpoint('teams.create');
export const update = defineEndpoint('teams.update');

export const endpoints = {
	list,
	create,
	update,
} as const;
