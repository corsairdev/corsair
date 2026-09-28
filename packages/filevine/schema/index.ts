import {
	FilevineContact,
	FilevineDeadline,
	FilevineDocument,
	FilevineNote,
	FilevineProject,
	FilevineSubscription,
	FilevineTask,
} from './database';

export const FilevineSchema = {
	version: '1.0.0',
	entities: {
		projects: FilevineProject,
		contacts: FilevineContact,
		documents: FilevineDocument,
		notes: FilevineNote,
		deadlines: FilevineDeadline,
		tasks: FilevineTask,
		subscriptions: FilevineSubscription,
	},
} as const;
