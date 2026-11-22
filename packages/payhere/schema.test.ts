// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PayhereSchema } from './schema';

describe('PayhereSchema', () => {
	it('declares a semver version', () => {
		expect(PayhereSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because customers and payments are read live and webhook deliveries carry the record', () => {
		expect(Array.isArray(PayhereSchema.entities)).toBe(false);
		expect(PayhereSchema.entities).toEqual({});
	});
});
