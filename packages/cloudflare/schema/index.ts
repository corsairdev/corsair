import {
	CloudflareDnsRecord,
	CloudflareRuleset,
	CloudflareWorkerRoute,
	CloudflareWorkerScript,
	CloudflareZone,
} from './database';

export const CloudflareSchema = {
	version: '1.0.0',
	entities: {
		zones: CloudflareZone,
		dnsRecords: CloudflareDnsRecord,
		workerScripts: CloudflareWorkerScript,
		workerRoutes: CloudflareWorkerRoute,
		rulesets: CloudflareRuleset,
	},
} as const;
