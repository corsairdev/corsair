import { BulkRecord, EnrichRecord, SearchRecord } from './database';

export const OrbitSchema = {
	version: '1.0.0',
	entities: {
		searches: SearchRecord,
		enrichments: EnrichRecord,
		bulkJobs: BulkRecord,
	},
} as const;

export type { BulkRecord, EnrichRecord, SearchRecord } from './database';
