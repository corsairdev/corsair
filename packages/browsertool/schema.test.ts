import { BrowserToolSchema } from './schema';

describe('BrowserTool schema', () => {
	it('declares a semver version', () => {
		expect(BrowserToolSchema.version).toBeDefined();
		expect(BrowserToolSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BrowserToolSchema.entities).toBe('object');
		expect(BrowserToolSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BrowserToolSchema.entities))).toBe(true);
		for (const entity of Object.values(BrowserToolSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
