import { BugherdSchema } from './schema';

describe('Bugherd schema', () => {
	it('declares a semver version', () => {
		expect(BugherdSchema.version).toBeDefined();
		expect(BugherdSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BugherdSchema.entities).toBe('object');
		expect(BugherdSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BugherdSchema.entities))).toBe(true);
		for (const entity of Object.values(BugherdSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
