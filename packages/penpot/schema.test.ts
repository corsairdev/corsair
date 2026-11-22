// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PenpotSchema } from './schema';

describe('PenpotSchema', () => {
	it('declares a semver version', () => {
		expect(PenpotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because teams and files are read live and webhook deliveries carry the record', () => {
		expect(Array.isArray(PenpotSchema.entities)).toBe(false);
		expect(PenpotSchema.entities).toEqual({});
	});
});
