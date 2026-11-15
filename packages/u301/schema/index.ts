/**
 * U301 is the source of truth for every short link, domain and click count this
 * plugin touches, and a click count changes with every visit. A cached copy would
 * under-report clicks the moment it was written. Nothing is persisted and no
 * entities are declared.
 */
export const U301Schema = {
	version: '1.0.0',
	entities: {},
} as const;
