import { RepairshoprSchema } from './schema';

describe('Repairshopr schema', () => {
	it('declares a semver version', () => {
		expect(RepairshoprSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync RepairShopr records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RepairshoprSchema.entities)).toBe(false);
		expect(RepairshoprSchema.entities).toEqual({});
	});
});
