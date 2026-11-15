import { defineEndpoint } from './factory';

export const list = defineEndpoint('contactBooks.list');

export const endpoints = {
	list,
} as const;
