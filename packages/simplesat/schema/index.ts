/**
 * A Simplesat response changes as customers answer, and a stored copy would
 * answer a read with yesterday's feedback. `entities` stays empty for that
 * reason.
 */
export const SimplesatSchema = {
	version: '1.0.0',
	entities: {},
} as const;
