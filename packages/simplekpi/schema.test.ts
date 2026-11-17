import { SimplekpiSchema } from './schema';

describe('Simplekpi schema', () => {
	it('declares a semver version', () => {
		expect(SimplekpiSchema.version).toBeDefined();
		expect(SimplekpiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SimplekpiSchema.entities).toEqual({});
	});
});
