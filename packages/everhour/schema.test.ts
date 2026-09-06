import { EverhourSchema } from './schema';

describe('Everhour schema', () => {
	it('declares a semver version', () => {
		expect(EverhourSchema.version).toBeDefined();
		expect(EverhourSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EverhourSchema.entities).toBe('object');
		expect(EverhourSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EverhourSchema.entities))).toBe(true);
		for (const entity of Object.values(EverhourSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
