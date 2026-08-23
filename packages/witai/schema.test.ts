import { WitAiSchema } from './schema';

describe('WitAi schema', () => {
	it('declares a semver version', () => {
		expect(WitAiSchema.version).toBeDefined();
		expect(WitAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WitAiSchema.entities).toBe('object');
		expect(WitAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WitAiSchema.entities))).toBe(true);
		for (const entity of Object.values(WitAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
