// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PexelsSchema } from './schema';

describe('PexelsSchema', () => {
	it('declares a semver version', () => {
		expect(PexelsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because photos and videos are read live from the index', () => {
		expect(Array.isArray(PexelsSchema.entities)).toBe(false);
		expect(PexelsSchema.entities).toEqual({});
	});
});
