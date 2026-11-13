import {
	getApplication,
	getApplicationStats,
	updateApplication,
} from './application';
import {
	createEvent,
	deleteEvent,
	getEvent,
	listEvents,
	searchEvents,
	updateEvent,
} from './events';
import {
	createTemplate,
	deleteTemplate,
	getTemplate,
	listTemplates,
	updateTemplate,
} from './templates';

export const Events = {
	list: listEvents,
	get: getEvent,
	create: createEvent,
	update: updateEvent,
	delete: deleteEvent,
	search: searchEvents,
};

export const Templates = {
	list: listTemplates,
	get: getTemplate,
	create: createTemplate,
	update: updateTemplate,
	delete: deleteTemplate,
};

export const Application = {
	get: getApplication,
	update: updateApplication,
	getStats: getApplicationStats,
};

export * from './types';
