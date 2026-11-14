import { KontentaiSchema } from './schema';

describe('Kontent.ai schema', () => {
	it('declares a semver version', () => {
		expect(KontentaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads the Delivery API live', () => {
		expect(KontentaiSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KontentaiSchema.entities)).toBe(false);
	});
});
