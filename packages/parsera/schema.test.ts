// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { ParseraSchema } from './schema';

describe('ParseraSchema', () => {
	it('declares a semver version', () => {
		expect(ParseraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because extractions are returned live and scraper runs are pollable by id', () => {
		expect(Array.isArray(ParseraSchema.entities)).toBe(false);
		expect(ParseraSchema.entities).toEqual({});
	});
});
