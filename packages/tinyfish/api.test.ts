import { makeTinyFishRequest } from './client';
import { SearchUsageResponseSchema, WalletSchema } from './endpoints/types';

const TEST_API_KEY = process.env.TINYFISH_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('TinyFish live API', () => {
	jest.setTimeout(60_000);

	it('returns paged search usage for the account', async () => {
		const usage = SearchUsageResponseSchema.parse(
			await makeTinyFishRequest('search', '/usage', TEST_API_KEY, {
				query: { limit: 1 },
			}),
		);
		expect(usage.limit).toBe(1);
		expect(usage.items.length).toBeLessThanOrEqual(1);
		if (usage.has_more) {
			expect(usage.total).toBeGreaterThan(usage.items.length);
		}
	});

	it('returns the wallet balance in USD', async () => {
		const wallet = WalletSchema.parse(
			await makeTinyFishRequest('agent', '/v1/wallet', TEST_API_KEY),
		);
		expect(wallet.currency).toBe('USD');
		expect(Number.isFinite(Number(wallet.available_balance))).toBe(true);
	});
});
