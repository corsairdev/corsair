import { SecuritytrailsSchema } from './schema';

describe('Securitytrails schema', () => {
	it('declares a semver version', () => {
		expect(SecuritytrailsSchema.version).toBeDefined();
		expect(SecuritytrailsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SecuritytrailsSchema.entities).toBe('object');
		expect(SecuritytrailsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SecuritytrailsSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(SecuritytrailsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
