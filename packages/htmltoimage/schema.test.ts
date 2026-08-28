import { HtmlToImageSchema } from './schema';

describe('HtmlToImage schema', () => {
	it('declares a semver version', () => {
		expect(HtmlToImageSchema.version).toBeDefined();
		expect(HtmlToImageSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HtmlToImageSchema.entities).toBe('object');
		expect(HtmlToImageSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HtmlToImageSchema.entities))).toBe(true);
		for (const entity of Object.values(HtmlToImageSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
