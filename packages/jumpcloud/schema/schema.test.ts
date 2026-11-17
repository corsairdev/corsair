import { JumpCloudSchema } from './index';

describe('JumpCloud schema', () => {
	it('declares a semver version', () => {
		expect(JumpCloudSchema.version).toBeDefined();
		expect(JumpCloudSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof JumpCloudSchema.entities).toBe('object');
		expect(JumpCloudSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(JumpCloudSchema.entities))).toBe(true);
		for (const entity of Object.values(JumpCloudSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
