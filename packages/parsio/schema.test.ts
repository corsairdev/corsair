// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { ParsioSchema } from './schema';

describe('ParsioSchema', () => {
	it('declares a semver version', () => {
		expect(ParsioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because documents are read live and webhook deliveries carry the full document', () => {
		expect(Array.isArray(ParsioSchema.entities)).toBe(false);
		expect(ParsioSchema.entities).toEqual({});
	});
});
