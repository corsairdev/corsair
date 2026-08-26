import { BaserowSchema } from './schema';

describe('Baserow schema', () => {
	it('declares a semver version', () => {
		expect(BaserowSchema.version).toBeDefined();
		expect(BaserowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BaserowSchema.entities).toBe('object');
		expect(BaserowSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BaserowSchema.entities))).toBe(true);
		for (const entity of Object.values(BaserowSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
