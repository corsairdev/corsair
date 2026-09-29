import { ArynSchema } from './schema';

describe('Aryn schema', () => {
	it('declares a semver version', () => {
		expect(ArynSchema.version).toBeDefined();
		expect(ArynSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(ArynSchema.entities).toEqual({});
	});
});
