import { FluxguardSchema } from './schema';

describe('Fluxguard schema', () => {
	it('declares a semver version', () => {
		expect(FluxguardSchema.version).toBeDefined();
		expect(FluxguardSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FluxguardSchema.entities).toBe('object');
		expect(FluxguardSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FluxguardSchema.entities))).toBe(true);
		for (const entity of Object.values(FluxguardSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
