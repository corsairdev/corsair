/**
 * Honeybadger has no entity sync: every read is a live API call, and a stored
 * copy of a fault would go stale the moment a new notice arrived.
 */
export const HoneybadgerSchema = {
	version: '1.0.0',
	entities: {},
} as const;
