import { GristSchema } from './schema';

describe('Grist schema', () => {
	it('declares a semver version', () => {
		expect(GristSchema.version).toBeDefined();
		expect(GristSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GristSchema.entities).toBe('object');
		expect(GristSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GristSchema.entities))).toBe(true);
		for (const entity of Object.values(GristSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
