import {
	CloudflareDnsRecord,
	CloudflareDnssec,
	CloudflareLockdown,
	CloudflareR2Object,
	CloudflareRuleset,
	CloudflareZone,
} from './database';

export const CloudflareApiKeySchema = {
	version: '1.0.0',
	entities: {
		zones: CloudflareZone,
		dnsRecords: CloudflareDnsRecord,
		dnssec: CloudflareDnssec,
		lockdowns: CloudflareLockdown,
		rulesets: CloudflareRuleset,
		r2Objects: CloudflareR2Object,
	},
} as const;
