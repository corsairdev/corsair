// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PersistiqSchema } from './schema';

describe('PersistiqSchema', () => {
	it('declares a semver version', () => {
		expect(PersistiqSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because leads are read live and events carry their own ids', () => {
		expect(Array.isArray(PersistiqSchema.entities)).toBe(false);
		expect(PersistiqSchema.entities).toEqual({});
	});
});
