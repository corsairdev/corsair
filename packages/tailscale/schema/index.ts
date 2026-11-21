/**
 * No local entities. Devices come and go, keys expire and the policy file
 * changes under other admins, so every read goes to the API rather than a
 * cached copy.
 */
export const TailscaleSchema = {
	version: '1.0.0',
	entities: {},
} as const;
