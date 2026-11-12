export const HeyySchema = {
	version: '1.0.0',
	// Heyy holds contacts, channels and conversations, and the API has no
	// list-everything route to sync from: the search routes need a query and a
	// page per resource. Copying contacts and their attributes into the local
	// database is also a decision a plugin should not make unprompted, so no
	// entities are stored.
	entities: {},
} as const;
