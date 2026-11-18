import { BytedanceVideoTask } from './database';

export const BytedanceSchema = {
	version: '1.0.0',
	entities: {
		videoTasks: BytedanceVideoTask,
	},
} as const;

export type { BytedanceVideoTask } from './database';
