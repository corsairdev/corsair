import { getEvent } from './get-event';
import { getEvents } from './get-events';
import { getTags } from './get-tags';

export const Events = {
	get: getEvent,
	list: getEvents,
};

export const Tags = {
	list: getTags,
};

export * from './types';
