import { CertSpotterSchema } from './schema';

describe('Cert Spotter schema', () => {
	it('declares a semver version', () => {
		expect(CertSpotterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Certificate searches are answered live from the CT index; caching
		// certificates locally would let a revocation go unnoticed.
		expect(Array.isArray(CertSpotterSchema.entities)).toBe(false);
		expect(CertSpotterSchema.entities).toEqual({});
	});
});
