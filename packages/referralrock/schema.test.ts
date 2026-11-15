import { ReferralrockSchema } from './schema';

describe('Referralrock schema', () => {
	it('declares a semver version', () => {
		expect(ReferralrockSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Referral Rock records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(ReferralrockSchema.entities)).toBe(false);
		expect(ReferralrockSchema.entities).toEqual({});
	});
});
