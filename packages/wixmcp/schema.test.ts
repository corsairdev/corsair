import { WixMcpSchema } from './schema';

describe('WixMcp schema', () => {
	it('declares a semver version', () => {
		expect(WixMcpSchema.version).toBeDefined();
		expect(WixMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WixMcpSchema.entities).toBe('object');
		expect(WixMcpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WixMcpSchema.entities))).toBe(true);
		for (const entity of Object.values(WixMcpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
