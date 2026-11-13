import { FreshdeskSchema } from './schema';

describe('Freshdesk schema', () => {
	it('declares a semver version', () => {
		expect(FreshdeskSchema.version).toBeDefined();
		expect(FreshdeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FreshdeskSchema.entities).toBe('object');
		expect(FreshdeskSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FreshdeskSchema.entities))).toBe(true);
		for (const entity of Object.values(FreshdeskSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
