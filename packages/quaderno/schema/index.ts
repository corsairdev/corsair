export const QuadernoSchema = {
	version: '1.0.0',
	// No entities. Quaderno's documents are legal records that must be voided
	// rather than deleted, and the API exposes no updated-since cursor to sync
	// on, so a local copy could never be known fresh. Every endpoint reads live.
	entities: {},
} as const;
