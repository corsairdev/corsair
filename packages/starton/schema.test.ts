import { StartonSchema } from './schema';

describe('Starton schema', () => {
	it('declares a semver version', () => {
		expect(StartonSchema.version).toBeDefined();
		expect(StartonSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof StartonSchema.entities).toBe('object');
		expect(StartonSchema.entities).not.toBeNull();
		expect(Object.keys(StartonSchema.entities).sort()).toEqual([
			'smartContracts',
			'transactions',
			'wallets',
		]);
		for (const entity of Object.values(StartonSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
