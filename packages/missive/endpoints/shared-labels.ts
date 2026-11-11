import { defineEndpoint } from './factory';

export const create = defineEndpoint('sharedLabels.create');
export const update = defineEndpoint('sharedLabels.update');
export const list = defineEndpoint('sharedLabels.list');

export const endpoints = {
	create,
	update,
	list,
} as const;
