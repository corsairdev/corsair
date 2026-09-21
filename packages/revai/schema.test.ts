import { RevAISchema } from './schema';

describe('RevAI schema', () => {
	it('declares a semver version', () => {
		expect(RevAISchema.version).toBeDefined();
		expect(RevAISchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RevAISchema.entities).toBe('object');
		expect(RevAISchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RevAISchema.entities))).toBe(true);
		for (const entity of Object.values(RevAISchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
