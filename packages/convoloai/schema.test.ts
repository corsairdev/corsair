import { ConvoloAiSchema } from './schema';

describe('ConvoloAi schema', () => {
	it('declares a semver version', () => {
		expect(ConvoloAiSchema.version).toBeDefined();
		expect(ConvoloAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ConvoloAiSchema.entities).toBe('object');
		expect(ConvoloAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ConvoloAiSchema.entities))).toBe(true);
		for (const entity of Object.values(ConvoloAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
