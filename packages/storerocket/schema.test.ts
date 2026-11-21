import { StorerocketSchema } from './schema';

describe('StorerocketSchema', () => {
	it('declares a semver version', () => {
		expect(StorerocketSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because locations and rules are read live and the API stays the source of truth', () => {
		expect(Array.isArray(StorerocketSchema.entities)).toBe(false);
		expect(StorerocketSchema.entities).toEqual({});
	});
});
