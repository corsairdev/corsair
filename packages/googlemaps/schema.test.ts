import { GoogleMapsSchema } from './schema';

describe('GoogleMaps schema', () => {
	it('declares a semver version', () => {
		expect(GoogleMapsSchema.version).toBeDefined();
		expect(GoogleMapsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(GoogleMapsSchema.entities).toEqual({});
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
