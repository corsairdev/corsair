export const OnedeskSchema = {
	version: '1.0.0',
	// Every read is a live filter call against the account, because OneDesk
	// has no incremental sync cursor: caching would report stale ticket state.
	entities: {},
} as const;
