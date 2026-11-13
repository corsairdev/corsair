/**
 * respond.io is the source of truth for every contact, conversation and message
 * this plugin touches, and its data changes with every inbound message. A cached
 * copy would go stale within seconds, and for a message it would also risk
 * counting one delivery twice. Nothing is persisted and no entities are declared.
 */
export const RespondioSchema = {
	version: '1.0.0',
	entities: {},
} as const;
