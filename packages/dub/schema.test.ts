import { DubSchema } from './schema';

describe('Dub schema', () => {
	it('declares a semver version', () => {
		expect(DubSchema.version).toBeDefined();
		expect(DubSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: Dub has no sync-worthy list to mirror locally', () => {
		expect(DubSchema.entities).toEqual({});
		expect(Array.isArray(DubSchema.entities)).toBe(false);
	});
});
