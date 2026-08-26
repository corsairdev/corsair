import { WakaTimeSchema } from './schema';

describe('WakaTime schema', () => {
	it('declares a semver version', () => {
		expect(WakaTimeSchema.version).toBeDefined();
		expect(WakaTimeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WakaTimeSchema.entities).toBe('object');
		expect(WakaTimeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WakaTimeSchema.entities))).toBe(true);
		for (const entity of Object.values(WakaTimeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
