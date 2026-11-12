import { TaggunSchema } from './schema';

describe('Taggun schema', () => {
	it('declares a semver version', () => {
		expect(TaggunSchema.version).toBeDefined();
		expect(TaggunSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities, because Taggun is synchronous', () => {
		// Asserted on the value itself: Object.keys(entities) is always an array,
		// so testing that can never fail.
		expect(Array.isArray(TaggunSchema.entities)).toBe(false);
		expect(TaggunSchema.entities).toEqual({});
	});
});
