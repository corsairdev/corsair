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
		User: EverhourUser,
		Project: EverhourProject,
		Task: EverhourTask,
		TimeEntry: EverhourTimeEntry,
		Client: EverhourClient,
		Platform: EverhourPlatform,
	},
} as const;
