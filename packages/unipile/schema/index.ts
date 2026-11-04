// Nothing is cached locally: LinkedIn profiles, chats and messages are read
// live from Unipile, which already caches provider reads and rate-limits them.
// They are personal data, and the app driving outreach keeps its own state
// (who was invited, who replied) keyed by the IDs these endpoints return.
export const UnipileSchema = {
	version: '1.0.0',
	entities: {},
} as const;
