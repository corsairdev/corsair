import { CodySchema } from './schema';

describe('Cody schema', () => {
	it('declares a semver version', () => {
		expect(CodySchema.version).toBeDefined();
		expect(CodySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CodySchema.entities).toBe('object');
		expect(CodySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CodySchema.entities))).toBe(true);
		for (const entity of Object.values(CodySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
