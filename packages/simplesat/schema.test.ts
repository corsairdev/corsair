import { SimplesatSchema } from './schema';

describe('Simplesat schema', () => {
	it('declares a semver version', () => {
		expect(SimplesatSchema.version).toBeDefined();
		expect(SimplesatSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SimplesatSchema.entities).toEqual({});
	});
});
