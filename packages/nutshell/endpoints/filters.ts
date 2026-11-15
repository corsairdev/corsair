import { defineEndpoint } from './factory';

export const filtersList = defineEndpoint('filters.list');

export const endpoints = {
	filters: {
		list: filtersList,
	},
} as const;
