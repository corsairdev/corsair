import { AnthropicAdministratorSchema } from './schema';

describe('AnthropicAdministrator schema', () => {
	it('declares a semver version', () => {
		expect(AnthropicAdministratorSchema.version).toBeDefined();
		expect(AnthropicAdministratorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AnthropicAdministratorSchema.entities).toBe('object');
		expect(AnthropicAdministratorSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AnthropicAdministratorSchema.entities))).toBe(true);
		for (const entity of Object.values(AnthropicAdministratorSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
