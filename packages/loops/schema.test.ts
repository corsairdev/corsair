import { LoopsSchema } from './schema';

describe('Loops schema', () => {
	it('declares a semver version', () => {
		expect(LoopsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities, because every operation answers synchronously', () => {
		// Storing a copy of contacts would duplicate data the API serves live,
		// and no operation here needs a local cache to work.
		expect(Array.isArray(LoopsSchema.entities)).toBe(false);
		expect(LoopsSchema.entities).toEqual({});
	});
});
