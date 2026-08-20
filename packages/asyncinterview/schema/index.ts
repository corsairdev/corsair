import {
	AsyncInterviewInterviewEntity,
	AsyncInterviewJobEntity,
} from './database';

export const AsyncInterviewSchema = {
	version: '1.0.0',
	entities: {
		jobs: AsyncInterviewJobEntity,
		interviews: AsyncInterviewInterviewEntity,
	},
} as const;

export * from './database';
export * from './primitives';
