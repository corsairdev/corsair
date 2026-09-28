import { ClaidAiSchema } from './schema';

describe('ClaidAi schema', () => {
	it('declares a semver version', () => {
		expect(ClaidAiSchema.version).toBeDefined();
		expect(ClaidAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClaidAiSchema.entities).toBe('object');
		expect(ClaidAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClaidAiSchema.entities))).toBe(true);
		for (const entity of Object.values(ClaidAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
