// PhantomBuster is a REST API integration. No local database entities are
// needed for the core agent/container operations since data is fetched live.
// The schema is intentionally empty but satisfies the required plugin shape.
export const PhantomBusterSchema = {
	version: '1.0.0',
	entities: {},
} as const;
