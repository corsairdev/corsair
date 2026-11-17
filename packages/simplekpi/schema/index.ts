/**
 * KPI data changes with every entry written, and a stale copy would answer a
 * read with last week's numbers. `entities` stays empty for that reason.
 */
export const SimplekpiSchema = {
	version: '1.0.0',
	entities: {},
} as const;
