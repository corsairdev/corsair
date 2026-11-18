import { defineEndpoint } from './factory';

export const list = defineEndpoint('contactGroups.list');

export const endpoints = {
	list,
} as const;
