import { DevinMcpSchema } from './schema';

describe('DevinMcp schema', () => {
	it('declares a semver version', () => {
		expect(DevinMcpSchema.version).toBeDefined();
		expect(DevinMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DevinMcpSchema.entities).toBe('object');
		expect(DevinMcpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DevinMcpSchema.entities))).toBe(true);
		for (const entity of Object.values(DevinMcpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
