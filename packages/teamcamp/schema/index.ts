export const TeamcampSchema = {
	version: '1.0.0',
	// Teamcamp is the record for projects and tasks, and its list endpoints are
	// single calls, so a local copy would only go stale between syncs.
	entities: {},
} as const;
