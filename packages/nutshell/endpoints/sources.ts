import { defineEndpoint } from './factory';

export const sourcesList = defineEndpoint('sources.list');
export const sourcesDelete = defineEndpoint('sources.delete');
export const sourcesUndelete = defineEndpoint('sources.undelete');
export const sourcesCreate = defineEndpoint('sources.create');

export const endpoints = {
	sources: {
		list: sourcesList,
		delete: sourcesDelete,
		undelete: sourcesUndelete,
		create: sourcesCreate,
	},
} as const;
