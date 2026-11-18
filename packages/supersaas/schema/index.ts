/**
 * Bookings change as clients book and cancel, so a stored copy would answer a
 * read with an out-of-date agenda. `entities` stays empty for that reason.
 */
export const SupersaasSchema = {
	version: '1.0.0',
	entities: {},
} as const;
