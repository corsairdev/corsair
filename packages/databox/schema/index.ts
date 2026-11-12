// Databox keeps no synced local state worth storing: every read here is a
// live query, and ingestions are polled on demand, so entities stay empty.
export const DataboxSchema = {
	version: '1.0.0',
	entities: {},
} as const;
