import { KaggleSchema } from './schema';

describe('Kaggle schema', () => {
	it('declares a semver version', () => {
		expect(KaggleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares db schema entities aligned to Kaggle resources', () => {
		expect(Object.keys(KaggleSchema.entities).sort()).toEqual(
			['competitions', 'datasets', 'kernels', 'models'].sort(),
		);
	});
});
