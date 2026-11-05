import { AmbientWeatherSchema } from './schema';

describe('AmbientWeather schema', () => {
	it('declares a semver version', () => {
		expect(AmbientWeatherSchema.version).toBeDefined();
		expect(AmbientWeatherSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares devices and readings entities from Ambient Weather docs', () => {
		expect(Object.keys(AmbientWeatherSchema.entities).sort()).toEqual([
			'devices',
			'readings',
		]);
		for (const entity of Object.values(AmbientWeatherSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
