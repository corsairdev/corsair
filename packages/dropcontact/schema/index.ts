export const DropcontactSchema = {
	version: '1.0.0',
	// Enrichment results are read straight from the provider by request_id. There
	// is no listing endpoint to sync from, and copying personal data (emails,
	// phone numbers) into the local database is not something a plugin should do
	// without being asked, so no entities are stored.
	entities: {},
} as const;
