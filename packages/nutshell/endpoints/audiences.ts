import { defineEndpoint } from './factory';

export const audiencesList = defineEndpoint('audiences.list');
export const audiencesCreate = defineEndpoint('audiences.create');

export const endpoints = {
	audiences: {
		list: audiencesList,
		create: audiencesCreate,
	},
} as const;
