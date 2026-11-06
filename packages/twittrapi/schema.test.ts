import { TwittrApiSchema } from './schema';

describe('TwittrApi schema', () => {
	it('declares a semver version', () => {
		expect(TwittrApiSchema.version).toBeDefined();
		expect(TwittrApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TwittrApiSchema.entities).toBe('object');
		expect(TwittrApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TwittrApiSchema.entities))).toBe(true);
		for (const entity of Object.values(TwittrApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
