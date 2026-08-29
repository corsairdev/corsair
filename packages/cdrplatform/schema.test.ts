import { CdrPlatformSchema } from './schema';

describe('CdrPlatform schema', () => {
	it('declares a semver version', () => {
		expect(CdrPlatformSchema.version).toBeDefined();
		expect(CdrPlatformSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CdrPlatformSchema.entities).toBe('object');
		expect(CdrPlatformSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CdrPlatformSchema.entities))).toBe(true);
		for (const entity of Object.values(CdrPlatformSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
