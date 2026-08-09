import { OpenrouterSchema } from './schema';

describe('Openrouter schema', () => {
	it('declares a semver version', () => {
		expect(OpenrouterSchema.version).toBeDefined();
		expect(OpenrouterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof OpenrouterSchema.entities).toBe('object');
		expect(OpenrouterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(OpenrouterSchema.entities))).toBe(true);
		for (const entity of Object.values(OpenrouterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
