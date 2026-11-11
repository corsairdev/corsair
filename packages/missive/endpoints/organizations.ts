import { defineEndpoint } from './factory';

export const list = defineEndpoint('organizations.list');

export const endpoints = {
	list,
} as const;
