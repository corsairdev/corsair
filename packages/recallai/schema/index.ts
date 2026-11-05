/**
 * Recall.ai calls return live API data; the plugin stores no entities
 * locally. Bots and recordings change state in Recall (joining, recording,
 * processing), so a local copy would go stale between calls.
 */
export const RecallaiSchema = {
	version: '1.0.0',
	entities: {},
} as const;
