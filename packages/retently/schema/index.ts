/**
 * Retently is the source of truth for every record this plugin touches:
 * customers, companies, campaigns, templates, feedback and the outbox all live
 * in the account and change from the dashboard as well as the API. Caching a
 * copy would go stale, so nothing is persisted and no entities are declared.
 */
export const RetentlySchema = {
	version: '1.0.0',
	entities: {},
} as const;
