export const CraftmypdfSchema = {
	version: '1.0.0',
	// Templates and transactions are read live on every call. Caching them
	// would report stale credit usage and miss a template renamed in the
	// CraftMyPDF console.
	entities: {},
} as const;
