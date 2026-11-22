// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { PandadocSchema } from './schema';

describe('PandadocSchema', () => {
	it('declares a semver version', () => {
		expect(PandadocSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because documents and contacts are read live and webhook data carries ids the caller resolves', () => {
		expect(Array.isArray(PandadocSchema.entities)).toBe(false);
		expect(PandadocSchema.entities).toEqual({});
	});
});
