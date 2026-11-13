import { get as eventsGet, list as eventsList, getDate, ping } from './events';
import { create as registrationsCreate } from './registrations';
import { participants as reportsParticipants } from './reports';

export const Events = {
	list: eventsList,
	get: eventsGet,
	getDate,
};

export const Registrations = {
	create: registrationsCreate,
};

export const Reports = {
	participants: reportsParticipants,
};

export const Ping = {
	check: ping,
};

/** One flat map per group, in the shape `index.ts` registers. */
export const demioEndpoints = {
	events: Events,
	registrations: Registrations,
	reports: Reports,
	ping: Ping,
} as const;

export * from './types';
