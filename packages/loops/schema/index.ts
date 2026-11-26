export const LoopsSchema = {
	version: '1.0.0',
	// No stored entities: every operation answers synchronously and the reads
	// (contacts, properties, lists, suppression) are cheap enough to call live.
	entities: {},
} as const;
