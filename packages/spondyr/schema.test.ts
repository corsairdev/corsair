import { SpondyrSchema } from './schema';

describe('Spondyr schema', () => {
	it('declares a semver version', () => {
		expect(SpondyrSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Every read is answered live; nothing is cached locally, so there is no
		// entity to sync and none to keep current.
		expect(Array.isArray(SpondyrSchema.entities)).toBe(false);
		expect(SpondyrSchema.entities).toEqual({});
	});
});
