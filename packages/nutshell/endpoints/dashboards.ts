import { defineEndpoint } from './factory';

export const dashboardsListFields = defineEndpoint('dashboards.listFields');

export const endpoints = {
	dashboards: {
		listFields: dashboardsListFields,
	},
} as const;
