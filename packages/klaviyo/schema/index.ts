export const KlaviyoSchema = {
	version: '1.0.0',
	// Klaviyo is the system of record for profiles, and the plugin reads them by
	// filter and cursor. Copying profile data, including emails and phone
	// numbers, into the local database is a decision the caller should make, so
	// no entities are stored.
	entities: {},
} as const;
