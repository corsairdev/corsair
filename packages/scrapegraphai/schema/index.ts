import { ScrapegraphAiJob } from './database';

export const ScrapegraphAiSchema = {
	version: '1.0.0',
	entities: {
		jobs: ScrapegraphAiJob,
	},
} as const;
