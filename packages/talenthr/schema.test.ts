import { TalentHRSchema } from './schema';

describe('TalentHR schema', () => {
	it('declares a semver version', () => {
		expect(TalentHRSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares entities as an empty object, because the plugin stores nothing', () => {
		// Entities are a map, not a list, so Object.keys is always an array and
		// can never fail this check; the value itself is what matters.
		expect(Array.isArray(TalentHRSchema.entities)).toBe(false);
		expect(TalentHRSchema.entities).toEqual({});
	});
});
