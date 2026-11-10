// The plugin returns live API data and stores nothing locally: no endpoint
// writes an entity, so none is declared (a declared entity would offer a local
// search that always comes back empty).
export const MissiveSchema = {
	version: '1.0.0',
	entities: {},
} as const;
