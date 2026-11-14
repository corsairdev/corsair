import { KofiSchema } from './schema';

describe('Ko-fi schema', () => {
	it('declares a semver version', () => {
		expect(KofiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: Ko-fi has no API to read back from', () => {
		expect(KofiSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KofiSchema.entities)).toBe(false);
	});
});
