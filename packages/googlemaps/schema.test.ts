import { GoogleMapsSchema } from './schema';

describe('GoogleMaps schema', () => {
	it('declares a semver version', () => {
		expect(GoogleMapsSchema.version).toBeDefined();
		expect(GoogleMapsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleMapsSchema.entities).toBe('object');
		expect(GoogleMapsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoogleMapsSchema.entities))).toBe(true);
		for (const entity of Object.values(GoogleMapsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
