import {
	EverhourClient,
	EverhourPlatform,
	EverhourProject,
	EverhourTask,
	EverhourTimeEntry,
	EverhourUser,
} from './database';

export const EverhourSchema = {
	version: '1.0.0',
	entities: {
		users: EverhourUser,
		projects: EverhourProject,
		tasks: EverhourTask,
		timeEntries: EverhourTimeEntry,
		clients: EverhourClient,
		platforms: EverhourPlatform,
	},
} as const;
