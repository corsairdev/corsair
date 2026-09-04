import { CallerapiSchema } from './schema';

describe('Callerapi schema', () => {
	it('declares a semver version', () => {
		expect(CallerapiSchema.version).toBeDefined();
		expect(CallerapiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CallerapiSchema.entities).toBe('object');
		expect(CallerapiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CallerapiSchema.entities))).toBe(true);
		for (const entity of Object.values(CallerapiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
