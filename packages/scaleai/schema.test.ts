import { ScaleAiSchema } from './schema';

describe('ScaleAi schema', () => {
	it('declares a semver version', () => {
		expect(ScaleAiSchema.version).toBeDefined();
		expect(ScaleAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ScaleAiSchema.entities).toBe('object');
		expect(ScaleAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ScaleAiSchema.entities))).toBe(true);
		for (const entity of Object.values(ScaleAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
