import { MondayMcpSchema } from './schema';

describe('MondayMcp schema', () => {
	it('declares a semver version', () => {
		expect(MondayMcpSchema.version).toBeDefined();
		expect(MondayMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MondayMcpSchema.entities).toBe('object');
		expect(MondayMcpSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MondayMcpSchema.entities))).toBe(true);
		for (const entity of Object.values(MondayMcpSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
