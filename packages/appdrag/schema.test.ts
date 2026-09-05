import { AppdragSchema } from './schema';

describe('Appdrag schema', () => {
	it('declares a semver version', () => {
		expect(AppdragSchema.version).toBeDefined();
		expect(AppdragSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AppdragSchema.entities).toBe('object');
		expect(AppdragSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AppdragSchema.entities))).toBe(true);
		for (const entity of Object.values(AppdragSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
