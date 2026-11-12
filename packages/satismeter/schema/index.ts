/**
 * SatisMeter data is read on demand and never mirrored locally. Responses,
 * users and statistics are the provider's live record, and a stored copy would
 * be stale and would duplicate personal data (email, IP, traits) that the
 * provider already holds and that `users.remove` exists to erase.
 */
export const SatisMeterSchema = {
	version: '1.0.0',
	entities: {},
} as const;
