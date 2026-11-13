import { FireberrySchema } from './schema';

describe('Fireberry schema', () => {
	it('declares a semver version', () => {
		expect(FireberrySchema.version).toBeDefined();
		expect(FireberrySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FireberrySchema.entities).toBe('object');
		expect(FireberrySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FireberrySchema.entities))).toBe(true);
		for (const entity of Object.values(FireberrySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
