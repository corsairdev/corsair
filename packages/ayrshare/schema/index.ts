import { AyrshareAutoSchedule } from './database';

export const AyrshareSchema = {
	version: '1.0.0',
	entities: { autoSchedules: AyrshareAutoSchedule },
} as const;

export type { AyrshareAutoSchedule } from './database';
