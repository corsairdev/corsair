/**
 * No local entities. Rigs start, stop and disappear, and command runs and
 * agent sessions change by the second, so every read goes to the API rather
 * than a cached copy.
 */
export const AmikaSchema = {
	version: '1.0.0',
	entities: {},
} as const;
