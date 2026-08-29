import { AbuseIPDBIpCheck, AbuseIPDBReport } from './database';

export const AbuseIPDBSchema = {
	version: '1.0.0',
	entities: {
		ipChecks: AbuseIPDBIpCheck,
		reports: AbuseIPDBReport,
	},
} as const;
