export const ZenRowsSchema = {
	version: '1.0.0',
	// Zenrows renders, crawls and extracts on its own servers; nothing it
	// returns is worth mirroring locally, because a stored page would go stale
	// against the site it came from.
	entities: {},
} as const;
