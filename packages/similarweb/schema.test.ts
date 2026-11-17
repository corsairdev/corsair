import { SimilarwebSchema } from './schema';

describe('Similarweb schema', () => {
	it('declares a semver version', () => {
		expect(SimilarwebSchema.version).toBeDefined();
		expect(SimilarwebSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SimilarwebSchema.entities).toEqual({});
	});
});
