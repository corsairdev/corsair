/**
 * Unisender is the source of truth for every list, contact, message and campaign
 * this plugin touches. A contact's status changes when they open a confirmation
 * email, and a campaign's status changes as it sends, so a cached copy would misstate
 * both. Nothing is persisted and no entities are declared.
 */
export const UnisenderSchema = {
	version: '1.0.0',
	entities: {},
} as const;
