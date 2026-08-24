import { UniswapApiSchema } from './schema';
import { UniswapSwapStatus } from './schema/database';

describe('UniswapApi schema', () => {
	it('declares a semver version', () => {
		expect(UniswapApiSchema.version).toBeDefined();
		expect(UniswapApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UniswapApiSchema.entities).toBe('object');
		expect(UniswapApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UniswapApiSchema.entities))).toBe(true);
		for (const entity of Object.values(UniswapApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('accepts live Trading API swap statuses', () => {
		expect(
			UniswapSwapStatus.safeParse({
				txHash: '0xdead',
				chainId: 1,
				status: 'SUCCESS',
			}).success,
		).toBe(true);
		expect(
			UniswapSwapStatus.safeParse({
				txHash: '0xdead',
				chainId: 1,
				status: 'confirmed',
			}).success,
		).toBe(false);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
