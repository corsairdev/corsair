/**
 * Simple Analytics data is an aggregate that changes with every visit, so a
 * stored copy would be stale before it was read. `entities` stays empty for
 * that reason.
 */
export const SimpleanalyticsSchema = {
	version: '1.0.0',
	entities: {},
} as const;
