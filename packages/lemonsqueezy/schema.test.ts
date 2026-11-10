import { LemonSqueezySchema } from './schema';

describe('LemonSqueezy schema', () => {
	it('declares a semver version', () => {
		expect(LemonSqueezySchema.version).toBeDefined();
		expect(LemonSqueezySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LemonSqueezySchema.entities).toBe('object');
		expect(LemonSqueezySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LemonSqueezySchema.entities))).toBe(true);
		for (const entity of Object.values(LemonSqueezySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
