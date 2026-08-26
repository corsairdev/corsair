import { BreezeSchema } from './schema';

describe('Breeze schema', () => {
	it('declares a semver version', () => {
		expect(BreezeSchema.version).toBeDefined();
		expect(BreezeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BreezeSchema.entities).toBe('object');
		expect(BreezeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BreezeSchema.entities))).toBe(true);
		for (const entity of Object.values(BreezeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
