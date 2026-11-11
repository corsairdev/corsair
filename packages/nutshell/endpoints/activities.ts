import { defineEndpoint } from './factory';

export const activitiesCreate = defineEndpoint('activities.create');
export const activitiesGet = defineEndpoint('activities.get');
export const activitiesList = defineEndpoint('activities.list');
export const activitiesUpdate = defineEndpoint('activities.update');

export const endpoints = {
	activities: {
		create: activitiesCreate,
		get: activitiesGet,
		list: activitiesList,
		update: activitiesUpdate,
	},
} as const;
