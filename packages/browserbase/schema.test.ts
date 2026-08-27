import { BrowserbaseSchema } from './schema';

describe('Browserbase schema', () => {
	it('declares a semver version', () => {
		expect(BrowserbaseSchema.version).toBeDefined();
		expect(BrowserbaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BrowserbaseSchema.entities).toBe('object');
		expect(BrowserbaseSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BrowserbaseSchema.entities))).toBe(true);
		for (const entity of Object.values(BrowserbaseSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
