import { AblySchema } from './schema';

describe('Ably schema', () => {
	it('declares a semver version', () => {
		expect(AblySchema.version).toBeDefined();
		expect(AblySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AblySchema.entities).toBe('object');
		expect(AblySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AblySchema.entities))).toBe(true);
		for (const entity of Object.values(AblySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
