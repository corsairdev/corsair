import { defineEndpoint } from './factory';

export const accountTypesList = defineEndpoint('accountTypes.list');

export const endpoints = {
	accountTypes: {
		list: accountTypesList,
	},
} as const;
