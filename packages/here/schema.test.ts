import { HereSchema } from './schema';
import { HerePlace, HereRoute } from './schema/database';

describe('HERE schema', () => {
	it('declares a semver version', () => {
		expect(HereSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares labeled official entities', () => {
		expect(HereSchema.entities.places).toBe(HerePlace);
		expect(HereSchema.entities.routes).toBe(HereRoute);
		expect(Object.keys(HereSchema.entities).length).toBeGreaterThan(0);
	});
});
