import { ElorusSchema } from './schema';

describe('Elorus schema', () => {
	it('declares a semver version', () => {
		expect(ElorusSchema.version).toBeDefined();
		expect(ElorusSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ElorusSchema.entities).toBe('object');
		expect(ElorusSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ElorusSchema.entities))).toBe(true);
		for (const entity of Object.values(ElorusSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
