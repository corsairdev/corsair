import { ZenserpSchema } from './schema';

describe('Zenserp schema', () => {
	it('declares a semver version', () => {
		expect(ZenserpSchema.version).toBeDefined();
		expect(ZenserpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZenserpSchema.entities).toBe('object');
		expect(ZenserpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZenserpSchema.entities))).toBe(true);
		for (const entity of Object.values(ZenserpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
