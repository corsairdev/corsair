// Demio's public API is read-only apart from registration, and a registration
// is a request to a third party rather than a record Corsair keeps. Caching
// events here would serve a stale date list from a source that changes more
// often than a stored copy is read, so the plugin stores nothing.
export const DemioSchema = {
	version: '1.0.0',
	entities: {},
} as const;
