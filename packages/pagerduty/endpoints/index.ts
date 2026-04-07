import {
	create as incidentNotesCreate,
	list as incidentNotesList,
} from './incident-notes';
import {
	create as incidentsCreate,
	get as incidentsGet,
	list as incidentsList,
	update as incidentsUpdate,
} from './incidents';
import { get as logEntriesGet, list as logEntriesList } from './log-entries';
import { get as usersGet } from './users';

export const Incidents = {
	create: incidentsCreate,
	get: incidentsGet,
	list: incidentsList,
	update: incidentsUpdate,
};

export const IncidentNotes = {
	create: incidentNotesCreate,
	list: incidentNotesList,
};

export const LogEntries = {
	get: logEntriesGet,
	list: logEntriesList,
};

export const Users = {
	get: usersGet,
};

export * from './types';
