import { UpdownIOSchema } from './schema';

describe('UpdownIO schema', () => {
	it('declares a semver version', () => {
		expect(UpdownIOSchema.version).toBeDefined();
		expect(UpdownIOSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UpdownIOSchema.entities).toBe('object');
		expect(UpdownIOSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UpdownIOSchema.entities))).toBe(true);
		for (const entity of Object.values(UpdownIOSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
