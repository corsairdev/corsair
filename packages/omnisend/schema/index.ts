export const OmnisendSchema = {
	version: '1.0.0',
	// Omnisend is the system of record for contacts, campaigns and products, and
	// the plugin reads them on demand. Copying contact data, including emails and
	// phone numbers, into the local database is a decision the caller should
	// make, so no entities are stored.
	entities: {},
} as const;
