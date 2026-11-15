import { defineEndpoint } from './factory';

export const editionsList = defineEndpoint('editions.list');
export const editionsGet = defineEndpoint('editions.get');

export const endpoints = {
	editions: {
		list: editionsList,
		get: editionsGet,
	},
} as const;
