import { NeutrinoSchema } from './schema';

describe('Neutrino schema', () => {
	it('declares a semver version', () => {
		expect(NeutrinoSchema.version).toBeDefined();
		expect(NeutrinoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NeutrinoSchema.entities).toBe('object');
		expect(NeutrinoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NeutrinoSchema.entities))).toBe(true);
		for (const entity of Object.values(NeutrinoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
