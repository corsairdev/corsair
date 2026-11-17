import { SuitedashSchema } from './schema';

describe('Suitedash schema', () => {
	it('declares a semver version', () => {
		expect(SuitedashSchema.version).toBeDefined();
		expect(SuitedashSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SuitedashSchema.entities).toEqual({});
	});
});
