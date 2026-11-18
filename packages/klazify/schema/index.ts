// Klazify is a lookup service: it classifies a URL or email on demand and holds
// no record the caller would want back later. A cached copy would also go stale
// in a way the `refresh` flag already handles per call, so the plugin stores
// nothing.
export const KlazifySchema = {
	version: '1.0.0',
	entities: {},
} as const;
