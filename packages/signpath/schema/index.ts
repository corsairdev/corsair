/**
 * SignPath has no syncable list worth storing: projects, policies and signing
 * requests change as artifacts are signed, and a stale copy is worse than one
 * extra API read. `entities` stays empty for that reason.
 */
export const SignpathSchema = {
	version: '1.0.0',
	entities: {},
} as const;
