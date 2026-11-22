// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { ParadymSchema } from './schema';

describe('ParadymSchema', () => {
	it('declares a semver version', () => {
		expect(ParadymSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because wallets and sessions are read live and webhook events carry ids the caller resolves', () => {
		expect(Array.isArray(ParadymSchema.entities)).toBe(false);
		expect(ParadymSchema.entities).toEqual({});
	});
});
