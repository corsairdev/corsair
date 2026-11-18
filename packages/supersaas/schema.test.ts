import { SupersaasSchema } from './schema';

describe('Supersaas schema', () => {
	it('declares a semver version', () => {
		expect(SupersaasSchema.version).toBeDefined();
		expect(SupersaasSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SupersaasSchema.entities).toEqual({});
	});
});
