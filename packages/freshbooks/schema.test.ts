import { FreshBooksSchema } from './schema';

describe('FreshBooks schema', () => {
	it('declares a semver version', () => {
		expect(FreshBooksSchema.version).toBeDefined();
		expect(FreshBooksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because a sync has nothing to add: every read is a direct API call and the plugin holds no cached copies', () => {
		expect(typeof FreshBooksSchema.entities).toBe('object');
		expect(FreshBooksSchema.entities).not.toBeNull();
		expect(Array.isArray(FreshBooksSchema.entities)).toBe(false);
		expect(Object.keys(FreshBooksSchema.entities)).toEqual([]);
	});
});
