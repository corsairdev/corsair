import { KommoSchema } from './schema';

describe('Kommo schema', () => {
	it('declares a semver version', () => {
		expect(KommoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads Kommo live', () => {
		expect(KommoSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KommoSchema.entities)).toBe(false);
	});
});
