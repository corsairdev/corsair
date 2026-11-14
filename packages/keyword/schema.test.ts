import { KeywordSchema } from './schema';

describe('Keyword schema', () => {
	it('declares a semver version', () => {
		expect(KeywordSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads Keyword live', () => {
		expect(KeywordSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KeywordSchema.entities)).toBe(false);
	});
});
