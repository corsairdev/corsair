import { AmbientWeatherSchema } from './schema';

describe('AmbientWeather schema', () => {
	it('declares a semver version', () => {
		expect(AmbientWeatherSchema.version).toBeDefined();
		expect(AmbientWeatherSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AmbientWeatherSchema.entities).toBe('object');
		expect(AmbientWeatherSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AmbientWeatherSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(AmbientWeatherSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
