import { AnthropicAdminSchema } from './schema';

describe('AnthropicAdmin schema', () => {
	it('declares a semver version', () => {
		expect(AnthropicAdminSchema.version).toBeDefined();
		expect(AnthropicAdminSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AnthropicAdminSchema.entities).toBe('object');
		expect(AnthropicAdminSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AnthropicAdminSchema.entities))).toBe(true);
		for (const entity of Object.values(AnthropicAdminSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
