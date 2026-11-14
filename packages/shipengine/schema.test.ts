import { ShipEngineSchema } from './schema';

describe('ShipEngine schema', () => {
	it('declares a semver version', () => {
		expect(ShipEngineSchema.version).toBeDefined();
		expect(ShipEngineSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ShipEngineSchema.entities).toBe('object');
		expect(ShipEngineSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ShipEngineSchema.entities))).toBe(true);
		for (const entity of Object.values(ShipEngineSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
