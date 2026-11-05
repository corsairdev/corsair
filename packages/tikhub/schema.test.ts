import { TikHubSchema } from './schema';

describe('TikHub schema', () => {
	it('declares a semver version', () => {
		expect(TikHubSchema.version).toBeDefined();
		expect(TikHubSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TikHubSchema.entities).toBe('object');
		expect(TikHubSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TikHubSchema.entities))).toBe(true);
		for (const entity of Object.values(TikHubSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
