import { SignpathSchema } from './schema';

describe('Signpath schema', () => {
	it('declares a semver version', () => {
		expect(SignpathSchema.version).toBeDefined();
		expect(SignpathSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SignpathSchema.entities).toEqual({});
	});
});
