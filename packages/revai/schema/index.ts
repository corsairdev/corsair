import { RevAIJob } from './database';

export const RevAISchema = {
	version: '1.0.0',
	entities: {
		job: RevAIJob,
	},
} as const;
