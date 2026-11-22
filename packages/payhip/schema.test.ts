// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PayhipSchema } from './schema';

describe('PayhipSchema', () => {
	it('declares a semver version', () => {
		expect(PayhipSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because coupons and license keys are read live', () => {
		expect(Array.isArray(PayhipSchema.entities)).toBe(false);
		expect(PayhipSchema.entities).toEqual({});
	});
});
