export const RagieSchema = {
	version: '1.0.0',
	// Nothing is synced into a local database: Ragie's documents and chunks
	// already live behind searchable reads, and webhooks cover status changes.
	entities: {},
} as const;
