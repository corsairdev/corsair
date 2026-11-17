import { TruveraSchema } from './schema';

describe('Truvera schema', () => {
	it('declares a semver version', () => {
		expect(TruveraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Credential metadata and revocation status are read live, because a
		// locally cached revocation status would be able to say valid for a
		// credential that had just been revoked.
		expect(Array.isArray(TruveraSchema.entities)).toBe(false);
		expect(TruveraSchema.entities).toEqual({});
	});
});
