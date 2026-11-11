import { defineEndpoint } from './factory';

export const activityTypesList = defineEndpoint('activityTypes.list');

export const endpoints = {
	activityTypes: {
		list: activityTypesList,
	},
} as const;
