/**
 * Rosette is a stateless text-analysis service: every call derives an answer from
 * the text it is given, and nothing it returns is a record the account owns. There
 * is nothing worth caching, and the text itself is the caller's content rather than
 * something to store. No entities are declared.
 */
export const RosetteSchema = {
	version: '1.0.0',
	entities: {},
} as const;
