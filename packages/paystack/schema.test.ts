// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PaystackSchema } from './schema';

describe('PaystackSchema', () => {
	it('declares a semver version', () => {
		expect(PaystackSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because transactions and customers are read live and webhook deliveries carry the record', () => {
		expect(Array.isArray(PaystackSchema.entities)).toBe(false);
		expect(PaystackSchema.entities).toEqual({});
	});
});
