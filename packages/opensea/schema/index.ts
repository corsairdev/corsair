export const OpenseaSchema = {
	version: '1.0.0',
	// No entities. OpenSea's catalogue changes constantly (new listings, sales,
	// owners), and the API exposes no updated-since cursor to sync on, so a
	// stored copy would be stale with no way to know it. Every endpoint reads
	// live.
	entities: {},
} as const;
