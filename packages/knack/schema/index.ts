// Knack's records change under the app's own forms and automations as well as
// through this API, so a cached copy would report a record state the caller
// never sees in Knack. The plugin stores nothing and every read is live.
export const KnackSchema = {
	version: '1.0.0',
	entities: {},
} as const;
