/**
 * SignWell has no list worth storing: documents and templates change as each
 * recipient signs, and a copy saved here would be stale before the next read.
 * `entities` stays empty for that reason.
 */
export const SignwellSchema = {
	version: '1.0.0',
	entities: {},
} as const;
