/**
 * The Directory API has no entities worth mirroring: every read is answered by
 * Google, and a user, group or member can change between two calls. Keeping a
 * copy here would serve rows that are already stale.
 */
export const GoogleAdminSchema = {
	version: '1.0.0',
	entities: {},
} as const;
