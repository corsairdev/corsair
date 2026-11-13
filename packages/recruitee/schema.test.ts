import { RecruiteeSchema } from './schema';

describe('Recruitee schema', () => {
	it('declares a semver version', () => {
		expect(RecruiteeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Recruitee records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RecruiteeSchema.entities)).toBe(false);
		expect(RecruiteeSchema.entities).toEqual({});
	});
});
