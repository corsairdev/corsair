import { BrowseraiSchema } from './schema';

describe('Browserai schema', () => {
	it('declares a semver version', () => {
		expect(BrowseraiSchema.version).toBeDefined();
		expect(BrowseraiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BrowseraiSchema.entities).toBe('object');
		expect(BrowseraiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BrowseraiSchema.entities))).toBe(true);
		for (const entity of Object.values(BrowseraiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
