import {
	AbuseIPDBBlacklistEntry,
	AbuseIPDBIpCheck,
	AbuseIPDBReport,
} from './database';

export const AbuseIPDBSchema = {
	version: '1.0.0',
	entities: {
		ipChecks: AbuseIPDBIpCheck,
		reports: AbuseIPDBReport,
		blacklistEntries: AbuseIPDBBlacklistEntry,
	},
} as const;
