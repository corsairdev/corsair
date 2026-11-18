/**
 * Similarweb data is a live measurement that changes every month, so a stored
 * copy would be stale before it was read. `entities` stays empty for that
 * reason.
 */
export const SimilarwebSchema = {
	version: '1.0.0',
	entities: {},
} as const;
