import { Job } from './database';

export const SuzanneSchema = {
	version: '1.0.0',
	entities: {
		jobs: Job,
	},
} as const;

export type { Job } from './database';
