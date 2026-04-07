import {
	OuraDailyActivity,
	OuraDailyReadiness,
	OuraDailySleep,
	OuraPersonalInfo,
} from './database';

export const OuraSchema = {
	version: '1.0.0',
	entities: {
		personalInfo: OuraPersonalInfo,
		dailyActivity: OuraDailyActivity,
		dailyReadiness: OuraDailyReadiness,
		dailySleep: OuraDailySleep,
	},
} as const;
