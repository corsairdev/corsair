import { BuildkiteSchema } from './schema';

describe('Buildkite schema', () => {
	it('declares a semver version', () => {
		expect(BuildkiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official REST entities', () => {
		expect(Object.keys(BuildkiteSchema.entities).sort()).toEqual([
			'accessTokens',
			'agents',
			'meta',
			'organizations',
			'users',
		]);
	});
});
