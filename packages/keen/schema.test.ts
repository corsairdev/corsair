import { KeenSchema } from './schema';

describe('Keen schema', () => {
	it('declares a semver version', () => {
		expect(KeenSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads Keen live', () => {
		expect(KeenSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KeenSchema.entities)).toBe(false);
	});
});
