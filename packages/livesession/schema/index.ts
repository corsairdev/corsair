/**
 * LiveSession is a live API integration: sessions, alerts, webhooks, and
 * websites are read from or written to the provider on every call. No local
 * entities are stored, so the initial schema is empty.
 */
export const LiveSessionSchema = {
	version: '1.0.0',
	entities: {},
} as const;
