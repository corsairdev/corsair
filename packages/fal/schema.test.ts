import { FalSchema } from './schema';

describe('Fal schema', () => {
	it('declares a semver version', () => {
		expect(FalSchema.version).toBeDefined();
		expect(FalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FalSchema.entities).toBe('object');
		expect(FalSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FalSchema.entities))).toBe(true);
		for (const entity of Object.values(FalSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
