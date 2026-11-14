import { KadoaSchema } from './schema';

describe('Kadoa schema', () => {
	it('declares a semver version', () => {
		expect(KadoaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads Kadoa live', () => {
		expect(KadoaSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KadoaSchema.entities)).toBe(false);
	});
});
