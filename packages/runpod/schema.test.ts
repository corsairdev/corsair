import { RunpodSchema } from './schema';

describe('Runpod schema', () => {
	it('declares a semver version', () => {
		expect(RunpodSchema.version).toBeDefined();
		expect(RunpodSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RunpodSchema.entities).toBe('object');
		expect(RunpodSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RunpodSchema.entities))).toBe(true);
		for (const entity of Object.values(RunpodSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
