export const MiroSchema = {
	version: '1.0.0',
	// Boards and their items are read from the API on demand: there is no
	// list-everything route, every item route needs a board id, and copying board
	// content into the local database is a decision the plugin should not make.
	entities: {},
} as const;
