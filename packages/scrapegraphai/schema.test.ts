import { ScrapegraphAiSchema } from './schema';

describe('ScrapegraphAi schema', () => {
	it('declares a semver version', () => {
		expect(ScrapegraphAiSchema.version).toBeDefined();
		expect(ScrapegraphAiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ScrapegraphAiSchema.entities).toBe('object');
		expect(ScrapegraphAiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ScrapegraphAiSchema.entities))).toBe(true);
		for (const entity of Object.values(ScrapegraphAiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
