/**
 * Refiner is the source of truth for every contact, response, survey and segment
 * this plugin touches, and its data changes from the dashboard as well as the API.
 * A cached copy would go stale, and for a response record it would also risk
 * counting the same submission twice. Nothing is persisted and no entities are
 * declared.
 */
export const RefinerSchema = {
	version: '1.0.0',
	entities: {},
} as const;
