import {
	BeeminderChargeEntity,
	BeeminderGoalEntity,
	BeeminderUserEntity,
} from './database';

export const BeeminderSchema = {
	version: '1.0.0',
	entities: {
		user: BeeminderUserEntity,
		goals: BeeminderGoalEntity,
		charges: BeeminderChargeEntity,
	},
} as const;

export * from './database';
