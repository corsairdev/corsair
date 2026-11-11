import { defineEndpoint } from './factory';

export const eventsList = defineEndpoint('events.list');
export const eventsDeleted = defineEndpoint('events.deleted');

export const endpoints = {
	events: {
		list: eventsList,
		deleted: eventsDeleted,
	},
} as const;
