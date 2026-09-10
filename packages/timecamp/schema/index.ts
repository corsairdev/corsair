import { TimecampProject } from './database';

export const TimecampSchema = {
	version: '1.0.0',
	entities: {
		projects: TimecampProject,
	},
} as const;

export * from './database';
