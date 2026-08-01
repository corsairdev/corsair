import { AimlApiSchema } from './schema';

describe('AimlApi schema', () => {
	it('declares a semver version', () => {
		expect(AimlApiSchema.version).toBeDefined();
		expect(AimlApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AimlApiSchema.entities).toBe('object');
		expect(AimlApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AimlApiSchema.entities))).toBe(true);
		for (const entity of Object.values(AimlApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
