import { defineEndpoint } from './factory';

export const territoriesList = defineEndpoint('territories.list');

export const endpoints = {
	territories: {
		list: territoriesList,
	},
} as const;
