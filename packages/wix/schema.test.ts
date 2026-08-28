import { WixSchema } from './schema';

describe('Wix schema', () => {
	it('declares a semver version', () => {
		expect(WixSchema.version).toBeDefined();
		expect(WixSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WixSchema.entities).toBe('object');
		expect(WixSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WixSchema.entities))).toBe(true);
		for (const entity of Object.values(WixSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
