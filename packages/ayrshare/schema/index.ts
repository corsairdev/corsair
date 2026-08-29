import { AyrshareAutoSchedule, AyrsharePost } from './database';

export const AyrshareSchema = {
	version: '1.0.0',
	entities: {
		autoSchedules: AyrshareAutoSchedule,
		posts: AyrsharePost,
	},
} as const;

export * from './database';
