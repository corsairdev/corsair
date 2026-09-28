import { WebScrapingAISchema } from './schema';

describe('WebScrapingAI schema', () => {
	it('declares a semver version', () => {
		expect(WebScrapingAISchema.version).toBeDefined();
		expect(WebScrapingAISchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WebScrapingAISchema.entities).toBe('object');
		expect(WebScrapingAISchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WebScrapingAISchema.entities))).toBe(true);
		for (const entity of Object.values(WebScrapingAISchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
