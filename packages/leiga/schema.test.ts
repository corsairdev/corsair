import { LeigaSchema } from './schema';

describe('Leiga schema', () => {
	it('declares a semver version', () => {
		expect(LeigaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities, because this plugin is read-only', () => {
		// A sync would store a copy of data the provider already serves, and
		// nothing here writes back, so entities stay empty.
		expect(Array.isArray(LeigaSchema.entities)).toBe(false);
		expect(Object.keys(LeigaSchema.entities)).toHaveLength(0);
	});
});
