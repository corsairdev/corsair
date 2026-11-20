/**
 * HypeAuditor has no entity sync: every operation reads live report data, and a
 * stored copy of a report would be a snapshot of a creator's metrics.
 */
export const HypeAuditorSchema = {
	version: '1.0.0',
	entities: {},
} as const;
