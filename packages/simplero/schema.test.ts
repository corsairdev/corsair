import { SimpleroSchema } from './schema';

describe('Simplero schema', () => {
	it('declares a semver version', () => {
		expect(SimpleroSchema.version).toBeDefined();
		expect(SimpleroSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SimpleroSchema.entities).toEqual({});
	});
});
