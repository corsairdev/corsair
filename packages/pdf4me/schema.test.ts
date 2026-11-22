// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { Pdf4meSchema } from './schema';

describe('Pdf4meSchema', () => {
	it('declares a semver version', () => {
		expect(Pdf4meSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because processing results are returned live and jobs are polled by id', () => {
		expect(Array.isArray(Pdf4meSchema.entities)).toBe(false);
		expect(Pdf4meSchema.entities).toEqual({});
	});
});
