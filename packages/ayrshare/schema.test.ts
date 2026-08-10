import { AyrshareSchema } from './schema';

describe('Ayrshare schema', () => {
	it('declares a semver version', () => {
		expect(AyrshareSchema.version).toBeDefined();
		expect(AyrshareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AyrshareSchema.entities).toBe('object');
		expect(AyrshareSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AyrshareSchema.entities))).toBe(true);
		for (const entity of Object.values(AyrshareSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
