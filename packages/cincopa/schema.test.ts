import { CincopaSchema } from './schema';

describe('Cincopa schema', () => {
	it('declares a semver version', () => {
		expect(CincopaSchema.version).toBeDefined();
		expect(CincopaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all labeled database models', () => {
		expect(typeof CincopaSchema.entities).toBe('object');
		expect(CincopaSchema.entities).not.toBeNull();
		expect(Object.keys(CincopaSchema.entities).sort()).toEqual([
			'account',
			'assets',
			'galleries',
			'uploadStatus',
		]);
		for (const entity of Object.values(CincopaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
