import { SignwellSchema } from './schema';

describe('Signwell schema', () => {
	it('declares a semver version', () => {
		expect(SignwellSchema.version).toBeDefined();
		expect(SignwellSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SignwellSchema.entities).toEqual({});
	});
});
