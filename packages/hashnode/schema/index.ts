// Hashnode doesn't require local data persistence for any of its resources.
// All data is fetched live from the Hashnode GraphQL API.
// The entities map is intentionally empty to reflect that this plugin
// does not persist data to the Corsair database.
export const HashnodeSchema = {
	version: '1.0.0',
	entities: {},
} as const;
