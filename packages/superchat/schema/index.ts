/**
 * Conversations and contacts change with every message, and a stored copy would
 * answer a read with an outdated inbox state. `entities` stays empty for that
 * reason.
 */
export const SuperchatSchema = {
	version: '1.0.0',
	entities: {},
} as const;
