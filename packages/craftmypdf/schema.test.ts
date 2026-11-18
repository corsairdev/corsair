import { CraftmypdfSchema } from './schema';

describe('Craftmypdf schema', () => {
	it('declares a semver version', () => {
		expect(CraftmypdfSchema.version).toBeDefined();
		expect(CraftmypdfSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because every read is live', () => {
		expect(typeof CraftmypdfSchema.entities).toBe('object');
		expect(CraftmypdfSchema.entities).not.toBeNull();
		// Asserting on the value, not on Object.keys: keys of {} is always an
		// array and could never fail this test.
		expect(Array.isArray(CraftmypdfSchema.entities)).toBe(false);
		expect(CraftmypdfSchema.entities).toEqual({});
	});
});
