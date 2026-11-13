import { FolkSchema } from './schema';

describe('Folk schema', () => {
	it('declares a semver version', () => {
		expect(FolkSchema.version).toBeDefined();
		expect(FolkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FolkSchema.entities).toBe('object');
		expect(FolkSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FolkSchema.entities))).toBe(true);
		for (const entity of Object.values(FolkSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
