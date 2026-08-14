import { OpenrouterSchema } from './schema';

describe('Openrouter schema', () => {
	it('declares a semver version', () => {
		expect(OpenrouterSchema.version).toBeDefined();
		expect(OpenrouterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(OpenrouterSchema.entities).toEqual({});
	});
});
