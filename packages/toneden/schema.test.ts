import { ToneDenSchema } from './schema';

describe('ToneDen schema', () => {
	it('declares a semver version', () => {
		expect(ToneDenSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Links and campaigns are answered live; a local copy would go stale
		// against the ad platform the moment a campaign changed.
		expect(Array.isArray(ToneDenSchema.entities)).toBe(false);
		expect(ToneDenSchema.entities).toEqual({});
	});
});
