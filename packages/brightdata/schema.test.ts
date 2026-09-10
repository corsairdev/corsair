import { BrightDataSchema } from './schema';

describe('BrightData schema', () => {
	it('declares a semver version', () => {
		expect(BrightDataSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official REST entities', () => {
		expect(Object.keys(BrightDataSchema.entities).sort()).toEqual([
			'cities',
			'countries',
			'datasets',
			'serpResults',
			'snapshotProgress',
			'snapshotRefs',
			'snapshotResults',
			'unlockerResults',
			'zones',
		]);
	});
});
