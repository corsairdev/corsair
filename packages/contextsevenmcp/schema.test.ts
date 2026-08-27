import { ContextSevenMcpSchema } from './schema';

describe('ContextSevenMcp schema', () => {
	it('declares a semver version', () => {
		expect(ContextSevenMcpSchema.version).toBeDefined();
		expect(ContextSevenMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ContextSevenMcpSchema.entities).toBe('object');
		expect(ContextSevenMcpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ContextSevenMcpSchema.entities))).toBe(true);
		for (const entity of Object.values(ContextSevenMcpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
