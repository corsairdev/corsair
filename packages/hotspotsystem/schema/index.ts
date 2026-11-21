/**
 * HotspotSystem has no entity sync: every operation reads live data from the
 * API, and a stored copy of a transaction would never update.
 */
export const HotspotSystemSchema = {
	version: '1.0.0',
	entities: {},
} as const;
