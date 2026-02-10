import * as Events from './events';
import * as Calendar from './calendar';

export const EventsEndpoints = {
	create: Events.create,
	get: Events.get,
	getMany: Events.getMany,
	update: Events.update,
	delete: Events.deleteEvent,
};

export const CalendarEndpoints = {
	getAvailability: Calendar.getAvailability,
};

export * from './types';
