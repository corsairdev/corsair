export const TaggunSchema = {
	version: '1.0.0',
	// Taggun is stateless from Corsair's side: every call is synchronous and
	// returns its result in the response, so there is nothing to sync into the
	// database. Receipts stay in Taggun's storage, not here.
	entities: {},
} as const;
