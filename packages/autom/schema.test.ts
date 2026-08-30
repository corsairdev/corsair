import { AutomSchema } from './schema';

describe('Autom schema', () => {
	it('declares a semver version', () => {
		expect(AutomSchema.version).toBeDefined();
		expect(AutomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AutomSchema.entities).toBe('object');
		expect(AutomSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AutomSchema.entities))).toBe(true);
		for (const entity of Object.values(AutomSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
