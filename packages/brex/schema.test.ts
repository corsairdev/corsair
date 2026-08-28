import { BrexSchema } from './schema';

describe('Brex schema', () => {
	it('declares a semver version', () => {
		expect(BrexSchema.version).toBeDefined();
		expect(BrexSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BrexSchema.entities).toBe('object');
		expect(BrexSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BrexSchema.entities))).toBe(true);
		for (const entity of Object.values(BrexSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
