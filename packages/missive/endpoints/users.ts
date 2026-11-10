import { defineEndpoint } from './factory';

export const list = defineEndpoint('users.list');

export const endpoints = {
	list,
} as const;
