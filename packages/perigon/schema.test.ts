// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PerigonSchema } from './schema';

describe('PerigonSchema', () => {
	it('declares a semver version', () => {
		expect(PerigonSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because news records are read live and not synced', () => {
		expect(Array.isArray(PerigonSchema.entities)).toBe(false);
		expect(PerigonSchema.entities).toEqual({});
	});
});
