/**
 * Simplero records change as contacts sign up, purchase and unsubscribe, so a
 * stored copy would answer a read with stale data. `entities` stays empty for
 * that reason.
 */
export const SimpleroSchema = {
	version: '1.0.0',
	entities: {},
} as const;
