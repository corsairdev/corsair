import { KitSchema } from './schema';

describe('Kit schema', () => {
	it('declares a semver version', () => {
		expect(KitSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads Kit live', () => {
		expect(KitSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KitSchema.entities)).toBe(false);
	});
});
