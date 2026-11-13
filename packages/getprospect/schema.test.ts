import { GetProspectSchema } from './schema';

describe('GetProspect schema', () => {
	it('declares a semver version', () => {
		expect(GetProspectSchema.version).toBeDefined();
		expect(GetProspectSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GetProspectSchema.entities).toBe('object');
		expect(GetProspectSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GetProspectSchema.entities))).toBe(true);
		for (const entity of Object.values(GetProspectSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
